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
    <div className="bg-urv-red text-white w-64 h-full p-6 pt-16 flex flex-col shadow-2xl overflow-y-auto">
      <div className="text-center mb-8">
        <p className="text-2xl font-bold tracking-wide">
          Ángel
          <br />
          Martínez Muñoz
        </p>
        <a
          href={`mailto:${EMAIL}`}
          className="flex items-center justify-center gap-2 text-xs mt-3 text-white/80 hover:text-white hover:no-underline transition-colors"
        >
          <MdEmail size={14} />
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
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 hover:no-underline ${
                    active
                      ? 'bg-white text-urv-red font-bold shadow-md translate-x-1'
                      : 'text-white hover:bg-white/10 hover:translate-x-1'
                  }`}
                >
                  <Icon size={18} />
                  {name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
