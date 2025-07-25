"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { NewsMeta } from "@/types/news";

interface NewsTableProps {
  news: NewsMeta[];
  searchQuery: string;
  activeCategory: string;
}

export function NewsTable({ news, searchQuery, activeCategory }: NewsTableProps) {
  const [filteredNews, setFilteredNews] = useState<NewsMeta[]>(news);
  const router = useRouter();

  useEffect(() => {
    const filtered = news.filter((article) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        article.title.toLowerCase().includes(q) ||
        article.tags.some((t) => t.toLowerCase().includes(q)) ||
        article.category.toLowerCase().includes(q);

      const matchesCategory = activeCategory === "all" || article.category === activeCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort by date descending (newest first)
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setFilteredNews(filtered);
  }, [news, searchQuery, activeCategory]);

  // Helper to format date as "Month DD, YYYY"
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long", 
      day: "numeric"
    });
  }

  // Helper to build the correct route for a news article
  function getNewsUrl(article: NewsMeta) {
    return `/news/${encodeURIComponent(article.category)}/${encodeURIComponent(article.slug)}`;
  }

  // Helper function to format category display name
  function formatCategoryDisplayName(category: string) {
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
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
          {filteredNews.map((article, index) => (
            <tr
              key={article.slug}
              className={`border-b border-border hover:bg-secondary/50 transition-colors cursor-pointer ${
                index % 2 === 0 ? 'bg-transparent' : 'bg-muted/5'
              }`}
              onClick={() => router.push(getNewsUrl(article))}
            >
              <td className="py-2 px-3 font-medium">{article.title}</td>
              <td className="py-2 px-3">
                <Link 
                  href={`/news/${article.category}`}
                  className="text-foreground hover:text-primary"
                  onClick={(e) => e.stopPropagation()}
                >
                  {formatCategoryDisplayName(article.category)}
                </Link>
              </td>
              <td className="py-2 px-3">{formatDate(article.date)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {filteredNews.length === 0 && (
        <div className="text-muted-foreground text-sm mt-6">No news articles found matching your criteria.</div>
      )}
    </div>
  );
}
