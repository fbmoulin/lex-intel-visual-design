# Lex Intel Visual Design

**Aplicação SaaS profissional para geração de petições jurídicas com Visual Law e Legal Design**

Desenvolvido por **Lex Intelligentia** - Transformando a advocacia através da tecnologia.

---

## 📋 Sobre o Projeto

O **Lex Intel Visual Design** é uma aplicação full-stack moderna que permite advogados criarem, editarem, salvarem e exportarem petições jurídicas com design profissional e elementos visuais que facilitam a compreensão. A aplicação implementa princípios de **Visual Law** e **Legal Design**, tornando documentos jurídicos mais acessíveis e compreensíveis.

### Principais Funcionalidades

- ✅ **Editor de Petições:** Interface intuitiva com preview em tempo real
- ✅ **Templates Profissionais:** 8 templates pré-preenchidos (Civil, Trabalhista, Criminal, Tributária, Consumidor)
- ✅ **Componentes Visuais:** Timeline, Cards de Resumo, Gráficos (Recharts)
- ✅ **Exportação Avançada:** PDF e DOCX com personalização de cabeçalho/rodapé
- ✅ **Autenticação Segura:** Manus OAuth integrado
- ✅ **Banco de Dados:** PostgreSQL com Drizzle ORM
- ✅ **API tRPC:** Type-safe API com 7 testes unitários
- ✅ **Modo Escuro:** Tema configurável
- ✅ **Gerenciamento de Petições:** Busca, filtros, edição e exclusão

---

## 🚀 Início Rápido

### Pré-requisitos

- **Node.js:** 18+ 
- **pnpm:** 8+
- **PostgreSQL:** 14+

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
- **PostgreSQL** (banco de dados)
- **Drizzle ORM** (ORM)
- **Manus OAuth** (autenticação)

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

### Deploy Automatizado

```bash
# Execute o script de deploy
./scripts/deploy.sh
```

O script irá guiá-lo através de:
1. Instalação de dependências
2. Checagem de tipos
3. Testes
4. Auditoria de segurança
5. Build de produção
6. Migrações de banco
7. Seleção da plataforma (Railway/Docker/Manual)

---

## 📚 Documentação

- **[Guia de Deploy](docs/DEPLOY.md)** - Instruções completas de deploy
- **[Guia de Segurança](docs/SECURITY.md)** - Práticas e medidas de segurança
- **[Guia de Monitoramento](docs/MONITORING.md)** - Estratégias de monitoramento
- **[Design System](design_system_visual_law_completo.md)** - Documentação do Design System
- **[Arquitetura de Integração](arquitetura_integracao_ecossistema.md)** - Integração com ecossistema Lex Intelligentia

---

## 🔒 Segurança

O Lex Intel Visual Design implementa múltiplas camadas de segurança:

- ✅ **Autenticação OAuth 2.0** com Manus
- ✅ **Security Headers** (CSP, HSTS, X-Frame-Options, etc.)
- ✅ **Rate Limiting** para prevenir DoS
- ✅ **Validação de Input** com Zod
- ✅ **Prepared Statements** para prevenir SQL Injection
- ✅ **CORS** configurável
- ✅ **Criptografia TLS/SSL** em produção
- ✅ **Auditoria de Dependências** automatizada

Consulte o [Guia de Segurança](docs/SECURITY.md) para mais detalhes.

---

## 🎨 Design System

O projeto segue um Design System completo baseado em:

- **Paleta de Cores:** Azul primário (#2563eb), Âmbar secundário (#f59e0b)
- **Tipografia:** Inter (14px-36px)
- **Espaçamento:** Sistema baseado em 4px
- **Componentes:** Shadcn/UI + componentes customizados
- **Modo Escuro:** Totalmente suportado

---

## 🧪 Testes

```bash
# Executa todos os testes
pnpm run test

# Testes com cobertura
pnpm run test:coverage
```

O projeto inclui 7 testes unitários para a API tRPC, cobrindo:
- Criação de petições
- Listagem de petições
- Busca por ID
- Atualização
- Exclusão
- Controle de acesso

---

## 📊 Monitoramento

A aplicação expõe endpoints de health check e está preparada para integração com:

- **Sentry** (error tracking)
- **Datadog / Logtail** (logging)
- **Prometheus / Grafana** (métricas)
- **UptimeRobot** (uptime monitoring)

Consulte o [Guia de Monitoramento](docs/MONITORING.md) para mais detalhes.

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
- **Shadcn/UI** - Componentes UI de alta qualidade
- **Recharts** - Biblioteca de gráficos
- **tRPC** - Type-safe API
- **Drizzle ORM** - ORM moderno para PostgreSQL

---

**Desenvolvido com ❤️ pela Lex Intelligentia**
