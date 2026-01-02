"use client"

import React from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Calendar, MapPin } from "lucide-react"
import { formatDate } from "@/lib/date"
import type { Memory } from "./memory-card"

interface MemoryModalProps {
  memory: Memory | null
  isOpen: boolean
  onClose: () => void
}

export function MemoryModal({ memory, isOpen, onClose }: MemoryModalProps) {
  const [formattedDate, setFormattedDate] = React.useState<string>("Unknown date")

  React.useEffect(() => {
    if (!memory) return

    try {
      setFormattedDate(memory.dateStarted ? formatDate(memory.dateStarted) : "Unknown date")
    } catch (error) {
      console.error("Error formatting date:", error)
      setFormattedDate("Invalid date")
    }
  }, [memory])

  if (!memory) return null

  // Safe fallback for image
  const imageSrc = memory.image || "/placeholder.svg?height=600&width=800"

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{memory.title}</DialogTitle>
          <DialogDescription className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-1" />
            <span className="mr-4">{formattedDate}</span>
            {memory.location && (
              <>
                <MapPin className="h-4 w-4 mr-1" />
                <span>{memory.location}</span>
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="relative h-64 w-full my-4 overflow-hidden rounded-md">
          <Image
            src={imageSrc || "/placeholder.svg"}
            alt={memory.title}
            fill
            className="object-cover"
            onError={(e) => {
              // Fallback to placeholder on error
              const target = e.target as HTMLImageElement
              target.src = "/placeholder.svg?height=600&width=800"
            }}
          />
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-700">{memory.description}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Category</h3>
            <Badge variant="outline" className="text-sm">
              {memory.category}
            </Badge>
          </div>

          {memory.tags && memory.tags.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {memory.tags.map((tag, index) => (
                  <Badge key={`modal-${memory.id}-tag-${index}`} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold mb-2">Status</h3>
            <Badge
              variant={memory.status === "Recent" ? "default" : memory.status === "Ongoing" ? "secondary" : "outline"}
            >
              {memory.status}
            </Badge>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

