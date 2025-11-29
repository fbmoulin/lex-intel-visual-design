/**
 * Caching Layer with Redis Support
 * Lex Intel Visual Design - Desenvolvido por Lex Intelligentia
 *
 * Abstração de cache com suporte a múltiplos backends:
 * - In-Memory (padrão): Para desenvolvimento e single-instance
 * - Redis (via REDIS_URL): Para produção e multi-instance
 *
 * CONFIGURAÇÃO:
 * - REDIS_URL: URL do Redis para cache distribuído
 * - CACHE_TTL_SECONDS: TTL padrão em segundos (default: 300 = 5 min)
 * - CACHE_MAX_SIZE: Tamanho máximo do cache in-memory (default: 1000)
 */

import { loggers } from "./logger";

/**
 * Interface para Cache Store
 */
export interface CacheStore {
  /**
   * Obtém um valor do cache
   */
  get<T>(key: string): Promise<T | null>;

  /**
   * Define um valor no cache com TTL opcional
   */
  set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;

  /**
   * Remove um valor do cache
   */
  delete(key: string): Promise<void>;

  /**
   * Remove valores que começam com um prefixo
   */
  deleteByPrefix(prefix: string): Promise<void>;

  /**
   * Limpa todo o cache
   */
  clear(): Promise<void>;

  /**
   * Verifica se uma chave existe
   */
  has(key: string): Promise<boolean>;

  /**
   * Obtém estatísticas do cache
   */
  stats(): Promise<CacheStats>;

  /**
   * Fecha conexões
   */
  close(): Promise<void>;
}

export interface CacheStats {
  size: number;
  hits: number;
  misses: number;
  hitRate: number;
}

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

/**
 * In-Memory Cache Store
 */
export class InMemoryCacheStore implements CacheStore {
  private cache: Map<string, CacheEntry<unknown>> = new Map();
  private maxSize: number;
  private defaultTtl: number;
  private hits = 0;
  private misses = 0;

  constructor(maxSize: number = 1000, defaultTtlSeconds: number = 300) {
    this.maxSize = maxSize;
    this.defaultTtl = defaultTtlSeconds * 1000;

    // Cleanup periódico
    setInterval(() => this.cleanup(), 60000); // A cada minuto
  }

  async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key);

    if (!entry) {
      this.misses++;
      return null;
    }

    if (entry.expiresAt < Date.now()) {
      this.cache.delete(key);
      this.misses++;
      return null;
    }

    this.hits++;
    return entry.value as T;
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    // Evict se necessário
    if (this.cache.size >= this.maxSize) {
      this.evictOldest();
    }

    const ttl = ttlSeconds ? ttlSeconds * 1000 : this.defaultTtl;
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttl,
    });
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async deleteByPrefix(prefix: string): Promise<void> {
    const keysToDelete: string[] = [];
    const keys = Array.from(this.cache.keys());

    for (const key of keys) {
      if (key.startsWith(prefix)) {
        keysToDelete.push(key);
      }
    }

    for (const key of keysToDelete) {
      this.cache.delete(key);
    }
  }

  async clear(): Promise<void> {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
  }

  async has(key: string): Promise<boolean> {
    const entry = this.cache.get(key);
    if (!entry) return false;
    if (entry.expiresAt < Date.now()) {
      this.cache.delete(key);
      return false;
    }
    return true;
  }

  async stats(): Promise<CacheStats> {
    const total = this.hits + this.misses;
    return {
      size: this.cache.size,
      hits: this.hits,
      misses: this.misses,
      hitRate: total > 0 ? this.hits / total : 0,
    };
  }

  async close(): Promise<void> {
    this.cache.clear();
  }

  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];
    const entries = Array.from(this.cache.entries());

    for (const [key, entry] of entries) {
      if (entry.expiresAt < now) {
        keysToDelete.push(key);
      }
    }

    for (const key of keysToDelete) {
      this.cache.delete(key);
    }

    if (keysToDelete.length > 0) {
      loggers.database.debug("Cache cleanup", { removed: keysToDelete.length });
    }
  }

  private evictOldest(): void {
    // Remove 10% das entradas mais antigas
    const entries = Array.from(this.cache.entries())
      .sort((a, b) => a[1].expiresAt - b[1].expiresAt);

    const toRemove = Math.ceil(this.maxSize * 0.1);
    for (let i = 0; i < toRemove && i < entries.length; i++) {
      this.cache.delete(entries[i][0]);
    }
  }
}

/**
 * Redis Cache Store
 */
class RedisCacheStore implements CacheStore {
  private redis: {
    get(key: string): Promise<string | null>;
    set(key: string, value: string, mode: string, ttl: number): Promise<void>;
    del(key: string): Promise<void>;
    keys(pattern: string): Promise<string[]>;
    flushdb(): Promise<void>;
    exists(key: string): Promise<number>;
    info(section: string): Promise<string>;
    quit(): Promise<void>;
  };
  private prefix: string;
  private defaultTtl: number;
  private hits = 0;
  private misses = 0;

  constructor(redis: unknown, prefix: string = "cache:", defaultTtlSeconds: number = 300) {
    this.redis = redis as RedisCacheStore["redis"];
    this.prefix = prefix;
    this.defaultTtl = defaultTtlSeconds;
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this.redis.get(`${this.prefix}${key}`);
      if (!data) {
        this.misses++;
        return null;
      }
      this.hits++;
      return JSON.parse(data) as T;
    } catch (error) {
      loggers.database.error("Redis cache get failed", error);
      this.misses++;
      return null;
    }
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    try {
      const ttl = ttlSeconds ?? this.defaultTtl;
      await this.redis.set(
        `${this.prefix}${key}`,
        JSON.stringify(value),
        "EX",
        ttl
      );
    } catch (error) {
      loggers.database.error("Redis cache set failed", error);
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.redis.del(`${this.prefix}${key}`);
    } catch (error) {
      loggers.database.error("Redis cache delete failed", error);
    }
  }

  async deleteByPrefix(prefix: string): Promise<void> {
    try {
      const keys = await this.redis.keys(`${this.prefix}${prefix}*`);
      for (const key of keys) {
        await this.redis.del(key);
      }
    } catch (error) {
      loggers.database.error("Redis cache deleteByPrefix failed", error);
    }
  }

  async clear(): Promise<void> {
    try {
      const keys = await this.redis.keys(`${this.prefix}*`);
      for (const key of keys) {
        await this.redis.del(key);
      }
      this.hits = 0;
      this.misses = 0;
    } catch (error) {
      loggers.database.error("Redis cache clear failed", error);
    }
  }

  async has(key: string): Promise<boolean> {
    try {
      const exists = await this.redis.exists(`${this.prefix}${key}`);
      return exists > 0;
    } catch {
      return false;
    }
  }

  async stats(): Promise<CacheStats> {
    const total = this.hits + this.misses;
    let size = 0;

    try {
      const keys = await this.redis.keys(`${this.prefix}*`);
      size = keys.length;
    } catch {
      // Ignore
    }

    return {
      size,
      hits: this.hits,
      misses: this.misses,
      hitRate: total > 0 ? this.hits / total : 0,
    };
  }

  async close(): Promise<void> {
    try {
      await this.redis.quit();
    } catch (error) {
      loggers.database.error("Redis cache close failed", error);
    }
  }
}

/**
 * Factory para criar o cache apropriado
 */
async function createCacheStore(): Promise<CacheStore> {
  const redisUrl = process.env.REDIS_URL;
  const defaultTtl = parseInt(process.env.CACHE_TTL_SECONDS || "300");
  const maxSize = parseInt(process.env.CACHE_MAX_SIZE || "1000");

  if (redisUrl) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const Redis = require("ioredis");
      const redis = new Redis(redisUrl, {
        maxRetriesPerRequest: 3,
        lazyConnect: false,
      });

      await redis.ping();

      loggers.database.info("Using Redis cache store");
      return new RedisCacheStore(redis, "cache:", defaultTtl);
    } catch (error) {
      loggers.database.warn("Redis cache unavailable, using in-memory", { error: String(error) });
    }
  }

  loggers.database.info("Using in-memory cache store", { maxSize, defaultTtl });
  return new InMemoryCacheStore(maxSize, defaultTtl);
}

// Singleton
let cacheInstance: CacheStore | null = null;

/**
 * Obtém a instância do cache
 */
export async function getCache(): Promise<CacheStore> {
  if (!cacheInstance) {
    cacheInstance = await createCacheStore();
  }
  return cacheInstance;
}

/**
 * Fecha o cache
 */
export async function closeCache(): Promise<void> {
  if (cacheInstance) {
    await cacheInstance.close();
    cacheInstance = null;
  }
}

/**
 * Helper: Cache com função de fallback
 */
export async function cacheOrFetch<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttlSeconds?: number
): Promise<T> {
  const cache = await getCache();

  // Tenta obter do cache
  const cached = await cache.get<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Busca e armazena no cache
  const value = await fetchFn();
  await cache.set(key, value, ttlSeconds);

  return value;
}

/**
 * Helper: Invalidar cache de um usuário
 */
export async function invalidateUserCache(userId: number): Promise<void> {
  const cache = await getCache();
  await cache.deleteByPrefix(`user:${userId}:`);
}

/**
 * Helper: Gerar chave de cache para petição
 */
export function petitionCacheKey(userId: number, petitionId: number): string {
  return `user:${userId}:petition:${petitionId}`;
}

/**
 * Helper: Gerar chave de cache para lista de petições
 */
export function petitionsListCacheKey(userId: number, filters?: string): string {
  return `user:${userId}:petitions:${filters || "all"}`;
}

export default {
  getCache,
  closeCache,
  cacheOrFetch,
  invalidateUserCache,
  petitionCacheKey,
  petitionsListCacheKey,
};
