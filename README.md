# mywebsite

My academic website, live at <https://angelmrtnz.github.io/mywebsite/>.

Built with Next.js and Tailwind CSS and exported as a static site. Every push to `main` is deployed to GitHub Pages automatically.

## Editing the content

Most of the content lives in plain files in `public/`. Change the file, push, and the site rebuilds itself.

| What | File |
| --- | --- |
| Papers | `public/papers.xml`: filled in by a bot from arXiv every Sunday. You can add `<arxiv:journal_ref>`, `<arxiv:doi>` or a local PDF link to an entry by hand, and the bot keeps them. |
| Coauthor homepages | `public/coauthors.json` |
| Conferences and talks | `public/conferences.xml`: use `<category>organization</category>` for local seminars |
| Teaching and supervision | `public/teaching.xml` |
| Photo carousel | `public/carousel.json` plus the photos in `public/carousel/` |
| PDFs (slides, posters, theses) | `public/notes/`, `public/posters/`, `public/theses/`, `public/papers/` |
| "About me" text and links | `app/page.tsx` |

Paths to files in `public/` start with `/`, for example `<poster>/posters/my-poster.pdf</poster>`.

## Running it locally

You need [Node.js](https://nodejs.org) 20 or newer.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in out/
npm run lint
npm run update-papers   # fetch arXiv now instead of waiting for Sunday
```

## How it fits together

- `app/`: one folder per page. The pages read the files in `public/` while the site builds, so visitors get finished HTML.
- `components/`: the sidebar, layout, paper cards, photo carousel and animated torus favicon.
- `lib/data.ts`: reads and parses the XML/JSON content files.
- `lib/latex.ts`: renders the `$…$` math in abstracts at build time.
- `.github/workflows/`: `deploy.yml` publishes the site and `bot_fetch.yml` updates the papers.
