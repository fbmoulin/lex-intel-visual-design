# Lex Intel Visual Design - Guia de Deploy

**Desenvolvido por Lex Intelligentia**

Este documento descreve o processo de deploy da aplicação **Lex Intel Visual Design** em um ambiente de produção. Siga os passos abaixo para garantir um deploy seguro e eficiente.

## 1. Pré-requisitos

Antes de iniciar, certifique-se de que os seguintes pré-requisitos estão atendidos:

- **Node.js:** Versão 18 ou superior
- **pnpm:** Versão 8 ou superior
- **Git:** Versão 2 ou superior
- **Docker:** Versão 20 ou superior (para deploy com Docker)
- **Railway CLI:** Instalado globalmente (para deploy no Railway)
- **Acesso ao repositório:** Permissões de leitura/escrita no repositório Git

## 2. Configuração do Ambiente

### 2.1. Variáveis de Ambiente

1. Copie o arquivo `.env.example` para um novo arquivo chamado `.env`:

   ```bash
   cp .env.example .env
   ```

2. Preencha o arquivo `.env` com os valores corretos para o ambiente de produção. Consulte o arquivo `.env.example` para obter detalhes sobre cada variável.

   **Atenção:** Nunca commite o arquivo `.env` no repositório Git.

### 2.2. Instalação de Dependências

Instale as dependências do projeto usando `pnpm`:

```bash
pnpm install --frozen-lockfile
```

## 3. Processo de Deploy

### 3.1. Deploy Automatizado (Recomendado)

O script `scripts/deploy.sh` automatiza todo o processo de deploy, incluindo checagens de segurança, testes e build.

Para executar o script:

```bash
./scripts/deploy.sh
```

O script irá guiá-lo através das seguintes etapas:

1. **Instalação de dependências**
2. **Checagem de tipos com TypeScript**
3. **Execução de testes unitários**
4. **Auditoria de segurança**
5. **Build para produção**
6. **Migração do banco de dados**
7. **Seleção da plataforma de deploy (Railway, Docker ou Manual)**

### 3.2. Deploy Manual

Caso prefira realizar o deploy manualmente, siga os passos abaixo:

1. **Checagens e Testes:**

   ```bash
   pnpm run deploy:check
   ```

2. **Build para Produção:**

   ```bash
   pnpm run build:production
   ```

3. **Migração do Banco de Dados:**

   ```bash
   pnpm run db:migrate
   ```

4. **Iniciar a Aplicação:**

   ```bash
   pnpm start
   ```

## 4. Plataformas de Deploy

### 4.1. Railway (Recomendado)

O Railway é a plataforma recomendada para deploy do Lex Intel Visual Design, devido à sua simplicidade e integração com bancos de dados.

- O arquivo `railway.json` já está configurado para deploy automático.
- O script `deploy.sh` pode realizar o deploy no Railway automaticamente.

### 4.2. Docker

Um `Dockerfile` otimizado para produção está incluído no projeto.

- **Build da Imagem:**

  ```bash
  docker build -t lex-intel-visual-design:latest .
  ```

- **Execução do Container:**

  ```bash
  docker run -p 3000:3000 --env-file .env lex-intel-visual-design:latest
  ```

## 5. Verificação Pós-Deploy

Após o deploy, realize as seguintes verificações:

1. **Acesse a URL da aplicação** e verifique se a página inicial carrega corretamente.
2. **Teste o login e o registro de usuários.**
3. **Crie, edite e exclua uma petição.**
4. **Teste a funcionalidade de exportação para PDF e DOCX.**
5. **Verifique os logs da aplicação** em busca de erros.

## 6. Monitoramento

### 6.1. Health Check

A aplicação expõe um endpoint de health check em `/health`.

- **Status:** `ok`
- **Timestamp:** Data e hora do health check
- **Uptime:** Tempo de atividade do processo
- **Environment:** Ambiente de execução (production, development)

### 6.2. Logging

- Em produção, os logs são enviados para o `stdout` e `stderr`.
- Configure sua plataforma de hosting para coletar e analisar esses logs.
- Integre com um serviço de logging como Datadog, Logtail ou Sentry para monitoramento avançado.

### 6.3. Error Tracking

- A aplicação está preparada para integração com Sentry.
- Preencha a variável `SENTRY_DSN` no arquivo `.env` para habilitar o error tracking.

## 7. Rollback

Em caso de falha no deploy, siga os procedimentos de rollback da sua plataforma de hosting:

- **Railway:** Utilize a funcionalidade de rollback para uma versão anterior do deploy.
- **Docker:** Faça o deploy da imagem Docker da versão anterior.

## 8. Segurança

Consulte o arquivo `docs/SECURITY.md` para obter informações detalhadas sobre as práticas de segurança implementadas na aplicação.
