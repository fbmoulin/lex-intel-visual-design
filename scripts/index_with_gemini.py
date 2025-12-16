#!/usr/bin/env python3
"""
Script para indexar documentos jurídicos na base RAG do Supabase.
Utiliza Google Gemini para gerar embeddings e MCP para inserção.
"""

import json
import os
import subprocess
from pathlib import Path
from typing import List, Dict, Any
from google import genai

# Configuração
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')
PROJECT_ID = "nznbgenamiygvbbawcsk"

# Inicializar cliente Gemini
client = genai.Client(api_key=GEMINI_API_KEY)

def generate_embedding(text: str) -> List[float]:
    """Gera embedding para o texto usando Google Gemini."""
    result = client.models.embed_content(
        model='text-embedding-004',
        contents=text
    )
    return result.embeddings[0].values

def escape_sql_string(s: str) -> str:
    """Escapa string para SQL."""
    if s is None:
        return "NULL"
    # Escapar aspas simples e barras invertidas
    escaped = s.replace("\\", "\\\\").replace("'", "''")
    return "'" + escaped + "'"

def execute_sql_via_mcp(sql: str) -> bool:
    """Executa SQL via MCP."""
    input_data = {
        "project_id": PROJECT_ID,
        "query": sql
    }
    
    cmd = [
        'manus-mcp-cli', 'tool', 'call', 'execute_sql',
        '--server', 'supabase',
        '--input', json.dumps(input_data)
    ]
    
    result = subprocess.run(cmd, capture_output=True, text=True)
    
    if result.returncode != 0 or 'error' in result.stdout.lower():
        print(f"    SQL Error: {result.stdout[:200]}")
        return False
    
    return True

def index_document(doc: Dict[str, Any]) -> bool:
    """Indexa um documento na base RAG via SQL."""
    # Combinar título e conteúdo para o embedding
    text_for_embedding = f"{doc['title']}\n\n{doc['content']}"
    
    # Gerar embedding
    embedding = generate_embedding(text_for_embedding)
    embedding_str = '[' + ','.join(str(x) for x in embedding) + ']'
    
    # Construir SQL
    sql = f"""
    INSERT INTO legal_documents (title, content, category, subcategory, source, source_url, embedding, metadata)
    VALUES (
        {escape_sql_string(doc['title'])},
        {escape_sql_string(doc['content'])},
        {escape_sql_string(doc['category'])},
        {escape_sql_string(doc.get('subcategory'))},
        {escape_sql_string(doc.get('source'))},
        {escape_sql_string(doc.get('source_url'))},
        '{embedding_str}'::vector,
        '{{}}'::jsonb
    );
    """
    
    return execute_sql_via_mcp(sql)

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
                success = index_document(doc)
                if success:
                    print(f"  ✅ [{i}/{len(documents)}] {doc['title'][:60]}...")
                    total_indexed += 1
                else:
                    raise Exception("SQL execution failed")
            except Exception as e:
                error_msg = f"Erro em '{doc['title'][:40]}': {str(e)[:50]}"
                print(f"  ❌ [{i}/{len(documents)}] {error_msg}")
                errors.append(error_msg)
    
    # Resumo
    print(f"\n{'='*60}")
    print(f"📊 RESUMO DA INDEXAÇÃO")
    print(f"{'='*60}")
    print(f"✅ Documentos indexados: {total_indexed}")
    print(f"❌ Erros: {len(errors)}")
    
    return total_indexed, len(errors)

if __name__ == '__main__':
    if not GEMINI_API_KEY:
        print("❌ Erro: GEMINI_API_KEY não configurada.")
        exit(1)
    
    main()
