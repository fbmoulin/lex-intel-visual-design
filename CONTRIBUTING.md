# Guia de Contribuição

Obrigado por considerar contribuir com o **Lex Intel Visual Design**! Este documento fornece diretrizes para contribuir com o projeto.

> ⚠️ **VERSÃO BETA** - Este projeto está em versão beta. Suas contribuições são especialmente valiosas nesta fase!

---

## 📋 Índice

- [Código de Conduta](#código-de-conduta)
- [Como Posso Contribuir?](#como-posso-contribuir)
- [Processo de Desenvolvimento](#processo-de-desenvolvimento)
- [Padrões de Código](#padrões-de-código)
- [Processo de Pull Request](#processo-de-pull-request)
- [Reportando Bugs](#reportando-bugs)
- [Sugerindo Melhorias](#sugerindo-melhorias)

---

## Código de Conduta

Este projeto e todos os participantes são regidos pelo nosso [Código de Conduta](CODE_OF_CONDUCT.md). Ao participar, espera-se que você mantenha este código. Por favor, reporte comportamento inaceitável para contato@lexintelligentia.com.

---

## Como Posso Contribuir?

### 🐛 Reportando Bugs

Antes de criar um bug report, verifique se o problema já não foi reportado. Se encontrar um issue existente, adicione um comentário em vez de abrir um novo.

**Como criar um bom bug report:**

- Use um título claro e descritivo
- Descreva os passos exatos para reproduzir o problema
- Forneça exemplos específicos
- Descreva o comportamento observado e o esperado
- Inclua screenshots se relevante
- Inclua informações sobre seu ambiente (OS, Node version, etc.)

### 💡 Sugerindo Melhorias

Sugestões de melhorias são sempre bem-vindas! Antes de criar uma sugestão:

- Verifique se a funcionalidade já não existe
- Verifique se já não foi sugerida
- Forneça uma descrição clara do problema que você quer resolver
- Explique por que essa melhoria seria útil

### 🔧 Contribuindo com Código

1. **Fork o repositório**
2. **Clone seu fork**
   ```bash
   git clone https://github.com/seu-usuario/lex-intel-visual-design.git
   ```
3. **Crie uma branch para sua feature**
   ```bash
   git checkout -b feature/minha-feature
   ```
4. **Faça suas alterações**
5. **Commit suas mudanças**
   ```bash
   git commit -m "feat: adiciona nova funcionalidade"
   ```
6. **Push para sua branch**
   ```bash
   git push origin feature/minha-feature
   ```
7. **Abra um Pull Request**

---

## Processo de Desenvolvimento

### Configuração do Ambiente

```bash
# Clone o repositório
git clone https://github.com/fbmoulin/lex-intel-visual-design.git
cd lex-intel-visual-design

# Instale as dependências
pnpm install

# Configure o ambiente
cp .env.example .env
# Edite .env com suas credenciais

# Execute em desenvolvimento
pnpm run dev
```

### Estrutura do Projeto

```
lex-intel-visual-design/
├── client/              # Frontend React
│   ├── src/
│   │   ├── components/  # Componentes React
│   │   ├── pages/       # Páginas da aplicação
│   │   └── lib/         # Utilitários e helpers
├── server/              # Backend Node.js
│   ├── _core/           # Configuração do servidor
│   └── routers/         # Rotas tRPC
├── docs/                # Documentação
├── scripts/             # Scripts de automação
└── tests/               # Testes
```

---

## Padrões de Código

### TypeScript

- Use TypeScript para todo código novo
- Evite `any`, use tipos específicos
- Use interfaces para objetos complexos
- Documente funções públicas com JSDoc

### Estilo de Código

- Use Prettier para formatação (configurado no projeto)
- Siga as convenções do ESLint
- Use nomes descritivos para variáveis e funções
- Mantenha funções pequenas e focadas

### Commits

Seguimos a convenção [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Mudanças na documentação
- `style:` Formatação, ponto e vírgula, etc.
- `refactor:` Refatoração de código
- `test:` Adição ou correção de testes
- `chore:` Mudanças em ferramentas, configurações, etc.

**Exemplos:**
```
feat: adiciona exportação para DOCX
fix: corrige erro ao salvar petição
docs: atualiza guia de instalação
```

---

## Processo de Pull Request

### Antes de Submeter

1. ✅ Execute os testes: `pnpm run test`
2. ✅ Verifique a tipagem: `pnpm run check`
3. ✅ Formate o código: `pnpm run format`
4. ✅ Teste manualmente suas mudanças
5. ✅ Atualize a documentação se necessário

### Checklist do PR

- [ ] O código segue os padrões do projeto
- [ ] Testes foram adicionados/atualizados
- [ ] A documentação foi atualizada
- [ ] O commit message segue o padrão
- [ ] Não há conflitos com a branch main
- [ ] O build passa sem erros

### Descrição do PR

Use o template fornecido e inclua:

- Descrição clara das mudanças
- Motivação e contexto
- Como testar as mudanças
- Screenshots (se aplicável)
- Issues relacionadas

---

## Reportando Bugs

Use o template de issue "Bug Report" e inclua:

### Informações do Ambiente

```
- OS: [e.g. macOS 14.0]
- Node: [e.g. 18.17.0]
- pnpm: [e.g. 8.6.0]
- Browser: [e.g. Chrome 120]
```

### Passos para Reproduzir

1. Vá para '...'
2. Clique em '...'
3. Role até '...'
4. Veja o erro

### Comportamento Esperado

Descrição clara do que deveria acontecer.

### Comportamento Atual

Descrição clara do que está acontecendo.

### Logs/Screenshots

Inclua logs relevantes ou screenshots.

---

## Sugerindo Melhorias

Use o template de issue "Feature Request" e inclua:

### Problema

Descrição clara do problema que você quer resolver.

### Solução Proposta

Descrição clara da solução que você gostaria de ver implementada.

### Alternativas Consideradas

Descrição de soluções alternativas que você considerou.

### Contexto Adicional

Qualquer outro contexto ou screenshots sobre a sugestão.

---

## Prioridades da Versão BETA

Durante a fase beta, estamos focando em:

1. **Estabilidade:** Correção de bugs críticos
2. **Performance:** Otimizações de velocidade e uso de recursos
3. **Usabilidade:** Melhorias na experiência do usuário
4. **Documentação:** Completar e melhorar a documentação
5. **Testes:** Aumentar cobertura de testes

---

## Dúvidas?

Se você tiver dúvidas sobre como contribuir:

- Abra uma issue com a label `question`
- Entre em contato: contato@lexintelligentia.com
- Consulte a [documentação](docs/)

---

## Reconhecimento

Contribuidores serão reconhecidos no README do projeto e nos release notes.

Obrigado por contribuir com o **Lex Intel Visual Design**! 🎉

---

**Desenvolvido por Lex Intelligentia** - Transformando a advocacia através da tecnologia.
