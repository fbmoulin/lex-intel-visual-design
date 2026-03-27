/**
 * Audit Logging Module
 * Lex Intel Visual Design - Desenvolvido por Lex Intelligentia
 *
 * Tracks sensitive operations for compliance (LGPD/GDPR):
 * - Authentication events (login, logout, session)
 * - Data operations (create, update, delete, export)
 * - Security events (access denied, suspicious activity)
 *
 * CONFIGURATION:
 * - AUDIT_LOG_ENABLED: Enable/disable audit logging (default: true)
 * - AUDIT_LOG_RETENTION_DAYS: Days to retain logs (default: 90)
 */

import { loggers } from "./logger";

/**
 * Audit event types
 */
export type AuditAction =
  // Authentication
  | "auth.login"
  | "auth.logout"
  | "auth.session_created"
  | "auth.session_expired"
  | "auth.session_invalid"
  // Data operations
  | "petition.create"
  | "petition.update"
  | "petition.delete"
  | "petition.read"
  | "petition.list"
  | "petition.export"
  // User data (LGPD)
  | "user.data_export"
  | "user.data_delete"
  | "user.consent_granted"
  | "user.consent_revoked"
  // Security events
  | "security.access_denied"
  | "security.suspicious_content"
  | "security.rate_limited"
  | "security.csrf_violation";

export type AuditResult = "success" | "failure" | "blocked" | "sanitized";

export interface AuditContext {
  correlationId?: string;
  userId?: number;
  openId?: string;
  userEmail?: string;
  ip?: string;
  userAgent?: string;
  path?: string;
  method?: string;
}

export interface AuditEventData {
  action: AuditAction;
  result: AuditResult;
  resourceType?: string;
  resourceId?: number | string;
  details?: Record<string, unknown>;
  reason?: string;
}

export interface AuditEntry extends AuditContext, AuditEventData {
  timestamp: string;
  version: string;
  [key: string]: unknown; // Index signature for Record<string, unknown> compatibility
}

/**
 * Main audit logging function
 * All sensitive operations should call this function
 */
export function audit(
  context: AuditContext,
  event: AuditEventData
): void {
  const enabled = process.env.AUDIT_LOG_ENABLED !== "false";
  if (!enabled) return;

  const entry: AuditEntry = {
    timestamp: new Date().toISOString(),
    version: "1.0",
    ...context,
    ...event,
  };

  // Log based on result
  if (event.result === "failure" || event.result === "blocked") {
    loggers.security.warn("Audit event", entry);
  } else {
    loggers.security.info("Audit event", entry);
  }
}

/**
 * Audit helper for authentication events
 */
export function auditAuth(
  context: AuditContext,
  action: Extract<AuditAction, `auth.${string}`>,
  result: AuditResult,
  details?: Record<string, unknown>
): void {
  audit(context, {
    action,
    result,
    resourceType: "session",
    details,
  });
}

/**
 * Audit helper for petition operations
 */
export function auditPetition(
  context: AuditContext,
  action: Extract<AuditAction, `petition.${string}`>,
  result: AuditResult,
  petitionId?: number,
  details?: Record<string, unknown>
): void {
  audit(context, {
    action,
    result,
    resourceType: "petition",
    resourceId: petitionId,
    details,
  });
}

/**
 * Audit helper for user data operations (LGPD)
 */
export function auditUserData(
  context: AuditContext,
  action: Extract<AuditAction, `user.${string}`>,
  result: AuditResult,
  details?: Record<string, unknown>
): void {
  audit(context, {
    action,
    result,
    resourceType: "user_data",
    details,
  });
}

/**
 * Audit helper for security events
 */
export function auditSecurity(
  context: AuditContext,
  action: Extract<AuditAction, `security.${string}`>,
  result: AuditResult,
  reason?: string,
  details?: Record<string, unknown>
): void {
  audit(context, {
    action,
    result,
    resourceType: "security",
    reason,
    details,
  });
}

/**
 * Extract audit context from Express request
 */
export function getAuditContext(req: {
  headers?: Record<string, string | string[] | undefined>;
  ip?: string;
  path?: string;
  method?: string;
  correlationId?: string;
}): AuditContext {
  const headers = req.headers || {};
  return {
    correlationId: req.correlationId || (headers["x-correlation-id"] as string),
    ip: req.ip || (headers["x-forwarded-for"] as string)?.split(",")[0]?.trim(),
    userAgent: (headers["user-agent"] as string)?.substring(0, 200),
    path: req.path,
    method: req.method,
  };
}

/**
 * Extract audit context from tRPC context
 */
export function getAuditContextFromTrpc(ctx: {
  req: {
    headers?: Record<string, string | string[] | undefined>;
    ip?: string;
    path?: string;
    method?: string;
    correlationId?: string;
  };
  user?: {
    id: number;
    openId: string;
    email?: string | null;
  } | null;
}): AuditContext {
  const baseContext = getAuditContext(ctx.req);

  if (ctx.user) {
    return {
      ...baseContext,
      userId: ctx.user.id,
      openId: ctx.user.openId,
      userEmail: ctx.user.email || undefined,
    };
  }

  return baseContext;
}

export default {
  audit,
  auditAuth,
  auditPetition,
  auditUserData,
  auditSecurity,
  getAuditContext,
  getAuditContextFromTrpc,
};
