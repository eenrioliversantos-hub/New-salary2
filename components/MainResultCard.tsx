'use client';

import React, { useState } from 'react';
import {
  CalculationResult,
  formatCurrency,
  PayFrequency,
  SalaryEntryMode,
} from '@/lib/tax-engine';
import { Language, translations } from '@/lib/i18n';
import { EXPLANATIONS, getTailoredBreakdown } from '@/lib/calculation-explanations';
import {
  Wallet,
  Clock,
  Calendar,
  CalendarDays,
  Briefcase,
  Layers,
  ArrowRightLeft,
  Star,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Info,
  X,
  Calculator,
  ShieldCheck,
  Building2,
  CheckCircle2,
} from 'lucide-react';

interface MainResultCardProps {
  calc: CalculationResult;
  lang: Language;
  currentFrequency?: PayFrequency;
  onFrequencyChange?: (freq: PayFrequency) => void;
  currentEntryMode?: SalaryEntryMode;
  onEntryModeChange?: (mode: SalaryEntryMode) => void;
  onQuickValueChange?: (value: number) => void;
}

export const MainResultCard: React.FC<MainResultCardProps> = ({
  calc,
  lang,
  currentFrequency,
  onFrequencyChange,
  currentEntryMode = 'hourly',
  onEntryModeChange,
}) => {
  const t = translations[lang];
  const { selectedPeriod, input, precision } = calc;
  const activeFreq = currentFrequency || selectedPeriod.frequency || 'biweekly';

  const [showAllPeriods, setShowAllPeriods] = useState(false);
  // Interactive detail expansion: 'NET_PAY' | 'GROSS_PAY' | 'TOTAL_DEDUCTIONS' | 'EFFECTIVE_RATE' | null
  const [activeDetailId, setActiveDetailId] = useState<string | null>(null);

  // Proportional percentages for the visual bar
  const gross = Math.max(0.01, selectedPeriod.gross);
  const netPct = Math.max(0, (selectedPeriod.net / gross) * 100);
  const provPct = Math.max(0, (selectedPeriod.provincialTax / gross) * 100);
  const fedPct = Math.max(0, (selectedPeriod.federalTax / gross) * 100);
  const rrqPct = Math.max(0, (selectedPeriod.rrq / gross) * 100);
  const rqapPct = Math.max(0, (selectedPeriod.rqap / gross) * 100);
  const aePct = Math.max(0, (selectedPeriod.ae / gross) * 100);
  const insPct = Math.max(0, (selectedPeriod.groupInsurance / gross) * 100);
  const otherPct = Math.max(
    0,
    ((selectedPeriod.retirementAndUnion + selectedPeriod.otherDeductions) / gross) * 100
  );

  const locale = lang === 'pt' ? 'pt-BR' : lang === 'en' ? 'en-CA' : 'fr-CA';

  // Available pay frequencies for the switcher
  const frequencyOptions: { id: PayFrequency; label: string; shortLabel: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'hourly',
      label: t.freqHourly,
      shortLabel: lang === 'pt' ? 'Hora' : lang === 'en' ? 'Hour' : 'Heure',
      icon: <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />,
    },
    {
      id: 'weekly',
      label: t.freqWeekly,
      shortLabel: lang === 'pt' ? 'Semana' : lang === 'en' ? 'Week' : 'Sem.',
      icon: <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />,
    },
    {
      id: 'biweekly',
      label: t.freqBiweekly,
      shortLabel: lang === 'pt' ? '2 Sem ⭐' : lang === 'en' ? '2 Wks ⭐' : '2 Sem ⭐',
      icon: <CalendarDays className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />,
      badge: 'Norme QC',
    },
    {
      id: 'monthly',
      label: t.freqMonthly,
      shortLabel: lang === 'pt' ? 'Mês' : lang === 'en' ? 'Month' : 'Mois',
      icon: <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />,
    },
    {
      id: 'annually',
      label: t.freqAnnually,
      shortLabel: lang === 'pt' ? 'Ano' : lang === 'en' ? 'Year' : 'An',
      icon: <Briefcase className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />,
    },
  ];

  // Periods breakdown for automatic gross calculations from cascade
  const hourlyPeriod = calc.cascade.hourly;
  const dailyPeriod = calc.cascade.daily;
  const weeklyPeriod = calc.cascade.weekly;
  const biweeklyPeriod = calc.cascade.biweekly;
  const monthlyPeriod = calc.cascade.monthly;
  const annualPeriod = calc.cascade.annually;

  const autoGrossPeriods = [
    {
      id: 'hourly' as PayFrequency,
      icon: '⏱️',
      title: lang === 'pt' ? 'Hora' : lang === 'en' ? 'Hourly' : 'Heure',
      gross: hourlyPeriod.gross,
      hoursDesc: '1h',
    },
    {
      id: 'daily' as PayFrequency,
      icon: '☀️',
      title: lang === 'pt' ? 'Diário' : lang === 'en' ? 'Daily' : 'Jour',
      gross: dailyPeriod.gross,
      hoursDesc: `${(calc.totalHoursPerWeek / 5).toFixed(1)}h/dia`,
    },
    {
      id: 'weekly' as PayFrequency,
      icon: '📅',
      title: lang === 'pt' ? 'Semanal' : lang === 'en' ? 'Weekly' : 'Semaine',
      gross: weeklyPeriod.gross,
      hoursDesc: `${calc.totalHoursPerWeek}h/sem`,
    },
    {
      id: 'biweekly' as PayFrequency,
      icon: '⭐',
      title: lang === 'pt' ? 'Quinzenal' : lang === 'en' ? 'Biweekly' : 'Quinzaine',
      gross: biweeklyPeriod.gross,
      hoursDesc: `${calc.totalHoursPerWeek * 2}h (QC)`,
      featured: true,
    },
    {
      id: 'monthly' as PayFrequency,
      icon: '🗓️',
      title: lang === 'pt' ? 'Mensal' : lang === 'en' ? 'Monthly' : 'Mois',
      gross: monthlyPeriod.gross,
      hoursDesc: `~${Math.round(calc.totalHoursPerWeek * 4.333)}h`,
    },
    {
      id: 'annually' as PayFrequency,
      icon: '💼',
      title: lang === 'pt' ? 'Anual' : lang === 'en' ? 'Annual' : 'Année',
      gross: annualPeriod.gross,
      hoursDesc: '52 sem',
    },
  ];

  const handleToggleDetail = (id: string) => {
    setActiveDetailId((prev) => (prev === id ? null : id));
  };

  const selectedExplanation = activeDetailId ? EXPLANATIONS[activeDetailId] : null;
  const tailoredSteps = activeDetailId
    ? getTailoredBreakdown(activeDetailId, calc, selectedPeriod, lang)
    : [];

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-7 shadow-xl border border-slate-800 transition-all relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

      {/* Top Header with Quebec Seal & Precision indicator */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800 relative z-10">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Wallet className="w-4 h-4" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            {t.summaryCardTitle}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700/60">
            <span>⚜️</span>
            <span className="text-emerald-400 font-semibold">{t.fiscalYearBadge}</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-300">
              {precision.score.toFixed(0)}% {precision.label}
            </span>
          </div>
        </div>
      </div>

      {/* 1. SELETOR DE PERÍODOS (SWITCH DE PERÍODOS RESPONSIVO) */}
      <div className="pt-3 pb-2 relative z-10">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              {lang === 'pt'
                ? 'Visualizar Salário no Período :'
                : lang === 'en'
                ? 'Display Salary in Period:'
                : 'Afficher le salaire pour l’intervalle :'}
            </span>
          </span>
          <span className="text-[10px] sm:text-xs text-slate-400">
            {lang === 'pt' ? 'Toque para alternar período' : 'Tap to change period'}
          </span>
        </div>

        {/* Responsive Segmented Control for Periods - 1 single unified row without breaking */}
        <div className="grid grid-cols-5 gap-1 sm:gap-1.5 p-1 bg-slate-800/80 rounded-xl border border-slate-700/60">
          {frequencyOptions.map((opt) => {
            const isSelected = activeFreq === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onFrequencyChange && onFrequencyChange(opt.id)}
                className={`py-1.5 sm:py-2 px-1 sm:px-2 text-[10px] sm:text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer relative active:scale-95 min-w-0 ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-md shadow-emerald-950'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
                title={opt.label}
              >
                {opt.icon}
                <span className="truncate sm:hidden">{opt.shortLabel}</span>
                <span className="truncate hidden sm:inline">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. OPÇÃO DE ALTERNAR MODO DE ENTRADA */}
      <div className="my-2 p-2 sm:p-2.5 rounded-xl bg-slate-800/40 border border-slate-800 flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 relative z-10">
        <div className="flex items-center gap-1.5">
          <ArrowRightLeft className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <span className="text-[11px] sm:text-xs text-slate-300 font-medium">
            {lang === 'pt' ? 'Calcular a partir de :' : lang === 'en' ? 'Calculate from:' : 'Calculer à partir de :'}
          </span>
        </div>

        <div className="flex items-center gap-1 text-[11px] sm:text-xs">
          <button
            type="button"
            onClick={() => onEntryModeChange && onEntryModeChange('hourly')}
            className={`px-2 sm:px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              currentEntryMode === 'hourly'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {t.entryModeHourly}
          </button>
          <button
            type="button"
            onClick={() => onEntryModeChange && onEntryModeChange('annual')}
            className={`px-2 sm:px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              currentEntryMode === 'annual'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {t.entryModeAnnual}
          </button>
          <button
            type="button"
            onClick={() => onEntryModeChange && onEntryModeChange('biweekly')}
            className={`px-2 sm:px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              currentEntryMode === 'biweekly'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {t.entryModeBiweekly}
          </button>
        </div>
      </div>

      {/* 3. HERO NET PAY CARD - INTERATIVO AO CLICAR */}
      <div
        onClick={() => handleToggleDetail('NET_PAY')}
        className={`my-3 p-4 sm:p-5 rounded-2xl transition-all cursor-pointer border relative group ${
          activeDetailId === 'NET_PAY'
            ? 'bg-emerald-950/70 border-emerald-500 ring-2 ring-emerald-500/40 shadow-lg'
            : 'bg-slate-800/50 border-slate-700/60 hover:bg-slate-800/80 hover:border-emerald-500/50'
        }`}
        title="Toque para ver a fórmula e decomposição do seu salário líquido"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-semibold text-slate-300">
              {t.netPayInPocket}
            </span>
            <span className="inline-flex items-center text-[10px] font-bold bg-emerald-900/90 text-emerald-300 border border-emerald-700/60 px-2 py-0.5 rounded-full">
              {calc.takeHomePercentage.toFixed(1)}% do bruto
            </span>
          </div>

          <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-800/60">
            <Info className="w-3 h-3" />
            <span>
              {activeDetailId === 'NET_PAY'
                ? lang === 'pt' ? 'Ocultar fórmula' : 'Hide formula'
                : lang === 'pt' ? 'Toque p/ ver fórmula' : 'Tap for formula'}
            </span>
            {activeDetailId === 'NET_PAY' ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
          </div>
        </div>

        <div className="flex items-baseline gap-2 flex-wrap my-1">
          <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white tabular-nums break-words">
            {formatCurrency(selectedPeriod.net, locale)}
          </span>
          <span className="text-xs sm:text-sm md:text-base text-emerald-400 font-semibold capitalize">
            / {selectedPeriod.frequency === 'biweekly' ? 'quinzena' : selectedPeriod.label.toLowerCase()}
          </span>
        </div>

        <p className="text-xs text-slate-400 mt-2">
          {t.effectiveHourVsGross}{' '}
          <strong className="text-white">${input.hourlyRate.toFixed(2)}/h</strong> ({calc.totalHoursPerWeek}h/semana)
          {input.mode === 'advanced' && input.shiftPremiumAmount > 0 && (
            <span className="text-blue-400 ml-1.5 font-medium">
              + Prime de ${input.shiftPremiumAmount.toFixed(2)}
            </span>
          )}
        </p>
      </div>

      {/* 4. OS 3 CARDS MÉTRICOS - TOTALMENTE INTERATIVOS AO CLICAR */}
      <div className="pt-2 space-y-3 relative z-10">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span className="font-semibold text-slate-300 flex items-center gap-1.5">
            <Calculator className="w-3.5 h-3.5 text-blue-400" />
            <span>{lang === 'pt' ? 'Métricas do Período (Toque para ver a fórmula e origem):' : 'Period Metrics (Tap for formula & origin):'}</span>
          </span>
          <span className="text-[10px] text-slate-500 hidden sm:inline">
            Clique em qualquer card para ver de onde vem o valor
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* Card 1: Gross Pay (Interativo) */}
          <button
            type="button"
            onClick={() => handleToggleDetail('GROSS_PAY')}
            className={`rounded-2xl p-3.5 border text-left transition-all cursor-pointer relative active:scale-[0.98] ${
              activeDetailId === 'GROSS_PAY'
                ? 'bg-blue-950/80 border-blue-400 ring-2 ring-blue-500/40 shadow-lg'
                : 'bg-slate-800/70 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-300 font-bold">
                {t.grossPay} ({selectedPeriod.label})
              </span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                activeDetailId === 'GROSS_PAY' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'
              }`}>
                {activeDetailId === 'GROSS_PAY' ? '▲ Fórmula' : '▼ Detalhar'}
              </span>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-100 tabular-nums">
              {formatCurrency(selectedPeriod.gross, locale)}
            </div>
            <span className="text-[11px] text-slate-400 block mt-1">
              ${input.hourlyRate.toFixed(2)}/h · {selectedPeriod.periodsPerYear ? (calc.totalHoursPerWeek * (52 / selectedPeriod.periodsPerYear)).toFixed(0) : calc.totalHoursPerWeek}h
            </span>
          </button>

          {/* Card 2: Total Deductions (Interativo) */}
          <button
            type="button"
            onClick={() => handleToggleDetail('TOTAL_DEDUCTIONS')}
            className={`rounded-2xl p-3.5 border text-left transition-all cursor-pointer relative active:scale-[0.98] ${
              activeDetailId === 'TOTAL_DEDUCTIONS'
                ? 'bg-rose-950/80 border-rose-400 ring-2 ring-rose-500/40 shadow-lg'
                : 'bg-slate-800/70 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-300 font-bold">
                {t.totalDeductions}
              </span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                activeDetailId === 'TOTAL_DEDUCTIONS' ? 'bg-rose-600 text-white' : 'bg-slate-700 text-slate-300'
              }`}>
                {activeDetailId === 'TOTAL_DEDUCTIONS' ? '▲ Fórmula' : '▼ Detalhar'}
              </span>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-rose-300 tabular-nums">
              - {formatCurrency(selectedPeriod.totalDeductions, locale)}
            </div>
            <span className="text-[11px] text-rose-400/90 block mt-1 font-semibold">
              {selectedPeriod.effectiveTaxRate.toFixed(1)}% retido no total
            </span>
          </button>

          {/* Card 3: Effective Tax Rate (Interativo) */}
          <button
            type="button"
            onClick={() => handleToggleDetail('EFFECTIVE_RATE')}
            className={`rounded-2xl p-3.5 border text-left transition-all cursor-pointer relative active:scale-[0.98] ${
              activeDetailId === 'EFFECTIVE_RATE'
                ? 'bg-amber-950/80 border-amber-400 ring-2 ring-amber-500/40 shadow-lg'
                : 'bg-slate-800/70 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-300 font-bold">
                {t.effectiveTaxRate}
              </span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                activeDetailId === 'EFFECTIVE_RATE' ? 'bg-amber-600 text-white' : 'bg-slate-700 text-slate-300'
              }`}>
                {activeDetailId === 'EFFECTIVE_RATE' ? '▲ Fórmula' : '▼ Detalhar'}
              </span>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-amber-300 tabular-nums">
              {selectedPeriod.effectiveTaxRate.toFixed(1)}%
            </div>
            <span className="text-[11px] text-slate-400 block mt-1">
              Impostos QC/ARC + Cotizações
            </span>
          </button>
        </div>

        {/* 5. PAINEL EXPANSÍVEL DE DETALHES INTERATIVOS (A MÁGICA SOLICITADA PELO USUÁRIO) */}
        {activeDetailId && selectedExplanation && (
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/95 border-2 border-emerald-500/60 shadow-xl space-y-4 animate-fadeIn">
            {/* Header of Detail */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-700">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wide">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    {lang === 'pt' ? 'Origem Legal & Fórmula Exata' : 'Legal Origin & Exact Formula'}
                  </span>
                </div>
                <h4 className="text-base sm:text-lg font-extrabold text-white">
                  {selectedExplanation.title[lang]}
                </h4>
                <p className="text-xs text-slate-300">
                  {selectedExplanation.subtitle[lang]}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveDetailId(null)}
                className="p-1.5 rounded-lg bg-slate-700 text-slate-300 hover:text-white hover:bg-slate-600 transition-colors cursor-pointer"
                title="Fechar detalhes"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Badges: Origin & Legal Basis */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700">
                <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 mb-0.5">
                  <Building2 className="w-3 h-3 text-blue-400" />
                  <span>{lang === 'pt' ? 'Órgão / Origem' : 'Origin / Agency'}</span>
                </span>
                <span className="text-xs font-semibold text-slate-200">
                  {selectedExplanation.origin[lang]}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700">
                <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 mb-0.5">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>{lang === 'pt' ? 'Base Legal' : 'Legal Basis'}</span>
                </span>
                <span className="text-xs font-semibold text-slate-200">
                  {selectedExplanation.legalBasis[lang]}
                </span>
              </div>
            </div>

            {/* Formula Block */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-emerald-500/30 space-y-1.5">
              <span className="text-[10px] uppercase font-extrabold text-emerald-400 tracking-wider flex items-center gap-1">
                <Calculator className="w-3 h-3" />
                <span>{lang === 'pt' ? 'Fórmula Matemática do Cálculo :' : 'Mathematical Formula:'}</span>
              </span>
              <div className="font-mono text-xs sm:text-sm font-bold text-emerald-200 bg-slate-950 p-2.5 rounded-lg border border-slate-800 overflow-x-auto">
                {selectedExplanation.formula[lang]}
              </div>
            </div>

            {/* Step-by-Step Breakdown tailored to user's numbers */}
            {tailoredSteps.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 block">
                  {lang === 'pt' ? 'Decomposição com os seus números reais deste período :' : 'Step-by-step with your current numbers:'}
                </span>

                <div className="space-y-1.5">
                  {tailoredSteps.map((step, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-700/80 text-xs"
                    >
                      <div>
                        <span className="font-medium text-slate-300">{step.label}</span>
                        {step.note && (
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            {step.note}
                          </span>
                        )}
                      </div>
                      <span className="font-mono font-bold text-white text-xs sm:text-sm">
                        {step.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Educational Description */}
            <p className="text-xs text-slate-300 leading-relaxed pt-1 border-t border-slate-700/80">
              💡 {selectedExplanation.description[lang]}
            </p>

            {/* Special Exemptions or Credits note if exists */}
            {selectedExplanation.exemptionsAndCredits && (
              <div className="p-2.5 rounded-xl bg-blue-950/60 border border-blue-800/60 text-xs text-blue-200">
                <span className="font-bold">✨ {lang === 'pt' ? 'Isenções & Créditos :' : 'Exemptions & Credits :'} </span>
                <span>{selectedExplanation.exemptionsAndCredits[lang]}</span>
              </div>
            )}

            {/* Employer Match if exists */}
            {selectedExplanation.employerShare && (
              <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-xs text-emerald-200">
                <span>{selectedExplanation.employerShare[lang]}</span>
              </div>
            )}
          </div>
        )}

        {/* Toggle Button for "Show More / All Periods" */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
          <button
            type="button"
            onClick={() => setShowAllPeriods(!showAllPeriods)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <span>💰</span>
            <span>
              {showAllPeriods
                ? lang === 'pt'
                  ? 'Ocultar outros períodos'
                  : lang === 'en'
                  ? 'Hide other periods'
                  : 'Masquer les autres périodes'
                : lang === 'pt'
                  ? 'Mostrar todos os períodos brutos (Diário, Semanal, Quinzenal, Mensal, Anual)'
                  : lang === 'en'
                  ? 'Show all gross periods (Daily, Weekly, Biweekly, Monthly, Annual)'
                  : 'Afficher toutes les périodes brutes (Jour, Hebdo, 2 sem, Mois, Annuel)'}
            </span>
            {showAllPeriods ? (
              <ChevronUp className="w-3.5 h-3.5 text-blue-400" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-blue-400" />
            )}
          </button>

          <span className="text-[11px] text-slate-400">
            Período selecionado: <strong className="text-emerald-400 capitalize">{selectedPeriod.label}</strong>
          </span>
        </div>

        {/* Expandable 6 Automatic Gross Cards Grid */}
        {showAllPeriods && (
          <div className="pt-2 space-y-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Equivalentes brutos para ${input.hourlyRate.toFixed(2)}/h e {calc.totalHoursPerWeek}h/sem:</span>
              <span className="text-[10px] text-blue-400">Toque em qualquer um para selecionar</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {autoGrossPeriods.map((item) => {
                const isSelected = activeFreq === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onFrequencyChange && onFrequencyChange(item.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer relative flex flex-col justify-between active:scale-95 ${
                      isSelected
                        ? 'bg-blue-950/80 border-blue-400 shadow-md shadow-blue-950 ring-1 ring-blue-400/50'
                        : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600'
                    }`}
                    title={`Visualizar período ${item.title}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                        <span>{item.icon}</span>
                        <span className="truncate">{item.title}</span>
                      </span>
                      {item.featured && !isSelected && (
                        <span className="text-[9px] bg-amber-500/20 text-amber-300 font-bold px-1 rounded">
                          QC
                        </span>
                      )}
                      {isSelected && (
                        <span className="text-[9px] bg-blue-500 text-white font-bold px-1 rounded">
                          Ativo
                        </span>
                      )}
                    </div>

                    <div className="text-sm sm:text-base font-extrabold text-white tracking-tight tabular-nums">
                      {formatCurrency(item.gross, locale)}
                    </div>

                    <div className="text-[10px] text-slate-400 mt-1 font-medium">
                      {item.hoursDesc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Visual Proportional Retention Bar */}
      <div className="mt-4 pt-3.5 border-t border-slate-800 relative z-10">
        <div className="flex justify-between text-xs text-slate-400 mb-2">
          <span>{lang === 'pt' ? 'Distribuição de cada $1.00 bruto ganho :' : 'Breakdown of each $1.00 gross earned:'}</span>
          <span className="text-emerald-400 font-semibold">{calc.takeHomePercentage.toFixed(1)}% no seu bolso</span>
        </div>

        {/* Multi-segmented bar */}
        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
          <div
            style={{ width: `${netPct}%` }}
            className="bg-emerald-500 transition-all duration-300"
            title={`Net en poche : ${netPct.toFixed(1)}%`}
          />
          <div
            style={{ width: `${provPct}%` }}
            className="bg-blue-500 transition-all duration-300"
            title={`Revenu Québec : ${provPct.toFixed(1)}%`}
          />
          <div
            style={{ width: `${fedPct}%` }}
            className="bg-sky-400 transition-all duration-300"
            title={`Fédéral ARC : ${fedPct.toFixed(1)}%`}
          />
          <div
            style={{ width: `${rrqPct}%` }}
            className="bg-indigo-400 transition-all duration-300"
            title={`RRQ : ${rrqPct.toFixed(1)}%`}
          />
          <div
            style={{ width: `${rqapPct}%` }}
            className="bg-purple-400 transition-all duration-300"
            title={`RQAP : ${rqapPct.toFixed(1)}%`}
          />
          <div
            style={{ width: `${aePct}%` }}
            className="bg-amber-400 transition-all duration-300"
            title={`AE : ${aePct.toFixed(1)}%`}
          />
          {insPct > 0 && (
            <div
              style={{ width: `${insPct}%` }}
              className="bg-pink-500 transition-all duration-300"
              title={`Assurance collective : ${insPct.toFixed(1)}%`}
            />
          )}
          {otherPct > 0 && (
            <div
              style={{ width: `${otherPct}%` }}
              className="bg-zinc-400 transition-all duration-300"
              title={`Cafétéria / Autres : ${otherPct.toFixed(1)}%`}
            />
          )}
        </div>

        {/* Bar Legend */}
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-[10px] sm:text-[11px] text-slate-400">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-slate-300 font-medium">Net ({netPct.toFixed(0)}%)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
            <span>Québec ({provPct.toFixed(0)}%)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-sky-400 shrink-0" />
            <span>Fédéral ({fedPct.toFixed(0)}%)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-indigo-400 shrink-0" />
            <span>RRQ ({rrqPct.toFixed(0)}%)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-purple-400 shrink-0" />
            <span>RQAP ({rqapPct.toFixed(0)}%)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
            <span>AE ({aePct.toFixed(0)}%)</span>
          </div>
          {insPct > 0 && (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-pink-500 shrink-0" />
              <span>Assurance ({insPct.toFixed(0)}%)</span>
            </div>
          )}
          {otherPct > 0 && (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-zinc-400 shrink-0" />
              <span>Cafétéria ({otherPct.toFixed(0)}%)</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
