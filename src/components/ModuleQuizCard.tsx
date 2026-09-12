import React, { useState } from 'react';
import { Material, ModuleQuiz } from '../types';
import { getQuizForMaterial } from '../data/quizData';
import { ALL_MATERIALS } from '../data/curriculumData';
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
  BookOpen,
  Check,
  ShieldCheck,
  Lock,
  CloudCheck
} from 'lucide-react';

interface ModuleQuizCardProps {
  material: Material;
  onQuizPassed?: () => void;
  onNavigateNextMaterial?: (nextMat: Material) => void;
}

export const ModuleQuizCard: React.FC<ModuleQuizCardProps> = ({
  material,
  onQuizPassed,
  onNavigateNextMaterial
}) => {
  const { currentUser, submitModuleQuiz, openMaterial, showToast } = useApp();
  const quiz: ModuleQuiz = getQuizForMaterial(material);

  // Status sebelumnya dari akun pengguna di database
  const previousResult = currentUser?.completedQuizzes?.[material.id];
  const isAlreadyCompleted = currentUser?.completedMaterialIds?.includes(material.id);

  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(!!previousResult);
  const [lastScore, setLastScore] = useState<number>(
    previousResult?.score ?? (isAlreadyCompleted ? 100 : 0)
  );
  const [showExplanation, setShowExplanation] = useState<boolean>(!!previousResult);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const answeredCount = Object.keys(selectedAnswers).length;
  const totalQuestions = quiz.questions.length;
  const allAnswered = totalQuestions > 0 && answeredCount === totalQuestions;

  // Temukan modul berikutnya jika ada
  const nextMaterial = ALL_MATERIALS.find(m => m.sequence === material.sequence + 1);

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleSubmitQuiz = async () => {
    if (!allAnswered || isSubmitting) return;

    setIsSubmitting(true);
    let correctCount = 0;
    quiz.questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correctCount++;
      }
    });

    const calculatedScore = Math.round((correctCount / totalQuestions) * 100);
    setLastScore(calculatedScore);
    setIsSubmitted(true);
    setShowExplanation(true);

    const isPassed = calculatedScore >= quiz.passingScore;

    if (isPassed) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.65 }
        });
      } catch {
        // ignore
      }

      if (submitModuleQuiz) {
        await submitModuleQuiz(material.id, calculatedScore, totalQuestions);
      }

      if (onQuizPassed) {
        onQuizPassed();
      }
    } else {
      showToast({
        title: 'Post Test Belum Lulus',
        message: `Skor kamu ${calculatedScore}%. Nilai kelulusan minimal adalah ${quiz.passingScore}%. Silakan pelajari kembali modul lalu klik tombol Ulangi Post Test.`,
        type: 'info'
      });
    }

    setIsSubmitting(false);
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setShowExplanation(false);
  };

  const isPassedStatus = isSubmitted && lastScore >= quiz.passingScore;

  return (
    <div
      id="post-test-section"
      className="bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/60 dark:from-slate-800/90 dark:via-slate-900 dark:to-indigo-950/50 rounded-2xl p-5 sm:p-7 border-2 border-indigo-200 dark:border-indigo-800/80 shadow-sm transition-all"
    >
      {/* Header Post Test */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-indigo-100 dark:border-slate-800">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200 dark:shadow-indigo-950 shrink-0">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-950/80 px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
                Post Test Modul #{material.sequence}
              </span>
              <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                +{quiz.xpReward} XP Reward
              </span>
              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                {totalQuestions} Soal Pilihan Ganda
              </span>
              <span className="text-[11px] font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 px-2.5 py-0.5 rounded-full border border-rose-200 dark:border-rose-800">
                Syarat Lulus: {quiz.passingScore}%
              </span>
            </div>
            <h3 className="text-base sm:text-xl font-black text-slate-900 dark:text-white leading-tight">
              {quiz.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Selesaikan evaluasi pemahaman ini untuk memvalidasi kompetensi, menambah poin XP, dan membuka jenjang modul berikutnya.
            </p>
          </div>
        </div>

        {/* Status Nilai / Badge Hasil */}
        {isSubmitted && (
          <div className="flex items-center gap-2 self-start sm:self-center">
            <div
              className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-2 border shadow-xs ${
                isPassedStatus
                  ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700'
                  : 'bg-rose-50 dark:bg-rose-950/80 text-rose-800 dark:text-rose-200 border-rose-300 dark:border-rose-700'
              }`}
            >
              {isPassedStatus ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              )}
              <div className="flex flex-col">
                <span>Nilai: {lastScore}% ({isPassedStatus ? 'LULUS' : 'BELUM LULUS'})</span>
                <span className="text-[10px] font-normal opacity-90">
                  {isPassedStatus ? 'Tersimpan ke Database' : `Min. ${quiz.passingScore}%`}
                </span>
              </div>
            </div>

            <button
              onClick={handleRetake}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 shadow-2xs"
              title="Ulangi Post Test"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Ulangi</span>
            </button>
          </div>
        )}
      </div>

      {/* Progress Jawaban Saat Mengerjakan */}
      {!isSubmitted && (
        <div className="mt-4 p-3 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700 dark:text-slate-300">
              Progres Pengerjaan:
            </span>
            <span className="font-extrabold text-indigo-600 dark:text-indigo-400">
              {answeredCount} dari {totalQuestions} Soal Terjawab
            </span>
          </div>
          <div className="w-full sm:w-48 bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
            <div
              className="bg-indigo-600 h-2 transition-all duration-300 rounded-full"
              style={{ width: `${Math.round((answeredCount / (totalQuestions || 1)) * 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Daftar Pertanyaan Post Test (5 - 10 Soal Pilihan Ganda) */}
      <div className="mt-6 space-y-6">
        {quiz.questions.map((q, qIndex) => {
          const userAnswer = selectedAnswers[q.id];
          const hasAnswered = userAnswer !== undefined;
          const isCorrect = isSubmitted && userAnswer === q.correctIndex;

          return (
            <div
              key={q.id}
              className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700 shadow-2xs space-y-3 transition-all"
            >
              {/* Soal Header */}
              <div className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 text-xs font-black flex items-center justify-center shrink-0 mt-0.5 border border-indigo-200 dark:border-indigo-800">
                  {qIndex + 1}
                </span>
                <p className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 leading-snug">
                  {q.question}
                </p>
              </div>

              {/* Opsi Pilihan Ganda A, B, C, D */}
              <div className="grid grid-cols-1 gap-2.5 pl-0 sm:pl-10 pt-1">
                {q.options.map((opt, optIdx) => {
                  const isSelected = userAnswer === optIdx;
                  let optStyle =
                    'border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300';

                  if (isSubmitted) {
                    if (optIdx === q.correctIndex) {
                      optStyle =
                        'border-emerald-500 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-950/70 text-emerald-950 dark:text-emerald-200 font-bold shadow-xs';
                    } else if (isSelected && optIdx !== q.correctIndex) {
                      optStyle =
                        'border-rose-400 dark:border-rose-600 bg-rose-50 dark:bg-rose-950/70 text-rose-950 dark:text-rose-200 font-semibold';
                    } else {
                      optStyle = 'opacity-40 border-slate-200 dark:border-slate-800 text-slate-400';
                    }
                  } else if (isSelected) {
                    optStyle =
                      'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/90 text-indigo-950 dark:text-indigo-100 font-bold shadow-xs ring-1 ring-indigo-500/40';
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={isSubmitted}
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      className={`w-full text-left px-4 py-3 rounded-xl border text-xs sm:text-sm transition-all flex items-start gap-3 ${optStyle} ${
                        !isSubmitted ? 'cursor-pointer' : 'cursor-default'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 border ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'border-slate-300 dark:border-slate-600 text-slate-500 bg-white dark:bg-slate-800'
                        }`}
                      >
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="flex-1 leading-relaxed">{opt}</span>

                      {isSubmitted && optIdx === q.correctIndex && (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 shrink-0 ml-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span className="hidden sm:inline">Kunci Benar</span>
                        </span>
                      )}
                      {isSubmitted && isSelected && optIdx !== q.correctIndex && (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-rose-600 dark:text-rose-400 shrink-0 ml-1">
                          <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                          <span className="hidden sm:inline">Pilihan Anda</span>
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Kotak Penjelasan Edukatif saat Hasil Keluar */}
              {showExplanation && (
                <div className="mt-3 pl-0 sm:pl-10">
                  <div
                    className={`p-3.5 rounded-xl text-xs leading-relaxed border ${
                      isCorrect
                        ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                        : 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-950 dark:text-amber-200'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold mb-1">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Penjelasan & Telaah Konsep:</span>
                    </div>
                    <p>{q.explanation}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Tombol Submit / Navigasi Modul Berikutnya */}
      <div className="mt-7 pt-5 border-t border-indigo-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-slate-500 dark:text-slate-400">
          {!isSubmitted ? (
            <span>
              {allAnswered
                ? 'Semua soal telah terjawab. Klik "Kirim Jawaban & Selesaikan Post Test" untuk memverifikasi nilai dan menyimpan ke backend.'
                : `Masih ada ${totalQuestions - answeredCount} soal yang belum Anda jawab.`}
            </span>
          ) : isPassedStatus ? (
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-semibold">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>
                Hebat! Post Test Modul #{material.sequence} tuntas. Data dan capaian XP tersimpan di Cloud Database.
              </span>
            </div>
          ) : (
            <span className="text-rose-600 dark:text-rose-400 font-semibold">
              Nilai Anda {lastScore}%. Belum memenuhi syarat kelulusan minimal {quiz.passingScore}%. Silakan klik tombol Ulangi di atas.
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {!isSubmitted ? (
            <button
              type="button"
              disabled={!allAnswered || isSubmitting}
              onClick={handleSubmitQuiz}
              className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xs ${
                allAnswered && !isSubmitting
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-md cursor-pointer'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Menyimpan ke Database...' : 'Kirim Jawaban & Selesaikan Post Test'}</span>
            </button>
          ) : isPassedStatus && nextMaterial ? (
            <button
              type="button"
              onClick={() => {
                if (onNavigateNextMaterial) {
                  onNavigateNextMaterial(nextMaterial);
                } else if (openMaterial) {
                  openMaterial(nextMaterial);
                }
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-black text-xs sm:text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg cursor-pointer"
            >
              <span>Lanjut ke Modul #{nextMaterial.sequence}: {nextMaterial.title.substring(0, 24)}...</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};
