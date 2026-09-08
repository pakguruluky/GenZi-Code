import React, { useState, useMemo } from 'react';
import {
  Trophy,
  Medal,
  Award,
  Flame,
  Star,
  Search,
  ArrowUpRight,
  Sparkles,
  BookOpen,
  CheckCircle2,
  FileText,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserAccount } from '../types';

export const Leaderboard: React.FC = () => {
  const { users, currentUser, setViewingCertificateUser, setViewingReportUser } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'xp' | 'modules' | 'score'>('xp');

  // Filter only active students (plus trial if they completed modules)
  const rankedStudents = useMemo(() => {
    const list = users.filter(
      u => (u.role === 'siswa' || u.role === 'trial') && u.status === 'active'
    );

    return list.sort((a, b) => {
      if (sortBy === 'xp') {
        return (b.xp || 0) - (a.xp || 0);
      }
      if (sortBy === 'modules') {
        return (b.completedMaterialIds?.length || 0) - (a.completedMaterialIds?.length || 0);
      }
      if (sortBy === 'score') {
        return (b.quizScore || 0) - (a.quizScore || 0);
      }
      return 0;
    });
  }, [users, sortBy]);

  const filteredStudents = useMemo(() => {
    if (!searchTerm.trim()) return rankedStudents;
    const term = searchTerm.toLowerCase();
    return rankedStudents.filter(
      s =>
        s.name.toLowerCase().includes(term) ||
        (s.school && s.school.toLowerCase().includes(term))
    );
  }, [rankedStudents, searchTerm]);

  const topThree = rankedStudents.slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-black uppercase tracking-wider mb-3">
              <Trophy className="w-3.5 h-3.5 text-amber-200" />
              <span>Peringkat Bergengsi GenZi Code</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
              Papan Peringkat Prestasi Siswa
            </h1>
            <p className="text-amber-100 mt-2 text-sm sm:text-base max-w-2xl leading-relaxed">
              Kompetisi belajar pemrograman mandiri, penyelesaian modul Micro:bit, Scratch, dan PictoBlox AI, serta akumulasi skor kuis logika.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 bg-white/10 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/20">
            <Flame className="w-8 h-8 text-amber-300 animate-bounce" />
            <div>
              <p className="text-xs text-amber-200 font-medium">Total Siswa Aktif</p>
              <p className="text-2xl font-black text-white">{rankedStudents.length} Pelajar</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      {topThree.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 items-end">
          {/* Rank 2 (Silver) */}
          <div className="order-2 md:order-1 bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-slate-200 dark:border-slate-800 shadow-lg text-center flex flex-col items-center relative hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 text-slate-600 dark:text-slate-300 flex items-center justify-center font-black text-xl mb-4 shadow-sm">
              🥈 2
            </div>
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-slate-400 to-slate-200 p-1 mb-3">
              <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center font-black text-2xl text-slate-700 dark:text-slate-200">
                {topThree[1].name.charAt(0)}
              </div>
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">{topThree[1].name}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{topThree[1].school || 'Pelajar GenZi'}</p>

            <div className="flex items-center gap-2 mt-4 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-slate-400" />
              <span>{topThree[1].xp || 0} XP</span>
              <span className="text-slate-400">•</span>
              <span>{topThree[1].completedMaterialIds?.length || 0} Modul</span>
            </div>

            {topThree[1].badges && topThree[1].badges.length > 0 && (
              <div className="flex flex-wrap gap-1 justify-center mt-3">
                {topThree[1].badges.slice(0, 2).map((b, i) => (
                  <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {b}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Rank 1 (Gold / Champion) */}
          <div className="order-1 md:order-2 bg-gradient-to-b from-amber-50 to-white dark:from-amber-950/40 dark:to-slate-900 rounded-3xl p-7 border-2 border-amber-400 dark:border-amber-500/50 shadow-2xl text-center flex flex-col items-center relative -translate-y-2 hover:-translate-y-3 transition-transform">
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-amber-500 text-white px-4 py-1 rounded-full text-xs font-black shadow-md flex items-center gap-1.5 uppercase tracking-wide">
              <Trophy className="w-3.5 h-3.5" />
              <span>Juara Umum</span>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-900/60 border-2 border-amber-400 text-amber-600 dark:text-amber-300 flex items-center justify-center font-black text-2xl mb-4 mt-2 shadow-sm">
              🥇 1
            </div>

            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-200 p-1.5 mb-3 ring-4 ring-amber-300/50">
              <div className="w-full h-full rounded-full bg-amber-50 dark:bg-slate-900 flex items-center justify-center font-black text-3xl text-amber-600 dark:text-amber-400">
                {topThree[0].name.charAt(0)}
              </div>
            </div>

            <h3 className="font-black text-slate-900 dark:text-white text-xl">{topThree[0].name}</h3>
            <p className="text-xs text-amber-700 dark:text-amber-300 font-medium line-clamp-1">{topThree[0].school || 'Pelajar GenZi'}</p>

            <div className="flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700 text-xs font-black text-amber-900 dark:text-amber-200 shadow-xs">
              <Flame className="w-4 h-4 text-amber-500" />
              <span>{topThree[0].xp || 0} XP</span>
              <span>•</span>
              <span>{topThree[0].completedMaterialIds?.length || 0} Modul</span>
              <span>•</span>
              <span>Kuis {topThree[0].quizScore || 98}%</span>
            </div>

            {topThree[0].badges && (
              <div className="flex flex-wrap gap-1.5 justify-center mt-3">
                {topThree[0].badges.map((b, i) => (
                  <span key={i} className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-200/70 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200">
                    ★ {b}
                  </span>
                ))}
              </div>
            )}

            <button
              onClick={() => setViewingCertificateUser(topThree[0])}
              className="mt-5 text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 flex items-center gap-1.5 transition-colors"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Lihat Sertifikat Digital</span>
            </button>
          </div>

          {/* Rank 3 (Bronze) */}
          <div className="order-3 bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-slate-200 dark:border-slate-800 shadow-lg text-center flex flex-col items-center relative hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 rounded-2xl bg-amber-100/50 dark:bg-amber-950/40 border-2 border-amber-700/30 text-amber-800 dark:text-amber-400 flex items-center justify-center font-black text-xl mb-4 shadow-sm">
              🥉 3
            </div>
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-700 to-amber-400 p-1 mb-3">
              <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center font-black text-2xl text-amber-800 dark:text-amber-400">
                {topThree[2].name.charAt(0)}
              </div>
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">{topThree[2].name}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{topThree[2].school || 'Pelajar GenZi'}</p>

            <div className="flex items-center gap-2 mt-4 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/30 text-xs font-bold text-amber-800 dark:text-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>{topThree[2].xp || 0} XP</span>
              <span className="text-amber-400">•</span>
              <span>{topThree[2].completedMaterialIds?.length || 0} Modul</span>
            </div>

            {topThree[2].badges && topThree[2].badges.length > 0 && (
              <div className="flex flex-wrap gap-1 justify-center mt-3">
                {topThree[2].badges.slice(0, 2).map((b, i) => (
                  <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                    {b}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Filter and Search Controls */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama siswa atau sekolah..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 hidden sm:inline">Urutkan:</span>
          <button
            onClick={() => setSortBy('xp')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              sortBy === 'xp'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Total XP
          </button>
          <button
            onClick={() => setSortBy('modules')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              sortBy === 'modules'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Modul Selesai
          </button>
          <button
            onClick={() => setSortBy('score')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              sortBy === 'score'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Nilai Kuis
          </button>
        </div>
      </div>

      {/* Leaderboard Table List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {filteredStudents.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              Tidak ada siswa yang sesuai dengan kata kunci pencarian.
            </div>
          ) : (
            filteredStudents.map((student, index) => {
              const isCurrent = currentUser?.id === student.id;
              const completedCount = student.completedMaterialIds?.length || 0;
              const score = student.quizScore || 0;
              const xp = student.xp || 0;

              return (
                <div
                  key={student.id}
                  className={`p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors ${
                    isCurrent
                      ? 'bg-amber-50/80 dark:bg-amber-950/20 ring-2 ring-inset ring-amber-400'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Rank Badge */}
                    <div className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center font-black text-sm text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800">
                      {index === 0 && '🥇'}
                      {index === 1 && '🥈'}
                      {index === 2 && '🥉'}
                      {index > 2 && `#${index + 1}`}
                    </div>

                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-rose-400 text-white font-black flex items-center justify-center text-base shrink-0">
                      {student.name.charAt(0)}
                    </div>

                    {/* Name & School */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 dark:text-white text-sm sm:text-base truncate">
                          {student.name}
                        </span>
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-white">
                            Anda
                          </span>
                        )}
                        {student.role === 'trial' && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                            Trial
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {student.school || 'GenZi Code Academy'}
                      </p>
                    </div>
                  </div>

                  {/* Stats & Actions */}
                  <div className="flex items-center gap-4 sm:gap-6 self-end sm:self-auto shrink-0 flex-wrap">
                    <div className="text-right">
                      <div className="flex items-center gap-1 font-black text-amber-600 dark:text-amber-400 text-sm sm:text-base">
                        <Flame className="w-4 h-4" />
                        <span>{xp} XP</span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {completedCount} Modul Selesai
                      </span>
                    </div>

                    <div className="hidden md:block text-right">
                      <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Skor Kuis
                      </div>
                      <div className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                        {score}%
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setViewingReportUser(student)}
                        title="Lihat Progress Report HTML"
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setViewingCertificateUser(student)}
                        title="Lihat Sertifikat Digital"
                        className="p-2 rounded-xl bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 transition-colors"
                      >
                        <Award className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
