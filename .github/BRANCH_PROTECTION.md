# Configuração de Proteções de Branch

Este documento descreve as configurações recomendadas de proteção de branch para o repositório **Lex Intel Visual Design**.

## 🔒 Proteções Recomendadas para `main`

### Configuração via GitHub UI

Acesse: `Settings` → `Branches` → `Add branch protection rule`

**Branch name pattern:** `main`

### ✅ Regras Obrigatórias

#### 1. Require a pull request before merging
- ✅ **Require approvals:** 1
- ✅ **Dismiss stale pull request approvals when new commits are pushed**
- ✅ **Require review from Code Owners** (opcional)

#### 2. Require status checks to pass before merging
- ✅ **Require branches to be up to date before merging**
- **Status checks obrigatórios:**
  - `Test & Build (18.x)`
  - `Test & Build (20.x)`
  - `Security Audit`

#### 3. Require conversation resolution before merging
- ✅ **Habilitado**

#### 4. Require signed commits
- ⚠️ **Opcional** (recomendado para produção)

#### 5. Require linear history
- ✅ **Habilitado** (força squash ou rebase)

#### 6. Include administrators
- ✅ **Habilitado** (administradores também devem seguir as regras)

### 🔧 Regras Adicionais

#### Allow force pushes
- ❌ **Desabilitado**

#### Allow deletions
- ❌ **Desabilitado**

---

## 🌿 Proteções Recomendadas para `develop`

**Branch name pattern:** `develop`

### ✅ Regras Obrigatórias

#### 1. Require a pull request before merging
- ✅ **Require approvals:** 1
- ✅ **Dismiss stale pull request approvals when new commits are pushed**

#### 2. Require status checks to pass before merging
- ✅ **Require branches to be up to date before merging**
- **Status checks obrigatórios:**
  - `Test & Build (20.x)`

#### 3. Require conversation resolution before merging
- ✅ **Habilitado**

---

## 📝 Configuração via GitHub CLI

Você também pode configurar as proteções de branch usando o GitHub CLI:

```bash
# Proteção para main
gh api repos/fbmoulin/lex-intel-visual-design/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["Test & Build (18.x)","Test & Build (20.x)","Security Audit"]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"dismiss_stale_reviews":true,"require_code_owner_reviews":false,"required_approving_review_count":1}' \
  --field restrictions=null \
  --field required_linear_history=true \
  --field allow_force_pushes=false \
  --field allow_deletions=false \
  --field required_conversation_resolution=true
```

---

## 🎯 Estratégia de Branches

### Branch Principal: `main`
- Código de produção
- Sempre estável
- Deploy automático (futuro)
- Proteção máxima

### Branch de Desenvolvimento: `develop`
- Código em desenvolvimento
- Integração contínua
- Testes extensivos
- Proteção moderada

### Feature Branches: `feature/*`
- Novas funcionalidades
- Criadas a partir de `develop`
- Merge via PR para `develop`
- Sem proteção especial

### Hotfix Branches: `hotfix/*`
- Correções urgentes
- Criadas a partir de `main`
- Merge via PR para `main` e `develop`
- Revisão acelerada

### Release Branches: `release/*`
- Preparação de releases
- Criadas a partir de `develop`
- Merge via PR para `main` e `develop`
- Testes finais

---

## 🔄 Fluxo de Trabalho

```
feature/nova-funcionalidade → develop → release/v1.1.0 → main
                                ↑
                              hotfix/correcao-critica → main
```

---

## ⚠️ Versão BETA

Durante a fase beta, as proteções podem ser mais flexíveis para permitir iterações rápidas. Após o lançamento da versão estável (v1.0.0), as proteções devem ser rigorosamente aplicadas.

---

## 📚 Referências

- [GitHub Branch Protection](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [GitHub CLI](https://cli.github.com/)

---

**Desenvolvido por Lex Intelligentia** - Transformando a advocacia através da tecnologia.
