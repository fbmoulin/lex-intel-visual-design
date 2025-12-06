/**
 * Admin Logs API Routes
 * Lex Intel Visual Design - Desenvolvido por Lex Intelligentia
 *
 * Provides API endpoints for viewing and querying application logs.
 * Restricted to admin users only.
 */

import type { Express, Request, Response, NextFunction } from "express";
import { getLogsStore, type LogQueryOptions, type StoredLogEntry } from "./logsStore";
import { loggers } from "./logger";
import { z } from "zod";

// Query parameters schema
const logsQuerySchema = z.object({
  level: z.enum(["debug", "info", "warn", "error"]).optional(),
  context: z.string().optional(),
  search: z.string().optional(),
  startTime: z.string().datetime().optional(),
  endTime: z.string().datetime().optional(),
  correlationId: z.string().optional(),
  userId: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().min(1).max(500).default(100),
  offset: z.coerce.number().int().min(0).default(0),
});

interface LogsApiResponse {
  logs: StoredLogEntry[];
  total: number;
  limit: number;
  offset: number;
  timestamp: string;
}

interface LogsStatsResponse {
  totalEntries: number;
  byLevel: Record<string, number>;
  byContext: Record<string, number>;
  oldestEntry: string | null;
  newestEntry: string | null;
  memoryUsageBytes: number;
  timestamp: string;
}

/**
 * Simple admin check middleware
 * In production, this should be replaced with proper role-based access control
 */
function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  // Check for admin header or query param (for development/testing)
  const adminKey = req.headers["x-admin-key"] || req.query.adminKey;
  const expectedKey = process.env.ADMIN_API_KEY;

  // Allow in development without key
  if (process.env.NODE_ENV === "development") {
    return next();
  }

  // Require admin key in production
  if (!expectedKey) {
    loggers.security.warn("Admin logs accessed but ADMIN_API_KEY not configured");
    res.status(503).json({
      error: "Admin API not configured",
      message: "ADMIN_API_KEY environment variable is not set",
    });
    return;
  }

  if (adminKey !== expectedKey) {
    loggers.security.warn("Unauthorized admin logs access attempt", {
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });
    res.status(401).json({
      error: "Unauthorized",
      message: "Valid admin key required",
    });
    return;
  }

  next();
}

/**
 * Register admin logs routes
 */
export function registerLogsRoutes(app: Express): void {
  const store = getLogsStore();

  /**
   * GET /api/admin/logs
   * Query logs with filtering and pagination
   */
  app.get("/api/admin/logs", requireAdmin, (req: Request, res: Response) => {
    try {
      const parseResult = logsQuerySchema.safeParse(req.query);

      if (!parseResult.success) {
        res.status(400).json({
          error: "Invalid query parameters",
          details: parseResult.error.errors,
        });
        return;
      }

      const params = parseResult.data;

      // Build query options
      const queryOptions: LogQueryOptions = {
        limit: params.limit,
        offset: params.offset,
      };

      if (params.level) {
        queryOptions.level = params.level;
      }

      if (params.context) {
        queryOptions.context = params.context;
      }

      if (params.search) {
        queryOptions.search = params.search;
      }

      if (params.startTime) {
        queryOptions.startTime = new Date(params.startTime);
      }

      if (params.endTime) {
        queryOptions.endTime = new Date(params.endTime);
      }

      if (params.correlationId) {
        queryOptions.correlationId = params.correlationId;
      }

      if (params.userId) {
        queryOptions.userId = params.userId;
      }

      const logs = store.query(queryOptions);
      const stats = store.getStats();

      const response: LogsApiResponse = {
        logs,
        total: stats.totalEntries,
        limit: params.limit,
        offset: params.offset,
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error) {
      loggers.server.error("Error querying logs", error);
      res.status(500).json({
        error: "Internal server error",
        message: "Failed to query logs",
      });
    }
  });

  /**
   * GET /api/admin/logs/stats
   * Get log statistics
   */
  app.get("/api/admin/logs/stats", requireAdmin, (_req: Request, res: Response) => {
    try {
      const stats = store.getStats();

      const response: LogsStatsResponse = {
        totalEntries: stats.totalEntries,
        byLevel: stats.byLevel,
        byContext: stats.byContext,
        oldestEntry: stats.oldestEntry?.toISOString() || null,
        newestEntry: stats.newestEntry?.toISOString() || null,
        memoryUsageBytes: stats.memoryUsageBytes,
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error) {
      loggers.server.error("Error getting log stats", error);
      res.status(500).json({
        error: "Internal server error",
        message: "Failed to get log statistics",
      });
    }
  });

  /**
   * GET /api/admin/logs/recent
   * Get recent logs (convenience endpoint)
   */
  app.get("/api/admin/logs/recent", requireAdmin, (req: Request, res: Response) => {
    try {
      const count = Math.min(parseInt(req.query.count as string) || 50, 200);
      const logs = store.getRecent(count);

      res.json({
        logs,
        count: logs.length,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      loggers.server.error("Error getting recent logs", error);
      res.status(500).json({
        error: "Internal server error",
        message: "Failed to get recent logs",
      });
    }
  });

  /**
   * GET /api/admin/logs/errors
   * Get error logs (convenience endpoint)
   */
  app.get("/api/admin/logs/errors", requireAdmin, (req: Request, res: Response) => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 100, 500);
      const logs = store.getErrors(limit);

      res.json({
        logs,
        count: logs.length,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      loggers.server.error("Error getting error logs", error);
      res.status(500).json({
        error: "Internal server error",
        message: "Failed to get error logs",
      });
    }
  });

  /**
   * GET /api/admin/logs/:id
   * Get a specific log entry by ID
   */
  app.get("/api/admin/logs/:id", requireAdmin, (req: Request, res: Response) => {
    try {
      const log = store.getById(req.params.id);

      if (!log) {
        res.status(404).json({
          error: "Not found",
          message: `Log entry with ID '${req.params.id}' not found`,
        });
        return;
      }

      res.json({ log, timestamp: new Date().toISOString() });
    } catch (error) {
      loggers.server.error("Error getting log by ID", error);
      res.status(500).json({
        error: "Internal server error",
        message: "Failed to get log entry",
      });
    }
  });

  /**
   * POST /api/admin/logs/export
   * Export logs (for external log aggregators)
   */
  app.post("/api/admin/logs/export", requireAdmin, (req: Request, res: Response) => {
    try {
      const parseResult = logsQuerySchema.safeParse(req.body);

      if (!parseResult.success) {
        res.status(400).json({
          error: "Invalid request body",
          details: parseResult.error.errors,
        });
        return;
      }

      const params = parseResult.data;
      const queryOptions: LogQueryOptions = {
        limit: params.limit,
        offset: params.offset,
      };

      if (params.level) queryOptions.level = params.level;
      if (params.context) queryOptions.context = params.context;
      if (params.search) queryOptions.search = params.search;
      if (params.startTime) queryOptions.startTime = new Date(params.startTime);
      if (params.endTime) queryOptions.endTime = new Date(params.endTime);

      const exported = store.export(queryOptions);

      res.json({
        ...exported,
        exportedAt: exported.exportedAt.toISOString(),
      });
    } catch (error) {
      loggers.server.error("Error exporting logs", error);
      res.status(500).json({
        error: "Internal server error",
        message: "Failed to export logs",
      });
    }
  });

  /**
   * DELETE /api/admin/logs
   * Clear all logs (admin only, requires confirmation)
   */
  app.delete("/api/admin/logs", requireAdmin, (req: Request, res: Response) => {
    try {
      const confirm = req.query.confirm === "true";

      if (!confirm) {
        res.status(400).json({
          error: "Confirmation required",
          message: "Add ?confirm=true to clear all logs",
        });
        return;
      }

      const stats = store.getStats();
      store.clear();

      loggers.security.info("Admin cleared logs", {
        clearedEntries: stats.totalEntries,
        ip: req.ip,
      });

      res.json({
        success: true,
        clearedEntries: stats.totalEntries,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      loggers.server.error("Error clearing logs", error);
      res.status(500).json({
        error: "Internal server error",
        message: "Failed to clear logs",
      });
    }
  });

  loggers.server.debug("Admin logs routes registered", {
    endpoints: [
      "/api/admin/logs",
      "/api/admin/logs/stats",
      "/api/admin/logs/recent",
      "/api/admin/logs/errors",
      "/api/admin/logs/:id",
      "/api/admin/logs/export",
    ],
  });
}
