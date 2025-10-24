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
import { PageDescription } from "@/components/posts/typography/page-description"

// Add research page metadata
type ResearchPageData = {
  title: string;
  subtitle: string;
  date: string;
  preview: string;
  status: "In Progress";
  confidence: "likely";
  importance: number;
};

const researchPageData: ResearchPageData = {
  title: "Research",
  subtitle: "Academic Papers and Projects",
  date: new Date().toISOString(),
  preview:
    "a collection of my published research papers",
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
  img?: string
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
        start_date={(researchPageData as any).start_date || researchPageData.date || new Date().toISOString().split('T')[0]}
        end_date={(researchPageData as any).end_date}
        preview={researchPageData.preview}
        status={researchPageData.status}
        confidence={researchPageData.confidence}
        importance={researchPageData.importance}
      />

      <div className="mt-8">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex items-center gap-2 whitespace-nowrap">
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
          
          <div className="relative flex-1">
            <Input
              placeholder="Search research papers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
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
                  <th className="py-2 text-left font-medium px-3">Category</th>
                  <th className="py-2 text-left font-medium px-3">Year</th>
                </tr>
              </thead>
              <tbody>
                {filteredResearch.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`border-b border-border hover:bg-secondary/50 transition-colors cursor-pointer ${index % 2 === 0 ? 'bg-transparent' : 'bg-muted/5'}`}
                    onClick={() => handleItemClick(item)}
                  >
                    <td className="py-2 px-3 font-medium">{item.title}</td>
                    <td className="py-2 px-3">{item.category}</td>
                    <td className="py-2 px-3">{new Date(item.dateStarted).getFullYear()}</td>
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
      
      {/* Help Information using PageDescription component */}
      <PageDescription 
        title="About Research"
        description="A collection of my published research papers, final pdfs, and LaTeX source code."
      />

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