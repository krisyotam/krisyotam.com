"use client"

import { PageHeader } from "@/components/page-header"
import { useRouter } from "next/navigation"
import { useState } from "react"
import accreditationsData from "@/data/accreditations.json"

interface Accreditation {
  id: string
  slug: string
  title: string
  organization: string
  field: string
  type: string
  date: string
  expiryDate?: string
  status: string
  description: string
  link?: string
  credentialId?: string
  logo?: string
  certificateImage?: string
  displayName?: string
}

export default function AccreditationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("All")
  
  const router = useRouter()
  const accreditations = accreditationsData as Accreditation[]
  
  // Get unique types for filters
  const types = Array.from(new Set(accreditations.map(acc => acc.type))).sort()
  
  // Filter accreditations
  const filteredAccreditations = accreditations.filter(acc => {
    const matchesSearch = !searchQuery || 
      acc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesType = selectedType === "All" || acc.type === selectedType
    
    return matchesSearch && matchesType
  })
  const formatDate = (dateString: string) => {
    return new Date(dateString).getFullYear().toString()
  }

  const handleRowClick = (acc: Accreditation) => {
    router.push(`/accreditations/${acc.field}/${acc.slug}`)
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <PageHeader
        title="Accreditations"
        subtitle="Degrees, Certifications, and Professional Memberships"
        date="2025-01-01"
        preview="Professional qualifications and academic achievements"
        status="Finished"
        confidence="certain"
        importance={8}
      />

      <div className="mt-8">        <div className="mb-6 flex items-center gap-4">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <label htmlFor="type-filter" className="text-sm text-muted-foreground">Filter by type:</label>
            <select
              id="type-filter"
              className="border rounded px-2 py-1 text-sm bg-background"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="All">All</option>
              {types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div className="relative flex-1">
            <input 
              type="text" 
              placeholder="Search accreditations..." 
              className="w-full px-3 py-1 border rounded text-sm bg-background"
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
            />
          </div>
        </div>        <table className="w-full text-sm border border-border overflow-hidden shadow-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-foreground">
              <th className="py-2 text-left font-medium px-3">Title</th>
              <th className="py-2 text-left font-medium px-3">Type</th>
              <th className="py-2 text-left font-medium px-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredAccreditations.map((acc, index) => (
              <tr
                key={acc.id}
                className={`border-b border-border hover:bg-secondary/50 transition-colors cursor-pointer ${
                  index % 2 === 0 ? 'bg-transparent' : 'bg-muted/5'
                }`}
                onClick={() => handleRowClick(acc)}
              >
                <td className="py-2 px-3 font-medium">{acc.title}</td>
                <td className="py-2 px-3">{acc.type}</td>
                <td className="py-2 px-3">{formatDate(acc.date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
          {filteredAccreditations.length === 0 && (
          <div className="text-muted-foreground text-sm mt-6">No accreditations found for this type.</div>
        )}</div>
    </main>
  )
}