'use client';

import React, { useState } from 'react';
import {
  JobOfferInput,
  compareJobOffers,
  formatCurrency,
} from '@/lib/tax-engine';
import { Language } from '@/lib/i18n';
import {
  Scale,
  Sparkles,
  Trophy,
  ArrowRight,
  TrendingUp,
  Building,
  CheckCircle2,
  DollarSign,
  Clock,
  Shield,
  PiggyBank,
} from 'lucide-react';

interface JobOfferComparatorProps {
  lang: Language;
}

export const JobOfferComparator: React.FC<JobOfferComparatorProps> = ({ lang }) => {
  const [offerA, setOfferA] = useState<JobOfferInput>({
    title: lang === 'pt' ? 'Oferta A (Atual/Padrão)' : lang === 'en' ? 'Offer A (Standard)' : 'Offre A (Standard)',
    hourlyRate: 25.0,
    hoursPerWeek: 40,
    shiftPremiumPerHour: 0,
    biweeklyHealthInsurance: 0,
    employerRrspMatchPct: 0,
  });

  const [offerB, setOfferB] = useState<JobOfferInput>({
    title: lang === 'pt' ? 'Oferta B (Nova Proposta)' : lang === 'en' ? 'Offer B (New Proposal)' : 'Offre B (Nouvelle Offre)',
    hourlyRate: 27.5,
    hoursPerWeek: 37.5,
    shiftPremiumPerHour: 2.0,
    biweeklyHealthInsurance: 45.0,
    employerRrspMatchPct: 3.0,
  });

  const comparison = compareJobOffers(offerA, offerB);
  const locale = lang === 'pt' ? 'pt-BR' : lang === 'en' ? 'en-CA' : 'fr-CA';

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center shrink-0 shadow-xs">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-bold border border-indigo-200 mb-1.5">
                <Sparkles className="w-3 h-3" />
                <span>
                  {lang === 'pt'
                    ? 'Comparador de Remuneração Real no Québec'
                    : lang === 'en'
                    ? 'Real Take-Home Job Offer Matcher'
                    : 'Comparateur d’offres d’emploi au Québec'}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                {lang === 'pt'
                  ? 'Comparar 2 Propostas de Emprego (Oferta A vs B)'
                  : lang === 'en'
                  ? 'Compare 2 Job Offers (Offer A vs B)'
                  : 'Comparer 2 offres d’emploi (Offre A vs B)'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                {lang === 'pt'
                  ? 'Nem sempre o maior valor por hora bruto resulta em mais dinheiro no bolso. Compare taxas horárias, bônus de turno, seguros e previdência para ver quem realmente ganha.'
                  : lang === 'en'
                  ? 'A higher gross rate does not always mean more money in your pocket. Compare hourly rates, shift premiums, health insurance, and pension matches to find the true winner.'
                  : 'Un taux horaire brut plus élevé ne donne pas toujours plus de net dans vos poches. Comparez taux, primes de quart, assurances et REER pour voir quelle offre gagne réellement.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Decision Banner (The Winner!) */}
      <div
        className={`p-5 sm:p-6 rounded-2xl border shadow-sm transition-all ${
          comparison.winner === 'B'
            ? 'bg-gradient-to-r from-emerald-900 via-slate-900 to-indigo-950 text-white border-emerald-500/40'
            : comparison.winner === 'A'
            ? 'bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white border-blue-500/40'
            : 'bg-slate-900 text-white border-slate-700'
        }`}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-amber-300 shrink-0 border border-white/20">
              <Trophy className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                {lang === 'pt'
                  ? 'Diagnóstico de Renda Líquida'
                  : lang === 'en'
                  ? 'Take-Home Pay Verdict'
                  : 'Verdict du revenu net'}
              </span>
              <h3 className="text-xl sm:text-2xl font-black mt-0.5">
                {comparison.winner === 'B' ? (
                  <span>
                    🎉 {offerB.title}{' '}
                    <span className="text-emerald-400">
                      {lang === 'pt' ? 'é a vencedora!' : lang === 'en' ? 'is the winner!' : 'est la gagnante !'}
                    </span>
                  </span>
                ) : comparison.winner === 'A' ? (
                  <span>
                    🎉 {offerA.title}{' '}
                    <span className="text-blue-400">
                      {lang === 'pt' ? 'é a vencedora!' : lang === 'en' ? 'is the winner!' : 'est la gagnante !'}
                    </span>
                  </span>
                ) : (
                  <span>
                    ⚖️ {lang === 'pt' ? 'As duas ofertas são equivalentes' : lang === 'en' ? 'Both offers are practically identical' : 'Les deux offres sont équivalentes'}
                  </span>
                )}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                {comparison.winner === 'B' ? (
                  lang === 'pt'
                    ? `A Oferta B coloca ${formatCurrency(Math.abs(comparison.annualNetDiff), locale)} a mais no seu bolso por ano líquido (${formatCurrency(Math.abs(comparison.biweeklyNetDiff), locale)} a mais em cada quinzena).`
                    : lang === 'en'
                    ? `Offer B deposits ${formatCurrency(Math.abs(comparison.annualNetDiff), locale)} more net cash into your pocket annually (${formatCurrency(Math.abs(comparison.biweeklyNetDiff), locale)} more per bi-weekly paycheck).`
                    : `L'Offre B met ${formatCurrency(Math.abs(comparison.annualNetDiff), locale)} de plus dans vos poches par année nette (${formatCurrency(Math.abs(comparison.biweeklyNetDiff), locale)} de plus à chaque paie).`
                ) : comparison.winner === 'A' ? (
                  lang === 'pt'
                    ? `A Oferta A coloca ${formatCurrency(Math.abs(comparison.annualNetDiff), locale)} a mais no seu bolso por ano líquido.`
                    : lang === 'en'
                    ? `Offer A deposits ${formatCurrency(Math.abs(comparison.annualNetDiff), locale)} more net cash into your pocket annually.`
                    : `L'Offre A met ${formatCurrency(Math.abs(comparison.annualNetDiff), locale)} de plus dans vos poches par année nette.`
                ) : (
                  lang === 'pt'
                    ? 'A diferença líquida anual é inferior a $10.'
                    : lang === 'en'
                    ? 'The annual net difference is under $10.'
                    : 'La différence nette annuelle est inférieure à 10 $.')
                }
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/10 px-5 py-3.5 rounded-2xl border border-white/15 backdrop-blur-sm shrink-0">
            <div className="text-right">
              <span className="text-[11px] text-slate-300 uppercase block font-semibold">
                {lang === 'pt' ? 'Diferença Líquida Anual' : lang === 'en' ? 'Annual Net Diff' : 'Écart net annuel'}
              </span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-300 tabular-nums">
                {comparison.annualNetDiff >= 0 ? '+' : ''}
                {formatCurrency(comparison.annualNetDiff, locale)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Side-by-Side Comparison Workspace */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* OFFER A CARD */}
        <div className={`p-5 sm:p-6 rounded-2xl bg-white border-2 transition-all shadow-xs ${
          comparison.winner === 'A' ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200'
        }`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 font-extrabold flex items-center justify-center text-sm">
                A
              </div>
              <input
                type="text"
                value={offerA.title}
                onChange={(e) => setOfferA({ ...offerA, title: e.target.value })}
                className="font-bold text-slate-900 text-base bg-transparent border-b border-dashed border-slate-300 focus:border-blue-600 focus:outline-none px-1"
              />
            </div>
            {comparison.winner === 'A' && (
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold">
                🏆 Gagnante
              </span>
            )}
          </div>

          {/* Form Fields Offer A */}
          <div className="space-y-3.5 text-xs">
            <div>
              <label className="font-bold text-slate-700 flex items-center gap-1.5 mb-1">
                <DollarSign className="w-3.5 h-3.5 text-blue-600" />
                <span>{lang === 'pt' ? 'Taxa Horária Base ($/h)' : lang === 'en' ? 'Base Hourly Rate ($/hr)' : 'Taux horaire de base ($/h)'}</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.25"
                  value={offerA.hourlyRate}
                  onChange={(e) => setOfferA({ ...offerA, hourlyRate: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 text-base font-extrabold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 tabular-nums"
                />
                <span className="absolute right-3 top-2.5 text-slate-400 font-bold text-xs">$/h</span>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 flex items-center gap-1.5 mb-1">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>{lang === 'pt' ? 'Horas por semana' : lang === 'en' ? 'Hours per week' : 'Heures par semaine'}</span>
              </label>
              <input
                type="number"
                step="0.5"
                value={offerA.hoursPerWeek}
                onChange={(e) => setOfferA({ ...offerA, hoursPerWeek: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-sm font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 tabular-nums"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 flex items-center gap-1.5 mb-1">
                <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                <span>{lang === 'pt' ? 'Adicional de Turno ($/h)' : lang === 'en' ? 'Shift Premium ($/hr)' : 'Prime de quart ($/h)'}</span>
              </label>
              <input
                type="number"
                step="0.25"
                value={offerA.shiftPremiumPerHour}
                onChange={(e) => setOfferA({ ...offerA, shiftPremiumPerHour: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-sm font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 tabular-nums"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 flex items-center gap-1.5 mb-1">
                <Shield className="w-3.5 h-3.5 text-blue-600" />
                <span>{lang === 'pt' ? 'Seguro Saúde ($/quinzena cota funcionário)' : lang === 'en' ? 'Health Insurance ($/bi-weekly)' : 'Assurance médicale ($/quinzaine)'}</span>
              </label>
              <input
                type="number"
                step="5"
                value={offerA.biweeklyHealthInsurance}
                onChange={(e) => setOfferA({ ...offerA, biweeklyHealthInsurance: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-sm font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 tabular-nums"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 flex items-center gap-1.5 mb-1">
                <PiggyBank className="w-3.5 h-3.5 text-blue-600" />
                <span>{lang === 'pt' ? 'Match REER da Empresa (%)' : lang === 'en' ? 'Employer RRSP Match (%)' : 'Match REER Employeur (%)'}</span>
              </label>
              <input
                type="number"
                step="0.5"
                value={offerA.employerRrspMatchPct}
                onChange={(e) => setOfferA({ ...offerA, employerRrspMatchPct: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-sm font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 tabular-nums"
                placeholder="0 %"
              />
            </div>
          </div>

          {/* Results Summary Box Offer A */}
          <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600">{lang === 'pt' ? 'Salário Bruto Anual:' : lang === 'en' ? 'Annual Gross:' : 'Brut annuel :'}</span>
              <span className="font-bold text-slate-900">{formatCurrency(comparison.offerA.annualGross, locale)}</span>
            </div>
            <div className="flex items-center justify-between text-emerald-700">
              <span className="text-xs font-bold">{lang === 'pt' ? 'Líquido Anual no Bolso:' : lang === 'en' ? 'Annual Take-Home Net:' : 'Net annuel en poche :'}</span>
              <span className="font-extrabold text-base">{formatCurrency(comparison.offerA.annualNet, locale)}</span>
            </div>
            <div className="flex items-center justify-between text-slate-800">
              <span className="text-xs">{lang === 'pt' ? 'Líquido Quinzenal:' : lang === 'en' ? 'Bi-weekly Net:' : 'Net aux 2 semaines :'}</span>
              <span className="font-bold text-sm">{formatCurrency(comparison.offerA.biweeklyNet, locale)}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-200">
              <span>{lang === 'pt' ? 'Líquido real por hora:' : lang === 'en' ? 'Effective net/hour:' : 'Net réel par heure :'}</span>
              <span className="font-mono font-bold">${comparison.offerA.effectiveHourlyNet.toFixed(2)}/h</span>
            </div>
          </div>
        </div>

        {/* OFFER B CARD */}
        <div className={`p-5 sm:p-6 rounded-2xl bg-white border-2 transition-all shadow-xs ${
          comparison.winner === 'B' ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200'
        }`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-extrabold flex items-center justify-center text-sm">
                B
              </div>
              <input
                type="text"
                value={offerB.title}
                onChange={(e) => setOfferB({ ...offerB, title: e.target.value })}
                className="font-bold text-slate-900 text-base bg-transparent border-b border-dashed border-slate-300 focus:border-emerald-600 focus:outline-none px-1"
              />
            </div>
            {comparison.winner === 'B' && (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                🏆 Gagnante
              </span>
            )}
          </div>

          {/* Form Fields Offer B */}
          <div className="space-y-3.5 text-xs">
            <div>
              <label className="font-bold text-slate-700 flex items-center gap-1.5 mb-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                <span>{lang === 'pt' ? 'Taxa Horária Base ($/h)' : lang === 'en' ? 'Base Hourly Rate ($/hr)' : 'Taux horaire de base ($/h)'}</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.25"
                  value={offerB.hourlyRate}
                  onChange={(e) => setOfferB({ ...offerB, hourlyRate: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 text-base font-extrabold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 tabular-nums"
                />
                <span className="absolute right-3 top-2.5 text-slate-400 font-bold text-xs">$/h</span>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 flex items-center gap-1.5 mb-1">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>{lang === 'pt' ? 'Horas por semana' : lang === 'en' ? 'Hours per week' : 'Heures par semaine'}</span>
              </label>
              <input
                type="number"
                step="0.5"
                value={offerB.hoursPerWeek}
                onChange={(e) => setOfferB({ ...offerB, hoursPerWeek: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-sm font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 tabular-nums"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 flex items-center gap-1.5 mb-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                <span>{lang === 'pt' ? 'Adicional de Turno ($/h)' : lang === 'en' ? 'Shift Premium ($/hr)' : 'Prime de quart ($/h)'}</span>
              </label>
              <input
                type="number"
                step="0.25"
                value={offerB.shiftPremiumPerHour}
                onChange={(e) => setOfferB({ ...offerB, shiftPremiumPerHour: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-sm font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 tabular-nums"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 flex items-center gap-1.5 mb-1">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                <span>{lang === 'pt' ? 'Seguro Saúde ($/quinzena cota funcionário)' : lang === 'en' ? 'Health Insurance ($/bi-weekly)' : 'Assurance médicale ($/quinzaine)'}</span>
              </label>
              <input
                type="number"
                step="5"
                value={offerB.biweeklyHealthInsurance}
                onChange={(e) => setOfferB({ ...offerB, biweeklyHealthInsurance: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-sm font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 tabular-nums"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 flex items-center gap-1.5 mb-1">
                <PiggyBank className="w-3.5 h-3.5 text-emerald-600" />
                <span>{lang === 'pt' ? 'Match REER da Empresa (%)' : lang === 'en' ? 'Employer RRSP Match (%)' : 'Match REER Employeur (%)'}</span>
              </label>
              <input
                type="number"
                step="0.5"
                value={offerB.employerRrspMatchPct}
                onChange={(e) => setOfferB({ ...offerB, employerRrspMatchPct: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-sm font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 tabular-nums"
                placeholder="0 %"
              />
            </div>
          </div>

          {/* Results Summary Box Offer B */}
          <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600">{lang === 'pt' ? 'Salário Bruto Anual:' : lang === 'en' ? 'Annual Gross:' : 'Brut annuel :'}</span>
              <span className="font-bold text-slate-900">{formatCurrency(comparison.offerB.annualGross, locale)}</span>
            </div>
            <div className="flex items-center justify-between text-emerald-700">
              <span className="text-xs font-bold">{lang === 'pt' ? 'Líquido Anual no Bolso:' : lang === 'en' ? 'Annual Take-Home Net:' : 'Net annuel en poche :'}</span>
              <span className="font-extrabold text-base">{formatCurrency(comparison.offerB.annualNet, locale)}</span>
            </div>
            <div className="flex items-center justify-between text-slate-800">
              <span className="text-xs">{lang === 'pt' ? 'Líquido Quinzenal:' : lang === 'en' ? 'Bi-weekly Net:' : 'Net aux 2 semaines :'}</span>
              <span className="font-bold text-sm">{formatCurrency(comparison.offerB.biweeklyNet, locale)}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-200">
              <span>{lang === 'pt' ? 'Líquido real por hora:' : lang === 'en' ? 'Effective net/hour:' : 'Net réel par heure :'}</span>
              <span className="font-mono font-bold">${comparison.offerB.effectiveHourlyNet.toFixed(2)}/h</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
