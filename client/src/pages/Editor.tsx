import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, FileDown, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "wouter";
import { toast } from "sonner";
import { PetitionPreview } from "@/components/PetitionPreview";

export default function Editor() {
  const params = useParams();
  const templateId = params.templateId || "civil";
  const [showPreview, setShowPreview] = useState(true);
  
  const [formData, setFormData] = useState({
    numeroProcesso: "",
    tribunal: "",
    autor: "",
    reu: "",
    fatos: "",
    fundamentosJuridicos: "",
    pedidos: "",
    valorCausa: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleGeneratePDF = () => {
    toast.info("Funcionalidade de geração de PDF em desenvolvimento");
  };

  const getTemplateTitle = () => {
    const titles: Record<string, string> = {
      civil: "Petição Civil",
      trabalhista: "Petição Trabalhista",
      criminal: "Petição Criminal",
      tributaria: "Petição Tributária",
      consumidor: "Direito do Consumidor"
    };
    return titles[templateId] || "Petição";
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Editor de Petição</h1>
              <p className="text-muted-foreground mt-1">{getTemplateTitle()}</p>
            </div>
            <div className="flex gap-3">
              <Link href="/templates">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar
                </Button>
              </Link>
              <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
                {showPreview ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                {showPreview ? "Ocultar" : "Mostrar"} Preview
              </Button>
              <Button onClick={handleGeneratePDF}>
                <FileDown className="mr-2 h-4 w-4" />
                Gerar PDF
              </Button>
            </div>
          </div>
        </div>
      </header>

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
              <div className="max-h-[calc(100vh-12rem)] overflow-y-auto">
                <PetitionPreview formData={formData} templateId={templateId} />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
