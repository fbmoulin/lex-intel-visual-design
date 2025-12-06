/**
 * Centralized Logs Store
 * Lex Intel Visual Design - Desenvolvido por Lex Intelligentia
 *
 * In-memory log storage for debugging, monitoring, and real-time log viewing.
 * Features:
 * - Circular buffer with configurable max entries
 * - Log filtering by level, context, time range
 * - Log export for external services
 * - Memory-efficient storage with automatic cleanup
 */

import { createLogger } from "./logger";

type LogLevel = "debug" | "info" | "warn" | "error";

interface StoredLogEntry {
  id: string;
  timestamp: Date;
  level: LogLevel;
  context: string;
  message: string;
  data?: Record<string, unknown>;
  correlationId?: string;
  userId?: number;
  requestId?: string;
}

interface LogQueryOptions {
  level?: LogLevel | LogLevel[];
  context?: string | string[];
  startTime?: Date;
  endTime?: Date;
  correlationId?: string;
  userId?: number;
  search?: string;
  limit?: number;
  offset?: number;
}

interface LogStats {
  totalEntries: number;
  byLevel: Record<LogLevel, number>;
  byContext: Record<string, number>;
  oldestEntry: Date | null;
  newestEntry: Date | null;
  memoryUsageBytes: number;
}

interface LogsStoreConfig {
  maxEntries: number;
  cleanupIntervalMs: number;
  retentionMs: number;
}

const DEFAULT_CONFIG: LogsStoreConfig = {
  maxEntries: 10000,
  cleanupIntervalMs: 60_000, // 1 minute
  retentionMs: 24 * 60 * 60 * 1000, // 24 hours
};

const logger = createLogger("LogsStore");

class LogsStore {
  private logs: StoredLogEntry[] = [];
  private config: LogsStoreConfig;
  private cleanupInterval: ReturnType<typeof setInterval> | null = null;
  private idCounter = 0;

  constructor(config: Partial<LogsStoreConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.startCleanup();
  }

  /**
   * Add a new log entry to the store
   */
  add(entry: Omit<StoredLogEntry, "id" | "timestamp">): string {
    const id = this.generateId();
    const storedEntry: StoredLogEntry = {
      id,
      timestamp: new Date(),
      ...entry,
    };

    this.logs.push(storedEntry);

    // Trim if exceeding max entries
    if (this.logs.length > this.config.maxEntries) {
      const excess = this.logs.length - this.config.maxEntries;
      this.logs.splice(0, excess);
    }

    return id;
  }

  /**
   * Query logs with filtering options
   */
  query(options: LogQueryOptions = {}): StoredLogEntry[] {
    let results = [...this.logs];

    // Filter by level
    if (options.level) {
      const levels = Array.isArray(options.level) ? options.level : [options.level];
      results = results.filter((log) => levels.includes(log.level));
    }

    // Filter by context
    if (options.context) {
      const contexts = Array.isArray(options.context) ? options.context : [options.context];
      results = results.filter((log) =>
        contexts.some((ctx) => log.context.toLowerCase().includes(ctx.toLowerCase()))
      );
    }

    // Filter by time range
    if (options.startTime) {
      results = results.filter((log) => log.timestamp >= options.startTime!);
    }
    if (options.endTime) {
      results = results.filter((log) => log.timestamp <= options.endTime!);
    }

    // Filter by correlation ID
    if (options.correlationId) {
      results = results.filter((log) => log.correlationId === options.correlationId);
    }

    // Filter by user ID
    if (options.userId) {
      results = results.filter((log) => log.userId === options.userId);
    }

    // Search in message and data
    if (options.search) {
      const searchLower = options.search.toLowerCase();
      results = results.filter(
        (log) =>
          log.message.toLowerCase().includes(searchLower) ||
          JSON.stringify(log.data || {}).toLowerCase().includes(searchLower)
      );
    }

    // Sort by timestamp (newest first), then by ID counter for same-millisecond entries
    results.sort((a, b) => {
      const timeDiff = b.timestamp.getTime() - a.timestamp.getTime();
      if (timeDiff !== 0) return timeDiff;
      // Extract counter from ID (format: log_timestamp_counter)
      const counterA = parseInt(a.id.split("_")[2] || "0", 10);
      const counterB = parseInt(b.id.split("_")[2] || "0", 10);
      return counterB - counterA;
    });

    // Apply pagination
    const offset = options.offset || 0;
    const limit = options.limit || 100;
    results = results.slice(offset, offset + limit);

    return results;
  }

  /**
   * Get a single log entry by ID
   */
  getById(id: string): StoredLogEntry | undefined {
    return this.logs.find((log) => log.id === id);
  }

  /**
   * Get recent logs
   */
  getRecent(count: number = 50): StoredLogEntry[] {
    return this.query({ limit: count });
  }

  /**
   * Get logs for a specific context
   */
  getByContext(context: string, limit: number = 100): StoredLogEntry[] {
    return this.query({ context, limit });
  }

  /**
   * Get error logs
   */
  getErrors(limit: number = 100): StoredLogEntry[] {
    return this.query({ level: "error", limit });
  }

  /**
   * Get warnings and errors
   */
  getWarningsAndErrors(limit: number = 100): StoredLogEntry[] {
    return this.query({ level: ["warn", "error"], limit });
  }

  /**
   * Get statistics about stored logs
   */
  getStats(): LogStats {
    const byLevel: Record<LogLevel, number> = {
      debug: 0,
      info: 0,
      warn: 0,
      error: 0,
    };
    const byContext: Record<string, number> = {};

    for (const log of this.logs) {
      byLevel[log.level]++;
      byContext[log.context] = (byContext[log.context] || 0) + 1;
    }

    const timestamps = this.logs.map((l) => l.timestamp);
    const oldestEntry = timestamps.length > 0 ? new Date(Math.min(...timestamps.map((t) => t.getTime()))) : null;
    const newestEntry = timestamps.length > 0 ? new Date(Math.max(...timestamps.map((t) => t.getTime()))) : null;

    // Estimate memory usage
    const memoryUsageBytes = this.estimateMemoryUsage();

    return {
      totalEntries: this.logs.length,
      byLevel,
      byContext,
      oldestEntry,
      newestEntry,
      memoryUsageBytes,
    };
  }

  /**
   * Export logs for external services (e.g., sending to log aggregator)
   */
  export(options: LogQueryOptions = {}): { logs: StoredLogEntry[]; exportedAt: Date } {
    const logs = this.query(options);
    return {
      logs,
      exportedAt: new Date(),
    };
  }

  /**
   * Clear all logs
   */
  clear(): void {
    this.logs = [];
    logger.info("Logs store cleared");
  }

  /**
   * Clear logs older than retention period
   */
  cleanup(): number {
    const cutoffTime = new Date(Date.now() - this.config.retentionMs);
    const initialCount = this.logs.length;

    this.logs = this.logs.filter((log) => log.timestamp >= cutoffTime);

    const removedCount = initialCount - this.logs.length;
    if (removedCount > 0) {
      logger.debug("Cleaned up expired log entries", { count: removedCount });
    }

    return removedCount;
  }

  /**
   * Stop the cleanup interval
   */
  stop(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }

  /**
   * Get current configuration
   */
  getConfig(): LogsStoreConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<LogsStoreConfig>): void {
    this.config = { ...this.config, ...config };

    // Restart cleanup if interval changed
    if (config.cleanupIntervalMs) {
      this.stop();
      this.startCleanup();
    }
  }

  private generateId(): string {
    return `log_${Date.now()}_${++this.idCounter}`;
  }

  private startCleanup(): void {
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, this.config.cleanupIntervalMs);
  }

  private estimateMemoryUsage(): number {
    // Rough estimate: ~500 bytes per log entry on average
    return this.logs.length * 500;
  }
}

// Singleton instance
let logsStoreInstance: LogsStore | null = null;

/**
 * Get the singleton logs store instance
 */
export function getLogsStore(): LogsStore {
  if (!logsStoreInstance) {
    logsStoreInstance = new LogsStore();
  }
  return logsStoreInstance;
}

/**
 * Create a new logs store instance (for testing or isolated use)
 */
export function createLogsStore(config?: Partial<LogsStoreConfig>): LogsStore {
  return new LogsStore(config);
}

/**
 * Helper to add a log entry to the global store
 */
export function storeLog(
  level: LogLevel,
  context: string,
  message: string,
  options?: {
    data?: Record<string, unknown>;
    correlationId?: string;
    userId?: number;
    requestId?: string;
  }
): string {
  return getLogsStore().add({
    level,
    context,
    message,
    ...options,
  });
}

/**
 * Integration with existing logger - creates a wrapper that also stores logs
 */
export function createStoredLogger(context: string) {
  const baseLogger = createLogger(context);
  const store = getLogsStore();

  return {
    debug(message: string, data?: Record<string, unknown>) {
      baseLogger.debug(message, data);
      store.add({ level: "debug", context, message, data });
    },
    info(message: string, data?: Record<string, unknown>) {
      baseLogger.info(message, data);
      store.add({ level: "info", context, message, data });
    },
    warn(message: string, data?: Record<string, unknown>) {
      baseLogger.warn(message, data);
      store.add({ level: "warn", context, message, data });
    },
    error(message: string, error?: Error | unknown, data?: Record<string, unknown>) {
      baseLogger.error(message, error, data);
      const errorData = error instanceof Error
        ? { ...data, errorName: error.name, errorMessage: error.message }
        : { ...data, error: String(error) };
      store.add({ level: "error", context, message, data: errorData });
    },
  };
}

// Export types
export type { StoredLogEntry, LogQueryOptions, LogStats, LogsStoreConfig };
export { LogsStore };
