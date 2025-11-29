/**
 * Rate Limit Store Tests
 * Lex Intel Visual Design - Desenvolvido por Lex Intelligentia
 *
 * Tests for InMemoryRateLimitStore
 */

import { describe, expect, it, beforeEach } from "vitest";
import { InMemoryRateLimitStore } from "./rateLimitStore";

describe("InMemoryRateLimitStore", () => {
  let store: InMemoryRateLimitStore;

  beforeEach(() => {
    store = new InMemoryRateLimitStore(100);
  });

  describe("increment", () => {
    it("creates new entry on first request", async () => {
      const result = await store.increment("192.168.1.1", 900000);

      expect(result.count).toBe(1);
      expect(result.isNew).toBe(true);
      expect(result.resetTime).toBeGreaterThan(Date.now());
    });

    it("increments count for existing entry", async () => {
      await store.increment("192.168.1.1", 900000);
      const result = await store.increment("192.168.1.1", 900000);

      expect(result.count).toBe(2);
      expect(result.isNew).toBe(false);
    });

    it("tracks multiple IPs independently", async () => {
      await store.increment("192.168.1.1", 900000);
      await store.increment("192.168.1.1", 900000);
      const result1 = await store.increment("192.168.1.1", 900000);

      const result2 = await store.increment("192.168.1.2", 900000);

      expect(result1.count).toBe(3);
      expect(result2.count).toBe(1);
    });

    it("resets expired entries", async () => {
      // Create entry with very short window
      await store.increment("192.168.1.1", 1);

      // Wait for expiration
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Should reset
      const result = await store.increment("192.168.1.1", 900000);
      expect(result.count).toBe(1);
      expect(result.isNew).toBe(true);
    });
  });

  describe("size", () => {
    it("returns 0 for empty store", async () => {
      expect(await store.size()).toBe(0);
    });

    it("returns correct count after additions", async () => {
      await store.increment("192.168.1.1", 900000);
      await store.increment("192.168.1.2", 900000);
      await store.increment("192.168.1.3", 900000);

      expect(await store.size()).toBe(3);
    });

    it("same IP increments don't increase size", async () => {
      await store.increment("192.168.1.1", 900000);
      await store.increment("192.168.1.1", 900000);
      await store.increment("192.168.1.1", 900000);

      expect(await store.size()).toBe(1);
    });
  });

  describe("cleanup", () => {
    it("removes expired entries", async () => {
      // Create entries with very short window
      await store.increment("192.168.1.1", 1);
      await store.increment("192.168.1.2", 1);

      // Wait for expiration
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Cleanup
      await store.cleanup(1);

      expect(await store.size()).toBe(0);
    });

    it("keeps non-expired entries", async () => {
      await store.increment("192.168.1.1", 900000);
      await store.increment("192.168.1.2", 900000);

      await store.cleanup(900000);

      expect(await store.size()).toBe(2);
    });
  });

  describe("close", () => {
    it("clears all entries", async () => {
      await store.increment("192.168.1.1", 900000);
      await store.increment("192.168.1.2", 900000);

      await store.close();

      expect(await store.size()).toBe(0);
    });
  });

  describe("eviction", () => {
    it("evicts oldest entries when maxSize is reached", async () => {
      // Create store with small max size
      const smallStore = new InMemoryRateLimitStore(5);

      // Add 5 entries
      for (let i = 1; i <= 5; i++) {
        await smallStore.increment(`192.168.1.${i}`, 900000);
        // Small delay to ensure different timestamps
        await new Promise((resolve) => setTimeout(resolve, 1));
      }

      expect(await smallStore.size()).toBe(5);

      // Add 6th entry - should trigger eviction
      await smallStore.increment("192.168.1.6", 900000);

      // Size should be less than or equal to max (some entries evicted)
      const finalSize = await smallStore.size();
      expect(finalSize).toBeLessThanOrEqual(5);
    });
  });

  describe("window timing", () => {
    it("calculates correct reset time", async () => {
      const windowMs = 900000; // 15 minutes
      const before = Date.now();

      const result = await store.increment("192.168.1.1", windowMs);

      const after = Date.now();

      expect(result.resetTime).toBeGreaterThanOrEqual(before + windowMs);
      expect(result.resetTime).toBeLessThanOrEqual(after + windowMs);
    });

    it("maintains consistent reset time within window", async () => {
      const result1 = await store.increment("192.168.1.1", 900000);
      const result2 = await store.increment("192.168.1.1", 900000);

      // Reset time should be the same for both requests
      expect(result1.resetTime).toBe(result2.resetTime);
    });
  });
});

describe("RateLimitStore Interface Compliance", () => {
  it("InMemoryRateLimitStore implements all interface methods", () => {
    const store = new InMemoryRateLimitStore();

    expect(typeof store.increment).toBe("function");
    expect(typeof store.size).toBe("function");
    expect(typeof store.cleanup).toBe("function");
    expect(typeof store.close).toBe("function");
  });

  it("all methods return promises", async () => {
    const store = new InMemoryRateLimitStore();

    expect(store.increment("test", 1000)).toBeInstanceOf(Promise);
    expect(store.size()).toBeInstanceOf(Promise);
    expect(store.cleanup(1000)).toBeInstanceOf(Promise);
    expect(store.close()).toBeInstanceOf(Promise);
  });
});

describe("Edge Cases", () => {
  it("handles empty string key", async () => {
    const store = new InMemoryRateLimitStore();
    const result = await store.increment("", 900000);

    expect(result.count).toBe(1);
    expect(await store.size()).toBe(1);
  });

  it("handles very long keys", async () => {
    const store = new InMemoryRateLimitStore();
    const longKey = "x".repeat(1000);

    const result = await store.increment(longKey, 900000);

    expect(result.count).toBe(1);
  });

  it("handles zero window", async () => {
    const store = new InMemoryRateLimitStore();
    const result = await store.increment("test", 0);

    expect(result.count).toBe(1);
    expect(result.resetTime).toBeLessThanOrEqual(Date.now());
  });

  it("handles negative window gracefully", async () => {
    const store = new InMemoryRateLimitStore();
    const result = await store.increment("test", -1000);

    // Should still work, just with expired entries
    expect(result.count).toBe(1);
  });

  it("handles concurrent increments", async () => {
    const store = new InMemoryRateLimitStore();

    // Simulate concurrent requests
    const promises = Array.from({ length: 10 }, () =>
      store.increment("192.168.1.1", 900000)
    );

    const results = await Promise.all(promises);

    // All should have different counts (1-10)
    const counts = results.map((r) => r.count);
    expect(Math.max(...counts)).toBe(10);
  });
});
