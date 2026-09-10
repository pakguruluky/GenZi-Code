/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { TrialBanner } from './components/TrialBanner';
import { HomeView } from './components/HomeView';
import { LearningPath } from './components/LearningPath';
import { StudioView } from './components/StudioView';
import { AdminPanel } from './components/AdminPanel';
import { InstructorPanel } from './components/InstructorPanel';
import { SheetsView } from './components/SheetsView';
import { MaterialModal } from './components/MaterialModal';
import { AuthModal } from './components/AuthModal';
import { CertificateModal } from './components/CertificateModal';
import { ProgressReportModal } from './components/ProgressReportModal';
import { Leaderboard } from './components/Leaderboard';
import { ToastNotification } from './components/ToastNotification';
import { Material } from './types';
import {
  Code2,
  Cpu,
  Bot,
  Layers,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Database,
  Lock,
  Swords
} from 'lucide-react';

function MainLayout() {
  const {
    currentUser,
    selectedMaterial,
    openMaterial,
    openStudio,
    viewingCertificateUser,
    setViewingCertificateUser,
    viewingReportUser,
    setViewingReportUser
  } = useApp();

  const [currentTab, setCurrentTab] = useState<'home' | 'materi' | 'studios' | 'leaderboard' | 'admin' | 'instruktur' | 'sheets'>('home');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authDefaultTab, setAuthDefaultTab] = useState<'login' | 'register' | 'trial' | 'admin'>('login');

  // Redirection: jika belum login, hanya beranda yang diizinkan
  useEffect(() => {
    if (!currentUser && currentTab !== 'home') {
      setCurrentTab('home');
    }
  }, [currentUser, currentTab]);

  const handleOpenAuth = (tab: 'login' | 'register' | 'trial' | 'admin' = 'login') => {
    setAuthDefaultTab(tab);
    setAuthModalOpen(true);
  };

  const handleOpenStudioFromModal = (id: 'scratch' | 'microbit' | 'pictoblox') => {
    openStudio(id);
    setCurrentTab('studios');
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      {/* Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenAuth={handleOpenAuth}
      />

      {/* Trial / Pending Notification Banner */}
      <TrialBanner onOpenAuth={handleOpenAuth} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {!currentUser ? (
          // SEBELUM LOGIN: HANYA BERANDA YANG TAMPIL
          <HomeView
            onOpenAuth={handleOpenAuth}
            onNavigateToMaterials={() => handleOpenAuth('login')}
            onNavigateToStudios={() => handleOpenAuth('login')}
          />
        ) : (
          // SETELAH LOGIN: SEMUA FITUR (MATERI, STUDIO, LEADERBOARD, DLL) TERBUKA
          <>
            {currentTab === 'home' && (
              <HomeView
                onOpenAuth={handleOpenAuth}
                onNavigateToMaterials={() => setCurrentTab('materi')}
                onNavigateToStudios={() => setCurrentTab('studios')}
              />
            )}

            {currentTab === 'materi' && (
              <LearningPath
                onSelectMaterial={openMaterial}
                onOpenAuth={handleOpenAuth}
              />
            )}

            {currentTab === 'studios' && <StudioView />}

            {currentTab === 'leaderboard' && <Leaderboard />}

            {currentTab === 'admin' && <AdminPanel />}

            {currentTab === 'instruktur' && <InstructorPanel />}

            {/* Tabel Database Pengguna HANYA DAPAT DIAKSES OLEH ADMIN */}
            {currentTab === 'sheets' && (
              currentUser?.role === 'admin' ? (
                <SheetsView />
              ) : (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 text-center max-w-lg mx-auto shadow-sm my-12">
                  <div className="w-16 h-16 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-4 border border-rose-200 dark:border-rose-800">
                    <Lock className="w-8 h-8" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Akses Terbatas: Khusus Admin
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                    Halaman <strong>Tabel Database Pengguna</strong> hanya dapat diakses dan dikelola secara langsung oleh akun Administrator (Kepala Instruktur Pak Guru Luky).
                  </p>
                  <div className="mt-6 flex justify-center gap-3">
                    <button
                      onClick={() => setCurrentTab('materi')}
                      className="px-4 py-2 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs"
                    >
                      Kembali ke Materi Belajar
                    </button>
                  </div>
                </div>
              )
            )}
          </>
        )}
      </main>

      {/* Modals */}
      <MaterialModal
        material={selectedMaterial}
        onClose={() => openMaterial(null)}
        onOpenStudio={handleOpenStudioFromModal}
        onOpenAuth={handleOpenAuth}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab={authDefaultTab}
      />

      {/* Digital Certificate Modal */}
      <CertificateModal
        user={viewingCertificateUser}
        onClose={() => setViewingCertificateUser(null)}
      />

      {/* HTML Student Progress Report Modal */}
      <ProgressReportModal
        user={viewingReportUser}
        onClose={() => setViewingReportUser(null)}
      />

      {/* Floating Interactive Toast Feedback System */}
      <ToastNotification />

      {/* Modern High-End Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
                <Code2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-white font-bold text-sm">GenZi Code</span>
                <p className="text-[11px] text-slate-400">
                  Platform Belajar Coding & Kecerdasan Buatan Mandiri Berjenjang
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
              <span className="text-slate-500">Tautan Resmi Studio:</span>
              <a
                href="https://scratch.mit.edu/projects/editor/?tutorial=getStarted"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:text-amber-300 flex items-center gap-1"
                title="Buka Scratch 3.0 Editor & Tutorial Asli"
              >
                <Code2 className="w-3.5 h-3.5" />
                Scratch MIT
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
              <a
                href="https://makecode.microbit.org/#editor"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                title="Buka Microsoft MakeCode Micro:bit Editor Asli"
              >
                <Cpu className="w-3.5 h-3.5" />
                Micro:bit MakeCode
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
              <a
                href="https://pictoblox.ai/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                title="Buka PictoBlox AI & Robotics Web Asli"
              >
                <Bot className="w-3.5 h-3.5" />
                PictoBlox AI
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
              <a
                href="https://codecombat.com/play"
                target="_blank"
                rel="noopener noreferrer"
                className="text-rose-400 hover:text-rose-300 flex items-center gap-1"
                title="Buka CodeCombat RPG Dungeon Web Asli"
              >
                <Swords className="w-3.5 h-3.5" />
                CodeCombat RPG
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
            <div className="flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>Database: Cloud Database + Google Sheets Matrix System</span>
            </div>
            {/* User Requested Copyright */}
            <div className="text-center sm:text-right">
              <p className="font-semibold text-slate-300 text-xs">
                @copyright by. Pak Guru Luky
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">
                © {new Date().getFullYear()} GenZi Code. Dikembangkan khusus untuk instruktur & siswa coding anak masa kini.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

