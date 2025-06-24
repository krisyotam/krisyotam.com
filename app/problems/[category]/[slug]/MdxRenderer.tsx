"use client";

import MarkdownRenderer from "@/components/MarkdownRenderer";

interface MdxRendererProps {
  content: string;
}

export default function MdxRenderer({ content }: MdxRendererProps) {
  return (
    <div className="problem-content">
      <MarkdownRenderer content={content} />
    </div>
  );
}