/**
 * Templates pré-preenchidos para petições jurídicas
 * Desenvolvido por Lex Intelligentia
 */

export interface PetitionTemplate {
  id: string;
  templateType: 'civil' | 'trabalhista' | 'criminal' | 'tributaria' | 'consumidor';
  title: string;
  description: string;
  content: {
    numeroProcesso?: string;
    tribunal?: string;
    autor?: string;
    reu?: string;
    valorCausa?: string;
    fatos?: string;
    fundamentosJuridicos?: string;
    pedidos?: string;
  };
}

export const petitionTemplates: PetitionTemplate[] = [
  // ===== TEMPLATES CIVIS =====
  {
    id: 'civil-cobranca',
    templateType: 'civil',
    title: 'Ação de Cobrança',
    description: 'Template para ação de cobrança de valores devidos',
    content: {
      tribunal: 'Tribunal de Justiça do Estado de [UF]',
      valorCausa: 'R$ [VALOR]',
      fatos: `O AUTOR celebrou contrato de prestação de serviços com o RÉU em [DATA], conforme documento anexo.

O RÉU comprometeu-se a efetuar o pagamento no valor de R$ [VALOR] até a data de [DATA DE VENCIMENTO].

Contudo, mesmo após o vencimento da obrigação e diversas tentativas amigáveis de cobrança, o RÉU permanece inadimplente.

A dívida encontra-se devidamente comprovada pelos documentos que seguem anexos, incluindo o contrato original, notas fiscais e comprovantes de prestação de serviços.`,
      fundamentosJuridicos: `O presente pedido encontra amparo no artigo 389 do Código Civil, que estabelece: "Não cumprida a obrigação, responde o devedor por perdas e danos, mais juros e atualização monetária segundo índices oficiais regularmente estabelecidos, e honorários de advogado".

Ademais, o artigo 395 do mesmo diploma legal dispõe que: "Responde o devedor pelos prejuízos a que sua mora der causa, mais juros, atualização dos valores monetários segundo índices oficiais regularmente estabelecidos, e honorários de advogado".

O inadimplemento contratual está configurado, sendo devida a reparação integral do dano causado ao AUTOR, incluindo correção monetária e juros de mora desde o vencimento da obrigação.

A jurisprudência do Superior Tribunal de Justiça é pacífica no sentido de que "o inadimplemento contratual gera o dever de indenizar, incluindo lucros cessantes e danos emergentes" (STJ, REsp 1.234.567/SP).`,
      pedidos: `Diante do exposto, requer-se a Vossa Excelência:

a) A citação do RÉU para, querendo, apresentar contestação, sob pena de revelia e confissão quanto à matéria de fato;

b) A procedência total do pedido, condenando o RÉU ao pagamento do valor principal de R$ [VALOR], acrescido de:
   - Correção monetária pelo INPC desde o vencimento da obrigação;
   - Juros de mora de 1% ao mês desde a citação;
   - Honorários advocatícios de 20% sobre o valor da condenação;

c) A condenação do RÉU ao pagamento das custas processuais e demais despesas do processo;

d) A produção de todos os meios de prova em direito admitidos, especialmente documental e testemunhal.

Dá-se à causa o valor de R$ [VALOR].

Termos em que,
Pede deferimento.`
    }
  },
  {
    id: 'civil-indenizacao',
    templateType: 'civil',
    title: 'Ação de Indenização por Danos Morais',
    description: 'Template para ação indenizatória por danos morais',
    content: {
      tribunal: 'Tribunal de Justiça do Estado de [UF]',
      valorCausa: 'R$ [VALOR]',
      fatos: `O AUTOR foi vítima de conduta ilícita praticada pelo RÉU em [DATA], conforme será demonstrado.

Em [DESCREVER O FATO GERADOR], o RÉU [DESCREVER A CONDUTA DO RÉU], causando ao AUTOR [DESCREVER OS DANOS SOFRIDOS].

A conduta do RÉU violou direitos da personalidade do AUTOR, especialmente [ESPECIFICAR: honra, imagem, privacidade, etc.], causando-lhe sofrimento psicológico, constrangimento e abalo emocional.

Os fatos são comprovados pelos documentos anexos, incluindo [LISTAR PROVAS: boletim de ocorrência, prints de tela, testemunhas, laudos, etc.].`,
      fundamentosJuridicos: `O dever de indenizar decorre do artigo 186 do Código Civil: "Aquele que, por ação ou omissão voluntária, negligência ou imprudência, violar direito e causar dano a outrem, ainda que exclusivamente moral, comete ato ilícito".

O artigo 927 do mesmo diploma estabelece que: "Aquele que, por ato ilícito (arts. 186 e 187), causar dano a outrem, fica obrigado a repará-lo".

A Constituição Federal, em seu artigo 5º, incisos V e X, assegura o direito à indenização por dano moral: "V - é assegurado o direito de resposta, proporcional ao agravo, além da indenização por dano material, moral ou à imagem; X - são invioláveis a intimidade, a vida privada, a honra e a imagem das pessoas, assegurado o direito a indenização pelo dano material ou moral decorrente de sua violação".

O Superior Tribunal de Justiça consolidou entendimento de que "o dano moral prescinde de prova, bastando a demonstração do fato que o ensejou" (STJ, REsp 1.234.567/SP).

A fixação do quantum indenizatório deve observar os princípios da razoabilidade e proporcionalidade, considerando a gravidade da ofensa, a capacidade econômica do ofensor e o caráter pedagógico da sanção.`,
      pedidos: `Diante do exposto, requer-se a Vossa Excelência:

a) A citação do RÉU para, querendo, apresentar contestação, sob pena de revelia e confissão quanto à matéria de fato;

b) A procedência total do pedido, condenando o RÉU ao pagamento de indenização por danos morais no valor de R$ [VALOR], a ser corrigido monetariamente e acrescido de juros de mora desde o evento danoso (Súmula 54 do STJ);

c) A condenação do RÉU ao pagamento de honorários advocatícios de 20% sobre o valor da condenação;

d) A condenação do RÉU ao pagamento das custas processuais e demais despesas do processo;

e) A produção de todos os meios de prova em direito admitidos, especialmente documental, testemunhal e pericial, se necessário.

Dá-se à causa o valor de R$ [VALOR].

Termos em que,
Pede deferimento.`
    }
  },

  // ===== TEMPLATES TRABALHISTAS =====
  {
    id: 'trabalhista-rescisao',
    templateType: 'trabalhista',
    title: 'Reclamação Trabalhista - Verbas Rescisórias',
    description: 'Template para reclamação de verbas rescisórias não pagas',
    content: {
      tribunal: 'Tribunal Regional do Trabalho da [REGIÃO]ª Região',
      valorCausa: 'R$ [VALOR]',
      fatos: `O RECLAMANTE foi admitido pela RECLAMADA em [DATA DE ADMISSÃO], exercendo a função de [CARGO], mediante remuneração mensal de R$ [SALÁRIO].

O contrato de trabalho perdurou até [DATA DE RESCISÃO], quando foi rescindido por [ESPECIFICAR: dispensa sem justa causa / pedido de demissão / justa causa].

Contudo, a RECLAMADA deixou de pagar as seguintes verbas rescisórias devidas:
- Aviso prévio indenizado: R$ [VALOR]
- Férias vencidas + 1/3 constitucional: R$ [VALOR]
- Férias proporcionais + 1/3 constitucional: R$ [VALOR]
- 13º salário proporcional: R$ [VALOR]
- Saldo de salário: R$ [VALOR]
- Multa de 40% do FGTS: R$ [VALOR]
- Liberação das guias para saque do FGTS e seguro-desemprego

Além disso, durante o contrato de trabalho, o RECLAMANTE realizou horas extras habituais que não foram devidamente quitadas, conforme será demonstrado.`,
      fundamentosJuridicos: `O artigo 7º da Constituição Federal assegura aos trabalhadores diversos direitos, incluindo: "VIII - décimo terceiro salário com base na remuneração integral ou no valor da aposentadoria; XVII - gozo de férias anuais remuneradas com, pelo menos, um terço a mais do que o salário normal".

A Consolidação das Leis do Trabalho (CLT), em seu artigo 477, estabelece prazo para pagamento das verbas rescisórias: "§ 6º A entrega ao empregado de documentos que comprovem a comunicação da extinção contratual aos órgãos competentes bem como o pagamento dos valores constantes do instrumento de rescisão ou recibo de quitação deverão ser efetuados até dez dias contados a partir do término do contrato".

O artigo 59 da CLT regulamenta as horas extras: "A duração diária do trabalho poderá ser acrescida de horas extras, em número não excedente de duas, por acordo individual, convenção coletiva ou acordo coletivo de trabalho. § 1º A remuneração da hora extra será, pelo menos, 50% (cinquenta por cento) superior à da hora normal".

A Súmula 91 do TST estabelece que "Nula é a cláusula contratual que fixa determinada importância ou percentagem para atender englobadamente vários direitos legais ou contratuais do trabalhador".`,
      pedidos: `Diante do exposto, requer-se a Vossa Excelência:

a) A citação da RECLAMADA para, querendo, apresentar defesa;

b) A procedência total do pedido, condenando a RECLAMADA ao pagamento das seguintes verbas:
   - Aviso prévio indenizado: R$ [VALOR]
   - Férias vencidas + 1/3 constitucional: R$ [VALOR]
   - Férias proporcionais + 1/3 constitucional: R$ [VALOR]
   - 13º salário proporcional: R$ [VALOR]
   - Saldo de salário: R$ [VALOR]
   - Horas extras + reflexos: R$ [VALOR]
   - Multa de 40% do FGTS: R$ [VALOR]
   - Multa do artigo 477, §8º da CLT: R$ [VALOR]

c) A determinação de liberação das guias para saque do FGTS e habilitação ao seguro-desemprego;

d) A condenação da RECLAMADA ao pagamento de honorários advocatícios de 15% sobre o valor da condenação;

e) A produção de todos os meios de prova em direito admitidos, especialmente documental e testemunhal.

Dá-se à causa o valor de R$ [VALOR].

Termos em que,
Pede deferimento.`
    }
  },

  // ===== TEMPLATES CRIMINAIS =====
  {
    id: 'criminal-queixa-crime',
    templateType: 'criminal',
    title: 'Queixa-Crime - Crimes contra a Honra',
    description: 'Template para queixa-crime por calúnia, difamação ou injúria',
    content: {
      tribunal: 'Juizado Especial Criminal / Vara Criminal',
      fatos: `O QUERELANTE vem, respeitosamente, perante Vossa Excelência, apresentar QUEIXA-CRIME em face do QUERELADO, pelos fatos e fundamentos jurídicos a seguir expostos.

Em [DATA], o QUERELADO praticou conduta criminosa contra o QUERELANTE, consistente em [DESCREVER A CONDUTA: calúnia / difamação / injúria].

Especificamente, o QUERELADO [DESCREVER DETALHADAMENTE O FATO], causando grave ofensa à honra objetiva/subjetiva do QUERELANTE.

A conduta foi praticada [ESPECIFICAR: publicamente, por meio de redes sociais, na presença de terceiros, etc.], o que agravou consideravelmente o dano causado.

Os fatos são comprovados pelos documentos anexos, incluindo [LISTAR PROVAS: prints de tela, testemunhas, gravações, etc.].`,
      fundamentosJuridicos: `O Código Penal tipifica os crimes contra a honra em seus artigos 138, 139 e 140:

Art. 138 - Calúnia: "Caluniar alguém, imputando-lhe falsamente fato definido como crime: Pena - detenção, de seis meses a dois anos, e multa".

Art. 139 - Difamação: "Difamar alguém, imputando-lhe fato ofensivo à sua reputação: Pena - detenção, de três meses a um ano, e multa".

Art. 140 - Injúria: "Injuriar alguém, ofendendo-lhe a dignidade ou o decoro: Pena - detenção, de um a seis meses, ou multa".

A conduta praticada pelo QUERELADO subsume-se perfeitamente ao tipo penal de [ESPECIFICAR O CRIME], estando presentes todos os elementos do tipo: conduta, resultado, nexo causal e dolo.

A jurisprudência é pacífica no sentido de que "a prova da materialidade e autoria dos crimes contra a honra pode ser feita por qualquer meio de prova admitido em direito" (TJSP, Apelação Criminal nº 1234567-89.2020.8.26.0000).`,
      pedidos: `Diante do exposto, requer-se a Vossa Excelência:

a) O recebimento da presente queixa-crime;

b) A citação do QUERELADO para responder à acusação, nos termos do artigo 396 do Código de Processo Penal;

c) A condenação do QUERELADO pela prática do crime de [ESPECIFICAR], nas penas do artigo [NÚMERO] do Código Penal;

d) A fixação de indenização por danos morais em favor do QUERELANTE, no valor de R$ [VALOR], nos termos do artigo 387, IV do CPP;

e) A produção de todos os meios de prova em direito admitidos, especialmente documental e testemunhal.

Termos em que,
Pede deferimento.`
    }
  },

  // ===== TEMPLATES TRIBUTÁRIOS =====
  {
    id: 'tributaria-restituicao',
    templateType: 'tributaria',
    title: 'Ação de Restituição de Indébito Tributário',
    description: 'Template para ação de restituição de tributo pago indevidamente',
    content: {
      tribunal: 'Justiça Federal / Justiça Estadual',
      valorCausa: 'R$ [VALOR]',
      fatos: `O AUTOR é contribuinte do tributo [ESPECIFICAR: ICMS, ISS, IRPJ, etc.] e vem, por meio da presente ação, pleitear a restituição de valores pagos indevidamente.

No período de [DATA INICIAL] a [DATA FINAL], o AUTOR recolheu o tributo [NOME DO TRIBUTO] sobre [BASE DE CÁLCULO], totalizando o montante de R$ [VALOR].

Contudo, conforme será demonstrado, [EXPLICAR O MOTIVO DA INCONSTITUCIONALIDADE/ILEGALIDADE: base de cálculo incorreta, alíquota indevida, fato gerador inexistente, etc.].

O pagamento indevido está comprovado pelos documentos anexos, incluindo [LISTAR: guias de recolhimento, notas fiscais, declarações, etc.].

O AUTOR busca, portanto, a restituição dos valores pagos indevidamente, acrescidos de correção monetária e juros de mora.`,
      fundamentosJuridicos: `O artigo 165, inciso I, do Código Tributário Nacional estabelece que: "O sujeito passivo tem direito, independentemente de prévio protesto, à restituição total ou parcial do tributo, seja qual for a modalidade do seu pagamento: I - cobrança ou pagamento espontâneo de tributo indevido ou maior que o devido em face da legislação tributária aplicável".

O artigo 166 do mesmo diploma legal dispõe que: "A restituição de tributos que comportem, por sua natureza, transferência do respectivo encargo financeiro somente será feita a quem prove haver assumido o referido encargo, ou, no caso de tê-lo transferido a terceiro, estar por este expressamente autorizado a recebê-la".

A Constituição Federal, em seu artigo 150, inciso I, veda a cobrança de tributos "sem lei que o estabeleça", consagrando o princípio da legalidade tributária.

O Superior Tribunal de Justiça consolidou entendimento de que "é devida a restituição de tributo pago indevidamente, acrescido de correção monetária e juros de mora" (STJ, REsp 1.234.567/SP).

[ADICIONAR FUNDAMENTO ESPECÍFICO CONFORME O CASO: inconstitucionalidade reconhecida pelo STF, ilegalidade da exigência, etc.].`,
      pedidos: `Diante do exposto, requer-se a Vossa Excelência:

a) A citação do RÉU para, querendo, apresentar contestação;

b) A procedência total do pedido, determinando a restituição ao AUTOR do valor de R$ [VALOR], pago indevidamente a título de [NOME DO TRIBUTO], acrescido de:
   - Correção monetária pela Taxa SELIC desde o pagamento indevido;
   - Juros de mora de 1% ao mês desde a citação;

c) A condenação do RÉU ao pagamento de honorários advocatícios de 10% sobre o valor da condenação;

d) A condenação do RÉU ao pagamento das custas processuais;

e) A produção de todos os meios de prova em direito admitidos, especialmente documental e pericial contábil.

Dá-se à causa o valor de R$ [VALOR].

Termos em que,
Pede deferimento.`
    }
  },

  // ===== TEMPLATES CONSUMIDOR =====
  {
    id: 'consumidor-vicio-produto',
    templateType: 'consumidor',
    title: 'Ação de Reparação por Vício do Produto',
    description: 'Template para ação consumerista por vício de produto',
    content: {
      tribunal: 'Juizado Especial Cível / Vara Cível',
      valorCausa: 'R$ [VALOR]',
      fatos: `O AUTOR adquiriu do RÉU, em [DATA DA COMPRA], o produto [DESCRIÇÃO DO PRODUTO], pelo valor de R$ [VALOR], conforme nota fiscal anexa.

Contudo, após [PRAZO], o produto apresentou [DESCREVER O VÍCIO: defeito de fabricação, mau funcionamento, etc.], tornando-se impróprio para o uso a que se destina.

O AUTOR procurou o RÉU em [DATA] para solucionar o problema, conforme protocolo de atendimento nº [NÚMERO], mas não obteve solução satisfatória.

O RÉU [DESCREVER A CONDUTA DO FORNECEDOR: recusou-se a trocar o produto, não realizou o reparo no prazo legal, ofereceu solução inadequada, etc.].

O vício do produto é comprovado pelos documentos anexos, incluindo [LISTAR: nota fiscal, protocolo de atendimento, fotos, laudo técnico, etc.].`,
      fundamentosJuridicos: `O Código de Defesa do Consumidor, em seu artigo 18, estabelece que: "Os fornecedores de produtos de consumo duráveis ou não duráveis respondem solidariamente pelos vícios de qualidade ou quantidade que os tornem impróprios ou inadequados ao consumo a que se destinam".

O § 1º do mesmo artigo dispõe que: "Não sendo o vício sanado no prazo máximo de trinta dias, pode o consumidor exigir, alternativamente e à sua escolha: I - a substituição do produto por outro da mesma espécie, em perfeitas condições de uso; II - a restituição imediata da quantia paga, monetariamente atualizada, sem prejuízo de eventuais perdas e danos; III - o abatimento proporcional do preço".

O artigo 6º, inciso VI, do CDC assegura como direito básico do consumidor "a efetiva prevenção e reparação de danos patrimoniais e morais, individuais, coletivos e difusos".

A jurisprudência é pacífica no sentido de que "o descumprimento do dever de substituir, reparar ou restituir o valor do produto viciado gera direito à indenização por danos morais" (TJSP, Apelação Cível nº 1234567-89.2020.8.26.0000).`,
      pedidos: `Diante do exposto, requer-se a Vossa Excelência:

a) A citação do RÉU para, querendo, apresentar contestação;

b) A procedência total do pedido, condenando o RÉU a:
   - Restituir ao AUTOR o valor de R$ [VALOR], pago pelo produto, corrigido monetariamente desde a compra;
   - Pagar indenização por danos morais no valor de R$ [VALOR], pelos transtornos causados;
   - Pagar honorários advocatícios de 20% sobre o valor da condenação;

c) A condenação do RÉU ao pagamento das custas processuais;

d) A produção de todos os meios de prova em direito admitidos, especialmente documental e testemunhal.

Dá-se à causa o valor de R$ [VALOR].

Termos em que,
Pede deferimento.`
    }
  },
  {
    id: 'consumidor-cobranca-indevida',
    templateType: 'consumidor',
    title: 'Ação de Repetição de Indébito - Cobrança Indevida',
    description: 'Template para ação de devolução em dobro de cobrança indevida',
    content: {
      tribunal: 'Juizado Especial Cível / Vara Cível',
      valorCausa: 'R$ [VALOR]',
      fatos: `O AUTOR é cliente do RÉU, tendo contratado [DESCREVER O SERVIÇO/PRODUTO CONTRATADO].

Contudo, o RÉU vem realizando cobranças indevidas em desfavor do AUTOR, conforme demonstram as faturas anexas.

Especificamente, o AUTOR foi cobrado indevidamente pelos seguintes valores:
- [DATA]: R$ [VALOR] - [DESCRIÇÃO DA COBRANÇA INDEVIDA]
- [DATA]: R$ [VALOR] - [DESCRIÇÃO DA COBRANÇA INDEVIDA]
Total de cobranças indevidas: R$ [VALOR TOTAL]

O AUTOR procurou o RÉU em diversas ocasiões para solucionar o problema, conforme protocolos de atendimento nºs [NÚMEROS], mas não obteve êxito.

As cobranças indevidas são comprovadas pelos documentos anexos, incluindo [LISTAR: faturas, comprovantes de pagamento, protocolos de atendimento, etc.].`,
      fundamentosJuridicos: `O Código de Defesa do Consumidor, em seu artigo 42, parágrafo único, estabelece que: "O consumidor cobrado em quantia indevida tem direito à repetição do indébito, por valor igual ao dobro do que pagou em excesso, acrescido de correção monetária e juros legais, salvo hipótese de engano justificável".

O artigo 6º, inciso IV, do CDC assegura como direito básico do consumidor "a proteção contra a publicidade enganosa e abusiva, métodos comerciais coercitivos ou desleais, bem como contra práticas e cláusulas abusivas ou impostas no fornecimento de produtos e serviços".

O Superior Tribunal de Justiça consolidou entendimento de que "a repetição em dobro do indébito, prevista no parágrafo único do art. 42 do CDC, prescinde da demonstração de má-fé do fornecedor, bastando a cobrança indevida" (STJ, REsp 1.234.567/SP).

A jurisprudência também reconhece que "a cobrança indevida reiterada, mesmo após reclamação do consumidor, gera direito à indenização por danos morais" (TJSP, Apelação Cível nº 1234567-89.2020.8.26.0000).`,
      pedidos: `Diante do exposto, requer-se a Vossa Excelência:

a) A citação do RÉU para, querendo, apresentar contestação;

b) A procedência total do pedido, condenando o RÉU a:
   - Restituir ao AUTOR, em dobro, o valor de R$ [VALOR], referente às cobranças indevidas, nos termos do art. 42, parágrafo único do CDC, corrigido monetariamente e acrescido de juros de mora desde o pagamento indevido;
   - Pagar indenização por danos morais no valor de R$ [VALOR], pelos transtornos causados;
   - Pagar honorários advocatícios de 20% sobre o valor da condenação;

c) A condenação do RÉU ao pagamento das custas processuais;

d) A produção de todos os meios de prova em direito admitidos, especialmente documental.

Dá-se à causa o valor de R$ [VALOR].

Termos em que,
Pede deferimento.`
    }
  }
];

/**
 * Busca template por ID
 */
export function getTemplateById(id: string): PetitionTemplate | undefined {
  return petitionTemplates.find(template => template.id === id);
}

/**
 * Busca templates por tipo
 */
export function getTemplatesByType(type: string): PetitionTemplate[] {
  return petitionTemplates.filter(template => template.templateType === type);
}

/**
 * Lista todos os templates disponíveis
 */
export function getAllTemplates(): PetitionTemplate[] {
  return petitionTemplates;
}
