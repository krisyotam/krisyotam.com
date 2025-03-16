"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Loader2, AlertTriangle, Clock, Star, BookOpen, Film } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface CollectionModalProps {
  isOpen: boolean
  onClose: () => void
  collection: {
    id: string
    title: string
    description: string
    tags: string[]
    entries: string[]
  }
  type: "anime" | "manga"
}

export function CollectionModal({ isOpen, onClose, collection, type }: CollectionModalProps) {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!isOpen || !collection) return

    async function fetchCollectionItems() {
      try {
        setLoading(true)
        setError("")

        // Ensure we have entries to process
        if (!collection.entries || !Array.isArray(collection.entries) || collection.entries.length === 0) {
          setItems([])
          setLoading(false)
          return
        }

        // Fetch details for each item
        const itemPromises = collection.entries.map(async (id: string) => {
          const endpoint = type === "anime" ? `/api/anime-entry?id=${id}` : `/api/manga-entry?id=${id}`
          const response = await fetch(endpoint)

          if (!response.ok) {
            console.error(`Failed to fetch ${type} with ID ${id}: ${response.status}`)
            return null
          }

          return await response.json()
        })

        const results = await Promise.all(itemPromises)
        setItems(results.filter(Boolean))
      } catch (err: any) {
        console.error(`Error fetching ${type} collection items:`, err)
        setError(err.message || `Failed to load ${type} collection items`)
      } finally {
        setLoading(false)
      }
    }

    fetchCollectionItems()
  }, [isOpen, collection, type])

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{collection?.title}</DialogTitle>
          <DialogDescription className="mt-2 text-base">{collection?.description}</DialogDescription>

          <div className="flex flex-wrap gap-1 mt-4">
            {collection?.tags?.map((tag: string, index: number) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading {type} entries...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 my-4">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-lg text-red-800 dark:text-red-400">Error Loading Collection</h3>
                <p className="text-red-700 dark:text-red-300 mt-2">{error}</p>
              </div>
            </div>
          </div>
        ) : (
          <AnimatePresence>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {items.length > 0 ? (
                items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {type === "anime" ? <AnimeItem anime={item} /> : <MangaItem manga={item} />}
                  </motion.div>
                ))
              ) : (
                <p className="col-span-full text-center text-muted-foreground py-8">
                  No items found in this collection.
                </p>
              )}
            </div>
          </AnimatePresence>
        )}
      </DialogContent>
    </Dialog>
  )
}

function AnimeItem({ anime }: { anime: any }) {
  return (
    <div className="flex bg-card dark:bg-[#1a1a1a] border dark:border-gray-800 rounded-lg overflow-hidden h-full">
      <div className="w-1/3 flex-shrink-0">
        <img
          src={anime.image || "/placeholder.svg"}
          alt={anime.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg?height=300&width=200"
          }}
        />
      </div>
      <div className="w-2/3 p-4 flex flex-col">
        <h3 className="font-bold text-base line-clamp-1">{anime.title}</h3>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{anime.synopsis}</p>

        <div className="mt-auto pt-3 grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <span>
              {anime.episodes} episode{anime.episodes !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 text-amber-500" />
            <span>{anime.rating || "N/A"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Film className="h-3 w-3 text-muted-foreground" />
            <span>{anime.studio}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">{anime.year}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function MangaItem({ manga }: { manga: any }) {
  return (
    <div className="flex bg-card dark:bg-[#1a1a1a] border dark:border-gray-800 rounded-lg overflow-hidden h-full">
      <div className="w-1/3 flex-shrink-0">
        <img
          src={manga.image || "/placeholder.svg"}
          alt={manga.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg?height=300&width=200"
          }}
        />
      </div>
      <div className="w-2/3 p-4 flex flex-col">
        <h3 className="font-bold text-base line-clamp-1">{manga.title}</h3>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{manga.synopsis}</p>

        <div className="mt-auto pt-3 grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <BookOpen className="h-3 w-3 text-muted-foreground" />
            <span>
              {manga.volumes} volume{manga.volumes !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 text-amber-500" />
            <span>{manga.rating || "N/A"}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">{manga.author}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">{manga.year}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

