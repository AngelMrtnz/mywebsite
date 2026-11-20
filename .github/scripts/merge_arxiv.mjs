// Downloads my arXiv feed into public/papers.xml.
// Anything added by hand to an entry (journal reference, DOI, local PDF link) is kept.
// If arXiv is down or returns something unexpected, the file is left untouched.
import fs from 'node:fs';

const FEED_URL = 'https://arxiv.org/a/martinezmunoz_a_1.atom';
const FILE = 'public/papers.xml';

const ENTRY = /<entry>[\s\S]*?<\/entry>/g;
const PDF_LINK = /<link title="pdf" href="([^"]+)" rel="related" type="application\/pdf"\/>/;
const getId = (entry) => entry.match(/<id>(.*?)<\/id>/)?.[1];

async function main() {
  const res = await fetch(FEED_URL);
  if (!res.ok) throw new Error(`arXiv answered ${res.status} ${res.statusText}`);
  const feed = await res.text();

  const newEntries = feed.match(ENTRY) ?? [];
  if (!feed.includes('<feed') || newEntries.length === 0) {
    throw new Error('arXiv feed has no entries; keeping the current papers.xml');
  }

  // What I added by hand to each paper, by arXiv id
  const local = fs.existsSync(FILE) ? fs.readFileSync(FILE, 'utf8') : '';
  const manual = {};
  for (const entry of local.match(ENTRY) ?? []) {
    manual[getId(entry)] = {
      journal: entry.match(/<arxiv:journal_ref[^>]*>.*?<\/arxiv:journal_ref>/)?.[0],
      doi: entry.match(/<arxiv:doi[^>]*>.*?<\/arxiv:doi>/)?.[0],
      pdf: entry.match(PDF_LINK)?.[1],
    };
  }

  const merged = feed.replace(ENTRY, (entry) => {
    const extra = manual[getId(entry)];
    if (!extra) return entry;
    if (extra.journal && !entry.includes('arxiv:journal_ref')) {
      entry = entry.replace('</entry>', `  ${extra.journal}\n  </entry>`);
    }
    if (extra.doi && !entry.includes('arxiv:doi')) {
      entry = entry.replace('</entry>', `  ${extra.doi}\n  </entry>`);
    }
    if (extra.pdf && !extra.pdf.includes('arxiv.org')) {
      entry = entry.replace(PDF_LINK, `<link title="pdf" href="${extra.pdf}" rel="related" type="application/pdf"/>`);
    }
    return entry;
  });

  fs.writeFileSync(FILE, merged);
  console.log(`papers.xml updated (${newEntries.length} papers)`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
