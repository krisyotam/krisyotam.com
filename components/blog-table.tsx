"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { BlogMeta } from "@/types/blog";

interface BlogTableProps {
  notes: BlogMeta[];
  searchQuery: string;
  activeCategory: string;
}

export function BlogTable({ notes, searchQuery, activeCategory }: BlogTableProps) {
  const [filteredNotes, setFilteredNotes] = useState<BlogMeta[]>(notes);
  const router = useRouter();

  useEffect(() => {
    const filtered = notes.filter((note) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        note.title.toLowerCase().includes(q) ||
        note.tags.some((t) => t.toLowerCase().includes(q)) ||
        note.category.toLowerCase().includes(q);

      const matchesCategory = activeCategory === "all" || note.category === activeCategory;
      
      // Only show active posts, filter out hidden ones
      const isActive = note.state !== "hidden";
      
      return matchesSearch && matchesCategory && isActive;
    });

    // Sort by date descending (newest first)
    filtered.sort((a, b) => {
      // Compare dates directly as strings in YYYY-MM-DD format (which sorts correctly)
      const dateA = (a.end_date && a.end_date.trim()) || a.start_date || '';
      const dateB = (b.end_date && b.end_date.trim()) || b.start_date || '';
      return dateB.localeCompare(dateA);
    });
    setFilteredNotes(filtered);
  }, [notes, searchQuery, activeCategory]);

  // Helper to format date as "Month DD, YYYY"
  function formatDate(dateString: string): string {
    if (!dateString) return '';
    // Parse the date parts from the string to avoid timezone issues
    const [year, month, day] = dateString.split('-').map(num => parseInt(num, 10));
    const date = new Date(year, month - 1, day);
    
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long", 
      day: "numeric",
      timeZone: 'UTC' // Use UTC to preserve the exact date
    });
  }

  // Helper to get the display date (end_date if available, otherwise start_date)
  function getDisplayDate(note: BlogMeta): string {
    const dateToUse = (note.end_date && note.end_date.trim()) || note.start_date;
    return formatDate(dateToUse);
  }

  // Helper to build the correct route for a blog post
  function getBlogUrl(note: BlogMeta) {
    const categorySlug = note.category.toLowerCase().replace(/\s+/g, "-");
    return `/blog/${categorySlug}/${encodeURIComponent(note.slug)}`;
  }

  // Helper function to format category display name
  function formatCategoryDisplayName(category: string) {
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  if (!filteredNotes.length) {
    return <p className="text-center py-10 text-muted-foreground">No posts found.</p>;
  }

  return (
    <div>
      <table className="w-full text-sm border border-border overflow-hidden shadow-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50 text-foreground">
            <th className="py-2 text-left font-medium px-3">Title</th>
            <th className="py-2 text-left font-medium px-3">Category</th>
            <th className="py-2 text-left font-medium px-3">Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredNotes.map((note, index) => (
            <tr
              key={note.slug}
              className={`border-b border-border hover:bg-secondary/50 transition-colors cursor-pointer ${
                index % 2 === 0 ? 'bg-transparent' : 'bg-muted/5'
              }`}
              onClick={() => router.push(getBlogUrl(note))}
            >
              <td className="py-2 px-3">{note.title}</td>
              <td className="py-2 px-3">
                <Link 
                  href={`/blog/${note.category.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-foreground hover:text-primary"
                  onClick={(e) => e.stopPropagation()}
                >
                  {formatCategoryDisplayName(note.category)}
                </Link>
              </td>
              <td className="py-2 px-3">{getDisplayDate(note)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}