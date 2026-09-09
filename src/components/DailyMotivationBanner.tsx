import React, { useState, useEffect } from 'react';
import { Sparkles, Flame, Clock, ArrowRight, X, HeartHandshake, Compass, CheckCircle2 } from 'lucide-react';
import { UserAccount } from '../types';
import { useApp } from '../context/AppContext';
import { ALL_MATERIALS } from '../data/curriculumData';

interface DailyMotivationBannerProps {
  user: UserAccount;
  onNavigateToMaterials: () => void;
}

const MOTIVATION_QUOTES = [
  'Konsistensi 15 menit belajar koding setiap hari jauh lebih dahsyat daripada berjam-jam dalam satu malam!',
  'Setiap error dan tantangan dalam menyusun blok kode adalah langkah maju menjadi programmer andal.',
  'Dunia digital masa depan diciptakan oleh mereka yang berani menulis baris kode hari ini.',
  'Logika koding melatih otak berpikir runtut, analitis, dan pantang menyerah.',
  'Game dan AI hebat yang kita nikmati hari ini dimulai dari algoritma paling sederhana.'
];

export const DailyMotivationBanner: React.FC<DailyMotivationBannerProps> = ({
  user,
  onNavigateToMaterials
}) => {
  const { openMaterial } = useApp();
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const [hoursAway, setHoursAway] = useState<number | null>(null);

  useEffect(() => {
    // Cek apakah notifikasi hari ini sudah di-dismiss
    const dismissKey = `genzi_dismiss_motivation_${user.id}_${new Date().toDateString()}`;
    if (localStorage.getItem(dismissKey) === 'true') {
      setIsDismissed(true);
      return;
    }

    // Hitung waktu sejak login sebelumnya
    const prevLogin = user.previousLoginAt || localStorage.getItem(`genzi_prev_login_stamp_${user.id}`);
    if (prevLogin) {
      const prevDate = new Date(prevLogin).getTime();
      const now = Date.now();
      const diffHours = Math.floor((now - prevDate) / (1000 * 60 * 60));
      if (diffHours >= 24) {
        setHoursAway(diffHours);
      }
    } else {
      // Jika akun baru saja didaftarkan kemarin atau hari sebelumnya
      if (user.registeredAt) {
        const regDate = new Date(user.registeredAt).getTime();
        const diffHours = Math.floor((Date.now() - regDate) / (1000 * 60 * 60));
        if (diffHours >= 24) {
          setHoursAway(diffHours);
        }
      }
    }
  }, [user]);

  // Jika belum lebih dari 24 jam atau sudah di-dismiss, tidak tampil
  if (hoursAway === null || isDismissed) {
    return null;
  }

  const handleDismiss = () => {
    const dismissKey = `genzi_dismiss_motivation_${user.id}_${new Date().toDateString()}`;
    localStorage.setItem(dismissKey, 'true');
    setIsDismissed(true);
  };

  // Pilih kutipan motivasi harian berdasarkan tanggal
  const dayIndex = new Date().getDate() % MOTIVATION_QUOTES.length;
  const dailyQuote = MOTIVATION_QUOTES[dayIndex];

  // Cari modul berikutnya yang belum selesai
  const completedIds = user.completedMaterialIds || [];
  const nextMaterial = ALL_MATERIALS.find(m => !completedIds.includes(m.id)) || ALL_MATERIALS[0];

  return (
    <div className="relative rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-0.5 shadow-lg animate-fade-in my-3">
      <div className="rounded-[15px] bg-white dark:bg-slate-900 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Content */}
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-[11px] font-extrabold border border-amber-300 dark:border-amber-700">
                <Clock className="w-3 h-3" />
                <span>Terakhir Masuk: {hoursAway} Jam yang Lalu</span>
              </span>

              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-600 dark:text-orange-400">
                <Sparkles className="w-3 h-3" />
                <span>Misi Semangat Harian</span>
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
              Selamat datang kembali, {user.name}! Saatnya sambung api kodingmu 🔥
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              "{dailyQuote}" Sudah lebih dari 24 jam sejak sesi belajarmu kemarin. Yuk luangkan waktu sejenak hari ini untuk menuntaskan minimal 1 modul koding!
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
          <button
            onClick={() => {
              if (nextMaterial) {
                openMaterial(nextMaterial);
              } else {
                onNavigateToMaterials();
              }
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5 active:scale-95"
          >
            <span>Mulai Modul #{nextMaterial.sequence}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleDismiss}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Tutup notifikasi hari ini"
            aria-label="Tutup notifikasi"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
