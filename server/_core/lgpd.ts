/**
 * LGPD Compliance Module
 * Lex Intel Visual Design - Desenvolvido por Lex Intelligentia
 *
 * Brazilian General Data Protection Law (LGPD) compliance:
 * - Data portability (export user data)
 * - Right to erasure (data deletion)
 * - Consent management
 *
 * Reference: Lei nº 13.709/2018 (LGPD)
 */

import { loggers } from "./logger";
import { auditUserData, getAuditContext } from "./auditLog";

/**
 * User consent types per LGPD requirements
 */
export type ConsentType =
  | "terms_of_service"      // Termos de uso
  | "privacy_policy"        // Política de privacidade
  | "data_processing"       // Tratamento de dados
  | "marketing"             // Comunicações de marketing
  | "analytics"             // Analytics e melhorias
  | "third_party_sharing";  // Compartilhamento com terceiros

export interface ConsentRecord {
  type: ConsentType;
  granted: boolean;
  grantedAt?: string;
  revokedAt?: string;
  version: string;
  ipAddress?: string;
}

export interface UserDataExport {
  exportedAt: string;
  exportVersion: string;
  user: {
    id: number;
    openId: string;
    name: string | null;
    email: string | null;
    loginMethod: string | null;
    role: string;
    createdAt: string;
    lastSignedIn: string;
  };
  petitions: Array<{
    id: number;
    templateType: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    data: Record<string, unknown>;
  }>;
  consents: ConsentRecord[];
  metadata: {
    totalPetitions: number;
    dataCategories: string[];
    processingPurposes: string[];
    retentionPeriod: string;
    dataController: string;
  };
}

/**
 * Required consents for using the platform
 */
export const REQUIRED_CONSENTS: ConsentType[] = [
  "terms_of_service",
  "privacy_policy",
  "data_processing",
];

/**
 * Optional consents
 */
export const OPTIONAL_CONSENTS: ConsentType[] = [
  "marketing",
  "analytics",
  "third_party_sharing",
];

/**
 * Current consent versions
 */
export const CONSENT_VERSIONS: Record<ConsentType, string> = {
  terms_of_service: "1.0.0",
  privacy_policy: "1.0.0",
  data_processing: "1.0.0",
  marketing: "1.0.0",
  analytics: "1.0.0",
  third_party_sharing: "1.0.0",
};

/**
 * Data categories collected (LGPD Art. 9)
 */
export const DATA_CATEGORIES = [
  "identification" as const,      // Nome, email
  "authentication" as const,      // OpenID, login method
  "usage" as const,               // Petições, atividade
  "technical" as const,           // IP, user agent
];

/**
 * Processing purposes (LGPD Art. 7)
 */
export const PROCESSING_PURPOSES = [
  "service_provision" as const,   // Prestação do serviço
  "legal_compliance" as const,    // Cumprimento de obrigação legal
  "legitimate_interest" as const, // Interesse legítimo
  "consent" as const,             // Consentimento
];

/**
 * Data retention period
 */
export const DATA_RETENTION_PERIOD = "5 anos após último acesso";

/**
 * Data controller information
 */
export const DATA_CONTROLLER = "Lex Intelligentia";

/**
 * Export user data (LGPD Art. 18, III - portabilidade)
 */
export async function exportUserData(
  userId: number,
  db: {
    getUserById: (id: number) => Promise<{
      id: number;
      openId: string;
      name: string | null;
      email: string | null;
      loginMethod: string | null;
      role: string;
      createdAt: Date;
      lastSignedIn: Date;
    } | undefined>;
    getUserPetitions: (userId: number) => Promise<Array<{
      id: number;
      templateType: string;
      status: string;
      createdAt: Date;
      updatedAt: Date;
      // Petition fields
      autor?: string | null;
      reu?: string | null;
      tribunal?: string | null;
      vara?: string | null;
      comarca?: string | null;
      fatos?: string | null;
      fundamentosJuridicos?: string | null;
      pedidos?: string | null;
      localData?: string | null;
      advogadoNome?: string | null;
      advogadoOAB?: string | null;
    }>>;
    getUserConsents?: (userId: number) => Promise<ConsentRecord[]>;
  },
  auditContext?: ReturnType<typeof getAuditContext>
): Promise<UserDataExport | null> {
  try {
    const user = await db.getUserById(userId);
    if (!user) {
      if (auditContext) {
        auditUserData(auditContext, "user.data_export", "failure", {
          reason: "user_not_found",
        });
      }
      return null;
    }

    const petitions = await db.getUserPetitions(userId);
    const consents = db.getUserConsents
      ? await db.getUserConsents(userId)
      : [];

    const exportData: UserDataExport = {
      exportedAt: new Date().toISOString(),
      exportVersion: "1.0",
      user: {
        id: user.id,
        openId: user.openId,
        name: user.name,
        email: user.email,
        loginMethod: user.loginMethod,
        role: user.role,
        createdAt: user.createdAt.toISOString(),
        lastSignedIn: user.lastSignedIn.toISOString(),
      },
      petitions: petitions.map((p) => ({
        id: p.id,
        templateType: p.templateType,
        status: p.status,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
        data: {
          autor: p.autor,
          reu: p.reu,
          tribunal: p.tribunal,
          vara: p.vara,
          comarca: p.comarca,
          fatos: p.fatos,
          fundamentosJuridicos: p.fundamentosJuridicos,
          pedidos: p.pedidos,
          localData: p.localData,
          advogadoNome: p.advogadoNome,
          advogadoOAB: p.advogadoOAB,
        },
      })),
      consents,
      metadata: {
        totalPetitions: petitions.length,
        dataCategories: [...DATA_CATEGORIES],
        processingPurposes: [...PROCESSING_PURPOSES],
        retentionPeriod: DATA_RETENTION_PERIOD,
        dataController: DATA_CONTROLLER,
      },
    };

    if (auditContext) {
      auditUserData(auditContext, "user.data_export", "success", {
        petitionCount: petitions.length,
      });
    }

    loggers.database.info("User data exported", {
      userId,
      petitionCount: petitions.length,
    });

    return exportData;
  } catch (error) {
    loggers.database.error("Failed to export user data", error, { userId });
    if (auditContext) {
      auditUserData(auditContext, "user.data_export", "failure", {
        error: String(error),
      });
    }
    throw error;
  }
}

/**
 * Validate required consents
 */
export function validateRequiredConsents(
  consents: ConsentRecord[]
): { valid: boolean; missing: ConsentType[] } {
  const grantedTypes = new Set(
    consents
      .filter((c) => c.granted)
      .map((c) => c.type)
  );

  const missing = REQUIRED_CONSENTS.filter(
    (type) => !grantedTypes.has(type)
  );

  return {
    valid: missing.length === 0,
    missing,
  };
}

/**
 * Check if consent version is current
 */
export function isConsentCurrent(consent: ConsentRecord): boolean {
  const currentVersion = CONSENT_VERSIONS[consent.type];
  return consent.version === currentVersion && consent.granted;
}

/**
 * Create consent record
 */
export function createConsentRecord(
  type: ConsentType,
  granted: boolean,
  ipAddress?: string
): ConsentRecord {
  const now = new Date().toISOString();
  return {
    type,
    granted,
    grantedAt: granted ? now : undefined,
    revokedAt: granted ? undefined : now,
    version: CONSENT_VERSIONS[type],
    ipAddress,
  };
}

/**
 * Get consent status summary
 */
export function getConsentSummary(consents: ConsentRecord[]): {
  required: Record<ConsentType, boolean>;
  optional: Record<ConsentType, boolean>;
  allRequiredGranted: boolean;
  needsUpdate: ConsentType[];
} {
  const consentMap = new Map(
    consents.map((c) => [c.type, c])
  );

  const required = {} as Record<ConsentType, boolean>;
  const optional = {} as Record<ConsentType, boolean>;
  const needsUpdate: ConsentType[] = [];

  for (const type of REQUIRED_CONSENTS) {
    const consent = consentMap.get(type);
    required[type] = consent?.granted ?? false;
    if (consent && !isConsentCurrent(consent)) {
      needsUpdate.push(type);
    }
  }

  for (const type of OPTIONAL_CONSENTS) {
    const consent = consentMap.get(type);
    optional[type] = consent?.granted ?? false;
    if (consent && consent.granted && !isConsentCurrent(consent)) {
      needsUpdate.push(type);
    }
  }

  const allRequiredGranted = REQUIRED_CONSENTS.every(
    (type) => required[type]
  );

  return {
    required,
    optional,
    allRequiredGranted,
    needsUpdate,
  };
}

/**
 * LGPD Data Subject Rights (Art. 18)
 */
export const DATA_SUBJECT_RIGHTS = {
  confirmation: "Confirmação da existência de tratamento",
  access: "Acesso aos dados",
  correction: "Correção de dados incompletos ou inexatos",
  anonymization: "Anonimização, bloqueio ou eliminação",
  portability: "Portabilidade dos dados",
  deletion: "Eliminação dos dados",
  information: "Informação sobre compartilhamento",
  revocation: "Revogação do consentimento",
};

export default {
  exportUserData,
  validateRequiredConsents,
  isConsentCurrent,
  createConsentRecord,
  getConsentSummary,
  REQUIRED_CONSENTS,
  OPTIONAL_CONSENTS,
  CONSENT_VERSIONS,
  DATA_CATEGORIES,
  PROCESSING_PURPOSES,
  DATA_RETENTION_PERIOD,
  DATA_CONTROLLER,
  DATA_SUBJECT_RIGHTS,
};
