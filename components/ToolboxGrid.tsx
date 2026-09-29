'use client';

import React from 'react';
import { Language } from '@/lib/i18n';
import {
  Calculator,
  Repeat,
  TrendingUp,
  Timer,
  Scale,
  Palmtree,
  PiggyBank,
  Factory,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileText,
  Mic,
  FileCheck2,
  Crown,
  BookOpen,
  Megaphone,
  Building2,
  MapPin,
  FolderOpen,
} from 'lucide-react';

export type ToolId =
  | 'net-calc'
  | 'converter'
  | 'raise'
  | 'overtime'
  | 'compare-jobs'
  | 'canada-provinces'
  | 'resources'
  | 'vacation-holidays'
  | 'rrsp-savings'
  | 'factory-stub'
  | 'resume-builder'
  | 'interview-simulator'
  | 'tech-tests'
  | 'blog'
  | 'media-kit'
  | 'sitemap'
  | 'admin'
  | 'ebook-store'
  | 'pro-plans'
  | 'scenarios'
  | 'partners';

interface ToolboxGridProps {
  lang: Language;
  activeTool: ToolId;
  onSelectTool: (tool: ToolId) => void;
}

export const ToolboxGrid: React.FC<ToolboxGridProps> = ({
  lang,
  activeTool,
  onSelectTool,
}) => {
  const financeTools = [
    {
      id: 'net-calc' as ToolId,
      name: lang === 'pt' ? 'Calculadora de Salário Líquido' : lang === 'en' ? 'Net Salary Calculator' : 'Calculateur de Salaire Net',
      desc: lang === 'pt' ? 'Cálculo completo com impostos QC/Fédéral, RRQ, RQAP e AE até o centavo' : lang === 'en' ? 'Full Quebec net take-home pay with CRA, Revenu QC, QPIP, QPP & EI' : 'Calcul officiel complet brut en net avec RRQ, RQAP, AE et impôts QC/Fédéral',
      icon: Calculator,
      color: 'blue',
      badge: lang === 'pt' ? 'Principal' : lang === 'en' ? 'Popular' : 'Populaire',
    },
    {
      id: 'converter' as ToolId,
      name: lang === 'pt' ? 'Conversor de Salário' : lang === 'en' ? 'Salary Converter' : 'Convertisseur de Salaire',
      desc: lang === 'pt' ? 'Converta hora ⇄ dia ⇄ semana ⇄ quinzena ⇄ mês ⇄ ano em 1 clique' : lang === 'en' ? 'Convert hourly ⇄ daily ⇄ weekly ⇄ bi-weekly ⇄ annual' : 'Convertissez instantanément : horaire, 2 semaines, mensuel et annuel',
      icon: Repeat,
      color: 'emerald',
      badge: lang === 'pt' ? 'Instantâneo' : lang === 'en' ? 'Instant' : 'Instantané',
    },
    {
      id: 'raise' as ToolId,
      name: lang === 'pt' ? 'Simulador de Aumento' : lang === 'en' ? 'Wage Raise Simulator' : 'Simulateur d’Augmentation',
      desc: lang === 'pt' ? 'Veja quanto realmente sobra no bolso após +$1/h, +$2/h ou % após imposto marginal' : lang === 'en' ? 'See actual pocket cash after a pay raise taking marginal tax into account' : 'Voyez concrètement combien il reste dans vos poches après impôt marginal',
      icon: TrendingUp,
      color: 'indigo',
      badge: lang === 'pt' ? 'Estratégico' : lang === 'en' ? 'Smart' : 'Essentiel',
    },
    {
      id: 'overtime' as ToolId,
      name: lang === 'pt' ? 'Horas Extras (Overtime)' : lang === 'en' ? 'Overtime Pay (1.5× / 2.0×)' : 'Heures Supplémentaires',
      desc: lang === 'pt' ? 'Cálculo a tempo e meio (1.5×) e dobro (2.0×) conforme normas CNESST' : lang === 'en' ? 'Time-and-a-half and double-time take home pay after taxes' : 'Temps et demi 1,5× et double 2,0× selon les normes du travail du Québec',
      icon: Timer,
      color: 'amber',
      badge: 'CNESST',
    },
    {
      id: 'compare-jobs' as ToolId,
      name: lang === 'pt' ? 'Comparador de 2 Empregos' : lang === 'en' ? 'Job Offer Comparator' : 'Comparateur d’Offres d’Emploi',
      desc: lang === 'pt' ? 'Compare 2 propostas de emprego (salário, horas, primes e benefícios) e veja quem ganha' : lang === 'en' ? 'Compare Job A vs Job B to see who pays more in true net pocket money' : 'Comparez deux propositions d’embauche et trouvez la gagnante réelle',
      icon: Scale,
      color: 'violet',
      badge: lang === 'pt' ? 'Decisivo' : lang === 'en' ? 'Match' : 'Nouveau',
    },
    {
      id: 'canada-provinces' as ToolId,
      name: lang === 'pt' ? 'Salário em Outras Províncias' : lang === 'en' ? 'Canada Provinces Salary' : 'Salaires dans les autres provinces',
      desc: lang === 'pt' ? 'Compare seu salário líquido no Québec com Ontário, Alberta, BC e todas as 13 províncias' : lang === 'en' ? 'Compare net salary and purchasing power across all 10 provinces & 3 territories' : 'Comparez votre salaire net et coût de la vie dans les 13 provinces et territoires',
      icon: MapPin,
      color: 'blue',
      badge: lang === 'pt' ? 'Todas Províncias' : lang === 'en' ? 'All Canada' : 'Tout le Canada',
    },
    {
      id: 'resources' as ToolId,
      name: lang === 'pt' ? 'Guias & Recursos (Acervo)' : lang === 'en' ? 'Guides & Resources' : 'Guides & Ressources',
      desc: lang === 'pt' ? 'Área dedicada a e-books, modelos de currículo ATS, planilhas orçamentárias e checklists' : lang === 'en' ? 'Dedicated library of handbooks, ATS resume templates, and financial guides' : 'Centre dédié de manuels officiels, modèles de CV ATS et outils à télécharger',
      icon: FolderOpen,
      color: 'emerald',
      badge: lang === 'pt' ? 'Acervo Oficial' : lang === 'en' ? 'Hub' : 'Nouveau Centre',
    },
    {
      id: 'vacation-holidays' as ToolId,
      name: lang === 'pt' ? 'Férias (4%/6%) & 8 Feriados' : lang === 'en' ? 'Vacation (4%/6%) & Holidays' : 'Vacances (4%/6%) & 8 Fériés',
      desc: lang === 'pt' ? 'Indenização de férias e cálculo dos feriados pagos pela regra de 1/20' : lang === 'en' ? 'Quebec statutory vacation pay and 1/20 holiday pay calculations' : 'Indemnité de congés payés selon ancienneté et règle du 1/20 de la CNESST',
      icon: Palmtree,
      color: 'teal',
      badge: '4% / 6%',
    },
    {
      id: 'rrsp-savings' as ToolId,
      name: lang === 'pt' ? 'Match REER & Previdência' : lang === 'en' ? 'RRSP Match & Tax Savings' : 'Match REER & Économie d’Impôt',
      desc: lang === 'pt' ? 'Simule o dinheiro gratuito da empresa e o retorno de imposto na fonte' : lang === 'en' ? 'Simulate employer free match and tax deductions at source' : 'Simulez la contribution employeur et vos déductions fiscales immédiates',
      icon: PiggyBank,
      color: 'rose',
      badge: 'REER / RPDB',
    },
    {
      id: 'factory-stub' as ToolId,
      name: lang === 'pt' ? 'Holerite Real de Fábrica' : lang === 'en' ? 'Real Factory Paystub' : 'Talon Réel d’Usine (Leclerc)',
      desc: lang === 'pt' ? 'Exemplo real da fábrica Biscuits Leclerc (72h, adicional 36/40, cafeteria)' : lang === 'en' ? 'Real Biscuit Leclerc paystub (72h shift, premium 36/40, cafeteria)' : 'Cas concret d’usine Biscuits Leclerc avec primes de quart et assurances',
      icon: Factory,
      color: 'sky',
      badge: '100% Fidèle',
    },
    {
      id: 'scenarios' as ToolId,
      name: lang === 'pt' ? 'Cenários & Estudo de Caso' : lang === 'en' ? 'Paycheck Scenarios' : 'Scénarios & Études de Cas',
      desc: lang === 'pt' ? 'Comparativo entre cálculo governamental e contracheque industrial com adicionais reais' : lang === 'en' ? 'Comparison between basic government pay calculation and audited industrial paystubs' : 'Comparatif entre calcul gouvernemental de base et fiches de paie réelles',
      icon: Scale,
      color: 'blue',
      badge: lang === 'pt' ? 'Caso Real' : 'Case Study',
    },
  ];

  const careerTools = [
    {
      id: 'ebook-store' as ToolId,
      name: lang === 'pt' ? 'Guia Definitivo & E-books' : lang === 'en' ? 'Ultimate Quebec Guides & E-books' : 'Guide Ultime & Livres Numériques',
      desc: lang === 'pt' ? 'Manual completo de 140 páginas sobre impostos, deduções e direitos CNESST + bônus de CV e planilhas' : lang === 'en' ? '140-page official handbook on tax brackets, CNESST laws, ATS templates and living costs' : 'Manuel officiel de 140 pages sur les impôts, normes du travail CNESST et bonus',
      icon: BookOpen,
      color: 'amber',
      badge: '140p Bestseller',
    },
    {
      id: 'pro-plans' as ToolId,
      name: lang === 'pt' ? 'Carrière Pro & Planos' : lang === 'en' ? 'Carrière Pro Membership' : 'Carrière Pro & Forfaits',
      desc: lang === 'pt' ? 'Acesso ilimitado ao gerador de CV ATS, simulador comportamental STAR e testes técnicos comentados' : lang === 'en' ? 'Unlimited access to Canadian ATS resume exports, STAR interview simulator and tests' : 'Accès illimité aux CVs conformes ATS, simulateur d’entrevue STAR et tests corrigés',
      icon: Crown,
      color: 'indigo',
      badge: 'Pro Vitalício',
    },
    {
      id: 'partners' as ToolId,
      name: lang === 'pt' ? 'Parceiros & Patrocinadores' : lang === 'en' ? 'Partners & Sponsors' : 'Partenaires & Commanditaires',
      desc: lang === 'pt' ? 'Associe sua instituição financeira, assessoria de RH ou empresa ao calculador oficial do Québec' : lang === 'en' ? 'Partner with Quebec leading payroll platform for B2B brand exposure and sponsorship' : 'Associez votre entreprise au portail de paie de référence au Québec',
      icon: Building2,
      color: 'emerald',
      badge: 'B2B 2026',
    },
    {
      id: 'resume-builder' as ToolId,
      name: lang === 'pt' ? 'Construtor de Currículo Québec' : lang === 'en' ? 'Quebec ATS Resume Builder' : 'Générateur de CV Format Canadien',
      desc: lang === 'pt' ? 'Format Canadien oficial sem foto e otimizado para passar nos filtros ATS dos RHs de Montreal e Québec' : lang === 'en' ? 'Canadian format ATS-compliant resume without photo, age, or marital status' : 'Format canadien 100% conforme ATS, sans photo ni mentions discriminatoires',
      icon: FileText,
      color: 'indigo',
      badge: 'Format QC',
    },
    {
      id: 'interview-simulator' as ToolId,
      name: lang === 'pt' ? 'Simulador de Entrevistas' : lang === 'en' ? 'Quebec Interview Simulator' : 'Simulateur d’Entrevue STAR',
      desc: lang === 'pt' ? 'Pratique as perguntas comportamentais com a fórmula STAR e entenda a cultura de trabalho québécoise' : lang === 'en' ? 'Practice behavioral interview questions using STAR method and Quebec work culture' : 'Préparez vos réponses avec la formule STAR et les codes culturels du Québec',
      icon: Mic,
      color: 'amber',
      badge: 'Método STAR',
    },
    {
      id: 'tech-tests' as ToolId,
      name: lang === 'pt' ? 'Simulador de Testes Técnicos' : lang === 'en' ? 'Technical Screening Tests' : 'Tests Techniques & CNESST',
      desc: lang === 'pt' ? 'Simulados de Saúde & Segurança (CNESST / SIMDUT), Excel prático e raciocínio lógico aplicados em contratações' : lang === 'en' ? 'Screening test practice for CNESST safety, practical Excel, and operational logic' : 'Tests d’embauche éliminatoires : Santé/Sécurité CNESST, Excel et logique',
      icon: FileCheck2,
      color: 'teal',
      badge: 'Recrutamento',
    },
    {
      id: 'blog' as ToolId,
      name: lang === 'pt' ? 'Blog & Guias Práticos' : lang === 'en' ? 'Blog & Practical Guides' : 'Blog & Guides du Travailleur',
      desc: lang === 'pt' ? 'Artigos completos explicando seu contracheque, regras CNESST, envio de remessas e dicas de contratação' : lang === 'en' ? 'In-depth articles explaining paystubs, CNESST labor laws, bank accounts, and hiring tips' : 'Guides approfondis sur la paie, les impôts, les droits CNESST et l’embauche',
      icon: BookOpen,
      color: 'blue',
      badge: 'Artigos & E-book',
    },
  ];

  return (
    <section className="space-y-8">
      {/* 1. Category 1: Remuneração & Salário */}
      <div className="space-y-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold mb-1 border border-blue-200">
            <Calculator className="w-3 h-3" />
            <span>
              {lang === 'pt' ? 'Finanças & Remuneração' : lang === 'en' ? 'Payroll & Financial Tools' : 'Finances & Rémunération'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {lang === 'pt'
              ? 'Calculadoras Salariais do Québec'
              : lang === 'en'
              ? 'Quebec Payroll & Salary Calculators'
              : 'Calculateurs de Paie & Salaire au Québec'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {lang === 'pt'
              ? 'Descubra seu valor líquido, impostos retidos, horas extras e equivalências em 1 clique.'
              : 'Découvrez votre salaire net, déductions fiscales, heures sup et équivalences en direct.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {financeTools.map((t) => {
            const Icon = t.icon;
            const isActive = activeTool === t.id;

            return (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  onSelectTool(t.id);
                  window.scrollTo({ top: 120, behavior: 'smooth' });
                }}
                className={`p-4 sm:p-5 rounded-2xl text-left transition-all cursor-pointer flex flex-col justify-between group border relative ${
                  isActive
                    ? 'bg-white border-blue-600 ring-2 ring-blue-500/20 shadow-md scale-[1.01]'
                    : 'bg-white hover:bg-slate-50 border-slate-200/90 hover:border-slate-300 shadow-2xs hover:shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-700 group-hover:bg-blue-50 group-hover:text-blue-700'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {t.badge}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-blue-600 transition-colors">
                    {t.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                    {t.desc}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:text-blue-700">
                  <span>{lang === 'pt' ? 'Abrir calculadora' : 'Ouvrir le calculateur'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Category 2: Carreira & Empregabilidade (Novas Ferramentas de Monetização) */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-bold mb-1 border border-indigo-200">
              <Sparkles className="w-3 h-3 text-indigo-600" />
              <span>
                {lang === 'pt' ? 'Carreira & Empregabilidade no Québec' : 'Carrière & Embauche au Québec'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {lang === 'pt'
                ? 'Conquiste seu Próximo Emprego no Québec'
                : 'Passez vos entrevues & Décrochez votre emploi au Québec'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {lang === 'pt'
                ? 'Currículo aprovado em sistemas ATS, treino de entrevistas comportamentais e testes técnicos recorrentes.'
                : 'CV conforme aux normes canadiennes, simulations d’entrevue STAR et tests techniques récurrents.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {careerTools.map((t) => {
            const Icon = t.icon;
            const isActive = activeTool === t.id;

            return (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  onSelectTool(t.id);
                  window.scrollTo({ top: 120, behavior: 'smooth' });
                }}
                className={`p-4 sm:p-5 rounded-2xl text-left transition-all cursor-pointer flex flex-col justify-between group border relative ${
                  isActive
                    ? 'bg-white border-indigo-600 ring-2 ring-indigo-500/20 shadow-md scale-[1.01]'
                    : 'bg-white hover:bg-slate-50 border-slate-200/90 hover:border-slate-300 shadow-2xs hover:shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                        isActive
                          ? 'bg-indigo-600 text-white'
                          : 'bg-indigo-50 text-indigo-700 group-hover:bg-indigo-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                        isActive
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {t.badge}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-indigo-600 transition-colors">
                    {t.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {t.desc}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600 group-hover:text-indigo-700">
                  <span>{lang === 'pt' ? 'Acessar ferramenta' : 'Accéder à l’outil'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>

        {/* 3. B2B & Commercial Advertising Lots Card */}
        <div className="mt-8 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-xl border border-indigo-900/40">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-extrabold border border-blue-500/30">
              <Megaphone className="w-3 h-3 text-blue-400" />
              <span>{lang === 'pt' ? 'Para Empresas, Recrutadores & Parceiros' : 'Pour Entreprises & Partenaires'}</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white">
              {lang === 'pt' ? 'Loteamento de Vitrines & Espaços Comerciais no Québec' : 'Vitrines Numériques & Partenariats d’Affaires au Québec'}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {lang === 'pt'
                ? 'Anuncie sua marca, alugue seções do site, encomende artigos de blog ou publique vagas com destaque para mais de 48.000 profissionais com alto poder aquisitivo.'
                : 'Mettez en avant vos services, réservez des emplacements publicitaires ou commanditez des articles spécialisés auprès de professionnels québécois qualifiés.'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              onSelectTool('media-kit');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="py-3 px-5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2 shrink-0 cursor-pointer active:scale-95"
          >
            <span>{lang === 'pt' ? 'Ver Mídia Kit & Reservar Lotes' : 'Consulter le Kit Média & Réserver'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
