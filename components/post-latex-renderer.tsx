"use client";

import React, { useEffect, useRef, useState } from "react";
import Script from "next/script";

interface PostLatexRendererProps {
  children: React.ReactNode;
}

interface MathJaxError extends Error {
  message: string;
  stack?: string;
}

interface MathJaxConfig {
  loader: {
    load: string[];
  };
  tex: {
    inlineMath: [string, string][];
    displayMath: [string, string][];
    processEscapes: boolean;
    processEnvironments: boolean;
    tags: string;
  };
  svg: {
    fontCache: string;
    scale: number;
  };
  options: {
    skipHtmlTags: string[];
    enableMenu: boolean;
  };
}

interface MathJax {
  typesetPromise: (elements: HTMLElement[]) => Promise<void>
  typeset: (elements: HTMLElement[]) => void
  startup: {
    promise: Promise<void>
    typesetPromise: (elements: HTMLElement[]) => Promise<void>
  }
  tex2chtml: (math: string, options?: { display?: boolean }) => HTMLElement
  tex2svg: (math: string, options?: { display?: boolean }) => HTMLElement
  tex2mml: (math: string, options?: { display?: boolean }) => string
  tex2chtmlPromise: (math: string, options?: { display?: boolean }) => Promise<HTMLElement>
  tex2svgPromise: (math: string, options?: { display?: boolean }) => Promise<HTMLElement>
  tex2mmlPromise: (math: string, options?: { display?: boolean }) => Promise<string>
}

export function PostLatexRenderer({ children }: PostLatexRendererProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [mathjaxReady, setMathjaxReady] = useState(false);

  // re-render whenever content or MathJax readiness changes
  useEffect(() => {
    if (!mathjaxReady || !contentRef.current) return;

    if (
      typeof window.MathJax !== "undefined" &&
      typeof window.MathJax.startup !== "undefined" &&
      typeof window.MathJax.startup.typesetPromise === "function"
    ) {
      window.MathJax.startup.typesetPromise([contentRef.current])
        .catch((err: MathJaxError) => console.error("MathJax error:", err));
    } else if (typeof window.MathJax.typesetPromise === "function") {
      window.MathJax.typesetPromise([contentRef.current])
        .catch((err: MathJaxError) => console.error("MathJax error:", err));
    } else if (typeof window.MathJax.typeset === "function") {
      try {
        window.MathJax.typeset([contentRef.current]);
      } catch (err) {
        console.error("MathJax error:", err);
      }
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

declare global {
  interface Window {
    MathJax: MathJax
  }
}
