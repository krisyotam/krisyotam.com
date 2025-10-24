import katex from 'katex';

/**
 * Preprocesses markdown string by rendering KaTeX expressions first
 * before passing to the markdown parser
 */
export function preprocessKaTeX(content: string): string {
  let processed = content;

  // Process display math with \[...\] delimiters
  processed = processed.replace(/\\\[([\s\S]*?)\\\]/g, (match, mathContent) => {
    try {
      const rendered = katex.renderToString(mathContent.trim(), {
        displayMode: true,
        throwOnError: false,
        errorColor: '#cc0000',
        strict: false
      });
      return `<div class="katex-display">${rendered}</div>`;
    } catch (error) {
      console.warn('KaTeX display math error:', error);
      return match; // Return original if error
    }
  });

  // Process display math with $$...$$ delimiters
  processed = processed.replace(/\$\$([\s\S]*?)\$\$/g, (match, mathContent) => {
    try {
      const rendered = katex.renderToString(mathContent.trim(), {
        displayMode: true,
        throwOnError: false,
        errorColor: '#cc0000',
        strict: false
      });
      return `<div class="katex-display">${rendered}</div>`;
    } catch (error) {
      console.warn('KaTeX display math error:', error);
      return match; // Return original if error
    }
  });

  // Process inline math with \(...\) delimiters
  processed = processed.replace(/\\\(([\s\S]*?)\\\)/g, (match, mathContent) => {
    try {
      const rendered = katex.renderToString(mathContent.trim(), {
        displayMode: false,
        throwOnError: false,
        errorColor: '#cc0000',
        strict: false
      });
      return `<span class="katex-inline">${rendered}</span>`;
    } catch (error) {
      console.warn('KaTeX inline math error:', error);
      return match; // Return original if error
    }
  });

  // Process inline math with $...$ delimiters (be careful not to match $$)
  processed = processed.replace(/(?<!\$)\$(?!\$)([\s\S]*?)(?<!\$)\$(?!\$)/g, (match, mathContent) => {
    try {
      const rendered = katex.renderToString(mathContent.trim(), {
        displayMode: false,
        throwOnError: false,
        errorColor: '#cc0000',
        strict: false
      });
      return `<span class="katex-inline">${rendered}</span>`;
    } catch (error) {
      console.warn('KaTeX inline math error:', error);
      return match; // Return original if error
    }
  });

  return processed;
}
