#!/usr/bin/env python3
"""
Script para indexar documentos jurídicos na base RAG do Supabase.
Utiliza OpenAI para gerar embeddings e Supabase para armazenamento.
"""

import json
import os
import sys
from pathlib import Path
from typing import List, Dict, Any
from openai import OpenAI
from supabase import create_client, Client

# Configuração
SUPABASE_URL = os.environ.get('SUPABASE_URL')
SUPABASE_KEY = os.environ.get('SUPABASE_KEY')
OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')

# Inicializar clientes
openai_client = OpenAI(api_key=OPENAI_API_KEY)
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def generate_embedding(text: str) -> List[float]:
    """Gera embedding para o texto usando OpenAI."""
    response = openai_client.embeddings.create(
        model="text-embedding-3-small",
        input=text
    )
    return response.data[0].embedding

def index_document(doc: Dict[str, Any]) -> str:
    """Indexa um documento na base RAG."""
    # Combinar título e conteúdo para o embedding
    text_for_embedding = f"{doc['title']}\n\n{doc['content']}"
    
    # Gerar embedding
    embedding = generate_embedding(text_for_embedding)
    
    # Preparar dados para inserção
    data = {
        'title': doc['title'],
        'content': doc['content'],
        'category': doc['category'],
        'subcategory': doc.get('subcategory'),
        'source': doc.get('source'),
        'source_url': doc.get('source_url'),
        'embedding': embedding,
        'metadata': doc.get('metadata', {})
    }
    
    # Inserir no Supabase
    result = supabase.table('legal_documents').insert(data).execute()
    
    if result.data:
        return result.data[0]['id']
    else:
        raise Exception(f"Erro ao inserir documento: {doc['title']}")

def load_documents(file_path: str) -> List[Dict[str, Any]]:
    """Carrega documentos de um arquivo JSON."""
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def main():
    """Função principal para indexar todos os documentos."""
    # Diretório de dados
    data_dir = Path(__file__).parent.parent / 'data'
    
    # Arquivos para indexar
    files = [
        'legislacao_civil.json',
        'jurisprudencia_civil.json'
    ]
    
    total_indexed = 0
    errors = []
    
    for file_name in files:
        file_path = data_dir / file_name
        
        if not file_path.exists():
            print(f"⚠️  Arquivo não encontrado: {file_path}")
            continue
        
        print(f"\n📂 Processando: {file_name}")
        documents = load_documents(str(file_path))
        
        for i, doc in enumerate(documents, 1):
            try:
                doc_id = index_document(doc)
                print(f"  ✅ [{i}/{len(documents)}] {doc['title'][:60]}...")
                total_indexed += 1
            except Exception as e:
                error_msg = f"Erro em '{doc['title']}': {str(e)}"
                print(f"  ❌ [{i}/{len(documents)}] {error_msg}")
                errors.append(error_msg)
    
    # Resumo
    print(f"\n{'='*60}")
    print(f"📊 RESUMO DA INDEXAÇÃO")
    print(f"{'='*60}")
    print(f"✅ Documentos indexados: {total_indexed}")
    print(f"❌ Erros: {len(errors)}")
    
    if errors:
        print(f"\n⚠️  Erros encontrados:")
        for error in errors:
            print(f"   - {error}")
    
    return total_indexed, len(errors)

if __name__ == '__main__':
    if not all([SUPABASE_URL, SUPABASE_KEY, OPENAI_API_KEY]):
        print("❌ Erro: Variáveis de ambiente não configuradas.")
        print("   Necessário: SUPABASE_URL, SUPABASE_KEY, OPENAI_API_KEY")
        sys.exit(1)
    
    main()
