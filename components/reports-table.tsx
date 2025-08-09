"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Post } from "@/utils/posts";

interface ReportsTableProps {
  notes: Post[];
  searchQuery: string;
  activeCategory: string;
}

export function ReportsTable({ notes, searchQuery, activeCategory }: ReportsTableProps) {
  const [filteredNotes, setFilteredNotes] = useState<Post[]>(notes);
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
      return matchesSearch && matchesCategory;
    });

    // Sort by date descending (newest first)
    filtered.sort((a, b) => {
      const dateA = (a.end_date && a.end_date.trim()) ? a.end_date : a.start_date;
      const dateB = (b.end_date && b.end_date.trim()) ? b.end_date : b.start_date;
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
  // Helper to build the correct route for a report
  function getReportUrl(note: Post) {
    const displayDate = (note.end_date && note.end_date.trim()) ? note.end_date : note.start_date;
    const year = new Date(displayDate).getFullYear();
    return `/reports/${year}/${note.slug}`;
  }

  if (!filteredNotes.length) {
    return <p className="text-center py-10 text-muted-foreground">No reports found.</p>;
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
          {filteredNotes.map((note, index) => (
            <tr
              key={note.slug}
              className={`border-b border-border hover:bg-secondary/50 transition-colors cursor-pointer ${
                index % 2 === 0 ? 'bg-transparent' : 'bg-muted/5'
              }`}
              onClick={() => router.push(getReportUrl(note))}
            >
              <td className="py-2 px-3 font-medium">{note.title}</td>
              <td className="py-2 px-3">{note.category}</td>
              <td className="py-2 px-3">{formatDate((note.end_date && note.end_date.trim()) ? note.end_date : note.start_date)}</td>
            </tr>
          ))}
        </tbody>
      </table>
        {filteredNotes.length === 0 && (
        <div className="text-muted-foreground text-sm mt-6">No reports found matching your criteria.</div>
      )}
    </div>
  );
} 