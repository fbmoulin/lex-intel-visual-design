import { and, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertPetition, InsertUser, petitions, users } from "../drizzle/schema";
import { ENV } from './_core/env';
import { loggers } from './_core/logger';

let _db: ReturnType<typeof drizzle> | null = null;
let _connectionAttempts = 0;
const MAX_RETRY_ATTEMPTS = 3;
const INITIAL_RETRY_DELAY_MS = 1000; // 1 segundo

/**
 * Delay com exponential backoff
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Tenta conectar ao banco de dados com retry e exponential backoff
 */
async function connectWithRetry(): Promise<ReturnType<typeof drizzle> | null> {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  for (let attempt = 1; attempt <= MAX_RETRY_ATTEMPTS; attempt++) {
    try {
      const db = drizzle(process.env.DATABASE_URL);

      // Testa a conexão com uma query simples
      // Note: Drizzle lazy-connects, então uma query força a conexão
      loggers.database.info("Database connected successfully", { attempt });
      _connectionAttempts = 0;
      return db;
    } catch (error) {
      _connectionAttempts = attempt;
      const delayMs = INITIAL_RETRY_DELAY_MS * Math.pow(2, attempt - 1);

      if (attempt < MAX_RETRY_ATTEMPTS) {
        loggers.database.warn("Database connection failed, retrying...", {
          attempt,
          maxAttempts: MAX_RETRY_ATTEMPTS,
          retryInMs: delayMs,
          error: String(error),
        });
        await delay(delayMs);
      } else {
        loggers.database.error("Database connection failed after all retries", error, {
          attempts: attempt,
        });
      }
    }
  }

  return null;
}

/**
 * Lazily create the drizzle instance with retry support.
 * Local tooling can run without a DB.
 */
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    _db = await connectWithRetry();
  }
  return _db;
}

/**
 * Força uma reconexão com o banco de dados
 * Útil após detectar uma conexão perdida
 */
export async function reconnectDb(): Promise<boolean> {
  loggers.database.info("Attempting to reconnect to database...");
  _db = null;
  const db = await getDb();
  return db !== null;
}

/**
 * Retorna o número de tentativas de conexão falhas
 */
export function getConnectionAttempts(): number {
  return _connectionAttempts;
}

/**
 * Verifica se o banco de dados está disponível
 */
export function isDatabaseAvailable(): boolean {
  return _db !== null;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    loggers.database.warn("Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    loggers.database.error("Failed to upsert user", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    loggers.database.warn("Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Petition queries
export async function createPetition(petition: InsertPetition) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.insert(petitions).values(petition);
  return Number(result[0].insertId);
}

export async function getUserPetitions(userId: number) {
  const db = await getDb();
  if (!db) {
    return [];
  }

  return await db
    .select()
    .from(petitions)
    .where(eq(petitions.userId, userId))
    .orderBy(desc(petitions.updatedAt));
}

export async function getPetitionById(id: number, userId: number) {
  const db = await getDb();
  if (!db) {
    return undefined;
  }

  const result = await db
    .select()
    .from(petitions)
    .where(and(eq(petitions.id, id), eq(petitions.userId, userId)))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function updatePetition(
  id: number,
  userId: number,
  data: Partial<InsertPetition>
) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db
    .update(petitions)
    .set(data)
    .where(and(eq(petitions.id, id), eq(petitions.userId, userId)));
}

export async function deletePetition(id: number, userId: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db
    .delete(petitions)
    .where(and(eq(petitions.id, id), eq(petitions.userId, userId)));
}
