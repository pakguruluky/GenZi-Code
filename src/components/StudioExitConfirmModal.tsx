import React, { useEffect } from 'react';
import {
  AlertTriangle,
  Code2,
  Save,
  ArrowRight,
  X,
  Laptop,
  CheckCircle2,
  LogOut
} from 'lucide-react';

interface StudioExitConfirmModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  targetDestination?: string;
  activeStudioName?: string;
  isSwitchingStudio?: boolean;
}

export const StudioExitConfirmModal: React.FC<StudioExitConfirmModalProps> = ({
  isOpen,
  onCancel,
  onConfirm,
  targetDestination = 'halaman lain',
  activeStudioName = 'Studio Coding',
  isSwitchingStudio = false
}) => {
  // Handle ESC key to cancel & keep user safe
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="studio-exit-title"
    >
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative overflow-hidden transition-all transform scale-100"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Accent Stripe */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-rose-500 to-amber-600" />

        {/* Close Button Top Right */}
        <button
          onClick={onCancel}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Batal & Tetap di Studio"
          aria-label="Tutup dialog konfirmasi"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-200 dark:border-amber-800/80 shadow-xs">
            <AlertTriangle className="w-6 h-6 sm:w-7 sm:h-7 animate-pulse" />
          </div>

          <div className="flex-1 pr-6">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 mb-1.5">
              <Laptop className="w-3 h-3" />
              <span>Konfirmasi Keluar Studio</span>
            </div>

            <h2
              id="studio-exit-title"
              className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-tight"
            >
              {isSwitchingStudio ? 'Beralih ke Studio Lain?' : 'Tutup Tab Studio Coding?'}
            </h2>
          </div>
        </div>

        {/* Main Alert Message */}
        <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300 mb-5 leading-relaxed">
          <p>
            Kamu sedang membuka <strong className="text-slate-900 dark:text-white">{activeStudioName}</strong>.
            Jika kamu {isSwitchingStudio ? 'beralih ke studio lain' : 'menutup tab ini'} menuju <strong className="text-indigo-600 dark:text-indigo-400">{targetDestination}</strong>,
            seluruh susunan blok visual atau script kode yang <strong>belum disimpan atau diekspor</strong> dapat hilang secara tidak sengaja.
          </p>

          {/* Tips Box */}
          <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-200">
              <Save className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>Tips Sebelum Menutup Studio:</span>
            </div>
            <ul className="text-amber-800 dark:text-amber-300/90 space-y-1 pl-6 list-disc">
              <li>
                Gunakan tombol <strong>Simpan ke Cloud</strong> atau <strong>Unduh Proyek (.sb3)</strong> jika ingin melanjutkannya di lain waktu.
              </li>
              <li>
                Jika hanya ingin memeriksa materi, kamu bisa membuka GenZi Code di tab browser terpisah.
              </li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          {/* Primary Action: Stay in Studio (Safest Choice) */}
          <button
            onClick={onCancel}
            autoFocus
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-950 transition-all flex items-center justify-center gap-2 cursor-pointer order-1 sm:order-2"
          >
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span>Batal & Tetap di Studio</span>
          </button>

          {/* Secondary Action: Confirm Exit */}
          <button
            onClick={onConfirm}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-sm font-semibold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 dark:hover:bg-rose-950/40 dark:hover:text-rose-300 dark:hover:border-rose-800 transition-colors flex items-center justify-center gap-2 cursor-pointer order-2 sm:order-1"
          >
            <LogOut className="w-4 h-4 text-rose-500" />
            <span>{isSwitchingStudio ? 'Ya, Beralih Studio' : 'Ya, Tutup Tab Studio'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
