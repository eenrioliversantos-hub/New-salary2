'use client';

import React, { useState, useMemo } from 'react';
import {
  adminStore,
  NewsletterLead,
  FunnelStage,
  LeadTemperature,
  SubscriptionStatus,
  LeadInteraction,
} from '@/lib/admin-store';
import {
  Users,
  Flame,
  Snowflake,
  Sun,
  Crown,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  Download,
  Mail,
  Phone,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  DollarSign,
  ArrowRight,
  ArrowLeft,
  Send,
  Copy,
  Tag,
  RefreshCw,
  X,
  Save,
  Check,
  ChevronRight,
  Lightbulb,
  ExternalLink,
  BookOpen,
  Calendar,
  Layers,
  ArrowUpRight,
  Percent,
} from 'lucide-react';

interface LeadsCrmAdminProps {
  onShowToast: (message: string) => void;
}

// Stage definitions with strategic descriptions for marketing beginners
const STAGE_CONFIG: Record<
  FunnelStage,
  {
    title: string;
    subtitle: string;
    color: string;
    bgColor: string;
    borderColor: string;
    badgeBg: string;
    badgeText: string;
    guideWhatToDo: string;
    recommendedActions: string[];
    sampleScript: string;
  }
> = {
  topo: {
    title: '1. Topo / Atração',
    subtitle: 'Visitantes & Novos Contatos',
    color: 'emerald',
    bgColor: 'bg-emerald-950/20',
    borderColor: 'border-emerald-800/40',
    badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    badgeText: 'Atração / Frio',
    guideWhatToDo:
      'Eles acabaram de te conhecer! NÃO tente vender agora para não espantar o lead. Entregue materiais gratuitos (checklist do contracheque, guia de deduções) e aumente a autoridade.',
    recommendedActions: [
      'Enviar material gratuito por e-mail ou WhatsApp',
      'Convidar para seguir no Instagram/LinkedIn',
      'Apresentar como funciona o cálculo de impostos no Québec',
    ],
    sampleScript:
      'Olá {NOME}, vi que você utilizou nossa calculadora de salário no Québec! Preparei um checklist gratuito com os 25 pontos mais importantes do talon de paie para você auditar suas deduções de RRQ e RQAP. Posso te enviar por aqui?',
  },
  meio: {
    title: '2. Meio / Nutrição',
    subtitle: 'Interessados & Em Qualificação',
    color: 'amber',
    bgColor: 'bg-amber-950/20',
    borderColor: 'border-amber-800/40',
    badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    badgeText: 'Nutrição / Morno',
    guideWhatToDo:
      'O lead já reconhece que precisa se planejar no Québec. Mostre estudos de caso práticos, simulações de REER/CELIAPP e dicas de adaptação de currículo para quebrar objeções.',
    recommendedActions: [
      'Enviar simulador de match do REER e restituição',
      'Apresentar modelo de currículo sem preconceito para ATS',
      'Demonstrar quanto ele pode economizar em impostos no ano',
    ],
    sampleScript:
      'Olá {NOME}! Como estão seus planos profissionais no Québec? Muitos profissionais na sua área perdem até 30% do retorno fiscal por não usarem o abatimento de 16,5% e o CELIAPP. Quer uma simulação rápida do seu potencial de restituição?',
  },
  fundo: {
    title: '3. Fundo / Decisão',
    subtitle: 'Oportunidades Prontas para Fechar',
    color: 'rose',
    bgColor: 'bg-rose-950/20',
    borderColor: 'border-rose-800/40',
    badgeBg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    badgeText: 'Decisão / Quente',
    guideWhatToDo:
      'O lead está na reta final da decisão! Ele já clicou no checkout ou pediu informações detalhadas. Ofereça um cupom promocional com prazo limitado e faça contato direto via WhatsApp.',
    recommendedActions: [
      'Chamar no WhatsApp com mensagem personalizada',
      'Oferecer cupom de boas-vindas com prazo (ex: LANCA10)',
      'Tirar dúvidas pontuais sobre o material digital ou consultoria',
    ],
    sampleScript:
      'Oi {NOME}! Notei seu interesse no nosso Guia Definitivo do Salário & Emprego no Québec 2026. Separei um cupom exclusivo de 20% (QUEBEC2026) válido até hoje para você acessar imediatamente todos os 140 tópicos e modelos editáveis de CV. Quer que eu libere o link?',
  },
  cliente: {
    title: '4. Clientes Pagantes',
    subtitle: 'Compradores de E-books & Guias',
    color: 'blue',
    bgColor: 'bg-blue-950/20',
    borderColor: 'border-blue-800/40',
    badgeBg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    badgeText: 'Comprador Ativo',
    guideWhatToDo:
      'Eles já confiaram no seu trabalho e investiram dinheiro! Garanta que baixaram os materiais, colha feedback e ofereça um upgrade para a assinatura mensal ou anual com desconto.',
    recommendedActions: [
      'Conferir se o cliente conseguiu baixar o material',
      'Pedir avaliação ou depoimento para usar no site',
      'Convidar para o Clube de Assinatura VIP com acompanhamento',
    ],
    sampleScript:
      'Olá {NOME}! Passando para saber se você já teve tempo de explorar seu material digital. Conseguiu tirar proveito dos modelos? Caso queira ter acesso ilimitado a todas as novas atualizações e suporte mensal de carreira, tenho uma condição especial para clientes!',
  },
  fidelizado: {
    title: '5. Fidelizados / VIPs',
    subtitle: 'Assinantes Recorrentes & Promotores',
    color: 'purple',
    bgColor: 'bg-purple-950/20',
    borderColor: 'border-purple-800/40',
    badgeBg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    badgeText: 'Assinante VIP',
    guideWhatToDo:
      'Seus clientes mais valiosos (maior LTV)! Mantenha contato frequente, ofereça suporte prioritário, envie atualizações fiscais em primeira mão e incentive indicações de amigos.',
    recommendedActions: [
      'Enviar relatórios fiscais mensais exclusivos',
      'Oferecer canal prioritário de tira-dúvidas',
      'Criar programa de indicação com recompensas em CAD',
    ],
    sampleScript:
      'Olá {NOME}, membro VIP! Acabamos de disponibilizar novas planilhas de declaração de impostos 2026 na sua área de assinante. Como está seu acompanhamento? Estou à disposição caso precise de algo nesta semana!',
  },
};

const SUBSCRIPTION_CONFIG: Record<
  SubscriptionStatus,
  { label: string; badgeClass: string; icon: string }
> = {
  nenhum: {
    label: 'Não Assinante',
    badgeClass: 'bg-slate-800/60 text-slate-400 border-slate-700',
    icon: '—',
  },
  ebook_buyer: {
    label: 'Comprador de E-book',
    badgeClass: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    icon: '📘',
  },
  assinante_mensal: {
    label: 'Assinante VIP Mensal',
    badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-500/40 font-bold',
    icon: '💎',
  },
  membro_anual: {
    label: 'Membro Anual Pro',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold',
    icon: '👑',
  },
  trial: {
    label: 'Período de Testes (Trial)',
    badgeClass: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
    icon: '⏳',
  },
  cancelado: {
    label: 'Ex-Assinante (Cancelado)',
    badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    icon: '⚠️',
  },
};

const SUGGESTED_TAGS = [
  'Calculadora Salário',
  'Interesse E-book',
  'Comprador E-book',
  'Currículo ATS',
  'Entrevistas STAR',
  'Otimização REER',
  'Imigrante Novo',
  'TI / Tech',
  'Engenharia',
  'Saúde / Enfermagem',
  'Assinante VIP',
  'Lead Quente',
];

export function LeadsCrmAdmin({ onShowToast }: LeadsCrmAdminProps) {
  const [leads, setLeads] = useState<NewsletterLead[]>(() => adminStore.getNewsletterLeads());
  const [viewMode, setViewMode] = useState<'pipeline' | 'table'>('pipeline');
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [temperatureFilter, setTemperatureFilter] = useState<string>('all');
  const [subscriptionFilter, setSubscriptionFilter] = useState<string>('all');
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [showCopilotGuide, setShowCopilotGuide] = useState(true);

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<NewsletterLead | null>(null);
  const [isScriptsModalOpen, setIsScriptsModalOpen] = useState(false);
  const [activeScriptStage, setActiveScriptStage] = useState<FunnelStage>('fundo');
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<NewsletterLead | null>(null);

  // Campaign State
  const [campaignTarget, setCampaignTarget] = useState<string>('all');
  const [campaignSubject, setCampaignSubject] = useState('');
  const [campaignBody, setCampaignBody] = useState('');
  const [isSendingCampaign, setIsSendingCampaign] = useState(false);

  // Form State
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formCompanyOrRole, setFormCompanyOrRole] = useState('');
  const [formSource, setFormSource] = useState('home_banner');
  const [formFunnelStage, setFormFunnelStage] = useState<FunnelStage>('topo');
  const [formScore, setFormScore] = useState<number>(35);
  const [formTemperature, setFormTemperature] = useState<LeadTemperature>('frio');
  const [formSubscriptionStatus, setFormSubscriptionStatus] = useState<SubscriptionStatus>('nenhum');
  const [formSubscribedPlanName, setFormSubscribedPlanName] = useState('');
  const [formSubscriptionRenewalDate, setFormSubscriptionRenewalDate] = useState('');
  const [formLifetimeValueCad, setFormLifetimeValueCad] = useState<number>(0);
  const [formTags, setFormTags] = useState<string[]>([]);
  const [formTagInput, setFormTagInput] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formNewInteractionNote, setFormNewInteractionNote] = useState('');

  // Refresh data from store
  const refreshLeads = () => {
    setLeads(adminStore.getNewsletterLeads());
  };

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = (lead.name || '').toLowerCase().includes(q);
        const matchesEmail = lead.email.toLowerCase().includes(q);
        const matchesPhone = (lead.phone || '').toLowerCase().includes(q);
        const matchesRole = (lead.companyOrRole || '').toLowerCase().includes(q);
        const matchesTag = (lead.tags || []).some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesEmail && !matchesPhone && !matchesRole && !matchesTag) {
          return false;
        }
      }
      // Stage
      if (stageFilter !== 'all' && lead.funnelStage !== stageFilter) {
        return false;
      }
      // Temperature
      if (temperatureFilter !== 'all' && lead.temperature !== temperatureFilter) {
        return false;
      }
      // Subscription
      if (subscriptionFilter !== 'all' && lead.subscriptionStatus !== subscriptionFilter) {
        return false;
      }
      return true;
    });
  }, [leads, searchQuery, stageFilter, temperatureFilter, subscriptionFilter]);

  // Overall Strategic Metrics
  const metrics = useMemo(() => {
    const total = leads.length;
    const hotLeads = leads.filter((l) => l.temperature === 'quente' || l.funnelStage === 'fundo').length;
    const activeSubscribers = leads.filter(
      (l) => l.subscriptionStatus === 'assinante_mensal' || l.subscriptionStatus === 'membro_anual'
    ).length;
    const totalCustomers = leads.filter(
      (l) =>
        l.funnelStage === 'cliente' ||
        l.funnelStage === 'fidelizado' ||
        l.subscriptionStatus === 'ebook_buyer' ||
        l.subscriptionStatus === 'assinante_mensal' ||
        l.subscriptionStatus === 'membro_anual'
    ).length;
    const totalLtvCad = leads.reduce((acc, l) => acc + (l.lifetimeValueCad || 0), 0);
    const conversionRate = total > 0 ? ((totalCustomers / total) * 100).toFixed(1) : '0';

    return {
      total,
      hotLeads,
      activeSubscribers,
      totalCustomers,
      totalLtvCad,
      conversionRate,
    };
  }, [leads]);

  // Open Form Modal (Add or Edit)
  const handleOpenCreateModal = (stagePreset?: FunnelStage) => {
    setEditingLead(null);
    setFormName('');
    setFormEmail('');
    setFormPhone('');
    setFormCompanyOrRole('');
    setFormSource('manual');
    setFormFunnelStage(stagePreset || 'topo');
    setFormScore(stagePreset === 'fundo' ? 80 : stagePreset === 'meio' ? 55 : 30);
    setFormTemperature(stagePreset === 'fundo' ? 'quente' : stagePreset === 'meio' ? 'morno' : 'frio');
    setFormSubscriptionStatus('nenhum');
    setFormSubscribedPlanName('');
    setFormSubscriptionRenewalDate('');
    setFormLifetimeValueCad(0);
    setFormTags(['Manual']);
    setFormTagInput('');
    setFormNotes('');
    setFormNewInteractionNote('');
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (lead: NewsletterLead) => {
    setEditingLead(lead);
    setFormName(lead.name || '');
    setFormEmail(lead.email);
    setFormPhone(lead.phone || '');
    setFormCompanyOrRole(lead.companyOrRole || '');
    setFormSource(lead.source || 'manual');
    setFormFunnelStage(lead.funnelStage || 'topo');
    setFormScore(lead.score || 30);
    setFormTemperature(lead.temperature || 'frio');
    setFormSubscriptionStatus(lead.subscriptionStatus || 'nenhum');
    setFormSubscribedPlanName(lead.subscribedPlanName || '');
    setFormSubscriptionRenewalDate(lead.subscriptionRenewalDate || '');
    setFormLifetimeValueCad(lead.lifetimeValueCad || 0);
    setFormTags(lead.tags || []);
    setFormTagInput('');
    setFormNotes(lead.notes || '');
    setFormNewInteractionNote('');
    setIsFormModalOpen(true);
  };

  // Save Lead (Add or Update)
  const handleSaveLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formEmail.trim() || !formEmail.includes('@')) {
      onShowToast('Por favor, informe um endereço de e-mail válido.');
      return;
    }

    const currentInteractions = editingLead?.interactions ? [...editingLead.interactions] : [];
    if (formNewInteractionNote.trim()) {
      currentInteractions.unshift({
        id: `int-${Date.now()}`,
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        type: 'note',
        description: formNewInteractionNote.trim(),
        author: 'Admin / Consultor',
      });
    }

    const leadData: NewsletterLead = {
      id: editingLead ? editingLead.id : `lead-${Date.now()}`,
      email: formEmail.trim(),
      name: formName.trim() || formEmail.split('@')[0],
      phone: formPhone.trim(),
      companyOrRole: formCompanyOrRole.trim(),
      source: formSource,
      date: editingLead ? editingLead.date : new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: editingLead ? editingLead.status : 'subscribed',
      funnelStage: formFunnelStage,
      score: Number(formScore),
      temperature: formTemperature,
      subscriptionStatus: formSubscriptionStatus,
      subscribedPlanName: formSubscribedPlanName.trim(),
      subscriptionRenewalDate: formSubscriptionRenewalDate,
      lifetimeValueCad: Number(formLifetimeValueCad),
      tags: formTags,
      notes: formNotes.trim(),
      interactions: currentInteractions,
      lastContactDate: new Date().toISOString().split('T')[0],
    };

    adminStore.saveNewsletterLead(leadData);
    refreshLeads();
    setIsFormModalOpen(false);
    onShowToast(editingLead ? 'Lead atualizado com sucesso!' : 'Novo lead cadastrado com sucesso!');
  };

  // Quick Change Stage
  const handleMoveStage = (lead: NewsletterLead, direction: 'next' | 'prev') => {
    const stages: FunnelStage[] = ['topo', 'meio', 'fundo', 'cliente', 'fidelizado'];
    const currentIndex = stages.indexOf(lead.funnelStage);
    if (currentIndex === -1) return;

    const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (newIndex >= 0 && newIndex < stages.length) {
      const nextStage = stages[newIndex];
      const scoreDelta = direction === 'next' ? 15 : -15;
      const nextScore = Math.max(0, Math.min(100, (lead.score || 30) + scoreDelta));
      const nextTemp: LeadTemperature =
        nextScore >= 90 ? 'vip' : nextScore >= 75 ? 'quente' : nextScore >= 50 ? 'morno' : 'frio';

      adminStore.updateNewsletterLead(lead.id, {
        funnelStage: nextStage,
        score: nextScore,
        temperature: nextTemp,
      });

      adminStore.addLeadInteraction(lead.id, {
        type: 'stage_change',
        description: `Etapa alterada para ${STAGE_CONFIG[nextStage].title} (${direction === 'next' ? 'Avanço' : 'Retrocesso'})`,
      });

      refreshLeads();
      onShowToast(`Lead movido para: ${STAGE_CONFIG[nextStage].title}`);
    }
  };

  // Quick WhatsApp Chat
  const handleOpenWhatsApp = (lead: NewsletterLead) => {
    if (!lead.phone) {
      onShowToast('Este lead ainda não tem telefone cadastrado. Clique em editar para adicionar.');
      return;
    }
    const cleanPhone = lead.phone.replace(/\D/g, '');
    const scriptTemplate = STAGE_CONFIG[lead.funnelStage]?.sampleScript || '';
    const personalizedMessage = scriptTemplate.replace('{NOME}', lead.name || 'amigo(a)');
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(personalizedMessage)}`;
    window.open(url, '_blank');
  };

  // Delete Lead
  const handleConfirmDelete = () => {
    if (!leadToDelete) return;
    adminStore.removeNewsletterLead(leadToDelete.id);
    refreshLeads();
    setIsDeleteModalOpen(false);
    setLeadToDelete(null);
    onShowToast('Lead removido com sucesso da base.');
  };

  // Bulk Actions
  const handleBulkStageChange = (newStage: FunnelStage) => {
    if (!selectedLeadIds.length) return;
    adminStore.bulkUpdateNewsletterLeads(selectedLeadIds, { funnelStage: newStage });
    refreshLeads();
    setSelectedLeadIds([]);
    onShowToast(`${selectedLeadIds.length} leads movidos para ${STAGE_CONFIG[newStage].title}!`);
  };

  const handleBulkSubscriptionChange = (newStatus: SubscriptionStatus) => {
    if (!selectedLeadIds.length) return;
    adminStore.bulkUpdateNewsletterLeads(selectedLeadIds, { subscriptionStatus: newStatus });
    refreshLeads();
    setSelectedLeadIds([]);
    onShowToast(`Status de assinatura atualizado para ${selectedLeadIds.length} leads!`);
  };

  const handleBulkDelete = () => {
    if (!selectedLeadIds.length) return;
    if (confirm(`Tem certeza que deseja excluir ${selectedLeadIds.length} leads selecionados?`)) {
      adminStore.bulkDeleteNewsletterLeads(selectedLeadIds);
      refreshLeads();
      setSelectedLeadIds([]);
      onShowToast('Leads selecionados excluídos com sucesso.');
    }
  };

  // Export CSV
  const handleExportCsv = () => {
    const csvContent = adminStore.exportLeadsCsv();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `leads-crm-paienet-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast('Arquivo CSV com todos os dados e CRM gerado com sucesso!');
  };

  // Reset to default rich data
  const handleResetSampleData = () => {
    if (confirm('Deseja restaurar a base de exemplo com leads qualificados em todas as etapas do funil?')) {
      adminStore.resetLeadsToDefault();
      refreshLeads();
      onShowToast('Base restaurada com dados de exemplo completos!');
    }
  };

  // Add Tag
  const handleAddTag = () => {
    if (!formTagInput.trim()) return;
    const tag = formTagInput.trim();
    if (!formTags.includes(tag)) {
      setFormTags([...formTags, tag]);
    }
    setFormTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormTags(formTags.filter((t) => t !== tagToRemove));
  };

  // Toggle selection
  const handleToggleSelectAll = () => {
    if (selectedLeadIds.length === filteredLeads.length) {
      setSelectedLeadIds([]);
    } else {
      setSelectedLeadIds(filteredLeads.map((l) => l.id));
    }
  };

  const handleToggleSelectLead = (leadId: string) => {
    if (selectedLeadIds.includes(leadId)) {
      setSelectedLeadIds(selectedLeadIds.filter((id) => id !== leadId));
    } else {
      setSelectedLeadIds([...selectedLeadIds, leadId]);
    }
  };

  // Campaign templates
  const handleSelectCampaignTemplate = (type: 'welcome' | 'coupon' | 'tax_tip' | 'vip_invite') => {
    if (type === 'welcome') {
      setCampaignSubject('Seu checklist de contracheque do Québec chegou! 🍁');
      setCampaignBody(
        `Olá {NOME},\n\nObrigado por utilizar o PaieNet.qc! Em anexo você encontra o checklist com os 25 itens para conferir no seu primeiro talon de paie.\n\nFique atento aos descontos de RRQ, RQAP e o Abatimento de 16,5%.\n\nQualquer dúvida, responda a este e-mail!\n\nEquipe PaieNet.qc`
      );
    } else if (type === 'coupon') {
      setCampaignSubject('🔥 Cupom Exclusivo de 20% no Guia Definitivo do Salário 2026');
      setCampaignBody(
        `Olá {NOME},\n\nPara ajudar na sua adaptação profissional e fiscal no Québec, liberamos um cupom de 20% OFF no nosso Guia Oficial de 140 páginas.\n\nUse o código: QUEBEC2026 no checkout!\n\nAproveite, o cupom é válido apenas nas próximas 48 horas.\n\nAbraços,\nEquipe PaieNet.qc`
      );
    } else if (type === 'tax_tip') {
      setCampaignSubject('💡 Dica Fiscal: Como economizar até $2.000 CAD com REER e CELIAPP');
      setCampaignBody(
        `Olá {NOME},\n\nVocê sabia que cotizar no REER reduz diretamente sua alíquota marginal no Québec?\n\nPublicamos um guia prático com simulador de match do empregador para você não deixar dinheiro na mesa.\n\nConfira em nosso portal!\n\nEquipe PaieNet.qc`
      );
    } else if (type === 'vip_invite') {
      setCampaignSubject('💎 Convite Especial: Entre para o Clube de Assinantes VIP');
      setCampaignBody(
        `Olá {NOME},\n\nComo você já acompanha nosso portal, queremos convidá-lo com exclusividade para o nosso Clube Mensal VIP.\n\nVocê terá acesso a simulações de entrevistas com feedback, revisões de currículo ATS e consultoria fiscal contínua.\n\nConheça mais detalhes respondendo a este e-mail!`);
    }
  };

  // Simulate Sending Campaign
  const handleSendCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignSubject.trim() || !campaignBody.trim()) {
      onShowToast('Preencha o assunto e o corpo do e-mail.');
      return;
    }

    setIsSendingCampaign(true);
    setTimeout(() => {
      setIsSendingCampaign(false);
      setIsCampaignModalOpen(false);

      // Target count
      let recipientCount = leads.length;
      if (campaignTarget === 'topo') recipientCount = leads.filter((l) => l.funnelStage === 'topo').length;
      if (campaignTarget === 'meio') recipientCount = leads.filter((l) => l.funnelStage === 'meio').length;
      if (campaignTarget === 'fundo') recipientCount = leads.filter((l) => l.funnelStage === 'fundo').length;
      if (campaignTarget === 'cliente') recipientCount = leads.filter((l) => l.funnelStage === 'cliente').length;
      if (campaignTarget === 'fidelizado') recipientCount = leads.filter((l) => l.funnelStage === 'fidelizado').length;
      if (campaignTarget === 'subscribers') {
        recipientCount = leads.filter(
          (l) => l.subscriptionStatus === 'assinante_mensal' || l.subscriptionStatus === 'membro_anual'
        ).length;
      }

      adminStore.logEvent({
        id: `evt-${Date.now()}`,
        timestamp: 'Agora mesmo',
        type: 'newsletter_signup',
        summary: `Disparo de Campanha: "${campaignSubject}"`,
        location: 'Servidor PaieNet.qc',
        details: `Enviado para ${recipientCount} destinatários (Segmento: ${campaignTarget})`,
      });

      onShowToast(`🎉 Campanha disparada com sucesso para ${recipientCount} destinatários!`);
      setCampaignSubject('');
      setCampaignBody('');
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP STRATEGIC KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Total de Leads</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-white">{metrics.total}</div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
              <span className="text-emerald-400 font-bold">100%</span> da base registrada
            </div>
          </div>
        </div>

        <div className="bg-slate-950/80 p-4 rounded-2xl border border-rose-900/30 bg-rose-950/10 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-rose-300">
            <span className="text-xs font-semibold">Leads Quentes 🔥</span>
            <Flame className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-white">{metrics.hotLeads}</div>
            <div className="text-[11px] text-rose-300/80 flex items-center gap-1 mt-0.5">
              Prontos para fechar vendas
            </div>
          </div>
        </div>

        <div className="bg-slate-950/80 p-4 rounded-2xl border border-blue-900/30 bg-blue-950/10 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-blue-300">
            <span className="text-xs font-semibold">Clientes Pagantes</span>
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-white">{metrics.totalCustomers}</div>
            <div className="text-[11px] text-blue-300/80 flex items-center gap-1 mt-0.5">
              Compradores de infoprodutos
            </div>
          </div>
        </div>

        <div className="bg-slate-950/80 p-4 rounded-2xl border border-purple-900/30 bg-purple-950/10 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-purple-300">
            <span className="text-xs font-semibold">Assinantes VIP 💎</span>
            <Crown className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-white">{metrics.activeSubscribers}</div>
            <div className="text-[11px] text-purple-300/80 flex items-center gap-1 mt-0.5">
              Recorrência mensal/anual
            </div>
          </div>
        </div>

        <div className="col-span-2 lg:col-span-1 bg-slate-950/80 p-4 rounded-2xl border border-emerald-900/30 bg-emerald-950/10 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-emerald-300">
            <span className="text-xs font-semibold">LTV Acumulado</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-emerald-400">
              ${metrics.totalLtvCad.toFixed(2)} <span className="text-xs font-normal text-emerald-500">CAD</span>
            </div>
            <div className="text-[11px] text-emerald-400/80 flex items-center gap-1 mt-0.5">
              Taxa de conversão: <strong className="text-white">{metrics.conversionRate}%</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 2. COPILOTO ESTRATÉGICO DE MARKETING DIGITAL (EXPLICATIVO PARA LEIGOS) */}
      <div className="bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-purple-950/40 rounded-2xl border border-blue-800/40 overflow-hidden shadow-lg">
        <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/30">
              <Lightbulb className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">Copiloto Estratégico de Marketing Digital</h3>
                <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 text-[10px] font-semibold rounded-full border border-blue-500/30">
                  Guia Simplificado
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Não sabe o que fazer com cada lead? Siga o passo a passo de cada etapa do funil sem complicação.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => {
                setActiveScriptStage('fundo');
                setIsScriptsModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-blue-300 text-xs font-medium rounded-xl border border-slate-700 transition cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5 text-blue-400" />
              <span>Ver Scripts Prontos de Contato</span>
            </button>
            <button
              type="button"
              onClick={() => setShowCopilotGuide(!showCopilotGuide)}
              className="text-xs text-slate-400 hover:text-white px-2 py-1.5 transition cursor-pointer"
            >
              {showCopilotGuide ? 'Ocultar Dicas ▲' : 'Mostrar Dicas ▼'}
            </button>
          </div>
        </div>

        {showCopilotGuide && (
          <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 border-t border-slate-800/80 mt-1">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-3">
              {(['topo', 'meio', 'fundo', 'cliente', 'fidelizado'] as FunnelStage[]).map((stg) => {
                const cfg = STAGE_CONFIG[stg];
                return (
                  <div
                    key={stg}
                    className={`p-3 rounded-xl border ${cfg.borderColor} ${cfg.bgColor} flex flex-col justify-between`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-white">{cfg.title}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold border ${cfg.badgeBg}`}>
                          {cfg.badgeText}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">{cfg.guideWhatToDo}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveScriptStage(stg);
                        setIsScriptsModalOpen(true);
                      }}
                      className="mt-3 text-[11px] font-medium text-blue-300 hover:text-blue-200 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Usar roteiro sugerido</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 3. TOOLBAR, FILTERS & ACTION BUTTONS */}
      <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          {/* Mode Switcher */}
          <div className="inline-flex p-1 bg-slate-900 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setViewMode('pipeline')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'pipeline'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Funil Kanban</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'table'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Lista / Tabela Detalhada</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nome, email, tag..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Filters */}
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="all">Todas as Etapas</option>
            <option value="topo">1. Topo (Atração)</option>
            <option value="meio">2. Meio (Nutrição)</option>
            <option value="fundo">3. Fundo (Decisão)</option>
            <option value="cliente">4. Clientes</option>
            <option value="fidelizado">5. Fidelizados / VIP</option>
          </select>

          <select
            value={subscriptionFilter}
            onChange={(e) => setSubscriptionFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="all">Todos os Status de Assinatura</option>
            <option value="nenhum">Não Assinantes</option>
            <option value="ebook_buyer">Compradores de E-book</option>
            <option value="assinante_mensal">Assinantes VIP Mensais</option>
            <option value="membro_anual">Membros Anuais</option>
            <option value="trial">Período de Testes (Trial)</option>
            <option value="cancelado">Cancelados</option>
          </select>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsCampaignModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 text-xs font-semibold rounded-xl transition cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 text-indigo-400" />
            <span>Disparar Campanha / E-mail</span>
          </button>

          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold rounded-xl transition cursor-pointer"
            title="Exportar base completa para CSV (Excel / CRM)"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Exportar CSV</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenCreateModal()}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Lead</span>
          </button>
        </div>
      </div>

      {/* 4. BULK ACTIONS BAR (SHOWS WHEN LEADS ARE CHECKED) */}
      {selectedLeadIds.length > 0 && (
        <div className="bg-blue-950/80 border border-blue-600/50 p-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
              {selectedLeadIds.length}
            </span>
            <span className="text-xs font-bold text-white">leads selecionados para ação em massa</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 mr-1">Mover para:</span>
            <button
              type="button"
              onClick={() => handleBulkStageChange('topo')}
              className="px-2 py-1 bg-emerald-950/60 hover:bg-emerald-800 text-emerald-300 border border-emerald-700/50 rounded-lg text-xs cursor-pointer"
            >
              1. Topo
            </button>
            <button
              type="button"
              onClick={() => handleBulkStageChange('meio')}
              className="px-2 py-1 bg-amber-950/60 hover:bg-amber-800 text-amber-300 border border-amber-700/50 rounded-lg text-xs cursor-pointer"
            >
              2. Meio
            </button>
            <button
              type="button"
              onClick={() => handleBulkStageChange('fundo')}
              className="px-2 py-1 bg-rose-950/60 hover:bg-rose-800 text-rose-300 border border-rose-700/50 rounded-lg text-xs cursor-pointer"
            >
              3. Fundo
            </button>
            <button
              type="button"
              onClick={() => handleBulkStageChange('cliente')}
              className="px-2 py-1 bg-blue-950/60 hover:bg-blue-800 text-blue-300 border border-blue-700/50 rounded-lg text-xs cursor-pointer"
            >
              4. Cliente
            </button>
            <button
              type="button"
              onClick={() => handleBulkStageChange('fidelizado')}
              className="px-2 py-1 bg-purple-950/60 hover:bg-purple-800 text-purple-300 border border-purple-700/50 rounded-lg text-xs cursor-pointer"
            >
              5. Fidelizado
            </button>

            <div className="h-4 w-[1px] bg-slate-700 mx-1" />

            <button
              type="button"
              onClick={handleBulkDelete}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-900/60 hover:bg-rose-700 text-rose-200 border border-rose-600/50 rounded-lg text-xs cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              <span>Excluir</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedLeadIds([])}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 cursor-pointer"
            >
              Desmarcar
            </button>
          </div>
        </div>
      )}

      {/* 5. VIEW MODE: PIPELINE / FUNIL KANBAN */}
      {viewMode === 'pipeline' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
          {(['topo', 'meio', 'fundo', 'cliente', 'fidelizado'] as FunnelStage[]).map((stageKey) => {
            const stageConfig = STAGE_CONFIG[stageKey];
            const stageLeads = filteredLeads.filter((l) => l.funnelStage === stageKey);

            return (
              <div
                key={stageKey}
                className="bg-slate-950/60 rounded-2xl border border-slate-800/80 flex flex-col min-h-[580px] overflow-hidden"
              >
                {/* Column Header */}
                <div className={`p-3 border-b ${stageConfig.borderColor} ${stageConfig.bgColor}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white tracking-wide">{stageConfig.title}</h4>
                      <p className="text-[10px] text-slate-400">{stageConfig.subtitle}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-slate-900/80 text-white font-mono font-bold text-xs border border-slate-700">
                      {stageLeads.length}
                    </span>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleOpenCreateModal(stageKey)}
                      className="text-[11px] text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Adicionar Lead</span>
                    </button>
                    <span className="text-[10px] text-slate-400">
                      {metrics.total > 0
                        ? `${((stageLeads.length / metrics.total) * 100).toFixed(0)}% da base`
                        : '0%'}
                    </span>
                  </div>
                </div>

                {/* Column Cards List */}
                <div className="p-2.5 space-y-2.5 flex-1 overflow-y-auto max-h-[750px]">
                  {stageLeads.length === 0 ? (
                    <div className="h-40 flex flex-col items-center justify-center text-center p-4 border border-dashed border-slate-800/70 rounded-xl">
                      <p className="text-xs text-slate-500">Nenhum lead nesta etapa no momento.</p>
                      <button
                        type="button"
                        onClick={() => handleOpenCreateModal(stageKey)}
                        className="mt-2 text-xs text-blue-400 hover:text-blue-300 font-medium cursor-pointer"
                      >
                        + Cadastrar agora
                      </button>
                    </div>
                  ) : (
                    stageLeads.map((lead) => {
                      const subCfg = SUBSCRIPTION_CONFIG[lead.subscriptionStatus || 'nenhum'];

                      return (
                        <div
                          key={lead.id}
                          className="bg-slate-900/90 hover:bg-slate-900 p-3 rounded-xl border border-slate-800 hover:border-slate-700 transition shadow-sm space-y-2.5 group relative"
                        >
                          {/* Card Header: Name, Score & Temperature */}
                          <div className="flex items-start justify-between gap-1">
                            <div className="min-w-0">
                              <h5 className="text-xs font-bold text-white truncate">{lead.name || lead.email}</h5>
                              {lead.companyOrRole && (
                                <p className="text-[10px] text-slate-400 truncate">{lead.companyOrRole}</p>
                              )}
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              {lead.temperature === 'vip' && (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[9px] font-bold">
                                  <Crown className="w-2.5 h-2.5 text-purple-400" />
                                  <span>VIP</span>
                                </span>
                              )}
                              {lead.temperature === 'quente' && (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[9px] font-bold">
                                  <Flame className="w-2.5 h-2.5 text-rose-400" />
                                  <span>Quente</span>
                                </span>
                              )}
                              {lead.temperature === 'morno' && (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px]">
                                  <Sun className="w-2.5 h-2.5 text-amber-400" />
                                  <span>Morno</span>
                                </span>
                              )}
                              {lead.temperature === 'frio' && (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[9px]">
                                  <Snowflake className="w-2.5 h-2.5 text-blue-400" />
                                  <span>Frio</span>
                                </span>
                              )}

                              <span className="font-mono text-[10px] font-bold text-slate-300 bg-slate-800 px-1 py-0.5 rounded">
                                {lead.score}pts
                              </span>
                            </div>
                          </div>

                          {/* Email & Phone */}
                          <div className="space-y-1 text-[11px] text-slate-300">
                            <div className="truncate text-slate-400 flex items-center gap-1.5">
                              <Mail className="w-3 h-3 text-slate-500 shrink-0" />
                              <span className="truncate">{lead.email}</span>
                            </div>

                            {lead.phone ? (
                              <div className="flex items-center justify-between text-slate-300">
                                <span className="flex items-center gap-1.5 font-mono text-[10px]">
                                  <Phone className="w-3 h-3 text-slate-500 shrink-0" />
                                  <span>{lead.phone}</span>
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleOpenWhatsApp(lead)}
                                  className="text-[10px] text-emerald-400 hover:text-emerald-300 font-bold inline-flex items-center gap-1 cursor-pointer"
                                  title="Iniciar conversa no WhatsApp com roteiro pronto"
                                >
                                  <MessageCircle className="w-3 h-3" />
                                  <span>WhatsApp</span>
                                </button>
                              </div>
                            ) : (
                              <div className="text-[10px] text-slate-500 italic">Sem telefone cadastrado</div>
                            )}
                          </div>

                          {/* Subscription Status Badge */}
                          <div className="pt-1 border-t border-slate-800/80 flex items-center justify-between">
                            <span
                              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-[9px] ${subCfg.badgeClass}`}
                            >
                              <span>{subCfg.icon}</span>
                              <span className="truncate max-w-[130px]">{subCfg.label}</span>
                            </span>

                            {lead.lifetimeValueCad !== undefined && lead.lifetimeValueCad > 0 && (
                              <span className="text-[10px] font-bold text-emerald-400">
                                ${lead.lifetimeValueCad.toFixed(2)} CAD
                              </span>
                            )}
                          </div>

                          {/* Tags */}
                          {lead.tags && lead.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-0.5">
                              {lead.tags.slice(0, 3).map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="px-1.5 py-0.5 bg-slate-800 text-slate-400 text-[9px] rounded-md font-medium truncate max-w-[110px]"
                                >
                                  #{tag}
                                </span>
                              ))}
                              {lead.tags.length > 3 && (
                                <span className="text-[9px] text-slate-500">+{lead.tags.length - 3}</span>
                              )}
                            </div>
                          )}

                          {/* Notes snippet if present */}
                          {lead.notes && (
                            <p className="text-[10px] text-slate-400 bg-slate-950/60 p-1.5 rounded-lg border border-slate-800/80 line-clamp-2 italic">
                              &ldquo;{lead.notes}&rdquo;
                            </p>
                          )}

                          {/* Card Footer: Step Navigator & Actions */}
                          <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-1">
                            <div className="flex items-center gap-1">
                              {stageKey !== 'topo' && (
                                <button
                                  type="button"
                                  onClick={() => handleMoveStage(lead, 'prev')}
                                  className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded transition cursor-pointer"
                                  title="Retroceder etapa"
                                >
                                  <ArrowLeft className="w-3 h-3" />
                                </button>
                              )}

                              {stageKey !== 'fidelizado' && (
                                <button
                                  type="button"
                                  onClick={() => handleMoveStage(lead, 'next')}
                                  className="p-1 hover:bg-blue-600/30 text-blue-400 hover:text-blue-300 rounded transition cursor-pointer flex items-center gap-0.5 text-[10px] font-bold"
                                  title="Avançar etapa no funil"
                                >
                                  <span>Avançar</span>
                                  <ArrowRight className="w-3 h-3" />
                                </button>
                              )}
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleOpenEditModal(lead)}
                                className="p-1 text-slate-400 hover:text-blue-300 rounded hover:bg-slate-800 transition cursor-pointer"
                                title="Editar dados completos do lead"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setLeadToDelete(lead);
                                  setIsDeleteModalOpen(true);
                                }}
                                className="p-1 text-slate-500 hover:text-rose-400 rounded hover:bg-slate-800 transition cursor-pointer"
                                title="Excluir lead"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 6. VIEW MODE: DETAILED TABLE */}
      {viewMode === 'table' && (
        <div className="bg-slate-950/80 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800 text-[10px]">
                <tr>
                  <th className="p-3 w-8">
                    <input
                      type="checkbox"
                      checked={
                        filteredLeads.length > 0 && selectedLeadIds.length === filteredLeads.length
                      }
                      onChange={handleToggleSelectAll}
                      className="rounded bg-slate-800 border-slate-700 text-blue-600 cursor-pointer"
                    />
                  </th>
                  <th className="p-3.5">Nome / Contato</th>
                  <th className="p-3.5">Funil & Temperatura</th>
                  <th className="p-3.5">Score (Qualificação)</th>
                  <th className="p-3.5">Status de Assinatura</th>
                  <th className="p-3.5">LTV (Total Investido)</th>
                  <th className="p-3.5">Tags & Interesses</th>
                  <th className="p-3.5">Origem / Data</th>
                  <th className="p-3.5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-slate-500">
                      Nenhum lead encontrado com os filtros aplicados.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => {
                    const isSelected = selectedLeadIds.includes(lead.id);
                    const subCfg = SUBSCRIPTION_CONFIG[lead.subscriptionStatus || 'nenhum'];
                    const stageCfg = STAGE_CONFIG[lead.funnelStage || 'topo'];

                    return (
                      <tr
                        key={lead.id}
                        className={`hover:bg-slate-900/60 transition-colors ${
                          isSelected ? 'bg-blue-950/20' : ''
                        }`}
                      >
                        <td className="p-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelectLead(lead.id)}
                            className="rounded bg-slate-800 border-slate-700 text-blue-600 cursor-pointer"
                          />
                        </td>

                        {/* Contact details */}
                        <td className="p-3.5">
                          <div className="font-bold text-white text-xs">{lead.name || 'Lead Anônimo'}</div>
                          <div className="text-slate-400 text-[11px]">{lead.email}</div>
                          {lead.phone && (
                            <div className="text-[10px] text-emerald-400 font-mono mt-0.5 flex items-center gap-1">
                              <Phone className="w-2.5 h-2.5" />
                              <span>{lead.phone}</span>
                            </div>
                          )}
                          {lead.companyOrRole && (
                            <div className="text-[10px] text-slate-500 italic mt-0.5">{lead.companyOrRole}</div>
                          )}
                        </td>

                        {/* Funnel & Temp */}
                        <td className="p-3.5">
                          <div className="space-y-1">
                            <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold border ${stageCfg.badgeBg}`}>
                              {stageCfg.title}
                            </span>
                            <div className="flex items-center gap-1 text-[10px]">
                              {lead.temperature === 'vip' && (
                                <span className="text-purple-400 font-bold flex items-center gap-1">
                                  <Crown className="w-3 h-3" /> VIP
                                </span>
                              )}
                              {lead.temperature === 'quente' && (
                                <span className="text-rose-400 font-bold flex items-center gap-1">
                                  <Flame className="w-3 h-3" /> Quente
                                </span>
                              )}
                              {lead.temperature === 'morno' && (
                                <span className="text-amber-400 flex items-center gap-1">
                                  <Sun className="w-3 h-3" /> Morno
                                </span>
                              )}
                              {lead.temperature === 'frio' && (
                                <span className="text-blue-400 flex items-center gap-1">
                                  <Snowflake className="w-3 h-3" /> Frio
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Score */}
                        <td className="p-3.5">
                          <div className="w-24">
                            <div className="flex items-center justify-between text-[11px] font-bold text-white mb-1">
                              <span>{lead.score}</span>
                              <span className="text-[9px] text-slate-500">/ 100</span>
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  lead.score >= 80
                                    ? 'bg-rose-500'
                                    : lead.score >= 50
                                    ? 'bg-amber-400'
                                    : 'bg-blue-400'
                                }`}
                                style={{ width: `${lead.score}%` }}
                              />
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              <button
                                type="button"
                                onClick={() => {
                                  const newScore = Math.max(0, lead.score - 5);
                                  adminStore.updateNewsletterLead(lead.id, { score: newScore });
                                  refreshLeads();
                                }}
                                className="px-1 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[9px] cursor-pointer"
                                title="Reduzir 5 pontos"
                              >
                                -5
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const newScore = Math.min(100, lead.score + 5);
                                  adminStore.updateNewsletterLead(lead.id, { score: newScore });
                                  refreshLeads();
                                }}
                                className="px-1 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[9px] cursor-pointer"
                                title="Aumentar 5 pontos"
                              >
                                +5
                              </button>
                            </div>
                          </div>
                        </td>

                        {/* Subscription */}
                        <td className="p-3.5">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] ${subCfg.badgeClass}`}
                          >
                            <span>{subCfg.icon}</span>
                            <span>{subCfg.label}</span>
                          </span>
                          {lead.subscribedPlanName && (
                            <div className="text-[10px] text-slate-400 mt-1 truncate max-w-[150px]">
                              {lead.subscribedPlanName}
                            </div>
                          )}
                          {lead.subscriptionRenewalDate && (
                            <div className="text-[9px] text-slate-500">Renova: {lead.subscriptionRenewalDate}</div>
                          )}
                        </td>

                        {/* LTV */}
                        <td className="p-3.5">
                          <span className="font-bold text-white font-mono">
                            ${(lead.lifetimeValueCad || 0).toFixed(2)}{' '}
                            <span className="text-[10px] font-normal text-slate-500">CAD</span>
                          </span>
                        </td>

                        {/* Tags */}
                        <td className="p-3.5">
                          <div className="flex flex-wrap gap-1 max-w-[180px]">
                            {(lead.tags || []).map((tag, i) => (
                              <span
                                key={i}
                                className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px]"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* Origin & Date */}
                        <td className="p-3.5 text-slate-400 text-[11px]">
                          <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-300 font-mono text-[10px] block w-fit mb-0.5">
                            {lead.source}
                          </span>
                          <span className="font-mono text-[10px]">{lead.date}</span>
                        </td>

                        {/* Actions */}
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {lead.phone && (
                              <button
                                type="button"
                                onClick={() => handleOpenWhatsApp(lead)}
                                className="p-1.5 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/30 rounded-lg transition cursor-pointer"
                                title="Chamar no WhatsApp com roteiro pronto"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(lead)}
                              className="p-1.5 text-slate-400 hover:text-blue-300 hover:bg-slate-800 rounded-lg transition cursor-pointer"
                              title="Editar Lead"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setLeadToDelete(lead);
                                setIsDeleteModalOpen(true);
                              }}
                              className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition cursor-pointer"
                              title="Excluir Lead"
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

          <div className="p-3 bg-slate-900/60 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Exibindo {filteredLeads.length} de {leads.length} leads</span>
            <button
              type="button"
              onClick={handleResetSampleData}
              className="text-xs text-blue-400 hover:text-blue-300 cursor-pointer flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Restaurar Amostra Completa de Leads</span>
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 1: ADD OR EDIT LEAD (CRUD) */}
      {/* ============================================================ */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
                  {editingLead ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {editingLead ? 'Editar Dados do Lead CRM' : 'Cadastrar Novo Lead'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Defina qualificação no funil, pontuação de score e status de assinatura.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLead} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* SECTION: Personal & Contact */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  <span>1. Dados Pessoais & Contato</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-300 font-semibold mb-1">Nome Completo</label>
                    <input
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="Ex: Jean Tremblay"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                      E-mail <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder="jean.tremblay@gmail.com"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                      Telefone / WhatsApp (com DDI)
                    </label>
                    <input
                      type="text"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      placeholder="+1 (514) 999-0000 ou +55 (11) 99999-0000"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                      Profissão / Cargo / Área no Québec
                    </label>
                    <input
                      type="text"
                      value={formCompanyOrRole}
                      onChange={(e) => setFormCompanyOrRole(e.target.value)}
                      placeholder="Ex: Analista de TI, Enfermeiro, Imigrante"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION: Funnel Qualification & Score */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5" />
                  <span>2. Qualificação & Etapa do Funil de Vendas</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                      Etapa Atual do Funil
                    </label>
                    <select
                      value={formFunnelStage}
                      onChange={(e) => {
                        const newStage = e.target.value as FunnelStage;
                        setFormFunnelStage(newStage);
                        if (newStage === 'fundo') {
                          setFormScore(85);
                          setFormTemperature('quente');
                        } else if (newStage === 'meio') {
                          setFormScore(60);
                          setFormTemperature('morno');
                        } else if (newStage === 'cliente' || newStage === 'fidelizado') {
                          setFormScore(95);
                          setFormTemperature('vip');
                        } else {
                          setFormScore(30);
                          setFormTemperature('frio');
                        }
                      }}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="topo">1. Topo / Atração (Novo Lead / Frio)</option>
                      <option value="meio">2. Meio / Nutrição (Interessado / Morno)</option>
                      <option value="fundo">3. Fundo / Decisão (Oportunidade Quente 🔥)</option>
                      <option value="cliente">4. Cliente (Já comprou E-book / Material)</option>
                      <option value="fidelizado">5. Fidelizado (Assinante VIP Recorrente 💎)</option>
                    </select>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {STAGE_CONFIG[formFunnelStage].guideWhatToDo}
                    </p>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                      Temperatura do Lead
                    </label>
                    <div className="grid grid-cols-4 gap-1.5 pt-0.5">
                      {[
                        { key: 'frio', label: 'Frio', icon: Snowflake, color: 'text-blue-400' },
                        { key: 'morno', label: 'Morno', icon: Sun, color: 'text-amber-400' },
                        { key: 'quente', label: 'Quente', icon: Flame, color: 'text-rose-400' },
                        { key: 'vip', label: 'VIP', icon: Crown, color: 'text-purple-400' },
                      ].map((item) => {
                        const Icon = item.icon;
                        const isSelected = formTemperature === item.key;
                        return (
                          <button
                            key={item.key}
                            type="button"
                            onClick={() => setFormTemperature(item.key as LeadTemperature)}
                            className={`p-2 rounded-xl border text-center transition cursor-pointer flex flex-col items-center gap-1 ${
                              isSelected
                                ? 'bg-slate-800 border-blue-500 text-white font-bold'
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800/50'
                            }`}
                          >
                            <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                            <span className="text-[10px]">{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Score Slider */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] text-slate-300 font-semibold">
                      Pontuação de Score: <strong className="text-white font-mono">{formScore} pts</strong>
                    </label>
                    <span className="text-[10px] text-slate-400">
                      0-49: Frio | 50-74: Morno | 75-89: Quente | 90-100: VIP
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formScore}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setFormScore(val);
                      if (val >= 90) setFormTemperature('vip');
                      else if (val >= 75) setFormTemperature('quente');
                      else if (val >= 50) setFormTemperature('morno');
                      else setFormTemperature('frio');
                    }}
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* SECTION: Subscription & Commercial Status */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Crown className="w-3.5 h-3.5" />
                  <span>3. Status de Assinatura & Serviços Contratados</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                      Status de Assinatura
                    </label>
                    <select
                      value={formSubscriptionStatus}
                      onChange={(e) => setFormSubscriptionStatus(e.target.value as SubscriptionStatus)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="nenhum">Não Assinante</option>
                      <option value="ebook_buyer">Comprador de E-book/Material</option>
                      <option value="assinante_mensal">Assinante VIP Mensal ($19.90/mês)</option>
                      <option value="membro_anual">Membro Anual Pro ($99/ano)</option>
                      <option value="trial">Período de Testes (Trial)</option>
                      <option value="cancelado">Cancelado / Ex-Assinante</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                      Nome do Plano / Serviço
                    </label>
                    <input
                      type="text"
                      value={formSubscribedPlanName}
                      onChange={(e) => setFormSubscribedPlanName(e.target.value)}
                      placeholder="Ex: Guia Salário 2026, Clube Fiscal VIP"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                      Total Gasto (LTV em CAD $)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formLifetimeValueCad}
                      onChange={(e) => setFormLifetimeValueCad(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                      Data de Renovação / Vencimento
                    </label>
                    <input
                      type="date"
                      value={formSubscriptionRenewalDate}
                      onChange={(e) => setFormSubscriptionRenewalDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                      Origem da Captura
                    </label>
                    <select
                      value={formSource}
                      onChange={(e) => setFormSource(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="home_banner">Banner Principal (Calculadora)</option>
                      <option value="blog_post">Artigo do Blog</option>
                      <option value="ebook_modal">Modal de E-book & Download</option>
                      <option value="footer">Rodapé do Portal</option>
                      <option value="whatsapp">Contato Direto WhatsApp</option>
                      <option value="manual">Cadastro Manual pelo Admin</option>
                      <option value="anuncio_pago">Campanha Paga / Tráfego</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION: Tags & Interests */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" />
                  <span>4. Tags & Áreas de Interesse</span>
                </h4>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formTagInput}
                    onChange={(e) => setFormTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="Digitar nova tag e pressionar Enter..."
                    className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Adicionar
                  </button>
                </div>

                {/* Selected Tags */}
                <div className="flex flex-wrap gap-1.5 min-h-[30px] p-2 bg-slate-950/60 rounded-xl border border-slate-800">
                  {formTags.length === 0 ? (
                    <span className="text-[11px] text-slate-500 italic">Nenhuma tag adicionada ainda.</span>
                  ) : (
                    formTags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-blue-500/20 text-blue-300 text-xs border border-blue-500/30"
                      >
                        <span>#{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="text-blue-400 hover:text-white"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))
                  )}
                </div>

                {/* Suggested Quick Tags */}
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1">Tags sugeridas (clique para adicionar):</span>
                  <div className="flex flex-wrap gap-1">
                    {SUGGESTED_TAGS.map((stag) => (
                      <button
                        key={stag}
                        type="button"
                        onClick={() => {
                          if (!formTags.includes(stag)) setFormTags([...formTags, stag]);
                        }}
                        className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] cursor-pointer"
                      >
                        +{stag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* SECTION: Notes & Interaction History */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>5. Observações Estratégicas & Histórico</span>
                </h4>

                <div>
                  <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                    Anotações Gerais do Consultor
                  </label>
                  <textarea
                    rows={2}
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    placeholder="Ex: Lead tem interesse em validação de diploma em 2026. Fez download do modelo de currículo."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {editingLead && (
                  <div>
                    <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                      Registrar Nova Interação / Contato Recente
                    </label>
                    <input
                      type="text"
                      value={formNewInteractionNote}
                      onChange={(e) => setFormNewInteractionNote(e.target.value)}
                      placeholder="Ex: Conversei no WhatsApp hoje e enviei cupom LANCA10."
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />

                    {editingLead.interactions && editingLead.interactions.length > 0 && (
                      <div className="mt-3 space-y-1.5">
                        <span className="text-[10px] text-slate-400 font-semibold block">
                          Histórico de Interações Anteriores:
                        </span>
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                          {editingLead.interactions.map((it) => (
                            <div
                              key={it.id}
                              className="text-[10px] p-2 bg-slate-950 rounded-lg border border-slate-800 text-slate-300 flex items-start justify-between"
                            >
                              <span>{it.description}</span>
                              <span className="font-mono text-slate-500 shrink-0 ml-2">{it.date}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Form Footer */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-sm transition cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingLead ? 'Salvar Alterações' : 'Cadastrar Lead'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 2: SCRIPTS PRONTOS DE CONTATO (WHATSAPP & E-MAIL) */}
      {/* ============================================================ */}
      {isScriptsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/60">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Central de Scripts de Comunicação (Copiloto)</h3>
                  <p className="text-[11px] text-slate-400">
                    Mensagens prontas testadas e aprovadas para abordar cada tipo de lead com confiança.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsScriptsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Stage selector tabs */}
              <div className="flex flex-wrap gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
                {(['topo', 'meio', 'fundo', 'cliente', 'fidelizado'] as FunnelStage[]).map((stg) => {
                  const cfg = STAGE_CONFIG[stg];
                  const isActive = activeScriptStage === stg;
                  return (
                    <button
                      key={stg}
                      type="button"
                      onClick={() => setActiveScriptStage(stg)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex-1 text-center ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {cfg.title}
                    </button>
                  );
                })}
              </div>

              {/* Script Details */}
              <div className={`p-4 rounded-xl border ${STAGE_CONFIG[activeScriptStage].borderColor} ${STAGE_CONFIG[activeScriptStage].bgColor} space-y-3`}>
                <div>
                  <h4 className="text-xs font-bold text-white">
                    Estratégia para: {STAGE_CONFIG[activeScriptStage].title}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {STAGE_CONFIG[activeScriptStage].guideWhatToDo}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-400">Ações recomendadas nesta etapa:</span>
                  <ul className="list-disc list-inside text-xs text-slate-300 space-y-0.5">
                    {STAGE_CONFIG[activeScriptStage].recommendedActions.map((act, i) => (
                      <li key={i}>{act}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-white">Modelo de Mensagem (WhatsApp / E-mail):</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(STAGE_CONFIG[activeScriptStage].sampleScript);
                        onShowToast('Mensagem copiada para a área de transferência!');
                      }}
                      className="text-xs text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar Texto</span>
                    </button>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-200 font-sans leading-relaxed whitespace-pre-line">
                    {STAGE_CONFIG[activeScriptStage].sampleScript}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsScriptsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 3: DISPARAR CAMPANHA SEGMENTADA DE NEWSLETTER */}
      {/* ============================================================ */}
      {isCampaignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/60">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Disparar Campanha Segmentada</h3>
                  <p className="text-[11px] text-slate-400">
                    Envie comunicados ou ofertas direcionadas para um segmento específico do funil.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCampaignModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendCampaign} className="p-5 space-y-4">
              <div>
                <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                  Público-Alvo / Segmento de Destino
                </label>
                <select
                  value={campaignTarget}
                  onChange={(e) => setCampaignTarget(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="all">Todos os Contatos da Base ({leads.length} leads)</option>
                  <option value="topo">Apenas Topo / Atração ({leads.filter((l) => l.funnelStage === 'topo').length} leads)</option>
                  <option value="meio">Apenas Meio / Nutrição ({leads.filter((l) => l.funnelStage === 'meio').length} leads)</option>
                  <option value="fundo">Apenas Fundo / Decisão - Leads Quentes ({leads.filter((l) => l.funnelStage === 'fundo').length} leads)</option>
                  <option value="cliente">Apenas Clientes ({leads.filter((l) => l.funnelStage === 'cliente').length} compradores)</option>
                  <option value="subscribers">Apenas Assinantes Ativos VIP ({metrics.activeSubscribers} membros)</option>
                </select>
              </div>

              {/* Template shortcuts */}
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Modelos rápidos de disparo:</span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleSelectCampaignTemplate('welcome')}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] cursor-pointer"
                  >
                    Checklist Gratuito
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectCampaignTemplate('coupon')}
                    className="px-2.5 py-1 rounded-lg bg-rose-950/60 hover:bg-rose-800 text-rose-300 border border-rose-700/50 text-[10px] cursor-pointer font-semibold"
                  >
                    Cupom de 20% OFF
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectCampaignTemplate('tax_tip')}
                    className="px-2.5 py-1 rounded-lg bg-blue-950/60 hover:bg-blue-800 text-blue-300 border border-blue-700/50 text-[10px] cursor-pointer"
                  >
                    Dica Fiscal de REER
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectCampaignTemplate('vip_invite')}
                    className="px-2.5 py-1 rounded-lg bg-purple-950/60 hover:bg-purple-800 text-purple-300 border border-purple-700/50 text-[10px] cursor-pointer"
                  >
                    Convite Assinatura VIP
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                  Assunto do E-mail <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={campaignSubject}
                  onChange={(e) => setCampaignSubject(e.target.value)}
                  placeholder="Ex: Seu checklist de contracheque chegou! 🍁"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                  Conteúdo da Mensagem <span className="text-rose-400">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  value={campaignBody}
                  onChange={(e) => setCampaignBody(e.target.value)}
                  placeholder="Olá {NOME}, estamos felizes em compartilhar..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-sans"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Dica: a tag <code className="text-blue-400">{"{NOME}"}</code> será substituída automaticamente pelo nome do destinatário.
                </span>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCampaignModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSendingCampaign}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-sm transition cursor-pointer flex items-center gap-1.5"
                >
                  {isSendingCampaign ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Disparando...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Enviar Campanha Agora</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 4: CONFIRM DELETE */}
      {/* ============================================================ */}
      {isDeleteModalOpen && leadToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-5 space-y-4">
            <div className="w-10 h-10 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-sm font-bold text-white">Excluir Lead da Base?</h3>
              <p className="text-xs text-slate-400">
                Tem certeza que deseja remover <strong className="text-white">{leadToDelete.email}</strong>?
                Esta ação não pode ser desfeita.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Sim, Excluir Lead
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
