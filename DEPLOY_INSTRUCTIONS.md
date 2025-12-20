# Instruções de Deploy - Lex Intel Visual Design v1.1.0

## Pré-requisitos

Antes de iniciar o deploy, certifique-se de ter:

1. **Conta no Supabase** com projeto configurado
2. **Extensões habilitadas no PostgreSQL:**
   - `pgvector` (busca vetorial)
   - `pg_trgm` (busca léxica)
3. **Variáveis de ambiente configuradas** (veja `.env.example`)
4. **Node.js 18+** e **pnpm 8+** instalados

---

## Opção 1: Deploy no Railway (Recomendado)

### Passo 1: Configurar Variáveis de Ambiente

No dashboard do Railway, configure as seguintes variáveis:

| Variável | Descrição |
|----------|-----------|
| `NODE_ENV` | `production` |
| `PORT` | `3000` |
| `DATABASE_URL` | URL de conexão do Supabase |
| `SUPABASE_URL` | URL do projeto Supabase |
| `SUPABASE_ANON_KEY` | Chave anônima do Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave de serviço do Supabase |
| `OAUTH_SERVER_URL` | URL do servidor OAuth |
| `JWT_SECRET` | Segredo para JWT (mínimo 32 caracteres) |
| `ALLOWED_ORIGINS` | Domínios permitidos (separados por vírgula) |
| `GEMINI_API_KEY` | Chave da API do Google Gemini |

### Passo 2: Deploy

```bash
# Instale o Railway CLI
npm install -g @railway/cli

# Faça login
railway login

# Execute o deploy
railway up
```

---

## Opção 2: Deploy com Docker

### Passo 1: Build da Imagem

```bash
docker build -t lex-intel-visual-design:v1.1.0 .
```

### Passo 2: Executar Container

```bash
docker run -d \
  --name lex-intel \
  -p 3000:3000 \
  --env-file .env \
  lex-intel-visual-design:v1.1.0
```

---

## Opção 3: Deploy Manual

### Passo 1: Extrair Pacote

```bash
tar -xzvf lex-intel-visual-design-v1.1.0.tar.gz
```

### Passo 2: Instalar Dependências

```bash
pnpm install --prod
```

### Passo 3: Configurar Variáveis de Ambiente

```bash
cp .env.example .env
# Edite .env com suas credenciais
```

### Passo 4: Executar Migrações

```bash
pnpm run db:migrate
```

### Passo 5: Iniciar Servidor

```bash
NODE_ENV=production node dist/index.js
```

---

## Configuração do Banco de Dados

### Habilitar Extensões

Execute no Supabase SQL Editor:

```sql
-- Habilitar pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- Habilitar pg_trgm
CREATE EXTENSION IF NOT EXISTS pg_trgm;
```

### Verificar Tabelas RAG

As seguintes tabelas devem existir:

- `legal_documents` - Documentos jurídicos com embeddings
- `ai_conversations` - Histórico de conversas com IA

---

## Verificação Pós-Deploy

### Health Check

```bash
curl https://seu-dominio.com/api/health
```

### Testar Assistente IA

Acesse `https://seu-dominio.com/ai-assistant` e faça uma pergunta jurídica.

### Testar Busca Semântica

```bash
curl -X POST https://seu-dominio.com/api/ai/rag/search \
  -H "Content-Type: application/json" \
  -d '{"query": "requisitos para ação de despejo"}'
```

---

## Monitoramento

### Logs

```bash
# Railway
railway logs

# Docker
docker logs lex-intel
```

### Métricas

Configure integração com:
- **Sentry** para error tracking
- **Datadog** ou **Logtail** para logging
- **UptimeRobot** para uptime monitoring

---

## Suporte

Em caso de problemas:

1. Verifique os logs do servidor
2. Confirme que as variáveis de ambiente estão corretas
3. Verifique a conectividade com o Supabase
4. Consulte a documentação em `/docs`

**Contato:** contato@lexintelligentia.com
