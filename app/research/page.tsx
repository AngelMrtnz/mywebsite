// app/research/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PaperEntry, { Paper } from '@/components/PaperEntry'; // Import new component and interface

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5,
};

export default function Research() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/papers.xml')
      .then(response => response.text())
      .then(str => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(str, "text/xml");
        const paperElements = Array.from(xml.querySelectorAll("entry"));
        
        const parsedPapers = paperElements.map(paperEl => {
          const title = paperEl.querySelector("title")?.textContent || 'No title';
          const summary = paperEl.querySelector("summary")?.textContent || 'No summary';
          const authors = Array.from(paperEl.querySelectorAll("author > name")).map(nameEl => nameEl.textContent || '');
          const doi = paperEl.getElementsByTagNameNS('http://arxiv.org/schemas/atom', 'doi')[0]?.textContent || undefined;


          let arxivLink = '';
          let pdfLink = '';
          
          paperEl.querySelectorAll("link").forEach(link => {
            if (link.getAttribute('rel') === 'alternate') {
              arxivLink = link.getAttribute('href') || '';
            }
            if (link.getAttribute('title') === 'pdf') {
              pdfLink = link.getAttribute('href') || '';
            }
          });

          return { title, summary, authors, arxivLink, pdfLink, doi };
        });

        setPapers(parsedPapers);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching or parsing papers.xml:", error);
        setLoading(false);
      });
  }, []);

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <h1 className="text-4xl font-bold text-urv-red mb-6">List of Publications</h1>
      
      {loading ? (
        <p>Loading papers...</p>
      ) : (
        <div className="space-y-8">
          {papers.map((paper, index) => (
            <PaperEntry 
              key={index}
              paper={paper}
              number={papers.length - index} // Inverse numbering
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
