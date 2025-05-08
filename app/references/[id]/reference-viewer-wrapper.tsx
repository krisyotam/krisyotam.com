"use client"

import { ReferenceViewer } from "@/components/reference/reference-viewer"

interface Reference {
  id: string
  title: string
  type: string
  format: string
  author: string
  date: string
  url: string
  preview?: string
}

export function ReferenceViewerWrapper({ reference }: { reference: Reference }) {
  return (
    <ReferenceViewer
      id={reference.id}
      title={reference.title}
      type={reference.type}
      format={reference.format}
      author={reference.author}
      date={reference.date}
      url={reference.url}
      preview={reference.preview}
    />
  )
} 