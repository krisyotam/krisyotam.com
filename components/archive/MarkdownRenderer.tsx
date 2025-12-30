"use client"

import React from "react"
import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import rehypeRaw from "rehype-raw"
import rehypeHighlight from "rehype-highlight"
import rehypeStringify from "rehype-stringify"
import { preprocessKaTeX } from "@/utils/katex-preprocessor"

import "katex/dist/katex.min.css"

interface MarkdownRendererProps {
  content: string
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const [html, setHtml] = React.useState<string>("")
  React.useEffect(() => {
    const processMarkdown = async () => {
      try {
        // First, remove any direct component imports if they exist
        const contentWithoutImports = content.replace(/import\s+.*?from\s+['"].*?['"]\s*;?/g, '');
        
        // Preprocess KaTeX expressions first
        const preprocessedContent = preprocessKaTeX(contentWithoutImports);
        
        const file = await unified()
          .use(remarkParse)
          .use(remarkRehype, { allowDangerousHtml: true })
          .use(rehypeRaw)
          .use(rehypeHighlight)
          .use(rehypeStringify)
          .process(preprocessedContent)

        setHtml(String(file))
      } catch (error) {
        console.error("Error processing markdown:", error)
        setHtml(`<div>Error processing content: ${error}</div>`)
      }
    }

    processMarkdown()
  }, [content])

  if (!html) {
    return <div>Loading...</div>
  }

  return <div dangerouslySetInnerHTML={{ __html: html }} />
}
