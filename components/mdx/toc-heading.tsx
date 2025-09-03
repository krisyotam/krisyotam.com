import type React from "react"

interface TOCHeadingProps {
  id: string
  level: number
  children: React.ReactNode
}

export function TOCHeading({ id, level, children }: TOCHeadingProps) {
  // This component is primarily for MDX parsing
  // The actual rendering is handled by the TableOfContents component
  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements
  return <HeadingTag id={id}>{children}</HeadingTag>
}

