import 'server-only';
import katex from 'katex';

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * Turns text with $inline$ and $$display$$ math into safe HTML.
 * Runs at build time, so visitors never download KaTeX's JavaScript.
 * Everything outside the math is escaped, so stray HTML in the arXiv feed can't run.
 */
export function renderLatex(text: string): string {
  let html = '';
  let last = 0;
  for (const match of text.matchAll(/\$\$([\s\S]+?)\$\$|\$([^$]+?)\$/g)) {
    html += escapeHtml(text.slice(last, match.index));
    const display = match[1] !== undefined;
    html += katex.renderToString(display ? match[1] : match[2], {
      displayMode: display,
      throwOnError: false,
    });
    last = match.index + match[0].length;
  }
  return html + escapeHtml(text.slice(last));
}
