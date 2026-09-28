/**
 * Quebec Payroll & Tax Calculation Engine (2025/2026 Fiscal Rules)
 * 
 * Rules modeled:
 * 1. Federal Tax (CRA / ARC) with 16.5% Quebec Abatement (Abattement remboursable du Québec).
 * 2. Quebec Provincial Income Tax (Revenu Québec) with 14% basic tax rate & tax credits.
 * 3. RRQ (Régime de rentes du Québec) base + additional plan 1 + plan 2.
 * 4. RQAP (Régime québécois d'assurance parentale).
 * 5. AE (Assurance-Emploi) at Quebec-specific reduced rate (1.32%).
 * 6. Advanced Workplace Deductions:
 *    - Shift & hourly premiums (Prime de quart / Prime 36-40 / Prime de nuit)
 *    - Group Insurance: Health (Assurance médicale), Dental (Dentaire), Life & Accident (Vie & accident)
 *    - Taxable Employer Benefits (Avantages imposables employeur - Case J RL-1 au Québec)
 *    - Group RRSP / Pension (REER collectif)
 *    - Union dues (Cotisation syndicale)
 *    - Cafeteria & miscellaneous payroll deductions
 */

export type PayFrequency = 'hourly' | 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'annually';
export type SalaryEntryMode = 'hourly' | 'annual' | 'biweekly' | 'monthly';

export interface TaxInput {
  // Entry Mode (Hourly Rate vs. Fixed Gross Salary)
  entryMode: SalaryEntryMode;
  annualGrossSalary?: number; // Used when entryMode === 'annual' (e.g. $65,000)
  periodGrossSalary?: number; // Used when entryMode === 'biweekly' or 'monthly'

  // Basic Inputs
  hourlyRate: number;
  regularHoursPerWeek: number;
  overtime15HoursPerWeek: number;
  overtime20HoursPerWeek: number;
  frequency: PayFrequency;

  // Calculation Mode
  mode: 'simple' | 'advanced';

  // Advanced Inputs: Premiums & Earnings
  shiftPremiumType: 'hourly' | 'fixed'; // $/h or fixed amount per pay period
  shiftPremiumAmount: number; // e.g. $3.50/h or $252.08 / bi-weekly

  // Advanced Inputs: Group Insurance (Assurance Collective - Per Pay Period)
  healthInsuranceEmployee: number; // e.g. $74.28
  lifeAndDisabilityInsuranceEmployee: number; // e.g. $16.30 (vie base 13.68 + accident 1.06 + personne charge 1.56)
  dentalInsuranceEmployee: number; // e.g. $0 or specific amount

  // Taxable benefits paid by employer (Avantages imposables employeur - adds to QC taxable base)
  employerTaxableBenefits: number; // e.g. $56.13 (eyeur ass medicale 27.44 + dentaire 28.69)

  // Retirement & Union
  groupRrspType: 'percent' | 'fixed';
  groupRrspValue: number; // % of gross or fixed $ per pay period
  unionDuesType: 'percent' | 'fixed';
  unionDuesValue: number; // % of gross or fixed $ per pay period

  // Other deductions (Cafeteria, store purchases, etc.)
  otherDeductionsPerPay: number; // e.g. $9.00 (3 repas cafétéria à $3)
}

export interface DeductionItem {
  name: string;
  code: string;
  annual: number;
  period: number;
  category: 'government' | 'insurance' | 'retirement' | 'workplace';
  rateDescription: string;
  description: string;
}

export interface PeriodResult {
  frequency: PayFrequency;
  label: string;
  periodsPerYear: number;
  gross: number;
  federalTax: number;
  provincialTax: number;
  rrq: number;
  rqap: number;
  ae: number;
  groupInsurance: number;
  retirementAndUnion: number;
  otherDeductions: number;
  totalStatutoryDeductions: number; // Impôts + cotisations publiques
  totalNonStatutoryDeductions: number; // Assurances + REER + syndicat + cafétéria
  totalDeductions: number;
  net: number;
  effectiveTaxRate: number; // % total deductions / gross
}

export interface PrecisionBreakdown {
  score: number; // 0 to 100%
  level: 'basic' | 'moderate' | 'high' | 'ultra';
  label: string;
  description: string;
  factorsConfigured: string[];
  factorsMissing: string[];
}

export interface CalculationResult {
  input: TaxInput;
  totalHoursPerWeek: number;
  effectiveHourlyRateGross: number;
  effectiveHourlyRateNet: number;
  annualGross: number;
  annualFederalTax: number;
  annualProvincialTax: number;
  annualRRQ: number;
  annualRQAP: number;
  annualAE: number;
  annualGroupInsurance: number;
  annualRetirementAndUnion: number;
  annualOtherDeductions: number;
  annualTotalDeductions: number;
  annualNet: number;
  effectiveTaxRate: number; // %
  marginalTaxRate: number; // %
  takeHomePercentage: number; // %
  precision: PrecisionBreakdown;
  selectedPeriod: PeriodResult;
  cascade: {
    hourly: PeriodResult;
    daily: PeriodResult;
    weekly: PeriodResult;
    biweekly: PeriodResult;
    monthly: PeriodResult;
    annually: PeriodResult;
  };
  deductionsList: DeductionItem[];
}

// 2025/2026 Fiscal Constants for Quebec & Canada
const PARAMS = {
  WEEKS_PER_YEAR: 52,
  DAYS_PER_YEAR: 260, // 5 days/week * 52 weeks
  BIWEEKLY_PERIODS: 26,
  MONTHS_PER_YEAR: 12,

  // RRQ (Régime de rentes du Québec)
  RRQ: {
    EXEMPTION: 3500,
    MGA_BASE: 71300, // Maximum Pensionable Earnings 2025
    BASE_RATE: 0.064, // 6.40%
    MGA_SUPPLEMENTARY: 81900,
    SUPP_RATE: 0.04,
  },

  // RQAP (Régime québécois d'assurance parentale)
  RQAP: {
    MAX_EARNINGS: 94000,
    EMPLOYEE_RATE: 0.00494, // 0.494%
  },

  // AE (Assurance-Emploi - Quebec reduced rate)
  AE: {
    MAX_EARNINGS: 65700,
    EMPLOYEE_RATE: 0.0132, // 1.32% in Quebec
  },

  // Federal Tax (ARC / CRA)
  FEDERAL: {
    BPA: 15705, // Basic Personal Amount
    EMPLOYMENT_AMOUNT_MAX: 1433,
    TAX_CREDIT_RATE: 0.15,
    QUEBEC_ABATEMENT_RATE: 0.165, // 16.5% reduction for Quebec residents
    BRACKETS: [
      { max: 55867, rate: 0.15 },
      { max: 111733, rate: 0.205 },
      { max: 173205, rate: 0.26 },
      { max: 246752, rate: 0.29 },
      { max: Infinity, rate: 0.33 },
    ],
  },

  // Quebec Provincial Tax (Revenu Québec)
  QUEBEC: {
    BPA: 18056,
    WORKER_DEDUCTION_RATE: 0.06,
    WORKER_DEDUCTION_MAX: 1380,
    TAX_CREDIT_RATE: 0.14,
    BRACKETS: [
      { max: 51780, rate: 0.14 },
      { max: 103545, rate: 0.19 },
      { max: 126000, rate: 0.24 },
      { max: Infinity, rate: 0.2575 },
    ],
  },
};

function calculateProgressiveTax(income: number, brackets: { max: number; rate: number }[]): { tax: number; marginalRate: number } {
  if (income <= 0) return { tax: 0, marginalRate: 0 };
  
  let tax = 0;
  let previousMax = 0;
  let marginalRate = brackets[0].rate;

  for (const bracket of brackets) {
    if (income > previousMax) {
      const taxableInBracket = Math.min(income, bracket.max) - previousMax;
      tax += taxableInBracket * bracket.rate;
      marginalRate = bracket.rate;
      previousMax = bracket.max;
    } else {
      break;
    }
  }

  return { tax, marginalRate };
}

export function calculateQuebecPay(input: TaxInput): CalculationResult {
  const {
    entryMode,
    annualGrossSalary,
    periodGrossSalary,
    hourlyRate,
    regularHoursPerWeek,
    overtime15HoursPerWeek,
    overtime20HoursPerWeek,
    frequency,
    mode,
    shiftPremiumType,
    shiftPremiumAmount,
    healthInsuranceEmployee,
    lifeAndDisabilityInsuranceEmployee,
    dentalInsuranceEmployee,
    employerTaxableBenefits,
    groupRrspType,
    groupRrspValue,
    unionDuesType,
    unionDuesValue,
    otherDeductionsPerPay,
  } = input;

  const safeRegHours = Math.max(0.5, regularHoursPerWeek || 40);
  
  // Resolve hourly rate based on entry mode
  let resolvedHourlyRate = Math.max(0, hourlyRate || 0);
  if (entryMode === 'annual' && annualGrossSalary && annualGrossSalary > 0) {
    resolvedHourlyRate = annualGrossSalary / (safeRegHours * PARAMS.WEEKS_PER_YEAR);
  } else if (entryMode === 'biweekly' && periodGrossSalary && periodGrossSalary > 0) {
    resolvedHourlyRate = periodGrossSalary / (safeRegHours * 2);
  } else if (entryMode === 'monthly' && periodGrossSalary && periodGrossSalary > 0) {
    resolvedHourlyRate = (periodGrossSalary * PARAMS.MONTHS_PER_YEAR) / (safeRegHours * PARAMS.WEEKS_PER_YEAR);
  }

  const safeHourly = resolvedHourlyRate;
  const safeOt15Hours = Math.max(0, overtime15HoursPerWeek || 0);
  const safeOt20Hours = Math.max(0, overtime20HoursPerWeek || 0);
  const totalHoursPerWeek = safeRegHours + safeOt15Hours + safeOt20Hours;

  // Base Weekly Gross from hours
  const regularGrossPerWeek = safeHourly * safeRegHours;
  const ot15GrossPerWeek = safeHourly * 1.5 * safeOt15Hours;
  const ot20GrossPerWeek = safeHourly * 2.0 * safeOt20Hours;

  // Shift Premium
  let weeklyShiftPremium = 0;
  if (mode === 'advanced' && shiftPremiumAmount > 0) {
    if (shiftPremiumType === 'hourly') {
      weeklyShiftPremium = shiftPremiumAmount * totalHoursPerWeek;
    } else {
      // Fixed amount given per pay period (converted to weekly)
      weeklyShiftPremium = (shiftPremiumAmount * PARAMS.BIWEEKLY_PERIODS) / PARAMS.WEEKS_PER_YEAR;
    }
  }

  const weeklyGross = regularGrossPerWeek + ot15GrossPerWeek + ot20GrossPerWeek + weeklyShiftPremium;
  const annualGross = weeklyGross * PARAMS.WEEKS_PER_YEAR;

  // Annualized Non-Statutory Deductions (Inputs are calibrated per bi-weekly pay period as standard)
  let annualHealthIns = 0;
  let annualLifeDisabilityIns = 0;
  let annualDentalIns = 0;
  let annualEmployerTaxableBenefits = 0;
  let annualGroupRrsp = 0;
  let annualUnionDues = 0;
  let annualOtherDeductions = 0;

  if (mode === 'advanced') {
    annualHealthIns = Math.max(0, healthInsuranceEmployee || 0) * PARAMS.BIWEEKLY_PERIODS;
    annualLifeDisabilityIns = Math.max(0, lifeAndDisabilityInsuranceEmployee || 0) * PARAMS.BIWEEKLY_PERIODS;
    annualDentalIns = Math.max(0, dentalInsuranceEmployee || 0) * PARAMS.BIWEEKLY_PERIODS;
    annualEmployerTaxableBenefits = Math.max(0, employerTaxableBenefits || 0) * PARAMS.BIWEEKLY_PERIODS;

    if (groupRrspType === 'percent') {
      annualGroupRrsp = Math.max(0, (groupRrspValue || 0) / 100) * annualGross;
    } else {
      annualGroupRrsp = Math.max(0, groupRrspValue || 0) * PARAMS.BIWEEKLY_PERIODS;
    }

    if (unionDuesType === 'percent') {
      annualUnionDues = Math.max(0, (unionDuesValue || 0) / 100) * annualGross;
    } else {
      annualUnionDues = Math.max(0, unionDuesValue || 0) * PARAMS.BIWEEKLY_PERIODS;
    }

    annualOtherDeductions = Math.max(0, otherDeductionsPerPay || 0) * PARAMS.BIWEEKLY_PERIODS;
  }

  const annualGroupInsurance = annualHealthIns + annualLifeDisabilityIns + annualDentalIns;
  const annualRetirementAndUnion = annualGroupRrsp + annualUnionDues;

  // 1. Calculate RRQ (Régime de rentes du Québec)
  let annualRRQ = 0;
  if (annualGross > PARAMS.RRQ.EXEMPTION) {
    const contributoryBaseEarnings = Math.min(annualGross, PARAMS.RRQ.MGA_BASE) - PARAMS.RRQ.EXEMPTION;
    const baseContribution = Math.max(0, contributoryBaseEarnings * PARAMS.RRQ.BASE_RATE);

    let suppContribution = 0;
    if (annualGross > PARAMS.RRQ.MGA_BASE) {
      const suppEarnings = Math.min(annualGross, PARAMS.RRQ.MGA_SUPPLEMENTARY) - PARAMS.RRQ.MGA_BASE;
      suppContribution = Math.max(0, suppEarnings * PARAMS.RRQ.SUPP_RATE);
    }

    annualRRQ = baseContribution + suppContribution;
  }

  // 2. Calculate RQAP (Régime québécois d'assurance parentale)
  const insurableRQAP = Math.min(annualGross, PARAMS.RQAP.MAX_EARNINGS);
  const annualRQAP = insurableRQAP * PARAMS.RQAP.EMPLOYEE_RATE;

  // 3. Calculate AE (Assurance-Emploi au Québec - 1.32%)
  const insurableAE = Math.min(annualGross, PARAMS.AE.MAX_EARNINGS);
  const annualAE = insurableAE * PARAMS.AE.EMPLOYEE_RATE;

  // 4. Calculate Quebec Provincial Tax (Revenu Québec)
  // Worker deduction (Déduction pour travailleur 6% up to $1,380)
  const workerDeduction = Math.min(annualGross * PARAMS.QUEBEC.WORKER_DEDUCTION_RATE, PARAMS.QUEBEC.WORKER_DEDUCTION_MAX);

  // In Quebec:
  // - RRSP and Union dues reduce taxable income
  // - Employer-paid health/dental insurance (Avantage imposable) is TAXABLE in Quebec (Box J of RL-1)!
  const quebecTaxableBase = Math.max(
    0,
    annualGross + annualEmployerTaxableBenefits - workerDeduction - annualGroupRrsp - annualUnionDues
  );

  const { tax: rawProvincialTax, marginalRate: qcMarginalRate } = calculateProgressiveTax(
    quebecTaxableBase,
    PARAMS.QUEBEC.BRACKETS
  );

  // Quebec Non-Refundable Tax Credits
  const qcBasicCredit = PARAMS.QUEBEC.BPA * PARAMS.QUEBEC.TAX_CREDIT_RATE;
  const qcSocialContribCredit = (annualRRQ + annualRQAP) * PARAMS.QUEBEC.TAX_CREDIT_RATE;
  const totalQcCredits = qcBasicCredit + qcSocialContribCredit;

  const annualProvincialTax = Math.max(0, rawProvincialTax - totalQcCredits);

  // 5. Calculate Federal Income Tax (CRA / ARC)
  // At federal level, RRSP and Union dues reduce taxable income. Employer health benefits are NOT taxable federally!
  const federalTaxableBase = Math.max(0, annualGross - annualGroupRrsp - annualUnionDues);

  const { tax: rawFederalTax, marginalRate: fedMarginalRate } = calculateProgressiveTax(
    federalTaxableBase,
    PARAMS.FEDERAL.BRACKETS
  );

  // Federal Non-refundable credits
  const fedBasicCredit = PARAMS.FEDERAL.BPA * PARAMS.FEDERAL.TAX_CREDIT_RATE;
  const fedEmploymentCredit = Math.min(annualGross, PARAMS.FEDERAL.EMPLOYMENT_AMOUNT_MAX) * PARAMS.FEDERAL.TAX_CREDIT_RATE;
  const fedSocialContribCredit = (annualRRQ + annualAE) * PARAMS.FEDERAL.TAX_CREDIT_RATE;
  const totalFedCredits = fedBasicCredit + fedEmploymentCredit + fedSocialContribCredit;

  const basicFederalTax = Math.max(0, rawFederalTax - totalFedCredits);

  // Quebec Abatement (Abattement du Québec): 16.5% reduction on basic federal tax
  const quebecAbatement = basicFederalTax * PARAMS.FEDERAL.QUEBEC_ABATEMENT_RATE;
  const annualFederalTax = Math.max(0, basicFederalTax - quebecAbatement);

  // Totals
  const annualStatutoryDeductions = annualFederalTax + annualProvincialTax + annualRRQ + annualRQAP + annualAE;
  const annualNonStatutoryDeductions = annualGroupInsurance + annualRetirementAndUnion + annualOtherDeductions;
  const annualTotalDeductions = annualStatutoryDeductions + annualNonStatutoryDeductions;
  const annualNet = Math.max(0, annualGross - annualTotalDeductions);

  const effectiveTaxRate = annualGross > 0 ? (annualTotalDeductions / annualGross) * 100 : 0;
  const takeHomePercentage = annualGross > 0 ? (annualNet / annualGross) * 100 : 0;
  const combinedMarginalRate = (qcMarginalRate + fedMarginalRate * (1 - PARAMS.FEDERAL.QUEBEC_ABATEMENT_RATE)) * 100;

  // Real Net Rate per Hour
  const annualTotalHours = totalHoursPerWeek * PARAMS.WEEKS_PER_YEAR;
  const effectiveHourlyRateGross = annualTotalHours > 0 ? annualGross / annualTotalHours : safeHourly;
  const effectiveHourlyRateNet = annualTotalHours > 0 ? annualNet / annualTotalHours : 0;

  // Calculate Precision Score (0 - 100%)
  const factorsConfigured: string[] = ['Taux horaire', 'Horas semanais', 'Régimes légaux QC/ARC'];
  const factorsMissing: string[] = [];

  let precisionScore = 85; // Base precision for statutory tax only

  if (mode === 'advanced') {
    if (shiftPremiumAmount > 0) {
      precisionScore += 4;
      factorsConfigured.push('Primes de quart / horaire');
    }
    if (healthInsuranceEmployee > 0 || dentalInsuranceEmployee > 0 || lifeAndDisabilityInsuranceEmployee > 0) {
      precisionScore += 5;
      factorsConfigured.push('Assurance collective (Santé/Vie)');
    }
    if (employerTaxableBenefits > 0) {
      precisionScore += 3;
      factorsConfigured.push('Avantages imposables (Case J RL-1)');
    }
    if (groupRrspValue > 0) {
      precisionScore += 1.5;
      factorsConfigured.push('REER collectif');
    }
    if (unionDuesValue > 0) {
      precisionScore += 1;
      factorsConfigured.push('Cotisation syndicale');
    }
    if (otherDeductionsPerPay > 0) {
      precisionScore += 0.5;
      factorsConfigured.push('Cafétéria & déductions diverses');
    }
  } else {
    factorsMissing.push('Assurance collective (médicale/dentaire)');
    factorsMissing.push('Primes de quart / horaire');
    factorsMissing.push('Avantages imposables employeur');
    factorsMissing.push('REER ou syndicat (le cas échéant)');
  }

  precisionScore = Math.min(99.5, precisionScore);

  const precision: PrecisionBreakdown = {
    score: precisionScore,
    level: precisionScore >= 98 ? 'ultra' : precisionScore >= 92 ? 'high' : precisionScore >= 88 ? 'moderate' : 'basic',
    label:
      precisionScore >= 98
        ? 'Précision Maximale (~99%)'
        : precisionScore >= 92
        ? 'Haute Précision (~95%)'
        : 'Précision Standard (~85-90%)',
    description:
      precisionScore >= 98
        ? 'Reflète fidèlement votre talon de paie réel avec assurances, primes et avantages imposables.'
        : precisionScore >= 92
        ? 'Inclut la majorité des retenues de votre employeur.'
        : 'Estimation basée uniquement sur les retenues gouvernementales obligatoires (sans assurance collective ni primes).',
    factorsConfigured,
    factorsMissing,
  };

  // Helper to build PeriodResult
  const createPeriod = (freq: PayFrequency, label: string, periodsPerYear: number): PeriodResult => {
    const gross = annualGross / periodsPerYear;
    const fed = annualFederalTax / periodsPerYear;
    const prov = annualProvincialTax / periodsPerYear;
    const rrq = annualRRQ / periodsPerYear;
    const rqap = annualRQAP / periodsPerYear;
    const ae = annualAE / periodsPerYear;
    const groupIns = annualGroupInsurance / periodsPerYear;
    const retUnion = annualRetirementAndUnion / periodsPerYear;
    const other = annualOtherDeductions / periodsPerYear;
    const statutory = annualStatutoryDeductions / periodsPerYear;
    const nonStatutory = annualNonStatutoryDeductions / periodsPerYear;
    const deductions = annualTotalDeductions / periodsPerYear;
    const net = annualNet / periodsPerYear;

    return {
      frequency: freq,
      label,
      periodsPerYear,
      gross: Math.round(gross * 100) / 100,
      federalTax: Math.round(fed * 100) / 100,
      provincialTax: Math.round(prov * 100) / 100,
      rrq: Math.round(rrq * 100) / 100,
      rqap: Math.round(rqap * 100) / 100,
      ae: Math.round(ae * 100) / 100,
      groupInsurance: Math.round(groupIns * 100) / 100,
      retirementAndUnion: Math.round(retUnion * 100) / 100,
      otherDeductions: Math.round(other * 100) / 100,
      totalStatutoryDeductions: Math.round(statutory * 100) / 100,
      totalNonStatutoryDeductions: Math.round(nonStatutory * 100) / 100,
      totalDeductions: Math.round(deductions * 100) / 100,
      net: Math.round(net * 100) / 100,
      effectiveTaxRate: Math.round(effectiveTaxRate * 10) / 10,
    };
  };

  const cascade = {
    hourly: {
      frequency: 'hourly' as PayFrequency,
      label: 'Par Heure',
      periodsPerYear: annualTotalHours || 1,
      gross: Math.round(effectiveHourlyRateGross * 100) / 100,
      federalTax: annualTotalHours ? Math.round((annualFederalTax / annualTotalHours) * 100) / 100 : 0,
      provincialTax: annualTotalHours ? Math.round((annualProvincialTax / annualTotalHours) * 100) / 100 : 0,
      rrq: annualTotalHours ? Math.round((annualRRQ / annualTotalHours) * 100) / 100 : 0,
      rqap: annualTotalHours ? Math.round((annualRQAP / annualTotalHours) * 100) / 100 : 0,
      ae: annualTotalHours ? Math.round((annualAE / annualTotalHours) * 100) / 100 : 0,
      groupInsurance: annualTotalHours ? Math.round((annualGroupInsurance / annualTotalHours) * 100) / 100 : 0,
      retirementAndUnion: annualTotalHours ? Math.round((annualRetirementAndUnion / annualTotalHours) * 100) / 100 : 0,
      otherDeductions: annualTotalHours ? Math.round((annualOtherDeductions / annualTotalHours) * 100) / 100 : 0,
      totalStatutoryDeductions: annualTotalHours ? Math.round((annualStatutoryDeductions / annualTotalHours) * 100) / 100 : 0,
      totalNonStatutoryDeductions: annualTotalHours ? Math.round((annualNonStatutoryDeductions / annualTotalHours) * 100) / 100 : 0,
      totalDeductions: annualTotalHours ? Math.round((annualTotalDeductions / annualTotalHours) * 100) / 100 : 0,
      net: Math.round(effectiveHourlyRateNet * 100) / 100,
      effectiveTaxRate: Math.round(effectiveTaxRate * 10) / 10,
    },
    daily: createPeriod('daily', 'Par Jour (8h)', PARAMS.DAYS_PER_YEAR),
    weekly: createPeriod('weekly', 'Hebdomadaire', PARAMS.WEEKS_PER_YEAR),
    biweekly: createPeriod('biweekly', 'Aux deux semaines (Quinzena)', PARAMS.BIWEEKLY_PERIODS),
    monthly: createPeriod('monthly', 'Mensuel', PARAMS.MONTHS_PER_YEAR),
    annually: createPeriod('annually', 'Annuel', 1),
  };

  const selectedPeriod = cascade[frequency] || cascade.biweekly;

  const deductionsList: DeductionItem[] = [
    // Statutory Government
    {
      name: 'Revenu Québec (Impôt Provincial)',
      code: 'QC_TAX',
      annual: Math.round(annualProvincialTax * 100) / 100,
      period: Math.round(selectedPeriod.provincialTax * 100) / 100,
      category: 'government',
      rateDescription: '14% à 25.75% selon le palier',
      description: 'Impôt provincial net (Revenu Québec). Tient compte des avantages imposables de l’employeur.',
    },
    {
      name: 'CRA / ARC (Impôt Fédéral)',
      code: 'FED_TAX',
      annual: Math.round(annualFederalTax * 100) / 100,
      period: Math.round(selectedPeriod.federalTax * 100) / 100,
      category: 'government',
      rateDescription: '15% à 33% (-16.5% Abattement QC)',
      description: 'Impôt fédéral avec réduction directe de 16.5% pour les résidents fiscaux du Québec.',
    },
    {
      name: 'RRQ (Régime de rentes du Québec)',
      code: 'RRQ',
      annual: Math.round(annualRRQ * 100) / 100,
      period: Math.round(selectedPeriod.rrq * 100) / 100,
      category: 'government',
      rateDescription: '6.40% (exemption 3 500 $, max 71 300 $)',
      description: 'Régime de retraite public du Québec pour les travailleurs salariés.',
    },
    {
      name: 'AE (Assurance-Emploi)',
      code: 'AE',
      annual: Math.round(annualAE * 100) / 100,
      period: Math.round(selectedPeriod.ae * 100) / 100,
      category: 'government',
      rateDescription: '1.32% (taux réduit spécial Québec)',
      description: 'Assurance fédérale en cas de chômage. Taux avantageux exclusif au Québec.',
    },
    {
      name: 'RQAP (Assurance Parentale)',
      code: 'RQAP',
      annual: Math.round(annualRQAP * 100) / 100,
      period: Math.round(selectedPeriod.rqap * 100) / 100,
      category: 'government',
      rateDescription: '0.494% (max 94 000 $)',
      description: 'Congés parentaux, maternité et paternité administrés par le Québec.',
    },
  ];

  // Add Insurance & Workplace items if configured
  if (annualGroupInsurance > 0) {
    deductionsList.push({
      name: 'Assurance Collective (Santé, Vie, Accident)',
      code: 'ASSUR_COLL',
      annual: Math.round(annualGroupInsurance * 100) / 100,
      period: Math.round(selectedPeriod.groupInsurance * 100) / 100,
      category: 'insurance',
      rateDescription: 'Régime d’assurance de votre entreprise',
      description: 'Part payée par l’employé pour l’assurance médicale, vie de base, accidents et personnes à charge.',
    });
  }

  if (annualRetirementAndUnion > 0) {
    deductionsList.push({
      name: 'REER Collectif & Cotisations Syndicales',
      code: 'REER_SYND',
      annual: Math.round(annualRetirementAndUnion * 100) / 100,
      period: Math.round(selectedPeriod.retirementAndUnion * 100) / 100,
      category: 'retirement',
      rateDescription: 'Déductible d’impôt',
      description: 'Épargne retraite collective et/ou retenue syndicale (déductibles d’impôt à la source).',
    });
  }

  if (annualOtherDeductions > 0) {
    deductionsList.push({
      name: 'Cafétéria & Achats Magasin Usine',
      code: 'DIVERS',
      annual: Math.round(annualOtherDeductions * 100) / 100,
      period: Math.round(selectedPeriod.otherDeductions * 100) / 100,
      category: 'workplace',
      rateDescription: 'Retenues internes sur la paie',
      description: 'Repas à prix préférentiel à la cafétéria de l’entreprise ou achats au magasin de l’usine.',
    });
  }

  return {
    input,
    totalHoursPerWeek,
    effectiveHourlyRateGross,
    effectiveHourlyRateNet,
    annualGross: Math.round(annualGross * 100) / 100,
    annualFederalTax: Math.round(annualFederalTax * 100) / 100,
    annualProvincialTax: Math.round(annualProvincialTax * 100) / 100,
    annualRRQ: Math.round(annualRRQ * 100) / 100,
    annualRQAP: Math.round(annualRQAP * 100) / 100,
    annualAE: Math.round(annualAE * 100) / 100,
    annualGroupInsurance: Math.round(annualGroupInsurance * 100) / 100,
    annualRetirementAndUnion: Math.round(annualRetirementAndUnion * 100) / 100,
    annualOtherDeductions: Math.round(annualOtherDeductions * 100) / 100,
    annualTotalDeductions: Math.round(annualTotalDeductions * 100) / 100,
    annualNet: Math.round(annualNet * 100) / 100,
    effectiveTaxRate: Math.round(effectiveTaxRate * 10) / 10,
    marginalTaxRate: Math.round(combinedMarginalRate * 10) / 10,
    takeHomePercentage: Math.round(takeHomePercentage * 10) / 10,
    precision,
    selectedPeriod,
    cascade,
    deductionsList,
  };
}

export function formatCurrency(amount: number, locale: string = 'fr-CA'): string {
  return new Intl.NumberFormat(locale === 'pt-BR' ? 'pt-BR' : locale === 'en-CA' ? 'en-CA' : 'fr-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// -------------------------------------------------------------
// Quebec Workplace Benefits Calculators (Normes du Travail CNESST)
// -------------------------------------------------------------

export interface VacationBenefitResult {
  yearsOfService: number;
  ratePercent: number; // 4% or 6%
  weeksPaidLeave: number; // 2 or 3 weeks
  annualAmount: number;
  biweeklyAmount: number;
  weeklyAmount: number;
}

export function calculateQuebecVacation(annualGross: number, yearsOfService: number): VacationBenefitResult {
  const ratePercent = yearsOfService >= 3 ? 6 : 4;
  const weeksPaidLeave = yearsOfService >= 3 ? 3 : 2;
  const annualAmount = (annualGross * ratePercent) / 100;
  const biweeklyAmount = annualAmount / 26;
  const weeklyAmount = annualAmount / 52;

  return {
    yearsOfService,
    ratePercent,
    weeksPaidLeave,
    annualAmount: Math.round(annualAmount * 100) / 100,
    biweeklyAmount: Math.round(biweeklyAmount * 100) / 100,
    weeklyAmount: Math.round(weeklyAmount * 100) / 100,
  };
}

export interface HolidayBenefitResult {
  holidayPayPerDay: number; // 1/20 rule
  annualEightHolidaysTotal: number;
  holidaysCount: number;
  explanation: string;
}

export function calculateQuebecStatutoryHolidays(biweeklyGross: number): HolidayBenefitResult {
  // CNESST 1/20 rule: 1/20 of the wages earned during the 4 complete pay weeks preceding the holiday
  // In a bi-weekly cycle, 4 weeks = 2 bi-weekly pays
  const fourWeeksEarnings = biweeklyGross * 2;
  const holidayPayPerDay = fourWeeksEarnings / 20; // exactly 10% of a bi-weekly pay
  const annualEightHolidaysTotal = holidayPayPerDay * 8; // 8 official statutory paid holidays in QC

  return {
    holidayPayPerDay: Math.round(holidayPayPerDay * 100) / 100,
    annualEightHolidaysTotal: Math.round(annualEightHolidaysTotal * 100) / 100,
    holidaysCount: 8,
    explanation: 'Règle du 1/20 de la CNESST (Loi sur les normes du travail art. 62)',
  };
}

export interface RrspMatchResult {
  employeePercent: number;
  employerMatchPercent: number;
  employeeAnnualContribution: number;
  employerAnnualContribution: number;
  totalAnnualInvested: number;
  biweeklyEmployeeCost: number;
  biweeklyEmployerFreeMoney: number;
  estimatedTaxSavingsAnnual: number;
}

export function calculateQuebecRrspMatch(
  annualGross: number,
  employeePercent: number,
  employerMatchPercent: number,
  marginalTaxRate: number
): RrspMatchResult {
  const employeeAnnual = (annualGross * employeePercent) / 100;
  const employerAnnual = (annualGross * employerMatchPercent) / 100;
  const totalAnnual = employeeAnnual + employerAnnual;
  const taxSavings = (employeeAnnual * (marginalTaxRate || 28)) / 100;

  return {
    employeePercent,
    employerMatchPercent,
    employeeAnnualContribution: Math.round(employeeAnnual * 100) / 100,
    employerAnnualContribution: Math.round(employerAnnual * 100) / 100,
    totalAnnualInvested: Math.round(totalAnnual * 100) / 100,
    biweeklyEmployeeCost: Math.round((employeeAnnual / 26) * 100) / 100,
    biweeklyEmployerFreeMoney: Math.round((employerAnnual / 26) * 100) / 100,
    estimatedTaxSavingsAnnual: Math.round(taxSavings * 100) / 100,
  };
}

// -------------------------------------------------------------
// Job Offer Comparator (Comparateur d'Offres d'Emploi)
// -------------------------------------------------------------

export interface JobOfferInput {
  title: string;
  hourlyRate: number;
  hoursPerWeek: number;
  shiftPremiumPerHour: number;
  biweeklyHealthInsurance: number;
  employerRrspMatchPct: number;
}

export interface JobOfferEvaluation {
  title: string;
  annualGross: number;
  biweeklyGross: number;
  annualNet: number;
  biweeklyNet: number;
  effectiveTaxRate: number;
  annualRrspEmployerFreeMoney: number;
  totalCompensationAnnual: number;
  effectiveHourlyNet: number;
}

export interface JobOfferComparisonResult {
  offerA: JobOfferEvaluation;
  offerB: JobOfferEvaluation;
  annualNetDiff: number;
  biweeklyNetDiff: number;
  winner: 'A' | 'B' | 'TIE';
  totalCompensationDiff: number;
}

export function compareJobOffers(offerA: JobOfferInput, offerB: JobOfferInput): JobOfferComparisonResult {
  const evalOffer = (o: JobOfferInput): JobOfferEvaluation => {
    const regHours = Math.max(1, o.hoursPerWeek || 40);
    const regularAnnual = o.hourlyRate * regHours * 52;
    const premiumAnnual = o.shiftPremiumPerHour * regHours * 52;
    const annualGross = regularAnnual + premiumAnnual;
    const biweeklyGross = annualGross / 26;

    const calc = calculateQuebecPay({
      entryMode: 'hourly',
      hourlyRate: o.hourlyRate,
      regularHoursPerWeek: regHours,
      overtime15HoursPerWeek: 0,
      overtime20HoursPerWeek: 0,
      frequency: 'biweekly',
      mode: o.shiftPremiumPerHour > 0 || o.biweeklyHealthInsurance > 0 ? 'advanced' : 'simple',
      shiftPremiumType: 'hourly',
      shiftPremiumAmount: o.shiftPremiumPerHour,
      healthInsuranceEmployee: o.biweeklyHealthInsurance,
      lifeAndDisabilityInsuranceEmployee: 0,
      dentalInsuranceEmployee: 0,
      employerTaxableBenefits: 0,
      groupRrspType: 'percent',
      groupRrspValue: 0,
      unionDuesType: 'percent',
      unionDuesValue: 0,
      otherDeductionsPerPay: 0,
    });

    const annualNet = calc.annualNet;
    const biweeklyNet = calc.cascade.biweekly.net;
    const annualRrspEmployerFreeMoney = (annualGross * (o.employerRrspMatchPct || 0)) / 100;
    const totalCompensationAnnual = annualNet + annualRrspEmployerFreeMoney;
    const totalAnnualHours = regHours * 52;
    const effectiveHourlyNet = totalAnnualHours > 0 ? annualNet / totalAnnualHours : 0;

    return {
      title: o.title,
      annualGross: Math.round(annualGross),
      biweeklyGross: Math.round(biweeklyGross * 100) / 100,
      annualNet: Math.round(annualNet),
      biweeklyNet: Math.round(biweeklyNet * 100) / 100,
      effectiveTaxRate: calc.effectiveTaxRate,
      annualRrspEmployerFreeMoney: Math.round(annualRrspEmployerFreeMoney),
      totalCompensationAnnual: Math.round(totalCompensationAnnual),
      effectiveHourlyNet: Math.round(effectiveHourlyNet * 100) / 100,
    };
  };

  const evalA = evalOffer(offerA);
  const evalB = evalOffer(offerB);
  const annualNetDiff = Math.round(evalB.annualNet - evalA.annualNet);
  const biweeklyNetDiff = Math.round((evalB.biweeklyNet - evalA.biweeklyNet) * 100) / 100;
  const totalCompensationDiff = Math.round(evalB.totalCompensationAnnual - evalA.totalCompensationAnnual);

  let winner: 'A' | 'B' | 'TIE' = 'TIE';
  if (annualNetDiff > 10) winner = 'B';
  else if (annualNetDiff < -10) winner = 'A';

  return {
    offerA: evalA,
    offerB: evalB,
    annualNetDiff,
    biweeklyNetDiff,
    winner,
    totalCompensationDiff,
  };
}
