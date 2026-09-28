'use client';

import React, { useState } from 'react';
import {
  CalculationResult,
  formatCurrency,
  calculateQuebecVacation,
  calculateQuebecStatutoryHolidays,
  calculateQuebecRrspMatch,
} from '@/lib/tax-engine';
import { Language, translations } from '@/lib/i18n';
import {
  Palmtree,
  CalendarDays,
  PiggyBank,
  CheckCircle2,
  Info,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Calculator,
  Building2,
  ShieldCheck,
} from 'lucide-react';

interface QuebecBenefitsToolsProps {
  calc: CalculationResult;
  lang: Language;
  initialTab?: 'vacation' | 'holidays' | 'rrsp';
}

export const QuebecBenefitsTools: React.FC<QuebecBenefitsToolsProps> = ({ calc, lang, initialTab = 'vacation' }) => {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<'vacation' | 'holidays' | 'rrsp'>(initialTab);
  const [yearsOfService, setYearsOfService] = useState<number>(1);
  const [employeeRrspPct, setEmployeeRrspPct] = useState<number>(3);
  const [employerMatchPct, setEmployerMatchPct] = useState<number>(3);

  // Interactive details expansion state per tab
  const [showVacationDetail, setShowVacationDetail] = useState(false);
  const [showHolidayDetail, setShowHolidayDetail] = useState(false);
  const [showRrspDetail, setShowRrspDetail] = useState(false);

  const locale = lang === 'pt' ? 'pt-BR' : lang === 'en' ? 'en-CA' : 'fr-CA';
  const annualGross = calc.annualGross || 52000;
  const biweeklyGross = calc.cascade.biweekly.gross || 2000;

  // Calculators
  const vacation = calculateQuebecVacation(annualGross, yearsOfService);
  const holidays = calculateQuebecStatutoryHolidays(biweeklyGross);
  const rrsp = calculateQuebecRrspMatch(
    annualGross,
    employeeRrspPct,
    employerMatchPct,
    calc.marginalTaxRate || 28
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-slate-200/80 bg-gradient-to-r from-slate-50 via-blue-50/40 to-slate-50">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {t.quebecBenefitsTitle}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {t.quebecBenefitsSubtitle}
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-blue-800 bg-blue-100/70 border border-blue-200 px-2.5 py-1 rounded-full">
            Loi sur les normes CNESST
          </span>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-3 gap-1 sm:gap-1.5 p-1 bg-slate-200/70 rounded-xl mt-3 sm:mt-4">
          <button
            type="button"
            onClick={() => setActiveTab('vacation')}
            className={`py-1.5 sm:py-2 px-1 sm:px-2 text-[11px] sm:text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer active:scale-95 min-w-0 ${
              activeTab === 'vacation'
                ? 'bg-white text-blue-900 shadow-xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Palmtree className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="truncate">{t.tabVacation}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('holidays')}
            className={`py-1.5 sm:py-2 px-1 sm:px-2 text-[11px] sm:text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer active:scale-95 min-w-0 ${
              activeTab === 'holidays'
                ? 'bg-white text-blue-900 shadow-xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="truncate">{t.tabHolidays}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('rrsp')}
            className={`py-1.5 sm:py-2 px-1 sm:px-2 text-[11px] sm:text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer active:scale-95 min-w-0 ${
              activeTab === 'rrsp'
                ? 'bg-white text-blue-900 shadow-xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <PiggyBank className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="truncate">{t.tabRrspMatch}</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Vacation Pay (4% vs 6% CNESST) */}
      {activeTab === 'vacation' && (
        <div className="p-4 sm:p-6 space-y-4 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/70">
            <div>
              <span className="text-xs font-bold text-blue-950 block">
                {lang === 'pt'
                  ? 'Tempo de serviço contínuo na mesma empresa:'
                  : lang === 'en'
                  ? 'Continuous service with employer:'
                  : 'Ancienneté / Service continu chez l’employeur :'}
              </span>
              <p className="text-[11px] text-blue-800">
                {yearsOfService >= 3
                  ? '≥ 3 ans = Droit à 3 semaines de vacances rémunérées (6%)'
                  : '< 3 ans = Droit à 2 semaines de vacances rémunérées (4%)'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setYearsOfService(1)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                  yearsOfService < 3
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Moins de 3 ans (4%)
              </button>
              <button
                type="button"
                onClick={() => setYearsOfService(3)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                  yearsOfService >= 3
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                3 ans et plus (6%)
              </button>
            </div>
          </div>

          {/* Metrics Trio (Interactive upon click) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div
              onClick={() => setShowVacationDetail(!showVacationDetail)}
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-500 font-medium">
                  {lang === 'pt' ? 'Valor por quinzena (se pago na paie)' : 'Montant par paie (aux 2 sem.)'}
                </span>
                <span className="text-[10px] text-blue-600 underline font-semibold">
                  {showVacationDetail ? '▲ Ocultar' : '▼ Detalhes'}
                </span>
              </div>
              <span className="text-lg sm:text-xl font-bold text-slate-900 tabular-nums">
                +{formatCurrency(vacation.biweeklyAmount, locale)}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                ou {formatCurrency(vacation.weeklyAmount, locale)} / sem
              </span>
            </div>

            <div
              onClick={() => setShowVacationDetail(!showVacationDetail)}
              className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 hover:border-emerald-300 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-emerald-800 font-medium">
                  {lang === 'pt' ? 'Acumulado para tirar férias no ano' : 'Cagnotte annuelle de vacances'}
                </span>
                <span className="text-[10px] text-emerald-700 underline font-semibold">
                  {showVacationDetail ? '▲ Ocultar' : '▼ Detalhes'}
                </span>
              </div>
              <span className="text-lg sm:text-xl font-bold text-emerald-700 tabular-nums">
                {formatCurrency(vacation.annualAmount, locale)}
              </span>
              <span className="text-[10px] text-emerald-600 block mt-0.5">
                {vacation.ratePercent}% du salaire brut annuel
              </span>
            </div>

            <div
              onClick={() => setShowVacationDetail(!showVacationDetail)}
              className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 hover:border-indigo-300 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-indigo-800 font-medium">
                  {lang === 'pt' ? 'Semanas de repouso remuneradas' : 'Semaines de congé payé'}
                </span>
                <span className="text-[10px] text-indigo-700 underline font-semibold">
                  {showVacationDetail ? '▲ Ocultar' : '▼ Detalhes'}
                </span>
              </div>
              <span className="text-lg sm:text-xl font-bold text-indigo-700 tabular-nums">
                {vacation.weeksPaidLeave} semaines
              </span>
              <span className="text-[10px] text-indigo-600 block mt-0.5">
                Garanties par la CNESST
              </span>
            </div>
          </div>

          {/* Interactive Detailed Formula & Origin Expansion for Vacation */}
          {showVacationDetail && (
            <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 space-y-2.5 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
                  <Building2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>CNESST · Loi sur les normes du travail (art. 66 à 77)</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowVacationDetail(false)}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  ✕
                </button>
              </div>

              <div className="p-2.5 rounded-lg bg-white border border-blue-100 text-xs">
                <span className="font-bold text-slate-700 block mb-0.5">
                  {lang === 'pt' ? 'Fórmula Matemática Oficial :' : 'Official Math Formula:'}
                </span>
                <code className="text-blue-800 font-mono font-bold block">
                  Indemnité = Salaire Brut ({formatCurrency(annualGross, locale)}) × {vacation.ratePercent}% = {formatCurrency(vacation.annualAmount, locale)}
                </code>
              </div>

              <p className="text-xs text-blue-900 leading-relaxed">
                {lang === 'pt'
                  ? 'No Québec, a cada hora trabalhada você acumula direito a férias remuneradas. Quem tem menos de 3 anos de casa tem direito a 4% (2 semanas completas de folga remunerada). A partir do 3º ano de serviço contínuo, a lei obriga o aumento para 6% (3 semanas completas de folga remunerada).'
                  : 'In Quebec, every hour worked earns you vacation indemnity. Workers with less than 3 continuous years get 4% (2 paid weeks off). At 3+ continuous years, CNESST law requires 6% (3 paid weeks off).'}
              </p>
            </div>
          )}

          <p className="text-[11px] text-slate-500 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            ℹ️ <strong>Règles CNESST :</strong> L&apos;employeur doit soit verser cette indemnité à chaque paie (courant pour les agences ou étudiants), soit la conserver dans une banque de vacances pour payer votre salaire lors de votre départ en congé annuel.
          </p>
        </div>
      )}

      {/* Tab 2: Statutory Holidays (Règle 1/20) */}
      {activeTab === 'holidays' && (
        <div className="p-4 sm:p-6 space-y-4 animate-fadeIn">
          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-amber-950 block">
                {lang === 'pt' ? 'Regra do 1/20 da CNESST (LNT art. 62)' : 'Règle légale du 1/20 (LNT art. 62)'}
              </span>
              <p className="text-[11px] text-amber-800">
                Pour chaque jour férié légal chômé, l&apos;indemnité équivaut à <strong>1/20 du salaire brut gagné au cours des 4 semaines précédant le férié</strong>.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              onClick={() => setShowHolidayDetail(!showHolidayDetail)}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-amber-300 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-500 font-medium">
                  {lang === 'pt' ? 'Indenização por cada dia feriado' : 'Indemnité par jour férié payé'}
                </span>
                <span className="text-[10px] text-amber-700 underline font-semibold">
                  {showHolidayDetail ? '▲ Ocultar' : '▼ Detalhes'}
                </span>
              </div>
              <span className="text-2xl font-extrabold text-blue-700 tabular-nums">
                {formatCurrency(holidays.holidayPayPerDay, locale)}
              </span>
              <span className="text-[11px] text-slate-500 block mt-1">
                Équivaut exactement à 10% d&apos;une paie aux deux semaines (8h à taux plein).
              </span>
            </div>

            <div
              onClick={() => setShowHolidayDetail(!showHolidayDetail)}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-500 font-medium">
                  {lang === 'pt' ? 'Total anual dos 8 feriados oficiais' : 'Total annuel des 8 fériés légaux'}
                </span>
                <span className="text-[10px] text-emerald-700 underline font-semibold">
                  {showHolidayDetail ? '▲ Ocultar' : '▼ Detalhes'}
                </span>
              </div>
              <span className="text-2xl font-extrabold text-emerald-700 tabular-nums">
                +{formatCurrency(holidays.annualEightHolidaysTotal, locale)}
              </span>
              <span className="text-[11px] text-slate-500 block mt-1">
                Versé sans avoir besoin de travailler ce jour-là.
              </span>
            </div>
          </div>

          {/* Interactive Detailed Formula & Origin Expansion for Holidays */}
          {showHolidayDetail && (
            <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 space-y-2.5 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                  <span>CNESST · Loi sur les normes du travail (art. 60 à 65)</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowHolidayDetail(false)}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  ✕
                </button>
              </div>

              <div className="p-2.5 rounded-lg bg-white border border-amber-100 text-xs">
                <span className="font-bold text-slate-700 block mb-0.5">
                  {lang === 'pt' ? 'Fórmula do 1/20 aplicada ao seu salário :' : '1/20 Formula applied to your salary:'}
                </span>
                <code className="text-amber-900 font-mono font-bold block">
                  Indemnité = (Brut 4 semaines : {formatCurrency(biweeklyGross * 2, locale)}) ÷ 20 = {formatCurrency(holidays.holidayPayPerDay, locale)}
                </code>
              </div>

              <p className="text-xs text-amber-950 leading-relaxed">
                {lang === 'pt'
                  ? 'Como você trabalha 40h/semana (80h na quinzena), em 4 semanas você totaliza 160 horas. Ao dividir 160h por 20, o resultado é exatamente 8 horas! Portanto, você recebe 1 dia normal inteiro de 8h de salário sem pisar na empresa.'
                  : 'Since you work 40 hrs/week (80 hrs biweekly), you total 160 hrs in 4 weeks. Dividing 160 hrs by 20 gives exactly 8 regular hours of pay for your statutory day off.'}
              </p>
            </div>
          )}

          {/* List of 8 Quebec Holidays */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
            <span className="font-bold text-slate-900 block mb-2">
              Les 8 jours fériés chômés et payés obligatoires au Québec :
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <span className="p-1.5 rounded bg-white border border-slate-200">1er Janvier (Jour de l&apos;An)</span>
              <span className="p-1.5 rounded bg-white border border-slate-200">Vendredi saint ou Pâques</span>
              <span className="p-1.5 rounded bg-white border border-slate-200">Journée des patriotes (Mai)</span>
              <span className="p-1.5 rounded bg-white border border-slate-200">24 Juin (Fête nationale QC)</span>
              <span className="p-1.5 rounded bg-white border border-slate-200">1er Juillet (Fête du Canada)</span>
              <span className="p-1.5 rounded bg-white border border-slate-200">Fête du travail (Septembre)</span>
              <span className="p-1.5 rounded bg-white border border-slate-200">Action de grâce (Octobre)</span>
              <span className="p-1.5 rounded bg-white border border-slate-200">25 Décembre (Noël)</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Employer RRSP / Pension Match */}
      {activeTab === 'rrsp' && (
        <div className="p-4 sm:p-6 space-y-4 animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-800 block mb-1">
                {lang === 'pt' ? 'Sua contribuição no REER (% do bruto):' : 'Votre cotisation employé (% du brut) :'} {employeeRrspPct}%
              </label>
              <input
                type="range"
                min="1"
                max="10"
                step="0.5"
                value={employeeRrspPct}
                onChange={(e) => setEmployeeRrspPct(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-800 block mb-1">
                {lang === 'pt' ? 'Contrapartida da Empresa (Match %):' : 'Match / Part patronale (% du brut) :'} {employerMatchPct}%
              </label>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={employerMatchPct}
                onChange={(e) => setEmployerMatchPct(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>
          </div>

          {/* Results Trio (Interactive upon click) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div
              onClick={() => setShowRrspDetail(!showRrspDetail)}
              className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 hover:border-emerald-300 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-emerald-800 font-medium">
                  {lang === 'pt' ? 'Dinheiro grátis da empresa (por ano)' : 'Cotisation offerte par l’employeur'}
                </span>
                <span className="text-[10px] text-emerald-700 underline font-semibold">
                  {showRrspDetail ? '▲ Ocultar' : '▼ Detalhes'}
                </span>
              </div>
              <span className="text-lg sm:text-xl font-bold text-emerald-700 tabular-nums">
                +{formatCurrency(rrsp.employerAnnualContribution, locale)} / an
              </span>
              <span className="text-[10px] text-emerald-600 block mt-0.5">
                soit +{formatCurrency(rrsp.biweeklyEmployerFreeMoney, locale)} par paie
              </span>
            </div>

            <div
              onClick={() => setShowRrspDetail(!showRrspDetail)}
              className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 hover:border-blue-300 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-blue-800 font-medium">
                  {lang === 'pt' ? 'Total acumulado investido no ano' : 'Total épargné par an'}
                </span>
                <span className="text-[10px] text-blue-700 underline font-semibold">
                  {showRrspDetail ? '▲ Ocultar' : '▼ Detalhes'}
                </span>
              </div>
              <span className="text-lg sm:text-xl font-bold text-blue-700 tabular-nums">
                {formatCurrency(rrsp.totalAnnualInvested, locale)}
              </span>
              <span className="text-[10px] text-blue-600 block mt-0.5">
                Employé ({formatCurrency(rrsp.employeeAnnualContribution, locale)}) + Employeur
              </span>
            </div>

            <div
              onClick={() => setShowRrspDetail(!showRrspDetail)}
              className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 hover:border-indigo-300 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-indigo-800 font-medium">
                  {lang === 'pt' ? 'Economia de imposto estimada' : 'Économie d’impôt annuelle'}
                </span>
                <span className="text-[10px] text-indigo-700 underline font-semibold">
                  {showRrspDetail ? '▲ Ocultar' : '▼ Detalhes'}
                </span>
              </div>
              <span className="text-lg sm:text-xl font-bold text-indigo-700 tabular-nums">
                {formatCurrency(rrsp.estimatedTaxSavingsAnnual, locale)}
              </span>
              <span className="text-[10px] text-indigo-600 block mt-0.5">
                Déductible d&apos;impôt fédéral et provincial
              </span>
            </div>
          </div>

          {/* Interactive Detailed Formula & Origin Expansion for RRSP */}
          {showRrspDetail && (
            <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 space-y-2.5 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                  <Calculator className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{lang === 'pt' ? 'Como o REER Coletivo funciona na prática :' : 'How Group RRSP works:'}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowRrspDetail(false)}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  ✕
                </button>
              </div>

              <div className="p-2.5 rounded-lg bg-white border border-emerald-100 text-xs">
                <span className="font-bold text-slate-700 block mb-0.5">
                  {lang === 'pt' ? 'Cálculo de Retorno Financeiro :' : 'Financial Return Math:'}
                </span>
                <code className="text-emerald-900 font-mono font-bold block">
                  Match da Empresa = {formatCurrency(annualGross, locale)} × {employerMatchPct}% = +{formatCurrency(rrsp.employerAnnualContribution, locale)} (100% de rendimento imediato)
                </code>
              </div>

              <p className="text-xs text-emerald-950 leading-relaxed">
                {lang === 'pt'
                  ? 'A cada $1 que você coloca no plano, a empresa coloca outro $1 (se o match for igual). Além disso, cada dólar investido no REER abate a sua renda tributável na fonte, gerando uma restituição ou redução de imposto imediata com base na sua alíquota marginal.'
                  : 'Every dollar matched by your employer is essentially free compensation. Plus, employee RRSP contributions are tax-deductible against your highest marginal bracket.'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
