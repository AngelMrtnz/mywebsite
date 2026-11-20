import { FaFilePdf } from 'react-icons/fa';
import { SiArxiv, SiDoi } from 'react-icons/si';
import type { Paper } from '@/lib/data';
import { renderLatex } from '@/lib/latex';
import { asset } from '@/lib/paths';
import IconLink from './IconLink';

export default function PaperEntry({ paper, number }: { paper: Paper; number: number }) {
  const doiUrl = paper.doi && `https://doi.org/${paper.doi}`;

  return (
    <article className="p-4 md:p-6 border border-gray-200 rounded-lg bg-white">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div className="flex-grow min-w-0">
          <h3 className="text-lg md:text-xl font-bold break-words">
            <span className="mr-3">[{number}]</span>
            {paper.title}
          </h3>
          <p className="mt-2 text-sm md:text-base leading-relaxed">
            {paper.authors.map((a) => a.name).join(', ')}
          </p>
          {(paper.journalRef || doiUrl) && (
            <p className="mt-1 text-sm md:text-base italic flex flex-wrap gap-x-8">
              {paper.journalRef && <span>{paper.journalRef}</span>}
              {doiUrl && (
                <span>
                  DOI:{' '}
                  <a href={doiUrl} target="_blank" rel="noopener noreferrer">
                    {paper.doi}
                  </a>
                </span>
              )}
            </p>
          )}
          <span
            className={`inline-block mt-3 text-xs font-semibold px-2 py-1 rounded-full ${
              paper.doi ? 'bg-comp-light-gray' : 'bg-comp-yellow'
            }`}
          >
            {paper.doi ? 'Published' : 'Preprint'}
          </span>
        </div>

        <div className="flex items-center gap-6 md:gap-4 text-2xl">
          {doiUrl && <IconLink href={doiUrl} label="View DOI" icon={SiDoi} />}
          {paper.arxivUrl && <IconLink href={paper.arxivUrl} label="View on arXiv" icon={SiArxiv} />}
          {paper.pdfUrl && <IconLink href={asset(paper.pdfUrl)} label="Download PDF" icon={FaFilePdf} />}
        </div>
      </div>

      {paper.summary && (
        <details className="group mt-4">
          <summary className="cursor-pointer list-none text-sm font-bold hover:underline">
            <span className="group-open:hidden">Read abstract</span>
            <span className="hidden group-open:inline">Hide abstract</span>
          </summary>
          <div
            className="mt-4 pt-4 border-t border-gray-200 text-justify"
            // Safe: renderLatex escapes everything that isn't KaTeX output
            dangerouslySetInnerHTML={{ __html: renderLatex(paper.summary) }}
          />
        </details>
      )}
    </article>
  );
}
