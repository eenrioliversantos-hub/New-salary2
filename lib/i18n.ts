export type Language = 'fr' | 'pt' | 'en';

export interface TranslationStrings {
  title: string;
  subtitle: string;
  fiscalYearBadge: string;
  hourlyRateLabel: string;
  hourlyRateHelper: string;
  minWageBadge: string;
  regularHoursLabel: string;
  regularHoursHelper: string;
  overtimeTitle: string;
  overtimeSubtitle: string;
  overtime15Label: string;
  overtime20Label: string;
  frequencyLabel: string;
  freqHourly: string;
  freqDaily: string;
  freqWeekly: string;
  freqBiweekly: string;
  freqMonthly: string;
  freqAnnually: string;
  netPayInPocket: string;
  grossPay: string;
  totalDeductions: string;
  netTakeHome: string;
  effectiveTaxRate: string;
  realNetPerHour: string;
  effectiveHourVsGross: string;
  cascadeTitle: string;
  cascadeSubtitle: string;
  colPeriod: string;
  colGross: string;
  colDeductions: string;
  colNet: string;
  colRetention: string;
  deductionsTitle: string;
  deductionsSubtitle: string;
  viewDetails: string;
  hideDetails: string;
  raiseSimulatorTitle: string;
  raiseSimulatorSubtitle: string;
  raise1Dollar: string;
  raise2Dollar: string;
  raise5Dollar: string;
  extraPocketBiweekly: string;
  extraPocketYearly: string;
  faqTitle: string;
  faqSubtitle: string;
  disclaimer: string;
  shareCopyBtn: string;
  copiedSuccess: string;
  printBtn: string;
  adBannerLabel: string;
  quebecSpecificNote: string;
  summaryCardTitle: string;

  // Advanced & Precision features
  modeSimple: string;
  modeAdvanced: string;
  loadExampleBtn: string;
  loadedExampleSuccess: string;
  precisionTitle: string;
  precisionExplain: string;
  advancedSectionTitle: string;
  advancedSectionSubtitle: string;
  shiftPremiumLabel: string;
  shiftPremiumTypeHourly: string;
  shiftPremiumTypeFixed: string;
  groupHealthInsLabel: string;
  lifeAccidentInsLabel: string;
  employerTaxableBenefitsLabel: string;
  employerTaxableBenefitsHelper: string;
  cafeteriaLabel: string;
  rrspLabel: string;
  unionLabel: string;
  scenariosDialogTitle: string;
  scenariosDialogBtn: string;

  // New Gross Entry & Quebec Benefits Simulators
  entryModeHourly: string;
  entryModeAnnual: string;
  entryModeBiweekly: string;
  annualGrossLabel: string;
  periodGrossLabel: string;
  derivedHourlyNote: string;
  quebecBenefitsTitle: string;
  quebecBenefitsSubtitle: string;
  tabVacation: string;
  tabHolidays: string;
  tabRrspMatch: string;
}

export const translations: Record<Language, TranslationStrings> = {
  fr: {
    title: 'Calculateur de Salaire Net',
    subtitle: 'Taux horaire, primes & paie aux deux semaines au Québec',
    fiscalYearBadge: 'Barèmes Québec 2025 / 2026',
    hourlyRateLabel: 'Taux horaire brut de base',
    hourlyRateHelper: 'Votre salaire de base par heure travaillée',
    minWageBadge: 'Salaire min. QC : 15,75 $/h',
    regularHoursLabel: 'Heures normales / période',
    regularHoursHelper: 'Généralement 40h/sem (ou 72h-80h aux 2 semaines)',
    overtimeTitle: 'Heures supplémentaires (Temps sup)',
    overtimeSubtitle: 'Optionnel : Ajoutez vos heures majorées',
    overtime15Label: 'Temps et demi (1,5×)',
    overtime20Label: 'Temps double (2,0×)',
    frequencyLabel: 'Fréquence de paie préférée',
    freqHourly: 'Heure',
    freqDaily: 'Jour (8h)',
    freqWeekly: 'Semaine',
    freqBiweekly: 'Aux 2 semaines',
    freqMonthly: 'Mois',
    freqAnnually: 'Année',
    netPayInPocket: 'Dans vos poches (Net)',
    grossPay: 'Salaire brut',
    totalDeductions: 'Total des retenues',
    netTakeHome: 'Salaire net',
    effectiveTaxRate: 'Taux effectif de retenue',
    realNetPerHour: 'Net réel par heure',
    effectiveHourVsGross: 'sur votre taux brut de',
    cascadeTitle: 'Tableau en cascade des périodes',
    cascadeSubtitle: 'Tous vos montants bruts, retenues et nets convertis instantanément',
    colPeriod: 'Période',
    colGross: 'Brut',
    colDeductions: 'Déductions',
    colNet: 'Net en poche',
    colRetention: 'Taux retenue',
    deductionsTitle: 'Détail complet des retenues à la source',
    deductionsSubtitle: 'Ventilation exacte des impôts, régimes publics (RRQ/RQAP/AE) et assurances privées',
    viewDetails: 'Afficher le détail',
    hideDetails: 'Masquer le détail',
    raiseSimulatorTitle: 'Simulateur d’augmentation horaire',
    raiseSimulatorSubtitle: 'Voyez concrètement combien vous restera-t-il net dans les poches :',
    raise1Dollar: '+1,00 $/h',
    raise2Dollar: '+2,00 $/h',
    raise5Dollar: '+5,00 $/h',
    extraPocketBiweekly: 'de plus par paie (aux 2 sem.)',
    extraPocketYearly: 'de plus par an net',
    faqTitle: 'Questions fréquentes sur la paie au Québec',
    faqSubtitle: 'Comprendre les spécificités québécoises (RRQ, RQAP, Abattement Fédéral, Assurances)',
    disclaimer: 'Ce calculateur fournit une estimation fidèle selon les tables d’imposition du Québec et du Canada (2025/2026). En mode avancé, vous pouvez intégrer vos assurances collectives réelles, primes et avantages imposables pour atteindre jusqu’à 99 % de précision.',
    shareCopyBtn: 'Copier le sommaire',
    copiedSuccess: 'Sommaire copié dans le presse-papier !',
    printBtn: 'Imprimer / PDF',
    adBannerLabel: 'Espace publicitaire',
    quebecSpecificNote: 'Inclut l’abattement du Québec de 16,5 % sur l’impôt fédéral et le taux réduit d’assurance-emploi.',
    summaryCardTitle: 'Votre paie aux 2 semaines en un coup d’œil',

    modeSimple: 'Mode Standard (Légal)',
    modeAdvanced: 'Mode Avancé (Talon Réel)',
    loadExampleBtn: 'Charger exemple réel (Biscuits Leclerc)',
    loadedExampleSuccess: 'Exemple d’usine Leclerc chargé (72h, primes, assurances, cafétéria) !',
    precisionTitle: 'Niveau de précision du calcul',
    precisionExplain: 'Plus vous renseignez vos retenues d’entreprise (assurance, primes), plus le calcul est proche à 100% de votre talon.',
    advancedSectionTitle: 'Retenues collectives & Primes d’usine',
    advancedSectionSubtitle: 'Configurez votre assurance médicale, primes de quart et avantages imposables',
    shiftPremiumLabel: 'Prime de quart / Prime 36-40',
    shiftPremiumTypeHourly: 'Par heure travaillée ($/h)',
    shiftPremiumTypeFixed: 'Montant fixe par paie ($)',
    groupHealthInsLabel: 'Assurance médicale (part employé)',
    lifeAccidentInsLabel: 'Assurance vie & accident (employé)',
    employerTaxableBenefitsLabel: 'Avantages imposables employeur (Case J)',
    employerTaxableBenefitsHelper: 'Part santé/dentaire payée par l’employeur qui augmente la base imposable au Québec',
    cafeteriaLabel: 'Cafétéria & déductions d’usine',
    rrspLabel: 'REER collectif / Pension privée',
    unionLabel: 'Cotisation syndicale',
    scenariosDialogTitle: 'Quels scénarios cette calculatrice supporte-t-elle ?',
    scenariosDialogBtn: 'Voir tous les scénarios pris en charge',

    entryModeHourly: 'Taux horaire ($/h)',
    entryModeAnnual: 'Brut annuel ($/an)',
    entryModeBiweekly: 'Brut quinzaine ($/paie)',
    annualGrossLabel: 'Salaire brut annuel global',
    periodGrossLabel: 'Salaire brut par paie aux 2 semaines',
    derivedHourlyNote: 'Équivaut à',
    quebecBenefitsTitle: 'Boîte à Outils & Normes du Travail au Québec',
    quebecBenefitsSubtitle: 'Simulateurs de vacances (4% ou 6% CNESST), 8 jours fériés payés (1/20) et match REER',
    tabVacation: 'Indemnité de Vacances (4%/6%)',
    tabHolidays: '8 Fériés Payés (Règle 1/20)',
    tabRrspMatch: 'Match REER Employeur',
  },
  pt: {
    title: 'Calculadora de Salário Líquido',
    subtitle: 'Valor por hora, adicionais e holerite no Québec, Canadá',
    fiscalYearBadge: 'Regras Fiscais Québec 2025 / 2026',
    hourlyRateLabel: 'Taxa horária bruta de base',
    hourlyRateHelper: 'Seu salário base por hora trabalhada',
    minWageBadge: 'Salário mín. QC: $15,75/h',
    regularHoursLabel: 'Horas normais / período',
    regularHoursHelper: 'Geralmente 40h semanais (ou 72h-80h na quinzena)',
    overtimeTitle: 'Horas extras (Temps supplémentaire)',
    overtimeSubtitle: 'Opcional: adicione horas adicionais com acréscimo',
    overtime15Label: 'Hora e meia (1.5×)',
    overtime20Label: 'Hora dobrada (2.0×)',
    frequencyLabel: 'Frequência de pagamento preferida',
    freqHourly: 'Hora',
    freqDaily: 'Dia (8h)',
    freqWeekly: 'Semana',
    freqBiweekly: 'Quinzena (Aux 2 sem.)',
    freqMonthly: 'Mês',
    freqAnnually: 'Ano',
    netPayInPocket: 'No seu bolso (Líquido)',
    grossPay: 'Salário bruto',
    totalDeductions: 'Total de descontos',
    netTakeHome: 'Salário líquido',
    effectiveTaxRate: 'Taxa efetiva de retenção',
    realNetPerHour: 'Líquido real por hora',
    effectiveHourVsGross: 'sobre o valor bruto de',
    cascadeTitle: 'A Tabela Mágica em Cascata',
    cascadeSubtitle: 'Bruto, retenções e líquido real instantaneamente em todos os períodos',
    colPeriod: 'Período',
    colGross: 'Bruto',
    colDeductions: 'Descontos',
    colNet: 'Líquido no bolso',
    colRetention: 'Taxa retenção',
    deductionsTitle: 'Detalhamento Completo dos Descontos',
    deductionsSubtitle: 'Divisão exata entre impostos públicos (RRQ/RQAP/AE), plano de saúde e benefícios',
    viewDetails: 'Ver detalhes dos descontos',
    hideDetails: 'Ocultar detalhes',
    raiseSimulatorTitle: 'Simulador de Aumento de Salário',
    raiseSimulatorSubtitle: 'Veja exatamente quanto cai a mais no bolso com um aumento horista:',
    raise1Dollar: '+1,00 $/h',
    raise2Dollar: '+2,00 $/h',
    raise5Dollar: '+5,00 $/h',
    extraPocketBiweekly: 'a mais na quinzena',
    extraPocketYearly: 'a mais por ano líquido',
    faqTitle: 'Perguntas Frequentes sobre Salário no Québec',
    faqSubtitle: 'Entenda os descontos obrigatórios específicos da província e benefícios de empresa',
    disclaimer: 'Esta calculadora fornece uma estimativa precisa baseada nas alíquotas oficiais do Québec e Canadá (2025/2026). No Modo Avançado você pode inserir seu plano de saúde coletivo, primes de turno e benefícios tributáveis para chegar a até 99% de fidelidade ao seu talon de paie.',
    shareCopyBtn: 'Copiar resumo',
    copiedSuccess: 'Resumo copiado com sucesso!',
    printBtn: 'Imprimir / PDF',
    adBannerLabel: 'Espaço Publicitário',
    quebecSpecificNote: 'Considera o Abattement do Québec de 16,5% no imposto federal e a taxa reduzida de Seguro Desemprego (AE).',
    summaryCardTitle: 'Sua paie quinzenal num piscar de olhos',

    modeSimple: 'Modo Padrão (Apenas Governo)',
    modeAdvanced: 'Modo Avançado (Holerite Real)',
    loadExampleBtn: 'Carregar exemplo real (Biscuits Leclerc)',
    loadedExampleSuccess: 'Exemplo da fábrica Leclerc carregado (72h, primes, seguro saúde, cafeteria)!',
    precisionTitle: 'Grau de precisão do cálculo',
    precisionExplain: 'Quanto mais informações do seu contracheque você adicionar (plano de saúde, primes), mais próximo de 100% será o valor líquido.',
    advancedSectionTitle: 'Benefícios de Empresa, Seguros & Primes',
    advancedSectionSubtitle: 'Configure plano médico coletivo, adicional de turno e benefícios tributáveis',
    shiftPremiumLabel: 'Adicional de turno / Prime 36-40',
    shiftPremiumTypeHourly: 'Por hora trabalhada ($/h)',
    shiftPremiumTypeFixed: 'Valor fixo por quinzena ($)',
    groupHealthInsLabel: 'Assurance médicale (Seguro Saúde - cota do funcionário)',
    lifeAccidentInsLabel: 'Seguro de vida e acidentes (Assurance vie/accident)',
    employerTaxableBenefitsLabel: 'Benefício tributável da empresa (Avantages imposables - Case J)',
    employerTaxableBenefitsHelper: 'A parcela de seguro médico paga pelo patrão entra na base de imposto provincial do Québec',
    cafeteriaLabel: 'Cafeteria / Refeitório e compras na fábrica',
    rrspLabel: 'REER Coletivo / Previdência privada',
    unionLabel: 'Contribuição Sindical',
    scenariosDialogTitle: 'Quais cenários esta calculadora suporta?',
    scenariosDialogBtn: 'Ver cenários suportados & como deixar 100% preciso',

    entryModeHourly: 'Taxa Horária ($/h)',
    entryModeAnnual: 'Bruto Anual ($/ano)',
    entryModeBiweekly: 'Bruto Quinzena ($/paie)',
    annualGrossLabel: 'Salário bruto anual total',
    periodGrossLabel: 'Salário bruto quinzenal fixo',
    derivedHourlyNote: 'Equivalente a',
    quebecBenefitsTitle: 'Normas do Trabalho & Benefícios no Québec (CNESST)',
    quebecBenefitsSubtitle: 'Simuladores de férias (4% ou 6%), feriados pagos (regra do 1/20) e match de previdência da empresa',
    tabVacation: 'Férias Remuneradas (4% / 6%)',
    tabHolidays: '8 Feriados Pagos (Regra 1/20)',
    tabRrspMatch: 'Match REER da Empresa',
  },
  en: {
    title: 'Quebec Hourly Net Pay Calculator',
    subtitle: 'Hourly wage, shift premiums & bi-weekly paycheck calculator for Quebec',
    fiscalYearBadge: 'Quebec Tax Rules 2025 / 2026',
    hourlyRateLabel: 'Base gross hourly rate',
    hourlyRateHelper: 'Your base wage per hour worked',
    minWageBadge: 'QC Min. wage: $15.75/hr',
    regularHoursLabel: 'Regular hours / pay period',
    regularHoursHelper: 'Typically 40h/week (or 72h-80h bi-weekly)',
    overtimeTitle: 'Overtime hours',
    overtimeSubtitle: 'Optional: Add your extra overtime hours',
    overtime15Label: 'Time-and-a-half (1.5×)',
    overtime20Label: 'Double time (2.0×)',
    frequencyLabel: 'Preferred pay frequency',
    freqHourly: 'Hourly',
    freqDaily: 'Daily (8h)',
    freqWeekly: 'Weekly',
    freqBiweekly: 'Bi-weekly (Every 2 wks)',
    freqMonthly: 'Monthly',
    freqAnnually: 'Yearly',
    netPayInPocket: 'In your pocket (Net)',
    grossPay: 'Gross pay',
    totalDeductions: 'Total deductions',
    netTakeHome: 'Net pay',
    effectiveTaxRate: 'Effective deduction rate',
    realNetPerHour: 'Real net per hour',
    effectiveHourVsGross: 'from your gross rate of',
    cascadeTitle: 'Paycheck Cascade Table',
    cascadeSubtitle: 'Instant breakdown of gross, deductions, and net across every pay cycle',
    colPeriod: 'Period',
    colGross: 'Gross',
    colDeductions: 'Deductions',
    colNet: 'Net in pocket',
    colRetention: 'Deduction %',
    deductionsTitle: 'Full Payroll Deductions Breakdown',
    deductionsSubtitle: 'Exact split between statutory taxes (RRQ/RQAP/EI), group benefits, and health plan',
    viewDetails: 'Show breakdown details',
    hideDetails: 'Hide breakdown details',
    raiseSimulatorTitle: 'Wage Raise Simulator',
    raiseSimulatorSubtitle: 'See how much more net cash lands in your pocket with a pay bump:',
    raise1Dollar: '+$1.00/hr',
    raise2Dollar: '+$2.00/hr',
    raise5Dollar: '+$5.00/hr',
    extraPocketBiweekly: 'more per bi-weekly paycheck',
    extraPocketYearly: 'more per year in net cash',
    faqTitle: 'Frequently Asked Questions (Quebec Payroll)',
    faqSubtitle: 'Understand specific Quebec payroll taxes and deductions',
    disclaimer: 'This calculator provides a realistic estimate based on 2025/2026 CRA and Revenu Québec tax brackets. Use Advanced Mode to include group health insurance, shift premiums, and taxable benefits for up to 99% accuracy.',
    shareCopyBtn: 'Copy pay summary',
    copiedSuccess: 'Summary copied to clipboard!',
    printBtn: 'Print / Save PDF',
    adBannerLabel: 'Advertisement Space',
    quebecSpecificNote: 'Includes the 16.5% Quebec Abatement on federal tax and Quebec’s reduced EI rate.',
    summaryCardTitle: 'Your bi-weekly paycheck at a glance',

    modeSimple: 'Standard Mode (Gov Only)',
    modeAdvanced: 'Advanced Mode (Real Paystub)',
    loadExampleBtn: 'Load real factory example (Biscuits Leclerc)',
    loadedExampleSuccess: 'Leclerc factory paystub example loaded (72h, premiums, health ins., cafeteria)!',
    precisionTitle: 'Calculation accuracy score',
    precisionExplain: 'The more workplace deductions you include (health insurance, premiums), the closer to 100% precision.',
    advancedSectionTitle: 'Group Benefits, Shift Premiums & Taxable Perks',
    advancedSectionSubtitle: 'Configure medical insurance, night/shift premiums, and Box J benefits',
    shiftPremiumLabel: 'Shift / 36-40 premium',
    shiftPremiumTypeHourly: 'Per hour worked ($/hr)',
    shiftPremiumTypeFixed: 'Fixed per pay period ($)',
    groupHealthInsLabel: 'Group health insurance (employee)',
    lifeAccidentInsLabel: 'Life & disability insurance (employee)',
    employerTaxableBenefitsLabel: 'Employer taxable benefits (Box J RL-1)',
    employerTaxableBenefitsHelper: 'Employer-paid health portion is treated as taxable income in Quebec',
    cafeteriaLabel: 'Cafeteria & factory store deductions',
    rrspLabel: 'Group RRSP / Pension plan',
    unionLabel: 'Union dues',
    scenariosDialogTitle: 'Which scenarios does this calculator support?',
    scenariosDialogBtn: 'View supported scenarios & how to achieve 100% precision',

    entryModeHourly: 'Hourly Rate ($/hr)',
    entryModeAnnual: 'Annual Gross ($/yr)',
    entryModeBiweekly: 'Bi-weekly Gross ($/pay)',
    annualGrossLabel: 'Total annual gross salary',
    periodGrossLabel: 'Fixed bi-weekly gross salary',
    derivedHourlyNote: 'Equivalent to',
    quebecBenefitsTitle: 'Quebec Labor Standards & Employment Benefits (CNESST)',
    quebecBenefitsSubtitle: 'Simulators for vacation pay (4%/6%), 8 statutory paid holidays (1/20 rule), and employer RRSP match',
    tabVacation: 'Vacation Pay (4% / 6%)',
    tabHolidays: '8 Statutory Holidays (1/20 Rule)',
    tabRrspMatch: 'Employer RRSP Match',
  },
};
