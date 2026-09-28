'use client';

import React, { useState, useEffect } from 'react';
import { Language } from '@/lib/i18n';
import {
  Mic,
  Sparkles,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Crown,
  ChevronRight,
  ChevronLeft,
  Timer,
  Award,
  HelpCircle,
} from 'lucide-react';

interface InterviewQuestion {
  id: number;
  category: string;
  question: string;
  context: string;
  modelAnswer: string;
  tipsToSucceed: string[];
  mistakesToAvoid: string[];
  starFormula: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
}

interface InterviewSimulatorProps {
  lang: Language;
  isPro: boolean;
  onOpenProModal: (trigger?: string) => void;
}

export const InterviewSimulator: React.FC<InterviewSimulatorProps> = ({
  lang,
  isPro,
  onOpenProModal,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(120);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [userNotes, setUserNotes] = useState('');

  const questions: InterviewQuestion[] = [
    {
      id: 1,
      category: 'Présentation & Accroche',
      question: 'Parlez-moi de vous et de ce qui vous amène aujourd’hui à postuler chez nous au Québec.',
      context: 'C’est la 1ère question de 95 % des entrevues. Les recruteurs québécois veulent une réponse de 2 minutes chrono, concise et orientée valeur ajoutée, sans raconter toute votre enfance.',
      modelAnswer:
        '« Bonjour ! En résumé, je cumule plus de 4 ans d’expérience en tant que technicien en milieu de production. Au cours de mon parcours, j’ai développé une solide expertise dans le diagnostic rapide des pannes et l’optimisation des cadences, tout en respectant à la lettre les normes de sécurité de la CNESST. Ce qui m’attire particulièrement chez votre entreprise, c’est votre culture axée sur l’innovation continue et la collaboration d’équipe. Je cherche aujourd’hui un environnement dynamique où je pourrai mettre à profit mon autonomie et mon souci du travail bien fait. »',
      tipsToSucceed: [
        'Adoptez un ton chaleureux, direct et humble (très apprécié au Québec).',
        'Structurez : Passé (votre force principale) → Présent (votre compétence clé) → Futur (ce que vous apportez à l’entreprise).',
        'Mentionnez une valeur de l’entreprise que vous avez vue sur leur site web.',
      ],
      mistakesToAvoid: [
        'Réciter mot pour mot votre CV chronologique depuis vos études secondaires.',
        'Parler uniquement de votre besoin d’immigration ou de visa au lieu de parler de vos compétences professionnelles.',
      ],
      starFormula: {
        situation: 'Parcours professionnel ciblé en 2 phrases',
        task: 'Mon domaine d’expertise principal',
        action: 'Comment je travaille en équipe et en autonomie',
        result: 'Pourquoi ce poste correspond exactement à mes forces',
      },
    },
    {
      id: 2,
      category: 'Méthode STAR & Résolution de Problème',
      question: 'Décrivez-moi une situation imprévue où vous avez dû prendre une décision rapide sans avoir votre superviseur sous la main.',
      context: 'Au Québec, la hiérarchie est très plate. Les gestionnaires détestent le micro-management et cherchent des candidats autonomes capables d’agir avec bon sens et sécurité.',
      modelAnswer:
        '« (Situation) Lors d’un quart de soir l’an dernier, un convoyeur principal s’est arrêté suite à une surchauffe de capteur alors que le chef d’équipe était en réunion à l’autre bout du bâtiment. (Tâche) Il fallait éviter un goulot d’étranglement sans mettre quiconque en danger. (Action) J’ai immédiatement enclenché le protocole de cadenassage sécurisé, isolé la ligne secondaire et diagnostiqué que le filtre était simplement obstrué par des résidus. J’ai nettoyé le capteur, testé à vide, puis relancé la cadence. (Résultat) La ligne est repartie en moins de 12 minutes, évitant la perte d’environ 2 000 $ de matière première. J’ai ensuite consigné l’incident dans le rapport de quart pour le superviseur. »',
      tipsToSucceed: [
        'Utilisez la méthode STAR : Situation claire, Tâche précise, Action concrète avec verbes d’action, Résultat chiffré.',
        'Démontrez que vous avez pensé d’abord à la sécurité (CNESST) avant la vitesse.',
      ],
      mistakesToAvoid: [
        'Dire « je n’ai jamais eu de problème » ou blâmer un ancien collègue.',
        'Utiliser uniquement « on » : le recruteur veut savoir ce que VOUS avez fait personnellement.',
      ],
      starFormula: {
        situation: 'Panne de machine en quart de soir',
        task: 'Éviter l’arrêt complet sans enfreindre la sécurité',
        action: 'Cadenassage, diagnostic du capteur et nettoyage',
        result: 'Relance en 12 minutes et rapport clair consigné',
      },
    },
    {
      id: 3,
      category: 'Climat de Travail & Relations Interpersonnelles',
      question: 'Comment réagissez-vous si vous êtes en désaccord avec la méthode d’un collègue sur un projet ?',
      context: 'La culture québécoise valorise l’harmonie, la diplomatie et le consensus. Les confrontations agressives ou les jeux de pouvoir hiérarchiques sont très mal vus.',
      modelAnswer:
        '« Dans un premier temps, j’écoute toujours activement son point de vue pour comprendre la logique derrière sa méthode : souvent, il y a des contraintes que je n’avais pas perçues. Ensuite, j’échange avec lui en privé, dans le respect et le calme, en proposant mon approche sous forme de suggestion : "Est-ce qu’on pourrait essayer ceci pour voir si on gagne du temps ?". Si le désaccord persiste, on se réfère ensemble aux standards de qualité ou on demande un éclairage neutre au superviseur, toujours dans l’optique du bien commun du projet. »',
      tipsToSucceed: [
        'Montrez votre capacité d’écoute active et de respect du climat d’équipe.',
        'Expliquez que vous discutez toujours en privé, jamais en public devant les autres.',
      ],
      mistakesToAvoid: [
        'Dire « j’impose ma façon de faire parce que j’ai raison ».',
        'Courir voir le patron au moindre petit différend sans avoir parlé avec le collègue d’abord.',
      ],
      starFormula: {
        situation: 'Différence de méthode entre deux techniciens',
        task: 'Trouver la solution la plus efficace et sécuritaire',
        action: 'Dialogue calme en tête-à-tête et test comparatif',
        result: 'Meilleure méthode adoptée sans conflit et dans la bonne humeur',
      },
    },
    {
      id: 4,
      category: 'Négociation Salariale au Québec',
      question: 'Quelles sont vos attentes salariales pour ce poste ?',
      context: 'Question cruciale ! Donner un chiffre trop bas vous dévalorise ; donner un chiffre hors marché vous élimine. Il faut utiliser les données réelles du marché québécois.',
      modelAnswer:
        '« Selon mes recherches sur les échelles salariales actuelles pour ce type de rôle dans la région de Québec et compte tenu de mes 4 années d’expérience concrète, je vise une fourchette entre 26 $ et 29 $ de l’heure. Bien entendu, je considère la rémunération globale, incluant les assurances collectives, les primes de quart et les possibilités d’avancement dans l’entreprise. »',
      tipsToSucceed: [
        'Donnez toujours une fourchette plutôt qu’un chiffre fixe.',
        'Mentionnez la "rémunération globale" (assurances, congés, REER) : cela prouve que vous comprenez le système québécois.',
      ],
      mistakesToAvoid: [
        'Répondre « je ne sais pas, payez ce que vous voulez ».',
        'Demander un chiffre sans avoir vérifié le salaire moyen sur PaieNet ou Guichet-Emploi.',
      ],
      starFormula: {
        situation: 'Question salariale directe du recruteur',
        task: 'Fixer la valeur marchande avec tact',
        action: 'Fourchette réaliste + prise en compte des avantages sociaux',
        result: 'Discussion ouverte et positive sur la rémunération globale',
      },
    },
  ];

  // Timer logic
  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          setIsTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const currentQ = questions[currentIndex];

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
      setTimerSeconds(120);
      setIsTimerRunning(false);
      setUserNotes('');
    } else if (!isPro) {
      onOpenProModal('Débloquez la banque complète de 25+ questions d’entrevue au Québec.');
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowAnswer(false);
      setTimerSeconds(120);
      setIsTimerRunning(false);
      setUserNotes('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0 shadow-xs">
              <Mic className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[11px] font-bold border border-amber-200 mb-1.5">
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>Culture du travail québécoise & Méthode STAR</span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                {lang === 'pt'
                  ? 'Simulador de Entrevistas de Emprego no Québec'
                  : lang === 'en'
                  ? 'Quebec Job Interview Simulator (STAR Method)'
                  : 'Simulateur d’Entrevue d’Emploi au Québec'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                {lang === 'pt'
                  ? 'Treine com as perguntas comportamentais mais frequentes feitas pelos RHs de Montreal e Québec. Veja o que responder, o que evitar e como estruturar suas respostas com a fórmula STAR.'
                  : 'Entraînez-vous aux questions comportementales les plus posées par les employeurs du Québec. Découvrez les bonnes pratiques, les erreurs culturelles à éviter et la formule STAR.'}
              </p>
            </div>
          </div>

          {/* Question Counter / Pro Banner */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
              Question {currentIndex + 1} / {questions.length}
            </span>
            {!isPro && (
              <button
                type="button"
                onClick={() => onOpenProModal('Banque complète de 25+ entrevues québécoises.')}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold shadow-xs transition-colors cursor-pointer"
              >
                <Crown className="w-3.5 h-3.5" />
                <span>Débloquer 25+</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Interactive Question Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        {/* Question Title & Category */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/80">
              {currentQ.category}
            </span>

            {/* Timer Controller */}
            <div className="flex items-center gap-2">
              <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border ${
                timerSeconds < 30 ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse' : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}>
                ⏱️ {Math.floor(timerSeconds / 60)}:{timerSeconds % 60 < 10 ? '0' : ''}{timerSeconds % 60}
              </span>
              <button
                type="button"
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
              >
                {isTimerRunning ? 'Pause' : 'Chronométrer'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setTimerSeconds(120);
                  setIsTimerRunning(false);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
                title="Réinitialiser le temps"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
            « {currentQ.question} »
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed italic bg-slate-50 p-3 rounded-xl border border-slate-100">
            💡 <strong>Ce que cherche le recruteur québécois :</strong> {currentQ.context}
          </p>
        </div>

        {/* User Practice Workspace */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
            <span>{lang === 'pt' ? 'Rascunhe seus pontos de resposta (Treino prático):' : 'Brouillon de votre réponse (Entraînement) :'}</span>
            <span className="text-[11px] text-slate-400">Non sauvegardé à des tiers</span>
          </label>
          <textarea
            rows={3}
            value={userNotes}
            onChange={(e) => setUserNotes(e.target.value)}
            placeholder={
              lang === 'pt'
                ? 'Anote aqui os pontos que você diria em voz alta antes de ver a resposta recomendada...'
                : 'Notez ici les mots-clés de votre réponse avant d’afficher le modèle conseillé...'
            }
            className="w-full p-3 text-xs sm:text-sm leading-relaxed text-slate-900 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Reveal Answer Toggle */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setShowAnswer(!showAnswer)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-extrabold text-xs sm:text-sm border border-blue-200 transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <Lightbulb className="w-4 h-4 text-blue-600" />
            <span>{showAnswer ? 'Masquer la réponse recommandée' : 'Voir la réponse recommandée & Formule STAR'}</span>
          </button>

          {/* Prev / Next Pagination */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              disabled={currentIndex === 0}
              onClick={handlePrev}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 font-bold text-xs flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Précédente</span>
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
            >
              <span>{currentIndex === questions.length - 1 ? 'Terminer / Pro' : 'Suivante'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Revealed Insights & Model Answer */}
        {showAnswer && (
          <div className="space-y-5 pt-4 border-t border-slate-200 animate-in fade-in duration-200">
            {/* Model Response Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-blue-50/80 to-indigo-50/80 border border-blue-200/80 space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-700" />
                <span>Exemple de réponse réussie (Modèle recommandé) :</span>
              </span>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-serif text-justify bg-white/70 p-3.5 rounded-xl border border-blue-100">
                {currentQ.modelAnswer}
              </p>
            </div>

            {/* STAR Breakdown Grid */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
              <span className="text-xs font-bold text-slate-900 block uppercase tracking-wider">
                🌟 Décomposition selon la Formule STAR québécoise :
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                  <span className="font-extrabold text-blue-700 block text-[11px]">S - Situation :</span>
                  <span className="text-slate-700">{currentQ.starFormula.situation}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                  <span className="font-extrabold text-indigo-700 block text-[11px]">T - Tâche :</span>
                  <span className="text-slate-700">{currentQ.starFormula.task}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                  <span className="font-extrabold text-emerald-700 block text-[11px]">A - Action :</span>
                  <span className="text-slate-700">{currentQ.starFormula.action}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                  <span className="font-extrabold text-amber-700 block text-[11px]">R - Résultat :</span>
                  <span className="text-slate-700">{currentQ.starFormula.result}</span>
                </div>
              </div>
            </div>

            {/* Dos and Don'ts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1.5">
                <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Ce qui fait gagner des points au Québec :</span>
                </span>
                <ul className="list-disc list-inside text-emerald-950 space-y-1 pl-1">
                  {currentQ.tipsToSucceed.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200 space-y-1.5">
                <span className="font-bold text-rose-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Erreurs culturelles à éviter :</span>
                </span>
                <ul className="list-disc list-inside text-rose-950 space-y-1 pl-1">
                  {currentQ.mistakesToAvoid.map((mistake, i) => (
                    <li key={i}>{mistake}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
