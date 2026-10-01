'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Language, translations } from '@/lib/i18n';
import { ToolId } from '@/components/ToolboxGrid';
import {
  Calculator,
  Repeat,
  TrendingUp,
  Timer,
  Scale,
  Palmtree,
  PiggyBank,
  Factory,
  Check,
  Menu,
  X,
  ChevronDown,
  Globe,
  ArrowRight,
  FileText,
  Mic,
  FileCheck2,
  Crown,
  Sparkles,
  BookOpen,
  Lock,
  Megaphone,
  Award,
  Zap,
  Map,
  MapPin,
  Briefcase,
  Building2,
  Download,
} from 'lucide-react';

interface HeaderProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  onCopySummary?: () => void;
  copied?: boolean;
  activeTool: ToolId;
  onSelectTool: (tool: ToolId) => void;
  hourlyRate?: number;
  netAmount?: number;
  locale?: string;
  onOpenScenarios?: () => void;
  frequencyLabel?: string;
  totalHoursPerWeek?: number;
  onLoadLeclercExample?: () => void;
  isPro?: boolean;
  onOpenProModal?: (trigger?: string) => void;
  onOpenEbookModal?: () => void;
  onSelectB2bTab?: (tab: 'catalog' | 'sponsorship' | 'jobs' | 'map') => void;
}

type DropdownId = 'calculators' | 'career' | 'content' | 'business' | 'language' | null;

interface LanguageOption {
  code: Language;
  label: string;
  sublabel: string;
  flag: string;
}

const LANGUAGE_OPTIONS: LanguageOption[] = [
  {
    code: 'fr',
    label: 'Français (QC)',
    sublabel: 'Langue officielle du Québec',
    flag: '⚜️',
  },
  {
    code: 'pt',
    label: 'Português (BR)',
    sublabel: 'Guia e comunidade brasileira',
    flag: '🇧🇷',
  },
  {
    code: 'en',
    label: 'English (CA)',
    sublabel: 'Canadian workplace standards',
    flag: '🇨🇦',
  },
];

// Complete multilingual dictionary for Header navigation & dropdowns
const HEADER_I18N = {
  nav: {
    calculators: {
      fr: 'Calculateurs',
      pt: 'Calculadoras',
      en: 'Calculators',
    },
    career: {
      fr: 'Carrière & RH',
      pt: 'Carreira & RH',
      en: 'Career & HR',
    },
    content: {
      fr: 'Guides & Ressources',
      pt: 'Guias & Recursos',
      en: 'Guides & Resources',
    },
    business: {
      fr: 'Entreprises',
      pt: 'Para Empresas',
      en: 'For Business',
    },
  },
  calculators: {
    sectionIncome: {
      fr: 'Rémunération & Net',
      pt: 'Salário & Renda',
      en: 'Salary & Net Pay',
    },
    sectionStandards: {
      fr: 'Normes CNESST & Épargne',
      pt: 'Normas CNESST & Poupança',
      en: 'Labor Standards & Savings',
    },
    netPayTitle: {
      fr: 'Salaire Net Officiel 2026',
      pt: 'Salário Líquido Oficial 2026',
      en: 'Official Net Pay 2026',
    },
    netPayDesc: {
      fr: 'Brut au net avec RRQ, RQAP et paliers d’imposition',
      pt: 'Bruto para líquido com RRQ, RQAP e alíquotas fiscais',
      en: 'Gross to net with QPP, QPIP and tax brackets',
    },
    converterTitle: {
      fr: 'Convertisseur de Périodes',
      pt: 'Conversor de Períodos',
      en: 'Pay Period Converter',
    },
    converterDesc: {
      fr: 'Heure ⇄ Quinzaine ⇄ Mois ⇄ Année',
      pt: 'Hora ⇄ Quinzena ⇄ Mês ⇄ Ano',
      en: 'Hourly ⇄ Biweekly ⇄ Monthly ⇄ Yearly',
    },
    raiseTitle: {
      fr: 'Simulateur d’Augmentation',
      pt: 'Simulador de Aumento Real',
      en: 'Pay Raise Simulator',
    },
    raiseDesc: {
      fr: 'Gain net réel en poche après déductions d’impôt',
      pt: 'Ganho líquido real no bolso após deduções fiscais',
      en: 'Real take-home gain in pocket after income taxes',
    },
    compareTitle: {
      fr: 'Comparateur d’Emplois',
      pt: 'Comparador de Propostas',
      en: 'Job Offer Comparator',
    },
    compareDesc: {
      fr: 'Comparez l’Offre A vs l’Offre B au net',
      pt: 'Compare Oferta A vs Proposta B no bolso',
      en: 'Compare Offer A vs Offer B in net take-home',
    },
    provincesTitle: {
      fr: 'Salaires dans les 13 Provinces',
      pt: 'Salário nas 13 Províncias do Canadá',
      en: 'Salaries in All 13 Provinces',
    },
    provincesDesc: {
      fr: 'Québec vs Ontario vs Alberta vs Colombie-Britannique',
      pt: 'Québec vs Ontário vs Alberta vs BC e poder de compra',
      en: 'Quebec vs Ontario vs Alberta vs BC net take-home',
    },
    overtimeTitle: {
      fr: 'Heures Supplémentaires (1,5× / 2,0×)',
      pt: 'Horas Extras CNESST (1,5× / 2,0×)',
      en: 'Overtime Pay (1.5× / 2.0×)',
    },
    overtimeDesc: {
      fr: 'Règle légale de temps et demi après 40h/semaine',
      pt: 'Regra legal de tempo e meio após 40h semanais',
      en: 'Legal time-and-a-half standard after 40h/week',
    },
    vacationTitle: {
      fr: 'Vacances (4%/6%) & 8 Jours Fériés',
      pt: 'Férias (4%/6%) & 8 Feriados Oficiais',
      en: 'Vacation (4%/6%) & 8 Stat Holidays',
    },
    vacationDesc: {
      fr: 'Indemnité légale calculée selon la règle du 1/20',
      pt: 'Indenização legal calculada pela regra do 1/20',
      en: 'Legal indemnity calculated using the 1/20 rule',
    },
    rrspTitle: {
      fr: 'Match REER & CELIAPP',
      pt: 'Match REER & CELIAPP',
      en: 'RRSP & FHSA Match',
    },
    rrspDesc: {
      fr: 'Retour d’impôt annuel et cotisation employeur',
      pt: 'Restituição no imposto de renda e bônus empresa',
      en: 'Annual tax refund and employer match contribution',
    },
    factoryTitle: {
      fr: 'Talon de Paie Industriel',
      pt: 'Holerite Industrial Detalhado',
      en: 'Industrial Paystub',
    },
    factoryDesc: {
      fr: 'Relevé complet de paie manufacturière québécoise',
      pt: 'Demonstrativo completo de paie fabril no Québec',
      en: 'Complete Québec manufacturing paystub breakdown',
    },
    caseStudyText: {
      fr: 'Étude de cas réelle : Biscuits Leclerc (31,51 $/h, 40h)',
      pt: 'Exemplo Real: Biscuits Leclerc ($31.51/h, 40h)',
      en: 'Real Case Study: Biscuits Leclerc ($31.51/h, 40h)',
    },
    caseStudyAction: {
      fr: 'Charger',
      pt: 'Carregar',
      en: 'Load',
    },
  },
  career: {
    sectionTitle: {
      fr: 'Recrutement & Marché Québécois',
      pt: 'Empregabilidade no Québec',
      en: 'Québec Job Market & HR',
    },
    resumeTitle: {
      fr: 'Créateur de CV Québec (ATS)',
      pt: 'Construtor de CV Québec (ATS)',
      en: 'Québec Resume Builder (ATS)',
    },
    resumeDesc: {
      fr: 'Sans photo, standard local conforme anti-discrimination',
      pt: 'Sem foto, formato padrão contra vieses e adaptado a ATS',
      en: 'No photo, local standard aligned with anti-bias hiring',
    },
    interviewTitle: {
      fr: 'Simulateur d’Entrevue STAR',
      pt: 'Simulador de Entrevista STAR',
      en: 'STAR Interview Simulator',
    },
    interviewDesc: {
      fr: 'Questions comportementales et culture d’entreprise locale',
      pt: 'Perguntas comportamentais e inteligência cultural local',
      en: 'Behavioral interview questions and workplace culture',
    },
    techTestsTitle: {
      fr: 'Tests Techniques & CNESST',
      pt: 'Testes Técnicos & CNESST',
      en: 'Technical & CNESST Tests',
    },
    techTestsDesc: {
      fr: 'SIMDUT, santé et sécurité d’embauche en milieu de travail',
      pt: 'SIMDUT, segurança e lógica pré-admissional',
      en: 'WHMIS, occupational health, safety and logic screening',
    },
  },
  content: {
    sectionTitle: {
      fr: 'Connaissances & Conformité',
      pt: 'Conhecimento & Conformidade',
      en: 'Knowledge & Compliance',
    },
    blogTitle: {
      fr: 'Blog & Articles Pratiques',
      pt: 'Blog & Artigos Práticos',
      en: 'Blog & Practical Guides',
    },
    blogDesc: {
      fr: 'Guides d’impôts, déductions et droits des travailleurs',
      pt: 'Deduções, impostos e guias de direitos trabalhistas',
      en: 'Tax deductions, filings and labor rights guides',
    },
    ebookTitle: {
      fr: 'Guide de Survie Fiscale (PDF)',
      pt: 'Guia de Sobrevivência Fiscal (PDF)',
      en: 'Tax Survival Guide (PDF)',
    },
    ebookDesc: {
      fr: 'Manuel complet de 140 pages pour nouveaux arrivants',
      pt: 'Manual completo de 140 páginas para imigrantes',
      en: 'Comprehensive 140-page guide for newcomers',
    },
    sitemapTitle: {
      fr: 'Plan du Site & Politiques',
      pt: 'Mapa do Site & Conformidade',
      en: 'Sitemap & Policies',
    },
    sitemapDesc: {
      fr: 'Index complet des pages, mentions légales et Google Ads',
      pt: 'Índice de páginas, termos legais e requisitos Google',
      en: 'Complete directory of pages, legal terms and Google compliance',
    },
  },
  business: {
    sectionTitle: {
      fr: 'Solutions Corporatives & B2B',
      pt: 'Publicidade & Soluções B2B',
      en: 'B2B Advertising & HR Solutions',
    },
    mediaKitTitle: {
      fr: 'Kit Média 2026 & Matriz de Lotes',
      pt: 'Mídia Kit 2026 & Matriz de Lotes',
      en: 'Media Kit 2026 & Ad Inventory',
    },
    mediaKitDesc: {
      fr: '9 formats publicitaires pour banques, RH et fintechs',
      pt: '9 formatos publicitários para bancos, agências e RH',
      en: '9 high-visibility formats for banks, agencies and fintechs',
    },
    sponsorTitle: {
      fr: 'Commandite Exclusive de Catégorie',
      pt: 'Patrocínio Exclusivo de Categoria',
      en: 'Exclusive Category Sponsorship',
    },
    sponsorDesc: {
      fr: 'Positionnement dominant sur une section clé du portail',
      pt: 'Domine uma seção inteira com a marca da sua empresa',
      en: 'Own an entire portal category with exclusive brand presence',
    },
    jobsTitle: {
      fr: 'Offres d’Emploi & Forfaits 360°',
      pt: 'Divulgação de Vagas & Combos 360°',
      en: 'Job Postings & 360° Packages',
    },
    jobsDesc: {
      fr: 'Recrutement ciblé de travailleurs qualifiés au Québec',
      pt: 'Atração de talentos de alta qualificação no Québec',
      en: 'Targeted hiring for skilled workers across Québec',
    },
    spacesMapTitle: {
      fr: 'Plan Interactif des Espaces Publicitaires',
      pt: 'Mapa Interativo de Espaços Publicitários',
      en: 'Interactive Ad Placement Blueprint',
    },
    spacesMapDesc: {
      fr: 'Inventaire en direct de tous les emplacements disponibles',
      pt: 'Menu dinâmico com todas as vitrines disponíveis no portal',
      en: 'Live blueprint of all available portal advertising spaces',
    },
  },
  languageMenu: {
    label: {
      fr: 'Langue',
      pt: 'Idioma',
      en: 'Language',
    },
    title: {
      fr: 'Choisir la langue du portail',
      pt: 'Escolha o idioma do portal',
      en: 'Choose portal language',
    },
  },
  mobile: {
    calculators: {
      fr: 'Calculateurs & Salaire',
      pt: 'Calculadoras & Salário',
      en: 'Calculators & Income',
    },
    career: {
      fr: 'Carrière & Emploi',
      pt: 'Carreira & Emprego',
      en: 'Career & Employment',
    },
    resources: {
      fr: 'Ressources & B2B',
      pt: 'Recursos & Empresas',
      en: 'Resources & Business',
    },
  },
};

export const Header: React.FC<HeaderProps> = ({
  lang,
  onLanguageChange,
  activeTool,
  onSelectTool,
  onLoadLeclercExample,
  isPro = false,
  onOpenProModal,
  onOpenEbookModal,
  onSelectB2bTab,
}) => {
  // Dropdown & Menu State
  const [activeDropdown, setActiveDropdown] = useState<DropdownId>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Rotative Top Ticker Banner State
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [isTickerPaused, setIsTickerPaused] = useState(false);

  const banners = [
    {
      pt: "🚀 Pass Carrière Pro: Desbloqueie simuladores STAR e testes técnicos por apenas $12.99 CAD.",
      fr: "🚀 Pass Carrière Pro : Débloquez les simulateurs STAR et tests techniques pour seulement 12,99 $ CAD.",
      en: "🚀 Pass Carrière Pro: Unlock STAR interview simulators and technical tests for only $12.99 CAD.",
      btnPt: "Ver Planos",
      btnFr: "Découvrir",
      btnEn: "See Plans",
      tool: "pro-plans" as ToolId
    },
    {
      pt: "📚 Guia Definitivo do Salário & Emprego no Québec (140p): O manual mais completo de 2026.",
      fr: "📚 Guide Ultime du Salaire & de l'Emploi au Québec (140p) : Le manuel le plus complet de 2026.",
      en: "📚 Ultimate Quebec Salary & Employment Guide (140p): The most complete manual for 2026.",
      btnPt: "Obter Guia",
      btnFr: "Acheter le Guide",
      btnEn: "Get Guide",
      tool: "ebook-store" as ToolId
    },
    {
      pt: "🤝 Sua empresa no PaieNet: Anuncie para mais de 48k profissionais no Québec.",
      fr: "🤝 Votre entreprise sur PaieNet : Annoncez auprès de plus de 48k professionnels au Québec.",
      en: "🤝 Your brand on PaieNet: Sponsor and advertise to 48k+ professionals in Quebec.",
      btnPt: "Anunciar / B2B",
      btnFr: "Annoncer / B2B",
      btnEn: "Advertise / B2B",
      tool: "partners" as ToolId
    }
  ];

  useEffect(() => {
    if (isTickerPaused) return;
    const timer = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isTickerPaused]);

  const navRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Hover delay handling to prevent accidental closing
  const handleMouseEnter = (id: DropdownId) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(id);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const handleNavClick = (toolId: ToolId) => {
    onSelectTool(toolId);
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleB2bClick = (subTab: 'catalog' | 'sponsorship' | 'jobs' | 'map') => {
    onSelectTool('media-kit');
    onSelectB2bTab?.(subTab);
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentLanguageOption =
    LANGUAGE_OPTIONS.find((opt) => opt.code === lang) || LANGUAGE_OPTIONS[0];

  const isCalculatorActive = [
    'net-calc',
    'converter',
    'raise',
    'overtime',
    'vacation-holidays',
    'rrsp-savings',
    'factory-stub',
    'compare-jobs',
    'canada-provinces',
    'scenarios',
  ].includes(activeTool);

  const isCareerActive = [
    'resume-builder',
    'interview-simulator',
    'tech-tests',
    'pro-plans',
  ].includes(activeTool);

  const isContentActive = [
    'resources',
    'guides',
    'blog',
    'ebook-store',
    'sitemap',
    'compliance',
  ].includes(activeTool);
  const isBusinessActive = ['media-kit', 'partners'].includes(activeTool);

  return (
    <header
      className="sticky top-0 z-50 w-full bg-card/95 backdrop-blur-xl border-b border-border/80 transition-all shadow-sm supports-[backdrop-filter]:bg-card/80"
      ref={navRef}
    >
      {/* Rotative Top Ticker Banner */}
      <div
        className="w-full bg-slate-900 text-white text-[11px] sm:text-xs font-semibold py-1.5 px-4 flex items-center justify-center gap-3 transition-all relative overflow-hidden border-b border-slate-800"
        onMouseEnter={() => setIsTickerPaused(true)}
        onMouseLeave={() => setIsTickerPaused(false)}
        onFocus={() => setIsTickerPaused(true)}
        onBlur={() => setIsTickerPaused(false)}
        aria-live="polite"
      >
        <div className="flex items-center gap-2 justify-center flex-wrap text-center select-none animate-in fade-in duration-200">
          <span>{banners[currentBannerIndex][lang]}</span>
          <button
            type="button"
            onClick={() => handleNavClick(banners[currentBannerIndex].tool)}
            className="ml-2 px-2.5 py-0.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 text-[10px] font-extrabold tracking-wide uppercase transition-colors shrink-0 cursor-pointer"
          >
            {banners[currentBannerIndex][`btn${lang === 'pt' ? 'Pt' : lang === 'en' ? 'En' : 'Fr'}`]} →
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Clean Modern Navbar Row */}
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-6">
          {/* 1. BRAND LOGO (Left) */}
          <div className="flex items-center gap-6 shrink-0">
            <button
              type="button"
              onClick={() => handleNavClick('net-calc')}
              className="flex items-center gap-2.5 text-left cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg p-1 -m-1"
              aria-label="PaieNet Québec"
            >
              <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs group-hover:bg-blue-700 transition-colors shrink-0">
                <Calculator className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-extrabold text-slate-900 tracking-tight text-lg">
                  PaieNet<span className="text-blue-600">.qc</span>
                </span>
                <span className="text-[11px] font-medium text-slate-400 hidden sm:inline tracking-normal">
                  Québec
                </span>
                {isPro && (
                  <span className="ml-1 px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[10px] tracking-wide border border-amber-300">
                    PRO
                  </span>
                )}
              </div>
            </button>

            {/* 2. PRIMARY DESKTOP NAVIGATION (Center-Left) */}
            <nav className="hidden lg:flex items-center gap-1">
              {/* Dropdown 1: Calculadoras & Salário */}
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnter('calculators')}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  onClick={() =>
                    setActiveDropdown(activeDropdown === 'calculators' ? null : 'calculators')
                  }
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors cursor-pointer ${
                    isCalculatorActive || activeDropdown === 'calculators'
                      ? 'text-blue-700 bg-blue-50/80 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                  aria-expanded={activeDropdown === 'calculators'}
                  aria-haspopup="true"
                >
                  <span>{HEADER_I18N.nav.calculators[lang]}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                      activeDropdown === 'calculators' ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>

                {/* Calculators Megamenu Popover */}
                {activeDropdown === 'calculators' && (
                  <div className="absolute left-0 top-full pt-1.5 z-50 w-[590px] animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="rounded-2xl bg-white border border-slate-200/90 shadow-xl p-4">
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        {/* Column 1: Salário & Conversão */}
                        <div className="space-y-0.5">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block px-2.5 py-1">
                            {HEADER_I18N.calculators.sectionIncome[lang]}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleNavClick('net-calc')}
                            className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left transition-colors cursor-pointer group ${
                              activeTool === 'net-calc' ? 'bg-blue-50 text-blue-900' : 'hover:bg-slate-50 text-slate-800'
                            }`}
                          >
                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                              <Calculator className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <span className="text-xs font-semibold block text-slate-900 group-hover:text-blue-700">
                                {HEADER_I18N.calculators.netPayTitle[lang]}
                              </span>
                              <span className="text-[11px] text-slate-500 font-normal leading-tight block">
                                {HEADER_I18N.calculators.netPayDesc[lang]}
                              </span>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleNavClick('converter')}
                            className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left transition-colors cursor-pointer group ${
                              activeTool === 'converter' ? 'bg-blue-50 text-blue-900' : 'hover:bg-slate-50 text-slate-800'
                            }`}
                          >
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                              <Repeat className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <span className="text-xs font-semibold block text-slate-900 group-hover:text-emerald-700">
                                {HEADER_I18N.calculators.converterTitle[lang]}
                              </span>
                              <span className="text-[11px] text-slate-500 font-normal leading-tight block">
                                {HEADER_I18N.calculators.converterDesc[lang]}
                              </span>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleNavClick('raise')}
                            className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left transition-colors cursor-pointer group ${
                              activeTool === 'raise' ? 'bg-blue-50 text-blue-900' : 'hover:bg-slate-50 text-slate-800'
                            }`}
                          >
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                              <TrendingUp className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <span className="text-xs font-semibold block text-slate-900 group-hover:text-indigo-700">
                                {HEADER_I18N.calculators.raiseTitle[lang]}
                              </span>
                              <span className="text-[11px] text-slate-500 font-normal leading-tight block">
                                {HEADER_I18N.calculators.raiseDesc[lang]}
                              </span>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleNavClick('compare-jobs')}
                            className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left transition-colors cursor-pointer group ${
                              activeTool === 'compare-jobs' ? 'bg-blue-50 text-blue-900' : 'hover:bg-slate-50 text-slate-800'
                            }`}
                          >
                            <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                              <Scale className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <span className="text-xs font-semibold block text-slate-900 group-hover:text-cyan-700">
                                {HEADER_I18N.calculators.compareTitle[lang]}
                              </span>
                              <span className="text-[11px] text-slate-500 font-normal leading-tight block">
                                {HEADER_I18N.calculators.compareDesc[lang]}
                              </span>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleNavClick('canada-provinces')}
                            className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left transition-colors cursor-pointer group ${
                              activeTool === 'canada-provinces' ? 'bg-blue-50 text-blue-900' : 'hover:bg-slate-50 text-slate-800'
                            }`}
                          >
                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                              <MapPin className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <span className="text-xs font-semibold block text-slate-900 group-hover:text-blue-700">
                                {HEADER_I18N.calculators.provincesTitle[lang]}
                              </span>
                              <span className="text-[11px] text-slate-500 font-normal leading-tight block">
                                {HEADER_I18N.calculators.provincesDesc[lang]}
                              </span>
                            </div>
                          </button>
                        </div>

                        {/* Column 2: Normas CNESST & Poupança */}
                        <div className="space-y-0.5">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block px-2.5 py-1">
                            {HEADER_I18N.calculators.sectionStandards[lang]}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleNavClick('overtime')}
                            className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left transition-colors cursor-pointer group ${
                              activeTool === 'overtime' ? 'bg-blue-50 text-blue-900' : 'hover:bg-slate-50 text-slate-800'
                            }`}
                          >
                            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                              <Timer className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <span className="text-xs font-semibold block text-slate-900 group-hover:text-amber-700">
                                {HEADER_I18N.calculators.overtimeTitle[lang]}
                              </span>
                              <span className="text-[11px] text-slate-500 font-normal leading-tight block">
                                {HEADER_I18N.calculators.overtimeDesc[lang]}
                              </span>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleNavClick('vacation-holidays')}
                            className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left transition-colors cursor-pointer group ${
                              activeTool === 'vacation-holidays' ? 'bg-blue-50 text-blue-900' : 'hover:bg-slate-50 text-slate-800'
                            }`}
                          >
                            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                              <Palmtree className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <span className="text-xs font-semibold block text-slate-900 group-hover:text-teal-700">
                                {HEADER_I18N.calculators.vacationTitle[lang]}
                              </span>
                              <span className="text-[11px] text-slate-500 font-normal leading-tight block">
                                {HEADER_I18N.calculators.vacationDesc[lang]}
                              </span>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleNavClick('rrsp-savings')}
                            className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left transition-colors cursor-pointer group ${
                              activeTool === 'rrsp-savings' ? 'bg-blue-50 text-blue-900' : 'hover:bg-slate-50 text-slate-800'
                            }`}
                          >
                            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                              <PiggyBank className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <span className="text-xs font-semibold block text-slate-900 group-hover:text-purple-700">
                                {HEADER_I18N.calculators.rrspTitle[lang]}
                              </span>
                              <span className="text-[11px] text-slate-500 font-normal leading-tight block">
                                {HEADER_I18N.calculators.rrspDesc[lang]}
                              </span>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleNavClick('factory-stub')}
                            className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left transition-colors cursor-pointer group ${
                              activeTool === 'factory-stub' ? 'bg-blue-50 text-blue-900' : 'hover:bg-slate-50 text-slate-800'
                            }`}
                          >
                            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-slate-800 group-hover:text-white transition-colors">
                              <Factory className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <span className="text-xs font-semibold block text-slate-900 group-hover:text-slate-900">
                                {HEADER_I18N.calculators.factoryTitle[lang]}
                              </span>
                              <span className="text-[11px] text-slate-500 font-normal leading-tight block">
                                {HEADER_I18N.calculators.factoryDesc[lang]}
                              </span>
                            </div>
                          </button>
                        </div>
                      </div>

                      {/* Bottom Feature Card: Case Real Leclerc */}
                      <div className="pt-2.5 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => {
                            onLoadLeclercExample?.();
                            handleNavClick('scenarios');
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-medium transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-2">
                            <Factory className="w-3.5 h-3.5 text-blue-600" />
                            <span>{HEADER_I18N.calculators.caseStudyText[lang]}</span>
                          </div>
                          <span className="text-[10px] font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                            <span>{lang === 'pt' ? 'Ver Estudo Completo' : 'Voir l’étude'}</span>
                            <ArrowRight className="w-3 h-3" />
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Dropdown 2: Carreira & RH */}
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnter('career')}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  onClick={() =>
                    setActiveDropdown(activeDropdown === 'career' ? null : 'career')
                  }
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors cursor-pointer ${
                    isCareerActive || activeDropdown === 'career'
                      ? 'text-blue-700 bg-blue-50/80 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                  aria-expanded={activeDropdown === 'career'}
                  aria-haspopup="true"
                >
                  <span>{HEADER_I18N.nav.career[lang]}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                      activeDropdown === 'career' ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>

                {/* Career Dropdown Popover */}
                {activeDropdown === 'career' && (
                  <div className="absolute left-0 top-full pt-1.5 z-50 w-80 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="rounded-2xl bg-white border border-slate-200/90 shadow-xl p-3 space-y-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block px-2.5 py-1">
                        {HEADER_I18N.career.sectionTitle[lang]}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleNavClick('resume-builder')}
                        className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left transition-colors cursor-pointer group ${
                          activeTool === 'resume-builder' ? 'bg-indigo-50 text-indigo-900' : 'hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-semibold block text-slate-900 group-hover:text-indigo-700">
                            {HEADER_I18N.career.resumeTitle[lang]}
                          </span>
                          <span className="text-[11px] text-slate-500 font-normal leading-tight block">
                            {HEADER_I18N.career.resumeDesc[lang]}
                          </span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleNavClick('interview-simulator')}
                        className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left transition-colors cursor-pointer group ${
                          activeTool === 'interview-simulator' ? 'bg-indigo-50 text-indigo-900' : 'hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                          <Mic className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-semibold block text-slate-900 group-hover:text-purple-700">
                            {HEADER_I18N.career.interviewTitle[lang]}
                          </span>
                          <span className="text-[11px] text-slate-500 font-normal leading-tight block">
                            {HEADER_I18N.career.interviewDesc[lang]}
                          </span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleNavClick('tech-tests')}
                        className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left transition-colors cursor-pointer group ${
                          activeTool === 'tech-tests' ? 'bg-indigo-50 text-indigo-900' : 'hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          <FileCheck2 className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-semibold block text-slate-900 group-hover:text-blue-700">
                            {HEADER_I18N.career.techTestsTitle[lang]}
                          </span>
                          <span className="text-[11px] text-slate-500 font-normal leading-tight block">
                            {HEADER_I18N.career.techTestsDesc[lang]}
                          </span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleNavClick('pro-plans')}
                        className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left transition-colors cursor-pointer group ${
                          activeTool === 'pro-plans' ? 'bg-indigo-50 text-indigo-900' : 'hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                          <Crown className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold block text-slate-900 group-hover:text-indigo-700">
                              {lang === 'pt' ? 'Pass Carrière Pro & Planos' : 'Pass Carrière Pro & Forfaits'}
                            </span>
                            <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-1 py-0.2 rounded">
                              Pro
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 font-normal leading-tight block">
                            {lang === 'pt' ? 'Acesso ilimitado a CVs ATS, simulador STAR e testes' : 'Accès illimité aux CVs conformes ATS et entrevues'}
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Acesso editorial direto: Blog */}
              <button
                type="button"
                onClick={() => handleNavClick('blog')}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-semibold transition-colors cursor-pointer ${
                  activeTool === 'blog' ? 'text-blue-700 bg-blue-50/80' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
                aria-current={activeTool === 'blog' ? 'page' : undefined}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{lang === 'pt' ? 'Blog' : lang === 'en' ? 'Blog' : 'Blogue'}</span>
              </button>

              {/* Dropdown 3: Conteúdo & Guias */}
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnter('content')}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  onClick={() =>
                    setActiveDropdown(activeDropdown === 'content' ? null : 'content')
                  }
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors cursor-pointer ${
                    isContentActive || activeDropdown === 'content'
                      ? 'text-blue-700 bg-blue-50/80 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                  aria-expanded={activeDropdown === 'content'}
                  aria-haspopup="true"
                >
                  <span>{HEADER_I18N.nav.content[lang]}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                      activeDropdown === 'content' ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>

                {/* Content Dropdown Popover */}
                {activeDropdown === 'content' && (
                  <div className="absolute left-0 top-full pt-1.5 z-50 w-80 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="rounded-2xl bg-white border border-slate-200/90 shadow-xl p-3 space-y-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block px-2.5 py-1">
                        {HEADER_I18N.content.sectionTitle[lang]}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleNavClick('resources')}
                        className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left transition-colors cursor-pointer group ${
                          activeTool === 'resources' ? 'bg-emerald-50 text-emerald-900' : 'hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold block text-slate-900 group-hover:text-emerald-700">
                              {lang === 'pt' ? 'E-books & Infoprodutos Premium' : lang === 'en' ? 'Premium E-books & Guides Store' : 'E-books & Guides Premium'}
                            </span>
                            <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-1 py-0.2 rounded">
                              PRO
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 font-normal leading-tight block">
                            {lang === 'pt' ? 'Nossos melhores guias para alavancar seu salário no Canadá' : 'Our highest-value premium guides to boost your Canadian salary'}
                          </span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleNavClick('guides')}
                        className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left transition-colors cursor-pointer group ${
                          activeTool === 'guides' ? 'bg-indigo-50 text-indigo-900' : 'hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                          <Download className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold block text-slate-900 group-hover:text-indigo-700">
                              {lang === 'pt' ? 'Biblioteca de Downloads Grátis' : lang === 'en' ? 'Free Downloads Library' : 'Bibliothèque de documents gratuits'}
                            </span>
                            <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded">
                              Gratuit
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 font-normal leading-tight block">
                            {lang === 'pt' ? 'Modelos de CV em Word, planilhas orçamentárias e checklists de imigração' : 'Word resume templates, budgeting sheets and checklists'}
                          </span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleNavClick('ebook-store')}
                        className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left transition-colors cursor-pointer group ${
                          activeTool === 'ebook-store' ? 'bg-amber-50 text-amber-900' : 'hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold text-slate-900 group-hover:text-amber-800">
                              {HEADER_I18N.content.ebookTitle[lang]}
                            </span>
                            <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-1 py-0.2 rounded">
                              140p
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 font-normal leading-tight block">
                            {HEADER_I18N.content.ebookDesc[lang]}
                          </span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleNavClick('blog')}
                        className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left transition-colors cursor-pointer group ${
                          activeTool === 'blog' ? 'bg-blue-50 text-blue-900' : 'hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-semibold block text-slate-900 group-hover:text-blue-700">
                            {HEADER_I18N.content.blogTitle[lang]}
                          </span>
                          <span className="text-[11px] text-slate-500 font-normal leading-tight block">
                            {HEADER_I18N.content.blogDesc[lang]}
                          </span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleNavClick('sitemap')}
                        className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left transition-colors cursor-pointer group ${
                          activeTool === 'sitemap' ? 'bg-blue-50 text-blue-900' : 'hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-slate-800 group-hover:text-white transition-colors">
                          <Map className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-semibold block text-slate-900 group-hover:text-slate-900">
                            {HEADER_I18N.content.sitemapTitle[lang]}
                          </span>
                          <span className="text-[11px] text-slate-500 font-normal leading-tight block">
                            {HEADER_I18N.content.sitemapDesc[lang]}
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Dropdown 4: Para Empresas (B2B) */}
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnter('business')}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  onClick={() =>
                    setActiveDropdown(activeDropdown === 'business' ? null : 'business')
                  }
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors cursor-pointer ${
                    isBusinessActive || activeDropdown === 'business'
                      ? 'text-blue-700 bg-blue-50/80 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                  aria-expanded={activeDropdown === 'business'}
                  aria-haspopup="true"
                >
                  <span className="flex items-center gap-1.5">
                    <span>{HEADER_I18N.nav.business[lang]}</span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                      B2B
                    </span>
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                      activeDropdown === 'business' ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>

                {/* Business Dropdown Popover */}
                {activeDropdown === 'business' && (
                  <div className="absolute left-0 top-full pt-1.5 z-50 w-84 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="rounded-2xl bg-white border border-slate-200/90 shadow-xl p-3 space-y-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block px-2.5 py-1">
                        {HEADER_I18N.business.sectionTitle[lang]}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleB2bClick('catalog')}
                        className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left transition-colors cursor-pointer group ${
                          activeTool === 'media-kit' ? 'bg-blue-50 text-blue-900' : 'hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          <Megaphone className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-semibold block text-slate-900 group-hover:text-blue-700">
                            {HEADER_I18N.business.mediaKitTitle[lang]}
                          </span>
                          <span className="text-[11px] text-slate-500 font-normal leading-tight block">
                            {HEADER_I18N.business.mediaKitDesc[lang]}
                          </span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleB2bClick('sponsorship')}
                        className="w-full flex items-start gap-2.5 p-2 rounded-xl text-left hover:bg-slate-50 transition-colors cursor-pointer group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                          <Award className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-semibold block text-slate-900 group-hover:text-purple-700">
                            {HEADER_I18N.business.sponsorTitle[lang]}
                          </span>
                          <span className="text-[11px] text-slate-500 font-normal leading-tight block">
                            {HEADER_I18N.business.sponsorDesc[lang]}
                          </span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleB2bClick('jobs')}
                        className="w-full flex items-start gap-2.5 p-2 rounded-xl text-left hover:bg-slate-50 transition-colors cursor-pointer group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                          <Briefcase className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-semibold block text-slate-900 group-hover:text-emerald-700">
                            {HEADER_I18N.business.jobsTitle[lang]}
                          </span>
                          <span className="text-[11px] text-slate-500 font-normal leading-tight block">
                            {HEADER_I18N.business.jobsDesc[lang]}
                          </span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleB2bClick('map')}
                        className="w-full flex items-start gap-2.5 p-2 rounded-xl text-left hover:bg-slate-50 transition-colors cursor-pointer group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                          <Map className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold text-slate-900 group-hover:text-indigo-700">
                              {HEADER_I18N.business.spacesMapTitle[lang]}
                            </span>
                            <span className="text-[9px] font-bold bg-indigo-100 text-indigo-800 px-1 py-0.2 rounded">
                              Ao Vivo
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 font-normal leading-tight block">
                            {HEADER_I18N.business.spacesMapDesc[lang]}
                          </span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleNavClick('partners')}
                        className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left transition-colors cursor-pointer group ${
                          activeTool === 'partners' ? 'bg-emerald-50 text-emerald-900' : 'hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold text-slate-900 group-hover:text-emerald-700">
                              {lang === 'pt' ? 'Espaço Parceiros & Patrocinadores' : 'Espace Partenaires & Commanditaires'}
                            </span>
                            <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded">
                              2026
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 font-normal leading-tight block">
                            {lang === 'pt' ? 'Cadastre sua instituição financeira ou RH' : 'Associez votre entreprise ou cabinet'}
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* 3. RIGHT UTILITIES (Clean & Minimalist - Share & Advertise buttons removed as requested) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Elegant Language Dropdown Menu (Consolidated Global SaaS Standard) */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('language')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() =>
                  setActiveDropdown(activeDropdown === 'language' ? null : 'language')
                }
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold shadow-2xs transition-all cursor-pointer ${
                  activeDropdown === 'language'
                    ? 'border-blue-300 bg-blue-50/70 text-blue-900 ring-2 ring-blue-100'
                    : 'border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700'
                }`}
                aria-expanded={activeDropdown === 'language'}
                aria-label={HEADER_I18N.languageMenu.title[lang]}
                title={HEADER_I18N.languageMenu.title[lang]}
              >
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-bold tracking-wide">
                  {currentLanguageOption.code.toUpperCase()}
                </span>
                <ChevronDown
                  className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${
                    activeDropdown === 'language' ? 'rotate-180 text-blue-600' : ''
                  }`}
                />
              </button>

              {/* Language Dropdown Popover */}
              {activeDropdown === 'language' && (
                <div className="absolute right-0 top-full pt-1.5 z-50 w-64 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="rounded-2xl bg-white border border-slate-200/90 shadow-xl p-2 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-2.5 py-1">
                      {HEADER_I18N.languageMenu.title[lang]}
                    </span>

                    {LANGUAGE_OPTIONS.map((opt) => {
                      const isSelected = lang === opt.code;
                      return (
                        <button
                          key={opt.code}
                          type="button"
                          onClick={() => {
                            onLanguageChange(opt.code);
                            setActiveDropdown(null);
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-blue-50 text-blue-900 font-semibold'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="text-base leading-none select-none">
                              {opt.flag}
                            </span>
                            <div className="min-w-0">
                              <span className="text-xs block leading-tight">
                                {opt.label}
                              </span>
                              <span className="text-[10px] text-slate-400 font-normal leading-tight block truncate">
                                {opt.sublabel}
                              </span>
                            </div>
                          </div>
                          {isSelected && (
                            <Check className="w-4 h-4 text-blue-600 shrink-0 ml-2" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Pro Upgrade CTA */}
            {!isPro && (
              <button
                type="button"
                onClick={() => handleNavClick('pro-plans')}
                className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-all shadow-xs active:scale-95 cursor-pointer"
              >
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>Carrière Pro</span>
              </button>
            )}

            {/* Admin Backoffice Quick Access */}
            <button
              type="button"
              onClick={() => handleNavClick('admin')}
              className="p-2 rounded-lg border border-transparent hover:border-slate-200 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              title="Admin Backoffice"
              aria-label="Admin Backoffice"
            >
              <Lock className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Menu Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden inline-flex items-center justify-center p-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? (lang === 'pt' ? 'Fechar o menu' : lang === 'en' ? 'Close menu' : 'Fermer le menu') : lang === 'pt' ? 'Abrir o menu' : lang === 'en' ? 'Open menu' : 'Ouvrir le menu'}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-slate-900" />
              ) : (
                <Menu className="w-5 h-5 text-slate-700" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 4. MOBILE SLIDEOUT DRAWER / SHEET */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white shadow-xl max-h-[85vh] overflow-y-auto animate-in slide-in-from-top-2 duration-150">
          <div className="p-4 space-y-4">
            {/* Mobile Language Switcher Cards */}
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 px-1">
                <Globe className="w-4 h-4 text-slate-400" />
                <span>{HEADER_I18N.languageMenu.title[lang]}</span>
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {LANGUAGE_OPTIONS.map((opt) => (
                  <button
                    key={opt.code}
                    type="button"
                    onClick={() => {
                      onLanguageChange(opt.code);
                    }}
                    className={`py-1.5 px-2 text-xs font-bold rounded-lg border flex flex-col items-center justify-center gap-0.5 transition-all ${
                      lang === opt.code
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-sm leading-none">{opt.flag}</span>
                    <span className="text-[11px]">{opt.label.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Section 1: Calculadoras */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 block">
                {HEADER_I18N.mobile.calculators[lang]}
              </span>

              <button
                type="button"
                onClick={() => handleNavClick('net-calc')}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs font-semibold ${
                  activeTool === 'net-calc' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Calculator className="w-4 h-4 text-blue-600" />
                  <span>{HEADER_I18N.calculators.netPayTitle[lang]}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('converter')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <div className="flex items-center gap-2.5">
                  <Repeat className="w-4 h-4 text-emerald-600" />
                  <span>{HEADER_I18N.calculators.converterTitle[lang]}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('raise')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <div className="flex items-center gap-2.5">
                  <TrendingUp className="w-4 h-4 text-indigo-600" />
                  <span>{HEADER_I18N.calculators.raiseTitle[lang]}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('overtime')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <div className="flex items-center gap-2.5">
                  <Timer className="w-4 h-4 text-amber-600" />
                  <span>{HEADER_I18N.calculators.overtimeTitle[lang]}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('vacation-holidays')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <div className="flex items-center gap-2.5">
                  <Palmtree className="w-4 h-4 text-teal-600" />
                  <span>{HEADER_I18N.calculators.vacationTitle[lang]}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('rrsp-savings')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <div className="flex items-center gap-2.5">
                  <PiggyBank className="w-4 h-4 text-purple-600" />
                  <span>{HEADER_I18N.calculators.rrspTitle[lang]}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('scenarios')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs font-semibold text-blue-700 bg-blue-50/50 hover:bg-blue-50"
              >
                <div className="flex items-center gap-2.5">
                  <Scale className="w-4 h-4 text-blue-600" />
                  <span>{lang === 'pt' ? 'Cenários & Estudo de Caso' : 'Scénarios & Étude de Cas'}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-blue-500" />
              </button>
            </div>

            {/* Mobile Section 2: Carreira */}
            <div className="space-y-1 pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 block">
                {HEADER_I18N.mobile.career[lang]}
              </span>

              <button
                type="button"
                onClick={() => handleNavClick('resume-builder')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <span>{HEADER_I18N.career.resumeTitle[lang]}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('interview-simulator')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <div className="flex items-center gap-2.5">
                  <Mic className="w-4 h-4 text-purple-600" />
                  <span>{HEADER_I18N.career.interviewTitle[lang]}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('tech-tests')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <div className="flex items-center gap-2.5">
                  <FileCheck2 className="w-4 h-4 text-blue-600" />
                  <span>{HEADER_I18N.career.techTestsTitle[lang]}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('pro-plans')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs font-semibold text-indigo-700 bg-indigo-50/60 hover:bg-indigo-50"
              >
                <div className="flex items-center gap-2.5">
                  <Crown className="w-4 h-4 text-amber-500" />
                  <span>{lang === 'pt' ? 'Carrière Pro & Planos' : 'Carrière Pro & Forfaits'}</span>
                </div>
                <span className="text-[10px] font-bold bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded">
                  PRO
                </span>
              </button>
            </div>

  {/* Mobile Section 3: B2B, Blog & Mapa do Site */}
  <div className="space-y-1 pt-2 border-t border-slate-100">
    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 block">
      {HEADER_I18N.mobile.resources[lang]}
    </span>

  <button
    type="button"
    onClick={() => handleNavClick('blog')}
    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs font-bold ${activeTool === 'blog' ? 'bg-blue-50 text-blue-700' : 'text-slate-800 hover:bg-slate-50'}`}
  >
    <div className="flex items-center gap-2.5">
      <BookOpen className="w-4 h-4 text-blue-600" />
      <span>{lang === 'pt' ? 'Blog profissional' : lang === 'en' ? 'Professional blog' : 'Blogue professionnel'}</span>
    </div>
    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
  </button>
  
  <button
    type="button"
    onClick={() => handleNavClick('resources')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs font-semibold text-emerald-900 bg-emerald-50/70 hover:bg-emerald-50"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>{lang === 'pt' ? 'Guias & E-books Premium' : 'Guides & E-books Premium'}</span>
                </div>
                <span className="text-[10px] font-bold bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded">
                  PRO
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('guides')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs font-semibold text-indigo-900 bg-indigo-50/70 hover:bg-indigo-50"
              >
                <div className="flex items-center gap-2.5">
                  <Download className="w-4 h-4 text-indigo-600" />
                  <span>{lang === 'pt' ? 'Biblioteca de Downloads Grátis' : 'Free Downloads Library'}</span>
                </div>
                <span className="text-[10px] font-bold bg-emerald-600 text-white px-1.5 py-0.2 rounded">
                  Gratuit
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('ebook-store')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs font-semibold text-amber-900 bg-amber-50/70 hover:bg-amber-50"
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4 text-amber-600" />
                  <span>{lang === 'pt' ? 'Guia Definitivo do Salário (140p)' : 'Guide Ultime de la Paie (140p)'}</span>
                </div>
                <span className="text-[10px] font-bold bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded">
                  $9.99
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('partners')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs font-semibold text-emerald-900 bg-emerald-50/70 hover:bg-emerald-50"
              >
                <div className="flex items-center gap-2.5">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  <span>{lang === 'pt' ? 'Espaço Parceiros & Patrocinadores' : 'Espace Partenaires'}</span>
                </div>
                <span className="text-[10px] font-bold bg-emerald-600 text-white px-1.5 py-0.2 rounded">
                  B2B
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('blog')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span>{HEADER_I18N.content.blogTitle[lang]}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('media-kit')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs font-semibold text-slate-900 bg-blue-50/70"
              >
                <div className="flex items-center gap-2.5">
                  <Megaphone className="w-4 h-4 text-blue-600" />
                  <span>{HEADER_I18N.business.mediaKitTitle[lang]}</span>
                </div>
                <span className="text-[10px] font-bold bg-blue-600 text-white px-1.5 py-0.5 rounded">
                  B2B
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('sitemap')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <div className="flex items-center gap-2.5">
                  <Map className="w-4 h-4 text-slate-600" />
                  <span>{HEADER_I18N.content.sitemapTitle[lang]}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
