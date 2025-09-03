"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Story {
  title: string;
  start_date: string;
  end_date?: string;
  slug: string;
  tags: string[];
  category: string;
  cover_image?: string;
  status: string;
  confidence: string;
  importance: number;
  preview: string;
  state: "active" | "hidden";
}

interface FictionTableProps {
  stories: Story[];
  searchQuery: string;
  activeCategory: string;
}

export function FictionTable({ stories, searchQuery, activeCategory }: FictionTableProps) {
  const [filteredStories, setFilteredStories] = useState<Story[]>(stories);
  const router = useRouter();

  useEffect(() => {
    const filtered = stories.filter((story) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        story.title.toLowerCase().includes(q) ||
        story.tags.some((t) => t.toLowerCase().includes(q)) ||
        story.category.toLowerCase().includes(q);

      const matchesCategory = activeCategory === "all" || story.category === activeCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort by date descending (newest first)
    filtered.sort((a, b) => {
      const aDate = a.end_date || a.start_date;
      const bDate = b.end_date || b.start_date;
      return new Date(bDate).getTime() - new Date(aDate).getTime();
    });
    setFilteredStories(filtered);
  }, [stories, searchQuery, activeCategory]);

  // Helper to format date as "Month DD, YYYY"
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long", 
      day: "numeric"
    });
  }

  // Helper to build the correct route for a story
  function getStoryUrl(story: Story) {
    const categorySlug = story.category.toLowerCase().replace(/\s+/g, "-");
    return `/fiction/${categorySlug}/${encodeURIComponent(story.slug)}`;
  }

  if (!filteredStories.length) {
    return <p className="text-center py-10 text-muted-foreground">No stories found.</p>;
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
          {filteredStories.map((story, index) => (
            <tr
              key={story.slug}
              className={`border-b border-border hover:bg-secondary/50 transition-colors cursor-pointer ${
                index % 2 === 0 ? 'bg-transparent' : 'bg-muted/5'
              }`}
              onClick={() => router.push(getStoryUrl(story))}
            >
              <td className="py-2 px-3">{story.title}</td>
              <td className="py-2 px-3">{story.category}</td>
              <td className="py-2 px-3">{formatDate(story.end_date || story.start_date)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {filteredStories.length === 0 && (
        <div className="text-muted-foreground text-sm mt-6">No stories found matching your criteria.</div>
      )}
    </div>
  );
}
