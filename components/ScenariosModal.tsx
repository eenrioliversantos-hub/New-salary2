'use client';

import React from 'react';
import { Language, translations } from '@/lib/i18n';
import { X, CheckCircle2, ShieldAlert, Sparkles, Building2, Factory, Stethoscope, ArrowRight } from 'lucide-react';

interface ScenariosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadLeclercExample: () => void;
  lang: Language;
}

export const ScenariosModal: React.FC<ScenariosModalProps> = ({
  isOpen,
  onClose,
  onLoadLeclercExample,
  lang,
}) => {
  if (!isOpen) return null;

  const t = translations[lang];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {t.scenariosDialogTitle}
              </h3>
              <p className="text-xs text-slate-500">
                Comparativo entre o cálculo governamental básico e o contracheque real de empresa
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs sm:text-sm text-slate-700">
          {/* Quick Real Example Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-emerald-50 border border-blue-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900 uppercase tracking-wider mb-1">
                <Factory className="w-4 h-4 text-blue-600" />
                <span>Exemplo Real Analisado (Biscuits Leclerc)</span>
              </div>
              <p className="text-xs text-slate-600">
                Taxa $31,51/h · 72h normais · Prime 36/40 ($252,08) · Seguro Médico ($74,28) · Refeições ($9,00) · <strong>Net Exato: $1.743,01</strong>
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                onLoadLeclercExample();
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shrink-0 shadow-sm transition-all cursor-pointer"
            >
              <span>{t.loadExampleBtn}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Section 1: Basic Scenarios */}
          <div>
            <h4 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              1. Cenários Básicos Suportados (Modo Padrão)
            </h4>
            <p className="text-xs text-slate-500 mb-3">
              Cobre 100% dos impostos e retenções fiscais obrigatórias exigidas por lei no Québec:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block text-xs">Imposto Federal (CRA) com Abattement</strong>
                  <span className="text-[11px] text-slate-500">
                    Calcula faixas progressivas federais com desconto de 16,5% exclusivo do Québec.
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block text-xs">Imposto Provincial (Revenu Québec)</strong>
                  <span className="text-[11px] text-slate-500">
                    Faixas de 14% a 25,75% e dedução para trabalhadores assalariados (6%).
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block text-xs">RRQ (Régime de rentes du Québec)</strong>
                  <span className="text-[11px] text-slate-500">
                    Aposentadoria pública a 6,40% (com isenção de $3.500) + patamar adicional RRQ 2 a 4%.
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block text-xs">RQAP & Seguro-Desemprego (AE)</strong>
                  <span className="text-[11px] text-slate-500">
                    Parentalidade provincial (0,494%) e taxa reduzida de AE para o Québec (1,32%).
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Advanced Workplace Scenarios */}
          <div>
            <h4 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              2. Cenários Avançados de Indústria & Empresa (Modo Holerite Real)
            </h4>
            <p className="text-xs text-slate-500 mb-3">
              Estes são os valores que causam a diferença entre uma calculadora comum e o seu contracheque real:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200/80 flex items-start gap-2">
                <Factory className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block text-xs">Primes de Turno e Adicionais Horistas</strong>
                  <span className="text-[11px] text-slate-600">
                    Adicional noturno, Prime 36/40, adicional de fim de semana ou por hora trabalhada.
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200/80 flex items-start gap-2">
                <Stethoscope className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block text-xs">Assurance Collective (Plano de Saúde/Dental)</strong>
                  <span className="text-[11px] text-slate-600">
                    Seguro médico, dental, seguro de vida de base e cobertura de dependentes.
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200/80 flex items-start gap-2">
                <Building2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block text-xs">Avantages Imposables da Empresa (Case J)</strong>
                  <span className="text-[11px] text-slate-600">
                    No Québec, a parcela do seguro de saúde paga pela empresa aumenta o imposto provincial!
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200/80 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block text-xs">Cafeteria, REER Coletivo e Sindicato</strong>
                  <span className="text-[11px] text-slate-600">
                    Refeições no refeitório subsidiado ($3 por prato), planos de previdência e mensalidade sindical.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Precision explanation */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
            <strong className="text-slate-900 block text-xs">🎯 Como saber o grau de precisão do seu cálculo?</strong>
            <p>
              • <strong>85% - 90% (Modo Padrão):</strong> Perfeito para quem está negociando um novo emprego e quer saber a estimativa legal líquida sem benefícios privados.
            </p>
            <p>
              • <strong>95% - 99% (Modo Avançado):</strong> Perfeito para quem já trabalha na empresa e deseja bater o valor líquido exato que vai cair na conta bancária a cada 2 semanas.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-200 flex items-center justify-end bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors"
          >
            Fechar e voltar à calculadora
          </button>
        </div>
      </div>
    </div>
  );
};
