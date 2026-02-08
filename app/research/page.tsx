// app/research/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PaperEntry, { Paper } from '@/components/PaperEntry';
import { getPublicPath } from '@/lib/paths';

const pageVariants = {
  initial: { opacity: 0 },
  in: { opacity: 1 },
  out: { opacity: 0 },
};

const pageTransition = {
  duration: 0.3,
  ease: 'easeOut',
};

export default function Research() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [coauthors, setCoauthors] = useState<{ name: string; url: string | null }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(getPublicPath('/papers.xml')).then(res => res.text()),
      fetch(getPublicPath('/coauthors.json')).then(res => res.json())
    ])
    .then(([xmlStr, coauthorsData]) => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(xmlStr, "text/xml");
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

        // Map authors to their links from coauthorsData
        const authorsWithLinks = authors.map(authorName => ({
          name: authorName,
          url: (coauthorsData as Record<string, string | null>)[authorName] || null,
        }));

        return { title, summary, authors: authorsWithLinks, arxivLink, pdfLink, doi };
      });

      // Extract unique coauthors (excluding self) for the separate list
      const allAuthorsWithLinks = parsedPapers.flatMap(p => p.authors); // Get all author objects
      const uniqueCoauthorsMap = new Map(allAuthorsWithLinks.map(a => [a.name, a]));
      const uniqueCoauthors = Array.from(uniqueCoauthorsMap.values())
        .filter(author => author.name !== 'Àngel Martínez-Muñoz' && author.name !== 'Ángel Martínez-Muñoz'); // Exclude self

      setPapers(parsedPapers);
      setCoauthors(uniqueCoauthors);
      setLoading(false);
    })
    .catch(error => {
      console.error("Error fetching data:", error);
      setLoading(false);
    });
  }, []);

  return (
    <motion.div
      initial={false}
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <h1 className="text-4xl font-bold text-urv-red mb-6">List of publications</h1>
      
      {loading ? (
        <p>Loading papers...</p>
      ) : (
        <>
          <div className="space-y-8">
            {papers.map((paper, index) => (
              <PaperEntry 
                key={index}
                paper={paper}
                number={papers.length - index} // Inverse numbering
              />
            ))}
          </div>

          {coauthors.length > 0 && (
            <div className="mt-16">
              <h2 className="text-3xl font-bold text-urv-red mb-4">Coauthors</h2>
              <ul className="list-disc list-inside">
                {coauthors.map((author, index) => (
                  <li key={index} className="text-urv-black">
                    {author.url ? (
                      <a href={author.url} target="_blank" rel="noopener noreferrer" className="text-urv-red hover:underline">
                        {author.name}
                      </a>
                    ) : (
                      <span>{author.name}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}
