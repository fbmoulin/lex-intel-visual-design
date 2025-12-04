/**
 * Client-side Rate Limiter Tests
 * Lex Intel Visual Design - Desenvolvido por Lex Intelligentia
 * @vitest-environment jsdom
 */

import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import {
  checkRateLimit,
  consumeRateLimit,
  resetRateLimit,
  getRemainingRequests,
  RateLimiters,
} from "./rateLimit";

describe("rateLimit", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Reset time mocks
    vi.useRealTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("checkRateLimit", () => {
    it("allows first request", () => {
      const result = checkRateLimit("test-action");
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(9); // 10 max - 1 consumed
      expect(result.retryAfterMs).toBe(0);
    });

    it("allows requests up to the limit", () => {
      const config = { maxRequests: 3, windowMs: 60000 };

      // First 3 requests should be allowed
      expect(checkRateLimit("test", config).allowed).toBe(true);
      expect(checkRateLimit("test", config).allowed).toBe(true);
      expect(checkRateLimit("test", config).allowed).toBe(true);

      // 4th request should be blocked
      const result = checkRateLimit("test", config);
      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
      expect(result.retryAfterMs).toBeGreaterThan(0);
    });

    it("tracks different actions independently", () => {
      const config = { maxRequests: 2, windowMs: 60000 };

      // Use up action1
      checkRateLimit("action1", config);
      checkRateLimit("action1", config);
      expect(checkRateLimit("action1", config).allowed).toBe(false);

      // action2 should still be available
      expect(checkRateLimit("action2", config).allowed).toBe(true);
    });

    it("resets after time window expires", () => {
      vi.useFakeTimers();
      const config = { maxRequests: 2, windowMs: 1000 };

      // Use up limit
      checkRateLimit("timed", config);
      checkRateLimit("timed", config);
      expect(checkRateLimit("timed", config).allowed).toBe(false);

      // Advance time past the window
      vi.advanceTimersByTime(1001);

      // Should be allowed again
      expect(checkRateLimit("timed", config).allowed).toBe(true);
    });

    it("provides correct retryAfterMs", () => {
      vi.useFakeTimers();
      const now = Date.now();
      vi.setSystemTime(now);

      const config = { maxRequests: 1, windowMs: 5000 };

      // First request
      checkRateLimit("retry-test", config);

      // Advance 2 seconds
      vi.advanceTimersByTime(2000);

      // Should have about 3 seconds remaining
      const result = checkRateLimit("retry-test", config);
      expect(result.allowed).toBe(false);
      expect(result.retryAfterMs).toBeLessThanOrEqual(3000);
      expect(result.retryAfterMs).toBeGreaterThan(2000);
    });

    it("uses custom key prefix", () => {
      const config = { maxRequests: 1, keyPrefix: "custom_" };

      checkRateLimit("action", config);
      expect(localStorage.getItem("custom_action")).not.toBeNull();
    });
  });

  describe("consumeRateLimit", () => {
    it("returns true when allowed", () => {
      expect(consumeRateLimit("consume-test")).toBe(true);
    });

    it("returns false when rate limited", () => {
      const config = { maxRequests: 1, windowMs: 60000 };
      consumeRateLimit("consume-test2", config);
      expect(consumeRateLimit("consume-test2", config)).toBe(false);
    });
  });

  describe("resetRateLimit", () => {
    it("clears rate limit for an action", () => {
      const config = { maxRequests: 1, windowMs: 60000 };

      // Hit the limit
      consumeRateLimit("reset-test", config);
      expect(consumeRateLimit("reset-test", config)).toBe(false);

      // Reset
      resetRateLimit("reset-test");

      // Should be allowed again
      expect(consumeRateLimit("reset-test", config)).toBe(true);
    });

    it("only affects the specified action", () => {
      const config = { maxRequests: 1, windowMs: 60000 };

      consumeRateLimit("action-a", config);
      consumeRateLimit("action-b", config);

      resetRateLimit("action-a");

      expect(consumeRateLimit("action-a", config)).toBe(true);
      expect(consumeRateLimit("action-b", config)).toBe(false);
    });
  });

  describe("getRemainingRequests", () => {
    it("returns max requests when no requests made", () => {
      expect(getRemainingRequests("new-action")).toBe(10);
    });

    it("returns remaining count after requests", () => {
      const config = { maxRequests: 5, windowMs: 60000 };

      checkRateLimit("remaining-test", config);
      checkRateLimit("remaining-test", config);

      expect(getRemainingRequests("remaining-test", config)).toBe(3);
    });

    it("returns 0 when limit reached", () => {
      const config = { maxRequests: 2, windowMs: 60000 };

      checkRateLimit("zero-test", config);
      checkRateLimit("zero-test", config);

      expect(getRemainingRequests("zero-test", config)).toBe(0);
    });
  });

  describe("RateLimiters", () => {
    it("createPetition allows 5 requests per minute", () => {
      for (let i = 0; i < 5; i++) {
        expect(RateLimiters.createPetition().allowed).toBe(true);
      }
      expect(RateLimiters.createPetition().allowed).toBe(false);
    });

    it("export allows 10 requests per minute", () => {
      for (let i = 0; i < 10; i++) {
        expect(RateLimiters.export().allowed).toBe(true);
      }
      expect(RateLimiters.export().allowed).toBe(false);
    });

    it("aiChat allows 20 requests per minute", () => {
      for (let i = 0; i < 20; i++) {
        expect(RateLimiters.aiChat().allowed).toBe(true);
      }
      expect(RateLimiters.aiChat().allowed).toBe(false);
    });

    it("formSubmit allows 3 requests per 30 seconds", () => {
      for (let i = 0; i < 3; i++) {
        expect(RateLimiters.formSubmit().allowed).toBe(true);
      }
      expect(RateLimiters.formSubmit().allowed).toBe(false);
    });

    it("templateLoad allows 30 requests per minute", () => {
      for (let i = 0; i < 30; i++) {
        expect(RateLimiters.templateLoad().allowed).toBe(true);
      }
      expect(RateLimiters.templateLoad().allowed).toBe(false);
    });
  });

  describe("edge cases", () => {
    it("handles localStorage being unavailable", () => {
      const originalGetItem = localStorage.getItem;
      const originalSetItem = localStorage.setItem;

      // Mock localStorage to throw
      localStorage.getItem = vi.fn(() => {
        throw new Error("localStorage not available");
      });
      localStorage.setItem = vi.fn(() => {
        throw new Error("localStorage not available");
      });

      // Should not throw, just allow the request
      expect(() => checkRateLimit("error-test")).not.toThrow();

      // Restore
      localStorage.getItem = originalGetItem;
      localStorage.setItem = originalSetItem;
    });

    it("handles corrupted localStorage data", () => {
      localStorage.setItem("rl_corrupt", "not-valid-json");

      // Should not throw, treat as no entry
      const result = checkRateLimit("corrupt");
      expect(result.allowed).toBe(true);
    });

    it("handles expired entries", () => {
      vi.useFakeTimers();
      const now = Date.now();
      vi.setSystemTime(now);

      // Manually set an expired entry
      localStorage.setItem(
        "rl_expired",
        JSON.stringify({
          count: 10,
          resetTime: now - 1000, // Already expired
        })
      );

      // Should treat as new entry
      const result = checkRateLimit("expired");
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(9);
    });
  });
});
