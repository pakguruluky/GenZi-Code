import { Material, ModuleQuiz, QuizQuestion } from '../types';

/**
 * Bank Soal Kurasi Khusus untuk Modul-modul Kunci Kurikulum GenZi Code
 * Setiap modul berisi 5 - 10 soal pilihan ganda lengkap dengan penjelasan konsep.
 */
const SPECIFIC_MODULE_QUIZZES: Record<string, Omit<ModuleQuiz, 'materialId'>> = {
  // Modul 1: MENGENAL BAGIAN MENU SCRATCH
  'mat-01': {
    title: 'Post Test: Mengenal Bagian Menu Scratch',
    passingScore: 60,
    xpReward: 75,
    questions: [
      {
        id: 'mat01_q1',
        question: 'Bagian lembar kerja di Scratch yang berfungsi sebagai panggung tempat Sprite beraksi dan animasi ditampilkan disebut...',
        options: [
          'Script Area / Blok Kode',
          'Stage (Panggung)',
          'Sprite Pane / Panel Karakter',
          'Costume Editor'
        ],
        correctIndex: 1,
        explanation: 'Stage adalah area panggung persegi (berkoordinat X dan Y) tempat semua sprite beraksi, bergerak, dan menjalankan skrip animasi.'
      },
      {
        id: 'mat01_q2',
        question: 'Area di tengah layar yang digunakan untuk merangkai dan menyusun balok-balok instruksi kode disebut...',
        options: [
          'Script Area (Area Kode / Lembar Kerja)',
          'Backdrop Palette',
          'Sound Library',
          'Status Bar'
        ],
        correctIndex: 0,
        explanation: 'Script Area adalah kanvas tempat programmer menarik (drag) dan merangkai balok-balok logika perintah untuk mengontrol sprite.'
      },
      {
        id: 'mat01_q3',
        question: 'Di manakah kamu dapat melihat daftar semua karakter (Sprite) yang sedang digunakan dalam proyek?',
        options: [
          'Menu File di baris atas',
          'Sprite Pane (Daftar Sprite) di bawah Stage',
          'Tab Suara (Sounds)',
          'Menu Bantuan (Tutorials)'
        ],
        correctIndex: 1,
        explanation: 'Sprite Pane terletak di bawah panggung, menampilkan thumbnail semua karakter aktif beserta koordinat posisi, ukuran, dan arahnya.'
      },
      {
        id: 'mat01_q4',
        question: 'Balok perintah di Scratch dikelompokkan berdasarkan warna dan fungsinya. Kategori warna BIRU TUA berfungsi untuk mengatur...',
        options: [
          'Tampilan kata dan kostum (Looks)',
          'Gerakan dan perpindahan posisi (Motion)',
          'Efek suara dan instrumen (Sound)',
          'Percabangan kondisi jika-maka (Control)'
        ],
        correctIndex: 1,
        explanation: 'Kategori Motion berwarna biru tua dan berisi balok gerak seperti move 10 steps, turn right, go to x y, dan glide.'
      },
      {
        id: 'mat01_q5',
        question: 'Apa fungsi dari ikon BENDERA HIJAU yang terletak di atas panggung (Stage)?',
        options: [
          'Menghapus seluruh proyek yang sedang dibuat',
          'Memulai eksekusi program atau animasi yang telah disusun',
          'Menutup jendela browser',
          'Menyimpan file proyek ke flashdisk'
        ],
        correctIndex: 1,
        explanation: 'Bendera Hijau adalah pemicu global (Start Program) untuk menjalankan skrip yang diawali blok "when green flag clicked".'
      },
      {
        id: 'mat01_q6',
        question: 'Format berkas resmi yang dihasilkan saat kamu mengunduh proyek dari Scratch 3.0 ke komputermu adalah...',
        options: [
          '.mp4',
          '.sb3',
          '.docx',
          '.pdf'
        ],
        correctIndex: 1,
        explanation: 'Scratch 3.0 menyimpan proyek dalam format .sb3 (Scratch Project Version 3), yang memuat gambar, suara, dan skrip balok.'
      }
    ]
  },

  // Modul 2: MENYUSUN DAN MENJALANKAN PERINTAH
  'mat-02': {
    title: 'Post Test: Menyusun dan Menjalankan Perintah Algoritma',
    passingScore: 60,
    xpReward: 75,
    questions: [
      {
        id: 'mat02_q1',
        question: 'Dalam ilmu pemrograman komputer, urutan langkah-langkah logis dan sistematis untuk menyelesaikan suatu masalah disebut...',
        options: [
          'Algoritma (Algorithm)',
          'Hardware',
          'Browsing',
          'Database'
        ],
        correctIndex: 0,
        explanation: 'Algoritma adalah serangkaian instruksi terurut yang dijalankan langkah demi langkah oleh komputer untuk mencapai hasil yang diinginkan.'
      },
      {
        id: 'mat02_q2',
        question: 'Bagaimana cara menggabungkan dua balok perintah di Scratch agar dieksekusi secara berurutan?',
        options: [
          'Meletakkan balok terpisah jauh di Script Area',
          'Mendekatkan balok hingga muncul bayangan putih dan balok mengunci (snap) di bawahnya',
          'Menghapus salah satu balok dengan tombol delete',
          'Mengganti warna panggung stage'
        ],
        correctIndex: 1,
        explanation: 'Balok Scratch dirancang seperti puzzle dengan lekukan magnetik (snap) yang akan mengunci satu sama lain secara sekuensial.'
      },
      {
        id: 'mat02_q3',
        question: 'Blok kategori "Events" manakah yang paling sering digunakan untuk mengawali sebuah rangkaian skrip?',
        options: [
          'when green flag clicked',
          'repeat until',
          'set x to 0',
          'hide'
        ],
        correctIndex: 0,
        explanation: '"when green flag clicked" adalah blok event pemicu utama yang mengeksekusi urutan balok di bawahnya saat tombol bendera hijau ditekan.'
      },
      {
        id: 'mat02_q4',
        question: 'Jika kamu menyusun balok: [move 10 steps] lalu di bawahnya [say "Halo!" for 2 secs], apa yang akan terjadi?',
        options: [
          'Sprite menghilang seketika',
          'Sprite bergerak 10 langkah terlebih dahulu, lalu mengucapkan "Halo!" selama 2 detik',
          'Sprite hanya berkata "Halo!" tanpa bergerak',
          'Scratch mengalami error'
        ],
        correctIndex: 1,
        explanation: 'Komputer mengeksekusi instruksi secara sekuensial (dari atas ke bawah): bergerak 10 langkah terlebih dahulu kemudian menampilkan balon teks ucapan.'
      },
      {
        id: 'mat02_q5',
        question: 'Apa fungsi blok "point towards [mouse-pointer]" pada kategori Motion?',
        options: [
          'Membuat Sprite menghadap ke arah kursor mouse pengguna',
          'Menghapus kursor mouse dari layar',
          'Mengubah ukuran panggung Stage',
          'Menghentikan seluruh suara'
        ],
        correctIndex: 0,
        explanation: 'Blok "point towards" mengubah orientasi derajat hadap sprite ke target tertentu seperti kursor mouse atau sprite lainnya.'
      },
      {
        id: 'mat02_q6',
        question: 'Tombol berwarna MERAH di sebelah Bendera Hijau pada Scratch berfungsi untuk...',
        options: [
          'Mempercepat animasi 2 kali lipat',
          'Menghentikan seketika (Stop All) seluruh skrip yang sedang berjalan',
          'Menyimpan proyek secara otomatis',
          'Mengganti kostum sprite ke warna merah'
        ],
        correctIndex: 1,
        explanation: 'Tombol Stop (lingkaran merah heksagonal) berfungsi menghentikan seluruh proses eksekusi kode pada semua sprite dan panggung.'
      }
    ]
  },

  // Modul 3: MENYUSUN DAN MENJALANKAN PERINTAH 2
  'mat-03': {
    title: 'Post Test: Alur Eksekusi & Event Interaktif',
    passingScore: 60,
    xpReward: 75,
    questions: [
      {
        id: 'mat03_q1',
        question: 'Apakah dua rangkaian skrip yang berbeda pada satu Sprite dapat berjalan secara bersamaan (paralel)?',
        options: [
          'Tidak bisa, hanya satu skrip saja yang boleh dibuat per Sprite',
          'Bisa, misalnya dua tumpukan skrip yang sama-sama dipicu oleh event "when green flag clicked"',
          'Hanya bisa jika menggunakan komputer super canggih',
          'Hanya bisa jika proyek disimpan ke server'
        ],
        correctIndex: 1,
        explanation: 'Scratch mendukung eksekusi paralel. Kamu bisa memiliki beberapa event pemicu yang sama, dan keduanya akan berjalan secara serentak.'
      },
      {
        id: 'mat03_q2',
        question: 'Blok event manakah yang digunakan untuk menjalankan perintah ketika Sprite diklik oleh pengguna?',
        options: [
          'when this sprite clicked',
          'when backdrop switches',
          'when loudness > 10',
          'when I receive message1'
        ],
        correctIndex: 0,
        explanation: '"when this sprite clicked" memicu jalannya skrip saat mouse pengguna mengeklik tubuh karakter sprite tersebut di panggung.'
      },
      {
        id: 'mat03_q3',
        question: 'Jika ingin memberikan jeda waktu istirahat 1 detik sebelum instruksi berikutnya dieksekusi, blok apa yang digunakan?',
        options: [
          'wait 1 seconds (Control)',
          'stop all (Control)',
          'repeat 10 (Control)',
          'forever (Control)'
        ],
        correctIndex: 0,
        explanation: 'Blok "wait [1] seconds" menunda eksekusi instruksi di bawahnya selama durasi detik yang ditentukan.'
      },
      {
        id: 'mat03_q4',
        question: 'Mengapa urutan penataan balok kode sangat penting dalam pemrograman?',
        options: [
          'Karena urutan menentukan warna balok',
          'Karena komputer menjalankan perintah secara sekuensial; urutan yang salah akan menghasilkan logika/keluaran yang salah (bug)',
          'Karena urutan mempengaruhi ukuran memori hardisk',
          'Sebenarnya urutan tidak berpengaruh apa-apa'
        ],
        correctIndex: 1,
        explanation: 'Urutan instruksi menentukan alur logika program. Menukar urutan perintah (misalnya say sebelum move) dapat merubah perilaku program secara drastis.'
      },
      {
        id: 'mat03_q5',
        question: 'Istilah kesalahan atau kekeliruan dalam penulisan logika kode pemrograman yang menyebabkan program tidak berjalan semestinya disebut...',
        options: [
          'Feature',
          'Bug',
          'Compiler',
          'Pixel'
        ],
        correctIndex: 1,
        explanation: 'Bug adalah istilah populer dalam dunia rekayasa perangkat lunak untuk menyebut galat atau kesalahan logika pada kode program.'
      },
      {
        id: 'mat03_q6',
        question: 'Proses menemukan dan memperbaiki kesalahan (bug) pada susunan balok kode dinamakan...',
        options: [
          'Debugging',
          'Downloading',
          'Rendering',
          'Formatting'
        ],
        correctIndex: 0,
        explanation: 'Debugging adalah keterampilan membedah kode secara kritis untuk melacak penyebab kesalahan dan memperbaikinya.'
      }
    ]
  },

  // Modul 4: MEMBUAT SPRITE BERGERAK (2)
  'mat-04': {
    title: 'Post Test: Membuat Sprite Bergerak Dinamis & Animasi',
    passingScore: 60,
    xpReward: 75,
    questions: [
      {
        id: 'mat04_q1',
        question: 'Blok perulangan manakah yang digunakan agar Sprite terus bergerak tanpa henti selama permainan berlangsung?',
        options: [
          'repeat 10',
          'forever (selamanya)',
          'repeat until',
          'wait until'
        ],
        correctIndex: 1,
        explanation: 'Blok "forever" akan terus mengeksekusi instruksi di dalamnya tanpa batas hingga tombol Stop ditekan atau diputus oleh blok stop.'
      },
      {
        id: 'mat04_q2',
        question: 'Ketika Sprite bergerak mendekati ujung panggung dan kamu ingin Sprite berbalik arah agar tidak keluar layar, blok apa yang dipakai?',
        options: [
          'if on edge, bounce',
          'go to random position',
          'set rotation style don\'t rotate',
          'hide'
        ],
        correctIndex: 0,
        explanation: '"if on edge, bounce" mendeteksi apakah batas tubuh sprite menyentuh tepi panggung, lalu otomatis membalikkan arah hadapnya.'
      },
      {
        id: 'mat04_q3',
        question: 'Agar Sprite tidak terbalik dengan kepala di bawah saat memantul ke kiri dan kanan, setelan gaya rotasi (rotation style) yang tepat adalah...',
        options: [
          'all around (360 derajat)',
          'left-right (kiri-kanan)',
          'don\'t rotate (tidak berputar)',
          'upside-down'
        ],
        correctIndex: 1,
        explanation: 'Gaya rotasi "left-right" membatasi sprite agar hanya berbalik hadap horizontal ke arah kiri atau kanan tanpa membalikkan posisi kepala.'
      },
      {
        id: 'mat04_q4',
        question: 'Bagaimana cara membuat animasi berjalan yang mulus pada Sprite Kucing Scratch?',
        options: [
          'Menghapus sprite lalu menambahkan sprite baru berkali-kali',
          'Menggabungkan blok [next costume], [move 10 steps], dan [wait 0.1 secs] di dalam blok [forever]',
          'Mengubah volume suara kucing menjadi 200%',
          'Mengganti nama sprite kucing menjadi cat_fast'
        ],
        correctIndex: 1,
        explanation: 'Prinsip animasi frame-by-frame: berganti kostum (next costume) dengan pergerakan langkah dan jeda sepersekian detik di dalam loop selamanya.'
      },
      {
        id: 'mat04_q5',
        question: 'Jika nilai koordinat X pada Sprite diubah dari 0 menjadi 150, ke manakah Sprite akan berpindah?',
        options: [
          'Berpindah ke atas',
          'Berpindah ke arah kanan panggung',
          'Berpindah ke arah kiri panggung',
          'Berpindah ke bawah panggung'
        ],
        correctIndex: 1,
        explanation: 'Sumbu X adalah sumbu horizontal panggung: nilai positif berada di sebelah kanan (hingga +240) dan negatif di sebelah kiri (hingga -240).'
      },
      {
        id: 'mat04_q6',
        question: 'Berapakah ukuran rentang koordinat bidang panggung Scratch 3.0 standar?',
        options: [
          'Lebar X (-240 sampai +240) dan Tinggi Y (-180 sampai +180)',
          'Lebar X (0 sampai 100) dan Tinggi Y (0 sampai 100)',
          'Lebar X (-1000 sampai +1000) dan Tinggi Y (-1000 sampai +1000)',
          'Lebar X (0 sampai 360) dan Tinggi Y (0 sampai 180)'
        ],
        correctIndex: 0,
        explanation: 'Panggung Scratch berukuran lebar 480 piksel (X: -240 s.d +240) dan tinggi 360 piksel (Y: -180 s.d +180) dengan titik tengah (0,0).'
      }
    ]
  },

  // Modul 5: PROJEK 1: GAME SALING MENEMBAK
  'mat-05': {
    title: 'Post Test: Projek Game Saling Menembak 2D',
    passingScore: 60,
    xpReward: 75,
    questions: [
      {
        id: 'mat05_q1',
        question: 'Dalam game tembak-menembak, blok sensor (Sensing) apa yang digunakan untuk mendeteksi apakah peluru mengenai musuh?',
        options: [
          'touching [Sprite Musuh] ?',
          'mouse down ?',
          'key space pressed ?',
          'timer > 10'
        ],
        correctIndex: 0,
        explanation: '"touching [sprite]?" adalah ekspresi boolean logika yang bernilai True (Benar) ketika fisik kedua sprite saling bersentuhan di panggung.'
      },
      {
        id: 'mat05_q2',
        question: 'Fitur Scratch apa yang paling efisien digunakan agar pemain bisa menembakkan banyak peluru berulang kali tanpa membuat puluhan sprite peluru manual?',
        options: [
          'Cloning (create clone of myself)',
          'Backdrop Switcher',
          'Variable Slider',
          'Color Picker'
        ],
        correctIndex: 0,
        explanation: 'Fitur Cloning (Penggandaan) memungkinkan sprite peluru menggandakan dirinya secara dinamis saat tombol tembak ditekan.'
      },
      {
        id: 'mat05_q3',
        question: 'Blok event apa yang dipicu ketika sebuah klon peluru baru saja tercipta?',
        options: [
          'when I start as a clone',
          'when green flag clicked',
          'when key space pressed',
          'when stage clicked'
        ],
        correctIndex: 0,
        explanation: '"when I start as a clone" adalah event handler yang mengeksekusi perilaku khusus setiap klon baru (seperti meluncur maju dan menghilang saat kena target).'
      },
      {
        id: 'mat05_q4',
        question: 'Setelah klon peluru mengenai musuh atau mencapai ujung layar, perintah apa yang wajib diberikan agar memori tidak penuh?',
        options: [
          'delete this clone',
          'hide forever',
          'set size to 0%',
          'play sound meow'
        ],
        correctIndex: 0,
        explanation: 'Blok "delete this clone" menghapus objek klon dari memori untuk menjaga performa game tetap lancar dan tidak lag.'
      },
      {
        id: 'mat05_q5',
        question: 'Variabel apa yang paling mendasar dan penting untuk dibuat dalam proyek game tembak-menembak?',
        options: [
          'Variabel Skor (Score) dan Nyawa (Health/Lives)',
          'Variabel Resolusi Monitor',
          'Variabel Warna Keyboard',
          'Variabel Merk Komputer'
        ],
        correctIndex: 0,
        explanation: 'Variabel Score untuk mencatat poin tembakan berhasil dan Health/Lives untuk menentukan status kekalahan pemain.'
      },
      {
        id: 'mat05_q6',
        question: 'Struktur logika apa yang tepat untuk memeriksa kondisi kekalahan game (Game Over)?',
        options: [
          'if < [Lives] = 0 > then [broadcast "Game Over" dan stop all]',
          'forever [move 10 steps]',
          'when backdrop switches [say halo]',
          'wait 5 seconds'
        ],
        correctIndex: 0,
        explanation: 'Percabangan "if Lives <= 0" digunakan untuk mengecek apakah nyawa sudah habis, lalu menyiarkan pesan Game Over dan menghentikan game.'
      }
    ]
  },

  // Modul 6: MEMAHAMI MENU LOOKS
  'mat-06': {
    title: 'Post Test: Memanipulasi Menu Looks & Visual Sprite',
    passingScore: 60,
    xpReward: 75,
    questions: [
      {
        id: 'mat06_q1',
        question: 'Apa perbedaan utama antara blok [say "Halo!" for 2 secs] dengan [say "Halo!"] tanpa durasi detik?',
        options: [
          'Blok dengan durasi akan menghilangkan balon ucapan setelah 2 detik, sedangkan tanpa durasi akan menampilkan balon selamanya sampai ada instruksi lain',
          'Blok dengan durasi membuat suara keras keluar dari speaker',
          'Blok tanpa durasi otomatis menghapus sprite',
          'Keduanya sama persis tidak ada bedanya'
        ],
        correctIndex: 0,
        explanation: 'Parameter durasi detik mengatur lama waktu balon kata bertahan di panggung sebelum kode melanjutkan ke perintah berikutnya.'
      },
      {
        id: 'mat06_q2',
        question: 'Perbedaan bentuk balon pada balok [think "Hmm..."] dibanding balok [say "Halo!"] adalah...',
        options: [
          'Balon say berbentuk lingkaran, sedangkan think berbentuk segitiga',
          'Balon think berbentuk awan pikiran dengan gelembung kecil, sedangkan say berbentuk balon percakapan biasa',
          'Balon think berwarna merah terang',
          'Balon think tidak menampilkan teks apapun'
        ],
        correctIndex: 1,
        explanation: 'Blok "think" menampilkan balon bergaya gelembung awan (pikiran batin karakter), sedangkan "say" berbentuk balon percakapan dialog standar.'
      },
      {
        id: 'mat06_q3',
        question: 'Blok apa yang digunakan untuk membuat Sprite berkedip atau berubah warna secara acak?',
        options: [
          'change [color] effect by 25',
          'set x to 100',
          'turn 15 degrees',
          'play sound pop'
        ],
        correctIndex: 0,
        explanation: 'Blok "change [color] effect by [25]" mengubah corak rona spektrum visual warna sprite di panggung.'
      },
      {
        id: 'mat06_q4',
        question: 'Jika kamu ingin Sprite berangsur-angsur menjadi transparan seperti hantu lalu menghilang, efek grafis apa yang dinaikkan nilainya?',
        options: [
          'Efek Ghost (Bayangan Hantu)',
          'Efek Fisheye',
          'Efek Whirl',
          'Efek Mosaic'
        ],
        correctIndex: 0,
        explanation: 'Efek "ghost" mengatur tingkat transparansi sprite (0 = tampak padat penuh, 100 = transparan sempurna/tak terlihat).'
      },
      {
        id: 'mat06_q5',
        question: 'Untuk menyembunyikan Sprite dari panggung sementara waktu tanpa menghapusnya dari proyek, blok apa yang digunakan?',
        options: [
          'hide (Tampilan/Looks)',
          'delete sprite',
          'stop this script',
          'clear graphic effects'
        ],
        correctIndex: 0,
        explanation: 'Blok "hide" menyembunyikan sprite dari pandangan panggung. Untuk menampilkannya kembali, digunakan blok "show".'
      },
      {
        id: 'mat06_q6',
        question: 'Bagaimana cara mengatur ukuran Sprite menjadi dua kali lipat ukuran normalnya?',
        options: [
          'set size to 200 %',
          'change size by 2',
          'set volume to 200%',
          'go to x: 200 y: 200'
        ],
        correctIndex: 0,
        explanation: 'Ukuran default Sprite adalah 100%. Untuk memperbesar 2 kali lipat, ubah persentase dengan blok "set size to 200%".'
      }
    ]
  },

  // Modul 7: MENGENDALIKAN SPRITE DENGAN KEYBOARD & MOUSE
  'mat-07': {
    title: 'Post Test: Kendali Input Keyboard dan Pointer Mouse',
    passingScore: 60,
    xpReward: 75,
    questions: [
      {
        id: 'mat07_q1',
        question: 'Blok pemicu event manakah yang digunakan agar Sprite melompat saat tombol Spasi ditekan?',
        options: [
          'when [space] key pressed',
          'when green flag clicked',
          'when this sprite clicked',
          'when backdrop switches'
        ],
        correctIndex: 0,
        explanation: '"when [space] key pressed" dari kategori Events langsung merespons ketukan tombol keyboard spasi dari pengguna.'
      },
      {
        id: 'mat07_q2',
        question: 'Untuk membuat kontrol gerak 4 arah game yang halus dan responsif, pendekatan logika mana yang paling direkomendasikan?',
        options: [
          'Menggunakan blok "if <key right arrow pressed?> then change x by 10" di dalam loop forever',
          'Mengetik nama tombol secara manual di tab teks',
          'Hanya mengandalkan tombol klik kanan mouse',
          'Mematikan fungsi keyboard'
        ],
        correctIndex: 0,
        explanation: 'Kombinasi loop forever dengan sensor "if key pressed" memberikan respons pergerakan yang mulus tanpa delay ketukan default OS.'
      },
      {
        id: 'mat07_q3',
        question: 'Ketika pemain menekan tombol PANAH ATAS (Up Arrow), perubahan nilai koordinat apa yang seharusnya diberikan pada Sprite?',
        options: [
          'change y by 10 (positif)',
          'change y by -10 (negatif)',
          'change x by 10',
          'change x by -10'
        ],
        correctIndex: 0,
        explanation: 'Pada bidang kartesius Scratch, pergerakan ke atas menambah nilai sumbu Y positif (change y by 10).'
      },
      {
        id: 'mat07_q4',
        question: 'Blok apa yang dapat membuat Sprite bergerak langsung mengikuti posisi kursor mouse secara konstan?',
        options: [
          'forever [go to mouse-pointer]',
          'when space pressed [turn 90 degrees]',
          'set x to 0',
          'wait 10 seconds'
        ],
        correctIndex: 0,
        explanation: 'Menempatkan blok "go to mouse-pointer" di dalam loop forever akan membuat koordinat sprite selalu menempel pada kursor mouse.'
      },
      {
        id: 'mat07_q5',
        question: 'Sensor boolean apa yang bernilai True ketika pengguna sedang menekan tombol klik pada mouse?',
        options: [
          'mouse down ?',
          'mouse x',
          'mouse y',
          'loudness'
        ],
        correctIndex: 0,
        explanation: 'Blok sensing "mouse down?" memeriksa apakah tombol klik mouse sedang dalam posisi ditekan oleh pengguna.'
      },
      {
        id: 'mat07_q6',
        question: 'Jika ingin Sprite bergerak ke arah kiri saat tombol panah kiri ditekan, balok yang tepat adalah...',
        options: [
          'change x by -10 (negatif)',
          'change x by 10 (positif)',
          'change y by -10',
          'change y by 10'
        ],
        correctIndex: 0,
        explanation: 'Mengurangi nilai koordinat X (change x by -10) akan memindahkan posisi horizontal sprite ke arah kiri panggung.'
      }
    ]
  },

  // Modul 13: PICTOBLOX AI: PENGANTAR KECERDASAN BUATAN
  'mat-13': {
    title: 'Post Test: Pengantar Kecerdasan Buatan (AI) di PictoBlox',
    passingScore: 60,
    xpReward: 75,
    questions: [
      {
        id: 'mat13_q1',
        question: 'Apa definisi paling mendasar dari Kecerdasan Buatan (Artificial Intelligence / AI)?',
        options: [
          'Kemampuan sistem komputer atau mesin untuk meniru kecerdasan manusia seperti belajar, mengenali pola, dan mengambil keputusan',
          'Komputer yang fisiknya terbuat dari logam emas murni',
          'Koneksi internet kabel berkecepatan 1000 Gbps',
          'Aplikasi kalkulator biasa'
        ],
        correctIndex: 0,
        explanation: 'AI adalah cabang ilmu komputer yang merancang sistem cerdas untuk memecahkan masalah, belajar dari pengalaman (data), dan bernalar seperti manusia.'
      },
      {
        id: 'mat13_q2',
        question: 'Teknologi AI yang memungkinkan komputer untuk "melihat", mengolah, dan mengenali objek dari rekaman kamera/webcam dinamakan...',
        options: [
          'Computer Vision (Penglihatan Komputer)',
          'Natural Language Processing',
          'Database Query',
          'File Compression'
        ],
        correctIndex: 0,
        explanation: 'Computer Vision adalah teknologi AI yang menganalisis citra visual atau video dari webcam dan mengekstrak informasi penting seperti wajah atau benda.'
      },
      {
        id: 'mat13_q3',
        question: 'Bagaimana cara menambahkan fitur AI seperti Pendeteksi Wajah (Face Detection) di PictoBlox?',
        options: [
          'Membuka ikon "Add Extension" di pojok kiri bawah lalu memilih ekstensi Face Detection',
          'Mengetik kode rahasia di keyboard',
          'Merestart laptop berkali-kali',
          'Membeli webcam baru'
        ],
        correctIndex: 0,
        explanation: 'PictoBlox memiliki galeri Ekstensi (Add Extension) yang memuat modul-modul AI modern siap pakai seperti Face Detection, Object Detection, dan OCR.'
      },
      {
        id: 'mat13_q4',
        question: 'Tahap di mana model AI diberikan ribuan contoh foto agar dapat membedakan antara gambar kucing dan anjing disebut...',
        options: [
          'Pelatihan Model (Model Training)',
          'Pembersihan Cache',
          'Install Font',
          'Defragmentasi Hardisk'
        ],
        correctIndex: 0,
        explanation: 'Model Training adalah proses pembelajaran di mana algoritma machine learning mempelajari bobot dan fitur dari kumpulan data latih.'
      },
      {
        id: 'mat13_q5',
        question: 'Mengapa pencahayaan ruangan sangat berpengaruh terhadap akurasi pendeteksian AI Computer Vision?',
        options: [
          'Karena kamera membutuhkan cahaya yang memadai untuk menangkap detail kontur wajah dan membedakannya dari latar belakang',
          'Karena AI takut dengan ruangan gelap',
          'Karena lampu memancarkan frekuensi sinyal wifi',
          'Sebenarnya pencahayaan tidak berpengaruh sama sekali'
        ],
        correctIndex: 0,
        explanation: 'Kualitas data gambar bergantung pada pencahayaan. Kamera yang gelap akan menghasilkan gambar berpiksel buram sehingga algoritma sulit mengenali fitur wajah.'
      },
      {
        id: 'mat13_q6',
        question: 'Ekstensi AI di PictoBlox yang bertugas mengubah rekaman suara manusia menjadi teks (Speech to Text) dinamakan...',
        options: [
          'Speech Recognition / Voice Recognition',
          'Pen Drawing Extension',
          'Music Drum Machine',
          'Video Motion Sensor'
        ],
        correctIndex: 0,
        explanation: 'Speech Recognition memproses gelombang audio suara manusia melalui model fonem dan mengubahnya menjadi untaian teks digital.'
      }
    ]
  },

  // Modul 24: MEMAHAMI VARIABEL DALAM CODING
  'mat-24': {
    title: 'Post Test: Memahami Konsep Variabel dalam Pemrograman',
    passingScore: 60,
    xpReward: 75,
    questions: [
      {
        id: 'mat24_q1',
        question: 'Analogi paling tepat untuk menggambarkan konsep sebuah "Variabel" dalam coding adalah...',
        options: [
          'Sebuah kotak berlabel nama yang dapat menyimpan data/nilai dan isinya dapat diganti sewaktu-waktu',
          'Sebuah layar monitor kaca',
          'Sebuah kabel listrik tembaga',
          'Sebuah tombol keyboard enter'
        ],
        correctIndex: 0,
        explanation: 'Variabel ibarat wadah/kotak berlabel di memori komputer yang digunakan untuk menyimpan nilai dinamis seperti skor, nyawa, atau waktu.'
      },
      {
        id: 'mat24_q2',
        question: 'Jika kamu memiliki variabel [Skor] yang saat ini bernilai 15, lalu dieksekusi blok [change Skor by 5], berapakah nilai akhir [Skor]?',
        options: [
          '20',
          '5',
          '15',
          '155'
        ],
        correctIndex: 0,
        explanation: 'Blok "change [Skor] by 5" menambahkan angka 5 ke nilai sebelumnya: 15 + 5 = 20.'
      },
      {
        id: 'mat24_q3',
        question: 'Mengapa sangat penting menaruh blok [set [Skor] to 0] tepat di bawah event [when green flag clicked]?',
        options: [
          'Untuk mereset skor kembali ke nol setiap kali game baru dimulai',
          'Hanya sebagai hiasan skrip',
          'Agar game berjalan lebih lambat',
          'Untuk menghapus karakter pemain'
        ],
        correctIndex: 0,
        explanation: 'Inisialisasi variabel di awal program memastikan pemain baru tidak mewarisi sisa skor dari permainan sebelumnya.'
      },
      {
        id: 'mat24_q4',
        question: 'Apa perbedaan mendasar antara opsi "For all sprites" (Global) dan "For this sprite only" (Lokal) saat membuat variabel?',
        options: [
          '"For all sprites" dapat dibaca dan diubah oleh semua sprite, sedangkan "For this sprite only" hanya dapat diakses oleh sprite pembuatnya',
          '"For all sprites" hanya berlaku untuk 1 menit',
          '"For this sprite only" tidak dapat menyimpan angka',
          'Tidak ada perbedaan keduanya'
        ],
        correctIndex: 0,
        explanation: 'Cakupan (scope) variabel: variabel global dapat diakses oleh seluruh elemen game, sedangkan variabel lokal eksklusif untuk sprite tersebut (misal kecepatan peluru klon).'
      },
      {
        id: 'mat24_q5',
        question: 'Tipe data manakah yang cocok disimpan di dalam variabel untuk nama pemain seperti "Farhan"?',
        options: [
          'Teks / String',
          'Angka Desimal / Float',
          'Boolean (True/False)',
          'Array Matriks'
        ],
        correctIndex: 0,
        explanation: 'Data berupa huruf, kata, atau kalimat disimpan dalam tipe data teks (String).'
      },
      {
        id: 'mat24_q6',
        question: 'Bagaimana cara membuat penghitung waktu mundur (Timer Countdown 60 detik) menggunakan variabel?',
        options: [
          'set Timer to 60, lalu di dalam loop repeat 60: [wait 1 secs] dan [change Timer by -1]',
          'forever [change Timer by 100]',
          'when space pressed [set Timer to "selesai"]',
          'delete variable Timer'
        ],
        correctIndex: 0,
        explanation: 'Logika countdown: inisialisasi ke 60 detik, ulangi 60 kali dengan jeda wait 1 detik sambil mengurangi variabel Timer sebesar -1 setiap detiknya.'
      }
    ]
  }
};

/**
 * Generator Cerdas & Kontekstual untuk Modul Apapun
 * Membangun 5 - 8 soal pilihan ganda bermutu tinggi yang relevan dengan judul, kategori, dan kompetensi modul.
 */
function generateContextualQuiz(material: Material): ModuleQuiz {
  const cat = material.category;
  const title = material.title;
  const seq = material.sequence;
  const comp = material.competency || `Pemahaman Modul ${title}`;
  const ind = material.indicators || `Mampu mempraktikkan konsep dan menyelesaikan tantangan ${title} dengan baik`;

  const questions: QuizQuestion[] = [];

  // Soal 1: Tujuan & Konsep Inti Modul
  if (cat === 'Scratch') {
    questions.push({
      id: `${material.id}_q1`,
      question: `Apa tujuan utama yang dipelajari pada Modul #${seq}: "${title}"?`,
      options: [
        comp,
        'Menghafal seluruh baris kode tanpa memahami alur logikanya',
        'Mengganti tema tampilan komputer secara keseluruhan',
        'Menghapus proyek Scratch yang telah dibuat sebelumnya'
      ],
      correctIndex: 0,
      explanation: `Modul ini secara spesifik membekali siswa dengan kompetensi: "${comp}".`
    });
  } else if (cat === 'Pictoblox') {
    questions.push({
      id: `${material.id}_q1`,
      question: `Pada modul PictoBlox AI #${seq}: "${title}", apa konsep kecerdasan buatan utama yang diintegrasikan?`,
      options: [
        comp,
        'Penggunaan kalkulator offline manual',
        'Penyusunan tabel teks statis tanpa sensor cerdas',
        'Menonaktifkan kamera dan mikrofon komputer'
      ],
      correctIndex: 0,
      explanation: `Eksplorasi PictoBlox pada modul ini memfokuskan pemahaman siswa pada: ${comp}.`
    });
  } else if (cat === 'Microbit' || cat === 'MakeCode Arcade') {
    questions.push({
      id: `${material.id}_q1`,
      question: `Komputasi fisik atau perancangan game pada modul #${seq}: "${title}" berfokus pada penguasaan...`,
      options: [
        comp,
        'Pembelian komponen elektronik tanpa memprogramnya',
        'Mengabaikan logika sensor dan input tombol',
        'Menghapus extension MakeCode yang sudah ada'
      ],
      correctIndex: 0,
      explanation: `Fokus capaian modul ini menekankan pada: ${comp}.`
    });
  } else if (cat === 'CodeCombat') {
    questions.push({
      id: `${material.id}_q1`,
      question: `Dalam petualangan text coding modul #${seq}: "${title}", keterampilan pemrograman apa yang dilatih?`,
      options: [
        comp,
        'Menyalin kode tanpa memahami fungsi perintahnya',
        'Bermain game tanpa memperhatikan baris kode yang ditulis',
        'Mengabaikan pesan error saat program dijalankan'
      ],
      correctIndex: 0,
      explanation: `CodeCombat melatih keterampilan menulis sintaks nyata untuk mengasah: ${comp}.`
    });
  } else {
    // Unplugged & SpriteLab
    questions.push({
      id: `${material.id}_q1`,
      question: `Pada aktivitas komputasional modul #${seq}: "${title}", apa prinsip utama yang harus dikuasai?`,
      options: [
        comp,
        'Bekerja tanpa rencana atau algoritma yang sistematis',
        'Menebak hasil tanpa menguji langkah-langkah logika',
        'Mengabaikan petunjuk lembar kerja'
      ],
      correctIndex: 0,
      explanation: `Aktivitas ini melatih fondasi Computational Thinking yaitu: ${comp}.`
    });
  }

  // Soal 2: Alat, Blok, atau Sintaks yang Digunakan
  if (cat === 'Scratch') {
    questions.push({
      id: `${material.id}_q2`,
      question: `Kategori balok Scratch manakah yang paling sering dikombinasikan untuk menyelesaikan materi "${title}"?`,
      options: [
        'Kombinasi kategori Events (Pemicu) dan Control / Motion sesuai skenario proyek',
        'Hanya menggunakan blok komentar tanpa instruksi aksi',
        'Kategori suara saja tanpa logika pergerakan',
        'Tidak memerlukan balok Scratch apapun'
      ],
      correctIndex: 0,
      explanation: 'Pemrograman Scratch selalu mengandalkan pemicu event yang terhubung dengan struktur kontrol logika dan instruksi aksi.'
    });
  } else if (cat === 'Pictoblox') {
    questions.push({
      id: `${material.id}_q2`,
      question: `Mengapa data masukan (seperti citra kamera atau suara) sangat penting dalam proyek "${title}"?`,
      options: [
        'Karena model Machine Learning membutuhkan data input riil untuk dianalisis dan diproses menjadi aksi responsif',
        'Agar komputer menjadi panas dan bekerja lebih keras',
        'Hanya untuk memenuhi kuota internet',
        'Data masukan sebenarnya tidak diproses sama sekali oleh AI'
      ],
      correctIndex: 0,
      explanation: 'Kecerdasan Buatan bekerja dengan memproses data masukan (input) melalui algoritma inferensi cerdas untuk menghasilkan luaran (output).'
    });
  } else if (cat === 'CodeCombat') {
    questions.push({
      id: `${material.id}_q2`,
      question: `Dalam sintaks pemrograman teks Python pada modul "${title}", hal apa yang harus selalu diperhatikan agar tidak terjadi error?`,
      options: [
        'Ketepatan penulisan huruf besar-kecil (case sensitive) dan tanda kurung buka-tutup ()',
        'Warna tema teks di monitor',
        'Kecepatan mengetik keyboard',
        'Jumlah spasi di akhir halaman berkas'
      ],
      correctIndex: 0,
      explanation: 'Bahasa Python bersifat case-sensitive dan memerlukan tanda kurung yang tepat saat memanggil fungsi atau metode objek.'
    });
  } else {
    questions.push({
      id: `${material.id}_q2`,
      question: `Langkah awal apa yang paling tepat sebelum mulai menyusun solusi pada materi "${title}"?`,
      options: [
        'Melakukan dekomposisi (memecah masalah besar menjadi bagian-bagian langkah kecil yang teratur)',
        'Langsung menebak hasil akhir tanpa menganalisis instruksi',
        'Menyerah saat menemukan langkah yang sulit',
        'Menyusun instruksi secara terbalik tanpa urutan'
      ],
      correctIndex: 0,
      explanation: 'Dekomposisi adalah pilar berpikir komputasional pertama untuk menyederhanakan masalah kompleks menjadi langkah-langkah terkelola.'
    });
  }

  // Soal 3: Logika Algoritma & Alur Kerja
  questions.push({
    id: `${material.id}_q3`,
    question: `Bagaimana alur eksekusi logika yang baik dalam menyelesaikan tugas pada materi ini?`,
    options: [
      'Menetapkan kondisi awal (inisialisasi), menjalankan proses aksi langkah demi langkah, lalu mengevaluasi hasil',
      'Mengacak urutan perintah tanpa aturan tertentu',
      'Menjalankan perintah akhir sebelum kondisi awal disiapkan',
      'Menghentikan program sebelum instruksi pertama selesai'
    ],
    correctIndex: 0,
    explanation: 'Algoritma yang handal selalu mengikuti pola: Input/Inisialisasi -> Proses Komputasi -> Output/Hasil yang terverifikasi.'
  });

  // Soal 4: Skenario Pemecahan Masalah (Debugging & Problem Solving)
  questions.push({
    id: `${material.id}_q4`,
    question: `Jika hasil karya pada modul "${title}" belum berjalan sesuai yang diharapkan, tindakan apa yang sebaiknya kamu lakukan?`,
    options: [
      'Melakukan debugging dengan memeriksa urutan balok, nilai parameter angka, dan kondisi percabangan satu per satu',
      'Langsung menghapus seluruh proyek dan berhenti belajar',
      'Menyalahkan perangkat komputer tanpa memeriksa kodenya',
      'Mengabaikan kesalahan tersebut dan menganggapnya sudah selesai'
    ],
    correctIndex: 0,
    explanation: 'Sikap seorang programmer handal adalah teliti melakukan debugging: melacak baris logika instruksi untuk menemukan sumber ketidaksesuaian.'
  });

  // Soal 5: Indikator Capaian Belajar Siswa
  questions.push({
    id: `${material.id}_q5`,
    question: `Kamu dinyatakan telah berhasil menguasai materi ini apabila memenuhi indikator:`,
    options: [
      ind,
      'Menghabiskan waktu tanpa menghasilkan karya atau program',
      'Hanya menonton video tanpa mempraktikkannya langsung',
      'Menutup lembar materi sebelum membaca instruksinya'
    ],
    correctIndex: 0,
    explanation: `Indikator keberhasilan belajar pada modul ini adalah: ${ind}.`
  });

  // Soal 6: Refleksi Computational Thinking & Best Practice
  questions.push({
    id: `${material.id}_q6`,
    question: `Manfaat jangka panjang apa yang diperoleh siswa GenZi dari mempelajari materi "${title}"?`,
    options: [
      'Melatih pola pikir logis, kreatif, dan terstruktur dalam merancang inovasi teknologi masa depan',
      'Hanya untuk bermain game di waktu luang',
      'Agar dapat menghindari tugas sekolah lainnya',
      'Tidak ada manfaat nyata untuk kehidupan sehari-hari'
    ],
    correctIndex: 0,
    explanation: 'Literasi koding dan computational thinking melatih nalar kritis, ketekunan memecahkan masalah, dan kemampuan berkreasi dengan teknologi.'
  });

  return {
    materialId: material.id,
    title: `Post Test: ${title}`,
    passingScore: 60,
    xpReward: 75,
    questions
  };
}

/**
 * Mengambil kuis Post-Test interaktif untuk modul kurikulum tertentu.
 * Menjamin setiap materi memiliki 5 - 10 soal pilihan ganda berkualitas tinggi.
 */
export function getQuizForMaterial(material: Material): ModuleQuiz {
  if (SPECIFIC_MODULE_QUIZZES[material.id]) {
    return {
      materialId: material.id,
      ...SPECIFIC_MODULE_QUIZZES[material.id]
    };
  }

  return generateContextualQuiz(material);
}
