import { useState, useCallback } from 'react';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface LegalAnalysis {
  summary: string;
  keyPoints: string[];
  legalBasis: string[];
  recommendations: string[];
  riskLevel: 'baixo' | 'médio' | 'alto';
}

export interface PetitionSuggestions {
  title: string;
  facts: string[];
  legalArguments: string[];
  requests: string[];
  citations: Array<{ text: string; source: string }>;
}

export interface LegalDocument {
  id: string;
  title: string;
  content: string;
  category: string;
  subcategory?: string;
  source?: string;
  source_url?: string;
  similarity?: number;
}

const API_BASE = '/api/ai';

export function useAIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (
    content: string,
    options?: { useRAG?: boolean; category?: string }
  ) => {
    const userMessage: ChatMessage = { role: 'user', content };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          useRAG: options?.useRAG ?? true,
          category: options?.category,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.response,
      };

      setMessages([...newMessages, assistantMessage]);
      return data.response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  const streamMessage = useCallback(async (
    content: string,
    onToken: (token: string) => void,
    options?: { useRAG?: boolean; category?: string }
  ) => {
    const userMessage: ChatMessage = { role: 'user', content };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/chat/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          useRAG: options?.useRAG ?? true,
          category: options?.category,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get stream');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.token) {
                  fullResponse += data.token;
                  onToken(data.token);
                }
                if (data.done) {
                  const assistantMessage: ChatMessage = {
                    role: 'assistant',
                    content: fullResponse,
                  };
                  setMessages([...newMessages, assistantMessage]);
                }
              } catch {
                // Ignore parse errors
              }
            }
          }
        }
      }

      return fullResponse;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    streamMessage,
    clearMessages,
    setMessages,
  };
}

export function useDocumentAnalysis() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeDocument = useCallback(async (content: string): Promise<LegalAnalysis> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze document');
      }

      return await response.json();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { analyzeDocument, isLoading, error };
}

export function usePetitionSuggestions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSuggestions = useCallback(async (
    caseDescription: string,
    petitionType: string
  ): Promise<PetitionSuggestions> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/petition/suggestions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseDescription, petitionType }),
      });

      if (!response.ok) {
        throw new Error('Failed to get suggestions');
      }

      return await response.json();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const improvePetition = useCallback(async (
    text: string,
    instructions?: string
  ): Promise<string> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/petition/improve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, instructions }),
      });

      if (!response.ok) {
        throw new Error('Failed to improve petition');
      }

      const data = await response.json();
      return data.improvedText;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { getSuggestions, improvePetition, isLoading, error };
}

export function useRAGSearch() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<LegalDocument[]>([]);

  const search = useCallback(async (
    query: string,
    options?: { matchThreshold?: number; matchCount?: number; category?: string }
  ): Promise<LegalDocument[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/rag/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, ...options }),
      });

      if (!response.ok) {
        throw new Error('Failed to search documents');
      }

      const data = await response.json();
      setResults(data.documents);
      return data.documents;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const searchLegalInfo = useCallback(async (query: string): Promise<string> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error('Failed to search legal info');
      }

      const data = await response.json();
      return data.results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { search, searchLegalInfo, results, isLoading, error };
}

export default {
  useAIChat,
  useDocumentAnalysis,
  usePetitionSuggestions,
  useRAGSearch,
};
