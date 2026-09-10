import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ALL_MATERIALS, STUDIOS } from '../data/curriculumData';
import {
  GraduationCap,
  Users,
  CheckCircle2,
  Clock,
  Laptop,
  BookOpen,
  Award,
  Search,
  ExternalLink,
  RotateCcw,
  FileSpreadsheet,
  Trophy,
  TrendingUp,
  Zap,
  Code2,
  Cpu,
  Bot,
  Swords,
  PieChart,
  ChevronRight
} from 'lucide-react';

export const InstructorPanel: React.FC = () => {
  const {
    currentUser,
    users,
    resetUserProgress,
    getCompletionPercentage,
    openStudio,
    openMaterial,
    setViewingCertificateUser,
    setViewingReportUser
  } = useApp();

  const [studentSearch, setStudentSearch] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  const students = users.filter(u => u.role === 'siswa' && u.status === 'active');
  const totalRegisteredStudents = users.filter(u => u.role === 'siswa');
  const trialUsers = users.filter(u => u.role === 'trial');
  const selectedStudent = students.find(s => s.id === selectedStudentId) || students[0];

  // Studio popularity analysis across all users
  const studioStats = [
    {
      id: 'scratch' as const,
      name: 'Scratch 3.0 Logic Studio',
      shortName: 'Scratch 3.0',
      icon: Code2,
      categoryNames: ['Scratch'],
      accentText: 'text-amber-600 dark:text-amber-400',
      accentBg: 'bg-amber-500/10 border-amber-200 dark:border-amber-800',
      barColor: 'bg-amber-500',
      completedCount: 0,
      activeUserCount: 0
    },
    {
      id: 'microbit' as const,
      name: 'BBC Micro:bit IoT Simulator',
      shortName: 'BBC Micro:bit',
      icon: Cpu,
      categoryNames: ['Microbit', 'MakeCode Arcade'],
      accentText: 'text-emerald-600 dark:text-emerald-400',
      accentBg: 'bg-emerald-500/10 border-emerald-200 dark:border-emerald-800',
      barColor: 'bg-emerald-500',
      completedCount: 0,
      activeUserCount: 0
    },
    {
      id: 'pictoblox' as const,
      name: 'PictoBlox AI & ML Studio',
      shortName: 'PictoBlox AI',
      icon: Bot,
      categoryNames: ['Pictoblox'],
      accentText: 'text-blue-600 dark:text-blue-400',
      accentBg: 'bg-blue-500/10 border-blue-200 dark:border-blue-800',
      barColor: 'bg-blue-500',
      completedCount: 0,
      activeUserCount: 0
    },
    {
      id: 'codecombat' as const,
      name: 'CodeCombat RPG Dungeon',
      shortName: 'CodeCombat RPG',
      icon: Swords,
      categoryNames: ['CodeCombat', 'Game Logika (SpriteLab)', 'Unplugged'],
      accentText: 'text-rose-600 dark:text-rose-400',
      accentBg: 'bg-rose-500/10 border-rose-200 dark:border-rose-800',
      barColor: 'bg-rose-500',
      completedCount: 0,
      activeUserCount: 0
    }
  ];

  // Map materials to studio categories
  const materialStudioLookup = new Map<string, string>();
  ALL_MATERIALS.forEach(m => {
    for (const st of studioStats) {
      if (st.categoryNames.includes(m.category)) {
        materialStudioLookup.set(m.id, st.id);
        break;
      }
    }
  });

  // Calculate completions and active learners per studio across all users
  users.forEach(user => {
    if (!user.completedMaterialIds || user.completedMaterialIds.length === 0) return;
    const userStudios = new Set<string>();
    user.completedMaterialIds.forEach(id => {
      const studioId = materialStudioLookup.get(id);
      if (studioId) {
        const found = studioStats.find(s => s.id === studioId);
        if (found) {
          found.completedCount++;
          userStudios.add(studioId);
        }
      }
    });
    userStudios.forEach(sId => {
      const found = studioStats.find(s => s.id === sId);
      if (found) found.activeUserCount++;
    });
  });

  // Sort by completedCount descending, secondary by activeUserCount
  const sortedStudios = [...studioStats].sort((a, b) => {
    if (b.completedCount !== a.completedCount) return b.completedCount - a.completedCount;
    return b.activeUserCount - a.activeUserCount;
  });
  const mostPopularStudio = sortedStudios[0] || studioStats[0];
  const totalStudioCompletions = studioStats.reduce((acc, s) => acc + s.completedCount, 0);

  // Average completion rate among active students
  const avgCompletionRate = students.length > 0
    ? Math.round(students.reduce((acc, s) => acc + getCompletionPercentage(s), 0) / students.length)
    : 0;

  // Total XP across active students
  const totalStudentsXP = students.reduce((acc, s) => acc + (s.xp || 0), 0);

  return (
    <div className="space-y-6">
      {/* Instructor Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
              <GraduationCap className="w-4 h-4" />
              Portal Instruktur & Pengajar GenZi Code
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Monitoring Progres Belajar Siswa
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
              Halo, <strong>{currentUser?.name}</strong>! Pantau pencapaian 54 modul berjenjang setiap siswa dan terbitkan sertifikat serta rapor progres HTML secara langsung.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openStudio('scratch')}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 flex items-center gap-1.5"
            >
              <Laptop className="w-3.5 h-3.5" />
              Buka Studio Praktik
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stats Widget: Active Students & Most Popular Coding Studio */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <PieChart className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Ringkasan Analitik Siswa & Studio Coding
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Statistik real-time aktivitas belajar siswa dan popularitas penggunaan 4 studio terintegrasi.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5 w-fit">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Data Tersinkronisasi
          </span>
        </div>

        {/* 4 Metrics Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {/* Card 1: Total Active Students */}
          <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-slate-800/60 border border-indigo-100 dark:border-slate-700/80 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                Total Siswa Aktif
              </span>
              <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900 dark:text-white">
                  {students.length}
                </span>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  Siswa Terverifikasi
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Dari {totalRegisteredStudents.length} siswa terdaftar ({trialUsers.length} akun uji coba trial)
              </p>
            </div>
          </div>

          {/* Card 2: Most Popular Coding Studio */}
          <div className={`p-4 rounded-2xl border ${mostPopularStudio.accentBg} flex flex-col justify-between`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span className={`text-xs font-bold uppercase tracking-wider ${mostPopularStudio.accentText}`}>
                  Studio Terpopuler
                </span>
              </div>
              <button
                onClick={() => openStudio(mostPopularStudio.id)}
                title={`Buka ${mostPopularStudio.name}`}
                className="p-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="mt-3">
              <div className="flex items-center gap-2">
                <mostPopularStudio.icon className={`w-5 h-5 ${mostPopularStudio.accentText} shrink-0`} />
                <span className="text-lg font-black text-slate-900 dark:text-white truncate">
                  {mostPopularStudio.shortName}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">
                <strong>{mostPopularStudio.completedCount} modul</strong> diselesaikan ({totalStudioCompletions > 0 ? Math.round((mostPopularStudio.completedCount / totalStudioCompletions) * 100) : 0}% porsi belajar)
              </p>
            </div>
          </div>

          {/* Card 3: Average Completion Rate */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-slate-800/60 border border-emerald-100 dark:border-slate-700/80 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Rata-rata Kelulusan
              </span>
              <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-xs">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900 dark:text-white">
                  {avgCompletionRate}%
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Target: 100%
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mt-2">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${avgCompletionRate}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                {totalStudioCompletions} total modul diselesaikan siswa
              </p>
            </div>
          </div>

          {/* Card 4: Total Gamified XP Accumulated */}
          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-slate-800/60 border border-amber-100 dark:border-slate-700/80 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                Total Akumulasi XP
              </span>
              <div className="p-2 rounded-xl bg-amber-500 text-white shadow-xs">
                <Zap className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900 dark:text-white">
                  {totalStudentsXP.toLocaleString('id-ID')}
                </span>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                  XP Siswa
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Rata-rata {students.length > 0 ? Math.round(totalStudentsXP / students.length) : 0} XP per siswa aktif
              </p>
            </div>
          </div>
        </div>

        {/* Studio Popularity Distribution Bar */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Distribusi Penggunaan 4 Studio Coding
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {totalStudioCompletions} total pengerjaan modul di studio
            </span>
          </div>

          {/* Stacked multi-segment bar */}
          <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-200 dark:bg-slate-700 p-0.5">
            {studioStats.map(st => {
              const pct = totalStudioCompletions > 0 ? Math.round((st.completedCount / totalStudioCompletions) * 100) : 25;
              return (
                <div
                  key={st.id}
                  title={`${st.name}: ${st.completedCount} modul (${pct}%)`}
                  className={`${st.barColor} h-full transition-all duration-500 first:rounded-l-full last:rounded-r-full`}
                  style={{ width: `${pct}%` }}
                />
              );
            })}
          </div>

          {/* Studio Legend / Quick Links */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
            {studioStats.map(st => {
              const Icon = st.icon;
              const pct = totalStudioCompletions > 0 ? Math.round((st.completedCount / totalStudioCompletions) * 100) : 0;
              const isTop = st.id === mostPopularStudio.id;
              return (
                <button
                  key={st.id}
                  onClick={() => openStudio(st.id)}
                  className={`p-2 rounded-xl border text-left flex items-center justify-between gap-2 transition-all hover:scale-[1.02] ${
                    isTop
                      ? 'border-amber-400 dark:border-amber-600 bg-amber-50/50 dark:bg-amber-950/30'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <div className={`w-2.5 h-2.5 rounded-full ${st.barColor} shrink-0`} />
                    <div className="truncate">
                      <div className="text-xs font-bold text-slate-900 dark:text-white truncate flex items-center gap-1">
                        <span>{st.shortName}</span>
                        {isTop && <Trophy className="w-3 h-3 text-amber-500 inline shrink-0" />}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">
                        {st.completedCount} modul ({pct}%)
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Student Progress Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Selection List */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs lg:col-span-1 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Daftar Siswa Aktif ({students.length})
            </h3>
          </div>

          <div className="relative mb-3">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari siswa..."
              value={studentSearch}
              onChange={e => setStudentSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {students
              .filter(s => s.name.toLowerCase().includes(studentSearch.toLowerCase()))
              .map(student => {
                const percent = getCompletionPercentage(student);
                const isSelected = selectedStudent?.id === student.id;
                return (
                  <button
                    key={student.id}
                    onClick={() => setSelectedStudentId(student.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/40 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {student.name}
                      </h4>
                      <span className="text-[11px] font-black text-amber-700 dark:text-amber-400 shrink-0">
                        {percent}%
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {student.school || 'Siswa GenZi'}
                    </p>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mt-2">
                      <div
                        className="bg-amber-500 h-full rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </button>
                );
              })}

            {students.length === 0 && (
              <p className="text-xs text-slate-500 text-center py-6">
                Belum ada siswa aktif.
              </p>
            )}
          </div>
        </div>

        {/* Selected Student Detail Card */}
        {selectedStudent ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs lg:col-span-2 space-y-6 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                  Siswa Aktif
                </span>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                  {selectedStudent.name}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedStudent.email} • {selectedStudent.school || 'Sekolah'}
                </p>
              </div>

              <div className="flex flex-col sm:items-end gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-indigo-700 dark:text-indigo-400">
                    {getCompletionPercentage(selectedStudent)}%
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {selectedStudent.completedMaterialIds?.length || 0} dari {ALL_MATERIALS.length} modul selesai
                </p>
              </div>
            </div>

            {/* Quick Certificate & HTML Progress Report Actions for this Student */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Dokumen Prestasi & Evaluasi Siswa
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Lihat sertifikat berjenjang atau unduh laporan evaluasi lengkap berbasis HTML.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewingCertificateUser(selectedStudent)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Award className="w-3.5 h-3.5" />
                  Sertifikat Digital
                </button>
                <button
                  onClick={() => setViewingReportUser(selectedStudent)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  Rapor Progres HTML
                </button>
              </div>
            </div>

            {/* Completed Modules List */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                Daftar Modul yang Telah Diselesaikan
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[340px] overflow-y-auto pr-1">
                {ALL_MATERIALS.map(mat => {
                  const done = selectedStudent.completedMaterialIds?.includes(mat.id);
                  return (
                    <div
                      key={mat.id}
                      className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 ${
                        done
                          ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        {done ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        ) : (
                          <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                        <span className="truncate font-medium">
                          #{mat.sequence}. {mat.title}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold shrink-0 uppercase px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        {mat.level}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => resetUserProgress(selectedStudent.id)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Progress Siswa
              </button>

              <span className="text-xs text-slate-400 dark:text-slate-500">
                Data real tersinkronisasi dengan Database Cloud Terpusat
              </span>
            </div>
          </div>
        ) : (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 lg:col-span-2">
            <Users className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <p className="text-slate-600 dark:text-slate-400 font-semibold text-sm">
              Pilih siswa di sebelah kiri untuk melihat detail perkembangan modul.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
