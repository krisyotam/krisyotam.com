/**
 * =============================================================================
 * News Category Page
 * =============================================================================
 *
 * Dynamic page for displaying news articles filtered by category.
 * Fetches data from content.db via lib/data.ts functions.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

import NewsClientPage from "../NewsClientPage";
import { getActiveContentByType, getCategoriesByContentType } from "@/lib/data";
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import type { NewsMeta, NewsStatus, NewsConfidence } from "@/types/content";

// =============================================================================
// Types
// =============================================================================

interface PageProps {
  params: Promise<{ category: string }>;
}

// =============================================================================
// Helpers
// =============================================================================

function slugifyCategory(category: string) {
  return category.toLowerCase().replace(/\s+/g, "-");
}

// =============================================================================
// Static Generation
// =============================================================================

export async function generateStaticParams() {
  const newsContent = getActiveContentByType('news');

  // Get all unique categories and generate their slugs
  const categories = new Set(newsContent.map(article =>
    slugifyCategory(article.category)
  ));

  return Array.from(categories).map(category => ({
    category: category
  }));
}

// =============================================================================
// Metadata
// =============================================================================

export async function generateMetadata({ params }: PageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const categories = getCategoriesByContentType('news');
  const categoryData = categories.find(cat => cat.slug === categorySlug);

  if (!categoryData) {
    return {
      title: "Category Not Found",
    };
  }

  const url = `https://krisyotam.com/news/${categorySlug}`;
  // Use Kris Yotam's logo for category pages
  const images = [
    {
      url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
      width: 1200,
      height: 630,
      alt: `${categoryData.title}`
    }
  ];

  return {
    title: `${categoryData.title} | News`,
    description: categoryData.preview || "",
    openGraph: {
      title: categoryData.title,
      description: categoryData.preview || "",
      url,
      type: "website",
      images,
      siteName: "Kris Yotam",
    },
    twitter: {
      card: "summary_large_image",
      title: categoryData.title,
      description: categoryData.preview || "",
      images: images.map(img => img.url),
      creator: "@krisyotam"
    }
  };
}

// =============================================================================
// Page Component
// =============================================================================

export default async function NewsCategoryPage({ params }: PageProps) {
  const { category: categorySlug } = await params;

  const newsContent = getActiveContentByType('news');
  const categories = getCategoriesByContentType('news');

  // Find the original category name
  const originalCategory = newsContent.find(article =>
    slugifyCategory(article.category) === categorySlug
  )?.category;

  if (!originalCategory) {
    notFound();
  }

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
      <NewsClientPage news={news} initialCategory={originalCategory} categories={categories} />
    </div>
  );
}
