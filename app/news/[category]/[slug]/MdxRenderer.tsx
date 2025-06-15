"use client";

import { MDXProvider } from "@mdx-js/react";
import { useMDXComponents } from "@/mdx-components";

interface MdxRendererProps {
  children: React.ReactNode;
}

export function MdxRenderer({ children }: MdxRendererProps) {
  const components = useMDXComponents({});
  
  return (
    <MDXProvider components={components}>
      <div className="news-content">
        {children}
      </div>
    </MDXProvider>
  );
}