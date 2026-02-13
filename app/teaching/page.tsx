// app/teaching/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getPublicPath } from '@/lib/paths';

const pageVariants = {
  initial: { opacity: 0 },
  in: { opacity: 1 },
  out: { opacity: 0 },
};

const pageTransition = {
  duration: 0.3,
};

interface Subject {
  title: string;
  year: string;
  description: string;
}

export default function Teaching() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(getPublicPath('/teaching.xml'))
      .then(response => response.text())
      .then(str => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(str, "text/xml");
        
        const parsedSubjects: Subject[] = Array.from(xml.querySelectorAll("subject")).map(subjectEl => {
          const title = subjectEl.querySelector("title")?.textContent || 'Untitled Subject';
          const year = subjectEl.querySelector("year")?.textContent || 'N/A';
          const description = subjectEl.querySelector("description")?.textContent || 'No description available.';
          return { title, year, description };
        });

        setSubjects(parsedSubjects);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching or parsing teaching.xml:", error);
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
      <h1 className="text-4xl font-bold text-urv-red mb-6">University courses</h1>
      
      {loading ? (
        <p>Loading teaching data...</p>
      ) : (
        <div className="space-y-8">
          {subjects.map((subject, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 border border-gray-200 rounded-lg"
            >
              <h2 className="text-2xl font-semibold text-urv-black mb-3">{subject.title}</h2>
              <p className="text-urv-black mb-2">
                <span className="font-semibold">Year:</span> {subject.year}
              </p>
              <p className="text-urv-black">{subject.description}</p>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
