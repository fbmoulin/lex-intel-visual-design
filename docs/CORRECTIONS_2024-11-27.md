# Correções de Segurança e Qualidade - 27/11/2024

**Projeto:** Lex Intel Visual Design
**Desenvolvido por:** Lex Intelligentia
**Versão:** 1.0.0-beta
**Data:** 27 de Novembro de 2024

---

## Resumo Executivo

Este documento registra as correções críticas aplicadas ao projeto após análise automatizada de código. Foram identificados e corrigidos 3 problemas prioritários relacionados a sintaxe, segurança e infraestrutura de CI/CD.

---

## Correção 1: Erro de Sintaxe em useAuth.ts

### Detalhes
| Campo | Valor |
|-------|-------|
| **Arquivo** | `client/src/_core/hooks/useAuth.ts` |
| **Linha** | 70 |
| **Severidade** | Crítica |
| **Tipo** | Erro de Sintaxe |

### Problema
Faltava ponto e vírgula após atribuição, o que poderia causar problemas de ASI (Automatic Semicolon Insertion) em determinados contextos de minificação ou bundling.

### Código Anterior
```typescript
window.location.href = redirectPath
```

### Código Corrigido
```typescript
window.location.href = redirectPath;
```

### Impacto
- Previne erros de parsing em builds de produção
- Garante consistência com o restante do código
- Elimina dependência do comportamento de ASI do JavaScript

---

## Correção 2: Hardening do Content Security Policy (CSP)

### Detalhes
| Campo | Valor |
|-------|-------|
| **Arquivo** | `server/_core/security.ts` |
| **Linhas** | 14-55 |
| **Severidade** | Crítica |
| **Tipo** | Vulnerabilidade de Segurança |

### Problema
O CSP original utilizava diretivas permissivas que aumentavam significativamente o risco de XSS:
- `'unsafe-eval'` permitia execução de `eval()` e `new Function()`
- Sem diferenciação entre ambientes de desenvolvimento e produção
- Faltavam diretivas de proteção contra clickjacking e data injection

### Código Anterior
```typescript
res.setHeader(
  "Content-Security-Policy",
  "default-src 'self'; " +
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
  "style-src 'self' 'unsafe-inline'; " +
  "img-src 'self' data: https:; " +
  "font-src 'self' data:; " +
  "connect-src 'self';"
);
```

### Código Corrigido
```typescript
const isDevelopment = process.env.NODE_ENV === "development";

const scriptSrc = isDevelopment
  ? "'self' 'unsafe-inline'"  // Dev: permite inline para HMR
  : "'self'";                  // Prod: apenas scripts do mesmo origem

const connectSrc = isDevelopment
  ? "'self' ws: wss:"          // Dev: permite WebSocket para HMR
  : "'self'";                  // Prod: apenas conexões do mesmo origem

res.setHeader(
  "Content-Security-Policy",
  "default-src 'self'; " +
  `script-src ${scriptSrc}; ` +
  "style-src 'self' 'unsafe-inline'; " +
  "img-src 'self' data: https:; " +
  "font-src 'self' data:; " +
  `connect-src ${connectSrc}; ` +
  "base-uri 'self'; " +
  "form-action 'self'; " +
  "frame-ancestors 'none'; " +
  "object-src 'none'; " +
  "upgrade-insecure-requests;"
);
```

### Mudanças Aplicadas

| Diretiva | Antes | Depois | Propósito |
|----------|-------|--------|-----------|
| `script-src` | `'unsafe-inline' 'unsafe-eval'` | Condicional dev/prod | Previne XSS |
| `connect-src` | `'self'` | Condicional dev/prod | Permite HMR em dev |
| `base-uri` | (ausente) | `'self'` | Previne base tag injection |
| `form-action` | (ausente) | `'self'` | Previne form hijacking |
| `frame-ancestors` | (ausente) | `'none'` | Previne clickjacking |
| `object-src` | (ausente) | `'none'` | Bloqueia plugins (Flash, Java) |
| `upgrade-insecure-requests` | (ausente) | presente | Força HTTPS |

### Impacto
- **Eliminação de `'unsafe-eval'`**: Bloqueia execução dinâmica de código
- **Diferenciação dev/prod**: Hot Module Replacement funciona em dev, mas prod é restrito
- **Novas diretivas**: Proteção adicional contra clickjacking, form hijacking e plugins maliciosos

### Nota Técnica
O `'unsafe-inline'` foi mantido em `style-src` pois é necessário para CSS-in-JS utilizado pelo React/Tailwind. Uma futura melhoria seria implementar CSP baseado em nonces.

---

## Correção 3: Criação de GitHub Actions Workflows

### Detalhes
| Campo | Valor |
|-------|-------|
| **Diretório** | `.github/workflows/` |
| **Arquivos** | `ci.yml`, `release.yml` |
| **Severidade** | Alta |
| **Tipo** | Infraestrutura/DevOps |

### Problema
O projeto não possuía workflows de CI/CD, impedindo:
- Validação automática de PRs
- Detecção precoce de erros de tipo
- Automação de releases
- Auditoria de segurança contínua

### Arquivos Criados

#### 1. `.github/workflows/ci.yml` (Integração Contínua)

**Triggers:**
- Push para `main` ou `master`
- Pull Requests para `main` ou `master`

**Jobs:**

| Job | Etapas | Dependências |
|-----|--------|--------------|
| `lint` | Checkout, Setup pnpm/Node, Verificar formatação, Type check | - |
| `test` | Checkout, Setup, Testes unitários, Coverage | `lint` |
| `security` | Checkout, Setup, Auditoria de dependências | - |
| `build` | Checkout, Setup, Build produção, Upload artifacts | `lint`, `test` |

**Características:**
- Concurrency: cancela execuções anteriores na mesma branch
- Cache de dependências pnpm
- Upload de artifacts por 7 dias

#### 2. `.github/workflows/release.yml` (Releases)

**Triggers:**
- Push de tags `v*` (ex: `v1.0.0`)
- Manual via `workflow_dispatch`

**Jobs:**

| Job | Etapas | Dependências |
|-----|--------|--------------|
| `validate` | Type check, Testes, Auditoria | - |
| `release` | Build, Changelog, Criar release GitHub | `validate` |
| `notify` | Status da release | `release` |

**Características:**
- Geração automática de changelog baseada em commits
- Criação de release com arquivo tar.gz
- Suporte a pre-releases
- Instruções de instalação incluídas na release

### Impacto
- **Qualidade de código**: Validação automática em cada PR
- **Segurança**: Auditoria contínua de dependências
- **Release**: Processo automatizado e documentado
- **Visibilidade**: Status de CI visível no GitHub

---

## Sumário de Arquivos Modificados

| Arquivo | Tipo de Mudança | Linhas Afetadas |
|---------|-----------------|-----------------|
| `client/src/_core/hooks/useAuth.ts` | Correção de sintaxe | 70 |
| `server/_core/security.ts` | Hardening de segurança | 14-55 |
| `.github/workflows/ci.yml` | Arquivo novo | 155 linhas |
| `.github/workflows/release.yml` | Arquivo novo | 166 linhas |

---

## Próximos Passos Recomendados

### Curto Prazo
1. [ ] Remover type assertions `as any` nos componentes UI
2. [ ] Implementar logger estruturado (substituir console.log)
3. [ ] Adicionar validação de env vars obrigatórias no boot

### Médio Prazo
4. [ ] Migrar rate limiting para Redis
5. [ ] Expandir cobertura de testes (>80%)
6. [ ] Implementar CSP baseado em nonces

### Longo Prazo
7. [ ] Documentação de API (OpenAPI/Swagger)
8. [ ] Monitoramento e alertas (APM)
9. [ ] Testes E2E automatizados

---

## Verificação

Para verificar que as correções foram aplicadas corretamente:

```bash
# Type check
pnpm run check

# Testes
pnpm run test

# Build
pnpm run build
```

---

## Correções de Alta Prioridade (Fase 2)

Após as correções críticas, foram aplicadas 5 correções de alta prioridade.

---

## Correção Alta 1: Remover Type Assertions Inseguras

### Detalhes
| Campo | Valor |
|-------|-------|
| **Arquivos** | `textarea.tsx`, `dialog.tsx`, `input.tsx` |
| **Severidade** | Alta |
| **Tipo** | Type Safety |

### Problema
Uso de `as any` para acessar propriedade `isComposing` do `KeyboardEvent`.

### Solução
Substituído por type assertions específicas usando `globalThis.KeyboardEvent`.

```typescript
// ANTES
const isComposing = (e.nativeEvent as any).isComposing;

// DEPOIS
const nativeEvent = e.nativeEvent as globalThis.KeyboardEvent;
const isComposing = nativeEvent.isComposing;
```

---

## Correção Alta 2: Rate Limiting com Proteção contra Memory Leak

### Detalhes
| Campo | Valor |
|-------|-------|
| **Arquivo** | `server/_core/security.ts` |
| **Severidade** | Alta |
| **Tipo** | Segurança/Performance |

### Melhorias Implementadas
1. **Limite máximo de IPs** (`RATE_LIMIT_MAX_IPS`, default 10000)
2. **Eviction automática** quando store está cheio (remove 10% mais antigos)
3. **Limpeza mais frequente** (15 min vs 1 hora)
4. **Cleanup no shutdown** via SIGTERM/SIGINT
5. **Documentação completa** de limitações e guia de migração para Redis

### Configuração via ENV
```bash
RATE_LIMIT_WINDOW_MS=900000    # 15 minutos
RATE_LIMIT_MAX_REQUESTS=100     # requests por janela
RATE_LIMIT_MAX_IPS=10000        # máximo de IPs no store
```

---

## Correção Alta 3: Validação Rigorosa de Input

### Detalhes
| Campo | Valor |
|-------|-------|
| **Arquivo** | `server/routers.ts` |
| **Severidade** | Alta |
| **Tipo** | Segurança |

### Validações Adicionadas

| Campo | Validação |
|-------|-----------|
| `templateType` | Enum (10 tipos: civil, trabalhista, criminal, etc.) |
| `title` | min: 1, max: 255 caracteres |
| `numeroProcesso` | max: 50, regex: `/^[\d.\-\/]*$/` |
| `tribunal` | max: 100 caracteres |
| `autor/reu` | max: 255 caracteres |
| `fatos/fundamentosJuridicos` | max: 50000 caracteres (~10 páginas) |
| `pedidos` | max: 10000 caracteres |
| `valorCausa` | max: 50, regex: `/^[\d.,\s]*$/` |
| `id` | inteiro positivo |

---

## Correção Alta 4: Validação de Variáveis de Ambiente

### Detalhes
| Campo | Valor |
|-------|-------|
| **Arquivo** | `server/_core/env.ts` |
| **Severidade** | Alta |
| **Tipo** | Configuração/Segurança |

### Funcionalidades
1. **Validação no boot** de variáveis obrigatórias
2. **Fail-fast em produção** (throw se faltando)
3. **Warning em desenvolvimento** (continua para dev local)
4. **Validação de segurança** (JWT_SECRET mínimo 32 chars, aviso SSL)
5. **Helper `hasFeature()`** para verificar disponibilidade de features

### Variáveis Obrigatórias
- `JWT_SECRET`
- `DATABASE_URL`
- `OAUTH_SERVER_URL`

---

## Correção Alta 5: Logger Estruturado

### Detalhes
| Campo | Valor |
|-------|-------|
| **Arquivo Criado** | `server/_core/logger.ts` |
| **Arquivos Atualizados** | `index.ts`, `security.ts` |
| **Severidade** | Alta |
| **Tipo** | Observabilidade |

### Características
- **Níveis**: debug, info, warn, error
- **Timestamps**: ISO 8601
- **Contexto**: por módulo (Server, Database, Auth, OAuth, API, Security, RateLimit)
- **Cores**: ANSI para terminal (desabilitado se não TTY)
- **JSON em produção**: para log aggregation (ELK, Datadog, etc.)

### Uso
```typescript
import { loggers, createLogger } from "./logger";

// Loggers pré-configurados
loggers.server.info("Server started", { port: 3000 });
loggers.auth.error("Login failed", error, { userId: "123" });

// Logger customizado
const myLogger = createLogger("MyModule");
myLogger.debug("Debug info", { data: "value" });
```

---

## Sumário Completo de Arquivos Modificados

### Fase 1 (Correções Críticas)
| Arquivo | Tipo de Mudança |
|---------|-----------------|
| `client/src/_core/hooks/useAuth.ts` | Correção de sintaxe |
| `server/_core/security.ts` | Hardening CSP |
| `.github/workflows/ci.yml` | Arquivo novo |
| `.github/workflows/release.yml` | Arquivo novo |

### Fase 2 (Correções de Alta Prioridade)
| Arquivo | Tipo de Mudança |
|---------|-----------------|
| `client/src/components/ui/textarea.tsx` | Type safety |
| `client/src/components/ui/dialog.tsx` | Type safety |
| `client/src/components/ui/input.tsx` | Type safety |
| `server/_core/security.ts` | Rate limiting melhorado |
| `server/routers.ts` | Validação de input |
| `server/_core/env.ts` | Validação de env vars |
| `server/_core/logger.ts` | Arquivo novo |
| `server/_core/index.ts` | Usar logger |

---

## Próximos Passos Recomendados

### Imediato
- [x] ~~Fixar sintaxe em useAuth.ts~~
- [x] ~~Atualizar CSP header~~
- [x] ~~Criar GitHub Workflows~~
- [x] ~~Remover `as any` type assertions~~
- [x] ~~Melhorar rate limiting~~
- [x] ~~Melhorar validação de input~~
- [x] ~~Validação de env vars~~
- [x] ~~Implementar logger estruturado~~

### Curto Prazo
- [ ] Substituir todos os console.log restantes pelo logger
- [ ] Adicionar mais testes de integração
- [ ] Implementar CSP baseado em nonces

### Médio Prazo
- [ ] Migrar rate limiting para Redis
- [ ] Expandir testes (>80% coverage)
- [ ] Documentação de API (OpenAPI/Swagger)

---

*Documento atualizado em 27/11/2024 - Sessão de análise e correção de código.*
