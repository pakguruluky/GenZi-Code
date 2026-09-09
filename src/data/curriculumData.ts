import { Material, StudioItem } from '../types';

export function getEmbedUrl(url: string): string {
  if (!url) return '';
  if (url.includes('drive.google.com')) {
    // Convert /view or /open to /preview for clean inline viewing
    if (url.includes('/view')) {
      return url.replace(/\/view(\?.*)?$/, '/preview');
    }
    if (url.includes('/open?id=')) {
      const id = url.split('id=')[1]?.split('&')[0];
      return `https://drive.google.com/file/d/${id}/preview`;
    }
    return url;
  }
  if (url.includes('youtu.be/')) {
    const id = url.split('youtu.be/')[1]?.split('?')[0];
    return `https://www.youtube-nocookie.com/embed/${id}`;
  }
  if (url.includes('youtube.com/watch')) {
    const id = url.split('v=')[1]?.split('&')[0];
    return `https://www.youtube-nocookie.com/embed/${id}`;
  }
  return url;
}

export const STUDIOS: StudioItem[] = [
  {
    id: 'scratch',
    name: 'Scratch Studio',
    tagline: 'Visual Block Coding by MIT',
    officialUrl: 'https://scratch.mit.edu/projects/editor/?tutorial=getStarted',
    embedUrl: 'https://scratch.mit.edu/projects/editor/?tutorial=getStarted',
    iconName: 'Code2',
    description: 'Studio pemrograman visual blok terpopuler di dunia untuk merancang animasi interaktif, game 2D, cerita grafis, dan simulasi fisika secara mudah.',
    color: 'from-amber-500 to-orange-600',
    quickTips: [
      'Gunakan tab "Gerakan" untuk memindahkan sprite di koordinat X & Y.',
      'Tambahkan "Ketika Bendera Hijau Diklik" dari tab Kejadian untuk memulai program.',
      'Eksplorasi tab Suara dan Kostum untuk menghidupkan animasi kamu.'
    ]
  },
  {
    id: 'microbit',
    name: 'Micro:bit Studio (MakeCode)',
    tagline: 'Physical Computing & IoT Simulator',
    officialUrl: 'https://makecode.microbit.org/#editor',
    embedUrl: 'https://makecode.microbit.org/#editor',
    iconName: 'Cpu',
    description: 'Simulator papan sirkuit pintar BBC micro:bit. Belajar coding mikrokontroler dengan LED matrix 5x5, sensor accelerometer, kompas digital, dan bluetooth tanpa perlu alat fisik.',
    color: 'from-emerald-500 to-teal-600',
    quickTips: [
      'Jalankan kode langsung di simulator perangkat micro:bit di sisi kiri.',
      'Gunakan blok "selamanya" atau "saat tombol A ditekan".',
      'Download file .hex jika ingin ditransfer ke perangkat micro:bit fisik.'
    ]
  },
  {
    id: 'pictoblox',
    name: 'PictoBlox Studio (AI & Machine Learning)',
    tagline: 'AI, Computer Vision & Robotics Coding',
    officialUrl: 'https://pictoblox.ai/',
    embedUrl: 'https://pictoblox.ai/',
    iconName: 'Bot',
    description: 'Studio coding berbasis Scratch dengan integrasi Kecerdasan Buatan (AI), pendeteksi wajah & emosi, pengenalan suara, computer vision, dan machine learning anak.',
    color: 'from-blue-600 to-indigo-700',
    quickTips: [
      'Aktifkan ekstensi AI seperti "Face Detection" dan "Object Detection".',
      'Latih model klasifikasi gambar sederhana langsung dari webcam.',
      'Gabungkan logika if-else untuk membuat respons avatar sesuai emosi pengguna.'
    ]
  },
  {
    id: 'codecombat',
    name: 'CodeCombat Studio (RPG Dungeon)',
    tagline: 'Text-Based RPG Coding in Python & JavaScript',
    officialUrl: 'https://codecombat.com/play',
    embedUrl: 'https://codecombat.com/play',
    iconName: 'Swords',
    description: 'Studio petualangan koding dungeon RPG nyata! Kendalikan ksatria dengan baris kode Python atau JavaScript nyata untuk menjelajah labirin, mengumpulkan kristal, dan menaklukkan ogre.',
    color: 'from-amber-600 via-rose-600 to-red-700',
    quickTips: [
      'Pilih bahasa Python atau JavaScript di tab editor.',
      'Gunakan perintah hero.moveRight(), hero.moveDown(), hero.moveLeft(), hero.moveUp().',
      'Kalahkan musuh dengan hero.attack("Enemy") untuk membuka pintu dungeon.'
    ]
  }
];

export const RAW_CURRICULUM_DATA: Omit<Material, 'embedUrl'>[] = [
  {
    id: 'mat-01',
    sequence: 1,
    level: 'Level 1',
    title: 'MENGENAL BAGIAN MENU SCRATCH',
    type: 'PDF',
    category: 'Scratch',
    url: 'https://drive.google.com/file/d/1YoElsHoTKfLykr4KGvy5GmGTyIGBYQKP/view?usp=drive_link',
    description: 'Panduan lengkap mengenalkan interface Scratch: Menu Utama, Menu Perintah blok, Script Area, Stage, dan Sprite Library.',
    competency: 'Mengenal Bagian Menu Scratch',
    indicators: 'Siswa mampu mengidentifikasi dan menjelaskan fungsi-fungsi utama pada menu Scratch',
    duration: '2 Pertemuan (2 x 45 menit)',
    semester: 'Ganjil'
  },
  {
    id: 'mat-02',
    sequence: 2,
    level: 'Level 1',
    title: 'MENYUSUN DAN MENJALANKAN PERINTAH',
    type: 'PDF',
    category: 'Scratch',
    url: 'https://drive.google.com/file/d/1wfcvacK9yqSqofCv7P_owuCfpquWJWqN/view?usp=drive_link',
    description: 'Langkah awal menyusun urutan instruksi (algoritma sekuensial) menggunakan event Start/Stop, Sprite, dan perintah arah Point Toward.',
    competency: 'Menyusun dan Menjalankan Perintah',
    indicators: 'Siswa mampu menyusun serangkaian perintah menggunakan blok-blok kode sederhana',
    duration: '2 Pertemuan',
    semester: 'Ganjil'
  },
  {
    id: 'mat-03',
    sequence: 3,
    level: 'Level 1',
    title: 'MENYUSUN DAN MENJALANKAN PERINTAH 2',
    type: 'PDF',
    category: 'Scratch',
    url: 'https://drive.google.com/file/d/1TMXfBmeGZl51k4wCjIKDiNm-CqDx4uOd/view?usp=drive_link',
    description: 'Pendalaman penyusunan blok perintah dengan kombinasi event interaktif dan penataan alur eksekusi script.',
    competency: 'Menyusun dan Menjalankan Perintah Lanjutan',
    indicators: 'Siswa memahami aliran instruksi dan eksekusi serentak dalam Scratch',
    duration: '2 Pertemuan',
    semester: 'Ganjil'
  },
  {
    id: 'mat-04',
    sequence: 4,
    level: 'Level 1',
    title: 'MEMBUAT SPRITE BERGERAK (2)',
    type: 'PDF',
    category: 'Scratch',
    url: 'https://drive.google.com/file/d/1xIpJXBVVOW9sUHn-t1OkoUycKnlILO0B/view?usp=drive_link',
    description: 'Mempelajari cara membuat sprite bergerak dinamis, gerakan memantul di tepi layar (if on edge bounce), serta perulangan repeat & forever.',
    competency: 'Membuat Sprite Bergerak 1',
    indicators: 'Siswa mampu membuat sprite bergerak dengan perintah pergerakan dasar seperti maju, mundur, dan berputar',
    duration: '2 Pertemuan',
    semester: 'Ganjil'
  },
  {
    id: 'mat-05',
    sequence: 5,
    level: 'Level 2',
    title: 'PROJEK 1: GAME SALING MENEMBAK',
    type: 'PDF',
    category: 'Scratch',
    url: 'https://drive.google.com/file/d/1J1nrXgERClYOd_iXQvCpAbfjLVDcW5Vj/view?usp=drive_link',
    description: 'Merancang proyek game tembak-menembak interaktif 2D dengan memanfaatkan koordinat kartesius X & Y, sensing sentuhan, dan arah peluru.',
    competency: 'Projek Game Saling Menembak',
    indicators: 'Siswa memahami dan mampu merancang serta membuat permainan interaktif sederhana',
    duration: '2 Pertemuan',
    semester: 'Ganjil'
  },
  {
    id: 'mat-06',
    sequence: 6,
    level: 'Level 2',
    title: 'MEMAHAMI MENU LOOKS',
    type: 'PDF',
    category: 'Scratch',
    url: 'https://drive.google.com/file/d/1HkFoBPqyIL5AOPKiC3itwlz-ExvnU5oJ/view?usp=drive_link',
    description: 'Memanipulasi tampilan sprite: ganti kostum untuk efek berjalan, dialog ucapan (say/think), efek warna, ukuran, dan visibilitas.',
    competency: 'Memahami Looks',
    indicators: 'Siswa mampu memanipulasi tampilan sprite seperti mengubah kostum, rotasi, dan efek visual',
    duration: '2 Pertemuan',
    semester: 'Ganjil'
  },
  {
    id: 'mat-07',
    sequence: 7,
    level: 'Level 2',
    title: 'Mengendalikan Sprite Menggunakan Keyboard atau Mouse',
    type: 'PDF',
    category: 'Scratch',
    url: 'https://drive.google.com/file/d/1VQ5ICEuDASfY4igClXCzJbSQJC6pmOP8/view?usp=drive_link',
    description: 'Integrasi kontrol input manusia via keyboard (panah atas, bawah, kiri, kanan, spasi) dan posisi pointer mouse untuk interaksi langsung.',
    competency: 'Mengendalikan Sprite Menggunakan Keyboard dan Mouse',
    indicators: 'Siswa mampu menghubungkan input dari keyboard dan mouse untuk mengendalikan tindakan pergerakan sprite',
    duration: '2 Pertemuan',
    semester: 'Ganjil'
  },
  {
    id: 'mat-08',
    sequence: 8,
    level: 'Level 2',
    title: 'MEMBUAT DAN MENGUBAH SPRITE DI MENU PAINT',
    type: 'PDF',
    category: 'Scratch',
    url: 'https://drive.google.com/file/d/1Ky4NPeXMEgHXPkAfImGajU7qKRQp1I-5/view?usp=drive_link',
    description: 'Belajar desain grafis digital menggunakan Vector & Bitmap Paint Editor bawaan Scratch untuk mendesain karakter dan properti sendiri.',
    competency: 'Membuat dan Mengubah Sprite di Menu Paint',
    indicators: 'Siswa mampu membuat dan mengedit sprite menggunakan alat-alat di menu Paint Scratch',
    duration: '2 Pertemuan',
    semester: 'Ganjil'
  },
  {
    id: 'mat-09',
    sequence: 9,
    level: 'Level 1',
    title: 'Mengenal Bagian Bagian Menu Scratch 1a (Video)',
    type: 'Video',
    category: 'Scratch',
    url: 'https://drive.google.com/file/d/1cMqFXdens0D1kglyxMhGZwIBpVrkW8UY/view?usp=drive_link',
    description: 'Video demonstrasi interaktif menjelajahi menu utama dan tata letak area kerja Scratch langkah demi langkah.',
    competency: 'Eksplorasi Visual Menu Scratch',
    duration: '15 Menit',
    semester: 'Ganjil'
  },
  {
    id: 'mat-10',
    sequence: 10,
    level: 'Level 1',
    title: 'Mengenal Bagian Bagian Menu Scratch 1b (Video)',
    type: 'Video',
    category: 'Scratch',
    url: 'https://drive.google.com/file/d/1DCaqmt9wgiv10IfYtE_SSWXxgfdCLZPZ/view?usp=drive_link',
    description: 'Video lanjutan mendalami fungsi panel sprite info, backdrop library, dan palet warna.',
    competency: 'Navigasi Panel Scratch',
    duration: '12 Menit',
    semester: 'Ganjil'
  },
  {
    id: 'mat-11',
    sequence: 11,
    level: 'Level 2',
    title: 'Menyusun dan Menjalankan Perintah Scratch 1a (Video)',
    type: 'Video',
    category: 'Scratch',
    url: 'https://drive.google.com/file/d/1XsxasmaxSiQsrbtzDJstK4qzPP-siw6a/view?usp=drive_link',
    description: 'Video tutorial merakit blok perintah pertama dan menjalankan aksi sprite di kanvas panggung.',
    competency: 'Praktek Algoritma Blok',
    duration: '18 Menit',
    semester: 'Ganjil'
  },
  {
    id: 'mat-12',
    sequence: 12,
    level: 'Level 2',
    title: 'Menyusun dan Menjalankan Perintah Scratch 1b (Video)',
    type: 'Video',
    category: 'Scratch',
    url: 'https://drive.google.com/file/d/1XCX-e9kx_Le9W2YCEhFv49uNSMRLe5nk/view?usp=drive_link',
    description: 'Video contoh kasus menangani event interaktif tombol dan deteksi tabrakan sederhana.',
    competency: 'Praktek Event Handler',
    duration: '16 Menit',
    semester: 'Ganjil'
  },
  {
    id: 'mat-13',
    sequence: 13,
    level: 'Next Level',
    title: 'Pictoblox AI: Pengantar Kecerdasan Buatan',
    type: 'PDF',
    category: 'Pictoblox',
    url: 'https://drive.google.com/file/d/1ZP7e95wZfkQpomqDOGSpZnGydi2dTUo-/view?usp=drive_link',
    description: 'Modul pengenalan konsep AI (Artificial Intelligence) dan Machine Learning melalui antarmuka blok PictoBlox yang ramah pemula.',
    competency: 'Dasar Kecerdasan Buatan',
    indicators: 'Siswa mengerti cara kerja AI dalam mengenali gambar, teks, dan gesture tubuh',
    duration: '2 Pertemuan'
  },
  {
    id: 'mat-14',
    sequence: 14,
    level: 'Next Level',
    title: 'Facial Expression & Emotion Recognizer Project in Pictoblox',
    type: 'Video',
    category: 'Pictoblox',
    url: 'https://youtu.be/Hij7pLHquyk?si=4IwiLdp8f9kNZv0J',
    description: 'Proyek seru membuat aplikasi pendeteksi ekspresi wajah (senang, sedih, kaget) menggunakan Computer Vision AI di PictoBlox.',
    competency: 'Projek Computer Vision AI',
    duration: '22 Menit'
  },
  {
    id: 'mat-15',
    sequence: 15,
    level: 'Next Level',
    title: 'Modul Lengkap Belajar Coding Block (MakeCode & Micro:bit)',
    type: 'PDF',
    category: 'MakeCode Arcade',
    url: 'https://drive.google.com/file/d/1KjFMcMvlmO0evyItb7-41NZNuabrx4v0/view?usp=drive_link',
    description: 'Buku panduan lengkap membuat game retro bergaya 8-bit dengan Microsoft MakeCode Arcade dan logika komputasi micro:bit.',
    competency: 'Game Retro Arcade & Physical Computing',
    duration: '4 Pertemuan'
  },
  {
    id: 'mat-16',
    sequence: 16,
    level: 'Next Level',
    title: 'Creating Sprites & Background in MakeCode Arcade',
    type: 'Video',
    category: 'MakeCode Arcade',
    url: 'https://youtu.be/eII1eXBZqqQ?si=2RDUs4TY7XZHYCr5',
    description: 'Video tutorial melukis pixel art karakter sprite, merancang tilemap latar belakang dunia game di MakeCode Arcade.',
    competency: 'Pixel Art & Desain Game Tilemap',
    duration: '20 Menit'
  },
  {
    id: 'mat-17',
    sequence: 17,
    level: 'Level 1',
    title: 'Ice Cream Colors Coding Worksheet Coloring Chart Activity',
    type: 'PDF',
    category: 'Unplugged',
    url: 'https://drive.google.com/file/d/1ofKTgDUtQ1-ggi7nBqpiR5-LJH-ph63E/view?usp=drive_link',
    description: 'Lembar kerja aktivitas unplugged coding (tanpa komputer) memahami representasi data warna dengan bagan es krim.',
    competency: 'Berpikir Komputasional Dasar (Unplugged)',
    duration: '1 Pertemuan'
  },
  {
    id: 'mat-18',
    sequence: 18,
    level: 'Level 1',
    title: 'Line Coding Activity Worksheet Primary School Attention Increasing',
    type: 'PDF',
    category: 'Unplugged',
    url: 'https://drive.google.com/file/d/1tpnEJWYwLYrH1ddGzLKsU8kOLsvbZE8z/view?usp=drive_link',
    description: 'Worksheet garis algoritma untuk melatih fokus, logika langkah terurut, dan pemecahan masalah spasial.',
    competency: 'Algoritma Navigasi Garis',
    duration: '1 Pertemuan'
  },
  {
    id: 'mat-19',
    sequence: 19,
    level: 'Level 1',
    title: 'Aqua Sign Coding Worksheet Fun Algorithm Code Elementary School',
    type: 'PDF',
    category: 'Unplugged',
    url: 'https://drive.google.com/file/d/1h_Hat_A6JAFmMfeuGQ38IieC52ki1uzd/view?usp=drive_link',
    description: 'Latihan pengenalan simbol instruksi kode menyenangkan bertema akuarium bawah air untuk usia dasar.',
    competency: 'Dekripsi Simbol Instruksi',
    duration: '1 Pertemuan'
  },
  {
    id: 'mat-20',
    sequence: 20,
    level: 'Level 1',
    title: 'Sprite Lab: Pengenalan Interaktif',
    type: 'PDF',
    category: 'Game Logika (SpriteLab)',
    url: 'https://youtu.be/yd-9xZ275dM?si=d1SxQIF9uGWKoyhp',
    description: 'Mengenal Sprite Lab dari Code.org: cara membuat objek berkarakter hidup yang dapat bereaksi terhadap sentuhan dan waktu.',
    competency: 'Pemrograman Berorientasi Objek Dasar',
    duration: '2 Pertemuan'
  },
  {
    id: 'mat-21',
    sequence: 21,
    level: 'Next Level',
    title: 'Algorithms and Programming (CS1) Lesson 5: Capstone Turtle Project',
    type: 'PDF',
    category: 'CodeCombat',
    url: 'https://drive.google.com/file/d/1OrGh__BE1nR7vPgz_u4ZiedYCMwa7hRQ/view?usp=drive_link',
    description: 'Transisi dari blok ke teks: menggambar bentuk geometris menggunakan Python Turtle dan logika iterasi loop.',
    competency: 'Transisi Text Coding Python Dasar',
    duration: '2 Pertemuan'
  },
  {
    id: 'mat-22',
    sequence: 22,
    level: 'Next Level',
    title: 'Code Combat Dungeons of Kithgard: Level 1 Python Tutorial with Solution',
    type: 'Video',
    category: 'CodeCombat',
    url: 'https://youtu.be/v5rcWumV014?si=CG86sHkdiyYpGcm3',
    description: 'Video petualangan bermain peran (RPG) sambil belajar menulis sintaks Python nyata hero.moveRight() & hero.attack().',
    competency: 'Sintaks Bahasa Pemrograman Python',
    duration: '25 Menit'
  },
  {
    id: 'mat-23',
    sequence: 23,
    level: 'Level 3',
    title: 'PROJEK 1: Game Tikus Mencari Keju',
    type: 'PDF',
    category: 'Scratch',
    url: 'https://drive.google.com/file/d/1Vh8cwELwuei9SAoVk_pFfNay8meqhSEy/view?usp=drive_link',
    description: 'Membuat game labirin klasik di mana sprite tikus harus mencari keju sambil menghindari kucing dan rintangan tembok.',
    competency: 'Projek Game Tikus Mencari Keju',
    indicators: 'Siswa merancang permainan sprite tikus mencari keju dengan rintangan dan logika pergerakan teratur',
    duration: '3 Pertemuan',
    semester: 'Ganjil'
  },
  {
    id: 'mat-24',
    sequence: 24,
    level: 'Level 3',
    title: 'MEMAHAMI VARIABEL DALAM CODING',
    type: 'PDF',
    category: 'Scratch',
    url: 'https://drive.google.com/file/d/1cdHkGLhaxPoVeP1tNhUbVS8SCAXj1ubH/view?usp=drive_link',
    description: 'Konsep dasar variabel: kotak penyimpan data skor, sisa nyawa (lives), pengatur waktu (timer), dan status game.',
    competency: 'Memahami Variabel',
    indicators: 'Siswa memahami konsep variabel dan menggunakan untuk menyimpan serta memanipulasi data game',
    duration: '2 Pertemuan',
    semester: 'Ganjil'
  },
  {
    id: 'mat-25',
    sequence: 25,
    level: 'Level 3',
    title: 'MEMAHAMI MENU OPERATOR MATEMATIKA & LOGIKA',
    type: 'PDF',
    category: 'Scratch',
    url: 'https://drive.google.com/file/d/13lguljKj9pzBW2bDoTXzxTORBfHvURfq/view?usp=drive_link',
    description: 'Operasi matematika (+, -, *, /), perbandingan lebih besar/kecil (> < =), logika boolean (AND, OR, NOT), serta pengacak nomor (pick random).',
    competency: 'Memahami Menu Operator Matematika',
    indicators: 'Siswa mampu menggunakan menu operator matematika Scratch untuk kalkulasi dan percabangan',
    duration: '2 Pertemuan',
    semester: 'Genap'
  },
  {
    id: 'mat-26',
    sequence: 26,
    level: 'Level 3',
    title: 'PROJEK 2: Mission Target Pursuit',
    type: 'PDF',
    category: 'Scratch',
    url: 'https://drive.google.com/open?id=1XDIvLGIzJ0Torcu5OULyjgxGso9CWQCa&usp=drive_copy',
    description: 'Proyek misi kejar target bergerak acak dengan kalkulasi jarak Euclidean dan sistem skor dinamis.',
    competency: 'Projek Mission Target Pursuit',
    indicators: 'Siswa mampu merancang misi di mana sprite mengejar target dengan logika pergerakan pintar dan skor',
    duration: '3 Pertemuan',
    semester: 'Genap'
  },
  {
    id: 'mat-27',
    sequence: 27,
    level: 'Level 4',
    title: 'MEMBUAT ANIMASI HUJAN',
    type: 'PDF',
    category: 'Scratch',
    url: 'https://drive.google.com/file/d/1O2p3AXbzxXivCB_ncqypMN0Gu1FLr0Rj/view?usp=drive_link',
    description: 'Simulasi cuaca hujan realistis memanfaatkan kloning sprite partikel tetesan air dan manipulasi transparansi.',
    competency: 'Membuat Animasi Hujan',
    indicators: 'Siswa mampu membuat animasi hujan dengan efek visual alami dan siklus kloning',
    duration: '2 Pertemuan',
    semester: 'Genap'
  },
  {
    id: 'mat-28',
    sequence: 28,
    level: 'Level 4',
    title: 'MENGENAL DRAG AND DROP INTERAKTIF',
    type: 'PDF',
    category: 'Scratch',
    url: 'https://drive.google.com/file/d/1bX5Agpq1pTlCCnU2PpGp8_DzVJMvAxT-/view?usp=drive_link',
    description: 'Mengatur mode draggable sprite dan interaksi geser-taruh objek untuk game puzzle edukasi atau dress-up character.',
    competency: 'Mengenal Drag and Drop',
    indicators: 'Siswa mampu mengatur sprite draggable untuk interaktivitas layar sentuh & mouse',
    duration: '2 Pertemuan',
    semester: 'Genap'
  },
  {
    id: 'mat-29',
    sequence: 29,
    level: 'Level 4',
    title: 'PROYEK 3: Bus Street Simulator',
    type: 'PDF',
    category: 'Scratch',
    url: 'https://drive.google.com/file/d/1d5_S18cFtTSbPchCECj27CcmgmBEuqlA/view?usp=drive_link',
    description: 'Membuat simulasi lalu lintas jalan raya kota dengan bus sekolah, halte jemputan, dan rintangan kendaraan lalu lalang.',
    competency: 'Projek Scratch Bus Street',
    indicators: 'Siswa mampu merancang simulasi lalu lintas jalan dengan sprite bus dan kendaraan lainnya',
    duration: '2 Pertemuan',
    semester: 'Genap'
  },
  {
    id: 'mat-30',
    sequence: 30,
    level: 'Level 4',
    title: 'MEMBUAT POLA GARIS BERWARNA (PEN EXTENSION)',
    type: 'PDF',
    category: 'Scratch',
    url: 'https://drive.google.com/file/d/16rz8VdiU1cEG5YbBq1uFKOcc6hV7OG7a/view?usp=drive_link',
    description: 'Menggambar geometri seni algoritmik (geometrical generative art) menggunakan ekstensi Pena (Pen) di Scratch.',
    competency: 'Membuat Pola Garis Berwarna',
    indicators: 'Siswa mampu membuat pola garis warna-warni menggunakan algoritma matematika spiral',
    duration: '2 Pertemuan',
    semester: 'Genap'
  },
  {
    id: 'mat-31',
    sequence: 31,
    level: 'Level 5',
    title: 'MEMBUAT GARIS MELENGKUNG BERWARNA-WARNI',
    type: 'PDF',
    category: 'Scratch',
    url: 'https://drive.google.com/file/d/1_JXuKN9ZW9SKginqTfGoUpD_QojYyWY8/view?usp=drive_link',
    description: 'Teknik kurva Bezier dan rotasi sudut bertahap untuk menghasilkan lukisan seni mandala spektrum pelangi.',
    competency: 'Membuat Garis Melengkung Berwarna-warni',
    indicators: 'Siswa mampu menggambar kurva melengkung dengan variasi warna spektral halus',
    duration: '2 Pertemuan',
    semester: 'Genap'
  },
  {
    id: 'mat-32',
    sequence: 32,
    level: 'Level 5',
    title: 'MEMBUAT SCROLL BACKDROP BERGERAK DARI ATAS KE BAWAH',
    type: 'PDF',
    category: 'Scratch',
    url: 'https://drive.google.com/file/d/1-YC02X_jxZNQOFy5aPp7uIQ8EixBGg4j/view?usp=drive_link',
    description: 'Teknik infinite vertical scrolling untuk game pesawat luar angkasa (space shooter) vertikal yang tampak bergerak tanpa henti.',
    competency: 'Membuat Scroll Backdrop Atas ke Bawah',
    indicators: 'Siswa mampu membuat efek latar belakang bergerak vertikal mulus secara looping',
    duration: '2 Pertemuan',
    semester: 'Genap'
  },
  {
    id: 'mat-33',
    sequence: 33,
    level: 'Level 5',
    title: 'MEMBUAT SCROLL BACKDROP BERGERAK DARI BAWAH KE ATAS / HORIZONTAL',
    type: 'PDF',
    category: 'Scratch',
    url: 'https://drive.google.com/file/d/1IH0CQxOMZ_syFn-iIYFbYAJK1t9V9NLb/view?usp=drive_link',
    description: 'Parallax background horizontal scrolling ala game petualangan Super Mario Bros dengan multi-layer latar belakang.',
    competency: 'Membuat Scroll Backdrop Bawah ke Atas & Kiri ke Kanan',
    indicators: 'Siswa mampu membuat sistem kamera dan pergeseran latar horizontal & vertikal',
    duration: '2 Pertemuan',
    semester: 'Genap'
  },
  {
    id: 'mat-34',
    sequence: 34,
    level: 'Level 5',
    title: 'PROYEK 4: Scratch Pong Game (Multiplayer)',
    type: 'PDF',
    category: 'Scratch',
    url: 'https://drive.google.com/file/d/1twa8vpGZ-I7Q4IQOjLIZqcktJ_oOxSJ-/view?usp=drive_link',
    description: 'Membangun game arcade klasik legendaris Pong dengan pantulan bola berfisika, paddle 2 pemain (W/S & Panah), dan scoreboard.',
    competency: 'Projek Scratch Pong Game',
    indicators: 'Siswa mampu membuat permainan klasik Pong dengan deteksi sudut tabrakan dan sistem multi pemain',
    duration: '2 Pertemuan',
    semester: 'Genap'
  },
  {
    id: 'mat-35',
    sequence: 35,
    level: 'Next Level',
    title: 'Modul Project Scratch: Kumpulan Portofolio Kreatif',
    type: 'PDF',
    category: 'Scratch',
    url: 'https://drive.google.com/file/d/1flWm9ORP2P07FkgQoxir2qNlRAKYBLdU/view?usp=drive_link',
    description: 'Kumpulan ide proyek akhir, template game petualangan, kuis interaktif, dan animasi cerita untuk portofolio siswa.',
    competency: 'Portofolio Karya Coding Mandiri',
    duration: '4 Pertemuan'
  },
  {
    id: 'mat-36',
    sequence: 36,
    level: 'Level 1',
    title: 'Mengenal Bagian Bagian Menu Scratch 1c (Video)',
    type: 'Video',
    category: 'Scratch',
    url: 'https://drive.google.com/file/d/1Vkw9gYU_AcA4llq3vQIG6ijpVXi00CKv/view?usp=drive_link',
    description: 'Video visual mendetail mengupas struktur toolbox kode: Motion, Looks, Sound, Events, Control, Sensing, Operators, dan Variables.',
    competency: 'Struktur Toolbox Blok Scratch',
    duration: '14 Menit',
    semester: 'Ganjil'
  },
  {
    id: 'mat-37',
    sequence: 37,
    level: 'Level 1',
    title: 'Hubungan Script Area - Canvas - dan List Sprite (Video)',
    type: 'Video',
    category: 'Scratch',
    url: 'https://drive.google.com/file/d/14v0Sy4S8Brfq0kKjfggh7KYjTrTg8HyQ/view?usp=drive_link',
    description: 'Memahami bagaimana kode di script area langsung diterjemahkan menjadi aksi nyata sprite di layar panggung secara instan.',
    competency: 'Arsitektur Komunikasi Sprite & Stage',
    duration: '15 Menit',
    semester: 'Ganjil'
  },
  {
    id: 'mat-38',
    sequence: 38,
    level: 'Level 1',
    title: 'Mengenal Sprite Default Bagian A (Video)',
    type: 'Video',
    category: 'Scratch',
    url: 'https://drive.google.com/file/d/1fS4pIwh7XE8qPxU0IcwP2lAOJTmcaIz9/view?usp=drive_link',
    description: 'Mengenal anatomi karakter kucing Scratch (Scratch Cat): titik pusat (center origin), rotasi sudut, dan titik referensi koordinat.',
    competency: 'Anatomi Karakter Sprite',
    duration: '12 Menit',
    semester: 'Ganjil'
  },
  {
    id: 'mat-39',
    sequence: 39,
    level: 'Level 1',
    title: 'Mengenal Sprite Default Bagian B (Video)',
    type: 'Video',
    category: 'Scratch',
    url: 'https://drive.google.com/file/d/1aAs8Kcl-EsvROWqbH3kGkWa2ZCR6tFwD/view?usp=drive_link',
    description: 'Eksplorasi kostum default sprite dan cara membuat siklus animasi berjalan (walking cycle) yang halus.',
    competency: 'Animasi Kostum Terputus-putus',
    duration: '14 Menit',
    semester: 'Ganjil'
  },
  {
    id: 'mat-40',
    sequence: 40,
    level: 'Level 1',
    title: 'Mengenal Sprite Default_A Lanjutan (Video)',
    type: 'Video',
    category: 'Scratch',
    url: 'https://drive.google.com/file/d/1hkU4K0Lq2obbYss0Zof1X7IRNtyI84rt/view?usp=drive_link',
    description: 'Praktek mereset posisi awal karakter setiap kali game dimulai kembali menggunakan go to x: y:.',
    competency: 'Inisialisasi State Karakter',
    duration: '11 Menit',
    semester: 'Ganjil'
  },
  {
    id: 'mat-41',
    sequence: 41,
    level: 'Level 2',
    title: 'Create Clone Of: Konsep Kloning Sprite (Video)',
    type: 'Video',
    category: 'Scratch',
    url: 'https://drive.google.com/file/d/1zDHFxK-j3iCUJmpThKHULB3xi-0eH1wq/view?usp=drive_link',
    description: 'Kekuatan kloning sprite: menghasilkan ratusan objek dinamis seperti tembakan peluru, tetesan hujan, dan musuh tanpa menduplikasi manual.',
    competency: 'Kloning Sprite & Manajemen Objek Dinamis',
    duration: '17 Menit',
    semester: 'Ganjil'
  },
  {
    id: 'mat-42',
    sequence: 42,
    level: 'Level 2',
    title: 'Perintah Arah Sprite - Point In Direction (Video)',
    type: 'Video',
    category: 'Scratch',
    url: 'https://drive.google.com/file/d/1NXm3Udgg1iTBz31WLavJ9BuTpQGVVRsD/view?usp=drive_link',
    description: 'Menguasai derajat kompas (0=atas, 90=kanan, 180=bawah, -90=kiri) dan rotasi gaya all-around versus left-right.',
    competency: 'Orientasi Spasial Sudut Putar',
    duration: '13 Menit',
    semester: 'Ganjil'
  },
  {
    id: 'mat-43',
    sequence: 43,
    level: 'Level 2',
    title: 'Gerakan Memantul 2 (Video)',
    type: 'Video',
    category: 'Scratch',
    url: 'https://drive.google.com/file/d/1riip0svcF-XWgy1StIvim3dcLx6G2ECk/view?usp=drive_link',
    description: 'Penyempurnaan fisika pantulan saat bola mengenai dinding atau paddle miring.',
    competency: 'Hukum Pantulan & Vektor Gerak',
    duration: '15 Menit',
    semester: 'Ganjil'
  },
  {
    id: 'mat-44',
    sequence: 44,
    level: 'Level 1',
    title: 'Binary Bits Puzzle Worksheet in Bold Retro Style',
    type: 'PDF',
    category: 'Unplugged',
    url: 'https://drive.google.com/file/d/15kbAHq1lX_oft2UINynwM48sFGwiiRAX/view?usp=drive_link',
    description: 'Teka-teki bilangan biner 0 dan 1 dalam gaya retro untuk memahami cara komputer menyimpan huruf, angka, dan piksel foto.',
    competency: 'Sistem Bilangan Biner & Komputasi',
    duration: '1 Pertemuan'
  },
  {
    id: 'mat-45',
    sequence: 45,
    level: 'Level 1',
    title: 'Butterfly Coloring Primary School Worksheet',
    type: 'PDF',
    category: 'Unplugged',
    url: 'https://drive.google.com/file/d/1UQO2SyZ6RPcBRBlTTIxsbpQeMDkesYsT/view?usp=drive_link',
    description: 'Worksheet pola simetri kupu-kupu untuk melatih penalaran pola (pattern recognition) dan algoritma cermin.',
    competency: 'Pengenalan Pola & Dekomposisi',
    duration: '1 Pertemuan'
  },
  {
    id: 'mat-46',
    sequence: 46,
    level: 'Level 1',
    title: 'Unplugged Coding untuk Anak: Konsep Seru Tanpa Layar',
    type: 'Video',
    category: 'Unplugged',
    url: 'https://youtu.be/nn3YJpD47i8?si=quzY9AjmzNU8ToDX',
    description: 'Video panduan guru dan instruktur menerapkan aktivitas motorik dan kartu kode untuk anak usia dini.',
    competency: 'Metodologi Pembelajaran Unplugged',
    duration: '19 Menit'
  },
  {
    id: 'mat-47',
    sequence: 47,
    level: 'Level 1',
    title: 'Guru SD Mengajarkan Unplugged Coding dalam Pembelajaran',
    type: 'Video',
    category: 'Unplugged',
    url: 'https://youtu.be/gRc2iuQz1Tw?si=LmA_wRBjIOVfTtlo',
    description: 'Inspirasi kelas nyata bagaimana guru mengintegrasikan computational thinking dalam kurikulum sekolah dasar.',
    competency: 'Praktik Pedagogi Coding Anak',
    duration: '16 Menit'
  },
  {
    id: 'mat-48',
    sequence: 48,
    level: 'Level 1',
    title: 'Introducing Sprite Lab: Dasar Pembuatan Game Edukatif',
    type: 'Video',
    category: 'Game Logika (SpriteLab)',
    url: 'https://youtu.be/yd-9xZ275dM?si=QiM2nlYEriThRUUG',
    description: 'Tutorial video langkah demi langkah memulai proyek game cerita di Sprite Lab dengan blok visual ceria.',
    competency: 'Dasar Storytelling Interaktif',
    duration: '15 Menit'
  },
  {
    id: 'mat-49',
    sequence: 49,
    level: 'Level 1',
    title: 'How To Make A Sprite in Sprite Lab',
    type: 'Video',
    category: 'Game Logika (SpriteLab)',
    url: 'https://youtu.be/wbTJpx3driA?si=5NN04XiOhR7Kvt0G',
    description: 'Panduan lengkap membuat dan memodifikasi sprite kustom di Sprite Lab agar bisa bergerak dan melompat.',
    competency: 'Perilaku Sprite & Event Trigger',
    duration: '14 Menit'
  },
  {
    id: 'mat-50',
    sequence: 50,
    level: 'Level 1',
    title: 'Sprites In Action: Logika Perilaku dan Tabrakan',
    type: 'Video',
    category: 'Game Logika (SpriteLab)',
    url: 'https://youtu.be/VUmZ2IsFAGo?si=XcaGqQYPaQdcv8rl',
    description: 'Menyusun aksi kompleks sprite saat saling bersentuhan: memicu suara, mengubah ukuran, dan menambah poin skor.',
    competency: 'Logika Perilaku & Deteksi Tabrakan',
    duration: '21 Menit'
  },
  {
    id: 'mat-51',
    sequence: 51,
    level: 'Level 1_A',
    title: '001 Scratch Workspace Essentials',
    type: 'PDF',
    category: 'Scratch',
    url: 'https://drive.google.com/file/d/1oijyYV_RzimShfvtiraXr5z-Z-jKuq0n/view?usp=drive_link',
    description: 'Modul ringkasan esensial area kerja Scratch: tips shortcut keyboard, manajemen berkas .sb3, dan pengorganisasian kode bersih.',
    competency: 'Manajemen Proyek Scratch',
    duration: '1 Pertemuan'
  },
  {
    id: 'mat-52',
    sequence: 52,
    level: 'Level 1_B',
    title: 'Scratch Command Mission',
    type: 'PDF',
    category: 'Scratch',
    url: 'https://drive.google.com/file/d/130YlwXihiHPyKHewmf8rSeTZ4ZL8sted/view?usp=drivesdk',
    description: 'Kumpulan misi tantangan memecahkan teka-teki blok kode untuk menguji pemahaman logika algoritma siswa.',
    competency: 'Tantangan Logika Komputasional',
    duration: '2 Pertemuan'
  },
  {
    id: 'mat-53',
    sequence: 53,
    level: 'Level 1_C',
    title: 'Scratch Animation Mastery',
    type: 'PDF',
    category: 'Scratch',
    url: 'https://drive.google.com/file/d/1du0rbZt0y2gdVLDNTwJ-KaVNfwsVftHf/view?usp=drivesdk',
    description: 'Teknik animasi tingkat mahir: transisi efek visual, lip sync suara, timing frame, dan sinematografi panggung.',
    competency: 'Mastery Animasi & Sinematik Scratch',
    duration: '2 Pertemuan'
  },
  {
    id: 'mat-54',
    sequence: 54,
    level: 'Level 1_C',
    title: 'Keajaiban Looping (Perulangan dalam Coding)',
    type: 'Video',
    category: 'Scratch',
    url: 'https://drive.google.com/file/d/15eNjDphzCppnByKVHp4vrfd_9HOnw7eS/view?usp=drivesdk',
    description: 'Video pemahaman mendalam filosofi looping: bagaimana komputer mengeksekusi jutaan repetisi dalam sekejap tanpa lelah.',
    competency: 'Konsep Fundamental Loop & Iterasi',
    duration: '18 Menit'
  }
];

export const ALL_MATERIALS: Material[] = RAW_CURRICULUM_DATA.map(m => ({
  ...m,
  embedUrl: getEmbedUrl(m.url)
}));
