"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import Script from "next/script"

interface PostLatexRendererProps {
  children: React.ReactNode
}

export function PostLatexRenderer({ children }: PostLatexRendererProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Render LaTeX when component mounts and whenever children change
    if (window.MathJax && contentRef.current) {
      // Wait a bit to ensure content is fully rendered
      setTimeout(() => {
        window.MathJax.typeset([contentRef.current])
      }, 100)
    }
  }, [children])

  return (
    <>
      {/* MathJax configuration */}
      <Script
        id="mathjax-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.MathJax = {
              tex: {
                inlineMath: [['$', '$']],
                displayMath: [['$$', '$$']]
              },
              svg: {
                fontCache: 'global'
              },
              options: {
                enableMenu: false
              }
            };
          `,
        }}
      />
      <Script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js" strategy="afterInteractive" />

      {/* Content with LaTeX */}
      <div ref={contentRef}>{children}</div>
    </>
  )
}

// Add TypeScript interface for MathJax
declare global {
  interface Window {
    MathJax: any
  }
}

