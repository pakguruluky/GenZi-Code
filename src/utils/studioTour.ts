import { driver, Driver } from 'driver.js';
import 'driver.js/dist/driver.css';

export interface StudioTourOptions {
  onComplete?: () => void;
  onCancel?: () => void;
  onRequestStudio?: (studioId: 'scratch' | 'microbit' | 'pictoblox' | 'codecombat') => void;
}

let activeTourInstance: Driver | null = null;

export const startStudioTour = (options?: StudioTourOptions): Driver => {
  // If active tour already exists, destroy it first
  if (activeTourInstance) {
    try {
      activeTourInstance.destroy();
    } catch {
      // ignore
    }
  }

  // Ensure Scratch studio is active if requested, as it contains all standard elements
  if (options?.onRequestStudio) {
    options.onRequestStudio('scratch');
  }

  const d = driver({
    showProgress: true,
    animate: true,
    allowClose: true,
    overlayColor: 'rgba(15, 23, 42, 0.75)',
    stagePadding: 8,
    stageRadius: 12,
    progressText: 'Langkah {{current}} dari {{total}}',
    nextBtnText: 'Lanjut →',
    prevBtnText: '← Kembali',
    doneBtnText: 'Selesai! 🎉',
    onDestroyStarted: () => {
      activeTourInstance = null;
      if (options?.onComplete) {
        options.onComplete();
      }
    },
    steps: [
      {
        element: '#tour-studio-selector',
        popover: {
          title: '🚀 4 Pilihan Studio Coding',
          description:
            'Pilih di antara 4 studio coding interaktif: Scratch 3.0 (animasi & game blok), BBC micro:bit (IoT & robotika), PictoBlox (AI & machine learning), atau CodeCombat (petualangan RPG teks Python/JS).',
          side: 'bottom',
          align: 'start'
        }
      },
      {
        element: '#tour-studio-mode',
        popover: {
          title: '⚡ Mode Tampilan Studio',
          description:
            'Kamu bisa beralih antara Studio Interaktif Live bawaan yang ringan & cepat, atau sematan Iframe langsung dari situs resmi studio.',
          side: 'bottom',
          align: 'center'
        }
      },
      {
        element: '#tour-scratch-topbar',
        popover: {
          title: '📁 Menu Berkas & Contoh Proyek',
          description:
            'Buka menu "Berkas" untuk memuat contoh siap pakai seperti "Kucing Berjalan" dan "Pantulan Bola", atau buat lembar proyek baru.',
          side: 'bottom',
          align: 'start'
        }
      },
      {
        element: '#tour-block-categories',
        popover: {
          title: '🎨 Kategori Balok Perintah',
          description:
            'Balok Scratch dikelompokkan dengan warna khas: Gerakan (Biru), Tampilan (Ungu), Suara (Magenta), Kejadian (Kuning), dan Kontrol (Oranye). Klik salah satu kategori untuk melihat balok di dalamnya.',
          side: 'right',
          align: 'start'
        }
      },
      {
        element: '#tour-block-palette',
        popover: {
          title: '🧩 Palet Balok Siap Pasang',
          description:
            'Cukup klik balok perintah mana saja di kolom ini untuk memasangnya langsung ke area skrip lembar kerja kodemu.',
          side: 'right',
          align: 'center'
        }
      },
      {
        element: '#tour-code-workspace',
        popover: {
          title: '📜 Area Skrip (Workspace)',
          description:
            'Susun logika programmu di sini! Kamu dapat mengubah angka (misalnya langkah gerak, detik jeda, atau teks ucapan), memindahkan urutan balok ke atas/bawah, atau menghapus balok yang tidak diperlukan.',
          side: 'left',
          align: 'center'
        }
      },
      {
        element: '#tour-run-controls',
        popover: {
          title: '⚑ Uji Coba Program Seketika',
          description:
            'Klik Bendera Hijau (⚑) untuk menjalankan urutan kode animasimu! Klik tombol Merah (🛑) kapan saja untuk menghentikan program.',
          side: 'bottom',
          align: 'center'
        }
      },
      {
        element: '#tour-stage-area',
        popover: {
          title: '🎭 Panggung Aksi Karakter (Stage)',
          description:
            'Lihat karakter spritemu bergerak, memantul, mengeluarkan suara audio meong/pop, dan menampilkan balon dialog sesuai kode yang kamu susun. Kamu juga dapat menyeret posisi karakter langsung dengan kursor!',
          side: 'left',
          align: 'start'
        }
      },
      {
        element: '#tour-sprite-properties',
        popover: {
          title: '⚙️ Kendali Properti Sprite',
          description:
            'Pantau dan sesuaikan posisi koordinat X & Y sprite di panggung, ukuran persentase, arah hadap sudut, serta tombol sembunyikan/tampilkan sprite.',
          side: 'top',
          align: 'center'
        }
      },
      {
        element: '#tour-sprite-backdrop-pane',
        popover: {
          title: '🐾 Pilih Karakter & Latar Panggung',
          description:
            'Ganti karakter spritemu (Kucing Scratch, Anjing Corgi, Robot GenZi, Bintang) dan latar belakang panggung (Panggung Putih, Lapangan, Antariksa, Bawah Laut) agar kreasimu makin menarik!',
          side: 'top',
          align: 'end'
        }
      },
      {
        element: '#tour-cloud-save',
        popover: {
          title: '☁️ Simpan Karyamu ke Cloud Database',
          description:
            'Beri nama kreasimu lalu klik "Simpan ke Cloud" agar karyamu aman tersimpan di cloud database dan dapat kamu buka kembali kapan saja!',
          side: 'bottom',
          align: 'center'
        }
      }
    ]
  });

  activeTourInstance = d;
  d.drive();
  return d;
};

export const cancelStudioTour = () => {
  if (activeTourInstance) {
    try {
      activeTourInstance.destroy();
    } catch {
      // ignore
    }
    activeTourInstance = null;
  }
};
