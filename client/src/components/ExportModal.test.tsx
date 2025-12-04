/**
 * ExportModal Component Tests
 * Lex Intel Visual Design - Desenvolvido por Lex Intelligentia
 * @vitest-environment jsdom
 */

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { ExportModal } from "./ExportModal";
import { resetRateLimit } from "@/lib/rateLimit";

// Mock sonner toast
vi.mock("sonner", () => ({
  toast: {
    loading: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock hasPointerCapture for Radix UI
beforeEach(() => {
  Element.prototype.hasPointerCapture = vi.fn(() => false);
  Element.prototype.setPointerCapture = vi.fn();
  Element.prototype.releasePointerCapture = vi.fn();
});

// Import toast after mocking
import { toast } from "sonner";

describe("ExportModal", () => {
  const mockOnExport = vi.fn();
  const mockOnOpenChange = vi.fn();

  const defaultProps = {
    open: true,
    onOpenChange: mockOnOpenChange,
    onExport: mockOnExport,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    resetRateLimit("export");
  });

  describe("rendering", () => {
    it("renders when open", () => {
      render(<ExportModal {...defaultProps} />);

      expect(screen.getByText("Configurar Exportação")).toBeInTheDocument();
      expect(screen.getByText(/Personalize o cabeçalho/)).toBeInTheDocument();
    });

    it("does not render when closed", () => {
      render(<ExportModal {...defaultProps} open={false} />);

      expect(screen.queryByText("Configurar Exportação")).not.toBeInTheDocument();
    });

    it("renders header configuration section", () => {
      render(<ExportModal {...defaultProps} />);

      expect(screen.getByText("Cabeçalho")).toBeInTheDocument();
      expect(screen.getByLabelText("Logo (URL ou caminho)")).toBeInTheDocument();
      expect(screen.getByLabelText("Texto do Cabeçalho")).toBeInTheDocument();
    });

    it("renders footer configuration section", () => {
      render(<ExportModal {...defaultProps} />);

      expect(screen.getByText("Rodapé")).toBeInTheDocument();
      expect(screen.getByLabelText("Texto do Rodapé")).toBeInTheDocument();
      expect(screen.getByLabelText("Incluir numeração de páginas")).toBeInTheDocument();
    });

    it("renders tabs for config and preview", () => {
      render(<ExportModal {...defaultProps} />);

      expect(screen.getByRole("tab", { name: /Configurações/i })).toBeInTheDocument();
      expect(screen.getByRole("tab", { name: /Preview/i })).toBeInTheDocument();
    });

    it("renders action buttons", () => {
      render(<ExportModal {...defaultProps} />);

      expect(screen.getByRole("button", { name: /Cancelar/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Exportar PDF/i })).toBeInTheDocument();
    });

    it("shows PDF description by default", () => {
      render(<ExportModal {...defaultProps} />);

      expect(screen.getByText(/PDF preserva a formatação visual/i)).toBeInTheDocument();
    });
  });

  describe("header configuration", () => {
    it("allows toggling header on/off", async () => {
      const user = userEvent.setup();
      render(<ExportModal {...defaultProps} />);

      // Find header toggle button (first "Ativado" button)
      const headerToggle = screen.getAllByRole("button", { name: /Ativado/i })[0];
      await user.click(headerToggle);

      // Header inputs should be hidden
      expect(screen.queryByLabelText("Logo (URL ou caminho)")).not.toBeInTheDocument();
    });

    it("allows editing header text", async () => {
      const user = userEvent.setup();
      render(<ExportModal {...defaultProps} />);

      const headerInput = screen.getByLabelText("Texto do Cabeçalho");
      await user.clear(headerInput);
      await user.type(headerInput, "Custom Header");

      expect(headerInput).toHaveValue("Custom Header");
    });

    it("allows editing logo URL", async () => {
      const user = userEvent.setup();
      render(<ExportModal {...defaultProps} />);

      const logoInput = screen.getByLabelText("Logo (URL ou caminho)");
      await user.type(logoInput, "https://example.com/logo.png");

      expect(logoInput).toHaveValue("https://example.com/logo.png");
    });
  });

  describe("footer configuration", () => {
    it("allows toggling footer on/off", async () => {
      const user = userEvent.setup();
      render(<ExportModal {...defaultProps} />);

      // Find footer toggle (second "Ativado" button)
      const footerToggle = screen.getAllByRole("button", { name: /Ativado/i })[1];
      await user.click(footerToggle);

      // Footer inputs should be hidden
      expect(screen.queryByLabelText("Texto do Rodapé")).not.toBeInTheDocument();
    });

    it("allows editing footer text", async () => {
      const user = userEvent.setup();
      render(<ExportModal {...defaultProps} />);

      const footerInput = screen.getByLabelText("Texto do Rodapé");
      await user.clear(footerInput);
      await user.type(footerInput, "Custom Footer");

      expect(footerInput).toHaveValue("Custom Footer");
    });

    it("allows toggling page numbers", async () => {
      const user = userEvent.setup();
      render(<ExportModal {...defaultProps} />);

      const pageNumbersCheckbox = screen.getByLabelText("Incluir numeração de páginas");
      expect(pageNumbersCheckbox).toBeChecked();

      await user.click(pageNumbersCheckbox);
      expect(pageNumbersCheckbox).not.toBeChecked();
    });
  });

  describe("preview tab", () => {
    it("switches to preview tab when clicked", async () => {
      const user = userEvent.setup();
      render(<ExportModal {...defaultProps} />);

      const previewTab = screen.getByRole("tab", { name: /Preview/i });
      await user.click(previewTab);

      // Preview content should be visible
      expect(screen.getByText(/Preview do conteúdo da petição/i)).toBeInTheDocument();
    });

    it("shows preview element when provided", async () => {
      const user = userEvent.setup();
      render(
        <ExportModal
          {...defaultProps}
          previewElement={<div>Custom Preview Content</div>}
        />
      );

      const previewTab = screen.getByRole("tab", { name: /Preview/i });
      await user.click(previewTab);

      expect(screen.getByText("Custom Preview Content")).toBeInTheDocument();
    });

    it("shows page numbers in preview when enabled", async () => {
      const user = userEvent.setup();
      render(<ExportModal {...defaultProps} />);

      // Switch to preview
      const previewTab = screen.getByRole("tab", { name: /Preview/i });
      await user.click(previewTab);

      expect(screen.getByText("Página 1 de 1")).toBeInTheDocument();
    });
  });

  describe("export functionality", () => {
    it("calls onExport with config when export button clicked", async () => {
      const user = userEvent.setup();
      mockOnExport.mockResolvedValueOnce(undefined);
      render(<ExportModal {...defaultProps} />);

      const exportButton = screen.getByRole("button", { name: /Exportar PDF/i });
      await user.click(exportButton);

      await waitFor(() => {
        expect(mockOnExport).toHaveBeenCalledTimes(1);
        expect(mockOnExport).toHaveBeenCalledWith(
          expect.objectContaining({
            format: "pdf",
            header: expect.objectContaining({ enabled: true }),
            footer: expect.objectContaining({ enabled: true, pageNumbers: true }),
          })
        );
      });
    });

    it("shows loading state during export", async () => {
      const user = userEvent.setup();
      let resolveExport: () => void;
      mockOnExport.mockReturnValueOnce(
        new Promise<void>((resolve) => {
          resolveExport = resolve;
        })
      );

      render(<ExportModal {...defaultProps} />);

      const exportButton = screen.getByRole("button", { name: /Exportar PDF/i });
      await user.click(exportButton);

      expect(screen.getByText("Exportando...")).toBeInTheDocument();
      expect(toast.loading).toHaveBeenCalledWith("Preparando exportação...", { id: "export" });

      resolveExport!();

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalled();
      });
    });

    it("shows success toast on successful export", async () => {
      const user = userEvent.setup();
      mockOnExport.mockResolvedValueOnce(undefined);
      render(<ExportModal {...defaultProps} />);

      const exportButton = screen.getByRole("button", { name: /Exportar PDF/i });
      await user.click(exportButton);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(
          expect.stringContaining("PDF"),
          expect.any(Object)
        );
      });
    });

    it("shows error toast on export failure", async () => {
      const user = userEvent.setup();
      mockOnExport.mockRejectedValueOnce(new Error("Export failed"));
      render(<ExportModal {...defaultProps} />);

      const exportButton = screen.getByRole("button", { name: /Exportar PDF/i });
      await user.click(exportButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          "Erro ao exportar documento. Tente novamente.",
          { id: "export" }
        );
      });
    });

    it("closes modal on successful export", async () => {
      const user = userEvent.setup();
      mockOnExport.mockResolvedValueOnce(undefined);
      render(<ExportModal {...defaultProps} />);

      const exportButton = screen.getByRole("button", { name: /Exportar PDF/i });
      await user.click(exportButton);

      await waitFor(() => {
        expect(mockOnOpenChange).toHaveBeenCalledWith(false);
      });
    });
  });

  describe("rate limiting", () => {
    it("shows rate limit error after too many exports", async () => {
      const user = userEvent.setup();
      mockOnExport.mockResolvedValue(undefined);
      render(<ExportModal {...defaultProps} />);

      const exportButton = screen.getByRole("button", { name: /Exportar PDF/i });

      // Export 10 times (the limit)
      for (let i = 0; i < 10; i++) {
        await user.click(exportButton);
        await waitFor(() => {
          expect(mockOnExport).toHaveBeenCalledTimes(i + 1);
        });
      }

      // 11th export should be rate limited
      await user.click(exportButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          expect.stringMatching(/Muitas exportações/),
          expect.any(Object)
        );
      });

      // onExport should NOT have been called an 11th time
      expect(mockOnExport).toHaveBeenCalledTimes(10);
    });
  });

  describe("cancel functionality", () => {
    it("calls onOpenChange with false when cancel clicked", async () => {
      const user = userEvent.setup();
      render(<ExportModal {...defaultProps} />);

      const cancelButton = screen.getByRole("button", { name: /Cancelar/i });
      await user.click(cancelButton);

      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe("accessibility", () => {
    it("has accessible dialog title", () => {
      render(<ExportModal {...defaultProps} />);

      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: /Configurar Exportação/i })).toBeInTheDocument();
    });

    it("has accessible form inputs with labels", () => {
      render(<ExportModal {...defaultProps} />);

      expect(screen.getByLabelText("Formato de Exportação")).toBeInTheDocument();
      expect(screen.getByLabelText("Logo (URL ou caminho)")).toBeInTheDocument();
      expect(screen.getByLabelText("Texto do Cabeçalho")).toBeInTheDocument();
      expect(screen.getByLabelText("Texto do Rodapé")).toBeInTheDocument();
    });

    it("has accessible tabs", () => {
      render(<ExportModal {...defaultProps} />);

      const tabList = screen.getByRole("tablist");
      expect(tabList).toBeInTheDocument();

      const tabs = screen.getAllByRole("tab");
      expect(tabs).toHaveLength(2);
    });
  });
});
