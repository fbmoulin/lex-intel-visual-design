import { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Search, FileText, Edit, Trash2, Plus, Filter } from "lucide-react";
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

/** Template labels mapping - defined outside component to avoid recreation */
const TEMPLATE_LABELS: Record<string, string> = {
  civil: "Petição Civil",
  trabalhista: "Petição Trabalhista",
  criminal: "Petição Criminal",
  tributaria: "Petição Tributária",
  consumidor: "Petição do Consumidor",
};

function getTemplateLabel(type: string): string {
  return TEMPLATE_LABELS[type] || type;
}

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
    },
  });

  // Memoize handlers to prevent unnecessary re-renders of child components
  const handleEdit = useCallback(
    (petitionId: number, templateType: string) => {
      setLocation(`/editor/${templateType}?id=${petitionId}`);
    },
    [setLocation]
  );

  const handleDelete = useCallback(
    (petitionId: number) => {
      deleteMutation.mutate({ id: petitionId });
    },
    [deleteMutation]
  );

  // Memoize filtered petitions to avoid recalculation on every render
  const filteredPetitions = useMemo(() => {
    if (!petitions) return undefined;

    const lowerSearchQuery = searchQuery.toLowerCase();

    return petitions.filter((petition) => {
      const matchesSearch =
        petition.title.toLowerCase().includes(lowerSearchQuery) ||
        petition.numeroProcesso?.toLowerCase().includes(lowerSearchQuery) ||
        petition.autor?.toLowerCase().includes(lowerSearchQuery);

      const matchesFilter =
        filterType === "all" || petition.templateType === filterType;

      return matchesSearch && matchesFilter;
    });
  }, [petitions, searchQuery, filterType]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-12">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Autenticação Necessária</CardTitle>
              <CardDescription>
                Faça login para visualizar suas petições salvas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setLocation("/")} className="w-full">
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
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Minhas Petições</h1>
          <p className="text-muted-foreground">
            Gerencie todas as suas petições salvas em um só lugar
          </p>
        </div>

        {/* Barra de Busca e Filtros */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <Input
              placeholder="Buscar por título, número do processo ou autor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              aria-label="Buscar petições por título, número do processo ou autor"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="civil">Civil</SelectItem>
                <SelectItem value="trabalhista">Trabalhista</SelectItem>
                <SelectItem value="criminal">Criminal</SelectItem>
                <SelectItem value="tributaria">Tributária</SelectItem>
                <SelectItem value="consumidor">Consumidor</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={() => setLocation("/templates")}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Petição
            </Button>
          </div>
        </div>

        {/* Lista de Petições */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Carregando petições...</p>
          </div>
        ) : filteredPetitions && filteredPetitions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPetitions.map((petition) => (
              <Card key={petition.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <FileText className="h-8 w-8 text-primary" />
                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                      {getTemplateLabel(petition.templateType)}
                    </span>
                  </div>
                  <CardTitle className="line-clamp-2 mt-4">{petition.title}</CardTitle>
                  <CardDescription className="space-y-1">
                    {petition.numeroProcesso && (
                      <p className="text-sm">Processo: {petition.numeroProcesso}</p>
                    )}
                    {petition.autor && (
                      <p className="text-sm">Autor: {petition.autor}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Atualizado em {new Date(petition.updatedAt).toLocaleDateString('pt-BR')}
                    </p>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEdit(petition.id, petition.templateType)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setPetitionToDelete(petition.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="py-12">
            <CardContent className="text-center">
              <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">
                {searchQuery || filterType !== "all" 
                  ? "Nenhuma petição encontrada" 
                  : "Nenhuma petição salva ainda"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery || filterType !== "all"
                  ? "Tente ajustar os filtros de busca"
                  : "Comece criando sua primeira petição com Visual Law"}
              </p>
              <Button onClick={() => setLocation("/templates")}>
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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta petição? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => petitionToDelete && handleDelete(petitionToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
