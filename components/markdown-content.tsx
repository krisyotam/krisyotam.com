"use client"

import { useEffect, useState } from "react"
import { marked } from "marked"

interface MarkdownContentProps {
  content: string
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  const [html, setHtml] = useState("")

  useEffect(() => {
    const convertMarkdownToHtml = async () => {
      // Configure marked options if needed
      marked.setOptions({
        breaks: true,
        gfm: true,
      })

      // Convert markdown to HTML asynchronously
      const renderedHtml = await marked.parse(content)
      setHtml(renderedHtml)
    }

    convertMarkdownToHtml()
  }, [content])

  return <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
}
