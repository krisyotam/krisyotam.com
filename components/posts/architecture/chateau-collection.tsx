"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import Image from "next/image"
import { useState } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

interface ChateauImage {
  image: string
  view: string
}

interface ChateauCollectionProps {
  images: ChateauImage[]
  estateName: string
  location: string
  datePeriod: string
  architect: string
  patron: string
  style: string
  className?: string
  width?: string
}

export default function ChateauCollection({
  images = [],
  estateName,
  location,
  datePeriod,
  architect,
  patron,
  style,
  className,
  width,
}: ChateauCollectionProps) {
  // Ensure images is always an array, even if undefined is passed
  const safeImages = Array.isArray(images) ? images : []

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [modalImageIndex, setModalImageIndex] = useState(0)

  // Get the current image safely
  const currentImage = safeImages.length > 0 ? safeImages[currentImageIndex] : null

  const nextImage = () => {
    if (safeImages.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % safeImages.length)
    }
  }

  const prevImage = () => {
    if (safeImages.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length)
    }
  }

  const openModal = () => {
    setModalImageIndex(currentImageIndex)
    setShowModal(true)
  }

  const closeModal = () => setShowModal(false)

  const nextModalImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (safeImages.length > 1) {
      setModalImageIndex((prev) => (prev + 1) % safeImages.length)
    }
  }

  const prevModalImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (safeImages.length > 1) {
      setModalImageIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length)
    }
  }

  return (
    <>
      <div
        className={cn(
          "!w-full !max-w-2xl !flex-shrink-0 !bg-white !border !border-gray-200 !shadow-sm",
          "!font-sans !antialiased !overflow-hidden",
          "dark:!bg-[#1A1A1A] dark:!border-zinc-800",
          className,
        )}
        style={width ? { width } : undefined}
      >
        <div className="!flex !flex-col">
          <div className="!relative">
            <div
              className="!aspect-[16/9] !overflow-hidden !bg-gray-100 !cursor-pointer dark:!bg-black"
              onClick={openModal}
            >
              <Image
                src={currentImage?.image || "/placeholder.svg"}
                alt={`${estateName} - ${currentImage?.view || "View"}`}
                width={640}
                height={360}
                className="!object-cover !w-full !h-full"
              />
            </div>

            {safeImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    prevImage()
                  }}
                  className="!absolute !left-2 !top-1/2 !-translate-y-1/2 !bg-white/70 !rounded-full !p-1 !shadow-sm !hover:bg-white dark:!bg-gray-800/70 dark:!hover:bg-gray-800"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="!h-4 !w-4 !text-gray-700 dark:!text-gray-300" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    nextImage()
                  }}
                  className="!absolute !right-2 !top-1/2 !-translate-y-1/2 !bg-white/70 !rounded-full !p-1 !shadow-sm !hover:bg-white dark:!bg-gray-800/70 dark:!hover:bg-gray-800"
                  aria-label="Next image"
                >
                  <ChevronRight className="!h-4 !w-4 !text-gray-700 dark:!text-gray-300" />
                </button>
              </>
            )}
          </div>

          <div className="!p-3 !space-y-1">
            <div className="!flex !justify-between !items-center !text-xs">
              <h2 className="!font-medium !text-gray-900 dark:!text-gray-100">{estateName}</h2>
              <span className="!text-gray-600 dark:!text-gray-400">{location}</span>
            </div>

            <div className="!flex !flex-wrap !justify-between !text-[10px] !text-gray-600 dark:!text-gray-400">
              <span>{datePeriod}</span>
              <span>{style}</span>
            </div>

            <div className="!flex !flex-wrap !justify-between !text-[10px] !text-gray-600 dark:!text-gray-400">
              <span>Architect: {architect}</span>
              <span>Patron: {patron}</span>
            </div>

            <div className="!flex !justify-between !items-center !text-[10px] !text-gray-500 dark:!text-gray-400">
              <span className="!italic">View: {currentImage?.view || "Unknown"}</span>
              {safeImages.length > 1 && (
                <span className="!text-right !text-gray-500 dark:!text-gray-400">
                  {currentImageIndex + 1}/{safeImages.length}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div
          className="!fixed !inset-0 !z-50 !flex !items-center !justify-center !bg-black/60 !backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="!relative !w-[90vw] !h-[80vh] !flex !items-center !justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="!absolute !top-4 !right-4 !z-10 !bg-black/50 !rounded-full !p-2 !text-white"
              aria-label="Close modal"
            >
              <X className="!h-5 !w-5" />
            </button>

            {safeImages.length > 1 && (
              <>
                <button
                  onClick={prevModalImage}
                  className="!absolute !left-4 !top-1/2 !-translate-y-1/2 !z-10 !bg-black/50 !rounded-full !p-2 !text-white"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="!h-6 !w-6" />
                </button>

                <button
                  onClick={nextModalImage}
                  className="!absolute !right-4 !top-1/2 !-translate-y-1/2 !z-10 !bg-black/50 !rounded-full !p-2 !text-white"
                  aria-label="Next image"
                >
                  <ChevronRight className="!h-6 !w-6" />
                </button>
              </>
            )}

            <div className="!relative !w-full !aspect-[16/9] !max-h-full">
              <Image
                src={safeImages[modalImageIndex]?.image || "/placeholder.svg"}
                alt={`${estateName} - ${safeImages[modalImageIndex]?.view || "View"}`}
                fill
                className="!object-cover"
                sizes="90vw"
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

