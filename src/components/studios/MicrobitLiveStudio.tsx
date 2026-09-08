import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Code2,
  Download,
  Volume2,
  VolumeX,
  Sliders,
  Maximize2,
  Minimize2,
  CheckCircle2,
  Heart,
  Smile,
  Zap,
  Radio,
  FileCode,
  Music,
  Eye,
  SlidersHorizontal,
  ChevronRight,
  Plus,
  Trash2
} from 'lucide-react';
import { playJumpSound, playPop, playRobotBuzzer, stopAllAudio } from '../../utils/studioAudio';

// Pre-defined 5x5 icon bit-matrices (1 = on, 0 = off)
const ICONS: Record<string, number[][]> = {
  heart: [
    [0, 1, 0, 1, 0],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [0, 1, 1, 1, 0],
    [0, 0, 1, 0, 0]
  ],
  small_heart: [
    [0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0]
  ],
  happy: [
    [0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0]
  ],
  surprised: [
    [0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 1, 1, 1, 0]
  ],
  check: [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 1, 0],
    [1, 0, 1, 0, 0],
    [0, 1, 0, 0, 0]
  ],
  skull: [
    [0, 1, 1, 1, 0],
    [1, 0, 1, 0, 1],
    [1, 1, 1, 1, 1],
    [0, 1, 1, 1, 0],
    [0, 1, 0, 1, 0]
  ],
  blank: [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0]
  ]
};

// MakeCode Blocks
export interface MicrobitBlock {
  id: string;
  type: string;
  category: 'basic' | 'input' | 'music' | 'led' | 'loops' | 'logic' | 'radio';
  label: string;
  params: Record<string, any>;
  color: string;
}

export const MicrobitLiveStudio: React.FC = () => {
  // 5x5 Matrix LED state
  const [matrix, setMatrix] = useState<number[][]>(ICONS.heart);
  const [currentText, setCurrentText] = useState<string>('');
  const [activeCodeMode, setActiveCodeMode] = useState<'blocks' | 'javascript' | 'python'>('blocks');

  // Sensors
  const [temperature, setTemperature] = useState<number>(25);
  const [lightLevel, setLightLevel] = useState<number>(128);
  const [isButtonPressedA, setIsButtonPressedA] = useState<boolean>(false);
  const [isButtonPressedB, setIsButtonPressedB] = useState<boolean>(false);

  // Execution
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [projectName, setProjectName] = useState<string>('Proyek Microbit Senyum');
  const [activeCategory, setActiveCategory] = useState<string>('basic');
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);

  // Blocks inside workspace
  const [blocks, setBlocks] = useState<MicrobitBlock[]>([
    {
      id: 'mb-1',
      type: 'show_icon',
      category: 'basic',
      label: 'tampilkan ikon [Hati]',
      params: { icon: 'heart' },
      color: '#1E90FF'
    },
    {
      id: 'mb-2',
      type: 'pause_ms',
      category: 'basic',
      label: 'jeda (ms) [500]',
      params: { ms: 500 },
      color: '#1E90FF'
    },
    {
      id: 'mb-3',
      type: 'show_icon',
      category: 'basic',
      label: 'tampilkan ikon [Hati Kecil]',
      params: { icon: 'small_heart' },
      color: '#1E90FF'
    },
    {
      id: 'mb-4',
      type: 'play_tone',
      category: 'music',
      label: 'bunyikan nada [Tengah C] selama [1 ketuk]',
      params: { note: 'C', freq: 262 },
      color: '#E63022'
    },
    {
      id: 'mb-5',
      type: 'pause_ms',
      category: 'basic',
      label: 'jeda (ms) [500]',
      params: { ms: 500 },
      color: '#1E90FF'
    }
  ]);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const loopStepRef = useRef<number>(0);

  // Presets
  const PRESETS: Record<
    string,
    { name: string; blocks: MicrobitBlock[] }
  > = {
    heartbeat: {
      name: '💖 Ikon Hati Berdetak (Heartbeat Animation)',
      blocks: [
        { id: 'mb-1', type: 'show_icon', category: 'basic', label: 'tampilkan ikon [Hati]', params: { icon: 'heart' }, color: '#1E90FF' },
        { id: 'mb-2', type: 'play_tone', category: 'music', label: 'bunyikan nada [Tinggi G]', params: { note: 'G', freq: 392 }, color: '#E63022' },
        { id: 'mb-3', type: 'pause_ms', category: 'basic', label: 'jeda (ms) [400]', params: { ms: 400 }, color: '#1E90FF' },
        { id: 'mb-4', type: 'show_icon', category: 'basic', label: 'tampilkan ikon [Hati Kecil]', params: { icon: 'small_heart' }, color: '#1E90FF' },
        { id: 'mb-5', type: 'pause_ms', category: 'basic', label: 'jeda (ms) [400]', params: { ms: 400 }, color: '#1E90FF' }
      ]
    },
    emoticons: {
      name: '😊 Emotikon Wajah Senang & Kaget',
      blocks: [
        { id: 'mb-1', type: 'show_icon', category: 'basic', label: 'tampilkan ikon [Senang]', params: { icon: 'happy' }, color: '#1E90FF' },
        { id: 'mb-2', type: 'play_tone', category: 'music', label: 'bunyikan nada [Tengah C]', params: { note: 'C', freq: 262 }, color: '#E63022' },
        { id: 'mb-3', type: 'pause_ms', category: 'basic', label: 'jeda (ms) [1000]', params: { ms: 1000 }, color: '#1E90FF' },
        { id: 'mb-4', type: 'show_icon', category: 'basic', label: 'tampilkan ikon [Terkejut]', params: { icon: 'surprised' }, color: '#1E90FF' },
        { id: 'mb-5', type: 'pause_ms', category: 'basic', label: 'jeda (ms) [800]', params: { ms: 800 }, color: '#1E90FF' }
      ]
    },
    dice: {
      name: '🎲 Dadu Acak saat Diguncang (Shake)',
      blocks: [
        { id: 'mb-1', type: 'show_number', category: 'basic', label: 'tampilkan nomor acak (1-6)', params: { num: 5 }, color: '#1E90FF' },
        { id: 'mb-2', type: 'play_tone', category: 'music', label: 'bunyikan nada [Tinggi E]', params: { note: 'E', freq: 330 }, color: '#E63022' },
        { id: 'mb-3', type: 'pause_ms', category: 'basic', label: 'jeda (ms) [1200]', params: { ms: 1200 }, color: '#1E90FF' }
      ]
    },
    temp: {
      name: '🌡️ Termometer Sensor Suhu LED',
      blocks: [
        { id: 'mb-1', type: 'show_string', category: 'basic', label: 'tampilkan teks [25C]', params: { text: '25C' }, color: '#1E90FF' },
        { id: 'mb-2', type: 'show_icon', category: 'basic', label: 'tampilkan ikon [Ceklis]', params: { icon: 'check' }, color: '#1E90FF' },
        { id: 'mb-3', type: 'pause_ms', category: 'basic', label: 'jeda (ms) [1000]', params: { ms: 1000 }, color: '#1E90FF' }
      ]
    }
  };

  // Execution Loop
  useEffect(() => {
    if (!isRunning || blocks.length === 0) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    let isMounted = true;

    const executeCycle = async () => {
      for (let i = 0; i < blocks.length; i++) {
        if (!isMounted || !isRunning) break;
        const b = blocks[i];
        setActiveBlockId(b.id);

        if (b.type === 'show_icon') {
          const iconMatrix = ICONS[b.params.icon] || ICONS.heart;
          setMatrix(iconMatrix);
          setCurrentText('');
        } else if (b.type === 'show_string' || b.type === 'show_number') {
          const txt = String(b.params.text || b.params.num || 'Hi');
          setCurrentText(txt);
        } else if (b.type === 'clear_screen') {
          setMatrix(ICONS.blank);
          setCurrentText('');
        } else if (b.type === 'play_tone') {
          if (!isMuted) {
            playRobotBuzzer(b.params.freq || 440, 0.2);
          }
        }

        const wait = Number(b.params.ms) || 400;
        await new Promise(r => setTimeout(r, wait));
      }
      setActiveBlockId(null);
    };

    const runLoop = async () => {
      while (isMounted && isRunning) {
        await executeCycle();
      }
    };

    runLoop();

    return () => {
      isMounted = false;
      stopAllAudio();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, blocks, isMuted]);

  // Handle Button A click
  const handlePressA = () => {
    setIsButtonPressedA(true);
    playPop();
    setMatrix(ICONS.happy);
    setCurrentText('A');
    setTimeout(() => {
      setIsButtonPressedA(false);
    }, 400);
  };

  // Handle Button B click
  const handlePressB = () => {
    setIsButtonPressedB(true);
    playPop();
    setMatrix(ICONS.surprised);
    setCurrentText('B');
    setTimeout(() => {
      setIsButtonPressedB(false);
    }, 400);
  };

  // Handle Shake
  const handleShake = () => {
    playJumpSound();
    const diceIcons = ['heart', 'small_heart', 'happy', 'surprised', 'check', 'skull'];
    const randomIcon = diceIcons[Math.floor(Math.random() * diceIcons.length)];
    setMatrix(ICONS[randomIcon]);
    setCurrentText(String(Math.floor(Math.random() * 6) + 1));
  };

  // Toggle individual LED pixel on matrix
  const handleTogglePixel = (row: number, col: number) => {
    setMatrix(prev => {
      const copy = prev.map(r => [...r]);
      copy[row][col] = copy[row][col] === 1 ? 0 : 1;
      return copy;
    });
    playPop();
  };

  // Add block to workspace
  const handleAddBlock = (template: Omit<MicrobitBlock, 'id'>) => {
    const newBlock: MicrobitBlock = {
      ...template,
      id: `mb-${Date.now()}`
    };
    setBlocks(prev => [...prev, newBlock]);
    playPop();
  };

  // Remove block
  const handleRemoveBlock = (id: string) => {
    setBlocks(prev => prev.filter(b => b.id !== id));
  };

  // Load Preset
  const handleLoadPreset = (key: string) => {
    if (PRESETS[key]) {
      setBlocks(PRESETS[key].blocks);
      setProjectName(PRESETS[key].name);
      playJumpSound();
    }
  };

  // Download project as hex/json
  const handleDownload = () => {
    const projectData = {
      name: projectName,
      platform: 'Micro:bit MakeCode',
      blocks: blocks,
      date: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(projectData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.toLowerCase().replace(/\s+/g, '_')}.hex.json`;
    a.click();
    URL.revokeObjectURL(url);
    playJumpSound();
  };

  // Toolbox Categories
  const categories = [
    { id: 'basic', label: 'Dasar', color: '#1E90FF', count: 4 },
    { id: 'input', label: 'Input', color: '#D400D4', count: 3 },
    { id: 'music', label: 'Musik', color: '#E63022', count: 3 },
    { id: 'led', label: 'LED Layar', color: '#5C2D91', count: 2 },
    { id: 'loops', label: 'Gelung', color: '#00AA00', count: 2 },
    { id: 'logic', label: 'Logika', color: '#00A4EF', count: 2 }
  ];

  // Block Templates
  const BLOCK_TEMPLATES: Record<string, Omit<MicrobitBlock, 'id'>[]> = {
    basic: [
      { type: 'show_icon', category: 'basic', label: 'tampilkan ikon [Hati]', params: { icon: 'heart' }, color: '#1E90FF' },
      { type: 'show_icon', category: 'basic', label: 'tampilkan ikon [Senang]', params: { icon: 'happy' }, color: '#1E90FF' },
      { type: 'show_string', category: 'basic', label: 'tampilkan teks ["Halo"]', params: { text: 'Halo' }, color: '#1E90FF' },
      { type: 'pause_ms', category: 'basic', label: 'jeda (ms) [500]', params: { ms: 500 }, color: '#1E90FF' },
      { type: 'clear_screen', category: 'basic', label: 'hapus layar', params: {}, color: '#1E90FF' }
    ],
    input: [
      { type: 'on_button_pressed', category: 'input', label: 'pada tombol A ditekan', params: { button: 'A' }, color: '#D400D4' },
      { type: 'on_button_pressed', category: 'input', label: 'pada tombol B ditekan', params: { button: 'B' }, color: '#D400D4' },
      { type: 'on_shake', category: 'input', label: 'pada saat diguncang (shake)', params: {}, color: '#D400D4' }
    ],
    music: [
      { type: 'play_tone', category: 'music', label: 'bunyikan nada [Tengah C]', params: { note: 'C', freq: 262 }, color: '#E63022' },
      { type: 'play_tone', category: 'music', label: 'bunyikan nada [Tinggi G]', params: { note: 'G', freq: 392 }, color: '#E63022' },
      { type: 'play_melody', category: 'music', label: 'mainkan nada Ba-Ding', params: { melody: 'ba-ding' }, color: '#E63022' }
    ],
    led: [
      { type: 'plot', category: 'led', label: 'nyalakan x [2] y [2]', params: { x: 2, y: 2 }, color: '#5C2D91' },
      { type: 'unplot', category: 'led', label: 'matikan x [2] y [2]', params: { x: 2, y: 2 }, color: '#5C2D91' }
    ],
    loops: [
      { type: 'repeat', category: 'loops', label: 'ulangi [4] kali', params: { count: 4 }, color: '#00AA00' }
    ],
    logic: [
      { type: 'if_true', category: 'logic', label: 'jika [benar] maka', params: {}, color: '#00A4EF' }
    ]
  };

  // Generate JavaScript representation
  const generateJavaScriptCode = () => {
    return `// Micro:bit MakeCode TypeScript
basic.forever(function () {
${blocks
  .map(b => {
    if (b.type === 'show_icon') return `    basic.showIcon(IconNames.${b.params.icon.toUpperCase()});`;
    if (b.type === 'show_string') return `    basic.showString("${b.params.text || 'Halo'}");`;
    if (b.type === 'pause_ms') return `    basic.pause(${b.params.ms || 500});`;
    if (b.type === 'clear_screen') return `    basic.clearScreen();`;
    if (b.type === 'play_tone') return `    music.playTone(Note.${b.params.note || 'C'}, music.beat(BeatFraction.Whole));`;
    return `    // ${b.label}`;
  })
  .join('\n')}
});

input.onButtonPressed(Button.A, function () {
    basic.showIcon(IconNames.HAPPY);
});

input.onGesture(Gesture.Shake, function () {
    basic.showNumber(randint(1, 6));
});`;
  };

  // Generate Python representation
  const generatePythonCode = () => {
    return `# Micro:bit MicroPython Script
from microbit import *
import music
import random

while True:
${blocks
  .map(b => {
    if (b.type === 'show_icon') return `    display.show(Image.${b.params.icon.toUpperCase()})`;
    if (b.type === 'show_string') return `    display.scroll("${b.params.text || 'Halo'}")`;
    if (b.type === 'pause_ms') return `    sleep(${b.params.ms || 500})`;
    if (b.type === 'clear_screen') return `    display.clear()`;
    if (b.type === 'play_tone') return `    music.pitch(${b.params.freq || 262}, 250)`;
    return `    # ${b.label}`;
  })
  .join('\n')}

    if button_a.is_pressed():
        display.show(Image.HAPPY)
    if accelerometer.was_gesture('shake'):
        display.show(str(random.randint(1, 6)))
`;
  };

  return (
    <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-xl flex flex-col h-[820px] overflow-hidden select-none">
      {/* Top MakeCode Navigation Bar (Purplish MakeCode brand) */}
      <div className="bg-[#5C2D91] px-4 py-2.5 flex items-center justify-between shadow-md border-b border-[#4A2474] shrink-0">
        <div className="flex items-center gap-3">
          {/* MakeCode micro:bit Logo */}
          <div className="flex items-center gap-2 bg-black/20 hover:bg-black/30 px-3 py-1.5 rounded-lg">
            <span className="font-black tracking-wider text-sm flex items-center gap-1 text-white">
              micro:bit
              <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400 inline" />
            </span>
            <span className="text-[10px] font-bold bg-amber-400 text-slate-900 px-1.5 py-0.5 rounded uppercase">
              MakeCode
            </span>
          </div>

          {/* Preset Selector */}
          <div className="hidden sm:flex items-center gap-2 bg-black/20 rounded-lg px-2.5 py-1 text-xs">
            <span className="text-white/80">Contoh:</span>
            <select
              onChange={e => handleLoadPreset(e.target.value)}
              className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
              defaultValue="heartbeat"
            >
              <option value="heartbeat" className="text-slate-900">💖 Ikon Hati Berdetak</option>
              <option value="emoticons" className="text-slate-900">😊 Emotikon Senang & Kaget</option>
              <option value="dice" className="text-slate-900">🎲 Dadu Acak saat Diguncang</option>
              <option value="temp" className="text-slate-900">🌡️ Termometer Sensor Suhu</option>
            </select>
          </div>
        </div>

        {/* View Switcher: Blocks / JavaScript / Python */}
        <div className="flex items-center bg-black/30 p-1 rounded-xl border border-white/10 text-xs">
          <button
            onClick={() => setActiveCodeMode('blocks')}
            className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeCodeMode === 'blocks'
                ? 'bg-white text-[#5C2D91] shadow-xs'
                : 'text-white/80 hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Blok</span>
          </button>
          <button
            onClick={() => setActiveCodeMode('javascript')}
            className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeCodeMode === 'javascript'
                ? 'bg-white text-[#5C2D91] shadow-xs'
                : 'text-white/80 hover:text-white'
            }`}
          >
            <span>{'{ }'} JS</span>
          </button>
          <button
            onClick={() => setActiveCodeMode('python')}
            className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeCodeMode === 'python'
                ? 'bg-white text-[#5C2D91] shadow-xs'
                : 'text-white/80 hover:text-white'
            }`}
          >
            <span>🐍 Python</span>
          </button>
        </div>

        {/* Official URL Link & Download Button */}
        <div className="flex items-center gap-2">
          <a
            href="https://makecode.microbit.org/#editor"
            target="_blank"
            rel="noopener noreferrer"
            title="Buka Web Editor MakeCode Micro:bit Asli"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-colors"
          >
            <span>Buka di Web Asli MakeCode</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Main Studio Body: 3-column Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Column: Authentic Micro:bit Hardware Simulator */}
        <div className="w-full lg:w-96 bg-slate-950 p-4 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-800 shrink-0 overflow-y-auto">
          {/* Simulator Header */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Simulator Micro:bit v2
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                title={isMuted ? 'Nyalakan Audio' : 'Matikan Audio'}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`p-1.5 rounded text-xs font-bold flex items-center gap-1 ${
                  isRunning ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
                title={isRunning ? 'Jeda Simulator' : 'Jalankan Simulator'}
              >
                {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Micro:bit Physical Board Graphical Reproduction */}
          <div className="bg-[#1e232a] rounded-3xl p-5 border-2 border-slate-700 shadow-2xl relative flex flex-col items-center">
            {/* Board Top Edge Screws / Antenna */}
            <div className="w-full flex items-center justify-between mb-2 px-3">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-slate-700 border border-slate-600"></div>
                <span className="text-[10px] font-mono text-slate-400">micro:bit</span>
              </div>
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" title="Status Daya Aktif"></div>
              <div className="w-3 h-3 rounded-full bg-slate-700 border border-slate-600"></div>
            </div>

            {/* Board Controls: Button A, 5x5 LED Matrix, Button B */}
            <div className="w-full flex items-center justify-between gap-3 my-3">
              {/* Button A */}
              <div className="flex flex-col items-center">
                <button
                  onClick={handlePressA}
                  className={`w-9 h-9 rounded-full border-2 transition-all flex items-center justify-center font-black text-sm shadow-md ${
                    isButtonPressedA
                      ? 'bg-rose-500 border-white text-white scale-90'
                      : 'bg-slate-800 border-slate-600 hover:border-amber-400 text-slate-200 hover:bg-slate-700'
                  }`}
                  title="Tekan Tombol A"
                >
                  A
                </button>
                <span className="text-[9px] text-slate-400 font-mono mt-1">BTN A</span>
              </div>

              {/* 5x5 Red LED Matrix Display */}
              <div className="bg-black/90 p-2.5 rounded-xl border border-slate-700/80 shadow-inner flex flex-col items-center justify-center">
                <div className="grid grid-cols-5 gap-1.5">
                  {matrix.map((row, rIdx) =>
                    row.map((val, cIdx) => {
                      const isOn = val === 1;
                      return (
                        <button
                          key={`${rIdx}-${cIdx}`}
                          onClick={() => handleTogglePixel(rIdx, cIdx)}
                          className={`w-4 h-4 rounded-xs transition-colors cursor-pointer ${
                            isOn
                              ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.9)] ring-1 ring-rose-400'
                              : 'bg-slate-800/80 hover:bg-slate-700/80'
                          }`}
                          title={`LED [${rIdx},${cIdx}] - Klik untuk ubah`}
                        />
                      );
                    })
                  )}
                </div>

                {currentText && (
                  <div className="mt-2 text-center text-rose-400 font-mono text-xs font-bold tracking-wider animate-pulse">
                    &quot;{currentText}&quot;
                  </div>
                )}
              </div>

              {/* Button B */}
              <div className="flex flex-col items-center">
                <button
                  onClick={handlePressB}
                  className={`w-9 h-9 rounded-full border-2 transition-all flex items-center justify-center font-black text-sm shadow-md ${
                    isButtonPressedB
                      ? 'bg-rose-500 border-white text-white scale-90'
                      : 'bg-slate-800 border-slate-600 hover:border-amber-400 text-slate-200 hover:bg-slate-700'
                  }`}
                  title="Tekan Tombol B"
                >
                  B
                </button>
                <span className="text-[9px] text-slate-400 font-mono mt-1">BTN B</span>
              </div>
            </div>

            {/* Shake / Accelerometer Sensor Button */}
            <div className="mt-1 w-full flex items-center justify-center gap-2">
              <button
                onClick={handleShake}
                className="px-3 py-1 rounded-lg bg-indigo-900/60 hover:bg-indigo-800 border border-indigo-600 text-indigo-200 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Kocok Board (Shake Sensor)</span>
              </button>
            </div>

            {/* Micro:bit Gold Edge Connector Pins at Bottom */}
            <div className="w-full mt-4 pt-2 border-t border-slate-700 flex items-center justify-between text-[10px] font-mono text-amber-400 font-bold px-1">
              <span className="p-1 rounded bg-amber-950/40 border border-amber-500/30">0</span>
              <span className="p-1 rounded bg-amber-950/40 border border-amber-500/30">1</span>
              <span className="p-1 rounded bg-amber-950/40 border border-amber-500/30">2</span>
              <span className="p-1 rounded bg-amber-950/40 border border-amber-500/30">3V</span>
              <span className="p-1 rounded bg-amber-950/40 border border-amber-500/30">GND</span>
            </div>
          </div>

          {/* Interactive Environment Sensor Controls */}
          <div className="mt-4 bg-slate-900 rounded-xl p-3 border border-slate-800 space-y-3">
            <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
              <span>Simulasi Sensor Terbina (Sensors)</span>
            </div>

            {/* Temperature Slider */}
            <div>
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Sensor Suhu:</span>
                <span className="font-mono text-amber-400 font-bold">{temperature} °C</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={temperature}
                onChange={e => setTemperature(Number(e.target.value))}
                className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Light Level Slider */}
            <div>
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Sensor Cahaya:</span>
                <span className="font-mono text-blue-400 font-bold">{lightLevel} / 255</span>
              </div>
              <input
                type="range"
                min="0"
                max="255"
                value={lightLevel}
                onChange={e => setLightLevel(Number(e.target.value))}
                className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* MakeCode Download HEX Button at Bottom Left */}
          <div className="mt-auto pt-3">
            <button
              onClick={handleDownload}
              className="w-full py-2.5 px-4 rounded-xl bg-[#0078D7] hover:bg-[#0063B1] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download Proyek (.hex / MakeCode)</span>
            </button>
          </div>
        </div>

        {/* Center & Right: Toolbox & Workspace Canvas OR Code Preview */}
        {activeCodeMode === 'blocks' ? (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-900">
            {/* Category Toolbox Drawer */}
            <div className="w-full md:w-56 bg-slate-950 border-r border-slate-800 p-2.5 flex flex-col shrink-0 overflow-y-auto">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-2">
                Kategori Blok MakeCode
              </span>
              <div className="space-y-1">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`w-full px-3 py-2 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between ${
                      activeCategory === cat.id
                        ? 'text-white shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                    style={{
                      backgroundColor: activeCategory === cat.id ? cat.color : undefined
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span>{cat.label}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                  </button>
                ))}
              </div>

              {/* Block Palette for selected category */}
              <div className="mt-4 pt-3 border-t border-slate-800">
                <span className="text-[10px] font-bold uppercase text-slate-500 mb-2 block px-1">
                  Pilih Blok untuk Ditambahkan:
                </span>
                <div className="space-y-1.5">
                  {(BLOCK_TEMPLATES[activeCategory] || []).map((t, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAddBlock(t)}
                      className="w-full p-2 rounded-lg text-left text-xs font-semibold text-white shadow-xs transition-transform active:scale-95 flex items-center justify-between group"
                      style={{ backgroundColor: t.color }}
                    >
                      <span className="truncate">{t.label}</span>
                      <Plus className="w-3.5 h-3.5 shrink-0 opacity-80 group-hover:opacity-100" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Workspace Area with on start & forever container simulation */}
            <div className="flex-1 bg-[#1a1f2c] p-4 overflow-y-auto flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-emerald-400" />
                    <span>Area Kerja MakeCode (Workspace)</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Blok yang ada di dalam &quot;selamanya (forever)&quot; dieksekusi terus-menerus pada simulator Micro:bit di sebelah kiri.
                  </p>
                </div>
                <button
                  onClick={() => setBlocks([])}
                  className="text-xs text-rose-400 hover:text-rose-300 font-semibold px-2.5 py-1 rounded bg-rose-950/40 border border-rose-800"
                >
                  Kosongkan
                </button>
              </div>

              {/* The classic "selamanya (forever)" container */}
              <div className="bg-[#00AA00]/20 border-2 border-[#00AA00] rounded-2xl p-4 shadow-md max-w-xl">
                <div className="flex items-center gap-2 text-[#00AA00] font-black text-xs uppercase tracking-wider mb-3">
                  <RotateCcw className="w-4 h-4" />
                  <span>selamanya (forever)</span>
                </div>

                {/* Blocks inside forever */}
                <div className="space-y-2 pl-4 border-l-2 border-[#00AA00]/50">
                  {blocks.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-400 italic">
                      Belum ada blok di dalam selamanya. Klik blok dari menu di sebelah kiri untuk menambahkannya!
                    </div>
                  ) : (
                    blocks.map((block, idx) => {
                      const isActive = activeBlockId === block.id;
                      return (
                        <div
                          key={block.id}
                          className={`p-3 rounded-xl text-xs font-bold text-white shadow-md flex items-center justify-between gap-3 transition-all ${
                            isActive ? 'ring-2 ring-white scale-[1.02]' : ''
                          }`}
                          style={{ backgroundColor: block.color }}
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-black/20 flex items-center justify-center text-[10px]">
                              {idx + 1}
                            </span>
                            <span>{block.label}</span>
                          </div>
                          <button
                            onClick={() => handleRemoveBlock(block.id)}
                            className="text-white/70 hover:text-white p-1"
                            title="Hapus Blok"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Code View: JavaScript or Python */
          <div className="flex-1 bg-slate-950 p-6 overflow-y-auto font-mono text-xs">
            <div className="flex items-center justify-between mb-3 text-slate-400">
              <span className="font-bold flex items-center gap-2">
                <FileCode className="w-4 h-4 text-indigo-400" />
                {activeCodeMode === 'javascript' ? 'Kode MakeCode JavaScript (TypeScript)' : 'Kode MicroPython'}
              </span>
              <span className="text-[11px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                Otomatis disinkronkan dari blok
              </span>
            </div>
            <pre className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-emerald-300 leading-relaxed overflow-x-auto selection:bg-indigo-500">
              {activeCodeMode === 'javascript' ? generateJavaScriptCode() : generatePythonCode()}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
