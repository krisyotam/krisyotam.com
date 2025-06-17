"use client"

import { useTheme } from "next-themes"
import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"

interface WebsitePreviewProps {
  description: string
}

export function WebsitePreview({ description }: WebsitePreviewProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [iframeKey, setIframeKey] = useState(0)

  // Wait for component to mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Force iframe reload when theme changes
  useEffect(() => {
    if (mounted) {
      setIframeKey(prev => prev + 1)
    }
  }, [resolvedTheme, mounted])

  return (
    <Card className="mb-6 border border-border">
      <CardContent className="p-4 flex flex-col items-center">
        <div className="w-[80%] flex flex-col gap-3">
          {/* Text in its own bento box */}
          <Card className="border border-border">
            <CardContent className="p-3">
              <p className="text-sm text-foreground">{description}</p>
            </CardContent>
          </Card>

          {/* Iframe below in its own container */}
          <div className="border border-border rounded-sm overflow-hidden">
            <div className="relative w-full" style={{ aspectRatio: "7/4" }}>
              {mounted && (
                <iframe
                  key={iframeKey}
                  src="/"
                  className="w-full h-full border-0"
                  title="Website preview"
                />
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

