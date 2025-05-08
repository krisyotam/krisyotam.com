"use client"

import { useState, useEffect } from "react"
import { Download, ExternalLink } from "lucide-react"
import { format } from "date-fns"
import { useRouter } from "next/navigation"

interface Reference {
  id: string
  title: string
  type: string
  format: string
  author: string
  date: string
  url: string
  preview?: string
  status?: string
  confidence?: string
  importance?: number
}

export function ReferencesClient() {
  const [references, setReferences] = useState<Reference[]>([])
  const [selectedReference, setSelectedReference] = useState<Reference | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("All")
  const router = useRouter()

  // Get unique types for filter dropdown
  const typeOptions = ["All", ...Array.from(new Set(references.map(ref => ref.type)))].sort()

  useEffect(() => {
    const fetchReferences = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/references")

        if (!response.ok) {
          throw new Error("Failed to fetch references")
        }

        const data = await response.json()
        setReferences(data)
      } catch (err) {
        setError("Failed to load references. Please try again later.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchReferences()
  }, [])

  const handleReferenceClick = (id: string) => {
    router.push(`/references/${id}`)
  }

  // Filter references based on search term and type
  const filteredReferences = references.filter(ref => {
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      const matchesSearch = 
        ref.title.toLowerCase().includes(term) ||
        ref.author.toLowerCase().includes(term) ||
        (ref.preview && ref.preview.toLowerCase().includes(term))
      
      if (!matchesSearch) return false
    }

    // Filter by type
    if (typeFilter !== "All" && ref.type !== typeFilter) {
      return false
    }

    return true
  })

  const formatFileSource = (url: string, format: string) => {
    if (url.startsWith('http')) {
      return 'External link'
    } else {
      return `Local ${format}`
    }
  }

  const renderIconByFormat = (format: string) => {
    // Return format without any colored styling
    return <span className="font-mono text-muted-foreground">{format}</span>
  }

  if (loading) {
    return <div className="text-center">Loading references...</div>
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>
  }

  if (!loading && !error && references.length === 0) {
    return <div className="text-center text-muted-foreground">No references found in the database.</div>
  }

  return (
    <div className="mt-8">
      {/* Search and filter */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search references..."
          className="flex-1 px-4 py-2 border border-border rounded-md bg-card hover:bg-secondary/50 transition-colors duration-200"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        
        <select
          className="px-4 py-2 border border-border rounded-md bg-card hover:bg-secondary/50 transition-colors duration-200"
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
        >
          {typeOptions.map(type => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      
      {/* References table */}
      <div className="font-mono">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left text-sm text-muted-foreground">
              <th className="pb-2 font-normal">date</th>
              <th className="pb-2 font-normal">title</th>
              <th className="pb-2 font-normal">author</th>
              <th className="pb-2 font-normal text-right">format</th>
            </tr>
          </thead>
          <tbody>
            {filteredReferences.map((reference) => (
              <tr
                key={reference.id}
                onClick={() => handleReferenceClick(reference.id)}
                className="border-t border-border hover:bg-secondary/50 transition-colors duration-200 cursor-pointer"
              >
                <td className="py-3 pr-4 text-sm text-muted-foreground whitespace-nowrap">
                  {format(new Date(reference.date), "yyyy-MM-dd")}
                </td>
                <td className="py-3 pr-4 truncate max-w-[250px]">{reference.title}</td>
                <td className="py-3 pr-4 text-sm text-muted-foreground truncate max-w-[150px]">{reference.author}</td>
                <td className="py-3 text-right">
                  {renderIconByFormat(reference.format)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {filteredReferences.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No references found matching your search.
        </div>
      )}
    </div>
  )
} 