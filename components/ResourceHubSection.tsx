'use client';

import React, { useState, useMemo } from 'react';
import { Language } from '@/lib/i18n';
import { ToolId } from '@/components/ToolboxGrid';
import { adminStore, DigitalAsset } from '@/lib/admin-store';
import { generateAssetFileContent } from '@/lib/asset-downloader';
import {
  BookOpen,
  Download,
  Eye,
  Search,
  Sparkles,
  FileText,
  FileSpreadsheet,
  CheckCircle2,
  Lock,
  ArrowRight,
  Star,
  ShieldCheck,
  Zap,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Share2,
  X,
  Mail,
} from 'lucide-react';

interface ResourceHubSectionProps {
  lang: Language;
  onSelectTool: (tool: ToolId) => void;
  onOpenEbookModal?: () => void;
  onOpenProModal?: (trigger?: string) => void;
}

export const ResourceHubSection: React.FC<ResourceHubSectionProps> = ({
  lang,
  onSelectTool,
  onOpenEbookModal,
  onOpenProModal,
}) => {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'ebook' | 'template' | 'spreadsheet' | 'checklist'>('all');
  const [previewAsset, setPreviewAsset] = useState<DigitalAsset | null>(null);
  
  // Lead Magnet / Download state
  const [downloadModalAsset, setDownloadModalAsset] = useState<DigitalAsset | null>(null);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);

  // Digital assets list with rich content
  const assets: DigitalAsset[] = useMemo(() => [
    {
      id: 'asset-ebook-survival',
      title: lang === 'pt' ? 'Guia Definitivo do Salário & Emprego no Québec 2026' : lang === 'fr' ? 'Guide Ultime de Survie Fiscale & Emploi au Québec 2026' : 'Ultimate Quebec Tax & Employment Survival Guide 2026',
      subtitle: lang === 'pt' ? 'Manual completo de 140 páginas: deduções, negociação de aumento, contracheque e direitos CNESST.' : lang === 'fr' ? 'Manuel de référence de 140 pages : impôts, négociation salariale et normes CNESST.' : 'Comprehensive 140-page manual: tax brackets, paystub anatomy and labor standards.',
      category: 'ebook',
      accessType: 'paid',
      fileFormat: 'PDF',
      fileSize: '4.8 MB',
      pageOrItemCount: '140 pages',
      regularPriceCad: 29.99,
      promotionalPriceCad: 9.99,
      downloadUrl: '/downloads/guide-survie-fiscale-quebec-2026.pdf',
      salesStatus: 'active',
      badge: 'Bestseller 2026',
      badgeColor: 'purple',
      totalDownloads: 1420,
      totalRevenueCad: 14185.80,
      featured: true,
      highlights: [
        'Anatomia passo a passo do holerite (RRQ, RQAP, imposto federal com abattement 16.5%)',
        'Modelos prontos de e-mail em francês para pedir aumento salarial',
        'Guia de direitos legais da CNESST: férias (4%/6%), horas extras (1.5x) e feriados',
        'Estratégia de restituição máxima no imposto de renda com REER e CELIAPP',
      ],
      tags: ['Impostos', 'Emprego', 'CNESST', 'REER'],
      contentSnippet: `SOMMAIRE DU GUIDE OFFICIEL (EXTRAIT DÉCOUVERTE) :
Chapitre 1 : Les fondations de la paie au Québec (Revenu Québec vs ARC)
Chapitre 2 : L'abattement du Québec de 16,5 % : calcul et incidence concrète
Chapitre 3 : Les cotisations au RRQ (base + supplémentaire) et au RQAP
Chapitre 4 : La règle des heures supplémentaires après 40 heures (ou 44h en usine)
Chapitre 5 : Indemnité de jours fériés et calcul de la règle du 1/20
Chapitre 6 : Négocier son salaire en sol québécois : terminologie et grilles syndicales`,
    },
    {
      id: 'asset-template-cv-ats',
      title: lang === 'pt' ? 'Template Oficial de Currículo Canadense (Formato ATS)' : lang === 'fr' ? 'Modèle Officiel de CV Format Canadien (Compatible ATS)' : 'Official Canadian ATS Resume Template',
      subtitle: lang === 'pt' ? 'Gabarito em Word (.docx) 100% aprovado contra discriminação e filtros automáticos de RH.' : lang === 'fr' ? 'Gabarit Word (.docx) sans photo conforme aux normes québécoises anti-discrimination.' : 'Clean .docx template formatted for anti-bias laws and recruiter ATS software.',
      category: 'template',
      accessType: 'free',
      fileFormat: 'DOCX',
      fileSize: '185 KB',
      pageOrItemCount: '2 pages',
      regularPriceCad: 15.00,
      promotionalPriceCad: 0.00,
      downloadUrl: '/downloads/modele-cv-format-canadien-ats.docx',
      salesStatus: 'active',
      badge: 'Gratuito / Free',
      badgeColor: 'emerald',
      totalDownloads: 8940,
      totalRevenueCad: 0,
      featured: true,
      highlights: [
        'Sem foto e sem dados protegidos por lei (idade, gênero, estado civil)',
        'Estruturado com verbos de ação para maximizar a pontuação no robô ATS',
        'Inclui seções padronizadas: Profil, Compétences clés, Expérience, Formation',
        'Instruções comentadas sobre equivalência de diplomas (MIFI)',
      ],
      tags: ['Currículo', 'ATS', 'Word', 'Recrutamento'],
      contentSnippet: `PAIENET.QC - GABARITO DE CV CANADENSE ATS :
- En-tête : Nom complet, Ville, Courriel professionnel, Téléphone local, Lien LinkedIn.
- Profil professionnel percutant de 3 lignes.
- Compétences techniques & mots-clés exacts de l'offre d'emploi.
- Réalisations chiffrées avec verbes d'action au passé ("Optimisé", "Géré", "Réduit de X%").`,
    },
    {
      id: 'asset-sheet-budget',
      title: lang === 'pt' ? 'Planilha de Custo de Vida & Orçamento Familiar no Canadá' : lang === 'fr' ? 'Tableur Budget & Coût de la Vie au Québec 2026' : 'Quebec Cost of Living & Family Budget Sheet',
      subtitle: lang === 'pt' ? 'Planilha interativa (Excel e Google Sheets) com preços reais de aluguel, transporte e supermercado.' : lang === 'fr' ? 'Tableur Excel/Sheets automatisé avec ratios de dépenses réelles (Montréal, Québec, Gatineau).' : 'Interactive Excel/Google Sheets workbook with real rent, groceries and utilities benchmarks.',
      category: 'spreadsheet',
      accessType: 'free',
      fileFormat: 'XLSX',
      fileSize: '320 KB',
      pageOrItemCount: '3 onglets',
      regularPriceCad: 19.00,
      promotionalPriceCad: 0.00,
      downloadUrl: '/downloads/planilha-custo-vida-quebec-2026.xlsx',
      salesStatus: 'active',
      badge: 'Isca Principal',
      badgeColor: 'blue',
      totalDownloads: 5410,
      totalRevenueCad: 0,
      featured: true,
      highlights: [
        'Compara custos médios: Montreal vs Québec City vs Gatineau vs Sherbrooke',
        'Calcula a margem de sobra no final do mês baseado no seu salário líquido',
        'Simulador de gastos com aluguel, Hydro-Québec, passe STM e alimentação',
        'Fórmulas automáticas e compatíveis com Excel e Google Planilhas',
      ],
      tags: ['Orçamento', 'Excel', 'Custo de Vida', 'Montreal'],
      contentSnippet: `PLANILHA DE CUSTO DE VIDA (AMOSTRA) :
- Moradia : 3 1/2 ($1.450 Montréal / $1.100 Québec), Seguro Inquilino ($35)
- Transporte : Passe STM ($100), Seguro Auto ($140)
- Supermercado Casal : Maxi/Super C ($650/mês)
- Salário líquido necessário recomendado : $3.120 CAD/mês por pessoa`,
    },
    {
      id: 'asset-checklist-cnesst',
      title: lang === 'pt' ? 'Checklist de Contratação & Direitos Legais do Trabalhador (CNESST)' : lang === 'fr' ? 'Aide-Mémoire des Droits du Salarié & Normes CNESST' : 'Employee Legal Rights & CNESST Cheat-Sheet',
      subtitle: lang === 'pt' ? 'Guia rápido em PDF com todas as regras que nenhum empregador pode violar no Québec.' : lang === 'fr' ? 'Synthèse des 10 règles incontournables : paie, heures sup, congés payés et préavis légal.' : '10 non-negotiable legal labor rules every Quebec worker must know.',
      category: 'checklist',
      accessType: 'free',
      fileFormat: 'PDF',
      fileSize: '950 KB',
      pageOrItemCount: '6 pages',
      regularPriceCad: 10.00,
      promotionalPriceCad: 0.00,
      downloadUrl: '/downloads/checklist-direitos-cnesst-quebec.pdf',
      salesStatus: 'active',
      badge: 'Guia de Direitos',
      badgeColor: 'amber',
      totalDownloads: 3220,
      totalRevenueCad: 0,
      featured: false,
      highlights: [
        'A regra do pagamento de horas extras a 150% (tempo e meio) após 40h',
        'Cálculo da regra do 1/20 para feriados remunerados',
        'Direito a pausas de descanso e refeições remuneradas ou não',
        'Prazos legais de aviso prévio em caso de demissão (préavis)',
      ],
      tags: ['CNESST', 'Direitos', 'PDF', 'Leis'],
      contentSnippet: `LES 10 RÈGLES D'OR DE LA CNESST :
1. Salaire minimum : Respect strict du taux en vigueur (16,10 $/h au 1er mai 2025/2026).
2. Heures supplémentaires : Taux majoré de 50 % après 40 heures hebdomadaires.
3. Fériés payés : Indemnité légale égale à 1/20 du salaire gagné au cours des 4 semaines précédentes.
4. Vacances annuelles : 4 % (2 semaines) la première année, 6 % (3 semaines) après 3 ans.`,
    },
    {
      id: 'asset-interview-star-pack',
      title: lang === 'pt' ? 'Caderno de Respostas STAR para Entrevistas de Emprego' : lang === 'fr' ? 'Cahier de Réponses Méthode STAR pour Entrevues au Québec' : 'STAR Method Interview Answer Playbook',
      subtitle: lang === 'pt' ? '30 exemplos prontos de respostas estruturadas para perguntas comportamentais no Québec.' : lang === 'fr' ? '30 réponses rédigées aux questions pièges des recruteurs québécois.' : '30 structured behavioral interview answer scripts tailored to Canadian culture.',
      category: 'template',
      accessType: 'paid',
      fileFormat: 'PDF',
      fileSize: '2.1 MB',
      pageOrItemCount: '48 pages',
      regularPriceCad: 24.00,
      promotionalPriceCad: 7.99,
      downloadUrl: '/downloads/cahier-reponses-star-entrevues.pdf',
      salesStatus: 'active',
      badge: 'RH & Vagas',
      badgeColor: 'indigo',
      totalDownloads: 1180,
      totalRevenueCad: 9428.20,
      featured: false,
      highlights: [
        'Situação, Tarefa, Ação e Resultado aplicados com exemplos práticos',
        'Como responder "Fale sobre um conflito com um colega de equipe"',
        'Como responder "Qual foi seu maior erro e como você o superou"',
        'Frases em francês formal com vocabulário corporativo do Québec',
      ],
      tags: ['Entrevistas', 'STAR', 'Carreira', 'Francês'],
      contentSnippet: `STRUCTURE GAGNANTE D'UNE RÉPONSE STAR :
S (Situation) : Décrire le contexte professionnel en 2 phrases précises.
T (Tâche) : L'objectif ou le défi concret auquel vous faisiez face.
A (Action) : Vos actions personnelles entreprises (verbes d'action à la 1re personne).
R (Résultat) : L'impact mesurable en % ou en dollars généré pour l'employeur.`,
    },
    {
      id: 'asset-interprovincial-relocation',
      title: lang === 'pt' ? 'Guia de Mudança Interprovincial: Québec vs Ontário vs Alberta' : lang === 'fr' ? 'Dossier Relocalisation Interprovinciale : Québec vs Ontario vs Alberta' : 'Interprovincial Relocation Dossier: QC vs ON vs AB',
      subtitle: lang === 'pt' ? 'Análise comparativa de impostos, custos de moradia, saúde pública e poder de compra real.' : lang === 'fr' ? 'Comparatif fiscal et coût de la vie pour les travailleurs changeant de province.' : 'Comparative tax, rent and health coverage guide for interprovincial movers.',
      category: 'guide',
      accessType: 'free',
      fileFormat: 'PDF',
      fileSize: '1.4 MB',
      pageOrItemCount: '24 pages',
      regularPriceCad: 15.00,
      promotionalPriceCad: 0.00,
      downloadUrl: '/downloads/guia-relocacao-interprovincial-canada.pdf',
      salesStatus: 'active',
      badge: 'Novo / New',
      badgeColor: 'blue',
      totalDownloads: 1950,
      totalRevenueCad: 0,
      featured: false,
      highlights: [
        'Como funciona a transferência de província fiscal perante o imposto de renda (31 de dezembro)',
        'Cartão de saúde: períodos de carência (OHIP, RAMQ, AHCIP)',
        'Diferenças nas deduções em folha: RRQ vs CPP e RQAP vs Seguro-Desemprego federal',
        'Custos comparados de creches públicas e moradia',
      ],
      tags: ['Mudança', 'Províncias', 'Ontário', 'Alberta'],
      contentSnippet: `RÈGLES CLÉS DE RÉSIDENCE FISCALE AU CANADA :
Selon l'ARC, votre impôt provincial pour l'année entière dépend de votre lieu de résidence légale au 31 décembre !
Déménager avant ou après le 31 décembre peut changer votre facture fiscale de plusieurs milliers de dollars.`,
    },
  ], [lang]);

  // Filtered Assets
  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const matchesSearch =
        asset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (asset.tags && asset.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

      const matchesCat =
        selectedCategory === 'all' || asset.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [assets, searchQuery, selectedCategory]);

  // Handle Download or Buy
  const handleTriggerAction = (asset: DigitalAsset) => {
    if (asset.accessType === 'free') {
      setDownloadModalAsset(asset);
      setDownloadSuccess(false);
    } else {
      if (onOpenEbookModal) {
        onOpenEbookModal();
      } else if (onOpenProModal) {
        onOpenProModal('resources-hub');
      }
    }
  };

  const handleExecuteFreeDownload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!downloadModalAsset || !userEmail) return;

    setIsSubmittingLead(true);

    // Register lead in admin CRM
    adminStore.saveNewsletterLead({
      id: `lead-${Date.now()}`,
      name: userName || 'Usuário PaieNet',
      email: userEmail,
      source: 'resource_download',
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'subscribed',
      funnelStage: 'meio',
      score: 65,
      temperature: 'morno',
      subscriptionStatus: 'nenhum',
      lifetimeValueCad: 0,
      tags: ['Acervo de Guias', downloadModalAsset.category, downloadModalAsset.fileFormat || 'PDF'],
    });

    adminStore.logEvent({
      id: `evt-${Date.now()}`,
      timestamp: 'Agora mesmo',
      type: 'newsletter_signup',
      summary: `Download de material: ${downloadModalAsset.title}`,
      location: 'Canadá',
      details: `E-mail: ${userEmail} | Formato: ${downloadModalAsset.fileFormat}`,
    });

    // Generate real file download
    setTimeout(() => {
      try {
        const fileData = generateAssetFileContent(downloadModalAsset);
        const blob = new Blob([fileData.content], { type: fileData.mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${downloadModalAsset.id}.${fileData.extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error('Download execution error', err);
      }

      setIsSubmittingLead(false);
      setDownloadSuccess(true);
    }, 600);
  };

  return (
    <div className="space-y-8">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl space-y-6 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              {lang === 'pt' ? 'Acervo de Conhecimento & Materiais Práticos' : lang === 'fr' ? 'Centre de Guides & Outils Numériques' : 'Knowledge & Practical Downloads Hub'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {lang === 'pt'
              ? 'Guias, Modelos de CV, Planilhas & Infoprodutos Fiscais'
              : lang === 'fr'
              ? 'Guides Fiscaux, Modèles de CV & Outils Pratiques au Québec'
              : 'Tax Guides, ATS Resume Templates & Financial Workbooks'}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {lang === 'pt'
              ? 'Materiais estruturados por contadores e especialistas em RH no Québec. Explore amostras gratuitas, baixe templates validados em ATS e acelere sua conquista salarial.'
              : lang === 'fr'
              ? 'Ressources professionnelles rédigées pour les travailleurs québécois : manuels d’impôts, tableurs de budget et gabarits de CV conformes.'
              : 'Handcrafted by Quebec fiscal and HR specialists: tax survival guides, ATS resume kits and cost-of-living calculators.'}
          </p>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>100% Conforme às Leis do Québec</span>
            </div>
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-blue-400" />
              <span>+25.000 Downloads Realizados</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>4.9 / 5.0 Avaliação Média</span>
            </div>
          </div>
        </div>

        {/* Search Bar & Filter Ribbon */}
        <div className="relative z-10 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={lang === 'pt' ? 'Pesquisar e-books, modelos de CV, planilhas...' : 'Rechercher un guide, modèle de CV, tableur...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-xs sm:text-sm font-medium focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: lang === 'pt' ? 'Todos' : 'Tous' },
              { id: 'ebook', label: '📚 E-books' },
              { id: 'template', label: '📄 Modelos ATS' },
              { id: 'spreadsheet', label: '📊 Planilhas' },
              { id: 'checklist', label: '⚖️ CNESST & Leis' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md font-extrabold'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Interactive Catalog Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-black text-slate-900">
            {lang === 'pt' ? 'Materiais Disponíveis no Acervo' : 'Ressources Disponibles au Téléchargement'}
          </h2>
          <span className="text-xs text-slate-500 font-semibold">
            {filteredAssets.length} {lang === 'pt' ? 'materiais encontrados' : 'ressources disponibles'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssets.map((asset) => {
            const isFree = asset.accessType === 'free';

            return (
              <div
                key={asset.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all p-6 flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  {/* Top Bar with Badge & Format */}
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${
                        asset.badgeColor === 'emerald'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : asset.badgeColor === 'purple'
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : asset.badgeColor === 'amber'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}
                    >
                      {asset.badge}
                    </span>

                    <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg">
                      <span>{asset.fileFormat}</span>
                      <span>·</span>
                      <span>{asset.fileSize}</span>
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                      {asset.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {asset.subtitle}
                    </p>
                  </div>

                  {/* Highlights Bullet List */}
                  {asset.highlights && asset.highlights.length > 0 && (
                    <ul className="space-y-1.5 pt-2 border-t border-slate-100">
                      {asset.highlights.slice(0, 3).map((h, i) => (
                        <li key={i} className="text-[11px] text-slate-600 flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Bottom Action Section */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <div>
                      {isFree ? (
                        <span className="text-lg font-black text-emerald-600">GRATUITO</span>
                      ) : (
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xl font-black text-slate-900">
                            ${asset.promotionalPriceCad.toFixed(2)} CAD
                          </span>
                          <span className="text-xs text-slate-400 line-through">
                            ${asset.regularPriceCad.toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>

                    <span className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                      <Download className="w-3 h-3 text-slate-400" />
                      <span>{asset.totalDownloads.toLocaleString()} downloads</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPreviewAsset(asset)}
                      className="w-full py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span>{lang === 'pt' ? 'Amostra' : 'Aperçu'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleTriggerAction(asset)}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs ${
                        isFree
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {isFree ? (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          <span>{lang === 'pt' ? 'Baixar Grátis' : 'Télécharger'}</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5" />
                          <span>{lang === 'pt' ? 'Comprar' : 'Acheter'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. In-App Sample / Amostra Modal Reader */}
      {previewAsset && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setPreviewAsset(null)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600 block">
                Visualização de Amostra Oficial
              </span>
              <h3 className="text-xl font-black text-slate-900">{previewAsset.title}</h3>
              <p className="text-xs text-slate-500">{previewAsset.subtitle}</p>
            </div>

            <div className="p-4 bg-slate-900 text-slate-200 rounded-2xl font-mono text-xs leading-relaxed space-y-2 max-h-72 overflow-y-auto border border-slate-800">
              <pre className="whitespace-pre-wrap font-sans text-xs text-slate-300">
                {previewAsset.contentSnippet}
              </pre>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-800">Destaques e Benefícios Deste Material:</h4>
              <ul className="space-y-1">
                {previewAsset.highlights?.map((hl, i) => (
                  <li key={i} className="text-xs text-slate-600 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{hl}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setPreviewAsset(null)}
                className="py-2 px-4 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Fechar Amostra
              </button>
              <button
                type="button"
                onClick={() => {
                  const target = previewAsset;
                  setPreviewAsset(null);
                  handleTriggerAction(target);
                }}
                className="py-2.5 px-5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer flex items-center gap-2 shadow-xs"
              >
                <span>{previewAsset.accessType === 'free' ? 'Baixar Material Completo' : 'Comprar Versão Integral'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Free Download / Lead Magnet Email Capture Modal */}
      {downloadModalAsset && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <button
              type="button"
              onClick={() => {
                setDownloadModalAsset(null);
                setDownloadSuccess(false);
              }}
              className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!downloadSuccess ? (
              <form onSubmit={handleExecuteFreeDownload} className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <Download className="w-6 h-6" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-black text-slate-900">
                    {lang === 'pt' ? 'Baixar Material Gratuito' : 'Téléchargement Gratuit'}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Informe seu e-mail para receber o arquivo <strong>{downloadModalAsset.title}</strong> ({downloadModalAsset.fileFormat}) imediatamente.
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      {lang === 'pt' ? 'Seu Nome (Opcional)' : 'Votre Prénom'}
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Gabriel Silva"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      {lang === 'pt' ? 'Seu Melhor E-mail' : 'Votre Courriel'} *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="seu.email@exemplo.com"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmittingLead}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                  >
                    {isSubmittingLead ? (
                      <span>Gerando Download Seguro...</span>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>{lang === 'pt' ? 'Liberar e Baixar Agora' : 'Recevoir & Télécharger'}</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-[10px] text-slate-400 text-center">
                  🔒 Garantia Antispam: Seus dados estão 100% seguros. Não compartilhamos com terceiros.
                </p>
              </form>
            ) : (
              <div className="text-center py-4 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-slate-900">Download Iniciado com Sucesso!</h3>
                  <p className="text-xs text-slate-600">
                    O arquivo <strong>{downloadModalAsset.id}.{downloadModalAsset.fileFormat?.toLowerCase()}</strong> foi gerado e enviado diretamente para seu navegador.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setDownloadModalAsset(null);
                    setDownloadSuccess(false);
                  }}
                  className="py-2 px-6 rounded-xl bg-slate-900 text-white text-xs font-bold cursor-pointer hover:bg-slate-800 transition-colors"
                >
                  Concluir
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
