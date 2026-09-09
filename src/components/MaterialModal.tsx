import React from 'react';
import { Material } from '../types';
import { useApp } from '../context/AppContext';
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
  Laptop
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

  if (!material) return null;

  const access = canAccessMaterial(material);
  const isCompleted = currentUser?.completedMaterialIds?.includes(material.id);

  const getStudioForCategory = (cat: string): 'scratch' | 'microbit' | 'pictoblox' => {
    if (cat === 'Pictoblox') return 'pictoblox';
    if (cat === 'MakeCode Arcade' || cat === 'Microbit') return 'microbit';
    return 'scratch';
  };

  const associatedStudio = getStudioForCategory(material.category);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-4 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-xl ${
                material.type === 'Video'
                  ? 'bg-rose-100 text-rose-700'
                  : 'bg-indigo-100 text-indigo-700'
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
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                  Modul #{material.sequence}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                  {material.level}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  {material.category}
                </span>
                {material.semester && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                    Semester {material.semester}
                  </span>
                )}
                {isCompleted && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-600 text-white flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Selesai
                  </span>
                )}
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                {material.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!access.allowed ? (
            <div className="p-8 text-center bg-amber-50 rounded-2xl border border-amber-200 my-6">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-amber-900 mb-2">
                Materi Terkunci Berjenjang
              </h3>
              <p className="text-sm text-amber-800 max-w-md mx-auto mb-6">
                {access.reason}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
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
              {/* Media Embed Viewer */}
              <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-950 aspect-video w-full relative shadow-inner">
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

              {/* Tautan Asli & Studio Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <a
                    href={material.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Buka Tautan Asli ({material.type === 'Video' ? 'YouTube/Drive' : 'Google Drive'})
                  </a>

                  <button
                    onClick={() => {
                      onOpenStudio(associatedStudio);
                      onClose();
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 transition-colors"
                  >
                    <Laptop className="w-4 h-4 text-indigo-600" />
                    Buka {associatedStudio.toUpperCase()} Studio
                  </button>
                </div>

                {/* Mark Completed Button */}
                {currentUser && (
                  <button
                    onClick={() => completeMaterial(material.id)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs ${
                      isCompleted
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-md'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    {isCompleted ? 'Sudah Selesai (Modul Berikutnya Terbuka)' : 'Tandai Selesai & Buka Modul Berikutnya'}
                  </button>
                )}
              </div>

              {/* Silabus & Kompetensi Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                    Deskripsi Materi
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {material.description}
                  </p>
                  {material.duration && (
                    <p className="text-xs text-slate-500 mt-2 font-medium">
                      Alokasi Waktu: <strong className="text-slate-700">{material.duration}</strong>
                    </p>
                  )}
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-600" />
                    Kompetensi & Indikator Keberhasilan
                  </h4>
                  {material.competency && (
                    <div className="mb-2">
                      <span className="text-xs font-bold text-slate-800">Kompetensi: </span>
                      <span className="text-xs text-slate-600">{material.competency}</span>
                    </div>
                  )}
                  {material.indicators && (
                    <div>
                      <span className="text-xs font-bold text-slate-800">Indikator: </span>
                      <span className="text-xs text-slate-600">{material.indicators}</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>GenZi Code Learning Path</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 font-semibold text-slate-700"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
