// Reads the content files in /public at build time.
// Edit the XML/JSON files to change the website; no code changes needed.
import 'server-only';
import fs from 'node:fs';
import path from 'node:path';
import { XMLParser } from 'fast-xml-parser';

const LIST_TAGS = new Set(['entry', 'author', 'link', 'event', 'subject', 'thesis']);

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '',
  removeNSPrefix: true, // <arxiv:doi> -> doi
  parseTagValue: false, // keep everything as strings
  isArray: (tag) => LIST_TAGS.has(tag),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Node = any;

function readPublic(file: string): string {
  return fs.readFileSync(path.join(process.cwd(), 'public', file), 'utf8');
}

/** Text content of a node, with whitespace collapsed. Empty values become undefined. */
function text(node: Node): string | undefined {
  const value = typeof node === 'object' && node !== null ? node['#text'] : node;
  const clean = value?.toString().replace(/\s+/g, ' ').trim();
  return clean || undefined;
}

const https = (url = '') => url.replace(/^http:\/\//, 'https://');

// ---------- Papers (public/papers.xml, kept up to date by the arXiv bot) ----------

export interface Author {
  name: string;
  url?: string;
}

export interface Paper {
  id: string;
  title: string;
  summary: string;
  authors: Author[];
  arxivUrl: string;
  pdfUrl: string;
  doi?: string;
  journalRef?: string;
}

const isMe = (name: string) => /Mart[ií]nez[- ]Mu[ñn]oz/i.test(name);

export function getPapers(): Paper[] {
  const coauthorUrls: Record<string, string> = JSON.parse(readPublic('coauthors.json'));
  const feed = parser.parse(readPublic('papers.xml')).feed;

  return (feed.entry ?? []).map((entry: Node) => {
    const links: Node[] = entry.link ?? [];
    return {
      id: text(entry.id)!,
      title: text(entry.title) ?? 'Untitled',
      summary: text(entry.summary) ?? '',
      authors: (entry.author ?? []).map((a: Node) => {
        const name = text(a.name)!;
        return { name, url: coauthorUrls[name] };
      }),
      arxivUrl: https(links.find((l) => l.rel === 'alternate')?.href),
      pdfUrl: https(links.find((l) => l.title === 'pdf')?.href),
      doi: text(entry.doi),
      journalRef: text(entry.journal_ref),
    };
  });
}

/** Everyone I have written a paper with, alphabetically. */
export function getCoauthors(papers: Paper[]): Author[] {
  const byName = new Map<string, Author>();
  for (const author of papers.flatMap((p) => p.authors)) {
    if (!isMe(author.name)) byName.set(author.name, author);
  }
  return [...byName.values()].sort((a, b) => a.name.localeCompare(b.name));
}

// ---------- Conferences (public/conferences.xml) ----------

export interface AcademicEvent {
  title: string;
  location: string;
  date?: string;
  description?: string;
  website?: string;
  poster?: string;
  slides?: string;
  notes?: string;
  youtube?: string;
  /** "organization" = local seminars & workshops */
  category?: string;
}

export function getEvents(): AcademicEvent[] {
  const events: Node[] = parser.parse(readPublic('conferences.xml')).conferences.event ?? [];
  return events.map((e) => ({
    title: text(e.title) ?? '',
    location: text(e.location) ?? '',
    date: text(e.date),
    description: text(e.description),
    website: text(e.website),
    poster: text(e.poster),
    slides: text(e.slides),
    notes: text(e.notes),
    youtube: text(e.youtube),
    category: text(e.category),
  }));
}

// ---------- Teaching (public/teaching.xml) ----------

export interface Subject {
  title: string;
  year: string;
  description: string;
}

export interface Thesis {
  title: string;
  type: string;
  student?: string;
  codirector?: string;
  startDate: string;
  endDate: string;
  program: string;
}

export function getTeaching(): { subjects: Subject[]; theses: Thesis[] } {
  const data = parser.parse(readPublic('teaching.xml')).teaching;
  return {
    subjects: (data.subject ?? []).map((s: Node) => ({
      title: text(s.title) ?? '',
      year: text(s.year) ?? '',
      description: text(s.description) ?? '',
    })),
    theses: (data.thesis ?? []).map((t: Node) => ({
      title: text(t.title) ?? '',
      type: text(t.type) ?? 'Thesis',
      student: text(t.student),
      codirector: text(t.codirector),
      startDate: text(t.startDate) ?? '',
      endDate: text(t.endDate) ?? '',
      program: text(t.program) ?? '',
    })),
  };
}

// ---------- Photo carousel (public/carousel.json) ----------

export interface CarouselImage {
  src: string;
  alt: string;
  caption?: string;
}

export function getCarousel(): CarouselImage[] {
  return JSON.parse(readPublic('carousel.json'));
}
