// Sprites and Backdrops definitions for Scratch & PictoBlox Live Studios

export interface SpriteItem {
  id: string;
  name: string;
  category: string;
  svg: string; // SVG inner elements
  viewBox: string;
}

export interface BackdropItem {
  id: string;
  name: string;
  backgroundClass: string;
  svgDecoration?: string;
}

export const BACKDROPS: BackdropItem[] = [
  {
    id: 'stage_white',
    name: 'Panggung Putih (Default)',
    backgroundClass: 'bg-white',
  },
  {
    id: 'grid_xy',
    name: 'Sumbu Koordinat XY (Grid)',
    backgroundClass: 'bg-slate-50',
  },
  {
    id: 'space_night',
    name: 'Luar Angkasa (Space)',
    backgroundClass: 'bg-gradient-to-b from-indigo-950 via-slate-900 to-black',
  },
  {
    id: 'desert',
    name: 'Gurun & Bukit Pasir',
    backgroundClass: 'bg-gradient-to-b from-sky-300 via-amber-200 to-amber-400',
  },
  {
    id: 'underwater',
    name: 'Bawah Laut (Underwater)',
    backgroundClass: 'bg-gradient-to-b from-cyan-400 via-blue-500 to-indigo-800',
  },
  {
    id: 'field',
    name: 'Lapangan Rumput (Field)',
    backgroundClass: 'bg-gradient-to-b from-sky-200 via-sky-100 to-emerald-400',
  }
];

export const SPRITES: SpriteItem[] = [
  {
    id: 'cat',
    name: 'Sprite1 (Scratch Cat)',
    category: 'Hewan',
    viewBox: '0 0 120 120',
    svg: `
      <!-- Scratch Cat Classic Walking/Running Pose -->
      <!-- Tail -->
      <path d="M 38 72 C 22 72 12 58 16 42 C 18 34 26 38 24 48 C 22 58 32 64 42 66 Z" fill="#F49B22" stroke="#222" stroke-width="1.8" />
      <!-- Left leg back -->
      <path d="M 42 78 L 30 92 C 28 94 32 98 38 96 L 48 84 Z" fill="#F49B22" stroke="#222" stroke-width="1.8" />
      <path d="M 28 92 C 26 95 32 100 38 98 C 42 96 40 92 36 90 Z" fill="#FFFFFF" stroke="#222" stroke-width="1.8" />
      <!-- Right leg forward -->
      <path d="M 58 78 L 74 94 C 76 96 82 94 80 88 L 66 78 Z" fill="#F49B22" stroke="#222" stroke-width="1.8" />
      <path d="M 74 94 C 78 98 86 94 84 88 C 82 86 78 86 74 90 Z" fill="#FFFFFF" stroke="#222" stroke-width="1.8" />
      <!-- Body -->
      <path d="M 42 54 C 36 68 44 82 54 82 C 64 82 72 68 66 54 Z" fill="#F49B22" stroke="#222" stroke-width="1.8" />
      <!-- White Belly -->
      <path d="M 48 58 C 44 70 48 78 54 78 C 60 78 64 70 60 58 Z" fill="#FFFFFF" stroke="#222" stroke-width="1.2" />
      <!-- Left arm -->
      <path d="M 44 58 L 32 68 C 30 70 34 74 38 72 L 46 64 Z" fill="#F49B22" stroke="#222" stroke-width="1.8" />
      <circle cx="34" cy="71" r="4" fill="#FFFFFF" stroke="#222" stroke-width="1.5" />
      <!-- Right arm -->
      <path d="M 64 58 L 76 68 C 78 70 82 66 78 62 L 66 56 Z" fill="#F49B22" stroke="#222" stroke-width="1.8" />
      <circle cx="78" cy="65" r="4" fill="#FFFFFF" stroke="#222" stroke-width="1.5" />
      <!-- Head -->
      <circle cx="58" cy="38" r="22" fill="#F49B22" stroke="#222" stroke-width="2" />
      <!-- Left Ear -->
      <polygon points="40,24 42,6 52,18" fill="#F49B22" stroke="#222" stroke-width="2" />
      <polygon points="42,22 44,10 50,18" fill="#FFF" />
      <!-- Right Ear -->
      <polygon points="76,24 78,6 66,18" fill="#F49B22" stroke="#222" stroke-width="2" />
      <polygon points="74,22 74,10 68,18" fill="#FFF" />
      <!-- Whiskers Left -->
      <line x1="32" y1="36" x2="48" y2="38" stroke="#222" stroke-width="2" stroke-linecap="round" />
      <line x1="30" y1="42" x2="47" y2="42" stroke="#222" stroke-width="2" stroke-linecap="round" />
      <!-- Whiskers Right -->
      <line x1="84" y1="36" x2="68" y2="38" stroke="#222" stroke-width="2" stroke-linecap="round" />
      <line x1="86" y1="42" x2="69" y2="42" stroke="#222" stroke-width="2" stroke-linecap="round" />
      <!-- Eyes -->
      <ellipse cx="50" cy="34" rx="5" ry="6" fill="#FFFFFF" stroke="#222" stroke-width="1.8" />
      <circle cx="51" cy="34" r="2.8" fill="#222" />
      <circle cx="52" cy="32" r="1.2" fill="#FFF" />
      <ellipse cx="66" cy="34" rx="5" ry="6" fill="#FFFFFF" stroke="#222" stroke-width="1.8" />
      <circle cx="67" cy="34" r="2.8" fill="#222" />
      <circle cx="68" cy="32" r="1.2" fill="#FFF" />
      <!-- Nose -->
      <polygon points="58,40 55,38 61,38" fill="#D35400" />
      <!-- Big Open Smile -->
      <path d="M 52 42 Q 58 52 64 42 Z" fill="#D35400" stroke="#222" stroke-width="1.8" />
      <path d="M 53 43 Q 58 46 63 43" fill="#FFF" />
    `
  },
  {
    id: 'tobi',
    name: 'Tobi (PictoBlox Mascot)',
    category: 'Hewan',
    viewBox: '0 0 120 140',
    svg: `
      <!-- Tobi the Bear from PictoBlox -->
      <!-- Ears -->
      <circle cx="42" cy="32" r="10" fill="#C57C3E" stroke="#7A4214" stroke-width="2.5" />
      <circle cx="42" cy="32" r="5.5" fill="#E8B884" />
      <circle cx="78" cy="32" r="10" fill="#C57C3E" stroke="#7A4214" stroke-width="2.5" />
      <circle cx="78" cy="32" r="5.5" fill="#E8B884" />
      <!-- Feet -->
      <ellipse cx="46" cy="126" rx="8" ry="6" fill="#C57C3E" stroke="#7A4214" stroke-width="2.5" />
      <ellipse cx="74" cy="126" rx="8" ry="6" fill="#C57C3E" stroke="#7A4214" stroke-width="2.5" />
      <!-- Red Shorts -->
      <path d="M 38 90 L 82 90 L 84 116 L 68 116 L 60 102 L 52 116 L 36 116 Z" fill="#D63031" stroke="#7A4214" stroke-width="2.5" />
      <!-- White Belt / Trim on shorts -->
      <path d="M 38 90 L 82 90 L 82 94 L 38 94 Z" fill="#FFFFFF" />
      <!-- Body -->
      <path d="M 38 56 Q 30 84 38 92 Q 60 94 82 92 Q 90 84 82 56 Z" fill="#C57C3E" stroke="#7A4214" stroke-width="2.5" />
      <!-- Belly (Cream) -->
      <ellipse cx="60" cy="74" rx="14" ry="16" fill="#FCE5CD" />
      <!-- Arms -->
      <path d="M 37 60 Q 25 78 30 94 Q 37 98 40 90 Q 38 78 41 64 Z" fill="#C57C3E" stroke="#7A4214" stroke-width="2.5" />
      <path d="M 83 60 Q 95 78 90 94 Q 83 98 80 90 Q 82 78 79 64 Z" fill="#C57C3E" stroke="#7A4214" stroke-width="2.5" />
      <!-- Head -->
      <ellipse cx="60" cy="46" rx="26" ry="24" fill="#C57C3E" stroke="#7A4214" stroke-width="2.5" />
      <!-- Muzzle (Cream) -->
      <ellipse cx="60" cy="54" rx="14" ry="11" fill="#FCE5CD" stroke="#7A4214" stroke-width="1.8" />
      <!-- Black Nose -->
      <ellipse cx="60" cy="49" rx="4.5" ry="3" fill="#2D3436" />
      <!-- Happy Smile -->
      <path d="M 54 55 Q 60 61 66 55" fill="none" stroke="#2D3436" stroke-width="2" stroke-linecap="round" />
      <!-- Cool Blue Sunglasses / Goggles (as in PictoBlox) -->
      <path d="M 36 39 Q 48 37 60 39 Q 72 37 84 39 L 84 46 Q 72 50 62 45 Q 48 50 36 46 Z" fill="#0984E3" stroke="#005696" stroke-width="2.5" />
      <!-- Left Lens Cyan -->
      <ellipse cx="48" cy="42" rx="9" ry="6" fill="#74B9FF" />
      <line x1="42" y1="40" x2="48" y2="38" stroke="#FFF" stroke-width="2" stroke-linecap="round" />
      <!-- Right Lens Cyan -->
      <ellipse cx="72" cy="42" rx="9" ry="6" fill="#74B9FF" />
      <line x1="66" y1="40" x2="72" y2="38" stroke="#FFF" stroke-width="2" stroke-linecap="round" />
    `
  },
  {
    id: 'star',
    name: 'Bintang Emas (Star)',
    category: 'Benda',
    viewBox: '0 0 100 100',
    svg: `
      <!-- Golden Star -->
      <polygon points="50,8 62,36 94,38 69,59 77,90 50,73 23,90 31,59 6,38 38,36" fill="#FFD700" stroke="#E6A100" stroke-width="3" />
      <!-- Cute Face -->
      <circle cx="42" cy="48" r="3.5" fill="#333" />
      <circle cx="43" cy="46.5" r="1.2" fill="#FFF" />
      <circle cx="58" cy="48" r="3.5" fill="#333" />
      <circle cx="59" cy="46.5" r="1.2" fill="#FFF" />
      <!-- Cheeks -->
      <ellipse cx="36" cy="53" rx="3" ry="2" fill="#FF7675" opacity="0.7" />
      <ellipse cx="64" cy="53" rx="3" ry="2" fill="#FF7675" opacity="0.7" />
      <!-- Smile -->
      <path d="M 46 54 Q 50 58 54 54" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round" />
    `
  },
  {
    id: 'robot',
    name: 'Quarky AI Robot',
    category: 'Teknologi',
    viewBox: '0 0 100 100',
    svg: `
      <!-- Antenna -->
      <line x1="50" y1="18" x2="50" y2="10" stroke="#0984E3" stroke-width="3" />
      <circle cx="50" cy="8" r="4" fill="#00CEC9" />
      <!-- Head -->
      <rect x="28" y="18" width="44" height="34" rx="8" fill="#74B9FF" stroke="#0984E3" stroke-width="2" />
      <!-- Eyes visor -->
      <rect x="34" y="26" width="32" height="14" rx="4" fill="#2D3436" />
      <circle cx="42" cy="33" r="3" fill="#00CEC9" />
      <circle cx="58" cy="33" r="3" fill="#00CEC9" />
      <!-- Body -->
      <rect x="32" y="56" width="36" height="30" rx="6" fill="#DFE6E9" stroke="#B2BEC3" stroke-width="2" />
      <!-- LED Matrix on Robot Chest -->
      <rect x="38" y="62" width="24" height="16" rx="3" fill="#2D3436" />
      <circle cx="44" cy="67" r="1.5" fill="#E84393" />
      <circle cx="50" cy="67" r="1.5" fill="#00CEC9" />
      <circle cx="56" cy="67" r="1.5" fill="#FFEAA7" />
      <circle cx="47" cy="73" r="1.5" fill="#55EFC4" />
      <circle cx="53" cy="73" r="1.5" fill="#55EFC4" />
      <!-- Arms -->
      <rect x="22" y="60" width="8" height="18" rx="4" fill="#74B9FF" />
      <rect x="70" y="60" width="8" height="18" rx="4" fill="#74B9FF" />
      <!-- Wheels / Base -->
      <ellipse cx="40" cy="88" rx="6" ry="3" fill="#2D3436" />
      <ellipse cx="60" cy="88" rx="6" ry="3" fill="#2D3436" />
    `
  },
  {
    id: 'ball',
    name: 'Bola Basket (Basketball)',
    category: 'Olahraga',
    viewBox: '0 0 100 100',
    svg: `
      <!-- Basketball -->
      <circle cx="50" cy="50" r="36" fill="#E17055" stroke="#D35400" stroke-width="2.5" />
      <line x1="14" y1="50" x2="86" y2="50" stroke="#2D3436" stroke-width="2.5" />
      <line x1="50" y1="14" x2="50" y2="86" stroke="#2D3436" stroke-width="2.5" />
      <path d="M 28 22 Q 44 50 28 78" fill="none" stroke="#2D3436" stroke-width="2.5" />
      <path d="M 72 22 Q 56 50 72 78" fill="none" stroke="#2D3436" stroke-width="2.5" />
    `
  },
  {
    id: 'bat',
    name: 'Kelelawar (Bat)',
    category: 'Hewan',
    viewBox: '0 0 100 100',
    svg: `
      <!-- Bat Wings -->
      <path d="M 50 45 Q 25 15 10 35 Q 20 60 40 55 Z" fill="#2D3436" />
      <path d="M 50 45 Q 75 15 90 35 Q 80 60 60 55 Z" fill="#2D3436" />
      <!-- Body -->
      <ellipse cx="50" cy="52" rx="10" ry="18" fill="#636E72" />
      <!-- Ears -->
      <polygon points="43,38 41,24 47,34" fill="#2D3436" />
      <polygon points="57,38 59,24 53,34" fill="#2D3436" />
      <!-- Eyes & Fangs -->
      <circle cx="46" cy="46" r="2" fill="#E84393" />
      <circle cx="54" cy="46" r="2" fill="#E84393" />
      <polygon points="47,56 48,60 49,56" fill="#FFF" />
      <polygon points="51,56 52,60 53,56" fill="#FFF" />
    `
  }
];
