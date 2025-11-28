import type { Express, Request, Response } from "express";
import { sql } from "drizzle-orm";
import { isDatabaseAvailable, getConnectionAttempts, getDb } from "../db";
import { loggers } from "./logger";

/**
 * Health check status types
 */
type HealthStatus = "healthy" | "degraded" | "unhealthy";

interface DatabaseHealth {
  status: "connected" | "disconnected" | "connecting";
  connectionAttempts: number;
  latencyMs?: number;
}

interface HealthCheckResponse {
  status: HealthStatus;
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
  database: DatabaseHealth;
  checks: {
    name: string;
    status: "pass" | "fail" | "warn";
    message?: string;
  }[];
}

// Server start time for uptime calculation
const serverStartTime = Date.now();

/**
 * Get application version from package.json
 */
function getAppVersion(): string {
  try {
    // In production, VERSION env var may be set
    if (process.env.VERSION) {
      return process.env.VERSION;
    }
    // Default fallback
    return process.env.npm_package_version || "1.0.0-beta";
  } catch {
    return "unknown";
  }
}

/**
 * Check database connectivity with latency measurement
 */
async function checkDatabaseHealth(): Promise<DatabaseHealth> {
  const connectionAttempts = getConnectionAttempts();

  if (!isDatabaseAvailable()) {
    return {
      status: connectionAttempts > 0 ? "connecting" : "disconnected",
      connectionAttempts,
    };
  }

  // Measure query latency
  try {
    const start = Date.now();
    const db = await getDb();

    if (db) {
      // Simple query to test connection using Drizzle raw SQL
      await db.execute(sql`SELECT 1 as health_check`);
      const latencyMs = Date.now() - start;

      return {
        status: "connected",
        connectionAttempts,
        latencyMs,
      };
    }
  } catch (error) {
    loggers.database.warn("Health check query failed", { error: String(error) });
  }

  return {
    status: "disconnected",
    connectionAttempts,
  };
}

/**
 * Determine overall health status based on checks
 */
function determineOverallStatus(
  dbHealth: DatabaseHealth,
  checks: HealthCheckResponse["checks"]
): HealthStatus {
  const hasFailure = checks.some((c) => c.status === "fail");
  const hasWarning = checks.some((c) => c.status === "warn");

  if (hasFailure) {
    return "unhealthy";
  }

  if (hasWarning || dbHealth.status === "disconnected") {
    return "degraded";
  }

  return "healthy";
}

/**
 * Register health check routes
 */
export function registerHealthRoutes(app: Express): void {
  /**
   * GET /api/health
   * Comprehensive health check endpoint
   */
  app.get("/api/health", async (_req: Request, res: Response) => {
    const startTime = Date.now();

    try {
      const dbHealth = await checkDatabaseHealth();
      const checks: HealthCheckResponse["checks"] = [];

      // Database check
      if (dbHealth.status === "connected") {
        checks.push({
          name: "database",
          status: dbHealth.latencyMs && dbHealth.latencyMs > 1000 ? "warn" : "pass",
          message:
            dbHealth.latencyMs && dbHealth.latencyMs > 1000
              ? `High latency: ${dbHealth.latencyMs}ms`
              : `Connected (${dbHealth.latencyMs}ms)`,
        });
      } else if (dbHealth.status === "connecting") {
        checks.push({
          name: "database",
          status: "warn",
          message: `Reconnecting (attempt ${dbHealth.connectionAttempts})`,
        });
      } else {
        checks.push({
          name: "database",
          status: process.env.DATABASE_URL ? "fail" : "warn",
          message: process.env.DATABASE_URL
            ? "Database connection failed"
            : "Database not configured",
        });
      }

      // Memory check
      const memoryUsage = process.memoryUsage();
      const heapUsedMB = Math.round(memoryUsage.heapUsed / 1024 / 1024);
      const heapTotalMB = Math.round(memoryUsage.heapTotal / 1024 / 1024);
      const heapPercentage = Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100);

      if (heapPercentage > 90) {
        checks.push({
          name: "memory",
          status: "warn",
          message: `High memory usage: ${heapUsedMB}MB / ${heapTotalMB}MB (${heapPercentage}%)`,
        });
      } else {
        checks.push({
          name: "memory",
          status: "pass",
          message: `${heapUsedMB}MB / ${heapTotalMB}MB (${heapPercentage}%)`,
        });
      }

      // Environment check
      const requiredEnvVars = ["JWT_SECRET", "OAUTH_SERVER_URL"];
      const missingEnvVars = requiredEnvVars.filter((v) => !process.env[v]);

      if (missingEnvVars.length > 0) {
        checks.push({
          name: "environment",
          status: "warn",
          message: `Missing env vars: ${missingEnvVars.join(", ")}`,
        });
      } else {
        checks.push({
          name: "environment",
          status: "pass",
          message: "All required environment variables set",
        });
      }

      const status = determineOverallStatus(dbHealth, checks);
      const uptimeSeconds = Math.floor((Date.now() - serverStartTime) / 1000);

      const response: HealthCheckResponse = {
        status,
        timestamp: new Date().toISOString(),
        uptime: uptimeSeconds,
        version: getAppVersion(),
        environment: process.env.NODE_ENV || "development",
        database: dbHealth,
        checks,
      };

      // Return appropriate HTTP status code
      const httpStatus = status === "healthy" ? 200 : status === "degraded" ? 200 : 503;

      // Log health check (only if not healthy or if slow)
      const responseTime = Date.now() - startTime;
      if (status !== "healthy" || responseTime > 500) {
        loggers.server.info("Health check", {
          status,
          responseTimeMs: responseTime,
          database: dbHealth.status,
        });
      }

      res.status(httpStatus).json(response);
    } catch (error) {
      loggers.server.error("Health check failed", error);

      res.status(503).json({
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        uptime: Math.floor((Date.now() - serverStartTime) / 1000),
        version: getAppVersion(),
        environment: process.env.NODE_ENV || "development",
        database: { status: "disconnected", connectionAttempts: 0 },
        checks: [
          {
            name: "health_check",
            status: "fail",
            message: "Health check execution failed",
          },
        ],
      } satisfies HealthCheckResponse);
    }
  });

  /**
   * GET /api/health/live
   * Simple liveness probe (for Kubernetes/container orchestration)
   */
  app.get("/api/health/live", (_req: Request, res: Response) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
  });

  /**
   * GET /api/health/ready
   * Readiness probe - checks if the service is ready to accept traffic
   */
  app.get("/api/health/ready", async (_req: Request, res: Response) => {
    const dbHealth = await checkDatabaseHealth();

    // Service is ready if database is connected or not required
    const isReady = dbHealth.status === "connected" || !process.env.DATABASE_URL;

    if (isReady) {
      res.status(200).json({
        status: "ready",
        timestamp: new Date().toISOString(),
        database: dbHealth.status,
      });
    } else {
      res.status(503).json({
        status: "not_ready",
        timestamp: new Date().toISOString(),
        database: dbHealth.status,
        message: "Database connection not ready",
      });
    }
  });

  loggers.server.debug("Health check routes registered", {
    endpoints: ["/api/health", "/api/health/live", "/api/health/ready"],
  });
}
