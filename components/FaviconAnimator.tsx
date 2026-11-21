'use client';

import { useEffect } from 'react';

const SIZE = 32;
const FRAMES = 120; // one full period of the orbit
const FRAME_MS = 70;
const SCALE = 10.5; // orbit units -> pixels (the orbit spans about ±1.15)
const DOT = 2.3;
const COLORS = ['#4ADE80', '#22C55E', '#16A34A'];
const OUTLINE = '#14532D';

type Point = [number, number];

/**
 * The "moth I" periodic orbit of the planar three-body problem (Šuvakov & Dmitrašinović, 2013):
 * three equal masses (G = m = 1) start at (−1, 0), (1, 0), (0, 0) with velocities (p1, p2),
 * (p1, p2), (−2p1, −2p2) and come back to the start after one period.
 * Integrated once with classic Runge–Kutta; returns the three positions at FRAMES moments.
 */
function mothOrbit(): Point[][] {
  const [p1, p2, period] = [0.464445, 0.39606, 14.8939];
  const perFrame = 130;
  const steps = FRAMES * perFrame;
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

  const frames: Point[][] = [];
  for (let n = 0; n < steps; n++) {
    if (n % perFrame === 0) frames.push([0, 1, 2].map((i) => [s[2 * i], s[2 * i + 1]] as Point));
    const k1 = deriv(s);
    const k2 = deriv(step(s, k1, dt / 2));
    const k3 = deriv(step(s, k2, dt / 2));
    const k4 = deriv(step(s, k3, dt));
    s = s.map((v, k) => v + (dt / 6) * (k1[k] + 2 * k2[k] + 2 * k3[k] + k4[k]));
  }
  return frames;
}

/** Draws the three bodies and returns the frame as a PNG data URL. */
function drawBodies(ctx: CanvasRenderingContext2D, bodies: Point[]): string {
  ctx.clearRect(0, 0, SIZE, SIZE);
  ctx.strokeStyle = OUTLINE;
  ctx.lineWidth = 1;
  bodies.forEach(([x, y], i) => {
    ctx.fillStyle = COLORS[i];
    ctx.beginPath();
    ctx.arc(SIZE / 2 + x * SCALE, SIZE / 2 - y * SCALE, DOT, 0, 2 * Math.PI);
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

    const frames = mothOrbit().map((bodies) => drawBodies(ctx, bodies));

    let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }

    let i = 0;
    const timer = setInterval(() => {
      if (document.hidden) return; // nobody is looking: do nothing
      link!.href = frames[(i = (i + 1) % FRAMES)];
    }, FRAME_MS);

    return () => clearInterval(timer);
  }, []);

  return null;
}
