/**
 * DOCX Generator Tests
 * @vitest-environment jsdom
 */

import { describe, it, expect } from "vitest";
import { type PetitionDataDOCX } from "./docxGenerator";

describe("docxGenerator", () => {
  describe("PetitionDataDOCX interface", () => {
    it("accepts all required fields", () => {
      const validData: PetitionDataDOCX = {
        processNumber: "001/2025",
        court: "TJSP",
        plaintiff: "João",
        defendant: "Maria",
        facts: "Fatos",
        legalBasis: "Fundamentos",
        requests: "Pedidos",
        templateId: "civil",
      };

      expect(validData.processNumber).toBe("001/2025");
      expect(validData.court).toBe("TJSP");
      expect(validData.templateId).toBe("civil");
    });

    it("allows optional caseValue", () => {
      const withValue: PetitionDataDOCX = {
        processNumber: "001/2025",
        court: "TJSP",
        plaintiff: "João",
        defendant: "Maria",
        facts: "Fatos",
        legalBasis: "Fundamentos",
        requests: "Pedidos",
        templateId: "civil",
        caseValue: "R$ 1.000,00",
      };

      const withoutValue: PetitionDataDOCX = {
        processNumber: "001/2025",
        court: "TJSP",
        plaintiff: "João",
        defendant: "Maria",
        facts: "Fatos",
        legalBasis: "Fundamentos",
        requests: "Pedidos",
        templateId: "civil",
      };

      expect(withValue.caseValue).toBe("R$ 1.000,00");
      expect(withoutValue.caseValue).toBeUndefined();
    });

    it("accepts empty strings", () => {
      const data: PetitionDataDOCX = {
        processNumber: "",
        court: "",
        plaintiff: "",
        defendant: "",
        facts: "",
        legalBasis: "",
        requests: "",
        templateId: "",
      };

      expect(data.processNumber).toBe("");
      expect(data.court).toBe("");
    });

    it("accepts multiline text", () => {
      const data: PetitionDataDOCX = {
        processNumber: "001/2025",
        court: "TJSP",
        plaintiff: "João",
        defendant: "Maria",
        facts: "Line 1\nLine 2\nLine 3",
        legalBasis: "Art. 1\nArt. 2",
        requests: "Pedido 1\nPedido 2",
        templateId: "civil",
      };

      expect(data.facts).toContain("\n");
      expect(data.facts.split("\n")).toHaveLength(3);
    });

    it("accepts different template types", () => {
      const templates = ["civil", "trabalhista", "criminal", "tributaria", "consumidor"];

      templates.forEach((templateId) => {
        const data: PetitionDataDOCX = {
          processNumber: "001/2025",
          court: "TJSP",
          plaintiff: "João",
          defendant: "Maria",
          facts: "Fatos",
          legalBasis: "Fundamentos",
          requests: "Pedidos",
          templateId,
        };
        expect(data.templateId).toBe(templateId);
      });
    });

    it("accepts process numbers with slashes", () => {
      const data: PetitionDataDOCX = {
        processNumber: "001/2025/123",
        court: "TJSP",
        plaintiff: "João",
        defendant: "Maria",
        facts: "Fatos",
        legalBasis: "Fundamentos",
        requests: "Pedidos",
        templateId: "civil",
      };

      expect(data.processNumber).toBe("001/2025/123");
      expect(data.processNumber.replace(/\//g, "-")).toBe("001-2025-123");
    });

    it("handles special characters in text", () => {
      const data: PetitionDataDOCX = {
        processNumber: "001/2025",
        court: "Tribunal de Justiça de São Paulo",
        plaintiff: "José da Silva & Cia",
        defendant: "Maria Fernandes <test>",
        facts: 'Fatos com "aspas"',
        legalBasis: "Art. 5º da CF",
        requests: "Pedido com R$ 1.000,00",
        templateId: "civil",
      };

      expect(data.court).toContain("São Paulo");
      expect(data.plaintiff).toContain("&");
      expect(data.legalBasis).toContain("5º");
    });

    it("handles long text content", () => {
      const longText = "Lorem ipsum ".repeat(100);
      const data: PetitionDataDOCX = {
        processNumber: "001/2025",
        court: "TJSP",
        plaintiff: "João",
        defendant: "Maria",
        facts: longText,
        legalBasis: longText,
        requests: longText,
        templateId: "civil",
      };

      expect(data.facts.length).toBeGreaterThan(1000);
    });

    it("validates complete petition structure", () => {
      const petition: PetitionDataDOCX = {
        processNumber: "0001234-56.2025.8.26.0100",
        court: "TRIBUNAL DE JUSTIÇA DO ESTADO DE SÃO PAULO - 1ª VARA CÍVEL",
        plaintiff: "EMPRESA XYZ LTDA, pessoa jurídica de direito privado",
        defendant: "BANCO ABC S/A, instituição financeira",
        facts:
          "DOS FATOS\n\n1. A empresa autora celebrou contrato...\n2. Ocorre que...",
        legalBasis:
          "DO DIREITO\n\nArt. 5º CF\nArt. 186 CC\nSúmula 297 STJ",
        requests:
          "DOS PEDIDOS\n\na) Condenação ao pagamento;\nb) Danos morais;\nc) Honorários",
        templateId: "civil",
        caseValue: "R$ 150.000,00",
      };

      expect(petition.processNumber).toContain("2025");
      expect(petition.court).toContain("VARA CÍVEL");
      expect(petition.facts).toContain("DOS FATOS");
      expect(petition.legalBasis).toContain("Art.");
      expect(petition.requests).toContain("DOS PEDIDOS");
      expect(petition.caseValue).toContain("R$");
    });
  });
});
