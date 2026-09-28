import { CalculationResult, PeriodResult, formatCurrency } from './tax-engine';
import { Language } from './i18n';

export interface ExplanationDetail {
  id: string;
  title: Record<Language, string>;
  subtitle: Record<Language, string>;
  origin: Record<Language, string>;
  legalBasis: Record<Language, string>;
  formula: Record<Language, string>;
  description: Record<Language, string>;
  employerShare?: Record<Language, string>;
  exemptionsAndCredits?: Record<Language, string>;
  frequencyDivisorNote?: Record<Language, string>;
}

export const EXPLANATIONS: Record<string, ExplanationDetail> = {
  NET_PAY: {
    id: 'NET_PAY',
    title: {
      pt: 'Salário Líquido no Bolso (Net)',
      en: 'Net Take-Home Pay in Pocket',
      fr: 'Salaire net en poche',
    },
    subtitle: {
      pt: 'O montante final depositado na sua conta bancária a cada pagamento',
      en: 'The final amount deposited into your bank account on payday',
      fr: 'Le montant final déposé dans votre compte bancaire à chaque paie',
    },
    origin: {
      pt: 'Resultado da Folha de Pagamento Oficial do Québec (Talon de paie)',
      en: 'Official Quebec Payroll System Result (Paystub)',
      fr: 'Résultat officiel du talon de paie québécois',
    },
    legalBasis: {
      pt: 'Loi sur les normes du travail (LNT) art. 46 & Relevé 1 / T4',
      en: 'Act Respecting Labour Standards (ALS) s. 46 & RL-1 / T4',
      fr: 'Loi sur les normes du travail (LNT) art. 46 & Relevé 1 / T4',
    },
    formula: {
      pt: 'Salário Bruto - Impostos (QC + Féd) - Contribuições Sociais (RRQ + RQAP + AE) - Seguros/Benefícios Privados',
      en: 'Gross Pay - Income Taxes (QC + Fed) - Social Dues (RRQ + RQAP + EI) - Private Insurance & Benefits',
      fr: 'Salaire brut - Impôts (QC + Féd) - Régimes publics (RRQ + RQAP + AE) - Assurances et déductions privées',
    },
    description: {
      pt: 'Representa o dinheiro livre de qualquer ônus que você recebe no bolso. O cálculo subtrai rigorosamente todas as retenções na fonte exigidas pelos governos do Québec e do Canadá, além dos descontos autorizados da sua empresa (plano médico, refeições, etc.).',
      en: 'Represents the money you take home after all mandatory provincial and federal payroll withholdings, as well as company-specific benefits.',
      fr: 'Représente la somme exacte virée dans votre compte après déduction des impôts fédéral et provincial, des régimes sociaux obligatoires et des assurances collectives.',
    },
    exemptionsAndCredits: {
      pt: 'No Québec, você retém em média 70% a 80% do salário bruto na maioria das faixas horárias operacionais graças ao Abatimento Federal de 16,5% e aos créditos pessoais básicos.',
      en: 'In Quebec, workers typically keep 70% to 80% of gross earnings across operational brackets thanks to the 16.5% Quebec Abatement and basic personal amounts.',
      fr: 'Au Québec, vous conservez en moyenne 70 % à 80 % de votre brut grâce à l’abattement fédéral du Québec de 16,5 % et aux montants personnels de base.',
    },
  },

  GROSS_PAY: {
    id: 'GROSS_PAY',
    title: {
      pt: 'Salário Bruto do Período (Gross)',
      en: 'Gross Period Pay',
      fr: 'Salaire brut de la période',
    },
    subtitle: {
      pt: 'Total dos seus ganhos antes de qualquer dedução governamental ou privada',
      en: 'Total earnings before any tax or benefit deductions',
      fr: 'Total de vos gains avant toute retenue fiscale ou sociale',
    },
    origin: {
      pt: 'Contrato de Trabalho & Convenção Coletiva / Tabela Salarial da Empresa',
      en: 'Employment Contract & Collective Agreement / Wage Scale',
      fr: 'Contrat de travail & Convention collective / Échelle salariale',
    },
    legalBasis: {
      pt: 'Loi sur les normes du travail du Québec (LNT) art. 39.1 à 59.0.1',
      en: 'Quebec Act Respecting Labour Standards (ALS) s. 39.1 to 59.0.1',
      fr: 'Loi sur les normes du travail du Québec (LNT) art. 39.1 à 59.0.1',
    },
    formula: {
      pt: '(Horas Regulares × Taxa Horária) + (Horas Extras × 1,5× ou 2,0×) + Prêmios de Turno / Adicionais',
      en: '(Regular Hours × Hourly Rate) + (Overtime × 1.5× or 2.0×) + Shift Premiums',
      fr: '(Heures normales × Taux horaire) + (Heures supplémentaires × 1,5× ou 2,0×) + Primes de quart',
    },
    description: {
      pt: 'É a remuneração total devida pelas horas trabalhadas no período. No modelo padrão do Québec (quinzenal), corresponde geralmente a 2 semanas completas de trabalho (ex: 72h a 80h na quinzena).',
      en: 'Total pay earned for hours worked in the pay period. Under the Quebec standard (biweekly), it covers 2 full workweeks (e.g. 72h to 80h).',
      fr: 'Rémunération totale due pour les heures travaillées au cours de la période de paie (généralement 2 semaines au Québec, soit 72h à 80h).',
    },
    exemptionsAndCredits: {
      pt: 'O salário mínimo geral no Québec é de $15,75/h. Toda hora trabalhada além de 40h semanais deve ser paga com acréscimo de 50% (taxa e meia) por lei CNESST.',
      en: 'Quebec minimum wage is $15.75/hr. Any hours beyond 40 hrs/week must be paid at time-and-a-half (1.5×) by CNESST standards.',
      fr: 'Le salaire minimum au Québec est de 15,75 $/h. Toute heure au-delà de 40h/semaine est majorée de 50 % (temps et demi) selon la CNESST.',
    },
  },

  TOTAL_DEDUCTIONS: {
    id: 'TOTAL_DEDUCTIONS',
    title: {
      pt: 'Total de Retenções na Fonte (Deductions)',
      en: 'Total Payroll Deductions',
      fr: 'Total des retenues à la source',
    },
    subtitle: {
      pt: 'Soma de todos os impostos, contribuições previdenciárias e seguros',
      en: 'Sum of all government taxes, social dues, and private deductions',
      fr: 'Somme de tous les impôts, cotisations publiques et assurances',
    },
    origin: {
      pt: 'Revenu Québec, Agência de Renda do Canadá (ARC) & RH da Empresa',
      en: 'Revenu Québec, Canada Revenue Agency (CRA) & Company HR',
      fr: 'Revenu Québec, Agence du revenu du Canada (ARC) & RH employeur',
    },
    legalBasis: {
      pt: 'Loi sur les impôts (Québec), Loi de l\'impôt sur le revenu (Canada), RRQ & RQAP',
      en: 'Taxation Act (Quebec), Income Tax Act (Canada), QPP & QPIP',
      fr: 'Loi sur les impôts (Québec), Loi de l\'impôt sur le revenu (Canada), RRQ & RQAP',
    },
    formula: {
      pt: 'Imposto QC + Imposto Féd + RRQ + RQAP + AE + Seguro Médico/Vida + REER/Outros',
      en: 'QC Tax + Fed Tax + RRQ + RQAP + EI + Health/Life Insurance + Group RRSP/Other',
      fr: 'Impôt QC + Impôt Féd + RRQ + RQAP + AE + Assurances santé/vie + REER/Autres',
    },
    description: {
      pt: 'Compreende duas categorias: Retenções Legais Obrigatórias (Imposto Provincial, Federal, Previdência RRQ, Licença Parental RQAP e Seguro-Desemprego AE) e Retenções Voluntárias/Empresariais (Seguro coletivo, sindicato, cafeteira).',
      en: 'Comprises two main buckets: Statutory government deductions (Provincial Tax, Federal Tax, RRQ, RQAP, EI) and Non-statutory workplace deductions (Group health, dental, union, meals).',
      fr: 'Comprend deux volets : les retenues gouvernementales obligatoires (Impôts provincial et fédéral, RRQ, RQAP, AE) et les déductions d’entreprise (Assurances, syndicat, cafétéria).',
    },
  },

  EFFECTIVE_RATE: {
    id: 'EFFECTIVE_RATE',
    title: {
      pt: 'Taxa Efetiva de Retenção (%)',
      en: 'Effective Retention Rate (%)',
      fr: 'Taux effectif de retenue (%)',
    },
    subtitle: {
      pt: 'A porcentagem real do seu salário bruto que vai para impostos e benefícios',
      en: 'The actual percentage of gross pay withheld for taxes and benefits',
      fr: 'Le pourcentage réel de votre salaire brut prélevé en retenues',
    },
    origin: {
      pt: 'Indicador Estatístico Ponderado de Carga Tributária Real',
      en: 'Weighted Statistical Real Tax Burden Metric',
      fr: 'Indicateur pondéré de charge fiscale réelle',
    },
    legalBasis: {
      pt: 'Relação matemática: (Total de Retenções ÷ Salário Bruto) × 100',
      en: 'Mathematical ratio: (Total Deductions ÷ Gross Salary) × 100',
      fr: 'Ratio mathématique : (Total des retenues ÷ Salaire brut) × 100',
    },
    formula: {
      pt: '(Total de Retenções na Fonte ÷ Salário Bruto) × 100',
      en: '(Total Deductions ÷ Gross Pay) × 100',
      fr: '(Total des retenues ÷ Salaire brut) × 100',
    },
    description: {
      pt: 'Muitas pessoas confundem a "taxa marginal" (a faixa mais alta de imposto) com a "taxa efetiva". A taxa efetiva mostra o percentual real médio descontado de cada cheque. Devido às faixas progressivas e isenções básicas, ela é sempre muito inferior à taxa marginal!',
      en: 'Workers often confuse the marginal tax bracket with their effective rate. The effective rate measures actual total withholdings divided by gross pay. Because of personal tax exemptions and graduated brackets, your effective rate is much lower than the top marginal rate.',
      fr: 'La plupart des contribuables confondent le taux marginal (la tranche d’imposition maximale) et le taux effectif. Ce dernier représente le pourcentage réel moyen prélevé sur votre paie.',
    },
  },

  QC_TAX: {
    id: 'QC_TAX',
    title: {
      pt: 'Imposto de Renda do Québec (Provincial)',
      en: 'Quebec Provincial Income Tax',
      fr: 'Impôt provincial du Québec (Revenu Québec)',
    },
    subtitle: {
      pt: 'Retenção na fonte provincial para financiar saúde, educação e infraestrutura do Québec',
      en: 'Provincial income tax withholding supporting Quebec public services',
      fr: 'Retenue à la source finançant les services publics et la santé au Québec',
    },
    origin: {
      pt: 'Revenu Québec · Guia de Retenções na Fonte TP-1015.G & Formulário TP-1015.3',
      en: 'Revenu Québec · Source Deductions Guide TP-1015.G & Form TP-1015.3',
      fr: 'Revenu Québec · Guide des retenues TP-1015.G & Formulaire TP-1015.3',
    },
    legalBasis: {
      pt: 'Loi sur les impôts du Québec (RLRQ, c. I-3) art. 750 & Barèmes 2025/2026',
      en: 'Quebec Taxation Act (CQLR c. I-3) s. 750 & 2025/2026 Brackets',
      fr: 'Loi sur les impôts du Québec (RLRQ, c. I-3) art. 750 & Barèmes 2025/2026',
    },
    formula: {
      pt: 'Faixas progressivas (14% a 25,75%) aplicadas à Renda Líquida - Dedução de Trabalhador (6%, máx $1.380) - Crédito Pessoal Básico ($18.056 × 14% = $2.527,84/ano)',
      en: 'Progressive brackets (14% to 25.75%) on Net Income - Worker Deduction (6%, max $1,380) - Basic Personal Amount ($18,056 × 14% = $2,527.84/yr)',
      fr: 'Barèmes progressifs (14 % à 25,75 %) sur le revenu imposable - Déduction pour travailleur (6 %, max 1 380 $) - Crédit personnel de base (18 056 $ × 14 % = 2 527,84 $/an)',
    },
    description: {
      pt: 'O Québec é a única província canadense com sistema de declaração de imposto de renda e retenção totalmente autônomo do governo federal. As primeiras parcelas de renda são tributadas a 14% (até $51.780/ano), e você tem direito a uma isenção pessoal básica de $18.056 que não paga nada de imposto.',
      en: 'Quebec is the only Canadian province that collects its own personal income taxes directly. The first tax bracket is 14% (up to $51,780/yr) with a basic personal exemption of $18,056.',
      fr: 'Le Québec est la seule province canadienne à percevoir ses propres impôts sur le revenu de façon autonome. La première tranche est imposée à 14 % (jusqu’à 51 780 $/an) avec un montant personnel de base de 18 056 $.',
    },
    exemptionsAndCredits: {
      pt: 'Inclui automaticamente a Déduction pour travailleur de 6% (máximo $1.380) e o crédito pessoal de $18.056 convertidos proporcionalmente ao período da sua folha.',
      en: 'Includes the automatic 6% Worker Deduction (up to $1,380) and basic personal credit prorated per pay period.',
      fr: 'Comprend la déduction pour travailleur de 6 % (max. 1 380 $) et le crédit personnel de 18 056 $ calculés au prorata de la période de paie.',
    },
  },

  FED_TAX: {
    id: 'FED_TAX',
    title: {
      pt: 'Imposto Federal do Canadá (ARC / CRA)',
      en: 'Canada Federal Income Tax',
      fr: 'Impôt fédéral du Canada (CRA / ARC)',
    },
    subtitle: {
      pt: 'Retenção na fonte federal com desconto especial de 16,5% do Abatimento do Québec',
      en: 'Federal income tax withholding with 16.5% Quebec Abatement reduction',
      fr: 'Retenue fiscale fédérale intégrant l’abattement remboursable du Québec de 16,5 %',
    },
    origin: {
      pt: 'Agence du revenu du Canada (ARC / CRA) · Fórmulas de Retenção na Fonte T4127',
      en: 'Canada Revenue Agency (CRA) · Payroll Deductions Formulas T4127',
      fr: 'Agence du revenu du Canada (ARC) · Formules pour le calcul des retenues T4127',
    },
    legalBasis: {
      pt: 'Loi de l\'impôt sur le revenu du Canada art. 120(2) (Abattement du Québec de 16,5%)',
      en: 'Canadian Income Tax Act s. 120(2) (16.5% Quebec Abatement)',
      fr: 'Loi de l\'impôt sur le revenu du Canada art. 120(2) (Abattement remboursable du Québec de 16,5 %)',
    },
    formula: {
      pt: '[Faixas Federais (15% a 33%) - Crédito Básico ($15.705 × 15%) - Crédito Canada Emploi ($1.433 × 15%)] × 0,835 (Desconto de 16,5%)',
      en: '[Federal Brackets (15% to 33%) - Basic Credit ($15,705 × 15%) - Canada Employment Credit ($1,433 × 15%)] × 0.835 (16.5% Quebec Abatement)',
      fr: '[Taux fédéraux (15 % à 33 %) - Crédit de base (15 705 $ × 15 %) - Montant canadien pour emploi (1 433 $ × 15 %)] × 0,835 (Abattement 16,5 %)',
    },
    description: {
      pt: 'O governo federal do Canadá cobra imposto sobre a renda de todos os canadenses, MAS quem mora no Québec tem um desconto automático legal de 16,5% no imposto federal! Isso ocorre porque o Québec opera seus próprios programas sociais (como o RQAP e o RRQ).',
      en: 'Federal income tax is levied nationwide, but Quebec residents receive an exclusive 16.5% Quebec Abatement reduction because Quebec funds its own pension and parental insurance regimes.',
      fr: 'L’impôt fédéral est perçu dans tout le Canada, mais les résidents québécois bénéficient d’une réduction automatique exclusive de 16,5 % (Abattement du Québec) car la province gère elle-même son régime de rentes et de congés parentaux.',
    },
    exemptionsAndCredits: {
      pt: 'Isenção pessoal federal de $15.705/ano + Crédito Canadense de Emprego de até $1.433/ano.',
      en: 'Basic personal amount of $15,705/yr + Canada Employment Amount up to $1,433/yr.',
      fr: 'Montant personnel de base de 15 705 $/an + montant canadien pour emploi de 1 433 $/an.',
    },
  },

  RRQ: {
    id: 'RRQ',
    title: {
      pt: 'RRQ - Regime de Aposentadoria do Québec',
      en: 'QPP / RRQ - Quebec Pension Plan',
      fr: 'RRQ - Régime de rentes du Québec (Retraite Québec)',
    },
    subtitle: {
      pt: 'Sua contribuição previdenciária pública para garantir renda de aposentadoria e invalidez',
      en: 'Public pension contribution securing retirement and disability pension',
      fr: 'Cotisation obligatoire assurant votre rente de retraite et d’invalidité',
    },
    origin: {
      pt: 'Retraite Québec & Revenu Québec (Equivalente ao CPP/INSS)',
      en: 'Retraite Québec & Revenu Québec (Quebec equivalent of CPP)',
      fr: 'Retraite Québec & Revenu Québec (Équivalent québécois du RPC)',
    },
    legalBasis: {
      pt: 'Loi sur le régime de rentes du Québec (RLRQ, c. R-9) & Barèmes 2025/2026',
      en: 'Act Respecting the Quebec Pension Plan (CQLR c. R-9)',
      fr: 'Loi sur le régime de rentes du Québec (RLRQ, c. R-9)',
    },
    formula: {
      pt: '6,40% sobre os ganhos entre a isenção básica ($3.500/ano ou $134,62/quinzena) e o teto máximo MGA ($71.300/ano ou $2.742,31/quinzena)',
      en: '6.40% on pensionable earnings between base exemption ($3,500/yr or $134.62/biweekly) and maximum MGA ceiling ($71,300/yr)',
      fr: '6,40 % sur les gains compris entre l’exemption de base (3 500 $/an soit 134,62 $/quinzaine) et le MGA plafond (71 300 $/an)',
    },
    description: {
      pt: 'O RRQ substitui o CPP (Canada Pension Plan) para todos os que trabalham no Québec. Os primeiros $3.500 que você ganha no ano são totalmente isentos de desconto (isenção básica de $134,62 por quinzena).',
      en: 'The QPP replaces the Canada Pension Plan (CPP) for all workers in Quebec. The first $3,500 of annual earnings ($134.62 per biweekly pay) is completely exempt from contributions.',
      fr: 'Le RRQ remplace le RPC pour tous les travailleurs du Québec. Une exemption de base de 3 500 $/an (134,62 $/quinzaine) n’est pas cotisée.',
    },
    employerShare: {
      pt: '🤝 O seu empregador paga exatamente a mesma quantia que você (1:1 / 100% match obrigatório por lei!). Para cada $100 descontados de você, a empresa deposita outros $100 na sua conta de aposentadoria no Retraite Québec.',
      en: '🤝 Your employer matches your contribution dollar-for-dollar (1:1 / 100% match mandated by law!). For every $100 deducted from you, your employer deposits another $100 into your pension account.',
      fr: '🤝 Votre employeur verse exactement la même somme que vous (part patronale égale à 100 %). Pour chaque 100 $ déduit de votre paie, l’employeur verse 100 $ additionnels à Retraite Québec.',
    },
    exemptionsAndCredits: {
      pt: 'Isenção de base anual: $3.500. Teto máximo de contribuição do empregado em 2025: $4.339,20/ano.',
      en: 'Annual base exemption: $3,500. Max employee contribution in 2025: $4,339.20/yr.',
      fr: 'Exemption de base annuelle : 3 500 $. Cotisation maximale de l’employé en 2025 : 4 339,20 $/an.',
    },
  },

  RQAP: {
    id: 'RQAP',
    title: {
      pt: 'RQAP - Regime de Seguro Parental do Québec',
      en: 'QPIP / RQAP - Quebec Parental Insurance Plan',
      fr: 'RQAP - Régime québécois d\'assurance parentale',
    },
    subtitle: {
      pt: 'Garante salário integral ou parcial durante licença-maternidade, paternidade e adoção',
      en: 'Funds paid maternity, paternity, and adoption leave in Quebec',
      fr: 'Finance les prestations lors de congés de maternité, paternité ou adoption',
    },
    origin: {
      pt: 'Conseil de gestion du régime d\'assurance parentale & Revenu Québec',
      en: 'Quebec Parental Insurance Board & Revenu Québec',
      fr: 'Conseil de gestion du régime d\'assurance parentale & Revenu Québec',
    },
    legalBasis: {
      pt: 'Loi sur l\'assurance parentale (RLRQ, c. A-29.011)',
      en: 'Act Respecting Parental Insurance (CQLR c. A-29.011)',
      fr: 'Loi sur l\'assurance parentale (RLRQ, c. A-29.011)',
    },
    formula: {
      pt: '0,494% sobre o total dos ganhos brutos tributáveis até o teto anual de $94.000',
      en: '0.494% on gross insurable earnings up to the annual ceiling of $94,000',
      fr: '0,494 % sur les gains assurables jusqu’au maximum assurable de 94 000 $',
    },
    description: {
      pt: 'Criado com exclusividade pelo Québec, o RQAP oferece a licença parental mais generosa de toda a América do Norte (até 55 semanas combinadas para os pais com reposição de até 75% do salário). Todos os trabalhadores com carteira assinada contribuem com essa pequena alíquota de menos de meio por cento.',
      en: 'Unique to Quebec, the QPIP provides North America’s most generous paid parental leave (up to 55 combined weeks with up to 75% wage replacement). Workers pay a very low rate of under half a percent.',
      fr: 'Propre au Québec, le RQAP offre le régime de congés parentaux le plus généreux d’Amérique du Nord (jusqu’à 55 semaines avec remplacement de salaire jusqu’à 75 %). La cotisation est de moins de 0,5 %.',
    },
    employerShare: {
      pt: '🏢 O seu empregador paga uma taxa 40% maior que a sua (0,692% contra os seus 0,494%), arcando com a maior parte do financiamento das licenças familiares.',
      en: '🏢 Your employer pays a 40% higher contribution rate than you (0.692% vs your 0.494%), bearing the larger share of the fund.',
      fr: '🏢 Votre employeur paie un taux 40 % plus élevé que vous (0,692 % contre 0,494 % pour l’employé).',
    },
  },

  AE: {
    id: 'AE',
    title: {
      pt: 'AE - Seguro-Desemprego (Assurance-Emploi)',
      en: 'EI - Employment Insurance',
      fr: 'AE - Assurance-Emploi (Fédéral)',
    },
    subtitle: {
      pt: 'Proteção temporária de renda em caso de demissão sem justa causa ou doença',
      en: 'Temporary income support during unexpected layoffs or sickness',
      fr: 'Protection temporaire du revenu en cas de perte involontaire d’emploi ou maladie',
    },
    origin: {
      pt: 'Emploi et Développement social Canada (EDSC / ESDC) & Service Canada',
      en: 'Employment and Social Development Canada (ESDC) & Service Canada',
      fr: 'Emploi et Développement social Canada (EDSC) & Service Canada',
    },
    legalBasis: {
      pt: 'Loi sur l\'assurance-emploi du Canada (Taux réduit spécifique au Québec : 1,32%)',
      en: 'Canadian Employment Insurance Act (Quebec Reduced Rate: 1.32%)',
      fr: 'Loi sur l\'assurance-emploi du Canada (Taux réduit québécois : 1,32 %)',
    },
    formula: {
      pt: '1,32% sobre os ganhos seguráveis até o teto anual de $65.700 (Taxa do Québec é menor que o resto do Canadá: 1,32% vs 1,66%)',
      en: '1.32% on insurable earnings up to $65,700 ceiling (Quebec rate is lower: 1.32% vs 1.66% in other provinces)',
      fr: '1,32 % sur le salaire assurable jusqu’au maximum de 65 700 $ (taux québécois réduit de 1,32 % contre 1,66 % ailleurs)',
    },
    description: {
      pt: 'Garante o pagamento de 55% do seu salário médio (até o teto legal de cerca de $695/semana) caso você perca o emprego sem justa causa, adoeça ou precise cuidar de parente gravemente enfermo. O Québec paga uma taxa menor (1,32% em vez de 1,66%) porque a licença-maternidade é paga pelo RQAP e não pela AE.',
      en: 'Provides 55% of average earnings (up to statutory weekly cap) if you are laid off. Quebec employees pay a discounted 1.32% rate (compared to 1.66% in other provinces) because maternity benefits are carved out into RQAP.',
      fr: 'Garantit le versement de 55 % du salaire moyen en cas de mise à pied ou arrêt maladie. Le taux québécois est réduit à 1,32 % (au lieu de 1,66 %) en raison du volet RQAP autonome.',
    },
    employerShare: {
      pt: '💼 O empregador paga 1,4 vezes a sua taxa (1,848% do seu salário bruto), arcando com quase 60% do custo total do seguro-desemprego.',
      en: '💼 The employer pays 1.4× the employee rate (1.848% of gross wages), covering the majority of the program.',
      fr: '💼 L’employeur paie 1,4 fois le taux employé (soit 1,848 % du salaire brut).',
    },
  },

  ASSUR_COLL: {
    id: 'ASSUR_COLL',
    title: {
      pt: 'Seguro Coletivo de Saúde & Vida (Assurance collective)',
      en: 'Group Health, Life & Dental Insurance',
      fr: 'Assurance collective (Médicale, Vie, Invalidité)',
    },
    subtitle: {
      pt: 'Plano de saúde privado da empresa para medicamentos, dentista, óculos e invalidez',
      en: 'Private workplace plan covering prescription drugs, dental, and disability',
      fr: 'Régime d’assurance de l’employeur couvrant médicaments, dentaire et salaire',
    },
    origin: {
      pt: 'Seguradora Privada da Empresa (ex: Desjardins, Manuvie, Sun Life, Beneva)',
      en: 'Company Private Insurer (e.g. Desjardins, Manulife, Sun Life, Beneva)',
      fr: 'Assureur privé de l’employeur (ex. Desjardins, Manuvie, Beneva, Sun Life)',
    },
    legalBasis: {
      pt: 'Loi sur l\'assurance-médicaments du Québec (Adhésion obligatoire si offerte par l\'employeur)',
      en: 'Quebec Act Respecting Prescription Drug Insurance (Mandatory enrollment if employer offers a plan)',
      fr: 'Loi sur l\'assurance-médicaments du Québec (Adhésion obligatoire si offerte par l’employeur)',
    },
    formula: {
      pt: 'Prêmio fixo da apólice descontado por quinzena (ex: $74,28 médica + $16,30 vida/acidente/invalidez)',
      en: 'Fixed premium per pay period (e.g. $74.28 medical + $16.30 life/accident/disability)',
      fr: 'Prime fixe par paie (ex. 74,28 $ médical + 16,30 $ vie/accident)',
    },
    description: {
      pt: 'No Québec, a lei exige que se o seu empregador oferecer um plano coletivo de saúde com cobertura de remédios, você DEVE aderir obrigatoriamente (a menos que já esteja coberto pelo plano do seu cônjuge). Ele cobre receitas médicas, fisioterapia, massoterapia, psicólogo e seguros de vida.',
      en: 'Under Quebec law, if your employer offers a private health plan that covers prescription drugs, you are legally required to join (unless covered under a spouse’s plan).',
      fr: 'Au Québec, la Loi sur l’assurance-médicaments rend l’adhésion obligatoire pour tous les employés admissibles si l’employeur propose un régime privé (sauf couverture par un conjoint).',
    },
    exemptionsAndCredits: {
      pt: 'Atenção aos Avantages Imposables (Case J): No Québec, a parcela que o empregador paga pelo seu seguro médico é considerada benefício tributável provincial e entra no Relevé 1.',
      en: 'Taxable benefit note (Box J): In Quebec, the employer-paid portion of health insurance is treated as provincial taxable income on Box J of RL-1.',
      fr: 'Particularité québécoise (Case J) : La part de l’assurance santé payée par l’employeur constitue un avantage imposable provincial inscrit à la Case J du Relevé 1.',
    },
  },

  REER_SYND: {
    id: 'REER_SYND',
    title: {
      pt: 'Previdência REER Coletivo / Contribuição Sindical',
      en: 'Group RRSP / Union Dues',
      fr: 'REER collectif / Cotisation syndicale',
    },
    subtitle: {
      pt: 'Poupança para aposentadoria ou taxa de representação do sindicato',
      en: 'Retirement savings or union bargaining representation fees',
      fr: 'Épargne retraite déductible d’impôt ou cotisation de convention syndicale',
    },
    origin: {
      pt: 'Acordo Coletivo de Trabalho ou Fundo de Pensão da Empresa',
      en: 'Collective Bargaining Agreement or Company Pension Fund',
      fr: 'Convention collective ou régime d’épargne retraite d’entreprise',
    },
    legalBasis: {
      pt: 'Loi de l\'impôt sur le revenu art. 146 (REER) & Code du travail du Québec (Formule Rand)',
      en: 'Income Tax Act s. 146 (RRSP) & Quebec Labour Code (Rand Formula)',
      fr: 'Loi de l\'impôt sur le revenu art. 146 (REER) & Code du travail du Québec',
    },
    formula: {
      pt: 'Porcentagem do salário bruto (ex: 2% a 5%) ou montante fixo em dólares por folha',
      en: 'Percentage of gross pay (e.g. 2% to 5%) or fixed dollar amount per pay',
      fr: 'Pourcentage du brut (ex. 2 % à 5 %) ou montant fixe déduit à la source',
    },
    description: {
      pt: 'As contribuições para REER Coletivo reduzem seu imposto de renda imediatamente na própria folha de pagamento! Já a contribuição sindical (Cotisation syndicale) garante a representação e defesa da convenção de trabalho.',
      en: 'Group RRSP deductions reduce your taxable income immediately on your paycheck! Union dues are also tax-deductible on your annual tax return.',
      fr: 'Les cotisations au REER collectif réduisent immédiatement l’impôt prélevé à la source sur le talon de paie. Les cotisations syndicales sont également déductibles.',
    },
  },

  DIVERS: {
    id: 'DIVERS',
    title: {
      pt: 'Refeições de Cafeteira, Uniformes & Outros',
      en: 'Cafeteria, Store & Miscellaneous Deductions',
      fr: 'Cafétéria, achats magasin & déductions diverses',
    },
    subtitle: {
      pt: 'Descontos internos acordados diretamente com a empresa',
      en: 'Workplace purchases deducted directly from payroll',
      fr: 'Frais de repas ou achats d’usine déduits avec autorisation écrite',
    },
    origin: {
      pt: 'Serviço de Alimentação da Fábrica / Contabilidade Interna',
      en: 'Factory Food Service / Internal Accounting',
      fr: 'Service de restauration / Magasin d’usine de l’entreprise',
    },
    legalBasis: {
      pt: 'Loi sur les normes du travail (LNT) art. 49 (Autorização expressa e por escrito do empregado)',
      en: 'Act Respecting Labour Standards s. 49 (Written authorization requirement)',
      fr: 'Loi sur les normes du travail (LNT) art. 49 (Autorisation écrite obligatoire de l’employé)',
    },
    formula: {
      pt: 'Preço unitário dos itens adquiridos (ex: 3 refeições a $3,00 = $9,00/quinzena)',
      en: 'Unit price of acquired items (e.g. 3 meals at $3.00 = $9.00/biweekly)',
      fr: 'Coût unitaire des articles ou repas (ex. 3 repas à 3,00 $ = 9,00 $/quinzaine)',
    },
    description: {
      pt: 'Pela legislação do Québec, o empregador não pode efetuar NENHUM desconto diverso sem o seu consentimento explícito por escrito assinado. Comum em fábricas alimentícias e grandes indústrias com refeitório subsidiado.',
      en: 'Under Quebec labour standards, employers cannot make non-statutory deductions without the employee’s express written permission. Common in manufacturing and food facilities with subsidized dining.',
      fr: 'En vertu de l’article 49 de la LNT, l’employeur ne peut effectuer aucune retenue sur le salaire sans le consentement écrit de l’employé. Très courant pour les repas subventionnés en usine.',
    },
  },

  VACATION_4_6: {
    id: 'VACATION_4_6',
    title: {
      pt: 'Indenização de Férias do Québec (4% ou 6%)',
      en: 'Quebec Annual Vacation Pay (4% or 6%)',
      fr: 'Indemnité de congé annuel (4 % ou 6 % CNESST)',
    },
    subtitle: {
      pt: 'Direito legal a férias remuneradas conforme seu tempo de serviço na empresa',
      en: 'Statutory paid leave entitlement based on continuous years of service',
      fr: 'Droit légal à des vacances payées selon votre ancienneté dans l’entreprise',
    },
    origin: {
      pt: 'CNESST (Commission des normes, de l\'équité, de la santé et de la sécurité du travail)',
      en: 'CNESST (Quebec Labour Standards Board)',
      fr: 'CNESST (Commission des normes du travail du Québec)',
    },
    legalBasis: {
      pt: 'Loi sur les normes du travail (RLRQ, c. N-1.1) art. 66 à 77',
      en: 'Act Respecting Labour Standards (CQLR c. N-1.1) ss. 66 to 77',
      fr: 'Loi sur les normes du travail (RLRQ, c. N-1.1) art. 66 à 77',
    },
    formula: {
      pt: 'Menos de 3 anos de serviço = 4% dos ganhos brutos (2 semanas). A partir de 3 anos = 6% dos ganhos brutos (3 semanas).',
      en: 'Under 3 years of service = 4% of gross earnings (2 weeks). 3+ years of continuous service = 6% of gross earnings (3 weeks).',
      fr: 'Moins de 3 ans de service continu = 4 % du salaire brut (2 semaines). 3 ans et plus = 6 % du salaire brut (3 semaines payées).',
    },
    description: {
      pt: 'No Québec, a indenização de férias acumula a cada hora que você trabalha. Muitas empresas pagam isso em um montante no início do verão (juin/juillet), em cada contracheque ou quando você tira os dias de folga.',
      en: 'In Quebec, vacation pay accrues on every dollar of gross earnings. Employers disburse it upon taking annual leave or in a lump sum each summer.',
      fr: 'L’indemnité de vacances s’accumule sur chaque paie tout au long de l’année de référence (du 1er mai au 30 avril).',
    },
  },

  HOLIDAYS_1_20: {
    id: 'HOLIDAYS_1_20',
    title: {
      pt: 'Feriados Estatutários - Regra de 1/20 da CNESST',
      en: 'Quebec Statutory Holidays - 1/20 CNESST Rule',
      fr: 'Fériés chômés et payés - Règle du 1/20 de la CNESST',
    },
    subtitle: {
      pt: 'Fórmula legal para cálculo do pagamento dos 8 feriados oficiais do Québec',
      en: 'Legal formula for Quebec’s 8 statutory paid holidays',
      fr: 'Formule légale pour le paiement des 8 jours fériés légaux au Québec',
    },
    origin: {
      pt: 'CNESST & Loi sur les normes du travail',
      en: 'CNESST & Act Respecting Labour Standards',
      fr: 'CNESST & Loi sur les normes du travail',
    },
    legalBasis: {
      pt: 'Loi sur les normes du travail (RLRQ, c. N-1.1) art. 60 à 65',
      en: 'Act Respecting Labour Standards ss. 60 to 65',
      fr: 'Loi sur les normes du travail (RLRQ, c. N-1.1) art. 60 à 65',
    },
    formula: {
      pt: 'Indenização = 1/20 (5%) do salário bruto acumulado nas 4 semanas completas anteriores ao feriado',
      en: 'Holiday Pay = 1/20th (5%) of total gross earnings in the 4 full workweeks preceding the holiday',
      fr: 'Indemnité de férié = 1/20 (5 %) du salaire brut gagné au cours des 4 semaines complètes de paie précédant le congé',
    },
    description: {
      pt: 'No Québec, existem 8 feriados oficiais pagos (1º de janeiro, Sexta-feira Santa ou Páscoa, Journée des Patriotes em maio, Fête nationale do Québec em 24 de junho, Festa do Canadá em 1º de julho, Dia do Trabalho em setembro, Ação de Graças em outubro e Natal em 25 de dezembro). Quem trabalha em horário integral (40h/sem) recebe exatamente o valor de um dia normal de 8 horas.',
      en: 'Quebec mandates 8 statutory paid holidays per year. The 1/20 calculation ensures part-time and full-time workers receive proportional pay for the day off.',
      fr: 'Il existe 8 jours fériés prévus par la loi au Québec. Le calcul au 1/20 assure que le travailleur reçoive l’équivalent exact d’une journée de travail normale.',
    },
  },
};

/**
 * Generates tailored mathematical breakdown steps for the user's current numbers
 */
export function getTailoredBreakdown(
  id: string,
  calc: CalculationResult,
  period: PeriodResult,
  lang: Language
): { label: string; value: string; note?: string }[] {
  const locale = lang === 'pt' ? 'pt-BR' : lang === 'en' ? 'en-CA' : 'fr-CA';
  const steps: { label: string; value: string; note?: string }[] = [];

  switch (id) {
    case 'NET_PAY':
      steps.push({
        label: lang === 'pt' ? '1. Salário Bruto do Período' : lang === 'en' ? '1. Gross Pay' : '1. Salaire brut',
        value: `+ ${formatCurrency(period.gross, locale)}`,
        note: `${calc.totalHoursPerWeek * (52 / (period.periodsPerYear || 26))}h no total`,
      });
      if (period.provincialTax > 0) {
        steps.push({
          label: lang === 'pt' ? '2. (-) Imposto Revenu Québec' : lang === 'en' ? '2. (-) Quebec Tax' : '2. (-) Impôt Revenu Québec',
          value: `- ${formatCurrency(period.provincialTax, locale)}`,
          note: `${((period.provincialTax / period.gross) * 100).toFixed(1)}% do bruto`,
        });
      }
      if (period.federalTax > 0) {
        steps.push({
          label: lang === 'pt' ? '3. (-) Imposto Federal ARC/CRA' : lang === 'en' ? '3. (-) Canada Federal Tax' : '3. (-) Impôt fédéral ARC',
          value: `- ${formatCurrency(period.federalTax, locale)}`,
          note: `${((period.federalTax / period.gross) * 100).toFixed(1)}% do bruto`,
        });
      }
      steps.push({
        label: lang === 'pt' ? '4. (-) Previdência RRQ' : lang === 'en' ? '4. (-) QPP / RRQ Pension' : '4. (-) Régime des rentes RRQ',
        value: `- ${formatCurrency(period.rrq, locale)}`,
        note: '6,40% após isenção',
      });
      steps.push({
        label: lang === 'pt' ? '5. (-) Licença Parental RQAP' : lang === 'en' ? '5. (-) QPIP / RQAP Parental' : '5. (-) Assurance parentale RQAP',
        value: `- ${formatCurrency(period.rqap, locale)}`,
        note: '0,494%',
      });
      steps.push({
        label: lang === 'pt' ? '6. (-) Seguro-Desemprego AE' : lang === 'en' ? '6. (-) Employment Insurance AE' : '6. (-) Assurance-emploi AE',
        value: `- ${formatCurrency(period.ae, locale)}`,
        note: '1,32% (Taxa QC)',
      });
      if (period.groupInsurance > 0) {
        steps.push({
          label: lang === 'pt' ? '7. (-) Seguro Saúde/Vida Coletivo' : lang === 'en' ? '7. (-) Group Health/Life' : '7. (-) Assurance collective',
          value: `- ${formatCurrency(period.groupInsurance, locale)}`,
        });
      }
      if (period.otherDeductions > 0 || period.retirementAndUnion > 0) {
        steps.push({
          label: lang === 'pt' ? '8. (-) Cafeteria / REER / Outros' : lang === 'en' ? '8. (-) Meals / RRSP / Other' : '8. (-) Cafétéria & REER',
          value: `- ${formatCurrency(period.otherDeductions + period.retirementAndUnion, locale)}`,
        });
      }
      steps.push({
        label: lang === 'pt' ? '👉 TOTAL LÍQUIDO NO BOLSO' : lang === 'en' ? '👉 TOTAL NET TAKE-HOME' : '👉 NET FINAL EN POCHE',
        value: formatCurrency(period.net, locale),
        note: `${((period.net / period.gross) * 100).toFixed(1)}% retido para você`,
      });
      break;

    case 'GROSS_PAY':
      steps.push({
        label: lang === 'pt' ? 'Taxa horária base' : lang === 'en' ? 'Base hourly rate' : 'Taux horaire de base',
        value: `$${calc.input.hourlyRate.toFixed(2)}/h`,
      });
      steps.push({
        label: lang === 'pt' ? 'Horas normais no período' : lang === 'en' ? 'Regular hours in period' : 'Heures normales période',
        value: `${calc.input.regularHoursPerWeek * (52 / (period.periodsPerYear || 26))}h`,
        note: `Base de ${calc.input.regularHoursPerWeek}h/semana`,
      });
      if (calc.input.shiftPremiumAmount > 0) {
        steps.push({
          label: lang === 'pt' ? 'Prêmio de turno / Prime' : lang === 'en' ? 'Shift premium' : 'Prime de quart',
          value: `+ $${calc.input.shiftPremiumAmount.toFixed(2)}`,
        });
      }
      if (calc.input.overtime15HoursPerWeek > 0 || calc.input.overtime20HoursPerWeek > 0) {
        steps.push({
          label: lang === 'pt' ? 'Horas extras remuneradas' : lang === 'en' ? 'Paid overtime' : 'Heures sup majorées',
          value: `${(calc.input.overtime15HoursPerWeek + calc.input.overtime20HoursPerWeek) * (52 / (period.periodsPerYear || 26))}h`,
          note: 'Pagas com adicional de 50% ou 100%',
        });
      }
      steps.push({
        label: lang === 'pt' ? 'Total Bruto do Período' : lang === 'en' ? 'Total Period Gross' : 'Total brut de la période',
        value: formatCurrency(period.gross, locale),
      });
      break;

    case 'TOTAL_DEDUCTIONS':
      steps.push({
        label: lang === 'pt' ? 'Retenções do Governo (Fisco + Seguros)' : lang === 'en' ? 'Statutory government taxes' : 'Retenues fiscales et sociales',
        value: formatCurrency(period.totalStatutoryDeductions, locale),
        note: `${((period.totalStatutoryDeductions / period.gross) * 100).toFixed(1)}% do bruto`,
      });
      steps.push({
        label: lang === 'pt' ? 'Retenções de Empresa (Seguros/Refeições)' : lang === 'en' ? 'Workplace private deductions' : 'Assurances & déductions privées',
        value: formatCurrency(period.totalNonStatutoryDeductions, locale),
        note: `${((period.totalNonStatutoryDeductions / period.gross) * 100).toFixed(1)}% do bruto`,
      });
      steps.push({
        label: lang === 'pt' ? 'Total Global de Deduções' : lang === 'en' ? 'Total Deductions' : 'Total des retenues',
        value: `- ${formatCurrency(period.totalDeductions, locale)}`,
        note: `Alíquota efetiva de ${period.effectiveTaxRate.toFixed(1)}%`,
      });
      break;

    case 'EFFECTIVE_RATE':
      steps.push({
        label: lang === 'pt' ? 'Total descontado' : lang === 'en' ? 'Total deducted' : 'Total déduit',
        value: formatCurrency(period.totalDeductions, locale),
      });
      steps.push({
        label: lang === 'pt' ? 'Salário bruto total' : lang === 'en' ? 'Total gross salary' : 'Salaire brut total',
        value: formatCurrency(period.gross, locale),
      });
      steps.push({
        label: lang === 'pt' ? 'Taxa Efetiva de Retenção' : lang === 'en' ? 'Effective Retention Rate' : 'Taux effectif de retenue',
        value: `${period.effectiveTaxRate.toFixed(1)}%`,
        note: `Você fica com ${(100 - period.effectiveTaxRate).toFixed(1)}% no bolso`,
      });
      steps.push({
        label: lang === 'pt' ? 'Taxa Marginal (sobre próximo $ ganho)' : lang === 'en' ? 'Marginal rate (on next $ earned)' : 'Taux marginal d’imposition',
        value: `${calc.marginalTaxRate.toFixed(1)}%`,
        note: 'Aplicável apenas sobre aumentos salariais adicionais',
      });
      break;

    case 'QC_TAX':
      steps.push({
        label: lang === 'pt' ? 'Salário Tributável Anual projetado' : lang === 'en' ? 'Projected Annual Taxable' : 'Revenu imposable annuel',
        value: formatCurrency(calc.annualGross + (calc.input.employerTaxableBenefits || 0) * 26, locale),
      });
      steps.push({
        label: lang === 'pt' ? 'Crédito Pessoal Básico Québec (2025/2026)' : lang === 'en' ? 'Quebec Basic Personal Credit' : 'Crédit personnel de base QC',
        value: '$18 056 (14% = $2 527,84)',
      });
      steps.push({
        label: lang === 'pt' ? 'Retenção por este período' : lang === 'en' ? 'Withholding for this period' : 'Retenue pour cette paie',
        value: `- ${formatCurrency(period.provincialTax, locale)}`,
        note: `${((period.provincialTax / period.gross) * 100).toFixed(1)}% do salário`,
      });
      break;

    case 'FED_TAX':
      steps.push({
        label: lang === 'pt' ? 'Salário Tributável Federal anual' : lang === 'en' ? 'Federal Annual Taxable' : 'Revenu imposable fédéral',
        value: formatCurrency(calc.annualGross, locale),
      });
      steps.push({
        label: lang === 'pt' ? 'Isenção pessoal básica ARC' : lang === 'en' ? 'CRA Basic personal amount' : 'Montant personnel de base ARC',
        value: '$15 705 / ano',
      });
      steps.push({
        label: lang === 'pt' ? 'Abatimento do Québec de 16,5%' : lang === 'en' ? '16.5% Quebec Abatement' : 'Abattement du Québec de 16,5 %',
        value: '- 16,5% de desconto automático',
        note: 'Redução concedida apenas aos residentes do Québec',
      });
      steps.push({
        label: lang === 'pt' ? 'Retenção por este período' : lang === 'en' ? 'Withholding for this period' : 'Retenue pour cette paie',
        value: `- ${formatCurrency(period.federalTax, locale)}`,
        note: `${((period.federalTax / period.gross) * 100).toFixed(1)}% do salário`,
      });
      break;

    case 'RRQ':
      const periodsPerYear = period.periodsPerYear || 26;
      const periodExemption = 3500 / periodsPerYear;
      steps.push({
        label: lang === 'pt' ? 'Salário bruto no período' : lang === 'en' ? 'Gross pay this period' : 'Salaire brut de la période',
        value: formatCurrency(period.gross, locale),
      });
      steps.push({
        label: lang === 'pt' ? 'Isenção básica não-tributada' : lang === 'en' ? 'Basic period exemption' : 'Exemption de base de la paie',
        value: `- ${formatCurrency(periodExemption, locale)}`,
        note: '$3 500 / ano dividido pelo número de pagamentos',
      });
      steps.push({
        label: lang === 'pt' ? 'Alíquota da Previdência RRQ' : lang === 'en' ? 'QPP / RRQ Rate' : 'Taux de cotisation RRQ',
        value: '6,40%',
      });
      steps.push({
        label: lang === 'pt' ? 'Sua Contribuição (Desconto na folha)' : lang === 'en' ? 'Your contribution (deduction)' : 'Votre cotisation (retenue)',
        value: `- ${formatCurrency(period.rrq, locale)}`,
      });
      steps.push({
        label: lang === 'pt' ? '🤝 Parcela paga pela Empresa (Patronale)' : lang === 'en' ? '🤝 Employer match contribution' : '🤝 Part payée par votre employeur',
        value: `+ ${formatCurrency(period.rrq, locale)}`,
        note: 'A empresa deposita exatamente a mesma quantia para você!',
      });
      break;

    case 'RQAP':
      steps.push({
        label: lang === 'pt' ? 'Base de cálculo segurável' : lang === 'en' ? 'Insurable earnings' : 'Gains assurables',
        value: formatCurrency(period.gross, locale),
      });
      steps.push({
        label: lang === 'pt' ? 'Alíquota do Empregado (RQAP)' : lang === 'en' ? 'Employee RQAP Rate' : 'Taux employé RQAP',
        value: '0,494%',
      });
      steps.push({
        label: lang === 'pt' ? 'Desconto no seu contracheque' : lang === 'en' ? 'Your paycheck deduction' : 'Retenue sur votre paie',
        value: `- ${formatCurrency(period.rqap, locale)}`,
      });
      steps.push({
        label: lang === 'pt' ? '🏢 Contribuição da Empresa' : lang === 'en' ? '🏢 Employer contribution' : '🏢 Part employeur',
        value: `${formatCurrency(period.gross * 0.00692, locale)} (0,692%)`,
        note: 'O patrão paga 40% a mais que você nesta licença',
      });
      break;

    case 'AE':
      steps.push({
        label: lang === 'pt' ? 'Ganhos seguráveis' : lang === 'en' ? 'Insurable earnings' : 'Gains assurables',
        value: formatCurrency(period.gross, locale),
      });
      steps.push({
        label: lang === 'pt' ? 'Alíquota do Québec (Reduzida)' : lang === 'en' ? 'Quebec Reduced Rate' : 'Taux réduit québécois',
        value: '1,32%',
        note: 'Menor que a taxa do resto do Canadá (1,66%)',
      });
      steps.push({
        label: lang === 'pt' ? 'Desconto da folha' : lang === 'en' ? 'Paycheck deduction' : 'Retenue sur votre paie',
        value: `- ${formatCurrency(period.ae, locale)}`,
      });
      steps.push({
        label: lang === 'pt' ? '💼 Contribuição do Empregador' : lang === 'en' ? '💼 Employer share (1.4×)' : '💼 Part payée par l’employeur (1,4×)',
        value: `${formatCurrency(period.ae * 1.4, locale)}`,
        note: 'O empregador financia 1,4× a sua alíquota',
      });
      break;

    default:
      steps.push({
        label: lang === 'pt' ? 'Valor descontado no período' : lang === 'en' ? 'Deducted amount this period' : 'Montant déduit sur la paie',
        value: formatCurrency(period.net, locale),
      });
      break;
  }

  return steps;
}
