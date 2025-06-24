"use client"

import { useState, useEffect } from "react"
import reportsData from "@/data/reports/reports.json"
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
import { CustomSelect, SelectOption } from "@/components/ui/custom-select"

// Add reports page metadata
const reportsPageData = {
  title: "Reports",
  subtitle: "Formal Reports on Diverse Topics",
  date: new Date().toISOString(),
  preview:
    "a collection of my formal reports on diverse topics",
  status: "In Progress" as const,
  confidence: "likely" as const,
  importance: 8,
}

interface Report {
  id: string
  title: string
  importance: string | number
  authors: string[]
  postedBy: string
  postedOn: string
  dateStarted: string
  status: string
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

export function ReportsClient({ initialCategory = "All" }: { initialCategory?: string }) {
  const [loading, setLoading] = useState(true)
  const [currentCategory, setCurrentCategory] = useState(initialCategory)
  const [searchQuery, setSearchQuery] = useState("")
  const [reports, setReports] = useState<Report[]>(reportsData)
  const [categories, setCategories] = useState<string[]>([])
  const [itemModalOpen, setItemModalOpen] = useState(false)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [selectedLink, setSelectedLink] = useState<string>("")
  const router = useRouter();
  useEffect(() => {    // Extract unique categories from actual data and sort them
    const actualCategories = Array.from(new Set(reportsData.map((item: any) => item.category))).sort()
    setCategories(actualCategories as string[])
    
    // Update current category when initialCategory changes
    setCurrentCategory(initialCategory)
    
    // Show loading state briefly for better UX during category changes
    setLoading(true)
    const timeout = setTimeout(() => setLoading(false), 300)
    return () => clearTimeout(timeout)
  }, [initialCategory])

  // Convert categories to SelectOption format - only use categories that exist in data
  const categoryOptions: SelectOption[] = ["All", ...categories].map(category => ({
    value: category === "All" ? "all" : slugifyCategory(category),
    label: category === "All" ? "All Categories" : category
  }));  // Helper to build the correct route for a report item
  function getReportUrl(item: Report) {
    const year = new Date(item.dateStarted).getFullYear();
    const titleSlug = slugifyTitle(item.title);
    return `/reports/${year}/${encodeURIComponent(titleSlug)}`
  }  // Filter reports based on search and category
  const filteredReports = reports.filter((item) => {
    const matchesSearch = searchQuery === "" || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = currentCategory === "All" || 
      item.category === currentCategory

    return matchesSearch && matchesCategory
  }).sort((a, b) => new Date(b.dateStarted).getTime() - new Date(a.dateStarted).getTime());

  const handleItemClick = (item: Report) => {
    // Navigate to the detail page instead of opening a modal
    router.push(getReportUrl(item))
  }

  const handleDownloadClick = (link: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedLink(link)
    setShowPasswordDialog(true)
  }

  const handlePasswordSuccess = () => {
    window.open(selectedLink, "_blank")
  }
  // Helper function to convert slug back to category name  
  function categoryFromSlug(slug: string): string {
    return slug.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }  const handleCategoryChange = (selectedValue: string) => {
    if (selectedValue === "all") {
      setCurrentCategory("All")
      router.push("/reports")
    } else {
      const categoryName = categoryFromSlug(selectedValue)
      setCurrentCategory(categoryName)
      router.push(`/reports/${selectedValue}`)
    }
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <PageHeader
        title={reportsPageData.title}
        subtitle={reportsPageData.subtitle}
        date={reportsPageData.date}
        preview={reportsPageData.preview}
        status={reportsPageData.status}
        confidence={reportsPageData.confidence}
        importance={reportsPageData.importance}
      />

      <div className="mt-8">        <div className="mb-6 flex items-center gap-4">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <label htmlFor="category-filter" className="text-sm text-muted-foreground">Filter by category:</label>            <CustomSelect
              value={currentCategory === "All" ? "all" : slugifyCategory(currentCategory)}
              onValueChange={handleCategoryChange}
              options={categoryOptions}
              className="text-sm min-w-[140px]"
            />
          </div>
              <div className="relative flex-1">
            <input 
              type="text" 
              placeholder="Search reports..." 
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
                  <th className="py-2 text-left font-medium px-3">Category</th>
                  <th className="py-2 text-left font-medium px-3">Year</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((item, index) => (
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
            {filteredReports.length === 0 && !loading && (
              <div className="text-muted-foreground text-sm mt-6">No reports found for this category.</div>
            )}
          </>
        )}
      </div>
      
      {/* Help Information using PageDescription component */}      <PageDescription 
        title="About Reports"
        description="This page showcases my more formal reports on topics. These are tex documents for writings that I just felt should be done in a more formal way. A lot of these also come from my experiments with Ultralearning, and taking courses via things like MIT OpenCourseWare."
      />

      {/* Report Item Modal */}
      {selectedReport && (
        <Dialog open={itemModalOpen} onOpenChange={setItemModalOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold mb-4">
                {selectedReport.title}
                <Badge variant={selectedReport.status === "active" ? "destructive" : "secondary"} className="ml-2">
                  {selectedReport.status}
                </Badge>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold mb-2">Importance</h4>
                <p className="text-sm text-muted-foreground">{selectedReport.importance}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2">Authors</h4>
                <p className="text-sm text-muted-foreground">{selectedReport.authors.join(", ")}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedReport.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-4 border-t border-border">
                {selectedReport.pdfLink ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={(e) => handleDownloadClick(selectedReport.pdfLink, e)}
                  >
                    <Download className="h-4 w-4" />
                    Download PDF
                  </Button>
                ) : null}
                
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => window.open(selectedReport.sourceLink, "_blank")}
                >
                  <ExternalLink className="h-4 w-4" />
                  Source
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