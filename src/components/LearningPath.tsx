import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ALL_MATERIALS } from '../data/curriculumData';
import { Material, MaterialCategory } from '../types';
import { useApp } from '../context/AppContext';
import {
  useNetworkStatus,
  getOfflineMaterials,
  isOfflineMaterialCached
} from '../utils/offlineStorage';
import {
  CheckCircle2,
  Lock,
  Play,
  FileText,
  Video,
  Sparkles,
  ArrowRight,
  Filter,
  Search,
  BookOpen,
  Award,
  Unlock,
  AlertCircle,
  ExternalLink,
  WifiOff,
  BookmarkCheck,
  HardDrive,
  TrendingUp,
  Zap,
  Code2,
  Cpu,
  Bot,
  Swords
} from 'lucide-react';

interface LearningPathProps {
  onSelectMaterial: (material: Material) => void;
  onOpenAuth: (tab?: 'login' | 'register' | 'trial' | 'admin') => void;
}

export const LearningPath: React.FC<LearningPathProps> = ({
  onSelectMaterial,
  onOpenAuth
}) => {
  const {
    currentUser,
    isMaterialUnlocked,
    canAccessMaterial,
    getCompletionPercentage,
    setViewingCertificateUser,
    setViewingReportUser
  } = useApp();

  const isOnline = useNetworkStatus();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const completionPercent = getCompletionPercentage(currentUser);
  const completedCount = currentUser?.completedMaterialIds?.length || 0;

  const offlineSavedList = getOfflineMaterials();
  const offlineIds = new Set(offlineSavedList.map(o => o.id));
  const completedIds = new Set(currentUser?.completedMaterialIds || []);

  // Category progress breakdowns for animated mini-trackers
  const categoryProgress = [
    {
      id: 'scratch',
      name: 'Scratch 3.0',
      icon: Code2,
      total: ALL_MATERIALS.filter(m => m.category === 'Scratch').length,
      completed: ALL_MATERIALS.filter(m => m.category === 'Scratch' && completedIds.has(m.id)).length,
      color: 'from-amber-500 to-amber-600',
      textColor: 'text-amber-600 dark:text-amber-400',
      bgLight: 'bg-amber-500/10 border-amber-200 dark:border-amber-800'
    },
    {
      id: 'microbit',
      name: 'BBC Micro:bit',
      icon: Cpu,
      total: ALL_MATERIALS.filter(m => m.category === 'Microbit').length,
      completed: ALL_MATERIALS.filter(m => m.category === 'Microbit' && completedIds.has(m.id)).length,
      color: 'from-emerald-500 to-emerald-600',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      bgLight: 'bg-emerald-500/10 border-emerald-200 dark:border-emerald-800'
    },
    {
      id: 'pictoblox',
      name: 'PictoBlox AI',
      icon: Bot,
      total: ALL_MATERIALS.filter(m => m.category === 'Pictoblox').length,
      completed: ALL_MATERIALS.filter(m => m.category === 'Pictoblox' && completedIds.has(m.id)).length,
      color: 'from-blue-500 to-indigo-600',
      textColor: 'text-blue-600 dark:text-blue-400',
      bgLight: 'bg-blue-500/10 border-blue-200 dark:border-blue-800'
    },
    {
      id: 'codecombat',
      name: 'CodeCombat & Game',
      icon: Swords,
      total: ALL_MATERIALS.filter(m => m.category === 'CodeCombat' || m.category === 'Game Logika (SpriteLab)' || m.category === 'MakeCode Arcade' || m.category === 'Unplugged').length,
      completed: ALL_MATERIALS.filter(m => (m.category === 'CodeCombat' || m.category === 'Game Logika (SpriteLab)' || m.category === 'MakeCode Arcade' || m.category === 'Unplugged') && completedIds.has(m.id)).length,
      color: 'from-rose-500 to-pink-600',
      textColor: 'text-rose-600 dark:text-rose-400',
      bgLight: 'bg-rose-500/10 border-rose-200 dark:border-rose-800'
    },
  ];

  // Filter materials
  const filteredMaterials = ALL_MATERIALS.filter(m => {
    if (selectedCategory === 'saved_offline') {
      if (!offlineIds.has(m.id)) return false;
    } else if (selectedCategory !== 'all' && m.category !== selectedCategory) {
      return false;
    }

    if (selectedLevel !== 'all') {
      if (selectedLevel === 'Level 1' && !m.level.includes('Level 1')) return false;
      if (selectedLevel === 'Level 2' && m.level !== 'Level 2') return false;
      if (selectedLevel === 'Level 3' && m.level !== 'Level 3') return false;
      if (selectedLevel === 'Level 4' && m.level !== 'Level 4') return false;
      if (selectedLevel === 'Level 5' && m.level !== 'Level 5') return false;
      if (selectedLevel === 'Next Level' && m.level !== 'Next Level' && m.level !== 'Next level') return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        m.title.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q) ||
        (m.competency && m.competency.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Offline Status Alert if disconnected */}
      {!isOnline && (
        <div className="rounded-2xl bg-amber-500/15 border border-amber-400 dark:border-amber-600 p-4 sm:p-5 flex items-start sm:items-center justify-between gap-4 text-amber-900 dark:text-amber-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <WifiOff className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold">Koneksi Internet Sedang Terputus (Mode Offline)</h4>
              <p className="text-xs text-amber-800 dark:text-amber-300">
                Anda tetap dapat membaca ringkasan materi {offlineSavedList.length > 0 ? `(${offlineSavedList.length} modul telah tersimpan)` : ''} dan berlatih koding secara lokal.
              </p>
            </div>
          </div>
          {offlineSavedList.length > 0 && (
            <button
              onClick={() => setSelectedCategory('saved_offline')}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shrink-0 transition-colors shadow-xs"
            >
              Lihat Materi Offline
            </button>
          )}
        </div>
      )}

      {/* Learning Journey Hero & Progress Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Kurikulum Mandiri & Berjenjang GenZi Code
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Jalur Belajar Coding & Kecerdasan Buatan
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-sm mt-1 max-w-2xl">
              Materi dirancang secara <strong>berjenjang (sequential)</strong>. Selesaikan setiap modul untuk membuka modul berikutnya. Terdiri dari 54 modul interaktif (Scratch, Micro:bit, PictoBlox AI, Unplugged).
            </p>
          </div>

          {/* Animated Progress Card */}
          <div className="bg-gradient-to-br from-indigo-50/90 via-slate-50 to-purple-50/50 dark:from-slate-800/90 dark:via-slate-900/90 dark:to-indigo-950/40 border border-indigo-100 dark:border-slate-700/80 rounded-2xl p-5 min-w-[320px] lg:max-w-md w-full shadow-xs">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-600/10 dark:bg-indigo-400/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                    Pencapaian Belajar
                  </span>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {completedCount} dari {ALL_MATERIALS.length} Modul Selesai
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-2xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
                  {completionPercent}%
                </span>
                <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                  {completionPercent === 100 ? '🎉 Lulus Penuh' : completionPercent >= 50 ? '⚡ Menengah' : '🌱 Pemula'}
                </span>
              </div>
            </div>

            {/* Animated Interactive Progress Bar with Shimmer & Glow */}
            <div className="relative mt-3">
              <div className="w-full bg-slate-200/90 dark:bg-slate-700/80 h-4 rounded-full overflow-hidden p-0.5 relative shadow-inner">
                {/* Milestone tick marks at 25%, 50%, 75% */}
                <div className="absolute inset-0 flex justify-between px-[25%] pointer-events-none z-10">
                  <div className="w-0.5 h-full bg-white/50 dark:bg-slate-800/60" title="Milestone 25%" />
                  <div className="w-0.5 h-full bg-white/50 dark:bg-slate-800/60" title="Milestone 50%" />
                  <div className="w-0.5 h-full bg-white/50 dark:bg-slate-800/60" title="Milestone 75%" />
                </div>

                {/* Animated fill track using motion.div */}
                <motion.div
                  className="bg-gradient-to-r from-indigo-600 via-blue-500 to-emerald-500 h-full rounded-full relative overflow-hidden flex items-center justify-end"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(completionPercent, 0)}%` }}
                  transition={{
                    type: 'spring',
                    stiffness: 45,
                    damping: 14,
                    mass: 0.8
                  }}
                >
                  {/* Moving shimmer light reflection */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-full h-full"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{
                      repeat: Infinity,
                      duration: 2.2,
                      ease: 'linear'
                    }}
                  />

                  {/* Leading glow pulse dot at the tip of progress */}
                  {completionPercent > 0 && (
                    <motion.div
                      className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_#ffffff] mr-0.5 shrink-0 z-20"
                      animate={{ scale: [1, 1.3, 1], opacity: [0.85, 1, 0.85] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                    />
                  )}
                </motion.div>
              </div>

              {/* Milestone labels */}
              <div className="flex justify-between text-[10px] font-semibold text-slate-400 dark:text-slate-500 mt-1.5 px-0.5">
                <span>0%</span>
                <span className={completionPercent >= 25 ? 'text-indigo-600 dark:text-indigo-400 font-bold' : ''}>25% Logika</span>
                <span className={completionPercent >= 50 ? 'text-blue-600 dark:text-blue-400 font-bold' : ''}>50% IoT</span>
                <span className={completionPercent >= 75 ? 'text-purple-600 dark:text-purple-400 font-bold' : ''}>75% AI</span>
                <span className={completionPercent >= 100 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''}>100% Lulus</span>
              </div>
            </div>

            {/* Category Mini Animated Progress Bars */}
            <div className="grid grid-cols-2 gap-2 mt-3.5 pt-3 border-t border-slate-200/80 dark:border-slate-700/80">
              {categoryProgress.map(cat => {
                const Icon = cat.icon;
                const catPercent = cat.total > 0 ? Math.round((cat.completed / cat.total) * 100) : 0;
                return (
                  <div
                    key={cat.id}
                    className={`p-2 rounded-xl border ${cat.bgLight} transition-all`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 truncate">
                        <Icon className={`w-3 h-3 ${cat.textColor}`} />
                        <span className="truncate">{cat.name}</span>
                      </span>
                      <span className={`text-[10px] font-black ${cat.textColor}`}>
                        {cat.completed}/{cat.total}
                      </span>
                    </div>
                    {/* Animated mini fill track */}
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <motion.div
                        className={`bg-gradient-to-r ${cat.color} h-full rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${catPercent}%` }}
                        transition={{ type: 'spring', stiffness: 50, damping: 15 }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Student Certificate & HTML Report Quick Triggers */}
            {currentUser && currentUser.role !== 'admin' && (
              <div className="mt-3.5 pt-3 border-t border-slate-200/80 dark:border-slate-700 flex items-center gap-2">
                <button
                  onClick={() => setViewingCertificateUser(currentUser)}
                  className="flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center gap-1 shadow-xs transition-colors"
                >
                  <Award className="w-3.5 h-3.5" />
                  Sertifikat Digital
                </button>
                <button
                  onClick={() => setViewingReportUser(currentUser)}
                  className="flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-1 shadow-xs transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Rapor Belajar HTML
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {[
              { id: 'all', label: 'Semua Modul (54)' },
              { id: 'saved_offline', label: `💾 Tersimpan Offline (${offlineSavedList.length})` },
              { id: 'Scratch', label: 'Scratch' },
              { id: 'Pictoblox', label: 'PictoBlox AI' },
              { id: 'MakeCode Arcade', label: 'MakeCode / Micro:bit' },
              { id: 'Unplugged', label: 'Unplugged' },
              { id: 'Game Logika (SpriteLab)', label: 'Sprite Lab' },
              { id: 'CodeCombat', label: 'CodeCombat' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari judul materi..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Level Filters */}
        <div className="mt-3 flex items-center gap-1.5 flex-wrap text-xs">
          <span className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider text-[11px] mr-1">
            Level:
          </span>
          {['all', 'Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5', 'Next Level'].map(lvl => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                selectedLevel === lvl
                  ? 'bg-slate-800 dark:bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {lvl === 'all' ? 'Semua Level' : lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Materials List / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMaterials.map(material => {
          const unlocked = isMaterialUnlocked(material);
          const isCompleted = currentUser?.completedMaterialIds?.includes(material.id);
          const access = canAccessMaterial(material);

          return (
            <div
              key={material.id}
              className={`rounded-2xl border transition-all flex flex-col justify-between overflow-hidden ${
                isCompleted
                  ? 'bg-white dark:bg-slate-900 border-emerald-300 dark:border-emerald-800/80 shadow-xs'
                  : unlocked
                  ? 'bg-white dark:bg-slate-900 border-indigo-400 dark:border-indigo-600/80 shadow-sm ring-1 ring-indigo-400/30'
                  : 'bg-slate-50/80 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 opacity-75'
              }`}
            >
              {/* Card Header & Badges */}
              <div className="p-5">
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span
                      className={`text-[11px] font-black px-2 py-0.5 rounded-md ${
                        isCompleted
                          ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300'
                          : unlocked
                          ? 'bg-indigo-100 dark:bg-indigo-950/70 text-indigo-800 dark:text-indigo-300'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      #{material.sequence}
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {material.level}
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                      {material.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {offlineIds.has(material.id) && (
                      <span
                        title="Tersimpan untuk dibaca offline"
                        className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                      >
                        <BookmarkCheck className="w-3 h-3 text-emerald-600" />
                        <span className="hidden sm:inline">Offline</span>
                      </span>
                    )}

                    <span
                      className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md ${
                        material.type === 'Video'
                          ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {material.type === 'Video' ? (
                        <Video className="w-3 h-3" />
                      ) : (
                        <FileText className="w-3 h-3" />
                      )}
                      {material.type}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug line-clamp-2 mt-1">
                  {material.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {material.description}
                </p>

                {/* Competency preview */}
                {material.competency && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-1.5 line-clamp-1">
                    <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="truncate">{material.competency}</span>
                  </div>
                )}
              </div>

              {/* Card Footer / Action Button */}
              <div className="px-5 py-3.5 bg-slate-50/70 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                {isCompleted ? (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Selesai</span>
                  </div>
                ) : unlocked ? (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-400">
                    <Unlock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Terbuka</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-[11px]">
                      {currentUser?.role === 'trial'
                        ? 'Khusus Siswa Terdaftar'
                        : `Kunci: Modul #${material.sequence - 1}`}
                    </span>
                  </div>
                )}

                <button
                  onClick={() => onSelectMaterial(material)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs ${
                    isCompleted
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800'
                      : unlocked
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
                  }`}
                >
                  {isCompleted ? (
                    'Review Modul'
                  ) : unlocked ? (
                    <>
                      <span>Mulai Belajar</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  ) : (
                    'Lihat Info'
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredMaterials.length === 0 && (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-600 dark:text-slate-400 font-semibold">
            Tidak ada modul yang cocok dengan kriteria pencarian.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedLevel('all');
              setSearchQuery('');
            }}
            className="mt-3 px-4 py-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl hover:bg-indigo-100"
          >
            Reset Filter
          </button>
        </div>
      )}
    </div>
  );
};
