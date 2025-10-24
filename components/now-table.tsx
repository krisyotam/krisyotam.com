"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface NowEntry {
  title: string;
  preview: string;
  date: string;
  tags: string[];
  category: string;
  slug: string;
  cover_image: string;
  status: string;
  confidence: string;
  importance: number;
  state: string;
}

interface NowTableProps {
  nowEntries: NowEntry[];
  searchQuery: string;
  activeCategory: string;
}

export function NowTable({ nowEntries, searchQuery, activeCategory }: NowTableProps) {
  const [filteredEntries, setFilteredEntries] = useState<NowEntry[]>(nowEntries);
  const router = useRouter();

  useEffect(() => {
    const filtered = nowEntries.filter((entry) => {
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
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setFilteredEntries(filtered);
  }, [nowEntries, searchQuery, activeCategory]);

  // Helper to format date as "Month DD, YYYY"
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long", 
      day: "numeric"
    });
  }

  // Helper to build the correct route for a Now entry
  function getNowUrl(entry: NowEntry) {
    return `/now/${entry.slug}`;
  }

  if (!filteredEntries.length) {
    return <p className="text-center py-10 text-muted-foreground">No Now entries found.</p>;
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
              onClick={() => router.push(getNowUrl(entry))}
            >
              <td className="py-2 px-3 font-medium">{entry.title}</td>
              <td className="py-2 px-3">{entry.category}</td>
              <td className="py-2 px-3">{formatDate(entry.date)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {filteredEntries.length === 0 && (
        <div className="text-muted-foreground text-sm mt-6">No Now entries found matching your criteria.</div>
      )}
    </div>
  );
}
