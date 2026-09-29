'use client';

import React, { useState } from 'react';
import { Language } from '@/lib/i18n';
import { ToolId } from '@/components/ToolboxGrid';
import { adminStore } from '@/lib/admin-store';
import { TrustAuthorityBar } from '@/components/TrustAuthorityBar';
import { AdBanner } from '@/components/AdBanner';
import { NewsletterBox } from '@/components/NewsletterBox';
import {
  Award,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Mail,
  ArrowRight,
  ArrowLeft,
  Users,
  Target,
  Sparkles,
  Send,
  Zap,
} from 'lucide-react';

interface PartnersPageProps {
  lang: Language;
  onSelectTool: (tool: ToolId) => void;
}

export const PartnersPage: React.FC<PartnersPageProps> = ({
  lang,
  onSelectTool,
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    serviceCategory: 'rrsp',
    message: '',
  });

  const copy = {
    fr: {
      badge: 'Programme Partenaires & Commanditaires 2026',
      title: 'Associez Votre Marque au Calculateur de Paie de Référence au Québec',
      subtitle:
        'Touchez une audience qualifiée de salariés, professionnels et nouveaux arrivants en recherche active d’optimisation fiscale, assurance collective et services RH.',
      statsAudience: 'Profil & Puissance de notre audience au Québec',
      stat1Title: '100% Québec',
      stat1Desc: 'Salariés, travailleurs autonomes & employeurs locaux',
      stat2Title: 'Intention d’Achat Élevée',
      stat2Desc: 'Recherche active d’optimisation REER, assurance & paie',
      stat3Title: 'Crédibilité Institutionnelle',
      stat3Desc: 'Calculs certifiés conformes Revenu Québec & ARC',
      categoryLabel: 'Secteur d’activité de votre entreprise *',
      catRrsp: 'Banque & Gestion de patrimoine / REER / CELI',
      catIns: 'Assurance collective, santé & prévoyance',
      catPayroll: 'Logiciel de paie & Solutions RH',
      catCpa: 'Cabinet comptable CPA & Fiscalité corporative',
      catRecruiting: 'Recrutement & Agence de placement',
      nameLabel: 'Nom complet du contact *',
      companyLabel: 'Organisation ou Entreprise *',
      emailLabel: 'Courriel professionnel *',
      msgLabel: 'Objectifs de votre partenariat *',
      msgPlaceholder:
        'Décrivez votre intérêt : intégration de vos simulateurs, commandite de section, bannières sponsorisées, offres exclusives aux salariés...',
      submitBtn: 'Transmettre la demande de partenariat',
      successTitle: '🎉 Demande transmise avec succès !',
      successMsg:
        'Notre équipe des partenariats examinera votre dossier et vous contactera sous 24 heures ouvrables avec un plan personnalisé.',
      benefitsTitle: 'Opportunités de visibilité disponibles',
      mediaKitBtn: 'Consulter le Media Kit Interactif',
    },
    pt: {
      badge: 'Programa Oficial de Parceiros & Patrocinadores 2026',
      title: 'Associe Sua Marca ao Calculador Fiscal de Referência no Québec',
      subtitle:
        'Alcance uma audiência altamente qualificada de assalariados, profissionais da indústria e imigrantes que buscam otimização financeira, seguros e serviços de RH.',
      statsAudience: 'Perfil & Potência da Audiência no Québec',
      stat1Title: '100% Québec',
      stat1Desc: 'Trabalhadores CLT, autônomos e decisores de RH locais',
      stat2Title: 'Alta Intenção de Ação',
      stat2Desc: 'Busca ativa por bancos, previdência REER e seguros',
      stat3Title: 'Autoridade & Confiança',
      stat3Desc: 'Cálculos 100% conformes com Revenu Québec e ARC',
      categoryLabel: 'Setor de atuação da sua organização *',
      catRrsp: 'Bancos / Gestão Patrimonial / REER / CELI',
      catIns: 'Seguro Saúde Coletivo & Benefícios',
      catPayroll: 'Software de Folha & Soluções RH',
      catCpa: 'Assessoria Contábil CPA & Planejamento Tributário',
      catRecruiting: 'Recrutamento & Consultoria de Carreira',
      nameLabel: 'Nome completo do responsável *',
      companyLabel: 'Nome da Empresa ou Instituição *',
      emailLabel: 'E-mail corporativo *',
      msgLabel: 'Objetivos da parceria *',
      msgPlaceholder:
        'Descreva como deseja colaborar: banners de alta visibilidade, patrocínio de ferramentas do calculador, inserção no acervo de recursos ou campanhas conjuntas...',
      submitBtn: 'Enviar Proposta de Parceria',
      successTitle: '🎉 Proposta enviada com sucesso!',
      successMsg:
        'Nossa equipe comercial analisará os dados da sua empresa e responderá em até 24 horas úteis com o plano personalizado de ativação.',
      benefitsTitle: 'Formatos de ativação e visibilidade',
      mediaKitBtn: 'Ver Media Kit Completo com Valores',
    },
    en: {
      badge: 'Official Partners & Sponsors Program 2026',
      title: 'Connect Your Brand with Quebec’s Leading Payroll & Tax Calculator',
      subtitle:
        'Reach a targeted audience of employees, industrial workers, and newcomers actively seeking group insurance, RRSP investments, and HR tools.',
      statsAudience: 'Audience Demographics & Reach in Quebec',
      stat1Title: '100% Quebec Focus',
      stat1Desc: 'Employees, independent contractors & employers',
      stat2Title: 'High Intent',
      stat2Desc: 'Users actively planning insurance, RRSPs & payroll',
      stat3Title: 'Institutional Trust',
      stat3Desc: 'Calculations certified to Revenu Québec & CRA standards',
      categoryLabel: 'Company Industry *',
      catRrsp: 'Wealth Management / Banking / RRSP / TFSA',
      catIns: 'Group Health & Dental Insurance',
      catPayroll: 'Payroll & HR SaaS Platforms',
      catCpa: 'CPA Accounting & Tax Advisory',
      catRecruiting: 'Staffing & Recruitment Agencies',
      nameLabel: 'Contact Full Name *',
      companyLabel: 'Company Name *',
      emailLabel: 'Business Email *',
      msgLabel: 'Partnership Goals *',
      msgPlaceholder:
        'Describe your sponsorship interest: section sponsorship, branded calculator integrations, banner placement, co-branded guides...',
      submitBtn: 'Submit Partnership Request',
      successTitle: '🎉 Inquiry Submitted Successfully!',
      successMsg:
        'Our corporate team will review your application and respond within 24 business hours.',
      benefitsTitle: 'Available Sponsorship Formats',
      mediaKitBtn: 'Explore Interactive Media Kit',
    },
  }[lang];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.email.includes('@')) {
      alert(lang === 'pt' ? 'Informe um e-mail válido.' : 'Veuillez saisir un courriel valide.');
      return;
    }

    setSubmitted(true);

    adminStore.submitB2BSponsorInquiry({
      contactName: formData.name,
      companyName: formData.company,
      email: formData.email,
      slotId: `cat-${formData.serviceCategory}`,
      slotName: `Parceria Setorial: ${formData.serviceCategory.toUpperCase()}`,
      billingDuration: 'monthly',
      priceCad: 350,
      message: formData.message,
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200 pb-16">
      {/* 1. TOP BREADCRUMB NAVIGATION */}
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
            {lang === 'pt' ? 'Parceiros & Patrocinadores' : 'Partenaires & Commanditaires'}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onSelectTool('media-kit')}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
        >
          <Target className="w-3.5 h-3.5 text-amber-400" />
          <span>{copy.mediaKitBtn}</span>
        </button>
      </div>

      <TrustAuthorityBar lang={lang} />

      {/* 2. HERO PRESENTATION */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-10 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            <span>{copy.badge}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            {copy.title}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            {copy.subtitle}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('partner-form-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <span>{lang === 'pt' ? 'Cadastrar Minha Empresa' : 'Devenir Partenaire'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onSelectTool('media-kit')}
              className="px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-colors cursor-pointer"
            >
              {copy.mediaKitBtn}
            </button>
          </div>
        </div>
      </div>

      {/* 3. AUDIENCE METRICS & VALUE CARDS */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="max-w-2xl space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Métricas de Alto Desempenho
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            {copy.statsAudience}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">{copy.stat1Title}</h3>
            <p className="text-xs text-slate-500">{copy.stat1Desc}</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">{copy.stat2Title}</h3>
            <p className="text-xs text-slate-500">{copy.stat2Desc}</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">{copy.stat3Title}</h3>
            <p className="text-xs text-slate-500">{copy.stat3Desc}</p>
          </div>
        </div>
      </div>

      {/* 4. PARTNERSHIP INQUIRY FORM */}
      <div id="partner-form-section" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-md space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-900">
              {submitted ? copy.successTitle : 'Formulário de Solicitação de Parceria'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {submitted
                ? copy.successMsg
                : 'Preencha os dados abaixo para receber nossa apresentação corporativa com métricas de cliques e conversão.'}
            </p>
          </div>

          {submitted ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-emerald-950 text-sm">Recebemos sua proposta!</h4>
                <p className="text-xs text-emerald-800">{copy.successMsg}</p>
              </div>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer transition-colors"
              >
                Enviar Outra Solicitação
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {copy.nameLabel}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Seu nome completo"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {copy.companyLabel}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Nome da empresa"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {copy.emailLabel}
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="contato@suaempresa.com"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {copy.categoryLabel}
                </label>
                <select
                  value={formData.serviceCategory}
                  onChange={(e) => setFormData({ ...formData, serviceCategory: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                >
                  <option value="rrsp">{copy.catRrsp}</option>
                  <option value="insurance">{copy.catIns}</option>
                  <option value="payroll">{copy.catPayroll}</option>
                  <option value="cpa">{copy.catCpa}</option>
                  <option value="recruiting">{copy.catRecruiting}</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {copy.msgLabel}
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={copy.msgPlaceholder}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
              >
                <Send className="w-4 h-4 text-emerald-400" />
                <span>{copy.submitBtn}</span>
              </button>
            </form>
          )}
        </div>

        {/* Right Info Box (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-md space-y-4">
            <div className="flex items-center gap-2 text-amber-400">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">
                {copy.benefitsTitle}
              </span>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1">
                <span className="font-bold text-white block">📍 Banners Nativos & Contextuais</span>
                <span className="text-slate-400 text-[11px] block">
                  Exibidos após cada cálculo salarial e nas páginas de deduções fiscais e horas extras.
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1">
                <span className="font-bold text-white block">🏢 Selo de Parceiro Auditado</span>
                <span className="text-slate-400 text-[11px] block">
                  Recomendação explícita de sua instituição financeira, assessoria de RH ou corretora no acervo.
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1">
                <span className="font-bold text-white block">📊 Relatório de Leads & Cliques</span>
                <span className="text-slate-400 text-[11px] block">
                  Painel com métricas de impressões e leads gerados diretamente em tempo real.
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSelectTool('media-kit')}
              className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Abrir Media Kit com Lotes & Preços</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <AdBanner slotId="banner-horizontal" lang={lang} />
      <NewsletterBox lang={lang} />
    </div>
  );
};
