'use client';

import React from 'react';
import { Language, translations } from '@/lib/i18n';
import { ToolId } from '@/components/ToolboxGrid';
import { TrustAuthorityBar } from '@/components/TrustAuthorityBar';
import { AdBanner } from '@/components/AdBanner';
import { NewsletterBox } from '@/components/NewsletterBox';
import {
  Factory,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Building2,
  Stethoscope,
  Calculator,
  Scale,
} from 'lucide-react';

interface ScenariosPageProps {
  lang: Language;
  onSelectTool: (tool: ToolId) => void;
  onLoadLeclercExample: () => void;
}

export const ScenariosPage: React.FC<ScenariosPageProps> = ({
  lang,
  onSelectTool,
  onLoadLeclercExample,
}) => {
  const t = translations[lang];

  return (
    <div className="space-y-8 animate-in fade-in duration-200 pb-16">
      {/* Top Breadcrumb */}
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
          <span className="text-xs font-semibold text-slate-900">
            {lang === 'pt' ? 'Cenários & Estudo de Caso Real' : 'Étude de Cas & Scénarios'}
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            onLoadLeclercExample();
            onSelectTool('net-calc');
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
        >
          <Factory className="w-3.5 h-3.5" />
          <span>{lang === 'pt' ? 'Carregar Exemplo Leclerc no Calculador' : 'Charger l’exemple Leclerc'}</span>
        </button>
      </div>

      <TrustAuthorityBar lang={lang} />

      {/* Hero Header */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white p-6 sm:p-10 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            <span>{t.scenariosDialogTitle}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            {lang === 'pt'
              ? 'Por que o Cálculo Governamental Básico Difere do Seu Holerite Real de Empresa?'
              : 'Pourquoi le calcul théorique diffère-t-il de votre véritable fiche de paie ?'}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {lang === 'pt'
              ? 'A maioria dos calculadores online simula apenas o imposto básico e omite convenções coletivas, adicionais de turno, seguro de saúde tributável (Case J da Relevé 1) e deduções sindicais. Veja abaixo a comparação real de um operário da Biscuits Leclerc no Québec.'
              : 'Les calculateurs théoriques ignorent souvent les primes d’équipe, les déductions syndicales et la portion imposable de l’assurance collective (Case J du Relevé 1). Voici l’anatomie d’un talon réel.'}
          </p>
        </div>
      </div>

      {/* Real Case Study Card: Biscuits Leclerc */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-50 via-indigo-50 to-emerald-50 border border-blue-200 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-blue-200/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black shadow-sm">
              <Factory className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-900 block">
                Estudo de Caso Auditado no Québec 2026
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Operário Industrial: Biscuits Leclerc ($31.51/h)
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              onLoadLeclercExample();
              onSelectTool('net-calc');
            }}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-extrabold shadow-sm transition-all cursor-pointer self-start sm:self-auto"
          >
            <span>Carregar no Calculador Interativo</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Numbers Comparison Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3.5 rounded-xl bg-white border border-blue-100 shadow-2xs">
            <span className="text-[11px] text-slate-500 block">Salário Base</span>
            <span className="text-base sm:text-lg font-black text-slate-900">$31.51 / h</span>
            <span className="text-[10px] text-slate-400 block">72h / quinzena</span>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-blue-100 shadow-2xs">
            <span className="text-[11px] text-slate-500 block">Prime Turno 36/40</span>
            <span className="text-base sm:text-lg font-black text-blue-700">+$252.08</span>
            <span className="text-[10px] text-slate-400 block">Bônus quinzenal</span>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-blue-100 shadow-2xs">
            <span className="text-[11px] text-slate-500 block">Assurance Médicale</span>
            <span className="text-base sm:text-lg font-black text-rose-600">-$74.28</span>
            <span className="text-[10px] text-slate-400 block">Plano de saúde</span>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-600 text-white shadow-sm">
            <span className="text-[11px] text-emerald-100 block">Líquido em Conta</span>
            <span className="text-base sm:text-lg font-black">$1,743.01</span>
            <span className="text-[10px] text-emerald-200 block">Exato no banco</span>
          </div>
        </div>
      </div>

      {/* Basic Scenarios vs Advanced Workplace Realities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-base">
              1. Cálculo Governamental Básico (Teórico)
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Considera apenas as retenções obrigatórias por lei sem nenhuma especificidade corporativa:
          </p>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-xs text-slate-900 block">Imposto Federal (ARC) com Abattement 16.5%</strong>
                <span className="text-[11px] text-slate-500 leading-tight block">
                  Aplica alíquotas federais progressivas com abatimento exclusivo concedido a quem mora no Québec.
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-xs text-slate-900 block">Imposto Provincial (Revenu Québec)</strong>
                <span className="text-[11px] text-slate-500 leading-tight block">
                  Alíquotas de 14% a 25,75% e dedução para trabalhadores assalariados (6% até teto).
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-xs text-slate-900 block">RRQ 1 (6,40%) e RQAP (0,494%)</strong>
                <span className="text-[11px] text-slate-500 leading-tight block">
                  Previdência do Québec e auxílio maternidade/paternidade com isenção básica anual de $3.500.
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-base">
              2. Realidade do Contracheque Industrial & Corporativo
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Fatores reais que o PaieNet calcula com precisão matemática para refletir seu pagamento exato:
          </p>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-emerald-50/40 border border-emerald-200/70 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-xs text-slate-900 block">Primes de Turno e Convenções Coletivas</strong>
                <span className="text-[11px] text-slate-600 leading-tight block">
                  Adicional noturno, bônus de final de semana e acordos horistas (ex: 36h trabalhadas pagas como 40h).
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/40 border border-emerald-200/70 flex items-start gap-2.5">
              <Stethoscope className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-xs text-slate-900 block">Assurance Collective & Benefício Tributável (Case J)</strong>
                <span className="text-[11px] text-slate-600 leading-tight block">
                  No Québec, o valor do plano de saúde pago pelo empregador é tributado no imposto provincial!
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/40 border border-emerald-200/70 flex items-start gap-2.5">
              <Scale className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-xs text-slate-900 block">Refeitório, REER Coletivo e Sindicato</strong>
                <span className="text-[11px] text-slate-600 leading-tight block">
                  Descontos em folha para refeições subsidiadas ($3 a $5/dia) e cotização voluntária para previdência.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AdBanner slotId="banner-horizontal" lang={lang} />
      <NewsletterBox lang={lang} />
    </div>
  );
};
