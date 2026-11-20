'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { FaBars, FaTimes } from 'react-icons/fa';
import FaviconAnimator from './FaviconAnimator';
import Sidebar from './Sidebar';

/** Page frame: a menu button, a slide-in sidebar, and the scrolling content area. */
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
    <div className="flex h-screen overflow-hidden">
      <FaviconAnimator />

      <button
        className={`fixed top-4 left-4 z-50 p-2 rounded-md transition-colors shadow-lg ${
          open ? 'bg-white text-urv-red hover:bg-gray-100' : 'bg-urv-red text-white hover:bg-comp-dark-red'
        }`}
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="sidebar"
      >
        {open ? <FaTimes /> : <FaBars />}
      </button>

      <aside
        id="sidebar"
        className={`fixed inset-y-0 left-0 z-40 transition-[transform,visibility] duration-300 ease-in-out ${
          open ? 'translate-x-0' : '-translate-x-full invisible'
        }`}
      >
        <Sidebar onNavigate={() => setOpen(false)} />
      </aside>

      {open && (
        <div className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm" onClick={() => setOpen(false)} />
      )}

      <main ref={main} className="flex-1 h-full min-w-0 overflow-auto">
        <div key={pathname} className="px-4 sm:px-8 pb-8 pt-20 animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
