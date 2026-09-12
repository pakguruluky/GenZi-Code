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
  completedQuizzes?: Record<string, {
    score: number;
    passedAt: string;
    totalQuestions?: number;
    correctCount?: number;
    xpEarned?: number;
  }>;
  recentActivities?: StudentActivity[];
}

export interface QuizSubmission {
  id: string;
  userId: string;
  studentName: string;
  studentEmail?: string;
  materialId: string;
  materialTitle: string;
  category?: string;
  score: number;
  totalQuestions: number;
  correctCount: number;
  passed: boolean;
  xpEarned: number;
  submittedAt: string;
}

export type ActivityType = 'module_completed' | 'quiz_passed' | 'class_attended' | 'badge_earned' | 'studio_opened';

export interface StudentActivity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  xpGained?: number;
  metadata?: {
    materialId?: string;
    category?: string;
    score?: number;
    classId?: string;
    platform?: string;
    certNumber?: string;
    jenjangId?: string;
  };
}

export type MeetingPlatform = 'zoom' | 'gmeet';
export type ClassStatus = 'scheduled' | 'ongoing' | 'completed' | 'cancelled';

export interface OnlineClassSchedule {
  id: string;
  title: string;
  description?: string;
  platform: MeetingPlatform;
  meetingUrl: string;
  meetingId?: string;
  passcode?: string;
  instructorName: string;
  dateTime: string; // ISO string e.g. "2026-09-15T19:00"
  durationMinutes: number;
  targetAudience?: string;
  status: ClassStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ModuleQuiz {
  materialId: string;
  title: string;
  questions: QuizQuestion[];
  passingScore: number;
  xpReward: number;
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

export interface JenjangDefinition {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  category: MaterialCategory | 'All' | 'Multi';
  levelBadge: string;
  description: string;
  competencyPoints: string[];
  iconName: string;
  gradient: string;
  badgeBg: string;
  borderColor: string;
}

export interface JenjangCertificate {
  id: string;
  certificateNumber: string;
  userId: string;
  studentName: string;
  studentEmail?: string;
  school?: string;
  jenjangId: string;
  jenjangTitle: string;
  jenjangCode: string;
  competencyList: string[];
  totalMaterials: number;
  completedMaterials: number;
  averageQuizScore: number;
  xpEarned: number;
  issuedAt: string;
  instructorName: string;
  instructorTitle: string;
  verificationCode: string;
  verificationUrl?: string;
}

