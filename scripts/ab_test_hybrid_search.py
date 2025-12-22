#!/usr/bin/env python3
"""
Script de Testes A/B para Otimização da Busca Híbrida
=====================================================

Este script executa testes offline para determinar a melhor combinação
de pesos semantic_weight e lexical_weight na função hybrid_search_legal_documents.

Uso:
    python3 scripts/ab_test_hybrid_search.py

Saída:
    - Relatório de métricas por configuração
    - Análise por categoria de query
    - Recomendação de configuração ótima
"""

import json
import os
import subprocess
import time
import re
import glob
from dataclasses import dataclass, field
from typing import List, Dict, Tuple
from datetime import datetime
import statistics

# Importar cliente Gemini para embeddings
try:
    from google import genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False
    print("⚠️ google-genai não disponível. Instale com: pip install google-genai")


@dataclass
class TestConfig:
    """Configuração de teste"""
    name: str
    semantic_weight: float
    lexical_weight: float
    description: str = ""


@dataclass
class QueryResult:
    """Resultado de uma query"""
    query_id: str
    query_text: str
    category: str
    config_name: str
    results: List[Dict]
    expected_docs: List[str]
    latency_ms: float
    recall_at_5: float = 0.0
    recall_at_10: float = 0.0
    mrr: float = 0.0
    precision_at_3: float = 0.0
    ndcg_at_10: float = 0.0


@dataclass
class ConfigSummary:
    """Resumo de métricas por configuração"""
    config_name: str
    semantic_weight: float
    lexical_weight: float
    avg_recall_5: float = 0.0
    avg_recall_10: float = 0.0
    avg_mrr: float = 0.0
    avg_precision_3: float = 0.0
    avg_ndcg_10: float = 0.0
    avg_latency_ms: float = 0.0
    p95_latency_ms: float = 0.0
    total_queries: int = 0
    category_breakdown: Dict[str, Dict] = field(default_factory=dict)


# Configurações a testar
CONFIGS = [
    TestConfig("A_baseline", 0.70, 0.30, "Configuração atual (baseline)"),
    TestConfig("B_semantic_high", 0.80, 0.20, "Prioriza busca semântica"),
    TestConfig("C_balanced_60_40", 0.60, 0.40, "Mais equilibrado"),
    TestConfig("D_equal", 0.50, 0.50, "Totalmente equilibrado"),
    TestConfig("E_slight_adjust", 0.65, 0.35, "Leve ajuste do baseline"),
    TestConfig("F_semantic_mid", 0.75, 0.25, "Semântico médio-alto"),
    TestConfig("G_lexical_high", 0.55, 0.45, "Prioriza busca léxica"),
]


class HybridSearchTester:
    """Classe para executar testes A/B da busca híbrida"""
    
    def __init__(self, project_id: str = "nznbgenamiygvbbawcsk"):
        self.project_id = project_id
        self.gemini_client = None
        self.mcp_results_dir = '/home/ubuntu/.mcp/tool-results/'
        if GEMINI_AVAILABLE:
            api_key = os.environ.get('GEMINI_API_KEY')
            if api_key:
                self.gemini_client = genai.Client(api_key=api_key)
    
    def generate_embedding(self, text: str) -> List[float]:
        """Gera embedding usando Gemini"""
        if not self.gemini_client:
            raise RuntimeError("Cliente Gemini não inicializado")
        
        result = self.gemini_client.models.embed_content(
            model='text-embedding-004',
            contents=text
        )
        return result.embeddings[0].values
    
    def parse_mcp_result(self) -> List[Dict]:
        """Lê o resultado mais recente do MCP do arquivo"""
        files = sorted(glob.glob(self.mcp_results_dir + '*_supabase_execute_sql.json'), reverse=True)
        if not files:
            return []
        
        try:
            with open(files[0], 'r') as f:
                content = f.read()
            
            # O arquivo contém uma string JSON que precisa ser parseada duas vezes
            # Primeiro parse: extrair a string interna
            outer_json = json.loads(content)
            
            # Se for string, extrair o array JSON interno
            if isinstance(outer_json, str):
                # Encontrar o array JSON dentro da string
                match = re.search(r'\[\{.*\}\]', outer_json, re.DOTALL)
                if match:
                    return json.loads(match.group())
            elif isinstance(outer_json, list):
                return outer_json
        except Exception as e:
            print(f"    ⚠️ Erro ao parsear resultado: {e}")
        
        return []
    
    def execute_hybrid_search(
        self,
        query: str,
        semantic_weight: float,
        lexical_weight: float,
        limit: int = 10
    ) -> Tuple[List[Dict], float]:
        """Executa busca híbrida e retorna resultados com latência"""
        
        start_time = time.time()
        
        # Gerar embedding
        embedding = self.generate_embedding(query)
        embedding_str = '[' + ','.join(str(x) for x in embedding) + ']'
        
        # Escapar aspas simples na query
        escaped_query = query.replace("'", "''")
        
        # Montar SQL
        sql = f"""
        SELECT * FROM hybrid_search_legal_documents(
            '{escaped_query}',
            '{embedding_str}'::vector,
            {limit},
            {semantic_weight},
            {lexical_weight},
            NULL
        );
        """
        
        # Executar via MCP
        input_data = {
            "project_id": self.project_id,
            "query": sql
        }
        
        cmd = [
            'manus-mcp-cli', 'tool', 'call', 'execute_sql',
            '--server', 'supabase',
            '--input', json.dumps(input_data)
        ]
        
        subprocess.run(cmd, capture_output=True, text=True)
        latency_ms = (time.time() - start_time) * 1000
        
        # Parse resultados do arquivo
        results = self.parse_mcp_result()
        
        return results, latency_ms
    
    @staticmethod
    def normalize_title(title: str) -> str:
        """Normaliza título para comparação"""
        # Remove acentos e converte para minúsculas
        import unicodedata
        normalized = unicodedata.normalize('NFKD', title.lower())
        normalized = ''.join(c for c in normalized if not unicodedata.combining(c))
        # Remove caracteres especiais
        normalized = re.sub(r'[^\w\s]', ' ', normalized)
        # Remove espaços extras
        normalized = ' '.join(normalized.split())
        return normalized
    
    @staticmethod
    def titles_match(title1: str, title2: str) -> bool:
        """Verifica se dois títulos são equivalentes"""
        norm1 = HybridSearchTester.normalize_title(title1)
        norm2 = HybridSearchTester.normalize_title(title2)
        
        # Match exato
        if norm1 == norm2:
            return True
        
        # Um contém o outro
        if norm1 in norm2 or norm2 in norm1:
            return True
        
        # Palavras-chave em comum (pelo menos 3 palavras significativas)
        words1 = set(w for w in norm1.split() if len(w) > 3)
        words2 = set(w for w in norm2.split() if len(w) > 3)
        common = words1 & words2
        
        if len(common) >= 3:
            return True
        
        # Verificar termos específicos (números de lei, temas, etc.)
        patterns = [
            r'tema\s*\d+',
            r'sumula\s*\d+',
            r'lei\s*n?o?\s*[\d.]+',
            r'art\s*\d+',
        ]
        
        for pattern in patterns:
            match1 = re.search(pattern, norm1)
            match2 = re.search(pattern, norm2)
            if match1 and match2 and match1.group() == match2.group():
                return True
        
        return False
    
    def calculate_recall_at_k(self, results: List[Dict], expected: List[str], k: int) -> float:
        """Calcula Recall@K"""
        if not expected:
            return 0.0
        
        result_titles = [r.get('title', '') for r in results[:k]]
        
        found = 0
        for exp in expected:
            for title in result_titles:
                if self.titles_match(exp, title):
                    found += 1
                    break
        
        return found / len(expected)
    
    def calculate_mrr(self, results: List[Dict], expected: List[str]) -> float:
        """Calcula Mean Reciprocal Rank"""
        for i, result in enumerate(results):
            title = result.get('title', '')
            for exp in expected:
                if self.titles_match(exp, title):
                    return 1.0 / (i + 1)
        return 0.0
    
    def calculate_precision_at_k(self, results: List[Dict], expected: List[str], k: int) -> float:
        """Calcula Precision@K"""
        if not results[:k]:
            return 0.0
        
        relevant = 0
        for result in results[:k]:
            title = result.get('title', '')
            for exp in expected:
                if self.titles_match(exp, title):
                    relevant += 1
                    break
        
        return relevant / min(k, len(results))
    
    @staticmethod
    def calculate_ndcg_at_k(results: List[Dict], expected: List[str], k: int) -> float:
        """Calcula NDCG@K (Normalized Discounted Cumulative Gain)"""
        import math
        
        def dcg(relevances: List[int], k: int) -> float:
            return sum(rel / math.log2(i + 2) for i, rel in enumerate(relevances[:k]))
        
        # Calcular relevâncias
        relevances = []
        for result in results[:k]:
            title = result.get('title', '')
            is_relevant = 0
            for exp in expected:
                if HybridSearchTester.titles_match(exp, title):
                    is_relevant = 1
                    break
            relevances.append(is_relevant)
        
        dcg_real = dcg(relevances, k)
        ideal_relevances = sorted(relevances, reverse=True)
        dcg_ideal = dcg(ideal_relevances, k)
        
        if dcg_ideal == 0:
            return 0.0
        
        return dcg_real / dcg_ideal
    
    def run_single_test(
        self,
        query_data: Dict,
        config: TestConfig
    ) -> QueryResult:
        """Executa teste para uma query com uma configuração"""
        
        results, latency = self.execute_hybrid_search(
            query_data['query'],
            config.semantic_weight,
            config.lexical_weight
        )
        
        expected = query_data.get('expected_docs', [])
        
        return QueryResult(
            query_id=query_data['id'],
            query_text=query_data['query'],
            category=query_data.get('category', 'unknown'),
            config_name=config.name,
            results=results,
            expected_docs=expected,
            latency_ms=latency,
            recall_at_5=self.calculate_recall_at_k(results, expected, 5),
            recall_at_10=self.calculate_recall_at_k(results, expected, 10),
            mrr=self.calculate_mrr(results, expected),
            precision_at_3=self.calculate_precision_at_k(results, expected, 3),
            ndcg_at_10=self.calculate_ndcg_at_k(results, expected, 10)
        )
    
    def run_all_tests(self, queries: List[Dict]) -> Dict[str, ConfigSummary]:
        """Executa todos os testes e retorna resumo por configuração"""
        
        summaries = {}
        
        for config in CONFIGS:
            print(f"\n🔄 Testando configuração: {config.name} ({config.semantic_weight}/{config.lexical_weight})")
            
            results = []
            category_results = {}
            
            for i, query in enumerate(queries):
                print(f"  Query {i+1}/{len(queries)}: {query['query'][:50]}...")
                
                try:
                    result = self.run_single_test(query, config)
                    results.append(result)
                    
                    # Debug: mostrar métricas
                    if result.recall_at_5 > 0 or result.mrr > 0:
                        print(f"    ✅ Recall@5={result.recall_at_5:.1%}, MRR={result.mrr:.3f}")
                    
                    # Agrupar por categoria
                    cat = result.category
                    if cat not in category_results:
                        category_results[cat] = []
                    category_results[cat].append(result)
                    
                except Exception as e:
                    print(f"    ⚠️ Erro: {e}")
                
                # Pequena pausa para não sobrecarregar API
                time.sleep(0.3)
            
            # Calcular métricas agregadas
            if results:
                latencies = [r.latency_ms for r in results]
                
                summary = ConfigSummary(
                    config_name=config.name,
                    semantic_weight=config.semantic_weight,
                    lexical_weight=config.lexical_weight,
                    avg_recall_5=statistics.mean(r.recall_at_5 for r in results),
                    avg_recall_10=statistics.mean(r.recall_at_10 for r in results),
                    avg_mrr=statistics.mean(r.mrr for r in results),
                    avg_precision_3=statistics.mean(r.precision_at_3 for r in results),
                    avg_ndcg_10=statistics.mean(r.ndcg_at_10 for r in results),
                    avg_latency_ms=statistics.mean(latencies),
                    p95_latency_ms=sorted(latencies)[int(len(latencies) * 0.95)] if latencies else 0,
                    total_queries=len(results)
                )
                
                # Breakdown por categoria
                for cat, cat_results in category_results.items():
                    summary.category_breakdown[cat] = {
                        'count': len(cat_results),
                        'avg_recall_5': statistics.mean(r.recall_at_5 for r in cat_results),
                        'avg_mrr': statistics.mean(r.mrr for r in cat_results),
                    }
                
                summaries[config.name] = summary
                
                # Mostrar resumo da config
                print(f"  📊 Resumo: Recall@5={summary.avg_recall_5:.1%}, MRR={summary.avg_mrr:.3f}, Latência={summary.avg_latency_ms:.0f}ms")
        
        return summaries
    
    @staticmethod
    def generate_report(summaries: Dict[str, ConfigSummary]) -> str:
        """Gera relatório de resultados"""
        
        report = []
        report.append("=" * 80)
        report.append("RELATÓRIO DE TESTES A/B - BUSCA HÍBRIDA")
        report.append(f"Data: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        report.append("=" * 80)
        
        # Tabela de resultados gerais
        report.append("\n📊 RESULTADOS GERAIS\n")
        report.append("-" * 80)
        report.append(f"{'Config':<20} {'Sem/Lex':<10} {'Recall@5':<10} {'MRR':<10} {'NDCG@10':<10} {'P95 (ms)':<10}")
        report.append("-" * 80)
        
        # Ordenar por MRR
        sorted_summaries = sorted(summaries.values(), key=lambda x: x.avg_mrr, reverse=True)
        
        for s in sorted_summaries:
            report.append(
                f"{s.config_name:<20} "
                f"{s.semantic_weight:.2f}/{s.lexical_weight:.2f}  "
                f"{s.avg_recall_5:>7.1%}   "
                f"{s.avg_mrr:>7.3f}   "
                f"{s.avg_ndcg_10:>7.3f}   "
                f"{s.p95_latency_ms:>7.0f}"
            )
        
        report.append("-" * 80)
        
        # Análise por categoria
        report.append("\n📂 ANÁLISE POR CATEGORIA\n")
        
        categories = set()
        for s in summaries.values():
            categories.update(s.category_breakdown.keys())
        
        for cat in sorted(categories):
            report.append(f"\n  Categoria: {cat.upper()}")
            report.append(f"  {'Config':<20} {'Recall@5':<12} {'MRR':<12}")
            report.append("  " + "-" * 44)
            
            cat_data = []
            for s in summaries.values():
                if cat in s.category_breakdown:
                    cat_data.append((
                        s.config_name,
                        s.category_breakdown[cat]['avg_recall_5'],
                        s.category_breakdown[cat]['avg_mrr']
                    ))
            
            for name, recall, mrr in sorted(cat_data, key=lambda x: x[2], reverse=True):
                report.append(f"  {name:<20} {recall:>10.1%}   {mrr:>10.3f}")
        
        # Recomendação
        report.append("\n" + "=" * 80)
        report.append("🏆 RECOMENDAÇÃO")
        report.append("=" * 80)
        
        best = sorted_summaries[0]
        report.append(f"\nConfiguração recomendada: {best.config_name}")
        report.append(f"  - semantic_weight: {best.semantic_weight}")
        report.append(f"  - lexical_weight: {best.lexical_weight}")
        report.append(f"\nMétricas:")
        report.append(f"  - Recall@5: {best.avg_recall_5:.1%}")
        report.append(f"  - MRR: {best.avg_mrr:.3f}")
        report.append(f"  - NDCG@10: {best.avg_ndcg_10:.3f}")
        report.append(f"  - Latência P95: {best.p95_latency_ms:.0f}ms")
        
        # Comparação com baseline
        baseline = summaries.get('A_baseline')
        if baseline and best.config_name != 'A_baseline':
            report.append(f"\nComparação com baseline (A):")
            if baseline.avg_mrr > 0:
                mrr_diff = (best.avg_mrr - baseline.avg_mrr) / baseline.avg_mrr * 100
                report.append(f"  - MRR: {'+' if mrr_diff > 0 else ''}{mrr_diff:.1f}%")
            if baseline.avg_recall_5 > 0:
                recall_diff = (best.avg_recall_5 - baseline.avg_recall_5) / baseline.avg_recall_5 * 100
                report.append(f"  - Recall@5: {'+' if recall_diff > 0 else ''}{recall_diff:.1f}%")
        
        report.append("\n" + "=" * 80)
        
        return "\n".join(report)


def main():
    """Função principal"""
    
    print("🚀 Iniciando Testes A/B da Busca Híbrida")
    print("=" * 50)
    
    # Carregar queries de teste
    queries_file = os.path.join(
        os.path.dirname(__file__), 
        '..', 'data', 'test_queries_ab.json'
    )
    
    if not os.path.exists(queries_file):
        print(f"❌ Arquivo de queries não encontrado: {queries_file}")
        return
    
    with open(queries_file) as f:
        data = json.load(f)
    
    queries = data['queries']
    print(f"📋 Carregadas {len(queries)} queries de teste")
    
    # Inicializar tester
    tester = HybridSearchTester()
    
    # Executar testes
    print("\n🔬 Executando testes...")
    summaries = tester.run_all_tests(queries)
    
    # Gerar relatório
    report = tester.generate_report(summaries)
    print("\n" + report)
    
    # Salvar relatório
    report_file = os.path.join(
        os.path.dirname(__file__),
        '..', 'docs', f'AB_TEST_RESULTS_{datetime.now().strftime("%Y%m%d_%H%M%S")}.txt'
    )
    
    with open(report_file, 'w') as f:
        f.write(report)
    
    print(f"\n📄 Relatório salvo em: {report_file}")
    
    # Salvar dados brutos em JSON
    results_json = os.path.join(
        os.path.dirname(__file__),
        '..', 'data', f'ab_test_results_{datetime.now().strftime("%Y%m%d_%H%M%S")}.json'
    )
    
    with open(results_json, 'w') as f:
        json.dump({
            'timestamp': datetime.now().isoformat(),
            'configs_tested': len(summaries),
            'queries_tested': len(queries),
            'summaries': {
                name: {
                    'semantic_weight': s.semantic_weight,
                    'lexical_weight': s.lexical_weight,
                    'avg_recall_5': s.avg_recall_5,
                    'avg_recall_10': s.avg_recall_10,
                    'avg_mrr': s.avg_mrr,
                    'avg_precision_3': s.avg_precision_3,
                    'avg_ndcg_10': s.avg_ndcg_10,
                    'avg_latency_ms': s.avg_latency_ms,
                    'p95_latency_ms': s.p95_latency_ms,
                    'category_breakdown': s.category_breakdown
                }
                for name, s in summaries.items()
            }
        }, f, indent=2)
    
    print(f"📊 Dados brutos salvos em: {results_json}")


if __name__ == "__main__":
    main()
