'use client';

import React, { useState, useMemo, useSyncExternalStore } from 'react';
import { Language } from '@/lib/i18n';
import { ToolId } from '@/components/ToolboxGrid';
import { NewsletterBox } from '@/components/NewsletterBox';
import { adminStore, BlogArticleData } from '@/lib/admin-store';
import { AdBanner } from '@/components/AdBanner';
import { normalizeUrl } from '@/lib/utils';
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

  const renderParagraphWithLinks = (text: string) => {
    const linkRegex = /\[([^\]]+)\]\(#([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      const matchIndex = match.index;
      if (matchIndex > lastIndex) {
        parts.push(text.substring(lastIndex, matchIndex));
      }
      
      const linkText = match[1];
      const targetHash = match[2] as ToolId;

      parts.push(
        <button
          key={matchIndex}
          type="button"
          onClick={() => {
            onSelectTool(targetHash);
            window.scrollTo({ top: 120, behavior: 'smooth' });
          }}
          className="text-blue-600 hover:text-blue-700 font-extrabold hover:underline cursor-pointer inline bg-transparent p-0 m-0 border-none align-baseline text-xs sm:text-sm"
        >
          {linkText}
        </button>
      );

      lastIndex = linkRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  return (
    <div className="space-y-8">
      {/* If an article is selected, display Enhanced Article Reader */}
      {activeArticle ? (
        <article className="space-y-6 animate-in fade-in duration-200">
          {/* Back Navigation Bar */}
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

            <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>{activeArticle.readTime}</span>
            </span>
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

          {/* Article Header & Strategic Metadata Strip */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-5">
            {/* Category and Date row */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-extrabold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                {categories.find((c) => c.id === activeArticle.category)?.label || 'Guia'}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500">{activeArticle.date}</span>
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

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              {activeArticle.title[lang] || activeArticle.title.pt}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium pb-4 border-b border-slate-100">
              {activeArticle.excerpt[lang] || activeArticle.excerpt.pt}
            </p>

            {/* Article Content Paragraphs */}
            <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-800 leading-relaxed space-y-4 pt-2">
              {(activeArticle.content[lang] || activeArticle.content.pt || []).map((paragraph, idx) => (
                <p key={idx} className="leading-relaxed">
                  {renderParagraphWithLinks(paragraph)}
                </p>
              ))}
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
            {/* MONETIZATION ZONE 4: AFFILIATE PARTNER BOX & FTC DISCLOSURE    */}
            {/* ============================================================== */}
            {activeArticle.affiliateOffer && (
              <div className="space-y-2 mt-4">
                <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                      {activeArticle.affiliateOffer.badge[lang] || activeArticle.affiliateOffer.badge.pt}
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{lang === 'pt' ? 'Parceiro Verificado PaieNet' : 'Partenaire Vérifié PaieNet'}</span>
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base sm:text-lg font-black text-white">
                      {activeArticle.affiliateOffer.offerTitle[lang] || activeArticle.affiliateOffer.offerTitle.pt}
                    </h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {activeArticle.affiliateOffer.offerDescription[lang] || activeArticle.affiliateOffer.offerDescription.pt}
                    </p>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10">
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{activeArticle.affiliateOffer.partnerName}</span>
                    </div>

                    <a
                      href={normalizeUrl(activeArticle.affiliateOffer.externalUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        if (activeArticle.affiliateOffer?.partnerId) {
                          adminStore.trackAffiliateClick(activeArticle.affiliateOffer.partnerId);
                        }
                      }}
                      className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                      <span>{activeArticle.affiliateOffer.ctaText[lang] || activeArticle.affiliateOffer.ctaText.pt}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* FTC & Google AdSense Required Affiliate Disclosure */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 leading-relaxed flex items-start gap-2">
                  <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Transparência Editorial (Conformidade AdSense & FTC):</strong> Este artigo contém links de parceiros comerciais auditados. Se você contratar através destes links, o PaieNet poderá receber uma comissão sem custo adicional para você. Nossa independência técnica de cálculo permanece 100% inalterada.
                  </span>
                </div>
              </div>
            )}

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
                      {lang === 'pt'
                        ? 'Livro Digital Completo Recomendado'
                        : lang === 'en'
                        ? 'Official Recommended Guide'
                        : 'Guide Complet Recommandé'}
                    </span>
                    <h5 className="font-extrabold text-sm sm:text-base text-slate-900">
                      {lang === 'pt'
                        ? 'Guia Definitivo do Salário & Emprego no Québec (140p)'
                        : lang === 'en'
                        ? 'Ultimate Guide to Quebec Payroll & Employment (140p)'
                        : 'Guide Ultime de la Paie & de l’Emploi au Québec (140p)'}
                    </h5>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {lang === 'pt'
                        ? 'Apenas $9.99 CAD com garantia de 30 dias, modelos de CV e perguntas de entrevista.'
                        : lang === 'en'
                        ? 'Only $9.99 CAD with 30-day money back guarantee and ready templates.'
                        : 'Seulement 9,99 $ CAD avec modèles de CV et questions d’entrevue.'}
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
                    className="p-4 rounded-2xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200 hover:border-blue-300 transition-all cursor-pointer group flex flex-col justify-between"
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

                    <div className="pt-3 mt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:text-blue-700">
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

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {filteredArticles.map((art) => (
              <div
                key={art.id}
                onClick={() => handleOpenArticle(art)}
                className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 hover:border-blue-400 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs flex-wrap gap-2">
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

                  {/* Communication tone tag */}
                  {art.communicationTone && (
                    <div className="pt-1 flex items-center gap-1 text-[11px] text-purple-700 font-medium">
                      <span>🎙️ Tom:</span>
                      <span className="truncate">{art.communicationTone[lang] || art.communicationTone.pt}</span>
                    </div>
                  )}
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
