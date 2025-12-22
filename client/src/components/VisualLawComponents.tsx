/**
 * Componentes Visual Law Especializados
 * Lex Intelligentia - Enterprise Visual Law System
 * 
 * Componentes visuais disruptivos e diferenciados por área jurídica
 */

import { 
  Scale, FileText, Users, Gavel, AlertCircle, CheckCircle2, BookOpen, Quote,
  Clock, DollarSign, AlertTriangle, TrendingUp, TrendingDown, Calendar,
  MapPin, Phone, Mail, Shield, Heart, Home, Car, CreditCard, Banknote,
  Receipt, Calculator, PieChart, BarChart3, Target, Flag, Zap, Award,
  Star, ThumbsUp, ThumbsDown, FileWarning, FileClock, FileCheck, FileX,
  Hammer, Landmark, Briefcase, Building2, ShoppingCart, Leaf, Building,
  ArrowRight, ArrowDown, Check, X, Minus, Plus, Info, HelpCircle,
  ChevronRight, ChevronDown, ExternalLink, Download, Eye, Search, Stethoscope
} from "lucide-react";
import { getAreaColors, getAreaIcons, getVisualConfig } from "@/data/visualLawConfig";

// ===== TIMELINE AVANÇADA =====
interface AdvancedTimelineEvent {
  date: string;
  title: string;
  description: string;
  type?: 'positive' | 'negative' | 'neutral' | 'warning';
  icon?: string;
  documents?: string[];
}

interface AdvancedTimelineProps {
  events: AdvancedTimelineEvent[];
  templateType: string;
  orientation?: 'vertical' | 'horizontal';
}

export function AdvancedTimeline({ events, templateType, orientation = 'vertical' }: AdvancedTimelineProps) {
  const colors = getAreaColors(templateType);
  
  const getEventIcon = (type?: string) => {
    switch(type) {
      case 'positive': return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'negative': return <X className="h-5 w-5 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      default: return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getEventColor = (type?: string) => {
    switch(type) {
      case 'positive': return 'border-green-500 bg-green-50';
      case 'negative': return 'border-red-500 bg-red-50';
      case 'warning': return 'border-amber-500 bg-amber-50';
      default: return `${colors.border} ${colors.bg}`;
    }
  };

  if (orientation === 'horizontal') {
    return (
      <div className="overflow-x-auto pb-4">
        <div className="flex items-start gap-4 min-w-max">
          {events.map((event, index) => (
            <div key={index} className="flex flex-col items-center w-48">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getEventColor(event.type)} border-2`}>
                {getEventIcon(event.type)}
              </div>
              <div className={`w-0.5 h-4 ${colors.bg}`} />
              <div className={`p-4 rounded-lg border-l-4 ${getEventColor(event.type)} shadow-sm w-full`}>
                <span className={`text-xs font-bold ${colors.text} uppercase tracking-wide`}>
                  {event.date}
                </span>
                <h4 className="font-bold text-gray-900 mt-1">{event.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                {event.documents && event.documents.length > 0 && (
                  <div className="mt-2 flex gap-1 flex-wrap">
                    {event.documents.map((doc, i) => (
                      <span key={i} className="text-xs bg-gray-200 px-2 py-0.5 rounded">
                        📎 {doc}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {index < events.length - 1 && (
                <ArrowRight className={`h-6 w-6 ${colors.text} mt-4`} />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className={`absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b ${colors.gradient}`} />
      <div className="space-y-6">
        {events.map((event, index) => (
          <div key={index} className="relative flex gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getEventColor(event.type)} border-2 z-10 flex-shrink-0`}>
              {getEventIcon(event.type)}
            </div>
            <div className={`flex-1 p-4 rounded-lg border-l-4 ${getEventColor(event.type)} shadow-sm`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-bold ${colors.text} uppercase tracking-wide`}>
                  {event.date}
                </span>
                {event.documents && (
                  <span className="text-xs text-gray-500">
                    {event.documents.length} documento(s)
                  </span>
                )}
              </div>
              <h4 className="font-bold text-gray-900">{event.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{event.description}</p>
              {event.documents && event.documents.length > 0 && (
                <div className="mt-3 flex gap-2 flex-wrap">
                  {event.documents.map((doc, i) => (
                    <span key={i} className="inline-flex items-center gap-1 text-xs bg-white border px-2 py-1 rounded shadow-sm">
                      <FileText className="h-3 w-3" />
                      {doc}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== TABELA COMPARATIVA =====
interface ComparisonRow {
  label: string;
  expected: string;
  actual: string;
  difference?: string;
  status: 'match' | 'mismatch' | 'partial';
  evidence?: string;
}

interface ComparisonTableProps {
  title: string;
  rows: ComparisonRow[];
  templateType: string;
  columns?: { expected: string; actual: string; difference?: string };
}

export function ComparisonTable({ title, rows, templateType, columns }: ComparisonTableProps) {
  const colors = getAreaColors(templateType);
  const defaultColumns = {
    expected: 'Esperado/Prometido',
    actual: 'Real/Entregue',
    difference: 'Diferença'
  };
  const cols = columns || defaultColumns;

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'match': return <Check className="h-5 w-5 text-green-500" />;
      case 'mismatch': return <X className="h-5 w-5 text-red-500" />;
      case 'partial': return <Minus className="h-5 w-5 text-amber-500" />;
      default: return null;
    }
  };

  const getStatusBg = (status: string) => {
    switch(status) {
      case 'match': return 'bg-green-50';
      case 'mismatch': return 'bg-red-50';
      case 'partial': return 'bg-amber-50';
      default: return 'bg-gray-50';
    }
  };

  return (
    <div className={`rounded-lg border-2 ${colors.border} overflow-hidden shadow-sm`}>
      <div className={`px-4 py-3 bg-gradient-to-r ${colors.gradient}`}>
        <h4 className="font-bold text-white flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          {title}
        </h4>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={`${colors.bg}`}>
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Item</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">{cols.expected}</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">{cols.actual}</th>
              {cols.difference && (
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">{cols.difference}</th>
              )}
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rows.map((row, index) => (
              <tr key={index} className={getStatusBg(row.status)}>
                <td className="px-4 py-3 font-medium text-gray-900">{row.label}</td>
                <td className="px-4 py-3 text-gray-700">{row.expected}</td>
                <td className="px-4 py-3 text-gray-700">{row.actual}</td>
                {cols.difference && (
                  <td className={`px-4 py-3 font-semibold ${row.status === 'mismatch' ? 'text-red-600' : 'text-gray-700'}`}>
                    {row.difference || '-'}
                  </td>
                )}
                <td className="px-4 py-3 text-center">{getStatusIcon(row.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ===== CARDS DE ESTATÍSTICAS =====
interface StatCard {
  label: string;
  value: string;
  icon: string;
  trend?: 'up' | 'down' | 'neutral';
  description?: string;
}

interface StatisticsCardsProps {
  cards: StatCard[];
  templateType: string;
}

export function StatisticsCards({ cards, templateType }: StatisticsCardsProps) {
  const colors = getAreaColors(templateType);

  const getIcon = (iconName: string) => {
    const icons: Record<string, any> = {
      DollarSign, Clock, Calendar, Users, FileText, CheckCircle2, AlertTriangle,
      TrendingUp, TrendingDown, Calculator, Receipt, Briefcase, Scale, Gavel
    };
    const Icon = icons[iconName] || FileText;
    return <Icon className="h-6 w-6" />;
  };

  const getTrendIcon = (trend?: string) => {
    switch(trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div 
          key={index} 
          className={`p-4 rounded-lg ${colors.bg} border ${colors.border} shadow-sm`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className={`p-2 rounded-lg bg-gradient-to-r ${colors.gradient} text-white`}>
              {getIcon(card.icon)}
            </div>
            {getTrendIcon(card.trend)}
          </div>
          <p className="text-2xl font-bold text-gray-900">{card.value}</p>
          <p className={`text-sm ${colors.text} font-medium`}>{card.label}</p>
          {card.description && (
            <p className="text-xs text-gray-500 mt-1">{card.description}</p>
          )}
        </div>
      ))}
    </div>
  );
}

// ===== FLUXOGRAMA PROCESSUAL AVANÇADO =====
interface FlowStep {
  label: string;
  icon: string;
  description?: string;
  status?: 'completed' | 'current' | 'pending';
  date?: string;
}

interface ProcessFlowchartProps {
  steps: FlowStep[];
  templateType: string;
  currentStep?: number;
}

export function ProcessFlowchartAdvanced({ steps, templateType, currentStep = 0 }: ProcessFlowchartProps) {
  const colors = getAreaColors(templateType);

  const getIcon = (iconName: string) => {
    const icons: Record<string, any> = {
      FileText, Mail, FileX, FileCheck, Users, Gavel, Search, AlertTriangle,
      Shield, BookOpen, TrendingUp, CheckCircle2, Scale, Clock, Target, Flag,
      Zap, Receipt, Briefcase, ShoppingCart, Phone, Stethoscope, Leaf, Building
    };
    const Icon = icons[iconName] || FileText;
    return <Icon className="h-5 w-5" />;
  };

  const getStepStatus = (index: number) => {
    if (index < currentStep) return 'completed';
    if (index === currentStep) return 'current';
    return 'pending';
  };

  const getStepStyle = (status: string) => {
    switch(status) {
      case 'completed':
        return `bg-green-500 text-white border-green-500`;
      case 'current':
        return `bg-gradient-to-r ${colors.gradient} text-white border-transparent`;
      default:
        return 'bg-gray-200 text-gray-500 border-gray-300';
    }
  };

  return (
    <div className={`rounded-lg ${colors.bg} p-6 shadow-sm border ${colors.border}`}>
      <div className="flex items-center gap-2 mb-6">
        <Scale className={`h-5 w-5 ${colors.text}`} />
        <h4 className={`text-sm font-bold ${colors.text} uppercase tracking-wide`}>
          Fluxo Processual
        </h4>
      </div>
      
      <div className="flex items-start justify-between overflow-x-auto pb-2">
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          return (
            <div key={index} className="flex items-center">
              <div className="flex flex-col items-center min-w-[100px]">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${getStepStyle(status)} transition-all duration-300`}>
                  {status === 'completed' ? (
                    <Check className="h-6 w-6" />
                  ) : (
                    getIcon(step.icon)
                  )}
                </div>
                <span className={`text-xs mt-2 text-center font-semibold ${
                  status === 'current' ? colors.text : status === 'completed' ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {step.label}
                </span>
                {step.description && (
                  <span className="text-xs text-gray-400 text-center mt-0.5">
                    {step.description}
                  </span>
                )}
                {step.date && (
                  <span className="text-xs text-gray-500 mt-1 bg-white px-2 py-0.5 rounded">
                    {step.date}
                  </span>
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-12 h-1 mx-2 rounded ${
                  index < currentStep ? 'bg-green-500' : 
                  index === currentStep ? `bg-gradient-to-r ${colors.gradient}` : 'bg-gray-300'
                }`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ===== CALLOUT BOX =====
interface CalloutBoxProps {
  type: 'info' | 'warning' | 'success' | 'error' | 'quote';
  title?: string;
  content: string;
  source?: string;
  templateType: string;
}

export function CalloutBox({ type, title, content, source, templateType }: CalloutBoxProps) {
  const colors = getAreaColors(templateType);

  const getTypeStyles = () => {
    switch(type) {
      case 'info':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-500',
          icon: <Info className="h-6 w-6 text-blue-500" />,
          titleColor: 'text-blue-800'
        };
      case 'warning':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-500',
          icon: <AlertTriangle className="h-6 w-6 text-amber-500" />,
          titleColor: 'text-amber-800'
        };
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-500',
          icon: <CheckCircle2 className="h-6 w-6 text-green-500" />,
          titleColor: 'text-green-800'
        };
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-500',
          icon: <X className="h-6 w-6 text-red-500" />,
          titleColor: 'text-red-800'
        };
      case 'quote':
        return {
          bg: colors.bg,
          border: colors.border,
          icon: <Quote className={`h-6 w-6 ${colors.text}`} />,
          titleColor: colors.text
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-500',
          icon: <Info className="h-6 w-6 text-gray-500" />,
          titleColor: 'text-gray-800'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className={`${styles.bg} border-l-4 ${styles.border} rounded-r-lg p-5 shadow-sm`}>
      <div className="flex gap-4">
        <div className="flex-shrink-0">{styles.icon}</div>
        <div className="flex-1">
          {title && (
            <h4 className={`font-bold ${styles.titleColor} mb-2`}>{title}</h4>
          )}
          <p className={`text-gray-700 ${type === 'quote' ? 'italic' : ''} leading-relaxed`}>
            {content}
          </p>
          {source && (
            <p className={`text-sm ${colors.text} mt-2 font-medium`}>— {source}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ===== CHECKLIST VISUAL =====
interface ChecklistItem {
  label: string;
  checked: boolean;
  description?: string;
  required?: boolean;
}

interface VisualChecklistProps {
  title: string;
  items: ChecklistItem[];
  templateType: string;
}

export function VisualChecklist({ title, items, templateType }: VisualChecklistProps) {
  const colors = getAreaColors(templateType);
  const completedCount = items.filter(i => i.checked).length;
  const progress = (completedCount / items.length) * 100;

  return (
    <div className={`rounded-lg border-2 ${colors.border} overflow-hidden shadow-sm`}>
      <div className={`px-4 py-3 bg-gradient-to-r ${colors.gradient}`}>
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            {title}
          </h4>
          <span className="text-white text-sm font-medium">
            {completedCount}/{items.length}
          </span>
        </div>
        <div className="mt-2 bg-white/30 rounded-full h-2">
          <div 
            className="bg-white rounded-full h-2 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <div className="p-4 space-y-3 bg-white">
        {items.map((item, index) => (
          <div 
            key={index} 
            className={`flex items-start gap-3 p-3 rounded-lg ${
              item.checked ? 'bg-green-50' : 'bg-gray-50'
            }`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
              item.checked ? 'bg-green-500' : 'bg-gray-300'
            }`}>
              {item.checked ? (
                <Check className="h-4 w-4 text-white" />
              ) : (
                <span className="text-xs text-gray-600">{index + 1}</span>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className={`font-medium ${item.checked ? 'text-green-700 line-through' : 'text-gray-900'}`}>
                  {item.label}
                </span>
                {item.required && !item.checked && (
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">
                    Obrigatório
                  </span>
                )}
              </div>
              {item.description && (
                <p className="text-sm text-gray-500 mt-1">{item.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== DIAGRAMA DE PARTES =====
interface PartyInfo {
  name: string;
  role: string;
  type: 'autor' | 'reu' | 'terceiro' | 'testemunha';
  details?: string[];
}

interface PartiesDiagramProps {
  parties: PartyInfo[];
  templateType: string;
}

export function PartiesDiagram({ parties, templateType }: PartiesDiagramProps) {
  const colors = getAreaColors(templateType);

  const getPartyStyle = (type: string) => {
    switch(type) {
      case 'autor':
        return {
          bg: 'bg-green-50',
          border: 'border-green-500',
          icon: 'bg-green-500',
          label: 'Polo Ativo',
          labelColor: 'text-green-600'
        };
      case 'reu':
        return {
          bg: 'bg-red-50',
          border: 'border-red-500',
          icon: 'bg-red-500',
          label: 'Polo Passivo',
          labelColor: 'text-red-600'
        };
      case 'terceiro':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-500',
          icon: 'bg-amber-500',
          label: 'Terceiro',
          labelColor: 'text-amber-600'
        };
      case 'testemunha':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-500',
          icon: 'bg-blue-500',
          label: 'Testemunha',
          labelColor: 'text-blue-600'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-500',
          icon: 'bg-gray-500',
          label: 'Parte',
          labelColor: 'text-gray-600'
        };
    }
  };

  const autores = parties.filter(p => p.type === 'autor');
  const reus = parties.filter(p => p.type === 'reu');
  const outros = parties.filter(p => !['autor', 'reu'].includes(p.type));

  return (
    <div className={`rounded-lg ${colors.bg} p-6 shadow-sm border ${colors.border}`}>
      <div className="flex items-center gap-2 mb-6">
        <Users className={`h-5 w-5 ${colors.text}`} />
        <h4 className={`text-sm font-bold ${colors.text} uppercase tracking-wide`}>
          Partes do Processo
        </h4>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Autores */}
        <div>
          {autores.map((party, index) => {
            const style = getPartyStyle(party.type);
            return (
              <div key={index} className={`${style.bg} border ${style.border} rounded-lg p-4 shadow-sm`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-full ${style.icon} flex items-center justify-center`}>
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <span className={`text-xs font-semibold ${style.labelColor} uppercase tracking-wide`}>
                      {style.label}
                    </span>
                    <h4 className="font-bold text-gray-900">{party.role}</h4>
                  </div>
                </div>
                <p className="text-gray-700 font-medium">{party.name}</p>
                {party.details && party.details.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {party.details.map((detail, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>

        {/* Réus */}
        <div>
          {reus.map((party, index) => {
            const style = getPartyStyle(party.type);
            return (
              <div key={index} className={`${style.bg} border ${style.border} rounded-lg p-4 shadow-sm`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-full ${style.icon} flex items-center justify-center`}>
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <span className={`text-xs font-semibold ${style.labelColor} uppercase tracking-wide`}>
                      {style.label}
                    </span>
                    <h4 className="font-bold text-gray-900">{party.role}</h4>
                  </div>
                </div>
                <p className="text-gray-700 font-medium">{party.name}</p>
                {party.details && party.details.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {party.details.map((detail, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Outros */}
      {outros.length > 0 && (
        <div className="mt-4 grid md:grid-cols-3 gap-4">
          {outros.map((party, index) => {
            const style = getPartyStyle(party.type);
            return (
              <div key={index} className={`${style.bg} border ${style.border} rounded-lg p-3 shadow-sm`}>
                <span className={`text-xs font-semibold ${style.labelColor} uppercase`}>
                  {style.label}
                </span>
                <p className="text-gray-900 font-medium mt-1">{party.name}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ===== GALERIA DE EVIDÊNCIAS =====
interface Evidence {
  type: 'document' | 'photo' | 'video' | 'audio' | 'screenshot';
  title: string;
  description?: string;
  date?: string;
  relevance: 'high' | 'medium' | 'low';
}

interface EvidenceGalleryProps {
  evidences: Evidence[];
  templateType: string;
}

export function EvidenceGallery({ evidences, templateType }: EvidenceGalleryProps) {
  const colors = getAreaColors(templateType);

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'document': return <FileText className="h-8 w-8" />;
      case 'photo': return <Eye className="h-8 w-8" />;
      case 'video': return <Eye className="h-8 w-8" />;
      case 'audio': return <Eye className="h-8 w-8" />;
      case 'screenshot': return <Eye className="h-8 w-8" />;
      default: return <FileText className="h-8 w-8" />;
    }
  };

  const getRelevanceBadge = (relevance: string) => {
    switch(relevance) {
      case 'high':
        return <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded font-medium">Alta Relevância</span>;
      case 'medium':
        return <span className="text-xs bg-amber-100 text-amber-600 px-2 py-0.5 rounded font-medium">Média Relevância</span>;
      case 'low':
        return <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-medium">Baixa Relevância</span>;
      default:
        return null;
    }
  };

  return (
    <div className={`rounded-lg border-2 ${colors.border} overflow-hidden shadow-sm`}>
      <div className={`px-4 py-3 bg-gradient-to-r ${colors.gradient}`}>
        <h4 className="font-bold text-white flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Documentos e Evidências ({evidences.length})
        </h4>
      </div>
      <div className="p-4 grid md:grid-cols-2 lg:grid-cols-3 gap-4 bg-white">
        {evidences.map((evidence, index) => (
          <div 
            key={index} 
            className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
              evidence.relevance === 'high' ? 'border-red-300 bg-red-50/50' : 'border-gray-200'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${colors.bg} ${colors.text}`}>
                {getTypeIcon(evidence.type)}
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="font-semibold text-gray-900 truncate">{evidence.title}</h5>
                {evidence.description && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{evidence.description}</p>
                )}
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  {getRelevanceBadge(evidence.relevance)}
                  {evidence.date && (
                    <span className="text-xs text-gray-500">{evidence.date}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// All components are already exported individually above
