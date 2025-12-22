/**
 * Rotas de API para RAG Avançado
 */

import { Router, Request, Response } from 'express';
import advancedRagService from '../services/advancedRagService';

const router = Router();

/**
 * POST /api/rag/advanced/search
 * Busca avançada com hybrid search, reranking e CRAG
 */
router.post('/search', async (req: Request, res: Response) => {
  try {
    const {
      query,
      category,
      useQueryExpansion = true,
      useReranking = true,
      useCRAG = true,
    } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query é obrigatória' });
    }

    const result = await advancedRagService.advancedRAGPipeline(query, {
      category,
      useQueryExpansion,
      useReranking,
      useCRAG,
    });

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Erro na busca avançada:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao processar busca avançada',
    });
  }
});

/**
 * POST /api/rag/advanced/hybrid
 * Busca híbrida simples (sem CRAG)
 */
router.post('/hybrid', async (req: Request, res: Response) => {
  try {
    const { query, category, limit = 10 } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query é obrigatória' });
    }

    const results = await advancedRagService.hybridSearch(query, category, limit);

    return res.json({
      success: true,
      data: {
        results,
        count: results.length,
      },
    });
  } catch (error) {
    console.error('Erro na busca híbrida:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao processar busca híbrida',
    });
  }
});

/**
 * POST /api/rag/advanced/expand-query
 * Expande uma query com termos relacionados
 */
router.post('/expand-query', async (req: Request, res: Response) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query é obrigatória' });
    }

    const expandedQuery = await advancedRagService.expandQuery(query);

    return res.json({
      success: true,
      data: {
        original: query,
        expanded: expandedQuery,
      },
    });
  } catch (error) {
    console.error('Erro ao expandir query:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao expandir query',
    });
  }
});

/**
 * POST /api/rag/advanced/rerank
 * Reordena resultados por relevância
 */
router.post('/rerank', async (req: Request, res: Response) => {
  try {
    const { query, results, topK = 5 } = req.body;

    if (!query || !results) {
      return res.status(400).json({ error: 'Query e results são obrigatórios' });
    }

    const rerankedResults = await advancedRagService.rerankResults(query, results, topK);

    return res.json({
      success: true,
      data: {
        results: rerankedResults,
        count: rerankedResults.length,
      },
    });
  } catch (error) {
    console.error('Erro ao reordenar resultados:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao reordenar resultados',
    });
  }
});

/**
 * GET /api/rag/advanced/config
 * Retorna configurações atuais do RAG
 */
router.get('/config', (_req: Request, res: Response) => {
  return res.json({
    success: true,
    data: {
      semanticWeight: 0.7,
      lexicalWeight: 0.3,
      minSimilarityThreshold: 0.5,
      cragThreshold: 0.55,
      maxResults: 10,
      rerankTopK: 5,
      features: {
        hybridSearch: true,
        queryExpansion: true,
        reranking: true,
        crag: true,
        grounding: true,
      },
    },
  });
});

export default router;
