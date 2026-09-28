'use client';

import React, { useState } from 'react';
import { Language } from '@/lib/i18n';
import { adminStore } from '@/lib/admin-store';
import { Mail, CheckCircle2, Sparkles, Send, ShieldCheck, Gift } from 'lucide-react';

interface NewsletterBoxProps {
  lang: Language;
  variant?: 'card' | 'banner';
}

export const NewsletterBox: React.FC<NewsletterBoxProps> = ({ lang, variant = 'card' }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setLoading(true);

    // Save lead to admin store for tracking and CSV export
    adminStore.addNewsletterLead(email, variant === 'banner' ? 'home_banner' : 'blog_post');

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  if (submitted) {
    return (
      <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-center space-y-2 animate-in zoom-in-95">
        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h4 className="font-extrabold text-base sm:text-lg">
          {lang === 'pt' ? 'Inscrição Confirmada com Sucesso!' : 'Inscription Confirmée avec Succès !'}
        </h4>
        <p className="text-xs text-emerald-800 max-w-md mx-auto">
          {lang === 'pt'
            ? `Enviamos o Modelo de CV Canadense e a Tabela de Alíquotas para ${email}. Verifique sua caixa de entrada!`
            : `Nous avons envoyé le gabarit de CV canadien et le tableau fiscal à ${email}. Vérifiez votre boîte de réception !`}
        </p>
      </div>
    );
  }

  return (
    <div
      className={`rounded-3xl border transition-all ${
        variant === 'banner'
          ? 'bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 border-blue-800/80 shadow-lg'
          : 'bg-white p-6 sm:p-7 border-slate-200 shadow-xs'
      }`}
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left text */}
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[11px] font-bold border border-blue-400/30">
            <Gift className="w-3.5 h-3.5 text-amber-300" />
            <span>
              {lang === 'pt' ? 'Newsletter Gratuita + Bônus' : 'Infolettre Hebdomadaire Gratuite'}
            </span>
          </div>

          <h3
            className={`text-lg sm:text-xl font-black tracking-tight ${
              variant === 'banner' ? 'text-white' : 'text-slate-900'
            }`}
          >
            {lang === 'pt'
              ? 'Receba Atualizações Salariais & Dicas de Emprego no Québec'
              : 'Recevez les mises à jour fiscales & conseils d’embauche au Québec'}
          </h3>

          <p
            className={`text-xs sm:text-sm max-w-xl leading-relaxed ${
              variant === 'banner' ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            {lang === 'pt'
              ? 'Cadastre-se gratuitamente para receber alertas de mudanças fiscais do Québec (RRQ, imposto), vagas e receba o Modelo Oficial de CV em PDF.'
              : 'Inscrivez-vous gratuitement pour recevoir les changements fiscaux (Revenu Québec, RRQ), astuces d’entrevue et le gabarit de CV officiel.'}
          </p>

          <div className="flex items-center justify-center md:justify-start gap-4 text-[11px] text-slate-400 pt-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{lang === 'pt' ? 'Sem spam, cancelamento em 1 clique' : 'Zéro pourriel, désabonnement en 1 clic'}</span>
            </span>
            <span>•</span>
            <span>{lang === 'pt' ? 'Toda quinta-feira' : 'Chaque jeudi'}</span>
          </div>
        </div>

        {/* Right input form */}
        <form onSubmit={handleSubmit} className="w-full md:w-auto md:min-w-[320px] space-y-2">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={lang === 'pt' ? 'Seu melhor e-mail...' : 'Votre courriel professionnel...'}
                className="w-full pl-10 pr-3 py-2.5 sm:py-3 text-xs sm:text-sm rounded-xl bg-white text-slate-900 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 sm:py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap active:scale-95 disabled:opacity-70"
            >
              {loading ? (
                <span>...</span>
              ) : (
                <>
                  <span>{lang === 'pt' ? 'Cadastrar' : 'S’inscrire'}</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
