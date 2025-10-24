"use client"

import { useState, useEffect } from "react"
import { Download, Copy, Maximize2 } from "lucide-react"
import { useTheme } from "next-themes"
import format from "date-fns/format"
import { useRouter } from "next/navigation"

interface PromptFile {
  name: string
  size: number
  modified: string
}

interface PromptContent {
  name: string
  content: string
  size: number
  modified: string
}

export function PromptsClient() {
  const [prompts, setPrompts] = useState<PromptFile[]>([])
  const [selectedPrompt, setSelectedPrompt] = useState<PromptContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { theme } = useTheme()
  const router = useRouter()

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/prompts")

        if (!response.ok) {
          throw new Error("Failed to fetch prompts")
        }

        const data = await response.json()
        setPrompts(data.files || [])
      } catch (err) {
        setError("Failed to load prompts. Please try again later.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchPrompts()
  }, [])

  const fetchPromptContent = async (filename: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/prompts?filename=${encodeURIComponent(filename)}`)

      if (!response.ok) {
        throw new Error("Failed to fetch prompt content")
      }

      const data = await response.json()
      setSelectedPrompt(data)
    } catch (err) {
      setError("Failed to load prompt content. Please try again later.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handlePromptClick = (filename: string) => {
    fetchPromptContent(filename)
  }

  const copyToClipboard = async () => {
    if (selectedPrompt) {
      try {
        await navigator.clipboard.writeText(selectedPrompt.content)
        alert("Copied to clipboard!")
      } catch (err) {
        console.error("Failed to copy:", err)
      }
    }
  }

  const downloadPrompt = () => {
    if (selectedPrompt) {
      const blob = new Blob([selectedPrompt.content], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = selectedPrompt.name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const enlargePrompt = () => {
    if (selectedPrompt) {
      router.push(`/prompts/${encodeURIComponent(selectedPrompt.name)}`)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  return (
    <div className="max-w-[800px] mx-auto mt-8">
      {loading && !selectedPrompt && <div className="text-center">Loading prompts...</div>}

      {error && <div className="text-red-500 text-center">{error}</div>}

      {!loading && !error && prompts.length === 0 && (
        <div className="text-center text-muted-foreground">No prompts found in the prompts directory.</div>
      )}

      {!selectedPrompt ? (
        <div className="font-mono">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left text-sm text-muted-foreground">
                <th className="pb-2 font-normal">date</th>
                <th className="pb-2 font-normal">title</th>
                <th className="pb-2 font-normal text-right">size</th>
              </tr>
            </thead>
            <tbody>
              {prompts.map((prompt) => (
                <tr
                  key={prompt.name}
                  onClick={() => handlePromptClick(prompt.name)}
                  className="border-t border-border hover:bg-secondary/50 transition-colors duration-200 cursor-pointer"
                >
                  <td className="py-3 pr-4 text-sm text-muted-foreground whitespace-nowrap">
                    {format(new Date(prompt.modified), "yyyy-MM-dd")}
                  </td>
                  <td className="py-3 pr-4">{prompt.name}</td>
                  <td className="py-3 text-right text-sm text-blue-500">{formatFileSize(prompt.size)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="border border-border rounded-md overflow-hidden">
          <div className="flex items-center justify-between p-3 bg-muted/50 border-b border-border">
            <h3 className="font-medium">{selectedPrompt.name}</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={copyToClipboard}
                className="p-1.5 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                title="Copy to clipboard"
              >
                <Copy className="h-4 w-4" />
              </button>
              <button
                onClick={downloadPrompt}
                className="p-1.5 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                title="Download file"
              >
                <Download className="h-4 w-4" />
              </button>
              <button
                onClick={enlargePrompt}
                className="p-1.5 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                title="Enlarge view"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setSelectedPrompt(null)}
                className="p-1.5 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                title="Back to list"
              >
                Back
              </button>
            </div>
          </div>
          <div className="p-4 overflow-x-auto">
            <pre
              className={`text-sm ${theme === "dark" ? "bg-zinc-900" : "bg-gray-50"} p-4 rounded-md overflow-x-auto`}
            >
              <code>{selectedPrompt.content}</code>
            </pre>
          </div>
          <div className="flex items-center justify-between p-3 bg-muted/50 border-t border-border text-xs text-muted-foreground">
            <div>{formatFileSize(selectedPrompt.size)}</div>
            <div>Last modified: {new Date(selectedPrompt.modified).toLocaleString()}</div>
          </div>
        </div>
      )}
    </div>
  )
}
