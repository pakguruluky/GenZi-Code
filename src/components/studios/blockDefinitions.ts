// Block specifications and definitions for Scratch & PictoBlox

export interface BlockTemplate {
  type: string;
  category: 'motion' | 'looks' | 'sound' | 'events' | 'control' | 'sensing' | 'operators' | 'variables' | 'ai' | 'robot';
  labelTemplate: string; // e.g. "gerak {steps} langkah"
  defaultParams: Record<string, string | number>;
  paramTypes: Record<string, 'number' | 'text' | 'select'>;
  options?: Record<string, string[]>;
}

export interface BlockInstance {
  id: string;
  type: string;
  category: 'motion' | 'looks' | 'sound' | 'events' | 'control' | 'sensing' | 'operators' | 'variables' | 'ai' | 'robot';
  params: Record<string, string | number>;
}

export const CATEGORY_COLORS: Record<string, { bg: string; border: string; text: string; darkBg: string }> = {
  motion: { bg: '#4C97FF', border: '#3373CC', text: '#FFFFFF', darkBg: 'bg-blue-600' },
  looks: { bg: '#9966FF', border: '#774DCB', text: '#FFFFFF', darkBg: 'bg-purple-600' },
  sound: { bg: '#CF63CF', border: '#BD42BD', text: '#FFFFFF', darkBg: 'bg-fuchsia-600' },
  events: { bg: '#FFBF00', border: '#CC9900', text: '#FFFFFF', darkBg: 'bg-amber-500' },
  control: { bg: '#FFAB19', border: '#CF8B17', text: '#FFFFFF', darkBg: 'bg-orange-500' },
  sensing: { bg: '#5CB1D6', border: '#2E8EB8', text: '#FFFFFF', darkBg: 'bg-sky-500' },
  operators: { bg: '#59C059', border: '#389438', text: '#FFFFFF', darkBg: 'bg-emerald-500' },
  variables: { bg: '#FF8C1A', border: '#DB6E00', text: '#FFFFFF', darkBg: 'bg-orange-600' },
  ai: { bg: '#7054FF', border: '#5437E0', text: '#FFFFFF', darkBg: 'bg-indigo-600' },
  robot: { bg: '#00B894', border: '#008F72', text: '#FFFFFF', darkBg: 'bg-teal-600' }
};

export const SCRATCH_BLOCK_TEMPLATES: BlockTemplate[] = [
  // Motion
  {
    type: 'move_steps',
    category: 'motion',
    labelTemplate: 'move {steps} steps',
    defaultParams: { steps: 10 },
    paramTypes: { steps: 'number' }
  },
  {
    type: 'turn_right',
    category: 'motion',
    labelTemplate: 'turn ↷ {degrees} degrees',
    defaultParams: { degrees: 15 },
    paramTypes: { degrees: 'number' }
  },
  {
    type: 'turn_left',
    category: 'motion',
    labelTemplate: 'turn ↶ {degrees} degrees',
    defaultParams: { degrees: 15 },
    paramTypes: { degrees: 'number' }
  },
  {
    type: 'goto_random',
    category: 'motion',
    labelTemplate: 'go to random position ▾',
    defaultParams: {},
    paramTypes: {}
  },
  {
    type: 'goto_xy',
    category: 'motion',
    labelTemplate: 'go to x: {x} y: {y}',
    defaultParams: { x: 0, y: 0 },
    paramTypes: { x: 'number', y: 'number' }
  },
  {
    type: 'glide_random',
    category: 'motion',
    labelTemplate: 'glide {secs} secs to random position ▾',
    defaultParams: { secs: 1 },
    paramTypes: { secs: 'number' }
  },
  {
    type: 'glide_xy',
    category: 'motion',
    labelTemplate: 'glide {secs} secs to x: {x} y: {y}',
    defaultParams: { secs: 1, x: 0, y: 0 },
    paramTypes: { secs: 'number', x: 'number', y: 'number' }
  },
  {
    type: 'point_direction',
    category: 'motion',
    labelTemplate: 'point in direction {direction}',
    defaultParams: { direction: 90 },
    paramTypes: { direction: 'number' }
  },
  {
    type: 'bounce_edge',
    category: 'motion',
    labelTemplate: 'if on edge, bounce',
    defaultParams: {},
    paramTypes: {}
  },

  // Looks
  {
    type: 'say_for_secs',
    category: 'looks',
    labelTemplate: 'say "{text}" for {secs} seconds',
    defaultParams: { text: 'Hello!', secs: 2 },
    paramTypes: { text: 'text', secs: 'number' }
  },
  {
    type: 'think_for_secs',
    category: 'looks',
    labelTemplate: 'think "{text}" for {secs} seconds',
    defaultParams: { text: 'Hmm...', secs: 2 },
    paramTypes: { text: 'text', secs: 'number' }
  },
  {
    type: 'next_costume',
    category: 'looks',
    labelTemplate: 'next costume',
    defaultParams: {},
    paramTypes: {}
  },
  {
    type: 'change_size',
    category: 'looks',
    labelTemplate: 'change size by {dSize}',
    defaultParams: { dSize: 10 },
    paramTypes: { dSize: 'number' }
  },
  {
    type: 'set_size',
    category: 'looks',
    labelTemplate: 'set size to {size} %',
    defaultParams: { size: 100 },
    paramTypes: { size: 'number' }
  },
  {
    type: 'show_sprite',
    category: 'looks',
    labelTemplate: 'show',
    defaultParams: {},
    paramTypes: {}
  },
  {
    type: 'hide_sprite',
    category: 'looks',
    labelTemplate: 'hide',
    defaultParams: {},
    paramTypes: {}
  },

  // Sound
  {
    type: 'play_sound_meow',
    category: 'sound',
    labelTemplate: 'play sound Meow until done',
    defaultParams: {},
    paramTypes: {}
  },
  {
    type: 'play_sound_pop',
    category: 'sound',
    labelTemplate: 'start sound Pop',
    defaultParams: {},
    paramTypes: {}
  },
  {
    type: 'change_volume',
    category: 'sound',
    labelTemplate: 'change volume by {vol}',
    defaultParams: { vol: -10 },
    paramTypes: { vol: 'number' }
  },

  // Events
  {
    type: 'when_flag_clicked',
    category: 'events',
    labelTemplate: 'when ⚑ clicked',
    defaultParams: {},
    paramTypes: {}
  },
  {
    type: 'when_sprite_clicked',
    category: 'events',
    labelTemplate: 'when this sprite clicked',
    defaultParams: {},
    paramTypes: {}
  },
  {
    type: 'when_key_pressed',
    category: 'events',
    labelTemplate: 'when space key pressed',
    defaultParams: {},
    paramTypes: {}
  },

  // Control
  {
    type: 'wait_secs',
    category: 'control',
    labelTemplate: 'wait {secs} seconds',
    defaultParams: { secs: 1 },
    paramTypes: { secs: 'number' }
  },
  {
    type: 'repeat',
    category: 'control',
    labelTemplate: 'repeat {count}',
    defaultParams: { count: 10 },
    paramTypes: { count: 'number' }
  },
  {
    type: 'forever',
    category: 'control',
    labelTemplate: 'forever',
    defaultParams: {},
    paramTypes: {}
  },

  // Sensing
  {
    type: 'touching_mouse',
    category: 'sensing',
    labelTemplate: 'touching mouse-pointer?',
    defaultParams: {},
    paramTypes: {}
  },
  {
    type: 'ask_wait',
    category: 'sensing',
    labelTemplate: 'ask "{question}" and wait',
    defaultParams: { question: "What's your name?" },
    paramTypes: { question: 'text' }
  },

  // Operators
  {
    type: 'pick_random',
    category: 'operators',
    labelTemplate: 'pick random {min} to {max}',
    defaultParams: { min: 1, max: 10 },
    paramTypes: { min: 'number', max: 'number' }
  },
  {
    type: 'greater_than',
    category: 'operators',
    labelTemplate: '{val} > 50',
    defaultParams: { val: 60 },
    paramTypes: { val: 'number' }
  },

  // Variables
  {
    type: 'set_var',
    category: 'variables',
    labelTemplate: 'set my variable to {val}',
    defaultParams: { val: 0 },
    paramTypes: { val: 'number' }
  },
  {
    type: 'change_var',
    category: 'variables',
    labelTemplate: 'change my variable by {val}',
    defaultParams: { val: 1 },
    paramTypes: { val: 'number' }
  }
];

export const PICTOBLOX_ADDITIONAL_BLOCKS: BlockTemplate[] = [
  // AI (Face Detection & Emotion)
  {
    type: 'ai_detect_face',
    category: 'ai',
    labelTemplate: '[AI] pindai & kenali ekspresi wajah',
    defaultParams: {},
    paramTypes: {}
  },
  {
    type: 'ai_reaction',
    category: 'ai',
    labelTemplate: '[AI] jika ekspresi {mood} ucapkan "{response}"',
    defaultParams: { mood: 'Senang', response: 'Senyummu membuat hari ini menyenangkan!' },
    paramTypes: { mood: 'select', response: 'text' },
    options: { mood: ['Senang', 'Sedih', 'Terkejut', 'Netral'] }
  },
  {
    type: 'tts_speak',
    category: 'ai',
    labelTemplate: '[TTS] ucapkan suara "{text}"',
    defaultParams: { text: 'Halo! Saya robot AI cerdas dari GenZi Code!' },
    paramTypes: { text: 'text' }
  },

  // Robotics & Quarky Hardware
  {
    type: 'robot_led',
    category: 'robot',
    labelTemplate: '[Quarky] atur lampu LED RGB ke {color}',
    defaultParams: { color: 'Hijau' },
    paramTypes: { color: 'select' },
    options: { color: ['Merah', 'Hijau', 'Biru', 'Kuning', 'Ungu', 'Mati'] }
  },
  {
    type: 'robot_buzzer',
    category: 'robot',
    labelTemplate: '[Quarky] bunyikan nada buzzer {freq} Hz',
    defaultParams: { freq: 440 },
    paramTypes: { freq: 'number' }
  },
  {
    type: 'robot_drive',
    category: 'robot',
    labelTemplate: '[Quarky] jalankan motor roda maju {speed}%',
    defaultParams: { speed: 80 },
    paramTypes: { speed: 'number' }
  }
];
