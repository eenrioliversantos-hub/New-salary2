'use client';

import React, { useState, useMemo } from 'react';
import {
  adminStore,
  B2BJobPosting,
  B2BPartnerCategory,
} from '@/lib/admin-store';
import {
  Building2,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Eye,
  CheckCircle2,
  Clock,
  DollarSign,
  Briefcase,
  MapPin,
  Sparkles,
  TrendingUp,
  Search,
  X,
  GraduationCap,
  Landmark,
  Scale,
  Receipt,
  ShieldCheck,
  Check,
  Calendar,
  MousePointerClick,
  Copy,
} from 'lucide-react';

export const B2BJobsAdminTab: React.FC = () => {
  const [jobs, setJobs] = useState<B2BJobPosting[]>(() => adminStore.getB2BJobs());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<B2BJobPosting | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [previewJob, setPreviewJob] = useState<B2BJobPosting | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const partnerCategories: Record<B2BPartnerCategory, { label: string; icon: any; color: string }> = {
    recruitment: { label: 'Recrutamento & Vagas', icon: Briefcase, color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
    finance_banking: { label: 'Bancos & Finanças', icon: Landmark, color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
    education_french: { label: 'Escolas de Idiomas', icon: GraduationCap, color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
    immigration_legal: { label: 'Imigração & Vistos', icon: Scale, color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
    tax_accounting: { label: 'Contabilidade & Fiscal', icon: Receipt, color: 'bg-teal-500/10 text-teal-400 border-teal-500/30' },
    corporate_services: { label: 'Serviços Corporativos', icon: Building2, color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' },
  };

  const totalB2bRevenue = useMemo(() => {
    return jobs.reduce((sum, j) => sum + (j.pricePaidCad || 0), 0);
  }, [jobs]);

  const totalClicks = useMemo(() => {
    return jobs.reduce((sum, j) => sum + (j.clicksCount || 0), 0);
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((j) => {
      const cat = j.category || 'recruitment';
      const matchesCategory = selectedCategory === 'all' || cat === selectedCategory;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        j.title.toLowerCase().includes(q) ||
        j.companyName.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q) ||
        (j.promotedValueProp && j.promotedValueProp.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [jobs, searchQuery, selectedCategory]);

  const handleCreateNew = () => {
    const today = new Date().toISOString().split('T')[0];
    const expiry = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];

    setEditingJob({
      id: `b2b-job-${Date.now()}`,
      title: '',
      companyName: '',
      location: 'Montréal, QC (Hybride)',
      salaryRange: '$75.000 - $95.000 CAD/ano',
      jobType: 'Full-time',
      applicationUrl: 'https://',
      status: 'active',
      featured: true,
      packageTier: 'Premium (30 dias)',
      pricePaidCad: 250.0,
      startDate: today,
      endDate: expiry,
      clicksCount: 0,
      category: 'recruitment',
      ctaText: 'Candidatar-se / Saber Mais',
      promotedValueProp: 'Empresa verificada com benefícios completos de saúde e previdência coletiva.',
      contactPerson: 'Departamento Comercial / RH',
      advertiserEmail: 'contato@empresa.ca',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (job: B2BJobPosting) => {
    setEditingJob({
      ...job,
      category: job.category || 'recruitment',
      ctaText: job.ctaText || 'Candidatar-se / Saber Mais',
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!editingJob) return;
    if (!editingJob.title.trim() || !editingJob.companyName.trim()) {
      showToast('Por favor, preencha o título e o nome da empresa.');
      return;
    }

    adminStore.saveB2BJob(editingJob);
    setJobs(adminStore.getB2BJobs());
    setIsModalOpen(false);
    showToast(`✓ Parceria para "${editingJob.companyName}" salva com sucesso!`);
  };

  const handleDelete = (job: B2BJobPosting) => {
    if (window.confirm(`Excluir a publicação "${job.title}" de ${job.companyName}?`)) {
      adminStore.deleteB2BJob(job.id);
      setJobs(adminStore.getB2BJobs());
      showToast(`Publicação excluída com sucesso.`);
    }
  };

  const handleToggleStatus = (job: B2BJobPosting) => {
    const isNowActive = adminStore.toggleB2BJobStatus(job.id);
    setJobs(adminStore.getB2BJobs());
    showToast(isNowActive ? 'Publicação ativada no portal!' : 'Publicação pausada.');
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl border border-amber-500 shadow-2xl flex items-center gap-2 text-xs font-bold animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="p-6 bg-slate-950/80 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Building2 className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-black text-white tracking-tight">
                Parcerias B2B, Vagas & Espaços Comerciais
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Monetização B2B corporativa aberta para <span className="text-amber-300 font-bold">qualquer empresa</span>: empregadores contratando talentos, bancos (abertura de conta salário), escolas de idiomas (francês Québec), consultorias de imigração e contabilidade fiscal.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCreateNew}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 active:scale-95 text-white font-black text-xs rounded-xl shadow-lg shadow-amber-600/25 transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ Cadastrar Anunciante / Vaga B2B</span>
          </button>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-slate-800">
          <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 font-bold block uppercase">Faturamento B2B Total</span>
            <span className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
              ${totalB2bRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} CAD
            </span>
          </div>

          <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 font-bold block uppercase">Parceiros Ativos</span>
            <span className="text-xl sm:text-2xl font-black text-white font-mono">
              {jobs.filter((j) => j.status === 'active').length}
            </span>
            <span className="text-[10px] text-emerald-400">no ar no site</span>
          </div>

          <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 font-bold block uppercase">Cliques & Leads Gerados</span>
            <span className="text-xl sm:text-2xl font-black text-blue-400 font-mono">
              {totalClicks.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-400">tráfego enviado aos clientes</span>
          </div>

          <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 font-bold block uppercase">Ticket Médio B2B</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
              ${(totalB2bRevenue / (jobs.length || 1)).toFixed(2)} CAD
            </span>
            <span className="text-[10px] text-slate-400">por contrato de veiculação</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por empresa, cargo, serviço ou cidade..."
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Todos ({jobs.length})
          </button>

          {Object.entries(partnerCategories).map(([key, cfg]) => {
            const count = jobs.filter((j) => (j.category || 'recruitment') === key).length;
            const IconComp = cfg.icon;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedCategory(key)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  selectedCategory === key
                    ? 'bg-amber-600 text-white shadow-xs'
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
      </div>

      {/* Jobs / Partners Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredJobs.map((job) => {
          const cat = job.category || 'recruitment';
          const catCfg = partnerCategories[cat] || partnerCategories.recruitment;
          const IconComp = catCfg.icon;

          return (
            <div
              key={job.id}
              className={`p-5 bg-slate-950/80 rounded-2xl border transition-all flex flex-col justify-between space-y-4 hover:border-slate-700 ${
                job.status === 'active' ? 'border-slate-800' : 'border-slate-800/60 opacity-60'
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
                    {job.featured && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30 flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>Destaque</span>
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => handleToggleStatus(job)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border cursor-pointer transition-colors ${
                        job.status === 'active'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30'
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                      }`}
                    >
                      {job.status === 'active' ? '● Ativo' : '⏸️ Pausado'}
                    </button>
                  </div>
                </div>

                {/* Company & Title */}
                <div>
                  <div className="text-xs font-bold text-amber-400 flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    <span>{job.companyName}</span>
                  </div>
                  <h4 className="text-sm font-black text-white mt-0.5 leading-snug">{job.title}</h4>
                  {job.promotedValueProp && (
                    <p className="text-xs text-slate-300 mt-1 line-clamp-2">{job.promotedValueProp}</p>
                  )}
                </div>

                {/* Meta details */}
                <div className="space-y-1.5 text-xs text-slate-400 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>{job.location}</span>
                    </span>
                    <span className="font-mono text-emerald-400 font-bold">{job.salaryRange}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-800">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      <span>Vigência:</span>
                    </span>
                    <span className="font-mono text-slate-300">
                      {job.startDate} até {job.endDate}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer: Package, Metrics & Action buttons */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">{job.packageTier}</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-black text-white font-mono">${job.pricePaidCad} CAD</span>
                    <span className="text-[11px] font-bold text-blue-400 font-mono">
                      {job.clicksCount} cliques
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPreviewJob(job)}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-emerald-600 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-800"
                    title="Pré-visualizar Card no Site"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>

                  <a
                    href={job.applicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-amber-600 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-800"
                    title="Abrir Link Externo do Anunciante"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    type="button"
                    onClick={() => handleEdit(job)}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-blue-600 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-800"
                    title="Editar Anúncio"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(job)}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-600 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-800"
                    title="Excluir Anúncio"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* MODAL: CRIAR OU EDITAR PARCEIRO B2B / VAGA */}
      {/* ========================================================================= */}
      {isModalOpen && editingJob && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Building2 className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-black text-white">
                    {editingJob.id.includes('Date.now') ? 'Novo Anunciante / Vaga B2B' : 'Editar Espaço Corporativo B2B'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Empresas contratantes, bancos, escolas de francês e consultorias com presença destacada no portal.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Categoria */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Categoria do Parceiro</label>
                <select
                  value={editingJob.category || 'recruitment'}
                  onChange={(e) => setEditingJob({ ...editingJob, category: e.target.value as B2BPartnerCategory })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="recruitment">Recrutamento & Vagas de Emprego</option>
                  <option value="finance_banking">Banco & Instituição Financeira</option>
                  <option value="education_french">Escola de Idiomas / Cursos de Francês</option>
                  <option value="immigration_legal">Consultoria de Imigração & Vistos</option>
                  <option value="tax_accounting">Escritório de Contabilidade & Impostos</option>
                  <option value="corporate_services">Outros Serviços Corporativos</option>
                </select>
              </div>

              {/* Pacote Comercial */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Pacote Contratado</label>
                <select
                  value={editingJob.packageTier}
                  onChange={(e) => setEditingJob({ ...editingJob, packageTier: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="Standard (15 dias)">Standard (15 dias) - $150 CAD</option>
                  <option value="Premium (30 dias)">Premium (30 dias) - $250 CAD</option>
                  <option value="Destaque Topo (60 dias)">Destaque Topo (60 dias) - $450 CAD</option>
                  <option value="Plano Anual Parceria">Plano Anual Parceria Institucional - $1.800 CAD</option>
                </select>
              </div>

              {/* Nome da Empresa */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">
                  Nome da Empresa / Anunciante <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={editingJob.companyName}
                  onChange={(e) => setEditingJob({ ...editingJob, companyName: e.target.value })}
                  placeholder="Ex: Desjardins, CGI, École Québec..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Título da Oferta / Vaga */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">
                  Título da Oferta / Cargo <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={editingJob.title}
                  onChange={(e) => setEditingJob({ ...editingJob, title: e.target.value })}
                  placeholder="Ex: Desenvolvedor Full-Stack ou Conta Salário Sem Tarifas"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Proposta de Valor / Resumo */}
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-300">Proposta de Valor / Resumo da Oferta</label>
                <input
                  type="text"
                  value={editingJob.promotedValueProp || ''}
                  onChange={(e) => setEditingJob({ ...editingJob, promotedValueProp: e.target.value })}
                  placeholder="Ex: Vaga com plano odontológico e bônus de admissão. Ou: Isenção de tarifas por 12 meses para recém-chegados."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Localização */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Localização / Formato</label>
                <input
                  type="text"
                  value={editingJob.location}
                  onChange={(e) => setEditingJob({ ...editingJob, location: e.target.value })}
                  placeholder="Ex: Montréal, QC (Hybride) ou Toda a Província"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Faixa Salarial / Benefício */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Faixa Salarial ou Benefício em Destaque</label>
                <input
                  type="text"
                  value={editingJob.salaryRange}
                  onChange={(e) => setEditingJob({ ...editingJob, salaryRange: e.target.value })}
                  placeholder="Ex: $85.000 - $105.000 CAD ou Bônus $150 CAD"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Link de Destino / Aplicação */}
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-300">
                  Link de Destino / Formulário / WhatsApp <span className="text-rose-400">*</span>
                </label>
                <input
                  type="url"
                  value={editingJob.applicationUrl}
                  onChange={(e) => setEditingJob({ ...editingJob, applicationUrl: e.target.value })}
                  placeholder="https://sua-empresa.com/vagas?utm_source=paienet"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                />
              </div>

              {/* Texto do CTA */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Texto do Botão de Ação (CTA)</label>
                <input
                  type="text"
                  value={editingJob.ctaText || ''}
                  onChange={(e) => setEditingJob({ ...editingJob, ctaText: e.target.value })}
                  placeholder="Ex: Candidatar-se, Abrir Conta, Falar no WhatsApp"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Valor Pago ($ CAD) */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Valor Cobrado / Pago ($ CAD)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={editingJob.pricePaidCad}
                  onChange={(e) => setEditingJob({ ...editingJob, pricePaidCad: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Data Início */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Data de Início da Veiculação</label>
                <input
                  type="date"
                  value={editingJob.startDate}
                  onChange={(e) => setEditingJob({ ...editingJob, startDate: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                />
              </div>

              {/* Data Fim */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Data de Término (Expiração)</label>
                <input
                  type="date"
                  value={editingJob.endDate}
                  onChange={(e) => setEditingJob({ ...editingJob, endDate: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                />
              </div>

              {/* Status e Destaque */}
              <div className="flex items-center gap-4 sm:col-span-2 pt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingJob.featured}
                    onChange={(e) => setEditingJob({ ...editingJob, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span>Destacar no topo da vitrine com badge dourado</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingJob.status === 'active'}
                    onChange={(e) => setEditingJob({ ...editingJob, status: e.target.checked ? 'active' : 'paused' })}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Ativo e visível imediatamente</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-bold transition-colors cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleSave}
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 active:scale-95 text-white font-black text-xs rounded-xl shadow-lg shadow-amber-600/30 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Salvar Parceria B2B</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: LIVE PREVIEW DO CARD CORPORATIVO / VAGA */}
      {/* ========================================================================= */}
      {previewJob && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Visualização Exata no Portal</h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewJob(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 bg-slate-900 rounded-2xl border border-slate-700/80 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{previewJob.companyName}</span>
                </span>
                {previewJob.featured && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black border border-amber-500/30">
                    ⭐ Parceiro em Destaque
                  </span>
                )}
              </div>

              <div>
                <h4 className="text-base font-black text-white">{previewJob.title}</h4>
                {previewJob.promotedValueProp && (
                  <p className="text-xs text-slate-300 mt-1">{previewJob.promotedValueProp}</p>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                <span>📍 {previewJob.location}</span>
                <strong className="text-emerald-400 font-mono">{previewJob.salaryRange}</strong>
              </div>

              <a
                href={previewJob.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer block text-center"
              >
                <span>{previewJob.ctaText || 'Candidatar-se / Saber Mais'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
