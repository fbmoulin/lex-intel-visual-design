import { describe, expect, it } from "vitest";
import { z } from "zod";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { PETITION_TEMPLATE_TYPES, PETITION_TEXT_LIMITS } from "@shared/const";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userId: number = 1): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: userId,
    openId: `test-user-${userId}`,
    email: `test${userId}@example.com`,
    name: `Test User ${userId}`,
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

// =============================================================================
// Schema Validation Tests (no database required)
// =============================================================================

describe("petition schema validation", () => {
  it("accepts all valid template types", () => {
    for (const type of PETITION_TEMPLATE_TYPES) {
      const schema = z.enum(PETITION_TEMPLATE_TYPES);
      expect(schema.safeParse(type).success).toBe(true);
    }
  });

  it("rejects invalid template types", () => {
    const schema = z.enum(PETITION_TEMPLATE_TYPES);
    expect(schema.safeParse("invalid").success).toBe(false);
    expect(schema.safeParse("").success).toBe(false);
    expect(schema.safeParse(123).success).toBe(false);
  });

  it("validates title length constraints", () => {
    const schema = z.string()
      .min(PETITION_TEXT_LIMITS.title.min)
      .max(PETITION_TEXT_LIMITS.title.max);

    // Valid titles
    expect(schema.safeParse("A").success).toBe(true);
    expect(schema.safeParse("Valid Title").success).toBe(true);
    expect(schema.safeParse("a".repeat(255)).success).toBe(true);

    // Invalid titles
    expect(schema.safeParse("").success).toBe(false);
    expect(schema.safeParse("a".repeat(256)).success).toBe(false);
  });

  it("validates numeroProcesso format", () => {
    const schema = z.string()
      .max(PETITION_TEXT_LIMITS.numeroProcesso.max)
      .regex(/^[\d.\-\/]*$/);

    // Valid formats
    expect(schema.safeParse("001/2025").success).toBe(true);
    expect(schema.safeParse("1234567-89.2025.1.00.0001").success).toBe(true);
    expect(schema.safeParse("").success).toBe(true);

    // Invalid formats
    expect(schema.safeParse("ABC-123").success).toBe(false);
    expect(schema.safeParse("processo #1").success).toBe(false);
  });

  it("validates valorCausa format with currency symbols", () => {
    const schema = z.string()
      .max(PETITION_TEXT_LIMITS.valorCausa.max)
      .regex(/^[R$€£¥\d.,\s]*$/);

    // Valid formats
    expect(schema.safeParse("R$ 10.000,00").success).toBe(true);
    expect(schema.safeParse("10000").success).toBe(true);
    expect(schema.safeParse("€ 1,000.00").success).toBe(true);
    expect(schema.safeParse("").success).toBe(true);

    // Invalid formats
    expect(schema.safeParse("dez mil reais").success).toBe(false);
    expect(schema.safeParse("10.000 BRL").success).toBe(false);
  });
});

// =============================================================================
// Database Integration Tests (require database connection)
// These tests are skipped when DATABASE_URL is not set
// =============================================================================

describe.skipIf(!process.env.DATABASE_URL)("petitions.create", () => {
  it("creates a new petition and returns its ID", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.petitions.create({
      templateType: "civil",
      title: "Petição de Teste",
      numeroProcesso: "001/2025",
      tribunal: "TJSP",
      autor: "João da Silva",
      reu: "Empresa ABC",
      valorCausa: "R$ 10.000,00",
      status: "rascunho",
    });

    expect(result).toHaveProperty("id");
    expect(typeof result.id).toBe("number");
    expect(result.id).toBeGreaterThan(0);
  });
});

describe.skipIf(!process.env.DATABASE_URL)("petitions.list", () => {
  it("returns list of user petitions", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Create a petition first
    await caller.petitions.create({
      templateType: "trabalhista",
      title: "Petição Trabalhista",
      status: "rascunho",
    });

    const petitions = await caller.petitions.list();

    expect(Array.isArray(petitions)).toBe(true);
    expect(petitions.length).toBeGreaterThan(0);
    expect(petitions[0]).toHaveProperty("id");
    expect(petitions[0]).toHaveProperty("title");
    expect(petitions[0]).toHaveProperty("templateType");
  });
});

describe.skipIf(!process.env.DATABASE_URL)("petitions.getById", () => {
  it("returns petition by ID for the owner", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Create a petition
    const created = await caller.petitions.create({
      templateType: "criminal",
      title: "Petição Criminal",
      status: "rascunho",
    });

    // Get it by ID
    const petition = await caller.petitions.getById({ id: created.id });

    expect(petition).toBeDefined();
    expect(petition?.id).toBe(created.id);
    expect(petition?.title).toBe("Petição Criminal");
    expect(petition?.templateType).toBe("criminal");
  });

  it("returns undefined for non-existent petition", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const petition = await caller.petitions.getById({ id: 999999 });

    expect(petition).toBeUndefined();
  });
});

describe.skipIf(!process.env.DATABASE_URL)("petitions.update", () => {
  it("updates petition successfully", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Create a petition
    const created = await caller.petitions.create({
      templateType: "tributario",
      title: "Petição Original",
      status: "rascunho",
    });

    // Update it
    const result = await caller.petitions.update({
      id: created.id,
      title: "Petição Atualizada",
      status: "finalizada",
    });

    expect(result.success).toBe(true);

    // Verify the update
    const updated = await caller.petitions.getById({ id: created.id });
    expect(updated?.title).toBe("Petição Atualizada");
    expect(updated?.status).toBe("finalizada");
  });
});

describe.skipIf(!process.env.DATABASE_URL)("petitions.delete", () => {
  it("deletes petition successfully", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Create a petition
    const created = await caller.petitions.create({
      templateType: "consumidor",
      title: "Petição a Deletar",
      status: "rascunho",
    });

    // Delete it
    const result = await caller.petitions.delete({ id: created.id });
    expect(result.success).toBe(true);

    // Verify it's gone
    const deleted = await caller.petitions.getById({ id: created.id });
    expect(deleted).toBeUndefined();
  });
});

describe.skipIf(!process.env.DATABASE_URL)("petitions access control", () => {
  it("user cannot access another user's petition", async () => {
    const { ctx: ctx1 } = createAuthContext(1);
    const caller1 = appRouter.createCaller(ctx1);

    const { ctx: ctx2 } = createAuthContext(2);
    const caller2 = appRouter.createCaller(ctx2);

    // User 1 creates a petition
    const created = await caller1.petitions.create({
      templateType: "civil",
      title: "Petição Privada",
      status: "rascunho",
    });

    // User 2 tries to access it
    const petition = await caller2.petitions.getById({ id: created.id });
    expect(petition).toBeUndefined();
  });
});
