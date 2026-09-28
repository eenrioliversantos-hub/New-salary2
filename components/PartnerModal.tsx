'use client';

import React, { useState } from 'react';
import { X, Building2, ShieldCheck, Mail, CheckCircle2, Award, ExternalLink, ArrowRight } from 'lucide-react';
import { Language } from '@/lib/i18n';

interface PartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const PartnerModal: React.FC<PartnerModalProps> = ({ isOpen, onClose, lang }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    serviceCategory: 'rrsp',
    message: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const copy = {
    fr: {
      title: 'Espace Partenaires & Commanditaires',
      subtitle: 'Associez votre institution financière ou solution RH au calculateur de paie de référence au Québec.',
      audienceTitle: 'Profil de notre audience au Québec',
      stat1: '100% Québec',
      stat1Label: 'Salariés, travailleurs autonomes & employeurs',
      stat2: 'Intention d’achat élevée',
      stat2Label: 'Recherche active d’optimisation REER, assurance & paie',
      stat3: 'Crédibilité Institutionnelle',
      stat3Label: 'Calculs certifiés conformes Revenu Québec & ARC',
      categoryLabel: 'Secteur d’activité',
      catRrsp: 'Gestion de patrimoine / REER / CELI',
      catIns: 'Assurance collective & santé',
      catPayroll: 'Logiciel de paie / Services RH',
      catCpa: 'Cabinet comptable CPA / Fiscalité',
      nameLabel: 'Nom complet',
      companyLabel: 'Organisation ou Entreprise',
      emailLabel: 'Courriel professionnel',
      msgLabel: 'Objectifs de partenariat',
      msgPlaceholder: 'Décrivez votre intérêt : intégration de vos simulateurs, commandite de section, visibilité de marque...',
      submitBtn: 'Transmettre la demande de partenariat',
      successTitle: 'Demande transmise avec succès',
      successMsg: 'Notre équipe responsable des partenariats examinera votre dossier et vous contactera sous 24 heures ouvrables.',
      closeBtn: 'Fermer',
    },
    pt: {
      title: 'Espaço para Parceiros e Patrocinadores',
      subtitle: 'Associe sua instituição financeira, fintech ou assessoria ao calculador fiscal de referência no Québec.',
      audienceTitle: 'Perfil da nossa audiência no Québec',
      stat1: '100% Québec',
      stat1Label: 'Trabalhadores, imigrantes qualificados e gestores',
      stat2: 'Alta Intenção Financeira',
      stat2Label: 'Pessoas buscando ativamente REER, seguros e investimentos',
      stat3: 'Credibilidade Institucional',
      stat3Label: 'Cálculos rigorosos e auditados pelas leis fiscais 2026',
      categoryLabel: 'Setor de atuação',
      catRrsp: 'Gestão de Patrimônio / REER / CELI / Investimentos',
      catIns: 'Seguro Coletivo & Benefícios de Saúde',
      catPayroll: 'Sistemas de Folha / RH / Payroll',
      catCpa: 'Assessoria Contábil / Fiscal CPA',
      nameLabel: 'Nome completo',
      companyLabel: 'Instituição ou Empresa',
      emailLabel: 'E-mail corporativo',
      msgLabel: 'Objetivos da parceria / patrocínio',
      msgPlaceholder: 'Conte-nos seu interesse: patrocínio de módulo, exibição de produtos financeiros, integração...',
      submitBtn: 'Enviar proposta de parceria',
      successTitle: 'Proposta recebida com sucesso',
      successMsg: 'Nossa equipe de parcerias corporativas responderá com o kit de mídia e propostas em até 24 horas úteis.',
      closeBtn: 'Fechar',
    },
    en: {
      title: 'Partners & Sponsor Inquiries',
      subtitle: 'Partner with Quebec’s premier verified payroll and fiscal tax platform.',
      audienceTitle: 'Our Quebec Audience Profile',
      stat1: '100% Quebec Focus',
      stat1Label: 'Salaried employees, skilled workers & employers',
      stat2: 'High Financial Intent',
      stat2Label: 'Actively planning RRSP deductions, benefits & payroll',
      stat3: 'Institutional Rigor',
      stat3Label: 'Aligned with official 2026 Revenu Québec & CRA guidelines',
      categoryLabel: 'Industry Sector',
      catRrsp: 'Wealth Management / RRSP / TFSA',
      catIns: 'Group Benefits & Health Insurance',
      catPayroll: 'Payroll Software & HR Services',
      catCpa: 'CPA Accounting & Tax Advisory',
      nameLabel: 'Full Name',
      companyLabel: 'Company / Organization',
      emailLabel: 'Business Email',
      msgLabel: 'Partnership Goals',
      msgPlaceholder: 'Tell us about your brand goals: section sponsorship, tool integration, co-marketing...',
      submitBtn: 'Submit Partnership Request',
      successTitle: 'Inquiry Submitted Successfully',
      successMsg: 'Our partnership team will review your application and follow up within 24 business hours.',
      closeBtn: 'Close',
    },
  }[lang];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 bg-slate-900 text-white flex items-start justify-between relative">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
              <Award className="w-4 h-4" />
              <span>Programme Partenaires 2026</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
              {copy.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md">
              {copy.subtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Institutional Audience Proof */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
              {copy.audienceTitle}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 bg-white rounded-lg border border-slate-200/70">
                <div className="font-bold text-slate-900 text-sm">{copy.stat1}</div>
                <div className="text-slate-500 text-[11px] mt-0.5">{copy.stat1Label}</div>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-slate-200/70">
                <div className="font-bold text-emerald-800 text-sm">{copy.stat2}</div>
                <div className="text-slate-500 text-[11px] mt-0.5">{copy.stat2Label}</div>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-slate-200/70">
                <div className="font-bold text-blue-900 text-sm">{copy.stat3}</div>
                <div className="text-slate-500 text-[11px] mt-0.5">{copy.stat3Label}</div>
              </div>
            </div>
          </div>

          {submitted ? (
            <div className="p-6 text-center bg-emerald-50 rounded-xl border border-emerald-200 space-y-3">
              <div className="inline-flex p-3 rounded-full bg-emerald-100 text-emerald-800">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-emerald-950">{copy.successTitle}</h3>
              <p className="text-xs text-emerald-800 max-w-md mx-auto leading-relaxed">
                {copy.successMsg}
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-2 px-5 py-2 text-xs font-bold bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors"
              >
                {copy.closeBtn}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {copy.categoryLabel}
                </label>
                <select
                  value={formData.serviceCategory}
                  onChange={(e) => setFormData({ ...formData, serviceCategory: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 font-medium"
                >
                  <option value="rrsp">{copy.catRrsp}</option>
                  <option value="insurance">{copy.catIns}</option>
                  <option value="payroll">{copy.catPayroll}</option>
                  <option value="cpa">{copy.catCpa}</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{copy.nameLabel}</label>
                  <input
                    type="text"
                    required
                    placeholder="Jean Tremblay"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 focus:ring-2 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{copy.companyLabel}</label>
                  <input
                    type="text"
                    required
                    placeholder="Financière Banque / Cabinet CPA"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">{copy.emailLabel}</label>
                <input
                  type="email"
                  required
                  placeholder="contact@institution.ca"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">{copy.msgLabel}</label>
                <textarea
                  rows={3}
                  required
                  placeholder={copy.msgPlaceholder}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm text-xs"
              >
                <Mail className="w-4 h-4" />
                <span>{copy.submitBtn}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
