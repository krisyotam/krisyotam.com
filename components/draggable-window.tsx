"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { X, Maximize2, Minimize2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Position {
  x: number
  y: number
}

interface DraggableWindowProps {
  title: string
  url: string
  isOpen: boolean
  onClose: () => void
  initialPosition?: Position
  zIndex: number
  onFocus: () => void
}

export function DraggableWindow({
  title,
  url,
  isOpen,
  onClose,
  initialPosition = { x: 100, y: 100 },
  zIndex,
  onFocus,
}: DraggableWindowProps) {
  const [position, setPosition] = useState<Position>(initialPosition)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 })
  const [isMaximized, setIsMaximized] = useState(false)
  const [preMaximizePosition, setPreMaximizePosition] = useState<Position>(initialPosition)
  const [preMaximizeSize, setPreMaximizeSize] = useState<{ width: string; height: string }>({
    width: "600px",
    height: "400px",
  })
  const [iframeLoaded, setIframeLoaded] = useState(false)

  const windowRef = useRef<HTMLDivElement>(null)

  // Handle dragging
  useEffect(() => {
    if (!isOpen) return

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && !isMaximized) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, dragOffset, isMaximized])

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMaximized) return

    onFocus()

    if (windowRef.current) {
      const rect = windowRef.current.getBoundingClientRect()
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
      setIsDragging(true)
    }
  }

  const toggleMaximize = () => {
    if (isMaximized) {
      setIsMaximized(false)
      setPosition(preMaximizePosition)
    } else {
      setPreMaximizePosition(position)
      if (windowRef.current) {
        setPreMaximizeSize({
          width: windowRef.current.style.width,
          height: windowRef.current.style.height,
        })
      }
      setIsMaximized(true)
      setPosition({ x: 0, y: 0 })
    }
  }

  if (!isOpen) return null

  return (
    <div
      ref={windowRef}
      className="fixed bg-background border border-border shadow-lg rounded-lg overflow-hidden flex flex-col"
      style={{
        left: position.x,
        top: position.y,
        width: isMaximized ? "100%" : "600px",
        height: isMaximized ? "100%" : "400px",
        zIndex,
      }}
      onClick={onFocus}
    >
      {/* Window header */}
      <div
        className="p-2 bg-muted flex items-center justify-between cursor-move select-none"
        onMouseDown={handleMouseDown}
      >
        <div className="font-medium truncate">{title}</div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={(e) => {
              e.stopPropagation()
              toggleMaximize()
            }}
          >
            {isMaximized ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Window content */}
      <div className="flex-1 overflow-hidden relative">
        {!iframeLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-background">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}
        <iframe
          src={url}
          className="w-full h-full border-0"
          onLoad={() => setIframeLoaded(true)}
          style={{ opacity: iframeLoaded ? 1 : 0 }}
        />
      </div>

      {/* Window footer */}
      <div className="p-2 bg-muted flex justify-between items-center text-xs text-muted-foreground">
        <span className="truncate">{url}</span>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center hover:text-foreground"
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink className="h-3 w-3 mr-1" />
          Open
        </a>
      </div>
    </div>
  )
}

