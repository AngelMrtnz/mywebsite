'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { DEFAULT_SETTINGS, Game, type Action, type Settings } from './engine';
import { drawGame, LAYOUT_COLS, LAYOUT_ROWS } from './draw';
import {
  addScore,
  bestFor,
  cleanName,
  DEFAULT_KEYS,
  formatTime,
  keyLabel,
  loadKeys,
  loadName,
  loadScores,
  loadSettings,
  saveKeys,
  saveName,
  saveSettings,
  type KeyBindings,
  type Score,
} from './storage';
import { playClear, playLock, unlockAudio } from './sound';
import { fetchTopScores, onlineLeaderboard, submitScore } from './online';

const ACTION_NAMES: Record<Action, string> = {
  left: 'Move left',
  right: 'Move right',
  softDrop: 'Soft drop',
  hardDrop: 'Hard drop',
  rotateCW: 'Rotate clockwise',
  rotateCCW: 'Rotate anticlockwise',
  rotate180: 'Rotate 180°',
  hold: 'Hold',
  restart: 'Restart',
};

function TouchButton({
  action,
  onPress,
  onRelease,
  children,
}: {
  action: Action;
  onPress: (a: Action) => void;
  onRelease: (a: Action) => void;
  children: React.ReactNode;
}) {
  return (
    <button
      className="rounded-lg bg-urv-red text-white text-xl font-bold py-4 active:bg-comp-dark-red select-none touch-none"
      onPointerDown={(e) => {
        e.preventDefault();
        e.currentTarget.setPointerCapture(e.pointerId);
        onPress(action);
      }}
      onPointerUp={() => onRelease(action)}
      onPointerCancel={() => onRelease(action)}
      onContextMenu={(e) => e.preventDefault()}
    >
      {children}
    </button>
  );
}

const isTyping = (t: EventTarget | null) =>
  t instanceof HTMLElement && (t.tagName === 'INPUT' || t.tagName === 'SELECT' || t.tagName === 'TEXTAREA');

export default function BlockGame() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const wrapper = useRef<HTMLDivElement>(null);
  const game = useRef<Game | null>(null);

  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [keys, setKeys] = useState<KeyBindings>(DEFAULT_KEYS);
  const [rebinding, setRebinding] = useState<Action | null>(null);
  const [scores, setScores] = useState<Score[]>([]);
  const [player, setPlayer] = useState(''); // saved name; empty = ask before playing
  const [nameDraft, setNameDraft] = useState('');
  const [lastRun, setLastRun] = useState<{ time: number; personalBest: boolean; date: string } | null>(null);
  const playerRef = useRef(''); // the game loop reads the name from here
  useEffect(() => {
    playerRef.current = player;
  }, [player]);

  // Saved preferences (browser only)
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- reading localStorage once after mount */
    setSettings(loadSettings());
    setKeys(loadKeys());
    if (!onlineLeaderboard) setScores(loadScores());
    const saved = loadName();
    setPlayer(saved);
    setNameDraft(saved);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // Live leaderboard: load it, then refresh every 15 s and whenever the tab comes back
  const [live, setLive] = useState<'off' | 'ok' | 'error'>(onlineLeaderboard ? 'ok' : 'off');
  const refreshLeaderboard = useCallback(async () => {
    if (!onlineLeaderboard) return;
    try {
      setScores(await fetchTopScores());
      setLive('ok');
    } catch {
      setLive('error');
    }
  }, []);

  useEffect(() => {
    if (!onlineLeaderboard) return;
    const refreshIfVisible = () => document.visibilityState === 'visible' && refreshLeaderboard();
    refreshIfVisible();
    const timer = setInterval(refreshIfVisible, 15000);
    document.addEventListener('visibilitychange', refreshIfVisible);
    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', refreshIfVisible);
    };
  }, [refreshLeaderboard]);

  /** A run just finished: keep it only if it's this player's best. */
  const recordRun = useCallback(
    (time: number, pieces: number) => {
      const date = new Date().toISOString();
      const name = playerRef.current;
      // This browser always remembers your own best (used for the message below the board)
      const { top, personalBest } = addScore({ name, time, pieces, date });
      setLastRun({ time, personalBest, date });
      if (!onlineLeaderboard) {
        setScores(top);
        return;
      }
      if (personalBest) {
        submitScore(name, time, pieces)
          .then(refreshLeaderboard)
          .catch(() => setLive('error'));
      }
    },
    [refreshLeaderboard]
  );

  // Create the game once; keep its settings in sync
  useEffect(() => {
    if (!game.current) game.current = new Game(settings);
    game.current.settings = settings;
  }, [settings]);

  const restart = useCallback(() => {
    game.current?.reset();
    setLastRun(null);
  }, []);

  // Game loop: update + draw every frame
  useEffect(() => {
    let frame = 0;
    let last = performance.now();
    let cellSize = 0;
    let lastPhase = '';
    let lastClears = 0;
    let lastPieces = 0;

    const resize = () => {
      const el = canvas.current;
      const box = wrapper.current;
      if (!el || !box) return;
      // As big as fits the width and the screen height (room left for the title and buttons)
      const byWidth = Math.floor(box.clientWidth / LAYOUT_COLS);
      const byHeight = Math.floor((window.innerHeight - 220) / LAYOUT_ROWS);
      cellSize = Math.max(14, Math.min(34, byWidth, byHeight));
      const dpr = window.devicePixelRatio || 1;
      el.width = LAYOUT_COLS * cellSize * dpr;
      el.height = LAYOUT_ROWS * cellSize * dpr;
      el.style.width = `${LAYOUT_COLS * cellSize}px`;
      el.style.height = `${LAYOUT_ROWS * cellSize}px`;
      el.getContext('2d')?.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const observer = new ResizeObserver(resize);
    if (wrapper.current) observer.observe(wrapper.current);
    window.addEventListener('resize', resize);

    const tick = (now: number) => {
      const g = game.current;
      const ctx = canvas.current?.getContext('2d');
      if (g && ctx) {
        // Nothing moves until the player has chosen a name
        if (playerRef.current) g.update(Math.min(now - last, 100)); // cap big jumps (e.g. after switching tabs)
        // A run can finish inside a key handler (hard drop), so compare with the last frame
        if (g.phase === 'finished' && lastPhase !== 'finished') recordRun(g.time, g.pieces);
        lastPhase = g.phase;
        if (g.settings.sound) {
          if (g.pieces > lastPieces) playLock();
          if (g.clears > lastClears) playClear(g.combo, g.lastCleared);
        }
        lastPieces = g.pieces;
        lastClears = g.clears;
        drawGame(ctx, g, cellSize);
      }
      last = now;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, [recordRun]);

  // Keyboard
  useEffect(() => {
    const actionFor = (code: string) =>
      (Object.keys(keys) as Action[]).find((a) => keys[a] === code);

    const down = (e: KeyboardEvent) => {
      if (rebinding) {
        e.preventDefault();
        if (e.code !== 'Escape') {
          const next = { ...keys, [rebinding]: e.code };
          setKeys(next);
          saveKeys(next);
        }
        setRebinding(null);
        return;
      }
      if (isTyping(e.target) || !playerRef.current) return;
      const action = actionFor(e.code);
      if (!action) return;
      unlockAudio();
      e.preventDefault();
      // Don't let Space/Enter also "click" a button that still has focus
      if (document.activeElement instanceof HTMLButtonElement) document.activeElement.blur();
      if (e.repeat) return;
      if (action === 'restart') restart();
      else game.current?.press(action);
    };
    const up = (e: KeyboardEvent) => {
      const action = actionFor(e.code);
      if (!action) return;
      if (!isTyping(e.target)) e.preventDefault();
      game.current?.release(action);
    };
    const blur = () => game.current?.releaseAll();

    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    window.addEventListener('blur', blur);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      window.removeEventListener('blur', blur);
    };
  }, [keys, rebinding, restart]);

  const updateSettings = (patch: Partial<Settings>) => {
    const next = { ...settings, ...patch };
    setSettings(next);
    saveSettings(next);
  };

  const chooseName = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = cleanName(nameDraft);
    if (!clean) return;
    saveName(clean);
    setPlayer(clean);
    restart(); // fresh countdown with the new name
  };

  // Your own best on this computer (lastRun is read so this updates after each run)
  const personalBest = player && (lastRun || scores) ? bestFor(player) : undefined;

  // On-screen buttons behave like keys: press on touch, release on lift
  const pressAction = useCallback(
    (action: Action) => {
      unlockAudio();
      if (action === 'restart') restart();
      else game.current?.press(action);
    },
    [restart]
  );
  const releaseAction = useCallback((action: Action) => game.current?.release(action), []);

  const number = (key: keyof Settings, label: string, min: number, max: number, hint?: string) => (
    <label className="flex items-center justify-between gap-3 text-sm">
      <span>
        {label}
        {hint && <span className="block text-xs text-gray-500">{hint}</span>}
      </span>
      <input
        type="number"
        min={min}
        max={max}
        value={settings[key] as number}
        onChange={(e) => {
          const v = Math.min(max, Math.max(min, Number(e.target.value) || 0));
          updateSettings({ [key]: v });
        }}
        className="w-24 rounded border border-gray-300 px-2 py-1 text-right"
      />
    </label>
  );

  const pad = (action: Action, text: string) => (
    <TouchButton action={action} onPress={pressAction} onRelease={releaseAction}>
      {text}
    </TouchButton>
  );

  return (
    <div className="flex flex-col xl:flex-row gap-8 items-start">
      {/* Game */}
      <div className="w-full max-w-[680px]">
        <div ref={wrapper} className="relative w-full">
          <canvas ref={canvas} className="block mx-auto rounded-xl shadow-lg" aria-label="Game board" />

          {/* Ask for a name once; it's remembered on this computer */}
          {!player && (
            <form
              onSubmit={chooseName}
              className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm"
            >
              <div className="w-72 p-6 rounded-xl bg-white shadow-xl border border-gray-200 text-center">
                <label className="block font-bold mb-3" htmlFor="player-name">
                  Choose a name for the leaderboard
                </label>
                <input
                  id="player-name"
                  value={nameDraft}
                  onChange={(e) => setNameDraft(e.target.value)}
                  maxLength={20}
                  required
                  autoFocus
                  className="w-full rounded border border-gray-300 px-3 py-2 mb-3"
                />
                <button type="submit" className="w-full rounded-lg bg-urv-red text-white font-bold px-4 py-2 hover:bg-comp-dark-red">
                  Play
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-600">
          <button onClick={restart} className="rounded-lg bg-urv-red text-white font-bold px-4 py-2 hover:bg-comp-dark-red">
            Restart ({keyLabel(keys.restart)})
          </button>
          <span>Clear 40 lines as fast as you can.</span>
          {player && (
            <span className="ml-auto">
              Playing as <b className="text-urv-black">{player}</b>
              {personalBest && <> · best {formatTime(personalBest.time)}</>} ·{' '}
              <button onClick={() => setPlayer('')} className="text-urv-red hover:underline">
                change
              </button>
            </span>
          )}
        </div>

        {lastRun && (
          <p
            className={`mt-4 p-3 rounded-lg text-sm font-bold ${
              lastRun.personalBest ? 'bg-comp-yellow/30' : 'bg-gray-100'
            }`}
          >
            {lastRun.personalBest
              ? `New personal best: ${formatTime(lastRun.time)}! Saved to the leaderboard.`
              : `${formatTime(lastRun.time)} — your best is still ${formatTime(personalBest?.time ?? lastRun.time)}.`}
          </p>
        )}

        {/* On-screen controls for phones and tablets */}
        <div className="mt-4 hidden [@media(pointer:coarse)]:grid grid-cols-4 gap-2">
          {pad('hold', 'Hold')}
          {pad('rotateCCW', '↺')}
          {pad('rotate180', '180')}
          {pad('rotateCW', '↻')}
          {pad('left', '←')}
          {pad('softDrop', '↓')}
          {pad('hardDrop', '⤓')}
          {pad('right', '→')}
        </div>

        <details className="mt-6 rounded-lg border border-gray-200 p-4">
          <summary className="cursor-pointer font-bold">Settings</summary>
          <div className="mt-4 grid gap-x-10 gap-y-3 sm:grid-cols-2">
            <div className="space-y-3">
              <h3 className="font-bold text-sm">Handling</h3>
              {number('das', 'DAS (ms)', 0, 500, 'Delay before a held move repeats')}
              {number('arr', 'ARR (ms)', 0, 200, 'Time between repeats (0 = instant)')}
              {number('sdf', 'Soft drop speed', 0, 100, 'Times faster than gravity (0 = instant)')}
              {number('lockDelay', 'Lock delay (ms)', 0, 5000)}
              {number('gravity', 'Gravity (ms per row)', 16, 5000)}
              {number('previews', 'Next pieces shown', 1, 5)}
              <label className="flex items-center justify-between text-sm">
                Ghost piece
                <input type="checkbox" checked={settings.ghost} onChange={(e) => updateSettings({ ghost: e.target.checked })} />
              </label>
              <label className="flex items-center justify-between text-sm">
                Grid
                <input type="checkbox" checked={settings.grid} onChange={(e) => updateSettings({ grid: e.target.checked })} />
              </label>
              <label className="flex items-center justify-between text-sm">
                Sound
                <input type="checkbox" checked={settings.sound} onChange={(e) => updateSettings({ sound: e.target.checked })} />
              </label>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-sm">Controls</h3>
              {(Object.keys(ACTION_NAMES) as Action[]).map((action) => (
                <div key={action} className="flex items-center justify-between text-sm">
                  {ACTION_NAMES[action]}
                  <button
                    onClick={() => setRebinding(action)}
                    className={`min-w-[5rem] rounded border px-2 py-1 font-mono ${
                      rebinding === action ? 'border-urv-red bg-urv-red text-white' : 'border-gray-300 hover:border-urv-red'
                    }`}
                  >
                    {rebinding === action ? 'press a key' : keyLabel(keys[action])}
                  </button>
                </div>
              ))}

              <button
                onClick={() => {
                  updateSettings(DEFAULT_SETTINGS);
                  setKeys(DEFAULT_KEYS);
                  saveKeys(DEFAULT_KEYS);
                }}
                className="mt-2 text-sm text-urv-red hover:underline"
              >
                Reset to defaults
              </button>
            </div>
          </div>
        </details>
      </div>

      {/* Side panel: leaderboard */}
      <div className="w-full xl:w-80 space-y-6">
        <section>
          <h2 className="text-xl font-bold mb-3">Best times</h2>
          {scores.length > 0 && (
            <ol className="text-sm divide-y divide-gray-100 border border-gray-200 rounded-lg">
              {scores.map((s, i) => (
                <li
                  key={s.name}
                  className={`flex items-center gap-3 px-3 py-2 ${s.name === player ? 'bg-comp-yellow/30 font-bold' : ''}`}
                >
                  <span className="w-5 text-gray-400">{i + 1}</span>
                  <span className="flex-1 truncate">{s.name}</span>
                  <span className="tabular-nums">{formatTime(s.time)}</span>
                </li>
              ))}
            </ol>
          )}
          {live === 'error' && (
            <p className="mt-2 text-xs text-gray-500">Couldn&apos;t reach the online leaderboard.</p>
          )}
        </section>
      </div>
    </div>
  );
}
