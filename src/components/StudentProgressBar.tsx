import React from 'react';
import {
  Trophy,
  Sparkles,
  Flame,
  Rocket,
  CheckCircle2,
  ArrowRight,
  Code2,
  Cpu,
  Bot,
  Award,
  BookOpen,
  FileSpreadsheet,
  Lock,
  Zap,
  TrendingUp
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ALL_MATERIALS } from '../data/curriculumData';

interface StudentProgressBarProps {
  onOpenAuth: (tab?: 'login' | 'register' | 'trial' | 'admin') => void;
  onNavigateToMaterials: () => void;
}

export const StudentProgressBar: React.FC<StudentProgressBarProps> = ({
  onOpenAuth,
  onNavigateToMaterials
}) => {
  const {
    currentUser,
    getCompletionPercentage,
    openMaterial,
    setViewingReportUser,
    setViewingCertificateUser
  } = useApp();

  const totalMaterials = ALL_MATERIALS.length || 54;

  // Jika sudah login
  const completedIds = currentUser?.completedMaterialIds || [];
  const completedCount = completedIds.length;
  const percentage = currentUser ? getCompletionPercentage(currentUser) : 0;

  // Rincian per kategori
  const scratchMaterials = ALL_MATERIALS.filter(m => m.category === 'Scratch');
  const scratchCompleted = scratchMaterials.filter(m => completedIds.includes(m.id)).length;
  const scratchPct = scratchMaterials.length > 0 ? Math.round((scratchCompleted / scratchMaterials.length) * 100) : 0;

  const microbitMaterials = ALL_MATERIALS.filter(m => m.category === 'Microbit');
  const microbitCompleted = microbitMaterials.filter(m => completedIds.includes(m.id)).length;
  const microbitPct = microbitMaterials.length > 0 ? Math.round((microbitCompleted / microbitMaterials.length) * 100) : 0;

  const pictobloxMaterials = ALL_MATERIALS.filter(m => m.category === 'Pictoblox');
  const pictobloxCompleted = pictobloxMaterials.filter(m => completedIds.includes(m.id)).length;
  const pictobloxPct = pictobloxMaterials.length > 0 ? Math.round((pictobloxCompleted / pictobloxMaterials.length) * 100) : 0;

  // Temukan modul berikutnya yang belum selesai
  const nextMaterial = ALL_MATERIALS.find(m => !completedIds.includes(m.id)) || ALL_MATERIALS[0];

  // Pesan motivasi visual dinamis berdasarkan persentase
  const getMotivationDetails = (pct: number) => {
    if (pct === 0) {
      return {
        badge: 'Langkah Pertama Menuju Master Coding',
        badgeColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
        quote: 'Setiap programmer hebat memulainya dari baris kode pertama. Selesaikan Modul #01 dan raih XP perdanmu!',
        accentGradient: 'from-indigo-600 via-purple-600 to-indigo-700',
        barColor: 'from-indigo-500 to-purple-600',
        icon: Rocket,
        iconColor: 'text-indigo-600 dark:text-indigo-400',
        levelLabel: 'Pemula Digital (Level 1)'
      };
    }
    if (pct <= 33) {
      return {
        badge: 'Fase Fondasi: Logika Scratch Terbuka!',
        badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-800',
        quote: 'Kerja bagus! Logika komputasi dan kreativitas game-mu semakin terbentuk tajam. Terus selesaikan proyek berikutnya!',
        accentGradient: 'from-amber-600 via-orange-600 to-amber-700',
        barColor: 'from-amber-500 via-orange-500 to-amber-600',
        icon: Flame,
        iconColor: 'text-amber-500',
        levelLabel: 'Game Maker Apprentice (Level 2)'
      };
    }
    if (pct <= 66) {
      return {
        badge: 'Fase Menengah: Penjelajah IoT & Robotika!',
        badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
        quote: 'Luar biasa! Kamu sudah melampaui logika dasar dan kini menguasai simulator sirkuit pintar BBC Micro:bit!',
        accentGradient: 'from-emerald-600 via-teal-600 to-emerald-700',
        barColor: 'from-emerald-500 via-teal-500 to-emerald-600',
        icon: Cpu,
        iconColor: 'text-emerald-500',
        levelLabel: 'IoT & Hardware Specialist (Level 3)'
      };
    }
    if (pct < 100) {
      return {
        badge: 'Fase Mahir: Pengembang Artificial Intelligence!',
        badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border-blue-200 dark:border-blue-800',
        quote: 'Hampir di puncak garis akhir! Kamu sedang melatih model Machine Learning dan Visi Komputer masa depan.',
        accentGradient: 'from-blue-600 via-indigo-600 to-purple-700',
        barColor: 'from-blue-500 via-indigo-500 to-purple-600',
        icon: Bot,
        iconColor: 'text-blue-500',
        levelLabel: 'AI & Machine Learning Innovator (Level 4)'
      };
    }
    return {
      badge: '🏆 KELULUSAN SEMPURNA 100%!',
      badgeColor: 'bg-amber-100 text-amber-900 dark:bg-amber-950/90 dark:text-amber-200 border-amber-300 dark:border-amber-700',
      quote: 'Pencapaian bersejarah! Kamu telah menuntaskan seluruh 54 Modul GenZi Code. Cetak Sertifikat Kelulusan & Rapor prestasimu sekarang!',
      accentGradient: 'from-amber-500 via-yellow-500 to-orange-500',
      barColor: 'from-amber-400 via-yellow-400 to-amber-500',
      icon: Trophy,
      iconColor: 'text-amber-500',
      levelLabel: 'Master of GenZi Code (Tamatan Penuh)'
    };
  };

  const motivation = getMotivationDetails(percentage);
  const MotivationIcon = motivation.icon;

  // JIKA PENGGUNA SUDAH LOGIN (Tampilan Personal Siswa)
  if (currentUser) {
    return (
      <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-lg relative overflow-hidden transition-all duration-300">
        {/* Subtle decorative background pattern */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-indigo-500/10 via-purple-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Header Row: Profil Siswa & Persentase Besar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${motivation.badgeColor}`}>
                  <MotivationIcon className="w-3.5 h-3.5" />
                  <span>{motivation.badge}</span>
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {motivation.levelLabel}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Halo, {currentUser.name}! 👋
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl">
                {motivation.quote}
              </p>
            </div>

            {/* Kotak Angka Persentase & Akumulasi XP Siswa */}
            <div className="flex flex-wrap items-center gap-3 shrink-0 self-start md:self-auto">
              {/* Kotak Akumulasi XP Gamifikasi */}
              <div className="flex items-center gap-3 bg-amber-500/10 dark:bg-amber-500/15 p-3 sm:p-4 rounded-2xl border border-amber-300/80 dark:border-amber-700/80 shrink-0 shadow-xs">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shadow-xs">
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6 fill-amber-500 text-amber-500 animate-pulse" />
                </div>
                <div className="text-left">
                  <div className="text-[10px] sm:text-[11px] font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider">
                    Akumulasi XP
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">
                    {currentUser.xp || 0} <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">XP</span>
                  </div>
                </div>
              </div>

              {/* Kotak Angka Persentase Besar */}
              <div className="flex items-center gap-3 sm:gap-4 bg-slate-50 dark:bg-slate-800/80 p-3 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shrink-0">
                <div className="text-right">
                  <div className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Total Kelulusan
                  </div>
                  <div className="text-2xl sm:text-3xl sm:text-4xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-amber-500 bg-clip-text text-transparent">
                    {percentage}%
                  </div>
                </div>

                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
              </div>
            </div>
          </div>

          {/* MAIN PROGRESS BAR (VISUAL UTAMA PENYELESAIAN) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
              <span className="text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Progres Keseluruhan 54 Modul Kurikulum</span>
              </span>
              <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">
                {completedCount} dari {totalMaterials} Modul Selesai ({percentage}%)
              </span>
            </div>

            {/* The Actual Progress Bar Track */}
            <div className="relative w-full h-5 sm:h-6 bg-slate-100 dark:bg-slate-800 rounded-full p-1 border border-slate-200 dark:border-slate-700 overflow-hidden shadow-inner">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${motivation.barColor} transition-all duration-700 ease-out relative shadow-sm`}
                style={{ width: `${Math.max(percentage, 3)}%` }}
              >
                {/* Light shimmer bar effect */}
                <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse" />
              </div>
            </div>

            {/* Milestones markers under bar */}
            <div className="flex items-center justify-between text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 px-1 pt-1">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" /> 0% Mulai
              </span>
              <span className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${percentage >= 33 ? 'bg-amber-500' : 'bg-slate-400'}`} /> 33% Scratch Game
              </span>
              <span className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${percentage >= 66 ? 'bg-emerald-500' : 'bg-slate-400'}`} /> 66% Micro:bit IoT
              </span>
              <span className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${percentage === 100 ? 'bg-amber-500' : 'bg-slate-400'}`} /> 100% Master AI & Sertifikat
              </span>
            </div>
          </div>

          {/* 3 SUB-PROGRESS CARDS (BREAKDOWN 3 PILAR MATERI) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {/* 1. Scratch */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Scratch Game Dev
                  </span>
                </div>
                <span className="text-xs font-black text-amber-600 dark:text-amber-400">
                  {scratchPct}%
                </span>
              </div>

              <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                  style={{ width: `${scratchPct}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>{scratchCompleted} dari {scratchMaterials.length} Modul</span>
                {scratchPct === 100 && (
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Tuntas
                  </span>
                )}
              </div>
            </div>

            {/* 2. Micro:bit */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Micro:bit IoT & Robotika
                  </span>
                </div>
                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                  {microbitPct}%
                </span>
              </div>

              <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                  style={{ width: `${microbitPct}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>{microbitCompleted} dari {microbitMaterials.length} Modul</span>
                {microbitPct === 100 && (
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Tuntas
                  </span>
                )}
              </div>
            </div>

            {/* 3. PictoBlox AI */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    PictoBlox AI & ML
                  </span>
                </div>
                <span className="text-xs font-black text-blue-600 dark:text-blue-400">
                  {pictobloxPct}%
                </span>
              </div>

              <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${pictobloxPct}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>{pictobloxCompleted} dari {pictobloxMaterials.length} Modul</span>
                {pictobloxPct === 100 && (
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Tuntas
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS ROW (LANJUTKAN MATERI ATAU LIHAT RAPOR) */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-3">
              {percentage === 100 ? (
                <button
                  onClick={() => setViewingCertificateUser(currentUser)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs sm:text-sm font-extrabold shadow-md hover:brightness-110 transition-all flex items-center gap-2"
                >
                  <Trophy className="w-4 h-4" />
                  <span>Cetak Sertifikat Kelulusan 100%</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (nextMaterial) {
                      openMaterial(nextMaterial);
                    } else {
                      onNavigateToMaterials();
                    }
                  }}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-extrabold shadow-md shadow-indigo-200 dark:shadow-none transition-all flex items-center gap-2 active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>
                    Lanjutkan Belajar: Modul #{nextMaterial.sequence}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={onNavigateToMaterials}
                className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold transition-colors"
              >
                Buka Peta Materi Lengkap
              </button>
            </div>

            {/* Quick Link to Progress Report Modal */}
            <button
              onClick={() => setViewingReportUser(currentUser)}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Lihat Rapor Akademik Digital →</span>
            </button>
          </div>
        </div>
      </section>
    );
  }

  // JIKA PENGGUNA BELUM LOGIN (Simulasi & Motivasi Visual untuk Mendaftar)
  return (
    <section className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 rounded-3xl border border-indigo-800/50 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Sistem Pemantauan Capaian Siswa Real-time</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Visualisasi Target Kelulusan 54 Modul Belajar
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Setiap siswa yang bergabung memiliki Progress Bar otomatis yang mencatat persentase materi selesai, skor kuis, sertifikat, dan rapor belajar secara terstruktur dari 0% hingga 100%!
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onOpenAuth('register')}
              className="px-5 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 active:scale-95"
            >
              <Rocket className="w-4 h-4 text-amber-300" />
              <span>Mulai Progres Belajarmu</span>
            </button>
          </div>
        </div>

        {/* DEMO PROGRESS BAR UNTUK CALON SISWA */}
        <div className="space-y-2 bg-white/5 p-4 sm:p-5 rounded-2xl border border-white/10 backdrop-blur-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Jalur Prestasi Siswa: Dari Pemula Menjadi Mahir</span>
            </span>
            <span className="text-indigo-300 font-mono">54 Modul Berjenjang</span>
          </div>

          {/* Multi-segmented Gradient Progress Track */}
          <div className="relative w-full h-4 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 via-emerald-500 to-indigo-500 shadow-sm transition-all"
              style={{ width: '100%' }}
            />
          </div>

          {/* 3 Step Milestone Labels */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 text-xs">
            <div className="flex items-start gap-2 p-2.5 rounded-xl bg-white/5 border border-white/5">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                1
              </span>
              <div>
                <span className="font-bold text-white block">0% – 33% Scratch Game</span>
                <span className="text-[11px] text-slate-400">18 Modul Algoritma & Proyek Game 2D</span>
              </div>
            </div>

            <div className="flex items-start gap-2 p-2.5 rounded-xl bg-white/5 border border-white/5">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                2
              </span>
              <div>
                <span className="font-bold text-white block">34% – 66% Micro:bit IoT</span>
                <span className="text-[11px] text-slate-400">18 Modul Simulator Sensor & Robotika</span>
              </div>
            </div>

            <div className="flex items-start gap-2 p-2.5 rounded-xl bg-white/5 border border-white/5">
              <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                3
              </span>
              <div>
                <span className="font-bold text-white block">67% – 100% PictoBlox AI</span>
                <span className="text-[11px] text-slate-400">18 Modul Machine Learning & Sertifikat</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
