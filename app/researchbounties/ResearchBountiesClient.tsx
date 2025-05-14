"use client"

import { useState } from "react"
import { Search, X } from "lucide-react"
import { PageDescription } from "@/components/posts/typography/page-description"

type Bounty = {
  id: string
  title: string
  type: string
  author: string
  description: string
  version: string
  publisher: string
  year: string
  status: string
  additionalNotes?: string
}

type ResearchBountiesClientProps = {
  initialBounties: Bounty[]
}

export default function ResearchBountiesClient({ initialBounties }: ResearchBountiesClientProps) {
  const [bounties] = useState<Bounty[]>(initialBounties)
  const [filter, setFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")

  const filteredBounties = bounties.filter((bounty) => {
    // Filter by type
    const matchesType = filter === "all" || bounty.type === filter

    // Filter by search query
    const matchesSearch =
      searchQuery === "" ||
      bounty.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bounty.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bounty.description.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesType && matchesSearch
  })

  return (
    <div>
      {/* Search bar */}
      <div className="mb-4 relative">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by title, author, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 pl-10 border border-gray-200 dark:border-gray-700 bg-transparent"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1 ${
            filter === "all" ? "bg-black text-white dark:bg-white dark:text-black" : "bg-gray-100 dark:bg-gray-800"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("book")}
          className={`px-3 py-1 ${
            filter === "book" ? "bg-black text-white dark:bg-white dark:text-black" : "bg-gray-100 dark:bg-gray-800"
          }`}
        >
          Books
        </button>
        <button
          onClick={() => setFilter("paper")}
          className={`px-3 py-1 ${
            filter === "paper" ? "bg-black text-white dark:bg-white dark:text-black" : "bg-gray-100 dark:bg-gray-800"
          }`}
        >
          Papers
        </button>
        <button
          onClick={() => setFilter("article")}
          className={`px-3 py-1 ${
            filter === "article" ? "bg-black text-white dark:bg-white dark:text-black" : "bg-gray-100 dark:bg-gray-800"
          }`}
        >
          Articles
        </button>
        <button
          onClick={() => setFilter("video")}
          className={`px-3 py-1 ${
            filter === "video" ? "bg-black text-white dark:bg-white dark:text-black" : "bg-gray-100 dark:bg-gray-800"
          }`}
        >
          Videos
        </button>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Showing {filteredBounties.length} of {bounties.length} bounties
      </p>

      {/* Bounties list */}
      <div className="grid gap-4">
        {filteredBounties.length === 0 ? (
          <p className="text-center py-8 text-gray-500 dark:text-gray-400">No bounties found matching your criteria.</p>
        ) : (
          filteredBounties.map((bounty) => (
            <div
              key={bounty.id}
              className="border border-gray-200 dark:border-gray-700 p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            >
              <div className="flex justify-between items-start">
                <h2 className="text-lg font-semibold">{bounty.title}</h2>
                <span className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs">
                  {bounty.status}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 my-2">
                <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs">
                  {bounty.type.toUpperCase()}
                </span>
                <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs">
                  {bounty.year}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-2 text-xs text-gray-500 dark:text-gray-400">
                <p>Author: {bounty.author}</p>
                <p>Publisher: {bounty.publisher}</p>
                <p>Version: {bounty.version}</p>
              </div>

              <p className="text-sm mt-2">{bounty.description}</p>

              {bounty.additionalNotes && (
                <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                  <p className="text-xs italic text-gray-500 dark:text-gray-400">{bounty.additionalNotes}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* PageDescription component */}
      <PageDescription 
        title="About Research Bounties"
        description="This page lists papers, books, and other materials I have been unable to obtain through conventional means. Click the 'About Research Bounties' section at the top of the page for more information on how the bounty system works. Use the search bar to find specific items, or filter by type using the buttons above the list."
      />
    </div>
  )
}
