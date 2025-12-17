# Pesquisa: Otimização de Busca Semântica e RAG - 2025

## Resumo Executivo

Esta pesquisa consolida as melhores práticas e técnicas avançadas de otimização de RAG (Retrieval-Augmented Generation) identificadas em dezembro de 2025, com foco em aplicabilidade para o sistema Lex Intel.

---

## 1. Problemas Comuns em RAG Básico

### Sintomas de Falha em Produção
- **Top-k retorna duplicatas** ou snippets superficiais
- **Retrieval perde termos raros** (IDs, siglas, nomes próprios)
- **Respostas citam entidade errada** ou misturam detalhes
- **Latência aumenta** com k maior ou chunks longos
- **Chunking ruim** corta tabelas e cabeçalhos
- **Chats multi-turno** perdem contexto de filtros anteriores
- **Retrieval fraco** força o modelo a "adivinhar"

### Causas Raiz
1. **Vector-only retrieval** - perde tokens exatos e strings raras
2. **Chunking boundaries** - corta estrutura, modelo vê fragmentos
3. **Sem reranking** - similaridade de cosseno não mede utilidade
4. **Sem filtros** - documentos fora de escopo entram no prompt
5. **Query understanding limitado** - sub-retrieval em perguntas multi-hop
6. **Sem feedback loop** - não detecta contexto fraco antes de gerar
7. **Sem contexto de grafo** - falha em raciocínio cross-document

---

## 2. Técnicas Avançadas de RAG

### 2.1 Melhorar Qualidade de Retrieval

#### Hybrid Search (Semântico + Léxico)
- **BM25/SPLADE** para match exato de termos
- **Dense embeddings** para match semântico
- **Reciprocal Rank Fusion (RRF)** para combinar resultados
- **Benefício**: Captura tanto significado quanto tokens exatos

#### Reranking com Cross-Encoder
- Após first-pass retrieval, rerankar com cross-encoder
- **Melhoria típica**: 20-35% em precisão
- **Latência adicional**: 200-500ms por query
- **Modelos recomendados 2025**:
  - FlashRank (leve, open-source)
  - ColBERT (multi-vector)
  - zerank-2 (multilíngue, nov/2025)
  - Cohere Rerank v3

#### Filtering por Metadata
- Aplicar regras de metadata (fonte, data, autor, tipo)
- Aplicar thresholds semânticos
- Remover hits de baixa qualidade antes do reranking

### 2.2 Otimizar Documentos para Retrieval

#### Chunking Inteligente
- **Fixed-size** ou **sentence-aware** como default
- **Semantic chunking** quando boundaries são confusos
- **Document-aware/adaptive** para estrutura (tabelas, headers)
- **Tamanho recomendado**: 512-1024 tokens com overlap de 20%

#### Parent Retriever
- Recuperar chunks "filhos" menores
- Trocar pelo bloco "pai" quando muitos filhos da mesma seção aparecem
- Preserva contexto e reduz fragmentação

#### Context Distillation / Summarization
- Resumir hits para caber mais info relevante na janela
- GraphRAG usa query-focused summarization
- LangChain: ContextualCompressionRetriever
- LlamaIndex: tree/refine synthesizers

### 2.3 Melhorar Entendimento de Query

#### Query Expansion
- Adicionar sinônimos e termos relacionados
- Gerar variantes da query
- Aumenta recall sem sacrificar precisão (com reranking)

#### HyDE (Hypothetical Document Embeddings)
- Gerar perguntas representativas de cada chunk
- Indexar essas perguntas
- Match query do usuário com perguntas pré-geradas

### 2.4 Raciocínio Multi-Step (Agentic RAG)

#### Agentic Planning Workflow
1. **Plan**: Quebrar pergunta em sub-goals
2. **Route**: Escolher ferramenta certa por tarefa
3. **Act**: Executar e coletar evidência com proveniência
4. **Verify**: Checar cobertura e conflitos
5. **Stop**: Concluir quando sub-goals satisfeitos ou budget atingido

#### Chain-of-Thought (CoT)
- Modelo planeja/raciocina em passos
- Usar como scratchpad privado do agente
- Retornar resposta concisa com citações

### 2.5 Grounding e Redução de Alucinações

#### Grounding Estrito
- Instruir modelo a responder APENAS de fontes recuperadas
- Adicionar: "Se não suportado, diga 'Não sei'"
- Incluir IDs de citação junto às claims

#### Corrective RAG (CRAG)
- Feedback loop antes de gerar
- Checar se contexto recuperado é bom o suficiente
- Se fraco: novo retrieval pass ou filtros mais estritos
- **Citações**: 355+ papers acadêmicos (2024)

---

## 3. Implementação em PostgreSQL/Supabase

### 3.1 Hybrid Search com pgvector + pg_trgm

```sql
-- Criar índice BM25-like com pg_trgm
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX idx_legal_docs_content_trgm ON legal_documents 
USING gin (content gin_trgm_ops);

-- Função de busca híbrida
CREATE OR REPLACE FUNCTION hybrid_search(
  query_text text,
  query_embedding vector(768),
  match_count int DEFAULT 10,
  semantic_weight float DEFAULT 0.7,
  lexical_weight float DEFAULT 0.3
) RETURNS TABLE (
  id uuid,
  title text,
  content text,
  combined_score float
) AS $$
BEGIN
  RETURN QUERY
  WITH semantic_results AS (
    SELECT 
      ld.id,
      ld.title,
      ld.content,
      1 - (ld.embedding <=> query_embedding) as semantic_score,
      ROW_NUMBER() OVER (ORDER BY ld.embedding <=> query_embedding) as semantic_rank
    FROM legal_documents ld
    WHERE ld.embedding IS NOT NULL
    LIMIT match_count * 2
  ),
  lexical_results AS (
    SELECT 
      ld.id,
      ld.title,
      ld.content,
      similarity(ld.content, query_text) as lexical_score,
      ROW_NUMBER() OVER (ORDER BY similarity(ld.content, query_text) DESC) as lexical_rank
    FROM legal_documents ld
    WHERE ld.content % query_text
    LIMIT match_count * 2
  ),
  combined AS (
    SELECT 
      COALESCE(s.id, l.id) as id,
      COALESCE(s.title, l.title) as title,
      COALESCE(s.content, l.content) as content,
      (COALESCE(1.0 / (60 + s.semantic_rank), 0) * semantic_weight +
       COALESCE(1.0 / (60 + l.lexical_rank), 0) * lexical_weight) as rrf_score
    FROM semantic_results s
    FULL OUTER JOIN lexical_results l ON s.id = l.id
  )
  SELECT 
    c.id,
    c.title,
    c.content,
    c.rrf_score as combined_score
  FROM combined c
  ORDER BY c.rrf_score DESC
  LIMIT match_count;
END;
$$ LANGUAGE plpgsql;
```

### 3.2 Reranking com Cross-Encoder

```python
# Usando Cohere Rerank ou modelo local
from sentence_transformers import CrossEncoder

# Modelo multilíngue recomendado
reranker = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2')

def rerank_results(query: str, documents: list, top_k: int = 5):
    pairs = [[query, doc['content']] for doc in documents]
    scores = reranker.predict(pairs)
    
    # Ordenar por score
    ranked = sorted(
        zip(documents, scores), 
        key=lambda x: x[1], 
        reverse=True
    )
    
    return [doc for doc, score in ranked[:top_k]]
```

### 3.3 CRAG - Corrective RAG

```python
def corrective_rag(query: str, threshold: float = 0.6):
    # 1. Primeira busca
    results = search_legal_documents(query)
    
    # 2. Avaliar qualidade do contexto
    avg_similarity = sum(r['similarity'] for r in results) / len(results)
    
    # 3. Se contexto fraco, tentar novamente
    if avg_similarity < threshold:
        # Expandir query
        expanded_query = expand_query(query)
        results = search_legal_documents(expanded_query)
        
        # Se ainda fraco, usar web search como fallback
        if avg_similarity < threshold * 0.8:
            results = web_search_fallback(query)
    
    # 4. Gerar resposta com contexto validado
    return generate_with_grounding(query, results)
```

---

## 4. Métricas de Avaliação

### Retrieval Metrics
- **Recall@K**: % de documentos relevantes recuperados
- **MRR (Mean Reciprocal Rank)**: Posição média do primeiro resultado relevante
- **NDCG**: Normalized Discounted Cumulative Gain

### Answer Quality Metrics
- **Groundedness/Faithfulness**: Resposta está nas fontes?
- **Answer Relevance**: Responde a pergunta?
- **Citation Accuracy**: Citações estão corretas?

### Operational Metrics
- **Latency P50/P95**: Tempo de resposta
- **Token Usage**: Custo de tokens
- **Hallucination Rate**: Taxa de alucinações

---

## 5. Roadmap de Implementação para Lex Intel

### Fase 1: Quick Wins (1-2 semanas)
1. ✅ Implementar busca semântica básica (FEITO)
2. ⬜ Adicionar índice BM25/trigram para hybrid search
3. ⬜ Implementar RRF (Reciprocal Rank Fusion)
4. ⬜ Adicionar reranking com cross-encoder

### Fase 2: Otimização (2-4 semanas)
5. ⬜ Implementar query expansion
6. ⬜ Adicionar metadata filtering (categoria, data, fonte)
7. ⬜ Implementar parent retriever para chunks relacionados
8. ⬜ Adicionar context distillation/summarization

### Fase 3: Advanced (4-8 semanas)
9. ⬜ Implementar CRAG (Corrective RAG)
10. ⬜ Adicionar grounding estrito com citações
11. ⬜ Implementar agentic planning para multi-hop
12. ⬜ Adicionar avaliação automática de qualidade

---

## 6. Fontes da Pesquisa

1. Neo4j Blog - "Advanced RAG Techniques for High-Performance LLM Applications" (Oct 2025)
2. Microsoft Tech Community - "Proven Methods to Optimize RAG for Production" (Sep 2025)
3. Google Cloud Blog - "Optimizing RAG Retrieval" (Dec 2024)
4. DataCamp - "How to Improve RAG Performance" (Apr 2024)
5. LangChain Documentation - "Corrective RAG (CRAG)"
6. Weaviate Blog - "Hybrid Search Explained" (Jan 2025)
7. ParadeDB - "Hybrid Search in PostgreSQL" (Oct 2025)
8. Analytics Vidhya - "Top 7 Rerankers for RAG" (Dec 2025)
