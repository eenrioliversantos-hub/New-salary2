'use client';

import React, { useState, useMemo } from 'react';
import {
  CanadianProvince,
  CANADIAN_PROVINCES,
  CANADA_FISCAL_RULES,
  calculateQuebecPay,
  formatCurrency,
  TaxInput,
} from '@/lib/tax-engine';
import { Language } from '@/lib/i18n';
import { ToolId } from '@/components/ToolboxGrid';
import {
  MapPin,
  TrendingUp,
  Scale,
  DollarSign,
  ArrowRight,
  Info,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Home,
  ShoppingBag,
  Briefcase,
  Layers,
  ChevronRight,
  Zap,
} from 'lucide-react';

interface InterprovincialSalaryComparatorProps {
  lang: Language;
  onSelectTool?: (tool: ToolId) => void;
  onLoadProvinceToMainCalc?: (prov: CanadianProvince, rate: number, hours: number) => void;
}

export const InterprovincialSalaryComparator: React.FC<InterprovincialSalaryComparatorProps> = ({
  lang,
  onSelectTool,
  onLoadProvinceToMainCalc,
}) => {
  // Input parameters
  const [hourlyWage, setHourlyWage] = useState<number>(25.0);
  const [weeklyHours, setWeeklyHours] = useState<number>(40);
  const [inputMode, setInputMode] = useState<'hourly' | 'annual'>('hourly');
  const [annualSalaryInput, setAnnualSalaryInput] = useState<number>(52000);

  // Provinces comparison selection (Head to head)
  const [originProv, setOriginProv] = useState<CanadianProvince>('QC');
  const [targetProv, setTargetProv] = useState<CanadianProvince>('ON');

  // Filter or sort on the full provinces table
  const [tableSortBy, setTableSortBy] = useState<'netAnnual' | 'netHourly' | 'purchasingPower' | 'taxRate'>('netAnnual');

  const locale = lang === 'pt' ? 'pt-BR' : lang === 'en' ? 'en-CA' : 'fr-CA';

  // Resolved annual gross
  const resolvedHourly = inputMode === 'hourly' ? hourlyWage : annualSalaryInput / (weeklyHours * 52);
  const resolvedAnnualGross = inputMode === 'hourly' ? hourlyWage * weeklyHours * 52 : annualSalaryInput;

  // Compute calculation for all 13 provinces and territories
  const allProvincesData = useMemo(() => {
    const list = Object.keys(CANADIAN_PROVINCES) as CanadianProvince[];
    return list.map((pCode) => {
      const pInfo = CANADIAN_PROVINCES[pCode];
      const baseInput: TaxInput = {
        province: pCode,
        entryMode: 'hourly',
        hourlyRate: resolvedHourly,
        regularHoursPerWeek: weeklyHours,
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
      };

      const result = calculateQuebecPay(baseInput);

      // Cost of living adjusted net (Purchasing Power):
      // Index base = 100 (Montreal benchmark is ~96, Toronto ~114, Vancouver ~116, Calgary ~98)
      // Real Purchasing Power = (Annual Net / (CostOfLivingIndex / 100))
      const colIndex = pInfo.costOfLivingIndex || 100;
      const realPurchasingPower = Math.round((result.annualNet / (colIndex / 100)));
      const purchasingPowerHourly = Math.round((realPurchasingPower / (weeklyHours * 52)) * 100) / 100;

      // Minimum wage check
      const isBelowMinWage = resolvedHourly < pInfo.minWageHourly;

      return {
        code: pCode,
        info: pInfo,
        result,
        annualGross: result.annualGross,
        annualNet: result.annualNet,
        biweeklyNet: result.selectedPeriod.net,
        effectiveHourlyNet: result.effectiveHourlyRateNet,
        totalDeductions: result.annualTotalDeductions,
        provincialTax: result.annualProvincialTax,
        federalTax: result.annualFederalTax,
        pensionContribution: result.annualRRQ, // RRQ in QC, CPP elsewhere
        eiContribution: result.annualAE,
        rqapContribution: result.annualRQAP,
        effectiveTaxRate: result.effectiveTaxRate,
        marginalTaxRate: result.marginalTaxRate,
        costOfLivingIndex: colIndex,
        realPurchasingPower,
        purchasingPowerHourly,
        isBelowMinWage,
      };
    });
  }, [resolvedHourly, weeklyHours]);

  // Sorted list for table
  const sortedProvinces = useMemo(() => {
    return [...allProvincesData].sort((a, b) => {
      if (tableSortBy === 'netAnnual') return b.annualNet - a.annualNet;
      if (tableSortBy === 'netHourly') return b.effectiveHourlyNet - a.effectiveHourlyNet;
      if (tableSortBy === 'purchasingPower') return b.realPurchasingPower - a.realPurchasingPower;
      if (tableSortBy === 'taxRate') return a.effectiveTaxRate - b.effectiveTaxRate;
      return 0;
    });
  }, [allProvincesData, tableSortBy]);

  // Head-to-Head Comparison (Origin vs Target)
  const originData = useMemo(() => {
    return allProvincesData.find((p) => p.code === originProv) || allProvincesData[0];
  }, [allProvincesData, originProv]);

  const targetData = useMemo(() => {
    return allProvincesData.find((p) => p.code === targetProv) || allProvincesData[1];
  }, [allProvincesData, targetProv]);

  const netDiffAnnual = targetData.annualNet - originData.annualNet;
  const netDiffBiweekly = targetData.biweeklyNet - originData.biweeklyNet;
  const purchasingPowerDiff = targetData.realPurchasingPower - originData.realPurchasingPower;

  // Translations
  const t = useMemo(() => {
    return {
      pt: {
        title: 'Comparador de Salários & Custo de Vida Interprovincial',
        subtitle: 'Descubra como o mesmo valor bruto (ex: $25/h ou $65.000/ano) se transforma em salários líquidos e poderes de compra totalmente diferentes conforme a província canadense.',
        inputHeader: 'Defina o Salário para Simulação',
        hourlyTab: 'Por Hora ($/h)',
        annualTab: 'Salário Anual ($/ano)',
        hoursLabel: 'Horas trabalhadas por semana',
        originLabel: 'Província de Origem',
        targetLabel: 'Província de Destino',
        headToHeadTitle: 'Comparativo Direto (Frente a Frente)',
        annualNet: 'Salário Líquido Anual',
        biweeklyNet: 'Líquido por Quinzena',
        hourlyNet: 'Líquido Real por Hora',
        colIndex: 'Índice de Custo de Vida',
        realPower: 'Poder de Compra Real Ajustado',
        taxRate: 'Taxa Efetiva de Dedução',
        diffLabel: 'Diferença Líquida em Relação à Origem',
        tableTitle: 'Ranking Salarial & Fiscal em Todas as 13 Províncias e Territórios',
        tableSubtitle: 'Classificação oficial 2025/2026 com barèmes provinciais, CPP/RRQ, seguro-desemprego, alíquotas e ponderação de custo de moradia.',
        sortByLabel: 'Ordenar por:',
        colProv: 'Província / Território',
        colGross: 'Salário Bruto',
        colProvTax: 'Imp. Provincial',
        colFedTax: 'Imp. Federal',
        colPension: 'Previdência (CPP/RRQ)',
        colNetAnnual: 'Líquido Anual',
        colNetHourly: 'Líquido/Hora',
        colPower: 'Poder de Compra',
        colRate: 'Alíquota Total',
        actionLoad: 'Carregar nesta Província',
        minWageNotice: 'Salário Mínimo Oficial',
        otThreshold: 'Horas p/ Hora Extra (1.5x)',
        quebecNoteTitle: 'Por que o Québec é Diferente?',
        quebecNoteText: 'O Québec é a única província que recolhe seu próprio imposto de renda provincial de forma totalmente separada do governo federal (Revenu Québec), possui o Abatimento de 16,5% no imposto federal, e regimes próprios de aposentadoria (RRQ) e licença parental (RQAP). Por outro lado, o custo de moradia e creches públicas subsidiadas ($9,10/dia) conferem alto poder de compra real.',
      },
      fr: {
        title: 'Comparateur Interprovincial de Salaires & Pouvoir d’Achat',
        subtitle: 'Découvrez comment un même salaire brut (ex: 25 $/h ou 65 000 $/an) se traduit par des montants nets et des pouvoirs d’achat très variables selon les provinces et territoires du Canada.',
        inputHeader: 'Définissez la rémunération à comparer',
        hourlyTab: 'Taux Horaire ($/h)',
        annualTab: 'Salaire Annuel ($/an)',
        hoursLabel: 'Heures travaillées par semaine',
        originLabel: 'Province d’Origine',
        targetLabel: 'Province de Destination',
        headToHeadTitle: 'Comparatif Direct Face-à-Face',
        annualNet: 'Salaire Net Annuel',
        biweeklyNet: 'Net aux Deux Semaines',
        hourlyNet: 'Net Réel par Heure',
        colIndex: 'Indice du Coût de la Vie',
        realPower: 'Pouvoir d’Achat Réel Ajusté',
        taxRate: 'Taux Effectif Global',
        diffLabel: 'Écart Net par rapport à l’Origine',
        tableTitle: 'Tableau Comparatif des 13 Provinces & Territoires Canadiens',
        tableSubtitle: 'Barèmes officiels 2025/2026 incluant l’impôt provincial, l’abattement fédéral, le RPC/RRQ, l’AE/RQAP et l’indice du coût de la vie.',
        sortByLabel: 'Classer par :',
        colProv: 'Province / Territoire',
        colGross: 'Salaire Brut',
        colProvTax: 'Impôt Prov.',
        colFedTax: 'Impôt Féd.',
        colPension: 'Régime Rentes (RRQ/RPC)',
        colNetAnnual: 'Net Annuel',
        colNetHourly: 'Net / Heure',
        colPower: 'Pouvoir d’Achat',
        colRate: 'Taux Global',
        actionLoad: 'Calculer dans cette province',
        minWageNotice: 'Salaire Minimum Légal',
        otThreshold: 'Seuil Heures Supplémentaires',
        quebecNoteTitle: 'Pourquoi le Québec est-il unique ?',
        quebecNoteText: 'Le Québec bénéficie d’un abattement fédéral exclusif de 16,5 %, gère ses propres régimes de rentes (RRQ) et d’assurance parentale (RQAP), tout en offrant un coût du logement plus modéré et un réseau de garderies subventionnées (9,10 $/jour) renforçant le pouvoir d’achat.',
      },
      en: {
        title: 'Canadian Interprovincial Salary & Cost of Living Comparator',
        subtitle: 'See how the exact same gross wage (e.g. $25/h or $65,000/yr) yields significantly different net take-home and purchasing power depending on the province or territory.',
        inputHeader: 'Set Compensation to Compare',
        hourlyTab: 'Hourly Rate ($/h)',
        annualTab: 'Annual Salary ($/yr)',
        hoursLabel: 'Hours worked per week',
        originLabel: 'Origin Province',
        targetLabel: 'Target Province',
        headToHeadTitle: 'Direct Head-to-Head Breakdown',
        annualNet: 'Annual Net Take-Home',
        biweeklyNet: 'Biweekly Take-Home',
        hourlyNet: 'Real Net Per Hour',
        colIndex: 'Cost of Living Index',
        realPower: 'Adjusted Purchasing Power',
        taxRate: 'Effective Total Tax Rate',
        diffLabel: 'Net Difference vs Origin',
        tableTitle: 'Official Salary & Tax Benchmark Across All 13 Provinces & Territories',
        tableSubtitle: '2025/2026 CRA and provincial tax brackets, CPP/QPP, EI/QPIP rates, overtime thresholds and living costs.',
        sortByLabel: 'Sort by:',
        colProv: 'Province / Territory',
        colGross: 'Gross Salary',
        colProvTax: 'Prov. Tax',
        colFedTax: 'Fed. Tax',
        colPension: 'Pension (CPP/QPP)',
        colNetAnnual: 'Annual Net',
        colNetHourly: 'Net / Hour',
        colPower: 'Purchasing Power',
        colRate: 'Effective Rate',
        actionLoad: 'Load in Main Calculator',
        minWageNotice: 'Statutory Minimum Wage',
        otThreshold: 'Overtime Threshold (1.5x)',
        quebecNoteTitle: 'Why is Quebec unique in Canadian payroll?',
        quebecNoteText: 'Quebec residents receive a 16.5% federal tax abatement, independent QPP/QPIP contributions, and provincial worker deductions, balanced by subsidized childcare ($9.10/day) and lower average rents than Ontario and British Columbia.',
      },
    }[lang];
  }, [lang]);

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
            <Scale className="w-3.5 h-3.5 text-blue-600" />
            <span>Canada 2025/2026 Fiscal Rules</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span>⚜️ QC</span>
            <span>·</span>
            <span>🍁 ON</span>
            <span>·</span>
            <span>🌲 BC</span>
            <span>·</span>
            <span>🏔️ AB</span>
            <span>·</span>
            <span className="text-blue-600 font-bold">+ 9 outros</span>
          </div>
        </div>

        <div className="space-y-2 max-w-3xl">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t.title}
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Input Parameters Bar */}
        <div className="pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          {/* Mode Switcher */}
          <div className="md:col-span-3 space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Modo de Entrada</label>
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setInputMode('hourly')}
                className={`py-1.5 px-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  inputMode === 'hourly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                {t.hourlyTab}
              </button>
              <button
                type="button"
                onClick={() => setInputMode('annual')}
                className={`py-1.5 px-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  inputMode === 'annual' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                {t.annualTab}
              </button>
            </div>
          </div>

          {/* Wage / Salary Input */}
          <div className="md:col-span-3 space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              {inputMode === 'hourly' ? 'Taxa Horária Bruta' : 'Salário Anual Bruto'}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">$</span>
              <input
                type="number"
                step={inputMode === 'hourly' ? '0.50' : '1000'}
                min="10"
                value={inputMode === 'hourly' ? hourlyWage : annualSalaryInput}
                onChange={(e) => {
                  const val = Math.max(0, Number(e.target.value));
                  if (inputMode === 'hourly') {
                    setHourlyWage(val);
                    setAnnualSalaryInput(Math.round(val * weeklyHours * 52));
                  } else {
                    setAnnualSalaryInput(val);
                    setHourlyWage(Math.round((val / (weeklyHours * 52)) * 100) / 100);
                  }
                }}
                className="w-full pl-7 pr-3 py-2 text-sm font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Weekly Hours Input */}
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">{t.hoursLabel}</label>
            <input
              type="number"
              min="15"
              max="60"
              value={weeklyHours}
              onChange={(e) => setWeeklyHours(Math.max(1, Number(e.target.value)))}
              className="w-full px-3 py-2 text-sm font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Preset Buttons */}
          <div className="md:col-span-4 flex items-center gap-1.5 overflow-x-auto pb-0.5">
            {[20, 25, 30, 35, 45].map((presetRate) => (
              <button
                key={presetRate}
                type="button"
                onClick={() => {
                  setHourlyWage(presetRate);
                  setAnnualSalaryInput(presetRate * weeklyHours * 52);
                  setInputMode('hourly');
                }}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer shrink-0 ${
                  hourlyWage === presetRate && inputMode === 'hourly'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                ${presetRate}/h
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Head-to-Head Relocation Comparator (Origin vs Target) */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-400 block mb-1">
              {t.headToHeadTitle}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {originData.info.flag} {originData.info.name[lang]} vs {targetData.info.flag} {targetData.info.name[lang]}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={originProv}
              onChange={(e) => setOriginProv(e.target.value as CanadianProvince)}
              className="bg-slate-800 text-white font-bold text-xs py-2 px-3 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {Object.values(CANADIAN_PROVINCES).map((p) => (
                <option key={`orig-${p.code}`} value={p.code}>
                  {p.flag} {p.name[lang]} ({p.code})
                </option>
              ))}
            </select>

            <span className="text-slate-400 font-bold">⇄</span>

            <select
              value={targetProv}
              onChange={(e) => setTargetProv(e.target.value as CanadianProvince)}
              className="bg-slate-800 text-white font-bold text-xs py-2 px-3 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {Object.values(CANADIAN_PROVINCES).map((p) => (
                <option key={`target-${p.code}`} value={p.code}>
                  {p.flag} {p.name[lang]} ({p.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Side by side metric cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Origin Card */}
          <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Origem</span>
              <span className="text-base font-black text-white flex items-center gap-1.5">
                <span>{originData.info.flag}</span>
                <span>{originData.info.name[lang]}</span>
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-400 block">{t.annualNet}</span>
              <span className="text-2xl sm:text-3xl font-black text-white block">
                {formatCurrency(originData.annualNet, locale)}
              </span>
              <span className="text-xs text-blue-400 font-semibold block">
                {formatCurrency(originData.biweeklyNet, locale)} / 2 semanas · {formatCurrency(originData.effectiveHourlyNet, locale)}/h líquido
              </span>
            </div>

            <div className="pt-3 border-t border-slate-700/60 space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>{t.colIndex}:</span>
                <span className="font-bold text-white">{originData.costOfLivingIndex} (Base 100)</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>{t.realPower}:</span>
                <span className="font-bold text-emerald-400">{formatCurrency(originData.realPurchasingPower, locale)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>{t.taxRate}:</span>
                <span className="font-bold text-slate-200">{originData.effectiveTaxRate.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>{t.minWageNotice}:</span>
                <span className="font-bold text-slate-200">${originData.info.minWageHourly.toFixed(2)}/h</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>{t.otThreshold}:</span>
                <span className="font-bold text-slate-200">{originData.info.standardOvertimeThresholdHours}h / semana</span>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-slate-400 italic">
              {originData.info.highlights[lang]}
            </div>
          </div>

          {/* Target Card */}
          <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Destino</span>
              <span className="text-base font-black text-white flex items-center gap-1.5">
                <span>{targetData.info.flag}</span>
                <span>{targetData.info.name[lang]}</span>
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-400 block">{t.annualNet}</span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-400 block">
                {formatCurrency(targetData.annualNet, locale)}
              </span>
              <span className="text-xs text-blue-400 font-semibold block">
                {formatCurrency(targetData.biweeklyNet, locale)} / 2 semanas · {formatCurrency(targetData.effectiveHourlyNet, locale)}/h líquido
              </span>
            </div>

            <div className="pt-3 border-t border-slate-700/60 space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>{t.colIndex}:</span>
                <span className="font-bold text-white">{targetData.costOfLivingIndex} (Base 100)</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>{t.realPower}:</span>
                <span className="font-bold text-emerald-400">{formatCurrency(targetData.realPurchasingPower, locale)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>{t.taxRate}:</span>
                <span className="font-bold text-slate-200">{targetData.effectiveTaxRate.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>{t.minWageNotice}:</span>
                <span className="font-bold text-slate-200">${targetData.info.minWageHourly.toFixed(2)}/h</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>{t.otThreshold}:</span>
                <span className="font-bold text-slate-200">{targetData.info.standardOvertimeThresholdHours}h / semana</span>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-slate-400 italic">
              {targetData.info.highlights[lang]}
            </div>
          </div>
        </div>

        {/* Head-to-Head Outcome Verdict Banner */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs font-bold text-slate-400">{t.diffLabel}:</span>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-xl font-black ${netDiffAnnual >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {netDiffAnnual >= 0 ? '+' : ''}{formatCurrency(netDiffAnnual, locale)} / ano
              </span>
              <span className="text-xs text-slate-300 font-semibold">
                ({netDiffBiweekly >= 0 ? '+' : ''}{formatCurrency(netDiffBiweekly, locale)} a cada 2 semanas)
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {purchasingPowerDiff >= 0
                ? `Ao mudar para ${targetData.info.name[lang]}, seu poder de compra real aumenta cerca de ${formatCurrency(purchasingPowerDiff, locale)} após ajuste de custos de vida e moradia.`
                : `Apesar de eventuais diferenças nominais, o custo de vida mais alto em ${targetData.info.name[lang]} consome cerca de ${formatCurrency(Math.abs(purchasingPowerDiff), locale)} do seu poder de compra real.`}
            </p>
          </div>

          {onLoadProvinceToMainCalc && (
            <button
              type="button"
              onClick={() => onLoadProvinceToMainCalc(targetProv, resolvedHourly, weeklyHours)}
              className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shrink-0 transition-colors cursor-pointer flex items-center gap-2"
            >
              <span>{t.actionLoad}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Full 13 Provinces and Territories Ranked Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {t.tableTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              {t.tableSubtitle}
            </p>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 self-end sm:self-center">
            <span className="text-xs font-bold text-slate-500">{t.sortByLabel}</span>
            <select
              value={tableSortBy}
              onChange={(e) => setTableSortBy(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
            >
              <option value="netAnnual">Líquido Anual ($)</option>
              <option value="purchasingPower">Poder de Compra Real ($)</option>
              <option value="netHourly">Líquido por Hora ($/h)</option>
              <option value="taxRate">Menor Alíquota Total (%)</option>
            </select>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold text-[11px] uppercase tracking-wider">
                <th className="p-3.5">{t.colProv}</th>
                <th className="p-3.5 text-right">{t.colGross}</th>
                <th className="p-3.5 text-right">{t.colProvTax}</th>
                <th className="p-3.5 text-right">{t.colFedTax}</th>
                <th className="p-3.5 text-right">{t.colPension}</th>
                <th className="p-3.5 text-right bg-blue-50/60 text-blue-900 font-extrabold">{t.colNetAnnual}</th>
                <th className="p-3.5 text-right">{t.colNetHourly}</th>
                <th className="p-3.5 text-right bg-emerald-50/60 text-emerald-900 font-extrabold">{t.colPower}</th>
                <th className="p-3.5 text-right">{t.colRate}</th>
                <th className="p-3.5 text-center">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {sortedProvinces.map((item, index) => {
                const isSelectedOrigin = item.code === originProv;
                const isSelectedTarget = item.code === targetProv;

                return (
                  <tr
                    key={item.code}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isSelectedOrigin
                        ? 'bg-blue-50/40'
                        : isSelectedTarget
                        ? 'bg-emerald-50/40'
                        : index % 2 === 0
                        ? 'bg-white'
                        : 'bg-slate-50/30'
                    }`}
                  >
                    <td className="p-3.5 font-bold">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{item.info.flag}</span>
                        <div>
                          <span className="text-slate-900 block font-bold leading-tight">
                            {item.info.name[lang]}
                          </span>
                          <span className="text-[10px] text-slate-500 font-normal">
                            Min: ${item.info.minWageHourly.toFixed(2)}/h · OT: {item.info.standardOvertimeThresholdHours}h
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5 text-right font-mono tabular-nums text-slate-600">
                      {formatCurrency(item.annualGross, locale)}
                    </td>
                    <td className="p-3.5 text-right font-mono tabular-nums text-blue-700">
                      {formatCurrency(item.provincialTax, locale)}
                    </td>
                    <td className="p-3.5 text-right font-mono tabular-nums text-sky-700">
                      {formatCurrency(item.federalTax, locale)}
                    </td>
                    <td className="p-3.5 text-right font-mono tabular-nums text-indigo-700">
                      {formatCurrency(item.pensionContribution, locale)}
                    </td>
                    <td className="p-3.5 text-right font-mono tabular-nums font-black text-slate-900 bg-blue-50/40">
                      {formatCurrency(item.annualNet, locale)}
                    </td>
                    <td className="p-3.5 text-right font-mono tabular-nums font-bold text-slate-700">
                      ${item.effectiveHourlyNet.toFixed(2)}/h
                    </td>
                    <td className="p-3.5 text-right font-mono tabular-nums font-black text-emerald-700 bg-emerald-50/40">
                      {formatCurrency(item.realPurchasingPower, locale)}
                    </td>
                    <td className="p-3.5 text-right font-mono tabular-nums font-bold text-slate-600">
                      {item.effectiveTaxRate.toFixed(1)}%
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          if (onLoadProvinceToMainCalc) {
                            onLoadProvinceToMainCalc(item.code, resolvedHourly, weeklyHours);
                          } else if (onSelectTool) {
                            onSelectTool('net-calc');
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                        title={`Calcular detalhes completos para ${item.info.name[lang]}`}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Informative Guidance Card on Quebec & Provincial Particularities */}
      <div className="bg-amber-50/70 border border-amber-200/90 rounded-3xl p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2 text-amber-900 font-extrabold text-base">
          <Info className="w-5 h-5 text-amber-700 shrink-0" />
          <span>{t.quebecNoteTitle}</span>
        </div>
        <p className="text-xs sm:text-sm text-amber-900/90 leading-relaxed">
          {t.quebecNoteText}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
          <div className="p-3 bg-white/80 rounded-xl border border-amber-200/80 space-y-1">
            <span className="text-[11px] font-bold text-amber-800 block">Abattement Fédéral QC</span>
            <span className="text-xs text-slate-700 block">
              Redução direta de 16,5% no imposto federal que compensa a administração própria da província.
            </span>
          </div>
          <div className="p-3 bg-white/80 rounded-xl border border-amber-200/80 space-y-1">
            <span className="text-[11px] font-bold text-amber-800 block">Surtaxe & Saúde em Ontário</span>
            <span className="text-xs text-slate-700 block">
              Ontário aplica Surtaxa de 20%/36% e Ontario Health Premium (até $900), além de horas extras após 44h.
            </span>
          </div>
          <div className="p-3 bg-white/80 rounded-xl border border-amber-200/80 space-y-1">
            <span className="text-[11px] font-bold text-amber-800 block">Alberta Sem TVP (0% Sales Tax)</span>
            <span className="text-xs text-slate-700 block">
              Apenas 5% de GST federal sobre compras, sem taxa provincial e com o maior BPA pessoal ($21.885).
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
