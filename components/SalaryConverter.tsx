'use client';

import React, { useState } from 'react';
import { formatCurrency } from '@/lib/tax-engine';
import { Language } from '@/lib/i18n';
import {
  Repeat,
  Sparkles,
  Clock,
  Calendar,
  DollarSign,
  ArrowRight,
  Calculator,
  Layers,
} from 'lucide-react';

interface SalaryConverterProps {
  lang: Language;
}

export const SalaryConverter: React.FC<SalaryConverterProps> = ({ lang }) => {
  const [baseType, setBaseType] = useState<'hourly' | 'annual' | 'biweekly'>('hourly');
  const [amount, setAmount] = useState<number>(25.0);
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(40);
  const [weeksPerYear, setWeeksPerYear] = useState<number>(52);

  const locale = lang === 'pt' ? 'pt-BR' : lang === 'en' ? 'en-CA' : 'fr-CA';

  // Calculations
  const totalAnnualHours = hoursPerWeek * weeksPerYear;

  let hourly = 0;
  let annual = 0;

  if (baseType === 'hourly') {
    hourly = amount;
    annual = hourly * totalAnnualHours;
  } else if (baseType === 'annual') {
    annual = amount;
    hourly = totalAnnualHours > 0 ? annual / totalAnnualHours : 0;
  } else {
    // biweekly
    annual = amount * 26;
    hourly = (hoursPerWeek * 2) > 0 ? amount / (hoursPerWeek * 2) : 0;
  }

  const weekly = annual / 52;
  const biweekly = annual / 26;
  const semiMonthly = annual / 24;
  const monthly = annual / 12;
  const daily8h = hourly * (hoursPerWeek / 5);

  const presets = [15.75, 20.0, 25.0, 30.0, 35.0, 42.0, 55.0];

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0 shadow-xs">
            <Repeat className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200 mb-1.5">
              <Sparkles className="w-3 h-3" />
              <span>
                {lang === 'pt'
                  ? 'Conversão Instantânea Multi-Períodos'
                  : lang === 'en'
                  ? 'Instant Multi-Period Conversion'
                  : 'Convertisseur multi-périodes instantané'}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              {lang === 'pt'
                ? 'Conversor de Salário: Horista ⇄ Quinzenal ⇄ Anual'
                : lang === 'en'
                ? 'Salary Converter: Hourly ⇄ Bi-weekly ⇄ Annual'
                : 'Convertisseur de Salaire : Horaire ⇄ Quinzaine ⇄ Annuel'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              {lang === 'pt'
                ? 'Alterne facilmente entre taxa horária, valor por dia, semana, quinzena (aux 2 semaines) e salário anual com jornada personalizada.'
                : lang === 'en'
                ? 'Seamlessly convert between hourly wage, daily pay, weekly, bi-weekly (every 2 weeks), and yearly salary with custom work hours.'
                : 'Convertissez instantanément entre taux horaire, paie par jour, semaine, aux deux semaines et salaire annuel brut.'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Workspace Card */}
      <div className="bg-white p-5 sm:p-7 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        {/* Mode Selector Tabs */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            {lang === 'pt' ? 'Qual valor você deseja inserir como base?' : lang === 'en' ? 'Base amount you want to convert from:' : 'Montant de départ à convertir :'}
          </label>
          <div className="grid grid-cols-3 p-1.5 bg-slate-100 rounded-xl border border-slate-200/80 gap-1">
            <button
              type="button"
              onClick={() => {
                setBaseType('hourly');
                setAmount(25);
              }}
              className={`py-2 px-3 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                baseType === 'hourly' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lang === 'pt' ? 'Taxa Horária ($/h)' : lang === 'en' ? 'Hourly Wage ($/h)' : 'Taux horaire ($/h)'}
            </button>
            <button
              type="button"
              onClick={() => {
                setBaseType('biweekly');
                setAmount(2000);
              }}
              className={`py-2 px-3 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                baseType === 'biweekly' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lang === 'pt' ? 'Quinzena ($/2 sem)' : lang === 'en' ? 'Bi-weekly ($/2 wks)' : 'Quinzaine ($/2 sem)'}
            </button>
            <button
              type="button"
              onClick={() => {
                setBaseType('annual');
                setAmount(52000);
              }}
              className={`py-2 px-3 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                baseType === 'annual' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lang === 'pt' ? 'Salário Anual ($/ano)' : lang === 'en' ? 'Annual Salary ($/yr)' : 'Salaire annuel ($/an)'}
            </button>
          </div>
        </div>

        {/* Input Field with Quick Presets */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>{lang === 'pt' ? 'Valor informado:' : lang === 'en' ? 'Input amount:' : 'Montant saisi :'}</span>
            </span>
            <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              {totalAnnualHours}h / {lang === 'pt' ? 'ano' : 'an'}
            </span>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 font-extrabold text-2xl">
              $
            </div>
            <input
              type="number"
              min="0"
              step={baseType === 'hourly' ? '0.25' : baseType === 'biweekly' ? '50' : '1000'}
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="block w-full pl-10 pr-24 py-3 sm:py-4 text-2xl sm:text-3xl font-extrabold text-slate-900 bg-white border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-600 tabular-nums shadow-xs"
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-500 font-bold text-sm">
              {baseType === 'hourly' ? '/ heure' : baseType === 'biweekly' ? '/ 2 sem.' : '/ année'}
            </div>
          </div>

          {baseType === 'hourly' && (
            <div className="flex flex-wrap gap-2 pt-1">
              {presets.map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => setAmount(rate)}
                  className={`text-xs sm:text-sm px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                    amount === rate
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  ${rate.toFixed(2)}/h
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Work Hours & Schedule Configuration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>{lang === 'pt' ? 'Horas por semana' : lang === 'en' ? 'Hours per week' : 'Heures par semaine'}</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="80"
                step="0.5"
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(parseFloat(e.target.value) || 40)}
                className="w-full px-3 py-2 text-sm font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex gap-1">
                {[35, 37.5, 40].map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setHoursPerWeek(h)}
                    className={`px-2.5 py-1.5 text-xs font-bold rounded-lg border cursor-pointer ${
                      hoursPerWeek === h ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {h}h
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>{lang === 'pt' ? 'Semanas pagas no ano' : lang === 'en' ? 'Paid weeks per year' : 'Semaines rémunérées par an'}</span>
            </label>
            <select
              value={weeksPerYear}
              onChange={(e) => setWeeksPerYear(parseInt(e.target.value, 10) || 52)}
              className="w-full px-3 py-2 text-sm font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value={52}>52 {lang === 'pt' ? 'semanas (padrão com férias)' : 'semaines (standard incluant vacances)'}</option>
              <option value={50}>50 {lang === 'pt' ? 'semanas (2 sem. não remuneradas)' : 'semaines (2 sem. sans solde)'}</option>
              <option value={48}>48 {lang === 'pt' ? 'semanas (4 sem. não remuneradas)' : 'semaines (4 sem. sans solde)'}</option>
            </select>
          </div>
        </div>

        {/* Live Conversion Results Grid (iLovePDF Style Cards) */}
        <div className="pt-4 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
            {lang === 'pt' ? 'Equivalência Instantânea em Todos os Períodos:' : lang === 'en' ? 'Instant Equivalency Across All Cycles:' : 'Équivalences dans tous les cycles :'}
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {/* Horaire */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 text-center">
              <span className="text-[11px] text-slate-500 font-semibold block">{lang === 'pt' ? 'Por Hora' : 'Par Heure'}</span>
              <span className="text-lg sm:text-xl font-black text-slate-900 tabular-nums">
                {formatCurrency(hourly, locale)}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">1 h</span>
            </div>

            {/* Jour */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 text-center">
              <span className="text-[11px] text-slate-500 font-semibold block">{lang === 'pt' ? 'Por Dia' : 'Par Jour'}</span>
              <span className="text-lg sm:text-xl font-black text-slate-900 tabular-nums">
                {formatCurrency(daily8h, locale)}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">{(hoursPerWeek / 5).toFixed(1)} h</span>
            </div>

            {/* Semaine */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 text-center">
              <span className="text-[11px] text-slate-500 font-semibold block">{lang === 'pt' ? 'Semanal' : 'Par Semaine'}</span>
              <span className="text-lg sm:text-xl font-black text-slate-900 tabular-nums">
                {formatCurrency(weekly, locale)}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">{hoursPerWeek} h</span>
            </div>

            {/* Quinzaine (QC standard) */}
            <div className="p-3.5 rounded-xl bg-blue-50 border-2 border-blue-300 text-center shadow-xs">
              <span className="text-[11px] text-blue-700 font-bold block">{lang === 'pt' ? 'Aux 2 semaines (QC)' : 'Aux 2 semaines (QC)'}</span>
              <span className="text-lg sm:text-xl font-black text-blue-900 tabular-nums">
                {formatCurrency(biweekly, locale)}
              </span>
              <span className="text-[10px] text-blue-600 font-semibold block mt-0.5">
                {hoursPerWeek * 2} h · 26 paies/an
              </span>
            </div>

            {/* Mensuel */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 text-center">
              <span className="text-[11px] text-slate-500 font-semibold block">{lang === 'pt' ? 'Mensal' : 'Par Mois'}</span>
              <span className="text-lg sm:text-xl font-black text-slate-900 tabular-nums">
                {formatCurrency(monthly, locale)}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">12 paies/an</span>
            </div>

            {/* Annuel */}
            <div className="p-3.5 rounded-xl bg-emerald-50 border-2 border-emerald-300 text-center shadow-xs">
              <span className="text-[11px] text-emerald-700 font-bold block">{lang === 'pt' ? 'Salário Anual' : 'Par Année'}</span>
              <span className="text-lg sm:text-xl font-black text-emerald-950 tabular-nums">
                {formatCurrency(annual, locale)}
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">
                {totalAnnualHours} h / an
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
