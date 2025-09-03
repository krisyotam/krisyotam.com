"use client";

import { useState, useEffect } from "react";
import { BlogTable } from "@/components/blog-table";
import { PageHeader } from "@/components/page-header";
import { PageDescription } from "@/components/posts/typography/page-description";
import { CustomSelect, SelectOption } from "@/components/ui/custom-select";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { BlogMeta } from "@/types/blog";
import categoriesData from "@/data/blog/categories.json";
import "./blog-grid.css";

// Define the props interface for the BlogTable and GridView
interface BlogTableProps {
  notes: BlogMeta[];
  searchQuery: string;
  activeCategory: string;
}

/* default page-level metadata for the header */
const defaultBlogPageData = {
  title: "Blog Posts",
  start_date: "2025-01-01",
  end_date: new Date().toISOString().split('T')[0], // Current date as YYYY-MM-DD
  preview: "informal ramblings, thought experiments, and idea play across topics and characters",
  status: "In Progress" as const,
  confidence: "likely" as const,
  importance: 6,
};

interface BlogClientPageProps {
  initialCategory?: string;
  notes: BlogMeta[];
}

export default function BlogClientPage({ initialCategory = "all", notes }: BlogClientPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const router = useRouter();

  // Get unique categories and convert to SelectOption format
  const categories: SelectOption[] = ["all", ...new Set(notes.map(note => note.category))]
    .sort()
    .map(category => ({
      value: category,
      label: category === "all" ? "All Categories" : category
    }));

  // Determine which header data to use
  const getHeaderData = () => {
    if (initialCategory === "all" || !initialCategory) {
      return defaultBlogPageData;
    }
    
    // Find category data from categories.json
    const categorySlug = slugifyCategory(initialCategory);
    const categoryData = categoriesData.categories.find(cat => cat.slug === categorySlug);
    
    if (categoryData) {
      return {
        title: categoryData.title,
        subtitle: "",
        start_date: categoryData.date || "2025-01-01",
        end_date: categoryData.date || new Date().toISOString().split('T')[0],
        preview: categoryData.preview,
        status: categoryData.status as "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished",
        confidence: categoryData.confidence as "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain",
        importance: categoryData.importance
      };
    }
    
    // Fallback to default if category not found
    return defaultBlogPageData;
  };
  const headerData = getHeaderData();

  // Helper function to create category slug
  function slugifyCategory(category: string) {
    return category.toLowerCase().replace(/\s+/g, "-");
  }

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    if (category === "all") {
      router.push("/blog");
    } else {
      router.push(`/blog/${slugifyCategory(category)}`);
    }
  };
  
  // Helper function to format category display name
  function formatCategoryDisplayName(category: string) {
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  // Filter notes based on search query and category
  const filteredNotes = notes.filter((note) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      note.title.toLowerCase().includes(q) ||
      note.tags.some((tag) => tag.toLowerCase().includes(q)) ||
      note.category.toLowerCase().includes(q);

    const matchesCategory = activeCategory === "all" || note.category === activeCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    const dateA = a.end_date || a.start_date;
    const dateB = b.end_date || b.start_date;
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });

  // Helper to build the correct route for a blog post
  function getBlogUrl(note: BlogMeta) {
    const categorySlug = note.category.toLowerCase().replace(/\s+/g, "-");
    return `/blog/${categorySlug}/${encodeURIComponent(note.slug)}`;
  }

  // Helper to format date as "Month DD, YYYY"
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long", 
      day: "numeric"
    });
  }

  // Grid view component
  const GridView = ({ notes, searchQuery, activeCategory }: BlogTableProps) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {filteredNotes.map((note) => (
        <div
          key={note.slug}
          className="border border-border bg-card hover:bg-secondary/50 transition-colors cursor-pointer"
          onClick={() => router.push(getBlogUrl(note))}
        >
          {/* Cover Image Area - Using 16:9 aspect ratio */}
          <div className="aspect-[16/9] bg-muted/30 border-b border-border flex items-center justify-center overflow-hidden">
            {note.cover_image ? (
              <img 
                src={note.cover_image} 
                alt={note.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-muted-foreground text-xs text-center p-4">
                {note.title}
              </div>
            )}
          </div>
          
          {/* Content Area */}
          <div className="p-3">
            <h3 className="font-medium text-xs mb-1 line-clamp-2">{note.title}</h3>
            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{formatCategoryDisplayName(note.category)}</p>
            
            {/* Metadata */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{new Date(note.end_date || note.start_date).getFullYear()}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <style jsx global>{`
        .blog-container {
          font-family: 'Geist', sans-serif;
        }
      `}</style>

      <div className="blog-container container max-w-[672px] mx-auto px-4 pt-16 pb-8">
        <PageHeader {...headerData} />
        
        <div className="mb-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search posts..." 
              className="w-full h-9 px-3 py-2 border rounded-none text-sm bg-background hover:bg-secondary/50 focus:outline-none focus:bg-secondary/50"
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
            />
          </div>
        </div>

        {/* Filter and view toggle */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <label htmlFor="category-filter" className="text-sm text-muted-foreground">Filter by category:</label>
            <CustomSelect
              value={activeCategory}
              onValueChange={handleCategoryChange}
              options={categories}
              className="text-sm min-w-[140px]"
            />
          </div>

          {/* View Mode Toggle */}
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

        {/* Filtered and view mode controlled content */}
        {filteredNotes.length > 0 ? (
          viewMode === "list" ? (
            <BlogTable
              notes={notes}
              searchQuery={searchQuery}
              activeCategory={activeCategory}
            />
          ) : (
            <GridView 
              notes={notes}
              searchQuery={searchQuery}
              activeCategory={activeCategory}
            />
          )
        ) : (
          <div className="text-muted-foreground text-sm mt-6 text-center">No posts found matching your criteria.</div>
        )}

        <PageDescription
          title="About Blog Posts"
          description="This is my blog section where I share short-form thoughts and reflections. Use the search bar to find specific posts by title or category. You can also filter posts by category using the dropdown above."
        />
      </div>
    </>
  );
}
