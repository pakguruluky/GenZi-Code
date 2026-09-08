import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  Firestore
} from 'firebase/firestore';
import { UserAccount } from '../types';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB-2tojeBZzd6wMpYqNt2a-JAjdy13qFmo",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "genzi-code.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "genzi-code",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "genzi-code.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "427113407352",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:427113407352:web:346494697939e0749c1e8d"
};

// Initialize Cloud Database
let app: any = null;
let db: Firestore | null = null;

try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  db = getFirestore(app);
} catch (initErr) {
  console.warn('Database initialization note (using local cache mode):', initErr);
}

export const getDb = (): Firestore | null => db;
export { app, db };

const USERS_COLLECTION = 'genzi_users';
const PROJECTS_COLLECTION = 'genzi_projects';

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
    await setDoc(projectRef, {
      ...project,
      updatedAt: new Date().toISOString()
    }, { merge: true });
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

export async function syncUserToFirestore(user: UserAccount): Promise<void> {
  if (!db) return;
  try {
    const userRef = doc(db, USERS_COLLECTION, user.id);
    await setDoc(userRef, {
      ...user,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.warn('Database sync notice (saved locally):', error);
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

export async function updateUserStatusFirestore(userId: string, status: 'active' | 'pending' | 'rejected', approvedBy?: string): Promise<void> {
  if (!db) return;
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    await updateDoc(userRef, {
      status,
      approvedBy: approvedBy || 'Admin',
      approvedAt: status === 'active' ? new Date().toISOString() : null,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.warn('Database status update notice:', error);
  }
}

export async function deleteUserFromFirestore(userId: string): Promise<void> {
  if (!db) return;
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    await deleteDoc(userRef);
  } catch (error) {
    console.warn('Database delete notice:', error);
  }
}
