import { boolean, index, integer, pgEnum, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

/**
 * Enums do PostgreSQL
 */
export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);
export const petitionStatusEnum = pgEnum("petition_status", ["rascunho", "finalizada"]);
export const consentTypeEnum = pgEnum("consent_type", [
  "terms_of_service",
  "privacy_policy",
  "data_processing",
  "marketing",
  "analytics",
  "third_party_sharing",
]);

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = pgTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: serial("id").primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("open_id", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("login_method", { length: 64 }),
  role: userRoleEnum("role").default("user").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  lastSignedIn: timestamp("last_signed_in", { withTimezone: true }).defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Tabela de petições jurídicas geradas pelos usuários.
 * Armazena todos os dados da petição para permitir edição e histórico.
 */
export const petitions = pgTable("petitions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  templateType: varchar("template_type", { length: 50 }).notNull(), // civil, trabalhista, criminal, etc
  title: varchar("title", { length: 255 }).notNull(),
  numeroProcesso: varchar("numero_processo", { length: 100 }),
  tribunal: varchar("tribunal", { length: 255 }),
  autor: varchar("autor", { length: 255 }),
  reu: varchar("reu", { length: 255 }),
  fatos: text("fatos"),
  fundamentosJuridicos: text("fundamentos_juridicos"),
  pedidos: text("pedidos"),
  valorCausa: varchar("valor_causa", { length: 50 }),
  status: petitionStatusEnum("status").default("rascunho").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  // Indexes para performance (Phase 1 do Roadmap)
  index("idx_petitions_user_id").on(table.userId),
  index("idx_petitions_status").on(table.status),
  index("idx_petitions_template_type").on(table.templateType),
  index("idx_petitions_user_status").on(table.userId, table.status),
  index("idx_petitions_updated_at").on(table.updatedAt),
]);

export type Petition = typeof petitions.$inferSelect;
export type InsertPetition = typeof petitions.$inferInsert;

/**
 * Tabela de consentimentos do usuário - LGPD Compliance
 * Lei nº 13.709/2018 - Lei Geral de Proteção de Dados
 *
 * Armazena o histórico de consentimentos para:
 * - Portabilidade de dados (Art. 18, III)
 * - Revogação do consentimento (Art. 18, IX)
 * - Auditoria e compliance
 */
export const userConsents = pgTable("user_consents", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  consentType: consentTypeEnum("consent_type").notNull(),
  granted: boolean("granted").notNull(),
  version: varchar("version", { length: 20 }).notNull(),
  ipAddress: varchar("ip_address", { length: 45 }), // IPv6 max length
  userAgent: varchar("user_agent", { length: 500 }),
  grantedAt: timestamp("granted_at", { withTimezone: true }),
  revokedAt: timestamp("revoked_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("idx_user_consents_user_id").on(table.userId),
  index("idx_user_consents_type").on(table.consentType),
  index("idx_user_consents_user_type").on(table.userId, table.consentType),
]);

export type UserConsent = typeof userConsents.$inferSelect;
export type InsertUserConsent = typeof userConsents.$inferInsert;
