"use client";

import { useState, useEffect } from "react";
import MasonryGrid from "@/components/art/masonryGrid";
import { PageHeader } from "@/components/core";
import { PageDescription } from "@/components/core";
import { CustomSelect, SelectOption } from "@/components/ui/custom-select";
import { ArtworkItem } from "@/components/art/artCard";

const defaultArtPageData = {
  title: "Art",
  subtitle: "",
  start_date: "2025-01-01",
  end_date: new Date().toISOString().split('T')[0],
  preview: "my personal art, follow me at cara.app/krisyotam",
  status: "In Progress" as const,
  confidence: "highly likely" as const,
  importance: 7,
};

interface ArtClientPageProps {
  artworks: ArtworkItem[];
  initialCategory?: string;
}

export default function ArtClientPage({ artworks, initialCategory = "all" }: ArtClientPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  // Get unique categories from artworks - filter out undefined values
  const categories = ["all", ...Array.from(new Set(artworks.map(art => art.category).filter((category): category is string => !!category)))];
  
  // Convert categories to SelectOption format - exact implementation from NotesClientPage
  const categoryOptions: SelectOption[] = categories.map(category => ({
    value: category,
    label: category === "all" ? "All Categories" : formatCategoryDisplayName(category)
  }));

  // Format category name from slug
  function formatCategoryDisplayName(slug: string): string {
    return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  // Filter artworks based on search query and active category
  const filteredArtworks = artworks.filter(artwork => {
    const matchesSearch = searchQuery.trim() === "" || 
      artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (artwork.description && artwork.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (artwork.tags && artwork.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    
    const matchesCategory = activeCategory === "all" || artwork.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <PageHeader
        title={defaultArtPageData.title}
        start_date={defaultArtPageData.start_date}
        end_date={defaultArtPageData.end_date}
        preview={defaultArtPageData.preview}
        status={defaultArtPageData.status}
        confidence={defaultArtPageData.confidence}
        importance={defaultArtPageData.importance}
      />
      
      <div className="mb-6 flex items-center gap-4">
        <div className="flex items-center gap-2 whitespace-nowrap">
          <label htmlFor="category-filter" className="text-sm text-muted-foreground">Filter by category:</label>
          <CustomSelect
            options={categoryOptions}
            value={activeCategory}
            onValueChange={(value) => setActiveCategory(value)}
            placeholder="Filter by category"
            className="text-sm min-w-[140px]"
          />
        </div>
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search..."
            className="w-full h-9 px-3 py-2 border rounded-none text-sm bg-background hover:bg-secondary/50 focus:outline-none focus:bg-secondary/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-6">
        <MasonryGrid artworks={filteredArtworks} />
      </div>
    </>
  );
}
