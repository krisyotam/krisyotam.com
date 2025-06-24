"use client"

import { useState, useMemo } from "react"
import mySitesData from "@/data/my-sites.json"

interface Site {
  name: string
  purpose: string
  link: string
  category: string
  tags: string[]
}

export default function MySites() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const categories = useMemo(() => {
    const allCategories = mySitesData.sites.map((site) => site.category)
    return ["All", ...Array.from(new Set(allCategories))] // Changed to Array.from()
  }, [])

  const filteredSites = useMemo(() => {
    return mySitesData.sites.filter((site: Site) => {
      const matchesCategory =
        selectedCategory === "All" || site.category === selectedCategory
      const matchesSearch =
        site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        site.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
        site.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        site.category.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [searchTerm, selectedCategory])

  return (
    <div className="py-4">
      <div className="mb-4 flex flex-col sm:flex-row gap-4 w-full">
        <select
          className="px-4 py-2 border border-border rounded-md w-full sm:flex-1 focus:outline-none bg-background text-foreground"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((category) => (
            <option key={category} value={category} className="bg-background text-foreground">
              {category}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Search socials..."
          className="px-4 py-2 border border-border rounded-md w-full sm:flex-1 focus:outline-none bg-background text-foreground placeholder-muted-foreground"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-secondary">
              <th className="px-4 py-2 text-left text-foreground">Name</th>
              <th className="px-4 py-2 text-left text-foreground">Purpose</th>
            </tr>
          </thead>
          <tbody>
            {filteredSites.map((site, index) => (
              <tr
                key={index}
                className="border-t border-border hover:bg-secondary/50 transition-colors duration-200"
              >
                <td className="px-4 py-2 text-foreground">
                  <a
                    href={site.link}
                    target="_blank"
                    data-no-preview="true"
                    rel="noopener noreferrer"
                    className="hover:text-gray-400 transition-colors"
                  >
                    {site.name}
                  </a>
                </td>
                <td className="px-4 py-2 text-muted-foreground">{site.purpose}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}