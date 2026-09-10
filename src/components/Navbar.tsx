import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Code,
  Sparkles,
  ShieldAlert,
  UserCheck,
  UserX,
  GraduationCap,
  Laptop,
  LogOut,
  LogIn,
  Table,
  ChevronDown,
  Layers,
  Home,
  Sun,
  Moon,
  Award,
  FileSpreadsheet,
  Trophy,
  Zap,
  User
} from 'lucide-react';
import { StudentProfileModal } from './StudentProfileModal';

interface NavbarProps {
  currentTab: 'home' | 'materi' | 'studios' | 'leaderboard' | 'admin' | 'instruktur' | 'sheets';
  setCurrentTab: (tab: 'home' | 'materi' | 'studios' | 'leaderboard' | 'admin' | 'instruktur' | 'sheets') => void;
  onOpenAuth: (defaultTab?: 'login' | 'register' | 'trial' | 'admin') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenAuth
}) => {
  const {
    currentUser,
    logout,
    users,
    getCompletionPercentage,
    darkMode,
    toggleDarkMode,
    setViewingCertificateUser,
    setViewingReportUser
  } = useApp();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const getRoleBadge = () => {
    if (!currentUser) return null;
    switch (currentUser.role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            <ShieldAlert className="w-3 h-3" />
            Admin (Superuser)
          </span>
        );
      case 'instruktur':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <GraduationCap className="w-3 h-3" />
            Instruktur
          </span>
        );
      case 'siswa':
        return currentUser.status === 'active' ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <UserCheck className="w-3 h-3" />
            Siswa Aktif
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-yellow-100 dark:bg-yellow-950/60 text-yellow-800 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-700 animate-pulse">
            <UserX className="w-3 h-3" />
            Menunggu Approval
          </span>
        );
      case 'trial':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
            <Sparkles className="w-3 h-3" />
            Trial (1x / 1 Modul)
          </span>
        );
      default:
        return null;
    }
  };

  const pendingCount = users.filter(u => u.status === 'pending').length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setCurrentTab('home')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-200 dark:shadow-indigo-950 group-hover:scale-105 transition-transform">
                <Code className="w-5 h-5 font-bold" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-black tracking-tight bg-gradient-to-r from-indigo-900 via-blue-800 to-indigo-600 dark:from-indigo-300 dark:via-blue-300 dark:to-cyan-200 bg-clip-text text-transparent">
                    GenZi Code
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 font-bold tracking-wide uppercase bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 rounded border border-indigo-200 dark:border-indigo-800">
                    AI EdTech
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden xl:block">
                  Belajar Coding & AI Mandiri Berjenjang
                </p>
              </div>
            </button>
          </div>

          {/* Center Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
            <button
              onClick={() => setCurrentTab('home')}
              className={`px-2.5 py-1.5 lg:px-3 lg:py-2 rounded-xl text-xs lg:text-sm font-semibold transition-colors flex items-center gap-1.5 shrink-0 ${
                currentTab === 'home'
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Home className="w-4 h-4 shrink-0" />
              <span>Beranda</span>
            </button>

            {/* Materi, 4 Studio Coding, dan Leaderboard HANYA MUNCUL SETELAH LOGIN */}
            {currentUser && (
              <>
                <button
                  onClick={() => setCurrentTab('materi')}
                  className={`px-2.5 py-1.5 lg:px-3 lg:py-2 rounded-xl text-xs lg:text-sm font-semibold transition-colors flex items-center gap-1.5 shrink-0 ${
                    currentTab === 'materi'
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Layers className="w-4 h-4 shrink-0" />
                  <span>Materi<span className="hidden xl:inline"> Berjenjang</span></span>
                </button>

                <button
                  onClick={() => setCurrentTab('studios')}
                  className={`px-2.5 py-1.5 lg:px-3 lg:py-2 rounded-xl text-xs lg:text-sm font-semibold transition-colors flex items-center gap-1.5 shrink-0 ${
                    currentTab === 'studios'
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Laptop className="w-4 h-4 shrink-0" />
                  <span>4 Studio<span className="hidden xl:inline"> Coding</span></span>
                </button>

                {/* Leaderboard Button */}
                <button
                  onClick={() => setCurrentTab('leaderboard')}
                  className={`px-2.5 py-1.5 lg:px-3 lg:py-2 rounded-xl text-xs lg:text-sm font-semibold transition-colors flex items-center gap-1.5 shrink-0 ${
                    currentTab === 'leaderboard'
                      ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Trophy className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Leaderboard</span>
                </button>
              </>
            )}

            {/* Admin or Instructor View */}
            {(currentUser?.role === 'admin' || currentUser?.role === 'instruktur') && (
              <button
                onClick={() => setCurrentTab(currentUser?.role === 'admin' ? 'admin' : 'instruktur')}
                className={`relative px-2.5 py-1.5 lg:px-3 lg:py-2 rounded-xl text-xs lg:text-sm font-semibold transition-colors flex items-center gap-1.5 shrink-0 ${
                  currentTab === 'admin' || currentTab === 'instruktur'
                    ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {currentUser?.role === 'admin' ? (
                  <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                ) : (
                  <GraduationCap className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                )}
                <span><span className="hidden xl:inline">Panel </span>{currentUser?.role === 'admin' ? 'Admin' : 'Instruktur'}</span>
                {currentUser?.role === 'admin' && pendingCount > 0 && (
                  <span className="w-4 h-4 flex items-center justify-center rounded-full bg-rose-600 text-white text-[9px] font-bold shrink-0">
                    {pendingCount}
                  </span>
                )}
              </button>
            )}

            {/* In-App Database Table View: RESTRICTED ONLY FOR ADMIN */}
            {currentUser?.role === 'admin' && (
              <button
                onClick={() => setCurrentTab('sheets')}
                title="Tabel Database Pengguna & Siswa (Khusus Admin)"
                className={`px-2.5 py-1.5 lg:px-3 lg:py-2 rounded-xl text-xs lg:text-sm font-semibold transition-colors flex items-center gap-1.5 shrink-0 ${
                  currentTab === 'sheets'
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Table className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span><span className="hidden xl:inline">Tabel </span>Database</span>
              </button>
            )}
          </nav>

          {/* Right Action & User Profile & Theme Toggle */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Dark/Light Mode Switcher */}
            <button
              onClick={toggleDarkMode}
              title={darkMode ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle Theme"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700 hover:-rotate-12 transition-transform" />
              )}
            </button>

            {currentUser ? (
              <div className="flex items-center gap-2">
                {/* Gamification XP Pill Badge */}
                <button
                  onClick={() => setShowProfileModal(true)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-300/80 dark:border-amber-700/80 text-amber-700 dark:text-amber-300 font-black text-xs transition-all shadow-xs group"
                  title="Klik untuk melihat Profil Siswa, Level & Akumulasi XP"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500 group-hover:scale-110 transition-transform animate-pulse" />
                  <span>{currentUser.xp || 0}</span>
                  <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">XP</span>
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShowRoleMenu(!showRoleMenu)}
                    className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-sm shrink-0">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-left hidden lg:block">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-100 line-clamp-1 max-w-[100px] xl:max-w-[140px]">
                        {currentUser.name}
                      </p>
                      <div className="flex items-center gap-1">
                        {getRoleBadge()}
                      </div>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Dropdown switch & Action Menu */}
                  {showRoleMenu && (
                    <div
                      className="absolute right-0 mt-2 w-76 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 text-xs"
                      onClick={() => setShowRoleMenu(false)}
                    >
                      <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                        <p className="font-bold text-slate-900 dark:text-white">{currentUser.name}</p>
                        <p className="text-slate-500 dark:text-slate-400 text-[11px] truncate">{currentUser.email}</p>
                        <div className="mt-1 flex items-center justify-between">
                          <span className="text-slate-500 dark:text-slate-400">Progress Belajar:</span>
                          <span className="font-bold text-indigo-600 dark:text-indigo-400">
                            {getCompletionPercentage(currentUser)}%
                          </span>
                        </div>
                      </div>

                      {/* Quick Access to Profile & Gamification */}
                      <div className="p-2 border-b border-slate-100 dark:border-slate-800 space-y-1">
                        <button
                          onClick={() => setShowProfileModal(true)}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 flex items-center justify-between font-semibold"
                        >
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-indigo-500" />
                            <span>Profil & Akumulasi XP</span>
                          </div>
                          <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-300 font-bold text-[10px]">
                            {currentUser.xp || 0} XP
                          </span>
                        </button>

                        <button
                          onClick={() => setViewingCertificateUser(currentUser)}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40 flex items-center gap-2 font-semibold"
                        >
                          <Award className="w-4 h-4 text-amber-500" />
                          <span>Lihat Sertifikat Digital Saya</span>
                        </button>
                        <button
                          onClick={() => setViewingReportUser(currentUser)}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 flex items-center gap-2 font-semibold"
                        >
                          <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                          <span>Buka Rapor Belajar (HTML)</span>
                        </button>
                      </div>

                      <div className="border-t border-slate-100 dark:border-slate-800 pt-1 mt-1 px-2">
                        <button
                          onClick={() => {
                            logout();
                            setCurrentTab('home');
                            setShowRoleMenu(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 font-medium"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Keluar (Logout)
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth('trial')}
                  className="px-3 py-1.5 text-xs sm:text-sm font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 dark:hover:bg-purple-900/50 rounded-xl border border-purple-200 dark:border-purple-800 transition-colors"
                >
                  Coba Trial (1x)
                </button>
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Masuk / Daftar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Tab Bar - HANYA MUNCUL JIKA SUDAH LOGIN */}
      {currentUser && (
        <div className="md:hidden flex items-center overflow-x-auto whitespace-nowrap gap-1.5 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur px-2.5 py-2 text-xs font-semibold scrollbar-none shadow-xs">
          <button
            onClick={() => setCurrentTab('home')}
            className={`min-h-[38px] px-3 py-1.5 shrink-0 flex items-center gap-1.5 rounded-xl transition-all ${
              currentTab === 'home'
                ? 'bg-indigo-600 text-white font-bold shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Home className="w-3.5 h-3.5 shrink-0" />
            <span>Beranda</span>
          </button>
          <button
            onClick={() => setCurrentTab('materi')}
            className={`min-h-[38px] px-3 py-1.5 shrink-0 flex items-center gap-1.5 rounded-xl transition-all ${
              currentTab === 'materi'
                ? 'bg-indigo-600 text-white font-bold shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5 shrink-0" />
            <span>Materi</span>
          </button>
          <button
            onClick={() => setCurrentTab('studios')}
            className={`min-h-[38px] px-3 py-1.5 shrink-0 flex items-center gap-1.5 rounded-xl transition-all ${
              currentTab === 'studios'
                ? 'bg-indigo-600 text-white font-bold shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Laptop className="w-3.5 h-3.5 shrink-0" />
            <span>4 Studio</span>
          </button>
          <button
            onClick={() => setCurrentTab('leaderboard')}
            className={`min-h-[38px] px-3 py-1.5 shrink-0 flex items-center gap-1.5 rounded-xl transition-all ${
              currentTab === 'leaderboard'
                ? 'bg-amber-500 text-white font-bold shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 shrink-0" />
            <span>Leaderboard</span>
          </button>
          {(currentUser.role === 'admin' || currentUser.role === 'instruktur') && (
            <button
              onClick={() => setCurrentTab(currentUser.role === 'admin' ? 'admin' : 'instruktur')}
              className={`min-h-[38px] px-3 py-1.5 shrink-0 flex items-center gap-1.5 rounded-xl transition-all ${
                currentTab === 'admin' || currentTab === 'instruktur'
                  ? 'bg-rose-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {currentUser.role === 'admin' ? (
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
              ) : (
                <GraduationCap className="w-3.5 h-3.5 shrink-0" />
              )}
              <span>{currentUser.role === 'admin' ? 'Admin' : 'Instruktur'}</span>
              {currentUser.role === 'admin' && pendingCount > 0 && (
                <span className="w-4 h-4 flex items-center justify-center rounded-full bg-white text-rose-700 text-[9px] font-black shrink-0">
                  {pendingCount}
                </span>
              )}
            </button>
          )}
          {/* Only Admin can see Sheets DB on mobile */}
          {currentUser.role === 'admin' && (
            <button
              onClick={() => setCurrentTab('sheets')}
              className={`min-h-[38px] px-3 py-1.5 shrink-0 flex items-center gap-1.5 rounded-xl transition-all ${
                currentTab === 'sheets'
                  ? 'bg-indigo-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Table className="w-3.5 h-3.5 shrink-0" />
              <span>Tabel DB</span>
            </button>
          )}
        </div>
      )}

      {/* Student Profile & Gamification XP Modal */}
      <StudentProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </header>
  );
};

