// app/page.tsx
'use client';

import { motion } from 'framer-motion';
import { getPublicPath } from '@/lib/paths';
import { 
  SiInstagram, 
  SiOrcid, 
  SiResearchgate, 
  SiGooglescholar, 
  SiArxiv
} from 'react-icons/si';
import { MdEmail } from 'react-icons/md';

const pageVariants = {
  initial: { opacity: 0 },
  in: { opacity: 1 },
  out: { opacity: 0 },
};

const pageTransition = {
  duration: 0.3,
};

const socialLinks = [
    { name: 'Email', href: 'mailto:angel.martinezm@urv.cat', icon: MdEmail },
    { name: 'ORCID', href: 'https://orcid.org/my-orcid?orcid=0009-0002-8944-5403', icon: SiOrcid },
    { name: 'Google Scholar', href: 'https://scholar.google.com/citations?user=rC-onNMAAAAJ&hl=es', icon: SiGooglescholar },
    { name: 'arXiv', href: 'https://arxiv.org/a/martinezmunoz_a_1.html', icon: SiArxiv },
    { name: 'ResearchGate', href: 'https://www.researchgate.net/profile/Angel-Martinez-Munoz?ev=hdr_xprf', icon: SiResearchgate },
    { name: 'Instagram', href: 'https://www.instagram.com/angelmm__/', icon: SiInstagram },
];

export default function Home() {
  return (
    <motion.div
      initial={false}
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <section className="mb-12">
        <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
           {/* Profile Photo - Circle Style */}
           <div className="flex-shrink-0">
             <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-white shadow-xl">
               <img
                 src="images/yo.jpg"
                 alt="Ángel Martínez Muñoz"
                 className="w-full h-full object-cover"
               />
             </div>
           </div>
           
           {/* Title and Intro */}
           <div className="text-center md:text-left">
             <h1 className="text-5xl font-bold text-urv-red mb-4">About me</h1>
           </div>
        </div>
        
        <div className="text-xl text-urv-black text-justify space-y-6">
          <p>
            I am a PhD student in Mathematics at the{' '}
            <a href="https://www.urv.cat/ca/" target="_blank" rel="noopener noreferrer" className="text-urv-red hover:underline">
              Universitat Rovira i Virgili
            </a>
            , Tarragona, Spain, supported by the Martí i Franqués grant (2025PMF-PIPF-14). My primary research interests lie in differential geometry, with a focus on its applications to mathematical physics.
          </p>
          <p>
            Currently, I am working on my PhD thesis on singular Lagrangian systems and the different geometrical structures that arise in this context, under the supervision of Professors{' '}
            <a href="https://web.mat.upc.edu/xavier.gracia/" target="_blank" rel="noopener noreferrer" className="text-urv-red hover:underline">
              Xavier Gràcia Sabaté
            </a>{' '}
            and{' '}
            <a href="https://xrivas.com/" target="_blank" rel="noopener noreferrer" className="text-urv-red hover:underline">
              Xavier Rivas Guijarro
            </a>.
          </p>
          <p>
            I completed my Degree in Mathematics (2020–2024) at the Universitat Politècnica de Catalunya (UPC). I wrote my bachelor&apos;s thesis on geometric integrators (see{' '}
            <a href={getPublicPath('/theses/bachelor-thesis.pdf')} target="_blank" rel="noopener noreferrer" className="text-urv-red hover:underline">
              here
            </a>
            ). I then obtained a master&apos;s degree in Advanced Mathematics and Mathematical Engineering (2025) from the same institution. I wrote my master&apos;s thesis on contact geometry and singular Lagrangian systems (see{' '}
            <a href={getPublicPath('/theses/master-thesis.pdf')} target="_blank" rel="noopener noreferrer" className="text-urv-red hover:underline">
              here
            </a>
            ).
          </p>
        </div>

        {/* Explicit Links Section */}
        <div className="pt-10">
          <h3 className="text-xl font-bold text-urv-red mb-6">Some useful links</h3>
          
          <div className="space-y-4">
            {/* Prominent Email Card */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 flex items-center gap-4">
              <div className="p-3 bg-white rounded-full text-urv-red shadow-sm">
                <MdEmail size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Email</p>
                <a href="mailto:angel.martinezm@urv.cat" className="text-lg font-bold text-urv-black hover:text-urv-red transition-colors">
                  angel.martinezm@urv.cat
                </a>
              </div>
            </div>

            {/* Other Links Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {socialLinks.filter(l => l.name !== 'Email').map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors group border border-gray-100"
                  >
                    <span className={`text-urv-red group-hover:scale-110 transition-transform ${social.name === 'ResearchGate' ? '-translate-y-[1px]' : ''}`}>
                      <Icon size={20} />
                    </span>
                    <span className="text-sm font-medium text-urv-black group-hover:text-urv-red">
                      {social.name}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}