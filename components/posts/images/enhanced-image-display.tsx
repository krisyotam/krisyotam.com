"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react"
import Image from "next/image"

interface ImageItem {
  src: string
  alt: string
  caption?: string
}

interface EnhancedImageDisplayProps {
  images: ImageItem[] | ImageItem
  className?: string
}

export function EnhancedImageDisplay({ images, className = "" }: EnhancedImageDisplayProps) {
  const imagesArray = Array.isArray(images) ? images : [images]
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const modalRef = useRef<HTMLDivElement>(null)
  const hasMultipleImages = imagesArray.length > 1

  const openModal = (index: number) => {
    setCurrentImageIndex(index)
    setIsModalOpen(true)
    document.body.style.overflow = "hidden"
  }

  const closeModal = () => {
    setIsModalOpen(false)
    document.body.style.overflow = "auto"
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === imagesArray.length - 1 ? 0 : prev + 1))
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? imagesArray.length - 1 : prev - 1))
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isModalOpen) return

      switch (e.key) {
        case "ArrowRight":
          nextImage()
          break
        case "ArrowLeft":
          prevImage()
          break
        case "Escape":
          closeModal()
          break
        default:
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isModalOpen])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        closeModal()
      }
    }

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isModalOpen])

  return (
    <>
      <div className={`${className} mb-8`}>
        <div className="relative group">
          <div
            className="relative overflow-hidden cursor-pointer transition-transform duration-300 ease-in-out group-hover:scale-[1.02]"
            onClick={() => openModal(currentImageIndex)}
          >
            <div className="relative aspect-[16/9]">
              <Image
                src={imagesArray[currentImageIndex].src || "/placeholder.svg"}
                alt={imagesArray[currentImageIndex].alt}
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
              <div className="bg-black/70 text-white px-3 py-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center">
                <ZoomIn className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Click to enlarge</span>
              </div>
            </div>
          </div>
          {imagesArray[currentImageIndex].caption && (
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {imagesArray[currentImageIndex].caption}
            </div>
          )}
        </div>

        {hasMultipleImages && (
          <div className="flex justify-center mt-3 gap-1.5">
            {imagesArray.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentImageIndex ? "bg-gray-800 dark:bg-gray-200" : "bg-gray-300 dark:bg-gray-700"
                }`}
                onClick={() => setCurrentImageIndex(index)}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
          <div ref={modalRef} className="relative w-full h-full flex items-center justify-center">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 p-2 text-white bg-black/50 rounded-full hover:bg-black/70 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="relative w-full h-full flex items-center justify-center">
              <div className="relative max-w-full max-h-full">
                <Image
                  src={imagesArray[currentImageIndex].src || "/placeholder.svg"}
                  alt={imagesArray[currentImageIndex].alt}
                  width={1200}
                  height={675}
                  className="object-contain max-h-[90vh]"
                  priority
                />

                {imagesArray[currentImageIndex].caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white p-4">
                    <p className="text-center">{imagesArray[currentImageIndex].caption}</p>
                  </div>
                )}
              </div>
            </div>

            {hasMultipleImages && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>

                <div className="absolute top-4 left-4 text-white bg-black/50 px-3 py-1 rounded-full">
                  {currentImageIndex + 1} of {imagesArray.length}
                </div>

                <div className="absolute bottom-16 left-0 right-0 flex justify-center gap-2">
                  {imagesArray.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2.5 h-2.5 rounded-full transition-colors ${
                        index === currentImageIndex ? "bg-white" : "bg-white/50"
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
