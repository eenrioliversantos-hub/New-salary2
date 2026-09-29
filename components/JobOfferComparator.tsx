'use client';

import React, { useState } from 'react';
import {
  JobOfferInput,
  compareJobOffers,
  formatCurrency,
  CanadianProvince,
  CANADIAN_PROVINCES,
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
  MapPin,
} from 'lucide-react';

interface JobOfferComparatorProps {
  lang: Language;
}

export const JobOfferComparator: React.FC<JobOfferComparatorProps> = ({ lang }) => {
  const [offerA, setOfferA] = useState<JobOfferInput>({
    title: lang === 'pt' ? 'Oferta A (Montréal, QC)' : lang === 'en' ? 'Offer A (Montreal, QC)' : 'Offre A (Montréal, QC)',
    province: 'QC',
    hourlyRate: 25.0,
    hoursPerWeek: 40,
    shiftPremiumPerHour: 0,
    biweeklyHealthInsurance: 0,
    employerRrspMatchPct: 0,
  });

  const [offerB, setOfferB] = useState<JobOfferInput>({
    title: lang === 'pt' ? 'Oferta B (Toronto, ON)' : lang === 'en' ? 'Offer B (Toronto, ON)' : 'Offre B (Toronto, ON)',
    province: 'ON',
    hourlyRate: 28.5,
    hoursPerWeek: 37.5,
    shiftPremiumPerHour: 1.5,
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
                    ? 'Comparador de Remuneração Real (Multi-Províncias)'
                    : lang === 'en'
                    ? 'Cross-Province Real Take-Home Job Offer Matcher'
                    : 'Comparateur d’offres d’emploi (Multi-Provinces)'}
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
                  ? 'Nem sempre o maior valor bruto por hora resulta em mais dinheiro no bolso. Compare taxas horárias, províncias diferentes, adicionais de turno, seguro saúde e previdência para ver quem realmente ganha.'
                  : lang === 'en'
                  ? 'A higher gross rate does not always mean more money in your pocket. Compare hourly rates, provinces, shift premiums, health insurance, and pension matches to find the true winner.'
                  : 'Un taux horaire brut plus élevé ne donne pas toujours plus de net. Comparez taux, provinces, primes de quart, assurances et REER pour voir quelle offre gagne réellement.'}
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
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
              <Trophy className="w-7 h-7 text-amber-300" />
            </div>
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-amber-300 block mb-1">
                {comparison.winner === 'TIE'
                  ? lang === 'pt' ? 'Empate Técnico' : 'Technical Tie'
                  : lang === 'pt' ? 'Oferta Vencedora Recomendada' : 'Winning Job Offer'}
              </span>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                {comparison.winner === 'B'
                  ? `${offerB.title} (${CANADIAN_PROVINCES[offerB.province || 'ON'].flag} ${CANADIAN_PROVINCES[offerB.province || 'ON'].name[lang]})`
                  : comparison.winner === 'A'
                  ? `${offerA.title} (${CANADIAN_PROVINCES[offerA.province || 'QC'].flag} ${CANADIAN_PROVINCES[offerA.province || 'QC'].name[lang]})`
                  : lang === 'pt' ? 'Ambas ofertas entregam remuneração semelhante' : 'Both offers deliver identical net pay'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                {comparison.winner !== 'TIE' && (
                  <>
                    {lang === 'pt' ? 'Vantagem líquida anual no bolso: ' : 'Annual net cash advantage: '}
                    <span className="font-extrabold text-emerald-300">
                      +{formatCurrency(Math.abs(comparison.annualNetDiff), locale)} / ano
                    </span>
                    {' '}(+{formatCurrency(Math.abs(comparison.biweeklyNetDiff), locale)} / 2 sem)
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="text-right bg-white/10 p-3.5 rounded-xl border border-white/15 w-full md:w-auto shrink-0">
            <span className="text-[11px] text-slate-300 block">
              {lang === 'pt' ? 'Diferença em Pacote Total (Net + REER)' : 'Total Package Advantage'}
            </span>
            <span className="text-lg font-black text-amber-300">
              {comparison.totalCompensationDiff >= 0 ? '+' : ''}
              {formatCurrency(comparison.totalCompensationDiff, locale)} / ano
            </span>
          </div>
        </div>
      </div>

      {/* Two Column Side-by-Side Comparison Workspace */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* OFFER A CARD */}
        <div
          className={`p-5 sm:p-6 rounded-2xl bg-white border-2 transition-all shadow-xs ${
            comparison.winner === 'A' ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200'
          }`}
        >
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
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>{lang === 'pt' ? 'Província / Território' : 'Province / Territory'}</span>
              </label>
              <select
                value={offerA.province || 'QC'}
                onChange={(e) => setOfferA({ ...offerA, province: e.target.value as CanadianProvince })}
                className="w-full px-3 py-2 text-sm font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500"
              >
                {Object.values(CANADIAN_PROVINCES).map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.flag} {p.name[lang]} ({p.code})
                  </option>
                ))}
              </select>
            </div>

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
                <span>{lang === 'pt' ? 'Contrapartida Empregador REER (%)' : lang === 'en' ? 'Employer RRSP Match (%)' : 'Cotisation employeur REER (%)'}</span>
              </label>
              <input
                type="number"
                step="0.5"
                value={offerA.employerRrspMatchPct}
                onChange={(e) => setOfferA({ ...offerA, employerRrspMatchPct: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-sm font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 tabular-nums"
                placeholder="0.0%"
              />
            </div>
          </div>

          {/* Results Summary Box A */}
          <div className="mt-5 pt-4 border-t border-slate-100 bg-slate-50 p-4 rounded-xl space-y-2">
            <div className="flex justify-between text-xs text-slate-600">
              <span>Bruto Anual:</span>
              <span className="font-bold text-slate-900">{formatCurrency(comparison.offerA.annualGross, locale)}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-600">
              <span>Líquido / 2 semanas:</span>
              <span className="font-extrabold text-blue-700">{formatCurrency(comparison.offerA.biweeklyNet, locale)}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-600">
              <span>Líquido Real / Hora:</span>
              <span className="font-bold text-slate-800">{formatCurrency(comparison.offerA.effectiveHourlyNet, locale)}/h</span>
            </div>
            <div className="flex justify-between text-xs text-slate-600">
              <span>Líquido Anual no Bolso:</span>
              <span className="font-black text-slate-900 text-sm">{formatCurrency(comparison.offerA.annualNet, locale)}</span>
            </div>
            {comparison.offerA.annualRrspEmployerFreeMoney > 0 && (
              <div className="flex justify-between text-xs text-emerald-700 font-bold pt-1 border-t border-slate-200">
                <span>+ Bônus REER Empregador:</span>
                <span>+{formatCurrency(comparison.offerA.annualRrspEmployerFreeMoney, locale)} / ano</span>
              </div>
            )}
          </div>
        </div>

        {/* OFFER B CARD */}
        <div
          className={`p-5 sm:p-6 rounded-2xl bg-white border-2 transition-all shadow-xs ${
            comparison.winner === 'B' ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200'
          }`}
        >
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
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>{lang === 'pt' ? 'Província / Território' : 'Province / Territory'}</span>
              </label>
              <select
                value={offerB.province || 'ON'}
                onChange={(e) => setOfferB({ ...offerB, province: e.target.value as CanadianProvince })}
                className="w-full px-3 py-2 text-sm font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500"
              >
                {Object.values(CANADIAN_PROVINCES).map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.flag} {p.name[lang]} ({p.code})
                  </option>
                ))}
              </select>
            </div>

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
                <span>{lang === 'pt' ? 'Contrapartida Empregador REER (%)' : lang === 'en' ? 'Employer RRSP Match (%)' : 'Cotisation employeur REER (%)'}</span>
              </label>
              <input
                type="number"
                step="0.5"
                value={offerB.employerRrspMatchPct}
                onChange={(e) => setOfferB({ ...offerB, employerRrspMatchPct: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-sm font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 tabular-nums"
                placeholder="0.0%"
              />
            </div>
          </div>

          {/* Results Summary Box B */}
          <div className="mt-5 pt-4 border-t border-slate-100 bg-slate-50 p-4 rounded-xl space-y-2">
            <div className="flex justify-between text-xs text-slate-600">
              <span>Bruto Anual:</span>
              <span className="font-bold text-slate-900">{formatCurrency(comparison.offerB.annualGross, locale)}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-600">
              <span>Líquido / 2 semanas:</span>
              <span className="font-extrabold text-emerald-700">{formatCurrency(comparison.offerB.biweeklyNet, locale)}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-600">
              <span>Líquido Real / Hora:</span>
              <span className="font-bold text-slate-800">{formatCurrency(comparison.offerB.effectiveHourlyNet, locale)}/h</span>
            </div>
            <div className="flex justify-between text-xs text-slate-600">
              <span>Líquido Anual no Bolso:</span>
              <span className="font-black text-slate-900 text-sm">{formatCurrency(comparison.offerB.annualNet, locale)}</span>
            </div>
            {comparison.offerB.annualRrspEmployerFreeMoney > 0 && (
              <div className="flex justify-between text-xs text-emerald-700 font-bold pt-1 border-t border-slate-200">
                <span>+ Bônus REER Empregador:</span>
                <span>+{formatCurrency(comparison.offerB.annualRrspEmployerFreeMoney, locale)} / ano</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
