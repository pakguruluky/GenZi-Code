import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  initializeFirestore,
  getFirestore,
  setLogLevel,
  doc,
  getDocFromServer,
  collection,
  setDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
  Firestore
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebaseAppletConfig from '../../firebase-applet-config.json';
import { UserAccount, OnlineClassSchedule } from '../types';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || firebaseAppletConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || firebaseAppletConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || firebaseAppletConfig.projectId,
  firestoreDatabaseId: import.meta.env.VITE_FIRESTORE_DATABASE_ID || firebaseAppletConfig.firestoreDatabaseId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || firebaseAppletConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseAppletConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || firebaseAppletConfig.appId,
};

// Suppress non-fatal connection retry warnings from internal WebChannel logger
try {
  setLogLevel('error');
} catch {
  // ignore
}

// Initialize Cloud Database with Auto-Detect Long Polling and undefined property tolerance
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
        experimentalAutoDetectLongPolling: true,
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

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
      emailVerified: auth?.currentUser?.emailVerified,
      isAnonymous: auth?.currentUser?.isAnonymous,
      tenantId: auth?.currentUser?.tenantId,
      providerInfo: auth?.currentUser?.providerData?.map((provider: any) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Validate connection to Firestore on boot as per Firebase Skill guidelines
export async function testConnection(): Promise<boolean> {
  if (!db) return false;
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Firestore connection notice: The client is currently operating in offline/cached mode.");
    }
    return false;
  }
}

// Run connection check in background safely
testConnection().catch(() => {});

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
        if (error?.code === 'permission-denied') {
          handleFirestoreError(error, OperationType.LIST, USERS_COLLECTION);
        } else {
          console.warn('Realtime database listener notice:', error?.message || error);
        }
      }
    );
    return unsub;
  } catch (err) {
    console.warn('Failed to subscribe to database updates:', err);
    return () => {};
  }
}

const ONLINE_CLASSES_COLLECTION = 'genzi_online_classes';

export async function saveOnlineClassToFirestore(cls: OnlineClassSchedule): Promise<{ success: boolean; error?: string }> {
  if (!db) {
    return { success: false, error: 'Database belum terinisialisasi' };
  }
  try {
    const classRef = doc(db, ONLINE_CLASSES_COLLECTION, cls.id);
    const cleaned = sanitizeForFirestore({
      ...cls,
      updatedAt: new Date().toISOString()
    });
    await setDoc(classRef, cleaned, { merge: true });
    console.log('[Firestore] Jadwal kelas online tersimpan:', cls.title, cls.id);
    return { success: true };
  } catch (error: any) {
    if (error?.code === 'permission-denied') {
      handleFirestoreError(error, OperationType.WRITE, ONLINE_CLASSES_COLLECTION);
    }
    console.error('[Firestore] Gagal menyimpan kelas online:', error);
    return { success: false, error: error?.message || 'Gagal menyimpan kelas online' };
  }
}

export async function deleteOnlineClassFromFirestore(classId: string): Promise<boolean> {
  if (!db) return false;
  try {
    const classRef = doc(db, ONLINE_CLASSES_COLLECTION, classId);
    await deleteDoc(classRef);
    console.log('[Firestore] Kelas online dihapus:', classId);
    return true;
  } catch (error: any) {
    if (error?.code === 'permission-denied') {
      handleFirestoreError(error, OperationType.DELETE, ONLINE_CLASSES_COLLECTION);
    }
    console.error('[Firestore] Gagal menghapus kelas online:', error);
    return false;
  }
}

export async function fetchAllOnlineClassesFromFirestore(): Promise<OnlineClassSchedule[] | null> {
  if (!db) return null;
  try {
    const snapshot = await getDocs(collection(db, ONLINE_CLASSES_COLLECTION));
    if (snapshot.empty) return [];
    return snapshot.docs.map(d => d.data() as OnlineClassSchedule);
  } catch (error: any) {
    if (error?.code === 'permission-denied') {
      handleFirestoreError(error, OperationType.LIST, ONLINE_CLASSES_COLLECTION);
    }
    console.warn('[Firestore] Error fetch online classes:', error);
    return null;
  }
}

export function subscribeToOnlineClasses(onUpdate: (classes: OnlineClassSchedule[]) => void): () => void {
  if (!db) return () => {};
  try {
    const unsub = onSnapshot(
      collection(db, ONLINE_CLASSES_COLLECTION),
      (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map(doc => doc.data() as OnlineClassSchedule);
          // Sort by dateTime ascending
          list.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
          onUpdate(list);
        } else {
          onUpdate([]);
        }
      },
      (error) => {
        if (error?.code === 'permission-denied') {
          handleFirestoreError(error, OperationType.LIST, ONLINE_CLASSES_COLLECTION);
        } else {
          console.warn('Realtime online classes listener notice:', error?.message || error);
        }
      }
    );
    return unsub;
  } catch (err) {
    console.warn('Failed to subscribe to online classes:', err);
    return () => {};
  }
}

