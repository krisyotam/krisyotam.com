"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Post } from "@/utils/posts";
import categoriesData from "@/data/essays/categories.json";

interface EssaysTableProps {
  notes: Post[];
  searchQuery: string;
  activeCategory: string;
}

export function EssaysTable({ notes, searchQuery, activeCategory }: EssaysTableProps) {
  const [filteredNotes, setFilteredNotes] = useState<Post[]>(notes);
  const router = useRouter();

  // Helper to get category title from slug
  function getCategoryTitle(categorySlug: string): string {
    const category = categoriesData.categories.find(cat => cat.slug === categorySlug);
    return category?.title || categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1);
  }

  useEffect(() => {
    const filtered = notes.filter((note) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        note.title.toLowerCase().includes(q) ||
        note.tags.some((t) => t.toLowerCase().includes(q)) ||
        note.category.toLowerCase().includes(q);

      const matchesCategory = activeCategory === "all" || note.category === activeCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort by date descending (newest first)
    filtered.sort((a, b) => {
      const dateA = (a.end_date && a.end_date.trim()) || a.start_date || '';
      const dateB = (b.end_date && b.end_date.trim()) || b.start_date || '';
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });
    setFilteredNotes(filtered);
  }, [notes, searchQuery, activeCategory]);
  // Helper to format date as "Month DD, YYYY"
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long", 
      day: "numeric"
    });
  }

  // Helper function to format category display name
  function formatCategoryDisplayName(category: string) {
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  // Helper to build the correct route for an essay
  function getEssayUrl(note: Post) {
    return `/essays/${note.category}/${note.slug}`;
  }

  if (!filteredNotes.length) {
    return <p className="text-center py-10 text-muted-foreground">No essays found.</p>;
  }

  return (
    <div className="mt-8">
      <table className="w-full text-sm border border-border overflow-hidden shadow-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50 text-foreground">
            <th className="py-2 text-left font-medium px-3">Title</th>
            <th className="py-2 text-left font-medium px-3">Author</th>
            <th className="py-2 text-left font-medium px-3">Publication Year</th>
          </tr>
        </thead>
        <tbody>
          {filteredNotes.map((note, index) => (
            <tr
              key={note.slug}
              className={`border-b border-border hover:bg-secondary/50 transition-colors ${
                index % 2 === 0 ? 'bg-transparent' : 'bg-muted/5'
              }`}
            >
              <td className="py-2 px-3 font-medium">{note.title}</td>
              <td className="py-2 px-3">{note.author}</td>
              <td className="py-2 px-3">{note.publication_year}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {filteredNotes.length === 0 && (
        <div className="text-muted-foreground text-sm mt-6">No essays found matching your criteria.</div>
      )}
    </div>
  );
}
