// Little synthesised sounds (Web Audio, no files to download).
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let echo: GainNode | null = null;

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
      // A soft echo send that gives the line-clear ping some space
      echo = ctx.createGain();
      echo.gain.value = 0.22;
      const delay = ctx.createDelay(1);
      delay.delayTime.value = 0.13;
      const feedback = ctx.createGain();
      feedback.gain.value = 0.35;
      const tone = ctx.createBiquadFilter();
      tone.type = 'lowpass';
      tone.frequency.value = 2800;
      echo.connect(delay);
      delay.connect(tone);
      tone.connect(feedback);
      feedback.connect(delay);
      tone.connect(master);
    }
    if (ctx.state === 'suspended') void ctx.resume();
  } catch {
    // no Web Audio: play silently
  }
}

function ready() {
  return ctx && master && echo && ctx.state === 'running' ? { ctx, master, echo } : null;
}

/** One bell-like voice: a few partials with their own decay, so it rings and fades naturally. */
function bell(freq: number, start: number, length: number, volume: number) {
  const a = ready();
  if (!a) return;
  const { ctx, master, echo } = a;
  const partials: [ratio: number, gain: number, decay: number][] = [
    [1, 1, 1],
    [2, 0.35, 0.55],
    [3, 0.12, 0.35],
    [1.003, 0.5, 1], // slight detune for a warm shimmer
  ];
  const out = ctx.createGain();
  out.gain.value = volume;
  out.connect(master);
  out.connect(echo);
  for (const [ratio, gain, decay] of partials) {
    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    const end = start + length * decay;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq * ratio, start);
    env.gain.setValueAtTime(0.0001, start);
    env.gain.exponentialRampToValueAtTime(gain, start + 0.008);
    env.gain.exponentialRampToValueAtTime(0.0001, end);
    osc.connect(env);
    env.connect(out);
    osc.start(start);
    osc.stop(end + 0.05);
  }
}

/**
 * Line clear: a ringing ping. Each clear in a row (combo) goes two semitones higher,
 * up to an octave. Clearing more lines at once adds notes above it, like a small chord.
 */
export function playClear(combo: number, lines: number) {
  const a = ready();
  if (!a) return;
  const now = a.ctx.currentTime;
  const step = Math.min(Math.max(combo, 1) - 1, 6);
  const base = 587.33 * 2 ** ((step * 2) / 12); // D5 and up
  bell(base, now, 0.9, 0.2);
  // 2 lines: + fifth, 3: + octave, 4: + octave and a sparkle on top, each a hair later
  const extra = [1.5, 2, 3].slice(0, Math.max(0, Math.min(lines, 4) - 1));
  extra.forEach((r, i) => bell(base * r, now + 0.04 * (i + 1), 0.8, 0.11));
}

/** Piece locks: a short soft "tock". */
export function playLock() {
  const a = ready();
  if (!a) return;
  const { ctx, master } = a;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const env = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(260, now);
  osc.frequency.exponentialRampToValueAtTime(110, now + 0.06);
  filter.type = 'lowpass';
  filter.frequency.value = 1200;
  env.gain.setValueAtTime(0.0001, now);
  env.gain.exponentialRampToValueAtTime(0.16, now + 0.003);
  env.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);
  osc.connect(filter);
  filter.connect(env);
  env.connect(master);
  osc.start(now);
  osc.stop(now + 0.12);
}
