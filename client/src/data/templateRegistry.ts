/**
 * Template Registry System for managing petition templates
 * Provides factory functions, validation, and template inheritance support
 */

import type {
  PetitionTemplate,
  PetitionTemplateMetadata,
  PetitionTemplateVisualConfig,
  LegalReference,
  SectionConfig
} from './petitionTemplates';
import { TEMPLATE_TYPE_ICONS, TEMPLATE_TYPE_COLORS, TEMPLATE_CATEGORIES } from '@shared/const';

// Default section configurations
export const DEFAULT_SECTIONS: SectionConfig[] = [
  { id: 'header', title: 'Cabecalho', icon: 'FileText' },
  { id: 'parties', title: 'Partes', icon: 'Users' },
  { id: 'facts', title: 'Dos Fatos', icon: 'BookOpen', collapsible: true },
  { id: 'legal', title: 'Do Direito', icon: 'Scale', collapsible: true },
  { id: 'requests', title: 'Dos Pedidos', icon: 'ListChecks', collapsible: true },
  { id: 'closing', title: 'Encerramento', icon: 'PenLine' },
];

/**
 * Validation result for template structure
 */
export interface TemplateValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Required fields for creating a template
 */
export type CreateTemplateInput = Partial<PetitionTemplate> &
  Pick<PetitionTemplate, 'id' | 'templateType' | 'title' | 'description' | 'content'>;

/**
 * Factory function to create templates with defaults
 * Fills in missing metadata and visual configuration based on template type
 */
export function createTemplate(partial: CreateTemplateInput): PetitionTemplate {
  const templateType = partial.templateType;

  return {
    ...partial,
    metadata: {
      category: TEMPLATE_CATEGORIES[templateType]?.[0],
      legalBasis: [],
      requiredDocuments: [],
      courtCompetency: [],
      ...partial.metadata,
    },
    visualConfig: {
      icon: TEMPLATE_TYPE_ICONS[templateType],
      colorScheme: TEMPLATE_TYPE_COLORS[templateType],
      sections: DEFAULT_SECTIONS,
      showTimeline: false,
      showValueChart: true,
      highlightFields: [],
      ...partial.visualConfig,
    },
  };
}

/**
 * Validate template structure
 * Checks for required fields and content structure
 */
export function validateTemplate(template: PetitionTemplate): TemplateValidationResult {
  const errors: string[] = [];

  if (!template.id) errors.push('Template must have an id');
  if (!template.templateType) errors.push('Template must have a templateType');
  if (!template.title) errors.push('Template must have a title');
  if (!template.content) errors.push('Template must have content');

  // Validate content fields
  const requiredContentFields = ['numeroProcesso', 'tribunal', 'fatos', 'fundamentosJuridicos', 'pedidos'];
  for (const field of requiredContentFields) {
    if (!(field in template.content)) {
      errors.push(`Template content must have ${field}`);
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Get templates filtered by category
 */
export function getTemplatesByCategory(
  templates: PetitionTemplate[],
  templateType: string,
  category: string
): PetitionTemplate[] {
  return templates.filter(t =>
    t.templateType === templateType &&
    t.metadata?.category === category
  );
}

/**
 * Get templates filtered by template type only
 */
export function getTemplatesByType(
  templates: PetitionTemplate[],
  templateType: string
): PetitionTemplate[] {
  return templates.filter(t => t.templateType === templateType);
}

/**
 * Merge section configurations for template inheritance
 */
export function mergeSections(
  baseSections: SectionConfig[],
  overrideSections: Partial<SectionConfig>[]
): SectionConfig[] {
  const merged = [...baseSections];

  for (const override of overrideSections) {
    const index = merged.findIndex(s => s.id === override.id);
    if (index >= 0) {
      merged[index] = { ...merged[index], ...override };
    } else if (override.id && override.title) {
      merged.push(override as SectionConfig);
    }
  }

  return merged;
}

/**
 * Create a child template that inherits from a parent template
 */
export function createChildTemplate(
  parent: PetitionTemplate,
  overrides: Partial<PetitionTemplate> & Pick<PetitionTemplate, 'id' | 'title'>
): PetitionTemplate {
  return {
    ...parent,
    ...overrides,
    content: {
      ...parent.content,
      ...overrides.content,
    },
    metadata: {
      ...parent.metadata,
      ...overrides.metadata,
    },
    visualConfig: {
      ...parent.visualConfig,
      ...overrides.visualConfig,
      sections: overrides.visualConfig?.sections
        ? mergeSections(parent.visualConfig?.sections || DEFAULT_SECTIONS, overrides.visualConfig.sections)
        : parent.visualConfig?.sections,
    },
  };
}

// Common legal references by area
export const COMMON_LEGAL_REFERENCES: Record<string, LegalReference[]> = {
  trabalhista: [
    { law: 'CLT', article: 'Art. 477', description: 'Verbas rescisorias' },
    { law: 'CLT', article: 'Art. 487', description: 'Aviso previo' },
    { law: 'CF/88', article: 'Art. 7', description: 'Direitos dos trabalhadores' },
  ],
  consumidor: [
    { law: 'CDC', article: 'Art. 6', description: 'Direitos basicos do consumidor' },
    { law: 'CDC', article: 'Art. 14', description: 'Responsabilidade do fornecedor' },
    { law: 'CDC', article: 'Art. 18', description: 'Vicios do produto' },
  ],
  civil: [
    { law: 'CC', article: 'Art. 186', description: 'Ato ilicito' },
    { law: 'CC', article: 'Art. 927', description: 'Obrigacao de reparar o dano' },
    { law: 'CPC', article: 'Art. 319', description: 'Requisitos da peticao inicial' },
  ],
  criminal: [
    { law: 'CP', article: 'Art. 121', description: 'Homicidio' },
    { law: 'CPP', article: 'Art. 648', description: 'Habeas corpus' },
    { law: 'CF/88', article: 'Art. 5', description: 'Direitos e garantias fundamentais' },
  ],
  tributario: [
    { law: 'CTN', article: 'Art. 165', description: 'Restituicao de tributos' },
    { law: 'CF/88', article: 'Art. 150', description: 'Limitacoes ao poder de tributar' },
    { law: 'CTN', article: 'Art. 156', description: 'Extincao do credito tributario' },
  ],
  familia: [
    { law: 'CC', article: 'Art. 1.694', description: 'Alimentos' },
    { law: 'CC', article: 'Art. 1.583', description: 'Guarda dos filhos' },
    { law: 'CC', article: 'Art. 1.571', description: 'Dissolucao da sociedade conjugal' },
  ],
  empresarial: [
    { law: 'Lei 11.101/05', article: 'Art. 47', description: 'Recuperacao judicial' },
    { law: 'CC', article: 'Art. 966', description: 'Conceito de empresario' },
    { law: 'CC', article: 'Art. 1.052', description: 'Sociedade limitada' },
  ],
  administrativo: [
    { law: 'CF/88', article: 'Art. 5, LXIX', description: 'Mandado de seguranca' },
    { law: 'Lei 8.429/92', article: 'Art. 9', description: 'Atos de improbidade' },
    { law: 'Lei 4.717/65', article: 'Art. 1', description: 'Acao popular' },
  ],
  previdenciario: [
    { law: 'Lei 8.213/91', article: 'Art. 42', description: 'Aposentadoria por invalidez' },
    { law: 'Lei 8.213/91', article: 'Art. 59', description: 'Auxilio-doenca' },
    { law: 'CF/88', article: 'Art. 201', description: 'Previdencia social' },
  ],
  ambiental: [
    { law: 'Lei 7.347/85', article: 'Art. 1', description: 'Acao civil publica' },
    { law: 'CF/88', article: 'Art. 225', description: 'Meio ambiente' },
    { law: 'Lei 9.605/98', article: 'Art. 2', description: 'Crimes ambientais' },
  ],
};

// Common required documents by area
export const COMMON_REQUIRED_DOCUMENTS: Record<string, string[]> = {
  trabalhista: [
    'CTPS (Carteira de Trabalho)',
    'Contrato de trabalho',
    'Comprovantes de pagamento',
    'Termo de rescisao (TRCT)',
  ],
  consumidor: [
    'Nota fiscal ou comprovante de compra',
    'Contrato (se houver)',
    'Comprovantes de reclamacao previa',
    'Documentos pessoais',
  ],
  civil: [
    'Documentos pessoais (RG, CPF)',
    'Comprovante de residencia',
    'Contratos e documentos comprobatorios',
    'Provas do dano alegado',
  ],
  criminal: [
    'Boletim de ocorrencia',
    'Documentos pessoais',
    'Provas documentais',
    'Rol de testemunhas',
  ],
  tributario: [
    'Comprovantes de pagamento do tributo',
    'Notificacoes fiscais',
    'Documentos contabeis',
    'Certidoes negativas',
  ],
  familia: [
    'Certidao de casamento',
    'Certidao de nascimento dos filhos',
    'Comprovantes de renda',
    'Declaracao de bens',
  ],
  empresarial: [
    'Contrato social',
    'Balanco patrimonial',
    'Demonstracoes financeiras',
    'Lista de credores',
  ],
  administrativo: [
    'Documentos pessoais',
    'Prova do direito liquido e certo',
    'Notificacao ou decisao administrativa',
    'Comprovantes de protocolo',
  ],
  previdenciario: [
    'Carteira de trabalho (CTPS)',
    'Carnes de contribuicao',
    'Laudos medicos',
    'Extratos do CNIS',
  ],
  ambiental: [
    'Estudos de impacto ambiental',
    'Licencas ambientais',
    'Laudos tecnicos',
    'Documentos de propriedade',
  ],
};

/**
 * Get legal references for a template type
 */
export function getLegalReferences(templateType: string): LegalReference[] {
  return COMMON_LEGAL_REFERENCES[templateType] || [];
}

/**
 * Get required documents for a template type
 */
export function getRequiredDocuments(templateType: string): string[] {
  return COMMON_REQUIRED_DOCUMENTS[templateType] || [];
}

/**
 * Create a template with pre-filled legal references and documents
 */
export function createTemplateWithDefaults(
  partial: CreateTemplateInput
): PetitionTemplate {
  const template = createTemplate(partial);

  // Enrich with common legal references and documents if not provided
  if (!template.metadata?.legalBasis?.length) {
    template.metadata = {
      ...template.metadata,
      legalBasis: getLegalReferences(partial.templateType),
    };
  }

  if (!template.metadata?.requiredDocuments?.length) {
    template.metadata = {
      ...template.metadata,
      requiredDocuments: getRequiredDocuments(partial.templateType),
    };
  }

  return template;
}
