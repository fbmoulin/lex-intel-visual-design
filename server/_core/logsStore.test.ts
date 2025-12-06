/**
 * Logs Store Tests
 * Lex Intel Visual Design - Desenvolvido por Lex Intelligentia
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  createLogsStore,
  storeLog,
  getLogsStore,
  LogsStore,
} from "./logsStore";

describe("LogsStore", () => {
  let store: LogsStore;

  beforeEach(() => {
    store = createLogsStore({ maxEntries: 100, cleanupIntervalMs: 60000 });
  });

  afterEach(() => {
    store.stop();
    store.clear();
  });

  describe("add", () => {
    it("adds a log entry and returns an ID", () => {
      const id = store.add({
        level: "info",
        context: "Test",
        message: "Test message",
      });

      expect(id).toMatch(/^log_\d+_\d+$/);
    });

    it("stores log with timestamp", () => {
      const id = store.add({
        level: "info",
        context: "Test",
        message: "Test message",
      });

      const log = store.getById(id);
      expect(log).toBeDefined();
      expect(log?.timestamp).toBeInstanceOf(Date);
    });

    it("stores optional data", () => {
      const id = store.add({
        level: "error",
        context: "Test",
        message: "Error occurred",
        data: { errorCode: 500, details: "Server error" },
      });

      const log = store.getById(id);
      expect(log?.data).toEqual({ errorCode: 500, details: "Server error" });
    });

    it("stores correlation and user IDs", () => {
      const id = store.add({
        level: "info",
        context: "Auth",
        message: "User logged in",
        correlationId: "req-123",
        userId: 42,
      });

      const log = store.getById(id);
      expect(log?.correlationId).toBe("req-123");
      expect(log?.userId).toBe(42);
    });

    it("respects maxEntries limit", () => {
      const smallStore = createLogsStore({ maxEntries: 5, cleanupIntervalMs: 60000 });

      for (let i = 0; i < 10; i++) {
        smallStore.add({
          level: "info",
          context: "Test",
          message: `Message ${i}`,
        });
      }

      const stats = smallStore.getStats();
      expect(stats.totalEntries).toBe(5);
      smallStore.stop();
    });
  });

  describe("query", () => {
    beforeEach(() => {
      // Add test data
      store.add({ level: "debug", context: "Database", message: "Query executed" });
      store.add({ level: "info", context: "Auth", message: "User logged in", userId: 1 });
      store.add({ level: "warn", context: "API", message: "Rate limit approaching" });
      store.add({ level: "error", context: "Database", message: "Connection failed" });
      store.add({ level: "info", context: "Auth", message: "User logged out", userId: 1 });
    });

    it("returns all logs when no filter specified", () => {
      const results = store.query();
      expect(results.length).toBe(5);
    });

    it("filters by single level", () => {
      const results = store.query({ level: "error" });
      expect(results.length).toBe(1);
      expect(results[0].message).toBe("Connection failed");
    });

    it("filters by multiple levels", () => {
      const results = store.query({ level: ["warn", "error"] });
      expect(results.length).toBe(2);
    });

    it("filters by context", () => {
      const results = store.query({ context: "Auth" });
      expect(results.length).toBe(2);
    });

    it("filters by context case-insensitive", () => {
      const results = store.query({ context: "auth" });
      expect(results.length).toBe(2);
    });

    it("filters by userId", () => {
      const results = store.query({ userId: 1 });
      expect(results.length).toBe(2);
    });

    it("filters by time range", () => {
      const now = new Date();
      const past = new Date(now.getTime() - 1000);

      const results = store.query({
        startTime: past,
        endTime: new Date(now.getTime() + 1000),
      });

      expect(results.length).toBe(5);
    });

    it("searches in message", () => {
      const results = store.query({ search: "logged" });
      expect(results.length).toBe(2);
    });

    it("applies limit", () => {
      const results = store.query({ limit: 2 });
      expect(results.length).toBe(2);
    });

    it("applies offset", () => {
      const results = store.query({ offset: 3, limit: 10 });
      expect(results.length).toBe(2);
    });

    it("returns logs sorted by timestamp (newest entries appear first)", () => {
      // Clear and add fresh data
      store.clear();

      // Add entries with small delays to ensure different timestamps
      const id1 = store.add({ level: "info", context: "Test", message: "First" });
      const id2 = store.add({ level: "info", context: "Test", message: "Second" });
      const id3 = store.add({ level: "info", context: "Test", message: "Third" });

      const results = store.query();
      // Results should be in reverse order of addition (newest first by timestamp, then by ID)
      expect(results.length).toBe(3);
      // The last added log should be first in results
      expect(results[0].id).toBe(id3);
    });
  });

  describe("getById", () => {
    it("returns log by ID", () => {
      const id = store.add({
        level: "info",
        context: "Test",
        message: "Find me",
      });

      const log = store.getById(id);
      expect(log?.message).toBe("Find me");
    });

    it("returns undefined for non-existent ID", () => {
      const log = store.getById("non-existent");
      expect(log).toBeUndefined();
    });
  });

  describe("getRecent", () => {
    it("returns recent logs", () => {
      for (let i = 0; i < 20; i++) {
        store.add({ level: "info", context: "Test", message: `Message ${i}` });
      }

      const recent = store.getRecent(5);
      expect(recent.length).toBe(5);
    });
  });

  describe("getByContext", () => {
    it("returns logs for specific context", () => {
      store.add({ level: "info", context: "API", message: "Request 1" });
      store.add({ level: "info", context: "Database", message: "Query 1" });
      store.add({ level: "info", context: "API", message: "Request 2" });

      const results = store.getByContext("API");
      expect(results.length).toBe(2);
    });
  });

  describe("getErrors", () => {
    it("returns only error logs", () => {
      store.add({ level: "info", context: "Test", message: "Info" });
      store.add({ level: "error", context: "Test", message: "Error 1" });
      store.add({ level: "warn", context: "Test", message: "Warning" });
      store.add({ level: "error", context: "Test", message: "Error 2" });

      const errors = store.getErrors();
      expect(errors.length).toBe(2);
      expect(errors.every((e) => e.level === "error")).toBe(true);
    });
  });

  describe("getWarningsAndErrors", () => {
    it("returns warn and error logs", () => {
      store.add({ level: "info", context: "Test", message: "Info" });
      store.add({ level: "error", context: "Test", message: "Error" });
      store.add({ level: "warn", context: "Test", message: "Warning" });
      store.add({ level: "debug", context: "Test", message: "Debug" });

      const results = store.getWarningsAndErrors();
      expect(results.length).toBe(2);
    });
  });

  describe("getStats", () => {
    it("returns correct statistics", () => {
      store.add({ level: "debug", context: "A", message: "1" });
      store.add({ level: "info", context: "A", message: "2" });
      store.add({ level: "info", context: "B", message: "3" });
      store.add({ level: "warn", context: "B", message: "4" });
      store.add({ level: "error", context: "C", message: "5" });

      const stats = store.getStats();

      expect(stats.totalEntries).toBe(5);
      expect(stats.byLevel.debug).toBe(1);
      expect(stats.byLevel.info).toBe(2);
      expect(stats.byLevel.warn).toBe(1);
      expect(stats.byLevel.error).toBe(1);
      expect(stats.byContext["A"]).toBe(2);
      expect(stats.byContext["B"]).toBe(2);
      expect(stats.byContext["C"]).toBe(1);
      expect(stats.oldestEntry).toBeInstanceOf(Date);
      expect(stats.newestEntry).toBeInstanceOf(Date);
      expect(stats.memoryUsageBytes).toBeGreaterThan(0);
    });

    it("handles empty store", () => {
      const stats = store.getStats();

      expect(stats.totalEntries).toBe(0);
      expect(stats.oldestEntry).toBeNull();
      expect(stats.newestEntry).toBeNull();
    });
  });

  describe("export", () => {
    it("exports logs with timestamp", () => {
      store.add({ level: "info", context: "Test", message: "Export me" });

      const exported = store.export();

      expect(exported.logs.length).toBe(1);
      expect(exported.exportedAt).toBeInstanceOf(Date);
    });

    it("respects query options in export", () => {
      store.add({ level: "info", context: "Test", message: "Info" });
      store.add({ level: "error", context: "Test", message: "Error" });

      const exported = store.export({ level: "error" });

      expect(exported.logs.length).toBe(1);
      expect(exported.logs[0].level).toBe("error");
    });
  });

  describe("clear", () => {
    it("removes all logs", () => {
      store.add({ level: "info", context: "Test", message: "1" });
      store.add({ level: "info", context: "Test", message: "2" });

      store.clear();

      expect(store.getStats().totalEntries).toBe(0);
    });
  });

  describe("cleanup", () => {
    it("removes logs older than retention period", () => {
      vi.useFakeTimers();

      const shortRetentionStore = createLogsStore({
        maxEntries: 100,
        cleanupIntervalMs: 60000,
        retentionMs: 1000, // 1 second retention
      });

      shortRetentionStore.add({ level: "info", context: "Test", message: "Old" });

      // Advance time past retention
      vi.advanceTimersByTime(2000);

      const removed = shortRetentionStore.cleanup();

      expect(removed).toBe(1);
      expect(shortRetentionStore.getStats().totalEntries).toBe(0);

      shortRetentionStore.stop();
      vi.useRealTimers();
    });
  });

  describe("configuration", () => {
    it("returns current config", () => {
      const config = store.getConfig();

      expect(config.maxEntries).toBe(100);
      expect(config.cleanupIntervalMs).toBe(60000);
    });

    it("updates config", () => {
      store.updateConfig({ maxEntries: 50 });

      const config = store.getConfig();
      expect(config.maxEntries).toBe(50);
    });
  });
});

describe("storeLog helper", () => {
  afterEach(() => {
    getLogsStore().clear();
    getLogsStore().stop();
  });

  it("adds log to global store", () => {
    const id = storeLog("info", "Test", "Helper test", { data: { key: "value" } });

    const log = getLogsStore().getById(id);
    expect(log).toBeDefined();
    expect(log?.message).toBe("Helper test");
  });
});
