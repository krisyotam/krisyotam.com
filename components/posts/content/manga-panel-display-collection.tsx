"use client"

import { cn } from "@/lib/utils"
import Image from "next/image"
import { useState } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

interface PanelItem {
  image: string
  pageName: string
}

interface MangaPanelDisplayCollectionProps {
  panels: PanelItem[]
  mangaTitle: string
  layout: "horizontal" | "vertical"
  artist?: string
  chapter?: string
  className?: string
  width?: string
}

export default function MangaPanelDisplayCollection({
  panels = [],
  mangaTitle,
  layout = "vertical",
  artist,
  chapter,
  className,
  width,
}: MangaPanelDisplayCollectionProps) {
  // Ensure panels is always an array, even if undefined is passed
  const safePanels = Array.isArray(panels) ? panels : []

  const [currentPanelIndex, setCurrentPanelIndex] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)

  // Get the current panel safely
  const currentPanel = safePanels.length > 0 ? safePanels[currentPanelIndex] : null

  const nextPanel = () => {
    if (safePanels.length > 1) {
      setCurrentPanelIndex((prev) => (prev + 1) % safePanels.length)
    }
  }

  const prevPanel = () => {
    if (safePanels.length > 1) {
      setCurrentPanelIndex((prev) => (prev - 1 + safePanels.length) % safePanels.length)
    }
  }

  const openModal = () => setModalOpen(true)
  const closeModal = () => setModalOpen(false)

  return (
    <>
      <div
        className={cn(
          "!flex-shrink-0 !bg-white dark:!bg-[#1A1A1A] !border !border-gray-200 dark:!border-zinc-800 !shadow-sm",
          "!font-sans !antialiased !overflow-hidden !w-full",
          width ? `!${width}` : layout === "horizontal" ? "!max-w-2xl" : "!max-w-sm",
          className,
        )}
      >
        <div className="!flex !flex-col">
          <div className="!relative">
            <div
              className={cn(
                "!overflow-hidden !bg-gray-100 dark:!bg-black !cursor-pointer",
                layout === "horizontal" ? "!aspect-[16/9]" : "!aspect-[2/3]",
              )}
              onClick={openModal}
            >
              <Image
                src={currentPanel?.image || "/placeholder.svg"}
                alt={`${mangaTitle} - ${currentPanel?.pageName || "Panel"}`}
                width={layout === "horizontal" ? 640 : 240}
                height={layout === "horizontal" ? 360 : 360}
                className="!object-cover !w-full !h-full"
              />
            </div>

            {safePanels.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    prevPanel()
                  }}
                  className="!absolute !left-2 !top-1/2 !-translate-y-1/2 !bg-white/70 dark:!bg-black/70 !rounded-full !p-1 !shadow-sm hover:!bg-white dark:hover:!bg-black !z-10"
                  aria-label="Previous panel"
                >
                  <ChevronLeft className="!h-4 !w-4 !text-gray-700 dark:!text-gray-300" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    nextPanel()
                  }}
                  className="!absolute !right-2 !top-1/2 !-translate-y-1/2 !bg-white/70 dark:!bg-black/70 !rounded-full !p-1 !shadow-sm hover:!bg-white dark:hover:!bg-black !z-10"
                  aria-label="Next panel"
                >
                  <ChevronRight className="!h-4 !w-4 !text-gray-700 dark:!text-gray-300" />
                </button>
              </>
            )}
          </div>

          <div className="!p-3 !space-y-1">
            <div className="!flex !justify-between !items-center !text-xs">
              <h2 className="!font-medium !text-gray-900 dark:!text-gray-100">{mangaTitle}</h2>
              <span className="!text-gray-600 dark:!text-gray-400">{currentPanel?.pageName || "Page"}</span>
            </div>

            <div className="!flex !justify-between !items-center !text-[10px] !text-gray-500 dark:!text-gray-400">
              <div className="!flex !gap-2">
                {artist && <span>{artist}</span>}
                {chapter && <span>{chapter}</span>}
              </div>
              {safePanels.length > 1 && (
                <span className="!text-right !text-gray-500 dark:!text-gray-400">
                  {currentPanelIndex + 1}/{safePanels.length}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          className="!fixed !inset-0 !bg-black/60 !backdrop-blur-sm !z-50 !flex !items-center !justify-center !p-4"
          onClick={closeModal}
        >
          <div
            className={cn(
              "!relative !bg-gray-100 dark:!bg-black !overflow-hidden",
              layout === "horizontal"
                ? "!aspect-[16/9] !w-[95vw] !max-h-[90vh]"
                : "!aspect-[2/3] !h-[90vh] !max-h-[90vh]",
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="!absolute !top-2 !right-2 !bg-black/50 !text-white !rounded-full !p-1 !z-10"
              onClick={closeModal}
            >
              <X className="!h-6 !w-6" />
            </button>
            <Image
              src={currentPanel?.image || "/placeholder.svg"}
              alt={`${mangaTitle} - ${currentPanel?.pageName || "Panel"}`}
              fill
              className="!object-cover"
            />

            {safePanels.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    prevPanel()
                  }}
                  className="!absolute !left-4 !top-1/2 !-translate-y-1/2 !bg-black/50 !text-white !rounded-full !p-2 !z-10"
                  aria-label="Previous panel in modal"
                >
                  <ChevronLeft className="!h-6 !w-6" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    nextPanel()
                  }}
                  className="!absolute !right-4 !top-1/2 !-translate-y-1/2 !bg-black/50 !text-white !rounded-full !p-2 !z-10"
                  aria-label="Next panel in modal"
                >
                  <ChevronRight className="!h-6 !w-6" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

