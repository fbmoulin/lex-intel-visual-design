# Documentação - Sistema de Exportação Avançado

## Lex Intel Visual Design
**Desenvolvido por: Lex Intelligentia**

---

## Visão Geral

O sistema de exportação do Lex Intel Visual Design foi aprimorado para oferecer controle total sobre a geração de documentos jurídicos profissionais. A nova funcionalidade permite que advogados personalizem completamente a aparência e o formato dos documentos exportados, garantindo conformidade com padrões do escritório e necessidades específicas de cada caso.

---

## Funcionalidades Implementadas

### 1. Modal de Configuração de Exportação

Um modal interativo e intuitivo que centraliza todas as opções de exportação antes de gerar o documento final.

**Características:**
- Interface em abas (Configurações e Preview)
- Feedback visual em tempo real
- Validação de campos
- Mensagens de sucesso/erro contextualizadas

**Localização no código:**
- Componente: `/client/src/components/ExportModal.tsx`
- Integração: `/client/src/pages/Editor.tsx`

---

### 2. Seleção de Formato de Exportação

O sistema suporta dois formatos principais de exportação, cada um otimizado para casos de uso específicos.

#### PDF (Portable Document Format)
- **Uso recomendado:** Envio oficial, protocolo em tribunais, arquivo permanente
- **Características:**
  - Preserva formatação visual exata
  - Não editável (garante integridade)
  - Compatível universalmente
  - Inclui elementos visuais (gráficos, timelines, cards)
  
- **Implementação:**
  - Biblioteca: `html2canvas` + `jsPDF`
  - Arquivo: `/client/src/lib/pdfGenerator.ts`
  - Resolução: 2x (alta qualidade)
  - Formato: A4 (210mm x 297mm)
  - Paginação automática

#### DOCX (Microsoft Word)
- **Uso recomendado:** Edição posterior, colaboração, ajustes finais
- **Características:**
  - Totalmente editável
  - Compatível com Microsoft Word e LibreOffice
  - Formatação profissional preservada
  - Estrutura hierárquica de títulos
  
- **Implementação:**
  - Biblioteca: `docx` + `file-saver`
  - Arquivo: `/client/src/lib/docxGenerator.ts`
  - Estilos: Heading 1, Heading 2, parágrafos justificados
  - Margens: 1 polegada em todos os lados

---

### 3. Personalização de Cabeçalho

O cabeçalho pode ser completamente personalizado para refletir a identidade visual do escritório.

**Opções disponíveis:**
- **Ativar/Desativar:** Controle total sobre a exibição do cabeçalho
- **Logo do Escritório:** 
  - Suporte para URL ou caminho local
  - Altura máxima: 60px
  - Centralizado automaticamente
- **Texto do Cabeçalho:**
  - Nome do escritório
  - OAB/UF
  - Informações de contato
  - Formatação: Negrito, 14px

**Exemplo de uso:**
```
Logo: https://escritorio.com.br/logo.png
Texto: Silva & Associados Advocacia - OAB/SP 123456
```

**Renderização:**
- PDF: Inserido dinamicamente no elemento antes da conversão
- DOCX: Adicionado como Header na seção do documento

---

### 4. Personalização de Rodapé

O rodapé oferece espaço para informações complementares e numeração de páginas.

**Opções disponíveis:**
- **Ativar/Desativar:** Controle total sobre a exibição do rodapé
- **Texto do Rodapé:**
  - Endereço do escritório
  - Telefone e e-mail
  - Informações adicionais
  - Formatação: 12px, cor cinza (#6B7280)
- **Numeração de Páginas:**
  - Checkbox para ativar/desativar
  - Formato: "Página X" ou "Página X de Y"
  - Centralizado

**Exemplo de uso:**
```
Texto: Rua das Flores, 123 - Centro - São Paulo/SP
       Tel: (11) 1234-5678 | contato@escritorio.com.br
Numeração: ✓ Ativada
```

**Renderização:**
- PDF: Inserido dinamicamente após o conteúdo principal
- DOCX: Adicionado como Footer na seção do documento

---

### 5. Preview Antes de Exportar

A aba de preview permite visualizar exatamente como o documento será exportado, incluindo todas as personalizações aplicadas.

**Características:**
- Visualização em tempo real
- Exibe cabeçalho personalizado
- Mostra conteúdo completo da petição
- Exibe rodapé personalizado
- Simula numeração de páginas
- Fundo branco simulando papel

**Benefícios:**
- Evita retrabalho
- Garante qualidade antes da exportação
- Permite ajustes finos
- Aumenta confiança do usuário

---

## Fluxo de Uso

### Passo a Passo para Exportar uma Petição

1. **Preencher o Editor**
   - Acessar página Editor
   - Preencher todos os campos da petição
   - Verificar preview em tempo real

2. **Abrir Modal de Exportação**
   - Clicar no botão "Exportar" (ícone FileDown)
   - Modal será exibido com configurações padrão

3. **Configurar Formato**
   - Selecionar PDF ou DOCX
   - Ler descrição do formato escolhido

4. **Personalizar Cabeçalho** (opcional)
   - Ativar/desativar cabeçalho
   - Inserir URL do logo (se disponível)
   - Inserir texto do escritório

5. **Personalizar Rodapé** (opcional)
   - Ativar/desativar rodapé
   - Inserir informações de contato
   - Marcar/desmarcar numeração de páginas

6. **Visualizar Preview**
   - Clicar na aba "Preview"
   - Verificar todas as personalizações
   - Voltar para "Configurações" se necessário

7. **Confirmar Exportação**
   - Clicar em "Exportar PDF" ou "Exportar DOCX"
   - Aguardar processamento
   - Arquivo será baixado automaticamente

---

## Configurações Padrão

O sistema vem com configurações pré-definidas que podem ser ajustadas:

```typescript
{
  format: "pdf",
  header: {
    enabled: true,
    text: "Lex Intelligentia - Advocacia e Consultoria Jurídica",
  },
  footer: {
    enabled: true,
    text: "Documento gerado pelo Lex Intel Visual Design",
    pageNumbers: true,
  },
}
```

**Recomendação:** Personalize essas configurações para refletir a identidade do seu escritório.

---

## Detalhes Técnicos

### Estrutura de Arquivos

```
/client/src/
├── components/
│   └── ExportModal.tsx          # Modal de configuração
├── lib/
│   ├── pdfGenerator.ts          # Geração de PDF
│   └── docxGenerator.ts         # Geração de DOCX
└── pages/
    └── Editor.tsx               # Integração do modal
```

### Dependências Instaladas

```json
{
  "dependencies": {
    "html2canvas": "^1.4.1",
    "jspdf": "^2.5.1",
    "docx": "^9.5.1",
    "file-saver": "^2.0.5"
  },
  "devDependencies": {
    "@types/file-saver": "^2.0.7"
  }
}
```

### Interface TypeScript

```typescript
export interface ExportConfig {
  format: "pdf" | "docx";
  header: {
    enabled: boolean;
    logoUrl?: string;
    text?: string;
  };
  footer: {
    enabled: boolean;
    text?: string;
    pageNumbers: boolean;
  };
}
```

---

## Formatação Profissional DOCX

O gerador DOCX aplica formatação profissional automaticamente:

### Estrutura do Documento

1. **Título Principal**
   - Heading Level 1
   - Centralizado
   - Espaçamento: 400 twips após

2. **Seções**
   - Heading Level 2
   - Espaçamento: 300 twips antes, 200 twips após
   - Títulos: "INFORMAÇÕES DO PROCESSO", "DOS FATOS", "DOS FUNDAMENTOS JURÍDICOS", "DOS PEDIDOS"

3. **Parágrafos**
   - Alinhamento: Justificado
   - Espaçamento: 150 twips após
   - Quebra automática de linhas

4. **Informações em Negrito**
   - Campos: "Processo nº:", "Tribunal:", "Autor:", "Réu:", "Valor da Causa:"
   - Formato: Negrito + texto normal

5. **Encerramento**
   - Alinhamento: Direita
   - Data formatada em português
   - Assinatura com linha
   - Espaçamento: 400 twips antes

### Margens do Documento

- Superior: 1 polegada (25.4mm)
- Inferior: 1 polegada (25.4mm)
- Esquerda: 1 polegada (25.4mm)
- Direita: 1 polegada (25.4mm)

---

## Qualidade de Exportação PDF

### Configurações de Renderização

```typescript
{
  scale: 2,                    // Resolução 2x (alta qualidade)
  useCORS: true,              // Permite imagens externas
  logging: false,             // Desativa logs no console
  backgroundColor: '#ffffff',  // Fundo branco
  windowWidth: element.scrollWidth,
  windowHeight: element.scrollHeight,
}
```

### Paginação Automática

O sistema detecta automaticamente quando o conteúdo excede uma página A4 e cria páginas adicionais, garantindo que nada seja cortado.

### Preservação de Elementos Visuais

- **Timelines:** Convertidas para imagem com alta fidelidade
- **Gráficos (Recharts):** SVGs renderizados corretamente
- **Cards de Resumo:** Bordas e estilos preservados
- **Formatação de Texto:** Negrito, itálico, cores mantidas

---

## Mensagens de Feedback

O sistema fornece feedback claro em cada etapa:

### Sucesso
- ✅ "Documento exportado com sucesso em formato PDF!"
- ✅ "Documento exportado com sucesso em formato DOCX!"

### Erro
- ❌ "Preview não encontrado. Ative o preview para exportar."
- ❌ "Erro ao exportar documento. Tente novamente."

### Informação
- ℹ️ "Preparando exportação..."
- ℹ️ "PDF preserva a formatação visual exata e é ideal para envio oficial."
- ℹ️ "DOCX permite edição posterior e é compatível com Microsoft Word."

---

## Casos de Uso Recomendados

### Quando usar PDF:
1. Protocolo em tribunais (petições iniciais, recursos)
2. Envio para clientes (relatórios, pareceres)
3. Arquivo permanente (documentação processual)
4. Quando elementos visuais são essenciais (timelines, gráficos)

### Quando usar DOCX:
1. Minutas que precisam de revisão colaborativa
2. Documentos que serão editados posteriormente
3. Modelos para reutilização
4. Quando o cliente solicita formato editável

---

## Próximas Melhorias Sugeridas

1. **Salvamento de Configurações**
   - Salvar configurações de cabeçalho/rodapé por usuário
   - Templates de configuração de exportação
   - Configurações por tipo de petição

2. **Upload de Logo**
   - Interface para upload direto de logo
   - Armazenamento em S3 ou similar
   - Gerenciamento de múltiplos logos

3. **Assinatura Digital**
   - Integração com certificados digitais
   - Assinatura ICP-Brasil
   - Validação de autenticidade

4. **Marca d'água**
   - Opção de adicionar marca d'água
   - Texto "MINUTA" ou "RASCUNHO"
   - Configurável por documento

5. **Exportação em Lote**
   - Exportar múltiplas petições de uma vez
   - Formato ZIP com múltiplos arquivos
   - Configurações unificadas

---

## Suporte e Documentação

Para dúvidas ou sugestões sobre o sistema de exportação:

- **Documentação Técnica:** `/home/ubuntu/visual-law-app/`
- **Design System:** `design_system_visual_law_completo.md`
- **Arquitetura:** `arquitetura_integracao_ecossistema.md`
- **TODO:** `todo.md`

---

## Conclusão

O sistema de exportação avançado do Lex Intel Visual Design oferece flexibilidade profissional para geração de documentos jurídicos. Com suporte para PDF e DOCX, personalização completa de cabeçalho e rodapé, e preview em tempo real, advogados têm controle total sobre a apresentação final de suas petições.

A implementação segue os mais altos padrões de qualidade, utilizando bibliotecas consolidadas e aplicando formatação profissional automaticamente. O resultado são documentos prontos para protocolo, com a identidade visual do escritório preservada em cada detalhe.

---

**Desenvolvido por Lex Intelligentia**  
*Transformando a advocacia através da tecnologia e do design*
