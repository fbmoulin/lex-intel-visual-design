import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { getTemplateById } from "@/data/petitionTemplates";
import type { PetitionTemplateType } from "@shared/const";

/** Estrutura dos dados do formulário de petição */
export interface PetitionFormData {
  numeroProcesso: string;
  tribunal: string;
  autor: string;
  reu: string;
  fatos: string;
  fundamentosJuridicos: string;
  pedidos: string;
  valorCausa: string;
}

/** Valores iniciais do formulário */
const INITIAL_FORM_DATA: PetitionFormData = {
  numeroProcesso: "",
  tribunal: "",
  autor: "",
  reu: "",
  fatos: "",
  fundamentosJuridicos: "",
  pedidos: "",
  valorCausa: "",
};

export interface UseEditorFormOptions {
  /** ID da petição para carregar (edição) */
  petitionId?: string | null;
  /** ID do template para carregar */
  templateId?: string | null;
  /** Tipo do template atual */
  templateType: PetitionTemplateType;
  /** Se o usuário está autenticado */
  isAuthenticated: boolean;
}

export interface UseEditorFormReturn {
  /** Dados do formulário */
  formData: PetitionFormData;
  /** Handler para mudanças nos campos */
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  /** Atualiza campos específicos do formulário */
  setFormField: <K extends keyof PetitionFormData>(field: K, value: PetitionFormData[K]) => void;
  /** Estado de salvamento */
  isSaving: boolean;
  /** ID da petição salva (se existir) */
  savedPetitionId: number | null;
  /** Handler para salvar petição */
  handleSavePetition: () => Promise<void>;
  /** Se está carregando a petição */
  isLoadingPetition: boolean;
}

/**
 * Hook para gerenciar formulário do editor de petições
 *
 * @example
 * ```tsx
 * const {
 *   formData,
 *   handleChange,
 *   handleSavePetition,
 *   isSaving,
 * } = useEditorForm({
 *   petitionId: searchParams.get('id'),
 *   templateId: searchParams.get('template'),
 *   templateType: 'civil',
 *   isAuthenticated: true,
 * });
 * ```
 */
export function useEditorForm(options: UseEditorFormOptions): UseEditorFormReturn {
  const { petitionId, templateId, templateType, isAuthenticated } = options;

  const [formData, setFormData] = useState<PetitionFormData>(INITIAL_FORM_DATA);
  const [isSaving, setIsSaving] = useState(false);
  const [savedPetitionId, setSavedPetitionId] = useState<number | null>(null);

  const createPetitionMutation = trpc.petitions.create.useMutation();
  const updatePetitionMutation = trpc.petitions.update.useMutation();

  // Query para carregar petição existente
  const { data: loadedPetition, isLoading: isLoadingPetition } = trpc.petitions.getById.useQuery(
    { id: parseInt(petitionId || "0") },
    { enabled: !!petitionId && isAuthenticated }
  );

  // Carregar dados da petição quando disponível
  useEffect(() => {
    if (loadedPetition) {
      setFormData({
        numeroProcesso: loadedPetition.numeroProcesso || "",
        tribunal: loadedPetition.tribunal || "",
        autor: loadedPetition.autor || "",
        reu: loadedPetition.reu || "",
        fatos: loadedPetition.fatos || "",
        fundamentosJuridicos: loadedPetition.fundamentosJuridicos || "",
        pedidos: loadedPetition.pedidos || "",
        valorCausa: loadedPetition.valorCausa || "",
      });
      setSavedPetitionId(loadedPetition.id);
      toast.success(`Petição "${loadedPetition.title}" carregada com sucesso!`);
    }
  }, [loadedPetition]);

  // Carregar template quando especificado na URL
  useEffect(() => {
    if (templateId && !petitionId) {
      const template = getTemplateById(templateId);
      if (template) {
        setFormData({
          numeroProcesso: template.content.numeroProcesso || "",
          tribunal: template.content.tribunal || "",
          autor: template.content.autor || "",
          reu: template.content.reu || "",
          fatos: template.content.fatos || "",
          fundamentosJuridicos: template.content.fundamentosJuridicos || "",
          pedidos: template.content.pedidos || "",
          valorCausa: template.content.valorCausa || "",
        });
        toast.success(`Template "${template.title}" carregado com sucesso!`);
      }
    }
  }, [templateId, petitionId]);

  // Handler para mudanças nos campos
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    []
  );

  // Atualizar campo específico
  const setFormField = useCallback(
    <K extends keyof PetitionFormData>(field: K, value: PetitionFormData[K]) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  // Handler para salvar petição
  const handleSavePetition = useCallback(async () => {
    if (!isAuthenticated) {
      toast.error("Você precisa estar logado para salvar petições.");
      return;
    }

    if (!formData.numeroProcesso && !formData.autor) {
      toast.error("Preencha pelo menos o número do processo ou o nome do autor.");
      return;
    }

    setIsSaving(true);
    toast.loading("Salvando petição...", { id: "save-petition" });

    try {
      const petitionData = {
        templateType,
        title:
          formData.numeroProcesso ||
          `Petição ${templateType} - ${new Date().toLocaleDateString()}`,
        numeroProcesso: formData.numeroProcesso,
        tribunal: formData.tribunal,
        autor: formData.autor,
        reu: formData.reu,
        fatos: formData.fatos,
        fundamentosJuridicos: formData.fundamentosJuridicos,
        pedidos: formData.pedidos,
        valorCausa: formData.valorCausa,
        status: "rascunho" as const,
      };

      if (savedPetitionId) {
        // Atualizar petição existente
        await updatePetitionMutation.mutateAsync({
          id: savedPetitionId,
          ...petitionData,
        });
        toast.success("Petição atualizada com sucesso!", { id: "save-petition" });
      } else {
        // Criar nova petição
        const result = await createPetitionMutation.mutateAsync(petitionData);
        setSavedPetitionId(result.id);
        toast.success("Petição salva com sucesso!", { id: "save-petition" });
      }
    } catch (error) {
      console.error("Erro ao salvar petição:", error);
      toast.error("Erro ao salvar petição. Tente novamente.", { id: "save-petition" });
    } finally {
      setIsSaving(false);
    }
  }, [
    isAuthenticated,
    formData,
    templateType,
    savedPetitionId,
    createPetitionMutation,
    updatePetitionMutation,
  ]);

  return {
    formData,
    handleChange,
    setFormField,
    isSaving,
    savedPetitionId,
    handleSavePetition,
    isLoadingPetition,
  };
}
