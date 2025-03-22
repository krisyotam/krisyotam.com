"use client"

import { useTheme } from "next-themes"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { useEffect, useState } from "react"

interface WebsitePreviewProps {
  description: string
  lightModeImage: string
  darkModeImage: string
}

export function WebsitePreview({ description, lightModeImage, darkModeImage }: WebsitePreviewProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Wait for component to mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Determine which image to show based on theme
  const imageSrc = mounted && resolvedTheme === "dark" ? darkModeImage : lightModeImage

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

          {/* Image below in its own container */}
          <div className="border border-border rounded-sm overflow-hidden">
            <div className="relative w-full" style={{ aspectRatio: "7/4" }}>
              {mounted && (
                <Image
                  src={imageSrc || "/placeholder.svg"}
                  alt="Website preview"
                  fill
                  className="object-cover"
                  priority
                />
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

