"use client"

import { useState, useEffect } from "react"
import { Download, ExternalLink } from "lucide-react"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { CustomSelect } from "@/components/ui/custom-select"

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
    <div className="mt-8">      {/* Search and Filter Controls */}
      <div className="mb-6 flex items-center gap-4">
        <div className="flex items-center gap-2 whitespace-nowrap">          <label htmlFor="type-filter" className="text-sm text-muted-foreground">Filter by type:</label>
          <CustomSelect
            value={typeFilter}
            onValueChange={setTypeFilter}
            options={typeOptions.map(type => ({ value: type, label: type }))}
            className="text-sm min-w-[140px]"
          />
        </div>
        <div className="relative flex-1">
          <input 
            type="text" 
            placeholder="Search references..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full h-9 px-3 py-2 border rounded-none text-sm bg-background hover:bg-secondary/50 focus:outline-none focus:bg-secondary/50"
          />
        </div>
      </div>
        {/* References table */}
      <div className="mt-8">
        <table className="w-full text-sm border border-border overflow-hidden shadow-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-foreground">
              <th className="py-2 text-left font-medium px-3">Title</th>
              <th className="py-2 text-left font-medium px-3">Author</th>
              <th className="py-2 text-left font-medium px-3">Type</th>
              <th className="py-2 text-left font-medium px-3">Date</th>
              <th className="py-2 text-left font-medium px-3">Format</th>
            </tr>
          </thead>
          <tbody>
            {filteredReferences.map((reference, index) => (
              <tr
                key={reference.id}
                onClick={() => handleReferenceClick(reference.id)}
                className={`border-b border-border hover:bg-secondary/50 transition-colors cursor-pointer ${
                  index % 2 === 0 ? 'bg-transparent' : 'bg-muted/5'
                }`}
              >
                <td className="py-2 px-3 font-medium">{reference.title}</td>
                <td className="py-2 px-3 text-muted-foreground">{reference.author}</td>
                <td className="py-2 px-3">{reference.type}</td>
                <td className="py-2 px-3 whitespace-nowrap">
                  {format(new Date(reference.date), "MMM d, yyyy")}
                </td>
                <td className="py-2 px-3">
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