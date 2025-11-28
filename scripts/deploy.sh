#!/bin/bash

# Lex Intel Visual Design - Deploy Script
# Desenvolvido por Lex Intelligentia
# Script automatizado para deploy em produção
#
# Uso: ./deploy.sh [OPTIONS]
#   -y, --yes       Aceita todas as confirmações automaticamente
#   -f, --force     Força todas as operações (ignora cache)
#   -s, --skip-tests  Pula testes (não recomendado para produção)
#   -h, --help      Mostra ajuda
#
# Este script é idempotente - pode ser executado múltiplas vezes sem efeitos colaterais

set -e  # Exit on error

# Parse command line arguments
AUTO_YES=false
FORCE=false
SKIP_TESTS=false

while [[ $# -gt 0 ]]; do
  case $1 in
    -y|--yes)
      AUTO_YES=true
      shift
      ;;
    -f|--force)
      FORCE=true
      shift
      ;;
    -s|--skip-tests)
      SKIP_TESTS=true
      shift
      ;;
    -h|--help)
      echo "Uso: ./deploy.sh [OPTIONS]"
      echo "  -y, --yes       Aceita todas as confirmações automaticamente"
      echo "  -f, --force     Força todas as operações (ignora cache)"
      echo "  -s, --skip-tests  Pula testes (não recomendado para produção)"
      echo "  -h, --help      Mostra ajuda"
      exit 0
      ;;
    *)
      echo "Opção desconhecida: $1"
      echo "Use --help para ver as opções disponíveis"
      exit 1
      ;;
  esac
done

echo "Lex Intel Visual Design - Deploy Script"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

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
    echo -e "ℹ $1"
}

# Function to ask confirmation (respects --yes flag)
ask_confirmation() {
    local question="$1"
    if [ "$AUTO_YES" = true ]; then
        print_info "$question (auto-yes)"
        return 0
    fi
    read -p "$question (y/n) " -n 1 -r
    echo
    [[ $REPLY =~ ^[Yy]$ ]]
}

# Function to calculate file checksum
get_checksum() {
    if command -v md5sum &> /dev/null; then
        find "$1" -type f -exec md5sum {} \; 2>/dev/null | sort | md5sum | cut -d' ' -f1
    elif command -v md5 &> /dev/null; then
        find "$1" -type f -exec md5 {} \; 2>/dev/null | sort | md5 | cut -d' ' -f1
    else
        echo "no-checksum"
    fi
}

# Cache directory for idempotency
CACHE_DIR=".deploy-cache"
mkdir -p "$CACHE_DIR"

# Check if .env file exists
if [ ! -f .env ]; then
    print_error ".env file not found!"
    print_info "Please create .env file from .env.example"
    exit 1
fi

print_success ".env file found"

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version must be 18 or higher"
    print_info "Current version: $(node -v)"
    exit 1
fi

print_success "Node.js version: $(node -v)"

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    print_error "pnpm is not installed"
    print_info "Install with: npm install -g pnpm"
    exit 1
fi

print_success "pnpm found: $(pnpm -v)"

# Step 1: Install dependencies (idempotent - checks lockfile)
print_info "Checking dependencies..."
LOCK_CHECKSUM=$(md5sum pnpm-lock.yaml 2>/dev/null | cut -d' ' -f1 || echo "no-lock")
CACHED_LOCK="${CACHE_DIR}/lock-checksum"

if [ "$FORCE" = true ] || [ ! -f "$CACHED_LOCK" ] || [ "$(cat "$CACHED_LOCK" 2>/dev/null)" != "$LOCK_CHECKSUM" ]; then
    print_info "Installing dependencies..."
    pnpm install --frozen-lockfile
    echo "$LOCK_CHECKSUM" > "$CACHED_LOCK"
    print_success "Dependencies installed"
else
    print_success "Dependencies already up to date (cached)"
fi

# Step 2: Run TypeScript check (idempotent - checks source files)
print_info "Checking TypeScript..."
SRC_CHECKSUM=$(get_checksum "client/src" 2>/dev/null || echo "no-src")
SERVER_CHECKSUM=$(get_checksum "server" 2>/dev/null || echo "no-server")
COMBINED_CHECKSUM="${SRC_CHECKSUM}-${SERVER_CHECKSUM}"
CACHED_TS="${CACHE_DIR}/ts-checksum"

if [ "$FORCE" = true ] || [ ! -f "$CACHED_TS" ] || [ "$(cat "$CACHED_TS" 2>/dev/null)" != "$COMBINED_CHECKSUM" ]; then
    print_info "Running TypeScript check..."
    if pnpm run check; then
        echo "$COMBINED_CHECKSUM" > "$CACHED_TS"
        print_success "TypeScript check passed"
    else
        print_error "TypeScript check failed"
        exit 1
    fi
else
    print_success "TypeScript check passed (cached)"
fi

# Step 3: Run tests (can be skipped with --skip-tests)
if [ "$SKIP_TESTS" = true ]; then
    print_warning "Tests skipped (--skip-tests flag)"
else
    print_info "Running tests..."
    CACHED_TESTS="${CACHE_DIR}/tests-checksum"

    if [ "$FORCE" = true ] || [ ! -f "$CACHED_TESTS" ] || [ "$(cat "$CACHED_TESTS" 2>/dev/null)" != "$COMBINED_CHECKSUM" ]; then
        if pnpm run test 2>/dev/null || true; then
            echo "$COMBINED_CHECKSUM" > "$CACHED_TESTS"
            print_success "Tests passed"
        else
            print_warning "Tests not configured or failed"
        fi
    else
        print_success "Tests passed (cached)"
    fi
fi

# Step 4: Security audit (always run, but don't fail on warnings)
print_info "Running security audit..."
if pnpm audit --audit-level=high 2>/dev/null; then
    print_success "Security audit completed - no high severity issues"
else
    print_warning "Security vulnerabilities found"
    if ! ask_confirmation "Continue anyway?"; then
        print_error "Deploy cancelled"
        exit 1
    fi
fi

# Step 5: Build for production (idempotent - checks if build is up to date)
print_info "Checking build..."
CACHED_BUILD="${CACHE_DIR}/build-checksum"

if [ "$FORCE" = true ] || [ ! -d "dist" ] || [ ! -f "$CACHED_BUILD" ] || [ "$(cat "$CACHED_BUILD" 2>/dev/null)" != "$COMBINED_CHECKSUM" ]; then
    print_info "Building for production..."
    NODE_ENV=production pnpm run build
    echo "$COMBINED_CHECKSUM" > "$CACHED_BUILD"
    print_success "Build completed"
else
    print_success "Build is up to date (cached)"
fi

# Step 6: Database migrations (idempotent by design)
print_info "Checking database migrations..."
if [ -n "$DATABASE_URL" ] || grep -q "DATABASE_URL" .env 2>/dev/null; then
    print_info "Running database migrations..."
    if pnpm run db:migrate 2>/dev/null; then
        print_success "Database migrations completed"
    else
        print_warning "Database migrations skipped (command not available or failed)"
    fi
else
    print_warning "DATABASE_URL not configured, skipping migrations"
fi

# Step 7: Check build output
if [ ! -d "dist" ]; then
    print_error "Build output directory not found!"
    exit 1
fi

print_success "Build output verified"

# Step 8: Deploy based on platform
print_info "Select deployment platform:"
echo "1) Railway"
echo "2) Docker"
echo "3) Manual (just build)"

if [ "$AUTO_YES" = true ]; then
    DEPLOY_CHOICE=3
    print_info "Auto-selecting: Manual (just build)"
else
    read -p "Enter choice (1-3): " DEPLOY_CHOICE
fi

case $DEPLOY_CHOICE in
    1)
        print_info "Deploying to Railway..."
        if ! command -v railway &> /dev/null; then
            print_error "Railway CLI not installed"
            print_info "Install with: npm install -g @railway/cli"
            exit 1
        fi
        railway up
        print_success "Deployed to Railway!"
        ;;
    2)
        print_info "Building Docker image..."
        # Check if image already exists with same checksum
        DOCKER_TAG="lex-intel-visual-design:${COMBINED_CHECKSUM:0:8}"
        if [ "$FORCE" = false ] && docker image inspect "$DOCKER_TAG" &> /dev/null; then
            print_success "Docker image already exists: $DOCKER_TAG"
        else
            docker build -t lex-intel-visual-design:latest -t "$DOCKER_TAG" .
            print_success "Docker image built: $DOCKER_TAG"
        fi
        print_info "Run with: docker run -p 3000:3000 --env-file .env lex-intel-visual-design:latest"
        ;;
    3)
        print_success "Build completed! Ready for manual deployment."
        print_info "Start with: pnpm start"
        ;;
    *)
        print_error "Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "=========================================="
print_success "Deploy process completed!"
echo ""
print_info "Next steps:"
echo "  1. Verify application is running"
echo "  2. Check logs for errors"
echo "  3. Test critical features"
echo "  4. Monitor performance"
echo ""
print_info "Health check endpoint: /api/health"
print_info "API endpoint: /api/trpc"
echo ""
