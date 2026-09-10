import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  initializeFirestore,
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
  Firestore
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebaseAppletConfig from '../../firebase-applet-config.json';
import { UserAccount } from '../types';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || firebaseAppletConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || firebaseAppletConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || firebaseAppletConfig.projectId,
  firestoreDatabaseId: import.meta.env.VITE_FIRESTORE_DATABASE_ID || firebaseAppletConfig.firestoreDatabaseId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || firebaseAppletConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseAppletConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || firebaseAppletConfig.appId,
};

// Initialize Cloud Database with Long Polling and undefined property tolerance
let app: any = null;
let db: Firestore | null = null;
let auth: any = null;

try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  try {
    db = initializeFirestore(
      app,
      {
        ignoreUndefinedProperties: true,
        experimentalForceLongPolling: true,
      },
      firebaseConfig.firestoreDatabaseId
    );
  } catch {
    db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
  }
  auth = getAuth(app);
} catch (initErr) {
  console.warn('Database initialization note:', initErr);
}

export const getDb = (): Firestore | null => db;
export { app, db, auth };

const USERS_COLLECTION = 'genzi_users';
const PROJECTS_COLLECTION = 'genzi_projects';

/**
 * Clean any undefined properties from object to ensure Firestore never throws
 */
export function sanitizeForFirestore<T extends Record<string, any>>(obj: T): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        result[key] = value.filter(item => item !== undefined);
      } else if (value !== null && typeof value === 'object' && !(value instanceof Date)) {
        result[key] = sanitizeForFirestore(value);
      } else {
        result[key] = value;
      }
    }
  }
  return result;
}

export interface StudioProjectDoc {
  id: string;
  studioType: 'scratch' | 'pictoblox' | 'microbit';
  title: string;
  authorId?: string;
  authorName?: string;
  content: any;
  updatedAt: string;
}

export async function saveProjectToFirestore(project: StudioProjectDoc): Promise<boolean> {
  if (!db) return false;
  try {
    const projectRef = doc(db, PROJECTS_COLLECTION, project.id);
    const cleaned = sanitizeForFirestore({
      ...project,
      updatedAt: new Date().toISOString()
    });
    await setDoc(projectRef, cleaned, { merge: true });
    return true;
  } catch (error) {
    console.warn('Database saveProject notice (fallback to local cache):', error);
    return false;
  }
}

export async function fetchProjectsFromFirestore(studioType?: 'scratch' | 'pictoblox' | 'microbit'): Promise<StudioProjectDoc[]> {
  if (!db) return [];
  try {
    const snapshot = await getDocs(collection(db, PROJECTS_COLLECTION));
    if (snapshot.empty) return [];
    const list = snapshot.docs.map(d => d.data() as StudioProjectDoc);
    if (studioType) {
      return list.filter(p => p.studioType === studioType);
    }
    return list;
  } catch (error) {
    console.warn('Database fetchProjects notice:', error);
    return [];
  }
}

export async function syncUserToFirestore(user: UserAccount): Promise<{ success: boolean; error?: string }> {
  if (!db) {
    console.warn('Database sync warning: Firestore db is not initialized');
    return { success: false, error: 'Database belum terinisialisasi' };
  }
  try {
    const userRef = doc(db, USERS_COLLECTION, user.id);
    const cleanedData = sanitizeForFirestore({
      ...user,
      updatedAt: new Date().toISOString()
    });
    await setDoc(userRef, cleanedData, { merge: true });
    console.log('[Firestore] User berhasil tersimpan:', user.name, user.id, `Status: ${user.status}`);
    return { success: true };
  } catch (error: any) {
    console.error('[Firestore] Gagal menyimpan user ke database:', error);
    return { success: false, error: error?.message || 'Gagal menyimpan ke database' };
  }
}

export async function fetchAllUsersFromFirestore(): Promise<UserAccount[] | null> {
  if (!db) return null;
  try {
    const snapshot = await getDocs(collection(db, USERS_COLLECTION));
    if (snapshot.empty) return null;
    return snapshot.docs.map(doc => doc.data() as UserAccount);
  } catch (error) {
    console.warn('Database fetch notice (using cache):', error);
    return null;
  }
}

export async function updateUserStatusFirestore(
  userId: string,
  status: 'active' | 'pending' | 'rejected',
  details?: {
    approvedBy?: string;
    duration?: string;
    activatedAt?: string;
    expiresAt?: string;
  }
): Promise<boolean> {
  if (!db) return false;
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    const updatePayload: Record<string, any> = {
      status,
      updatedAt: new Date().toISOString()
    };
    if (status === 'active') {
      updatePayload.approvedBy = details?.approvedBy || 'Admin GenZi';
      updatePayload.approvedAt = new Date().toISOString();
      if (details?.activatedAt) updatePayload.activatedAt = details.activatedAt;
      if (details?.duration) updatePayload.duration = details.duration;
      if (details?.expiresAt !== undefined) updatePayload.expiresAt = details.expiresAt;
    } else if (status === 'rejected') {
      updatePayload.approvedBy = details?.approvedBy || 'Admin GenZi';
    }

    const cleaned = sanitizeForFirestore(updatePayload);
    await updateDoc(userRef, cleaned);
    console.log(`[Firestore] Status user ${userId} diperbarui ke ${status}`);
    return true;
  } catch (error) {
    console.error('Database status update error:', error);
    return false;
  }
}

export async function deleteUserFromFirestore(userId: string): Promise<boolean> {
  if (!db) return false;
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    await deleteDoc(userRef);
    console.log(`[Firestore] User ${userId} berhasil dihapus dari database`);
    return true;
  } catch (error) {
    console.error('Database delete error:', error);
    return false;
  }
}

export function subscribeToUsers(onUpdate: (users: UserAccount[]) => void): () => void {
  if (!db) return () => {};
  try {
    const unsub = onSnapshot(
      collection(db, USERS_COLLECTION),
      (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map(doc => doc.data() as UserAccount);
          onUpdate(list);
        } else {
          onUpdate([]);
        }
      },
      (error) => {
        console.warn('Realtime database listener notice:', error);
      }
    );
    return unsub;
  } catch (err) {
    console.warn('Failed to subscribe to database updates:', err);
    return () => {};
  }
}

