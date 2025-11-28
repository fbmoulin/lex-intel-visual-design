#!/bin/bash

# Lex Intel Visual Design - Full Pipeline Automation
# Desenvolvido por Lex Intelligentia
#
# Este script orquestra o pipeline completo de setup e deploy:
# 1. Configuração completa do GitHub (workflows, proteções, release)
# 2. Deploy da aplicação em produção
#
# Uso: ./full-pipeline.sh [OPTIONS]
#   -y, --yes       Aceita todas as confirmações automaticamente
#   -f, --force     Força todas as operações
#   --skip-phase1   Pula Fase 1 (GitHub setup)
#   --skip-phase2   Pula Fase 2 (Deploy)
#   -h, --help      Mostra ajuda
#
# Este script é idempotente - pode ser executado múltiplas vezes sem efeitos colaterais

set -e  # Exit on error

# Parse command line arguments
AUTO_YES=false
FORCE=false
SKIP_PHASE1=false
SKIP_PHASE2=false

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
    --skip-phase1)
      SKIP_PHASE1=true
      shift
      ;;
    --skip-phase2)
      SKIP_PHASE2=true
      shift
      ;;
    -h|--help)
      echo "Uso: ./full-pipeline.sh [OPTIONS]"
      echo "  -y, --yes       Aceita todas as confirmações automaticamente"
      echo "  -f, --force     Força todas as operações"
      echo "  --skip-phase1   Pula Fase 1 (GitHub setup)"
      echo "  --skip-phase2   Pula Fase 2 (Deploy)"
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

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

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

print_step() {
    echo -e "${MAGENTA}▶ $1${NC}"
}

print_header() {
    echo ""
    echo -e "${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║$(printf '%60s' | tr ' ' ' ')║${NC}"
    local text="$1"
    local padding=$(( (60 - ${#text}) / 2 ))
    printf "${CYAN}║%*s%s%*s║${NC}\n" $padding "" "$text" $((60 - ${#text} - padding)) ""
    echo -e "${CYAN}║$(printf '%60s' | tr ' ' ' ')║${NC}"
    echo -e "${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

print_separator() {
    echo ""
    echo -e "${CYAN}────────────────────────────────────────────────────────────${NC}"
    echo ""
}

# Function to print progress bar
print_progress() {
    local current=$1
    local total=$2
    local width=50
    local percentage=$((current * 100 / total))
    local completed=$((width * current / total))
    local remaining=$((width - completed))
    
    printf "\r${CYAN}Progress: [${NC}"
    printf "%${completed}s" | tr ' ' '█'
    printf "%${remaining}s" | tr ' ' '░'
    printf "${CYAN}] ${percentage}%% (${current}/${total})${NC}"
    
    if [ $current -eq $total ]; then
        echo ""
    fi
}

# Function to log to file
log_file="${PROJECT_ROOT}/pipeline-$(date +%Y%m%d-%H%M%S).log"
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$log_file"
}

# Function to check prerequisites
check_prerequisites() {
    print_header "Verificando Pré-requisitos"
    
    local checks_passed=0
    local total_checks=6
    
    # Check 1: Git
    print_step "Verificando Git..."
    if command -v git &> /dev/null; then
        print_success "Git instalado: $(git --version | head -1)"
        ((checks_passed++))
    else
        print_error "Git não encontrado"
        return 1
    fi
    print_progress $checks_passed $total_checks
    
    # Check 2: Node.js
    print_step "Verificando Node.js..."
    if command -v node &> /dev/null; then
        local node_version=$(node --version)
        print_success "Node.js instalado: $node_version"
        ((checks_passed++))
    else
        print_error "Node.js não encontrado"
        return 1
    fi
    print_progress $checks_passed $total_checks
    
    # Check 3: pnpm
    print_step "Verificando pnpm..."
    if command -v pnpm &> /dev/null; then
        print_success "pnpm instalado: $(pnpm --version)"
        ((checks_passed++))
    else
        print_error "pnpm não encontrado"
        return 1
    fi
    print_progress $checks_passed $total_checks
    
    # Check 4: GitHub CLI (optional for setup-github.sh)
    print_step "Verificando GitHub CLI..."
    if command -v gh &> /dev/null; then
        print_success "GitHub CLI instalado: $(gh --version | head -1)"
        ((checks_passed++))
    else
        print_warning "GitHub CLI não encontrado (opcional)"
        print_info "Será usado setup-github-simple.sh em vez de setup-github.sh"
        ((checks_passed++))
    fi
    print_progress $checks_passed $total_checks
    
    # Check 5: Project directory
    print_step "Verificando diretório do projeto..."
    if [ -f "${PROJECT_ROOT}/package.json" ]; then
        print_success "Diretório do projeto correto"
        ((checks_passed++))
    else
        print_error "Não está no diretório do projeto"
        return 1
    fi
    print_progress $checks_passed $total_checks
    
    # Check 6: Scripts exist
    print_step "Verificando scripts..."
    if [ -f "${SCRIPT_DIR}/setup-github.sh" ] && [ -f "${SCRIPT_DIR}/deploy.sh" ]; then
        print_success "Scripts encontrados"
        ((checks_passed++))
    else
        print_error "Scripts não encontrados"
        return 1
    fi
    print_progress $checks_passed $total_checks
    
    echo ""
    print_success "Todos os pré-requisitos atendidos! ($checks_passed/$total_checks)"
    log "Prerequisites check passed: $checks_passed/$total_checks"
}

# Function to show pipeline overview
show_pipeline_overview() {
    print_header "Pipeline Completo - Visão Geral"
    
    echo -e "${CYAN}Este pipeline executará as seguintes etapas:${NC}"
    echo ""
    echo -e "${MAGENTA}FASE 1: CONFIGURAÇÃO DO GITHUB${NC}"
    echo "  1.1 Adicionar GitHub Actions workflows"
    echo "  1.2 Configurar proteções de branch"
    echo "  1.3 Criar release da versão beta"
    echo "  1.4 Configurar About section"
    echo "  1.5 Habilitar Discussions (opcional)"
    echo ""
    echo -e "${MAGENTA}FASE 2: DEPLOY DA APLICAÇÃO${NC}"
    echo "  2.1 Validações (TypeScript, testes, audit)"
    echo "  2.2 Build de produção"
    echo "  2.3 Migrações de banco de dados"
    echo "  2.4 Deploy para plataforma escolhida"
    echo ""
    echo -e "${CYAN}Tempo estimado: 5-10 minutos${NC}"
    echo -e "${CYAN}Log será salvo em: ${log_file}${NC}"
    echo ""
}

# Function to ask for confirmation (respects --yes flag)
ask_confirmation() {
    local question="$1"
    local default="${2:-n}"

    # Auto-yes mode
    if [ "$AUTO_YES" = true ]; then
        print_info "$question (auto-yes)"
        return 0
    fi

    if [ "$default" = "y" ]; then
        read -p "$(echo -e ${YELLOW}${question}${NC}) [Y/n] " -n 1 -r
    else
        read -p "$(echo -e ${YELLOW}${question}${NC}) [y/N] " -n 1 -r
    fi
    echo

    if [ "$default" = "y" ]; then
        [[ $REPLY =~ ^[Nn]$ ]] && return 1 || return 0
    else
        [[ $REPLY =~ ^[Yy]$ ]] && return 0 || return 1
    fi
}

# Function to execute Phase 1: GitHub Setup
execute_phase1() {
    print_header "FASE 1: Configuração do GitHub"

    # Skip if flag is set
    if [ "$SKIP_PHASE1" = true ]; then
        print_warning "Fase 1 pulada (--skip-phase1 flag)"
        log "Phase 1 skipped (--skip-phase1 flag)"
        return 0
    fi

    log "Starting Phase 1: GitHub Setup"

    local setup_script=""
    local script_args=""

    # Build arguments to pass to child scripts
    [ "$AUTO_YES" = true ] && script_args="$script_args --yes"
    [ "$FORCE" = true ] && script_args="$script_args --force"

    # Determine which setup script to use
    if command -v gh &> /dev/null && gh auth status &> /dev/null; then
        print_info "GitHub CLI detectado e autenticado"
        if ask_confirmation "Usar setup completo (setup-github.sh)?" "y"; then
            setup_script="${SCRIPT_DIR}/setup-github.sh"
        else
            setup_script="${SCRIPT_DIR}/setup-github-simple.sh"
        fi
    else
        print_warning "GitHub CLI não disponível ou não autenticado"
        print_info "Usando setup simplificado (setup-github-simple.sh)"
        setup_script="${SCRIPT_DIR}/setup-github-simple.sh"
    fi

    print_separator
    print_step "Executando: $(basename $setup_script) $script_args"
    echo ""

    # Execute setup script
    if [ -x "$setup_script" ]; then
        log "Executing: $setup_script $script_args"
        if bash "$setup_script" $script_args; then
            print_separator
            print_success "Fase 1 concluída com sucesso!"
            log "Phase 1 completed successfully"
            return 0
        else
            print_separator
            print_error "Fase 1 falhou"
            log "Phase 1 failed"
            return 1
        fi
    else
        print_error "Script não encontrado ou não executável: $setup_script"
        log "Script not found or not executable: $setup_script"
        return 1
    fi
}

# Function to execute Phase 2: Deploy
execute_phase2() {
    print_header "FASE 2: Deploy da Aplicação"

    # Skip if flag is set
    if [ "$SKIP_PHASE2" = true ]; then
        print_warning "Fase 2 pulada (--skip-phase2 flag)"
        log "Phase 2 skipped (--skip-phase2 flag)"
        return 0
    fi

    log "Starting Phase 2: Deploy"

    local script_args=""

    # Build arguments to pass to child scripts
    [ "$AUTO_YES" = true ] && script_args="$script_args --yes"
    [ "$FORCE" = true ] && script_args="$script_args --force"

    print_info "O script de deploy será executado"
    if [ "$AUTO_YES" = false ]; then
        print_info "Você poderá escolher a plataforma de deploy"
    fi

    print_separator

    if ask_confirmation "Continuar com o deploy?" "y"; then
        print_step "Executando: deploy.sh $script_args"
        echo ""

        # Execute deploy script
        if [ -x "${SCRIPT_DIR}/deploy.sh" ]; then
            log "Executing: deploy.sh $script_args"
            if bash "${SCRIPT_DIR}/deploy.sh" $script_args; then
                print_separator
                print_success "Fase 2 concluída com sucesso!"
                log "Phase 2 completed successfully"
                return 0
            else
                print_separator
                print_error "Fase 2 falhou"
                log "Phase 2 failed"
                return 1
            fi
        else
            print_error "Script de deploy não encontrado: ${SCRIPT_DIR}/deploy.sh"
            log "Deploy script not found"
            return 1
        fi
    else
        print_warning "Deploy cancelado pelo usuário"
        log "Deploy cancelled by user"
        return 2  # Special code for user cancellation
    fi
}

# Function to show summary
show_summary() {
    local phase1_status=$1
    local phase2_status=$2
    
    print_header "RESUMO DO PIPELINE"
    
    echo -e "${CYAN}Status das Fases:${NC}"
    echo ""
    
    # Phase 1 status
    if [ $phase1_status -eq 0 ]; then
        echo -e "  ${GREEN}✓${NC} Fase 1: Configuração do GitHub - ${GREEN}SUCESSO${NC}"
    else
        echo -e "  ${RED}✗${NC} Fase 1: Configuração do GitHub - ${RED}FALHOU${NC}"
    fi
    
    # Phase 2 status
    if [ $phase2_status -eq 0 ]; then
        echo -e "  ${GREEN}✓${NC} Fase 2: Deploy da Aplicação - ${GREEN}SUCESSO${NC}"
    elif [ $phase2_status -eq 2 ]; then
        echo -e "  ${YELLOW}⊘${NC} Fase 2: Deploy da Aplicação - ${YELLOW}CANCELADO${NC}"
    elif [ $phase2_status -eq 99 ]; then
        echo -e "  ${YELLOW}−${NC} Fase 2: Deploy da Aplicação - ${YELLOW}NÃO EXECUTADO${NC}"
    else
        echo -e "  ${RED}✗${NC} Fase 2: Deploy da Aplicação - ${RED}FALHOU${NC}"
    fi
    
    echo ""
    print_separator
    
    # Overall status
    if [ $phase1_status -eq 0 ] && [ $phase2_status -eq 0 ]; then
        echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
        echo -e "${GREEN}║                                                            ║${NC}"
        echo -e "${GREEN}║              ✓ PIPELINE CONCLUÍDO COM SUCESSO!             ║${NC}"
        echo -e "${GREEN}║                                                            ║${NC}"
        echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
        log "Pipeline completed successfully"
    else
        echo -e "${YELLOW}╔════════════════════════════════════════════════════════════╗${NC}"
        echo -e "${YELLOW}║                                                            ║${NC}"
        echo -e "${YELLOW}║           ⚠ PIPELINE CONCLUÍDO COM AVISOS                  ║${NC}"
        echo -e "${YELLOW}║                                                            ║${NC}"
        echo -e "${YELLOW}╚════════════════════════════════════════════════════════════╝${NC}"
        log "Pipeline completed with warnings"
    fi
    
    echo ""
    print_info "Log completo salvo em: ${log_file}"
    echo ""
    
    # Next steps
    print_info "Próximos passos:"
    if [ $phase1_status -eq 0 ]; then
        echo "  • Verifique workflows: https://github.com/fbmoulin/lex-intel-visual-design/actions"
        echo "  • Verifique proteções: https://github.com/fbmoulin/lex-intel-visual-design/settings/branches"
        echo "  • Verifique release: https://github.com/fbmoulin/lex-intel-visual-design/releases"
    fi
    if [ $phase2_status -eq 0 ]; then
        echo "  • Acesse a aplicação em produção"
        echo "  • Configure monitoramento"
        echo "  • Teste funcionalidades críticas"
    fi
    echo ""
}

# Function to handle errors
handle_error() {
    local exit_code=$1
    local phase=$2
    
    print_separator
    print_error "Erro na $phase (código: $exit_code)"
    log "Error in $phase (exit code: $exit_code)"
    
    if ask_confirmation "Deseja ver o log completo?" "n"; then
        cat "$log_file"
    fi
    
    if ask_confirmation "Deseja continuar mesmo assim?" "n"; then
        print_warning "Continuando apesar do erro..."
        log "User chose to continue despite error"
        return 0
    else
        print_info "Pipeline interrompido pelo usuário"
        log "Pipeline interrupted by user"
        return 1
    fi
}

# Main execution
main() {
    clear
    
    # Welcome banner
    echo ""
    echo -e "${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║                                                            ║${NC}"
    echo -e "${CYAN}║        ${MAGENTA}Lex Intel Visual Design${CYAN}                          ║${NC}"
    echo -e "${CYAN}║        ${BLUE}Full Pipeline Automation${CYAN}                          ║${NC}"
    echo -e "${CYAN}║                                                            ║${NC}"
    echo -e "${CYAN}║        Setup Completo + Deploy em Produção                ║${NC}"
    echo -e "${CYAN}║                                                            ║${NC}"
    echo -e "${CYAN}║        ${GREEN}Desenvolvido por Lex Intelligentia${CYAN}                 ║${NC}"
    echo -e "${CYAN}║                                                            ║${NC}"
    echo -e "${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    log "Pipeline started"
    log "Project root: $PROJECT_ROOT"
    log "Script directory: $SCRIPT_DIR"
    
    # Change to project root
    cd "$PROJECT_ROOT" || exit 1
    
    # Check prerequisites
    if ! check_prerequisites; then
        print_error "Pré-requisitos não atendidos. Abortando."
        log "Prerequisites check failed. Aborting."
        exit 1
    fi
    
    # Show pipeline overview
    show_pipeline_overview
    
    # Ask for final confirmation
    if ! ask_confirmation "Deseja iniciar o pipeline completo?" "y"; then
        print_warning "Pipeline cancelado pelo usuário"
        log "Pipeline cancelled by user"
        exit 0
    fi
    
    # Initialize status variables
    phase1_status=99
    phase2_status=99
    
    # Execute Phase 1: GitHub Setup
    if execute_phase1; then
        phase1_status=0
    else
        phase1_status=$?
        if ! handle_error $phase1_status "Fase 1"; then
            show_summary $phase1_status $phase2_status
            exit 1
        fi
    fi
    
    # Checkpoint between phases
    print_separator
    print_info "Checkpoint: Fase 1 concluída"
    if ! ask_confirmation "Continuar para Fase 2 (Deploy)?" "y"; then
        print_warning "Pipeline interrompido após Fase 1"
        log "Pipeline stopped after Phase 1"
        show_summary $phase1_status $phase2_status
        exit 0
    fi
    
    # Execute Phase 2: Deploy
    if execute_phase2; then
        phase2_status=0
    else
        phase2_status=$?
        if [ $phase2_status -ne 2 ]; then  # Not user cancellation
            handle_error $phase2_status "Fase 2"
        fi
    fi
    
    # Show final summary
    show_summary $phase1_status $phase2_status
    
    # Exit with appropriate code
    if [ $phase1_status -eq 0 ] && [ $phase2_status -eq 0 ]; then
        log "Pipeline completed successfully"
        exit 0
    else
        log "Pipeline completed with errors or warnings"
        exit 1
    fi
}

# Trap errors
trap 'print_error "Pipeline interrompido por erro"; log "Pipeline interrupted by error"; exit 1' ERR

# Run main function
main "$@"
