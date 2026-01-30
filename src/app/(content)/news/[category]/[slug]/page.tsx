/**
 * =============================================================================
 * News Article Page
 * =============================================================================
 *
 * Dynamic page for displaying individual news articles.
 * Fetches data from content.db via lib/data.ts functions.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

export const dynamic = 'force-static';
export const revalidate = false;

import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { getActiveContentByType } from "@/lib/data";
import NewsPageClient from "./NewsPageClient";
import { TOC } from "@/components/core/toc";
import { Sidenotes } from "@/components/core/sidenotes";
import { ViewTracker } from "@/components/view-tracker";
import { extractHeadingsFromMDX } from "@/lib/mdx";
import type { NewsMeta, NewsStatus, NewsConfidence } from "@/types/content";

// =============================================================================
// Types
// =============================================================================

interface NewsPageProps {
  params: Promise<{ category: string; slug: string }>;
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

  // Generate all category/slug combinations
  return newsContent.map(article => ({
    category: slugifyCategory(article.category),
    slug: article.slug
  }));
}

// =============================================================================
// Metadata
// =============================================================================

export async function generateMetadata({ params }: NewsPageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const { category, slug } = await params;
  const newsContent = getActiveContentByType('news');

  const newsArticle = newsContent.find(a =>
    slugifyCategory(a.category) === category && a.slug === slug
  );

  if (!newsArticle) {
    return {
      title: "Article Not Found",
    };
  }

  // Get the default OpenGraph image from parent
  const previousImages = (await parent).openGraph?.images || [];
  // Use Kris Yotam's logo for news articles
  const images = [
    {
      url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
      width: 1200,
      height: 2100,
      alt: newsArticle.title
    }
  ];

  const url = `https://krisyotam.com/news/${category}/${slug}`;

  return {
    title: `${newsArticle.title} | ${newsArticle.category} News | Kris Yotam`,
    description: newsArticle.preview || `News article about ${newsArticle.title}`,
    openGraph: {
      title: newsArticle.title,
      description: newsArticle.preview || `News article about ${newsArticle.title}`,
      url,
      type: "article",
      images,
      siteName: "Kris Yotam",
    },
    twitter: {
      card: "summary_large_image",
      title: newsArticle.title,
      description: newsArticle.preview || `News article about ${newsArticle.title}`,
      images: images.map(img => img.url),
      creator: "@krisyotam"
    }
  };
}

// =============================================================================
// Page Component
// =============================================================================

export default async function NewsPage({ params }: NewsPageProps) {
  const { category, slug } = await params;
  const newsContent = getActiveContentByType('news');

  const newsArticle = newsContent.find(a =>
    slugifyCategory(a.category) === category && a.slug === slug
  );

  if (!newsArticle) {
    notFound();
  }

  const article: NewsMeta = {
    title: newsArticle.title,
    subtitle: newsArticle.subtitle,
    preview: newsArticle.preview,
    start_date: newsArticle.start_date,
    end_date: newsArticle.end_date,
    slug: newsArticle.slug,
    tags: newsArticle.tags,
    category: newsArticle.category,
    status: newsArticle.status as NewsStatus,
    confidence: newsArticle.confidence as NewsConfidence,
    importance: newsArticle.importance
  };

  const news: NewsMeta[] = newsContent.map(item => ({
    title: item.title,
    subtitle: item.subtitle,
    preview: item.preview,
    start_date: item.start_date,
    end_date: item.end_date,
    slug: item.slug,
    tags: item.tags,
    category: item.category,
    status: item.status as NewsStatus,
    confidence: item.confidence as NewsConfidence,
    importance: item.importance
  }));

  // Extract headings from the news MDX content
  const headings = await extractHeadingsFromMDX('news', slug, category);

  // Dynamically import the MDX file based on category and slug
  const NewsArticle = (await import(`@/app/(content)/news/content/${category}/${slug}.mdx`)).default;

  const viewSlug = `news/${category}/${slug}`;

  return (
    <div className="relative min-h-screen bg-background text-foreground pt-16">
      <ViewTracker slug={viewSlug} />
      <div className="max-w-6xl mx-auto px-4">
        {/* Header section - full width */}
        <div className="mb-8">
          <NewsPageClient article={article} allNews={news} headerOnly={true} />
        </div>

        {/* Main content */}
        <main id="content" className="container max-w-[672px] mx-auto px-4">
          {/* Table of Contents - at the top of content */}
          {headings.length > 0 && (
            <TOC headings={headings} />
          )}

          <div className="content">
            <NewsArticle />
          </div>
          <NewsPageClient article={article} allNews={news} contentOnly={true} />
        </main>

        {/* Sidenotes for wide viewports */}
        <Sidenotes containerSelector="#content" />
      </div>
    </div>
  );
}
