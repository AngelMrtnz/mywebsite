'use client';

import { useEffect } from 'react';

const SIZE = 32;
const FRAMES = 24; // one full turn
const FRAME_MS = 100;

/** Draws one frame of a rotating torus and returns it as a PNG data URL. */
function drawTorus(ctx: CanvasRenderingContext2D, angle: number): string {
  const R = 2.2; // distance from the centre of the torus to the centre of the tube
  const r = 0.8; // tube radius
  const scale = SIZE / (2 * (R + r) + 0.5); // fit the torus in the icon
  const [cosA, sinA] = [Math.cos(angle), Math.sin(angle)];

  ctx.clearRect(0, 0, SIZE, SIZE);

  for (let u = 0; u < 2 * Math.PI; u += 0.12) {
    for (let v = 0; v < 2 * Math.PI; v += 0.25) {
      // Point on the torus
      const ring = R + r * Math.cos(v);
      const x = ring * Math.cos(u);
      const y = ring * Math.sin(u);
      const z = r * Math.sin(v);

      // Tumble: rotate around the horizontal axis, then the vertical one
      const y1 = y * cosA - z * sinA;
      const z1 = y * sinA + z * cosA;
      const x2 = x * cosA + z1 * sinA;
      const depth = -x * sinA + z1 * cosA;

      // Front half in bright green with bigger dots, back half in dark green
      const front = depth < 0;
      ctx.fillStyle = front ? '#22C55E' : '#166534';
      const dot = front ? 2 : 1.4;
      ctx.fillRect(SIZE / 2 + x2 * scale, SIZE / 2 + y1 * scale, dot, dot);
    }
  }

  return ctx.canvas.toDataURL('image/png');
}

/** Animates the favicon as a spinning torus. Frames are drawn once, then cycled. */
export default function FaviconAnimator() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = SIZE;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const frames = Array.from({ length: FRAMES }, (_, i) =>
      drawTorus(ctx, (i / FRAMES) * 2 * Math.PI)
    );

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
