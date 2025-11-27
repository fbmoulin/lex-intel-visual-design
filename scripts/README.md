# Scripts de Automação - Lex Intel Visual Design

**Desenvolvido por Lex Intelligentia**

Este diretório contém scripts de automação para configuração e deploy do projeto.

---

## 📋 Scripts Disponíveis

### 1. `deploy.sh` - Deploy Automatizado

Script completo de deploy que executa todas as verificações e build.

**Uso:**
```bash
./scripts/deploy.sh
```

**O que faz:**
- Verifica dependências e ambiente
- Executa TypeScript check
- Executa testes
- Executa auditoria de segurança
- Build de produção
- Migrações de banco de dados
- Deploy (Railway, Docker ou Manual)

---

### 2. `setup-github.sh` - Configuração Completa do GitHub

Script avançado que usa GitHub CLI para configurar completamente o repositório.

**Pré-requisitos:**
- GitHub CLI (`gh`) instalado
- Autenticado no GitHub CLI (`gh auth login`)

**Uso:**
```bash
./scripts/setup-github.sh
```

**O que faz:**
1. ✅ **Adiciona GitHub Actions Workflows**
   - Workflow de CI (testes, build, security audit)
   - Workflow de Release (automatizado)

2. ✅ **Configura Proteções de Branch**
   - Branch `main`: Proteção máxima
   - Branch `develop`: Proteção moderada (opcional)
   - Require PR approvals
   - Require status checks
   - Linear history

3. ✅ **Cria Release da Versão Beta**
   - Release v1.0.0-beta
   - Notas do CHANGELOG.md
   - Marcado como pre-release

4. ✅ **Configura About Section**
   - Descrição do repositório
   - Topics (legal-tech, visual-law, etc.)

5. ✅ **Habilita Discussions** (opcional)

**Interativo:**
- Pergunta antes de sobrescrever configurações existentes
- Permite pular etapas
- Fornece feedback visual colorido

---

### 3. `setup-github-simple.sh` - Configuração Simplificada

Versão simplificada que adiciona workflows via Git push.

**Pré-requisitos:**
- Git configurado
- Acesso ao repositório remoto

**Uso:**
```bash
./scripts/setup-github-simple.sh
```

**O que faz:**
- Adiciona workflows via Git commit/push
- Fornece instruções para passos manuais

**Quando usar:**
- Quando não tem GitHub CLI instalado
- Quando prefere controle manual
- Para ambientes com restrições

---

## 🚀 Guia de Uso Rápido

### Primeira Vez (Setup Completo)

```bash
# 1. Configure o GitHub
cd /home/ubuntu/visual-law-app
./scripts/setup-github.sh

# 2. Faça o deploy
./scripts/deploy.sh
```

### Deploy Subsequente

```bash
# Apenas deploy
./scripts/deploy.sh
```

---

## 📊 Comparação de Scripts

| Recurso | deploy.sh | setup-github.sh | setup-github-simple.sh |
|---------|-----------|-----------------|------------------------|
| **Propósito** | Deploy | Config GitHub | Config GitHub |
| **Complexidade** | Média | Alta | Baixa |
| **Interativo** | Sim | Sim | Não |
| **Requer gh CLI** | Não | Sim | Não |
| **Workflows** | - | ✅ | ✅ |
| **Branch Protection** | - | ✅ | Manual |
| **Release** | - | ✅ | Manual |
| **About Section** | - | ✅ | Manual |
| **Build** | ✅ | - | - |
| **Testes** | ✅ | - | - |
| **Audit** | ✅ | - | - |

---

## 🔧 Instalação de Dependências

### GitHub CLI (para setup-github.sh)

**macOS:**
```bash
brew install gh
```

**Ubuntu/Debian:**
```bash
sudo apt install gh
```

**Autenticação:**
```bash
gh auth login
```

---

## 📝 Exemplos de Uso

### Exemplo 1: Setup Completo do Repositório

```bash
cd /home/ubuntu/visual-law-app
./scripts/setup-github.sh
```

**Output esperado:**
```
╔════════════════════════════════════════════════════════════╗
║        Lex Intel Visual Design - GitHub Setup             ║
║        Automação de Configuração do Repositório           ║
╚════════════════════════════════════════════════════════════╝

✓ GitHub CLI encontrado: gh version 2.40.0
✓ Autenticado no GitHub CLI
✓ Diretório correto
✓ Workflows encontrados localmente

========================================
ETAPA 1: Adicionando GitHub Actions Workflows
========================================

ℹ Adicionando ci.yml...
✓ ci.yml adicionado
ℹ Adicionando release.yml...
✓ release.yml adicionado
✓ Workflows adicionados com sucesso!

[...]
```

### Exemplo 2: Deploy para Railway

```bash
cd /home/ubuntu/visual-law-app
./scripts/deploy.sh
```

**Selecione opção 1 (Railway) quando solicitado.**

### Exemplo 3: Setup Simplificado

```bash
cd /home/ubuntu/visual-law-app
./scripts/setup-github-simple.sh
```

---

## ⚠️ Troubleshooting

### Erro: "GitHub CLI não está instalado"

**Solução:**
```bash
# macOS
brew install gh

# Ubuntu
sudo apt install gh
```

### Erro: "Não autenticado no GitHub CLI"

**Solução:**
```bash
gh auth login
# Siga as instruções na tela
```

### Erro: "refusing to allow a GitHub App to create workflow"

**Causa:** Restrições de permissão do GitHub App.

**Solução:** Use `setup-github-simple.sh` ou adicione workflows manualmente via UI.

### Erro: "Não está no diretório raiz do projeto"

**Solução:**
```bash
cd /home/ubuntu/visual-law-app
```

### Erro: "Workflows não encontrados"

**Solução:**
```bash
# Recupere do stash
git stash list
git stash pop

# Ou recrie os workflows
./scripts/setup-github-simple.sh
```

---

## 🔒 Segurança

### Permissões Necessárias

**setup-github.sh requer:**
- `repo` (full control)
- `workflow` (update workflows)
- `admin:org` (configure branch protection)

**Verifique permissões:**
```bash
gh auth status
```

### Secrets e Variáveis

Os scripts **não** expõem ou armazenam:
- Tokens de autenticação
- Secrets do repositório
- Variáveis de ambiente sensíveis

---

## 📚 Referências

- [GitHub CLI Documentation](https://cli.github.com/manual/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Branch Protection Rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches)
- [Railway Documentation](https://docs.railway.app/)

---

## 🤝 Contribuindo

Melhorias nos scripts são bem-vindas! Siga o guia em `CONTRIBUTING.md`.

---

## 📄 Licença

Estes scripts fazem parte do projeto Lex Intel Visual Design e estão licenciados sob a licença MIT.

---

**Desenvolvido por Lex Intelligentia** - Transformando a advocacia através da tecnologia.
