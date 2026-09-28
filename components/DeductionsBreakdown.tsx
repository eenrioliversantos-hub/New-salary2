'use client';

import React, { useState, useSyncExternalStore } from 'react';
import { CalculationResult, formatCurrency } from '@/lib/tax-engine';
import { Language, translations } from '@/lib/i18n';
import { EXPLANATIONS, getTailoredBreakdown } from '@/lib/calculation-explanations';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Sector,
} from 'recharts';
import {
  ChevronDown,
  ChevronUp,
  FileText,
  Landmark,
  ShieldCheck,
  HeartHandshake,
  Briefcase,
  PieChart as PieChartIcon,
  Calculator,
  Building2,
  Sparkles,
  Info,
  CheckCircle2,
} from 'lucide-react';

interface DeductionsBreakdownProps {
  calc: CalculationResult;
  lang: Language;
}

interface ChartSliceData {
  name: string;
  category: 'net' | 'taxes' | 'social' | 'insurance' | 'workplace';
  value: number;
  color: string;
  percentageOfGross: number;
}

const emptySubscribe = () => () => {};

export const DeductionsBreakdown: React.FC<DeductionsBreakdownProps> = ({ calc, lang }) => {
  const t = translations[lang];
  const [isOpen, setIsOpen] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
  // Track which deduction card in the list is currently expanded for deep-dive inspection
  const [expandedCode, setExpandedCode] = useState<string | null>(null);

  // Clean React 19 client mount detection
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const { selectedPeriod, deductionsList } = calc;
  const locale = lang === 'pt' ? 'pt-BR' : lang === 'en' ? 'en-CA' : 'fr-CA';
  const gross = Math.max(0.01, selectedPeriod.gross);

  // Grouped amounts for quick comparison
  const totalIncomeTaxes = selectedPeriod.provincialTax + selectedPeriod.federalTax;
  const totalSocialContributions = selectedPeriod.rrq + selectedPeriod.rqap + selectedPeriod.ae;
  const totalInsuranceAndBenefits =
    selectedPeriod.groupInsurance + selectedPeriod.retirementAndUnion + selectedPeriod.otherDeductions;

  // Donut slices
  const chartData: ChartSliceData[] = [
    {
      name: lang === 'pt' ? 'Salário Líquido' : lang === 'en' ? 'Net Take-Home' : 'Salaire Net en poche',
      category: 'net',
      value: selectedPeriod.net,
      color: '#10b981', // Emerald
      percentageOfGross: (selectedPeriod.net / gross) * 100,
    },
    {
      name: 'Revenu Québec (Provincial)',
      category: 'taxes',
      value: selectedPeriod.provincialTax,
      color: '#2563eb', // Blue
      percentageOfGross: (selectedPeriod.provincialTax / gross) * 100,
    },
    {
      name: 'CRA / ARC (Fédéral)',
      category: 'taxes',
      value: selectedPeriod.federalTax,
      color: '#0284c7', // Sky
      percentageOfGross: (selectedPeriod.federalTax / gross) * 100,
    },
    {
      name: 'RRQ (Régime des rentes)',
      category: 'social',
      value: selectedPeriod.rrq,
      color: '#4f46e5', // Indigo
      percentageOfGross: (selectedPeriod.rrq / gross) * 100,
    },
    {
      name: 'AE (Assurance-Emploi)',
      category: 'social',
      value: selectedPeriod.ae,
      color: '#d97706', // Amber
      percentageOfGross: (selectedPeriod.ae / gross) * 100,
    },
    {
      name: 'RQAP (Parental)',
      category: 'social',
      value: selectedPeriod.rqap,
      color: '#9333ea', // Purple
      percentageOfGross: (selectedPeriod.rqap / gross) * 100,
    },
  ];

  if (selectedPeriod.groupInsurance > 0) {
    chartData.push({
      name: lang === 'pt' ? 'Seguro Coletivo (Médico/Vida)' : lang === 'en' ? 'Group Insurance' : 'Assurance collective',
      category: 'insurance',
      value: selectedPeriod.groupInsurance,
      color: '#db2777', // Pink
      percentageOfGross: (selectedPeriod.groupInsurance / gross) * 100,
    });
  }

  if (selectedPeriod.otherDeductions + selectedPeriod.retirementAndUnion > 0) {
    chartData.push({
      name: lang === 'pt' ? 'Cafeteria / Outros' : lang === 'en' ? 'Cafeteria & Other' : 'Cafétéria & Autres',
      category: 'workplace',
      value: selectedPeriod.otherDeductions + selectedPeriod.retirementAndUnion,
      color: '#64748b', // Slate
      percentageOfGross: ((selectedPeriod.otherDeductions + selectedPeriod.retirementAndUnion) / gross) * 100,
    });
  }

  // Filter out any zero value items so donut renders cleanly
  const activeSlices = chartData.filter((item) => item.value > 0);

  const getIcon = (code: string) => {
    switch (code) {
      case 'QC_TAX':
        return <Landmark className="w-4 h-4 text-blue-600" />;
      case 'FED_TAX':
        return <Landmark className="w-4 h-4 text-sky-600" />;
      case 'RRQ':
        return <ShieldCheck className="w-4 h-4 text-indigo-600" />;
      case 'RQAP':
        return <HeartHandshake className="w-4 h-4 text-purple-600" />;
      case 'AE':
        return <Briefcase className="w-4 h-4 text-amber-600" />;
      case 'ASSUR_COLL':
        return <ShieldCheck className="w-4 h-4 text-pink-600" />;
      case 'REER_SYND':
        return <Landmark className="w-4 h-4 text-emerald-600" />;
      case 'DIVERS':
        return <FileText className="w-4 h-4 text-zinc-600" />;
      default:
        return <FileText className="w-4 h-4 text-slate-600" />;
    }
  };

  const handleToggleCode = (code: string) => {
    setExpandedCode((prev) => (prev === code ? null : code));
  };

  // Custom Recharts Active Shape for smooth interaction
  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius - 2}
          outerRadius={outerRadius + 4}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden transition-all">
      {/* Accordion Trigger Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 sm:p-6 text-left flex items-center justify-between hover:bg-slate-50/70 transition-colors cursor-pointer"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>{t.deductionsTitle}</span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                <PieChartIcon className="w-3 h-3" />
                Gráfico Donut
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {t.deductionsSubtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs text-slate-500">Total retenu ({selectedPeriod.label})</div>
            <div className="text-sm font-bold text-rose-600">
              - {formatCurrency(selectedPeriod.totalDeductions, locale)}
            </div>
          </div>
          <div className="p-1 rounded-lg bg-slate-100 text-slate-600">
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </button>

      {/* Collapsible Content */}
      {isOpen && (
        <div className="px-3.5 pb-6 sm:px-6 pt-1 border-t border-slate-100 space-y-6">
          {/* Quick macro-category summary badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3">
            {/* Net */}
            <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200/70">
              <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block">
                {lang === 'pt' ? 'Líquido no Bolso' : lang === 'en' ? 'Net Take-Home' : 'Net en poche'}
              </span>
              <span className="text-sm sm:text-base font-extrabold text-emerald-700 tabular-nums">
                {formatCurrency(selectedPeriod.net, locale)}
              </span>
              <span className="text-[10px] text-emerald-600 block">
                {((selectedPeriod.net / gross) * 100).toFixed(1)}% do bruto
              </span>
            </div>

            {/* Impostos (Fed + Prov) */}
            <div className="p-2.5 rounded-xl bg-blue-50/80 border border-blue-200/70">
              <span className="text-[10px] uppercase font-bold text-blue-800 tracking-wider block">
                {lang === 'pt' ? 'Impostos (QC + Féd)' : lang === 'en' ? 'Income Taxes' : 'Impôts (QC + Féd)'}
              </span>
              <span className="text-sm sm:text-base font-extrabold text-blue-700 tabular-nums">
                {formatCurrency(totalIncomeTaxes, locale)}
              </span>
              <span className="text-[10px] text-blue-600 block">
                {((totalIncomeTaxes / gross) * 100).toFixed(1)}% do bruto
              </span>
            </div>

            {/* Contribuições Sociais (RRQ + RQAP + AE) */}
            <div className="p-2.5 rounded-xl bg-indigo-50/80 border border-indigo-200/70">
              <span className="text-[10px] uppercase font-bold text-indigo-800 tracking-wider block">
                {lang === 'pt' ? 'Contribuições (RRQ/AE/RQAP)' : lang === 'en' ? 'Social Programs' : 'Cotisations (RRQ/AE)'}
              </span>
              <span className="text-sm sm:text-base font-extrabold text-indigo-700 tabular-nums">
                {formatCurrency(totalSocialContributions, locale)}
              </span>
              <span className="text-[10px] text-indigo-600 block">
                {((totalSocialContributions / gross) * 100).toFixed(1)}% do bruto
              </span>
            </div>

            {/* Assurances & Autres */}
            <div className="p-2.5 rounded-xl bg-pink-50/80 border border-pink-200/70">
              <span className="text-[10px] uppercase font-bold text-pink-800 tracking-wider block">
                {lang === 'pt' ? 'Benefícios & Empresa' : lang === 'en' ? 'Benefits & Other' : 'Assurances & Divers'}
              </span>
              <span className="text-sm sm:text-base font-extrabold text-pink-700 tabular-nums">
                {formatCurrency(totalInsuranceAndBenefits, locale)}
              </span>
              <span className="text-[10px] text-pink-600 block">
                {((totalInsuranceAndBenefits / gross) * 100).toFixed(1)}% do bruto
              </span>
            </div>
          </div>

          {/* D3 / Recharts Donut Chart Section */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/80 border border-slate-200">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <PieChartIcon className="w-4 h-4 text-blue-600" />
                  <span>
                    {lang === 'pt'
                      ? 'Gráfico de Rosca: Proporção no Salário Bruto'
                      : lang === 'en'
                      ? 'Donut Chart: Gross Pay Allocation'
                      : 'Graphique en anneau : Répartition du salaire brut'}
                  </span>
                </h4>
                <p className="text-[11px] text-slate-500">
                  {lang === 'pt'
                    ? 'Visualize a fatia exata de impostos vs. contribuições sociais e salário líquido'
                    : lang === 'en'
                    ? 'Exact proportion between taxes, social dues, and net pocket cash'
                    : 'Proportion exacte entre impôts, cotisations publiques et salaire net'}
                </p>
              </div>

              <div className="text-xs font-semibold text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                Brut: <span className="font-bold text-slate-900 tabular-nums">{formatCurrency(selectedPeriod.gross, locale)}</span>
              </div>
            </div>

            {/* Donut Chart Container */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4 min-w-0 w-full overflow-hidden">
              {/* The Recharts Donut */}
              <div className="w-full lg:w-1/2 h-[240px] sm:h-[270px] relative flex items-center justify-center min-w-0">
                {isMounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload as ChartSliceData;
                            return (
                              <div className="bg-slate-900/95 text-white p-2.5 rounded-xl shadow-xl text-xs border border-slate-700 backdrop-blur-xs">
                                <div className="font-bold flex items-center gap-1.5 mb-1">
                                  <span
                                    className="w-2.5 h-2.5 rounded-full inline-block"
                                    style={{ backgroundColor: data.color }}
                                  />
                                  <span>{data.name}</span>
                                </div>
                                <div className="text-slate-300">
                                  Montant :{' '}
                                  <span className="font-mono font-bold text-white">
                                    {formatCurrency(data.value, locale)}
                                  </span>
                                </div>
                                <div className="text-emerald-400 font-medium mt-0.5">
                                  {data.percentageOfGross.toFixed(1)}% du salaire brut
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Pie
                        data={activeSlices}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={88}
                        paddingAngle={2.5}
                        dataKey="value"
                        {...({
                          activeIndex: activeIndex ?? undefined,
                          activeShape: renderActiveShape,
                        } as any)}
                        onMouseEnter={(_, index) => setActiveIndex(index)}
                        onMouseLeave={() => setActiveIndex(null)}
                      >
                        {activeSlices.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                            stroke="rgba(255,255,255,0.7)"
                            strokeWidth={1.5}
                            className="cursor-pointer transition-all duration-300"
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-xs text-slate-400">
                    Chargement du graphique...
                  </div>
                )}

                {/* Donut Center Display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  {activeIndex !== null && activeSlices[activeIndex] ? (
                    <>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold max-w-[110px] truncate text-center">
                        {activeSlices[activeIndex].name}
                      </span>
                      <span className="text-base sm:text-lg font-extrabold text-slate-900 tabular-nums">
                        {formatCurrency(activeSlices[activeIndex].value, locale)}
                      </span>
                      <span className="text-[10px] font-bold text-blue-600">
                        {activeSlices[activeIndex].percentageOfGross.toFixed(1)}%
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                        {lang === 'pt' ? 'Retenção Total' : lang === 'en' ? 'Total Deductions' : 'Total Retenu'}
                      </span>
                      <span className="text-base sm:text-lg font-extrabold text-rose-600 tabular-nums">
                        - {formatCurrency(selectedPeriod.totalDeductions, locale)}
                      </span>
                      <span className="text-[10px] font-bold text-slate-600">
                        {selectedPeriod.effectiveTaxRate.toFixed(1)}% do bruto
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Interactive Legend List */}
              <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                {activeSlices.map((item, idx) => (
                  <div
                    key={item.name}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onMouseLeave={() => setActiveIndex(null)}
                    className={`flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer border ${
                      activeIndex === idx
                        ? 'bg-white border-blue-400 shadow-xs'
                        : 'bg-white/60 border-slate-200/80 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-xs font-semibold text-slate-800 truncate">
                        {item.name}
                      </span>
                    </div>

                    <div className="text-right shrink-0 ml-2">
                      <span className="text-xs font-bold text-slate-900 block tabular-nums">
                        {formatCurrency(item.value, locale)}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {item.percentageOfGross.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Detailed List of Statutory & Non-Statutory Deductions - INTERATIVO AO CLICAR */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-rose-600" />
                <span>
                  {lang === 'pt'
                    ? 'Lista de Deduções na Fonte (Toque em qualquer uma para ver o cálculo):'
                    : lang === 'en'
                    ? 'Payroll Deductions List (Tap any item to see calculation formula):'
                    : 'Détail des retenues (Touchez un élément pour voir le calcul):'}
                </span>
              </h4>
              <span className="text-[10px] text-slate-500 hidden sm:inline">
                {lang === 'pt' ? 'Fórmula, lei e contribuição do empregador' : 'Formula, law & employer share'}
              </span>
            </div>

            {deductionsList.map((item) => {
              const isExpanded = expandedCode === item.code;
              const detail = EXPLANATIONS[item.code];
              const tailored = getTailoredBreakdown(item.code, calc, selectedPeriod, lang);

              return (
                <div
                  key={item.code}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isExpanded
                      ? 'border-blue-500 bg-white ring-2 ring-blue-500/20 shadow-md'
                      : 'border-slate-200/90 bg-slate-50/70 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  {/* Clickable Header Button - Mobile First touch target */}
                  <button
                    type="button"
                    onClick={() => handleToggleCode(item.code)}
                    className="w-full p-3.5 sm:p-4 text-left flex items-start justify-between gap-3 cursor-pointer active:scale-[0.99] transition-transform"
                    aria-expanded={isExpanded}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 p-2 bg-white rounded-xl border border-slate-200 shadow-2xs shrink-0">
                        {getIcon(item.code)}
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-slate-900 flex flex-wrap items-center gap-1.5 sm:gap-2">
                          <span>{item.name}</span>
                          <span className="text-[10px] font-mono uppercase bg-slate-200/80 text-slate-700 px-1.5 py-0.5 rounded font-bold">
                            {item.code}
                          </span>
                        </div>
                        <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 line-clamp-2">
                          {item.description}
                        </p>
                        <div className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] text-blue-700 font-semibold mt-1">
                          <span>Taux légal : {item.rateDescription}</span>
                          <span className="text-slate-400">·</span>
                          <span className="text-blue-600 underline decoration-blue-300">
                            {isExpanded
                              ? lang === 'pt' ? 'Ocultar cálculo ▲' : 'Hide calculation ▲'
                              : lang === 'pt' ? 'Ver fórmula & origem ▼' : 'See formula & origin ▼'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Amounts and Chevron */}
                    <div className="text-right shrink-0 flex flex-col items-end justify-between">
                      <div className="text-sm sm:text-base font-extrabold text-rose-600 tabular-nums">
                        - {formatCurrency(item.period, locale)}
                        <span className="text-[10px] font-normal text-slate-400 block">/ paie</span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-medium mt-0.5 tabular-nums">
                        {formatCurrency(item.annual, locale)} / an
                      </div>
                      <div className="mt-1 text-slate-400">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-blue-600" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Expanded Interactive Deep Dive Panel */}
                  {isExpanded && detail && (
                    <div className="px-4 pb-4 pt-1 border-t border-slate-100 bg-slate-50/50 space-y-3 animate-fadeIn">
                      {/* Subtitle / Plain language description */}
                      <div className="text-xs text-slate-600 pt-2 leading-relaxed">
                        {detail.description[lang]}
                      </div>

                      {/* Origin & Legal Basis */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                          <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 mb-0.5">
                            <Building2 className="w-3 h-3 text-blue-600" />
                            <span>{lang === 'pt' ? 'Órgão / Origem' : 'Agency / Origin'}</span>
                          </span>
                          <span className="text-xs font-semibold text-slate-800">
                            {detail.origin[lang]}
                          </span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                          <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 mb-0.5">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            <span>{lang === 'pt' ? 'Base Legal' : 'Legal Basis'}</span>
                          </span>
                          <span className="text-xs font-semibold text-slate-800">
                            {detail.legalBasis[lang]}
                          </span>
                        </div>
                      </div>

                      {/* Exact Math Formula */}
                      <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-xs space-y-1">
                        <span className="text-[10px] uppercase font-bold text-blue-800 tracking-wider flex items-center gap-1">
                          <Calculator className="w-3 h-3 text-blue-700" />
                          <span>{lang === 'pt' ? 'Fórmula de Cálculo Oficial :' : 'Official Calculation Formula:'}</span>
                        </span>
                        <div className="font-mono text-xs font-bold text-blue-950 bg-white p-2 rounded-lg border border-blue-100 overflow-x-auto">
                          {detail.formula[lang]}
                        </div>
                      </div>

                      {/* Step-by-Step with the user's actual salary */}
                      {tailored.length > 0 && (
                        <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1.5">
                          <span className="text-[11px] font-bold text-slate-900 block">
                            {lang === 'pt' ? 'Cálculo aplicado ao seu salário nesta folha :' : 'Calculation applied to your current paycheck:'}
                          </span>
                          <div className="space-y-1">
                            {tailored.map((step, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between text-xs py-1 border-b border-slate-100 last:border-0"
                              >
                                <div>
                                  <span className="text-slate-700 font-medium">{step.label}</span>
                                  {step.note && (
                                    <span className="text-[10px] text-slate-400 block">{step.note}</span>
                                  )}
                                </div>
                                <span className="font-mono font-bold text-slate-900 tabular-nums">
                                  {step.value}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Employer Share Note (e.g. RRQ match 100%, AE 1.4x) */}
                      {detail.employerShare && (
                        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-medium">
                          {detail.employerShare[lang]}
                        </div>
                      )}

                      {/* Exemptions and Credits */}
                      {detail.exemptionsAndCredits && (
                        <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                          <span className="font-bold">✨ {lang === 'pt' ? 'Isenções & Créditos :' : 'Credits & Exemptions :'} </span>
                          <span>{detail.exemptionsAndCredits[lang]}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quebec Specific Summary Footer Box */}
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/70 text-xs text-blue-900">
            <div className="font-semibold mb-1 flex items-center gap-1.5">
              <span>⚜️</span>
              <span>Spécificités fiscales du Québec (Modèle québécois)</span>
            </div>
            <p className="text-blue-800 leading-relaxed text-[11px] sm:text-xs">
              {t.quebecSpecificNote} Contrairement aux autres provinces canadiennes, le Québec gère son propre régime d&apos;assurance parentale (RQAP) et son régime des rentes (RRQ), ce qui réduit la cotisation fédérale d&apos;Assurance-Emploi à 1,32 % et accorde l&apos;abattement fédéral remboursable de 16,5 %.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
