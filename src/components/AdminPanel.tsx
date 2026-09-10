import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SubscriptionDuration } from '../types';
import {
  DURATION_OPTIONS,
  formatDurationLabel,
  getRemainingDaysText,
  isAccountExpired
} from '../utils/subscription';
import { ALL_MATERIALS } from '../data/curriculumData';
import { DatabaseTableView } from './DatabaseTableView';
import {
  ShieldAlert,
  UserCheck,
  UserX,
  UserPlus,
  GraduationCap,
  Sparkles,
  Table,
  Download,
  RotateCcw,
  Trash2,
  RefreshCw,
  CheckCircle2,
  Clock,
  Search,
  Database,
  FileSpreadsheet,
  Plus,
  Award,
  AlertTriangle,
  Calendar
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const {
    currentUser,
    users,
    approveStudent,
    rejectStudent,
    registerStudentDirectly,
    addInstructorDirectly,
    updateUserDuration,
    deleteUser,
    clearDemoData,
    refreshDatabase,
    resetUserProgress,
    getCompletionPercentage,
    exportTableToCSV,
    setViewingCertificateUser,
    setViewingReportUser
  } = useApp();

  const [activeTab, setActiveTab] = useState<'approvals' | 'register_student' | 'active_students' | 'instructors' | 'sheets_db'>('approvals');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [isClearingDemo, setIsClearingDemo] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Form states
  const [studentForm, setStudentForm] = useState<{
    name: string;
    email: string;
    school: string;
    phone: string;
    notes: string;
    duration: SubscriptionDuration;
  }>({
    name: '',
    email: '',
    school: '',
    phone: '',
    notes: '',
    duration: '3_bulan'
  });
  const [instructorForm, setInstructorForm] = useState({
    name: '',
    email: '',
    school: 'GenZi Code Academy',
    phone: '',
    notes: 'Instruktur Resmi GenZi Code'
  });

  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const pendingStudents = users.filter(u => u.status === 'pending');
  const activeStudents = users.filter(u => u.role === 'siswa' && u.status === 'active');
  const instructors = users.filter(u => u.role === 'instruktur');
  const trialUsers = users.filter(u => u.role === 'trial');

  const showFeedback = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentForm.name || !studentForm.email) {
      showFeedback('Nama dan Email siswa wajib diisi.', 'error');
      return;
    }
    try {
      await registerStudentDirectly({
        name: studentForm.name,
        email: studentForm.email,
        school: studentForm.school,
        phone: studentForm.phone,
        notes: studentForm.notes,
        duration: studentForm.duration
      });
      setStudentForm({ name: '', email: '', school: '', phone: '', notes: '', duration: '3_bulan' });
      showFeedback(`Siswa "${studentForm.name}" berhasil didaftarkan dengan durasi ${formatDurationLabel(studentForm.duration)}.`);
    } catch {
      showFeedback('Gagal mendaftarkan siswa.', 'error');
    }
  };

  const handleCreateInstructor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instructorForm.name || !instructorForm.email) {
      showFeedback('Nama dan Email instruktur wajib diisi.', 'error');
      return;
    }
    try {
      await addInstructorDirectly(instructorForm);
      setInstructorForm({ name: '', email: '', school: 'GenZi Code Academy', phone: '', notes: 'Instruktur Resmi' });
      showFeedback(`Instruktur "${instructorForm.name}" berhasil ditambahkan.`);
    } catch {
      showFeedback('Gagal menambahkan instruktur.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Admin Header with Security & Database State */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-rose-600 uppercase tracking-wider mb-1">
              <ShieldAlert className="w-4 h-4" />
              Portal Administrator GenZi Code
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Pusat Manajemen & Kontrol Belajar
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Kelola persetujuan siswa mandiri, pendaftaran langsung, penambahan instruktur, dan pemantauan data pada tabel database aplikasi.
            </p>
          </div>

          {/* Verification Badge & Database Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span>Data Asli Database</span>
            </div>
            <button
              onClick={async () => {
                setIsRefreshing(true);
                const res = await refreshDatabase();
                setIsRefreshing(false);
                showFeedback(res.message);
              }}
              disabled={isRefreshing}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
              title="Sinkronkan data langsung dari Cloud Firestore Backend"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Menyinkronkan...' : 'Sinkronkan Database'}</span>
            </button>
            <button
              onClick={() => setActiveTab('sheets_db')}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
              title="Buka Tabel Database Pengguna di Aplikasi"
            >
              <Table className="w-3.5 h-3.5" />
              <span>Buka Tabel Data</span>
            </button>
            <button
              onClick={async () => {
                if (window.confirm('Bersihkan semua akun demo tiruan dari sistem dan Database? Hanya akun asli yang akan disimpan.')) {
                  setIsClearingDemo(true);
                  await clearDemoData();
                  setIsClearingDemo(false);
                  showFeedback('Seluruh akun demo telah dibersihkan. Sistem kini 100% menggunakan data asli.');
                }
              }}
              disabled={isClearingDemo}
              className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-colors flex items-center gap-1.5"
              title="Hapus akun demo tiruan dari memori dan Database"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
              <span>{isClearingDemo ? 'Membersihkan...' : 'Bersihkan Data Demo'}</span>
            </button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-yellow-800 uppercase">Menunggu Approval</span>
              <Clock className="w-4 h-4 text-yellow-600" />
            </div>
            <p className="text-2xl font-black text-yellow-900 mt-1">{pendingStudents.length}</p>
            <span className="text-[11px] text-yellow-700 font-medium">Perlu ditindaklanjuti</span>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 uppercase">Siswa Aktif</span>
              <UserCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-black text-emerald-900 mt-1">{activeStudents.length}</p>
            <span className="text-[11px] text-emerald-700 font-medium">Akses berjenjang penuh</span>
          </div>

          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-800 uppercase">Instruktur</span>
              <GraduationCap className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-2xl font-black text-amber-900 mt-1">{instructors.length}</p>
            <span className="text-[11px] text-amber-700 font-medium">Ditambah oleh admin</span>
          </div>

          <div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-800 uppercase">Akun Trial</span>
              <Sparkles className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-2xl font-black text-purple-900 mt-1">{trialUsers.length}</p>
            <span className="text-[11px] text-purple-700 font-medium">Batas 1x & 1 modul</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 mt-6 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('approvals')}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-t-xl transition-colors relative flex items-center gap-2 ${
              activeTab === 'approvals'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Persetujuan Siswa</span>
            {pendingStudents.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                {pendingStudents.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('register_student')}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-t-xl transition-colors flex items-center gap-2 ${
              activeTab === 'register_student'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Daftarkan Siswa Langsung</span>
          </button>

          <button
            onClick={() => setActiveTab('active_students')}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-t-xl transition-colors flex items-center gap-2 ${
              activeTab === 'active_students'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Durasi & Masa Aktif Siswa ({activeStudents.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('instructors')}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-t-xl transition-colors flex items-center gap-2 ${
              activeTab === 'instructors'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Kelola Instruktur</span>
          </button>

          <button
            onClick={() => setActiveTab('sheets_db')}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-t-xl transition-colors flex items-center gap-2 ${
              activeTab === 'sheets_db'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Table className="w-4 h-4 text-indigo-400" />
            <span>Tabel Database Pengguna</span>
          </button>
        </div>
      </div>

      {/* Feedback Toast */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl text-sm font-semibold flex items-center gap-2 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
              : 'bg-rose-100 text-rose-900 border border-rose-300'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* TAB 1: PENDING APPROVALS */}
      {activeTab === 'approvals' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Verifikasi & Persetujuan Siswa Mandiri
              </h2>
              <p className="text-xs text-slate-500">
                Sesuai aturan: siswa yang mendaftar mandiri <strong>baru akan aktif apabila setelah di-approve Admin</strong>.
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 bg-yellow-100 text-yellow-800 rounded-lg">
              {pendingStudents.length} Menunggu
            </span>
          </div>

          {pendingStudents.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-800">
                Tidak ada pendaftaran tertunda.
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Semua siswa yang mendaftar mandiri telah diverifikasi atau belum ada pendaftar baru.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[11px]">
                    <th className="p-3">Nama Siswa</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Sekolah / Lembaga</th>
                    <th className="p-3">Pilihan Paket Belajar</th>
                    <th className="p-3">Waktu Daftar</th>
                    <th className="p-3 text-right">Tindakan Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pendingStudents.map(student => (
                    <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-bold text-slate-900">
                        {student.name}
                        <span className="block text-[10px] text-amber-600 font-normal">
                          Status: Menunggu Approval
                        </span>
                      </td>
                      <td className="p-3 text-slate-600 font-mono">{student.email}</td>
                      <td className="p-3 text-slate-700">{student.school || '-'}</td>
                      <td className="p-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          <Clock className="w-3 h-3" />
                          {formatDurationLabel(student.duration || '3_bulan')}
                        </span>
                      </td>
                      <td className="p-3 text-slate-500">
                        {new Date(student.registeredAt).toLocaleString('id-ID')}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              approveStudent(student.id);
                              showFeedback(`Siswa ${student.name} berhasil disetujui (Approved) dengan paket ${formatDurationLabel(student.duration || '3_bulan')}!`);
                            }}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Approve (Aktifkan)
                          </button>
                          <button
                            onClick={() => {
                              rejectStudent(student.id);
                              showFeedback(`Pendaftaran ${student.name} ditolak.`, 'error');
                            }}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200"
                          >
                            <UserX className="w-3.5 h-3.5" />
                            Tolak
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: REGISTER STUDENT DIRECTLY */}
      {activeTab === 'register_student' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs max-w-2xl">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-indigo-600" />
              Daftarkan Siswa Secara Langsung (Oleh Admin)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Siswa yang didaftarkan langsung oleh Admin akan <strong>otomatis berstatus AKTIF</strong>, masa aktif mulai dihitung hari ini, dan langsung dapat mengakses modul pembelajaran.
            </p>
          </div>

          <form onSubmit={handleCreateStudent} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Lengkap Siswa *
              </label>
              <input
                type="text"
                required
                value={studentForm.name}
                onChange={e => setStudentForm({ ...studentForm, name: e.target.value })}
                placeholder="Contoh: Muhammad Rizky Pratama"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Siswa *
                </label>
                <input
                  type="email"
                  required
                  value={studentForm.email}
                  onChange={e => setStudentForm({ ...studentForm, email: e.target.value })}
                  placeholder="rizky@siswa.genzi.id"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Sekolah / Asal Instansi
                </label>
                <input
                  type="text"
                  value={studentForm.school}
                  onChange={e => setStudentForm({ ...studentForm, school: e.target.value })}
                  placeholder="Contoh: SMP Negeri 2 Surabaya"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Subscription Duration Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                Pilihan Durasi Paket Belajar Siswa *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {DURATION_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setStudentForm({ ...studentForm, duration: opt.value })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      studentForm.duration === opt.value
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 text-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold">{opt.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{opt.description}</div>
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">
                Masa berlaku dihitung mulai saat akun aktif. Akses pembelajaran akan otomatis ditutup begitu masa berlaku selesai.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  No. Telepon / WhatsApp
                </label>
                <input
                  type="tel"
                  value={studentForm.phone}
                  onChange={e => setStudentForm({ ...studentForm, phone: e.target.value })}
                  placeholder="081234567890"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Catatan Tambahan (Opsional)
                </label>
                <input
                  type="text"
                  value={studentForm.notes}
                  onChange={e => setStudentForm({ ...studentForm, notes: e.target.value })}
                  placeholder="Contoh: Kelas Ekskul Robotika A"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Daftarkan & Aktifkan Siswa
            </button>
          </form>
        </div>
      )}

      {/* TAB: ACTIVE STUDENTS DURATION MANAGEMENT */}
      {activeTab === 'active_students' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                Durasi Belajar & Masa Aktif Siswa
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Pantau masa berlaku belajar siswa. Durasi dihitung sejak akun aktif. Admin dapat memperpanjang atau mengubah paket belajar kapan saja.
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-xl border border-indigo-200 self-start sm:self-auto">
              Total {activeStudents.length} Siswa Aktif
            </span>
          </div>

          {activeStudents.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
              <p className="text-sm font-bold text-slate-700">Belum ada siswa aktif terdaftar.</p>
              <p className="text-xs text-slate-500 mt-1">Daftarkan siswa baru atau approve pendaftaran siswa mandiri.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[11px]">
                    <th className="p-3">Nama & Email Siswa</th>
                    <th className="p-3">Paket Durasi</th>
                    <th className="p-3">Mulai Aktif</th>
                    <th className="p-3">Berlaku Sampai</th>
                    <th className="p-3">Sisa Waktu</th>
                    <th className="p-3">Progres Belajar</th>
                    <th className="p-3 text-right">Ubah / Perpanjang Paket</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeStudents.map(student => {
                    const expired = isAccountExpired(student);
                    const percent = getCompletionPercentage(student);
                    return (
                      <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3">
                          <div className="font-bold text-slate-900">{student.name}</div>
                          <div className="text-slate-500 font-mono text-[11px]">{student.email}</div>
                          {student.school && (
                            <div className="text-[10px] text-slate-400">{student.school}</div>
                          )}
                        </td>
                        <td className="p-3">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-800">
                            {formatDurationLabel(student.duration || '3_bulan')}
                          </span>
                        </td>
                        <td className="p-3 text-slate-600 whitespace-nowrap">
                          {student.activatedAt
                            ? new Date(student.activatedAt).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })
                            : '-'}
                        </td>
                        <td className="p-3 text-slate-600 whitespace-nowrap font-medium">
                          {student.expiresAt
                            ? new Date(student.expiresAt).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })
                            : student.duration === 'selamanya'
                            ? 'Selamanya (Tanpa Batas)'
                            : '-'}
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          {expired ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                              <AlertTriangle className="w-3 h-3 text-rose-600" />
                              Kedaluwarsa (Tutup)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              {getRemainingDaysText(student)}
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          <div className="w-24">
                            <div className="flex justify-between text-[10px] font-semibold text-slate-600 mb-1">
                              <span>{percent}%</span>
                              <span>{student.completedMaterialIds?.length || 0} modul</span>
                            </div>
                            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-indigo-600 h-full rounded-full"
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <select
                              value={student.duration || '3_bulan'}
                              onChange={e => {
                                const newDur = e.target.value as SubscriptionDuration;
                                updateUserDuration(student.id, newDur);
                                showFeedback(`Paket belajar ${student.name} diperbarui ke ${formatDurationLabel(newDur)}.`);
                              }}
                              className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              title="Ubah durasi paket belajar siswa"
                            >
                              {DURATION_OPTIONS.map(d => (
                                <option key={d.value} value={d.value}>
                                  {d.label}
                                </option>
                              ))}
                            </select>

                            <button
                              onClick={() => setViewingCertificateUser(student)}
                              className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                              title="Lihat Sertifikat Digital Siswa"
                            >
                              <Award className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: INSTRUCTORS MANAGEMENT */}
      {activeTab === 'instructors' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Instructor Form */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs lg:col-span-1">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-2">
              <GraduationCap className="w-5 h-5 text-amber-600" />
              Tambah Instruktur Baru
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Instruktur memiliki akses penuh melihat progres siswa, mengajar materi, dan mendampingi kelas.
            </p>

            <form onSubmit={handleCreateInstructor} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Instruktur *
                </label>
                <input
                  type="text"
                  required
                  value={instructorForm.name}
                  onChange={e => setInstructorForm({ ...instructorForm, name: e.target.value })}
                  placeholder="Kak Sari - Instruktur AI"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Instruktur *
                </label>
                <input
                  type="email"
                  required
                  value={instructorForm.email}
                  onChange={e => setInstructorForm({ ...instructorForm, email: e.target.value })}
                  placeholder="sari@genzicode.id"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Spesialisasi / Keahlian
                </label>
                <input
                  type="text"
                  value={instructorForm.school}
                  onChange={e => setInstructorForm({ ...instructorForm, school: e.target.value })}
                  placeholder="Scratch & Micro:bit Expert"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  No. Telepon
                </label>
                <input
                  type="tel"
                  value={instructorForm.phone}
                  onChange={e => setInstructorForm({ ...instructorForm, phone: e.target.value })}
                  placeholder="081298765432"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Tambah Instruktur
              </button>
            </form>
          </div>

          {/* List of Instructors */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs lg:col-span-2">
            <h3 className="text-base font-bold text-slate-900 mb-3">
              Daftar Instruktur Terdaftar ({instructors.length})
            </h3>
            <div className="space-y-3">
              {instructors.map(inst => (
                <div
                  key={inst.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                      {inst.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{inst.name}</h4>
                      <p className="text-xs text-slate-500 font-mono">{inst.email}</p>
                      <span className="text-[11px] text-amber-700 font-medium">
                        {inst.school || 'Instruktur GenZi'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 text-[11px] font-bold bg-emerald-100 text-emerald-800 rounded-lg">
                      Aktif
                    </span>
                    <button
                      onClick={() => {
                        deleteUser(inst.id);
                        showFeedback(`Instruktur ${inst.name} dihapus.`, 'error');
                      }}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Hapus Instruktur"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: IN-APP DATABASE TABLE VIEW */}
      {activeTab === 'sheets_db' && (
        <DatabaseTableView />
      )}
    </div>
  );
};
