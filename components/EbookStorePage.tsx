'use client';

import React, { useState, useEffect, useMemo, useSyncExternalStore } from 'react';
import { Language } from '@/lib/i18n';
import { ToolId } from '@/components/ToolboxGrid';
import { adminStore, DigitalAsset } from '@/lib/admin-store';
import { TrustAuthorityBar } from '@/components/TrustAuthorityBar';
import { AdBanner } from '@/components/AdBanner';
import { NewsletterBox } from '@/components/NewsletterBox';
import {
  BookOpen,
  CheckCircle2,
  Download,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Check,
  FileText,
  FileSpreadsheet,
  CheckSquare,
  Compass,
  ArrowLeft,
  Layers,
  Clock,
  Lock,
  Star,
  ChevronDown,
  Share2,
  Gift,
  Award,
} from 'lucide-react';
import { normalizeUrl } from '@/lib/utils';

interface EbookStorePageProps {
  lang: Language;
  onSelectTool: (tool: ToolId) => void;
  initialAssetId?: string;
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  ebook: BookOpen,
  template: FileText,
  spreadsheet: FileSpreadsheet,
  checklist: CheckSquare,
  guide: Compass,
};

const CHAPTERS_DATA = [
  {
    num: '01',
    title: {
      pt: 'As Fundações da Folha no Québec: Revenu Québec vs ARC',
      fr: 'Les fondations de la paie au Québec : Revenu Québec vs ARC',
      en: 'Quebec Payroll Foundations: Revenu Québec vs CRA',
    },
    desc: {
      pt: 'Entenda por que o Québec é a única província canadense com duas declarações fiscais separadas e como os dois governos retêm imposto na fonte simultaneamente.',
      fr: 'Comprenez pourquoi le Québec est la seule province avec deux déclarations fiscales et comment les retenues à la source fonctionnent.',
      en: 'Why Quebec is the only Canadian province with dual tax returns and how federal and provincial source deductions interact.',
    },
    excerpt: `O trabalhador no Québec tem retenção em duas esferas fiscais:
1. Retenção Provincial (Revenu Québec) : Imposto sobre a renda do Québec (alíquotas de 14%, 19%, 24% e 25,75%), cotização ao RRQ (Regime de Rentes du Québec) e cotização ao RQAP (Regime Québécois d'Assurance Parentale).
2. Retenção Federal (ARC - Agência de Receita do Canadá) : Imposto federal canadense com o benefício exclusivo do "Abattement du Québec" de 16,5%, além do Seguro-Emprego (AE / EI) com alíquota reduzida.`,
  },
  {
    num: '02',
    title: {
      pt: 'O Abattement do Québec de 16,5%: O Segredo do Imposto Federal',
      fr: 'L’abattement du Québec de 16,5 % : calcul et incidence concrète',
      en: 'The 16.5% Quebec Abatement: The Federal Tax Calculation Key',
    },
    desc: {
      pt: 'Cálculo matemático detalhado de como o governo federal devolve 16,5% do imposto de base diretamente no holerite para compensar os programas provinciais próprios.',
      fr: 'Calcul mathématique détaillé de la remise fédérale de 16,5 % appliquée directement sur le talon de paie québécois.',
      en: 'Mathematical walkthrough of the 16.5% federal basic tax reduction granted to Quebec residents to account for provincial autonomy.',
    },
    excerpt: `Fórmula Oficial de Cálculo no Holerite:
Imposto Federal Bruto Calculado = [Renda Tributável Federal × Alíquota Federal] - Créditos Básicos
Abattement du Québec (16,5%) = Imposto Federal Básico × 0,165
Imposto Federal Líquido a Reter = Imposto Federal Básico - Abattement du Québec.
Resultado prático: Você paga menos imposto federal nominal, pois uma parte desse valor é transferida para o financiamento dos serviços do Québec.`,
  },
  {
    num: '03',
    title: {
      pt: 'Cotizações Sociais: RRQ 1, RRQ 2 (Novo) e RQAP',
      fr: 'Cotisations sociales : RRQ base, RRQ supplémentaire et RQAP',
      en: 'Social Deductions: QPP Base, QPP Additional & QPIP',
    },
    desc: {
      pt: 'Tabela dos tetos de 2026: MGA 1 ($71.300) e MGA 2 ($81.900), isenção básica de $3.500 e momento exato em que seu salário líquido sobe no fim do ano.',
      fr: 'Plafonds officiels 2026 : MGA de base et deuxième plafond MGA, exemption de 3 500 $ et effet de déduction maximale atteinte.',
      en: 'Official 2026 ceilings: YMPE 1 and YMPE 2, basic exemption of $3,500 and the take-home pay boost when annual caps are reached.',
    },
    excerpt: `Mecânica do Teto de Cotizações (Efeito de Aumento Líquido no 2º Semestre):
- RRQ Base (5,40%): Cobre salários até o MGA 1 ($71.300). Ao atingir a cotização máxima anual (~$3.661), o desconto para de ser cobrado até 31 de dezembro!
- RRQ Adicional 2 (4,00%): Incide apenas sobre a faixa entre o MGA 1 e o MGA 2 ($71.300 a $81.900).
- RQAP (0,494%): Cobre a licença maternidade/paternidade com teto de $98.000.`,
  },
  {
    num: '04',
    title: {
      pt: 'Normas CNESST: Horas Extras (1,5×), Banco de Horas e Feriados (1/20)',
      fr: 'Normes CNESST : Heures supplémentaires (1,5×), banque d’heures et fériés',
      en: 'CNESST Labor Standards: Overtime (1.5×), Time Bank and Statutory Holidays',
    },
    desc: {
      pt: 'Seus direitos inegociáveis por lei: após quantas horas começa o adicional de 50%, recusa de hora extra por motivos familiares e cálculo da regra do 1/20 para feriados.',
      fr: 'Vos droits légaux non négociables : seuil des 40h, refus légitime et calcul officiel du 1/20e pour les jours fériés chômés.',
      en: 'Your non-negotiable legal rights: 40h overtime threshold, statutory holiday 1/20 compensation and overtime bank management.',
    },
    excerpt: `Regra de Ouro da CNESST para Feriados:
A indenização de feriado pago corresponde a 1/20 (5%) do salário total ganho nas 4 semanas completas anteriores ao feriado (excluindo horas extras).
Se você trabalhar no dia do feriado, tem direito ao salário do dia trabalhado MAIS a indenização integral de feriado ou um dia de folga compensatório remunerado de até 3 semanas.`,
  },
  {
    num: '05',
    title: {
      pt: 'Benefícios Tributáveis: Seguro Coletivo, Plano de Saúde e Carro',
      fr: 'Avantages imposables : Assurance collective, santé et véhicule',
      en: 'Taxable Benefits: Group Insurance, Health & Vehicle Perks',
    },
    desc: {
      pt: 'Por que o seguro de saúde pago pelo empregador é tributado no Québec mas não no federal, e como ler o demonstrativo de vantagens tributáveis da sua empresa.',
      fr: 'Particularité québécoise : pourquoi la prime d’assurance payée par l’employeur est un avantage imposable au provincial.',
      en: 'Unique Quebec rule: why employer-paid health coverage is taxable at the provincial level and how to audit your benefits box.',
    },
    excerpt: `Atenção à Caixa L da Relevé 1 do Québec:
No Québec, a parcela do seguro de saúde/odontológico paga pelo seu empregador é considerada benefício tributável provincial. Isso significa que ela entra na sua renda tributável do Québec, aumentando a retenção de imposto provincial a cada folha, embora não seja tributada pelo governo federal.`,
  },
  {
    num: '06',
    title: {
      pt: 'Estratégias de Negociação Salarial & Grilhas Sindicais no Québec',
      fr: 'Négociation salariale, échelons et conventions collectives au Québec',
      en: 'Salary Negotiation Tactics & Pay Scales in Quebec',
    },
    desc: {
      pt: 'Modelos de e-mails em francês corporativo para pedir revisão salarial, como pesquisar faixas de mercado no Guichet-Emploi e entender escalões e anos de experiência.',
      fr: 'Modèles de courriels professionnels pour demander une augmentation et naviguer les échelons salariaux québécois.',
      en: 'Professional French email templates for pay raises, benchmark research on Guichet-Emploi and navigating pay step grids.',
    },
    excerpt: `Vocabulário Essencial para Negociação no Québec:
- "Échelon" : Degrau salarial dentro de uma faixa com aumentos automáticos por ano de serviço.
- "Augmentation au mérite" : Aumento de desempenho baseado em avaliação anual.
- "Indemnité de vie chère" : Ajuste pelo custo de vida e inflação.
- "Gamme d'avantages sociaux" : Pacote de benefícios não monetários (dias de doença móveis, férias extras, cotização de REER igualada pelo empregador).`,
  },
];

export const EbookStorePage: React.FC<EbookStorePageProps> = ({
  lang,
  onSelectTool,
  initialAssetId = 'asset-ebook-survival',
}) => {
  const ebookConfig = useSyncExternalStore(
    (cb) => adminStore.subscribe(cb),
    () => adminStore.getEbookConfig(),
    () => adminStore.getInitialEbookConfig()
  );

  const digitalAssets = useSyncExternalStore(
    (cb) => adminStore.subscribe(cb),
    () => adminStore.getDigitalAssets(),
    () => adminStore.getInitialDigitalAssets()
  );

  const [selectedAssetId, setSelectedAssetId] = useState<string>(initialAssetId);
  const [activeTab, setActiveTab] = useState<'overview' | 'chapters' | 'catalog' | 'guarantee'>('overview');
  const [openChapter, setOpenChapter] = useState<number | null>(0);

  // Checkout states
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [couponSuccess, setCouponSuccess] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchased, setPurchased] = useState(false);
  const [catalogFilter, setCatalogFilter] = useState<'all' | 'free' | 'paid'>('all');

  const currentAsset = useMemo(() => {
    return (
      digitalAssets.find((a) => a.id === selectedAssetId) ||
      digitalAssets.find((a) => a.id === 'asset-ebook-survival') ||
      digitalAssets[0]
    );
  }, [digitalAssets, selectedAssetId]);

  const basePrice = currentAsset?.promotionalPriceCad || 9.99;
  const regularPrice = currentAsset?.regularPriceCad || 29.99;
  const isFree = currentAsset?.accessType === 'free';
  const finalPrice = isFree ? 0 : Math.max(1, Number((basePrice - couponDiscount).toFixed(2)));

  useEffect(() => {
    adminStore.logEvent({
      type: 'ebook_view',
      summary: `Página dedicada aberta: ${currentAsset?.title || 'Guia Definitivo do Salário & Emprego'}`,
      location: 'Québec, Canada',
      details: 'Visualização da página completa do e-book e acervo digital',
    });
  }, [currentAsset]);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    if (code === 'QUEBEC2026' || code === 'PAIE20' || code === 'PROMO20') {
      const discount = Math.round((basePrice * 0.2) * 100) / 100;
      setCouponDiscount(discount);
      setCouponSuccess(
        lang === 'pt'
          ? `Cupom ${code} aplicado com sucesso! Desconto de 20% (-$${discount.toFixed(2)} CAD).`
          : `Coupon ${code} appliqué ! Réduction de 20 % (-${discount.toFixed(2)} $ CAD).`
      );
      return;
    }

    const found = ebookConfig.coupons?.find((c) => c.code.toUpperCase() === code && c.active);
    if (found) {
      let discount = 0;
      if (found.discountPercent) {
        discount = (basePrice * found.discountPercent) / 100;
      } else if (found.discountFixedCad) {
        discount = found.discountFixedCad;
      }
      setCouponDiscount(discount);
      setCouponSuccess(
        lang === 'pt'
          ? `Cupom ${found.code} aplicado! Economia de $${discount.toFixed(2)} CAD.`
          : `Coupon ${found.code} appliqué! Économie de ${discount.toFixed(2)} $ CAD.`
      );
    } else {
      setCouponError(lang === 'pt' ? 'Cupom inválido ou expirado.' : 'Coupon invalide ou expiré.');
    }
  };

  const triggerFileDownload = (asset: DigitalAsset) => {
    try {
      const link = document.createElement('a');
      link.href = normalizeUrl(asset.downloadUrl || '/downloads/guide-survie-fiscale-quebec-2026.pdf');
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      const ext = asset.fileFormat ? asset.fileFormat.toLowerCase().split(' ')[0] : 'pdf';
      link.setAttribute('download', `${asset.id}.${ext}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      // fallback
    }
  };

  const handleSimulatePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      alert(
        lang === 'pt'
          ? 'Por favor, informe um e-mail válido para envio da confirmação e do link de download.'
          : 'Veuillez saisir une adresse courriel valide pour recevoir votre accès.'
      );
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPurchased(true);

      adminStore.recordEbookSale({
        customerEmail: email.trim(),
        amountCad: finalPrice,
        assetId: currentAsset.id,
        assetTitle: currentAsset.title,
        couponUsed: couponDiscount > 0 ? couponCode.trim().toUpperCase() : undefined,
        status: 'delivered',
        downloadAccessCount: 1,
      });

      adminStore.saveNewsletterLead({
        id: `cust-${Date.now()}`,
        name: userName || email.split('@')[0],
        email: email.trim(),
        source: 'ebook_purchase',
        date: new Date().toISOString().replace('T', ' ').slice(0, 16),
        status: 'subscribed',
        funnelStage: 'fundo',
        score: 95,
        temperature: 'quente',
        subscriptionStatus: 'ebook_buyer',
        lifetimeValueCad: finalPrice,
        tags: ['Cliente E-book', 'Guia Definitivo 2026', 'Comprador Ativo'],
      });

      triggerFileDownload(currentAsset);
    }, 1000);
  };

  const handleFreeDownloadClick = () => {
    if (!email || !email.includes('@')) {
      alert(lang === 'pt' ? 'Informe seu e-mail para receber o material.' : 'Saisissez votre courriel.');
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      adminStore.recordDigitalAssetDownload(currentAsset.id, email);
      triggerFileDownload(currentAsset);
    }, 600);
  };

  const filteredCatalog = useMemo(() => {
    return digitalAssets.filter((a) => {
      if (a.salesStatus === 'draft') return false;
      if (catalogFilter === 'free') return a.accessType === 'free';
      if (catalogFilter === 'paid') return a.accessType === 'paid';
      return true;
    });
  }, [digitalAssets, catalogFilter]);

  const CatIcon = CATEGORY_ICONS[currentAsset?.category || 'ebook'] || BookOpen;

  return (
    <div className="space-y-8 animate-in fade-in duration-200 pb-16">
      {/* 1. TOP BREADCRUMB & CONTEXT NAVIGATION */}
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

          <button
            type="button"
            onClick={() => onSelectTool('resources')}
            className="text-xs text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            {lang === 'pt' ? 'Acervo de Recursos' : 'Bibliothèque de ressources'}
          </button>

          <span className="text-slate-300">/</span>

          <span className="text-xs font-semibold text-slate-900 truncate max-w-[220px] sm:max-w-xs">
            {currentAsset.title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined' && navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
                alert(lang === 'pt' ? 'Link da página copiado!' : 'Lien copié !');
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 shadow-xs transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-blue-600" />
            <span>{lang === 'pt' ? 'Compartilhar' : 'Partager'}</span>
          </button>
        </div>
      </div>

      {/* 2. REUSABLE TRUST AUTHORITY BAR */}
      <TrustAuthorityBar lang={lang} />

      {/* 3. HERO PRESENTATION CARD WITH 3D BOOK & VALUE PROPOSITION */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white p-6 sm:p-10 border border-slate-800 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Hero Column: Value Proposition & Copy */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 font-bold text-[11px] tracking-wide uppercase">
                {currentAsset.badge || 'Bestseller Oficial 2026'}
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-300 font-medium">
                {currentAsset.pageOrItemCount || '140 páginas'} · Formato {currentAsset.fileFormat || 'PDF'}
              </span>
              <span className="text-slate-400">·</span>
              <span className="inline-flex items-center gap-1 text-amber-300 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                <span>4.9/5 (1.420+ downloads)</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {currentAsset.title}
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {currentAsset.subtitle}
            </p>

            <div className="space-y-2.5 pt-2">
              {(currentAsset.highlights || [
                'Anatomia passo a passo do holerite (RRQ, RQAP, imposto federal com abattement 16.5%)',
                'Modelos prontos de e-mail em francês para pedir aumento salarial',
                'Guia de direitos legais da CNESST: férias (4%/6%), horas extras (1.5x) e feriados',
                'Estratégia de restituição máxima no imposto de renda com REER e CELIAPP',
              ]).map((highlight, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>{highlight}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>Conforme Revenu Québec & ARC 2026</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Acesso Imediato no Seu E-mail</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                <Award className="w-4 h-4 text-emerald-400" />
                <span>Garantia Incondicional de 30 Dias</span>
              </span>
            </div>
          </div>

          {/* Right Hero Column: Book Mockup & Pricing Card */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full max-w-sm rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-900/90 border border-slate-700/80 p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
                <div className="flex items-center gap-2">
                  <CatIcon className="w-5 h-5 text-amber-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    {lang === 'pt' ? 'Edição Digital Completa' : 'Édition Numérique'}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                  2026 Atualizado
                </span>
              </div>

              {/* Book Graphic Card */}
              <div className="h-52 rounded-xl bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 border border-blue-500/30 p-5 flex flex-col justify-between shadow-inner relative overflow-hidden group">
                <div className="absolute top-2 right-2 text-2xl opacity-30 select-none">⚜️</div>
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-200">
                    PaieNet.qc · Publicação Oficial
                  </span>
                  <h3 className="text-lg font-black text-white leading-tight">
                    {currentAsset.title}
                  </h3>
                </div>

                <div className="pt-4 border-t border-blue-400/30 flex items-center justify-between text-xs text-blue-200 font-medium">
                  <span>{currentAsset.pageOrItemCount || '140 Páginas'}</span>
                  <span>PDF + EPUB + Bônus</span>
                </div>
              </div>

              {/* Pricing & CTA */}
              <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800 space-y-3">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block">
                      {isFree ? 'Acesso Livre' : 'Preço Especial de Lançamento'}
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl sm:text-3xl font-black text-emerald-400">
                        {isFree ? 'GRÁTIS' : `$${finalPrice.toFixed(2)} CAD`}
                      </span>
                      {!isFree && (
                        <span className="text-xs text-slate-500 line-through">
                          ${regularPrice.toFixed(2)} CAD
                        </span>
                      )}
                    </div>
                  </div>
                  {!isFree && (
                    <span className="text-[10px] font-extrabold px-2 py-1 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                      67% OFF
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('checkout-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
                >
                  <CreditCard className="w-4 h-4 text-slate-950" />
                  <span>
                    {isFree
                      ? lang === 'pt' ? 'Baixar Material Gratuito' : 'Télécharger gratuitement'
                      : lang === 'pt' ? 'Garantir Acesso Imediato ($9.99)' : 'Acheter maintenant (9,99 $)'}
                  </span>
                </button>

                <p className="text-[11px] text-center text-slate-400">
                  {lang === 'pt'
                    ? '🔒 Pagamento seguro via Interac / Stripe · Acesso instantâneo'
                    : '🔒 Paiement sécurisé · Accès instantané par courriel'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. TABS NAVIGATION */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 overflow-x-auto pb-px">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'overview'
              ? 'border-blue-600 text-blue-700 bg-blue-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          {lang === 'pt' ? 'Visão Geral & Bônus Inclusos' : 'Aperçu & Bonus'}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('chapters')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'chapters'
              ? 'border-blue-600 text-blue-700 bg-blue-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-blue-600" />
          <span>{lang === 'pt' ? 'Sumário dos 6 Capítulos' : 'Sommaire des 6 chapitres'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('catalog')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'catalog'
              ? 'border-blue-600 text-blue-700 bg-blue-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-emerald-600" />
          <span>{lang === 'pt' ? 'Outros Materiais do Acervo' : 'Autres ressources du catalogue'}</span>
        </button>
      </div>

      {/* 5. TAB 1: OVERVIEW & CHECKOUT */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <span>
                  {lang === 'pt'
                    ? 'O que você vai dominar com este manual prático'
                    : 'Ce que vous allez maîtriser avec ce manuel pratique'}
                </span>
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {lang === 'pt'
                  ? 'A maioria dos trabalhadores no Québec perde centenas de dólares por ano simplesmente por desconhecer como as deduções fiscais e normas da CNESST funcionam. Este guia foi escrito em linguagem clara e direta, baseado na legislação real de 2026.'
                  : 'La majorité des salariés au Québec perdent de l’argent faute de comprendre les subtilités fiscales et les normes du travail. Ce guide officiel 2026 décortique chaque ligne.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-xs font-bold text-slate-900 block">
                    🔍 Auditoria da Folha de Pagamento
                  </span>
                  <span className="text-[11px] text-slate-500 leading-tight block">
                    Aprenda a conferir cada desconto e identificar cobranças indevidas de seguro ou impostos.
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-xs font-bold text-slate-900 block">
                    ⚖️ Proteção Legal contra Abusos
                  </span>
                  <span className="text-[11px] text-slate-500 leading-tight block">
                    Saiba exatamente quais regras da CNESST seu empregador jamais pode desrespeitar.
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-xs font-bold text-slate-900 block">
                    📈 Negociação Salarial Estratégica
                  </span>
                  <span className="text-[11px] text-slate-500 leading-tight block">
                    Scripts prontos em francês para pedir aumento e renegociar pacotes de benefícios.
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-xs font-bold text-slate-900 block">
                    💰 Restituição Máxima no Imposto
                  </span>
                  <span className="text-[11px] text-slate-500 leading-tight block">
                    Como utilizar o REER e CELIAPP para recuperar até milhares de dólares na declaração.
                  </span>
                </div>
              </div>
            </div>

            {/* BÔNUS INCLUSOS */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-50 via-white to-blue-50 border border-amber-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-amber-600" />
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    {lang === 'pt' ? '3 Bônus Exclusivos Inclusos Gratuitamente' : '3 Bonus Exclusifs Inclus'}
                  </h3>
                </div>
                <span className="text-[10px] font-extrabold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                  Valor Real: $49 CAD
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-amber-200/60 shadow-xs">
                  <FileText className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Bônus #1: Modelo Oficial de Currículo Canadense ATS (.docx)
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      Gabarito editável no Word formatado segundo as leis de privacidade do Québec, sem foto e aprovado em robôs de RH.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-amber-200/60 shadow-xs">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Bônus #2: Planilha Automatizada de Custo de Vida no Canadá (.xlsx)
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      Simulador completo de despesas de aluguel, supermercado, Hydro-Québec e transporte para Montreal e Québec City.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-amber-200/60 shadow-xs">
                  <CheckSquare className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Bônus #3: Checklist de Direitos CNESST & Contratação (.pdf)
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      Aide-mémoire com as 10 regras essenciais de admissão, período de experiência e rescisão legal de contrato.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Checkout Panel */}
          <div id="checkout-section" className="lg:col-span-5 space-y-5">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-md space-y-5 sticky top-20">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Checkout Seguro PaieNet
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  {purchased ? '🎉 Pedido Concluído com Sucesso!' : isFree ? 'Download Imediato' : 'Finalizar Pedido com Acesso Imediato'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {purchased
                    ? 'Seu material foi liberado e o download iniciado.'
                    : 'Receba o e-book em PDF + EPUB e todos os bônus diretamente no seu e-mail.'}
                </p>
              </div>

              {purchased ? (
                <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-emerald-950 text-sm">Download Concluído!</h4>
                    <p className="text-xs text-emerald-800">
                      Enviamos também uma cópia com os links de acesso permanente para <strong>{email}</strong>.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => triggerFileDownload(currentAsset)}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>Baixar Novamente o Arquivo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectTool('net-calc')}
                    className="w-full py-2 px-3 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    Voltar ao Calculador de Salário
                  </button>
                </div>
              ) : (
                <form onSubmit={isFree ? (e) => { e.preventDefault(); handleFreeDownloadClick(); } : handleSimulatePurchase} className="space-y-4">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <CatIcon className="w-4 h-4 text-blue-600" />
                      <div className="min-w-0">
                        <span className="font-bold text-slate-900 block truncate max-w-[190px]">
                          {currentAsset.title}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {currentAsset.pageOrItemCount || '140p'} · PDF + Bônus
                        </span>
                      </div>
                    </div>
                    <span className="font-extrabold text-slate-900">
                      {isFree ? 'GRÁTIS' : `$${basePrice.toFixed(2)}`}
                    </span>
                  </div>

                  {!isFree && (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="Cupom (ex: QUEBEC2026)"
                          className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono uppercase"
                        />
                        <button
                          type="button"
                          onClick={handleApplyCoupon}
                          className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold cursor-pointer transition-colors"
                        >
                          Aplicar
                        </button>
                      </div>

                      {couponSuccess && (
                        <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>{couponSuccess}</span>
                        </p>
                      )}

                      {couponError && (
                        <p className="text-[11px] text-rose-600 font-semibold">{couponError}</p>
                      )}
                    </div>
                  )}

                  <div className="space-y-2.5">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Seu E-mail para Envio do Material *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seu.email@exemplo.com"
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Seu Nome Completo (Opcional)
                      </label>
                      <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Nome completo"
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  {!isFree && (
                    <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
                      <span className="text-xs font-bold text-slate-600">Total a Pagar (CAD):</span>
                      <div className="text-right">
                        <span className="text-xl font-black text-slate-900">
                          ${finalPrice.toFixed(2)} CAD
                        </span>
                        {couponDiscount > 0 && (
                          <span className="text-[10px] text-emerald-600 block">
                            (Desconto de ${couponDiscount.toFixed(2)})
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-extrabold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Processando Acesso Seguro...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>
                          {isFree
                            ? 'Baixar Gratuitamente Agora'
                            : `Concluir Pagamento ($${finalPrice.toFixed(2)} CAD)`}
                        </span>
                      </>
                    )}
                  </button>

                  <div className="pt-2 flex items-center justify-center gap-3 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Conexão SSL 256-bit</span>
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Interac / Visa / MC</span>
                    </span>
                  </div>

                  <div className="mt-3 p-3 rounded-xl bg-amber-50/60 border border-amber-200/80 text-slate-700 flex items-start gap-2.5">
                    <Award className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="space-y-0.5 text-left">
                      <span className="text-[11px] font-black text-amber-900 block uppercase tracking-wider">
                        {lang === 'pt' ? 'Garantia de Satisfação de 30 Dias' : 'Garantie de Satisfaction de 30 Jours'}
                      </span>
                      <p className="text-[10px] text-slate-600 leading-normal">
                        {lang === 'pt'
                          ? 'Garantia de reembolso de 30 dias se o material não otimizar suas negociações salariais ou esclarecer sua folha.'
                          : 'Garantie de remboursement de 30 jours si le matériel n’optimise pas vos négociations salariales ou ne clarifie pas vos retenues.'}
                      </p>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 6. TAB 2: CHAPTERS EXPLORER */}
      {activeTab === 'chapters' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
          <div className="max-w-2xl space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Índice Oficial & Amostra de Leitura
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Conheça os 6 Capítulos Detalhados
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Clique nos capítulos abaixo para expandir e ler trechos práticos do manual oficial de 140 páginas.
            </p>
          </div>

          <div className="space-y-3">
            {CHAPTERS_DATA.map((ch, idx) => {
              const isOpen = openChapter === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all ${
                    isOpen ? 'border-blue-300 bg-blue-50/20 shadow-xs' : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenChapter(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left cursor-pointer"
                  >
                    <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                      <span className="text-sm sm:text-base font-black text-blue-600 bg-blue-100/70 w-8 h-8 rounded-xl flex items-center justify-center shrink-0">
                        {ch.num}
                      </span>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                          {ch.title[lang] || ch.title.pt}
                        </h4>
                        <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 line-clamp-1">
                          {ch.desc[lang] || ch.desc.pt}
                        </p>
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ${
                        isOpen ? 'rotate-180 text-blue-600' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 border-t border-blue-100/60 text-xs sm:text-sm text-slate-700 space-y-3">
                      <p className="text-slate-600 leading-relaxed">
                        {ch.desc[lang] || ch.desc.pt}
                      </p>
                      <div className="p-3.5 rounded-xl bg-slate-900 text-slate-200 text-xs font-mono leading-relaxed space-y-1">
                        <span className="text-[10px] uppercase font-bold text-blue-400 block font-sans">
                          Extrato do Livro (Capítulo {ch.num}):
                        </span>
                        <pre className="whitespace-pre-wrap font-sans text-xs text-slate-300">
                          {ch.excerpt}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 7. TAB 3: COMPLETE CATALOG OF DIGITAL ASSETS */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Acervo Completo de Recursos para Carreira & Finanças
              </h3>
              <p className="text-xs text-slate-500">
                Planilhas, checklists e modelos auditados para trabalhadores e imigrantes no Québec.
              </p>
            </div>

            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200">
              <button
                type="button"
                onClick={() => setCatalogFilter('all')}
                className={`px-3 py-1 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
                  catalogFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Todos ({digitalAssets.length})
              </button>
              <button
                type="button"
                onClick={() => setCatalogFilter('free')}
                className={`px-3 py-1 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
                  catalogFilter === 'free' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Gratuitos
              </button>
              <button
                type="button"
                onClick={() => setCatalogFilter('paid')}
                className={`px-3 py-1 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
                  catalogFilter === 'paid' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                E-books & Guias
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCatalog.map((asset) => {
              const Icon = CATEGORY_ICONS[asset.category] || BookOpen;
              const isItemFree = asset.accessType === 'free';
              const isSelected = asset.id === selectedAssetId;

              return (
                <div
                  key={asset.id}
                  onClick={() => {
                    setSelectedAssetId(asset.id);
                    setActiveTab('overview');
                  }}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/20 shadow-md ring-2 ring-blue-600/20'
                      : 'border-slate-200 bg-white hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-blue-600" />
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          isItemFree
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {isItemFree ? 'GRÁTIS' : `$${(asset.promotionalPriceCad || 9.99).toFixed(2)} CAD`}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{asset.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">{asset.subtitle}</p>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400 font-medium">{asset.fileFormat || 'PDF'}</span>
                    <span className="font-bold text-blue-600">Ver Detalhes →</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 8. REUSABLE AD BANNER & NEWSLETTER */}
      <AdBanner slotId="banner-horizontal" lang={lang} />
      <NewsletterBox lang={lang} />
    </div>
  );
};
