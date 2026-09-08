import React, { useRef, useState } from 'react';
import { UserAccount } from '../types';
import { ALL_MATERIALS } from '../data/curriculumData';
import {
  Award,
  Download,
  Printer,
  Share2,
  X,
  CheckCircle,
  ShieldCheck,
  Sparkles,
  QrCode,
  Copy,
  Check
} from 'lucide-react';

interface CertificateModalProps {
  student?: UserAccount | null;
  user?: UserAccount | null;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ student: propStudent, user: propUser, onClose }) => {
  const [copied, setCopied] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  const student = propStudent || propUser;

  if (!student) return null;

  const totalMaterials = ALL_MATERIALS.length;
  const completedCount = student.completedMaterialIds?.length || 0;
  const percentage = Math.min(100, Math.round((completedCount / (totalMaterials || 1)) * 100));

  // Determine Certificate Level
  let certLevel = 'SERTIFIKAT PENCAPAIAN KOMPETENSI';
  let certDescription = 'Telah menyelesaikan rangkaian modul pemrograman visual dan logika komputasi berjenjang.';
  let badgeColor = 'text-indigo-600 border-indigo-300 bg-indigo-50';

  if (percentage >= 100) {
    certLevel = 'SERTIFIKAT KELULUSAN UTAMA (EXCELLENCE)';
    certDescription = 'Telah berhasil menyelesaikan seluruh 54 Modul Kurikulum Pemrograman Mandiri, BBC Micro:bit IoT, dan PictoBlox Kecerdasan Buatan (AI) dengan predikat SANGAT MEMUASKAN (Cum Laude).';
    badgeColor = 'text-amber-600 border-amber-400 bg-amber-50';
  } else if (percentage >= 50) {
    certLevel = 'SERTIFIKAT KOMPETENSI TINGKAT MENENGAH';
    certDescription = 'Telah menunjukkan kecakapan tinggi dalam pemrograman logika Scratch, simulasi sirkuit cerdas Micro:bit, dan eksplorasi dasar Artificial Intelligence.';
    badgeColor = 'text-blue-600 border-blue-300 bg-blue-50';
  }

  const certNumber = `GZ-CERT-2026-${student.id.replace(/\D/g, '').padStart(6, '0').slice(-6)}`;
  const issueDate = student.approvedAt
    ? new Date(student.approvedAt).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCertificateHtml = () => {
    const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Sertifikat Resmi - ${student.name} - GenZi Code</title>
  <style>
    @page { size: A4 landscape; margin: 10mm; }
    body { font-family: 'Times New Roman', Georgia, serif; background: #f8fafc; margin: 0; padding: 20px; display: flex; justify-content: center; }
    .cert-frame { width: 1000px; max-width: 100%; background: #ffffff; border: 8px double #b45309; padding: 40px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); position: relative; text-align: center; }
    .header-logo { font-size: 14px; font-weight: bold; letter-spacing: 3px; color: #b45309; text-transform: uppercase; }
    .main-title { font-size: 34px; font-weight: 800; color: #0f172a; margin: 10px 0 5px; font-family: 'Helvetica Neue', Arial, sans-serif; letter-spacing: -0.5px; }
    .cert-num { font-size: 12px; color: #64748b; font-family: monospace; }
    .presented-to { font-size: 14px; color: #475569; margin: 25px 0 10px; font-style: italic; }
    .student-name { font-size: 36px; font-weight: bold; color: #1e3a8a; border-bottom: 2px solid #cbd5e1; display: inline-block; padding-bottom: 6px; margin-bottom: 10px; }
    .school-name { font-size: 15px; color: #334155; margin-bottom: 20px; font-weight: 600; }
    .cert-desc { font-size: 14px; color: #334155; max-width: 750px; margin: 0 auto 25px; line-height: 1.6; }
    .competency-tags { display: flex; justify-content: center; gap: 15px; margin-bottom: 25px; font-family: sans-serif; font-size: 12px; font-weight: bold; }
    .tag { padding: 6px 14px; border-radius: 6px; border: 1px solid #cbd5e1; background: #f1f5f9; }
    .signatures { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; }
    .sign-box { width: 220px; text-align: center; }
    .sign-name { font-size: 20px; font-style: italic; color: #1e293b; margin-bottom: 8px; font-weight: bold; }
    .sign-title { font-size: 11px; color: #64748b; border-top: 1px solid #94a3b8; padding-top: 4px; }
    .seal { width: 85px; height: 85px; border-radius: 50%; background: radial-gradient(circle, #f59e0b, #d97706); color: white; display: flex; flex-direction: column; align-items: center; justify-content: center; border: 3px dashed white; box-shadow: 0 4px 10px rgba(217,119,6,0.4); margin: 0 auto; }
    .seal span { font-size: 8px; font-weight: bold; letter-spacing: 1px; }
  </style>
</head>
<body>
  <div class="cert-frame">
    <div class="header-logo">GenZi Code Academy • Verified Learning Certification</div>
    <div class="main-title">${certLevel}</div>
    <div class="cert-num">Nomor Register: ${certNumber}</div>
    <div class="presented-to">Sertifikat ini secara resmi dianugerahkan kepada:</div>
    <div class="student-name">${student.name}</div>
    <div class="school-name">${student.school || 'GenZi Code Student'}</div>
    <div class="cert-desc">${certDescription}</div>
    <div class="competency-tags">
      <div class="tag">✓ Scratch 3.0 Logic</div>
      <div class="tag">✓ BBC Micro:bit IoT</div>
      <div class="tag">✓ PictoBlox AI & ML</div>
      <div class="tag">Capaian: ${completedCount}/${totalMaterials} Modul (${percentage}%)</div>
    </div>
    <div class="signatures">
      <div class="sign-box">
        <div class="sign-name">Pak GuruAI</div>
        <div class="sign-title"><strong>Pak GuruAI</strong><br>Founder & Master AI Instructor</div>
      </div>
      <div class="sign-box">
        <div class="seal">
          <span>GENZI CODE</span>
          <span style="font-size:10px; font-weight:900;">OFFICIAL</span>
          <span>SEAL</span>
        </div>
        <div style="font-size: 10px; color: #64748b; margin-top: 6px;">Tanggal: ${issueDate}</div>
      </div>
      <div class="sign-box">
        <div class="sign-name">Dimas Ardiansyah</div>
        <div class="sign-title"><strong>Dimas Ardiansyah, S.Kom.</strong><br>Kepala Kurikulum & Pembimbing</div>
      </div>
    </div>
  </div>
</body>
</html>`;
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Sertifikat_GenZi_Code_${student.name.replace(/\s+/g, '_')}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/?verify_cert=${certNumber}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto">
        {/* Action Header - Hidden during print */}
        <div className="no-print flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Sertifikat Digital Resmi Siswa
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Terverifikasi di Cloud Database GenZi Code
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin!' : 'Salin Tautan'}</span>
            </button>
            <button
              onClick={handleDownloadCertificateHtml}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors flex items-center gap-1.5"
              title="Unduh file sertifikat digital (.html) offline"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Unduh File Sertifikat</span>
              <span className="sm:hidden">Unduh</span>
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

        {/* Certificate Display Canvas */}
        <div className="p-4 sm:p-8 bg-slate-100 dark:bg-slate-950 flex justify-center">
          <div
            ref={certRef}
            className="w-full max-w-3xl bg-white text-slate-900 p-8 sm:p-12 rounded-xl shadow-lg border-8 border-double border-amber-600/60 relative overflow-hidden print:m-0 print:border-amber-600 print:shadow-none"
          >
            {/* Elegant Background Security Watermark */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] flex items-center justify-center">
              <span className="text-[120px] font-black uppercase tracking-widest text-slate-950 rotate-[-25deg]">
                GENZI CODE
              </span>
            </div>

            {/* Corner Decorative Ornaments */}
            <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-amber-600/80"></div>
            <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-amber-600/80"></div>
            <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-amber-600/80"></div>
            <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-amber-600/80"></div>

            {/* Certificate Header */}
            <div className="text-center relative z-10">
              <div className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-[11px] font-bold tracking-widest uppercase mb-2 border border-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-700" />
                AKADEMI KODING & KECERDASAN BUATAN GENZI CODE
              </div>

              <h1 className="text-2xl sm:text-4xl font-serif font-black tracking-tight text-slate-950 mt-1 uppercase">
                {certLevel}
              </h1>
              <p className="text-xs font-mono text-slate-500 mt-1 tracking-wider">
                Nomor Registrasi: <span className="font-bold text-slate-800">{certNumber}</span>
              </p>
            </div>

            {/* Recipient Section */}
            <div className="text-center my-8 relative z-10">
              <p className="text-xs text-slate-600 italic tracking-wide">
                Diberikan dengan bangga dan apresiasi setinggi-tingginya kepada:
              </p>
              <div className="my-3">
                <h2 className="text-2xl sm:text-4xl font-extrabold text-indigo-950 border-b-2 border-amber-500/50 inline-block pb-1 px-6 font-serif">
                  {student.name}
                </h2>
              </div>
              <p className="text-xs font-medium text-slate-600">
                {student.school || 'Pelajar Mandiri GenZi Code'}
              </p>
            </div>

            {/* Achievement Paragraph */}
            <div className="text-center max-w-xl mx-auto text-xs text-slate-700 leading-relaxed relative z-10">
              <p>{certDescription}</p>

              {/* Skills Achieved Chips */}
              <div className="flex flex-wrap items-center justify-center gap-2 my-5">
                <span className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 font-bold text-[11px]">
                  ✓ Scratch MIT (Visual Block Coding)
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold text-[11px]">
                  ✓ BBC Micro:bit (IoT & Physical Computing)
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 font-bold text-[11px]">
                  ✓ PictoBlox AI (Computer Vision & Machine Learning)
                </span>
              </div>

              <div className="inline-block px-4 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 font-semibold text-xs">
                Capaian Kurikulum: <strong className="text-indigo-700">{completedCount} dari {totalMaterials} Modul Selesai ({percentage}%)</strong>
              </div>
            </div>

            {/* Signatures & Verification Seal */}
            <div className="mt-10 pt-6 border-t border-slate-200 flex items-end justify-between gap-4 relative z-10">
              {/* Left Signatory: Pak GuruAI */}
              <div className="text-center w-48">
                <div className="h-14 flex items-center justify-center">
                  {/* Digital Signature Stylized */}
                  <span className="font-serif italic font-bold text-lg text-indigo-900 tracking-wider">
                    Pak GuruAI
                  </span>
                </div>
                <div className="border-t border-slate-400 pt-1">
                  <p className="font-bold text-xs text-slate-900">Pak GuruAI</p>
                  <p className="text-[10px] text-slate-500">Founder & Lead AI Instructor</p>
                </div>
              </div>

              {/* Center Official Gold Seal */}
              <div className="text-center flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-300 p-1 shadow-md flex items-center justify-center text-white relative">
                  <div className="w-full h-full rounded-full border-2 border-dashed border-white/80 flex flex-col items-center justify-center p-1 bg-amber-600/90 text-center">
                    <Sparkles className="w-4 h-4 text-amber-200" />
                    <span className="text-[8px] font-black uppercase tracking-tight leading-tight mt-0.5">
                      GENZI CODE
                    </span>
                    <span className="text-[7px] text-amber-100 font-mono">
                      VERIFIED
                    </span>
                  </div>
                </div>
                <span className="text-[9px] text-slate-400 font-mono mt-1">
                  Tgl Terbit: {issueDate}
                </span>
              </div>

              {/* Right Signatory: Instruktur Resmi */}
              <div className="text-center w-48">
                <div className="h-14 flex items-center justify-center">
                  <span className="font-serif italic font-semibold text-base text-slate-800">
                    Dimas Ardiansyah, S.Kom.
                  </span>
                </div>
                <div className="border-t border-slate-400 pt-1">
                  <p className="font-bold text-xs text-slate-900">Dimas Ardiansyah, S.Kom.</p>
                  <p className="text-[10px] text-slate-500">Kepala Kurikulum & Instruktur</p>
                </div>
              </div>
            </div>

            {/* Footer Notice */}
            <div className="mt-6 text-center text-[9px] text-slate-400 font-mono">
              Verifikasi keaslian sertifikat ini dapat dicek melalui portal GenZi Code • @copyright by. Pak GuruAI
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
