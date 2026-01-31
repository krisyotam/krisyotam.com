"use client"

import { useState } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, ExternalLink, Github, Info } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export interface ProjectCardProps {
  id: string
  title: string
  slug: string
  description: string
  longDescription: string
  image: string
  demoUrl?: string
  repoUrl?: string
  category: string
  tags: string[]
  completionDate: string
  status: string
}

export function ProjectCard({
  id,
  title,
  slug,
  description,
  longDescription,
  image,
  demoUrl,
  repoUrl,
  category,
  tags,
  completionDate,
  status,
}: ProjectCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const displayTags = tags.slice(0, 3)
  const remainingTags = tags.length > 3 ? tags.length - 3 : 0

  return (
    <div className="group relative overflow-hidden rounded-lg border bg-background transition-all hover:shadow-md">
      <div className="aspect-video w-full overflow-hidden">
        <Image
          src={image || "/placeholder.svg?height=400&width=600"}
          alt={title}
          width={600}
          height={400}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          unoptimized={image?.includes('krisyotam.com')}
        />
        <div className="absolute top-2 right-2">
          <Badge variant={status === "Completed" ? "default" : "secondary"}>{status}</Badge>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{description}</p>

        <div className="mt-3 flex flex-wrap gap-1">
          {displayTags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {remainingTags > 0 && (
            <Badge variant="outline" className="text-xs">
              +{remainingTags} more
            </Badge>
          )}
        </div>

        <div className="mt-4 flex items-center text-xs text-muted-foreground">
          <Calendar className="mr-1 h-3 w-3" />
          <span>{completionDate}</span>
        </div>

        <div className="mt-4 flex gap-2">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1">
                <Info className="mr-2 h-4 w-4" />
                View Details
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle className="text-2xl">{title}</DialogTitle>
              </DialogHeader>
              <div className="mt-4 grid gap-4">
                <div className="aspect-video overflow-hidden rounded-md">
                  <Image
                    src={image || "/placeholder.svg?height=400&width=600"}
                    alt={title}
                    width={600}
                    height={400}
                    className="h-full w-full object-cover"
                    unoptimized={image?.includes('krisyotam.com')}
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{category}</Badge>
                  {tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>{completionDate}</span>
                  </div>
                </div>

                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <p>{longDescription}</p>
                </div>

                <div className="flex gap-2">
                  {demoUrl && (
                    <Button asChild className="flex-1">
                      <a href={demoUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Demo
                      </a>
                    </Button>
                  )}
                  {repoUrl && (
                    <Button variant="outline" asChild className="flex-1">
                      <a href={repoUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="mr-2 h-4 w-4" />
                        View Code
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {demoUrl && (
            <Button variant="default" size="sm" asChild>
              <a href={demoUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}

          {repoUrl && (
            <Button variant="secondary" size="sm" asChild>
              <a href={repoUrl} target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

