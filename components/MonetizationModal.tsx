'use client';

import React, { useState } from 'react';
import { Language } from '@/lib/i18n';
import {
  Crown,
  CheckCircle2,
  Lock,
  Sparkles,
  CreditCard,
  ShieldCheck,
  X,
  FileDown,
  Briefcase,
  Award,
  Zap,
} from 'lucide-react';

interface MonetizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onUnlockPro: () => void;
  featureTrigger?: string;
}

export const MonetizationModal: React.FC<MonetizationModalProps> = ({
  isOpen,
  onClose,
  lang,
  onUnlockPro,
  featureTrigger,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'single' | 'pro'>('single');
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setSuccess(true);
      onUnlockPro();
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1800);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3.5 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden relative my-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors z-10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header Banner */}
        <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 text-white p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-36 h-36 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -left-8 -bottom-8 w-36 h-36 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30 mb-3">
            <Crown className="w-3.5 h-3.5 text-amber-300" />
            <span>PaieNet Carrière Pro</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            {lang === 'pt'
              ? 'Destaque-se no Mercado de Trabalho do Québec'
              : lang === 'en'
              ? 'Stand Out in the Quebec Job Market'
              : 'Démarquez-vous sur le marché de l’emploi québécois'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
            {featureTrigger ||
              (lang === 'pt'
                ? 'Currículo formatado para passar em sistemas ATS, simulador completo de entrevistas e testes técnicos das empresas do Québec.'
                : lang === 'en'
                ? 'ATS-compliant Quebec resume, full interview prep simulator, and technical screening test guides.'
                : 'CV au format canadien 100% conforme ATS, préparation complète aux entrevues et tests techniques des employeurs québécois.')}
          </p>
        </div>

        {/* Content & Plan Selection */}
        <div className="p-6 sm:p-7 space-y-5">
          {/* Plan Comparison Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Plan 1: Pass Único (Microtransação) */}
            <div
              onClick={() => setSelectedPlan('single')}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                selectedPlan === 'single'
                  ? 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-500/20 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-600">
                  {lang === 'pt' ? 'Download Avulso' : lang === 'en' ? 'Single Download' : 'Téléchargement unique'}
                </span>
                <span className="text-base font-extrabold text-slate-900">$4.99 CAD</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                {lang === 'pt'
                  ? '1 exportação em PDF de alta resolução do seu CV Padrão Québec sem marcas d’água.'
                  : '1 téléchargement PDF haute qualité de votre CV au format québécois sans filigrane.'}
              </p>
            </div>

            {/* Plan 2: Pass Carreira Pro Completo */}
            <div
              onClick={() => setSelectedPlan('pro')}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                selectedPlan === 'pro'
                  ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-500/20 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="absolute -top-2.5 right-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-2xs">
                {lang === 'pt' ? 'Melhor Escolha' : 'Meilleur Choix'}
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-indigo-900">
                  {lang === 'pt' ? 'Pass Completo' : 'Accès Carrière Pro'}
                </span>
                <span className="text-base font-extrabold text-indigo-950">$12.99 CAD</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                {lang === 'pt'
                  ? 'Downloads ilimitados de CV + Simulador de entrevistas STAR completo + Todos os testes técnicos com gabarito.'
                  : 'CVs illimités + Simulateur d’entrevue complet + Tous les tests techniques corrigés pas à pas.'}
              </p>
            </div>
          </div>

          {/* Benefits Bullet List */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs text-slate-700">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                {lang === 'pt'
                  ? 'Format Canadien / Québec 100% legal (sem foto, sem idade, sem estado civil para evitar descarte)'
                  : 'Format canadien / québécois 100% légal (sans photo ni données discriminatoires)'}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                {lang === 'pt'
                  ? 'Otimizado para passar pelos robôs ATS dos RHs de empresas de Montreal e do Québec'
                  : 'Optimisé pour franchir avec succès les filtres ATS des employeurs québécois'}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                {lang === 'pt'
                  ? 'Perguntas reais de entrevistas com o método STAR e cultura do trabalho local'
                  : 'Questions réelles d’entrevues québécoises selon la méthode STAR et la culture locale'}
              </span>
            </div>
          </div>

          {/* Payment CTA Simulation */}
          <div className="pt-2">
            {success ? (
              <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-center font-bold text-sm flex items-center justify-center gap-2 animate-in zoom-in-95">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>
                  {lang === 'pt' ? 'Acesso Pro Desbloqueado com Sucesso!' : 'Accès Pro débloqué avec succès !'}
                </span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleSimulatePayment}
                disabled={isProcessing}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-extrabold text-sm sm:text-base shadow-lg hover:shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 active:scale-98"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{lang === 'pt' ? 'Processando...' : 'Traitement en cours...'}</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>
                      {lang === 'pt'
                        ? `Desbloquear Agora (${selectedPlan === 'single' ? '$4.99 CAD' : '$12.99 CAD'})`
                        : `Débloquer maintenant (${selectedPlan === 'single' ? '4,99 $ CAD' : '12,99 $ CAD'})`}
                    </span>
                  </>
                )}
              </button>
            )}

            <div className="mt-2.5 flex items-center justify-center gap-3 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Paiement sécurisé Stripe / Apple Pay</span>
              </span>
              <span>·</span>
              <span>Sans abonnement forcé</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
