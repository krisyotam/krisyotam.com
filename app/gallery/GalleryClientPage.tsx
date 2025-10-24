"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { CustomSelect, SelectOption } from "@/components/ui/custom-select";
import categoriesData from "@/data/gallery/categories.json";

interface ArtworkItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  dimension: string;
  start_date: string;
  end_date?: string;
  category: string;
  tags: string[];
  status: string;
  confidence: string;
  importance: number;
  bio: string;
}

export default function GalleryClientPage({ artworks, initialCategory = "all" }: { artworks: ArtworkItem[]; initialCategory?: string }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const router = useRouter();

  const categories = ["all", ...Array.from(new Set(artworks.map(art => art.category).filter((category): category is string => !!category)))];
  const categoryOptions: SelectOption[] = categories.map(category => ({
    value: category,
    label: category === "all" ? "All Categories" : formatCategoryDisplayName(category)
  }));

  function formatCategoryDisplayName(slug: string): string {
    const category = categoriesData.categories.find(cat => cat.slug === slug);
    return category ? category.title : slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  const filteredArtworks = artworks.filter(artwork => {
    const matchesSearch = searchQuery.trim() === "" || 
      artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (artwork.description && artwork.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (artwork.tags && artwork.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchesCategory = activeCategory === "all" || artwork.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  function getSlug(title: string) {
    return title.toLowerCase().replace(/\s+/g, '-');
  }

  return (
    <>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full">
          {filteredArtworks.map((art, index) => (
            <div
              key={art.id}
              className="relative bg-gray-100 dark:bg-neutral-900 overflow-hidden h-60 md:h-96 w-full aspect-[4/3] cursor-pointer transition-all duration-300 ease-out"
              onClick={() => router.push(`/gallery/${getSlug(art.title)}`)}
            >
              <img
                src={art.imageUrl}
                alt={art.title}
                className="object-cover absolute inset-0 w-full h-full aspect-[4/3]"
                style={{ borderRadius: 0 }}
              />
              <div className="absolute inset-0 bg-black/50 flex items-end py-8 px-4 transition-opacity duration-300 opacity-0 hover:opacity-100">
                <div className="text-xl md:text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-200">
                  {art.title}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
