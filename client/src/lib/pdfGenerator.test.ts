/**
 * PDF Generator Tests
 * @vitest-environment jsdom
 */

import { describe, it, expect } from "vitest";
import { prepareElementForPDF, type PetitionData } from "./pdfGenerator";

describe("pdfGenerator", () => {
  describe("prepareElementForPDF", () => {
    it("sets display to block", () => {
      const element = document.createElement("div");
      element.style.display = "none";

      prepareElementForPDF(element);

      expect(element.style.display).toBe("block");
    });

    it("sets visibility to visible", () => {
      const element = document.createElement("div");
      element.style.visibility = "hidden";

      prepareElementForPDF(element);

      expect(element.style.visibility).toBe("visible");
    });

    it("adds xmlns to SVG elements", () => {
      const element = document.createElement("div");
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      element.appendChild(svg);

      prepareElementForPDF(element);

      expect(svg.getAttribute("xmlns")).toBe("http://www.w3.org/2000/svg");
    });

    it("handles multiple SVG elements", () => {
      const element = document.createElement("div");
      const svg1 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      const svg2 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      element.appendChild(svg1);
      element.appendChild(svg2);

      prepareElementForPDF(element);

      expect(svg1.getAttribute("xmlns")).toBe("http://www.w3.org/2000/svg");
      expect(svg2.getAttribute("xmlns")).toBe("http://www.w3.org/2000/svg");
    });

    it("does not throw when element has no children", () => {
      const element = document.createElement("div");

      expect(() => prepareElementForPDF(element)).not.toThrow();
    });

    it("handles nested SVG elements", () => {
      const element = document.createElement("div");
      const wrapper = document.createElement("div");
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      wrapper.appendChild(svg);
      element.appendChild(wrapper);

      prepareElementForPDF(element);

      expect(svg.getAttribute("xmlns")).toBe("http://www.w3.org/2000/svg");
    });

    it("preserves existing attributes on SVG", () => {
      const element = document.createElement("div");
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("width", "100");
      svg.setAttribute("height", "100");
      element.appendChild(svg);

      prepareElementForPDF(element);

      expect(svg.getAttribute("width")).toBe("100");
      expect(svg.getAttribute("height")).toBe("100");
    });

    it("handles empty element", () => {
      const element = document.createElement("div");
      element.innerHTML = "";

      expect(() => prepareElementForPDF(element)).not.toThrow();
    });
  });

  describe("PetitionData interface", () => {
    it("accepts all required fields", () => {
      const validData: PetitionData = {
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

    it("accepts empty strings", () => {
      const data: PetitionData = {
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
      const data: PetitionData = {
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
        const data: PetitionData = {
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
      const data: PetitionData = {
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
  });
});
