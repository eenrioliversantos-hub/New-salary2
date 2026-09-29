/**
 * Enhanced Multi-Jurisdiction Payroll & Tax Calculation Engine (All Canada 2025/2026)
 *
 * Expands beyond Quebec to support all 10 provinces & 3 territories:
 * - QC: Revenu Québec (14%-25.75%), 16.5% Quebec Federal Abatement, RRQ (6.40% + 4%), RQAP (0.494%), reduced EI (1.32%)
 * - ON: Ontario Tax (5.05%-13.16%), Ontario Surtax (20%/36%), Ontario Health Premium ($0-$900), standard CPP & EI (1.64%)
 * - BC: BC Tax (5.06%-20.5%), standard CPP & EI
 * - AB: Alberta Tax (10%-15%), zero sales tax, high BPA, standard CPP & EI
 * - MB, SK, NS, NB, NL, PE, YT, NT, NU: respective provincial tax brackets, BPA, and rules
 */

import {
  CanadianProvince,
  CANADIAN_PROVINCES,
  CANADA_FISCAL_RULES,
  ALL_CANADA_CONSTANTS,
  ProvinceInfo,
} from './canada-tax-provinces';

export type { CanadianProvince, ProvinceInfo };
export { CANADIAN_PROVINCES, CANADA_FISCAL_RULES, ALL_CANADA_CONSTANTS };

export type PayFrequency = 'hourly' | 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'annually';
export type SalaryEntryMode = 'hourly' | 'annual' | 'biweekly' | 'monthly';

export interface TaxInput {
  // Jurisdiction (Defaults to QC for backward compatibility)
  province?: CanadianProvince;

  // Entry Mode (Hourly Rate vs. Fixed Gross Salary)
  entryMode: SalaryEntryMode;
  annualGrossSalary?: number; // e.g. $65,000
  periodGrossSalary?: number; // e.g. $2,500

  // Basic Inputs
  hourlyRate: number;
  regularHoursPerWeek: number;
  overtime15HoursPerWeek: number;
  overtime20HoursPerWeek: number;
  frequency: PayFrequency;

  // Calculation Mode
  mode: 'simple' | 'advanced';

  // Advanced Inputs: Premiums & Earnings
  shiftPremiumType: 'hourly' | 'fixed';
  shiftPremiumAmount: number;

  // Advanced Inputs: Group Insurance
  healthInsuranceEmployee: number;
  lifeAndDisabilityInsuranceEmployee: number;
  dentalInsuranceEmployee: number;

  // Taxable benefits paid by employer (e.g. Box J of RL-1 in QC)
  employerTaxableBenefits: number;

  // Retirement & Union
  groupRrspType: 'percent' | 'fixed';
  groupRrspValue: number;
  unionDuesType: 'percent' | 'fixed';
  unionDuesValue: number;

  // Other deductions (Cafeteria, etc.)
  otherDeductionsPerPay: number;
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
  rrq: number; // In other provinces, represents CPP
  rqap: number; // 0 in other provinces (covered by federal EI)
  ae: number; // Federal EI
  groupInsurance: number;
  retirementAndUnion: number;
  otherDeductions: number;
  totalStatutoryDeductions: number;
  totalNonStatutoryDeductions: number;
  totalDeductions: number;
  net: number;
  effectiveTaxRate: number;
}

export interface PrecisionBreakdown {
  score: number;
  level: 'basic' | 'moderate' | 'high' | 'ultra';
  label: string;
  description: string;
  factorsConfigured: string[];
  factorsMissing: string[];
}

export interface CalculationResult {
  province: CanadianProvince;
  provinceInfo: ProvinceInfo;
  input: TaxInput;
  totalHoursPerWeek: number;
  effectiveHourlyRateGross: number;
  effectiveHourlyRateNet: number;
  annualGross: number;
  annualFederalTax: number;
  annualProvincialTax: number;
  annualRRQ: number; // RRQ (QC) or CPP (Rest of Canada)
  annualRQAP: number; // RQAP (QC only)
  annualAE: number; // Employment Insurance (AE / EI)
  annualGroupInsurance: number;
  annualRetirementAndUnion: number;
  annualOtherDeductions: number;
  annualTotalDeductions: number;
  annualNet: number;
  effectiveTaxRate: number;
  marginalTaxRate: number;
  takeHomePercentage: number;
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

// Helper function for progressive tax calculations
function calculateProgressiveTax(
  income: number,
  brackets: { max: number; rate: number }[]
): { tax: number; marginalRate: number } {
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

// Core Canadian Pay Calculation (Supports all 13 jurisdictions)
export function calculateQuebecPay(input: TaxInput): CalculationResult {
  const province: CanadianProvince = input.province || 'QC';
  const provInfo = CANADIAN_PROVINCES[province] || CANADIAN_PROVINCES.QC;
  const provRules = CANADA_FISCAL_RULES[province] || CANADA_FISCAL_RULES.QC;

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
    resolvedHourlyRate = annualGrossSalary / (safeRegHours * ALL_CANADA_CONSTANTS.WEEKS_PER_YEAR);
  } else if (entryMode === 'biweekly' && periodGrossSalary && periodGrossSalary > 0) {
    resolvedHourlyRate = periodGrossSalary / (safeRegHours * 2);
  } else if (entryMode === 'monthly' && periodGrossSalary && periodGrossSalary > 0) {
    resolvedHourlyRate = (periodGrossSalary * ALL_CANADA_CONSTANTS.MONTHS_PER_YEAR) / (safeRegHours * ALL_CANADA_CONSTANTS.WEEKS_PER_YEAR);
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
      weeklyShiftPremium = (shiftPremiumAmount * ALL_CANADA_CONSTANTS.BIWEEKLY_PERIODS) / ALL_CANADA_CONSTANTS.WEEKS_PER_YEAR;
    }
  }

  const weeklyGross = regularGrossPerWeek + ot15GrossPerWeek + ot20GrossPerWeek + weeklyShiftPremium;
  const annualGross = weeklyGross * ALL_CANADA_CONSTANTS.WEEKS_PER_YEAR;

  // Annualized Non-Statutory Deductions
  let annualHealthIns = 0;
  let annualLifeDisabilityIns = 0;
  let annualDentalIns = 0;
  let annualEmployerTaxableBenefits = 0;
  let annualGroupRrsp = 0;
  let annualUnionDues = 0;
  let annualOtherDeductions = 0;

  if (mode === 'advanced') {
    annualHealthIns = Math.max(0, healthInsuranceEmployee || 0) * ALL_CANADA_CONSTANTS.BIWEEKLY_PERIODS;
    annualLifeDisabilityIns = Math.max(0, lifeAndDisabilityInsuranceEmployee || 0) * ALL_CANADA_CONSTANTS.BIWEEKLY_PERIODS;
    annualDentalIns = Math.max(0, dentalInsuranceEmployee || 0) * ALL_CANADA_CONSTANTS.BIWEEKLY_PERIODS;
    annualEmployerTaxableBenefits = Math.max(0, employerTaxableBenefits || 0) * ALL_CANADA_CONSTANTS.BIWEEKLY_PERIODS;

    if (groupRrspType === 'percent') {
      annualGroupRrsp = Math.max(0, (groupRrspValue || 0) / 100) * annualGross;
    } else {
      annualGroupRrsp = Math.max(0, groupRrspValue || 0) * ALL_CANADA_CONSTANTS.BIWEEKLY_PERIODS;
    }

    if (unionDuesType === 'percent') {
      annualUnionDues = Math.max(0, (unionDuesValue || 0) / 100) * annualGross;
    } else {
      annualUnionDues = Math.max(0, unionDuesValue || 0) * ALL_CANADA_CONSTANTS.BIWEEKLY_PERIODS;
    }

    annualOtherDeductions = Math.max(0, otherDeductionsPerPay || 0) * ALL_CANADA_CONSTANTS.BIWEEKLY_PERIODS;
  }

  const annualGroupInsurance = annualHealthIns + annualLifeDisabilityIns + annualDentalIns;
  const annualRetirementAndUnion = annualGroupRrsp + annualUnionDues;

  // 1. Calculate Pension: RRQ (Québec) vs CPP (Rest of Canada)
  let annualRRQ = 0; // RRQ or CPP
  const isQuebec = province === 'QC';

  if (isQuebec) {
    // RRQ: 6.40% base + 4.0% supp tier 2
    const RRQ_EXEMPTION = 3500;
    const RRQ_MGA_BASE = 71300;
    const RRQ_MGA_SUPP = 81900;
    if (annualGross > RRQ_EXEMPTION) {
      const baseEarnings = Math.min(annualGross, RRQ_MGA_BASE) - RRQ_EXEMPTION;
      const baseContribution = Math.max(0, baseEarnings * 0.064);

      let suppContribution = 0;
      if (annualGross > RRQ_MGA_BASE) {
        const suppEarnings = Math.min(annualGross, RRQ_MGA_SUPP) - RRQ_MGA_BASE;
        suppContribution = Math.max(0, suppEarnings * 0.04);
      }
      annualRRQ = baseContribution + suppContribution;
    }
  } else {
    // CPP: 5.95% base + 4.0% supp tier 2
    const { CPP } = ALL_CANADA_CONSTANTS;
    if (annualGross > CPP.EXEMPTION) {
      const baseEarnings = Math.min(annualGross, CPP.MGA_BASE) - CPP.EXEMPTION;
      const baseContribution = Math.max(0, baseEarnings * CPP.BASE_RATE);

      let suppContribution = 0;
      if (annualGross > CPP.MGA_BASE) {
        const suppEarnings = Math.min(annualGross, CPP.MGA_SUPPLEMENTARY) - CPP.MGA_BASE;
        suppContribution = Math.max(0, suppEarnings * CPP.SUPP_RATE);
      }
      annualRRQ = baseContribution + suppContribution;
    }
  }

  // 2. Calculate RQAP (Parental) - QC only
  let annualRQAP = 0;
  if (isQuebec) {
    const RQAP_MAX = 94000;
    const RQAP_RATE = 0.00494;
    annualRQAP = Math.min(annualGross, RQAP_MAX) * RQAP_RATE;
  }

  // 3. Calculate AE / Employment Insurance (EI)
  const eiMaxEarnings = 65700;
  const eiRate = provInfo.eiRate; // 1.32% in QC, 1.64% rest of Canada
  const annualAE = Math.min(annualGross, eiMaxEarnings) * eiRate;

  // 4. Calculate Provincial / Territorial Tax
  let annualProvincialTax = 0;
  let provMarginalRate = provRules.brackets[0].rate;

  let workerDeduction = 0;
  if (provRules.workerDeduction) {
    workerDeduction = Math.min(
      annualGross * provRules.workerDeduction.rate,
      provRules.workerDeduction.max
    );
  }

  // In QC, employer health insurance (Avantage imposable) is taxable provincially (Box J RL-1)
  const provTaxableBase = Math.max(
    0,
    annualGross +
      (isQuebec ? annualEmployerTaxableBenefits : 0) -
      workerDeduction -
      annualGroupRrsp -
      annualUnionDues
  );

  const { tax: rawProvTax, marginalRate } = calculateProgressiveTax(provTaxableBase, provRules.brackets);
  provMarginalRate = marginalRate;

  // Provincial Credits
  const provBasicCredit = provRules.bpa * provRules.creditRate;
  const provSocialCredit = (annualRRQ + (isQuebec ? annualRQAP : annualAE)) * provRules.creditRate;
  const totalProvCredits = provBasicCredit + provSocialCredit;

  let baseProvTax = Math.max(0, rawProvTax - totalProvCredits);

  // Ontario Surtax & Health Premium
  if (province === 'ON' && provRules.surtax) {
    let ontarioSurtax = 0;
    if (baseProvTax > provRules.surtax.threshold1) {
      ontarioSurtax += (baseProvTax - provRules.surtax.threshold1) * provRules.surtax.rate1;
    }
    if (provRules.surtax.threshold2 && baseProvTax > provRules.surtax.threshold2 && provRules.surtax.rate2) {
      ontarioSurtax += (baseProvTax - provRules.surtax.threshold2) * provRules.surtax.rate2;
    }
    baseProvTax += ontarioSurtax;

    if (provRules.healthPremium) {
      const ohp = provRules.healthPremium(provTaxableBase);
      baseProvTax += ohp;
    }
  }

  annualProvincialTax = Math.max(0, baseProvTax);

  // 5. Calculate Federal Income Tax (CRA / ARC)
  const federalTaxableBase = Math.max(0, annualGross - annualGroupRrsp - annualUnionDues);

  const { tax: rawFederalTax, marginalRate: fedMarginalRate } = calculateProgressiveTax(
    federalTaxableBase,
    ALL_CANADA_CONSTANTS.FEDERAL.BRACKETS
  );

  // Federal Non-refundable credits
  const fedBasicCredit = ALL_CANADA_CONSTANTS.FEDERAL.BPA * ALL_CANADA_CONSTANTS.FEDERAL.TAX_CREDIT_RATE;
  const fedEmploymentCredit =
    Math.min(annualGross, ALL_CANADA_CONSTANTS.FEDERAL.EMPLOYMENT_AMOUNT_MAX) *
    ALL_CANADA_CONSTANTS.FEDERAL.TAX_CREDIT_RATE;
  const fedSocialCredit = (annualRRQ + annualAE) * ALL_CANADA_CONSTANTS.FEDERAL.TAX_CREDIT_RATE;
  const totalFedCredits = fedBasicCredit + fedEmploymentCredit + fedSocialCredit;

  const basicFederalTax = Math.max(0, rawFederalTax - totalFedCredits);

  // Quebec Abatement: 16.5% reduction on basic federal tax for Quebec residents ONLY
  let quebecAbatement = 0;
  if (provInfo.hasQuebecAbatement) {
    quebecAbatement = basicFederalTax * ALL_CANADA_CONSTANTS.FEDERAL.QUEBEC_ABATEMENT_RATE;
  }
  const annualFederalTax = Math.max(0, basicFederalTax - quebecAbatement);

  // Totals
  const annualStatutoryDeductions = annualFederalTax + annualProvincialTax + annualRRQ + annualRQAP + annualAE;
  const annualNonStatutoryDeductions = annualGroupInsurance + annualRetirementAndUnion + annualOtherDeductions;
  const annualTotalDeductions = annualStatutoryDeductions + annualNonStatutoryDeductions;
  const annualNet = Math.max(0, annualGross - annualTotalDeductions);

  const effectiveTaxRate = annualGross > 0 ? (annualTotalDeductions / annualGross) * 100 : 0;
  const takeHomePercentage = annualGross > 0 ? (annualNet / annualGross) * 100 : 0;
  const combinedMarginalRate =
    (provMarginalRate + fedMarginalRate * (1 - (provInfo.hasQuebecAbatement ? ALL_CANADA_CONSTANTS.FEDERAL.QUEBEC_ABATEMENT_RATE : 0))) * 100;

  // Real Net Rate per Hour
  const annualTotalHours = totalHoursPerWeek * ALL_CANADA_CONSTANTS.WEEKS_PER_YEAR;
  const effectiveHourlyRateGross = annualTotalHours > 0 ? annualGross / annualTotalHours : safeHourly;
  const effectiveHourlyRateNet = annualTotalHours > 0 ? annualNet / annualTotalHours : 0;

  // Precision breakdown
  const factorsConfigured: string[] = ['Taux horaire', 'Heures de travail', `Barèmes officiels (${provInfo.name.fr})`];
  const factorsMissing: string[] = [];
  let precisionScore = 86;

  if (mode === 'advanced') {
    if (shiftPremiumAmount > 0) {
      precisionScore += 4;
      factorsConfigured.push('Primes de quart');
    }
    if (healthInsuranceEmployee > 0 || dentalInsuranceEmployee > 0 || lifeAndDisabilityInsuranceEmployee > 0) {
      precisionScore += 5;
      factorsConfigured.push('Assurance collective');
    }
    if (employerTaxableBenefits > 0) {
      precisionScore += 3;
      factorsConfigured.push('Avantages imposables');
    }
    if (groupRrspValue > 0) {
      precisionScore += 1.5;
      factorsConfigured.push('REER collectif');
    }
    if (unionDuesValue > 0) {
      precisionScore += 1;
      factorsConfigured.push('Cotisation syndicale');
    }
  } else {
    factorsMissing.push('Assurance collective (médicale/dentaire)');
    factorsMissing.push('Primes de quart');
    factorsMissing.push('REER collectif');
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
    description: `Calcul adapté aux règles fiscales et sociales de : ${provInfo.name.fr}.`,
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
    const grpIns = annualGroupInsurance / periodsPerYear;
    const ret = annualRetirementAndUnion / periodsPerYear;
    const oth = annualOtherDeductions / periodsPerYear;

    const statDeds = fed + prov + rrq + rqap + ae;
    const nonStatDeds = grpIns + ret + oth;
    const totDeds = statDeds + nonStatDeds;
    const net = gross - totDeds;

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
      groupInsurance: Math.round(grpIns * 100) / 100,
      retirementAndUnion: Math.round(ret * 100) / 100,
      otherDeductions: Math.round(oth * 100) / 100,
      totalStatutoryDeductions: Math.round(statDeds * 100) / 100,
      totalNonStatutoryDeductions: Math.round(nonStatDeds * 100) / 100,
      totalDeductions: Math.round(totDeds * 100) / 100,
      net: Math.round(net * 100) / 100,
      effectiveTaxRate: gross > 0 ? Math.round((totDeds / gross) * 1000) / 10 : 0,
    };
  };

  const cascade = {
    hourly: {
      frequency: 'hourly' as PayFrequency,
      label: 'Par Heure (Brut vs Net Réel)',
      periodsPerYear: annualTotalHours,
      gross: Math.round(effectiveHourlyRateGross * 100) / 100,
      federalTax: annualTotalHours > 0 ? Math.round((annualFederalTax / annualTotalHours) * 100) / 100 : 0,
      provincialTax: annualTotalHours > 0 ? Math.round((annualProvincialTax / annualTotalHours) * 100) / 100 : 0,
      rrq: annualTotalHours > 0 ? Math.round((annualRRQ / annualTotalHours) * 100) / 100 : 0,
      rqap: annualTotalHours > 0 ? Math.round((annualRQAP / annualTotalHours) * 100) / 100 : 0,
      ae: annualTotalHours > 0 ? Math.round((annualAE / annualTotalHours) * 100) / 100 : 0,
      groupInsurance: annualTotalHours > 0 ? Math.round((annualGroupInsurance / annualTotalHours) * 100) / 100 : 0,
      retirementAndUnion: annualTotalHours > 0 ? Math.round((annualRetirementAndUnion / annualTotalHours) * 100) / 100 : 0,
      otherDeductions: annualTotalHours > 0 ? Math.round((annualOtherDeductions / annualTotalHours) * 100) / 100 : 0,
      totalStatutoryDeductions: annualTotalHours > 0 ? Math.round((annualStatutoryDeductions / annualTotalHours) * 100) / 100 : 0,
      totalNonStatutoryDeductions: annualTotalHours > 0 ? Math.round((annualNonStatutoryDeductions / annualTotalHours) * 100) / 100 : 0,
      totalDeductions: annualTotalHours > 0 ? Math.round((annualTotalDeductions / annualTotalHours) * 100) / 100 : 0,
      net: Math.round(effectiveHourlyRateNet * 100) / 100,
      effectiveTaxRate: Math.round(effectiveTaxRate * 10) / 10,
    },
    daily: createPeriod('daily', 'Par Jour (8h)', 260),
    weekly: createPeriod('weekly', 'Hebdomadaire', ALL_CANADA_CONSTANTS.WEEKS_PER_YEAR),
    biweekly: createPeriod('biweekly', 'Aux deux semaines (Quinzena)', ALL_CANADA_CONSTANTS.BIWEEKLY_PERIODS),
    monthly: createPeriod('monthly', 'Mensuel', ALL_CANADA_CONSTANTS.MONTHS_PER_YEAR),
    annually: createPeriod('annually', 'Annuel', 1),
  };

  const selectedPeriod = cascade[frequency] || cascade.biweekly;

  const deductionsList: DeductionItem[] = [
    {
      name: `${provInfo.name.fr} (Impôt Provincial / Territorial)`,
      code: `${province}_TAX`,
      annual: Math.round(annualProvincialTax * 100) / 100,
      period: Math.round(selectedPeriod.provincialTax * 100) / 100,
      category: 'government',
      rateDescription: `Barèmes ${provInfo.name.fr}`,
      description: `Impôt sur le revenu perçu par ${provInfo.name.fr}.`,
    },
    {
      name: 'CRA / ARC (Impôt Fédéral)',
      code: 'FED_TAX',
      annual: Math.round(annualFederalTax * 100) / 100,
      period: Math.round(selectedPeriod.federalTax * 100) / 100,
      category: 'government',
      rateDescription: isQuebec ? '15% à 33% (-16.5% Abattement QC)' : '15% à 33%',
      description: isQuebec
        ? 'Impôt fédéral avec réduction directe de 16.5% pour les résidents fiscaux du Québec.'
        : 'Impôt sur le revenu perçu par l’Agence du revenu du Canada (CRA/ARC).',
    },
    {
      name: isQuebec ? 'RRQ (Régime de rentes du Québec)' : 'CPP (Canada Pension Plan / RPC)',
      code: isQuebec ? 'RRQ' : 'CPP',
      annual: Math.round(annualRRQ * 100) / 100,
      period: Math.round(selectedPeriod.rrq * 100) / 100,
      category: 'government',
      rateDescription: isQuebec ? '6.40% (base) + 4% (supp)' : '5.95% (base) + 4% (supp)',
      description: isQuebec
        ? 'Régime public de rentes du Québec administré par Retraite Québec.'
        : 'Régime de pensions du Canada pour la retraite et l’invalidité.',
    },
    {
      name: 'AE (Assurance-Emploi)',
      code: 'AE',
      annual: Math.round(annualAE * 100) / 100,
      period: Math.round(selectedPeriod.ae * 100) / 100,
      category: 'government',
      rateDescription: isQuebec ? '1.32% (taux réduit Québec)' : '1.64% (taux standard fédéral)',
      description: 'Assurance fédérale en cas de perte d’emploi.',
    },
  ];

  if (isQuebec && annualRQAP > 0) {
    deductionsList.push({
      name: 'RQAP (Assurance Parentale)',
      code: 'RQAP',
      annual: Math.round(annualRQAP * 100) / 100,
      period: Math.round(selectedPeriod.rqap * 100) / 100,
      category: 'government',
      rateDescription: '0.494% (max 94 000 $)',
      description: 'Prestations de maternité, paternité et parentales au Québec.',
    });
  }

  if (annualGroupInsurance > 0) {
    deductionsList.push({
      name: 'Assurance Collective (Santé, Vie, Dentaire)',
      code: 'ASSUR_COLL',
      annual: Math.round(annualGroupInsurance * 100) / 100,
      period: Math.round(selectedPeriod.groupInsurance * 100) / 100,
      category: 'insurance',
      rateDescription: 'Régime privé employeur',
      description: 'Cotisation de l’employé pour l’assurance médicale et paramédicale.',
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
      description: 'Retraite d’entreprise ou cotisation syndicale prélevée à la source.',
    });
  }

  if (annualOtherDeductions > 0) {
    deductionsList.push({
      name: 'Autres retenues (Cafétéria, etc.)',
      code: 'DIVERS',
      annual: Math.round(annualOtherDeductions * 100) / 100,
      period: Math.round(selectedPeriod.otherDeductions * 100) / 100,
      category: 'workplace',
      rateDescription: 'Retenues internes',
      description: 'Déductions diverses autorisées sur la paie.',
    });
  }

  return {
    province,
    provinceInfo: provInfo,
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
// Quebec Workplace Benefits Calculators (CNESST Norms)
// -------------------------------------------------------------
export interface VacationBenefitResult {
  yearsOfService: number;
  ratePercent: number;
  weeksPaidLeave: number;
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
  holidayPayPerDay: number;
  annualEightHolidaysTotal: number;
  holidaysCount: number;
  explanation: string;
}

export function calculateQuebecStatutoryHolidays(biweeklyGross: number): HolidayBenefitResult {
  const fourWeeksEarnings = biweeklyGross * 2;
  const holidayPayPerDay = fourWeeksEarnings / 20;
  const annualEightHolidaysTotal = holidayPayPerDay * 8;

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
// Now with Multi-Province Support!
// -------------------------------------------------------------
export interface JobOfferInput {
  title: string;
  province?: CanadianProvince;
  hourlyRate: number;
  hoursPerWeek: number;
  shiftPremiumPerHour: number;
  biweeklyHealthInsurance: number;
  employerRrspMatchPct: number;
}

export interface JobOfferEvaluation {
  title: string;
  province: CanadianProvince;
  provinceName: string;
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
    const province = o.province || 'QC';
    const regHours = Math.max(1, o.hoursPerWeek || 40);
    const regularAnnual = o.hourlyRate * regHours * 52;
    const premiumAnnual = o.shiftPremiumPerHour * regHours * 52;
    const annualGross = regularAnnual + premiumAnnual;
    const biweeklyGross = annualGross / 26;

    const calc = calculateQuebecPay({
      province,
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
      province,
      provinceName: calc.provinceInfo.name.fr,
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

// -------------------------------------------------------------
// Cross-Province Salary & Cost of Living Comparison Engine
// -------------------------------------------------------------
export interface ProvinceComparisonItem {
  province: CanadianProvince;
  provinceInfo: ProvinceInfo;
  annualGross: number;
  biweeklyGross: number;
  hourlyRate: number;
  annualNet: number;
  biweeklyNet: number;
  effectiveHourlyNet: number;
  effectiveTaxRate: number;
  provincialTax: number;
  federalTax: number;
  pensionContrib: number; // RRQ or CPP
  eiContrib: number; // AE
  adjustedNetPurchasingPower: number; // Net adjusted by Cost of Living Index
}

export function compareAllProvincesSalary(
  hourlyRate: number,
  hoursPerWeek: number = 40
): ProvinceComparisonItem[] {
  const provincesList: CanadianProvince[] = [
    'QC',
    'ON',
    'BC',
    'AB',
    'MB',
    'SK',
    'NS',
    'NB',
    'NL',
    'PE',
    'YT',
    'NT',
    'NU',
  ];

  return provincesList.map((code) => {
    const calc = calculateQuebecPay({
      province: code,
      entryMode: 'hourly',
      hourlyRate,
      regularHoursPerWeek: hoursPerWeek,
      overtime15HoursPerWeek: 0,
      overtime20HoursPerWeek: 0,
      frequency: 'biweekly',
      mode: 'simple',
      shiftPremiumType: 'fixed',
      shiftPremiumAmount: 0,
      healthInsuranceEmployee: 0,
      lifeAndDisabilityInsuranceEmployee: 0,
      dentalInsuranceEmployee: 0,
      employerTaxableBenefits: 0,
      groupRrspType: 'percent',
      groupRrspValue: 0,
      unionDuesType: 'percent',
      unionDuesValue: 0,
      otherDeductionsPerPay: 0,
    });

    const info = calc.provinceInfo;
    const colIndex = info.costOfLivingIndex || 100;
    // Purchasing power = Net / (Cost of Living Index / 100)
    const adjustedPurchasingPower = (calc.annualNet / colIndex) * 100;

    return {
      province: code,
      provinceInfo: info,
      annualGross: calc.annualGross,
      biweeklyGross: calc.cascade.biweekly.gross,
      hourlyRate,
      annualNet: calc.annualNet,
      biweeklyNet: calc.cascade.biweekly.net,
      effectiveHourlyNet: calc.effectiveHourlyRateNet,
      effectiveTaxRate: calc.effectiveTaxRate,
      provincialTax: calc.annualProvincialTax,
      federalTax: calc.annualFederalTax,
      pensionContrib: calc.annualRRQ,
      eiContrib: calc.annualAE,
      adjustedNetPurchasingPower: Math.round(adjustedPurchasingPower),
    };
  });
}
