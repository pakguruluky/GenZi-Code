import React from 'react';
import {
  X,
  Zap,
  Award,
  Trophy,
  Shield,
  Star,
  CheckCircle2,
  Calendar,
  School,
  Clock,
  Sparkles,
  Swords,
  BookOpen,
  FileSpreadsheet,
  Flame,
  User,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ALL_MATERIALS } from '../data/curriculumData';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({ isOpen, onClose }) => {
  const {
    currentUser,
    getCompletionPercentage,
    setViewingCertificateUser,
    setViewingReportUser
  } = useApp();

  if (!isOpen || !currentUser) return null;

  const totalXp = currentUser.xp || 0;
  const completedCount = currentUser.completedMaterialIds?.length || 0;
  const completionPercentage = getCompletionPercentage(currentUser);

  // Level & Rank System calculation based on XP
  const getRankInfo = (xp: number) => {
    if (xp < 200) {
      return {
        level: 1,
        title: 'Novice Coder',
        icon: Sparkles,
        color: 'text-indigo-600 dark:text-indigo-400',
        badgeBg: 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300',
        nextLevelXp: 200,
        currentBaseXp: 0,
        desc: 'Memulai perjalanan koding mandiri'
      };
    }
    if (xp < 500) {
      return {
        level: 2,
        title: 'Junior Developer',
        icon: Flame,
        color: 'text-amber-500',
        badgeBg: 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300',
        nextLevelXp: 500,
        currentBaseXp: 200,
        desc: 'Mulai menguasai logika algoritma & game Scratch'
      };
    }
    if (xp < 1000) {
      return {
        level: 3,
        title: 'Code Knight',
        icon: Swords,
        color: 'text-rose-500',
        badgeBg: 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300',
        nextLevelXp: 1000,
        currentBaseXp: 500,
        desc: 'Ksatria tangguh pemecah labirin dungeon CodeCombat'
      };
    }
    if (xp < 2000) {
      return {
        level: 4,
        title: 'Algorithm Wizard',
        icon: Zap,
        color: 'text-purple-500',
        badgeBg: 'bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300',
        nextLevelXp: 2000,
        currentBaseXp: 1000,
        desc: 'Spesialis IoT, Micro:bit & Kecerdasan Buatan PictoBlox'
      };
    }
    return {
      level: 5,
      title: 'Grandmaster Developer',
      icon: Trophy,
      color: 'text-amber-400',
      badgeBg: 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-amber-400 text-amber-500',
      nextLevelXp: 2000,
      currentBaseXp: 2000,
      desc: 'Penguasa tertinggi seluruh pilar kurikulum GenZi Code!'
    };
  };

  const rank = getRankInfo(totalXp);
  const xpInCurrentTier = totalXp - rank.currentBaseXp;
  const xpNeededInTier = rank.nextLevelXp - rank.currentBaseXp;
  const tierPercentage = rank.level === 5
    ? 100
    : Math.min(100, Math.max(0, Math.round((xpInCurrentTier / xpNeededInTier) * 100)));

  // Badge list data
  const availableBadges = [
    {
      id: 'Langkah Pertama',
      title: 'Langkah Pertama',
      desc: 'Menyelesaikan modul pertama kurikulum',
      icon: Sparkles,
      unlocked: completedCount >= 1,
      color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/60'
    },
    {
      id: 'Penjelajah Kode',
      title: 'Penjelajah Kode',
      desc: 'Menyelesaikan 5 modul materi',
      icon: Flame,
      unlocked: completedCount >= 5,
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/60'
    },
    {
      id: 'Bintang GenZi',
      title: 'Bintang GenZi',
      desc: 'Menyelesaikan 10 modul pembelajaran',
      icon: Star,
      unlocked: completedCount >= 10,
      color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/60'
    },
    {
      id: 'Ksatria CodeCombat',
      title: 'Ksatria CodeCombat',
      desc: 'Mencapai lebih dari 150 XP gamifikasi',
      icon: Swords,
      unlocked: totalXp >= 150,
      color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/60'
    },
    {
      id: 'Master Kurikulum',
      title: 'Master Kurikulum',
      desc: 'Mencapai 100% kelulusan materi',
      icon: Trophy,
      unlocked: completionPercentage === 100,
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Profile Hero */}
        <div className="relative bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-400 to-indigo-500 p-0.5 shadow-xl shrink-0">
                <div className="w-full h-full rounded-2xl bg-slate-900 flex items-center justify-center text-white text-2xl sm:text-3xl font-black">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                    {currentUser.name}
                  </h2>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${rank.badgeBg}`}>
                    <rank.icon className="w-3.5 h-3.5" />
                    <span>Lvl {rank.level} • {rank.title}</span>
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">{currentUser.email}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <School className="w-3.5 h-3.5 text-indigo-400" />
                    {currentUser.school || 'GenZi Code Student'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    {currentUser.duration?.replace('_', ' ') || '3 bulan'}
                  </span>
                </div>
              </div>
            </div>

            {/* Total XP Big Card */}
            <div className="bg-slate-950/60 border border-amber-500/30 rounded-2xl p-4 shrink-0 flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-400/30 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Zap className="w-6 h-6 fill-amber-400 text-amber-400 animate-pulse" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block">
                  Akumulasi XP
                </span>
                <span className="text-2xl sm:text-3xl font-black text-white">
                  {totalXp} <span className="text-xs font-normal text-amber-400">XP</span>
                </span>
              </div>
            </div>
          </div>

          {/* Tier Progress bar */}
          <div className="mt-6 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5 font-medium">
              <span>Progress Menuju Level {rank.level < 5 ? rank.level + 1 : 'MAX'}</span>
              <span className="font-bold text-amber-300">
                {rank.level === 5 ? 'Tier Maksimum Tercapai! 👑' : `${totalXp} / ${rank.nextLevelXp} XP (${tierPercentage}%)`}
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-800/80 rounded-full overflow-hidden border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-300 rounded-full transition-all duration-500"
                style={{ width: `${tierPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-900 dark:text-white">
          {/* Quick Statistics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Modul Tuntas
              </span>
              <span className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-1 block">
                {completedCount} <span className="text-xs font-normal text-slate-400">/ 54</span>
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Kelulusan
              </span>
              <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block">
                {completionPercentage}%
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                XP Tiap Modul
              </span>
              <span className="text-xl font-black text-amber-600 dark:text-amber-400 mt-1 block">
                +100 <span className="text-xs font-normal text-slate-400">XP</span>
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Status Akun
              </span>
              <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 mt-1.5 inline-flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {currentUser.status === 'active' ? 'Aktif' : 'Trial'}
              </span>
            </div>
          </div>

          {/* Badges & Achievements Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                Koleksi Lencana Penghargaan (Badges)
              </h3>
              <span className="text-xs text-slate-500">
                {availableBadges.filter(b => b.unlocked).length} dari {availableBadges.length} Terbuka
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {availableBadges.map(b => (
                <div
                  key={b.id}
                  className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${
                    b.unlocked
                      ? 'bg-slate-50 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 shadow-xs'
                      : 'bg-slate-100/60 dark:bg-slate-800/20 border-slate-200/50 dark:border-slate-800 opacity-60'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${b.color}`}>
                    <b.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold truncate">{b.title}</h4>
                      {b.unlocked && (
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" />
                          Raih
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                      {b.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Hub */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => {
                onClose();
                setViewingCertificateUser(currentUser);
              }}
              className="w-full sm:flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <Award className="w-4 h-4" />
              <span>Buka Sertifikat Digital</span>
            </button>

            <button
              onClick={() => {
                onClose();
                setViewingReportUser(currentUser);
              }}
              className="w-full sm:flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Buka Rapor Belajar (HTML)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
