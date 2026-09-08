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
  Image as ImageIcon,
  HelpCircle,
  FolderOpen,
  Maximize2,
  Minimize2,
  ExternalLink,
  Code2,
  Globe,
  Lightbulb,
  Paintbrush,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  BookOpen,
  User,
  Share2,
  Settings,
  Folder,
  Edit3,
  Bug,
  ZoomIn,
  ZoomOut,
  Cloud,
  Eye,
  EyeOff
} from 'lucide-react';
import {
  BlockTemplate,
  BlockInstance,
  CATEGORY_COLORS,
  SCRATCH_BLOCK_TEMPLATES
} from './blockDefinitions';
import { SPRITES, BACKDROPS, SpriteItem, BackdropItem } from './spritesData';
import { playCatMeow, playPop, playJumpSound, stopAllAudio } from '../../utils/studioAudio';
import { saveProjectToFirestore, fetchProjectsFromFirestore } from '../../lib/firebase';

export const ScratchLiveStudio: React.FC = () => {
  // Preset Projects
  const PRESETS: Record<string, { name: string; blocks: BlockInstance[]; spriteId: string; backdropId: string }> = {
    cat_walk: {
      name: '🐱 Kucing Berjalan & Meong',
      spriteId: 'cat',
      backdropId: 'stage_white',
      blocks: [
        { id: 'b1', type: 'when_flag_clicked', category: 'events', params: {} },
        { id: 'b2', type: 'say_for_secs', category: 'looks', params: { text: 'Halo Teman-Teman!', secs: 2 } },
        { id: 'b3', type: 'play_sound_meow', category: 'sound', params: {} },
        { id: 'b4', type: 'repeat', category: 'control', params: { count: 6 } },
        { id: 'b5', type: 'move_steps', category: 'motion', params: { steps: 25 } },
        { id: 'b6', type: 'turn_right', category: 'motion', params: { degrees: 15 } },
        { id: 'b7', type: 'bounce_edge', category: 'motion', params: {} },
        { id: 'b8', type: 'say_for_secs', category: 'looks', params: { text: 'GenZi Code Keren Banget!', secs: 2 } }
      ]
    },
    bounce_ball: {
      name: '🏀 Pantulan Bola & Rotasi',
      spriteId: 'ball',
      backdropId: 'field',
      blocks: [
        { id: 'b1', type: 'when_flag_clicked', category: 'events', params: {} },
        { id: 'b2', type: 'set_size', category: 'looks', params: { size: 120 } },
        { id: 'b3', type: 'repeat', category: 'control', params: { count: 8 } },
        { id: 'b4', type: 'move_steps', category: 'motion', params: { steps: 35 } },
        { id: 'b5', type: 'turn_right', category: 'motion', params: { degrees: 45 } },
        { id: 'b6', type: 'play_sound_pop', category: 'sound', params: {} },
        { id: 'b7', type: 'bounce_edge', category: 'motion', params: {} }
      ]
    },
    star_jump: {
      name: '⭐ Bintang Bersinar & Nada 8-Bit',
      spriteId: 'star',
      backdropId: 'space_night',
      blocks: [
        { id: 'b1', type: 'when_flag_clicked', category: 'events', params: {} },
        { id: 'b2', type: 'say_for_secs', category: 'looks', params: { text: 'Aku Bintang Angkasa!', secs: 1.5 } },
        { id: 'b3', type: 'play_sound_jump', category: 'sound', params: {} },
        { id: 'b4', type: 'repeat', category: 'control', params: { count: 5 } },
        { id: 'b5', type: 'change_size', category: 'looks', params: { dSize: 15 } },
        { id: 'b6', type: 'turn_left', category: 'motion', params: { degrees: 30 } },
        { id: 'b7', type: 'play_sound_pop', category: 'sound', params: {} }
      ]
    }
  };

  // State
  const [blocks, setBlocks] = useState<BlockInstance[]>(PRESETS.cat_walk.blocks);
  const [selectedCategory, setSelectedCategory] = useState<string>('motion');
  const [activeSprite, setActiveSprite] = useState<SpriteItem>(SPRITES[0]);
  const [activeBackdrop, setActiveBackdrop] = useState<BackdropItem>(BACKDROPS[0]);

  // Sprite Live State on Stage (Canvas coordinates center 0,0)
  const [spriteX, setSpriteX] = useState<number>(0);
  const [spriteY, setSpriteY] = useState<number>(0);
  const [direction, setDirection] = useState<number>(90);
  const [size, setSize] = useState<number>(100);
  const [visible, setVisible] = useState<boolean>(true);
  const [speechText, setSpeechText] = useState<string | null>(null);
  const [speechType, setSpeechType] = useState<'say' | 'think'>('say');

  // Execution State
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeBlockIndex, setActiveBlockIndex] = useState<number | null>(null);
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [showSpritePicker, setShowSpritePicker] = useState<boolean>(false);
  const [showBackdropPicker, setShowBackdropPicker] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Authentic Scratch 3.0 Tabs & Tutorial State
  const [activeStudioTab, setActiveStudioTab] = useState<'code' | 'costumes' | 'sounds'>('code');
  const [showTutorial, setShowTutorial] = useState<boolean>(true);
  const [tutorialStep, setTutorialStep] = useState<number>(0);
  const [projectName, setProjectName] = useState<string>('Proyek Scratch Saya');
  const [showFileMenu, setShowFileMenu] = useState<boolean>(false);
  const [showEditMenu, setShowEditMenu] = useState<boolean>(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState<boolean>(false);
  const [isSavingToCloud, setIsSavingToCloud] = useState<boolean>(false);
  const [cloudSaveStatus, setCloudSaveStatus] = useState<string | null>(null);
  const [stageLayoutMode, setStageLayoutMode] = useState<'normal' | 'small' | 'large'>('normal');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [costumeNumber, setCostumeNumber] = useState<1 | 2>(1);

  const handleSaveToCloud = async () => {
    setIsSavingToCloud(true);
    try {
      const res = await saveProjectToFirestore({
        id: `scratch_${Date.now()}`,
        title: projectName,
        studioType: 'scratch',
        content: {
          blocks,
          spriteId: activeSprite.id,
          backdropId: activeBackdrop.id
        },
        updatedAt: new Date().toISOString()
      });
      if (res) {
        setCloudSaveStatus('Tersimpan di Cloud Database!');
      } else {
        setCloudSaveStatus('Tersimpan di Cache');
      }
    } catch {
      setCloudSaveStatus('Tersimpan di Cache');
    } finally {
      setIsSavingToCloud(false);
      setTimeout(() => setCloudSaveStatus(null), 3500);
    }
  };

  const TUTORIAL_STEPS = [
    {
      title: '1. Tarik Blok Gerak (Move)',
      desc: 'Mulai dengan membuat sprite bergerak. Tarik blok [gerak 15 langkah] ke area kerja skrip di tengah.',
      blockPreview: 'gerak (15) langkah',
      color: '#4C97FF'
    },
    {
      title: '2. Tambahkan Balon Kata (Say)',
      desc: 'Buat Kucing Scratch menyapa kawan-kawan! Tambahkan blok [katakan "Halo!" selama 2 detik].',
      blockPreview: 'katakan [Halo Teman-Teman!] selama (2) detik',
      color: '#9966FF'
    },
    {
      title: '3. Mainkan Efek Suara (Sound)',
      desc: 'Tambahkan suara meong khas Scratch dengan memasang blok [mainkan suara meong].',
      blockPreview: 'mainkan suara [meong]',
      color: '#CF63CF'
    },
    {
      title: '4. Mulai dengan Bendera Hijau (Events)',
      desc: 'Sambungkan blok [ketika bendera hijau diklik] di paling atas, lalu tekan tombol Mulai (Bendera Hijau)!',
      blockPreview: 'ketika 🚩 diklik',
      color: '#FFBF00'
    }
  ];

  const handleApplyTutorial = () => {
    setBlocks([
      { id: 'tut-1', type: 'when_flag_clicked', category: 'events', params: {} },
      { id: 'tut-2', type: 'say_for_secs', category: 'looks', params: { text: 'Halo Teman-Teman! Selamat datang di Scratch!', secs: 2 } },
      { id: 'tut-3', type: 'play_sound_meow', category: 'sound', params: {} },
      { id: 'tut-4', type: 'move_steps', category: 'motion', params: { steps: 25 } },
      { id: 'tut-5', type: 'turn_right', category: 'motion', params: { degrees: 15 } }
    ]);
    playJumpSound();
    setActiveStudioTab('code');
  };

  // Dragging Sprite on Stage
  const stageRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef<boolean>(false);
  const abortExecutionRef = useRef<boolean>(false);

  // Add block to script
  const addBlock = (template: BlockTemplate) => {
    const newBlock: BlockInstance = {
      id: 'blk_' + Math.random().toString(36).substring(2, 9),
      type: template.type,
      category: template.category,
      params: { ...template.defaultParams }
    };
    setBlocks(prev => [...prev, newBlock]);
  };

  // Remove block
  const removeBlock = (id: string) => {
    setBlocks(prev => prev.filter(b => b.id !== id));
  };

  // Move block up or down
  const moveBlockOrder = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= blocks.length) return;
    const newBlocks = [...blocks];
    const [moved] = newBlocks.splice(index, 1);
    newBlocks.splice(newIndex, 0, moved);
    setBlocks(newBlocks);
  };

  // Update block param
  const updateBlockParam = (blockId: string, paramKey: string, value: string | number) => {
    setBlocks(prev =>
      prev.map(b => (b.id === blockId ? { ...b, params: { ...b.params, [paramKey]: value } } : b))
    );
  };

  // Stop Execution
  const handleStop = () => {
    abortExecutionRef.current = true;
    setIsRunning(false);
    setActiveBlockIndex(null);
    setSpeechText(null);
    stopAllAudio();
  };

  useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, []);

  // Reset Sprite to Center
  const handleResetPosition = () => {
    handleStop();
    setSpriteX(0);
    setSpriteY(0);
    setDirection(90);
    setSize(100);
    setVisible(true);
    setSpeechText(null);
  };

  // Load Preset
  const handleLoadPreset = (key: string) => {
    handleStop();
    const preset = PRESETS[key];
    if (preset) {
      setBlocks(preset.blocks);
      const sp = SPRITES.find(s => s.id === preset.spriteId) || SPRITES[0];
      const bg = BACKDROPS.find(b => b.id === preset.backdropId) || BACKDROPS[0];
      setActiveSprite(sp);
      setActiveBackdrop(bg);
      handleResetPosition();
    }
  };

  // Real Execution Engine
  const handleRun = async () => {
    if (isRunning) {
      handleStop();
      return;
    }

    abortExecutionRef.current = false;
    setIsRunning(true);

    // Sleep helper that honors abort
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

    // Execute list of blocks
    try {
      for (let i = 0; i < blocks.length; i++) {
        if (abortExecutionRef.current) break;
        const block = blocks[i];
        setActiveBlockIndex(i);

        switch (block.type) {
          case 'when_flag_clicked':
            // Starter
            await sleep(150);
            break;

          case 'move_steps': {
            const steps = Number(block.params.steps) || 15;
            setSpriteX(prevX => {
              const rad = (direction * Math.PI) / 180;
              const nextX = prevX + Math.cos(rad) * steps;
              return Math.max(-210, Math.min(210, nextX));
            });
            setSpriteY(prevY => {
              const rad = (direction * Math.PI) / 180;
              const nextY = prevY - Math.sin(rad) * steps;
              return Math.max(-150, Math.min(150, nextY));
            });
            await sleep(200);
            break;
          }

          case 'turn_right': {
            const deg = Number(block.params.degrees) || 15;
            setDirection(prev => (prev + deg) % 360);
            await sleep(180);
            break;
          }

          case 'turn_left': {
            const deg = Number(block.params.degrees) || 15;
            setDirection(prev => (prev - deg + 360) % 360);
            await sleep(180);
            break;
          }

          case 'goto_xy': {
            const targetX = Number(block.params.x) || 0;
            const targetY = Number(block.params.y) || 0;
            setSpriteX(Math.max(-210, Math.min(210, targetX)));
            setSpriteY(Math.max(-150, Math.min(150, -targetY)));
            await sleep(250);
            break;
          }

          case 'bounce_edge': {
            setSpriteX(x => {
              if (x <= -200 || x >= 200) {
                setDirection(d => (180 - d + 360) % 360);
              }
              return x;
            });
            setSpriteY(y => {
              if (y <= -140 || y >= 140) {
                setDirection(d => (360 - d) % 360);
              }
              return y;
            });
            await sleep(120);
            break;
          }

          case 'point_direction': {
            const d = Number(block.params.direction) || 90;
            setDirection(d);
            await sleep(150);
            break;
          }

          case 'say_for_secs': {
            const txt = String(block.params.text || 'Halo!');
            const secs = Number(block.params.secs) || 2;
            setSpeechType('say');
            setSpeechText(txt);
            await sleep(secs * 1000);
            if (!abortExecutionRef.current) {
              setSpeechText(null);
            }
            break;
          }

          case 'think_for_secs': {
            const txt = String(block.params.text || 'Hmm...');
            const secs = Number(block.params.secs) || 2;
            setSpeechType('think');
            setSpeechText(txt);
            await sleep(secs * 1000);
            if (!abortExecutionRef.current) {
              setSpeechText(null);
            }
            break;
          }

          case 'change_size': {
            const ds = Number(block.params.dSize) || 10;
            setSize(s => Math.max(30, Math.min(200, s + ds)));
            await sleep(150);
            break;
          }

          case 'set_size': {
            const s = Number(block.params.size) || 100;
            setSize(Math.max(30, Math.min(200, s)));
            await sleep(150);
            break;
          }

          case 'play_sound_meow':
            playCatMeow();
            await sleep(400);
            break;

          case 'play_sound_pop':
            playPop();
            await sleep(200);
            break;

          case 'play_sound_jump':
            playJumpSound();
            await sleep(250);
            break;

          case 'wait_secs': {
            const w = Number(block.params.secs) || 1;
            await sleep(w * 1000);
            break;
          }

          case 'repeat': {
            const count = Number(block.params.count) || 4;
            // Repeat subsequent motion or sound
            for (let c = 0; c < count; c++) {
              if (abortExecutionRef.current) break;
              setSpriteX(prevX => {
                const rad = (direction * Math.PI) / 180;
                const nextX = prevX + Math.cos(rad) * 12;
                return Math.max(-210, Math.min(210, nextX));
              });
              setDirection(prev => (prev + 10) % 360);
              await sleep(120);
            }
            break;
          }

          default:
            await sleep(100);
            break;
        }
      }
    } finally {
      setIsRunning(false);
      setActiveBlockIndex(null);
    }
  };

  // Mouse drag on stage
  const handleStageMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    updateSpritePosFromMouse(e.clientX, e.clientY);
  };

  const handleStageMouseMove = (e: React.MouseEvent) => {
    if (isDraggingRef.current) {
      updateSpritePosFromMouse(e.clientX, e.clientY);
    }
  };

  const handleStageMouseUp = () => {
    isDraggingRef.current = false;
  };

  const updateSpritePosFromMouse = (clientX: number, clientY: number) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const x = Math.round(clientX - centerX);
    const y = Math.round(clientY - centerY);

    setSpriteX(Math.max(-220, Math.min(220, x)));
    setSpriteY(Math.max(-150, Math.min(150, y)));
  };

  // Available categories matching Scratch 3.0
  const categories = [
    { id: 'motion', label: 'Motion', color: '#4C97FF' },
    { id: 'looks', label: 'Looks', color: '#9966FF' },
    { id: 'sound', label: 'Sound', color: '#CF63CF' },
    { id: 'events', label: 'Events', color: '#FFBF00' },
    { id: 'control', label: 'Control', color: '#FFAB19' },
    { id: 'sensing', label: 'Sensing', color: '#5CB1D6' },
    { id: 'operators', label: 'Operators', color: '#59C059' },
    { id: 'variables', label: 'Variables', color: '#FF8C1A' },
    { id: 'my_blocks', label: 'My Blocks', color: '#FF6680' }
  ];

  const filteredTemplates = SCRATCH_BLOCK_TEMPLATES.filter(
    t => t.category === selectedCategory
  );

  const renderBlockLabel = (block: BlockInstance) => {
    switch (block.type) {
      case 'when_flag_clicked':
        return (
          <span className="flex items-center gap-1.5 font-bold">
            <span className="text-emerald-300">⚑</span>
            <span>ketika bendera hijau diklik</span>
          </span>
        );
      case 'when_sprite_clicked':
        return <span>ketika sprite ini diklik</span>;
      case 'move_steps':
        return (
          <div className="flex items-center gap-1.5 font-bold">
            <span>gerak</span>
            <input
              type="number"
              value={block.params.steps ?? 15}
              onChange={e => updateBlockParam(block.id, 'steps', Number(e.target.value))}
              className="w-14 px-1.5 py-0.5 rounded bg-white text-slate-900 font-black text-center focus:outline-none"
            />
            <span>langkah</span>
          </div>
        );
      case 'turn_right':
        return (
          <div className="flex items-center gap-1.5 font-bold">
            <span>putar kanan ↷</span>
            <input
              type="number"
              value={block.params.degrees ?? 15}
              onChange={e => updateBlockParam(block.id, 'degrees', Number(e.target.value))}
              className="w-14 px-1.5 py-0.5 rounded bg-white text-slate-900 font-black text-center focus:outline-none"
            />
            <span>derajat</span>
          </div>
        );
      case 'turn_left':
        return (
          <div className="flex items-center gap-1.5 font-bold">
            <span>putar kiri ↶</span>
            <input
              type="number"
              value={block.params.degrees ?? 15}
              onChange={e => updateBlockParam(block.id, 'degrees', Number(e.target.value))}
              className="w-14 px-1.5 py-0.5 rounded bg-white text-slate-900 font-black text-center focus:outline-none"
            />
            <span>derajat</span>
          </div>
        );
      case 'goto_xy':
        return (
          <div className="flex items-center gap-1.5 font-bold">
            <span>pergi ke x:</span>
            <input
              type="number"
              value={block.params.x ?? 0}
              onChange={e => updateBlockParam(block.id, 'x', Number(e.target.value))}
              className="w-12 px-1 py-0.5 rounded bg-white text-slate-900 font-black text-center focus:outline-none"
            />
            <span>y:</span>
            <input
              type="number"
              value={block.params.y ?? 0}
              onChange={e => updateBlockParam(block.id, 'y', Number(e.target.value))}
              className="w-12 px-1 py-0.5 rounded bg-white text-slate-900 font-black text-center focus:outline-none"
            />
          </div>
        );
      case 'say_for_secs':
        return (
          <div className="flex items-center gap-1.5 font-bold flex-wrap">
            <span>katakan</span>
            <input
              type="text"
              value={block.params.text ?? 'Halo!'}
              onChange={e => updateBlockParam(block.id, 'text', e.target.value)}
              className="px-2 py-0.5 rounded bg-white text-slate-900 font-bold focus:outline-none min-w-[100px]"
            />
            <span>selama</span>
            <input
              type="number"
              value={block.params.secs ?? 2}
              onChange={e => updateBlockParam(block.id, 'secs', Number(e.target.value))}
              className="w-12 px-1 py-0.5 rounded bg-white text-slate-900 font-black text-center focus:outline-none"
            />
            <span>detik</span>
          </div>
        );
      case 'think_for_secs':
        return (
          <div className="flex items-center gap-1.5 font-bold flex-wrap">
            <span>berpikir</span>
            <input
              type="text"
              value={block.params.text ?? 'Hmm...'}
              onChange={e => updateBlockParam(block.id, 'text', e.target.value)}
              className="px-2 py-0.5 rounded bg-white text-slate-900 font-bold focus:outline-none min-w-[100px]"
            />
            <span>selama</span>
            <input
              type="number"
              value={block.params.secs ?? 2}
              onChange={e => updateBlockParam(block.id, 'secs', Number(e.target.value))}
              className="w-12 px-1 py-0.5 rounded bg-white text-slate-900 font-black text-center focus:outline-none"
            />
            <span>detik</span>
          </div>
        );
      case 'change_size':
        return (
          <div className="flex items-center gap-1.5 font-bold">
            <span>ubah ukuran sebesar</span>
            <input
              type="number"
              value={block.params.dSize ?? 10}
              onChange={e => updateBlockParam(block.id, 'dSize', Number(e.target.value))}
              className="w-12 px-1 py-0.5 rounded bg-white text-slate-900 font-black text-center focus:outline-none"
            />
          </div>
        );
      case 'set_size':
        return (
          <div className="flex items-center gap-1.5 font-bold">
            <span>atur ukuran ke</span>
            <input
              type="number"
              value={block.params.size ?? 100}
              onChange={e => updateBlockParam(block.id, 'size', Number(e.target.value))}
              className="w-14 px-1.5 py-0.5 rounded bg-white text-slate-900 font-black text-center focus:outline-none"
            />
            <span>%</span>
          </div>
        );
      case 'wait_secs':
        return (
          <div className="flex items-center gap-1.5 font-bold">
            <span>tunggu</span>
            <input
              type="number"
              value={block.params.secs ?? 1}
              onChange={e => updateBlockParam(block.id, 'secs', Number(e.target.value))}
              className="w-12 px-1 py-0.5 rounded bg-white text-slate-900 font-black text-center focus:outline-none"
            />
            <span>detik</span>
          </div>
        );
      case 'repeat':
        return (
          <div className="flex items-center gap-1.5 font-bold">
            <span>ulangi</span>
            <input
              type="number"
              value={block.params.count ?? 6}
              onChange={e => updateBlockParam(block.id, 'count', Number(e.target.value))}
              className="w-12 px-1 py-0.5 rounded bg-white text-slate-900 font-black text-center focus:outline-none"
            />
            <span>kali</span>
          </div>
        );
      case 'play_sound_meow':
        return <span>bunyikan suara Meong 🐱</span>;
      case 'play_sound_pop':
        return <span>bunyikan suara Pop 🫧</span>;
      case 'play_sound_jump':
        return <span>bunyikan nada 8-Bit Jump 🎮</span>;
      case 'bounce_edge':
        return <span>jika di pinggir, pantulkan</span>;
      default: {
        const tmpl = SCRATCH_BLOCK_TEMPLATES.find(t => t.type === block.type);
        return <span>{tmpl ? tmpl.labelTemplate : block.type}</span>;
      }
    }
  };

  return (
    <div
      className={`bg-slate-100 dark:bg-slate-950 flex flex-col transition-all select-none ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen' : 'rounded-2xl border border-slate-300 dark:border-slate-800 shadow-md h-[820px]'
      }`}
    >
      {/* Scratch Authentic Top Header: #855CD6 */}
      <div className="bg-[#855CD6] text-white px-3 py-1.5 flex flex-wrap items-center justify-between gap-2 shadow-xs border-b border-[#7344CC] shrink-0 text-xs">
        <div className="flex items-center gap-2">
          {/* Authentic Scratch Logo */}
          <a
            href="https://scratch.mit.edu/projects/editor/?tutorial=getStarted"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-black/15 hover:bg-black/25 px-2.5 py-1 rounded-md transition-colors"
            title="Buka Editor Asli Scratch MIT"
          >
            <span className="font-extrabold text-base tracking-tight text-white font-sans lowercase">scratch</span>
            <span className="text-[10px] font-bold bg-[#FFAB19] text-amber-950 px-1 py-0.2 rounded uppercase">
              3.0
            </span>
          </a>

          {/* Settings / Globe Button */}
          <div className="relative">
            <button
              onClick={() => setShowSettingsMenu(!showSettingsMenu)}
              className="p-1.5 rounded-md hover:bg-white/15 text-white/95 font-semibold transition-colors flex items-center gap-1"
              title="Pengaturan Bahasa & Tampilan"
            >
              <Globe className="w-3.5 h-3.5 text-white" />
              <ChevronDown className="w-3 h-3 text-white/70" />
            </button>
            {showSettingsMenu && (
              <div className="absolute left-0 top-full mt-1 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-200 dark:border-slate-800 p-1.5 w-40 z-50 text-slate-800 dark:text-white">
                <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase">Bahasa</div>
                <button
                  onClick={() => setShowSettingsMenu(false)}
                  className="w-full text-left px-2 py-1.5 rounded text-xs hover:bg-purple-50 dark:hover:bg-slate-800 font-bold text-purple-700 dark:text-purple-300"
                >
                  ✓ Bahasa Indonesia
                </button>
                <button
                  onClick={() => setShowSettingsMenu(false)}
                  className="w-full text-left px-2 py-1.5 rounded text-xs hover:bg-purple-50 dark:hover:bg-slate-800 font-medium text-slate-600 dark:text-slate-400"
                >
                  English
                </button>
              </div>
            )}
          </div>

          {/* File ▾ (Berkas) Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowFileMenu(!showFileMenu)}
              className="px-2 py-1 rounded-md hover:bg-white/15 text-white font-semibold transition-colors flex items-center gap-1"
            >
              <span>Berkas</span>
              <ChevronDown className="w-3 h-3 text-white/70" />
            </button>
            {showFileMenu && (
              <div className="absolute left-0 top-full mt-1 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-200 dark:border-slate-800 p-1.5 w-48 z-50 text-slate-800 dark:text-white">
                <button
                  onClick={() => { setBlocks([]); setShowFileMenu(false); }}
                  className="w-full text-left px-3 py-1.5 rounded text-xs hover:bg-purple-50 dark:hover:bg-slate-800 font-medium"
                >
                  Baru (Kosong)
                </button>
                <button
                  onClick={() => { handleLoadPreset('cat_walk'); setShowFileMenu(false); }}
                  className="w-full text-left px-3 py-1.5 rounded text-xs hover:bg-purple-50 dark:hover:bg-slate-800 font-medium"
                >
                  Muat Kucing Berjalan
                </button>
                <button
                  onClick={() => { handleSaveToCloud(); setShowFileMenu(false); }}
                  className="w-full text-left px-3 py-1.5 rounded text-xs hover:bg-purple-50 dark:hover:bg-slate-800 font-bold text-purple-700 dark:text-purple-300 flex items-center gap-1.5"
                >
                  <Cloud className="w-3.5 h-3.5" />
                  <span>Simpan ke Cloud Database</span>
                </button>
              </div>
            )}
          </div>

          {/* Edit ▾ Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowEditMenu(!showEditMenu)}
              className="px-2 py-1 rounded-md hover:bg-white/15 text-white font-semibold transition-colors flex items-center gap-1"
            >
              <span>Edit</span>
              <ChevronDown className="w-3 h-3 text-white/70" />
            </button>
            {showEditMenu && (
              <div className="absolute left-0 top-full mt-1 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-200 dark:border-slate-800 p-1.5 w-44 z-50 text-slate-800 dark:text-white">
                <button
                  onClick={() => { handleResetPosition(); setShowEditMenu(false); }}
                  className="w-full text-left px-3 py-1.5 rounded text-xs hover:bg-purple-50 dark:hover:bg-slate-800 font-medium"
                >
                  Pulihkan Posisi Sprite
                </button>
                <button
                  onClick={() => { setShowGrid(!showGrid); setShowEditMenu(false); }}
                  className="w-full text-left px-3 py-1.5 rounded text-xs hover:bg-purple-50 dark:hover:bg-slate-800 font-medium"
                >
                  {showGrid ? 'Sembunyikan Grid XY' : 'Tampilkan Grid XY'}
                </button>
              </div>
            )}
          </div>

          {/* Tutorials Lightbulb Button */}
          <button
            onClick={() => setShowTutorial(!showTutorial)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-bold transition-all ${
              showTutorial
                ? 'bg-amber-400 text-amber-950 ring-1 ring-white'
                : 'bg-white/15 hover:bg-white/25 text-white'
            }`}
            title="Buka / Tutup Tutorial Scratch"
          >
            <Lightbulb className="w-3.5 h-3.5 fill-current" />
            <span>Tutorial</span>
          </button>

          {/* Project Title Input with Cloud Status */}
          <div className="flex items-center bg-black/20 hover:bg-black/30 focus-within:bg-white focus-within:text-slate-900 text-white rounded-md px-2.5 py-1 transition-colors">
            <input
              type="text"
              value={projectName}
              onChange={e => setProjectName(e.target.value)}
              className="bg-transparent focus:outline-none font-semibold w-36 text-xs text-inherit"
              placeholder="Scratch Project"
            />
          </div>

          {/* Cloud Save Button connected to Database */}
          <button
            onClick={handleSaveToCloud}
            disabled={isSavingToCloud}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FF8C1A] hover:bg-[#E67E17] text-white font-bold transition-all shadow-xs active:scale-95"
            title="Simpan Proyek ke Cloud Database genzi-code"
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>{isSavingToCloud ? 'Menyimpan...' : 'Simpan ke Cloud'}</span>
          </button>
          {cloudSaveStatus && (
            <span className="text-[11px] font-bold text-amber-200">
              ✓ {cloudSaveStatus}
            </span>
          )}
        </div>

        {/* Right Side: Account links & MIT Official button */}
        <div className="flex items-center gap-2">
          <a
            href="https://scratch.mit.edu/projects/editor/?tutorial=getStarted"
            target="_blank"
            rel="noopener noreferrer"
            title="Buka Editor Asli Scratch MIT"
            className="hidden xl:flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/15 hover:bg-white/25 text-white text-xs font-semibold transition-colors"
          >
            <span>Scratch MIT Asli</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <div className="flex items-center gap-1 bg-black/15 px-2 py-0.5 rounded-md text-xs font-semibold">
            <span className="text-white/80">Gabung Scratch</span>
            <span className="text-white/40">|</span>
            <span className="text-white">Masuk</span>
          </div>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1 rounded-md bg-white/15 hover:bg-white/25 text-white transition-colors"
            title={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Sub-bar: Left Tabs (Kode, Kostum, Suara) + Right Controls (Green Flag, Red Stop, Layout Mode) */}
      <div className="bg-[#E9EEF2] dark:bg-slate-900 px-3 py-1 flex items-center justify-between border-b border-slate-300 dark:border-slate-800 text-xs shrink-0">
        {/* Left: Code, Costumes, Sounds Tabs */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveStudioTab('code')}
            className={`px-3 py-1.5 rounded-t-lg font-bold flex items-center gap-1.5 transition-all ${
              activeStudioTab === 'code'
                ? 'bg-white dark:bg-slate-800 text-[#4C97FF] shadow-xs border-t-2 border-[#4C97FF]'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-[#4C97FF]" />
            <span>Kode</span>
          </button>
          <button
            onClick={() => setActiveStudioTab('costumes')}
            className={`px-3 py-1.5 rounded-t-lg font-bold flex items-center gap-1.5 transition-all ${
              activeStudioTab === 'costumes'
                ? 'bg-white dark:bg-slate-800 text-[#9966FF] shadow-xs border-t-2 border-[#9966FF]'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Paintbrush className="w-3.5 h-3.5 text-[#9966FF]" />
            <span>Kostum</span>
          </button>
          <button
            onClick={() => setActiveStudioTab('sounds')}
            className={`px-3 py-1.5 rounded-t-lg font-bold flex items-center gap-1.5 transition-all ${
              activeStudioTab === 'sounds'
                ? 'bg-white dark:bg-slate-800 text-[#CF63CF] shadow-xs border-t-2 border-[#CF63CF]'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5 text-[#CF63CF]" />
            <span>Suara</span>
          </button>
        </div>

        {/* Right (Above Stage): Green Flag ⚑, Red Stop 🛑, Stage Layout Modes */}
        <div className="flex items-center gap-2">
          {/* Green Flag Button */}
          <button
            onClick={handleRun}
            title="Mulai Jalankan (Bendera Hijau)"
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
              isRunning
                ? 'bg-emerald-500 text-white ring-2 ring-emerald-300 scale-105 animate-pulse'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white hover:scale-105 active:scale-95 shadow-xs'
            }`}
          >
            <span className="text-sm font-black">⚑</span>
          </button>

          {/* Red Stop Button */}
          <button
            onClick={handleStop}
            title="Hentikan Program"
            className="w-7 h-7 rounded-full bg-rose-600 hover:bg-rose-700 active:scale-95 text-white flex items-center justify-center transition-all shadow-xs"
          >
            <Square className="w-3 h-3 fill-current" />
          </button>

          <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1" />

          {/* Stage Viewport Layout Modes */}
          <div className="flex items-center bg-white dark:bg-slate-800 rounded-md border border-slate-300 dark:border-slate-700 p-0.5">
            <button
              onClick={() => setStageLayoutMode('small')}
              className={`p-1 rounded text-xs ${stageLayoutMode === 'small' ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white' : 'text-slate-500'}`}
              title="Panggung Kecil"
            >
              <div className="w-3 h-2.5 border border-current rounded-xs" />
            </button>
            <button
              onClick={() => setStageLayoutMode('normal')}
              className={`p-1 rounded text-xs ${stageLayoutMode === 'normal' ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white' : 'text-slate-500'}`}
              title="Panggung Standar"
            >
              <div className="w-4 h-3 border-2 border-current rounded-xs" />
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1 rounded text-xs text-slate-500 hover:text-slate-800"
              title="Layar Penuh"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace 3-Pane Body */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* CONDITIONAL PANE: Code (Pane 1 & Pane 2) OR Costumes OR Sounds */}
        {activeStudioTab === 'code' ? (
          <>
            {/* COLUMN 1: Narrow Category Selection Bar (w-14 / 56px) matching Scratch 3.0 */}
            <div className="w-14 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col items-center py-2 justify-between shrink-0 select-none overflow-y-auto">
              <div className="flex flex-col items-center gap-2 w-full">
                {categories.map(cat => {
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex flex-col items-center justify-center w-12 py-1.5 rounded-lg transition-all group ${
                        isSelected ? 'bg-slate-100 dark:bg-slate-800' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`}
                      title={cat.label}
                    >
                      <span
                        className="w-5 h-5 rounded-full border border-black/10 shadow-2xs group-hover:scale-110 transition-transform"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="text-[9px] font-bold text-slate-600 dark:text-slate-400 mt-0.5 text-center leading-tight truncate w-full">
                        {cat.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Cyan Extension Button at bottom */}
              <button
                onClick={() => alert('Fitur Ekstensi Scratch (Music, Pen, Video Sensing) siap digunakan!')}
                className="w-10 h-10 rounded-xl bg-[#0FBD8C] hover:bg-[#0BA277] text-white flex items-center justify-center shadow-xs transition-all hover:scale-105 active:scale-95 mt-2"
                title="Tambahkan Ekstensi"
              >
                <Plus className="w-5 h-5 font-black" />
              </button>
            </div>

            {/* COLUMN 2: Blocks Palette (w-60 to w-64) */}
            <div className="w-64 bg-slate-50 dark:bg-slate-900/90 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0">
              <div className="p-2 border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  {categories.find(c => c.id === selectedCategory)?.label}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">Klik untuk pasang</span>
              </div>

              <div className="flex-1 p-2.5 overflow-y-auto space-y-2">
                {filteredTemplates.map(template => {
                  const colorInfo = CATEGORY_COLORS[template.category] || CATEGORY_COLORS.motion;
                  return (
                    <div
                      key={template.type}
                      onClick={() => addBlock(template)}
                      className="group relative px-3 py-2 rounded-lg cursor-pointer hover:shadow-md transition-all active:scale-[0.98] border border-black/15 shadow-2xs"
                      style={{ backgroundColor: colorInfo.bg }}
                    >
                      <span className="text-xs font-bold text-white tracking-wide pr-2 select-none">
                        {template.labelTemplate.replace(/{(\w+)}/g, '(__)')}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* COLUMN 3: Central Scripts Workspace Canvas */}
            <div
              className="flex-1 bg-[#F9F9F9] dark:bg-slate-950 flex flex-col overflow-hidden border-r border-slate-200 dark:border-slate-800 relative"
              style={{
                backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}
            >
              {/* Scratch Cat Watermark in top-right */}
              <div className="absolute top-4 right-4 opacity-10 pointer-events-none w-28 h-28 text-slate-900 dark:text-white">
                <svg viewBox="0 0 100 100" dangerouslySetInnerHTML={{ __html: SPRITES[0].svg }} />
              </div>

              {/* Workspace Header */}
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs px-3 py-1.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                  <Code2 className="w-3.5 h-3.5 text-[#4C97FF]" />
                  <span>Area Skrip ({blocks.length} blok terpasang)</span>
                </div>
                <button
                  onClick={() => setBlocks([])}
                  className="px-2 py-0.5 rounded text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold transition-colors"
                >
                  Bersihkan
                </button>
              </div>

              {/* Block Scripts Stack */}
              <div className="flex-1 p-4 overflow-y-auto space-y-1.5">
                {blocks.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
                    <Code2 className="w-12 h-12 stroke-1 mb-2 text-slate-300" />
                    <p className="font-bold text-sm text-slate-600 dark:text-slate-400">
                      Area skrip masih kosong
                    </p>
                    <p className="text-xs max-w-xs mt-1">
                      Pilih blok di sebelah kiri untuk memasangnya ke area skrip Scratch!
                    </p>
                  </div>
                ) : (
                  blocks.map((block, idx) => {
                    const colorInfo = CATEGORY_COLORS[block.category] || CATEGORY_COLORS.motion;
                    const isHighlight = activeBlockIndex === idx;

                    return (
                      <div
                        key={block.id}
                        className={`relative rounded-lg px-3 py-2 text-white transition-all border border-black/15 flex items-center justify-between gap-3 shadow-2xs ${
                          isHighlight
                            ? 'ring-4 ring-amber-400 scale-[1.01] border-white'
                            : ''
                        }`}
                        style={{ backgroundColor: colorInfo.bg }}
                      >
                        <div className="flex items-center gap-2 flex-1">
                          <span className="w-4 h-4 rounded-full bg-black/20 flex items-center justify-center text-[9px] font-bold shrink-0">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-bold">{renderBlockLabel(block)}</span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => moveBlockOrder(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1 rounded bg-black/20 hover:bg-black/40 disabled:opacity-30"
                            title="Pindah Naik"
                          >
                            <ChevronUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => moveBlockOrder(idx, 'down')}
                            disabled={idx === blocks.length - 1}
                            className="p-1 rounded bg-black/20 hover:bg-black/40 disabled:opacity-30"
                            title="Pindah Turun"
                          >
                            <ChevronDown className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => removeBlock(block.id)}
                            className="p-1 rounded bg-rose-600 hover:bg-rose-700"
                            title="Hapus Blok"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Bottom Right Zoom Controls */}
              <div className="absolute bottom-3 right-3 flex items-center bg-white dark:bg-slate-900 rounded-lg shadow-md border border-slate-200 dark:border-slate-800 p-0.5 text-xs text-slate-700 dark:text-slate-300">
                <button
                  onClick={() => setZoomLevel(prev => Math.min(140, prev + 10))}
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                  title="Perbesar"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setZoomLevel(prev => Math.max(70, prev - 10))}
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                  title="Perkecil"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setZoomLevel(100)}
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded font-bold text-[10px]"
                  title="Reset Zoom"
                >
                  =
                </button>
              </div>
            </div>
          </>
        ) : activeStudioTab === 'costumes' ? (
          /* TAB 2: Costumes Editor View */
          <div className="flex-1 bg-white dark:bg-slate-900 flex flex-col md:flex-row overflow-hidden border-r border-slate-200 dark:border-slate-800">
            {/* Costume List Left Sidebar */}
            <div className="w-full md:w-56 border-r border-slate-200 dark:border-slate-800 p-3 bg-slate-50 dark:bg-slate-950 space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Daftar Kostum Sprite
              </span>
              <button
                onClick={() => { setCostumeNumber(1); playPop(); }}
                className={`w-full p-2.5 rounded-xl border flex items-center gap-3 transition-all ${
                  costumeNumber === 1
                    ? 'border-[#9966FF] bg-purple-50 dark:bg-purple-950/40 shadow-xs ring-2 ring-[#9966FF]/30'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-800 p-1 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                  <svg viewBox={activeSprite.viewBox} className="w-8 h-8" dangerouslySetInnerHTML={{ __html: activeSprite.svg }} />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Kostum 1 (Berdiri)</div>
                  <div className="text-[10px] text-slate-400">Pose Default</div>
                </div>
              </button>

              <button
                onClick={() => { setCostumeNumber(2); playPop(); }}
                className={`w-full p-2.5 rounded-xl border flex items-center gap-3 transition-all ${
                  costumeNumber === 2
                    ? 'border-[#9966FF] bg-purple-50 dark:bg-purple-950/40 shadow-xs ring-2 ring-[#9966FF]/30'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-800 p-1 flex items-center justify-center border border-slate-200 dark:border-slate-700 transform scale-x-[-1]">
                  <svg viewBox={activeSprite.viewBox} className="w-8 h-8" dangerouslySetInnerHTML={{ __html: activeSprite.svg }} />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Kostum 2 (Melangkah)</div>
                  <div className="text-[10px] text-slate-400">Pose Bergerak</div>
                </div>
              </button>
            </div>

            {/* Costume Canvas Preview & Editor Mockup */}
            <div className="flex-1 p-6 flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-900/50">
              <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 flex flex-col items-center">
                <div className={`transition-transform duration-200 ${costumeNumber === 2 ? 'scale-x-[-1]' : ''}`}>
                  <svg viewBox={activeSprite.viewBox} className="w-40 h-40" dangerouslySetInnerHTML={{ __html: activeSprite.svg }} />
                </div>
                <div className="mt-4 text-center">
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block">
                    {activeSprite.name} - Kostum {costumeNumber}
                  </span>
                  <p className="text-xs text-slate-500 mt-1">
                    Ganti kostum di skrip dengan blok &quot;kostum berikutnya&quot; untuk animasi berjalan!
                  </p>
                  <button
                    onClick={() => { setCostumeNumber(costumeNumber === 1 ? 2 : 1); playPop(); }}
                    className="mt-3 px-4 py-2 rounded-xl bg-[#9966FF] hover:bg-[#854BE3] text-white font-bold text-xs shadow-md transition-all"
                  >
                    Ganti ke Kostum {costumeNumber === 1 ? '2' : '1'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* TAB 3: Sounds View */
          <div className="flex-1 bg-white dark:bg-slate-900 flex flex-col md:flex-row overflow-hidden border-r border-slate-200 dark:border-slate-800">
            {/* Sound Library Left Sidebar */}
            <div className="w-full md:w-64 border-r border-slate-200 dark:border-slate-800 p-3 bg-slate-50 dark:bg-slate-950 space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Pustaka Suara Terpasang
              </span>
              {[
                { name: 'Meong (Meow)', desc: 'Suara kucing khas Scratch', fn: playCatMeow },
                { name: 'Pop (Gelembung)', desc: 'Efek letupan sentuhan', fn: playPop },
                { name: 'Lompatan 8-Bit', desc: 'Efek game arcade', fn: playJumpSound }
              ].map((s, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">{s.name}</span>
                    <span className="text-[10px] text-slate-400">{s.desc}</span>
                  </div>
                  <button
                    onClick={() => s.fn()}
                    className="p-2 rounded-lg bg-[#CF63CF] hover:bg-[#B94BB9] text-white shadow-xs"
                    title="Putar Suara"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </button>
                </div>
              ))}
            </div>

            {/* Sound Waveform & Effects Editor */}
            <div className="flex-1 p-6 flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-900/50">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 w-full max-w-md text-center">
                <div className="flex items-center justify-center gap-1 h-20 mb-4 bg-slate-950 rounded-xl p-3">
                  {[40, 70, 30, 90, 60, 100, 80, 50, 95, 45, 85, 65, 30, 75, 50].map((h, i) => (
                    <div
                      key={i}
                      className="w-2 bg-[#CF63CF] rounded-full animate-pulse"
                      style={{ height: `${h}%`, animationDelay: `${i * 0.05}s` }}
                    />
                  ))}
                </div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                  Visualisasi Gelombang Suara (Meow.wav)
                </h4>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <button
                    onClick={() => playCatMeow()}
                    className="px-4 py-2 rounded-xl bg-[#CF63CF] hover:bg-[#B94BB9] text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Putar Audio</span>
                  </button>
                  <button
                    onClick={() => { playCatMeow(); }}
                    className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-xs font-semibold"
                  >
                    Lebih Cepat
                  </button>
                  <button
                    onClick={() => { playCatMeow(); }}
                    className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-xs font-semibold"
                  >
                    Lebih Lambat
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FLOATING GETTING STARTED TUTORIAL CARD (Matching ?tutorial=getStarted) */}
        {showTutorial && (
          <div className="absolute top-4 right-4 z-40 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border-2 border-amber-400 overflow-hidden animate-in fade-in slide-in-from-top-3">
            {/* Tutorial Header */}
            <div className="bg-amber-400 text-amber-950 p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 fill-amber-950" />
                <span className="font-bold text-xs">Memulai dengan Scratch</span>
              </div>
              <button
                onClick={() => setShowTutorial(false)}
                className="p-1 rounded-lg hover:bg-amber-500 text-amber-950 transition-colors"
                title="Tutup Tutorial"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Tutorial Body */}
            <div className="p-4">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-2">
                <span>Langkah {tutorialStep + 1} dari {TUTORIAL_STEPS.length}</span>
                <span className="text-amber-600 dark:text-amber-400">Tutorial Interaktif</span>
              </div>

              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                {TUTORIAL_STEPS[tutorialStep].title}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mb-3 leading-relaxed">
                {TUTORIAL_STEPS[tutorialStep].desc}
              </p>

              {/* Block Preview Pill */}
              <div
                className="p-2.5 rounded-xl text-white text-xs font-bold text-center shadow-xs mb-4"
                style={{ backgroundColor: TUTORIAL_STEPS[tutorialStep].color }}
              >
                {TUTORIAL_STEPS[tutorialStep].blockPreview}
              </div>

              {/* Navigation & Quick Apply Buttons */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => setTutorialStep(prev => Math.max(0, prev - 1))}
                  disabled={tutorialStep === 0}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold disabled:opacity-30"
                >
                  Sebelumnya
                </button>

                {tutorialStep < TUTORIAL_STEPS.length - 1 ? (
                  <button
                    onClick={() => setTutorialStep(prev => Math.min(TUTORIAL_STEPS.length - 1, prev + 1))}
                    className="px-3 py-1 rounded-lg bg-amber-400 hover:bg-amber-500 text-amber-950 text-xs font-bold"
                  >
                    Berikutnya
                  </button>
                ) : (
                  <button
                    onClick={handleApplyTutorial}
                    className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                  >
                    Terapkan ke Skrip!
                  </button>
                )}
              </div>

              <button
                onClick={handleApplyTutorial}
                className="w-full mt-3 py-2 px-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-indigo-100 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Langsung Terapkan Proyek Tutorial Ini</span>
              </button>
            </div>
          </div>
        )}

        {/* PANE 3: Authentic Scratch 3.0 Live Stage & Sprite Manager (Right) */}
        <div
          className={`bg-[#F9F9F9] dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col shrink-0 transition-all duration-200 ${
            stageLayoutMode === 'small' ? 'w-full lg:w-[350px]' : 'w-full lg:w-[460px]'
          }`}
        >
          {/* REAL STAGE CANVAS VIEWPORT */}
          <div className="p-2.5 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
            <div
              ref={stageRef}
              onMouseDown={handleStageMouseDown}
              onMouseMove={handleStageMouseMove}
              onMouseUp={handleStageMouseUp}
              className={`w-full aspect-[4/3] rounded-lg relative overflow-hidden border border-slate-300 dark:border-slate-700 shadow-2xs cursor-grab active:cursor-grabbing select-none ${activeBackdrop.backgroundClass}`}
            >
              {/* Optional Coordinate XY Grid */}
              {showGrid && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-x-0 top-1/2 h-px bg-rose-400/60" />
                  <div className="absolute inset-y-0 left-1/2 w-px bg-rose-400/60" />
                  <span className="absolute top-1 left-1 text-[9px] font-mono text-slate-500 font-bold">
                    (-240, 180)
                  </span>
                  <span className="absolute bottom-1 right-1 text-[9px] font-mono text-slate-500 font-bold">
                    (240, -180)
                  </span>
                  <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[9px] font-mono text-rose-600 font-bold bg-white/80 px-1 rounded">
                    (0, 0)
                  </span>
                </div>
              )}

              {/* RENDERED SPRITE */}
              {visible && (
                <div
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 pointer-events-none"
                  style={{
                    left: `calc(50% + ${spriteX}px)`,
                    top: `calc(50% + ${spriteY}px)`,
                    transform: `translate(-50%, -50%) rotate(${direction - 90}deg) scale(${size / 100})`
                  }}
                >
                  {/* Speech Bubble Above Sprite */}
                  {speechText && (
                    <div
                      className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white text-slate-900 border-2 border-slate-800 px-3 py-1 rounded-xl text-xs font-bold shadow-md whitespace-nowrap pointer-events-auto"
                      style={{
                        transform: `translateX(-50%) rotate(${-(direction - 90)}deg)`
                      }}
                    >
                      {speechText}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
                    </div>
                  )}

                  {/* Sprite SVG Inner Render */}
                  <svg
                    viewBox={activeSprite.viewBox}
                    className="w-20 h-20 drop-shadow-sm"
                    dangerouslySetInnerHTML={{ __html: activeSprite.svg }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* AUTHENTIC SPRITE PROPERTIES TOOLBAR */}
          <div className="px-3 py-2 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
            {/* Sprite Name */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-500">Sprite</span>
              <input
                type="text"
                readOnly
                value={activeSprite.name}
                className="w-24 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-bold text-slate-800 dark:text-slate-200 text-xs truncate"
              />
            </div>

            {/* X & Y */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-bold text-slate-500">x</span>
                <input
                  type="number"
                  value={spriteX}
                  onChange={e => setSpriteX(Number(e.target.value))}
                  className="w-12 bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-bold text-center text-xs"
                />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-bold text-slate-500">y</span>
                <input
                  type="number"
                  value={-spriteY}
                  onChange={e => setSpriteY(-Number(e.target.value))}
                  className="w-12 bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-bold text-center text-xs"
                />
              </div>
            </div>

            {/* Show / Hide Eye Buttons */}
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-bold text-slate-500">Tampil</span>
              <div className="flex bg-slate-100 dark:bg-slate-800 rounded p-0.5">
                <button
                  onClick={() => setVisible(true)}
                  className={`p-1 rounded ${visible ? 'bg-white dark:bg-slate-700 shadow-xs text-indigo-600' : 'text-slate-400'}`}
                  title="Tampilkan Sprite"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setVisible(false)}
                  className={`p-1 rounded ${!visible ? 'bg-white dark:bg-slate-700 shadow-xs text-rose-600' : 'text-slate-400'}`}
                  title="Sembunyikan Sprite"
                >
                  <EyeOff className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Size & Direction */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-bold text-slate-500">Ukuran</span>
                <input
                  type="number"
                  value={size}
                  onChange={e => setSize(Number(e.target.value))}
                  className="w-12 bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-bold text-center text-xs"
                />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-bold text-slate-500">Arah</span>
                <input
                  type="number"
                  value={direction}
                  onChange={e => setDirection(Number(e.target.value))}
                  className="w-12 bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-bold text-center text-xs"
                />
              </div>
            </div>
          </div>

          {/* DUAL PANE: Sprites Area (Left) + Stage Backdrop Area (Right) */}
          <div className="flex-1 flex overflow-hidden">
            {/* SPRITES LIST (65% width) */}
            <div className="flex-1 border-r border-slate-200 dark:border-slate-800 p-2.5 flex flex-col justify-between overflow-y-auto bg-slate-50/50 dark:bg-slate-900/50">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Sprite
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">
                    {SPRITES.length} Karakter
                  </span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {SPRITES.map(sp => (
                    <button
                      key={sp.id}
                      onClick={() => setActiveSprite(sp)}
                      className={`p-2 rounded-lg border flex flex-col items-center justify-center transition-all bg-white dark:bg-slate-800 ${
                        activeSprite.id === sp.id
                          ? 'border-[#4C97FF] ring-2 ring-[#4C97FF]/30 shadow-xs'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <svg
                        viewBox={sp.viewBox}
                        className="w-8 h-8 mb-1"
                        dangerouslySetInnerHTML={{ __html: sp.svg }}
                      />
                      <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 truncate w-full text-center">
                        {sp.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Choose Sprite Button (+) */}
              <div className="mt-3 flex justify-end">
                <button
                  onClick={() => alert('Pilih karakter sprite favoritmu dari daftar di atas!')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#00A1E4] hover:bg-[#0089C4] text-white text-xs font-bold shadow-sm transition-transform active:scale-95"
                  title="Pilih Sprite"
                >
                  <Plus className="w-3.5 h-3.5 font-bold" />
                  <span>Pilih Sprite</span>
                </button>
              </div>
            </div>

            {/* STAGE & BACKDROP PANE (35% width) */}
            <div className="w-36 sm:w-44 p-2.5 flex flex-col justify-between bg-white dark:bg-slate-900 overflow-y-auto">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Panggung
                  </span>
                </div>
                <div className="space-y-1.5">
                  {BACKDROPS.map(bg => (
                    <button
                      key={bg.id}
                      onClick={() => setActiveBackdrop(bg)}
                      className={`w-full p-1.5 rounded-lg border text-left transition-all ${
                        activeBackdrop.id === bg.id
                          ? 'border-[#4C97FF] ring-2 ring-[#4C97FF]/30 font-bold bg-blue-50/50 dark:bg-blue-950/30'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <div className={`w-full h-7 rounded mb-1 border border-black/10 ${bg.backgroundClass}`} />
                      <span className="text-[9px] font-bold text-slate-700 dark:text-slate-300 truncate block">
                        {bg.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Choose Backdrop Button (+) */}
              <div className="mt-3 flex justify-end">
                <button
                  onClick={() => alert('Pilih latar panggung Scratch favoritmu dari daftar di atas!')}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[#00A1E4] hover:bg-[#0089C4] text-white text-[11px] font-bold shadow-sm transition-transform active:scale-95"
                  title="Pilih Latar"
                >
                  <Plus className="w-3 h-3 font-bold" />
                  <span>Pilih Latar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
