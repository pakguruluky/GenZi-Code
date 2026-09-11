import React from 'react';
import {
  History,
  CheckCircle2,
  Video,
  Award,
  Sparkles,
  ArrowRight,
  BookOpen,
  Clock,
  Zap,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StudentActivity } from '../types';
import { ALL_MATERIALS } from '../data/curriculumData';

interface RecentActivitiesWidgetProps {
  onOpenAuth: (tab?: 'login' | 'register' | 'trial' | 'admin') => void;
  onNavigateToMaterials: () => void;
  onNavigateToOnlineClass?: () => void;
}

export const RecentActivitiesWidget: React.FC<RecentActivitiesWidgetProps> = ({
  onOpenAuth,
  onNavigateToMaterials,
  onNavigateToOnlineClass
}) => {
  const { currentUser, getStudentRecentActivities, openMaterial } = useApp();

  const activities: StudentActivity[] = currentUser
    ? getStudentRecentActivities(currentUser)
    : [];

  // Helper untuk memformat waktu secara ramah (Bahasa Indonesia)
  const formatTimeAgo = (isoString: string): string => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffSecs = Math.max(0, Math.floor(diffMs / 1000));
      const diffMins = Math.floor(diffSecs / 60);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffSecs < 60) return 'Baru saja';
      if (diffMins < 60) return `${diffMins} menit yang lalu`;
      if (diffHours < 24) return `${diffHours} jam yang lalu`;
      if (diffDays === 1) return 'Kemarin';
      if (diffDays < 7) return `${diffDays} hari yang lalu`;

      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return 'Beberapa waktu lalu';
    }
  };

  // Ikon dan warna berdasarkan tipe aktivitas
  const getActivityStyle = (activity: StudentActivity) => {
    switch (activity.type) {
      case 'module_completed':
        return {
          icon: CheckCircle2,
          bgColor: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400',
          badgeText: 'Modul Tuntas',
          badgeColor: 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300'
        };
      case 'class_attended':
        return {
          icon: Video,
          bgColor: 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400',
          badgeText: 'Kelas Online',
          badgeColor: 'bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300'
        };
      case 'quiz_passed':
        return {
          icon: Sparkles,
          bgColor: 'bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400',
          badgeText: 'Kuis Lulus',
          badgeColor: 'bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-300'
        };
      case 'badge_earned':
      default:
        return {
          icon: Award,
          bgColor: 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400',
          badgeText: 'Pencapaian',
          badgeColor: 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300'
        };
    }
  };

  const handleActivityClick = (act: StudentActivity) => {
    if (act.type === 'class_attended' && onNavigateToOnlineClass) {
      onNavigateToOnlineClass();
      return;
    }

    if (act.metadata?.materialId) {
      const mat = ALL_MATERIALS.find(m => m.id === act.metadata?.materialId);
      if (mat) {
        openMaterial(mat);
        return;
      }
    }

    onNavigateToMaterials();
  };

  return (
    <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
      {/* Header Widget */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 shadow-xs">
            <History className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                Aktivitas Terakhir
              </h3>
              <span className="px-2 py-0.5 text-[11px] font-extrabold rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                5 Aksi Terkini
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {currentUser
                ? `Riwayat modul selesai dan sesi kelas terbaru untuk ${currentUser.name}`
                : 'Pantau rekam jejak penyelesaian modul dan partisipasi kelas online siswa'}
            </p>
          </div>
        </div>

        {currentUser ? (
          <button
            onClick={onNavigateToMaterials}
            className="self-start sm:self-auto text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
          >
            <span>Buka Silabus Modul</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            onClick={() => onOpenAuth('login')}
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <span>Masuk untuk Rekam Jejak</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Konten Daftar Aktivitas */}
      {!currentUser ? (
        <div className="py-8 text-center max-w-lg mx-auto space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <BookOpen className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
            Masuk Akun untuk Melihat Rekam Jejak Belajar
          </h4>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Sistem GenZi Code secara otomatis mencatat setiap modul yang kamu selesaikan, perolehan skor kuis, sertifikat yang diraih, hingga sesi tatap muka online Zoom & Google Meet yang kamu ikuti.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={() => onOpenAuth('login')}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all"
            >
              Masuk Akun Siswa
            </button>
            <button
              onClick={() => onOpenAuth('register')}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-all"
            >
              Daftar Baru
            </button>
          </div>
        </div>
      ) : activities.length === 0 ? (
        <div className="py-10 text-center max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-500 flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
            Belum Ada Aktivitas yang Tercatat
          </h4>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Mulai petualangan belajarmu sekarang! Selesaikan Modul #01 atau ikuti kelas online perdanamu.
          </p>
          <button
            onClick={onNavigateToMaterials}
            className="mt-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all inline-flex items-center gap-2"
          >
            <span>Mulai Modul Pertama</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {activities.map((act, index) => {
            const style = getActivityStyle(act);
            const IconComponent = style.icon;

            return (
              <div
                key={act.id || `act-${index}`}
                onClick={() => handleActivityClick(act)}
                className="group relative flex items-start gap-3.5 sm:gap-4 p-3.5 sm:p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 border border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-300 dark:hover:border-indigo-800/80 transition-all cursor-pointer"
              >
                {/* Activity Icon Badge */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border shadow-2xs transition-transform group-hover:scale-105 ${style.bgColor}`}
                >
                  <IconComponent className="w-5 h-5" />
                </div>

                {/* Main Activity Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${style.badgeColor}`}
                    >
                      {style.badgeText}
                    </span>

                    {act.metadata?.category && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {act.metadata.category}
                      </span>
                    )}

                    {act.metadata?.platform && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 uppercase">
                        {act.metadata.platform}
                      </span>
                    )}

                    {act.metadata?.score !== undefined && (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-300">
                        Skor: {act.metadata.score}%
                      </span>
                    )}

                    <div className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500 ml-auto">
                      <Clock className="w-3 h-3" />
                      <span>{formatTimeAgo(act.timestamp)}</span>
                    </div>
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
                    {act.title}
                  </h4>

                  {act.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                      {act.description}
                    </p>
                  )}
                </div>

                {/* Reward XP or Action Arrow */}
                <div className="shrink-0 self-center pl-1 flex items-center gap-2">
                  {act.xpGained && act.xpGained > 0 && (
                    <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-100 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-black">
                      <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                      +{act.xpGained} XP
                    </span>
                  )}
                  <div className="w-7 h-7 rounded-lg text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all flex items-center justify-center">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
