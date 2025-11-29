/**
 * Rate Limit Store Abstraction
 * Lex Intel Visual Design - Desenvolvido por Lex Intelligentia
 *
 * Suporta múltiplos backends:
 * - In-Memory (padrão): Para single-instance deployments
 * - Redis (opcional): Para multi-instance deployments com estado compartilhado
 *
 * Uso:
 * - Por padrão, usa in-memory store
 * - Para Redis, defina REDIS_URL no ambiente
 */

import { loggers } from "./logger";

/**
 * Interface para Rate Limit Store
 */
export interface RateLimitStore {
  /**
   * Incrementa o contador para uma chave
   * @returns { count, resetTime, isNew }
   */
  increment(key: string, windowMs: number): Promise<{
    count: number;
    resetTime: number;
    isNew: boolean;
  }>;

  /**
   * Obtém o tamanho atual do store (para métricas)
   */
  size(): Promise<number>;

  /**
   * Limpa entradas expiradas
   */
  cleanup(windowMs: number): Promise<void>;

  /**
   * Fecha conexões (para graceful shutdown)
   */
  close(): Promise<void>;
}

/**
 * In-Memory Rate Limit Store
 * Adequado para single-instance deployments
 */
export class InMemoryRateLimitStore implements RateLimitStore {
  private store: Map<string, { count: number; resetTime: number }> = new Map();
  private maxSize: number;

  constructor(maxSize: number = 10000) {
    this.maxSize = maxSize;
  }

  async increment(key: string, windowMs: number): Promise<{
    count: number;
    resetTime: number;
    isNew: boolean;
  }> {
    const now = Date.now();
    const existing = this.store.get(key);

    // Evict se necessário
    if (this.store.size >= this.maxSize) {
      this.evictOldest();
    }

    // Chave não existe ou expirou
    if (!existing || now > existing.resetTime) {
      const resetTime = now + windowMs;
      this.store.set(key, { count: 1, resetTime });
      return { count: 1, resetTime, isNew: true };
    }

    // Incrementa contador existente
    existing.count++;
    return { count: existing.count, resetTime: existing.resetTime, isNew: false };
  }

  async size(): Promise<number> {
    return this.store.size;
  }

  async cleanup(windowMs: number): Promise<void> {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, value] of Array.from(this.store.entries())) {
      if (now > value.resetTime + windowMs) {
        keysToDelete.push(key);
      }
    }

    for (const key of keysToDelete) {
      this.store.delete(key);
    }

    if (keysToDelete.length > 0) {
      loggers.rateLimit.debug("Cleaned expired entries", { count: keysToDelete.length });
    }
  }

  async close(): Promise<void> {
    this.store.clear();
  }

  private evictOldest(): void {
    // Encontra entradas mais antigas e remove 10%
    const entries = Array.from(this.store.entries())
      .sort((a, b) => a[1].resetTime - b[1].resetTime);

    const toRemove = Math.ceil(this.maxSize * 0.1);
    for (let i = 0; i < toRemove && i < entries.length; i++) {
      this.store.delete(entries[i][0]);
    }

    loggers.rateLimit.debug("Evicted oldest entries", { count: toRemove });
  }
}

/**
 * Redis Rate Limit Store
 * Para multi-instance deployments
 *
 * Requer: pnpm add ioredis
 *
 * Usa Lua script para operação atômica de increment + expire
 *
 * NOTA: Esta classe usa dynamic import para evitar dependência obrigatória.
 * Se ioredis não estiver instalado, createRedisStore() retorna null.
 */

// Interface para Redis client (evita dependência de tipos)
interface RedisClient {
  eval(script: string, numKeys: number, ...args: (string | number)[]): Promise<unknown>;
  keys(pattern: string): Promise<string[]>;
  quit(): Promise<void>;
}

class RedisRateLimitStore implements RateLimitStore {
  private redis: RedisClient;
  private prefix: string;

  constructor(redis: RedisClient, prefix: string = "ratelimit:") {
    this.redis = redis;
    this.prefix = prefix;
  }

  async increment(key: string, windowMs: number): Promise<{
    count: number;
    resetTime: number;
    isNew: boolean;
  }> {
    const fullKey = `${this.prefix}${key}`;
    const windowSeconds = Math.ceil(windowMs / 1000);

    // Lua script para operação atômica
    const script = `
      local current = redis.call('INCR', KEYS[1])
      if current == 1 then
        redis.call('EXPIRE', KEYS[1], ARGV[1])
      end
      local ttl = redis.call('TTL', KEYS[1])
      return {current, ttl}
    `;

    try {
      const result = await this.redis.eval(script, 1, fullKey, windowSeconds);
      const [count, ttl] = result as [number, number];
      const resetTime = Date.now() + (ttl * 1000);

      return { count, resetTime, isNew: count === 1 };
    } catch (error) {
      loggers.rateLimit.error("Redis increment failed", error);
      // Em caso de erro, permite o request (fail-open)
      return { count: 1, resetTime: Date.now() + windowMs, isNew: true };
    }
  }

  async size(): Promise<number> {
    try {
      const keys = await this.redis.keys(`${this.prefix}*`);
      return keys.length;
    } catch {
      return 0;
    }
  }

  async cleanup(_windowMs: number): Promise<void> {
    // Redis TTL faz cleanup automaticamente
    // Nada a fazer aqui
  }

  async close(): Promise<void> {
    try {
      await this.redis.quit();
      loggers.rateLimit.info("Redis connection closed");
    } catch (error) {
      loggers.rateLimit.error("Error closing Redis connection", error);
    }
  }
}

/**
 * Tenta criar um Redis store (retorna null se ioredis não estiver disponível)
 */
async function createRedisStore(redisUrl: string): Promise<RateLimitStore | null> {
  try {
    // Dynamic import para evitar erro se ioredis não estiver instalado
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Redis = require("ioredis");
    const redis = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      retryDelayOnFailover: 100,
      lazyConnect: false,
      enableReadyCheck: true,
    });

    // Teste de conexão
    await redis.ping();

    loggers.rateLimit.info("Redis rate limit store connected");
    return new RedisRateLimitStore(redis as RedisClient);
  } catch (error) {
    loggers.rateLimit.warn("Redis unavailable", { error: String(error) });
    return null;
  }
}

/**
 * Factory para criar o store apropriado
 */
export async function createRateLimitStore(): Promise<RateLimitStore> {
  const redisUrl = process.env.REDIS_URL;

  if (redisUrl) {
    const redisStore = await createRedisStore(redisUrl);
    if (redisStore) {
      loggers.rateLimit.info("Using Redis rate limit store");
      return redisStore;
    }
    loggers.rateLimit.warn("Redis unavailable, falling back to in-memory");
  }

  const maxIps = parseInt(process.env.RATE_LIMIT_MAX_IPS || "10000");
  loggers.rateLimit.info("Using in-memory rate limit store", { maxIps });
  return new InMemoryRateLimitStore(maxIps);
}

// Export singleton para compatibilidade
let storeInstance: RateLimitStore | null = null;

export async function getRateLimitStore(): Promise<RateLimitStore> {
  if (!storeInstance) {
    storeInstance = await createRateLimitStore();
  }
  return storeInstance;
}

/**
 * Fecha o store (para graceful shutdown)
 */
export async function closeRateLimitStore(): Promise<void> {
  if (storeInstance) {
    await storeInstance.close();
    storeInstance = null;
  }
}
