"use client"

import type React from "react"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginatedCardGridProps {
  children: React.ReactNode[]
  itemsPerPage?: number
  squareButtons?: boolean
}

export function PaginatedCardGrid({ children, itemsPerPage = 4, squareButtons = false }: PaginatedCardGridProps) {
  const [currentPage, setCurrentPage] = useState(0)

  const totalItems = children.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const startIndex = currentPage * itemsPerPage
  const visibleItems = children.slice(startIndex, startIndex + itemsPerPage)

  const goToPreviousPage = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : prev))
  }

  const goToNextPage = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : prev))
  }

  const buttonRounding = squareButtons ? "rounded-none" : "rounded-full"

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">{visibleItems}</div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-4">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 0}
            className={`p-2 ${buttonRounding} bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 disabled:opacity-50`}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="text-sm">
            Page {currentPage + 1} of {totalPages}
          </div>

          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages - 1}
            className={`p-2 ${buttonRounding} bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 disabled:opacity-50`}
            aria-label="Next page"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  )
}

