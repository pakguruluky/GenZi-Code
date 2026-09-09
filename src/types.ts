export type UserRole = 'admin' | 'instruktur' | 'siswa' | 'trial';
export type UserStatus = 'active' | 'pending' | 'rejected';
export type SubscriptionDuration = '1_bulan' | '3_bulan' | '6_bulan' | '1_tahun' | 'selamanya';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  password?: string;
  registeredAt: string;
  approvedAt?: string;
  approvedBy?: string;
  completedMaterialIds: string[];
  trialAccessCount?: number;
  school?: string;
  phone?: string;
  notes?: string;
  quizScore?: number;
  quizCount?: number;
  xp?: number;
  badges?: string[];
  duration?: SubscriptionDuration;
  activatedAt?: string;
  expiresAt?: string; // ISO date string when access expires, calculated from activatedAt + duration
  lastLoginAt?: string; // ISO date string of current login
  previousLoginAt?: string; // ISO date string of previous login for daily motivation check (>24h)
}

export type MaterialType = 'PDF' | 'Video';

export type MaterialCategory =
  | 'Scratch'
  | 'Pictoblox'
  | 'Microbit'
  | 'MakeCode Arcade'
  | 'Unplugged'
  | 'Game Logika (SpriteLab)'
  | 'CodeCombat';

export interface Material {
  id: string;
  sequence: number;
  title: string;
  type: MaterialType;
  level: string;
  category: MaterialCategory;
  url: string;
  embedUrl?: string;
  description: string;
  competency?: string;
  indicators?: string;
  duration?: string;
  semester?: 'Ganjil' | 'Genap' | 'Reguler';
}

export interface StudioItem {
  id: 'scratch' | 'microbit' | 'pictoblox' | 'codecombat';
  name: string;
  tagline: string;
  officialUrl: string;
  embedUrl?: string;
  iconName: string;
  description: string;
  color: string;
  quickTips: string[];
}

export interface ToastNotification {
  id: string;
  type?: 'success' | 'info' | 'badge' | 'xp';
  title: string;
  message: string;
  moduleName?: string;
  xpGained?: number;
  duration?: number;
}

