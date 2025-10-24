"use client";

import { useEffect, useRef } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

interface LatexRendererProps {
  content: string;
}

export function LatexRenderer({ content }: LatexRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const paragraphs = container.querySelectorAll("p");

    paragraphs.forEach((p) => {
      const text = p.dataset.raw || ""; // Use raw text stored in data attribute
      let html = text;

      // Process block math ($$...$$)
      html = html.replace(/\$\$(.*?)\$\$/g, (_, tex) => {
        try {
          return katex.renderToString(tex, {
            displayMode: true,
            throwOnError: false,
          });
        } catch (error) {
          console.error("KaTeX block error:", error);
          return tex; // Fallback to raw text on error
        }
      });

      // Process inline math ($...$)
      html = html.replace(/\$(.*?)\$/g, (_, tex) => {
        try {
          return katex.renderToString(tex, {
            displayMode: false,
            throwOnError: false,
          });
        } catch (error) {
          console.error("KaTeX inline error:", error);
          return tex; // Fallback to raw text on error
        }
      });

      p.innerHTML = html; // Update the paragraph with rendered LaTeX
    });
  }, [content]);

  // Split content by <br> and prepare paragraphs with raw text in data attribute
  const paragraphs = content.split("<br>").map((paragraph, index) => (
    <p key={index} className="mb-4" data-raw={paragraph} />
  ));

  return (
    <div ref={containerRef} className="my-8 leading-relaxed">
      {paragraphs}
    </div>
  );
}