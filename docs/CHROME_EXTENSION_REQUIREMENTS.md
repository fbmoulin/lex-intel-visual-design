# Requisitos para Publicação no Chrome Web Store

## Pesquisa realizada em: Dezembro 2025

---

## 1. Requisitos Técnicos

### 1.1 Manifest V3 (Obrigatório)
- Todas as extensões devem usar **Manifest V3**
- O código deve ser auto-contido (lógica não pode vir de fontes externas)
- Proibido usar `eval()` ou mecanismos similares para executar código remoto
- Recursos externos permitidos apenas para dados, não para lógica
- APIs permitidas para execução remota: Debugger API, User Scripts API

### 1.2 Estrutura do Pacote
- Arquivo ZIP com tamanho máximo de **2GB**
- Arquivo `manifest.json` válido
- Ícones obrigatórios (16x16, 32x32, 48x48, 128x128)
- Screenshots obrigatórios (mínimo 1, máximo 5)
- Imagem promocional opcional (440x280)

### 1.3 Código Legível
- Código não pode ser ofuscado
- Minificação é permitida:
  - Remoção de espaços, quebras de linha, comentários
  - Encurtamento de nomes de variáveis e funções
  - Concatenação de arquivos

---

## 2. Requisitos de Privacidade

### 2.1 Política de Privacidade (Obrigatória se coletar dados)
- Deve ser publicada e acessível
- Deve divulgar:
  - Como os dados são coletados, usados e compartilhados
  - Todas as partes com quem os dados serão compartilhados

### 2.2 Limited Use (Uso Limitado)
- Uso de dados limitado ao propósito declarado
- Coleta de atividade de navegação proibida (exceto para funcionalidades explícitas)
- Proibido:
  - Transferir dados para anúncios personalizados
  - Vender dados para terceiros
  - Usar dados para determinar crédito

### 2.3 Permissões
- Solicitar apenas permissões estritamente necessárias
- Justificar cada permissão solicitada

### 2.4 Divulgação
- Se coletar dados não relacionados à funcionalidade principal:
  - Divulgar claramente antes da instalação
  - Obter consentimento do usuário

---

## 3. Requisitos de Listagem

### 3.1 Informações Obrigatórias
- Nome da extensão
- Descrição detalhada
- Ícone (128x128)
- Screenshots (1-5)
- Categoria apropriada
- Idioma principal
- Informações de contato do desenvolvedor

### 3.2 Qualidade da Listagem
- Descrição clara e precisa
- Sem keyword spam (repetição excessiva de palavras-chave)
- Sem depoimentos anônimos
- Metadados atualizados e precisos

### 3.3 Funcionalidade Mínima
- A extensão deve ter funcionalidade real
- Não pode ser apenas um launcher para outro app/site
- Não pode ter funcionalidades quebradas

---

## 4. Requisitos de Propósito Único

### 4.1 Single Purpose Policy
- A extensão deve ter um **propósito único e claro**
- Funcionalidades não relacionadas devem ser extensões separadas
- Exemplos de violação:
  - Ratings + injeção de anúncios
  - Notificador de email + agregador de notícias

---

## 5. Requisitos de Segurança

### 5.1 Conta de Desenvolvedor
- **2-Step Verification obrigatória** para publicar
- Taxa de registro: $5 USD (única)
- Email verificado

### 5.2 Proibições
- Malware, spyware, phishing
- Mineração de criptomoedas
- Acesso não autorizado a conteúdo pago
- Download não autorizado de conteúdo protegido

---

## 6. Requisitos de Monetização

### 6.1 Se cobrar do usuário
- Declarar claramente na descrição
- Processar pagamentos de forma segura
- Identificar claramente o vendedor (não é o Google)

### 6.2 Anúncios
- Devem ser claramente identificados
- Não podem simular notificações do sistema
- Não podem interferir com anúncios de terceiros
- Facilmente removíveis

### 6.3 Afiliados
- Programa de afiliados deve ser divulgado
- Links afiliados apenas com benefício direto ao usuário
- Requer ação do usuário antes de inserir código afiliado

---

## 7. Processo de Publicação

### 7.1 Etapas
1. Registrar conta de desenvolvedor ($5)
2. Ativar 2-Step Verification
3. Fazer upload do ZIP
4. Preencher informações da listagem
5. Preencher campos de privacidade
6. Definir distribuição e visibilidade
7. Fornecer instruções de teste (se necessário)
8. Submeter para revisão

### 7.2 Revisão
- Tempo varia conforme complexidade
- Pode ser rejeitada com motivo
- Apelação permitida (uma vez por violação)

---

## 8. Conteúdo Proibido

- Conteúdo adulto/sexual explícito
- Discurso de ódio
- Violência gratuita
- Jogos de azar com dinheiro real
- Venda de produtos regulados
- Impersonação de outras marcas
- Táticas de instalação enganosas

---

## Fontes
- https://developer.chrome.com/docs/webstore/program-policies/policies
- https://developer.chrome.com/docs/webstore/program-policies/mv3-requirements
- https://developer.chrome.com/docs/webstore/publish
- https://developer.chrome.com/docs/extensions/develop/migrate/what-is-mv3
