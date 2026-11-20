import 'katex/dist/katex.min.css';
import { PageTitle, SectionTitle } from '@/components/Headings';
import PaperEntry from '@/components/PaperEntry';
import { getCoauthors, getPapers } from '@/lib/data';

export default function Research() {
  const papers = getPapers();
  const coauthors = getCoauthors(papers);

  return (
    <>
      <PageTitle>Research</PageTitle>

      <SectionTitle>List of publications</SectionTitle>

      <div className="space-y-8">
        {papers.map((paper, i) => (
          // Newest paper gets the highest number
          <PaperEntry key={paper.id} paper={paper} number={papers.length - i} />
        ))}
      </div>

      {coauthors.length > 0 && (
        <section className="mt-16">
          <SectionTitle>Coauthors</SectionTitle>
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
