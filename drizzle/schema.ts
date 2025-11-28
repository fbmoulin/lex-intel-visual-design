import { integer, pgEnum, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

/**
 * Enums do PostgreSQL
 */
export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);
export const petitionStatusEnum = pgEnum("petition_status", ["rascunho", "finalizada"]);

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
});

export type Petition = typeof petitions.$inferSelect;
export type InsertPetition = typeof petitions.$inferInsert;
