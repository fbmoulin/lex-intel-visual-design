import "dotenv/config";
import express from "express";
import { createServer, Server } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerHealthRoutes } from "./health";
import { registerLogsRoutes } from "./logsRoutes";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { setupSecurity } from "./security";
import { loggers } from "./logger";
import {
  initSentry,
  setupErrorTracking,
  setupErrorHandler as setupSentryErrorHandler,
} from "./errorTracking";
import { closeDb } from "../db";
import { closeRateLimitStore } from "./rateLimitStore";
import { closeCache } from "./cache";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

/**
 * Graceful shutdown handler
 * Closes all connections and resources cleanly
 */
async function gracefulShutdown(
  server: Server,
  signal: string
): Promise<void> {
  loggers.server.info(`Received ${signal}, starting graceful shutdown...`);

  // Stop accepting new connections
  server.close((err) => {
    if (err) {
      loggers.server.error("Error closing HTTP server", err);
    } else {
      loggers.server.info("HTTP server closed");
    }
  });

  // Close all resources with timeout
  const shutdownTimeout = 30000; // 30 seconds
  const shutdownPromise = Promise.allSettled([
    closeDb().catch((err) => {
      loggers.server.error("Error closing database", err);
    }),
    closeRateLimitStore().catch((err) => {
      loggers.server.error("Error closing rate limit store", err);
    }),
    closeCache().catch((err) => {
      loggers.server.error("Error closing cache", err);
    }),
  ]);

  // Race between shutdown and timeout
  const timeoutPromise = new Promise<void>((resolve) => {
    setTimeout(() => {
      loggers.server.warn("Shutdown timeout reached, forcing exit");
      resolve();
    }, shutdownTimeout);
  });

  await Promise.race([shutdownPromise, timeoutPromise]);

  loggers.server.info("Graceful shutdown completed");
  process.exit(0);
}

/**
 * Setup signal handlers for graceful shutdown
 */
function setupGracefulShutdown(server: Server): void {
  let isShuttingDown = false;

  const shutdown = (signal: string) => {
    if (isShuttingDown) {
      loggers.server.warn("Shutdown already in progress, ignoring signal");
      return;
    }
    isShuttingDown = true;
    gracefulShutdown(server, signal);
  };

  // Handle termination signals
  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  // Handle uncaught exceptions (log and exit)
  process.on("uncaughtException", (error) => {
    loggers.server.error("Uncaught exception", error);
    shutdown("uncaughtException");
  });

  // Handle unhandled promise rejections
  process.on("unhandledRejection", (reason, promise) => {
    loggers.server.error("Unhandled promise rejection", { reason, promise });
  });
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Initialize Sentry (if configured)
  await initSentry();

  // Sentry request handler (must be first)
  setupErrorTracking(app);

  // Security middleware (CORS, headers, rate limiting, etc.)
  setupSecurity(app);
  
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Health check endpoints (before auth middleware)
  registerHealthRoutes(app);

  // Admin logs endpoints (protected by API key)
  registerLogsRoutes(app);

  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Sentry error handler (must be after all routes)
  setupSentryErrorHandler(app);

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    loggers.server.warn(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    loggers.server.info(`Server running on http://localhost:${port}/`, {
      port,
      env: process.env.NODE_ENV,
    });

    // Setup graceful shutdown after server is listening
    setupGracefulShutdown(server);
  });
}

startServer().catch((error) => {
  loggers.server.error("Failed to start server", error);
  process.exit(1);
});
