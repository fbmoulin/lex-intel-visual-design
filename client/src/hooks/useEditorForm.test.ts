/**
 * useEditorForm Hook Tests
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import React from "react";

// Create mock functions using vi.hoisted
const { mockToastSuccess, mockToastError, mockToastLoading, mockUseMutation, mockUseQuery } =
  vi.hoisted(() => ({
    mockToastSuccess: vi.fn(),
    mockToastError: vi.fn(),
    mockToastLoading: vi.fn(),
    mockUseMutation: vi.fn(() => ({
      mutateAsync: vi.fn().mockResolvedValue({ id: 1 }),
    })),
    mockUseQuery: vi.fn(() => ({
      data: null,
      isLoading: false,
    })),
  }));

// Mock sonner
vi.mock("sonner", () => ({
  toast: {
    success: mockToastSuccess,
    error: mockToastError,
    loading: mockToastLoading,
  },
}));

// Mock trpc
vi.mock("@/lib/trpc", () => ({
  trpc: {
    petitions: {
      create: {
        useMutation: mockUseMutation,
      },
      update: {
        useMutation: mockUseMutation,
      },
      getById: {
        useQuery: mockUseQuery,
      },
    },
  },
}));

// Mock getTemplateById
vi.mock("@/data/petitionTemplates", () => ({
  getTemplateById: vi.fn((id: string) => {
    if (id === "civil") {
      return {
        title: "Petição Civil",
        content: {
          numeroProcesso: "001/2025",
          tribunal: "TJSP",
          autor: "Autor Teste",
          reu: "Réu Teste",
          fatos: "Fatos do template",
          fundamentosJuridicos: "Fundamentos do template",
          pedidos: "Pedidos do template",
          valorCausa: "R$ 10.000,00",
        },
      };
    }
    return null;
  }),
}));

import { useEditorForm, type PetitionFormData } from "./useEditorForm";

describe("useEditorForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseQuery.mockReturnValue({ data: null, isLoading: false });
  });

  describe("initial state", () => {
    it("returns empty form data initially", () => {
      const { result } = renderHook(() =>
        useEditorForm({
          templateType: "civil",
          isAuthenticated: true,
        })
      );

      expect(result.current.formData).toEqual({
        numeroProcesso: "",
        tribunal: "",
        autor: "",
        reu: "",
        fatos: "",
        fundamentosJuridicos: "",
        pedidos: "",
        valorCausa: "",
      });
    });

    it("returns isSaving as false initially", () => {
      const { result } = renderHook(() =>
        useEditorForm({
          templateType: "civil",
          isAuthenticated: true,
        })
      );

      expect(result.current.isSaving).toBe(false);
    });

    it("returns savedPetitionId as null initially", () => {
      const { result } = renderHook(() =>
        useEditorForm({
          templateType: "civil",
          isAuthenticated: true,
        })
      );

      expect(result.current.savedPetitionId).toBe(null);
    });

    it("returns isLoadingPetition as false when no petitionId", () => {
      const { result } = renderHook(() =>
        useEditorForm({
          templateType: "civil",
          isAuthenticated: true,
        })
      );

      expect(result.current.isLoadingPetition).toBe(false);
    });
  });

  describe("handleChange", () => {
    it("updates form field on change", () => {
      const { result } = renderHook(() =>
        useEditorForm({
          templateType: "civil",
          isAuthenticated: true,
        })
      );

      act(() => {
        result.current.handleChange({
          target: { name: "autor", value: "João da Silva" },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.formData.autor).toBe("João da Silva");
    });

    it("updates multiple fields independently", () => {
      const { result } = renderHook(() =>
        useEditorForm({
          templateType: "civil",
          isAuthenticated: true,
        })
      );

      act(() => {
        result.current.handleChange({
          target: { name: "autor", value: "João" },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      act(() => {
        result.current.handleChange({
          target: { name: "reu", value: "Maria" },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.formData.autor).toBe("João");
      expect(result.current.formData.reu).toBe("Maria");
    });

    it("handleChange is memoized", () => {
      const { result, rerender } = renderHook(() =>
        useEditorForm({
          templateType: "civil",
          isAuthenticated: true,
        })
      );

      const firstHandleChange = result.current.handleChange;
      rerender();
      expect(result.current.handleChange).toBe(firstHandleChange);
    });
  });

  describe("setFormField", () => {
    it("updates specific field", () => {
      const { result } = renderHook(() =>
        useEditorForm({
          templateType: "civil",
          isAuthenticated: true,
        })
      );

      act(() => {
        result.current.setFormField("tribunal", "TJRJ");
      });

      expect(result.current.formData.tribunal).toBe("TJRJ");
    });
  });

  describe("handleSavePetition", () => {
    it("shows error when not authenticated", async () => {
      const { result } = renderHook(() =>
        useEditorForm({
          templateType: "civil",
          isAuthenticated: false,
        })
      );

      await act(async () => {
        await result.current.handleSavePetition();
      });

      expect(mockToastError).toHaveBeenCalledWith(
        "Você precisa estar logado para salvar petições."
      );
    });

    it("shows error when form is empty", async () => {
      const { result } = renderHook(() =>
        useEditorForm({
          templateType: "civil",
          isAuthenticated: true,
        })
      );

      await act(async () => {
        await result.current.handleSavePetition();
      });

      expect(mockToastError).toHaveBeenCalledWith(
        "Preencha pelo menos o número do processo ou o nome do autor."
      );
    });

    it("allows save with autor only", async () => {
      const mockMutateAsync = vi.fn().mockResolvedValue({ id: 1 });
      mockUseMutation.mockReturnValue({ mutateAsync: mockMutateAsync });

      const { result } = renderHook(() =>
        useEditorForm({
          templateType: "civil",
          isAuthenticated: true,
        })
      );

      act(() => {
        result.current.handleChange({
          target: { name: "autor", value: "João" },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      await act(async () => {
        await result.current.handleSavePetition();
      });

      expect(mockToastLoading).toHaveBeenCalledWith("Salvando petição...", {
        id: "save-petition",
      });
    });

    it("allows save with numeroProcesso only", async () => {
      const mockMutateAsync = vi.fn().mockResolvedValue({ id: 1 });
      mockUseMutation.mockReturnValue({ mutateAsync: mockMutateAsync });

      const { result } = renderHook(() =>
        useEditorForm({
          templateType: "civil",
          isAuthenticated: true,
        })
      );

      act(() => {
        result.current.handleChange({
          target: { name: "numeroProcesso", value: "001/2025" },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      await act(async () => {
        await result.current.handleSavePetition();
      });

      expect(mockToastLoading).toHaveBeenCalled();
    });
  });

  describe("options", () => {
    it("accepts templateType option", () => {
      const { result } = renderHook(() =>
        useEditorForm({
          templateType: "trabalhista",
          isAuthenticated: true,
        })
      );

      expect(result.current).toBeDefined();
    });

    it("accepts petitionId option", () => {
      const { result } = renderHook(() =>
        useEditorForm({
          petitionId: "123",
          templateType: "civil",
          isAuthenticated: true,
        })
      );

      expect(result.current).toBeDefined();
    });

    it("accepts templateId option", () => {
      const { result } = renderHook(() =>
        useEditorForm({
          templateId: "civil",
          templateType: "civil",
          isAuthenticated: true,
        })
      );

      expect(result.current).toBeDefined();
    });
  });
});
