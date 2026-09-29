'use client';

import React, { useState } from 'react';
import { Language } from '@/lib/i18n';
import { ToolId } from '@/components/ToolboxGrid';
import { adminStore } from '@/lib/admin-store';
import { TrustAuthorityBar } from '@/components/TrustAuthorityBar';
import { AdBanner } from '@/components/AdBanner';
import { NewsletterBox } from '@/components/NewsletterBox';
import {
  Crown,
  CheckCircle2,
  CreditCard,
  ShieldCheck,
  ArrowLeft,
  Check,
} from 'lucide-react';

interface ProPlansPageProps {
  lang: Language;
  onSelectTool: (tool: ToolId) => void;
  onUnlockPro: () => void;
}

export const ProPlansPage: React.FC<ProPlansPageProps> = ({
  lang,
  onSelectTool,
  onUnlockPro,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'single' | 'pro'>('pro');
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');

  const handleSimulatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      alert(lang === 'pt' ? 'Informe seu e-mail para liberação da conta.' : 'Saisissez votre adresse courriel.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setSuccess(true);
      onUnlockPro();

      adminStore.saveNewsletterLead({
        id: `pro-cust-${Date.now()}`,
        name: email.split('@')[0],
        email: email.trim(),
        source: 'pro_checkout',
        date: new Date().toISOString().replace('T', ' ').slice(0, 16),
        status: 'subscribed',
        funnelStage: 'fundo',
        score: 100,
        temperature: 'quente',
        subscriptionStatus: 'membro_anual',
        lifetimeValueCad: selectedPlan === 'single' ? 4.99 : 12.99,
        tags: ['Cliente Pro', selectedPlan === 'pro' ? 'Carrière Pro Pass' : 'Download Avulso'],
      });
    }, 1000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200 pb-16">
      {/* Top Breadcrumb Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onSelectTool('net-calc')}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-bold border border-slate-200 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>
              {lang === 'pt' ? 'Voltar ao Calculador' : lang === 'en' ? 'Back to Calculator' : 'Retour au calculateur'}
            </span>
          </button>
          <span className="text-slate-300">/</span>
          <span className="text-xs font-semibold text-slate-900">
            {lang === 'pt' ? 'Planos & Carrière Pro' : 'Abonnements & Carrière Pro'}
          </span>
        </div>

        <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
          👑 {lang === 'pt' ? 'Garantia de 30 Dias' : 'Garantie de 30 jours'}
        </span>
      </div>

      <TrustAuthorityBar lang={lang} />

      {/* Hero Header */}
      <div className="rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 text-white p-6 sm:p-10 border border-slate-800 shadow-xl relative overflow-hidden text-center max-w-4xl mx-auto">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
            <Crown className="w-3.5 h-3.5 text-amber-300" />
            <span>PaieNet Carrière Pro 2026</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            {lang === 'pt'
              ? 'Conquiste Seu Emprego Qualificado no Québec com Ferramentas Profissionais'
              : 'Démarquez-vous et décrochez votre emploi qualifié au Québec'}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {lang === 'pt'
              ? 'Acesso irrestrito ao Construtor de CV no formato canadense ATS, simulador com centenas de perguntas reais de entrevista comportamental STAR e testes técnicos com respostas comentadas.'
              : 'Accès illimité au créateur de CV format canadien ATS, simulateur d’entrevue STAR complet et tests de recrutement corrigés.'}
          </p>
        </div>
      </div>

      {/* Pricing Comparison Cards */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        <div
          onClick={() => setSelectedPlan('single')}
          className={`p-6 sm:p-8 rounded-3xl border-2 transition-all flex flex-col justify-between cursor-pointer ${
            selectedPlan === 'single'
              ? 'border-blue-600 bg-white shadow-lg ring-2 ring-blue-600/20'
              : 'border-slate-200 bg-white hover:border-slate-300 shadow-xs'
          }`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {lang === 'pt' ? 'Acesso Básico' : 'Téléchargement unique'}
              </span>
              {selectedPlan === 'single' && (
                <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                  Selecionado
                </span>
              )}
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900">
                {lang === 'pt' ? 'Download Avulso de CV' : '1 CV Format Canadien'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Ideal para quem precisa apenas exportar uma única versão do currículo.
              </p>
            </div>

            <div className="pt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">$4.99</span>
              <span className="text-xs text-slate-500">CAD / pagamento único</span>
            </div>

            <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>1 exportação em PDF de alta resolução</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Format Canadien ATS sem foto e sem marca d’água</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <span className="w-4 text-center">✕</span>
                <span>Sem acesso ao simulador de entrevistas STAR</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <span className="w-4 text-center">✕</span>
                <span>Sem acesso aos testes técnicos comentados</span>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              type="button"
              onClick={() => setSelectedPlan('single')}
              className={`w-full py-3 rounded-xl font-bold text-xs cursor-pointer transition-colors ${
                selectedPlan === 'single'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Escolher Download Avulso ($4.99)
            </button>
          </div>
        </div>

        {/* Plan 2: Pass Carrière Pro */}
        <div
          onClick={() => setSelectedPlan('pro')}
          className={`p-6 sm:p-8 rounded-3xl border-2 transition-all flex flex-col justify-between relative cursor-pointer ${
            selectedPlan === 'pro'
              ? 'border-indigo-600 bg-gradient-to-b from-indigo-50/40 via-white to-white shadow-xl ring-2 ring-indigo-600/30'
              : 'border-slate-200 bg-white hover:border-slate-300 shadow-xs'
          }`}
        >
          <div className="absolute -top-3 right-6 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
            🔥 Mais Escolhido por Imigrantes
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-amber-500" />
                <span>Pass Vitalício Completo</span>
              </span>
              {selectedPlan === 'pro' && (
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                  Selecionado
                </span>
              )}
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900">
                {lang === 'pt' ? 'Pass PaieNet Carrière Pro' : 'Pass Carrière Pro Illimité'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Todas as ferramentas de carreira e preparação destravadas para sempre.
              </p>
            </div>

            <div className="pt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-indigo-950">$12.99</span>
              <span className="text-xs text-slate-500">CAD / pagamento único vitalício</span>
            </div>

            <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs text-slate-700">
              <div className="flex items-center gap-2 font-semibold text-slate-900">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Downloads e exportações ilimitadas de currículos (.pdf e .docx)</span>
              </div>
              <div className="flex items-center gap-2 font-semibold text-slate-900">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Simulador de Entrevista STAR com gravação e dicas culturais</span>
              </div>
              <div className="flex items-center gap-2 font-semibold text-slate-900">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Testes Técnicos & CNESST (SIMDUT, lógica, pré-admissional)</span>
              </div>
              <div className="flex items-center gap-2 font-semibold text-slate-900">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Sem assinaturas mensais recorrentes (compra única permanente)</span>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              type="button"
              onClick={() => setSelectedPlan('pro')}
              className={`w-full py-3 rounded-xl font-bold text-xs cursor-pointer transition-colors ${
                selectedPlan === 'pro'
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Escolher Pass Pro Completo ($12.99)
            </button>
          </div>
        </div>
      </div>

      {/* Checkout Form */}
      <div className="max-w-xl mx-auto p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-md space-y-5">
        <h3 className="text-lg font-bold text-slate-900 text-center">
          {success ? '🎉 Acesso Desbloqueado com Sucesso!' : `Finalizar Acesso ao ${selectedPlan === 'pro' ? 'Pass Carrière Pro ($12.99 CAD)' : 'Download Avulso ($4.99 CAD)'}`}
        </h3>

        {success ? (
          <div className="p-5 rounded-2xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <div className="space-y-1">
              <h4 className="font-extrabold text-sm">Parabéns! Sua conta está liberada.</h4>
              <p className="text-xs text-emerald-800">
                Você agora tem acesso ilimitado a todas as ferramentas Pro.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onSelectTool('resume-builder')}
              className="px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
            >
              Ir para o Construtor de CV ATS →
            </button>
          </div>
        ) : (
          <form onSubmit={handleSimulatePayment} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                E-mail para envio das credenciais de acesso *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@exemplo.com"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-extrabold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
            >
              {isProcessing ? (
                <span>Ativando sua conta...</span>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>
                    Concluir Pagamento ({selectedPlan === 'single' ? '$4.99 CAD' : '$12.99 CAD'})
                  </span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-3 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Pagamento 100% Seguro</span>
              </span>
              <span>·</span>
              <span>Sem cobranças mensais ocultas</span>
            </div>

            <div className="mt-4 p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 text-slate-700 flex items-start gap-2.5">
              <div className="p-1.5 rounded-lg bg-amber-100 text-amber-800 shrink-0 font-bold text-xs uppercase">
                30 Dias
              </div>
              <div className="space-y-0.5 text-left">
                <span className="text-[11px] font-black text-amber-900 block uppercase tracking-wider">
                  {lang === 'pt' ? 'Garantia de Reembolso de 30 Dias' : 'Garantie de Remboursement de 30 Jours'}
                </span>
                <p className="text-[10px] text-slate-600 leading-normal">
                  {lang === 'pt'
                    ? 'Garantia de reembolso de 30 dias se o material ou ferramentas não otimizarem suas negociações salariais.'
                    : 'Garantie de remboursement de 30 jours si le matériel ou les simulateurs n’optimisent pas vos négociations salariales.'}
                </p>
              </div>
            </div>
          </form>
        )}
      </div>

      <AdBanner slotId="banner-horizontal" lang={lang} />
      <NewsletterBox lang={lang} />
    </div>
  );
};
