import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Sparkles, X, Zap, Award, Info } from 'lucide-react';

export const ToastNotification: React.FC = () => {
  const { toast, hideToast } = useApp();
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!toast) {
      setProgress(100);
      return;
    }

    const duration = toast.duration || 4500;
    const intervalTime = 50;
    const step = (intervalTime / duration) * 100;

    setProgress(100);
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        const next = prev - step;
        return next <= 0 ? 0 : next;
      });
    }, intervalTime);

    const autoDismissTimer = setTimeout(() => {
      hideToast();
    }, duration);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(autoDismissTimer);
    };
  }, [toast, hideToast]);

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.92, transition: { duration: 0.2 } }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[9999] max-w-md w-[calc(100vw-2.5rem)] sm:w-96 pointer-events-auto"
        >
          <div className="relative overflow-hidden rounded-2xl bg-slate-900/95 dark:bg-slate-950/95 text-white border border-emerald-500/40 dark:border-emerald-500/50 shadow-2xl backdrop-blur-md p-4 transition-all">
            {/* Top Glowing Gradient Bar with Progress Countdown */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-400 via-teal-400 to-indigo-400"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'linear' }}
              />
            </div>

            {/* Ambient Background Glow */}
            <div className="absolute -top-12 -right-12 w-28 h-28 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-start gap-3.5 relative z-10 pt-1">
              {/* Icon Container with glowing ring */}
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  {toast.type === 'info' ? (
                    <Info className="w-5 h-5 text-indigo-400" />
                  ) : toast.type === 'badge' ? (
                    <Award className="w-5 h-5 text-amber-400" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  )}
                </div>
                {/* Micro Sparkle Indicator */}
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
              </div>

              {/* Text & Details */}
              <div className="flex-1 min-w-0 pr-6">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <h4 className="text-sm font-bold text-white tracking-tight leading-snug">
                    {toast.title}
                  </h4>
                  {toast.xpGained && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[11px] font-bold tracking-wide animate-pulse">
                      <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
                      +{toast.xpGained} XP
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mt-1 font-normal">
                  {toast.message}
                </p>

                {/* Subtitle / Micro status */}
                <div className="mt-2.5 flex items-center gap-2 text-[10px] text-emerald-400/90 font-semibold">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  <span>Kemajuan belajar berhasil diperbarui otomatis!</span>
                </div>
              </div>

              {/* Manual Close Button */}
              <button
                onClick={hideToast}
                className="absolute top-2.5 right-2.5 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Tutup notifikasi"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
