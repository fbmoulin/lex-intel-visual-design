import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import { generateText, streamText, generateObject, embed } from 'ai';
import { z } from 'zod';

// Initialize AI providers
const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Default model configuration
const defaultModel = google('gemini-2.0-flash-exp');
const embeddingModel = openai('text-embedding-3-small');

// Legal document analysis schema
const legalAnalysisSchema = z.object({
  summary: z.string().describe('Resumo do documento jurídico'),
  keyPoints: z.array(z.string()).describe('Pontos-chave identificados'),
  legalBasis: z.array(z.string()).describe('Base legal mencionada'),
  recommendations: z.array(z.string()).describe('Recomendações práticas'),
  riskLevel: z.enum(['baixo', 'médio', 'alto']).describe('Nível de risco'),
});

// Petition generation schema
const petitionSuggestionsSchema = z.object({
  title: z.string().describe('Título sugerido para a petição'),
  facts: z.array(z.string()).describe('Fatos relevantes a incluir'),
  legalArguments: z.array(z.string()).describe('Argumentos jurídicos sugeridos'),
  requests: z.array(z.string()).describe('Pedidos sugeridos'),
  citations: z.array(z.object({
    text: z.string(),
    source: z.string(),
  })).describe('Citações de jurisprudência ou doutrina'),
});

// System prompts for different contexts
const SYSTEM_PROMPTS = {
  legalAssistant: `Você é um assistente jurídico especializado em direito brasileiro.
Suas respostas devem ser:
- Precisas e fundamentadas na legislação brasileira
- Claras e objetivas
- Sempre citando a base legal quando aplicável
- Em português brasileiro formal

Você tem conhecimento sobre:
- Código Civil Brasileiro
- Código de Processo Civil
- CLT e legislação trabalhista
- Código Penal e Processo Penal
- CDC - Código de Defesa do Consumidor
- Constituição Federal
- Jurisprudência dos tribunais superiores (STF, STJ, TST)`,

  petitionWriter: `Você é um especialista em redação de petições jurídicas com foco em Visual Law.
Suas petições devem:
- Seguir a estrutura formal brasileira (endereçamento, qualificação, fatos, direito, pedidos)
- Incluir elementos de Visual Law quando apropriado (ícones, timelines, marcadores)
- Ser claras, concisas e bem fundamentadas
- Citar jurisprudência relevante
- Usar linguagem técnica adequada`,

  documentAnalyzer: `Você é um analista jurídico especializado em revisão de documentos.
Sua análise deve:
- Identificar pontos críticos e riscos
- Sugerir melhorias e correções
- Verificar conformidade com a legislação
- Destacar cláusulas importantes
- Avaliar a clareza e objetividade do texto`,
};

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface StreamCallbacks {
  onToken?: (token: string) => void;
  onComplete?: (fullText: string) => void;
  onError?: (error: Error) => void;
}

// Generate embeddings for text
export async function generateEmbedding(text: string): Promise<number[]> {
  const { embedding } = await embed({
    model: openai.embedding('text-embedding-3-small'),
    value: text,
  });
  return embedding;
}

// Chat with legal assistant
export async function chatWithAssistant(
  messages: ChatMessage[],
  context?: string
): Promise<string> {
  const systemPrompt = context 
    ? `${SYSTEM_PROMPTS.legalAssistant}\n\nContexto adicional:\n${context}`
    : SYSTEM_PROMPTS.legalAssistant;

  const result = await generateText({
    model: defaultModel,
    system: systemPrompt,
    messages: messages.map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
  });

  return result.text;
}

// Stream chat response
export async function streamChatResponse(
  messages: ChatMessage[],
  context?: string,
  callbacks?: StreamCallbacks
) {
  const systemPrompt = context 
    ? `${SYSTEM_PROMPTS.legalAssistant}\n\nContexto adicional:\n${context}`
    : SYSTEM_PROMPTS.legalAssistant;

  const result = streamText({
    model: defaultModel,
    system: systemPrompt,
    messages: messages.map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
  });

  let fullText = '';
  
  for await (const chunk of result.textStream) {
    fullText += chunk;
    callbacks?.onToken?.(chunk);
  }

  callbacks?.onComplete?.(fullText);
  return fullText;
}

// Analyze legal document
export async function analyzeLegalDocument(documentContent: string) {
  const result = await generateObject({
    model: defaultModel,
    system: SYSTEM_PROMPTS.documentAnalyzer,
    prompt: `Analise o seguinte documento jurídico:\n\n${documentContent}`,
    schema: legalAnalysisSchema,
  });

  return result.object;
}

// Generate petition suggestions
export async function generatePetitionSuggestions(
  caseDescription: string,
  petitionType: string
) {
  const result = await generateObject({
    model: defaultModel,
    system: SYSTEM_PROMPTS.petitionWriter,
    prompt: `Gere sugestões para uma petição do tipo "${petitionType}" com base no seguinte caso:\n\n${caseDescription}`,
    schema: petitionSuggestionsSchema,
  });

  return result.object;
}

// Improve petition text
export async function improvePetitionText(
  originalText: string,
  instructions?: string
): Promise<string> {
  const prompt = instructions
    ? `Melhore o seguinte texto de petição seguindo estas instruções: ${instructions}\n\nTexto original:\n${originalText}`
    : `Melhore o seguinte texto de petição, tornando-o mais claro, objetivo e bem fundamentado:\n\n${originalText}`;

  const result = await generateText({
    model: defaultModel,
    system: SYSTEM_PROMPTS.petitionWriter,
    prompt,
  });

  return result.text;
}

// Search for relevant legal information
export async function searchLegalInfo(query: string): Promise<string> {
  const result = await generateText({
    model: defaultModel,
    system: SYSTEM_PROMPTS.legalAssistant,
    prompt: `Pesquise e forneça informações relevantes sobre: ${query}
    
Inclua:
- Legislação aplicável
- Jurisprudência relevante
- Doutrina quando apropriado
- Exemplos práticos`,
  });

  return result.text;
}

export default {
  generateEmbedding,
  chatWithAssistant,
  streamChatResponse,
  analyzeLegalDocument,
  generatePetitionSuggestions,
  improvePetitionText,
  searchLegalInfo,
};
