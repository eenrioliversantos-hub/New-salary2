'use client';

import React, { useState } from 'react';
import { Language } from '@/lib/i18n';
import {
  FileCheck2,
  Sparkles,
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Crown,
  ShieldCheck,
  Table,
  Cpu,
  ArrowRight,
  HelpCircle,
  Lock,
} from 'lucide-react';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: 'cnesst' | 'excel' | 'logic';
}

interface TechnicalTestsSimulatorProps {
  lang: Language;
  isPro: boolean;
  onOpenProModal: (trigger?: string) => void;
}

export const TechnicalTestsSimulator: React.FC<TechnicalTestsSimulatorProps> = ({
  lang,
  isPro,
  onOpenProModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'cnesst' | 'excel' | 'logic'>('cnesst');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const questions: Record<'cnesst' | 'excel' | 'logic', QuizQuestion[]> = {
    cnesst: [
      {
        id: 1,
        category: 'cnesst',
        question: 'Au Québec, selon la Loi sur la santé et la sécurité du travail (LSST), un travailleur a-t-il le droit de refuser d’exécuter une tâche s’il a des motifs raisonnables de croire qu’elle présente un danger pour sa santé ou sa sécurité ?',
        options: [
          'Non, il doit d’abord exécuter l’ordre de son supérieur puis déposer un grief syndical plus tard.',
          'Oui, c’est le « Droit de refus » garanti par l’article 12 de la LSST.',
          'Uniquement si l’entreprise compte plus de 100 employés au Québec.',
          'Oui, mais uniquement avec l’accord préalable écrit d’un inspecteur de la CNESST.',
        ],
        correctIndex: 1,
        explanation: 'En vertu de l’article 12 de la LSST au Québec, tout travailleur a le droit de refuser d’exécuter un travail s’il a des motifs raisonnables de croire que ce travail l’expose ou expose autrui à un danger pour sa santé, sa sécurité ou son intégrité physique.',
      },
      {
        id: 2,
        category: 'cnesst',
        question: 'Que signifie l’acronyme SIMDUT, omniprésent dans les milieux de travail québécois et canadiens ?',
        options: [
          'Système d’Information sur les Matières Dangereuses Utilisées au Travail.',
          'Service d’Immigration et de Mobilité Directe pour Usines et Techniciens.',
          'Standard International des Machines Découpées et Usinées par Tolérance.',
          'Syndicat Indépendant des Métallurgistes et Décolleteurs Unifiés du Travail.',
        ],
        correctIndex: 0,
        explanation: 'Le SIMDUT (Système d’information sur les matières dangereuses utilisées au travail) est la norme canadienne sur la communication des renseignements à l’égard des produits dangereux (FDS et pictogrammes).',
      },
      {
        id: 3,
        category: 'cnesst',
        question: 'Avant d’intervenir pour nettoyer ou réparer une machine industrielle en marche, quelle procédure est légalement obligatoire au Québec ?',
        options: [
          'Prévenir un collègue oralement et travailler rapidement.',
          'La procédure de cadenassage (isolation des sources d’énergie avec cadenas personnel).',
          'Diminuer la vitesse du moteur de 50 %.',
          'Mettre des gants en cuir épais et laisser la machine sous tension.',
        ],
        correctIndex: 1,
        explanation: 'Le cadenassage (art. 185 du Règlement sur la santé et la sécurité du travail du Québec) exige de couper, dissiper et verrouiller physiquement avec un cadenas propre à chaque travailleur toutes les sources d’énergie avant d’entrer dans la zone dangereuse.',
      },
    ],
    excel: [
      {
        id: 1,
        category: 'excel',
        question: 'Dans Microsoft Excel, quelle formule moderne permet de rechercher une valeur dans un tableau et de renvoyer le résultat correspondant sans contrainte de sens gauche/droite ?',
        options: [
          '=SOMME.SI()',
          '=XLOOKUP() (ou =RECHERCHEX() en français)',
          '=CONCATENER()',
          '=ALEA.ENTRE.BORNES()',
        ],
        correctIndex: 1,
        explanation: 'La fonction RECHERCHEX (XLOOKUP) a remplacé avantageusement RECHERCHEV et RECHERCHEH en éliminant les limitations des colonnes à gauche et en gérant nativement les valeurs non trouvées.',
      },
      {
        id: 2,
        category: 'excel',
        question: 'Comment fige-t-on une référence de cellule (ex: $B$4) dans une formule pour qu’elle ne change pas quand on l’étire vers le bas ?',
        options: [
          'En appuyant sur la touche F4 (ou en ajoutant manuellement le symbole $ avant la lettre et le chiffre).',
          'En mettant le texte en gras avec Ctrl + B.',
          'En fusionnant la cellule avec la cellule voisine.',
          'En protégeant la feuille de calcul avec un mot de passe administrateur.',
        ],
        correctIndex: 0,
        explanation: 'La touche F4 ajoute des symboles $ (référence absolue $B$4) qui verrouillent la cellule lors de la copie de la formule.',
      },
      {
        id: 3,
        category: 'excel',
        question: 'Quelle combinaison de touches permet d’annuler immédiatement la dernière action effectuée ?',
        options: [
          'Ctrl + P',
          'Ctrl + Z (ou Cmd + Z sur Mac)',
          'Alt + F4',
          'Ctrl + Alt + Suppr',
        ],
        correctIndex: 1,
        explanation: 'Ctrl + Z est le raccourci universel d’annulation dans Excel et Windows.',
      },
    ],
    logic: [
      {
        id: 1,
        category: 'logic',
        question: 'Au Québec, le système métrique est officiel mais les mesures impériales sont courantes dans la construction et l’industrie. Combien de centimètres mesure environ 1 pouce (1 inch) ?',
        options: [
          '1,00 cm',
          '2,54 cm',
          '5,00 cm',
          '10,00 cm',
        ],
        correctIndex: 1,
        explanation: '1 pouce (in ou ") équivaut exactement à 2,54 centimètres. C’est la conversion la plus testée dans les usines québécoises.',
      },
      {
        id: 2,
        category: 'logic',
        question: 'Si un engrenage A tourne dans le sens des aiguilles d’une montre et entraîne directement un engrenage B avec lequel il est imbriqué, dans quel sens tourne l’engrenage B ?',
        options: [
          'Dans le sens contraire des aiguilles d’une montre (sens antihoraire).',
          'Dans le même sens des aiguilles d’une montre.',
          'Il ne tourne pas, il oscille de haut en bas.',
          'Dans les deux sens alternativement.',
        ],
        correctIndex: 0,
        explanation: 'Deux engrenages directement imbriqués tournent obligatoirement en sens opposés.',
      },
      {
        id: 3,
        category: 'logic',
        question: 'Une ligne produit 180 pièces par heure. Si le quart de travail dure 8 heures avec deux pauses de 15 minutes non productives, combien de pièces sont produites ?',
        options: [
          '1 440 pièces',
          '1 350 pièces (7,5 heures × 180 pièces/h)',
          '1 000 pièces',
          '1 500 pièces',
        ],
        correctIndex: 1,
        explanation: '8 heures moins deux pauses de 15 min (30 min = 0,5 h) = 7,5 heures productives. 7,5 × 180 = 1 350 pièces.',
      },
    ],
  };

  const currentQuestions = questions[selectedCategory];
  const q = currentQuestions[currentQIndex];

  const handleSelectOption = (idx: number) => {
    if (selectedOption !== null) return; // already answered
    setSelectedOption(idx);
    setShowExplanation(true);
    if (idx === q.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQIndex < currentQuestions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentQIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center shrink-0 shadow-xs">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 text-[11px] font-bold border border-teal-200 mb-1.5">
                <Sparkles className="w-3 h-3 text-teal-600" />
                <span>Tests d’embauche récurrents au Québec</span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                {lang === 'pt'
                  ? 'Simulador de Testes Técnicos & Aptidão Profissional'
                  : lang === 'en'
                  ? 'Quebec Technical & Aptitude Screening Tests'
                  : 'Simulateur de Tests Techniques & d’Aptitude du Québec'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                {lang === 'pt'
                  ? 'Pratique os testes mais aplicados em processos seletivos no Québec: Saúde e Segurança (CNESST / SIMDUT), Excel para escritório e lógica mecânica/produção.'
                  : 'Entraînez-vous aux tests éliminatoires appliqués lors des embauches : Santé & Sécurité (CNESST / SIMDUT), Excel pratique et logique opérationnelle.'}
              </p>
            </div>
          </div>

          {!isPro && (
            <button
              type="button"
              onClick={() => onOpenProModal('Débloquez les 50+ questions des tests techniques québécois.')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs shadow-xs transition-all cursor-pointer whitespace-nowrap active:scale-95"
            >
              <Crown className="w-4 h-4 text-slate-950" />
              <span>Pass Pro (50+ Tests)</span>
            </button>
          )}
        </div>

        {/* Category Tabs */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('cnesst');
              handleRestart();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'cnesst'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Santé & Sécurité (CNESST / SIMDUT)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (!isPro) {
                onOpenProModal('excel');
                return;
              }
              setSelectedCategory('excel');
              handleRestart();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'excel'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Excel & Bureautique Pratique</span>
            {!isPro && <Lock className="w-3 h-3 text-slate-400" />}
          </button>

          <button
            type="button"
            onClick={() => {
              if (!isPro) {
                onOpenProModal('logic');
                return;
              }
              setSelectedCategory('logic');
              handleRestart();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'logic'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Logique & Mesures (Pouces / Cadence)</span>
            {!isPro && <Lock className="w-3 h-3 text-slate-400" />}
          </button>
        </div>
      </div>

      {/* Quiz Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        {!isFinished ? (
          <>
            {/* Question Progress Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500">
                Question {currentQIndex + 1} sur {currentQuestions.length}
              </span>
              <span className="text-xs font-extrabold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                Score : {score} / {currentQuestions.length}
              </span>
            </div>

            {/* Question Text */}
            <div className="space-y-2">
              <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                {q.question}
              </h3>
            </div>

            {/* Multiple Choice Options */}
            <div className="space-y-2.5">
              {q.options.map((opt, idx) => {
                const isChosen = selectedOption === idx;
                const isCorrect = idx === q.correctIndex;

                let btnStyles = 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800';

                if (selectedOption !== null) {
                  if (isCorrect) {
                    btnStyles = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-500/20';
                  } else if (isChosen) {
                    btnStyles = 'bg-rose-50 border-rose-500 text-rose-950 font-bold ring-2 ring-rose-500/20';
                  } else {
                    btnStyles = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={selectedOption !== null}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm transition-all flex items-start gap-3 cursor-pointer ${btnStyles}`}
                  >
                    <span className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1 leading-relaxed">{opt}</span>
                    {selectedOption !== null && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                    {selectedOption !== null && isChosen && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation Area */}
            {showExplanation && (
              <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs text-blue-950 space-y-1.5 animate-in fade-in duration-200">
                <span className="font-extrabold uppercase tracking-wider block text-blue-900 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-blue-700" />
                  <span>Explication & Base Légale :</span>
                </span>
                <p className="leading-relaxed text-justify">{q.explanation}</p>
              </div>
            )}

            {/* Next Question CTA */}
            {selectedOption !== null && (
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-xs active:scale-95"
                >
                  <span>{currentQIndex === currentQuestions.length - 1 ? 'Voir mes résultats' : 'Question suivante'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        ) : (
          /* Finished Screen */
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Test complété avec succès !
              </h3>
              <p className="text-sm text-slate-600">
                Votre score : <strong className="text-emerald-600 text-base">{score} / {currentQuestions.length}</strong> ({Math.round((score / currentQuestions.length) * 100)} %)
              </p>
            </div>

            <div className="p-4 max-w-md mx-auto rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
              {score === currentQuestions.length ? (
                <span>🎉 Excellent ! Vous maîtrisez parfaitement les bases attendues par les recruteurs du Québec dans cette catégorie.</span>
              ) : (
                <span>💡 Bon travail ! Révisez les explications des questions manquées pour être 100% prêt le jour du test technique.</span>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
              <button
                type="button"
                onClick={handleRestart}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Recommencer ce test</span>
              </button>

              {!isPro && (
                <button
                  type="button"
                  onClick={() => onOpenProModal('Banque complète de 50+ tests techniques corrigés pas à pas.')}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Crown className="w-4 h-4 text-amber-300" />
                  <span>Débloquer les 50+ questions Pro</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
