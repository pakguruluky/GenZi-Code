import React, { useEffect, useState } from 'react';
import { Material } from '../types';
import { useApp } from '../context/AppContext';
import {
  saveMaterialOffline,
  useNetworkStatus,
  isOfflineMaterialCached
} from '../utils/offlineStorage';
import {
  X,
  FileText,
  Video,
  ExternalLink,
  CheckCircle,
  Lock,
  ArrowRight,
  BookOpen,
  Award,
  Sparkles,
  Laptop,
  WifiOff,
  BookmarkCheck,
  HardDrive
} from 'lucide-react';

interface MaterialModalProps {
  material: Material | null;
  onClose: () => void;
  onOpenStudio: (id: 'scratch' | 'microbit' | 'pictoblox') => void;
  onOpenAuth?: (tab?: 'login' | 'register' | 'trial' | 'admin') => void;
}

export const MaterialModal: React.FC<MaterialModalProps> = ({
  material,
  onClose,
  onOpenStudio,
  onOpenAuth
}) => {
  const {
    currentUser,
    completeMaterial,
    isMaterialUnlocked,
    canAccessMaterial
  } = useApp();

  const isOnline = useNetworkStatus();
  const [isCached, setIsCached] = useState<boolean>(false);

  const access = material ? canAccessMaterial(material) : { allowed: false, reason: '' };
  const isCompleted = currentUser?.completedMaterialIds?.includes(material?.id || '');

  // Simpan ringkasan materi secara otomatis ke penyimpanan lokal saat dibuka
  useEffect(() => {
    if (material && access.allowed) {
      saveMaterialOffline(material, !!isCompleted);
      setIsCached(true);
    } else if (material) {
      setIsCached(isOfflineMaterialCached(material.id));
    }
  }, [material, access.allowed, isCompleted]);

  if (!material) return null;

  const getStudioForCategory = (cat: string): 'scratch' | 'microbit' | 'pictoblox' => {
    if (cat === 'Pictoblox') return 'pictoblox';
    if (cat === 'MakeCode Arcade' || cat === 'Microbit') return 'microbit';
    return 'scratch';
  };

  const associatedStudio = getStudioForCategory(material.category);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden text-slate-900 dark:text-slate-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50/80 dark:bg-slate-800/80">
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-xl ${
                material.type === 'Video'
                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                  : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400'
              }`}
            >
              {material.type === 'Video' ? (
                <Video className="w-5 h-5" />
              ) : (
                <FileText className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                  Modul #{material.sequence}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950/70 text-indigo-800 dark:text-indigo-300">
                  {material.level}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300">
                  {material.category}
                </span>
                {material.semester && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300">
                    Semester {material.semester}
                  </span>
                )}
                {isCompleted && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-600 text-white flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Selesai
                  </span>
                )}
                {/* Offline & Cache Badges */}
                {!isOnline ? (
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 flex items-center gap-1">
                    <WifiOff className="w-3 h-3 text-amber-600" />
                    Mode Offline Aktif
                  </span>
                ) : isCached ? (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center gap-1">
                    <BookmarkCheck className="w-3 h-3 text-emerald-600" />
                    Tersimpan Offline
                  </span>
                ) : null}
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-1">
                {material.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!access.allowed ? (
            <div className="p-8 text-center bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-800 my-6">
              <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-amber-900 dark:text-amber-200 mb-2">
                Materi Terkunci Berjenjang
              </h3>
              <p className="text-sm text-amber-800 dark:text-amber-300 max-w-md mx-auto mb-6">
                {access.reason}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                >
                  Kembali ke Daftar Materi
                </button>
                {!currentUser && onOpenAuth && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenAuth('login');
                    }}
                    className="px-4 py-2 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
                  >
                    Masuk Akun Siswa
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Media Embed Viewer OR Offline Reader Card */}
              {!isOnline ? (
                <div className="rounded-2xl border border-amber-300 dark:border-amber-800 bg-amber-50/80 dark:bg-amber-950/40 p-6 sm:p-8 text-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 flex items-center justify-center mx-auto">
                    <WifiOff className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-amber-950 dark:text-amber-200">
                    Mode Belajar Offline Aktif
                  </h3>
                  <p className="text-xs sm:text-sm text-amber-900/80 dark:text-amber-300/90 max-w-xl mx-auto leading-relaxed">
                    Koneksi internet Anda sedang tidak aktif. Ringkasan materi, deskripsi pembelajaran, capaian kompetensi dasar, dan indikator keberhasilan modul ini telah dimuat dari <strong>Penyimpanan Lokal</strong> perangkat Anda.
                  </p>
                </div>
              ) : (
                <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 aspect-video w-full relative shadow-inner">
                  {material.embedUrl ? (
                    <iframe
                      src={material.embedUrl}
                      className="w-full h-full border-0"
                      title={material.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-white p-6 text-center">
                      <FileText className="w-16 h-16 text-slate-400 mb-3" />
                      <p className="text-base font-semibold mb-2">
                        Dokumen Modul Siap Dibuka
                      </p>
                      <a
                        href={material.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold flex items-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Buka Dokumen Asli di Google Drive
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Tautan Asli & Studio Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  {isOnline ? (
                    <a
                      href={material.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Buka Tautan Asli ({material.type === 'Video' ? 'YouTube/Drive' : 'Google Drive'})
                    </a>
                  ) : (
                    <span className="text-xs text-amber-700 dark:text-amber-400 font-semibold px-2.5 py-1.5 rounded-lg bg-amber-100/70 dark:bg-amber-950/60">
                      Tautan online nonaktif (Mode Offline)
                    </span>
                  )}

                  <button
                    onClick={() => {
                      onOpenStudio(associatedStudio);
                      onClose();
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <Laptop className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    Buka {associatedStudio.toUpperCase()} Studio
                  </button>
                </div>

                {/* Mark Completed Button */}
                {currentUser && (
                  <button
                    onClick={() => completeMaterial(material.id)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs ${
                      isCompleted
                        ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 cursor-default'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-md'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    {isCompleted ? 'Sudah Selesai (Modul Berikutnya Terbuka)' : 'Tandai Selesai & Buka Modul Berikutnya'}
                  </button>
                )}
              </div>

              {/* Silabus & Kompetensi Details (Tersimpan Offline) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    Ringkasan Materi Pelajaran
                  </h4>
                  <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                    {material.description}
                  </p>
                  {material.duration && (
                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/80 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span>Alokasi Waktu Belajar:</span>
                      <strong className="text-slate-800 dark:text-slate-200">{material.duration}</strong>
                    </div>
                  )}
                </div>

                <div className="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    Kompetensi & Indikator Capaian
                  </h4>
                  {material.competency && (
                    <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                      <span className="text-xs font-bold text-slate-900 dark:text-white block mb-0.5">Kompetensi Utama:</span>
                      <span className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed block">{material.competency}</span>
                    </div>
                  )}
                  {material.indicators && (
                    <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                      <span className="text-xs font-bold text-slate-900 dark:text-white block mb-0.5">Indikator Keberhasilan:</span>
                      <span className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed block">{material.indicators}</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span>GenZi Code Learning Path</span>
            {isCached && (
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                • Siap dibaca kapan pun tanpa internet
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 font-semibold text-slate-700 dark:text-slate-200"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

