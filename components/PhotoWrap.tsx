'use client';

import { useEffect, useRef } from 'react';

const GAP = 40; // space between the circle and the text, in px

/**
 * A round photo on the left with paragraphs beside it. Each paragraph is kept as a straight
 * block but is pushed right just enough to clear the circle at its own height, so the text
 * steps around the photo paragraph by paragraph. On phones the photo sits above the text.
 */
export default function PhotoWrap({ photo, children }: { photo: React.ReactNode; children: React.ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const figure = useRef<HTMLDivElement>(null);
  const text = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = box.current;
    const photoBox = figure.current;
    const textBox = text.current;
    if (!container || !photoBox || !textBox) return;
    const paragraphs = Array.from(textBox.children) as HTMLElement[];
    const wide = window.matchMedia('(min-width: 768px)');

    const layout = () => {
      if (!wide.matches) {
        paragraphs.forEach((p) => (p.style.marginLeft = ''));
        return;
      }
      const size = photoBox.offsetWidth;
      const r = size / 2;
      // How far right the circle reaches anywhere between heights y0 and y1 (0 if it doesn't)
      const reach = (y0: number, y1: number) => {
        if (y1 <= 0 || y0 >= size) return 0;
        const dy = y0 > r ? y0 - r : y1 < r ? r - y1 : 0;
        return r + Math.sqrt(Math.max(0, r * r - dy * dy)) + GAP;
      };
      // Indents change the paragraphs' heights, so settle it in a few passes
      for (let pass = 0; pass < 4; pass++) {
        let changed = false;
        for (const p of paragraphs) {
          const top = p.offsetTop;
          const indent = Math.round(reach(top, top + p.offsetHeight));
          if (p.style.marginLeft !== `${indent}px`) {
            p.style.marginLeft = `${indent}px`;
            changed = true;
          }
        }
        if (!changed) break;
      }
    };

    layout();
    const observer = new ResizeObserver(layout);
    observer.observe(container);
    wide.addEventListener('change', layout);
    document.fonts?.ready.then(layout);
    return () => {
      observer.disconnect();
      wide.removeEventListener('change', layout);
    };
  }, []);

  return (
    <div ref={box} className="relative">
      <div
        ref={figure}
        className="mx-auto mb-8 w-56 lg:w-64 md:absolute md:left-0 md:top-0 md:mb-0"
      >
        {photo}
      </div>
      {/* Before the measurement runs, keep the text clear of the photo */}
      <div
        ref={text}
        className="text-lg leading-relaxed space-y-5 md:min-h-[14rem] lg:min-h-[16rem] [&>*]:md:ml-[calc(14rem+40px)] [&>*]:lg:ml-[calc(16rem+40px)]"
      >
        {children}
      </div>
    </div>
  );
}
