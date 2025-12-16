import { Card, CardContent } from "@/components/ui/card";
import { SummaryCard, SummaryData } from "./SummaryCard";
import { Timeline, TimelineEvent } from "./Timeline";
import { PetitionChart, ChartData } from "./PetitionChart";
import { Scale, FileText, Users, Gavel, AlertCircle, CheckCircle2, BookOpen, Quote } from "lucide-react";

interface PetitionPreviewProps {
  formData: {
    numeroProcesso: string;
    tribunal: string;
    autor: string;
    reu: string;
    fatos: string;
    fundamentosJuridicos: string;
    pedidos: string;
    valorCausa: string;
  };
  templateId: string;
}

// Componente de Destaque para Pedidos
function RequestHighlightBox({ pedidos }: { pedidos: string }) {
  const pedidosList = pedidos.split('\n').filter(p => p.trim());
  
  return (
    <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-lg p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle2 className="h-6 w-6 text-amber-600" />
        <h4 className="text-lg font-bold text-amber-800">Pedidos da Parte Autora</h4>
      </div>
      <div className="space-y-3">
        {pedidosList.map((pedido, index) => (
          <div key={index} className="flex items-start gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center text-sm font-bold">
              {index + 1}
            </span>
            <p className="text-gray-700 leading-relaxed pt-0.5">{pedido.trim()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Componente de Citação em Destaque
function QuoteBox({ text, source }: { text: string; source?: string }) {
  return (
    <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-6 my-4 shadow-sm">
      <div className="flex gap-3">
        <Quote className="h-8 w-8 text-blue-400 flex-shrink-0" />
        <div>
          <p className="text-gray-700 italic leading-relaxed">{text}</p>
          {source && (
            <p className="text-sm text-blue-600 mt-2 font-medium">— {source}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Componente de Infográfico das Partes
function PartiesInfoGraphic({ autor, reu }: { autor: string; reu: string }) {
  return (
    <div className="grid md:grid-cols-2 gap-6 my-6">
      {/* Autor */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="text-xs font-semibold text-green-600 uppercase tracking-wide">Polo Ativo</span>
            <h4 className="text-lg font-bold text-green-800">AUTOR</h4>
          </div>
        </div>
        <p className="text-gray-700 leading-relaxed">{autor || "[Qualificação do Autor]"}</p>
      </div>
      
      {/* Réu */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="text-xs font-semibold text-red-600 uppercase tracking-wide">Polo Passivo</span>
            <h4 className="text-lg font-bold text-red-800">RÉU</h4>
          </div>
        </div>
        <p className="text-gray-700 leading-relaxed">{reu || "[Qualificação do Réu]"}</p>
      </div>
    </div>
  );
}

// Componente de Fluxograma do Processo
function ProcessFlowchart() {
  const steps = [
    { label: "Petição Inicial", icon: FileText, active: true },
    { label: "Citação", icon: AlertCircle, active: false },
    { label: "Contestação", icon: BookOpen, active: false },
    { label: "Instrução", icon: Users, active: false },
    { label: "Sentença", icon: Gavel, active: false },
  ];

  return (
    <div className="bg-gray-50 rounded-lg p-6 my-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Scale className="h-5 w-5 text-gray-600" />
        <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Fluxo Processual</h4>
      </div>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div className={`flex flex-col items-center ${step.active ? 'opacity-100' : 'opacity-50'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step.active ? 'bg-amber-500 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                <step.icon className="h-5 w-5" />
              </div>
              <span className={`text-xs mt-2 text-center max-w-[70px] ${
                step.active ? 'font-semibold text-amber-700' : 'text-gray-500'
              }`}>
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-8 h-0.5 mx-1 ${
                step.active ? 'bg-amber-500' : 'bg-gray-300'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function PetitionPreview({ formData, templateId }: PetitionPreviewProps) {
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

  const summaryData: SummaryData = {
    numeroProcesso: formData.numeroProcesso,
    autor: formData.autor,
    reu: formData.reu,
    valorCausa: formData.valorCausa,
    tipo: getTemplateTitle()
  };

  // Exemplo de eventos para timeline (pode ser expandido para processar o texto de fatos)
  const timelineEvents: TimelineEvent[] = formData.fatos ? [
    {
      date: "Janeiro/2024",
      title: "Início dos Fatos",
      description: formData.fatos.substring(0, 150) + (formData.fatos.length > 150 ? "..." : "")
    }
  ] : [];

  // Exemplo de dados para gráfico (pode ser expandido para processar valores)
  const chartData: ChartData[] = formData.valorCausa ? [
    { name: "Valor Principal", value: parseFloat(formData.valorCausa.replace(/[^\d,]/g, '').replace(',', '.')) || 0 },
    { name: "Juros", value: (parseFloat(formData.valorCausa.replace(/[^\d,]/g, '').replace(',', '.')) || 0) * 0.12 },
    { name: "Correção", value: (parseFloat(formData.valorCausa.replace(/[^\d,]/g, '').replace(',', '.')) || 0) * 0.05 },
  ] : [];

  return (
    <div className="space-y-8 bg-white p-8 rounded-lg border border-gray-200 shadow-sm text-gray-900" style={{ backgroundColor: '#ffffff' }}>
      {/* Cabeçalho */}
      <div className="text-center border-b border-gray-300 pb-6">
        <h2 className="text-xl font-bold mb-2 text-gray-900 leading-tight">
          EXCELENTÍSSIMO SENHOR DOUTOR JUIZ DE DIREITO DA {formData.tribunal || "[VARA/TRIBUNAL]"}
        </h2>
        {formData.numeroProcesso && (
          <p className="text-base text-gray-600 mt-2">Processo Nº {formData.numeroProcesso}</p>
        )}
      </div>

      {/* Fluxograma do Processo */}
      <ProcessFlowchart />

      {/* Summary Card */}
      <SummaryCard data={summaryData} />

      {/* Infográfico das Partes */}
      {(formData.autor || formData.reu) && (
        <div>
          <h3 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2">
            <Users className="h-5 w-5 text-amber-600" />
            Qualificação das Partes
          </h3>
          <PartiesInfoGraphic autor={formData.autor} reu={formData.reu} />
        </div>
      )}

      {/* Dos Fatos com Timeline */}
      {formData.fatos && (
        <div>
          <h3 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2">
            <FileText className="h-5 w-5 text-amber-600" />
            I - Dos Fatos
          </h3>
          {timelineEvents.length > 0 && (
            <Timeline events={timelineEvents} />
          )}
          <div className="bg-gray-50 rounded-lg p-6 mt-4 border border-gray-200">
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{formData.fatos}</p>
          </div>
        </div>
      )}

      {/* Do Direito */}
      {formData.fundamentosJuridicos && (
        <div>
          <h3 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-amber-600" />
            II - Do Direito
          </h3>
          
          {/* Citação de Jurisprudência Exemplo */}
          <QuoteBox 
            text="A boa-fé objetiva impõe aos contratantes o dever de agir com lealdade e cooperação durante toda a relação contratual."
            source="STJ, REsp 1.111.222/SP"
          />
          
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {formData.fundamentosJuridicos}
            </p>
          </div>
          
          {/* Gráfico de valores se disponível */}
          {chartData.length > 0 && chartData[0].value > 0 && (
            <div className="mt-6">
              <PetitionChart 
                data={chartData} 
                title="Demonstrativo de Valores"
                description="Composição dos valores envolvidos na presente ação"
              />
            </div>
          )}
        </div>
      )}

      {/* Dos Pedidos */}
      {formData.pedidos && (
        <div>
          <h3 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2">
            <Gavel className="h-5 w-5 text-amber-600" />
            III - Dos Pedidos
          </h3>
          <RequestHighlightBox pedidos={formData.pedidos} />
        </div>
      )}

      {/* Rodapé */}
      <div className="text-center pt-8 border-t border-gray-300 space-y-4">
        {formData.valorCausa && (
          <p className="text-lg font-bold text-gray-900">
            Dá-se à causa o valor de {formData.valorCausa}.
          </p>
        )}
        <p className="text-gray-600">
          Nestes termos,<br/>
          Pede deferimento.
        </p>
        <p className="text-gray-500 text-sm mt-4">
          [Local], [Data]
        </p>
        <div className="pt-8">
          <div className="inline-block border-t-2 border-gray-900 pt-2 px-8">
            <p className="font-semibold text-gray-900">ADVOGADO(A)</p>
            <p className="text-sm text-gray-600">OAB/UF Nº XXXXX</p>
          </div>
        </div>
      </div>
    </div>
  );
}
