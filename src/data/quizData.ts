import { Material, ModuleQuiz, QuizQuestion } from '../types';

/**
 * Kurasi Kuis Interaktif untuk Modul-modul Utama Kurikulum GenZi Code
 */
const SPECIFIC_MODULE_QUIZZES: Record<string, Omit<ModuleQuiz, 'materialId'>> = {
  // Modul 1: Scratch Pengenalan
  'scr-01': {
    title: 'Kuis Pemahaman: Pengenalan Scratch & Gerak Sprite',
    passingScore: 66,
    xpReward: 50,
    questions: [
      {
        id: 'q1',
        question: 'Blok perintah mana yang digunakan untuk mengawali jalannya program saat bendera hijau diklik?',
        options: [
          'ketika bendera hijau diklik (Events)',
          'selamanya (Control)',
          'gerak 10 langkah (Motion)',
          'katakan halo selama 2 detik (Looks)'
        ],
        correctIndex: 0,
        explanation: 'Blok "when green flag clicked" pada kategori Events adalah pemicu utama yang mengeksekusi urutan skrip saat program dimulai.'
      },
      {
        id: 'q2',
        question: 'Jika kamu ingin Sprite berpindah posisi secara mendatar ke arah kanan, nilai koordinat mana yang bertambah?',
        options: [
          'Koordinat Y bertambah positif',
          'Koordinat X bertambah positif',
          'Koordinat X bernilai negatif',
          'Arah Sprite menjadi 180 derajat'
        ],
        correctIndex: 1,
        explanation: 'Sumbu X merepresentasikan posisi horizontal layar (ke kanan positif, ke kiri negatif).'
      }
    ]
  },

  // Modul 2: Scratch Animasi Berpikir & Suara
  'scr-02': {
    title: 'Kuis Pemahaman: Kostum Sprite & Efek Animasi',
    passingScore: 66,
    xpReward: 50,
    questions: [
      {
        id: 'q1',
        question: 'Bagaimana cara membuat karakter Sprite terlihat bergerak berjalan atau melompat dengan luwes di Scratch?',
        options: [
          'Menghapus Sprite dan membuat Sprite baru',
          'Mengganti kostum berikutnya (next costume) secara berulang dengan jeda waktu',
          'Mengubah warna latar belakang stage terus menerus',
          'Mematikan suara pada speaker'
        ],
        correctIndex: 1,
        explanation: 'Animasi di Scratch dicapai dengan berganti kostum (next costume) dalam perulangan loop dengan blok jeda (wait 0.1 secs).'
      },
      {
        id: 'q2',
        question: 'Blok manakah yang digunakan untuk memainkan efek suara hingga selesai sebelum melanjutkan ke perintah berikutnya?',
        options: [
          'play sound until done',
          'start sound',
          'stop all sounds',
          'change volume by 10'
        ],
        correctIndex: 0,
        explanation: '"Play sound until done" akan menunggu audio selesai berputar baru mengeksekusi blok di bawahnya.'
      }
    ]
  },

  // Modul 3: Scratch Percabangan (If - Then)
  'scr-03': {
    title: 'Kuis Pemahaman: Logika Percabangan (If - Then - Else)',
    passingScore: 66,
    xpReward: 50,
    questions: [
      {
        id: 'q1',
        question: 'Kapan perintah di dalam blok [jika <kondisi> maka ...] akan dijalankan?',
        options: [
          'Setiap kali program dihentikan',
          'Hanya ketika kondisi logika bernilai Benar (True)',
          'Hanya ketika kondisi logika bernilai Salah (False)',
          'Secara acak tanpa syarat apapun'
        ],
        correctIndex: 1,
        explanation: 'Blok percabangan (if-then) hanya akan mengeksekusi kode didalamnya jika ekspresi kondisi bernilai True (benar).'
      },
      {
        id: 'q2',
        question: 'Blok sensor (Sensing) mana yang sering dipakai untuk mendeteksi apakah karakter menabrak rintangan?',
        options: [
          'touching [edge / sprite] ?',
          'mouse x',
          'timer',
          'current year'
        ],
        correctIndex: 0,
        explanation: '"touching [sprite/color]?" digunakan untuk mengecek tabrakan fisika dasar di Scratch.'
      }
    ]
  },

  // Modul 4: Scratch Variabel & Skor Game
  'scr-04': {
    title: 'Kuis Pemahaman: Variabel & Penghitung Skor',
    passingScore: 66,
    xpReward: 50,
    questions: [
      {
        id: 'q1',
        question: 'Apa fungsi utama sebuah Variabel dalam pemrograman Scratch?',
        options: [
          'Hanya untuk menggambar karakter baru',
          'Menyimpan data atau nilai yang dapat berubah selama program berjalan (seperti Skor atau Nyawa)',
          'Mengubah kecepatan internet browser',
          'Memperbesar ukuran monitor'
        ],
        correctIndex: 1,
        explanation: 'Variabel adalah wadah penyimpanan nilai di memori komputer yang nilainya dinamis, seperti skor kuis atau koin game.'
      },
      {
        id: 'q2',
        question: 'Sebelum game dimulai, nilai variabel skor umumnya diatur ke angka berapa?',
        options: [
          '100',
          '0 menggunakan blok "set [Skor] to 0"',
          '-1',
          'Tidak perlu diatur'
        ],
        correctIndex: 1,
        explanation: 'Inisialisasi variabel (reset ke 0 saat game mulai) memastikan pemain baru memulai permainan dari skor awal nol.'
      }
    ]
  },

  // Modul Micro:bit 1
  'mb-01': {
    title: 'Kuis Pemahaman: Pengenalan BBC Micro:bit & Layar LED 5x5',
    passingScore: 66,
    xpReward: 50,
    questions: [
      {
        id: 'q1',
        question: 'Berapa jumlah LED matriks yang tersedia pada papan sirkuit BBC Micro:bit?',
        options: [
          '10 LED',
          '25 LED (Matriks berukuran 5x5)',
          '100 LED',
          '5 LED'
        ],
        correctIndex: 1,
        explanation: 'BBC Micro:bit memiliki 25 LED merah dalam susunan kisi 5 baris x 5 kolom.'
      },
      {
        id: 'q2',
        question: 'Blok dasar mana yang digunakan untuk menampilkan teks berjalan di layar LED Micro:bit?',
        options: [
          'show string ("Hello")',
          'show number',
          'clear screen',
          'plot x y'
        ],
        correctIndex: 0,
        explanation: '"show string" menampilkan teks yang berjalan dari kanan ke kiri pada layar matriks LED.'
      }
    ]
  },

  // Modul Micro:bit 2: Tombol & Sensor Input
  'mb-02': {
    title: 'Kuis Pemahaman: Tombol Input A, B dan Sensor Gerak',
    passingScore: 66,
    xpReward: 50,
    questions: [
      {
        id: 'q1',
        question: 'Manakah tombol fisik input yang tersedia secara bawaan di sisi depan Micro:bit?',
        options: [
          'Tombol Enter dan Spasi',
          'Tombol A, Tombol B, dan kombinasi A+B',
          'Tombol Joystick 4 arah',
          'Tombol Power On/Off saja'
        ],
        correctIndex: 1,
        explanation: 'Micro:bit memiliki 2 tombol input terprogram di sisi depan, yaitu tombol A dan B (serta event A+B jika ditekan bersamaan).'
      },
      {
        id: 'q2',
        question: 'Sensor bawaan Micro:bit apa yang dapat mendeteksi saat perangkat digoyangkan (on shake)?',
        options: [
          'Akselerometer (Accelerometer)',
          'Sensor Sidik Jari',
          'Sensor GPS Satelit',
          'Kamera Inframerah'
        ],
        correctIndex: 0,
        explanation: 'Akselerometer mengukur gaya percepatan dan gerakan (kemiringan, getaran, goyangan).'
      }
    ]
  },

  // Modul PictoBlox 1: Pengenalan AI & Computer Vision
  'pb-01': {
    title: 'Kuis Pemahaman: Pengenalan AI & Computer Vision di PictoBlox',
    passingScore: 66,
    xpReward: 50,
    questions: [
      {
        id: 'q1',
        question: 'Apa fungsi ekstensi Artificial Intelligence / Computer Vision pada PictoBlox?',
        options: [
          'Membuat komputer dapat "melihat" dan mengenali wajah, objek, atau gerakan melalui kamera',
          'Hanya untuk mengganti musik mp3',
          'Membuat monitor menjadi lebih cerah',
          'Mengirim email secara otomatis'
        ],
        correctIndex: 0,
        explanation: 'Computer Vision memungkinkan sistem komputer memproses gambar/video real-time dari kamera dan mendeteksi fitur seperti wajah, tangan, atau pose tubuh.'
      },
      {
        id: 'q2',
        question: 'Apa istilah proses ketika model AI dilatih dengan banyak contoh gambar untuk membedakan objek?',
        options: [
          'Machine Learning Training',
          'Formatting Hardisk',
          'Browsing Web',
          'Copy Paste Kode'
        ],
        correctIndex: 0,
        explanation: 'Machine Learning Training adalah tahap di mana algoritma mempelajari pola-pola dari data sampel untuk membuat prediksi.'
      }
    ]
  }
};

/**
 * Generate kuis interaktif yang cerdas dan relevan untuk modul apapun dalam kurikulum 54 modul
 */
export function getQuizForMaterial(material: Material): ModuleQuiz {
  // Jika sudah ada kuis kurasi khusus:
  if (SPECIFIC_MODULE_QUIZZES[material.id]) {
    return {
      materialId: material.id,
      ...SPECIFIC_MODULE_QUIZZES[material.id]
    };
  }

  // Generate kuis kontekstual berdasarkan kategori dan judul materi
  const cat = material.category;
  const seq = material.sequence;

  if (cat === 'Scratch') {
    return {
      materialId: material.id,
      title: `Kuis Pemahaman Modul #${seq}: ${material.title}`,
      passingScore: 66,
      xpReward: 50,
      questions: [
        {
          id: `q_${material.id}_1`,
          question: `Dalam materi "${material.title}", konsep logika pemrograman apa yang paling utama ditekankan?`,
          options: [
            material.competency || 'Sekuensial algoritma terstruktur dan alur program visual',
            'Pemasangan kabel sirkuit hardware solder',
            'Desain grafis 3D rendering kompleks',
            'Konfigurasi database server SQL cloud'
          ],
          correctIndex: 0,
          explanation: `Modul ini fokus pada pemahaman: ${material.description.slice(0, 120)}...`
        },
        {
          id: `q_${material.id}_2`,
          question: `Ketika membuat proyek Scratch pada topik ini, apa langkah paling penting agar kode berjalan tanpa galat (bug)?`,
          options: [
            'Menguji jalannya skrip blok secara bertahap dan memeriksa kondisi logika (debugging)',
            'Menghapus seluruh proyek saat menemukan sedikit kesalahan',
            'Menutup aplikasi tanpa menyimpan',
            'Menekan tombol bendera hijau secara acak tanpa skrip'
          ],
          correctIndex: 0,
          explanation: 'Proses debugging (menemukan dan memperbaiki kesalahan kode) adalah keterampilan inti berpikir komputasional di Scratch.'
        }
      ]
    };
  }

  if (cat === 'Microbit' || cat === 'MakeCode Arcade') {
    return {
      materialId: material.id,
      title: `Kuis Pemahaman Modul #${seq}: ${material.title}`,
      passingScore: 66,
      xpReward: 50,
      questions: [
        {
          id: `q_${material.id}_1`,
          question: `Terkait modul "${material.title}", bagaimana perangkat keras (hardware) dan kode berinteraksi?`,
          options: [
            'Program dikompilasi lalu diunggah ke mikrokontroler untuk membaca sensor dan mengontrol aktuator/output',
            'Perangkat keras tidak memerlukan kode sama sekali',
            'Hardware hanya bisa bekerja bila dicolokkan ke listrik 220V langsung',
            'Mikrokontroler hanya dapat menampilkan gambar statis'
          ],
          correctIndex: 0,
          explanation: `Sistem fisik komputasi menghubungkan logika kode dengan komponen fisik seperti tombol, LED, dan sensor.`
        },
        {
          id: `q_${material.id}_2`,
          question: `Apa indikator keberhasilan utama yang diharapkan dari materi ini?`,
          options: [
            material.indicators || 'Mampu mengimplementasikan simulasi atau kode fisik dengan benar',
            'Membeli 10 buah papan mikrokontroler',
            'Menghafal seluruh kode tanpa mempraktikkannya',
            'Menghapus extension yang sudah terpasang'
          ],
          correctIndex: 0,
          explanation: 'Kompetensi ditekankan pada penguasaan penerapan praktis logika komputasi fisik.'
        }
      ]
    };
  }

  if (cat === 'Pictoblox') {
    return {
      materialId: material.id,
      title: `Kuis Pemahaman AI Modul #${seq}: ${material.title}`,
      passingScore: 66,
      xpReward: 50,
      questions: [
        {
          id: `q_${material.id}_1`,
          question: `Bagaimana model Kecerdasan Buatan (AI) pada modul "${material.title}" mengenali data input pengguna?`,
          options: [
            'Menggunakan model pembelajaran mesin (Machine Learning) yang mengekstraksi fitur visual/suara secara real-time',
            'Menebak secara acak tanpa perhitungan matematis',
            'Menghubungi operator manusia secara rahasia di latar belakang',
            'Mengunci komputer agar tidak bisa bergerak'
          ],
          correctIndex: 0,
          explanation: 'Model AI di PictoBlox memproses citra webcam atau suara secara real-time dengan model machine learning berbasis saraf tiruan (neural networks).'
        },
        {
          id: `q_${material.id}_2`,
          question: `Apa manfaat mempelajari kecerdasan buatan sejak dini bagi siswa generasi GenZi?`,
          options: [
            'Memahami etika teknologi dan mampu menjadi pencipta (creator) inovasi AI masa depan, bukan sekadar konsumen',
            'Hanya agar bermain game menjadi lebih cepat',
            'Menggantikan waktu istirahat secara berlebihan',
            'Menghindari belajar matematika dan logika'
          ],
          correctIndex: 0,
          explanation: 'Literasi AI membekali siswa dengan pemahaman mendalam tentang cara kerja teknologi cerdas yang membentuk masa depan.'
        }
      ]
    };
  }

  // Default / Unplugged / CodeCombat
  return {
    materialId: material.id,
    title: `Kuis Pemahaman Modul #${seq}: ${material.title}`,
    passingScore: 66,
    xpReward: 50,
    questions: [
      {
        id: `q_${material.id}_1`,
        question: `Pada modul "${material.title}", apa prinsip utama yang harus dikuasai?`,
        options: [
          material.competency || 'Algoritma pemecahan masalah (problem solving) langkah demi langkah',
          'Bekerja tanpa rencana atau algoritma terstruktur',
          'Menyalin kode tanpa memahami fungsinya',
          'Mengabaikan aturan sintaksis bahasa'
        ],
        correctIndex: 0,
        explanation: 'Pemikiran komputasional (Computational Thinking) melatih dekomposisi masalah, pengenalan pola, abstraksi, dan perancangan algoritma.'
      },
      {
        id: `q_${material.id}_2`,
        question: `Bagaimana cara mengetahui bahwa misi pada modul ini telah berhasil kamu selesaikan?`,
        options: [
          material.indicators || 'Semua instruksi dan tantangan berhasil dijalankan sesuai kriteria',
          'Komputer mengeluarkan bunyi alarm',
          'Tampilan layar menjadi gelap',
          'Jumlah baris kode mencapai 10.000 baris'
        ],
        correctIndex: 0,
        explanation: 'Indikator capaian tercapai saat hasil luaran program sesuai dengan spesifikasi yang diminta pada panduan materi.'
      }
    ]
  };
}
