"use client"

import type React from "react"

import { useState } from "react"
import { DraggableWindow } from "./draggable-window"

interface WikiTermProps {
  term: string
  url: string
  children: React.ReactNode
}

export function WikiTerm({ term, url, children }: WikiTermProps) {
  const [isWindowOpen, setIsWindowOpen] = useState(false)
  const [zIndex, setZIndex] = useState(50)

  const handleFocus = () => {
    setZIndex((prev) => prev + 1)
  }

  return (
    <>
      <span
        className="border-b border-dotted border-primary/50 hover:border-primary cursor-pointer transition-colors"
        onClick={() => setIsWindowOpen(true)}
      >
        {children}
      </span>

      <DraggableWindow
        title={`Wikipedia: ${term}`}
        url={url}
        isOpen={isWindowOpen}
        onClose={() => setIsWindowOpen(false)}
        zIndex={zIndex}
        onFocus={handleFocus}
      />
    </>
  )
}

