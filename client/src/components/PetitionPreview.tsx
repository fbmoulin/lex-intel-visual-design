import { memo, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { SummaryCard, SummaryData } from "./SummaryCard";
import { Timeline, TimelineEvent } from "./Timeline";
import { PetitionChart, ChartData } from "./PetitionChart";

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

/** Template title mapping - defined outside component to avoid recreation */
const TEMPLATE_TITLES: Record<string, string> = {
  civil: "Petição Civil",
  trabalhista: "Petição Trabalhista",
  criminal: "Petição Criminal",
  tributaria: "Petição Tributária",
  consumidor: "Direito do Consumidor",
};

export const PetitionPreview = memo(function PetitionPreview({
  formData,
  templateId,
}: PetitionPreviewProps) {
  // Memoize template title lookup
  const templateTitle = useMemo(
    () => TEMPLATE_TITLES[templateId] || "Petição",
    [templateId]
  );

  // Memoize summary data to avoid object recreation on every render
  const summaryData: SummaryData = useMemo(
    () => ({
      numeroProcesso: formData.numeroProcesso,
      autor: formData.autor,
      reu: formData.reu,
      valorCausa: formData.valorCausa,
      tipo: templateTitle,
    }),
    [formData.numeroProcesso, formData.autor, formData.reu, formData.valorCausa, templateTitle]
  );

  // Memoize timeline events - only recalculate when fatos changes
  const timelineEvents: TimelineEvent[] = useMemo(
    () =>
      formData.fatos
        ? [
            {
              date: "Janeiro/2024",
              title: "Início dos Fatos",
              description:
                formData.fatos.substring(0, 150) +
                (formData.fatos.length > 150 ? "..." : ""),
            },
          ]
        : [],
    [formData.fatos]
  );

  // Memoize chart data - only recalculate when valorCausa changes
  const chartData: ChartData[] = useMemo(
    () =>
      formData.valorCausa
        ? [
            {
              name: "Valor Principal",
              value:
                parseFloat(
                  formData.valorCausa.replace(/[^\d,]/g, "").replace(",", ".")
                ) || 0,
            },
          ]
        : [],
    [formData.valorCausa]
  );

  return (
    <div className="space-y-8 bg-background p-8 rounded-lg border">
      {/* Cabeçalho */}
      <div className="text-center border-b pb-6">
        <h2 className="text-2xl font-bold mb-2">
          EXCELENTÍSSIMO SENHOR DOUTOR JUIZ DE DIREITO DA {formData.tribunal || "[TRIBUNAL]"}
        </h2>
        {formData.numeroProcesso && (
          <p className="text-lg text-muted-foreground">Processo Nº {formData.numeroProcesso}</p>
        )}
      </div>

      {/* Summary Card */}
      <SummaryCard data={summaryData} />

      {/* Qualificação das Partes */}
      {(formData.autor || formData.reu) && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-4">Qualificação das Partes</h3>
            <div className="space-y-3">
              {formData.autor && (
                <p><strong className="text-primary">AUTOR:</strong> {formData.autor}</p>
              )}
              {formData.reu && (
                <p><strong className="text-secondary">RÉU:</strong> {formData.reu}</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dos Fatos com Timeline */}
      {formData.fatos && (
        <div>
          <h3 className="text-2xl font-semibold mb-6">I - Dos Fatos</h3>
          {timelineEvents.length > 0 ? (
            <Timeline events={timelineEvents} />
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground whitespace-pre-wrap">{formData.fatos}</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Do Direito */}
      {formData.fundamentosJuridicos && (
        <div>
          <h3 className="text-2xl font-semibold mb-6">II - Do Direito</h3>
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {formData.fundamentosJuridicos}
              </p>
            </CardContent>
          </Card>
          
          {/* Gráfico de valores se disponível */}
          {chartData.length > 0 && chartData[0].value > 0 && (
            <div className="mt-6">
              <PetitionChart 
                data={chartData} 
                title="Demonstrativo de Valores"
                description="Valores envolvidos na presente ação"
              />
            </div>
          )}
        </div>
      )}

      {/* Dos Pedidos */}
      {formData.pedidos && (
        <div>
          <h3 className="text-2xl font-semibold mb-6">III - Dos Pedidos</h3>
          <Card className="bg-muted/30">
            <CardContent className="pt-6">
              <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {formData.pedidos}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Rodapé */}
      <div className="text-center pt-8 border-t space-y-4">
        {formData.valorCausa && (
          <p className="text-lg font-bold">
            Dá-se à causa o valor de {formData.valorCausa}.
          </p>
        )}
        <p className="text-muted-foreground">
          Nestes termos,<br/>
          Pede deferimento.
        </p>
        <div className="pt-8">
          <div className="inline-block border-t-2 border-foreground pt-2 px-8">
            <p className="font-semibold">ADVOGADO(A)</p>
            <p className="text-sm text-muted-foreground">OAB/UF Nº XXXXX</p>
          </div>
        </div>
      </div>
    </div>
  );
});
