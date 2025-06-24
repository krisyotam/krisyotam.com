"use client"

import { cn } from "@/lib/utils"
import React, { useState } from "react"

export interface EssayProps {
  title: string
  date: string
  author: string
  pdfUrl: string
  className?: string
}

export function Essay({ title, date, author, pdfUrl, className }: EssayProps) {
  const [loading, setLoading] = useState(true)

  // Base styles matching the Box component's flat 2D appearance
  const containerClasses = cn(
    "w-full my-8 overflow-hidden rounded-none border border-border",
    "bg-muted/50 dark:bg-[hsl(var(--popover))]",
    className
  )

  // Header bezel with title and date
  const headerClasses = cn(
    "p-3 flex justify-between items-center",
    "text-sm font-medium border-b border-border",
    "bg-muted/70 dark:bg-[hsl(var(--popover))]"
  )

  // Footer bezel with author name
  const footerClasses = cn(
    "p-3 flex justify-end items-center",
    "text-sm italic border-t border-border",
    "bg-muted/70 dark:bg-[hsl(var(--popover))]"
  )

  // PDF viewer container - sized to display exactly one full page
  const pdfContainerClasses = cn(
    "w-full h-[90vh]",
    "bg-white dark:bg-[#333]" // PDF background should be distinct in dark mode
  )

  return (
    <div className={containerClasses}>
      {/* Header bezel with title and date */}
      <div className={headerClasses}>
        <span className="font-semibold">{title}</span>
        <span className="text-muted-foreground">{date}</span>
      </div>
      
      {/* PDF Viewer */}
      <div className={pdfContainerClasses}>
        {loading && (
          <div className="w-full h-12 flex items-center justify-center">
            <span className="text-muted-foreground">Loading PDF...</span>
          </div>
        )}
        <iframe 
          src={`${pdfUrl}#view=FitH&toolbar=0&navpanes=0&scrollbar=0`}
          className="w-full h-full"
          onLoad={() => setLoading(false)}
          title={title}
          frameBorder="0"
        />
      </div>
      
      {/* Footer bezel with author */}
      <div className={footerClasses}>
        <span className="text-muted-foreground">by {author}</span>
      </div>
    </div>
  )
}

export default Essay
