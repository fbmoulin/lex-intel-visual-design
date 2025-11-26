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

/**
 * Configuração de Security Headers
 * Baseado em OWASP e Node.js Security Best Practices
 */
export function setupSecurityHeaders(app: Express) {
  // Content Security Policy
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader(
      "Content-Security-Policy",
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
      "style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' data: https:; " +
      "font-src 'self' data:; " +
      "connect-src 'self';"
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
 * Rate Limiting simples
 * Previne DoS e brute force attacks
 */
interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const rateLimitStore: RateLimitStore = {};

export function setupRateLimit(app: Express) {
  const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"); // 15 min
  const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100");

  app.use((req: Request, res: Response, next: NextFunction) => {
    // Skip rate limiting em desenvolvimento
    if (process.env.NODE_ENV === "development") {
      return next();
    }

    const ip = req.ip || req.socket.remoteAddress || "unknown";
    const now = Date.now();

    if (!rateLimitStore[ip]) {
      rateLimitStore[ip] = {
        count: 1,
        resetTime: now + windowMs,
      };
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

  // Limpa registros antigos a cada hora
  setInterval(() => {
    const now = Date.now();
    Object.keys(rateLimitStore).forEach((ip) => {
      if (now > rateLimitStore[ip].resetTime + windowMs) {
        delete rateLimitStore[ip];
      }
    });
  }, 3600000); // 1 hora
}

/**
 * Request Validation
 * Valida tamanho e tipo de requests
 */
export function setupRequestValidation(app: Express) {
  // Valida Content-Type para POST/PUT
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (["POST", "PUT", "PATCH"].includes(req.method)) {
      const contentType = req.headers["content-type"];
      if (contentType && !contentType.includes("application/json") && !contentType.includes("multipart/form-data")) {
        res.status(415).json({
          error: "Unsupported Media Type",
          message: "Content-Type must be application/json or multipart/form-data",
        });
        return;
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
    console.error("Error:", err);

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
