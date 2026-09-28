'use client';

import React, { useState } from 'react';
import { Language } from '@/lib/i18n';
import { ToolId } from '@/components/ToolboxGrid';
import { adminStore } from '@/lib/admin-store';
import {
  Map,
  ShieldCheck,
  FileText,
  Lock,
  Cookie,
  Scale,
  Mail,
  Send,
  Building2,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  BookOpen,
  Calculator,
  Briefcase,
  HelpCircle,
  Clock,
  Sparkles,
  Users,
  Target,
} from 'lucide-react';

export type ComplianceTab =
  | 'sitemap'
  | 'about'
  | 'terms'
  | 'privacy'
  | 'cookies'
  | 'affiliates'
  | 'contact';

interface SiteCompliancePagesProps {
  lang: Language;
  initialTab?: ComplianceTab;
  onSelectTool: (tool: ToolId) => void;
  onNavigateToArticle?: (articleId: string) => void;
}

export const SiteCompliancePages: React.FC<SiteCompliancePagesProps> = ({
  lang,
  initialTab = 'sitemap',
  onSelectTool,
  onNavigateToArticle,
}) => {
  const [activeTab, setActiveTab] = useState<ComplianceTab>(initialTab);

  // Contact Form State
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: 'general',
    message: '',
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      alert(lang === 'pt' ? 'Por favor, preencha todos os campos obrigatórios.' : 'Veuillez remplir tous les champs.');
      return;
    }

    adminStore.logEvent({
      id: `contact-${Date.now()}`,
      timestamp: 'Agora mesmo',
      type: 'newsletter_signup',
      summary: `Mensagem de Contato enviada por ${contactForm.name} (${contactForm.email})`,
      location: 'Québec, Canada',
      details: `Assunto: ${contactForm.subject} | Mensagem: ${contactForm.message.slice(0, 60)}...`,
    });

    setContactSubmitted(true);
  };

  const tabs = [
    { id: 'sitemap' as ComplianceTab, label: lang === 'pt' ? '🗺️ Mapa do Site' : lang === 'fr' ? '🗺️ Plan du Site' : '🗺️ Sitemap', icon: Map },
    { id: 'about' as ComplianceTab, label: lang === 'pt' ? '🏢 Sobre Nós (E-E-A-T)' : lang === 'fr' ? '🏢 À Propos' : '🏢 About Us', icon: Building2 },
    { id: 'terms' as ComplianceTab, label: lang === 'pt' ? '📜 Termos de Uso' : lang === 'fr' ? '📜 Conditions' : '📜 Terms', icon: FileText },
    { id: 'privacy' as ComplianceTab, label: lang === 'pt' ? '🔒 Privacidade (Lei 25)' : lang === 'fr' ? '🔒 Confidentialité' : '🔒 Privacy', icon: Lock },
    { id: 'cookies' as ComplianceTab, label: lang === 'pt' ? '🍪 Cookies' : lang === 'fr' ? '🍪 Témoins' : '🍪 Cookies', icon: Cookie },
    { id: 'affiliates' as ComplianceTab, label: lang === 'pt' ? '⚖️ Política Editorial' : lang === 'fr' ? '⚖️ Déontologie' : '⚖️ Editorial & Affiliates', icon: Scale },
    { id: 'contact' as ComplianceTab, label: lang === 'pt' ? '📬 Fale Conosco' : lang === 'fr' ? '📬 Nous Joindre' : '📬 Contact Us', icon: Mail },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Conformidade com Google AdSense, Lei 25 do Québec & Padrões Internacionais</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
          {lang === 'pt'
            ? 'Transparência, Mapa do Site & Políticas Oficiais'
            : lang === 'fr'
            ? 'Transparence, Plan du Site & Politiques Officielles'
            : 'Transparency, Sitemap & Official Policies'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          {lang === 'pt'
            ? 'Navegue pela árvore completa de recursos do portal PaieNet, consulte nossas fontes fiscais auditadas (Revenu Québec e CRA), políticas de privacidade e canais de contato direto.'
            : 'Consultez l’arborescence complète du portail, nos sources fiscales officielles (Revenu Québec, ARC) et nos engagements de confidentialité.'}
        </p>

        {/* Tab Buttons */}
        <div className="pt-4 flex flex-wrap gap-2 border-t border-white/10">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tab Content Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
        {/* ============================================================== */}
        {/* TAB 1: SITEMAP (MAPA DO SITE VISUAL INTERATIVO E INDEXÁVEL)     */}
        {/* ============================================================== */}
        {activeTab === 'sitemap' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                Arquitetura da Informação & Indexação SEO
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-2">
                Mapa do Site Completo (Sitemap Visual)
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Acesse diretamente qualquer simulador, calculadora setorial, guia de carreira, artigo temático ou canal de atendimento do portal.
              </p>
            </div>

            {/* Sitemap Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Category 1: Calculadoras */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
                <div className="flex items-center gap-2 text-blue-700 font-extrabold text-sm">
                  <Calculator className="w-4 h-4" />
                  <h3>Calculadoras Salariais & Fiscais</h3>
                </div>
                <ul className="space-y-2 text-xs text-slate-700">
                  <li>
                    <button
                      type="button"
                      onClick={() => onSelectTool('net-calc')}
                      className="hover:text-blue-600 font-semibold text-left transition-colors flex items-center justify-between w-full"
                    >
                      <span>• Calculadora de Salário Líquido (Barèmes 2026)</span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onSelectTool('converter')}
                      className="hover:text-blue-600 text-left transition-colors flex items-center justify-between w-full"
                    >
                      <span>• Conversor de Frequências (Hora, Quinzena, Mês, Ano)</span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onSelectTool('raise')}
                      className="hover:text-blue-600 text-left transition-colors flex items-center justify-between w-full"
                    >
                      <span>• Simulador de Aumento Salarial & Ganho Líquido</span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onSelectTool('overtime')}
                      className="hover:text-blue-600 text-left transition-colors flex items-center justify-between w-full"
                    >
                      <span>• Horas Extras CNESST (1,5× e 2,0×)</span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onSelectTool('vacation-holidays')}
                      className="hover:text-blue-600 text-left transition-colors flex items-center justify-between w-full"
                    >
                      <span>• Férias & Os 8 Feriados Oficiais (Regra 1/20)</span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onSelectTool('rrsp-savings')}
                      className="hover:text-blue-600 text-left transition-colors flex items-center justify-between w-full"
                    >
                      <span>• Simulador de Aporte REER/CELIAPP & Match da Empresa</span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                    </button>
                  </li>
                </ul>
              </div>

              {/* Category 2: Carreira & RH */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
                <div className="flex items-center gap-2 text-indigo-700 font-extrabold text-sm">
                  <Briefcase className="w-4 h-4" />
                  <h3>Ferramentas de Carreira & RH</h3>
                </div>
                <ul className="space-y-2 text-xs text-slate-700">
                  <li>
                    <button
                      type="button"
                      onClick={() => onSelectTool('resume-builder')}
                      className="hover:text-indigo-600 font-semibold text-left transition-colors flex items-center justify-between w-full"
                    >
                      <span>• Construtor de Currículo ATS (Padrão Canadense)</span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onSelectTool('interview-simulator')}
                      className="hover:text-indigo-600 text-left transition-colors flex items-center justify-between w-full"
                    >
                      <span>• Simulador de Entrevistas (Método STAR)</span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onSelectTool('tech-tests')}
                      className="hover:text-indigo-600 text-left transition-colors flex items-center justify-between w-full"
                    >
                      <span>• Testes Técnicos & Avaliação Pré-Emprego</span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onSelectTool('compare-jobs')}
                      className="hover:text-indigo-600 text-left transition-colors flex items-center justify-between w-full"
                    >
                      <span>• Comparador de Propostas de Trabalho</span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onSelectTool('factory-stub')}
                      className="hover:text-indigo-600 text-left transition-colors flex items-center justify-between w-full"
                    >
                      <span>• Estudo de Caso Real: Holerite Biscuits Leclerc</span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                    </button>
                  </li>
                </ul>
              </div>

              {/* Category 3: Artigos do Blog por Público */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
                <div className="flex items-center gap-2 text-purple-700 font-extrabold text-sm">
                  <BookOpen className="w-4 h-4" />
                  <h3>Blog & Guias por Público-Alvo</h3>
                </div>
                <ul className="space-y-2 text-xs text-slate-700">
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectTool('blog');
                        if (onNavigateToArticle) onNavigateToArticle('talon-de-paie-explications');
                      }}
                      className="hover:text-purple-600 text-left transition-colors flex items-center justify-between w-full"
                    >
                      <span>• [B2C] Entendendo o Holerite: RRQ, RQAP e 16,5%</span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectTool('blog');
                        if (onNavigateToArticle) onNavigateToArticle('cv-format-canadien');
                      }}
                      className="hover:text-purple-600 text-left transition-colors flex items-center justify-between w-full"
                    >
                      <span>• [Imigrantes] CV Canadense sem Foto & Filtros ATS</span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectTool('blog');
                        if (onNavigateToArticle) onNavigateToArticle('cnesst-normes-travail');
                      }}
                      className="hover:text-purple-600 text-left transition-colors flex items-center justify-between w-full"
                    >
                      <span>• [B2B / RH] Normas CNESST, Horas Extras e 8 Feriados</span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectTool('blog');
                        if (onNavigateToArticle) onNavigateToArticle('remises-argent-international');
                      }}
                      className="hover:text-purple-600 text-left transition-colors flex items-center justify-between w-full"
                    >
                      <span>• [Expatriados] Remessas Internacionais sem Spread Oculto</span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectTool('blog');
                        if (onNavigateToArticle) onNavigateToArticle('reer-celiapp-optimisation');
                      }}
                      className="hover:text-purple-600 text-left transition-colors flex items-center justify-between w-full"
                    >
                      <span>• [Poupadores] Restituição de Imposto REER & CELIAPP</span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                    </button>
                  </li>
                </ul>
              </div>

              {/* Category 4: Empresas & Publicidade */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
                <div className="flex items-center gap-2 text-amber-700 font-extrabold text-sm">
                  <Building2 className="w-4 h-4" />
                  <h3>Área para Empresas & Publicidade</h3>
                </div>
                <ul className="space-y-2 text-xs text-slate-700">
                  <li>
                    <button
                      type="button"
                      onClick={() => onSelectTool('media-kit')}
                      className="hover:text-amber-600 font-semibold text-left transition-colors flex items-center justify-between w-full"
                    >
                      <span>• Mídia Kit 2026 & Matriz de Lotes (1 a 9)</span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onSelectTool('media-kit')}
                      className="hover:text-amber-600 text-left transition-colors flex items-center justify-between w-full"
                    >
                      <span>• Patrocínio Exclusivo de Categoria ou Seção</span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onSelectTool('media-kit')}
                      className="hover:text-amber-600 text-left transition-colors flex items-center justify-between w-full"
                    >
                      <span>• Co-Branding nos Relatórios PDF de Holerite</span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onSelectTool('media-kit')}
                      className="hover:text-amber-600 text-left transition-colors flex items-center justify-between w-full"
                    >
                      <span>• Vagas em Destaque no Mural B2B</span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onSelectTool('media-kit')}
                      className="hover:text-amber-600 text-left transition-colors flex items-center justify-between w-full"
                    >
                      <span>• Simulador de ROI & Custo por Lead (CPL)</span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                    </button>
                  </li>
                </ul>
              </div>

              {/* Category 5: Institucional & Conformidade */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
                <div className="flex items-center gap-2 text-emerald-700 font-extrabold text-sm">
                  <ShieldCheck className="w-4 h-4" />
                  <h3>Políticas & Conformidade Google</h3>
                </div>
                <ul className="space-y-2 text-xs text-slate-700">
                  <li>
                    <button
                      type="button"
                      onClick={() => setActiveTab('about')}
                      className="hover:text-emerald-600 text-left transition-colors flex items-center justify-between w-full"
                    >
                      <span>• Quem Somos & Princípios E-E-A-T do Google</span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => setActiveTab('terms')}
                      className="hover:text-emerald-600 text-left transition-colors flex items-center justify-between w-full"
                    >
                      <span>• Termos e Condições de Uso da Plataforma</span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => setActiveTab('privacy')}
                      className="hover:text-emerald-600 text-left transition-colors flex items-center justify-between w-full"
                    >
                      <span>• Política de Privacidade (Lei 25 QC & PIPEDA)</span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => setActiveTab('cookies')}
                      className="hover:text-emerald-600 text-left transition-colors flex items-center justify-between w-full"
                    >
                      <span>• Política de Cookies & Consentimento</span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => setActiveTab('affiliates')}
                      className="hover:text-emerald-600 text-left transition-colors flex items-center justify-between w-full"
                    >
                      <span>• Divulgação de Afiliados (FTC / AdSense)</span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => setActiveTab('contact')}
                      className="hover:text-emerald-600 text-left transition-colors flex items-center justify-between w-full"
                    >
                      <span>• Fale Conosco & Atendimento Comercial</span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                    </button>
                  </li>
                </ul>
              </div>

              {/* Category 6: Fontes Governamentais */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
                <div className="flex items-center gap-2 text-slate-800 font-extrabold text-sm">
                  <ExternalLink className="w-4 h-4" />
                  <h3>Bases & Fontes Oficiais Auditadas</h3>
                </div>
                <ul className="space-y-2 text-xs text-slate-700">
                  <li>
                    <a
                      href="https://www.revenuquebec.ca/fr/entreprises/retenues-et-cotisations/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-600 text-left transition-colors flex items-center justify-between w-full"
                    >
                      <span>• Revenu Québec: Tables TP-1015.3</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.canada.ca/fr/agence-revenu/services/impot/entreprises/sujets/retenues-paie.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-600 text-left transition-colors flex items-center justify-between w-full"
                    >
                      <span>• Agence du revenu du Canada: Guide T4127</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.cnesst.gouv.qc.ca/fr/normes-travail"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-600 text-left transition-colors flex items-center justify-between w-full"
                    >
                      <span>• CNESST: Normes du travail au Québec</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.rrq.gouv.qc.ca"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-600 text-left transition-colors flex items-center justify-between w-full"
                    >
                      <span>• Régime de rentes du Québec (RRQ)</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: SOBRE NÓS (ABOUT US - E-E-A-T GOOGLE CONFORMANCE)        */}
        {/* ============================================================== */}
        {activeTab === 'about' && (
          <div className="space-y-6 animate-in fade-in duration-200 text-slate-700 text-xs sm:text-sm leading-relaxed">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                Experiência, Expertise, Autoridade & Confiança (E-E-A-T)
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-2">
                Quem Somos • PaieNet Québec
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                A plataforma de inteligência salarial independente mais precisa e abrangente do Québec.
              </p>
            </div>

            <div className="space-y-4">
              <p>
                O <strong>PaieNet Québec</strong> nasceu com o propósito de democratizar a compreensão tributária e trabalhista na província do Québec. Em um cenário onde as deduções da folha de pagamento conjugam legislações provinciais e federais distintas (com retenções como RRQ, RQAP, seguro-desemprego com alíquota especial e o abatimento único de 16,5%), milhares de profissionais assalariados e novos imigrantes enfrentavam dificuldades para auditar seus holerites ou avaliar propostas de trabalho.
              </p>
              <p>
                Nossa ferramenta matemática reproduz com exatidão até o centavo as fórmulas estabelecidas pelas tabelas oficiais <strong>TP-1015.3 do Revenu Québec</strong> e pelo <strong>Guide des retenues sur la paie T4127 da Agência de Rendas do Canadá (CRA)</strong> para os anos de 2025 e 2026.
              </p>
            </div>

            {/* 3 Pillars of Trust */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200 space-y-1.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                  ✓
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm">Precisão Algorítmica 100%</h4>
                <p className="text-xs text-slate-600">
                  Cálculo rigoroso de cada faixa marginal, isenção básica provincial de $18.571 e teto de cotização pública.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-1.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                  🔒
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm">Privacidade Total do Usuário</h4>
                <p className="text-xs text-slate-600">
                  Nenhum valor digitado de salário é armazenado em bancos de dados. O cálculo ocorre inteiramente no seu navegador.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-200 space-y-1.5">
                <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold">
                  ⚖️
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm">Independência Editorial</h4>
                <p className="text-xs text-slate-600">
                  Nenhuma parceria comercial ou anúncio interfere no resultado dos cálculos. O rigor fiscal é nosso compromisso inegociável.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
              <span className="font-bold text-slate-900 block">Comitê Editorial & Responsabilidade Técnica</span>
              <p>
                Os artigos e calculadoras são revisados periodicamente com base nas atualizações publicadas pelo Ministério das Finanças do Québec e pela CNESST. Se você identificar qualquer alteração nos barèmes ou tiver dúvidas conceituais, fale diretamente com nossa equipe editorial pelo e-mail <strong>editorial@paienet.qc.ca</strong>.
              </p>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: TERMOS DE USO (TERMS OF SERVICE)                         */}
        {/* ============================================================== */}
        {activeTab === 'terms' && (
          <div className="space-y-6 animate-in fade-in duration-200 text-slate-700 text-xs sm:text-sm leading-relaxed">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full">
                Documento Legal
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-2">
                Termos e Condições de Uso
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Última atualização: 2026. Aplicável a todos os usuários e visitantes.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-sm">1. Natureza Informativa e Simulatória</h4>
              <p>
                O PaieNet Québec é um simulador computacional independente destinado a estimativas educacionais e de planejamento salarial. Embora nos esforcemos para manter todas as fórmulas matemáticas em conformidade estrita com as publicações de Revenu Québec e CRA, o resultado gerado <strong>não constitui parecer formal contábil ou fiscal</strong> emitido por membro da Ordem dos CPAs do Québec.
              </p>

              <h4 className="font-bold text-slate-900 text-sm">2. Propriedade Intelectual</h4>
              <p>
                O layout, a identidade visual, a arquitetura dos simuladores, os algoritmos e os artigos disponibilizados no portal são protegidos pela legislação de direitos autorais e propriedade intelectual do Canadá. É vedada a reprodução comercial sem prévia autorização por escrito.
              </p>

              <h4 className="font-bold text-slate-900 text-sm">3. Isenção de Responsabilidade</h4>
              <p>
                A administração do portal não se responsabiliza por eventuais divergências decorrentes de convenções coletivas específicas de trabalho, benefícios negociados em acordos sindicais fechados ou variações pontuais na folha de pagamento praticada por empregadores específicos.
              </p>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: POLÍTICA DE PRIVACIDADE (LEI 25 QC & PIPEDA)             */}
        {/* ============================================================== */}
        {activeTab === 'privacy' && (
          <div className="space-y-6 animate-in fade-in duration-200 text-slate-700 text-xs sm:text-sm leading-relaxed">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Conformidade com a Lei 25 do Québec & PIPEDA
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-2">
                Política de Privacidade & Proteção de Dados
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Como tratamos suas informações e asseguramos seu sigilo absoluto.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-sm">1. Princípio da Minimização de Dados (Client-Side Computing)</h4>
              <p>
                Diferente de sistemas corporativos que armazenam dados sigilosos em nuvem, o motor de cálculo do PaieNet executa <strong>100% no navegador do próprio usuário</strong>. Os números inseridos (salário bruto, horas extras, adicionais de turno e deduções de seguro) nunca são gravados em servidores remotos nem vendidos a terceiros.
              </p>

              <h4 className="font-bold text-slate-900 text-sm">2. Google AdSense & Cookies Publicitários</h4>
              <p>
                Para manter a plataforma gratuita, exibimos publicidades através da rede <strong>Google AdSense</strong>. O Google e seus parceiros utilizam cookies para veicular anúncios com base em visitas anteriores dos usuários a este e a outros sites da Internet. Você pode desativar a publicidade personalizada acessando as <em>Configurações de anúncios do Google</em> ou o portal <em>aboutads.info</em>.
              </p>

              <h4 className="font-bold text-slate-900 text-sm">3. Direitos do Usuário sob a Lei 25 do Québec</h4>
              <p>
                Em conformidade com a Lei 25 do Québec sobre proteção de informações pessoais, qualquer usuário pode solicitar o cancelamento de sua assinatura na newsletter ou o apagamento de dados fornecidos voluntariamente através do e-mail <strong>privacidade@paienet.qc.ca</strong>.
              </p>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 5: POLÍTICA DE COOKIES & CONSENTIMENTO                      */}
        {/* ============================================================== */}
        {activeTab === 'cookies' && (
          <div className="space-y-6 animate-in fade-in duration-200 text-slate-700 text-xs sm:text-sm leading-relaxed">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                Gestão de Consentimento
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-2">
                Política de Cookies & Tecnologias de Rastreamento
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Conheça os cookies utilizados e como gerenciá-los no seu dispositivo.
              </p>
            </div>

            <div className="space-y-4">
              <p>
                Cookies são pequenos arquivos de texto armazenados no seu dispositivo para memorizar preferências (como o idioma selecionado: Português, Francês ou Inglês) e permitir o funcionamento de ferramentas analíticas e publicitárias.
              </p>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-900 block text-xs">1. Cookies Estritamente Necessários</span>
                  <span className="text-xs text-slate-600 block mt-0.5">
                    Permitem salvar suas preferências de visualização, cálculo recente e idioma sem coletar identificação pessoal.
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-900 block text-xs">2. Cookies Analíticos (Google Analytics)</span>
                  <span className="text-xs text-slate-600 block mt-0.5">
                    Coletam dados anônimos de navegação para entendermos quais calculadoras são mais utilizadas e aprimorarmos a usabilidade.
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-900 block text-xs">3. Cookies de Publicidade Programática (Google AdSense)</span>
                  <span className="text-xs text-slate-600 block mt-0.5">
                    Utilizados para exibir anúncios relevantes e medir o desempenho das campanhas exibidas nas vitrines do portal.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 6: POLÍTICA EDITORIAL & DIVULGAÇÃO DE AFILIADOS (FTC)       */}
        {/* ============================================================== */}
        {activeTab === 'affiliates' && (
          <div className="space-y-6 animate-in fade-in duration-200 text-slate-700 text-xs sm:text-sm leading-relaxed">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                Transparência Comercial & Conformidade FTC
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-2">
                Política Editorial & Divulgação de Afiliados
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Nosso compromisso de separação entre publicidade e integridade algorítmica.
              </p>
            </div>

            <div className="space-y-4">
              <p>
                Em conformidade com as diretrizes da <strong>Federal Trade Commission (FTC)</strong>, da <strong>Ad Standards Canada</strong> e das políticas para webmasters do <strong>Google</strong>, informamos que certos links em nossos artigos e cards de recomendação são <em>links de afiliados</em>.
              </p>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-2">
                <span className="font-black text-xs uppercase tracking-wider block text-amber-900">
                  O que isso significa na prática?
                </span>
                <p className="text-xs leading-relaxed">
                  Quando você clica em um link de parceiro auditado (como Desjardins, Wealthsimple ou Wise) e realiza a abertura de uma conta ou contratação de serviço, o PaieNet pode receber uma compensação financeira. <strong>Isso não acarreta nenhum custo adicional para você</strong> e, em muitos casos, garante acesso a bônus de abertura exclusivos negociados para nossa comunidade.
                </p>
              </div>

              <h4 className="font-bold text-slate-900 text-sm">Garantia de Independência Técnica</h4>
              <p>
                A inclusão de um parceiro afiliado nunca altera as fórmulas ou o cálculo do salário líquido. Recomendamos apenas serviços bancários, de imigração ou de carreira que comprovadamente atendem aos mais altos padrões de qualidade no mercado do Québec.
              </p>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 7: FALE CONOSCO & CONTATO OFICIAL (GOOGLE ADSENSE REQUIREMENT) */}
        {/* ============================================================== */}
        {activeTab === 'contact' && (
          <div className="space-y-6 animate-in fade-in duration-200 text-slate-700 text-xs sm:text-sm leading-relaxed">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                Atendimento Direto & Suporte Comercial
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-2">
                Fale Conosco • Nous Joindre
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Dúvidas editoriais, parcerias B2B ou suporte com nossos simuladores.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Contact Info Column */}
              <div className="space-y-4">
                <h4 className="font-black text-slate-900 text-base">Canais de Atendimento</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Nossa equipe responde a todas as mensagens comerciais e dúvidas fiscais no prazo máximo de 24 horas úteis.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                    <Mail className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[11px] text-slate-400 font-bold block uppercase">E-mail Comercial & Mídia Kit</span>
                      <a href="mailto:comercial@paienet.qc.ca" className="font-bold text-slate-900 hover:text-blue-600">
                        comercial@paienet.qc.ca
                      </a>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                    <Mail className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[11px] text-slate-400 font-bold block uppercase">Comitê Editorial & Fiscal</span>
                      <a href="mailto:editorial@paienet.qc.ca" className="font-bold text-slate-900 hover:text-indigo-600">
                        editorial@paienet.qc.ca
                      </a>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                    <Building2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[11px] text-slate-400 font-bold block uppercase">Sede de Representação</span>
                      <span className="text-xs text-slate-700 block font-medium">
                        Montréal (QC), Canadá • H3B 2Y5
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Functional Contact Form */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
                {contactSubmitted ? (
                  <div className="text-center py-8 space-y-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h4 className="font-black text-slate-900 text-base">Mensagem Enviada com Sucesso!</h4>
                    <p className="text-xs text-slate-600">
                      Obrigado pelo contato. Retornaremos ao seu e-mail em até 24 horas úteis.
                    </p>
                    <button
                      type="button"
                      onClick={() => setContactSubmitted(false)}
                      className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
                    >
                      Enviar Outra Mensagem
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Seu Nome Completo *</label>
                      <input
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        placeholder="Ex: Carlos Mendes"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-blue-600"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Seu E-mail Corporativo ou Pessoal *</label>
                      <input
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder="Ex: carlos@empresa.com"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-blue-600"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Assunto</label>
                      <select
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-blue-600"
                      >
                        <option value="general">Dúvida Geral sobre os Cálculos</option>
                        <option value="commercial">Anúncio / Mídia Kit / Parcerias B2B</option>
                        <option value="editorial">Sugestão Editorial ou de Artigo</option>
                        <option value="bug">Reportar Discrepância de Dedução</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Mensagem *</label>
                      <textarea
                        required
                        rows={4}
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        placeholder="Como podemos ajudar você ou sua empresa?"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-blue-600 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Enviar Mensagem</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
