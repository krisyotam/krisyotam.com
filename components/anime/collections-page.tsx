"use client"

import { useState, useEffect } from "react"
import { Loader2, AlertTriangle, BookOpen, Film, Tag } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CollectionModal } from "./collection-modal"
import { motion } from "framer-motion"
import { ProfileHeader } from "./profile-header" // Fixed import path

interface Collection {
  id: string
  title: string
  description: string
  tags: string[]
  image: string
  entries: string[]
}

interface CollectionsPageProps {
  profile: any
  activeTab?: "anime" | "manga"
}

export function CollectionsPage({ profile, activeTab = "anime" }: CollectionsPageProps) {
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentTab, setCurrentTab] = useState<"anime" | "manga">(activeTab)

  useEffect(() => {
    async function fetchCollections() {
      try {
        setLoading(true)
        setError("")

        const endpoint = currentTab === "anime" ? "/api/anime-collections" : "/api/manga-collections"
        const response = await fetch(endpoint)

        if (!response.ok) {
          throw new Error(`Failed to fetch collections: ${response.status}`)
        }

        const data = await response.json()
        setCollections(data)
      } catch (err: any) {
        console.error("Error fetching collections:", err)
        setError(err.message || "Failed to load collections")
      } finally {
        setLoading(false)
      }
    }

    fetchCollections()
  }, [currentTab])

  const handleViewCollection = (collection: Collection) => {
    setSelectedCollection(collection)
    setIsModalOpen(true)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading collections...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 my-8">
        <div className="flex items-start gap-4">
          <AlertTriangle className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-lg text-red-800 dark:text-red-400">Error Loading Collections</h3>
            <p className="text-red-700 dark:text-red-300 mt-2">{error}</p>
            <p className="text-red-600/80 dark:text-red-300/80 mt-4 text-sm">
              Please try refreshing the page or check your network connection.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <ProfileHeader profile={profile} activeTab={currentTab} isCollectionsPage={true} />

      {/* Disclaimer */}
      <Alert className="bg-card dark:bg-[#1a1a1a] border dark:border-gray-800">
        <AlertDescription className="text-base">
          As an anime reviewer and writer, I've created curated lists of manga and anime to help people discover the
          greatest works and interesting titles across various sub-genres. Each collection represents a carefully
          selected group of titles that share thematic elements, stylistic approaches, or cultural significance.
        </AlertDescription>
      </Alert>

      {/* Collection Type Tabs */}
      <Tabs
        defaultValue={currentTab}
        value={currentTab}
        onValueChange={(value) => setCurrentTab(value as "anime" | "manga")}
        className="mt-8"
      >
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="anime" className="flex items-center gap-2 py-3">
            <Film className="h-4 w-4" />
            <span>Anime Collections</span>
          </TabsTrigger>
          <TabsTrigger value="manga" className="flex items-center gap-2 py-3">
            <BookOpen className="h-4 w-4" />
            <span>Manga Collections</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="anime" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((collection, index) => (
              <CollectionCard
                key={collection.id}
                collection={collection}
                index={index}
                onClick={() => handleViewCollection(collection)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="manga" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((collection, index) => (
              <CollectionCard
                key={collection.id}
                collection={collection}
                index={index}
                onClick={() => handleViewCollection(collection)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Collection Modal */}
      {selectedCollection && (
        <CollectionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          collection={selectedCollection}
          type={currentTab}
        />
      )}
    </div>
  )
}

interface CollectionCardProps {
  collection: Collection
  index: number
  onClick: () => void
}

function CollectionCard({ collection, index, onClick }: CollectionCardProps) {
  // Animation variants for staggered appearance
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  }

  return (
    <motion.div
      custom={index}
      initial="hidden"
      animate="visible"
      variants={variants}
      whileHover={{ scale: 1.02 }}
      className="bg-card dark:bg-[#1a1a1a] rounded-lg border dark:border-gray-800 overflow-hidden hover:shadow-md transition-all duration-300"
    >
      <div
        className="h-40 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.7)), url(${collection.image})`,
        }}
      >
        <div className="h-full flex flex-col justify-end p-4">
          <h3 className="text-xl font-bold text-white">{collection.title}</h3>
          <div className="flex flex-wrap gap-1 mt-2">
            {collection.tags.slice(0, 3).map((tag, i) => (
              <Badge key={i} variant="secondary" className="bg-black/50 text-white border-none text-xs">
                {tag}
              </Badge>
            ))}
            {collection.tags.length > 3 && (
              <Badge variant="secondary" className="bg-black/50 text-white border-none text-xs">
                +{collection.tags.length - 3}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="p-4">
        <p className="text-sm text-muted-foreground line-clamp-2 h-10">{collection.description}</p>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Tag className="h-4 w-4" />
            <span>{collection.entries.length} titles</span>
          </div>

          <button
            onClick={onClick}
            className="px-3 py-1 text-sm bg-primary/10 hover:bg-primary/20 text-primary rounded-md transition-colors"
          >
            View Collection
          </button>
        </div>
      </div>
    </motion.div>
  )
}

