import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  judicialTemplates, 
  judicialCategories, 
  getJudicialTemplatesByCategory,
  JudicialTemplate,
  JudicialCategory 
} from "@/data/judicialTemplates";
import { FileText, Eye, Copy, Check, Shield, AlertTriangle } from "lucide-react";
import { Link } from "wouter";

export default function AdminJudicial() {
  const [selectedTemplate, setSelectedTemplate] = useState<JudicialTemplate | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<JudicialCategory>('decisao');

  const handleCopy = async (template: JudicialTemplate) => {
    const fullContent = `${template.content.fatos}\n\n${template.content.fundamentosJuridicos}\n\n${template.content.pedidos}`;
    await navigator.clipboard.writeText(fullContent);
    setCopiedId(template.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStyleBadge = (style: string) => {
    switch (style) {
      case 'moderno':
        return <Badge className="bg-gradient-to-r from-orange-500 to-amber-500 text-white">📊 Moderno</Badge>;
      case 'classico':
        return <Badge className="bg-gradient-to-r from-slate-600 to-slate-700 text-white">⚜️ Clássico</Badge>;
      default:
        return <Badge variant="outline">📄 Padrão</Badge>;
    }
  };

  const filteredTemplates = getJudicialTemplatesByCategory(activeCategory);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        {/* Admin Warning Banner */}
        <div className="mb-8 p-4 rounded-lg border border-amber-500/50 bg-amber-500/10">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-amber-500" />
            <div>
              <h3 className="font-semibold text-amber-500">Área de Administrador - Testes</h3>
              <p className="text-sm text-muted-foreground">
                Esta área contém templates de decisões judiciais, mandados, ofícios e sentenças em fase de testes.
                Estes modelos ainda não estão disponíveis para usuários finais.
              </p>
            </div>
          </div>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="lex-gradient-text">Templates Judiciais</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Decisões, Mandados, Ofícios e Sentenças com Visual Law
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {judicialCategories.map((cat) => (
            <Card 
              key={cat.id} 
              className={`lex-card cursor-pointer transition-all ${activeCategory === cat.id ? 'ring-2 ring-primary' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              <CardContent className="pt-6">
                <div className="text-3xl mb-2">{cat.icon}</div>
                <div className="text-2xl font-bold text-primary">{cat.count}</div>
                <div className="text-sm text-muted-foreground">{cat.name}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Template List */}
          <div className="lg:col-span-1">
            <Card className="lex-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  {judicialCategories.find(c => c.id === activeCategory)?.name}
                </CardTitle>
                <CardDescription>
                  Selecione um template para visualizar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-3">
                    {filteredTemplates.map((template) => (
                      <div
                        key={template.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-all hover:border-primary/50 ${
                          selectedTemplate?.id === template.id 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border'
                        }`}
                        onClick={() => setSelectedTemplate(template)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-sm">{template.title}</h4>
                          {getStyleBadge(template.style)}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {template.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Template Preview */}
          <div className="lg:col-span-2">
            <Card className="lex-card h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-5 w-5 text-primary" />
                      Preview do Template
                    </CardTitle>
                    <CardDescription>
                      {selectedTemplate ? selectedTemplate.title : 'Selecione um template para visualizar'}
                    </CardDescription>
                  </div>
                  {selectedTemplate && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(selectedTemplate)}
                        className="gap-2"
                      >
                        {copiedId === selectedTemplate.id ? (
                          <>
                            <Check className="h-4 w-4" />
                            Copiado!
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" />
                            Copiar
                          </>
                        )}
                      </Button>
                      <Link href={`/editor/civil?template=${selectedTemplate.id}`}>
                        <Button size="sm" className="lex-button gap-2">
                          <FileText className="h-4 w-4" />
                          Usar Template
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {selectedTemplate ? (
                  <Tabs defaultValue="fatos" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="fatos">Relatório/Fatos</TabsTrigger>
                      <TabsTrigger value="fundamentos">Fundamentação</TabsTrigger>
                      <TabsTrigger value="pedidos">Dispositivo</TabsTrigger>
                    </TabsList>
                    <TabsContent value="fatos">
                      <ScrollArea className="h-[400px] mt-4">
                        <div className="bg-card/50 p-4 rounded-lg border">
                          <pre className="whitespace-pre-wrap font-mono text-sm">
                            {selectedTemplate.content.fatos}
                          </pre>
                        </div>
                      </ScrollArea>
                    </TabsContent>
                    <TabsContent value="fundamentos">
                      <ScrollArea className="h-[400px] mt-4">
                        <div className="bg-card/50 p-4 rounded-lg border">
                          <pre className="whitespace-pre-wrap font-mono text-sm">
                            {selectedTemplate.content.fundamentosJuridicos}
                          </pre>
                        </div>
                      </ScrollArea>
                    </TabsContent>
                    <TabsContent value="pedidos">
                      <ScrollArea className="h-[400px] mt-4">
                        <div className="bg-card/50 p-4 rounded-lg border">
                          <pre className="whitespace-pre-wrap font-mono text-sm">
                            {selectedTemplate.content.pedidos}
                          </pre>
                        </div>
                      </ScrollArea>
                    </TabsContent>
                  </Tabs>
                ) : (
                  <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Selecione um template na lista ao lado para visualizar o conteúdo</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="lex-card">
            <CardHeader>
              <CardTitle className="text-lg">📋 Sobre os Templates Judiciais</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>
                Estes templates foram desenvolvidos com base na pesquisa de modelos judiciais 
                utilizados nos tribunais brasileiros, incluindo TJDFT, TRF2 e outros.
              </p>
              <p>
                Os modelos incorporam elementos de <strong className="text-primary">Visual Law</strong> para 
                facilitar a compreensão e o cumprimento das decisões judiciais.
              </p>
            </CardContent>
          </Card>

          <Card className="lex-card">
            <CardHeader>
              <CardTitle className="text-lg">⚖️ Base Legal</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>
                <strong>Decisões:</strong> Art. 300 e seguintes do CPC (tutelas de urgência)
              </p>
              <p>
                <strong>Mandados:</strong> DL 911/69, Arts. 560-566 CPC, Lei 8.245/91
              </p>
              <p>
                <strong>Ofícios:</strong> Art. 139, IV e Art. 438 do CPC
              </p>
              <p>
                <strong>Sentenças:</strong> Art. 489 do CPC (estrutura obrigatória)
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
