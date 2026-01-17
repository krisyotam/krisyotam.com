/**
 * =============================================================================
 * News Index Page
 * =============================================================================
 *
 * Main listing page for all news articles.
 * Fetches data from content.db via lib/data.ts functions.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

import NewsClientPage from "./NewsClientPage";
import { getActiveContentByType, getCategoriesByContentType } from "@/lib/data";
import type { Metadata } from "next";
import type { NewsMeta, NewsStatus, NewsConfidence } from "@/types/content";
import { staticMetadata } from "@/lib/staticMetadata";

// =============================================================================
// Metadata
// =============================================================================

export const metadata: Metadata = staticMetadata.news;

// =============================================================================
// Page Component
// =============================================================================

export default function NewsPage() {
  // Fetch news from database
  const newsContent = getActiveContentByType('news');
  const categories = getCategoriesByContentType('news');

  // Map and sort news by date (newest first)
  const news: NewsMeta[] = newsContent.map(article => ({
    title: article.title,
    subtitle: article.subtitle,
    preview: article.preview,
    start_date: article.start_date,
    end_date: article.end_date,
    slug: article.slug,
    tags: article.tags,
    category: article.category,
    status: article.status as NewsStatus,
    confidence: article.confidence as NewsConfidence,
    importance: article.importance
  })).sort((a, b) => {
    const aDate = (a.end_date?.trim()) ? a.end_date : a.start_date;
    const bDate = (b.end_date?.trim()) ? b.end_date : b.start_date;
    return new Date(bDate).getTime() - new Date(aDate).getTime();
  });

  return (
    <div className="news-container">
      <NewsClientPage news={news} initialCategory="all" categories={categories} />
    </div>
  );
}
