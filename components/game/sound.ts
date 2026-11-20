// Little synthesised sounds (Web Audio, no files to download).
let ctx: AudioContext | null = null;
let master: GainNode | null = null;

/** Browsers only allow sound after a key press or tap, so call this from one. */
export function unlockAudio() {
  try {
    if (!ctx) {
      ctx = new AudioContext();
      // Everything goes through a gentle compressor so stacked sounds never clip
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -14;
      comp.ratio.value = 4;
      comp.connect(ctx.destination);
      master = ctx.createGain();
      master.gain.value = 0.9;
      master.connect(comp);
    }
    if (ctx.state === 'suspended') void ctx.resume();
  } catch {
    // no Web Audio: play silently
  }
}

function ready() {
  return ctx && master && ctx.state === 'running' ? { ctx, master } : null;
}

/** One short, glassy note: a sine with a faint octave on top, quick to start, gently fading. */
function note(freq: number, start: number, length: number, volume: number) {
  const a = ready();
  if (!a) return;
  const { ctx, master } = a;
  const env = ctx.createGain();
  env.gain.setValueAtTime(0.0001, start);
  env.gain.exponentialRampToValueAtTime(volume, start + 0.006);
  env.gain.exponentialRampToValueAtTime(0.0001, start + length);
  env.connect(master);
  for (const [ratio, gain] of [[1, 1], [2, 0.12]]) {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq * ratio, start);
    g.gain.value = gain;
    osc.connect(g);
    g.connect(env);
    osc.start(start);
    osc.stop(start + length + 0.05);
  }
}

// Major pentatonic, in semitones above G5: every combination sounds pleasant together
const SCALE = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21];
const G5 = 784;
const pitch = (degree: number) => G5 * 2 ** (SCALE[Math.min(degree, SCALE.length - 1)] / 12);

/**
 * Line clear: a bright ping that climbs the scale with each clear in a row (combo).
 * Clearing several lines at once plays a quick rising run of that many notes.
 */
export function playClear(combo: number, lines: number) {
  const a = ready();
  if (!a) return;
  const now = a.ctx.currentTime;
  const start = Math.min(Math.max(combo, 1) - 1, 5);
  const count = Math.min(Math.max(lines, 1), 4);
  for (let i = 0; i < count; i++) {
    const last = i === count - 1;
    note(pitch(start + i), now + i * 0.055, last ? 0.5 : 0.25, last ? 0.2 : 0.14);
  }
}

/** Restart: two soft notes going up, like "ready". */
export function playRestart() {
  const a = ready();
  if (!a) return;
  const now = a.ctx.currentTime;
  note(G5 / 2 ** (5 / 12), now, 0.18, 0.1); // D5
  note(G5, now + 0.08, 0.3, 0.12); // G5
}

let noise: AudioBuffer | null = null;

/** Piece locks: a very quiet, muffled thud, felt more than heard. */
export function playLock() {
  const a = ready();
  if (!a) return;
  const { ctx, master } = a;
  const now = ctx.currentTime;

  // A few ms of noise through a low filter: soft and dull, no click
  if (!noise) {
    noise = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.06), ctx.sampleRate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }
  const src = ctx.createBufferSource();
  src.buffer = noise;
  const band = ctx.createBiquadFilter();
  band.type = 'lowpass';
  band.frequency.value = 320;
  band.Q.value = 0.7;
  const env = ctx.createGain();
  env.gain.setValueAtTime(0.0001, now);
  env.gain.exponentialRampToValueAtTime(0.35, now + 0.004); // soft start, so there's no click
  env.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
  src.connect(band);
  band.connect(env);
  env.connect(master);
  src.start(now);
  src.stop(now + 0.06);
}
