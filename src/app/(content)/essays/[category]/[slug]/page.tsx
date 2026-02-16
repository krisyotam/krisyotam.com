/**
 * =============================================================================
 * Essay Detail Page
 * =============================================================================
 *
 * Dynamic route for displaying individual essays.
 * Fetches data from content.db via lib/data.ts functions.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

export const dynamic = 'force-static';
export const revalidate = false;

import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { getContentByType } from "@/lib/data";
import EssayPageClient from "./EssayPageClient";
import { TOC } from "@/components/core/toc";
import { Sidenotes } from "@/components/core/sidenotes";
import { ViewTracker } from "@/components/core/view-tracker";
import { extractHeadingsFromMDX } from "@/lib/mdx";
import type { Post } from "@/lib/posts";

// =============================================================================
// Types
// =============================================================================

interface EssayPageProps {
  params: Promise<{ category: string; slug: string }>;
}

// =============================================================================
// Static Generation
// =============================================================================

export async function generateStaticParams() {
  const essays = getContentByType('essays');

  return essays.map(essay => ({
    category: essay.category,
    slug: essay.slug
  }));
}

// =============================================================================
// Metadata
// =============================================================================

export async function generateMetadata(
  { params }: EssayPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { category, slug } = await params;
  const essays = getContentByType('essays');

  const essayItem = essays.find(e =>
    e.category === category && e.slug === slug
  );

  if (!essayItem) {
    return { title: "Essay Not Found" };
  }

  const coverUrl = essayItem.cover_image ||
    `https://picsum.photos/1200/630?text=${encodeURIComponent(essayItem.title)}`;
  const url = `https://krisyotam.com/essays/${category}/${slug}`;

  return {
    title: `${essayItem.title}`,
    description: essayItem.preview || "Read more on Kris Yotam's essays",
    openGraph: {
      title: essayItem.title,
      description: essayItem.preview || "Read more on Kris Yotam's essays",
      url,
      type: "article",
      images: [{
        url: coverUrl,
        width: 1200,
        height: 630,
        alt: essayItem.title
      }],
      siteName: "Kris Yotam",
    },
    twitter: {
      card: "summary_large_image",
      title: essayItem.title,
      description: essayItem.preview || "Read more on Kris Yotam's essays",
      images: [coverUrl],
      creator: "@krisyotam"
    }
  };
}

// =============================================================================
// Page Component
// =============================================================================

export default async function EssayPage({ params }: EssayPageProps) {
  const { category, slug } = await params;
  const essays = getContentByType('essays');

  const essayItem = essays.find(e =>
    e.category === category && e.slug === slug
  );

  if (!essayItem) {
    notFound();
  }

  // Extract headings from MDX content
  const headings = await extractHeadingsFromMDX('essays', slug, category);

  // Dynamically import MDX file
  const EssayArticle = (
    await import(`@/content/essays/${slug}.mdx`)
  ).default;

  const viewSlug = `essays/${category}/${slug}`;

  return (
    <div className="relative min-h-screen bg-background text-foreground pt-16">
      <ViewTracker slug={viewSlug} />
      <div className="max-w-6xl mx-auto px-4">
        {/* Header section */}
        <div className="mb-8">
          <EssayPageClient
            essayData={essayItem}
            allEssays={essays}
            headerOnly={true}
          />
        </div>

        {/* Main content */}
        <main id="content" className="container max-w-[672px] mx-auto px-4">
          {headings.length > 0 && <TOC headings={headings} />}

          <div className="essays-content">
            <EssayArticle />
          </div>

          <EssayPageClient
            essayData={essayItem}
            allEssays={essays}
            contentOnly={true}
          />
        </main>

        <Sidenotes containerSelector="#content" />
      </div>
    </div>
  );
}
