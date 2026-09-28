'use client';

import React from 'react';
import { PrecisionBreakdown } from '@/lib/tax-engine';
import { Language, translations } from '@/lib/i18n';
import { ShieldCheck, Info, CheckCircle2, AlertCircle } from 'lucide-react';

interface PrecisionCardProps {
  precision: PrecisionBreakdown;
  lang: Language;
  onOpenScenariosModal: () => void;
}

export const PrecisionCard: React.FC<PrecisionCardProps> = ({
  precision,
  lang,
  onOpenScenariosModal,
}) => {
  const t = translations[lang];

  const getScoreColor = (score: number) => {
    if (score >= 98) return 'from-emerald-600 to-teal-500 text-emerald-700';
    if (score >= 92) return 'from-blue-600 to-cyan-500 text-blue-700';
    return 'from-amber-500 to-orange-400 text-amber-700';
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 transition-all">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100/90 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <span>{t.precisionTitle}</span>
              <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 font-extrabold border border-slate-200">
                {precision.score.toFixed(0)}%
              </span>
            </h4>
            <p className="text-xs text-slate-500">
              {precision.label}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenScenariosModal}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition-colors border border-blue-200/80 cursor-pointer"
        >
          <Info className="w-3.5 h-3.5" />
          <span>{t.scenariosDialogBtn}</span>
        </button>
      </div>

      {/* Accuracy Progress Bar */}
      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden mb-3">
        <div
          className={`h-full bg-gradient-to-r ${getScoreColor(precision.score)} transition-all duration-500`}
          style={{ width: `${precision.score}%` }}
        />
      </div>

      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
        {precision.description}
      </p>

      {/* Configured and Missing Factors Pills */}
      <div className="space-y-2 pt-3 border-t border-slate-100 text-[11px] sm:text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-bold text-slate-700">
            {lang === 'pt' ? 'Fatores considerados :' : 'Facteurs pris en compte :'}
          </span>
          {precision.factorsConfigured.map((factor, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/60 font-medium break-words"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{factor}</span>
            </span>
          ))}
        </div>

        {precision.factorsMissing.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="font-semibold text-slate-500">
              {lang === 'pt' ? 'Para atingir 99% :' : 'Pour atteindre 99% :'}
            </span>
            {precision.factorsMissing.map((factor, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200/60 font-medium break-words"
              >
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>{factor}</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
