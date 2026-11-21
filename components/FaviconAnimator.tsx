'use client';

import { useEffect } from 'react';

const SIZE = 32;
const FRAMES = 200; // one full period of the orbit
const FRAME_MS = 45;
const SCALE = 10.5; // orbit units -> pixels (the orbit spans about ±1.15)
const DOT = 2.3;
const COLORS = ['#4ADE80', '#22C55E', '#16A34A'];
const OUTLINE = '#14532D';

type Point = [number, number];

/**
 * The "moth I" periodic orbit of the planar three-body problem (Šuvakov & Dmitrašinović, 2013):
 * three equal masses (G = m = 1) start at (−1, 0), (1, 0), (0, 0) with velocities (p1, p2),
 * (p1, p2), (−2p1, −2p2) and come back to the start after one period.
 * Integrated once with classic Runge–Kutta. Frames are picked so that the bodies move about the
 * same distance from one frame to the next (not equal time steps): the bodies race through
 * close encounters, and equal time steps would make them jump there.
 */
function mothOrbit(): Point[][] {
  const [p1, p2, period] = [0.464445, 0.39606, 14.8939];
  const steps = 6000;
  const dt = period / steps;

  // State: positions then velocities, flattened [x1, y1, x2, y2, x3, y3, vx1, ..., vy3]
  let s = [-1, 0, 1, 0, 0, 0, p1, p2, p1, p2, -2 * p1, -2 * p2];

  const deriv = (q: number[]) => {
    const d = new Array(12).fill(0);
    for (let i = 0; i < 3; i++) {
      d[2 * i] = q[6 + 2 * i];
      d[2 * i + 1] = q[7 + 2 * i];
      for (let j = 0; j < 3; j++) {
        if (i === j) continue;
        const dx = q[2 * j] - q[2 * i];
        const dy = q[2 * j + 1] - q[2 * i + 1];
        const r3 = Math.hypot(dx, dy) ** 3;
        d[6 + 2 * i] += dx / r3;
        d[7 + 2 * i] += dy / r3;
      }
    }
    return d;
  };
  const step = (q: number[], d: number[], h: number) => q.map((v, k) => v + d[k] * h);

  const positions = () => [0, 1, 2].map((i) => [s[2 * i], s[2 * i + 1]] as Point);
  const states: Point[][] = [positions()];
  const travelled = [0]; // running total of how far the fastest body has moved
  for (let n = 0; n < steps; n++) {
    const k1 = deriv(s);
    const k2 = deriv(step(s, k1, dt / 2));
    const k3 = deriv(step(s, k2, dt / 2));
    const k4 = deriv(step(s, k3, dt));
    s = s.map((v, k) => v + (dt / 6) * (k1[k] + 2 * k2[k] + 2 * k3[k] + k4[k]));
    const prev = states[states.length - 1];
    const now = positions();
    const moved = Math.max(...now.map(([x, y], i) => Math.hypot(x - prev[i][0], y - prev[i][1])));
    states.push(now);
    travelled.push(travelled[travelled.length - 1] + moved);
  }

  // Equal distance between frames
  const total = travelled[travelled.length - 1];
  const frames: Point[][] = [];
  let k = 0;
  for (let f = 0; f < FRAMES; f++) {
    const target = (f / FRAMES) * total;
    while (travelled[k] < target) k++;
    frames.push(states[k]);
  }
  return frames;
}

const TRAIL = 14; // how many earlier frames each body's trail reaches back

const toPixel = ([x, y]: Point) => [SIZE / 2 + x * SCALE, SIZE / 2 - y * SCALE];

/** Draws frame f: a short fading trail behind each body, then the bodies. Returns a PNG data URL. */
function drawBodies(ctx: CanvasRenderingContext2D, orbit: Point[][], f: number): string {
  ctx.clearRect(0, 0, SIZE, SIZE);
  const at = (k: number) => orbit[(f - k + orbit.length) % orbit.length];

  // Trails: each segment a little fainter and thinner the older it is
  ctx.lineCap = 'round';
  for (let i = 0; i < 3; i++) {
    ctx.strokeStyle = COLORS[i];
    for (let k = TRAIL; k > 0; k--) {
      const fade = 1 - k / (TRAIL + 1);
      const [x0, y0] = toPixel(at(k)[i]);
      const [x1, y1] = toPixel(at(k - 1)[i]);
      ctx.globalAlpha = 0.6 * fade;
      ctx.lineWidth = 0.6 + 1.6 * fade;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;

  ctx.strokeStyle = OUTLINE;
  ctx.lineWidth = 1;
  orbit[f].forEach((body, i) => {
    const [x, y] = toPixel(body);
    ctx.fillStyle = COLORS[i];
    ctx.beginPath();
    ctx.arc(x, y, DOT, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
  });
  return ctx.canvas.toDataURL('image/png');
}

/** Animates the favicon as three bodies on a periodic orbit. Frames are drawn once, then cycled. */
export default function FaviconAnimator() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = SIZE;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // The orbit is quick to work out (a few tens of ms); each frame is drawn the first time
    // it is shown and then reused.
    const orbit = mothOrbit();
    const frames: string[] = [];

    let i = 0;
    const timer = window.setInterval(() => {
      if (document.hidden) return; // nobody is looking: do nothing
      i = (i + 1) % FRAMES;
      frames[i] ??= drawBodies(ctx, orbit, i);
      // Look the icon up every time: Next.js may swap the <link> when you change page
      let links = document.querySelectorAll<HTMLLinkElement>("link[rel~='icon']");
      if (!links.length) {
        const link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
        links = document.querySelectorAll<HTMLLinkElement>("link[rel~='icon']");
      }
      links.forEach((link) => (link.href = frames[i]));
    }, FRAME_MS);

    return () => window.clearInterval(timer);
  }, []);

  return null;
}
