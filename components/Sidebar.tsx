// components/Sidebar.tsx
'use client'; 

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getPublicPath } from '@/lib/paths';
import { 
  FaUser, 
  FaBookOpen, 
  FaGlobeAmericas, 
  FaChalkboardTeacher 
} from 'react-icons/fa';

const navLinks = [
  { name: 'About me', href: '/', icon: FaUser },
  { name: 'Research', href: '/research', icon: FaBookOpen },
  { name: 'Conferences', href: '/conferences', icon: FaGlobeAmericas },
  { name: 'Teaching', href: '/teaching', icon: FaChalkboardTeacher },
];

interface SidebarProps {
  className?: string;
  onLinkClick?: () => void;
}

const Sidebar = ({ className = '', onLinkClick }: SidebarProps) => {
  const pathname = usePathname();

  // Helper function to check if a link is active, considering potential basePath
  const isActive = (href: string) => {
    // Exact match or match after stripping potential basePath
    if (pathname === href) return true;
    
    // If there's a base path, pathname might be /basePath/path
    // We check if the pathname ends with the href (or is exactly the href after removing base path)
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    if (basePath && pathname === `${basePath}${href === '/' ? '' : href}`) return true;
    if (basePath && pathname === `${basePath}${href}`) return true;

    return false;
  };

  return (
    <div
      className={`bg-urv-red text-white w-64 p-6 flex flex-col h-full shadow-2xl overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent ${className}`}
    >
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold tracking-wide">Ángel<br/>Martínez Muñoz</h1>
        <a href="mailto:angel.martinezm@urv.cat" className="flex items-center justify-center gap-2 text-xs mt-3 text-white/80 no-underline transition-opacity hover:opacity-100 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
          <span>angel.martinezm@urv.cat</span>
        </a>
      </div>

      <div className="w-full h-px bg-white/20 mb-8"></div>

      {/* Navigation Section */}
      <nav className="flex-grow sidebar-nav">
        <ul className="space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <li key={link.href}>
                <Link 
                  href={getPublicPath(link.href)} 
                  className="no-underline block"
                  onClick={onLinkClick}
                  onMouseEnter={() => {
                    if (link.href === '/research') {
                      // Pre-warm the cache for research data
                      const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
                      fetch(`${basePath}/papers.xml`).catch(() => {});
                      fetch(`${basePath}/coauthors.json`).catch(() => {});
                    }
                  }}
                >
                  <div
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      active 
                        ? 'bg-white text-urv-red font-bold shadow-md transform translate-x-1' 
                        : 'text-white hover:bg-white/10 hover:translate-x-1'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{link.name}</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;