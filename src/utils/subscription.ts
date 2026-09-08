import { SubscriptionDuration, UserAccount } from '../types';

export interface DurationOption {
  value: SubscriptionDuration;
  label: string;
  durationInDays: number | null;
  description: string;
  badge?: string;
}

export const DURATION_OPTIONS: DurationOption[] = [
  {
    value: '1_bulan',
    label: '1 Bulan',
    durationInDays: 30,
    description: 'Akses penuh 30 hari, cocok untuk program liburan atau uji coba intensif.',
  },
  {
    value: '3_bulan',
    label: '3 Bulan',
    durationInDays: 90,
    description: 'Akses 90 hari, ideal untuk menyelesaikan kurikulum Scratch & Micro:bit.',
    badge: 'Paling Populer',
  },
  {
    value: '6_bulan',
    label: '6 Bulan',
    durationInDays: 180,
    description: 'Akses 180 hari (1 semester penuh), optimal untuk sekolah & ekskul.',
  },
  {
    value: '1_tahun',
    label: '1 Tahun',
    durationInDays: 365,
    description: 'Akses 365 hari (1 tahun ajaran), kuasai seluruh kurikulum Scratch hingga AI.',
    badge: 'Terbaik',
  },
  {
    value: 'selamanya',
    label: 'Akses Selamanya',
    durationInDays: null,
    description: 'Akses seumur hidup (Lifetime) tanpa batasan waktu & dapat materi baru.',
    badge: 'VIP Bebas Batas',
  },
];

/**
 * Menghitung tanggal kadaluarsa berdasarkan tanggal aktivasi dan durasi
 */
export function calculateExpirationDate(
  activatedAtIso: string,
  duration: SubscriptionDuration = 'selamanya'
): string | undefined {
  if (duration === 'selamanya') return undefined;

  const startDate = new Date(activatedAtIso);
  const expiryDate = new Date(startDate.getTime());

  switch (duration) {
    case '1_bulan':
      expiryDate.setMonth(expiryDate.getMonth() + 1);
      break;
    case '3_bulan':
      expiryDate.setMonth(expiryDate.getMonth() + 3);
      break;
    case '6_bulan':
      expiryDate.setMonth(expiryDate.getMonth() + 6);
      break;
    case '1_tahun':
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      break;
    default:
      return undefined;
  }

  return expiryDate.toISOString();
}

/**
 * Mengecek apakah akun siswa sudah habis masa aktifnya
 */
export function isAccountExpired(user?: UserAccount | null): boolean {
  if (!user) return false;
  // Admin & Instruktur tidak pernah expired
  if (user.role === 'admin' || user.role === 'instruktur') return false;
  // Jika durasi selamanya atau tidak ada tanggal expired, aktif
  if (!user.expiresAt || user.duration === 'selamanya') return false;

  const now = new Date().getTime();
  const expiry = new Date(user.expiresAt).getTime();
  return now > expiry;
}

/**
 * Menghitung sisa hari masa aktif
 * Mengembalikan angka positif (sisa hari), 0 (habis hari ini), negatif (lewat X hari), atau null jika unlimited
 */
export function getRemainingDays(user?: UserAccount | null): number | null {
  if (!user) return null;
  if (user.role === 'admin' || user.role === 'instruktur') return null;
  if (!user.expiresAt || user.duration === 'selamanya') return null;

  const now = new Date().getTime();
  const expiry = new Date(user.expiresAt).getTime();
  const diffMs = expiry - now;
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Mendapatkan label tampilan durasi
 */
export function getDurationLabel(duration?: SubscriptionDuration): string {
  switch (duration) {
    case '1_bulan':
      return '1 Bulan';
    case '3_bulan':
      return '3 Bulan';
    case '6_bulan':
      return '6 Bulan';
    case '1_tahun':
      return '1 Tahun';
    case 'selamanya':
      return 'Akses Selamanya (Lifetime)';
    default:
      return 'Akses Selamanya';
  }
}

/**
 * Alias untuk formatDurationLabel
 */
export const formatDurationLabel = getDurationLabel;

/**
 * Mendapatkan string status sisa hari yang mudah dibaca
 */
export function getRemainingDaysText(user?: UserAccount | null): string {
  if (!user || user.duration === 'selamanya' || !user.expiresAt) {
    return 'Akses Selamanya';
  }
  const days = getRemainingDays(user);
  if (days === null) return 'Akses Selamanya';
  if (days < 0) return `Kedaluwarsa (${Math.abs(days)} hari lalu)`;
  if (days === 0) return 'Habis hari ini';
  return `Sisa ${days} hari`;
}

