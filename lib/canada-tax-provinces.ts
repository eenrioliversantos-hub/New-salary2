/**
 * Canadian Federal & Provincial/Territorial Tax Engine (2025/2026 Fiscal Rules)
 * 
 * Accurately models:
 * 1. Federal Tax (CRA / ARC) for all 10 Provinces & 3 Territories.
 * 2. Quebec Special Rules: 16.5% Quebec Abatement (Abattement du Québec), RRQ (QPP base + supp), RQAP (QPIP), reduced AE.
 * 3. All other Canadian Provinces & Territories (CPP base + supp 1/2, Federal EI standard 1.64%, provincial BPA, progressive brackets & surtaxes).
 * 4. Ontario Health Premium & surtaxes, BC health/tax brackets, Alberta flat/progressive structure, etc.
 * 5. Minimum wages per jurisdiction, standard weekly hours before overtime, statutory vacation and holidays.
 */

export type CanadianProvince =
  | 'QC' // Québec
  | 'ON' // Ontario
  | 'BC' // British Columbia
  | 'AB' // Alberta
  | 'MB' // Manitoba
  | 'SK' // Saskatchewan
  | 'NS' // Nova Scotia
  | 'NB' // New Brunswick
  | 'NL' // Newfoundland and Labrador
  | 'PE' // Prince Edward Island
  | 'YT' // Yukon
  | 'NT' // Northwest Territories
  | 'NU'; // Nunavut

export interface ProvinceInfo {
  code: CanadianProvince;
  name: Record<'fr' | 'pt' | 'en', string>;
  flag: string;
  minWageHourly: number; // CAD/hour (2025/2026)
  standardOvertimeThresholdHours: number; // e.g., 40h in QC/ON, 44h in AB/NS
  pensionPlan: 'RRQ' | 'CPP';
  parentalPlan: 'RQAP' | 'EI';
  eiRate: number; // 0.0132 in QC, 0.0164 rest of Canada
  hasQuebecAbatement: boolean; // true only for QC (16.5%)
  costOfLivingIndex: number; // Base 100 benchmark (Toronto/Vancouver ~115, Montreal ~96, Moncton ~86)
  highlights: Record<'fr' | 'pt' | 'en', string>;
}

export const CANADIAN_PROVINCES: Record<CanadianProvince, ProvinceInfo> = {
  QC: {
    code: 'QC',
    name: {
      fr: 'Québec',
      pt: 'Québec',
      en: 'Quebec',
    },
    flag: '⚜️',
    minWageHourly: 16.10,
    standardOvertimeThresholdHours: 40,
    pensionPlan: 'RRQ',
    parentalPlan: 'RQAP',
    eiRate: 0.0132,
    hasQuebecAbatement: true,
    costOfLivingIndex: 96,
    highlights: {
      fr: 'Abattement fédéral de 16,5 %, RRQ + RQAP exclusifs, déduction pour travailleur.',
      pt: 'Abatimento federal de 16,5%, regimes próprios RRQ e RQAP, menor custo de moradia.',
      en: '16.5% Federal Abatement, independent QPP/QPIP, worker tax deduction.',
    },
  },
  ON: {
    code: 'ON',
    name: {
      fr: 'Ontario',
      pt: 'Ontário',
      en: 'Ontario',
    },
    flag: '🍁',
    minWageHourly: 17.20,
    standardOvertimeThresholdHours: 44,
    pensionPlan: 'CPP',
    parentalPlan: 'EI',
    eiRate: 0.0164,
    hasQuebecAbatement: false,
    costOfLivingIndex: 114,
    highlights: {
      fr: 'Régime CPP + AE standard, surtaxe de l’Ontario et prime santé OHIP.',
      pt: 'CPP federal e Seguro-Desemprego padrão (1,64%), taxa de saúde de Ontário (OHIP).',
      en: 'Standard CPP & EI, Ontario Surtax and Ontario Health Premium.',
    },
  },
  BC: {
    code: 'BC',
    name: {
      fr: 'Colombie-Britannique',
      pt: 'Colúmbia Britânica',
      en: 'British Columbia',
    },
    flag: '🌲',
    minWageHourly: 17.40,
    standardOvertimeThresholdHours: 40,
    pensionPlan: 'CPP',
    parentalPlan: 'EI',
    eiRate: 0.0164,
    hasQuebecAbatement: false,
    costOfLivingIndex: 116,
    highlights: {
      fr: 'Taux provincial initial modéré (5,06 %), 5 jours de congé de maladie payés garantis.',
      pt: 'Alíquota provincial inicial moderada (5,06%) e 5 dias de atestado pago por lei.',
      en: 'Lower starting provincial rate (5.06%), mandatory 5 paid sick leave days.',
    },
  },
  AB: {
    code: 'AB',
    name: {
      fr: 'Alberta',
      pt: 'Alberta',
      en: 'Alberta',
    },
    flag: '🏔️',
    minWageHourly: 15.00,
    standardOvertimeThresholdHours: 44,
    pensionPlan: 'CPP',
    parentalPlan: 'EI',
    eiRate: 0.0164,
    hasQuebecAbatement: false,
    costOfLivingIndex: 98,
    highlights: {
      fr: 'Pas de taxe de vente provinciale (PST), seuil d’exemption de base élevé (~21 885 $).',
      pt: 'Sem imposto provincial sobre consumo (0% PST) e isenção básica muito alta ($21.885).',
      en: 'Zero provincial sales tax (PST), very high basic personal amount (~$21,885).',
    },
  },
  MB: {
    code: 'MB',
    name: {
      fr: 'Manitoba',
      pt: 'Manitoba',
      en: 'Manitoba',
    },
    flag: '🌾',
    minWageHourly: 15.80,
    standardOvertimeThresholdHours: 40,
    pensionPlan: 'CPP',
    parentalPlan: 'EI',
    eiRate: 0.0164,
    hasQuebecAbatement: false,
    costOfLivingIndex: 90,
    highlights: {
      fr: 'Exemption personnelle de base de 15 780 $, coût de la vie très abordable.',
      pt: 'Custo de vida acessível em Winnipeg e crédito pessoal de base de $15.780.',
      en: 'Competitive basic personal amount ($15,780) and low cost of living.',
    },
  },
  SK: {
    code: 'SK',
    name: {
      fr: 'Saskatchewan',
      pt: 'Saskatchewan',
      en: 'Saskatchewan',
    },
    flag: '🌾',
    minWageHourly: 15.00,
    standardOvertimeThresholdHours: 40,
    pensionPlan: 'CPP',
    parentalPlan: 'EI',
    eiRate: 0.0164,
    hasQuebecAbatement: false,
    costOfLivingIndex: 88,
    highlights: {
      fr: 'Programme pour diplômés (Graduate Retention Program) offrant jusqu’à 20 000 $ de crédits.',
      pt: 'Programa para graduados retém até $20.000 em créditos de imposto ao longo de anos.',
      en: 'Graduate Retention Program offering up to $20,000 in income tax credits.',
    },
  },
  NS: {
    code: 'NS',
    name: {
      fr: 'Nouvelle-Écosse',
      pt: 'Nova Escócia',
      en: 'Nova Scotia',
    },
    flag: '⚓',
    minWageHourly: 15.20,
    standardOvertimeThresholdHours: 48,
    pensionPlan: 'CPP',
    parentalPlan: 'EI',
    eiRate: 0.0164,
    hasQuebecAbatement: false,
    costOfLivingIndex: 92,
    highlights: {
      fr: 'Provinces de l’Atlantique avec style de vie maritime et incitatifs à l’immigration.',
      pt: 'Estilo de vida no Atlântico com programas dinâmicos de atração de imigrantes.',
      en: 'Atlantic lifestyle with strong community and regional immigration pathways.',
    },
  },
  NB: {
    code: 'NB',
    name: {
      fr: 'Nouveau-Brunswick',
      pt: 'Novo Brunswick',
      en: 'New Brunswick',
    },
    flag: '🌊',
    minWageHourly: 15.30,
    standardOvertimeThresholdHours: 44,
    pensionPlan: 'CPP',
    parentalPlan: 'EI',
    eiRate: 0.0164,
    hasQuebecAbatement: false,
    costOfLivingIndex: 87,
    highlights: {
      fr: 'Seule province officiellement bilingue au Canada (français/anglais).',
      pt: 'Única província oficialmente bilíngue (inglês/francês) do Canadá.',
      en: 'Canada’s only officially bilingual province (English & French).',
    },
  },
  NL: {
    code: 'NL',
    name: {
      fr: 'Terre-Neuve-et-Labrador',
      pt: 'Terra Nova e Labrador',
      en: 'Newfoundland and Labrador',
    },
    flag: '⛵',
    minWageHourly: 15.60,
    standardOvertimeThresholdHours: 40,
    pensionPlan: 'CPP',
    parentalPlan: 'EI',
    eiRate: 0.0164,
    hasQuebecAbatement: false,
    costOfLivingIndex: 89,
    highlights: {
      fr: 'Régime d’impôt progressif et économie maritime et énergétique dynamique.',
      pt: 'Forte polo de energia marítima com setor industrial e pesqueiro aquecido.',
      en: 'Offshore energy hub with rich coastal traditions and community warmth.',
    },
  },
  PE: {
    code: 'PE',
    name: {
      fr: 'Île-du-Prince-Édouard',
      pt: 'Ilha do Príncipe Eduardo',
      en: 'Prince Edward Island',
    },
    flag: '🏝️',
    minWageHourly: 16.00,
    standardOvertimeThresholdHours: 48,
    pensionPlan: 'CPP',
    parentalPlan: 'EI',
    eiRate: 0.0164,
    hasQuebecAbatement: false,
    costOfLivingIndex: 88,
    highlights: {
      fr: 'La plus petite province du Canada, communauté soudée et qualité de vie insulaire.',
      pt: 'Menor província canadense com alta qualidade de vida e custo comunitário.',
      en: 'Smallest Canadian province, serene island communities and safe neighborhoods.',
    },
  },
  YT: {
    code: 'YT',
    name: {
      fr: 'Yukon',
      pt: 'Yukon',
      en: 'Yukon',
    },
    flag: '🏔️',
    minWageHourly: 17.59,
    standardOvertimeThresholdHours: 40,
    pensionPlan: 'CPP',
    parentalPlan: 'EI',
    eiRate: 0.0164,
    hasQuebecAbatement: false,
    costOfLivingIndex: 110,
    highlights: {
      fr: 'Déduction pour les résidents du Nord (CRA) et taux d’imposition territorial bas.',
      pt: 'Dedução especial da Receita Federal para residentes do Norte (Northern Allowance).',
      en: 'Northern Residents Deductions from CRA with low territorial tax tiers.',
    },
  },
  NT: {
    code: 'NT',
    name: {
      fr: 'Territoires du Nord-Ouest',
      pt: 'Territórios do Noroeste (NWT)',
      en: 'Northwest Territories',
    },
    flag: '❄️',
    minWageHourly: 16.70,
    standardOvertimeThresholdHours: 40,
    pensionPlan: 'CPP',
    parentalPlan: 'EI',
    eiRate: 0.0164,
    hasQuebecAbatement: false,
    costOfLivingIndex: 118,
    highlights: {
      fr: 'Salaires bruts parmi les plus élevés au pays avec crédits d’impôt du Grand Nord.',
      pt: 'Média de salários brutos entre as mais elevadas do país em mineração e serviços.',
      en: 'Some of the highest nominal gross salaries in Canada with northern credits.',
    },
  },
  NU: {
    code: 'NU',
    name: {
      fr: 'Nunavut',
      pt: 'Nunavut',
      en: 'Nunavut',
    },
    flag: '🐻',
    minWageHourly: 19.00,
    standardOvertimeThresholdHours: 40,
    pensionPlan: 'CPP',
    parentalPlan: 'EI',
    eiRate: 0.0164,
    hasQuebecAbatement: false,
    costOfLivingIndex: 135,
    highlights: {
      fr: 'Taux territorial initial le plus bas au Canada (4 %), salaire minimum le plus élevé (19,00 $).',
      pt: 'Menor alíquota territorial do Canadá (4%) e o maior salário mínimo ($19,00/h).',
      en: 'Lowest initial regional tax rate in Canada (4%) and highest minimum wage ($19.00).',
    },
  },
};

// 2025/2026 Fiscal Brackets & Constants for CRA and Provinces
export interface TaxBracket {
  max: number;
  rate: number;
}

export interface ProvincialTaxRules {
  bpa: number;
  creditRate: number;
  brackets: TaxBracket[];
  workerDeduction?: { rate: number; max: number };
  surtax?: {
    threshold1: number;
    rate1: number;
    threshold2?: number;
    rate2?: number;
  };
  healthPremium?: (income: number) => number;
}

export const CANADA_FISCAL_RULES: Record<CanadianProvince, ProvincialTaxRules> = {
  QC: {
    bpa: 18056,
    creditRate: 0.14,
    workerDeduction: { rate: 0.06, max: 1380 },
    brackets: [
      { max: 51780, rate: 0.14 },
      { max: 103545, rate: 0.19 },
      { max: 126000, rate: 0.24 },
      { max: Infinity, rate: 0.2575 },
    ],
  },
  ON: {
    bpa: 12399,
    creditRate: 0.0505,
    brackets: [
      { max: 51446, rate: 0.0505 },
      { max: 102894, rate: 0.0915 },
      { max: 150000, rate: 0.1116 },
      { max: 220000, rate: 0.1216 },
      { max: Infinity, rate: 0.1316 },
    ],
    surtax: {
      threshold1: 5554,
      rate1: 0.20,
      threshold2: 7108,
      rate2: 0.36,
    },
    healthPremium: (income: number) => {
      if (income <= 20000) return 0;
      if (income <= 25000) return Math.min(300, (income - 20000) * 0.06);
      if (income <= 36000) return 300;
      if (income <= 38500) return 300 + (income - 36000) * 0.06;
      if (income <= 48000) return 450;
      if (income <= 48600) return 450 + (income - 48000) * 0.25;
      if (income <= 72000) return 600;
      if (income <= 72600) return 600 + (income - 72000) * 0.25;
      if (income <= 200000) return 750;
      if (income <= 200600) return 750 + (income - 200000) * 0.25;
      return 900;
    },
  },
  BC: {
    bpa: 12580,
    creditRate: 0.0506,
    brackets: [
      { max: 47937, rate: 0.0506 },
      { max: 95875, rate: 0.077 },
      { max: 110076, rate: 0.105 },
      { max: 133664, rate: 0.1229 },
      { max: 181232, rate: 0.147 },
      { max: 252752, rate: 0.168 },
      { max: Infinity, rate: 0.205 },
    ],
  },
  AB: {
    bpa: 21885,
    creditRate: 0.10,
    brackets: [
      { max: 148269, rate: 0.10 },
      { max: 177922, rate: 0.12 },
      { max: 237230, rate: 0.13 },
      { max: 355845, rate: 0.14 },
      { max: Infinity, rate: 0.15 },
    ],
  },
  MB: {
    bpa: 15780,
    creditRate: 0.108,
    brackets: [
      { max: 47000, rate: 0.108 },
      { max: 100000, rate: 0.1275 },
      { max: Infinity, rate: 0.174 },
    ],
  },
  SK: {
    bpa: 18494,
    creditRate: 0.105,
    brackets: [
      { max: 52057, rate: 0.105 },
      { max: 148734, rate: 0.125 },
      { max: Infinity, rate: 0.145 },
    ],
  },
  NS: {
    bpa: 11481,
    creditRate: 0.0879,
    brackets: [
      { max: 29590, rate: 0.0879 },
      { max: 59180, rate: 0.1495 },
      { max: 93000, rate: 0.1667 },
      { max: 150000, rate: 0.175 },
      { max: Infinity, rate: 0.21 },
    ],
  },
  NB: {
    bpa: 13044,
    creditRate: 0.094,
    brackets: [
      { max: 49958, rate: 0.094 },
      { max: 99916, rate: 0.14 },
      { max: 185064, rate: 0.16 },
      { max: Infinity, rate: 0.195 },
    ],
  },
  NL: {
    bpa: 10818,
    creditRate: 0.087,
    brackets: [
      { max: 43198, rate: 0.087 },
      { max: 86395, rate: 0.145 },
      { max: 154244, rate: 0.158 },
      { max: 215943, rate: 0.178 },
      { max: Infinity, rate: 0.208 },
    ],
  },
  PE: {
    bpa: 13500,
    creditRate: 0.0965,
    brackets: [
      { max: 32656, rate: 0.0965 },
      { max: 64313, rate: 0.1363 },
      { max: 105000, rate: 0.1665 },
      { max: 140000, rate: 0.18 },
      { max: Infinity, rate: 0.1875 },
    ],
  },
  YT: {
    bpa: 15705,
    creditRate: 0.064,
    brackets: [
      { max: 55867, rate: 0.064 },
      { max: 111733, rate: 0.09 },
      { max: 173205, rate: 0.109 },
      { max: 500000, rate: 0.128 },
      { max: Infinity, rate: 0.15 },
    ],
  },
  NT: {
    bpa: 17373,
    creditRate: 0.059,
    brackets: [
      { max: 50597, rate: 0.059 },
      { max: 101198, rate: 0.086 },
      { max: 164525, rate: 0.122 },
      { max: Infinity, rate: 0.1405 },
    ],
  },
  NU: {
    bpa: 18767,
    creditRate: 0.04,
    brackets: [
      { max: 53268, rate: 0.04 },
      { max: 106537, rate: 0.07 },
      { max: 173205, rate: 0.09 },
      { max: Infinity, rate: 0.115 },
    ],
  },
};

// Canada-wide Common Parameters
export const ALL_CANADA_CONSTANTS = {
  WEEKS_PER_YEAR: 52,
  BIWEEKLY_PERIODS: 26,
  MONTHS_PER_YEAR: 12,

  // CPP (Canada Pension Plan - Rest of Canada)
  CPP: {
    EXEMPTION: 3500,
    MGA_BASE: 71300,
    BASE_RATE: 0.0595, // 5.95% employee
    MGA_SUPPLEMENTARY: 81900,
    SUPP_RATE: 0.04, // 4.0% employee on tier 2
  },

  // Federal Employment Insurance (EI - Rest of Canada)
  FEDERAL_EI: {
    MAX_EARNINGS: 65700,
    EMPLOYEE_RATE: 0.0164, // 1.64% for Non-Quebec residents
  },

  // Federal Income Tax (CRA / ARC)
  FEDERAL: {
    BPA: 15705,
    EMPLOYMENT_AMOUNT_MAX: 1433,
    TAX_CREDIT_RATE: 0.15,
    QUEBEC_ABATEMENT_RATE: 0.165,
    BRACKETS: [
      { max: 55867, rate: 0.15 },
      { max: 111733, rate: 0.205 },
      { max: 173205, rate: 0.26 },
      { max: 246752, rate: 0.29 },
      { max: Infinity, rate: 0.33 },
    ],
  },
};
