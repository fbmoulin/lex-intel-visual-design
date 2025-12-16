/**
 * Novos Templates de Petições - Versões Moderna e Clássica Elegante
 * Desenvolvido por Lex Intelligentia
 * 
 * Cada categoria possui:
 * - Templates existentes (mantidos)
 * - Template Moderno (linguagem contemporânea, visual law)
 * - Template Clássico Elegante (linguagem formal tradicional)
 */

import { PetitionTemplate } from "./petitionTemplates";

export const newTemplates: PetitionTemplate[] = [
  // ===== TEMPLATES CIVIS - MODERNOS =====
  {
    id: 'civil-moderno-obrigacao',
    templateType: 'civil',
    title: '📊 Obrigação de Fazer - Moderno',
    description: 'Template moderno com Visual Law para ação de obrigação de fazer',
    content: {
      tribunal: 'Vara Cível da Comarca de [CIDADE/UF]',
      valorCausa: 'R$ [VALOR]',
      fatos: `📋 SÍNTESE FÁTICA

▸ DATA DO CONTRATO: [DATA]
▸ OBJETO: [DESCRIÇÃO DO OBJETO]
▸ PRAZO ACORDADO: [PRAZO]
▸ STATUS: Descumprido

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CRONOLOGIA DOS EVENTOS:

🔹 [DATA 1] - Celebração do contrato entre as partes
🔹 [DATA 2] - Vencimento do prazo para cumprimento
🔹 [DATA 3] - Primeira notificação extrajudicial
🔹 [DATA 4] - Segunda notificação sem resposta
🔹 [DATA 5] - Ajuizamento da presente ação

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

O RÉU assumiu obrigação contratual de [DESCREVER OBRIGAÇÃO], comprometendo-se a cumpri-la até [DATA LIMITE].

Apesar das notificações extrajudiciais enviadas (docs. anexos), o RÉU permanece inerte, causando prejuízos ao AUTOR que dependia do cumprimento para [EXPLICAR FINALIDADE].`,
      fundamentosJuridicos: `⚖️ FUNDAMENTOS JURÍDICOS

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 BASE LEGAL PRINCIPAL:

▸ Art. 497, CPC - Tutela específica das obrigações de fazer
▸ Art. 536, CPC - Medidas coercitivas (multa diária)
▸ Art. 389, CC - Responsabilidade pelo inadimplemento
▸ Art. 475, CC - Resolução por inadimplemento

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 JURISPRUDÊNCIA APLICÁVEL:

"A tutela específica das obrigações de fazer ou não fazer é prioritária em relação à conversão em perdas e danos." (STJ, REsp 1.xxx.xxx/SP)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

O ordenamento jurídico brasileiro prioriza o cumprimento específico da obrigação, conforme art. 497 do CPC, sendo a conversão em perdas e danos medida subsidiária.

A multa diária (astreintes) é instrumento coercitivo adequado para compelir o devedor ao cumprimento, nos termos do art. 536, §1º, do CPC.`,
      pedidos: `✅ PEDIDOS

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔴 TUTELA DE URGÊNCIA:
① Concessão de tutela provisória para cumprimento imediato
② Fixação de multa diária de R$ [VALOR] por descumprimento

🟢 PEDIDOS PRINCIPAIS:
③ Citação do RÉU para contestar
④ Procedência total com determinação de cumprimento
⑤ Conversão em perdas e danos se impossível o cumprimento
⑥ Condenação em honorários de 20%
⑦ Condenação em custas processuais

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Dá-se à causa o valor de R$ [VALOR].

Termos em que, pede deferimento.`
    }
  },
  {
    id: 'civil-moderno-revisional',
    templateType: 'civil',
    title: '📈 Revisional de Contrato - Moderno',
    description: 'Template moderno para ação revisional de contrato bancário',
    content: {
      tribunal: 'Vara Cível da Comarca de [CIDADE/UF]',
      valorCausa: 'R$ [VALOR]',
      fatos: `📊 DADOS DO CONTRATO

┌─────────────────────────────────────────┐
│ Nº Contrato: [NÚMERO]                   │
│ Data: [DATA]                            │
│ Valor Financiado: R$ [VALOR]            │
│ Taxa Contratada: [X]% a.m.              │
│ Taxa Média BACEN: [Y]% a.m.             │
│ Diferença: [Z]% acima da média          │
└─────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SITUAÇÃO ATUAL:

O AUTOR celebrou contrato de [TIPO] com o RÉU, sendo aplicada taxa de juros de [X]% ao mês, enquanto a taxa média divulgada pelo BACEN para operações similares era de [Y]% ao mês.

A diferença de [Z]% configura onerosidade excessiva e abusividade contratual, violando o equilíbrio econômico-financeiro do contrato.

COMPARATIVO DE VALORES:
▸ Valor com taxa contratada: R$ [VALOR 1]
▸ Valor com taxa média BACEN: R$ [VALOR 2]
▸ Diferença a restituir: R$ [VALOR 3]`,
      fundamentosJuridicos: `⚖️ FUNDAMENTOS JURÍDICOS

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 CÓDIGO DE DEFESA DO CONSUMIDOR:

▸ Art. 6º, V - Modificação de cláusulas abusivas
▸ Art. 39, V - Vantagem excessiva vedada
▸ Art. 51, IV - Nulidade de cláusulas abusivas

📌 CÓDIGO CIVIL:

▸ Art. 421 - Função social do contrato
▸ Art. 422 - Boa-fé objetiva
▸ Art. 478 - Onerosidade excessiva

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 SÚMULAS APLICÁVEIS:

"É admitida a revisão das taxas de juros remuneratórios em situações excepcionais, desde que caracterizada a relação de consumo e que a abusividade fique cabalmente demonstrada." (STJ, Súmula 530)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A taxa de juros aplicada excede em mais de 50% a taxa média de mercado, configurando abusividade passível de revisão judicial.`,
      pedidos: `✅ PEDIDOS

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔴 TUTELA DE URGÊNCIA:
① Depósito judicial das parcelas vincendas
② Exclusão do nome do AUTOR dos cadastros restritivos

🟢 PEDIDOS PRINCIPAIS:
③ Revisão da taxa de juros para a média BACEN
④ Recálculo do saldo devedor
⑤ Restituição em dobro dos valores pagos a maior
⑥ Declaração de nulidade de cláusulas abusivas
⑦ Condenação em honorários e custas

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Dá-se à causa o valor de R$ [VALOR].

Termos em que, pede deferimento.`
    }
  },

  // ===== TEMPLATES CIVIS - CLÁSSICOS ELEGANTES =====
  {
    id: 'civil-classico-possessoria',
    templateType: 'civil',
    title: '⚜️ Reintegração de Posse - Clássico',
    description: 'Template clássico elegante para ação possessória',
    content: {
      tribunal: 'Meritíssimo Juízo da Vara Cível da Comarca de [CIDADE/UF]',
      valorCausa: 'R$ [VALOR]',
      fatos: `EXCELENTÍSSIMO SENHOR DOUTOR JUIZ DE DIREITO

Vem, respeitosamente, à presença de Vossa Excelência, o AUTOR, já qualificado nos autos, por intermédio de seu advogado infra-assinado, propor a presente

AÇÃO DE REINTEGRAÇÃO DE POSSE COM PEDIDO DE LIMINAR

em face do RÉU, igualmente qualificado, pelos fatos e fundamentos que passa a expor:

I - DOS FATOS

O Autor é legítimo possuidor do imóvel situado à [ENDEREÇO COMPLETO], conforme se comprova pelos documentos acostados à presente exordial.

A posse do Autor é mansa, pacífica e ininterrupta há mais de [TEMPO], exercendo sobre o bem todos os atos inerentes à propriedade, quais sejam: uso, gozo e fruição.

Em data de [DATA DO ESBULHO], o Réu, de forma arbitrária e sem qualquer amparo legal, invadiu o referido imóvel, praticando esbulho possessório, impedindo o Autor de exercer sua posse.

O Autor tomou conhecimento do esbulho em [DATA], caracterizando-se a posse nova, nos termos do artigo 558 do Código de Processo Civil.`,
      fundamentosJuridicos: `II - DO DIREITO

A proteção possessória encontra guarida nos artigos 1.196 e seguintes do Código Civil, que assim dispõe:

"Art. 1.196. Considera-se possuidor todo aquele que tem de fato o exercício, pleno ou não, de algum dos poderes inerentes à propriedade."

O artigo 1.210 do mesmo diploma legal estabelece que:

"Art. 1.210. O possuidor tem direito a ser mantido na posse em caso de turbação, restituído no de esbulho, e segurado de violência iminente, se tiver justo receio de ser molestado."

No âmbito processual, o artigo 560 do Código de Processo Civil autoriza a concessão de liminar nas ações possessórias de força nova, in verbis:

"Art. 560. O possuidor tem direito a ser mantido na posse em caso de turbação e reintegrado em caso de esbulho."

A jurisprudência pátria é pacífica no sentido de que, comprovada a posse anterior e o esbulho, impõe-se a reintegração do possuidor esbulhado.`,
      pedidos: `III - DOS PEDIDOS

Ante o exposto, requer-se a Vossa Excelência:

a) A concessão de medida liminar inaudita altera parte, determinando a imediata reintegração do Autor na posse do imóvel descrito, expedindo-se o competente mandado;

b) A citação do Réu para, querendo, contestar a presente ação, sob pena de revelia;

c) A procedência total dos pedidos, confirmando-se a liminar e determinando-se a definitiva reintegração do Autor na posse do imóvel;

d) A condenação do Réu ao pagamento de indenização pelos danos causados durante o período de esbulho, a serem apurados em liquidação de sentença;

e) A condenação do Réu ao pagamento das custas processuais e honorários advocatícios, estes fixados em 20% sobre o valor da causa;

f) A produção de todas as provas em direito admitidas, especialmente documental, testemunhal e pericial.

Dá-se à causa o valor de R$ [VALOR].

Nestes termos,
Pede deferimento.

[LOCAL], [DATA].

_______________________________
ADVOGADO
OAB/[UF] Nº [NÚMERO]`
    }
  },
  {
    id: 'civil-classico-usucapiao',
    templateType: 'civil',
    title: '⚜️ Usucapião Extraordinária - Clássico',
    description: 'Template clássico elegante para ação de usucapião',
    content: {
      tribunal: 'Meritíssimo Juízo da Vara de Registros Públicos da Comarca de [CIDADE/UF]',
      valorCausa: 'R$ [VALOR DO IMÓVEL]',
      fatos: `EXCELENTÍSSIMO SENHOR DOUTOR JUIZ DE DIREITO

O AUTOR, já qualificado, vem, respeitosamente, à presença de Vossa Excelência, por seu advogado infra-assinado, propor a presente

AÇÃO DE USUCAPIÃO EXTRAORDINÁRIA

pelos fatos e fundamentos a seguir aduzidos:

I - DO IMÓVEL USUCAPIENDO

O imóvel objeto da presente ação situa-se à [ENDEREÇO COMPLETO], com as seguintes características e confrontações:

ÁREA: [METRAGEM] m²
CONFRONTAÇÕES:
- Ao Norte: [CONFRONTAÇÃO]
- Ao Sul: [CONFRONTAÇÃO]
- A Leste: [CONFRONTAÇÃO]
- A Oeste: [CONFRONTAÇÃO]

II - DA POSSE

O Autor exerce posse mansa, pacífica, ininterrupta e com animus domini sobre o referido imóvel desde [DATA], perfazendo mais de [TEMPO] anos de posse.

Durante todo este período, o Autor realizou benfeitorias no imóvel, pagou os tributos incidentes e exerceu todos os atos inerentes à propriedade, conforme documentação anexa.

A posse do Autor é pública e notória, sendo reconhecida por toda a vizinhança, conforme se comprovará por prova testemunhal.`,
      fundamentosJuridicos: `III - DO DIREITO

A usucapião extraordinária encontra fundamento no artigo 1.238 do Código Civil:

"Art. 1.238. Aquele que, por quinze anos, sem interrupção, nem oposição, possuir como seu um imóvel, adquire-lhe a propriedade, independentemente de título e boa-fé; podendo requerer ao juiz que assim o declare por sentença, a qual servirá de título para o registro no Cartório de Registro de Imóveis."

O parágrafo único do mesmo dispositivo reduz o prazo para dez anos quando o possuidor houver estabelecido no imóvel sua moradia habitual ou nele realizado obras ou serviços de caráter produtivo.

A Constituição Federal, em seu artigo 5º, inciso XXIII, estabelece que a propriedade atenderá sua função social, sendo a usucapião instrumento de regularização fundiária e concretização deste princípio constitucional.

A jurisprudência do Superior Tribunal de Justiça consolidou o entendimento de que a usucapião é modo originário de aquisição da propriedade, não havendo transmissão do antigo para o novo proprietário.`,
      pedidos: `IV - DOS PEDIDOS

Ante o exposto, requer-se a Vossa Excelência:

a) A citação dos réus certos e incertos, bem como dos confinantes, para, querendo, contestarem a presente ação;

b) A citação por edital dos eventuais interessados;

c) A intimação dos representantes da Fazenda Pública da União, do Estado e do Município;

d) A intimação do Ministério Público;

e) A procedência do pedido, declarando-se a aquisição da propriedade do imóvel descrito pelo Autor, por usucapião extraordinária;

f) A expedição de mandado para registro da sentença no Cartório de Registro de Imóveis competente;

g) A condenação dos réus que eventualmente contestarem ao pagamento das custas processuais e honorários advocatícios;

h) A produção de todas as provas em direito admitidas, especialmente documental, testemunhal e pericial.

Dá-se à causa o valor de R$ [VALOR DO IMÓVEL].

Nestes termos,
Pede deferimento.

[LOCAL], [DATA].

_______________________________
ADVOGADO
OAB/[UF] Nº [NÚMERO]`
    }
  },

  // ===== TEMPLATES TRABALHISTAS - MODERNOS =====
  {
    id: 'trabalhista-moderno-assedio',
    templateType: 'trabalhista',
    title: '📊 Assédio Moral - Moderno',
    description: 'Template moderno para reclamação por assédio moral no trabalho',
    content: {
      tribunal: 'Vara do Trabalho de [CIDADE/UF]',
      valorCausa: 'R$ [VALOR]',
      fatos: `📋 RESUMO DO CASO

┌─────────────────────────────────────────┐
│ 👤 RECLAMANTE: [NOME]                   │
│ 🏢 RECLAMADA: [EMPRESA]                 │
│ 📅 Admissão: [DATA]                     │
│ 📅 Demissão: [DATA]                     │
│ 💼 Cargo: [FUNÇÃO]                      │
│ 💰 Salário: R$ [VALOR]                  │
└─────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚨 CONDUTAS DE ASSÉDIO IDENTIFICADAS:

① Humilhações públicas e constantes
② Isolamento do grupo de trabalho
③ Atribuição de tarefas impossíveis
④ Críticas excessivas e injustificadas
⑤ Ameaças veladas de demissão

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CRONOLOGIA DOS FATOS:

🔹 [DATA 1] - Início das condutas abusivas
🔹 [DATA 2] - Primeira humilhação pública
🔹 [DATA 3] - Afastamento médico por estresse
🔹 [DATA 4] - Retorno ao trabalho
🔹 [DATA 5] - Intensificação do assédio
🔹 [DATA 6] - Demissão/Pedido de rescisão indireta

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CONSEQUÊNCIAS PARA O RECLAMANTE:
▸ Desenvolvimento de quadro de ansiedade
▸ Síndrome de burnout diagnosticada
▸ Afastamento previdenciário
▸ Tratamento psicológico/psiquiátrico`,
      fundamentosJuridicos: `⚖️ FUNDAMENTOS JURÍDICOS

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 CONSTITUIÇÃO FEDERAL:

▸ Art. 1º, III - Dignidade da pessoa humana
▸ Art. 5º, X - Inviolabilidade da honra e imagem
▸ Art. 7º, XXII - Redução dos riscos do trabalho

📌 CLT:

▸ Art. 483, "d" e "e" - Rescisão indireta
▸ Art. 223-B a 223-G - Dano extrapatrimonial

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 JURISPRUDÊNCIA:

"O assédio moral caracteriza-se pela exposição do trabalhador a situações humilhantes e constrangedoras, de forma repetitiva e prolongada, durante a jornada de trabalho." (TST, RR-xxx)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PARÂMETROS PARA FIXAÇÃO DA INDENIZAÇÃO (Art. 223-G, CLT):
▸ Natureza do bem jurídico tutelado
▸ Intensidade do sofrimento
▸ Possibilidade de superação
▸ Extensão e duração dos efeitos
▸ Condições em que ocorreu a ofensa
▸ Grau de culpa do ofensor`,
      pedidos: `✅ PEDIDOS

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔴 PEDIDO PRINCIPAL:
① Reconhecimento da rescisão indireta do contrato
② Pagamento de todas as verbas rescisórias

🟡 INDENIZAÇÕES:
③ Danos morais: R$ [VALOR] (50x último salário)
④ Danos materiais: despesas médicas comprovadas
⑤ Pensionamento: se houver redução da capacidade

🟢 VERBAS TRABALHISTAS:
⑥ Aviso prévio indenizado
⑦ Férias + 1/3
⑧ 13º proporcional
⑨ FGTS + 40%
⑩ Liberação de guias (FGTS e seguro-desemprego)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Dá-se à causa o valor de R$ [VALOR].

Termos em que, pede deferimento.`
    }
  },
  {
    id: 'trabalhista-moderno-acidente',
    templateType: 'trabalhista',
    title: '📊 Acidente de Trabalho - Moderno',
    description: 'Template moderno para ação de acidente de trabalho',
    content: {
      tribunal: 'Vara do Trabalho de [CIDADE/UF]',
      valorCausa: 'R$ [VALOR]',
      fatos: `📋 DADOS DO ACIDENTE

┌─────────────────────────────────────────┐
│ 📅 Data: [DATA DO ACIDENTE]             │
│ 🕐 Horário: [HORÁRIO]                   │
│ 📍 Local: [LOCAL]                       │
│ 🔧 Atividade: [ATIVIDADE]               │
│ 🚑 CAT emitida: [SIM/NÃO]               │
└─────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ DESCRIÇÃO DO ACIDENTE:

O RECLAMANTE, no exercício de suas funções como [CARGO], sofreu acidente de trabalho quando [DESCREVER CIRCUNSTÂNCIAS DO ACIDENTE].

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🏥 CONSEQUÊNCIAS:

▸ Lesão: [TIPO DE LESÃO]
▸ CID: [CÓDIGO CID]
▸ Afastamento: [PERÍODO]
▸ Sequelas: [DESCREVER]
▸ Redução capacidade: [PERCENTUAL]%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ FALHAS DA EMPRESA:

① Ausência de EPI adequado
② Falta de treinamento específico
③ Ambiente de trabalho inseguro
④ Não emissão de CAT
⑤ Descumprimento de NRs`,
      fundamentosJuridicos: `⚖️ FUNDAMENTOS JURÍDICOS

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 CONSTITUIÇÃO FEDERAL:

▸ Art. 7º, XXII - Redução dos riscos do trabalho
▸ Art. 7º, XXVIII - Seguro contra acidentes

📌 CLT E LEGISLAÇÃO:

▸ Art. 157 - Obrigações do empregador
▸ Lei 8.213/91 - Benefícios previdenciários
▸ NRs aplicáveis - Normas de segurança

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 RESPONSABILIDADE OBJETIVA:

"Em se tratando de atividade de risco, aplica-se a responsabilidade objetiva do empregador, nos termos do art. 927, parágrafo único, do CC." (TST)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NEXO CAUSAL:
▸ Acidente ocorreu no local e horário de trabalho
▸ Durante execução de atividade laboral
▸ Laudo médico comprova relação com trabalho`,
      pedidos: `✅ PEDIDOS

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔴 INDENIZAÇÕES:
① Danos morais: R$ [VALOR]
② Danos materiais: despesas médicas
③ Danos estéticos: se aplicável
④ Pensionamento vitalício/temporário

🟡 ESTABILIDADE:
⑤ Reconhecimento da estabilidade acidentária
⑥ Reintegração ou indenização substitutiva

🟢 OBRIGAÇÕES DE FAZER:
⑦ Emissão de CAT retroativa
⑧ Retificação de CTPS
⑨ Depósitos de FGTS do período

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Dá-se à causa o valor de R$ [VALOR].

Termos em que, pede deferimento.`
    }
  },

  // ===== TEMPLATES TRABALHISTAS - CLÁSSICOS ELEGANTES =====
  {
    id: 'trabalhista-classico-equiparacao',
    templateType: 'trabalhista',
    title: '⚜️ Equiparação Salarial - Clássico',
    description: 'Template clássico elegante para ação de equiparação salarial',
    content: {
      tribunal: 'Meritíssimo Juízo da Vara do Trabalho de [CIDADE/UF]',
      valorCausa: 'R$ [VALOR]',
      fatos: `EXCELENTÍSSIMO SENHOR DOUTOR JUIZ DO TRABALHO

O RECLAMANTE, já qualificado, vem, respeitosamente, à presença de Vossa Excelência, propor a presente

RECLAMAÇÃO TRABALHISTA - EQUIPARAÇÃO SALARIAL

em face da RECLAMADA, pelos fatos e fundamentos a seguir expostos:

I - DO CONTRATO DE TRABALHO

O Reclamante foi admitido pela Reclamada em [DATA], para exercer a função de [CARGO], mediante salário mensal de R$ [VALOR].

II - DO PARADIGMA

O empregado [NOME DO PARADIGMA], doravante denominado paradigma, exerce idêntica função à do Reclamante, no mesmo estabelecimento, percebendo salário superior de R$ [VALOR DO PARADIGMA].

III - DOS REQUISITOS DA EQUIPARAÇÃO

Restam preenchidos todos os requisitos legais para a equiparação salarial:

a) Identidade de função: ambos exercem as mesmas atividades;
b) Trabalho de igual valor: mesma produtividade e perfeição técnica;
c) Mesmo empregador: ambos são empregados da Reclamada;
d) Mesma localidade: trabalham no mesmo estabelecimento;
e) Diferença de tempo na função não superior a 2 anos;
f) Diferença de tempo de serviço não superior a 4 anos.`,
      fundamentosJuridicos: `IV - DO DIREITO

A equiparação salarial encontra fundamento no artigo 461 da CLT:

"Art. 461. Sendo idêntica a função, a todo trabalho de igual valor, prestado ao mesmo empregador, no mesmo estabelecimento empresarial, corresponderá igual salário, sem distinção de sexo, etnia, nacionalidade ou idade."

O § 1º do mesmo dispositivo define trabalho de igual valor como aquele feito com igual produtividade e com a mesma perfeição técnica, entre pessoas cuja diferença de tempo de serviço para o mesmo empregador não seja superior a quatro anos e a diferença de tempo na função não seja superior a dois anos.

A Súmula 6 do Tribunal Superior do Trabalho consolida o entendimento jurisprudencial sobre a matéria, estabelecendo os requisitos e pressupostos da equiparação salarial.

O princípio da isonomia salarial decorre do artigo 7º, XXX, da Constituição Federal, que veda diferença de salários por motivo de sexo, idade, cor ou estado civil.`,
      pedidos: `V - DOS PEDIDOS

Ante o exposto, requer-se a Vossa Excelência:

a) A notificação da Reclamada para, querendo, apresentar defesa;

b) A procedência do pedido, condenando-se a Reclamada ao pagamento das diferenças salariais decorrentes da equiparação com o paradigma, desde [DATA], com reflexos em:
   - Aviso prévio
   - 13º salários
   - Férias + 1/3
   - FGTS + 40%
   - Horas extras, se houver
   - DSR

c) A condenação da Reclamada ao pagamento de honorários advocatícios de sucumbência;

d) A produção de todas as provas em direito admitidas, especialmente documental, testemunhal e pericial;

e) A concessão dos benefícios da justiça gratuita, por ser o Reclamante pessoa hipossuficiente.

Dá-se à causa o valor de R$ [VALOR].

Nestes termos,
Pede deferimento.

[LOCAL], [DATA].

_______________________________
ADVOGADO
OAB/[UF] Nº [NÚMERO]`
    }
  },

  // ===== TEMPLATES CRIMINAIS - MODERNOS =====
  {
    id: 'criminal-moderno-habeas',
    templateType: 'criminal',
    title: '📊 Habeas Corpus - Moderno',
    description: 'Template moderno para impetração de Habeas Corpus',
    content: {
      tribunal: 'Tribunal de Justiça do Estado de [UF]',
      valorCausa: 'Não há',
      fatos: `📋 DADOS DO PACIENTE

┌─────────────────────────────────────────┐
│ 👤 PACIENTE: [NOME]                     │
│ 📋 CPF: [NÚMERO]                        │
│ 🏠 Endereço: [ENDEREÇO]                 │
│ ⚖️ Processo: [NÚMERO]                   │
│ 🔒 Situação: PRESO desde [DATA]         │
└─────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ CONSTRANGIMENTO ILEGAL IDENTIFICADO:

① Excesso de prazo na prisão preventiva
② Ausência de fundamentação idônea
③ Possibilidade de medidas cautelares alternativas
④ Condições pessoais favoráveis

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📅 CRONOLOGIA PROCESSUAL:

🔹 [DATA] - Prisão em flagrante
🔹 [DATA] - Conversão em preventiva
🔹 [DATA] - Denúncia oferecida
🔹 [DATA] - Recebimento da denúncia
🔹 [DATA] - Audiência de instrução (não realizada)
🔹 HOJE - [X] dias de prisão sem sentença

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ CONDIÇÕES FAVORÁVEIS DO PACIENTE:

▸ Residência fixa
▸ Ocupação lícita
▸ Família constituída
▸ Primariedade
▸ Bons antecedentes`,
      fundamentosJuridicos: `⚖️ FUNDAMENTOS JURÍDICOS

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 CONSTITUIÇÃO FEDERAL:

▸ Art. 5º, LXVIII - Habeas Corpus
▸ Art. 5º, LVII - Presunção de inocência
▸ Art. 5º, LXXVIII - Razoável duração do processo

📌 CÓDIGO DE PROCESSO PENAL:

▸ Art. 312 - Requisitos da preventiva
▸ Art. 319 - Medidas cautelares alternativas
▸ Art. 648 - Hipóteses de constrangimento ilegal

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 JURISPRUDÊNCIA STF/STJ:

"A prisão preventiva exige fundamentação concreta, não bastando a mera reprodução do texto legal." (HC xxx/STF)

"O excesso de prazo na formação da culpa configura constrangimento ilegal sanável por habeas corpus." (HC xxx/STJ)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PROPORCIONALIDADE:
▸ Pena máxima do crime: [X] anos
▸ Tempo já preso: [Y] meses
▸ Regime inicial provável: [REGIME]`,
      pedidos: `✅ PEDIDOS

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔴 LIMINAR:
① Expedição de alvará de soltura IMEDIATO
② Alternativamente, aplicação de medidas do art. 319, CPP

🟢 MÉRITO:
③ Concessão definitiva da ordem
④ Reconhecimento do constrangimento ilegal
⑤ Revogação da prisão preventiva

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📎 DOCUMENTOS ANEXOS:
▸ Procuração
▸ Cópia da decisão que decretou a prisão
▸ Certidão de antecedentes
▸ Comprovante de residência
▸ Comprovante de ocupação lícita

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Termos em que, pede deferimento.`
    }
  },

  // ===== TEMPLATES CRIMINAIS - CLÁSSICOS ELEGANTES =====
  {
    id: 'criminal-classico-revisao',
    templateType: 'criminal',
    title: '⚜️ Revisão Criminal - Clássico',
    description: 'Template clássico elegante para revisão criminal',
    content: {
      tribunal: 'Colendo Tribunal de Justiça do Estado de [UF]',
      valorCausa: 'Não há',
      fatos: `EXCELENTÍSSIMOS SENHORES DESEMBARGADORES DO GRUPO DE CÂMARAS CRIMINAIS

O REQUERENTE, já qualificado, vem, respeitosamente, à presença de Vossas Excelências, por intermédio de seu advogado, impetrar a presente

REVISÃO CRIMINAL

com fundamento no artigo 621 do Código de Processo Penal, pelos fatos e fundamentos a seguir expostos:

I - DA CONDENAÇÃO REVISANDA

O Requerente foi condenado nos autos do processo nº [NÚMERO], que tramitou perante a [VARA] da Comarca de [CIDADE], à pena de [PENA], pela prática do crime previsto no artigo [ARTIGO] do Código Penal.

A sentença condenatória transitou em julgado em [DATA], conforme certidão anexa.

II - DOS FATOS

A condenação baseou-se exclusivamente em [DESCREVER BASE DA CONDENAÇÃO].

Contudo, após o trânsito em julgado, surgiram novas provas que demonstram cabalmente a inocência do Requerente, a saber: [DESCREVER NOVAS PROVAS].

Ademais, a sentença condenatória contrariou texto expresso de lei penal, especificamente [INDICAR DISPOSITIVO VIOLADO].`,
      fundamentosJuridicos: `III - DO DIREITO

A revisão criminal encontra amparo no artigo 621 do Código de Processo Penal:

"Art. 621. A revisão dos processos findos será admitida:
I - quando a sentença condenatória for contrária ao texto expresso da lei penal ou à evidência dos autos;
II - quando a sentença condenatória se fundar em depoimentos, exames ou documentos comprovadamente falsos;
III - quando, após a sentença, se descobrirem novas provas de inocência do condenado ou de circunstância que determine ou autorize diminuição especial da pena."

O artigo 626 do mesmo diploma estabelece que, julgando procedente a revisão, o tribunal poderá alterar a classificação da infração, absolver o réu, modificar a pena ou anular o processo.

A jurisprudência dos Tribunais Superiores é pacífica no sentido de que a revisão criminal é ação autônoma de impugnação, que visa rescindir a coisa julgada em favor do condenado, quando presentes as hipóteses legais.

Trata-se de instrumento de garantia da liberdade individual, que não pode ser obstaculizado por formalismos excessivos.`,
      pedidos: `IV - DOS PEDIDOS

Ante o exposto, requer-se a Vossas Excelências:

a) O recebimento e processamento da presente revisão criminal;

b) A requisição dos autos do processo originário para exame;

c) A oitiva do Ministério Público;

d) A procedência do pedido revisional, para:
   - ABSOLVER o Requerente das imputações que lhe foram feitas, com fundamento no artigo 621, III, do CPP; ou
   - Alternativamente, REDUZIR a pena aplicada, adequando-a aos parâmetros legais;

e) A expedição de alvará de soltura, caso o Requerente esteja preso;

f) A reabilitação do Requerente, com a exclusão de seu nome do rol dos culpados;

g) A declaração do direito à indenização por erro judiciário, nos termos do artigo 630 do CPP.

Nestes termos,
Pede deferimento.

[LOCAL], [DATA].

_______________________________
ADVOGADO
OAB/[UF] Nº [NÚMERO]`
    }
  },

  // ===== TEMPLATES TRIBUTÁRIOS - MODERNOS =====
  {
    id: 'tributaria-moderno-repetição',
    templateType: 'tributario',
    title: '📊 Repetição de Indébito - Moderno',
    description: 'Template moderno para ação de repetição de indébito tributário',
    content: {
      tribunal: 'Vara da Fazenda Pública de [CIDADE/UF]',
      valorCausa: 'R$ [VALOR]',
      fatos: `📋 DADOS DO TRIBUTO

┌─────────────────────────────────────────┐
│ 💰 Tributo: [ICMS/ISS/IPTU/etc.]        │
│ 📅 Período: [MÊS/ANO] a [MÊS/ANO]       │
│ 💵 Valor pago: R$ [VALOR]               │
│ 💵 Valor devido: R$ [VALOR]             │
│ 💵 Diferença: R$ [VALOR]                │
└─────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ MOTIVO DA REPETIÇÃO:

① Pagamento indevido por erro de cálculo
② Tributo declarado inconstitucional
③ Pagamento em duplicidade
④ Base de cálculo incorreta
⑤ Alíquota aplicada erroneamente

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 DEMONSTRATIVO DE VALORES:

| Competência | Pago      | Devido    | Diferença |
|-------------|-----------|-----------|-----------|
| [MÊS/ANO]   | R$ X      | R$ Y      | R$ Z      |
| [MÊS/ANO]   | R$ X      | R$ Y      | R$ Z      |
| TOTAL       | R$ XX     | R$ YY     | R$ ZZ     |

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

O AUTOR efetuou pagamentos a maior do tributo [ESPECIFICAR], conforme documentação anexa, tendo direito à restituição dos valores pagos indevidamente.`,
      fundamentosJuridicos: `⚖️ FUNDAMENTOS JURÍDICOS

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 CÓDIGO TRIBUTÁRIO NACIONAL:

▸ Art. 165 - Direito à restituição
▸ Art. 166 - Restituição de tributos indiretos
▸ Art. 167 - Restituição com juros e correção
▸ Art. 168 - Prazo prescricional de 5 anos

📌 CONSTITUIÇÃO FEDERAL:

▸ Art. 150, I - Legalidade tributária
▸ Art. 150, IV - Vedação ao confisco

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 JURISPRUDÊNCIA:

"O contribuinte tem direito à restituição do tributo pago indevidamente, corrigido monetariamente desde o pagamento." (STJ, REsp xxx)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CORREÇÃO MONETÁRIA:
▸ Índice: SELIC
▸ Termo inicial: data do pagamento indevido
▸ Termo final: efetiva restituição`,
      pedidos: `✅ PEDIDOS

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔴 TUTELA DE URGÊNCIA:
① Compensação imediata com débitos vincendos
② Suspensão de cobranças relacionadas

🟢 PEDIDOS PRINCIPAIS:
③ Citação da Fazenda Pública
④ Procedência total do pedido
⑤ Restituição de R$ [VALOR]
⑥ Correção pela SELIC desde cada pagamento
⑦ Honorários de 10% sobre o proveito econômico
⑧ Custas processuais

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Dá-se à causa o valor de R$ [VALOR].

Termos em que, pede deferimento.`
    }
  },

  // ===== TEMPLATES TRIBUTÁRIOS - CLÁSSICOS ELEGANTES =====
  {
    id: 'tributaria-classico-anulatoria',
    templateType: 'tributario',
    title: '⚜️ Anulatória de Débito Fiscal - Clássico',
    description: 'Template clássico elegante para ação anulatória de débito fiscal',
    content: {
      tribunal: 'Meritíssimo Juízo da Vara da Fazenda Pública de [CIDADE/UF]',
      valorCausa: 'R$ [VALOR DO DÉBITO]',
      fatos: `EXCELENTÍSSIMO SENHOR DOUTOR JUIZ DE DIREITO

O AUTOR, já qualificado, vem, respeitosamente, à presença de Vossa Excelência, propor a presente

AÇÃO ANULATÓRIA DE DÉBITO FISCAL COM PEDIDO DE TUTELA ANTECIPADA

em face da FAZENDA PÚBLICA [MUNICIPAL/ESTADUAL/FEDERAL], pelos fatos e fundamentos a seguir aduzidos:

I - DO DÉBITO FISCAL IMPUGNADO

O Autor foi autuado pela Fazenda Pública através do Auto de Infração nº [NÚMERO], lavrado em [DATA], que constituiu crédito tributário no valor de R$ [VALOR], referente ao tributo [ESPECIFICAR], competência [PERÍODO].

II - DOS FATOS

O referido auto de infração padece de vícios insanáveis que maculam sua validade, conforme se demonstrará.

[DESCREVER OS VÍCIOS DO AUTO DE INFRAÇÃO]

O Autor exerceu regularmente suas atividades, cumprindo todas as obrigações tributárias principais e acessórias, não havendo qualquer fundamento para a autuação perpetrada.

A Fazenda Pública, ao lavrar o auto de infração, incorreu em erro de fato e de direito, aplicando legislação inaplicável ao caso concreto.`,
      fundamentosJuridicos: `III - DO DIREITO

A nulidade do auto de infração decorre da violação aos princípios constitucionais da legalidade e da tipicidade tributária, insculpidos no artigo 150, inciso I, da Constituição Federal.

O Código Tributário Nacional, em seu artigo 142, estabelece os requisitos para o lançamento tributário:

"Art. 142. Compete privativamente à autoridade administrativa constituir o crédito tributário pelo lançamento, assim entendido o procedimento administrativo tendente a verificar a ocorrência do fato gerador da obrigação correspondente, determinar a matéria tributável, calcular o montante do tributo devido, identificar o sujeito passivo e, sendo caso, propor a aplicação da penalidade cabível."

O auto de infração impugnado não observou os requisitos legais, especialmente quanto à [ESPECIFICAR VÍCIO].

A jurisprudência do Superior Tribunal de Justiça é pacífica no sentido de que o auto de infração que não observa os requisitos legais é nulo de pleno direito.`,
      pedidos: `IV - DOS PEDIDOS

Ante o exposto, requer-se a Vossa Excelência:

a) A concessão de tutela antecipada para suspender a exigibilidade do crédito tributário, nos termos do artigo 151, V, do CTN, determinando-se à Ré que se abstenha de:
   - Inscrever o débito em dívida ativa;
   - Ajuizar execução fiscal;
   - Inscrever o Autor em cadastros de inadimplentes;
   - Negar certidões de regularidade fiscal;

b) A citação da Ré para, querendo, contestar a presente ação;

c) A procedência total do pedido, declarando-se a nulidade do Auto de Infração nº [NÚMERO] e a inexistência do crédito tributário dele decorrente;

d) A condenação da Ré ao pagamento das custas processuais e honorários advocatícios;

e) A produção de todas as provas em direito admitidas.

Dá-se à causa o valor de R$ [VALOR DO DÉBITO].

Nestes termos,
Pede deferimento.

[LOCAL], [DATA].

_______________________________
ADVOGADO
OAB/[UF] Nº [NÚMERO]`
    }
  },

  // ===== TEMPLATES CONSUMIDOR - MODERNOS =====
  {
    id: 'consumidor-moderno-produto',
    templateType: 'consumidor',
    title: '📊 Produto Defeituoso - Moderno',
    description: 'Template moderno para ação por produto defeituoso',
    content: {
      tribunal: 'Juizado Especial Cível de [CIDADE/UF]',
      valorCausa: 'R$ [VALOR]',
      fatos: `📋 DADOS DA COMPRA

┌─────────────────────────────────────────┐
│ 🛒 Produto: [DESCRIÇÃO]                 │
│ 📅 Data compra: [DATA]                  │
│ 💰 Valor: R$ [VALOR]                    │
│ 🏪 Loja: [NOME]                         │
│ 📋 NF: [NÚMERO]                         │
└─────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ PROBLEMA IDENTIFICADO:

① Defeito de fabricação
② Produto não funciona conforme anunciado
③ Especificações diferentes do prometido
④ Vício oculto descoberto após uso

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📅 CRONOLOGIA:

🔹 [DATA] - Compra do produto
🔹 [DATA] - Identificação do defeito
🔹 [DATA] - Reclamação na loja (protocolo: xxx)
🔹 [DATA] - Reclamação no SAC (protocolo: xxx)
🔹 [DATA] - Reclamação no Procon
🔹 [DATA] - Prazo de 30 dias esgotado sem solução

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ TENTATIVAS DE SOLUÇÃO SEM SUCESSO:

▸ Contato com SAC: [X] vezes
▸ Ida à loja: [X] vezes
▸ Reclamação Procon: Sem acordo
▸ Reclame Aqui: Sem resposta`,
      fundamentosJuridicos: `⚖️ FUNDAMENTOS JURÍDICOS

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 CÓDIGO DE DEFESA DO CONSUMIDOR:

▸ Art. 12 - Responsabilidade pelo fato do produto
▸ Art. 18 - Responsabilidade por vício do produto
▸ Art. 26 - Prazo decadencial (30/90 dias)
▸ Art. 35 - Alternativas do consumidor

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 DIREITOS DO CONSUMIDOR (Art. 18, §1º):

Não sanado o vício em 30 dias, o consumidor pode:
① Substituição do produto
② Restituição do valor pago
③ Abatimento proporcional do preço

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

RESPONSABILIDADE OBJETIVA:
▸ Não precisa provar culpa
▸ Fornecedor responde pelo defeito
▸ Solidariedade entre fabricante e vendedor`,
      pedidos: `✅ PEDIDOS

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔴 PEDIDO PRINCIPAL (escolher um):
① Substituição do produto por outro novo
② Restituição integral: R$ [VALOR]
③ Abatimento proporcional do preço

🟡 DANOS MORAIS:
④ Indenização: R$ [VALOR]
   (transtornos, tempo perdido, frustração)

🟢 OUTROS:
⑤ Inversão do ônus da prova
⑥ Honorários advocatícios
⑦ Custas processuais

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Dá-se à causa o valor de R$ [VALOR].

Termos em que, pede deferimento.`
    }
  },

  // ===== TEMPLATES CONSUMIDOR - CLÁSSICOS ELEGANTES =====
  {
    id: 'consumidor-classico-bancario',
    templateType: 'consumidor',
    title: '⚜️ Revisão Contrato Bancário - Clássico',
    description: 'Template clássico elegante para revisão de contrato bancário',
    content: {
      tribunal: 'Meritíssimo Juízo da Vara Cível de [CIDADE/UF]',
      valorCausa: 'R$ [VALOR]',
      fatos: `EXCELENTÍSSIMO SENHOR DOUTOR JUIZ DE DIREITO

O AUTOR, já qualificado, vem, respeitosamente, à presença de Vossa Excelência, propor a presente

AÇÃO REVISIONAL DE CONTRATO BANCÁRIO C/C REPETIÇÃO DE INDÉBITO E DANOS MORAIS

em face do BANCO RÉU, pelos fatos e fundamentos a seguir expostos:

I - DO CONTRATO

O Autor celebrou com o Réu contrato de [TIPO DE CONTRATO] em [DATA], no valor de R$ [VALOR], para pagamento em [NÚMERO] parcelas de R$ [VALOR DA PARCELA].

II - DAS CLÁUSULAS ABUSIVAS

Analisando detidamente o contrato firmado entre as partes, verifica-se a existência de diversas cláusulas abusivas que oneram excessivamente o consumidor:

a) Taxa de juros remuneratórios de [X]% ao mês, muito superior à taxa média de mercado divulgada pelo Banco Central;

b) Capitalização mensal de juros, vedada pela legislação;

c) Cobrança de tarifa de [ESPECIFICAR] no valor de R$ [VALOR], sem previsão contratual clara;

d) Comissão de permanência cumulada com outros encargos moratórios.

III - DA NEGATIVAÇÃO INDEVIDA

O Réu procedeu à inscrição do nome do Autor nos cadastros restritivos de crédito, causando-lhe constrangimento e abalo à sua honra e imagem.`,
      fundamentosJuridicos: `IV - DO DIREITO

A relação entre as partes é de consumo, aplicando-se o Código de Defesa do Consumidor, conforme Súmula 297 do STJ: "O Código de Defesa do Consumidor é aplicável às instituições financeiras."

O artigo 51, inciso IV, do CDC estabelece a nulidade de cláusulas que "estabeleçam obrigações consideradas iníquas, abusivas, que coloquem o consumidor em desvantagem exagerada, ou sejam incompatíveis com a boa-fé ou a equidade."

A Súmula 379 do STJ dispõe que "Nos contratos bancários não regidos por legislação específica, os juros moratórios poderão ser convencionados até o limite de 1% ao mês."

A Súmula 472 do STJ estabelece que "A cobrança de comissão de permanência – Loss – exclui a exigibilidade dos juros remuneratórios, moratórios e da multa contratual."

Quanto aos danos morais, a jurisprudência é pacífica no sentido de que a inscrição indevida em cadastros restritivos gera dano moral in re ipsa, dispensando prova do prejuízo.`,
      pedidos: `V - DOS PEDIDOS

Ante o exposto, requer-se a Vossa Excelência:

a) A concessão de tutela antecipada para:
   - Determinar a exclusão do nome do Autor dos cadastros restritivos;
   - Autorizar o depósito judicial das parcelas vincendas pelo valor incontroverso;

b) A citação do Réu para, querendo, contestar a presente ação;

c) A procedência total dos pedidos, para:
   - Declarar a nulidade das cláusulas abusivas;
   - Revisar a taxa de juros para a média de mercado;
   - Afastar a capitalização de juros;
   - Excluir tarifas indevidas;
   - Recalcular o saldo devedor;
   - Condenar o Réu à restituição em dobro dos valores pagos a maior;
   - Condenar o Réu ao pagamento de indenização por danos morais no valor de R$ [VALOR];

d) A inversão do ônus da prova, nos termos do artigo 6º, VIII, do CDC;

e) A condenação do Réu ao pagamento das custas processuais e honorários advocatícios.

Dá-se à causa o valor de R$ [VALOR].

Nestes termos,
Pede deferimento.

[LOCAL], [DATA].

_______________________________
ADVOGADO
OAB/[UF] Nº [NÚMERO]`
    }
  }
];

/**
 * Exporta todos os novos templates
 */
export function getNewTemplates(): PetitionTemplate[] {
  return newTemplates;
}
