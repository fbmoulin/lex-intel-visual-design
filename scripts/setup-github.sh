#!/bin/bash

# Lex Intel Visual Design - GitHub Setup Automation Script
# Desenvolvido por Lex Intelligentia
# 
# Este script automatiza a configuração completa do repositório GitHub:
# 1. Adiciona GitHub Actions workflows
# 2. Configura proteções de branch
# 3. Cria release da versão beta

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Repository information
REPO_OWNER="fbmoulin"
REPO_NAME="lex-intel-visual-design"
REPO_FULL="${REPO_OWNER}/${REPO_NAME}"
VERSION="v1.0.0-beta"

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

print_header() {
    echo ""
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
}

# Check if gh CLI is installed
check_gh_cli() {
    if ! command -v gh &> /dev/null; then
        print_error "GitHub CLI (gh) não está instalado"
        print_info "Instale com: brew install gh (macOS) ou apt install gh (Ubuntu)"
        exit 1
    fi
    print_success "GitHub CLI encontrado: $(gh --version | head -1)"
}

# Check if authenticated
check_gh_auth() {
    if ! gh auth status &> /dev/null; then
        print_error "Não autenticado no GitHub CLI"
        print_info "Execute: gh auth login"
        exit 1
    fi
    print_success "Autenticado no GitHub CLI"
}

# Check if workflows exist locally
check_workflows() {
    if [ ! -f ".github/workflows/ci.yml" ]; then
        print_error "Workflow ci.yml não encontrado"
        print_info "Certifique-se de estar no diretório raiz do projeto"
        exit 1
    fi
    if [ ! -f ".github/workflows/release.yml" ]; then
        print_error "Workflow release.yml não encontrado"
        exit 1
    fi
    print_success "Workflows encontrados localmente"
}

# Step 1: Add GitHub Actions Workflows
add_workflows() {
    print_header "ETAPA 1: Adicionando GitHub Actions Workflows"
    
    print_info "Verificando se workflows já existem no repositório..."
    
    # Check if workflows already exist
    if gh api "repos/${REPO_FULL}/contents/.github/workflows/ci.yml" &> /dev/null; then
        print_warning "Workflow ci.yml já existe no repositório"
        read -p "Deseja sobrescrever? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_info "Pulando ci.yml"
        else
            print_info "Atualizando ci.yml..."
            gh api "repos/${REPO_FULL}/contents/.github/workflows/ci.yml" \
                --method PUT \
                --field message="ci: atualiza workflow de CI" \
                --field content="$(base64 < .github/workflows/ci.yml)" \
                --field sha="$(gh api "repos/${REPO_FULL}/contents/.github/workflows/ci.yml" --jq .sha)" \
                > /dev/null
            print_success "ci.yml atualizado"
        fi
    else
        print_info "Adicionando ci.yml..."
        gh api "repos/${REPO_FULL}/contents/.github/workflows/ci.yml" \
            --method PUT \
            --field message="ci: adiciona workflow de CI" \
            --field content="$(base64 < .github/workflows/ci.yml)" \
            > /dev/null
        print_success "ci.yml adicionado"
    fi
    
    # Same for release.yml
    if gh api "repos/${REPO_FULL}/contents/.github/workflows/release.yml" &> /dev/null; then
        print_warning "Workflow release.yml já existe no repositório"
        read -p "Deseja sobrescrever? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_info "Pulando release.yml"
        else
            print_info "Atualizando release.yml..."
            gh api "repos/${REPO_FULL}/contents/.github/workflows/release.yml" \
                --method PUT \
                --field message="ci: atualiza workflow de Release" \
                --field content="$(base64 < .github/workflows/release.yml)" \
                --field sha="$(gh api "repos/${REPO_FULL}/contents/.github/workflows/release.yml" --jq .sha)" \
                > /dev/null
            print_success "release.yml atualizado"
        fi
    else
        print_info "Adicionando release.yml..."
        gh api "repos/${REPO_FULL}/contents/.github/workflows/release.yml" \
            --method PUT \
            --field message="ci: adiciona workflow de Release" \
            --field content="$(base64 < .github/workflows/release.yml)" \
            > /dev/null
        print_success "release.yml adicionado"
    fi
    
    print_success "Workflows adicionados com sucesso!"
    print_info "Visualize em: https://github.com/${REPO_FULL}/actions"
}

# Step 2: Configure Branch Protection
configure_branch_protection() {
    print_header "ETAPA 2: Configurando Proteções de Branch"
    
    print_info "Configurando proteções para branch 'main'..."
    
    # Check if branch protection already exists
    if gh api "repos/${REPO_FULL}/branches/main/protection" &> /dev/null; then
        print_warning "Proteções já existem para 'main'"
        read -p "Deseja reconfigurar? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_info "Pulando configuração de proteções"
            return
        fi
    fi
    
    print_info "Aplicando proteções..."
    
    # Create branch protection rule
    gh api "repos/${REPO_FULL}/branches/main/protection" \
        --method PUT \
        --field required_status_checks[strict]=true \
        --field required_status_checks[contexts][]=0 \
        --field enforce_admins=true \
        --field required_pull_request_reviews[dismiss_stale_reviews]=true \
        --field required_pull_request_reviews[require_code_owner_reviews]=false \
        --field required_pull_request_reviews[required_approving_review_count]=1 \
        --field restrictions=null \
        --field required_linear_history=true \
        --field allow_force_pushes=false \
        --field allow_deletions=false \
        --field required_conversation_resolution=true \
        > /dev/null
    
    print_success "Proteções configuradas para 'main'!"
    print_info "Visualize em: https://github.com/${REPO_FULL}/settings/branches"
    
    # Ask if user wants to configure develop branch
    echo ""
    read -p "Deseja configurar proteções para branch 'develop'? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # Check if develop branch exists
        if gh api "repos/${REPO_FULL}/branches/develop" &> /dev/null; then
            print_info "Configurando proteções para branch 'develop'..."
            
            gh api "repos/${REPO_FULL}/branches/develop/protection" \
                --method PUT \
                --field required_status_checks[strict]=true \
                --field required_status_checks[contexts][]=0 \
                --field enforce_admins=false \
                --field required_pull_request_reviews[dismiss_stale_reviews]=true \
                --field required_pull_request_reviews[require_code_owner_reviews]=false \
                --field required_pull_request_reviews[required_approving_review_count]=1 \
                --field restrictions=null \
                --field required_conversation_resolution=true \
                > /dev/null
            
            print_success "Proteções configuradas para 'develop'!"
        else
            print_warning "Branch 'develop' não existe no repositório"
            print_info "Crie a branch primeiro: git checkout -b develop && git push origin develop"
        fi
    fi
}

# Step 3: Create Release
create_release() {
    print_header "ETAPA 3: Criando Release da Versão Beta"
    
    print_info "Verificando se release já existe..."
    
    # Check if release already exists
    if gh release view "${VERSION}" --repo "${REPO_FULL}" &> /dev/null; then
        print_warning "Release ${VERSION} já existe"
        read -p "Deseja deletar e recriar? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            print_info "Deletando release existente..."
            gh release delete "${VERSION}" --repo "${REPO_FULL}" --yes
            print_success "Release deletado"
        else
            print_info "Pulando criação de release"
            return
        fi
    fi
    
    print_info "Criando release ${VERSION}..."
    
    # Check if CHANGELOG.md exists
    if [ ! -f "CHANGELOG.md" ]; then
        print_error "CHANGELOG.md não encontrado"
        exit 1
    fi
    
    # Extract beta section from CHANGELOG
    RELEASE_NOTES=$(sed -n '/## \[1.0.0-beta\]/,/^## /p' CHANGELOG.md | sed '$d')
    
    # Create release
    gh release create "${VERSION}" \
        --repo "${REPO_FULL}" \
        --title "v1.0.0-beta - Lançamento Inicial (Beta)" \
        --notes "${RELEASE_NOTES}" \
        --prerelease \
        --target main
    
    print_success "Release ${VERSION} criado com sucesso!"
    print_info "Visualize em: https://github.com/${REPO_FULL}/releases/tag/${VERSION}"
}

# Step 4: Configure About Section
configure_about() {
    print_header "ETAPA 4: Configurando About Section"
    
    print_info "Atualizando descrição e topics do repositório..."
    
    # Update repository description
    gh repo edit "${REPO_FULL}" \
        --description "Aplicação SaaS profissional para geração de petições jurídicas com Visual Law e Legal Design - Desenvolvido por Lex Intelligentia" \
        --add-topic "legal-tech" \
        --add-topic "visual-law" \
        --add-topic "legal-design" \
        --add-topic "saas" \
        --add-topic "typescript" \
        --add-topic "react" \
        --add-topic "nodejs" \
        --add-topic "postgresql" \
        --add-topic "beta"
    
    print_success "About section configurado!"
    print_info "Visualize em: https://github.com/${REPO_FULL}"
}

# Step 5: Enable Discussions (Optional)
enable_discussions() {
    print_header "ETAPA 5: Habilitar Discussions (Opcional)"
    
    read -p "Deseja habilitar GitHub Discussions? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "Habilitando Discussions..."
        
        gh api "repos/${REPO_FULL}" \
            --method PATCH \
            --field has_discussions=true \
            > /dev/null
        
        print_success "Discussions habilitado!"
        print_info "Visualize em: https://github.com/${REPO_FULL}/discussions"
    else
        print_info "Discussions não habilitado"
    fi
}

# Main execution
main() {
    clear
    echo ""
    echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║                                                            ║${NC}"
    echo -e "${BLUE}║        Lex Intel Visual Design - GitHub Setup             ║${NC}"
    echo -e "${BLUE}║        Automação de Configuração do Repositório           ║${NC}"
    echo -e "${BLUE}║                                                            ║${NC}"
    echo -e "${BLUE}║        Desenvolvido por Lex Intelligentia                 ║${NC}"
    echo -e "${BLUE}║                                                            ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    print_info "Repositório: ${REPO_FULL}"
    print_info "Versão: ${VERSION}"
    echo ""
    
    # Pre-flight checks
    print_header "Verificações Iniciais"
    check_gh_cli
    check_gh_auth
    
    # Check if we're in the right directory
    if [ ! -f "package.json" ]; then
        print_error "Não está no diretório raiz do projeto"
        print_info "Execute: cd /home/ubuntu/visual-law-app"
        exit 1
    fi
    print_success "Diretório correto"
    
    # Restore workflows from stash if needed
    if [ ! -d ".github/workflows" ]; then
        print_warning "Workflows não encontrados, tentando recuperar do stash..."
        git stash list | grep -q "WIP on main" && git stash pop
        if [ ! -d ".github/workflows" ]; then
            print_error "Não foi possível recuperar workflows"
            print_info "Certifique-se de que os workflows existem em .github/workflows/"
            exit 1
        fi
    fi
    check_workflows
    
    echo ""
    print_warning "Este script irá:"
    echo "  1. Adicionar GitHub Actions workflows"
    echo "  2. Configurar proteções de branch"
    echo "  3. Criar release da versão beta"
    echo "  4. Configurar About section"
    echo "  5. (Opcional) Habilitar Discussions"
    echo ""
    read -p "Deseja continuar? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_info "Operação cancelada"
        exit 0
    fi
    
    # Execute steps
    add_workflows
    configure_branch_protection
    create_release
    configure_about
    enable_discussions
    
    # Summary
    print_header "RESUMO"
    print_success "Configuração concluída com sucesso!"
    echo ""
    print_info "Links úteis:"
    echo "  • Repositório: https://github.com/${REPO_FULL}"
    echo "  • Actions: https://github.com/${REPO_FULL}/actions"
    echo "  • Branches: https://github.com/${REPO_FULL}/settings/branches"
    echo "  • Release: https://github.com/${REPO_FULL}/releases/tag/${VERSION}"
    echo ""
    print_info "Próximos passos:"
    echo "  1. Verifique os workflows em Actions"
    echo "  2. Teste as proteções de branch criando um PR"
    echo "  3. Compartilhe o release com a comunidade"
    echo ""
    print_success "Lex Intel Visual Design está pronto para colaboração! 🎉"
    echo ""
}

# Run main function
main
