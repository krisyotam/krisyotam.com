"use client"

import poemsData from "@/data/verse/verse.json"
import categoriesData from "@/data/verse/categories.json"
import type { Poem } from "@/utils/poems"
import { PageHeader } from "@/components/page-header"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { CustomSelect, SelectOption } from "@/components/ui/custom-select"
import { cn } from "@/lib/utils"
import { formatDate, formatDateRange } from "@/utils/date-formatter"

interface VerseType {
  slug: string;
  title: string;
  preview: string;
  date: string;
  status: "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished";
  confidence: "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain";
  importance: number;
}

function slugifyType(type: string) {
  return type.toLowerCase().replace(/\s+/g, "-");
}

function unslugifyType(slug: string, allTypes: VerseType[]): string {
  const typeData = allTypes.find(t => t.slug === slug);
  return typeData ? typeData.title : "All";
}

export function VerseClient({ initialType = "All" }: { initialType?: string }) {
  const [loading, setLoading] = useState(true)  
  const [currentType, setCurrentType] = useState(initialType)  
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  
  const poems = poemsData as Poem[]  
  const verseTypes = categoriesData.types as VerseType[]

  // Get proper type title from slug or raw type
  const getTypeTitle = (type: string) => {
    const typeData = verseTypes.find(t => t.slug === slugifyType(type) || t.title === type);
    return typeData ? typeData.title : type;
  }

  // Get current category metadata for header
  const getHeaderData = () => {
    if (currentType === "All") {
      return {
        title: "Verse",
        subtitle: "Poems, Haikus, and Other Forms", 
        start_date: "2025-01-01",
        end_date: new Date().toISOString().split('T')[0], // Current date as YYYY-MM-DD
        preview: "An anthology of original verse",
        status: "In Progress" as const,
        confidence: "likely" as const,
        importance: 7
      }
    }

    // Find type data
    const typeSlug = slugifyType(currentType)
    const typeData = verseTypes.find(type => type.slug === typeSlug)

    if (typeData) {
      return {
        title: typeData.title,
        subtitle: "",
        start_date: typeData.date || "Undefined",
        end_date: new Date().toISOString().split('T')[0],
        preview: typeData.preview,
        status: typeData.status,
        confidence: typeData.confidence,
        importance: typeData.importance
      }
    }

    // Fallback to default if not found 
    return {
      title: currentType,
      subtitle: "",
      start_date: "Undefined",
      end_date: new Date().toISOString().split('T')[0],
      preview: `A collection of ${currentType.toLowerCase()} poems`,
      status: "In Progress" as const,
      confidence: "likely" as const,
      importance: 7
    }
  }

  // Get type options for the dropdown
  const typeOptions: SelectOption[] = [
    { value: "All", label: "All Types" },
    ...verseTypes.map(type => ({ 
      value: type.slug,
      label: type.title
    }))
  ]

  // Get poems filtered by type and search
  const sortedPoems = [...poems].sort((a, b) => new Date(b.start_date ?? "1970-01-01").getTime() - new Date(a.start_date ?? "1970-01-01").getTime());
  const filteredPoems = sortedPoems.filter(poem => {
    const matchesType = currentType === "All" || slugifyType(poem.type ?? "") === slugifyType(currentType);
    const matchesSearch = !searchQuery || 
      (poem.title ?? "").toLowerCase().includes(searchQuery.toLowerCase()) || 
      ((poem.content ?? "").toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  useEffect(() => {
    // Update current type when initialType changes
    setCurrentType(initialType)
    
    // Show loading state briefly for better UX during type changes
    setLoading(true)
    const timeout = setTimeout(() => setLoading(false), 300)
    return () => clearTimeout(timeout)
  }, [initialType])

  // Helper to build the correct route for a poem
  function getPoemUrl(poem: Poem) {
  const typeSlug = slugifyType(poem.type ?? "");
  return `/verse/${encodeURIComponent(typeSlug)}/${encodeURIComponent(poem.slug ?? "")}`
  }

  function handleTypeChange(selectedValue: string) {
    const selectedType = typeOptions.find(opt => opt.value === selectedValue)
    if (!selectedType) return

    if (selectedType.value === "All") {
      router.push("/verse");
    } else {
      router.push(`/verse/${encodeURIComponent(selectedType.value)}`);
    }
  }

  const headerData = getHeaderData();

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <PageHeader {...headerData} />

      <div className="mt-8">        
        <div className="mb-6 flex items-center gap-4">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <label htmlFor="type-filter" className="text-sm text-muted-foreground">Filter by type:</label>
            <CustomSelect
              value={currentType}
              onValueChange={handleTypeChange}
              options={typeOptions}
              className="text-sm min-w-[140px]"
            />
          </div>
          
          <div className="relative flex-1">
            <input 
              type="text" 
              placeholder="Search poems..." 
              className="w-full h-9 px-3 py-2 border rounded-none text-sm bg-background hover:bg-secondary/50 focus:outline-none focus:bg-secondary/50"
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
            />
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <svg className="animate-spin h-8 w-8 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          </div>
        ) : (
          <>
            <table className="w-full text-sm border border-border overflow-hidden shadow-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-foreground">
                  <th className="py-2 text-left font-medium px-3">Title</th>
                  <th className="py-2 text-left font-medium px-3">Type</th>
                  <th className="py-2 text-left font-medium px-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredPoems.map((poem, index) => (
                  <tr
                    key={poem.slug}
                    className={`border-b border-border hover:bg-secondary/50 transition-colors cursor-pointer ${index % 2 === 0 ? 'bg-transparent' : 'bg-muted/5'}`}
                    onClick={() => router.push(getPoemUrl(poem))}
                  >
                    <td className="py-2 px-3">{poem.title}</td>
                    <td className="py-2 px-3">{getTypeTitle(poem.type ?? "")}</td>
                    <td className="py-2 px-3">
                      {poem.end_date && poem.end_date.trim() 
                        ? formatDate(poem.end_date ?? "")
                        : formatDate(poem.start_date ?? "")
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredPoems.length === 0 && !loading && (
              <div className="text-muted-foreground text-sm mt-6">No poems found for this type.</div>
            )}
          </>
        )}
      </div>
    </main>
  )
}