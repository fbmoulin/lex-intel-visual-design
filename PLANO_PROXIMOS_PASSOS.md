# Plano de Execução - Próximos Passos

## Lex Intel Visual Design - Atualização Completa do Design

**Data:** 16 de Dezembro de 2025  
**Versão:** 1.0.0-beta  
**Desenvolvido por:** Lex Intelligentia

---

## Objetivo

Completar a atualização do design do Lex Intel Visual Design com tema escuro e gradiente laranja da Lex Intelligentia em **todas as páginas e componentes**, adicionar animações profissionais e fazer deploy das mudanças.

---

## Fases de Execução

### Fase 1: Atualizar Página do Editor ⏳

**Escopo:**
- Atualizar background para tema escuro
- Aplicar gradiente laranja nos elementos de destaque
- Atualizar formulário de edição (inputs, labels, botões)
- Atualizar área de preview com tema consistente
- Atualizar modal de exportação com novo design
- Manter funcionalidade de preview em tempo real

**Arquivos a modificar:**
- `/client/src/pages/Editor.tsx`
- `/client/src/components/ExportModal.tsx` (se existir)

**Estimativa:** 30 minutos

---

### Fase 2: Atualizar Página Minhas Petições ⏳

**Escopo:**
- Atualizar background para tema escuro
- Atualizar cards de listagem de petições
- Atualizar barra de busca e filtros
- Atualizar botões de ação (editar, excluir)
- Atualizar estados vazios e loading

**Arquivos a modificar:**
- `/client/src/pages/MyPetitions.tsx`

**Estimativa:** 20 minutos

---

### Fase 3: Atualizar Componentes de Visual Law ⏳

**Escopo:**
- **Timeline:** Atualizar cores para laranja, fundo escuro
- **SummaryCard:** Atualizar estilo para tema escuro
- **PetitionChart:** Atualizar cores dos gráficos para paleta laranja
- **PetitionPreview:** Atualizar container de preview

**Arquivos a modificar:**
- `/client/src/components/visual-law/Timeline.tsx`
- `/client/src/components/visual-law/SummaryCard.tsx`
- `/client/src/components/visual-law/PetitionChart.tsx`
- `/client/src/components/PetitionPreview.tsx`

**Estimativa:** 40 minutos

---

### Fase 4: Adicionar Animações e Micro-interações ⏳

**Escopo:**
- **Fade-in:** Animação de entrada para seções
- **Slide-up:** Animação para cards ao aparecer
- **Hover effects:** Transições suaves em botões e cards
- **Loading states:** Skeleton loaders com tema escuro
- **Page transitions:** Transições entre páginas

**Implementação:**
```css
/* Animações a adicionar no index.css */
@keyframes fadeIn { ... }
@keyframes slideUp { ... }
@keyframes pulse { ... }
@keyframes shimmer { ... }
```

**Estimativa:** 30 minutos

---

### Fase 5: Testar e Validar Consistência Visual ⏳

**Escopo:**
- Navegar por todas as páginas
- Verificar consistência de cores
- Testar responsividade (mobile, tablet, desktop)
- Verificar contraste e legibilidade
- Testar modo escuro/claro (se aplicável)
- Capturar screenshots de validação

**Checklist:**
- [ ] Home page
- [ ] Templates page
- [ ] Editor page
- [ ] Minhas Petições page
- [ ] Componentes Visual Law
- [ ] Modais e overlays
- [ ] Estados de loading
- [ ] Estados de erro
- [ ] Responsividade mobile

**Estimativa:** 20 minutos

---

### Fase 6: Commit e Push para GitHub ⏳

**Escopo:**
- Adicionar todos os arquivos modificados
- Criar commit descritivo
- Push para branch de desenvolvimento
- Criar PR para main (se necessário)
- Atualizar CHANGELOG

**Comandos:**
```bash
git add -A
git commit -m "feat(design): atualizar tema para escuro com gradiente laranja Lex Intelligentia

- Atualizar CSS global com novas variáveis de cor
- Atualizar Header e Footer com logo oficial
- Atualizar Home, Templates, Editor e Minhas Petições
- Atualizar componentes Visual Law (Timeline, SummaryCard, Charts)
- Adicionar animações e micro-interações
- Manter consistência visual em todas as páginas"

git push github main
```

**Estimativa:** 10 minutos

---

### Fase 7: Capturar Screenshots e Entregar ⏳

**Escopo:**
- Capturar screenshots de todas as páginas
- Criar documento de comparação antes/depois
- Gerar relatório final de mudanças
- Entregar ao usuário com links e arquivos

**Deliverables:**
- Screenshots de todas as páginas
- Documento de resumo das mudanças
- Link para preview ao vivo
- Link para repositório GitHub

**Estimativa:** 15 minutos

---

## Resumo de Tempo

| Fase | Descrição | Tempo Estimado |
|------|-----------|----------------|
| 1 | Editor | 30 min |
| 2 | Minhas Petições | 20 min |
| 3 | Componentes Visual Law | 40 min |
| 4 | Animações | 30 min |
| 5 | Testes | 20 min |
| 6 | Git Push | 10 min |
| 7 | Entrega | 15 min |
| **Total** | | **~2h45min** |

---

## Paleta de Cores de Referência

```css
/* Cores principais */
--lex-orange-start: #ff6b00;
--lex-orange-mid: #ff8c00;
--lex-orange-end: #ffa500;

/* Backgrounds */
--background: #000000;
--card: #0a0a0a;
--card-hover: #111111;

/* Bordas e separadores */
--border: #1a1a1a;
--border-accent: rgba(255, 140, 0, 0.3);

/* Texto */
--foreground: #ffffff;
--muted-foreground: #a0a0a0;
```

---

## Critérios de Sucesso

1. ✅ Todas as páginas com tema escuro consistente
2. ✅ Gradiente laranja aplicado em elementos de destaque
3. ✅ Logo da Lex Intelligentia visível em todas as páginas
4. ✅ Animações suaves e profissionais
5. ✅ Responsividade mantida
6. ✅ Funcionalidades preservadas
7. ✅ Código commitado no GitHub

---

**Pronto para iniciar a execução!**

*Desenvolvido por Lex Intelligentia*
