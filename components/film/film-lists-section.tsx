"use client"

import { useState, useEffect } from "react"
import { TraktMovieCard } from "@/components/trakt/trakt-movie-card"
import { TraktShowCard } from "@/components/trakt/trakt-show-card"
import { TraktEmptyState } from "@/components/trakt/trakt-empty-state"
import { CustomSelect, SelectOption } from "@/components/ui/custom-select"
import { List, Clock, Lock, Globe } from "lucide-react"

interface ListItem {
  id: number
  title: string
  year?: number
  type: 'movie' | 'show'
  posterUrl: string | null
  traktId?: number
  imdbId?: string
  tmdbId?: number
  addedAt: string
}

interface TraktList {
  id: number
  name: string
  description: string
  itemCount: number
  privacy: string
  createdAt: string
  updatedAt: string
  items: ListItem[]
  slug: string
}

export function FilmListsSection() {
  const [lists, setLists] = useState<TraktList[]>([])
  const [selectedList, setSelectedList] = useState<TraktList | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchLists() {
      try {
        console.log("Fetching Trakt lists")
        const response = await fetch("/api/trakt/lists")
        
        if (!response.ok) {
          throw new Error(`Failed to fetch lists: ${response.status}`)
        }
        
        const data = await response.json()
        console.log("Lists fetched:", data.length)
        
        setLists(data)
        if (data.length > 0) {
          setSelectedList(data[0]) // Select first list by default
        }
      } catch (err) {
        console.error("Error fetching lists:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch lists")
      } finally {
        setLoading(false)
      }
    }

    fetchLists()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">My Lists</h2>
        <div className="p-8 rounded-none bg-muted/50 dark:bg-[hsl(var(--popover))] text-center">
          <p className="text-muted-foreground">Loading lists...</p>
        </div>
      </div>
    )
  }
  if (error || lists.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">My Lists</h2>
        <TraktEmptyState message={error || "No lists found"} />
      </div>
    )
  }

  // Convert lists to SelectOption format
  const listOptions: SelectOption[] = lists.map(list => ({
    value: list.id.toString(),
    label: `${list.name} (${list.itemCount} items)`
  }))

  const handleListChange = (selectedValue: string) => {
    const listId = parseInt(selectedValue)
    const list = lists.find(l => l.id === listId)
    setSelectedList(list || null)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">My Lists</h2>
        
        {/* List selector */}
        <div className="space-y-2">
          <label htmlFor="list-select" className="text-sm font-medium text-foreground">
            Select a list:
          </label>
          <CustomSelect
            id="list-select"
            value={selectedList?.id.toString() || ""}
            onValueChange={handleListChange}
            options={listOptions}
            placeholder="Choose a list..."
            className="w-full max-w-md text-sm"
          />
        </div>

        {/* Selected list info */}
        {selectedList && (
          <div className="p-4 rounded-none bg-muted/50 dark:bg-[hsl(var(--popover))] border border-border">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <List className="h-4 w-4" />
                  {selectedList.name}
                </h3>
                {selectedList.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedList.description}
                  </p>
                )}
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Updated {new Date(selectedList.updatedAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    {selectedList.privacy === 'public' ? (
                      <Globe className="h-3 w-3" />
                    ) : (
                      <Lock className="h-3 w-3" />
                    )}
                    {selectedList.privacy}
                  </span>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">
                {selectedList.itemCount} items
              </span>
            </div>
          </div>
        )}
      </div>

      {/* List items */}
      {selectedList && (
        <div className="space-y-4">
          {selectedList.items.length === 0 ? (
            <TraktEmptyState message="This list is empty" />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">              {selectedList.items.map((item) => {
                if (item.type === 'movie') {
                  return (
                    <TraktMovieCard
                      key={`${item.type}-${item.id}`}
                      id={item.id}
                      title={item.title}
                      year={item.year}
                      posterUrl={item.posterUrl}
                    />
                  )
                } else if (item.type === 'show') {
                  return (
                    <TraktShowCard
                      key={`${item.type}-${item.id}`}
                      id={item.id}
                      title={item.title}
                      year={item.year}
                      posterUrl={item.posterUrl}
                    />
                  )
                }
                return null
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
