"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"

type Collection = {
  id: string
  title: string
  description: string
  books: {
    id: string
    title: string
    author: string
    cover: string
  }[]
}

export function OwnedCollectionsContent() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCollections() {
      try {
        const response = await fetch("/api/owned-collections")
        const data = await response.json()

        if (data && Array.isArray(data.collections)) {
          setCollections(data.collections)
        } else if (Array.isArray(data)) {
          setCollections(data)
        } else {
          console.error("Unexpected data format:", data)
          setError("Received invalid data format from API")
          setCollections([])
        }
      } catch (error) {
        console.error("Error fetching collections:", error)
        setError("Failed to load collections")
        setCollections([])
      } finally {
        setLoading(false)
      }
    }

    fetchCollections()
  }, [])

  if (loading) {
    return <div className="py-8 text-center">Loading collections...</div>
  }

  if (error) {
    return <div className="py-8 text-center text-red-500">{error}</div>
  }

  if (collections.length === 0) {
    return <div className="py-8 text-center">No collections found.</div>
  }

  return (
    <div className="grid grid-cols-1 gap-4 py-4">
      {collections.map((collection) => (
        <Link key={collection.id} href={`/library/collections/${collection.id}`}>
          <Card className="p-4 hover:bg-accent/50 transition-colors cursor-pointer">
            <h3 className="font-medium text-lg">{collection.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{collection.description}</p>
            <p className="text-sm mt-2">{collection.books.length} books</p>
          </Card>
        </Link>
      ))}
    </div>
  )
}

