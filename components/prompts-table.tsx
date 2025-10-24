"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Prompt {
  title: string;
  date: string;
  slug: string;
  tags: string[];
  category: string;
  status?: string;
  confidence?: string;
  importance?: number;
  model?: string;
  author?: string;
  license?: string;
  filename?: string;
}

interface PromptsTableProps {
  prompts: Prompt[];
  searchQuery: string;
  activeCategory: string;
}

export function PromptsTable({ prompts, searchQuery, activeCategory }: PromptsTableProps) {
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>(prompts);
  const router = useRouter();

  useEffect(() => {
    const filtered = prompts.filter((prompt) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        prompt.title.toLowerCase().includes(q) ||
        prompt.tags.some((t) => t.toLowerCase().includes(q)) ||
        prompt.category.toLowerCase().includes(q) ||
        (prompt.model && prompt.model.toLowerCase().includes(q)) ||
        (prompt.author && prompt.author.toLowerCase().includes(q));

      const matchesCategory = activeCategory === "all" || prompt.category === activeCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort by date descending (newest first)
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setFilteredPrompts(filtered);
  }, [prompts, searchQuery, activeCategory]);

  // Helper to format date as "Month DD, YYYY"
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long", 
      day: "numeric"
    });
  }
  
  // Helper to build the correct route for a prompt
  function getPromptUrl(prompt: Prompt) {
    const categorySlug = prompt.category.toLowerCase().replace(/\s+/g, "-");
    return `/prompts/${categorySlug}/${encodeURIComponent(prompt.slug)}`;
  }

  // Helper function to format category display name
  function formatCategoryDisplayName(category: string) {
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  if (!filteredPrompts.length) {
    return <p className="text-center py-10 text-muted-foreground">No prompts found.</p>;
  }

  return (
    <div className="mt-8">
      <table className="w-full text-sm border border-border overflow-hidden shadow-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50 text-foreground">
            <th className="py-2 text-left font-medium px-3">Title</th>
            <th className="py-2 text-left font-medium px-3">Model</th>
            <th className="py-2 text-left font-medium px-3">Category</th>
            <th className="py-2 text-left font-medium px-3">Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredPrompts.map((prompt, index) => (
            <tr
              key={prompt.slug}
              className={`border-b border-border hover:bg-secondary/50 transition-colors cursor-pointer ${
                index % 2 === 0 ? 'bg-transparent' : 'bg-muted/5'
              }`}
              onClick={() => router.push(getPromptUrl(prompt))}
            >
              <td className="py-2 px-3 font-medium">{prompt.title}</td>
              <td className="py-2 px-3">{prompt.model || 'N/A'}</td>
              <td className="py-2 px-3">{formatCategoryDisplayName(prompt.category)}</td>
              <td className="py-2 px-3">{formatDate(prompt.date)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {filteredPrompts.length === 0 && (
        <div className="text-muted-foreground text-sm mt-6">No prompts found matching your criteria.</div>
      )}
    </div>
  );
}
