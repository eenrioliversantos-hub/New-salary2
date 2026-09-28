'use client';

import React, { useState, useMemo, useSyncExternalStore } from 'react';
import {
  adminStore,
  DigitalAsset,
  EbookConfig,
  EbookCoupon,
  EbookOrder,
} from '@/lib/admin-store';
import { triggerBrowserAssetDownload } from '@/lib/asset-downloader';
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
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Download,
  Copy,
  Tag,
  DollarSign,
  TrendingUp,
  Users,
  Search,
  CheckCircle2,
  Play,
  Pause,
  Sparkles,
  FileSpreadsheet,
  FileText,
  CheckSquare,
  Package,
  ShoppingCart,
  Filter,
  CreditCard,
  RotateCcw,
  Check,
  X,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface AdminEbookHubProps {
  showToast: (msg: string) => void;
}

type SubTab = 'dashboard' | 'assets' | 'orders' | 'coupons' | 'settings';

export const AdminEbookHub: React.FC<AdminEbookHubProps> = ({ showToast }) => {
  // Sync with AdminStore
  const digitalAssets = useSyncExternalStore(
    (cb) => adminStore.subscribe(cb),
    () => adminStore.getDigitalAssets(),
    () => adminStore.getInitialDigitalAssets()
  );

  const ebookConfig = useSyncExternalStore(
    (cb) => adminStore.subscribe(cb),
    () => adminStore.getEbookConfig(),
    () => adminStore.getInitialEbookConfig()
  );

  const ebookOrders = useSyncExternalStore(
    (cb) => adminStore.subscribe(cb),
    () => adminStore.getEbookOrders(),
    () => adminStore.getInitialEbookOrders()
  );

  const coupons = useSyncExternalStore(
    (cb) => adminStore.subscribe(cb),
    () => adminStore.getCoupons(),
    () => adminStore.getInitialEbookConfig().coupons || []
  );

  // Sub-Navigation State
  const [subTab, setSubTab] = useState<SubTab>('dashboard');

  // Asset Filters & Search
  const [assetSearch, setAssetSearch] = useState('');
  const [assetCategoryFilter, setAssetCategoryFilter] = useState<string>('all');
  const [assetAccessFilter, setAssetAccessFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [assetSortBy, setAssetSortBy] = useState<'downloads' | 'revenue' | 'title' | 'recent'>('downloads');

  // Asset CRUD Modal State
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [isNewAsset, setIsNewAsset] = useState(false);
  const [editingAsset, setEditingAsset] = useState<DigitalAsset | null>(null);

  // Manual Order Modal State
  const [isManualOrderModalOpen, setIsManualOrderModalOpen] = useState(false);
  const [manualOrderAssetId, setManualOrderAssetId] = useState<string>('');
  const [manualOrderEmail, setManualOrderEmail] = useState('');
  const [manualOrderAmount, setManualOrderAmount] = useState<number>(9.99);
  const [manualOrderCoupon, setManualOrderCoupon] = useState('');

  // Orders Search & Filter
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | 'delivered' | 'completed' | 'refunded'>('all');

  // Coupon Modal State
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponTypeInput, setCouponTypeInput] = useState<'percent' | 'fixed'>('percent');
  const [couponValueInput, setCouponValueInput] = useState<number>(10);

  // Calculations & Analytics KPIs
  const kpis = useMemo(() => {
    const totalSalesRevenue = digitalAssets.reduce((sum, a) => sum + (a.totalRevenueCad || 0), 0);
    const totalSalesCount = digitalAssets.reduce((sum, a) => sum + (a.totalSales || 0), 0);
    const totalFreeDownloads = digitalAssets
      .filter((a) => a.accessType === 'free')
      .reduce((sum, a) => sum + (a.totalDownloads || 0), 0);
    const totalAllDownloads = digitalAssets.reduce((sum, a) => sum + (a.totalDownloads || 0), 0);
    const activeAssetsCount = digitalAssets.filter((a) => a.salesStatus === 'active').length;
    const avgTicket = totalSalesCount > 0 ? totalSalesRevenue / totalSalesCount : 0;
    const conversionRate = totalAllDownloads > 0 ? (totalSalesCount / totalAllDownloads) * 100 : 0;

    return {
      totalSalesRevenue: Number(totalSalesRevenue.toFixed(2)),
      totalSalesCount,
      totalFreeDownloads,
      totalAllDownloads,
      activeAssetsCount,
      avgTicket: Number(avgTicket.toFixed(2)),
      conversionRate: Number(conversionRate.toFixed(1)),
    };
  }, [digitalAssets]);

  // Chart data for sales & downloads
  const chartData = useMemo(() => {
    return [
      { date: '19/09', vendasCad: 49.95, downloads: 38 },
      { date: '20/09', vendasCad: 79.92, downloads: 54 },
      { date: '21/09', vendasCad: 89.91, downloads: 62 },
      { date: '22/09', vendasCad: 119.88, downloads: 79 },
      { date: '23/09', vendasCad: 149.85, downloads: 91 },
      { date: '24/09', vendasCad: 189.81, downloads: 114 },
      { date: 'Hoje', vendasCad: 199.80, downloads: 128 },
    ];
  }, []);

  // Filtered & Sorted Assets
  const filteredAssets = useMemo(() => {
    return digitalAssets
      .filter((a) => {
        const matchesSearch =
          a.title.toLowerCase().includes(assetSearch.toLowerCase()) ||
          a.subtitle.toLowerCase().includes(assetSearch.toLowerCase()) ||
          (a.highlights || []).some((t) => t.toLowerCase().includes(assetSearch.toLowerCase())) ||
          (a.tags || []).some((t) => t.toLowerCase().includes(assetSearch.toLowerCase()));

        const matchesCategory = assetCategoryFilter === 'all' || a.category === assetCategoryFilter;
        const matchesAccess = assetAccessFilter === 'all' || a.accessType === assetAccessFilter;

        return matchesSearch && matchesCategory && matchesAccess;
      })
      .sort((a, b) => {
        if (assetSortBy === 'downloads') return (b.totalDownloads || 0) - (a.totalDownloads || 0);
        if (assetSortBy === 'revenue') return (b.totalRevenueCad || 0) - (a.totalRevenueCad || 0);
        if (assetSortBy === 'title') return a.title.localeCompare(b.title);
        return (b.createdAt || '').localeCompare(a.createdAt || '');
      });
  }, [digitalAssets, assetSearch, assetCategoryFilter, assetAccessFilter, assetSortBy]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return ebookOrders.filter((order) => {
      const matchesSearch =
        order.customerEmail.toLowerCase().includes(orderSearch.toLowerCase()) ||
        order.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
        (order.assetTitle || '').toLowerCase().includes(orderSearch.toLowerCase());

      const matchesStatus = orderStatusFilter === 'all' || order.status === orderStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [ebookOrders, orderSearch, orderStatusFilter]);

  // --- CRUD ACTION HANDLERS ---
  const handleOpenNewAsset = () => {
    const newId = `asset-${Date.now().toString().slice(-6)}`;
    setEditingAsset({
      id: newId,
      title: '',
      subtitle: '',
      description: '',
      category: 'ebook',
      categoryLabel: 'E-book Digital',
      fileType: 'PDF',
      fileSize: 'PDF (2.5 MB)',
      accessType: 'paid',
      regularPriceCad: 19.99,
      promotionalPriceCad: 9.99,
      salesStatus: 'active',
      downloadUrl: `https://paienet.qc.ca/downloads/${newId}.pdf`,
      totalDownloads: 0,
      totalSalesCount: 0,
      totalRevenueCad: 0,
      coverGradient: 'blue',
      badgeText: 'Novo Lançamento',
      featured: false,
      version: '2026.1',
      tags: ['Québec', 'Salário'],
      contentSnippet: '',
    });
    setIsNewAsset(true);
    setIsAssetModalOpen(true);
  };

  const handleEditAsset = (asset: DigitalAsset) => {
    setEditingAsset(JSON.parse(JSON.stringify(asset)));
    setIsNewAsset(false);
    setIsAssetModalOpen(true);
  };

  const handleSaveAsset = () => {
    if (!editingAsset) return;
    if (!editingAsset.title.trim()) {
      showToast('⚠️ Por favor, informe o título do material.');
      return;
    }

    // Set category label automatically if empty
    let catLabel = editingAsset.categoryLabel;
    if (!catLabel) {
      if (editingAsset.category === 'planilha') catLabel = 'Planilha Excel';
      else if (editingAsset.category === 'modelo_cv') catLabel = 'Modelo de CV';
      else if (editingAsset.category === 'guia_pdf') catLabel = 'Guia Prático PDF';
      else if (editingAsset.category === 'checklist') catLabel = 'Checklist';
      else catLabel = 'E-book Oficial';
    }

    const payload: DigitalAsset = {
      ...editingAsset,
      categoryLabel: catLabel,
      promotionalPriceCad: editingAsset.accessType === 'free' ? 0 : editingAsset.promotionalPriceCad,
      regularPriceCad: editingAsset.accessType === 'free' ? 0 : editingAsset.regularPriceCad,
    };

    adminStore.saveDigitalAsset(payload);
    showToast(isNewAsset ? '🎉 Novo ativo digital criado com sucesso!' : `✓ Ativo "${payload.title}" atualizado!`);
    setIsAssetModalOpen(false);
    setEditingAsset(null);
  };

  const handleDuplicateAsset = (asset: DigitalAsset) => {
    const copy = adminStore.duplicateDigitalAsset(asset.id);
    if (copy) {
      showToast(`📋 Cópia "${copy.title}" gerada com sucesso!`);
    }
  };

  const handleToggleAssetStatus = (asset: DigitalAsset) => {
    const isNowActive = adminStore.toggleDigitalAssetStatus(asset.id);
    showToast(isNowActive ? `🟢 Ativo "${asset.title}" ativado e visível!` : `⏸️ Ativo "${asset.title}" pausado.`);
  };

  const handleDeleteAsset = (asset: DigitalAsset) => {
    if (window.confirm(`Tem certeza de que deseja excluir permanentemente o material "${asset.title}"?`)) {
      adminStore.deleteDigitalAsset(asset.id);
      showToast(`🗑️ Material "${asset.title}" excluído do catálogo.`);
    }
  };

  const handleTestDownload = (asset: DigitalAsset) => {
    adminStore.recordAssetDownload(asset.id, 'admin.tester@paienet.qc.ca');
    const result = triggerBrowserAssetDownload(asset);
    if (result.success) {
      showToast(`📥 Download disparado com sucesso! Arquivo: ${result.filename}`);
    } else {
      showToast('⚠️ Erro ao disparar download no navegador.');
    }
  };

  // --- MANUAL ORDER HANDLERS ---
  const handleOpenManualOrder = () => {
    const defaultAsset = digitalAssets.find((a) => a.accessType === 'paid') || digitalAssets[0];
    setManualOrderAssetId(defaultAsset?.id || '');
    setManualOrderAmount(defaultAsset?.promotionalPriceCad || 9.99);
    setManualOrderEmail('');
    setManualOrderCoupon('');
    setIsManualOrderModalOpen(true);
  };

  const handleSaveManualOrder = () => {
    if (!manualOrderEmail || !manualOrderEmail.includes('@')) {
      showToast('⚠️ Informe um e-mail válido para o cliente.');
      return;
    }

    const selectedAsset = digitalAssets.find((a) => a.id === manualOrderAssetId);

    adminStore.recordAssetSale({
      customerEmail: manualOrderEmail.trim(),
      amountCad: manualOrderAmount,
      couponUsed: manualOrderCoupon.trim().toUpperCase() || undefined,
      status: 'delivered',
      downloadAccessCount: 1,
      assetId: selectedAsset?.id,
      assetTitle: selectedAsset?.title || 'E-book Oficial',
    });

    showToast(`✓ Venda de $${manualOrderAmount.toFixed(2)} CAD registrada para ${manualOrderEmail}!`);
    setIsManualOrderModalOpen(false);
  };

  const handleToggleOrderStatus = (order: EbookOrder) => {
    const nextStatus = order.status === 'delivered' ? 'refunded' : 'delivered';
    adminStore.updateEbookOrder(order.id, { status: nextStatus });
    showToast(`Status do pedido ${order.id} alterado para "${nextStatus}".`);
  };

  const handleDeleteOrder = (orderId: string) => {
    if (window.confirm(`Excluir registro do pedido ${orderId}?`)) {
      adminStore.deleteEbookOrder(orderId);
      showToast(`Pedido ${orderId} removido do histórico.`);
    }
  };

  // --- COUPON HANDLERS ---
  const handleSaveCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCodeInput.trim().toUpperCase();
    if (!code) {
      showToast('⚠️ Informe o código do cupom.');
      return;
    }

    const newCoupon: EbookCoupon = {
      code,
      discountPercent: couponTypeInput === 'percent' ? couponValueInput : undefined,
      discountFixedCad: couponTypeInput === 'fixed' ? couponValueInput : undefined,
      active: true,
      usesCount: 0,
    };

    adminStore.saveCoupon(newCoupon);
    showToast(`🎉 Cupom "${code}" salvo com sucesso!`);
    setCouponCodeInput('');
    setIsCouponModalOpen(false);
  };

  const handleToggleCoupon = (code: string) => {
    adminStore.toggleCoupon(code);
    showToast(`Status do cupom "${code}" alternado.`);
  };

  const handleDeleteCoupon = (code: string) => {
    if (window.confirm(`Excluir cupom "${code}"?`)) {
      adminStore.deleteCoupon(code);
      showToast(`Cupom "${code}" removido.`);
    }
  };

  const exportSalesCsv = () => {
    const header = 'ID_Pedido,Cliente_Email,Produto,Data,Valor_CAD,Cupom,Status\n';
    const rows = ebookOrders
      .map(
        (o) =>
          `"${o.id}","${o.customerEmail}","${o.assetTitle || 'E-book'}","${o.date}","${o.amountCad.toFixed(2)}","${o.couponUsed || ''}","${o.status}"`
      )
      .join('\n');

    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `[PaieNet.qc]_Relatorio_Vendas_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('📊 Relatório de vendas exportado em CSV!');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Sub-Navigation */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-950/90 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-bold border border-amber-500/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Infoprodutos & Hub de Ativos Digitais</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Central de E-books, Ativos Digitais & Vendas
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Monitore faturamento em tempo real, gerencie catálogo de e-books e materiais gratuitos, execute CRUDs completos e controle licenças de download.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleOpenNewAsset}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Material / E-book</span>
            </button>

            <button
              type="button"
              onClick={handleOpenManualOrder}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Registrar Venda</span>
            </button>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-1.5 pt-3 border-t border-slate-800 overflow-x-auto text-xs font-semibold">
          <button
            type="button"
            onClick={() => setSubTab('dashboard')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              subTab === 'dashboard'
                ? 'bg-blue-600 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Dashboard & Métricas</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('assets')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              subTab === 'assets'
                ? 'bg-blue-600 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Central de Ativos Digitais ({digitalAssets.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('orders')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              subTab === 'orders'
                ? 'bg-blue-600 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Pedidos & Licenças ({ebookOrders.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('coupons')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              subTab === 'coupons'
                ? 'bg-blue-600 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Cupons de Desconto ({coupons.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('settings')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              subTab === 'settings'
                ? 'bg-blue-600 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Configurações do E-book Flagship</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SUB-TAB 1: DASHBOARD & MÉTRICAS DE VENDAS */}
      {/* ======================================================== */}
      {subTab === 'dashboard' && (
        <div className="space-y-6">
          {/* KPI Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                <span>Faturamento Total</span>
              </span>
              <div className="text-xl sm:text-2xl font-black text-emerald-400 tabular-nums">
                ${kpis.totalSalesRevenue.toFixed(2)}
              </div>
              <span className="text-[10px] text-slate-500 block">Dólares Canadenses (CAD)</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <ShoppingCart className="w-3.5 h-3.5 text-blue-400" />
                <span>Vendas Pagas</span>
              </span>
              <div className="text-xl sm:text-2xl font-black text-white tabular-nums">
                {kpis.totalSalesCount}
              </div>
              <span className="text-[10px] text-slate-500 block">Pedidos Concluídos</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Downloads Grátis</span>
              </span>
              <div className="text-xl sm:text-2xl font-black text-cyan-300 tabular-nums">
                {kpis.totalFreeDownloads}
              </div>
              <span className="text-[10px] text-slate-500 block">Leads Qualificados</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                <span>Ticket Médio</span>
              </span>
              <div className="text-xl sm:text-2xl font-black text-amber-300 tabular-nums">
                ${kpis.avgTicket.toFixed(2)}
              </div>
              <span className="text-[10px] text-slate-500 block">Por Compra Realizada</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
                <span>Conversão</span>
              </span>
              <div className="text-xl sm:text-2xl font-black text-purple-300 tabular-nums">
                {kpis.conversionRate}%
              </div>
              <span className="text-[10px] text-slate-500 block">Visitantes x Venda</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Package className="w-3.5 h-3.5 text-blue-400" />
                <span>Materiais Ativos</span>
              </span>
              <div className="text-xl sm:text-2xl font-black text-white tabular-nums">
                {kpis.activeAssetsCount} / {digitalAssets.length}
              </div>
              <span className="text-[10px] text-slate-500 block">Disponíveis no Ar</span>
            </div>
          </div>

          {/* Revenue & Downloads Visual Chart */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-950/80 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-extrabold text-white">Curva de Faturamento & Downloads (Últimos 7 Dias)</h3>
                <p className="text-xs text-slate-400">
                  Desempenho combinado das vendas de produtos digitais e captação de leads com materiais gratuitos.
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span>Receita ($ CAD)</span>
                </div>
                <div className="flex items-center gap-1.5 text-blue-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  <span>Downloads</span>
                </div>
                <button
                  type="button"
                  onClick={exportSalesCsv}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Exportar CSV</span>
                </button>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="downloadsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="vendasCad" name="Vendas ($ CAD)" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#revenueGrad)" />
                  <Area type="monotone" dataKey="downloads" name="Downloads" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#downloadsGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Assets Performance Ranking */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-950/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-white">Ranking de Ativos Mais Populares & Lucrativos</h3>
                <p className="text-xs text-slate-400">Classificação por downloads e receita gerada no portal.</p>
              </div>

              <button
                type="button"
                onClick={() => setSubTab('assets')}
                className="text-xs text-blue-400 hover:text-blue-300 font-bold inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Ver Catálogo Completo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800 text-[10px]">
                  <tr>
                    <th className="p-3">Material / Infoproduto</th>
                    <th className="p-3">Tipo de Acesso</th>
                    <th className="p-3">Formato / Tamanho</th>
                    <th className="p-3 text-center">Downloads</th>
                    <th className="p-3 text-center">Vendas</th>
                    <th className="p-3 text-right">Receita Total</th>
                    <th className="p-3 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {digitalAssets.slice(0, 5).map((asset) => (
                    <tr key={asset.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-3">
                        <div className="space-y-0.5">
                          <div className="font-bold text-white text-xs sm:text-sm">{asset.title}</div>
                          <div className="text-[10px] text-slate-400 line-clamp-1">{asset.subtitle}</div>
                        </div>
                      </td>
                      <td className="p-3">
                        {asset.accessType === 'free' ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                            100% Gratuito
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px]">
                            Pago (${asset.promotionalPriceCad.toFixed(2)} CAD)
                          </span>
                        )}
                      </td>
                      <td className="p-3 font-mono text-[11px] text-slate-400">
                        {asset.fileSize}
                      </td>
                      <td className="p-3 text-center font-mono font-bold text-cyan-400">
                        {asset.totalDownloads.toLocaleString()}
                      </td>
                      <td className="p-3 text-center font-mono font-bold text-white">
                        {asset.totalSalesCount}
                      </td>
                      <td className="p-3 text-right font-mono font-black text-emerald-400 text-xs">
                        ${asset.totalRevenueCad.toFixed(2)} CAD
                      </td>
                      <td className="p-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleTestDownload(asset)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
                          title="Baixar / Testar arquivo"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 2: CENTRAL DE ATIVOS DIGITAIS (CRUD COMPLETO) */}
      {/* ======================================================== */}
      {subTab === 'assets' && (
        <div className="space-y-5">
          {/* Filters & Toolbar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={assetSearch}
                onChange={(e) => setAssetSearch(e.target.value)}
                placeholder="Buscar ativo por título, subtítulo ou tags..."
                className="w-full pl-10 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              {/* Access Type Filter */}
              <select
                value={assetAccessFilter}
                onChange={(e) => setAssetAccessFilter(e.target.value as 'all' | 'free' | 'paid')}
                className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium focus:outline-none"
              >
                <option value="all">Todos os Tipos de Acesso</option>
                <option value="free">Apenas Gratuitos (Lead Magnet)</option>
                <option value="paid">Apenas Pagos (Infoprodutos)</option>
              </select>

              {/* Category Filter */}
              <select
                value={assetCategoryFilter}
                onChange={(e) => setAssetCategoryFilter(e.target.value)}
                className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium focus:outline-none"
              >
                <option value="all">Todas as Categorias</option>
                <option value="ebook">E-books Oficiais</option>
                <option value="planilha">Planilhas Excel</option>
                <option value="modelo_cv">Modelos de Currículo ATS</option>
                <option value="guia_pdf">Guias CNESST</option>
                <option value="checklist">Checklists</option>
                <option value="audio_kit">Kits & Áudios</option>
              </select>

              {/* Sort By */}
              <select
                value={assetSortBy}
                onChange={(e) => setAssetSortBy(e.target.value as 'downloads' | 'revenue' | 'title' | 'recent')}
                className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium focus:outline-none"
              >
                <option value="downloads">Ordenar por Mais Baixados</option>
                <option value="revenue">Ordenar por Maior Receita</option>
                <option value="title">Ordenar por Nome (A-Z)</option>
                <option value="recent">Ordenar por Mais Recentes</option>
              </select>

              <button
                type="button"
                onClick={handleOpenNewAsset}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all cursor-pointer shadow-md shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Novo Material</span>
              </button>
            </div>
          </div>

          {/* Assets Grid View */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAssets.map((asset) => {
              const isFree = asset.accessType === 'free';
              const isActive = asset.salesStatus === 'active';

              return (
                <div
                  key={asset.id}
                  className="rounded-3xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all p-5 flex flex-col justify-between space-y-4 shadow-lg group"
                >
                  <div className="space-y-3">
                    {/* Header Badges & Status Switch */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                            isFree
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {isFree ? '100% Gratuito' : `$${asset.promotionalPriceCad.toFixed(2)} CAD`}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded-lg border border-slate-800">
                          {asset.fileType}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleAssetStatus(asset)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer border ${
                          isActive
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                        }`}
                        title={isActive ? 'Clique para pausar este ativo' : 'Clique para ativar este ativo'}
                      >
                        {isActive ? <Play className="w-2.5 h-2.5" /> : <Pause className="w-2.5 h-2.5" />}
                        <span>{isActive ? 'Ativo' : 'Pausado'}</span>
                      </button>
                    </div>

                    {/* Title and Category */}
                    <div>
                      <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wide block">
                        {asset.categoryLabel} • {asset.version || '2026'}
                      </span>
                      <h4 className="font-extrabold text-white text-base leading-snug group-hover:text-blue-300 transition-colors mt-0.5">
                        {asset.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {asset.subtitle || asset.description}
                      </p>
                    </div>

                    {/* File Size & Content Snippet */}
                    <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800/80 text-[11px] text-slate-300 space-y-1">
                      <div className="flex justify-between text-slate-400 text-[10px]">
                        <span>Tamanho / Páginas:</span>
                        <strong className="text-slate-200 font-mono">{asset.fileSize}</strong>
                      </div>
                      {asset.contentSnippet && (
                        <p className="text-[10px] text-slate-400 line-clamp-2 border-t border-slate-800 pt-1">
                          {asset.contentSnippet}
                        </p>
                      )}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {(asset.tags || []).map((tag) => (
                        <span key={tag} className="text-[9px] font-mono text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Metrics Bar & CRUD Action Buttons */}
                  <div className="pt-3 border-t border-slate-800 space-y-3">
                    <div className="grid grid-cols-3 gap-1 text-center bg-slate-900/60 p-2 rounded-xl text-[10px] text-slate-400">
                      <div>
                        <span className="block text-slate-500">Downloads</span>
                        <strong className="text-white font-mono text-xs">{asset.totalDownloads}</strong>
                      </div>
                      <div>
                        <span className="block text-slate-500">Vendas</span>
                        <strong className="text-white font-mono text-xs">{asset.totalSalesCount}</strong>
                      </div>
                      <div>
                        <span className="block text-slate-500">Receita</span>
                        <strong className="text-emerald-400 font-mono text-xs">
                          ${asset.totalRevenueCad.toFixed(0)}
                        </strong>
                      </div>
                    </div>

                    {/* Action Buttons Toolbar */}
                    <div className="flex items-center justify-between gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleTestDownload(asset)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
                        title="Baixar arquivo real no seu computador para teste"
                      >
                        <Download className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Testar</span>
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleEditAsset(asset)}
                          className="p-1.5 rounded-xl bg-slate-800 hover:bg-blue-600/30 text-slate-300 hover:text-blue-300 border border-slate-700 transition-colors cursor-pointer"
                          title="Editar informações do material"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDuplicateAsset(asset)}
                          className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
                          title="Duplicar material"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteAsset(asset)}
                          className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors cursor-pointer"
                          title="Excluir este material permanentemente"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 3: PEDIDOS, LICENÇAS & VENDAS */}
      {/* ======================================================== */}
      {subTab === 'orders' && (
        <div className="space-y-5">
          {/* Order Filters & Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="Buscar pedido por e-mail, ID ou produto..."
                className="w-full pl-10 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value as 'all' | 'delivered' | 'completed' | 'refunded')}
                className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium focus:outline-none"
              >
                <option value="all">Todos os Status</option>
                <option value="delivered">Entregue (Delivered)</option>
                <option value="completed">Concluído</option>
                <option value="refunded">Reembolsado</option>
              </select>

              <button
                type="button"
                onClick={handleOpenManualOrder}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all cursor-pointer shadow-md shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Registrar Venda Manual</span>
              </button>

              <button
                type="button"
                onClick={exportSalesCsv}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all cursor-pointer border border-slate-700 shrink-0"
              >
                <Download className="w-3.5 h-3.5 text-blue-400" />
                <span>CSV</span>
              </button>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-slate-950/80 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800 text-[10px]">
                  <tr>
                    <th className="p-3.5">ID do Pedido</th>
                    <th className="p-3.5">Cliente (E-mail)</th>
                    <th className="p-3.5">Produto / Material</th>
                    <th className="p-3.5">Data & Hora</th>
                    <th className="p-3.5">Valor ($ CAD)</th>
                    <th className="p-3.5">Cupom</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-500">
                        Nenhum pedido encontrado para o filtro atual.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="p-3.5 font-mono font-bold text-white text-xs">{order.id}</td>
                        <td className="p-3.5 text-slate-200 font-medium">{order.customerEmail}</td>
                        <td className="p-3.5 text-blue-300 font-semibold">{order.assetTitle || 'Guia Oficial Salário 2026'}</td>
                        <td className="p-3.5 text-slate-400 font-mono text-[11px]">{order.date}</td>
                        <td className="p-3.5 text-emerald-400 font-black font-mono text-xs">
                          ${order.amountCad.toFixed(2)} CAD
                        </td>
                        <td className="p-3.5 text-slate-400 font-mono">
                          {order.couponUsed ? (
                            <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 font-bold text-[10px]">
                              {order.couponUsed}
                            </span>
                          ) : (
                            '-'
                          )}
                        </td>
                        <td className="p-3.5">
                          <button
                            type="button"
                            onClick={() => handleToggleOrderStatus(order)}
                            className={`px-2 py-0.5 rounded-full font-bold text-[10px] transition-colors cursor-pointer border ${
                              order.status === 'delivered'
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                            }`}
                            title="Clique para alternar status entre Entregue e Reembolsado"
                          >
                            {order.status === 'delivered' ? '✓ Entregue' : 'Reembolsado'}
                          </button>
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                const targetAsset =
                                  digitalAssets.find((a) => a.id === order.assetId) || digitalAssets[0];
                                handleTestDownload(targetAsset);
                              }}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                              title="Baixar material deste pedido"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteOrder(order.id)}
                              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                              title="Excluir registro deste pedido"
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

      {/* ======================================================== */}
      {/* SUB-TAB 4: GERENCIADOR DE CUPONS */}
      {/* ======================================================== */}
      {subTab === 'coupons' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <div>
              <h3 className="text-sm font-extrabold text-white">Cupons de Desconto Promocionais</h3>
              <p className="text-xs text-slate-400">
                Crie códigos promocionais percentuais ou com desconto fixo em dólares canadenses.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsCouponModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all cursor-pointer shadow-md text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Criar Novo Cupom</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {coupons.map((coupon) => (
              <div
                key={coupon.code}
                className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 flex flex-col justify-between"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="text-lg font-black text-white font-mono tracking-wider">
                      {coupon.code}
                    </span>
                    <span className="text-xs text-emerald-400 font-bold block">
                      {coupon.discountPercent
                        ? `${coupon.discountPercent}% de Desconto`
                        : `$${(coupon.discountFixedCad || 0).toFixed(2)} CAD de Desconto`}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleCoupon(coupon.code)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                      coupon.active
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {coupon.active ? 'Ativo' : 'Pausado'}
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Usos registrados: <strong className="text-white font-mono">{coupon.usesCount}</strong></span>

                  <button
                    type="button"
                    onClick={() => handleDeleteCoupon(coupon.code)}
                    className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
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

      {/* ======================================================== */}
      {/* SUB-TAB 5: CONFIGURAÇÕES DO E-BOOK FLAGSHIP */}
      {/* ======================================================== */}
      {subTab === 'settings' && (
        <div className="p-5 sm:p-6 rounded-3xl bg-slate-950/80 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                Produto Digital Principal
              </span>
              <h3 className="text-base font-extrabold text-white mt-1">{ebookConfig.title}</h3>
              <p className="text-xs text-slate-400">{ebookConfig.subtitle}</p>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase block">Preço Promocional Atual</span>
              <span className="text-2xl font-black text-amber-400 tabular-nums">
                ${ebookConfig.promotionalPriceCad.toFixed(2)} CAD
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Preço Promocional ($ CAD)</label>
              <input
                type="number"
                step="0.50"
                value={ebookConfig.promotionalPriceCad}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 9.99;
                  adminStore.updateEbookConfig({ promotionalPriceCad: val });
                }}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-bold"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Status de Vendas</label>
              <select
                value={ebookConfig.salesStatus}
                onChange={(e) => {
                  adminStore.updateEbookConfig({
                    salesStatus: e.target.value as EbookConfig['salesStatus'],
                  });
                  showToast('Status da loja do e-book atualizado!');
                }}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
              >
                <option value="active">Vendas Ativas (Disponível)</option>
                <option value="paused">Vendas Pausadas</option>
                <option value="presale">Pré-Venda Promocional</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Link Direto de Download (PDF)</label>
              <input
                type="text"
                value={ebookConfig.downloadUrl}
                onChange={(e) => {
                  adminStore.updateEbookConfig({ downloadUrl: e.target.value });
                }}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono text-[11px]"
              />
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 1: CRIAR / EDITAR ATIVO DIGITAL (CRUD MODAL) */}
      {/* ======================================================== */}
      {isAssetModalOpen && editingAsset && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-5 my-8 text-xs text-slate-200 max-h-[92vh] overflow-y-auto shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                  {isNewAsset ? 'Novo Registro' : 'Edição de Material'}
                </span>
                <h3 className="font-black text-white text-lg sm:text-xl">
                  {isNewAsset ? 'Cadastrar Novo Material ou E-book Digital' : `Editar: ${editingAsset.title}`}
                </h3>
                <p className="text-slate-400 text-xs">
                  Preencha as informações do arquivo, modalidade de acesso (gratuito ou pago) e preço.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsAssetModalOpen(false);
                  setEditingAsset(null);
                }}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Row 1: Title and Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Título do Material *</label>
                  <input
                    type="text"
                    value={editingAsset.title}
                    onChange={(e) => setEditingAsset({ ...editingAsset, title: e.target.value })}
                    placeholder="Ex: Guia Completo de Impostos no Québec 2026"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Categoria *</label>
                  <select
                    value={editingAsset.category}
                    onChange={(e) =>
                      setEditingAsset({
                        ...editingAsset,
                        category: e.target.value as DigitalAsset['category'],
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none"
                  >
                    <option value="ebook">E-book Oficial</option>
                    <option value="planilha">Planilha Excel</option>
                    <option value="modelo_cv">Modelo de CV ATS</option>
                    <option value="guia_pdf">Guia Prático PDF</option>
                    <option value="checklist">Checklist</option>
                    <option value="audio_kit">Kit & Áudios</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Subtitle */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Subtítulo Resumido</label>
                <input
                  type="text"
                  value={editingAsset.subtitle}
                  onChange={(e) => setEditingAsset({ ...editingAsset, subtitle: e.target.value })}
                  placeholder="Ex: Simulações práticas, fórmulas e direitos trabalhistas essenciais."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none"
                />
              </div>

              {/* Row 3: Access Type, Price, Status */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3.5 bg-slate-950/90 rounded-2xl border border-slate-800">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Tipo de Acesso *</label>
                  <select
                    value={editingAsset.accessType}
                    onChange={(e) => {
                      const val = e.target.value as 'free' | 'paid';
                      setEditingAsset({
                        ...editingAsset,
                        accessType: val,
                        promotionalPriceCad: val === 'free' ? 0 : (editingAsset.promotionalPriceCad || 9.99),
                      });
                    }}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-bold"
                  >
                    <option value="free">100% Gratuito (Download Direto / Lead)</option>
                    <option value="paid">Pago (Checkout Comercial)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Preço Promo ($ CAD)</label>
                  <input
                    type="number"
                    step="0.50"
                    disabled={editingAsset.accessType === 'free'}
                    value={editingAsset.promotionalPriceCad}
                    onChange={(e) =>
                      setEditingAsset({ ...editingAsset, promotionalPriceCad: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-bold disabled:opacity-40"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Preço Normal ($ CAD)</label>
                  <input
                    type="number"
                    step="0.50"
                    disabled={editingAsset.accessType === 'free'}
                    value={editingAsset.regularPriceCad}
                    onChange={(e) =>
                      setEditingAsset({ ...editingAsset, regularPriceCad: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs disabled:opacity-40"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Status no Catálogo</label>
                  <select
                    value={editingAsset.salesStatus}
                    onChange={(e) =>
                      setEditingAsset({
                        ...editingAsset,
                        salesStatus: e.target.value as DigitalAsset['salesStatus'],
                      })
                    }
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                  >
                    <option value="active">Ativo (Visível para todos)</option>
                    <option value="paused">Pausado (Oculto no site)</option>
                    <option value="draft">Rascunho</option>
                  </select>
                </div>
              </div>

              {/* Row 4: File Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Formato do Arquivo *</label>
                  <select
                    value={editingAsset.fileType}
                    onChange={(e) =>
                      setEditingAsset({
                        ...editingAsset,
                        fileType: e.target.value as DigitalAsset['fileType'],
                      })
                    }
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs"
                  >
                    <option value="PDF">PDF (.pdf)</option>
                    <option value="XLSX">Excel (.xlsx)</option>
                    <option value="DOCX">Word (.docx)</option>
                    <option value="ZIP">Arquivo Compactado (.zip)</option>
                    <option value="EPUB">E-book (.epub)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Tamanho / Descritivo de Páginas</label>
                  <input
                    type="text"
                    value={editingAsset.fileSize}
                    onChange={(e) => setEditingAsset({ ...editingAsset, fileSize: e.target.value })}
                    placeholder="Ex: 140 páginas • PDF (8.4 MB)"
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Badge Promocional</label>
                  <input
                    type="text"
                    value={editingAsset.badgeText || ''}
                    onChange={(e) => setEditingAsset({ ...editingAsset, badgeText: e.target.value })}
                    placeholder="Ex: Mais Baixado, 100% Gratuito"
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs"
                  />
                </div>
              </div>

              {/* Row 5: Download URL */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  URL Direta do Arquivo de Download
                </label>
                <input
                  type="text"
                  value={editingAsset.downloadUrl}
                  onChange={(e) => setEditingAsset({ ...editingAsset, downloadUrl: e.target.value })}
                  placeholder="https://paienet.qc.ca/downloads/arquivo.pdf"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-mono"
                />
              </div>

              {/* Row 6: Detailed Description */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Descrição Comercial Completa</label>
                <textarea
                  rows={3}
                  value={editingAsset.description}
                  onChange={(e) => setEditingAsset({ ...editingAsset, description: e.target.value })}
                  placeholder="Explique detalhadamente o valor do material para o trabalhador ou imigrante..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none"
                />
              </div>

              {/* Row 7: Content Snippet / Sumário */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Sumário dos Módulos / Capítulos</label>
                <textarea
                  rows={2}
                  value={editingAsset.contentSnippet || ''}
                  onChange={(e) => setEditingAsset({ ...editingAsset, contentSnippet: e.target.value })}
                  placeholder="Ex: Cap. 1: Holerite • Cap. 2: RRQ & RQAP • Cap. 3: Horas Extras..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none"
                />
              </div>

              {/* Row 8: Tags */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Tags (separadas por vírgula)</label>
                <input
                  type="text"
                  value={(editingAsset.tags || []).join(', ')}
                  onChange={(e) =>
                    setEditingAsset({
                      ...editingAsset,
                      tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                    })
                  }
                  placeholder="Salário, Impostos, CNESST, Montreal"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs"
                />
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setIsAssetModalOpen(false);
                  setEditingAsset(null);
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleSaveAsset}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer"
              >
                Salvar Ativo Digital
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: REGISTRAR VENDA MANUAL */}
      {/* ======================================================== */}
      {isManualOrderModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 text-xs text-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-base">Registrar Nova Venda Manual</h3>
              <button
                type="button"
                onClick={() => setIsManualOrderModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1">Selecionar Material Adquirido *</label>
                <select
                  value={manualOrderAssetId}
                  onChange={(e) => {
                    setManualOrderAssetId(e.target.value);
                    const found = digitalAssets.find((a) => a.id === e.target.value);
                    if (found && found.promotionalPriceCad > 0) {
                      setManualOrderAmount(found.promotionalPriceCad);
                    }
                  }}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs"
                >
                  {digitalAssets.map((asset) => (
                    <option key={asset.id} value={asset.id}>
                      {asset.title} ({asset.accessType === 'free' ? 'Grátis' : `$${asset.promotionalPriceCad} CAD`})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">E-mail do Comprador / Aluno *</label>
                <input
                  type="email"
                  value={manualOrderEmail}
                  onChange={(e) => setManualOrderEmail(e.target.value)}
                  placeholder="comprador@gmail.com"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Valor Cobrado ($ CAD)</label>
                  <input
                    type="number"
                    step="0.50"
                    value={manualOrderAmount}
                    onChange={(e) => setManualOrderAmount(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-bold font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Cupom Utilizado</label>
                  <input
                    type="text"
                    value={manualOrderCoupon}
                    onChange={(e) => setManualOrderCoupon(e.target.value)}
                    placeholder="Opcional"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs uppercase font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsManualOrderModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleSaveManualOrder}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl cursor-pointer"
              >
                Confirmar Venda
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: CRIAR NOVO CUPOM */}
      {/* ======================================================== */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveCoupon}
            className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 text-xs text-slate-200 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-base">Novo Cupom Promocional</h3>
              <button
                type="button"
                onClick={() => setIsCouponModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1">Código do Cupom *</label>
                <input
                  type="text"
                  required
                  value={couponCodeInput}
                  onChange={(e) => setCouponCodeInput(e.target.value)}
                  placeholder="EX: PROMO20, VIPQUEBEC"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-mono uppercase font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Tipo de Desconto</label>
                <select
                  value={couponTypeInput}
                  onChange={(e) => setCouponTypeInput(e.target.value as 'percent' | 'fixed')}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs"
                >
                  <option value="percent">Porcentagem (%)</option>
                  <option value="fixed">Valor Fixo em CAD ($)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">
                  {couponTypeInput === 'percent' ? 'Porcentagem de Desconto (%)' : 'Valor do Desconto ($ CAD)'}
                </label>
                <input
                  type="number"
                  min="1"
                  max={couponTypeInput === 'percent' ? 100 : 1000}
                  required
                  value={couponValueInput}
                  onChange={(e) => setCouponValueInput(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-bold font-mono"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCouponModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl cursor-pointer"
              >
                Salvar Cupom
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
