'use client';

import React, { useState } from 'react';
import { TaxInput, calculateQuebecPay, formatCurrency } from '@/lib/tax-engine';
import { Language, translations } from '@/lib/i18n';
import {
  TrendingUp,
  Sparkles,
  Check,
  Percent,
  DollarSign,
  ArrowRight,
  Sliders,
  Scale,
  Calendar,
  Wallet,
} from 'lucide-react';

interface RaiseSimulatorProps {
  input: TaxInput;
  lang: Language;
  onApplyRaise?: (newRate: number) => void;
}

type RaiseMode = 'dollar' | 'percent';

export const RaiseSimulator: React.FC<RaiseSimulatorProps> = ({
  input,
  lang,
  onApplyRaise,
}) => {
  const t = translations[lang];
  const locale = lang === 'pt' ? 'pt-BR' : lang === 'en' ? 'en-CA' : 'fr-CA';

  // Raise mode: fixed $/h or % percentage
  const [raiseMode, setRaiseMode] = useState<RaiseMode>('dollar');
  const [customDollar, setCustomDollar] = useState<number>(2.0);
  const [customPercent, setCustomPercent] = useState<number>(5.0);
  const [appliedNotice, setAppliedNotice] = useState(false);

  // Quick preset options
  const dollarPresets = [1.0, 2.0, 3.0, 4.0, 5.0];
  const percentPresets = [2.5, 5.0, 7.5, 10.0];

  // Calculate raise in $/h
  const bumpHourly =
    raiseMode === 'dollar'
      ? Math.max(0, customDollar)
      : Math.round(((input.hourlyRate * customPercent) / 100) * 100) / 100;

  const newHourlyRate = Math.round((input.hourlyRate + bumpHourly) * 100) / 100;

  // Baseline calculation
  const currentResult = calculateQuebecPay(input);

  // Simulated calculation with the raise
  const simulatedInput: TaxInput = {
    ...input,
    hourlyRate: newHourlyRate,
    annualGrossSalary: Math.round(newHourlyRate * input.regularHoursPerWeek * 52),
    periodGrossSalary: Math.round(newHourlyRate * input.regularHoursPerWeek * 2 * 100) / 100,
  };
  const simulatedResult = calculateQuebecPay(simulatedInput);

  // Extra net across intervals
  const extraHourlyNet = simulatedResult.effectiveHourlyRateNet - currentResult.effectiveHourlyRateNet;
  const extraBiweeklyNet = simulatedResult.cascade.biweekly.net - currentResult.cascade.biweekly.net;
  const extraAnnualNet = simulatedResult.annualNet - currentResult.annualNet;

  // Marginal calculation on the bump
  const annualGrossBump = simulatedResult.annualGross - currentResult.annualGross;
  const retentionPercent = annualGrossBump > 0 ? Math.min(100, Math.max(0, (extraAnnualNet / annualGrossBump) * 100)) : 70;
  const taxSharePercent = Math.max(0, 100 - retentionPercent);

  const handleApply = () => {
    if (onApplyRaise) {
      onApplyRaise(newHourlyRate);
      setAppliedNotice(true);
      setTimeout(() => setAppliedNotice(false), 3000);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-6 transition-all space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100/90 shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              {lang === 'pt'
                ? 'Simulador de Aumento de Salário'
                : lang === 'en'
                ? 'Salary Raise & Wage Bump Simulator'
                : 'Simulateur d’augmentation salariale'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {lang === 'pt'
                ? 'Simule reajustes salariais ou convenções coletivas e veja exatamente quanto cai no bolso após impostos'
                : lang === 'en'
                ? 'Simulate hourly wage bumps and see exactly how much extra net you take home'
                : 'Voyez exactement combien de plus ira dans vos poches après impôts'}
            </p>
          </div>
        </div>

        {/* Mode Selector ($/h vs %) */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setRaiseMode('dollar')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              raiseMode === 'dollar'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
            <span>$/h Fixo</span>
          </button>
          <button
            type="button"
            onClick={() => setRaiseMode('percent')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              raiseMode === 'percent'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Percent className="w-3.5 h-3.5 text-blue-600" />
            <span>% Percentual</span>
          </button>
        </div>
      </div>

      {/* Preset Chips & Input Controls */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-slate-600" />
            <span>
              {raiseMode === 'dollar'
                ? lang === 'pt' ? 'Defina o valor do aumento por hora ($/h):' : 'Select hourly wage increase ($/h):'
                : lang === 'pt' ? 'Defina a porcentagem de aumento (%):' : 'Select percentage increase (%):'}
            </span>
          </span>
          <div className="text-xs sm:text-sm font-semibold text-slate-600">
            Base: <strong className="text-slate-800">${input.hourlyRate.toFixed(2)}/h</strong>
            <span className="mx-1.5 text-slate-400">→</span>
            Novo: <strong className="text-emerald-700">${newHourlyRate.toFixed(2)}/h</strong>
          </div>
        </div>

        {/* Quick Presets & Input Box */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex flex-wrap gap-2 flex-1">
            {raiseMode === 'dollar' ? (
              dollarPresets.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setCustomDollar(val)}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer active:scale-95 ${
                    customDollar === val
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  +{formatCurrency(val, locale)}/h
                </button>
              ))
            ) : (
              percentPresets.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setCustomPercent(val)}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer active:scale-95 ${
                    customPercent === val
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  +{val}%
                </button>
              ))
            )}
          </div>

          {/* Custom Input */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold whitespace-nowrap hidden sm:inline">
              Personalizado:
            </span>
            <div className="relative w-full sm:w-36">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold text-sm pointer-events-none">
                {raiseMode === 'dollar' ? '$' : '%'}
              </span>
              <input
                type="number"
                min="0.1"
                step={raiseMode === 'dollar' ? '0.25' : '0.5'}
                value={raiseMode === 'dollar' ? customDollar : customPercent}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 0;
                  if (raiseMode === 'dollar') {
                    setCustomDollar(val);
                  } else {
                    setCustomPercent(val);
                  }
                }}
                className="w-full pl-8 pr-3 py-2 text-sm sm:text-base font-bold text-slate-900 bg-white border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-600 tabular-nums shadow-xs"
              />
            </div>
          </div>
        </div>

        {/* Range Slider */}
        <div className="pt-1">
          <input
            type="range"
            min={raiseMode === 'dollar' ? 0.25 : 1}
            max={raiseMode === 'dollar' ? 10 : 20}
            step={raiseMode === 'dollar' ? 0.25 : 0.5}
            value={raiseMode === 'dollar' ? customDollar : customPercent}
            onChange={(e) => {
              const val = parseFloat(e.target.value) || 0;
              if (raiseMode === 'dollar') setCustomDollar(val);
              else setCustomPercent(val);
            }}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            aria-label="Ajuster l'augmentation"
          />
        </div>
      </div>

      {/* Main Results Display of the Raise: 3 Balanced Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* Highlight 1: Extra Pocket Biweekly (Norma QC) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200/90 relative flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wide flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-emerald-700" />
                <span>{lang === 'pt' ? 'Ganho Líquido / Quinzena' : 'Net Gain / Biweekly'}</span>
              </span>
              <span className="text-[10px] bg-emerald-200 text-emerald-950 font-extrabold px-2 py-0.5 rounded-full">
                Aux 2 sem
              </span>
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl font-extrabold text-emerald-800 tracking-tight my-1 tabular-nums">
              +{formatCurrency(extraBiweeklyNet, locale)}
            </div>
          </div>
          <div className="pt-2 border-t border-emerald-200/60 text-xs text-emerald-800 font-medium">
            {lang === 'pt'
              ? `Passa de ${formatCurrency(currentResult.cascade.biweekly.net, locale)} para ${formatCurrency(simulatedResult.cascade.biweekly.net, locale)} líquidos por contracheque.`
              : `Increases to ${formatCurrency(simulatedResult.cascade.biweekly.net, locale)} net per paystub.`}
          </div>
        </div>

        {/* Highlight 2: Extra Net Annual Accumulation */}
        <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/80 border border-blue-200/90 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wide flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-700" />
                <span>{lang === 'pt' ? 'Ganho Líquido / Ano' : 'Net Gain / Year'}</span>
              </span>
              <span className="text-[10px] bg-blue-200 text-blue-950 font-extrabold px-2 py-0.5 rounded-full">
                52 semanas
              </span>
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl font-extrabold text-blue-800 tracking-tight my-1 tabular-nums">
              +{formatCurrency(extraAnnualNet, locale)}
            </div>
          </div>
          <div className="pt-2 border-t border-blue-200/60 text-xs text-blue-800 font-medium">
            {lang === 'pt'
              ? `Total líquido a mais acumulado no ano livre de impostos e deduções.`
              : `Extra take-home money accumulated across the entire year.`}
          </div>
        </div>

        {/* Highlight 3: Real Effective Hourly Take-Home */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-slate-500" />
                <span>{lang === 'pt' ? 'Líquido Real por Hora' : 'Real Net Hourly'}</span>
              </span>
              <span className="text-[10px] bg-slate-200 text-slate-800 font-extrabold px-2 py-0.5 rounded-full">
                $/hora
              </span>
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight my-1 tabular-nums">
              +{formatCurrency(extraHourlyNet, locale)}
              <span className="text-xs sm:text-sm font-semibold text-slate-500">/h</span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-200 text-xs text-slate-600 font-medium">
            {lang === 'pt'
              ? `De cada $${bumpHourly.toFixed(2)} de aumento bruto, você guarda ${formatCurrency(extraHourlyNet, locale)} no bolso.`
              : `Out of each $${bumpHourly.toFixed(2)} gross raise, you keep ${formatCurrency(extraHourlyNet, locale)} net.`}
          </div>
        </div>
      </div>

      {/* Breakdown Bar: Pocket vs Taxes on the Raise */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
        <div className="flex flex-wrap items-center justify-between text-xs sm:text-sm text-slate-700 font-medium">
          <span>
            {lang === 'pt'
              ? 'Divisão de cada $1.00 adicional de aumento:'
              : 'Breakdown of each additional raise dollar:'}
          </span>
          <span className="font-bold text-slate-900">
            <span className="text-emerald-700">{retentionPercent.toFixed(0)}% no seu bolso</span>
            <span className="mx-1.5 text-slate-400">·</span>
            <span className="text-blue-700">{taxSharePercent.toFixed(0)}% retenções fiscais</span>
          </span>
        </div>

        <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden flex shadow-inner">
          <div
            style={{ width: `${retentionPercent}%` }}
            className="bg-emerald-500 transition-all duration-300"
            title={`Líquido retido: ${retentionPercent.toFixed(1)}%`}
          />
          <div
            style={{ width: `${taxSharePercent}%` }}
            className="bg-blue-600 transition-all duration-300"
            title={`Deduções fiscais adicionais: ${taxSharePercent.toFixed(1)}%`}
          />
        </div>
      </div>

      {/* Action Footer: Apply Raise to Main Inputs */}
      {onApplyRaise && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <span className="text-xs text-slate-500 font-medium">
            {lang === 'pt'
              ? `Deseja adotar este valor de ${formatCurrency(newHourlyRate, locale)}/h como o novo salário base?`
              : `Apply ${formatCurrency(newHourlyRate, locale)}/h as your base hourly wage?`}
          </span>

          <button
            type="button"
            onClick={handleApply}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-95 ${
              appliedNotice
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            {appliedNotice ? (
              <>
                <Check className="w-4 h-4 text-emerald-200" />
                <span>{lang === 'pt' ? 'Salário Base Atualizado!' : 'Applied to Base Salary!'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>
                  {lang === 'pt'
                    ? `Aplicar $${newHourlyRate.toFixed(2)}/h ao Cálculo Base`
                    : `Apply $${newHourlyRate.toFixed(2)}/h to Base`}
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
