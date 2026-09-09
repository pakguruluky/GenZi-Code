import { useState, useEffect } from 'react';
import { Material } from '../types';

export interface OfflineMaterialSummary {
  id: string;
  sequence: number;
  title: string;
  category: string;
  level: string;
  type: string;
  description: string;
  competency?: string;
  indicators?: string;
  duration?: string;
  semester?: string;
  savedAt: string;
  isCompleted: boolean;
}

const STORAGE_KEY = 'genzi_offline_cached_materials';

/**
 * Menyimpan atau memperbarui ringkasan materi secara lokal agar bisa dibaca saat offline.
 */
export const saveMaterialOffline = (material: Material, isCompleted: boolean = false): void => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const list: OfflineMaterialSummary[] = raw ? JSON.parse(raw) : [];

    const existingIndex = list.findIndex(m => m.id === material.id);
    const summary: OfflineMaterialSummary = {
      id: material.id,
      sequence: material.sequence,
      title: material.title,
      category: material.category,
      level: material.level,
      type: material.type,
      description: material.description || 'Ringkasan materi pembelajaran GenZi Code.',
      competency: material.competency || '',
      indicators: material.indicators || '',
      duration: material.duration || '',
      semester: material.semester || 'Reguler',
      savedAt: new Date().toISOString(),
      isCompleted
    };

    if (existingIndex >= 0) {
      list[existingIndex] = summary;
    } else {
      list.push(summary);
    }

    // Urutkan berdasarkan urutan materi
    list.sort((a, b) => a.sequence - b.sequence);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.warn('Gagal menyimpan materi offline ke local storage:', err);
  }
};

/**
 * Mengambil seluruh daftar ringkasan materi yang sudah tersimpan di penyimpanan lokal.
 */
export const getOfflineMaterials = (): OfflineMaterialSummary[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.warn('Gagal membaca materi offline dari local storage:', err);
    return [];
  }
};

/**
 * Mengambil ringkasan materi tertentu berdasarkan ID.
 */
export const getOfflineMaterialById = (id: string): OfflineMaterialSummary | null => {
  const all = getOfflineMaterials();
  return all.find(m => m.id === id) || null;
};

/**
 * Cek apakah materi tertentu sudah tersimpan di offline cache.
 */
export const isOfflineMaterialCached = (id: string): boolean => {
  const all = getOfflineMaterials();
  return all.some(m => m.id === id);
};

/**
 * Hook untuk memantau status koneksi internet perangkat secara real-time.
 */
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};

/**
 * Mendaftarkan Service Worker untuk caching aplikasi offline jika browser mendukung.
 */
export const registerServiceWorker = () => {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('[SW] Service worker registered successfully:', reg.scope);
        })
        .catch((err) => {
          console.warn('[SW] Service worker registration failed:', err);
        });
    });
  }
};
