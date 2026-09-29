'use client';

import React, { useState, useMemo } from 'react';
import {
  CanadianProvince,
  CANADIAN_PROVINCES,
  compareAllProvincesSalary,
  formatCurrency,
  ProvinceComparisonItem,
} from '@/lib/tax-engine';
import { Language } from '@/lib/i18n';
import {
  MapPin,
  TrendingUp,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  Scale,
  Sparkles,
  Info,
  Building,
  HelpCircle,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';

interface CanadaProvincesComparatorProps {
  lang: Language;
  initialHourlyRate?: number;
  initialHoursPerWeek?: number;
  onApplyRateToCalculator?: (rate: number, province: CanadianProvince) => void;
}

export const CanadaProvincesComparator: React.FC<CanadaProvincesComparatorProps> = ({
  lang,
  initialHourlyRate = 25.0,
  initialHoursPerWeek = 40,
  onApplyRateToCalculator,
}) => {
  const [hourlyRate, setHourlyRate] = useState<number>(initialHourlyRate);
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(initialHoursPerWeek);
  const [baseProvince, setBaseProvince] = useState<CanadianProvince>('QC');
  const [targetProvince, setTargetProvince] = useState<CanadianProvince>('ON');
  const [sortBy, setSortBy] = useState<'net' | 'purchasing_power' | 'tax_rate'>('net');

  const locale = lang === 'pt' ? 'pt-BR' : lang === 'en' ? 'en-CA' : 'fr-CA';

  // Compare all 13 provinces & territories
  const comparisons = useMemo(() => {
    const list = compareAllProvincesSalary(hourlyRate, hoursPerWeek);
    if (sortBy === 'net') {
      return [...list].sort((a, b) => b.annualNet - a.annualNet);
    }
    if (sortBy === 'purchasing_power') {
      return [...list].sort((a, b) => b.adjustedNetPurchasingPower - a.adjustedNetPurchasingPower);
    }
    return [...list].sort((a, b) => a.effectiveTaxRate - b.effectiveTaxRate);
  }, [hourlyRate, hoursPerWeek, sortBy]);

  // Direct pair analysis between base & target
  const baseItem = useMemo(() => {
    return comparisons.find((c) => c.province === baseProvince) || comparisons[0];
  }, [comparisons, baseProvince]);

  const targetItem = useMemo(() => {
    return comparisons.find((c) => c.province === targetProvince) || comparisons[1];
  }, [comparisons, targetProvince]);

  const netAnnualDiff = targetItem.annualNet - baseItem.annualNet;
  const netBiweeklyDiff = targetItem.biweeklyNet - baseItem.biweeklyNet;
  const purchasingPowerDiff = targetItem.adjustedNetPurchasingPower - baseItem.adjustedNetPurchasingPower;

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0 shadow-xs">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold border border-blue-200 mb-1.5">
                <Sparkles className="w-3 h-3" />
                <span>
                  {lang === 'pt'
                    ? 'Comparador Salarial Interprovincial Canadá 2026'
                    : lang === 'en'
                    ? 'Cross-Province Salary Matcher Canada 2026'
                    : 'Comparateur Interprovincial de Salaires Canada 2026'}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                {lang === 'pt'
                  ? 'Comparar Salário Líquido em Todas as Províncias do Canadá'
                  : lang === 'en'
                  ? 'Compare Net Salary Across Canadian Provinces & Territories'
                  : 'Comparer le salaire net dans toutes les provinces et territoires'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                {lang === 'pt'
                  ? 'O mesmo valor de $25/h ou $60.000/ano gera salários líquidos diferentes no Québec, Ontário, Alberta ou BC devido a impostos locais, CPP/RRQ, seguro parental e custo de vida.'
                  : lang === 'en'
                  ? 'The same $25/h or $60,000 gross salary yields different net take-home pay in Quebec, Ontario, Alberta or BC due to distinct tax tiers, QPP vs CPP, EI and local living costs.'
                  : 'Un même taux horaire de 25 $/h engendre des revenus nets distincts au Québec, en Ontario, en Alberta ou en C.-B. selon les règles fiscales et le coût de la vie.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Control Strip (Rate, Hours & Provinces) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              {lang === 'pt' ? 'Taxa Horária Bruta' : lang === 'en' ? 'Gross Hourly Wage' : 'Taux horaire brut'}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">$</span>
              <input
                type="number"
                min="10"
                max="250"
                step="0.5"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Math.max(10, parseFloat(e.target.value) || 0))}
                className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-1.5 mt-2">
              {[20, 25, 31.5, 40].map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => setHourlyRate(rate)}
                  className={`text-[11px] px-2 py-0.5 rounded-lg border font-semibold transition-colors ${
                    hourlyRate === rate
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  ${rate}/h
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              {lang === 'pt' ? 'Horas Regulares / Semana' : lang === 'en' ? 'Hours per Week' : 'Heures par semaine'}
            </label>
            <div className="relative">
              <input
                type="number"
                min="15"
                max="60"
                step="1"
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(Math.max(15, parseFloat(e.target.value) || 40))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-1.5 mt-2">
              {[35, 37.5, 40].map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setHoursPerWeek(h)}
                  className={`text-[11px] px-2 py-0.5 rounded-lg border font-semibold transition-colors ${
                    hoursPerWeek === h
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {h}h/sem
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              {lang === 'pt' ? 'Província Base (Atual)' : lang === 'en' ? 'Base Province' : 'Province d’origine'}
            </label>
            <select
              value={baseProvince}
              onChange={(e) => setBaseProvince(e.target.value as CanadianProvince)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.values(CANADIAN_PROVINCES).map((p) => (
                <option key={p.code} value={p.code}>
                  {p.flag} {p.name[lang]} ({p.code})
                </option>
              ))}
            </select>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Sal. Mínimo: ${CANADIAN_PROVINCES[baseProvince].minWageHourly.toFixed(2)}/h
            </span>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              {lang === 'pt' ? 'Província Alvo (Destino)' : lang === 'en' ? 'Target Destination' : 'Province de destination'}
            </label>
            <select
              value={targetProvince}
              onChange={(e) => setTargetProvince(e.target.value as CanadianProvince)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.values(CANADIAN_PROVINCES).map((p) => (
                <option key={p.code} value={p.code}>
                  {p.flag} {p.name[lang]} ({p.code})
                </option>
              ))}
            </select>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Sal. Mínimo: ${CANADIAN_PROVINCES[targetProvince].minWageHourly.toFixed(2)}/h
            </span>
          </div>
        </div>
      </div>

      {/* Head-to-Head Relocation Card */}
      <div className="bg-slate-900 text-white p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-md">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-400">
              <span>{baseItem.provinceInfo.flag} {baseItem.provinceInfo.name[lang]}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              <span>{targetItem.provinceInfo.flag} {targetItem.provinceInfo.name[lang]}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              {netAnnualDiff >= 0
                ? `${lang === 'pt' ? 'Ganho líquido de +' : lang === 'en' ? 'Net gain of +' : 'Gain net de +'}${formatCurrency(netAnnualDiff, locale)} ${lang === 'pt' ? 'por ano' : lang === 'en' ? 'per year' : 'par an'}`
                : `${lang === 'pt' ? 'Diferença de ' : lang === 'en' ? 'Net difference of ' : 'Différence nette de '}${formatCurrency(netAnnualDiff, locale)} ${lang === 'pt' ? 'por ano' : lang === 'en' ? 'per year' : 'par an'}`}
            </h3>
            <p className="text-xs text-slate-300 max-w-xl">
              {lang === 'pt'
                ? `Ao ganhar $${hourlyRate.toFixed(2)}/h (${hoursPerWeek}h/semana), seu líquido quinzenal passa de ${formatCurrency(baseItem.biweeklyNet, locale)} em ${baseItem.provinceInfo.name.pt} para ${formatCurrency(targetItem.biweeklyNet, locale)} em ${targetItem.provinceInfo.name.pt}.`
                : `At $${hourlyRate.toFixed(2)}/h (${hoursPerWeek}h/wk), your biweekly net changes from ${formatCurrency(baseItem.biweeklyNet, locale)} in ${baseItem.provinceInfo.name.en} to ${formatCurrency(targetItem.biweeklyNet, locale)} in ${targetItem.provinceInfo.name.en}.`}
            </p>
          </div>

          {/* Key Metric Blocks */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:w-auto shrink-0">
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 text-center">
              <span className="text-[11px] text-slate-400 block mb-0.5">
                {lang === 'pt' ? 'Líquido / 2 semanas' : lang === 'en' ? 'Net / 2 weeks' : 'Net / 2 semaines'}
              </span>
              <span className={`text-base font-extrabold ${netBiweeklyDiff >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {netBiweeklyDiff >= 0 ? `+${formatCurrency(netBiweeklyDiff, locale)}` : formatCurrency(netBiweeklyDiff, locale)}
              </span>
            </div>

            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 text-center">
              <span className="text-[11px] text-slate-400 block mb-0.5">
                {lang === 'pt' ? 'Alíquota Efetiva' : lang === 'en' ? 'Effective Tax' : 'Taux effectif'}
              </span>
              <span className="text-base font-extrabold text-blue-400">
                {targetItem.effectiveTaxRate}% vs {baseItem.effectiveTaxRate}%
              </span>
            </div>

            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 text-center col-span-2 sm:col-span-1">
              <span className="text-[11px] text-slate-400 block mb-0.5">
                {lang === 'pt' ? 'Poder de Compra' : lang === 'en' ? 'Purchasing Power' : 'Pouvoir d’achat'}
              </span>
              <span className={`text-base font-extrabold ${purchasingPowerDiff >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {purchasingPowerDiff >= 0 ? `+${formatCurrency(purchasingPowerDiff, locale)}` : formatCurrency(purchasingPowerDiff, locale)}
              </span>
            </div>
          </div>
        </div>

        {onApplyRateToCalculator && (
          <div className="mt-4 pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="button"
              onClick={() => onApplyRateToCalculator(hourlyRate, targetProvince)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <span>{lang === 'pt' ? `Carregar ${targetItem.provinceInfo.name[lang]} na Calculadora` : `Load in Calculator`}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Comprehensive Canadian Provinces Comparison Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="font-extrabold text-slate-900 text-base">
              {lang === 'pt'
                ? 'Tabela Geral de Salário Líquido por Província e Território'
                : lang === 'en'
                ? 'Provincial & Territorial Net Salary Rankings'
                : 'Tableau comparatif des salaires nets par province'}
            </h4>
            <span className="text-xs text-slate-500">
              {lang === 'pt'
                ? `Base: $${hourlyRate.toFixed(2)}/h · ${hoursPerWeek}h semanais · Bruto anual de ${formatCurrency(hourlyRate * hoursPerWeek * 52, locale)}`
                : `Based on: $${hourlyRate.toFixed(2)}/h · ${hoursPerWeek}h weekly · Annual gross: ${formatCurrency(hourlyRate * hoursPerWeek * 52, locale)}`}
            </span>
          </div>

          {/* Sort Filter Buttons */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setSortBy('net')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                sortBy === 'net' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lang === 'pt' ? 'Maior Líquido' : lang === 'en' ? 'Highest Net' : 'Net le plus élevé'}
            </button>
            <button
              type="button"
              onClick={() => setSortBy('purchasing_power')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                sortBy === 'purchasing_power' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lang === 'pt' ? 'Poder de Compra' : lang === 'en' ? 'Cost of Living Adjusted' : 'Pouvoir d’achat'}
            </button>
            <button
              type="button"
              onClick={() => setSortBy('tax_rate')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                sortBy === 'tax_rate' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lang === 'pt' ? 'Menor Imposto' : lang === 'en' ? 'Lowest Tax' : 'Moins imposé'}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Província / Território</th>
                <th className="py-3 px-4">Líquido Anual</th>
                <th className="py-3 px-4">Líquido / 2 Semanas</th>
                <th className="py-3 px-4">Líquido Real / Hora</th>
                <th className="py-3 px-4">Retenção Total</th>
                <th className="py-3 px-4">Poder de Compra Real</th>
                <th className="py-3 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {comparisons.map((row, idx) => {
                const isSelected = row.province === baseProvince;
                const isTarget = row.province === targetProvince;

                return (
                  <tr
                    key={row.province}
                    className={`transition-colors ${
                      isSelected
                        ? 'bg-blue-50/60 font-semibold'
                        : isTarget
                        ? 'bg-emerald-50/50'
                        : 'hover:bg-slate-50/80'
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{row.provinceInfo.flag}</span>
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{row.provinceInfo.name[lang]}</span>
                            <span className="text-[10px] text-slate-400 font-mono">({row.province})</span>
                            {isSelected && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-100 text-blue-700 font-bold">
                                {lang === 'pt' ? 'Base' : 'Base'}
                              </span>
                            )}
                            {isTarget && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-700 font-bold">
                                {lang === 'pt' ? 'Alvo' : 'Target'}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500 line-clamp-1">
                            {row.provinceInfo.highlights[lang]}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-black text-slate-900">
                      {formatCurrency(row.annualNet, locale)}
                    </td>

                    <td className="py-3 px-4 font-bold text-blue-700">
                      {formatCurrency(row.biweeklyNet, locale)}
                    </td>

                    <td className="py-3 px-4 font-semibold text-slate-700">
                      {formatCurrency(row.effectiveHourlyNet, locale)}/h
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-800">{row.effectiveTaxRate}%</span>
                        <span className="text-[10px] text-slate-400">
                          (P: {formatCurrency(row.provincialTax, locale)})
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-bold text-emerald-700">
                        {formatCurrency(row.adjustedNetPurchasingPower, locale)}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          if (onApplyRateToCalculator) {
                            onApplyRateToCalculator(hourlyRate, row.province);
                          }
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
                      >
                        {lang === 'pt' ? 'Ver Holerite' : lang === 'en' ? 'View Stub' : 'Voir talon'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
