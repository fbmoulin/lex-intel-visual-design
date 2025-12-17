/**
 * Advanced RAG Service - Otimizações de Busca Semântica
 * 
 * Implementa técnicas avançadas de RAG:
 * 1. Hybrid Search (Semântico + Léxico) com RRF
 * 2. Query Expansion
 * 3. Reranking com Cross-Encoder
 * 4. CRAG (Corrective RAG)
 * 5. Grounding com Citações
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Configurações
const CONFIG = {
  SEMANTIC_WEIGHT: 0.7,
  LEXICAL_WEIGHT: 0.3,
  MIN_SIMILARITY_THRESHOLD: 0.5,
  CRAG_THRESHOLD: 0.55,
  MAX_RESULTS: 10,
  RERANK_TOP_K: 5,
};

interface SearchResult {
  id: string;
  title: string;
  content: string;
  category: string;
  subcategory?: string;
  source?: string;
  semantic_score: number;
  lexical_score: number;
  combined_score: number;
  rerank_score?: number;
}

interface RAGContext {
  documents: SearchResult[];
  query: string;
  expandedQuery?: string;
  qualityScore: number;
  usedCRAG: boolean;
  citations: Citation[];
}

interface Citation {
  id: string;
  title: string;
  source: string;
  relevance: number;
}

/**
 * Gera embedding usando Gemini
 */
async function generateEmbedding(text: string): Promise<number[]> {
  const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
  const result = await model.embedContent(text);
  return result.embedding.values;
}

/**
 * Expande a query com sinônimos e termos relacionados
 */
async function expandQuery(query: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
  
  const prompt = `Você é um especialista em direito brasileiro. 
Dada a seguinte pergunta jurídica, expanda-a com sinônimos e termos relacionados para melhorar a busca.
Mantenha o foco no tema principal e adicione termos técnicos jurídicos relevantes.

Pergunta original: "${query}"

Retorne APENAS a query expandida, sem explicações. Máximo 100 palavras.`;

  const result = await model.generateContent(prompt);
  const expandedQuery = result.response.text();
  
  return `${query} ${expandedQuery}`;
}

/**
 * Busca híbrida com RRF (Reciprocal Rank Fusion)
 * Combina busca semântica (embeddings) com busca léxica (trigram)
 */
async function hybridSearch(
  query: string,
  category?: string,
  limit: number = CONFIG.MAX_RESULTS
): Promise<SearchResult[]> {
  // Gerar embedding da query
  const embedding = await generateEmbedding(query);
  const embeddingStr = '[' + embedding.join(',') + ']';
  
  // Chamar função SQL de busca híbrida
  const sql = `
    SELECT * FROM hybrid_search_legal_documents(
      '${query.replace(/'/g, "''")}',
      '${embeddingStr}'::vector,
      ${limit},
      ${CONFIG.SEMANTIC_WEIGHT},
      ${CONFIG.LEXICAL_WEIGHT},
      ${category ? `'${category}'` : 'NULL'}
    );
  `;
  
  // Executar via Supabase (implementar chamada real)
  // Por enquanto, retorna mock para demonstração
  return [];
}

/**
 * Reranking com modelo de linguagem
 * Avalia relevância de cada documento para a query
 */
async function rerankResults(
  query: string,
  results: SearchResult[],
  topK: number = CONFIG.RERANK_TOP_K
): Promise<SearchResult[]> {
  if (results.length === 0) return [];
  
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
  
  // Avaliar relevância de cada documento
  const scoredResults = await Promise.all(
    results.map(async (doc) => {
      const prompt = `Avalie a relevância do seguinte documento para responder a pergunta.
      
Pergunta: "${query}"

Documento:
Título: ${doc.title}
Conteúdo: ${doc.content.substring(0, 500)}...

Responda APENAS com um número de 0 a 10 indicando a relevância (10 = muito relevante, 0 = irrelevante).`;

      try {
        const result = await model.generateContent(prompt);
        const scoreText = result.response.text().trim();
        const score = parseFloat(scoreText) / 10;
        return { ...doc, rerank_score: isNaN(score) ? doc.combined_score : score };
      } catch {
        return { ...doc, rerank_score: doc.combined_score };
      }
    })
  );
  
  // Ordenar por score de reranking
  return scoredResults
    .sort((a, b) => (b.rerank_score || 0) - (a.rerank_score || 0))
    .slice(0, topK);
}

/**
 * CRAG - Corrective RAG
 * Avalia qualidade do contexto e tenta corrigir se necessário
 */
async function correctiveRAG(
  query: string,
  results: SearchResult[],
  category?: string
): Promise<{ results: SearchResult[]; usedCorrection: boolean }> {
  // Calcular score médio de qualidade
  const avgScore = results.reduce((sum, r) => sum + r.combined_score, 0) / results.length;
  
  // Se qualidade abaixo do threshold, tentar corrigir
  if (avgScore < CONFIG.CRAG_THRESHOLD) {
    console.log(`[CRAG] Qualidade baixa (${avgScore.toFixed(3)}), aplicando correção...`);
    
    // 1. Expandir query
    const expandedQuery = await expandQuery(query);
    
    // 2. Nova busca com query expandida
    const newResults = await hybridSearch(expandedQuery, category, CONFIG.MAX_RESULTS * 2);
    
    // 3. Reranking mais agressivo
    const rerankedResults = await rerankResults(query, newResults, CONFIG.RERANK_TOP_K);
    
    return { results: rerankedResults, usedCorrection: true };
  }
  
  return { results, usedCorrection: false };
}

/**
 * Gera citações estruturadas dos documentos
 */
function generateCitations(results: SearchResult[]): Citation[] {
  return results.map((doc, index) => ({
    id: `[${index + 1}]`,
    title: doc.title,
    source: doc.source || 'Base de Conhecimento Lex Intel',
    relevance: doc.rerank_score || doc.combined_score,
  }));
}

/**
 * Gera resposta com grounding estrito
 */
async function generateGroundedResponse(
  query: string,
  context: RAGContext
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
  
  // Preparar contexto com citações
  const contextText = context.documents
    .map((doc, i) => `[${i + 1}] ${doc.title}\n${doc.content}`)
    .join('\n\n---\n\n');
  
  const citationsText = context.citations
    .map(c => `${c.id} ${c.title} - ${c.source}`)
    .join('\n');
  
  const prompt = `Você é um assistente jurídico especializado em direito brasileiro.
Responda à pergunta APENAS com base nos documentos fornecidos abaixo.

REGRAS ESTRITAS:
1. Use APENAS informações dos documentos fornecidos
2. Cite as fontes usando [1], [2], etc.
3. Se a informação não estiver nos documentos, diga "Não encontrei informação suficiente sobre este tema nos documentos disponíveis."
4. Seja preciso e técnico
5. Organize a resposta de forma clara

PERGUNTA: ${query}

DOCUMENTOS:
${contextText}

FONTES DISPONÍVEIS:
${citationsText}

RESPOSTA:`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

/**
 * Pipeline completo de RAG avançado
 */
export async function advancedRAGPipeline(
  query: string,
  options: {
    category?: string;
    useQueryExpansion?: boolean;
    useReranking?: boolean;
    useCRAG?: boolean;
  } = {}
): Promise<{
  answer: string;
  context: RAGContext;
  metadata: {
    queryExpanded: boolean;
    reranked: boolean;
    cragApplied: boolean;
    documentsRetrieved: number;
    avgRelevance: number;
  };
}> {
  const {
    category,
    useQueryExpansion = true,
    useReranking = true,
    useCRAG = true,
  } = options;
  
  let currentQuery = query;
  let queryExpanded = false;
  
  // 1. Query Expansion (opcional)
  if (useQueryExpansion) {
    currentQuery = await expandQuery(query);
    queryExpanded = true;
  }
  
  // 2. Hybrid Search
  let results = await hybridSearch(currentQuery, category);
  
  // 3. CRAG - Corrective RAG (opcional)
  let cragApplied = false;
  if (useCRAG) {
    const cragResult = await correctiveRAG(query, results, category);
    results = cragResult.results;
    cragApplied = cragResult.usedCorrection;
  }
  
  // 4. Reranking (opcional)
  if (useReranking && results.length > 0) {
    results = await rerankResults(query, results);
  }
  
  // 5. Gerar citações
  const citations = generateCitations(results);
  
  // 6. Calcular score de qualidade
  const qualityScore = results.length > 0
    ? results.reduce((sum, r) => sum + (r.rerank_score || r.combined_score), 0) / results.length
    : 0;
  
  // 7. Montar contexto
  const context: RAGContext = {
    documents: results,
    query: query,
    expandedQuery: queryExpanded ? currentQuery : undefined,
    qualityScore,
    usedCRAG: cragApplied,
    citations,
  };
  
  // 8. Gerar resposta com grounding
  const answer = await generateGroundedResponse(query, context);
  
  return {
    answer,
    context,
    metadata: {
      queryExpanded,
      reranked: useReranking,
      cragApplied,
      documentsRetrieved: results.length,
      avgRelevance: qualityScore,
    },
  };
}

/**
 * Busca semântica simples (fallback)
 */
export async function simpleSemanticSearch(
  query: string,
  category?: string,
  limit: number = 5
): Promise<SearchResult[]> {
  const embedding = await generateEmbedding(query);
  const embeddingStr = '[' + embedding.join(',') + ']';
  
  // SQL para busca semântica simples
  const sql = `
    SELECT 
      id, title, content, category, subcategory, source,
      1 - (embedding <=> '${embeddingStr}'::vector) as semantic_score,
      0 as lexical_score,
      1 - (embedding <=> '${embeddingStr}'::vector) as combined_score
    FROM legal_documents
    WHERE embedding IS NOT NULL
    ${category ? `AND category = '${category}'` : ''}
    ORDER BY embedding <=> '${embeddingStr}'::vector
    LIMIT ${limit};
  `;
  
  // Retornar resultados (implementar chamada real ao Supabase)
  return [];
}

export default {
  advancedRAGPipeline,
  simpleSemanticSearch,
  hybridSearch,
  rerankResults,
  expandQuery,
  generateEmbedding,
};
