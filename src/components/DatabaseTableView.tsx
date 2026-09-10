import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ALL_MATERIALS } from '../data/curriculumData';
import { UserAccount, UserRole, UserStatus, SubscriptionDuration } from '../types';
import {
  DURATION_OPTIONS,
  formatDurationLabel,
  getRemainingDaysText,
  isAccountExpired
} from '../utils/subscription';
import {
  Table,
  Search,
  Filter,
  Download,
  UserPlus,
  Trash2,
  RefreshCw,
  RotateCcw,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  Award,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Shield,
  GraduationCap,
  Sparkles,
  User,
  Database,
  X,
  Phone,
  School,
  Check,
  Calendar,
  AlertTriangle
} from 'lucide-react';

export const DatabaseTableView: React.FC = () => {
  const {
    users,
    currentUser,
    approveStudent,
    rejectStudent,
    deleteUser,
    resetUserProgress,
    getCompletionPercentage,
    exportTableToCSV,
    registerStudentDirectly,
    updateUserDuration,
    setViewingCertificateUser,
    setViewingReportUser,
    clearDemoData,
    refreshDatabase
  } = useApp();

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Search, filter, sorting states
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | UserStatus>('all');
  const [sortField, setSortField] = useState<'name' | 'registeredAt' | 'progress' | 'xp' | 'quizScore'>('registeredAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState<{
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
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleSort = (field: 'name' | 'registeredAt' | 'progress' | 'xp' | 'quizScore') => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder(field === 'name' ? 'asc' : 'desc');
    }
  };

  // Filtered and sorted data
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          (u.school && u.school.toLowerCase().includes(q)) ||
          (u.phone && u.phone.toLowerCase().includes(q)) ||
          u.id.toLowerCase().includes(q);
        if (!match) return false;
      }

      // Role filter
      if (roleFilter !== 'all' && u.role !== roleFilter) {
        return false;
      }

      // Status filter
      if (statusFilter !== 'all' && u.status !== statusFilter) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      let valA: any;
      let valB: any;

      if (sortField === 'name') {
        valA = a.name.toLowerCase();
        valB = b.name.toLowerCase();
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      if (sortField === 'registeredAt') {
        valA = new Date(a.registeredAt).getTime();
        valB = new Date(b.registeredAt).getTime();
      } else if (sortField === 'progress') {
        valA = getCompletionPercentage(a);
        valB = getCompletionPercentage(b);
      } else if (sortField === 'xp') {
        valA = a.xp || 0;
        valB = b.xp || 0;
      } else if (sortField === 'quizScore') {
        valA = a.quizScore || 0;
        valB = b.quizScore || 0;
      }

      return sortOrder === 'asc' ? valA - valB : valB - valA;
    });
  }, [users, searchQuery, roleFilter, statusFilter, sortField, sortOrder, getCompletionPercentage]);

  // Statistics
  const totalCount = users.length;
  const activeStudents = users.filter(u => u.role === 'siswa' && u.status === 'active').length;
  const pendingCount = users.filter(u => u.status === 'pending').length;
  const instructorCount = users.filter(u => u.role === 'instruktur').length;
  const avgProgress = Math.round(
    users.reduce((acc, u) => acc + getCompletionPercentage(u), 0) / (users.length || 1)
  );

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.name.trim() || !addForm.email.trim()) {
      alert('Nama dan Email wajib diisi.');
      return;
    }
    await registerStudentDirectly({
      name: addForm.name,
      email: addForm.email,
      school: addForm.school,
      phone: addForm.phone,
      notes: addForm.notes,
      duration: addForm.duration
    });
    setAddForm({ name: '', email: '', school: '', phone: '', notes: '', duration: '3_bulan' });
    setShowAddModal(false);
    showNotification(`Siswa "${addForm.name}" berhasil didaftarkan langsung ke database.`);
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            <Shield className="w-3 h-3 text-rose-600" />
            Admin
          </span>
        );
      case 'instruktur':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <GraduationCap className="w-3 h-3 text-amber-600" />
            Instruktur
          </span>
        );
      case 'siswa':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            <User className="w-3 h-3 text-indigo-600" />
            Siswa
          </span>
        );
      case 'trial':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
            <Sparkles className="w-3 h-3 text-purple-600" />
            Trial 1x
          </span>
        );
    }
  };

  const getStatusBadge = (status: UserStatus) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Aktif
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-700 animate-pulse">
            <Clock className="w-3 h-3 text-amber-600" />
            Menunggu Approval
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            <XCircle className="w-3 h-3 text-rose-600" />
            Ditolak
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {actionNotice && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg border border-slate-700 flex items-center gap-2 text-sm font-semibold animate-fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Main Table Header & Summary Cards */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
              <Database className="w-4 h-4" />
              <span>Database & Tabel Pengguna Aplikasi</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Tabel Data Siswa & Pengguna
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
              Kelola langsung data seluruh siswa, instruktur, dan progres pembelajaran mandiri secara terpusat di aplikasi.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>Tambah Siswa Baru</span>
            </button>

            <button
              onClick={async () => {
                setIsRefreshing(true);
                const res = await refreshDatabase();
                setIsRefreshing(false);
                showNotification(res.message);
              }}
              disabled={isRefreshing}
              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 transition-colors flex items-center gap-1.5"
              title="Sinkronkan data langsung dari Cloud Firestore Backend"
            >
              <RefreshCw className={`w-4 h-4 text-emerald-600 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Menyinkronkan...' : 'Sinkronkan Database'}</span>
            </button>

            <button
              onClick={exportTableToCSV}
              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition-colors flex items-center gap-1.5"
              title="Unduh data tabel dalam format CSV spreadsheet"
            >
              <Download className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <span>Ekspor Tabel (CSV)</span>
            </button>

            <button
              onClick={async () => {
                if (window.confirm('Bersihkan semua data demo tiruan dari sistem? Hanya data akun asli yang akan disimpan.')) {
                  await clearDemoData();
                  showNotification('Seluruh akun demo telah dibersihkan. Tabel kini murni data asli.');
                }
              }}
              className="px-3 py-2 rounded-xl text-xs sm:text-sm font-bold bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 transition-colors flex items-center gap-1.5"
              title="Hapus data demo bawaan"
            >
              <Trash2 className="w-4 h-4 text-rose-500" />
              <span>Bersihkan Demo</span>
            </button>
          </div>
        </div>

        {/* Statistic Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">Total Akun</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{totalCount}</p>
            <span className="text-[11px] text-slate-500">Tersimpan di sistem</span>
          </div>

          <div className="p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-900/50">
            <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-400 uppercase">Siswa Aktif</span>
            <p className="text-2xl font-black text-indigo-900 dark:text-indigo-200 mt-0.5">{activeStudents}</p>
            <span className="text-[11px] text-indigo-600 dark:text-indigo-400">Akses modul penuh</span>
          </div>

          <div className="p-3.5 rounded-xl bg-yellow-50 dark:bg-yellow-950/50 border border-yellow-200 dark:border-yellow-900/50">
            <span className="text-[11px] font-bold text-yellow-800 dark:text-yellow-400 uppercase">Menunggu Approval</span>
            <p className="text-2xl font-black text-yellow-900 dark:text-yellow-200 mt-0.5">{pendingCount}</p>
            <span className="text-[11px] text-yellow-700 dark:text-yellow-400">Pendaftaran mandiri</span>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900/50">
            <span className="text-[11px] font-bold text-amber-800 dark:text-amber-400 uppercase">Instruktur</span>
            <p className="text-2xl font-black text-amber-900 dark:text-amber-200 mt-0.5">{instructorCount}</p>
            <span className="text-[11px] text-amber-700 dark:text-amber-400">Pengampu kelas</span>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900/50 col-span-2 sm:col-span-1">
            <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-400 uppercase">Rata-rata Progress</span>
            <p className="text-2xl font-black text-emerald-900 dark:text-emerald-200 mt-0.5">{avgProgress}%</p>
            <span className="text-[11px] text-emerald-700 dark:text-emerald-400">Dari 54 modul</span>
          </div>
        </div>
      </div>

      {/* Table Filter, Search, and Sorting Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-slate-50/50 dark:bg-slate-850">
          <div className="flex flex-wrap items-center gap-2">
            {/* Role Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Role:</span>
              <select
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value as any)}
                className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">Semua Role ({users.length})</option>
                <option value="siswa">Siswa</option>
                <option value="instruktur">Instruktur</option>
                <option value="admin">Admin</option>
                <option value="trial">Trial</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Status:</span>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value as any)}
                className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">Semua Status</option>
                <option value="active">Aktif</option>
                <option value="pending">Menunggu Approval ({pendingCount})</option>
                <option value="rejected">Ditolak</option>
              </select>
            </div>

            {/* Clear filters shortcut */}
            {(roleFilter !== 'all' || statusFilter !== 'all' || searchQuery) && (
              <button
                onClick={() => {
                  setRoleFilter('all');
                  setStatusFilter('all');
                  setSearchQuery('');
                }}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline px-2 py-1"
              >
                Reset Filter
              </button>
            )}
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama, email, sekolah..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                <th className="p-3 w-12 text-center">#</th>
                <th
                  onClick={() => handleSort('name')}
                  className="p-3 cursor-pointer hover:bg-slate-200/60 dark:hover:bg-slate-750 transition-colors select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Siswa / Pengguna</span>
                    {sortField === 'name' ? (
                      sortOrder === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-indigo-600" /> : <ArrowDown className="w-3.5 h-3.5 text-indigo-600" />
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    )}
                  </div>
                </th>
                <th className="p-3">Role</th>
                <th className="p-3">Status Akun</th>
                <th className="p-3">Sekolah / Kontak</th>
                <th className="p-3">Durasi & Masa Aktif</th>
                <th
                  onClick={() => handleSort('progress')}
                  className="p-3 cursor-pointer hover:bg-slate-200/60 dark:hover:bg-slate-750 transition-colors select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Progres Modul</span>
                    {sortField === 'progress' ? (
                      sortOrder === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-indigo-600" /> : <ArrowDown className="w-3.5 h-3.5 text-indigo-600" />
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    )}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('xp')}
                  className="p-3 cursor-pointer hover:bg-slate-200/60 dark:hover:bg-slate-750 transition-colors select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>XP & Skor</span>
                    {sortField === 'xp' ? (
                      sortOrder === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-indigo-600" /> : <ArrowDown className="w-3.5 h-3.5 text-indigo-600" />
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    )}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('registeredAt')}
                  className="p-3 cursor-pointer hover:bg-slate-200/60 dark:hover:bg-slate-750 transition-colors select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Terdaftar</span>
                    {sortField === 'registeredAt' ? (
                      sortOrder === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-indigo-600" /> : <ArrowDown className="w-3.5 h-3.5 text-indigo-600" />
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    )}
                  </div>
                </th>
                <th className="p-3 text-center w-36">Aksi Cepat</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-slate-500 dark:text-slate-400">
                    <Table className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                    <p className="font-bold text-sm">Tidak ada data pengguna yang sesuai.</p>
                    <p className="text-xs text-slate-400 mt-1">Coba sesuaikan kata kunci pencarian atau filter di atas.</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u, idx) => {
                  const percent = getCompletionPercentage(u);
                  return (
                    <tr
                      key={u.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      {/* # Index */}
                      <td className="p-3 text-center text-slate-400 font-mono text-[11px]">
                        {idx + 1}
                      </td>

                      {/* User Info */}
                      <td className="p-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-center text-xs shrink-0">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                              <span>{u.name}</span>
                              {u.id === currentUser?.id && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 font-semibold">
                                  Anda
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                              {u.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="p-3">
                        {getRoleBadge(u.role)}
                      </td>

                      {/* Status */}
                      <td className="p-3">
                        {getStatusBadge(u.status)}
                      </td>

                      {/* School & Phone */}
                      <td className="p-3">
                        <div className="space-y-0.5 text-[11px]">
                          <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-medium">
                            <School className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate max-w-[150px]" title={u.school || '-'}>
                              {u.school || '-'}
                            </span>
                          </div>
                          {u.phone && (
                            <div className="flex items-center gap-1 text-slate-500 font-mono">
                              <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                              <span>{u.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Subscription Duration & Expiration */}
                      <td className="p-3">
                        {u.role === 'siswa' ? (
                          <div className="space-y-1 text-[11px]">
                            <div className="flex items-center gap-1 font-bold text-slate-800 dark:text-slate-200">
                              <Clock className="w-3 h-3 text-indigo-500 shrink-0" />
                              <span>{formatDurationLabel(u.duration || '3_bulan')}</span>
                            </div>
                            {isAccountExpired(u) ? (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                                <AlertTriangle className="w-2.5 h-2.5" />
                                Akses Ditutup
                              </span>
                            ) : (
                              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                                {getRemainingDaysText(u)}
                              </div>
                            )}
                            {u.expiresAt && (
                              <div className="text-[10px] text-slate-400">
                                s/d {new Date(u.expiresAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">-</span>
                        )}
                      </td>

                      {/* Learning Progress */}
                      <td className="p-3">
                        <div className="w-36 space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-slate-800 dark:text-slate-200">{percent}%</span>
                            <span className="text-slate-500">
                              {u.completedMaterialIds?.length || 0}/{ALL_MATERIALS.length}
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full transition-all"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* XP & Quiz Score */}
                      <td className="p-3 font-mono text-[11px]">
                        <div className="font-bold text-amber-600 dark:text-amber-400">
                          {u.xp || 0} XP
                        </div>
                        <div className="text-slate-500 text-[10px]">
                          Skor Kuis: {u.quizScore || 0}%
                        </div>
                      </td>

                      {/* Registration Date */}
                      <td className="p-3 text-slate-500 dark:text-slate-400 text-[11px] whitespace-nowrap">
                        {new Date(u.registeredAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>

                      {/* Action Controls */}
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {u.status === 'pending' ? (
                            <>
                              <button
                                onClick={async () => {
                                  const res = await approveStudent(u.id);
                                  showNotification(res.message || `Akun ${u.name} telah disetujui.`);
                                }}
                                title="Setujui Siswa"
                                className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] shadow-xs transition-colors"
                              >
                                Approve
                              </button>
                              <button
                                onClick={async () => {
                                  await rejectStudent(u.id);
                                  showNotification(`Pendaftaran ${u.name} ditolak.`);
                                }}
                                title="Tolak Siswa"
                                className="p-1 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              {/* View Report */}
                              <button
                                onClick={() => setViewingReportUser(u)}
                                title="Lihat Rapor Belajar Siswa"
                                className="p-1.5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-lg transition-colors"
                              >
                                <FileText className="w-4 h-4" />
                              </button>

                              {/* View Certificate */}
                              <button
                                onClick={() => setViewingCertificateUser(u)}
                                title="Lihat / Cetak Sertifikat Kelulusan"
                                className="p-1.5 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/60 rounded-lg transition-colors"
                              >
                                <Award className="w-4 h-4" />
                              </button>

                              {/* Reset Progress */}
                              {u.role !== 'admin' && (
                                <button
                                  onClick={() => {
                                    if (window.confirm(`Reset progress belajar siswa "${u.name}" kembali ke 0 modul?`)) {
                                      resetUserProgress(u.id);
                                      showNotification(`Progress ${u.name} telah direset.`);
                                    }
                                  }}
                                  title="Reset Progres Belajar"
                                  className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                </button>
                              )}

                              {/* Delete User */}
                              {u.id !== currentUser?.id && u.role !== 'admin' && (
                                <button
                                  onClick={() => {
                                    if (window.confirm(`Hapus permanen akun pengguna "${u.name}"?`)) {
                                      deleteUser(u.id);
                                      showNotification(`Akun ${u.name} telah dihapus.`);
                                    }
                                  }}
                                  title="Hapus Akun Pengguna"
                                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>

            {/* Table Footer Summary */}
            <tfoot>
              <tr className="bg-slate-100/90 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold border-t-2 border-indigo-500 text-xs">
                <td className="p-3 text-center font-mono text-[10px]">Σ</td>
                <td className="p-3">
                  Menampilkan {filteredUsers.length} dari {users.length} Akun
                </td>
                <td className="p-3" colSpan={3}>
                  Database Aktif: Database Cloud Terpusat
                </td>
                <td className="p-3">
                  Rata-rata: {avgProgress}%
                </td>
                <td className="p-3" colSpan={3}>
                  Kurikulum: 54 Modul Berjenjang GenZi Code
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* MODAL: Tambah Siswa Baru Langsung */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Daftarkan Siswa Baru ke Tabel
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Siswa yang didaftarkan langsung berstatus aktif dan siap belajar
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Lengkap Siswa *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Muhammad Farhan"
                  value={addForm.name}
                  onChange={e => setAddForm({ ...addForm, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Email Siswa *
                </label>
                <input
                  type="email"
                  required
                  placeholder="Contoh: farhan@siswa.genzi.id"
                  value={addForm.email}
                  onChange={e => setAddForm({ ...addForm, email: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Sekolah / Kelas
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: SMPN 1 Bandung"
                    value={addForm.school}
                    onChange={e => setAddForm({ ...addForm, school: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    No. Telepon / WA
                  </label>
                  <input
                    type="tel"
                    placeholder="0812-xxxx-xxxx"
                    value={addForm.phone}
                    onChange={e => setAddForm({ ...addForm, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Durasi Paket Belajar Siswa *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {DURATION_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setAddForm({ ...addForm, duration: opt.value })}
                      className={`p-2 rounded-xl border text-left transition-all ${
                        addForm.duration === opt.value
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 ring-1 ring-indigo-500'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-slate-50/50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="text-[11px] font-bold">{opt.label}</div>
                      <div className="text-[9px] text-slate-500 dark:text-slate-400 mt-0.5">{opt.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Catatan Admin (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Siswa beasiswa kelas Scratch & Micro:bit"
                  value={addForm.notes}
                  onChange={e => setAddForm({ ...addForm, notes: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs transition-colors"
                >
                  Simpan ke Tabel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
