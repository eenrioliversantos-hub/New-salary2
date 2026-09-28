'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  adminStore,
  BlogArticleData,
  ArticleTemplate,
  AffiliatePartner,
  AdSlotConfig,
  EbookConfig,
  EbookOrder,
  DigitalAsset,
  CareerPassPackage,
  CareerPassOrder,
  B2BJobPosting,
  NewsletterLead,
  LiveActivityEvent,
  B2BSponsorInquiry,
} from '@/lib/admin-store';
import { Language } from '@/lib/i18n';
import { ToolId } from '@/components/ToolboxGrid';
import { DigitalAssetsAdmin } from '@/components/DigitalAssetsAdmin';
import { LeadsCrmAdmin } from '@/components/LeadsCrmAdmin';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import {
  Lock,
  Unlock,
  ShieldCheck,
  LayoutDashboard,
  FileText,
  Link2,
  Megaphone,
  BookOpen,
  Mail,
  Settings,
  Plus,
  Edit2,
  Trash2,
  Eye,
  ExternalLink,
  Download,
  Upload,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  DollarSign,
  Users,
  MousePointerClick,
  Sparkles,
  ArrowLeft,
  X,
  Save,
  Check,
  Tag,
  KeyRound,
  ShieldAlert,
  ArrowUpRight,
  Copy,
  Layers,
  Calculator,
  Clock,
  CreditCard,
  Monitor,
  Smartphone,
  Tablet,
  Play,
  Pause,
  MapPin,
  RotateCcw,
  Globe,
  Palette,
  CheckCircle,
  ArrowRight,
  Menu,
  Radar,
  Target,
  Building2,
  ChevronDown,
  ChevronUp,
  Calendar,
  Briefcase,
  GraduationCap,
  Scale,
  Receipt,
  Zap,
  FileDown,
} from 'lucide-react';
import { AdBanner } from '@/components/AdBanner';
import { normalizeUrl } from '@/lib/utils';
import { AdminSidebar, AdminTab } from '@/components/admin/AdminSidebar';
import { OpportunityRadarTab } from '@/components/admin/OpportunityRadarTab';
import { CareerPassAdminTab } from '@/components/admin/CareerPassAdminTab';
import { B2BJobsAdminTab } from '@/components/admin/B2BJobsAdminTab';

interface AdminPanelProps {
  onBackToPortal: () => void;
  lang?: Language;
  onNavigateToBlogArticle?: (articleId: string) => void;
}

const generateArticleId = () => `art-${Date.now()}`;
const generateArticleSlug = (prefix: string) => `${prefix}-${Date.now().toString().slice(-4)}`;
const generateDuplicateSlug = (slug: string) => `${slug}-copia-${Date.now().toString().slice(-3)}`;
const generateAffiliateId = () => `aff-${Date.now()}`;

export interface DynamicSectionOption {
  id: string;
  label: string;
  category: 'global' | 'blog' | 'custom';
  categoryLabel: string;
  url: string;
  recommendedFormat: AdSlotConfig['format'];
  description: string;
  articleId?: string;
  articleTitle?: string;
}

export const getDynamicSections = (articleList: BlogArticleData[] = []): DynamicSectionOption[] => {
  const globalSections: DynamicSectionOption[] = [
    {
      id: 'home-top',
      label: 'Topo da Página / Calculadora (Header Lead)',
      category: 'global',
      categoryLabel: 'Páginas & Calculadoras do Portal',
      url: '/?tool=net-calc#calculator-top',
      recommendedFormat: 'top-leaderboard',
      description: 'Primeiro elemento visível logo abaixo do cabeçalho. Altíssima visibilidade.',
    },
    {
      id: 'salary-results',
      label: 'Abaixo do Contracheque & Resultados de Salário',
      category: 'global',
      categoryLabel: 'Páginas & Calculadoras do Portal',
      url: '/?tool=net-calc#salary-results',
      recommendedFormat: 'bottom-wide',
      description: 'Exibido após o usuário calcular seu salário e visualizar a tabela detalhada.',
    },
    {
      id: 'tools-section',
      label: 'Grade de Ferramentas & Simuladores (Toolbox)',
      category: 'global',
      categoryLabel: 'Páginas & Calculadoras do Portal',
      url: '/?tool=net-calc#toolbox-section',
      recommendedFormat: 'bottom-wide',
      description: 'Posicionado acima da grade de ferramentas complementares.',
    },
    {
      id: 'sidebar',
      label: 'Barra Lateral de Resultados & Comparativo (Sidebar)',
      category: 'global',
      categoryLabel: 'Páginas & Calculadoras do Portal',
      url: '/?tool=net-calc#sidebar-slot',
      recommendedFormat: 'sidebar',
      description: 'Card vertical de 300px ao lado dos painéis de cálculo.',
    },
    {
      id: 'footer-wide',
      label: 'Rodapé Geral do Portal (Pré-Footer Global)',
      category: 'global',
      categoryLabel: 'Páginas & Calculadoras do Portal',
      url: '/#footer-sponsor',
      recommendedFormat: 'bottom-wide',
      description: 'Faixa no rodapé de alta conversão visível em todas as páginas do portal.',
    },
    {
      id: 'blog-index',
      label: 'Vitrine Principal do Blog (Lista de Artigos & Guias)',
      category: 'global',
      categoryLabel: 'Páginas & Calculadoras do Portal',
      url: '/?tool=blog#blog-showcase',
      recommendedFormat: 'top-leaderboard',
      description: 'Exibido na página principal do blog editorial junto com a lista de publicações.',
    },
    {
      id: 'blog-article',
      label: 'Blog Geral - Todos os Artigos (Padrão Fallback)',
      category: 'global',
      categoryLabel: 'Páginas & Calculadoras do Portal',
      url: '/?tool=blog#ad-slot',
      recommendedFormat: 'rectangle',
      description: 'Inserido estrategicamente no corpo dos artigos do blog editorial.',
    },
  ];

  const blogSections: DynamicSectionOption[] = (articleList || []).map((art) => ({
    id: `blog-article-${art.id}`,
    label: `Artigo: ${art.title.pt || art.title.fr || art.title.en} [${art.category.toUpperCase()}]`,
    category: 'blog',
    categoryLabel: `Artigos Editoriais do Blog (${articleList.length} sincronizados)`,
    url: `/?tool=blog&article=${art.id}#ad-slot`,
    recommendedFormat: 'rectangle',
    description: `Anúncio exclusivo no corpo do artigo "${art.title.pt || art.title.fr || art.title.en}".`,
    articleId: art.id,
    articleTitle: art.title.pt || art.title.fr || art.title.en,
  }));

  return [...globalSections, ...blogSections];
};

interface ContextualMockupProps {
  slot: AdSlotConfig;
  currentSection: string;
  articleList: BlogArticleData[];
  onTestOffer: () => void;
  onNavigateLive: (sec: string, url?: string) => void;
}

const ContextualMockupView: React.FC<ContextualMockupProps> = ({
  slot,
  currentSection,
  articleList,
  onTestOffer,
  onNavigateLive,
}) => {
  const isHomeTop = currentSection === 'home-top';
  const isSalaryResults = currentSection === 'salary-results';
  const isTools = currentSection === 'tools-section';
  const isFooter = currentSection === 'footer-wide';
  const isSidebar = currentSection === 'sidebar';
  const isBlogIndex = currentSection === 'blog-index';
  const isBlog = currentSection === 'blog-article' || currentSection.startsWith('blog-article-');

  // Match article if blog
  let targetArticle = articleList[0];
  if (currentSection.startsWith('blog-article-')) {
    const artId = currentSection.replace('blog-article-', '');
    const found = articleList.find((a) => a.id === artId);
    if (found) targetArticle = found;
  }

  // Get current browser URL
  const browserUrl =
    isHomeTop
      ? 'https://paienet.qc.ca/?tool=net-calc#calculator-top'
      : isSalaryResults
      ? 'https://paienet.qc.ca/?tool=net-calc#salary-results'
      : isTools
      ? 'https://paienet.qc.ca/?tool=net-calc#toolbox-section'
      : isFooter
      ? 'https://paienet.qc.ca/#footer-sponsor'
      : isSidebar
      ? 'https://paienet.qc.ca/?tool=net-calc#sidebar-slot'
      : isBlogIndex
      ? 'https://paienet.qc.ca/?tool=blog#blog-showcase'
      : isBlog && targetArticle
      ? `https://paienet.qc.ca/?tool=blog&article=${targetArticle.id}#ad-slot`
      : `https://paienet.qc.ca/${slot.pageUrlPath || ''}`;

  return (
    <div className="w-full bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
      {/* 1. Realistic Browser Bar */}
      <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          <span className="text-[11px] text-slate-400 font-mono ml-2 hidden sm:inline">
            Simulador de Renderização em Tempo Real (Contexto da Página)
          </span>
        </div>

        <div className="flex-1 max-w-lg mx-2 bg-slate-950/80 px-3 py-1 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-300 flex items-center justify-between gap-2 truncate">
          <div className="flex items-center gap-1.5 truncate">
            <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="truncate">{browserUrl}</span>
          </div>
          <button
            type="button"
            onClick={() => onNavigateLive(currentSection, slot.pageUrlPath)}
            className="text-blue-400 hover:text-blue-300 text-[10px] uppercase font-bold shrink-0 flex items-center gap-0.5 hover:underline cursor-pointer"
            title="Abrir esta página ao vivo no site"
          >
            <span>Ir ao site</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </button>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            Sincronizado
          </span>
        </div>
      </div>

      {/* 2. Page Content Simulation Canvas */}
      <div className="p-4 sm:p-6 bg-slate-900/60 max-h-[560px] overflow-y-auto space-y-5 text-slate-300 font-sans">
        {/* CASE A: HOME-TOP (TOPO DA CALCULADORA) */}
        {isHomeTop && (
          <div className="space-y-4">
            {/* Header Mockup */}
            <div className="bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">⚜️</span>
                <div>
                  <span className="font-extrabold text-white text-sm">PaieNet<span className="text-blue-400">.qc</span></span>
                  <span className="text-[10px] text-slate-400 block">Calculateur Salarial Québec 2026</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[10px]">
                <span className="bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded font-bold border border-blue-500/30">Barèmes 2025/2026</span>
                <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-bold">FR / PT / EN</span>
              </div>
            </div>

            {/* Title intro banner */}
            <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-800/80 space-y-1">
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">⚜️ CALCULADOR OFICIAL</span>
              <h4 className="text-base sm:text-lg font-black text-white">Calculador de Salário Líquido Québec 2026</h4>
              <p className="text-xs text-slate-400">Preencha sua taxa horária ou salário e veja o valor líquido exato no seu bolso.</p>
            </div>

            {/* THE ACTUAL AD BANNER EMBEDDED HERE */}
            <div className="relative group">
              <div className="absolute -top-2.5 left-4 z-10 bg-blue-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded shadow">
                👉 Banner Topo da Calculadora (Posição Atual)
              </div>
              <AdBanner previewSlot={slot} isPreviewMode={true} />
            </div>

            {/* Workspace Inputs Mockup below */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 opacity-80 pointer-events-none">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-white block">Dados Salariais (Input)</span>
                <div className="flex items-center justify-between text-xs bg-slate-900 p-2 rounded-xl">
                  <span className="text-slate-400">Taxa Horária:</span>
                  <span className="font-bold text-white">$31.51 / hora</span>
                </div>
                <div className="flex items-center justify-between text-xs bg-slate-900 p-2 rounded-xl">
                  <span className="text-slate-400">Carga Horária:</span>
                  <span className="font-bold text-white">36h / semana (72h quinzenal)</span>
                </div>
              </div>
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-emerald-400 block">Líquido Instantâneo</span>
                <div className="text-xl font-black text-emerald-400">$2.014,50 CAD</div>
                <span className="text-[10px] text-slate-400">A cada 2 semanas (Bi-hebdomadaire)</span>
              </div>
            </div>
          </div>
        )}

        {/* CASE B: SALARY-RESULTS (ABAIXO DO CONTRACHEQUE) */}
        {isSalaryResults && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
              <span className="text-slate-400">← Voltar à Área de Preenchimento</span>
              <span className="text-white font-bold">Contracheque Bi-Hebdomadaire Oficial (36h/sem)</span>
            </div>

            {/* Highlight Net Pay Card Mockup */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-950 border border-emerald-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Líquido no Bolso
                </span>
                <span className="text-xs text-slate-400">Taxa Efetiva: 20,1%</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-300">
                $2.014,50 CAD
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/10 text-[11px]">
                <div><span className="text-slate-400 block">Bruto:</span><strong className="text-white">$2.520,80</strong></div>
                <div><span className="text-slate-400 block">Imposto QC:</span><strong className="text-amber-400">-$220,10</strong></div>
                <div><span className="text-slate-400 block">Imposto ARC:</span><strong className="text-amber-400">-$174,30</strong></div>
                <div><span className="text-slate-400 block">RRQ/RQAP:</span><strong className="text-amber-400">-$137,90</strong></div>
              </div>
            </div>

            {/* THE ACTUAL AD BANNER EMBEDDED HERE */}
            <div className="relative group">
              <div className="absolute -top-2.5 left-4 z-10 bg-emerald-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded shadow">
                👉 Banner Abaixo dos Resultados (Posição Estratégica)
              </div>
              <AdBanner previewSlot={slot} isPreviewMode={true} />
            </div>

            {/* Cascade Table Mockup */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] opacity-75">
              <span className="text-slate-400 font-semibold block mb-1">Tabela de Projeção Comparativa (Anual vs Quinzenal)</span>
              <div className="grid grid-cols-4 gap-2 text-center pt-1 font-mono">
                <div><span className="text-[9px] text-slate-500 block">ANUAL</span><span className="text-white">$64.800</span></div>
                <div><span className="text-[9px] text-slate-500 block">MENSAL</span><span className="text-white">$5.400</span></div>
                <div><span className="text-[9px] text-slate-500 block">QUINZENAL</span><span className="text-emerald-400 font-bold">$2.014,50</span></div>
                <div><span className="text-[9px] text-slate-500 block">SEMANAL</span><span className="text-white">$1.007,25</span></div>
              </div>
            </div>
          </div>
        )}

        {/* CASE C: BLOG-ARTICLE (DENTRO DO ARTIGO) */}
        {isBlog && (
          <div className="space-y-4">
            {/* Article Header Mockup */}
            <div className="space-y-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-bold uppercase text-[10px]">
                  {targetArticle?.category.toUpperCase() || 'EDITORIAL'}
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400 text-xs flex items-center gap-1">
                  <Clock className="w-3 h-3 text-blue-400" />
                  <span>{targetArticle?.readTime || '6 min de leitura'}</span>
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-emerald-400 text-[10px] font-bold">Artigo Sincronizado</span>
              </div>

              <h2 className="text-lg sm:text-xl font-black text-white leading-snug">
                {targetArticle?.title.pt || targetArticle?.title.fr || 'Artigo do Blog PaieNet'}
              </h2>

              <p className="text-xs text-slate-400 leading-relaxed italic">
                &ldquo;{targetArticle?.excerpt.pt || targetArticle?.excerpt.fr || 'Guia prático para trabalhadores no Québec.'}&rdquo;
              </p>
            </div>

            {/* Paragraph 1 */}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {targetArticle?.content.pt?.[0] ||
                'No ambiente profissional do Québec, entender as normas e a legislação trabalhista é indispensável para garantir todos os seus direitos financeiros e de carreira.'}
            </p>

            {/* THE ACTUAL AD BANNER EMBEDDED IN THE ARTICLE */}
            <div className="relative group my-4">
              <div className="absolute -top-2.5 left-4 z-10 bg-purple-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded shadow">
                👉 Banner Inserido no Corpo do Artigo
              </div>
              <div className="max-w-md mx-auto">
                <AdBanner previewSlot={slot} isPreviewMode={true} format="rectangle" />
              </div>
            </div>

            {/* Paragraph 2 */}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {targetArticle?.content.pt?.[1] ||
                'Além disso, a remuneração deve sempre refletir as horas normais, adicionais de turno e a correta retenção do imposto provincial de Revenu Québec e imposto federal da ARC.'}
            </p>

            {/* Practical CTA Tool Simulation */}
            <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-500/30 flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Ferramenta recomendada: Calculadora Líquida Québec</span>
              </span>
              <button
                type="button"
                onClick={() => onNavigateLive('net-calc')}
                className="px-3 py-1 bg-blue-600 text-white font-bold rounded-lg text-[10px] cursor-pointer"
              >
                Abrir Ferramenta
              </button>
            </div>
          </div>
        )}

        {/* CASE D: TOOLS-SECTION (GRADE DE FERRAMENTAS) */}
        {isTools && (
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <span className="text-[10px] font-black uppercase text-blue-400 tracking-wider">ECOSSISTEMA DE FERRAMENTAS</span>
              <h3 className="text-base sm:text-lg font-black text-white">Todas as Ferramentas & Simuladores Práticos</h3>
              <p className="text-xs text-slate-400">Calculadoras complementares de carreira e finanças no Québec.</p>
            </div>

            {/* THE ACTUAL AD BANNER EMBEDDED HERE */}
            <div className="relative group">
              <div className="absolute -top-2.5 left-4 z-10 bg-indigo-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded shadow">
                👉 Banner Acima da Grade de Ferramentas
              </div>
              <AdBanner previewSlot={slot} isPreviewMode={true} />
            </div>

            {/* 4 Tool Cards Mockup */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 opacity-80 pointer-events-none">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <span className="text-lg block">💰</span>
                <span className="text-[11px] font-bold text-white block">Salário Líquido</span>
                <span className="text-[9px] text-slate-500">Holerite completo</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <span className="text-lg block">🎯</span>
                <span className="text-[11px] font-bold text-white block">Simulador STAR</span>
                <span className="text-[9px] text-slate-500">Entrevistas RH</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <span className="text-lg block">🔄</span>
                <span className="text-[11px] font-bold text-white block">Conversor Salarial</span>
                <span className="text-[9px] text-slate-500">Hora / Mês / Ano</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <span className="text-lg block">📈</span>
                <span className="text-[11px] font-bold text-white block">Match REER</span>
                <span className="text-[9px] text-slate-500">Restituição fiscal</span>
              </div>
            </div>
          </div>
        )}

        {/* CASE E: FOOTER-WIDE (RODAPÉ GERAL) */}
        {isFooter && (
          <div className="space-y-4">
            {/* Newsletter strip simulation */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 via-indigo-950/40 to-slate-950 border border-blue-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-bold text-white block">Boletim Salarial do Québec</span>
                <span className="text-slate-400 text-[11px]">Receba atualizações de barèmes fiscais e dicas de carreira.</span>
              </div>
              <div className="flex items-center gap-1.5 w-full sm:w-auto">
                <input type="email" placeholder="seu@email.com" readOnly className="px-3 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs w-full sm:w-48 text-slate-400" />
                <button type="button" className="px-3 py-1 bg-blue-600 text-white font-bold rounded-lg text-xs shrink-0">Assinar</button>
              </div>
            </div>

            {/* THE ACTUAL AD BANNER EMBEDDED HERE */}
            <div className="relative group">
              <div className="absolute -top-2.5 left-4 z-10 bg-teal-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded shadow">
                👉 Banner no Rodapé Amplo (Pré-Footer Global)
              </div>
              <AdBanner previewSlot={slot} isPreviewMode={true} format="bottom-wide" />
            </div>

            {/* Footer Links Mockup */}
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-800 text-[10px] text-slate-400">
              <div>
                <span className="font-bold text-white block mb-1">Calculadoras</span>
                <span className="block">Salário Líquido QC</span>
                <span className="block">Conversor de Moedas</span>
              </div>
              <div>
                <span className="font-bold text-white block mb-1">Legislação</span>
                <span className="block">Normas CNESST</span>
                <span className="block">8 Feriados Oficiais</span>
              </div>
              <div>
                <span className="font-bold text-white block mb-1">PaieNet.qc</span>
                <span className="block">© 2026 Québec, Canada</span>
                <span className="block">Barèmes Revenu Québec</span>
              </div>
            </div>
          </div>
        )}

        {/* CASE F: SIDEBAR (BARRA LATERAL) */}
        {isSidebar && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
            <div className="md:col-span-8 bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-white block">Área Principal da Calculadora (70% da tela)</span>
              <div className="p-3 bg-slate-900 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-slate-400">Salário Bruto Anual:</span><strong className="text-white">$64.800,00 CAD</strong></div>
                <div className="flex justify-between"><span className="text-slate-400">Líquido Estimado no Bolso:</span><strong className="text-emerald-400">$48.348,00 CAD/ano</strong></div>
              </div>
              <p className="text-[11px] text-slate-400">
                A barra lateral acompanha a navegação do usuário ao lado dos painéis de cálculo.
              </p>
            </div>

            <div className="md:col-span-4 relative group">
              <div className="absolute -top-2.5 left-2 z-10 bg-amber-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded shadow">
                👉 Barra Lateral (Sidebar 300px)
              </div>
              <AdBanner previewSlot={slot} isPreviewMode={true} format="sidebar" />
            </div>
          </div>
        )}

        {/* CASE G: BLOG-INDEX (VITRINE DO BLOG) */}
        {isBlogIndex && (
          <div className="space-y-4">
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">📰 BLOG EDITORIAL & GUIAS FISCAIS</span>
              <h3 className="text-base sm:text-lg font-black text-white">Guias de Carreira, Impostos e Finanças no Québec</h3>
              <p className="text-xs text-slate-400">Artigos completos atualizados com as regras fiscais de 2025/2026.</p>
              
              <div className="flex flex-wrap gap-1.5 pt-2">
                <span className="px-2 py-0.5 rounded-lg bg-blue-600 text-white font-bold text-[10px]">Todos ({articleList.length} artigos)</span>
                <span className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 text-[10px]">Impostos</span>
                <span className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 text-[10px]">Carreira</span>
                <span className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 text-[10px]">CNESST</span>
              </div>
            </div>

            {/* AD BANNER IN BLOG INDEX */}
            <div className="relative group">
              <div className="absolute -top-2.5 left-4 z-10 bg-blue-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded shadow">
                👉 Banner Vitrine do Blog
              </div>
              <AdBanner previewSlot={slot} isPreviewMode={true} format={slot.format || 'top-leaderboard'} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 opacity-80 pointer-events-none">
              {(articleList.slice(0, 2)).map((art) => (
                <div key={art.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                  <span className="text-[9px] font-bold uppercase text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">{art.category}</span>
                  <div className="font-bold text-white text-xs truncate">{art.title.pt || art.title.fr}</div>
                  <p className="text-[10px] text-slate-400 line-clamp-2">{art.excerpt.pt || art.excerpt.fr}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CASE H: CUSTOM FALLBACK */}
        {!isHomeTop && !isSalaryResults && !isBlog && !isTools && !isFooter && !isSidebar && !isBlogIndex && (
          <div className="space-y-4">
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs">
              <span className="text-amber-400 font-bold block mb-1">Seção Personalizada: {slot.pageSectionLabel || slot.pageSection}</span>
              <p className="text-[11px] text-slate-400">Rota associada: {slot.pageUrlPath || '/'}</p>
            </div>
            <div className="relative group">
              <AdBanner previewSlot={slot} isPreviewMode={true} />
            </div>
          </div>
        )}
      </div>

      {/* 3. Live Actions in Browser Mockup */}
      <div className="p-3 bg-slate-900/90 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-[11px]">Teste Rápido de Acesso:</span>
          {slot.customSponsor?.linkUrl ? (
            <a
              href={normalizeUrl(slot.customSponsor.linkUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs inline-flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer no-underline"
            >
              <span>Acessar Oferta Agora ({slot.customSponsor.sponsorName})</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          ) : (
            <span className="text-slate-500 text-[11px] font-mono">Modo Google AdSense Programático</span>
          )}
        </div>

        <button
          type="button"
          onClick={() => onNavigateLive(currentSection, slot.pageUrlPath)}
          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs inline-flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <span>🚀 Ver ao Vivo no Site</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBackToPortal, onNavigateToBlogArticle }) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => adminStore.isAuthenticated());
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Responsive & Retractable Sidebar State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Reactive Data from AdminStore
  const [articles, setArticles] = useState<BlogArticleData[]>(() => adminStore.getArticles());
  const [affiliates, setAffiliates] = useState<AffiliatePartner[]>(() => adminStore.getAffiliates());
  const [adSlots, setAdSlots] = useState<AdSlotConfig[]>(() => adminStore.getAdSlots());
  const [ebookConfig, setEbookConfig] = useState<EbookConfig>(() => adminStore.getEbookConfig());
  const [ebookOrders, setEbookOrders] = useState<EbookOrder[]>(() => adminStore.getEbookOrders());
  const [digitalAssets, setDigitalAssets] = useState<DigitalAsset[]>(() => adminStore.getDigitalAssets());
  const [careerPackages, setCareerPackages] = useState<CareerPassPackage[]>(() => adminStore.getCareerPackages());
  const [careerOrders, setCareerOrders] = useState<CareerPassOrder[]>(() => adminStore.getCareerOrders());
  const [b2bJobs, setB2BJobs] = useState<B2BJobPosting[]>(() => adminStore.getB2BJobs());
  const [b2bInquiries, setB2BInquiries] = useState<B2BSponsorInquiry[]>(() => adminStore.getB2BInquiries());
  const [adsSubTab, setAdsSubTab] = useState<'loteamento-map' | 'banners-list' | 'inquiries-crm'>('loteamento-map');
  const [newsletterLeads, setNewsletterLeads] = useState<NewsletterLead[]>(() => adminStore.getNewsletterLeads());
  const [liveEvents, setLiveEvents] = useState<LiveActivityEvent[]>(() => adminStore.getLiveEvents());

  // Feedback Notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Article Edit Modal & Template Selector State
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [isTemplateSelectorOpen, setIsTemplateSelectorOpen] = useState(false);
  const [selectedTemplateFilter, setSelectedTemplateFilter] = useState<'all' | 'impots' | 'carriere' | 'finances' | 'cnesst'>('all');
  const [selectedTemplateIntent, setSelectedTemplateIntent] = useState<'all' | 'informativo' | 'transacional' | 'comparativo' | 'defesa_direitos' | 'carreira'>('all');
  const [templateSearch, setTemplateSearch] = useState('');
  const [editorViewMode, setEditorViewMode] = useState<'edit' | 'preview'>('edit');
  const [editingArticle, setEditingArticle] = useState<BlogArticleData | null>(null);
  const [articleFormLang, setArticleFormLang] = useState<Language>('pt');
  const [expandedArticleId, setExpandedArticleId] = useState<string | null>(null);
  const [monetizationProducts, setMonetizationProducts] = useState(() => adminStore.getMonetizationProducts());

  // Available Templates from Store
  const articleTemplates = adminStore.getArticleTemplates();

  // Affiliate Modal State
  const [isAffiliateModalOpen, setIsAffiliateModalOpen] = useState(false);
  const [editingAffiliate, setEditingAffiliate] = useState<AffiliatePartner | null>(null);

  // Dynamic Page & Article Sections Mapped for Ads
  const dynamicSections = useMemo(() => getDynamicSections(articles), [articles]);

  // Ad Slot Modal, CRUD & Live Preview Studio State
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const [isNewAd, setIsNewAd] = useState(false);
  const [editingAdSlot, setEditingAdSlot] = useState<AdSlotConfig | null>(null);
  const [selectedAdForPreview, setSelectedAdForPreview] = useState<AdSlotConfig | null>(null);
  const [isPreviewStudioOpen, setIsPreviewStudioOpen] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [previewModeType, setPreviewModeType] = useState<'page-context' | 'banner'>('page-context');
  const [previewContextSection, setPreviewContextSection] = useState<string>('home-top');
  const [editPreviewModeType, setEditPreviewModeType] = useState<'page-context' | 'banner'>('page-context');
  const [adFilter, setAdFilter] = useState<'all' | 'active' | 'paused' | 'custom-sponsor' | 'adsense'>('all');
  const [adSearch, setAdSearch] = useState('');

  // Search Queries
  const [articleSearch, setArticleSearch] = useState('');
  const [leadSearch, setLeadSearch] = useState('');
  const [affiliateSearch, setAffiliateSearch] = useState('');

  // Password Change Form
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const syncData = () => {
      setArticles(adminStore.getArticles());
      setAffiliates(adminStore.getAffiliates());
      setAdSlots(adminStore.getAdSlots());
      setEbookConfig(adminStore.getEbookConfig());
      setEbookOrders(adminStore.getEbookOrders());
      setDigitalAssets(adminStore.getDigitalAssets());
      setCareerPackages(adminStore.getCareerPackages());
      setCareerOrders(adminStore.getCareerOrders());
      setB2BJobs(adminStore.getB2BJobs());
      setB2BInquiries(adminStore.getB2BInquiries());
      setMonetizationProducts(adminStore.getMonetizationProducts());
      setNewsletterLeads(adminStore.getNewsletterLeads());
      setLiveEvents(adminStore.getLiveEvents());
    };
    const unsubscribe = adminStore.subscribe(syncData);
    return () => unsubscribe();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Auth Handlers
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminStore.login(passwordInput)) {
      setIsAuthenticated(true);
      setAuthError('');
      showToast('Bem-vindo à Área de Gestão do PaieNet.qc');
    } else {
      setAuthError('Senha de administrador incorreta. Tente novamente.');
    }
  };

  const handleLogout = () => {
    adminStore.logout();
    setIsAuthenticated(false);
    setPasswordInput('');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    const currentPass = adminStore.getMasterPassword();
    if (oldPassword !== currentPass) {
      showToast('❌ Senha atual incorreta.');
      return;
    }
    if (newPassword.length < 4) {
      showToast('❌ A nova senha deve ter no mínimo 4 dígitos.');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('❌ As senhas não coincidem.');
      return;
    }
    if (adminStore.setMasterPassword(newPassword)) {
      showToast('✅ Chave mestre alterada com sucesso!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  // KPIs Calculations
  const totalRevenue = adminStore.getRevenueSummary().grandTotal;

  const totalAffiliateClicks = useMemo(() => {
    return affiliates.reduce((sum, a) => sum + (a.clicksCount || 0), 0);
  }, [affiliates]);

  const totalArticleViews = useMemo(() => {
    return articles.reduce((sum, a) => sum + (a.viewsCount || 0), 0);
  }, [articles]);

  // Ads & Banners Metrics & Filter
  const adMetrics = useMemo(() => {
    const total = adSlots.length;
    const activeCount = adSlots.filter((s) => s.status !== 'paused').length;
    const pausedCount = adSlots.filter((s) => s.status === 'paused').length;
    const totalImpressions = adSlots.reduce((sum, s) => sum + (s.impressions || 0), 0);
    const totalClicks = adSlots.reduce((sum, s) => sum + (s.clicks || 0), 0);
    const ctr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0.00';
    return { total, activeCount, pausedCount, totalImpressions, totalClicks, ctr };
  }, [adSlots]);

  const filteredAdSlots = useMemo(() => {
    return adSlots.filter((slot) => {
      if (adFilter === 'active' && slot.status === 'paused') return false;
      if (adFilter === 'paused' && slot.status !== 'paused') return false;
      if (adFilter === 'custom-sponsor' && slot.status !== 'custom-sponsor') return false;
      if (adFilter === 'adsense' && slot.status !== 'active') return false;

      if (adSearch.trim()) {
        const query = adSearch.toLowerCase();
        const matchesName = slot.name.toLowerCase().includes(query);
        const matchesDesc = (slot.description || '').toLowerCase().includes(query);
        const matchesSponsor = (slot.customSponsor?.sponsorName || '').toLowerCase().includes(query);
        const matchesHeadline = (slot.customSponsor?.headline || '').toLowerCase().includes(query);
        const matchesSection = (slot.pageSectionLabel || slot.pageSection || '').toLowerCase().includes(query);
        const matchesUrl = (slot.pageUrlPath || '').toLowerCase().includes(query);
        return matchesName || matchesDesc || matchesSponsor || matchesHeadline || matchesSection || matchesUrl;
      }
      return true;
    });
  }, [adSlots, adFilter, adSearch]);

  // Daily Chart Data
  const dailyData = adminStore.getDailyAnalytics();

  // Tool Usage Data for BarChart
  const toolUsageData = [
    { name: 'Calculadora Líquida', value: 42, color: '#2563eb' },
    { name: 'Simulador STAR', value: 18, color: '#6366f1' },
    { name: 'Conversor Salarial', value: 14, color: '#0ea5e9' },
    { name: 'Currículo Canadense', value: 12, color: '#8b5cf6' },
    { name: 'Testes Técnicos', value: 8, color: '#f59e0b' },
    { name: 'Outros (REER/CNESST)', value: 6, color: '#10b981' },
  ];

  // Article Actions & Template Engine
  const handleOpenTemplateSelector = () => {
    setIsTemplateSelectorOpen(true);
  };

  const handleApplyTemplate = (tpl: ArticleTemplate) => {
    const newArt: BlogArticleData = {
      id: generateArticleId(),
      slug: generateArticleSlug(tpl.id),
      category: tpl.preset.category,
      readTime: tpl.preset.readTime,
      date: tpl.preset.date,
      published: true,
      viewsCount: 0,
      title: { ...tpl.preset.title },
      excerpt: { ...tpl.preset.excerpt },
      content: {
        pt: [...tpl.preset.content.pt],
        fr: [...tpl.preset.content.fr],
        en: [...tpl.preset.content.en],
      },
      ctaTool: tpl.preset.ctaTool,
      ctaToolLabel: { ...tpl.preset.ctaToolLabel },
      affiliateOffer: tpl.preset.affiliateOffer ? { ...tpl.preset.affiliateOffer } : undefined,
      hasEbookCta: tpl.preset.hasEbookCta,
    };
    setEditingArticle(newArt);
    setEditorViewMode('edit');
    setIsTemplateSelectorOpen(false);
    setIsArticleModalOpen(true);
    showToast(`Template "${tpl.name}" aplicado! Estrutura de monetização contextual carregada.`);
  };

  const handleDuplicateArticle = (art: BlogArticleData) => {
    const dup: BlogArticleData = {
      ...art,
      id: generateArticleId(),
      slug: generateDuplicateSlug(art.slug),
      published: false,
      viewsCount: 0,
      title: {
        pt: `${art.title.pt} (Cópia)`,
        fr: `${art.title.fr} (Copie)`,
        en: `${art.title.en} (Copy)`,
      },
    };
    adminStore.saveArticle(dup);
    showToast('Artigo duplicado como rascunho com sucesso!');
  };

  const handleOpenNewArticleBlank = () => {
    const newArt: BlogArticleData = {
      id: generateArticleId(),
      slug: generateArticleSlug('novo-artigo'),
      category: 'impots',
      readTime: '5 min',
      date: 'Nova Publicação',
      published: true,
      viewsCount: 0,
      title: { pt: '', fr: '', en: '' },
      excerpt: { pt: '', fr: '', en: '' },
      content: { pt: [''], fr: [''], en: [''] },
      ctaTool: 'net-calc',
      ctaToolLabel: { pt: 'Ver na Calculadora', fr: 'Voir au calculateur', en: 'View in calculator' },
      affiliateOffer: {
        partnerId: 'wise',
        partnerName: 'Wise Câmbio',
        badge: { pt: 'Recomendado', fr: 'Recommandé', en: 'Recommended' },
        offerTitle: { pt: 'Economize no Câmbio', fr: 'Économisez sur le change', en: 'Save on exchange' },
        offerDescription: { pt: 'Taxa comercial real sem spread.', fr: 'Taux réel sans marge.', en: 'Real mid-market rate.' },
        ctaText: { pt: 'Abrir conta', fr: 'Ouvrir compte', en: 'Open account' },
        externalUrl: 'https://wise.com',
      },
      hasEbookCta: true,
    };
    setEditingArticle(newArt);
    setEditorViewMode('edit');
    setIsArticleModalOpen(true);
  };

  const handleReplicateLanguages = () => {
    if (!editingArticle) return;
    const currentLang = articleFormLang;
    const sourceTitle = editingArticle.title[currentLang];
    const sourceExcerpt = editingArticle.excerpt[currentLang];
    const sourceContent = editingArticle.content[currentLang] || [];

    if (!sourceTitle) {
      showToast('⚠️ Preencha ao menos o título no idioma atual antes de replicar.');
      return;
    }

    const updatedTitle = { ...editingArticle.title };
    const updatedExcerpt = { ...editingArticle.excerpt };
    const updatedContent = { ...editingArticle.content };

    (['pt', 'fr', 'en'] as Language[]).forEach((l) => {
      if (!updatedTitle[l]) updatedTitle[l] = sourceTitle;
      if (!updatedExcerpt[l]) updatedExcerpt[l] = sourceExcerpt;
      if (!updatedContent[l] || updatedContent[l].length === 0) updatedContent[l] = [...sourceContent];
    });

    setEditingArticle({
      ...editingArticle,
      title: updatedTitle,
      excerpt: updatedExcerpt,
      content: updatedContent,
    });
    showToast('✨ Conteúdo replicado para os outros idiomas com sucesso!');
  };

  const handleCalculateReadTime = () => {
    if (!editingArticle) return;
    const totalWords = (editingArticle.content[articleFormLang] || []).join(' ').split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(2, Math.ceil(totalWords / 160));
    setEditingArticle({
      ...editingArticle,
      readTime: `${minutes} min`,
    });
    showToast(`⏱️ Tempo estimado recalculado: ${minutes} min (${totalWords} palavras).`);
  };

  const handleInsertCallout = () => {
    if (!editingArticle) return;
    const currentParagraphs = editingArticle.content[articleFormLang] || [];
    const callout = '💡 Dica Estratégica: Para evitar perdas fiscais no Québec, solicite sempre o comprovante oficial de deduções antes da declaração anual de rendimentos.';
    setEditingArticle({
      ...editingArticle,
      content: {
        ...editingArticle.content,
        [articleFormLang]: [...currentParagraphs, callout],
      },
    });
  };

  const handleSaveArticle = () => {
    if (!editingArticle) return;
    if (!editingArticle.title.pt && !editingArticle.title.fr && !editingArticle.title.en) {
      alert('Por favor, informe ao menos um título para o artigo.');
      return;
    }
    // Ensure all 3 languages have a title fallback
    const titlePt = editingArticle.title.pt || editingArticle.title.fr || editingArticle.title.en;
    const titleFr = editingArticle.title.fr || titlePt;
    const titleEn = editingArticle.title.en || titlePt;

    const finalArticle: BlogArticleData = {
      ...editingArticle,
      title: { pt: titlePt, fr: titleFr, en: titleEn },
      excerpt: {
        pt: editingArticle.excerpt.pt || editingArticle.excerpt.fr || editingArticle.excerpt.en || '',
        fr: editingArticle.excerpt.fr || editingArticle.excerpt.pt || '',
        en: editingArticle.excerpt.en || editingArticle.excerpt.pt || '',
      },
      content: {
        pt: editingArticle.content.pt?.length ? editingArticle.content.pt : editingArticle.content.fr || [],
        fr: editingArticle.content.fr?.length ? editingArticle.content.fr : editingArticle.content.pt || [],
        en: editingArticle.content.en?.length ? editingArticle.content.en : editingArticle.content.pt || [],
      },
    };

    adminStore.saveArticle(finalArticle);
    setIsArticleModalOpen(false);
    setEditingArticle(null);
    showToast('🎉 Artigo salvo com sucesso e refletido em todo o site!');
  };

  const handleDeleteArticle = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este artigo do blog?')) {
      adminStore.deleteArticle(id);
      showToast('Artigo removido do blog.');
    }
  };

  // Affiliate Actions
  const handleSaveAffiliate = () => {
    if (!editingAffiliate) return;
    adminStore.saveAffiliate(editingAffiliate);
    setIsAffiliateModalOpen(false);
    setEditingAffiliate(null);
    showToast('Parceiro afiliado atualizado com sucesso!');
  };

  // Ad Management Actions
  const handleCreateNewAd = () => {
    const newId = `slot-${Date.now()}`;
    const defaultPreset = dynamicSections[0] || {
      id: 'home-top',
      label: 'Topo da Página / Calculadora (Header Lead)',
      url: '/?tool=net-calc#calculator-top',
      recommendedFormat: 'top-leaderboard' as const,
    };
    setEditingAdSlot({
      id: newId,
      name: 'Novo Banner Promocional',
      description: 'Banner estratégico com alta visibilidade e CTA direto',
      status: 'custom-sponsor',
      adSenseSlotId: `ca-pub-992817263541/${Date.now().toString().slice(-6)}`,
      pageSection: defaultPreset.id,
      pageSectionLabel: defaultPreset.label,
      pageUrlPath: defaultPreset.url,
      format: defaultPreset.recommendedFormat,
      customSponsor: {
        sponsorName: 'Nome do Patrocinador / Marca',
        headline: 'Chamada atraente e benefício claro para o usuário',
        tagline: 'Descrição dos diferenciais exclusivos e proposta de valor.',
        linkUrl: 'https://wise.com',
        badgeText: 'Parceiro Verificado 2026',
        ctaText: 'Acessar Oferta',
        themeGradient: 'blue',
        iconType: 'sparkles',
      },
      impressions: 0,
      clicks: 0,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    });
    setIsNewAd(true);
    setIsAdModalOpen(true);
  };

  const handleEditAdSlot = (slot: AdSlotConfig) => {
    setEditingAdSlot(JSON.parse(JSON.stringify(slot)));
    setIsNewAd(false);
    setIsAdModalOpen(true);
  };

  const handleSaveAdSlot = () => {
    if (!editingAdSlot) return;
    if (!editingAdSlot.name.trim()) {
      showToast('Por favor, defina um nome para o anúncio.');
      return;
    }

    const updated: AdSlotConfig = {
      ...editingAdSlot,
      customSponsor: editingAdSlot.customSponsor
        ? {
            ...editingAdSlot.customSponsor,
            linkUrl: normalizeUrl(editingAdSlot.customSponsor.linkUrl),
          }
        : undefined,
      updatedAt: new Date().toISOString().split('T')[0],
    };

    if (isNewAd) {
      adminStore.saveAdSlot(updated);
      showToast('🎉 Novo anúncio/banner criado e ativado no portal!');
    } else {
      adminStore.saveAdSlot(updated);
      showToast(`✓ Anúncio "${updated.name}" atualizado com sucesso!`);
    }

    setIsAdModalOpen(false);
    setEditingAdSlot(null);
  };

  const handleToggleAdVisibility = (slot: AdSlotConfig) => {
    const isNowActive = adminStore.toggleAdSlotStatus(slot.id);
    if (isNowActive) {
      showToast(`🟢 Anúncio "${slot.name}" está ATIVO e VISÍVEL na página!`);
    } else {
      showToast(`⏸️ Anúncio "${slot.name}" foi PAUSADO e OCULTO.`);
    }
  };

  const handleDuplicateAd = (slot: AdSlotConfig) => {
    const cloned = adminStore.duplicateAdSlot(slot.id);
    if (cloned) {
      showToast(`📋 Cópia "${cloned.name}" gerada com sucesso!`);
    }
  };

  const handleDeleteAd = (slot: AdSlotConfig) => {
    if (window.confirm(`Tem certeza de que deseja excluir o anúncio "${slot.name}"?\nEsta ação removerá o banner definitivamente.`)) {
      adminStore.deleteAdSlot(slot.id);
      showToast(`🗑️ Anúncio "${slot.name}" excluído.`);
      if (selectedAdForPreview?.id === slot.id) {
        setIsPreviewStudioOpen(false);
        setSelectedAdForPreview(null);
      }
    }
  };

  const handleResetAdStats = (slot: AdSlotConfig) => {
    if (window.confirm(`Deseja zerar as impressões e cliques do anúncio "${slot.name}"?`)) {
      adminStore.resetAdSlotStats(slot.id);
      showToast('Estatísticas do banner zeradas.');
    }
  };

  const handleTestOfferLink = (slot?: AdSlotConfig | null) => {
    if (!slot) return;
    const rawUrl = slot.customSponsor?.linkUrl;
    const target = normalizeUrl(rawUrl);
    if (!target || target === '#' || target === 'https://#') {
      showToast('⚠️ Nenhuma URL de destino configurada para este anúncio.');
      return;
    }
    window.open(target, '_blank', 'noopener,noreferrer');
    showToast(`🌐 Abrindo link da oferta de "${slot.customSponsor?.sponsorName || 'Parceiro'}" em nova aba...`);
  };

  const handleNavigateToLiveSite = (sectionId: string, urlPath?: string) => {
    setIsPreviewStudioOpen(false);
    setIsAdModalOpen(false);

    if (sectionId.startsWith('blog-article-')) {
      const artId = sectionId.replace('blog-article-', '');
      if (onNavigateToBlogArticle) {
        onNavigateToBlogArticle(artId);
        showToast('Navegando para o artigo do blog onde o anúncio é exibido...');
        return;
      }
    }

    onBackToPortal();
    showToast('Navegando para o portal...');

    setTimeout(() => {
      let targetId = 'calculator-top';
      if (sectionId === 'salary-results') targetId = 'salary-results';
      else if (sectionId === 'tools-section') targetId = 'toolbox-section';
      else if (sectionId === 'footer-wide') targetId = 'footer-sponsor';
      else if (sectionId === 'sidebar') targetId = 'sidebar-slot';
      else if (sectionId.includes('blog')) targetId = 'ad-slot';

      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 300);
  };

  const handleOpenPreview = (slot: AdSlotConfig) => {
    setSelectedAdForPreview(slot);
    setPreviewContextSection(slot.pageSection || 'home-top');
    setPreviewModeType('page-context');
    setPreviewDevice('desktop');
    setIsPreviewStudioOpen(true);
  };

  // B2B Inquiry Handlers
  const handleApproveInquiry = (inquiryId: string) => {
    adminStore.updateB2BSponsorInquiryStatus(inquiryId, 'approved');
    showToast('🎉 Proposta aprovada com sucesso! Alocação ativada.');
  };

  const handleReviewInquiry = (inquiryId: string) => {
    adminStore.updateB2BSponsorInquiryStatus(inquiryId, 'reviewed');
    showToast('✓ Status atualizado para Em Análise.');
  };

  const handleDeleteInquiry = (inquiryId: string) => {
    if (confirm('Deseja realmente remover esta proposta?')) {
      adminStore.deleteB2BSponsorInquiry(inquiryId);
      showToast('Proposta removida do pipeline.');
    }
  };

  // CSV Export for Leads
  const handleDownloadCsv = () => {
    const csvContent = adminStore.exportLeadsCsv();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `leads_paienet_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('📥 Base de leads exportada em CSV com sucesso!');
  };

  // JSON Full Backup
  const handleDownloadBackup = () => {
    const jsonStr = adminStore.exportFullBackupJson();
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `paienet_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('💾 Backup completo baixado com sucesso!');
  };

  // ==========================================
  // VIEW: LOGIN GATE (WHEN LOCKED)
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-slate-100 selection:bg-blue-600 selection:text-white">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
          {/* Subtle glowing badge */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-blue-600/20 border border-blue-500/30 rounded-2xl flex items-center justify-center mx-auto text-blue-400">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Área Restrita do Administrador
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Gestão de Blog, Afiliados, Anúncios, E-book e Comportamento dos Usuários
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Chave de Acesso / Senha Mestre
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Digite sua senha de acesso..."
                  autoFocus
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Unlock className="w-4 h-4" />
              <span>Desbloquear Painel de Controle</span>
            </button>
          </form>

          {/* Quick Demo Helper Hint */}
          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 text-center space-y-1">
            <span className="text-[11px] text-slate-400 block font-medium">
              🔑 Senha mestre padrão de demonstração:
            </span>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-slate-700/80 rounded-lg text-xs font-mono text-emerald-400 font-bold">
              <span>admin123</span>
              <button
                type="button"
                onClick={() => setPasswordInput('admin123')}
                className="text-[10px] text-blue-300 hover:underline cursor-pointer"
              >
                (preencher)
              </button>
            </div>
          </div>

          <div className="pt-2 text-center border-t border-slate-800">
            <button
              type="button"
              onClick={onBackToPortal}
              className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar ao Portal Público</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: MAIN AUTHENTICATED ADMIN DASHBOARD
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex">
      {/* 1. Responsive & Retractable Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onBackToPortal={onBackToPortal}
        onLogout={handleLogout}
        counts={{
          articlesCount: articles.length,
          affiliatesCount: affiliates.length,
          adsCount: adSlots.length,
          assetsCount: digitalAssets.length,
          careerPassesCount: careerPackages.length,
          b2bJobsCount: b2bJobs.length,
          leadsCount: newsletterLeads.length,
          radarAlertsCount: adminStore.getRadarAlerts().length,
        }}
      />

      {/* 2. Main Workspace Layout */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-20 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Abrir menu de navegação"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Dashboard
                </span>
                <span className="text-slate-600">/</span>
                <span className="text-sm font-black text-white">
                  {activeTab === 'overview' && 'Visão Geral & Telemetria'}
                  {activeTab === 'radar' && 'Radar de Oportunidades & Fontes de Renda'}
                  {activeTab === 'career-pass' && 'Passaporte de Carreira (Kit de Aprovação)'}
                  {activeTab === 'ebook' && 'E-books & Ativos Digitais'}
                  {activeTab === 'affiliates' && 'Links de Afiliados (Amazon/SaaS)'}
                  {activeTab === 'ads' && 'Anúncios & Banners'}
                  {activeTab === 'b2b-jobs' && 'Vagas B2B & Recrutadores'}
                  {activeTab === 'articles' && 'Blog & Artigos (CMS)'}
                  {activeTab === 'newsletter' && 'Leads & Newsletter'}
                  {activeTab === 'security' && 'Configurações & Backup'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-400">Faturamento Ativo:</span>
              <strong className="text-emerald-400 font-mono">
                ${totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} CAD
              </strong>
            </div>

            <button
              type="button"
              onClick={onBackToPortal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ver Portal</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 text-xs font-semibold border border-rose-500/30 transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </header>

        {/* Main Content Workspace */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 space-y-6">
          {/* ========================================== */}
          {/* TAB 1: VISÃO GERAL & TELEMETRIA */}
          {/* ========================================== */}
          {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Opportunity Radar Smart Alert Banner */}
            <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-indigo-950/70 via-slate-950 to-slate-900 border border-indigo-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
              <div className="flex items-start gap-3.5">
                <span className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shrink-0">
                  <Radar className="w-5 h-5 animate-pulse" />
                </span>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-white">Radar de Oportunidades & Fontes de Renda</span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase border border-amber-500/30">
                      {adminStore.getRadarAlerts().length} Alavancas Ativas
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                    Acompanhe o inventário de monetização da plataforma: vendas do Passaporte de Carreira, posts sem links de afiliados, e oportunidades de vagas corporativas B2B.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('radar')}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/25 transition-all flex items-center gap-2 cursor-pointer shrink-0 self-end md:self-center"
              >
                <span>Abrir Radar de Oportunidades</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Top 4 Interactive KPI Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('radar');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900/90 text-left space-y-2 transition-all cursor-pointer group active:scale-[0.98] shadow-md"
                title="Clique para abrir o Radar de Oportunidades & Fontes de Renda"
              >
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span className="font-semibold text-slate-300 group-hover:text-emerald-300 transition-colors">Faturamento Estimado Total</span>
                  <DollarSign className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-2xl font-black text-white font-mono flex items-baseline gap-1.5">
                  ${totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-xs text-emerald-400 font-medium">CAD</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-emerald-400 font-medium">
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>5 frentes ativas de receita</span>
                  </div>
                  <span className="text-[10px] text-slate-500 group-hover:text-emerald-400 flex items-center gap-0.5 transition-colors font-bold">
                    Ver Radar <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('career-pass');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-emerald-500/30 hover:border-emerald-400 hover:bg-slate-900/90 text-left space-y-2 transition-all cursor-pointer group active:scale-[0.98] shadow-md"
                title="Clique para gerenciar pacotes do Passaporte de Carreira"
              >
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span className="font-semibold text-slate-300 group-hover:text-emerald-300 transition-colors">Passaportes de Carreira</span>
                  <Target className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-2xl font-black text-white font-mono flex items-baseline gap-1.5">
                  {careerPackages.reduce((s, p) => s + (p.totalSales || 0), 0)} <span className="text-xs text-slate-400 font-normal">vendas</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-emerald-400 font-medium">
                  <span>${careerPackages.reduce((s, p) => s + (p.totalRevenueCad || 0), 0).toFixed(2)} CAD • Core Business</span>
                  <span className="text-[10px] text-slate-500 group-hover:text-emerald-400 flex items-center gap-0.5 transition-colors font-bold">
                    Gerenciar <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('affiliates');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-900/90 text-left space-y-2 transition-all cursor-pointer group active:scale-[0.98] shadow-md"
                title="Clique para gerenciar links de afiliados"
              >
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span className="font-semibold text-slate-300 group-hover:text-blue-300 transition-colors">Cliques em Afiliados</span>
                  <MousePointerClick className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-2xl font-black text-white font-mono flex items-baseline gap-1.5">
                  {totalAffiliateClicks.toLocaleString()} <span className="text-xs text-slate-400 font-normal">cliques</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <div>
                    Taxa de conv.: <span className="text-blue-400 font-bold font-mono">10.2%</span>
                  </div>
                  <span className="text-[10px] text-slate-500 group-hover:text-blue-400 flex items-center gap-0.5 transition-colors font-bold">
                    Ver Links <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('b2b-jobs');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-900/90 text-left space-y-2 transition-all cursor-pointer group active:scale-[0.98] shadow-md"
                title="Clique para gerenciar parcerias corporativas e vagas B2B"
              >
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span className="font-semibold text-slate-300 group-hover:text-amber-300 transition-colors">Parcerias & Vagas B2B</span>
                  <Building2 className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-2xl font-black text-white font-mono flex items-baseline gap-1.5">
                  {b2bJobs.length} <span className="text-xs text-slate-400 font-normal">anunciantes</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-amber-300 font-medium font-mono">
                  <span>${b2bJobs.reduce((s, j) => s + (j.pricePaidCad || 0), 0).toFixed(2)} CAD</span>
                  <span className="text-[10px] text-slate-500 group-hover:text-amber-300 flex items-center gap-0.5 transition-colors font-bold font-sans">
                    Painel B2B <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </button>
            </div>

            {/* ======================================================== */}
            {/* PANORAMA GERAL 360°: TODAS AS ÁREAS & ECOSSISTEMA DO PORTAL */}
            {/* ======================================================== */}
            <div className="p-5 sm:p-6 rounded-3xl bg-slate-950/90 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                    <h3 className="text-sm sm:text-base font-black text-white">
                      Panorama Geral 360° do Negócio & Áreas da Plataforma
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold border border-blue-500/20">
                      Navegação & Gestão Unificada
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Clique em qualquer área abaixo para navegar diretamente, monitorar métricas e gerenciar as operações em tempo real.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* 1. Radar de Oportunidades & Catálogo */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('radar');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="p-4 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/50 text-left transition-all group cursor-pointer space-y-2.5 active:scale-[0.98]"
                >
                  <div className="flex items-center justify-between">
                    <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 group-hover:scale-110 transition-transform">
                      <Radar className="w-4 h-4" />
                    </span>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {adminStore.getRadarAlerts().length} Alavancas
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                      Radar & Catálogo de Renda
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                      Catálogo universal de soluções, simulação de metas matemáticas e alertas de monetização.
                    </p>
                  </div>
                  <div className="pt-1 text-[11px] font-bold text-indigo-400 flex items-center justify-between border-t border-slate-800/80">
                    <span>${totalRevenue.toFixed(0)} CAD Projetado</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                {/* 2. Passaporte de Carreira */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('career-pass');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="p-4 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/50 text-left transition-all group cursor-pointer space-y-2.5 active:scale-[0.98]"
                >
                  <div className="flex items-center justify-between">
                    <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                      <Target className="w-4 h-4" />
                    </span>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      {careerOrders.length} Pedidos
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                      Passaporte de Carreira (Kit)
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                      CV Canadense ATS + Simulador STAR + Testes Técnicos por tempo determinado (sem churn de SaaS).
                    </p>
                  </div>
                  <div className="pt-1 text-[11px] font-bold text-emerald-400 flex items-center justify-between border-t border-slate-800/80">
                    <span>{careerPackages.reduce((s, p) => s + (p.totalSales || 0), 0)} Vendas Ativas</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                {/* 3. Anúncios & Espaços de Mídia */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('ads');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="p-4 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-pink-500/50 text-left transition-all group cursor-pointer space-y-2.5 active:scale-[0.98]"
                >
                  <div className="flex items-center justify-between">
                    <span className="p-2 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20 group-hover:scale-110 transition-transform">
                      <Megaphone className="w-4 h-4" />
                    </span>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-pink-500/10 text-pink-300 border border-pink-500/20">
                      {adSlots.filter((s) => s.status !== 'paused').length} No Ar
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-pink-300 transition-colors">
                      Anúncios & Banners (Ad Server)
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                      Slots mapeados no topo, rodapé, artigos e holerite com anunciantes, contratos e períodos.
                    </p>
                  </div>
                  <div className="pt-1 text-[11px] font-bold text-pink-400 flex items-center justify-between border-t border-slate-800/80">
                    <span>{adSlots.reduce((s, a) => s + (a.impressions || 0), 0).toLocaleString()} Impressões</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                {/* 4. Parcerias Corporativas B2B */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('b2b-jobs');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="p-4 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-left transition-all group cursor-pointer space-y-2.5 active:scale-[0.98]"
                >
                  <div className="flex items-center justify-between">
                    <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-110 transition-transform">
                      <Building2 className="w-4 h-4" />
                    </span>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      {b2bJobs.length} Parceiros
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                      Vagas & Parcerias B2B
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                      Espaços comerciais para agências, bancos, escolas de francês, escritórios de imigração e RHs.
                    </p>
                  </div>
                  <div className="pt-1 text-[11px] font-bold text-amber-400 flex items-center justify-between border-t border-slate-800/80">
                    <span>${b2bJobs.reduce((s, j) => s + (j.pricePaidCad || 0), 0).toFixed(0)} CAD Contratos</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                {/* 5. E-books & Ativos Digitais */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('ebook');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="p-4 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-purple-500/50 text-left transition-all group cursor-pointer space-y-2.5 active:scale-[0.98]"
                >
                  <div className="flex items-center justify-between">
                    <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 group-hover:scale-110 transition-transform">
                      <BookOpen className="w-4 h-4" />
                    </span>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                      {digitalAssets.length} Ativos
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                      E-books & Downloads Digitais
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                      Guias em PDF, planilhas fiscais REER/CELIAPP e templates de contracheque para download.
                    </p>
                  </div>
                  <div className="pt-1 text-[11px] font-bold text-purple-400 flex items-center justify-between border-t border-slate-800/80">
                    <span>{ebookOrders.length} Downloads Pagos</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                {/* 6. Links de Afiliados */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('affiliates');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="p-4 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-blue-500/50 text-left transition-all group cursor-pointer space-y-2.5 active:scale-[0.98]"
                >
                  <div className="flex items-center justify-between">
                    <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:scale-110 transition-transform">
                      <Link2 className="w-4 h-4" />
                    </span>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                      {affiliates.length} Parceiros
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors">
                      Afiliados (Amazon, FinTech, Cursos)
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                      Monetização passiva via links de indicação nos artigos do blog e abaixo do cálculo de salário.
                    </p>
                  </div>
                  <div className="pt-1 text-[11px] font-bold text-blue-400 flex items-center justify-between border-t border-slate-800/80">
                    <span>{totalAffiliateClicks} Cliques Gerados</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                {/* 7. Blog & CMS Estratégico */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('articles');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="p-4 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-teal-500/50 text-left transition-all group cursor-pointer space-y-2.5 active:scale-[0.98]"
                >
                  <div className="flex items-center justify-between">
                    <span className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 group-hover:scale-110 transition-transform">
                      <FileText className="w-4 h-4" />
                    </span>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/20">
                      {articles.length} Artigos
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-teal-300 transition-colors">
                      Blog, SEO & Intenções de Busca
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                      Artigos mapeados por intenção de busca (Informativa, Comparativa, Transacional) e CTAs diretos.
                    </p>
                  </div>
                  <div className="pt-1 text-[11px] font-bold text-teal-400 flex items-center justify-between border-t border-slate-800/80">
                    <span>{articles.reduce((s, a) => s + (a.viewsCount || 0), 0).toLocaleString()} Leituras</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                {/* 8. CRM de Leads & Newsletter */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('newsletter');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="p-4 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/50 text-left transition-all group cursor-pointer space-y-2.5 active:scale-[0.98]"
                >
                  <div className="flex items-center justify-between">
                    <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                      <Users className="w-4 h-4" />
                    </span>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      {newsletterLeads.length} Leads
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                      CRM de Leads & Nutrição
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                      Funil de vendas visual (Topo, Meio, Fundo), pontuação de temperatura e scripts para WhatsApp.
                    </p>
                  </div>
                  <div className="pt-1 text-[11px] font-bold text-emerald-400 flex items-center justify-between border-t border-slate-800/80">
                    <span>{newsletterLeads.filter((l) => l.temperature === 'quente' || l.temperature === 'vip').length} Leads Quentes</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              </div>
            </div>

            {/* Charts Section: Pageviews Over Time + Tool Usage */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Traffic Chart (7 cols) */}
              <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-white">Evolução do Tráfego & Cálculos</h3>
                    <p className="text-xs text-slate-400">Visualizações diárias de página vs cálculos de salário executados</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold">
                    Últimos 7 dias
                  </span>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorCalc" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                      <YAxis stroke="#64748b" fontSize={11} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          borderColor: '#334155',
                          borderRadius: '12px',
                          color: '#fff',
                          fontSize: '12px',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="pageViews"
                        name="Visualizações"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorPv)"
                      />
                      <Area
                        type="monotone"
                        dataKey="salaryCalculations"
                        name="Cálculos Feitos"
                        stroke="#10b981"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorCalc)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Tool Usage Breakdown (5 cols) */}
              <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-white">Comportamento por Ferramenta</h3>
                    <p className="text-xs text-slate-400">Distribuição percentual de engajamento do usuário</p>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  {toolUsageData.map((tool) => (
                    <div key={tool.name} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-300 font-medium">{tool.name}</span>
                        <span className="font-bold text-white">{tool.value}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${tool.value}%`, backgroundColor: tool.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Live User Stream / Telemetria em Tempo Real */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <h3 className="font-bold text-sm text-white">
                    Feed de Acesso e Comportamento em Tempo Real
                  </h3>
                </div>
                <span className="text-xs text-slate-400">
                  {liveEvents.length} eventos monitorados
                </span>
              </div>

              <div className="divide-y divide-slate-800/80 max-h-72 overflow-y-auto pr-1">
                {liveEvents.map((evt) => (
                  <div key={evt.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono text-[10px]">
                        {evt.timestamp}
                      </span>
                      <div>
                        <div className="font-semibold text-slate-200">{evt.summary}</div>
                        {evt.details && <div className="text-[11px] text-slate-400">{evt.details}</div>}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[11px] font-medium text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
                        📍 {evt.location}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 2: GESTÃO DO BLOG & ARTIGOS */}
        {/* ========================================== */}
        {activeTab === 'articles' && (
          <div className="space-y-5">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  value={articleSearch}
                  onChange={(e) => setArticleSearch(e.target.value)}
                  placeholder="Buscar artigo por título ou tema..."
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleOpenNewArticleBlank}
                  className="w-1/2 sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Em Branco</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenTemplateSelector}
                  className="w-1/2 sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-extrabold rounded-xl shadow-md transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Novo com Template Estratégico</span>
                </button>
              </div>
            </div>

            {/* Articles Table */}
            <div className="bg-slate-950/80 rounded-2xl border border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800 text-[10px]">
                    <tr>
                      <th className="p-3.5">Intenção & Artigo Editorial</th>
                      <th className="p-3.5">Funil & SEO</th>
                      <th className="p-3.5">Leituras</th>
                      <th className="p-3.5">CTA Ferramenta</th>
                      <th className="p-3.5">Oferta / Afiliado</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-sans">
                    {articles
                      .filter((a) =>
                        a.title.pt.toLowerCase().includes(articleSearch.toLowerCase()) ||
                        a.category.toLowerCase().includes(articleSearch.toLowerCase()) ||
                        (a.targetKeyword && a.targetKeyword.toLowerCase().includes(articleSearch.toLowerCase()))
                      )
                      .map((article) => {
                        const isExpanded = expandedArticleId === article.id;
                        const intentLabel =
                          article.searchIntent === 'transactional'
                            ? { label: '🛒 Transacional', color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' }
                            : article.searchIntent === 'commercial_investigation'
                            ? { label: '⚖️ Comparativo / Comercial', color: 'bg-amber-500/15 text-amber-300 border-amber-500/30' }
                            : article.searchIntent === 'navigational'
                            ? { label: '🧭 Navegacional', color: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30' }
                            : { label: '💡 Informativa', color: 'bg-blue-500/15 text-blue-300 border-blue-500/30' };

                        const funnelBadge =
                          article.funnelStage === 'fundo'
                            ? { label: 'Fundo (Decisão)', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' }
                            : article.funnelStage === 'meio'
                            ? { label: 'Meio (Nutrição)', color: 'bg-amber-500/15 text-amber-400 border-amber-500/30' }
                            : { label: 'Topo (Atração)', color: 'bg-blue-500/15 text-blue-400 border-blue-500/30' };

                        return (
                          <React.Fragment key={article.id}>
                            <tr
                              onClick={() => setExpandedArticleId(isExpanded ? null : article.id)}
                              className={`hover:bg-slate-900/60 transition-colors cursor-pointer ${
                                isExpanded ? 'bg-slate-900/50' : ''
                              }`}
                            >
                              {/* 1. Intenção & Título */}
                              <td className="p-3.5">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span
                                      className={`px-2 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-wider ${intentLabel.color}`}
                                    >
                                      {intentLabel.label}
                                    </span>
                                    <span className="capitalize px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                                      {article.category}
                                    </span>
                                  </div>
                                  <div className="font-extrabold text-white text-xs sm:text-sm line-clamp-1 hover:text-blue-300 transition-colors">
                                    {article.title.pt || article.title.fr}
                                  </div>
                                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                                    <span>{article.readTime}</span>
                                    <span>•</span>
                                    <span>{article.date}</span>
                                    {article.hasEbookCta && (
                                      <>
                                        <span>•</span>
                                        <span className="text-[10px] text-amber-400 font-semibold flex items-center gap-0.5">
                                          <BookOpen className="w-2.5 h-2.5" />
                                          <span>E-book CTA</span>
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </td>

                              {/* 2. Funil & Termos de Busca */}
                              <td className="p-3.5">
                                <div className="space-y-1">
                                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border inline-block ${funnelBadge.color}`}>
                                    {funnelBadge.label}
                                  </span>
                                  {article.targetKeyword ? (
                                    <div className="text-[10px] text-slate-400 font-mono truncate max-w-[160px]" title={article.targetKeyword}>
                                      🔍 {article.targetKeyword}
                                    </div>
                                  ) : (
                                    <div className="text-[10px] text-slate-500 italic">Palavra-chave não definida</div>
                                  )}
                                </div>
                              </td>

                              {/* 3. Leituras */}
                              <td className="p-3.5 font-mono text-slate-200">
                                <div className="font-bold">{article.viewsCount.toLocaleString()}</div>
                                <span className="text-[10px] text-slate-500 font-sans">visualizações</span>
                              </td>

                              {/* 4. CTA Ferramenta */}
                              <td className="p-3.5">
                                <span className="px-2 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono text-[10px]">
                                  {article.ctaTool || 'nenhum'}
                                </span>
                              </td>

                              {/* 5. Oferta Afiliado */}
                              <td className="p-3.5">
                                {article.affiliateOffer ? (
                                  <span className="text-emerald-400 font-medium flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                                    <span className="truncate max-w-[130px] font-bold text-[11px]">{article.affiliateOffer.partnerName}</span>
                                  </span>
                                ) : (
                                  <span className="text-slate-500 text-[11px]">-</span>
                                )}
                              </td>

                              {/* 6. Status de Publicação */}
                              <td className="p-3.5" onClick={(e) => e.stopPropagation()}>
                                <button
                                  type="button"
                                  onClick={() => {
                                    adminStore.saveArticle({ ...article, published: !article.published });
                                    showToast(`Artigo ${!article.published ? 'publicado no blog' : 'movido para rascunho'}`);
                                  }}
                                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold border cursor-pointer transition-colors ${
                                    article.published
                                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30'
                                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                                  }`}
                                >
                                  {article.published ? 'Publicado ✓' : 'Rascunho'}
                                </button>
                              </td>

                              {/* 7. Ações & Toggle Expand */}
                              <td className="p-3.5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => setExpandedArticleId(isExpanded ? null : article.id)}
                                    className={`p-1.5 rounded-lg transition-colors cursor-pointer border ${
                                      isExpanded
                                        ? 'bg-blue-600 text-white border-blue-500'
                                        : 'bg-slate-800 text-slate-300 hover:text-white border-slate-700 hover:bg-slate-700'
                                    }`}
                                    title={isExpanded ? 'Recolher detalhes' : 'Expandir estratégia de SEO e funil'}
                                  >
                                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                  </button>

                                  {onNavigateToBlogArticle && (
                                    <button
                                      type="button"
                                      onClick={() => onNavigateToBlogArticle(article.id)}
                                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white transition-colors cursor-pointer"
                                      title="Ver Artigo no Blog ao Vivo"
                                    >
                                      <Eye className="w-3.5 h-3.5" />
                                    </button>
                                  )}

                                  <button
                                    type="button"
                                    onClick={() => handleDuplicateArticle(article)}
                                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white transition-colors cursor-pointer"
                                    title="Duplicar Artigo como Rascunho"
                                  >
                                    <Copy className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingArticle(article);
                                      setEditorViewMode('edit');
                                      setIsArticleModalOpen(true);
                                    }}
                                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white transition-colors cursor-pointer"
                                    title="Editar Artigo & Monetização"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleDeleteArticle(article.id)}
                                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition-colors cursor-pointer"
                                    title="Excluir Artigo"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>

                            {/* Linha Expandida Interativa com Detalhes de Marketing Digital & Ações */}
                            {isExpanded && (
                              <tr className="bg-slate-900/90 border-b border-slate-800">
                                <td colSpan={7} className="p-4 sm:p-6 space-y-4">
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Bloco 1: Estratégia de Busca & SEO */}
                                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2.5">
                                      <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                                          <span>🎯 Intenção de Busca (Marketing Digital)</span>
                                        </span>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${intentLabel.color}`}>
                                          {intentLabel.label}
                                        </span>
                                      </div>

                                      <p className="text-xs text-slate-300 leading-relaxed">
                                        {article.searchIntent === 'transactional'
                                          ? 'O usuário busca diretamente resolver uma necessidade de contratação, download ou compra imediata (fundo de funil com altíssima conversão).'
                                          : article.searchIntent === 'commercial_investigation'
                                          ? 'O usuário compara opções e quer saber "o que é melhor" antes de tomar uma decisão financeira ou de carreira (meio de funil).'
                                          : article.searchIntent === 'navigational'
                                          ? 'O usuário procura diretamente a plataforma ou a ferramenta específica pelo nome de marca.'
                                          : 'O usuário busca aprender um conceito, entender como funcionam leis e alíquotas fiscais (topo de funil com alto volume de tráfego orgânico).'}
                                      </p>

                                      <div className="pt-2 border-t border-slate-800 space-y-1">
                                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">Palavra-chave do Google:</span>
                                        <code className="text-xs text-amber-300 font-mono bg-slate-900 px-2 py-1 rounded block border border-slate-800">
                                          {article.targetKeyword || 'Termo geral sobre ' + article.category}
                                        </code>
                                      </div>
                                    </div>

                                    {/* Bloco 2: Funil & Mecanismos de Conversão */}
                                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2.5">
                                      <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                                        <span>⚡ Mecanismo de Monetização Vinculado</span>
                                      </span>

                                      <div className="space-y-2 text-xs">
                                        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
                                          <span className="text-slate-400">Ferramenta Interativa:</span>
                                          <span className="font-mono text-indigo-400 font-bold">{article.ctaTool || 'Nenhuma'}</span>
                                        </div>

                                        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
                                          <span className="text-slate-400">Parceiro Afiliado:</span>
                                          <span className="font-bold text-emerald-400">
                                            {article.affiliateOffer ? article.affiliateOffer.partnerName : 'Nenhum parceiro'}
                                          </span>
                                        </div>

                                        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
                                          <span className="text-slate-400">Venda de E-book Integrada:</span>
                                          <span className="font-bold text-amber-400">
                                            {article.hasEbookCta ? 'Ativo ($9.99 CAD)' : 'Desativado'}
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Bloco 3: Idiomas & Resumo Rápido */}
                                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2.5">
                                      <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                                        <span>🌐 Resumo Editorial & Rota</span>
                                      </span>

                                      <p className="text-xs text-slate-300 italic line-clamp-3 leading-relaxed">
                                        &ldquo;{article.excerpt?.pt || article.excerpt?.fr || 'Sem resumo cadastrado.'}&rdquo;
                                      </p>

                                      <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
                                        <span>Rota: <code className="text-slate-300">/?tool=blog&article={article.id}</code></span>
                                        <span className="text-emerald-400 font-bold">{article.viewsCount} acessos</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Botões de Ação Imediata no Card Expandido */}
                                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
                                    <div className="text-xs text-slate-400 flex items-center gap-2">
                                      <span>Artigo ID: <code className="font-mono text-slate-300">{article.id}</code></span>
                                      <span>•</span>
                                      <span>Status: <strong className={article.published ? 'text-emerald-400' : 'text-slate-400'}>{article.published ? 'No Ar' : 'Rascunho Privado'}</strong></span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      {onNavigateToBlogArticle && (
                                        <button
                                          type="button"
                                          onClick={() => onNavigateToBlogArticle(article.id)}
                                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                                        >
                                          <Eye className="w-3.5 h-3.5" />
                                          <span>Ler no Portal ao Vivo</span>
                                        </button>
                                      )}

                                      <button
                                        type="button"
                                        onClick={() => {
                                          setEditingArticle(article);
                                          setEditorViewMode('edit');
                                          setIsArticleModalOpen(true);
                                        }}
                                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                                      >
                                        <Edit2 className="w-3.5 h-3.5" />
                                        <span>Editar Conteúdo & Estratégia de Conversão</span>
                                      </button>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB: RADAR DE OPORTUNIDADES & FONTES DE RENDA */}
        {/* ========================================== */}
        {activeTab === 'radar' && (
          <OpportunityRadarTab
            onNavigateTab={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* ========================================== */}
        {/* TAB: PASSAPORTE DE EMPREGABILIDADE (CORE PRODUCT) */}
        {/* ========================================== */}
        {activeTab === 'career-pass' && (
          <CareerPassAdminTab />
        )}

        {/* ========================================== */}
        {/* TAB: VAGAS B2B & RECRUTADORES */}
        {/* ========================================== */}
        {activeTab === 'b2b-jobs' && (
          <B2BJobsAdminTab />
        )}

        {/* ========================================== */}
        {/* TAB 3: GESTÃO DE LINKS DE AFILIADOS */}
        {/* ========================================== */}
        {activeTab === 'affiliates' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white">Redes & Parcerias de Afiliados</h3>
                <p className="text-xs text-slate-400">
                  Gerencie URLs de destino, tags UTM e acompanhe cliques e conversões estimadas.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const newAff: AffiliatePartner = {
                    id: generateAffiliateId(),
                    name: 'Novo Parceiro',
                    category: 'bancos',
                    targetUrl: 'https://',
                    utmSource: 'paienet_qc',
                    utmMedium: 'blog',
                    utmCampaign: 'promo',
                    commissionType: 'CPA',
                    commissionValue: '$30 CAD',
                    active: true,
                    clicksCount: 0,
                    estimatedConversions: 0,
                    estimatedRevenueCad: 0,
                    description: '',
                  };
                  setEditingAffiliate(newAff);
                  setIsAffiliateModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar Parceiro Afiliado</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {affiliates.map((aff) => (
                <div
                  key={aff.id}
                  className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4 relative"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{aff.name}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            aff.active
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {aff.active ? 'Ativo' : 'Pausado'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{aff.description}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setEditingAffiliate(aff);
                        setIsAffiliateModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* URL Box */}
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-2 text-xs">
                    <span className="text-slate-400 font-mono truncate text-[11px]">
                      {aff.targetUrl}?utm_source={aff.utmSource}&utm_medium={aff.utmMedium}
                    </span>
                    <a
                      href={aff.targetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 shrink-0 inline-flex items-center gap-1"
                    >
                      <span>Testar</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-800/80 text-center">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Cliques</span>
                      <span className="font-bold text-white text-sm">{aff.clicksCount}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Comissão</span>
                      <span className="font-bold text-blue-400 text-xs">{aff.commissionValue}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Receita Est.</span>
                      <span className="font-bold text-emerald-400 text-sm">
                        ${aff.estimatedRevenueCad.toFixed(2)} CAD
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 4: GESTÃO DE ANÚNCIOS & BANNERS */}
        {/* ========================================== */}
        {activeTab === 'ads' && (
          <div className="space-y-6">
            {/* Header with Quick Actions */}
            <div className="bg-slate-950/80 p-5 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-bold text-xs border border-blue-500/20">
                  <Megaphone className="w-3.5 h-3.5" />
                  <span>Central de Monetização & Gestão de Banners</span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-white">
                  Controle de Anúncios, Patrocinadores e Espaços Publicitários
                </h3>
                <p className="text-xs text-slate-400 max-w-2xl">
                  Gerencie o status ativo/visível de cada anúncio, mapeie exatamente em qual seção e URL ele é renderizado, teste links de destino e pré-visualize o layout antes de publicar.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Deseja redefinir todos os banners e espaços para a configuração padrão de fábrica?')) {
                      adminStore.restoreDefaultData();
                      showToast('Configuração padrão de banners restaurada!');
                    }
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Restaurar anúncios originais"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                  <span>Restaurar Padrão</span>
                </button>

                <button
                  type="button"
                  onClick={handleCreateNewAd}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Novo Anúncio / Banner</span>
                </button>
              </div>
            </div>

            {/* KPI Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                <span className="text-[11px] text-slate-400 uppercase font-semibold block">Total de Banners</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl sm:text-2xl font-black text-white">{adMetrics.total}</span>
                  <span className="text-[10px] text-slate-400">cadastrados</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-emerald-400 uppercase font-semibold block">Ativos & Visíveis</span>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl sm:text-2xl font-black text-emerald-400">{adMetrics.activeCount}</span>
                  <span className="text-[10px] text-emerald-500/80">no ar no site</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                <span className="text-[11px] text-slate-400 uppercase font-semibold block">Pausados / Ocultos</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl sm:text-2xl font-black text-slate-400">{adMetrics.pausedCount}</span>
                  <span className="text-[10px] text-slate-400">não exibidos</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                <span className="text-[11px] text-slate-400 uppercase font-semibold block">Impressões Totais</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl sm:text-2xl font-black text-blue-400">
                    {adMetrics.totalImpressions.toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 col-span-2 sm:col-span-1">
                <span className="text-[11px] text-slate-400 uppercase font-semibold block">Cliques & CTR Médio</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl sm:text-2xl font-black text-amber-400">
                    {adMetrics.totalClicks.toLocaleString('pt-BR')}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded">
                    {adMetrics.ctr}% CTR
                  </span>
                </div>
              </div>
            </div>

            {/* Sub-Tabs: Mapa de Loteamento vs Banners vs Propostas B2B */}
            <div className="flex flex-wrap items-center gap-2 bg-slate-950/90 p-1.5 rounded-2xl border border-slate-800">
              <button
                type="button"
                onClick={() => setAdsSubTab('loteamento-map')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  adsSubTab === 'loteamento-map'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>🗺️ Mapa de Loteamento do Site (Zonas & Vitrines)</span>
              </button>

              <button
                type="button"
                onClick={() => setAdsSubTab('banners-list')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  adsSubTab === 'banners-list'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Megaphone className="w-3.5 h-3.5" />
                <span>📢 Banners Cadastrados ({adSlots.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setAdsSubTab('inquiries-crm')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 relative ${
                  adsSubTab === 'inquiries-crm'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>💼 Propostas Comerciais & Anunciantes B2B</span>
                {b2bInquiries.length > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    b2bInquiries.some(i => i.status === 'pending')
                      ? 'bg-amber-400 text-slate-950 animate-pulse'
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {b2bInquiries.length} {b2bInquiries.some(i => i.status === 'pending') ? 'novas' : ''}
                  </span>
                )}
              </button>
            </div>

            {/* SUB-VIEW 1: MAPA DE LOTEAMENTO DO SITE */}
            {adsSubTab === 'loteamento-map' && (
              <div className="space-y-6">
                {/* Loteamento Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[11px] text-slate-400 uppercase font-bold block">Capacidade do Loteamento</span>
                    <span className="text-xl sm:text-2xl font-black text-white">6 Zonas Estratégicas</span>
                    <p className="text-[10px] text-slate-500">Mapeadas por temperatura e estágio do funil do usuário.</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
                    <span className="text-[11px] text-emerald-400 uppercase font-bold block">Faturamento Atual de Lotes</span>
                    <span className="text-xl sm:text-2xl font-black text-emerald-400">$1.390,00 CAD / mês</span>
                    <p className="text-[10px] text-emerald-500/80">3 lotes alugados diretamente + fallback AdSense ativo.</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-500/30 space-y-1">
                    <span className="text-[11px] text-blue-400 uppercase font-bold block">Potencial Máximo Estimado</span>
                    <span className="text-xl sm:text-2xl font-black text-blue-300">$2.589,00 CAD / mês</span>
                    <p className="text-[10px] text-blue-400/80">Com 100% dos lotes ocupados por patrocinadores diretos.</p>
                  </div>
                </div>

                {/* 6 Lots Blueprint Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    {
                      id: 'home-top',
                      lotNumber: 'Lote 1',
                      name: 'Header Leaderboard (Topo Global)',
                      section: 'home-top',
                      route: '/?tool=net-calc#calculator-top',
                      format: '728×90 / Responsivo',
                      priceCad: 380,
                      status: 'adsense',
                      statusLabel: 'Google AdSense (Livre para Aluguel Direto)',
                      currentSponsor: 'Google Display Network',
                      suitable: 'Bancos, Fintechs, Imigração e Telecom',
                    },
                    {
                      id: 'salary-results',
                      lotNumber: 'Lote 2',
                      name: 'Pós-Contracheque & Resultados de Salário',
                      section: 'salary-results',
                      route: '/?tool=net-calc#salary-results',
                      format: 'Banner Contextual Wide (640×160)',
                      priceCad: 520,
                      status: 'occupied',
                      statusLabel: '🟢 Alugado por Patrocinador Direto',
                      currentSponsor: 'Desjardins REER & CELIAPP',
                      contractEnd: '2026-12-31',
                      suitable: 'Previdência REER, Seguros e Empréstimos',
                    },
                    {
                      id: 'tools-section',
                      lotNumber: 'Lote 3',
                      name: 'Grade de Ferramentas & Simuladores (Toolbox)',
                      section: 'tools-section',
                      route: '/?tool=net-calc#toolbox-section',
                      format: 'Banner Amplo de Rodapé de Módulo',
                      priceCad: 420,
                      status: 'available',
                      statusLabel: '⚪ Disponível para Venda',
                      currentSponsor: 'Disponível no Mídia Kit',
                      suitable: 'Cursos de Francês, RH e Recrutamento',
                    },
                    {
                      id: 'blog-article',
                      lotNumber: 'Lote 4',
                      name: 'Corpo dos Artigos do Blog Editorial',
                      section: 'blog-article',
                      route: '/?tool=blog#ad-slot',
                      format: 'Retângulo Integrado (300×250 / Fluido)',
                      priceCad: 290,
                      status: 'occupied',
                      statusLabel: '🟢 3 Artigos Patrocinados Ativos',
                      currentSponsor: 'Wise Câmbio + Desjardins Assurances',
                      suitable: 'Artigos sob Encomenda e Do-Follow SEO',
                    },
                    {
                      id: 'sidebar',
                      lotNumber: 'Lote 5',
                      name: 'Barra Lateral de Resultados & Comparativo',
                      section: 'sidebar',
                      route: '/?tool=net-calc#sidebar-slot',
                      format: 'Card Vertical de 300px',
                      priceCad: 320,
                      status: 'adsense',
                      statusLabel: '🔵 AdSense Fallback Ativo',
                      currentSponsor: 'Google AdSense Automático',
                      suitable: 'Serviços de Contabilidade CPA e Consultoria',
                    },
                    {
                      id: 'footer-wide',
                      lotNumber: 'Lote 6',
                      name: 'Rodapé Amplo Geral do Portal (Pré-Footer)',
                      section: 'footer-wide',
                      route: '/#footer-sponsor',
                      format: 'Banner Horizontal Completo de Rodapé',
                      priceCad: 260,
                      status: 'occupied',
                      statusLabel: '🟢 Alugado por Patrocinador Direto',
                      currentSponsor: 'Plataforma Parceira de Empregos',
                      contractEnd: '2026-10-31',
                      suitable: 'Fortalecimento Institucional de Marca',
                    },
                  ].map((lot) => (
                    <div
                      key={lot.id}
                      className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30">
                            {lot.lotNumber}
                          </span>
                          <span className="text-sm font-black text-emerald-400">
                            ${lot.priceCad} CAD <span className="text-[10px] text-slate-500">/ mês</span>
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-white leading-snug">{lot.name}</h4>
                        <div className="text-[11px] text-slate-400 space-y-1 pt-1 border-t border-slate-900">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Formato:</span>
                            <span className="font-mono text-slate-300">{lot.format}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Status:</span>
                            <span className={lot.status === 'occupied' ? 'text-emerald-400 font-bold' : lot.status === 'available' ? 'text-amber-400 font-bold' : 'text-blue-400 font-bold'}>
                              {lot.statusLabel}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Anunciante:</span>
                            <span className="text-white font-semibold">{lot.currentSponsor}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Rota:</span>
                            <code className="text-[10px] text-slate-400 font-mono truncate max-w-[150px]">{lot.route}</code>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-900 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const slot = adSlots.find(s => s.pageSection === lot.section) || adSlots[0];
                            handleOpenPreview(slot);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs border border-slate-700 flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5 text-blue-400" />
                          <span>Ver Mockup</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleNavigateToLiveSite(lot.section, lot.route)}
                          className="px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 font-bold text-xs border border-blue-500/30 flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <span>Ver ao Vivo</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUB-VIEW 2: PROPOSTAS B2B RECEBIDAS (CRM DE ANUNCIANTES) */}
            {adsSubTab === 'inquiries-crm' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div>
                    <h4 className="text-sm font-bold text-white">Solicitações de Loteamento & Artigos sob Encomenda</h4>
                    <p className="text-xs text-slate-400">
                      Propostas registradas por empresas e anunciantes através da página pública de Mídia Kit.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-xl border border-blue-500/20">
                    Total: {b2bInquiries.length} propostas no pipeline
                  </span>
                </div>

                <div className="bg-slate-950/80 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-800 text-[10px]">
                        <tr>
                          <th className="p-4">Protocolo & Data</th>
                          <th className="p-4">Empresa & Contato</th>
                          <th className="p-4">Lote Escolhido</th>
                          <th className="p-4">Valor Previsto</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Briefing / Mensagem</th>
                          <th className="p-4 text-right">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-sans">
                        {b2bInquiries.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="p-8 text-center text-slate-500">
                              Nenhuma solicitação comercial recebida até o momento.
                            </td>
                          </tr>
                        ) : (
                          b2bInquiries.map((inq) => (
                            <tr key={inq.id} className="hover:bg-slate-900/40 transition-colors">
                              <td className="p-4 align-middle">
                                <span className="font-mono font-bold text-white text-xs block">{inq.id}</span>
                                <span className="text-[10px] text-slate-500">{inq.createdAt}</span>
                              </td>

                              <td className="p-4 align-middle">
                                <div className="space-y-0.5">
                                  <span className="font-bold text-white text-xs block">{inq.companyName}</span>
                                  <span className="text-[11px] text-slate-400 block">{inq.contactName}</span>
                                  <span className="text-[10px] text-blue-400 font-mono block">{inq.email}</span>
                                  {inq.phone && (
                                    <span className="text-[10px] text-slate-400 block">{inq.phone}</span>
                                  )}
                                </div>
                              </td>

                              <td className="p-4 align-middle">
                                <span className="font-bold text-slate-200 block text-xs">{inq.slotName}</span>
                                <span className="text-[10px] text-slate-400 block uppercase">
                                  Período: {inq.billingDuration}
                                </span>
                              </td>

                              <td className="p-4 align-middle">
                                <span className="font-black text-emerald-400 text-sm block">
                                  ${inq.priceCad.toFixed(2)} CAD
                                </span>
                              </td>

                              <td className="p-4 align-middle">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                                    inq.status === 'approved'
                                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                      : inq.status === 'reviewed'
                                      ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                                      : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                                  }`}
                                >
                                  {inq.status === 'approved'
                                    ? 'Aprovada / Ativa'
                                    : inq.status === 'reviewed'
                                    ? 'Em Análise'
                                    : 'Pendente'}
                                </span>
                              </td>

                              <td className="p-4 align-middle max-w-xs">
                                <p className="text-[11px] text-slate-300 line-clamp-2">
                                  {inq.message || 'Sem observações adicionais.'}
                                </p>
                              </td>

                              <td className="p-4 align-middle text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  {inq.phone && (
                                    <a
                                      href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}?text=Olá ${encodeURIComponent(inq.contactName)}, recebemos sua proposta de loteamento para a ${encodeURIComponent(inq.companyName)} no PaieNet.`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-all cursor-pointer"
                                      title="Falar no WhatsApp"
                                    >
                                      <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                  )}

                                  {inq.status !== 'approved' && (
                                    <button
                                      type="button"
                                      onClick={() => handleApproveInquiry(inq.id)}
                                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-xs cursor-pointer"
                                      title="Aprovar e ativar alocação"
                                    >
                                      Aprovar
                                    </button>
                                  )}

                                  {inq.status === 'pending' && (
                                    <button
                                      type="button"
                                      onClick={() => handleReviewInquiry(inq.id)}
                                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all border border-slate-700 cursor-pointer"
                                    >
                                      Revisar
                                    </button>
                                  )}

                                  <button
                                    type="button"
                                    onClick={() => handleDeleteInquiry(inq.id)}
                                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all cursor-pointer"
                                    title="Remover proposta"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-VIEW 3: BANNERS CADASTROS & DETALHES (TABELA ORIGINAL) */}
            {adsSubTab === 'banners-list' && (
              <div className="space-y-4">
                {/* Filter Pills & Live Search Bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {[
                      { id: 'all', label: `Todos (${adMetrics.total})` },
                      { id: 'active', label: `🟢 Ativos (${adMetrics.activeCount})` },
                      { id: 'paused', label: `⏸️ Pausados (${adMetrics.pausedCount})` },
                      { id: 'custom-sponsor', label: '🟣 Patrocinadores' },
                      { id: 'adsense', label: 'AdSense' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setAdFilter(item.id as any)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                          adFilter === item.id
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>

                  <div className="relative w-full sm:w-72">
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={adSearch}
                      onChange={(e) => setAdSearch(e.target.value)}
                      placeholder="Filtrar por nome, anunciante, local..."
                      className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

            {/* Table of Ads / Banners */}
            <div className="bg-slate-950/80 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-800 text-[10px]">
                    <tr>
                      <th className="p-4">Status & Visibilidade</th>
                      <th className="p-4">Anúncio / Formato</th>
                      <th className="p-4">Local Exato & Rota na Página</th>
                      <th className="p-4">Patrocinador & Link de Destino</th>
                      <th className="p-4 text-center">Desempenho</th>
                      <th className="p-4 text-right">Ações (CRUD)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-sans">
                    {filteredAdSlots.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-500">
                          <div className="max-w-xs mx-auto space-y-2">
                            <p className="text-sm font-semibold text-slate-400">Nenhum banner encontrado</p>
                            <p className="text-xs">Tente ajustar a busca ou os filtros de visibilidade acima.</p>
                            <button
                              type="button"
                              onClick={() => {
                                setAdFilter('all');
                                setAdSearch('');
                              }}
                              className="mt-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold cursor-pointer"
                            >
                              Limpar Filtros
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredAdSlots.map((slot) => {
                        const isVisible = slot.status !== 'paused';
                        const isCustomSponsor = slot.status === 'custom-sponsor' && Boolean(slot.customSponsor);
                        const formatLabel =
                          slot.format === 'top-leaderboard'
                            ? 'Leaderboard (728×90)'
                            : slot.format === 'bottom-wide'
                            ? 'Rodapé Amplo (970×90)'
                            : slot.format === 'rectangle'
                            ? 'Retângulo (300×250)'
                            : 'Barra Lateral (300×600)';

                        return (
                          <tr key={slot.id} className="hover:bg-slate-900/50 transition-colors">
                            {/* 1. Status & Visibilidade */}
                            <td className="p-4 align-middle">
                              <div className="space-y-1.5">
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black tracking-wide border">
                                  {isVisible ? (
                                    <span className="inline-flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 border-emerald-500/30">
                                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                      <span>ATIVO & VISÍVEL</span>
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1.5 text-slate-400 bg-slate-800 border-slate-700">
                                      <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                                      <span>PAUSADO / OCULTO</span>
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => handleToggleAdVisibility(slot)}
                                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                                      isVisible
                                        ? 'bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30'
                                        : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30'
                                    }`}
                                    title={isVisible ? 'Clique para pausar e ocultar do site' : 'Clique para ativar e tornar visível'}
                                  >
                                    {isVisible ? (
                                      <>
                                        <Pause className="w-2.5 h-2.5" />
                                        <span>Pausar</span>
                                      </>
                                    ) : (
                                      <>
                                        <Play className="w-2.5 h-2.5" />
                                        <span>Ativar</span>
                                      </>
                                    )}
                                  </button>
                                  <span className="text-[10px] text-slate-500">
                                    {isVisible ? 'Exibido no site' : 'Oculto'}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* 2. Nome & Formato */}
                            <td className="p-4 align-middle">
                              <div className="space-y-1">
                                <div className="font-extrabold text-white text-xs sm:text-sm">
                                  {slot.name}
                                </div>
                                <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                                    {formatLabel}
                                  </span>
                                  <span
                                    className={`px-1.5 py-0.5 rounded font-bold ${
                                      isCustomSponsor
                                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                    }`}
                                  >
                                    {isCustomSponsor ? 'Patrocinador Direto' : 'AdSense'}
                                  </span>
                                </div>
                                {slot.description && (
                                  <p className="text-[11px] text-slate-400 line-clamp-1 max-w-xs">
                                    {slot.description}
                                  </p>
                                )}
                              </div>
                            </td>

                            {/* 3. Local Exato & Rota Mapeada */}
                            <td className="p-4 align-middle">
                              <div className="space-y-1">
                                <div className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                                  <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                                  <span>{slot.pageSectionLabel || slot.pageSection}</span>
                                </div>
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <code className="text-[10px] text-slate-400 font-mono bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                                    {slot.pageUrlPath || '/'}
                                  </code>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      navigator.clipboard?.writeText(slot.pageUrlPath || '/');
                                      showToast('Rota copiada para a área de transferência!');
                                    }}
                                    className="p-1 rounded text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                                    title="Copiar rota"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleNavigateToLiveSite(slot.pageSection, slot.pageUrlPath)}
                                    className="text-[10px] text-blue-400 hover:text-blue-300 hover:underline inline-flex items-center gap-0.5 ml-1 font-semibold cursor-pointer"
                                    title="Ir para este local no site"
                                  >
                                    <span>Ver no site</span>
                                    <ArrowUpRight className="w-2.5 h-2.5" />
                                  </button>
                                </div>
                              </div>
                            </td>

                            {/* 4. Patrocinador, Vínculo Contratual & Período */}
                            <td className="p-4 align-middle">
                              {isCustomSponsor && slot.customSponsor ? (
                                <div className="space-y-1.5 max-w-xs">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="font-bold text-white text-xs">
                                      {slot.advertiserName || slot.customSponsor.sponsorName}
                                    </span>
                                    <span className="text-[9px] uppercase px-1 rounded bg-slate-800 text-slate-400 font-mono">
                                      {slot.customSponsor.badgeText}
                                    </span>
                                    <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                                      {slot.partnershipType === 'media_agency'
                                        ? 'Agência de Mídia'
                                        : slot.partnershipType === 'institutional'
                                        ? 'Institucional'
                                        : slot.partnershipType === 'affiliate_direct'
                                        ? 'Afiliado Direto'
                                        : 'Patrocínio Direto'}
                                    </span>
                                  </div>

                                  {/* Contract Dates & Value */}
                                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono flex-wrap">
                                    {slot.contractStartDate && slot.contractEndDate ? (
                                      <span className="flex items-center gap-1 text-slate-300">
                                        <Calendar className="w-3 h-3 text-amber-400" />
                                        <span>{slot.contractStartDate} até {slot.contractEndDate}</span>
                                      </span>
                                    ) : (
                                      <span>Período: Contínuo / Mensal</span>
                                    )}
                                    {Boolean(slot.contractPriceCad) && (
                                      <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                                        ${Number(slot.contractPriceCad).toFixed(2)} CAD
                                      </span>
                                    )}
                                  </div>

                                  <p className="text-[11px] text-slate-300 truncate">
                                    &ldquo;{slot.customSponsor.headline}&rdquo;
                                  </p>

                                  <div className="flex items-center gap-1.5 pt-0.5">
                                    <a
                                      href={normalizeUrl(slot.customSponsor.linkUrl)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 hover:text-emerald-300 hover:underline max-w-[180px] truncate"
                                    >
                                      <span>{slot.customSponsor.linkUrl}</span>
                                      <ExternalLink className="w-3 h-3 shrink-0" />
                                    </a>

                                    <a
                                      href={normalizeUrl(slot.customSponsor.linkUrl)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-2 py-0.5 rounded bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-[9px] font-bold shrink-0 cursor-pointer no-underline inline-flex items-center gap-1"
                                      title="Testar oferta em nova aba"
                                    >
                                      <span>Testar</span>
                                      <ExternalLink className="w-2.5 h-2.5" />
                                    </a>
                                  </div>
                                </div>
                              ) : (
                                <div className="space-y-1">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-slate-200 text-xs font-bold">Google AdSense</span>
                                    <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                      Rede de Anúncios
                                    </span>
                                  </div>
                                  <div className="text-[10px] text-slate-500 font-mono">
                                    Slot: {slot.adSenseSlotId}
                                  </div>
                                  <span className="text-[10px] text-slate-400">Modelo Programático CPC/CPM</span>
                                </div>
                              )}
                            </td>

                            {/* 5. Desempenho */}
                            <td className="p-4 align-middle text-center">
                              <div className="space-y-0.5">
                                <div className="text-white font-mono font-bold text-xs">
                                  {slot.impressions.toLocaleString('pt-BR')} imp.
                                </div>
                                <div className="text-emerald-400 font-mono text-[11px] font-semibold">
                                  {slot.clicks} cliques
                                </div>
                                <div className="text-[10px] text-slate-400">
                                  CTR: {slot.impressions > 0 ? ((slot.clicks / slot.impressions) * 100).toFixed(1) : '0'}%
                                </div>
                              </div>
                            </td>

                            {/* 6. Ações Rápidas (CRUD) */}
                            <td className="p-4 align-middle text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {/* Visualizar / Preview */}
                                <button
                                  type="button"
                                  onClick={() => handleOpenPreview(slot)}
                                  className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 border border-blue-500/20 transition-all cursor-pointer"
                                  title="Pré-visualizar como ficará no site e na página"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>

                                {/* Testar Link de Destino da Oferta */}
                                {isCustomSponsor && slot.customSponsor && (
                                  <a
                                    href={normalizeUrl(slot.customSponsor.linkUrl)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 border border-emerald-500/20 transition-all cursor-pointer inline-flex items-center justify-center no-underline"
                                    title="Testar botão de acesso à oferta em nova aba"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </a>
                                )}

                                {/* Editar */}
                                <button
                                  type="button"
                                  onClick={() => handleEditAdSlot(slot)}
                                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition-all cursor-pointer"
                                  title="Editar informações e destino"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>

                                {/* Duplicar */}
                                <button
                                  type="button"
                                  onClick={() => handleDuplicateAd(slot)}
                                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer"
                                  title="Duplicar anúncio"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>

                                {/* Zerar métricas */}
                                <button
                                  type="button"
                                  onClick={() => handleResetAdStats(slot)}
                                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-amber-300 transition-all cursor-pointer"
                                  title="Zerar métricas de cliques"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                </button>

                                {/* Excluir */}
                                <button
                                  type="button"
                                  onClick={() => handleDeleteAd(slot)}
                                  className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/20 transition-all cursor-pointer"
                                  title="Excluir este anúncio permanentemente"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    )}


        {/* ========================================== */}
        {/* TAB 5: CENTRAL DE E-BOOKS, ATIVOS DIGITAIS & VENDAS */}
        {/* ========================================== */}
        {activeTab === 'ebook' && (
          <DigitalAssetsAdmin
            digitalAssets={digitalAssets}
            ebookOrders={ebookOrders}
            ebookConfig={ebookConfig}
            showToast={showToast}
          />
        )}

        {/* ========================================== */}
        {/* TAB 6: LEADS & NEWSLETTER */}
        {/* ========================================== */}
        {activeTab === 'newsletter' && (
          <LeadsCrmAdmin onShowToast={showToast} />
        )}

        {/* ========================================== */}
        {/* TAB 7: CONFIGURAÇÕES & SEGURANÇA */}
        {/* ========================================== */}
        {activeTab === 'security' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Password Change Box */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm font-bold text-white">Alterar Chave Mestra do Administrador</h3>
              </div>
              <p className="text-xs text-slate-400">
                Altere a senha exigida para desbloquear este painel em novos navegadores ou sessões.
              </p>

              <form onSubmit={handleChangePassword} className="space-y-3 pt-2">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Senha Atual</label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Nova Senha</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Confirmar Nova Senha</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Salvar Nova Chave Mestra
                </button>
              </form>
            </div>

            {/* Data Backup & Restore */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Backup & Segurança dos Dados</h3>
              </div>
              <p className="text-xs text-slate-400">
                Exporte todo o banco de dados (artigos, afiliados, anúncios, clientes e leads) em formato JSON seguro.
              </p>

              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={handleDownloadBackup}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center justify-center gap-2 border border-slate-700 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4 text-blue-400" />
                  <span>Baixar Backup Completo (JSON)</span>
                </button>

                <div className="pt-4 border-t border-slate-800 space-y-2">
                  <span className="text-[11px] text-rose-400 block font-semibold">
                    Zona de Redefinição:
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Deseja restaurar todos os artigos, afiliados e configurações padrão?')) {
                        adminStore.restoreDefaultData();
                        showToast('Dados restaurados para o padrão com sucesso.');
                      }
                    }}
                    className="w-full py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 font-medium text-xs rounded-xl border border-rose-500/30 transition-all cursor-pointer"
                  >
                    Restaurar Dados de Fábrica
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        </main>
      </div>

      {/* ========================================== */}
      {/* MODAL: SELETOR DE TEMPLATES ESTRATÉGICOS   */}
      {/* ========================================== */}
      {isTemplateSelectorOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-5 my-8 text-xs text-slate-200 max-h-[92vh] overflow-y-auto shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-bold text-[11px] border border-blue-500/20">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Templates de Conversão & Monetização Editorial</span>
                </div>
                <h3 className="font-black text-white text-lg sm:text-xl">
                  Escolha o Template de Acordo com a Intenção do Leitor
                </h3>
                <p className="text-slate-400 text-xs">
                  Cada template estrutura o artigo com a persona certa, CTA contextual de ferramenta, oferta de afiliado e produto digital.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsTemplateSelectorOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Pills & Search */}
            <div className="space-y-2.5 pt-1">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
                  <span className="text-[10px] text-slate-400 font-bold uppercase mr-1">Categoria:</span>
                  {[
                    { id: 'all', label: 'Todas' },
                    { id: 'impots', label: 'Impostos & Holerite' },
                    { id: 'carriere', label: 'Carreira & Entrevistas' },
                    { id: 'finances', label: 'Finanças & Remessas' },
                    { id: 'cnesst', label: 'Normas CNESST' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setSelectedTemplateFilter(tab.id as any)}
                      className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                        selectedTemplateFilter === tab.id
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={templateSearch}
                    onChange={(e) => setTemplateSearch(e.target.value)}
                    placeholder="Buscar template..."
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Row 2: Marketing Digital Search Intent Filters */}
              <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-indigo-400 font-bold uppercase mr-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-indigo-400" />
                  <span>Intenção de Busca:</span>
                </span>
                {[
                  { id: 'all', label: 'Todas as Intenções' },
                  { id: 'informativo', label: '💡 Informativa (Aprender conceito)' },
                  { id: 'comparativo', label: '⚖️ Comparativo (X vs Y)' },
                  { id: 'transacional', label: '🛒 Transacional (Ação / Compra)' },
                  { id: 'carreira', label: '🎯 Carreira & Preparação' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedTemplateIntent(item.id as any)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      selectedTemplateIntent === item.id
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Template Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {articleTemplates
                .filter((tpl) => {
                  const matchesCat = selectedTemplateFilter === 'all' || tpl.category === selectedTemplateFilter;
                  const matchesIntent =
                    selectedTemplateIntent === 'all' ||
                    tpl.intent === selectedTemplateIntent ||
                    (selectedTemplateIntent === 'comparativo' && tpl.intentLabel.toLowerCase().includes('comparat')) ||
                    (selectedTemplateIntent === 'informativo' && tpl.intent === 'informativo');
                  const matchesSearch =
                    tpl.name.toLowerCase().includes(templateSearch.toLowerCase()) ||
                    tpl.description.toLowerCase().includes(templateSearch.toLowerCase()) ||
                    tpl.targetAudience.toLowerCase().includes(templateSearch.toLowerCase());
                  return matchesCat && matchesIntent && matchesSearch;
                })
                .map((tpl) => (
                  <div
                    key={tpl.id}
                    className="p-4 sm:p-5 rounded-2xl bg-slate-950/90 border border-slate-800 hover:border-blue-500/50 transition-all flex flex-col justify-between space-y-4 group relative"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-500/10 text-blue-300 border border-blue-500/20">
                          {tpl.category}
                        </span>

                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            tpl.funnelStage === 'fundo'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : tpl.funnelStage === 'meio'
                              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {tpl.funnelLabel}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-bold text-white text-sm group-hover:text-blue-300 transition-colors">
                          {tpl.name}
                        </h4>
                        <p className="text-slate-400 text-xs mt-1 leading-relaxed">{tpl.description}</p>
                      </div>

                      {/* Persona / Audience */}
                      <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-1">
                        <div className="text-[10px] uppercase font-bold text-slate-400">
                          🎯 Público-Alvo & Intenção:
                        </div>
                        <div className="text-slate-200 text-[11px] leading-tight font-medium">
                          {tpl.targetAudience}
                        </div>
                      </div>

                      {/* Monetization Blueprint Preview */}
                      <div className="space-y-1.5 pt-1">
                        <div className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          <span>Estrutura de Monetização Embutida:</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 text-[10px]">
                          <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-300 border border-blue-500/20 font-mono">
                            ⚡ CTA: {tpl.recommendedCtaTool}
                          </span>
                          {tpl.defaultAffiliatePartnerId && (
                            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                              🤝 Afiliado: {tpl.defaultAffiliatePartnerId}
                            </span>
                          )}
                          {tpl.preset.hasEbookCta && (
                            <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20">
                              📖 E-book ($CAD)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleApplyTemplate(tpl)}
                      className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer active:scale-98"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>Aplicar Este Template no Editor</span>
                    </button>
                  </div>
                ))}
            </div>

            {/* Bottom Alternative: Start from scratch */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Prefere começar sem nenhuma estrutura prévia?</span>
              <button
                type="button"
                onClick={() => {
                  setIsTemplateSelectorOpen(false);
                  handleOpenNewArticleBlank();
                }}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold transition-colors cursor-pointer"
              >
                Criar Artigo em Branco →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL: EDIT / CREATE ARTICLE COM PREVIEW   */}
      {/* ========================================== */}
      {isArticleModalOpen && editingArticle && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-5 my-8 text-xs text-slate-200 max-h-[92vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-white text-base sm:text-lg">
                    {editingArticle.id.includes('art-') && !editingArticle.title.pt
                      ? 'Novo Artigo do Blog'
                      : 'Editar Artigo & Estrutura de Monetização'}
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      editingArticle.published
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {editingArticle.published ? 'Publicado' : 'Rascunho'}
                  </span>
                </div>
                <p className="text-slate-400 text-xs">
                  Ajuste o conteúdo, a ferramenta prática recomendada (CTA) e os parceiros de monetização.
                </p>
              </div>

              {/* View Mode Toggle & Template Switcher */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="p-1 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setEditorViewMode('edit')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      editorViewMode === 'edit'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    ✏️ Editor
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorViewMode('preview')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      editorViewMode === 'preview'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    👁️ Live Preview
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleOpenTemplateSelector}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs flex items-center gap-1.5 border border-slate-700 cursor-pointer"
                  title="Carregar ou trocar template estratégico"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Templates</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsArticleModalOpen(false)}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ======================================================== */}
            {/* VIEW MODE 1: FORMULÁRIO DE EDIÇÃO & ESTRATÉGIA           */}
            {/* ======================================================== */}
            {editorViewMode === 'edit' ? (
              <div className="space-y-5">
                {/* Language Switcher Bar with Replicate Helper */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-slate-950 p-2.5 rounded-2xl border border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-medium text-xs">Idioma em Edição:</span>
                    <div className="flex items-center gap-1">
                      {(['pt', 'fr', 'en'] as Language[]).map((l) => (
                        <button
                          key={l}
                          type="button"
                          onClick={() => setArticleFormLang(l)}
                          className={`px-3 py-1 rounded-xl uppercase font-extrabold text-[11px] transition-all cursor-pointer ${
                            articleFormLang === l
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'text-slate-400 hover:text-white hover:bg-slate-800'
                          }`}
                        >
                          {l === 'pt' ? 'Português' : l === 'fr' ? 'Français' : 'English'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleReplicateLanguages}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium cursor-pointer"
                    title="Copia o conteúdo do idioma atual para os outros idiomas se estiverem vazios"
                  >
                    <span>⚡ Replicar para FR & EN</span>
                  </button>
                </div>

                {/* Title & Excerpt */}
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-slate-300 font-bold text-xs">
                        Título do Artigo ({articleFormLang.toUpperCase()}):
                      </label>
                      <span className="text-[10px] text-slate-500">
                        {(editingArticle.title[articleFormLang] || '').length} caracteres
                      </span>
                    </div>
                    <input
                      type="text"
                      value={editingArticle.title[articleFormLang] || ''}
                      onChange={(e) =>
                        setEditingArticle({
                          ...editingArticle,
                          title: { ...editingArticle.title, [articleFormLang]: e.target.value },
                        })
                      }
                      placeholder="Ex: Entendendo seu Holerite no Québec..."
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs font-semibold focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold text-xs mb-1">
                      Resumo / Lead Persuasivo ({articleFormLang.toUpperCase()}):
                    </label>
                    <textarea
                      rows={2}
                      value={editingArticle.excerpt[articleFormLang] || ''}
                      onChange={(e) =>
                        setEditingArticle({
                          ...editingArticle,
                          excerpt: { ...editingArticle.excerpt, [articleFormLang]: e.target.value },
                        })
                      }
                      placeholder="Resumo que desperta interesse nos leitores e melhora o SEO..."
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-slate-300 font-bold text-xs">
                        Conteúdo (Parágrafos - 1 por linha) ({articleFormLang.toUpperCase()}):
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleInsertCallout}
                          className="text-[11px] text-amber-300 hover:text-amber-200 cursor-pointer font-medium"
                        >
                          + Dica de Ouro
                        </button>
                        <span className="text-slate-600">•</span>
                        <button
                          type="button"
                          onClick={handleCalculateReadTime}
                          className="text-[11px] text-blue-400 hover:text-blue-300 cursor-pointer font-medium"
                        >
                          ⏱️ Auto-Calcular Tempo
                        </button>
                      </div>
                    </div>
                    <textarea
                      rows={6}
                      value={(editingArticle.content[articleFormLang] || []).join('\n\n')}
                      onChange={(e) =>
                        setEditingArticle({
                          ...editingArticle,
                          content: {
                            ...editingArticle.content,
                            [articleFormLang]: e.target.value.split('\n\n').filter(Boolean),
                          },
                        })
                      }
                      placeholder="Digite os parágrafos do artigo separados por uma linha em branco..."
                      className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs leading-relaxed font-sans focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Metadata Row: Category, Read Time, Date, Status */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Categoria</label>
                    <select
                      value={editingArticle.category}
                      onChange={(e) =>
                        setEditingArticle({
                          ...editingArticle,
                          category: e.target.value as BlogArticleData['category'],
                        })
                      }
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                    >
                      <option value="impots">Impostos (Revenu QC)</option>
                      <option value="carriere">Carreira & RH</option>
                      <option value="finances">Finanças & Remessas</option>
                      <option value="cnesst">Normas CNESST</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Tempo de Leitura</label>
                    <input
                      type="text"
                      value={editingArticle.readTime}
                      onChange={(e) => setEditingArticle({ ...editingArticle, readTime: e.target.value })}
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Data / Edição</label>
                    <input
                      type="text"
                      value={editingArticle.date}
                      onChange={(e) => setEditingArticle({ ...editingArticle, date: e.target.value })}
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Status de Publicação</label>
                    <button
                      type="button"
                      onClick={() => setEditingArticle({ ...editingArticle, published: !editingArticle.published })}
                      className={`w-full py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer border ${
                        editingArticle.published
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-slate-900 text-slate-400 border-slate-700'
                      }`}
                    >
                      {editingArticle.published ? 'Publicado no Blog ✓' : 'Rascunho Privado'}
                    </button>
                  </div>
                </div>

                {/* ======================================================== */}
                {/* MÓDULO DE MARKETING DIGITAL, INTENÇÃO DE BUSCA & FUNIL   */}
                {/* ======================================================== */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-indigo-500/30 space-y-3 shadow-lg">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                      <h4 className="font-extrabold text-white text-sm">
                        Estratégia de Marketing Digital, Intenção de Busca & Funil de Vendas
                      </h4>
                    </div>
                    <span className="text-[10px] text-indigo-300 font-mono bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                      SEO & Inbound Marketing
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Alinhe o artigo à intenção real de busca do usuário no Google para atrair tráfego qualificado, quebrar objeções e maximizar a taxa de conversão nos CTAs e produtos.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-400 text-[11px] mb-1 font-semibold">
                        🎯 Intenção de Busca do Usuário (Search Intent)
                      </label>
                      <select
                        value={editingArticle.searchIntent || 'informational'}
                        onChange={(e) =>
                          setEditingArticle({
                            ...editingArticle,
                            searchIntent: e.target.value as any,
                          })
                        }
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-bold focus:ring-1 focus:ring-indigo-500 outline-none"
                      >
                        <option value="informational">💡 Informativa (Aprender conceito / Guia - Topo)</option>
                        <option value="commercial_investigation">⚖️ Comparativa (Avaliação X vs Y - Meio)</option>
                        <option value="transactional">🛒 Transacional (Download / Compra / Vaga - Fundo)</option>
                        <option value="navigational">🧭 Navegacional (Busca direta da ferramenta)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 text-[11px] mb-1 font-semibold">
                        📈 Estágio no Funil de Vendas
                      </label>
                      <select
                        value={editingArticle.funnelStage || 'topo'}
                        onChange={(e) =>
                          setEditingArticle({
                            ...editingArticle,
                            funnelStage: e.target.value as any,
                          })
                        }
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-bold focus:ring-1 focus:ring-indigo-500 outline-none"
                      >
                        <option value="topo">Topo de Funil (Atração & Volume Orgânico)</option>
                        <option value="meio">Meio de Funil (Nutrição & Quebra de Objeções)</option>
                        <option value="fundo">Fundo de Funil (Decisão & Fechamento de Venda)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 text-[11px] mb-1 font-semibold">
                        🏆 Meta Estratégica de Conversão
                      </label>
                      <select
                        value={editingArticle.conversionGoal || 'tool_engagement'}
                        onChange={(e) =>
                          setEditingArticle({
                            ...editingArticle,
                            conversionGoal: e.target.value as any,
                          })
                        }
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-bold focus:ring-1 focus:ring-indigo-500 outline-none"
                      >
                        <option value="tool_engagement">Engajamento com Ferramenta Gratuita</option>
                        <option value="pass_sale">Venda do Passaporte de Carreira</option>
                        <option value="affiliate_click">Clique em Parceiro Afiliado</option>
                        <option value="digital_download">Download de Template / E-book</option>
                        <option value="lead_capture">Captação de Lead para Newsletter/WhatsApp</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-slate-400 text-[11px] mb-1 font-semibold">
                        🔍 Palavra-Chave Primária / Termo de Busca (SEO)
                      </label>
                      <input
                        type="text"
                        value={editingArticle.targetKeyword || ''}
                        onChange={(e) =>
                          setEditingArticle({
                            ...editingArticle,
                            targetKeyword: e.target.value,
                          })
                        }
                        placeholder="Ex: calcul salaire net quebec deductions rrq"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-amber-300 font-mono text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 text-[11px] mb-1 font-semibold">
                        📊 Nível de Volume Estimado de Pesquisa
                      </label>
                      <select
                        value={editingArticle.searchVolumeLevel || 'medium'}
                        onChange={(e) =>
                          setEditingArticle({
                            ...editingArticle,
                            searchVolumeLevel: e.target.value as any,
                          })
                        }
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
                      >
                        <option value="high">Alto Volume (5.000+ buscas/mês no Canadá)</option>
                        <option value="medium">Médio Volume (1.000 - 5.000 buscas/mês)</option>
                        <option value="niche">Nicho Hiper-Segmentado (&lt; 1.000 buscas com alta intenção)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* ======================================================== */}
                {/* MÓDULO DE MONETIZAÇÃO CONTEXTUAL                          */}
                {/* ======================================================== */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    <h4 className="font-extrabold text-white text-sm">
                      Módulo de Monetização Contextual & Conversão do Post
                    </h4>
                  </div>

                  {/* 1. Practical Tool CTA Mapping */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-blue-400 flex items-center gap-1.5 text-xs">
                        <span>⚡ 1. Ferramenta Prática Recomendada (CTA Principal)</span>
                      </span>
                      <span className="text-[10px] text-slate-400">Gera engajamento e retenção</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-400 text-[11px] mb-1">Ferramenta do Portal</label>
                        <select
                          value={editingArticle.ctaTool || ''}
                          onChange={(e) => {
                            const val = e.target.value as ToolId | '';
                            setEditingArticle({
                              ...editingArticle,
                              ctaTool: val ? (val as ToolId) : undefined,
                            });
                          }}
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                        >
                          <option value="">Nenhuma Ferramenta (Apenas Leitura)</option>
                          <option value="net-calc">Calculadora Líquida de Salário Québec</option>
                          <option value="converter">Conversor Salarial (Horário / Anual / Moedas)</option>
                          <option value="raise">Simulador de Aumento & Impacto Líquido</option>
                          <option value="overtime">Calculadora de Horas Extras 1.5x</option>
                          <option value="compare-jobs">Comparador de Ofertas de Emprego</option>
                          <option value="vacation-holidays">Direitos CNESST & Férias de 4%</option>
                          <option value="rrsp-savings">Match REER & Economia de Impostos</option>
                          <option value="resume-builder">Gerador de Currículo Canadense (ATS)</option>
                          <option value="interview-simulator">Simulador de Entrevista STAR</option>
                          <option value="tech-tests">Simulador de Testes Técnicos</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-400 text-[11px] mb-1">
                          Texto do Botão CTA ({articleFormLang.toUpperCase()})
                        </label>
                        <input
                          type="text"
                          value={editingArticle.ctaToolLabel?.[articleFormLang] || ''}
                          onChange={(e) =>
                            setEditingArticle({
                              ...editingArticle,
                              ctaToolLabel: {
                                ...(editingArticle.ctaToolLabel || { pt: '', fr: '', en: '' }),
                                [articleFormLang]: e.target.value,
                              },
                            })
                          }
                          placeholder="Ex: Calcular meu Salário Líquido no PaieNet"
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2. Affiliate Partner Mapping */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-400 flex items-center gap-1.5 text-xs">
                        <span>🤝 2. Parceiro Afiliado Vinculado ao Conteúdo</span>
                      </span>
                      <span className="text-[10px] text-slate-400">Comissões CPA / CPC em tempo real</span>
                    </div>

                    {/* Fast Select from Registered Affiliates */}
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1 font-semibold">
                        Vincular a Parceiro Afiliado Cadastrado:
                      </label>
                      <select
                        value={editingArticle.affiliateOffer?.partnerId || ''}
                        onChange={(e) => {
                          const selectedId = e.target.value;
                          if (!selectedId) {
                            setEditingArticle({ ...editingArticle, affiliateOffer: undefined });
                            return;
                          }
                          const partner = affiliates.find((a) => a.id === selectedId);
                          if (partner) {
                            const fullUrl = `${partner.targetUrl}?utm_source=${partner.utmSource}&utm_medium=${partner.utmMedium}&utm_campaign=${partner.utmCampaign}`;
                            setEditingArticle({
                              ...editingArticle,
                              affiliateOffer: {
                                partnerId: partner.id,
                                partnerName: partner.name,
                                badge: {
                                  pt: 'Parceiro Verificado 2026',
                                  fr: 'Partenaire Vérifié 2026',
                                  en: 'Verified Partner 2026',
                                },
                                offerTitle: {
                                  pt: `Oferta Exclusiva ${partner.name}`,
                                  fr: `Offre Exclusive ${partner.name}`,
                                  en: `Exclusive Offer ${partner.name}`,
                                },
                                offerDescription: {
                                  pt: partner.description || 'Condições especiais e benefícios exclusivos para leitores do PaieNet.',
                                  fr: partner.description || 'Conditions avantageuses et bonus pour nos lecteurs.',
                                  en: partner.description || 'Special terms and welcome bonus for PaieNet readers.',
                                },
                                ctaText: {
                                  pt: 'Acessar Oferta Parceiro',
                                  fr: 'Profiter de l’Offre',
                                  en: 'Claim Partner Offer',
                                },
                                externalUrl: fullUrl,
                              },
                            });
                          }
                        }}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-semibold"
                      >
                        <option value="">Nenhum Afiliado neste Artigo</option>
                        {affiliates.map((aff) => (
                          <option key={aff.id} value={aff.id}>
                            {aff.name} ({aff.category.toUpperCase()} • Comissão: {aff.commissionValue})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Detailed Offer Customization if active */}
                    {editingArticle.affiliateOffer && (
                      <div className="pt-2 border-t border-slate-800/80 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] text-slate-400 mb-1">Nome do Parceiro</label>
                            <input
                              type="text"
                              value={editingArticle.affiliateOffer.partnerName}
                              onChange={(e) =>
                                setEditingArticle({
                                  ...editingArticle,
                                  affiliateOffer: {
                                    ...editingArticle.affiliateOffer!,
                                    partnerName: e.target.value,
                                  },
                                })
                              }
                              className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] text-slate-400 mb-1">URL com Tracking / UTMs</label>
                            <input
                              type="text"
                              value={editingArticle.affiliateOffer.externalUrl}
                              onChange={(e) =>
                                setEditingArticle({
                                  ...editingArticle,
                                  affiliateOffer: {
                                    ...editingArticle.affiliateOffer!,
                                    externalUrl: e.target.value,
                                  },
                                })
                              }
                              className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-mono text-[11px]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] text-slate-400 mb-1">
                              Título da Oferta ({articleFormLang.toUpperCase()})
                            </label>
                            <input
                              type="text"
                              value={editingArticle.affiliateOffer.offerTitle?.[articleFormLang] || ''}
                              onChange={(e) =>
                                setEditingArticle({
                                  ...editingArticle,
                                  affiliateOffer: {
                                    ...editingArticle.affiliateOffer!,
                                    offerTitle: {
                                      ...(editingArticle.affiliateOffer!.offerTitle || { pt: '', fr: '', en: '' }),
                                      [articleFormLang]: e.target.value,
                                    },
                                  },
                                })
                              }
                              className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] text-slate-400 mb-1">
                              Texto do Botão Parceiro ({articleFormLang.toUpperCase()})
                            </label>
                            <input
                              type="text"
                              value={editingArticle.affiliateOffer.ctaText?.[articleFormLang] || ''}
                              onChange={(e) =>
                                setEditingArticle({
                                  ...editingArticle,
                                  affiliateOffer: {
                                    ...editingArticle.affiliateOffer!,
                                    ctaText: {
                                      ...(editingArticle.affiliateOffer!.ctaText || { pt: '', fr: '', en: '' }),
                                      [articleFormLang]: e.target.value,
                                    },
                                  },
                                })
                              }
                              className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 3. Ebook Digital Product Integration */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-amber-400" />
                        <span className="font-bold text-white text-xs">Exibir Oferta do E-book no Artigo</span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold">
                          ${ebookConfig.promotionalPriceCad.toFixed(2)} CAD
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Insere o banner oficial de compra do {ebookConfig.title} (100% margem própria).
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setEditingArticle({ ...editingArticle, hasEbookCta: !editingArticle.hasEbookCta })}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        editingArticle.hasEbookCta
                          ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {editingArticle.hasEbookCta ? 'Ativado ✓' : 'Desativado'}
                    </button>
                  </div>
                </div>

                {/* Footer Save Action Bar */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsArticleModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveArticle}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold flex items-center gap-2 shadow-lg cursor-pointer active:scale-98"
                  >
                    <Save className="w-4 h-4" />
                    <span>Salvar Artigo & Publicar no Site</span>
                  </button>
                </div>
              </div>
            ) : (
              /* ======================================================== */
              /* VIEW MODE 2: LIVE PREVIEW REAL DO LEITOR                 */
              /* ======================================================== */
              <div className="space-y-6 bg-slate-950 p-5 sm:p-7 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-extrabold text-white">Visualização em Tempo Real (Live Preview)</span>
                    <span className="text-slate-500">• Idioma: {articleFormLang.toUpperCase()}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditorViewMode('edit')}
                    className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
                  >
                    ← Voltar ao Modo Edição
                  </button>
                </div>

                {/* Rendered Article Header */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-extrabold text-xs uppercase">
                      {editingArticle.category}
                    </span>
                    <span className="text-slate-500">•</span>
                    <span className="text-xs text-slate-400">{editingArticle.date}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-blue-400" />
                      <span>{editingArticle.readTime}</span>
                    </span>
                  </div>

                  <h1 className="text-xl sm:text-2xl font-black text-white leading-tight">
                    {editingArticle.title[articleFormLang] || editingArticle.title.pt || 'Sem Título Definido'}
                  </h1>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium pb-2 border-b border-slate-800">
                    {editingArticle.excerpt[articleFormLang] || editingArticle.excerpt.pt || 'Sem Resumo'}
                  </p>
                </div>

                {/* Content Paragraphs */}
                <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {(editingArticle.content[articleFormLang] || editingArticle.content.pt || []).map(
                    (paragraph, idx) => (
                      <p
                        key={idx}
                        className={
                          paragraph.startsWith('💡')
                            ? 'p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 font-medium'
                            : 'leading-relaxed'
                        }
                      >
                        {paragraph}
                      </p>
                    )
                  )}
                </div>

                {/* Contextual CTA Tool Box */}
                {editingArticle.ctaTool && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-blue-900/40 border border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="space-y-1 text-center sm:text-left">
                      <span className="text-[10px] font-extrabold text-blue-400 uppercase tracking-wider block">
                        ⚡ Ferramenta Prática Recomendada para este Caso:
                      </span>
                      <h4 className="text-sm font-bold text-white">
                        {editingArticle.ctaToolLabel?.[articleFormLang] ||
                          editingArticle.ctaToolLabel?.pt ||
                          'Calcular no PaieNet'}
                      </h4>
                    </div>

                    <button
                      type="button"
                      className="px-4 py-2 rounded-xl bg-blue-600 text-white font-extrabold text-xs shadow-md shrink-0 flex items-center gap-1.5"
                    >
                      <span>Abrir Ferramenta</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Contextual Affiliate Partner Box */}
                {editingArticle.affiliateOffer && (
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                        {editingArticle.affiliateOffer.badge?.[articleFormLang] ||
                          editingArticle.affiliateOffer.badge?.pt ||
                          'Oferta Parceiro'}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Parceiro Verificado PaieNet</span>
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm sm:text-base font-black text-white">
                        {editingArticle.affiliateOffer.offerTitle?.[articleFormLang] ||
                          editingArticle.affiliateOffer.offerTitle?.pt ||
                          editingArticle.affiliateOffer.partnerName}
                      </h4>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        {editingArticle.affiliateOffer.offerDescription?.[articleFormLang] ||
                          editingArticle.affiliateOffer.offerDescription?.pt ||
                          ''}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-between gap-3 border-t border-white/10">
                      <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{editingArticle.affiliateOffer.partnerName}</span>
                      </div>

                      <a
                        href={editingArticle.affiliateOffer.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                      >
                        <span>
                          {editingArticle.affiliateOffer.ctaText?.[articleFormLang] ||
                            editingArticle.affiliateOffer.ctaText?.pt ||
                            'Acessar Oferta'}
                        </span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                )}

                {/* Ebook Purchase Banner */}
                {editingArticle.hasEbookCta && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-400/15 to-blue-900/20 border border-amber-400/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 font-black">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 block">
                          Livro Digital Completo Recomendado
                        </span>
                        <h5 className="font-extrabold text-xs sm:text-sm text-white">{ebookConfig.title}</h5>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Apenas ${ebookConfig.promotionalPriceCad.toFixed(2)} CAD com garantia de 30 dias.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="px-4 py-2 rounded-xl bg-slate-900 text-white font-extrabold text-xs whitespace-nowrap border border-slate-700 flex items-center gap-1.5"
                    >
                      <CreditCard className="w-3.5 h-3.5 text-amber-300" />
                      <span>Comprar E-book (${ebookConfig.promotionalPriceCad.toFixed(2)})</span>
                    </button>
                  </div>
                )}

                {/* Bottom Bar in Preview */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setEditorViewMode('edit')}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
                  >
                    ← Continuar Editando
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveArticle}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold flex items-center gap-2 shadow-lg cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Salvar e Publicar Artigo Agora</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL: EDIT AFFILIATE PARTNER */}
      {/* ========================================== */}
      {isAffiliateModalOpen && editingAffiliate && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 text-xs text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">Configurar Parceiro Afiliado</h3>
              <button
                type="button"
                onClick={() => setIsAffiliateModalOpen(false)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1">Nome do Parceiro</label>
                <input
                  type="text"
                  value={editingAffiliate.name}
                  onChange={(e) => setEditingAffiliate({ ...editingAffiliate, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">URL de Destino (Base)</label>
                <input
                  type="text"
                  value={editingAffiliate.targetUrl}
                  onChange={(e) => setEditingAffiliate({ ...editingAffiliate, targetUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono text-[11px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">UTM Source</label>
                  <input
                    type="text"
                    value={editingAffiliate.utmSource}
                    onChange={(e) => setEditingAffiliate({ ...editingAffiliate, utmSource: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">UTM Campaign</label>
                  <input
                    type="text"
                    value={editingAffiliate.utmCampaign}
                    onChange={(e) => setEditingAffiliate({ ...editingAffiliate, utmCampaign: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Comissão Estimada</label>
                  <input
                    type="text"
                    value={editingAffiliate.commissionValue}
                    onChange={(e) => setEditingAffiliate({ ...editingAffiliate, commissionValue: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Status</label>
                  <select
                    value={editingAffiliate.active ? 'true' : 'false'}
                    onChange={(e) => setEditingAffiliate({ ...editingAffiliate, active: e.target.value === 'true' })}
                    className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-white"
                  >
                    <option value="true">Ativo</option>
                    <option value="false">Pausado</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsAffiliateModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveAffiliate}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer"
              >
                Salvar Parceiro
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL 1: LIVE PREVIEW STUDIO               */}
      {/* ========================================== */}
      {isPreviewStudioOpen && selectedAdForPreview && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-6 my-8 text-xs text-slate-200 max-h-[92vh] overflow-y-auto shadow-2xl">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-bold text-[11px] border border-blue-500/20">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Estúdio de Pré-Visualização Interativa de Anúncios</span>
                </div>
                <h3 className="font-black text-white text-lg sm:text-xl">
                  {selectedAdForPreview.name}
                </h3>
                <p className="text-slate-400 text-xs">
                  Veja com fidelidade como este anúncio aparece para os visitantes nos diferentes dispositivos antes ou depois de publicar.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsPreviewStudioOpen(false);
                  setSelectedAdForPreview(null);
                }}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mode & Switcher Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-950 p-2.5 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setPreviewModeType('page-context')}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                    previewModeType === 'page-context'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>🌐 Na Página / Seção Real</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewModeType('banner')}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                    previewModeType === 'banner'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>🔲 Banner Isolado</span>
                </button>
              </div>

              {previewModeType === 'page-context' ? (
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 font-semibold shrink-0">
                    Mudar Seção do Portal:
                  </span>
                  <select
                    value={previewContextSection}
                    onChange={(e) => setPreviewContextSection(e.target.value)}
                    className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:ring-1 focus:ring-blue-500 outline-none max-w-[280px] truncate"
                  >
                    <optgroup label="🌐 Páginas & Calculadoras">
                      {dynamicSections
                        .filter((s) => s.category === 'global')
                        .map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.label}
                          </option>
                        ))}
                    </optgroup>
                    <optgroup label={`📰 Artigos do Blog (${articles.length} posts sincronizados)`}>
                      {dynamicSections
                        .filter((s) => s.category === 'blog')
                        .map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.label}
                          </option>
                        ))}
                    </optgroup>
                  </select>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('desktop')}
                    className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                      previewDevice === 'desktop'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    <span>Desktop (100%)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreviewDevice('tablet')}
                    className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                      previewDevice === 'tablet'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Tablet className="w-3.5 h-3.5" />
                    <span>Tablet (768px)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreviewDevice('mobile')}
                    className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                      previewDevice === 'mobile'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Mobile (375px)</span>
                  </button>
                </div>
              )}
            </div>

            {/* Visual Canvas / Contextual Mockup */}
            {previewModeType === 'page-context' ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs px-1 text-slate-400">
                  <span className="flex items-center gap-1.5 font-semibold text-white">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>Visualizando em: {dynamicSections.find((s) => s.id === previewContextSection)?.label || previewContextSection}</span>
                  </span>
                  <span className="text-[11px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Layout Real em Escala
                  </span>
                </div>

                <ContextualMockupView
                  slot={selectedAdForPreview}
                  currentSection={previewContextSection}
                  articleList={articles}
                  onTestOffer={() => handleTestOfferLink(selectedAdForPreview)}
                  onNavigateLive={(sec, url) => handleNavigateToLiveSite(sec, url)}
                />
              </div>
            ) : (
              <div className="p-4 sm:p-6 bg-slate-950/90 rounded-3xl border border-slate-800 flex flex-col items-center justify-center min-h-[160px] overflow-hidden">
                <div
                  className={`transition-all duration-300 w-full ${
                    previewDevice === 'mobile'
                      ? 'max-w-xs'
                      : previewDevice === 'tablet'
                      ? 'max-w-xl'
                      : 'max-w-full'
                  }`}
                >
                  <AdBanner
                    previewSlot={selectedAdForPreview}
                    isPreviewMode={true}
                    className="shadow-2xl"
                  />
                </div>
              </div>
            )}

            {/* Inspector / Location & Destination Audit Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Box 1: Location on Site */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                    <MapPin className="w-4 h-4" />
                    <span>Local Exato Mapeado no Portal</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleNavigateToLiveSite(selectedAdForPreview.pageSection, selectedAdForPreview.pageUrlPath)}
                    className="text-[10px] text-blue-400 hover:text-blue-300 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Abrir no site</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="text-white font-bold">
                    {selectedAdForPreview.pageSectionLabel || selectedAdForPreview.pageSection}
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="text-slate-400 font-mono text-[11px] bg-slate-900 px-2 py-1 rounded border border-slate-800 break-all">
                      {selectedAdForPreview.pageUrlPath || '/'}
                    </code>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(selectedAdForPreview.pageUrlPath || '/');
                        showToast('Rota copiada!');
                      }}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                      title="Copiar rota"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400">
                  Formato configurado: <strong className="text-white font-mono">{selectedAdForPreview.format}</strong>
                </p>
              </div>

              {/* Box 2: Target Destination URL */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                    <ExternalLink className="w-4 h-4" />
                    <span>Link de Destino do Clique</span>
                  </div>

                  {selectedAdForPreview.customSponsor && (
                    <a
                      href={normalizeUrl(selectedAdForPreview.customSponsor.linkUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-[10px] border border-emerald-500/30 transition-all cursor-pointer flex items-center gap-1 no-underline"
                    >
                      <span>Acessar Oferta Agora</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                {selectedAdForPreview.customSponsor ? (
                  <div className="space-y-2 text-xs">
                    <div className="text-white font-bold flex items-center gap-2">
                      <span>{selectedAdForPreview.customSponsor.sponsorName}</span>
                      <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                        {selectedAdForPreview.customSponsor.badgeText}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={normalizeUrl(selectedAdForPreview.customSponsor.linkUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono text-[11px] transition-colors max-w-[280px] truncate"
                      >
                        <span className="truncate">
                          {selectedAdForPreview.customSponsor.linkUrl}
                        </span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Cliques acumulados: <strong className="text-emerald-400">{selectedAdForPreview.clicks}</strong> | Impressões: <strong className="text-blue-400">{selectedAdForPreview.impressions}</strong>
                    </p>
                  </div>
                ) : (
                  <div className="text-slate-400 text-xs font-mono">
                    Rede Google AdSense (Slot {selectedAdForPreview.adSenseSlotId})
                  </div>
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400">Status atual:</span>
                {selectedAdForPreview.status !== 'paused' ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold text-[10px] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>Ativo e Visível no Site</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 font-bold text-[10px]">
                    Pausado / Oculto
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => {
                    handleToggleAdVisibility(selectedAdForPreview);
                    setSelectedAdForPreview(
                      adminStore.getAdSlots().find((s) => s.id === selectedAdForPreview.id) || null
                    );
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer ml-1"
                >
                  {selectedAdForPreview.status !== 'paused' ? 'Pausar Anúncio' : 'Ativar Agora'}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsPreviewStudioOpen(false);
                    handleEditAdSlot(selectedAdForPreview);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>Editar Este Anúncio</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsPreviewStudioOpen(false)}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer shadow-md"
                >
                  Fechar Estúdio
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL 2: FULL CRUD AD / BANNER EDITOR     */}
      {/* ========================================== */}
      {isAdModalOpen && editingAdSlot && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-5 my-8 text-xs text-slate-200 max-h-[92vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-bold text-[11px] border border-blue-500/20">
                  <Megaphone className="w-3.5 h-3.5 text-blue-400" />
                  <span>{isNewAd ? 'Criação de Anúncio / Banner' : 'Edição Completa de Anúncio'}</span>
                </div>
                <h3 className="font-black text-white text-lg sm:text-xl">
                  {isNewAd ? 'Novo Espaço Publicitário ou Banner' : `Configurar: ${editingAdSlot.name}`}
                </h3>
                <p className="text-slate-400 text-xs">
                  Defina o formato visual, mapeie a seção exata no site, configure o patrocinador direto ou AdSense e ative a exibição.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsAdModalOpen(false);
                  setEditingAdSlot(null);
                }}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveAdSlot();
              }}
              className="space-y-5"
            >
              {/* Section 1: Identification & Layout */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider block">
                  1. Identificação & Formato
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Nome Interno do Anúncio *</label>
                    <input
                      type="text"
                      value={editingAdSlot.name}
                      onChange={(e) => setEditingAdSlot({ ...editingAdSlot, name: e.target.value })}
                      required
                      placeholder="Ex: Banner Topo Calculadora Desjardins"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-bold text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Formato do Banner *</label>
                    <select
                      value={editingAdSlot.format || 'top-leaderboard'}
                      onChange={(e) =>
                        setEditingAdSlot({
                          ...editingAdSlot,
                          format: e.target.value as AdSlotConfig['format'],
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                    >
                      <option value="top-leaderboard">Horizontal Leaderboard (728×90 / Responsivo)</option>
                      <option value="bottom-wide">Rodapé Amplo (970×90 / Banner de Destaque)</option>
                      <option value="rectangle">Retângulo Médio (300×250 / 336×280)</option>
                      <option value="sidebar">Barra Lateral (300×600 / Módulo Fixo)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Descrição / Finalidade Estratégica</label>
                  <input
                    type="text"
                    value={editingAdSlot.description || ''}
                    onChange={(e) => setEditingAdSlot({ ...editingAdSlot, description: e.target.value })}
                    placeholder="Ex: Exibido no topo da página para capturar novos residentes."
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                  />
                </div>
              </div>

              {/* Section 2: Location Mapping on Site */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                  2. Local Exato & Rota de Exibição no Site
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">
                      Seção Mapeada do Portal
                    </label>
                    <select
                      value={editingAdSlot.pageSection || 'home-top'}
                      onChange={(e) => {
                        const preset = dynamicSections.find((p) => p.id === e.target.value);
                        setEditingAdSlot({
                          ...editingAdSlot,
                          pageSection: e.target.value,
                          pageSectionLabel: preset ? preset.label : e.target.value,
                          pageUrlPath: preset ? preset.url : editingAdSlot.pageUrlPath,
                          format: preset ? preset.recommendedFormat : editingAdSlot.format,
                        });
                      }}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                    >
                      <optgroup label="🌐 Páginas & Calculadoras do Portal">
                        {dynamicSections
                          .filter((p) => p.category === 'global')
                          .map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.label}
                            </option>
                          ))}
                      </optgroup>
                      <optgroup label={`📰 Artigos do Blog (${articles.length} posts sincronizados)`}>
                        {dynamicSections
                          .filter((p) => p.category === 'blog')
                          .map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.label}
                            </option>
                          ))}
                      </optgroup>
                      <option value="custom">Outra Seção Personalizada</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">
                      Nome Amigável do Local
                    </label>
                    <input
                      type="text"
                      value={editingAdSlot.pageSectionLabel || ''}
                      onChange={(e) =>
                        setEditingAdSlot({ ...editingAdSlot, pageSectionLabel: e.target.value })
                      }
                      placeholder="Ex: Topo da Calculadora"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">
                    Rota / URL Exata no Site (com Âncora)
                  </label>
                  <input
                    type="text"
                    value={editingAdSlot.pageUrlPath || ''}
                    onChange={(e) =>
                      setEditingAdSlot({ ...editingAdSlot, pageUrlPath: e.target.value })
                    }
                    placeholder="Ex: /?tool=net-calc#calculator-top"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-[11px]"
                  />
                  <span className="text-[10px] text-slate-500 block mt-1">
                    Permite indicar com exatidão onde o anúncio mora na aplicação para testes rápidos.
                  </span>
                </div>
              </div>

              {/* Section 3: Provider & Mode */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider block">
                  3. Tipo de Anúncio / Monetização
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setEditingAdSlot({
                        ...editingAdSlot,
                        status: editingAdSlot.status === 'paused' ? 'paused' : 'custom-sponsor',
                      })
                    }
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      editingAdSlot.status === 'custom-sponsor' || (!editingAdSlot.status.includes('active') && editingAdSlot.customSponsor)
                        ? 'bg-purple-950/40 border-purple-500 text-white shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center gap-1.5 text-purple-300">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Patrocinador Direto</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Banner rico com sua marca, headline, badge, CTA e link direto de afiliado.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setEditingAdSlot({
                        ...editingAdSlot,
                        status: editingAdSlot.status === 'paused' ? 'paused' : 'active',
                      })
                    }
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      editingAdSlot.status === 'active'
                        ? 'bg-blue-950/40 border-blue-500 text-white shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center gap-1.5 text-blue-300">
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>Google AdSense</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Bloco automático programático gerenciado via Google AdSense.
                    </p>
                  </button>
                </div>

                {/* If AdSense Slot ID */}
                {editingAdSlot.status === 'active' && (
                  <div className="pt-2">
                    <label className="block text-slate-400 mb-1">Google AdSense Slot ID</label>
                    <input
                      type="text"
                      value={editingAdSlot.adSenseSlotId}
                      onChange={(e) =>
                        setEditingAdSlot({ ...editingAdSlot, adSenseSlotId: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-[11px]"
                    />
                  </div>
                )}
              </div>

              {/* Section 4: Sponsor Creative Details */}
              {(editingAdSlot.status === 'custom-sponsor' || editingAdSlot.customSponsor) && (
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                    4. Criativo do Patrocinador Direto
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1 font-semibold">
                        Nome da Marca / Anunciante *
                      </label>
                      <input
                        type="text"
                        value={editingAdSlot.customSponsor?.sponsorName || ''}
                        onChange={(e) =>
                          setEditingAdSlot({
                            ...editingAdSlot,
                            customSponsor: {
                              ...(editingAdSlot.customSponsor || {
                                headline: '',
                                tagline: '',
                                linkUrl: '',
                                badgeText: 'Patrocinador',
                              }),
                              sponsorName: e.target.value,
                            },
                          })
                        }
                        placeholder="Ex: Desjardins Banques"
                        required={editingAdSlot.status === 'custom-sponsor'}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-semibold">
                        Texto do Selo / Badge
                      </label>
                      <input
                        type="text"
                        value={editingAdSlot.customSponsor?.badgeText || ''}
                        onChange={(e) =>
                          setEditingAdSlot({
                            ...editingAdSlot,
                            customSponsor: {
                              ...(editingAdSlot.customSponsor || {
                                sponsorName: '',
                                headline: '',
                                tagline: '',
                                linkUrl: '',
                                badgeText: 'Patrocinador',
                              }),
                              badgeText: e.target.value,
                            },
                          })
                        }
                        placeholder="Ex: Parceiro Verificado 2026"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">
                      Headline / Título Principal *
                    </label>
                    <input
                      type="text"
                      value={editingAdSlot.customSponsor?.headline || ''}
                      onChange={(e) =>
                        setEditingAdSlot({
                          ...editingAdSlot,
                          customSponsor: {
                            ...(editingAdSlot.customSponsor || {
                              sponsorName: '',
                              tagline: '',
                              linkUrl: '',
                              badgeText: 'Patrocinador',
                              headline: '',
                            }),
                            headline: e.target.value,
                          },
                        })
                      }
                      placeholder="Ex: Receba seu salário sem tarifas no Québec"
                      required={editingAdSlot.status === 'custom-sponsor'}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-bold text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">
                      Subtítulo / Descrição da Oferta (Tagline)
                    </label>
                    <input
                      type="text"
                      value={editingAdSlot.customSponsor?.tagline || ''}
                      onChange={(e) =>
                        setEditingAdSlot({
                          ...editingAdSlot,
                          customSponsor: {
                            ...(editingAdSlot.customSponsor || {
                              sponsorName: '',
                              headline: '',
                              linkUrl: '',
                              badgeText: 'Patrocinador',
                              tagline: '',
                            }),
                            tagline: e.target.value,
                          },
                        })
                      }
                      placeholder="Ex: Abra sua conta com benefícios exclusivos e cartão de crédito sem histórico prévio."
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1 font-semibold">
                        Texto do Botão CTA
                      </label>
                      <input
                        type="text"
                        value={editingAdSlot.customSponsor?.ctaText || 'Acessar'}
                        onChange={(e) =>
                          setEditingAdSlot({
                            ...editingAdSlot,
                            customSponsor: {
                              ...(editingAdSlot.customSponsor || {
                                sponsorName: '',
                                headline: '',
                                tagline: '',
                                linkUrl: '',
                                badgeText: 'Patrocinador',
                              }),
                              ctaText: e.target.value,
                            },
                          })
                        }
                        placeholder="Ex: Abrir Conta, Acessar Oferta"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-semibold">
                        Ícone do Banner
                      </label>
                      <select
                        value={editingAdSlot.customSponsor?.iconType || 'sparkles'}
                        onChange={(e) =>
                          setEditingAdSlot({
                            ...editingAdSlot,
                            customSponsor: {
                              ...(editingAdSlot.customSponsor || {
                                sponsorName: '',
                                headline: '',
                                tagline: '',
                                linkUrl: '',
                                badgeText: 'Patrocinador',
                              }),
                              iconType: e.target.value as any,
                            },
                          })
                        }
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                      >
                        <option value="sparkles">✨ Sparkles (Brilho / Destaque)</option>
                        <option value="shield">🛡️ Shield (Segurança / Verificado)</option>
                        <option value="dollar">💲 Dollar (Finanças / Economia)</option>
                        <option value="rocket">🚀 Rocket (Carreira / Aceleração)</option>
                        <option value="star">⭐ Star (Avaliação / Top Escolha)</option>
                        <option value="trending">📈 Trending (Crescimento / Renda)</option>
                      </select>
                    </div>
                  </div>

                  {/* Theme Gradient Selector */}
                  <div>
                    <label className="block text-slate-400 mb-1.5 font-semibold">
                      Tema Visual do Banner (Gradiente)
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {[
                        { id: 'blue', label: 'Azul', bg: 'from-blue-900 to-indigo-950' },
                        { id: 'emerald', label: 'Esmeralda', bg: 'from-emerald-950 to-teal-950' },
                        { id: 'indigo', label: 'Índigo', bg: 'from-indigo-950 to-purple-950' },
                        { id: 'purple', label: 'Roxo', bg: 'from-purple-950 to-fuchsia-950' },
                        { id: 'amber', label: 'Âmbar', bg: 'from-amber-950 to-orange-950' },
                        { id: 'dark', label: 'Dark', bg: 'from-slate-900 to-slate-950' },
                      ].map((th) => (
                        <button
                          key={th.id}
                          type="button"
                          onClick={() =>
                            setEditingAdSlot({
                              ...editingAdSlot,
                              customSponsor: {
                                ...(editingAdSlot.customSponsor || {
                                  sponsorName: '',
                                  headline: '',
                                  tagline: '',
                                  linkUrl: '',
                                  badgeText: 'Patrocinador',
                                }),
                                themeGradient: th.id as any,
                              },
                            })
                          }
                          className={`p-2 rounded-xl border text-center transition-all cursor-pointer bg-gradient-to-r ${th.bg} ${
                            (editingAdSlot.customSponsor?.themeGradient || 'blue') === th.id
                              ? 'ring-2 ring-blue-400 border-white text-white font-bold'
                              : 'border-slate-700 text-slate-300 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <span className="text-[11px] block">{th.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Destination Link */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-slate-400 font-semibold">
                        Link de Redirecionamento (URL do Anunciante) *
                      </label>
                      {editingAdSlot.customSponsor?.linkUrl && (
                        <a
                          href={editingAdSlot.customSponsor.linkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-emerald-400 hover:underline flex items-center gap-1 font-bold"
                        >
                          <span>Testar URL agora</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    <input
                      type="url"
                      value={editingAdSlot.customSponsor?.linkUrl || ''}
                      onChange={(e) =>
                        setEditingAdSlot({
                          ...editingAdSlot,
                          customSponsor: {
                            ...(editingAdSlot.customSponsor || {
                              sponsorName: '',
                              headline: '',
                              tagline: '',
                              badgeText: 'Patrocinador',
                              linkUrl: '',
                            }),
                            linkUrl: e.target.value,
                          },
                        })
                      }
                      placeholder="https://sua-empresa-parceira.com/campanha"
                      required={editingAdSlot.status === 'custom-sponsor'}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-[11px] focus:ring-1 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Section 4.5: Contractual Partnership, Advertiser & Period */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3.5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>Contrato, Anunciante & Período de Veiculação</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    Gestão Comercial & Faturamento
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold text-[11px]">
                      Nome da Empresa / Anunciante
                    </label>
                    <input
                      type="text"
                      value={editingAdSlot.advertiserName || ''}
                      onChange={(e) =>
                        setEditingAdSlot({ ...editingAdSlot, advertiserName: e.target.value })
                      }
                      placeholder="Ex: Desjardins Banques / Agência Havas"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold text-[11px]">
                      Contato do Responsável (E-mail ou WhatsApp)
                    </label>
                    <input
                      type="text"
                      value={editingAdSlot.advertiserContact || ''}
                      onChange={(e) =>
                        setEditingAdSlot({ ...editingAdSlot, advertiserContact: e.target.value })
                      }
                      placeholder="Ex: parcerias@desjardins.com / +1 514 555-0199"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold text-[11px]">
                      Vínculo com a Plataforma
                    </label>
                    <select
                      value={editingAdSlot.partnershipType || 'direct_sponsor'}
                      onChange={(e) =>
                        setEditingAdSlot({
                          ...editingAdSlot,
                          partnershipType: e.target.value as any,
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                    >
                      <option value="direct_sponsor">Patrocínio Direto (Contrato)</option>
                      <option value="agency_contract">Agência de Mídia / Intermediário</option>
                      <option value="ad_network">Rede Programática / AdSense</option>
                      <option value="internal_promo">Promoção Interna da Plataforma</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold text-[11px]">
                      Data Início do Contrato
                    </label>
                    <input
                      type="date"
                      value={editingAdSlot.contractStartDate || ''}
                      onChange={(e) =>
                        setEditingAdSlot({ ...editingAdSlot, contractStartDate: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold text-[11px]">
                      Data Término do Contrato
                    </label>
                    <input
                      type="date"
                      value={editingAdSlot.contractEndDate || ''}
                      onChange={(e) =>
                        setEditingAdSlot({ ...editingAdSlot, contractEndDate: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold text-[11px]">
                      Valor do Contrato ($ CAD)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={editingAdSlot.contractPriceCad || 0}
                      onChange={(e) =>
                        setEditingAdSlot({
                          ...editingAdSlot,
                          contractPriceCad: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-emerald-400 font-mono font-bold text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold text-[11px]">
                      Modelo de Faturamento
                    </label>
                    <select
                      value={editingAdSlot.billingModel || 'flat_fee'}
                      onChange={(e) =>
                        setEditingAdSlot({
                          ...editingAdSlot,
                          billingModel: e.target.value as any,
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                    >
                      <option value="flat_fee">Valor Fixo Fechado (Mensal / Trimestral)</option>
                      <option value="cpc">CPC (Custo por Clique Real)</option>
                      <option value="cpm">CPM (Custo por Mil Impressões)</option>
                      <option value="revshare">Comissão por Venda / Conversão</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold text-[11px]">
                    Segmentação / Observações de Público-Alvo
                  </label>
                  <input
                    type="text"
                    value={editingAdSlot.targetAudienceNotes || ''}
                    onChange={(e) =>
                      setEditingAdSlot({ ...editingAdSlot, targetAudienceNotes: e.target.value })
                    }
                    placeholder="Ex: Novos imigrantes em Montréal abrindo conta bancária e emitindo o primeiro cartão de crédito."
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                  />
                </div>
              </div>

              {/* Section 5: Visibility Toggle */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-xs">Visibilidade no Site</div>
                  <div className="text-[11px] text-slate-400">
                    Defina se o anúncio já deve aparecer imediatamente na página ou permanecer em rascunho.
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setEditingAdSlot({
                        ...editingAdSlot,
                        status:
                          editingAdSlot.status === 'paused'
                            ? editingAdSlot.customSponsor
                              ? 'custom-sponsor'
                              : 'active'
                            : 'paused',
                      })
                    }
                    className={`px-4 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center gap-2 ${
                      editingAdSlot.status !== 'paused'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {editingAdSlot.status !== 'paused' ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span>Ativo & Visível</span>
                      </>
                    ) : (
                      <>
                        <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                        <span>Pausado / Oculto</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Section 6: Real-time Live Preview */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Pré-Visualização em Tempo Real (Live Preview)</span>
                  </span>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                      <button
                        type="button"
                        onClick={() => setEditPreviewModeType('page-context')}
                        className={`px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer ${
                          editPreviewModeType === 'page-context'
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Globe className="w-3 h-3" />
                        <span>Na Página / Seção Real</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setEditPreviewModeType('banner')}
                        className={`px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer ${
                          editPreviewModeType === 'banner'
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Monitor className="w-3 h-3" />
                        <span>Banner Isolado</span>
                      </button>
                    </div>

                    {editingAdSlot.customSponsor?.linkUrl && (
                      <a
                        href={normalizeUrl(editingAdSlot.customSponsor.linkUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-[10px] border border-emerald-500/30 transition-all cursor-pointer flex items-center gap-1 no-underline"
                        title="Testar link da oferta em nova aba"
                      >
                        <span>Testar Oferta</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 flex items-center gap-1.5 px-1">
                  <MapPin className="w-3 h-3 text-amber-400" />
                  <span>
                    Exibição contextual mapeada para: <strong className="text-white">{editingAdSlot.pageSectionLabel || editingAdSlot.pageSection}</strong> ({editingAdSlot.pageUrlPath || '/'})
                  </span>
                </div>

                {editPreviewModeType === 'page-context' ? (
                  <ContextualMockupView
                    slot={editingAdSlot}
                    currentSection={editingAdSlot.pageSection || 'home-top'}
                    articleList={articles}
                    onTestOffer={() => handleTestOfferLink(editingAdSlot)}
                    onNavigateLive={(sec, url) => handleNavigateToLiveSite(sec, url)}
                  />
                ) : (
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center">
                    <div className="w-full">
                      <AdBanner
                        previewSlot={editingAdSlot}
                        isPreviewMode={true}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdModalOpen(false);
                    setEditingAdSlot(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black flex items-center gap-2 shadow-lg shadow-blue-600/30 cursor-pointer active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>{isNewAd ? 'Criar e Publicar Anúncio' : 'Salvar Alterações'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* Floating Feedback Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-800 text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2 animate-bounce">
          <span className="text-emerald-400 font-bold">✓</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
