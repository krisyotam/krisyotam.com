"use client"

import { useState, useEffect } from "react"
import lectureNotesData from "@/data/lecture-notes/lecture-notes.json"
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
import type { LectureNote } from "@/types/lecture-note"

// Add lecture notes page metadata
const lectureNotesPageData = {
  title: "Lecture Notes",
  subtitle: "Academic Course Materials",
  start_date: "2025-01-01",
  end_date: new Date().toISOString().split('T')[0], // Current date as YYYY-MM-DD
  preview:
    "a collection of my academic lecture notes and course materials",
  status: "In Progress" as const,
  confidence: "likely" as const,
  importance: 8,
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
  const [lectureNotes, setLectureNotes] = useState<LectureNote[]>((lectureNotesData as unknown as LectureNote[]).filter((note: any) => note.state === 'active'))
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

  // No longer need slug logic, just use item.url
  // The category change is now handled directly in the CustomSelect onValueChange

  // Filter lecture notes based on search and category
  const filteredLectureNotes = lectureNotes.filter((item) => {
    const matchesSearch = searchQuery === "" || 
      (item.title ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.abstract ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.keywords ?? []).some((keyword) => (keyword ?? "").toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = currentCategory === "All" || (item.category ?? "") === currentCategory;

    return matchesSearch && matchesCategory;
  }).sort((a, b) => new Date(b.dateStarted ?? "1970-01-01").getTime() - new Date(a.dateStarted ?? "1970-01-01").getTime());

  const handleItemClick = (item: LectureNote) => {
  // Open the url in a new tab
  window.open((item as any).url ?? '', '_blank')
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
    <>
      <style jsx global>{`
        .lecture-notes-container {
          font-family: 'Geist', sans-serif;
        }
      `}</style>
      <div className="lecture-notes-container container max-w-[672px] mx-auto px-4 pt-16 pb-8">
        <PageHeader
          title={lectureNotesPageData.title}
          subtitle={lectureNotesPageData.subtitle}
          start_date={lectureNotesPageData.start_date}
          end_date={lectureNotesPageData.end_date}
          preview={lectureNotesPageData.preview}
          status={lectureNotesPageData.status}
          confidence={lectureNotesPageData.confidence}
          importance={lectureNotesPageData.importance}
        />

      <div className="mt-8">      <div className="mb-6 flex items-center gap-4">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <label htmlFor="category-filter" className="text-sm text-muted-foreground">Filter by category:</label>
            <CustomSelect
              id="category-filter"
              value={currentCategory}
              onValueChange={(value) => {
                if (value === "All") {
                  router.push("/lecture-notes");
                } else {
                  router.push(`/lecture-notes/${slugifyCategory(value)}`);
                }
              }}
              options={[
                { value: "All", label: "All Categories" },
                ...categories.map(category => ({ value: category, label: category }))
              ]}
              className="text-sm min-w-[140px]"
            />
          </div>
          <div className="relative flex-1">
            <Input 
              type="text" 
              placeholder="Search lecture notes..." 
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
          <>            <div className="mt-8">
              <table className="w-full text-sm border border-border overflow-hidden shadow-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50 text-foreground">
                    <th className="py-2 text-left font-medium px-3">Title</th>
                    <th className="py-2 text-left font-medium px-3">Category</th>
                    <th className="py-2 text-left font-medium px-3">Year</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLectureNotes.map((item, index) => (
                    <tr
                      key={item.title}
                      className={`border-b border-border hover:bg-secondary/50 transition-colors cursor-pointer ${
                        index % 2 === 0 ? 'bg-transparent' : 'bg-muted/5'
                      }`}
                      onClick={() => handleItemClick(item)}
                    >
                      <td className="py-2 px-3 font-medium">{item.title}</td>
                      <td className="py-2 px-3">{item.category}</td>
                      <td className="py-2 px-3">{(item as any).year ?? (item.dateStarted ? new Date(item.dateStarted).getFullYear() : '')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredLectureNotes.length === 0 && !loading && (
                <div className="text-muted-foreground text-sm mt-6">No lecture notes found matching your criteria.</div>
              )}
            </div>
          </>
        )}
      </div>
      
      {/* Help Information using PageDescription component */}      <PageDescription 
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
      </div>
    </>
  );
} 