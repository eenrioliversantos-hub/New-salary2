'use client';

import React, { useState, useEffect, useMemo, useSyncExternalStore } from 'react';
import { Language } from '@/lib/i18n';
import { adminStore, DigitalAsset } from '@/lib/admin-store';
import {
  BookOpen,
  CheckCircle2,
  Download,
  Sparkles,
  ShieldCheck,
  X,
  CreditCard,
  Check,
  Tag,
  FileText,
  FileSpreadsheet,
  CheckSquare,
  Compass,
  ArrowLeft,
  ExternalLink,
  Layers,
  Clock,
  FileCheck,
  Filter,
  Lock,
} from 'lucide-react';
import { normalizeUrl } from '@/lib/utils';

interface EbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  initialAssetId?: string;
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  ebook: BookOpen,
  template: FileText,
  spreadsheet: FileSpreadsheet,
  checklist: CheckSquare,
  guide: Compass,
};

export const EbookModal: React.FC<EbookModalProps> = ({
  isOpen,
  onClose,
  lang,
  initialAssetId,
}) => {
  const ebookConfig = useSyncExternalStore(
    (cb) => adminStore.subscribe(cb),
    () => adminStore.getEbookConfig(),
    () => adminStore.getInitialEbookConfig()
  );

  const digitalAssets = useSyncExternalStore(
    (cb) => adminStore.subscribe(cb),
    () => adminStore.getDigitalAssets(),
    () => adminStore.getInitialDigitalAssets()
  );

  // Active Selected Asset
  const [selectedAssetId, setSelectedAssetId] = useState<string>(
    initialAssetId || 'ebook-salario-quebec-2026'
  );

  // Active Catalog Filter
  const [filterType, setFilterType] = useState<'all' | 'free' | 'paid'>('all');

  // View state: 'detail' (focused on product) or 'catalog'
  const [viewMode, setViewMode] = useState<'detail' | 'catalog'>('detail');

  // Checkout / Download States
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchased, setPurchased] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [couponSuccess, setCouponSuccess] = useState('');
  const [couponError, setCouponError] = useState('');

  // Store prevInitialAssetId to sync state during render
  const [prevInitialAssetId, setPrevInitialAssetId] = useState<string | undefined>(initialAssetId);
  if (initialAssetId !== prevInitialAssetId) {
    setPrevInitialAssetId(initialAssetId);
    if (initialAssetId) {
      setSelectedAssetId(initialAssetId);
      setViewMode('detail');
    }
  }

  // Analytics event on modal open
  useEffect(() => {
    if (isOpen) {
      adminStore.logEvent({
        type: 'ebook_view',
        summary: 'Visualização da Central de E-books & Materiais Digitais',
        location: 'Québec, Canada',
        details: 'Modal da central aberto pelo usuário',
      });
    }
  }, [isOpen]);

  // Reset transient form state when switching product
  const handleSelectAsset = (assetId: string) => {
    setSelectedAssetId(assetId);
    setViewMode('detail');
    setPurchased(false);
    setDownloadSuccess(false);
    setCouponDiscount(0);
    setCouponSuccess('');
    setCouponError('');
  };

  const currentAsset = useMemo(() => {
    return (
      digitalAssets.find((a) => a.id === selectedAssetId) ||
      digitalAssets.find((a) => a.featured) ||
      digitalAssets[0]
    );
  }, [digitalAssets, selectedAssetId]);

  const filteredAssets = useMemo(() => {
    return digitalAssets.filter((a) => {
      if (a.salesStatus === 'draft') return false;
      if (filterType === 'free') return a.accessType === 'free';
      if (filterType === 'paid') return a.accessType === 'paid';
      return true;
    });
  }, [digitalAssets, filterType]);

  if (!isOpen || !currentAsset) return null;

  const isFree = currentAsset.accessType === 'free';
  const basePrice = currentAsset.promotionalPriceCad || 9.99;
  const finalPrice = Math.max(1, Number((basePrice - couponDiscount).toFixed(2)));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    const code = couponCode.trim().toUpperCase();
    const found = ebookConfig.coupons?.find((c) => c.code.toUpperCase() === code && c.active);
    if (found) {
      let discount = 0;
      if (found.discountPercent) {
        discount = (basePrice * found.discountPercent) / 100;
      } else if (found.discountFixedCad) {
        discount = found.discountFixedCad;
      }
      setCouponDiscount(discount);
      setCouponSuccess(
        lang === 'pt'
          ? `Cupom ${found.code} aplicado! Economia de $${discount.toFixed(2)} CAD.`
          : `Coupon ${found.code} appliqué! Économie de ${discount.toFixed(2)} $ CAD.`
      );
    } else {
      setCouponError(
        lang === 'pt' ? 'Cupom inválido ou expirado.' : 'Coupon invalide ou expiré.'
      );
    }
  };

  const handleFreeDownload = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setDownloadSuccess(true);

      adminStore.recordDigitalAssetDownload(currentAsset.id, email);

      // Trigger browser direct download
      const link = document.createElement('a');
      link.href = normalizeUrl(currentAsset.downloadUrl);
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      const ext = currentAsset.fileFormat ? currentAsset.fileFormat.toLowerCase().split(' ')[0] : 'pdf';
      link.setAttribute('download', `${currentAsset.id}.${ext}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 700);
  };

  const handleBuyPaidAsset = () => {
    if (!email || !email.includes('@')) {
      alert(
        lang === 'pt'
          ? 'Por favor, informe seu e-mail para receber o recibo e o link de acesso.'
          : 'Veuillez saisir une adresse courriel valide pour recevoir le lien.'
      );
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPurchased(true);

      // Record in admin sales ledger
      adminStore.recordEbookSale({
        customerEmail: email.trim(),
        amountCad: finalPrice,
        assetId: currentAsset.id,
        assetTitle: currentAsset.title,
        couponUsed: couponDiscount > 0 ? couponCode.trim().toUpperCase() : undefined,
        status: 'delivered',
        downloadAccessCount: 1,
      });

      // Auto trigger download
      const link = document.createElement('a');
      link.href = normalizeUrl(currentAsset.downloadUrl);
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      const extPaid = currentAsset.fileFormat ? currentAsset.fileFormat.toLowerCase().split(' ')[0] : 'pdf';
      link.setAttribute('download', `${currentAsset.id}.${extPaid}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 900);
  };

  const CatIcon = CATEGORY_ICONS[currentAsset.category] || BookOpen;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* ==================================================== */}
        {/* MODAL HEADER & CATALOG SELECTOR BAR */}
        {/* ==================================================== */}
        <div className="bg-slate-900 text-white px-5 sm:px-7 py-3.5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <CatIcon className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                  {lang === 'pt' ? 'Central de E-books & Recursos Digitais' : 'Centre d’E-books & Ressources Numériques'}
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] text-slate-300 font-mono">
                  Québec 2026
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-white truncate max-w-sm sm:max-w-md">
                {viewMode === 'catalog' ? (
                  lang === 'pt' ? 'Biblioteca de Materiais & Guias' : 'Bibliothèque de Guides & Outils'
                ) : (
                  currentAsset.title
                )}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setViewMode(viewMode === 'catalog' ? 'detail' : 'catalog')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              <span>
                {viewMode === 'catalog'
                  ? (lang === 'pt' ? 'Ver Material Selecionado' : 'Voir le guide')
                  : (lang === 'pt' ? `Explorar Todos (${digitalAssets.length})` : `Tous les guides (${digitalAssets.length})`)}
              </span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ==================================================== */}
        {/* SUB-HEADER QUICK CAROUSEL / ASSET CHIPS */}
        {/* ==================================================== */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-2 overflow-x-auto shrink-0">
          <div className="flex items-center gap-2 overflow-x-auto py-0.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0 hidden sm:inline">
              {lang === 'pt' ? 'Materiais:' : 'Guides:'}
            </span>
            {digitalAssets.map((asset) => {
              const isSelected = asset.id === selectedAssetId && viewMode === 'detail';
              const IconComp = CATEGORY_ICONS[asset.category] || BookOpen;
              return (
                <button
                  key={asset.id}
                  type="button"
                  onClick={() => handleSelectAsset(asset.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[130px] sm:max-w-[180px]">{asset.title}</span>
                  {asset.accessType === 'free' ? (
                    <span
                      className={`text-[9px] font-black px-1.5 py-0.2 rounded-full ${
                        isSelected ? 'bg-emerald-400 text-slate-900' : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      GRÁTIS
                    </span>
                  ) : (
                    <span
                      className={`text-[9px] font-black px-1.5 py-0.2 rounded-full ${
                        isSelected ? 'bg-amber-400 text-slate-900' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      ${asset.promotionalPriceCad} CAD
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setViewMode(viewMode === 'catalog' ? 'detail' : 'catalog')}
            className="sm:hidden px-2.5 py-1 rounded-lg bg-slate-200 text-slate-700 text-[11px] font-bold shrink-0 cursor-pointer"
          >
            {viewMode === 'catalog' ? 'Fechar Catálogo' : 'Ver Todos'}
          </button>
        </div>

        {/* ==================================================== */}
        {/* VIEW 1: FULL CATALOG BROWSER */}
        {/* ==================================================== */}
        {viewMode === 'catalog' ? (
          <div className="p-5 sm:p-7 overflow-y-auto space-y-5 flex-1 bg-slate-50/50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-base font-extrabold text-slate-900">
                  {lang === 'pt' ? 'Catálogo Completo de Materiais & Ferramentas' : 'Catalogue Complet de Ressources'}
                </h4>
                <p className="text-xs text-slate-500">
                  {lang === 'pt'
                    ? 'Baixe modelos práticos gratuitos e adquira os guias completos de remuneração e impostos no Québec.'
                    : 'Téléchargez nos gabarits gratuits ou procurez-vous les guides de référence au Québec.'}
                </p>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-200/80 p-1 rounded-xl shrink-0">
                <button
                  type="button"
                  onClick={() => setFilterType('all')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    filterType === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {lang === 'pt' ? 'Todos' : 'Tous'} ({digitalAssets.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType('free')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    filterType === 'free' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {lang === 'pt' ? '100% Gratuitos' : 'Gratuits'}
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType('paid')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    filterType === 'paid' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {lang === 'pt' ? 'Guias Premium ($CAD)' : 'Premium ($CAD)'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAssets.map((asset) => {
                const Icon = CATEGORY_ICONS[asset.category] || BookOpen;
                return (
                  <div
                    key={asset.id}
                    className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                            <Icon className="w-4 h-4" />
                          </span>
                          <span className="text-[10px] uppercase font-bold text-slate-400">
                            {asset.fileFormat} • {asset.fileSize}
                          </span>
                        </div>

                        {asset.accessType === 'free' ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-extrabold">
                            {lang === 'pt' ? '100% Gratuito' : 'Gratuit'}
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-black">
                            ${asset.promotionalPriceCad.toFixed(2)} CAD
                          </span>
                        )}
                      </div>

                      <div>
                        <h5 className="font-extrabold text-sm text-slate-900 leading-snug">{asset.title}</h5>
                        <p className="text-xs text-slate-600 mt-1 line-clamp-2">{asset.subtitle}</p>
                      </div>

                      {asset.highlights && asset.highlights.length > 0 && (
                        <div className="space-y-1 pt-1">
                          {asset.highlights.slice(0, 2).map((h, i) => (
                            <div key={i} className="text-[11px] text-slate-600 flex items-center gap-1.5">
                              <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                              <span className="line-clamp-1">{h}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">
                        {asset.pageOrItemCount || `${asset.fileFormat} Oficial`}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleSelectAsset(asset.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          asset.accessType === 'free'
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                            : 'bg-blue-600 hover:bg-blue-500 text-white'
                        }`}
                      >
                        {asset.accessType === 'free'
                          ? (lang === 'pt' ? 'Baixar Gratuitamente' : 'Télécharger gratuitement')
                          : (lang === 'pt' ? 'Ver & Adquirir' : 'Voir les détails')}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* ==================================================== */
          /* VIEW 2: PRODUCT DETAIL (FREE DOWNLOAD OR PAID CHECKOUT) */
          /* ==================================================== */
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 bg-white">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
              {/* Left Column: Product Presentation (7 cols) */}
              <div className="lg:col-span-7 space-y-5">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-extrabold">
                      <CatIcon className="w-3.5 h-3.5" />
                      <span>{currentAsset.fileFormat}</span>
                    </span>

                    {currentAsset.badge && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
                        {currentAsset.badge}
                      </span>
                    )}

                    <span className="text-xs text-slate-400 font-medium">
                      {currentAsset.fileSize} • {currentAsset.pageOrItemCount || 'Edição Atualizada 2026'}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                    {currentAsset.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                    {currentAsset.subtitle}
                  </p>
                </div>

                {/* Description Text */}
                {currentAsset.description && (
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                    {currentAsset.description}
                  </div>
                )}

                {/* Highlights / Features Included */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                    {lang === 'pt' ? 'O que está incluído neste material:' : 'Ce que comprend cette ressource :'}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(currentAsset.highlights || []).map((highlight, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-200/90 text-xs text-slate-800 flex items-start gap-2.5"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="font-medium">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Free vs Paid Assurance Banner */}
                <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex items-center gap-3 text-xs text-blue-900">
                  <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
                  <div>
                    <span className="font-bold block">
                      {isFree
                        ? (lang === 'pt' ? 'Acesso 100% Gratuito e Imediato' : 'Accès 100% Gratuit et Immédiat')
                        : (lang === 'pt' ? 'Garantia de Satisfação de 30 Dias' : 'Garantie de satisfaction de 30 jours')}
                    </span>
                    <span className="text-[11px] text-blue-700">
                      {isFree
                        ? (lang === 'pt' ? 'Baixe diretamente sem burocracia ou taxas ocultas.' : 'Téléchargement direct sans frais.')
                        : (lang === 'pt' ? 'Se você não gostar do material, reembolsamos 100% do valor.' : 'Remboursement intégral si non satisfait.')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Download or Checkout Card (5 cols) */}
              <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm">
                {/* Free Download Flow */}
                {isFree ? (
                  downloadSuccess ? (
                    <div className="text-center py-6 space-y-4">
                      <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                        <Check className="w-7 h-7 stroke-[3]" />
                      </div>
                      <div>
                        <h4 className="text-base font-extrabold text-slate-900">
                          {lang === 'pt' ? 'Download Iniciado!' : 'Téléchargement lancé !'}
                        </h4>
                        <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto">
                          {lang === 'pt'
                            ? `O arquivo "${currentAsset.title}" (${currentAsset.fileFormat}) foi gerado e está sendo baixado no seu navegador.`
                            : `Votre ressource "${currentAsset.title}" est en cours de téléchargement.`}
                        </p>
                      </div>

                      <a
                        href={normalizeUrl(currentAsset.downloadUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                      >
                        <Download className="w-4 h-4" />
                        <span>{lang === 'pt' ? 'Baixar Novamente' : 'Télécharger à nouveau'}</span>
                      </a>
                    </div>
                  ) : (
                    <form onSubmit={handleFreeDownload} className="space-y-4">
                      <div className="text-center pb-2 border-b border-slate-200">
                        <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider inline-block mb-1">
                          {lang === 'pt' ? 'Download 100% Grátis' : 'Téléchargement Gratuit'}
                        </span>
                        <div className="text-2xl font-black text-slate-900">$0.00 CAD</div>
                        <span className="text-[11px] text-slate-400">
                          {lang === 'pt' ? 'Sem custos ou necessidade de cartão' : 'Sans carte ni frais cachés'}
                        </span>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {lang === 'pt' ? 'Seu E-mail (Para Envio da Cópia):' : 'Votre courriel (facultatif) :'}
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="seu.email@exemplo.com"
                          className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          {lang === 'pt'
                            ? 'Opcional. O download direto no navegador inicia imediatamente.'
                            : 'Le téléchargement dans votre navigateur démarre immédiatement.'}
                        </span>
                      </div>

                      <button
                        type="submit"
                        disabled={isProcessing}
                        className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 active:scale-98"
                      >
                        {isProcessing ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>{lang === 'pt' ? 'Iniciando download...' : 'Téléchargement...'}</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4" />
                            <span>
                              {lang === 'pt'
                                ? `Baixar ${currentAsset.fileFormat} Gratuitamente`
                                : `Télécharger ${currentAsset.fileFormat} Gratuit`}
                            </span>
                          </>
                        )}
                      </button>

                      <div className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{lang === 'pt' ? 'Livre de vírus e aprovado para 2026' : 'Garanti sans virus et sécurisé'}</span>
                      </div>
                    </form>
                  )
                ) : (
                  /* Paid Checkout Flow */
                  purchased ? (
                    <div className="text-center py-6 space-y-4">
                      <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                        <Check className="w-7 h-7 stroke-[3]" />
                      </div>
                      <div>
                        <h4 className="text-base font-extrabold text-slate-900">
                          {lang === 'pt' ? 'Pagamento Confirmado!' : 'Paiement confirmé !'}
                        </h4>
                        <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto">
                          {lang === 'pt'
                            ? `Recibo emitido para ${email}. Seu acesso ao material "${currentAsset.title}" foi liberado com sucesso.`
                            : `Reçu envoyé à ${email}. Votre accès à "${currentAsset.title}" est débloqué.`}
                        </p>
                      </div>

                      <a
                        href={normalizeUrl(currentAsset.downloadUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-md transition-all cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        <span>{lang === 'pt' ? 'Baixar Arquivo Completo Agora' : 'Télécharger la ressource'}</span>
                      </a>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Price header */}
                      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">
                            {lang === 'pt' ? 'Preço Promocional' : 'Prix Spécial'}
                          </span>
                          {currentAsset.regularPriceCad > currentAsset.promotionalPriceCad && (
                            <span className="text-xs text-slate-400 line-through">
                              ${currentAsset.regularPriceCad.toFixed(2)} CAD
                            </span>
                          )}
                        </div>

                        <div className="text-right">
                          <span className="text-2xl font-black text-amber-600">
                            ${finalPrice.toFixed(2)} CAD
                          </span>
                          {couponDiscount > 0 && (
                            <span className="text-[10px] font-bold text-emerald-700 block">
                              Cupom (-${couponDiscount.toFixed(2)})
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Email for Delivery */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {lang === 'pt' ? 'Seu E-mail para Envio do Acesso & Recibo:' : 'Votre courriel pour recevoir la ressource :'}
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="seu.email@exemplo.com"
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      {/* Coupon Code Input */}
                      <form onSubmit={handleApplyCoupon} className="flex gap-2">
                        <div className="relative flex-1">
                          <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                          <input
                            type="text"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            placeholder={lang === 'pt' ? 'Tem cupom? (Ex: LANCA10)' : 'Code promo ?'}
                            className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs uppercase text-slate-800 placeholder-slate-400 font-mono"
                          />
                        </div>
                        <button
                          type="submit"
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                        >
                          {lang === 'pt' ? 'Aplicar' : 'Appliquer'}
                        </button>
                      </form>

                      {couponSuccess && (
                        <p className="text-xs text-emerald-600 font-semibold">{couponSuccess}</p>
                      )}
                      {couponError && (
                        <p className="text-xs text-rose-500 font-semibold">{couponError}</p>
                      )}

                      {/* Buy Button */}
                      <button
                        type="button"
                        onClick={handleBuyPaidAsset}
                        disabled={isProcessing || !email}
                        className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 active:scale-98"
                      >
                        {isProcessing ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>{lang === 'pt' ? 'Processando pagamento...' : 'Traitement...'}</span>
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-4 h-4" />
                            <span>
                              {lang === 'pt'
                                ? `Comprar Agora ($${finalPrice.toFixed(2)} CAD)`
                                : `Acheter Maintenant (${finalPrice.toFixed(2)} $ CAD)`}
                            </span>
                          </>
                        )}
                      </button>

                      <div className="flex items-center justify-center gap-3 text-[11px] text-slate-400 pt-1">
                        <span className="flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Garantia 30 dias</span>
                        </span>
                        <span>•</span>
                        <span>Download Imediato</span>
                        <span>•</span>
                        <span>SSL 256-bit</span>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
