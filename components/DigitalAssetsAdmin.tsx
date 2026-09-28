'use client';

import React, { useState, useMemo } from 'react';
import {
  DigitalAsset,
  EbookOrder,
  EbookConfig,
  EbookCoupon,
  adminStore,
} from '@/lib/admin-store';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Download,
  Eye,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  DollarSign,
  Search,
  Sparkles,
  Tag,
  CreditCard,
  Layers,
  FileText,
  FileSpreadsheet,
  CheckSquare,
  Compass,
  FileCheck,
  ExternalLink,
  Copy,
  RefreshCw,
  X,
  Save,
  Check,
  Percent,
  Archive,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { normalizeUrl } from '@/lib/utils';

interface DigitalAssetsAdminProps {
  digitalAssets: DigitalAsset[];
  ebookOrders: EbookOrder[];
  ebookConfig: EbookConfig;
  showToast: (msg: string) => void;
}

const CATEGORY_LABELS: Record<DigitalAsset['category'], { label: string; icon: React.ElementType; color: string }> = {
  ebook: { label: 'E-book / Livro Digital', icon: BookOpen, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  template: { label: 'Modelo / Template CV', icon: FileText, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  spreadsheet: { label: 'Planilha Automatizada', icon: FileSpreadsheet, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  checklist: { label: 'Checklist / Passo a Passo', icon: CheckSquare, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
  guide: { label: 'Guia Prático / Manual', icon: Compass, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
};

const BADGE_COLOR_CLASSES: Record<NonNullable<DigitalAsset['badgeColor']>, { bg: string; text: string; border: string }> = {
  amber: { bg: 'bg-amber-500/20', text: 'text-amber-300', border: 'border-amber-500/30' },
  emerald: { bg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-500/30' },
  blue: { bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-500/30' },
  purple: { bg: 'bg-purple-500/20', text: 'text-purple-300', border: 'border-purple-500/30' },
  indigo: { bg: 'bg-indigo-500/20', text: 'text-indigo-300', border: 'border-indigo-500/30' },
  rose: { bg: 'bg-rose-500/20', text: 'text-rose-300', border: 'border-rose-500/30' },
};

export const DigitalAssetsAdmin: React.FC<DigitalAssetsAdminProps> = ({
  digitalAssets,
  ebookOrders,
  ebookConfig,
  showToast,
}) => {
  // Navigation Sub-tab
  const [subTab, setSubTab] = useState<'catalog' | 'orders' | 'coupons' | 'settings'>('catalog');

  // Filters & Search for Catalog
  const [assetFilter, setAssetFilter] = useState<'all' | 'free' | 'paid' | DigitalAsset['category']>('all');
  const [assetSearch, setAssetSearch] = useState('');

  // Asset Modal States
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [isNewAsset, setIsNewAsset] = useState(false);
  const [editingAsset, setEditingAsset] = useState<DigitalAsset | null>(null);
  const [newHighlightText, setNewHighlightText] = useState('');

  // Orders State
  const [orderSearch, setOrderSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState<'all' | 'delivered' | 'completed' | 'refunded'>('all');
  const [isManualSaleOpen, setIsManualSaleOpen] = useState(false);
  const [manualSaleEmail, setManualSaleEmail] = useState('');
  const [manualSaleAssetId, setManualSaleAssetId] = useState<string>(digitalAssets[0]?.id || '');
  const [manualSaleAmount, setManualSaleAmount] = useState<number>(9.99);

  // Coupons State
  const [isNewCouponOpen, setIsNewCouponOpen] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState<number>(15);
  const [newCouponType, setNewCouponType] = useState<'percent' | 'fixed'>('percent');

  // Computed Metrics
  const metrics = useMemo(() => {
    const totalAssets = digitalAssets.length;
    const activeAssets = digitalAssets.filter((a) => a.salesStatus === 'active').length;
    const paidAssets = digitalAssets.filter((a) => a.accessType === 'paid').length;
    const freeAssets = digitalAssets.filter((a) => a.accessType === 'free').length;
    const totalDownloads = digitalAssets.reduce((sum, a) => sum + (a.totalDownloads || 0), 0);
    const totalSales = digitalAssets.reduce((sum, a) => sum + (a.totalSales || 0), 0);
    const totalRevenue = digitalAssets.reduce((sum, a) => sum + (a.totalRevenueCad || 0), 0);
    const completedOrders = ebookOrders.filter((o) => o.status !== 'refunded');
    const totalOrdersRevenue = completedOrders.reduce((sum, o) => sum + (o.amountCad || 0), 0);
    const avgTicket = completedOrders.length > 0 ? (totalOrdersRevenue / completedOrders.length).toFixed(2) : '0.00';

    return {
      totalAssets,
      activeAssets,
      paidAssets,
      freeAssets,
      totalDownloads,
      totalSales,
      totalRevenue: totalRevenue || totalOrdersRevenue,
      totalOrdersCount: ebookOrders.length,
      avgTicket,
    };
  }, [digitalAssets, ebookOrders]);

  // Filtered Assets
  const filteredAssets = useMemo(() => {
    return digitalAssets.filter((asset) => {
      if (assetFilter === 'free' && asset.accessType !== 'free') return false;
      if (assetFilter === 'paid' && asset.accessType !== 'paid') return false;
      if (
        assetFilter !== 'all' &&
        assetFilter !== 'free' &&
        assetFilter !== 'paid' &&
        asset.category !== assetFilter
      ) {
        return false;
      }

      if (assetSearch.trim()) {
        const q = assetSearch.toLowerCase();
        return (
          asset.title.toLowerCase().includes(q) ||
          asset.subtitle.toLowerCase().includes(q) ||
          (asset.badge && asset.badge.toLowerCase().includes(q)) ||
          (asset.fileFormat && asset.fileFormat.toLowerCase().includes(q))
        );
      }

      return true;
    });
  }, [digitalAssets, assetFilter, assetSearch]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return ebookOrders.filter((order) => {
      if (orderFilter !== 'all' && order.status !== orderFilter) return false;
      if (orderSearch.trim()) {
        const q = orderSearch.toLowerCase();
        return (
          order.id.toLowerCase().includes(q) ||
          order.customerEmail.toLowerCase().includes(q) ||
          (order.assetTitle && order.assetTitle.toLowerCase().includes(q)) ||
          (order.couponUsed && order.couponUsed.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [ebookOrders, orderFilter, orderSearch]);

  // --- CRUD ACTIONS ---

  const handleOpenNewAsset = () => {
    setIsNewAsset(true);
    setEditingAsset({
      id: `asset-${Date.now()}`,
      title: '',
      subtitle: '',
      description: '',
      category: 'ebook',
      accessType: 'free',
      fileFormat: 'PDF',
      fileSize: '3.5 MB',
      pageOrItemCount: '35 páginas',
      regularPriceCad: 0,
      promotionalPriceCad: 0,
      downloadUrl: 'https://paienet.qc.ca/downloads/novo-material.pdf',
      salesStatus: 'active',
      badge: '100% Gratuito',
      badgeColor: 'emerald',
      highlights: [
        'Conteúdo exclusivo atualizado para o ano fiscal vigente',
        'Compatível com leitura em dispositivos móveis e desktop',
      ],
      totalDownloads: 0,
      totalSales: 0,
      totalRevenueCad: 0,
      featured: false,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    });
    setNewHighlightText('');
    setIsAssetModalOpen(true);
  };

  const handleEditAsset = (asset: DigitalAsset) => {
    setIsNewAsset(false);
    setEditingAsset(JSON.parse(JSON.stringify(asset)));
    setNewHighlightText('');
    setIsAssetModalOpen(true);
  };

  const handleDuplicateAsset = (asset: DigitalAsset) => {
    const cloned: DigitalAsset = {
      ...asset,
      id: `asset-${Date.now()}`,
      title: `${asset.title} (Cópia)`,
      totalDownloads: 0,
      totalSales: 0,
      totalRevenueCad: 0,
      featured: false,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    adminStore.saveDigitalAsset(cloned);
    showToast(`Material "${cloned.title}" duplicado com sucesso!`);
  };

  const handleDeleteAsset = (asset: DigitalAsset) => {
    if (confirm(`Tem certeza que deseja excluir o material "${asset.title}"? Esta ação removerá o ativo do catálogo.`)) {
      adminStore.deleteDigitalAsset(asset.id);
      showToast(`Material "${asset.title}" excluído com sucesso!`);
    }
  };

  const handleToggleStatus = (assetId: string) => {
    adminStore.toggleDigitalAssetStatus(assetId);
    showToast('Status de visibilidade do material atualizado!');
  };

  const handleSaveAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAsset) return;

    if (!editingAsset.title.trim()) {
      alert('Por favor, informe o título do material.');
      return;
    }

    if (!editingAsset.downloadUrl.trim()) {
      alert('Por favor, informe a URL ou link de download do arquivo.');
      return;
    }

    const payload: DigitalAsset = {
      ...editingAsset,
      regularPriceCad: editingAsset.accessType === 'free' ? 0 : Number(editingAsset.regularPriceCad || 0),
      promotionalPriceCad: editingAsset.accessType === 'free' ? 0 : Number(editingAsset.promotionalPriceCad || 0),
    };

    adminStore.saveDigitalAsset(payload);
    setIsAssetModalOpen(false);
    setEditingAsset(null);
    showToast(isNewAsset ? '🎉 Novo material adicionado ao catálogo!' : '✅ Alterações salvas com sucesso!');
  };

  const handleAddHighlight = () => {
    if (!newHighlightText.trim() || !editingAsset) return;
    setEditingAsset({
      ...editingAsset,
      highlights: [...(editingAsset.highlights || []), newHighlightText.trim()],
    });
    setNewHighlightText('');
  };

  const handleRemoveHighlight = (idx: number) => {
    if (!editingAsset) return;
    const h = [...(editingAsset.highlights || [])];
    h.splice(idx, 1);
    setEditingAsset({ ...editingAsset, highlights: h });
  };

  // Test Download simulator
  const handleTestDownload = (asset: DigitalAsset) => {
    adminStore.recordDigitalAssetDownload(asset.id);
    const link = document.createElement('a');
    link.href = normalizeUrl(asset.downloadUrl);
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    const ext = asset.fileFormat ? asset.fileFormat.toLowerCase().split(' ')[0] : 'pdf';
    link.setAttribute('download', `${asset.id}.${ext}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Iniciando teste de download de "${asset.title}"...`);
  };

  // Manual Sale Handler
  const handleRecordManualSale = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualSaleEmail.includes('@')) {
      alert('Digite um e-mail válido.');
      return;
    }

    const selectedAsset = digitalAssets.find((a) => a.id === manualSaleAssetId);
    adminStore.recordEbookSale({
      customerEmail: manualSaleEmail.trim(),
      amountCad: Number(manualSaleAmount) || 0,
      assetId: manualSaleAssetId,
      assetTitle: selectedAsset?.title,
      status: 'delivered',
      downloadAccessCount: 1,
    });

    setIsManualSaleOpen(false);
    setManualSaleEmail('');
    showToast('Venda manual registrada e acesso concedido ao cliente!');
  };

  // Coupon Handlers
  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = newCouponCode.trim().toUpperCase();
    if (!code) {
      alert('Informe o código do cupom.');
      return;
    }

    const newCoupon: EbookCoupon = {
      code,
      discountPercent: newCouponType === 'percent' ? Number(newCouponDiscount) : undefined,
      discountFixedCad: newCouponType === 'fixed' ? Number(newCouponDiscount) : undefined,
      active: true,
      usesCount: 0,
    };

    adminStore.saveCoupon(newCoupon);
    setIsNewCouponOpen(false);
    setNewCouponCode('');
    showToast(`Cupom "${code}" criado com sucesso!`);
  };

  const handleToggleCoupon = (code: string) => {
    adminStore.toggleCoupon(code);
    showToast(`Status do cupom ${code} alterado!`);
  };

  const handleDeleteCoupon = (code: string) => {
    if (confirm(`Excluir cupom ${code}?`)) {
      adminStore.deleteCoupon(code);
      showToast(`Cupom ${code} removido!`);
    }
  };

  const handleExportOrders = () => {
    const csvContent = adminStore.exportOrdersCsv();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `relatorio_vendas_digital_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Relatório de vendas exportado com sucesso!');
  };

  return (
    <div className="space-y-6">
      {/* ==================================================== */}
      {/* 1. TOP ANALYTICS DASHBOARD - METRICS CARDS */}
      {/* ==================================================== */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-xl -mr-6 -mt-6 pointer-events-none" />
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-xs font-semibold">Faturamento Total</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">
            ${metrics.totalRevenue.toFixed(2)}{' '}
            <span className="text-xs font-bold text-amber-400">CAD</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <span className="text-emerald-400 font-bold">100% Margem</span>
            <span>• {metrics.totalSales} pedidos pagos</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl -mr-6 -mt-6 pointer-events-none" />
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-xs font-semibold">Downloads Realizados</span>
            <Download className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">
            {metrics.totalDownloads.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <span className="text-blue-400 font-semibold">Gratuitos + Pagos</span>
            <span>• Alta retenção</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl -mr-6 -mt-6 pointer-events-none" />
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-xs font-semibold">Ativos no Catálogo</span>
            <Layers className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">
            {metrics.totalAssets}{' '}
            <span className="text-xs text-slate-400 font-normal">
              ({metrics.activeAssets} ativos)
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <span className="text-emerald-400 font-semibold">{metrics.freeAssets} Gratuitos</span>
            <span>•</span>
            <span className="text-amber-400 font-semibold">{metrics.paidAssets} Pagos</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-xl -mr-6 -mt-6 pointer-events-none" />
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-xs font-semibold">Ticket Médio (Vendas)</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">
            ${metrics.avgTicket}{' '}
            <span className="text-xs font-bold text-purple-400">CAD</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            <span>{ebookConfig.coupons?.length || 0} cupons de desconto ativos</span>
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* 2. SUB-NAVIGATION TABS */}
      {/* ==================================================== */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-950/80 p-2.5 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setSubTab('catalog')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              subTab === 'catalog'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Catálogo de Ativos Digitais ({digitalAssets.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('orders')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              subTab === 'orders'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Histórico de Pedidos ({ebookOrders.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('coupons')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              subTab === 'coupons'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Cupons de Desconto ({ebookConfig.coupons?.length || 0})</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('settings')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              subTab === 'settings'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Configurações da Loja</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {subTab === 'catalog' && (
            <button
              type="button"
              onClick={handleOpenNewAsset}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition-all cursor-pointer whitespace-nowrap active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Material / E-book</span>
            </button>
          )}

          {subTab === 'orders' && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExportOrders}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exportar CSV</span>
              </button>
              <button
                type="button"
                onClick={() => setIsManualSaleOpen(true)}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Registrar Venda Manual</span>
              </button>
            </div>
          )}

          {subTab === 'coupons' && (
            <button
              type="button"
              onClick={() => setIsNewCouponOpen(true)}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Criar Cupom</span>
            </button>
          )}
        </div>
      </div>

      {/* ==================================================== */}
      {/* 3. SUB-TAB 1: CATALOG OF DIGITAL ASSETS (CRUD) */}
      {/* ==================================================== */}
      {subTab === 'catalog' && (
        <div className="space-y-4">
          {/* Filters & Search Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={assetSearch}
                onChange={(e) => setAssetSearch(e.target.value)}
                placeholder="Buscar material por título, tipo, formato ou tag..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-[11px] text-slate-400 font-semibold shrink-0">Filtrar:</span>
              <button
                type="button"
                onClick={() => setAssetFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-colors ${
                  assetFilter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                Todos ({digitalAssets.length})
              </button>

              <button
                type="button"
                onClick={() => setAssetFilter('free')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-colors flex items-center gap-1 ${
                  assetFilter === 'free'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                <span>Gratuitos</span>
                <span className="text-[10px] px-1 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300">
                  {metrics.freeAssets}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setAssetFilter('paid')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-colors flex items-center gap-1 ${
                  assetFilter === 'paid'
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                <span>Pagos ($CAD)</span>
                <span className="text-[10px] px-1 py-0.2 rounded-full bg-amber-500/20 text-amber-300">
                  {metrics.paidAssets}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setAssetFilter('ebook')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-colors ${
                  assetFilter === 'ebook'
                    ? 'bg-slate-800 text-white border border-slate-700'
                    : 'bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                E-books
              </button>

              <button
                type="button"
                onClick={() => setAssetFilter('template')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-colors ${
                  assetFilter === 'template'
                    ? 'bg-slate-800 text-white border border-slate-700'
                    : 'bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                Templates CV
              </button>

              <button
                type="button"
                onClick={() => setAssetFilter('spreadsheet')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-colors ${
                  assetFilter === 'spreadsheet'
                    ? 'bg-slate-800 text-white border border-slate-700'
                    : 'bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                Planilhas
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAssets.map((asset) => {
              const catInfo = CATEGORY_LABELS[asset.category] || CATEGORY_LABELS.ebook;
              const CatIcon = catInfo.icon;
              const badgeColors = asset.badgeColor
                ? BADGE_COLOR_CLASSES[asset.badgeColor]
                : BADGE_COLOR_CLASSES.blue;

              return (
                <div
                  key={asset.id}
                  className={`p-5 rounded-2xl bg-slate-950/90 border transition-all hover:border-slate-700 flex flex-col justify-between ${
                    asset.salesStatus === 'active'
                      ? 'border-slate-800/80 shadow-md'
                      : 'border-slate-800/40 opacity-75'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header Badges & Actions */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${catInfo.color}`}
                        >
                          <CatIcon className="w-3 h-3" />
                          <span>{catInfo.label}</span>
                        </span>

                        {asset.badge && (
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${badgeColors.bg} ${badgeColors.text} ${badgeColors.border}`}
                          >
                            {asset.badge}
                          </span>
                        )}

                        {asset.featured && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-500/30">
                            <Sparkles className="w-2.5 h-2.5 text-blue-400" />
                            <span>Destaque Principal</span>
                          </span>
                        )}
                      </div>

                      {/* Status toggle pill */}
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(asset.id)}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${
                          asset.salesStatus === 'active'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                        }`}
                        title="Clique para alternar visibilidade (Ativo / Pausado)"
                      >
                        {asset.salesStatus === 'active' ? '● Ativo na Loja' : '○ Pausado'}
                      </button>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h4 className="text-base font-extrabold text-white leading-snug">
                        {asset.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {asset.subtitle}
                      </p>
                    </div>

                    {/* Metadata tags */}
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 bg-slate-900/60 p-2.5 rounded-xl border border-slate-850">
                      <span className="flex items-center gap-1 font-mono">
                        <FileCheck className="w-3.5 h-3.5 text-slate-400" />
                        <strong className="text-slate-200">{asset.fileFormat}</strong>
                      </span>
                      <span>•</span>
                      <span>{asset.fileSize}</span>
                      {asset.pageOrItemCount && (
                        <>
                          <span>•</span>
                          <span>{asset.pageOrItemCount}</span>
                        </>
                      )}
                      <span>•</span>
                      <span className="text-slate-300 font-medium">
                        {asset.accessType === 'free' ? (
                          <span className="text-emerald-400 font-bold">100% Gratuito</span>
                        ) : (
                          <span className="text-amber-400 font-bold">
                            ${asset.promotionalPriceCad.toFixed(2)} CAD
                            {asset.regularPriceCad > asset.promotionalPriceCad && (
                              <span className="text-slate-500 line-through ml-1 text-[10px]">
                                ${asset.regularPriceCad.toFixed(2)}
                              </span>
                            )}
                          </span>
                        )}
                      </span>
                    </div>

                    {/* Highlights bullets preview */}
                    {asset.highlights && asset.highlights.length > 0 && (
                      <ul className="space-y-1 text-[11px] text-slate-300 pt-1">
                        {asset.highlights.slice(0, 3).map((hl, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <Check className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{hl}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Real-time Performance Metrics */}
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-850 text-center">
                      <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-400 block uppercase">Downloads</span>
                        <span className="text-sm font-black text-white">
                          {(asset.totalDownloads || 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-400 block uppercase">Vendas Pagas</span>
                        <span className="text-sm font-black text-amber-400">
                          {asset.totalSales || 0}
                        </span>
                      </div>
                      <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-400 block uppercase">Faturado</span>
                        <span className="text-sm font-black text-emerald-400">
                          ${(asset.totalRevenueCad || 0).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between gap-2 pt-4 mt-3 border-t border-slate-850">
                    <button
                      type="button"
                      onClick={() => handleTestDownload(asset)}
                      className="px-3 py-1.5 bg-slate-850 hover:bg-slate-800 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Testa o link direto de download como o usuário receberia"
                    >
                      <Download className="w-3.5 h-3.5 text-blue-400" />
                      <span>Testar Download</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleDuplicateAsset(asset)}
                        className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        title="Duplicar este material"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleEditAsset(asset)}
                        className="px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 font-bold text-xs flex items-center gap-1.5 border border-blue-500/30 transition-all cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Editar</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteAsset(asset)}
                        className="p-1.5 rounded-xl bg-slate-900 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors cursor-pointer"
                        title="Excluir material do catálogo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredAssets.length === 0 && (
            <div className="p-8 text-center rounded-2xl bg-slate-950 border border-slate-800 text-slate-400">
              <Layers className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-semibold">Nenhum material digital encontrado com os filtros atuais.</p>
              <button
                type="button"
                onClick={() => {
                  setAssetFilter('all');
                  setAssetSearch('');
                }}
                className="mt-3 text-xs text-blue-400 hover:underline cursor-pointer"
              >
                Limpar filtros de busca
              </button>
            </div>
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* 4. SUB-TAB 2: ORDERS MANAGEMENT */}
      {/* ==================================================== */}
      {subTab === 'orders' && (
        <div className="space-y-4">
          {/* Order Search & Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="Buscar pedido por e-mail, código ou produto..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-400 font-semibold">Status:</span>
              <button
                type="button"
                onClick={() => setOrderFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                  orderFilter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                Todos ({ebookOrders.length})
              </button>
              <button
                type="button"
                onClick={() => setOrderFilter('delivered')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                  orderFilter === 'delivered'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                Entregues
              </button>
              <button
                type="button"
                onClick={() => setOrderFilter('refunded')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                  orderFilter === 'refunded'
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                Reembolsados
              </button>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-slate-950/80 rounded-2xl border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800 text-[10px]">
                  <tr>
                    <th className="p-3.5">Pedido</th>
                    <th className="p-3.5">Produto Digital</th>
                    <th className="p-3.5">Email do Cliente</th>
                    <th className="p-3.5">Data</th>
                    <th className="p-3.5">Valor Pago</th>
                    <th className="p-3.5">Cupom</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="p-3.5 font-bold text-white font-mono">{order.id}</td>
                      <td className="p-3.5 font-medium text-slate-200">
                        {order.assetTitle || 'Guia Salário & Emprego 2026'}
                      </td>
                      <td className="p-3.5 text-slate-300 font-mono text-[11px]">
                        {order.customerEmail}
                      </td>
                      <td className="p-3.5 text-slate-400 font-mono text-[11px]">{order.date}</td>
                      <td className="p-3.5 text-emerald-400 font-bold font-mono">
                        ${order.amountCad.toFixed(2)} CAD
                      </td>
                      <td className="p-3.5">
                        {order.couponUsed ? (
                          <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-mono text-[10px]">
                            {order.couponUsed}
                          </span>
                        ) : (
                          <span className="text-slate-500">-</span>
                        )}
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            order.status === 'delivered'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : order.status === 'completed'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {order.status !== 'refunded' ? (
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Marcar pedido ${order.id} como reembolsado?`)) {
                                  adminStore.updateEbookOrder(order.id, { status: 'refunded' });
                                  showToast(`Pedido ${order.id} atualizado para reembolsado.`);
                                }
                              }}
                              className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-rose-400 text-[10px] cursor-pointer"
                              title="Marcar como reembolsado"
                            >
                              Reembolsar
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                adminStore.updateEbookOrder(order.id, { status: 'delivered' });
                                showToast(`Pedido ${order.id} restaurado para entregue.`);
                              }}
                              className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-emerald-400 text-[10px] cursor-pointer"
                            >
                              Restaurar
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Excluir pedido de teste ${order.id}?`)) {
                                adminStore.deleteEbookOrder(order.id);
                                showToast(`Pedido ${order.id} excluído com sucesso.`);
                              }
                            }}
                            className="p-1 rounded-lg bg-slate-900 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 cursor-pointer"
                            title="Excluir pedido"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 5. SUB-TAB 3: COUPONS MANAGEMENT */}
      {/* ==================================================== */}
      {subTab === 'coupons' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
            <div>
              <h4 className="font-extrabold text-sm text-white">Cupons de Desconto & Campanhas</h4>
              <p className="text-xs text-slate-400">
                Gerencie os códigos promocionais aplicáveis pelos clientes durante o checkout de produtos digitais.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsNewCouponOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Cupom Promocional</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {(ebookConfig.coupons || []).map((coupon) => (
              <div
                key={coupon.code}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-xl bg-purple-500/20 text-purple-300 font-mono font-black text-sm border border-purple-500/30">
                      {coupon.code}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleToggleCoupon(coupon.code)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                        coupon.active
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {coupon.active ? 'Ativo' : 'Inativo'}
                    </button>
                  </div>

                  <div className="text-xs text-slate-300 pt-1">
                    {coupon.discountPercent ? (
                      <span className="font-bold text-amber-400">
                        {coupon.discountPercent}% de Desconto
                      </span>
                    ) : (
                      <span className="font-bold text-amber-400">
                        ${coupon.discountFixedCad?.toFixed(2)} CAD de Desconto Fixo
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-400">
                    Utilizado por <strong className="text-white">{coupon.usesCount || 0}</strong> clientes em compras reais.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-850">
                  <span className="text-[10px] text-slate-500 font-mono">
                    Cupom Global da Loja
                  </span>

                  <button
                    type="button"
                    onClick={() => handleDeleteCoupon(coupon.code)}
                    className="p-1 rounded-lg bg-slate-900 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 cursor-pointer"
                    title="Excluir cupom"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 6. SUB-TAB 4: SETTINGS & GLOBAL CONFIG */}
      {/* ==================================================== */}
      {subTab === 'settings' && (
        <div className="space-y-4">
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <h4 className="font-extrabold text-sm text-white">Parâmetros do Produto Destaque (Carro-Chefe)</h4>
            <p className="text-xs text-slate-400">
              Esses dados alimentam as chamadas oficiais e banners do Guia no rodapé e artigos do blog.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Título Oficial</label>
                <input
                  type="text"
                  value={ebookConfig.title}
                  onChange={(e) => adminStore.updateEbookConfig({ title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Subtítulo / Chamada</label>
                <input
                  type="text"
                  value={ebookConfig.subtitle}
                  onChange={(e) => adminStore.updateEbookConfig({ subtitle: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Preço Promocional ($CAD)</label>
                <input
                  type="number"
                  step="0.50"
                  value={ebookConfig.promotionalPriceCad}
                  onChange={(e) =>
                    adminStore.updateEbookConfig({ promotionalPriceCad: parseFloat(e.target.value) || 9.99 })
                  }
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Status de Vendas</label>
                <select
                  value={ebookConfig.salesStatus}
                  onChange={(e) =>
                    adminStore.updateEbookConfig({ salesStatus: e.target.value as EbookConfig['salesStatus'] })
                  }
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                >
                  <option value="active">Vendas Ativas (Disponível)</option>
                  <option value="paused">Vendas Pausadas</option>
                  <option value="presale">Pré-Venda Promocional</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">Link Direto de Download (PDF)</label>
                <input
                  type="text"
                  value={ebookConfig.downloadUrl}
                  onChange={(e) => adminStore.updateEbookConfig({ downloadUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 7. MODAL: CREATE / EDIT DIGITAL ASSET (FULL CRUD) */}
      {/* ==================================================== */}
      {isAssetModalOpen && editingAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-5 sm:p-7 space-y-5 my-auto max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">
                    {isNewAsset ? 'Adicionar Novo Material Digital' : 'Editar Material Digital'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Defina dados, tipo de acesso (grátis ou pago), preço, link de entrega e destaques.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsAssetModalOpen(false);
                  setEditingAsset(null);
                }}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAsset} className="space-y-4 text-xs">
              {/* Access Type Switcher (FREE vs PAID) */}
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <label className="block text-slate-300 font-bold mb-2">Modelo de Disponibilização & Acesso:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setEditingAsset({
                        ...editingAsset,
                        accessType: 'free',
                        regularPriceCad: 0,
                        promotionalPriceCad: 0,
                        badge: editingAsset.badge || '100% Gratuito',
                        badgeColor: 'emerald',
                      })
                    }
                    className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-bold cursor-pointer transition-all ${
                      editingAsset.accessType === 'free'
                        ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 shadow-sm'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Download className="w-4 h-4 text-emerald-400" />
                    <span>🆓 Material Gratuito (Download Imediato)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setEditingAsset({
                        ...editingAsset,
                        accessType: 'paid',
                        regularPriceCad: editingAsset.regularPriceCad || 19.99,
                        promotionalPriceCad: editingAsset.promotionalPriceCad || 9.99,
                        badge: editingAsset.badge === '100% Gratuito' ? 'Bestseller' : editingAsset.badge,
                        badgeColor: 'amber',
                      })
                    }
                    className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-bold cursor-pointer transition-all ${
                      editingAsset.accessType === 'paid'
                        ? 'bg-amber-600/20 border-amber-500 text-amber-300 shadow-sm'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-amber-400" />
                    <span>💎 Material Pago (Com Checkout $CAD)</span>
                  </button>
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-semibold mb-1">Título do Material *</label>
                  <input
                    type="text"
                    required
                    value={editingAsset.title}
                    onChange={(e) => setEditingAsset({ ...editingAsset, title: e.target.value })}
                    placeholder="Ex: Modelo de Currículo Québécois Compatível com ATS"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-semibold mb-1">Subtítulo Resumido *</label>
                  <input
                    type="text"
                    required
                    value={editingAsset.subtitle}
                    onChange={(e) => setEditingAsset({ ...editingAsset, subtitle: e.target.value })}
                    placeholder="Ex: 3 templates editáveis sem fotos nem dados pessoais prontos para recrutadores."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
              </div>

              {/* Category, Format & Size */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Categoria</label>
                  <select
                    value={editingAsset.category}
                    onChange={(e) =>
                      setEditingAsset({
                        ...editingAsset,
                        category: e.target.value as DigitalAsset['category'],
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  >
                    <option value="ebook">E-book / Livro Digital</option>
                    <option value="template">Modelo / Template CV</option>
                    <option value="spreadsheet">Planilha Automatizada</option>
                    <option value="checklist">Checklist / Passo a Passo</option>
                    <option value="guide">Guia Prático / Manual</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Formato do Arquivo</label>
                  <input
                    type="text"
                    value={editingAsset.fileFormat}
                    onChange={(e) => setEditingAsset({ ...editingAsset, fileFormat: e.target.value })}
                    placeholder="Ex: PDF, XLSX, DOCX, ZIP"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tamanho do Arquivo</label>
                  <input
                    type="text"
                    value={editingAsset.fileSize}
                    onChange={(e) => setEditingAsset({ ...editingAsset, fileSize: e.target.value })}
                    placeholder="Ex: 2.4 MB, 14.2 MB"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
              </div>

              {/* Pricing (conditional) & Counts */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Páginas / Itens</label>
                  <input
                    type="text"
                    value={editingAsset.pageOrItemCount || ''}
                    onChange={(e) =>
                      setEditingAsset({ ...editingAsset, pageOrItemCount: e.target.value })
                    }
                    placeholder="Ex: 140 páginas, 6 abas, 25 itens"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Preço Promocional ($CAD) {editingAsset.accessType === 'free' && '(Grátis = 0)'}
                  </label>
                  <input
                    type="number"
                    step="0.50"
                    disabled={editingAsset.accessType === 'free'}
                    value={editingAsset.promotionalPriceCad}
                    onChange={(e) =>
                      setEditingAsset({
                        ...editingAsset,
                        promotionalPriceCad: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold disabled:opacity-40"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Preço Regular ($CAD)
                  </label>
                  <input
                    type="number"
                    step="0.50"
                    disabled={editingAsset.accessType === 'free'}
                    value={editingAsset.regularPriceCad}
                    onChange={(e) =>
                      setEditingAsset({
                        ...editingAsset,
                        regularPriceCad: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white disabled:opacity-40"
                  />
                </div>
              </div>

              {/* Download URL */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Link / URL do Arquivo para Download *
                </label>
                <input
                  type="text"
                  required
                  value={editingAsset.downloadUrl}
                  onChange={(e) => setEditingAsset({ ...editingAsset, downloadUrl: e.target.value })}
                  placeholder="https://paienet.qc.ca/downloads/seu-arquivo.pdf"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-[11px]"
                />
              </div>

              {/* Badge & Color */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-semibold mb-1">Badge em Destaque</label>
                  <input
                    type="text"
                    value={editingAsset.badge || ''}
                    onChange={(e) => setEditingAsset({ ...editingAsset, badge: e.target.value })}
                    placeholder="Ex: 100% Gratuito, Bestseller 2026, Otimização Fiscal"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Cor do Badge</label>
                  <select
                    value={editingAsset.badgeColor || 'emerald'}
                    onChange={(e) =>
                      setEditingAsset({
                        ...editingAsset,
                        badgeColor: e.target.value as DigitalAsset['badgeColor'],
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  >
                    <option value="emerald">Verde (Emerald - Gratuito)</option>
                    <option value="amber">Âmbar (Amber - Bestseller)</option>
                    <option value="blue">Azul (Blue - Fiscal)</option>
                    <option value="indigo">Índigo (Indigo - Checklist)</option>
                    <option value="purple">Roxo (Purple - RH/Carreira)</option>
                    <option value="rose">Rosa (Rose - Especial)</option>
                  </select>
                </div>
              </div>

              {/* Highlights Bullets */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Pontos Fortes / O que o Material Inclui:
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newHighlightText}
                    onChange={(e) => setNewHighlightText(e.target.value)}
                    placeholder="Ex: 'Estrutura testada e aprovada em softwares de triagem ATS'"
                    className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddHighlight();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddHighlight}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl cursor-pointer"
                  >
                    Adicionar
                  </button>
                </div>

                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                  {(editingAsset.highlights || []).map((hl, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-2 p-2 bg-slate-950 rounded-xl border border-slate-850 text-slate-300 text-[11px]"
                    >
                      <span className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>{hl}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveHighlight(idx)}
                        className="text-slate-500 hover:text-rose-400 p-0.5 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status & Featured */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-semibold">
                  <input
                    type="checkbox"
                    checked={editingAsset.featured || false}
                    onChange={(e) =>
                      setEditingAsset({ ...editingAsset, featured: e.target.checked })
                    }
                    className="rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0"
                  />
                  <span>Marcar como Produto Destaque da Loja</span>
                </label>

                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-medium">Status:</span>
                  <select
                    value={editingAsset.salesStatus}
                    onChange={(e) =>
                      setEditingAsset({
                        ...editingAsset,
                        salesStatus: e.target.value as DigitalAsset['salesStatus'],
                      })
                    }
                    className="px-2.5 py-1 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
                  >
                    <option value="active">Ativo (Visível na Loja)</option>
                    <option value="paused">Pausado (Oculto)</option>
                    <option value="draft">Rascunho</option>
                  </select>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsAssetModalOpen(false);
                    setEditingAsset(null);
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-blue-600/30 cursor-pointer active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>{isNewAsset ? 'Cadastrar e Publicar Material' : 'Salvar Alterações'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 8. MODAL: MANUAL SALE REGISTRATION */}
      {/* ==================================================== */}
      {isManualSaleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-extrabold text-sm text-white">Registrar Venda / Liberação Manual</h3>
              <button
                type="button"
                onClick={() => setIsManualSaleOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordManualSale} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Selecione o Material Digital</label>
                <select
                  value={manualSaleAssetId}
                  onChange={(e) => {
                    setManualSaleAssetId(e.target.value);
                    const selected = digitalAssets.find((a) => a.id === e.target.value);
                    if (selected && selected.accessType === 'paid') {
                      setManualSaleAmount(selected.promotionalPriceCad);
                    }
                  }}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                >
                  {digitalAssets.map((asset) => (
                    <option key={asset.id} value={asset.id}>
                      {asset.title} ({asset.accessType === 'free' ? 'Gratuito' : `$${asset.promotionalPriceCad} CAD`})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">E-mail do Cliente *</label>
                <input
                  type="email"
                  required
                  value={manualSaleEmail}
                  onChange={(e) => setManualSaleEmail(e.target.value)}
                  placeholder="cliente@exemplo.com"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Valor Cobrado ($CAD)</label>
                <input
                  type="number"
                  step="0.50"
                  value={manualSaleAmount}
                  onChange={(e) => setManualSaleAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsManualSaleOpen(false)}
                  className="px-3.5 py-2 bg-slate-800 text-slate-300 rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl cursor-pointer"
                >
                  Confirmar Registro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 9. MODAL: CREATE NEW COUPON */}
      {/* ==================================================== */}
      {isNewCouponOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-extrabold text-sm text-white">Criar Novo Cupom de Desconto</h3>
              <button
                type="button"
                onClick={() => setIsNewCouponOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Código do Cupom *</label>
                <input
                  type="text"
                  required
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                  placeholder="EX: QUEBEC2026, VIP10, SUPER5"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono uppercase"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Tipo de Desconto</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewCouponType('percent')}
                    className={`py-2 px-3 rounded-xl border text-center font-bold cursor-pointer ${
                      newCouponType === 'percent'
                        ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    Porcentagem (%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewCouponType('fixed')}
                    className={`py-2 px-3 rounded-xl border text-center font-bold cursor-pointer ${
                      newCouponType === 'fixed'
                        ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    Valor Fixo ($CAD)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {newCouponType === 'percent' ? 'Desconto em Porcentagem (%)' : 'Desconto em Dólares ($CAD)'}
                </label>
                <input
                  type="number"
                  step={newCouponType === 'percent' ? '1' : '0.50'}
                  required
                  value={newCouponDiscount}
                  onChange={(e) => setNewCouponDiscount(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsNewCouponOpen(false)}
                  className="px-3.5 py-2 bg-slate-800 text-slate-300 rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl cursor-pointer"
                >
                  Criar Cupom
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
