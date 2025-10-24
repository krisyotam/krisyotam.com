"use client"

import { useState, useEffect } from "react"
import { Copy, Download, ChevronLeft } from "lucide-react"
import Link from "next/link"

interface PromptViewerProps {
  filename: string
}

export function PromptViewer({ filename }: PromptViewerProps) {
  const [content, setContent] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fileSize, setFileSize] = useState<number>(0)
  const [modified, setModified] = useState<string>("")

  useEffect(() => {
    async function fetchPromptContent() {
      try {
        setLoading(true)
        const response = await fetch(`/api/prompts?filename=${encodeURIComponent(filename)}`)

        if (!response.ok) {
          throw new Error("Failed to fetch prompt content")
        }

        const data = await response.json()
        setContent(data.content)
        setFileSize(data.size)
        setModified(data.modified)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchPromptContent()
  }, [filename])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content)
      alert("Copied to clipboard!")
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const downloadPrompt = () => {
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>
  }

  if (loading) {
    return <div className="text-center">Loading prompt content...</div>
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="border border-border rounded-none overflow-hidden my-6">
        <div className="flex items-center justify-between p-4 bg-muted/50 dark:bg-[hsl(var(--popover))] border-b border-border">
          <h3 className="font-medium font-mono">{filename}</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={copyToClipboard}
              className="p-2 rounded-none hover:bg-accent hover:text-accent-foreground transition-colors"
              title="Copy to clipboard"
            >
              <Copy className="h-4 w-4" />
            </button>
            <button
              onClick={downloadPrompt}
              className="p-2 rounded-none hover:bg-accent hover:text-accent-foreground transition-colors"
              title="Download file"
            >
              <Download className="h-4 w-4" />
            </button>
            <Link href="/prompts">
              <button
                className="p-2 rounded-none hover:bg-accent hover:text-accent-foreground transition-colors"
                title="Back to prompts"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>
        <div className="p-6 overflow-x-auto bg-muted/30 dark:bg-[hsl(var(--popover))]/80">
          <pre className="text-sm font-mono bg-background/60 dark:bg-background/40 p-6 rounded-none overflow-x-auto border border-border/50">
            <code className="text-foreground">{content}</code>
          </pre>
        </div>
        <div className="flex items-center justify-between p-4 bg-muted/50 dark:bg-[hsl(var(--popover))] border-t border-border text-xs text-muted-foreground font-mono">
          <div>{formatFileSize(fileSize)}</div>
          <div>Last modified: {new Date(modified).toLocaleString()}</div>
        </div>
      </div>
    </div>
  )
}
