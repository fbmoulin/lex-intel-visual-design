/**
 * Tipos compartilhados para exportação de petições
 */

import type { ExportConfig } from "@/components/ExportModal";

/**
 * Dados da petição para exportação (PDF/DOCX)
 */
export interface PetitionExportData {
  processNumber: string;
  court: string;
  plaintiff: string;
  defendant: string;
  facts: string;
  legalBasis: string;
  requests: string;
  templateId: string;
  /** Valor da causa (opcional, usado principalmente em DOCX) */
  caseValue?: string;
}

/**
 * Configuração completa de exportação
 */
export type ExportOptions = ExportConfig;

/**
 * Formatos de exportação suportados
 */
export type ExportFormat = "pdf" | "docx";
