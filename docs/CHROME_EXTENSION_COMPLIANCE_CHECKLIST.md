# Checklist de Conformidade - Extensão Chrome Lex Intel

## Análise de Viabilidade e Gaps

Este documento avalia a conformidade do projeto Lex Intel com os requisitos da Chrome Web Store e identifica os gaps para a criação de uma extensão.

---

### Status Atual do Projeto

- **Tipo:** Aplicação Web (React + Vite)
- **Não é uma extensão Chrome.**

---

### Checklist de Conformidade

| Categoria | Requisito | Status | Gaps e Ações Necessárias |
|---|---|---|---|
| **1. Estrutura Técnica** | **Manifest V3** | 🔴 **Não Conforme** | **Criar `manifest.json`** com as configurações da extensão (nome, versão, permissões, ícones, etc.) |
| | **Service Worker** | 🔴 **Não Conforme** | **Criar `background.js`** para gerenciar eventos em segundo plano (substitui scripts persistentes do Manifest V2) |
| | **Content Scripts** | 🔴 **Não Conforme** | **Criar `content.js`** para interagir com o conteúdo das páginas (ex: preencher petições em editores de texto online) |
| | **Ícones** | 🟡 **Parcialmente Conforme** | O projeto possui ícones, mas precisam ser redimensionados para os tamanhos exigidos (16, 32, 48, 128) |
| | **Screenshots** | 🟡 **Parcialmente Conforme** | O projeto possui screenshots, mas precisam ser adaptados para o formato da Web Store (1280x800 ou 640x400) |
| | **Código Auto-Contido** | 🔴 **Não Conforme** | A lógica da extensão deve ser empacotada. A comunicação com o backend (Supabase) é permitida para dados, mas a lógica principal deve estar na extensão. |
| **2. Privacidade** | **Política de Privacidade** | 🟡 **Parcialmente Conforme** | O projeto possui uma política de privacidade, mas precisa ser revisada para incluir as especificidades da extensão e o uso de dados. |
| | **Uso Limitado (Limited Use)** | 🟡 **Parcialmente Conforme** | A coleta de dados já é limitada, mas precisa ser formalmente declarada na política de privacidade e na listagem da loja. |
| | **Permissões Mínimas** | 🔴 **Não Conforme** | As permissões necessárias precisam ser definidas no `manifest.json` (ex: `storage`, `activeTab`, `scripting`). |
| **3. Propósito Único** | **Single Purpose Policy** | 🟡 **Parcialmente Conforme** | A extensão deve ter um propósito claro. Sugestão: **"Assistente de Redação Jurídica com IA e Visual Law"**. Funcionalidades como o chat IA e os templates se encaixam bem. |
| **4. Conta de Desenvolvedor** | **Conta Registrada** | 🔴 **Não Conforme** | É necessário criar uma conta no Chrome Web Store Developer Dashboard. |
| | **Taxa de Registro ($5)** | 🔴 **Não Conforme** | Pagamento único para ativar a conta. |
| | **2-Step Verification** | 🔴 **Não Conforme** | A autenticação de dois fatores precisa ser ativada na conta Google do desenvolvedor. |
| **5. Listagem na Loja** | **Descrição e Título** | 🟡 **Parcialmente Conforme** | O conteúdo existente pode ser adaptado, mas precisa ser otimizado para a loja. |
| | **Categoria** | 🔴 **Não Conforme** | Definir a categoria correta (ex: "Produtividade"). |
| | **Instruções de Teste** | 🔴 **Não Conforme** | Se a extensão interagir com sites que exigem login, será necessário fornecer credenciais de teste. |

---

### Principais Gaps e Recomendações

1.  **Arquitetura da Extensão:**
    - **Gap:** O projeto não é uma extensão.
    - **Ação:** É necessário **criar uma nova estrutura de projeto para a extensão Chrome**. Isso envolve criar os arquivos `manifest.json`, `background.js`, e `content.js`.

2.  **Refatoração do Frontend:**
    - **Gap:** O frontend React precisa ser adaptado para funcionar como um popup da extensão ou injetado em páginas.
    - **Ação:** Refatorar os componentes React para serem usados no contexto da extensão. O `AIChat.tsx` e os componentes de templates são bons candidatos.

3.  **Comunicação:**
    - **Gap:** A comunicação entre os componentes da extensão (popup, content script, background) precisa ser implementada.
    - **Ação:** Usar a API `chrome.runtime.sendMessage` para troca de mensagens.

4.  **Conta de Desenvolvedor:**
    - **Gap:** Não há uma conta de desenvolvedor configurada.
    - **Ação:** Registrar uma conta no Chrome Web Store Developer Dashboard, pagar a taxa de $5 e ativar a 2-Step Verification.

5.  **Conteúdo da Listagem:**
    - **Gap:** Todo o material de marketing (descrição, screenshots, etc.) precisa ser criado.
    - **Ação:** Adaptar o conteúdo da landing page e criar os assets visuais nos formatos exigidos.

---

### Conclusão

O projeto Lex Intel **possui os componentes de backend e a lógica de negócio necessários** para uma extensão Chrome de sucesso. No entanto, a **criação da extensão em si é um novo projeto de desenvolvimento** que requer a criação de uma nova estrutura de frontend e a adaptação dos componentes existentes.

A funcionalidade de **chat com IA e a busca de templates** são os recursos mais promissores para uma primeira versão da extensão.
