'use client';

import React, { useState, useMemo } from 'react';
import { Language } from '@/lib/i18n';
import { ToolId } from '@/components/ToolboxGrid';
import { adminStore, B2BSponsorInquiry } from '@/lib/admin-store';
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
} from 'lucide-react';

interface CommercialShowcaseProps {
  lang: Language;
  onSelectTool: (tool: ToolId) => void;
  onOpenProModal?: () => void;
}

export const CommercialShowcase: React.FC<CommercialShowcaseProps> = ({
  lang,
  onSelectTool,
}) => {
  // Simulator State
  const [selectedSegment, setSelectedSegment] = useState<'banking' | 'insurance' | 'recruitment' | 'immigration' | 'education'>('banking');
  const [budgetSlider, setBudgetSlider] = useState<number>(550);

  // Selected Lot for checkout / inquiry
  const [selectedLotId, setSelectedLotId] = useState<string>('salary-results');
  const [selectedDuration, setSelectedDuration] = useState<'monthly' | 'quarterly' | 'biannual' | 'one_time'>('quarterly');
  const [catalogFilter, setCatalogFilter] = useState<'all' | 'banners' | 'sponsorship' | 'content' | 'jobs'>('all');

  // Preview interactive zone
  const [previewZone, setPreviewZone] = useState<'home-top' | 'salary-results' | 'tools-section' | 'blog-article' | 'footer-wide'>('salary-results');

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

  // Dictionary for texts
  const t = useMemo(() => {
    return {
      pt: {
        badge: 'Mídia Kit & Loteamento de Vitrines Digitais 2026',
        heroTitle: 'Loteamento de Vitrines & Espaços Comerciais no Québec',
        heroSubtitle: 'Conecte sua empresa a mais de 48.000 trabalhadores assalariados, novos imigrantes qualificados e gestores no momento exato em que decidem seus rumos financeiros e profissionais.',
        btnBack: 'Voltar ao Calculador de Salário',
        btnExploreTools: 'Ver Todas as Ferramentas',
        proofBadge: 'Métricas Reais Auditadas',
        proofTitle: 'Por que o PaieNet Converte 15x Mais que Anúncios Tradicionais?',
        proofSubtitle: 'Nossos usuários não estão navegando passivamente. Eles estão calculando salários líquidos, avaliando ofertas de emprego e decidindo aportes fiscais (REER/CELIAPP). A atenção é 100% ativa.',
        statSessions: 'Visitantes Únicos / Mês',
        statTime: 'Tempo Médio por Sessão',
        statCtr: 'CTR Médio em Vitrines Nativas',
        statSalary: 'Renda Média Declarada',
        ctrCompareLabel: '4.6% no PaieNet vs 0.3% em Banners Display Tradicionais',
        roiSimTitle: 'Simulador de Eficácia & Retorno Projetado',
        roiSimSubtitle: 'Simule o alcance qualificado e o custo estimado por lead para a sua marca no mercado québécois.',
        segmentLabel: 'Segmento da sua empresa',
        budgetLabel: 'Investimento mensal estimado em mídia',
        estReach: 'Alcance Único Estimado',
        estClicks: 'Cliques Qualificados',
        estLeads: 'Leads Quentes Esperados',
        estCpl: 'Custo por Lead (CPL) Projetado',
        catalogTitle: 'Matriz de Lotes & Vitrines Disponíveis',
        catalogSubtitle: 'Escolha a área ideal do portal de acordo com o estágio de intenção do seu cliente.',
        selectLotBtn: 'Selecionar este Lote',
        selectedLotBadge: 'Lote Selecionado',
        zonePreviewTitle: 'Mapa Interativo: Onde sua Marca Aparece',
        zonePreviewSubtitle: 'Clique nas áreas do site para visualizar o posicionamento exato da sua vitrine.',
        checkoutTitle: 'Reserve seu Lote ou Encomende um Artigo',
        checkoutSubtitle: 'Preencha os dados da sua empresa para receber a proposta formal proforma e travar a exclusividade do espaço.',
        companyLabel: 'Razão Social / Nome da Empresa',
        contactLabel: 'Nome do Responsável Comercial / Marketing',
        emailLabel: 'E-mail Corporativo',
        phoneLabel: 'Telefone / WhatsApp Comercial',
        websiteLabel: 'Website da Empresa ou Perfil LinkedIn',
        msgLabel: 'Briefing ou Objetivo da Campanha (Opcional)',
        msgPlaceholder: 'Ex: Queremos divulgar nosso plano de previdência REER para novos contratados na área de TI em Montreal...',
        btnSubmit: 'Solicitar Reserva de Lote & Proposta Comercial',
        successTitle: 'Proposta de Loteamento Registrada com Sucesso!',
        successMsg: 'Sua solicitação foi encaminhada para a nossa diretoria comercial. Enviamos uma cópia para o seu e-mail corporativo.',
        protocol: 'Protocolo da Proposta',
        summaryVal: 'Valor Total Previsto',
        btnNew: 'Fazer Nova Simulação',
        btnWhatsapp: 'Falar Diretamente com o Diretor Comercial via WhatsApp',
      },
      fr: {
        badge: 'Kit Média & Emplacements Publicitaires 2026',
        heroTitle: 'Vitrines Numériques & Partenariats d’Affaires au Québec',
        heroSubtitle: 'Associez votre entreprise à plus de 48 000 salariés, nouveaux arrivants qualifiés et gestionnaires au moment précis où ils planifient leurs finances et leur carrière.',
        btnBack: 'Retour au Calculateur de Paie',
        btnExploreTools: 'Explorer les Outils',
        proofBadge: 'Mesures & Performances Vérifiées',
        proofTitle: 'Pourquoi PaieNet Convertit 15× Mieux que la Publicité Traditionnelle ?',
        proofSubtitle: 'Nos utilisateurs ne font pas du défilement passif : ils calculent leur salaire net, comparent des offres d’emploi et planifient leurs REER/CELIAPP. Une attention captive et intentionnelle.',
        statSessions: 'Visiteurs Uniques / Mois',
        statTime: 'Temps Moyen par Session',
        statCtr: 'CTR Moyen Vitrines Natives',
        statSalary: 'Revenu Moyen Déclaré',
        ctrCompareLabel: '4,6 % sur PaieNet vs 0,3 % sur les bannières classiques',
        roiSimTitle: 'Simulateur d’Efficacité & Retour sur Investissement',
        roiSimSubtitle: 'Évaluez la portée ciblée et le coût par prospect qualifié pour votre entreprise sur le marché québécois.',
        segmentLabel: 'Secteur d’activité',
        budgetLabel: 'Budget publicitaire mensuel estimé',
        estReach: 'Portée Unique Estimée',
        estClicks: 'Clics Qualifiés Projetés',
        estLeads: 'Prospects Clés Estimés',
        estCpl: 'Coût par Prospect (CPL)',
        catalogTitle: 'Grille des Emplacements & Lots Publicitaires',
        catalogSubtitle: 'Choisissez l’espace stratégique adapté à vos objectifs d’acquisition ou de notoriété.',
        selectLotBtn: 'Sélectionner cet Emplacement',
        selectedLotBadge: 'Emplacement Sélectionné',
        zonePreviewTitle: 'Plan Interactif : Où s’affiche votre Marque',
        zonePreviewSubtitle: 'Cliquez sur les zones du portail pour prévisualiser l’intégration de votre annonce.',
        checkoutTitle: 'Réservez votre Emplacement ou Commandez un Article',
        checkoutSubtitle: 'Transmettez les coordonnées de votre organisation pour bloquer l’exclusivité du lot.',
        companyLabel: 'Organisation ou Entreprise',
        contactLabel: 'Responsable des Partenariats / Marketing',
        emailLabel: 'Courriel Professionnel',
        phoneLabel: 'Téléphone Professionnel / Cellulaire',
        websiteLabel: 'Site Internet de l’Entreprise',
        msgLabel: 'Objectif de la Campagne (Optionnel)',
        msgPlaceholder: 'Ex: Promotion de nos régimes collectifs REER pour les entreprises québécoises...',
        btnSubmit: 'Transmettre la Demande de Réservation & Devis',
        successTitle: 'Demande d’Emplacement Reçue avec Succès !',
        successMsg: 'Votre dossier a été transmis à notre équipe commerciale. Nous communiquerons avec vous sous 24 heures ouvrables.',
        protocol: 'Numéro de Demande',
        summaryVal: 'Montant Estimé',
        btnNew: 'Nouvelle Simulation',
        btnWhatsapp: 'Contacter l’Équipe Partenariats via WhatsApp',
      },
      en: {
        badge: 'Media Kit & Digital Advertising Lots 2026',
        heroTitle: 'Commercial Showcase & Digital Billboard Lots in Quebec',
        heroSubtitle: 'Connect your business with over 48,000 salaried employees, skilled newcomers, and managers right as they make critical financial and career decisions.',
        btnBack: 'Back to Net Calculator',
        btnExploreTools: 'Explore All Tools',
        proofBadge: 'Audited Live Metrics',
        proofTitle: 'Why PaieNet Converts 15x Higher than Traditional Ads',
        proofSubtitle: 'Our audience is not passively scrolling. They are calculating their net paystubs, comparing job offers, and setting up RRSP tax shelters. Pure high-intent attention.',
        statSessions: 'Unique Visitors / Month',
        statTime: 'Average Session Duration',
        statCtr: 'Native Placement Average CTR',
        statSalary: 'Declared Average Income',
        ctrCompareLabel: '4.6% on PaieNet vs 0.3% on Standard Display Banners',
        roiSimTitle: 'ROI & Lead Projection Simulator',
        roiSimSubtitle: 'Simulate your qualified reach and estimated cost-per-lead within the Quebec workforce.',
        segmentLabel: 'Your Business Category',
        budgetLabel: 'Estimated Monthly Media Budget',
        estReach: 'Estimated Unique Reach',
        estClicks: 'Projected Qualified Clicks',
        estLeads: 'Expected Direct Leads',
        estCpl: 'Estimated Cost Per Lead (CPL)',
        catalogTitle: 'Available Billboard Lots & Advertising Matrix',
        catalogSubtitle: 'Select the optimal space tailored to your customer acquisition and branding funnel.',
        selectLotBtn: 'Select this Lot',
        selectedLotBadge: 'Selected Lot',
        zonePreviewTitle: 'Interactive Site Blueprint: Ad Placement Preview',
        zonePreviewSubtitle: 'Click on portal zones to inspect the live render and context of your banner.',
        checkoutTitle: 'Reserve Your Lot or Commission a Sponsored Article',
        checkoutSubtitle: 'Submit your organization details to lock in category exclusivity and generate a formal quote.',
        companyLabel: 'Company Name / Entity',
        contactLabel: 'Marketing / Partnerships Lead Name',
        emailLabel: 'Corporate Email',
        phoneLabel: 'Business Phone / Mobile',
        websiteLabel: 'Company Website or LinkedIn',
        msgLabel: 'Campaign Brief or Target Goals (Optional)',
        msgPlaceholder: 'E.g., We want to feature our group insurance solutions for Quebec tech workers...',
        btnSubmit: 'Request Lot Reservation & Formal Quote',
        successTitle: 'Lot Reservation Request Successfully Submitted!',
        successMsg: 'Your commercial proposal has been registered in our system. Our partnerships director will review and follow up promptly.',
        protocol: 'Proposal Reference',
        summaryVal: 'Estimated Campaign Value',
        btnNew: 'Start New Simulation',
        btnWhatsapp: 'Chat Directly with Partnerships Director on WhatsApp',
      },
    }[lang];
  }, [lang]);

  // Available Lots Matrix
  const lots = useMemo(() => [
    {
      id: 'home-top',
      name: lang === 'pt' ? 'Lote 1: Header Leaderboard (Topo Global)' : lang === 'fr' ? 'Lot 1 : En-tête Principal (Leaderboard Top)' : 'Lot 1: Top Header Leaderboard',
      category: lang === 'pt' ? 'Visibilidade Institucional' : lang === 'fr' ? 'Notoriété & Image' : 'Brand Visibility',
      badge: lang === 'pt' ? 'Máxima Exposição' : lang === 'fr' ? 'Visibilité Maximale' : 'Maximum Reach',
      badgeColor: 'blue',
      monthlyPriceCad: 380,
      format: '728×90 / Responsivo Mobile',
      impressionsEst: '35.000+ visualizações/mês',
      ctrEst: '3.8% CTR',
      suitableFor: lang === 'pt' ? 'Bancos, Cooperativas (Desjardins/BMO), Telecomunicações, Seguradoras' : 'Banques, Télécoms, Assurances collectives',
      description: lang === 'pt'
        ? 'Primeiro elemento visível logo abaixo do cabeçalho da calculadora. Reconhecimento imediato de marca.'
        : 'Premier élément visuel au-dessus de la calculatrice. Idéal pour ancrer votre marque dans le paysage québécois.',
      icon: Megaphone,
    },
    {
      id: 'salary-results',
      name: lang === 'pt' ? 'Lote 2: Pós-Contracheque & Resultados de Salário' : lang === 'fr' ? 'Lot 2 : Post-Talon de Paie (Zone Prime)' : 'Lot 2: Post-Paystub Results (Prime Zone)',
      category: lang === 'pt' ? 'Altíssima Conversão Financeira' : lang === 'fr' ? 'Conversion Financière Élevée' : 'High Financial Intent',
      badge: lang === 'pt' ? 'Mais Cobiçado' : lang === 'fr' ? 'Plus Demandé' : 'Most In-Demand',
      badgeColor: 'emerald',
      monthlyPriceCad: 520,
      format: 'Banner Contextual Wide (640×160)',
      impressionsEst: '28.000+ cálculos concluídos/mês',
      ctrEst: '5.4% CTR',
      suitableFor: lang === 'pt' ? 'Planos REER / CELIAPP, Cartões de Crédito sem anuidade, Empréstimos hipotecários' : 'Comptes REER/CELIAPP, Prêts, Cartes de crédit',
      description: lang === 'pt'
        ? 'Posicionado imediatamente após a linha do salário líquido e deduções de impostos. O momento em que o usuário busca como economizar.'
        : 'S’affiche après le calcul du salaire net. C’est l’instant où l’utilisateur cherche à optimiser ses déductions.',
      icon: DollarSign,
    },
    {
      id: 'tool-takeover',
      name: lang === 'pt' ? 'Lote 3: Patrocínio Exclusivo de Ferramenta (Tool Takeover)' : lang === 'fr' ? 'Lot 3 : Commandite Exclusive d’Outil' : 'Lot 3: Exclusive Tool Takeover',
      category: lang === 'pt' ? 'Associação Temática Direta' : lang === 'fr' ? 'Affinité Thématique Directe' : 'Direct Niche Affinity',
      badge: lang === 'pt' ? 'Exclusividade de Nicho' : lang === 'fr' ? 'Exclusivité Thématique' : 'Niche Exclusive',
      badgeColor: 'purple',
      monthlyPriceCad: 420,
      format: 'Chancela Oficial "Apresentado por..." + Banner Integrado',
      impressionsEst: '18.000+ sessões ativas/mês',
      ctrEst: '4.9% CTR',
      suitableFor: lang === 'pt' ? 'Agências de Recrutamento, Escolas de Francês, Softwares de Folha de Pagamento' : 'Agences RH, Écoles de langues, Logiciels de paie',
      description: lang === 'pt'
        ? 'Sua marca assume a chancela de uma das ferramentas (ex: Simulador de Entrevistas STAR ou Comparador de Empregos).'
        : 'Votre logo et offre accompagnent un simulateur clé (ex: Entrevues STAR ou Comparateur d’offres).',
      icon: Target,
    },
    {
      id: 'blog-sponsored',
      name: lang === 'pt' ? 'Lote 4: Artigo Patrocinado sob Encomenda (Do-Follow & SEO)' : lang === 'fr' ? 'Lot 4 : Article Commandité Sur-Mesure (SEO)' : 'Lot 4: Sponsored Editorial & SEO Article',
      category: lang === 'pt' ? 'Autoridade Orgânica Permanente' : lang === 'fr' ? 'Autorité SEO Permanente' : 'Permanent Organic Authority',
      badge: lang === 'pt' ? 'Pagamento Único Vitalício' : lang === 'fr' ? 'Paiement Unique & Durable' : 'One-Time Lifetime Post',
      badgeColor: 'amber',
      monthlyPriceCad: 290,
      format: 'Artigo Editorial Completo de 1.200+ palavras + Links Do-Follow',
      impressionsEst: 'Permanente no Google + Indexação Rápida',
      ctrEst: '6.2% CTR Orgânico',
      suitableFor: lang === 'pt' ? 'Advogados de Imigração, Contabilidade CPA, Consultorias de Relocação, Softwares SaaS' : 'Avocats immigration, Cabinets CPA, Logiciels SaaS',
      description: lang === 'pt'
        ? 'Artigo informativo escrito com rigor fiscal pela nossa equipe, focado nas palavras-chave da sua solução e com links permanentes.'
        : 'Article éditorial de référence rédigé selon les normes québécoises avec liens directs vers votre produit.',
      icon: FileText,
    },
    {
      id: 'b2b-job-spot',
      name: lang === 'pt' ? 'Lote 5: Vaga de Emprego B2B em Destaque (30 Dias)' : lang === 'fr' ? 'Lot 5 : Offre d’Emploi B2B Vedette (30 Jours)' : 'Lot 5: Featured B2B Job Posting (30 Days)',
      category: lang === 'pt' ? 'Recrutamento Qualificado' : lang === 'fr' ? 'Recrutement Qualifié' : 'Talent Acquisition',
      badge: lang === 'pt' ? 'Aceleração de Contratação' : lang === 'fr' ? 'Embauche Rapide' : 'Hiring Fast-Track',
      badgeColor: 'blue',
      monthlyPriceCad: 89,
      format: 'Card em Destaque no Mural B2B + Topo do Comparador',
      impressionsEst: '12.000+ visualizações de candidatos',
      ctrEst: '7.1% CTR de Aplicação',
      suitableFor: lang === 'pt' ? 'Empresas em busca de desenvolvedores, engenheiros, operadores industriais e analistas' : 'Employeurs cherchant des talents qualifiés au Québec',
      description: lang === 'pt'
        ? 'Destaque prioritário da sua vaga aberta para profissionais que usam nossas ferramentas para calcular seu próximo salário.'
        : 'Mettez en avant vos offres d’emploi auprès de professionnels analysant le marché du travail.',
      icon: Briefcase,
    },
    {
      id: 'combo-360',
      name: lang === 'pt' ? 'Lote 6: Pacote Combo Vitrine 360° (Presença Omnichannel)' : lang === 'fr' ? 'Lot 6 : Forfait Vitrine 360° (Omnicanal)' : 'Lot 6: Omnichannel 360° Showcase Bundle',
      category: lang === 'pt' ? 'Domínio Total da Plataforma' : lang === 'fr' ? 'Visibilité Totale' : 'Total Platform Domination',
      badge: lang === 'pt' ? 'Melhor ROI (Economia 35%)' : lang === 'fr' ? 'Meilleur ROI (-35%)' : 'Best Value (-35%)',
      badgeColor: 'emerald',
      monthlyPriceCad: 890,
      format: 'Banner Topo + Banner Resultados + 1 Artigo Patrocinado + 1 Disparo de Newsletter',
      impressionsEst: '60.000+ pontos de contato multicanal',
      ctrEst: '5.8% CTR Médio',
      suitableFor: lang === 'pt' ? 'Grandes marcas, fintechs em lançamento e corporações querendo liderança no Québec' : 'Grandes institutions et fintechs visant le leadership',
      description: lang === 'pt'
        ? 'Combinação poderosa que cerca o usuário em todas as etapas: ao entrar no site, ao calcular e ao receber nossos e-mails.'
        : 'Visibilité complète sur le portail et dans notre infolettre pour une notoriété maximale.',
      icon: Zap,
    },
    {
      id: 'category-sponsor',
      name: lang === 'pt' ? 'Lote 7: Patrocínio Exclusivo de Seção ou Categoria Inteira' : lang === 'fr' ? 'Lot 7 : Commandite Exclusive de Section Complète' : 'Lot 7: Category & Portal Section Exclusive Sponsorship',
      category: lang === 'pt' ? 'Patrocínio Institucional & Domínio de Categoria' : lang === 'fr' ? 'Leadership Thématique' : 'Category Domination',
      badge: lang === 'pt' ? 'Exclusividade Absoluta' : lang === 'fr' ? 'Exclusivité Totale' : '100% Category Exclusivity',
      badgeColor: 'purple',
      monthlyPriceCad: 680,
      format: 'Chancela no Topo da Categoria + Banners em Todos os Artigos da Seção + Selo Oficial',
      impressionsEst: '50.000+ exibições ultra-qualificadas/mês',
      ctrEst: '5.6% CTR',
      suitableFor: lang === 'pt' ? 'Bancos para "Seção Salário & Impostos", Advogados para "Seção Imigração & CNESST", Corretoras para "Seção REER"' : 'Institutions financières, Cabinets juridiques, Assurances',
      description: lang === 'pt'
        ? 'Associe sua marca de forma definitiva a um tema específico. Sua empresa vira a parceira oficial daquela categoria com logotipo de chancela "Seção apoiada por [Sua Empresa]".'
        : 'Devenez le partenaire officiel d’une section entière du portail avec présence exclusive sur tous les outils et articles associés.',
      icon: Award,
    },
    {
      id: 'pdf-cobranding',
      name: lang === 'pt' ? 'Lote 8: Co-Branding nos Holerites & Relatórios PDF Gerados' : lang === 'fr' ? 'Lot 8 : Co-Marquage sur les Fiches de Paie PDF' : 'Lot 8: Co-Branding on Official Downloaded Paystub PDFs',
      category: lang === 'pt' ? 'Documentos Oficiais & Retenção Perene' : lang === 'fr' ? 'Documents Officiels Pérennes' : 'Official Documents Long-Tail',
      badge: lang === 'pt' ? 'Retenção por Anos' : lang === 'fr' ? 'Visibilité Durable' : 'Multi-Year Retention',
      badgeColor: 'emerald',
      monthlyPriceCad: 450,
      format: 'Logotipo Oficial + Chamada de Conta Salário / Benefício no Cabeçalho do PDF A4',
      impressionsEst: '14.000+ PDFs baixados por trabalhadores/mês',
      ctrEst: 'Alta conversão em impressão',
      suitableFor: lang === 'pt' ? 'Contas-salário bancárias, planos de previdência corporativos e crédito consignado' : 'Comptes salaires, Régimes collectifs, Financement',
      description: lang === 'pt'
        ? 'Os trabalhadores baixam o PDF oficial de holerite para apresentar a proprietários de imóveis, bancos e imigração. Sua marca é impressa com destaque no cabeçalho.'
        : 'Chaque utilisateur exporte sa fiche de paie en PDF officiel. Votre marque et offre y sont intégrées de façon permanente.',
      icon: FileText,
    },
    {
      id: 'newsletter-dedicated',
      name: lang === 'pt' ? 'Lote 9: Disparo Dedicado na Newsletter Semanal (Infolettre)' : lang === 'fr' ? 'Lot 9 : Infolettre Dédiée Exclusive' : 'Lot 9: Exclusive Dedicated Newsletter Blast',
      category: lang === 'pt' ? 'Marketing Direto de Alta Conversão' : lang === 'fr' ? 'Marketing Direct Qualifié' : 'Direct Email Acquisition',
      badge: lang === 'pt' ? '42% Taxa de Abertura' : lang === 'fr' ? '42% Taux d’Ouverture' : '42% Open Rate',
      badgeColor: 'amber',
      monthlyPriceCad: 350,
      format: 'Disparo 100% Exclusivo para Base Cadastrada de Trabalhadores do Québec',
      impressionsEst: 'Base engajada e ativa com cliques diretos',
      ctrEst: '8.4% CTR em E-mail',
      suitableFor: lang === 'pt' ? 'Lançamentos de produtos, eventos de contratação, feiras de emprego e promoções com prazo' : 'Lancements, Recrutement massif, Offres limitées',
      description: lang === 'pt'
        ? 'E-mail marketing direto e exclusivo enviado sem concorrentes para nossa lista VIP de profissionais e novos imigrantes assalariados.'
        : 'Campagne de courriel dédiée envoyée à nos abonnés actifs sur le marché du travail québécois.',
      icon: Megaphone,
    },
  ], [lang]);

  // Current selected lot data
  const currentLot = useMemo(() => {
    return lots.find((l) => l.id === selectedLotId) || lots[0];
  }, [lots, selectedLotId]);

  // Price calculations based on duration
  const calculatedPriceCad = useMemo(() => {
    const base = currentLot.monthlyPriceCad;
    if (selectedDuration === 'one_time') {
      return base;
    }
    if (selectedDuration === 'monthly') {
      return base;
    }
    if (selectedDuration === 'quarterly') {
      return Math.round(base * 3 * 0.85); // 15% discount
    }
    if (selectedDuration === 'biannual') {
      return Math.round(base * 6 * 0.75); // 25% discount
    }
    return base;
  }, [currentLot, selectedDuration]);

  // ROI Calculator Calculations
  const roiCalculations = useMemo(() => {
    const budget = budgetSlider;
    let multiplier = 1.0;
    if (selectedSegment === 'banking') multiplier = 1.15;
    if (selectedSegment === 'insurance') multiplier = 1.25;
    if (selectedSegment === 'recruitment') multiplier = 1.4;
    if (selectedSegment === 'immigration') multiplier = 1.3;

    const estimatedImpressions = Math.round(budget * 68 * multiplier);
    const estimatedClicks = Math.round(estimatedImpressions * 0.046);
    const estimatedLeads = Math.max(3, Math.round(estimatedClicks * 0.16));
    const estimatedCpl = Math.max(12, Math.round((budget / estimatedLeads) * 10) / 10);

    return {
      impressions: estimatedImpressions.toLocaleString(),
      clicks: estimatedClicks.toLocaleString(),
      leads: estimatedLeads.toLocaleString(),
      cpl: estimatedCpl.toFixed(2),
    };
  }, [budgetSlider, selectedSegment]);

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName || !formData.email || !formData.contactName) {
      alert(lang === 'pt' ? 'Por favor preencha nome, empresa e e-mail corporativo.' : 'Veuillez remplir le nom, entreprise et courriel.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const inquiry = adminStore.submitB2BSponsorInquiry({
        companyName: formData.companyName,
        contactName: formData.contactName,
        email: formData.email,
        phone: formData.phone || undefined,
        websiteUrl: formData.websiteUrl || undefined,
        slotId: currentLot.id,
        slotName: currentLot.name,
        billingDuration: selectedDuration,
        priceCad: calculatedPriceCad,
        message: formData.message || undefined,
      });

      setSubmittedInquiry(inquiry);
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-16">
      {/* 1. Header Bar with Back Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 text-white p-4 sm:p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">
            <Building2 className="w-3.5 h-3.5" />
            <span>{t.badge}</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black tracking-tight text-white">
            {t.heroTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
            {t.heroSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => onSelectTool('net-calc')}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t.btnBack}</span>
          </button>
        </div>
      </div>

      {/* 2. Audited Live Performance Stats (Prova de Eficácia) */}
      <div className="space-y-6">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-extrabold border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t.proofBadge}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t.proofTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {t.proofSubtitle}
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 block">48.500+</span>
            <span className="text-xs font-semibold text-slate-500 block leading-tight">{t.statSessions}</span>
            <span className="text-[10px] text-blue-600 font-bold block pt-1 border-t border-slate-100">
              92% Georreferenciado no Québec
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-2xl sm:text-3xl font-black text-emerald-600 block">4m 38s</span>
            <span className="text-xs font-semibold text-slate-500 block leading-tight">{t.statTime}</span>
            <span className="text-[10px] text-emerald-600 font-bold block pt-1 border-t border-slate-100">
              3.8x superior à média da web (1m12s)
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <MousePointerClick className="w-5 h-5" />
            </div>
            <span className="text-2xl sm:text-3xl font-black text-indigo-600 block">4.6%</span>
            <span className="text-xs font-semibold text-slate-500 block leading-tight">{t.statCtr}</span>
            <span className="text-[10px] text-indigo-600 font-bold block pt-1 border-t border-slate-100">
              {t.ctrCompareLabel}
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 block">$72.400 CAD</span>
            <span className="text-xs font-semibold text-slate-500 block leading-tight">{t.statSalary}</span>
            <span className="text-[10px] text-amber-700 font-bold block pt-1 border-t border-slate-100">
              Alto poder aquisitivo & bancarização
            </span>
          </div>
        </div>
      </div>

      {/* 3. Interactive ROI & Lead Projection Simulator */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>{t.roiSimTitle}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            {t.roiSimTitle}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300">
            {t.roiSimSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
          {/* Controls */}
          <div className="lg:col-span-6 space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-2">
                {t.segmentLabel}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'banking', label: 'Bancos / Fintech' },
                  { id: 'insurance', label: 'Seguros & Benefícios' },
                  { id: 'recruitment', label: 'RH & Vagas' },
                  { id: 'immigration', label: 'Imigração & Jurídico' },
                  { id: 'education', label: 'Idiomas & Cursos' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedSegment(s.id as any)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                      selectedSegment === s.id
                        ? 'bg-blue-600 border-blue-400 text-white shadow-md'
                        : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-2">
                <span>{t.budgetLabel}</span>
                <span className="text-emerald-400 text-base font-black">${budgetSlider} CAD/mês</span>
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
                <span>$250 CAD (Teste)</span>
                <span>$1.000 CAD (Aceleração)</span>
                <span>$2.500 CAD (Liderança)</span>
              </div>
            </div>
          </div>

          {/* Results Projection */}
          <div className="lg:col-span-6 bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-300 block">
              Projeção Estimada Baseada em Dados Históricos
            </span>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-xl sm:text-2xl font-black text-white block">{roiCalculations.impressions}</span>
                <span className="text-[11px] text-slate-400 block">{t.estReach}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-xl sm:text-2xl font-black text-blue-400 block">{roiCalculations.clicks}</span>
                <span className="text-[11px] text-slate-400 block">{t.estClicks}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-xl sm:text-2xl font-black text-emerald-400 block">{roiCalculations.leads}</span>
                <span className="text-[11px] text-slate-400 block">{t.estLeads}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-xl sm:text-2xl font-black text-amber-400 block">${roiCalculations.cpl} CAD</span>
                <span className="text-[11px] text-slate-400 block">{t.estCpl}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-slate-900/40 p-2.5 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Garantia de entrega: Se não atingir a projeção mínima, veiculamos bônus cortesia até a meta.</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Billboard Lots Matrix (Catálogo de Lotes) */}
      <div className="space-y-6">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-extrabold border border-blue-200">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>{t.catalogTitle}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t.catalogTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {t.catalogSubtitle}
          </p>
        </div>

        {/* Filter Pills for Lots */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {[
            { id: 'all', label: lang === 'pt' ? 'Todos os Lotes (9)' : 'Tous les lots (9)' },
            { id: 'banners', label: lang === 'pt' ? '📢 Banners & Display' : '📢 Bannières & Affichage' },
            { id: 'sponsorship', label: lang === 'pt' ? '🏆 Patrocínio de Categoria & Ferramentas' : '🏆 Commandites de Section' },
            { id: 'content', label: lang === 'pt' ? '✍️ Conteúdo, SEO & E-mail' : '✍️ Articles & Infolettre' },
            { id: 'jobs', label: lang === 'pt' ? '💼 Vagas B2B & Combos' : '💼 Emplois & Combos' },
          ].map((flt) => (
            <button
              key={flt.id}
              type="button"
              onClick={() => setCatalogFilter(flt.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                catalogFilter === flt.id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {flt.label}
            </button>
          ))}
        </div>

        {/* Lots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {lots
            .filter((lot) => {
              if (catalogFilter === 'all') return true;
              if (catalogFilter === 'banners') return ['home-top', 'salary-results'].includes(lot.id);
              if (catalogFilter === 'sponsorship') return ['tool-takeover', 'category-sponsor', 'pdf-cobranding'].includes(lot.id);
              if (catalogFilter === 'content') return ['blog-sponsored', 'newsletter-dedicated'].includes(lot.id);
              if (catalogFilter === 'jobs') return ['b2b-job-spot', 'combo-360'].includes(lot.id);
              return true;
            })
            .map((lot) => {
            const Icon = lot.icon;
            const isSelected = selectedLotId === lot.id;

            return (
              <div
                key={lot.id}
                className={`p-6 rounded-3xl transition-all border flex flex-col justify-between relative shadow-sm hover:shadow-md ${
                  isSelected
                    ? 'bg-blue-50/50 border-blue-600 ring-2 ring-blue-500/20'
                    : 'bg-white border-slate-200/90 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    <span
                      className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full border ${
                        lot.badgeColor === 'emerald'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : lot.badgeColor === 'purple'
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : lot.badgeColor === 'amber'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}
                    >
                      {lot.badge}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-slate-900 text-base leading-snug">
                    {lot.name}
                  </h4>
                  <span className="text-[11px] font-bold text-slate-500 block mb-2">
                    {lot.category}
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {lot.description}
                  </p>

                  <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs text-slate-700 mb-4 border border-slate-100">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Formato:</span>
                      <span className="font-semibold">{lot.format}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Impressões:</span>
                      <span className="font-semibold text-emerald-700">{lot.impressionsEst}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">CTR Estimado:</span>
                      <span className="font-bold text-blue-600">{lot.ctrEst}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-xs text-slate-500 block">Tabela Base:</span>
                      <span className="text-xl font-black text-slate-900">${lot.monthlyPriceCad} CAD</span>
                      <span className="text-[10px] text-slate-500"> {lot.id === 'blog-sponsored' ? '/ vitalício' : '/ mês'}</span>
                    </div>

                    {isSelected && (
                      <span className="text-xs font-extrabold text-blue-600 flex items-center gap-1 bg-blue-100 px-2 py-0.5 rounded-lg">
                        <Check className="w-3.5 h-3.5" />
                        <span>{t.selectedLotBadge}</span>
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedLotId(lot.id);
                      if (lot.id === 'home-top') setPreviewZone('home-top');
                      else if (lot.id === 'salary-results') setPreviewZone('salary-results');
                      else if (lot.id === 'tool-takeover') setPreviewZone('tools-section');
                      else if (lot.id === 'blog-sponsored') setPreviewZone('blog-article');
                      else setPreviewZone('salary-results');

                      const checkoutEl = document.getElementById('checkout-form');
                      if (checkoutEl) checkoutEl.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700'
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                  >
                    <span>{isSelected ? t.selectedLotBadge : t.selectLotBtn}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Interactive Site Blueprint & Zone Mockup Preview */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-1">
              <Eye className="w-3.5 h-3.5 text-blue-600" />
              <span>{t.zonePreviewTitle}</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900">
              {t.zonePreviewTitle}
            </h3>
            <p className="text-xs text-slate-500">
              {t.zonePreviewSubtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'home-top', label: '1. Topo Header' },
              { id: 'salary-results', label: '2. Pós-Salário' },
              { id: 'tools-section', label: '3. Ferramentas' },
              { id: 'blog-article', label: '4. Artigos Blog' },
              { id: 'footer-wide', label: '5. Rodapé' },
            ].map((z) => (
              <button
                key={z.id}
                type="button"
                onClick={() => setPreviewZone(z.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer border ${
                  previewZone === z.id
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {z.label}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Mockup Container */}
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-white space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-slate-800">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Visualização ao Vivo da Página (Simulador de Posicionamento)</span>
            </span>
            <span className="font-mono text-[11px] text-blue-400">URL: paienet.qc.ca/#{previewZone}</span>
          </div>

          {/* Contextual Render Preview */}
          <div className="p-4 sm:p-6 bg-slate-900 rounded-xl border border-dashed border-slate-700 space-y-4">
            {previewZone === 'home-top' && (
              <div className="space-y-3">
                <div className="p-3 bg-blue-600/10 border border-blue-500/30 rounded-xl text-center">
                  <span className="text-xs font-extrabold text-blue-400 uppercase tracking-widest block mb-1">
                    🎯 SUA MARCA AQUI (Leaderboard Topo 728×90)
                  </span>
                  <p className="text-sm font-bold text-white">
                    Desjardins / Empresa Parceira: Abra sua conta salário no Québec com vantagens exclusivas
                  </p>
                </div>
                <div className="h-10 bg-slate-800/60 rounded-lg flex items-center justify-center text-xs text-slate-500">
                  [Cabeçalho da Calculadora & Entradas Salariais Logo Abaixo]
                </div>
              </div>
            )}

            {previewZone === 'salary-results' && (
              <div className="space-y-3">
                <div className="h-14 bg-slate-800/80 rounded-lg flex items-center justify-center text-xs text-slate-400 font-mono">
                  [Tabela de Salário Líquido: $2.140,50 CAD | Retenções: RRQ, RQAP, Imposto Federal/QC]
                </div>
                <div className="p-4 bg-emerald-950/40 border-2 border-emerald-500/40 rounded-xl text-center space-y-1">
                  <span className="text-[11px] font-extrabold text-emerald-400 uppercase tracking-widest block">
                    💰 ZONA PRIME PÓS-CONTRACHEQUE (Maior CTR do Portal)
                  </span>
                  <p className="text-sm font-bold text-white">
                    Poupe até $1.856 em deduções no seu imposto: Simule seu plano REER institucional
                  </p>
                  <span className="inline-block px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold mt-2">
                    Botão de Ação / Link Rastreável
                  </span>
                </div>
              </div>
            )}

            {previewZone === 'tools-section' && (
              <div className="space-y-3">
                <div className="p-3.5 bg-purple-950/40 border border-purple-500/30 rounded-xl text-center">
                  <span className="text-[11px] font-extrabold text-purple-400 uppercase tracking-widest block">
                    🚀 PATROCÍNIO OFICIAL DE MÓDULO & FERRAMENTA
                  </span>
                  <p className="text-sm font-bold text-white">
                    &ldquo;Simulador de Entrevistas STAR oferecido com exclusividade pela Agência Talent Québec&rdquo;
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="h-12 bg-slate-800/50 rounded-lg"></div>
                  <div className="h-12 bg-slate-800/50 rounded-lg"></div>
                  <div className="h-12 bg-slate-800/50 rounded-lg"></div>
                </div>
              </div>
            )}

            {previewZone === 'blog-article' && (
              <div className="space-y-3">
                <div className="h-6 bg-slate-800/80 rounded w-3/4"></div>
                <div className="h-4 bg-slate-800/50 rounded w-full"></div>
                <div className="h-4 bg-slate-800/50 rounded w-5/6"></div>
                <div className="p-3.5 bg-amber-950/40 border border-amber-500/30 rounded-xl text-center">
                  <span className="text-[11px] font-extrabold text-amber-400 uppercase tracking-widest block">
                    📚 ARTIGO PATROCINADO & LINK DO-FOLLOW PERMANENTE
                  </span>
                  <p className="text-sm font-bold text-white">
                    Conteúdo editorial de alta autoridade indexado no Google falando diretamente com o público da sua marca.
                  </p>
                </div>
              </div>
            )}

            {previewZone === 'footer-wide' && (
              <div className="space-y-3">
                <div className="h-8 bg-slate-800/60 rounded"></div>
                <div className="p-3 bg-blue-950/40 border border-blue-500/30 rounded-xl text-center">
                  <span className="text-[11px] font-extrabold text-blue-400 uppercase tracking-widest block">
                    🤝 VITRINE INSTITUCIONAL DE RODAPÉ
                  </span>
                  <p className="text-xs font-bold text-white">
                    Presença em 100% das páginas do portal, fortalecendo a confiança dos usuários.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 6. Checkout & Lot Reservation Form (Área de Vendas) */}
      <div id="checkout-form" className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
        {submittedInquiry ? (
          <div className="p-6 sm:p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">
              {t.successTitle}
            </h3>
            <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
              {t.successMsg}
            </p>

            <div className="p-4 bg-white rounded-xl max-w-md mx-auto border border-emerald-100 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">{t.protocol}:</span>
                <span className="font-mono font-bold text-slate-900">{submittedInquiry.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Lote Reservado:</span>
                <span className="font-bold text-slate-900">{submittedInquiry.slotName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t.summaryVal}:</span>
                <span className="font-black text-emerald-600 text-sm">${submittedInquiry.priceCad.toFixed(2)} CAD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Empresa:</span>
                <span className="font-semibold text-slate-800">{submittedInquiry.companyName}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <a
                href={`https://wa.me/15148904421?text=Olá! Acabei de solicitar a reserva da proposta ${submittedInquiry.id} para a empresa ${encodeURIComponent(submittedInquiry.companyName)} no PaieNet.`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-transform active:scale-95 cursor-pointer"
              >
                <span>{t.btnWhatsapp}</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={() => setSubmittedInquiry(null)}
                className="py-3 px-6 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                {t.btnNew}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-extrabold text-blue-600 uppercase tracking-wider block mb-1">
                  Reserva & Contratação B2B
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  {t.checkoutTitle}
                </h3>
                <p className="text-xs text-slate-500">
                  {t.checkoutSubtitle}
                </p>
              </div>

              {/* Duration selector */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0">
                {[
                  { id: 'monthly', label: '1 Mês' },
                  { id: 'quarterly', label: '3 Meses (-15%)' },
                  { id: 'biannual', label: '6 Meses (-25%)' },
                  { id: 'one_time', label: 'Avulso' },
                ].map((dur) => (
                  <button
                    key={dur.id}
                    type="button"
                    onClick={() => setSelectedDuration(dur.id as any)}
                    className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedDuration === dur.id
                        ? 'bg-white text-blue-600 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {dur.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Lot Header Confirmation */}
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
                  Lote Selecionado:
                </span>
                <span className="font-black text-slate-900 text-base">{currentLot.name}</span>
                <span className="text-xs text-slate-600 block mt-0.5">{currentLot.format} • {currentLot.impressionsEst}</span>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-500 block uppercase">Total Previsto:</span>
                <span className="text-2xl font-black text-blue-600">${calculatedPriceCad.toFixed(2)} CAD</span>
              </div>
            </div>

            {/* Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {t.companyLabel} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="Ex: Desjardins Assurances Inc."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {t.contactLabel} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  placeholder="Ex: Sophie Larouche"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {t.emailLabel} *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Ex: contact@votre-entreprise.ca"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {t.phoneLabel}
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Ex: +1 (514) 890-0000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {t.websiteLabel}
                </label>
                <input
                  type="url"
                  value={formData.websiteUrl}
                  onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                  placeholder="https://votre-entreprise.ca"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {t.msgLabel}
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={t.msgPlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Sem cobrança imediata no cartão. Enviamos fatura proforma após aprovação do criativo.</span>
              </span>

              <button
                type="submit"
                disabled={isSubmitting}
                className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-transform active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Gerando Proposta...' : t.btnSubmit}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
