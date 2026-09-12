import { JenjangDefinition, Material } from '../types';
import { ALL_MATERIALS } from './curriculumData';

export const JENJANG_DEFINITIONS: JenjangDefinition[] = [
  {
    id: 'jenjang-scratch',
    code: 'SCR-J1',
    title: 'Jenjang 1: Scratch 3.0 Creative Coding & Logic',
    subtitle: 'Tingkat Dasar — Animasi Interaktif, Desain Game 2D, & Logika Visual',
    category: 'Scratch',
    levelBadge: 'Tingkat Dasar',
    description: 'Menguasai konsep fundamental algoritma, struktur logika perulangan (looping), percabangan kondisi (if-else), manajemen sprite koordinat X-Y, variabel dinamis, dan efek audio visual interaktif.',
    competencyPoints: [
      'Konsep Algoritma Pemrograman Blok & Event Driven Programming',
      'Logika Perulangan (Looping), Percabangan (If-Else), & Logika Operator',
      'Manajemen Variabel, Perhitungan Skor Otomatis, & Koordinat Kartesius',
      'Deteksi Tabrakan (Collision Sensing) & Desain Interaktif Game 2D',
      'Pengorganisasian Aset Sprite, Suara, dan Sinematografi Stage'
    ],
    iconName: 'Code2',
    gradient: 'from-amber-500 to-orange-600',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    borderColor: 'border-amber-500/30'
  },
  {
    id: 'jenjang-microbit',
    code: 'MBIT-J2',
    title: 'Jenjang 2: BBC Micro:bit Physical Computing & IoT',
    subtitle: 'Tingkat Menengah — Mikrokontroler, Sensor Lingkungan, & Otomasi Cerdas',
    category: 'Microbit',
    levelBadge: 'Tingkat Menengah',
    description: 'Menghubungkan kode perangkat lunak dengan dunia nyata melalui simulasi mikrokontroler BBC Micro:bit MakeCode, matriks lampu LED 5x5, sensor gerak akselerometer, kompas digital, dan komunikasi radio.',
    competencyPoints: [
      'Pemrograman Mikrokontroler & Penampil Animasi Matriks LED 5x5',
      'Pembacaan Sensor Akselerometer (Gestur Goyang, Tilt, Jatuh Bebas)',
      'Sensor Suhu, Tingkat Cahaya, & Deteksi Arah Kompas Digital',
      'Komunikasi Nirkabel Gelombang Radio Antar-Perangkat Micro:bit',
      'Aplikasi Rekayasa IoT: Termometer Cerdas, Kompas Digital, & Alarm Pintar'
    ],
    iconName: 'Cpu',
    gradient: 'from-emerald-500 to-teal-600',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    borderColor: 'border-emerald-500/30'
  },
  {
    id: 'jenjang-pictoblox',
    code: 'AI-J3',
    title: 'Jenjang 3: PictoBlox Artificial Intelligence & Machine Learning',
    subtitle: 'Tingkat Mahir — Computer Vision, Pengenalan Citra, & Pemodelan AI',
    category: 'Pictoblox',
    levelBadge: 'Tingkat Mahir',
    description: 'Memahami cara kerja Kecerdasan Buatan (AI) modern: melatih dataset klasifikasi gambar dengan kamera (Computer Vision), pendeteksian landmark ekspresi wajah, speech recognition, dan natural language.',
    competencyPoints: [
      'Prinsip Kerja Machine Learning: Dataset, Pelatihan Model, & Prediksi Akurasi',
      'Computer Vision & Ekstrak Fitur Objek Visual dari Input Webcam',
      'Face Detection & Analisis Ekspresi Emosi / Landmark Wajah',
      'Speech Synthesis (Text-to-Speech) & Pengenalan Perintah Suara Manusia',
      'Penerapan Etika AI & Solusi Cerdas Ramah Lingkungan Berbasis AI'
    ],
    iconName: 'Bot',
    gradient: 'from-blue-600 to-indigo-700',
    badgeBg: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    borderColor: 'border-blue-500/30'
  },
  {
    id: 'jenjang-gamedev',
    code: 'GAME-J4',
    title: 'Jenjang 4: Game Architecture & CodeCombat RPG Python/JS',
    subtitle: 'Tingkat Lanjutan — SpriteLab, MakeCode Arcade, & Text Coding Dungeon',
    category: 'Multi',
    levelBadge: 'Tingkat Lanjutan',
    description: 'Transisi dari pemrograman blok visual ke kode teks nyata Python & JavaScript. Membangun game arcade mandiri dan menjelajahi labirin RPG dungeon koding dengan kontrol sintaks berbasis baris kode.',
    competencyPoints: [
      'Mekanika Game Loop & State Management pada SpriteLab & Arcade',
      'Dekomposisi Logika Komputasional & Pemecahan Masalah Unplugged',
      'Sintaks Dasar Kode Teks Python & JavaScript dalam CodeCombat Dungeon',
      'Navigasi Labirin Berbasis Metode Objek (hero.moveRight, hero.attack)',
      'Strategi Pengoptimalan Eksekusi Perintah untuk Menaklukkan Tantangan Algoritma'
    ],
    iconName: 'Swords',
    gradient: 'from-rose-500 via-pink-600 to-purple-600',
    badgeBg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    borderColor: 'border-rose-500/30'
  },
  {
    id: 'jenjang-full',
    code: 'MASTER-FULL',
    title: 'Jenjang Utama: Purna Kurikulum GenZi Code Master',
    subtitle: 'Gelar Kelulusan Utama — Menguasai 54 Modul Coding, IoT & AI Terakreditasi',
    category: 'All',
    levelBadge: 'Grandmaster Kelulusan',
    description: 'Pencapaian tertinggi kurikulum GenZi Code! Menyelesaikan seluruh 54 modul pembelajaran Scratch, BBC Micro:bit, PictoBlox AI, Game Logika, dan CodeCombat dengan evaluasi Post Test terverifikasi.',
    competencyPoints: [
      'Penguasaan Menyeluruh Pemrograman Visual, Teks, Sensor IoT, dan AI',
      'Kelulusan Post Test 54 Modul dengan Standar Nilai Minimal Terpenuhi',
      'Portofolio Terintegrasi Animasi, Robotika Virtual, dan Model Machine Learning',
      'Kesiapan Berpikir Komputasional dan Problem Solving Abad 21'
    ],
    iconName: 'Award',
    gradient: 'from-amber-600 via-yellow-500 to-amber-700',
    badgeBg: 'bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700',
    borderColor: 'border-amber-400'
  }
];

/**
 * Returns the list of materials that belong to a specific jenjang
 */
export function getMaterialsForJenjang(jenjangId: string): Material[] {
  switch (jenjangId) {
    case 'jenjang-scratch':
      return ALL_MATERIALS.filter(m => m.category === 'Scratch');
    case 'jenjang-microbit':
      return ALL_MATERIALS.filter(m => m.category === 'Microbit');
    case 'jenjang-pictoblox':
      return ALL_MATERIALS.filter(m => m.category === 'Pictoblox');
    case 'jenjang-gamedev':
      return ALL_MATERIALS.filter(m =>
        m.category === 'CodeCombat' ||
        m.category === 'Game Logika (SpriteLab)' ||
        m.category === 'MakeCode Arcade' ||
        m.category === 'Unplugged'
      );
    case 'jenjang-full':
    default:
      return ALL_MATERIALS;
  }
}
