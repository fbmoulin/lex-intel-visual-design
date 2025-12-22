import { Router, Request, Response } from 'express';
import aiService, { ChatMessage } from '../services/aiService';
import ragService from '../services/ragService';

const router = Router();

// Chat endpoint with RAG support
router.post('/chat', async (req: Request, res: Response) => {
  try {
    const { messages, useRAG = true, category } = req.body as {
      messages: ChatMessage[];
      useRAG?: boolean;
      category?: string;
    };

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // Get the last user message for RAG context
    const lastUserMessage = messages.filter(m => m.role === 'user').pop();
    let context = '';

    if (useRAG && lastUserMessage) {
      context = await ragService.getRAGContext(lastUserMessage.content, {
        matchCount: 5,
        matchThreshold: 0.7,
        category,
      });
    }

    const response = await aiService.chatWithAssistant(messages, context);
    
    return res.json({ 
      response,
      hasContext: !!context,
    });
  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({ error: 'Failed to process chat request' });
  }
});

// Stream chat endpoint
router.post('/chat/stream', async (req: Request, res: Response) => {
  try {
    const { messages, useRAG = true, category } = req.body as {
      messages: ChatMessage[];
      useRAG?: boolean;
      category?: string;
    };

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Get the last user message for RAG context
    const lastUserMessage = messages.filter(m => m.role === 'user').pop();
    let context = '';

    if (useRAG && lastUserMessage) {
      context = await ragService.getRAGContext(lastUserMessage.content, {
        matchCount: 5,
        matchThreshold: 0.7,
        category,
      });
    }

    await aiService.streamChatResponse(messages, context, {
      onToken: (token) => {
        res.write(`data: ${JSON.stringify({ token })}\n\n`);
      },
      onComplete: () => {
        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
        res.end();
      },
      onError: (error) => {
        res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
        res.end();
      },
    });
  } catch (error) {
    console.error('Stream chat error:', error);
    return res.status(500).json({ error: 'Failed to process stream request' });
  }
});

// Analyze document endpoint
router.post('/analyze', async (req: Request, res: Response) => {
  try {
    const { content } = req.body as { content: string };

    if (!content) {
      return res.status(400).json({ error: 'Document content is required' });
    }

    const analysis = await aiService.analyzeLegalDocument(content);
    return res.json(analysis);
  } catch (error) {
    console.error('Analysis error:', error);
    return res.status(500).json({ error: 'Failed to analyze document' });
  }
});

// Generate petition suggestions endpoint
router.post('/petition/suggestions', async (req: Request, res: Response) => {
  try {
    const { caseDescription, petitionType } = req.body as {
      caseDescription: string;
      petitionType: string;
    };

    if (!caseDescription || !petitionType) {
      return res.status(400).json({ error: 'Case description and petition type are required' });
    }

    const suggestions = await aiService.generatePetitionSuggestions(caseDescription, petitionType);
    return res.json(suggestions);
  } catch (error) {
    console.error('Suggestions error:', error);
    return res.status(500).json({ error: 'Failed to generate suggestions' });
  }
});

// Improve petition text endpoint
router.post('/petition/improve', async (req: Request, res: Response) => {
  try {
    const { text, instructions } = req.body as {
      text: string;
      instructions?: string;
    };

    if (!text) {
      return res.status(400).json({ error: 'Petition text is required' });
    }

    const improvedText = await aiService.improvePetitionText(text, instructions);
    return res.json({ improvedText });
  } catch (error) {
    console.error('Improve error:', error);
    return res.status(500).json({ error: 'Failed to improve petition' });
  }
});

// Search legal information endpoint
router.post('/search', async (req: Request, res: Response) => {
  try {
    const { query } = req.body as { query: string };

    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const results = await aiService.searchLegalInfo(query);
    return res.json({ results });
  } catch (error) {
    console.error('Search error:', error);
    return res.status(500).json({ error: 'Failed to search legal information' });
  }
});

// RAG: Index document endpoint
router.post('/rag/index', async (req: Request, res: Response) => {
  try {
    const { title, content, category, subcategory, source, sourceUrl, metadata } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ error: 'Title, content, and category are required' });
    }

    const id = await ragService.indexDocument(
      title,
      content,
      category,
      subcategory,
      source,
      sourceUrl,
      metadata
    );

    return res.json({ id, message: 'Document indexed successfully' });
  } catch (error) {
    console.error('Index error:', error);
    return res.status(500).json({ error: 'Failed to index document' });
  }
});

// RAG: Search documents endpoint
router.post('/rag/search', async (req: Request, res: Response) => {
  try {
    const { query, matchThreshold, matchCount, category } = req.body as {
      query: string;
      matchThreshold?: number;
      matchCount?: number;
      category?: string;
    };

    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const documents = await ragService.searchDocuments(query, {
      matchThreshold,
      matchCount,
      category,
    });

    return res.json({ documents });
  } catch (error) {
    console.error('RAG search error:', error);
    return res.status(500).json({ error: 'Failed to search documents' });
  }
});

// RAG: Get categories endpoint
router.get('/rag/categories', async (_req: Request, res: Response) => {
  try {
    const categories = await ragService.getCategories();
    return res.json({ categories });
  } catch (error) {
    console.error('Categories error:', error);
    return res.status(500).json({ error: 'Failed to get categories' });
  }
});

// RAG: Get stats endpoint
router.get('/rag/stats', async (_req: Request, res: Response) => {
  try {
    const stats = await ragService.getDocumentStats();
    return res.json({ stats });
  } catch (error) {
    console.error('Stats error:', error);
    return res.status(500).json({ error: 'Failed to get stats' });
  }
});

export default router;
