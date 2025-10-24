"use client"

import React from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Calendar, MapPin, Tag } from "lucide-react"
import { formatDate } from "@/utils/date-formatter"

export interface Memory {
  id: string
  title: string
  description: string
  ghostSlug: string
  image?: string
  category: string
  tags: string[]
  dateStarted: string
  status: "Recent" | "Ongoing" | "Past"
  location?: string | null
}

interface MemoryCardProps {
  memory: Memory
  onViewDetails: (memory: Memory) => void
}

export function MemoryCard({ memory, onViewDetails }: MemoryCardProps) {
  // Safe fallback for image
  const imageSrc = memory.image || "/placeholder.svg?height=300&width=400"

  // Safe status color mapping
  const statusColorMap = {
    Recent: "bg-green-100 text-green-800",
    Ongoing: "bg-blue-100 text-blue-800",
    Past: "bg-gray-100 text-gray-800",
  }

  // Safely get status color with fallback
  const statusColor = statusColorMap[memory.status] || "bg-gray-100 text-gray-800"

  // Safely format the date with error handling
  const formattedDate = React.useMemo(() => {
    try {
      return memory.dateStarted ? formatDate(memory.dateStarted) : "Unknown date"
    } catch (error) {
      console.error("Error formatting date:", error)
      return "Invalid date"
    }
  }, [memory.dateStarted])

  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-48 w-full overflow-hidden">
        {/* Use next/image with error handling */}
        <div className="relative h-full w-full">
          <Image
            src={imageSrc || "/placeholder.svg"}
            alt={memory.title || "Memory image"}
            fill
            className="object-cover"
            onError={(e) => {
              // Fallback to placeholder on error
              const target = e.target as HTMLImageElement
              target.src = "/placeholder.svg?height=300&width=400"
            }}
          />
        </div>
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>{memory.status}</span>
        </div>
      </div>

      <CardHeader className="pb-2">
        <h3 className="text-xl font-bold line-clamp-2">{memory.title || "Untitled Memory"}</h3>
      </CardHeader>

      <CardContent className="flex-grow">
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">{memory.description || "No description available."}</p>

        <div className="flex items-center text-sm text-gray-500 mb-2">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{formattedDate}</span>
        </div>

        {memory.location && (
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{memory.location}</span>
          </div>
        )}

        {memory.tags && memory.tags.length > 0 && (
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <Tag className="h-4 w-4 mr-1" />
            <div className="flex flex-wrap gap-1 mt-1">
              {memory.tags.slice(0, 3).map((tag, index) => (
                <Badge key={`${memory.id}-tag-${index}`} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {memory.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{memory.tags.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0">
        <Button onClick={() => onViewDetails(memory)} variant="default" className="w-full">
          View Details
        </Button>
      </CardFooter>
    </Card>
  )
}

