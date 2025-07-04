"use client";

import { MDXRemote } from "next-mdx-remote";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";

const components = {
  // Add components here if needed
};

export default function MdxRenderer({ source }: { source: MDXRemoteSerializeResult }) {
  return (
    <article className="prose dark:prose-invert max-w-none">
      <MDXRemote
        {...source}
        components={components}
      />
    </article>
  );
}
