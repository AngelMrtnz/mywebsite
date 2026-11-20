import type { Metadata } from 'next';
import { PageTitle, SectionTitle } from '@/components/Headings';
import { getTeaching } from '@/lib/data';

export const metadata: Metadata = { title: 'Teaching' };

const card = 'p-4 sm:p-6 border border-gray-100 bg-white shadow-sm rounded-lg';

export default function Teaching() {
  const { subjects, theses } = getTeaching();

  return (
    <>
      <PageTitle>Teaching</PageTitle>

      <SectionTitle>University courses</SectionTitle>

      <div className="space-y-8">
        {subjects.map((subject) => (
          <div key={subject.title + subject.year} className={card}>
            <h3 className="text-xl font-bold mb-3">{subject.title}</h3>
            <p className="mb-2 text-sm">
              <span className="font-bold">Year:</span> {subject.year}
            </p>
            <p className="text-sm">{subject.description}</p>
          </div>
        ))}
      </div>

      {theses.length > 0 && (
        <section className="mt-12">
          <SectionTitle>Student supervision</SectionTitle>
          <div className="space-y-6">
            {theses.map((thesis) => (
              <div key={thesis.title} className={card}>
                <h3 className="text-xl font-bold mb-2">{thesis.title}</h3>
                <div className="space-y-2 text-sm">
                  {thesis.student && (
                    <p>
                      <span className="font-bold">Student:</span> {thesis.student}
                    </p>
                  )}
                  <p>
                    <span className="font-bold">Type:</span> {thesis.type}
                    {thesis.codirector && ` (Co-directed with ${thesis.codirector})`}
                  </p>
                  <p>
                    <span className="font-bold">Program:</span> {thesis.program}
                  </p>
                  <p>
                    <span className="font-bold">Duration:</span> {thesis.startDate} – {thesis.endDate}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
