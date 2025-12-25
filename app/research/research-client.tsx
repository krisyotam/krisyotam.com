"use client"

import { useState, useEffect, useMemo } from "react"
import researchDataRaw from "@/data/research/research.json"
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
import { HelpCircle, Download, ExternalLink, Search, LayoutGrid, List } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { PasswordDialog } from "@/components/password-dialog"
import { Input } from "@/components/ui/input"
import { PageDescription } from "@/components/posts/typography/page-description"
import ResearchGrid from "@/components/research-grid"
import ResearchList from "@/components/research-list"
import type { Research } from "@/types/research"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

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

// Research type is imported from types/research

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
  // research JSON has a top-level { research: [...] }
  const researchList = (researchDataRaw as any).research || []
  const [research, setResearch] = useState<Research[]>(researchList)
  // derive categories from status values (active/planned/paused) so the filter has options
  const categories = useMemo((): string[] => (Array.from(new Set(researchList.map((item: any) => String(item.status || '')))) as string[]).filter(Boolean).sort(), [researchList])
  const [itemModalOpen, setItemModalOpen] = useState(false)
  const [selectedResearch, setSelectedResearch] = useState<Research | null>(null)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [selectedLink, setSelectedLink] = useState<string>("")
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const router = useRouter()

  const pathname = usePathname()

  // Sync category from initial prop and pathname changes
  useEffect(() => {
    setCurrentCategory(initialCategory)
  }, [initialCategory])

  // On mount, load persisted view mode from localStorage
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem('research-view')
      if (stored === 'grid' || stored === 'list') setViewMode(stored)
    } catch (e) {
      // ignore
    }
  }, [])

  // Listen to pathname changes and update category accordingly (keeps select in sync on navigation)
  useEffect(() => {
    if (!pathname) return
    const parts = pathname.split('/').filter(Boolean)
    if (parts[0] !== 'research') return
    const slug = parts[1]
    if (!slug) {
      setCurrentCategory('All')
      return
    }
    // find matching category by slug
    const matched = categories.find(c => c.toLowerCase().replace(/\s+/g, '-') === decodeURIComponent(slug).toLowerCase())
    setCurrentCategory(matched || 'All')
  }, [pathname, categories])

  // Show loading state briefly for better UX during category changes
  useEffect(() => {
    setLoading(true)
    const timeout = setTimeout(() => setLoading(false), 200)
    return () => clearTimeout(timeout)
  }, [currentCategory, searchQuery, viewMode])

  // Helper to build the correct route for a research item
  function getResearchUrl(item: Research) {
    const categorySlug = slugifyCategory(item.status || 'all');
    const year = new Date(item.start_date).getFullYear();
    const titleSlug = slugifyTitle(item.name);
    return `/research/${encodeURIComponent(categorySlug)}/${year}/${encodeURIComponent(titleSlug)}`
  }

  function handleCategoryChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const selectedCategory = e.target.value;
    // update UI immediately and navigate
    setCurrentCategory(selectedCategory)
    if (selectedCategory === "All") {
      router.push("/research");
    } else {
      router.push(`/research/${slugifyCategory(selectedCategory)}`);
    }
  }

  // Filter research based on search and category
  const filteredResearch = research.filter((item) => {
    const matchesSearch = searchQuery === "" || 
      (item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = currentCategory === "All" || (item.status === currentCategory)

    return matchesSearch && matchesCategory
  }).sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());

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
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="container max-w-[672px] mx-auto px-4 pt-16 pb-8">
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
              <label htmlFor="category-filter" className="text-sm text-muted-foreground">Filter:</label>
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

            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-muted-foreground" />
              </div>
              <Input
                placeholder="Search research papers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 rounded-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className={cn('rounded-none', viewMode === 'list' ? 'bg-secondary/50' : '')} onClick={() => { setViewMode('list'); try { window.localStorage.setItem('research-view','list') } catch(e){} }} aria-label="List view"><List className="h-4 w-4" /></Button>
              <Button variant="outline" size="icon" className={cn('rounded-none', viewMode === 'grid' ? 'bg-secondary/50' : '')} onClick={() => { setViewMode('grid'); try { window.localStorage.setItem('research-view','grid') } catch(e){} }} aria-label="Grid view"><LayoutGrid className="h-4 w-4" /></Button>
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
              {filteredResearch.length === 0 && (
                <div className="text-muted-foreground text-sm mt-6">No research found for this category.</div>
              )}

              {filteredResearch.length > 0 && (
                viewMode === "list" ? (
                  <ResearchList items={filteredResearch} onItemClick={handleItemClick} onBentoClick={handleDownloadClick} />
                ) : (
                  <ResearchGrid items={filteredResearch} onItemClick={handleItemClick} onBentoClick={handleDownloadClick} />
                )
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
                  {selectedResearch.name}
                  <Badge variant={selectedResearch.status === "active" ? "destructive" : "secondary"} className="ml-2">
                    {selectedResearch.status}
                  </Badge>
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold mb-2">Overview</h4>
                  <p className="text-sm text-muted-foreground">{selectedResearch.description}</p>
                </div>

                {selectedResearch.imgs && selectedResearch.imgs.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Images</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedResearch.imgs.map((img, i) => (
                        <img key={i} src={img.img_url} alt={img.title} className="w-full h-32 object-cover border border-border" />
                      ))}
                    </div>
                  </div>
                )}

                {selectedResearch.are_na_link && (
                  <div className="pt-4 border-t border-border">
                    <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); window.open(selectedResearch.are_na_link, '_blank') }}>
                      <img src="/icons/arena.svg" alt="Are.na" className="h-4 w-4 mr-2" />
                      View on Are.na
                    </Button>
                  </div>
                )}
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
      </div>
    </div>
  )
}