import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Swords,
  Play,
  RotateCcw,
  Code2,
  Terminal,
  HelpCircle,
  CheckCircle2,
  Zap,
  Shield,
  Award,
  Volume2,
  VolumeX,
  Sparkles,
  ExternalLink,
  AlertTriangle,
  ChevronRight,
  Info,
  Layers,
  Heart,
  Gem,
  Flame
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

// Web Audio sound synthesizer helper
class SoundFX {
  private ctx: AudioContext | null = null;
  public enabled = true;

  private init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }

  playStep() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch {
      // ignore
    }
  }

  playGem() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, this.ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, this.ctx.currentTime + 0.08); // A5
      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.3);
    } catch {
      // ignore
    }
  }

  playAttack() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(70, this.ctx.currentTime + 0.18);
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.18);
    } catch {
      // ignore
    }
  }

  playVictory() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);
        gain.gain.setValueAtTime(0.25, now + idx * 0.1);
        gain.gain.linearRampToValueAtTime(0.01, now + idx * 0.1 + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.25);
      });
    } catch {
      // ignore
    }
  }

  playHit() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(90, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(40, this.ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } catch {
      // ignore
    }
  }
}

const sfx = new SoundFX();

export type ProgrammingLanguage = 'python' | 'javascript';

interface LevelConfig {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  gridSize: { cols: number; rows: number };
  heroStart: { x: number; y: number };
  exit: { x: number; y: number };
  gems: { x: number; y: number; id: string; color: string }[];
  enemies: { x: number; y: number; id: string; name: string; hp: number; maxHp: number }[];
  walls: { x: number; y: number }[];
  spikes: { x: number; y: number }[];
  pythonStarter: string;
  jsStarter: string;
  solutionHint: {
    python: string;
    javascript: string;
  };
}

const DUNGEON_LEVELS: LevelConfig[] = [
  {
    id: 1,
    title: 'Level 1: Kithgard Dungeon - Langkah Ksatria',
    subtitle: 'Dasar Pergerakan Karakter (moveRight & moveDown)',
    description: 'Arahkan ksatria menelusuri koridor batu dungeon untuk mencapai Pintu Keluar yang bercahaya di seberang ruangan.',
    gridSize: { cols: 5, rows: 4 },
    heroStart: { x: 0, y: 0 },
    exit: { x: 4, y: 2 },
    gems: [],
    enemies: [],
    walls: [
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 3, y: 1 },
      { x: 1, y: 3 },
      { x: 2, y: 3 }
    ],
    spikes: [],
    pythonStarter: `# Panduan: Kendalikan ksatriamu menuju Pintu Keluar!
hero.moveRight()
hero.moveRight()
hero.moveDown()
hero.moveDown()
hero.moveRight()
hero.moveRight()
`,
    jsStarter: `// Panduan: Kendalikan ksatriamu menuju Pintu Keluar!
hero.moveRight();
hero.moveRight();
hero.moveDown();
hero.moveDown();
hero.moveRight();
hero.moveRight();
`,
    solutionHint: {
      python: `hero.moveRight()\nhero.moveRight()\nhero.moveDown()\nhero.moveDown()\nhero.moveRight()\nhero.moveRight()`,
      javascript: `hero.moveRight();\nhero.moveRight();\nhero.moveDown();\nhero.moveDown();\nhero.moveRight();\nhero.moveRight();`
    }
  },
  {
    id: 2,
    title: 'Level 2: Koridor Permata Ajaib',
    subtitle: 'Pengambilan Kristal Berharga (Gems Collector)',
    description: 'Kumpulkan seluruh kristal permata ajaib di koridor sebelum melangkah masuk ke pintu portal.',
    gridSize: { cols: 5, rows: 4 },
    heroStart: { x: 0, y: 1 },
    exit: { x: 4, y: 1 },
    gems: [
      { x: 1, y: 1, id: 'gem-1', color: 'ruby' },
      { x: 2, y: 2, id: 'gem-2', color: 'emerald' },
      { x: 3, y: 1, id: 'gem-3', color: 'sapphire' }
    ],
    enemies: [],
    walls: [
      { x: 1, y: 0 },
      { x: 3, y: 0 },
      { x: 1, y: 3 },
      { x: 3, y: 3 }
    ],
    spikes: [],
    pythonStarter: `# Ambil semua permata lalu capai gerbang portal!
hero.moveRight()
hero.moveDown()
hero.moveRight()
hero.moveUp()
hero.moveRight()
hero.moveRight()
`,
    jsStarter: `// Ambil semua permata lalu capai gerbang portal!
hero.moveRight();
hero.moveDown();
hero.moveRight();
hero.moveUp();
hero.moveRight();
hero.moveRight();
`,
    solutionHint: {
      python: `hero.moveRight()\nhero.moveDown()\nhero.moveRight()\nhero.moveUp()\nhero.moveRight()\nhero.moveRight()`,
      javascript: `hero.moveRight();\nhero.moveDown();\nhero.moveRight();\nhero.moveUp();\nhero.moveRight();\nhero.moveRight();`
    }
  },
  {
    id: 3,
    title: 'Level 3: Pertempuran Ogre Brak',
    subtitle: 'Perintah Serangan hero.attack()',
    description: 'Seekor Ogre bernama Brak menghalangi jalan! Dekati dan serang Ogre 2 kali sampai musuh tumbang, lalu buka pintu keluar.',
    gridSize: { cols: 5, rows: 4 },
    heroStart: { x: 0, y: 2 },
    exit: { x: 4, y: 2 },
    gems: [{ x: 3, y: 2, id: 'gem-victory', color: 'ruby' }],
    enemies: [
      { x: 2, y: 2, id: 'ogre-1', name: 'Brak', hp: 40, maxHp: 40 }
    ],
    walls: [
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 3, y: 1 },
      { x: 4, y: 1 },
      { x: 0, y: 3 },
      { x: 1, y: 3 },
      { x: 3, y: 3 },
      { x: 4, y: 3 }
    ],
    spikes: [],
    pythonStarter: `# Bergerak mendekat lalu tebas musuh Brak!
hero.moveRight()
hero.moveRight()
hero.attack("Brak")
hero.attack("Brak")
hero.moveRight()
hero.moveRight()
`,
    jsStarter: `// Bergerak mendekat lalu tebas musuh Brak!
hero.moveRight();
hero.moveRight();
hero.attack("Brak");
hero.attack("Brak");
hero.moveRight();
hero.moveRight();
`,
    solutionHint: {
      python: `hero.moveRight()\nhero.moveRight()\nhero.attack("Brak")\nhero.attack("Brak")\nhero.moveRight()\nhero.moveRight()`,
      javascript: `hero.moveRight();\nhero.moveRight();\nhero.attack("Brak");\nhero.attack("Brak");\nhero.moveRight();\nhero.moveRight();`
    }
  },
  {
    id: 4,
    title: 'Level 4: Labirin Duri Tajam (Spike Trap)',
    subtitle: 'Navigasi Presisi Menghindari Bahaya',
    description: 'Lantai dungeon dipenuhi jebakan duri yang bisa mengurangi darahmu! Navigasi secara hati-hati melewati jalur yang aman.',
    gridSize: { cols: 5, rows: 4 },
    heroStart: { x: 0, y: 3 },
    exit: { x: 4, y: 0 },
    gems: [
      { x: 1, y: 3, id: 'g1', color: 'emerald' },
      { x: 2, y: 1, id: 'g2', color: 'ruby' },
      { x: 3, y: 2, id: 'g3', color: 'sapphire' }
    ],
    enemies: [],
    walls: [
      { x: 0, y: 1 },
      { x: 3, y: 1 }
    ],
    spikes: [
      { x: 1, y: 2 },
      { x: 2, y: 2 },
      { x: 2, y: 3 },
      { x: 3, y: 0 },
      { x: 4, y: 1 }
    ],
    pythonStarter: `# Hindari kotak duri merah!
hero.moveRight()
hero.moveUp()
hero.moveUp()
hero.moveRight()
hero.moveDown()
hero.moveRight()
hero.moveUp()
hero.moveUp()
hero.moveRight()
`,
    jsStarter: `// Hindari kotak duri merah!
hero.moveRight();
hero.moveUp();
hero.moveUp();
hero.moveRight();
hero.moveDown();
hero.moveRight();
hero.moveUp();
hero.moveUp();
hero.moveRight();
`,
    solutionHint: {
      python: `hero.moveRight()\nhero.moveUp()\nhero.moveUp()\nhero.moveRight()\nhero.moveDown()\nhero.moveRight()\nhero.moveUp()\nhero.moveUp()\nhero.moveRight()`,
      javascript: `hero.moveRight();\nhero.moveUp();\nhero.moveUp();\nhero.moveRight();\nhero.moveDown();\nhero.moveRight();\nhero.moveUp();\nhero.moveUp();\nhero.moveRight();`
    }
  },
  {
    id: 5,
    title: 'Level 5: Benteng Terakhir Kithgard (Boss)',
    subtitle: 'Tantangan Komprehensif: Gerak & Pertarungan Ganda',
    description: 'Dua pengawal Ogre menjaga gerbang utama! Kalahkan kedua Ogre, kumpulkan permata mahkota, dan jadilah Grandmaster Coder!',
    gridSize: { cols: 5, rows: 4 },
    heroStart: { x: 0, y: 0 },
    exit: { x: 4, y: 3 },
    gems: [
      { x: 2, y: 0, id: 'crown-gem', color: 'ruby' },
      { x: 3, y: 3, id: 'boss-gem', color: 'emerald' }
    ],
    enemies: [
      { x: 1, y: 1, id: 'ogre-munchkin', name: 'Munchkin', hp: 20, maxHp: 20 },
      { x: 3, y: 2, id: 'ogre-chief', name: 'Gorg', hp: 40, maxHp: 40 }
    ],
    walls: [
      { x: 1, y: 0 },
      { x: 2, y: 2 }
    ],
    spikes: [
      { x: 0, y: 2 },
      { x: 4, y: 1 }
    ],
    pythonStarter: `# Taklukkan benteng dungeon:
hero.moveRight()
hero.moveRight()
hero.moveDown()
hero.attack("Munchkin")
hero.moveDown()
hero.moveRight()
hero.attack("Gorg")
hero.attack("Gorg")
hero.moveDown()
hero.moveRight()
`,
    jsStarter: `// Taklukkan benteng dungeon:
hero.moveRight();
hero.moveRight();
hero.moveDown();
hero.attack("Munchkin");
hero.moveDown();
hero.moveRight();
hero.attack("Gorg");
hero.attack("Gorg");
hero.moveDown();
hero.moveRight();
`,
    solutionHint: {
      python: `hero.moveRight()\nhero.moveRight()\nhero.moveDown()\nhero.attack("Munchkin")\nhero.moveDown()\nhero.moveRight()\nhero.attack("Gorg")\nhero.attack("Gorg")\nhero.moveDown()\nhero.moveRight()`,
      javascript: `hero.moveRight();\nhero.moveRight();\nhero.moveDown();\nhero.attack("Munchkin");\nhero.moveDown();\nhero.moveRight();\nhero.attack("Gorg");\nhero.attack("Gorg");\nhero.moveDown();\nhero.moveRight();`
    }
  }
];

export const CodeCombatLiveStudio: React.FC = () => {
  const { addXp, currentUser } = useApp();

  // Settings & State
  const [activeLevelIdx, setActiveLevelIdx] = useState(0);
  const [language, setLanguage] = useState<ProgrammingLanguage>('python');
  const [soundMuted, setSoundMuted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const currentLevel = DUNGEON_LEVELS[activeLevelIdx];

  // Code in Editor
  const [code, setCode] = useState(currentLevel.pythonStarter);

  // Runtime Game State
  const [heroPos, setHeroPos] = useState(currentLevel.heroStart);
  const [heroHp, setHeroHp] = useState(100);
  const [heroAction, setHeroAction] = useState<'idle' | 'walking' | 'attacking' | 'hurt' | 'victory'>('idle');
  const [collectedGems, setCollectedGems] = useState<string[]>([]);
  const [enemiesState, setEnemiesState] = useState(currentLevel.enemies);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    `[CodeCombat Runtime] Siap di Level ${currentLevel.id}: ${currentLevel.title}`
  ]);
  const [levelCleared, setLevelCleared] = useState(false);
  const [clearedLevels, setClearedLevels] = useState<number[]>([]);

  const terminalContainerRef = useRef<HTMLDivElement>(null);

  // Sync SFX state
  useEffect(() => {
    sfx.enabled = !soundMuted;
  }, [soundMuted]);

  // Reset or Switch Level
  const resetLevel = useCallback((lvlIdx = activeLevelIdx, lang = language) => {
    const lvl = DUNGEON_LEVELS[lvlIdx];
    setHeroPos(lvl.heroStart);
    setHeroHp(100);
    setHeroAction('idle');
    setCollectedGems([]);
    setEnemiesState(lvl.enemies.map(e => ({ ...e })));
    setIsRunning(false);
    setLevelCleared(false);
    setCode(lang === 'python' ? lvl.pythonStarter : lvl.jsStarter);
    setLogs([
      `[CodeCombat Engine] Reset panggung Level ${lvl.id}: "${lvl.title}"`,
      `[Bahasa Aktif] ${lang === 'python' ? 'Python 3.10' : 'JavaScript (ES6)'}`,
      `> Gunakan hero.moveRight(), hero.moveDown(), hero.attack() dll.`
    ]);
  }, [activeLevelIdx, language]);

  // When Level or Language changes
  const handleSelectLevel = (idx: number) => {
    setActiveLevelIdx(idx);
    resetLevel(idx, language);
  };

  const handleToggleLanguage = (newLang: ProgrammingLanguage) => {
    setLanguage(newLang);
    resetLevel(activeLevelIdx, newLang);
  };

  // Scroll terminal logs to bottom without scrolling the whole page
  useEffect(() => {
    if (terminalContainerRef.current) {
      terminalContainerRef.current.scrollTop = terminalContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // Instruction Parser & Execution
  const runCode = async () => {
    if (isRunning) return;

    // Reset temporary state for fresh execution
    setHeroPos(currentLevel.heroStart);
    setHeroHp(100);
    setHeroAction('idle');
    setCollectedGems([]);
    setEnemiesState(currentLevel.enemies.map(e => ({ ...e })));
    setIsRunning(true);
    setLevelCleared(false);

    setLogs(prev => [
      ...prev,
      `--- Eksekusi Dimulai (${language === 'python' ? 'Python' : 'JavaScript'}) ---`
    ]);

    // Parse commands from user's code
    const lines = code.split('\n');
    const commands: { type: 'move' | 'attack'; direction?: 'right' | 'left' | 'up' | 'down'; target?: string; raw: string }[] = [];

    let lineIndex = 0;
    for (const rawLine of lines) {
      lineIndex++;
      const trimmed = rawLine.trim();
      if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('//')) {
        continue;
      }

      // Regex matching hero commands
      const moveMatch = trimmed.match(/hero\.move(Right|Left|Up|Down)\s*\(\s*\)/i);
      const attackMatch = trimmed.match(/hero\.attack\s*\(\s*["']?([^"']*)["']?\s*\)/i);

      if (moveMatch) {
        const dir = moveMatch[1].toLowerCase() as 'right' | 'left' | 'up' | 'down';
        commands.push({ type: 'move', direction: dir, raw: trimmed });
      } else if (attackMatch) {
        const target = attackMatch[1] || 'Enemy';
        commands.push({ type: 'attack', target, raw: trimmed });
      } else {
        // Unknown syntax warning
        setLogs(prev => [
          ...prev,
          `⚠️ Baris ${lineIndex}: Sintaks "${trimmed}" dilewati atau belum didukung simulator.`
        ]);
      }
    }

    if (commands.length === 0) {
      setLogs(prev => [
        ...prev,
        '❌ Tidak ditemukan perintah hero yang valid. Masukkan minimal 1 perintah seperti hero.moveRight().'
      ]);
      setIsRunning(false);
      return;
    }

    // Step-by-step playback
    let currentX = currentLevel.heroStart.x;
    let currentY = currentLevel.heroStart.y;
    let currentHp = 100;
    const currentGemsCollected: string[] = [];
    let enemies = currentLevel.enemies.map(e => ({ ...e }));

    for (let i = 0; i < commands.length; i++) {
      const cmd = commands[i];

      if (cmd.type === 'move' && cmd.direction) {
        let nextX = currentX;
        let nextY = currentY;

        if (cmd.direction === 'right') nextX++;
        if (cmd.direction === 'left') nextX--;
        if (cmd.direction === 'down') nextY++;
        if (cmd.direction === 'up') nextY--;

        // Check boundaries
        if (nextX < 0 || nextX >= currentLevel.gridSize.cols || nextY < 0 || nextY >= currentLevel.gridSize.rows) {
          setLogs(prev => [...prev, `🛑 [Baris ${i + 1}] hero menabrak batas dungeon (${nextX}, ${nextY})!`]);
          sfx.playHit();
          break;
        }

        // Check walls
        const hitWall = currentLevel.walls.some(w => w.x === nextX && w.y === nextY);
        if (hitWall) {
          setLogs(prev => [...prev, `🧱 [Baris ${i + 1}] hero menabrak dinding batu di (${nextX}, ${nextY})!`]);
          sfx.playHit();
          break;
        }

        // Check living enemy in the way
        const livingEnemy = enemies.find(e => e.x === nextX && e.y === nextY && e.hp > 0);
        if (livingEnemy) {
          setLogs(prev => [
            ...prev,
            `⚔️ [Baris ${i + 1}] Jalan terhalang oleh Ogre "${livingEnemy.name}"! Gunakan hero.attack("${livingEnemy.name}") terlebih dahulu.`
          ]);
          sfx.playHit();
          break;
        }

        // Valid move
        currentX = nextX;
        currentY = nextY;
        setHeroPos({ x: currentX, y: currentY });
        setHeroAction('walking');
        sfx.playStep();
        setLogs(prev => [...prev, `> hero.move${cmd.direction!.charAt(0).toUpperCase() + cmd.direction!.slice(1)}() -> Posisi (${currentX}, ${currentY})`]);

        // Check Spike Trap
        const hitSpike = currentLevel.spikes.some(s => s.x === currentX && s.y === currentY);
        if (hitSpike) {
          currentHp = Math.max(0, currentHp - 25);
          setHeroHp(currentHp);
          setHeroAction('hurt');
          sfx.playHit();
          setLogs(prev => [...prev, `🩸 Awas! Hero menginjak jebakan duri tajam! (-25 HP, Sisa: ${currentHp})`]);
          if (currentHp <= 0) {
            setLogs(prev => [...prev, '💀 Ksatriamu gugur akibat jebakan duri! Perbaiki rute kodemu.']);
            setIsRunning(false);
            return;
          }
        }

        // Check Gem collection
        const foundGem = currentLevel.gems.find(g => g.x === currentX && g.y === currentY && !currentGemsCollected.includes(g.id));
        if (foundGem) {
          currentGemsCollected.push(foundGem.id);
          setCollectedGems([...currentGemsCollected]);
          sfx.playGem();
          setLogs(prev => [...prev, `💎 Permata kristal berhasil dikoleksi! (+15 Gold)`]);
        }

        await new Promise(r => setTimeout(r, 450));
      } else if (cmd.type === 'attack') {
        // Look for enemy adjacent or on same spot
        setHeroAction('attacking');
        sfx.playAttack();

        const adjacentEnemyIndex = enemies.findIndex(e => {
          const dist = Math.abs(e.x - currentX) + Math.abs(e.y - currentY);
          return dist <= 1 && e.hp > 0;
        });

        if (adjacentEnemyIndex !== -1) {
          const targetEnemy = { ...enemies[adjacentEnemyIndex] };
          targetEnemy.hp = Math.max(0, targetEnemy.hp - 20);
          enemies[adjacentEnemyIndex] = targetEnemy;
          setEnemiesState([...enemies]);

          setLogs(prev => [
            ...prev,
            `⚔️ hero.attack("${cmd.target}") -> Menebas Ogre "${targetEnemy.name}"! (-20 DMG, Sisa HP: ${targetEnemy.hp}/${targetEnemy.maxHp})`
          ]);

          if (targetEnemy.hp <= 0) {
            setLogs(prev => [...prev, `💥 Ogre "${targetEnemy.name}" berhasil ditaklukkan!`]);
          }
        } else {
          setLogs(prev => [
            ...prev,
            `💨 hero.attack("${cmd.target}") -> Tebasan meleset! Tidak ada musuh dalam jangkauan 1 petak.`
          ]);
        }

        await new Promise(r => setTimeout(r, 450));
      }

      setHeroAction('idle');
    }

    // Evaluate Win Condition
    const allEnemiesDefeated = enemies.every(e => e.hp <= 0);
    const allGemsPicked = currentGemsCollected.length === currentLevel.gems.length;
    const atExit = currentX === currentLevel.exit.x && currentY === currentLevel.exit.y;

    if (atExit) {
      if (!allEnemiesDefeated) {
        setLogs(prev => [
          ...prev,
          '⚠️ Pintu Keluar terkunci! Kamu harus menaklukkan semua Ogre terlebih dahulu.'
        ]);
        setIsRunning(false);
        return;
      }

      if (!allGemsPicked) {
        setLogs(prev => [
          ...prev,
          '⚠️ Kamu belum mengumpulkan semua permata yang ada di ruangan!'
        ]);
        setIsRunning(false);
        return;
      }

      // VICTORY!
      setHeroAction('victory');
      setLevelCleared(true);
      sfx.playVictory();

      if (!clearedLevels.includes(currentLevel.id)) {
        setClearedLevels(prev => [...prev, currentLevel.id]);
        const xpEarned = 50;
        await addXp(xpEarned, `Menyelesaikan Tantangan CodeCombat ${currentLevel.title}!`);
      }

      setLogs(prev => [
        ...prev,
        '====================================',
        `🎉 KEMENANGAN! LEVEL ${currentLevel.id} BERHASIL DISELESAIKAN!`,
        'Gerbang Dungeon Terbuka! +50 XP Gamifikasi untukmu!',
        '===================================='
      ]);
    } else {
      setLogs(prev => [
        ...prev,
        `ℹ️ Eksekusi selesai, namun hero belum berada di Pintu Keluar (${currentLevel.exit.x}, ${currentLevel.exit.y}). Posisi saat ini: (${currentX}, ${currentY}).`
      ]);
    }

    setIsRunning(false);
  };

  // Quick insertion of methods
  const insertCodeSnippet = (snippet: string) => {
    setCode(prev => prev + '\n' + snippet);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Title */}
      <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        {/* Dungeon Ambient Lighting */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-rose-600/15 via-amber-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
              <Swords className="w-4 h-4 text-rose-500" />
              CodeCombat RPG Studio (Real Interactive Simulator)
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              Kithgard Dungeon: Belajar Coding RPG
            </h1>
            <p className="text-slate-300 text-sm mt-1.5 max-w-2xl leading-relaxed">
              Kendalikan hero ksatria menembus labirin berbatu, menaklukkan ogre, dan mengumpulkan permata dengan mengetik baris kode teks nyata. Pilih antara bahasa <strong className="text-amber-300">Python</strong> atau <strong className="text-yellow-300">JavaScript</strong>!
            </p>
          </div>

          {/* Action links */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setSoundMuted(!soundMuted)}
              className="p-2.5 rounded-xl border border-slate-700 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title={soundMuted ? 'Nyalakan Efek Suara' : 'Matikan Suara'}
            >
              {soundMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            <a
              href="https://codecombat.com/play"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white shadow-md shadow-rose-950/40 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Buka CodeCombat Resmi</span>
            </a>
          </div>
        </div>

        {/* Level Selector Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mt-6 pt-6 border-t border-slate-800">
          {DUNGEON_LEVELS.map((lvl, idx) => {
            const isSelected = idx === activeLevelIdx;
            const isCleared = clearedLevels.includes(lvl.id);
            return (
              <button
                key={lvl.id}
                onClick={() => handleSelectLevel(idx)}
                className={`p-3 rounded-2xl text-left border transition-all relative overflow-hidden ${
                  isSelected
                    ? 'border-amber-500 bg-amber-500/15 ring-2 ring-amber-500/30'
                    : 'border-slate-800 bg-slate-900/80 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase text-slate-400">
                    Lvl {lvl.id}
                  </span>
                  {isCleared && (
                    <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-400 bg-emerald-950/70 px-1.5 py-0.2 rounded">
                      <CheckCircle2 className="w-3 h-3" />
                      Clear
                    </span>
                  )}
                </div>
                <h4 className="text-xs font-bold text-white mt-1 line-clamp-1">{lvl.title.split(': ')[1]}</h4>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Workspace: 2-Column Split (Left: Stage Canvas, Right: Code Editor & Palette) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Dungeon Visual Canvas (5 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-950 rounded-3xl border border-slate-800 p-5 shadow-xl text-white relative">
            {/* Stage Header Info */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <Flame className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white leading-tight">
                    {currentLevel.title}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {currentLevel.subtitle}
                  </p>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs">
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                  <span className="font-mono font-bold text-slate-200">{heroHp}/100 HP</span>
                </div>
              </div>
            </div>

            {/* Visual Dungeon Grid (5x4) */}
            <div className="relative bg-slate-900/90 rounded-2xl p-3 border border-slate-800/80 shadow-inner">
              <div
                className="grid gap-2 select-none"
                style={{
                  gridTemplateColumns: `repeat(${currentLevel.gridSize.cols}, minmax(0, 1fr))`
                }}
              >
                {Array.from({ length: currentLevel.gridSize.rows }).map((_, rIdx) =>
                  Array.from({ length: currentLevel.gridSize.cols }).map((_, cIdx) => {
                    const isHero = heroPos.x === cIdx && heroPos.y === rIdx;
                    const isExit = currentLevel.exit.x === cIdx && currentLevel.exit.y === rIdx;
                    const isWall = currentLevel.walls.some(w => w.x === cIdx && w.y === rIdx);
                    const isSpike = currentLevel.spikes.some(s => s.x === cIdx && s.y === rIdx);
                    const gem = currentLevel.gems.find(g => g.x === cIdx && g.y === rIdx && !collectedGems.includes(g.id));
                    const enemy = enemiesState.find(e => e.x === cIdx && e.y === rIdx && e.hp > 0);

                    return (
                      <div
                        key={`${rIdx}-${cIdx}`}
                        className={`aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all duration-300 ${
                          isWall
                            ? 'bg-slate-800 border border-slate-700 shadow-md'
                            : isSpike
                            ? 'bg-rose-950/50 border border-rose-800/80'
                            : 'bg-slate-800/40 border border-slate-800/70 hover:border-slate-700'
                        }`}
                      >
                        {/* Coordinate helper watermark */}
                        <span className="absolute top-1 left-1.5 text-[9px] font-mono text-slate-600 select-none">
                          {cIdx},{rIdx}
                        </span>

                        {/* Wall Stone Texture */}
                        {isWall && (
                          <div className="text-center p-1">
                            <span className="text-base select-none">🧱</span>
                            <span className="block text-[8px] font-bold text-slate-400 mt-0.5">DINDING</span>
                          </div>
                        )}

                        {/* Spike Trap */}
                        {isSpike && (
                          <div className="text-center animate-pulse">
                            <span className="text-base select-none">🗡️</span>
                            <span className="block text-[8px] font-bold text-rose-400">DURI</span>
                          </div>
                        )}

                        {/* Exit Door */}
                        {isExit && (
                          <div className="text-center relative">
                            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 animate-pulse">
                              <span className="text-lg">🚪</span>
                            </div>
                            <span className="block text-[8px] font-black text-amber-400 mt-0.5">EXIT</span>
                          </div>
                        )}

                        {/* Gem Item */}
                        {gem && (
                          <div className="text-center animate-bounce">
                            <Gem className="w-6 h-6 text-amber-400 fill-amber-400 drop-shadow-md" />
                            <span className="block text-[8px] font-bold text-amber-300">GEM</span>
                          </div>
                        )}

                        {/* Enemy Monster (Ogre) */}
                        {enemy && (
                          <div className="text-center relative">
                            {/* Enemy HP Bar */}
                            <div className="w-10 h-1.5 bg-slate-700 rounded-full overflow-hidden mb-1 mx-auto">
                              <div
                                className="h-full bg-rose-500 transition-all"
                                style={{ width: `${(enemy.hp / enemy.maxHp) * 100}%` }}
                              />
                            </div>
                            <span className="text-2xl select-none">👹</span>
                            <span className="block text-[9px] font-bold text-rose-300 line-clamp-1">{enemy.name}</span>
                          </div>
                        )}

                        {/* Hero Character */}
                        {isHero && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                            <div
                              className={`w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-400 border-2 border-amber-400 flex items-center justify-center text-white shadow-lg transition-transform duration-200 ${
                                heroAction === 'walking'
                                  ? 'scale-110 -translate-y-1'
                                  : heroAction === 'attacking'
                                  ? 'rotate-12 scale-125'
                                  : heroAction === 'hurt'
                                  ? 'shake bg-rose-600'
                                  : ''
                              }`}
                            >
                              <span className="text-xl select-none">🧙‍♂️</span>
                            </div>
                            <span className="text-[8px] font-black px-1.5 rounded bg-amber-500 text-slate-950 mt-0.5 shadow-xs">
                              HERO
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Victory Celebration Overlay */}
              {levelCleared && (
                <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs rounded-2xl flex flex-col items-center justify-center p-6 text-center z-30 animate-fade-in">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/40 mb-3 animate-bounce">
                    <Award className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-black text-amber-400">VICTORY! DUNGEON CLEARED!</h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-sm">
                    Hebat sekali! Ksatriamu berhasil memecahkan logika dungeon dengan baris kodemu. +50 XP telah ditambahkan ke profilmu!
                  </p>
                  <div className="flex items-center gap-3 mt-4">
                    {activeLevelIdx < DUNGEON_LEVELS.length - 1 ? (
                      <button
                        onClick={() => handleSelectLevel(activeLevelIdx + 1)}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                      >
                        <span>Level Berikutnya</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-emerald-400">Semua Level Selesai! Kamu Hebat!</span>
                    )}
                    <button
                      onClick={() => resetLevel()}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                    >
                      Ulangi Level
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Execution Console Terminal (Under Canvas) */}
            <div className="mt-4 bg-slate-900 rounded-2xl border border-slate-800 p-3 font-mono text-xs text-slate-300 overflow-hidden">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400 text-[11px]">
                <span className="flex items-center gap-1.5 font-bold">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  Dungeon Console & Runtime Log
                </span>
                <button
                  onClick={() => setLogs([`[Console Cleared]`])}
                  className="hover:text-white transition-colors"
                >
                  Bersihkan
                </button>
              </div>
              <div ref={terminalContainerRef} className="h-28 overflow-y-auto space-y-1 pt-2 pr-1 text-[11px] leading-relaxed">
                {logs.map((log, i) => (
                  <div
                    key={i}
                    className={`${
                      log.includes('VICTORY') || log.includes('KEMENANGAN')
                        ? 'text-amber-400 font-bold'
                        : log.includes('❌') || log.includes('💀')
                        ? 'text-rose-400'
                        : log.includes('💎')
                        ? 'text-cyan-300'
                        : log.includes('⚔️')
                        ? 'text-amber-300'
                        : 'text-slate-300'
                    }`}
                  >
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Code Editor, Language Switcher & Command Palette (7 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-950 rounded-3xl border border-slate-800 p-5 shadow-xl text-white">
            {/* Language Switcher & Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
              {/* Python vs JavaScript Selector */}
              <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => handleToggleLanguage('python')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    language === 'python'
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>🐍 Python</span>
                </button>
                <button
                  onClick={() => handleToggleLanguage('javascript')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    language === 'javascript'
                      ? 'bg-yellow-400 text-slate-950 shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>🟨 JavaScript</span>
                </button>
              </div>

              {/* Actions: Run & Reset */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => resetLevel()}
                  disabled={isRunning}
                  className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-bold transition-colors flex items-center gap-1 disabled:opacity-50"
                  title="Kembalikan posisi hero ke awal"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>

                <button
                  onClick={runCode}
                  disabled={isRunning}
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-black shadow-md shadow-emerald-950/40 transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isRunning ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Menjalankan...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Jalankan Kode</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Code Editor Box with Line Numbers */}
            <div className="relative rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
              <div className="bg-slate-900/80 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-amber-400" />
                  <span>{language === 'python' ? 'main.py' : 'main.js'}</span>
                </div>
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="text-[11px] text-amber-400 hover:underline flex items-center gap-1"
                >
                  <HelpCircle className="w-3 h-3" />
                  {showHint ? 'Tutup Solusi' : 'Bantuan Kode'}
                </button>
              </div>

              {/* Solution Hint Drawer */}
              {showHint && (
                <div className="p-3 bg-amber-950/40 border-b border-amber-900/60 text-xs text-amber-200">
                  <p className="font-bold mb-1">💡 Kunci Solusi Perintah ({language}):</p>
                  <pre className="bg-slate-950 p-2 rounded-lg font-mono text-[11px] overflow-x-auto text-amber-300">
                    {language === 'python' ? currentLevel.solutionHint.python : currentLevel.solutionHint.javascript}
                  </pre>
                  <button
                    onClick={() => setCode(language === 'python' ? currentLevel.solutionHint.python : currentLevel.solutionHint.javascript)}
                    className="mt-2 px-2.5 py-1 rounded bg-amber-500 text-slate-950 font-bold text-[10px]"
                  >
                    Salin ke Editor
                  </button>
                </div>
              )}

              {/* Textarea code editor */}
              <div className="p-3">
                <textarea
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  rows={12}
                  className="w-full bg-transparent text-emerald-300 font-mono text-xs sm:text-sm leading-relaxed focus:outline-none resize-none"
                  placeholder={language === 'python' ? '# Tulis kode python di sini...' : '// Tulis kode javascript di sini...'}
                  spellCheck={false}
                />
              </div>
            </div>

            {/* Quick Command Insertion Palette */}
            <div className="mt-4 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  Mantra & Perintah {language === 'python' ? 'Python' : 'JavaScript'} (Klik untuk Sisipkan):
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {[
                  {
                    py: 'hero.moveRight()',
                    js: 'hero.moveRight();',
                    desc: 'Geser ke kanan'
                  },
                  {
                    py: 'hero.moveDown()',
                    js: 'hero.moveDown();',
                    desc: 'Geser ke bawah'
                  },
                  {
                    py: 'hero.moveLeft()',
                    js: 'hero.moveLeft();',
                    desc: 'Geser ke kiri'
                  },
                  {
                    py: 'hero.moveUp()',
                    js: 'hero.moveUp();',
                    desc: 'Geser ke atas'
                  },
                  {
                    py: 'hero.attack("Enemy")',
                    js: 'hero.attack("Enemy");',
                    desc: 'Serang monster'
                  }
                ].map((item, idx) => {
                  const val = language === 'python' ? item.py : item.js;
                  return (
                    <button
                      key={idx}
                      onClick={() => insertCodeSnippet(val)}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/50 text-amber-300 font-mono text-[11px] transition-colors flex items-center gap-1"
                      title={item.desc}
                    >
                      <span>+ {val}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
