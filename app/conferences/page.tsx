import type { Metadata } from 'next';
import { FaFilePdf, FaGlobe, FaYoutube } from 'react-icons/fa';
import Carousel from '@/components/Carousel';
import IconLink from '@/components/IconLink';
import { getCarousel, getEvents, type AcademicEvent } from '@/lib/data';
import { asset } from '@/lib/paths';

export const metadata: Metadata = { title: 'Conferences' };

function EventCard({ event }: { event: AcademicEvent }) {
  const hasDetails = event.description || event.poster || event.slides || event.notes || event.youtube;

  return (
    <div className="p-4 sm:p-6 border border-gray-100 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col-reverse sm:flex-row sm:justify-between items-start gap-2 sm:gap-4">
        <div className="flex-grow">
          <h3 className="text-xl font-bold mb-1">{event.title}</h3>
          <div className="flex items-center gap-2 mb-2 text-urv-red">
            <p className="font-medium text-sm">{event.location}</p>
            {event.website && <IconLink href={event.website} label="Event website" icon={FaGlobe} size={14} />}
          </div>
          {hasDetails && (
            <p className="text-sm mt-2 inline-flex items-center gap-2 flex-wrap">
              {event.description && <span>{event.description}</span>}
              <span className="inline-flex gap-1 text-urv-red">
                {event.poster && <IconLink href={asset(event.poster)} label="Poster" icon={FaFilePdf} />}
                {event.slides && <IconLink href={asset(event.slides)} label="Slides" icon={FaFilePdf} />}
                {event.notes && event.notes !== event.slides && (
                  <IconLink href={asset(event.notes)} label="Notes" icon={FaFilePdf} />
                )}
                {event.youtube && <IconLink href={event.youtube} label="Talk on YouTube" icon={FaYoutube} />}
              </span>
            </p>
          )}
        </div>
        {event.date && (
          <span className="text-sm font-bold bg-urv-red text-white px-3 py-1 rounded-full whitespace-nowrap">
            {event.date}
          </span>
        )}
      </div>
    </div>
  );
}

function EventList({ title, events }: { title: string; events: AcademicEvent[] }) {
  if (events.length === 0) return null;
  return (
    <section>
      <h2 className="text-2xl font-bold mb-6 border-b border-gray-200 pb-2">{title}</h2>
      <div className="space-y-6">
        {events.map((event) => (
          <EventCard key={event.title + event.date} event={event} />
        ))}
      </div>
    </section>
  );
}

export default function Conferences() {
  const events = getEvents();

  return (
    <>
      <h1 className="text-3xl sm:text-4xl font-bold text-urv-red mb-6">Conferences & Academic Events</h1>

      <div className="space-y-12">
        <EventList
          title="Attended Conferences & Schools"
          events={events.filter((e) => e.category !== 'organization')}
        />
        <EventList
          title="Local Seminars & Workshops"
          events={events.filter((e) => e.category === 'organization')}
        />
      </div>

      <div className="mt-16 mb-10">
        <Carousel images={getCarousel()} />
      </div>
    </>
  );
}
