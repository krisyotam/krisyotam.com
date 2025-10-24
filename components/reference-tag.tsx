"use client"

import { useState } from "react"
import { DraggableWindow } from "./draggable-window"

interface ReferenceTagProps {
  name: string
  url: string
}

export function ReferenceTag({ name, url }: ReferenceTagProps) {
  const [isWindowOpen, setIsWindowOpen] = useState(false)
  const [zIndex, setZIndex] = useState(50)

  const handleFocus = () => {
    setZIndex((prev) => prev + 1)
  }

  return (
    <>
      <span
        className="inline-flex items-center px-2.5 py-1 text-sm bg-secondary/70 hover:bg-secondary text-secondary-foreground rounded-md transition-colors cursor-pointer"
        onClick={() => setIsWindowOpen(true)}
      >
        {name}
      </span>

      <DraggableWindow
        title={`Wikipedia: ${name}`}
        url={url}
        isOpen={isWindowOpen}
        onClose={() => setIsWindowOpen(false)}
        zIndex={zIndex}
        onFocus={handleFocus}
      />
    </>
  )
}

