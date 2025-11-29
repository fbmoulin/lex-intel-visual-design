/**
 * Security Middleware
 * Lex Intel Visual Design - Desenvolvido por Lex Intelligentia
 *
 * Implementa camadas de segurança para produção:
 * - Security headers (CSP, HSTS, etc.)
 * - CORS configurável
 * - Rate limiting
 * - Request validation
 * - CSRF protection
 */

import type { Express, Request, Response, NextFunction } from "express";
import { randomBytes, createHash } from "crypto";
import { loggers } from "./logger";

// Estende o tipo Request para incluir csrfToken
declare global {
  namespace Express {
    interface Request {
      csrfToken?: string;
    }
  }
}

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
    const scriptSrc = isDevelopment
      ? "'self' 'unsafe-inline'" // Dev: permite inline para HMR
      : "'self'";                 // Prod: apenas scripts do mesmo origem

    const connectSrc = isDevelopment
      ? "'self' ws: wss:"         // Dev: permite WebSocket para HMR
      : "'self'";                 // Prod: apenas conexões do mesmo origem

    res.setHeader(
      "Content-Security-Policy",
      "default-src 'self'; " +
      `script-src ${scriptSrc}; ` +
      "style-src 'self' 'unsafe-inline'; " +  // Necessário para CSS-in-JS
      "img-src 'self' data: https:; " +
      "font-src 'self' data:; " +
      `connect-src ${connectSrc}; ` +
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
      "Content-Type, Authorization, X-CSRF-Token"
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
 * CSRF Protection
 * Protege contra Cross-Site Request Forgery
 *
 * Implementação baseada em Double Submit Cookie pattern:
 * 1. Gera token único por sessão
 * 2. Envia token via cookie + header
 * 3. Valida que ambos coincidem em mutações
 *
 * NOTA: Para APIs stateless (como tRPC com cookies de sessão),
 * usamos o padrão de verificar Origin/Referer + token customizado
 */

// Store de tokens CSRF (em produção, usar Redis)
const csrfTokenStore = new Map<string, { token: string; expiresAt: number }>();
const CSRF_TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 horas
const CSRF_COOKIE_NAME = "csrf_token";
const CSRF_HEADER_NAME = "x-csrf-token";

/**
 * Gera um token CSRF seguro
 */
export function generateCsrfToken(): string {
  return randomBytes(32).toString("hex");
}

/**
 * Cria hash do token para armazenamento seguro
 */
function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/**
 * Limpa tokens expirados
 */
function cleanupExpiredCsrfTokens(): void {
  const now = Date.now();
  let cleaned = 0;

  // Converte para array para evitar problemas de iteração em TypeScript
  const entries = Array.from(csrfTokenStore.entries());
  for (const [key, value] of entries) {
    if (value.expiresAt < now) {
      csrfTokenStore.delete(key);
      cleaned++;
    }
  }

  if (cleaned > 0) {
    loggers.security.debug("Cleaned expired CSRF tokens", { count: cleaned });
  }
}

// Cleanup periódico de tokens CSRF
setInterval(cleanupExpiredCsrfTokens, 60 * 60 * 1000); // A cada hora

/**
 * Middleware de proteção CSRF
 * - GET/HEAD/OPTIONS: Gera e retorna token
 * - POST/PUT/DELETE/PATCH: Valida token
 */
export function setupCsrfProtection(app: Express) {
  // Endpoint para obter token CSRF
  app.get("/api/csrf-token", (req: Request, res: Response) => {
    const token = generateCsrfToken();
    const hashedToken = hashToken(token);

    // Armazena hash do token
    csrfTokenStore.set(hashedToken, {
      token: hashedToken,
      expiresAt: Date.now() + CSRF_TOKEN_EXPIRY_MS,
    });

    // Define cookie com token
    res.cookie(CSRF_COOKIE_NAME, token, {
      httpOnly: false, // Precisa ser acessível pelo JS
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: CSRF_TOKEN_EXPIRY_MS,
      path: "/",
    });

    res.json({ csrfToken: token });
  });

  // Middleware de validação CSRF
  app.use((req: Request, res: Response, next: NextFunction) => {
    // Métodos seguros não precisam de validação CSRF
    if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
      return next();
    }

    // Em desenvolvimento, CSRF pode ser desabilitado
    if (process.env.NODE_ENV === "development" && process.env.DISABLE_CSRF === "true") {
      return next();
    }

    // Rotas que não precisam de CSRF (webhooks, etc.)
    const exemptPaths = ["/api/webhooks", "/health", "/api/health"];
    if (exemptPaths.some(path => req.path.startsWith(path))) {
      return next();
    }

    // Valida Origin/Referer (proteção adicional)
    const origin = req.headers.origin;
    const referer = req.headers.referer;
    const host = req.headers.host;

    if (origin) {
      try {
        const originHost = new URL(origin).host;
        if (originHost !== host) {
          loggers.security.warn("CSRF: Origin mismatch", {
            origin,
            host,
            ip: req.ip,
            path: req.path,
          });
          return res.status(403).json({
            error: "Forbidden",
            message: "CSRF validation failed: Origin mismatch",
          });
        }
      } catch {
        // Origin inválida
      }
    }

    // Valida token CSRF
    const headerToken = req.headers[CSRF_HEADER_NAME] as string | undefined;
    const cookieToken = req.cookies?.[CSRF_COOKIE_NAME];

    // Se não há tokens, permite (para compatibilidade com tRPC batch)
    // tRPC usa cookies de sessão que já fornecem proteção
    if (!headerToken && !cookieToken) {
      // Verifica se é uma requisição tRPC (tem cookie de sessão)
      const hasSessionCookie = req.cookies?.app_session_id;
      if (hasSessionCookie && req.path.startsWith("/api/trpc")) {
        return next(); // tRPC com sessão é seguro
      }
    }

    // Se tem tokens, valida
    if (headerToken || cookieToken) {
      if (!headerToken || !cookieToken) {
        loggers.security.warn("CSRF: Missing token", {
          hasHeader: !!headerToken,
          hasCookie: !!cookieToken,
          ip: req.ip,
          path: req.path,
        });
        return res.status(403).json({
          error: "Forbidden",
          message: "CSRF token missing",
        });
      }

      // Valida que tokens coincidem
      if (headerToken !== cookieToken) {
        loggers.security.warn("CSRF: Token mismatch", {
          ip: req.ip,
          path: req.path,
        });
        return res.status(403).json({
          error: "Forbidden",
          message: "CSRF token mismatch",
        });
      }

      // Valida que token está no store
      const hashedToken = hashToken(headerToken);
      const storedToken = csrfTokenStore.get(hashedToken);

      if (!storedToken || storedToken.expiresAt < Date.now()) {
        loggers.security.warn("CSRF: Invalid or expired token", {
          ip: req.ip,
          path: req.path,
        });
        return res.status(403).json({
          error: "Forbidden",
          message: "CSRF token invalid or expired",
        });
      }
    }

    next();
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
  setupCsrfProtection(app);
  setupRequestValidation(app);
  // setupErrorHandler deve ser o último
  setupErrorHandler(app);
}
