/**
 * =============================================================================
 * Paper Detail Page
 * =============================================================================
 *
 * Dynamic route for displaying individual papers.
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
import PapersPageClient from "./PapersPageClient";
import { TOC } from "@/components/core/toc";
import { Sidenotes } from "@/components/core/sidenotes";
import { ViewTracker } from "@/components/core/view-tracker";
import { extractHeadingsFromMDX } from "@/lib/mdx";
import type { PaperMeta, PaperStatus, PaperConfidence } from "@/types/content";

// =============================================================================
// Types
// =============================================================================

interface PaperPageProps {
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
  const papers = getContentByType('papers');

  return papers.map(paper => ({
    category: slugifyCategory(paper.category),
    slug: paper.slug
  }));
}

// =============================================================================
// Metadata
// =============================================================================

export async function generateMetadata(
  { params }: PaperPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { category, slug } = await params;
  const papers = getContentByType('papers');

  const paperItem = papers.find(p =>
    slugifyCategory(p.category) === category && p.slug === slug
  );

  if (!paperItem) {
    return { title: "Paper Not Found" };
  }

  const images = [{
    url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
    width: 1200,
    height: 2100,
    alt: paperItem.title
  }];

  const url = `https://krisyotam.com/papers/${category}/${slug}`;

  return {
    title: `${paperItem.title} | ${paperItem.category} Papers`,
    description: paperItem.preview || `Research paper: ${paperItem.title}`,
    openGraph: {
      title: paperItem.title,
      description: paperItem.preview || `Research paper: ${paperItem.title}`,
      url,
      type: "article",
      images,
      siteName: "Kris Yotam",
    },
    twitter: {
      card: "summary_large_image",
      title: paperItem.title,
      description: paperItem.preview || `Research paper: ${paperItem.title}`,
      images: images.map(img => img.url),
      creator: "@krisyotam"
    }
  };
}

// =============================================================================
// Page Component
// =============================================================================

export default async function PaperPage({ params }: PaperPageProps) {
  const { category, slug } = await params;
  const allPapers = getContentByType('papers');

  const paperItem = allPapers.find(p =>
    slugifyCategory(p.category) === category && p.slug === slug
  );

  if (!paperItem) {
    notFound();
  }

  // Transform paper data
  const paperData: PaperMeta = {
    ...paperItem,
    status: paperItem.status as PaperStatus,
    confidence: paperItem.confidence as PaperConfidence
  };

  const papers: PaperMeta[] = allPapers.map(p => ({
    ...p,
    start_date: p.start_date || new Date().toISOString(),
    end_date: p.end_date || new Date().toISOString().split('T')[0],
    status: p.status as PaperStatus,
    confidence: p.confidence as PaperConfidence
  }));

  // Extract headings from MDX content
  const headings = await extractHeadingsFromMDX('papers', slug, category);

  // Dynamically import MDX file
  const PaperArticle = (
    await import(`@/content/papers/${slug}.mdx`)
  ).default;

  const viewSlug = `papers/${category}/${slug}`;

  return (
    <div className="relative min-h-screen bg-background text-foreground pt-16">
      <ViewTracker slug={viewSlug} />
      <div className="max-w-6xl mx-auto px-4">
        {/* Header section */}
        <div className="mb-8">
          <PapersPageClient
            paperData={paperData}
            allPapers={papers}
            headerOnly={true}
          />
        </div>

        {/* Main content */}
        <main id="content" className="container max-w-[672px] mx-auto px-4">
          {headings.length > 0 && <TOC headings={headings} />}

          <div className="content">
            <PaperArticle />
          </div>

          <PapersPageClient
            paperData={paperData}
            allPapers={papers}
            contentOnly={true}
          />
        </main>

        <Sidenotes containerSelector="#content" />
      </div>
    </div>
  );
}
