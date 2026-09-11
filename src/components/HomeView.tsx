import React from 'react';
import {
  Sparkles,
  Rocket,
  Code2,
  Cpu,
  Bot,
  Award,
  FileSpreadsheet,
  CheckCircle2,
  ShieldCheck,
  Zap,
  ArrowRight,
  GraduationCap,
  Clock,
  Laptop,
  Tablet,
  Smartphone,
  Check,
  Star,
  BookOpen,
  Users,
  Compass,
  Swords
} from 'lucide-react';
import { DURATION_OPTIONS } from '../utils/subscription';
import { CurriculumShowcase } from './CurriculumShowcase';
import { StudentProgressBar } from './StudentProgressBar';
import { RecentActivitiesWidget } from './RecentActivitiesWidget';
import { DailyMotivationBanner } from './DailyMotivationBanner';
import { useApp } from '../context/AppContext';

interface HomeViewProps {
  onOpenAuth: (tab?: 'login' | 'register' | 'trial' | 'admin') => void;
  onNavigateToMaterials: () => void;
  onNavigateToStudios: () => void;
  onNavigateToOnlineClass?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onOpenAuth,
  onNavigateToMaterials,
  onNavigateToStudios,
  onNavigateToOnlineClass
}) => {
  const { currentUser } = useApp();

  return (
    <div className="space-y-16 sm:space-y-24 py-4 sm:py-8 animate-fade-in text-slate-800 dark:text-slate-100">
      {/* DAILY MOTIVATION NOTIFICATION (Jika login terakhir > 24 jam) */}
      {currentUser && (
        <DailyMotivationBanner
          user={currentUser}
          onNavigateToMaterials={onNavigateToMaterials}
        />
      )}

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white p-6 sm:p-12 lg:p-16 border border-indigo-800/40 shadow-2xl">
        {/* Glow ambient effects */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          {/* Badge Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs sm:text-sm font-semibold backdrop-blur-xs">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow" />
            <span>Platform Belajar Coding & AI Mandiri Berjenjang No. 1</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white">
            Pondasi Masa Depan Digital Anak:{' '}
            <span className="bg-gradient-to-r from-amber-300 via-indigo-200 to-purple-300 bg-clip-text text-transparent">
              Kuasai Coding, IoT & AI
            </span>{' '}
            Sejak Dini!
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Mulai dari logika visual <strong className="text-white">Scratch 3.0</strong>, simulasi mikrokontroler <strong className="text-white">BBC Micro:bit IoT</strong>, kecerdasan buatan <strong className="text-white">PictoBlox AI</strong>, hingga petualangan teks nyata <strong className="text-white">CodeCombat Python & JS</strong>. Langsung jalan di browser tanpa instalasi ribet!
          </p>

          {/* Key Value Pill Highlights */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-2 text-xs sm:text-sm text-slate-300">
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full border border-white/10">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              54 Modul Berjenjang
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full border border-white/10">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              4 Studio Interaktif
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full border border-white/10">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Sertifikat Terverifikasi
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full border border-white/10">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Rapor Hasil Belajar (HTML)
            </span>
          </div>

          {/* Call to Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 max-w-md mx-auto">
            <button
              onClick={() => onOpenAuth('register')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-sm sm:text-base shadow-lg hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 transform active:scale-95"
            >
              <Rocket className="w-4 h-4 text-amber-300" />
              <span>Daftar Akun Belajar</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onOpenAuth('trial')}
              className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base border border-white/20 backdrop-blur-xs transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-purple-300" />
              <span>Coba Akses Trial (1x)</span>
            </button>
          </div>

          {/* Secondary Action */}
          <div className="pt-2">
            <button
              onClick={() => {
                const el = document.getElementById('peta-kurikulum');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                } else {
                  onNavigateToMaterials();
                }
              }}
              className="text-xs sm:text-sm text-indigo-300 hover:text-white underline underline-offset-4 transition-colors inline-flex items-center gap-1.5"
            >
              <span>Lihat Silabus Kurikulum Lengkap (54 Modul) & Preview Proyek ↓</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. VISUALISASI PROGRESS BAR PENYELESAIAN MATERI SISWA */}
      <StudentProgressBar
        onOpenAuth={onOpenAuth}
        onNavigateToMaterials={onNavigateToMaterials}
      />

      {/* 2.1 AKTIVITAS TERAKHIR (5 AKSI TERKINI SISWA) */}
      <RecentActivitiesWidget
        onOpenAuth={onOpenAuth}
        onNavigateToMaterials={onNavigateToMaterials}
        onNavigateToOnlineClass={onNavigateToOnlineClass}
      />

      {/* 3. RESPONSIVE ACROSS ALL DEVICES BADGE */}
      <section className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
              <Zap className="w-4 h-4" />
              Akses Fleksibel & Ringan
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Ramah Pengguna di PC, Laptop, Tablet, hingga Smartphone
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl">
              Didesain dengan antarmuka adaptif. Siswa dapat belajar dan bereksperimen di tablet santai, laptop sekolah, PC rumah, maupun HP saat perjalanan.
            </p>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <div className="flex flex-col items-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 w-20 text-center">
              <Laptop className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mb-1" />
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">PC / Laptop</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 w-20 text-center">
              <Tablet className="w-6 h-6 text-purple-600 dark:text-purple-400 mb-1" />
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Tablet</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 w-20 text-center">
              <Smartphone className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mb-1" />
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">HP / Mobile</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. GAMBARAN MATERI SECARA GLOBAL (54 MODUL SILABUS MARKETING SHOWCASE) */}
      <CurriculumShowcase onOpenAuth={onOpenAuth} />

      {/* 4. KEUNGGULAN UTAMA (USP / MARKETING HIGHLIGHTS) */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-xs sm:text-sm font-bold tracking-widest text-indigo-600 dark:text-indigo-400 uppercase">
            Mengapa Memilih GenZi Code?
          </h2>
          <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            6 Keunggulan Eksklusif yang Membentuk Masa Depan Anak
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Kombinasi kurikulum kelas dunia, sistem pembelajaran berjenjang mandiri, dan integrasi perangkat cerdas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {/* Card 1 */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-400 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Code2 className="w-6 h-6" />
            </div>
            <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
              1. Kurikulum Berjenjang & Sistematis
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Materi disusun berurutan dari dasar (pengenalan balok kode, gerak sprite) hingga logika percabangan kondisi, variabel skor, dan game multiplayer. Modul baru terbuka otomatis setelah materi sebelumnya tuntas.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-purple-400 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
            <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
              2. Lab Hardware & IoT Tanpa Beli Alat
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Hemat jutaan rupiah! Siswa dapat memprogram mikroprosesor BBC Micro:bit virtual dengan sensor temperatur, tombol fisik, kompas digital, dan matriks LED 5x5 langsung dari layar komputer atau tablet.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-400 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Bot className="w-6 h-6" />
            </div>
            <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
              3. Artificial Intelligence (AI) Interaktif
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Anak diajak tidak hanya menjadi pemakai, melainkan pencipta teknologi AI. Belajar Computer Vision, pendeteksi emosi wajah, pengenal gerakan tangan, dan machine learning menggunakan PictoBlox.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-amber-400 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
              4. Sertifikat Digital Resmi Terverifikasi
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Siswa yang menyelesaikan modul kurikulum berhak mendapatkan sertifikat kelulusan resmi dengan nomor registrasi unik cloud, cap digital emas, dan dapat diunduh dalam format HTML atau dicetak sebagai portofolio.
            </p>
          </div>

          {/* Card 5 */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-400 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
              5. Rapor Capaian Belajar Mandiri
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Orang tua dan guru dapat memantau progres belajar siswa secara transparan. Rapor mencakup persentase kelulusan, skor kuis, perolehan poin XP, rincian per kategori modul, dan predikat akademik.
            </p>
          </div>

          {/* Card 6 */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-rose-400 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
              6. Lingkungan Belajar Aman & Terbimbing
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Bebas iklan berbahaya, bebas konten negatif. Setiap akun siswa didaftarkan dan disetujui resmi oleh Administrator serta dibimbing oleh instruktur profesional bersertifikat.
            </p>
          </div>
        </div>
      </section>

      {/* 4. SHOWCASE 4 LIVE CODING STUDIOS */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
          <div>
            <span className="text-amber-400 font-mono text-xs uppercase tracking-wider font-bold">
              Praktik Langsung (Hands-on Labs)
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold mt-1 text-white">
              4 Studio Pemrograman Terintegrasi
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Siswa tidak hanya membaca teori, melainkan langsung menyusun blok visual, menguji simulator mikrokontroler IoT, melatih model AI vision, hingga menaklukkan arena dungeon RPG dengan kode teks nyata Python & JavaScript.
            </p>
          </div>
          <button
            onClick={onNavigateToStudios}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm transition-colors flex items-center gap-2 shrink-0"
          >
            <span>Buka Semua Studio</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Studio 1: Scratch */}
          <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700 flex flex-col justify-between hover:border-amber-400 transition-colors">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold mb-3">
                <Code2 className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-1">Scratch 3.0 Logic Studio</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Menyusun game 2D, animasi cerita interaktif, musik nada 8-bit, dan kalkulator cerdas dengan kanvas visual ramah anak.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-700 flex items-center justify-between text-xs">
              <span className="text-amber-300 font-semibold">Tingkat Dasar & Menengah</span>
              <span className="text-slate-400">Blok Visual</span>
            </div>
          </div>

          {/* Studio 2: Microbit */}
          <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700 flex flex-col justify-between hover:border-emerald-400 transition-colors">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold mb-3">
                <Cpu className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-1">BBC Micro:bit IoT Simulator</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Simulasi mikrokontroler perangkat keras lengkap dengan tombol A/B, kompas arah, sensor suhu cuaca, dan display LED 5x5 interaktif.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-700 flex items-center justify-between text-xs">
              <span className="text-emerald-300 font-semibold">Hardware & Robotika</span>
              <span className="text-slate-400">Simulasi Real-time</span>
            </div>
          </div>

          {/* Studio 3: PictoBlox */}
          <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700 flex flex-col justify-between hover:border-purple-400 transition-colors">
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold mb-3">
                <Bot className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-1">PictoBlox AI & ML Studio</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Praktik Computer Vision, deteksi wajah, pengenalan pose tubuh, klasifikasi gambar kamera, dan kecerdasan buatan masa depan.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-700 flex items-center justify-between text-xs">
              <span className="text-purple-300 font-semibold">Artificial Intelligence</span>
              <span className="text-slate-400">Machine Learning</span>
            </div>
          </div>

          {/* Studio 4: CodeCombat */}
          <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700 flex flex-col justify-between hover:border-rose-400 transition-colors">
            <div>
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold mb-3">
                <Swords className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-1">CodeCombat RPG Dungeon</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Belajar sintaks coding nyata lewat game RPG. Siswa mengendalikan hero ksatria menembus dungeon, mengalahkan monster ogre, dan mengumpulkan permata dengan Python & JavaScript!
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-700 flex items-center justify-between text-xs">
              <span className="text-rose-300 font-semibold">Python & JavaScript</span>
              <span className="text-slate-400">RPG Dungeon Live</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PAKET DURASI BELAJAR (1 BULAN, 3 BULAN, 6 BULAN, 1 TAHUN, SELAMANYA) */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
            <Clock className="w-3.5 h-3.5" />
            Fleksibilitas Belajar Siswa
          </div>
          <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Pilihan Durasi Belajar yang Transparan & Terjangkau
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Akses dihitung otomatis mulai dari tanggal akun disetujui (aktif). Akses ditutup setelah masa berlaku berakhir, dan dapat diperpanjang kapan saja.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {DURATION_OPTIONS.map(pkg => (
            <div
              key={pkg.value}
              className={`rounded-2xl p-5 border flex flex-col justify-between transition-all relative ${
                pkg.badge === 'Paling Populer'
                  ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-500 shadow-md ring-2 ring-indigo-500'
                  : pkg.badge === 'VIP Bebas Batas'
                  ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-400 shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
            >
              {pkg.badge && (
                <span className={`absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  pkg.badge === 'Paling Populer'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-amber-500 text-white shadow-xs'
                }`}>
                  {pkg.badge}
                </span>
              )}

              <div>
                <h4 className="text-lg font-extrabold text-slate-900 dark:text-white mb-1">
                  {pkg.label}
                </h4>
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3">
                  {pkg.durationInDays ? `${pkg.durationInDays} Hari Akses Aktif` : 'Akses Seumur Hidup'}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  {pkg.description}
                </p>

                <ul className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-400 mb-4 border-t border-slate-100 dark:border-slate-800 pt-3">
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>54 Modul Kurikulum</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>4 Studio Interaktif</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Sertifikat & Rapor Digital</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Bimbingan Instruktur</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onOpenAuth('register')}
                className={`w-full py-2 rounded-xl font-bold text-xs transition-colors text-center ${
                  pkg.badge === 'Paling Populer'
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200'
                }`}
              >
                Pilih {pkg.label}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 6. TESTIMONIAL & TRUST PROOF */}
      <section className="bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <div className="flex items-center justify-center gap-1 text-amber-400 mb-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <h4 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Dipercaya Oleh Ratusan Siswa & Orang Tua di Seluruh Indonesia
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Kesan nyata dari mereka yang telah belajar mandiri bersama kurikulum GenZi Code.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
            <p className="text-xs text-slate-600 dark:text-slate-300 italic">
              &quot;Anak saya awalnya cuma suka main game di HP. Sejak ikut GenZi Code, dia jadi penasaran cara bikin game sendiri di Scratch dan Micro:bit. Rapor belajarnya juga rapi banget bisa diprint buat sekolah!&quot;
            </p>
            <div className="flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-700">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                IN
              </div>
              <div>
                <strong className="block text-xs text-slate-900 dark:text-white">Ibu Novita</strong>
                <span className="text-[10px] text-slate-400">Orang Tua Siswa Kelas 5 SD</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
            <p className="text-xs text-slate-600 dark:text-slate-300 italic">
              &quot;Materi AI PictoBlox-nya seru banget! Bisa deteksi senyum sama ekspresi muka langsung lewat webcam tanpa error. Penjelasan di videonya mudah dimengerti step-by-step.&quot;
            </p>
            <div className="flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-700">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center">
                RP
              </div>
              <div>
                <strong className="block text-xs text-slate-900 dark:text-white">Rian Pratama</strong>
                <span className="text-[10px] text-slate-400">Siswa SMP Kelas 8</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
            <p className="text-xs text-slate-600 dark:text-slate-300 italic">
              &quot;Sebagai guru ekstrakurikuler informatika, platform ini sangat membantu karena siswa bisa belajar mandiri di lab sekolah dan sertifikat kelulusannya langsung terdata di cloud.&quot;
            </p>
            <div className="flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-700">
              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center">
                BH
              </div>
              <div>
                <strong className="block text-xs text-slate-900 dark:text-white">Pak Budi Hartono</strong>
                <span className="text-[10px] text-slate-400">Guru Ekstrakurikuler Robotika</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FINAL CALL TO ACTION */}
      <section className="rounded-3xl bg-gradient-to-r from-indigo-700 to-purple-800 text-white p-8 sm:p-12 text-center space-y-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <h3 className="text-2xl sm:text-4xl font-extrabold text-white">
            Siap Menjadi Kreator Teknologi Generasi Masa Depan?
          </h3>
          <p className="text-xs sm:text-base text-indigo-100 leading-relaxed">
            Daftarkan diri Anda hari ini. Mulai langkah pertama belajar logika coding, kuasai robotika simulasi, dan raih sertifikat kompetensi resmi GenZi Code!
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onOpenAuth('register')}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white hover:bg-indigo-50 text-indigo-900 font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Rocket className="w-4 h-4 text-indigo-600" />
              <span>Daftar Sekarang & Mulai Belajar</span>
            </button>
            <button
              onClick={() => onOpenAuth('login')}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-all"
            >
              Sudah Punya Akun? Masuk
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
