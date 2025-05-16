"use client"

import { useState, useEffect } from "react"
import lectureNotesData from "@/data/lecture-notes.json"
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

// Add lecture notes page metadata
const lectureNotesPageData = {
  title: "Lecture Notes",
  subtitle: "Academic Course Materials",
  date: new Date().toISOString(),
  preview:
    "a collection of my academic lecture notes and course materials",
  status: "In Progress" as const,
  confidence: "likely" as const,
  importance: 8,
}

interface LectureNote {
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

export function LectureNotesClient({ initialCategory = "All" }: { initialCategory?: string }) {
  const [loading, setLoading] = useState(true)
  const [currentCategory, setCurrentCategory] = useState(initialCategory)
  const [searchQuery, setSearchQuery] = useState("")
  const [lectureNotes, setLectureNotes] = useState<LectureNote[]>(lectureNotesData)
  const [categories, setCategories] = useState<string[]>([])
  const [itemModalOpen, setItemModalOpen] = useState(false)
  const [selectedLectureNote, setSelectedLectureNote] = useState<LectureNote | null>(null)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [selectedLink, setSelectedLink] = useState<string>("")
  const router = useRouter()

  useEffect(() => {
    // Extract unique categories and sort them
    setCategories(Array.from(new Set(lectureNotesData.map((item) => item.category))).sort())
    
    // Update current category when initialCategory changes
    setCurrentCategory(initialCategory)
    
    // Show loading state briefly for better UX during category changes
    setLoading(true)
    const timeout = setTimeout(() => setLoading(false), 300)
    return () => clearTimeout(timeout)
  }, [initialCategory])

  // Helper to build the correct route for a lecture note item
  function getLectureNoteUrl(item: LectureNote) {
    const categorySlug = slugifyCategory(item.category);
    const year = new Date(item.dateStarted).getFullYear();
    const titleSlug = slugifyTitle(item.title);
    return `/lecture-notes/${encodeURIComponent(categorySlug)}/${year}/${encodeURIComponent(titleSlug)}`
  }

  function handleCategoryChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const selectedCategory = e.target.value;
    if (selectedCategory === "All") {
      router.push("/lecture-notes");
    } else {
      router.push(`/lecture-notes/${slugifyCategory(selectedCategory)}`);
    }
  }

  // Filter lecture notes based on search and category
  const filteredLectureNotes = lectureNotes.filter((item) => {
    const matchesSearch = searchQuery === "" || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.keywords.some((keyword) => keyword.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = currentCategory === "All" || item.category === currentCategory

    return matchesSearch && matchesCategory
  }).sort((a, b) => new Date(b.dateStarted).getTime() - new Date(a.dateStarted).getTime());

  const handleItemClick = (item: LectureNote) => {
    // Navigate to the detail page instead of opening a modal
    router.push(getLectureNoteUrl(item))
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
        title={lectureNotesPageData.title}
        subtitle={lectureNotesPageData.subtitle}
        date={lectureNotesPageData.date}
        preview={lectureNotesPageData.preview}
        status={lectureNotesPageData.status}
        confidence={lectureNotesPageData.confidence}
        importance={lectureNotesPageData.importance}
      />

      <div className="mt-8">
        <div className="mb-6 space-y-4">
          <Input
            placeholder="Search lecture notes..."
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
                {filteredLectureNotes.map(item => (
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
            {filteredLectureNotes.length === 0 && !loading && (
              <div className="text-muted-foreground text-sm mt-6">No lecture notes found for this category.</div>
            )}
          </>
        )}
      </div>
      
      {/* Help Information using PageDescription component */}
      <PageDescription 
        title="About Lecture Notes"
        description="This page showcases my lecture notes from various academic courses. There are notes from my time at University of Indiana Bloomington, as well MIT OpenCourseWare, Moocs, Udemy, Youtube Lectures, various University Guest Lectures and in the future some IAS Lectures."
      />

      {/* Password Dialog for protected downloads */}
      <PasswordDialog
        open={showPasswordDialog}
        onOpenChange={setShowPasswordDialog}
        onSuccess={handlePasswordSuccess}
        title="Lecture Notes"
        status="active"
      />
    </main>
  );
} 