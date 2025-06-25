"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/page-header"
import { CustomSelect, SelectOption } from "@/components/ui/custom-select"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { PasswordDialog } from "@/components/password-dialog"
import { PageDescription } from "@/components/posts/typography/page-description"

// Add docs page metadata
const docsPageData = {
  title: "Docs",
  subtitle: "AI Research Documents",
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
  type: string
  tags: string[]
  date: string
  pdfUrl: string
  sourceUrl: string
  aiModel: string
  version: string
}

interface DocType {
  slug: string
  title: string
  preview: string
  date: string
  status: string
  confidence: string
  importance: number
}

interface DocCategory {
  slug: string
  title: string
  preview: string
  date: string
  status: string
  confidence: string
  importance: number
  type: string
}

function slugifyCategory(category: string) {
  return category.toLowerCase().replace(/\s+/g, "-");
}

function slugifyTitle(title: string) {
  return title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
}

async function fetchDocs(): Promise<DocItem[]> {
  try {
    const response = await fetch('/api/docs');
    if (!response.ok) throw new Error('Failed to fetch docs');
    const data = await response.json();
    return data.docs;
  } catch (error) {
    console.error('Error fetching docs:', error);
    return [];
  }
}

async function fetchTypes(): Promise<DocType[]> {
  try {
    const response = await fetch('/api/docs/types');
    if (!response.ok) throw new Error('Failed to fetch types');
    const data = await response.json();
    return data.types;
  } catch (error) {
    console.error('Error fetching types:', error);
    return [];
  }
}

async function fetchCategories(): Promise<DocCategory[]> {
  try {
    const response = await fetch('/api/docs/categories');
    if (!response.ok) throw new Error('Failed to fetch categories');
    const data = await response.json();
    return data.categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export function DocsClient({ initialCategory = "All" }: { initialCategory?: string }) {
  const [loading, setLoading] = useState(true)
  const [currentType, setCurrentType] = useState("all")
  const [currentCategory, setCurrentCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [docs, setDocs] = useState<DocItem[]>([])
  const [types, setTypes] = useState<DocType[]>([])
  const [categories, setCategories] = useState<DocCategory[]>([])
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [selectedLink, setSelectedLink] = useState<string>("")
  const router = useRouter()

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [docsData, typesData, categoriesData] = await Promise.all([
          fetchDocs(),
          fetchTypes(),
          fetchCategories()
        ]);
        
        setDocs(docsData);
        setTypes(typesData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, [])

  // Helper to build the correct route for a document item
  function getDocUrl(item: DocItem) {
    const typeSlug = slugifyCategory(item.type);
    const categorySlug = slugifyCategory(item.category);
    const titleSlug = item.slug;
    return `/docs/${encodeURIComponent(typeSlug)}/${encodeURIComponent(categorySlug)}/${encodeURIComponent(titleSlug)}`
  }

  // Get categories for the selected type
  const availableCategories = currentType === "all" 
    ? categories 
    : categories.filter(cat => cat.type === currentType);

  // Create type options for dropdown
  const typeOptions: SelectOption[] = [
    { value: "all", label: "All Types" },
    ...types.map(type => ({
      value: type.slug,
      label: type.title
    }))
  ];

  // Create category options for dropdown (dependent on selected type)
  const categoryOptions: SelectOption[] = [
    { value: "all", label: "All Categories" },
    ...availableCategories.map(category => ({
      value: category.slug,
      label: category.title
    }))
  ];

  // Handle type change
  function handleTypeChange(selectedValue: string) {
    setCurrentType(selectedValue);
    // Reset category when type changes
    setCurrentCategory("all");
  }

  // Handle category change
  function handleCategoryChange(selectedValue: string) {
    setCurrentCategory(selectedValue);
  }

  // Filter docs based on search, type, and category
  const filteredDocs = docs.filter((item) => {
    const matchesSearch = searchQuery === "" || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesType = currentType === "all" || item.type === currentType
    const matchesCategory = currentCategory === "all" || item.category === currentCategory

    return matchesSearch && matchesType && matchesCategory
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
        {/* Search and filters */}
        <div className="mb-6 flex items-center gap-4">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <label htmlFor="type-filter" className="text-sm text-muted-foreground">Filter by type:</label>
            <CustomSelect
              value={currentType}
              onValueChange={handleTypeChange}
              options={typeOptions}
              className="text-sm min-w-[140px]"
            />
          </div>
          
          <div className="flex items-center gap-2 whitespace-nowrap">
            <label htmlFor="category-filter" className="text-sm text-muted-foreground">Filter by category:</label>
            <CustomSelect
              value={currentCategory}
              onValueChange={handleCategoryChange}
              options={categoryOptions}
              className="text-sm min-w-[140px]"
            />
          </div>
          
          <div className="relative flex-1">
            <input 
              type="text" 
              placeholder="Search documents..." 
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
                  <th className="py-2 text-left font-medium px-3">Type</th>
                  <th className="py-2 text-left font-medium px-3">Category</th>
                  <th className="py-2 text-left font-medium px-3">Model</th>
                  <th className="py-2 text-left font-medium px-3">Year</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocs.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`border-b border-border hover:bg-secondary/50 transition-colors cursor-pointer ${index % 2 === 0 ? 'bg-transparent' : 'bg-muted/5'}`}
                    onClick={() => handleItemClick(item)}
                  >
                    <td className="py-2 px-3 font-medium">{item.title}</td>
                    <td className="py-2 px-3">{item.type}</td>
                    <td className="py-2 px-3">{item.category}</td>
                    <td className="py-2 px-3">{item.aiModel} {item.version}</td>
                    <td className="py-2 px-3">{new Date(item.date).getFullYear()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredDocs.length === 0 && !loading && (
              <div className="text-muted-foreground text-sm mt-6">No documents found matching your criteria.</div>
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