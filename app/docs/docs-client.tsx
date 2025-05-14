"use client"

import { useState, useEffect } from "react"
import docsData from "@/data/docs.json"
import { PageHeader } from "@/components/page-header"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { HelpCircle, Download, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { PasswordDialog } from "@/components/password-dialog"
import { Input } from "@/components/ui/input"
import { PageDescription } from "@/components/posts/typography/page-description"

// Add docs page metadata
const docsPageData = {
  title: "Docs",
  date: new Date().toISOString(),
  preview:
    "archived collection of my deep research docs from various models",
  status: "In Progress" as const,
  confidence: "likely" as const,
  importance: 8,
}

interface DocItem {
  id: string
  title: string
  slug: string
  description: string
  category: string
  tags: string[]
  date: string
  pdfUrl: string
  sourceUrl: string
  aiModel: string
  version: string
}

function slugifyCategory(category: string) {
  return category.toLowerCase().replace(/\s+/g, "-");
}

function slugifyTitle(title: string) {
  return title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
}

export function DocsClient({ initialCategory = "All" }: { initialCategory?: string }) {
  const [loading, setLoading] = useState(true)
  const [currentCategory, setCurrentCategory] = useState(initialCategory)
  const [searchQuery, setSearchQuery] = useState("")
  const [docs, setDocs] = useState<DocItem[]>(docsData)
  const [categories, setCategories] = useState<string[]>([])
  const [itemModalOpen, setItemModalOpen] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState<DocItem | null>(null)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [selectedLink, setSelectedLink] = useState<string>("")
  const router = useRouter()

  useEffect(() => {
    // Extract unique categories and sort them
    setCategories(Array.from(new Set(docsData.map((item) => item.category))).sort())
    
    // Update current category when initialCategory changes
    setCurrentCategory(initialCategory)
    
    // Show loading state briefly for better UX during category changes
    setLoading(true)
    const timeout = setTimeout(() => setLoading(false), 300)
    return () => clearTimeout(timeout)
  }, [initialCategory])

  // Helper to build the correct route for a document item
  function getDocUrl(item: DocItem) {
    const categorySlug = slugifyCategory(item.category);
    const year = new Date(item.date).getFullYear();
    const titleSlug = item.slug;
    return `/docs/${encodeURIComponent(categorySlug)}/${year}/${encodeURIComponent(titleSlug)}`
  }

  function handleCategoryChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const selectedCategory = e.target.value;
    if (selectedCategory === "All") {
      router.push("/docs");
    } else {
      router.push(`/docs/${slugifyCategory(selectedCategory)}`);
    }
  }

  // Filter docs based on search and category
  const filteredDocs = docs.filter((item) => {
    const matchesSearch = searchQuery === "" || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = currentCategory === "All" || item.category === currentCategory

    return matchesSearch && matchesCategory
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleItemClick = (item: DocItem) => {
    // Navigate to the detail page
    router.push(getDocUrl(item))
  }

  const handleDownloadClick = (link: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedLink(link)
    setShowPasswordDialog(true)
  }

  const handlePasswordSuccess = () => {
    window.open(selectedLink, "_blank")
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <PageHeader
        title={docsPageData.title}
        subtitle={docsPageData.subtitle}
        date={docsPageData.date}
        preview={docsPageData.preview}
        status={docsPageData.status}
        confidence={docsPageData.confidence}
        importance={docsPageData.importance}
      />

      <div className="mt-8">
        <div className="mb-6 space-y-4">
          <Input
            placeholder="Search AI documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
          
          <div className="flex items-center gap-2">
            <label htmlFor="category-filter" className="text-sm text-muted-foreground">Filter by category:</label>
            <select
              id="category-filter"
              className="border rounded px-2 py-1 text-sm bg-background"
              value={currentCategory}
              onChange={handleCategoryChange}
            >
              <option value="All">All</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
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
            <table className="w-full text-sm border border-muted/40 rounded-md overflow-hidden">
              <thead>
                <tr className="text-muted-foreground border-b border-muted/40 bg-muted/10">
                  <th className="py-2 text-left font-normal px-3">Title</th>
                  <th className="py-2 text-left font-normal px-3">Model</th>
                  <th className="py-2 text-left font-normal px-3">Year</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocs.map(item => (
                  <tr
                    key={item.id}
                    className="border-b border-muted/30 hover:bg-muted/20 cursor-pointer transition-colors"
                    onClick={() => handleItemClick(item)}
                  >
                    <td className="py-2 pr-4 px-3 font-medium">{item.title}</td>
                    <td className="py-2 pr-4 px-3">{item.aiModel} {item.version}</td>
                    <td className="py-2 pr-4 px-3">{new Date(item.date).getFullYear()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredDocs.length === 0 && !loading && (
              <div className="text-muted-foreground text-sm mt-6">No documents found for this category.</div>
            )}
          </>
        )}
      </div>
      
      {/* Help Information using PageDescription component */}
      <PageDescription 
        title="Docs"
        description="This page is a archive for my deep research docs from various models. Deep Research is conducted on a variety of topics with the seriousness of the 
        sources depending on the topic. For more serious topics specified articles are fed to the model curated by myself."
      />

      {/* Password Dialog for protected downloads */}
      <PasswordDialog
        isOpen={showPasswordDialog}
        onClose={() => setShowPasswordDialog(false)}
        onSuccess={handlePasswordSuccess}
        researchId={selectedLink}
        title="Document Access"
        status="active"
      />
    </main>
  )
} 