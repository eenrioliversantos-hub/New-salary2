'use client';

import React, { useState, useMemo, useSyncExternalStore } from 'react';
import { Language } from '@/lib/i18n';
import { adminStore, DigitalAsset, EbookOrder } from '@/lib/admin-store';
import {
  BookOpen,
  Download,
  Sparkles,
  Search,
  CheckCircle2,
  FileText,
  FileSpreadsheet,
  CheckSquare,
  Compass,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  CreditCard,
  Tag,
  Check,
  Star,
  Users,
  Lock,
  Mail,
  Filter,
} from 'lucide-react';
import { normalizeUrl } from '@/lib/utils';
import { EbookModal } from '@/components/EbookModal';

interface GuidesAndResourcesProps {
  lang: Language;
  onOpenAssetModal?: (assetId?: string) => void;
}

const CATEGORY_MAP: Record<DigitalAsset['category'], { label: Record<Language, string>; icon: React.ElementType; color: string }> = {
  ebook: {
    label: { pt: 'E-books Oficiais', fr: 'E-books Officiels', en: 'Official E-books' },
    icon: BookOpen,
    color: 'text-amber-600 bg-amber-50 border-amber-200',
  },
  template: {
    label: { pt: 'Modelos & Templates ATS', fr: 'Modèles & Templates ATS', en: 'ATS Resume Templates' },
    icon: FileText,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  },
  spreadsheet: {
    label: { pt: 'Planilhas Automatizadas', fr: 'Feuilles de Calcul', en: 'Calculators & Sheets' },
    icon: FileSpreadsheet,
    color: 'text-blue-600 bg-blue-50 border-blue-200',
  },
  checklist: {
    label: { pt: 'Checklists de Imigração', fr: 'Check-lists Immigration', en: 'Immigration Checklists' },
    icon: CheckSquare,
    color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
  },
  guide: {
    label: { pt: 'Guias Práticos & Manuais', fr: 'Guides Pratiques', en: 'Practical Handbooks' },
    icon: Compass,
    color: 'text-purple-600 bg-purple-50 border-purple-200',
  },
};

export const GuidesAndResources: React.FC<GuidesAndResourcesProps> = ({
  lang,
  onOpenAssetModal,
}) => {
  const digitalAssets = useSyncExternalStore(
    (cb) => adminStore.subscribe(cb),
    () => adminStore.getDigitalAssets(),
    () => adminStore.getInitialDigitalAssets()
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | DigitalAsset['category']>('all');
  const [accessFilter, setAccessFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [activeAssetForModal, setActiveAssetForModal] = useState<string | null>(null);

  // Email capture banner state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  const filteredAssets = useMemo(() => {
    return digitalAssets.filter((asset) => {
      if (asset.salesStatus === 'draft') return false;

      // Category filter
      if (selectedCategory !== 'all' && asset.category !== selectedCategory) return false;

      // Access filter
      if (accessFilter !== 'all' && asset.accessType !== accessFilter) return false;

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = asset.title.toLowerCase().includes(query);
        const matchesSubtitle = asset.subtitle.toLowerCase().includes(query);
        const matchesDesc = asset.description?.toLowerCase().includes(query) || false;
        if (!matchesTitle && !matchesSubtitle && !matchesDesc) return false;
      }

      return true;
    });
  }, [digitalAssets, selectedCategory, accessFilter, searchQuery]);

  const handleDownloadOrBuy = (asset: DigitalAsset) => {
    if (onOpenAssetModal) {
      onOpenAssetModal(asset.id);
    } else {
      setActiveAssetForModal(asset.id);
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;

    adminStore.addNewsletterLead({
      email: newsletterEmail.trim(),
      source: 'guias-recursos-hub',
    });

    setNewsletterSubmitted(true);
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-blue-950 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-bold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>
              {lang === 'pt'
                ? 'Acervo Oficial de Recursos & Infoprodutos 2026'
                : lang === 'en'
                ? 'Official Resource Center & Digital Library 2026'
                : 'Centre officiel de ressources & guides pratiques'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            {lang === 'pt'
              ? 'Guias, Manuais e Ferramentas Práticas para sua Carreira no Canadá'
              : lang === 'en'
              ? 'Handbooks, Templates and Tools for Your Career in Canada'
              : 'Guides, modèles et outils pratiques pour votre carrière au Canada'}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {lang === 'pt'
              ? 'Explore nossa biblioteca de materiais verificados por contadores e consultores de RH: e-books fiscais, modelos de currículo ATS sem preconceito, planilhas orçamentárias e checklists para você não perder tempo nem dinheiro.'
              : lang === 'en'
              ? 'Explore our library of audited guides by accountants and HR professionals: tax e-books, ATS-friendly resume templates, budget spreadsheets and relocation checklists.'
              : 'Explorez nos manuels certifiés : guides d’impôt, modèles de CV sans biais, feuilles de calcul et listes de contrôle.'}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'pt' ? 'Barèmes fiscaux 2025/2026 auditados' : 'Audited 2025/2026 tax standards'}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'pt' ? 'Downloads instantâneos em PDF/DOCX' : 'Instant downloads in PDF/DOCX'}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'pt' ? 'Garantia de 7 dias ou dinheiro de volta' : '7-day money-back guarantee'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Search, Filter Tabs & Segments */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                lang === 'pt'
                  ? 'Buscar por guia, currículo ATS, imposto, normas CNESST...'
                  : 'Search guides, ATS resumes, tax handbooks...'
              }
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>

          {/* Access Filter (Free vs Paid) */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0">
            {[
              { id: 'all', label: lang === 'pt' ? 'Todos' : 'All' },
              { id: 'free', label: lang === 'pt' ? '🎁 Gratuitos' : '🎁 Free' },
              { id: 'paid', label: lang === 'pt' ? '💎 Premium' : '💎 Premium' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setAccessFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  accessFilter === tab.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {lang === 'pt' ? 'Todas as Categorias' : 'All Categories'} ({digitalAssets.length})
          </button>

          {(Object.keys(CATEGORY_MAP) as DigitalAsset['category'][]).map((cat) => {
            const config = CATEGORY_MAP[cat];
            const Icon = config.icon;
            const count = digitalAssets.filter((a) => a.category === cat).length;
            const isSelected = selectedCategory === cat;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{config.label[lang]}</span>
                <span className={`text-[10px] ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                  ({count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssets.map((asset) => {
          const categoryConfig = CATEGORY_MAP[asset.category] || CATEGORY_MAP.guide;
          const CategoryIcon = categoryConfig.icon;
          const isFree = asset.accessType === 'free';

          return (
            <div
              key={asset.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between p-5 sm:p-6 group relative"
            >
              <div className="space-y-3">
                {/* Header Row */}
                <div className="flex items-start justify-between gap-3">
                  <div className={`p-2.5 rounded-xl border ${categoryConfig.color}`}>
                    <CategoryIcon className="w-5 h-5" />
                  </div>

                  <div className="flex items-center gap-1.5">
                    {asset.badge && (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300">
                        {asset.badge}
                      </span>
                    )}
                    <span
                      className={`text-[11px] font-extrabold px-2 py-0.5 rounded-md ${
                        isFree
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {isFree ? '100% Gratuito' : `$${asset.promotionalPriceCad || asset.regularPriceCad} CAD`}
                    </span>
                  </div>
                </div>

                {/* Title & Subtitle */}
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base leading-snug group-hover:text-blue-600 transition-colors">
                    {asset.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {asset.subtitle}
                  </p>
                </div>

                {/* Highlights List */}
                {asset.highlights && asset.highlights.length > 0 && (
                  <ul className="space-y-1.5 pt-1 text-xs text-slate-600">
                    {asset.highlights.slice(0, 3).map((hl, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{hl}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Action Button & Metadata */}
              <div className="pt-5 mt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>{asset.fileFormat} · {asset.fileSize}</span>
                  <span>{asset.totalDownloads} downloads</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleDownloadOrBuy(asset)}
                  className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 ${
                    isFree
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                      : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                  }`}
                >
                  <Download className="w-4 h-4" />
                  <span>
                    {isFree
                      ? lang === 'pt'
                        ? 'Baixar Gratuitamente'
                        : 'Download Free'
                      : lang === 'pt'
                      ? `Comprar por $${asset.promotionalPriceCad || asset.regularPriceCad} CAD`
                      : `Get Copy for $${asset.promotionalPriceCad || asset.regularPriceCad} CAD`}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Free Lead Magnet Capture Banner (Email Marketing) */}
      <div className="bg-blue-50 border border-blue-200/80 rounded-2xl p-6 sm:p-8">
        <div className="max-w-2xl mx-auto text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-xs">
            <Mail className="w-6 h-6" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {lang === 'pt'
              ? 'Receba Atualizações Fiscais e Modelos Gratuitos'
              : 'Get Tax Updates & Free Canadian Templates'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600">
            {lang === 'pt'
              ? 'Assine nossa newsletter salarial. Enviamos quinzenalmente novidades sobre as leis da CNESST, barèmes da Receita Federal (ARC) e modelos de negociação de aumento.'
              : 'Join over 12,000 workers receiving our bi-weekly Canadian labor standards and tax optimization digests.'}
          </p>

          {newsletterSubmitted ? (
            <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{lang === 'pt' ? 'Inscrição confirmada com sucesso! Verifique sua caixa de entrada.' : 'Success! Check your inbox for the starter pack.'}</span>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="seu.email@exemplo.com"
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer whitespace-nowrap"
              >
                {lang === 'pt' ? 'Quero Receber' : 'Subscribe Free'}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Internal Modal Fallback if activeAssetForModal */}
      {activeAssetForModal && (
        <EbookModal
          isOpen={true}
          onClose={() => setActiveAssetForModal(null)}
          lang={lang}
          initialAssetId={activeAssetForModal}
        />
      )}
    </div>
  );
};
