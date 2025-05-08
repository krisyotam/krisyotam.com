"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import researchData from "@/data/research.json" // Import JSON directly
import { Button } from "@/components/ui/button"
import { HelpCircle, Download, ExternalLink } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import { PageHeader } from "@/components/page-header"
import { Badge } from "@/components/ui/badge"
import { PasswordDialog } from "@/components/password-dialog"

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
  importance: string
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

export default function ResearchPage() {
  const [research, setResearch] = useState<Research[]>(researchData)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [categories, setCategories] = useState<string[]>([])
  const [helpModalOpen, setHelpModalOpen] = useState(false)
  const [itemModalOpen, setItemModalOpen] = useState(false)
  const [selectedResearch, setSelectedResearch] = useState<Research | null>(null)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [selectedLink, setSelectedLink] = useState<string>("")

  useEffect(() => {
    // Extract unique categories and convert Set to Array
    setCategories(Array.from(new Set(researchData.map((item) => item.category))))
  }, [])

  const filteredResearch = research.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.keywords.some((keyword) => keyword.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = !selectedCategory || item.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const handleItemClick = (item: Research) => {
    setSelectedResearch(item)
    setItemModalOpen(true)
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
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto p-8 md:p-16 lg:p-24">
        {/* Add the PageHeader component */}
        <PageHeader
          title={researchPageData.title}
          subtitle={researchPageData.subtitle}
          date={researchPageData.date}
          preview={researchPageData.preview}
          status={researchPageData.status}
          confidence={researchPageData.confidence}
          importance={researchPageData.importance}
        />

        {/* Search and Filters */}
        <div className="space-y-4 mb-8">
          <Input
            placeholder="Search research..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />

          {/* Categories Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`p-2 text-sm rounded-md transition-colors ${selectedCategory === null ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"}`}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`p-2 text-sm rounded-md transition-colors ${selectedCategory === category ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {filteredResearch.length === 0 ? (
          <p className="text-center text-muted-foreground mt-8">No research found matching your criteria.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-4 px-2 text-left">Year</th>
                  <th className="py-4 px-2 text-left">Title</th>
                  <th className="py-4 px-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredResearch.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-border hover:bg-secondary/50 transition-colors cursor-pointer"
                    onClick={() => handleItemClick(item)}
                  >
                    <td className="py-4 px-2">{new Date(item.dateStarted).getFullYear()}</td>
                    <td className="py-4 px-2 text-foreground">{item.title}</td>
                    <td className="py-4 px-2 text-muted-foreground">{item.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
              category or search for specific topics using the search bar. Any research related to
              <a
                href="https://saintkris.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#1e3a8a" }}
                className="hover:text-theology-blue no-underline"
              >
                {" "}
                theology
              </a>
              ,
              <a
                href="https://krisphysics.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#1e3a8a" }}
                className="hover:text-theology-blue no-underline"
              >
                {" "}
                physics
              </a>
              , or
              <a
                href="https://krismathblog.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#1e3a8a" }}
                className="hover:text-theology-blue no-underline"
              >
                {" "}
                mathematics
              </a>
              . can be found at their own respective sites as those are some isolated topics in my life, which my
              research is more rigirous and of a longer time horizon.
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
                <h4 className="text-sm font-semibold mb-2">Subject</h4>
                <p className="text-sm text-muted-foreground">{selectedResearch.subject}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2">Keywords</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedResearch.keywords.map((keyword) => (
                    <span key={keyword} className="text-xs bg-muted px-2 py-1 rounded-full">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2">Bibliography</h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  {selectedResearch.bibliography.map((entry, index) => (
                    <li key={index}>{entry}</li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-between text-xs text-muted-foreground">
                <div>
                  <p>Posted by {selectedResearch.postedBy}</p>
                  <p>Posted on {new Date(selectedResearch.postedOn).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p>Research started</p>
                  <p>{new Date(selectedResearch.dateStarted).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <Button className="flex-1" onClick={(e) => handleDownloadClick(selectedResearch.pdfLink, e)}>
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
                <Button variant="outline" className="flex-1" onClick={(e) => handleDownloadClick(selectedResearch.sourceLink, e)}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Source
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Password Dialog */}
      {selectedResearch && (
        <PasswordDialog
          isOpen={showPasswordDialog}
          onClose={() => setShowPasswordDialog(false)}
          onSuccess={handlePasswordSuccess}
          researchId={selectedResearch.id}
          title={selectedResearch.title}
          status={selectedResearch.status}
        />
      )}
    </main>
  )
}

