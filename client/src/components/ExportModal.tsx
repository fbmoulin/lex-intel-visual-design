import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileDown, FileText, Image as ImageIcon, Eye } from "lucide-react";
import { toast } from "sonner";
import { RateLimiters } from "@/lib/rateLimit";

export interface ExportConfig {
  format: "pdf" | "docx";
  header: {
    enabled: boolean;
    logoUrl?: string;
    text?: string;
  };
  footer: {
    enabled: boolean;
    text?: string;
    pageNumbers: boolean;
  };
}

interface ExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExport: (config: ExportConfig) => Promise<void>;
  previewElement?: React.ReactNode;
}

export function ExportModal({
  open,
  onOpenChange,
  onExport,
  previewElement,
}: ExportModalProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [activeTab, setActiveTab] = useState<"config" | "preview">("config");
  
  const [config, setConfig] = useState<ExportConfig>({
    format: "pdf",
    header: {
      enabled: true,
      text: "Lex Intelligentia - Advocacia e Consultoria Jurídica",
    },
    footer: {
      enabled: true,
      text: "Documento gerado pelo Lex Intel Visual Design",
      pageNumbers: true,
    },
  });

  const handleExport = async () => {
    // Check rate limit before proceeding
    const rateLimitResult = RateLimiters.export();
    if (!rateLimitResult.allowed) {
      const seconds = Math.ceil(rateLimitResult.retryAfterMs / 1000);
      toast.error(
        `Muitas exportações. Tente novamente em ${seconds} segundo${seconds !== 1 ? "s" : ""}.`,
        { id: "export-rate-limit" }
      );
      return;
    }

    setIsExporting(true);
    toast.loading("Preparando exportação...", { id: "export" });

    try {
      await onExport(config);
      toast.success(
        `Documento exportado com sucesso em formato ${config.format.toUpperCase()}!`,
        { id: "export" }
      );
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao exportar:", error);
      toast.error("Erro ao exportar documento. Tente novamente.", { id: "export" });
    } finally {
      setIsExporting(false);
    }
  };

  const updateConfig = (updates: Partial<ExportConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  const updateHeader = (updates: Partial<ExportConfig["header"]>) => {
    setConfig((prev) => ({
      ...prev,
      header: { ...prev.header, ...updates },
    }));
  };

  const updateFooter = (updates: Partial<ExportConfig["footer"]>) => {
    setConfig((prev) => ({
      ...prev,
      footer: { ...prev.footer, ...updates },
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileDown className="h-5 w-5" />
            Configurar Exportação
          </DialogTitle>
          <DialogDescription>
            Personalize o cabeçalho, rodapé e formato do documento antes de exportar.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "config" | "preview")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="config" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Configurações
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="config" className="space-y-6 mt-6">
            {/* Formato de Exportação */}
            <div className="space-y-2">
              <Label htmlFor="format">Formato de Exportação</Label>
              <Select
                value={config.format}
                onValueChange={(value) => updateConfig({ format: value as "pdf" | "docx" })}
              >
                <SelectTrigger id="format">
                  <SelectValue placeholder="Selecione o formato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-red-500" />
                      PDF - Portable Document Format
                    </div>
                  </SelectItem>
                  <SelectItem value="docx">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-500" />
                      DOCX - Microsoft Word
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                {config.format === "pdf"
                  ? "PDF preserva a formatação visual exata e é ideal para envio oficial."
                  : "DOCX permite edição posterior e é compatível com Microsoft Word."}
              </p>
            </div>

            {/* Configuração de Cabeçalho */}
            <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Cabeçalho</Label>
                <Button
                  variant={config.header.enabled ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateHeader({ enabled: !config.header.enabled })}
                >
                  {config.header.enabled ? "Ativado" : "Desativado"}
                </Button>
              </div>

              {config.header.enabled && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="headerLogo">Logo (URL ou caminho)</Label>
                    <Input
                      id="headerLogo"
                      placeholder="https://exemplo.com/logo.png"
                      value={config.header.logoUrl || ""}
                      onChange={(e) => updateHeader({ logoUrl: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Opcional: URL de uma imagem ou caminho local para o logo do escritório
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="headerText">Texto do Cabeçalho</Label>
                    <Input
                      id="headerText"
                      placeholder="Nome do Escritório - OAB/UF 12345"
                      value={config.header.text || ""}
                      onChange={(e) => updateHeader({ text: e.target.value })}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Configuração de Rodapé */}
            <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Rodapé</Label>
                <Button
                  variant={config.footer.enabled ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateFooter({ enabled: !config.footer.enabled })}
                >
                  {config.footer.enabled ? "Ativado" : "Desativado"}
                </Button>
              </div>

              {config.footer.enabled && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="footerText">Texto do Rodapé</Label>
                    <Textarea
                      id="footerText"
                      placeholder="Endereço do escritório, telefone, e-mail..."
                      rows={2}
                      value={config.footer.text || ""}
                      onChange={(e) => updateFooter({ text: e.target.value })}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="pageNumbers"
                      checked={config.footer.pageNumbers}
                      onChange={(e) => updateFooter({ pageNumbers: e.target.checked })}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor="pageNumbers" className="cursor-pointer">
                      Incluir numeração de páginas
                    </Label>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="preview" className="mt-6">
            <div className="border rounded-lg p-6 bg-white min-h-[400px]">
              {/* Cabeçalho Preview */}
              {config.header.enabled && (
                <div className="border-b pb-4 mb-6">
                  {config.header.logoUrl && (
                    <div className="flex justify-center mb-2">
                      <ImageIcon className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  {config.header.text && (
                    <p className="text-center text-sm font-medium text-foreground">
                      {config.header.text}
                    </p>
                  )}
                </div>
              )}

              {/* Conteúdo da Petição */}
              <div className="prose prose-sm max-w-none">
                {previewElement || (
                  <div className="text-center text-muted-foreground py-12">
                    <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>Preview do conteúdo da petição será exibido aqui</p>
                  </div>
                )}
              </div>

              {/* Rodapé Preview */}
              {config.footer.enabled && (
                <div className="border-t pt-4 mt-6">
                  {config.footer.text && (
                    <p className="text-xs text-muted-foreground text-center mb-2">
                      {config.footer.text}
                    </p>
                  )}
                  {config.footer.pageNumbers && (
                    <p className="text-xs text-muted-foreground text-center">
                      Página 1 de 1
                    </p>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleExport} disabled={isExporting}>
            <FileDown className="mr-2 h-4 w-4" />
            {isExporting ? "Exportando..." : `Exportar ${config.format.toUpperCase()}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
