'use client';

import React, { useState } from 'react';
import { CalculationResult, formatCurrency, PeriodResult } from '@/lib/tax-engine';
import { Language, translations } from '@/lib/i18n';
import { Star, Copy, Check, TableProperties, Sparkles, ChevronDown, ChevronUp, Calculator } from 'lucide-react';

interface CascadeTableProps {
  calc: CalculationResult;
  lang: Language;
}

export const CascadeTable: React.FC<CascadeTableProps> = ({ calc, lang }) => {
  const t = translations[lang];
  const { cascade } = calc;
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  const periods: {
    key: string;
    label: string;
    period: PeriodResult;
    isHighlight?: boolean;
    note?: string;
    formulaDesc: { pt: string; en: string; fr: string };
    hoursDesc: string;
  }[] = [
    {
      key: 'hourly',
      label: lang === 'pt' ? 'Por Hora' : lang === 'en' ? 'Hourly' : 'Par Heure',
      period: cascade.hourly,
      note: lang === 'pt' ? 'Líquido real/h' : lang === 'en' ? 'Net/hr worked' : 'Net réel par heure',
      formulaDesc: {
        pt: 'Salário anual dividido pelo total de horas trabalhadas no ano (52 sem × horas/sem).',
        en: 'Annual salary divided by total annual hours worked (52 wks × hrs/wk).',
        fr: 'Salaire annuel divisé par le nombre total d’heures travaillées dans l’année.',
      },
      hoursDesc: '1h',
    },
    {
      key: 'daily',
      label: lang === 'pt' ? 'Por Dia' : lang === 'en' ? 'Daily' : 'Par Jour',
      period: cascade.daily,
      note: '8h / jour',
      formulaDesc: {
        pt: 'Equivalente a uma jornada padrão de 8 horas normais de trabalho (ou horas semanais ÷ 5 dias).',
        en: 'Equivalent to a standard 8-hour shift (or weekly hours ÷ 5 days).',
        fr: 'Équivalent d’une journée de 8 heures normales (heures hebdo ÷ 5 jours).',
      },
      hoursDesc: `${(calc.totalHoursPerWeek / 5).toFixed(1)}h/jour`,
    },
    {
      key: 'weekly',
      label: lang === 'pt' ? 'Semanal' : lang === 'en' ? 'Weekly' : 'Hebdomadaire',
      period: cascade.weekly,
      note: '52 paies / an',
      formulaDesc: {
        pt: 'Calculado sobre 52 semanas completas de trabalho no ano civil.',
        en: 'Calculated over 52 complete workweeks in the calendar year.',
        fr: 'Calculé sur une base de 52 semaines complètes de travail par an.',
      },
      hoursDesc: `${calc.totalHoursPerWeek}h/sem`,
    },
    {
      key: 'biweekly',
      label: lang === 'pt' ? 'Por Quinzena' : lang === 'en' ? 'Bi-weekly' : 'Aux 2 Semaines',
      period: cascade.biweekly,
      isHighlight: true,
      note: lang === 'pt' ? 'Padrão Québec ⭐' : lang === 'en' ? 'Standard QC ⭐' : 'Norme Québec ⭐',
      formulaDesc: {
        pt: 'Padrão legal do Québec: 26 contracheques ao ano (2 semanas = 80 horas de trabalho).',
        en: 'Standard Quebec payroll: 26 pay periods per year (2 weeks = 80 hours).',
        fr: 'Norme québécoise de référence : 26 paies par an (2 semaines = 80h).',
      },
      hoursDesc: `${calc.totalHoursPerWeek * 2}h (QC)`,
    },
    {
      key: 'monthly',
      label: lang === 'pt' ? 'Mensal' : lang === 'en' ? 'Monthly' : 'Mensuel',
      period: cascade.monthly,
      note: '12 mois',
      formulaDesc: {
        pt: 'Salário anual dividido por 12 meses exatos (~4,333 semanas ou ~173,3 horas por mês).',
        en: 'Annual salary divided by 12 months (~4.333 weeks or ~173.3 hours per month).',
        fr: 'Salaire annuel divisé par 12 mois (~4,333 semaines soit ~173,3 heures par mois).',
      },
      hoursDesc: `~${Math.round(calc.totalHoursPerWeek * 4.333)}h/mois`,
    },
    {
      key: 'annually',
      label: lang === 'pt' ? 'Anual' : lang === 'en' ? 'Annually' : 'Annuel',
      period: cascade.annually,
      note: '1 an complet',
      formulaDesc: {
        pt: 'Renda anual consolidada para fins da declaração de imposto de renda no Revenu Québec e ARC.',
        en: 'Consolidated annual income for Revenu Québec and CRA income tax returns.',
        fr: 'Revenu annuel brut consolidé pour les déclarations d’impôt provinciale et fédérale.',
      },
      hoursDesc: `${calc.totalHoursPerWeek * 52}h/an`,
    },
  ];

  const locale = lang === 'pt' ? 'pt-BR' : lang === 'en' ? 'en-CA' : 'fr-CA';

  const handleCopyRow = (item: typeof periods[0], e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `${item.label}: Brut = ${formatCurrency(item.period.gross, locale)}, Déductions = ${formatCurrency(item.period.totalDeductions, locale)}, Net = ${formatCurrency(item.period.net, locale)}`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(item.key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const toggleExpand = (key: string) => {
    setExpandedKey((prev) => (prev === key ? null : key));
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-2 bg-slate-50/50">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <TableProperties className="w-5 h-5 text-blue-600" />
            <span>{t.cascadeTitle}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.cascadeSubtitle}
          </p>
        </div>
        <span className="text-[11px] sm:text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/70 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-emerald-600" />
          Conversion instantanée
        </span>
      </div>

      {/* Mobile Card List (Visible on mobile screens < 640px) - INTERATIVO AO TOQUE */}
      <div className="block sm:hidden divide-y divide-slate-100 p-2 space-y-1.5">
        <div className="text-[11px] text-slate-400 px-2 pt-1 flex items-center justify-between">
          <span>{lang === 'pt' ? 'Toque no card para ver a conversão :' : 'Tap card to see conversion math :'}</span>
          <span>{lang === 'pt' ? '6 períodos' : '6 periods'}</span>
        </div>

        {periods.map((item) => {
          const isHighlight = item.isHighlight;
          const isExpanded = expandedKey === item.key;
          return (
            <div
              key={`mob-${item.key}`}
              onClick={() => toggleExpand(item.key)}
              className={`p-3 rounded-2xl transition-all cursor-pointer active:scale-[0.99] border ${
                isExpanded
                  ? 'border-blue-400 ring-2 ring-blue-400/20 bg-white shadow-md'
                  : isHighlight
                  ? 'bg-emerald-50/80 border-emerald-300 shadow-xs'
                  : 'bg-slate-50/70 border-slate-200/70 hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  {isHighlight && (
                    <Star className="w-4 h-4 text-amber-500 fill-amber-400 shrink-0" />
                  )}
                  <span className={`text-sm font-bold ${isHighlight ? 'text-emerald-950' : 'text-slate-900'}`}>
                    {item.label}
                  </span>
                  {item.note && (
                    <span className="text-[10px] text-slate-500 font-medium">({item.note})</span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={(e) => handleCopyRow(item, e)}
                    className="p-1 rounded text-slate-400 hover:text-slate-700"
                    title="Copiar linha"
                  >
                    {copiedKey === item.key ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <div className="text-slate-400">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-blue-600" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center pt-1 border-t border-slate-200/60">
                <div>
                  <span className="text-[10px] text-slate-500 block">Brut</span>
                  <span className="text-xs font-semibold text-slate-800 tabular-nums">
                    {formatCurrency(item.period.gross, locale)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-rose-500 block">Retenues</span>
                  <span className="text-xs font-semibold text-rose-600 tabular-nums">
                    -{formatCurrency(item.period.totalDeductions, locale)}
                  </span>
                </div>
                <div className={`${isHighlight ? 'bg-emerald-600 text-white rounded-lg py-0.5' : ''}`}>
                  <span className={`text-[10px] block ${isHighlight ? 'text-emerald-100' : 'text-emerald-700'}`}>Net en poche</span>
                  <span className={`text-xs font-bold tabular-nums ${isHighlight ? 'text-white' : 'text-emerald-800'}`}>
                    {formatCurrency(item.period.net, locale)}
                  </span>
                </div>
              </div>

              {/* Expanded Mathematical Explanation on Mobile */}
              {isExpanded && (
                <div className="mt-2.5 pt-2.5 border-t border-slate-200 text-xs space-y-1.5 bg-slate-100/60 p-2.5 rounded-xl animate-fadeIn">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <Calculator className="w-3.5 h-3.5 text-blue-600" />
                    <span>{lang === 'pt' ? 'Como é calculada esta equivalência :' : 'Conversion calculation :'}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {item.formulaDesc[lang]}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/70">
                    <span>Base de horas : <strong className="text-slate-800">{item.hoursDesc}</strong></span>
                    <span>Taxa efetiva : <strong className="text-amber-700 font-mono">{item.period.effectiveTaxRate.toFixed(1)}%</strong></span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Desktop / Tablet Table View (Visible >= 640px) */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-100/75 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-600">
              <th className="py-3 px-4 sm:px-6">{t.colPeriod}</th>
              <th className="py-3 px-4 text-right">{t.colGross}</th>
              <th className="py-3 px-4 text-right text-rose-700">{t.colDeductions}</th>
              <th className="py-3 px-4 sm:px-6 text-right text-emerald-800 font-bold">{t.colNet}</th>
              <th className="py-3 px-4 text-right text-slate-600">{t.colRetention}</th>
              <th className="py-3 px-3 text-center w-12" aria-label="Copier"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
            {periods.map((item) => {
              const isHighlight = item.isHighlight;
              return (
                <tr
                  key={item.key}
                  className={`transition-colors group ${
                    isHighlight
                      ? 'bg-emerald-50/60 font-semibold hover:bg-emerald-50'
                      : 'hover:bg-slate-50/80'
                  }`}
                >
                  {/* Period Column */}
                  <td className="py-3.5 px-4 sm:px-6">
                    <div className="flex items-center gap-2">
                      {isHighlight && (
                        <Star className="w-4 h-4 text-amber-500 fill-amber-400 shrink-0" />
                      )}
                      <div>
                        <div className={`font-semibold ${isHighlight ? 'text-emerald-950 font-bold' : 'text-slate-900'}`}>
                          {item.label}
                        </div>
                        {item.note && (
                          <div className="text-[11px] text-slate-500 font-normal">
                            {item.note} · {item.hoursDesc}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Gross */}
                  <td className="py-3.5 px-4 text-right font-medium text-slate-800 tabular-nums">
                    {formatCurrency(item.period.gross, locale)}
                  </td>

                  {/* Deductions */}
                  <td className="py-3.5 px-4 text-right font-medium text-rose-600 tabular-nums">
                    - {formatCurrency(item.period.totalDeductions, locale)}
                  </td>

                  {/* Net Pay (Main highlight column) */}
                  <td className="py-3.5 px-4 sm:px-6 text-right">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-lg font-bold text-sm sm:text-base tabular-nums ${
                        isHighlight
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-emerald-700 bg-emerald-50'
                      }`}
                    >
                      {formatCurrency(item.period.net, locale)}
                    </span>
                  </td>

                  {/* Retention % */}
                  <td className="py-3.5 px-4 text-right text-slate-500 font-mono text-xs">
                    {item.period.effectiveTaxRate.toFixed(1)}%
                  </td>

                  {/* Copy Row Button */}
                  <td className="py-3.5 px-3 text-center">
                    <button
                      type="button"
                      onClick={(e) => handleCopyRow(item, e)}
                      title="Copier cette ligne"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors opacity-70 group-hover:opacity-100 cursor-pointer"
                    >
                      {copiedKey === item.key ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Note */}
      <div className="p-3 bg-slate-50/70 border-t border-slate-100 text-[11px] text-slate-500 flex flex-wrap items-center justify-between gap-1">
        <span>⭐ La paie aux 2 semaines correspond au cycle de paiement standard au Québec.</span>
        <span>26 versements / an</span>
      </div>
    </div>
  );
};
