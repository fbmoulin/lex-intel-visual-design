/**
 * Logger Estruturado
 * Lex Intel Visual Design - Desenvolvido por Lex Intelligentia
 *
 * Implementação leve de logger estruturado sem dependências externas.
 * Substitui console.log com níveis, timestamps e contexto.
 *
 * Para produção com requisitos avançados, considere migrar para:
 * - pino (mais performático)
 * - winston (mais configurável)
 * - bunyan (JSON nativo)
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  context: string;
  message: string;
  data?: Record<string, unknown>;
}

interface LoggerOptions {
  context: string;
  minLevel?: LogLevel;
}

// Ordem de níveis (para filtragem)
const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

// Nível mínimo baseado no ambiente
const DEFAULT_MIN_LEVEL: LogLevel =
  process.env.NODE_ENV === "production" ? "info" : "debug";

// Cores para terminal (ANSI)
const COLORS = {
  reset: "\x1b[0m",
  dim: "\x1b[2m",
  debug: "\x1b[36m",   // Cyan
  info: "\x1b[32m",    // Green
  warn: "\x1b[33m",    // Yellow
  error: "\x1b[31m",   // Red
  context: "\x1b[35m", // Magenta
} as const;

/**
 * Formata timestamp ISO
 */
function getTimestamp(): string {
  return new Date().toISOString();
}

/**
 * Formata dados extras como JSON compacto
 */
function formatData(data: Record<string, unknown> | undefined): string {
  if (!data || Object.keys(data).length === 0) return "";
  try {
    return ` ${JSON.stringify(data)}`;
  } catch {
    return " [unserializable data]";
  }
}

/**
 * Determina se deve usar cores (terminal vs arquivo)
 */
function shouldUseColors(): boolean {
  // Desabilita cores se não for TTY ou se LOG_NO_COLORS estiver definido
  if (process.env.LOG_NO_COLORS === "true") return false;
  if (!process.stdout.isTTY) return false;
  return true;
}

/**
 * Formata uma entrada de log para output
 */
function formatLogEntry(entry: LogEntry, useColors: boolean): string {
  const { timestamp, level, context, message, data } = entry;
  const dataStr = formatData(data);

  if (useColors) {
    const levelColor = COLORS[level];
    const levelPadded = level.toUpperCase().padEnd(5);
    return (
      `${COLORS.dim}${timestamp}${COLORS.reset} ` +
      `${levelColor}${levelPadded}${COLORS.reset} ` +
      `${COLORS.context}[${context}]${COLORS.reset} ` +
      `${message}${COLORS.dim}${dataStr}${COLORS.reset}`
    );
  }

  // Formato JSON para produção (mais fácil de parsear)
  if (process.env.NODE_ENV === "production") {
    return JSON.stringify({ ...entry, data: data || undefined });
  }

  // Formato texto simples
  return `${timestamp} ${level.toUpperCase().padEnd(5)} [${context}] ${message}${dataStr}`;
}

/**
 * Classe Logger
 */
class Logger {
  private context: string;
  private minLevel: number;
  private useColors: boolean;

  constructor(options: LoggerOptions) {
    this.context = options.context;
    this.minLevel = LOG_LEVELS[options.minLevel ?? DEFAULT_MIN_LEVEL];
    this.useColors = shouldUseColors();
  }

  private log(level: LogLevel, message: string, data?: Record<string, unknown>): void {
    if (LOG_LEVELS[level] < this.minLevel) return;

    const entry: LogEntry = {
      timestamp: getTimestamp(),
      level,
      context: this.context,
      message,
      data,
    };

    const formatted = formatLogEntry(entry, this.useColors);

    // Usa console.error para warn/error (stderr)
    if (level === "error" || level === "warn") {
      console.error(formatted);
    } else {
      console.log(formatted);
    }
  }

  /**
   * Log de debug - apenas em desenvolvimento
   */
  debug(message: string, data?: Record<string, unknown>): void {
    this.log("debug", message, data);
  }

  /**
   * Log informativo
   */
  info(message: string, data?: Record<string, unknown>): void {
    this.log("info", message, data);
  }

  /**
   * Log de aviso
   */
  warn(message: string, data?: Record<string, unknown>): void {
    this.log("warn", message, data);
  }

  /**
   * Log de erro
   */
  error(message: string, error?: Error | unknown, data?: Record<string, unknown>): void {
    const errorData: Record<string, unknown> = { ...data };

    if (error instanceof Error) {
      errorData.errorName = error.name;
      errorData.errorMessage = error.message;
      // Stack trace apenas em desenvolvimento
      if (process.env.NODE_ENV !== "production") {
        errorData.stack = error.stack;
      }
    } else if (error !== undefined) {
      errorData.error = String(error);
    }

    this.log("error", message, Object.keys(errorData).length > 0 ? errorData : undefined);
  }

  /**
   * Cria um logger filho com contexto adicional
   */
  child(subContext: string): Logger {
    return new Logger({
      context: `${this.context}:${subContext}`,
      minLevel: Object.keys(LOG_LEVELS).find(
        (key) => LOG_LEVELS[key as LogLevel] === this.minLevel
      ) as LogLevel,
    });
  }
}

/**
 * Factory para criar loggers
 */
export function createLogger(context: string, minLevel?: LogLevel): Logger {
  return new Logger({ context, minLevel });
}

/**
 * Logger padrão para uso geral
 */
export const logger = createLogger("App");

/**
 * Loggers pré-configurados para módulos comuns
 */
export const loggers = {
  server: createLogger("Server"),
  database: createLogger("Database"),
  auth: createLogger("Auth"),
  oauth: createLogger("OAuth"),
  api: createLogger("API"),
  security: createLogger("Security"),
  rateLimit: createLogger("RateLimit"),
} as const;

// Exporta tipo para uso externo
export type { Logger, LogLevel, LogEntry };
