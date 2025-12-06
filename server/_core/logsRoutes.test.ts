/**
 * Admin Logs API Routes Tests
 * Lex Intel Visual Design - Desenvolvido por Lex Intelligentia
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import express, { Express } from "express";
import request from "supertest";
import { registerLogsRoutes } from "./logsRoutes";
import { getLogsStore } from "./logsStore";

describe("Admin Logs API Routes", () => {
  let app: Express;
  const store = getLogsStore();

  beforeEach(() => {
    // Set development mode for testing (no API key required)
    vi.stubEnv("NODE_ENV", "development");

    app = express();
    app.use(express.json());
    registerLogsRoutes(app);

    // Clear logs before each test
    store.clear();

    // Add some test logs
    store.add({ level: "info", context: "TestContext", message: "Test message 1" });
    store.add({ level: "error", context: "TestContext", message: "Test error" });
    store.add({ level: "warn", context: "OtherContext", message: "Test warning" });
    store.add({
      level: "debug",
      context: "TestContext",
      message: "Debug message",
      userId: 42,
      correlationId: "req-123",
    });
  });

  afterEach(() => {
    store.clear();
    vi.unstubAllEnvs();
  });

  describe("GET /api/admin/logs", () => {
    it("returns all logs with default pagination", async () => {
      const res = await request(app).get("/api/admin/logs");

      expect(res.status).toBe(200);
      expect(res.body.logs).toBeDefined();
      expect(res.body.logs.length).toBe(4);
      expect(res.body.total).toBe(4);
      expect(res.body.limit).toBe(100);
      expect(res.body.offset).toBe(0);
    });

    it("filters by level", async () => {
      const res = await request(app).get("/api/admin/logs?level=error");

      expect(res.status).toBe(200);
      expect(res.body.logs.length).toBe(1);
      expect(res.body.logs[0].level).toBe("error");
    });

    it("filters by context", async () => {
      const res = await request(app).get("/api/admin/logs?context=TestContext");

      expect(res.status).toBe(200);
      expect(res.body.logs.length).toBe(3);
    });

    it("searches in messages", async () => {
      const res = await request(app).get("/api/admin/logs?search=warning");

      expect(res.status).toBe(200);
      expect(res.body.logs.length).toBe(1);
      expect(res.body.logs[0].message).toContain("warning");
    });

    it("applies pagination", async () => {
      const res = await request(app).get("/api/admin/logs?limit=2&offset=1");

      expect(res.status).toBe(200);
      expect(res.body.logs.length).toBe(2);
      expect(res.body.limit).toBe(2);
      expect(res.body.offset).toBe(1);
    });

    it("filters by userId", async () => {
      const res = await request(app).get("/api/admin/logs?userId=42");

      expect(res.status).toBe(200);
      expect(res.body.logs.length).toBe(1);
      expect(res.body.logs[0].userId).toBe(42);
    });

    it("filters by correlationId", async () => {
      const res = await request(app).get("/api/admin/logs?correlationId=req-123");

      expect(res.status).toBe(200);
      expect(res.body.logs.length).toBe(1);
      expect(res.body.logs[0].correlationId).toBe("req-123");
    });

    it("rejects invalid parameters", async () => {
      const res = await request(app).get("/api/admin/logs?level=invalid");

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Invalid query parameters");
    });
  });

  describe("GET /api/admin/logs/stats", () => {
    it("returns log statistics", async () => {
      const res = await request(app).get("/api/admin/logs/stats");

      expect(res.status).toBe(200);
      expect(res.body.totalEntries).toBe(4);
      expect(res.body.byLevel).toBeDefined();
      expect(res.body.byLevel.info).toBe(1);
      expect(res.body.byLevel.error).toBe(1);
      expect(res.body.byLevel.warn).toBe(1);
      expect(res.body.byLevel.debug).toBe(1);
      expect(res.body.byContext).toBeDefined();
      expect(res.body.memoryUsageBytes).toBeGreaterThan(0);
    });
  });

  describe("GET /api/admin/logs/recent", () => {
    it("returns recent logs", async () => {
      const res = await request(app).get("/api/admin/logs/recent");

      expect(res.status).toBe(200);
      expect(res.body.logs).toBeDefined();
      expect(res.body.count).toBe(4);
    });

    it("limits results with count parameter", async () => {
      const res = await request(app).get("/api/admin/logs/recent?count=2");

      expect(res.status).toBe(200);
      expect(res.body.count).toBe(2);
    });
  });

  describe("GET /api/admin/logs/errors", () => {
    it("returns only error logs", async () => {
      const res = await request(app).get("/api/admin/logs/errors");

      expect(res.status).toBe(200);
      expect(res.body.logs.length).toBe(1);
      expect(res.body.logs[0].level).toBe("error");
    });
  });

  describe("GET /api/admin/logs/:id", () => {
    it("returns a log by ID", async () => {
      const allLogs = store.query();
      const logId = allLogs[0].id;

      const res = await request(app).get(`/api/admin/logs/${logId}`);

      expect(res.status).toBe(200);
      expect(res.body.log).toBeDefined();
      expect(res.body.log.id).toBe(logId);
    });

    it("returns 404 for non-existent ID", async () => {
      const res = await request(app).get("/api/admin/logs/non-existent-id");

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Not found");
    });
  });

  describe("POST /api/admin/logs/export", () => {
    it("exports logs with filters", async () => {
      const res = await request(app)
        .post("/api/admin/logs/export")
        .send({ level: "error" });

      expect(res.status).toBe(200);
      expect(res.body.logs).toBeDefined();
      expect(res.body.logs.length).toBe(1);
      expect(res.body.exportedAt).toBeDefined();
    });
  });

  describe("DELETE /api/admin/logs", () => {
    it("requires confirmation", async () => {
      const res = await request(app).delete("/api/admin/logs");

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Confirmation required");
    });

    it("clears logs with confirmation", async () => {
      const res = await request(app).delete("/api/admin/logs?confirm=true");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.clearedEntries).toBe(4);

      // Verify logs are cleared
      expect(store.getStats().totalEntries).toBe(0);
    });
  });

  describe("Authentication", () => {
    it("requires API key in production mode", async () => {
      vi.stubEnv("NODE_ENV", "production");
      vi.stubEnv("ADMIN_API_KEY", "secret-key");

      // Create new app with production settings
      const prodApp = express();
      prodApp.use(express.json());
      registerLogsRoutes(prodApp);

      const res = await request(prodApp).get("/api/admin/logs");

      expect(res.status).toBe(401);
      expect(res.body.error).toBe("Unauthorized");
    });

    it("accepts valid API key in production", async () => {
      vi.stubEnv("NODE_ENV", "production");
      vi.stubEnv("ADMIN_API_KEY", "secret-key");

      // Create new app with production settings
      const prodApp = express();
      prodApp.use(express.json());
      registerLogsRoutes(prodApp);

      const res = await request(prodApp)
        .get("/api/admin/logs")
        .set("x-admin-key", "secret-key");

      expect(res.status).toBe(200);
    });

    it("returns 503 when API key not configured in production", async () => {
      vi.stubEnv("NODE_ENV", "production");
      // Don't set ADMIN_API_KEY

      // Create new app with production settings
      const prodApp = express();
      prodApp.use(express.json());
      registerLogsRoutes(prodApp);

      const res = await request(prodApp).get("/api/admin/logs");

      expect(res.status).toBe(503);
      expect(res.body.error).toBe("Admin API not configured");
    });
  });
});
