'use client';

import { ArrowRight, BookOpen, BriefcaseBusiness, CheckCircle2, ExternalLink, GraduationCap, Sparkles } from 'lucide-react';
import type { Language } from '@/lib/i18n';
import type { ToolId } from '@/components/ToolboxGrid';

interface MonetizationHubPageProps {
  lang: Language;
  onSelectTool: (tool: ToolId) => void;
}

const offers = [
  { icon: GraduationCap, eyebrow: 'Produto PaieNet', title: 'Carrière Pro', text: 'Currículo ATS, simulador STAR e testes técnicos em uma experiência única.', cta: 'Conhecer o Pass Pro', tool: 'pro-plans' as ToolId },
  { icon: BookOpen, eyebrow: 'Recurso premium', title: 'Guia definitivo do salário', text: 'Um guia prático para entender impostos, benefícios e normas no Québec.', cta: 'Ver o e-book', tool: 'ebook-store' as ToolId },
  { icon: Sparkles, eyebrow: 'Recomendações', title: 'Ferramentas para sua carreira', text: 'Seleção editorial de serviços úteis para negociar, buscar vagas e organizar sua vida profissional.', cta: 'Explorar recomendações', tool: 'blog' as ToolId },
];

export function MonetizationHubPage({ lang, onSelectTool }: MonetizationHubPageProps) {
  const isPt = lang === 'pt';
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="bg-slate-950 px-6 py-10 text-white sm:px-10">
        <div className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-bold text-slate-200">
            <BriefcaseBusiness className="size-3.5" />
            {isPt ? 'Centro de soluções PaieNet' : 'Centre de solutions PaieNet'}
          </div>
          <h1 className="text-3xl font-black tracking-tight sm:text-5xl">{isPt ? 'Mais valor para sua carreira, sem anúncios duplicados.' : 'Plus de valeur pour votre carrière, sans publicités répétées.'}</h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">{isPt ? 'Escolha uma solução relevante para o seu momento. A calculadora continua no centro da experiência; aqui ficam nossas ofertas, recomendações e parceiros.' : 'Choisissez une solution pertinente. La calculatrice reste au centre de l’expérience; nos offres, recommandations et partenaires sont réunis ici.'}</p>
        </div>
      </div>
      <div className="grid gap-4 p-5 sm:grid-cols-3 sm:p-8">
        {offers.map(({ icon: Icon, eyebrow, title, text, cta, tool }) => (
          <article key={title} className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
            <Icon className="size-6 text-blue-700" aria-hidden="true" />
            <p className="mt-5 text-[11px] font-black uppercase tracking-[0.16em] text-blue-700">{eyebrow}</p>
            <h2 className="mt-2 text-xl font-black text-slate-950">{title}</h2>
            <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{text}</p>
            <button type="button" onClick={() => onSelectTool(tool)} className="mt-5 inline-flex items-center gap-2 text-left text-sm font-black text-slate-950 hover:text-blue-700">
              {cta}<ArrowRight className="size-4" aria-hidden="true" />
            </button>
          </article>
        ))}
      </div>
      <div className="mx-5 mb-5 grid gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 sm:mx-8 sm:mb-8 sm:grid-cols-[1fr_auto] sm:items-center sm:p-6">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-700">{isPt ? 'Transparência editorial' : 'Transparence éditoriale'}</p>
          <p className="mt-2 text-sm leading-6 text-emerald-950">{isPt ? 'Alguns links podem gerar comissão, sem custo adicional para você. Priorizamos utilidade, clareza e relevância.' : 'Certains liens peuvent générer une commission, sans coût supplémentaire. Nous privilégions l’utilité et la pertinence.'}</p>
        </div>
        <button type="button" onClick={() => onSelectTool('partners')} className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-black text-white hover:bg-emerald-800">
          {isPt ? 'Ver parceiros B2B' : 'Voir les partenaires B2B'} <ExternalLink className="size-4" aria-hidden="true" />
        </button>
      </div>
      <div className="flex items-center gap-2 border-t border-slate-200 px-5 py-4 text-xs text-slate-500 sm:px-8"><CheckCircle2 className="size-4 text-emerald-600" /> {isPt ? 'Uma área dedicada para monetização, sem interromper seus cálculos.' : 'Un espace dédié à la monétisation, sans interrompre vos calculs.'}</div>
    </section>
  );
}

export default MonetizationHubPage;
