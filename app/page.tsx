// app/page.tsx
'use client';

import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0 },
  in: { opacity: 1 },
  out: { opacity: 0 },
};

const pageTransition = {
  duration: 0.3,
  ease: 'easeOut',
};

export default function Home() {
  return (
    <motion.div
      initial={false}
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <h1 className="text-4xl font-bold text-urv-red mb-6">About me</h1>
      <div className="space-y-4 text-lg text-gray-700">
        <p>
          I am a PhD student in Mathematics at the{' '}
          <a href="https://www.urv.cat/ca/" target="_blank" rel="noopener noreferrer" className="text-urv-red hover:underline">
            Universitat Rovira i Virgili
          </a>
          , Tarragona, Spain, supported by the Martí i Franqués grant (2025PMF-PIPF-14).
        </p>
        <p>
          My primary research interests lie in differential geometry, with a focus on its applications to mathematical physics. In particular, I study singular Lagrangian systems, and the different geometrical structures that arise in this context.
        </p>
      </div>
    </motion.div>
  );
}
