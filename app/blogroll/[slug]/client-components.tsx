"use client"

import { useState } from "react"
import { Copy, ExternalLink, Check } from "lucide-react"

export function UrlControls({ url }: { url: string }) {
  const [copySuccess, setCopySuccess] = useState(false)
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(url)
      .then(() => {
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 2000)
      })
      .catch(err => console.error('Failed to copy URL:', err))
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={copyToClipboard}
        className="p-1.5 hover:bg-muted/50 transition text-muted-foreground hover:text-foreground"
        aria-label="Copy URL"
        title="Copy URL"
      >
        {copySuccess ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
        <span className="sr-only">Copy URL</span>
      </button>

      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="p-1.5 hover:bg-muted/50 transition text-muted-foreground hover:text-foreground"
        aria-label="Open in new tab"
        title="Open in new tab"
      >
        <ExternalLink className="h-5 w-5" />
        <span className="sr-only">Open in new tab</span>
      </a>
    </div>
  )
}

export function IframeWithUrlBar({ url, title, height = 550 }: { url: string; title: string; height?: number }) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(url)
      .then(() => {
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 2000)
      })
      .catch(err => console.error('Failed to copy URL:', err))
  }

  // Extract domain for display
  let displayUrl = url;
  try {
    const urlObj = new URL(url);
    displayUrl = urlObj.hostname + urlObj.pathname;
  } catch (e) {
    // Use the original URL if parsing fails
  }

  return (
    <div className="flex flex-col bg-background border border-border shadow-sm overflow-hidden w-full" style={{ height: `${height}px` }}>
      {/* URL bar and controls - made more compact */}      <div className="px-2 py-1.5 flex items-center w-full bg-muted/20 border-b border-border">
        <div className="flex-1 flex items-center bg-background/80 border border-border px-2 py-1 mr-2 overflow-hidden">
          <span className="text-xs font-mono truncate text-muted-foreground">
            {displayUrl}
          </span>
        </div>

        <div className="flex items-center space-x-0.5">
          <button
            onClick={copyToClipboard}
            className="p-1 hover:bg-muted/50 transition text-muted-foreground hover:text-foreground"
            aria-label="Copy URL"
            title="Copy URL"
          >
            {copySuccess ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          </button>

          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="p-1 hover:bg-muted/50 transition text-muted-foreground hover:text-foreground"
            aria-label="Open in new tab"
            title="Open in new tab"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* Iframe content area */}
      <div className="flex-1 relative">
        <iframe
          src={url}
          title={`External content: ${title}`}
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
          referrerPolicy="no-referrer"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false)
            setHasError(true)
          }}
        />
        
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              <div className="text-sm text-muted-foreground">Loading {title}...</div>
            </div>
          </div>
        )}
        
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
            <div className="flex flex-col items-center gap-3 max-w-md text-center p-4">
              <div className="text-red-500 font-medium">Failed to load content</div>
              <div className="text-sm text-muted-foreground">The website may be blocking embedding in iframes</div>
              <a 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="mt-1 px-3 py-1.5 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors text-sm"
              >
                Open in New Tab
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
