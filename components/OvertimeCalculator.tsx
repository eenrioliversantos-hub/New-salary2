'use client';

import React, { useState } from 'react';
import { formatCurrency, calculateQuebecPay } from '@/lib/tax-engine';
import { Language } from '@/lib/i18n';
import {
  Timer,
  Sparkles,
  Flame,
  Clock,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface OvertimeCalculatorProps {
  lang: Language;
}

export const OvertimeCalculator: React.FC<OvertimeCalculatorProps> = ({ lang }) => {
  const [hourlyRate, setHourlyRate] = useState<number>(25.0);
  const [regularHours, setRegularHours] = useState<number>(40);
  const [ot15Hours, setOt15Hours] = useState<number>(5);
  const [ot20Hours, setOt20Hours] = useState<number>(0);

  const locale = lang === 'pt' ? 'pt-BR' : lang === 'en' ? 'en-CA' : 'fr-CA';

  // Base Pay without overtime
  const baseCalc = calculateQuebecPay({
    entryMode: 'hourly',
    hourlyRate,
    regularHoursPerWeek: regularHours,
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

  // With Overtime
  const withOtCalc = calculateQuebecPay({
    entryMode: 'hourly',
    hourlyRate,
    regularHoursPerWeek: regularHours,
    overtime15HoursPerWeek: ot15Hours,
    overtime20HoursPerWeek: ot20Hours,
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

  // Bi-weekly overtime impact
  const biweeklyGrossDiff = withOtCalc.cascade.biweekly.gross - baseCalc.cascade.biweekly.gross;
  const biweeklyNetDiff = withOtCalc.cascade.biweekly.net - baseCalc.cascade.biweekly.net;
  const biweeklyTaxDiff = biweeklyGrossDiff - biweeklyNetDiff;
  const totalOtHoursBiweekly = (ot15Hours + ot20Hours) * 2;
  const netPerHourOfOt = totalOtHoursBiweekly > 0 ? biweeklyNetDiff / totalOtHoursBiweekly : 0;

  const ot15Rate = hourlyRate * 1.5;
  const ot20Rate = hourlyRate * 2.0;

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0 shadow-xs">
            <Timer className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[11px] font-bold border border-amber-200 mb-1.5">
              <Flame className="w-3 h-3 text-amber-600" />
              <span>
                {lang === 'pt'
                  ? 'Normas do Québec (CNESST Art. 55)'
                  : lang === 'en'
                  ? 'Quebec Labor Standards (CNESST)'
                  : 'Normes de la CNESST (Temps supplémentaire)'}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              {lang === 'pt'
                ? 'Calculadora de Horas Extras: Tempo e Meio (1.5×) e Dobro (2.0×)'
                : lang === 'en'
                ? 'Overtime Pay Calculator: 1.5× & 2.0× Take-Home Pay'
                : 'Calculateur d’Heures Supplémentaires (Temps et demi 1,5× et double 2,0×)'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              {lang === 'pt'
                ? 'Descubra quanto realmente sobra no seu bolso por cada hora extra trabalhada após a retenção de impostos (RRQ, RQAP, AE, Imposto QC e Federal).'
                : lang === 'en'
                ? 'Discover how much cash actually lands in your pocket for each overtime hour worked after marginal taxes and payroll deductions.'
                : 'Voyez exactement combien d’argent net il vous reste dans les poches pour chaque heure supplémentaire après déductions d’impôts.'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Controls (7 cols) */}
        <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          {/* Base Wage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-amber-600" />
                <span>{lang === 'pt' ? 'Sua taxa horária normal de base:' : lang === 'en' ? 'Base regular hourly wage:' : 'Votre taux horaire normal de base :'}</span>
              </label>
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                ${hourlyRate.toFixed(2)}/h
              </span>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 font-extrabold text-2xl">
                $
              </div>
              <input
                type="number"
                min="15.75"
                step="0.25"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(parseFloat(e.target.value) || 0)}
                className="block w-full pl-10 pr-14 py-3 text-2xl font-extrabold text-slate-900 bg-white border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-600 tabular-nums shadow-xs"
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-500 font-bold text-sm">
                / h
              </div>
            </div>

            {/* Overtime Multiplier Badges */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs">
                <span className="text-amber-800 font-semibold block">Temps et demi (1.5×):</span>
                <span className="font-extrabold text-amber-950 text-sm sm:text-base">${ot15Rate.toFixed(2)}/h brut</span>
              </div>
              <div className="p-2.5 rounded-xl bg-orange-50/80 border border-orange-200 text-xs">
                <span className="text-orange-800 font-semibold block">Temps double (2.0×):</span>
                <span className="font-extrabold text-orange-950 text-sm sm:text-base">${ot20Rate.toFixed(2)}/h brut</span>
              </div>
            </div>
          </div>

          {/* Regular Hours per week */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>{lang === 'pt' ? 'Horas regulares normais / semana' : lang === 'en' ? 'Regular weekly hours' : 'Heures régulières / semaine'}</span>
              </label>
              <span className="text-xs font-bold text-slate-700">{regularHours}h/sem</span>
            </div>
            <input
              type="number"
              min="1"
              max="60"
              step="0.5"
              value={regularHours}
              onChange={(e) => setRegularHours(parseFloat(e.target.value) || 40)}
              className="w-full px-3 py-2 text-sm font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Overtime Hours 1.5x */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-600" />
                <span>{lang === 'pt' ? 'Horas extras a 1.5× (por semana)' : lang === 'en' ? 'Overtime 1.5× hours / week' : 'Heures à 1,5× / semaine'}</span>
              </label>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                {ot15Hours * 2}h / quinzena
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max="40"
                step="0.5"
                value={ot15Hours}
                onChange={(e) => setOt15Hours(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500"
              />
              <div className="flex gap-1 shrink-0">
                {[0, 2.5, 5, 8, 10].map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setOt15Hours(h)}
                    className={`px-2 py-1 text-xs font-bold rounded-lg border cursor-pointer ${
                      ot15Hours === h ? 'bg-amber-600 text-white border-amber-600' : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    +{h}h
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Overtime Hours 2.0x */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-orange-600" />
                <span>{lang === 'pt' ? 'Horas extras a 2.0× (feriados ou domingo)' : lang === 'en' ? 'Overtime 2.0× hours / week' : 'Heures à 2,0× / semaine'}</span>
              </label>
              <span className="text-xs font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                {ot20Hours * 2}h / quinzena
              </span>
            </div>
            <input
              type="number"
              min="0"
              max="40"
              step="0.5"
              value={ot20Hours}
              onChange={(e) => setOt20Hours(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500"
              placeholder="0"
            />
          </div>
        </div>

        {/* Right: Live Take-Home Results (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 to-slate-950 text-white p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-md flex flex-col justify-between space-y-5">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'pt' ? 'Ganho Líquido das Horas Extras' : lang === 'en' ? 'Net Cash from Overtime' : 'Gain Net des Heures Sup'}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white">
              +{formatCurrency(biweeklyNetDiff, locale)}
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              {lang === 'pt'
                ? `a mais no seu bolso em cada contracheque quinzenal (${totalOtHoursBiweekly}h extras).`
                : lang === 'en'
                ? `extra in your pocket every bi-weekly paycheck (${totalOtHoursBiweekly} extra hrs).`
                : `de plus dans vos poches à chaque paie aux deux semaines (${totalOtHoursBiweekly}h sup).`}
            </p>
          </div>

          <div className="space-y-3 p-4 rounded-xl bg-white/5 border border-white/10 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">{lang === 'pt' ? 'Bruto adicional das extras:' : 'Brut généré par les extras :'}</span>
              <span className="font-bold text-white">+{formatCurrency(biweeklyGrossDiff, locale)}</span>
            </div>

            <div className="flex items-center justify-between text-rose-300">
              <span>{lang === 'pt' ? 'Impostos retidos das extras:' : 'Impôts retenus sur les extras :'}</span>
              <span className="font-bold">-{formatCurrency(biweeklyTaxDiff, locale)}</span>
            </div>

            <div className="h-px bg-white/10" />

            <div className="flex items-center justify-between text-amber-400 font-bold text-sm">
              <span>{lang === 'pt' ? 'Net real por hora extra:' : 'Net réel par heure sup :'}</span>
              <span className="font-mono text-base">${netPerHourOfOt.toFixed(2)}/h net</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200">
            <span>💡 {lang === 'pt' ? 'No Québec, horas além de 40h semanais devem ser remuneradas com no mínimo 50% de acréscimo (1.5×), salvo acordo de banco de horas.' : 'Au Québec, les heures effectuées au-delà de 40h/semaine doivent être majorées d’au moins 50 % (1,5×).'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
