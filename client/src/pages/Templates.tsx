import { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Briefcase, Gavel, Building2, ShoppingCart, Search, LucideIcon, Users, Building, Landmark, ShieldCheck, Leaf } from "lucide-react";
import { getAllTemplates, PetitionTemplate } from "@/data/petitionTemplates";
import { useLocation } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

/** Template icon mapping - defined outside component */
const TEMPLATE_ICONS: Record<string, LucideIcon> = {
  civil: FileText,
  trabalhista: Briefcase,
  criminal: Gavel,
  tributaria: Building2,
  tributario: Building2,
  consumidor: ShoppingCart,
  familia: Users,
  empresarial: Building,
  administrativo: Landmark,
  previdenciario: ShieldCheck,
  ambiental: Leaf,
};

/** Template color mapping - defined outside component */
const TEMPLATE_COLORS: Record<string, string> = {
  civil: "bg-blue-500/10 text-blue-500",
  trabalhista: "bg-green-500/10 text-green-500",
  criminal: "bg-red-500/10 text-red-500",
  tributaria: "bg-purple-500/10 text-purple-500",
  tributario: "bg-purple-500/10 text-purple-500",
  consumidor: "bg-amber-500/10 text-amber-500",
  familia: "bg-pink-500/10 text-pink-500",
  empresarial: "bg-indigo-500/10 text-indigo-500",
  administrativo: "bg-slate-500/10 text-slate-500",
  previdenciario: "bg-teal-500/10 text-teal-500",
  ambiental: "bg-emerald-500/10 text-emerald-500",
};

/** Template type labels - defined outside component */
const TYPE_LABELS: Record<string, string> = {
  civil: "Civil",
  trabalhista: "Trabalhista",
  criminal: "Criminal",
  tributaria: "Tributária",
  tributario: "Tributário",
  consumidor: "Consumidor",
  familia: "Família",
  empresarial: "Empresarial",
  administrativo: "Administrativo",
  previdenciario: "Previdenciário",
  ambiental: "Ambiental",
};

function getTemplateIcon(type: string): LucideIcon {
  return TEMPLATE_ICONS[type] || FileText;
}

function getTemplateColor(type: string): string {
  return TEMPLATE_COLORS[type] || "bg-gray-500/10 text-gray-500";
}

function getTypeLabel(type: string): string {
  return TYPE_LABELS[type] || type;
}

export default function Templates() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");

  const templates = getAllTemplates();

  // Memoize filtered templates to avoid recalculation on every render
  const filteredTemplates = useMemo(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();

    return templates.filter((template) => {
      const matchesSearch =
        template.title.toLowerCase().includes(lowerSearchTerm) ||
        template.description.toLowerCase().includes(lowerSearchTerm);
      const matchesType =
        selectedType === "all" || template.templateType === selectedType;
      return matchesSearch && matchesType;
    });
  }, [templates, searchTerm, selectedType]);

  const handleUseTemplate = useCallback(
    (template: PetitionTemplate) => {
      const params = new URLSearchParams();
      params.set("template", template.id);
      setLocation(`/editor/${template.templateType}?${params.toString()}`);
    },
    [setLocation]
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Header />

      <main className="container py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Templates de Petições</h2>
            <p className="text-xl text-muted-foreground">
              Escolha um template pré-preenchido e profissional para começar sua petição rapidamente
            </p>
          </div>
          
          {/* Barra de busca e filtros */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <Input
                placeholder="Buscar templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                aria-label="Buscar templates por nome ou descrição"
              />
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="civil">Civil</SelectItem>
                <SelectItem value="trabalhista">Trabalhista</SelectItem>
                <SelectItem value="criminal">Criminal</SelectItem>
                <SelectItem value="tributaria">Tributária</SelectItem>
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

          {/* Lista de templates */}
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum template encontrado</h3>
              <p className="text-muted-foreground">Tente ajustar os filtros ou buscar por outros termos.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => {
                const Icon = getTemplateIcon(template.templateType);
                return (
                  <Card key={template.id} className="hover:shadow-lg transition-all hover:scale-[1.02] duration-200">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded-lg ${getTemplateColor(template.templateType)}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <Badge variant="secondary">{getTypeLabel(template.templateType)}</Badge>
                      </div>
                      <CardTitle className="text-lg">{template.title}</CardTitle>
                      <CardDescription className="min-h-[48px]">
                        {template.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        onClick={() => handleUseTemplate(template)}
                        className="w-full"
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
