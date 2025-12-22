/**
 * Templates de Decisões Judiciais, Mandados, Ofícios e Sentenças
 * Para uso na área de administrador (testes)
 * 
 * Desenvolvido por Lex Intelligentia
 * Baseado na pesquisa de modelos judiciais brasileiros
 */

import { PetitionTemplate } from './petitionTemplates';

// Estendendo o tipo para incluir categoria judicial
export type JudicialCategory = 'decisao' | 'mandado' | 'oficio' | 'sentenca';

export interface JudicialTemplate extends PetitionTemplate {
  judicialCategory: JudicialCategory;
  style: 'moderno' | 'classico' | 'padrao';
}

// ============================================
// DECISÕES JUDICIAIS SIMPLES
// ============================================

export const decisaoInterlocutoriaTemplate: JudicialTemplate = {
  id: 'decisao-interlocutoria-liminar',
  templateType: 'civil',
  title: '📋 Decisão Interlocutória - Liminar',
  description: 'Modelo de decisão interlocutória para concessão ou indeferimento de liminar',
  judicialCategory: 'decisao',
  style: 'moderno',
  content: {
    numeroProcesso: '[NÚMERO DO PROCESSO]',
    tribunal: 'Vara Cível da Comarca de [CIDADE/UF]',
    autor: '[NOME DO AUTOR]',
    reu: '[NOME DO RÉU]',
    fatos: `📋 RELATÓRIO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

▸ PROCESSO Nº: [NÚMERO]
▸ CLASSE: [TIPO DE AÇÃO]
▸ AUTOR: [QUALIFICAÇÃO COMPLETA]
▸ RÉU: [QUALIFICAÇÃO COMPLETA]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Trata-se de [TIPO DE AÇÃO] em que a parte autora pleiteia [PEDIDO PRINCIPAL], com pedido de tutela de urgência para [OBJETO DA LIMINAR].

🔹 Alega, em síntese, que [RESUMO DOS FATOS ALEGADOS].

🔹 Requer a concessão de liminar para [PEDIDO LIMINAR ESPECÍFICO].

🔹 Juntou documentos às fls. [FOLHAS].

É o relatório. DECIDO.`,
    fundamentosJuridicos: `⚖️ FUNDAMENTAÇÃO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 REQUISITOS DA TUTELA DE URGÊNCIA (Art. 300, CPC):

┌─────────────────────────────────────────┐
│ ① Probabilidade do direito             │
│ ② Perigo de dano ou risco ao resultado │
└─────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔍 ANÁLISE DO CASO CONCRETO:

▸ PROBABILIDADE DO DIREITO:
[Analisar se há elementos que evidenciem a probabilidade do direito alegado]

▸ PERIGO DE DANO:
[Analisar se há risco de dano irreparável ou de difícil reparação]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 FUNDAMENTO LEGAL:
"Art. 300. A tutela de urgência será concedida quando houver elementos que evidenciem a probabilidade do direito e o perigo de dano ou o risco ao resultado útil do processo."`,
    pedidos: `✅ DISPOSITIVO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ante o exposto, [DEFIRO/INDEFIRO] o pedido de tutela de urgência, [COM/SEM] fundamento no art. 300 do CPC.

🟢 DETERMINAÇÕES:
① [PRIMEIRA DETERMINAÇÃO]
② [SEGUNDA DETERMINAÇÃO]
③ [TERCEIRA DETERMINAÇÃO]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Intimem-se.
Cumpra-se.

[LOCAL], [DATA].

_______________________________
JUIZ(A) DE DIREITO`,
    valorCausa: 'N/A'
  }
};

export const despachoOrdinariaTemplate: JudicialTemplate = {
  id: 'despacho-ordinatorio',
  templateType: 'civil',
  title: '📝 Despacho Ordinatório',
  description: 'Modelo de despacho para impulso processual sem conteúdo decisório',
  judicialCategory: 'decisao',
  style: 'padrao',
  content: {
    numeroProcesso: '[NÚMERO DO PROCESSO]',
    tribunal: 'Vara Cível da Comarca de [CIDADE/UF]',
    autor: '[NOME DO AUTOR]',
    reu: '[NOME DO RÉU]',
    fatos: `DESPACHO

Processo nº [NÚMERO]
Autor: [NOME DO AUTOR]
Réu: [NOME DO RÉU]

Vistos.`,
    fundamentosJuridicos: `[CONTEÚDO DO DESPACHO - ESCOLHER CONFORME O CASO]:

□ Cite-se o réu para, querendo, contestar no prazo legal.

□ Intime-se a parte autora para emendar a inicial, no prazo de 15 (quinze) dias, sob pena de indeferimento.

□ Designo audiência de conciliação para o dia [DATA], às [HORA], na sala de audiências deste Juízo.

□ Manifestem-se as partes sobre os documentos juntados, no prazo de 15 (quinze) dias.

□ Venham os autos conclusos para sentença.

□ Aguarde-se o cumprimento do mandado.

□ Defiro o pedido de vista dos autos pelo prazo de 5 (cinco) dias.`,
    pedidos: `Intimem-se.

[LOCAL], [DATA].

_______________________________
JUIZ(A) DE DIREITO
(ou Chefe de Secretaria, por delegação)`,
    valorCausa: 'N/A'
  }
};

// ============================================
// MANDADOS JUDICIAIS
// ============================================

export const mandadoBuscaApreensaoTemplate: JudicialTemplate = {
  id: 'mandado-busca-apreensao',
  templateType: 'civil',
  title: '🚗 Mandado de Busca e Apreensão',
  description: 'Mandado de busca e apreensão de veículo em alienação fiduciária',
  judicialCategory: 'mandado',
  style: 'moderno',
  content: {
    numeroProcesso: '[NÚMERO DO PROCESSO]',
    tribunal: 'Vara Cível da Comarca de [CIDADE/UF]',
    autor: '[NOME DO CREDOR FIDUCIÁRIO]',
    reu: '[NOME DO DEVEDOR FIDUCIANTE]',
    fatos: `🔴 MANDADO DE BUSCA E APREENSÃO DE VEÍCULO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 DADOS DO PROCESSO
┌─────────────────────────────────────────┐
│ Processo nº: [NÚMERO]                   │
│ Classe: Busca e Apreensão               │
│ Autor: [CREDOR FIDUCIÁRIO]              │
│ Réu: [DEVEDOR FIDUCIANTE]               │
└─────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 DADOS DO DESTINATÁRIO (RÉU)
▸ Nome: [NOME COMPLETO]
▸ CPF/CNPJ: [NÚMERO]
▸ Endereço: [ENDEREÇO COMPLETO]
▸ Cidade/UF: [CIDADE/UF]
▸ CEP: [CEP]`,
    fundamentosJuridicos: `🚗 DADOS DO VEÍCULO A SER APREENDIDO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────┐
│ Marca/Modelo: [MARCA/MODELO]            │
│ Ano/Modelo: [ANO FAB/ANO MOD]           │
│ Cor: [COR]                              │
│ Placa: [PLACA]                          │
│ Chassi: [NÚMERO DO CHASSI]              │
│ Renavam: [NÚMERO RENAVAM]               │
└─────────────────────────────────────────┘

📍 ENDEREÇO DE LOCALIZAÇÃO DO VEÍCULO:
[ENDEREÇO ONDE O VEÍCULO PODE SER ENCONTRADO]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚖️ BASE LEGAL
▸ Decreto-Lei nº 911/1969, Art. 3º
▸ Código de Processo Civil, Arts. 159 e 161`,
    pedidos: `✅ FINALIDADE DESTE MANDADO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

O(A) OFICIAL DE JUSTIÇA DEVERÁ:

① 🔍 BUSCA E APREENSÃO
   Proceder à busca e apreensão do veículo acima descrito,
   onde quer que se encontre.

② 📋 NOMEAÇÃO DE DEPOSITÁRIO
   Nomear depositário fiel do bem apreendido,
   nos termos do art. 159 do CPC.

③ 📨 CITAÇÃO
   CITAR o réu para, no prazo de 15 (quinze) dias,
   apresentar resposta.

④ 💰 INTIMAÇÃO PARA PAGAMENTO
   INTIMAR o réu para, no prazo de 5 (cinco) dias,
   pagar a integralidade da dívida, incluindo parcelas
   vencidas e vincendas, sob pena de consolidação da
   propriedade (Art. 3º, §2º, DL 911/69).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ ADVERTÊNCIA:
O não pagamento no prazo implicará na consolidação
da propriedade em favor do credor fiduciário.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[LOCAL], [DATA].

_______________________________
JUIZ(A) DE DIREITO`,
    valorCausa: 'R$ [VALOR DA DÍVIDA]'
  }
};

export const mandadoReintegracaoPosseTemplate: JudicialTemplate = {
  id: 'mandado-reintegracao-posse',
  templateType: 'civil',
  title: '🏠 Mandado de Reintegração de Posse',
  description: 'Mandado liminar de reintegração de posse em caso de esbulho',
  judicialCategory: 'mandado',
  style: 'moderno',
  content: {
    numeroProcesso: '[NÚMERO DO PROCESSO]',
    tribunal: 'Vara Cível da Comarca de [CIDADE/UF]',
    autor: '[NOME DO POSSUIDOR]',
    reu: '[NOME DO ESBULHADOR]',
    fatos: `🔴 MANDADO DE REINTEGRAÇÃO DE POSSE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 DADOS DO PROCESSO
┌─────────────────────────────────────────┐
│ Processo nº: [NÚMERO]                   │
│ Classe: Reintegração de Posse           │
│ Autor: [POSSUIDOR ESBULHADO]            │
│ Réu: [ESBULHADOR]                       │
└─────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 DADOS DO RÉU (ESBULHADOR)
▸ Nome: [NOME COMPLETO]
▸ CPF/CNPJ: [NÚMERO]
▸ Endereço: [ENDEREÇO PARA CITAÇÃO]`,
    fundamentosJuridicos: `🏠 DADOS DO IMÓVEL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────┐
│ Endereço: [ENDEREÇO COMPLETO]           │
│ Cidade/UF: [CIDADE/UF]                  │
│ CEP: [CEP]                              │
│ Matrícula: [Nº MATRÍCULA - se houver]   │
│ Área: [ÁREA DO IMÓVEL]                  │
│ Características: [DESCRIÇÃO]            │
└─────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚖️ BASE LEGAL
▸ Código de Processo Civil, Arts. 560 a 566
▸ Código Civil, Art. 1.210
▸ Decisão liminar proferida em [DATA]`,
    pedidos: `✅ FINALIDADE DESTE MANDADO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

O(A) OFICIAL DE JUSTIÇA DEVERÁ:

① 🏠 REINTEGRAÇÃO DE POSSE
   Proceder à REINTEGRAÇÃO do autor na posse
   do imóvel acima descrito, retirando do local
   o réu e quaisquer pessoas que ali se encontrem.

② 📨 CITAÇÃO
   CITAR o réu para, querendo, contestar a ação
   no prazo de 15 (quinze) dias.

③ ⚠️ ADVERTÊNCIA
   ADVERTIR o réu de que o descumprimento da
   ordem judicial configura crime de desobediência
   (Art. 330, CP) e ato atentatório à dignidade
   da justiça (Art. 77, IV, CPC).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚔 REQUISIÇÃO DE FORÇA POLICIAL:
Fica autorizada a requisição de força policial
para cumprimento deste mandado, se necessário.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[LOCAL], [DATA].

_______________________________
JUIZ(A) DE DIREITO`,
    valorCausa: 'R$ [VALOR DO IMÓVEL]'
  }
};

export const mandadoDespejoTemplate: JudicialTemplate = {
  id: 'mandado-despejo',
  templateType: 'civil',
  title: '🏢 Mandado de Despejo',
  description: 'Mandado de despejo por falta de pagamento ou denúncia vazia',
  judicialCategory: 'mandado',
  style: 'moderno',
  content: {
    numeroProcesso: '[NÚMERO DO PROCESSO]',
    tribunal: 'Vara Cível da Comarca de [CIDADE/UF]',
    autor: '[NOME DO LOCADOR]',
    reu: '[NOME DO LOCATÁRIO]',
    fatos: `🔴 MANDADO DE DESPEJO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 DADOS DO PROCESSO
┌─────────────────────────────────────────┐
│ Processo nº: [NÚMERO]                   │
│ Classe: Ação de Despejo                 │
│ Autor (Locador): [NOME]                 │
│ Réu (Locatário): [NOME]                 │
│ Motivo: [FALTA DE PAGAMENTO/DENÚNCIA]   │
└─────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 DADOS DO LOCATÁRIO (RÉU)
▸ Nome: [NOME COMPLETO]
▸ CPF: [NÚMERO]
▸ Endereço do Imóvel: [ENDEREÇO LOCADO]`,
    fundamentosJuridicos: `🏢 DADOS DO IMÓVEL LOCADO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────┐
│ Endereço: [ENDEREÇO COMPLETO]           │
│ Tipo: [RESIDENCIAL/COMERCIAL]           │
│ Valor do Aluguel: R$ [VALOR]            │
│ Débito Total: R$ [VALOR TOTAL]          │
│ Período em Atraso: [MESES]              │
└─────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚖️ BASE LEGAL
▸ Lei nº 8.245/91 (Lei do Inquilinato)
▸ Art. 59, §1º - Despejo liminar
▸ Art. 62, I - Cumulação com cobrança
▸ Decisão/Sentença proferida em [DATA]`,
    pedidos: `✅ FINALIDADE DESTE MANDADO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

O(A) OFICIAL DE JUSTIÇA DEVERÁ:

① 🏢 DESPEJO
   Proceder ao DESPEJO do réu e de todos os
   ocupantes do imóvel, no prazo de [15/30] dias.

② 📦 REMOÇÃO DE BENS
   Após o prazo, remover os bens móveis do imóvel,
   depositando-os em local adequado, às expensas
   do réu.

③ 🔑 IMISSÃO NA POSSE
   Imitir o autor na posse do imóvel, entregando-lhe
   as chaves.

④ 📨 INTIMAÇÃO
   INTIMAR o réu do prazo para desocupação voluntária.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ PRAZO PARA DESOCUPAÇÃO:
┌─────────────────────────────────────────┐
│ O réu tem [15/30] dias para desocupar   │
│ voluntariamente o imóvel, contados da   │
│ intimação deste mandado.                │
└─────────────────────────────────────────┘

🚔 REQUISIÇÃO DE FORÇA POLICIAL:
Fica autorizada a requisição de força policial
para cumprimento deste mandado, se necessário.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[LOCAL], [DATA].

_______________________________
JUIZ(A) DE DIREITO`,
    valorCausa: 'R$ [VALOR DO DÉBITO]'
  }
};

// ============================================
// OFÍCIOS JUDICIAIS
// ============================================

export const oficioJudicialTemplate: JudicialTemplate = {
  id: 'oficio-judicial-padrao',
  templateType: 'civil',
  title: '📨 Ofício Judicial Padrão',
  description: 'Modelo de ofício judicial para comunicações oficiais',
  judicialCategory: 'oficio',
  style: 'padrao',
  content: {
    numeroProcesso: '[NÚMERO DO PROCESSO]',
    tribunal: 'Vara Cível da Comarca de [CIDADE/UF]',
    autor: '[NOME DO AUTOR]',
    reu: '[NOME DO RÉU]',
    fatos: `[TIMBRE DO PODER JUDICIÁRIO]
[TRIBUNAL DE JUSTIÇA DO ESTADO DE ...]
[COMARCA DE ...]
[VARA ...]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OFÍCIO Nº [NÚMERO]/[ANO]

[LOCAL], [DATA].`,
    fundamentosJuridicos: `A(o) Ilustríssimo(a) Senhor(a)
[NOME DO DESTINATÁRIO]
[CARGO/FUNÇÃO]
[ÓRGÃO/INSTITUIÇÃO]
[ENDEREÇO COMPLETO]
[CIDADE/UF] - CEP: [CEP]

ASSUNTO: [DESCRIÇÃO DO ASSUNTO] - Processo nº [NÚMERO]

Senhor(a) [CARGO],

Cumprimentando-o(a) cordialmente, em cumprimento à determinação judicial exarada nos autos do processo em epígrafe, movido por [NOME DO AUTOR] em face de [NOME DO RÉU], solicito a Vossa Senhoria que, no prazo de [PRAZO] dias, [DESCREVER A SOLICITAÇÃO DE FORMA CLARA E PRECISA].

[INFORMAÇÕES ADICIONAIS, SE NECESSÁRIO]

A resposta deverá ser enviada por meio eletrônico para o e-mail institucional desta unidade ([EMAIL]) ou protocolada diretamente na secretaria, fazendo referência ao número deste ofício e do processo.`,
    pedidos: `Adverte-se que o não atendimento à presente ordem judicial no prazo estipulado poderá configurar crime de desobediência (Art. 330 do Código Penal) e ato atentatório à dignidade da justiça (Art. 77, IV, do CPC), sujeito à aplicação de multa.

Atenciosamente,


_______________________________
[NOME DO(A) JUIZ(A)]
Juiz(a) de Direito

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ENDEREÇO DA VARA]
[TELEFONE] | [E-MAIL]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    valorCausa: 'N/A'
  }
};

export const oficioBancoTemplate: JudicialTemplate = {
  id: 'oficio-banco-bloqueio',
  templateType: 'civil',
  title: '🏦 Ofício para Bloqueio Bancário',
  description: 'Ofício para instituição financeira determinando bloqueio de valores',
  judicialCategory: 'oficio',
  style: 'moderno',
  content: {
    numeroProcesso: '[NÚMERO DO PROCESSO]',
    tribunal: 'Vara Cível da Comarca de [CIDADE/UF]',
    autor: '[NOME DO EXEQUENTE]',
    reu: '[NOME DO EXECUTADO]',
    fatos: `📨 OFÍCIO JUDICIAL - BLOQUEIO DE VALORES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OFÍCIO Nº [NÚMERO]/[ANO]

[LOCAL], [DATA].

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 DESTINATÁRIO:
┌─────────────────────────────────────────┐
│ [NOME DO BANCO]                         │
│ Setor Jurídico / Cumprimento de Ordens  │
│ [ENDEREÇO]                              │
│ [CIDADE/UF] - CEP: [CEP]                │
└─────────────────────────────────────────┘`,
    fundamentosJuridicos: `📋 DADOS DO PROCESSO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

▸ Processo nº: [NÚMERO]
▸ Classe: Cumprimento de Sentença / Execução
▸ Exequente: [NOME]
▸ Executado: [NOME]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 DADOS DO EXECUTADO (TITULAR DA CONTA):
┌─────────────────────────────────────────┐
│ Nome: [NOME COMPLETO]                   │
│ CPF/CNPJ: [NÚMERO]                      │
│ Agência: [NÚMERO] (se conhecido)        │
│ Conta: [NÚMERO] (se conhecido)          │
└─────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💰 VALOR A SER BLOQUEADO:
┌─────────────────────────────────────────┐
│ R$ [VALOR]                              │
│ ([VALOR POR EXTENSO])                   │
└─────────────────────────────────────────┘`,
    pedidos: `✅ DETERMINAÇÃO JUDICIAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DETERMINO a essa instituição financeira que:

① 🔒 BLOQUEIE valores até o limite de R$ [VALOR]
   existentes em contas de titularidade do executado.

② 📊 INFORME a este Juízo, no prazo de 48 horas:
   ▸ Se há conta em nome do executado
   ▸ Saldo disponível na data do bloqueio
   ▸ Se houve bloqueio total ou parcial

③ 🚫 ABSTENHA-SE de comunicar o bloqueio ao
   executado antes da confirmação por este Juízo.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚖️ FUNDAMENTO LEGAL:
▸ Art. 854 do CPC - Penhora de dinheiro
▸ Art. 835, I do CPC - Ordem de preferência

⚠️ ADVERTÊNCIA:
O descumprimento desta ordem configura crime de
desobediência (Art. 330, CP) e responsabilização
por perdas e danos.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Atenciosamente,

_______________________________
[NOME DO(A) JUIZ(A)]
Juiz(a) de Direito`,
    valorCausa: 'R$ [VALOR DO BLOQUEIO]'
  }
};

// ============================================
// SENTENÇAS CÍVEIS
// ============================================

export const sentencaCobrancaTemplate: JudicialTemplate = {
  id: 'sentenca-cobranca',
  templateType: 'civil',
  title: '⚖️ Sentença - Ação de Cobrança',
  description: 'Modelo de sentença para ação de cobrança com procedência',
  judicialCategory: 'sentenca',
  style: 'moderno',
  content: {
    numeroProcesso: '[NÚMERO DO PROCESSO]',
    tribunal: 'Vara Cível da Comarca de [CIDADE/UF]',
    autor: '[NOME DO CREDOR]',
    reu: '[NOME DO DEVEDOR]',
    fatos: `⚖️ SENTENÇA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 I - RELATÓRIO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

▸ PROCESSO Nº: [NÚMERO]
▸ CLASSE: Ação de Cobrança
▸ AUTOR: [QUALIFICAÇÃO COMPLETA]
▸ RÉU: [QUALIFICAÇÃO COMPLETA]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 SÍNTESE DA INICIAL:
[NOME DO AUTOR], qualificado nos autos, ajuizou a presente AÇÃO DE COBRANÇA em face de [NOME DO RÉU], alegando, em síntese, que:

🔹 [RESUMO DO FATO GERADOR DA DÍVIDA]
🔹 [VALOR DEVIDO E FORMA DE CÁLCULO]
🔹 [TENTATIVAS DE COBRANÇA EXTRAJUDICIAL]

Requereu a procedência do pedido para condenar o réu ao pagamento de R$ [VALOR].

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 CONTESTAÇÃO:
[DESCREVER SE HOUVE CONTESTAÇÃO OU REVELIA]

É o relatório. DECIDO.`,
    fundamentosJuridicos: `⚖️ II - FUNDAMENTAÇÃO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 PRELIMINARES:
[Analisar preliminares, se houver]
Não havendo preliminares a serem apreciadas, passo ao mérito.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 MÉRITO:

🔍 DA EXISTÊNCIA DA DÍVIDA:
[Análise das provas documentais que comprovam a dívida]

A parte autora comprovou a existência do débito através de [DOCUMENTOS], demonstrando que [EXPLICAR].

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔍 DA EXIGIBILIDADE:
[Análise do vencimento e mora]

O débito encontra-se vencido desde [DATA], estando o réu em mora, nos termos do art. 397 do Código Civil.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 FUNDAMENTO LEGAL:
▸ Art. 389, CC - Inadimplemento das obrigações
▸ Art. 397, CC - Mora do devedor
▸ Art. 402, CC - Perdas e danos

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💰 CÁLCULO DO DÉBITO:
┌─────────────────────────────────────────┐
│ Principal: R$ [VALOR]                   │
│ Juros de mora: R$ [VALOR]               │
│ Correção monetária: R$ [VALOR]          │
│ ─────────────────────────────────       │
│ TOTAL: R$ [VALOR TOTAL]                 │
└─────────────────────────────────────────┘`,
    pedidos: `✅ III - DISPOSITIVO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ante o exposto, JULGO PROCEDENTE o pedido formulado na inicial, com resolução do mérito, nos termos do art. 487, I, do CPC, para:

┌─────────────────────────────────────────┐
│ ① CONDENAR o réu ao pagamento de        │
│    R$ [VALOR], acrescido de:            │
│    ▸ Correção monetária (INPC/IPCA)     │
│    ▸ Juros de mora de 1% ao mês         │
│    ▸ Desde [DATA DO VENCIMENTO]         │
└─────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💰 SUCUMBÊNCIA:
▸ Custas processuais: RÉU
▸ Honorários advocatícios: 10% sobre o valor da condenação

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Transitada em julgado, arquivem-se os autos com as cautelas de praxe.

P.R.I.

[LOCAL], [DATA].

_______________________________
[NOME DO(A) JUIZ(A)]
Juiz(a) de Direito`,
    valorCausa: 'R$ [VALOR DA CAUSA]'
  }
};

export const sentencaDespejoTemplate: JudicialTemplate = {
  id: 'sentenca-despejo',
  templateType: 'civil',
  title: '⚖️ Sentença - Ação de Despejo',
  description: 'Modelo de sentença para ação de despejo por falta de pagamento',
  judicialCategory: 'sentenca',
  style: 'moderno',
  content: {
    numeroProcesso: '[NÚMERO DO PROCESSO]',
    tribunal: 'Vara Cível da Comarca de [CIDADE/UF]',
    autor: '[NOME DO LOCADOR]',
    reu: '[NOME DO LOCATÁRIO]',
    fatos: `⚖️ SENTENÇA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 I - RELATÓRIO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

▸ PROCESSO Nº: [NÚMERO]
▸ CLASSE: Ação de Despejo c/c Cobrança
▸ AUTOR (Locador): [QUALIFICAÇÃO]
▸ RÉU (Locatário): [QUALIFICAÇÃO]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🏢 DADOS DA LOCAÇÃO:
┌─────────────────────────────────────────┐
│ Imóvel: [ENDEREÇO]                      │
│ Tipo: [RESIDENCIAL/COMERCIAL]           │
│ Aluguel mensal: R$ [VALOR]              │
│ Início do contrato: [DATA]              │
│ Meses em atraso: [QUANTIDADE]           │
│ Débito total: R$ [VALOR]                │
└─────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 SÍNTESE:
O autor alega que o réu deixou de pagar os aluguéis desde [DATA], totalizando [X] meses de inadimplência, no valor de R$ [VALOR].

[INFORMAR SE HOUVE CONTESTAÇÃO OU REVELIA]

É o relatório. DECIDO.`,
    fundamentosJuridicos: `⚖️ II - FUNDAMENTAÇÃO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 DO DESPEJO POR FALTA DE PAGAMENTO:

A Lei nº 8.245/91 (Lei do Inquilinato) estabelece em seu art. 9º, III, que a locação pode ser desfeita por falta de pagamento do aluguel e demais encargos.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔍 ANÁLISE DAS PROVAS:

▸ Contrato de locação (fls. [X])
▸ Notificação extrajudicial (fls. [X])
▸ Planilha de débito (fls. [X])

A inadimplência restou comprovada pelos documentos acostados aos autos, não tendo o réu apresentado prova de pagamento.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 FUNDAMENTO LEGAL:
▸ Lei nº 8.245/91, Art. 9º, III - Despejo por falta de pagamento
▸ Lei nº 8.245/91, Art. 62, I - Cumulação com cobrança
▸ Art. 373, I, CPC - Ônus da prova`,
    pedidos: `✅ III - DISPOSITIVO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ante o exposto, JULGO PROCEDENTE o pedido, com resolução do mérito (art. 487, I, CPC), para:

┌─────────────────────────────────────────┐
│ ① DECRETAR o despejo do réu do imóvel   │
│    situado em [ENDEREÇO], concedendo    │
│    prazo de 15 (quinze) dias para       │
│    desocupação voluntária.              │
│                                          │
│ ② CONDENAR o réu ao pagamento dos       │
│    aluguéis em atraso no valor de       │
│    R$ [VALOR], acrescido de:            │
│    ▸ Correção monetária                 │
│    ▸ Juros de mora de 1% ao mês         │
│    ▸ Multa contratual de [X]%           │
└─────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ PRAZO PARA DESOCUPAÇÃO:
Findo o prazo de 15 dias sem desocupação voluntária,
expeça-se mandado de despejo com requisição de
força policial, se necessário.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💰 SUCUMBÊNCIA:
▸ Custas processuais: RÉU
▸ Honorários advocatícios: 10% sobre o valor da condenação

P.R.I.

[LOCAL], [DATA].

_______________________________
[NOME DO(A) JUIZ(A)]
Juiz(a) de Direito`,
    valorCausa: 'R$ [VALOR DA CAUSA]'
  }
};

// ============================================
// EXPORTAÇÃO
// ============================================

export const judicialTemplates: JudicialTemplate[] = [
  // Decisões
  decisaoInterlocutoriaTemplate,
  despachoOrdinariaTemplate,
  // Mandados
  mandadoBuscaApreensaoTemplate,
  mandadoReintegracaoPosseTemplate,
  mandadoDespejoTemplate,
  // Ofícios
  oficioJudicialTemplate,
  oficioBancoTemplate,
  // Sentenças
  sentencaCobrancaTemplate,
  sentencaDespejoTemplate,
];

export const getJudicialTemplateById = (id: string): JudicialTemplate | undefined => {
  return judicialTemplates.find(template => template.id === id);
};

export const getJudicialTemplatesByCategory = (category: JudicialCategory): JudicialTemplate[] => {
  return judicialTemplates.filter(template => template.judicialCategory === category);
};

export const judicialCategories = [
  { id: 'decisao' as JudicialCategory, name: 'Decisões Judiciais', icon: '📋', count: 2 },
  { id: 'mandado' as JudicialCategory, name: 'Mandados', icon: '📜', count: 3 },
  { id: 'oficio' as JudicialCategory, name: 'Ofícios', icon: '📨', count: 2 },
  { id: 'sentenca' as JudicialCategory, name: 'Sentenças', icon: '⚖️', count: 2 },
];
