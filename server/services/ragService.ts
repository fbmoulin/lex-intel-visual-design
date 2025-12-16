import { createClient } from '@supabase/supabase-js';
import { generateEmbedding } from './aiService';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

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

export interface SearchOptions {
  matchThreshold?: number;
  matchCount?: number;
  category?: string;
}

// Index a new legal document
export async function indexDocument(
  title: string,
  content: string,
  category: string,
  subcategory?: string,
  source?: string,
  sourceUrl?: string,
  metadata?: Record<string, any>
): Promise<string> {
  // Generate embedding for the document content
  const embedding = await generateEmbedding(`${title}\n\n${content}`);

  // Insert document with embedding
  const { data, error } = await supabase
    .from('legal_documents')
    .insert({
      title,
      content,
      category,
      subcategory,
      source,
      source_url: sourceUrl,
      embedding,
      metadata: metadata || {},
    })
    .select('id')
    .single();

  if (error) {
    throw new Error(`Failed to index document: ${error.message}`);
  }

  return data.id;
}

// Batch index multiple documents
export async function batchIndexDocuments(
  documents: Array<{
    title: string;
    content: string;
    category: string;
    subcategory?: string;
    source?: string;
    sourceUrl?: string;
    metadata?: Record<string, any>;
  }>
): Promise<string[]> {
  const results: string[] = [];

  for (const doc of documents) {
    const id = await indexDocument(
      doc.title,
      doc.content,
      doc.category,
      doc.subcategory,
      doc.source,
      doc.sourceUrl,
      doc.metadata
    );
    results.push(id);
  }

  return results;
}

// Search for similar documents using semantic search
export async function searchDocuments(
  query: string,
  options: SearchOptions = {}
): Promise<LegalDocument[]> {
  const {
    matchThreshold = 0.7,
    matchCount = 10,
    category,
  } = options;

  // Generate embedding for the query
  const queryEmbedding = await generateEmbedding(query);

  // Call the search function in Supabase
  const { data, error } = await supabase.rpc('search_legal_documents', {
    query_embedding: queryEmbedding,
    match_threshold: matchThreshold,
    match_count: matchCount,
    filter_category: category || null,
  });

  if (error) {
    throw new Error(`Search failed: ${error.message}`);
  }

  return data as LegalDocument[];
}

// Get context for RAG from search results
export async function getRAGContext(
  query: string,
  options: SearchOptions = {}
): Promise<string> {
  const documents = await searchDocuments(query, options);

  if (documents.length === 0) {
    return '';
  }

  // Format documents as context
  const context = documents
    .map((doc, index) => {
      const similarity = doc.similarity ? `(${(doc.similarity * 100).toFixed(1)}% relevância)` : '';
      return `[Documento ${index + 1}] ${doc.title} ${similarity}
Categoria: ${doc.category}${doc.subcategory ? ` > ${doc.subcategory}` : ''}
${doc.source ? `Fonte: ${doc.source}` : ''}

${doc.content}

---`;
    })
    .join('\n\n');

  return context;
}

// Delete a document from the index
export async function deleteDocument(id: string): Promise<void> {
  const { error } = await supabase
    .from('legal_documents')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete document: ${error.message}`);
  }
}

// Update a document and re-index
export async function updateDocument(
  id: string,
  updates: Partial<{
    title: string;
    content: string;
    category: string;
    subcategory: string;
    source: string;
    sourceUrl: string;
    metadata: Record<string, any>;
  }>
): Promise<void> {
  // If content or title changed, regenerate embedding
  if (updates.title || updates.content) {
    const { data: existing } = await supabase
      .from('legal_documents')
      .select('title, content')
      .eq('id', id)
      .single();

    if (existing) {
      const newTitle = updates.title || existing.title;
      const newContent = updates.content || existing.content;
      const embedding = await generateEmbedding(`${newTitle}\n\n${newContent}`);
      (updates as any).embedding = embedding;
    }
  }

  const { error } = await supabase
    .from('legal_documents')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to update document: ${error.message}`);
  }
}

// Get all categories
export async function getCategories(): Promise<string[]> {
  const { data, error } = await supabase
    .from('legal_documents')
    .select('category')
    .order('category');

  if (error) {
    throw new Error(`Failed to get categories: ${error.message}`);
  }

  // Get unique categories
  const categories = Array.from(new Set(data.map(d => d.category)));
  return categories;
}

// Get document count by category
export async function getDocumentStats(): Promise<Record<string, number>> {
  const { data, error } = await supabase
    .from('legal_documents')
    .select('category');

  if (error) {
    throw new Error(`Failed to get stats: ${error.message}`);
  }

  const stats: Record<string, number> = {};
  data.forEach(doc => {
    stats[doc.category] = (stats[doc.category] || 0) + 1;
  });

  return stats;
}

export default {
  indexDocument,
  batchIndexDocuments,
  searchDocuments,
  getRAGContext,
  deleteDocument,
  updateDocument,
  getCategories,
  getDocumentStats,
};
