"use client"

import { useState, useEffect } from "react"
import researchData from "@/data/research.json"
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

// Add research page metadata
const researchPageData = {
  title: "Research",
  subtitle: "Academic Papers and Projects",
  date: new Date().toISOString(),
  preview:
    "A collection of my research papers, publications, and ongoing academic projects across various disciplines.",
  status: "In Progress" as const,
  confidence: "likely" as const,
  importance: 8,
}

interface Research {
  id: string
  title: string
  abstract: string
  importance: string | number
  authors: string[]
  subject: string
  keywords: string[]
  postedBy: string
  postedOn: string
  dateStarted: string
  status: string
  bibliography: string[]
  img: string
  pdfLink: string
  sourceLink: string
  category: string
  tags: string[]
}

function slugifyCategory(category: string) {
  return category.toLowerCase().replace(/\s+/g, "-");
}

function slugifyTitle(title: string) {
  return title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
}

export function ResearchClient({ initialCategory = "All" }: { initialCategory?: string }) {
  const [loading, setLoading] = useState(true)
  const [currentCategory, setCurrentCategory] = useState(initialCategory)
  const [searchQuery, setSearchQuery] = useState("")
  const [research, setResearch] = useState<Research[]>(researchData)
  const [categories, setCategories] = useState<string[]>([])
  const [helpModalOpen, setHelpModalOpen] = useState(false)
  const [itemModalOpen, setItemModalOpen] = useState(false)
  const [selectedResearch, setSelectedResearch] = useState<Research | null>(null)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [selectedLink, setSelectedLink] = useState<string>("")
  const router = useRouter()

  useEffect(() => {
    // Extract unique categories and sort them
    setCategories(Array.from(new Set(researchData.map((item) => item.category))).sort())
    
    // Update current category when initialCategory changes
    setCurrentCategory(initialCategory)
    
    // Show loading state briefly for better UX during category changes
    setLoading(true)
    const timeout = setTimeout(() => setLoading(false), 300)
    return () => clearTimeout(timeout)
  }, [initialCategory])

  // Helper to build the correct route for a research item
  function getResearchUrl(item: Research) {
    const categorySlug = slugifyCategory(item.category);
    const year = new Date(item.dateStarted).getFullYear();
    const titleSlug = slugifyTitle(item.title);
    return `/research/${encodeURIComponent(categorySlug)}/${year}/${encodeURIComponent(titleSlug)}`
  }

  function handleCategoryChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const selectedCategory = e.target.value;
    if (selectedCategory === "All") {
      router.push("/research");
    } else {
      router.push(`/research/${slugifyCategory(selectedCategory)}`);
    }
  }

  // Filter research based on search and category
  const filteredResearch = research.filter((item) => {
    const matchesSearch = searchQuery === "" || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.keywords.some((keyword) => keyword.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = currentCategory === "All" || item.category === currentCategory

    return matchesSearch && matchesCategory
  }).sort((a, b) => new Date(b.dateStarted).getTime() - new Date(a.dateStarted).getTime());

  const handleItemClick = (item: Research) => {
    // Navigate to the detail page instead of opening a modal
    router.push(getResearchUrl(item))
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
    <main className="max-w-3xl mx-auto px-4 py-12">
      <PageHeader
        title={researchPageData.title}
        subtitle={researchPageData.subtitle}
        date={researchPageData.date}
        preview={researchPageData.preview}
        status={researchPageData.status}
        confidence={researchPageData.confidence}
        importance={researchPageData.importance}
      />

      <div className="mt-8">
        <div className="mb-6 space-y-4">
          <Input
            placeholder="Search research papers..."
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
                  <th className="py-2 text-left font-normal px-3">Category</th>
                  <th className="py-2 text-left font-normal px-3">Year</th>
                </tr>
              </thead>
              <tbody>
                {filteredResearch.map(item => (
                  <tr
                    key={item.id}
                    className="border-b border-muted/30 hover:bg-muted/20 cursor-pointer transition-colors"
                    onClick={() => handleItemClick(item)}
                  >
                    <td className="py-2 pr-4 px-3 font-medium">{item.title}</td>
                    <td className="py-2 pr-4 px-3">{item.category}</td>
                    <td className="py-2 pr-4 px-3">{new Date(item.dateStarted).getFullYear()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredResearch.length === 0 && !loading && (
              <div className="text-muted-foreground text-sm mt-6">No research found for this category.</div>
            )}
          </>
        )}
      </div>
      
      {/* Help Modal */}
      <Dialog open={helpModalOpen} onOpenChange={setHelpModalOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed bottom-4 left-4 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200"
            onClick={() => setHelpModalOpen(true)}
          >
            <HelpCircle className="h-5 w-5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-background rounded-lg shadow-2xl border-0">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-2xl font-semibold">About Research</DialogTitle>
            <DialogDescription className="text-base leading-relaxed">
              This page showcases my research papers, publications, and ongoing projects. Each entry provides a summary
              of the research topic, its importance, and links to the full paper and source materials. You can filter by
              category or search for specific topics using the search bar.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Research Item Modal */}
      {selectedResearch && (
        <Dialog open={itemModalOpen} onOpenChange={setItemModalOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold mb-4">
                {selectedResearch.title}
                <Badge variant={selectedResearch.status === "active" ? "destructive" : "secondary"} className="ml-2">
                  {selectedResearch.status}
                </Badge>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold mb-2">Abstract</h4>
                <p className="text-sm text-muted-foreground">{selectedResearch.abstract}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2">Importance</h4>
                <p className="text-sm text-muted-foreground">{selectedResearch.importance}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2">Authors</h4>
                <p className="text-sm text-muted-foreground">{selectedResearch.authors.join(", ")}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2">Keywords</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedResearch.keywords.map((keyword, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-border gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={(e) => handleDownloadClick(selectedResearch.pdfLink, e)}
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(selectedResearch.sourceLink, "_blank");
                  }}
                >
                  <ExternalLink className="h-4 w-4" />
                  View Source
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Password Dialog for protected downloads */}
      <PasswordDialog
        open={showPasswordDialog}
        onOpenChange={setShowPasswordDialog}
        onSuccess={handlePasswordSuccess}
      />
    </main>
  )
} 