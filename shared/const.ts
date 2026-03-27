export const COOKIE_NAME = "app_session_id";
export const ONE_YEAR_MS = 1000 * 60 * 60 * 24 * 365;
export const AXIOS_TIMEOUT_MS = 30_000;
export const UNAUTHED_ERR_MSG = 'Please login (10001)';
export const NOT_ADMIN_ERR_MSG = 'You do not have required permission (10002)';

/**
 * Tipos de templates de petição suportados
 * Utilizado tanto no cliente quanto no servidor para validação
 */
export const PETITION_TEMPLATE_TYPES = [
  "civil",
  "trabalhista",
  "criminal",
  "tributario",
  "consumidor",
  "familia",
  "empresarial",
  "administrativo",
  "previdenciario",
  "ambiental",
] as const;

export type PetitionTemplateType = typeof PETITION_TEMPLATE_TYPES[number];

/**
 * Verifica se um valor é um tipo de template válido
 */
export function isValidTemplateType(value: string): value is PetitionTemplateType {
  return PETITION_TEMPLATE_TYPES.includes(value as PetitionTemplateType);
}

/**
 * Tipos de competência judicial
 */
export const COURT_TYPES = [
  'justica_estadual',
  'justica_federal',
  'justica_trabalho',
  'juizado_especial_civel',
  'juizado_especial_federal',
  'juizado_especial_fazenda',
  'tribunal_juri',
] as const;
export type CourtType = typeof COURT_TYPES[number];

/**
 * Tipos de procedimento
 */
export const PROCEDURAL_TYPES = [
  'ordinario',
  'sumario',
  'sumarissimo',
  'especial',
  'execucao',
  'cautelar',
  'monitoria',
] as const;
export type ProceduralType = typeof PROCEDURAL_TYPES[number];

/**
 * Categorias de templates (sub-tipos por área jurídica)
 */
export const TEMPLATE_CATEGORIES = {
  trabalhista: ['rescisao', 'horas-extras', 'assedio', 'acidente', 'vinculo', 'equiparacao'],
  consumidor: ['vicio-produto', 'cobranca-indevida', 'praticas-abusivas', 'publicidade-enganosa'],
  tributario: ['restituicao', 'anulatoria', 'execucao-fiscal', 'mandado-seguranca'],
  civil: ['indenizacao', 'cobranca', 'obrigacao-fazer', 'despejo'],
  criminal: ['queixa-crime', 'habeas-corpus', 'defesa', 'revisao'],
  familia: ['divorcio', 'alimentos', 'guarda', 'inventario'],
  empresarial: ['recuperacao', 'falencia', 'societario', 'contratos'],
  administrativo: ['mandado-seguranca', 'acao-popular', 'improbidade'],
  previdenciario: ['aposentadoria', 'auxilio-doenca', 'pensao', 'revisao'],
  ambiental: ['acao-civil-publica', 'termo-ajustamento', 'licenciamento'],
} as const;

/**
 * Limites de valor para tribunais brasileiros
 */
export const VALUE_THRESHOLDS = {
  JEC_ESTADUAL: 40 * 1412, // 40 salários mínimos (2024)
  JEC_FEDERAL: 60 * 1412,  // 60 salários mínimos
  ALCADA_RECURSAL: 1000,   // Para recursos
} as const;

/**
 * Mapeamento de ícones para tipos de template
 */
export const TEMPLATE_TYPE_ICONS = {
  civil: 'FileText',
  trabalhista: 'Briefcase',
  criminal: 'Gavel',
  tributario: 'Building2',
  consumidor: 'ShoppingCart',
  familia: 'Users',
  empresarial: 'Building',
  administrativo: 'Landmark',
  previdenciario: 'ShieldCheck',
  ambiental: 'Leaf',
} as const;

/**
 * Esquemas de cores para tipos de template
 */
export const TEMPLATE_TYPE_COLORS = {
  civil: 'blue',
  trabalhista: 'amber',
  criminal: 'red',
  tributario: 'green',
  consumidor: 'purple',
  familia: 'pink',
  empresarial: 'slate',
  administrativo: 'cyan',
  previdenciario: 'orange',
  ambiental: 'emerald',
} as const;

/**
 * Limites de tamanho para campos de texto em petições
 */
export const PETITION_TEXT_LIMITS = {
  title: { min: 1, max: 255 },
  numeroProcesso: { max: 50 },
  tribunal: { max: 100 },
  autor: { max: 255 },
  reu: { max: 255 },
  fatos: { max: 50000 },           // ~10 páginas
  fundamentosJuridicos: { max: 50000 },
  pedidos: { max: 10000 },
  valorCausa: { max: 50 },
} as const;
