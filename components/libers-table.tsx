"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Liber {
  title: string;
  date: string;
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
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setFilteredLibers(filtered);
  }, [libers, searchQuery, activeCategory]);

  // Helper to format date as "Month DD, YYYY"
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }
  
  // Helper to build the correct route for a liber
  function getLiberUrl(liber: Liber) {
    const categorySlug = liber.category.toLowerCase().replace(/\s+/g, "-");
    return `/libers/${categorySlug}/${encodeURIComponent(liber.slug)}`;
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
              <td className="py-2 px-3">{liber.category}</td>
              <td className="py-2 px-3">{formatDate(liber.date)}</td>
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
