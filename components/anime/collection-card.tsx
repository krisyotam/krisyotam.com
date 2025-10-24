"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Folder, ChevronRight } from "lucide-react"

interface CollectionCardProps {
  title: string
  description: string
  tags: string[]
  itemCount?: number
  onClick?: () => void
}

export function CollectionCard({ title, description, tags, itemCount, onClick }: CollectionCardProps) {
  return (
    <Card
      className="transition-colors hover:bg-accent/50 group h-full flex flex-col cursor-pointer"
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Folder className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-base">{title}</CardTitle>
          </div>
          {itemCount !== undefined && (
            <Badge variant="outline" className="text-xs">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">{description}</p>
      </CardContent>
      <CardFooter className="flex flex-col items-start pt-0">
        <div className="flex flex-wrap gap-1 mb-2">
          {tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        {onClick && (
          <div className="flex items-center text-xs text-primary mt-1 group-hover:underline">
            <span>View collection</span>
            <ChevronRight className="h-3 w-3 ml-1" />
          </div>
        )}
      </CardFooter>
    </Card>
  )
}

