import type { Metadata } from 'next';
import 'katex/dist/katex.min.css';
import PaperEntry from '@/components/PaperEntry';
import { getCoauthors, getPapers } from '@/lib/data';

export const metadata: Metadata = { title: 'Research' };

export default function Research() {
  const papers = getPapers();
  const coauthors = getCoauthors(papers);

  return (
    <>
      <h1 className="text-3xl sm:text-4xl font-bold text-urv-red mb-6">List of publications</h1>

      <div className="space-y-8">
        {papers.map((paper, i) => (
          // Newest paper gets the highest number
          <PaperEntry key={paper.id} paper={paper} number={papers.length - i} />
        ))}
      </div>

      {coauthors.length > 0 && (
        <section className="mt-16">
          <h2 className="text-3xl font-bold text-urv-red mb-4">Coauthors</h2>
          <ul className="list-disc list-inside">
            {coauthors.map((author) => (
              <li key={author.name}>
                {author.url ? (
                  <a href={author.url} target="_blank" rel="noopener noreferrer">
                    {author.name}
                  </a>
                ) : (
                  author.name
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
