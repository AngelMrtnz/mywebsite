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
    // A simple parser to find and render only the math parts.
    // It splits the text by the '$' delimiter.
    // Even-indexed parts are text, odd-indexed are math.
    const parts = text.split('$');
    
    const renderedContent = parts.map((part, index) => {
      if (index % 2 === 1) {
        // This part is inside $, so it's math
        try {
          return katex.renderToString(part, {
            throwOnError: false,
            displayMode: false, // We assume inline math for this simple parser
          });
        } catch (e) {
          console.error(e);
          return part; // In case of error, return the original text
        }
      } else {
        // This is regular text. It's already a string, no need to do anything.
        return part;
      }
    }).join('');

    return <>{parse(renderedContent)}</>;
  } catch (error) {
      console.error("Error parsing LaTeX:", error);
      return <div>{text}</div>; // Fallback to raw text on error
  }
};

export default LatexRenderer;