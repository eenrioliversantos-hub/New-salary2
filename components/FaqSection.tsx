'use client';

import React, { useState } from 'react';
import { Language, translations } from '@/lib/i18n';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface FaqSectionProps {
  lang: Language;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ lang }) => {
  const t = translations[lang];
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: lang === 'pt'
        ? 'Por que a maioria dos salários no Québec é paga "aux deux semaines" (quinzenal)?'
        : lang === 'en'
        ? 'Why are most wages in Quebec paid bi-weekly ("aux deux semaines")?'
        : 'Pourquoi la majorité des salaires au Québec est versée aux deux semaines ?',
      a: lang === 'pt'
        ? 'A norma bancária e de folha de pagamento na maioria das empresas e fábricas no Québec segue 26 períodos anuais (a cada duas semanas, geralmente às quintas ou sextas-feiras). Por isso, planejar seu orçamento com base no valor quinzenal é o mais fiel à realidade.'
        : lang === 'en'
        ? 'The banking and corporate payroll standard in Quebec typically follows 26 annual pay cycles (every other week, often on Thursdays or Fridays). Planning expenses around bi-weekly pay is the most realistic for workers.'
        : 'La norme bancaire et corporative au Québec suit généralement un calendrier de 26 périodes par an (un versement toutes les deux semaines, souvent le jeudi ou vendredi). C’est le cycle le plus fidèle pour gérer son budget mensuel et ses prélèvements.',
    },
    {
      q: lang === 'pt'
        ? 'O que é o Abattement do Québec de 16,5% no imposto federal?'
        : lang === 'en'
        ? 'What is the 16.5% Quebec Abatement on federal tax?'
        : "Qu'est-ce que l'abattement du Québec de 16,5 % sur l'impôt fédéral ?",
      a: lang === 'pt'
        ? 'Como o Québec administra diretamente diversos programas sociais (como saúde, creches e previdência), o Governo Federal do Canadá concede um desconto direto de 16,5% sobre o imposto federal básico a pagar a todos os residentes do Québec. Esta calculadora aplica esse desconto automaticamente.'
        : lang === 'en'
        ? 'Because Quebec directly administers many social and provincial programs, the Canadian Federal Government grants a 16.5% direct refundable reduction on basic federal tax payable to all Quebec residents. Our calculator accounts for this automatically.'
        : "Puisque le Québec finance et gère lui-même plusieurs programmes sociaux autonomes, le gouvernement fédéral canadien applique un abattement remboursable de 16,5 % sur l'impôt fédéral de base pour tous les résidents fiscaux du Québec. Notre moteur de calcul l'applique avec précision.",
    },
    {
      q: lang === 'pt'
        ? 'Por que a alíquota de Seguro-Desemprego (AE) é menor no Québec?'
        : lang === 'en'
        ? 'Why is the Employment Insurance (EI) rate lower in Quebec?'
        : "Pourquoi le taux d'assurance-emploi (AE) est-il plus bas au Québec ?",
      a: lang === 'pt'
        ? 'No restante do Canadá, a taxa de AE é de cerca de 1,66%. No Québec, é de 1,32%, porque a província possui seu próprio regime de licença maternidade/paternidade (o RQAP), não precisando que a AE federal cubra essa parte.'
        : lang === 'en'
        ? 'In other Canadian provinces, the employee EI rate is approx 1.66%. In Quebec, it is reduced to 1.32% because the province operates its own parental insurance plan (QPIP/RQAP).'
        : "Dans les autres provinces canadiennes, le taux employé est d'environ 1,66 %. Au Québec, il est réduit à 1,32 % car la province gère son propre Régime québécois d'assurance parentale (RQAP).",
    },
    {
      q: lang === 'pt'
        ? 'Como funcionam as horas extras segundo as normas do trabalho no Québec (CNESST)?'
        : lang === 'en'
        ? 'How does overtime pay work under Quebec labor standards (CNESST)?'
        : 'Comment fonctionnent les heures supplémentaires selon la CNESST ?',
      a: lang === 'pt'
        ? 'De acordo com a Lei de Normas do Trabalho do Québec (CNESST), a semana padrão é de 40 horas. Todas as horas trabalhadas além de 40h devem ser remuneradas com adicional mínimo de 50% (Temps et demi a 1.5x).'
        : lang === 'en'
        ? 'Under Quebec labor standards (CNESST), the standard workweek is 40 hours. Overtime worked beyond 40 hours must be paid at time-and-a-half (1.5× your hourly rate).'
        : "Selon la Loi sur les normes du travail (CNESST), la semaine normale de travail est de 40 heures. Toute heure effectuée au-delà de la semaine normale doit être majorée d'au moins 50 % (temps et demi à 1,5×).",
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-1">
        <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
          <HelpCircle className="w-4 h-4" />
        </div>
        <h3 className="text-base sm:text-lg font-bold text-slate-900">
          {t.faqTitle}
        </h3>
      </div>
      <p className="text-xs text-slate-500 mb-4">
        {t.faqSubtitle}
      </p>

      <div className="space-y-2.5">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="border border-slate-200/80 rounded-xl overflow-hidden transition-all"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-3.5 sm:p-4 text-left font-semibold text-slate-900 hover:bg-slate-50 flex items-center justify-between text-xs sm:text-sm gap-2"
              >
                <span>{faq.q}</span>
                <span className="text-slate-400 shrink-0">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </span>
              </button>
              {isOpen && (
                <div className="px-3.5 sm:px-4 pb-4 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50/50 border-t border-slate-100">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
