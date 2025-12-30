"use client"

import { useEffect, useState } from "react"
import { PageHeader } from "@/components/core"
import { PageDescription } from "@/components/core"
import { Input } from "@/components/ui/input"
import { CustomSelect } from "@/components/ui/custom-select"
import { Card } from "@/components/ui/card"

interface ShopItem {
  name: string
  slug: string
  category: string
  price: string
  currency?: string
  payment_url: string
  image: string
  description?: string
}

export default function ShopClient() {
  const [items, setItems] = useState<ShopItem[]>([])
  const [categories, setCategories] = useState<{ title: string; slug: string; "aspect-ratio"?: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")

  useEffect(() => {
    async function fetchData() {
      try {
        const [itemsRes, catsRes] = await Promise.all([
          fetch("/api/shop"),
          fetch("/api/shop/categories"),
        ])

        if (!itemsRes.ok) throw new Error("Failed to load shop items")
        if (!catsRes.ok) throw new Error("Failed to load categories")

  const itemsJson = await itemsRes.json()
        const catsJson = await catsRes.json()

        // Defensive: ensure only active items are set on the client as well
        const active = Array.isArray(itemsJson)
          ? itemsJson.filter((it: any) => (it?.state || "").toString().toLowerCase() === "active")
          : []
        setItems(active)
        setCategories(Array.isArray(catsJson?.categories) ? catsJson.categories : [])
      } catch (err) {
        console.error("Error loading shop data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filtered = items.filter((it) => {
    const matchesCategory = category === "All" || it.category === category
    const q = search.trim().toLowerCase()
    const matchesSearch = !q || it.name.toLowerCase().includes(q) || (it.description || "").toLowerCase().includes(q)
    return matchesCategory && matchesSearch
  })

  // Only consider active items (server already filters, this is defensive)
  const activeItems = filtered

  // Categories that should be shown (from categories.json) and that have at least
  // one active item. We use slug comparison case-insensitively.
  const categoriesToShow = categories.filter((c) =>
    activeItems.some((it) => (it.category || "").toLowerCase() === (c.slug || "").toLowerCase())
  )

  // Items whose category doesn't match any category entry (show under 'Other items')
  const uncategorized = activeItems.filter(
    (it) => !categories.some((c) => (c.slug || "").toLowerCase() === (it.category || "").toLowerCase())
  )

  // Helper to get the aspect ratio for a category (defaults to 'rectangle')
  const getCategoryAspect = (slug: string | undefined) => {
    if (!slug) return "rectangle"
    const cat = categories.find((c) => c.slug === slug)
    const ar = cat?.["aspect-ratio"]
    return ar && ar.trim() !== "" ? ar.toLowerCase() : "rectangle"
  }

  return (
  <div className="container mx-auto max-w-6xl px-4 pt-4 pb-8">
      <div className="mb-6 flex items-center gap-4">
        <Input
          placeholder="Search shop..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 h-10 rounded-none"
        />

        <CustomSelect
          id="shop-category-filter"
          value={category}
          onValueChange={(v) => setCategory(v)}
          options={[{ value: "All", label: "All" }, ...categories.map((c) => ({ value: c.slug, label: c.title }))]}
          className="min-w-[160px] text-sm"
        />
      </div>

      {loading ? (
        <div className="py-24 text-center">Loading…</div>
      ) : (
        <div className="space-y-8">
          {/* Render a section per category from categories.json if it has items */}
          {categoriesToShow.map((cat) => {
            const itemsForCat = activeItems.filter(
              (it) => (it.category || "").toLowerCase() === (cat.slug || "").toLowerCase()
            )
            const isSquareCat = getCategoryAspect(cat.slug) === "square"

            return (
              <section key={cat.slug}>
                <h2 className="text-sm font-medium text-muted-foreground mb-2">{cat.title}</h2>
                <div className="border-t border-border mb-4" />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0 border-r border-b border-gray-300/80 dark:border-neutral-700/60">
                  {itemsForCat.map((it) => (
                    <Card key={it.slug} className="p-4 bg-card border-0 border-t border-l border-gray-300/80 dark:border-neutral-700/60 rounded-none hover:bg-secondary/50 cursor-pointer shadow-none">
                      <a href={it.payment_url} target="_blank" rel="noopener noreferrer" className="no-underline text-foreground">
                        <div className="w-full mb-4 relative overflow-hidden bg-transparent" style={{ paddingTop: isSquareCat ? '100%' : '150%' }}>
                          <img src={it.image} alt={it.name} className="absolute inset-0 w-full h-full object-contain select-none" draggable={false} onDragStart={(e) => e.preventDefault()} onContextMenu={(e) => e.preventDefault()} />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-sm leading-tight break-words whitespace-normal">{it.name}</div>
                            <div className="text-xs italic text-muted-foreground">{it.category}</div>
                          </div>
                          <div className="text-xs font-medium text-muted-foreground">{it.currency ? `${it.currency} ${it.price}` : `$${it.price}`}</div>
                        </div>
                      </a>
                    </Card>
                  ))}
                </div>
              </section>
            )
          })}

          {/* Items that don't belong to any defined category */}
          {uncategorized.length > 0 && (
            <section>
              <h2 className="text-sm font-medium text-muted-foreground mb-2">Other items</h2>
              <div className="border-t border-border mb-4" />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0 border-r border-b border-gray-300/80 dark:border-neutral-700/60">
                {uncategorized.map((it) => {
                  const isSquare = getCategoryAspect(it.category) === "square"
                  return (
                    <Card key={it.slug} className="p-4 bg-card border-0 border-t border-l border-gray-300/80 dark:border-neutral-700/60 rounded-none hover:bg-secondary/50 cursor-pointer shadow-none">
                      <a href={it.payment_url} target="_blank" rel="noopener noreferrer" className="no-underline text-foreground">
                        <div className="w-full mb-4 relative overflow-hidden bg-transparent" style={{ paddingTop: isSquare ? '100%' : '150%' }}>
                          <img src={it.image} alt={it.name} className="absolute inset-0 w-full h-full object-contain select-none" draggable={false} onDragStart={(e) => e.preventDefault()} onContextMenu={(e) => e.preventDefault()} />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-sm leading-tight break-words whitespace-normal">{it.name}</div>
                            <div className="text-xs italic text-muted-foreground">{it.category}</div>
                          </div>
                          <div className="text-xs font-medium text-muted-foreground">{it.currency ? `${it.currency} ${it.price}` : `$${it.price}`}</div>
                        </div>
                      </a>
                    </Card>
                  )
                })}
              </div>
            </section>
          )}

          {filtered.length === 0 && (
            <div className="text-center text-muted-foreground">No items match your search.</div>
          )}
        </div>
      )}
    </div>
  )
}
