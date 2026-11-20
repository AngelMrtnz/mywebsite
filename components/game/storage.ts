// Saved settings, key bindings and scores, kept in this browser (localStorage).
import { DEFAULT_SETTINGS, type Action, type Settings } from './engine';

export type KeyBindings = Record<Action, string>;

export const DEFAULT_KEYS: KeyBindings = {
  left: 'ArrowLeft',
  right: 'ArrowRight',
  softDrop: 'ArrowDown',
  hardDrop: 'Space',
  rotateCW: 'KeyX',
  rotateCCW: 'KeyZ',
  rotate180: 'KeyA',
  hold: 'KeyC',
  restart: 'KeyR',
};

export interface Score {
  name: string;
  time: number; // ms
  pieces: number;
  date: string; // ISO
}

const KEY = {
  settings: 'blocks-40l:settings',
  keys: 'blocks-40l:keys',
  scores: 'blocks-40l:scores',
  name: 'blocks-40l:name',
};

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // private mode or storage full: just don't save
  }
}

export const loadSettings = (): Settings => read(KEY.settings, DEFAULT_SETTINGS);
export const saveSettings = (s: Settings) => write(KEY.settings, s);

export const loadKeys = (): KeyBindings => read(KEY.keys, DEFAULT_KEYS);
export const saveKeys = (k: KeyBindings) => write(KEY.keys, k);

export function loadScores(): Score[] {
  try {
    const list = JSON.parse(localStorage.getItem(KEY.scores) ?? '[]');
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

/**
 * Records a finished run. Each name keeps only its best time.
 * Returns the updated top 10 (fastest first) and whether this run was a new personal best.
 */
export function addScore(score: Score): { top: Score[]; personalBest: boolean } {
  const all = loadScores();
  const previous = all.find((s) => s.name === score.name);
  const personalBest = !previous || score.time < previous.time;
  const top = personalBest
    ? [...all.filter((s) => s.name !== score.name), score].sort((a, b) => a.time - b.time).slice(0, 10)
    : all;
  if (personalBest) write(KEY.scores, top);
  return { top, personalBest };
}

export function bestFor(name: string): Score | undefined {
  return loadScores().find((s) => s.name === name);
}

export function loadName(): string {
  try {
    return localStorage.getItem(KEY.name) ?? '';
  } catch {
    return '';
  }
}

export function saveName(name: string) {
  try {
    localStorage.setItem(KEY.name, name);
  } catch {}
}

/** Keeps names short and printable. */
export function cleanName(raw: string): string {
  return raw.replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, 20);
}

export function formatTime(ms: number): string {
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const millis = Math.floor(ms % 1000);
  return `${m}:${String(s).padStart(2, '0')}.${String(millis).padStart(3, '0')}`;
}

/** "ArrowLeft" -> "←", "KeyZ" -> "Z", "Space" -> "Space" */
export function keyLabel(code: string): string {
  const arrows: Record<string, string> = { ArrowLeft: '←', ArrowRight: '→', ArrowUp: '↑', ArrowDown: '↓' };
  if (arrows[code]) return arrows[code];
  const side = code.match(/^(Shift|Control|Alt|Meta)(Left|Right)$/);
  if (side) {
    const name = { Shift: 'Shift', Control: 'Ctrl', Alt: 'Alt', Meta: 'Cmd' }[side[1]];
    return `${side[2] === 'Left' ? 'L' : 'R'} ${name}`;
  }
  return code.replace(/^Key/, '').replace(/^Digit/, '').replace(/^Numpad/, 'Num ');
}
