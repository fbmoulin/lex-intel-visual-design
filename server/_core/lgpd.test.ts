/**
 * LGPD Compliance Tests
 * Lex Intel Visual Design - Desenvolvido por Lex Intelligentia
 *
 * Tests for the LGPD compliance module
 */

import { describe, expect, it, vi } from "vitest";
import {
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
  type ConsentRecord,
  type ConsentType,
} from "./lgpd";

// Mock logger
vi.mock("./logger", () => ({
  loggers: {
    database: {
      info: vi.fn(),
      error: vi.fn(),
    },
  },
}));

// Mock audit log
vi.mock("./auditLog", () => ({
  auditUserData: vi.fn(),
  getAuditContext: vi.fn(),
}));

describe("LGPD Compliance Module", () => {
  describe("Consent Types", () => {
    it("defines required consents", () => {
      expect(REQUIRED_CONSENTS).toContain("terms_of_service");
      expect(REQUIRED_CONSENTS).toContain("privacy_policy");
      expect(REQUIRED_CONSENTS).toContain("data_processing");
      expect(REQUIRED_CONSENTS).toHaveLength(3);
    });

    it("defines optional consents", () => {
      expect(OPTIONAL_CONSENTS).toContain("marketing");
      expect(OPTIONAL_CONSENTS).toContain("analytics");
      expect(OPTIONAL_CONSENTS).toContain("third_party_sharing");
      expect(OPTIONAL_CONSENTS).toHaveLength(3);
    });

    it("has versions for all consent types", () => {
      const allTypes = [...REQUIRED_CONSENTS, ...OPTIONAL_CONSENTS];
      allTypes.forEach((type) => {
        expect(CONSENT_VERSIONS[type]).toBeDefined();
        expect(CONSENT_VERSIONS[type]).toMatch(/^\d+\.\d+\.\d+$/);
      });
    });
  });

  describe("validateRequiredConsents()", () => {
    it("returns valid when all required consents are granted", () => {
      const consents: ConsentRecord[] = [
        { type: "terms_of_service", granted: true, version: "1.0.0" },
        { type: "privacy_policy", granted: true, version: "1.0.0" },
        { type: "data_processing", granted: true, version: "1.0.0" },
      ];

      const result = validateRequiredConsents(consents);

      expect(result.valid).toBe(true);
      expect(result.missing).toHaveLength(0);
    });

    it("returns invalid when missing required consents", () => {
      const consents: ConsentRecord[] = [
        { type: "terms_of_service", granted: true, version: "1.0.0" },
      ];

      const result = validateRequiredConsents(consents);

      expect(result.valid).toBe(false);
      expect(result.missing).toContain("privacy_policy");
      expect(result.missing).toContain("data_processing");
    });

    it("returns invalid when consent is revoked", () => {
      const consents: ConsentRecord[] = [
        { type: "terms_of_service", granted: false, version: "1.0.0" },
        { type: "privacy_policy", granted: true, version: "1.0.0" },
        { type: "data_processing", granted: true, version: "1.0.0" },
      ];

      const result = validateRequiredConsents(consents);

      expect(result.valid).toBe(false);
      expect(result.missing).toContain("terms_of_service");
    });

    it("handles empty consents array", () => {
      const result = validateRequiredConsents([]);

      expect(result.valid).toBe(false);
      expect(result.missing).toEqual(REQUIRED_CONSENTS);
    });

    it("ignores optional consents", () => {
      const consents: ConsentRecord[] = [
        { type: "terms_of_service", granted: true, version: "1.0.0" },
        { type: "privacy_policy", granted: true, version: "1.0.0" },
        { type: "data_processing", granted: true, version: "1.0.0" },
        { type: "marketing", granted: false, version: "1.0.0" },
      ];

      const result = validateRequiredConsents(consents);

      expect(result.valid).toBe(true);
    });
  });

  describe("isConsentCurrent()", () => {
    it("returns true for current version", () => {
      const consent: ConsentRecord = {
        type: "terms_of_service",
        granted: true,
        version: CONSENT_VERSIONS.terms_of_service,
      };

      expect(isConsentCurrent(consent)).toBe(true);
    });

    it("returns false for outdated version", () => {
      const consent: ConsentRecord = {
        type: "terms_of_service",
        granted: true,
        version: "0.9.0",
      };

      expect(isConsentCurrent(consent)).toBe(false);
    });

    it("returns false for revoked consent", () => {
      const consent: ConsentRecord = {
        type: "terms_of_service",
        granted: false,
        version: CONSENT_VERSIONS.terms_of_service,
      };

      expect(isConsentCurrent(consent)).toBe(false);
    });
  });

  describe("createConsentRecord()", () => {
    it("creates granted consent with timestamp", () => {
      const before = new Date().toISOString();
      const consent = createConsentRecord("privacy_policy", true, "192.168.1.1");
      const after = new Date().toISOString();

      expect(consent.type).toBe("privacy_policy");
      expect(consent.granted).toBe(true);
      expect(consent.grantedAt).toBeDefined();
      expect(consent.grantedAt! >= before).toBe(true);
      expect(consent.grantedAt! <= after).toBe(true);
      expect(consent.revokedAt).toBeUndefined();
      expect(consent.version).toBe(CONSENT_VERSIONS.privacy_policy);
      expect(consent.ipAddress).toBe("192.168.1.1");
    });

    it("creates revoked consent with timestamp", () => {
      const consent = createConsentRecord("marketing", false);

      expect(consent.type).toBe("marketing");
      expect(consent.granted).toBe(false);
      expect(consent.grantedAt).toBeUndefined();
      expect(consent.revokedAt).toBeDefined();
    });

    it("uses correct version for each consent type", () => {
      const allTypes: ConsentType[] = [...REQUIRED_CONSENTS, ...OPTIONAL_CONSENTS];

      allTypes.forEach((type) => {
        const consent = createConsentRecord(type, true);
        expect(consent.version).toBe(CONSENT_VERSIONS[type]);
      });
    });
  });

  describe("getConsentSummary()", () => {
    it("returns summary with all consents", () => {
      const consents: ConsentRecord[] = [
        { type: "terms_of_service", granted: true, version: "1.0.0" },
        { type: "privacy_policy", granted: true, version: "1.0.0" },
        { type: "data_processing", granted: true, version: "1.0.0" },
        { type: "marketing", granted: false, version: "1.0.0" },
        { type: "analytics", granted: true, version: "1.0.0" },
      ];

      const summary = getConsentSummary(consents);

      expect(summary.required.terms_of_service).toBe(true);
      expect(summary.required.privacy_policy).toBe(true);
      expect(summary.required.data_processing).toBe(true);
      expect(summary.optional.marketing).toBe(false);
      expect(summary.optional.analytics).toBe(true);
      expect(summary.allRequiredGranted).toBe(true);
    });

    it("detects missing required consents", () => {
      const consents: ConsentRecord[] = [
        { type: "terms_of_service", granted: true, version: "1.0.0" },
      ];

      const summary = getConsentSummary(consents);

      expect(summary.allRequiredGranted).toBe(false);
      expect(summary.required.privacy_policy).toBe(false);
      expect(summary.required.data_processing).toBe(false);
    });

    it("identifies consents needing update", () => {
      const consents: ConsentRecord[] = [
        { type: "terms_of_service", granted: true, version: "0.9.0" },
        { type: "privacy_policy", granted: true, version: "1.0.0" },
        { type: "data_processing", granted: true, version: "1.0.0" },
      ];

      const summary = getConsentSummary(consents);

      expect(summary.needsUpdate).toContain("terms_of_service");
      expect(summary.needsUpdate).not.toContain("privacy_policy");
    });

    it("handles empty consents", () => {
      const summary = getConsentSummary([]);

      expect(summary.allRequiredGranted).toBe(false);
      REQUIRED_CONSENTS.forEach((type) => {
        expect(summary.required[type]).toBe(false);
      });
      OPTIONAL_CONSENTS.forEach((type) => {
        expect(summary.optional[type]).toBe(false);
      });
    });
  });

  describe("exportUserData()", () => {
    const mockUser = {
      id: 1,
      openId: "oauth-123",
      name: "Test User",
      email: "test@example.com",
      loginMethod: "google",
      role: "user",
      createdAt: new Date("2024-01-01"),
      lastSignedIn: new Date("2024-06-01"),
    };

    const mockPetitions = [
      {
        id: 1,
        templateType: "peticao_inicial",
        status: "finalizada",
        createdAt: new Date("2024-02-01"),
        updatedAt: new Date("2024-02-15"),
        autor: "John Doe",
        reu: "Jane Doe",
        tribunal: "TJSP",
        fatos: "Test facts",
      },
    ];

    it("exports user data with all fields", async () => {
      const mockDb = {
        getUserById: vi.fn().mockResolvedValue(mockUser),
        getUserPetitions: vi.fn().mockResolvedValue(mockPetitions),
      };

      const result = await exportUserData(1, mockDb);

      expect(result).not.toBeNull();
      expect(result!.user.id).toBe(1);
      expect(result!.user.openId).toBe("oauth-123");
      expect(result!.user.email).toBe("test@example.com");
      expect(result!.petitions).toHaveLength(1);
      expect(result!.petitions[0].templateType).toBe("peticao_inicial");
    });

    it("includes metadata in export", async () => {
      const mockDb = {
        getUserById: vi.fn().mockResolvedValue(mockUser),
        getUserPetitions: vi.fn().mockResolvedValue(mockPetitions),
      };

      const result = await exportUserData(1, mockDb);

      expect(result!.metadata.totalPetitions).toBe(1);
      expect(result!.metadata.dataCategories).toEqual(DATA_CATEGORIES);
      expect(result!.metadata.processingPurposes).toEqual(PROCESSING_PURPOSES);
      expect(result!.metadata.retentionPeriod).toBe(DATA_RETENTION_PERIOD);
      expect(result!.metadata.dataController).toBe(DATA_CONTROLLER);
    });

    it("includes export timestamp", async () => {
      const mockDb = {
        getUserById: vi.fn().mockResolvedValue(mockUser),
        getUserPetitions: vi.fn().mockResolvedValue([]),
      };

      const before = new Date().toISOString();
      const result = await exportUserData(1, mockDb);
      const after = new Date().toISOString();

      expect(result!.exportedAt >= before).toBe(true);
      expect(result!.exportedAt <= after).toBe(true);
      expect(result!.exportVersion).toBe("1.0");
    });

    it("returns null for non-existent user", async () => {
      const mockDb = {
        getUserById: vi.fn().mockResolvedValue(undefined),
        getUserPetitions: vi.fn().mockResolvedValue([]),
      };

      const result = await exportUserData(999, mockDb);

      expect(result).toBeNull();
    });

    it("handles user with no petitions", async () => {
      const mockDb = {
        getUserById: vi.fn().mockResolvedValue(mockUser),
        getUserPetitions: vi.fn().mockResolvedValue([]),
      };

      const result = await exportUserData(1, mockDb);

      expect(result!.petitions).toHaveLength(0);
      expect(result!.metadata.totalPetitions).toBe(0);
    });

    it("converts dates to ISO strings", async () => {
      const mockDb = {
        getUserById: vi.fn().mockResolvedValue(mockUser),
        getUserPetitions: vi.fn().mockResolvedValue(mockPetitions),
      };

      const result = await exportUserData(1, mockDb);

      expect(result!.user.createdAt).toBe("2024-01-01T00:00:00.000Z");
      expect(result!.user.lastSignedIn).toBe("2024-06-01T00:00:00.000Z");
      expect(result!.petitions[0].createdAt).toBe("2024-02-01T00:00:00.000Z");
    });
  });

  describe("Data Subject Rights (Art. 18)", () => {
    it("defines all LGPD rights", () => {
      expect(DATA_SUBJECT_RIGHTS.confirmation).toBeDefined();
      expect(DATA_SUBJECT_RIGHTS.access).toBeDefined();
      expect(DATA_SUBJECT_RIGHTS.correction).toBeDefined();
      expect(DATA_SUBJECT_RIGHTS.anonymization).toBeDefined();
      expect(DATA_SUBJECT_RIGHTS.portability).toBeDefined();
      expect(DATA_SUBJECT_RIGHTS.deletion).toBeDefined();
      expect(DATA_SUBJECT_RIGHTS.information).toBeDefined();
      expect(DATA_SUBJECT_RIGHTS.revocation).toBeDefined();
    });

    it("rights are in Portuguese", () => {
      expect(DATA_SUBJECT_RIGHTS.confirmation).toContain("Confirmação");
      expect(DATA_SUBJECT_RIGHTS.portability).toContain("Portabilidade");
    });
  });

  describe("Data Categories", () => {
    it("defines data categories per LGPD Art. 9", () => {
      expect(DATA_CATEGORIES).toContain("identification");
      expect(DATA_CATEGORIES).toContain("authentication");
      expect(DATA_CATEGORIES).toContain("usage");
      expect(DATA_CATEGORIES).toContain("technical");
    });
  });

  describe("Processing Purposes", () => {
    it("defines legal bases per LGPD Art. 7", () => {
      expect(PROCESSING_PURPOSES).toContain("service_provision");
      expect(PROCESSING_PURPOSES).toContain("legal_compliance");
      expect(PROCESSING_PURPOSES).toContain("legitimate_interest");
      expect(PROCESSING_PURPOSES).toContain("consent");
    });
  });

  describe("Data Controller Info", () => {
    it("defines data controller", () => {
      expect(DATA_CONTROLLER).toBe("Lex Intelligentia");
    });

    it("defines retention period", () => {
      expect(DATA_RETENTION_PERIOD).toContain("5 anos");
    });
  });
});
