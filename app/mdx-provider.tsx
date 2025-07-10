'use client'

import { MDXProvider } from '@mdx-js/react'
import { ReactNode } from 'react'

const components = {
  h1: (props: any) => <h1 className="text-4xl font-bold mb-4" {...props} />,
  h2: (props: any) => <h2 className="text-3xl font-bold mb-3" {...props} />,
  h3: (props: any) => <h3 className="text-2xl font-bold mb-2" {...props} />,
  p: (props: any) => <p className="m-0 p-0" {...props} />,
  a: (props: any) => <a className="text-blue-600 hover:underline" {...props} />,
  ul: (props: any) => <ul className="list-disc ml-6 mb-4" {...props} />,
  ol: (props: any) => <ol className="list-decimal ml-6 mb-4" {...props} />,
  li: (props: any) => <li className="mb-1" {...props} />,
  blockquote: (props: any) => (
    <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4" {...props} />
  ),
  code: (props: any) => (
    <code className="bg-gray-100 rounded px-1 py-0.5" {...props} />
  ),
  pre: (props: any) => {
    // Check if this is a code block with language
    const child = props.children;
    if (child && typeof child === 'object' && child.props && child.props.className && child.props.className.startsWith('language-')) {
      // Extract language (e.g., from "language-javascript" to "javascript")
      let language = child.props.className.replace('language-', '');
      
      // Extract filename if present in format ```lang(filename.ext)
      let filename = null;
      const filenameMatch = language.match(/^(.+?)\((.+?)\)$/);
      if (filenameMatch) {
        language = filenameMatch[1]; // Get the language part
        filename = filenameMatch[2]; // Get the filename part
      }
      
      // Use the CodeBlock component from UI with same styling as the Box component
      const { CodeBlock } = require('@/components/ui/code-block');
      return (
        <div className="code-block-wrapper">
          <CodeBlock language={language} filename={filename}>{child}</CodeBlock>
        </div>
      );
    }
    
    // Default pre rendering for non-code blocks
    return <pre className="p-6 rounded-none my-6 bg-muted/50 dark:bg-[hsl(var(--popover))] font-mono text-sm overflow-x-auto" {...props} />;
  },
}

export function MDXProviderWrapper({ children }: { children: ReactNode }) {
  return <MDXProvider components={components}>{children}</MDXProvider>
} 