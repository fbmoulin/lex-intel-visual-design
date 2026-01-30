import { and, count, desc, eq, lt, SQL } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import {
  InsertPetition,
  InsertUser,
  InsertUserConsent,
  Petition,
  petitions,
  userConsents,
  UserConsent,
  users,
} from "../drizzle/schema";
import { ENV } from './_core/env';
import { loggers } from './_core/logger';

type PostgresDb = ReturnType<typeof drizzle>;

let _db: PostgresDb | null = null;
let _sql: ReturnType<typeof postgres> | null = null;
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
async function connectWithRetry(): Promise<PostgresDb | null> {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  for (let attempt = 1; attempt <= MAX_RETRY_ATTEMPTS; attempt++) {
    try {
      // Configura conexão PostgreSQL otimizada para Supabase
      _sql = postgres(process.env.DATABASE_URL, {
        max: 10, // Pool máximo de conexões
        idle_timeout: 20, // Timeout de conexão ociosa em segundos
        connect_timeout: 10, // Timeout de conexão em segundos
        prepare: false, // Desabilita prepared statements (melhor para Supabase pooler)
      });

      const db = drizzle(_sql);

      // Testa a conexão com uma query simples
      await _sql`SELECT 1`;

      loggers.database.info("Database connected successfully (PostgreSQL/Supabase)", { attempt });
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

  // Fecha conexão existente se houver
  if (_sql) {
    try {
      await _sql.end();
    } catch {
      // Ignora erro ao fechar conexão
    }
  }

  _db = null;
  _sql = null;
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

/**
 * Fecha a conexão com o banco de dados
 * Útil para graceful shutdown
 */
export async function closeDb(): Promise<void> {
  if (_sql) {
    await _sql.end();
    _sql = null;
    _db = null;
    loggers.database.info("Database connection closed");
  }
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
    const updateSet: Partial<InsertUser> = {};

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

    // PostgreSQL usa onConflictDoUpdate em vez de onDuplicateKeyUpdate
    await db.insert(users).values(values).onConflictDoUpdate({
      target: users.openId,
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

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) {
    loggers.database.warn("Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Petition queries
export async function createPetition(petition: InsertPetition) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  // PostgreSQL usa returning() para obter o ID inserido
  const result = await db.insert(petitions).values(petition).returning({ id: petitions.id });
  return result[0].id;
}

/** Default limit for unpaginated queries to prevent memory issues */
const DEFAULT_PETITION_LIMIT = 100;

/**
 * Get user petitions with a default limit
 * For large datasets, use getUserPetitionsPaginated instead
 */
export async function getUserPetitions(
  userId: number,
  limit: number = DEFAULT_PETITION_LIMIT
) {
  const db = await getDb();
  if (!db) {
    return [];
  }

  return await db
    .select()
    .from(petitions)
    .where(eq(petitions.userId, userId))
    .orderBy(desc(petitions.updatedAt))
    .limit(limit);
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

  // Adiciona updatedAt automaticamente
  await db
    .update(petitions)
    .set({ ...data, updatedAt: new Date() })
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

/**
 * Tipos para paginação
 */
export interface PaginationParams {
  cursor?: number;
  limit?: number;
  status?: "rascunho" | "finalizada";
  templateType?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  nextCursor: number | null;
  hasMore: boolean;
  total: number;
}

/**
 * Lista de campos para listagem (exclui campos grandes como fatos, fundamentosJuridicos)
 */
type PetitionListItem = Pick<Petition,
  | "id"
  | "userId"
  | "templateType"
  | "title"
  | "numeroProcesso"
  | "tribunal"
  | "autor"
  | "reu"
  | "valorCausa"
  | "status"
  | "createdAt"
  | "updatedAt"
>;

/**
 * Busca petições do usuário com paginação cursor-based
 * Otimizado para performance: exclui campos grandes na listagem
 */
export async function getUserPetitionsPaginated(
  userId: number,
  params: PaginationParams = {}
): Promise<PaginatedResult<PetitionListItem>> {
  const db = await getDb();
  if (!db) {
    return { data: [], nextCursor: null, hasMore: false, total: 0 };
  }

  const { cursor, limit = 20, status, templateType } = params;
  const effectiveLimit = Math.min(limit, 100); // Max 100 por página

  // Constrói condições WHERE
  const conditions: SQL[] = [eq(petitions.userId, userId)];

  if (cursor) {
    conditions.push(lt(petitions.id, cursor));
  }

  if (status) {
    conditions.push(eq(petitions.status, status));
  }

  if (templateType) {
    conditions.push(eq(petitions.templateType, templateType));
  }

  // Query principal - seleciona apenas campos necessários para listagem
  const data = await db
    .select({
      id: petitions.id,
      userId: petitions.userId,
      templateType: petitions.templateType,
      title: petitions.title,
      numeroProcesso: petitions.numeroProcesso,
      tribunal: petitions.tribunal,
      autor: petitions.autor,
      reu: petitions.reu,
      valorCausa: petitions.valorCausa,
      status: petitions.status,
      createdAt: petitions.createdAt,
      updatedAt: petitions.updatedAt,
    })
    .from(petitions)
    .where(and(...conditions))
    .orderBy(desc(petitions.id))
    .limit(effectiveLimit + 1); // +1 para verificar se há mais

  // Verifica se há mais resultados
  const hasMore = data.length > effectiveLimit;
  const items = hasMore ? data.slice(0, effectiveLimit) : data;

  // Conta total (sem cursor, para paginação)
  const countConditions: SQL[] = [eq(petitions.userId, userId)];
  if (status) countConditions.push(eq(petitions.status, status));
  if (templateType) countConditions.push(eq(petitions.templateType, templateType));

  const [{ total }] = await db
    .select({ total: count() })
    .from(petitions)
    .where(and(...countConditions));

  return {
    data: items,
    nextCursor: hasMore && items.length > 0 ? items[items.length - 1].id : null,
    hasMore,
    total,
  };
}

/**
 * Conta petições do usuário com filtros opcionais
 */
export async function countUserPetitions(
  userId: number,
  filters: { status?: "rascunho" | "finalizada"; templateType?: string } = {}
): Promise<number> {
  const db = await getDb();
  if (!db) {
    return 0;
  }

  const conditions: SQL[] = [eq(petitions.userId, userId)];

  if (filters.status) {
    conditions.push(eq(petitions.status, filters.status));
  }

  if (filters.templateType) {
    conditions.push(eq(petitions.templateType, filters.templateType));
  }

  const [{ total }] = await db
    .select({ total: count() })
    .from(petitions)
    .where(and(...conditions));

  return total;
}

// ============================================================================
// LGPD Consent Operations
// ============================================================================

/**
 * Obtém todos os consentimentos de um usuário
 */
export async function getUserConsents(userId: number): Promise<UserConsent[]> {
  const db = await getDb();
  if (!db) {
    return [];
  }

  return await db
    .select()
    .from(userConsents)
    .where(eq(userConsents.userId, userId))
    .orderBy(desc(userConsents.createdAt));
}

/**
 * Obtém o consentimento mais recente de um tipo específico
 */
export async function getLatestConsent(
  userId: number,
  consentType: InsertUserConsent["consentType"]
): Promise<UserConsent | undefined> {
  const db = await getDb();
  if (!db) {
    return undefined;
  }

  const result = await db
    .select()
    .from(userConsents)
    .where(
      and(
        eq(userConsents.userId, userId),
        eq(userConsents.consentType, consentType)
      )
    )
    .orderBy(desc(userConsents.createdAt))
    .limit(1);

  return result[0];
}

/**
 * Registra um novo consentimento
 */
export async function createConsent(consent: InsertUserConsent): Promise<number> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db
    .insert(userConsents)
    .values(consent)
    .returning({ id: userConsents.id });

  loggers.database.info("Consent recorded", {
    userId: consent.userId,
    consentType: consent.consentType,
    granted: consent.granted,
  });

  return result[0].id;
}

/**
 * Registra concessão de consentimento
 */
export async function grantConsent(
  userId: number,
  consentType: InsertUserConsent["consentType"],
  version: string,
  ipAddress?: string,
  userAgent?: string
): Promise<number> {
  return createConsent({
    userId,
    consentType,
    granted: true,
    version,
    ipAddress,
    userAgent,
    grantedAt: new Date(),
  });
}

/**
 * Registra revogação de consentimento
 */
export async function revokeConsent(
  userId: number,
  consentType: InsertUserConsent["consentType"],
  version: string,
  ipAddress?: string,
  userAgent?: string
): Promise<number> {
  return createConsent({
    userId,
    consentType,
    granted: false,
    version,
    ipAddress,
    userAgent,
    revokedAt: new Date(),
  });
}

/**
 * Verifica se o usuário tem todos os consentimentos obrigatórios
 */
export async function hasRequiredConsents(userId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    return false;
  }

  const requiredTypes: InsertUserConsent["consentType"][] = [
    "terms_of_service",
    "privacy_policy",
    "data_processing",
  ];

  for (const consentType of requiredTypes) {
    const latest = await getLatestConsent(userId, consentType);
    if (!latest || !latest.granted) {
      return false;
    }
  }

  return true;
}
