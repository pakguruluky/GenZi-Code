# 🚀 Panduan Deploy GenZi Code ke Vercel

Aplikasi **GenZi Code** telah dikonfigurasi secara lengkap untuk dapat langsung di-deploy ke **Vercel** dengan Single Page Application (SPA) routing yang aman, data asli dari Firebase Cloud Firestore, dan integrasi Google Sheets gratis.

---

## 📁 Berkas Konfigurasi yang Telah Disiapkan
1. `vercel.json`: Mengatur rewrite rule `/(.*) -> /index.html` dan security headers agar routing React tidak mengalami error 404 saat halaman di-refresh.
2. `.env.example`: Berisi daftar Environment Variables untuk Vercel.
3. `src/lib/firebase.ts`: Menggunakan Firebase credentials dengan fallback otomatis ke project `genzi-code`.

---

## ⚡ Langkah Cepat Deploy ke Vercel

### Opsi 1: Melalui Dashboard Vercel (Rekomendasi)
1. **Push kode** ke repository GitHub / GitLab / Bitbucket Anda.
2. Buka [vercel.com/new](https://vercel.com/new) dan klik **Import** pada repository project ini.
3. Pada halaman **Configure Project**:
   - **Framework Preset**: Pilih `Vite`
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. **Environment Variables**:
   Tambahkan variabel berikut di menu *Environment Variables* di Vercel:
   | Key | Value | Keterangan |
   |---|---|---|
   | `VITE_FIREBASE_API_KEY` | `AIzaSyB-2tojeBZzd6wMpYqNt2a-JAjdy13qFmo` | Firebase API Key |
   | `VITE_FIREBASE_AUTH_DOMAIN` | `genzi-code.firebaseapp.com` | Firebase Auth Domain |
   | `VITE_FIREBASE_PROJECT_ID` | `genzi-code` | Firebase Project ID |
   | `VITE_FIREBASE_STORAGE_BUCKET` | `genzi-code.firebasestorage.app` | Storage Bucket |
   | `VITE_FIREBASE_MESSAGING_SENDER_ID` | `427113407352` | Sender ID |
   | `VITE_FIREBASE_APP_ID` | `1:427113407352:web:346494697939e0749c1e8d` | App ID |
   | `VITE_GOOGLE_SHEETS_API_URL` | *(Opsional)* URL Google Apps Script Web App | Database Gratis Google Sheets |
5. Klik tombol **Deploy**. Aplikasi akan online dalam 1-2 menit dengan link `https://[project-name].vercel.app`!

---

### Opsi 2: Menggunakan Vercel CLI di Terminal
Jika menggunakan Vercel CLI pada komputer Anda:
```bash
# 1. Install Vercel CLI (jika belum ada)
npm i -g vercel

# 2. Login ke akun Vercel
vercel login

# 3. Deploy langsung ke Production
vercel --prod
```

---

## 📊 Database Asli & Google Sheets Gratis
1. **Firebase Firestore**: Menyimpan data user asli, status pendaftaran mandiri (pending/active), progress modul, dan proyek koding secara persisten.
2. **Google Sheets Database (Gratis)**:
   - Masuk ke tab **Database Google Sheets** di aplikasi.
   - Klik **Integrasi Google Sheets** untuk menyalin script Google Apps Script gratis.
   - Pasang script di spreadsheet Anda melalui **Ekstensi > Apps Script** lalu deploy sebagai **Web App**.
   - Masukkan URL Web App ke aplikasi untuk sinkronisasi otomatis 100% gratis!
