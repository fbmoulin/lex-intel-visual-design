import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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
 */
export async function generatePetitionPDF(
  element: HTMLElement,
  data: PetitionData
): Promise<void> {
  const filename = `peticao_${data.templateId}_${data.processNumber.replace(/\//g, '-')}.pdf`;
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
