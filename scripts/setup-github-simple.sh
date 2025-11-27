#!/bin/bash

# Lex Intel Visual Design - GitHub Setup (Simplified)
# Desenvolvido por Lex Intelligentia
# 
# Versão simplificada que adiciona workflows via Git push

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_success() { echo -e "${GREEN}✓ $1${NC}"; }
print_info() { echo -e "${BLUE}ℹ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠ $1${NC}"; }

echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Lex Intel Visual Design - GitHub Setup (Simplified)     ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if in correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Não está no diretório raiz do projeto"
    exit 1
fi

print_info "Etapa 1: Adicionando workflows via Git"

# Restore workflows from stash if needed
if [ ! -d ".github/workflows" ]; then
    print_info "Recuperando workflows do stash..."
    git stash list | grep -q "WIP on main" && git stash pop
fi

# Check if workflows exist
if [ ! -f ".github/workflows/ci.yml" ] || [ ! -f ".github/workflows/release.yml" ]; then
    print_warning "Workflows não encontrados"
    print_info "Criando workflows..."
    
    mkdir -p .github/workflows
    
    # Create CI workflow
    cat > .github/workflows/ci.yml << 'EOF'
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    name: Test & Build
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: TypeScript check
        run: pnpm run check
      
      - name: Run tests
        run: pnpm run test
      
      - name: Build
        run: pnpm run build
        env:
          NODE_ENV: production
EOF

    # Create Release workflow
    cat > .github/workflows/release.yml << 'EOF'
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    name: Create Release
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Run tests
        run: pnpm run test
      
      - name: Build
        run: pnpm run build:production
      
      - name: Create Release
        uses: softprops/action-gh-release@v1
        with:
          draft: false
          prerelease: ${{ contains(github.ref, 'beta') || contains(github.ref, 'alpha') }}
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
EOF
    
    print_success "Workflows criados"
fi

# Add and commit workflows
print_info "Commitando workflows..."
git add .github/workflows/
git commit -m "ci: adiciona GitHub Actions workflows

- Workflow de CI com testes em Node 18.x e 20.x
- Workflow de Release automatizado
- TypeScript check, testes e build
- Security audit

Desenvolvido por Lex Intelligentia" || print_warning "Nada para commitar (workflows já existem)"

# Push to GitHub
print_info "Fazendo push para GitHub..."
git push github main

print_success "Workflows adicionados com sucesso!"
echo ""
print_info "Próximos passos manuais:"
echo "  1. Configure proteções de branch em:"
echo "     https://github.com/fbmoulin/lex-intel-visual-design/settings/branches"
echo ""
echo "  2. Crie release em:"
echo "     https://github.com/fbmoulin/lex-intel-visual-design/releases/new"
echo "     - Tag: v1.0.0-beta"
echo "     - Título: v1.0.0-beta - Lançamento Inicial (Beta)"
echo "     - Copie descrição do CHANGELOG.md"
echo "     - Marque 'This is a pre-release'"
echo ""
print_success "Concluído! 🎉"
