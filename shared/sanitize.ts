/**
 * Input Sanitization Utilities
 * Lex Intel Visual Design - Desenvolvido por Lex Intelligentia
 *
 * Previne XSS attacks através de sanitização de conteúdo HTML.
 * Utiliza DOMPurify para sanitização segura em ambientes browser e server.
 */

import DOMPurify from "isomorphic-dompurify";

// Tipo para configuração do DOMPurify
interface SanitizeConfig {
  ALLOWED_TAGS?: string[];
  ALLOWED_ATTR?: string[];
  ALLOW_DATA_ATTR?: boolean;
  ADD_ATTR?: string[];
  FORBID_TAGS?: string[];
  FORBID_ATTR?: string[];
  KEEP_CONTENT?: boolean;
}

/**
 * Configuração padrão para sanitização de texto puro
 * Remove TODAS as tags HTML, mantendo apenas texto
 */
const PLAIN_TEXT_CONFIG: SanitizeConfig = {
  ALLOWED_TAGS: [],
  ALLOWED_ATTR: [],
  KEEP_CONTENT: true,
};

/**
 * Configuração para markdown/rich text (ex: AI chat)
 * Permite tags seguras de formatação
 */
const MARKDOWN_CONFIG: SanitizeConfig = {
  ALLOWED_TAGS: [
    "p", "br", "b", "i", "em", "strong", "u", "s", "strike",
    "h1", "h2", "h3", "h4", "h5", "h6",
    "ul", "ol", "li",
    "code", "pre", "blockquote",
    "a", "span",
    "table", "thead", "tbody", "tr", "th", "td",
  ],
  ALLOWED_ATTR: ["href", "title", "target", "rel", "class"],
  ALLOW_DATA_ATTR: false,
  ADD_ATTR: ["target"], // Para links abrirem em nova aba
  FORBID_TAGS: ["script", "style", "iframe", "form", "input", "object", "embed"],
  FORBID_ATTR: ["onerror", "onclick", "onload", "onmouseover", "onfocus", "onblur"],
};

/**
 * Sanitiza texto removendo todas as tags HTML
 * Ideal para campos de texto livre (fatos, fundamentos, pedidos)
 *
 * @param input - Texto a ser sanitizado
 * @returns Texto sem tags HTML
 */
export function sanitizeText(input: string | undefined | null): string {
  if (!input) return "";
  const result = DOMPurify.sanitize(input, PLAIN_TEXT_CONFIG);
  return String(result).trim();
}

/**
 * Sanitiza conteúdo markdown/HTML permitindo tags seguras
 * Ideal para conteúdo de AI chat ou rich text
 *
 * @param input - HTML/Markdown a ser sanitizado
 * @returns HTML sanitizado
 */
export function sanitizeMarkdown(input: string | undefined | null): string {
  if (!input) return "";

  // Adiciona rel="noopener noreferrer" a todos os links
  const sanitized = DOMPurify.sanitize(input, MARKDOWN_CONFIG);

  // Post-process: adiciona segurança aos links
  return String(sanitized).replace(
    /<a\s+href=/g,
    '<a rel="noopener noreferrer" target="_blank" href='
  );
}

/**
 * Verifica se uma string contém possível XSS payload
 * Útil para logging e monitoramento de tentativas de ataque
 *
 * @param input - Texto a verificar
 * @returns true se conteúdo suspeito for detectado
 */
export function containsSuspiciousContent(input: string | undefined | null): boolean {
  if (!input) return false;

  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i, // onclick, onerror, etc.
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /data:/i,
    /vbscript:/i,
    /<svg[^>]*onload/i,
    /<img[^>]*onerror/i,
  ];

  return suspiciousPatterns.some((pattern) => pattern.test(input));
}

/**
 * Sanitiza um objeto de dados de petição
 * Aplica sanitização a todos os campos de texto
 *
 * @param data - Dados da petição
 * @returns Dados sanitizados
 */
export function sanitizePetitionData<T extends Record<string, unknown>>(data: T): T {
  const textFields = [
    "autor", "reu", "tribunal", "vara", "comarca",
    "fatos", "fundamentosJuridicos", "pedidos",
    "localData", "advogadoNome", "advogadoOAB",
  ];

  const sanitized: Record<string, unknown> = { ...data };

  for (const field of textFields) {
    if (typeof sanitized[field] === "string") {
      sanitized[field] = sanitizeText(sanitized[field] as string);
    }
  }

  return sanitized as T;
}

/**
 * Escapa caracteres especiais HTML (alternativa leve ao DOMPurify)
 * Útil quando apenas escape é necessário, sem remoção de tags
 *
 * @param input - Texto a escapar
 * @returns Texto com caracteres HTML escapados
 */
export function escapeHtml(input: string | undefined | null): string {
  if (!input) return "";

  const htmlEntities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
    "/": "&#x2F;",
    "`": "&#x60;",
    "=": "&#x3D;",
  };

  return input.replace(/[&<>"'`=/]/g, (char) => htmlEntities[char]);
}

export default {
  sanitizeText,
  sanitizeMarkdown,
  containsSuspiciousContent,
  sanitizePetitionData,
  escapeHtml,
};
