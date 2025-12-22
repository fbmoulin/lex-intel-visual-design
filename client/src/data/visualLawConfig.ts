/**
 * Configuração de Elementos Visuais por Área Jurídica
 * Visual Law Enterprise System - Lex Intelligentia
 * 
 * Este arquivo define elementos visuais únicos e disruptivos para cada área do direito,
 * baseado nas melhores práticas internacionais de Legal Design.
 */

import { 
  FileText, Briefcase, Gavel, Building2, ShoppingCart, Users, 
  Building, Scale, Leaf, Clock, DollarSign, AlertTriangle,
  CheckCircle, XCircle, TrendingUp, TrendingDown, Calendar,
  MapPin, Phone, Mail, Shield, Heart, Home, Car, Plane,
  CreditCard, Banknote, Receipt, Calculator, PieChart, BarChart3,
  Target, Flag, Zap, Award, Star, ThumbsUp, ThumbsDown,
  FileWarning, FileClock, FileCheck, FileX, Hammer, BookOpen,
  Landmark, GraduationCap, Stethoscope, Factory, Truck, Package
} from "lucide-react";

// Tipos de elementos visuais disponíveis
export type VisualElementType = 
  | 'timeline' 
  | 'comparison_table' 
  | 'value_chart' 
  | 'flowchart' 
  | 'infographic' 
  | 'map' 
  | 'org_chart' 
  | 'checklist'
  | 'progress_bar'
  | 'callout_box'
  | 'quote_box'
  | 'icon_grid'
  | 'statistics_cards'
  | 'evidence_gallery'
  | 'parties_diagram';

// Configuração de cores por área jurídica
export const areaColors = {
  civil: {
    primary: '#3B82F6',      // Azul
    secondary: '#93C5FD',
    accent: '#1D4ED8',
    gradient: 'from-blue-500 to-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-500',
    text: 'text-blue-700'
  },
  trabalhista: {
    primary: '#F59E0B',      // Âmbar/Laranja
    secondary: '#FCD34D',
    accent: '#D97706',
    gradient: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-50',
    border: 'border-amber-500',
    text: 'text-amber-700'
  },
  criminal: {
    primary: '#EF4444',      // Vermelho
    secondary: '#FCA5A5',
    accent: '#DC2626',
    gradient: 'from-red-500 to-red-700',
    bg: 'bg-red-50',
    border: 'border-red-500',
    text: 'text-red-700'
  },
  tributario: {
    primary: '#10B981',      // Verde Esmeralda
    secondary: '#6EE7B7',
    accent: '#059669',
    gradient: 'from-emerald-500 to-green-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-500',
    text: 'text-emerald-700'
  },
  consumidor: {
    primary: '#8B5CF6',      // Roxo
    secondary: '#C4B5FD',
    accent: '#7C3AED',
    gradient: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50',
    border: 'border-violet-500',
    text: 'text-violet-700'
  },
  familia: {
    primary: '#EC4899',      // Rosa
    secondary: '#F9A8D4',
    accent: '#DB2777',
    gradient: 'from-pink-500 to-rose-600',
    bg: 'bg-pink-50',
    border: 'border-pink-500',
    text: 'text-pink-700'
  },
  empresarial: {
    primary: '#0EA5E9',      // Azul Céu
    secondary: '#7DD3FC',
    accent: '#0284C7',
    gradient: 'from-sky-500 to-cyan-600',
    bg: 'bg-sky-50',
    border: 'border-sky-500',
    text: 'text-sky-700'
  },
  administrativo: {
    primary: '#6366F1',      // Índigo
    secondary: '#A5B4FC',
    accent: '#4F46E5',
    gradient: 'from-indigo-500 to-indigo-700',
    bg: 'bg-indigo-50',
    border: 'border-indigo-500',
    text: 'text-indigo-700'
  },
  previdenciario: {
    primary: '#14B8A6',      // Teal
    secondary: '#5EEAD4',
    accent: '#0D9488',
    gradient: 'from-teal-500 to-teal-700',
    bg: 'bg-teal-50',
    border: 'border-teal-500',
    text: 'text-teal-700'
  },
  ambiental: {
    primary: '#22C55E',      // Verde
    secondary: '#86EFAC',
    accent: '#16A34A',
    gradient: 'from-green-500 to-green-700',
    bg: 'bg-green-50',
    border: 'border-green-500',
    text: 'text-green-700'
  }
};

// Ícones específicos por área
export const areaIcons = {
  civil: { main: Scale, secondary: [FileText, Home, Car, CreditCard] },
  trabalhista: { main: Briefcase, secondary: [Clock, DollarSign, Factory, Users] },
  criminal: { main: Gavel, secondary: [Shield, AlertTriangle, FileWarning, Hammer] },
  tributario: { main: Building2, secondary: [Calculator, Receipt, Banknote, PieChart] },
  consumidor: { main: ShoppingCart, secondary: [Package, CreditCard, Phone, Mail] },
  familia: { main: Heart, secondary: [Users, Home, GraduationCap, Calendar] },
  empresarial: { main: Building, secondary: [TrendingUp, BarChart3, Target, Award] },
  administrativo: { main: Landmark, secondary: [FileCheck, FileClock, Flag, BookOpen] },
  previdenciario: { main: Shield, secondary: [Stethoscope, Calendar, DollarSign, Clock] },
  ambiental: { main: Leaf, secondary: [MapPin, Factory, Truck, AlertTriangle] }
};

// Configuração de elementos visuais por tipo de template
export interface VisualConfig {
  elements: VisualElementType[];
  timelineConfig?: {
    showDates: boolean;
    showIcons: boolean;
    orientation: 'vertical' | 'horizontal';
    maxEvents: number;
  };
  chartConfig?: {
    type: 'bar' | 'pie' | 'line' | 'area' | 'stacked';
    showLegend: boolean;
    showValues: boolean;
    animated: boolean;
  };
  tableConfig?: {
    columns: string[];
    highlightDifferences: boolean;
    showIcons: boolean;
  };
  flowchartConfig?: {
    steps: { label: string; icon: string; description?: string }[];
    showProgress: boolean;
  };
  specialFeatures?: string[];
}

// Configurações específicas por área jurídica
export const visualConfigs: Record<string, VisualConfig> = {
  // ===== CIVIL =====
  civil: {
    elements: ['timeline', 'comparison_table', 'value_chart', 'flowchart', 'parties_diagram'],
    timelineConfig: {
      showDates: true,
      showIcons: true,
      orientation: 'vertical',
      maxEvents: 8
    },
    chartConfig: {
      type: 'bar',
      showLegend: true,
      showValues: true,
      animated: true
    },
    tableConfig: {
      columns: ['Alegação', 'Prova', 'Fundamento Legal'],
      highlightDifferences: true,
      showIcons: true
    },
    flowchartConfig: {
      steps: [
        { label: 'Petição Inicial', icon: 'FileText', description: 'Distribuição' },
        { label: 'Citação', icon: 'Mail', description: '15 dias' },
        { label: 'Contestação', icon: 'FileX', description: 'Defesa do Réu' },
        { label: 'Réplica', icon: 'FileCheck', description: 'Resposta do Autor' },
        { label: 'Instrução', icon: 'Users', description: 'Provas' },
        { label: 'Sentença', icon: 'Gavel', description: 'Decisão' }
      ],
      showProgress: true
    },
    specialFeatures: ['Cálculo de correção monetária', 'Demonstrativo de débito']
  },

  // ===== TRABALHISTA =====
  trabalhista: {
    elements: ['timeline', 'value_chart', 'comparison_table', 'checklist', 'statistics_cards'],
    timelineConfig: {
      showDates: true,
      showIcons: true,
      orientation: 'horizontal',
      maxEvents: 10
    },
    chartConfig: {
      type: 'stacked',
      showLegend: true,
      showValues: true,
      animated: true
    },
    tableConfig: {
      columns: ['Verba', 'Valor Devido', 'Valor Pago', 'Diferença'],
      highlightDifferences: true,
      showIcons: true
    },
    flowchartConfig: {
      steps: [
        { label: 'Reclamação', icon: 'FileText', description: 'Petição Inicial' },
        { label: 'Audiência Inicial', icon: 'Users', description: 'Conciliação' },
        { label: 'Defesa', icon: 'FileX', description: 'Contestação' },
        { label: 'Instrução', icon: 'BookOpen', description: 'Provas/Testemunhas' },
        { label: 'Razões Finais', icon: 'FileCheck', description: 'Alegações' },
        { label: 'Sentença', icon: 'Gavel', description: 'Decisão' }
      ],
      showProgress: true
    },
    specialFeatures: [
      'Cálculo de horas extras',
      'Demonstrativo de verbas rescisórias',
      'Timeline do contrato de trabalho',
      'Gráfico de jornada'
    ]
  },

  // ===== CRIMINAL =====
  criminal: {
    elements: ['timeline', 'evidence_gallery', 'flowchart', 'map', 'parties_diagram'],
    timelineConfig: {
      showDates: true,
      showIcons: true,
      orientation: 'vertical',
      maxEvents: 15
    },
    chartConfig: {
      type: 'bar',
      showLegend: true,
      showValues: false,
      animated: false
    },
    flowchartConfig: {
      steps: [
        { label: 'Inquérito', icon: 'Search', description: 'Investigação' },
        { label: 'Denúncia', icon: 'FileWarning', description: 'Acusação' },
        { label: 'Citação', icon: 'Mail', description: 'Notificação' },
        { label: 'Resposta', icon: 'FileText', description: 'Defesa Prévia' },
        { label: 'Audiência', icon: 'Users', description: 'Instrução' },
        { label: 'Alegações', icon: 'BookOpen', description: 'Debates' },
        { label: 'Sentença', icon: 'Gavel', description: 'Decisão' }
      ],
      showProgress: true
    },
    specialFeatures: [
      'Mapa do local dos fatos',
      'Galeria de evidências',
      'Timeline dos fatos criminosos',
      'Diagrama de relações entre envolvidos'
    ]
  },

  // ===== TRIBUTÁRIO =====
  tributario: {
    elements: ['value_chart', 'comparison_table', 'timeline', 'statistics_cards', 'flowchart'],
    timelineConfig: {
      showDates: true,
      showIcons: true,
      orientation: 'horizontal',
      maxEvents: 12
    },
    chartConfig: {
      type: 'pie',
      showLegend: true,
      showValues: true,
      animated: true
    },
    tableConfig: {
      columns: ['Tributo', 'Base de Cálculo', 'Alíquota', 'Valor Cobrado', 'Valor Devido', 'Diferença'],
      highlightDifferences: true,
      showIcons: true
    },
    flowchartConfig: {
      steps: [
        { label: 'Lançamento', icon: 'Receipt', description: 'Auto de Infração' },
        { label: 'Impugnação', icon: 'FileX', description: 'Defesa Administrativa' },
        { label: 'Decisão 1ª Inst.', icon: 'FileCheck', description: 'Julgamento' },
        { label: 'Recurso', icon: 'TrendingUp', description: 'Apelação' },
        { label: 'Decisão 2ª Inst.', icon: 'Gavel', description: 'Final Administrativa' },
        { label: 'Ação Judicial', icon: 'Scale', description: 'Judicialização' }
      ],
      showProgress: true
    },
    specialFeatures: [
      'Demonstrativo de cálculo tributário',
      'Gráfico de composição do débito',
      'Comparativo tributo cobrado vs devido',
      'Timeline do processo administrativo'
    ]
  },

  // ===== CONSUMIDOR =====
  consumidor: {
    elements: ['timeline', 'comparison_table', 'evidence_gallery', 'flowchart', 'callout_box'],
    timelineConfig: {
      showDates: true,
      showIcons: true,
      orientation: 'vertical',
      maxEvents: 10
    },
    chartConfig: {
      type: 'bar',
      showLegend: true,
      showValues: true,
      animated: true
    },
    tableConfig: {
      columns: ['Prometido', 'Entregue', 'Diferença', 'Prova'],
      highlightDifferences: true,
      showIcons: true
    },
    flowchartConfig: {
      steps: [
        { label: 'Compra', icon: 'ShoppingCart', description: 'Aquisição' },
        { label: 'Problema', icon: 'AlertTriangle', description: 'Vício/Defeito' },
        { label: 'Reclamação', icon: 'Phone', description: 'SAC' },
        { label: 'Procon', icon: 'Shield', description: 'Reclamação' },
        { label: 'Ação Judicial', icon: 'Scale', description: 'Processo' },
        { label: 'Sentença', icon: 'Gavel', description: 'Decisão' }
      ],
      showProgress: true
    },
    specialFeatures: [
      'Comparativo produto prometido vs entregue',
      'Timeline de reclamações',
      'Galeria de prints/provas',
      'Cálculo de danos materiais e morais'
    ]
  },

  // ===== FAMÍLIA =====
  familia: {
    elements: ['timeline', 'org_chart', 'value_chart', 'checklist', 'parties_diagram'],
    timelineConfig: {
      showDates: true,
      showIcons: true,
      orientation: 'vertical',
      maxEvents: 15
    },
    chartConfig: {
      type: 'pie',
      showLegend: true,
      showValues: true,
      animated: true
    },
    flowchartConfig: {
      steps: [
        { label: 'Petição', icon: 'FileText', description: 'Inicial' },
        { label: 'Citação', icon: 'Mail', description: 'Notificação' },
        { label: 'Audiência', icon: 'Users', description: 'Conciliação' },
        { label: 'Acordo', icon: 'Handshake', description: 'Ou Instrução' },
        { label: 'Sentença', icon: 'Gavel', description: 'Homologação' }
      ],
      showProgress: true
    },
    specialFeatures: [
      'Árvore genealógica/organograma familiar',
      'Timeline do relacionamento',
      'Gráfico de partilha de bens',
      'Calendário de guarda/visitação'
    ]
  },

  // ===== EMPRESARIAL =====
  empresarial: {
    elements: ['org_chart', 'value_chart', 'timeline', 'flowchart', 'statistics_cards'],
    timelineConfig: {
      showDates: true,
      showIcons: true,
      orientation: 'horizontal',
      maxEvents: 12
    },
    chartConfig: {
      type: 'area',
      showLegend: true,
      showValues: true,
      animated: true
    },
    flowchartConfig: {
      steps: [
        { label: 'Petição', icon: 'FileText', description: 'Requerimento' },
        { label: 'Deferimento', icon: 'CheckCircle', description: 'Processamento' },
        { label: 'Assembleia', icon: 'Users', description: 'Credores' },
        { label: 'Plano', icon: 'Target', description: 'Recuperação' },
        { label: 'Homologação', icon: 'Gavel', description: 'Aprovação' },
        { label: 'Cumprimento', icon: 'Flag', description: 'Execução' }
      ],
      showProgress: true
    },
    specialFeatures: [
      'Organograma societário',
      'Gráfico de evolução financeira',
      'Quadro de credores',
      'Fluxo de recuperação judicial'
    ]
  },

  // ===== ADMINISTRATIVO =====
  administrativo: {
    elements: ['timeline', 'flowchart', 'comparison_table', 'callout_box', 'checklist'],
    timelineConfig: {
      showDates: true,
      showIcons: true,
      orientation: 'vertical',
      maxEvents: 10
    },
    chartConfig: {
      type: 'bar',
      showLegend: true,
      showValues: false,
      animated: true
    },
    flowchartConfig: {
      steps: [
        { label: 'Ato Impugnado', icon: 'FileWarning', description: 'Ilegalidade' },
        { label: 'Recurso Adm.', icon: 'FileText', description: 'Impugnação' },
        { label: 'Decisão Adm.', icon: 'FileCheck', description: 'Resposta' },
        { label: 'Mandado', icon: 'Shield', description: 'Segurança' },
        { label: 'Liminar', icon: 'Zap', description: 'Urgência' },
        { label: 'Mérito', icon: 'Gavel', description: 'Sentença' }
      ],
      showProgress: true
    },
    specialFeatures: [
      'Fluxograma do processo administrativo',
      'Comparativo ato ilegal vs legal',
      'Timeline do procedimento',
      'Checklist de requisitos do MS'
    ]
  },

  // ===== PREVIDENCIÁRIO =====
  previdenciario: {
    elements: ['timeline', 'value_chart', 'comparison_table', 'statistics_cards', 'checklist'],
    timelineConfig: {
      showDates: true,
      showIcons: true,
      orientation: 'horizontal',
      maxEvents: 20
    },
    chartConfig: {
      type: 'line',
      showLegend: true,
      showValues: true,
      animated: true
    },
    tableConfig: {
      columns: ['Período', 'Empregador', 'Contribuições', 'Tempo', 'Status'],
      highlightDifferences: true,
      showIcons: true
    },
    flowchartConfig: {
      steps: [
        { label: 'Requerimento', icon: 'FileText', description: 'INSS' },
        { label: 'Análise', icon: 'Search', description: 'Documentos' },
        { label: 'Perícia', icon: 'Stethoscope', description: 'Se necessário' },
        { label: 'Decisão', icon: 'FileCheck', description: 'INSS' },
        { label: 'Recurso', icon: 'TrendingUp', description: 'CRPS' },
        { label: 'Ação Judicial', icon: 'Scale', description: 'JEF/Vara' }
      ],
      showProgress: true
    },
    specialFeatures: [
      'Timeline de contribuições',
      'Gráfico de evolução salarial',
      'Cálculo de tempo de contribuição',
      'Simulação de RMI'
    ]
  },

  // ===== AMBIENTAL =====
  ambiental: {
    elements: ['map', 'timeline', 'evidence_gallery', 'comparison_table', 'statistics_cards'],
    timelineConfig: {
      showDates: true,
      showIcons: true,
      orientation: 'vertical',
      maxEvents: 12
    },
    chartConfig: {
      type: 'bar',
      showLegend: true,
      showValues: true,
      animated: true
    },
    flowchartConfig: {
      steps: [
        { label: 'Dano', icon: 'AlertTriangle', description: 'Identificação' },
        { label: 'Fiscalização', icon: 'Search', description: 'Autuação' },
        { label: 'Inquérito', icon: 'FileText', description: 'Civil/Criminal' },
        { label: 'ACP', icon: 'Scale', description: 'Ação Civil Pública' },
        { label: 'Liminar', icon: 'Zap', description: 'Urgência' },
        { label: 'Reparação', icon: 'Leaf', description: 'Recuperação' }
      ],
      showProgress: true
    },
    specialFeatures: [
      'Mapa da área afetada',
      'Galeria de fotos do dano',
      'Timeline da degradação',
      'Comparativo antes/depois'
    ]
  }
};

// Função para obter configuração visual por tipo
export function getVisualConfig(templateType: string): VisualConfig {
  return visualConfigs[templateType] || visualConfigs.civil;
}

// Função para obter cores por tipo
export function getAreaColors(templateType: string) {
  return areaColors[templateType as keyof typeof areaColors] || areaColors.civil;
}

// Função para obter ícones por tipo
export function getAreaIcons(templateType: string) {
  return areaIcons[templateType as keyof typeof areaIcons] || areaIcons.civil;
}
