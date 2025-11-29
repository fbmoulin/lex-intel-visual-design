/**
 * Logger Estruturado com Pino
 * Lex Intel Visual Design - Desenvolvido por Lex Intelligentia
 *
 * Implementação de logger de alta performance usando Pino.
 * - JSON estruturado para produção
 * - Pretty print para desenvolvimento
 * - Suporte a contextos e child loggers
 * - Compatível com a interface anterior
 */

import pino, { Logger as PinoLogger, LoggerOptions as PinoLoggerOptions } from "pino";

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  context: string;
  message: string;
  data?: Record<string, unknown>;
}

interface LoggerOptions {
  context: string;
  minLevel?: LogLevel;
}

// Mapeia níveis para Pino
const PINO_LEVELS: Record<LogLevel, string> = {
  debug: "debug",
  info: "info",
  warn: "warn",
  error: "error",
};

// Configuração base do Pino
function createPinoOptions(): PinoLoggerOptions {
  const isDevelopment = process.env.NODE_ENV !== "production";
  const level = process.env.LOG_LEVEL || (isDevelopment ? "debug" : "info");

  return {
    level,
    // Formato customizado para incluir contexto
    formatters: {
      level: (label) => ({ level: label }),
      bindings: () => ({}), // Remove pid e hostname por padrão
    },
    // Timestamp ISO
    timestamp: pino.stdTimeFunctions.isoTime,
  };
}

// Instância base do Pino
let basePino: PinoLogger;

/**
 * Inicializa o logger Pino (lazy loading)
 */
function getBasePino(): PinoLogger {
  if (!basePino) {
    const isDevelopment = process.env.NODE_ENV !== "production";
    const options = createPinoOptions();

    if (isDevelopment && process.stdout.isTTY) {
      // Pretty print para desenvolvimento
      basePino = pino(options, pino.transport({
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
          messageFormat: "{context} - {msg}",
        },
      }));
    } else {
      // JSON para produção
      basePino = pino(options);
    }
  }
  return basePino;
}

/**
 * Classe Logger com interface compatível
 * Wrapper sobre Pino mantendo a API existente
 */
class Logger {
  private pinoLogger: PinoLogger;
  private context: string;

  constructor(options: LoggerOptions) {
    this.context = options.context;
    this.pinoLogger = getBasePino().child({ context: options.context });

    if (options.minLevel) {
      this.pinoLogger.level = PINO_LEVELS[options.minLevel];
    }
  }

  /**
   * Log de debug - apenas em desenvolvimento
   */
  debug(message: string, data?: Record<string, unknown>): void {
    if (data) {
      this.pinoLogger.debug(data, message);
    } else {
      this.pinoLogger.debug(message);
    }
  }

  /**
   * Log informativo
   */
  info(message: string, data?: Record<string, unknown>): void {
    if (data) {
      this.pinoLogger.info(data, message);
    } else {
      this.pinoLogger.info(message);
    }
  }

  /**
   * Log de aviso
   */
  warn(message: string, data?: Record<string, unknown>): void {
    if (data) {
      this.pinoLogger.warn(data, message);
    } else {
      this.pinoLogger.warn(message);
    }
  }

  /**
   * Log de erro
   */
  error(message: string, error?: Error | unknown, data?: Record<string, unknown>): void {
    const errorData: Record<string, unknown> = { ...data };

    if (error instanceof Error) {
      errorData.err = {
        name: error.name,
        message: error.message,
        stack: process.env.NODE_ENV !== "production" ? error.stack : undefined,
      };
    } else if (error !== undefined) {
      errorData.error = String(error);
    }

    if (Object.keys(errorData).length > 0) {
      this.pinoLogger.error(errorData, message);
    } else {
      this.pinoLogger.error(message);
    }
  }

  /**
   * Cria um logger filho com contexto adicional
   */
  child(subContext: string): Logger {
    const childLogger = new Logger({
      context: `${this.context}:${subContext}`,
    });
    return childLogger;
  }

  /**
   * Acesso direto ao logger Pino (para casos avançados)
   */
  get pino(): PinoLogger {
    return this.pinoLogger;
  }
}

/**
 * Factory para criar loggers
 */
export function createLogger(context: string, minLevel?: LogLevel): Logger {
  return new Logger({ context, minLevel });
}

/**
 * Logger padrão para uso geral
 */
export const logger = createLogger("App");

/**
 * Loggers pré-configurados para módulos comuns
 */
export const loggers = {
  server: createLogger("Server"),
  database: createLogger("Database"),
  auth: createLogger("Auth"),
  oauth: createLogger("OAuth"),
  api: createLogger("API"),
  security: createLogger("Security"),
  rateLimit: createLogger("RateLimit"),
  http: createLogger("HTTP"),
  metrics: createLogger("Metrics"),
} as const;

/**
 * Logger para requests HTTP (formato CLF-like)
 */
export function createHttpLogger() {
  return getBasePino().child({ context: "HTTP" });
}

/**
 * Express middleware para logging de requests
 */
export function httpLoggerMiddleware() {
  const httpLogger = createHttpLogger();

  return (req: { method: string; url: string; ip?: string }, res: { statusCode: number; on: (event: string, cb: () => void) => void }, next: () => void) => {
    const startTime = Date.now();

    res.on("finish", () => {
      const duration = Date.now() - startTime;
      httpLogger.info({
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        ip: req.ip,
      }, `${req.method} ${req.url} ${res.statusCode} ${duration}ms`);
    });

    next();
  };
}

// Exporta tipo para uso externo
export type { Logger, LogLevel, LogEntry };
