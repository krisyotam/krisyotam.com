'use client';

import katex from 'katex';
import 'katex/dist/katex.min.css';

interface MathProps {
  type?: 'inline' | 'block';
  tex?: string;
  children?: React.ReactNode;
}

export function Math({ type = 'inline', tex, children }: MathProps) {
  // Get the LaTeX string from either tex prop or children
  const latex = tex || (typeof children === 'string' ? children : '');

  if (!latex) return null;

  const html = katex.renderToString(latex, {
    throwOnError: false,
    displayMode: type === 'block',
  });

  if (type === 'block') {
    return (
      <div
        className="my-4 overflow-x-auto text-center"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <span
      className="math-inline"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
