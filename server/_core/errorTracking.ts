/**
 * Error Tracking with Sentry
 * Lex Intel Visual Design - Desenvolvido por Lex Intelligentia
 *
 * Integração com Sentry para monitoramento de erros em produção.
 *
 * CONFIGURAÇÃO:
 * - SENTRY_DSN: DSN do projeto Sentry (obrigatório para ativar)
 * - SENTRY_ENVIRONMENT: Ambiente (production, staging, development)
 * - SENTRY_RELEASE: Versão da aplicação
 *
 * INSTALAÇÃO (quando necessário):
 * pnpm add @sentry/node
 */

import type { Express, Request, Response, NextFunction } from "express";
import { loggers } from "./logger";

// Tipos para Sentry (evita dependência obrigatória)
interface SentryScope {
  setUser(user: { id: string; email?: string }): void;
  setTag(key: string, value: string): void;
  setExtra(key: string, value: unknown): void;
  setContext(name: string, context: Record<string, unknown>): void;
}

interface SentryClient {
  init(options: Record<string, unknown>): void;
  captureException(error: Error, scope?: unknown): string;
  captureMessage(message: string, level?: string): string;
  withScope(callback: (scope: SentryScope) => void): void;
  Handlers: {
    requestHandler(): (req: Request, res: Response, next: NextFunction) => void;
    errorHandler(): (err: Error, req: Request, res: Response, next: NextFunction) => void;
  };
}

// Sentry client (carregado dinamicamente)
let Sentry: SentryClient | null = null;
let isInitialized = false;

/**
 * Verifica se o Sentry está habilitado
 */
export function isSentryEnabled(): boolean {
  return isInitialized && Sentry !== null;
}

/**
 * Inicializa o Sentry
 */
export async function initSentry(): Promise<boolean> {
  const dsn = process.env.SENTRY_DSN;

  if (!dsn) {
    loggers.server.info("Sentry disabled: SENTRY_DSN not configured");
    return false;
  }

  try {
    // Dynamic import para evitar erro se @sentry/node não estiver instalado
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    Sentry = require("@sentry/node") as SentryClient;

    Sentry.init({
      dsn,
      environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV || "development",
      release: process.env.SENTRY_RELEASE || "lex-intel-visual-design@1.2.0-beta",
      tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
      profilesSampleRate: 0.1,
      integrations: [],
      beforeSend(event: Record<string, unknown>) {
        // Filtra erros em desenvolvimento
        if (process.env.NODE_ENV === "development") {
          return null;
        }
        return event;
      },
    });

    isInitialized = true;
    loggers.server.info("Sentry initialized", {
      environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV,
    });

    return true;
  } catch (error) {
    loggers.server.warn("Sentry initialization failed", { error: String(error) });
    return false;
  }
}

/**
 * Captura uma exceção no Sentry
 */
export function captureException(
  error: Error,
  context?: {
    user?: { id: number | string; email?: string };
    tags?: Record<string, string>;
    extra?: Record<string, unknown>;
  }
): string | null {
  if (!isSentryEnabled() || !Sentry) {
    // Fallback: log local
    loggers.server.error("Exception captured (Sentry disabled)", error, context?.extra);
    return null;
  }

  let eventId: string = "";

  Sentry.withScope((scope) => {
    if (context?.user) {
      scope.setUser({ id: String(context.user.id), email: context.user.email });
    }

    if (context?.tags) {
      Object.entries(context.tags).forEach(([key, value]) => {
        scope.setTag(key, value);
      });
    }

    if (context?.extra) {
      Object.entries(context.extra).forEach(([key, value]) => {
        scope.setExtra(key, value);
      });
    }

    eventId = Sentry!.captureException(error);
  });

  return eventId;
}

/**
 * Captura uma mensagem no Sentry
 */
export function captureMessage(
  message: string,
  level: "info" | "warning" | "error" = "info"
): string | null {
  if (!isSentryEnabled() || !Sentry) {
    loggers.server.info(`Message captured (Sentry disabled): ${message}`);
    return null;
  }

  return Sentry.captureMessage(message, level);
}

/**
 * Middleware para captura de erros Express
 */
export function setupErrorTracking(app: Express): void {
  if (!isSentryEnabled() || !Sentry) {
    loggers.server.info("Error tracking middleware skipped (Sentry disabled)");
    return;
  }

  // Request handler deve ser o primeiro middleware
  app.use(Sentry.Handlers.requestHandler());
}

/**
 * Error handler para Express (deve ser registrado após todas as rotas)
 */
export function setupErrorHandler(app: Express): void {
  if (!isSentryEnabled() || !Sentry) {
    return;
  }

  // Error handler deve ser o último
  app.use(Sentry.Handlers.errorHandler());
}

/**
 * Wrapper para funções async que captura erros automaticamente
 */
export function withErrorTracking<T>(
  fn: () => Promise<T>,
  context?: { operation: string; extra?: Record<string, unknown> }
): Promise<T> {
  return fn().catch((error) => {
    captureException(error instanceof Error ? error : new Error(String(error)), {
      tags: context?.operation ? { operation: context.operation } : undefined,
      extra: context?.extra,
    });
    throw error;
  });
}

/**
 * Decorator para métodos que devem ter erros rastreados
 */
export function trackErrors(operation: string) {
  return function (
    _target: unknown,
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: unknown[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (error) {
        captureException(error instanceof Error ? error : new Error(String(error)), {
          tags: { operation },
          extra: { args: JSON.stringify(args).substring(0, 1000) },
        });
        throw error;
      }
    };

    return descriptor;
  };
}

export default {
  init: initSentry,
  isEnabled: isSentryEnabled,
  captureException,
  captureMessage,
  setupErrorTracking,
  setupErrorHandler,
  withErrorTracking,
  trackErrors,
};
