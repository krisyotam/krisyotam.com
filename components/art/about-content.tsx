"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import ReactMarkdown from "react-markdown"

export default function AboutContent({ markdown }: { markdown: string }) {
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="prose prose-sm md:prose-base lg:prose-lg dark:prose-invert mx-auto">
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </div>
  )
}

