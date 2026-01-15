"use client"

import { cn } from "@/lib/utils"
import Image from "next/image"
import { useState } from "react"
import { X } from "lucide-react"

interface ChateauProps {
  image: string
  view: string
  estateName: string
  location: string
  datePeriod: string
  architect: string
  patron: string
  style: string
  className?: string
  width?: string
}

export default function Chateau({
  image,
  view,
  estateName,
  location,
  datePeriod,
  architect,
  patron,
  style,
  className,
  width,
}: ChateauProps) {
  const [showModal, setShowModal] = useState(false)

  const openModal = () => setShowModal(true)
  const closeModal = () => setShowModal(false)

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
          <div
            className="!aspect-[16/9] !overflow-hidden !bg-gray-100 !cursor-pointer dark:!bg-black"
            onClick={openModal}
          >
            <Image
              src={image || "/placeholder.svg"}
              alt={`${estateName} - ${view}`}
              width={640}
              height={360}
              className="!object-cover !w-full !h-full"
              unoptimized={image?.includes('krisyotam.com')}
            />
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

            <div className="!text-[10px] !text-gray-500 !italic dark:!text-gray-400">View: {view}</div>
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
            <div className="!relative !w-full !aspect-[16/9] !max-h-full">
              <Image
                src={image || "/placeholder.svg"}
                alt={`${estateName} - ${view}`}
                fill
                className="!object-cover"
                sizes="90vw"
                unoptimized={image?.includes('krisyotam.com')}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

