/**
 * Client-side Rate Limiter
 * Lex Intel Visual Design - Desenvolvido por Lex Intelligentia
 *
 * Prevents spam and abuse on client-side before requests hit the server.
 * Uses localStorage to persist rate limit state across page refreshes.
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface RateLimitConfig {
  /** Maximum requests allowed in the time window */
  maxRequests: number;
  /** Time window in milliseconds */
  windowMs: number;
  /** Storage key prefix */
  keyPrefix?: string;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  retryAfterMs: number;
}

const DEFAULT_CONFIG: RateLimitConfig = {
  maxRequests: 10,
  windowMs: 60_000, // 1 minute
  keyPrefix: "rl_",
};

/**
 * Get rate limit entry from localStorage
 */
function getEntry(key: string): RateLimitEntry | null {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return null;

    const entry = JSON.parse(stored) as RateLimitEntry;

    // Check if expired
    if (Date.now() >= entry.resetTime) {
      localStorage.removeItem(key);
      return null;
    }

    return entry;
  } catch {
    return null;
  }
}

/**
 * Save rate limit entry to localStorage
 */
function setEntry(key: string, entry: RateLimitEntry): void {
  try {
    localStorage.setItem(key, JSON.stringify(entry));
  } catch {
    // localStorage full or unavailable, continue without persistence
  }
}

/**
 * Check if an action is rate limited
 * @param action - Unique identifier for the action (e.g., "createPetition", "export")
 * @param config - Rate limit configuration
 * @returns Rate limit result with allowed status and metadata
 */
export function checkRateLimit(
  action: string,
  config: Partial<RateLimitConfig> = {}
): RateLimitResult {
  const { maxRequests, windowMs, keyPrefix } = { ...DEFAULT_CONFIG, ...config };
  const key = `${keyPrefix}${action}`;
  const now = Date.now();

  const entry = getEntry(key);

  if (!entry) {
    // First request in window
    setEntry(key, {
      count: 1,
      resetTime: now + windowMs,
    });

    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetTime: now + windowMs,
      retryAfterMs: 0,
    };
  }

  if (entry.count >= maxRequests) {
    // Rate limit exceeded
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
      retryAfterMs: entry.resetTime - now,
    };
  }

  // Increment counter
  entry.count++;
  setEntry(key, entry);

  return {
    allowed: true,
    remaining: maxRequests - entry.count,
    resetTime: entry.resetTime,
    retryAfterMs: 0,
  };
}

/**
 * Consume a rate limit token for an action
 * Returns true if allowed, false if rate limited
 */
export function consumeRateLimit(
  action: string,
  config: Partial<RateLimitConfig> = {}
): boolean {
  return checkRateLimit(action, config).allowed;
}

/**
 * Reset rate limit for an action (useful for testing)
 */
export function resetRateLimit(action: string, keyPrefix = "rl_"): void {
  try {
    localStorage.removeItem(`${keyPrefix}${action}`);
  } catch {
    // Ignore errors
  }
}

/**
 * Get remaining requests for an action
 */
export function getRemainingRequests(
  action: string,
  config: Partial<RateLimitConfig> = {}
): number {
  const { maxRequests, keyPrefix } = { ...DEFAULT_CONFIG, ...config };
  const key = `${keyPrefix}${action}`;
  const entry = getEntry(key);

  if (!entry) {
    return maxRequests;
  }

  return Math.max(0, maxRequests - entry.count);
}

/**
 * Pre-configured rate limiters for common actions
 */
export const RateLimiters = {
  /** Petition creation: 5 per minute */
  createPetition: (config?: Partial<RateLimitConfig>) =>
    checkRateLimit("createPetition", { maxRequests: 5, windowMs: 60_000, ...config }),

  /** Export operations: 10 per minute */
  export: (config?: Partial<RateLimitConfig>) =>
    checkRateLimit("export", { maxRequests: 10, windowMs: 60_000, ...config }),

  /** AI chat messages: 20 per minute */
  aiChat: (config?: Partial<RateLimitConfig>) =>
    checkRateLimit("aiChat", { maxRequests: 20, windowMs: 60_000, ...config }),

  /** Form submissions: 3 per 30 seconds */
  formSubmit: (config?: Partial<RateLimitConfig>) =>
    checkRateLimit("formSubmit", { maxRequests: 3, windowMs: 30_000, ...config }),

  /** Template loads: 30 per minute */
  templateLoad: (config?: Partial<RateLimitConfig>) =>
    checkRateLimit("templateLoad", { maxRequests: 30, windowMs: 60_000, ...config }),
} as const;

/**
 * Hook-friendly rate limit check with error message
 */
export function useRateLimitCheck(
  action: string,
  config?: Partial<RateLimitConfig>
): { check: () => RateLimitResult; errorMessage: (result: RateLimitResult) => string } {
  return {
    check: () => checkRateLimit(action, config),
    errorMessage: (result: RateLimitResult) => {
      if (result.allowed) return "";
      const seconds = Math.ceil(result.retryAfterMs / 1000);
      return `Muitas requisições. Tente novamente em ${seconds} segundo${seconds !== 1 ? "s" : ""}.`;
    },
  };
}
