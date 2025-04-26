"use client"

import { useState, useEffect } from "react"
import { Download, Copy, Maximize2 } from "lucide-react"
import { useTheme } from "next-themes"
import { format } from "date-fns"
import { useRouter } from "next/navigation"

interface ScriptFile {
  name: string
  size: number
  modified: string
}

interface ScriptContent {
  name: string
  content: string
  size: number
  modified: string
}

export function ScriptsClient() {
  const [scripts, setScripts] = useState<ScriptFile[]>([])
  const [selectedScript, setSelectedScript] = useState<ScriptContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { theme } = useTheme()
  const router = useRouter()

  useEffect(() => {
    const fetchScripts = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/scripts")

        if (!response.ok) {
          throw new Error("Failed to fetch scripts")
        }

        const data = await response.json()
        setScripts(data.files || [])
      } catch (err) {
        setError("Failed to load scripts. Please try again later.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchScripts()
  }, [])

  const fetchScriptContent = async (filename: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/scripts?filename=${encodeURIComponent(filename)}`)

      if (!response.ok) {
        throw new Error("Failed to fetch script content")
      }

      const data = await response.json()
      setSelectedScript(data)
    } catch (err) {
      setError("Failed to load script content. Please try again later.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleScriptClick = (filename: string) => {
    fetchScriptContent(filename)
  }

  const copyToClipboard = async () => {
    if (selectedScript) {
      try {
        await navigator.clipboard.writeText(selectedScript.content)
        alert("Copied to clipboard!")
      } catch (err) {
        console.error("Failed to copy:", err)
      }
    }
  }

  const downloadScript = () => {
    if (selectedScript) {
      const blob = new Blob([selectedScript.content], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.download = selectedScript.name
      a.href = url
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const enlargeScript = () => {
    if (selectedScript) {
      router.push(`/scripts/${encodeURIComponent(selectedScript.name)}`)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  return (
    <div className="max-w-[800px] mx-auto mt-8">
      {loading && !selectedScript && <div className="text-center">Loading scripts...</div>}

      {error && <div className="text-red-500 text-center">{error}</div>}

      {!loading && !error && scripts.length === 0 && (
        <div className="text-center text-muted-foreground">No scripts found in the scripts directory.</div>
      )}

      {!selectedScript ? (
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
              {scripts.map((script) => (
                <tr
                  key={script.name}
                  onClick={() => handleScriptClick(script.name)}
                  className="border-t border-border hover:bg-secondary/50 transition-colors duration-200 cursor-pointer"
                >
                  <td className="py-3 pr-4 text-sm text-muted-foreground whitespace-nowrap">
                    {format(new Date(script.modified), "yyyy-MM-dd")}
                  </td>
                  <td className="py-3 pr-4">{script.name}</td>
                  <td className="py-3 text-right text-sm text-blue-500">{formatFileSize(script.size)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="border border-border rounded-md overflow-hidden">
          <div className="flex items-center justify-between p-3 bg-muted/50 border-b border-border">
            <h3 className="font-medium">{selectedScript.name}</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={copyToClipboard}
                className="p-1.5 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                title="Copy to clipboard"
              >
                <Copy className="h-4 w-4" />
              </button>
              <button
                onClick={downloadScript}
                className="p-1.5 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                title="Download file"
              >
                <Download className="h-4 w-4" />
              </button>
              <button
                onClick={enlargeScript}
                className="p-1.5 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                title="Enlarge view"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setSelectedScript(null)}
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
              <code>{selectedScript.content}</code>
            </pre>
          </div>
          <div className="flex items-center justify-between p-3 bg-muted/50 border-t border-border text-xs text-muted-foreground">
            <div>{formatFileSize(selectedScript.size)}</div>
            <div>Last modified: {new Date(selectedScript.modified).toLocaleString()}</div>
          </div>
        </div>
      )}
    </div>
  )
}
