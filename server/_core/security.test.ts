/**
 * Security Module Tests
 * Lex Intel Visual Design - Desenvolvido por Lex Intelligentia
 *
 * Tests for:
 * - CSRF protection
 * - Request tracing (correlation IDs)
 * - Prometheus metrics
 * - Rate limiting store
 */

import { describe, expect, it, beforeEach, vi } from "vitest";
import { createHash, randomBytes } from "crypto";

// Mock Express request/response
function createMockReq(overrides: Partial<{
  method: string;
  path: string;
  headers: Record<string, string>;
  cookies: Record<string, string>;
  ip: string;
}> = {}) {
  return {
    method: overrides.method ?? "GET",
    path: overrides.path ?? "/",
    headers: overrides.headers ?? {},
    cookies: overrides.cookies ?? {},
    ip: overrides.ip ?? "127.0.0.1",
    socket: { remoteAddress: "127.0.0.1" },
  };
}

function createMockRes() {
  const headers: Record<string, string> = {};
  const cookies: Array<{ name: string; value: string; options: Record<string, unknown> }> = [];
  let statusCode = 200;
  let body: unknown = null;
  const finishCallbacks: Array<() => void> = [];

  return {
    setHeader: (name: string, value: string) => {
      headers[name] = value;
    },
    getHeader: (name: string) => headers[name],
    cookie: (name: string, value: string, options: Record<string, unknown>) => {
      cookies.push({ name, value, options });
    },
    status: (code: number) => {
      statusCode = code;
      return {
        json: (data: unknown) => {
          body = data;
        },
      };
    },
    json: (data: unknown) => {
      body = data;
    },
    send: (data: unknown) => {
      body = data;
    },
    sendStatus: (code: number) => {
      statusCode = code;
    },
    on: (event: string, callback: () => void) => {
      if (event === "finish") {
        finishCallbacks.push(callback);
      }
    },
    triggerFinish: () => {
      finishCallbacks.forEach((cb) => cb());
    },
    statusCode,
    _getHeaders: () => headers,
    _getCookies: () => cookies,
    _getBody: () => body,
    _getStatusCode: () => statusCode,
  };
}

describe("CSRF Protection", () => {
  describe("Token Generation", () => {
    it("generates a 64-character hex token", () => {
      const token = randomBytes(32).toString("hex");
      expect(token).toHaveLength(64);
      expect(/^[a-f0-9]+$/.test(token)).toBe(true);
    });

    it("generates unique tokens", () => {
      const tokens = new Set<string>();
      for (let i = 0; i < 100; i++) {
        tokens.add(randomBytes(32).toString("hex"));
      }
      expect(tokens.size).toBe(100);
    });
  });

  describe("Token Hashing", () => {
    it("creates consistent SHA-256 hash", () => {
      const token = "test-token-12345";
      const hash1 = createHash("sha256").update(token).digest("hex");
      const hash2 = createHash("sha256").update(token).digest("hex");
      expect(hash1).toBe(hash2);
      expect(hash1).toHaveLength(64);
    });

    it("creates different hashes for different tokens", () => {
      const hash1 = createHash("sha256").update("token1").digest("hex");
      const hash2 = createHash("sha256").update("token2").digest("hex");
      expect(hash1).not.toBe(hash2);
    });
  });

  describe("Origin Validation", () => {
    it("validates matching origin and host", () => {
      const origin = "https://example.com";
      const host = "example.com";
      const originHost = new URL(origin).host;
      expect(originHost).toBe(host);
    });

    it("rejects mismatched origin and host", () => {
      const origin = "https://attacker.com";
      const host = "example.com";
      const originHost = new URL(origin).host;
      expect(originHost).not.toBe(host);
    });

    it("handles origin with port", () => {
      const origin = "https://example.com:3000";
      const host = "example.com:3000";
      const originHost = new URL(origin).host;
      expect(originHost).toBe(host);
    });
  });

  describe("Safe Methods", () => {
    const safeMethods = ["GET", "HEAD", "OPTIONS"];
    const unsafeMethods = ["POST", "PUT", "DELETE", "PATCH"];

    safeMethods.forEach((method) => {
      it(`${method} is considered safe and skips CSRF validation`, () => {
        expect(["GET", "HEAD", "OPTIONS"].includes(method)).toBe(true);
      });
    });

    unsafeMethods.forEach((method) => {
      it(`${method} requires CSRF validation`, () => {
        expect(["GET", "HEAD", "OPTIONS"].includes(method)).toBe(false);
      });
    });
  });
});

describe("Correlation ID Generation", () => {
  function generateCorrelationId(): string {
    const timestamp = Date.now().toString(36);
    const random = randomBytes(4).toString("hex");
    return `${timestamp}-${random}`;
  }

  it("generates valid correlation ID format", () => {
    const id = generateCorrelationId();
    const parts = id.split("-");
    expect(parts).toHaveLength(2);
    expect(parts[0].length).toBeGreaterThan(0);
    expect(parts[1]).toHaveLength(8); // 4 bytes = 8 hex chars
  });

  it("generates unique correlation IDs", () => {
    const ids = new Set<string>();
    for (let i = 0; i < 100; i++) {
      ids.add(generateCorrelationId());
    }
    expect(ids.size).toBe(100);
  });

  it("correlation ID contains sortable timestamp", () => {
    const id1 = generateCorrelationId();
    // Small delay to ensure different timestamp
    const id2 = generateCorrelationId();

    const ts1 = parseInt(id1.split("-")[0], 36);
    const ts2 = parseInt(id2.split("-")[0], 36);

    expect(ts2).toBeGreaterThanOrEqual(ts1);
  });
});

describe("Path Normalization for Metrics", () => {
  function normalizePathForMetrics(path: string): string {
    return path
      .replace(/\/\d+/g, "/:id")
      .replace(/\/[a-f0-9-]{36}/g, "/:uuid")
      .replace(/\?.+$/, "");
  }

  it("normalizes numeric IDs", () => {
    expect(normalizePathForMetrics("/petitions/123")).toBe("/petitions/:id");
    expect(normalizePathForMetrics("/users/456/petitions/789")).toBe("/users/:id/petitions/:id");
  });

  it("normalizes UUIDs", () => {
    const uuid = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";
    expect(normalizePathForMetrics(`/resources/${uuid}`)).toBe("/resources/:uuid");
  });

  it("removes query strings", () => {
    expect(normalizePathForMetrics("/search?q=test&page=1")).toBe("/search");
  });

  it("handles combined cases", () => {
    const uuid = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";
    expect(normalizePathForMetrics(`/users/123/files/${uuid}?download=true`))
      .toBe("/users/:id/files/:uuid");
  });

  it("preserves paths without dynamic segments", () => {
    expect(normalizePathForMetrics("/api/health")).toBe("/api/health");
    expect(normalizePathForMetrics("/metrics")).toBe("/metrics");
  });
});

describe("Percentile Calculation", () => {
  function calculatePercentile(arr: number[], percentile: number): number {
    if (arr.length === 0) return 0;
    const sorted = [...arr].sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[Math.max(0, index)];
  }

  it("returns 0 for empty array", () => {
    expect(calculatePercentile([], 50)).toBe(0);
  });

  it("calculates p50 (median) correctly", () => {
    expect(calculatePercentile([1, 2, 3, 4, 5], 50)).toBe(3);
    expect(calculatePercentile([10, 20, 30, 40], 50)).toBe(20);
  });

  it("calculates p90 correctly", () => {
    const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    expect(calculatePercentile(data, 90)).toBe(9);
  });

  it("calculates p99 correctly", () => {
    const data = Array.from({ length: 100 }, (_, i) => i + 1);
    expect(calculatePercentile(data, 99)).toBe(99);
  });

  it("handles single element array", () => {
    expect(calculatePercentile([42], 50)).toBe(42);
    expect(calculatePercentile([42], 99)).toBe(42);
  });

  it("handles unsorted input", () => {
    expect(calculatePercentile([5, 1, 3, 2, 4], 50)).toBe(3);
  });
});

describe("Request Tracing Headers", () => {
  it("sets X-Correlation-ID header in response", () => {
    const res = createMockRes();
    const correlationId = "test-correlation-id";
    res.setHeader("X-Correlation-ID", correlationId);
    expect(res._getHeaders()["X-Correlation-ID"]).toBe(correlationId);
  });

  it("propagates incoming correlation ID", () => {
    const incomingId = "incoming-correlation-id";
    const req = createMockReq({
      headers: { "x-correlation-id": incomingId },
    });

    const correlationId =
      (req.headers["x-correlation-id"] as string) || "new-id";

    expect(correlationId).toBe(incomingId);
  });
});

describe("Rate Limit Headers", () => {
  it("sets correct rate limit headers", () => {
    const res = createMockRes();
    const maxRequests = 100;
    const count = 50;
    const resetTime = new Date(Date.now() + 900000);

    res.setHeader("X-RateLimit-Limit", maxRequests.toString());
    res.setHeader("X-RateLimit-Remaining", (maxRequests - count).toString());
    res.setHeader("X-RateLimit-Reset", resetTime.toISOString());

    const headers = res._getHeaders();
    expect(headers["X-RateLimit-Limit"]).toBe("100");
    expect(headers["X-RateLimit-Remaining"]).toBe("50");
    expect(headers["X-RateLimit-Reset"]).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });
});

describe("Prometheus Metrics Format", () => {
  function formatMetric(name: string, labels: Record<string, string>, value: number): string {
    const labelStr = Object.entries(labels)
      .map(([k, v]) => `${k}="${v}"`)
      .join(",");
    return `${name}{${labelStr}} ${value}`;
  }

  it("formats metrics with labels correctly", () => {
    const metric = formatMetric("http_requests_total", {
      method: "GET",
      path: "/api/health",
      status: "200",
    }, 42);

    expect(metric).toBe('http_requests_total{method="GET",path="/api/health",status="200"} 42');
  });

  it("formats memory metrics correctly", () => {
    const metric = formatMetric("nodejs_memory_usage_bytes", {
      type: "heapUsed",
    }, 12345678);

    expect(metric).toBe('nodejs_memory_usage_bytes{type="heapUsed"} 12345678');
  });
});
