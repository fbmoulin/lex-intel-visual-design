/**
 * Templates pré-preenchidos para petições jurídicas
 * Desenvolvido por Lex Intelligentia
 *
 * Baseado nos modelos mais utilizados no sistema jurídico brasileiro
 * Fontes: Jusbrasil, TJDFT, DireitoNet
 */

import { PetitionTemplateType } from "@shared/const";

export interface PetitionTemplate {
  id: string;
  templateType: PetitionTemplateType;
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

O inadimplemento contratual está configurado, sendo devida a reparação integral do dano causado ao AUTOR, incluindo correção monetária e juros de mora desde o vencimento da obrigação.`,
      pedidos: `Diante do exposto, requer-se a Vossa Excelência:

a) A citação do RÉU para, querendo, apresentar contestação, sob pena de revelia e confissão quanto à matéria de fato;

b) A procedência total do pedido, condenando o RÉU ao pagamento do valor principal de R$ [VALOR], acrescido de:
   - Correção monetária pelo INPC desde o vencimento da obrigação;
   - Juros de mora de 1% ao mês desde a citação;
   - Honorários advocatícios de 20% sobre o valor da condenação;

c) A condenação do RÉU ao pagamento das custas processuais e demais despesas do processo;

d) A produção de todos os meios de prova em direito admitidos.

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

Os fatos são comprovados pelos documentos anexos.`,
      fundamentosJuridicos: `O dever de indenizar decorre do artigo 186 do Código Civil: "Aquele que, por ação ou omissão voluntária, negligência ou imprudência, violar direito e causar dano a outrem, ainda que exclusivamente moral, comete ato ilícito".

O artigo 927 do mesmo diploma estabelece que: "Aquele que, por ato ilícito (arts. 186 e 187), causar dano a outrem, fica obrigado a repará-lo".

A Constituição Federal, em seu artigo 5º, incisos V e X, assegura o direito à indenização por dano moral.

O Superior Tribunal de Justiça consolidou entendimento de que "o dano moral prescinde de prova, bastando a demonstração do fato que o ensejou".`,
      pedidos: `Diante do exposto, requer-se a Vossa Excelência:

a) A citação do RÉU para, querendo, apresentar contestação;

b) A procedência total do pedido, condenando o RÉU ao pagamento de indenização por danos morais no valor de R$ [VALOR], corrigido monetariamente e acrescido de juros de mora desde o evento danoso;

c) A condenação do RÉU ao pagamento de honorários advocatícios de 20% sobre o valor da condenação;

d) A condenação do RÉU ao pagamento das custas processuais;

e) A produção de todos os meios de prova em direito admitidos.

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
- Aviso prévio indenizado
- Férias vencidas + 1/3 constitucional
- Férias proporcionais + 1/3 constitucional
- 13º salário proporcional
- Saldo de salário
- Multa de 40% do FGTS
- Liberação das guias para saque do FGTS e seguro-desemprego`,
      fundamentosJuridicos: `O artigo 7º da Constituição Federal assegura aos trabalhadores diversos direitos, incluindo décimo terceiro salário e férias remuneradas.

A CLT, em seu artigo 477, estabelece prazo de dez dias para pagamento das verbas rescisórias.

O artigo 59 da CLT regulamenta as horas extras, que devem ser remuneradas com adicional de pelo menos 50%.

A Súmula 91 do TST estabelece que é nula a cláusula contratual que fixa determinada importância para atender englobadamente vários direitos.`,
      pedidos: `Diante do exposto, requer-se a Vossa Excelência:

a) A citação da RECLAMADA para, querendo, apresentar defesa;

b) A procedência total do pedido, condenando a RECLAMADA ao pagamento das verbas rescisórias devidas;

c) A determinação de liberação das guias para saque do FGTS e habilitação ao seguro-desemprego;

d) A condenação da RECLAMADA ao pagamento de honorários advocatícios;

e) A produção de todos os meios de prova em direito admitidos.

Dá-se à causa o valor de R$ [VALOR].

Termos em que,
Pede deferimento.`
    }
  },
  {
    id: 'trabalhista-horas-extras',
    templateType: 'trabalhista',
    title: 'Reclamação Trabalhista - Horas Extras',
    description: 'Template para reclamação de horas extras não pagas',
    content: {
      tribunal: 'Tribunal Regional do Trabalho da [REGIÃO]ª Região',
      valorCausa: 'R$ [VALOR]',
      fatos: `O RECLAMANTE foi admitido pela RECLAMADA em [DATA DE ADMISSÃO], exercendo a função de [CARGO], com jornada contratual de [HORÁRIO].

Durante todo o pacto laboral, o RECLAMANTE habitualmente laborava além da jornada contratual, chegando a trabalhar [HORAS] horas diárias, sem receber a devida contraprestação pelas horas extras realizadas.

O RECLAMANTE não tinha intervalo intrajornada respeitado, trabalhando durante o horário de almoço.

Os cartões de ponto não refletem a real jornada praticada, sendo "britânicos" ou preenchidos de forma incorreta.`,
      fundamentosJuridicos: `A Constituição Federal, em seu artigo 7º, inciso XIII, estabelece que a duração do trabalho normal não seja superior a oito horas diárias e quarenta e quatro semanais.

O artigo 59 da CLT prevê que as horas extras devem ser remuneradas com adicional de, no mínimo, 50% sobre a hora normal.

A Súmula 338 do TST estabelece a presunção de veracidade da jornada de trabalho alegada na inicial quando o empregador não apresenta os controles de frequência.

O artigo 71 da CLT determina intervalo mínimo de 1 hora para jornadas superiores a 6 horas.`,
      pedidos: `Diante do exposto, requer-se:

a) A citação da RECLAMADA para apresentar defesa;

b) A condenação ao pagamento de:
   - Horas extras + adicional de 50% e reflexos
   - Intervalo intrajornada suprimido
   - Diferenças de FGTS + 40%

c) A exibição dos cartões de ponto sob pena de confissão;

d) A inversão do ônus da prova quanto à jornada;

e) Honorários advocatícios de 15%.

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
      fatos: `O QUERELANTE vem apresentar QUEIXA-CRIME em face do QUERELADO, pelos fatos a seguir expostos.

Em [DATA], o QUERELADO praticou conduta criminosa contra o QUERELANTE, consistente em [DESCREVER A CONDUTA: calúnia / difamação / injúria].

Especificamente, o QUERELADO [DESCREVER DETALHADAMENTE O FATO], causando grave ofensa à honra do QUERELANTE.

A conduta foi praticada [ESPECIFICAR: publicamente, por meio de redes sociais, na presença de terceiros, etc.].

Os fatos são comprovados pelos documentos anexos.`,
      fundamentosJuridicos: `O Código Penal tipifica os crimes contra a honra:

Art. 138 - Calúnia: "Caluniar alguém, imputando-lhe falsamente fato definido como crime: Pena - detenção, de seis meses a dois anos, e multa".

Art. 139 - Difamação: "Difamar alguém, imputando-lhe fato ofensivo à sua reputação: Pena - detenção, de três meses a um ano, e multa".

Art. 140 - Injúria: "Injuriar alguém, ofendendo-lhe a dignidade ou o decoro: Pena - detenção, de um a seis meses, ou multa".

A conduta praticada pelo QUERELADO subsume-se ao tipo penal, estando presentes todos os elementos do tipo.`,
      pedidos: `Diante do exposto, requer-se:

a) O recebimento da presente queixa-crime;

b) A citação do QUERELADO para responder à acusação;

c) A condenação do QUERELADO pela prática do crime;

d) A fixação de indenização por danos morais, nos termos do artigo 387, IV do CPP;

e) A produção de todos os meios de prova em direito admitidos.

Termos em que,
Pede deferimento.`
    }
  },
  {
    id: 'criminal-defesa-preliminar',
    templateType: 'criminal',
    title: 'Defesa Preliminar (Resposta à Acusação)',
    description: 'Template para defesa preliminar em ação penal (art. 396-A CPP)',
    content: {
      numeroProcesso: '[NÚMERO DO PROCESSO]',
      tribunal: 'Vara Criminal da Comarca de [CIDADE/UF]',
      fatos: `O ACUSADO, já qualificado nos autos, por seu advogado que esta subscreve, vem, tempestivamente, apresentar RESPOSTA À ACUSAÇÃO (Defesa Preliminar), nos termos do artigo 396-A do Código de Processo Penal, pelos fatos e fundamentos a seguir expostos.

DOS FATOS:
O ACUSADO foi denunciado pelo Ministério Público como incurso no artigo [TIPO PENAL] do Código Penal, em razão de fatos supostamente ocorridos em [DATA], em [LOCAL].

Segundo a denúncia, o ACUSADO teria [DESCREVER BREVEMENTE A IMPUTAÇÃO].

Contudo, a acusação não merece prosperar pelas razões adiante expostas.

DA VERSÃO DEFENSIVA:
[APRESENTAR A VERSÃO DOS FATOS DO ACUSADO]

O ACUSADO [ESTAVA EM OUTRO LOCAL / AGIU EM LEGÍTIMA DEFESA / NÃO PRATICOU A CONDUTA DESCRITA / etc.], conforme será demonstrado ao longo da instrução processual.`,
      fundamentosJuridicos: `1. DA AUSÊNCIA DE JUSTA CAUSA PARA A AÇÃO PENAL

A denúncia é inepta, pois não descreve de forma clara e precisa a conduta supostamente praticada pelo ACUSADO, violando o artigo 41 do CPP.

Não há elementos mínimos de autoria e materialidade que justifiquem o prosseguimento da ação penal, devendo ser aplicado o artigo 395, III, do CPP.

2. DA ATIPICIDADE DA CONDUTA

A conduta atribuída ao ACUSADO não se subsume ao tipo penal descrito na denúncia, pois [FUNDAMENTAR A ATIPICIDADE].

Não está presente o elemento subjetivo do tipo (dolo), sendo a conduta, no máximo, um indiferente penal.

3. DAS EXCLUDENTES DE ILICITUDE/CULPABILIDADE

[SE APLICÁVEL: O ACUSADO agiu em legítima defesa própria/de terceiros, nos termos do artigo 25 do Código Penal, pois...]

[SE APLICÁVEL: O ACUSADO encontrava-se em estado de necessidade, nos termos do artigo 24 do Código Penal...]

[SE APLICÁVEL: O ACUSADO não tinha consciência da ilicitude do fato...]

4. DA FRAGILIDADE PROBATÓRIA

As provas colhidas na fase investigativa são insuficientes para sustentar a acusação.

A palavra da vítima/testemunhas apresenta contradições que comprometem sua credibilidade.

Não há provas técnicas que corroborem a versão acusatória.

5. DA NECESSIDADE DE ABSOLVIÇÃO SUMÁRIA

Presentes as hipóteses do artigo 397 do CPP, o ACUSADO faz jus à absolvição sumária, sem necessidade de instrução processual.`,
      pedidos: `Ante o exposto, requer a Vossa Excelência:

a) PRELIMINARMENTE:
   - A rejeição da denúncia por inépcia, nos termos do artigo 395, I, do CPP;
   - O reconhecimento da ausência de justa causa para a ação penal (art. 395, III, CPP);

b) NO MÉRITO:
   - A ABSOLVIÇÃO SUMÁRIA do ACUSADO, nos termos do artigo 397 do CPP, em razão de:
     ( ) I - existência manifesta de causa excludente da ilicitude do fato;
     ( ) II - existência manifesta de causa excludente da culpabilidade do agente;
     ( ) III - que o fato narrado evidentemente não constitui crime;
     ( ) IV - extinta a punibilidade do agente;

c) Caso não seja este o entendimento de Vossa Excelência:
   - A designação de audiência de instrução e julgamento;
   - A oitiva das testemunhas arroladas ao final;
   - A expedição de carta precatória para oitiva de testemunha residente em outra comarca;

d) A intimação pessoal do ACUSADO de todos os atos processuais;

e) A produção de todos os meios de prova em direito admitidos.

ROL DE TESTEMUNHAS (art. 396-A, §2º, CPP):
1. [NOME], [PROFISSÃO], residente [ENDEREÇO];
2. [NOME], [PROFISSÃO], residente [ENDEREÇO];
3. [NOME], [PROFISSÃO], residente [ENDEREÇO].

Termos em que,
Pede deferimento.`
    }
  },
  {
    id: 'criminal-revogacao-preventiva',
    templateType: 'criminal',
    title: 'Pedido de Revogação de Prisão Preventiva / Liberdade Provisória',
    description: 'Template para pedido de revogação de prisão preventiva ou concessão de liberdade provisória',
    content: {
      numeroProcesso: '[NÚMERO DO PROCESSO / INQUÉRITO]',
      tribunal: 'Vara Criminal da Comarca de [CIDADE/UF]',
      fatos: `O REQUERENTE, [NOME COMPLETO], [NACIONALIDADE], [ESTADO CIVIL], [PROFISSÃO], portador do RG nº [NÚMERO] e CPF nº [NÚMERO], atualmente recolhido no [ESTABELECIMENTO PRISIONAL], por seu advogado que esta subscreve, vem, respeitosamente, requerer a REVOGAÇÃO DA PRISÃO PREVENTIVA / CONCESSÃO DE LIBERDADE PROVISÓRIA, pelos fatos e fundamentos a seguir expostos.

DOS FATOS:
O REQUERENTE encontra-se preso preventivamente desde [DATA], em razão de [DESCREVER A IMPUTAÇÃO], tendo a prisão sido decretada sob o fundamento de [MOTIVO ALEGADO: garantia da ordem pública, conveniência da instrução criminal, aplicação da lei penal].

SITUAÇÃO PROCESSUAL ATUAL:
- Data da prisão: [DATA]
- Tempo de prisão: [X] dias/meses
- Fase processual: [INQUÉRITO / PROCESSO - especificar]
- Audiências realizadas: [DESCREVER]
- Diligências pendentes: [DESCREVER]

DAS CONDIÇÕES PESSOAIS DO REQUERENTE:
O REQUERENTE é [PRIMÁRIO/REINCIDENTE], possui [RESIDÊNCIA FIXA/TRABALHO LÍCITO/FAMÍLIA CONSTITUÍDA], conforme documentos anexos.

[DESCREVER OUTRAS CONDIÇÕES FAVORÁVEIS: bons antecedentes, colaboração com a justiça, etc.]`,
      fundamentosJuridicos: `1. DA AUSÊNCIA DOS REQUISITOS DA PRISÃO PREVENTIVA (Art. 312, CPP)

A prisão preventiva somente pode ser decretada quando presentes os requisitos do artigo 312 do CPP: garantia da ordem pública, garantia da ordem econômica, conveniência da instrução criminal ou para assegurar a aplicação da lei penal.

No presente caso, NÃO estão presentes tais requisitos, pois:

a) GARANTIA DA ORDEM PÚBLICA: O REQUERENTE não representa risco à ordem pública, pois [é primário / não possui antecedentes / o crime não envolveu violência / etc.].

b) CONVENIÊNCIA DA INSTRUÇÃO CRIMINAL: A instrução já foi concluída / não há risco de interferência nas provas / o REQUERENTE não ameaçou testemunhas.

c) APLICAÇÃO DA LEI PENAL: O REQUERENTE possui residência fixa, trabalho lícito e vínculos familiares, não havendo risco de fuga.

2. DO EXCESSO DE PRAZO (Art. 316, parágrafo único, CPP)

O REQUERENTE encontra-se preso há mais de [X] dias, sem que tenha havido conclusão da instrução processual, configurando constrangimento ilegal por excesso de prazo.

A Lei 13.964/2019 (Pacote Anticrime) incluiu o parágrafo único do art. 316 do CPP, determinando a revisão da necessidade da prisão a cada 90 dias.

3. DA POSSIBILIDADE DE APLICAÇÃO DE MEDIDAS CAUTELARES DIVERSAS (Art. 319, CPP)

As medidas cautelares diversas da prisão, previstas no artigo 319 do CPP, são suficientes para acautelar o processo:

I - comparecimento periódico em juízo;
II - proibição de acesso ou frequência a determinados lugares;
III - proibição de manter contato com pessoa determinada;
IV - proibição de ausentar-se da comarca;
V - recolhimento domiciliar no período noturno;
VI - suspensão do exercício de função pública ou atividade;
VII - internação provisória;
VIII - fiança;
IX - monitoração eletrônica.

4. DO PRINCÍPIO DA PRESUNÇÃO DE INOCÊNCIA (Art. 5º, LVII, CF)

A Constituição Federal assegura que ninguém será considerado culpado até o trânsito em julgado de sentença penal condenatória.

A prisão processual é medida excepcional e deve ser fundamentada em elementos concretos, não podendo servir como antecipação de pena.

5. DA JURISPRUDÊNCIA APLICÁVEL

O STF, no julgamento das ADCs 43, 44 e 54, reafirmou a excepcionalidade da prisão preventiva e a necessidade de sua fundamentação concreta.

A Súmula 52 do STJ estabelece que encerrada a instrução criminal, fica superada a alegação de constrangimento por excesso de prazo.`,
      pedidos: `Ante o exposto, requer a Vossa Excelência:

a) A REVOGAÇÃO DA PRISÃO PREVENTIVA do REQUERENTE, com a expedição imediata de ALVARÁ DE SOLTURA, determinando-se sua liberdade independentemente do pagamento de fiança;

b) SUBSIDIARIAMENTE, caso não seja este o entendimento:
   - A SUBSTITUIÇÃO da prisão preventiva por MEDIDAS CAUTELARES DIVERSAS, nos termos do artigo 319 do CPP, tais como:
     ( ) Comparecimento periódico em juízo;
     ( ) Proibição de ausentar-se da comarca;
     ( ) Monitoração eletrônica;
     ( ) Recolhimento domiciliar noturno;
     ( ) Arbitramento de fiança;

c) A CONCESSÃO DE LIBERDADE PROVISÓRIA, mediante:
   ( ) Fiança no valor que Vossa Excelência entender adequado à situação econômica do REQUERENTE;
   ( ) Termo de comparecimento a todos os atos processuais;

d) O RECONHECIMENTO DO EXCESSO DE PRAZO, determinando-se o imediato relaxamento da prisão;

e) Caso Vossa Excelência entenda necessário, o REQUERENTE se compromete a cumprir quaisquer condições impostas.

DOCUMENTOS ANEXOS:
- Comprovante de residência;
- Carteira de trabalho / comprovante de vínculo empregatício;
- Certidão de antecedentes criminais;
- Declarações de familiares;
- [OUTROS DOCUMENTOS].

Termos em que,
Pede deferimento.`
    }
  },
  {
    id: 'criminal-habeas-corpus',
    templateType: 'criminal',
    title: 'Habeas Corpus',
    description: 'Template para petição de habeas corpus por constrangimento ilegal',
    content: {
      tribunal: 'Tribunal de Justiça do Estado de [UF] / Tribunal Regional Federal da [X]ª Região',
      fatos: `IMPETRANTE: [NOME DO ADVOGADO], OAB/[UF] nº [NÚMERO]
PACIENTE: [NOME COMPLETO DO PACIENTE]
AUTORIDADE COATORA: Juiz(a) de Direito da [X]ª Vara Criminal da Comarca de [CIDADE/UF]
PROCESSO ORIGINÁRIO: nº [NÚMERO]

O IMPETRANTE, advogado regularmente inscrito na OAB, vem, com fundamento no artigo 5º, inciso LXVIII, da Constituição Federal, e artigos 647 e seguintes do Código de Processo Penal, impetrar a presente ordem de HABEAS CORPUS, com pedido de LIMINAR, em favor do PACIENTE acima qualificado, contra ato da autoridade coatora indicada, pelos fatos e fundamentos a seguir expostos.

I - DO PACIENTE E DA AUTORIDADE COATORA:

O PACIENTE, [QUALIFICAÇÃO COMPLETA], encontra-se [PRESO / AMEAÇADO DE PRISÃO] em razão de [DESCREVER O ATO COATOR], conforme decisão proferida nos autos do processo nº [NÚMERO].

II - DOS FATOS:

[DESCREVER CRONOLOGICAMENTE OS FATOS QUE LEVARAM AO CONSTRANGIMENTO ILEGAL]

Em [DATA], o PACIENTE foi [PRESO EM FLAGRANTE / TEVE A PRISÃO PREVENTIVA DECRETADA / FOI INTIMADO PARA...].

A autoridade coatora fundamentou sua decisão em [DESCREVER OS FUNDAMENTOS DA DECISÃO ATACADA].

Contudo, conforme será demonstrado, tal decisão configura manifesto CONSTRANGIMENTO ILEGAL.

III - DO CONSTRANGIMENTO ILEGAL:

O PACIENTE sofre constrangimento ilegal em sua liberdade de locomoção em razão de:

[  ] Prisão sem justa causa (art. 648, I, CPP)
[  ] Prisão por mais tempo do que determina a lei (art. 648, II, CPP)
[  ] Falta de competência da autoridade (art. 648, III, CPP)
[  ] Cessação do motivo da prisão (art. 648, IV, CPP)
[  ] Não admissão de fiança quando cabível (art. 648, V, CPP)
[  ] Nulidade manifesta do processo (art. 648, VI, CPP)
[  ] Extinção da punibilidade (art. 648, VII, CPP)`,
      fundamentosJuridicos: `1. DO CABIMENTO DO HABEAS CORPUS

O artigo 5º, inciso LXVIII, da Constituição Federal estabelece que "conceder-se-á habeas corpus sempre que alguém sofrer ou se achar ameaçado de sofrer violência ou coação em sua liberdade de locomoção, por ilegalidade ou abuso de poder".

O artigo 647 do CPP dispõe que "dar-se-á habeas corpus sempre que alguém sofrer ou se achar na iminência de sofrer violência ou coação ilegal na sua liberdade de ir e vir".

2. DA ILEGALIDADE DO ATO COATOR

[FUNDAMENTAR ESPECIFICAMENTE O CONSTRANGIMENTO ILEGAL - ESCOLHER O MAIS ADEQUADO:]

A) DA AUSÊNCIA DE FUNDAMENTAÇÃO IDÔNEA (Art. 93, IX, CF):
A decisão que decretou/manteve a prisão do PACIENTE carece de fundamentação idônea, limitando-se a reproduzir os termos da lei sem indicar elementos concretos que justifiquem a custódia cautelar.

O STF, no julgamento do HC 95.009, firmou entendimento de que "a prisão preventiva exige fundamentação concreta, sendo insuficiente a mera repetição dos termos legais".

B) DA AUSÊNCIA DOS REQUISITOS DO ART. 312 DO CPP:
Não estão presentes os requisitos autorizadores da prisão preventiva. [FUNDAMENTAR ESPECIFICAMENTE]

C) DO EXCESSO DE PRAZO:
O PACIENTE está preso há [X] dias/meses, sem que haja previsão de conclusão da instrução processual, configurando excesso de prazo.

D) DA INOBSERVÂNCIA DO ART. 310 DO CPP:
Não foi realizada audiência de custódia no prazo de 24 horas, conforme exige a Resolução 213/2015 do CNJ.

E) DO CRIME AFIANÇÁVEL / AUSÊNCIA DE VIOLÊNCIA:
O crime imputado ao PACIENTE [NÃO ENVOLVE VIOLÊNCIA / É AFIANÇÁVEL / POSSUI PENA MÁXIMA INFERIOR A 4 ANOS], não justificando a custódia cautelar.

3. DO FUMUS BONI IURIS E PERICULUM IN MORA (LIMINAR)

Estão presentes os requisitos para concessão da liminar:

FUMUS BONI IURIS: A ilegalidade do ato coator é manifesta, conforme demonstrado acima.

PERICULUM IN MORA: O PACIENTE encontra-se encarcerado ilegalmente, sofrendo restrição em seu direito fundamental à liberdade, sendo urgente a concessão da ordem.

4. DA JURISPRUDÊNCIA APLICÁVEL

[CITAR PRECEDENTES RELEVANTES DO STF/STJ]`,
      pedidos: `Ante o exposto, requer o IMPETRANTE a Vossa Excelência:

a) LIMINARMENTE:
   - A CONCESSÃO DA ORDEM para determinar a imediata expedição de ALVARÁ DE SOLTURA em favor do PACIENTE, ou;
   - A SUSPENSÃO DOS EFEITOS da decisão atacada até o julgamento definitivo deste writ;

b) NO MÉRITO:
   - A CONCESSÃO DEFINITIVA DA ORDEM de habeas corpus para:
     ( ) RELAXAR a prisão ilegal do PACIENTE;
     ( ) REVOGAR a prisão preventiva decretada;
     ( ) SUBSTITUIR a prisão por medidas cautelares diversas (art. 319, CPP);
     ( ) CONCEDER liberdade provisória, com ou sem fiança;
     ( ) RECONHECER a nulidade [ESPECIFICAR];
     ( ) DECLARAR extinta a punibilidade;

c) A requisição de informações à autoridade coatora, no prazo legal;

d) A intimação do Ministério Público para manifestação;

e) Caso Vossas Excelências entendam necessário, a realização de sustentação oral.

DOCUMENTOS ANEXOS:
- Cópia da decisão atacada;
- Cópia da denúncia/inquérito;
- Procuração com poderes especiais;
- Documentos pessoais do PACIENTE;
- [OUTROS DOCUMENTOS RELEVANTES].

Termos em que,
Pede deferimento.`
    }
  },

  // ===== TEMPLATES TRIBUTÁRIOS =====
  {
    id: 'tributario-restituicao',
    templateType: 'tributario',
    title: 'Ação de Restituição de Indébito Tributário',
    description: 'Template para ação de restituição de tributo pago indevidamente',
    content: {
      tribunal: 'Justiça Federal / Justiça Estadual',
      valorCausa: 'R$ [VALOR]',
      fatos: `O AUTOR é contribuinte do tributo [ESPECIFICAR: ICMS, ISS, IRPJ, etc.] e vem pleitear a restituição de valores pagos indevidamente.

No período de [DATA INICIAL] a [DATA FINAL], o AUTOR recolheu o tributo sobre [BASE DE CÁLCULO], totalizando R$ [VALOR].

Contudo, [EXPLICAR O MOTIVO DA INCONSTITUCIONALIDADE/ILEGALIDADE].

O pagamento indevido está comprovado pelos documentos anexos.`,
      fundamentosJuridicos: `O artigo 165, inciso I, do Código Tributário Nacional estabelece que o sujeito passivo tem direito à restituição de tributo indevido.

A Constituição Federal, em seu artigo 150, inciso I, veda a cobrança de tributos sem lei que o estabeleça.

O STJ consolidou que é devida a restituição de tributo pago indevidamente, acrescido de correção monetária e juros de mora.`,
      pedidos: `Diante do exposto, requer-se:

a) A citação do RÉU para contestar;

b) A procedência do pedido, determinando a restituição de R$ [VALOR], acrescido de correção monetária pela Taxa SELIC;

c) Honorários advocatícios de 10%;

d) Custas processuais;

e) Produção de provas.

Dá-se à causa o valor de R$ [VALOR].

Termos em que,
Pede deferimento.`
    }
  },
  {
    id: 'tributario-anulatoria',
    templateType: 'tributario',
    title: 'Ação Anulatória de Débito Fiscal',
    description: 'Template para ação anulatória de lançamento tributário',
    content: {
      tribunal: 'Justiça Federal / Justiça Estadual',
      valorCausa: 'R$ [VALOR]',
      fatos: `O AUTOR foi autuado pelo RÉU através do Auto de Infração nº [NÚMERO], lavrado em [DATA], no valor de R$ [VALOR], referente ao tributo [ESPECIFICAR].

O lançamento tributário é nulo/inválido pelas seguintes razões: [DESCREVER OS VÍCIOS].

O AUTOR exerceu regularmente suas atividades, cumprindo com todas as obrigações acessórias exigidas pela legislação tributária.`,
      fundamentosJuridicos: `O artigo 142 do CTN estabelece os requisitos para o lançamento tributário, que deve ser motivado e fundamentado.

O artigo 145 do CTN prevê as hipóteses de alteração do lançamento.

A Constituição Federal assegura o contraditório e a ampla defesa, inclusive no processo administrativo tributário.

O lançamento tributário padece de nulidade por [ESPECIFICAR: vício formal, decadência, prescrição, ausência de motivação, etc.].`,
      pedidos: `Diante do exposto, requer-se:

a) A citação do RÉU;

b) A procedência do pedido para anular o Auto de Infração nº [NÚMERO];

c) A suspensão da exigibilidade do crédito tributário (art. 151, V do CTN);

d) A condenação do RÉU em honorários e custas;

e) Produção de provas.

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
      fatos: `O AUTOR adquiriu do RÉU, em [DATA DA COMPRA], o produto [DESCRIÇÃO], pelo valor de R$ [VALOR].

Após [PRAZO], o produto apresentou [DESCREVER O VÍCIO], tornando-se impróprio para o uso.

O AUTOR procurou o RÉU em [DATA] para solucionar o problema, mas não obteve solução satisfatória.

O RÉU [DESCREVER A CONDUTA DO FORNECEDOR].`,
      fundamentosJuridicos: `O CDC, em seu artigo 18, estabelece que os fornecedores respondem solidariamente pelos vícios de qualidade.

O § 1º dispõe que, não sendo o vício sanado em trinta dias, pode o consumidor exigir: substituição do produto, restituição do valor, ou abatimento proporcional do preço.

O artigo 6º, VI, do CDC assegura a efetiva reparação de danos patrimoniais e morais.`,
      pedidos: `Diante do exposto, requer-se:

a) A citação do RÉU;

b) A condenação do RÉU a:
   - Restituir o valor de R$ [VALOR];
   - Pagar indenização por danos morais;
   - Honorários advocatícios;

c) Custas processuais;

d) Produção de provas.

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
      fatos: `O AUTOR é cliente do RÉU, tendo contratado [DESCREVER O SERVIÇO].

O RÉU vem realizando cobranças indevidas, conforme faturas anexas:
- [DATA]: R$ [VALOR] - [DESCRIÇÃO]
Total: R$ [VALOR TOTAL]

O AUTOR procurou o RÉU em diversas ocasiões, mas não obteve êxito.`,
      fundamentosJuridicos: `O CDC, artigo 42, parágrafo único, estabelece que o consumidor cobrado indevidamente tem direito à repetição em dobro do indébito.

O STJ consolidou que a repetição em dobro prescinde da demonstração de má-fé, bastando a cobrança indevida.

A cobrança indevida reiterada gera direito à indenização por danos morais.`,
      pedidos: `Diante do exposto, requer-se:

a) A citação do RÉU;

b) A condenação do RÉU a:
   - Restituir em dobro o valor de R$ [VALOR];
   - Pagar indenização por danos morais;
   - Honorários advocatícios;

c) Custas processuais;

d) Produção de provas.

Dá-se à causa o valor de R$ [VALOR].

Termos em que,
Pede deferimento.`
    }
  },
  {
    id: 'consumidor-negativacao-indevida',
    templateType: 'consumidor',
    title: 'Ação de Indenização - Negativação Indevida',
    description: 'Template para ação por inclusão indevida em cadastro de inadimplentes',
    content: {
      tribunal: 'Juizado Especial Cível / Vara Cível',
      valorCausa: 'R$ [VALOR]',
      fatos: `O AUTOR teve seu nome indevidamente inscrito nos cadastros de proteção ao crédito (SPC/SERASA) pelo RÉU, em [DATA], no valor de R$ [VALOR].

O AUTOR jamais manteve relação jurídica com o RÉU ou, alternativamente, a dívida já estava quitada/prescrita/inexistente.

A negativação indevida causou ao AUTOR diversos transtornos, incluindo recusa de crédito e constrangimento.`,
      fundamentosJuridicos: `O CDC, artigo 43, estabelece garantias ao consumidor quanto aos cadastros de inadimplentes.

A Súmula 385 do STJ dispõe que a indenização por dano moral não é devida quando há prévia inscrição legítima. Contudo, no caso, a inscrição é totalmente indevida.

A Súmula 479 do STJ estabelece que as instituições financeiras respondem objetivamente pelos danos causados por fraudes.

O dano moral é presumido (in re ipsa) nos casos de inscrição indevida em cadastros de inadimplentes.`,
      pedidos: `Diante do exposto, requer-se:

a) Tutela de urgência para exclusão imediata do nome do AUTOR dos cadastros de inadimplentes;

b) A citação do RÉU;

c) A procedência do pedido, condenando o RÉU a:
   - Declarar inexistente a dívida;
   - Pagar indenização por danos morais no valor de R$ [VALOR];
   - Honorários advocatícios;

d) Custas processuais.

Dá-se à causa o valor de R$ [VALOR].

Termos em que,
Pede deferimento.`
    }
  },

  // ===== TEMPLATES FAMÍLIA =====
  {
    id: 'familia-divorcio',
    templateType: 'familia',
    title: 'Ação de Divórcio Consensual',
    description: 'Template para ação de divórcio consensual sem filhos menores',
    content: {
      tribunal: 'Vara de Família / Vara Cível',
      fatos: `Os REQUERENTES contraíram matrimônio em [DATA], conforme certidão de casamento anexa, sob o regime de [REGIME DE BENS].

Da união não advieram filhos menores ou incapazes.

Os REQUERENTES estão separados de fato desde [DATA], estando a convivência conjugal definitivamente desfeita, sem possibilidade de reconciliação.

Os cônjuges acordaram quanto à partilha dos bens, conforme descrito no acordo anexo.

A REQUERENTE [voltará/manterá] a usar o nome de solteira [ou manterá o nome de casada].`,
      fundamentosJuridicos: `A Emenda Constitucional nº 66/2010 alterou o artigo 226, §6º da Constituição Federal, permitindo o divórcio direto sem necessidade de prévia separação judicial.

O artigo 731 do CPC permite o divórcio consensual por meio de petição assinada por ambos os cônjuges.

Não havendo filhos menores ou incapazes e estando ambos de acordo, o divórcio pode ser decretado de forma simplificada.

O artigo 1.581 do Código Civil estabelece que "O divórcio pode ser concedido sem que haja prévia partilha de bens".`,
      pedidos: `Diante do exposto, requerem os REQUERENTES:

a) A homologação do acordo de divórcio consensual;

b) A decretação do divórcio, com as seguintes determinações:
   - Partilha de bens conforme acordo anexo;
   - Retorno/manutenção do nome [ESPECIFICAR];

c) A expedição do mandado de averbação junto ao Cartório de Registro Civil;

d) A dispensa de audiência de conciliação, nos termos do art. 334, §4º, II do CPC;

e) A gratuidade de justiça, se aplicável.

Termos em que,
Pedem deferimento.`
    }
  },
  {
    id: 'familia-alimentos',
    templateType: 'familia',
    title: 'Ação de Alimentos',
    description: 'Template para ação de alimentos para filhos menores',
    content: {
      tribunal: 'Vara de Família',
      valorCausa: 'R$ [VALOR ANUAL DOS ALIMENTOS]',
      fatos: `O AUTOR é filho do RÉU, conforme certidão de nascimento anexa.

O RÉU não vem cumprindo com seu dever de sustento do AUTOR, deixando de prover recursos necessários para alimentação, saúde, educação, vestuário e lazer.

O AUTOR necessita de R$ [VALOR] mensais para suas necessidades básicas, incluindo:
- Alimentação: R$ [VALOR]
- Educação: R$ [VALOR]
- Saúde: R$ [VALOR]
- Vestuário: R$ [VALOR]
- Transporte: R$ [VALOR]

O RÉU possui capacidade financeira para arcar com os alimentos, exercendo a profissão de [PROFISSÃO] e percebendo renda mensal de aproximadamente R$ [VALOR].`,
      fundamentosJuridicos: `O artigo 1.694 do Código Civil estabelece que "Podem os parentes, os cônjuges ou companheiros pedir uns aos outros os alimentos de que necessitem para viver de modo compatível com a sua condição social".

O artigo 1.696 do CC dispõe que "O direito à prestação de alimentos é recíproco entre pais e filhos".

O artigo 1.703 do CC prevê que "Para a manutenção dos filhos, os separados judicialmente contribuirão na proporção de seus recursos".

A Constituição Federal, em seu artigo 227, estabelece o dever da família de assegurar à criança e ao adolescente o direito à vida, à saúde, à alimentação e à educação.

Os alimentos devem ser fixados conforme o binômio necessidade/possibilidade (art. 1.694, §1º do CC).`,
      pedidos: `Diante do exposto, requer-se:

a) A concessão de alimentos provisórios no valor de R$ [VALOR] ou [PERCENTUAL]% do salário mínimo/rendimentos líquidos do RÉU;

b) A citação do RÉU para, querendo, contestar;

c) A procedência do pedido, condenando o RÉU ao pagamento de alimentos definitivos no valor de R$ [VALOR] mensais;

d) A determinação de desconto em folha de pagamento;

e) A condenação do RÉU em honorários advocatícios;

f) A gratuidade de justiça.

Dá-se à causa o valor de R$ [VALOR ANUAL].

Termos em que,
Pede deferimento.`
    }
  },
  {
    id: 'familia-guarda',
    templateType: 'familia',
    title: 'Ação de Guarda e Regulamentação de Visitas',
    description: 'Template para ação de guarda de filhos menores',
    content: {
      tribunal: 'Vara de Família',
      fatos: `O AUTOR e o RÉU são genitores do menor [NOME], nascido em [DATA], conforme certidão anexa.

Os genitores estão separados desde [DATA], e o menor reside com [ESPECIFICAR].

O AUTOR busca a [guarda unilateral/compartilhada] do menor, bem como a regulamentação do regime de visitas, pelos seguintes motivos:
[DESCREVER A SITUAÇÃO FÁTICA E OS MOTIVOS DO PEDIDO]

A guarda [unilateral/compartilhada] atende ao melhor interesse da criança, considerando [FUNDAMENTAR].`,
      fundamentosJuridicos: `O artigo 1.583 do Código Civil estabelece as modalidades de guarda: unilateral ou compartilhada.

O artigo 1.584, §2º do CC prevê que "Quando não houver acordo entre a mãe e o pai quanto à guarda do filho, encontrando-se ambos os genitores aptos a exercer o poder familiar, será aplicada a guarda compartilhada".

O artigo 1.589 do CC assegura ao genitor não guardião o direito de visitas e de fiscalizar a manutenção e educação dos filhos.

O Estatuto da Criança e do Adolescente (Lei 8.069/90), em seu artigo 3º, estabelece que a criança goza de proteção integral.

O princípio do melhor interesse da criança deve nortear todas as decisões que a envolvam (art. 227 da CF).`,
      pedidos: `Diante do exposto, requer-se:

a) A citação do RÉU para contestar;

b) A procedência do pedido para:
   - Deferir a guarda [unilateral/compartilhada] do menor em favor do AUTOR;
   - Regulamentar o regime de visitas do genitor não guardião;
   - Fixar a residência base do menor;

c) A realização de estudo psicossocial;

d) A oitiva do menor, se em idade adequada;

e) A gratuidade de justiça.

Termos em que,
Pede deferimento.`
    }
  },
  {
    id: 'familia-inventario',
    templateType: 'familia',
    title: 'Inventário e Partilha de Bens',
    description: 'Template para abertura de inventário judicial',
    content: {
      tribunal: 'Vara de Família e Sucessões / Vara Cível',
      fatos: `[NOME DO FALECIDO] faleceu em [DATA], na cidade de [CIDADE/UF], conforme certidão de óbito anexa.

O de cujus era [estado civil] e deixou os seguintes herdeiros:
- [NOME], [qualificação], [grau de parentesco]
- [NOME], [qualificação], [grau de parentesco]

O falecido deixou os seguintes bens a inventariar:
IMÓVEIS:
- [DESCRIÇÃO DO IMÓVEL], avaliado em R$ [VALOR]

MÓVEIS:
- [DESCRIÇÃO], avaliado em R$ [VALOR]

VALORES:
- Conta bancária nº [NÚMERO], Banco [NOME], saldo de R$ [VALOR]

Total do espólio: R$ [VALOR TOTAL]`,
      fundamentosJuridicos: `O artigo 611 do CPC estabelece que "O processo de inventário e de partilha deve ser instaurado dentro de 2 (dois) meses, a contar da abertura da sucessão".

O artigo 1.784 do Código Civil prevê que "Aberta a sucessão, a herança transmite-se, desde logo, aos herdeiros legítimos e testamentários".

O artigo 1.791 do CC dispõe que "A herança defere-se como um todo unitário, ainda que vários sejam os herdeiros".

O artigo 1.829 do CC estabelece a ordem de vocação hereditária.`,
      pedidos: `Diante do exposto, requer-se:

a) A abertura do inventário dos bens deixados por [NOME DO FALECIDO];

b) A nomeação de [NOME] como inventariante;

c) A expedição de certidão de nomeação de inventariante;

d) A intimação da Fazenda Pública para manifestação sobre o ITCMD;

e) Ao final, a homologação da partilha e expedição de formal de partilha;

f) A gratuidade de justiça.

Dá-se à causa o valor de R$ [VALOR DO ESPÓLIO].

Termos em que,
Pede deferimento.`
    }
  },

  // ===== TEMPLATES EMPRESARIAL =====
  {
    id: 'empresarial-recuperacao',
    templateType: 'empresarial',
    title: 'Pedido de Recuperação Judicial',
    description: 'Template para pedido de recuperação judicial de empresa',
    content: {
      tribunal: 'Vara de Falências e Recuperações Judiciais',
      fatos: `A REQUERENTE é empresa regularmente constituída, inscrita no CNPJ sob nº [NÚMERO], com sede em [ENDEREÇO], atuando no ramo de [ATIVIDADE].

A empresa encontra-se em crise econômico-financeira, decorrente de [DESCREVER AS CAUSAS DA CRISE: retração do mercado, perda de clientes, pandemia, etc.].

Apesar das dificuldades, a REQUERENTE possui condições de superar a crise mediante a implementação de plano de recuperação, mantendo sua atividade empresarial, empregos e cumprindo sua função social.

A empresa conta atualmente com [NÚMERO] empregados e faturamento médio mensal de R$ [VALOR].`,
      fundamentosJuridicos: `A Lei 11.101/2005, em seu artigo 47, estabelece que "A recuperação judicial tem por objetivo viabilizar a superação da situação de crise econômico-financeira do devedor, a fim de permitir a manutenção da fonte produtora, do emprego dos trabalhadores e dos interesses dos credores".

O artigo 48 da mesma lei estabelece os requisitos para requerer a recuperação judicial.

O artigo 51 lista os documentos que devem instruir a petição inicial.

A preservação da empresa é princípio constitucional implícito, decorrente dos valores sociais do trabalho e da livre iniciativa (art. 1º, IV da CF).`,
      pedidos: `Diante do exposto, requer-se:

a) O processamento da recuperação judicial;

b) A nomeação de administrador judicial;

c) A suspensão de todas as ações e execuções contra a REQUERENTE (stay period);

d) A expedição de editais para conhecimento dos credores;

e) A designação de Assembleia Geral de Credores para deliberação sobre o plano de recuperação;

f) A gratuidade de justiça.

Termos em que,
Pede deferimento.`
    }
  },
  {
    id: 'empresarial-dissolucao',
    templateType: 'empresarial',
    title: 'Ação de Dissolução Parcial de Sociedade',
    description: 'Template para dissolução parcial de sociedade empresária',
    content: {
      tribunal: 'Vara Empresarial / Vara Cível',
      valorCausa: 'R$ [VALOR DA QUOTA]',
      fatos: `O AUTOR é sócio da sociedade [NOME DA EMPRESA], pessoa jurídica de direito privado, inscrita no CNPJ sob nº [NÚMERO], detendo [PERCENTUAL]% do capital social.

O AUTOR deseja retirar-se da sociedade pelos seguintes motivos: [DESCREVER: quebra da affectio societatis, desentendimentos entre sócios, descumprimento do contrato social, etc.].

Os demais sócios [concordam/não concordam] com a dissolução parcial e apuração de haveres.

O capital social da empresa é de R$ [VALOR], e o AUTOR possui quotas no valor nominal de R$ [VALOR].`,
      fundamentosJuridicos: `O artigo 1.029 do Código Civil estabelece que "Além dos casos previstos na lei ou no contrato, qualquer sócio pode retirar-se da sociedade".

O artigo 1.031 do CC prevê que "Nos casos em que a sociedade se resolver em relação a um sócio, o valor da sua quota, considerada pelo montante efetivamente realizado, liquidar-se-á".

O artigo 600 do CPC regula a ação de dissolução parcial de sociedade.

O artigo 604 do CPC estabelece que "Para apuração dos haveres, o juiz: I - fixará a data da resolução da sociedade; II - definirá o critério de apuração dos haveres".`,
      pedidos: `Diante do exposto, requer-se:

a) A citação dos RÉUS para contestar;

b) A procedência do pedido para:
   - Decretar a dissolução parcial da sociedade quanto ao AUTOR;
   - Determinar a apuração de haveres mediante perícia contábil;
   - Condenar os RÉUS ao pagamento dos haveres apurados, corrigidos monetariamente;

c) Honorários advocatícios;

d) Custas processuais.

Dá-se à causa o valor de R$ [VALOR DA QUOTA].

Termos em que,
Pede deferimento.`
    }
  },

  // ===== TEMPLATES ADMINISTRATIVO =====
  {
    id: 'administrativo-mandado-seguranca',
    templateType: 'administrativo',
    title: 'Mandado de Segurança',
    description: 'Template para mandado de segurança contra ato de autoridade',
    content: {
      tribunal: 'Vara da Fazenda Pública / Justiça Federal',
      fatos: `O IMPETRANTE é [qualificação] e vem impetrar o presente MANDADO DE SEGURANÇA contra ato ilegal praticado pelo [AUTORIDADE COATORA], que [DESCREVER O ATO IMPUGNADO].

O ato coator foi praticado em [DATA] e consiste em [DESCREVER DETALHADAMENTE].

O IMPETRANTE possui direito líquido e certo [DESCREVER O DIREITO], comprovado pelos documentos anexos.

O ato impugnado viola [ESPECIFICAR: lei, regulamento, princípios constitucionais, etc.].`,
      fundamentosJuridicos: `O artigo 5º, inciso LXIX da Constituição Federal estabelece que "Conceder-se-á mandado de segurança para proteger direito líquido e certo, não amparado por habeas corpus ou habeas data, quando o responsável pela ilegalidade ou abuso de poder for autoridade pública".

A Lei 12.016/2009 regulamenta o mandado de segurança.

O artigo 1º da Lei 12.016/2009 dispõe que "Conceder-se-á mandado de segurança para proteger direito líquido e certo, não amparado por habeas corpus ou habeas data".

O ato impugnado padece de ilegalidade por [FUNDAMENTAR].`,
      pedidos: `Diante do exposto, requer-se:

a) A concessão de MEDIDA LIMINAR para suspender os efeitos do ato impugnado;

b) A notificação da autoridade coatora para prestar informações;

c) A oitiva do Ministério Público;

d) A CONCESSÃO DA SEGURANÇA para:
   - Declarar a nulidade do ato impugnado;
   - [OUTROS PEDIDOS ESPECÍFICOS];

e) A condenação da parte contrária em honorários advocatícios.

Termos em que,
Pede deferimento.`
    }
  },
  {
    id: 'administrativo-anulacao',
    templateType: 'administrativo',
    title: 'Ação Anulatória de Ato Administrativo',
    description: 'Template para ação anulatória de ato administrativo',
    content: {
      tribunal: 'Vara da Fazenda Pública / Justiça Federal',
      valorCausa: 'R$ [VALOR]',
      fatos: `O AUTOR é [qualificação] e foi prejudicado pelo ato administrativo [ESPECIFICAR], emanado pelo RÉU em [DATA].

O ato administrativo impugnado consiste em [DESCREVER O ATO].

O referido ato padece de vícios que ensejam sua anulação, a saber: [DESCREVER OS VÍCIOS: incompetência, vício de forma, ilegalidade, desvio de finalidade, etc.].

O AUTOR foi notificado do ato em [DATA] e esgotou a via administrativa em [DATA/OU NÃO HOUVE NECESSIDADE].`,
      fundamentosJuridicos: `O artigo 5º, inciso XXXV da Constituição Federal estabelece que "a lei não excluirá da apreciação do Poder Judiciário lesão ou ameaça a direito".

O princípio da legalidade (art. 37, caput, CF) impõe que a Administração Pública só pode agir conforme a lei.

A Lei 9.784/99, em seu artigo 53, prevê que "A Administração deve anular seus próprios atos, quando eivados de vício de legalidade".

O ato administrativo deve observar os requisitos de competência, finalidade, forma, motivo e objeto, sob pena de nulidade.`,
      pedidos: `Diante do exposto, requer-se:

a) A concessão de tutela de urgência para suspender os efeitos do ato impugnado;

b) A citação do RÉU para contestar;

c) A procedência do pedido para anular o ato administrativo [ESPECIFICAR];

d) A condenação do RÉU em honorários advocatícios e custas;

e) Produção de provas.

Dá-se à causa o valor de R$ [VALOR].

Termos em que,
Pede deferimento.`
    }
  },

  // ===== TEMPLATES PREVIDENCIÁRIO =====
  {
    id: 'previdenciario-aposentadoria',
    templateType: 'previdenciario',
    title: 'Ação de Concessão de Aposentadoria',
    description: 'Template para ação de concessão de aposentadoria por tempo de contribuição',
    content: {
      tribunal: 'Justiça Federal / Juizado Especial Federal',
      valorCausa: 'R$ [VALOR]',
      fatos: `O AUTOR é segurado do INSS, inscrito sob o NIT/PIS nº [NÚMERO], tendo contribuído para a Previdência Social pelo período mínimo exigido para concessão do benefício de aposentadoria.

O AUTOR requereu administrativamente a aposentadoria em [DATA], através do protocolo nº [NÚMERO], tendo o INSS indeferido o pedido sob a alegação de [MOTIVO DO INDEFERIMENTO].

Contudo, o AUTOR comprova que possui [TEMPO DE CONTRIBUIÇÃO] anos de contribuição, conforme documentos anexos, incluindo:
- CTPS com os vínculos empregatícios;
- CNIS atualizado;
- [OUTROS DOCUMENTOS].

O AUTOR completou os requisitos para aposentadoria em [DATA].`,
      fundamentosJuridicos: `O artigo 201 da Constituição Federal estabelece o direito à previdência social.

A Lei 8.213/91 regulamenta os benefícios previdenciários, estabelecendo os requisitos para concessão de aposentadoria.

O artigo 52 da Lei 8.213/91 prevê os requisitos para aposentadoria por tempo de contribuição.

A Emenda Constitucional 103/2019 estabeleceu novas regras de transição, devendo ser aplicada a regra mais favorável ao segurado.

O INSS não pode negar benefício quando preenchidos os requisitos legais.`,
      pedidos: `Diante do exposto, requer-se:

a) A citação do INSS para contestar;

b) A procedência do pedido para:
   - Reconhecer o tempo de contribuição do AUTOR;
   - Conceder a aposentadoria desde a DER ([DATA]);
   - Condenar o INSS ao pagamento das parcelas vencidas, corrigidas pelo INPC e acrescidas de juros de mora;

c) Antecipação de tutela para implantação imediata do benefício;

d) Honorários advocatícios sobre as parcelas vencidas;

e) A gratuidade de justiça.

Dá-se à causa o valor de R$ [VALOR].

Termos em que,
Pede deferimento.`
    }
  },
  {
    id: 'previdenciario-auxilio-doenca',
    templateType: 'previdenciario',
    title: 'Ação de Concessão de Auxílio-Doença',
    description: 'Template para ação de concessão/restabelecimento de auxílio-doença',
    content: {
      tribunal: 'Justiça Federal / Juizado Especial Federal',
      valorCausa: 'R$ [VALOR]',
      fatos: `O AUTOR é segurado do INSS, inscrito sob o NIT/PIS nº [NÚMERO], tendo contribuído regularmente para a Previdência Social.

O AUTOR encontra-se incapacitado para o trabalho desde [DATA], em razão de [DESCREVER A DOENÇA/LESÃO], conforme atestados e laudos médicos anexos.

O AUTOR requereu administrativamente o benefício em [DATA], através do protocolo nº [NÚMERO], tendo o INSS indeferido/cessado o pedido sob a alegação de [MOTIVO].

Contudo, o AUTOR permanece incapacitado, conforme demonstram os documentos médicos anexos.`,
      fundamentosJuridicos: `O artigo 59 da Lei 8.213/91 estabelece que "O auxílio-doença será devido ao segurado que, havendo cumprido, quando for o caso, o período de carência exigido nesta Lei, ficar incapacitado para o seu trabalho ou para a sua atividade habitual por mais de 15 (quinze) dias consecutivos".

O artigo 60 da mesma lei prevê os requisitos para concessão do benefício.

A incapacidade laboral deve ser comprovada mediante perícia médica, podendo o juiz se valer de prova pericial judicial.

O Tema 1020 do STJ estabelece que "a análise da concessão de benefício previdenciário por incapacidade deve considerar os aspectos socioeconômicos do segurado".`,
      pedidos: `Diante do exposto, requer-se:

a) A citação do INSS para contestar;

b) A realização de perícia médica judicial;

c) A procedência do pedido para:
   - Conceder/restabelecer o auxílio-doença desde [DATA];
   - Condenar o INSS ao pagamento das parcelas vencidas;

d) Antecipação de tutela para implantação imediata do benefício;

e) Honorários advocatícios;

f) A gratuidade de justiça.

Dá-se à causa o valor de R$ [VALOR].

Termos em que,
Pede deferimento.`
    }
  },
  {
    id: 'previdenciario-bpc-loas',
    templateType: 'previdenciario',
    title: 'Ação de Concessão de BPC/LOAS',
    description: 'Template para ação de concessão de Benefício de Prestação Continuada',
    content: {
      tribunal: 'Justiça Federal / Juizado Especial Federal',
      valorCausa: 'R$ [VALOR]',
      fatos: `O AUTOR é pessoa [idosa com 65 anos ou mais / portadora de deficiência], conforme documentos anexos.

O AUTOR e seu grupo familiar encontram-se em situação de miserabilidade, com renda per capita inferior a 1/4 do salário mínimo, conforme declaração de composição familiar anexa.

O grupo familiar é composto por:
- [NOME], [RELAÇÃO], renda: R$ [VALOR]
Renda total: R$ [VALOR]
Renda per capita: R$ [VALOR]

O AUTOR requereu administrativamente o BPC em [DATA], tendo o INSS indeferido sob a alegação de [MOTIVO].`,
      fundamentosJuridicos: `O artigo 203, inciso V da Constituição Federal garante "a garantia de um salário mínimo de benefício mensal à pessoa portadora de deficiência e ao idoso que comprovem não possuir meios de prover à própria manutenção".

A Lei 8.742/93 (LOAS), em seu artigo 20, regulamenta o BPC.

O STF, no RE 567985, flexibilizou o critério de renda per capita de 1/4 do salário mínimo, permitindo a análise das condições concretas de miserabilidade.

O Tema 1019 do STJ estabelece critérios para comprovação da deficiência para fins de BPC.`,
      pedidos: `Diante do exposto, requer-se:

a) A citação do INSS para contestar;

b) A realização de perícia médica e estudo social;

c) A procedência do pedido para conceder o BPC/LOAS desde a DER;

d) Antecipação de tutela para implantação imediata;

e) Honorários advocatícios;

f) A gratuidade de justiça.

Dá-se à causa o valor de R$ [VALOR].

Termos em que,
Pede deferimento.`
    }
  },

  // ===== TEMPLATES AMBIENTAL =====
  {
    id: 'ambiental-acao-civil-publica',
    templateType: 'ambiental',
    title: 'Ação Civil Pública Ambiental',
    description: 'Template para ação civil pública por dano ambiental',
    content: {
      tribunal: 'Vara Federal / Vara da Fazenda Pública',
      valorCausa: 'R$ [VALOR]',
      fatos: `O AUTOR, [LEGITIMADO: Ministério Público / Associação / Defensoria], propõe a presente AÇÃO CIVIL PÚBLICA em face do RÉU, em razão de danos ambientais causados em [LOCAL].

O RÉU praticou as seguintes condutas lesivas ao meio ambiente:
- [DESCREVER AS CONDUTAS: desmatamento, poluição, construção irregular em APP, etc.]

Os danos ambientais foram constatados em [DATA] e consistem em [DESCREVER OS DANOS].

As condutas do RÉU violam a legislação ambiental, especificamente [CITAR LEIS VIOLADAS].`,
      fundamentosJuridicos: `O artigo 225 da Constituição Federal estabelece que "Todos têm direito ao meio ambiente ecologicamente equilibrado, bem de uso comum do povo e essencial à sadia qualidade de vida, impondo-se ao Poder Público e à coletividade o dever de defendê-lo e preservá-lo para as presentes e futuras gerações".

A Lei 7.347/85 disciplina a ação civil pública para defesa do meio ambiente.

A Lei 6.938/81 (Política Nacional do Meio Ambiente) estabelece a responsabilidade objetiva por danos ambientais.

O artigo 14, §1º da Lei 6.938/81 prevê que "é o poluidor obrigado, independentemente da existência de culpa, a indenizar ou reparar os danos causados ao meio ambiente".`,
      pedidos: `Diante do exposto, requer-se:

a) A concessão de tutela de urgência para:
   - Cessar imediatamente as atividades poluidoras;
   - Embargar a área degradada;

b) A citação do RÉU para contestar;

c) A procedência do pedido para:
   - Condenar o RÉU à obrigação de fazer: recuperar a área degradada;
   - Condenar o RÉU ao pagamento de indenização por danos ambientais no valor de R$ [VALOR];
   - Condenar ao pagamento de dano moral coletivo;

d) Realização de perícia ambiental;

e) Honorários advocatícios.

Dá-se à causa o valor de R$ [VALOR].

Termos em que,
Pede deferimento.`
    }
  },
  {
    id: 'ambiental-embargo',
    templateType: 'ambiental',
    title: 'Ação de Embargo de Obra Irregular',
    description: 'Template para ação de embargo de construção em área de proteção ambiental',
    content: {
      tribunal: 'Vara da Fazenda Pública / Vara Cível',
      fatos: `O AUTOR tomou conhecimento de que o RÉU está realizando construção/atividade irregular em [LOCAL], área de proteção ambiental [APP/Reserva Legal/Unidade de Conservação/etc.].

A obra/atividade consiste em [DESCREVER] e está sendo realizada sem a devida licença ambiental e em desacordo com a legislação ambiental.

A área em questão é caracterizada como [DESCREVER: margem de rio, topo de morro, encosta, mangue, etc.], sendo área de preservação permanente nos termos do Código Florestal.

A continuidade da obra/atividade causará dano ambiental irreversível.`,
      fundamentosJuridicos: `O artigo 225 da CF/88 assegura o direito ao meio ambiente ecologicamente equilibrado.

A Lei 12.651/2012 (Código Florestal) define as Áreas de Preservação Permanente e veda intervenções sem autorização.

O artigo 4º do Código Florestal estabelece as APPs, incluindo [ESPECIFICAR].

O artigo 10 da Lei 6.938/81 exige prévio licenciamento ambiental para atividades potencialmente poluidoras.

A responsabilidade por dano ambiental é objetiva, independendo de culpa.`,
      pedidos: `Diante do exposto, requer-se:

a) TUTELA DE URGÊNCIA para:
   - Embargar imediatamente a obra/atividade;
   - Proibir o RÉU de realizar qualquer intervenção na área;
   - Multa diária em caso de descumprimento;

b) A citação do RÉU para contestar;

c) A procedência do pedido para:
   - Tornar definitivo o embargo;
   - Determinar a demolição da construção irregular;
   - Condenar o RÉU à recuperação da área degradada;

d) Realização de perícia ambiental;

e) Custas e honorários.

Termos em que,
Pede deferimento.`
    }
  },

  // ===== TEMPLATES DE EXECUÇÃO E CUMPRIMENTO =====
  {
    id: 'civil-busca-apreensao',
    templateType: 'civil',
    title: 'Ação de Busca e Apreensão',
    description: 'Template para ação de busca e apreensão de bem alienado fiduciariamente',
    content: {
      tribunal: 'Vara Cível da Comarca de [CIDADE/UF]',
      valorCausa: 'R$ [VALOR DO BEM]',
      fatos: `O AUTOR celebrou com o RÉU, em [DATA], contrato de financiamento com garantia de alienação fiduciária do bem abaixo descrito, conforme contrato anexo:

BEM OBJETO DA GARANTIA:
- Descrição: [VEÍCULO/BEM MÓVEL]
- Marca/Modelo: [ESPECIFICAR]
- Ano: [ANO]
- Placa/Chassi: [IDENTIFICAÇÃO]
- RENAVAM: [NÚMERO] (se aplicável)

O RÉU comprometeu-se ao pagamento de [NÚMERO] parcelas mensais de R$ [VALOR], com vencimento todo dia [DIA] de cada mês.

Ocorre que o RÉU encontra-se inadimplente desde a parcela vencida em [DATA], totalizando [NÚMERO] parcelas em atraso, no montante de R$ [VALOR TOTAL EM ATRASO].

O AUTOR notificou extrajudicialmente o RÉU através de [CARTÓRIO/CORREIOS] em [DATA], conforme documento anexo, constituindo-o em mora, nos termos do artigo 2º, §2º do Decreto-Lei 911/69.

Decorrido o prazo sem purgação da mora, resta configurada a inadimplência que autoriza a busca e apreensão do bem alienado fiduciariamente.`,
      fundamentosJuridicos: `A presente ação tem fundamento no Decreto-Lei nº 911/69, que disciplina a alienação fiduciária em garantia.

O artigo 3º do referido diploma legal estabelece que "O proprietário fiduciário ou credor poderá, desde que comprovada a mora, na forma estabelecida pelo § 2º do art. 2º, ou o inadimplemento, requerer contra o devedor ou terceiro a busca e apreensão do bem alienado fiduciariamente".

O §1º do mesmo artigo dispõe que "Cinco dias após executada a liminar mencionada no caput, consolidar-se-ão a propriedade e a posse plena e exclusiva do bem no patrimônio do credor fiduciário".

O §2º estabelece que "No prazo do § 1º, o devedor fiduciante poderá pagar a integralidade da dívida pendente, segundo os valores apresentados pelo credor fiduciário na inicial, hipótese na qual o bem lhe será restituído livre do ônus".

A mora foi devidamente comprovada pela notificação extrajudicial, atendendo aos requisitos do artigo 2º, §2º do DL 911/69.

A Súmula 72 do STJ estabelece que "A comprovação da mora é imprescindível à busca e apreensão do bem alienado fiduciariamente".

O bem permanece em poder do devedor, que não cumpriu sua obrigação, justificando a medida de busca e apreensão para garantir o crédito do AUTOR.`,
      pedidos: `Ante o exposto, requer a Vossa Excelência:

a) A concessão de LIMINAR de busca e apreensão do bem descrito na inicial, independentemente de audiência do RÉU, nos termos do artigo 3º do Decreto-Lei 911/69;

b) Após a apreensão do bem, a citação do RÉU para, no prazo de 5 (cinco) dias:
   - Pagar a integralidade da dívida, no valor de R$ [VALOR TOTAL], para restituição do bem; ou
   - Apresentar contestação;

c) A consolidação da propriedade e posse plena do bem em favor do AUTOR, caso não seja purgada a mora no prazo legal;

d) Alternativamente, caso o bem não seja encontrado, a conversão da ação em execução pelo valor equivalente ao bem, acrescido das parcelas vencidas e vincendas;

e) A condenação do RÉU ao pagamento das custas processuais e honorários advocatícios de 10% sobre o valor da causa;

f) A expedição de ofício ao DETRAN para bloqueio de transferência do veículo (se aplicável).

Dá-se à causa o valor de R$ [VALOR].

Termos em que,
Pede deferimento.`
    }
  },
  {
    id: 'civil-execucao-titulo-extrajudicial',
    templateType: 'civil',
    title: 'Ação de Execução de Título Extrajudicial',
    description: 'Template para execução de título executivo extrajudicial (cheque, nota promissória, contrato)',
    content: {
      tribunal: 'Vara Cível da Comarca de [CIDADE/UF]',
      valorCausa: 'R$ [VALOR DA EXECUÇÃO]',
      fatos: `O EXEQUENTE é legítimo credor do EXECUTADO, conforme título executivo extrajudicial anexo:

TÍTULO EXECUTIVO:
- Natureza: [CHEQUE / NOTA PROMISSÓRIA / DUPLICATA / CONTRATO / CCB]
- Número: [NÚMERO DO TÍTULO]
- Data de emissão: [DATA]
- Valor original: R$ [VALOR]
- Data de vencimento: [DATA]
- [Para cheques: Banco sacado: [BANCO], Agência: [AG], Conta: [CC]]

O título foi regularmente emitido pelo EXECUTADO em favor do EXEQUENTE, em razão de [ORIGEM DA DÍVIDA: compra e venda, empréstimo, prestação de serviços, etc.].

Na data do vencimento, o título foi apresentado [ao banco sacado / para pagamento] e não foi honrado [por insuficiência de fundos / sem motivo justificado].

O EXECUTADO foi notificado [extrajudicialmente / através de protesto] para pagamento, conforme documento anexo, permanecendo inerte.

DEMONSTRATIVO DE DÉBITO ATUALIZADO:
- Principal: R$ [VALOR]
- Correção monetária (INPC): R$ [VALOR]
- Juros de mora (1% a.m.): R$ [VALOR]
- Multa contratual: R$ [VALOR] (se aplicável)
- TOTAL: R$ [VALOR TOTAL]`,
      fundamentosJuridicos: `A presente execução fundamenta-se no artigo 784 do Código de Processo Civil, que elenca os títulos executivos extrajudiciais:

"Art. 784. São títulos executivos extrajudiciais:
I - a letra de câmbio, a nota promissória, a duplicata, a debênture e o cheque;
II - a escritura pública ou outro documento público assinado pelo devedor;
III - o documento particular assinado pelo devedor e por 2 (duas) testemunhas;
[...]"

O título executivo preenche todos os requisitos legais de liquidez, certeza e exigibilidade, nos termos do artigo 783 do CPC.

O artigo 786 do CPC estabelece que "A execução pode ser instaurada caso o devedor não satisfaça a obrigação certa, líquida e exigível consubstanciada em título executivo".

O artigo 827 do CPC autoriza a fixação de honorários advocatícios de dez por cento sobre o valor da execução.

O artigo 829 do CPC determina que "O executado será citado para pagar a dívida no prazo de 3 (três) dias, contado da citação".

O artigo 831 do CPC prevê a penhora de tantos bens quantos bastem para o pagamento do principal atualizado, dos juros, das custas e dos honorários advocatícios.`,
      pedidos: `Ante o exposto, requer a Vossa Excelência:

a) A citação do EXECUTADO para pagar a quantia de R$ [VALOR TOTAL], no prazo de 3 (três) dias, sob pena de penhora de bens suficientes à garantia do juízo;

b) A fixação de honorários advocatícios em 10% sobre o valor da execução, nos termos do artigo 827 do CPC;

c) Não havendo pagamento no prazo legal:
   - A penhora de bens do EXECUTADO, preferencialmente via SISBAJUD/BACENJUD;
   - O bloqueio de veículos via RENAJUD;
   - A averbação premonitória em imóveis via ARISP/CRI;

d) A intimação do EXECUTADO da penhora realizada, na pessoa de seu advogado ou pessoalmente;

e) Não havendo embargos ou sendo estes rejeitados, a expropriação dos bens penhorados para satisfação do crédito;

f) A condenação do EXECUTADO ao pagamento das custas processuais.

Dá-se à causa o valor de R$ [VALOR TOTAL].

Termos em que,
Pede deferimento.`
    }
  },
  {
    id: 'civil-cumprimento-sentenca',
    templateType: 'civil',
    title: 'Cumprimento de Sentença',
    description: 'Template para cumprimento de sentença judicial com obrigação de pagar quantia certa',
    content: {
      numeroProcesso: '[NÚMERO DO PROCESSO DE CONHECIMENTO]',
      tribunal: '[VARA/TRIBUNAL QUE PROFERIU A SENTENÇA]',
      valorCausa: 'R$ [VALOR DA EXECUÇÃO]',
      fatos: `O EXEQUENTE promoveu ação judicial em face do EXECUTADO (processo nº [NÚMERO]), tendo sido proferida sentença [de procedência / parcialmente procedente] que condenou o EXECUTADO ao pagamento de [DESCREVER A CONDENAÇÃO].

A sentença transitou em julgado em [DATA], conforme certidão anexa.

Não houve cumprimento voluntário da obrigação pelo EXECUTADO.

DEMONSTRATIVO DE DÉBITO ATUALIZADO (Art. 524, CPC):

1. VALOR PRINCIPAL DA CONDENAÇÃO:
   - Valor original: R$ [VALOR]
   - Data-base: [DATA DA SENTENÇA/EVENTO]

2. CORREÇÃO MONETÁRIA:
   - Índice: [INPC/IPCA-E/TR]
   - Período: [DATA INICIAL] a [DATA ATUAL]
   - Valor: R$ [VALOR]

3. JUROS DE MORA:
   - Taxa: [1% a.m. / SELIC]
   - Termo inicial: [CITAÇÃO / EVENTO DANOSO]
   - Período: [DATA INICIAL] a [DATA ATUAL]
   - Valor: R$ [VALOR]

4. MULTA DO ART. 523, §1º, CPC (10%):
   - Valor: R$ [VALOR] (a incidir após decurso do prazo de pagamento voluntário)

5. HONORÁRIOS DA FASE DE CUMPRIMENTO (10%):
   - Valor: R$ [VALOR] (a incidir após decurso do prazo de pagamento voluntário)

TOTAL ATUALIZADO: R$ [VALOR TOTAL]`,
      fundamentosJuridicos: `O cumprimento de sentença é regido pelos artigos 513 a 538 do Código de Processo Civil.

O artigo 523 do CPC estabelece:
"No caso de condenação em quantia certa, ou já fixada em liquidação, e no caso de decisão sobre parcela incontroversa, o cumprimento definitivo da sentença far-se-á a requerimento do exequente, sendo o executado intimado para pagar o débito, no prazo de 15 (quinze) dias, acrescido de custas, se houver."

O §1º do mesmo artigo dispõe:
"Não ocorrendo pagamento voluntário no prazo do caput, o débito será acrescido de multa de dez por cento e, também, de honorários de advogado de dez por cento."

O artigo 524 do CPC determina que o requerimento de cumprimento deve ser instruído com demonstrativo discriminado e atualizado do crédito.

O artigo 525 do CPC estabelece o prazo de 15 dias para eventual impugnação ao cumprimento de sentença, após a intimação para pagamento.

O artigo 831 do CPC autoriza a penhora de tantos bens quantos bastem para o pagamento do débito.

A jurisprudência do STJ consolidou que os honorários advocatícios fixados na fase de conhecimento são cumuláveis com aqueles fixados na fase de cumprimento de sentença (Tema 973).`,
      pedidos: `Ante o exposto, requer a Vossa Excelência:

a) O recebimento do presente cumprimento de sentença;

b) A intimação do EXECUTADO, na pessoa de seu advogado constituído nos autos, para pagar a quantia de R$ [VALOR TOTAL], no prazo de 15 (quinze) dias, sob pena de acréscimo de multa de 10% e honorários advocatícios de 10%, nos termos do artigo 523, §1º, do CPC;

c) Decorrido o prazo sem pagamento:
   - O bloqueio de valores via SISBAJUD/BACENJUD até o limite do débito atualizado;
   - A penhora de veículos via RENAJUD;
   - A penhora de imóveis e averbação premonitória via ARISP/CRI;
   - A penhora de outros bens suficientes à satisfação do crédito;

d) A intimação do EXECUTADO da penhora para, querendo, apresentar impugnação no prazo legal;

e) Não havendo impugnação ou sendo esta rejeitada, a expropriação dos bens penhorados;

f) A expedição de mandado de levantamento em favor do EXEQUENTE após a satisfação do crédito;

g) A condenação do EXECUTADO nas custas processuais.

Dá-se à causa o valor de R$ [VALOR TOTAL].

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

/**
 * Conta templates por tipo
 */
export function countTemplatesByType(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const template of petitionTemplates) {
    counts[template.templateType] = (counts[template.templateType] || 0) + 1;
  }
  return counts;
}
