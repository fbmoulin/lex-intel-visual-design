import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Briefcase, Gavel, Building2, ShoppingCart, Search, Users, Building, Scale, Leaf, Sparkles, Crown } from "lucide-react";
import { getAllTemplates, PetitionTemplate, countTemplatesByType } from "@/data/petitionTemplates";
import { useState } from "react";
import { useLocation } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function Templates() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStyle, setSelectedStyle] = useState<string>("all");
  
  const templates = getAllTemplates();
  const templateCounts = countTemplatesByType();
  
  // Detecta o estilo do template pelo ID
  const getTemplateStyle = (template: PetitionTemplate): 'padrao' | 'moderno' | 'classico' => {
    if (template.id.includes('-moderno-')) return 'moderno';
    if (template.id.includes('-classico-')) return 'classico';
    return 'padrao';
  };
  
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || template.templateType === selectedType;
    const style = getTemplateStyle(template);
    const matchesStyle = selectedStyle === "all" || style === selectedStyle;
    return matchesSearch && matchesType && matchesStyle;
  });
  
  const handleUseTemplate = (template: PetitionTemplate) => {
    const params = new URLSearchParams();
    params.set('template', template.id);
    setLocation(`/editor/${template.templateType}?${params.toString()}`);
  };
  
  const getTemplateIcon = (type: string) => {
    switch(type) {
      case 'civil': return FileText;
      case 'trabalhista': return Briefcase;
      case 'criminal': return Gavel;
      case 'tributario': return Building2;
      case 'consumidor': return ShoppingCart;
      case 'familia': return Users;
      case 'empresarial': return Building;
      case 'administrativo': return Scale;
      case 'previdenciario': return Users;
      case 'ambiental': return Leaf;
      default: return FileText;
    }
  };
  
  const getTypeLabel = (type: string) => {
    switch(type) {
      case 'civil': return 'Civil';
      case 'trabalhista': return 'Trabalhista';
      case 'criminal': return 'Criminal';
      case 'tributario': return 'Tributário';
      case 'consumidor': return 'Consumidor';
      case 'familia': return 'Família';
      case 'empresarial': return 'Empresarial';
      case 'administrativo': return 'Administrativo';
      case 'previdenciario': return 'Previdenciário';
      case 'ambiental': return 'Ambiental';
      default: return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };
  
  const getStyleBadge = (template: PetitionTemplate) => {
    const style = getTemplateStyle(template);
    switch(style) {
      case 'moderno':
        return (
          <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            Moderno
          </Badge>
        );
      case 'classico':
        return (
          <Badge className="bg-gradient-to-r from-amber-600 to-yellow-500 text-white border-0 flex items-center gap-1">
            <Crown className="h-3 w-3" />
            Clássico
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-600 text-white border-0">
            Padrão
          </Badge>
        );
    }
  };

  // Conta templates por estilo
  const countByStyle = {
    all: templates.length,
    padrao: templates.filter(t => getTemplateStyle(t) === 'padrao').length,
    moderno: templates.filter(t => getTemplateStyle(t) === 'moderno').length,
    classico: templates.filter(t => getTemplateStyle(t) === 'classico').length,
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              <span className="lex-gradient-text">Templates de Petições</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-4">
              Escolha um template pré-preenchido e profissional para começar sua petição rapidamente
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Badge variant="outline" className="text-sm px-3 py-1">
                {templates.length} templates disponíveis
              </Badge>
              <Badge variant="outline" className="text-sm px-3 py-1 border-blue-500 text-blue-400">
                <Sparkles className="h-3 w-3 mr-1" />
                {countByStyle.moderno} Modernos
              </Badge>
              <Badge variant="outline" className="text-sm px-3 py-1 border-amber-500 text-amber-400">
                <Crown className="h-3 w-3 mr-1" />
                {countByStyle.classico} Clássicos
              </Badge>
            </div>
          </div>
          
          {/* Search and filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-card border-border focus:border-primary focus:ring-primary"
              />
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full md:w-[200px] bg-card border-border">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="civil">Civil ({templateCounts['civil'] || 0})</SelectItem>
                <SelectItem value="trabalhista">Trabalhista ({templateCounts['trabalhista'] || 0})</SelectItem>
                <SelectItem value="criminal">Criminal ({templateCounts['criminal'] || 0})</SelectItem>
                <SelectItem value="tributario">Tributário ({templateCounts['tributario'] || 0})</SelectItem>
                <SelectItem value="consumidor">Consumidor ({templateCounts['consumidor'] || 0})</SelectItem>
                <SelectItem value="familia">Família ({templateCounts['familia'] || 0})</SelectItem>
                <SelectItem value="empresarial">Empresarial ({templateCounts['empresarial'] || 0})</SelectItem>
                <SelectItem value="administrativo">Administrativo ({templateCounts['administrativo'] || 0})</SelectItem>
                <SelectItem value="previdenciario">Previdenciário ({templateCounts['previdenciario'] || 0})</SelectItem>
                <SelectItem value="ambiental">Ambiental ({templateCounts['ambiental'] || 0})</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStyle} onValueChange={setSelectedStyle}>
              <SelectTrigger className="w-full md:w-[180px] bg-card border-border">
                <SelectValue placeholder="Filtrar por estilo" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="all">Todos os estilos</SelectItem>
                <SelectItem value="padrao">Padrão ({countByStyle.padrao})</SelectItem>
                <SelectItem value="moderno">Moderno ({countByStyle.moderno})</SelectItem>
                <SelectItem value="classico">Clássico ({countByStyle.classico})</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Templates list */}
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-foreground">Nenhum template encontrado</h3>
              <p className="text-muted-foreground">Tente ajustar os filtros ou buscar por outros termos.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => {
                const Icon = getTemplateIcon(template.templateType);
                return (
                  <Card key={template.id} className="lex-card border-0 transition-all duration-300 hover:scale-[1.02]">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg lex-gradient">
                            <Icon className="h-6 w-6 text-black" />
                          </div>
                          <Badge className="bg-primary/20 text-primary border-0 hover:bg-primary/30">
                            {getTypeLabel(template.templateType)}
                          </Badge>
                        </div>
                        {getStyleBadge(template)}
                      </div>
                      <CardTitle className="text-lg text-foreground">{template.title}</CardTitle>
                      <CardDescription className="min-h-[48px] text-muted-foreground">
                        {template.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        onClick={() => handleUseTemplate(template)}
                        className="w-full lex-button"
                      >
                        Usar Template
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
          
          {/* Legend */}
          <div className="mt-12 p-6 rounded-lg bg-card/50 border border-border">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Estilos de Templates</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <Badge className="bg-gray-600 text-white border-0 mt-1">Padrão</Badge>
                <div>
                  <p className="font-medium text-foreground">Templates Padrão</p>
                  <p className="text-sm text-muted-foreground">Modelos básicos e diretos, ideais para uso geral.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 flex items-center gap-1 mt-1">
                  <Sparkles className="h-3 w-3" />
                  Moderno
                </Badge>
                <div>
                  <p className="font-medium text-foreground">Templates Modernos</p>
                  <p className="text-sm text-muted-foreground">Design contemporâneo com Visual Law, ícones e formatação visual.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge className="bg-gradient-to-r from-amber-600 to-yellow-500 text-white border-0 flex items-center gap-1 mt-1">
                  <Crown className="h-3 w-3" />
                  Clássico
                </Badge>
                <div>
                  <p className="font-medium text-foreground">Templates Clássicos</p>
                  <p className="text-sm text-muted-foreground">Linguagem formal e elegante, estilo tradicional jurídico.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
