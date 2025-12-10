import { COOKIE_NAME, PETITION_TEMPLATE_TYPES, PETITION_TEXT_LIMITS } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { sanitizePetitionData, containsSuspiciousContent } from "@shared/sanitize";
import { loggers } from "./_core/logger";
import {
  auditAuth,
  auditPetition,
  auditUserData,
  auditSecurity,
  getAuditContextFromTrpc,
} from "./_core/auditLog";
import {
  exportUserData,
  getConsentSummary,
  createConsentRecord,
  REQUIRED_CONSENTS,
  OPTIONAL_CONSENTS,
  DATA_SUBJECT_RIGHTS,
  type ConsentType,
  type ConsentRecord,
} from "./_core/lgpd";

// Schema base para campos de petição com validações rigorosas
const petitionFieldsSchema = {
  templateType: z.enum(PETITION_TEMPLATE_TYPES, {
    message: `Tipo de template deve ser um de: ${PETITION_TEMPLATE_TYPES.join(", ")}`
  }),
  title: z.string()
    .min(PETITION_TEXT_LIMITS.title.min, "Título é obrigatório")
    .max(PETITION_TEXT_LIMITS.title.max, `Título deve ter no máximo ${PETITION_TEXT_LIMITS.title.max} caracteres`),
  numeroProcesso: z.string()
    .max(PETITION_TEXT_LIMITS.numeroProcesso.max, `Número do processo deve ter no máximo ${PETITION_TEXT_LIMITS.numeroProcesso.max} caracteres`)
    .regex(/^[\d.\-\/]*$/, "Número do processo deve conter apenas dígitos, pontos, hífens e barras")
    .optional(),
  tribunal: z.string()
    .max(PETITION_TEXT_LIMITS.tribunal.max, `Tribunal deve ter no máximo ${PETITION_TEXT_LIMITS.tribunal.max} caracteres`)
    .optional(),
  autor: z.string()
    .max(PETITION_TEXT_LIMITS.autor.max, `Autor deve ter no máximo ${PETITION_TEXT_LIMITS.autor.max} caracteres`)
    .optional(),
  reu: z.string()
    .max(PETITION_TEXT_LIMITS.reu.max, `Réu deve ter no máximo ${PETITION_TEXT_LIMITS.reu.max} caracteres`)
    .optional(),
  fatos: z.string()
    .max(PETITION_TEXT_LIMITS.fatos.max, `Fatos deve ter no máximo ${PETITION_TEXT_LIMITS.fatos.max} caracteres`)
    .optional(),
  fundamentosJuridicos: z.string()
    .max(PETITION_TEXT_LIMITS.fundamentosJuridicos.max, `Fundamentos jurídicos deve ter no máximo ${PETITION_TEXT_LIMITS.fundamentosJuridicos.max} caracteres`)
    .optional(),
  pedidos: z.string()
    .max(PETITION_TEXT_LIMITS.pedidos.max, `Pedidos deve ter no máximo ${PETITION_TEXT_LIMITS.pedidos.max} caracteres`)
    .optional(),
  valorCausa: z.string()
    .max(PETITION_TEXT_LIMITS.valorCausa.max, `Valor da causa deve ter no máximo ${PETITION_TEXT_LIMITS.valorCausa.max} caracteres`)
    .regex(/^[R$€£¥\d.,\s]*$/, "Valor da causa deve conter apenas números, moeda e separadores")
    .optional(),
  status: z.enum(["rascunho", "finalizada"]).default("rascunho"),
};

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const auditContext = getAuditContextFromTrpc(ctx);

      // Audit logout event
      auditAuth(auditContext, "auth.logout", "success", {
        hadSession: !!ctx.user,
      });

      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Petitions router
  petitions: router({
    // Lista simples (mantido para compatibilidade)
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserPetitions(ctx.user.id);
    }),

    // Lista paginada com cursor (recomendado para produção)
    listPaginated: protectedProcedure
      .input(z.object({
        cursor: z.number().int().positive().optional(),
        limit: z.number().int().min(1).max(100).default(20),
        status: z.enum(["rascunho", "finalizada"]).optional(),
        templateType: z.enum(PETITION_TEMPLATE_TYPES).optional(),
      }).optional())
      .query(async ({ ctx, input }) => {
        return await db.getUserPetitionsPaginated(ctx.user.id, input ?? {});
      }),

    // Contagem de petições com filtros
    count: protectedProcedure
      .input(z.object({
        status: z.enum(["rascunho", "finalizada"]).optional(),
        templateType: z.enum(PETITION_TEMPLATE_TYPES).optional(),
      }).optional())
      .query(async ({ ctx, input }) => {
        return await db.countUserPetitions(ctx.user.id, input ?? {});
      }),

    getById: protectedProcedure
      .input(z.object({ id: z.number().int().positive("ID deve ser um número inteiro positivo") }))
      .query(async ({ ctx, input }) => {
        return await db.getPetitionById(input.id, ctx.user.id);
      }),

    create: protectedProcedure
      .input(z.object(petitionFieldsSchema))
      .mutation(async ({ ctx, input }) => {
        const auditContext = getAuditContextFromTrpc(ctx);

        // Sanitiza todos os campos de texto antes de salvar
        const sanitizedInput = sanitizePetitionData(input);

        // Log tentativas de XSS para monitoramento (após sanitização)
        const fieldsToCheck = [input.fatos, input.fundamentosJuridicos, input.pedidos];
        if (fieldsToCheck.some(containsSuspiciousContent)) {
          auditSecurity(
            auditContext,
            "security.suspicious_content",
            "sanitized",
            "Suspicious content detected and sanitized",
            { templateType: input.templateType }
          );
        }

        const petitionId = await db.createPetition({
          ...sanitizedInput,
          userId: ctx.user.id,
        });

        // Audit petition creation
        auditPetition(auditContext, "petition.create", "success", petitionId, {
          templateType: input.templateType,
          status: input.status,
        });

        return { id: petitionId };
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number().int().positive("ID deve ser um número inteiro positivo"),
          // Campos opcionais para update, reutilizando validações do schema base
          templateType: petitionFieldsSchema.templateType.optional(),
          title: petitionFieldsSchema.title.optional(),
          numeroProcesso: petitionFieldsSchema.numeroProcesso,
          tribunal: petitionFieldsSchema.tribunal,
          autor: petitionFieldsSchema.autor,
          reu: petitionFieldsSchema.reu,
          fatos: petitionFieldsSchema.fatos,
          fundamentosJuridicos: petitionFieldsSchema.fundamentosJuridicos,
          pedidos: petitionFieldsSchema.pedidos,
          valorCausa: petitionFieldsSchema.valorCausa,
          status: z.enum(["rascunho", "finalizada"]).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const auditContext = getAuditContextFromTrpc(ctx);
        const { id, ...data } = input;

        // Sanitiza todos os campos de texto antes de salvar
        const sanitizedData = sanitizePetitionData(data);

        // Log tentativas de XSS para monitoramento (após sanitização)
        const fieldsToCheck = [data.fatos, data.fundamentosJuridicos, data.pedidos];
        if (fieldsToCheck.some(containsSuspiciousContent)) {
          auditSecurity(
            auditContext,
            "security.suspicious_content",
            "sanitized",
            "Suspicious content detected and sanitized",
            { petitionId: id }
          );
        }

        await db.updatePetition(id, ctx.user.id, sanitizedData);

        // Audit petition update
        auditPetition(auditContext, "petition.update", "success", id, {
          updatedFields: Object.keys(data).filter((k) => data[k as keyof typeof data] !== undefined),
        });

        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number().int().positive("ID deve ser um número inteiro positivo") }))
      .mutation(async ({ ctx, input }) => {
        const auditContext = getAuditContextFromTrpc(ctx);

        await db.deletePetition(input.id, ctx.user.id);

        // Audit petition deletion
        auditPetition(auditContext, "petition.delete", "success", input.id);

        return { success: true };
      }),
  }),

  // LGPD Compliance Router - Lei nº 13.709/2018
  lgpd: router({
    // Exportar dados do usuário (Art. 18, III - Portabilidade)
    exportData: protectedProcedure.mutation(async ({ ctx }) => {
      const auditContext = getAuditContextFromTrpc(ctx);

      const userData = await exportUserData(
        ctx.user.id,
        {
          getUserById: db.getUserById,
          getUserPetitions: db.getUserPetitions,
          getUserConsents: async (userId: number) => {
            const dbConsents = await db.getUserConsents(userId);
            return dbConsents.map((c) => ({
              type: c.consentType as ConsentType,
              granted: c.granted,
              grantedAt: c.grantedAt?.toISOString(),
              revokedAt: c.revokedAt?.toISOString(),
              version: c.version,
              ipAddress: c.ipAddress || undefined,
            }));
          },
        },
        auditContext
      );

      if (!userData) {
        throw new Error("Falha ao exportar dados do usuário");
      }

      return userData;
    }),

    // Obter direitos do titular (Art. 18)
    getDataSubjectRights: publicProcedure.query(() => {
      return DATA_SUBJECT_RIGHTS;
    }),

    // Obter status de consentimento
    getConsentStatus: protectedProcedure.query(async ({ ctx }) => {
      const dbConsents = await db.getUserConsents(ctx.user.id);
      const consents: ConsentRecord[] = dbConsents.map((c) => ({
        type: c.consentType as ConsentType,
        granted: c.granted,
        grantedAt: c.grantedAt?.toISOString(),
        revokedAt: c.revokedAt?.toISOString(),
        version: c.version,
        ipAddress: c.ipAddress || undefined,
      }));
      return getConsentSummary(consents);
    }),

    // Registrar consentimento
    grantConsent: protectedProcedure
      .input(z.object({
        consentType: z.enum([...REQUIRED_CONSENTS, ...OPTIONAL_CONSENTS] as [ConsentType, ...ConsentType[]]),
      }))
      .mutation(async ({ ctx, input }) => {
        const auditContext = getAuditContextFromTrpc(ctx);

        const consent = createConsentRecord(
          input.consentType,
          true,
          ctx.req.ip
        );

        // Persist consent to database
        await db.grantConsent(
          ctx.user.id,
          input.consentType,
          consent.version,
          ctx.req.ip,
          ctx.req.headers["user-agent"] as string | undefined
        );

        // Audit consent grant
        auditUserData(auditContext, "user.consent_granted", "success", {
          consentType: input.consentType,
          version: consent.version,
        });

        return { success: true, consent };
      }),

    // Revogar consentimento
    revokeConsent: protectedProcedure
      .input(z.object({
        consentType: z.enum([...OPTIONAL_CONSENTS] as [ConsentType, ...ConsentType[]]),
      }))
      .mutation(async ({ ctx, input }) => {
        const auditContext = getAuditContextFromTrpc(ctx);

        const consent = createConsentRecord(
          input.consentType,
          false,
          ctx.req.ip
        );

        // Persist revocation to database
        await db.revokeConsent(
          ctx.user.id,
          input.consentType,
          consent.version,
          ctx.req.ip,
          ctx.req.headers["user-agent"] as string | undefined
        );

        // Audit consent revocation
        auditUserData(auditContext, "user.consent_revoked", "success", {
          consentType: input.consentType,
        });

        return { success: true, consent };
      }),

    // Verificar se usuário tem consentimentos obrigatórios
    hasRequiredConsents: protectedProcedure.query(async ({ ctx }) => {
      return { hasAll: await db.hasRequiredConsents(ctx.user.id) };
    }),
  }),
});

export type AppRouter = typeof appRouter;
