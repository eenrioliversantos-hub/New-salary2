'use client';

import React from 'react';
import { Language } from '@/lib/i18n';
import { ToolId } from '@/components/ToolboxGrid';
import { Building2, PiggyBank, Shield, Users, ArrowUpRight, Award, CheckCircle } from 'lucide-react';

interface PartnerSponsorSectionProps {
  lang: Language;
  onOpenPartnerModal: () => void;
  onSelectTool?: (tool: ToolId) => void;
}

export const PartnerSponsorSection: React.FC<PartnerSponsorSectionProps> = ({
  lang,
  onOpenPartnerModal,
  onSelectTool,
}) => {
  const content = {
    fr: {
      tag: 'Solutions Recommandées & Partenaires',
      title: 'Optimisation Fiscale & Services Financiers au Québec',
      subtitle: 'Ressources sélectionnées pour maximiser votre salaire net et sécuriser votre patrimoine.',
      ctaBecomePartner: 'Devenir Partenaire / Espace Annonceur',
      partnerSlots: [
        {
          id: 'rrsp',
          icon: <PiggyBank className="w-5 h-5 text-emerald-700" />,
          category: 'Épargne & Retraite',
          title: 'REER & CELIAPP : Réduisez votre impôt 2026',
          description: 'Une cotisation REER de 5 000 $ peut générer jusqu’à 1 856 $ de remboursement d’impôt immédiat au Québec.',
          actionText: 'Simuler le retour REER',
          sponsorTag: 'Partenaire Certifié',
        },
        {
          id: 'insurance',
          icon: <Shield className="w-5 h-5 text-blue-700" />,
          category: 'Protection Collective',
          title: 'Assurance Maladie & Soins Dentaires',
          description: 'Comparez les régimes collectifs et individuels pour réduire les primes déduites de votre talon de paie.',
          actionText: 'Consulter les régimes',
          sponsorTag: 'Espace Vérifié',
        },
        {
          id: 'payroll',
          icon: <Users className="w-5 h-5 text-indigo-700" />,
          category: 'PME & Employeurs',
          title: 'Gestion de Paie Conforme CNESST & Revenu Québec',
          description: 'Automatisez vos déclarations de retenues à la source (DAS) sans risque d’erreur de calcul fiscal.',
          actionText: 'Découvrir les solutions',
          sponsorTag: 'Solutions RH',
        },
      ],
      complianceNote: 'Les partenaires présentés respectent les normes déontologiques et réglementaires québécoises.',
    },
    pt: {
      tag: 'Soluções Recomendadas & Parceiros',
      title: 'Otimização Fiscal e Serviços Financeiros no Québec',
      subtitle: 'Recursos institucionais para maximizar seu salário líquido e estruturar sua vida no Canadá.',
      ctaBecomePartner: 'Seja um Patrocinador / Anunciante',
      partnerSlots: [
        {
          id: 'rrsp',
          icon: <PiggyBank className="w-5 h-5 text-emerald-700" />,
          category: 'Poupança & Aposentadoria',
          title: 'REER & CELIAPP: Reduza seu Imposto de Renda',
          description: 'Um aporte de $5.000 no REER pode devolver até $1.856 em reembolso de imposto no bolso no Québec.',
          actionText: 'Simular restituição',
          sponsorTag: 'Parceiro Certificado',
        },
        {
          id: 'insurance',
          icon: <Shield className="w-5 h-5 text-blue-700" />,
          category: 'Proteção & Benefícios',
          title: 'Seguro Saúde Coletivo e Dental',
          description: 'Entenda as deduções do seu holerite (Assurance Médicaments) e opções de complementação privada.',
          actionText: 'Ver coberturas',
          sponsorTag: 'Espaço Verificado',
        },
        {
          id: 'payroll',
          icon: <Users className="w-5 h-5 text-indigo-700" />,
          category: 'PME & Empregadores',
          title: 'Gestão de Folha de Pagamento no Québec',
          description: 'Sistemas automatizados de folha compatíveis com CNESST e retenções na fonte de Revenu Québec.',
          actionText: 'Conhecer soluções',
          sponsorTag: 'Soluções RH',
        },
      ],
      complianceNote: 'Parcerias selecionadas com instituições financeiras e consultorias reguladas no Canadá.',
    },
    en: {
      tag: 'Recommended Solutions & Partners',
      title: 'Tax Optimization & Financial Services in Quebec',
      subtitle: 'Curated professional services to help you maximize net take-home pay and wealth.',
      ctaBecomePartner: 'Become a Partner / Sponsor',
      partnerSlots: [
        {
          id: 'rrsp',
          icon: <PiggyBank className="w-5 h-5 text-emerald-700" />,
          category: 'Retirement & Savings',
          title: 'RRSP & FHSA: Slash Your 2026 Quebec Tax Bill',
          description: 'A $5,000 RRSP contribution can yield up to $1,856 in direct tax refund in Quebec.',
          actionText: 'Simulate Tax Refund',
          sponsorTag: 'Verified Partner',
        },
        {
          id: 'insurance',
          icon: <Shield className="w-5 h-5 text-blue-700" />,
          category: 'Group Benefits',
          title: 'Health & Dental Group Coverage',
          description: 'Audit the deductions on your paystub and discover tax-advantaged health spending accounts.',
          actionText: 'Compare Plans',
          sponsorTag: 'Financial Services',
        },
        {
          id: 'payroll',
          icon: <Users className="w-5 h-5 text-indigo-700" />,
          category: 'Business & Payroll',
          title: 'Quebec-Compliant Payroll Automation',
          description: 'Streamline source deductions and DAS remittances with verified Revenu Québec integrations.',
          actionText: 'Explore Payroll Tools',
          sponsorTag: 'HR Solutions',
        },
      ],
      complianceNote: 'Featured partners adhere to Quebec financial regulatory and professional standards.',
    },
  }[lang];

  return (
    <section id="partenaires-section" className="mt-12 pt-8 border-t border-slate-200/90">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500 block mb-1">
            {content.tag}
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {content.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            {content.subtitle}
          </p>
        </div>

        {/* Sponsor CTA Button */}
        <button
          type="button"
          onClick={() => {
            if (onSelectTool) {
              onSelectTool('media-kit');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
              onOpenPartnerModal();
            }
          }}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-2xs hover:border-slate-400 transition-all cursor-pointer shrink-0 self-start md:self-auto"
        >
          <Award className="w-4 h-4 text-emerald-700" />
          <span>{content.ctaBecomePartner}</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>

      {/* Partner Cards Grid - Strict 1-elevation, clean hairline dividers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {content.partnerSlots.map((slot) => (
          <div
            key={slot.id}
            className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-xl bg-slate-100/80 border border-slate-200/60">
                  {slot.icon}
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  {slot.sponsorTag}
                </span>
              </div>

              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                {slot.category}
              </div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight mb-2">
                {slot.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {slot.description}
              </p>
            </div>

            <button
              type="button"
              onClick={onOpenPartnerModal}
              className="inline-flex items-center justify-between text-xs font-bold text-blue-900 hover:text-blue-700 pt-3 border-t border-slate-100 cursor-pointer group"
            >
              <span>{slot.actionText}</span>
              <ArrowUpRight className="w-4 h-4 text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        ))}
      </div>

      {/* Compliance footer note */}
      <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-500">
        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <span>{content.complianceNote}</span>
      </div>
    </section>
  );
};
