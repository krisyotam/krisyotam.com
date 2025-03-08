"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ArtModalProps {
  isOpen: boolean
  onClose: () => void
  imageUrl: string
  alt: string
}

export function ArtModal({ isOpen, onClose, imageUrl, alt }: ArtModalProps) {
  const [animationClass, setAnimationClass] = useState("")

  useEffect(() => {
    if (isOpen) {
      setAnimationClass("opacity-100 scale-100")
      document.body.style.overflow = "hidden"
    } else {
      setAnimationClass("opacity-0 scale-95")
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className={cn("relative max-h-[90vh] max-w-[90vw] transition-all duration-300", animationClass)}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 flex h-8 w-8 items-center justify-center rounded-full bg-background text-foreground shadow-lg hover:bg-muted"
          aria-label="Close modal"
        >
          <X className="h-4 w-4" />
        </button>
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={alt}
          className="h-auto max-h-[90vh] w-auto max-w-[90vw] rounded-lg object-contain shadow-xl"
        />
      </div>
    </div>
  )
}

