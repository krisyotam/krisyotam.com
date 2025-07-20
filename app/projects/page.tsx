"use client"

import { useState } from "react"
import { ProjectCard } from "@/components/project-card"
import { Button } from "@/components/ui/button"
import projectsData from "@/data/projects.json"
import { PageHeader } from "@/components/page-header"
import { PageDescription } from "@/components/posts/typography/page-description"

// Add projects page metadata
const projectsPageData = {
  title: "Projects",
  subtitle: "Personal and Professional Work",
  date: new Date().toISOString(),
  preview: "A showcase of my development projects, design work, and creative endeavors across various domains.",
  status: "In Progress" as const,
  confidence: "certain" as const,
  importance: 9,
}

export const dynamic = "force-dynamic"

export default function ProjectsPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto p-8 md:p-16 lg:p-24">
        {/* Add the PageHeader component */}
        <PageHeader
          title={projectsPageData.title}
          subtitle={projectsPageData.subtitle}
          date={projectsPageData.date}
          preview={projectsPageData.preview}
          status={projectsPageData.status}
          confidence={projectsPageData.confidence}
          importance={projectsPageData.importance}
        />

        <ProjectList initialProjects={projectsData.projects} />
      </div>
      
      {/* PageDescription component */}
      <PageDescription
        title="About My Projects"
        description="This page showcases my personal and professional projects. Each project represents a unique challenge I've tackled and a set of skills I've developed. From web applications to design systems, these projects demonstrate my approach to problem-solving and my technical capabilities. I believe in building with purpose and sharing my work openly. Feel free to explore the projects, filter by category, or search for specific technologies. Each project card provides a glimpse into the work, and you can click 'View Details' to learn more about any project that catches your interest."
      />
    </div>
  )
}

interface ProjectListProps {
  initialProjects: Array<{
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
  }>
}

function ProjectList({ initialProjects }: ProjectListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [projects, setProjects] = useState(initialProjects)

  // Get unique categories from projects
  const categories = Array.from(new Set(initialProjects.map((project) => project.category)))

  // Filter projects based on search query and active category
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      searchQuery === "" ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = activeCategory === "All" || project.category === activeCategory

    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      <div className="relative">
        <input
          type="text"
          placeholder="Search projects by title, description, or tags..."
          className="w-full rounded-md border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onChange={(e) => setSearchQuery(e.target.value)}
          value={searchQuery}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          key="All"
          variant={activeCategory === "All" ? "default" : "secondary"}
          onClick={() => setActiveCategory("All")}
        >
          All
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={category === activeCategory ? "default" : "secondary"}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {filteredProjects.map((project) => (
          <ProjectCard
            key={project.id}
            id={project.id}
            title={project.title}
            slug={project.slug}
            description={project.description}
            longDescription={project.longDescription}
            image={project.image}
            demoUrl={project.demoUrl}
            repoUrl={project.repoUrl}
            category={project.category}
            tags={project.tags}
            completionDate={project.completionDate}
            status={project.status}
          />
        ))}
        {filteredProjects.length === 0 && (
          <p className="text-center text-muted-foreground py-8 col-span-2">No projects found matching your criteria.</p>
        )}
      </div>
    </div>
  )
}

