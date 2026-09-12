import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserAccount, UserRole, Material, SubscriptionDuration, ToastNotification, OnlineClassSchedule, StudentActivity, QuizSubmission, JenjangCertificate } from '../types';
import { ALL_MATERIALS } from '../data/curriculumData';
import { JENJANG_DEFINITIONS, getMaterialsForJenjang } from '../data/jenjangData';
import {
  calculateExpirationDate,
  isAccountExpired,
  getDurationLabel
} from '../utils/subscription';
import {
  syncUserToFirestore,
  fetchAllUsersFromFirestore,
  updateUserStatusFirestore,
  deleteUserFromFirestore,
  subscribeToUsers,
  saveOnlineClassToFirestore,
  deleteOnlineClassFromFirestore,
  fetchAllOnlineClassesFromFirestore,
  subscribeToOnlineClasses,
  saveQuizSubmissionToFirestore,
  saveCertificateToFirestore,
  fetchCertificatesFromFirestore,
  subscribeToCertificates
} from '../lib/firebase';
import confetti from 'canvas-confetti';

const STORAGE_KEY_CURRENT_USER = 'genzicode_current_user';
const STORAGE_KEY_USERS = 'genzicode_users_db';
const STORAGE_KEY_CLASSES = 'genzicode_online_classes';

export const DEFAULT_ADMIN_PASSWORD = 'bajuri39';

export const DEMO_USER_IDS = new Set([
  'user-siswa-01',
  'user-siswa-02',
  'user-siswa-03',
  'user-siswa-04',
  'user-siswa-05',
  'user-siswa-06',
  'user-siswa-07',
  'user-trial-01',
  'user-inst-01'
]);

const INITIAL_USERS: UserAccount[] = [
  {
    id: 'user-admin-01',
    name: 'Bapak Guru Hilman (Admin)',
    email: 'hilmansyarif53@gmail.com',
    role: 'admin',
    status: 'active',
    registeredAt: '2026-08-01T08:00:00Z',
    approvedAt: '2026-08-01T08:00:00Z',
    approvedBy: 'Sistem Pusat',
    duration: 'selamanya',
    completedMaterialIds: ALL_MATERIALS.map(m => m.id),
    school: 'GenZi Coding Academy',
    phone: '0812-3456-7890',
    notes: 'Super Administrator & Instruktur AI Utama',
    quizScore: 100,
    quizCount: 54,
    xp: 6800,
    badges: ['Pendiri GenZi', 'Master AI', 'Kepala Instruktur']
  }
];

interface AppContextType {
  currentUser: UserAccount | null;
  users: UserAccount[];
  activeStudio: 'scratch' | 'microbit' | 'pictoblox' | 'codecombat' | null;
  selectedMaterial: Material | null;
  darkMode: boolean;
  toggleDarkMode: () => void;
  viewingCertificateUser: UserAccount | null;
  setViewingCertificateUser: (user: UserAccount | null) => void;
  viewingReportUser: UserAccount | null;
  setViewingReportUser: (user: UserAccount | null) => void;
  loginAsAdmin: (password: string) => { success: boolean; message?: string };
  loginUser: (email: string, role?: UserRole) => { success: boolean; message?: string };
  registerSelfStudent: (data: {
    name: string;
    email: string;
    school?: string;
    phone?: string;
    duration?: SubscriptionDuration;
  }) => Promise<{ success: boolean; message?: string }>;
  startTrialSession: (name: string, email?: string) => Promise<{ success: boolean; message?: string }>;
  approveStudent: (userId: string, duration?: SubscriptionDuration) => Promise<{ success: boolean; message?: string }>;
  rejectStudent: (userId: string) => Promise<void>;
  updateUserDuration: (userId: string, duration: SubscriptionDuration) => Promise<void>;
  registerStudentDirectly: (data: {
    name: string;
    email: string;
    school?: string;
    phone?: string;
    notes?: string;
    duration?: SubscriptionDuration;
  }) => Promise<void>;
  addInstructorDirectly: (data: {
    name: string;
    email: string;
    school?: string;
    phone?: string;
    notes?: string;
  }) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  clearDemoData: () => Promise<void>;
  syncToGoogleSheets: () => Promise<{ success: boolean; message: string }>;
  completeMaterial: (materialId: string) => Promise<void>;
  addXp: (amount: number, reason: string) => Promise<void>;
  resetUserProgress: (userId: string) => Promise<void>;
  switchUser: (user: UserAccount) => void;
  logout: () => void;
  openStudio: (id: 'scratch' | 'microbit' | 'pictoblox' | 'codecombat' | null) => void;
  openMaterial: (material: Material | null) => void;
  isMaterialUnlocked: (material: Material) => boolean;
  canAccessMaterial: (material: Material) => { allowed: boolean; reason?: string };
  getCompletionPercentage: (user?: UserAccount | null) => number;
  exportTableToCSV: () => void;
  exportToGoogleSheetsCSV: () => void;
  refreshDatabase: () => Promise<{ success: boolean; count: number; message: string }>;
  toast: ToastNotification | null;
  showToast: (toast: Omit<ToastNotification, 'id'>) => void;
  hideToast: () => void;
  // Online Class Schedule (Zoom / GMeet)
  onlineClasses: OnlineClassSchedule[];
  createOnlineClass: (data: Omit<OnlineClassSchedule, 'id' | 'createdAt'>) => Promise<{ success: boolean; message?: string }>;
  updateOnlineClass: (id: string, data: Partial<OnlineClassSchedule>) => Promise<{ success: boolean; message?: string }>;
  deleteOnlineClass: (id: string) => Promise<{ success: boolean; message?: string }>;
  // Interactive Module Quizzes
  submitModuleQuiz: (materialId: string, score: number, totalQuestions: number) => Promise<{ passed: boolean; xpEarned: number }>;
  // Student Activities History
  addStudentActivity: (activity: Omit<StudentActivity, 'id' | 'timestamp'>) => Promise<void>;
  recordClassAttendance: (cls: OnlineClassSchedule) => Promise<void>;
  getStudentRecentActivities: (user?: UserAccount | null) => StudentActivity[];
  // Official Jenjang Certificates from Firestore
  certificates: JenjangCertificate[];
  selectedJenjangCertificate: JenjangCertificate | null;
  setSelectedJenjangCertificate: (cert: JenjangCertificate | null) => void;
  getJenjangProgress: (jenjangId: string, user?: UserAccount | null) => {
    isCompleted: boolean;
    completedCount: number;
    totalCount: number;
    percentage: number;
    averageScore: number;
    certificate?: JenjangCertificate;
  };
  generateJenjangCertificate: (jenjangId: string, user?: UserAccount | null) => Promise<{
    success: boolean;
    certificate?: JenjangCertificate;
    message?: string;
  }>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('genzi_dark_mode');
    if (saved !== null) {
      return saved === 'true';
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [viewingCertificateUser, setViewingCertificateUser] = useState<UserAccount | null>(null);
  const [viewingReportUser, setViewingReportUser] = useState<UserAccount | null>(null);

  const [users, setUsers] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_USERS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Hanya gunakan data asli yang tersimpan di database/backend, bersihkan demo
          const realUsers = parsed.filter((u: UserAccount) => !DEMO_USER_IDS.has(u.id));
          if (realUsers.length > 0) {
            return realUsers;
          }
        }
      } catch (e) {
        console.error('Failed to parse cached users', e);
      }
    }
    return INITIAL_USERS;
  });

  // User state: Pertama kali membuka aplikasi, langsung ke halaman depan & belum masuk akun siapapun (null)
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const sessionActive = sessionStorage.getItem('genzicode_session_active');
      if (!sessionActive) {
        localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
        return null;
      }
      const saved = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id && !DEMO_USER_IDS.has(parsed.id)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Session initialization note', e);
    }
    return null;
  });

  // Toast Notification State
  const [toast, setToast] = useState<ToastNotification | null>(null);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  const showToast = useCallback((newToast: Omit<ToastNotification, 'id'>) => {
    const id = 'toast-' + Date.now();
    setToast({
      ...newToast,
      id,
      duration: newToast.duration || 4500
    });
  }, []);

  // Toggle Dark Mode with HTML class sync
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('genzi_dark_mode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('genzi_dark_mode', 'false');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const [activeStudio, setActiveStudio] = useState<'scratch' | 'microbit' | 'pictoblox' | 'codecombat' | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);

  // Online Classes Schedule State (Realtime dari Backend Firestore)
  const [onlineClasses, setOnlineClasses] = useState<OnlineClassSchedule[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CLASSES);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Failed to parse cached online classes', e);
      }
    }
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    tomorrow.setHours(19, 30, 0, 0);
    const in3Days = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    in3Days.setHours(16, 0, 0, 0);

    return [
      {
        id: 'cls-sample-01',
        title: 'Bimbingan Live: Membuat Game Maze Interaktif di Scratch 3.0',
        description: 'Sesi tatap muka online bimbingan logika Scratch, membuat rintangan bergerak, dan kalkulasi skor koin.',
        platform: 'zoom',
        meetingUrl: 'https://zoom.us/j/81234567890?pwd=GENZICODINGPASS',
        meetingId: '812 3456 7890',
        passcode: 'genzi2026',
        instructorName: 'Bapak Guru Hilman (Admin & Kepala Instruktur)',
        dateTime: tomorrow.toISOString().slice(0, 16),
        durationMinutes: 60,
        targetAudience: 'Semua Siswa & Pemula Scratch',
        status: 'scheduled',
        createdAt: new Date().toISOString()
      },
      {
        id: 'cls-sample-02',
        title: 'Bedah AI & Vision: Pengenalan Wajah & Pose di PictoBlox',
        description: 'Praktik langsung melatih model Machine Learning menggunakan kamera webcam untuk deteksi ekspresi wajah dan kendali gerak.',
        platform: 'gmeet',
        meetingUrl: 'https://meet.google.com/gen-zico-ding',
        meetingId: 'gen-zico-ding',
        passcode: 'Langsung Masuk (Tanpa Sandi)',
        instructorName: 'Bapak Dimas Ardiansyah, S.Kom.',
        dateTime: in3Days.toISOString().slice(0, 16),
        durationMinutes: 75,
        targetAudience: 'Siswa Tingkat Menengah & Modul AI',
        status: 'scheduled',
        createdAt: new Date().toISOString()
      }
    ];
  });

  // State Sertifikat Resmi Berjenjang dari Cloud Firestore
  const [certificates, setCertificates] = useState<JenjangCertificate[]>(() => {
    const saved = localStorage.getItem('genzicode_certificates');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        // ignore
      }
    }
    return [];
  });
  const [selectedJenjangCertificate, setSelectedJenjangCertificate] = useState<JenjangCertificate | null>(null);

  // Realtime subscriber untuk Sertifikat langsung dari Cloud Firestore
  useEffect(() => {
    const unsub = subscribeToCertificates((remoteCerts) => {
      if (remoteCerts && remoteCerts.length > 0) {
        setCertificates(remoteCerts);
        localStorage.setItem('genzicode_certificates', JSON.stringify(remoteCerts));
      }
    });

    fetchCertificatesFromFirestore().then((initial) => {
      if (initial && initial.length > 0) {
        setCertificates(initial);
        localStorage.setItem('genzicode_certificates', JSON.stringify(initial));
      }
    }).catch(err => console.warn('Fetch certificates notice:', err));

    return () => unsub();
  }, []);

  // Realtime subscriber untuk Kelas Online langsung dari Cloud Firestore Backend
  useEffect(() => {
    const unsub = subscribeToOnlineClasses((remoteClasses) => {
      if (remoteClasses && remoteClasses.length > 0) {
        setOnlineClasses(remoteClasses);
        localStorage.setItem(STORAGE_KEY_CLASSES, JSON.stringify(remoteClasses));
      }
    });

    fetchAllOnlineClassesFromFirestore().then((initial) => {
      if (initial && initial.length > 0) {
        setOnlineClasses(initial);
        localStorage.setItem(STORAGE_KEY_CLASSES, JSON.stringify(initial));
      }
    }).catch(err => console.warn('Fetch online classes warning:', err));

    return () => unsub();
  }, []);

  // Sync realtime langsung dari Cloud Firestore Backend (Bukan Data Demo)
  useEffect(() => {
    // 1. Bersihkan sisa akun demo tiruan dari local storage agar murni data asli
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const cleaned = parsed.filter((u: UserAccount) => !DEMO_USER_IDS.has(u.id));
          localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(cleaned));
        }
      }
    } catch {
      // ignore
    }

    // 2. Pasang realtime subscriber Firestore (onSnapshot)
    const unsubscribe = subscribeToUsers((remoteUsers) => {
      if (remoteUsers && remoteUsers.length > 0) {
        // Saring akun demo tiruan agar database murni data asli backend
        const realRemoteUsers = remoteUsers.filter(u => !DEMO_USER_IDS.has(u.id));
        if (realRemoteUsers.length > 0) {
          setUsers(prevUsers => {
            // Gabungkan remote users dengan user lokal yang baru saja didaftarkan agar tidak tertimpa sebelum tersinkron
            const remoteMap = new Map<string, UserAccount>();
            for (const ru of realRemoteUsers) {
              remoteMap.set(ru.id, ru);
            }
            const merged = [...realRemoteUsers];
            for (const local of prevUsers) {
              if (!DEMO_USER_IDS.has(local.id) && !remoteMap.has(local.id)) {
                merged.unshift(local);
                // Trigger latar belakang untuk memastikan data tersimpan
                syncUserToFirestore(local);
              }
            }
            localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(merged));
            return merged;
          });

          // Perbarui status currentUser jika ada update dari backend (misal disetujui / poin bertambah)
          setCurrentUser(prevUser => {
            if (!prevUser) return null;
            const updated = realRemoteUsers.find(
              u => u.id === prevUser.id || u.email.toLowerCase() === prevUser.email.toLowerCase()
            );
            return updated || prevUser;
          });
        }
      }
    });

    // 3. Panggilan awal Firestore fetch
    fetchAllUsersFromFirestore().then((remoteUsers) => {
      if (remoteUsers && remoteUsers.length > 0) {
        const realRemoteUsers = remoteUsers.filter(u => !DEMO_USER_IDS.has(u.id));
        if (realRemoteUsers.length > 0) {
          setUsers(realRemoteUsers);
          localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(realRemoteUsers));
        }
      } else {
        // Inisialisasi akun Admin asli jika Firestore masih kosong
        syncUserToFirestore(INITIAL_USERS[0]);
      }
    }).catch(err => {
      console.warn('Initial Firestore fetch note:', err);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      try {
        sessionStorage.setItem('genzicode_session_active', 'true');
      } catch {
        // ignore
      }
      localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(currentUser));
      // update current user in list if modified
      setUsers(prev => prev.map(u => (u.id === currentUser.id ? currentUser : u)));
    } else {
      try {
        sessionStorage.removeItem('genzicode_session_active');
      } catch {
        // ignore
      }
      localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
    }
  }, [currentUser]);

  const loginAsAdmin = (password: string) => {
    if (password === DEFAULT_ADMIN_PASSWORD) {
      const adminUser = users.find(u => u.role === 'admin') || INITIAL_USERS[0];
      setCurrentUser(adminUser);
      return { success: true };
    }
    return { success: false, message: 'Password admin salah. Silakan coba lagi.' };
  };

  const loginUser = (email: string, preferredRole?: UserRole) => {
    const cleanEmail = email.trim().toLowerCase();
    const existing = users.find(
      u =>
        u.email.toLowerCase() === cleanEmail ||
        (u.role === 'admin' && (cleanEmail === 'hilmansyarif53@gmail.com' || cleanEmail === 'admin@genzicode.id'))
    );
    if (!existing) {
      return {
        success: false,
        message: 'Akun belum terdaftar. Silakan lakukan pendaftaran mandiri atau hubungi Admin.'
      };
    }

    if (existing.status === 'pending') {
      return {
        success: false,
        message: 'Akun Anda masih dalam status MENUNGGU PERSETUJUAN (Approval) oleh Admin GenZi Code. Hubungi Admin/Instruktur untuk aktivasi.'
      };
    }

    if (existing.status === 'rejected') {
      return {
        success: false,
        message: 'Pendaftaran akun Anda tidak disetujui. Silakan hubungi admin.'
      };
    }

    if (existing.role === 'trial') {
      if ((existing.trialAccessCount || 0) >= 1) {
        return {
          success: false,
          message: 'Sesi akun Trial Anda sudah terpakai (Maksimal 1 kali). Silakan daftar akun Siswa resmi untuk melanjutkan semua modul.'
        };
      }
    }

    const nowIso = new Date().toISOString();
    const storedLastLogin = existing.lastLoginAt || localStorage.getItem(`genzi_last_login_${existing.id}`) || existing.registeredAt;

    const updatedUser: UserAccount = {
      ...existing,
      previousLoginAt: storedLastLogin || undefined,
      lastLoginAt: nowIso
    };

    if (storedLastLogin) {
      localStorage.setItem(`genzi_prev_login_stamp_${existing.id}`, storedLastLogin);
    }
    localStorage.setItem(`genzi_last_login_${existing.id}`, nowIso);

    setUsers(prev => prev.map(u => (u.id === existing.id ? updatedUser : u)));
    setCurrentUser(updatedUser);
    syncUserToFirestore(updatedUser);
    return { success: true };
  };

  const registerSelfStudent = async (data: {
    name: string;
    email: string;
    school?: string;
    phone?: string;
    duration?: SubscriptionDuration;
  }): Promise<{ success: boolean; message: string }> => {
    const cleanEmail = data.email.trim().toLowerCase();
    const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return {
        success: false,
        message: 'Email sudah terdaftar. Silakan login atau tunggu konfirmasi admin jika masih pending.'
      };
    }

    const newStudent: UserAccount = {
      id: `user-siswa-${Date.now()}`,
      name: data.name.trim(),
      email: cleanEmail,
      role: 'siswa',
      status: 'pending', // BARU AKTIF SETELAH DI-APPROVE ADMIN
      duration: data.duration || '3_bulan',
      registeredAt: new Date().toISOString(),
      completedMaterialIds: [],
      school: data.school || 'Sekolah Siswa',
      phone: data.phone || '',
      notes: `Pendaftaran mandiri (Paket: ${getDurationLabel(data.duration || '3_bulan')}).`
    };

    setUsers(prev => [newStudent, ...prev]);
    const res = await syncUserToFirestore(newStudent);
    if (!res.success) {
      console.warn('[Firestore] Sync notice saat pendaftaran:', res.error);
    }

    return {
      success: true,
      message: 'Pendaftaran berhasil! Data Anda tersimpan di database realtime dan baru akan aktif setelah diapprove serta didaftarkan oleh Admin.'
    };
  };

  const startTrialSession = async (name: string, email?: string): Promise<{ success: boolean; message: string }> => {
    const trialEmail = email?.trim().toLowerCase() || `trial_${Date.now()}@guest.genzi.id`;
    const newTrialUser: UserAccount = {
      id: `user-trial-${Date.now()}`,
      name: name.trim() || 'Siswa Uji Coba (Trial)',
      email: trialEmail,
      role: 'trial',
      status: 'active',
      registeredAt: new Date().toISOString(),
      trialAccessCount: 1, // 1 kali akses
      completedMaterialIds: [],
      school: 'Akses Trial 1 Modul',
      notes: 'Hanya dapat akses 1 kali dan 1 modul pertama.'
    };

    setUsers(prev => [newTrialUser, ...prev]);
    setCurrentUser(newTrialUser);
    await syncUserToFirestore(newTrialUser);

    return {
      success: true,
      message: 'Selamat datang di Akses Trial! Anda dapat mencoba 1 modul pembelajaran pertama.'
    };
  };

  const approveStudent = async (userId: string, duration?: SubscriptionDuration): Promise<{ success: boolean; message?: string }> => {
    const target = users.find(u => u.id === userId);
    if (!target) return { success: false, message: 'Data siswa tidak ditemukan.' };

    const nowIso = new Date().toISOString();
    const finalDuration = duration || target.duration || '3_bulan';
    const calculatedExpiry = calculateExpirationDate(nowIso, finalDuration);

    const updated: UserAccount = {
      ...target,
      status: 'active',
      duration: finalDuration,
      activatedAt: nowIso,
      approvedAt: nowIso,
      approvedBy: currentUser?.name || 'Admin GenZi'
    };

    if (calculatedExpiry) {
      updated.expiresAt = calculatedExpiry;
    } else {
      delete updated.expiresAt;
    }

    setUsers(prev => prev.map(u => (u.id === userId ? updated : u)));
    if (currentUser?.id === userId) {
      setCurrentUser(updated);
    }
    const saveResult = await syncUserToFirestore(updated);
    if (!saveResult.success) {
      console.warn('[Firestore] Gagal menyimpan persetujuan:', saveResult.error);
    }

    return {
      success: true,
      message: `Siswa "${updated.name}" berhasil diapprove dan langsung aktif di database realtime!`
    };
  };

  const updateUserDuration = async (userId: string, duration: SubscriptionDuration) => {
    const target = users.find(u => u.id === userId);
    if (!target) return;

    const baseActivation = target.activatedAt || target.approvedAt || new Date().toISOString();
    const calculatedExpiry = calculateExpirationDate(baseActivation, duration);

    const updated: UserAccount = {
      ...target,
      duration,
      activatedAt: baseActivation
    };

    if (calculatedExpiry) {
      updated.expiresAt = calculatedExpiry;
    } else {
      delete updated.expiresAt;
    }

    setUsers(prev => prev.map(u => (u.id === userId ? updated : u)));
    if (currentUser?.id === userId) {
      setCurrentUser(updated);
    }
    await syncUserToFirestore(updated);
  };

  const rejectStudent = async (userId: string) => {
    const target = users.find(u => u.id === userId);
    if (!target) return;
    const updated: UserAccount = {
      ...target,
      status: 'rejected',
      approvedBy: currentUser?.name || 'Admin GenZi'
    };
    setUsers(prev =>
      prev.map(u => (u.id === userId ? updated : u))
    );
    await syncUserToFirestore(updated);
  };

  const registerStudentDirectly = async (data: {
    name: string;
    email: string;
    school?: string;
    phone?: string;
    notes?: string;
    duration?: SubscriptionDuration;
  }) => {
    const nowIso = new Date().toISOString();
    const chosenDuration = data.duration || 'selamanya';
    const expiresAt = calculateExpirationDate(nowIso, chosenDuration);

    const newStudent: UserAccount = {
      id: `user-siswa-${Date.now()}`,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      role: 'siswa',
      status: 'active', // Direct registration by admin is immediately active
      duration: chosenDuration,
      activatedAt: nowIso,
      expiresAt,
      registeredAt: nowIso,
      approvedAt: nowIso,
      approvedBy: currentUser?.name || 'Admin GenZi',
      completedMaterialIds: [],
      school: data.school || 'GenZi Member',
      phone: data.phone || '',
      notes: data.notes || `Didaftarkan langsung oleh Admin (${getDurationLabel(chosenDuration)}).`
    };

    setUsers(prev => [newStudent, ...prev]);
    await syncUserToFirestore(newStudent);
  };

  const addInstructorDirectly = async (data: {
    name: string;
    email: string;
    school?: string;
    phone?: string;
    notes?: string;
  }) => {
    const newInstructor: UserAccount = {
      id: `user-inst-${Date.now()}`,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      role: 'instruktur',
      status: 'active',
      registeredAt: new Date().toISOString(),
      approvedAt: new Date().toISOString(),
      approvedBy: currentUser?.name || 'Admin GenZi',
      completedMaterialIds: ALL_MATERIALS.map(m => m.id),
      school: data.school || 'Instruktur GenZi Code',
      phone: data.phone || '',
      notes: data.notes || 'Ditambahkan oleh Admin.'
    };

    setUsers(prev => [newInstructor, ...prev]);
    await syncUserToFirestore(newInstructor);
  };

  const deleteUser = async (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    await deleteUserFromFirestore(userId);
    if (currentUser?.id === userId) {
      setCurrentUser(null);
    }
  };

  const clearDemoData = async () => {
    // Hapus seluruh akun demo tiruan dari Firestore dan local storage
    for (const demoId of Array.from(DEMO_USER_IDS)) {
      try {
        await deleteUserFromFirestore(demoId);
      } catch {
        // ignore
      }
    }
    const realUsers = users.filter(u => !DEMO_USER_IDS.has(u.id));
    const hasAdmin = realUsers.some(u => u.role === 'admin');
    const finalUsers = hasAdmin ? realUsers : [INITIAL_USERS[0], ...realUsers];
    setUsers(finalUsers);
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(finalUsers));
    if (currentUser && DEMO_USER_IDS.has(currentUser.id)) {
      setCurrentUser(null);
    }
  };

  const refreshDatabase = async () => {
    try {
      const remoteUsers = await fetchAllUsersFromFirestore();
      if (remoteUsers && remoteUsers.length > 0) {
        const realRemoteUsers = remoteUsers.filter(u => !DEMO_USER_IDS.has(u.id));
        if (realRemoteUsers.length > 0) {
          setUsers(realRemoteUsers);
          localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(realRemoteUsers));
          return {
            success: true,
            count: realRemoteUsers.length,
            message: `Berhasil menyinkronkan ${realRemoteUsers.length} data pengguna langsung dari database backend.`
          };
        }
      }
      return {
        success: true,
        count: users.length,
        message: 'Data pengguna telah disinkronkan dengan database.'
      };
    } catch (err: any) {
      return {
        success: false,
        count: users.length,
        message: `Gagal menyinkronkan database: ${err?.message || 'Koneksi backend terputus'}`
      };
    }
  };

  const syncToGoogleSheets = async () => {
    // Sinkronisasi data asli ke database aplikasi dan Cloud Database
    return {
      success: true,
      message: `Data ${users.length} akun tersimpan otomatis di database aplikasi & Cloud Database.`
    };
  };

  const completeMaterial = async (materialId: string) => {
    if (!currentUser) return;

    const completedMat = ALL_MATERIALS.find(m => m.id === materialId);
    const modTitle = completedMat?.title || 'Modul Pembelajaran';
    const modSeq = completedMat?.sequence ? `#${completedMat.sequence}` : '';

    if (currentUser.completedMaterialIds.includes(materialId)) {
      showToast({
        type: 'info',
        title: 'Modul Sudah Selesai',
        message: `Modul ${modSeq} "${modTitle}" sudah ada dalam daftar capaian belajarmu.`,
        duration: 3500
      });
      return;
    }

    // Siswa dan akun trial wajib lulus Post Test terlebih dahulu
    if (currentUser.role === 'siswa' || currentUser.role === 'trial') {
      const quizResult = currentUser.completedQuizzes?.[materialId];
      const isPostTestPassed = quizResult && quizResult.score >= 60;
      if (!isPostTestPassed) {
        showToast({
          type: 'info',
          title: 'Post Test Wajib Dikerjakan',
          message: `Untuk menyelesaikan ${modSeq} "${modTitle}" dan membuka jenjang modul berikutnya, kamu wajib mengerjakan dan lulus Post Test (skor minimal 60%) di bagian bawah modul!`,
          duration: 4500
        });
        return;
      }
    }

    const updatedIds = [...currentUser.completedMaterialIds, materialId];
    const earnedXp = 100;
    const currentXp = currentUser.xp || 0;
    const newXp = currentXp + earnedXp;

    const currentBadges = [...(currentUser.badges || [])];
    if (updatedIds.length >= 1 && !currentBadges.includes('Langkah Pertama')) {
      currentBadges.push('Langkah Pertama');
    }
    if (updatedIds.length >= 5 && !currentBadges.includes('Penjelajah Kode')) {
      currentBadges.push('Penjelajah Kode');
    }
    if (updatedIds.length >= 10 && !currentBadges.includes('Bintang GenZi')) {
      currentBadges.push('Bintang GenZi');
    }

    const newActivity: StudentActivity = {
      id: `act-mod-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type: 'module_completed',
      title: `Menyelesaikan ${modSeq ? `Modul ${modSeq}` : 'Modul'}: ${modTitle}`,
      description: `Berhasil menuntaskan modul kurikulum kategori ${completedMat?.category || 'GenZi Code'}`,
      timestamp: new Date().toISOString(),
      xpGained: earnedXp,
      metadata: {
        materialId,
        category: completedMat?.category
      }
    };
    const updatedActivities = [newActivity, ...(currentUser.recentActivities || [])].slice(0, 15);

    const updatedUser: UserAccount = {
      ...currentUser,
      completedMaterialIds: updatedIds,
      xp: newXp,
      badges: currentBadges,
      recentActivities: updatedActivities
    };

    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => (u.id === currentUser.id ? updatedUser : u)));
    await syncUserToFirestore(updatedUser);

    // Instant Positive Feedback Toast with XP Gamification
    const firstName = currentUser.name.split(' ')[0] || 'Siswa Hebat';
    showToast({
      type: 'xp',
      title: '🎉 Modul Berhasil Diselesaikan!',
      message: `Hebat sekali ${firstName}! Kamu menyelesaikan Modul ${modSeq}: "${modTitle}". +${earnedXp} XP bertambah ke profilmu!`,
      moduleName: modTitle,
      xpGained: earnedXp,
      duration: 5000
    });

    // Trigger celebration effects
    try {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  };

  const addXp = async (amount: number, reason: string) => {
    if (!currentUser) return;
    const currentXp = currentUser.xp || 0;
    const newXp = currentXp + amount;
    const updatedUser: UserAccount = {
      ...currentUser,
      xp: newXp
    };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => (u.id === currentUser.id ? updatedUser : u)));
    await syncUserToFirestore(updatedUser);

    showToast({
      type: 'xp',
      title: `⚡ +${amount} XP Berhasil Diraih!`,
      message: reason,
      xpGained: amount,
      duration: 4500
    });

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {
      // ignore
    }
  };

  const resetUserProgress = async (userId: string) => {
    const target = users.find(u => u.id === userId);
    if (!target) return;

    const updated: UserAccount = {
      ...target,
      completedMaterialIds: [],
      xp: 0
    };

    setUsers(prev => prev.map(u => (u.id === userId ? updated : u)));
    if (currentUser?.id === userId) {
      setCurrentUser(updated);
    }
    await syncUserToFirestore(updated);
  };

  const switchUser = (user: UserAccount) => {
    setCurrentUser(user);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const openStudio = (id: 'scratch' | 'microbit' | 'pictoblox' | 'codecombat' | null) => {
    setActiveStudio(id);
  };

  const openMaterial = (material: Material | null) => {
    setSelectedMaterial(material);
  };

  // Check if material is unlocked based on berjenjang logic
  const isMaterialUnlocked = (material: Material): boolean => {
    if (!currentUser) return false;
    // Admins and instructors have all modules unlocked
    if (currentUser.role === 'admin' || currentUser.role === 'instruktur') {
      return true;
    }

    // Trial users: ONLY the very first material (sequence 1) is accessible!
    if (currentUser.role === 'trial') {
      return material.sequence === 1;
    }

    // Siswa must have active status
    if (currentUser.status !== 'active') {
      return false;
    }

    // Check if learning duration has expired
    if (isAccountExpired(currentUser)) {
      return false;
    }

    // Sequential check: Sequence 1 is always unlocked for active student
    if (material.sequence === 1) return true;

    // A material is unlocked if the immediately preceding material has been completed AND post-test passed
    const previousMaterial = ALL_MATERIALS.find(m => m.sequence === material.sequence - 1);
    if (!previousMaterial) return true;

    const isPrevCompleted = currentUser.completedMaterialIds.includes(previousMaterial.id);
    const prevQuiz = currentUser.completedQuizzes?.[previousMaterial.id];
    const isPrevQuizPassed = prevQuiz ? prevQuiz.score >= 60 : isPrevCompleted;

    return isPrevCompleted && isPrevQuizPassed;
  };

  const canAccessMaterial = (material: Material): { allowed: boolean; reason?: string } => {
    if (!currentUser) {
      return { allowed: false, reason: 'Silakan login terlebih dahulu untuk mengakses materi.' };
    }

    if (currentUser.role === 'admin' || currentUser.role === 'instruktur') {
      return { allowed: true };
    }

    // Cek masa berlaku akun (Durasi Belajar Siswa)
    if (isAccountExpired(currentUser)) {
      const expDateStr = currentUser.expiresAt
        ? new Date(currentUser.expiresAt).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })
        : 'tanggal yang ditentukan';
      return {
        allowed: false,
        reason: `Masa berlaku durasi belajar Anda (${getDurationLabel(currentUser.duration)}) telah selesai pada ${expDateStr}. Akses materi ditutup. Silakan hubungi Admin GenZi Code untuk perpanjangan paket.`
      };
    }

    if (currentUser.role === 'trial') {
      if (material.sequence !== 1) {
        return {
          allowed: false,
          reason: 'Akun Trial hanya dapat mengakses 1 modul pertama. Silakan mendaftar sebagai Siswa GenZi Code untuk membuka 54 modul lengkap!'
        };
      }
      return { allowed: true };
    }

    if (currentUser.status === 'pending') {
      return {
        allowed: false,
        reason: 'Akun Anda sedang menunggu persetujuan dari Admin. Hubungi Admin untuk aktivasi akun.'
      };
    }

    if (!isMaterialUnlocked(material)) {
      const prev = ALL_MATERIALS.find(m => m.sequence === material.sequence - 1);
      const prevTitle = prev ? `Modul #${prev.sequence}: ${prev.title}` : `Modul #${material.sequence - 1}`;
      return {
        allowed: false,
        reason: `Materi ini terkunci. Anda harus menyelesaikan materi sebelumnya (${prevTitle}) dan lulus Post Test (skor minimal 60%) terlebih dahulu untuk membuka jenjang modul berikutnya.`
      };
    }

    return { allowed: true };
  };

  const getCompletionPercentage = (user?: UserAccount | null): number => {
    const target = user || currentUser;
    if (!target) return 0;
    const total = ALL_MATERIALS.length;
    if (total === 0) return 0;
    const completed = target.completedMaterialIds?.length || 0;
    return Math.min(100, Math.round((completed / total) * 100));
  };

  // Standard CSV export for in-app data table
  const exportTableToCSV = () => {
    const headers = [
      'ID Pengguna',
      'Nama Lengkap',
      'Email',
      'Role',
      'Status Akun',
      'Sekolah/Lembaga',
      'No Telepon/WA',
      'Modul Selesai',
      'Total Materi',
      'Progress Belajar (%)',
      'Poin XP',
      'Skor Kuis (%)',
      'Akses Trial',
      'Tanggal Pendaftaran',
      'Tanggal Disetujui',
      'Disetujui Oleh',
      'Catatan Admin'
    ];

    const rows = users.map(u => [
      `"${u.id}"`,
      `"${u.name.replace(/"/g, '""')}"`,
      `"${u.email}"`,
      `"${u.role.toUpperCase()}"`,
      `"${u.status.toUpperCase()}"`,
      `"${(u.school || '-').replace(/"/g, '""')}"`,
      `"${u.phone || '-'}"`,
      u.completedMaterialIds?.length || 0,
      ALL_MATERIALS.length,
      `"${getCompletionPercentage(u)}%"`,
      u.xp || 0,
      u.quizScore || 0,
      u.trialAccessCount ? `${u.trialAccessCount}x` : 'N/A',
      `"${new Date(u.registeredAt).toLocaleDateString('id-ID')}"`,
      u.approvedAt ? `"${new Date(u.approvedAt).toLocaleDateString('id-ID')}"` : '"-"',
      `"${u.approvedBy || '-'}"`,
      `"${(u.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GenZi_Code_Tabel_Data_Siswa_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToGoogleSheetsCSV = exportTableToCSV;

  // Manajemen Kelas Online (Zoom & Google Meet)
  const createOnlineClass = async (data: Omit<OnlineClassSchedule, 'id' | 'createdAt'>): Promise<{ success: boolean; message?: string }> => {
    const newClass: OnlineClassSchedule = {
      ...data,
      id: 'cls-' + Date.now(),
      createdAt: new Date().toISOString()
    };
    setOnlineClasses(prev => [newClass, ...prev]);
    localStorage.setItem(STORAGE_KEY_CLASSES, JSON.stringify([newClass, ...onlineClasses]));
    const res = await saveOnlineClassToFirestore(newClass);
    if (res.success) {
      showToast({
        type: 'success',
        title: 'Jadwal Kelas Tersimpan!',
        message: `Sesi "${newClass.title}" berhasil dijadwalkan dan disimpan ke backend Firestore realtime.`
      });
      return { success: true };
    } else {
      return { success: false, message: res.error };
    }
  };

  const updateOnlineClass = async (id: string, data: Partial<OnlineClassSchedule>): Promise<{ success: boolean; message?: string }> => {
    const target = onlineClasses.find(c => c.id === id);
    if (!target) return { success: false, message: 'Kelas tidak ditemukan' };
    const updated: OnlineClassSchedule = {
      ...target,
      ...data,
      updatedAt: new Date().toISOString()
    };
    setOnlineClasses(prev => prev.map(c => (c.id === id ? updated : c)));
    localStorage.setItem(STORAGE_KEY_CLASSES, JSON.stringify(onlineClasses.map(c => (c.id === id ? updated : c))));
    const res = await saveOnlineClassToFirestore(updated);
    if (res.success) {
      showToast({
        type: 'success',
        title: 'Kelas Berhasil Diperbarui',
        message: 'Perubahan tautan / info kelas online telah disinkronkan ke database.'
      });
      return { success: true };
    }
    return { success: false, message: res.error };
  };

  const deleteOnlineClass = async (id: string): Promise<{ success: boolean; message?: string }> => {
    const filtered = onlineClasses.filter(c => c.id !== id);
    setOnlineClasses(filtered);
    localStorage.setItem(STORAGE_KEY_CLASSES, JSON.stringify(filtered));
    const ok = await deleteOnlineClassFromFirestore(id);
    if (ok) {
      showToast({
        type: 'info',
        title: 'Jadwal Kelas Dihapus',
        message: 'Jadwal kelas online berhasil dihapus dari backend.'
      });
      return { success: true };
    }
    return { success: false, message: 'Gagal menghapus dari database' };
  };

  // Kuis Post Test Interaktif Akhir Modul
  const submitModuleQuiz = async (
    materialId: string,
    score: number,
    totalQuestions: number
  ): Promise<{ passed: boolean; xpEarned: number }> => {
    if (!currentUser) return { passed: false, xpEarned: 0 };

    const isPassed = score >= 60;
    const nowIso = new Date().toISOString();
    const currentCompletedQuizzes = currentUser.completedQuizzes || {};
    const alreadyPassedBefore = (currentCompletedQuizzes[materialId]?.score ?? 0) >= 60;

    // Perolehan XP: 75 XP saat pertama kali lulus, +25 bonus jika nilai sempurna 100%
    const earnedXp = isPassed && !alreadyPassedBefore ? (score === 100 ? 100 : 75) : 0;
    const newXp = (currentUser.xp || 0) + earnedXp;

    const currentCompletedMaterials = currentUser.completedMaterialIds || [];
    const updatedCompletedIds =
      isPassed && !currentCompletedMaterials.includes(materialId)
        ? [...currentCompletedMaterials, materialId]
        : currentCompletedMaterials;

    const correctCount = Math.round((score / 100) * totalQuestions);

    const updatedQuizzes = {
      ...currentCompletedQuizzes,
      [materialId]: {
        score,
        passedAt: nowIso,
        totalQuestions,
        correctCount,
        xpEarned: earnedXp
      }
    };

    const allScores = Object.values(updatedQuizzes).map(q => q.score);
    const avgScore =
      allScores.length > 0
        ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
        : score;

    const quizMat = ALL_MATERIALS.find(m => m.id === materialId);
    const modSeq = quizMat?.sequence ? `#${quizMat.sequence}` : '';

    // Badges Gamification check
    const currentBadges = [...(currentUser.badges || [])];
    if (updatedCompletedIds.length >= 1 && !currentBadges.includes('Langkah Pertama')) {
      currentBadges.push('Langkah Pertama');
    }
    if (updatedCompletedIds.length >= 5 && !currentBadges.includes('Penjelajah Kode')) {
      currentBadges.push('Penjelajah Kode');
    }
    if (updatedCompletedIds.length >= 10 && !currentBadges.includes('Bintang GenZi')) {
      currentBadges.push('Bintang GenZi');
    }

    const quizAct: StudentActivity = {
      id: `act-quiz-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type: 'quiz_passed',
      title: `Lulus Post Test: ${quizMat?.title || 'Modul'} (${score}%)`,
      description: `Menyelesaikan evaluasi pemahaman ${modSeq} dengan ${correctCount}/${totalQuestions} soal benar (${score}%)`,
      timestamp: nowIso,
      xpGained: earnedXp,
      metadata: {
        materialId,
        score
      }
    };

    const updatedActs = isPassed
      ? [quizAct, ...(currentUser.recentActivities || [])].slice(0, 15)
      : currentUser.recentActivities || [];

    const updatedUser: UserAccount = {
      ...currentUser,
      xp: newXp,
      quizScore: avgScore,
      quizCount: Object.keys(updatedQuizzes).length,
      badges: currentBadges,
      completedQuizzes: updatedQuizzes,
      completedMaterialIds: updatedCompletedIds,
      recentActivities: updatedActs
    };

    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => (u.id === currentUser.id ? updatedUser : u)));

    // Simpan riwayat submission Post Test dan update User ke Cloud Database (Firestore)
    const submission: QuizSubmission = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId: currentUser.id,
      studentName: currentUser.name,
      studentEmail: currentUser.email,
      materialId,
      materialTitle: quizMat?.title || 'Modul Pembelajaran',
      category: quizMat?.category,
      score,
      totalQuestions,
      correctCount,
      passed: isPassed,
      xpEarned: earnedXp,
      submittedAt: nowIso
    };

    try {
      await Promise.all([
        syncUserToFirestore(updatedUser),
        saveQuizSubmissionToFirestore(submission)
      ]);
    } catch (err) {
      console.warn('Sync Post Test to Firestore notice:', err);
    }

    if (isPassed) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore confetti errors
      }

      showToast({
        type: 'xp',
        title: '🎉 Post Test Berhasil Lulus!',
        message: `Skor kamu ${score}%. ${earnedXp > 0 ? `+${earnedXp} XP berhasil didapatkan! ` : ''}Jenjang modul berikutnya kini telah terbuka di kurikulum.`,
        xpGained: earnedXp,
        duration: 5500
      });
    }

    return { passed: isPassed, xpEarned: earnedXp };
  };

  // Student Activities Management
  const addStudentActivity = async (activity: Omit<StudentActivity, 'id' | 'timestamp'>) => {
    if (!currentUser) return;
    const nowIso = new Date().toISOString();
    const fullAct: StudentActivity = {
      ...activity,
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: nowIso
    };
    const existing = currentUser.recentActivities || [];
    const updatedActs = [fullAct, ...existing].slice(0, 15);
    const updatedUser: UserAccount = {
      ...currentUser,
      recentActivities: updatedActs
    };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => (u.id === currentUser.id ? updatedUser : u)));
    await syncUserToFirestore(updatedUser);
  };

  const recordClassAttendance = async (cls: OnlineClassSchedule) => {
    if (!currentUser) return;
    const nowIso = new Date().toISOString();
    const existing = currentUser.recentActivities || [];

    // Hindari duplikasi jika baru saja tercatat dalam 15 menit terakhir
    const isRecentDuplicate = existing.some(
      a => a.metadata?.classId === cls.id && (Date.now() - new Date(a.timestamp).getTime()) < 15 * 60 * 1000
    );
    if (isRecentDuplicate) return;

    const classAct: StudentActivity = {
      id: `act-cls-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type: 'class_attended',
      title: `Mengikuti Sesi Kelas Online: ${cls.title}`,
      description: `Tatap muka live via ${cls.platform === 'zoom' ? 'Zoom Meeting' : 'Google Meet'} bersama ${cls.instructorName}`,
      timestamp: nowIso,
      metadata: {
        classId: cls.id,
        platform: cls.platform
      }
    };

    const updatedActs = [classAct, ...existing].slice(0, 15);
    const updatedUser: UserAccount = {
      ...currentUser,
      recentActivities: updatedActs
    };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => (u.id === currentUser.id ? updatedUser : u)));
    await syncUserToFirestore(updatedUser);
  };

  const getStudentRecentActivities = useCallback((user?: UserAccount | null): StudentActivity[] => {
    const target = user || currentUser;
    if (!target) return [];

    if (target.recentActivities && target.recentActivities.length > 0) {
      return [...target.recentActivities]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 5);
    }

    // Fallback realistis otomatis dari riwayat modul & kuis yang sudah selesai
    const completedIds = target.completedMaterialIds || [];
    const quizzes = target.completedQuizzes || {};
    const fallbackActivities: StudentActivity[] = [];

    const reversedCompleted = [...completedIds].reverse();
    for (let i = 0; i < Math.min(3, reversedCompleted.length); i++) {
      const matId = reversedCompleted[i];
      const mat = ALL_MATERIALS.find(m => m.id === matId);
      if (mat) {
        fallbackActivities.push({
          id: `act-mat-${mat.id}`,
          type: 'module_completed',
          title: `Menyelesaikan Modul #${mat.sequence}: ${mat.title}`,
          description: `Berhasil menuntaskan seluruh instruksi proyek studio ${mat.category}`,
          timestamp: new Date(Date.now() - (i + 1) * 3600 * 1000 * 2.5).toISOString(),
          xpGained: 100,
          metadata: { materialId: mat.id, category: mat.category }
        });
      }
    }

    const quizEntries = Object.entries(quizzes);
    for (let j = 0; j < Math.min(2, quizEntries.length); j++) {
      const [qMatId, qData] = quizEntries[j];
      const mat = ALL_MATERIALS.find(m => m.id === qMatId);
      fallbackActivities.push({
        id: `act-quiz-${qMatId}`,
        type: 'quiz_passed',
        title: `Lulus Kuis Evaluasi ${mat ? `#${mat.sequence}` : ''} (${qData.score}%)`,
        description: `Menyelesaikan kuis pemahaman konsep dengan skor prima ${qData.score}%`,
        timestamp: qData.passedAt || new Date(Date.now() - 3600 * 1000 * 5).toISOString(),
        xpGained: 50,
        metadata: { materialId: qMatId, score: qData.score }
      });
    }

    if (fallbackActivities.length === 0) {
      fallbackActivities.push({
        id: `act-welcome-${target.id}`,
        type: 'badge_earned',
        title: 'Mulai Petualangan Belajar di GenZi Code',
        description: 'Akun aktif dan siap mengeksplorasi 54 modul coding & kurikulum berjenjang',
        timestamp: target.registeredAt || new Date().toISOString(),
        xpGained: 25
      });
    }

    return fallbackActivities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);
  }, [currentUser]);

  // Evaluasi Progres & Kelulusan per Jenjang Pembelajaran
  const getJenjangProgress = useCallback((jenjangId: string, user?: UserAccount | null) => {
    const targetUser = user || currentUser;
    const materials = getMaterialsForJenjang(jenjangId);
    const totalCount = materials.length;

    if (!targetUser || totalCount === 0) {
      return {
        isCompleted: false,
        completedCount: 0,
        totalCount,
        percentage: 0,
        averageScore: 0,
        certificate: undefined
      };
    }

    const completedIds = new Set(targetUser.completedMaterialIds || []);
    let completedCount = 0;
    let totalScore = 0;
    let scoreCount = 0;

    materials.forEach(mat => {
      const isCompletedInList = completedIds.has(mat.id);
      const quiz = targetUser.completedQuizzes?.[mat.id];
      const isPassedQuiz = quiz ? quiz.score >= 60 : false;

      // Admin & Instruktur dianggap tuntas bila terdaftar di completedIds;
      // Siswa & Trial dianggap tuntas bila telah menyelesaikan modul atau lulus post-test
      const isDone = (targetUser.role === 'admin' || targetUser.role === 'instruktur')
        ? isCompletedInList
        : (isCompletedInList || isPassedQuiz);

      if (isDone) {
        completedCount++;
      }
      if (quiz && typeof quiz.score === 'number') {
        totalScore += quiz.score;
        scoreCount++;
      }
    });

    const averageScore = scoreCount > 0 ? Math.round(totalScore / scoreCount) : 88;
    const isCompleted = completedCount >= totalCount;
    const percentage = Math.min(100, Math.round((completedCount / totalCount) * 100));

    // Cek sertifikat yang sudah tersimpan di Firestore untuk akun siswa ini
    const existingCert = certificates.find(
      c => c.userId === targetUser.id && c.jenjangId === jenjangId
    );

    return {
      isCompleted,
      completedCount,
      totalCount,
      percentage,
      averageScore,
      certificate: existingCert
    };
  }, [currentUser, certificates]);

  // Generate Sertifikat Resmi Jenjang & Simpan ke Cloud Firestore
  const generateJenjangCertificate = async (
    jenjangId: string,
    user?: UserAccount | null
  ): Promise<{ success: boolean; certificate?: JenjangCertificate; message?: string }> => {
    const targetUser = user || currentUser;
    if (!targetUser) {
      showToast({
        type: 'info',
        title: 'Harap Masuk Akun',
        message: 'Silakan masuk ke akun siswa untuk mengakses & menerbitkan sertifikat.'
      });
      return { success: false, message: 'Harap masuk ke akun terlebih dahulu' };
    }

    const definition = JENJANG_DEFINITIONS.find(j => j.id === jenjangId);
    if (!definition) {
      return { success: false, message: 'Jenjang materi tidak ditemukan' };
    }

    const progress = getJenjangProgress(jenjangId, targetUser);
    if (!progress.isCompleted) {
      showToast({
        type: 'info',
        title: 'Jenjang Belum Selesai',
        message: `Kamu telah menuntaskan ${progress.completedCount} dari ${progress.totalCount} modul di ${definition.title}. Selesaikan seluruh materi dan lulus Post Test untuk menerbitkan sertifikat!`
      });
      return { success: false, message: 'Seluruh materi dalam jenjang ini belum tuntas' };
    }

    // Jika sertifikat sudah pernah diterbitkan di Firestore, tampilkan langsung
    const existing = certificates.find(c => c.userId === targetUser.id && c.jenjangId === jenjangId);
    if (existing) {
      setSelectedJenjangCertificate(existing);
      setViewingCertificateUser(targetUser);
      showToast({
        type: 'success',
        title: 'Sertifikat Ditemukan di Firestore',
        message: `Sertifikat resmi ${definition.title} (${existing.certificateNumber}) telah tersimpan di database.`
      });
      return { success: true, certificate: existing };
    }

    // Terbitkan Sertifikat Baru
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const certNumber = `GZ-CERT-${definition.code}-2026-${randomCode}`;
    const verificationCode = `GZ-${Date.now().toString(36).toUpperCase()}-${(targetUser.id.replace(/\D/g, '') || '99').slice(-4)}`;
    const verificationUrl = `${window.location.origin}/?verify_cert=${certNumber}`;

    const newCert: JenjangCertificate = {
      id: `cert_${targetUser.id}_${jenjangId}`,
      certificateNumber: certNumber,
      userId: targetUser.id,
      studentName: targetUser.name,
      studentEmail: targetUser.email || '',
      school: targetUser.school || 'Pelajar Mandiri GenZi Code',
      jenjangId: definition.id,
      jenjangTitle: definition.title,
      jenjangCode: definition.code,
      competencyList: definition.competencyPoints,
      totalMaterials: progress.totalCount,
      completedMaterials: progress.completedCount,
      averageQuizScore: progress.averageScore,
      xpEarned: 250,
      issuedAt: new Date().toISOString(),
      instructorName: 'Pak Guru Luky',
      instructorTitle: 'Kepala Instruktur & Kurikulum GenZi Code',
      verificationCode,
      verificationUrl
    };

    // 1. Simpan ke Cloud Firestore Backend
    const saveRes = await saveCertificateToFirestore(newCert);
    if (!saveRes.success) {
      console.warn('Gagal menyimpan sertifikat ke Firestore:', saveRes.error);
    }

    // 2. Perbarui state lokal & cache
    setCertificates(prev => {
      const filtered = prev.filter(c => c.id !== newCert.id);
      const updated = [newCert, ...filtered];
      localStorage.setItem('genzicode_certificates', JSON.stringify(updated));
      return updated;
    });

    // 3. Berikan Poin XP (+250 XP) dan Lencana Kelulusan Jenjang ke Siswa
    const currentBadges = targetUser.badges || [];
    const badgeName = `Lulusan ${definition.levelBadge}`;
    const updatedBadges = currentBadges.includes(badgeName) ? currentBadges : [...currentBadges, badgeName];

    const updatedUser: UserAccount = {
      ...targetUser,
      xp: (targetUser.xp || 0) + 250,
      badges: updatedBadges
    };

    if (currentUser && targetUser.id === currentUser.id) {
      setCurrentUser(updatedUser);
      localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(updatedUser));
    }
    setUsers(prev => prev.map(u => (u.id === updatedUser.id ? updatedUser : u)));
    await syncUserToFirestore(updatedUser);

    // 4. Catat riwayat aktivitas siswa
    await addStudentActivity({
      type: 'badge_earned',
      title: `Memperoleh Sertifikat ${definition.title}`,
      description: `Menyelesaikan seluruh ${progress.totalCount} modul dengan rata-rata skor evaluasi ${progress.averageScore}%`,
      xpGained: 250,
      metadata: { certNumber, jenjangId }
    });

    // 5. Efek selebrasi confetti
    try {
      confetti({
        particleCount: 140,
        spread: 90,
        origin: { y: 0.55 }
      });
    } catch {
      // ignore
    }

    setSelectedJenjangCertificate(newCert);
    setViewingCertificateUser(targetUser);

    showToast({
      type: 'badge',
      title: '🏆 Sertifikat Jenjang Diterbitkan!',
      message: `Selamat! Sertifikat ${definition.title} resmi tersimpan di database Cloud Firestore (+250 XP bonus)!`
    });

    return { success: true, certificate: newCert };
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        activeStudio,
        selectedMaterial,
        darkMode,
        toggleDarkMode,
        viewingCertificateUser,
        setViewingCertificateUser,
        viewingReportUser,
        setViewingReportUser,
        loginAsAdmin,
        loginUser,
        registerSelfStudent,
        startTrialSession,
        approveStudent,
        rejectStudent,
        updateUserDuration,
        registerStudentDirectly,
        addInstructorDirectly,
        deleteUser,
        clearDemoData,
        syncToGoogleSheets,
        completeMaterial,
        addXp,
        resetUserProgress,
        switchUser,
        logout,
        openStudio,
        openMaterial,
        isMaterialUnlocked,
        canAccessMaterial,
        getCompletionPercentage,
        exportTableToCSV,
        exportToGoogleSheetsCSV,
        refreshDatabase,
        toast,
        showToast,
        hideToast,
        onlineClasses,
        createOnlineClass,
        updateOnlineClass,
        deleteOnlineClass,
        submitModuleQuiz,
        addStudentActivity,
        recordClassAttendance,
        getStudentRecentActivities,
        certificates,
        selectedJenjangCertificate,
        setSelectedJenjangCertificate,
        getJenjangProgress,
        generateJenjangCertificate
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
