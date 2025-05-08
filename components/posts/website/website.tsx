"use client"

import { useState, useEffect } from "react"
import { CardDescription, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, ExternalLink, Maximize2, Minimize2, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

interface WebsiteDemoProps {
  url: string
  title?: string
  description?: string
  defaultHeight?: number
  className?: string
}

export default function WebsiteDemo({ 
  url, 
  title = "Website Demo", 
  description, 
  defaultHeight = 500,
  className
}: WebsiteDemoProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Only show theme controls after mounting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleRefresh = () => {
    setIsLoading(true)
    const iframe = document.getElementById("demo-frame") as HTMLIFrameElement
    if (iframe) {
      // Append theme param to URL if site supports it
      const themeParam = theme === "dark" ? "?theme=dark" : ""
      const baseUrl = iframe.src.split("?")[0] // Remove any existing params
      iframe.src = `${baseUrl}${themeParam}`
    }
  }

  const handleLoad = () => {
    setIsLoading(false)
    
    // Try to send theme message to iframe content
    const iframe = document.getElementById("demo-frame") as HTMLIFrameElement
    try {
      if (iframe.contentWindow) {
        iframe.contentWindow.postMessage(
          { type: "theme-change", theme: theme === "dark" ? "dark" : "light" },
          '*'
        )
      }
    } catch (e) {
      // Silent fail - site might not accept messages
    }
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    
    // Try to send theme message to iframe
    const iframe = document.getElementById("demo-frame") as HTMLIFrameElement
    try {
      if (iframe.contentWindow) {
        iframe.contentWindow.postMessage(
          { type: "theme-change", theme: newTheme },
          '*'
        )
      }
    } catch (e) {
      // Silent fail
    }
  }

  // Format URL to include theme if needed
  const getIframeUrl = () => {
    if (!mounted) return url
    // Some sites support theme via query param
    if (theme === "dark") {
      return url.includes("?") ? `${url}&theme=dark` : `${url}?theme=dark`
    }
    return url
  }

  return (
    <div className={cn("w-full my-6", className)}>
      <div className="bg-muted/50 dark:bg-[hsl(var(--popover))] border rounded-none overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              {description && <CardDescription>{description || url}</CardDescription>}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isLoading}
                className="rounded-none">
                <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                <span className="sr-only">Refresh</span>
              </Button>
              {mounted && (
                <Button variant="outline" size="icon" onClick={toggleTheme} 
                  className="rounded-none">
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  <span className="sr-only">Toggle theme</span>
                </Button>
              )}
              <Button variant="outline" size="icon" onClick={toggleFullscreen}
                className="rounded-none">
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                <span className="sr-only">Toggle fullscreen</span>
              </Button>
              <Button variant="outline" size="icon" asChild
                className="rounded-none">
                <a href={url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  <span className="sr-only">Open in new tab</span>
                </a>
              </Button>
            </div>
          </div>
        </div>
        <div className="p-0">
          <div className={`relative transition-all duration-300`}
            style={{ height: isFullscreen ? "80vh" : `${defaultHeight}px` }}>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted/50 dark:bg-[hsl(var(--popover))] z-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-300"></div>
              </div>
            )}
            <iframe
              id="demo-frame"
              src={getIframeUrl()}
              className="w-full h-full border-0"
              onLoad={handleLoad}
              title={`${title} website demo`}
            ></iframe>
          </div>
        </div>
        <div className="border-t p-2 text-xs text-muted-foreground">
          <p>Note: Some websites may block iframe embedding due to X-Frame-Options headers</p>
        </div>
      </div>
    </div>
  )
}
