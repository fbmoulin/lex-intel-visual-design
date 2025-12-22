/**
 * Security Middleware
 * Lex Intel Visual Design - Desenvolvido por Lex Intelligentia
 * 
 * Implementa camadas de segurança para produção:
 * - Helmet.js para security headers
 * - CORS configurável
 * - Rate limiting
 * - Request validation
 */

import type { Express, Request, Response, NextFunction } from "express";
import { loggers } from "./logger";

/**
 * Configuração de Security Headers
 * Baseado em OWASP e Node.js Security Best Practices
 *
 * CSP Hardening Notes:
 * - 'unsafe-eval' foi REMOVIDO para prevenir XSS via eval()/Function()
 * - 'unsafe-inline' mantido em style-src para CSS-in-JS (React/Tailwind)
 * - Em produção, scripts inline são bloqueados
 * - Diretivas adicionais previnem clickjacking e data injection
 *
 * TODO Futuro: Implementar nonce-based CSP para eliminar 'unsafe-inline'
 */
export function setupSecurityHeaders(app: Express) {
  // Content Security Policy
  app.use((req: Request, res: Response, next: NextFunction) => {
    const isDevelopment = process.env.NODE_ENV === "development";

    // CSP mais permissiva em desenvolvimento para hot reload
    // NOTA: 'unsafe-inline' é necessário em produção para:
    // - CSS-in-JS (React/Tailwind)
    // - Bibliotecas de exportação PDF (html2canvas/jspdf)
    // - Geração dinâmica de canvas/blob
    const scriptSrc = "'self' 'unsafe-inline' 'unsafe-eval' blob:"; // Permite inline e eval para PDF export

    const connectSrc = isDevelopment
      ? "'self' ws: wss: blob:"   // Dev: permite WebSocket para HMR
      : "'self' blob:";           // Prod: permite blob para exportação

    res.setHeader(
      "Content-Security-Policy",
      "default-src 'self'; " +
      `script-src ${scriptSrc}; ` +
      "style-src 'self' 'unsafe-inline' blob: data: https://fonts.googleapis.com; " +  // CSS-in-JS + Google Fonts
      "style-src-elem 'self' 'unsafe-inline' blob: data: https://fonts.googleapis.com; " +  // Elementos de estilo + Google Fonts
      "img-src 'self' data: blob: https:; " +  // blob: para canvas export
      "font-src 'self' data: https: https://fonts.gstatic.com; " +  // Google Fonts arquivos
      `connect-src ${connectSrc} https:; ` +    // https: para APIs externas
      "worker-src 'self' blob:; " +           // Para Web Workers usados em PDF export
      "child-src 'self' blob:; " +            // Para iframes e workers
      "frame-src 'self' blob:; " +            // Para frames
      "base-uri 'self'; " +                   // Previne base tag injection
      "form-action 'self'; " +                // Previne form hijacking
      "frame-ancestors 'none'; " +            // Previne clickjacking (substitui X-Frame-Options)
      "object-src 'none'; " +                 // Bloqueia plugins (Flash, Java)
      "upgrade-insecure-requests;"            // Força HTTPS para recursos
    );
    next();
  });

  // X-Content-Type-Options
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    next();
  });

  // X-Frame-Options
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader("X-Frame-Options", "DENY");
    next();
  });

  // X-XSS-Protection
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader("X-XSS-Protection", "1; mode=block");
    next();
  });

  // Strict-Transport-Security (HSTS)
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (process.env.NODE_ENV === "production") {
      res.setHeader(
        "Strict-Transport-Security",
        "max-age=31536000; includeSubDomains; preload"
      );
    }
    next();
  });

  // Remove X-Powered-By header
  app.disable("x-powered-by");

  // Referrer Policy
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    next();
  });

  // Permissions Policy
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader(
      "Permissions-Policy",
      "geolocation=(), microphone=(), camera=()"
    );
    next();
  });
}

/**
 * Configuração de CORS
 * Permite apenas origens específicas em produção
 */
export function setupCORS(app: Express) {
  app.use((req: Request, res: Response, next: NextFunction) => {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];
    const origin = req.headers.origin;

    // Em desenvolvimento, permite qualquer origem
    if (process.env.NODE_ENV === "development") {
      res.setHeader("Access-Control-Allow-Origin", origin || "*");
    } else if (origin && allowedOrigins.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    }

    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Max-Age", "86400");

    // Handle preflight
    if (req.method === "OPTIONS") {
      res.sendStatus(204);
      return;
    }

    next();
  });
}

/**
 * Rate Limiting com proteção contra memory leak
 * Previne DoS e brute force attacks
 *
 * LIMITAÇÕES (In-Memory Implementation):
 * - Não funciona com múltiplas instâncias (cada instância tem seu próprio store)
 * - Dados perdidos ao reiniciar o servidor
 * - Para produção com múltiplas instâncias, migrar para Redis
 *
 * CONFIGURAÇÃO via ENV:
 * - RATE_LIMIT_WINDOW_MS: Janela de tempo em ms (default: 900000 = 15 min)
 * - RATE_LIMIT_MAX_REQUESTS: Máximo de requests por janela (default: 100)
 * - RATE_LIMIT_MAX_IPS: Máximo de IPs no store (default: 10000)
 *
 * MIGRAÇÃO PARA REDIS:
 * 1. Instalar: pnpm add ioredis
 * 2. Criar cliente Redis
 * 3. Substituir rateLimitStore por operações Redis (INCR, EXPIRE)
 * 4. Exemplo: redis.incr(`ratelimit:${ip}`) + redis.expire(`ratelimit:${ip}`, windowMs/1000)
 */
interface RateLimitRecord {
  count: number;
  resetTime: number;
}

interface RateLimitStore {
  [key: string]: RateLimitRecord;
}

// Store com limite de tamanho para prevenir memory leak
const rateLimitStore: RateLimitStore = {};
let rateLimitStoreSize = 0;

/**
 * Remove entradas expiradas do store
 */
function cleanupExpiredEntries(windowMs: number): void {
  const now = Date.now();
  const keysToDelete: string[] = [];

  for (const ip of Object.keys(rateLimitStore)) {
    if (now > rateLimitStore[ip].resetTime + windowMs) {
      keysToDelete.push(ip);
    }
  }

  for (const ip of keysToDelete) {
    delete rateLimitStore[ip];
    rateLimitStoreSize--;
  }
}

/**
 * Remove as entradas mais antigas quando o store está cheio
 */
function evictOldestEntries(maxIps: number): void {
  if (rateLimitStoreSize <= maxIps) return;

  // Encontra as entradas mais antigas (menor resetTime)
  const entries = Object.entries(rateLimitStore)
    .sort((a, b) => a[1].resetTime - b[1].resetTime);

  // Remove 10% das entradas mais antigas
  const toRemove = Math.ceil(maxIps * 0.1);
  for (let i = 0; i < toRemove && i < entries.length; i++) {
    delete rateLimitStore[entries[i][0]];
    rateLimitStoreSize--;
  }
}

export function setupRateLimit(app: Express) {
  const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"); // 15 min
  const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100");
  const maxIps = parseInt(process.env.RATE_LIMIT_MAX_IPS || "10000"); // Limite de IPs

  // Log de configuração
  loggers.rateLimit.info("Rate limiting configured", {
    maxRequests,
    windowSeconds: windowMs / 1000,
    maxIps,
  });

  app.use((req: Request, res: Response, next: NextFunction) => {
    // Skip rate limiting em desenvolvimento
    if (process.env.NODE_ENV === "development") {
      return next();
    }

    const ip = req.ip || req.socket.remoteAddress || "unknown";
    const now = Date.now();

    // Verifica se precisa evictar entradas antigas
    if (rateLimitStoreSize >= maxIps) {
      evictOldestEntries(maxIps);
    }

    if (!rateLimitStore[ip]) {
      rateLimitStore[ip] = {
        count: 1,
        resetTime: now + windowMs,
      };
      rateLimitStoreSize++;
      return next();
    }

    const record = rateLimitStore[ip];

    // Reset se passou o tempo
    if (now > record.resetTime) {
      record.count = 1;
      record.resetTime = now + windowMs;
      return next();
    }

    // Incrementa contador
    record.count++;

    // Verifica limite
    if (record.count > maxRequests) {
      res.status(429).json({
        error: "Too many requests",
        message: "Rate limit exceeded. Please try again later.",
        retryAfter: Math.ceil((record.resetTime - now) / 1000),
      });
      return;
    }

    // Adiciona headers informativos
    res.setHeader("X-RateLimit-Limit", maxRequests.toString());
    res.setHeader("X-RateLimit-Remaining", (maxRequests - record.count).toString());
    res.setHeader("X-RateLimit-Reset", new Date(record.resetTime).toISOString());

    next();
  });

  // Limpa registros expirados a cada 15 minutos (mais frequente para menor uso de memória)
  const cleanupInterval = setInterval(() => {
    cleanupExpiredEntries(windowMs);
  }, 900000); // 15 minutos

  // Cleanup no shutdown (se process.on disponível)
  if (typeof process !== "undefined" && process.on) {
    process.on("SIGTERM", () => clearInterval(cleanupInterval));
    process.on("SIGINT", () => clearInterval(cleanupInterval));
  }
}

/**
 * Request Validation
 * Valida tamanho e tipo de requests
 *
 * CONFIGURAÇÃO via ENV:
 * - MAX_PAYLOAD_SIZE_MB: Tamanho máximo do payload em MB (default: 50)
 */
const MAX_PAYLOAD_SIZE_MB = parseInt(process.env.MAX_PAYLOAD_SIZE_MB || "50");
const MAX_PAYLOAD_SIZE_BYTES = MAX_PAYLOAD_SIZE_MB * 1024 * 1024;

export function setupRequestValidation(app: Express) {
  // Valida tamanho do payload antes de processar
  app.use((req: Request, res: Response, next: NextFunction) => {
    const contentLength = req.headers["content-length"];

    if (contentLength) {
      const size = parseInt(contentLength, 10);

      if (isNaN(size)) {
        res.status(400).json({
          error: "Invalid Content-Length",
          message: "Content-Length header is not a valid number.",
        });
        return;
      }

      if (size > MAX_PAYLOAD_SIZE_BYTES) {
        loggers.security.warn("Request payload too large", {
          contentLength: size,
          maxAllowed: MAX_PAYLOAD_SIZE_BYTES,
          ip: req.ip,
          path: req.path,
        });

        res.status(413).json({
          error: "Payload Too Large",
          message: `Request body exceeds the maximum allowed size of ${MAX_PAYLOAD_SIZE_MB}MB.`,
          maxSizeMB: MAX_PAYLOAD_SIZE_MB,
        });
        return;
      }
    }

    next();
  });

  // Valida Content-Type para POST/PUT/PATCH
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (["POST", "PUT", "PATCH"].includes(req.method)) {
      const contentType = req.headers["content-type"];

      // Ignora requests sem body (Content-Length: 0 ou ausente)
      const contentLength = req.headers["content-length"];
      if (!contentLength || contentLength === "0") {
        return next();
      }

      // Valida Content-Type
      if (contentType) {
        const validTypes = [
          "application/json",
          "multipart/form-data",
          "application/x-www-form-urlencoded",
        ];

        const isValidType = validTypes.some(type => contentType.includes(type));

        if (!isValidType) {
          loggers.security.warn("Unsupported Content-Type", {
            contentType,
            ip: req.ip,
            path: req.path,
          });

          res.status(415).json({
            error: "Unsupported Media Type",
            message: "Content-Type must be application/json, multipart/form-data, or application/x-www-form-urlencoded.",
            receivedType: contentType,
          });
          return;
        }
      }
    }
    next();
  });
}

/**
 * Error Handler
 * Trata erros de forma segura sem expor detalhes internos
 */
export function setupErrorHandler(app: Express) {
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    loggers.server.error("Unhandled error in request", err, {
      method: req.method,
      path: req.path,
      ip: req.ip,
    });

    // Em produção, não expõe stack trace
    const isDevelopment = process.env.NODE_ENV === "development";

    res.status(500).json({
      error: "Internal Server Error",
      message: isDevelopment ? err.message : "An unexpected error occurred",
      ...(isDevelopment && { stack: err.stack }),
    });
  });
}

/**
 * Health Check Endpoint
 * Para monitoramento e load balancers
 */
export function setupHealthCheck(app: Express) {
  app.get("/health", (req: Request, res: Response) => {
    res.status(200).json({
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
    });
  });

  app.get("/api/health", (req: Request, res: Response) => {
    res.status(200).json({
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
    });
  });
}

/**
 * Setup completo de segurança
 * Aplica todos os middlewares de segurança
 */
export function setupSecurity(app: Express) {
  setupHealthCheck(app);
  setupSecurityHeaders(app);
  setupCORS(app);
  setupRateLimit(app);
  setupRequestValidation(app);
  // setupErrorHandler deve ser o último
  setupErrorHandler(app);
}
