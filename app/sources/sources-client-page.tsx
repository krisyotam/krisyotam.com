"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Mail, ExternalLink, HelpCircle } from "lucide-react"
import "./sources.css"

interface Source {
  from: string
  content: string
  date: string
  link: string
  type: string
  profileLink: string
}

export default function SourcesClientPage() {
  const [sources, setSources] = useState<Source[]>([])
  const [filteredSources, setFilteredSources] = useState<Source[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSource, setSelectedSource] = useState<Source | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")

  const router = useRouter()
  const searchParams = useSearchParams()
  const searchQuery = searchParams?.get("q") || ""

  useEffect(() => {
    setSearchValue(searchQuery)
  }, [searchQuery])

  useEffect(() => {
    const fetchSources = async () => {
      try {
        const response = await fetch("/api/sources")
        if (!response.ok) {
          throw new Error("Failed to fetch sources")
        }
        const data = await response.json()

        // Debug the API response structure
        console.log("API Response:", data)

        // Check if data has a sources property (common API pattern)
        const sourcesArray = Array.isArray(data)
          ? data
          : data.sources && Array.isArray(data.sources)
            ? data.sources
            : []

        // Ensure we're setting an array
        setSources(sourcesArray)
        setFilteredSources(sourcesArray)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching sources:", err)
        setError("Failed to load sources. Please try again later.")
        setLoading(false)
      }
    }

    fetchSources()
  }, [])

  useEffect(() => {
    if (searchQuery && Array.isArray(sources) && sources.length > 0) {
      const query = searchQuery.toLowerCase()
      const filtered = sources.filter(
        (source) => source.from?.toLowerCase().includes(query) || source.content?.toLowerCase().includes(query),
      )
      setFilteredSources(filtered)
    } else {
      setFilteredSources(sources)
    }
  }, [searchQuery, sources])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(searchValue ? `/sources?q=${encodeURIComponent(searchValue)}` : "/sources")
  }

  const handleOpenModal = (source: Source) => {
    setSelectedSource(source)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleProfileClick = (source: Source, e: React.MouseEvent) => {
    e.stopPropagation()
    if (source.type === "email") {
      window.location.href = `mailto:${source.from}`
    } else {
      window.open(source.profileLink, "_blank")
    }
  }

  const toggleHelpModal = () => {
    setIsHelpModalOpen(!isHelpModalOpen)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail className="h-4 w-4 text-gray-500 dark:text-[#A6A6A6]" />
      default:
        return <ExternalLink className="h-4 w-4 text-gray-500 dark:text-[#A6A6A6]" />
    }
  }

  if (loading) {
    return (
      <div className="py-8">
        <div className="text-center">
          <div className="animate-pulse h-10 w-full bg-gray-200 dark:bg-[#171717] rounded mb-8"></div>
          <div className="space-y-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="animate-pulse h-16 bg-gray-200 dark:bg-[#171717] rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-8">
        <div className="text-center">
          <div className="bg-red-50 dark:bg-[#171717] text-red-800 dark:text-red-300 p-4 rounded-md border border-red-100 dark:border-[#252525]">
            {error}
          </div>
        </div>
      </div>
    )
  }

  // Safety check to ensure filteredSources is an array before rendering
  if (!Array.isArray(filteredSources)) {
    return (
      <div className="py-8">
        <div className="text-center">
          <div className="bg-yellow-50 dark:bg-[#171717] text-yellow-800 dark:text-yellow-300 p-4 rounded-md border border-yellow-100 dark:border-[#252525]">
            Error: Sources data is not in the expected format. Please try again later.
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8 relative dark:bg-[#121212]">
      {/* Search Bar */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex w-full">
          <input
            type="text"
            placeholder="Search by sender or content..."
            className="flex-grow px-4 py-2 border border-gray-300 dark:border-[#252525] rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-[#252525] bg-white dark:bg-[#171717] text-gray-900 dark:text-[#FAFAFA]"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-gray-200 dark:bg-[#252525] text-gray-700 dark:text-[#FAFAFA] rounded-r-md hover:bg-gray-300 dark:hover:bg-[#323232] focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-[#252525]"
          >
            Search
          </button>
        </form>
      </div>

      {filteredSources.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-[#A6A6A6]">No sources found matching your search.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#171717] rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-[#252525]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-[#171717] text-left border-b border-gray-200 dark:border-[#252525]">
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-[#A6A6A6] uppercase tracking-wider">
                    From
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-[#A6A6A6] uppercase tracking-wider">
                    Content
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-[#A6A6A6] uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-[#252525]">
                {filteredSources.map((source, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-[#252525] transition-colors">
                    <td
                      className="px-6 py-4 whitespace-nowrap cursor-pointer"
                      onClick={(e) => handleProfileClick(source, e)}
                    >
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(source.type)}
                        <span className="text-sm font-medium text-gray-900 dark:text-[#FAFAFA] hover:underline">
                          {source.from}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-[#A6A6A6] mt-1">{source.type}</div>
                    </td>
                    <td className="px-6 py-4 cursor-pointer" onClick={() => handleOpenModal(source)}>
                      <div className="text-sm text-gray-900 dark:text-[#FAFAFA] line-clamp-2">{source.content}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-[#A6A6A6]">
                        {new Date(source.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Help Modal Button - Bottom Left */}
      <button
        onClick={toggleHelpModal}
        className="fixed bottom-4 left-4 p-2 bg-gray-200 dark:bg-[#252525] rounded-full shadow-md hover:bg-gray-300 dark:hover:bg-[#323232] focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-[#323232] z-10"
        aria-label="Help"
      >
        <HelpCircle className="h-5 w-5 text-gray-700 dark:text-[#FAFAFA]" />
      </button>

      {/* Help Modal with Backdrop Blur */}
      {isHelpModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center" onClick={toggleHelpModal}>
          <div
            className="bg-white dark:bg-[#171717] p-6 rounded-lg shadow-xl max-w-md mx-4 border border-gray-200 dark:border-[#252525]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-[#FAFAFA]">About Sources</h3>
            <p className="text-gray-700 dark:text-[#FAFAFA] mb-4">
              If you would like to be excluded from being mentioned, please email krisyotam@protonmail.com or mention
              that you would like to be excluded in your source emails. If you would like your content to be taken down,
              please mention that as well.
            </p>
            <button
              onClick={toggleHelpModal}
              className="w-full py-2 bg-gray-200 dark:bg-[#252525] text-gray-700 dark:text-[#FAFAFA] rounded-md hover:bg-gray-300 dark:hover:bg-[#323232] focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-[#323232]"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Source Content Modal with Backdrop Blur */}
      {isModalOpen && selectedSource && (
        <div
          className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white dark:bg-[#171717] p-6 rounded-lg shadow-xl max-w-2xl mx-4 w-full border border-gray-200 dark:border-[#252525]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-[#FAFAFA]">{selectedSource.from}</h3>
                <p className="text-sm text-gray-500 dark:text-[#A6A6A6]">
                  {new Date(selectedSource.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <span className="text-sm px-2 py-1 bg-gray-100 dark:bg-[#252525] text-gray-700 dark:text-[#A6A6A6] rounded">
                {selectedSource.type}
              </span>
            </div>
            <div className="border-t border-b border-gray-200 dark:border-[#252525] py-4 mb-4">
              <div className="text-gray-700 dark:text-[#FAFAFA] whitespace-pre-wrap">{selectedSource.content}</div>
            </div>
            <div className="flex justify-end">
              <a
                href={selectedSource.link}
                className="px-4 py-2 bg-gray-200 dark:bg-[#252525] text-gray-700 dark:text-[#FAFAFA] rounded-md hover:bg-gray-300 dark:hover:bg-[#323232] focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-[#323232]"
              >
                View Inspired Content
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

