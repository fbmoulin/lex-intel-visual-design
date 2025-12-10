import { useCallback, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileDown, Eye, EyeOff, Save } from "lucide-react";
import { useParams, useSearch } from "wouter";
import { toast } from "sonner";
import { generatePetitionPDF, prepareElementForPDF } from "@/lib/pdfGenerator";
import { generatePetitionDOCX } from "@/lib/docxGenerator";
import { PetitionPreview } from "@/components/PetitionPreview";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/_core/hooks/useAuth";
import { ExportModal, ExportConfig } from "@/components/ExportModal";
import { useEditorForm } from "@/hooks/useEditorForm";
import { isValidTemplateType, type PetitionTemplateType } from "@shared/const";

/** Template titles mapping - defined outside component to avoid recreation */
const TEMPLATE_TITLES: Record<string, string> = {
  civil: "Petição Civil",
  trabalhista: "Petição Trabalhista",
  criminal: "Petição Criminal",
  tributaria: "Petição Tributária",
  consumidor: "Direito do Consumidor",
};

export default function Editor() {
  const params = useParams();
  const rawTemplateId = params.templateId || "civil";
  const templateId: PetitionTemplateType = isValidTemplateType(rawTemplateId) ? rawTemplateId : "civil";
  const [showPreview, setShowPreview] = useState(true);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated } = useAuth();

  // Obter ID da petição e template da URL
  const searchParams = new URLSearchParams(useSearch());
  const petitionIdFromUrl = searchParams.get("id");
  const templateIdFromUrl = searchParams.get("template");

  // Hook para gerenciar formulário
  const {
    formData,
    handleChange,
    isSaving,
    savedPetitionId,
    handleSavePetition,
  } = useEditorForm({
    petitionId: petitionIdFromUrl,
    templateId: templateIdFromUrl,
    templateType: templateId,
    isAuthenticated,
  });

  // Memoize template title
  const templateTitle = useMemo(
    () => TEMPLATE_TITLES[templateId] || "Petição",
    [templateId]
  );

  const handleOpenExportModal = useCallback(() => {
    if (!previewRef.current) {
      toast.error("Preview não encontrado. Ative o preview para exportar.");
      return;
    }
    setShowExportModal(true);
  }, []);

  const handleExport = useCallback(
    async (config: ExportConfig) => {
      if (!previewRef.current) {
        toast.error("Preview não encontrado. Ative o preview para exportar.");
        return;
      }

      setIsGeneratingPDF(true);

      try {
        // Prepara o elemento para exportação
        prepareElementForPDF(previewRef.current);

        // Aguarda um momento para garantir que tudo foi renderizado
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (config.format === "pdf") {
          // Gera o PDF com configurações personalizadas
          await generatePetitionPDF(
            previewRef.current,
            {
              processNumber: formData.numeroProcesso,
              court: formData.tribunal,
              plaintiff: formData.autor,
              defendant: formData.reu,
              facts: formData.fatos,
              legalBasis: formData.fundamentosJuridicos,
              requests: formData.pedidos,
              templateId,
            },
            config
          );
        } else if (config.format === "docx") {
          // Gera o DOCX com configurações personalizadas
          await generatePetitionDOCX(
            {
              processNumber: formData.numeroProcesso,
              court: formData.tribunal,
              plaintiff: formData.autor,
              defendant: formData.reu,
              facts: formData.fatos,
              legalBasis: formData.fundamentosJuridicos,
              requests: formData.pedidos,
              caseValue: formData.valorCausa,
              templateId,
            },
            config
          );
        }
      } catch (error) {
        throw error;
      } finally {
        setIsGeneratingPDF(false);
      }
    },
    [formData, templateId]
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Header />
      
      <div className="border-b bg-card/30">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Editor de Petição</h2>
              <p className="text-sm text-muted-foreground mt-1">{templateTitle}</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
                {showPreview ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                {showPreview ? "Ocultar" : "Mostrar"} Preview
              </Button>
              <Button 
                variant="default" 
                onClick={handleSavePetition} 
                disabled={isSaving || !isAuthenticated}
              >
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Salvando..." : savedPetitionId ? "Atualizar" : "Salvar"}
              </Button>
              <Button onClick={handleOpenExportModal} disabled={isGeneratingPDF || !showPreview}>
                <FileDown className="mr-2 h-4 w-4" />
                Exportar
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="container py-8">
        <div className={`grid gap-8 ${showPreview ? 'lg:grid-cols-2' : 'max-w-4xl mx-auto'}`}>
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Informações da Petição</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="numeroProcesso">Número do Processo</Label>
                  <Input
                    id="numeroProcesso"
                    name="numeroProcesso"
                    placeholder="001/2025"
                    value={formData.numeroProcesso}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tribunal">Tribunal</Label>
                  <Input
                    id="tribunal"
                    name="tribunal"
                    placeholder="TJSP"
                    value={formData.tribunal}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="autor">Autor</Label>
                  <Input
                    id="autor"
                    name="autor"
                    placeholder="Nome completo do autor"
                    value={formData.autor}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reu">Réu</Label>
                  <Input
                    id="reu"
                    name="reu"
                    placeholder="Nome completo do réu"
                    value={formData.reu}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fatos">Dos Fatos</Label>
                <Textarea
                  id="fatos"
                  name="fatos"
                  placeholder="Descreva os fatos relevantes do caso..."
                  rows={6}
                  value={formData.fatos}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fundamentosJuridicos">Fundamentos Jurídicos</Label>
                <Textarea
                  id="fundamentosJuridicos"
                  name="fundamentosJuridicos"
                  placeholder="Apresente os fundamentos jurídicos e base legal..."
                  rows={6}
                  value={formData.fundamentosJuridicos}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pedidos">Dos Pedidos</Label>
                <Textarea
                  id="pedidos"
                  name="pedidos"
                  placeholder="Liste os pedidos da petição..."
                  rows={4}
                  value={formData.pedidos}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="valorCausa">Valor da Causa</Label>
                <Input
                  id="valorCausa"
                  name="valorCausa"
                  placeholder="R$ 0,00"
                  value={formData.valorCausa}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
          </Card>
          
          {showPreview && (
            <div className="lg:sticky lg:top-8 h-fit">
              <h3 className="text-xl font-semibold mb-4">Preview da Petição</h3>
              <div ref={previewRef} className="max-h-[calc(100vh-12rem)] overflow-y-auto bg-white rounded-lg shadow-lg p-8">
                <PetitionPreview formData={formData} templateId={templateId} />
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
      
      <ExportModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        onExport={handleExport}
        previewElement={<PetitionPreview formData={formData} templateId={templateId} />}
      />
    </div>
  );
}
