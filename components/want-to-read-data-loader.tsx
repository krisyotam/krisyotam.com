"use client"

import { useWantToReadData } from "@/contexts/want-to-read-data-context"

interface WantToReadDataLoaderProps {
  children: React.ReactNode
}

export function WantToReadDataLoader({ children }: WantToReadDataLoaderProps) {
  const { loading, error } = useWantToReadData()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-2">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900"></div>
          <p className="text-muted-foreground text-sm">Loading want-to-read data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-2">
          <p className="text-red-600 text-sm">Error loading want-to-read data</p>
          <p className="text-muted-foreground text-xs">{error}</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
