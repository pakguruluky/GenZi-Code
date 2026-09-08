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
  FileSpreadsheet
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
  const selectedStudent = students.find(s => s.id === selectedStudentId) || students[0];

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
