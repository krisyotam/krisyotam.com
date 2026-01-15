"use client"

import { cn } from "@/lib/utils"
import Image from "next/image"
import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface HauteCoutureCollectionProps {
  images: string[]
  collectionName: string
  designer: string
  fashionHouse: string
  year: number
  season: string
  theme: string
  className?: string
}

export default function HauteCoutureCollection({
  images,
  collectionName,
  designer,
  fashionHouse,
  year,
  season,
  theme,
  className,
}: HauteCoutureCollectionProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div
      className={cn(
        "!w-80 !flex-shrink-0 !p-8 !bg-white dark:!bg-[#1A1A1A] !border !border-gray-200 dark:!border-zinc-800 !shadow-sm",
        "!font-sans !antialiased",
        className,
      )}
    >
      <div className="!space-y-6">
        <div className="!relative">
          <div className="!aspect-[2/3] !overflow-hidden !rounded-md !bg-gray-100 dark:!bg-[#1A1A1A] !mx-auto">
            <Image
              src={images[currentImageIndex] || "/placeholder.svg"}
              alt={`${collectionName} - Look ${currentImageIndex + 1}`}
              width={240}
              height={360}
              className="!object-cover !w-full !h-full"
              unoptimized={images[currentImageIndex]?.includes('krisyotam.com')}
            />
          </div>

          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="!absolute !left-0 !top-1/2 !-translate-y-1/2 !-ml-4 !bg-white dark:!bg-zinc-800 !rounded-full !p-1 !shadow-sm !border !border-gray-200 dark:!border-zinc-700 hover:!bg-gray-50 dark:hover:!bg-zinc-700"
                aria-label="Previous image"
              >
                <ChevronLeft className="!h-5 !w-5 !text-gray-700 dark:!text-gray-300" />
              </button>

              <button
                onClick={nextImage}
                className="!absolute !right-0 !top-1/2 !-translate-y-1/2 !-mr-4 !bg-white dark:!bg-zinc-800 !rounded-full !p-1 !shadow-sm !border !border-gray-200 dark:!border-zinc-700 hover:!bg-gray-50 dark:hover:!bg-zinc-700"
                aria-label="Next image"
              >
                <ChevronRight className="!h-5 !w-5 !text-gray-700 dark:!text-gray-300" />
              </button>
            </>
          )}
        </div>

        <div className="!space-y-2 !text-center">
          <h2 className="!text-2xl !font-serif !tracking-tight !text-gray-900 dark:!text-gray-100 !m-0">
            {collectionName}
          </h2>
          <div className="!text-sm !text-gray-600 dark:!text-gray-400 !font-light">
            {designer} for {fashionHouse}
          </div>
        </div>

        <div className="!pt-4 !border-t !border-gray-200 dark:!border-gray-700 !text-xs !text-gray-500 dark:!text-gray-400 !font-light !space-y-2">
          <div className="!grid !grid-cols-2 !gap-4">
            <div>Season: {season}</div>
            <div className="!text-right">Year: {year}</div>
          </div>
          <div className="!flex !justify-between !items-center !mt-2">
            <div className="!text-left">{theme}</div>
            {images.length > 1 && (
              <div className="!text-right">
                Look {currentImageIndex + 1} of {images.length}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

