"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Calendar, ExternalLink, Github, X } from "lucide-react"
import { ProjectCard, ProjectCardProps } from "./project-card"

interface ProjectModalProps {
  isOpen: boolean
  onClose: () => void
  project: ProjectCardProps
}

export function ProjectModal({ isOpen, onClose, project }: ProjectModalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    if (isOpen) {
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  if (!mounted) return null
  if (!isOpen) return null

  const formattedDate = new Date(project.completionDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const statusColor =
    project.status === "Completed"
      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      : project.status === "In Progress"
        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
        : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        className="relative max-h-[90vh] w-full max-w-3xl overflow-auto rounded-lg bg-background p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground hover:bg-muted"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </button>

        <div className="mb-6 aspect-video w-full overflow-hidden rounded-lg">
          <Image
            src={project.image || "/placeholder.svg?height=400&width=600"}
            alt={project.title}
            width={800}
            height={450}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <Badge className={`${statusColor} text-xs font-medium`}>{project.status}</Badge>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-1 h-4 w-4" />
            {formattedDate}
          </div>
          <Badge variant="outline" className="text-xs font-medium">
            {project.category}
          </Badge>
        </div>

        <h2 className="mb-4 text-2xl font-bold">{project.title}</h2>

        <div className="mb-6 space-y-4">
          <p className="text-muted-foreground">{project.description}</p>
          <p className="text-muted-foreground">{project.longDescription}</p>
        </div>

        <div className="mb-6">
          <h3 className="mb-2 text-sm font-medium text-muted-foreground">Technologies</h3>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag: string) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {project.demoUrl && (
            <Link
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              View Demo
            </Link>
          )}
          {project.repoUrl && (
            <Link
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-md border bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              <Github className="mr-2 h-4 w-4" />
              View Repository
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

