"use client"

import philanthropyData from "@/data/philanthropy.json"
import type { PhilanthropyCause } from "@/utils/philanthropy"
import { PageHeader } from "@/components/page-header"
import { PageDescription } from "@/components/posts/typography/page-description"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

function slugifyType(type: string) {
  return type.toLowerCase().replace(/\s+/g, "-");
}

export function PhilanthropyClient({ initialType = "All" }: { initialType?: string }) {
  const [loading, setLoading] = useState(true)
  const [currentType, setCurrentType] = useState(initialType)
  const causes = philanthropyData as PhilanthropyCause[]
  const causeTypes = Array.from(new Set(causes.map(cause => cause.type))).sort()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  // Sort causes by date descending
  const sortedCauses = [...causes].sort((a, b) => new Date(b.dateStarted).getTime() - new Date(a.dateStarted).getTime());
  const filteredCauses = sortedCauses.filter(cause => {
    const matchesType = currentType === "All" || cause.type === currentType;
    const matchesSearch = !searchQuery || 
      cause.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      cause.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cause.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
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

  // Helper to build the correct route for a cause
  function getCauseUrl(cause: PhilanthropyCause) {
    return `/philanthropy/${encodeURIComponent(cause.slug)}`
  }

  function handleTypeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const selectedType = e.target.value;
    if (selectedType === "All") {
      router.push("/philanthropy");
    } else {
      router.push(`/philanthropy/${slugifyType(selectedType)}`);
    }
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <PageHeader
        title="Philanthropy"
        subtitle="Causes and Organizations I Support"
        date="2025-01-01"
        preview="charitable giving and volunteer work for meaningful impact"
        status="In Progress"
        confidence="certain"
        importance={8}
      />

      <div className="mt-8">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <label htmlFor="type-filter" className="text-sm text-muted-foreground">Filter by type:</label>
            <select
              id="type-filter"
              className="border rounded px-2 py-1 text-sm bg-background"
              value={currentType}
              onChange={handleTypeChange}
            >
              <option value="All">All</option>
              {causeTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div className="relative flex-1">
            <input 
              type="text" 
              placeholder="Search causes..." 
              className="w-full px-3 py-1 border rounded text-sm bg-background"
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
                  <th className="py-2 text-left font-medium px-3">Cause</th>
                  <th className="py-2 text-left font-medium px-3">Type</th>
                  <th className="py-2 text-left font-medium px-3">Impact</th>
                  <th className="py-2 text-left font-medium px-3">Year</th>
                </tr>
              </thead>
              <tbody>
                {filteredCauses.map((cause, index) => (
                  <tr
                    key={cause.slug}
                    className={`border-b border-border hover:bg-secondary/50 transition-colors cursor-pointer ${index % 2 === 0 ? 'bg-transparent' : 'bg-muted/5'}`}
                    onClick={() => router.push(getCauseUrl(cause))}
                  >
                    <td className="py-2 px-3 font-medium">{cause.title}</td>
                    <td className="py-2 px-3">{cause.type}</td>
                    <td className="py-2 px-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        cause.impact === 'Very High' ? 'bg-green-100 text-green-800' :
                        cause.impact === 'High' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {cause.impact}
                      </span>
                    </td>
                    <td className="py-2 px-3">{cause.year}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredCauses.length === 0 && !loading && (
              <div className="text-muted-foreground text-sm mt-6">No causes found for this type.</div>
            )}
          </>
        )}
      </div>      {/* Page Description Component */}
      <PageDescription
        title="About Philanthropy"
        description="This page showcases the causes and organizations I actively support and advocate for. I believe in effective altruism principles - using evidence and reason to determine how to do the most good with available resources. The causes listed here represent areas where I've engaged through various forms of support, focusing on high-impact interventions that address pressing global challenges. Each entry includes details about the organization's mission and the measurable impact being achieved. The goal is to highlight important causes worth supporting and to potentially inspire others to consider evidence-based giving in their own philanthropic journey."
      />
    </main>
  )
}
