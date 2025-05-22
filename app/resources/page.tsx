"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/page-header"
import ResourcesTable from "@/components/resources-table"

interface Resource {
  id: string
  title: string
  url: string
  description: string
  category: string
  tags: string[]
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchResources() {
      try {
        const response = await fetch("/api/resources")

        if (!response.ok) {
          throw new Error(`Failed to fetch resources: ${response.status}`)
        }

        const data = await response.json()
        setResources(data)
      } catch (error) {
        console.error("Error fetching resources:", error)
        setError("Failed to load resources. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchResources()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background text-foreground">
        <p className="text-lg">Loading resources...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background text-foreground">
        <div className="text-center">
          <p className="text-lg text-red-500 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-none"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <PageHeader
          title="Resources"
          subtitle="Curated collection of valuable research and learning resources"
          date={new Date().toISOString()}
          status="In Progress"
          confidence="certain"
          importance={8}
          preview="A comprehensive collection of academic resources, research tools, learning platforms, and reference materials to support scholarly pursuits and intellectual exploration."
        />

        <div className="mt-8">
          {resources.length > 0 ? (
            <ResourcesTable resources={resources} />
          ) : (
            <p className="text-center py-8">No resources found.</p>
          )}
        </div>
      </div>
    </div>
  )
}
