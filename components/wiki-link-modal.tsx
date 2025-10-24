"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useMotionValue } from "framer-motion"
import { X, Maximize2, Minimize2 } from "lucide-react"

interface WikiLinkModalProps {
  id: string
  url: string
  zIndex: number
  isOpen: boolean
  onClose: () => void
  onFocus: () => void
}

export function WikiLinkModal({ id, url, zIndex, isOpen, onClose, onFocus }: WikiLinkModalProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  // Use motion values for position
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Set initial position when modal opens - stagger multiple modals
  useEffect(() => {
    if (isOpen && modalRef.current) {
      // Extract numeric part from id to create a staggered effect
      const idNum = Number.parseInt(id.replace(/\D/g, "").substring(0, 4)) % 100

      // Position with slight offset based on id to stagger multiple modals
      const posX = Math.max(50, window.innerWidth / 2 - 300 + (idNum % 5) * 20)
      const posY = Math.max(50, window.innerHeight / 3 + (idNum % 3) * 20)

      x.set(posX)
      y.set(posY)
    }
  }, [isOpen, id, x, y])

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  if (!isOpen) return null

  // Calculate constraints to keep modal on screen
  const getConstraints = () => {
    if (!modalRef.current) return {}

    const width = isExpanded ? window.innerWidth * 0.9 : 600
    const height = isExpanded ? window.innerHeight * 0.9 : 400

    return {
      top: 0,
      left: 0,
      right: window.innerWidth - width,
      bottom: window.innerHeight - height,
    }
  }

  // Toggle expanded state
  const toggleExpanded = () => {
    const newExpandedState = !isExpanded
    setIsExpanded(newExpandedState)
    onFocus() // Bring to front when toggling expanded state

    // If expanding, center the modal on screen
    if (newExpandedState) {
      // Calculate center position for expanded modal
      const expandedWidth = window.innerWidth * 0.9
      const expandedHeight = window.innerHeight * 0.9
      const centerX = (window.innerWidth - expandedWidth) / 2
      const centerY = (window.innerHeight - expandedHeight) / 2

      // Animate to center position
      x.set(centerX)
      y.set(centerY)
    }
  }

  return (
    <div className="fixed inset-0 z-50 pointer-events-none" style={{ pointerEvents: "none", zIndex }}>
      <motion.div
        ref={modalRef}
        drag={!isExpanded} // Only allow dragging when not expanded
        dragMomentum={false}
        dragConstraints={getConstraints()}
        style={{ x, y }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        onClick={onFocus} // Bring to front when clicked
        className={`absolute bg-white dark:bg-zinc-900 rounded-lg shadow-xl border border-border overflow-hidden pointer-events-auto ${
          isExpanded ? "w-[90vw] h-[90vh]" : "w-[600px] h-[400px]"
        }`}
      >
        <div className="flex items-center justify-between p-2 bg-muted/50 border-b border-border">
          <div className="text-sm font-medium truncate flex-1 px-2">{url}</div>
          <div className="flex items-center space-x-1">
            <button
              onClick={toggleExpanded}
              className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="w-full h-[calc(100%-40px)]">
          <iframe
            src={url}
            className="w-full h-full border-0"
            title="External content"
            sandbox="allow-scripts allow-same-origin allow-popups"
            loading="lazy"
          />
        </div>
      </motion.div>
    </div>
  )
}

