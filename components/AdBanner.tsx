'use client';

import React, { useMemo, useEffect, useState, useSyncExternalStore } from 'react';
import { adminStore, AdSlotConfig } from '@/lib/admin-store';
import { normalizeUrl } from '@/lib/utils';
import {
  ExternalLink,
  ShieldCheck,
  Sparkles,
  DollarSign,
  Rocket,
  Star,
  CheckCircle2,
  TrendingUp,
  Tag,
  Eye,
  Megaphone,
  ArrowRight,
  SlidersHorizontal,
} from 'lucide-react';

export interface AdBannerProps {
  slotId?: string;
  format?: 'top-leaderboard' | 'bottom-wide' | 'rectangle' | 'sidebar' | string;
  section?: 'home-top' | 'salary-results' | 'blog-article' | 'footer-wide' | 'tools-section' | 'sidebar' | string;
  fallbackSection?: string;
  label?: string;
  className?: string;
  previewSlot?: AdSlotConfig;
  isPreviewMode?: boolean;
  onNavigateToMediaKit?: () => void;
  lang?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  slotId,
  format = 'top-leaderboard',
  section,
  fallbackSection,
  label = 'Espaço de Publicidade • Seu Anúncio Aqui',
  className = '',
  previewSlot,
  isPreviewMode = false,
  onNavigateToMediaKit,
  lang = 'fr',
}) => {
  // Sync with admin store
  const allSlots = useSyncExternalStore(
    (cb) => adminStore.subscribe(cb),
    () => adminStore.getAdSlots(),
    () => adminStore.getInitialAdSlots()
  );

  // Toggle state to let visitors/advertisers toggle between active ad example and "Seu Anúncio Aqui"
  const [showVacancyNotice, setShowVacancyNotice] = useState<boolean>(false);

  // Dynamic Rotative House Ads State based on active page/tool
  const [activeTool, setActiveTool] = useState<string>('net-calc');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleHash = () => {
        setActiveTool(window.location.hash.replace('#', '') || 'net-calc');
      };
      handleHash();
      window.addEventListener('hashchange', handleHash);
      return () => window.removeEventListener('hashchange', handleHash);
    }
  }, []);

  const houseAdsSponsor = useMemo(() => {
    if (['resume-builder', 'interview-simulator', 'tech-tests', 'pro-plans'].includes(activeTool)) {
      return {
        sponsorName: 'Pass PaieNet Carrière Pro',
        headline: lang === 'pt' ? 'Conquiste o Emprego dos Seus Sonhos no Québec' : 'Décrochez votre emploi de rêve au Québec',
        tagline: lang === 'pt' ? 'Desbloqueie simuladores de entrevista STAR, testes técnicos resolvidos e gerador de CV ATS.' : 'Débloquez les simulateurs STAR, tests corrigés et le générateur de CV ATS.',
        linkUrl: '#pro-plans',
        badgeText: lang === 'pt' ? 'Destaque Profissional' : 'Carrière Pro',
        ctaText: lang === 'pt' ? 'Desbloquear Pass Pro' : 'Débloquer le Pass Pro',
        themeGradient: 'indigo',
        iconType: 'rocket',
      };
    } else if (['media-kit', 'partners'].includes(activeTool)) {
      return {
        sponsorName: 'Vitrinas Comerciais PaieNet',
        headline: lang === 'pt' ? 'Anuncie Conosco e Alcance 48.000+ Profissionais' : 'Annoncez sur PaieNet & Touchez 48k+ professionnels',
        tagline: lang === 'pt' ? 'Garanta visibilidade premium e leads de alta conversão pós-cálculo de salário.' : 'Profitez de bannières natives ciblées et captez des leads ultra-qualifiés.',
        linkUrl: '#partners',
        badgeText: 'B2B & Patrocínios',
        ctaText: lang === 'pt' ? 'Ver Mídia Kit B2B' : 'Consulter les Lots B2B',
        themeGradient: 'dark',
        iconType: 'shield',
      };
    } else {
      return {
        sponsorName: 'Guia Definitivo do Salário no Québec 2026',
        headline: lang === 'pt' ? 'Evite Erros Fiscais e Normativos que Custam Caro' : 'Évitez les erreurs sur votre paie québécoise',
        tagline: lang === 'pt' ? '140 páginas sobre impostos Revenu Québec/ARC, CNESST, bônus de Excel e modelos de CV.' : '140 pages pour décrypter vos retenues, normes CNESST et bonus Excel.',
        linkUrl: '#monetization',
        badgeText: 'Manual Bestseller',
        ctaText: lang === 'pt' ? 'Ver soluções recomendadas' : 'Voir les solutions recommandées',
        themeGradient: 'amber',
        iconType: 'star',
      };
    }
  }, [activeTool, lang]);

  const adSlot = useMemo(() => {
    if (previewSlot) return previewSlot;
    if (slotId) return allSlots.find((s) => s.id === slotId);
    if (section) {
      const match = allSlots.find((s) => s.pageSection === section);
      if (match) return match;
      if (fallbackSection) return allSlots.find((s) => s.pageSection === fallbackSection);
    }
    return allSlots.find((s) => s.id === format || s.format === format) || null;
  }, [allSlots, slotId, section, fallbackSection, previewSlot, format]);

  const activeSponsor = useMemo(() => {
    if (isPreviewMode) return adSlot?.customSponsor;
    // House ads keep the funnel focused on PaieNet products unless a slot is previewed by an advertiser.
    return houseAdsSponsor;
  }, [isPreviewMode, adSlot, houseAdsSponsor]);

  const isInternalDestination = Boolean(activeSponsor?.linkUrl?.startsWith('#'));
  const destinationLabel = isInternalDestination ? 'Abrir conteúdo no PaieNet' : 'Abrir anúncio em nova aba';

  // Record impression on mount (only in live mode, not preview)
  useEffect(() => {
    if (!isPreviewMode && adSlot?.id && adSlot.status !== 'paused') {
      adminStore.recordAdImpression(adSlot.id);
    }
  }, [adSlot, isPreviewMode]);

  // Anchor ID for quick navigation / verification
  const anchorId =
    section === 'home-top'
      ? 'calculator-top'
      : section === 'salary-results'
      ? 'salary-results'
      : section === 'footer-wide'
      ? 'footer-sponsor'
      : section === 'blog-article' || section?.startsWith('blog-article')
      ? 'ad-slot'
      : adSlot?.id || undefined;

  const currentFormat = adSlot?.format || (format as AdSlotConfig['format']) || 'top-leaderboard';

  // Format details for public advertiser display (hook before early return)
  const lotMeta = useMemo(() => {
    switch (currentFormat) {
      case 'rectangle':
        return {
          lotName: 'Lote 4: Retângulo In-Article / Conteúdo',
          dimension: '300×250 / 336×280',
          views: '24.000+ leituras/mês',
          rate: '$240 CAD / mês',
        };
      case 'bottom-wide':
        return {
          lotName: section === 'salary-results' ? 'Lote 2: Pós-Cálculo de Holerite' : 'Lote 3: Banner Amplo de Rodapé',
          dimension: '970×90 / 640×160 Responsivo',
          views: section === 'salary-results' ? '32.000+ cálculos/mês' : '45.000+ exibições/mês',
          rate: section === 'salary-results' ? '$520 CAD / mês' : '$380 CAD / mês',
        };
      case 'sidebar':
        return {
          lotName: 'Lote 5: Sidebar de Ferramentas & Comparador',
          dimension: '300×600 Half-Page',
          views: '18.000+ sessões/mês',
          rate: '$290 CAD / mês',
        };
      case 'top-leaderboard':
      default:
        return {
          lotName: 'Lote 1: Header Leaderboard (Topo Global)',
          dimension: '728×90 / Responsivo Mobile',
          views: '48.000+ impressões/mês',
          rate: '$380 CAD / mês',
        };
    }
  }, [currentFormat, section]);

  // Live inventory is intentionally limited to high-intent placements. Product and affiliate offers live in the dedicated hub; B2B inventory remains in the business area.
  const isCuratedLivePlacement = ['home-top', 'salary-results', 'footer-wide'].includes(section || '') || ['media-kit', 'partners'].includes(activeTool);
  if (!isPreviewMode && !isCuratedLivePlacement) return null;

  // If paused and not preview mode, completely hide
  if (!isPreviewMode && (!adSlot || adSlot.status === 'paused')) {
    return null;
  }

  const handleMediaKitClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigateToMediaKit) {
      onNavigateToMediaKit();
    } else {
      const el = document.getElementById('commercial-media-kit') || document.getElementById('toolbox-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Helper for Icon rendering
  const renderIcon = (iconType?: string) => {
    switch (iconType) {
      case 'shield':
        return <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />;
      case 'dollar':
        return <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />;
      case 'rocket':
        return <Rocket className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />;
      case 'star':
        return <Star className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />;
      case 'trending':
        return <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />;
      case 'sparkles':
      default:
        return <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />;
    }
  };

  // Helper for Theme Background & Border classes
  const getThemeClasses = (gradient?: string) => {
    switch (gradient) {
      case 'emerald':
        return 'bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border-emerald-600/60 hover:border-emerald-400';
      case 'indigo':
        return 'bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border-indigo-600/60 hover:border-indigo-400';
      case 'purple':
        return 'bg-gradient-to-r from-purple-950 via-slate-900 to-fuchsia-950 border-purple-600/60 hover:border-purple-400';
      case 'amber':
        return 'bg-gradient-to-r from-amber-950 via-slate-900 to-orange-950 border-amber-600/60 hover:border-amber-400';
      case 'dark':
        return 'bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border-slate-700 hover:border-slate-500';
      case 'blue':
      default:
        return 'bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border-blue-600/60 hover:border-blue-400';
    }
  };

  const getCtaBtnClasses = (gradient?: string) => {
    switch (gradient) {
      case 'emerald':
        return 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-950/50';
      case 'indigo':
        return 'bg-indigo-500 hover:bg-indigo-400 text-white shadow-indigo-950/50';
      case 'purple':
        return 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-950/50';
      case 'amber':
        return 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-950/50';
      case 'blue':
      default:
        return 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-950/50';
    }
  };

  // If custom direct sponsor is configured AND user didn't toggle to see the vacancy notice
  if (adSlot?.status === 'custom-sponsor' && activeSponsor && !showVacancyNotice) {
    const sponsor = activeSponsor;
    const destinationUrl = normalizeUrl(sponsor.linkUrl);

    const handleSponsorClick = (e: React.MouseEvent) => {
      if (!destinationUrl) {
        e.preventDefault();
        return;
      }
      if (!isPreviewMode && adSlot.id) {
        adminStore.trackAdClick(adSlot.id);
      }
    };

    // 1. TOP LEADERBOARD FORMAT
    if (currentFormat === 'top-leaderboard') {
      return (
        <div id={anchorId} suppressHydrationWarning className={`w-full max-w-5xl mx-auto my-3 px-3 print:hidden ${className}`}>
          {/* Subtle switcher bar for demonstration */}
          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1 px-1">
            <span className="flex items-center gap-1 font-semibold text-slate-500">
              <Megaphone className="w-3 h-3 text-blue-600" />
              <span>Espaço Patrocinado Oficial • {lotMeta.lotName}</span>
            </span>
            <button
              type="button"
              onClick={() => setShowVacancyNotice(true)}
              className="text-blue-600 hover:text-blue-700 font-bold hover:underline cursor-pointer inline-flex items-center gap-1"
              title="Clique para ver o banner 'Seu Anúncio Aqui' deste lote"
            >
              <SlidersHorizontal className="w-2.5 h-2.5" />
              <span>Ver Espaço Disponível / Anuncie Aqui</span>
            </button>
          </div>

          <a
            href={destinationUrl}
            target={isInternalDestination ? undefined : '_blank'}
            rel={isInternalDestination ? undefined : 'noopener noreferrer'}
            onClick={handleSponsorClick}
            aria-label={`${sponsor.headline}. ${destinationLabel}`}
            className={`group block w-full p-3 sm:py-2.5 sm:px-5 border rounded-2xl shadow-sm transition-all text-white cursor-pointer ${getThemeClasses(
              sponsor.themeGradient
            )}`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-1.5 rounded-lg bg-white/10 shrink-0 border border-white/10">
                  {renderIcon(sponsor.iconType)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 font-bold text-[10px] uppercase border border-amber-400/30 shrink-0">
                      {sponsor.badgeText || 'Parceiro Verificado'}
                    </span>
                    <span className="font-extrabold text-white text-xs sm:text-sm group-hover:text-blue-300 transition-colors truncate">
                      {sponsor.headline}
                    </span>
                  </div>
                  {sponsor.tagline && (
                    <p className="text-slate-300 text-[11px] truncate mt-0.5 hidden sm:block">
                      {sponsor.tagline}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <span className="text-[11px] font-semibold text-slate-300 hidden md:inline">
                  {sponsor.sponsorName}
                </span>
                <span
                  className={`px-3 py-1.5 rounded-xl font-black text-xs inline-flex items-center gap-1.5 shadow-sm transition-transform group-hover:scale-[1.02] ${getCtaBtnClasses(
                    sponsor.themeGradient
                  )}`}
                >
                  <span>{sponsor.ctaText || 'Acessar Oferta'}</span>
                  <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </div>
          </a>
        </div>
      );
    }

    // 2. RECTANGLE FORMAT (Inside blog articles or split content)
    if (currentFormat === 'rectangle') {
      return (
        <div id={anchorId} suppressHydrationWarning className={`w-full max-w-md mx-auto my-5 print:hidden ${className}`}>
          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1 px-1">
            <span className="font-semibold text-slate-500">
              {lotMeta.lotName}
            </span>
            <button
              type="button"
              onClick={() => setShowVacancyNotice(true)}
              className="text-blue-600 hover:text-blue-700 font-bold hover:underline cursor-pointer inline-flex items-center gap-1"
            >
              <span>Ver Espaço / Anuncie</span>
            </button>
          </div>

          <a
            href={destinationUrl}
            target={isInternalDestination ? undefined : '_blank'}
            rel={isInternalDestination ? undefined : 'noopener noreferrer'}
            onClick={handleSponsorClick}
            aria-label={`${sponsor.headline}. ${destinationLabel}`}
            className={`group block w-full p-5 sm:p-6 border rounded-2xl shadow-sm transition-all text-white space-y-3 cursor-pointer ${getThemeClasses(
              sponsor.themeGradient
            )}`}
          >
            <div className="flex items-center justify-between text-[10px]">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold uppercase border border-blue-400/30 flex items-center gap-1">
                {renderIcon(sponsor.iconType)}
                <span>{sponsor.badgeText || 'Recomendado'}</span>
              </span>
              <span className="text-slate-400 font-medium">{sponsor.sponsorName}</span>
            </div>

            <div>
              <h5 className="font-extrabold text-sm sm:text-base text-white group-hover:text-blue-200 transition-colors leading-snug">
                {sponsor.headline}
              </h5>
              {sponsor.tagline && (
                <p className="text-xs text-slate-300 leading-relaxed mt-1">
                  {sponsor.tagline}
                </p>
              )}
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-white/10">
              <span className="text-[11px] text-slate-400 font-mono">{lotMeta.dimension}</span>
              <span
                className={`px-3 py-1.5 rounded-xl font-black text-xs inline-flex items-center gap-1.5 shadow-sm transition-transform group-hover:scale-105 ${getCtaBtnClasses(
                  sponsor.themeGradient
                )}`}
              >
                <span>{sponsor.ctaText || 'Saiba Mais'}</span>
                <ExternalLink className="w-3 h-3" />
              </span>
            </div>
          </a>
        </div>
      );
    }

    // 3. BOTTOM-WIDE / BANNER AMPLO (Default fallback for bottom-wide)
    return (
      <div id={anchorId} suppressHydrationWarning className={`w-full max-w-5xl mx-auto my-6 px-3.5 print:hidden ${className}`}>
        <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1 px-1">
          <span className="font-semibold text-slate-500">
            {lotMeta.lotName}
          </span>
          <button
            type="button"
            onClick={() => setShowVacancyNotice(true)}
            className="text-blue-600 hover:text-blue-700 font-bold hover:underline cursor-pointer inline-flex items-center gap-1"
          >
            <SlidersHorizontal className="w-2.5 h-2.5" />
            <span>Ver Espaço Disponível / Anuncie Aqui</span>
          </button>
        </div>

        <a
          href={destinationUrl}
          target={isInternalDestination ? undefined : '_blank'}
          rel={isInternalDestination ? undefined : 'noopener noreferrer'}
          onClick={handleSponsorClick}
          aria-label={`${sponsor.headline}. ${destinationLabel}`}
          className={`group block w-full p-4 sm:p-5 border rounded-2xl shadow-sm transition-all text-white cursor-pointer ${getThemeClasses(
            sponsor.themeGradient
          )}`}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 text-center sm:text-left">
              <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/15 text-white flex items-center justify-center shrink-0 shadow-xs">
                {renderIcon(sponsor.iconType)}
              </div>
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded border border-amber-400/30">
                    {sponsor.badgeText || 'Parceiro'}
                  </span>
                  <span className="text-xs text-slate-300 font-semibold">{sponsor.sponsorName}</span>
                </div>
                <h4 className="font-extrabold text-sm sm:text-base text-white group-hover:text-blue-200 transition-colors">
                  {sponsor.headline}
                </h4>
                {sponsor.tagline && (
                  <p className="text-xs text-slate-300 mt-0.5">{sponsor.tagline}</p>
                )}
              </div>
            </div>

            <div
              className={`px-4 sm:px-5 py-2.5 rounded-xl font-black text-xs flex items-center gap-1.5 shrink-0 shadow-md transition-all group-hover:scale-105 ${getCtaBtnClasses(
                sponsor.themeGradient
              )}`}
            >
              <span>{sponsor.ctaText || 'Acessar Oferta'}</span>
              <ExternalLink className="w-3 h-3" />
            </div>
          </div>
        </a>
      </div>
    );
  }

  // =========================================================================
  // HIGH-IMPACT "ESPAÇO DE PUBLICIDADE • SEU ANÚNCIO AQUI" (LOTEAMENTO NATIVO)
  // Displayed when slot is vacant, in demo/highlight mode, or toggled by visitor
  // =========================================================================

  // 1. TOP LEADERBOARD HIGHLIGHT
  if (currentFormat === 'top-leaderboard') {
    return (
      <div id={anchorId} suppressHydrationWarning className={`w-full max-w-5xl mx-auto my-3 px-3 print:hidden ${className}`}>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-2 border-dashed border-indigo-400/80 p-3 sm:py-3 sm:px-5 text-white shadow-md transition-all hover:border-indigo-300 group">
          {/* Subtle glow background */}
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs relative z-10">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/40 text-amber-300 flex items-center justify-center shrink-0">
                <Megaphone className="w-5 h-5 animate-pulse" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <span className="px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-xs">
                    Espaço de Publicidade
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 font-extrabold text-[10px] border border-blue-400/30">
                    {lotMeta.lotName}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono hidden md:inline">
                    {lotMeta.dimension}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <h4 className="font-black text-sm sm:text-base text-white tracking-tight">
                    Seu Anúncio Aqui
                  </h4>
                  <span className="text-slate-400 text-xs hidden sm:inline">
                    • Conecte sua marca a <strong className="text-emerald-400 font-bold">{lotMeta.views}</strong> de profissionais no Québec
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              {adSlot?.status === 'custom-sponsor' && (
                <button
                  type="button"
                  onClick={() => setShowVacancyNotice(false)}
                  className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 text-[11px] font-bold transition-colors cursor-pointer"
                >
                  Ver Exemplo Ativo
                </button>
              )}

              <button
                type="button"
                onClick={handleMediaKitClick}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs inline-flex items-center gap-1.5 shadow-md transition-transform group-hover:scale-105 cursor-pointer"
              >
                <span>Anuncie Aqui • Mídia Kit</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. RECTANGLE FORMAT (Inside blog articles)
  if (currentFormat === 'rectangle') {
    return (
      <div id={anchorId} suppressHydrationWarning className={`w-full max-w-md mx-auto my-5 print:hidden ${className}`}>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border-2 border-dashed border-indigo-400/70 p-5 sm:p-6 text-white shadow-md transition-all hover:border-indigo-300 space-y-3 group">
          <div className="flex items-center justify-between text-[10px]">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black uppercase tracking-wider flex items-center gap-1">
              <Megaphone className="w-3 h-3" />
              <span>Espaço de Publicidade</span>
            </span>
            <span className="text-indigo-300 font-mono">{lotMeta.dimension}</span>
          </div>

          <div>
            <h5 className="font-black text-base text-white tracking-tight flex items-center gap-2">
              <span>Seu Anúncio Aqui</span>
              <span className="text-xs font-normal text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                Disponível
              </span>
            </h5>
            <p className="text-xs text-slate-300 leading-relaxed mt-1">
              Destaque seus serviços para imigrantes, trabalhadores industriais e gestores de RH que leem os guias práticos do Québec.
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[11px] text-slate-300 flex items-center justify-between">
            <span className="text-slate-400">Alcance deste Lote:</span>
            <span className="font-extrabold text-emerald-400">{lotMeta.views}</span>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-white/10">
            {adSlot?.status === 'custom-sponsor' ? (
              <button
                type="button"
                onClick={() => setShowVacancyNotice(false)}
                className="text-[11px] text-slate-400 hover:text-slate-200 font-semibold cursor-pointer underline"
              >
                Ver Exemplo Ativo
              </button>
            ) : (
              <span className="text-[11px] font-bold text-amber-300">{lotMeta.rate}</span>
            )}

            <button
              type="button"
              onClick={handleMediaKitClick}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs inline-flex items-center gap-1.5 shadow-sm transition-transform group-hover:scale-105 cursor-pointer"
            >
              <span>Reservar Espaço</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. BOTTOM-WIDE / PÓS-CÁLCULO HIGHLIGHT
  return (
    <div id={anchorId} suppressHydrationWarning className={`w-full max-w-5xl mx-auto my-6 px-3.5 print:hidden ${className}`}>
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-2 border-dashed border-indigo-400/70 p-4 sm:p-5 text-white shadow-md transition-all hover:border-indigo-300 group">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 text-amber-300 flex items-center justify-center shrink-0 shadow-xs">
              <Megaphone className="w-6 h-6 animate-pulse" />
            </div>

            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-950 bg-amber-400 px-2 py-0.5 rounded shadow-xs">
                  Espaço de Publicidade
                </span>
                <span className="text-xs text-indigo-300 font-semibold font-mono">
                  {lotMeta.lotName} ({lotMeta.dimension})
                </span>
                <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">
                  {lotMeta.views}
                </span>
              </div>
              <h4 className="font-black text-base sm:text-lg text-white">
                Seu Anúncio Aqui • Posicionamento Nobre no Québec
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Exclusivo para cooperativas, fintechs, escritórios de imigração, recrutadores e planos de previdência REER.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {adSlot?.status === 'custom-sponsor' && (
              <button
                type="button"
                onClick={() => setShowVacancyNotice(false)}
                className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
              >
                Ver Exemplo
              </button>
            )}

            <button
              type="button"
              onClick={handleMediaKitClick}
              className="px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md transition-all group-hover:scale-105 cursor-pointer"
            >
              <span>Anuncie Aqui • Ver Mídia Kit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
