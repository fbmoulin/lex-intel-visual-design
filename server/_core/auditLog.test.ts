/**
 * Audit Logging Tests
 * Lex Intel Visual Design - Desenvolvido por Lex Intelligentia
 *
 * Tests for the audit logging module
 */

import { describe, expect, it, beforeEach, vi } from "vitest";
import {
  audit,
  auditAuth,
  auditPetition,
  auditUserData,
  auditSecurity,
  getAuditContext,
  getAuditContextFromTrpc,
  type AuditContext,
  type AuditAction,
  type AuditResult,
} from "./auditLog";

// Mock the logger
vi.mock("./logger", () => ({
  loggers: {
    security: {
      info: vi.fn(),
      warn: vi.fn(),
    },
  },
}));

import { loggers } from "./logger";

describe("Audit Logging Module", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset environment
    delete process.env.AUDIT_LOG_ENABLED;
  });

  describe("audit()", () => {
    it("logs success events as info", () => {
      const context: AuditContext = {
        userId: 1,
        ip: "192.168.1.1",
      };

      audit(context, {
        action: "petition.create",
        result: "success",
        resourceType: "petition",
        resourceId: 123,
      });

      expect(loggers.security.info).toHaveBeenCalledWith(
        "Audit event",
        expect.objectContaining({
          action: "petition.create",
          result: "success",
          userId: 1,
          resourceId: 123,
        })
      );
    });

    it("logs failure events as warn", () => {
      const context: AuditContext = {
        userId: 1,
        ip: "192.168.1.1",
      };

      audit(context, {
        action: "user.data_export",
        result: "failure",
        reason: "Database error",
      });

      expect(loggers.security.warn).toHaveBeenCalledWith(
        "Audit event",
        expect.objectContaining({
          action: "user.data_export",
          result: "failure",
          reason: "Database error",
        })
      );
    });

    it("logs blocked events as warn", () => {
      const context: AuditContext = {
        ip: "10.0.0.1",
      };

      audit(context, {
        action: "security.suspicious_content",
        result: "blocked",
        reason: "XSS attempt",
      });

      expect(loggers.security.warn).toHaveBeenCalled();
    });

    it("includes timestamp and version in log entry", () => {
      audit({}, {
        action: "auth.login",
        result: "success",
      });

      expect(loggers.security.info).toHaveBeenCalledWith(
        "Audit event",
        expect.objectContaining({
          timestamp: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
          version: "1.0",
        })
      );
    });

    it("respects AUDIT_LOG_ENABLED=false", () => {
      process.env.AUDIT_LOG_ENABLED = "false";

      audit({}, {
        action: "auth.login",
        result: "success",
      });

      expect(loggers.security.info).not.toHaveBeenCalled();
      expect(loggers.security.warn).not.toHaveBeenCalled();
    });
  });

  describe("auditAuth()", () => {
    it("logs authentication events with session resource type", () => {
      const context: AuditContext = {
        userId: 1,
        openId: "oauth-123",
      };

      auditAuth(context, "auth.login", "success", {
        loginMethod: "google",
      });

      expect(loggers.security.info).toHaveBeenCalledWith(
        "Audit event",
        expect.objectContaining({
          action: "auth.login",
          resourceType: "session",
          details: { loginMethod: "google" },
        })
      );
    });

    it("logs logout events", () => {
      const context: AuditContext = {
        userId: 1,
      };

      auditAuth(context, "auth.logout", "success");

      expect(loggers.security.info).toHaveBeenCalledWith(
        "Audit event",
        expect.objectContaining({
          action: "auth.logout",
          resourceType: "session",
        })
      );
    });
  });

  describe("auditPetition()", () => {
    it("logs petition create with id", () => {
      const context: AuditContext = { userId: 1 };

      auditPetition(context, "petition.create", "success", 456, {
        templateType: "peticao_inicial",
      });

      expect(loggers.security.info).toHaveBeenCalledWith(
        "Audit event",
        expect.objectContaining({
          action: "petition.create",
          resourceType: "petition",
          resourceId: 456,
          details: { templateType: "peticao_inicial" },
        })
      );
    });

    it("logs petition update", () => {
      const context: AuditContext = { userId: 1 };

      auditPetition(context, "petition.update", "success", 789, {
        updatedFields: ["title", "fatos"],
      });

      expect(loggers.security.info).toHaveBeenCalledWith(
        "Audit event",
        expect.objectContaining({
          action: "petition.update",
          resourceId: 789,
        })
      );
    });

    it("logs petition delete", () => {
      const context: AuditContext = { userId: 1 };

      auditPetition(context, "petition.delete", "success", 123);

      expect(loggers.security.info).toHaveBeenCalledWith(
        "Audit event",
        expect.objectContaining({
          action: "petition.delete",
          resourceId: 123,
        })
      );
    });
  });

  describe("auditUserData()", () => {
    it("logs data export events", () => {
      const context: AuditContext = { userId: 1 };

      auditUserData(context, "user.data_export", "success", {
        petitionCount: 5,
      });

      expect(loggers.security.info).toHaveBeenCalledWith(
        "Audit event",
        expect.objectContaining({
          action: "user.data_export",
          resourceType: "user_data",
        })
      );
    });

    it("logs consent events", () => {
      const context: AuditContext = { userId: 1 };

      auditUserData(context, "user.consent_granted", "success", {
        consentType: "privacy_policy",
        version: "1.0.0",
      });

      expect(loggers.security.info).toHaveBeenCalledWith(
        "Audit event",
        expect.objectContaining({
          action: "user.consent_granted",
        })
      );
    });
  });

  describe("auditSecurity()", () => {
    it("logs security events with reason", () => {
      const context: AuditContext = { ip: "192.168.1.1" };

      auditSecurity(
        context,
        "security.suspicious_content",
        "blocked",
        "XSS attempt detected",
        { field: "fatos" }
      );

      expect(loggers.security.warn).toHaveBeenCalledWith(
        "Audit event",
        expect.objectContaining({
          action: "security.suspicious_content",
          result: "blocked",
          reason: "XSS attempt detected",
          resourceType: "security",
        })
      );
    });

    it("logs rate limit events", () => {
      const context: AuditContext = { ip: "10.0.0.1" };

      auditSecurity(
        context,
        "security.rate_limited",
        "blocked",
        "Too many requests",
        { count: 150, limit: 100 }
      );

      expect(loggers.security.warn).toHaveBeenCalled();
    });
  });

  describe("getAuditContext()", () => {
    it("extracts context from request", () => {
      const req = {
        ip: "192.168.1.1",
        path: "/api/petitions",
        method: "POST",
        headers: {
          "user-agent": "Mozilla/5.0",
          "x-correlation-id": "abc-123",
        },
      };

      const context = getAuditContext(req);

      expect(context).toEqual({
        correlationId: "abc-123",
        ip: "192.168.1.1",
        userAgent: "Mozilla/5.0",
        path: "/api/petitions",
        method: "POST",
      });
    });

    it("uses x-forwarded-for if ip is not set", () => {
      const req = {
        path: "/api/test",
        method: "GET",
        headers: {
          "x-forwarded-for": "10.0.0.1, 192.168.1.1",
        },
      };

      const context = getAuditContext(req);

      expect(context.ip).toBe("10.0.0.1");
    });

    it("truncates long user agent", () => {
      const longUserAgent = "A".repeat(300);
      const req = {
        headers: {
          "user-agent": longUserAgent,
        },
      };

      const context = getAuditContext(req);

      expect(context.userAgent?.length).toBe(200);
    });

    it("handles missing headers gracefully", () => {
      const req = {};

      const context = getAuditContext(req);

      expect(context).toEqual({
        correlationId: undefined,
        ip: undefined,
        userAgent: undefined,
        path: undefined,
        method: undefined,
      });
    });
  });

  describe("getAuditContextFromTrpc()", () => {
    it("includes user info when present", () => {
      const ctx = {
        req: {
          ip: "192.168.1.1",
          path: "/api/trpc",
          method: "POST",
          headers: {},
        },
        user: {
          id: 123,
          openId: "oauth-abc",
          email: "user@example.com",
        },
      };

      const context = getAuditContextFromTrpc(ctx);

      expect(context).toEqual(expect.objectContaining({
        userId: 123,
        openId: "oauth-abc",
        userEmail: "user@example.com",
      }));
    });

    it("handles null user", () => {
      const ctx = {
        req: {
          ip: "192.168.1.1",
          headers: {},
        },
        user: null,
      };

      const context = getAuditContextFromTrpc(ctx);

      expect(context.userId).toBeUndefined();
      expect(context.openId).toBeUndefined();
    });

    it("handles undefined user", () => {
      const ctx = {
        req: {
          ip: "192.168.1.1",
          headers: {},
        },
      };

      const context = getAuditContextFromTrpc(ctx);

      expect(context.userId).toBeUndefined();
    });

    it("converts null email to undefined", () => {
      const ctx = {
        req: { headers: {} },
        user: {
          id: 1,
          openId: "abc",
          email: null,
        },
      };

      const context = getAuditContextFromTrpc(ctx);

      expect(context.userEmail).toBeUndefined();
    });
  });
});

describe("Audit Action Types", () => {
  const authActions: AuditAction[] = [
    "auth.login",
    "auth.logout",
    "auth.session_created",
    "auth.session_expired",
    "auth.session_invalid",
  ];

  const petitionActions: AuditAction[] = [
    "petition.create",
    "petition.update",
    "petition.delete",
    "petition.read",
    "petition.list",
    "petition.export",
  ];

  const userActions: AuditAction[] = [
    "user.data_export",
    "user.data_delete",
    "user.consent_granted",
    "user.consent_revoked",
  ];

  const securityActions: AuditAction[] = [
    "security.access_denied",
    "security.suspicious_content",
    "security.rate_limited",
    "security.csrf_violation",
  ];

  it("all auth actions can be used with auditAuth", () => {
    authActions.forEach((action) => {
      expect(() => {
        auditAuth({}, action as Extract<AuditAction, `auth.${string}`>, "success");
      }).not.toThrow();
    });
  });

  it("all petition actions can be used with auditPetition", () => {
    petitionActions.forEach((action) => {
      expect(() => {
        auditPetition({}, action as Extract<AuditAction, `petition.${string}`>, "success");
      }).not.toThrow();
    });
  });

  it("all user actions can be used with auditUserData", () => {
    userActions.forEach((action) => {
      expect(() => {
        auditUserData({}, action as Extract<AuditAction, `user.${string}`>, "success");
      }).not.toThrow();
    });
  });

  it("all security actions can be used with auditSecurity", () => {
    securityActions.forEach((action) => {
      expect(() => {
        auditSecurity({}, action as Extract<AuditAction, `security.${string}`>, "blocked");
      }).not.toThrow();
    });
  });
});

describe("Audit Result Types", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("success uses info log level", () => {
    audit({}, { action: "auth.login", result: "success" });
    expect(loggers.security.info).toHaveBeenCalled();
    expect(loggers.security.warn).not.toHaveBeenCalled();
  });

  it("failure uses warn log level", () => {
    audit({}, { action: "auth.login", result: "failure" });
    expect(loggers.security.warn).toHaveBeenCalled();
    expect(loggers.security.info).not.toHaveBeenCalled();
  });

  it("blocked uses warn log level", () => {
    audit({}, { action: "security.access_denied", result: "blocked" });
    expect(loggers.security.warn).toHaveBeenCalled();
    expect(loggers.security.info).not.toHaveBeenCalled();
  });
});
