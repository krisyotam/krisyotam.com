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
    <div className="w-full max-w-3xl mx-auto">
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
    </div>
  )
}