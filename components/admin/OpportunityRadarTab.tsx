'use client';

import React, { useState, useMemo } from 'react';
import {
  adminStore,
  OpportunityRadarAlert,
  MonetizationProduct,
  MonetizationCategory,
} from '@/lib/admin-store';
import { AdminTab } from '@/components/admin/AdminSidebar';
import {
  Radar,
  AlertTriangle,
  TrendingUp,
  Target,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  ExternalLink,
  Sparkles,
  PieChart as PieChartIcon,
  Calculator,
  Sliders,
  ShieldAlert,
  HelpCircle,
  Building2,
  BookOpen,
  Link2,
  Megaphone,
  Plus,
  Edit2,
  Trash2,
  Copy,
  Check,
  X,
  Tag,
  Filter,
  Layers,
  Search,
  Download,
  FileDown,
  ShoppingBag,
  Zap,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from 'recharts';

interface OpportunityRadarTabProps {
  onNavigateTab: (tab: AdminTab) => void;
  onOpenCreateAd?: () => void;
}

export const OpportunityRadarTab: React.FC<OpportunityRadarTabProps> = ({
  onNavigateTab,
}) => {
  const [subTab, setSubTab] = useState<'radar' | 'catalog'>('radar');
  const [targetMonthlyGoalCad, setTargetMonthlyGoalCad] = useState<number>(5000);
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);

  // Catalog state
  const [catalogSearch, setCatalogSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<MonetizationProduct | null>(null);

  // Form state for creating/editing product
  const [prodName, setProdName] = useState('');
  const [prodTagline, setProdTagline] = useState('');
  const [prodDescription, setProdDescription] = useState('');
  const [prodCategory, setProdCategory] = useState<MonetizationCategory>('digital_download');
  const [prodPricingModel, setProdPricingModel] = useState<MonetizationProduct['pricingModel']>('fixed_one_time');
  const [prodPriceCad, setProdPriceCad] = useState<number>(9.99);
  const [prodPromoPriceCad, setProdPromoPriceCad] = useState<number | undefined>(undefined);
  const [prodBillingCycle, setProdBillingCycle] = useState('Download imediato');
  const [prodPlacement, setProdPlacement] = useState<MonetizationProduct['placementSiteArea']>('calculator_results');
  const [prodStatus, setProdStatus] = useState<MonetizationProduct['status']>('active');
  const [prodBadge, setProdBadge] = useState('');
  const [prodBadgeColor, setProdBadgeColor] = useState<MonetizationProduct['badgeColor']>('emerald');
  const [prodFeatures, setProdFeatures] = useState<string>('');

  // Real data from store
  const revSummary = adminStore.getRevenueSummary();
  const allAlerts = adminStore.getRadarAlerts();
  const careerPackages = adminStore.getCareerPackages();
  const articles = adminStore.getArticles();
  const affiliates = adminStore.getAffiliates();
  const adSlots = adminStore.getAdSlots();
  const b2bJobs = adminStore.getB2BJobs();
  const monetizationProducts = adminStore.getMonetizationProducts();

  // Active alerts filtered
  const activeAlerts = allAlerts.filter((a) => !dismissedAlerts.includes(a.id));

  // Revenue Mix Data for Chart
  const mixData = useMemo(() => {
    return [
      { name: 'Passaporte Carreira', value: revSummary.careerPassRev || 1800, color: '#10b981', pct: revSummary.percentages.careerPass },
      { name: 'Afiliados & Amazon', value: revSummary.affiliateRev || 1500, color: '#3b82f6', pct: revSummary.percentages.affiliates },
      { name: 'E-books & Guias', value: revSummary.ebookRev || 870, color: '#8b5cf6', pct: revSummary.percentages.ebooks },
      { name: 'Vagas B2B', value: revSummary.b2bRev || 850, color: '#f59e0b', pct: revSummary.percentages.b2b },
      { name: 'Anúncios & Mídia', value: revSummary.adRev || 420, color: '#ec4899', pct: revSummary.percentages.ads },
    ].filter((item) => item.value > 0);
  }, [revSummary]);

  // Financial Goal Simulator Mathematics
  const goalSimulation = useMemo(() => {
    const goal = Math.max(500, targetMonthlyGoalCad);
    const avgPassPrice = 59.0;
    const passTargetShare = 0.55;
    const affiliateTargetShare = 0.25;
    const b2bTargetShare = 0.15;

    const targetPassRev = goal * passTargetShare;
    const passesNeeded = Math.ceil(targetPassRev / avgPassPrice);

    const calcConversionRate = 0.028;
    const calculatorUsersNeeded = Math.ceil(passesNeeded / calcConversionRate);

    const targetAffiliateRev = goal * affiliateTargetShare;
    const affiliateConversionsNeeded = Math.ceil(targetAffiliateRev / 45);
    const affiliateClicksNeeded = Math.ceil(affiliateConversionsNeeded / 0.08);

    const targetB2bRev = goal * b2bTargetShare;
    const b2bPostingsNeeded = Math.ceil(targetB2bRev / 250);

    return {
      goal,
      passesNeeded,
      calculatorUsersNeeded,
      affiliateConversionsNeeded,
      affiliateClicksNeeded,
      b2bPostingsNeeded,
      dailyCalcsNeeded: Math.ceil(calculatorUsersNeeded / 30),
    };
  }, [targetMonthlyGoalCad]);

  const handleDismissAlert = (id: string) => {
    setDismissedAlerts((prev) => [...prev, id]);
  };

  const handleOpenCreateProduct = () => {
    setEditingProduct(null);
    setProdName('');
    setProdTagline('');
    setProdDescription('');
    setProdCategory('digital_download');
    setProdPricingModel('fixed_one_time');
    setProdPriceCad(9.0);
    setProdPromoPriceCad(undefined);
    setProdBillingCycle('Download imediato em PDF / Word');
    setProdPlacement('calculator_results');
    setProdStatus('active');
    setProdBadge('Novo');
    setProdBadgeColor('emerald');
    setProdFeatures('Entrega instantânea\nCompatível com padrão canadense\nSuporte por e-mail');
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: MonetizationProduct) => {
    setEditingProduct(prod);
    setProdName(prod.name);
    setProdTagline(prod.tagline || '');
    setProdDescription(prod.description || '');
    setProdCategory(prod.category);
    setProdPricingModel(prod.pricingModel);
    setProdPriceCad(prod.priceCad);
    setProdPromoPriceCad(prod.promotionalPriceCad);
    setProdBillingCycle(prod.billingCycleOrDuration || '');
    setProdPlacement(prod.placementSiteArea);
    setProdStatus(prod.status);
    setProdBadge(prod.badge || '');
    setProdBadgeColor(prod.badgeColor || 'emerald');
    setProdFeatures(prod.features ? prod.features.join('\n') : '');
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) return;

    const featuresList = prodFeatures
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    const productPayload: MonetizationProduct = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      name: prodName.trim(),
      tagline: prodTagline.trim(),
      description: prodDescription.trim(),
      category: prodCategory,
      pricingModel: prodPricingModel,
      priceCad: Number(prodPriceCad) || 0,
      promotionalPriceCad: prodPromoPriceCad ? Number(prodPromoPriceCad) : undefined,
      billingCycleOrDuration: prodBillingCycle.trim(),
      placementSiteArea: prodPlacement,
      status: prodStatus,
      totalSalesOrConversions: editingProduct ? editingProduct.totalSalesOrConversions : 0,
      totalRevenueCad: editingProduct ? editingProduct.totalRevenueCad : 0,
      badge: prodBadge.trim() || undefined,
      badgeColor: prodBadgeColor,
      features: featuresList,
      createdAt: editingProduct ? editingProduct.createdAt : new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    adminStore.saveMonetizationProduct(productPayload);
    setIsProductModalOpen(false);
  };

  // Filtered catalog products
  const filteredProducts = useMemo(() => {
    return monetizationProducts.filter((p) => {
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      const matchesSearch =
        p.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
        p.tagline.toLowerCase().includes(catalogSearch.toLowerCase()) ||
        p.description.toLowerCase().includes(catalogSearch.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [monetizationProducts, selectedCategory, catalogSearch]);

  const categoryLabels: Record<MonetizationCategory, { label: string; color: string; icon: any }> = {
    career_pass: { label: 'Passaporte Carreira', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', icon: Target },
    digital_download: { label: 'Download de Template', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: FileDown },
    ebook: { label: 'E-book / Guia', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', icon: BookOpen },
    ad_space: { label: 'Espaço de Mídia / Ads', color: 'bg-pink-500/20 text-pink-400 border-pink-500/30', icon: Megaphone },
    affiliate_partner: { label: 'Link de Afiliado', color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30', icon: Link2 },
    b2b_sponsorship: { label: 'Patrocínio B2B', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', icon: Building2 },
    consulting_service: { label: 'Serviço 1-a-1', color: 'bg-teal-500/20 text-teal-400 border-teal-500/30', icon: Zap },
  };

  const placementLabels: Record<MonetizationProduct['placementSiteArea'], string> = {
    calculator_results: 'Abaixo do Holerite / Calculadora',
    blog_bottom: 'Final dos Artigos do Blog',
    tools_grid: 'Grade da Toolbox / Ferramentas',
    site_header: 'Topo / Header do Portal',
    modal_popup: 'Modal de Saída / Download',
    dedicated_page: 'Página Dedicada / Vitrine',
  };

  const catalogTotalRev = monetizationProducts.reduce((sum, p) => sum + (p.totalRevenueCad || 0), 0);
  const catalogTotalSales = monetizationProducts.reduce((sum, p) => sum + (p.totalSalesOrConversions || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header Banner: Radar Identity & Value Prop */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 rounded-3xl border border-indigo-500/20 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <Radar className="w-5 h-5 animate-pulse" />
              </span>
              <h2 className="text-xl font-black text-white tracking-tight">
                Radar de Oportunidades & Catálogo de Monetização
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              O seu centro de comando estratégico para responder: <span className="text-indigo-300 font-bold">&quot;Estou aproveitando todas as possibilidades de monetização?&quot;</span>. Cadastre novos produtos, gerencie o mix de receita e elimine o dinheiro deixado na mesa.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Faturamento Total Ativo</span>
              <span className="text-lg font-black text-emerald-400 tabular-nums">
                ${revSummary.grandTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} CAD
              </span>
            </div>
          </div>
        </div>

        {/* Sub-Tabs Selector */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
          <button
            type="button"
            onClick={() => setSubTab('radar')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              subTab === 'radar'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Radar className="w-4 h-4" />
            <span>Radar Estratégico & Metas</span>
            {activeAlerts.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black border border-amber-500/30">
                {activeAlerts.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setSubTab('catalog')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              subTab === 'catalog'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Catálogo Universal de Soluções (CRUD)</span>
            <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black border border-emerald-500/30">
              {monetizationProducts.length} Ofertas
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUB-TAB 1: RADAR ESTRATÉGICO & SIMULADOR DE METAS */}
      {/* ========================================================================= */}
      {subTab === 'radar' && (
        <div className="space-y-6">
          {/* Smart Alerts: Money Left on the Table */}
          {activeAlerts.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 animate-bounce" />
                  <h3 className="text-sm font-bold uppercase text-slate-300 tracking-wider">
                    Alertas Críticos: Oportunidades de Receita Não Aproveitadas
                  </h3>
                </div>
                <span className="text-xs text-slate-400">
                  Potencial: <strong className="text-emerald-400">+${activeAlerts.reduce((s, a) => s + a.potentialRevenueMonthlyCad, 0)} CAD/mês</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {activeAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-4 bg-slate-950/90 rounded-2xl border border-amber-500/30 hover:border-amber-500/50 transition-all flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-bold uppercase border border-amber-500/20">
                          {alert.pillarLabel}
                        </span>
                        <span className="text-xs font-black text-emerald-400 font-mono">
                          +${alert.potentialRevenueMonthlyCad} CAD/mês
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white leading-tight">{alert.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{alert.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => handleDismissAlert(alert.id)}
                        className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                      >
                        Dispensar por enquanto
                      </button>

                      <button
                        type="button"
                        onClick={() => onNavigateTab(alert.targetTab as AdminTab)}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <span>{alert.actionText}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 1. CHECK-LIST DOS 4 PILARES DE MONETIZAÇÃO */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold uppercase text-slate-300 tracking-wider">
                  Status das 4 Frentes de Receita da Plataforma
                </h3>
              </div>
              <span className="text-xs text-slate-400">4 de 4 frentes estruturadas</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {/* Frente 1: Core Business (Passaportes de Carreira) */}
              <div className="p-4 bg-slate-950/80 rounded-2xl border border-emerald-500/30 space-y-3 hover:border-emerald-500/60 transition-all flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase">
                      ● Ativo & Principal
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono font-bold">Pilar 01</span>
                  </div>
                  <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-emerald-400" />
                    <span>Passaporte de Carreira</span>
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Kit de Aprovação (Currículo ATS + Simulador STAR + Testes Técnicos) vendido por passe de 30/90 dias ou vitalício.
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Receita Acumulada:</span>
                    <strong className="text-white font-mono">${revSummary.careerPassRev.toFixed(2)} CAD</strong>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Pacotes Vendidos:</span>
                    <strong className="text-emerald-400 font-mono">{careerPackages.reduce((s, p) => s + (p.totalSales || 0), 0)} vendas</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigateTab('career-pass')}
                    className="w-full py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 font-bold text-xs rounded-xl border border-emerald-500/30 transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-1"
                  >
                    <span>Gerenciar Passaportes</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Frente 2: Afiliados & E-commerce */}
              <div className="p-4 bg-slate-950/80 rounded-2xl border border-blue-500/30 space-y-3 hover:border-blue-500/60 transition-all flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold uppercase">
                      ● Ativo & Otimizar
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono font-bold">Pilar 02</span>
                  </div>
                  <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                    <Link2 className="w-4 h-4 text-blue-400" />
                    <span>Afiliados & Recomendações</span>
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Indicação de livros da Amazon, cursos preparatórios, contas bancárias (Desjardins) e remessas (Wise).
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Comissões Estimadas:</span>
                    <strong className="text-white font-mono">${revSummary.affiliateRev.toFixed(2)} CAD</strong>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Parceiros Ativos:</span>
                    <strong className="text-blue-400 font-mono">{affiliates.filter((a) => a.active).length} programas</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigateTab('affiliates')}
                    className="w-full py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 font-bold text-xs rounded-xl border border-blue-500/30 transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-1"
                  >
                    <span>Ver Parceiros & Links</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Frente 3: Publicidade & Banners */}
              <div className="p-4 bg-slate-950/80 rounded-2xl border border-pink-500/30 space-y-3 hover:border-pink-500/60 transition-all flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/20 text-[10px] font-bold uppercase">
                      ● Ativo & Monitorado
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono font-bold">Pilar 03</span>
                  </div>
                  <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                    <Megaphone className="w-4 h-4 text-pink-400" />
                    <span>Anúncios & Patrocínios</span>
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Slots do Google AdSense ou banners diretos para empresas de Québec com precificação fixa mensal ou CPM.
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Rendimento Anúncios:</span>
                    <strong className="text-white font-mono">${revSummary.adRev.toFixed(2)} CAD</strong>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Espaços no Site:</span>
                    <strong className="text-pink-400 font-mono">{adSlots.length} posições mapeadas</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigateTab('ads')}
                    className="w-full py-1.5 bg-pink-600/20 hover:bg-pink-600/30 text-pink-300 font-bold text-xs rounded-xl border border-pink-500/30 transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-1"
                  >
                    <span>Configurar Banners</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Frente 4: Vagas B2B & Recrutadores */}
              <div className="p-4 bg-slate-950/80 rounded-2xl border border-amber-500/30 space-y-3 hover:border-amber-500/60 transition-all flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold uppercase">
                      ● Alto Ticket
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono font-bold">Pilar 04</span>
                  </div>
                  <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-amber-400" />
                    <span>Vagas & Parcerias B2B</span>
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Venda de divulgação destacada para empresas de recrutamento, agências, bancos e escolas no Québec.
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Faturamento B2B:</span>
                    <strong className="text-white font-mono">${revSummary.b2bRev.toFixed(2)} CAD</strong>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Vagas / Anúncios:</span>
                    <strong className="text-amber-400 font-mono">{b2bJobs.length} ativas</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigateTab('b2b-jobs')}
                    className="w-full py-1.5 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 font-bold text-xs rounded-xl border border-amber-500/30 transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-1"
                  >
                    <span>Gerenciar Vagas B2B</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 2. REVENUE MIX PIE & SIMULADOR DE METAS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Revenue Mix Chart */}
            <div className="lg:col-span-5 p-5 bg-slate-950/80 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <PieChartIcon className="w-4 h-4 text-indigo-400" />
                    <span>Distribuição de Faturamento por Frente</span>
                  </h3>
                  <p className="text-xs text-slate-400">Equilíbrio saudável para não depender apenas de 1 fonte</p>
                </div>
              </div>

              <div className="h-56 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mixData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {mixData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: any) => [`$${Number(val || 0).toFixed(2)} CAD`, 'Faturamento']}
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                {mixData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-300">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-white font-bold">${item.value.toFixed(0)}</span>
                      <span className="text-[10px] text-slate-400">({item.pct}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Goal Simulator */}
            <div className="lg:col-span-7 p-5 bg-slate-950/80 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Calculator className="w-4 h-4 text-emerald-400" />
                    <span>Simulador Matemático de Meta Mensal</span>
                  </h3>
                  <p className="text-xs text-slate-400">Quantos acessos, pacotes e cliques você precisa para bater sua meta</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-bold">Meta:</span>
                  <div className="px-3 py-1 bg-slate-900 rounded-xl border border-slate-700 font-mono text-emerald-400 font-black text-sm">
                    ${targetMonthlyGoalCad.toLocaleString()} CAD/mês
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <input
                  type="range"
                  min={1000}
                  max={25000}
                  step={500}
                  value={targetMonthlyGoalCad}
                  onChange={(e) => setTargetMonthlyGoalCad(Number(e.target.value))}
                  className="w-full accent-indigo-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>$1.000 CAD</span>
                  <span>$5.000 CAD</span>
                  <span>$10.000 CAD</span>
                  <span>$25.000 CAD</span>
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap gap-2 pt-1">
                {[2000, 5000, 10000, 15000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setTargetMonthlyGoalCad(preset)}
                    className={`px-2.5 py-1 rounded-lg font-mono text-xs transition-colors cursor-pointer ${
                      targetMonthlyGoalCad === preset
                        ? 'bg-blue-600 text-white font-bold'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                    }`}
                  >
                    ${preset.toLocaleString()}
                  </button>
                ))}
              </div>

              {/* Resulting Equation Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">1. Calculadora de Salário</span>
                  <span className="text-base sm:text-lg font-black text-blue-400 font-mono block">
                    {goalSimulation.calculatorUsersNeeded.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    cálculos/mês (~{goalSimulation.dailyCalcsNeeded}/dia)
                  </span>
                </div>

                <div className="p-3 bg-slate-900/90 rounded-2xl border border-emerald-500/20 space-y-1">
                  <span className="text-[10px] text-emerald-400 block uppercase font-bold">2. Passaportes Vendidos</span>
                  <span className="text-base sm:text-lg font-black text-emerald-400 font-mono block">
                    {goalSimulation.passesNeeded} pacotes
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    ticket médio de $59 CAD (~{Math.ceil(goalSimulation.passesNeeded / 4)}/sem)
                  </span>
                </div>

                <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">3. Afiliados / Amazon</span>
                  <span className="text-base sm:text-lg font-black text-indigo-400 font-mono block">
                    {goalSimulation.affiliateConversionsNeeded} vendas
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    geradas por ~{goalSimulation.affiliateClicksNeeded} cliques
                  </span>
                </div>

                <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-amber-400 block uppercase font-bold">4. Vagas B2B</span>
                  <span className="text-base sm:text-lg font-black text-amber-400 font-mono block">
                    {goalSimulation.b2bPostingsNeeded} vagas
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    compradas por agências/empresas
                  </span>
                </div>

                <div className="col-span-2 p-3 bg-gradient-to-r from-blue-950/40 to-slate-900 rounded-2xl border border-blue-500/30 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-white block">Qual alavanca puxar este mês?</span>
                    <span className="text-[11px] text-slate-300 block">
                      Publicar 2 artigos no blog com foco em SEO + Inserir CTA do Passaporte ao término de cada cálculo.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigateTab('articles')}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer shrink-0 ml-2"
                  >
                    Escrever Artigo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: CATÁLOGO UNIVERSAL DE SOLUÇÕES & FONTES DE RENDA (CRUD COMPLETO) */}
      {/* ========================================================================= */}
      {subTab === 'catalog' && (
        <div className="space-y-6">
          {/* Action Bar & KPI Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Soluções Cadastradas</span>
              <span className="text-xl sm:text-2xl font-black text-white font-mono">{monetizationProducts.length}</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">em 6 pilares de monetização</span>
            </div>

            <div className="p-4 bg-slate-950/80 rounded-2xl border border-emerald-500/30">
              <span className="text-[10px] text-emerald-400 uppercase font-bold block">Faturamento Acumulado</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
                ${catalogTotalRev.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} CAD
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">todas as fontes de receita</span>
            </div>

            <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-blue-400 uppercase font-bold block">Vendas & Conversões</span>
              <span className="text-xl sm:text-2xl font-black text-white font-mono">{catalogTotalSales}</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">compradores e cliques aprovados</span>
            </div>

            <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-amber-400 uppercase font-bold block">Ticket Médio do Portfólio</span>
              <span className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
                ${(catalogTotalRev / (catalogTotalSales || 1)).toFixed(2)} CAD
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">por transação/cliente</span>
            </div>
          </div>

          {/* Search, Filter Bar and Create CTA */}
          <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                value={catalogSearch}
                onChange={(e) => setCatalogSearch(e.target.value)}
                placeholder="Buscar por nome, proposta de valor ou tipo..."
                className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleOpenCreateProduct}
                className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>+ Nova Fonte de Renda / Solução</span>
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Todas as Ofertas ({monetizationProducts.length})
            </button>

            {Object.entries(categoryLabels).map(([catKey, cfg]) => {
              const count = monetizationProducts.filter((p) => p.category === catKey).length;
              const IconComp = cfg.icon;
              return (
                <button
                  key={catKey}
                  type="button"
                  onClick={() => setSelectedCategory(catKey)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    selectedCategory === catKey
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{cfg.label}</span>
                  <span className="text-[10px] opacity-75 font-mono">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Products Grid & List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((prod) => {
              const catCfg = categoryLabels[prod.category] || { label: prod.category, color: 'bg-slate-800 text-slate-300', icon: ShoppingBag };
              const IconComp = catCfg.icon;

              return (
                <div
                  key={prod.id}
                  className={`p-5 bg-slate-950/80 rounded-2xl border transition-all flex flex-col justify-between space-y-4 hover:border-slate-700 ${
                    prod.status === 'active' ? 'border-slate-800' : 'border-slate-800/60 opacity-60'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header: Category Badge + Status */}
                    <div className="flex items-center justify-between gap-2">
                      <span className={`px-2 py-0.5 rounded-lg border text-[10px] font-black uppercase flex items-center gap-1 ${catCfg.color}`}>
                        <IconComp className="w-3 h-3" />
                        <span>{catCfg.label}</span>
                      </span>

                      <div className="flex items-center gap-1.5">
                        {prod.badge && (
                          <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                            {prod.badge}
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => adminStore.toggleMonetizationProductStatus(prod.id)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border cursor-pointer transition-colors ${
                            prod.status === 'active'
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30'
                              : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                          }`}
                        >
                          {prod.status === 'active' ? '● Ativo' : '⏸️ Pausado'}
                        </button>
                      </div>
                    </div>

                    {/* Title & Tagline */}
                    <div>
                      <h4 className="text-sm font-black text-white leading-tight">{prod.name}</h4>
                      {prod.tagline && (
                        <p className="text-xs text-slate-300 mt-1 leading-snug">{prod.tagline}</p>
                      )}
                    </div>

                    {/* Price & Billing */}
                    <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800/80 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Preço de Venda</span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-lg font-black text-emerald-400 font-mono">
                            ${(prod.promotionalPriceCad ?? prod.priceCad).toFixed(2)} CAD
                          </span>
                          {prod.promotionalPriceCad && (
                            <span className="text-xs text-slate-500 line-through font-mono">
                              ${prod.priceCad.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Formato / Duração</span>
                        <span className="text-xs text-slate-300 font-medium">{prod.billingCycleOrDuration}</span>
                      </div>
                    </div>

                    {/* Placement on site */}
                    <div className="text-xs text-slate-400 flex items-center gap-1.5">
                      <span className="font-semibold text-slate-500">Exibição:</span>
                      <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 text-[11px] font-mono border border-slate-800">
                        {placementLabels[prod.placementSiteArea] || prod.placementSiteArea}
                      </span>
                    </div>

                    {/* Features Snippet */}
                    {prod.features && prod.features.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Entregáveis / Vantagens:</span>
                        <div className="space-y-0.5">
                          {prod.features.slice(0, 3).map((f, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                              <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                              <span className="truncate">{f}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer Metrics & Actions */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Faturado</span>
                      <span className="text-xs font-black text-white font-mono">
                        ${(prod.totalRevenueCad || 0).toFixed(2)} CAD ({prod.totalSalesOrConversions || 0} v.)
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEditProduct(prod)}
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-blue-600 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-800"
                        title="Editar Solução"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Remover "${prod.name}" do catálogo de monetização?`)) {
                            adminStore.deleteMonetizationProduct(prod.id);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-600 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-800"
                        title="Excluir Solução"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CRIAR OU EDITAR FONTE DE RENDA / SOLUÇÃO */}
      {/* ========================================================================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  <ShoppingBag className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-black text-white">
                    {editingProduct ? 'Editar Solução / Fonte de Renda' : 'Cadastrar Nova Fonte de Renda'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Defina o modelo comercial, preço, entregáveis e onde ela será ofertada na plataforma.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nome do Produto */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-300">
                    Nome da Solução / Produto <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    placeholder="Ex: Template de Currículo ATS Canadense (.docx)"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* Tagline / Subtítulo */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-300">Tagline / Proposta de Valor Curta</label>
                  <input
                    type="text"
                    value={prodTagline}
                    onChange={(e) => setProdTagline(e.target.value)}
                    placeholder="Ex: Modelo 100% aprovado pelos robôs de triagem sem fotos ou dados eliminatórios"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* Categoria */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Categoria Comercial</label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value as MonetizationCategory)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="digital_download">Download de Template / Planilha (Micropagamento)</option>
                    <option value="career_pass">Passaporte de Carreira (Acesso Temporal)</option>
                    <option value="ebook">E-book / Guia Digital Completo</option>
                    <option value="ad_space">Espaço Publicitário / Banner</option>
                    <option value="affiliate_partner">Indicação de Terceiros / Afiliado</option>
                    <option value="consulting_service">Serviço / Consultoria 1-a-1</option>
                    <option value="b2b_sponsorship">Patrocínio Corporativo B2B</option>
                  </select>
                </div>

                {/* Modelo de Preço */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Modelo de Cobrança</label>
                  <select
                    value={prodPricingModel}
                    onChange={(e) => setProdPricingModel(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="fixed_one_time">Preço Único / Pagamento Avulso</option>
                    <option value="time_pass">Passe por Tempo Determinado (ex: 30 dias)</option>
                    <option value="flat_monthly">Mensalidade Fixa (Flat Fee / Mídia)</option>
                    <option value="commission_cpa">Comissão CPA por Venda ou Abertura</option>
                    <option value="free_lead_magnet">Gratuito (Ímã de Leads / Captura)</option>
                  </select>
                </div>

                {/* Preço Regular */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Preço Regular ($ CAD)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={prodPriceCad}
                    onChange={(e) => setProdPriceCad(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* Preço Promocional */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Preço Promocional ($ CAD) (Opcional)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={prodPromoPriceCad ?? ''}
                    onChange={(e) => setProdPromoPriceCad(e.target.value ? parseFloat(e.target.value) : undefined)}
                    placeholder="Deixe em branco se não houver desconto"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* Ciclo / Duração Textual */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Duração / Entrega</label>
                  <input
                    type="text"
                    value={prodBillingCycle}
                    onChange={(e) => setProdBillingCycle(e.target.value)}
                    placeholder="Ex: Download imediato (Word + PDF)"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* Local de Injeção no Site */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Onde Exibir no Site</label>
                  <select
                    value={prodPlacement}
                    onChange={(e) => setProdPlacement(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="calculator_results">Abaixo do Holerite / Calculadora</option>
                    <option value="blog_bottom">Final dos Artigos do Blog</option>
                    <option value="tools_grid">Grade da Toolbox / Ferramentas</option>
                    <option value="site_header">Topo / Header do Portal</option>
                    <option value="modal_popup">Modal de Saída / Download</option>
                    <option value="dedicated_page">Página Dedicada / Vitrine</option>
                  </select>
                </div>

                {/* Selo / Badge Promocional */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Badge / Destaque</label>
                  <input
                    type="text"
                    value={prodBadge}
                    onChange={(e) => setProdBadge(e.target.value)}
                    placeholder="Ex: Mais Popular, 40% OFF, Download Rápido"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* Status */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Status Inicial</label>
                  <select
                    value={prodStatus}
                    onChange={(e) => setProdStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="active">🟢 Ativo (Visível na plataforma)</option>
                    <option value="paused">⏸️ Pausado (Oculto temporariamente)</option>
                    <option value="draft">📝 Rascunho (Em preparação)</option>
                  </select>
                </div>

                {/* Entregáveis / Features */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-300">
                    Entregáveis / Lista de Vantagens (1 por linha)
                  </label>
                  <textarea
                    rows={3}
                    value={prodFeatures}
                    onChange={(e) => setProdFeatures(e.target.value)}
                    placeholder="Ex:&#10;Compatível com robôs ATS&#10;Instruções de palavras-chave&#10;Arquivo .docx editável"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-black text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingProduct ? 'Salvar Alterações' : 'Cadastrar Solução'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
