"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Liber {
  title: string;
  start_date: string;
  end_date?: string;
  slug: string;
  tags: string[];
  category: string;
  status?: string;
  confidence?: string;
  importance?: number;
}

interface LibersTableProps {
  libers: Liber[];
  searchQuery: string;
  activeCategory: string;
}

export function LibersTable({ libers, searchQuery, activeCategory }: LibersTableProps) {
  const [filteredLibers, setFilteredLibers] = useState<Liber[]>(libers);
  const router = useRouter();

  useEffect(() => {
    const filtered = libers.filter((liber) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        liber.title.toLowerCase().includes(q) ||
        liber.tags.some((t) => t.toLowerCase().includes(q)) ||
        liber.category.toLowerCase().includes(q);

      const matchesCategory = activeCategory === "all" || liber.category === activeCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort by date descending (newest first)
    filtered.sort((a, b) => {
      const dateA = (a.end_date && a.end_date.trim()) || a.start_date || '';
      const dateB = (b.end_date && b.end_date.trim()) || b.start_date || '';
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });
    setFilteredLibers(filtered);
  }, [libers, searchQuery, activeCategory]);

  // Helper to format date as "Month DD, YYYY"
  function formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }
  
  // Helper to get the display date (end_date if available, otherwise start_date)
  function getDisplayDate(liber: Liber): string {
    const dateToUse = (liber.end_date && liber.end_date.trim()) || liber.start_date;
    return formatDate(dateToUse);
  }
  
  // Helper to build the correct route for a liber
  function getLiberUrl(liber: Liber) {
    const categorySlug = liber.category.toLowerCase().replace(/\s+/g, "-");
    return `/libers/${categorySlug}/${encodeURIComponent(liber.slug)}`;
  }

  // Helper function to format category display name
  function formatCategoryDisplayName(category: string) {
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  if (!filteredLibers.length) {
    return <p className="text-center py-10 text-muted-foreground">No libers found.</p>;
  }

  return (
    <div className="mt-8">
      <table className="w-full text-sm border border-border overflow-hidden shadow-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50 text-foreground">
            <th className="py-2 text-left font-medium px-3">Title</th>
            <th className="py-2 text-left font-medium px-3">Category</th>
            <th className="py-2 text-left font-medium px-3">Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredLibers.map((liber, index) => (
            <tr
              key={liber.slug}
              className={`border-b border-border hover:bg-secondary/50 transition-colors cursor-pointer ${
                index % 2 === 0 ? 'bg-transparent' : 'bg-muted/5'
              }`}
              onClick={() => router.push(getLiberUrl(liber))}
            >
              <td className="py-2 px-3 font-medium">{liber.title}</td>
              <td className="py-2 px-3">{formatCategoryDisplayName(liber.category)}</td>
              <td className="py-2 px-3">{getDisplayDate(liber)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {filteredLibers.length === 0 && (
        <div className="text-muted-foreground text-sm mt-6">No libers found matching your criteria.</div>
      )}
    </div>
  );
}
