# Lex Intel Visual Design

[![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)](https://github.com/fbmoulin/lex-intel-visual-design/releases)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/typescript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![AI Powered](https://img.shields.io/badge/AI-Gemini%202.0-purple.svg)](https://ai.google.dev/)
[![RAG](https://img.shields.io/badge/RAG-pgvector-orange.svg)](https://github.com/pgvector/pgvector)

**Aplicação SaaS profissional para geração de petições jurídicas com Visual Law, Legal Design e Inteligência Artificial**

Desenvolvido por **Lex Intelligentia** - Transformando a advocacia através da tecnologia.

---

## 📋 Sobre o Projeto

O **Lex Intel Visual Design** é uma aplicação full-stack moderna que permite advogados criarem, editarem, salvarem e exportarem petições jurídicas com design profissional e elementos visuais que facilitam a compreensão. A aplicação implementa princípios de **Visual Law** e **Legal Design**, com um **Assistente Jurídico com IA** integrado e **busca semântica** em legislação e jurisprudência.

### Principais Funcionalidades

| Categoria | Funcionalidades |
|-----------|-----------------|
| **Editor de Petições** | Interface intuitiva com preview em tempo real, salvamento automático |
| **Templates** | 39 templates profissionais (Civil, Trabalhista, Criminal, Tributária, Consumidor) |
| **Visual Law** | Timeline, Cards de Resumo, Gráficos, Ícones temáticos |
| **Assistente IA** | Chat jurídico com Gemini 2.0, streaming em tempo real |
| **Busca Semântica** | RAG com pgvector, 35 documentos indexados (legislação e jurisprudência) |
| **Exportação** | PDF e DOCX com personalização de cabeçalho/rodapé |
| **Segurança** | OAuth 2.0, Rate Limiting, CSP, HSTS |

---

## 🤖 Assistente Jurídico com IA

O Lex Intel inclui um assistente jurídico inteligente que utiliza:

- **Gemini 2.0 Flash** para geração de respostas
- **RAG (Retrieval-Augmented Generation)** para contexto jurídico
- **Busca Híbrida** otimizada (60% semântica + 40% léxica)
- **35 documentos indexados** de legislação e jurisprudência cível

### Funcionalidades do Assistente

- Chat com streaming em tempo real
- Sugestões rápidas de perguntas jurídicas
- Filtro por área do direito
- Citações automáticas das fontes
- Análise de documentos
- Sugestões de petição

Acesse em: `/ai-assistant`

---

## 🚀 Início Rápido

### Pré-requisitos

- **Node.js:** 18+ 
- **pnpm:** 8+
- **PostgreSQL:** 14+ com extensão pgvector

### Instalação

```bash
# Clone o repositório
git clone https://github.com/lex-intelligentia/visual-law-app.git
cd visual-law-app

# Instale as dependências
pnpm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais

# Execute as migrações do banco de dados
pnpm run db:push

# Inicie o servidor de desenvolvimento
pnpm run dev
```

A aplicação estará disponível em `http://localhost:3000`

---

## 🏗️ Stack Tecnológica

### Frontend
- **React 19** + **TypeScript**
- **Vite** (build tool)
- **TailwindCSS** (estilização)
- **Shadcn/UI** (componentes)
- **Recharts** (gráficos)
- **tRPC** (API type-safe)

### Backend
- **Node.js** + **Express**
- **tRPC** (API)
- **PostgreSQL** + **pgvector** (banco de dados)
- **Drizzle ORM** (ORM)
- **Manus OAuth** (autenticação)

### Inteligência Artificial
- **Vercel AI SDK** (integração com LLMs)
- **Google Gemini 2.0** (chat e embeddings)
- **pgvector** (busca vetorial)
- **pg_trgm** (busca léxica)

### Exportação
- **html2canvas** + **jsPDF** (PDF)
- **docx** + **file-saver** (DOCX)

---

## 📦 Scripts Disponíveis

```bash
# Desenvolvimento
pnpm run dev                  # Inicia servidor de desenvolvimento

# Build
pnpm run build                # Build para produção
pnpm run build:production     # Build com NODE_ENV=production

# Testes
pnpm run test                 # Executa testes
pnpm run test:coverage        # Testes com cobertura

# Qualidade de Código
pnpm run check                # Checagem de tipos TypeScript
pnpm run format               # Formata código com Prettier

# Banco de Dados
pnpm run db:push              # Gera e aplica migrações
pnpm run db:migrate           # Aplica migrações
pnpm run db:studio            # Abre Drizzle Studio

# Segurança
pnpm run audit:security       # Auditoria de segurança
pnpm run audit:fix            # Corrige vulnerabilidades

# Deploy
pnpm run prepare:deploy       # Prepara para deploy (check + test + build)
pnpm run deploy:railway       # Deploy no Railway
pnpm run docker:build         # Build da imagem Docker
pnpm run docker:run           # Executa container Docker
```

---

## 🚢 Deploy

### Railway (Recomendado)

```bash
# Instale o Railway CLI
npm install -g @railway/cli

# Faça login
railway login

# Execute o deploy
pnpm run deploy:railway
```

### Docker

```bash
# Build da imagem
pnpm run docker:build

# Execute o container
pnpm run docker:run
```

---

## 📚 Documentação

| Documento | Descrição |
|-----------|-----------|
| [Guia de Deploy](docs/DEPLOY.md) | Instruções completas de deploy |
| [Guia de Segurança](docs/SECURITY.md) | Práticas e medidas de segurança |
| [Guia de Monitoramento](docs/MONITORING.md) | Estratégias de monitoramento |
| [Otimização RAG](docs/RAG_OPTIMIZATION_RESEARCH.md) | Técnicas de otimização da busca semântica |
| [Testes A/B](docs/AB_TEST_PLAN_HYBRID_SEARCH.md) | Plano de testes para busca híbrida |
| [Roadmap 2025](ROADMAP_2025_STATE_OF_THE_ART.md) | Roadmap de evolução do projeto |

---

## 🔒 Segurança

O Lex Intel Visual Design implementa múltiplas camadas de segurança:

| Camada | Implementação |
|--------|---------------|
| **Autenticação** | OAuth 2.0 com Manus |
| **Headers** | CSP, HSTS, X-Frame-Options, X-Content-Type-Options |
| **Rate Limiting** | Proteção contra DoS com cleanup automático |
| **Validação** | Input validation com Zod |
| **SQL** | Prepared Statements via Drizzle ORM |
| **CORS** | Configurável por ambiente |
| **TLS** | Criptografia em produção |

---

## 📊 Métricas

| Métrica | Valor |
|---------|-------|
| **Build Time** | 12.29s |
| **Bundle Size** | ~3.1 MB |
| **Modules** | 3,047 |
| **Templates** | 39 petições + 9 judiciais |
| **Documentos RAG** | 35 indexados |
| **Recall@5** | 100% |
| **MRR** | 0.963 |
| **TypeScript** | 100% tipado |

---

## 🎯 Roadmap

### Próximas Funcionalidades

1. **Integração gov.br** - Assinatura digital
2. **Integração Jus.br** - Consulta processual (CNJ)
3. **Migração Next.js 15** - Performance otimizada
4. **Extensão Chrome** - Assistente no navegador
5. **Colaboração Real-time** - Edição simultânea
6. **Dashboard BI** - Métricas jurídicas

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor, siga os passos abaixo:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

## 📞 Contato

**Lex Intelligentia**

- Website: [lexintelligentia.com](https://lexintelligentia.com)
- Email: contato@lexintelligentia.com
- Segurança: security@lexintelligentia.com

---

## 🙏 Agradecimentos

- **Stanford Legal Design Lab** - Inspiração e pesquisa sobre Visual Law
- **Google Gemini** - Modelos de IA generativa
- **Shadcn/UI** - Componentes UI de alta qualidade
- **pgvector** - Extensão PostgreSQL para busca vetorial
- **Vercel AI SDK** - Integração com LLMs

---

**Desenvolvido com ❤️ pela Lex Intelligentia**
