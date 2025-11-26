import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import type { ExportConfig } from '@/components/ExportModal';

export interface PetitionData {
  processNumber: string;
  court: string;
  plaintiff: string;
  defendant: string;
  facts: string;
  legalBasis: string;
  requests: string;
  templateId: string;
}

/**
 * Gera um PDF a partir de um elemento HTML preservando estilos visuais
 * @param element - Elemento HTML a ser convertido
 * @param filename - Nome do arquivo PDF
 */
export async function generatePDFFromElement(
  element: HTMLElement,
  filename: string = 'peticao.pdf'
): Promise<void> {
  try {
    // Configurações do html2canvas para melhor qualidade
    const canvas = await html2canvas(element, {
      scale: 2, // Aumenta a resolução
      useCORS: true, // Permite carregar imagens de outras origens
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    });

    const imgData = canvas.toDataURL('image/png');
    
    // Dimensões A4 em mm
    const pdfWidth = 210;
    const pdfHeight = 297;
    
    // Calcula a altura proporcional da imagem
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;
    
    // Cria o PDF
    const pdf = new jsPDF({
      orientation: imgHeight > pdfWidth ? 'portrait' : 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    let heightLeft = imgHeight;
    let position = 0;

    // Adiciona a primeira página
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    // Adiciona páginas adicionais se necessário
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    // Salva o PDF
    pdf.save(filename);
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    throw new Error('Falha ao gerar PDF. Por favor, tente novamente.');
  }
}

/**
 * Gera um PDF otimizado para petições com múltiplas páginas
 * @param element - Elemento HTML a ser convertido
 * @param data - Dados da petição
 * @param config - Configurações de exportação (opcional)
 */
export async function generatePetitionPDF(
  element: HTMLElement,
  data: PetitionData,
  config?: ExportConfig
): Promise<void> {
  const filename = `peticao_${data.templateId}_${data.processNumber.replace(/\//g, '-')}.pdf`;
  
  // Se houver configurações de cabeçalho/rodapé, aplicá-las ao elemento antes da conversão
  if (config) {
    await applyExportConfig(element, config);
  }
  
  await generatePDFFromElement(element, filename);
}

/**
 * Prepara o elemento para exportação (ajusta estilos se necessário)
 * @param element - Elemento a ser preparado
 */
export function prepareElementForPDF(element: HTMLElement): void {
  // Força renderização de todos os elementos
  element.style.display = 'block';
  element.style.visibility = 'visible';
  
  // Garante que gráficos e SVGs sejam renderizados
  const svgElements = element.querySelectorAll('svg');
  svgElements.forEach((svg) => {
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  });
  
  // Força recálculo de layout
  void element.offsetHeight;
}

/**
 * Aplica configurações de cabeçalho e rodapé ao elemento antes da exportação
 * @param element - Elemento a ser modificado
 * @param config - Configurações de exportação
 */
async function applyExportConfig(
  element: HTMLElement,
  config: ExportConfig
): Promise<void> {
  // Cria um wrapper temporário para adicionar cabeçalho e rodapé
  const wrapper = document.createElement('div');
  wrapper.style.padding = '20px';
  
  // Adiciona cabeçalho se habilitado
  if (config.header.enabled) {
    const header = document.createElement('div');
    header.style.borderBottom = '2px solid #e5e7eb';
    header.style.paddingBottom = '16px';
    header.style.marginBottom = '24px';
    header.style.textAlign = 'center';
    
    if (config.header.logoUrl) {
      const logo = document.createElement('img');
      logo.src = config.header.logoUrl;
      logo.style.maxHeight = '60px';
      logo.style.marginBottom = '8px';
      header.appendChild(logo);
    }
    
    if (config.header.text) {
      const text = document.createElement('p');
      text.textContent = config.header.text;
      text.style.fontSize = '14px';
      text.style.fontWeight = '500';
      text.style.margin = '0';
      header.appendChild(text);
    }
    
    element.insertBefore(header, element.firstChild);
  }
  
  // Adiciona rodapé se habilitado
  if (config.footer.enabled) {
    const footer = document.createElement('div');
    footer.style.borderTop = '1px solid #e5e7eb';
    footer.style.paddingTop = '16px';
    footer.style.marginTop = '24px';
    footer.style.textAlign = 'center';
    
    if (config.footer.text) {
      const text = document.createElement('p');
      text.textContent = config.footer.text;
      text.style.fontSize = '12px';
      text.style.color = '#6b7280';
      text.style.margin = '0 0 8px 0';
      footer.appendChild(text);
    }
    
    if (config.footer.pageNumbers) {
      const pageNum = document.createElement('p');
      pageNum.textContent = 'Página 1';
      pageNum.style.fontSize = '12px';
      pageNum.style.color = '#6b7280';
      pageNum.style.margin = '0';
      footer.appendChild(pageNum);
    }
    
    element.appendChild(footer);
  }
}
