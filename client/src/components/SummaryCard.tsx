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

export function SummaryCard({ data }: SummaryCardProps) {
  return (
    <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 shadow-md">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-sm">
            <Scale className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-amber-800">Resumo da Petição</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-white border border-amber-100 shadow-sm">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <Scale className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-medium text-amber-600 uppercase tracking-wide">Processo Nº</p>
                <p className="text-base font-semibold text-gray-900">{data.numeroProcesso || "N/A"}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-lg bg-white border border-amber-100 shadow-sm">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-medium text-green-600 uppercase tracking-wide">Autor</p>
                <p className="text-base font-semibold text-gray-900">{data.autor || "N/A"}</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-white border border-amber-100 shadow-sm">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-medium text-red-600 uppercase tracking-wide">Réu</p>
                <p className="text-base font-semibold text-gray-900">{data.reu || "N/A"}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-lg bg-white border border-amber-100 shadow-sm">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">Valor da Causa</p>
                <p className="text-base font-semibold text-gray-900">{data.valorCausa || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-amber-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-amber-700">Tipo de Ação</span>
            <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold shadow-sm">
              {data.tipo}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
