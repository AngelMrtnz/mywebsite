'use client';

import { useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import { FaBars, FaTimes } from 'react-icons/fa';
import { usePathname } from 'next/navigation';
import FaviconAnimator from './FaviconAnimator';

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Default to closed
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  // Scroll to top on route change
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [pathname]);

  useEffect(() => {
    setIsMounted(true);
    
    // Initial check
    const mobile = window.innerWidth < 1024;
    setIsMobile(mobile);
    
    // We keep the sidebar closed by default on load for a clean entrance
    // The user can open it when they need navigation

    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      
      // If resizing to mobile, ensure it stays closed to avoid clutter
      if (mobile) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent hydration mismatch
  if (!isMounted) {
    return (
        <div className="flex h-screen bg-white text-urv-black">
            {/* Matches the 'ml-0' of the main component to prevent jumps */}
            <main className="flex-1 p-8 pt-20 ml-0 overflow-auto">
                {children}
            </main>
        </div>
    );
  }

  return (
    <div className="flex h-screen bg-white overflow-hidden relative">
       <FaviconAnimator />
       {/* Toggle Button */}
       <button
         className={`fixed top-4 left-4 z-50 p-2 rounded-md transition-colors shadow-lg ${
            isSidebarOpen 
              ? 'bg-white text-urv-red hover:bg-gray-100' 
              : 'bg-urv-red text-white hover:bg-comp-dark-red'
         }`}
         onClick={() => setIsSidebarOpen(!isSidebarOpen)}
         aria-label="Toggle Sidebar"
       >
         {isSidebarOpen ? <FaTimes /> : <FaBars />}
       </button>

       {/* Sidebar Container */}
       <aside 
        className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
       >
          <Sidebar 
            className="h-full w-64 pt-16" 
            onLinkClick={() => setIsSidebarOpen(false)} 
          />
       </aside>

       {/* Main Content */}
       <main 
        ref={mainRef}
        className="flex-1 h-full min-w-0 overflow-auto transition-all duration-300 ease-in-out ml-0" 
       >
         {/* No inner shadow needed as sidebar is now an overlay */}
         <div className="min-h-full flex flex-col">
            <div className="flex-1 p-8 pt-20">
              {children}
            </div>
         </div>
       </main>

       {/* Overlay (Visible whenever sidebar is open) */}
       {isSidebarOpen && (
         <div
           className="fixed inset-0 bg-black/30 z-30 backdrop-blur-sm transition-opacity duration-300"
           onClick={() => setIsSidebarOpen(false)}
         />
       )}
    </div>
  );
}
