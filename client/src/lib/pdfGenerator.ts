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
 * Converte uma cor oklch para RGB hex
 * @param oklchString - String no formato "oklch(L C H)" ou "oklch(L C H / A)"
 * @returns String hex no formato "#RRGGBB" ou "rgba(R, G, B, A)"
 */
function oklchToRgb(oklchString: string): string {
  // Parse oklch values
  const match = oklchString.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\s*\)/);
  if (!match) return oklchString;

  const L = parseFloat(match[1]);
  const C = parseFloat(match[2]);
  const H = parseFloat(match[3]);
  const alpha = match[4] ? parseFloat(match[4]) : 1;

  // Convert oklch to oklab
  const a = C * Math.cos(H * Math.PI / 180);
  const b = C * Math.sin(H * Math.PI / 180);

  // Convert oklab to linear sRGB
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  // Convert linear sRGB to sRGB
  let r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  let g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  let bl = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

  // Apply gamma correction
  const gammaCorrect = (x: number) => {
    if (x >= 0.0031308) {
      return 1.055 * Math.pow(x, 1 / 2.4) - 0.055;
    }
    return 12.92 * x;
  };

  r = Math.max(0, Math.min(1, gammaCorrect(r)));
  g = Math.max(0, Math.min(1, gammaCorrect(g)));
  bl = Math.max(0, Math.min(1, gammaCorrect(bl)));

  // Convert to 8-bit values
  const r8 = Math.round(r * 255);
  const g8 = Math.round(g * 255);
  const b8 = Math.round(bl * 255);

  if (alpha < 1) {
    return `rgba(${r8}, ${g8}, ${b8}, ${alpha})`;
  }

  // Convert to hex
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(r8)}${toHex(g8)}${toHex(b8)}`;
}

/**
 * Converte todas as cores oklch em um valor CSS para RGB
 * @param cssValue - Valor CSS que pode conter oklch
 * @returns Valor CSS com oklch convertido para RGB
 */
function convertOklchInCssValue(cssValue: string): string {
  if (!cssValue || typeof cssValue !== 'string') return cssValue;
  
  // Replace all oklch() occurrences
  return cssValue.replace(/oklch\([^)]+\)/g, (match) => {
    try {
      return oklchToRgb(match);
    } catch {
      return match;
    }
  });
}

/**
 * Converte todas as cores oklch em um elemento e seus descendentes para RGB
 * @param element - Elemento HTML a ser processado
 */
function convertOklchColorsInElement(element: HTMLElement): void {
  const allElements = [element, ...Array.from(element.querySelectorAll('*'))] as HTMLElement[];
  
  const colorProperties = [
    'color',
    'backgroundColor',
    'borderColor',
    'borderTopColor',
    'borderRightColor',
    'borderBottomColor',
    'borderLeftColor',
    'outlineColor',
    'textDecorationColor',
    'fill',
    'stroke',
    'boxShadow',
    'textShadow',
    'caretColor',
  ];

  allElements.forEach((el) => {
    if (!(el instanceof HTMLElement)) return;
    
    const computedStyle = window.getComputedStyle(el);
    
    colorProperties.forEach((prop) => {
      const value = computedStyle.getPropertyValue(prop.replace(/([A-Z])/g, '-$1').toLowerCase());
      if (value && value.includes('oklch')) {
        const converted = convertOklchInCssValue(value);
        el.style.setProperty(prop.replace(/([A-Z])/g, '-$1').toLowerCase(), converted, 'important');
      }
    });

    // Also check CSS custom properties (variables)
    const style = el.getAttribute('style') || '';
    if (style.includes('oklch')) {
      el.setAttribute('style', convertOklchInCssValue(style));
    }
  });

  // Convert CSS variables in :root
  const rootStyles = document.documentElement.style;
  for (let i = 0; i < rootStyles.length; i++) {
    const prop = rootStyles[i];
    const value = rootStyles.getPropertyValue(prop);
    if (value && value.includes('oklch')) {
      rootStyles.setProperty(prop, convertOklchInCssValue(value));
    }
  }
}

/**
 * Cria um clone do elemento com cores convertidas para RGB
 * @param element - Elemento original
 * @returns Clone do elemento com cores RGB
 */
function createPdfReadyClone(element: HTMLElement): HTMLElement {
  // Clone the element
  const clone = element.cloneNode(true) as HTMLElement;
  
  // Create a temporary container
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = `${element.offsetWidth}px`;
  container.appendChild(clone);
  document.body.appendChild(container);

  // Apply computed styles to the clone
  const applyComputedStyles = (original: Element, cloned: Element) => {
    if (!(original instanceof HTMLElement) || !(cloned instanceof HTMLElement)) return;
    
    const computedStyle = window.getComputedStyle(original);
    const colorProperties = [
      'color', 'background-color', 'background', 'border-color',
      'border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color',
      'outline-color', 'box-shadow', 'text-shadow'
    ];
    
    colorProperties.forEach((prop) => {
      let value = computedStyle.getPropertyValue(prop);
      if (value && value.includes('oklch')) {
        value = convertOklchInCssValue(value);
      }
      if (value && value !== 'none' && value !== 'initial' && value !== 'inherit') {
        cloned.style.setProperty(prop, value, 'important');
      }
    });

    // Also copy font and layout properties for consistency
    const layoutProps = ['font-family', 'font-size', 'font-weight', 'line-height', 'padding', 'margin'];
    layoutProps.forEach((prop) => {
      const value = computedStyle.getPropertyValue(prop);
      if (value) {
        cloned.style.setProperty(prop, value);
      }
    });
  };

  // Apply styles recursively
  const originalElements = [element, ...Array.from(element.querySelectorAll('*'))];
  const clonedElements = [clone, ...Array.from(clone.querySelectorAll('*'))];
  
  originalElements.forEach((orig, index) => {
    if (clonedElements[index]) {
      applyComputedStyles(orig, clonedElements[index]);
    }
  });

  return clone;
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
  let clone: HTMLElement | null = null;
  let container: HTMLElement | null = null;

  try {
    // Create a clone with converted colors
    clone = createPdfReadyClone(element);
    container = clone.parentElement;

    // Wait for styles to apply
    await new Promise(resolve => setTimeout(resolve, 100));

    // Configurações do html2canvas para melhor qualidade
    const canvas = await html2canvas(clone, {
      scale: 2, // Aumenta a resolução
      useCORS: true, // Permite carregar imagens de outras origens
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      // Ignore oklch color parsing errors
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.body.querySelector('[data-pdf-clone]') || clonedDoc.body;
        convertOklchColorsInElement(clonedElement as HTMLElement);
      }
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
  } finally {
    // Clean up the temporary clone
    if (container && container.parentElement) {
      container.parentElement.removeChild(container);
    }
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
