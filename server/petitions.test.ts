import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

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

describe("petitions.create", () => {
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

describe("petitions.list", () => {
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

describe("petitions.getById", () => {
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

describe("petitions.update", () => {
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

describe("petitions.delete", () => {
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

describe("petitions access control", () => {
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
