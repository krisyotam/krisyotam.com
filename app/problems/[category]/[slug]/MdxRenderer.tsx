"use client";

import { MDXRemote } from "next-mdx-remote";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { useMDXComponents } from "@/mdx-components";
import "katex/dist/katex.min.css";

interface MdxRendererProps {
  content: string;
}

export default function MdxRenderer({ content }: MdxRendererProps) {
  // Get MDX components defined in root mdx-components.tsx
  const components = useMDXComponents({});
  
  return (
    <div className="problem-content">
      <MDXRemote 
        {...content as any} // Using type assertion to resolve the type issue
        components={components}
      />
    </div>
  );
}