import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SubscriptionDuration } from '../types';
import { DURATION_OPTIONS } from '../utils/subscription';
import {
  X,
  ShieldAlert,
  UserCheck,
  UserPlus,
  Sparkles,
  KeyRound,
  Mail,
  GraduationCap,
  School,
  Phone,
  AlertCircle,
  CheckCircle2,
  LogIn,
  Clock
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register' | 'trial' | 'admin';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'login'
}) => {
  const {
    loginAsAdmin,
    loginUser,
    registerSelfStudent,
    startTrialSession
  } = useApp();

  const [tab, setTab] = useState<'login' | 'register' | 'trial' | 'admin'>(defaultTab);

  // Forms
  const [adminPassword, setAdminPassword] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [registerForm, setRegisterForm] = useState<{
    name: string;
    email: string;
    school: string;
    phone: string;
    duration: SubscriptionDuration;
  }>({
    name: '',
    email: '',
    school: '',
    phone: '',
    duration: '3_bulan'
  });
  const [trialName, setTrialName] = useState('');
  const [trialEmail, setTrialEmail] = useState('');

  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync tab with defaultTab whenever modal opens
  React.useEffect(() => {
    if (isOpen) {
      setTab(defaultTab);
      setMessage(null);
    }
  }, [defaultTab, isOpen]);

  if (!isOpen) return null;

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const res = loginAsAdmin(adminPassword);
    if (res.success) {
      onClose();
    } else {
      setMessage({ type: 'error', text: res.message || 'Password salah' });
    }
  };

  const handleUserLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail) {
      setMessage({ type: 'error', text: 'Masukkan email Anda.' });
      return;
    }
    const res = loginUser(loginEmail);
    if (res.success) {
      onClose();
    } else {
      setMessage({ type: 'error', text: res.message || 'Login gagal.' });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerForm.name || !registerForm.email) {
      setMessage({ type: 'error', text: 'Nama dan email wajib diisi.' });
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await registerSelfStudent(registerForm);
      if (res.success) {
        setMessage({ type: 'success', text: res.message || 'Pendaftaran berhasil.' });
        setRegisterForm({ name: '', email: '', school: '', phone: '', duration: '3_bulan' });
      } else {
        setMessage({ type: 'error', text: res.message || 'Pendaftaran gagal.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTrial = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await startTrialSession(trialName || 'Siswa Trial', trialEmail);
      if (res.success) {
        onClose();
      } else {
        setMessage({ type: 'error', text: res.message || 'Gagal memulai trial.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-fade-in">
        {/* Header Tabs */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-1 overflow-x-auto">
            <button
              onClick={() => { setTab('login'); setMessage(null); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                tab === 'login' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Masuk
            </button>
            <button
              onClick={() => { setTab('register'); setMessage(null); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                tab === 'register' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Daftar Mandiri
            </button>
            <button
              onClick={() => { setTab('trial'); setMessage(null); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                tab === 'trial' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Trial (1x)
            </button>
            <button
              onClick={() => { setTab('admin'); setMessage(null); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 ${
                tab === 'admin' ? 'bg-rose-600 text-white shadow-xs' : 'text-rose-700 hover:bg-rose-50'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              Admin
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {message && (
            <div
              className={`p-3.5 rounded-xl text-xs font-semibold flex items-start gap-2 ${
                message.type === 'error'
                  ? 'bg-rose-50 text-rose-800 border border-rose-200'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}
            >
              {message.type === 'error' ? (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              ) : (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {/* TAB: LOGIN */}
          {tab === 'login' && (
            <form onSubmit={handleUserLogin} className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Masuk ke Akun GenZi</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Masukkan email akun Anda (Siswa Aktif atau Instruktur).
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Alamat Email Terdaftar
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    placeholder="contoh: rian@siswa.genzi.id"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Masuk Sekarang
              </button>

              <div className="pt-2 text-center">
                <p className="text-[11px] text-slate-500">
                  Belum punya akun?{' '}
                  <button
                    type="button"
                    onClick={() => { setTab('register'); setMessage(null); }}
                    className="text-indigo-600 font-bold hover:underline"
                  >
                    Daftar Akun Baru
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* TAB: REGISTER SELF STUDENT */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Pendaftaran Mandiri Siswa</h3>
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs mt-1.5 leading-relaxed">
                  <strong>Penting:</strong> Akun siswa yang mendaftar mandiri akan <strong>aktif setelah diapprove oleh Admin</strong>. Masa berlaku durasi belajar mulai dihitung sejak akun diaktifkan.
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Lengkap Siswa *
                </label>
                <input
                  type="text"
                  required
                  value={registerForm.name}
                  onChange={e => setRegisterForm({ ...registerForm, name: e.target.value })}
                  placeholder="Nama lengkap kamu..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Alamat Email *
                </label>
                <input
                  type="email"
                  required
                  value={registerForm.email}
                  onChange={e => setRegisterForm({ ...registerForm, email: e.target.value })}
                  placeholder="email.kamu@sekolah.sch.id"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Pilihan Durasi Belajar */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-600" />
                  Pilihan Durasi Paket Belajar *
                </label>
                <select
                  value={registerForm.duration}
                  onChange={e => setRegisterForm({ ...registerForm, duration: e.target.value as SubscriptionDuration })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  {DURATION_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label} — {opt.description}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-400 mt-1">
                  Masa berlaku akan mulai aktif saat Admin memverifikasi dan menyetujui akun Anda.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Asal Sekolah
                  </label>
                  <input
                    type="text"
                    value={registerForm.school}
                    onChange={e => setRegisterForm({ ...registerForm, school: e.target.value })}
                    placeholder="SD/SMP/SMA"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    No. WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={registerForm.phone}
                    onChange={e => setRegisterForm({ ...registerForm, phone: e.target.value })}
                    placeholder="08xxxxxxxx"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold rounded-xl text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <UserPlus className="w-4 h-4" />
                {isSubmitting ? 'Menyimpan Pendaftaran...' : 'Daftar (Kirim ke Admin untuk Approval)'}
              </button>
            </form>
          )}

          {/* TAB: TRIAL 1X ACCESS */}
          {tab === 'trial' && (
            <form onSubmit={handleTrial} className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-purple-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  Akses Uji Coba (Trial 1x)
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Sesuai ketentuan, role <strong>Trial hanya dapat akses 1 kali dan 1 modul</strong> (Modul #1 Pengenalan Scratch).
                </p>
              </div>

              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-xs text-purple-800 space-y-1">
                <p>• Akses instan tanpa perlu menunggu approval.</p>
                <p>• Terbatas 1 kali pemakaian sesi.</p>
                <p>• Terbatas hanya untuk 1 modul belajar pertama.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Anda
                </label>
                <input
                  type="text"
                  value={trialName}
                  onChange={e => setTrialName(e.target.value)}
                  placeholder="Contoh: Siswa Tamu"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white font-bold rounded-xl text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                {isSubmitting ? 'Menyiapkan Sesi...' : 'Mulai Akses Trial Sekarang (1x)'}
              </button>
            </form>
          )}

          {/* TAB: ADMIN LOGIN */}
          {tab === 'admin' && (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-rose-900 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-rose-600" />
                  Login Administrator
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Masukkan kata sandi admin resmi GenZi Code untuk masuk.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Password Admin *
                </label>
                <input
                  type="password"
                  required
                  value={adminPassword}
                  onChange={e => setAdminPassword(e.target.value)}
                  placeholder="Masukkan kata sandi administrator..."
                  className="w-full px-3 py-2 text-sm font-mono rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors"
                >
                  Masuk sebagai Admin
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
