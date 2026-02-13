'use client';

import { useEffect, useRef } from 'react';

/**
 * FaviconAnimator: Real-time 3D Torus Renderer
 * Renders a mathematically accurate rotating torus directly to the favicon.
 */
export default function FaviconAnimator() {
  const animationRef = useRef<number | null>(null);
  const angleRef = useRef({ A: 0, B: 0 }); // Rotation angles

  useEffect(() => {
    // Create an offscreen canvas for rendering (32x32 for high-res favicon)
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const renderFrame = () => {
      ctx.clearRect(0, 0, 32, 32);
      
      // Update rotation angles (slightly faster)
      angleRef.current.A += 0.08;
      angleRef.current.B += 0.04;
      const { A, B } = angleRef.current;

      const R1 = 0.8; // inner tube radius
      const R2 = 2.2; // major radius
      const K2 = 5; 
      const K1 = 32 * K2 * 3 / (8 * (R1 + R2)); 

      const cosA = Math.cos(A);
      const sinA = Math.sin(A);
      const cosB = Math.cos(B);
      const sinB = Math.sin(B);

      // Higher density for a tiny icon
      for (let theta = 0; theta < 2 * Math.PI; theta += 0.3) {
        const cosT = Math.cos(theta);
        const sinT = Math.sin(theta);

        for (let phi = 0; phi < 2 * Math.PI; phi += 0.15) {
          const cosP = Math.cos(phi);
          const sinP = Math.sin(phi);

          // 3D coordinates
          const circleX = R2 + R1 * cosT;
          const circleY = R1 * sinT;

          const x = circleX * (cosB * cosP + sinA * sinB * sinP) - circleY * cosA * sinB;
          const y = circleX * (sinB * cosP - sinA * cosB * sinP) + circleY * cosA * cosB;
          const z = K2 + cosA * circleX * sinP + circleY * sinA;
          const ooz = 1 / z;

          // Projection
          const xp = Math.floor(16 + K1 * ooz * x);
          const yp = Math.floor(16 - K1 * ooz * y);

          // Calculate "Luminance" for visibility
          const L = (cosP * cosT * sinB - cosA * cosT * sinP - sinA * sinT + cosB * (cosA * sinT - cosT * sinA * sinP));
          
          if (L > 0) {
            // Front part: Vibrant Red
            ctx.fillStyle = '#E11D48'; 
            ctx.fillRect(xp, yp, 1.8, 1.8);
            
            // Add a white "highlight" dot for extreme contrast
            if (L > 0.6) {
              ctx.fillStyle = '#FFFFFF';
              ctx.fillRect(xp, yp, 1, 1);
            }
          } else {
            // Back part: Dark Gray/Black (visible on white)
            ctx.fillStyle = '#111827';
            ctx.fillRect(xp, yp, 1, 1);
          }
        }
      }

      // Update the favicon link
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.querySelector("link[rel='shortcut icon']") as HTMLLinkElement;
      }
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = canvas.toDataURL('image/png');

      // Loop at ~30fps for performance and smoothness
      setTimeout(() => {
        animationRef.current = requestAnimationFrame(renderFrame);
      }, 33);
    };

    renderFrame();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return null;
}