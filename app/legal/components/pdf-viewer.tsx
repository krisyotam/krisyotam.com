"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Download, ZoomIn, ZoomOut } from "lucide-react"
import { cn } from "@/lib/utils"

interface PDFViewerProps {
  pdfUrl: string
  className?: string
}

export function PDFViewer({ pdfUrl, className }: PDFViewerProps) {
  const [zoom, setZoom] = useState(90);
  
  const increaseZoom = () => setZoom(prev => Math.min(prev + 10, 200));
  const decreaseZoom = () => setZoom(prev => Math.max(prev - 10, 50));
  
  return (
    <div className={cn("border shadow-sm overflow-hidden bg-card", className)}>
      <div className="flex items-center justify-between p-2 border-b bg-muted/50">
        <div className="text-xs text-muted-foreground">
          {pdfUrl.split('/').pop()}
        </div>
          <div className="flex items-center gap-1">
          <button 
            onClick={decreaseZoom}
            className="p-1 hover:bg-background border"
            title="Zoom out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          
          <span className="text-xs px-2 min-w-[48px] text-center">
            {zoom}%
          </span>
          
          <button 
            onClick={increaseZoom}
            className="p-1 hover:bg-background border"
            title="Zoom in"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          
          <a 
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 hover:bg-background border ml-2"
            title="Download PDF"
          >
            <Download className="h-4 w-4" />
          </a>
        </div>      </div>
      
      <div className="h-[842px] w-full mx-auto overflow-hidden relative">
        <object
          data={`${pdfUrl}#zoom=${zoom}&toolbar=0&navpanes=0&scrollbar=0&view=FitH&scrolling=0`}
          type="application/pdf"
          style={{ width: '100%', height: '100%' }}
          className="w-full h-full"
        >
          <div className="p-8 text-center">
            <p className="mb-4 text-muted-foreground">
              It appears you don't have a PDF plugin for this browser.
            </p>
            <a 
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2 border bg-primary text-primary-foreground hover:bg-primary/90 transition-colors w-fit mx-auto"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </a>
          </div>
        </object>
      </div>
    </div>
  )
}
