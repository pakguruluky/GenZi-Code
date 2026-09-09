import React, { useState } from 'react';
import {
  Code2,
  Cpu,
  Bot,
  CheckCircle2,
  Sparkles,
  Rocket,
  Lock,
  ArrowRight,
  Check,
  Award,
  Layers,
  Gamepad2,
  ShieldCheck,
  FileSpreadsheet,
  Flame,
  Star,
  PlayCircle
} from 'lucide-react';

interface CurriculumShowcaseProps {
  onOpenAuth: (tab?: 'login' | 'register' | 'trial' | 'admin') => void;
}

interface PillarData {
  id: 'scratch' | 'microbit' | 'pictoblox';
  categoryTitle: string;
  platform: string;
  tagline: string;
  badge: string;
  themeColor: string;
  accentBg: string;
  borderHover: string;
  tagClass: string;
  totalModules: number;
  moduleRange: string;
  ageTarget: string;
  marketingHook: string;
  description: string;
  coreCompetencies: string[];
  realProjects: { title: string; desc: string }[];
  featuredModules: { no: number; title: string; tag: string }[];
}

const PILLARS: PillarData[] = [
  {
    id: 'scratch',
    categoryTitle: 'Fase 1: Game Development & Logika Pemrograman Visual',
    platform: 'Scratch 3.0 (MIT)',
    tagline: 'Membangun Daya Pikir Logis Sejak Dini',
    badge: 'Fondasi Utama Coding',
    themeColor: 'from-amber-500 to-orange-600',
    accentBg: 'bg-amber-50 dark:bg-amber-950/40',
    borderHover: 'hover:border-amber-400',
    tagClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    totalModules: 18,
    moduleRange: 'Modul #01 s/d #18',
    ageTarget: 'Usia 7 – 12 Tahun (Pemula)',
    marketingHook: 'Ubah Hobi Main Game Jadi Kemampuan Membuat Game Sendiri!',
    description: 'Anak diajarkan menyusun algoritma visual drag-and-drop layaknya menyusun balok lego. Memahami logika percabangan, koordinat ruang 2D, fisika gravitasi, serta sistem skor variabel interaktif.',
    coreCompetencies: [
      'Memahami logika algoritma sekuensial dan loop berulang',
      'Kontrol koordinat kartesius X & Y untuk animasi sprite dinamis',
      'Fisika game: Gerakan loncat, pantulan tepi, gravitasi platformer',
      'Variabel dinamis: Skor angka, nyawa pemain, dan countdown timer',
      'Percabangan if-then-else serta pengiriman pesan antar-karakter'
    ],
    realProjects: [
      { title: 'Game Tangkap Buah Berkecepatan Tinggi', desc: 'Game arcade seru dengan penghitung skor bertingkat dan efek suara saat objek ditangkap.' },
      { title: 'Petualangan Labirin Berhantu (Maze Runner)', desc: 'Menavigasi karakter melewati tembok jebakan menggunakan tombol panah keyboard.' },
      { title: 'Space Shooter: Perang Asteroid Galaksi', desc: 'Pesawat antariksa dengan sistem tembak proyektil, spawn musuh otomatis, dan boss stage.' },
      { title: 'Game Duel 2 Pemain (Multiplayer Seru)', desc: 'Dua karakter dikontrol bersamaan dalam satu keyboard untuk bertanding secara adil.' }
    ],
    featuredModules: [
      { no: 1, title: 'Mengenal Kanvas & Logika Blok Scratch Pertama', tag: 'Dasar' },
      { no: 4, title: 'Membuat Sprite Bergerak & Pantulan Tepi Layar', tag: 'Animasi' },
      { no: 5, title: 'Projek 1: Game Saling Menembak & Deteksi Sentuhan', tag: 'Game 2D' },
      { no: 8, title: 'Memahami Logika Perulangan & Event Keyboard', tag: 'Logika' },
      { no: 11, title: 'Sistem Skor Variabel & Penentu Kemenangan', tag: 'Variabel' },
      { no: 14, title: 'Fisika Karakter Melompat (Platformer Game)', tag: 'Fisika Game' },
      { no: 18, title: 'Projek Akhir Game Komplit Berjenjang Level', tag: 'Master Game' }
    ]
  },
  {
    id: 'microbit',
    categoryTitle: 'Fase 2: Hardware Virtual, Sensor Digital & Robotika IoT',
    platform: 'BBC Micro:bit (MakeCode)',
    tagline: 'Eksplorasi Perangkat Pintar & Internet of Things',
    badge: 'Hardware & Smart Devices',
    themeColor: 'from-emerald-500 to-teal-600',
    accentBg: 'bg-emerald-50 dark:bg-emerald-950/40',
    borderHover: 'hover:border-emerald-400',
    tagClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    totalModules: 18,
    moduleRange: 'Modul #19 s/d #36',
    ageTarget: 'Usia 9 – 14 Tahun',
    marketingHook: 'Hemat Jutaan Rupiah! Belajar Robotika & Smart Device Tanpa Perlu Beli Alat Fisik.',
    description: 'Melalui simulator sirkuit interaktif BBC micro:bit, siswa memprogram mikrokontroler pintar secara langsung. Membaca sensor gerak, temperatur ruangan, kompas arah, hingga membuat alarm otomatis.',
    coreCompetencies: [
      'Visualisasi matriks 25 lampu LED, teks berjalan, & animasi emoji',
      'Pemrograman input tombol fisik A & B serta sentuhan pin sirkuit',
      'Membaca sensor accelerometer: Gerak, kemiringan, & guncangan (shake)',
      'Pengukuran suhu cuaca lingkungan & sistem kompas navigasi',
      'Konsep transmisi nirkabel sinyal radio antar-perangkat IoT'
    ],
    realProjects: [
      { title: 'Smartwatch Digital dengan Pedometer Kaki', desc: 'Jam tangan cerdas simulator yang menghitung jumlah langkah kaki secara real-time.' },
      { title: 'Dadu Elektronik Acak Kocok (Magic Dice)', desc: 'Angka acak 1-6 muncul otomatis pada display LED saat simulator diguncang.' },
      { title: 'Alarm Anti-Maling Sensor Getaran Rumah', desc: 'Sistem keamanan cerdas yang membunyikan sirine ketika mendeteksi gerakan tak terduga.' },
      { title: 'Termometer Stasiun Cuaca Otomatis', desc: 'Pendeteksi suhu ruangan cerdas dengan indikator ikon panas, normal, atau dingin.' }
    ],
    featuredModules: [
      { no: 19, title: 'Pengenalan Simulator Papan BBC Micro:bit MakeCode', tag: 'Hardware' },
      { no: 22, title: 'Animasi Matriks LED 5x5 & Teks Berjalan Interaktif', tag: 'Display' },
      { no: 25, title: 'Logika Input Tombol A/B & Kalkulator Hitung Cepat', tag: 'Interaksi' },
      { no: 29, title: 'Sensor Accelerometer: Penghitung Langkah Kaki Pedometer', tag: 'Sensor Gerak' },
      { no: 32, title: 'Sensor Suhu Digital & Indikator Cuaca Visual', tag: 'Sensor Suhu' },
      { no: 34, title: 'Kompas Digital & Sistem Navigasi Penunjuk Arah', tag: 'Kompas' },
      { no: 36, title: 'Projek Sistem Keamanan Rumah IoT Terintegrasi', tag: 'Projek IoT' }
    ]
  },
  {
    id: 'pictoblox',
    categoryTitle: 'Fase 3: Artificial Intelligence (AI) & Machine Learning Masa Depan',
    platform: 'PictoBlox AI Studio',
    tagline: 'Mempersiapkan Generasi Emas di Era Kecerdasan Buatan',
    badge: 'Masa Depan & AI',
    themeColor: 'from-blue-600 to-indigo-700',
    accentBg: 'bg-blue-50 dark:bg-blue-950/40',
    borderHover: 'hover:border-blue-400',
    tagClass: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    totalModules: 18,
    moduleRange: 'Modul #37 s/d #54',
    ageTarget: 'Usia 10 – 16 Tahun',
    marketingHook: 'Bukan Sekadar Pemakai, Bimbing Ananda Menjadi Pencipta Teknologi AI!',
    description: 'Materi revolusioner yang memperkenalkan dunia Artificial Intelligence sejak dini. Siswa melatih model machine learning sendiri lewat kamera webcam: deteksi senyuman, pose gerakan tubuh, hingga asisten suara.',
    coreCompetencies: [
      'Visi Komputer (Computer Vision): Deteksi wajah, titik mata, & senyuman',
      'Pose Net AI: Mengontrol karakter game lewat gerakan tangan & kepala',
      'Pemrosesan Bahasa Alami (NLP): Text-to-Speech & Speech Recognition',
      'Melatih dataset klasifikasi gambar sendiri (Machine Learning Teachable)',
      'Memahami etika teknologi dan penerapan AI dalam kehidupan nyata'
    ],
    realProjects: [
      { title: 'Kamera Filter AR Wajah Instagram Buatan Sendiri', desc: 'Menambahkan topi, kacamata, dan efek visual otomatis mengikuti pergerakan wajah.' },
      { title: 'Game Flappy Bird Kontrol Gerakan Kepala (Hands-free)', desc: 'Karakter terbang naik saat tersenyum atau mengangkat dagu di depan kamera.' },
      { title: 'Asisten Suara Cerdas (Mini Jarvis AI)', desc: 'Aplikasi yang menjawab pertanyaan pengguna secara lisan dengan suara AI ramah.' },
      { title: 'Sistem Deteksi Masker & Pengenal Citra Benda', desc: 'Model AI yang mampu membedakan apakah seseorang memakai masker atau tidak.' }
    ],
    featuredModules: [
      { no: 37, title: 'Pengenalan Studio AI PictoBlox & Modul Visi Cerdas', tag: 'Dasar AI' },
      { no: 40, title: 'Computer Vision: Deteksi Wajah & Filter Interaktif Kamera', tag: 'Face AI' },
      { no: 43, title: 'Emotion Recognition: Mendeteksi Senyum, Bahagia & Kaget', tag: 'Emosi AI' },
      { no: 45, title: 'Pose Net: Game Kontrol Gerakan Tangan Tanpa Sentuh', tag: 'Motion Net' },
      { no: 48, title: 'Speech AI: Membangun Asisten Suara Interaktif Mandiri', tag: 'Voice AI' },
      { no: 51, title: 'Machine Learning: Melatih Model Klasifikasi Gambar Sendiri', tag: 'Train ML' },
      { no: 54, title: 'Projek Portofolio Akhir: Aplikasi Cerdas Multi-AI Kelulusan', tag: 'Grand Final' }
    ]
  }
];

export const CurriculumShowcase: React.FC<CurriculumShowcaseProps> = ({ onOpenAuth }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'scratch' | 'microbit' | 'pictoblox'>('all');

  const displayedPillars = activeTab === 'all'
    ? PILLARS
    : PILLARS.filter(p => p.id === activeTab);

  return (
    <section id="peta-kurikulum" className="space-y-10 scroll-mt-20">
      {/* 1. SECTION HEADER (PERSUASIVE MARKETING HEADLINE) */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Silabus Lengkap 54 Modul Berjenjang • Standar Internasional</span>
        </div>

        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          Gambaran Materi Eksklusif:{' '}
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-amber-500 bg-clip-text text-transparent">
            Dari Pemula Nol Hingga Mahir AI
          </span>
        </h2>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Bukan sekadar teori membosankan! Kurikulum <strong>GenZi Code</strong> dirancang khusus menggunakan metode <strong className="text-indigo-600 dark:text-indigo-400">Project-Based Learning</strong>. Setiap modul menuntun siswa langkah demi langkah menghasilkan karya digital orisinal yang bisa dipamerkan ke keluarga dan sekolah.
        </p>

        {/* 2. TAB PILL FILTER FOR DISCOVERY */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'all'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none scale-105'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Semua 54 Modul</span>
          </button>

          <button
            onClick={() => setActiveTab('scratch')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'scratch'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-200 dark:shadow-none scale-105'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            <Code2 className="w-4 h-4 text-amber-500" />
            <span>Fase 1: Game Dev (Scratch)</span>
          </button>

          <button
            onClick={() => setActiveTab('microbit')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'microbit'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200 dark:shadow-none scale-105'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            <Cpu className="w-4 h-4 text-emerald-500" />
            <span>Fase 2: Hardware & IoT</span>
          </button>

          <button
            onClick={() => setActiveTab('pictoblox')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'pictoblox'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-none scale-105'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            <Bot className="w-4 h-4 text-blue-500" />
            <span>Fase 3: Kecerdasan Buatan (AI)</span>
          </button>
        </div>
      </div>

      {/* 3. CARDS SHOWCASE: 3 RUMPUN MATERI UTAMA */}
      <div className="space-y-8">
        {displayedPillars.map((pillar) => (
          <div
            key={pillar.id}
            className={`bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden transition-all duration-300 ${pillar.borderHover}`}
          >
            {/* Pillar Top Banner */}
            <div className={`p-6 sm:p-8 bg-gradient-to-r ${pillar.themeColor} text-white flex flex-col md:flex-row md:items-center justify-between gap-4`}>
              <div className="space-y-2 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-black uppercase tracking-wider text-white">
                    {pillar.badge}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-black/20 text-xs font-semibold text-white/90">
                    {pillar.moduleRange} ({pillar.totalModules} Modul Interaktif)
                  </span>
                  <span className="px-3 py-1 rounded-full bg-black/20 text-xs font-semibold text-white/90">
                    {pillar.ageTarget}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white leading-snug">
                  {pillar.categoryTitle}
                </h3>
                <p className="text-xs sm:text-sm text-white/90 font-medium">
                  {pillar.marketingHook}
                </p>
              </div>

              <div className="shrink-0">
                <button
                  onClick={() => onOpenAuth('register')}
                  className="w-full md:w-auto px-5 py-3 rounded-2xl bg-white text-slate-900 hover:bg-indigo-50 font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <Rocket className="w-4 h-4 text-indigo-600" />
                  <span>Buka Akses Materi Ini</span>
                </button>
              </div>
            </div>

            {/* Pillar Body Content */}
            <div className="p-6 sm:p-8 space-y-8">
              {/* Description */}
              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                {pillar.description}
              </p>

              {/* Two Column Grid: Competencies vs Real Projects */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Kolom 1: Keahlian Kunci yang Dikuasai Anak */}
                <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base">
                        Keahlian Kunci yang Dikuasai Ananda:
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Standar kompetensi komputasi modern
                      </p>
                    </div>
                  </div>

                  <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    {pillar.coreCompetencies.map((comp, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{comp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Kolom 2: 4 Contoh Projek Nyata Portofolio */}
                <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                      <Gamepad2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base">
                        Portofolio Proyek Nyata yang Dihasilkan:
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Karya digital nyata siap dipamerkan
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {pillar.realProjects.map((project, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/60 shadow-2xs"
                      >
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                          <Flame className="w-3.5 h-3.5 text-amber-500" />
                          <span>{project.title}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 pl-5 leading-relaxed">
                          {project.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Showcase Cuplikan Modul Bertahap */}
              <div className="space-y-3 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Cuplikan Modul Kurikulum Unggulan:</span>
                  </h4>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-amber-500" />
                    <span>Tersedia bertahap di akun siswa</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {pillar.featuredModules.map((mod) => (
                    <div
                      key={mod.no}
                      className="p-3.5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-2 shadow-2xs hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            Modul #{mod.no}
                          </span>
                          <span className="text-[9px] font-semibold text-indigo-600 dark:text-indigo-400">
                            {mod.tag}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2">
                          {mod.title}
                        </p>
                      </div>
                      <div className="shrink-0 p-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-400" title="Materi terbuka di akun siswa">
                        <Lock className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  ))}
                  {/* Card Penutup Sisa Modul */}
                  <div
                    onClick={() => onOpenAuth('register')}
                    className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 border border-dashed border-indigo-300 dark:border-indigo-800 flex flex-col justify-center items-center text-center cursor-pointer hover:scale-[1.02] transition-transform"
                  >
                    <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mb-1" />
                    <span className="text-xs font-black text-indigo-900 dark:text-indigo-200">
                      +{pillar.totalModules - pillar.featuredModules.length} Modul Lainnya
                    </span>
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 underline mt-0.5">
                      Daftar Akun untuk Membuka →
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 4. STRATEGIC CALL TO ACTION FOR NEW VISITORS */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/60 p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center lg:text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Akses Penuh Tanpa Biaya Tersembunyi</span>
            </div>
            <h3 className="text-xl sm:text-3xl font-black text-white leading-tight">
              Ingin Si Kecil Menguasai Seluruh 54 Modul di Atas?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Daftarkan akun belajar sekarang atau coba akses <strong>Trial Gratis 1x</strong> untuk merasakan serunya menyusun kode Scratch, simulasi robotika Micro:bit, dan machine learning PictoBlox!
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-1 text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" /> Video Tutorial Bahasa Indonesia
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" /> Rapor Hasil Belajar Digital
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" /> Sertifikat Resmi Kelulusan
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 w-full sm:w-auto">
            <button
              onClick={() => onOpenAuth('register')}
              className="px-6 py-3.5 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white font-black text-sm shadow-lg hover:shadow-indigo-500/40 transition-all flex items-center justify-center gap-2 active:scale-95 text-center"
            >
              <Rocket className="w-4 h-4 text-amber-300" />
              <span>Daftar Akun Belajar Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onOpenAuth('trial')}
              className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 backdrop-blur-xs transition-all flex items-center justify-center gap-2 text-center"
            >
              <Sparkles className="w-4 h-4 text-purple-300" />
              <span>Coba Akses Trial (1 Modul Gratis)</span>
            </button>

            <button
              onClick={() => onOpenAuth('login')}
              className="text-center text-xs text-indigo-300 hover:text-white transition-colors py-1"
            >
              Sudah Punya Akun? Masuk di Sini →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
