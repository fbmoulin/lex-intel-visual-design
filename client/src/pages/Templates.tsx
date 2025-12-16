import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Briefcase, Gavel, Building2, ShoppingCart, Search, Users, Building, Scale, Leaf } from "lucide-react";
import { getAllTemplates, PetitionTemplate } from "@/data/petitionTemplates";
import { useState } from "react";
import { useLocation } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function Templates() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  
  const templates = getAllTemplates();
  
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || template.templateType === selectedType;
    return matchesSearch && matchesType;
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
  
  const getTemplateColor = (type: string) => {
    // All use orange gradient theme for consistency
    return 'bg-primary/10 text-primary';
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

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              <span className="lex-gradient-text">Templates de Petições</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Escolha um template pré-preenchido e profissional para começar sua petição rapidamente
            </p>
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
                <SelectItem value="civil">Civil</SelectItem>
                <SelectItem value="trabalhista">Trabalhista</SelectItem>
                <SelectItem value="criminal">Criminal</SelectItem>
                <SelectItem value="tributario">Tributário</SelectItem>
                <SelectItem value="consumidor">Consumidor</SelectItem>
                <SelectItem value="familia">Família</SelectItem>
                <SelectItem value="empresarial">Empresarial</SelectItem>
                <SelectItem value="administrativo">Administrativo</SelectItem>
                <SelectItem value="previdenciario">Previdenciário</SelectItem>
                <SelectItem value="ambiental">Ambiental</SelectItem>
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
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg lex-gradient">
                          <Icon className="h-6 w-6 text-black" />
                        </div>
                        <Badge className="bg-primary/20 text-primary border-0 hover:bg-primary/30">
                          {getTypeLabel(template.templateType)}
                        </Badge>
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
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
