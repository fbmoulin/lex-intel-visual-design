import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Tabela de petições jurídicas geradas pelos usuários.
 * Armazena todos os dados da petição para permitir edição e histórico.
 */
export const petitions = mysqlTable("petitions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  templateType: varchar("templateType", { length: 50 }).notNull(), // civil, trabalhista, criminal, etc
  title: varchar("title", { length: 255 }).notNull(),
  numeroProcesso: varchar("numeroProcesso", { length: 100 }),
  tribunal: varchar("tribunal", { length: 255 }),
  autor: varchar("autor", { length: 255 }),
  reu: varchar("reu", { length: 255 }),
  fatos: text("fatos"),
  fundamentosJuridicos: text("fundamentosJuridicos"),
  pedidos: text("pedidos"),
  valorCausa: varchar("valorCausa", { length: 50 }),
  status: mysqlEnum("status", ["rascunho", "finalizada"]).default("rascunho").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Petition = typeof petitions.$inferSelect;
export type InsertPetition = typeof petitions.$inferInsert;