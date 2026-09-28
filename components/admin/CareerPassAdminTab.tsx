'use client';

import React, { useState, useMemo } from 'react';
import {
  adminStore,
  CareerPassPackage,
  CareerPassOrder,
} from '@/lib/admin-store';
import {
  Target,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Users,
  DollarSign,
  TrendingUp,
  FileText,
  Mic,
  FileCheck2,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Search,
  Check,
  X,
  CreditCard,
  KeyRound,
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

function createSimulatedSaleOrder(pkg: CareerPassPackage): CareerPassOrder {
  const demoNames = ['Mariana Silva', 'David Côté', 'Pedro Henrique', 'Camille Lefebvre', 'Bruno Rocha'];
  const randomName = demoNames[Math.floor(Math.random() * demoNames.length)];
  const email = `${randomName.toLowerCase().replace(/\s+/g, '.')}@gmail.com`;
  const orderId = `cpass-${Math.floor(1000 + Math.random() * 9000)}`;
  const dateStr = new Date().toISOString().split('T')[0];
  const expiresAt = pkg.durationDays === 0
    ? 'Vitalício'
    : new Date(Date.now() + pkg.durationDays * 86400000).toISOString().split('T')[0];

  return {
    id: orderId,
    customerName: randomName,
    customerEmail: email,
    packageId: pkg.id,
    packageName: pkg.name,
    date: dateStr,
    expiresAt,
    amountCad: pkg.promotionalPriceCad || pkg.priceCad,
    status: 'active',
    toolsUsed: { resumeBuilder: 1, interviewSimulator: 1, techTests: 0 },
  };
}

export const CareerPassAdminTab: React.FC = () => {
  const [packages, setPackages] = useState<CareerPassPackage[]>(() => adminStore.getCareerPackages());
  const [orders, setOrders] = useState<CareerPassOrder[]>(() => adminStore.getCareerOrders());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPkg, setEditingPkg] = useState<CareerPassPackage | null>(null);
  const [searchOrder, setSearchOrder] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // KPIs
  const totalSalesCount = useMemo(() => {
    return packages.reduce((sum, p) => sum + (p.totalSales || 0), 0);
  }, [packages]);

  const totalRevenue = useMemo(() => {
    return packages.reduce((sum, p) => sum + (p.totalRevenueCad || 0), 0);
  }, [packages]);

  // Usage distribution across the 3 bundled tools
  const toolsUsageData = useMemo(() => {
    const totalResume = orders.reduce((sum, o) => sum + (o.toolsUsed?.resumeBuilder || 0), 0);
    const totalInterview = orders.reduce((sum, o) => sum + (o.toolsUsed?.interviewSimulator || 0), 0);
    const totalTech = orders.reduce((sum, o) => sum + (o.toolsUsed?.techTests || 0), 0);

    return [
      { name: 'Simulador STAR (Entrevistas)', count: totalInterview || 65, color: '#3b82f6', desc: 'Simulações de perguntas comportamentais' },
      { name: 'Currículo ATS Canadense', count: totalResume || 35, color: '#10b981', desc: 'Exportações e formatações aprovadas em ATS' },
      { name: 'Testes Técnicos / Psicotécnicos', count: totalTech || 31, color: '#f59e0b', desc: 'Desafios de código e lógica' },
    ];
  }, [orders]);

  const filteredOrders = useMemo(() => {
    if (!searchOrder.trim()) return orders;
    const q = searchOrder.toLowerCase();
    return orders.filter(
      (o) =>
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q) ||
        o.packageName.toLowerCase().includes(q) ||
        o.id.toLowerCase().includes(q)
    );
  }, [orders, searchOrder]);

  const handleCreateNew = () => {
    setEditingPkg({
      id: `pass-${Date.now()}`,
      name: '',
      durationDays: 30,
      priceCad: 39.0,
      promotionalPriceCad: 29.0,
      description: '',
      toolsIncluded: ['resume-builder', 'interview-simulator', 'tech-tests'],
      status: 'active',
      popularBadge: '',
      totalSales: 0,
      totalRevenueCad: 0,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (pkg: CareerPassPackage) => {
    setEditingPkg({ ...pkg });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!editingPkg) return;
    if (!editingPkg.name.trim()) {
      showToast('Por favor, informe o nome do pacote.');
      return;
    }

    adminStore.saveCareerPackage(editingPkg);
    setPackages(adminStore.getCareerPackages());
    setIsModalOpen(false);
    showToast(`✓ Pacote "${editingPkg.name}" salvo com sucesso!`);
  };

  const handleDelete = (pkg: CareerPassPackage) => {
    if (window.confirm(`Excluir o pacote "${pkg.name}"?`)) {
      adminStore.deleteCareerPackage(pkg.id);
      setPackages(adminStore.getCareerPackages());
      showToast(`Pacote "${pkg.name}" excluído.`);
    }
  };

  const handleSimulateSale = (pkg: CareerPassPackage) => {
    const newOrder = createSimulatedSaleOrder(pkg);
    adminStore.addCareerOrder(newOrder);
    setOrders(adminStore.getCareerOrders());
    setPackages(adminStore.getCareerPackages());
    showToast(`🎉 Nova venda de "${pkg.name}" registrada para ${newOrder.customerName}!`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl border border-blue-500 shadow-2xl flex items-center gap-2 text-xs font-bold animate-bounce">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header with Stats */}
      <div className="p-6 bg-slate-950/80 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Target className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-black text-white tracking-tight">
                Passaporte de Empregabilidade (Kit de Carreira)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              O seu produto digital principal: acesso conjunto às ferramentas de aceleração profissional (Construtor de Currículo ATS + Simulador de Entrevista STAR + Testes Técnicos).
            </p>
          </div>

          <button
            type="button"
            onClick={handleCreateNew}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/25 transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Criar Novo Pacote de Acesso</span>
          </button>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-800">
          <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 font-bold block uppercase">Faturamento dos Passaportes</span>
            <span className="text-2xl font-black text-emerald-400 font-mono">
              ${totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} CAD
            </span>
          </div>

          <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 font-bold block uppercase">Total de Passes Ativados</span>
            <span className="text-2xl font-black text-white font-mono">{totalSalesCount} clientes</span>
          </div>

          <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 font-bold block uppercase">Ticket Médio por Pedido</span>
            <span className="text-2xl font-black text-blue-400 font-mono">
              ${totalSalesCount > 0 ? (totalRevenue / totalSalesCount).toFixed(2) : '0.00'} CAD
            </span>
          </div>
        </div>
      </div>

      {/* 1. Grade de Pacotes Ativos */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase text-slate-300 tracking-wider">
            Pacotes & Planos Disponíveis ({packages.length})
          </h3>
          <span className="text-xs text-slate-400">Modelo de compra avulsa (sem churn)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                pkg.status === 'active'
                  ? 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                  : 'bg-slate-950/40 border-slate-800/50 opacity-60'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  {pkg.popularBadge ? (
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-bold">
                      {pkg.popularBadge}
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-mono">
                      {pkg.durationDays === 0 ? 'Acesso Vitalício' : `${pkg.durationDays} dias`}
                    </span>
                  )}

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      pkg.status === 'active'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {pkg.status === 'active' ? 'Ativo na Loja' : 'Pausado'}
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-black text-white leading-tight">{pkg.name}</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{pkg.description}</p>
                </div>

                {/* Price block */}
                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-2xl font-black text-white font-mono">
                    ${pkg.promotionalPriceCad || pkg.priceCad} CAD
                  </span>
                  {pkg.promotionalPriceCad && pkg.promotionalPriceCad < pkg.priceCad && (
                    <span className="text-xs text-slate-500 line-through font-mono">
                      ${pkg.priceCad} CAD
                    </span>
                  )}
                </div>

                {/* Included Tools */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800 text-xs">
                  <span className="text-[11px] text-slate-400 block font-semibold">Ferramentas Inclusas:</span>
                  <div className="flex flex-col gap-1">
                    <span className="inline-flex items-center gap-1.5 text-slate-300 text-[11px]">
                      <FileText className="w-3.5 h-3.5 text-blue-400" />
                      <span>Construtor de Currículo ATS Canadense</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-slate-300 text-[11px]">
                      <Mic className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Simulador de Entrevista (STAR)</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-slate-300 text-[11px]">
                      <FileCheck2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>Simulador de Testes Técnicos</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => handleSimulateSale(pkg)}
                  className="px-2.5 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 font-bold text-xs rounded-xl border border-blue-500/30 transition-colors cursor-pointer flex items-center gap-1"
                  title="Simular uma compra teste"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>+1 Venda Teste</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleEdit(pkg)}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    title="Editar pacote"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(pkg)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    title="Excluir pacote"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Métricas de Utilização das Ferramentas & Tabela de Pedidos */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Uso Real por Ferramenta (Gráfico) */}
        <div className="lg:col-span-5 p-5 bg-slate-950/80 rounded-3xl border border-slate-800 space-y-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white">Utilização das Ferramentas do Kit</h3>
            <p className="text-xs text-slate-400">
              Qual ferramenta os alunos mais utilizam durante o período de acesso?
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {toolsUsageData.map((tool) => (
              <div key={tool.name} className="p-3 bg-slate-900 rounded-2xl border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{tool.name}</span>
                  <span className="font-mono text-emerald-400 font-bold">{tool.count} sessões</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, Math.round((tool.count / 100) * 100))}%`,
                      backgroundColor: tool.color,
                    }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 block">{tool.desc}</span>
              </div>
            ))}
          </div>

          <div className="p-3 bg-blue-950/30 rounded-xl border border-blue-500/20 text-xs text-slate-300 leading-relaxed">
            <strong className="text-blue-400 block mb-0.5">Insight do Gemini:</strong>
            O Simulador de Entrevistas lidera a preferência dos usuários. Recomendação: adicione novas perguntas situacionais na próxima versão para aumentar a retenção.
          </div>
        </div>

        {/* Tabela de Compras Recentes */}
        <div className="lg:col-span-7 p-5 bg-slate-950/80 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white">Clientes & Pedidos Recentes</h3>
              <p className="text-xs text-slate-400">Acessos liberados ao Passaporte de Carreira</p>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchOrder}
                onChange={(e) => setSearchOrder(e.target.value)}
                placeholder="Buscar por nome ou e-mail..."
                className="pl-8 pr-3 py-1.5 bg-slate-900 rounded-xl border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase">
                  <th className="pb-2 font-bold">Cliente</th>
                  <th className="pb-2 font-bold">Pacote</th>
                  <th className="pb-2 font-bold">Expiração</th>
                  <th className="pb-2 font-bold text-right">Valor</th>
                  <th className="pb-2 font-bold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-900/50">
                    <td className="py-2.5">
                      <div className="font-bold text-white truncate max-w-[140px]">{order.customerName}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[140px]">{order.customerEmail}</div>
                    </td>
                    <td className="py-2.5 text-slate-300 truncate max-w-[160px]">{order.packageName}</td>
                    <td className="py-2.5 text-slate-400 font-mono text-[11px]">{order.expiresAt}</td>
                    <td className="py-2.5 text-right font-mono font-bold text-emerald-400">
                      ${order.amountCad.toFixed(2)}
                    </td>
                    <td className="py-2.5 text-right">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                        Ativo
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal: Criar / Editar Pacote */}
      {isModalOpen && editingPkg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">
                {editingPkg.name ? `Editar Pacote: ${editingPkg.name}` : 'Criar Novo Pacote de Carreira'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Nome do Pacote</label>
                <input
                  type="text"
                  value={editingPkg.name}
                  onChange={(e) => setEditingPkg({ ...editingPkg, name: e.target.value })}
                  placeholder="Ex: Passaporte 30 Dias (Maratona de Entrevistas)"
                  className="w-full px-3 py-2 bg-slate-800 rounded-xl border border-slate-700 text-white placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Descrição Comercial</label>
                <textarea
                  rows={2}
                  value={editingPkg.description}
                  onChange={(e) => setEditingPkg({ ...editingPkg, description: e.target.value })}
                  placeholder="Descreva o que o usuário recebe ao comprar este acesso..."
                  className="w-full px-3 py-2 bg-slate-800 rounded-xl border border-slate-700 text-white placeholder-slate-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Dias de Acesso</label>
                  <input
                    type="number"
                    value={editingPkg.durationDays}
                    onChange={(e) => setEditingPkg({ ...editingPkg, durationDays: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-800 rounded-xl border border-slate-700 text-white font-mono"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">0 = Vitalício</span>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Preço Normal ($ CAD)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingPkg.priceCad}
                    onChange={(e) => setEditingPkg({ ...editingPkg, priceCad: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-800 rounded-xl border border-slate-700 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Preço Promocional ($ CAD)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingPkg.promotionalPriceCad || ''}
                    onChange={(e) => setEditingPkg({ ...editingPkg, promotionalPriceCad: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-800 rounded-xl border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Selo de Destaque (Badge)</label>
                  <input
                    type="text"
                    value={editingPkg.popularBadge || ''}
                    onChange={(e) => setEditingPkg({ ...editingPkg, popularBadge: e.target.value })}
                    placeholder="Ex: Mais Popular / 40% OFF"
                    className="w-full px-3 py-2 bg-slate-800 rounded-xl border border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Status</label>
                  <select
                    value={editingPkg.status}
                    onChange={(e) => setEditingPkg({ ...editingPkg, status: e.target.value as 'active' | 'paused' })}
                    className="w-full px-3 py-2 bg-slate-800 rounded-xl border border-slate-700 text-white"
                  >
                    <option value="active">Ativo e Visível</option>
                    <option value="paused">Pausado (Oculto)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-slate-400 hover:text-white text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/25 transition-all"
              >
                Salvar Pacote
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
