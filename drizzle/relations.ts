import { relations } from "drizzle-orm";
import { petitions, users } from "./schema";

/**
 * Relações entre tabelas
 * Define como as tabelas se relacionam para queries com joins
 */

export const usersRelations = relations(users, ({ many }) => ({
  petitions: many(petitions),
}));

export const petitionsRelations = relations(petitions, ({ one }) => ({
  user: one(users, {
    fields: [petitions.userId],
    references: [users.id],
  }),
}));
