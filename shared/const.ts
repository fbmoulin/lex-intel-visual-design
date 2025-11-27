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
