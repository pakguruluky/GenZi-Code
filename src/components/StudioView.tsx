import React, { useState } from 'react';
import { STUDIOS } from '../data/curriculumData';
import { StudioItem } from '../types';
import {
  ExternalLink,
  Laptop,
  Code2,
  Cpu,
  Bot,
  Maximize2,
  Minimize2,
  Sparkles,
  CheckCircle2,
  Sliders
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ScratchLiveStudio } from './studios/ScratchLiveStudio';
import { PictoBloxLiveStudio } from './studios/PictoBloxLiveStudio';
import { MicrobitLiveStudio } from './studios/MicrobitLiveStudio';

export const StudioView: React.FC = () => {
  const { activeStudio, openStudio } = useApp();
  const [selectedStudioId, setSelectedStudioId] = useState<'scratch' | 'microbit' | 'pictoblox'>(
    activeStudio || 'scratch'
  );
  const [studioMode, setStudioMode] = useState<'interactive' | 'embed'>('interactive');

  const currentStudio = STUDIOS.find(s => s.id === selectedStudioId) || STUDIOS[0];

  const getStudioIcon = (id: string) => {
    switch (id) {
      case 'scratch':
        return <Code2 className="w-6 h-6 text-amber-600" />;
      case 'microbit':
        return <Cpu className="w-6 h-6 text-emerald-600" />;
      case 'pictoblox':
        return <Bot className="w-6 h-6 text-blue-600" />;
      default:
        return <Laptop className="w-6 h-6 text-indigo-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Studio Header & Selector */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
              <Laptop className="w-4 h-4" />
              Live Interactive Coding Studios
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Live Studio Scratch & PictoBlox AI
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 max-w-3xl">
              Studio coding interaktif yang dirancang mirip aslinya. Lengkap dengan blok pemrograman visual, panggung pementasan (stage) langsung, efek suara asli, kecerdasan buatan (AI Face & Mood), simulator robot Quarky, serta Text-to-Speech.
            </p>
          </div>

          {/* Mode Switcher & Direct links */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setStudioMode('interactive')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  studioMode === 'interactive'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                Studio Interaktif (Live)
              </button>
              <button
                onClick={() => setStudioMode('embed')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  studioMode === 'embed'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                Web Resmi Iframe
              </button>
            </div>

            <a
              href={currentStudio.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
              Buka {currentStudio.name} di Tab Baru
            </a>
          </div>
        </div>

        {/* Studio Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
          {STUDIOS.map(studio => {
            const isSelected = studio.id === selectedStudioId;
            return (
              <button
                key={studio.id}
                onClick={() => {
                  setSelectedStudioId(studio.id);
                  openStudio(studio.id);
                }}
                className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'border-indigo-600 bg-gradient-to-br from-indigo-50/70 to-white dark:from-slate-800 dark:to-slate-900 shadow-md ring-2 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0">
                    {getStudioIcon(studio.id)}
                  </div>
                  {isSelected && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600 text-white">
                      Aktif
                    </span>
                  )}
                </div>
                <div className="mt-3">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{studio.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{studio.tagline}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Studio View Switcher */}
      {studioMode === 'interactive' ? (
        <div>
          {selectedStudioId === 'scratch' && <ScratchLiveStudio />}
          {selectedStudioId === 'pictoblox' && <PictoBloxLiveStudio />}
          {selectedStudioId === 'microbit' && <MicrobitLiveStudio />}
        </div>
      ) : (
        /* Iframe Embed Mode */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-[750px]">
          <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between gap-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-800 text-white">
                {getStudioIcon(currentStudio.id)}
              </div>
              <div>
                <h2 className="text-sm font-bold text-white tracking-wide">
                  {currentStudio.name} (Embed Mode)
                </h2>
                <p className="text-xs text-slate-400 line-clamp-1">
                  Jika web membatasi frame (CSP/X-Frame-Options), gunakan tombol &quot;Buka di Tab Baru&quot; di kanan atas.
                </p>
              </div>
            </div>

            <a
              href={currentStudio.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Buka di Tab Baru</span>
            </a>
          </div>

          <div className="flex-1 relative bg-slate-100 dark:bg-slate-950 flex flex-col">
            <iframe
              src={
                selectedStudioId === 'scratch'
                  ? 'https://scratch.mit.edu/projects/editor/?tutorial=getStarted'
                  : selectedStudioId === 'microbit'
                  ? 'https://makecode.microbit.org/#editor'
                  : 'https://pictoblox.ai/'
              }
              className="w-full flex-1 border-0"
              title={currentStudio.name}
              allow="camera; microphone; display-capture; geolocation; usb; serial"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads allow-modals"
            />
          </div>
        </div>
      )}

      {/* Studio Guide Footer */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              Fitur Live Studio GenZi
            </p>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Blok visual Scratch & AI dapat digeser, diatur, dan dijalankan langsung</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Suara meong & nada 8-bit disintesis secara audio native tanpa lag</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>PictoBlox dilengkapi Speech Synthesis (TTS) bersuara Bahasa Indonesia</span>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              Tips Praktik ({currentStudio.name})
            </p>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5">
              {currentStudio.quickTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

