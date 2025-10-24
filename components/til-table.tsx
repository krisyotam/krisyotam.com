"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface TilEntry {
  title: string;
  preview: string;
  start_date: string;
  end_date?: string;
  tags: string[];
  category: string;
  slug: string;
  status?: string;
  confidence?: string;
  importance?: number;
}

interface TilTableProps {
  tilEntries: TilEntry[];
  searchQuery: string;
  activeCategory: string;
}

export function TilTable({ tilEntries, searchQuery, activeCategory }: TilTableProps) {
  const [filteredEntries, setFilteredEntries] = useState<TilEntry[]>(tilEntries);
  const router = useRouter();

  useEffect(() => {
    const filtered = tilEntries.filter((entry) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        entry.title.toLowerCase().includes(q) ||
        entry.preview.toLowerCase().includes(q) ||
        entry.tags.some((t) => t.toLowerCase().includes(q)) ||
        entry.category.toLowerCase().includes(q);

      const matchesCategory = activeCategory === "all" || entry.category === activeCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort by date descending (newest first)
    filtered.sort((a, b) => {
      const aDate = (a.end_date && a.end_date.trim()) ? a.end_date : a.start_date;
      const bDate = (b.end_date && b.end_date.trim()) ? b.end_date : b.start_date;
      return new Date(bDate).getTime() - new Date(aDate).getTime();
    });
    setFilteredEntries(filtered);
  }, [tilEntries, searchQuery, activeCategory]);

  // Helper to format date as "Month DD, YYYY"
  function formatDate(entry: TilEntry): string {
    const dateToUse = (entry.end_date && entry.end_date.trim()) ? entry.end_date : entry.start_date;
    const date = new Date(dateToUse);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long", 
      day: "numeric"
    });
  }

  // Helper to build the correct route for a TIL entry
  function getTilUrl(entry: TilEntry) {
    return `/til/${entry.slug}`;
  }

  if (!filteredEntries.length) {
    return <p className="text-center py-10 text-muted-foreground">No TIL entries found.</p>;
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
          {filteredEntries.map((entry, index) => (
            <tr
              key={entry.slug}
              className={`border-b border-border hover:bg-secondary/50 transition-colors cursor-pointer ${
                index % 2 === 0 ? 'bg-transparent' : 'bg-muted/5'
              }`}
              onClick={() => router.push(getTilUrl(entry))}
            >
              <td className="py-2 px-3 font-medium">{entry.title}</td>
              <td className="py-2 px-3">{entry.category}</td>
              <td className="py-2 px-3">{formatDate(entry)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {filteredEntries.length === 0 && (
        <div className="text-muted-foreground text-sm mt-6">No TIL entries found matching your criteria.</div>
      )}
    </div>
  );
}
