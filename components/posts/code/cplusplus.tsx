"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Terminal, Code } from "lucide-react"

interface CppCodeBlockProps {
  title?: string
  description?: string
  code: string
  output: string
}

export default function CppCodeBlock({
  title = "Algorithm Example",
  description,
  code = "// Your C++ code here",
  output = "// Expected output here",
}: CppCodeBlockProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [showOutput, setShowOutput] = useState(false)

  const handleRunCode = () => {
    setIsRunning(true)
    // Simulate code execution delay
    setTimeout(() => {
      setIsRunning(false)
      setShowOutput(true)
    }, 1000)
  }

  return (
    <div className="w-full my-6 rounded-none bg-muted/50 dark:bg-[hsl(var(--popover))]">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-1">
          <Terminal className="h-5 w-5" />
          <h3 className="text-lg font-medium">{title}</h3>
        </div>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Code Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Code className="h-4 w-4" />
            <span>Source Code</span>
          </div>
          <div className="relative">
            <pre className="rounded-none bg-slate-950 p-4 overflow-x-auto text-sm text-slate-50 font-mono h-[300px] overflow-y-auto border border-border">
              <code>{code}</code>
            </pre>
          </div>
        </div>

        {/* Output Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Terminal className="h-4 w-4" />
              <span>Output</span>
            </div>
            <Button
              onClick={handleRunCode}
              disabled={isRunning}
              size="sm"
              className="rounded-none bg-primary hover:bg-primary/90"
            >
              {isRunning ? "Running..." : "Run Code"}
            </Button>
          </div>
          <div className="rounded-none bg-black p-4 text-sm text-green-400 font-mono h-[150px] overflow-y-auto border border-border">
            {showOutput ? (
              <pre>{output}</pre>
            ) : (
              <div className="text-slate-500 italic">Run the code to see output</div>
            )}
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="p-4 border-t border-border bg-muted/30 dark:bg-[hsl(var(--popover))]/70 flex justify-end">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowOutput(false)} 
          disabled={!showOutput}
          className="rounded-none"
        >
          Reset Output
        </Button>
      </div>
    </div>
  )
} 