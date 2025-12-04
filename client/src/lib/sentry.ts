/**
 * Sentry Client Configuration
 * Lex Intel Visual Design - Desenvolvido por Lex Intelligentia
 *
 * Client-side error tracking and performance monitoring.
 * Configured via environment variable VITE_SENTRY_DSN.
 */

import * as Sentry from "@sentry/react";

/**
 * Check if Sentry should be initialized
 */
export function shouldInitSentry(): boolean {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  return Boolean(dsn && typeof dsn === "string" && dsn.length > 0);
}

/**
 * Initialize Sentry for client-side error tracking
 */
export function initSentry(): void {
  if (!shouldInitSentry()) {
    console.debug("[Sentry] Disabled: VITE_SENTRY_DSN not configured");
    return;
  }

  const dsn = import.meta.env.VITE_SENTRY_DSN;
  const environment = import.meta.env.VITE_SENTRY_ENVIRONMENT || import.meta.env.MODE || "development";
  const release = import.meta.env.VITE_SENTRY_RELEASE || "lex-intel-visual-design@1.2.0-beta";

  Sentry.init({
    dsn,
    environment,
    release,

    // Performance Monitoring
    tracesSampleRate: environment === "production" ? 0.1 : 1.0,

    // Session Replay (optional)
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    // Integrations
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],

    // Filter out known non-error events
    beforeSend(event, hint) {
      const error = hint.originalException;

      // Ignore network errors that are expected
      if (error instanceof Error) {
        // Ignore auth redirects
        if (error.message.includes("UNAUTHORIZED")) {
          return null;
        }
        // Ignore aborted requests
        if (error.name === "AbortError") {
          return null;
        }
      }

      return event;
    },

    // Don't send events in development by default
    enabled: environment !== "development" || import.meta.env.VITE_SENTRY_ENABLED === "true",
  });

  console.debug("[Sentry] Initialized", { environment, release });
}

/**
 * Capture an exception with additional context
 */
export function captureException(
  error: Error,
  context?: {
    tags?: Record<string, string>;
    extra?: Record<string, unknown>;
    user?: { id?: string; email?: string };
  }
): string | undefined {
  if (!shouldInitSentry()) {
    console.error("[Error]", error, context);
    return undefined;
  }

  if (context?.user) {
    Sentry.setUser(context.user);
  }

  return Sentry.captureException(error, {
    tags: context?.tags,
    extra: context?.extra,
  });
}

/**
 * Set user context for Sentry
 */
export function setUser(user: { id: string; email?: string; name?: string } | null): void {
  if (!shouldInitSentry()) return;
  Sentry.setUser(user);
}

/**
 * Add breadcrumb for user navigation/actions
 */
export function addBreadcrumb(
  message: string,
  category: "navigation" | "user" | "api" | "ui",
  data?: Record<string, unknown>
): void {
  if (!shouldInitSentry()) return;

  Sentry.addBreadcrumb({
    message,
    category,
    data,
    level: "info",
  });
}

/**
 * Create a Sentry-wrapped error boundary
 */
export const SentryErrorBoundary = Sentry.ErrorBoundary;

export default {
  initSentry,
  captureException,
  setUser,
  addBreadcrumb,
  shouldInitSentry,
  SentryErrorBoundary,
};
