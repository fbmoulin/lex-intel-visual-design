# Lex Intel Visual Design - TODO

## Fase 0: Atualização de Branding
- [x] Atualizar título do projeto para "Lex Intel Visual Design"
- [ ] Adicionar referência "Desenvolvido por Lex Intelligentia"
- [x] Atualizar logo no código
- [ ] Atualizar documentação do projeto
- [x] Implementar modo escuro configurável
- [x] Padronizar design em todas as páginas (benchmark visual)
- [x] Criar estimativa de custo escalonável para primeiro mês

## Integração SaaS
- [x] Fazer upgrade do projeto para web-db-user
- [x] Criar schema do banco de dados (users, petitions)
- [x] Implementar rotas de API para CRUD de petições
- [ ] Integrar autenticação no frontend
- [ ] Proteger rotas que requerem autenticação
- [x] Criar interface de histórico de petições salvas
- [x] Criar página Minhas Petições e adicionar rota
- [x] Implementar listagem de petições com cards visuais
- [x] Adicionar busca por número/autor/título
- [x] Implementar filtros por tipo de petição
- [x] Adicionar botão Editar que redireciona para editor com ID
- [x] Implementar exclusão de petições com confirmação
- [x] Adicionar estados vazios (sem petições salvas)
- [x] Adicionar botão "Salvar Petição" no editor
- [x] Implementar lógica de salvamento com API tRPC
- [x] Adicionar feedback visual (loading, sucesso, erro)
- [x] Implementar carregamento de petições salvas no editor
- [x] Adicionar suporte para parâmetro de URL ?id=<petition_id>
- [x] Implementar useEffect para carregar petição ao montar componente
- [x] Preencher formulário com dados da petição carregada
- [x] Testar fluxo completo: salvar → recarregar página com ID → verificar dados
- [x] Adicionar atualização automática (update vs create)
- [ ] Adicionar controle de acesso (usuário só vê suas próprias petições)

## Fase 1: Configuração e Componentes Básicos
- [x] Configurar Design System (cores, tipografia, espaçamento)
- [x] Implementar componente Button com todas as variantes
- [x] Implementar componentes de Input (Input, Textarea, Select)
- [x] Implementar componente Card com todas as subpartes
- [x] Criar página inicial com navegação

## Fase 2: Componentes de Visual Law
- [x] Implementar componente Timeline para cronologias processuais
- [x] Implementar componente de Gráficos (BarChart com Recharts)
- [x] Implementar componente Summary Card
- [x] Criar biblioteca de ícones jurídicos

## Fase 3: Templates de Petição
- [ ] Criar template de Petição Civil
- [ ] Criar template de Petição Trabalhista
- [ ] Criar template de Petição Criminal
- [ ] Criar template de Petição Tributária
- [ ] Criar template de Petição de Direito do Consumidor

## Fase 4: Funcionalidades do Editor
- [x] Criar editor de petições com formulário dinâmico
- [x] Implementar seletor de templates
- [x] Implementar preview em tempo real
- [x] Implementar geração de PDF com fidelidade visual
- [x] Adicionar biblioteca html2canvas e jsPDF
- [x] Criar componente de renderização para PDF
- [x] Preservar estilos de Timeline, SummaryCard e gráficos

## Fase 5: Testes e Otimização
- [ ] Testar responsividade em diferentes dispositivos
- [ ] Testar acessibilidade dos componentes
- [ ] Otimizar performance de renderização
- [ ] Validar geração de PDF

## Bugs Conhecidos
_Nenhum bug identificado ainda_
