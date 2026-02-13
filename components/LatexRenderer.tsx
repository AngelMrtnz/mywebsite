// components/LatexRenderer.tsx
'use client';

import React from 'react';
import katex from 'katex';
import parse from 'html-react-parser';

interface LatexRendererProps {
  text: string;
}

const LatexRenderer = ({ text }: LatexRendererProps) => {
  try {
    // First, handle display math ($$ ... $$)
    // We use a regex that matches $$ ... $$ and handles multiline content
    let renderedContent = text.replace(/\$\$([\s\S]*?)\$\$/g, (match, formula) => {
      try {
        return katex.renderToString(formula, {
          displayMode: true,
          throwOnError: false,
        });
      } catch (e) {
        console.error("KaTeX display error:", e);
        return match;
      }
    });

    // Then, handle inline math ($ ... $)
    // We use a regex that matches $ ... $ but not $$
    renderedContent = renderedContent.replace(/\$((?!\$).*?)\$/g, (match, formula) => {
      try {
        return katex.renderToString(formula, {
          displayMode: false,
          throwOnError: false,
        });
      } catch (e) {
        console.error("KaTeX inline error:", e);
        return match;
      }
    });

    return <>{parse(renderedContent)}</>;
  } catch (error) {
    console.error("Error parsing LaTeX:", error);
    return <div>{text}</div>;
  }
};

export default LatexRenderer;