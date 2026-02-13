// app/conferences/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getPublicPath } from '@/lib/paths';
import { FaGlobe, FaFilePdf } from 'react-icons/fa';
import Carousel from '@/components/Carousel';

const pageVariants = {
  initial: { opacity: 0 },
  in: { opacity: 1 },
  out: { opacity: 0 },
};

const pageTransition = {
  duration: 0.3,
};

interface ConferenceEvent {
  title: string;
  location: string;
  date: string;
  description?: string;
  website?: string;
  poster?: string;
  category?: string;
}

export default function Conferences() {
  const [events, setEvents] = useState<ConferenceEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetch(getPublicPath('/conferences.xml'))
      .then(res => res.text())
      .then(xmlStr => {
        if (!isMounted) return;
        const parser = new DOMParser();
        const doc = parser.parseFromString(xmlStr, "text/xml");
        const parsedEvents = Array.from(doc.querySelectorAll("event")).map(event => ({
          title: event.querySelector("title")?.textContent || '',
          location: event.querySelector("location")?.textContent || '',
          date: event.querySelector("date")?.textContent || '',
          description: event.querySelector("description")?.textContent || undefined,
          website: event.querySelector("website")?.textContent || undefined,
          poster: event.querySelector("poster")?.textContent || undefined,
          category: event.querySelector("category")?.textContent || undefined,
        }));
        setEvents(parsedEvents);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading conferences:", err);
        setLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  const organizedEvents = events.filter(e => e.category === 'organization');
  const conferenceEvents = events.filter(e => e.category !== 'organization');

  return (
    <motion.div
      initial={false}
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <h1 className="text-4xl font-bold text-urv-red mb-6">Conferences & Academic Events</h1>
      
      {loading ? (
        <div className="animate-pulse space-y-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-gray-50 rounded-lg"></div>
          ))}
        </div>
      ) : (
        <div className="space-y-12">
          {/* Regular Conferences Section */}
          <section>
            <h2 className="text-2xl font-bold text-urv-black mb-6 border-b border-gray-200 pb-2">
              Attended Conferences & Schools
            </h2>
            <div className="space-y-6">
              {conferenceEvents.map((event, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-6 border border-gray-100 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-grow">
                      <h2 className="text-xl font-bold text-urv-black mb-1">{event.title}</h2>
                      <div className="flex items-center gap-2 mb-2">
                        <p className="text-urv-red font-medium text-sm">{event.location}</p>
                      </div>
                      {event.description && (
                        <p className="text-urv-black text-sm mt-2 inline-flex items-center gap-2">
                          {event.description}
                          {event.poster && (
                            <a 
                              href={`${import.meta.env.BASE_URL}${event.poster.startsWith('/') ? event.poster.slice(1) : event.poster}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-urv-red hover:text-comp-red transition-colors"
                              title="View Poster"
                            >
                              <FaFilePdf />
                            </a>
                          )}
                        </p>
                      )}
                    </div>
                    {event.date && (
                      <div className="text-right">
                        <span className="text-sm font-bold bg-urv-red text-white px-3 py-1 rounded-full whitespace-nowrap">
                          {event.date}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Local Seminars Section (Formerly Organized Events) */}
          {organizedEvents.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-urv-black mb-6 border-b border-gray-200 pb-2">
                Local Seminars & Workshops
              </h2>
              <div className="space-y-6">
                {organizedEvents.map((event, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-6 border border-gray-100 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-grow">
                        <h2 className="text-xl font-bold text-urv-black mb-1">{event.title}</h2>
                        <div className="flex items-center gap-2 mb-2">
                          <p className="text-urv-red font-medium text-sm">{event.location}</p>
                          {event.website && (
                            <a 
                              href={event.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-urv-red hover:text-comp-red transition-colors"
                              title="Visit Website"
                            >
                              <FaGlobe size={14} />
                            </a>
                          )}
                        </div>
                        {event.description && (
                          <p className="text-urv-black text-sm mt-2 inline-flex items-center gap-2">
                            {event.description}
                          </p>
                        )}
                      </div>
                      {event.date && (
                        <div className="text-right">
                          <span className="text-sm font-bold bg-urv-red text-white px-3 py-1 rounded-full whitespace-nowrap">
                            {event.date}
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* Carousel at the bottom */}
      <div className="mt-16 mb-10">
        <Carousel />
      </div>
    </motion.div>
  );
}
