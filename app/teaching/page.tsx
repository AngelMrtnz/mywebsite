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

interface Thesis {
  title: string;
  type: string;
  student?: string;
  codirector?: string;
  startDate: string;
  endDate: string;
  department: string;
  program: string;
}

export default function Teaching() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [theses, setTheses] = useState<Thesis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(getPublicPath('/teaching.xml') + '?v=' + new Date().getTime())
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

        const parsedTheses: Thesis[] = Array.from(xml.querySelectorAll("thesis")).map(thesisEl => {
          const title = thesisEl.querySelector("title")?.textContent || 'Untitled Thesis';
          const type = thesisEl.querySelector("type")?.textContent || 'Thesis';
          const student = thesisEl.querySelector("student")?.textContent || undefined;
          const codirector = thesisEl.querySelector("codirector")?.textContent || undefined;
          const startDate = thesisEl.querySelector("startDate")?.textContent || '';
          const endDate = thesisEl.querySelector("endDate")?.textContent || '';
          const department = thesisEl.querySelector("department")?.textContent || '';
          const program = thesisEl.querySelector("program")?.textContent || '';
          return { title, type, student, codirector, startDate, endDate, department, program };
        });

        setSubjects(parsedSubjects);
        setTheses(parsedTheses);
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
        <div className="space-y-12">
          <div className="space-y-8">
            {subjects.map((subject, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 border border-gray-100 bg-white shadow-sm rounded-lg"
              >
                <h2 className="text-2xl font-bold text-urv-black mb-3">{subject.title}</h2>
                <p className="text-urv-black mb-2 text-sm">
                  <span className="font-bold">Year:</span> {subject.year}
                </p>
                <p className="text-urv-black text-sm">{subject.description}</p>
              </motion.div>
            ))}
          </div>

          {theses.length > 0 && (
            <section>
              <h2 className="text-3xl font-bold text-urv-red mb-6 border-b border-gray-200 pb-2">
                Directed Final Study Projects
              </h2>
              <div className="space-y-6">
                {theses.map((thesis, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 border border-gray-100 bg-white shadow-sm rounded-lg"
                  >
                    <h3 className="text-xl font-bold text-urv-black mb-2">{thesis.title}</h3>
                    <div className="space-y-2 text-sm text-urv-black">
                      {thesis.student && <p><span className="font-bold">Student:</span> {thesis.student}</p>}
                      <p><span className="font-bold">Type:</span> {thesis.type} {thesis.codirector && `(Co-directed with ${thesis.codirector})`}</p>
                      <p><span className="font-bold">Program:</span> {thesis.program}</p>
                      <p><span className="font-bold">Department:</span> {thesis.department}</p>
                      <p><span className="font-bold">Duration:</span> {thesis.startDate} - {thesis.endDate}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </motion.div>
  );
}
