"use client";

import React, { useEffect, useRef, useState } from "react";
import Script from "next/script";

interface PostLatexRendererProps {
  children: React.ReactNode;
}

export function PostLatexRenderer({ children }: PostLatexRendererProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [mathjaxReady, setMathjaxReady] = useState(false);

  // re-render whenever content or MathJax readiness changes
  useEffect(() => {
    if (!mathjaxReady || !contentRef.current) return;

    if (typeof window.MathJax.typesetPromise === "function") {
      window.MathJax.typesetPromise([contentRef.current])
        .catch((err: any) => console.error("MathJax error:", err));
    } else if (typeof window.MathJax.typeset === "function") {
      try {
        window.MathJax.typeset([contentRef.current]);
      } catch (err) {
        console.error("MathJax error:", err);
      }
    } else if (window.MathJax.startup &&
               typeof window.MathJax.startup.typesetPromise === "function") {
      window.MathJax.startup.typesetPromise([contentRef.current])
        .catch((err: any) => console.error("MathJax error:", err));
    } else {
      console.warn("No MathJax render method found");
    }
  }, [mathjaxReady, children]);

  return (
    <>
      {/* 1) Configure MathJax before it loads */}
      <Script
        id="mathjax-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.MathJax = {
              loader: {
                load: ['input/tex','output/svg','[tex]/ams','[tex]/mhchem']
              },
              tex: {
                inlineMath: [['$','$']],
                displayMath: [['$$','$$']],
                processEscapes: true,
                processEnvironments: true,
                tags: 'ams'
              },
              svg: {
                fontCache: 'global',
                scale: 2.2    // ~30px (2.2 × 14px) for larger math
              },
              options: {
                skipHtmlTags: ['script','noscript','style','textarea','pre','code'],
                enableMenu: false
              }
            };
          `,
        }}
      />

      {/* 2) Load MathJax and mark it ready */}
      <Script
        src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"
        id="mathjax-script"
        strategy="afterInteractive"
        onLoad={() => setMathjaxReady(true)}
      />

      {/* 3) Rendered content */}
      <div ref={contentRef}>{children}</div>
    </>
  );
}

// loosened TS declaration to accept any MathJax export
declare global {
  interface Window { MathJax: any; }
}
