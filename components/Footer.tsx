import React, { useSyncExternalStore } from 'react';
import { Language, translations } from '@/lib/i18n';
import { ToolId } from '@/components/ToolboxGrid';
import { AdBanner } from '@/components/AdBanner';
import { adminStore, AffiliatePartner } from '@/lib/admin-store';
import {
  ShieldCheck,
  ExternalLink,
  BookOpen,
  Calculator,
  FileText,
  Sparkles,
  Award,
  Lock,
  Megaphone,
  Crown,
  Building2,
} from 'lucide-react';

interface FooterProps {
  lang: Language;
  onSelectTool?: (tool: ToolId) => void;
  onOpenEbookModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  lang,
  onSelectTool,
  onOpenEbookModal,
}) => {
  const t = translations[lang];
  const affiliates = useSyncExternalStore(
    (cb) => adminStore.subscribe(cb),
    () => adminStore.getAffiliates(),
    () => adminStore.getInitialAffiliates()
  );

  const activeAffiliates = affiliates.filter((a) => a.active);

  return (
    <footer className="mt-12 border-t border-slate-200/90 bg-white pt-6 pb-12 text-slate-500 text-xs">
      {/* Footer Ad Banner Placement */}
      <AdBanner section="footer-wide" format="bottom-wide" label={t.adBannerLabel} />

      <div className="max-w-5xl mx-auto px-3.5 sm:px-6 lg:px-8 space-y-6">
        {/* Navigation Quick Links Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-4 pb-2 text-xs border-b border-slate-100">
          <div>
            <span className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] block mb-2.5">
              💰 {lang === 'pt' ? 'Calculadoras' : 'Calculateurs'}
            </span>
            <ul className="space-y-1.5 text-slate-600">
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTool && onSelectTool('net-calc')}
                  className="hover:text-blue-600 transition-colors cursor-pointer text-left"
                >
                  {lang === 'pt' ? 'Salário Líquido Québec' : 'Calculateur Net QC'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTool && onSelectTool('converter')}
                  className="hover:text-blue-600 transition-colors cursor-pointer text-left"
                >
                  {lang === 'pt' ? 'Conversor de Salário' : 'Convertisseur de Salaire'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTool && onSelectTool('overtime')}
                  className="hover:text-blue-600 transition-colors cursor-pointer text-left"
                >
                  {lang === 'pt' ? 'Horas Extras (1.5× / 2.0×)' : 'Heures Supplémentaires'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTool && onSelectTool('compare-jobs')}
                  className="hover:text-blue-600 transition-colors cursor-pointer text-left"
                >
                  {lang === 'pt' ? 'Comparador de Empregos' : 'Comparateur d’Emplois'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTool && onSelectTool('scenarios')}
                  className="hover:text-blue-600 font-medium transition-colors cursor-pointer text-left"
                >
                  {lang === 'pt' ? 'Cenários & Estudo de Caso' : 'Scénarios & Étude Leclerc'}
                </button>
              </li>
            </ul>
          </div>

          <div>
            <span className="font-extrabold text-indigo-700 uppercase tracking-wider text-[11px] block mb-2.5">
              🚀 {lang === 'pt' ? 'Carreira & RH' : 'Carrière & Embauche'}
            </span>
            <ul className="space-y-1.5 text-slate-600">
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTool && onSelectTool('pro-plans')}
                  className="hover:text-indigo-600 font-bold transition-colors cursor-pointer text-left flex items-center gap-1.5 text-indigo-700"
                >
                  <Crown className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{lang === 'pt' ? 'Carrière Pro & Planos' : 'Carrière Pro & Forfaits'}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTool && onSelectTool('resume-builder')}
                  className="hover:text-indigo-600 transition-colors cursor-pointer text-left"
                >
                  {lang === 'pt' ? 'Construtor de CV Québec' : 'Générateur de CV Format QC'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTool && onSelectTool('interview-simulator')}
                  className="hover:text-indigo-600 transition-colors cursor-pointer text-left"
                >
                  {lang === 'pt' ? 'Simulador de Entrevistas' : 'Simulateur d’Entrevues'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTool && onSelectTool('tech-tests')}
                  className="hover:text-indigo-600 transition-colors cursor-pointer text-left"
                >
                  {lang === 'pt' ? 'Testes Técnicos & CNESST' : 'Tests Techniques Recrutement'}
                </button>
              </li>
            </ul>
          </div>

          <div>
            <span className="font-extrabold text-amber-700 uppercase tracking-wider text-[11px] block mb-2.5">
              📚 {lang === 'pt' ? 'Conteúdo & Guias' : 'Guides & Livres'}
            </span>
            <ul className="space-y-1.5 text-slate-600">
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTool && onSelectTool('ebook-store')}
                  className="hover:text-amber-700 font-bold transition-colors cursor-pointer text-left flex items-center gap-1 text-amber-900"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>{lang === 'pt' ? 'Guia Definitivo & E-books' : 'Guide Ultime & E-books'}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTool && onSelectTool('blog')}
                  className="hover:text-amber-700 font-bold transition-colors cursor-pointer text-left flex items-center gap-1"
                >
                  <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                  <span>{lang === 'pt' ? 'Blog & Artigos' : 'Blog & Articles'}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTool && onSelectTool('vacation-holidays')}
                  className="hover:text-amber-700 transition-colors cursor-pointer text-left"
                >
                  {lang === 'pt' ? 'Direitos CNESST & Férias' : 'Normes CNESST & Fériés'}
                </button>
              </li>
            </ul>
          </div>

          <div>
            <span className="font-extrabold text-emerald-800 uppercase tracking-wider text-[11px] block mb-2.5">
              🤝 {lang === 'pt' ? 'Parceiros & Afiliados Oficiais' : 'Partenaires Officiels'}
            </span>
            <ul className="space-y-1.5 text-slate-600 mb-2">
              {activeAffiliates.slice(0, 4).map((aff) => (
                <li key={aff.id}>
                  <a
                    href={`${aff.targetUrl}?utm_source=${aff.utmSource}&utm_medium=${aff.utmMedium}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => adminStore.trackAffiliateClick(aff.id)}
                    className="hover:text-emerald-700 transition-colors inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 hover:underline"
                  >
                    <span>{aff.name}</span>
                    <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
                  </a>
                </li>
              ))}
            </ul>
            <div className="pt-2 border-t border-slate-100 space-y-1.5">
              {onSelectTool && (
                <button
                  type="button"
                  onClick={() => onSelectTool('partners')}
                  className="hover:text-emerald-700 font-bold transition-colors cursor-pointer text-left flex items-center gap-1.5 text-emerald-900 text-[11px]"
                >
                  <Building2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{lang === 'pt' ? 'Programa de Patrocinadores' : 'Programme Commanditaires'}</span>
                </button>
              )}
              {onSelectTool && (
                <button
                  type="button"
                  onClick={() => onSelectTool('media-kit')}
                  className="hover:text-blue-700 font-extrabold transition-colors cursor-pointer text-left flex items-center gap-1.5 text-blue-900 text-[11px]"
                >
                  <Megaphone className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>{lang === 'pt' ? 'Mídia Kit & Anuncie Aqui' : 'Kit Média & Partenariats'}</span>
                </button>
              )}
              <span className="inline-flex items-center gap-1 text-[10px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Transparência editorial 100%</span>
              </span>
            </div>
          </div>
        </div>

        {/* Official Sources & Disclaimers */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-slate-600">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 block mb-1">
                Avertissement légal & Conformité aux barèmes officiels
              </span>
              <p className="leading-relaxed text-[11px] sm:text-xs text-slate-600">
                {t.disclaimer}
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-2.5 text-[11px] font-semibold text-slate-700">
                <a
                  href="https://www.revenuquebec.ca/fr/entreprises/retenues-et-cotisations/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-slate-950 inline-flex items-center gap-1 transition-colors"
                >
                  <span>Revenu Québec (Tables TP-1015.3)</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
                <span className="text-slate-300">·</span>
                <a
                  href="https://www.canada.ca/fr/agence-revenu/services/impot/entreprises/sujets/retenues-paie.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-slate-950 inline-flex items-center gap-1 transition-colors"
                >
                  <span>Agence du revenu du Canada (Guide T4127)</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
                <span className="text-slate-300">·</span>
                <a
                  href="https://www.cnesst.gouv.qc.ca/fr/normes-travail"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-slate-950 inline-flex items-center gap-1 transition-colors"
                >
                  <span>CNESST (Normes du travail)</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Compliance & Institutional Google Links */}
        <div className="pt-3 pb-2 border-t border-slate-100 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] font-bold text-slate-600">
          {onSelectTool && (
            <>
              <button
                type="button"
                onClick={() => onSelectTool('sitemap')}
                className="hover:text-blue-600 transition-colors cursor-pointer"
              >
                {lang === 'pt' ? '🗺️ Mapa do Site' : '🗺️ Plan du Site'}
              </button>
              <span className="text-slate-300">·</span>
              <button
                type="button"
                onClick={() => onSelectTool('sitemap')}
                className="hover:text-blue-600 transition-colors cursor-pointer"
              >
                {lang === 'pt' ? '🏢 Sobre Nós (E-E-A-T)' : '🏢 À Propos'}
              </button>
              <span className="text-slate-300">·</span>
              <button
                type="button"
                onClick={() => onSelectTool('sitemap')}
                className="hover:text-blue-600 transition-colors cursor-pointer"
              >
                {lang === 'pt' ? '📜 Termos de Uso' : '📜 Conditions d’Utilisation'}
              </button>
              <span className="text-slate-300">·</span>
              <button
                type="button"
                onClick={() => onSelectTool('sitemap')}
                className="hover:text-blue-600 transition-colors cursor-pointer"
              >
                {lang === 'pt' ? '🔒 Política de Privacidade (Lei 25)' : '🔒 Politique de Confidentialité'}
              </button>
              <span className="text-slate-300">·</span>
              <button
                type="button"
                onClick={() => onSelectTool('sitemap')}
                className="hover:text-blue-600 transition-colors cursor-pointer"
              >
                {lang === 'pt' ? '🍪 Cookies' : '🍪 Témoins'}
              </button>
              <span className="text-slate-300">·</span>
              <button
                type="button"
                onClick={() => onSelectTool('sitemap')}
                className="hover:text-blue-600 transition-colors cursor-pointer"
              >
                {lang === 'pt' ? '⚖️ Divulgação de Afiliados (FTC)' : '⚖️ Transparence Affiliés'}
              </button>
              <span className="text-slate-300">·</span>
              <button
                type="button"
                onClick={() => onSelectTool('sitemap')}
                className="hover:text-blue-600 transition-colors cursor-pointer"
              >
                {lang === 'pt' ? '📬 Fale Conosco & Suporte' : '📬 Nous Joindre'}
              </button>
            </>
          )}
        </div>

        {/* Bottom meta row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 text-[11px] pt-2 border-t border-slate-100">
          <div>
            © {new Date().getFullYear()} PaieNet Québec · Calculateur Fiscal & Salarial Indépendant
          </div>
          <div className="flex items-center gap-3">
            <span>Conforme aux taux 2026</span>
            <span className="text-slate-300">·</span>
            <span>Sécurisé & Confidentiel</span>
            <span className="text-slate-300">·</span>
            <button
              type="button"
              onClick={() => onSelectTool && onSelectTool('admin')}
              className="hover:text-blue-600 transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <Lock className="w-3 h-3 text-slate-400" />
              <span>{lang === 'pt' ? 'Área Restrita' : 'Espace Restreint'}</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
