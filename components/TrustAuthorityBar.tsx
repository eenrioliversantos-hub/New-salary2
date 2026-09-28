'use client';

import React from 'react';
import { ShieldCheck, FileCheck, Landmark, Lock, Scale } from 'lucide-react';
import { Language } from '@/lib/i18n';

interface TrustAuthorityBarProps {
  lang: Language;
}

export const TrustAuthorityBar: React.FC<TrustAuthorityBarProps> = ({ lang }) => {
  const content = {
    fr: {
      standardTitle: 'Barèmes Fiscaux Officiels 2026',
      standardSubtitle: 'Tables de retenues à la source Revenu Québec (TP-1015.3) & ARC Canada (T4127)',
      badges: [
        { icon: <Landmark className="w-3.5 h-3.5" />, text: 'Revenu Québec 2026' },
        { icon: <Scale className="w-3.5 h-3.5" />, text: 'Normes du travail (CNESST)' },
        { icon: <FileCheck className="w-3.5 h-3.5" />, text: 'RRQ, RQAP & AE à jour' },
        { icon: <Lock className="w-3.5 h-3.5" />, text: '100% Confidentiel (sans stockage)' },
      ],
    },
    pt: {
      standardTitle: 'Tabelas Fiscais Oficiais 2026',
      standardSubtitle: 'Tabelas de retenção na fonte de Revenu Québec (TP-1015.3) e CRA Canadá (T4127)',
      badges: [
        { icon: <Landmark className="w-3.5 h-3.5" />, text: 'Revenu Québec 2026' },
        { icon: <Scale className="w-3.5 h-3.5" />, text: 'Normas Trabalhistas (CNESST)' },
        { icon: <FileCheck className="w-3.5 h-3.5" />, text: 'RRQ, RQAP e EI auditados' },
        { icon: <Lock className="w-3.5 h-3.5" />, text: '100% Confidencial (processado no seu aparelho)' },
      ],
    },
    en: {
      standardTitle: 'Official 2026 Tax Standard',
      standardSubtitle: 'Source deduction tables compliant with Revenu Québec (TP-1015.3) & CRA (T4127)',
      badges: [
        { icon: <Landmark className="w-3.5 h-3.5" />, text: 'Revenu Québec 2026' },
        { icon: <Scale className="w-3.5 h-3.5" />, text: 'Labor Standards (CNESST)' },
        { icon: <FileCheck className="w-3.5 h-3.5" />, text: 'QPP, QPIP & EI Updated' },
        { icon: <Lock className="w-3.5 h-3.5" />, text: '100% Private (No data saved)' },
      ],
    },
  }[lang];

  return (
    <div className="py-2.5 px-3.5 sm:px-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800 shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
              <span>{content.standardTitle}</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>
            <p className="text-[11px] text-slate-500">
              {content.standardSubtitle}
            </p>
          </div>
        </div>

        {/* Quiet inline trust indicators - Zero amateur pills */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-600 font-medium pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
          {content.badges.map((badge, index) => (
            <div key={index} className="inline-flex items-center gap-1.5">
              <span className="text-slate-400">{badge.icon}</span>
              <span>{badge.text}</span>
              {index < content.badges.length - 1 && (
                <span className="hidden sm:inline text-slate-300 ml-2">·</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
