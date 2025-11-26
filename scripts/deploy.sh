#!/bin/bash

# Lex Intel Visual Design - Deploy Script
# Desenvolvido por Lex Intelligentia
# Script automatizado para deploy em produção

set -e  # Exit on error

echo "🚀 Lex Intel Visual Design - Deploy Script"
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

# Step 1: Install dependencies
print_info "Installing dependencies..."
pnpm install --frozen-lockfile
print_success "Dependencies installed"

# Step 2: Run TypeScript check
print_info "Running TypeScript check..."
pnpm run check
print_success "TypeScript check passed"

# Step 3: Run tests
print_info "Running tests..."
pnpm run test
print_success "Tests passed"

# Step 4: Security audit
print_info "Running security audit..."
pnpm audit --audit-level=moderate || {
    print_warning "Security vulnerabilities found"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_error "Deploy cancelled"
        exit 1
    fi
}
print_success "Security audit completed"

# Step 5: Build for production
print_info "Building for production..."
NODE_ENV=production pnpm run build
print_success "Build completed"

# Step 6: Database migrations
print_info "Running database migrations..."
pnpm run db:migrate
print_success "Database migrations completed"

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
read -p "Enter choice (1-3): " DEPLOY_CHOICE

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
        docker build -t lex-intel-visual-design:latest .
        print_success "Docker image built!"
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
print_info "Health check endpoint: /health"
print_info "API endpoint: /api/trpc"
echo ""
