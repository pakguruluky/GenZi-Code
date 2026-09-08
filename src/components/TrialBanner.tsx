import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Clock, AlertTriangle, ArrowRight, UserPlus, ShieldAlert } from 'lucide-react';

interface TrialBannerProps {
  onOpenAuth: (defaultTab?: 'login' | 'register' | 'trial' | 'admin') => void;
}

export const TrialBanner: React.FC<TrialBannerProps> = ({ onOpenAuth }) => {
  const { currentUser } = useApp();

  if (!currentUser) return null;

  if (currentUser.role === 'trial') {
    return (
      <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 text-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-2.5 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 bg-white/20 rounded-lg shrink-0">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </span>
            <p>
              <strong className="font-semibold underline">Mode Akses Trial:</strong> Anda hanya dapat mengakses <span className="text-amber-200 font-bold">1 kali dan 1 modul pertama</span>.
              Daftar sebagai Siswa resmi untuk membuka 54 materi berjenjang & seluruh fitur studio!
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onOpenAuth('register')}
              className="px-3 py-1 bg-white text-purple-800 hover:bg-purple-50 font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Daftar Siswa Penuh
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentUser.role === 'siswa' && currentUser.status === 'pending') {
    return (
      <div className="bg-amber-50 border-b border-amber-200 text-amber-900">
        <div className="max-w-7xl mx-auto px-4 py-2.5 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 bg-amber-200 rounded-lg shrink-0 text-amber-800">
              <Clock className="w-4 h-4 animate-spin" />
            </span>
            <p>
              <strong className="font-bold">Menunggu Approval Admin:</strong> Akun Anda baru akan aktif dan dapat membuka materi setelah diverifikasi dan didaftarkan melalui Admin GenZi Code.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onOpenAuth('admin')}
              className="px-2.5 py-1 bg-amber-200 hover:bg-amber-300 text-amber-900 font-semibold rounded-lg text-xs flex items-center gap-1 transition-colors"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              Login Admin (Approval)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
