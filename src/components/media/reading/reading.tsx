/* =============================================================================
 * READING COMPONENTS
 * Unified component file for all reading-related UI
 *
 * Sections:
 *   1. IMPORTS
 *   2. TYPES & INTERFACES
 *   3. CONFIGURATION
 *   4. HELPER FUNCTIONS
 *   5. UI COMPONENTS
 *      - ReadingNavigation (main page tabs)
 *      - ReadingBookCard (book display card)
 *      - ReadingDataLoader (loading/error wrapper)
 *   6. TABLE COMPONENTS
 *      - ReadTable (unified table for blogs, stories, verse, essays, papers)
 *   7. CONTENT SECTIONS
 *      - ReadingSubTabs (sub-navigation for /read page)
 *      - ReadingLists (curated reading lists)
 *      - CurrentlyReading (homepage widget)
 *   8. PAGE CONTENT
 *      - ReadingPageContent (main page router)
 *   9. EXPORTS
 * ============================================================================= */

"use client"

/* =============================================================================
 * 1. IMPORTS
 * ============================================================================= */

import { useState, useEffect, useMemo, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { Star } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { CustomSelect } from "@/components/ui/custom-select"
import { useReadingData } from "@/app/(reading)/reading-data-context"

/* =============================================================================
 * 2. TYPES & INTERFACES
 * ============================================================================= */

// Page type for routing
export type ReadingPageType =
  | "reading"
  | "read"
  | "want-to-read"
  | "reading-lists"
  | "reading-log"
  | "reading-stats"

// Content type for tables
type ContentType = 'blogs' | 'short-stories' | 'verse' | 'essays' | 'papers'

// Sub-tab type for /read page
type ReadingSubTabType = "books" | "audiobooks" | "blog-posts" | "short-stories" | "verse" | "essays" | "papers"

// Book interfaces
interface Book {
  title: string
  subtitle: string
  author: string
  cover: string
  link: string
}

interface JsonBook {
  title: string
  subtitle: string
  author: string
  cover: string
  link: string
}

interface Audiobook {
  title: string
  subtitle?: string
  author: string
  cover?: string
  link?: string
}

// Table item interface
interface ReadTableItem {
  title: string
  author: string | string[]
  publication_year: number
  source_link?: string
  archive_link?: string
  verse_type?: string
}

// Reading log interfaces
interface ReadingLogEntry {
  date: string
  title: string
  author: string
  type: string
  minutes: number
}

interface ReadingLogData {
  log: ReadingLogEntry[]
}

// Reading lists interfaces
interface LocalBook {
  title: string
  isbn13: string
}

interface ReadingList {
  id: string
  title: string
  description: string
  author: string
  books: LocalBook[]
}

interface ReadingListsData {
  lists: ReadingList[]
}

/* =============================================================================
 * 3. CONFIGURATION
 * ============================================================================= */

// Table content type configuration
const contentConfig: Record<ContentType, {
  label: string
  labelPlural: string
  apiType: string
  responseKey: string
}> = {
  'blogs': { label: 'blog post', labelPlural: 'blog posts', apiType: 'blogs', responseKey: 'blogs' },
  'short-stories': { label: 'short story', labelPlural: 'short stories', apiType: 'short-stories', responseKey: 'stories' },
  'verse': { label: 'verse', labelPlural: 'verses', apiType: 'verse', responseKey: 'verse' },
  'essays': { label: 'essay', labelPlural: 'essays', apiType: 'essays', responseKey: 'essays' },
  'papers': { label: 'paper', labelPlural: 'papers', apiType: 'papers', responseKey: 'papers' }
}

// Sub-tab labels for /read page
const subTabLabels: Record<ReadingSubTabType, string> = {
  "books": "Books",
  "audiobooks": "Audiobooks",
  "blog-posts": "Blog Posts",
  "short-stories": "Short Stories",
  "verse": "Verse",
  "essays": "Essays",
  "papers": "Papers",
}

// Currently reading static data (update when changing books)
const CURRENT_BOOK = {
  title: "My Year of Rest and Relaxation",
  author: "Ottessa Moshfegh",
  coverImage: "https://krisyotam.com/doc/media/images/literature/2018-my-year-of-rest-and-relaxation-ottessa-moshfegh.jpg",
}

/* =============================================================================
 * 4. HELPER FUNCTIONS
 * ============================================================================= */

// Format authors for display (handles string or array)
function formatAuthors(author: string | string[]): ReactNode {
  if (!author) return 'Unknown Author'
  if (typeof author === 'string') return author
  if (author.length === 0) return 'Unknown Author'
  if (author.length === 1) return author[0]
  return (
    <span className="flex items-center gap-1">
      {author[0]} et al.
      <span className="inline-flex items-center justify-center w-3 h-3 text-xs rounded-full bg-muted text-muted-foreground cursor-help border" title={author.join(', ')}>i</span>
    </span>
  )
}

// Get searchable author string
function getAuthorSearchString(author: string | string[]): string {
  if (typeof author === 'string') return author.toLowerCase()
  return author.join(' ').toLowerCase()
}

// Format date for display
function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })
}

// Format minutes to hours/minutes
function formatTime(minutes: number) {
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    if (remainingMinutes === 0) return `${hours}h`
    return `${hours}h ${remainingMinutes}m`
  }
  return `${minutes}m`
}

// Open URL in new tab
function openUrl(url: string) {
  const finalUrl = url.startsWith('http') ? url : `https://${url}`
  window.open(finalUrl, '_blank', 'noopener,noreferrer')
}

/* =============================================================================
 * 5. UI COMPONENTS
 * ============================================================================= */

// ------------- ReadingNavigation -------------
// Main page-level tab navigation
export function ReadingNavigation() {
  const pathname = usePathname()
  const tabs = [
    { href: "/reading", label: "Reading", isActive: pathname === "/reading" },
    { href: "/read", label: "Read", isActive: pathname === "/read" || pathname.startsWith("/read#") },
    { href: "/want-to-read", label: "Want to Read", isActive: pathname === "/want-to-read" },
    { href: "/reading-lists", label: "Lists", isActive: pathname === "/reading-lists" },
    { href: "/reading-log", label: "Reading Log", isActive: pathname === "/reading-log" },
    { href: "/reading-stats", label: "Stats", isActive: pathname === "/reading-stats" },
  ]

  return (
    <div className="relative mb-8">
      <div className="flex border-b border-border">
        {tabs.map((tab) => (
          <Link key={tab.href} href={tab.href}
            className={`px-4 py-2 text-sm font-medium relative transition-colors ${tab.isActive ? "text-foreground border-b-2 border-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            {tab.label}
          </Link>
        ))}
      </div>
    </div>
  )
}

// ------------- ReadingBookCard -------------
// Book display card with cover, title, author, rating
interface ReadingBookCardProps {
  coverUrl: string
  title: string
  subtitle?: string
  author: string
  rating: number
  onClick?: () => void
}

export function ReadingBookCard({ coverUrl, title, subtitle, author, rating, onClick }: ReadingBookCardProps) {
  return (
    <Card className="flex overflow-hidden transition-colors hover:bg-accent/50 group h-[140px] cursor-pointer" onClick={onClick}>
      <div className="w-[100px] bg-muted p-4">
        <div className="relative h-[100px] w-full">
          <Image src={coverUrl || "/placeholder.svg"} alt={title} fill className="object-cover"
            unoptimized={coverUrl?.startsWith("http")}
            onError={(e) => { e.currentTarget.src = "/placeholder.svg?height=100&width=100" }} />
        </div>
      </div>
      <div className="flex-1 p-4 overflow-hidden">
        <div className="space-y-1.5">
          <h3 className="font-medium leading-tight line-clamp-2">{title}</h3>
          {subtitle && <p className="text-sm text-muted-foreground line-clamp-1">{subtitle}</p>}
          <p className="text-sm text-muted-foreground truncate">by {author}</p>
        </div>
        {rating > 0 && (
          <div className="flex items-center gap-1.5 mt-2">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="text-sm text-muted-foreground">{rating}/5</span>
          </div>
        )}
      </div>
    </Card>
  )
}

// ------------- ReadingDataLoader -------------
// Wrapper that shows loading/error states
interface ReadingDataLoaderProps {
  children: React.ReactNode
}

export function ReadingDataLoader({ children }: ReadingDataLoaderProps) {
  const { loading, error } = useReadingData()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-2">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900"></div>
          <p className="text-muted-foreground text-sm">Loading reading data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-2">
          <p className="text-red-600 text-sm">Error loading reading data</p>
          <p className="text-muted-foreground text-xs">{error}</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

/* =============================================================================
 * 6. TABLE COMPONENTS
 * ============================================================================= */

// ------------- ReadTable -------------
// Unified table for blogs, short-stories, verse, essays, papers
interface ReadTableProps {
  data?: ReadTableItem[]
  contentType: ContentType
}

export function ReadTable({ data, contentType }: ReadTableProps) {
  const config = contentConfig[contentType]
  const [items, setItems] = useState<ReadTableItem[]>(data || [])
  const [loading, setLoading] = useState(!data)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (!data) {
      const loadItems = async () => {
        try {
          const response = await fetch(`/api/media?source=reading&type=${config.apiType}`)
          const responseData = await response.json()
          setItems(responseData[config.responseKey] || [])
        } catch (error) {
          console.error(`Error loading ${config.labelPlural}:`, error)
          setItems([])
        } finally {
          setLoading(false)
        }
      }
      loadItems()
    } else {
      setItems(data)
      setLoading(false)
    }
  }, [data, config.apiType, config.responseKey, config.labelPlural])

  const filteredItems = items.filter((item) => {
    const q = searchQuery.toLowerCase()
    if (!q) return true
    return item.title.toLowerCase().includes(q) || getAuthorSearchString(item.author).includes(q) || (item.verse_type && item.verse_type.toLowerCase().includes(q))
  })

  if (loading) return null

  return (
    <div className="space-y-4">
      <div className="relative">
        <input type="text" placeholder={`Search ${config.labelPlural}...`}
          className="w-full h-9 px-3 py-2 border rounded-none text-sm bg-background hover:bg-secondary/50 focus:outline-none focus:bg-secondary/50"
          onChange={(e) => setSearchQuery(e.target.value)} value={searchQuery} />
      </div>

      {filteredItems.length === 0 ? (
        <p className="text-center py-10 text-muted-foreground">
          {searchQuery ? `No ${config.labelPlural} found matching your search.` : `No ${config.labelPlural} found.`}
        </p>
      ) : (
        <table className="w-full text-sm border border-border overflow-hidden shadow-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-foreground">
              <th className="py-2 text-left font-medium px-3">Title</th>
              <th className="py-2 text-left font-medium px-3">Author</th>
              <th className="py-2 text-left font-medium px-3">Publication Year</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.slice().reverse().map((item, index) => (
              <tr key={index}
                className={`border-b border-border hover:bg-secondary/50 transition-colors ${item.source_link ? 'cursor-pointer' : ''} ${index % 2 === 0 ? 'bg-transparent' : 'bg-muted/5'}`}
                onClick={() => item.source_link && openUrl(item.source_link)}>
                <td className="py-2 px-3">{item.title}</td>
                <td className="py-2 px-3">{formatAuthors(item.author)}</td>
                <td className="py-2 px-3">{item.publication_year}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

// Legacy exports for backwards compatibility
export const BlogPostsTable = ({ data }: { data?: ReadTableItem[] }) => <ReadTable data={data} contentType="blogs" />
export const ShortStoriesTable = ({ data }: { data?: ReadTableItem[] }) => <ReadTable data={data} contentType="short-stories" />
export const VerseTable = ({ data }: { data?: ReadTableItem[] }) => <ReadTable data={data} contentType="verse" />
export const ReadingEssaysTable = ({ data }: { data?: ReadTableItem[] }) => <ReadTable data={data} contentType="essays" />
export const ReadingPapersTable = ({ data }: { data?: ReadTableItem[] }) => <ReadTable data={data} contentType="papers" />

/* =============================================================================
 * 7. CONTENT SECTIONS
 * ============================================================================= */

// ------------- ReadingSubTabs -------------
// Sub-navigation for /read page (books, audiobooks, blogs, etc.)
interface ReadingSubTabsProps {
  activeTab?: string
  onTabChange?: (tab: string) => void
  showBooks?: boolean
}

export function ReadingSubTabs({ activeTab, onTabChange, showBooks = false }: ReadingSubTabsProps) {
  const [activeSubTab, setActiveSubTab] = useState<ReadingSubTabType>((activeTab as ReadingSubTabType) || "books")
  const [searchQuery, setSearchQuery] = useState("")
  const { data: readingData, loading: readingLoading } = useReadingData()

  useEffect(() => {
    if (activeTab) setActiveSubTab(activeTab as ReadingSubTabType)
  }, [activeTab])

  const handleTabClick = (subTab: ReadingSubTabType) => {
    setActiveSubTab(subTab)
    onTabChange?.(subTab)
  }

  const handleBookClick = (book: JsonBook) => {
    if (book.link) openUrl(book.link)
  }

  const filteredBooks = readingData.books.filter((book) => {
    const q = searchQuery.toLowerCase()
    return !q || book.title.toLowerCase().includes(q) || book.author.toLowerCase().includes(q)
  })

  const audiobooks: Audiobook[] = readingData.audiobooks || []
  const filteredAudiobooks = audiobooks.filter((ab) => {
    const q = searchQuery.toLowerCase()
    return !q || ab.title.toLowerCase().includes(q) || ab.author.toLowerCase().includes(q)
  })

  return (
    <div className="space-y-6">
      {/* Sub-tabs */}
      <div className="relative">
        <div className="flex border-b border-border">
          {Object.entries(subTabLabels).map(([subTab, label]) => (
            <button key={subTab} onClick={() => handleTabClick(subTab as ReadingSubTabType)}
              className={`px-3 py-1.5 text-xs font-medium relative transition-colors ${activeSubTab === subTab ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              {label}
              {activeSubTab === subTab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="mt-4">
        {/* Books tab */}
        {activeSubTab === "books" && (
          readingLoading ? (
            <div className="text-center py-8"><p className="text-muted-foreground">Loading books...</p></div>
          ) : (
            <div className="space-y-4">
              <input type="text" placeholder="Search books..."
                className="w-full h-9 px-3 py-2 border rounded-none text-sm bg-background hover:bg-secondary/50 focus:outline-none focus:bg-secondary/50"
                onChange={(e) => setSearchQuery(e.target.value)} value={searchQuery} />
              {filteredBooks.length > 0 ? (
                <div className="space-y-6">
                  {filteredBooks.slice().reverse().map((book, index) => (
                    <ReadingBookCard key={index} coverUrl={book.cover} title={book.title} subtitle={book.subtitle || ""} author={book.author} rating={0} onClick={() => handleBookClick(book)} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8"><p className="text-muted-foreground">{searchQuery ? 'No books found matching your search.' : 'No books found.'}</p></div>
              )}
            </div>
          )
        )}

        {/* Audiobooks tab */}
        {activeSubTab === "audiobooks" && (
          readingLoading ? (
            <div className="text-center py-8"><p className="text-muted-foreground">Loading audiobooks...</p></div>
          ) : (
            <div className="space-y-4">
              <input type="text" placeholder="Search audiobooks..."
                className="w-full h-9 px-3 py-2 border rounded-none text-sm bg-background hover:bg-secondary/50 focus:outline-none focus:bg-secondary/50"
                onChange={(e) => setSearchQuery(e.target.value)} value={searchQuery} />
              {filteredAudiobooks.length > 0 ? (
                <div className="space-y-6">
                  {filteredAudiobooks.slice().reverse().map((ab, index) => (
                    <ReadingBookCard key={index} coverUrl={ab.cover || ""} title={ab.title} subtitle={ab.subtitle || ""} author={ab.author} rating={0} onClick={() => handleBookClick(ab as JsonBook)} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8"><p className="text-muted-foreground">{searchQuery ? 'No audiobooks found matching your search.' : 'No audiobooks found.'}</p></div>
              )}
            </div>
          )
        )}

        {/* Table tabs */}
        {activeSubTab === "blog-posts" && <ReadTable data={readingData.blogPosts} contentType="blogs" />}
        {activeSubTab === "short-stories" && <ReadTable data={readingData.shortStories} contentType="short-stories" />}
        {activeSubTab === "verse" && <ReadTable data={readingData.verse} contentType="verse" />}
        {activeSubTab === "essays" && <ReadTable data={readingData.essays} contentType="essays" />}
        {activeSubTab === "papers" && <ReadTable data={readingData.papers} contentType="papers" />}
      </div>
    </div>
  )
}

// ------------- ReadingLists -------------
// Curated reading lists with pagination
export function ReadingLists() {
  const [listsData, setListsData] = useState<ReadingListsData | null>(null)
  const [selectedList, setSelectedList] = useState<string>("")
  const [currentPage, setCurrentPage] = useState(1)
  const BOOKS_PER_PAGE = 5

  useEffect(() => {
    fetch('/api/media?source=reading&type=lists')
      .then(response => response.json())
      .then((data: ReadingListsData) => {
        setListsData(data)
        if (data.lists.length > 0) setSelectedList(data.lists[0].id)
      })
      .catch(error => console.error('Error loading reading lists:', error))
  }, [])

  useEffect(() => { setCurrentPage(1) }, [selectedList])

  const currentList = useMemo(() => listsData?.lists.find(list => list.id === selectedList), [listsData, selectedList])

  const { paginatedBooks, totalPages } = useMemo(() => {
    if (!currentList) return { paginatedBooks: [], totalPages: 0 }
    const startIndex = (currentPage - 1) * BOOKS_PER_PAGE
    return {
      paginatedBooks: currentList.books.slice(startIndex, startIndex + BOOKS_PER_PAGE),
      totalPages: Math.ceil(currentList.books.length / BOOKS_PER_PAGE)
    }
  }, [currentList, currentPage])

  if (!listsData) return <p className="text-muted-foreground">Loading lists...</p>

  return (
    <div className="space-y-6">
      {/* List selector */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="list-filter" className="text-sm text-muted-foreground">List:</label>
          <CustomSelect value={selectedList} onValueChange={setSelectedList}
            options={listsData.lists.map(list => ({ value: list.id, label: list.title }))}
            placeholder="Select a list" className="min-w-[200px]" />
        </div>
      </div>

      {/* Current list info */}
      {currentList && (
        <div className="space-y-2 pb-4 border-b border-border">
          <h3 className="text-lg font-semibold">{currentList.title}</h3>
          <p className="text-sm text-muted-foreground">{currentList.description}</p>
          <p className="text-xs text-muted-foreground">Curated by {currentList.author}</p>
          <p className="text-xs text-muted-foreground">{currentList.books.length} books • Page {currentPage} of {totalPages}</p>
        </div>
      )}

      {/* Books */}
      <div className="space-y-6">
        {paginatedBooks.length > 0 ? (
          paginatedBooks.map((book) => (
            <ReadingBookCard key={book.isbn13} coverUrl="/placeholder.svg?height=100&width=100" title={book.title} subtitle="" author="Unknown Author" rating={0} />
          ))
        ) : (
          <div className="text-center py-8"><p className="text-muted-foreground">No books in this list yet.</p></div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-4">
          <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}
            className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted">Previous</button>
          <span className="px-3 py-1 text-sm">{currentPage} of {totalPages}</span>
          <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted">Next</button>
        </div>
      )}
    </div>
  )
}

// ------------- CurrentlyReading -------------
// Homepage widget showing current book
export function CurrentlyReading() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <Card className="flex overflow-hidden h-[100px] dark:bg-[#121212] dark:border-[#232323]">
        <div className="w-[100px] h-[100px] bg-muted dark:bg-[#1a1a1a] p-2 flex items-center justify-center overflow-hidden cursor-pointer"
          onClick={() => setIsModalOpen(true)}>
          <div className="relative w-[60px] h-[90px] flex items-center justify-center">
            {CURRENT_BOOK.coverImage ? (
              <img src={CURRENT_BOOK.coverImage} alt="Book cover" className="max-w-full max-h-full object-contain rounded-sm transition-transform duration-300 hover:scale-110" />
            ) : (
              <div className="w-full h-full bg-muted-foreground/20 rounded-sm flex items-center justify-center">
                <span className="text-xs text-muted-foreground">No cover</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 p-4 overflow-hidden flex flex-col justify-center">
          <div className="font-normal text-sm truncate dark:text-[#fafafa]">{CURRENT_BOOK.title}</div>
          <div className="text-gray-600 dark:text-[#a1a1a1] text-sm truncate">{CURRENT_BOOK.author}</div>
        </div>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="p-0 border-0 bg-transparent max-w-fit [&>button]:hidden">
          {CURRENT_BOOK.coverImage && <img src={CURRENT_BOOK.coverImage} alt="Book cover" className="max-w-[300px] max-h-[450px] object-contain" />}
        </DialogContent>
      </Dialog>
    </>
  )
}

/* =============================================================================
 * 8. PAGE CONTENT
 * ============================================================================= */

// ------------- BookCardsContent -------------
// Book cards for /reading and /want-to-read pages
function BookCardsContent({ apiType, responseKey, emptyMessage }: { apiType: string; responseKey: string; emptyMessage: string }) {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const response = await fetch(`/api/media?source=reading&type=${apiType}`)
        const data = await response.json()
        setBooks(data[responseKey] || [])
      } catch (error) {
        console.error('Error loading books:', error)
        setBooks([])
      } finally {
        setLoading(false)
      }
    }
    loadBooks()
  }, [apiType, responseKey])

  if (loading) return null
  if (books.length === 0) return <div className="text-center py-10"><p className="text-muted-foreground">{emptyMessage}</p></div>

  return (
    <div className="mt-8">
      <div className="space-y-6">
        {books.map((book, index) => (
          <ReadingBookCard key={index} coverUrl={book.cover} title={book.title} subtitle={book.subtitle || ""} author={book.author} rating={0}
            onClick={() => book.link && window.open(book.link, '_blank')} />
        ))}
      </div>
    </div>
  )
}

// ------------- ReadContent -------------
// Content for /read page with hash-based sub-tabs
function ReadContent() {
  const [activeSubTab, setActiveSubTab] = useState<string>("books")
  const router = useRouter()

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '')
      if (hash && ['books', 'audiobooks', 'blog-posts', 'short-stories', 'verse', 'essays', 'papers'].includes(hash)) {
        setActiveSubTab(hash)
      } else {
        setActiveSubTab('books')
      }
    }
    handleHashChange()
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const handleSubTabChange = (subTab: string) => {
    setActiveSubTab(subTab)
    router.push(`/read#${subTab}`, { scroll: false })
  }

  return (
    <ReadingDataLoader>
      <ReadingSubTabs activeTab={activeSubTab} onTabChange={handleSubTabChange} showBooks={true} />
    </ReadingDataLoader>
  )
}

// ------------- ReadingLogContent -------------
// Content for /reading-log page
function ReadingLogContent() {
  const { data: readingData, loading: contextLoading } = useReadingData()
  const [data, setData] = useState<ReadingLogEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!contextLoading) {
      setData(readingData.readingLog || [])
      setLoading(false)
    }
  }, [readingData, contextLoading])

  if (loading) return <div className="text-center py-8"><p className="text-muted-foreground">Loading reading log...</p></div>
  if (!data || data.length === 0) return <div className="text-center py-8"><p className="text-muted-foreground">No reading log data available.</p></div>

  const sortedEntries = [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="mt-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-border overflow-hidden shadow-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-foreground">
              <th className="text-left py-3 px-4 font-medium">Date</th>
              <th className="text-left py-3 px-4 font-medium">Title</th>
              <th className="text-left py-3 px-4 font-medium">Author</th>
              <th className="text-left py-3 px-4 font-medium">Type</th>
              <th className="text-left py-3 px-4 font-medium">Minutes</th>
            </tr>
          </thead>
          <tbody>
            {sortedEntries.map((entry, index) => (
              <tr key={`${entry.date}-${entry.title}-${index}`} className="border-b border-border hover:bg-secondary/50 transition-colors">
                <td className="py-3 px-4 font-mono text-sm">{formatDate(entry.date)}</td>
                <td className="py-3 px-4">{entry.title}</td>
                <td className="py-3 px-4">{entry.author}</td>
                <td className="py-3 px-4">{entry.type}</td>
                <td className="py-3 px-4 font-mono">{formatTime(entry.minutes)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ------------- ReadingStatsContent -------------
// Content for /reading-stats page with charts
function ReadingStatsContent() {
  const [data, setData] = useState<ReadingLogData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/media?source=reading&type=log')
        if (response.ok) setData(await response.json())
      } catch (error) {
        console.error('Failed to fetch reading log:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return null
  if (!data || !data.log) return <div>No reading log data available.</div>

  // Calculate stats
  const dailyStats = new Map<string, { minutes: number }>()
  const typeStats = new Map<string, { minutes: number; count: number }>()
  const authorStats = new Map<string, { minutes: number; titles: Set<string> }>()

  data.log.forEach(entry => {
    // Daily
    const existing = dailyStats.get(entry.date) || { minutes: 0 }
    dailyStats.set(entry.date, { minutes: existing.minutes + entry.minutes })
    // Type
    const typeExisting = typeStats.get(entry.type) || { minutes: 0, count: 0 }
    typeStats.set(entry.type, { minutes: typeExisting.minutes + entry.minutes, count: typeExisting.count + 1 })
    // Author
    const authorExisting = authorStats.get(entry.author) || { minutes: 0, titles: new Set() }
    authorExisting.titles.add(entry.title)
    authorStats.set(entry.author, { minutes: authorExisting.minutes + entry.minutes, titles: authorExisting.titles })
  })

  const sortedDailyStats = Array.from(dailyStats.entries()).map(([date, stats]) => ({ date, ...stats })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  const sortedTypeStats = Array.from(typeStats.entries()).map(([type, stats]) => ({ type, ...stats })).sort((a, b) => b.minutes - a.minutes)
  const sortedAuthorStats = Array.from(authorStats.entries()).map(([author, stats]) => ({ author, minutes: stats.minutes, titles: stats.titles.size })).sort((a, b) => b.minutes - a.minutes)

  const totalMinutes = sortedDailyStats.reduce((sum, day) => sum + day.minutes, 0)
  const totalDays = sortedDailyStats.length
  const avgMinutesPerDay = totalDays > 0 ? Math.round(totalMinutes / totalDays) : 0

  return (
    <div className="mt-4 space-y-8">
      {/* Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-6 bg-muted/50"><div className="text-2xl font-bold">{totalMinutes}</div><div className="text-sm text-muted-foreground">Total Minutes</div></div>
        <div className="p-6 bg-muted/50"><div className="text-2xl font-bold">{data.log.length}</div><div className="text-sm text-muted-foreground">Reading Sessions</div></div>
        <div className="p-6 bg-muted/50"><div className="text-2xl font-bold">{totalDays}</div><div className="text-sm text-muted-foreground">Reading Days</div></div>
        <div className="p-6 bg-muted/50"><div className="text-2xl font-bold">{avgMinutesPerDay}</div><div className="text-sm text-muted-foreground">Avg Min/Day</div></div>
      </div>

      {/* Daily chart */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Daily Reading Activity</h3>
        <div className="p-4 bg-muted/50 overflow-x-auto">
          <div className="flex items-end space-x-1 min-w-max" style={{ height: '200px' }}>
            {sortedDailyStats.map((day, index) => {
              const maxMinutes = Math.max(...sortedDailyStats.map(d => d.minutes))
              const height = maxMinutes > 0 ? (day.minutes / maxMinutes) * 160 : 0
              return (
                <div key={index} className="flex flex-col items-center space-y-1">
                  <div className="bg-primary" style={{ height: `${height}px`, width: '20px', minHeight: day.minutes > 0 ? '2px' : '0px' }} title={`${day.date}: ${day.minutes} minutes`} />
                  <div className="text-xs text-muted-foreground transform -rotate-45 origin-center w-8">
                    {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Type & Author stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Reading by Type</h3>
          <div className="space-y-3">
            {sortedTypeStats.map((stat, index) => {
              const maxMinutes = Math.max(...sortedTypeStats.map(s => s.minutes))
              const percentage = maxMinutes > 0 ? (stat.minutes / maxMinutes) * 100 : 0
              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm"><span>{stat.type}</span><span className="text-muted-foreground">{stat.minutes} min</span></div>
                  <div className="h-2 bg-muted"><div className="h-2 bg-primary" style={{ width: `${percentage}%` }} /></div>
                  <div className="text-xs text-muted-foreground">{stat.count} sessions</div>
                </div>
              )
            })}
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Reading by Author</h3>
          <div className="space-y-3">
            {sortedAuthorStats.map((stat, index) => {
              const maxMinutes = Math.max(...sortedAuthorStats.map(s => s.minutes))
              const percentage = maxMinutes > 0 ? (stat.minutes / maxMinutes) * 100 : 0
              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm"><span className="truncate">{stat.author}</span><span className="text-muted-foreground">{stat.minutes} min</span></div>
                  <div className="h-2 bg-muted"><div className="h-2 bg-secondary" style={{ width: `${percentage}%` }} /></div>
                  <div className="text-xs text-muted-foreground">{stat.titles} titles</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

// ------------- ReadingPageContent -------------
// Main page router - renders appropriate content based on page prop
export function ReadingPageContent({ page }: { page: ReadingPageType }) {
  return (
    <div>
      <ReadingNavigation />
      {page === "reading" && <BookCardsContent apiType="now" responseKey="now" emptyMessage="Not currently reading anything." />}
      {page === "read" && <ReadContent />}
      {page === "want-to-read" && <BookCardsContent apiType="want-to-read" responseKey="wantToRead" emptyMessage="No books on the want-to-read list." />}
      {page === "reading-lists" && <div className="mt-8"><ReadingLists /></div>}
      {page === "reading-log" && <ReadingLogContent />}
      {page === "reading-stats" && <ReadingStatsContent />}
    </div>
  )
}

/* =============================================================================
 * 9. EXPORTS
 * ============================================================================= */

// All exports are inline above with their component definitions
