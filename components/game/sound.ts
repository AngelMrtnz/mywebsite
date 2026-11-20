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

/**
 * Line clear: a short, bright ping. Each clear in a row (combo) goes two semitones higher,
 * up to an octave; clearing 4 lines at once adds a sparkle an octave above.
 */
export function playClear(combo: number, lines: number) {
  const a = ready();
  if (!a) return;
  const { ctx, master } = a;
  const now = ctx.currentTime;
  const step = Math.min(Math.max(combo, 1) - 1, 6);
  const freq = 784 * 2 ** ((step * 2) / 12); // G5 and up

  const out = ctx.createGain();
  out.gain.setValueAtTime(0.0001, now);
  out.gain.exponentialRampToValueAtTime(0.22, now + 0.005);
  out.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
  out.connect(master);

  const tones = lines >= 4 ? [freq, freq * 2] : [freq];
  for (const f of tones) {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(f, now);
    osc.connect(out);
    osc.start(now);
    osc.stop(now + 0.5);
  }
}

let noise: AudioBuffer | null = null;

/** Piece locks: a tiny, dry click, like a block set down on a table. */
export function playLock() {
  const a = ready();
  if (!a) return;
  const { ctx, master } = a;
  const now = ctx.currentTime;

  // A few ms of noise, shaped by a resonant band filter, sounds like a real knock
  if (!noise) {
    noise = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.04), ctx.sampleRate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }
  const src = ctx.createBufferSource();
  src.buffer = noise;
  const band = ctx.createBiquadFilter();
  band.type = 'bandpass';
  band.frequency.value = 1800;
  band.Q.value = 4;
  const env = ctx.createGain();
  env.gain.setValueAtTime(0.5, now);
  env.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);
  src.connect(band);
  band.connect(env);
  env.connect(master);
  src.start(now);
  src.stop(now + 0.04);
}
