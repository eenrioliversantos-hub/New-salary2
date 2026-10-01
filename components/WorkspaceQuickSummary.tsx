'use client';

import React from 'react';
import { CalculationResult, formatCurrency, PayFrequency } from '@/lib/tax-engine';
import { Language, translations } from '@/lib/i18n';
import {
  Wallet,
  TrendingDown,
  CheckCircle2,
} from 'lucide-react';

interface WorkspaceQuickSummaryProps {
  calc: CalculationResult;
  lang: Language;
  onFrequencyChange: (freq: PayFrequency) => void;
}

export const WorkspaceQuickSummary: React.FC<WorkspaceQuickSummaryProps> = ({
  calc,
  lang,
  onFrequencyChange,
}) => {
  const t = translations[lang];
  const locale = lang === 'pt' ? 'pt-BR' : lang === 'en' ? 'en-CA' : 'fr-CA';
  const selected = calc.selectedPeriod;

  const frequencies: { id: PayFrequency; label: string }[] = [
    { id: 'biweekly', label: lang === 'pt' ? 'Quinzena' : lang === 'en' ? 'Bi-weekly' : 'Aux 2 sem.' },
    { id: 'monthly', label: lang === 'pt' ? 'Mês' : lang === 'en' ? 'Monthly' : 'Mois' },
    { id: 'annually', label: lang === 'pt' ? 'Ano' : lang === 'en' ? 'Annual' : 'Année' },
    { id: 'weekly', label: lang === 'pt' ? 'Semana' : lang === 'en' ? 'Weekly' : 'Semaine' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 flex flex-col justify-between space-y-5 sticky top-20">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/70">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{lang === 'pt' ? 'Resultado em Tempo Real' : lang === 'en' ? 'Live Calculation' : 'Calcul en temps réel'}</span>
          </div>

          <span className="text-[11px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
            {calc.precision.score.toFixed(0)}% {lang === 'pt' ? 'preciso' : 'précis'}
          </span>
        </div>

        {/* Big Net Result Card */}
        <div className="mt-3 p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 text-white shadow-sm border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block">
            {lang === 'pt' ? 'Líquido no Bolso (Dans vos poches)' : lang === 'en' ? 'Net Take-Home Pay' : 'Salaire net en poche'}
          </span>
          <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-emerald-400 tracking-tight mt-1 tabular-nums">
            {formatCurrency(selected.net, locale)}
          </div>
          <div className="text-xs text-slate-300 mt-1 flex items-center gap-1">
            <span>par {selected.label.toLowerCase()}</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-200 font-semibold">{formatCurrency(calc.effectiveHourlyRateNet, locale)}/h net</span>
          </div>
        </div>
      </div>

      {/* Cycle Switcher */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
          {lang === 'pt' ? 'Visualizar por período:' : lang === 'en' ? 'Display by period:' : 'Afficher par période :'}
        </label>
        <div className="grid grid-cols-4 p-1 bg-slate-100 rounded-xl border border-slate-200/80 gap-1 text-center">
          {frequencies.map((freq) => (
            <button
              key={freq.id}
              type="button"
              onClick={() => onFrequencyChange(freq.id)}
              className={`py-1.5 px-1 text-xs font-bold rounded-lg transition-all cursor-pointer truncate ${
                selected.frequency === freq.id
                  ? 'bg-white text-blue-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {freq.label}
            </button>
          ))}
        </div>
      </div>

      {/* Breakdown Summary Mini Table */}
      <div className="space-y-2.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-slate-500">{lang === 'pt' ? 'Salário Bruto:' : 'Salaire brut :'}</span>
          <span className="font-bold text-slate-900 tabular-nums">{formatCurrency(selected.gross, locale)}</span>
        </div>

        <div className="flex items-center justify-between text-rose-700">
          <span className="flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>{lang === 'pt' ? 'Total Retenções:' : 'Total retenues :'}</span>
          </span>
          <span className="font-bold tabular-nums">
            -{formatCurrency(selected.totalDeductions, locale)} ({selected.effectiveTaxRate}%)
          </span>
        </div>

        {/* Progress Bar Take Home vs Deductions */}
        <div className="pt-1">
          <div className="w-full bg-rose-200 h-2 rounded-full overflow-hidden flex">
            <div
              className="bg-emerald-500 h-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(0, 100 - selected.effectiveTaxRate))}%` }}
              title={`Net: ${(100 - selected.effectiveTaxRate).toFixed(1)}%`}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-semibold">
            <span className="text-emerald-700">{(100 - selected.effectiveTaxRate).toFixed(1)}% Net</span>
            <span className="text-rose-700">{selected.effectiveTaxRate}% Retenues</span>
          </div>
        </div>
      </div>

    </div>
  );
};
