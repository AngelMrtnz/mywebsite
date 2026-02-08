// components/Sidebar.tsx
'use client'; 

import Link from 'next/link';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { 
  SiInstagram, 
  SiOrcid, 
  SiResearchgate, 
  SiGooglescholar, 
  SiArxiv 
} from 'react-icons/si';

const navLinks = [
  { name: 'About Me', href: '/' },
  { name: 'Research', href: '/research' },
  { name: 'Conferences', href: '/conferences' },
  { name: 'Teaching', href: '/teaching' },
];

const socialLinks = [
    { name: 'Instagram', href: 'https://www.instagram.com/angelmm__/', icon: SiInstagram },
    { name: 'ORCID', href: 'https://orcid.org/my-orcid?orcid=0009-0002-8944-5403', icon: SiOrcid },
    { name: 'ResearchGate', href: 'https://www.researchgate.net/profile/Angel-Martinez-Munoz?ev=hdr_xprf', icon: SiResearchgate },
    { name: 'Google Scholar', href: 'https://scholar.google.com/citations?user=rC-onNMAAAAJ&hl=es', icon: SiGooglescholar },
    { name: 'arXiv', href: 'https://arxiv.org/a/martinezmunoz_a_1.html', icon: SiArxiv },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
      className="bg-urv-red text-white w-64 p-6 flex flex-col h-screen fixed shadow-2xl"
    >
      <div className="text-center mb-10">
        <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}>
          <Image
            src="/images/yo.jpg"
            alt="Ángel Martínez Muñoz"
            width={128}
            height={128}
            className="rounded-full mx-auto border-4 border-white shadow-lg"
          />
        </motion.div>
        <h1 className="text-2xl font-bold mt-4">Ángel<br/>Martínez Muñoz</h1>
        <a href="mailto:angel.martinezm@urv.cat" className="flex items-center justify-center gap-2 text-sm mt-4 text-white no-underline transition-opacity hover:opacity-75">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
          <span>angel.martinezm@urv.cat</span>
        </a>
      </div>

      <nav className="flex-grow sidebar-nav">
        <ul>
          {navLinks.map((link) => (
            <li key={link.href} className="mb-4">
              <Link href={link.href} className="no-underline">
                <motion.div
                  whileHover={{ x: 5 }}
                  className={`px-4 py-2 rounded-lg transition-colors duration-200 no-underline ${
                    pathname === link.href ? 'bg-comp-red text-white font-bold' : 'text-white hover:bg-comp-dark-red'
                  }`}
                >
                  {link.name}
                </motion.div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="text-center">
        <div className="flex justify-center gap-4">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="text-white transition-opacity hover:opacity-75"
                >
                  <Icon size={28} />
                </motion.a>
              );
            })}
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;