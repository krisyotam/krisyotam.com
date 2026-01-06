"use client"

import { useState, useMemo } from "react"
import { CustomSelect, SelectOption } from "@/components/ui/custom-select"

const MY_SITES_DATA = {
  sites: [
    {
      name: "last.fm",
      purpose: "track what I listen to live",
      link: "https://www.last.fm/user/krisyotam",
      category: "Music",
      tags: ["music", "tracking", "social"]
    },
    {
      name: "album of the year",
      purpose: "view my music ratings, crossposted to this site",
      link: "https://www.albumoftheyear.org/user/krisyotam/",
      category: "Music",
      tags: ["music", "ratings", "reviews"]
    },
    {
      name: "letterboxd",
      purpose: "view the cinema I watch, and reviews crossposted to this site",
      link: "https://letterboxd.com/krisyotam",
      category: "Cinema",
      tags: ["film", "reviews", "tracking"]
    },
    {
      name: "myanimelist",
      purpose: "view the anime, and manga I watch/read, and reviews crossposted to this site",
      link: "https://myanimelist.net/profile/krisyotam",
      category: "Animanga",
      tags: ["anime", "manga", "tracking"]
    },
    {
      name: "storygraph",
      purpose: "view the books, graphic novels, and comics I read, and reviews crossposted to this site",
      link: "https://app.thestorygraph.com/profile/krisyotam",
      category: "Literature",
      tags: ["books", "reading", "tracking"]
    },
    {
      name: "substack",
      purpose: "exclusive essays and writings, and updates on this site",
      link: "https://substack.com/@krisyotam",
      category: "Literature",
      tags: ["writing", "essays", "updates"]
    },
    {
      name: "pinterest",
      purpose: "avant-garde art, lists, and other rare interesting things I find",
      link: "https://www.pinterest.com/krisyotam/",
      category: "Inspiration",
      tags: ["art", "inspiration", "curation"]
    },
    {
      name: "reddit",
      purpose: "discussions, updates, and social interactions",
      link: "https://www.reddit.com/user/krisyotam/",
      category: "Literature",
      tags: ["discussion", "updates", "social"]
    },
    {
      name: "quora",
      purpose: "answers to questions and knowledge on various topics",
      link: "https://www.quora.com/profile/Kris-Yotam",
      category: "Literature",
      tags: ["writing", "essays", "updates"]
    },
    {
      name: "medium",
      purpose: "occassional literature reviews",
      link: "https://www.medium.com/@krisyotam",
      category: "Literature",
      tags: ["writing", "reviews", "essays"]
    }
  ]
}

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
    const allCategories = MY_SITES_DATA.sites.map((site) => site.category)
    return ["All", ...Array.from(new Set(allCategories))]
  }, [])
  
  const categoryOptions: SelectOption[] = useMemo(() => {
    return categories.map(category => ({
      value: category,
      label: category === "All" ? "All Categories" : category
    }))
  }, [categories])

  const filteredSites = useMemo(() => {
    return MY_SITES_DATA.sites.filter((site: Site) => {
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
      <div className="mb-6 flex items-center gap-4">
        <div className="flex items-center gap-2 whitespace-nowrap">
          <label htmlFor="category-filter" className="text-sm text-muted-foreground">Filter by category:</label>
          <CustomSelect
            value={selectedCategory}
            onValueChange={setSelectedCategory}
            options={categoryOptions}
            className="text-sm min-w-[140px]"
          />
        </div>
        <div className="relative flex-1">
          <input 
            type="text" 
            placeholder="Search socials..." 
            className="w-full h-9 px-3 py-2 border rounded-none text-sm bg-background hover:bg-secondary/50 focus:outline-none focus:bg-secondary/50"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
        </div>
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