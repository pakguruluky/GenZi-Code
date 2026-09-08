import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Square,
  Sparkles,
  RotateCcw,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Volume2,
  Bot,
  Camera,
  Cpu,
  Eye,
  Maximize2,
  Minimize2,
  ExternalLink,
  Code2,
  Smile,
  Zap
} from 'lucide-react';
import {
  BlockTemplate,
  BlockInstance,
  CATEGORY_COLORS,
  SCRATCH_BLOCK_TEMPLATES,
  PICTOBLOX_ADDITIONAL_BLOCKS
} from './blockDefinitions';
import { SPRITES, BACKDROPS, SpriteItem } from './spritesData';
import { playRobotBuzzer, speakText, playJumpSound, playPop, stopAllAudio } from '../../utils/studioAudio';

export const PictoBloxLiveStudio: React.FC = () => {
  // Preset Projects for PictoBlox AI & Robotics
  const PICTOBLOX_PRESETS: Record<
    string,
    { name: string; blocks: BlockInstance[]; stageMode: 'camera' | 'robot' }
  > = {
    ai_face: {
      name: '🤖 Deteksi Wajah & Mood Senang (AI Face Recognition)',
      stageMode: 'camera',
      blocks: [
        { id: 'pb1', type: 'when_flag_clicked', category: 'events', params: {} },
        { id: 'pb2', type: 'ai_detect_face', category: 'ai', params: {} },
        {
          id: 'pb3',
          type: 'tts_speak',
          category: 'ai',
          params: { text: 'Halo! Kamera AI mendeteksi senyumanmu. Wajahmu terlihat sangat bahagia!' }
        },
        {
          id: 'pb4',
          type: 'say_for_secs',
          category: 'looks',
          params: { text: 'AI Face Detected: Mood Senang (98%) 😊', secs: 2.5 }
        },
        { id: 'pb5', type: 'robot_led', category: 'robot', params: { color: 'Hijau' } },
        { id: 'pb6', type: 'play_sound_jump', category: 'sound', params: {} }
      ]
    },
    quarky_robot: {
      name: '🚀 Robot Quarky & Sensor Halangan (Robotics IoT)',
      stageMode: 'robot',
      blocks: [
        { id: 'pb1', type: 'when_flag_clicked', category: 'events', params: {} },
        { id: 'pb2', type: 'robot_led', category: 'robot', params: { color: 'Biru' } },
        {
          id: 'pb3',
          type: 'tts_speak',
          category: 'ai',
          params: { text: 'Robot Quarky GenZi siap menjelajah area!' }
        },
        { id: 'pb4', type: 'robot_drive', category: 'robot', params: { speed: 85 } },
        { id: 'pb5', type: 'robot_buzzer', category: 'robot', params: { freq: 520 } },
        {
          id: 'pb6',
          type: 'say_for_secs',
          category: 'looks',
          params: { text: 'Sensor Jarak: Halangan di depan 15 cm. Memutar haluan!', secs: 2 }
        },
        { id: 'pb7', type: 'robot_led', category: 'robot', params: { color: 'Kuning' } },
        { id: 'pb8', type: 'turn_right', category: 'motion', params: { degrees: 45 } }
      ]
    },
    smart_assistant: {
      name: '🎙️ Asisten AI Suara Cerdas (Natural Language)',
      stageMode: 'camera',
      blocks: [
        { id: 'pb1', type: 'when_flag_clicked', category: 'events', params: {} },
        {
          id: 'pb2',
          type: 'tts_speak',
          category: 'ai',
          params: { text: 'Selamat datang di PictoBlox AI Studio. Saya siap membantu projek coding kecerdasan buatanmu!' }
        },
        { id: 'pb3', type: 'robot_led', category: 'robot', params: { color: 'Ungu' } },
        {
          id: 'pb4',
          type: 'say_for_secs',
          category: 'looks',
          params: { text: 'PictoBlox AI NLP Engine Aktif 💡', secs: 3 }
        },
        { id: 'pb5', type: 'play_sound_jump', category: 'sound', params: {} }
      ]
    }
  };

  // State
  const [blocks, setBlocks] = useState<BlockInstance[]>(PICTOBLOX_PRESETS.ai_face.blocks);
  const [selectedCategory, setSelectedCategory] = useState<string>('ai');
  const [stageMode, setStageMode] = useState<'camera' | 'robot'>('camera');
  const [useWebcam, setUseWebcam] = useState<boolean>(false);

  // Quarky Robot Virtual State
  const [quarkyLedColor, setQuarkyLedColor] = useState<string>('Biru');
  const [quarkySpeed, setQuarkySpeed] = useState<number>(0);
  const [isBuzzerActive, setIsBuzzerActive] = useState<boolean>(false);

  // AI Camera Simulator State
  const [detectedEmotion, setDetectedEmotion] = useState<string>('Senang');
  const [detectedConfidence, setDetectedConfidence] = useState<number>(98);
  const [isScanningFace, setIsScanningFace] = useState<boolean>(false);

  // Execution State
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeBlockIndex, setActiveBlockIndex] = useState<number | null>(null);
  const [speechText, setSpeechText] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const abortExecutionRef = useRef<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Handle webcam stream
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (useWebcam && stageMode === 'camera') {
      navigator.mediaDevices
        ?.getUserMedia({ video: true })
        .then(s => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch(err => {
          console.warn('Webcam not accessible:', err);
          setUseWebcam(false);
        });
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const s = videoRef.current.srcObject as MediaStream;
        s.getTracks().forEach(t => t.stop());
        videoRef.current.srcObject = null;
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }
    };
  }, [useWebcam, stageMode]);

  // Combined Block Templates (Scratch core + PictoBlox AI blocks)
  const allTemplates: BlockTemplate[] = [
    ...PICTOBLOX_ADDITIONAL_BLOCKS,
    ...SCRATCH_BLOCK_TEMPLATES
  ];

  const categories = [
    { id: 'ai', label: 'AI & Vision', color: '#7054FF' },
    { id: 'robot', label: 'Robot Quarky', color: '#00B894' },
    { id: 'motion', label: 'Gerakan', color: '#4C97FF' },
    { id: 'looks', label: 'Tampilan', color: '#9966FF' },
    { id: 'sound', label: 'Suara', color: '#CF63CF' },
    { id: 'control', label: 'Kontrol', color: '#FFAB19' }
  ];

  const filteredTemplates = allTemplates.filter(t => t.category === selectedCategory);

  const addBlock = (template: BlockTemplate) => {
    const newBlock: BlockInstance = {
      id: 'pb_blk_' + Math.random().toString(36).substring(2, 9),
      type: template.type,
      category: template.category,
      params: { ...template.defaultParams }
    };
    setBlocks(prev => [...prev, newBlock]);
  };

  const removeBlock = (id: string) => {
    setBlocks(prev => prev.filter(b => b.id !== id));
  };

  const moveBlockOrder = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= blocks.length) return;
    const newBlocks = [...blocks];
    const [moved] = newBlocks.splice(index, 1);
    newBlocks.splice(newIndex, 0, moved);
    setBlocks(newBlocks);
  };

  const updateBlockParam = (blockId: string, paramKey: string, value: string | number) => {
    setBlocks(prev =>
      prev.map(b => (b.id === blockId ? { ...b, params: { ...b.params, [paramKey]: value } } : b))
    );
  };

  const handleStop = () => {
    abortExecutionRef.current = true;
    setIsRunning(false);
    setActiveBlockIndex(null);
    setSpeechText(null);
    setIsScanningFace(false);
    setQuarkySpeed(0);
    stopAllAudio();
  };

  useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, []);

  const handleLoadPreset = (key: string) => {
    handleStop();
    const preset = PICTOBLOX_PRESETS[key];
    if (preset) {
      setBlocks(preset.blocks);
      setStageMode(preset.stageMode);
    }
  };

  // Run execution
  const handleRun = async () => {
    if (isRunning) {
      handleStop();
      return;
    }

    abortExecutionRef.current = false;
    setIsRunning(true);

    const sleep = (ms: number) =>
      new Promise<void>(resolve => {
        const start = Date.now();
        const interval = setInterval(() => {
          if (abortExecutionRef.current || Date.now() - start >= ms) {
            clearInterval(interval);
            resolve();
          }
        }, 20);
      });

    try {
      for (let i = 0; i < blocks.length; i++) {
        if (abortExecutionRef.current) break;
        const block = blocks[i];
        setActiveBlockIndex(i);

        switch (block.type) {
          case 'ai_detect_face': {
            setIsScanningFace(true);
            await sleep(800);
            const moods = ['Senang', 'Terkejut', 'Ceria', 'Fokus'];
            const randMood = moods[Math.floor(Math.random() * moods.length)];
            setDetectedEmotion(randMood);
            setDetectedConfidence(Math.floor(92 + Math.random() * 7));
            setIsScanningFace(false);
            await sleep(400);
            break;
          }

          case 'tts_speak': {
            const txt = String(block.params.text || 'Halo dari PictoBlox AI');
            setSpeechText(txt);
            speakText(txt, 'id-ID');
            await sleep(Math.max(2000, txt.length * 90));
            if (!abortExecutionRef.current) {
              setSpeechText(null);
            }
            break;
          }

          case 'robot_led': {
            const color = String(block.params.color || 'Hijau');
            setQuarkyLedColor(color);
            playPop();
            await sleep(350);
            break;
          }

          case 'robot_buzzer': {
            const freq = Number(block.params.freq) || 440;
            setIsBuzzerActive(true);
            playRobotBuzzer(freq, 0.35);
            await sleep(400);
            setIsBuzzerActive(false);
            break;
          }

          case 'robot_drive': {
            const spd = Number(block.params.speed) || 80;
            setQuarkySpeed(spd);
            playJumpSound();
            await sleep(600);
            break;
          }

          case 'say_for_secs': {
            const txt = String(block.params.text || 'Halo!');
            const secs = Number(block.params.secs) || 2;
            setSpeechText(txt);
            await sleep(secs * 1000);
            if (!abortExecutionRef.current) {
              setSpeechText(null);
            }
            break;
          }

          case 'play_sound_jump':
            playJumpSound();
            await sleep(250);
            break;

          default:
            await sleep(250);
            break;
        }
      }
    } finally {
      setIsRunning(false);
      setActiveBlockIndex(null);
      setQuarkySpeed(0);
    }
  };

  // LED CSS mapping
  const getLedColorStyle = (colorName: string) => {
    switch (colorName.toLowerCase()) {
      case 'merah':
        return 'bg-rose-500 shadow-[0_0_20px_#f43f5e] border-rose-300';
      case 'hijau':
        return 'bg-emerald-400 shadow-[0_0_20px_#34d399] border-emerald-200';
      case 'biru':
        return 'bg-sky-400 shadow-[0_0_20px_#38bdf8] border-sky-200';
      case 'kuning':
        return 'bg-amber-300 shadow-[0_0_20px_#fcd34d] border-amber-100';
      case 'ungu':
        return 'bg-purple-500 shadow-[0_0_20px_#a855f7] border-purple-200';
      default:
        return 'bg-slate-700 border-slate-600';
    }
  };

  return (
    <div
      className={`bg-slate-100 dark:bg-slate-950 flex flex-col transition-all select-none ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen' : 'rounded-2xl border border-slate-300 dark:border-slate-800 shadow-md h-[820px]'
      }`}
    >
      {/* PictoBlox Authentic Tech Header */}
      <div className="bg-[#1E272E] text-white px-4 py-2.5 flex items-center justify-between border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <div className="flex items-center gap-2 bg-indigo-600/30 border border-indigo-500/40 px-3 py-1.5 rounded-lg cursor-pointer">
            <Bot className="w-5 h-5 text-cyan-400" />
            <span className="font-black text-base tracking-tight text-white">PICTOBLOX</span>
            <span className="text-[10px] font-bold bg-indigo-500 text-white px-1.5 py-0.5 rounded uppercase">
              AI & ROBOTICS
            </span>
          </div>

          {/* Preset Selector */}
          <div className="hidden sm:flex items-center gap-1.5 bg-black/40 border border-slate-700 rounded-lg px-2.5 py-1">
            <span className="text-xs text-slate-400 font-medium">Contoh AI:</span>
            <select
              onChange={e => handleLoadPreset(e.target.value)}
              className="bg-transparent text-cyan-300 text-xs font-bold focus:outline-none cursor-pointer"
              defaultValue="ai_face"
            >
              <option value="ai_face" className="text-slate-900">🤖 Deteksi Wajah & Mood Senang</option>
              <option value="quarky_robot" className="text-slate-900">🚀 Robot Quarky & Sensor Halangan</option>
              <option value="smart_assistant" className="text-slate-900">🎙️ Asisten AI Suara (TTS)</option>
            </select>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRun}
            title="Mulai Jalankan Skrip AI"
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg font-black text-xs transition-all shadow-xs ${
              isRunning
                ? 'bg-cyan-400 text-slate-950 ring-2 ring-white animate-pulse'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white hover:scale-105 active:scale-95'
            }`}
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Jalankan AI</span>
          </button>

          <button
            onClick={handleStop}
            title="Stop Program"
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-bold transition-all"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>Stop</span>
          </button>

          <div className="h-5 w-px bg-slate-700 mx-1" />

          {/* Official Web Link */}
          <a
            href="https://pictoblox.ai/"
            target="_blank"
            rel="noopener noreferrer"
            title="Buka Website Resmi PictoBlox AI (pictoblox.ai)"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950 hover:bg-indigo-900 text-cyan-300 hover:text-cyan-200 text-xs font-bold transition-all border border-indigo-500/40 shadow-xs"
          >
            <span>Buka pictoblox.ai Asli</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {/* Fullscreen */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main 3-Pane Body */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* PANE 1: Block Palette */}
        <div className="w-full lg:w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0">
          {/* Category Tabs */}
          <div className="flex items-center gap-1 p-2 bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
            {categories.map(cat => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 ${
                    isSelected
                      ? 'text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                  style={{ backgroundColor: isSelected ? cat.color : undefined }}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Available Blocks */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
              Pilih Blok PictoBlox & AI:
            </div>
            {filteredTemplates.map(template => {
              const colorInfo = CATEGORY_COLORS[template.category] || CATEGORY_COLORS.ai;
              return (
                <div
                  key={template.type}
                  onClick={() => addBlock(template)}
                  className="group relative flex items-center justify-between p-2.5 rounded-xl cursor-pointer hover:shadow-md transition-all active:scale-[0.98] border border-black/10"
                  style={{ backgroundColor: colorInfo.bg }}
                >
                  <span className="text-xs font-bold text-white tracking-wide pr-2">
                    {template.labelTemplate.replace(/{(\w+)}/g, '(__)')}
                  </span>
                  <button
                    className="p-1 rounded-md bg-white/20 group-hover:bg-white text-white group-hover:text-slate-900 transition-colors shrink-0"
                    title="Tambah Blok"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* PANE 2: Coding Workspace */}
        <div className="flex-1 bg-[#F5F6FA] dark:bg-slate-950 flex flex-col overflow-hidden border-r border-slate-200 dark:border-slate-800">
          <div className="bg-white dark:bg-slate-900 px-4 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-bold">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Area Pemrograman Algoritma AI & Robot ({blocks.length} blok)</span>
            </div>
            <button
              onClick={() => setBlocks([])}
              className="text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 px-2 py-1 rounded"
            >
              Kosongkan Skrip
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-2">
            {blocks.map((block, idx) => {
              const colorInfo = CATEGORY_COLORS[block.category] || CATEGORY_COLORS.ai;
              const isHighlight = activeBlockIndex === idx;

              return (
                <div
                  key={block.id}
                  className={`rounded-xl p-3 text-white transition-all border-2 flex items-center justify-between gap-3 shadow-xs ${
                    isHighlight
                      ? 'ring-4 ring-cyan-400 scale-[1.01] border-white'
                      : 'border-black/10'
                  }`}
                  style={{ backgroundColor: colorInfo.bg }}
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="w-5 h-5 rounded-full bg-black/20 text-white text-[10px] font-black flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>

                    <span className="text-xs font-bold">
                      {block.type === 'when_flag_clicked' && '⚑ Ketika program AI dijalankan'}
                      {block.type === 'ai_detect_face' && '🔍 [AI Vision] Pindai & deteksi wajah dari sensor kamera'}
                      {block.type === 'play_sound_jump' && 'Bunyikan nada konfirmasi'}
                      {block.type === 'bounce_edge' && 'Jika di pinggir, pantulkan'}
                    </span>

                    {block.type === 'tts_speak' && (
                      <div className="flex items-center gap-1.5 text-xs font-bold flex-wrap">
                        <span>[TTS Suara Pintar] Ucapkan:</span>
                        <input
                          type="text"
                          value={block.params.text ?? 'Halo'}
                          onChange={e => updateBlockParam(block.id, 'text', e.target.value)}
                          className="px-2 py-0.5 rounded bg-white text-slate-900 font-bold focus:outline-none min-w-[200px]"
                        />
                      </div>
                    )}

                    {block.type === 'robot_led' && (
                      <div className="flex items-center gap-1.5 text-xs font-bold">
                        <span>[Quarky] Atur lampu LED RGB ke:</span>
                        <select
                          value={block.params.color || 'Hijau'}
                          onChange={e => updateBlockParam(block.id, 'color', e.target.value)}
                          className="px-2 py-0.5 rounded bg-white text-slate-900 font-black focus:outline-none cursor-pointer"
                        >
                          <option value="Hijau">Hijau</option>
                          <option value="Biru">Biru</option>
                          <option value="Merah">Merah</option>
                          <option value="Kuning">Kuning</option>
                          <option value="Ungu">Ungu</option>
                        </select>
                      </div>
                    )}

                    {block.type === 'robot_buzzer' && (
                      <div className="flex items-center gap-1.5 text-xs font-bold">
                        <span>[Quarky] Bunyikan nada buzzer:</span>
                        <input
                          type="number"
                          value={block.params.freq || 440}
                          onChange={e => updateBlockParam(block.id, 'freq', Number(e.target.value))}
                          className="w-16 px-1 py-0.5 rounded bg-white text-slate-900 font-black text-center focus:outline-none"
                        />
                        <span>Hz</span>
                      </div>
                    )}

                    {block.type === 'robot_drive' && (
                      <div className="flex items-center gap-1.5 text-xs font-bold">
                        <span>[Quarky] Jalankan motor roda maju kecepatan:</span>
                        <input
                          type="number"
                          value={block.params.speed || 80}
                          onChange={e => updateBlockParam(block.id, 'speed', Number(e.target.value))}
                          className="w-14 px-1 py-0.5 rounded bg-white text-slate-900 font-black text-center focus:outline-none"
                        />
                        <span>%</span>
                      </div>
                    )}

                    {block.type === 'say_for_secs' && (
                      <div className="flex items-center gap-1.5 text-xs font-bold flex-wrap">
                        <span>Katakan</span>
                        <input
                          type="text"
                          value={block.params.text ?? 'Halo'}
                          onChange={e => updateBlockParam(block.id, 'text', e.target.value)}
                          className="px-2 py-0.5 rounded bg-white text-slate-900 font-bold focus:outline-none min-w-[140px]"
                        />
                        <span>selama</span>
                        <input
                          type="number"
                          value={block.params.secs || 2}
                          onChange={e => updateBlockParam(block.id, 'secs', Number(e.target.value))}
                          className="w-12 px-1 py-0.5 rounded bg-white text-slate-900 font-black text-center focus:outline-none"
                        />
                        <span>detik</span>
                      </div>
                    )}

                    {block.type === 'turn_right' && (
                      <div className="flex items-center gap-1.5 text-xs font-bold">
                        <span>Belok kanan</span>
                        <input
                          type="number"
                          value={block.params.degrees || 45}
                          onChange={e => updateBlockParam(block.id, 'degrees', Number(e.target.value))}
                          className="w-14 px-1.5 py-0.5 rounded bg-white text-slate-900 font-black text-center focus:outline-none"
                        />
                        <span>derajat</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0 bg-black/20 rounded-lg p-1">
                    <button
                      onClick={() => moveBlockOrder(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1 hover:bg-white/20 rounded disabled:opacity-30"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => moveBlockOrder(idx, 'down')}
                      disabled={idx === blocks.length - 1}
                      className="p-1 hover:bg-white/20 rounded disabled:opacity-30"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => removeBlock(block.id)}
                      className="p-1 hover:bg-rose-500 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* PANE 3: PictoBlox AI & Robotics Stage */}
        <div className="w-full lg:w-[480px] bg-slate-900 text-white flex flex-col shrink-0">
          {/* Mode Switcher: AI Camera Vision vs Quarky Robotics */}
          <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setStageMode('camera')}
                className={`px-3 py-1 rounded-md font-bold flex items-center gap-1.5 transition-colors ${
                  stageMode === 'camera'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>AI Vision</span>
              </button>
              <button
                onClick={() => setStageMode('robot')}
                className={`px-3 py-1 rounded-md font-bold flex items-center gap-1.5 transition-colors ${
                  stageMode === 'robot'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Robot Quarky</span>
              </button>
            </div>

            {stageMode === 'camera' && (
              <button
                onClick={() => setUseWebcam(!useWebcam)}
                className={`px-2.5 py-1 rounded text-xs font-bold border transition-colors ${
                  useWebcam
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                {useWebcam ? 'Kamera Aktif' : 'Gunakan Webcam Asli'}
              </button>
            )}
          </div>

          {/* STAGE DISPLAY */}
          <div className="p-3 flex-1 flex flex-col justify-center">
            {stageMode === 'camera' ? (
              /* AI COMPUTER VISION STAGE */
              <div className="w-full aspect-[4/3] rounded-2xl relative overflow-hidden bg-slate-950 border-2 border-indigo-500/40 shadow-xl flex flex-col items-center justify-center">
                {/* Real Webcam or Simulated Face Canvas */}
                {useWebcam ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="absolute inset-0 w-full h-full object-cover transform -scale-x-100"
                  />
                ) : (
                  /* Simulated Camera Room with Kid Friendly Avatar */
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 flex items-center justify-center">
                    {/* Background Grid */}
                    <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:16px_16px]" />

                    {/* Robot Mascot Tobi */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-32 h-32 rounded-3xl bg-indigo-600/30 border-2 border-indigo-400/50 flex items-center justify-center shadow-lg backdrop-blur-xs">
                        <Bot className="w-20 h-20 text-cyan-400" />
                      </div>
                      <span className="text-xs font-black text-cyan-300 mt-2 tracking-wider uppercase">
                        Avatar Tobi AI
                      </span>
                    </div>
                  </div>
                )}

                {/* AI Facial Recognition HUD Overlay */}
                <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between">
                  {/* Top HUD */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-indigo-500/30 text-[11px] text-cyan-300 font-mono">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span>AI Model: MobileNet FaceMesh v2</span>
                    </div>

                    <div className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-indigo-500/30 text-[11px] text-slate-300 font-mono">
                      FPS: 30 • 1 Face
                    </div>
                  </div>

                  {/* Bounding Box Scanner */}
                  <div className="relative mx-auto w-44 h-44 border-2 border-cyan-400/80 rounded-2xl flex flex-col justify-between p-2 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                    <div className="flex justify-between text-[10px] font-mono text-cyan-300 font-bold">
                      <span>[FACE #1]</span>
                      <span>{detectedConfidence}%</span>
                    </div>

                    {isScanningFace && (
                      <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-bounce" />
                    )}

                    <div className="flex items-center justify-between text-[10px] font-bold bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/40 text-cyan-200">
                      <span>Mood:</span>
                      <span className="text-emerald-300 flex items-center gap-1">
                        <Smile className="w-3 h-3" />
                        {detectedEmotion}
                      </span>
                    </div>
                  </div>

                  {/* Speech Bubble on Stage */}
                  {speechText && (
                    <div className="bg-white text-slate-900 px-4 py-2 rounded-2xl text-xs font-black shadow-2xl border-2 border-indigo-600 text-center max-w-sm mx-auto animate-bounce">
                      💬 {speechText}
                    </div>
                  )}

                  {/* Bottom Status bar */}
                  <div className="flex items-center justify-between bg-black/70 backdrop-blur-md p-2 rounded-xl border border-slate-800 text-[11px]">
                    <span className="text-slate-400">Status Modul:</span>
                    <span className="font-bold text-emerald-400">
                      Deteksi Wajah & Text-to-Speech Siap
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* QUARKY HARDWARE ROBOTICS STAGE */
              <div className="w-full aspect-[4/3] rounded-2xl relative overflow-hidden bg-slate-950 border-2 border-teal-500/40 p-6 flex flex-col items-center justify-center">
                <div className="text-center mb-4">
                  <span className="text-xs font-mono uppercase text-teal-400 tracking-wider">
                    Virtual Quarky Robot Simulator
                  </span>
                  <h3 className="text-lg font-bold text-white">Quarky ESP32 Micro-Controller</h3>
                </div>

                {/* Simulated Quarky Hardware Board */}
                <div className="relative w-64 h-48 bg-slate-900 border-4 border-teal-500/80 rounded-3xl p-4 shadow-2xl flex flex-col items-center justify-between">
                  {/* Ultrasonic Distance Sensors (Eyes) */}
                  <div className="flex items-center gap-8">
                    <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-teal-400 flex items-center justify-center">
                      <div className="w-4 h-4 rounded-full bg-cyan-400/80 animate-ping" />
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-teal-400 flex items-center justify-center">
                      <div className="w-4 h-4 rounded-full bg-cyan-400/80 animate-ping" />
                    </div>
                  </div>

                  {/* Central RGB LED Matrix */}
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center transition-all duration-300 ${getLedColorStyle(
                        quarkyLedColor
                      )}`}
                    >
                      <Zap className="w-8 h-8 text-white" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-300 uppercase">
                      RGB LED: {quarkyLedColor}
                    </span>
                  </div>

                  {/* Motor & Wheels Indicator */}
                  <div className="w-full flex items-center justify-between px-2 text-[11px] font-mono">
                    <div className="flex items-center gap-1 text-teal-300">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          quarkySpeed > 0 ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'
                        }`}
                      />
                      <span>Roda: {quarkySpeed}%</span>
                    </div>

                    <div className="flex items-center gap-1 text-teal-300">
                      <Volume2 className={`w-3.5 h-3.5 ${isBuzzerActive ? 'text-amber-400 animate-bounce' : 'text-slate-600'}`} />
                      <span>Buzzer: {isBuzzerActive ? 'Aktif' : 'Standby'}</span>
                    </div>
                  </div>
                </div>

                {/* Speech Bubble on Stage */}
                {speechText && (
                  <div className="mt-4 bg-white text-slate-900 px-4 py-2 rounded-2xl text-xs font-black shadow-2xl border-2 border-teal-600 text-center max-w-sm animate-bounce">
                    💬 {speechText}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Hardware & Voice Controls */}
          <div className="bg-slate-950 border-t border-slate-800 p-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Teknologi: OpenCV AI + Web Speech Synthesis</span>
            </div>
            <button
              onClick={() => speakText('Halo! Suara AI PictoBlox berhasil diuji coba!')}
              className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-colors flex items-center gap-1 shadow-xs"
            >
              <Volume2 className="w-3.5 h-3.5" />
              Uji Coba Suara AI
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
