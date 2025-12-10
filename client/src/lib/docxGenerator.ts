import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  convertInchesToTwip,
  PageNumber,
  Footer,
  Header,
  ImageRun,
} from 'docx';
import { saveAs } from 'file-saver';
import type { ExportConfig } from '@/components/ExportModal';
import type { PetitionExportData } from './exportTypes';

/** @deprecated Use PetitionExportData instead */
export type PetitionDataDOCX = PetitionExportData;

/**
 * Gera um documento DOCX formatado profissionalmente
 * @param data - Dados da petição
 * @param config - Configurações de exportação
 */
export async function generatePetitionDOCX(
  data: PetitionDataDOCX,
  config: ExportConfig
): Promise<void> {
  try {
    const sections = [];

    // Criar cabeçalho se habilitado
    const headers = config.header.enabled
      ? {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                border: {
                  bottom: {
                    color: 'E5E7EB',
                    space: 1,
                    style: BorderStyle.SINGLE,
                    size: 6,
                  },
                },
                children: [
                  new TextRun({
                    text: config.header.text || '',
                    size: 20,
                    bold: true,
                  }),
                ],
                spacing: {
                  after: 200,
                },
              }),
            ],
          }),
        }
      : undefined;

    // Criar rodapé se habilitado
    const footers = config.footer.enabled
      ? {
          default: new Footer({
            children: [
              ...(config.footer.text
                ? [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      border: {
                        top: {
                          color: 'E5E7EB',
                          space: 1,
                          style: BorderStyle.SINGLE,
                          size: 6,
                        },
                      },
                      children: [
                        new TextRun({
                          text: config.footer.text,
                          size: 18,
                          color: '6B7280',
                        }),
                      ],
                      spacing: {
                        before: 200,
                      },
                    }),
                  ]
                : []),
              ...(config.footer.pageNumbers
                ? [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({
                          text: 'Página ',
                          size: 18,
                          color: '6B7280',
                        }),
                        new TextRun({
                          children: [PageNumber.CURRENT],
                          size: 18,
                          color: '6B7280',
                        }),
                      ],
                    }),
                  ]
                : []),
            ],
          }),
        }
      : undefined;

    // Criar conteúdo do documento
    const children: Paragraph[] = [];

    // Título da petição
    children.push(
      new Paragraph({
        text: getTitleByTemplateId(data.templateId),
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: {
          after: 400,
        },
      })
    );

    // Informações do processo
    if (data.processNumber || data.court) {
      children.push(
        new Paragraph({
          text: 'INFORMAÇÕES DO PROCESSO',
          heading: HeadingLevel.HEADING_2,
          spacing: {
            before: 200,
            after: 200,
          },
        })
      );

      if (data.processNumber) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: 'Processo nº: ',
                bold: true,
              }),
              new TextRun({
                text: data.processNumber,
              }),
            ],
            spacing: {
              after: 100,
            },
          })
        );
      }

      if (data.court) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: 'Tribunal: ',
                bold: true,
              }),
              new TextRun({
                text: data.court,
              }),
            ],
            spacing: {
              after: 100,
            },
          })
        );
      }

      if (data.plaintiff) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: 'Autor: ',
                bold: true,
              }),
              new TextRun({
                text: data.plaintiff,
              }),
            ],
            spacing: {
              after: 100,
            },
          })
        );
      }

      if (data.defendant) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: 'Réu: ',
                bold: true,
              }),
              new TextRun({
                text: data.defendant,
              }),
            ],
            spacing: {
              after: 100,
            },
          })
        );
      }

      if (data.caseValue) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: 'Valor da Causa: ',
                bold: true,
              }),
              new TextRun({
                text: data.caseValue,
              }),
            ],
            spacing: {
              after: 200,
            },
          })
        );
      }
    }

    // Dos Fatos
    if (data.facts) {
      children.push(
        new Paragraph({
          text: 'DOS FATOS',
          heading: HeadingLevel.HEADING_2,
          spacing: {
            before: 300,
            after: 200,
          },
        })
      );

      // Dividir texto em parágrafos
      const factsParagraphs = data.facts.split('\n').filter((p) => p.trim());
      factsParagraphs.forEach((para) => {
        children.push(
          new Paragraph({
            text: para,
            alignment: AlignmentType.JUSTIFIED,
            spacing: {
              after: 150,
            },
          })
        );
      });
    }

    // Dos Fundamentos Jurídicos
    if (data.legalBasis) {
      children.push(
        new Paragraph({
          text: 'DOS FUNDAMENTOS JURÍDICOS',
          heading: HeadingLevel.HEADING_2,
          spacing: {
            before: 300,
            after: 200,
          },
        })
      );

      const legalParagraphs = data.legalBasis.split('\n').filter((p) => p.trim());
      legalParagraphs.forEach((para) => {
        children.push(
          new Paragraph({
            text: para,
            alignment: AlignmentType.JUSTIFIED,
            spacing: {
              after: 150,
            },
          })
        );
      });
    }

    // Dos Pedidos
    if (data.requests) {
      children.push(
        new Paragraph({
          text: 'DOS PEDIDOS',
          heading: HeadingLevel.HEADING_2,
          spacing: {
            before: 300,
            after: 200,
          },
        })
      );

      const requestsParagraphs = data.requests.split('\n').filter((p) => p.trim());
      requestsParagraphs.forEach((para) => {
        children.push(
          new Paragraph({
            text: para,
            alignment: AlignmentType.JUSTIFIED,
            spacing: {
              after: 150,
            },
          })
        );
      });
    }

    // Encerramento
    children.push(
      new Paragraph({
        text: 'Nestes termos, pede deferimento.',
        alignment: AlignmentType.RIGHT,
        spacing: {
          before: 400,
          after: 200,
        },
      })
    );

    children.push(
      new Paragraph({
        text: `${data.court || 'Local'}, ${new Date().toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        })}.`,
        alignment: AlignmentType.RIGHT,
        spacing: {
          after: 400,
        },
      })
    );

    children.push(
      new Paragraph({
        text: '_______________________________',
        alignment: AlignmentType.CENTER,
        spacing: {
          before: 400,
        },
      })
    );

    children.push(
      new Paragraph({
        text: 'Advogado(a)',
        alignment: AlignmentType.CENTER,
      })
    );

    children.push(
      new Paragraph({
        text: 'OAB/UF nº',
        alignment: AlignmentType.CENTER,
      })
    );

    // Criar documento
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: convertInchesToTwip(1),
                right: convertInchesToTwip(1),
                bottom: convertInchesToTwip(1),
                left: convertInchesToTwip(1),
              },
            },
          },
          headers,
          footers,
          children,
        },
      ],
    });

    // Gerar e salvar arquivo
    const blob = await Packer.toBlob(doc);
    const filename = `peticao_${data.templateId}_${data.processNumber.replace(/\//g, '-')}.docx`;
    saveAs(blob, filename);
  } catch {
    throw new Error('Falha ao gerar documento DOCX. Por favor, tente novamente.');
  }
}

/**
 * Retorna o título da petição baseado no template
 */
function getTitleByTemplateId(templateId: string): string {
  const titles: Record<string, string> = {
    civil: 'PETIÇÃO INICIAL - AÇÃO CIVIL',
    trabalhista: 'RECLAMAÇÃO TRABALHISTA',
    criminal: 'PETIÇÃO INICIAL - AÇÃO PENAL PRIVADA',
    tributaria: 'PETIÇÃO INICIAL - AÇÃO TRIBUTÁRIA',
    consumidor: 'PETIÇÃO INICIAL - DIREITO DO CONSUMIDOR',
  };
  return titles[templateId] || 'PETIÇÃO INICIAL';
}
