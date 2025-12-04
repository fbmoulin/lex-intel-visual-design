#!/usr/bin/env bash
# =============================================================================
# Pre-Deploy Verification Script
# Lex Intel Visual Design - Desenvolvido por Lex Intelligentia
# =============================================================================
#
# This script performs comprehensive checks before deployment to ensure
# the application is ready for production.
#
# Usage:
#   ./scripts/pre-deploy.sh              # Run all checks
#   ./scripts/pre-deploy.sh --quick      # Skip slow checks (tests, build)
#   ./scripts/pre-deploy.sh --help       # Show help
#
# Exit codes:
#   0 - All checks passed
#   1 - One or more checks failed
#
# =============================================================================

# Don't exit on error - we handle errors ourselves
set +e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0
WARNINGS=0

# Parse arguments
QUICK_MODE=false
for arg in "$@"; do
    case $arg in
        --quick)
            QUICK_MODE=true
            ;;
        --help)
            echo "Usage: ./scripts/pre-deploy.sh [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --quick    Skip slow checks (tests, build)"
            echo "  --help     Show this help message"
            exit 0
            ;;
    esac
done

# Helper functions
print_header() {
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
}

print_check() {
    echo -e "  ${BLUE}→${NC} $1..."
}

print_pass() {
    echo -e "  ${GREEN}✓${NC} $1"
    ((PASSED++))
}

print_fail() {
    echo -e "  ${RED}✗${NC} $1"
    ((FAILED++))
}

print_warn() {
    echo -e "  ${YELLOW}⚠${NC} $1"
    ((WARNINGS++))
}

# =============================================================================
# PRE-FLIGHT CHECKS
# =============================================================================

print_header "PRE-DEPLOY VERIFICATION - Lex Intel Visual Design"
echo ""
echo "  Mode: $([ "$QUICK_MODE" = true ] && echo 'Quick' || echo 'Full')"
echo "  Date: $(date '+%Y-%m-%d %H:%M:%S')"
echo "  Node: $(node -v)"
echo "  pnpm: $(pnpm -v)"

# =============================================================================
# 1. ENVIRONMENT CHECKS
# =============================================================================

print_header "1. Environment Checks"

# Check Node.js version
print_check "Node.js version"
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -ge 18 ]; then
    print_pass "Node.js v$NODE_VERSION (>= 18 required)"
else
    print_fail "Node.js v$NODE_VERSION (>= 18 required)"
fi

# Check pnpm version
print_check "pnpm version"
PNPM_VERSION=$(pnpm -v | cut -d'.' -f1)
if [ "$PNPM_VERSION" -ge 8 ]; then
    print_pass "pnpm v$(pnpm -v) (>= 8 required)"
else
    print_fail "pnpm v$(pnpm -v) (>= 8 required)"
fi

# Check for .env file
print_check ".env file exists"
if [ -f ".env" ]; then
    print_pass ".env file found"
else
    print_warn ".env file not found (required for local testing)"
fi

# Check required env vars (from .env or environment)
print_check "Required environment variables"
MISSING_VARS=""

# Check for JWT_SECRET
if [ -z "$JWT_SECRET" ] && ! grep -q "^JWT_SECRET=" .env 2>/dev/null; then
    MISSING_VARS="$MISSING_VARS JWT_SECRET"
fi

# Check for DATABASE_URL
if [ -z "$DATABASE_URL" ] && ! grep -q "^DATABASE_URL=" .env 2>/dev/null; then
    MISSING_VARS="$MISSING_VARS DATABASE_URL"
fi

# Check for OAUTH_SERVER_URL
if [ -z "$OAUTH_SERVER_URL" ] && ! grep -q "^OAUTH_SERVER_URL=" .env 2>/dev/null; then
    MISSING_VARS="$MISSING_VARS OAUTH_SERVER_URL"
fi

if [ -z "$MISSING_VARS" ]; then
    print_pass "All required environment variables set"
else
    print_warn "Missing environment variables:$MISSING_VARS"
fi

# =============================================================================
# 2. DEPENDENCY CHECKS
# =============================================================================

print_header "2. Dependency Checks"

# Check if node_modules exists
print_check "Dependencies installed"
if [ -d "node_modules" ]; then
    print_pass "node_modules exists"
else
    print_fail "node_modules not found - run 'pnpm install'"
fi

# Check for outdated dependencies (warning only)
print_check "Dependency freshness"
OUTDATED=$(pnpm outdated 2>/dev/null | wc -l)
if [ "$OUTDATED" -gt 2 ]; then
    print_warn "$((OUTDATED-2)) packages can be updated"
else
    print_pass "Dependencies up to date"
fi

# Security audit
print_check "Security vulnerabilities"
if pnpm audit --audit-level=moderate 2>/dev/null | grep -q "No known vulnerabilities"; then
    print_pass "No known vulnerabilities"
else
    VULN_COUNT=$(pnpm audit --audit-level=moderate 2>/dev/null | grep -c "│" || echo "0")
    if [ "$VULN_COUNT" -gt 0 ]; then
        print_fail "Security vulnerabilities found - run 'pnpm audit'"
    else
        print_pass "No moderate or higher vulnerabilities"
    fi
fi

# =============================================================================
# 3. CODE QUALITY CHECKS
# =============================================================================

print_header "3. Code Quality Checks"

# TypeScript check
print_check "TypeScript compilation"
if pnpm run check 2>/dev/null; then
    print_pass "TypeScript compilation successful"
else
    print_fail "TypeScript errors found - run 'pnpm run check'"
fi

# Check for console.log in production code (warning)
print_check "Console statements in server code"
CONSOLE_COUNT=$(grep -r "console\." server/ --include="*.ts" 2>/dev/null | grep -v "test\." | grep -v ".test." | wc -l || echo "0")
if [ "$CONSOLE_COUNT" -gt 0 ]; then
    print_warn "$CONSOLE_COUNT console statements in server code"
else
    print_pass "No console statements in server code"
fi

# Check for TODO/FIXME in code
print_check "TODO/FIXME comments"
TODO_COUNT=$(grep -r "TODO\|FIXME" server/ client/src/ --include="*.ts" --include="*.tsx" 2>/dev/null | wc -l || echo "0")
if [ "$TODO_COUNT" -gt 0 ]; then
    print_warn "$TODO_COUNT TODO/FIXME comments found"
else
    print_pass "No TODO/FIXME comments"
fi

# =============================================================================
# 4. TEST CHECKS (skip in quick mode)
# =============================================================================

if [ "$QUICK_MODE" = false ]; then
    print_header "4. Test Checks"

    print_check "Running unit tests"
    if pnpm test 2>/dev/null | grep -q "passed"; then
        TEST_RESULT=$(pnpm test 2>&1 | grep "Tests" | tail -1)
        print_pass "Tests passed: $TEST_RESULT"
    else
        print_fail "Some tests failed - run 'pnpm test'"
    fi
else
    print_header "4. Test Checks (SKIPPED - quick mode)"
fi

# =============================================================================
# 5. BUILD CHECKS (skip in quick mode)
# =============================================================================

if [ "$QUICK_MODE" = false ]; then
    print_header "5. Build Checks"

    print_check "Production build"
    if NODE_ENV=production pnpm run build 2>/dev/null; then
        print_pass "Production build successful"

        # Check build output
        print_check "Build output"
        if [ -f "dist/index.js" ] && [ -d "dist/public" ]; then
            DIST_SIZE=$(du -sh dist/ 2>/dev/null | cut -f1)
            print_pass "Build output valid ($DIST_SIZE)"
        else
            print_fail "Build output incomplete"
        fi
    else
        print_fail "Production build failed - run 'pnpm run build'"
    fi
else
    print_header "5. Build Checks (SKIPPED - quick mode)"
fi

# =============================================================================
# 6. SECURITY CONFIGURATION CHECKS
# =============================================================================

print_header "6. Security Configuration Checks"

# Check for security headers in code
print_check "Security headers implemented"
if grep -q "Strict-Transport-Security" server/_core/security.ts 2>/dev/null; then
    print_pass "HSTS header configured"
else
    print_fail "HSTS header not found"
fi

if grep -q "Content-Security-Policy" server/_core/security.ts 2>/dev/null; then
    print_pass "CSP header configured"
else
    print_fail "CSP header not found"
fi

# Check for rate limiting
print_check "Rate limiting configured"
if grep -q "rateLimiter" server/_core/security.ts 2>/dev/null; then
    print_pass "Rate limiting implemented"
else
    print_warn "Rate limiting may not be configured"
fi

# Check for CSRF protection
print_check "CSRF protection"
if grep -q "csrf" server/_core/security.ts 2>/dev/null; then
    print_pass "CSRF protection implemented"
else
    print_warn "CSRF protection may not be configured"
fi

# =============================================================================
# 7. INFRASTRUCTURE CHECKS
# =============================================================================

print_header "7. Infrastructure Checks"

# Check Dockerfile
print_check "Dockerfile"
if [ -f "Dockerfile" ]; then
    print_pass "Dockerfile exists"
else
    print_warn "Dockerfile not found"
fi

# Check docker-compose
print_check "docker-compose.yml"
if [ -f "docker-compose.yml" ]; then
    print_pass "docker-compose.yml exists"
else
    print_warn "docker-compose.yml not found"
fi

# Check GitHub workflows
print_check "CI/CD workflows"
if [ -f ".github/workflows/ci.yml" ] && [ -f ".github/workflows/deploy.yml" ]; then
    print_pass "CI and Deploy workflows exist"
else
    print_warn "Some CI/CD workflows missing"
fi

# Check railway.json
print_check "Railway configuration"
if [ -f "railway.json" ]; then
    print_pass "railway.json exists"
else
    print_warn "railway.json not found (required for Railway deploy)"
fi

# =============================================================================
# 8. DOCUMENTATION CHECKS
# =============================================================================

print_header "8. Documentation Checks"

# Check essential docs
DOCS=("README.md" "docs/DEPLOY.md" "docs/SECURITY.md" ".env.example")
for doc in "${DOCS[@]}"; do
    print_check "$doc"
    if [ -f "$doc" ]; then
        print_pass "$doc exists"
    else
        print_warn "$doc not found"
    fi
done

# =============================================================================
# SUMMARY
# =============================================================================

print_header "SUMMARY"

echo ""
echo -e "  ${GREEN}Passed:${NC}   $PASSED"
echo -e "  ${RED}Failed:${NC}   $FAILED"
echo -e "  ${YELLOW}Warnings:${NC} $WARNINGS"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}  ✓ PRE-DEPLOY VERIFICATION PASSED${NC}"
    echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
    echo ""
    if [ $WARNINGS -gt 0 ]; then
        echo -e "  ${YELLOW}Note: $WARNINGS warnings should be reviewed before production${NC}"
    fi
    echo ""
    echo "  Ready to deploy! Run one of:"
    echo "    • git push origin main       # Deploy to staging"
    echo "    • git tag v1.x.x && git push --tags  # Deploy to production"
    echo ""
    exit 0
else
    echo -e "${RED}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${RED}  ✗ PRE-DEPLOY VERIFICATION FAILED${NC}"
    echo -e "${RED}═══════════════════════════════════════════════════════════════${NC}"
    echo ""
    echo "  Please fix the $FAILED failed check(s) before deploying."
    echo ""
    exit 1
fi
