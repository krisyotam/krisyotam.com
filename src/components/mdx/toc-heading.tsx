import type React from "react"
import { createElement, type JSX } from "react"

interface TOCHeadingProps {
  id: string
  level: number
  children: React.ReactNode
}

export function TOCHeading({ id, level, children }: TOCHeadingProps) {
  // This component is primarily for MDX parsing
  // The actual rendering is handled by the TableOfContents component
  const tag = `h${level}` as keyof JSX.IntrinsicElements
  return createElement(tag, { id }, children)
}

