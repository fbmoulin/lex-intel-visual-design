# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [1.2.0-beta] - 2025-11-29

### 📊 Observabilidade (Phase 2 - Enterprise Monitoring)

#### Request Tracing com Correlation IDs
- Geração automática de correlation IDs únicos por request
- Propagação via header `X-Correlation-ID` para requests encadeados
- Logging estruturado com correlation ID em todos os níveis
- Formato timestamp+random para IDs ordenáveis e únicos

#### Prometheus Metrics Endpoint (/metrics)
- `http_requests_total`: Contador por método, path e status
- `http_request_duration_ms`: Latência com percentis p50/p90/p99
- `nodejs_memory_usage_bytes`: Uso de memória (heap, rss, external)
- `nodejs_uptime_seconds`: Tempo de atividade do processo
- `rate_limit_store_size`: Tamanho do store de rate limiting
- `csrf_token_store_size`: Tamanho do store de tokens CSRF
- Normalização de paths dinâmicos (IDs, UUIDs)

#### Redis-Ready Rate Limiting
- Nova abstração `RateLimitStore` com múltiplos backends
- `InMemoryRateLimitStore` para single-instance deployments
- `RedisRateLimitStore` para deployments distribuídos
- Suporte a `REDIS_URL` para habilitação automática de Redis
- Operações atômicas via Lua script no Redis
- Fallback automático para in-memory se Redis indisponível
- Comportamento fail-open em caso de erros

### 🔒 Segurança (Phase 1 - Security Hardening)

#### CSRF Protection
- Implementação de proteção CSRF com padrão Double Submit Cookie
- Geração segura de tokens usando `crypto.randomBytes`
- Validação de Origin/Referer headers
- Endpoint `/api/csrf-token` para obtenção de tokens
- Compatibilidade com autenticação baseada em sessão tRPC
- Limpeza automática de tokens expirados

#### Rate Limiting Melhorado
- Proteção contra memory leak com limite de IPs
- Eviction de entradas antigas quando store está cheio
- Headers informativos (X-RateLimit-Limit, X-RateLimit-Remaining)
- Configuração via variáveis de ambiente

### ⚡ Performance (Phase 1 - Database Optimization)

#### Indexes de Banco de Dados
- `idx_petitions_user_id` - Busca por usuário
- `idx_petitions_status` - Filtro por status
- `idx_petitions_template_type` - Filtro por tipo de template
- `idx_petitions_user_status` - Busca composta (usuário + status)
- `idx_petitions_updated_at` - Ordenação por data

#### Paginação Cursor-Based
- Nova função `getUserPetitionsPaginated()` com cursor-based pagination
- Projeção de campos para excluir textos grandes na listagem
- Contagem eficiente com `countUserPetitions()`
- Suporte a filtros opcionais (status, templateType)
- Limite máximo de 100 itens por página

#### Novos Endpoints tRPC
- `petitions.listPaginated` - Lista paginada com cursor
- `petitions.count` - Contagem com filtros

### 📊 Observabilidade

#### Structured Logging com Pino
- Migração para Pino (10x mais rápido que console.log)
- Pretty print colorizado para desenvolvimento
- JSON estruturado para produção
- Middleware de logging HTTP
- Suporte a LOG_LEVEL via ambiente
- Child loggers com contexto

### 📦 Dependências

- Adicionado: `pino`, `pino-pretty`

### 📚 Documentação

- Novo: `docs/STRATEGIC_ROADMAP.md` com plano enterprise completo
- 4 fases de implementação detalhadas
- Cobertura de segurança, performance, escalabilidade e compliance LGPD

---

## [1.1.0-beta] - 2025-11-28

### ✨ Novidades

#### Migração para Supabase
- Migração completa do banco de dados de MySQL para PostgreSQL/Supabase
- Novo cliente Supabase para integração direta
- Driver postgres-js para melhor compatibilidade com pooling
- Conexão com retry e exponential backoff

#### Expansão de Templates (8 → 26)
- **Civil (5):** Cobrança, Indenização, Busca e Apreensão, Execução de Título Extrajudicial, Cumprimento de Sentença
- **Trabalhista (2):** Rescisão Indireta, Horas Extras
- **Criminal (4):** Queixa-crime, Defesa Preliminar, Revogação de Preventiva, Habeas Corpus
- **Tributário (2):** Restituição de Indébito, Anulatória de Débito Fiscal
- **Consumidor (3):** Vício de Produto, Cobrança Indevida, Negativação Indevida
- **Família (4):** Divórcio Consensual, Alimentos, Guarda Compartilhada, Inventário
- **Empresarial (2):** Recuperação Judicial, Dissolução Parcial de Sociedade
- **Administrativo (2):** Mandado de Segurança, Anulatória de Ato Administrativo
- **Previdenciário (3):** Aposentadoria, Auxílio-doença, BPC/LOAS
- **Ambiental (2):** Ação Civil Pública, Embargo de Obra Irregular

### 🔧 Melhorias

- Atualização do Vite e Vitest para corrigir vulnerabilidades de segurança
- Centralização de constantes em `shared/const.ts`
- Melhoria nos testes para ambiente sem banco de dados
- Drizzle relations adicionadas para users/petitions

### 🐛 Correções

- Correções de tipo para testes e validação
- Remoção de dependência mysql2 (não mais necessária)

### 📦 Dependências

- Adicionado: `@supabase/supabase-js`, `postgres`
- Removido: `mysql2`
- Atualizado: `vite@7.x`, `vitest@4.x`

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

#### Documentação
- README.md completo com badges
- Guia de Deploy detalhado
- Guia de Segurança
- Guia de Monitoramento
- Guia de Contribuição
- Código de Conduta
- Templates de issues e PRs

### 🔧 Configurações

- `.env.example` com todas as variáveis
- `.gitignore` e `.npmignore` configurados
- `.dockerignore` para otimização
- `railway.json` para deploy no Railway
- Scripts de deploy automatizados

### 📊 Métricas

- **Build Time:** 11.89s
- **Bundle Size:** ~610 KB (gzip)
- **Modules:** 2,648
- **Tests:** 7/7 passando
- **TypeScript:** 100% tipado

### ⚠️ Limitações Conhecidas (Beta)

- Exportação DOCX não preserva 100% dos estilos visuais
- Timeline limitada a eventos pré-definidos (sem editor interativo)
- Sem suporte para múltiplos idiomas
- Sem integração com outros apps do ecossistema Lex Intelligentia (planejado)

### 🎯 Próximas Funcionalidades (Roadmap)

- Editor de timeline interativo
- Assinatura digital integrada
- Exportação em lote
- Templates customizáveis pelo usuário
- Integração com outros apps Lex Intelligentia
- Suporte a múltiplos idiomas
- Modo offline
- Aplicativo mobile

### 🐛 Bugs Conhecidos

Nenhum bug crítico conhecido no momento. Reporte bugs em: https://github.com/fbmoulin/lex-intel-visual-design/issues

### 📚 Documentação

- Documentação completa disponível em `/docs`
- Guia de início rápido no README.md
- Exemplos de uso nos templates

### 🙏 Agradecimentos

- Stanford Legal Design Lab - Inspiração e pesquisa sobre Visual Law
- Shadcn/UI - Componentes UI de alta qualidade
- Recharts - Biblioteca de gráficos
- tRPC - Type-safe API
- Drizzle ORM - ORM moderno para PostgreSQL

---

**Desenvolvido por Lex Intelligentia** - Transformando a advocacia através da tecnologia.

[1.2.0-beta]: https://github.com/fbmoulin/lex-intel-visual-design/releases/tag/v1.2.0-beta
[1.1.0-beta]: https://github.com/fbmoulin/lex-intel-visual-design/releases/tag/v1.1.0-beta
[1.0.0-beta]: https://github.com/fbmoulin/lex-intel-visual-design/releases/tag/v1.0.0-beta
