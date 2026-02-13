// components/PaperEntry.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LatexRenderer from './LatexRenderer';
import { FaFilePdf } from 'react-icons/fa';
import { SiArxiv, SiDoi } from 'react-icons/si';

// Define the shape of the paper object
export interface Paper {
  title: string;
  summary: string;
  authors: { name: string; url: string | null }[];
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
      className="p-4 md:p-6 border border-gray-200 rounded-lg bg-white"
    >
      <motion.div layout className="flex flex-col md:flex-row justify-between items-start gap-4">
        {/* Left side: Number and Title */}
        <div className="flex-grow min-w-0">
          <h2 className="text-xl md:text-2xl font-bold text-urv-black break-words">
            <span className="text-urv-black mr-3">[{number}]</span>
            {paper.title}
          </h2>
          <p className="mt-2 text-sm md:text-md text-urv-black leading-relaxed">
            {paper.authors.map((author, idx) => (
              <span key={idx}>
                {author.name}
                {idx < paper.authors.length - 1 && ', '}
              </span>
            ))}
          </p>
          <div className="mt-3 flex items-center gap-4">
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${paper.doi ? 'bg-comp-light-gray text-urv-black' : 'bg-comp-yellow text-urv-black'}`}>
              {paper.doi ? 'Published' : 'Preprint'}
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
        <div className="flex items-center gap-6 md:gap-4 text-2xl text-urv-black mt-2 md:mt-0">
          <a
            href={paper.arxivLink}
            target="_blank"
            rel="noopener noreferrer"
            title="View on ArXiv"
            className="transition-colors hover:text-comp-red p-1"
          >
            <SiArxiv />
          </a>
          <a
            href={paper.pdfLink}
            target="_blank"
            rel="noopener noreferrer"
            title="Download PDF"
            className="transition-colors hover:text-comp-red p-1"
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
              <LatexRenderer text={paper.summary} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PaperEntry;
