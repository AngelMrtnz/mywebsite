// A falling-block 40-line race.
// Pure game logic (no DOM). The React component feeds it input and draws `state`.

export const COLS = 10;
export const ROWS = 22; // the top 2 rows are hidden spawn space
export const HIDDEN = 2;
export const GOAL_LINES = 40;

export type PieceType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';
export const PIECES: PieceType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

/** Cells of each piece in its spawn orientation, inside an n×n box. */
const BASE: Record<PieceType, { n: number; cells: [number, number][] }> = {
  I: { n: 4, cells: [[0, 1], [1, 1], [2, 1], [3, 1]] },
  O: { n: 2, cells: [[0, 0], [1, 0], [0, 1], [1, 1]] },
  T: { n: 3, cells: [[1, 0], [0, 1], [1, 1], [2, 1]] },
  S: { n: 3, cells: [[1, 0], [2, 0], [0, 1], [1, 1]] },
  Z: { n: 3, cells: [[0, 0], [1, 0], [1, 1], [2, 1]] },
  J: { n: 3, cells: [[0, 0], [0, 1], [1, 1], [2, 1]] },
  L: { n: 3, cells: [[2, 0], [0, 1], [1, 1], [2, 1]] },
};

/** All 4 rotations of every piece, precomputed. SHAPES[type][rot] = cells. */
export const SHAPES = Object.fromEntries(
  PIECES.map((type) => {
    const { n, cells } = BASE[type];
    const rotations = [cells];
    for (let r = 1; r < 4; r++) {
      rotations.push(rotations[r - 1].map(([x, y]) => [n - 1 - y, x] as [number, number]));
    }
    return [type, rotations];
  })
) as Record<PieceType, [number, number][][]>;

// Offsets tried, in order, when a rotation is blocked (y grows downwards).
const KICKS: [number, number][] = [
  [0, 0], [-1, 0], [1, 0], [0, -1], [-1, -1], [1, -1], [-2, 0], [2, 0], [0, 1], [-1, 1], [1, 1],
];

export interface Settings {
  das: number; // ms before auto-repeat starts
  arr: number; // ms between auto-repeat moves (0 = instant)
  sdf: number; // soft-drop speed multiplier (0 = instant)
  lockDelay: number; // ms a piece may rest on the stack before locking
  gravity: number; // ms per row when not soft dropping
  previews: number; // how many next pieces to show (1–5)
  ghost: boolean;
  grid: boolean;
  sound: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  das: 133,
  arr: 10,
  sdf: 0,
  lockDelay: 500,
  gravity: 1000,
  previews: 5,
  ghost: true,
  grid: true,
  sound: true,
};

export type Action =
  | 'left' | 'right' | 'softDrop' | 'hardDrop'
  | 'rotateCW' | 'rotateCCW' | 'rotate180' | 'hold' | 'restart';

export type Phase = 'countdown' | 'playing' | 'finished' | 'toppedOut';

interface Piece {
  type: PieceType;
  rot: number;
  x: number;
  y: number;
}

const COUNTDOWN_MS = 1500;
const MAX_LOCK_RESETS = 15;

export class Game {
  board: (PieceType | null)[][] = [];
  piece!: Piece;
  queue: PieceType[] = [];
  holdType: PieceType | null = null;
  holdUsed = false;
  lines = 0;
  pieces = 0;
  phase: Phase = 'countdown';
  /** ms since GO (frozen when finished) */
  time = 0;
  countdown = COUNTDOWN_MS;
  /** clears in a row (pieces that each cleared at least one line) */
  combo = 0;
  /** how many times lines have been cleared this run (for sounds) */
  clears = 0;
  /** lines cleared by the last piece */
  lastCleared = 0;

  private held = new Set<Action>();
  private dasDir: -1 | 0 | 1 = 0;
  private dasTimer = 0;
  private arrTimer = 0;
  private gravityTimer = 0;
  private lockTimer = 0;
  private lockResets = 0;

  settings: Settings;

  constructor(settings: Settings) {
    this.settings = settings;
    this.reset();
  }

  reset() {
    this.board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    this.queue = [];
    this.fillQueue();
    this.holdType = null;
    this.holdUsed = false;
    this.lines = 0;
    this.pieces = 0;
    this.time = 0;
    this.combo = 0;
    this.clears = 0;
    this.lastCleared = 0;
    this.countdown = COUNTDOWN_MS;
    this.phase = 'countdown';
    this.held.clear();
    this.dasDir = 0;
    this.spawn(this.queue.shift()!);
  }

  // ---------- input ----------

  press(action: Action) {
    if (action === 'restart') return this.reset();
    if (this.held.has(action)) return; // ignore key auto-repeat
    this.held.add(action);
    if (this.phase === 'finished' || this.phase === 'toppedOut') return;

    if (action === 'left' || action === 'right') {
      const dir = action === 'left' ? -1 : 1;
      this.dasDir = dir;
      this.dasTimer = 0;
      this.arrTimer = 0;
      if (this.phase === 'playing') this.shift(dir);
      return;
    }
    if (this.phase !== 'playing') return;

    switch (action) {
      case 'hardDrop':
        while (this.tryMove(0, 1));
        this.lock();
        break;
      case 'rotateCW':
        this.rotate(1);
        break;
      case 'rotateCCW':
        this.rotate(3);
        break;
      case 'rotate180':
        this.rotate(2);
        break;
      case 'hold':
        this.hold();
        break;
      case 'softDrop':
        if (this.settings.sdf === 0) while (this.tryMove(0, 1));
        break;
    }
  }

  /** Window lost focus: forget all held keys so nothing keeps moving. */
  releaseAll() {
    this.held.clear();
    this.dasDir = 0;
  }

  release(action: Action) {
    this.held.delete(action);
    if (action === 'left' || action === 'right') {
      // Fall back to the other direction if it's still held
      const other = action === 'left' ? 'right' : 'left';
      if (this.held.has(other)) {
        this.dasDir = other === 'left' ? -1 : 1;
        this.dasTimer = 0;
        this.arrTimer = 0;
      } else {
        this.dasDir = 0;
      }
    }
  }

  // ---------- time ----------

  update(dt: number) {
    if (this.phase === 'countdown') {
      this.countdown -= dt;
      if (this.dasDir) this.dasTimer += dt; // DAS can be charged before GO
      if (this.countdown <= 0) {
        this.phase = 'playing';
        // Keys held during the countdown take effect at GO (lets you pre-charge DAS)
        if (this.dasDir) this.shift(this.dasDir);
      }
      return;
    }
    if (this.phase !== 'playing') return;

    this.time += dt;
    const s = this.settings;

    // Auto-shift
    if (this.dasDir) {
      this.dasTimer += dt;
      if (this.dasTimer >= s.das) {
        if (s.arr === 0) {
          while (this.shift(this.dasDir));
        } else {
          this.arrTimer += dt;
          while (this.arrTimer >= s.arr) {
            this.arrTimer -= s.arr;
            if (!this.shift(this.dasDir)) break;
          }
        }
      }
    }

    // Gravity / soft drop
    const softDropping = this.held.has('softDrop');
    if (softDropping && s.sdf === 0) {
      while (this.tryMove(0, 1));
    } else {
      const interval = softDropping ? s.gravity / s.sdf : s.gravity;
      this.gravityTimer += dt;
      while (this.gravityTimer >= interval) {
        this.gravityTimer -= interval;
        if (!this.tryMove(0, 1)) break;
      }
    }

    // Locking
    if (this.collides(this.piece, 0, 1)) {
      this.lockTimer += dt;
      if (this.lockTimer >= s.lockDelay) this.lock();
    } else {
      this.lockTimer = 0;
    }
  }

  // ---------- queries for drawing ----------

  cells(p: Piece = this.piece): [number, number][] {
    return SHAPES[p.type][p.rot].map(([x, y]) => [x + p.x, y + p.y]);
  }

  ghostY(): number {
    let dy = 0;
    while (!this.collides(this.piece, 0, dy + 1)) dy++;
    return this.piece.y + dy;
  }

  get pps(): number {
    return this.time > 0 ? this.pieces / (this.time / 1000) : 0;
  }

  // ---------- internals ----------

  private fillQueue() {
    while (this.queue.length < 7) {
      // 7-bag: every piece once, shuffled
      const bag = [...PIECES];
      for (let i = bag.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [bag[i], bag[j]] = [bag[j], bag[i]];
      }
      this.queue.push(...bag);
    }
  }

  private spawn(type: PieceType) {
    const n = BASE[type].n;
    this.piece = { type, rot: 0, x: Math.floor((COLS - n) / 2), y: HIDDEN - 1 };
    this.gravityTimer = 0;
    this.lockTimer = 0;
    this.lockResets = 0;
    if (this.collides(this.piece, 0, 0)) {
      this.phase = 'toppedOut';
      return;
    }
    // Drop one row into view if there's room
    this.tryMove(0, 1);
  }

  private collides(p: Piece, dx: number, dy: number, rot = p.rot): boolean {
    return SHAPES[p.type][rot].some(([cx, cy]) => {
      const x = cx + p.x + dx;
      const y = cy + p.y + dy;
      return x < 0 || x >= COLS || y >= ROWS || (y >= 0 && this.board[y][x] !== null);
    });
  }

  private tryMove(dx: number, dy: number): boolean {
    if (this.collides(this.piece, dx, dy)) return false;
    this.piece.x += dx;
    this.piece.y += dy;
    if (dx !== 0) this.onSuccessfulMove();
    return true;
  }

  private shift(dir: number): boolean {
    return this.tryMove(dir, 0);
  }

  private rotate(turns: number) {
    const rot = (this.piece.rot + turns) % 4;
    for (const [kx, ky] of KICKS) {
      if (!this.collides(this.piece, kx, ky, rot)) {
        this.piece.x += kx;
        this.piece.y += ky;
        this.piece.rot = rot;
        this.onSuccessfulMove();
        return;
      }
    }
  }

  /** Moving or rotating on the stack gives a little more time, up to a limit. */
  private onSuccessfulMove() {
    if (this.lockResets < MAX_LOCK_RESETS) {
      this.lockTimer = 0;
      this.lockResets++;
    }
  }

  private hold() {
    if (this.holdUsed) return;
    const current = this.piece.type;
    const next = this.holdType ?? this.nextFromQueue();
    this.holdType = current;
    this.holdUsed = true;
    this.spawn(next);
  }

  private nextFromQueue(): PieceType {
    const next = this.queue.shift()!;
    this.fillQueue();
    return next;
  }

  private lock() {
    for (const [x, y] of this.cells()) {
      if (y >= 0) this.board[y][x] = this.piece.type;
    }
    this.pieces++;

    // Clear full rows
    const remaining = this.board.filter((row) => row.some((c) => c === null));
    const cleared = ROWS - remaining.length;
    if (cleared) {
      this.board = [...Array.from({ length: cleared }, () => Array(COLS).fill(null)), ...remaining];
      this.lines += cleared;
      this.combo++;
      this.clears++;
      this.lastCleared = cleared;
    } else {
      this.combo = 0;
    }

    if (this.lines >= GOAL_LINES) {
      this.lines = GOAL_LINES;
      this.phase = 'finished';
      return;
    }

    this.holdUsed = false;
    this.spawn(this.nextFromQueue());
  }
}
