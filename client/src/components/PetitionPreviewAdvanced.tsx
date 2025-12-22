/**
 * PetitionPreviewAdvanced - Preview Avançado com Visual Law Especializado
 * Lex Intelligentia - Enterprise Visual Law System
 * 
 * Este componente renderiza previews de petições com elementos visuais
 * específicos e diferenciados para cada área jurídica.
 */

import { Card, CardContent } from "@/components/ui/card";
import { 
  Scale, FileText, Users, Gavel, AlertCircle, CheckCircle2, BookOpen, Quote,
  Clock, DollarSign, AlertTriangle, TrendingUp, Calendar, MapPin, Phone,
  Shield, Heart, Home, CreditCard, Banknote, Receipt, Calculator, Target,
  Briefcase, Building2, ShoppingCart, Leaf, Building, Landmark, Stethoscope
} from "lucide-react";
import { getAreaColors, getVisualConfig, visualConfigs } from "@/data/visualLawConfig";
import {
  AdvancedTimeline,
  ComparisonTable,
  StatisticsCards,
  ProcessFlowchartAdvanced,
  CalloutBox,
  VisualChecklist,
  PartiesDiagram,
  EvidenceGallery
} from "./VisualLawComponents";

interface PetitionPreviewAdvancedProps {
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

// ===== COMPONENTES AUXILIARES =====

// Header da Petição com estilo por área
function PetitionHeader({ tribunal, numeroProcesso, templateType }: { 
  tribunal: string; 
  numeroProcesso: string; 
  templateType: string;
}) {
  const colors = getAreaColors(templateType);
  
  return (
    <div className={`text-center border-b-4 ${colors.border} pb-6 mb-8`}>
      <div className={`inline-block px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 bg-gradient-to-r ${colors.gradient} text-white`}>
        {getAreaLabel(templateType)}
      </div>
      <h2 className="text-xl font-bold mb-2 text-gray-900 leading-tight">
        EXCELENTÍSSIMO SENHOR DOUTOR JUIZ DE DIREITO DA {tribunal || "[VARA/TRIBUNAL]"}
      </h2>
      {numeroProcesso && (
        <p className="text-base text-gray-600 mt-2">Processo Nº {numeroProcesso}</p>
      )}
    </div>
  );
}

// Label da área jurídica
function getAreaLabel(templateType: string): string {
  const labels: Record<string, string> = {
    civil: 'Direito Civil',
    trabalhista: 'Direito Trabalhista',
    criminal: 'Direito Criminal',
    tributario: 'Direito Tributário',
    consumidor: 'Direito do Consumidor',
    familia: 'Direito de Família',
    empresarial: 'Direito Empresarial',
    administrativo: 'Direito Administrativo',
    previdenciario: 'Direito Previdenciário',
    ambiental: 'Direito Ambiental'
  };
  return labels[templateType] || 'Petição';
}

// Ícone da área jurídica
function getAreaIcon(templateType: string) {
  const icons: Record<string, any> = {
    civil: Scale,
    trabalhista: Briefcase,
    criminal: Gavel,
    tributario: Building2,
    consumidor: ShoppingCart,
    familia: Heart,
    empresarial: Building,
    administrativo: Landmark,
    previdenciario: Shield,
    ambiental: Leaf
  };
  return icons[templateType] || Scale;
}

// Summary Card Avançado
function AdvancedSummaryCard({ formData, templateType }: { 
  formData: PetitionPreviewAdvancedProps['formData']; 
  templateType: string;
}) {
  const colors = getAreaColors(templateType);
  const Icon = getAreaIcon(templateType);

  return (
    <div className={`rounded-xl ${colors.bg} border-2 ${colors.border} p-6 shadow-lg`}>
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${colors.gradient}`}>
          <Icon className="h-8 w-8 text-white" />
        </div>
        <div>
          <h3 className={`text-lg font-bold ${colors.text}`}>Resumo da Petição</h3>
          <p className="text-sm text-gray-500">{getAreaLabel(templateType)}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <FileText className={`h-4 w-4 ${colors.text}`} />
            <span className="text-xs font-semibold text-gray-500 uppercase">Processo Nº</span>
          </div>
          <p className="font-bold text-gray-900">{formData.numeroProcesso || "N/A"}</p>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className={`h-4 w-4 ${colors.text}`} />
            <span className="text-xs font-semibold text-gray-500 uppercase">Valor da Causa</span>
          </div>
          <p className="font-bold text-gray-900">{formData.valorCausa || "N/A"}</p>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Users className={`h-4 w-4 text-green-600`} />
            <span className="text-xs font-semibold text-gray-500 uppercase">Autor</span>
          </div>
          <p className="font-bold text-gray-900 truncate">{formData.autor || "N/A"}</p>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Users className={`h-4 w-4 text-red-600`} />
            <span className="text-xs font-semibold text-gray-500 uppercase">Réu</span>
          </div>
          <p className="font-bold text-gray-900 truncate">{formData.reu || "N/A"}</p>
        </div>
      </div>
    </div>
  );
}

// Seção de Fatos com Timeline
function FactsSection({ fatos, templateType }: { fatos: string; templateType: string }) {
  const colors = getAreaColors(templateType);
  
  // Extrair eventos da timeline a partir do texto de fatos
  const extractTimelineEvents = (text: string) => {
    const events: Array<{date: string; title: string; description: string; type: 'positive' | 'negative' | 'neutral' | 'warning'}> = [];
    const paragraphs = text.split('\n\n').filter(p => p.trim());
    
    // Tentar extrair datas do texto
    const datePatterns = [
      /em (\d{1,2}\/\d{1,2}\/\d{4})/gi,
      /em (\d{4})/gi,
      /(\d{1,2} de \w+ de \d{4})/gi,
      /em \[DATA\]/gi
    ];
    
    paragraphs.forEach((para, index) => {
      let date = `Evento ${index + 1}`;
      let eventType: 'positive' | 'negative' | 'neutral' | 'warning' = 'neutral';
      
      // Tentar extrair data
      for (const pattern of datePatterns) {
        const match = para.match(pattern);
        if (match) {
          date = match[0].replace(/em /i, '');
          break;
        }
      }
      
      // Determinar tipo do evento baseado em palavras-chave
      const lowerPara = para.toLowerCase();
      if (lowerPara.includes('inadimplente') || lowerPara.includes('não pagou') || 
          lowerPara.includes('descumpriu') || lowerPara.includes('dano') ||
          lowerPara.includes('ilícito') || lowerPara.includes('prejuízo')) {
        eventType = 'negative';
      } else if (lowerPara.includes('contrato') || lowerPara.includes('acordo') ||
                 lowerPara.includes('celebrou') || lowerPara.includes('admitido')) {
        eventType = 'positive';
      } else if (lowerPara.includes('tentativa') || lowerPara.includes('notificação') ||
                 lowerPara.includes('cobrança')) {
        eventType = 'warning';
      }
      
      events.push({
        date,
        title: index === 0 ? 'Início dos Fatos' : `Fato ${index + 1}`,
        description: para.substring(0, 200) + (para.length > 200 ? '...' : ''),
        type: eventType
      });
    });
    
    return events.slice(0, 5); // Limitar a 5 eventos
  };

  const timelineEvents = extractTimelineEvents(fatos);

  return (
    <div className="space-y-6">
      <h3 className={`text-xl font-bold text-gray-900 flex items-center gap-2 border-b-2 ${colors.border} pb-2`}>
        <FileText className={`h-6 w-6 ${colors.text}`} />
        I - Dos Fatos
      </h3>
      
      {/* Timeline Visual */}
      {timelineEvents.length > 0 && (
        <div className="mb-6">
          <h4 className={`text-sm font-bold ${colors.text} uppercase tracking-wide mb-4 flex items-center gap-2`}>
            <Clock className="h-4 w-4" />
            Cronologia dos Fatos
          </h4>
          <AdvancedTimeline 
            events={timelineEvents} 
            templateType={templateType}
            orientation="vertical"
          />
        </div>
      )}
      
      {/* Texto completo dos fatos */}
      <div className={`${colors.bg} rounded-lg p-6 border ${colors.border}`}>
        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{fatos}</p>
      </div>
    </div>
  );
}

// Seção de Fundamentos Jurídicos
function LegalBasisSection({ fundamentosJuridicos, templateType }: { 
  fundamentosJuridicos: string; 
  templateType: string;
}) {
  const colors = getAreaColors(templateType);
  
  // Extrair citações de artigos e jurisprudência
  const extractQuotes = (text: string) => {
    const quotes = [];
    
    // Padrões para encontrar citações
    const patterns = [
      /artigo \d+[^.]*\./gi,
      /art\. \d+[^.]*\./gi,
      /súmula \d+[^.]*\./gi,
      /"[^"]+"/g
    ];
    
    for (const pattern of patterns) {
      const matches = text.match(pattern);
      if (matches) {
        quotes.push(...matches.slice(0, 2));
      }
    }
    
    return quotes.slice(0, 3);
  };

  const quotes = extractQuotes(fundamentosJuridicos);

  return (
    <div className="space-y-6">
      <h3 className={`text-xl font-bold text-gray-900 flex items-center gap-2 border-b-2 ${colors.border} pb-2`}>
        <BookOpen className={`h-6 w-6 ${colors.text}`} />
        II - Do Direito
      </h3>
      
      {/* Citações em destaque */}
      {quotes.length > 0 && (
        <div className="space-y-4">
          {quotes.map((quote, index) => (
            <CalloutBox
              key={index}
              type="quote"
              content={quote}
              source="Fundamentação Legal"
              templateType={templateType}
            />
          ))}
        </div>
      )}
      
      {/* Texto completo */}
      <div className={`${colors.bg} rounded-lg p-6 border ${colors.border}`}>
        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
          {fundamentosJuridicos}
        </p>
      </div>
    </div>
  );
}

// Seção de Pedidos
function RequestsSection({ pedidos, templateType }: { pedidos: string; templateType: string }) {
  const colors = getAreaColors(templateType);
  
  // Extrair lista de pedidos
  const extractRequests = (text: string) => {
    const requests = [];
    const lines = text.split('\n').filter(l => l.trim());
    
    for (const line of lines) {
      const trimmed = line.trim();
      // Identificar itens de lista (a), b), 1., 2., -, etc.)
      if (/^[a-z]\)|^\d+\.|^-|^•/.test(trimmed) || trimmed.length > 20) {
        requests.push({
          label: trimmed,
          checked: false,
          required: trimmed.toLowerCase().includes('procedência') || 
                   trimmed.toLowerCase().includes('condenação')
        });
      }
    }
    
    return requests;
  };

  const requestItems = extractRequests(pedidos);

  return (
    <div className="space-y-6">
      <h3 className={`text-xl font-bold text-gray-900 flex items-center gap-2 border-b-2 ${colors.border} pb-2`}>
        <Gavel className={`h-6 w-6 ${colors.text}`} />
        III - Dos Pedidos
      </h3>
      
      {/* Lista visual de pedidos */}
      <div className={`rounded-xl border-2 ${colors.border} overflow-hidden shadow-lg`}>
        <div className={`px-6 py-4 bg-gradient-to-r ${colors.gradient}`}>
          <h4 className="font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            Pedidos da Parte Autora
          </h4>
        </div>
        <div className="p-6 bg-white space-y-4">
          {requestItems.length > 0 ? (
            requestItems.map((item, index) => (
              <div 
                key={index} 
                className={`flex items-start gap-4 p-4 rounded-lg ${
                  item.required ? `${colors.bg} border ${colors.border}` : 'bg-gray-50'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-r ${colors.gradient} text-white font-bold`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-gray-700 leading-relaxed">{item.label}</p>
                  {item.required && (
                    <span className={`inline-block mt-2 text-xs ${colors.text} font-semibold px-2 py-1 rounded ${colors.bg}`}>
                      ⭐ Pedido Principal
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{pedidos}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Rodapé da Petição
function PetitionFooter({ valorCausa, templateType }: { valorCausa: string; templateType: string }) {
  const colors = getAreaColors(templateType);
  
  return (
    <div className={`text-center pt-8 border-t-4 ${colors.border} space-y-4`}>
      {valorCausa && (
        <div className={`inline-block px-6 py-3 rounded-lg ${colors.bg} border ${colors.border}`}>
          <p className={`text-lg font-bold ${colors.text}`}>
            Dá-se à causa o valor de {valorCausa}
          </p>
        </div>
      )}
      <p className="text-gray-600">
        Nestes termos,<br/>
        Pede deferimento.
      </p>
      <p className="text-gray-500 text-sm mt-4">
        [Local], [Data]
      </p>
      <div className="pt-8">
        <div className={`inline-block border-t-4 ${colors.border} pt-4 px-12`}>
          <p className="font-semibold text-gray-900">ADVOGADO(A)</p>
          <p className="text-sm text-gray-600">OAB/UF Nº XXXXX</p>
        </div>
      </div>
    </div>
  );
}

// ===== COMPONENTES ESPECÍFICOS POR ÁREA =====

// Elementos específicos para TRABALHISTA
function TrabalhistaElements({ formData, templateType }: { 
  formData: PetitionPreviewAdvancedProps['formData']; 
  templateType: string;
}) {
  const colors = getAreaColors(templateType);
  
  // Estatísticas de exemplo para trabalhista
  const stats = [
    { label: 'Tempo de Serviço', value: '3 anos', icon: 'Clock', trend: 'neutral' as const },
    { label: 'Horas Extras', value: '450h', icon: 'TrendingUp', trend: 'up' as const },
    { label: 'Verbas Devidas', value: formData.valorCausa || 'R$ 0', icon: 'DollarSign', trend: 'up' as const },
    { label: 'Documentos', value: '12', icon: 'FileText' }
  ];

  // Tabela comparativa de verbas
  const verbasComparison = [
    { label: 'Aviso Prévio', expected: 'R$ 3.000,00', actual: 'R$ 0,00', difference: 'R$ 3.000,00', status: 'mismatch' as const },
    { label: 'Férias + 1/3', expected: 'R$ 4.000,00', actual: 'R$ 0,00', difference: 'R$ 4.000,00', status: 'mismatch' as const },
    { label: '13º Proporcional', expected: 'R$ 2.500,00', actual: 'R$ 0,00', difference: 'R$ 2.500,00', status: 'mismatch' as const },
    { label: 'FGTS + 40%', expected: 'R$ 5.600,00', actual: 'R$ 0,00', difference: 'R$ 5.600,00', status: 'mismatch' as const },
  ];

  return (
    <div className="space-y-6 my-8">
      <div className={`p-4 rounded-lg ${colors.bg} border ${colors.border}`}>
        <h4 className={`text-sm font-bold ${colors.text} uppercase tracking-wide mb-4 flex items-center gap-2`}>
          <Briefcase className="h-4 w-4" />
          Dados do Contrato de Trabalho
        </h4>
        <StatisticsCards cards={stats} templateType={templateType} />
      </div>
      
      <ComparisonTable
        title="Demonstrativo de Verbas Rescisórias"
        rows={verbasComparison}
        templateType={templateType}
        columns={{ expected: 'Valor Devido', actual: 'Valor Pago', difference: 'Diferença' }}
      />
    </div>
  );
}

// Elementos específicos para TRIBUTÁRIO
function TributarioElements({ formData, templateType }: { 
  formData: PetitionPreviewAdvancedProps['formData']; 
  templateType: string;
}) {
  const colors = getAreaColors(templateType);
  
  const stats = [
    { label: 'Tributo', value: 'ICMS', icon: 'Receipt' },
    { label: 'Período', value: '2020-2024', icon: 'Calendar' },
    { label: 'Valor Contestado', value: formData.valorCausa || 'R$ 0', icon: 'DollarSign', trend: 'down' as const },
    { label: 'Multa Aplicada', value: '100%', icon: 'AlertTriangle', trend: 'down' as const }
  ];

  const tributosComparison = [
    { label: 'Base de Cálculo', expected: 'R$ 100.000,00', actual: 'R$ 150.000,00', difference: 'R$ 50.000,00', status: 'mismatch' as const },
    { label: 'Alíquota', expected: '18%', actual: '25%', difference: '7%', status: 'mismatch' as const },
    { label: 'Tributo Principal', expected: 'R$ 18.000,00', actual: 'R$ 37.500,00', difference: 'R$ 19.500,00', status: 'mismatch' as const },
    { label: 'Multa', expected: 'R$ 0,00', actual: 'R$ 37.500,00', difference: 'R$ 37.500,00', status: 'mismatch' as const },
  ];

  return (
    <div className="space-y-6 my-8">
      <div className={`p-4 rounded-lg ${colors.bg} border ${colors.border}`}>
        <h4 className={`text-sm font-bold ${colors.text} uppercase tracking-wide mb-4 flex items-center gap-2`}>
          <Calculator className="h-4 w-4" />
          Dados do Lançamento Tributário
        </h4>
        <StatisticsCards cards={stats} templateType={templateType} />
      </div>
      
      <ComparisonTable
        title="Demonstrativo de Cálculo Tributário"
        rows={tributosComparison}
        templateType={templateType}
        columns={{ expected: 'Valor Correto', actual: 'Valor Cobrado', difference: 'Excesso' }}
      />
    </div>
  );
}

// Elementos específicos para CONSUMIDOR
function ConsumidorElements({ formData, templateType }: { 
  formData: PetitionPreviewAdvancedProps['formData']; 
  templateType: string;
}) {
  const colors = getAreaColors(templateType);
  
  const stats = [
    { label: 'Produto/Serviço', value: 'Eletrônico', icon: 'ShoppingCart' },
    { label: 'Data da Compra', value: '15/01/2024', icon: 'Calendar' },
    { label: 'Valor Pago', value: 'R$ 2.500,00', icon: 'CreditCard' },
    { label: 'Reclamações', value: '3', icon: 'Phone', trend: 'up' as const }
  ];

  const produtoComparison = [
    { label: 'Especificação', expected: 'Conforme anúncio', actual: 'Diferente', status: 'mismatch' as const },
    { label: 'Funcionamento', expected: 'Perfeito', actual: 'Defeituoso', status: 'mismatch' as const },
    { label: 'Garantia', expected: '12 meses', actual: 'Negada', status: 'mismatch' as const },
    { label: 'Suporte', expected: 'Disponível', actual: 'Inexistente', status: 'mismatch' as const },
  ];

  const evidencias = [
    { type: 'screenshot' as const, title: 'Print do Anúncio', description: 'Propaganda do produto', relevance: 'high' as const, date: '15/01/2024' },
    { type: 'document' as const, title: 'Nota Fiscal', description: 'Comprovante de compra', relevance: 'high' as const, date: '15/01/2024' },
    { type: 'screenshot' as const, title: 'Protocolo SAC', description: 'Reclamação registrada', relevance: 'medium' as const, date: '20/01/2024' },
    { type: 'photo' as const, title: 'Foto do Defeito', description: 'Evidência do vício', relevance: 'high' as const, date: '22/01/2024' },
  ];

  return (
    <div className="space-y-6 my-8">
      <div className={`p-4 rounded-lg ${colors.bg} border ${colors.border}`}>
        <h4 className={`text-sm font-bold ${colors.text} uppercase tracking-wide mb-4 flex items-center gap-2`}>
          <ShoppingCart className="h-4 w-4" />
          Dados da Relação de Consumo
        </h4>
        <StatisticsCards cards={stats} templateType={templateType} />
      </div>
      
      <ComparisonTable
        title="Comparativo: Prometido vs Entregue"
        rows={produtoComparison}
        templateType={templateType}
        columns={{ expected: 'Prometido', actual: 'Entregue' }}
      />
      
      <EvidenceGallery evidences={evidencias} templateType={templateType} />
    </div>
  );
}

// Elementos específicos para FAMÍLIA
function FamiliaElements({ formData, templateType }: { 
  formData: PetitionPreviewAdvancedProps['formData']; 
  templateType: string;
}) {
  const colors = getAreaColors(templateType);
  
  const stats = [
    { label: 'Tipo de Ação', value: 'Divórcio', icon: 'Heart' },
    { label: 'Duração União', value: '10 anos', icon: 'Calendar' },
    { label: 'Filhos Menores', value: '2', icon: 'Users' },
    { label: 'Bens a Partilhar', value: '5', icon: 'Home' }
  ];

  const parties = [
    { 
      name: formData.autor || '[Nome do Autor]', 
      role: 'REQUERENTE', 
      type: 'autor' as const,
      details: ['CPF: XXX.XXX.XXX-XX', 'Residente em [Cidade/UF]']
    },
    { 
      name: formData.reu || '[Nome do Réu]', 
      role: 'REQUERIDO', 
      type: 'reu' as const,
      details: ['CPF: XXX.XXX.XXX-XX', 'Residente em [Cidade/UF]']
    }
  ];

  return (
    <div className="space-y-6 my-8">
      <div className={`p-4 rounded-lg ${colors.bg} border ${colors.border}`}>
        <h4 className={`text-sm font-bold ${colors.text} uppercase tracking-wide mb-4 flex items-center gap-2`}>
          <Heart className="h-4 w-4" />
          Dados do Processo Familiar
        </h4>
        <StatisticsCards cards={stats} templateType={templateType} />
      </div>
      
      <PartiesDiagram parties={parties} templateType={templateType} />
    </div>
  );
}

// Elementos específicos para CRIMINAL
function CriminalElements({ formData, templateType }: { 
  formData: PetitionPreviewAdvancedProps['formData']; 
  templateType: string;
}) {
  const colors = getAreaColors(templateType);
  
  const stats = [
    { label: 'Tipo Penal', value: 'Art. 155 CP', icon: 'Gavel' },
    { label: 'Data do Fato', value: '10/01/2024', icon: 'Calendar' },
    { label: 'Situação', value: 'Preso', icon: 'Shield', trend: 'down' as const },
    { label: 'Testemunhas', value: '3', icon: 'Users' }
  ];

  const parties = [
    { 
      name: formData.autor || '[Nome do Acusado]', 
      role: 'ACUSADO/PACIENTE', 
      type: 'autor' as const,
      details: ['CPF: XXX.XXX.XXX-XX', 'Preso desde: XX/XX/XXXX']
    },
    { 
      name: 'Ministério Público', 
      role: 'ACUSAÇÃO', 
      type: 'reu' as const,
      details: ['Promotor: Dr. [Nome]']
    }
  ];

  return (
    <div className="space-y-6 my-8">
      <CalloutBox
        type="warning"
        title="⚠️ Atenção"
        content="Esta petição trata de matéria criminal. Todos os prazos são peremptórios e a defesa deve ser exercida com máxima diligência."
        templateType={templateType}
      />
      
      <div className={`p-4 rounded-lg ${colors.bg} border ${colors.border}`}>
        <h4 className={`text-sm font-bold ${colors.text} uppercase tracking-wide mb-4 flex items-center gap-2`}>
          <Gavel className="h-4 w-4" />
          Dados do Processo Criminal
        </h4>
        <StatisticsCards cards={stats} templateType={templateType} />
      </div>
      
      <PartiesDiagram parties={parties} templateType={templateType} />
    </div>
  );
}

// ===== COMPONENTE PRINCIPAL =====

export function PetitionPreviewAdvanced({ formData, templateId }: PetitionPreviewAdvancedProps) {
  const colors = getAreaColors(templateId);
  const config = getVisualConfig(templateId);
  
  // Fluxograma processual baseado na configuração
  const flowSteps = config.flowchartConfig?.steps || [
    { label: 'Petição Inicial', icon: 'FileText', description: 'Distribuição' },
    { label: 'Citação', icon: 'Mail', description: '15 dias' },
    { label: 'Contestação', icon: 'FileX', description: 'Defesa' },
    { label: 'Instrução', icon: 'Users', description: 'Provas' },
    { label: 'Sentença', icon: 'Gavel', description: 'Decisão' }
  ];

  // Partes do processo
  const parties = [
    { 
      name: formData.autor || '[Qualificação do Autor]', 
      role: 'AUTOR', 
      type: 'autor' as const,
      details: ['[Nacionalidade], [Estado Civil]', '[Profissão]', 'CPF: XXX.XXX.XXX-XX']
    },
    { 
      name: formData.reu || '[Qualificação do Réu]', 
      role: 'RÉU', 
      type: 'reu' as const,
      details: ['[Nacionalidade], [Estado Civil]', '[Profissão]', 'CPF: XXX.XXX.XXX-XX']
    }
  ];

  // Renderizar elementos específicos por área
  const renderAreaSpecificElements = () => {
    switch(templateId) {
      case 'trabalhista':
        return <TrabalhistaElements formData={formData} templateType={templateId} />;
      case 'tributario':
        return <TributarioElements formData={formData} templateType={templateId} />;
      case 'consumidor':
        return <ConsumidorElements formData={formData} templateType={templateId} />;
      case 'familia':
        return <FamiliaElements formData={formData} templateType={templateId} />;
      case 'criminal':
        return <CriminalElements formData={formData} templateType={templateId} />;
      default:
        return null;
    }
  };

  return (
    <div 
      className="space-y-8 bg-white p-8 rounded-lg border border-gray-200 shadow-sm text-gray-900" 
      style={{ backgroundColor: '#ffffff' }}
    >
      {/* Header */}
      <PetitionHeader 
        tribunal={formData.tribunal} 
        numeroProcesso={formData.numeroProcesso}
        templateType={templateId}
      />

      {/* Fluxograma Processual */}
      <ProcessFlowchartAdvanced 
        steps={flowSteps} 
        templateType={templateId}
        currentStep={0}
      />

      {/* Summary Card */}
      <AdvancedSummaryCard formData={formData} templateType={templateId} />

      {/* Diagrama de Partes */}
      <PartiesDiagram parties={parties} templateType={templateId} />

      {/* Elementos específicos da área */}
      {renderAreaSpecificElements()}

      {/* Dos Fatos */}
      {formData.fatos && (
        <FactsSection fatos={formData.fatos} templateType={templateId} />
      )}

      {/* Do Direito */}
      {formData.fundamentosJuridicos && (
        <LegalBasisSection fundamentosJuridicos={formData.fundamentosJuridicos} templateType={templateId} />
      )}

      {/* Dos Pedidos */}
      {formData.pedidos && (
        <RequestsSection pedidos={formData.pedidos} templateType={templateId} />
      )}

      {/* Rodapé */}
      <PetitionFooter valorCausa={formData.valorCausa} templateType={templateId} />
    </div>
  );
}

export default PetitionPreviewAdvanced;
