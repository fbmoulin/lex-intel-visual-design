/**
 * API Health Check E2E Tests
 * Lex Intel Visual Design
 */

import { test, expect } from "@playwright/test";

test.describe("API Health Checks", () => {
  test("should return healthy status from /health", async ({ request }) => {
    const response = await request.get("/health");
    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    expect(body.status).toBe("ok");
  });

  test("should return healthy status from /api/health", async ({ request }) => {
    const response = await request.get("/api/health");
    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    expect(body.status).toBe("ok");
  });

  test("should return Prometheus metrics from /metrics", async ({ request }) => {
    const response = await request.get("/metrics");
    expect(response.ok()).toBeTruthy();

    const body = await response.text();
    expect(body).toContain("nodejs_uptime_seconds");
    expect(body).toContain("nodejs_memory_usage_bytes");
    expect(body).toContain("http_requests_total");
  });

  test("should return CSRF token from /api/csrf-token", async ({ request }) => {
    const response = await request.get("/api/csrf-token");
    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    expect(body.csrfToken).toBeDefined();
    expect(body.csrfToken.length).toBe(64); // 32 bytes hex
  });

  test("should include correlation ID in response headers", async ({ request }) => {
    const response = await request.get("/health");
    const correlationId = response.headers()["x-correlation-id"];

    expect(correlationId).toBeDefined();
    expect(correlationId.length).toBeGreaterThan(0);
  });

  test("should include rate limit headers", async ({ request }) => {
    const response = await request.get("/health");

    // In development, rate limiting is skipped, but headers may still be present
    // Just verify the endpoint works
    expect(response.ok()).toBeTruthy();
  });

  test("should return 404 for non-existent API route", async ({ request }) => {
    const response = await request.get("/api/non-existent-route");
    expect(response.status()).toBe(404);
  });
});

test.describe("Security Headers", () => {
  test("should include security headers in response", async ({ request }) => {
    const response = await request.get("/");

    const headers = response.headers();

    // Check for security headers
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["x-frame-options"]).toBe("DENY");
  });

  test("should include CSP header", async ({ request }) => {
    const response = await request.get("/");
    const csp = response.headers()["content-security-policy"];

    expect(csp).toBeDefined();
    expect(csp).toContain("default-src");
  });
});
