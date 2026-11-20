// Draws the game onto a canvas. Layout in cells: hold+stats (5) | board (10) | next (5).
// Look: dark background, subtle grid, smooth neon blocks, quiet grey text.
import { COLS, FLASH_MS, GOAL_LINES, HIDDEN, ROWS, SHAPES, type Game, type PieceType } from './engine';
import { formatTime } from './storage';

export const LAYOUT_COLS = 20;
export const LAYOUT_ROWS = 20;

const COLORS: Record<PieceType, string> = {
  I: '#00E1FF',
  O: '#FFC933',
  T: '#FF2FD5',
  S: '#8CFF1A',
  Z: '#FF2E5F',
  J: '#2E5BFF',
  L: '#FF7A1A',
};

const BACKGROUND = '#0A0A0B';
const FRAME = '#4A4A4F';
const GRID = 'rgba(255,255,255,0.07)';
const TEXT_DIM = '#6E6E76';
const TEXT = '#B4B4BC';
const TEXT_BRIGHT = '#F4F4F5';

/** One square. Edges snap to whole pixels so a piece's squares join into one smooth shape. */
function cell(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, alpha = 1) {
  const x0 = Math.round(x);
  const y0 = Math.round(y);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.fillRect(x0, y0, Math.round(x + size) - x0, Math.round(y + size) - y0);
  ctx.globalAlpha = 1;
}

/** A small piece centred on (cx, cy), for hold and next. */
function miniPiece(ctx: CanvasRenderingContext2D, type: PieceType, cx: number, cy: number, size: number, dim = false) {
  const cells = SHAPES[type][0];
  const xs = cells.map(([x]) => x);
  const ys = cells.map(([, y]) => y);
  const ox = cx - ((Math.max(...xs) - Math.min(...xs) + 1) * size) / 2 - Math.min(...xs) * size;
  const oy = cy - ((Math.max(...ys) - Math.min(...ys) + 1) * size) / 2 - Math.min(...ys) * size;
  for (const [x, y] of cells) cell(ctx, ox + x * size, oy + y * size, size, dim ? '#3F3F46' : COLORS[type]);
}

function text(
  ctx: CanvasRenderingContext2D,
  value: string,
  x: number,
  y: number,
  size: number,
  color: string,
  align: CanvasTextAlign = 'left',
  weight = 700
) {
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.font = `${weight} ${size}px Lato, system-ui, sans-serif`;
  ctx.fillText(value, x, y);
}

export function drawGame(ctx: CanvasRenderingContext2D, game: Game, c: number) {
  const W = LAYOUT_COLS * c;
  const H = LAYOUT_ROWS * c;
  const bx = 5 * c; // board left edge
  const bw = COLS * c;

  ctx.fillStyle = BACKGROUND;
  ctx.fillRect(0, 0, W, H);
  ctx.textBaseline = 'alphabetic';

  // ---- Board ----
  if (game.settings.grid) {
    ctx.strokeStyle = GRID;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 1; x < COLS; x++) {
      ctx.moveTo(bx + x * c + 0.5, 0);
      ctx.lineTo(bx + x * c + 0.5, H);
    }
    for (let y = 1; y < ROWS - HIDDEN; y++) {
      ctx.moveTo(bx, y * c + 0.5);
      ctx.lineTo(bx + bw, y * c + 0.5);
    }
    ctx.stroke();
  }

  for (let y = HIDDEN; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const t = game.board[y][x];
      if (t) cell(ctx, bx + x * c, (y - HIDDEN) * c, c, COLORS[t]);
    }
  }

  const playing = game.phase === 'playing';
  const color = COLORS[game.piece.type];

  // Ghost: a dark shade of the piece where it would land
  if (playing && game.settings.ghost) {
    for (const [x, y] of game.cells({ ...game.piece, y: game.ghostY() })) {
      if (y >= HIDDEN) cell(ctx, bx + x * c, (y - HIDDEN) * c, c, color, 0.3);
    }
  }

  if (playing || game.phase === 'countdown') {
    for (const [x, y] of game.cells()) {
      if (y >= HIDDEN) cell(ctx, bx + x * c, (y - HIDDEN) * c, c, color, playing ? 1 : 0.45);
    }
  }

  // Soft flash after clearing lines
  if (game.flash > 0) {
    ctx.fillStyle = `rgba(255,255,255,${(0.18 * game.flash) / FLASH_MS})`;
    ctx.fillRect(bx, 0, bw, H);
  }

  ctx.strokeStyle = FRAME;
  ctx.lineWidth = 2;
  ctx.strokeRect(bx - 1, 1, bw + 2, H - 2);

  // ---- Left: hold + stats ----
  const mini = c * 0.8;
  const left = 2.5 * c;
  text(ctx, 'HOLD', left, 1.2 * c, 0.5 * c, TEXT_DIM, 'center');
  if (game.holdType) miniPiece(ctx, game.holdType, left, 2.8 * c, mini, game.holdUsed);

  text(ctx, 'TIME', left, 12.2 * c, 0.45 * c, TEXT_DIM, 'center');
  text(ctx, formatTime(game.time), left, 13.2 * c, 0.75 * c, TEXT_BRIGHT, 'center');
  text(ctx, 'PPS', left, 14.6 * c, 0.45 * c, TEXT_DIM, 'center');
  text(ctx, game.pps.toFixed(2), left, 15.6 * c, 0.75 * c, TEXT, 'center');

  // Big "lines left" counter
  text(ctx, String(GOAL_LINES - game.lines), left, 18.4 * c, 1.7 * c, TEXT, 'center', 400);
  text(ctx, 'lines left', left, 19.3 * c, 0.45 * c, TEXT_DIM, 'center', 400);

  // ---- Right: next queue ----
  const right = 17.5 * c;
  text(ctx, 'NEXT', right, 1.2 * c, 0.5 * c, TEXT_DIM, 'center');
  const count = Math.max(1, Math.min(5, game.settings.previews));
  game.queue.slice(0, count).forEach((t, i) => miniPiece(ctx, t, right, 2.9 * c + i * 3.1 * c, mini));

  // ---- Messages over the board ----
  const centre = bx + bw / 2;
  const message = (big: string, small?: string) => {
    ctx.fillStyle = 'rgba(10,10,11,0.82)';
    ctx.fillRect(bx, H / 2 - 2.2 * c, bw, small ? 4.4 * c : 3.2 * c);
    text(ctx, big, centre, H / 2, 1.3 * c, TEXT_BRIGHT, 'center');
    if (small) text(ctx, small, centre, H / 2 + 1.4 * c, 0.5 * c, TEXT, 'center', 400);
  };

  if (game.phase === 'countdown') message(game.countdown > 600 ? 'READY' : 'GO!');
  if (game.phase === 'finished') {
    const pieces = `${game.pieces} ${game.pieces === 1 ? 'piece' : 'pieces'}`;
    message(formatTime(game.time), `${pieces} · ${game.pps.toFixed(2)} PPS`);
  }
  if (game.phase === 'toppedOut') message('TOPPED OUT', 'Press restart to try again');

  ctx.textAlign = 'left';
}
