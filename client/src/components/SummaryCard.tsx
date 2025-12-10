import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale, User, Building2, DollarSign } from "lucide-react";

export interface SummaryData {
  numeroProcesso: string;
  autor: string;
  reu: string;
  valorCausa: string;
  tipo: string;
}

interface SummaryCardProps {
  data: SummaryData;
}

export const SummaryCard = memo(function SummaryCard({ data }: SummaryCardProps) {
  return (
    <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Scale className="h-8 w-8 text-primary" />
          <CardTitle className="text-2xl">Resumo da Petição</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Scale className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Processo Nº</p>
                <p className="text-lg font-semibold">{data.numeroProcesso || "N/A"}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Autor</p>
                <p className="text-lg font-semibold">{data.autor || "N/A"}</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Réu</p>
                <p className="text-lg font-semibold">{data.reu || "N/A"}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Valor da Causa</p>
                <p className="text-lg font-semibold">{data.valorCausa || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Tipo de Ação</span>
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              {data.tipo}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
