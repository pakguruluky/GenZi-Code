import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { OnlineClassSchedule, MeetingPlatform, ClassStatus } from '../types';
import {
  Video,
  Calendar,
  Clock,
  ExternalLink,
  Copy,
  Check,
  Plus,
  Trash2,
  Edit2,
  User,
  Sparkles,
  ShieldAlert,
  Radio,
  CheckCircle2,
  AlertCircle,
  X
} from 'lucide-react';

export const OnlineClassView: React.FC = () => {
  const {
    currentUser,
    onlineClasses,
    createOnlineClass,
    updateOnlineClass,
    deleteOnlineClass,
    recordClassAttendance
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'upcoming' | 'completed'>('upcoming');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<OnlineClassSchedule | null>(null);

  // Form states for Admin
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    platform: MeetingPlatform;
    meetingUrl: string;
    meetingId: string;
    passcode: string;
    instructorName: string;
    dateTime: string;
    durationMinutes: number;
    targetAudience: string;
    status: ClassStatus;
  }>({
    title: '',
    description: '',
    platform: 'zoom',
    meetingUrl: '',
    meetingId: '',
    passcode: '',
    instructorName: currentUser?.name || 'Bapak Guru Hilman (Kepala Instruktur)',
    dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    durationMinutes: 60,
    targetAudience: 'Semua Siswa GenZi Code',
    status: 'scheduled'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'instruktur';

  const handleCopy = (text: string, fieldKey: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const openCreateModal = () => {
    setEditingClass(null);
    setFormData({
      title: '',
      description: '',
      platform: 'zoom',
      meetingUrl: '',
      meetingId: '',
      passcode: '',
      instructorName: currentUser?.name || 'Bapak Guru Hilman (Kepala Instruktur)',
      dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      durationMinutes: 60,
      targetAudience: 'Semua Siswa GenZi Code',
      status: 'scheduled'
    });
    setModalOpen(true);
  };

  const openEditModal = (cls: OnlineClassSchedule) => {
    setEditingClass(cls);
    setFormData({
      title: cls.title,
      description: cls.description || '',
      platform: cls.platform,
      meetingUrl: cls.meetingUrl,
      meetingId: cls.meetingId || '',
      passcode: cls.passcode || '',
      instructorName: cls.instructorName,
      dateTime: cls.dateTime,
      durationMinutes: cls.durationMinutes,
      targetAudience: cls.targetAudience || 'Semua Siswa GenZi Code',
      status: cls.status
    });
    setModalOpen(true);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.meetingUrl.trim()) {
      alert('Judul Kelas dan Tautan Link Meeting wajib diisi.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingClass) {
        await updateOnlineClass(editingClass.id, formData);
      } else {
        await createOnlineClass(formData);
      }
      setModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (cls: OnlineClassSchedule) => {
    if (window.confirm(`Yakin ingin menghapus jadwal kelas "${cls.title}"?`)) {
      await deleteOnlineClass(cls.id);
    }
  };

  // Filter classes
  const now = new Date();
  const filteredClasses = onlineClasses.filter(c => {
    const classDate = new Date(c.dateTime);
    if (activeFilter === 'upcoming') {
      return c.status !== 'completed' && c.status !== 'cancelled';
    }
    if (activeFilter === 'completed') {
      return c.status === 'completed' || classDate < now;
    }
    return true;
  });

  const formatDateTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) + ' WIB';
    } catch {
      return isoString;
    }
  };

  const getTimeRemaining = (isoString: string) => {
    try {
      const target = new Date(isoString).getTime();
      const diff = target - Date.now();
      if (diff <= 0) return 'Sedang Berlangsung / Hari Ini';
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const days = Math.floor(hours / 24);
      if (days > 0) {
        return `Dimulai dalam ${days} hari ${hours % 24} jam`;
      }
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return `Dimulai dalam ${hours} jam ${minutes} menit`;
    } catch {
      return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-md">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30 text-xs font-bold uppercase tracking-wider mb-3">
              <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              Sesi Tatap Muka Interaktif
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
              Jadwal Kelas Online (Zoom & Google Meet)
            </h1>
            <p className="text-blue-100/80 text-xs sm:text-sm mt-2 leading-relaxed">
              Ikuti bimbingan langsung tatap muka bersama Instruktur Ahli GenZi Code. Pelajari trik logika algoritma, pembuatan game, dan integrasi Artificial Intelligence secara live.
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={openCreateModal}
              className="px-5 py-3 rounded-2xl bg-white text-indigo-950 font-black text-xs sm:text-sm hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 shrink-0"
            >
              <Plus className="w-4 h-4 text-indigo-600" />
              <span>Tambah Jadwal Kelas Baru</span>
            </button>
          )}
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-6 border-t border-white/10 overflow-x-auto text-xs">
          {[
            { id: 'upcoming', label: `Mendatang / Aktif (${onlineClasses.filter(c => c.status !== 'completed' && c.status !== 'cancelled').length})` },
            { id: 'all', label: `Semua Sesi (${onlineClasses.length})` },
            { id: 'completed', label: 'Riwayat Selesai' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-colors whitespace-nowrap ${
                activeFilter === tab.id
                  ? 'bg-white text-indigo-950 shadow-xs'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Online Classes Cards Grid */}
      {filteredClasses.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-xs max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-4 border border-blue-200 dark:border-blue-800">
            <Video className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white">
            Belum Ada Kelas Online yang Dijadwalkan
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Instruktur akan segera mengumumkan jadwal sesi live Zoom atau Google Meet berikutnya.
          </p>
          {isAdmin && (
            <button
              onClick={openCreateModal}
              className="mt-5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors inline-flex items-center gap-2 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Buat Jadwal Kelas Sekarang
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredClasses.map(cls => {
            const isZoom = cls.platform === 'zoom';
            const isOngoing = cls.status === 'ongoing';
            const isCompleted = cls.status === 'completed';

            return (
              <div
                key={cls.id}
                className={`bg-white dark:bg-slate-900 rounded-3xl border transition-all p-6 shadow-xs flex flex-col justify-between ${
                  isOngoing
                    ? 'border-rose-400 dark:border-rose-600 ring-2 ring-rose-400/30'
                    : isZoom
                    ? 'border-blue-200 dark:border-blue-900/60 hover:border-blue-400'
                    : 'border-emerald-200 dark:border-emerald-900/60 hover:border-emerald-400'
                }`}
              >
                <div>
                  {/* Top Bar: Platform & Status */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                          isZoom
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-emerald-600 text-white shadow-xs'
                        }`}
                      >
                        <Video className="w-3.5 h-3.5" />
                        {isZoom ? 'Zoom Meeting' : 'Google Meet'}
                      </span>

                      {isOngoing && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-300 animate-pulse">
                          <Radio className="w-3 h-3 text-rose-600" />
                          LIVE SEKARANG
                        </span>
                      )}

                      {isCompleted && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          <CheckCircle2 className="w-3 h-3" />
                          Selesai
                        </span>
                      )}
                    </div>

                    {isAdmin && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditModal(cls)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Edit Jadwal"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(cls)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Hapus Jadwal"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Title & Target */}
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-snug">
                    {cls.title}
                  </h3>

                  {cls.description && (
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                      {cls.description}
                    </p>
                  )}

                  {/* Schedule Details Meta */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                      <Calendar className="w-4 h-4 text-indigo-500 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Waktu Sesi</span>
                        <span className="font-bold">{formatDateTime(cls.dateTime)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                      <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Durasi & Status</span>
                        <span className="font-bold">{cls.durationMinutes} Menit • {getTimeRemaining(cls.dateTime)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 sm:col-span-2 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                      <User className="w-4 h-4 text-emerald-500 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Instruktur Pengampu</span>
                        <span className="font-bold">{cls.instructorName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Meeting Credentials Box (ID & Passcode) */}
                  <div className="mt-4 p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 space-y-2 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">Meeting ID:</span>
                      <div className="flex items-center gap-1.5">
                        <code className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 font-mono font-bold text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800">
                          {cls.meetingId || '-'}
                        </code>
                        {cls.meetingId && (
                          <button
                            onClick={() => handleCopy(cls.meetingId || '', `id-${cls.id}`)}
                            className="p-1 rounded-md text-slate-500 hover:text-indigo-600 hover:bg-white dark:hover:bg-slate-800 transition-colors"
                            title="Salin Meeting ID"
                          >
                            {copiedField === `id-${cls.id}` ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-blue-100 dark:border-blue-900/40">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">Passcode / Sandi:</span>
                      <div className="flex items-center gap-1.5">
                        <code className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 font-mono font-bold text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800">
                          {cls.passcode || '(Tanpa Sandi)'}
                        </code>
                        {cls.passcode && (
                          <button
                            onClick={() => handleCopy(cls.passcode || '', `pwd-${cls.id}`)}
                            className="p-1 rounded-md text-slate-500 hover:text-indigo-600 hover:bg-white dark:hover:bg-slate-800 transition-colors"
                            title="Salin Sandi"
                          >
                            {copiedField === `pwd-${cls.id}` ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Direct Action Link */}
                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <a
                    href={cls.meetingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => recordClassAttendance(cls)}
                    className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xs ${
                      isZoom
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200 dark:shadow-none hover:shadow-md'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200 dark:shadow-none hover:shadow-md'
                    }`}
                  >
                    <span>Masuk ke Kelas {isZoom ? 'Zoom' : 'Google Meet'}</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Form Tambah / Edit Kelas Online (Khusus Admin) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    {editingClass ? 'Edit Jadwal Kelas Online' : 'Tambah Jadwal Kelas Online'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Tersimpan langsung ke database realtime dan muncul otomatis di akun siswa
                  </p>
                </div>
              </div>

              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4 mt-5 text-xs sm:text-sm">
              {/* Judul Kelas */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Judul Sesi Kelas Online *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Bimbingan Live: Logika Sensor Micro:bit & Alarm Kebakaran"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              {/* Platform Pilihan */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Platform Video Conference *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, platform: 'zoom' })}
                    className={`py-2 px-3 rounded-xl border font-bold flex items-center justify-center gap-2 transition-all ${
                      formData.platform === 'zoom'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    Zoom Meeting
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, platform: 'gmeet' })}
                    className={`py-2 px-3 rounded-xl border font-bold flex items-center justify-center gap-2 transition-all ${
                      formData.platform === 'gmeet'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    Google Meet
                  </button>
                </div>
              </div>

              {/* Tautan Link Meeting */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Link URL Kelas Online *
                </label>
                <input
                  type="url"
                  required
                  placeholder={
                    formData.platform === 'zoom'
                      ? 'https://zoom.us/j/1234567890?pwd=...'
                      : 'https://meet.google.com/abc-defg-hij'
                  }
                  value={formData.meetingUrl}
                  onChange={e => setFormData({ ...formData, meetingUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-xs"
                />
              </div>

              {/* Meeting ID & Passcode */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Meeting ID
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 812 3456 7890"
                    value={formData.meetingId}
                    onChange={e => setFormData({ ...formData, meetingId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Passcode / Sandi Join
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: genzi2026"
                    value={formData.passcode}
                    onChange={e => setFormData({ ...formData, passcode: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-xs"
                  />
                </div>
              </div>

              {/* Waktu Sesi & Durasi */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tanggal & Waktu Mulai *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.dateTime}
                    onChange={e => setFormData({ ...formData, dateTime: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Durasi (Menit)
                  </label>
                  <input
                    type="number"
                    min={15}
                    max={240}
                    value={formData.durationMinutes}
                    onChange={e => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) || 60 })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              {/* Instruktur & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nama Instruktur
                  </label>
                  <input
                    type="text"
                    value={formData.instructorName}
                    onChange={e => setFormData({ ...formData, instructorName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Status Kelas
                  </label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="scheduled">Akan Datang (Terjadwal)</option>
                    <option value="ongoing">Sedang Berlangsung (LIVE)</option>
                    <option value="completed">Selesai</option>
                  </select>
                </div>
              </div>

              {/* Deskripsi Pembahasan */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Deskripsi / Topik Pembahasan
                </label>
                <textarea
                  rows={2}
                  placeholder="Ringkasan materi atau persiapan yang perlu dibawa siswa..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-xs flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingClass ? 'Simpan Perubahan' : 'Jadwalkan Kelas'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
