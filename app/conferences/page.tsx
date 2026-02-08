// app/conferences/page.tsx
'use client';

import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const pageTransition = {
  duration: 0.5,
};

export default function Conferences() {
  return (
    <motion.div
      initial="initial"
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
