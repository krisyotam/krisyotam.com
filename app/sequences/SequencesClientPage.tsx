"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { PageDescription } from "@/components/posts/typography/page-description";
import { CustomSelect, SelectOption } from "@/components/ui/custom-select";
import { useRouter } from "next/navigation";
import Link from "next/link";
import categoriesData from "@/data/sequences/categories.json";
import { Sequence, SequencePost } from "@/types/sequences";

/* Page-level metadata for the header */
const defaultSequencesPageData = {
  title: "Sequences",
  subtitle: "Structured Learning Paths",
  start_date: "2025-01-01",
  end_date: new Date().toISOString().split('T')[0], // Current date as YYYY-MM-DD
  preview: "Curated collections of posts organized into coherent learning sequences covering philosophy, science, and rationality.",
  status: "In Progress" as const,
  confidence: "likely" as const,
  importance: 8,
};

// Using imported types from /types/sequences.ts

// Helper function to get total posts count for both old and new formats
function getTotalPostsCount(sequence: Sequence): number {
  if (sequence.sections && sequence.sections.length > 0) {
    return sequence.sections.reduce((total, section) => total + section.posts.length, 0);
  }
  return sequence.posts ? sequence.posts.length : 0;
}

interface SequencesClientPageProps {
  initialCategory?: string;
  categoryName?: string;
}

async function fetchSequences(): Promise<Sequence[]> {
  try {
    const response = await fetch('/api/sequences');
    if (!response.ok) throw new Error('Failed to fetch sequences');
    const data = await response.json();
    return Array.isArray(data.sequences) ? data.sequences : [];
  } catch (error) {
    console.error('Error fetching sequences:', error);
    return [];
  }
}

async function fetchCategories(): Promise<any[]> {
  try {
    const response = await fetch('/api/sequences/categories');
    if (!response.ok) throw new Error('Failed to fetch categories');
    const data = await response.json();
    return Array.isArray(data.categories) ? data.categories : [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

async function fetchTags(): Promise<any[]> {
  try {
    const response = await fetch('/api/sequences/tags');
    if (!response.ok) throw new Error('Failed to fetch tags');
    const data = await response.json();
    return Array.isArray(data.tags) ? data.tags : [];
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
}

export default function SequencesClientPage({ initialCategory = "all", categoryName }: SequencesClientPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | undefined>(initialCategory);
  const [categoryDisplayName, setCategoryDisplayName] = useState<string | undefined>(categoryName);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sequences, setSequences] = useState<Sequence[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Update activeCategory when props change
  useEffect(() => {
    setActiveCategory(initialCategory);
    setCategoryDisplayName(categoryName);
  }, [initialCategory, categoryName]);

  // Get header data based on category
  const getHeaderData = () => {
    if (activeCategory !== "all" && categoryDisplayName) {
      // Find category data from categories.json
      const categorySlug = slugifyCategory(categoryDisplayName);
      const categoryData = categoriesData.categories.find(cat => 
        cat.slug === categorySlug || cat.title === categoryDisplayName
      );
      
      if (categoryData) {
        return {
          title: categoryData.title,
          subtitle: "Sequence Category",
          start_date: categoryData.date || "2025-01-01",
          end_date: new Date().toISOString().split('T')[0],
          preview: categoryData.preview,
          status: categoryData.status as "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished" | "Planned",
          confidence: categoryData.confidence as "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain",
          importance: categoryData.importance
        };
      }
      
      // Fallback if category not found in data
      return {
        title: categoryDisplayName,
        subtitle: "Sequence Category",
        start_date: "2025-01-01",
        end_date: new Date().toISOString().split('T')[0],
        preview: `Sequences in the ${categoryDisplayName} category`,
        status: "In Progress" as const,
        confidence: "certain" as const,
        importance: 8
      };
    }
    
    return defaultSequencesPageData;
  };

  const headerData = getHeaderData();
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [sequencesData, categoriesData, tagsData] = await Promise.all([
          fetchSequences(),
          fetchCategories(),
          fetchTags()
        ]);
        
        setSequences(sequencesData);
        setCategories(categoriesData);
        setTags(tagsData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  // Helper function to slugify category
  function slugifyCategory(category: string) {
    return category.toLowerCase().replace(/\s+/g, "-");
  }

  // Filter sequences based on search query and category
  const filteredSequences = sequences.filter((sequence) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      sequence.title.toLowerCase().includes(q) ||
      sequence.preview.toLowerCase().includes(q);

    // Check if matches category
    const matchesCategory = 
      activeCategory === "all" || 
      (sequence.category && sequence.category === categoryDisplayName);
    
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    const dateA = (a.end_date && a.end_date.trim()) ? a.end_date : a.start_date;
    const dateB = (b.end_date && b.end_date.trim()) ? b.end_date : b.start_date;
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });



  const GridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {filteredSequences.map((sequence) => (
        <Link 
          key={sequence.slug} 
          href={`/sequences/${sequence.slug}`}
          className="border border-border bg-card hover:bg-secondary/50 transition-colors block"
        >
          {/* Cover Image Area */}
          <div className="aspect-[16/9] bg-muted/30 border-b border-border flex items-center justify-center">
            {sequence["cover-url"] ? (
              <img 
                src={sequence["cover-url"]} 
                alt={sequence.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-muted-foreground text-sm text-center p-4">
                {sequence.title}
              </div>
            )}
          </div>
          
          {/* Content Area */}
          <div className="p-4">
            <h3 className="font-medium text-sm mb-2 line-clamp-2">{sequence.title}</h3>
            <p className="text-xs text-muted-foreground mb-3 line-clamp-3">{sequence.preview}</p>
            
            {/* Metadata */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-2">
                <span>{getTotalPostsCount(sequence)} posts</span>
                {sequence.category && (
                  <>
                    <span className="text-muted-foreground">•</span>
                    <Link 
                      href={`/sequences/category/${slugifyCategory(sequence.category)}`}
                      className="hover:text-foreground"
                      onClick={(e) => e.stopPropagation()} // Prevent parent link from triggering
                    >
                      {sequence.category}
                    </Link>
                  </>
                )}
              </span>
              <span>{new Date((sequence.end_date && sequence.end_date.trim()) ? sequence.end_date : sequence.start_date).getFullYear()}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );

  const ListView = () => (
    <table className="w-full text-sm border border-border overflow-hidden shadow-sm">
      <thead>
        <tr className="border-b border-border bg-muted/50 text-foreground">
          <th className="py-2 text-left font-medium px-3">Title</th>
          <th className="py-2 text-left font-medium px-3">Category</th>
          <th className="py-2 text-left font-medium px-3">Posts</th>
          <th className="py-2 text-left font-medium px-3">Year</th>
        </tr>
      </thead>
      <tbody>
        {filteredSequences.map((sequence, index) => (
          <tr
            key={sequence.slug}
            className={`border-b border-border hover:bg-secondary/50 transition-colors ${index % 2 === 0 ? 'bg-transparent' : 'bg-muted/5'}`}
          >
            <td className="py-2 px-3">
              <Link 
                href={`/sequences/${sequence.slug}`}
                className="font-medium"
              >
                {sequence.title}
              </Link>
            </td>
            <td className="py-2 px-3">
              {sequence.category && (
                <Link 
                  href={`/sequences/category/${slugifyCategory(sequence.category)}`}
                  className=""
                >
                  {sequence.category}
                </Link>
              )}
            </td>
            <td className="py-2 px-3">{getTotalPostsCount(sequence)}</td>
            <td className="py-2 px-3">{new Date((sequence.end_date && sequence.end_date.trim()) ? sequence.end_date : sequence.start_date).getFullYear()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  if (loading) {
    return (
      <div className="container max-w-[672px] mx-auto px-4 pt-16 pb-8">
        <div className="flex justify-center items-center py-24">
          <svg className="animate-spin h-8 w-8 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        .sequences-container {
          font-family: 'Geist', sans-serif;
        }
      `}</style>

      <div className="sequences-container container max-w-[672px] mx-auto px-4 pt-16 pb-8">
        <PageHeader {...headerData} />

        {/* Search bar - only show if viewing all categories */}
        {activeCategory === "all" && (
          <div className="mb-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search sequences..." 
                className="w-full h-9 px-3 py-2 border rounded-none text-sm bg-background hover:bg-secondary/50 focus:outline-none focus:bg-secondary/50"
                onChange={(e) => setSearchQuery(e.target.value)}
                value={searchQuery}
              />
            </div>
          </div>
        )}

        {/* Filters and View Toggle */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Categories dropdown */}
            <div className="flex items-center gap-2 whitespace-nowrap">
              <label htmlFor="category-filter" className="text-sm text-muted-foreground">Filter by category:</label>
              <CustomSelect
                value={activeCategory || "all"}
                onValueChange={(value) => {
                  if (value === "all") {
                    router.push("/sequences");
                  } else {
                    // We need to slugify the category for the URL
                    const categorySlug = slugifyCategory(value);
                    router.push(`/sequences/category/${categorySlug}`);
                  }
                }}
                options={[
                  { value: "all", label: "All Categories" },
                  ...categoriesData.categories
                    .sort((a, b) => a.title.localeCompare(b.title))
                    .map(category => ({
                      value: category.title,
                      label: category.title
                    }))
                ]}
                className="text-sm min-w-[200px]"
              />
            </div>
          </div>

          {/* View Mode Toggle - always show */}
          <div className="flex items-center gap-1 border border-border rounded-none overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1 text-xs transition-colors ${
                viewMode === "grid" 
                  ? "bg-foreground text-background" 
                  : "bg-background text-foreground hover:bg-secondary/50"
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1 text-xs transition-colors ${
                viewMode === "list" 
                  ? "bg-foreground text-background" 
                  : "bg-background text-foreground hover:bg-secondary/50"
              }`}
            >
              List
            </button>
          </div>
        </div>

        {/* Content based on view mode */}
        {viewMode === "grid" ? <GridView /> : <ListView />}

        {filteredSequences.length === 0 && !loading && (
          <div className="text-muted-foreground text-sm mt-6 text-center">
            {activeCategory !== "all" ? 
              `No sequences found in the ${categoryDisplayName} category.` :
              "No sequences found matching your criteria."
            }
          </div>
        )}

        {/* Navigation space preserved for consistency */}
        <div className="mb-6 mt-6"></div>

        {/* PageDescription component */}
        <PageDescription
          title={
            activeCategory !== "all"
              ? `About ${categoryDisplayName} Sequences` 
              : "About Sequences"
          }
          description={
            activeCategory !== "all"
              ? `This page shows all sequences in the ${categoryDisplayName} category. Each sequence is a structured collection of posts designed to build understanding progressively.`
              : "Sequences are structured collections of posts designed to build understanding progressively. Each sequence covers a specific topic in depth, with posts ordered to maximize learning. Browse by grid or list view to find sequences that interest you."
          }
        />
      </div>
    </>
  );
}
