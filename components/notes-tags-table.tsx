"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface NoteTag {
  slug: string;
  title: string;
  preview: string;
  date: string;
  status: string;
  confidence: string;
  importance: number;
}

interface NotesTagsTableProps {
  tags: NoteTag[];
  searchQuery: string;
}

export function NotesTagsTable({ tags, searchQuery }: NotesTagsTableProps) {
  const [filteredTags, setFilteredTags] = useState<NoteTag[]>(tags);
  const router = useRouter();

  useEffect(() => {
    const filtered = tags.filter((tag) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        tag.title.toLowerCase().includes(q) ||
        tag.preview.toLowerCase().includes(q) ||
        tag.status.toLowerCase().includes(q);

      return matchesSearch;
    });

    // Sort by importance descending (most important first)
    filtered.sort((a, b) => b.importance - a.importance);
    setFilteredTags(filtered);
  }, [tags, searchQuery]);

  // Helper to format date as "Month DD, YYYY"
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }

  // Helper to build the correct route for a tag
  function getTagUrl(tag: NoteTag) {
    return `/notes/tag/${tag.slug}`;
  }

  if (!filteredTags.length) {
    return <p className="text-center py-10 text-muted-foreground">No tags found.</p>;
  }

  return (
    <div className="mt-8">
      <table className="w-full text-sm border border-border overflow-hidden shadow-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50 text-foreground">
            <th className="py-2 text-left font-medium px-3">Tag</th>
            <th className="py-2 text-left font-medium px-3">Description</th>
            <th className="py-2 text-left font-medium px-3">Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredTags.map((tag, index) => (
            <tr
              key={tag.slug}
              className={`border-b border-border hover:bg-secondary/50 transition-colors cursor-pointer ${
                index % 2 === 0 ? 'bg-transparent' : 'bg-muted/5'
              }`}
              onClick={() => router.push(getTagUrl(tag))}
            >
              <td className="py-2 px-3 font-medium">{tag.title}</td>
              <td className="py-2 px-3">{tag.preview}</td>
              <td className="py-2 px-3">{formatDate(tag.date)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {filteredTags.length === 0 && (
        <div className="text-muted-foreground text-sm mt-6">No tags found matching your criteria.</div>
      )}
    </div>
  );
}
