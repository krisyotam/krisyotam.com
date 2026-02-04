/*
+------------------+----------------------------------------------------------+
| FILE             | art.tsx                                                  |
| ROLE             | Unified art display component with flexible dimensions   |
| OWNER            | Kris Yotam                                               |
| CREATED          | 2026-02-02                                               |
| UPDATED          | 2026-02-02                                               |
+------------------+----------------------------------------------------------+
| @type component                                                             |
| @path src/components/core/art.tsx                                           |
+------------------+----------------------------------------------------------+
| SUMMARY                                                                     |
| A flexible art display component that handles any aspect ratio.             |
| Features hover overlay with metadata and a fullscreen modal view.           |
| Replaces all the fixed-dimension art components (art-7x4, art-16x9, etc.)  |
+-----------------------------------------------------------------------------+
*/

"use client"

import { useState } from "react"
import Image from "next/image"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

// =============================================================================
// Types
// =============================================================================

export interface ArtProps {
  /** Image URL (required) */
  imageUrl: string

  /**
   * Aspect ratio as "WxH" string (e.g., "7x4", "16x9", "1x1")
   * or CSS aspect-ratio value (e.g., "7/4", "16/9", "1/1")
   * Defaults to "1x1" (square)
   */
  dimension?: string

  /** Alt text for the image */
  alt?: string

  /** Artwork title (shown on hover) */
  title?: string

  /** Artist name (shown on hover) */
  artist?: string

  /** Year created (shown on hover) */
  year?: string | number

  /** Art period/movement (shown on hover) */
  period?: string

  /** Art type/category (shown on hover) */
  type?: string

  /** Medium used (shown on hover) */
  medium?: string

  /** Physical dimensions (shown on hover) */
  dimensions?: string

  /** Additional CSS classes */
  className?: string

  /** Disable the click-to-expand modal */
  disableModal?: boolean

  /** Disable the hover overlay */
  disableHover?: boolean
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Convert dimension string to CSS aspect-ratio class
 * Supports formats: "7x4", "7/4", "16x9", "16/9", etc.
 */
function getAspectRatioClass(dimension: string): string {
  // Normalize: replace 'x' with '/'
  const normalized = dimension.replace('x', '/')

  // Common presets for Tailwind classes
  const presets: Record<string, string> = {
    "1/1": "aspect-square",
    "16/9": "aspect-video",
    "4/3": "aspect-[4/3]",
    "3/4": "aspect-[3/4]",
    "3/2": "aspect-[3/2]",
    "2/3": "aspect-[2/3]",
    "7/4": "aspect-[7/4]",
    "4/7": "aspect-[4/7]",
    "9/16": "aspect-[9/16]",
    "21/9": "aspect-[21/9]",
    "5/4": "aspect-[5/4]",
    "4/5": "aspect-[4/5]",
  }

  return presets[normalized] || `aspect-[${normalized}]`
}

// =============================================================================
// Modal Component
// =============================================================================

interface ArtModalProps {
  isOpen: boolean
  onClose: () => void
  imageUrl: string
  alt: string
}

function ArtModal({ isOpen, onClose, imageUrl, alt }: ArtModalProps) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative max-h-[90vh] max-w-[90vw] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 flex h-8 w-8 items-center justify-center rounded-full bg-background text-foreground shadow-lg hover:bg-muted z-10"
          aria-label="Close modal"
        >
          <X className="h-4 w-4" />
        </button>
        <img
          src={imageUrl}
          alt={alt}
          className="h-auto max-h-[90vh] w-auto max-w-[90vw] rounded-lg object-contain shadow-xl"
        />
      </div>
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function Art({
  imageUrl,
  dimension = "1x1",
  alt = "Artwork",
  title,
  artist,
  year,
  period,
  type,
  medium,
  dimensions,
  className,
  disableModal = false,
  disableHover = false,
}: ArtProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const aspectRatioClass = getAspectRatioClass(dimension)
  const hasMetadata = title || artist || year || period || type || medium || dimensions
  const showHover = !disableHover && hasMetadata
  const isClickable = !disableModal

  return (
    <>
      <div
        className={cn(
          "group relative overflow-hidden rounded-lg bg-background transition-all",
          isClickable && "cursor-pointer hover:shadow-lg hover:ring-2 hover:ring-primary/50",
          aspectRatioClass,
          className,
        )}
        onClick={isClickable ? () => setIsModalOpen(true) : undefined}
      >
        {/* Hover overlay with metadata */}
        {showHover && (
          <div className="absolute inset-0 z-10 flex flex-col justify-end p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
            {title && <h3 className="text-lg font-bold text-white">{title}</h3>}
            {artist && <p className="text-sm text-white/90">{artist}</p>}
            <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1">
              {year && <span className="inline-block text-xs text-white/80">{year}</span>}
              {period && <span className="inline-block text-xs text-white/80">{period}</span>}
              {type && <span className="inline-block text-xs text-white/80">{type}</span>}
              {medium && <span className="inline-block text-xs text-white/80">{medium}</span>}
              {dimensions && <span className="inline-block text-xs text-white/80">{dimensions}</span>}
            </div>
          </div>
        )}

        {/* Image */}
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={alt}
          fill
          className={cn(
            "object-cover transition-transform",
            isClickable && "group-hover:scale-105"
          )}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized
        />
      </div>

      {/* Fullscreen modal */}
      {!disableModal && (
        <ArtModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          imageUrl={imageUrl}
          alt={title || alt}
        />
      )}
    </>
  )
}

// =============================================================================
// Backward Compatibility Exports
// =============================================================================

// For MDX usage - maintains Art7x4 API
export function Art7x4(props: Omit<ArtProps, 'dimension'>) {
  return <Art {...props} dimension="7x4" />
}

export function Art4x7(props: Omit<ArtProps, 'dimension'>) {
  return <Art {...props} dimension="4x7" />
}

export function Art16x9(props: Omit<ArtProps, 'dimension'>) {
  return <Art {...props} dimension="16x9" />
}

export function Art1x1(props: Omit<ArtProps, 'dimension'>) {
  return <Art {...props} dimension="1x1" />
}
