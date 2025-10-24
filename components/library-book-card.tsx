"use client"

import { Star } from "lucide-react"
import Image from "next/image"
import { Card } from "@/components/ui/card"

interface LibraryBookCardProps {
  coverUrl: string
  title: string
  subtitle?: string
  author: string
  rating: number
  onClick?: () => void
}

export function LibraryBookCard({ coverUrl, title, subtitle, author, rating, onClick }: LibraryBookCardProps) {
  return (
    <Card
      className="flex overflow-hidden transition-colors hover:bg-accent/50 group h-[140px] cursor-pointer"
      onClick={onClick}
    >
      <div className="w-[100px] bg-muted p-4">
        <div className="relative h-[100px] w-full">
          <Image src={coverUrl || "/placeholder.svg"} alt={title} fill className="object-cover rounded-sm" />
        </div>
      </div>
      <div className="flex-1 p-4 overflow-hidden">
        <div className="space-y-1.5">
          <h3 className="font-medium leading-tight line-clamp-2">{title}</h3>
          {subtitle && <p className="text-sm text-muted-foreground line-clamp-1">{subtitle}</p>}
          <p className="text-sm text-muted-foreground truncate">by {author}</p>
        </div>
        {rating > 0 && (
          <div className="flex items-center gap-1.5 mt-2">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="text-sm text-muted-foreground">{rating}/5</span>
          </div>
        )}
      </div>
    </Card>
  )
}

