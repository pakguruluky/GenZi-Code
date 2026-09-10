import React, { useState } from 'react';
import { UserAccount } from '../types';
import { ALL_MATERIALS } from '../data/curriculumData';
import {
  FileSpreadsheet,
  Download,
  Printer,
  X,
  CheckCircle2,
  Clock,
  Award,
  BookOpen,
  Sparkles,
  Code2,
  Cpu,
  Bot,
  Copy,
  Check
} from 'lucide-react';

interface ProgressReportModalProps {
  student?: UserAccount | null;
  user?: UserAccount | null;
  onClose: () => void;
}

export const ProgressReportModal: React.FC<ProgressReportModalProps> = ({ student: propStudent, user: propUser, onClose }) => {
  const [copiedHtml, setCopiedHtml] = useState(false);

  const student = propStudent || propUser;

  if (!student) return null;

  const totalMaterials = ALL_MATERIALS.length;
  const completedCount = student.completedMaterialIds?.length || 0;
  const percentage = Math.min(100, Math.round((completedCount / (totalMaterials || 1)) * 100));

  // Calculate category breakdowns
  const scratchTotal = ALL_MATERIALS.filter(m => m.category === 'Scratch').length;
  const scratchDone = ALL_MATERIALS.filter(
    m => m.category === 'Scratch' && student.completedMaterialIds.includes(m.id)
  ).length;

  const microbitTotal = ALL_MATERIALS.filter(
    m => m.category === 'Microbit' || m.category === 'MakeCode Arcade'
  ).length;
  const microbitDone = ALL_MATERIALS.filter(
    m =>
      (m.category === 'Microbit' || m.category === 'MakeCode Arcade') &&
      student.completedMaterialIds.includes(m.id)
  ).length;

  const aiTotal = ALL_MATERIALS.filter(m => m.category === 'Pictoblox').length;
  const aiDone = ALL_MATERIALS.filter(
    m => m.category === 'Pictoblox' && student.completedMaterialIds.includes(m.id)
  ).length;

  // Predikat
  let grade = 'A (Sangat Baik)';
  let notes =
    'Siswa menunjukkan konsistensi luar biasa dalam menyelesaikan materi berjenjang, logika komputasi yang tajam, dan antusiasme tinggi terhadap eksplorasi AI.';
  if (percentage < 30) {
    grade = 'B (Cukup / Dalam Proses)';
    notes =
      'Siswa sedang dalam tahap pondasi pengenalan logika blok dasar Scratch. Disarankan untuk menambah frekuensi latihan di Scratch Studio.';
  } else if (percentage < 70) {
    grade = 'A- (Baik & Berkembang)';
    notes =
      'Siswa menguasai konsep sekuensial dan perulangan dengan baik. Telah siap melanjutkan eksplorasi sensor fisik Micro:bit dan algoritma AI PictoBlox.';
  }

  const studentRegDate = new Date(student.registeredAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const reportDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Generate clean standalone HTML document content
  const generateStandaloneHtml = (): string => {
    return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Laporan Progres Belajar - ${student.name} - GenZi Code</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      background-color: #f8fafc;
      color: #0f172a;
      line-height: 1.6;
      padding: 30px 15px;
    }
    .container {
      max-width: 850px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 40px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }
    .header {
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 20px;
      margin-bottom: 25px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .brand-title {
      font-size: 24px;
      font-weight: 800;
      color: #312e81;
    }
    .brand-subtitle {
      font-size: 13px;
      color: #64748b;
      margin-top: 2px;
    }
    .badge-report {
      background: #eff6ff;
      color: #1d4ed8;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 700;
      border: 1px solid #bfdbfe;
      text-transform: uppercase;
    }
    .bio-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      background: #f1f5f9;
      padding: 20px;
      border-radius: 12px;
      margin-bottom: 30px;
    }
    .bio-item span {
      display: block;
      font-size: 11px;
      text-transform: uppercase;
      font-weight: 700;
      color: #64748b;
    }
    .bio-item strong {
      font-size: 15px;
      color: #0f172a;
    }
    .stat-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 15px;
      margin-bottom: 30px;
    }
    .stat-box {
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 16px;
      text-align: center;
    }
    .stat-box.highlight {
      background: #faf5ff;
      border-color: #d8b4fe;
    }
    .stat-val {
      font-size: 28px;
      font-weight: 800;
      color: #4338ca;
    }
    .stat-label {
      font-size: 12px;
      font-weight: 600;
      color: #64748b;
      margin-top: 4px;
    }
    .progress-bar-container {
      background: #e2e8f0;
      height: 12px;
      border-radius: 6px;
      overflow: hidden;
      margin: 10px 0 25px;
    }
    .progress-bar-fill {
      background: linear-gradient(90deg, #4f46e5, #06b6d4, #10b981);
      height: 100%;
      border-radius: 6px;
      width: ${percentage}%;
    }
    .section-title {
      font-size: 16px;
      font-weight: 800;
      color: #1e293b;
      margin: 25px 0 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
      margin-top: 10px;
    }
    th {
      background: #f8fafc;
      color: #475569;
      font-weight: 700;
      text-align: left;
      padding: 10px;
      border-bottom: 2px solid #cbd5e1;
    }
    td {
      padding: 8px 10px;
      border-bottom: 1px solid #e2e8f0;
    }
    .status-done {
      color: #059669;
      font-weight: 700;
    }
    .status-locked {
      color: #94a3b8;
    }
    .notes-box {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 12px;
      padding: 20px;
      margin-top: 30px;
    }
    .notes-box h4 {
      color: #166534;
      font-size: 14px;
      font-weight: 800;
      margin-bottom: 8px;
    }
    .notes-box p {
      color: #15803d;
      font-size: 13px;
    }
    .sign-row {
      display: flex;
      justify-content: flex-end;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
    }
    .sign-box {
      text-align: center;
      width: 220px;
    }
    .sign-line {
      margin-top: 50px;
      border-top: 1px solid #64748b;
      padding-top: 5px;
      font-weight: 700;
      font-size: 12px;
    }
    .footer-text {
      text-align: center;
      font-size: 11px;
      color: #94a3b8;
      margin-top: 40px;
    }
    @media print {
      body { background: #ffffff; padding: 0; }
      .container { border: none; box-shadow: none; padding: 20px; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div>
        <div class="brand-title">GENZI CODE ACADEMY</div>
        <div class="brand-subtitle">Platform Belajar Coding & Kecerdasan Buatan Mandiri Berjenjang</div>
      </div>
      <div class="badge-report">Rapor Hasil Belajar</div>
    </div>

    <div class="bio-grid">
      <div class="bio-item">
        <span>Nama Lengkap Siswa</span>
        <strong>${student.name}</strong>
      </div>
      <div class="bio-item">
        <span>Asal Sekolah / Lembaga</span>
        <strong>${student.school || 'GenZi Member'}</strong>
      </div>
      <div class="bio-item">
        <span>ID / Email Siswa</span>
        <strong>${student.email}</strong>
      </div>
      <div class="bio-item">
        <span>Tanggal Pendaftaran</span>
        <strong>${studentRegDate}</strong>
      </div>
    </div>

    <div class="stat-row">
      <div class="stat-box highlight">
        <div class="stat-val">${percentage}%</div>
        <div class="stat-label">Persentase Capaian</div>
      </div>
      <div class="stat-box">
        <div class="stat-val">${completedCount} / ${totalMaterials}</div>
        <div class="stat-label">Modul Terselesaikan</div>
      </div>
      <div class="stat-box">
        <div class="stat-val">${grade.split(' ')[0]}</div>
        <div class="stat-label">Predikat Capaian</div>
      </div>
      <div class="stat-box">
        <div class="stat-val">${completedCount * 2} Jam</div>
        <div class="stat-label">Waktu Efektif Belajar</div>
      </div>
    </div>

    <div class="progress-bar-container">
      <div class="progress-bar-fill"></div>
    </div>

    <div class="section-title">📊 Capaian Berdasarkan Domain Kompetensi</div>
    <table>
      <thead>
        <tr>
          <th>Domain Materi</th>
          <th>Total Modul</th>
          <th>Modul Selesai</th>
          <th>Status Penguasaan</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Scratch MIT (Visual Block & Logic)</strong></td>
          <td>${scratchTotal} Modul</td>
          <td>${scratchDone} Selesai</td>
          <td>${Math.round((scratchDone / (scratchTotal || 1)) * 100)}% Dikuasai</td>
        </tr>
        <tr>
          <td><strong>Micro:bit (IoT & Physical Computing)</strong></td>
          <td>${microbitTotal} Modul</td>
          <td>${microbitDone} Selesai</td>
          <td>${Math.round((microbitDone / (microbitTotal || 1)) * 100)}% Dikuasai</td>
        </tr>
        <tr>
          <td><strong>PictoBlox AI (Computer Vision & Machine Learning)</strong></td>
          <td>${aiTotal} Modul</td>
          <td>${aiDone} Selesai</td>
          <td>${Math.round((aiDone / (aiTotal || 1)) * 100)}% Dikuasai</td>
        </tr>
      </tbody>
    </table>

    <div class="notes-box">
      <h4>Catatan Evaluasi & Umpan Balik Kepala Instruktur (Pak Guru Luky):</h4>
      <p>${notes}</p>
    </div>

    <div class="sign-row">
      <div class="sign-box">
        <div>Pusat Akademik, ${reportDate}</div>
        <div class="sign-line">
          Pak Guru Luky<br>
          <span style="font-size:10px; font-weight:normal; color:#64748b;">Kepala Instruktur & Founder</span>
        </div>
      </div>
    </div>

    <div class="footer-text">
      Laporan ini digenerate secara otomatis oleh sistem GenZi Code • @copyright by. Pak GuruAI
    </div>
  </div>
</body>
</html>`;
  };

  const handleDownloadHtml = () => {
    const htmlContent = generateStandaloneHtml();
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Rapor_GenZi_Code_${student.name.replace(/\s+/g, '_')}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyHtml = () => {
    const htmlContent = generateStandaloneHtml();
    navigator.clipboard.writeText(htmlContent);
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Top Bar */}
        <div className="no-print flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Progres Report Siswa (Format HTML)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Rapor Capaian Belajar Mandiri & Berjenjang GenZi Code
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyHtml}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5"
            >
              {copiedHtml ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedHtml ? 'HTML Disalin' : 'Salin Kode HTML'}</span>
            </button>

            <button
              onClick={handleDownloadHtml}
              className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh File .html</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Report Preview Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100 dark:bg-slate-950">
          <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-10 shadow-sm print:p-0 print:border-none">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800 gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-indigo-900 dark:text-indigo-400 tracking-tight">
                    GENZI CODE ACADEMY
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800">
                    Official
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Platform Belajar Coding Mandiri & Berjenjang dengan Studio Scratch, Micro:bit, dan PictoBlox AI
                </p>
              </div>

              <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                Rapor Kemajuan Belajar
              </div>
            </div>

            {/* Student Bio Grid */}
            <div className="my-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                  Nama Siswa
                </span>
                <p className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">
                  {student.name}
                </p>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                  Sekolah / Lembaga
                </span>
                <p className="font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                  {student.school || 'GenZi Member'}
                </p>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                  ID Siswa / Email
                </span>
                <p className="font-mono text-slate-600 dark:text-slate-400 truncate mt-0.5">
                  {student.email}
                </p>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                  Status Akun
                </span>
                <p className="font-semibold text-emerald-700 dark:text-emerald-400 capitalize mt-0.5">
                  {student.status} ({student.role})
                </p>
              </div>
            </div>

            {/* Metrics Overview Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
              <div className="p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/50 dark:bg-indigo-950/30 text-center">
                <span className="text-2xl sm:text-3xl font-black text-indigo-700 dark:text-indigo-400">
                  {percentage}%
                </span>
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-1">
                  Persentase Capaian
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-center">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {completedCount}
                </span>
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-1">
                  Modul Selesai (/54)
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-center">
                <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                  {grade.split(' ')[0]}
                </span>
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-1">
                  Predikat Hasil
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-center">
                <span className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">
                  {completedCount * 2} Jam
                </span>
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-1">
                  Waktu Belajar Efektif
                </p>
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="my-6">
              <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                <span>Total Kemajuan Kurikulum Berjenjang (54 Modul)</span>
                <span>{percentage}% Selesai</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-600 via-blue-500 to-emerald-500 transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>

            {/* Domain Mastery Breakdown */}
            <div className="my-6">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                Capaian Domain Pembelajaran
              </h4>
              <div className="space-y-3 text-xs">
                {/* Scratch */}
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                      <Code2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">
                        Scratch MIT (Visual Block Coding)
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {scratchDone} dari {scratchTotal} modul diselesaikan
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {Math.round((scratchDone / (scratchTotal || 1)) * 100)}%
                  </span>
                </div>

                {/* Microbit */}
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">
                        BBC Micro:bit MakeCode (IoT & Physical Computing)
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {microbitDone} dari {microbitTotal} modul diselesaikan
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {Math.round((microbitDone / (microbitTotal || 1)) * 100)}%
                  </span>
                </div>

                {/* PictoBlox AI */}
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">
                        PictoBlox AI (Computer Vision & Machine Learning)
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {aiDone} dari {aiTotal} modul diselesaikan
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {Math.round((aiDone / (aiTotal || 1)) * 100)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Evaluator Notes */}
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 my-6">
              <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Catatan Bimbingan & Evaluasi Kepala Instruktur (Pak Guru Luky):
              </h4>
              <p className="text-xs text-emerald-800 dark:text-emerald-200 leading-relaxed">
                {notes}
              </p>
            </div>

            {/* Signatures */}
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex items-end justify-end text-xs text-slate-600 dark:text-slate-400">
              <div className="text-center min-w-[200px]">
                <p className="text-[11px]">Pusat Akademik, {reportDate}</p>
                <div className="h-10"></div>
                <p className="font-bold text-slate-900 dark:text-white border-t border-slate-300 dark:border-slate-700 pt-1">Pak Guru Luky</p>
                <p className="text-[10px] text-slate-500">Kepala Instruktur & Founder</p>
              </div>
            </div>

            {/* Footer Copyright */}
            <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-center text-[10px] text-slate-400 dark:text-slate-500">
              © {new Date().getFullYear()} GenZi Code • @copyright by. Pak GuruAI
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
