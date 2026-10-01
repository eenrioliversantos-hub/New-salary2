'use client';

import React, { useState, useMemo, useSyncExternalStore } from 'react';
import { Language } from '@/lib/i18n';
import { ToolId } from '@/components/ToolboxGrid';
import { NewsletterBox } from '@/components/NewsletterBox';
import { adminStore, BlogArticleData } from '@/lib/admin-store';
import { AdBanner } from '@/components/AdBanner';
import { normalizeUrl } from '@/lib/utils';
import { BlogEngagement } from '@/components/BlogEngagement';
import {
  BookOpen,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Clock,
  ExternalLink,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Target,
  Megaphone,
  Users,
  Building2,
  Info,
  Layers,
  Compass,
  Crown,
  Share2,
  FileCheck2,
  Calculator,
  Award,
  TrendingUp,
  FileText,
  DollarSign,
  Scale,
  Download,
  Copy,
  Check,
} from 'lucide-react';

export type Article = BlogArticleData;

interface BlogSectionProps {
  lang: Language;
  onSelectTool: (tool: ToolId) => void;
  onOpenEbookModal: () => void;
  initialArticleId?: string | null;
}

export const BlogSection: React.FC<BlogSectionProps> = ({
  lang,
  onSelectTool,
  onOpenEbookModal,
  initialArticleId,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAudience, setSelectedAudience] = useState<string>('all');
  const [activeArticleId, setActiveArticleId] = useState<string | null>(initialArticleId || null);
  const [prevInitialId, setPrevInitialId] = useState<string | null | undefined>(initialArticleId);
  const [copiedLink, setCopiedLink] = useState(false);

  const articles = useSyncExternalStore(
    (cb) => adminStore.subscribe(cb),
    () => adminStore.getArticles(),
    () => adminStore.getInitialArticles()
  );

  if (initialArticleId !== prevInitialId) {
    setPrevInitialId(initialArticleId);
    setActiveArticleId(initialArticleId || null);
  }

  const handleOpenArticle = (art: BlogArticleData) => {
    setActiveArticleId(art.id);
    adminStore.logEvent({
      type: 'article_view',
      summary: `Leitura do artigo: ${art.title[lang] || art.title.pt}`,
      location: 'Québec, Canada',
      details: `Categoria: ${art.category} | ${art.readTime}`,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyArticleLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const categories = [
    { id: 'all', label: lang === 'pt' ? 'Todos os Artigos' : lang === 'en' ? 'All Articles' : 'Tous les articles' },
    { id: 'impots', label: lang === 'pt' ? 'Salário & Impostos' : lang === 'en' ? 'Taxes & Payroll' : 'Impôts & Salaire' },
    { id: 'carriere', label: lang === 'pt' ? 'Carreira & Emprego' : lang === 'en' ? 'Career & Hiring' : 'Carrière & Embauche' },
    { id: 'finances', label: lang === 'pt' ? 'Finanças & Bancos' : lang === 'en' ? 'Finance & Banking' : 'Banques & Virements' },
    { id: 'cnesst', label: 'CNESST & Direitos' },
  ];

  const audiences = [
    { id: 'all', label: lang === 'pt' ? 'Todos os Públicos' : lang === 'en' ? 'All Audiences' : 'Tous publics' },
    { id: 'b2c_workers', label: lang === 'pt' ? '👤 Consumidores B2C' : lang === 'en' ? '👤 B2C Workers' : '👤 Salariés B2C' },
    { id: 'b2b_employers', label: lang === 'pt' ? '🏢 Empresas & RH B2B' : lang === 'en' ? '🏢 B2B Employers & HR' : '🏢 Entreprises & RH' },
    { id: 'b2c_newcomers', label: lang === 'pt' ? '✈️ Novos Imigrantes' : lang === 'en' ? '✈️ Newcomers' : '✈️ Nouveaux Arrivants' },
  ];

  const filteredArticles = useMemo(() => {
    return articles.filter((a) => {
      if (a.published === false) return false;
      const matchesCategory = selectedCategory === 'all' || a.category === selectedCategory;
      const matchesAudience = selectedAudience === 'all' || a.targetAudienceType === selectedAudience;
      return matchesCategory && matchesAudience;
    });
  }, [articles, selectedCategory, selectedAudience]);

  const activeArticle = articles.find((a) => a.id === activeArticleId);

  // Related articles resolved dynamically from relatedArticleIds or fallback to same category
  const relatedArticles = useMemo(() => {
    if (!activeArticle) return [];
    if (activeArticle.relatedArticleIds && activeArticle.relatedArticleIds.length > 0) {
      return articles.filter((a) => activeArticle.relatedArticleIds?.includes(a.id) && a.id !== activeArticle.id);
    }
    return articles.filter((a) => a.category === activeArticle.category && a.id !== activeArticle.id).slice(0, 2);
  }, [activeArticle, articles]);

  // Verified Affiliate Partners Database
  const affiliatePartners = [
    {
      id: 'wise',
      name: 'Wise Canada (Ex-TransferWise)',
      category: 'finances',
      badge: lang === 'pt' ? 'Câmbio Comercial Real' : 'Real Mid-Market Rate',
      perk: lang === 'pt' ? 'Transferência com taxa média real e 0% de spread oculto' : 'Real exchange rate with zero hidden spread',
      description: lang === 'pt' ? 'Economize até 8x em comparação aos bancos tradicionais ao enviar e receber fundos entre Brasil, Canadá e Europa.' : 'Save up to 8x compared to high-street banks when sending money internationally.',
      cta: lang === 'pt' ? 'Abrir Conta Wise Grátis' : 'Open Free Wise Account',
      url: 'https://wise.com',
    },
    {
      id: 'wealthsimple',
      name: 'Wealthsimple Québec',
      category: 'finances',
      badge: lang === 'pt' ? 'Investimento & REER' : 'RRSP & First Home Savings',
      perk: lang === 'pt' ? 'Bônus de boas-vindas e conta CELIAPP/REER sem taxa de corretagem' : 'Commission-free trading and automated RRSP portfolio',
      description: lang === 'pt' ? 'Plataforma canadense líder para investir seu salário líquido, aproveitar o teto do REER e abater impostos do Québec.' : 'Top Canadian platform to invest savings, maximize your RRSP deduction and reduce tax.',
      cta: lang === 'pt' ? 'Ver Oferta Wealthsimple' : 'View Wealthsimple Bonus',
      url: 'https://www.wealthsimple.com',
    },
    {
      id: 'desjardins',
      name: 'Desjardins Québec',
      category: 'finances',
      badge: lang === 'pt' ? 'Banco para Novos Imigrantes' : 'Newcomer Banking Package',
      perk: lang === 'pt' ? 'Cartão de crédito sem histórico canadense + conta sem tarifas por 1 ano' : 'Credit card without Canadian history + free checking account for 1 year',
      description: lang === 'pt' ? 'A maior cooperativa financeira do Québec com suporte dedicado a imigrantes recém-chegados.' : 'The leading financial group in Quebec with full onboarding assistance for newcomers.',
      cta: lang === 'pt' ? 'Consultar Pacote Desjardins' : 'Claim Desjardins Offer',
      url: 'https://www.desjardins.com',
    },
    {
      id: 'turbotax',
      name: 'TurboTax / H&R Block Canada',
      category: 'impots',
      badge: lang === 'pt' ? 'Declaração QC + Federal' : 'Double Tax Filing QC + CRA',
      perk: lang === 'pt' ? 'Otimização automática de créditos de solidariedade e abatimento de 16,5%' : 'Maximize Quebec Solidarity Tax Credit and 16.5% abatement',
      description: lang === 'pt' ? 'Software fiscal oficial para envio simultâneo à Receita Federal Canadense (CRA) e Revenu Québec sem erros.' : 'Certified Canadian tax software to ensure complete compliance and top tax refunds.',
      cta: lang === 'pt' ? 'Simular Declaração' : 'Start Tax Return',
      url: 'https://turbotax.intuit.ca',
    },
  ];

  // Visual Editorial Cover Art Renderer
  const renderArticleCoverArt = (art: BlogArticleData, isHero: boolean = false) => {
    const isTalon = art.id.includes('talon');
    const isCv = art.id.includes('cv');
    const isRemises = art.id.includes('remises') || art.category === 'finances';
    const isCnesst = art.id.includes('cnesst') || art.category === 'cnesst';
    const isEntrevue = art.id.includes('entrevue');
    const isReer = art.id.includes('reer');

    if (isTalon) {
      return (
        <div className={`w-full rounded-2xl overflow-hidden relative border border-blue-900/40 shadow-inner bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white ${isHero ? 'p-6 sm:p-8' : 'p-4 sm:p-5'}`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-blue-300 bg-blue-500/20 px-2.5 py-1 rounded-full border border-blue-400/30 flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5" />
                <span>Revenu Québec · ARC 2026</span>
              </span>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
                Barèmes Officiels
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 py-2">
              <div className="bg-slate-900/80 rounded-xl p-2.5 border border-white/5 text-center">
                <span className="text-[10px] text-slate-400 block font-medium">RRQ Base + Supp</span>
                <span className="text-xs sm:text-sm font-black text-amber-400">6,40%</span>
              </div>
              <div className="bg-slate-900/80 rounded-xl p-2.5 border border-white/5 text-center">
                <span className="text-[10px] text-slate-400 block font-medium">RQAP Parental</span>
                <span className="text-xs sm:text-sm font-black text-emerald-400">0,494%</span>
              </div>
              <div className="bg-slate-900/80 rounded-xl p-2.5 border border-white/5 text-center">
                <span className="text-[10px] text-slate-400 block font-medium">Abattement QC</span>
                <span className="text-xs sm:text-sm font-black text-blue-400">-16,5%</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-white/10">
              <span className="flex items-center gap-1 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>Fórmula Validada até o Centavo</span>
              </span>
              <span className="font-mono text-blue-300 text-[10px]">Talon de Paie</span>
            </div>
          </div>
        </div>
      );
    }

    if (isCv) {
      return (
        <div className={`w-full rounded-2xl overflow-hidden relative border border-emerald-900/40 shadow-inner bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white ${isHero ? 'p-6 sm:p-8' : 'p-4 sm:p-5'}`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-emerald-300 bg-emerald-500/20 px-2.5 py-1 rounded-full border border-emerald-400/30 flex items-center gap-1.5">
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>Normas ATS Québec 2026</span>
              </span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                ATS Score 98%
              </span>
            </div>

            <div className="bg-slate-900/80 rounded-xl p-3 border border-white/5 space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-[11px] sm:text-xs">100% Sem Foto (Conformidade com a Carta do QC)</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-[11px] sm:text-xs">Palavras-Chave Otimizadas para Triagem de RH</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-[11px] sm:text-xs">Formato Carta Canadense (8.5&quot; × 11&quot;)</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-white/10">
              <span className="text-emerald-300 font-medium">Recrutamento no Québec</span>
              <span className="text-slate-400 text-[10px]">Zero Discriminação</span>
            </div>
          </div>
        </div>
      );
    }

    if (isRemises) {
      return (
        <div className={`w-full rounded-2xl overflow-hidden relative border border-sky-900/40 shadow-inner bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 text-white ${isHero ? 'p-6 sm:p-8' : 'p-4 sm:p-5'}`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-sky-300 bg-sky-500/20 px-2.5 py-1 rounded-full border border-sky-400/30 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5" />
                <span>Wise & Bancos Canadenses</span>
              </span>
              <span className="text-[10px] font-bold text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800">
                0% Spread Oculto
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 py-1">
              <div className="bg-slate-900/80 rounded-xl p-2.5 border border-white/5 text-center">
                <span className="text-[10px] text-slate-400 block">Câmbio Comercial</span>
                <span className="text-xs sm:text-sm font-black text-sky-400">CAD ⇄ BRL / EUR</span>
              </div>
              <div className="bg-slate-900/80 rounded-xl p-2.5 border border-white/5 text-center">
                <span className="text-[10px] text-slate-400 block">Economia Média</span>
                <span className="text-xs sm:text-sm font-black text-emerald-400">Até 8x menor</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-white/10">
              <span className="text-sky-300 font-medium">Finanças para Imigrantes</span>
              <span className="text-slate-400 text-[10px]">Desjardins & Wise</span>
            </div>
          </div>
        </div>
      );
    }

    if (isCnesst) {
      return (
        <div className={`w-full rounded-2xl overflow-hidden relative border border-amber-900/40 shadow-inner bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 text-white ${isHero ? 'p-6 sm:p-8' : 'p-4 sm:p-5'}`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-amber-300 bg-amber-500/20 px-2.5 py-1 rounded-full border border-amber-400/30 flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5" />
                <span>Normes du Travail CNESST</span>
              </span>
              <span className="text-[10px] font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
                Lois du Québec
              </span>
            </div>

            <div className="bg-slate-900/80 rounded-xl p-3 border border-white/5 space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center justify-between">
                <span className="text-[11px]">Horas Extras após 40h:</span>
                <span className="font-black text-amber-400">Tempo e meio (1,5×)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px]">Indenização de Férias:</span>
                <span className="font-black text-emerald-400">4% (&lt;3 anos) / 6% (3+ anos)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px]">8 Feriados Remunerados:</span>
                <span className="font-black text-sky-400">Regra de 1/20 dos ganhos</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-white/10">
              <span className="text-amber-300 font-medium">Direitos do Trabalhador</span>
              <span className="text-slate-400 text-[10px]">Proteção CNESST</span>
            </div>
          </div>
        </div>
      );
    }

    if (isEntrevue) {
      return (
        <div className={`w-full rounded-2xl overflow-hidden relative border border-purple-900/40 shadow-inner bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950 text-white ${isHero ? 'p-6 sm:p-8' : 'p-4 sm:p-5'}`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-purple-300 bg-purple-500/20 px-2.5 py-1 rounded-full border border-purple-400/30 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                <span>Método STAR para Entrevistas</span>
              </span>
              <span className="text-[10px] font-bold text-purple-400 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-800">
                Padrão Norte-Americano
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1.5 text-center py-1">
              <div className="bg-slate-900/80 rounded-lg p-2 border border-white/5">
                <span className="text-purple-400 font-black text-xs sm:text-sm block">S</span>
                <span className="text-[9px] text-slate-400">Situation</span>
              </div>
              <div className="bg-slate-900/80 rounded-lg p-2 border border-white/5">
                <span className="text-purple-400 font-black text-xs sm:text-sm block">T</span>
                <span className="text-[9px] text-slate-400">Tâche</span>
              </div>
              <div className="bg-slate-900/80 rounded-lg p-2 border border-white/5">
                <span className="text-purple-400 font-black text-xs sm:text-sm block">A</span>
                <span className="text-[9px] text-slate-400">Action</span>
              </div>
              <div className="bg-slate-900/80 rounded-lg p-2 border border-white/5">
                <span className="text-purple-400 font-black text-xs sm:text-sm block">R</span>
                <span className="text-[9px] text-slate-400">Résultat</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-white/10">
              <span className="text-purple-300 font-medium">Entrevistas Comportamentais</span>
              <span className="text-slate-400 text-[10px]">Resultados Mensuráveis</span>
            </div>
          </div>
        </div>
      );
    }

    if (isReer) {
      return (
        <div className={`w-full rounded-2xl overflow-hidden relative border border-rose-900/40 shadow-inner bg-gradient-to-br from-slate-950 via-slate-900 to-rose-950 text-white ${isHero ? 'p-6 sm:p-8' : 'p-4 sm:p-5'}`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-rose-300 bg-rose-500/20 px-2.5 py-1 rounded-full border border-rose-400/30 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>REER & CELIAPP Québec</span>
              </span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                Restituição Fiscal
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 py-1">
              <div className="bg-slate-900/80 rounded-xl p-2.5 border border-white/5 text-center">
                <span className="text-[10px] text-slate-400 block">Match Empregador</span>
                <span className="text-xs sm:text-sm font-black text-emerald-400">Até 100% Grátis</span>
              </div>
              <div className="bg-slate-900/80 rounded-xl p-2.5 border border-white/5 text-center">
                <span className="text-[10px] text-slate-400 block">Abatimento Imediato</span>
                <span className="text-xs sm:text-sm font-black text-rose-400">Redução de Escalão</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-white/10">
              <span className="text-rose-300 font-medium">Economia de Impostos</span>
              <span className="text-slate-400 text-[10px]">Aposentadoria & Imóvel</span>
            </div>
          </div>
        </div>
      );
    }

    // Default Fallback Cover Art
    return (
      <div className={`w-full rounded-2xl overflow-hidden relative border border-indigo-900/40 shadow-inner bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white ${isHero ? 'p-6 sm:p-8' : 'p-4 sm:p-5'}`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-indigo-300 bg-indigo-500/20 px-2.5 py-1 rounded-full border border-indigo-400/30 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Guia Prático do Québec</span>
            </span>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
              Edição 2026
            </span>
          </div>

          <div className="bg-slate-900/80 rounded-xl p-3 border border-white/5 text-xs text-slate-300">
            <span className="block font-bold text-white mb-1">Informações Confiáveis & Auditadas</span>
            <span className="text-[11px] text-slate-400">Análise detalhada para maximizar seus ganhos e direitos trabalhistas.</span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-white/10">
            <span className="text-indigo-300 font-medium">Equipe PaieNet.qc</span>
            <span className="text-slate-400 text-[10px]">Revisão Contábil</span>
          </div>
        </div>
      </div>
    );
  };

  // Enhanced Paragraph Renderer with Bullet Support and Internal Link Buttons
  const renderParagraphWithLinks = (text: string) => {
    const isBullet = text.startsWith('•') || text.startsWith('-');
    const cleanText = isBullet ? text.replace(/^[•-]\s*/, '') : text;

    const linkRegex = /\[([^\]]+)\]\(#([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(cleanText)) !== null) {
      const matchIndex = match.index;
      if (matchIndex > lastIndex) {
        parts.push(cleanText.substring(lastIndex, matchIndex));
      }

      const linkText = match[1];
      const targetHash = match[2] as ToolId;

      parts.push(
        <button
          key={`link-${matchIndex}`}
          type="button"
          onClick={() => {
            onSelectTool(targetHash);
            window.scrollTo({ top: 120, behavior: 'smooth' });
          }}
          className="text-blue-600 hover:text-blue-800 font-extrabold underline cursor-pointer inline bg-transparent p-0 m-0 border-none align-baseline text-xs sm:text-sm transition-colors"
        >
          {linkText}
        </button>
      );

      lastIndex = linkRegex.lastIndex;
    }

    if (lastIndex < cleanText.length) {
      parts.push(cleanText.substring(lastIndex));
    }

    const content = parts.length > 0 ? parts : cleanText;

    if (isBullet) {
      return (
        <div className="flex items-start gap-2.5 my-1.5 pl-2">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0" />
          <span className="leading-relaxed">{content}</span>
        </div>
      );
    }

    return content;
  };

  return (
    <div className="space-y-8">
      {/* If an article is selected, display Enhanced Article Reader */}
      {activeArticle ? (
        <article className="space-y-6 animate-in fade-in duration-200">
          {/* Back Navigation Bar & Share Actions */}
          <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <button
              type="button"
              onClick={() => setActiveArticleId(null)}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold transition-colors cursor-pointer active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>
                {lang === 'pt'
                  ? '← Voltar a Todos os Artigos'
                  : lang === 'en'
                  ? '← Back to All Articles'
                  : '← Retour aux articles'}
              </span>
            </button>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>{activeArticle.readTime}</span>
              </span>

              <button
                type="button"
                onClick={handleCopyArticleLink}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold transition-all cursor-pointer"
                title="Copiar link do artigo"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? (lang === 'pt' ? 'Copiado!' : 'Copié !') : (lang === 'pt' ? 'Compartilhar' : 'Partager')}</span>
              </button>
            </div>
          </div>

          {/* ============================================================== */}
          {/* MONETIZATION ZONE 1: HEADER IN-ARTICLE AD BANNER (LOTE 4A)      */}
          {/* ============================================================== */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 px-1">
              <span className="flex items-center gap-1 text-indigo-600">
                <Megaphone className="w-3.5 h-3.5" />
                <span>Espaço de Publicidade • Topo do Artigo (Lote 4A)</span>
              </span>
              <button
                type="button"
                onClick={() => onSelectTool('media-kit')}
                className="text-blue-600 hover:underline cursor-pointer"
              >
                Anuncie neste Artigo
              </button>
            </div>
            <AdBanner
              section={`blog-article-${activeArticle.id}`}
              fallbackSection="blog-article"
              format="top-leaderboard"
              onNavigateToMediaKit={() => onSelectTool('media-kit')}
            />
          </div>

          {/* Article Header & Visual Cover Art */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            {/* Visual Cover Art Canvas */}
            {renderArticleCoverArt(activeArticle, true)}

            {/* Category and Date row */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-extrabold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                {categories.find((c) => c.id === activeArticle.category)?.label || 'Guia'}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-semibold">{activeArticle.date}</span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Revisão Contábil 2026</span>
              </span>
            </div>

            {/* Target Audience & Communication Tone Badges */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block leading-tight">Público-Alvo</span>
                  <span className="font-bold text-slate-800 text-[11px] sm:text-xs">
                    {activeArticle.targetAudienceLabel?.[lang] || activeArticle.targetAudienceLabel?.pt || (activeArticle.targetAudienceType === 'b2b_employers' ? 'Empresas & RH B2B' : 'Consumidores B2C')}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block leading-tight">Tom Editorial</span>
                  <span className="font-bold text-slate-800 text-[11px] sm:text-xs">
                    {activeArticle.communicationTone?.[lang] || activeArticle.communicationTone?.pt || 'Didático, Acolhedor & Prático'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block leading-tight">Funil de Intenção</span>
                  <span className="font-bold text-slate-800 text-[11px] sm:text-xs">
                    {activeArticle.funnelStage === 'fundo'
                      ? 'Fundo de Funil (Ação & Conversão)'
                      : activeArticle.funnelStage === 'meio'
                      ? 'Meio de Funil (Consideração Técnica)'
                      : 'Topo de Funil (Educação & Atração)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Author Credibility (E-E-A-T) Box */}
            <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                  JP
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-slate-900">Jean-Philippe Beaulieu, CPA auditeur</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <span className="text-[11px] text-slate-500 block">
                    Pôle d’Expertise Comptable & Fiscale PaieNet.qc · Membre de l’Ordre des CPA
                  </span>
                </div>
              </div>
              <div className="text-[11px] text-slate-500 sm:text-right font-medium">
                Conforme aux barèmes ARC & Revenu Québec 2026
              </div>
            </div>

            {/* Title & Excerpt */}
            <div className="space-y-3">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                {activeArticle.title[lang] || activeArticle.title.pt}
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium pb-4 border-b border-slate-100">
                {activeArticle.excerpt[lang] || activeArticle.excerpt.pt}
              </p>
            </div>

            {/* Key Takeaways Box (Executive Summary) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-300/80 space-y-2.5">
              <div className="flex items-center gap-2 text-amber-900 font-extrabold text-xs sm:text-sm">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>
                  {lang === 'pt' ? '📋 Destaques Práticos & O Que Você Vai Aprender:' : '📋 Points Clés & Synthèse Pratique :'}
                </span>
              </div>
              <ul className="text-xs sm:text-sm text-slate-800 space-y-1.5 list-disc list-inside">
                <li>
                  {lang === 'pt'
                    ? 'Aplicação exata das retenções no holerite (RRQ, RQAP, Seguro-Desemprego AE e Impostos).'
                    : 'Application exacte des déductions sur le talon de paie (RRQ, RQAP, AE et impôts).'}
                </li>
                <li>
                  {lang === 'pt'
                    ? 'Como não perder o desconto federal de 16,5% exclusivo para residentes tributários no Québec.'
                    : 'Comment bénéficier de l’abattement fédéral de 16,5 % propre aux résidents du Québec.'}
                </li>
                <li>
                  {lang === 'pt'
                    ? 'Soluções e ferramentas práticas no portal para simular seu caso sem erros de contabilidade.'
                    : 'Solutions et simulateurs gratuits disponibles sur le portail pour calculer vos droits.'}
                </li>
              </ul>
            </div>

            {/* Article Content Paragraphs */}
            <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-800 leading-relaxed space-y-4 pt-2">
              {(activeArticle.content[lang] || activeArticle.content.pt || []).map((paragraph, idx) => (
                <div key={idx} className="leading-relaxed">
                  {renderParagraphWithLinks(paragraph)}
                </div>
              ))}
            </div>

            {/* Interactive Internal Tools Strip */}
            <div className="p-5 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-3.5 mt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-blue-400" />
                  <span className="font-extrabold text-xs sm:text-sm">
                    {lang === 'pt' ? '⚡ Ferramentas Oficiais Recomendadas no PaieNet:' : '⚡ Outils Officiels Recommandés :'}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded">
                  100% Gratuito
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    onSelectTool('net-calc');
                    window.scrollTo({ top: 100, behavior: 'smooth' });
                  }}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-blue-600 transition-colors text-left group cursor-pointer"
                >
                  <span className="font-bold block text-white group-hover:text-white">Salário Líquido</span>
                  <span className="text-[10px] text-slate-400 group-hover:text-blue-100">Cálculo oficial</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onSelectTool('overtime');
                    window.scrollTo({ top: 100, behavior: 'smooth' });
                  }}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-amber-600 transition-colors text-left group cursor-pointer"
                >
                  <span className="font-bold block text-white group-hover:text-white">Horas Extras</span>
                  <span className="text-[10px] text-slate-400 group-hover:text-amber-100">1.5× CNESST</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onSelectTool('canada-provinces');
                    window.scrollTo({ top: 100, behavior: 'smooth' });
                  }}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-indigo-600 transition-colors text-left group cursor-pointer"
                >
                  <span className="font-bold block text-white group-hover:text-white">13 Províncias</span>
                  <span className="text-[10px] text-slate-400 group-hover:text-indigo-100">Comparativo</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onSelectTool('resume-builder');
                    window.scrollTo({ top: 100, behavior: 'smooth' });
                  }}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-emerald-600 transition-colors text-left group cursor-pointer"
                >
                  <span className="font-bold block text-white group-hover:text-white">Gerador de CV</span>
                  <span className="text-[10px] text-slate-400 group-hover:text-emerald-100">ATS Canadá</span>
                </button>
              </div>
            </div>

            {/* ============================================================== */}
            {/* MONETIZATION ZONE 2: CONTEXTUAL CALL-TO-ACTION (CTA TOOL)      */}
            {/* ============================================================== */}
            {activeArticle.ctaTool && (
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                <div className="space-y-1 text-center sm:text-left">
                  <span className="text-[11px] font-extrabold text-blue-700 uppercase tracking-wider block flex items-center gap-1.5 justify-center sm:justify-start">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>
                      {lang === 'pt'
                        ? '⚡ Ferramenta Prática Recomendada para este Caso:'
                        : lang === 'en'
                        ? '⚡ Recommended Practical Tool for this Need:'
                        : '⚡ Outil pratique recommandé pour ce sujet :'}
                    </span>
                  </span>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900">
                    {activeArticle.ctaToolLabel[lang] || activeArticle.ctaToolLabel.pt}
                  </h4>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (activeArticle.ctaTool) onSelectTool(activeArticle.ctaTool);
                    window.scrollTo({ top: 100, behavior: 'smooth' });
                  }}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm shadow-sm transition-all cursor-pointer flex items-center gap-2 shrink-0 active:scale-95"
                >
                  <span>
                    {lang === 'pt'
                      ? 'Abrir Ferramenta Grátis'
                      : lang === 'en'
                      ? 'Open Free Tool'
                      : 'Lancer l’outil gratuit'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* ============================================================== */}
            {/* MONETIZATION ZONE 3: MID-ARTICLE AD BANNER (LOTE 4B - 300×250) */}
            {/* ============================================================== */}
            <div className="my-6 pt-4 border-t border-slate-100 space-y-1">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 px-1">
                <span className="flex items-center gap-1 text-indigo-600">
                  <Megaphone className="w-3.5 h-3.5" />
                  <span>Espaço de Publicidade • Meio do Conteúdo (Lote 4B - 300×250)</span>
                </span>
                <button
                  type="button"
                  onClick={() => onSelectTool('media-kit')}
                  className="text-blue-600 hover:underline cursor-pointer"
                >
                  Reservar este Lote
                </button>
              </div>
              <AdBanner
                section={`blog-article-${activeArticle.id}-mid`}
                fallbackSection="blog-article"
                format="rectangle"
                onNavigateToMediaKit={() => onSelectTool('media-kit')}
              />
            </div>

            {/* ============================================================== */}
            {/* MONETIZATION ZONE 4: VERIFIED AFFILIATE PARTNER COMPARISON     */}
            {/* ============================================================== */}
            <div className="space-y-4 mt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-black text-slate-900">
                      {lang === 'pt' ? 'Soluções e Serviços Parceiros Auditados no Québec' : 'Partenaires & Services Recommandés au Québec'}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Instituições financeiras e plataformas selecionadas com benefícios exclusivos
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded">
                  Auditado 2026
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {affiliatePartners.map((partner) => (
                  <div
                    key={partner.id}
                    className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {partner.badge}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Parceiro Oficial</span>
                        </span>
                      </div>

                      <h5 className="font-extrabold text-slate-900 text-xs sm:text-sm">
                        {partner.name}
                      </h5>

                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        {partner.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-emerald-600">
                        {partner.perk}
                      </span>
                      <a
                        href={normalizeUrl(partner.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => adminStore.trackAffiliateClick(partner.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-colors"
                      >
                        <span>{partner.cta}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* FTC & Google AdSense Required Affiliate Disclosure */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 leading-relaxed flex items-start gap-2">
                <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Transparência Editorial (Conformidade AdSense & FTC):</strong> Este artigo contém links de parceiros comerciais auditados. Se você contratar através destes links, o PaieNet poderá receber uma comissão sem custo adicional para você. Nossa independência técnica de cálculo permanece 100% inalterada.
                </span>
              </div>
            </div>

            {/* ============================================================== */}
            {/* MONETIZATION ZONE 5: SMART RECOMMENDATION BOX (INTENT-BASED)   */}
            {/* ============================================================== */}
            {(activeArticle.category === 'impots' || activeArticle.category === 'finances') ? (
              <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-400/15 to-blue-50 border border-amber-300 flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-xs font-black">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 block">
                      {lang === 'pt' ? 'Recomendação de Leitura Aprofundada' : 'Recommandation de Lecture'}
                    </span>
                    <h5 className="font-extrabold text-sm sm:text-base text-slate-900">
                      {lang === 'pt' ? 'Guia Definitivo do Salário & Deduções no Québec (140p)' : 'Guide Ultime de la Paie & Déductions au Québec (140p)'}
                    </h5>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {lang === 'pt'
                        ? 'Manual passo a passo sobre impostos provinciais/federais, bônus de Excel e modelos de orçamento.'
                        : 'Manuel complet pour maîtriser vos impôts, déductions et droits de travail.'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onOpenEbookModal}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs whitespace-nowrap shadow-sm transition-all cursor-pointer flex items-center gap-2 active:scale-95"
                >
                  <CreditCard className="w-3.5 h-3.5 text-amber-300" />
                  <span>{lang === 'pt' ? 'Comprar E-book ($9.99)' : lang === 'en' ? 'Buy E-book ($9.99)' : 'Acheter l’E-book (9,99 $)'}</span>
                </button>
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-400/15 to-blue-50 border border-indigo-300 flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs font-black">
                    <Crown className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-900 block">
                      {lang === 'pt'
                        ? 'Aceleração Profissional Recomendada'
                        : lang === 'en'
                        ? 'Recommended Professional Path'
                        : 'Accélération Professionnelle Recommandée'}
                    </span>
                    <h5 className="font-extrabold text-sm sm:text-base text-slate-900">
                      {lang === 'pt'
                        ? 'Pass Carrière Pro: Desbloqueie todas as ferramentas'
                        : lang === 'en'
                        ? 'Pass Carrière Pro: Unlock all screening prep'
                        : 'Pass Carrière Pro : Débloquez tous les simulateurs'}
                    </h5>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {lang === 'pt'
                        ? 'Acesso vitalício ilimitado a CVs ATS, simulador STAR e testes técnicos por $12.99 CAD.'
                        : lang === 'en'
                        ? 'Lifetime access to ATS resumes, STAR interview simulators and tests for $12.99 CAD.'
                        : 'Accès à vie aux CVs ATS, simulateur STAR et tests techniques pour 12,99 $.'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectTool('pro-plans')}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs whitespace-nowrap shadow-sm transition-all cursor-pointer flex items-center gap-2 active:scale-95"
                >
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  <span>{lang === 'pt' ? 'Desbloquear Pass Pro' : lang === 'en' ? 'Get Pass Pro' : 'Activer le Pass Pro'}</span>
                </button>
              </div>
            )}
          </div>

          <BlogEngagement articleId={activeArticle.id} title={activeArticle.title[lang] || activeArticle.title.pt} />

          {/* ============================================================== */}
          {/* RETENÇÃO SEO & INTERNAL LINKING: ARTIGOS RELACIONADOS          */}
          {/* ============================================================== */}
          {relatedArticles.length > 0 && (
            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-sm sm:text-base">
                      {lang === 'pt' ? 'Artigos Relacionados & Retenção de Leitura' : 'Articles Connexes & En Savoir Plus'}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Aprofunde seus conhecimentos fiscais e trabalhistas no mercado do Québec
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-blue-600 hidden sm:inline">
                  SEO Internal Equity
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {relatedArticles.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => handleOpenArticle(rel)}
                    className="p-4 rounded-2xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200 hover:border-blue-300 transition-all cursor-pointer group flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-extrabold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-md">
                          {categories.find((c) => c.id === rel.category)?.label || 'Guia'}
                        </span>
                        <span className="text-slate-400 flex items-center gap-1 font-semibold">
                          <Clock className="w-3 h-3" />
                          <span>{rel.readTime}</span>
                        </span>
                      </div>

                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {rel.title[lang] || rel.title.pt}
                      </h4>

                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                        {rel.excerpt[lang] || rel.excerpt.pt}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:text-blue-700">
                      <span>Ler este artigo</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* MONETIZATION ZONE 6: FOOTER AD BANNER (LOTE 4C)                */}
          {/* ============================================================== */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 px-1">
              <span className="flex items-center gap-1 text-emerald-600">
                <Megaphone className="w-3.5 h-3.5" />
                <span>Espaço de Publicidade • Rodapé do Artigo (Lote 4C - 970×90)</span>
              </span>
              <button
                type="button"
                onClick={() => onSelectTool('media-kit')}
                className="text-blue-600 hover:underline cursor-pointer"
              >
                Mídia Kit
              </button>
            </div>
            <AdBanner
              section="footer-wide"
              fallbackSection="salary-results"
              format="bottom-wide"
              onNavigateToMediaKit={() => onSelectTool('media-kit')}
            />
          </div>

          {/* Newsletter Box at the end of article */}
          <div className="mt-8">
            <NewsletterBox lang={lang} variant="card" />
          </div>
        </article>
      ) : (
        /* ============================================================== */
        /* BLOG INDEX / SHOWCASE VIEW                                     */
        /* ============================================================== */
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-white p-5 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0 shadow-xs">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold border border-blue-200 mb-1.5">
                    <Sparkles className="w-3 h-3 text-blue-600" />
                    <span>
                      {lang === 'pt'
                        ? 'Blog & Guias Práticos do Québec 2026'
                        : lang === 'en'
                        ? 'Quebec Practical Guides & Blog 2026'
                        : 'Blog & Guides Pratiques 2026'}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {lang === 'pt'
                      ? 'Tudo sobre Salário, Impostos, Leis e Carreira no Québec'
                      : lang === 'en'
                      ? 'Everything About Payroll, Taxes & Career in Quebec'
                      : 'Tout comprendre sur la paie, les impôts et l’emploi au Québec'}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                    {lang === 'pt'
                      ? 'Artigos práticos explicando cada desconto do holerite, normas da CNESST, formato canadense de currículo, remessas e soluções mapeadas para a sua necessidade.'
                      : lang === 'en'
                      ? 'Clear and rigorous guides breaking down paystub deductions, CNESST labor laws, ATS-friendly resumes, and banking tips.'
                      : 'Guides clairs et rigoureux pour décrypter votre talon de paie, comprendre vos droits CNESST et réussir votre embauche au Québec.'}
                  </p>
                </div>
              </div>

              {/* Direct E-book Banner Action */}
              <button
                type="button"
                onClick={onOpenEbookModal}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs sm:text-sm shadow-sm transition-all cursor-pointer whitespace-nowrap active:scale-95 shrink-0 self-start md:self-center"
              >
                <BookOpen className="w-4 h-4" />
                <span>{lang === 'pt' ? 'E-book Oficial (140p)' : lang === 'en' ? 'Official Guide (140p)' : 'Guide E-book (140p)'}</span>
                <span className="px-1.5 py-0.2 bg-slate-950 text-amber-300 text-[10px] rounded font-bold">
                  $9.99 CAD
                </span>
              </button>
            </div>

            {/* Filter Rows: Categories & Audiences */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              {/* Category Pills */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Categoria:</span>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Audience Filter Pills */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Público-Alvo:</span>
                {audiences.map((aud) => (
                  <button
                    key={aud.id}
                    type="button"
                    onClick={() => setSelectedAudience(aud.id)}
                    className={`px-3 py-1 text-xs font-semibold rounded-xl transition-all cursor-pointer border ${
                      selectedAudience === aud.id
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {aud.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Mapped Blog Showcase Ad Banner with Prominent "Espaço de Publicidade" */}
          <div id="blog-showcase" className="mb-4">
            <AdBanner
              section="blog-index"
              fallbackSection="home-top"
              format="top-leaderboard"
              onNavigateToMediaKit={() => onSelectTool('media-kit')}
            />
          </div>

          {/* Articles Grid with Visual Cover Art */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {filteredArticles.map((art) => (
              <div
                key={art.id}
                onClick={() => handleOpenArticle(art)}
                className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 hover:border-blue-400 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group overflow-hidden"
              >
                <div className="space-y-3.5">
                  {/* Visual Editorial Graphic for each card */}
                  {renderArticleCoverArt(art, false)}

                  <div className="flex items-center justify-between text-xs flex-wrap gap-2 pt-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-extrabold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/80">
                        {categories.find((c) => c.id === art.category)?.label || 'Guia'}
                      </span>
                      {art.targetAudienceType && (
                        <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                          {art.targetAudienceType === 'b2b_employers'
                            ? '🏢 B2B Empresas'
                            : art.targetAudienceType === 'b2c_newcomers'
                            ? '✈️ Novos Imigrantes'
                            : '👤 Consumidores B2C'}
                        </span>
                      )}
                    </div>

                    <span className="text-slate-400 font-medium flex items-center gap-1 text-[11px]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{art.readTime}</span>
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                    {art.title[lang] || art.title.pt}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                    {art.excerpt[lang] || art.excerpt.pt}
                  </p>

                  {/* Communication tone & verification tag */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span className="text-purple-700 font-semibold truncate max-w-[200px]">
                      🎙️ {art.communicationTone?.[lang] || art.communicationTone?.pt || 'Prático'}
                    </span>
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Auditado</span>
                    </span>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:text-blue-700">
                  <span>
                    {lang === 'pt' ? 'Ler artigo completo & ver recursos' : lang === 'en' ? 'Read full article' : 'Lire l’article complet'}
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>

          {/* Newsletter Box */}
          <div className="pt-4">
            <NewsletterBox lang={lang} variant="banner" />
          </div>
        </div>
      )}
    </div>
  );
};
