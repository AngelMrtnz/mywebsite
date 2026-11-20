// Little synthesised sounds (Web Audio, no files to download).
let ctx: AudioContext | null = null;

/** Browsers only allow sound after a key press or tap, so call this from one. */
export function unlockAudio() {
  try {
    ctx ??= new AudioContext();
    if (ctx.state === 'suspended') void ctx.resume();
  } catch {
    // no Web Audio: play silently
  }
}

/**
 * A soft ping for clearing lines. Each clear in a row (combo) goes two semitones higher,
 * up to an octave; clearing 4 lines at once adds a bright octave on top.
 */
export function playClear(combo: number, lines: number) {
  if (!ctx || ctx.state !== 'running') return;
  const step = Math.min(Math.max(combo, 1) - 1, 6);
  const freq = 660 * 2 ** ((step * 2) / 12);
  const now = ctx.currentTime;

  const out = ctx.createGain();
  out.gain.setValueAtTime(0.0001, now);
  out.gain.exponentialRampToValueAtTime(0.22, now + 0.005);
  out.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
  out.connect(ctx.destination);

  const tones = lines >= 4 ? [freq, freq * 2] : [freq];
  for (const f of tones) {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(f, now);
    osc.connect(out);
    osc.start(now);
    osc.stop(now + 0.4);
  }
}
