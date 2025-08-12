"use client"

import Link from "next/link"
import { Download, ExternalLink } from "lucide-react"
import { formatDate } from "@/utils/date-formatter"

interface ReferenceCardProps {
  id: string
  title: string
  type: string
  format: string
  author: string
  date: string
  url: string
  preview?: string
}

export function ReferenceCard({
  id,
  title,
  type,
  format,
  author,
  date,
  url,
  preview,
}: ReferenceCardProps) {
  // Format file type icon based on format
  const getFormatIcon = () => {
    switch (format.toUpperCase()) {
      case 'PDF':
        return <span className="text-red-500">PDF</span>
      case 'EPUB':
        return <span className="text-green-500">EPUB</span>
      case 'PNG':
      case 'JPG':
      case 'JPEG':
      case 'GIF':
      case 'SVG':
        return <span className="text-purple-500">IMG</span>
      case 'CSV':
        return <span className="text-yellow-500">CSV</span>
      case 'HTML':
        return <span className="text-blue-500">HTML</span>
      default:
        return <span className="text-gray-500">{format}</span>
    }
  }

  // Handle direct download functionality
  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (url.startsWith('http')) {
      window.open(url, '_blank')
      return
    }
    
    const link = document.createElement('a')
    link.href = url
    link.download = title.replace(/\s+/g, '-').toLowerCase() + '.' + format.toLowerCase()
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Link href={`/references/${id}`}>
      <div className="border border-border bg-card hover:bg-muted/50 transition-colors duration-200 rounded-md overflow-hidden flex flex-col h-full">
        {/* Reference type and format */}
        <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border">
          <div className="text-sm font-medium text-muted-foreground">{type}</div>
          <div className="text-sm font-mono">{getFormatIcon()}</div>
        </div>
        
        {/* Reference content */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-medium text-xl mb-2 line-clamp-2">{title}</h3>
          
          {preview && (
            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{preview}</p>
          )}
          
          <div className="mt-auto">
            <div className="text-sm text-muted-foreground mb-2">By {author}</div>
            <div className="text-xs text-muted-foreground">{formatDate(date)}</div>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex items-center justify-between border-t border-border px-4 py-2 bg-muted/30">
          {url.startsWith('http') ? (
            <button 
              onClick={handleDownload}
              className="text-xs flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Visit
            </button>
          ) : (
            <button 
              onClick={handleDownload}
              className="text-xs flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <Download className="h-3 w-3 mr-1" />
              Download
            </button>
          )}
          <span className="text-xs text-muted-foreground">View details →</span>
        </div>
      </div>
    </Link>
  )
} 