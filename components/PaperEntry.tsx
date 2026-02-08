// components/PaperEntry.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BlockMath } from 'react-katex';
import { FaFilePdf } from 'react-icons/fa';
import { SiArxiv, SiDoi } from 'react-icons/si';

// Define the shape of the paper object
export interface Paper {
  title: string;
  summary: string;
  authors: string[];
  arxivLink: string;
  pdfLink: string;
  doi?: string;
}

interface PaperEntryProps {
  paper: Paper;
  number: number;
}

const PaperEntry = ({ paper, number }: PaperEntryProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      layout
      initial={{ borderRadius: 8 }}
      className="p-6 border border-gray-200 rounded-lg"
    >
      <motion.div layout className="flex justify-between items-start gap-4">
        {/* Left side: Number and Title */}
        <div className="flex-grow">
          <h2 className="text-2xl font-bold text-urv-black">
            <span className="text-urv-black mr-3">[{number}]</span>
            {paper.title}
          </h2>
          <p className="mt-2 text-md italic text-urv-black">
            {paper.authors.join(', ')}
          </p>
          <div className="mt-3 flex items-center gap-4">
            <span className="text-xs font-semibold bg-comp-yellow text-urv-black px-2 py-1 rounded-full">
              Preprint
            </span>
            {paper.doi && (
              <a href={`https://doi.org/${paper.doi}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs font-semibold text-urv-black hover:underline">
                <SiDoi />
                <span>DOI</span>
              </a>
            )}
          </div>
        </div>

        {/* Right side: Icons */}
        <div className="flex items-center gap-4 text-2xl text-urv-black">
          <a
            href={paper.arxivLink}
            target="_blank"
            rel="noopener noreferrer"
            title="View on ArXiv"
            className="transition-colors hover:text-comp-red"
          >
            <SiArxiv />
          </a>
          <a
            href={paper.pdfLink}
            target="_blank"
            rel="noopener noreferrer"
            title="Download PDF"
            className="transition-colors hover:text-comp-red"
          >
            <FaFilePdf />
          </a>
        </div>
      </motion.div>

      {/* "Read More" button */}
      <motion.button
        layout
        onClick={() => setIsOpen(!isOpen)}
        className="mt-4 text-sm font-bold text-urv-black hover:underline"
      >
        {isOpen ? 'Read Less' : 'Read Abstract'}
      </motion.button>

      {/* Collapsible Abstract Section */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            layout
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-gray-200 text-justify text-urv-black">
              <BlockMath math={paper.summary} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PaperEntry;
