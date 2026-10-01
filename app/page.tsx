'use client';

import React, { useState, useMemo, useEffect, useSyncExternalStore } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  TaxInput,
  calculateQuebecPay,
  formatCurrency,
  PayFrequency,
  SalaryEntryMode,
} from '@/lib/tax-engine';
import { Language, translations } from '@/lib/i18n';
import { Header } from '@/components/Header';
import { SalaryInputs } from '@/components/SalaryInputs';
import { WorkspaceQuickSummary } from '@/components/WorkspaceQuickSummary';
import { MainResultCard } from '@/components/MainResultCard';
import { CascadeTable } from '@/components/CascadeTable';
import { DeductionsBreakdown } from '@/components/DeductionsBreakdown';
import { QuebecBenefitsTools } from '@/components/QuebecBenefitsTools';
import { RaiseSimulator } from '@/components/RaiseSimulator';
import { PrecisionCard } from '@/components/PrecisionCard';
import { FaqSection } from '@/components/FaqSection';
import { Footer } from '@/components/Footer';
import { ToolboxGrid, ToolId } from '@/components/ToolboxGrid';
import { SalaryConverter } from '@/components/SalaryConverter';
import { OvertimeCalculator } from '@/components/OvertimeCalculator';
import { JobOfferComparator } from '@/components/JobOfferComparator';
import { ResumeBuilder } from '@/components/ResumeBuilder';
import { InterviewSimulator } from '@/components/InterviewSimulator';
import { TechnicalTestsSimulator } from '@/components/TechnicalTestsSimulator';
import { BlogSection } from '@/components/BlogSection';
import { CommercialShowcase } from '@/components/CommercialShowcase';
import { SiteCompliancePages } from '@/components/SiteCompliancePages';
import { EbookStorePage } from '@/components/EbookStorePage';
import { ProPlansPage } from '@/components/ProPlansPage';
import { ScenariosPage } from '@/components/ScenariosPage';
import { PartnersPage } from '@/components/PartnersPage';
import { NewsletterBox } from '@/components/NewsletterBox';
import { AdminPanel } from '@/components/AdminPanel';
import { AdBanner } from '@/components/AdBanner';
import { MonetizationHubPage } from '@/components/MonetizationHubPage';
import { InterprovincialSalaryComparator } from '@/components/InterprovincialSalaryComparator';
import { ResourceHubSection } from '@/components/ResourceHubSection';
import { GuidesAndResources } from '@/components/GuidesAndResources';
import { B2BTab } from '@/components/CommercialShowcase';
import { adminStore } from '@/lib/admin-store';
import {
  Calculator,
  Repeat,
  TrendingUp,
  Timer,
  Scale,
  Palmtree,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Share2,
  Printer,
  CheckCircle2,
  FileText,
  Mic,
  FileCheck2,
  Crown,
} from 'lucide-react';

export default function HomePage() {
  const [lang, setLang] = useState<Language>('pt'); // Default Portuguese as requested
  const [activeTool, setActiveTool] = useState<ToolId>('net-calc');
  const [netCalcView, setNetCalcView] = useState<'workspace' | 'results'>('workspace');
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedEbookAssetId, setSelectedEbookAssetId] = useState<string | undefined>(undefined);
  const [selectedBlogArticleId, setSelectedBlogArticleId] = useState<string | null>(null);
  const [b2bTab, setB2bTab] = useState<B2BTab>('catalog');

  const handleOpenEbookModal = (assetId?: string) => {
    if (assetId) setSelectedEbookAssetId(assetId);
    handleSelectTool('ebook-store');
  };

  // Monetization & Pro features (reactive & SSR hydration safe)
  const isPro = useSyncExternalStore(
    (cb) => adminStore.subscribe(cb),
    () => adminStore.isProUser(),
    () => false
  );
  const [_monetizationTrigger, setMonetizationTrigger] = useState<string | undefined>(undefined);

  const handleUnlockPro = () => {
    adminStore.setProUser(true);
    setToastMessage('🎉 Pass PaieNet Carrière Pro débloqué !');
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleOpenProModal = (triggerMsg?: string) => {
    if (triggerMsg) setMonetizationTrigger(triggerMsg);
    handleSelectTool('pro-plans');
  };

  // Default parameters for standard Quebec hourly worker
  const [input, setInput] = useState<TaxInput>({
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

  // Calculation memoized
  const calculation = useMemo(() => {
    return calculateQuebecPay(input);
  }, [input]);

  const t = translations[lang];
  const locale = lang === 'pt' ? 'pt-BR' : lang === 'en' ? 'en-CA' : 'fr-CA';

  const handleEntryModeChange = (mode: SalaryEntryMode) => {
    const regHours = Math.max(0.5, input.regularHoursPerWeek || 40);
    const updated = { ...input, entryMode: mode };
    if (mode === 'annual') {
      const annual = input.annualGrossSalary || input.hourlyRate * regHours * 52;
      updated.annualGrossSalary = Math.round(annual);
      updated.hourlyRate = Math.round((annual / (regHours * 52)) * 100) / 100;
    } else if (mode === 'biweekly') {
      const biweekly = input.periodGrossSalary || input.hourlyRate * regHours * 2;
      updated.periodGrossSalary = Math.round(biweekly);
      updated.hourlyRate = Math.round((biweekly / (regHours * 2)) * 100) / 100;
    }
    setInput(updated);
  };

  const handleFrequencyChange = (freq: PayFrequency) => {
    setInput((prev) => ({ ...prev, frequency: freq }));
  };

  // 1-Click Loader for the real paystub from Biscuits Leclerc
  const handleLoadLeclercExample = () => {
    setInput({
      entryMode: 'hourly',
      annualGrossSalary: 64800,
      periodGrossSalary: 2520.8,
      hourlyRate: 31.51,
      regularHoursPerWeek: 36, // 72 hours per 2-week pay period (36h/week)
      overtime15HoursPerWeek: 0,
      overtime20HoursPerWeek: 0,
      frequency: 'biweekly',
      mode: 'advanced',
      shiftPremiumType: 'fixed',
      shiftPremiumAmount: 252.08, // Prime 36/40
      healthInsuranceEmployee: 74.28, // Assurance médicale
      lifeAndDisabilityInsuranceEmployee: 16.3, // Ass. vie base 13.68 + accident 1.06 + charge 1.56
      dentalInsuranceEmployee: 0,
      employerTaxableBenefits: 56.13, // Avantages imposables
      groupRrspType: 'percent',
      groupRrspValue: 0,
      unionDuesType: 'percent',
      unionDuesValue: 0,
      otherDeductionsPerPay: 9.0, // 3 repas cafétéria à $3
    });

    setActiveTool('net-calc');
    setNetCalcView('workspace');
    setToastMessage(t.loadedExampleSuccess);
    setTimeout(() => setToastMessage(null), 3500);

    adminStore.logEvent({
      id: `evt-${Date.now()}`,
      timestamp: 'Agora mesmo',
      type: 'salary_calc',
      summary: 'Carregamento do Holerite Real (Biscuits Leclerc - $31.51/h)',
      location: 'Québec City, QC',
      details: 'Contracheque industrial com adicionais e retenções exatas',
    });
  };

  const handleSelectTool = (tool: ToolId) => {
    if (tool === 'factory-stub') {
      handleLoadLeclercExample();
      return;
    }
    setActiveTool(tool);
    if (tool === 'net-calc') {
      setNetCalcView('workspace');
    }
    if (typeof window !== 'undefined') {
      window.location.hash = tool;
    }
    if (tool !== 'admin') {
      adminStore.logEvent({
        id: `evt-${Date.now()}`,
        timestamp: 'Agora mesmo',
        type: 'tool_view',
        summary: `Navegação para a ferramenta: ${tool}`,
        location: 'Québec, Canada',
      });
    }
  };

  // Sync hash on initial load & popstate/hashchange
  useEffect(() => {
    const handleHash = () => {
      if (typeof window !== 'undefined' && window.location.hash) {
        const hash = window.location.hash.replace('#', '') as ToolId;
        const validTools: ToolId[] = [
          'net-calc',
          'converter',
          'raise',
          'overtime',
          'compare-jobs',
          'canada-provinces',
          'resources',
          'guides',
          'vacation-holidays',
          'rrsp-savings',
          'factory-stub',
          'resume-builder',
          'interview-simulator',
          'tech-tests',
          'blog',
          'media-kit',
          'monetization',
          'sitemap',
          'admin',
          'ebook-store',
          'pro-plans',
          'scenarios',
          'partners',
        ];
        if (validTools.includes(hash)) {
          if (hash === 'factory-stub') {
            handleLoadLeclercExample();
          } else {
            setActiveTool(hash);
          }
        }
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleApplyRaise = (newRate: number) => {
    const regHours = Math.max(0.5, input.regularHoursPerWeek || 40);
    setInput((prev) => ({
      ...prev,
      hourlyRate: newRate,
      annualGrossSalary: Math.round(newRate * regHours * 52),
      periodGrossSalary: Math.round(newRate * regHours * 2 * 100) / 100,
    }));
    setToastMessage(`Salário base atualizado para $${newRate.toFixed(2)}/h!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopySummary = () => {
    const text = `📊 PaieNet Québec - Resumo de Salário
----------------------------------
Taxa Horária Base: $${input.hourlyRate.toFixed(2)}/h (${calculation.totalHoursPerWeek}h/sem)
${input.mode === 'advanced' && input.shiftPremiumAmount > 0 ? `Adicional de Turno / Prime: $${input.shiftPremiumAmount.toFixed(2)}\n` : ''}Fréquence: ${calculation.selectedPeriod.label}
Bruto: ${formatCurrency(calculation.selectedPeriod.gross, locale)}
Retenções Totais: ${formatCurrency(calculation.selectedPeriod.totalDeductions, locale)} (${calculation.selectedPeriod.effectiveTaxRate}%)
👉 LÍQUIDO NO BOLSO: ${formatCurrency(calculation.selectedPeriod.net, locale)}
Líquido real por hora: ${formatCurrency(calculation.effectiveHourlyRateNet, locale)}/h
Grau de Precisão: ${calculation.precision.score.toFixed(0)}% (${calculation.precision.label})
----------------------------------
Calculado no PaieNet Québec (Barèmes 2025/2026)`;

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Dedicated Admin & Monetization Backoffice View
  if (activeTool === 'admin') {
    return (
      <AdminPanel
        onBackToPortal={() => {
          setActiveTool('net-calc');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateToBlogArticle={(articleId) => {
          setSelectedBlogArticleId(articleId);
          setActiveTool('blog');
          window.scrollTo({ top: 120, behavior: 'smooth' });
        }}
        lang={lang}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans selection:bg-primary/20 selection:text-foreground pb-20 sm:pb-12 overflow-x-clip w-full max-w-full">
      {/* 1. Header with Centralized Tools Menu, Language and Pro Pass */}
      <Header
        lang={lang}
        onLanguageChange={setLang}
        onCopySummary={handleCopySummary}
        copied={copied}
        activeTool={activeTool}
        onSelectTool={handleSelectTool}
        hourlyRate={input.hourlyRate}
        netAmount={calculation.selectedPeriod.net}
        locale={locale}
        onOpenScenarios={() => handleSelectTool('scenarios')}
        frequencyLabel={calculation.selectedPeriod.label}
        totalHoursPerWeek={calculation.totalHoursPerWeek}
        onLoadLeclercExample={handleLoadLeclercExample}
        isPro={isPro}
        onOpenProModal={handleOpenProModal}
        onOpenEbookModal={handleOpenEbookModal}
        onSelectB2bTab={(tab) => setB2bTab(tab)}
      />

      {/* Strategic Top Leaderboard Ad Banner (Mapped to home-top) */}
      <AdBanner
        section="home-top"
        format="top-leaderboard"
        lang={lang}
        onNavigateToMediaKit={() => {
          handleSelectTool('media-kit');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* 2. Main Focused Workspace */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-7 space-y-8">
        {/* Render Active Tool Workspace */}
        <AnimatePresence mode="wait">
          {/* TOOL 1: NET PAY CALCULATOR */}
          {activeTool === 'net-calc' && (
            <motion.div
              key="net-calc-workspace"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="space-y-6"
            >
              {netCalcView === 'workspace' ? (
                /* ESPAÇO DE TRABALHO CLEAN (INPUTS + PREVIEW INSTANTÂNEO) */
                <div className="space-y-6">
                  {/* Clean Page Title Banner */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
                    <div>
                      <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/80 mb-1">
                        <span>⚜️</span>
                        <span>{t.fiscalYearBadge}</span>
                        <span className="text-blue-300">·</span>
                        <span>Revenu Québec & ARC</span>
                      </div>
                      <h1 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
                        <span>{t.title}</span>{' '}<span className="text-blue-600">Québec</span>
                      </h1>
                      <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                        {lang === 'pt'
                          ? 'Preencha sua taxa horária ou salário e veja o valor líquido exato no seu bolso.'
                          : lang === 'en'
                          ? 'Enter your hourly wage or salary to see your exact take-home pay.'
                          : 'Saisissez votre taux horaire pour voir votre salaire net exact dans vos poches.'}
                      </p>
                    </div>

                    <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{lang === 'pt' ? 'Atualização automática' : lang === 'en' ? 'Updates automatically' : 'Mise à jour automatique'}</span>
                    </div>
                  </div>

                  {/* Unified calculator section: inputs first, live preview immediately below */}
                  <section className="bg-white rounded-3xl border border-slate-200 shadow-xs p-3 sm:p-5 lg:p-6 space-y-5" aria-label={lang === 'pt' ? 'Calculadora de salário líquido' : lang === 'en' ? 'Net salary calculator' : 'Calculateur de salaire net'}>
                    <div className="space-y-5">
                      <SalaryInputs
                        input={input}
                        onChange={setInput}
                        onLoadLeclercExample={handleLoadLeclercExample}
                        lang={lang}
                      />

                      <div className="border-t border-slate-100 pt-5">
                        <WorkspaceQuickSummary
                          calc={calculation}
                          lang={lang}
                          onFrequencyChange={handleFrequencyChange}
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => setNetCalcView('results')}
                        className="w-full py-3.5 px-5 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 text-white rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-sm hover:shadow-md transition-all cursor-pointer group active:scale-[0.99]"
                      >
                        <Calculator className="w-5 h-5 text-blue-200 group-hover:scale-105 transition-transform" />
                        <span>
                          {lang === 'pt' ? 'Ver Detalhamento Completo do Salário' : lang === 'en' ? 'View Full Paystub Breakdown' : 'Voir le relevé de paie complet'}
                        </span>
                        <ArrowRight className="w-4 h-4 text-blue-200 group-hover:translate-x-1 transition-transform" />
                      </button>

                      <PrecisionCard
                        precision={calculation.precision}
                        lang={lang}
                        onOpenScenariosModal={() => handleSelectTool('scenarios')}
                      />
                    </div>
                  </section>
                </div>
              ) : (
                /* CONTRACHEQUE COMPLETO & TABELA MÁGICA EM CASCATA */
                <div className="space-y-6">
                  {/* Top Back Navigation Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <button
                      type="button"
                      onClick={() => setNetCalcView('workspace')}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-800 hover:text-blue-700 text-xs sm:text-sm font-bold border border-slate-200 transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>
                        {lang === 'pt'
                          ? '← Voltar à Área de Preenchimento'
                          : lang === 'en'
                          ? '← Back to Input Workspace'
                          : '← Retour à l’espace de saisie'}
                      </span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleCopySummary}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold border border-slate-200 shadow-xs transition-colors cursor-pointer"
                      >
                        <Share2 className="w-4 h-4 text-blue-600" />
                        <span>{copied ? t.copiedSuccess : t.shareCopyBtn}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold border border-slate-200 shadow-xs transition-colors cursor-pointer"
                      >
                        <Printer className="w-4 h-4 text-slate-600" />
                        <span>{t.printBtn}</span>
                      </button>
                    </div>
                  </div>

                  {/* Highlight Result Card */}
                  <MainResultCard
                    calc={calculation}
                    lang={lang}
                    currentFrequency={input.frequency}
                    onFrequencyChange={handleFrequencyChange}
                    currentEntryMode={input.entryMode || 'hourly'}
                    onEntryModeChange={handleEntryModeChange}
                  />

                  {/* Deductions Breakdown */}
                  <DeductionsBreakdown calc={calculation} lang={lang} />

                  {/* Cascade Table across all 6 cycles */}
                  <CascadeTable calc={calculation} lang={lang} />

                  {/* Strategic Results Sponsor Ad Banner (Mapped to salary-results) */}
                  <AdBanner
                    section="salary-results"
                    format="bottom-wide"
                    lang={lang}
                    onNavigateToMediaKit={() => {
                      handleSelectTool('media-kit');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                </div>
              )}
            </motion.div>
          )}

          {/* TOOL 2: SALARY CONVERTER */}
          {activeTool === 'converter' && (
            <motion.div
              key="converter-workspace"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              <SalaryConverter lang={lang} />
            </motion.div>
          )}

          {/* TOOL 3: RAISE SIMULATOR */}
          {activeTool === 'raise' && (
            <motion.div
              key="raise-workspace"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="space-y-6"
            >
              <RaiseSimulator
                input={input}
                lang={lang}
                onApplyRaise={handleApplyRaise}
              />
            </motion.div>
          )}

          {/* TOOL 4: OVERTIME CALCULATOR */}
          {activeTool === 'overtime' && (
            <motion.div
              key="overtime-workspace"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              <OvertimeCalculator lang={lang} />
            </motion.div>
          )}

          {/* TOOL 5: JOB OFFER COMPARATOR */}
          {activeTool === 'compare-jobs' && (
            <motion.div
              key="compare-jobs-workspace"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              <JobOfferComparator lang={lang} />
            </motion.div>
          )}

          {/* TOOL 5.1: INTERPROVINCIAL SALARY & PURCHASING POWER COMPARATOR */}
          {activeTool === 'canada-provinces' && (
            <motion.div
              key="canada-provinces-workspace"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              <InterprovincialSalaryComparator
                lang={lang}
                onSelectTool={handleSelectTool}
                isPro={isPro}
                onOpenProModal={handleOpenProModal}
                onLoadProvinceToMainCalc={(prov, rate, hours) => {
                  setInput((prev) => ({
                    ...prev,
                    province: prov,
                    hourlyRate: rate,
                    regularHoursPerWeek: hours,
                    annualGrossSalary: Math.round(rate * hours * 52),
                    periodGrossSalary: Math.round(rate * hours * 2 * 100) / 100,
                  }));
                  setActiveTool('net-calc');
                  setNetCalcView('workspace');
                  setToastMessage(
                    lang === 'pt'
                      ? `Província alterada para ${prov} ($${rate.toFixed(2)}/h) no calculador principal!`
                      : `Province mise à jour vers ${prov} (${rate.toFixed(2)}$/h) !`
                  );
                  setTimeout(() => setToastMessage(null), 3500);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </motion.div>
          )}

          {/* TOOL 5.2: DEDICATED RESOURCE & KNOWLEDGE HUB */}
          {activeTool === 'resources' && (
            <motion.div
              key="resources-workspace"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              <ResourceHubSection
                lang={lang}
                onSelectTool={handleSelectTool}
                onOpenEbookModal={handleOpenEbookModal}
                onOpenProModal={handleOpenProModal}
              />
            </motion.div>
          )}

          {/* TOOL 5.3: FREE LIBRARY AND DOWNLOADS HUB */}
          {activeTool === 'guides' && (
            <motion.div
              key="guides-workspace"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              <GuidesAndResources
                lang={lang}
              />
            </motion.div>
          )}

          {/* TOOL 6: VACATION & HOLIDAYS */}
          {activeTool === 'vacation-holidays' && (
            <motion.div
              key="vacation-holidays-workspace"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              <QuebecBenefitsTools calc={calculation} lang={lang} initialTab="vacation" />
            </motion.div>
          )}

          {/* TOOL 7: RRSP & TAX SAVINGS */}
          {activeTool === 'rrsp-savings' && (
            <motion.div
              key="rrsp-savings-workspace"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              <QuebecBenefitsTools calc={calculation} lang={lang} initialTab="rrsp" />
            </motion.div>
          )}

          {/* TOOL 8: RESUME BUILDER (NOVO!) */}
          {activeTool === 'resume-builder' && (
            <motion.div
              key="resume-builder-workspace"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              <ResumeBuilder
                lang={lang}
                isPro={isPro}
                onOpenProModal={handleOpenProModal}
              />
            </motion.div>
          )}

          {/* TOOL 9: INTERVIEW SIMULATOR (NOVO!) */}
          {activeTool === 'interview-simulator' && (
            <motion.div
              key="interview-simulator-workspace"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              <InterviewSimulator
                lang={lang}
                isPro={isPro}
                onOpenProModal={handleOpenProModal}
              />
            </motion.div>
          )}

          {/* TOOL 10: TECHNICAL TESTS (NOVO!) */}
          {activeTool === 'tech-tests' && (
            <motion.div
              key="tech-tests-workspace"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              <TechnicalTestsSimulator
                lang={lang}
                isPro={isPro}
                onOpenProModal={handleOpenProModal}
              />
            </motion.div>
          )}

          {/* TOOL 11: BLOG & PRATICAL GUIDES (ARTIGOS, AFILIADOS & SOLUÇÕES MAPEADAS) */}
          {activeTool === 'blog' && (
            <motion.div
              key="blog-workspace"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              <BlogSection
                lang={lang}
                onSelectTool={handleSelectTool}
                onOpenEbookModal={handleOpenEbookModal}
                initialArticleId={selectedBlogArticleId}
              />
            </motion.div>
          )}

          {/* TOOL 12: COMMERCIAL SHOWCASE & DIGITAL LOTS MEDIA KIT */}
          {activeTool === 'media-kit' && (
            <motion.div
              key="media-kit-workspace"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              <CommercialShowcase
                lang={lang}
                onSelectTool={handleSelectTool}
                onOpenProModal={() => handleOpenProModal('media-kit')}
                initialTab={b2bTab}
              />
            </motion.div>
          )}

          {/* TOOL 13: MONETIZATION HUB — dedicated destination for owned products and affiliate recommendations */}
          {activeTool === 'monetization' && (
            <motion.div
              key="monetization-workspace"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              <MonetizationHubPage lang={lang} onSelectTool={handleSelectTool} />
            </motion.div>
          )}

          {/* TOOL 14: SITEMAP & INSTITUTIONAL COMPLIANCE PAGES */}
          {activeTool === 'sitemap' && (
            <motion.div
              key="sitemap-workspace"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              <SiteCompliancePages
                lang={lang}
                onSelectTool={handleSelectTool}
                onNavigateToArticle={(articleId) => {
                  setSelectedBlogArticleId(articleId);
                  handleSelectTool('blog');
                  window.scrollTo({ top: 100, behavior: 'smooth' });
                }}
              />
            </motion.div>
          )}

          {/* TOOL 14: GUIA DEFINITIVO & E-BOOK STORE (PÁGINA COMPLETA) */}
          {activeTool === 'ebook-store' && (
            <motion.div
              key="ebook-store-workspace"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              <EbookStorePage
                lang={lang}
                onSelectTool={handleSelectTool}
                initialAssetId={selectedEbookAssetId}
              />
            </motion.div>
          )}

          {/* TOOL 15: CARRIÈRE PRO & PLANOS (PÁGINA COMPLETA) */}
          {activeTool === 'pro-plans' && (
            <motion.div
              key="pro-plans-workspace"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              <ProPlansPage
                lang={lang}
                onSelectTool={handleSelectTool}
                onUnlockPro={handleUnlockPro}
              />
            </motion.div>
          )}

          {/* TOOL 16: CENÁRIOS & ESTUDO DE CASO LECLERC (PÁGINA COMPLETA) */}
          {activeTool === 'scenarios' && (
            <motion.div
              key="scenarios-workspace"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              <ScenariosPage
                lang={lang}
                onSelectTool={handleSelectTool}
                onLoadLeclercExample={handleLoadLeclercExample}
              />
            </motion.div>
          )}

          {/* TOOL 17: PROGRAMA DE PARCEIROS & COMMANDITAIRES (PÁGINA COMPLETA) */}
          {activeTool === 'partners' && (
            <motion.div
              key="partners-workspace"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              <PartnersPage
                lang={lang}
                onSelectTool={handleSelectTool}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3. iLovePDF-Style Toolbox Grid (All Tools Showcase) */}
        <div id="toolbox-section" className="pt-8 border-t border-slate-200/80">
  <ToolboxGrid
  lang={lang}
  activeTool={activeTool}
  onSelectTool={handleSelectTool}
  />
  </div>

  {/* Strategic post-tools offer: high-engagement placement aligned with the tool directory */}
  <AdBanner
  section="tools-section"
  fallbackSection="home-top"
  format="bottom-wide"
  lang={lang}
  onNavigateToMediaKit={() => {
  handleSelectTool('media-kit');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  }}
  />
  
  {/* 4. Newsletter & Lead Magnet Callout */}
        <div className="pt-2">
          <NewsletterBox lang={lang} variant="banner" />
        </div>

        {/* 5. FAQ Section */}
        <div className="pt-6 border-t border-slate-200/80">
          <FaqSection lang={lang} />
        </div>
      </main>

      {/* Footer with Tools, Blog, Ebook and Compliance links */}
      <Footer
        lang={lang}
        onSelectTool={handleSelectTool}
        onOpenEbookModal={handleOpenEbookModal}
      />

      {/* Floating Toast Notification */}
      {(copied || toastMessage) && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs sm:text-sm font-semibold py-2.5 px-4 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2 animate-bounce">
          <span className="text-emerald-400 font-bold">✓</span>
          <span>{toastMessage || t.copiedSuccess}</span>
        </div>
      )}
    </div>
  );
}
