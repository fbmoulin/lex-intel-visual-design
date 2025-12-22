# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [1.1.0] - 2025-12-20

### 🚀 Nova Versão com IA e RAG

Esta versão traz funcionalidades avançadas de Inteligência Artificial e busca semântica, elevando o Lex Intel ao estado da arte em Legal Tech.

### ✨ Funcionalidades Adicionadas

#### Assistente Jurídico com IA
- **Chat com IA Jurídica** integrado com Gemini 2.0 Flash
- Streaming de respostas em tempo real
- Sugestões rápidas de perguntas jurídicas
- Filtro por área do direito (Civil, Trabalhista, Criminal, Tributário, Consumidor)
- Interface moderna com formatação Markdown

#### Sistema RAG (Retrieval-Augmented Generation)
- **Busca Semântica** com pgvector no Supabase
- **Busca Híbrida** combinando semântica (60%) e léxica (40%)
- Embeddings gerados com Google Gemini `text-embedding-004`
- Índice HNSW para busca vetorial de alta performance
- Função `hybrid_search_legal_documents` otimizada via testes A/B
- **35 documentos jurídicos indexados** (legislação e jurisprudência cível)

#### Novos Templates de Petições
- **13 novos templates** adicionados (7 modernos + 6 clássicos)
- Templates Modernos com Visual Law (ícones, linhas, marcadores visuais)
- Templates Clássicos com linguagem formal elegante
- Badges de estilo na página de templates
- **Total: 39 templates disponíveis**

#### Templates Judiciais (Área Admin)
- **9 templates de decisões judiciais** para testes
- Decisões Interlocutórias e Despachos
- Mandados (Busca e Apreensão, Reintegração de Posse, Despejo)
- Ofícios Judiciais
- Sentenças Cíveis
- Área admin em `/admin/judicial`

#### Serviços de IA Avançados
- **Query Expansion** - Expande queries com sinônimos jurídicos
- **Reranking** - Reordena resultados por relevância usando LLM
- **CRAG** - Corrective RAG para validação de contexto
- **Grounding** - Respostas com citações obrigatórias das fontes

### 🔧 Melhorias Técnicas

#### Otimizações de RAG
- Pesos otimizados via testes A/B (semantic: 0.60, lexical: 0.40)
- Recall@5 de 100% nos testes
- MRR de 0.963
- Latência P95 de 452ms

#### Novas APIs
- `POST /api/ai/chat` - Chat com RAG
- `POST /api/ai/chat/stream` - Chat com streaming
- `POST /api/ai/analyze` - Análise de documentos
- `POST /api/ai/petition/suggestions` - Sugestões de petição
- `POST /api/ai/rag/search` - Busca semântica
- `POST /api/rag/advanced/search` - Busca avançada com todas as otimizações

#### Banco de Dados
- Extensão `pgvector` habilitada
- Extensão `pg_trgm` para busca léxica
- Tabela `legal_documents` com embeddings (768 dimensões)
- Tabela `ai_conversations` para histórico
- Índices HNSW e GIN trigram

### 📚 Documentação

#### Novos Documentos
- `RESEARCH_2025_CONSOLIDATED.md` - Pesquisa de tendências 2025
- `ROADMAP_2025_STATE_OF_THE_ART.md` - Roadmap atualizado
- `LANDING_PAGE_IMPROVEMENTS_2025.md` - Plano de melhorias UI/UX
- `SEO_COPYWRITING_DATA.md` - Dados para marketing
- `RAG_OPTIMIZATION_RESEARCH.md` - Técnicas de otimização RAG
- `AB_TEST_PLAN_HYBRID_SEARCH.md` - Plano de testes A/B
- `CHROME_EXTENSION_REQUIREMENTS.md` - Requisitos para extensão Chrome

#### Scripts
- `scripts/index_with_gemini.py` - Indexação de documentos
- `scripts/ab_test_hybrid_search.py` - Framework de testes A/B

### 📊 Métricas

- **Build Time:** 12.29s
- **Bundle Size:** ~3.1 MB (dist total)
- **Modules:** 3,047
- **Templates:** 39 petições + 9 judiciais
- **Documentos RAG:** 35 indexados
- **TypeScript:** 100% tipado

### 🎯 Próximas Funcionalidades (Roadmap)

- Integração com assinatura digital gov.br
- Integração com Jus.br (CNJ)
- Migração para Next.js 15
- Extensão Chrome
- Colaboração em tempo real
- Dashboard de BI jurídico

---

## [1.0.0-beta] - 2025-11-26

### 🎉 Lançamento Inicial (Beta)

Esta é a primeira versão beta do **Lex Intel Visual Design**, uma aplicação SaaS profissional para geração de petições jurídicas com Visual Law e Legal Design.

### ✨ Funcionalidades Adicionadas

#### Editor de Petições
- Editor interativo com preview em tempo real
- Formulário completo com campos para cabeçalho, partes, fatos, fundamentos e pedidos
- Salvamento automático de rascunhos
- Carregamento de petições salvas via URL

#### Templates Profissionais
- 8 templates pré-preenchidos baseados em pesquisa profunda
  - Ação de Cobrança (Civil)
  - Reclamação Trabalhista
  - Habeas Corpus (Criminal)
  - Mandado de Segurança (Tributária)
  - Ação de Indenização (Consumidor)
- Sistema de busca e filtros de templates
- Botão "Usar Template" para aplicação rápida

#### Componentes de Visual Law
- **Timeline:** Visualização cronológica de eventos processuais
- **Summary Card:** Cards de resumo executivo com ícones
- **Petition Chart:** Gráficos de dados usando Recharts

#### Sistema de Exportação Avançado
- Exportação para PDF com alta fidelidade visual
- Exportação para DOCX (Microsoft Word)
- Modal de configuração de exportação
- Personalização de cabeçalho (logo, texto do escritório)
- Personalização de rodapé (texto, numeração de páginas)
- Preview antes de exportar

#### Autenticação e Segurança
- Autenticação via Manus OAuth 2.0
- Security headers (CSP, HSTS, X-Frame-Options, etc.)
- Rate limiting para prevenir DoS
- CORS configurável por ambiente
- Validação de input com Zod
- Proteção contra SQL Injection (Drizzle ORM)

#### Banco de Dados
- PostgreSQL com Drizzle ORM
- Schema completo para petições
- Migrações automatizadas
- CRUD completo com 7 testes unitários

#### Interface
- Design System completo baseado em Shadcn/UI
- Paleta azul/âmbar profissional
- Modo escuro configurável
- Responsivo para desktop e mobile
- Página "Minhas Petições" com busca e filtros

### 🚀 Deploy e Infraestrutura

#### Otimizações de Build
- Code splitting manual (11 chunks)
- Lazy loading de componentes
- Bundle size reduzido em 80% (3 MB → 610 KB gzip)
- Asset optimization (images, fonts)
- Minificação e compressão

#### Docker
- Dockerfile otimizado com multi-stage build
- Non-root user para segurança
- Health check integrado
- Imagem final de ~150 MB

#### CI/CD
- GitHub Actions para testes e build
- Workflow de CI com TypeScript check e testes
- Workflow de release automatizado
- Dependabot configurado para atualizações

### 📊 Métricas

- **Build Time:** 11.89s
- **Bundle Size:** ~610 KB (gzip)
- **Modules:** 2,648
- **Tests:** 7/7 passando
- **TypeScript:** 100% tipado

---

**Desenvolvido por Lex Intelligentia** - Transformando a advocacia através da tecnologia.

[1.1.0]: https://github.com/fbmoulin/lex-intel-visual-design/compare/v1.0.0-beta...v1.1.0
[1.0.0-beta]: https://github.com/fbmoulin/lex-intel-visual-design/releases/tag/v1.0.0-beta
