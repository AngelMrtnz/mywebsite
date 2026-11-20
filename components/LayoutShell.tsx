'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { FaBars, FaTimes } from 'react-icons/fa';
import FaviconAnimator from './FaviconAnimator';
import Sidebar from './Sidebar';

/**
 * Page frame.
 * - Large screens: the sidebar is always visible on the left.
 * - Phones and tablets: a top bar with a menu button that slides the sidebar in.
 */
export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const main = useRef<HTMLElement>(null);
  const pathname = usePathname();

  // New page: start at the top
  useEffect(() => {
    main.current?.scrollTo(0, 0);
  }, [pathname]);

  // Escape closes the menu
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div className="flex h-dvh overflow-hidden">
      <FaviconAnimator />

      {/* Sidebar: slide-in drawer on small screens, always shown on large ones */}
      <aside
        id="sidebar"
        className={`fixed inset-y-0 left-0 z-40 transition-[transform,visibility] duration-300 ease-in-out
          lg:static lg:translate-x-0 lg:visible lg:transition-none ${
            open ? 'translate-x-0' : '-translate-x-full invisible'
          }`}
      >
        <Sidebar onNavigate={() => setOpen(false)} />
        <button
          className="lg:hidden absolute top-3 right-3 p-3 rounded-lg text-white hover:bg-white/10 transition-colors"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
        >
          <FaTimes size={22} />
        </button>
      </aside>

      {open && (
        <div className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden" onClick={() => setOpen(false)} />
      )}

      <main ref={main} className="flex-1 h-full min-w-0 overflow-auto">
        {/* Top bar, small screens only */}
        <header className="lg:hidden sticky top-0 z-20 flex items-center gap-3 px-4 h-16 bg-urv-red text-white shadow-md">
          <button
            className="p-3 -ml-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="sidebar"
          >
            <FaBars size={22} />
          </button>
          <span className="text-lg font-bold tracking-wide">Ángel Martínez Muñoz</span>
        </header>

        <div key={pathname} className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-12 py-8 lg:py-12 animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
