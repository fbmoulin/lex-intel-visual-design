# Arquitetura de Integração - Ecossistema Lex Intelligentia

## Visão Geral

O ecossistema Lex Intelligentia é uma plataforma integrada de soluções jurídicas onde cada aplicativo complementa os demais, oferecendo valor adicional quando usados em conjunto. A arquitetura foi projetada com fundamentos sólidos de desenvolvimento, priorizando backend robusto, APIs bem definidas e integração estável.

## Princípios Arquiteturais

### 1. Fundamentos Sólidos

Priorizamos conhecimento sólido em:
- **Backend**: Node.js/Express com TypeScript, PostgreSQL, tRPC
- **Frontend**: React 19, Tailwind CSS 4, Shadcn/UI
- **APIs**: RESTful e tRPC para comunicação type-safe
- **Banco de Dados**: PostgreSQL com Drizzle ORM
- **Autenticação**: OAuth 2.0 / JWT
- **Testes**: Vitest para testes unitários e de integração
- **Deploy**: Containerização e CI/CD

### 2. Agentes Especialistas vs. Banco de Prompts

Ao desenvolver funcionalidades de IA, utilizamos **agentes especialistas** para áreas específicas do direito em vez de um banco de prompts genérico. Esta abordagem favorece:
- Modularidade e manutenibilidade
- Especialização do conhecimento jurídico
- Melhor qualidade nas respostas
- Facilidade de expansão

## Aplicativos do Ecossistema

### 1. Lex Intel Visual Design (Atual)
**Função**: Geração de petições jurídicas com Visual Law

**Funcionalidades Core**:
- Editor de petições com preview em tempo real
- Templates especializados por área do direito
- Componentes visuais (Timeline, SummaryCard, Gráficos)
- Exportação para PDF com fidelidade visual
- Salvamento e histórico de petições

**APIs Expostas**:
- `POST /api/petitions/create` - Criar petição
- `GET /api/petitions/list` - Listar petições do usuário
- `GET /api/petitions/:id` - Buscar petição por ID
- `PUT /api/petitions/:id` - Atualizar petição
- `DELETE /api/petitions/:id` - Excluir petição
- `POST /api/petitions/:id/export-pdf` - Exportar para PDF

### 2. Lex Intelligentia - Gestão Automatizada (Futuro)
**Função**: Gestão completa de escritório jurídico

**Funcionalidades Planejadas**:
- Gestão de clientes e processos
- Agenda e prazos processuais
- Controle financeiro e faturamento
- Gestão de documentos
- Dashboard analítico

**Integração com Lex Intel Visual Design**:
- Importar petições geradas no Visual Design
- Vincular petições a processos e clientes
- Sincronizar prazos com timeline de petições
- Compartilhar templates entre apps

### 3. Lex AI Assistant (Futuro)
**Função**: Assistente jurídico com IA especializada

**Funcionalidades Planejadas**:
- Agentes especialistas por área do direito
- Análise de jurisprudência
- Sugestões de argumentação
- Revisão de petições
- Pesquisa jurídica automatizada

**Integração com Lex Intel Visual Design**:
- Sugerir conteúdo para petições
- Revisar e melhorar textos gerados
- Buscar jurisprudência relevante
- Validar argumentação jurídica

## Arquitetura de Integração

### Camada de Autenticação Unificada (SSO)

```
┌─────────────────────────────────────────────────────┐
│          Lex Intelligentia Auth Service             │
│                  (OAuth 2.0 / JWT)                   │
└─────────────────────────────────────────────────────┘
           │              │              │
           ▼              ▼              ▼
    ┌───────────┐  ┌───────────┐  ┌───────────┐
    │  Visual   │  │  Gestão   │  │    AI     │
    │  Design   │  │Automatizada│  │ Assistant │
    └───────────┘  └───────────┘  └───────────┘
```

**Benefícios**:
- Login único em todos os apps
- Gerenciamento centralizado de usuários
- Segurança consistente
- Experiência de usuário fluida

### Camada de APIs Compartilhadas

```
┌─────────────────────────────────────────────────────┐
│           Lex Intelligentia API Gateway             │
│              (Rate Limiting, CORS, Auth)             │
└─────────────────────────────────────────────────────┘
           │              │              │
           ▼              ▼              ▼
    ┌───────────┐  ┌───────────┐  ┌───────────┐
    │ Petitions │  │ Processes │  │    AI     │
    │    API    │  │    API    │  │    API    │
    └───────────┘  └───────────┘  └───────────┘
```

**Padrões de Comunicação**:
- **Formato**: JSON para payloads
- **Protocolo**: HTTPS com TLS 1.3+
- **Autenticação**: Bearer tokens (JWT)
- **Versionamento**: `/api/v1/`, `/api/v2/`
- **Rate Limiting**: 1000 req/min por usuário
- **CORS**: Configurado para domínios autorizados

### Banco de Dados Compartilhado

```
┌─────────────────────────────────────────────────────┐
│              PostgreSQL Database Cluster            │
└─────────────────────────────────────────────────────┘
     │                  │                  │
     ▼                  ▼                  ▼
┌──────────┐      ┌──────────┐      ┌──────────┐
│  users   │      │petitions │      │processes │
│  schema  │      │  schema  │      │  schema  │
└──────────┘      └──────────┘      └──────────┘
```

**Estratégia**:
- Schemas separados por domínio
- Foreign keys para relacionamentos
- Views compartilhadas quando necessário
- Migrations versionadas e sincronizadas

## Fluxos de Integração

### Fluxo 1: Criar Petição e Vincular a Processo

```
1. Usuário cria petição no Lex Intel Visual Design
   ↓
2. Petição é salva no banco de dados
   ↓
3. Usuário acessa Lex Intelligentia - Gestão Automatizada
   ↓
4. Sistema lista petições disponíveis via API
   ↓
5. Usuário vincula petição a um processo existente
   ↓
6. Relacionamento é criado no banco de dados
```

### Fluxo 2: Assistente IA Sugere Conteúdo para Petição

```
1. Usuário abre editor no Lex Intel Visual Design
   ↓
2. Clica em "Sugerir Conteúdo com IA"
   ↓
3. Frontend chama Lex AI Assistant API
   ↓
4. Agente especialista analisa contexto e gera sugestão
   ↓
5. Sugestão é retornada e inserida no editor
   ↓
6. Usuário revisa e ajusta conforme necessário
```

### Fluxo 3: Sincronização de Prazos

```
1. Petição com timeline é criada no Visual Design
   ↓
2. Webhook notifica Gestão Automatizada
   ↓
3. Sistema extrai datas da timeline
   ↓
4. Prazos são criados automaticamente na agenda
   ↓
5. Notificações são configuradas
```

## Especificações Técnicas

### Formato de Dados Compartilhados

#### Petição (Petition)
```typescript
interface Petition {
  id: number;
  userId: string;
  templateType: 'civil' | 'trabalhista' | 'criminal' | 'tributaria' | 'consumidor';
  title: string;
  numeroProcesso?: string;
  tribunal?: string;
  autor?: string;
  reu?: string;
  valorCausa?: string;
  fatos?: string;
  fundamentosJuridicos?: string;
  pedidos?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Processo (Process)
```typescript
interface Process {
  id: number;
  userId: string;
  clientId: number;
  numeroProcesso: string;
  tribunal: string;
  tipo: string;
  status: 'ativo' | 'arquivado' | 'concluido';
  petitionIds: number[]; // Relacionamento com petições
  createdAt: Date;
  updatedAt: Date;
}
```

#### Cliente (Client)
```typescript
interface Client {
  id: number;
  userId: string;
  nome: string;
  cpfCnpj: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Endpoints de Integração

#### 1. Buscar Petições Disponíveis
```
GET /api/v1/integrations/petitions
Authorization: Bearer <token>

Response:
{
  "petitions": [
    {
      "id": 1,
      "title": "Petição Civil - João da Silva",
      "templateType": "civil",
      "numeroProcesso": "001/2025",
      "createdAt": "2025-01-24T00:00:00Z"
    }
  ]
}
```

#### 2. Vincular Petição a Processo
```
POST /api/v1/integrations/link-petition
Authorization: Bearer <token>
Content-Type: application/json

{
  "petitionId": 1,
  "processId": 123
}

Response:
{
  "success": true,
  "message": "Petição vinculada com sucesso"
}
```

#### 3. Solicitar Sugestão de IA
```
POST /api/v1/ai/suggest-content
Authorization: Bearer <token>
Content-Type: application/json

{
  "templateType": "civil",
  "context": {
    "autor": "João da Silva",
    "reu": "Empresa ABC",
    "tipo": "cobrança"
  },
  "section": "fundamentosJuridicos"
}

Response:
{
  "suggestion": "Com base no Código Civil...",
  "confidence": 0.95,
  "sources": ["Art. 389 CC", "Art. 395 CC"]
}
```

## Segurança

### Autenticação e Autorização
- **JWT Tokens**: Expiração de 1 hora, refresh tokens de 7 dias
- **Scopes**: Permissões granulares por recurso
- **Rate Limiting**: Proteção contra abuso
- **HTTPS**: Obrigatório em produção

### Proteção de Dados
- **Criptografia**: Dados sensíveis criptografados em repouso
- **LGPD**: Conformidade com lei de proteção de dados
- **Auditoria**: Logs de todas as operações sensíveis
- **Backup**: Backups diários com retenção de 30 dias

## Escalabilidade

### Horizontal Scaling
- **Load Balancer**: Distribuição de carga entre instâncias
- **Database Replication**: Read replicas para queries
- **Caching**: Redis para dados frequentemente acessados
- **CDN**: Assets estáticos servidos via CDN

### Monitoramento
- **Logs**: Centralizados com ELK Stack
- **Métricas**: Prometheus + Grafana
- **Alertas**: Notificações automáticas de problemas
- **Health Checks**: Endpoints de saúde em todos os serviços

## Roadmap de Implementação

### Fase 1: Fundação (Atual)
- ✅ Lex Intel Visual Design MVP
- ✅ Autenticação básica
- ✅ APIs de petições
- ✅ Banco de dados PostgreSQL

### Fase 2: Integração Básica (Próximos 2 meses)
- [ ] API Gateway centralizado
- [ ] SSO entre apps
- [ ] Webhooks para eventos
- [ ] Documentação de APIs

### Fase 3: Lex Intelligentia - Gestão Automatizada (Próximos 4 meses)
- [ ] Gestão de clientes e processos
- [ ] Integração com Visual Design
- [ ] Sincronização de dados
- [ ] Dashboard unificado

### Fase 4: Lex AI Assistant (Próximos 6 meses)
- [ ] Agentes especialistas por área
- [ ] Integração com ambos os apps
- [ ] Análise de jurisprudência
- [ ] Sugestões inteligentes

## Conclusão

A arquitetura de integração do ecossistema Lex Intelligentia foi projetada com fundamentos sólidos, priorizando:

1. **Backend Robusto**: APIs bem definidas, banco de dados normalizado, testes automatizados
2. **Segurança**: Autenticação unificada, criptografia, conformidade com LGPD
3. **Escalabilidade**: Arquitetura preparada para crescimento
4. **Modularidade**: Apps independentes mas integrados
5. **Experiência do Usuário**: Fluxos fluidos entre aplicativos

Esta abordagem garante que cada aplicativo funcione perfeitamente de forma independente, mas ofereça valor exponencial quando usado em conjunto com os demais componentes do ecossistema.
