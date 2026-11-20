'use client';

import { useRef, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import type { CarouselImage } from '@/lib/data';
import { asset } from '@/lib/paths';

/**
 * Photo carousel built on native scroll-snap: swiping works on phones for free,
 * and the arrows/dots just scroll the strip.
 */
export default function Carousel({ images }: { images: CarouselImage[] }) {
  const strip = useRef<HTMLDivElement>(null);
  const target = useRef(0); // where we're scrolling to, so fast clicks add up
  const [current, setCurrent] = useState(0);

  if (images.length === 0) return null;

  const goTo = (index: number) => {
    const el = strip.current;
    if (!el) return;
    target.current = (index + images.length) % images.length;
    el.scrollTo({ left: target.current * el.clientWidth, behavior: 'smooth' });
  };

  const onScroll = (el: HTMLDivElement) => {
    const index = Math.round(el.scrollLeft / el.clientWidth);
    setCurrent(index);
    // Exactly on a photo: the scroll is done (also after a swipe)
    if (Math.abs(el.scrollLeft - index * el.clientWidth) < 2) target.current = index;
  };

  const arrow =
    'absolute top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 text-urv-black shadow-lg ' +
    'hover:bg-white hover:text-urv-red transition md:opacity-0 group-hover:opacity-100 focus-visible:opacity-100';

  return (
    <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-xl bg-urv-black shadow-lg group">
      <div
        ref={strip}
        className="flex h-full overflow-x-auto snap-x snap-mandatory scroll-smooth [scrollbar-width:none]"
        onScroll={(e) => onScroll(e.currentTarget)}
      >
        {images.map((image) => (
          <figure key={image.src} className="relative flex-none w-full h-full snap-center">
            {/* eslint-disable-next-line @next/next/no-img-element -- static export, no image optimizer */}
            <img
              src={asset(`/${image.src.replace(/^\//, '')}`)}
              alt={image.alt}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
            {image.caption && (
              <figcaption className="absolute bottom-8 inset-x-0 p-4 bg-black/40 backdrop-blur-sm text-white text-center text-sm md:text-lg font-medium">
                {image.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>

      <button className={`${arrow} left-4`} onClick={() => goTo(target.current - 1)} aria-label="Previous photo">
        <FaChevronLeft size={20} />
      </button>
      <button className={`${arrow} right-4`} onClick={() => goTo(target.current + 1)} aria-label="Next photo">
        <FaChevronRight size={20} />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {images.map((image, i) => (
          <button
            key={image.src}
            onClick={() => goTo(i)}
            aria-label={`Show photo ${i + 1}`}
            className={`h-2 rounded-full transition-all ${
              i === current ? 'bg-white w-4' : 'w-2 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
