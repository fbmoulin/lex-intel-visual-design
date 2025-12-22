# Plano de Testes A/B - Otimização de Pesos da Busca Híbrida

## 1. Objetivo

Determinar a combinação ótima de `semantic_weight` e `lexical_weight` na função `hybrid_search_legal_documents` para maximizar a relevância dos resultados de busca no contexto jurídico brasileiro.

---

## 2. Hipóteses

### Hipótese Principal
> A combinação ideal de pesos varia conforme o tipo de query jurídica, mas existe uma configuração padrão que oferece o melhor desempenho geral.

### Hipóteses Secundárias
1. **Queries com termos técnicos** (artigos, súmulas, números de lei) se beneficiam de maior peso léxico
2. **Queries conceituais** (perguntas abertas sobre temas) se beneficiam de maior peso semântico
3. **Queries mistas** funcionam melhor com pesos equilibrados

---

## 3. Métricas de Avaliação

### 3.1 Métricas Primárias

| Métrica | Descrição | Fórmula | Meta |
|---------|-----------|---------|------|
| **Recall@5** | % de documentos relevantes nos top 5 | Relevantes@5 / Total Relevantes | ≥ 80% |
| **MRR** | Mean Reciprocal Rank | 1/n × Σ(1/rank_i) | ≥ 0.7 |
| **NDCG@10** | Normalized Discounted Cumulative Gain | DCG@10 / IDCG@10 | ≥ 0.75 |

### 3.2 Métricas Secundárias

| Métrica | Descrição | Meta |
|---------|-----------|------|
| **Precision@3** | Precisão nos top 3 resultados | ≥ 85% |
| **Latência P50** | Tempo de resposta mediano | ≤ 200ms |
| **Latência P95** | Tempo de resposta percentil 95 | ≤ 500ms |
| **Diversidade** | Cobertura de categorias nos resultados | ≥ 2 categorias |

### 3.3 Métricas de Negócio

| Métrica | Descrição | Medição |
|---------|-----------|---------|
| **CTR** | Click-through rate nos resultados | Cliques / Impressões |
| **Satisfação** | Avaliação do usuário (thumbs up/down) | % positivo |
| **Reformulação** | Taxa de queries reformuladas | % de retry |

---

## 4. Valores a Testar

### 4.1 Matriz de Configurações

| Config | semantic_weight | lexical_weight | Razão | Hipótese |
|--------|-----------------|----------------|-------|----------|
| **A (Baseline)** | 0.70 | 0.30 | 2.33:1 | Configuração atual |
| **B** | 0.80 | 0.20 | 4:1 | Prioriza semântico |
| **C** | 0.60 | 0.40 | 1.5:1 | Mais equilibrado |
| **D** | 0.50 | 0.50 | 1:1 | Totalmente equilibrado |
| **E** | 0.65 | 0.35 | 1.86:1 | Leve ajuste do baseline |
| **F** | 0.75 | 0.25 | 3:1 | Entre A e B |
| **G** | 0.55 | 0.45 | 1.22:1 | Prioriza léxico |

### 4.2 Valores Recomendados para Início

**Fase 1 - Exploração Ampla:**
```
Config A: 0.70 / 0.30 (baseline)
Config B: 0.80 / 0.20 (semântico forte)
Config D: 0.50 / 0.50 (equilibrado)
Config G: 0.55 / 0.45 (léxico forte)
```

**Fase 2 - Refinamento:**
Após identificar a faixa vencedora, testar variações de ±0.05

---

## 5. Dataset de Teste

### 5.1 Categorias de Queries

| Categoria | Descrição | Exemplos | Peso Esperado |
|-----------|-----------|----------|---------------|
| **Técnica** | Referências específicas | "Art. 62 Lei 8.245/91", "Súmula 596 STJ" | Léxico alto |
| **Conceitual** | Perguntas abertas | "O que é dano moral in re ipsa?" | Semântico alto |
| **Procedimental** | Como fazer | "Como ajuizar ação de despejo?" | Equilibrado |
| **Jurisprudencial** | Busca de precedentes | "Jurisprudência sobre negativação indevida" | Semântico alto |
| **Mista** | Combinação | "Requisitos do art. 59 para liminar de despejo" | Equilibrado |

### 5.2 Queries de Teste (Ground Truth)

```json
{
  "queries": [
    {
      "id": "Q001",
      "query": "requisitos para ação de despejo por falta de pagamento",
      "category": "procedimental",
      "expected_docs": ["Lei do Inquilinato - Despejo", "STJ Tema 1.002"],
      "relevant_terms": ["despejo", "falta de pagamento", "locação"]
    },
    {
      "id": "Q002",
      "query": "art. 62 lei 8.245",
      "category": "tecnica",
      "expected_docs": ["Lei do Inquilinato - Despejo"],
      "relevant_terms": ["art. 62", "8.245", "inquilinato"]
    },
    {
      "id": "Q003",
      "query": "dano moral por negativação indevida",
      "category": "conceitual",
      "expected_docs": ["STJ Tema 1.079", "Código Civil - Danos"],
      "relevant_terms": ["dano moral", "negativação", "cadastro"]
    },
    {
      "id": "Q004",
      "query": "prazo para purgação da mora na locação",
      "category": "procedimental",
      "expected_docs": ["STJ Tema 1.002", "Lei do Inquilinato"],
      "relevant_terms": ["purgação", "mora", "15 dias"]
    },
    {
      "id": "Q005",
      "query": "súmula 596 STJ atraso voo",
      "category": "tecnica",
      "expected_docs": ["STJ Súmula 596"],
      "relevant_terms": ["súmula 596", "atraso", "voo"]
    },
    {
      "id": "Q006",
      "query": "responsabilidade civil objetiva consumidor",
      "category": "conceitual",
      "expected_docs": ["CDC - Responsabilidade", "Código Civil"],
      "relevant_terms": ["responsabilidade", "objetiva", "consumidor"]
    },
    {
      "id": "Q007",
      "query": "tutela de urgência irreversibilidade",
      "category": "jurisprudencial",
      "expected_docs": ["STJ Tema 1.113", "CPC - Tutela"],
      "relevant_terms": ["tutela", "urgência", "irreversibilidade"]
    },
    {
      "id": "Q008",
      "query": "busca e apreensão alienação fiduciária mora",
      "category": "mista",
      "expected_docs": ["STJ Tema 1.124", "DL 911/69"],
      "relevant_terms": ["busca", "apreensão", "fiduciária", "mora"]
    },
    {
      "id": "Q009",
      "query": "prescrição intercorrente execução",
      "category": "procedimental",
      "expected_docs": ["STJ Tema 1.105", "CPC - Cumprimento"],
      "relevant_terms": ["prescrição", "intercorrente", "execução"]
    },
    {
      "id": "Q010",
      "query": "alimentos prisão civil três parcelas",
      "category": "jurisprudencial",
      "expected_docs": ["STJ Tema 1.086", "Código Civil - Alimentos"],
      "relevant_terms": ["alimentos", "prisão", "três parcelas"]
    }
  ]
}
```

---

## 6. Metodologia de Teste

### 6.1 Design Experimental

```
┌─────────────────────────────────────────────────────────┐
│                    FASE 1: OFFLINE                       │
│  Testar todas as configurações com dataset fixo          │
│  Métricas: Recall@5, MRR, NDCG@10, Latência             │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    FASE 2: ONLINE                        │
│  A/B test com usuários reais (top 2-3 configs)          │
│  Métricas: CTR, Satisfação, Reformulação                │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    FASE 3: REFINAMENTO                   │
│  Grid search fino na faixa vencedora                    │
│  Validação estatística (p < 0.05)                       │
└─────────────────────────────────────────────────────────┘
```

### 6.2 Protocolo de Teste Offline

1. **Preparação**
   - Carregar dataset de queries com ground truth
   - Configurar métricas de avaliação
   - Definir número de repetições (n=3 para estabilidade)

2. **Execução**
   - Para cada configuração (A-G):
     - Executar todas as queries do dataset
     - Registrar top-10 resultados
     - Calcular métricas
     - Medir latência

3. **Análise**
   - Comparar métricas entre configurações
   - Identificar top 3 configurações
   - Análise por categoria de query

### 6.3 Protocolo de Teste Online (A/B)

1. **Segmentação**
   - Dividir usuários aleatoriamente em grupos
   - Garantir distribuição uniforme por perfil

2. **Duração**
   - Mínimo: 2 semanas
   - Queries mínimas por grupo: 500

3. **Critérios de Parada**
   - Significância estatística atingida (p < 0.05)
   - Diferença mínima detectável: 5% em CTR

---

## 7. Implementação

### 7.1 Script de Teste Offline

```python
# /scripts/ab_test_hybrid_search.py

import json
import time
from typing import List, Dict
from dataclasses import dataclass

@dataclass
class TestConfig:
    name: str
    semantic_weight: float
    lexical_weight: float

@dataclass
class QueryResult:
    query_id: str
    config: str
    results: List[str]
    latency_ms: float
    recall_at_5: float
    mrr: float

CONFIGS = [
    TestConfig("A_baseline", 0.70, 0.30),
    TestConfig("B_semantic", 0.80, 0.20),
    TestConfig("C_balanced_high", 0.60, 0.40),
    TestConfig("D_equal", 0.50, 0.50),
    TestConfig("E_slight_adjust", 0.65, 0.35),
    TestConfig("F_semantic_mid", 0.75, 0.25),
    TestConfig("G_lexical", 0.55, 0.45),
]

def calculate_recall_at_k(results: List[str], expected: List[str], k: int = 5) -> float:
    """Calcula Recall@K"""
    top_k = set(results[:k])
    expected_set = set(expected)
    if not expected_set:
        return 0.0
    return len(top_k & expected_set) / len(expected_set)

def calculate_mrr(results: List[str], expected: List[str]) -> float:
    """Calcula Mean Reciprocal Rank"""
    for i, result in enumerate(results):
        if result in expected:
            return 1.0 / (i + 1)
    return 0.0

def run_test(config: TestConfig, queries: List[Dict]) -> List[QueryResult]:
    """Executa teste para uma configuração"""
    results = []
    for query in queries:
        start = time.time()
        # Executar busca híbrida com config
        search_results = hybrid_search(
            query["query"],
            semantic_weight=config.semantic_weight,
            lexical_weight=config.lexical_weight
        )
        latency = (time.time() - start) * 1000
        
        result_titles = [r["title"] for r in search_results]
        
        results.append(QueryResult(
            query_id=query["id"],
            config=config.name,
            results=result_titles,
            latency_ms=latency,
            recall_at_5=calculate_recall_at_k(result_titles, query["expected_docs"]),
            mrr=calculate_mrr(result_titles, query["expected_docs"])
        ))
    return results

def main():
    # Carregar queries
    with open("test_queries.json") as f:
        queries = json.load(f)["queries"]
    
    all_results = []
    for config in CONFIGS:
        print(f"Testando {config.name}...")
        results = run_test(config, queries)
        all_results.extend(results)
    
    # Agregar métricas por config
    summary = {}
    for config in CONFIGS:
        config_results = [r for r in all_results if r.config == config.name]
        summary[config.name] = {
            "avg_recall_5": sum(r.recall_at_5 for r in config_results) / len(config_results),
            "avg_mrr": sum(r.mrr for r in config_results) / len(config_results),
            "avg_latency": sum(r.latency_ms for r in config_results) / len(config_results),
        }
    
    # Exibir resultados
    print("\n=== RESULTADOS ===")
    for name, metrics in sorted(summary.items(), key=lambda x: -x[1]["avg_mrr"]):
        print(f"{name}: Recall@5={metrics['avg_recall_5']:.2%}, MRR={metrics['avg_mrr']:.3f}, Latency={metrics['avg_latency']:.0f}ms")

if __name__ == "__main__":
    main()
```

### 7.2 Tabela de Resultados (Template)

| Config | semantic | lexical | Recall@5 | MRR | NDCG@10 | P50 (ms) | P95 (ms) |
|--------|----------|---------|----------|-----|---------|----------|----------|
| A | 0.70 | 0.30 | - | - | - | - | - |
| B | 0.80 | 0.20 | - | - | - | - | - |
| C | 0.60 | 0.40 | - | - | - | - | - |
| D | 0.50 | 0.50 | - | - | - | - | - |
| E | 0.65 | 0.35 | - | - | - | - | - |
| F | 0.75 | 0.25 | - | - | - | - | - |
| G | 0.55 | 0.45 | - | - | - | - | - |

---

## 8. Análise por Categoria de Query

### 8.1 Expectativas

| Categoria | Melhor Config Esperada | Justificativa |
|-----------|------------------------|---------------|
| Técnica | G (0.55/0.45) | Termos exatos são cruciais |
| Conceitual | B (0.80/0.20) | Significado importa mais que palavras |
| Procedimental | E (0.65/0.35) | Equilíbrio entre conceito e termos |
| Jurisprudencial | B (0.80/0.20) | Busca por conceitos similares |
| Mista | A (0.70/0.30) | Baseline equilibrado |

### 8.2 Configuração Adaptativa (Futuro)

Após os testes, considerar implementar pesos dinâmicos:

```python
def get_adaptive_weights(query: str) -> tuple:
    """Determina pesos com base no tipo de query"""
    
    # Detectar tipo de query
    has_article = bool(re.search(r'art\.?\s*\d+', query, re.I))
    has_law_number = bool(re.search(r'lei\s*n?[º°]?\s*[\d.]+', query, re.I))
    has_sumula = bool(re.search(r's[úu]mula\s*\d+', query, re.I))
    
    # Queries técnicas: mais peso léxico
    if has_article or has_law_number or has_sumula:
        return (0.55, 0.45)
    
    # Queries conceituais: mais peso semântico
    question_words = ['o que', 'como', 'qual', 'quando', 'por que']
    if any(q in query.lower() for q in question_words):
        return (0.80, 0.20)
    
    # Default: baseline
    return (0.70, 0.30)
```

---

## 9. Cronograma

| Fase | Atividade | Duração | Responsável |
|------|-----------|---------|-------------|
| 1 | Preparar dataset de teste | 2 dias | Dev |
| 2 | Implementar framework de teste | 1 dia | Dev |
| 3 | Executar testes offline | 1 dia | Dev |
| 4 | Analisar resultados offline | 1 dia | Dev + PM |
| 5 | Configurar A/B online | 1 dia | Dev |
| 6 | Executar A/B online | 2 semanas | Auto |
| 7 | Analisar resultados finais | 2 dias | Dev + PM |
| 8 | Implementar config vencedora | 1 dia | Dev |

**Total estimado:** 3-4 semanas

---

## 10. Critérios de Sucesso

### 10.1 Mínimos
- [ ] Recall@5 ≥ 80%
- [ ] MRR ≥ 0.70
- [ ] Latência P95 ≤ 500ms

### 10.2 Desejáveis
- [ ] Recall@5 ≥ 90%
- [ ] MRR ≥ 0.80
- [ ] Melhoria de 10% em CTR vs baseline

### 10.3 Critérios de Rollback
- Degradação > 5% em qualquer métrica primária
- Aumento > 50% em latência P95
- Feedback negativo > 20% dos usuários

---

## 11. Recomendação Inicial

Com base na literatura e nas características do domínio jurídico brasileiro, recomendo iniciar os testes com:

### Configuração Inicial Recomendada
```
semantic_weight: 0.65
lexical_weight: 0.35
```

**Justificativa:**
1. Domínio jurídico tem muitos termos técnicos específicos (artigos, leis, súmulas)
2. Mas também requer compreensão semântica para conceitos
3. Valor ligeiramente mais equilibrado que o baseline (0.70/0.30)
4. Permite capturar melhor queries mistas

### Ordem de Prioridade para Testes
1. **E (0.65/0.35)** - Recomendação inicial
2. **A (0.70/0.30)** - Baseline para comparação
3. **C (0.60/0.40)** - Mais equilibrado
4. **G (0.55/0.45)** - Para queries técnicas

---

## Anexo A: Queries Adicionais para Expansão do Dataset

```json
{
  "additional_queries": [
    {"query": "honorários sucumbenciais cumprimento sentença", "category": "procedimental"},
    {"query": "inversão ônus prova CDC", "category": "conceitual"},
    {"query": "reintegração posse função social", "category": "jurisprudencial"},
    {"query": "art. 300 CPC tutela urgência", "category": "tecnica"},
    {"query": "vazamento dados LGPD indenização", "category": "conceitual"},
    {"query": "desconto folha alimentos 50%", "category": "jurisprudencial"},
    {"query": "cláusula abusiva contrato bancário", "category": "mista"},
    {"query": "juros mora responsabilidade contratual", "category": "jurisprudencial"},
    {"query": "notificação extrajudicial alienação fiduciária", "category": "procedimental"},
    {"query": "dano moral coletivo ação civil pública", "category": "conceitual"}
  ]
}
```
