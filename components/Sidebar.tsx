'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaBookOpen, FaChalkboardTeacher, FaGlobeAmericas, FaUser } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

const EMAIL = 'angel.martinezm@urv.cat';

const navLinks = [
  { name: 'About me', href: '/', icon: FaUser },
  { name: 'Research', href: '/research', icon: FaBookOpen },
  { name: 'Conferences', href: '/conferences', icon: FaGlobeAmericas },
  { name: 'Teaching', href: '/teaching', icon: FaChalkboardTeacher },
];

export default function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname(); // already without the /mywebsite base path

  return (
    <div className="bg-urv-red text-white w-72 max-w-[85vw] h-full px-6 pt-24 pb-3 lg:pt-12 flex flex-col shadow-2xl overflow-y-auto">
      <div className="text-center mb-8">
        <p className="text-3xl font-bold tracking-wide leading-tight">
          Ángel
          <br />
          Martínez Muñoz
        </p>
        <a
          href={`mailto:${EMAIL}`}
          className="inline-flex items-center justify-center gap-2 text-sm mt-4 text-white/85 hover:text-white hover:no-underline transition-colors"
        >
          <MdEmail size={16} />
          {EMAIL}
        </a>
      </div>

      <hr className="border-white/20 mb-8" />

      <nav>
        <ul className="space-y-2">
          {navLinks.map(({ name, href, icon: Icon }) => {
            const active = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  onClick={onNavigate}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-lg text-lg transition-all duration-200 hover:no-underline ${
                    active
                      ? 'bg-white text-urv-red font-bold shadow-md'
                      : 'text-white hover:bg-white/10 hover:translate-x-1'
                  }`}
                >
                  <Icon size={20} />
                  {name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Little tetromino at the bottom: opens the game */}
      <Link
        href="/play"
        onClick={onNavigate}
        title="40 line race"
        aria-label="40 line race"
        aria-current={pathname === '/play' ? 'page' : undefined}
        className={`mt-auto self-center p-1 hover:no-underline ${
          pathname === '/play' ? 'opacity-100' : 'opacity-60 hover:opacity-100'
        }`}
      >
        <svg width="12" height="8" viewBox="0 0 3 2" aria-hidden className="block">
          {/* T piece as one smooth shape */}
          <path d="M1 0h1v1h1v1H0V1h1z" fill="white" />
        </svg>
      </Link>
    </div>
  );
}
