import React, { useState } from 'react';
import { Material, ModuleQuiz } from '../types';
import { getQuizForMaterial } from '../data/quizData';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  Sparkles,
  RotateCcw,
  Award,
  ArrowRight,
  Zap,
  BookOpen
} from 'lucide-react';

interface ModuleQuizCardProps {
  material: Material;
  onQuizPassed?: () => void;
}

export const ModuleQuizCard: React.FC<ModuleQuizCardProps> = ({
  material,
  onQuizPassed
}) => {
  const { currentUser, submitModuleQuiz, completeMaterial, showToast } = useApp();
  const quiz: ModuleQuiz = getQuizForMaterial(material);

  // Check if previously passed
  const previousResult = currentUser?.completedQuizzes?.[material.id];
  const isAlreadyCompleted = currentUser?.completedMaterialIds?.includes(material.id);

  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(!!previousResult);
  const [lastScore, setLastScore] = useState<number>(previousResult?.score ?? (isAlreadyCompleted ? 100 : 0));
  const [showExplanation, setShowExplanation] = useState<boolean>(!!previousResult);

  const allAnswered = quiz.questions.every(q => selectedAnswers[q.id] !== undefined);

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleSubmitQuiz = async () => {
    if (!allAnswered) return;

    let correctCount = 0;
    quiz.questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correctCount++;
      }
    });

    const calculatedScore = Math.round((correctCount / quiz.questions.length) * 100);
    setLastScore(calculatedScore);
    setIsSubmitted(true);
    setShowExplanation(true);

    const isPassed = calculatedScore >= quiz.passingScore;

    if (isPassed) {
      // Trigger confetti celebration
      try {
        confetti({
          particleCount: 75,
          spread: 70,
          origin: { y: 0.7 }
        });
      } catch {
        // ignore
      }

      if (submitModuleQuiz) {
        await submitModuleQuiz(material.id, calculatedScore, quiz.questions.length);
      } else {
        await completeMaterial(material.id);
      }

      if (onQuizPassed) {
        onQuizPassed();
      }
    } else {
      showToast({
        title: 'Coba Lagi!',
        message: `Skor kamu ${calculatedScore}%. Perlu minimal ${quiz.passingScore}% untuk lulus.`,
        type: 'info'
      });
    }
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setShowExplanation(false);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/50 dark:from-slate-800/80 dark:via-slate-900 dark:to-indigo-950/40 rounded-2xl p-5 sm:p-6 border border-indigo-200/80 dark:border-indigo-800/60 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-indigo-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200 dark:shadow-indigo-950 shrink-0">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-100/70 dark:bg-indigo-950/70 px-2 py-0.5 rounded-full">
                Uji Pemahaman Siswa
              </span>
              <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 fill-amber-500" />
                +{quiz.xpReward} XP
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-0.5">
              {quiz.title}
            </h3>
          </div>
        </div>

        {isSubmitted && (
          <div className="flex items-center gap-2">
            <div
              className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 border ${
                lastScore >= quiz.passingScore
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                  : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-700'
              }`}
            >
              {lastScore >= quiz.passingScore ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-600" />
              )}
              <span>Nilai: {lastScore}% ({lastScore >= quiz.passingScore ? 'LULUS' : 'BELUM LULUS'})</span>
            </div>

            <button
              onClick={handleRetake}
              className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1"
              title="Ulangi Kuis"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ulangi</span>
            </button>
          </div>
        )}
      </div>

      {/* Questions list */}
      <div className="mt-5 space-y-6">
        {quiz.questions.map((q, qIndex) => {
          const userAnswer = selectedAnswers[q.id];
          const hasAnswered = userAnswer !== undefined;
          const isCorrect = isSubmitted && userAnswer === q.correctIndex;
          const isWrong = isSubmitted && hasAnswered && userAnswer !== q.correctIndex;

          return (
            <div
              key={q.id}
              className="bg-white dark:bg-slate-800/80 rounded-xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-700 shadow-2xs space-y-3"
            >
              <div className="flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-black flex items-center justify-center shrink-0 mt-0.5 border border-indigo-200 dark:border-indigo-800">
                  {qIndex + 1}
                </span>
                <p className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 leading-snug">
                  {q.question}
                </p>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 gap-2 pl-0 sm:pl-8 pt-1">
                {q.options.map((opt, optIdx) => {
                  const isSelected = userAnswer === optIdx;
                  let optStyle =
                    'border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300';

                  if (isSubmitted) {
                    if (optIdx === q.correctIndex) {
                      optStyle =
                        'border-emerald-400 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-200 font-bold';
                    } else if (isSelected && optIdx !== q.correctIndex) {
                      optStyle =
                        'border-rose-400 dark:border-rose-600 bg-rose-50 dark:bg-rose-950/70 text-rose-900 dark:text-rose-200';
                    } else {
                      optStyle = 'opacity-50 border-slate-200 dark:border-slate-800 text-slate-400';
                    }
                  } else if (isSelected) {
                    optStyle =
                      'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/80 text-indigo-900 dark:text-indigo-100 font-bold shadow-xs';
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={isSubmitted}
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm transition-all flex items-start gap-2.5 ${optStyle}`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 border ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'border-slate-300 dark:border-slate-600 text-slate-500'
                        }`}
                      >
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="flex-1 leading-relaxed">{opt}</span>

                      {isSubmitted && optIdx === q.correctIndex && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 ml-1" />
                      )}
                      {isSubmitted && isSelected && optIdx !== q.correctIndex && (
                        <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 ml-1" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Box when submitted */}
              {showExplanation && (
                <div className="mt-2.5 pl-0 sm:pl-8">
                  <div
                    className={`p-3 rounded-xl text-xs leading-relaxed border ${
                      isCorrect
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                        : 'bg-amber-50/70 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                    }`}
                  >
                    <strong className="block mb-0.5">Penjelasan Konsep:</strong>
                    {q.explanation}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Submit & Status */}
      <div className="mt-6 pt-4 border-t border-indigo-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-slate-500 dark:text-slate-400">
          {!isSubmitted ? (
            <span>
              Jawab seluruh pertanyaan di atas lalu klik tombol periksa untuk menguji pemahaman Anda.
            </span>
          ) : lastScore >= quiz.passingScore ? (
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              Selamat! Pemahaman modul ini telah teruji dan modul berikutnya terbuka!
            </span>
          ) : (
            <span className="text-rose-600 dark:text-rose-400 font-semibold">
              Skor Anda belum mencapai ambang batas {quiz.passingScore}%. Silakan pelajari kembali modul dan klik Ulangi.
            </span>
          )}
        </div>

        {!isSubmitted && (
          <button
            type="button"
            disabled={!allAnswered}
            onClick={handleSubmitQuiz}
            className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xs ${
              allAnswered
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-md cursor-pointer'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Periksa Jawaban & Klaim XP</span>
          </button>
        )}
      </div>
    </div>
  );
};
