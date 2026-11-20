import type { Metadata } from 'next';
import { getTeaching } from '@/lib/data';

export const metadata: Metadata = { title: 'Teaching' };

const card = 'p-4 sm:p-6 border border-gray-100 bg-white shadow-sm rounded-lg';

export default function Teaching() {
  const { subjects, theses } = getTeaching();

  return (
    <>
      <h1 className="text-3xl sm:text-4xl font-bold text-urv-red mb-6">University courses</h1>

      <div className="space-y-8">
        {subjects.map((subject) => (
          <div key={subject.title + subject.year} className={card}>
            <h2 className="text-2xl font-bold mb-3">{subject.title}</h2>
            <p className="mb-2 text-sm">
              <span className="font-bold">Year:</span> {subject.year}
            </p>
            <p className="text-sm">{subject.description}</p>
          </div>
        ))}
      </div>

      {theses.length > 0 && (
        <section className="mt-12">
          <h2 className="text-3xl font-bold text-urv-red mb-6 border-b border-gray-200 pb-2">
            Student supervision
          </h2>
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
