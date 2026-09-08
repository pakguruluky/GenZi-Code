// Web Audio API & Speech Synthesis synthesizer for Scratch & PictoBlox Live Studios
// Zero external assets needed, works 100% offline and cleanly in any browser without harsh buzzing.

let audioCtx: AudioContext | null = null;
const activeOscillators = new Set<OscillatorNode>();
const activeGains = new Set<GainNode>();

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Immediately stop and silence any currently running sound or speech
 */
export function stopAllAudio() {
  try {
    // Cancel any active oscillators
    activeOscillators.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // ignore if already stopped
      }
    });
    activeOscillators.clear();

    // Mute any active gain nodes
    activeGains.forEach(g => {
      try {
        if (audioCtx) {
          g.gain.setValueAtTime(0, audioCtx.currentTime);
        }
        g.disconnect();
      } catch {
        // ignore
      }
    });
    activeGains.clear();

    // Cancel speech synthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  } catch (err) {
    console.warn('stopAllAudio notice:', err);
  }
}

/**
 * Authentic Scratch Cat "Meow" synthesizer - warm, soft, non-buzzing
 */
export function playCatMeow() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    // Use triangle wave with gentle lowpass to avoid harsh buzzing
    osc.type = 'triangle';
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, now);

    // Pitch envelope (Me-o-w glide: start ~420Hz, rise to 700Hz, fall to 320Hz)
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(720, now + 0.14);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.45);

    // Smooth gain envelope (soft attack & gentle decay)
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.05);
    gain.gain.linearRampToValueAtTime(0.15, now + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.48);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    activeOscillators.add(osc);
    activeGains.add(gain);

    osc.onended = () => {
      activeOscillators.delete(osc);
      activeGains.delete(gain);
      try {
        osc.disconnect();
        gain.disconnect();
      } catch {
        // ignore
      }
    };

    osc.start(now);
    osc.stop(now + 0.48);
  } catch (err) {
    console.warn('Audio play error:', err);
  }
}

/**
 * Authentic Scratch "Pop" sound effect - clean soft bubble
 */
export function playPop() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.06);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    activeOscillators.add(osc);
    activeGains.add(gain);

    osc.onended = () => {
      activeOscillators.delete(osc);
      activeGains.delete(gain);
      try {
        osc.disconnect();
        gain.disconnect();
      } catch {
        // ignore
      }
    };

    osc.start(now);
    osc.stop(now + 0.07);
  } catch (err) {
    console.warn('Audio play error:', err);
  }
}

/**
 * 8-Bit Jump sound for game programming - soft clean arcade tone
 */
export function playJumpSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'triangle';
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1600, now);

    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(550, now + 0.12);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    activeOscillators.add(osc);
    activeGains.add(gain);

    osc.onended = () => {
      activeOscillators.delete(osc);
      activeGains.delete(gain);
      try {
        osc.disconnect();
        gain.disconnect();
      } catch {
        // ignore
      }
    };

    osc.start(now);
    osc.stop(now + 0.14);
  } catch (err) {
    console.warn('Audio play error:', err);
  }
}

/**
 * Melodic Tone / Piezo Buzzer sound for Micro:bit & PictoBlox
 * Uses smooth, musical sine/triangle tones without harsh buzzing/dengung.
 */
export function playRobotBuzzer(frequency = 440, duration = 0.2) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Safety: prevent any accidental millisecond values (> 5) from playing for minutes
    const actualDuration = duration > 5 ? duration / 1000 : duration;
    const safeDuration = Math.min(Math.max(actualDuration, 0.05), 0.6);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    // Use gentle triangle wave filtered to sound warm and musical like a real micro:bit buzzer
    osc.type = 'sine';
    osc.frequency.setValueAtTime(Math.max(60, Math.min(frequency, 2000)), now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, now);

    // Soft attack & decay envelope so there is zero clicking or continuous ringing
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.15, now + 0.015);
    gain.gain.setValueAtTime(0.15, now + safeDuration - 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + safeDuration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    activeOscillators.add(osc);
    activeGains.add(gain);

    osc.onended = () => {
      activeOscillators.delete(osc);
      activeGains.delete(gain);
      try {
        osc.disconnect();
        gain.disconnect();
      } catch {
        // ignore
      }
    };

    osc.start(now);
    osc.stop(now + safeDuration);
  } catch (err) {
    console.warn('Audio play error:', err);
  }
}

/**
 * Text to Speech (TTS) for PictoBlox AI
 * Speaks text using Web SpeechSynthesis API
 */
export function speakText(text: string, lang = 'id-ID') {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('SpeechSynthesis not supported in this browser');
    return;
  }

  try {
    window.speechSynthesis.cancel(); // Stop any pending speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 1.0;
    utterance.pitch = 1.1;

    const voices = window.speechSynthesis.getVoices();
    const idVoice = voices.find(v => v.lang.startsWith('id') || v.lang.includes('ID'));
    if (idVoice) {
      utterance.voice = idVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('TTS error:', e);
  }
}
