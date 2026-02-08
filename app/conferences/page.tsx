// app/conferences/page.tsx
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

export default function Conferences() {
  return (
    <motion.div
      initial={false}
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <h1 className="text-4xl font-bold text-urv-red mb-6">Conferences</h1>
      <div className="p-6 border border-gray-200 rounded-lg">
        <p className="text-urv-black">
          Information about conferences and presentations will be displayed here soon.
        </p>
      </div>
    </motion.div>
  );
}
