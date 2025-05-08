"use client"

import { useState, useEffect } from "react"
import { Download, Printer, ChevronLeft, ExternalLink } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useTheme } from "next-themes"

interface ReferenceViewerProps {
  id: string
  title: string
  type: string
  format: string
  author: string
  date: string
  url: string
  preview?: string
}

export function ReferenceViewer({
  id,
  title,
  type,
  format,
  author,
  date,
  url,
  preview,
}: ReferenceViewerProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { theme } = useTheme()
  
  // Handle loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])
  
  // Handle download functionality
  const handleDownload = () => {
    // For external URLs, just open them in a new tab
    if (url.startsWith('http')) {
      window.open(url, '_blank')
      return
    }
    
    // For local files, trigger download
    const link = document.createElement('a')
    link.href = url
    link.download = title.replace(/\s+/g, '-').toLowerCase() + '.' + format.toLowerCase()
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  
  // Handle print functionality
  const handlePrint = () => {
    window.print()
  }

  // Render appropriate viewer based on format
  const renderViewer = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-[500px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-zinc-100"></div>
        </div>
      )
    }
    
    if (error) {
      return (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-md p-6 text-center">
          <p className="text-red-700 dark:text-red-400">{error}</p>
        </div>
      )
    }
    
    // Handle image formats
    if (['JPG', 'JPEG', 'PNG', 'GIF', 'SVG'].includes(format.toUpperCase())) {
      return (
        <div className="flex justify-center py-8">
          <Image 
            src={url} 
            alt={title}
            width={800}
            height={600}
            className="max-w-full h-auto object-contain"
          />
        </div>
      )
    }
    
    // Handle PDF format
    if (format.toUpperCase() === 'PDF') {
      return (
        <iframe 
          src={`${url}#toolbar=0&navpanes=0&scrollbar=0`} 
          className="w-full h-[1100px] border-0 rounded-md"
          title={title}
        />
      )
    }
    
    // Handle EPUB format (embedded viewer not widely supported, show placeholder)
    if (format.toUpperCase() === 'EPUB') {
      return (
        <div className="flex flex-col items-center justify-center space-y-6 py-12 bg-gray-50 dark:bg-zinc-900 rounded-md">
          <div className="text-center max-w-lg">
            <h3 className="text-xl font-bold mb-4">EPUB Document</h3>
            <p className="mb-6 text-muted-foreground">
              EPUB files need to be downloaded and viewed in an e-reader application.
            </p>
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center justify-center mx-auto"
            >
              <Download className="mr-2 h-4 w-4" />
              Download EPUB
            </button>
          </div>
        </div>
      )
    }
    
    // Handle HTML (external websites)
    if (format.toUpperCase() === 'HTML' && url.startsWith('http')) {
      return (
        <div className="flex flex-col items-center justify-center space-y-6 py-12 bg-gray-50 dark:bg-zinc-900 rounded-md">
          <div className="text-center max-w-lg">
            <h3 className="text-xl font-bold mb-4">External Website</h3>
            <p className="mb-6 text-muted-foreground">
              This reference links to an external website.
            </p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center justify-center mx-auto"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Visit Website
            </a>
          </div>
        </div>
      )
    }
    
    // Handle CSV files (show as table preview or placeholder)
    if (format.toUpperCase() === 'CSV') {
      return (
        <div className="flex flex-col items-center justify-center space-y-6 py-12 bg-gray-50 dark:bg-zinc-900 rounded-md">
          <div className="text-center max-w-lg">
            <h3 className="text-xl font-bold mb-4">CSV Dataset</h3>
            <p className="mb-6 text-muted-foreground">
              This is a CSV data file. Download it to view in a spreadsheet application.
            </p>
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center justify-center mx-auto"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Dataset
            </button>
          </div>
        </div>
      )
    }
    
    // Default fallback for other formats
    return (
      <div className="flex flex-col items-center justify-center space-y-6 py-12 bg-gray-50 dark:bg-zinc-900 rounded-md">
        <div className="text-center max-w-lg">
          <h3 className="text-xl font-bold mb-4">{format} Document</h3>
          <p className="mb-6 text-muted-foreground">
            This file format requires downloading to view.
          </p>
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center justify-center mx-auto"
          >
            <Download className="mr-2 h-4 w-4" />
            Download File
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="border border-border rounded-md overflow-hidden">
        {/* Header with file info and controls */}
        <div className="flex items-center justify-between p-4 bg-muted/50 border-b border-border">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <div className="text-sm px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 font-medium">
                {format}
              </div>
              <div className="text-sm px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 font-medium">
                {type}
              </div>
            </div>
            
            <div className="mt-1 font-medium text-lg">{title}</div>
            <div className="text-sm text-muted-foreground">By {author} • {new Date(date).toLocaleDateString()}</div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownload}
              className="p-1.5 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
              title="Download file"
            >
              <Download className="h-4 w-4" />
            </button>
            <button
              onClick={handlePrint}
              className="p-1.5 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
              title="Print"
            >
              <Printer className="h-4 w-4" />
            </button>
            <Link href="/references">
              <button
                className="p-1.5 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                title="Back to references"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>
        
        {/* File viewer */}
        <div className={`p-0 ${format.toUpperCase() === 'PDF' ? '' : 'p-4'} overflow-x-auto`}>
          {renderViewer()}
        </div>
      </div>
    </div>
  )
} 