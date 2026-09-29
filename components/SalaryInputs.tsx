'use client';

import React, { useState } from 'react';
import { TaxInput, CanadianProvince, CANADIAN_PROVINCES } from '@/lib/tax-engine';
import { Language, translations } from '@/lib/i18n';
import {
  DollarSign,
  Clock,
  PlusCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  RefreshCcw,
  Sliders,
  ShieldPlus,
  Coffee,
  Factory,
  HelpCircle,
  ArrowRight,
  Calculator,
  MapPin,
} from 'lucide-react';

interface SalaryInputsProps {
  input: TaxInput;
  onChange: (newInput: TaxInput) => void;
  onLoadLeclercExample: () => void;
  onCalculate?: () => void;
  lang: Language;
}

const HOURLY_PRESETS = [15.75, 22.0, 26.0, 31.51, 35.0, 42.0];
const ANNUAL_PRESETS = [45000, 55000, 65000, 75000, 90000, 110000];
const BIWEEKLY_PRESETS = [1500, 2000, 2500, 3000, 3500, 4200];
const HOURS_PRESETS = [35, 36, 37.5, 40];

export const SalaryInputs: React.FC<SalaryInputsProps> = ({
  input,
  onChange,
  onLoadLeclercExample,
  onCalculate,
  lang,
}) => {
  const t = translations[lang];
  const [showOvertime, setShowOvertime] = useState(
    input.overtime15HoursPerWeek > 0 || input.overtime20HoursPerWeek > 0
  );
  const [showAdvancedBenefits, setShowAdvancedBenefits] = useState(input.mode === 'advanced');

  const regHours = Math.max(0.5, input.regularHoursPerWeek || 40);

  const handleRateChange = (val: number) => {
    const safeRate = Math.max(0, val);
    onChange({
      ...input,
      hourlyRate: safeRate,
      annualGrossSalary: Math.round(safeRate * regHours * 52),
      periodGrossSalary: Math.round(safeRate * regHours * 2 * 100) / 100,
    });
  };

  const handleAnnualGrossChange = (val: number) => {
    const safeAnnual = Math.max(0, val);
    const derivedHourly = Math.round((safeAnnual / (regHours * 52)) * 100) / 100;
    onChange({
      ...input,
      annualGrossSalary: safeAnnual,
      periodGrossSalary: Math.round((safeAnnual / 26) * 100) / 100,
      hourlyRate: derivedHourly,
    });
  };

  const handleBiweeklyGrossChange = (val: number) => {
    const safeBiweekly = Math.max(0, val);
    const derivedHourly = Math.round((safeBiweekly / (regHours * 2)) * 100) / 100;
    onChange({
      ...input,
      periodGrossSalary: safeBiweekly,
      annualGrossSalary: Math.round(safeBiweekly * 26),
      hourlyRate: derivedHourly,
    });
  };

  const handleRegularHoursChange = (val: number) => {
    const safeHours = Math.max(0.5, val);
    let updated = { ...input, regularHoursPerWeek: safeHours };
    if (input.entryMode === 'annual' && input.annualGrossSalary) {
      updated.hourlyRate = Math.round((input.annualGrossSalary / (safeHours * 52)) * 100) / 100;
    } else if (input.entryMode === 'biweekly' && input.periodGrossSalary) {
      updated.hourlyRate = Math.round((input.periodGrossSalary / (safeHours * 2)) * 100) / 100;
    } else {
      updated.annualGrossSalary = Math.round(input.hourlyRate * safeHours * 52);
      updated.periodGrossSalary = Math.round(input.hourlyRate * safeHours * 2 * 100) / 100;
    }
    onChange(updated);
  };

  const handleOt15Change = (val: number) => {
    onChange({ ...input, overtime15HoursPerWeek: Math.max(0, val) });
  };

  const handleOt20Change = (val: number) => {
    onChange({ ...input, overtime20HoursPerWeek: Math.max(0, val) });
  };

  const handleModeChange = (mode: 'simple' | 'advanced') => {
    onChange({ ...input, mode });
    if (mode === 'advanced') {
      setShowAdvancedBenefits(true);
    }
  };

  const handleReset = () => {
    onChange({
      entryMode: 'hourly',
      annualGrossSalary: 52000,
      periodGrossSalary: 2000,
      hourlyRate: 25.0,
      regularHoursPerWeek: 40,
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
    setShowOvertime(false);
    setShowAdvancedBenefits(false);
  };

  const currentEntryMode = input.entryMode || 'hourly';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-6 transition-all space-y-5">
      {/* Top Header with Mode Selector & Reset */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>⚙️</span>
            <span>{t.title}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.fiscalYearBadge}
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
          title="Réinitialiser les valeurs par défaut"
        >
          <RefreshCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Défaut</span>
        </button>
      </div>

      {/* Province / Territory Selector (All Canada) */}
      <div className="bg-slate-50 p-3 sm:p-3.5 rounded-xl border border-slate-200/90 space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span>
              {lang === 'pt'
                ? 'Província ou Território do Canadá'
                : lang === 'en'
                ? 'Province or Territory'
                : 'Province ou Territoire'}
            </span>
          </label>
          <span className="text-[11px] text-slate-500 font-medium">
            {lang === 'pt' ? 'Salário Mínimo: ' : 'Salaire Min: '}
            <strong className="text-slate-900 font-bold">
              ${(CANADIAN_PROVINCES[input.province || 'QC'] || CANADIAN_PROVINCES.QC).minWageHourly.toFixed(2)}/h
            </strong>
          </span>
        </div>

        {/* Quick Province Switcher Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
          {(['QC', 'ON', 'BC', 'AB', 'MB', 'SK', 'NS'] as CanadianProvince[]).map((pCode) => {
            const isSelected = (input.province || 'QC') === pCode;
            const pInfo = CANADIAN_PROVINCES[pCode];
            return (
              <button
                key={pCode}
                type="button"
                onClick={() => {
                  const targetThreshold = pInfo.standardOvertimeThresholdHours;
                  onChange({
                    ...input,
                    province: pCode,
                    // If regular hours is standard 40 and target requires 44 or vice versa, keep user in sync
                    regularHoursPerWeek: (input.regularHoursPerWeek === 40 || input.regularHoursPerWeek === 44) ? targetThreshold : input.regularHoursPerWeek,
                  });
                }}
                className={`py-1 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 border flex items-center gap-1 ${
                  isSelected
                    ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{pInfo.flag}</span>
                <span>{pCode}</span>
              </button>
            );
          })}
        </div>

        <select
          value={input.province || 'QC'}
          onChange={(e) => {
            const newProv = e.target.value as CanadianProvince;
            const pInfo = CANADIAN_PROVINCES[newProv] || CANADIAN_PROVINCES.QC;
            onChange({
              ...input,
              province: newProv,
              regularHoursPerWeek: (input.regularHoursPerWeek === 40 || input.regularHoursPerWeek === 44) ? pInfo.standardOvertimeThresholdHours : input.regularHoursPerWeek,
            });
          }}
          className="w-full px-3 py-2 text-xs sm:text-sm font-bold text-slate-900 bg-white border border-slate-300 rounded-lg shadow-2xs focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          {Object.values(CANADIAN_PROVINCES).map((prov) => (
            <option key={prov.code} value={prov.code}>
              {prov.flag} {prov.name[lang]} ({prov.code}) — {prov.pensionPlan === 'RRQ' ? 'RRQ/RQAP' : 'CPP/AE'} · Heures sup: {prov.standardOvertimeThresholdHours}h
            </option>
          ))}
        </select>
        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
          <span className="line-clamp-1">
            {(CANADIAN_PROVINCES[input.province || 'QC'] || CANADIAN_PROVINCES.QC).highlights[lang]}
          </span>
          <span className="shrink-0 font-semibold text-blue-700 ml-2">
            OT 1.5x: após {(CANADIAN_PROVINCES[input.province || 'QC'] || CANADIAN_PROVINCES.QC).standardOvertimeThresholdHours}h
          </span>
        </div>
      </div>

      {/* Mode Selector (Standard vs Talon Réel) & Quick Factory Load */}
      <div className="space-y-2">
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl border border-slate-200/80">
          <button
            type="button"
            onClick={() => handleModeChange('simple')}
            className={`py-1.5 sm:py-2 px-3 text-xs font-bold rounded-lg transition-all text-center cursor-pointer ${
              input.mode === 'simple'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.modeSimple}
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('advanced')}
            className={`py-1.5 sm:py-2 px-3 text-xs font-bold rounded-lg transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
              input.mode === 'advanced'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.modeAdvanced}</span>
          </button>
        </div>

        {/* Quick button to load real Leclerc stub */}
        <button
          type="button"
          onClick={onLoadLeclercExample}
          className="w-full py-1.5 sm:py-2 px-3 text-xs font-semibold text-blue-700 bg-blue-50/80 hover:bg-blue-100 border border-blue-200/80 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Factory className="w-4 h-4 text-blue-600" />
          <span>{t.loadExampleBtn}</span>
        </button>
      </div>

      {/* Input Group based on Entry Mode */}
      {currentEntryMode === 'hourly' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="hourly-rate-input" className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-4 h-4 sm:w-5 h-5 text-blue-600" />
              <span>{t.hourlyRateLabel}</span>
            </label>
            <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200/80">
              {t.minWageBadge}
            </span>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 font-extrabold text-xl sm:text-2xl">
              $
            </div>
            <input
              id="hourly-rate-input"
              type="number"
              min="0"
              max="500"
              step="0.01"
              value={input.hourlyRate || ''}
              onChange={(e) => handleRateChange(parseFloat(e.target.value) || 0)}
              className="block w-full pl-9 sm:pl-11 pr-14 sm:pr-16 py-2.5 sm:py-3.5 text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 bg-white border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-600 transition-all shadow-xs tabular-nums"
              placeholder="25.00"
            />
            <div className="absolute inset-y-0 right-0 pr-3.5 sm:pr-4 flex items-center pointer-events-none text-slate-500 font-bold text-xs sm:text-base">
              / h
            </div>
          </div>

          {/* Quick Hourly Presets */}
          <div className="flex flex-wrap gap-2 pt-1">
            {HOURLY_PRESETS.map((rate) => (
              <button
                key={rate}
                type="button"
                onClick={() => handleRateChange(rate)}
                className={`text-xs sm:text-sm px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer active:scale-95 ${
                  input.hourlyRate === rate
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 border border-slate-200/80'
                }`}
              >
                ${rate.toFixed(2)}/h
              </button>
            ))}
          </div>

          <div className="pt-2">
            <input
              type="range"
              min="15.75"
              max="90"
              step="0.25"
              value={input.hourlyRate || 15.75}
              onChange={(e) => handleRateChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              aria-label="Ajuster le taux horaire"
            />
          </div>
        </div>
      )}

      {currentEntryMode === 'annual' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="annual-gross-input" className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-4 h-4 sm:w-5 h-5 text-blue-600" />
              <span>{t.annualGrossLabel}</span>
            </label>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              ${input.hourlyRate.toFixed(2)} / h
            </span>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 font-extrabold text-xl sm:text-2xl">
              $
            </div>
            <input
              id="annual-gross-input"
              type="number"
              min="0"
              step="500"
              value={input.annualGrossSalary || Math.round(input.hourlyRate * regHours * 52)}
              onChange={(e) => handleAnnualGrossChange(parseFloat(e.target.value) || 0)}
              className="block w-full pl-9 sm:pl-11 pr-14 sm:pr-16 py-2.5 sm:py-3.5 text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 bg-white border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-600 transition-all shadow-xs tabular-nums"
              placeholder="65000"
            />
            <div className="absolute inset-y-0 right-0 pr-3.5 sm:pr-4 flex items-center pointer-events-none text-slate-500 font-bold text-xs sm:text-base">
              / an
            </div>
          </div>

          {/* Quick Annual Presets */}
          <div className="flex flex-wrap gap-2 pt-1">
            {ANNUAL_PRESETS.map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => handleAnnualGrossChange(val)}
                className="text-xs sm:text-sm px-3 py-1.5 rounded-xl font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 border border-slate-200/80 transition-all cursor-pointer active:scale-95"
              >
                ${(val / 1000).toFixed(0)}k/an
              </button>
            ))}
          </div>
          <p className="text-xs text-blue-700 font-medium mt-1">
            💡 {t.derivedHourlyNote} <strong>${input.hourlyRate.toFixed(2)}/h</strong> para uma jornada de {regHours}h/semana.
          </p>
        </div>
      )}

      {currentEntryMode === 'biweekly' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="biweekly-gross-input" className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-4 h-4 sm:w-5 h-5 text-blue-600" />
              <span>{t.periodGrossLabel}</span>
            </label>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              ${input.hourlyRate.toFixed(2)} / h
            </span>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 font-extrabold text-xl sm:text-2xl">
              $
            </div>
            <input
              id="biweekly-gross-input"
              type="number"
              min="0"
              step="100"
              value={input.periodGrossSalary || Math.round(input.hourlyRate * regHours * 2)}
              onChange={(e) => handleBiweeklyGrossChange(parseFloat(e.target.value) || 0)}
              className="block w-full pl-9 sm:pl-11 pr-20 sm:pr-24 py-2.5 sm:py-3.5 text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 bg-white border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-600 transition-all shadow-xs tabular-nums"
              placeholder="2500"
            />
            <div className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center pointer-events-none text-slate-500 font-bold text-[11px] sm:text-sm">
              / quinzaine
            </div>
          </div>

          {/* Quick Biweekly Presets */}
          <div className="flex flex-wrap gap-2 pt-1">
            {BIWEEKLY_PRESETS.map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => handleBiweeklyGrossChange(val)}
                className="text-xs sm:text-sm px-3 py-1.5 rounded-xl font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 border border-slate-200/80 transition-all cursor-pointer active:scale-95"
              >
                ${val}
              </button>
            ))}
          </div>
          <p className="text-xs text-blue-700 font-medium mt-1">
            💡 {t.derivedHourlyNote} <strong>${input.hourlyRate.toFixed(2)}/h</strong> para {regHours * 2}h aux 2 semaines.
          </p>
        </div>
      )}

      {/* 2. Horas de trabalho regulares */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="regular-hours-input" className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 sm:w-5 h-5 text-blue-600" />
            <span>{t.regularHoursLabel}</span>
          </label>
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
            {regHours}h / sem ({regHours * 2}h / quinzena)
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="relative flex-1">
            <input
              id="regular-hours-input"
              type="number"
              min="1"
              max="84"
              step="0.5"
              value={input.regularHoursPerWeek}
              onChange={(e) => handleRegularHoursChange(parseFloat(e.target.value) || 0)}
              className="block w-full px-4 py-2.5 sm:py-3 font-extrabold text-slate-900 bg-white border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-600 text-lg tabular-nums"
            />
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-500 font-bold text-xs sm:text-sm">
              h / sem
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {HOURS_PRESETS.map((hrs) => (
              <button
                key={hrs}
                type="button"
                onClick={() => handleRegularHoursChange(hrs)}
                className={`text-xs sm:text-sm px-3.5 py-2 sm:py-2.5 rounded-xl font-bold transition-all cursor-pointer active:scale-95 ${
                  input.regularHoursPerWeek === hrs
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 border border-slate-200/80'
                }`}
              >
                {hrs}h
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Section Horas Extras Opcionais */}
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/40">
        <button
          type="button"
          onClick={() => setShowOvertime(!showOvertime)}
          className="w-full px-3.5 py-2.5 text-left flex items-center justify-between text-xs font-semibold text-slate-800 hover:bg-slate-100/70 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <PlusCircle className="w-4 h-4 text-blue-600" />
            <span>{t.overtimeTitle}</span>
            {(input.overtime15HoursPerWeek > 0 || input.overtime20HoursPerWeek > 0) && (
              <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                {input.overtime15HoursPerWeek + input.overtime20HoursPerWeek}h
              </span>
            )}
          </div>
          {showOvertime ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {showOvertime && (
          <div className="p-3.5 pt-1 space-y-3 border-t border-slate-200/60 bg-white">
            <p className="text-[11px] text-slate-500">
              {t.overtimeSubtitle}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">
                  {t.overtime15Label}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="40"
                    step="0.5"
                    value={input.overtime15HoursPerWeek}
                    onChange={(e) => handleOt15Change(parseFloat(e.target.value) || 0)}
                    className="block w-full px-3 py-1.5 text-sm font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                  <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400 text-xs">
                    h/sem
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">
                  {t.overtime20Label}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="40"
                    step="0.5"
                    value={input.overtime20HoursPerWeek}
                    onChange={(e) => handleOt20Change(parseFloat(e.target.value) || 0)}
                    className="block w-full px-3 py-1.5 text-sm font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                  <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400 text-xs">
                    h/sem
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Section Mode Avancé: Primes, Assurances, Cafeteria */}
      {input.mode === 'advanced' && (
        <div className="border border-blue-200 rounded-xl overflow-hidden bg-blue-50/20">
          <button
            type="button"
            onClick={() => setShowAdvancedBenefits(!showAdvancedBenefits)}
            className="w-full px-3.5 py-2.5 text-left flex items-center justify-between text-xs font-bold text-blue-900 bg-blue-50/60 hover:bg-blue-100/60 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <ShieldPlus className="w-4 h-4 text-blue-600" />
              <span>{t.advancedSectionTitle}</span>
            </div>
            {showAdvancedBenefits ? <ChevronUp className="w-4 h-4 text-blue-600" /> : <ChevronDown className="w-4 h-4 text-blue-600" />}
          </button>

          {showAdvancedBenefits && (
            <div className="p-3.5 pt-2 space-y-4 bg-white border-t border-blue-100">
              <p className="text-[11px] text-slate-500">
                {t.advancedSectionSubtitle}
              </p>

              {/* Prime de Quart / Prime 36-40 */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs sm:text-sm font-bold text-slate-800">
                    {t.shiftPremiumLabel}
                  </label>
                  <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => onChange({ ...input, shiftPremiumType: 'hourly' })}
                      className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${input.shiftPremiumType === 'hourly' ? 'bg-white text-blue-700 shadow-xs font-bold' : 'text-slate-600'}`}
                    >
                      $/h
                    </button>
                    <button
                      type="button"
                      onClick={() => onChange({ ...input, shiftPremiumType: 'fixed' })}
                      className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${input.shiftPremiumType === 'fixed' ? 'bg-white text-blue-700 shadow-xs font-bold' : 'text-slate-600'}`}
                    >
                      $ fixe
                    </button>
                  </div>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold text-sm">$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={input.shiftPremiumAmount || ''}
                    onChange={(e) => onChange({ ...input, shiftPremiumAmount: parseFloat(e.target.value) || 0 })}
                    className="w-full pl-8 pr-3.5 py-2.5 text-sm sm:text-base font-semibold text-slate-900 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="ex: 3.50 $/h ou 252.08 $ fixe"
                  />
                </div>
              </div>

              {/* Assurance Médicale (Part Employé) */}
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-bold text-slate-800 block">
                  {t.groupHealthInsLabel} ($ / quinzaine)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold text-sm">$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={input.healthInsuranceEmployee || ''}
                    onChange={(e) => onChange({ ...input, healthInsuranceEmployee: parseFloat(e.target.value) || 0 })}
                    className="w-full pl-8 pr-3.5 py-2.5 text-sm sm:text-base font-semibold text-slate-900 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="74.28"
                  />
                </div>
              </div>

              {/* Assurance Vie & Accident (Part Employé) */}
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-bold text-slate-800 block">
                  {t.lifeAccidentInsLabel} ($ / quinzaine)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold text-sm">$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={input.lifeAndDisabilityInsuranceEmployee || ''}
                    onChange={(e) => onChange({ ...input, lifeAndDisabilityInsuranceEmployee: parseFloat(e.target.value) || 0 })}
                    className="w-full pl-8 pr-3.5 py-2.5 text-sm sm:text-base font-semibold text-slate-900 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="16.30"
                  />
                </div>
              </div>

              {/* Avantages Imposables Employeur (Case J Relevé 1) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs sm:text-sm font-bold text-slate-800">
                    {t.employerTaxableBenefitsLabel}
                  </label>
                  <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md font-bold border border-amber-200/60">
                    Revenu Québec
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold text-sm">$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={input.employerTaxableBenefits || ''}
                    onChange={(e) => onChange({ ...input, employerTaxableBenefits: parseFloat(e.target.value) || 0 })}
                    className="w-full pl-8 pr-3.5 py-2.5 text-sm sm:text-base font-semibold text-slate-900 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="56.13"
                  />
                </div>
                <p className="text-xs text-slate-500">
                  {t.employerTaxableBenefitsHelper}
                </p>
              </div>

              {/* Cafeteria & factory store */}
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-bold text-slate-800 block">
                  {t.cafeteriaLabel} ($ / quinzaine)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold text-sm">$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={input.otherDeductionsPerPay || ''}
                    onChange={(e) => onChange({ ...input, otherDeductionsPerPay: parseFloat(e.target.value) || 0 })}
                    className="w-full pl-8 pr-3.5 py-2.5 text-sm sm:text-base font-semibold text-slate-900 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="9.00"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {onCalculate && (
        <div className="pt-4 border-t border-slate-200/90 mt-2">
          <button
            type="button"
            onClick={onCalculate}
            className="w-full py-3.5 px-5 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 text-white rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all cursor-pointer group"
          >
            <Calculator className="w-5 h-5 text-blue-200 group-hover:scale-110 transition-transform" />
            <span>
              {lang === 'pt'
                ? 'Calcular Salário Líquido e Ver Deduções'
                : lang === 'en'
                ? 'Calculate Net Pay & View Deductions'
                : 'Calculer le salaire net et voir les retenues'}
            </span>
            <ArrowRight className="w-4 h-4 text-blue-200 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}
    </div>
  );
};
