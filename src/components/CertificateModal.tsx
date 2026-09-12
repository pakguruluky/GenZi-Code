import React, { useRef, useState } from 'react';
import { UserAccount, JenjangCertificate } from '../types';
import { JENJANG_DEFINITIONS, getMaterialsForJenjang } from '../data/jenjangData';
import { useApp } from '../context/AppContext';
import {
  Award,
  Download,
  Printer,
  X,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Copy,
  Check,
  Code2,
  Cpu,
  Bot,
  Swords,
  Lock,
  ChevronRight,
  ArrowLeft,
  ExternalLink,
  Flame,
  Calendar,
  School,
  FileCheck
} from 'lucide-react';

interface CertificateModalProps {
  student?: UserAccount | null;
  user?: UserAccount | null;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  student: propStudent,
  user: propUser,
  onClose
}) => {
  const {
    currentUser,
    getJenjangProgress,
    generateJenjangCertificate,
    selectedJenjangCertificate,
    setSelectedJenjangCertificate
  } = useApp();

  const [copied, setCopied] = useState(false);
  const [generatingJenjangId, setGeneratingJenjangId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'view' | 'list'>(() => {
    return selectedJenjangCertificate ? 'view' : 'list';
  });
  const [currentCert, setCurrentCert] = useState<JenjangCertificate | null>(selectedJenjangCertificate || null);

  const certRef = useRef<HTMLDivElement>(null);
  const student = propStudent || propUser || currentUser;

  if (!student) return null;

  const handleSelectCertToView = (cert: JenjangCertificate) => {
    setCurrentCert(cert);
    setSelectedJenjangCertificate(cert);
    setActiveTab('view');
  };

  const handleGenerateCertificate = async (jenjangId: string) => {
    setGeneratingJenjangId(jenjangId);
    try {
      const res = await generateJenjangCertificate(jenjangId, student);
      if (res.success && res.certificate) {
        setCurrentCert(res.certificate);
        setActiveTab('view');
      }
    } finally {
      setGeneratingJenjangId(null);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    if (!currentCert) return;
    const url = currentCert.verificationUrl || `${window.location.origin}/?verify_cert=${currentCert.certificateNumber}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadHtml = () => {
    if (!currentCert) return;

    const formattedDate = new Date(currentCert.issuedAt).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const competencyHtml = currentCert.competencyList
      .map(comp => `<li style="margin-bottom: 6px;">✓ ${comp}</li>`)
      .join('');

    const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Sertifikat Kelulusan Resmi - ${currentCert.studentName} - ${currentCert.jenjangTitle}</title>
  <style>
    @page { size: A4 landscape; margin: 8mm; }
    body { font-family: 'Times New Roman', Georgia, serif; background: #f8fafc; margin: 0; padding: 20px; display: flex; justify-content: center; }
    .cert-frame { width: 1020px; max-width: 100%; background: #ffffff; border: 10px double #b45309; padding: 45px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); position: relative; text-align: center; }
    .header-logo { font-size: 13px; font-weight: bold; letter-spacing: 3px; color: #b45309; text-transform: uppercase; font-family: sans-serif; }
    .main-title { font-size: 30px; font-weight: 900; color: #0f172a; margin: 12px 0 6px; font-family: 'Helvetica Neue', Arial, sans-serif; letter-spacing: -0.5px; }
    .cert-num { font-size: 12px; color: #64748b; font-family: monospace; }
    .presented-to { font-size: 14px; color: #475569; margin: 20px 0 8px; font-style: italic; }
    .student-name { font-size: 36px; font-weight: bold; color: #1e3a8a; border-bottom: 2px solid #cbd5e1; display: inline-block; padding-bottom: 6px; margin-bottom: 8px; }
    .school-name { font-size: 15px; color: #334155; margin-bottom: 16px; font-weight: 600; font-family: sans-serif; }
    .cert-desc { font-size: 14px; color: #334155; max-width: 780px; margin: 0 auto 20px; line-height: 1.6; }
    .competency-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 20px; max-width: 780px; margin: 0 auto 20px; text-align: left; font-family: sans-serif; font-size: 12px; color: #334155; }
    .competency-box ul { list-style: none; padding-left: 0; margin: 0; }
    .meta-tags { display: flex; justify-content: center; gap: 12px; margin-bottom: 25px; font-family: sans-serif; font-size: 12px; font-weight: bold; }
    .tag { padding: 5px 14px; border-radius: 6px; border: 1px solid #cbd5e1; background: #f1f5f9; color: #1e293b; }
    .signatures { display: flex; justify-content: space-around; align-items: flex-end; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; }
    .sign-box { width: 240px; text-align: center; }
    .sign-name { font-size: 22px; font-style: italic; color: #1e293b; margin-bottom: 6px; font-weight: bold; font-family: serif; }
    .sign-title { font-size: 11px; color: #64748b; border-top: 1px solid #94a3b8; padding-top: 4px; font-family: sans-serif; }
    .seal { width: 85px; height: 85px; border-radius: 50%; background: radial-gradient(circle, #f59e0b, #d97706); color: white; display: flex; flex-direction: column; align-items: center; justify-content: center; border: 3px dashed white; box-shadow: 0 4px 10px rgba(217,119,6,0.4); margin: 0 auto; font-family: sans-serif; }
    .seal span { font-size: 8px; font-weight: bold; letter-spacing: 1px; }
  </style>
</head>
<body>
  <div class="cert-frame">
    <div class="header-logo">GenZi Code Academy • Terverifikasi Cloud Database Firestore</div>
    <div class="main-title">${currentCert.jenjangTitle}</div>
    <div class="cert-num">Nomor Registrasi: ${currentCert.certificateNumber}</div>
    <div class="presented-to">Sertifikat Resmi Kompetensi ini dianugerahkan kepada:</div>
    <div class="student-name">${currentCert.studentName}</div>
    <div class="school-name">${currentCert.school || 'Pelajar Mandiri GenZi Code'}</div>
    <div class="cert-desc">
      Telah berhasil menyelesaikan seluruh evaluasi modul pembelajaran dan lulus Post Test dengan predikat memuaskan pada jenjang kurikulum <strong>${currentCert.jenjangTitle}</strong>.
    </div>

    <div class="competency-box">
      <div style="font-weight: bold; margin-bottom: 6px; color: #0f172a; text-transform: uppercase; font-size: 11px; letter-spacing: 1px;">
        Kompetensi yang Dicapai & Diverifikasi:
      </div>
      <ul>
        ${competencyHtml}
      </ul>
    </div>

    <div class="meta-tags">
      <div class="tag">✓ Modul Tuntas: ${currentCert.completedMaterials}/${currentCert.totalMaterials}</div>
      <div class="tag">✓ Rata-rata Skor Evaluasi: ${currentCert.averageQuizScore}%</div>
      <div class="tag">✓ Kode Verifikasi: ${currentCert.verificationCode}</div>
    </div>

    <div class="signatures">
      <div class="sign-box">
        <div class="seal">
          <span>GENZI CODE</span>
          <span style="font-size:10px; font-weight:900;">VERIFIED</span>
          <span>FIRESTORE</span>
        </div>
        <div style="font-size: 10px; color: #64748b; margin-top: 6px; font-family: sans-serif;">Tanggal Terbit: ${formattedDate}</div>
      </div>
      <div class="sign-box">
        <div class="sign-name">${currentCert.instructorName}</div>
        <div class="sign-title"><strong>${currentCert.instructorName}</strong><br>${currentCert.instructorTitle}</div>
      </div>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Sertifikat_${currentCert.jenjangCode}_${currentCert.studentName.replace(/\s+/g, '_')}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getJenjangIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code2':
        return <Code2 className="w-5 h-5" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5" />;
      case 'Bot':
        return <Bot className="w-5 h-5" />;
      case 'Swords':
        return <Swords className="w-5 h-5" />;
      case 'Award':
      default:
        return <Award className="w-5 h-5" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Navigation & Action Header */}
        <div className="no-print flex items-center justify-between px-5 sm:px-8 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 shrink-0">
          <div className="flex items-center gap-3">
            {activeTab === 'view' && (
              <button
                onClick={() => setActiveTab('list')}
                className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors inline-flex items-center gap-1.5 text-xs font-semibold"
                title="Kembali ke Daftar Jenjang"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Daftar Jenjang</span>
              </button>
            )}

            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                {activeTab === 'view' ? 'Sertifikat Kelulusan Resmi Jenjang' : 'Pusat Sertifikasi Jenjang Belajar'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Siswa: <span className="font-semibold text-slate-700 dark:text-slate-200">{student.name}</span> • Terhubung Cloud Firestore
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'view' && currentCert && (
              <>
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">{copied ? 'Tersalin!' : 'Salin Tautan'}</span>
                </button>
                <button
                  onClick={handleDownloadHtml}
                  className="px-3 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors flex items-center gap-1.5"
                  title="Unduh file sertifikat digital (.html)"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Unduh File</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak / PDF</span>
                </button>
              </>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Scrollable */}
        <div className="overflow-y-auto p-4 sm:p-6 bg-slate-100/60 dark:bg-slate-950 flex-1">
          {activeTab === 'list' ? (
            /* TAB: LIST ALL 5 JENJANG CARDS */
            <div className="max-w-4xl mx-auto space-y-5">
              {/* Introduction Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white shadow-md relative overflow-hidden">
                <div className="relative z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-[11px] font-bold tracking-wider uppercase mb-2 border border-white/15 text-amber-300">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    Sertifikasi Resmi GenZi Code
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                    Sertifikat Kelulusan Berjenjang
                  </h2>
                  <p className="text-xs sm:text-sm text-indigo-200 mt-1 max-w-2xl leading-relaxed">
                    Selesaikan seluruh materi dalam satu jenjang dan lulus Post Test (skor minimal 60%) untuk membuka tombol <strong>"Generate Sertifikat"</strong>. Sertifikat resmi akan langsung diterbitkan dan tersimpan secara permanen di database Cloud Firestore.
                  </p>
                </div>
              </div>

              {/* Grid of Jenjang Tracks */}
              <div className="grid grid-cols-1 gap-4">
                {JENJANG_DEFINITIONS.map(jenjang => {
                  const progress = getJenjangProgress(jenjang.id, student);
                  const isGenerating = generatingJenjangId === jenjang.id;
                  const hasCertificate = !!progress.certificate;

                  return (
                    <div
                      key={jenjang.id}
                      className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border transition-all shadow-xs hover:shadow-md ${
                        hasCertificate
                          ? 'border-emerald-300 dark:border-emerald-800/80 bg-gradient-to-br from-white via-white to-emerald-50/20 dark:from-slate-900 dark:to-emerald-950/20'
                          : progress.isCompleted
                          ? 'border-amber-400 dark:border-amber-700 bg-gradient-to-br from-white via-white to-amber-50/30 dark:from-slate-900 dark:to-amber-950/20'
                          : 'border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-3.5">
                          <div
                            className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${jenjang.gradient} text-white flex items-center justify-center shrink-0 shadow-sm`}
                          >
                            {getJenjangIcon(jenjang.iconName)}
                          </div>

                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${jenjang.badgeBg}`}>
                                {jenjang.levelBadge}
                              </span>
                              <span className="text-xs font-mono text-slate-400">
                                Kode: {jenjang.code}
                              </span>
                              {hasCertificate && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-black border border-emerald-300 dark:border-emerald-800">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Tersimpan di Firestore
                                </span>
                              )}
                            </div>

                            <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                              {jenjang.title}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-xl">
                              {jenjang.subtitle}
                            </p>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="shrink-0 flex items-center gap-2 self-end sm:self-center">
                          {hasCertificate ? (
                            <button
                              onClick={() => handleSelectCertToView(progress.certificate!)}
                              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs hover:shadow-md transition-all inline-flex items-center gap-1.5"
                            >
                              <FileCheck className="w-4 h-4" />
                              <span>Lihat Sertifikat Resmi</span>
                            </button>
                          ) : progress.isCompleted ? (
                            <button
                              onClick={() => handleGenerateCertificate(jenjang.id)}
                              disabled={isGenerating}
                              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-extrabold text-xs shadow-md hover:shadow-lg transition-all inline-flex items-center gap-1.5 animate-pulse disabled:opacity-50"
                            >
                              <Sparkles className="w-4 h-4" />
                              <span>{isGenerating ? 'Menyimpan ke Firestore...' : 'Generate Sertifikat (+250 XP)'}</span>
                            </button>
                          ) : (
                            <div className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-semibold text-xs inline-flex items-center gap-1.5 border border-slate-200 dark:border-slate-700">
                              <Lock className="w-3.5 h-3.5 text-slate-400" />
                              <span>{progress.totalCount - progress.completedCount} Modul Tersisa</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Progress Bar & Stats */}
                      <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800/80">
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="font-semibold text-slate-600 dark:text-slate-400">
                            Progres Jenjang: {progress.completedCount} dari {progress.totalCount} Modul Tuntas
                          </span>
                          <span className="font-extrabold text-slate-800 dark:text-slate-200">
                            {progress.percentage}%
                          </span>
                        </div>

                        <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${jenjang.gradient}`}
                            style={{ width: `${progress.percentage}%` }}
                          />
                        </div>

                        {/* Extra detail info */}
                        <div className="flex flex-wrap items-center justify-between gap-2 mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                          <span>
                            Rata-rata Nilai Post Test: <strong className="text-slate-700 dark:text-slate-300">{progress.averageScore}%</strong>
                          </span>
                          {hasCertificate && (
                            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                              No. Reg: {progress.certificate?.certificateNumber}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* TAB: INDIVIDUAL OFFICIAL CERTIFICATE VIEW */
            currentCert && (
              <div className="flex flex-col items-center justify-center">
                <div
                  ref={certRef}
                  className="w-full max-w-4xl bg-white text-slate-900 p-8 sm:p-12 rounded-2xl shadow-xl border-8 border-double border-amber-600/70 relative overflow-hidden print:m-0 print:border-amber-600 print:shadow-none"
                >
                  {/* Watermark */}
                  <div className="absolute inset-0 pointer-events-none opacity-[0.03] flex items-center justify-center">
                    <span className="text-[120px] font-black uppercase tracking-widest text-slate-950 rotate-[-25deg]">
                      GENZI CODE
                    </span>
                  </div>

                  {/* Corner Ornaments */}
                  <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-amber-600/80"></div>
                  <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-amber-600/80"></div>
                  <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-amber-600/80"></div>
                  <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-amber-600/80"></div>

                  {/* Certificate Header */}
                  <div className="text-center relative z-10">
                    <div className="inline-flex items-center justify-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 text-slate-800 text-[11px] font-bold tracking-widest uppercase mb-2 border border-slate-300">
                      <ShieldCheck className="w-4 h-4 text-indigo-700" />
                      AKADEMI KODING & KECERDASAN BUATAN GENZI CODE
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-slate-950 mt-1 uppercase">
                      {currentCert.jenjangTitle}
                    </h1>
                    <p className="text-xs font-mono text-slate-500 mt-1 tracking-wider">
                      Nomor Registrasi Resmi: <span className="font-bold text-slate-800">{currentCert.certificateNumber}</span>
                    </p>
                  </div>

                  {/* Recipient Section */}
                  <div className="text-center my-6 relative z-10">
                    <p className="text-xs text-slate-600 italic tracking-wide">
                      Sertifikat kelulusan kompetensi ini dengan bangga dianugerahkan kepada:
                    </p>
                    <div className="my-2.5">
                      <h2 className="text-2xl sm:text-4xl font-extrabold text-indigo-950 border-b-2 border-amber-500/50 inline-block pb-1 px-8 font-serif">
                        {currentCert.studentName}
                      </h2>
                    </div>
                    <p className="text-xs font-semibold text-slate-600">
                      {currentCert.school || 'Pelajar Mandiri GenZi Code'}
                    </p>
                  </div>

                  {/* Achievement & Competency Points */}
                  <div className="text-center max-w-2xl mx-auto text-xs text-slate-700 leading-relaxed relative z-10">
                    <p className="mb-4">
                      Telah berhasil menyelesaikan seluruh rangkaian materi kurikulum berjenjang dan lulus evaluasi Post Test dengan capaian kompetensi terverifikasi sebagai berikut:
                    </p>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-left text-[11px] text-slate-700 space-y-1.5 mb-4">
                      {currentCert.competencyList?.map((c, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{c}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-2 my-3">
                      <div className="px-3 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-900 font-bold text-xs">
                        Modul Tuntas: {currentCert.completedMaterials} dari {currentCert.totalMaterials}
                      </div>
                      <div className="px-3 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 font-bold text-xs">
                        Rata-rata Skor: {currentCert.averageQuizScore}%
                      </div>
                      <div className="px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold text-xs">
                        Bonus Poin: +{currentCert.xpEarned} XP
                      </div>
                    </div>
                  </div>

                  {/* Signatures & Seal */}
                  <div className="mt-8 pt-6 border-t border-slate-200 flex items-end justify-around gap-6 relative z-10">
                    {/* Seal */}
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
                        Diterbitkan: {new Date(currentCert.issuedAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </div>

                    {/* Instructor Signature */}
                    <div className="text-center w-56">
                      <div className="h-14 flex items-center justify-center">
                        <span className="font-serif italic font-bold text-xl text-indigo-900 tracking-wider">
                          {currentCert.instructorName}
                        </span>
                      </div>
                      <div className="border-t border-slate-400 pt-1">
                        <p className="font-bold text-sm text-slate-900">{currentCert.instructorName}</p>
                        <p className="text-[11px] text-slate-500 font-medium">{currentCert.instructorTitle}</p>
                      </div>
                    </div>
                  </div>

                  {/* Verification Footer */}
                  <div className="mt-5 text-center text-[9px] text-slate-400 font-mono">
                    Kode Verifikasi: {currentCert.verificationCode} • Keaslian sertifikat tersimpan aman di Cloud Firestore Backend GenZi Code
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
