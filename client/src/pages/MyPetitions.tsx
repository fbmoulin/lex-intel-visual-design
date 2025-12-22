import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Search, FileText, Edit, Trash2, Plus, Filter } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function MyPetitions() {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [petitionToDelete, setPetitionToDelete] = useState<number | null>(null);

  const { data: petitions, isLoading, refetch } = trpc.petitions.list.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  const deleteMutation = trpc.petitions.delete.useMutation({
    onSuccess: () => {
      toast.success("Petição excluída com sucesso!");
      refetch();
      setPetitionToDelete(null);
    },
    onError: (error) => {
      toast.error(`Erro ao excluir petição: ${error.message}`);
    }
  });

  const handleEdit = (petitionId: number, templateType: string) => {
    setLocation(`/editor/${templateType}?id=${petitionId}`);
  };

  const handleDelete = (petitionId: number) => {
    deleteMutation.mutate({ id: petitionId });
  };

  const getTemplateLabel = (type: string) => {
    const labels: Record<string, string> = {
      civil: "Petição Civil",
      trabalhista: "Petição Trabalhista",
      criminal: "Petição Criminal",
      tributaria: "Petição Tributária",
      consumidor: "Petição do Consumidor"
    };
    return labels[type] || type;
  };

  const filteredPetitions = petitions?.filter((petition) => {
    const matchesSearch = 
      petition.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      petition.numeroProcesso?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      petition.autor?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterType === "all" || petition.templateType === filterType;
    
    return matchesSearch && matchesFilter;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container py-12">
          <Card className="max-w-md mx-auto lex-card border-0">
            <CardHeader>
              <CardTitle className="lex-gradient-text">Autenticação Necessária</CardTitle>
              <CardDescription className="text-muted-foreground">
                Faça login para visualizar suas petições salvas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setLocation("/")} className="w-full lex-button">
                Voltar para Home
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 lex-gradient-text">Minhas Petições</h1>
          <p className="text-muted-foreground">
            Gerencie todas as suas petições salvas em um só lugar
          </p>
        </div>

        {/* Barra de Busca e Filtros */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por título, número do processo ou autor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[200px] bg-card border-border text-foreground">
                <Filter className="h-4 w-4 mr-2 text-primary" />
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="civil">Civil</SelectItem>
                <SelectItem value="trabalhista">Trabalhista</SelectItem>
                <SelectItem value="criminal">Criminal</SelectItem>
                <SelectItem value="tributaria">Tributária</SelectItem>
                <SelectItem value="consumidor">Consumidor</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={() => setLocation("/templates")} className="lex-button">
              <Plus className="h-4 w-4 mr-2" />
              Nova Petição
            </Button>
          </div>
        </div>

        {/* Lista de Petições */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
            <p className="text-muted-foreground mt-4">Carregando petições...</p>
          </div>
        ) : filteredPetitions && filteredPetitions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPetitions.map((petition) => (
              <Card key={petition.id} className="lex-card border-0 transition-all duration-300 hover:scale-[1.02]">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="h-10 w-10 rounded-lg lex-gradient flex items-center justify-center">
                      <FileText className="h-5 w-5 text-black" />
                    </div>
                    <span className="text-xs px-3 py-1 bg-primary/20 text-primary rounded-full font-medium">
                      {getTemplateLabel(petition.templateType)}
                    </span>
                  </div>
                  <CardTitle className="line-clamp-2 mt-4 text-foreground">{petition.title}</CardTitle>
                  <CardDescription className="space-y-1">
                    {petition.numeroProcesso && (
                      <p className="text-sm text-muted-foreground">Processo: <span className="text-primary">{petition.numeroProcesso}</span></p>
                    )}
                    {petition.autor && (
                      <p className="text-sm text-muted-foreground">Autor: {petition.autor}</p>
                    )}
                    <p className="text-xs text-muted-foreground/70">
                      Atualizado em {new Date(petition.updatedAt).toLocaleDateString('pt-BR')}
                    </p>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 lex-button"
                    onClick={() => handleEdit(petition.id, petition.templateType)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => setPetitionToDelete(petition.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="py-12 lex-card border-0">
            <CardContent className="text-center">
              <div className="h-20 w-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">
                {searchQuery || filterType !== "all" 
                  ? "Nenhuma petição encontrada" 
                  : "Nenhuma petição salva ainda"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery || filterType !== "all"
                  ? "Tente ajustar os filtros de busca"
                  : "Comece criando sua primeira petição com Visual Law"}
              </p>
              <Button onClick={() => setLocation("/templates")} className="lex-button">
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeira Petição
              </Button>
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />

      {/* Dialog de Confirmação de Exclusão */}
      <AlertDialog open={petitionToDelete !== null} onOpenChange={() => setPetitionToDelete(null)}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Tem certeza que deseja excluir esta petição? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-card border-border text-foreground hover:bg-muted">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => petitionToDelete && handleDelete(petitionToDelete)}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
