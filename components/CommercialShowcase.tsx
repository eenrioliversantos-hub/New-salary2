'use client';

import React, { useState, useMemo, useSyncExternalStore } from 'react';
import { Language } from '@/lib/i18n';
import { ToolId } from '@/components/ToolboxGrid';
import { adminStore, B2BSponsorInquiry, AdSlotConfig } from '@/lib/admin-store';
import {
  Megaphone,
  Building2,
  TrendingUp,
  Target,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Eye,
  MousePointerClick,
  Users,
  DollarSign,
  Layers,
  FileText,
  Calendar,
  Clock,
  ExternalLink,
  ChevronRight,
  Calculator,
  Briefcase,
  HelpCircle,
  Award,
  Zap,
  Check,
  ArrowLeft,
  MapPin,
  Send,
  Radio,
  FileCheck,
} from 'lucide-react';

export type B2BTab = 'catalog' | 'sponsorship' | 'jobs' | 'map';

interface CommercialShowcaseProps {
  lang: Language;
  onSelectTool: (tool: ToolId) => void;
  onOpenProModal?: () => void;
  initialTab?: B2BTab;
}

const emptySubscribe = () => () => {};

export const CommercialShowcase: React.FC<CommercialShowcaseProps> = ({
  lang,
  onSelectTool,
  initialTab = 'catalog',
}) => {
  // Active B2B Tab
  const [activeTab, setActiveTab] = useState<B2BTab>(initialTab);

  // Sync with adminStore to get live dynamic ad slots and jobs
  const isMounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const liveAdSlots = isMounted ? adminStore.getAdSlots() : [];
  const liveJobPostings = isMounted ? adminStore.getB2BJobs() : [];

  // Simulator State
  const [selectedSegment, setSelectedSegment] = useState<'banking' | 'insurance' | 'recruitment' | 'immigration' | 'education'>('banking');
  const [budgetSlider, setBudgetSlider] = useState<number>(550);

  // Selected Lot for checkout / inquiry
  const [selectedLotId, setSelectedLotId] = useState<string>('salary-results');
  const [selectedDuration, setSelectedDuration] = useState<'monthly' | 'quarterly' | 'biannual' | 'one_time'>('quarterly');
  const [catalogFilter, setCatalogFilter] = useState<'all' | 'banners' | 'sponsorship' | 'content' | 'jobs'>('all');

  // Interactive Map: Selected space
  const [selectedMapSpaceId, setSelectedMapSpaceId] = useState<string>('salary-results');

  // Form State
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    websiteUrl: '',
    message: '',
  });

  const [submittedInquiry, setSubmittedInquiry] = useState<B2BSponsorInquiry | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Complete List of All Available Advertising Spaces across all portal pages
  const allPortalSpaces = useMemo(() => [
    {
      id: 'home-top',
      name: lang === 'pt' ? '1. Topo Header Global (Leaderboard)' : lang === 'fr' ? '1. En-tête Principal (Leaderboard Top)' : '1. Top Header Global Leaderboard',
      page: 'Home / Calculateur Principal',
      urlPath: '/?tool=net-calc#home-top',
      dimensions: '728×90 px (Desktop) / 320×50 px (Mobile)',
      monthlyPriceCad: 380,
      monthlyViews: '35.000+',
      avgCtr: '3.8%',
      status: 'available',
      statusLabel: lang === 'pt' ? 'Disponível para Reserva' : 'Disponible',
      bestFor: lang === 'pt' ? 'Bancos, Cooperativas (Desjardins/BMO), Telecomunicações' : 'Banques, Télécoms, Assurances collectives',
      description: lang === 'pt' ? 'Primeiro elemento visível no carregamento do portal, logo abaixo do cabeçalho de navegação.' : 'Premier élément visuel au-dessus de la calculatrice de paie.',
      previewSnippet: 'Banner Leaderboard Institucional com logo, chamada comercial e botão direto rastreado com UTM.',
    },
    {
      id: 'salary-results',
      name: lang === 'pt' ? '2. Pós-Salário Líquido (Zona Prime de Conversão)' : lang === 'fr' ? '2. Post-Talon de Paie (Zone Prime)' : '2. Post-Net Paystub (Prime Conversion Zone)',
      page: 'Página de Resultados & Contracheque',
      urlPath: '/?tool=net-calc#salary-results',
      dimensions: '640×160 px (Responsive Wide)',
      monthlyPriceCad: 520,
      monthlyViews: '28.000+',
      avgCtr: '5.4%',
      status: 'high_demand',
      statusLabel: lang === 'pt' ? 'Mais Cobiçado (Alta Intenção)' : 'Zone Prime à Forte Intention',
      bestFor: lang === 'pt' ? 'Planos REER / CELIAPP, Empréstimos, Cartões de Crédito sem anuidade' : 'Comptes REER/CELIAPP, Prêts personnels, Cartes de crédit',
      description: lang === 'pt' ? 'Exibido imediatamente após a linha do salário líquido e deduções de impostos.' : 'S’affiche directement sous le résultat net en poche calculé.',
      previewSnippet: 'Destaque nativo com cálculo de economia fiscal e botão direto de abertura de conta ou simulação.',
    },
    {
      id: 'tools-section',
      name: lang === 'pt' ? '3. Faixa Superior da Grade de Ferramentas' : lang === 'fr' ? '3. Ruban de la Boîte à Outils' : '3. Toolbox Grid Showcase Ribbon',
      page: 'Seção de Ferramentas / Toolbox',
      urlPath: '/#toolbox-section',
      dimensions: '728×90 px / Responsive Card',
      monthlyPriceCad: 340,
      monthlyViews: '22.000+',
      avgCtr: '4.1%',
      status: 'available',
      statusLabel: lang === 'pt' ? 'Disponível' : 'Disponible',
      bestFor: lang === 'pt' ? 'Agências de Recrutamento, Cursos de Francês, Softwares de Ponto e Folha' : 'Agences de placement, Écoles de langues, Logiciels RH',
      description: lang === 'pt' ? 'Posicionado no divisor que conecta os cálculos à grade de todas as ferramentas úteis.' : 'Positionné entre la calculatrice et la grille complète des outils professionnels.',
      previewSnippet: 'Faixa destacada com slogan da sua empresa conectando trabalhadores a novas oportunidades de carreira.',
    },
    {
      id: 'comparator-spotlight',
      name: lang === 'pt' ? '4. Destaque no Comparador Interprovincial' : lang === 'fr' ? '4. Encart Comparateur Interprovincial' : '4. Interprovincial Comparator Spotlight',
      page: 'Comparador de Salários entre Províncias',
      urlPath: '/?tool=canada-provinces',
      dimensions: 'Native Box 600×140 px',
      monthlyPriceCad: 420,
      monthlyViews: '19.000+',
      avgCtr: '5.1%',
      status: 'exclusive',
      statusLabel: lang === 'pt' ? 'Exclusividade de Categoria' : 'Exclusivité Thématique',
      bestFor: lang === 'pt' ? 'Empresas de Mudança, Câmbio Internacional (Wise), Bancos com atuação nacional' : 'Services de déménagement, Banques nationales, Remises d’argent',
      description: lang === 'pt' ? 'Exibido no comparador frente a frente para quem está planejando mudar de província no Canadá.' : 'Intégré au comparateur des 13 provinces et territoires pour les travailleurs mobiles.',
      previewSnippet: 'Sua marca como parceira oficial de quem está se mudando para o Québec, Ontário ou Alberta.',
    },
    {
      id: 'resume-builder',
      name: lang === 'pt' ? '5. Chancela no Construtor de Currículos ATS' : lang === 'fr' ? '5. Commandite Créateur de CV Canadien' : '5. ATS Resume Builder Co-Branding',
      page: 'Construtor de CV Format Canadien',
      urlPath: '/?tool=resume-builder',
      dimensions: 'Logo de Chancela + Banner de Envio 300×250',
      monthlyPriceCad: 450,
      monthlyViews: '16.000+',
      avgCtr: '6.2%',
      status: 'available',
      statusLabel: lang === 'pt' ? 'Disponível' : 'Disponible',
      bestFor: lang === 'pt' ? 'Empresas com Vagas Abertas, Consultorias de RH, Plataformas de Vagas' : 'Plateformes d’emploi, Cabinets de recrutement, Job boards',
      description: lang === 'pt' ? 'Chancela oficial "Envie seu currículo recém-gerado diretamente para as vagas da [Sua Empresa]".' : 'Permet aux candidats ayant terminé leur CV de postuler en un clic chez vous.',
      previewSnippet: 'Aparece na tela final após a conclusão do currículo formatado no padrão canadense.',
    },
    {
      id: 'interview-simulator',
      name: lang === 'pt' ? '6. Patrocínio do Simulador de Entrevistas STAR' : lang === 'fr' ? '6. Commandite Simulateur d’Entrevues STAR' : '6. STAR Interview Simulator Takeover',
      page: 'Simulador de Entrevistas Comportamentais',
      urlPath: '/?tool=interview-simulator',
      dimensions: 'Native Card Interativo 540×120 px',
      monthlyPriceCad: 390,
      monthlyViews: '14.000+',
      avgCtr: '4.8%',
      status: 'available',
      statusLabel: lang === 'pt' ? 'Disponível' : 'Disponible',
      bestFor: lang === 'pt' ? 'Escolas de Francês (UQAM/Concordia), Coaching de Carreira, Cursos de Francês Profissional' : 'Écoles de francisation, Formations continues, Coachs de carrière',
      description: lang === 'pt' ? 'Posicionado no topo das perguntas de entrevista, onde profissionais treinam respostas comportamentais.' : 'Offert aux candidats en préparation intensive d’entrevue d’embauche.',
      previewSnippet: 'Destaque como centro preparatório de idiomas ou coaching parceiro para aprovação em vagas no Québec.',
    },
    {
      id: 'blog-article',
      name: lang === 'pt' ? '7. Artigo de Blog Nativo Patrocinado (SEO)' : lang === 'fr' ? '7. Article Commandité & Do-Follow Permanent' : '7. Sponsored Native Article & Do-Follow Backlink',
      page: 'Blog & Conhecimento Fiscal',
      urlPath: '/?tool=blog',
      dimensions: 'Artigo Completo com Fotos + Links Do-Follow',
      monthlyPriceCad: 490,
      monthlyViews: 'Vitalício (Tráfego Orgânico)',
      avgCtr: '7.5%',
      status: 'available',
      statusLabel: lang === 'pt' ? 'Investimento Único / Vitalício' : 'Paiement Unique / Permanent',
      bestFor: lang === 'pt' ? 'Fintechs, Empresas de Imigração, Consultorias Fiscais, Seguradoras' : 'Fintechs, Avocats en immigration, Firmes de comptables CPA',
      description: lang === 'pt' ? 'Publicação permanente indexada no Google com recomendação da sua solução e 2 links do-follow.' : 'Référencement SEO pérenne avec autorité de domaine et liens indexés sur Google.',
      previewSnippet: 'Artigo editorial de 1.200 palavras escrito por nossa equipe jornalística focado nas buscas do seu nicho.',
    },
    {
      id: 'resources-hub',
      name: lang === 'pt' ? '8. Patrocínio no Acervo de Guias & Infoprodutos' : lang === 'fr' ? '8. Commandite Centre de Téléchargements' : '8. Resource Library Header Spotlight',
      page: 'Acervo de Guias & E-books',
      urlPath: '/?tool=resources',
      dimensions: 'Banner Topo 600×140 + Co-branding nos PDFs',
      monthlyPriceCad: 460,
      monthlyViews: '18.000+',
      avgCtr: '5.8%',
      status: 'available',
      statusLabel: lang === 'pt' ? 'Disponível' : 'Disponible',
      bestFor: lang === 'pt' ? 'Marcas institucionais que querem associação a autoridade e conhecimento técnico' : 'Institutions d’enseignement, Associations professionnelles',
      description: lang === 'pt' ? 'Sua marca estampada no topo da biblioteca de guias fiscais e templates de currículo.' : 'Visibilité maximale sur la page de ressources gratuites et guides officiels.',
      previewSnippet: 'Associação direta a todo material baixado por profissionais e novos residentes no Québec.',
    },
    {
      id: 'footer-wide',
      name: lang === 'pt' ? '9. Rodapé Amplo Global (Super-Banner)' : lang === 'fr' ? '9. Super-Bannière Bas de Page (Global)' : '9. Global Footer Super-Banner',
      page: 'Rodapé de Todas as Páginas',
      urlPath: '/#footer-sponsor',
      dimensions: '970×90 px / 728×90 px Responsivo',
      monthlyPriceCad: 290,
      monthlyViews: '48.000+ (Todas as Páginas)',
      avgCtr: '2.9%',
      status: 'available',
      statusLabel: lang === 'pt' ? 'Excelente Custo/Alcance' : 'Portée Maximale Économique',
      bestFor: lang === 'pt' ? 'Marcas de consumo, Supermercados (Costco/Maxi), Planos de telefonia celular (Fizz/Koodo)' : 'Grande distribution, Forfaits cellulaires, Assurances auto',
      description: lang === 'pt' ? 'Exibido em 100% das páginas do portal no momento em que o leitor atinge a base.' : 'Présence continue sur l’ensemble du site Web PaieNet Québec.',
      previewSnippet: 'Visibilidade ubíqua e constante em toda a audiência que navega no site.',
    },
  ], [lang]);

  // Selected space object
  const currentMapSpace = useMemo(() => {
    return allPortalSpaces.find((s) => s.id === selectedMapSpaceId) || allPortalSpaces[1];
  }, [allPortalSpaces, selectedMapSpaceId]);

  // ROI Calculator helper
  const roiCalculations = useMemo(() => {
    const baseCpl =
      selectedSegment === 'banking' ? 22 :
      selectedSegment === 'insurance' ? 26 :
      selectedSegment === 'recruitment' ? 18 :
      selectedSegment === 'immigration' ? 28 : 16;

    const estimatedLeads = Math.max(1, Math.round(budgetSlider / baseCpl));
    const estimatedClicks = Math.round(estimatedLeads * 5.8);
    const estimatedImpressions = Math.round(estimatedClicks * 22);

    return {
      impressions: estimatedImpressions.toLocaleString(),
      clicks: estimatedClicks.toLocaleString(),
      leads: estimatedLeads,
      cpl: baseCpl,
    };
  }, [selectedSegment, budgetSlider]);

  // Handle Form Submission
  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const targetSpace = allPortalSpaces.find((s) => s.id === selectedLotId) || currentMapSpace;
    const protocolCode = `B2B-${Math.floor(100000 + Math.random() * 900000)}`;

    const savedInquiry = adminStore.submitB2BSponsorInquiry({
      companyName: formData.companyName,
      contactName: formData.contactName,
      email: formData.email,
      phone: formData.phone,
      websiteUrl: formData.websiteUrl,
      slotId: targetSpace.id,
      slotName: targetSpace.name,
      billingDuration: selectedDuration,
      priceCad: targetSpace.monthlyPriceCad,
      message: formData.message,
    });

    setTimeout(() => {
      setSubmittedInquiry(savedInquiry);
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="space-y-8">
      {/* 1. Header Banner & Sub-Navigation between Dedicated B2B Pages */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl space-y-6 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">
            <Building2 className="w-3.5 h-3.5 text-blue-400" />
            <span>PaieNet Corporate & B2B Solutions 2026</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {lang === 'pt'
              ? 'Publicidade, Patrocínios & Recrutamento Corporativo no Québec'
              : lang === 'fr'
              ? 'Solutions d’Affaires, Commandites & Recrutement au Québec'
              : 'Corporate Advertising, Sponsorships & Hiring in Quebec'}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {lang === 'pt'
              ? 'Conecte sua marca ou suas vagas a mais de 48.000 profissionais com renda média de $72.400 CAD, no momento exato em que decidem seus rumos financeiros, fiscais e profissionais.'
              : lang === 'fr'
              ? 'Associez votre entreprise à plus de 48 000 salariés et cadres qualifiés au moment où ils planifient leurs finances et leur carrière.'
              : 'Connect your corporate brand with over 48,000 active Quebec workers calculating paystubs and comparing careers.'}
          </p>
        </div>

        {/* Dedicated Navigation Tabs for each item in the Business Menu */}
        <div className="relative z-10 pt-4 border-t border-white/10 flex flex-wrap items-center gap-2">
          {[
            { id: 'catalog' as B2BTab, icon: Megaphone, label: lang === 'pt' ? 'Mídia Kit & Lotes 2026' : 'Kit Média & Lots' },
            { id: 'sponsorship' as B2BTab, icon: Award, label: lang === 'pt' ? 'Patrocínio Exclusivo' : 'Commandite Exclusive' },
            { id: 'jobs' as B2BTab, icon: Briefcase, label: lang === 'pt' ? 'Divulgação de Vagas & Combos 360°' : 'Offres d’Emploi 360°' },
            { id: 'map' as B2BTab, icon: MapPin, label: lang === 'pt' ? 'Mapa Interativo de Espaços' : 'Plan Interactif des Espaces' },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  window.scrollTo({ top: 120, behavior: 'smooth' });
                }}
                className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${
                  isActive
                    ? 'bg-blue-600 text-white border-blue-400 shadow-md font-extrabold ring-2 ring-blue-400/30'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. TAB 1: MÍDIA KIT & MATRIZ DE LOTES */}
      {activeTab === 'catalog' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Audited Proof Metrics */}
          <div className="space-y-4">
            <div className="text-center max-w-2xl mx-auto space-y-1">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600 block">
                Métricas Reais Auditadas
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Por que o PaieNet Converte 15x Mais que Banners Comuns?
              </h2>
              <p className="text-xs text-slate-500">
                Nossos usuários não estão navegando passivamente. Eles estão calculando salários líquidos, avaliando contracheques e decidindo aportes fiscais.
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1 text-center">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 block">48.200+</span>
                <span className="text-xs font-bold text-slate-500 block">Visitantes Únicos / Mês</span>
                <span className="text-[10px] text-emerald-600 font-bold block pt-1 border-t border-slate-100">
                  +18% Crescimento MoM
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1 text-center">
                <span className="text-2xl sm:text-3xl font-black text-blue-600 block">5m 42s</span>
                <span className="text-xs font-bold text-slate-500 block">Tempo Médio na Página</span>
                <span className="text-[10px] text-blue-600 font-bold block pt-1 border-t border-slate-100">
                  Atenção 100% Focada
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1 text-center">
                <span className="text-2xl sm:text-3xl font-black text-emerald-600 block">4.6%</span>
                <span className="text-xs font-bold text-slate-500 block">CTR Médio em Vitrines</span>
                <span className="text-[10px] text-emerald-700 font-bold block pt-1 border-t border-slate-100">
                  vs 0.3% em Mídia Display Comum
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1 text-center">
                <span className="text-2xl sm:text-3xl font-black text-indigo-600 block">$72.400 CAD</span>
                <span className="text-xs font-bold text-slate-500 block">Renda Média Declarada</span>
                <span className="text-[10px] text-indigo-600 font-bold block pt-1 border-t border-slate-100">
                  Alta Bancarização
                </span>
              </div>
            </div>
          </div>

          {/* ROI Simulator */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Simulador de Projeção de Leads</span>
              </div>
              <h3 className="text-xl font-black text-white">Simule a Eficácia da sua Campanha</h3>
              <p className="text-xs text-slate-300">
                Calcule a estimativa de cliques e leads qualificados de acordo com o segmento da sua empresa.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-6 space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">Segmento de Atuação</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'banking', label: 'Bancos / Fintech' },
                      { id: 'insurance', label: 'Seguros & Benefícios' },
                      { id: 'recruitment', label: 'RH & Vagas' },
                      { id: 'immigration', label: 'Imigração' },
                      { id: 'education', label: 'Idiomas & Cursos' },
                    ].map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSelectedSegment(s.id as any)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                          selectedSegment === s.id
                            ? 'bg-blue-600 border-blue-400 text-white'
                            : 'bg-slate-800 border-slate-700 text-slate-300'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-300 mb-1.5">
                    <span>Investimento Mensal Pretendido:</span>
                    <span className="text-emerald-400 text-sm font-black">${budgetSlider} CAD</span>
                  </div>
                  <input
                    type="range"
                    min="250"
                    max="2500"
                    step="50"
                    value={budgetSlider}
                    onChange={(e) => setBudgetSlider(Number(e.target.value))}
                    className="w-full accent-blue-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>$250 CAD (Piloto)</span>
                    <span>$1.000 CAD (Aceleração)</span>
                    <span>$2.500 CAD (Liderança de Categoria)</span>
                  </div>
                </div>
              </div>

              {/* Simulation Result */}
              <div className="md:col-span-6 bg-white/5 border border-white/10 rounded-2xl p-5 grid grid-cols-2 gap-3 text-center">
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                  <span className="text-xl font-black text-white block">{roiCalculations.impressions}</span>
                  <span className="text-[11px] text-slate-400 block">Impressões Qualificadas</span>
                </div>
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                  <span className="text-xl font-black text-blue-400 block">{roiCalculations.clicks}</span>
                  <span className="text-[11px] text-slate-400 block">Cliques Diretos (CTR ~4.6%)</span>
                </div>
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                  <span className="text-xl font-black text-emerald-400 block">{roiCalculations.leads}</span>
                  <span className="text-[11px] text-slate-400 block">Leads Quentes Esperados</span>
                </div>
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                  <span className="text-xl font-black text-amber-400 block">${roiCalculations.cpl} CAD</span>
                  <span className="text-[11px] text-slate-400 block">Custo Médio por Lead (CPL)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Matrix of Lots */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900">
                Matriz de Lotes Comerciais Disponíveis
              </h2>
              <button
                type="button"
                onClick={() => setActiveTab('map')}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
              >
                <span>Ver no Mapa Interativo</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {allPortalSpaces.slice(0, 6).map((space) => (
                <div
                  key={space.id}
                  className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between space-y-4 shadow-xs hover:shadow-md transition-all"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      {space.statusLabel}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                      {space.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {space.description}
                    </p>
                    <div className="pt-2 text-[11px] text-slate-600 space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Dimensões:</span>
                        <span className="font-semibold">{space.dimensions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Audiência:</span>
                        <span className="font-semibold text-emerald-700">{space.monthlyViews}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">CTR Médio:</span>
                        <span className="font-bold text-blue-600">{space.avgCtr}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Tabela:</span>
                      <span className="text-lg font-black text-slate-900">${space.monthlyPriceCad} CAD</span>
                      <span className="text-[10px] text-slate-500">/mês</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedLotId(space.id);
                        setSelectedMapSpaceId(space.id);
                        const form = document.getElementById('b2b-inquiry-form');
                        if (form) form.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
                    >
                      Reservar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. TAB 2: COMMANDITE EXCLUSIVE DE CATÉGORIE */}
      {activeTab === 'sponsorship' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-600 block">
              Domine seu Setor de Atuação
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Commandite Exclusive de Catégorie & Ferramentas
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Em vez de disputar espaço com concorrentes, torne-se o patrocinador exclusivo da categoria no PaieNet. Sua marca com chancela oficial e sem anúncios de rivais na mesma área.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: '🏆 Categoria Bancária & Folha de Pagamento',
                sponsor: 'Ideal para Desjardins, BMO, RBC, National Bank',
                badge: '1 Vaga Restante',
                badgeColor: 'purple',
                price: '$650 CAD/mês',
                features: [
                  'Chancela exclusiva no cabeçalho do Contracheque Líquido',
                  'Exclusividade no Simulador de Aumento e Match REER/CELIAPP',
                  'Bloqueio completo de anúncios de outros bancos no portal',
                  'Disparo mensal de e-mail dedicado para a base de trabalhadores',
                ],
              },
              {
                title: '🚀 Categoria Recrutamento & Recursos Humanos',
                sponsor: 'Ideal para Randstad, Adecco, Agências de TI & Indústria',
                badge: 'Disponível',
                badgeColor: 'emerald',
                price: '$580 CAD/mês',
                features: [
                  'Presença no Construtor de Currículos ATS com botão de envio direto',
                  'Chancela no Simulador de Entrevistas STAR e Testes Técnicos',
                  'Destaque no topo do mural de vagas B2B com link corporativo',
                  'Publicação de 3 artigos patrocinados por trimestre inclusos',
                ],
              },
              {
                title: '🍁 Categoria Imigração & Relocação no Canadá',
                sponsor: 'Ideal para Escritórios de Imigração, Escolas de Francês, Realocação',
                badge: 'Alta Procura',
                badgeColor: 'blue',
                price: '$520 CAD/mês',
                features: [
                  'Patrocínio exclusivo do Comparador Salarial Interprovincial',
                  'Banner nos guias de custo de vida e sobrevivência fiscal',
                  'Associação de marca nos downloads de checklists e modelos de CV',
                  'Relatório mensal de leads qualificados gerados',
                ],
              },
              {
                title: '💰 Categoria Investimentos & Câmbio Internacional',
                sponsor: 'Ideal para Wise, Wealthsimple, Questrade, Corretoras',
                badge: 'Disponível',
                badgeColor: 'amber',
                price: '$490 CAD/mês',
                features: [
                  'Recomendação preferencial no Conversor de Períodos de Salário',
                  'Presença destacada no cálculo de restituição fiscal de fim de ano',
                  'Link direto rastreado sem taxas de intermediação',
                  'Artigo permanente indexado no Google sobre remessas e investimentos',
                ],
              },
            ].map((pack, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                      {pack.badge}
                    </span>
                    <span className="text-xl font-black text-slate-900">{pack.price}</span>
                  </div>

                  <h3 className="text-lg font-black text-slate-900">{pack.title}</h3>
                  <p className="text-xs font-semibold text-slate-500">{pack.sponsor}</p>

                  <ul className="space-y-2 pt-2 border-t border-slate-100">
                    {pack.features.map((feat, fIdx) => (
                      <li key={fIdx} className="text-xs text-slate-700 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedLotId('category-sponsor');
                    setFormData((prev) => ({
                      ...prev,
                      message: `Interesse no Patrocínio Exclusivo: ${pack.title}`,
                    }));
                    const form = document.getElementById('b2b-inquiry-form');
                    if (form) form.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Solicitar Bloqueio de Exclusividade</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. TAB 3: DIVULGAÇÃO DE VAGAS & COMBOS 360° */}
      {activeTab === 'jobs' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-600 block">
              Recrutamento Eficiente no Québec
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Divulgação de Vagas & Combos 360° de Atração
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Divulgue suas oportunidades de emprego diretamente para quem está ativamente calculando ofertas salariais e gerando currículos formatados no padrão canadense.
            </p>
          </div>

          {/* Job Packages */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 flex flex-col justify-between shadow-xs">
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-500 block">Vaga Individual</span>
                <h3 className="text-xl font-black text-slate-900">Post de Vaga Simples</h3>
                <span className="text-2xl font-black text-slate-900 block">$150 CAD</span>
                <p className="text-xs text-slate-600">
                  Publicação da vaga no mural de oportunidades por 15 dias com link direto para seu formulário.
                </p>
                <ul className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <li className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Duração de 15 dias</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Link rastreado para seu ATS</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedLotId('b2b-job-spot');
                  const form = document.getElementById('b2b-inquiry-form');
                  if (form) form.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Publicar Vaga
              </button>
            </div>

            <div className="bg-emerald-50/60 rounded-3xl border-2 border-emerald-500/80 p-6 space-y-4 flex flex-col justify-between shadow-sm relative">
              <span className="absolute -top-3 right-6 bg-emerald-600 text-white font-extrabold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">
                Mais Vendido
              </span>

              <div className="space-y-3">
                <span className="text-xs font-bold text-emerald-800 block">Combo Recomendado</span>
                <h3 className="text-xl font-black text-slate-900">Combo 360° Recrutamento</h3>
                <span className="text-2xl font-black text-emerald-700 block">$450 CAD</span>
                <p className="text-xs text-slate-700">
                  Destaque no topo por 60 dias + menção em e-mail para 12.000 cadastrados + presença no Construtor de CV.
                </p>
                <ul className="space-y-1.5 text-xs text-slate-700 pt-2 border-t border-emerald-200/60">
                  <li className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Destaque por 60 dias no mural</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Inclusão na Newsletter semanal</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Sugestão ao finalizar currículo ATS</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedLotId('combo-360');
                  const form = document.getElementById('b2b-inquiry-form');
                  if (form) form.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors cursor-pointer shadow-xs"
              >
                Contratar Combo 360°
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 flex flex-col justify-between shadow-xs">
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-500 block">Grandes Contratantes</span>
                <h3 className="text-xl font-black text-slate-900">Passaporte Anual Ilimitado</h3>
                <span className="text-2xl font-black text-slate-900 block">$1.200 CAD/ano</span>
                <p className="text-xs text-slate-600">
                  Vagas ilimitadas durante 12 meses para indústrias, empresas de TI e redes de hospitais.
                </p>
                <ul className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <li className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Vagas ativas ilimitadas</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Página corporativa dedicada</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedLotId('combo-unlimited');
                  const form = document.getElementById('b2b-inquiry-form');
                  if (form) form.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Falar com Consultor
              </button>
            </div>
          </div>

          {/* Live Partner Jobs Feed from adminStore */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">
              Vagas Corporativas em Exibição no Momento
            </h3>
            <div className="space-y-3">
              {liveJobPostings.map((job) => (
                <div
                  key={job.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 text-sm">{job.title}</span>
                      {job.featured && (
                        <span className="text-[10px] font-extrabold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                          Destaque 360°
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="font-semibold text-slate-700">{job.companyName}</span>
                      <span>·</span>
                      <span>{job.location}</span>
                      <span>·</span>
                      <span className="font-mono text-emerald-700 font-bold">{job.salaryRange}</span>
                    </div>
                  </div>

                  <a
                    href={job.applicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors"
                  >
                    <span>Candidatar</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB 4: MAPA INTERATIVO DE ESPAÇOS PUBLICITÁRIOS (COM MENU COMPLETO DINÂMICO) */}
      {activeTab === 'map' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>Planta Baixa & Inventário Completo</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Mapa Interativo de Espaços Publicitários
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Explore o menu com todos os espaços e vitrines disponíveis no portal. Selecione um espaço para inspecionar seu posicionamento exato, métricas de tráfego e simulação em tempo real.
            </p>
          </div>

          {/* Interactive Split View: Space Menu on Left + Live Page Simulation on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Dynamic Menu with all spaces */}
            <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-5 space-y-3 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                  Menu de Espaços Disponíveis ({allPortalSpaces.length})
                </span>
                <span className="text-[11px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                  Atualizado em Tempo Real
                </span>
              </div>

              <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1">
                {allPortalSpaces.map((space) => {
                  const isSelected = selectedMapSpaceId === space.id;
                  return (
                    <button
                      key={space.id}
                      type="button"
                      onClick={() => setSelectedMapSpaceId(space.id)}
                      className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer flex flex-col gap-1.5 ${
                        isSelected
                          ? 'bg-blue-50/70 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                          : 'bg-slate-50/60 hover:bg-slate-100/70 border-slate-200/80'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-extrabold text-xs text-slate-900 leading-snug">
                          {space.name}
                        </span>
                        <span className="font-mono text-xs font-black text-blue-700 shrink-0">
                          ${space.monthlyPriceCad}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>{space.page}</span>
                        <span className="font-semibold text-emerald-700">{space.monthlyViews}</span>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200/50">
                        <span>{space.dimensions}</span>
                        <span className="font-bold text-blue-600">CTR {space.avgCtr}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Live Contextual Page Simulation & Specs */}
            <div className="lg:col-span-7 bg-slate-950 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl border border-slate-800">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="font-bold text-white">Visualização do Posicionamento ao Vivo</span>
                </div>
                <span className="font-mono text-[11px] text-blue-400">{currentMapSpace.urlPath}</span>
              </div>

              {/* Space Detailed Card */}
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {currentMapSpace.statusLabel}
                </span>
                <h3 className="text-xl font-black text-white">{currentMapSpace.name}</h3>
                <p className="text-xs text-slate-400">{currentMapSpace.description}</p>
              </div>

              {/* Mockup Container */}
              <div className="p-4 sm:p-6 bg-slate-900 rounded-2xl border border-dashed border-slate-700 space-y-4">
                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-900/60 to-indigo-900/60 border-2 border-blue-400/80 text-center space-y-2 shadow-inner">
                  <span className="text-[11px] font-extrabold text-blue-300 uppercase tracking-widest block">
                    🎯 SUA MARCA AQUI · {currentMapSpace.dimensions}
                  </span>
                  <p className="text-sm font-bold text-white">
                    {currentMapSpace.previewSnippet}
                  </p>
                  <span className="inline-block px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold mt-1 shadow-xs">
                    Link Rastreado / CTA Direto
                  </span>
                </div>

                <div className="h-10 bg-slate-800/60 rounded-xl flex items-center justify-center text-xs text-slate-500 font-mono">
                  [Conteúdo Oficial do Portal PaieNet.qc ao Redor]
                </div>
              </div>

              {/* Technical Specifications Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Tabela Mensal</span>
                  <span className="text-base font-black text-white">${currentMapSpace.monthlyPriceCad} CAD</span>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Impressões/Mês</span>
                  <span className="text-base font-black text-emerald-400">{currentMapSpace.monthlyViews}</span>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">CTR Médio</span>
                  <span className="text-base font-black text-blue-400">{currentMapSpace.avgCtr}</span>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Garantia de Entrega</span>
                  <span className="text-base font-black text-amber-400">100%</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-400">
                  <span>Recomendado para: </span>
                  <strong className="text-white">{currentMapSpace.bestFor}</strong>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedLotId(currentMapSpace.id);
                    setFormData((prev) => ({
                      ...prev,
                      message: `Interesse no Espaço: ${currentMapSpace.name} (${currentMapSpace.dimensions})`,
                    }));
                    const form = document.getElementById('b2b-inquiry-form');
                    if (form) form.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                >
                  <span>Reservar este Espaço</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Formal Reservation Checkout / Inquiry Form (Universal across all tabs) */}
      <div id="b2b-inquiry-form" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600 block">
            Reserva de Espaço & Proposta Comercial
          </span>
          <h2 className="text-2xl font-black text-slate-900">
            Garanta a Exclusividade da sua Marca no PaieNet
          </h2>
          <p className="text-xs text-slate-500">
            Preencha os dados da sua organização para receber a fatura proforma formal e travar a veiculação do lote escolhido.
          </p>
        </div>

        {!submittedInquiry ? (
          <form onSubmit={handleSubmitInquiry} className="max-w-3xl mx-auto space-y-5">
            {/* Selected Lot Display */}
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 block">
                  Espaço Comercial Selecionado
                </span>
                <span className="text-sm font-black text-slate-900">
                  {allPortalSpaces.find((s) => s.id === selectedLotId)?.name || 'Lote Padrão Selecionado'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600">Duração:</span>
                <select
                  value={selectedDuration}
                  onChange={(e) => setSelectedDuration(e.target.value as any)}
                  className="bg-white px-3 py-1.5 rounded-lg border border-blue-300 text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="monthly">1 Mês (Teste)</option>
                  <option value="quarterly">3 Meses (Trimestral -10%)</option>
                  <option value="biannual">6 Meses (Semestral -15%)</option>
                  <option value="one_time">Anual / Vitalício</option>
                </select>
              </div>
            </div>

            {/* Input fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nome da Empresa / Organização *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Desjardins, CGI, Agência Talent..."
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nome do Responsável de Marketing / RH *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Sophie Tremblay"
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  E-mail Corporativo *
                </label>
                <input
                  type="email"
                  required
                  placeholder="contato@empresa.ca"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Telefone / WhatsApp Comercial *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+1 (514) 000-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Website da Empresa ou Perfil LinkedIn
                </label>
                <input
                  type="url"
                  placeholder="https://suaempresa.ca"
                  value={formData.websiteUrl}
                  onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Briefing ou Objetivos da Campanha (Opcional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Ex: Queremos divulgar vagas de TI em Montreal ou promover nosso plano de previdência REER coletivo..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md"
              >
                {isSubmitting ? (
                  <span>Registrando Proposta Comercial...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Enviar Solicitação de Reserva de Espaço</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-[11px] text-slate-400 text-center">
              🔒 Compromisso Comercial: Nossa diretoria responderá em até 24 horas úteis com a proposta e o contrato proforma.
            </p>
          </form>
        ) : (
          <div className="max-w-md mx-auto text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-900">
                Proposta Registrada com Sucesso!
              </h3>
              <p className="text-xs text-slate-600">
                O protocolo <strong>{submittedInquiry.id}</strong> foi registrado no nosso CRM e uma confirmação foi enviada para <strong>{submittedInquiry.email}</strong>.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 font-medium">
              Espaço reservado: <strong>{submittedInquiry.slotName}</strong>
            </div>

            <button
              type="button"
              onClick={() => setSubmittedInquiry(null)}
              className="py-2.5 px-6 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Fazer Nova Solicitação
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
