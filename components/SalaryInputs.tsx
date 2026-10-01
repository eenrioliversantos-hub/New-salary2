'use client';

import React, { useState } from 'react';
import { TaxInput, CanadianProvince, CANADIAN_PROVINCES, SalaryEntryMode } from '@/lib/tax-engine';
import { Language, translations } from '@/lib/i18n';
import {
  DollarSign,
  Clock,
  PlusCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  RefreshCcw,
  ShieldPlus,
  Factory,
  MapPin,
} from 'lucide-react';

interface SalaryInputsProps {
  input: TaxInput;
  onChange: (newInput: TaxInput) => void;
  onLoadLeclercExample: () => void;
  lang: Language;
}

export const SalaryInputs: React.FC<SalaryInputsProps> = ({
  input,
  onChange,
  onLoadLeclercExample,
  lang,
}) => {
  const t = translations[lang];
  const [showOvertime, setShowOvertime] = useState(
    input.overtime15HoursPerWeek > 0 || input.overtime20HoursPerWeek > 0
  );
  const [showAdvancedBenefits, setShowAdvancedBenefits] = useState(input.mode === 'advanced');

  const regHours = Math.max(0.5, input.regularHoursPerWeek || 40);
  const currentEntryMode: SalaryEntryMode = input.entryMode || 'hourly';
  const currentProvinceInfo = CANADIAN_PROVINCES[input.province || 'QC'] || CANADIAN_PROVINCES.QC;

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
    const updated = { ...input, regularHoursPerWeek: safeHours };
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

  const handleEntryModeToggle = (mode: SalaryEntryMode) => {
    const updated = { ...input, entryMode: mode };
    if (mode === 'annual') {
      const annual = input.annualGrossSalary || Math.round(input.hourlyRate * regHours * 52);
      updated.annualGrossSalary = annual;
      updated.hourlyRate = Math.round((annual / (regHours * 52)) * 100) / 100;
    } else if (mode === 'biweekly') {
      const biweekly = input.periodGrossSalary || Math.round(input.hourlyRate * regHours * 2 * 100) / 100;
      updated.periodGrossSalary = biweekly;
      updated.hourlyRate = Math.round((biweekly / (regHours * 2)) * 100) / 100;
    } else {
      updated.annualGrossSalary = Math.round(input.hourlyRate * regHours * 52);
      updated.periodGrossSalary = Math.round(input.hourlyRate * regHours * 2 * 100) / 100;
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
      province: 'QC',
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

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 transition-all space-y-6">
      {/* 1. Header with Title & Reset Button */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
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
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors py-1.5 px-2.5 rounded-lg hover:bg-slate-100 cursor-pointer border border-transparent hover:border-slate-200"
          title={lang === 'pt' ? 'Restaurar valores padrão' : lang === 'en' ? 'Reset to defaults' : 'Réinitialiser'}
        >
          <RefreshCcw className="w-3.5 h-3.5" />
          <span>{lang === 'pt' ? 'Padrão' : lang === 'en' ? 'Reset' : 'Défaut'}</span>
        </button>
      </div>

      {/* 2. Province / Territory Selector (Clean Institutional Dropdown) */}
      <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="province-select" className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span>
              {lang === 'pt'
                ? 'Província ou Território do Canadá'
                : lang === 'en'
                ? 'Province or Territory'
                : 'Province ou Territoire'}
            </span>
          </label>
          <span className="text-xs text-slate-500 font-medium">
            {lang === 'pt' ? 'Salário Mínimo: ' : lang === 'en' ? 'Min Wage: ' : 'Salaire Min: '}
            <strong className="text-slate-900 font-bold">
              ${currentProvinceInfo.minWageHourly.toFixed(2)}/h
            </strong>
          </span>
        </div>

        <select
          id="province-select"
          value={input.province || 'QC'}
          onChange={(e) => {
            const newProv = e.target.value as CanadianProvince;
            const pInfo = CANADIAN_PROVINCES[newProv] || CANADIAN_PROVINCES.QC;
            onChange({
              ...input,
              province: newProv,
              regularHoursPerWeek:
                input.regularHoursPerWeek === 40 || input.regularHoursPerWeek === 44
                  ? pInfo.standardOvertimeThresholdHours
                  : input.regularHoursPerWeek,
            });
          }}
          className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 bg-white border border-slate-300 rounded-xl shadow-2xs focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 cursor-pointer"
        >
          {Object.values(CANADIAN_PROVINCES).map((prov) => (
            <option key={prov.code} value={prov.code}>
              {prov.flag} {prov.name[lang]} ({prov.code}) — {prov.pensionPlan === 'RRQ' ? 'RRQ / RQAP' : 'CPP / EI'} · {lang === 'pt' ? 'Carga normal' : lang === 'en' ? 'Normal base' : 'Base normale'}: {prov.standardOvertimeThresholdHours}h/sem
            </option>
          ))}
        </select>

        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
          <span className="line-clamp-1">
            {currentProvinceInfo.highlights[lang]}
          </span>
          <span className="shrink-0 font-medium text-slate-600 ml-2">
            {lang === 'pt' ? 'Horas extras 1.5x após ' : lang === 'en' ? 'Overtime 1.5x after ' : 'Heures sup. 1.5x après '}
            <strong className="text-slate-900 font-bold">
              {currentProvinceInfo.standardOvertimeThresholdHours}h
            </strong>
          </span>
        </div>
      </div>

      {/* 3. Salary Entry Format Tabs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {lang === 'pt' ? 'Formato de Remuneração' : lang === 'en' ? 'Pay Rate Format' : 'Format de rémunération'}
          </label>
          <span className="text-xs text-blue-700 font-medium">
            {currentEntryMode === 'hourly'
              ? (lang === 'pt' ? 'Padrão por hora' : lang === 'en' ? 'Hourly basis' : 'Taux horaire')
              : (lang === 'pt' ? 'Conversão automática' : lang === 'en' ? 'Auto-converted' : 'Conversion auto')}
          </span>
        </div>

        <div className="grid grid-cols-3 p-1 bg-slate-100 rounded-xl border border-slate-200/80 gap-1">
          <button
            type="button"
            onClick={() => handleEntryModeToggle('hourly')}
            className={`py-2 px-2 text-xs font-bold rounded-lg transition-all cursor-pointer text-center ${
              currentEntryMode === 'hourly'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.entryModeHourly || 'Por Hora ($/h)'}
          </button>
          <button
            type="button"
            onClick={() => handleEntryModeToggle('biweekly')}
            className={`py-2 px-2 text-xs font-bold rounded-lg transition-all cursor-pointer text-center ${
              currentEntryMode === 'biweekly'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.entryModeBiweekly || 'Por Quinzena'}
          </button>
          <button
            type="button"
            onClick={() => handleEntryModeToggle('annual')}
            className={`py-2 px-2 text-xs font-bold rounded-lg transition-all cursor-pointer text-center ${
              currentEntryMode === 'annual'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.entryModeAnnual || 'Por Ano'}
          </button>
        </div>

        {/* Primary Salary Input based on Entry Mode */}
        {currentEntryMode === 'hourly' && (
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between">
              <label htmlFor="hourly-rate-input" className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-blue-600" />
                <span>{t.hourlyRateLabel}</span>
              </label>
              <span className="text-xs text-slate-500 font-medium">
                {lang === 'pt' ? 'Mínimo provincial: ' : lang === 'en' ? 'Provincial min: ' : 'Min provincial : '}
                ${currentProvinceInfo.minWageHourly.toFixed(2)}/h
              </span>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 sm:pl-4 flex items-center pointer-events-none text-slate-400 font-bold text-lg sm:text-xl">
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
                className="block w-full pl-8 sm:pl-10 pr-16 sm:pr-20 py-3 sm:py-3.5 text-xl sm:text-2xl font-black text-slate-900 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all shadow-2xs tabular-nums"
                placeholder="25.00"
              />
              <div className="absolute inset-y-0 right-0 pr-3.5 sm:pr-4 flex items-center pointer-events-none text-slate-500 font-semibold text-xs sm:text-sm">
                / {lang === 'pt' ? 'hora' : lang === 'en' ? 'hour' : 'heure'}
              </div>
            </div>
          </div>
        )}

        {currentEntryMode === 'biweekly' && (
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between">
              <label htmlFor="biweekly-gross-input" className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-blue-600" />
                <span>{t.periodGrossLabel}</span>
              </label>
              <span className="text-xs text-slate-600 font-semibold">
                ≈ ${(input.hourlyRate || 0).toFixed(2)}/h
              </span>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 sm:pl-4 flex items-center pointer-events-none text-slate-400 font-bold text-lg sm:text-xl">
                $
              </div>
              <input
                id="biweekly-gross-input"
                type="number"
                min="0"
                step="50"
                value={input.periodGrossSalary || Math.round(input.hourlyRate * regHours * 2)}
                onChange={(e) => handleBiweeklyGrossChange(parseFloat(e.target.value) || 0)}
                className="block w-full pl-8 sm:pl-10 pr-24 sm:pr-28 py-3 sm:py-3.5 text-xl sm:text-2xl font-black text-slate-900 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all shadow-2xs tabular-nums"
                placeholder="2000"
              />
              <div className="absolute inset-y-0 right-0 pr-3.5 sm:pr-4 flex items-center pointer-events-none text-slate-500 font-semibold text-xs sm:text-sm">
                / {lang === 'pt' ? 'quinzena' : lang === 'en' ? '2-weeks' : 'quinzaine'}
              </div>
            </div>
            <p className="text-[11px] text-slate-500">
              💡 {t.derivedHourlyNote} <strong>${(input.hourlyRate || 0).toFixed(2)}/h</strong> ({regHours * 2}h {lang === 'pt' ? 'por quinzena' : lang === 'en' ? 'per pay period' : 'par période'}).
            </p>
          </div>
        )}

        {currentEntryMode === 'annual' && (
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between">
              <label htmlFor="annual-gross-input" className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-blue-600" />
                <span>{t.annualGrossLabel}</span>
              </label>
              <span className="text-xs text-slate-600 font-semibold">
                ≈ ${(input.hourlyRate || 0).toFixed(2)}/h
              </span>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 sm:pl-4 flex items-center pointer-events-none text-slate-400 font-bold text-lg sm:text-xl">
                $
              </div>
              <input
                id="annual-gross-input"
                type="number"
                min="0"
                step="500"
                value={input.annualGrossSalary || Math.round(input.hourlyRate * regHours * 52)}
                onChange={(e) => handleAnnualGrossChange(parseFloat(e.target.value) || 0)}
                className="block w-full pl-8 sm:pl-10 pr-16 sm:pr-20 py-3 sm:py-3.5 text-xl sm:text-2xl font-black text-slate-900 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all shadow-2xs tabular-nums"
                placeholder="52000"
              />
              <div className="absolute inset-y-0 right-0 pr-3.5 sm:pr-4 flex items-center pointer-events-none text-slate-500 font-semibold text-xs sm:text-sm">
                / {lang === 'pt' ? 'ano' : lang === 'en' ? 'year' : 'an'}
              </div>
            </div>
            <p className="text-[11px] text-slate-500">
              💡 {t.derivedHourlyNote} <strong>${(input.hourlyRate || 0).toFixed(2)}/h</strong> ({regHours}h/semana · 52 semanas).
            </p>
          </div>
        )}
      </div>

      {/* 4. Hours per Week Input (Clean, single numerical input without redundant chips) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="regular-hours-input" className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>{t.regularHoursLabel}</span>
          </label>
          <span className="text-xs text-slate-500 font-medium">
            {regHours * 2}h {lang === 'pt' ? 'a cada 2 semanas' : lang === 'en' ? 'per 2 weeks' : 'aux 2 semaines'}
          </span>
        </div>

        <div className="relative">
          <input
            id="regular-hours-input"
            type="number"
            min="1"
            max="84"
            step="0.5"
            value={input.regularHoursPerWeek}
            onChange={(e) => handleRegularHoursChange(parseFloat(e.target.value) || 0)}
            className="block w-full pl-4 pr-32 sm:pr-36 py-3 text-lg sm:text-xl font-bold text-slate-900 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all shadow-2xs tabular-nums"
          />
          <div className="absolute inset-y-0 right-0 pr-3.5 sm:pr-4 flex items-center pointer-events-none text-slate-500 font-semibold text-xs sm:text-sm">
            {lang === 'pt' ? 'horas / semana' : lang === 'en' ? 'hours / week' : 'heures / semaine'}
          </div>
        </div>
        <p className="text-[11px] text-slate-500">
          {lang === 'pt'
            ? 'Carga horária comum: 40h (tempo integral padrão), 37.5h ou 35h/semana'
            : lang === 'en'
            ? 'Standard schedules: 40h (full-time standard), 37.5h or 35h/week'
            : 'Horaire standard : 40h (temps plein standard), 37.5h ou 35h/semaine'}
        </p>
      </div>

      {/* 5. Calculation Detail Level & Real Leclerc Paystub Example */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {lang === 'pt' ? 'Nível de Detalhe' : lang === 'en' ? 'Detail Level' : 'Niveau de détail'}
          </label>
        </div>

        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl border border-slate-200/80 gap-1">
          <button
            type="button"
            onClick={() => handleModeChange('simple')}
            className={`py-2 px-3 text-xs font-bold rounded-lg transition-all text-center cursor-pointer ${
              input.mode === 'simple'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.modeSimple}
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('advanced')}
            className={`py-2 px-3 text-xs font-bold rounded-lg transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
              input.mode === 'advanced'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.modeAdvanced}</span>
          </button>
        </div>

        {/* 1-Click Real Leclerc Industrial Paystub Example */}
        <button
          type="button"
          onClick={onLoadLeclercExample}
          className="w-full py-2 px-3 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs"
        >
          <Factory className="w-4 h-4 text-blue-600" />
          <span>{t.loadExampleBtn}</span>
        </button>
      </div>

      {/* 6. Overtime Section (Optional Collapsible) */}
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
        <button
          type="button"
          onClick={() => setShowOvertime(!showOvertime)}
          className="w-full px-4 py-2.5 text-left flex items-center justify-between text-xs font-bold text-slate-800 hover:bg-slate-100/70 transition-colors cursor-pointer"
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
          <div className="p-4 pt-1 space-y-3 border-t border-slate-200/60 bg-white">
            <p className="text-[11px] text-slate-500">
              {t.overtimeSubtitle}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
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
                    className="block w-full px-3 py-2 text-sm font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600"
                    placeholder="0"
                  />
                  <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400 text-xs">
                    h/sem
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
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
                    className="block w-full px-3 py-2 text-sm font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600"
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

      {/* 7. Advanced Benefits & Deductions Section */}
      {input.mode === 'advanced' && (
        <div className="border border-blue-200 rounded-xl overflow-hidden bg-blue-50/20">
          <button
            type="button"
            onClick={() => setShowAdvancedBenefits(!showAdvancedBenefits)}
            className="w-full px-4 py-2.5 text-left flex items-center justify-between text-xs font-bold text-blue-900 bg-blue-50/60 hover:bg-blue-100/60 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <ShieldPlus className="w-4 h-4 text-blue-600" />
              <span>{t.advancedSectionTitle}</span>
            </div>
            {showAdvancedBenefits ? <ChevronUp className="w-4 h-4 text-blue-600" /> : <ChevronDown className="w-4 h-4 text-blue-600" />}
          </button>

          {showAdvancedBenefits && (
            <div className="p-4 pt-2 space-y-4 bg-white border-t border-blue-100">
              <p className="text-[11px] text-slate-500">
                {t.advancedSectionSubtitle}
              </p>

              {/* Prime de Quart / Adicional de Turno */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs sm:text-sm font-bold text-slate-800">
                    {t.shiftPremiumLabel}
                  </label>
                  <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => onChange({ ...input, shiftPremiumType: 'hourly' })}
                      className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                        input.shiftPremiumType === 'hourly' ? 'bg-white text-blue-700 shadow-2xs font-bold' : 'text-slate-600'
                      }`}
                    >
                      $/h
                    </button>
                    <button
                      type="button"
                      onClick={() => onChange({ ...input, shiftPremiumType: 'fixed' })}
                      className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                        input.shiftPremiumType === 'fixed' ? 'bg-white text-blue-700 shadow-2xs font-bold' : 'text-slate-600'
                      }`}
                    >
                      $ {lang === 'pt' ? 'fixo' : lang === 'en' ? 'fixed' : 'fixe'}
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
                    className="w-full pl-8 pr-3.5 py-2.5 text-sm sm:text-base font-semibold text-slate-900 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    placeholder="ex: 3.50 $/h ou 252.08 $ fixe"
                  />
                </div>
              </div>

              {/* Assurance Médicale (Part Employé) */}
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-bold text-slate-800 block">
                  {t.groupHealthInsLabel} ($ / quinzena)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold text-sm">$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={input.healthInsuranceEmployee || ''}
                    onChange={(e) => onChange({ ...input, healthInsuranceEmployee: parseFloat(e.target.value) || 0 })}
                    className="w-full pl-8 pr-3.5 py-2.5 text-sm sm:text-base font-semibold text-slate-900 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    placeholder="74.28"
                  />
                </div>
              </div>

              {/* Assurance Vie & Accident (Part Employé) */}
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-bold text-slate-800 block">
                  {t.lifeAccidentInsLabel} ($ / quinzena)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold text-sm">$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={input.lifeAndDisabilityInsuranceEmployee || ''}
                    onChange={(e) => onChange({ ...input, lifeAndDisabilityInsuranceEmployee: parseFloat(e.target.value) || 0 })}
                    className="w-full pl-8 pr-3.5 py-2.5 text-sm sm:text-base font-semibold text-slate-900 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
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
                    className="w-full pl-8 pr-3.5 py-2.5 text-sm sm:text-base font-semibold text-slate-900 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
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
                  {t.cafeteriaLabel} ($ / quinzena)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold text-sm">$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={input.otherDeductionsPerPay || ''}
                    onChange={(e) => onChange({ ...input, otherDeductionsPerPay: parseFloat(e.target.value) || 0 })}
                    className="w-full pl-8 pr-3.5 py-2.5 text-sm sm:text-base font-semibold text-slate-900 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    placeholder="9.00"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
