import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Petitions router
  petitions: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserPetitions(ctx.user.id);
    }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        return await db.getPetitionById(input.id, ctx.user.id);
      }),

    create: protectedProcedure
      .input(
        z.object({
          templateType: z.string(),
          title: z.string(),
          numeroProcesso: z.string().optional(),
          tribunal: z.string().optional(),
          autor: z.string().optional(),
          reu: z.string().optional(),
          fatos: z.string().optional(),
          fundamentosJuridicos: z.string().optional(),
          pedidos: z.string().optional(),
          valorCausa: z.string().optional(),
          status: z.enum(["rascunho", "finalizada"]).default("rascunho"),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const petitionId = await db.createPetition({
          ...input,
          userId: ctx.user.id,
        });
        return { id: petitionId };
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().optional(),
          numeroProcesso: z.string().optional(),
          tribunal: z.string().optional(),
          autor: z.string().optional(),
          reu: z.string().optional(),
          fatos: z.string().optional(),
          fundamentosJuridicos: z.string().optional(),
          pedidos: z.string().optional(),
          valorCausa: z.string().optional(),
          status: z.enum(["rascunho", "finalizada"]).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        await db.updatePetition(id, ctx.user.id, data);
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.deletePetition(input.id, ctx.user.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
