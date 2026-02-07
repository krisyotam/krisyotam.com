/**
 * =============================================================================
 * Diary Entry Detail Page
 * =============================================================================
 *
 * Dynamic route for displaying individual diary entries.
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
import DiaryPageClient from "./DiaryPageClient";
import { TOC } from "@/components/core/toc";
import { Sidenotes } from "@/components/core/sidenotes";
import { ViewTracker } from "@/components/core/view-tracker";
import { extractHeadingsFromMDX } from "@/lib/mdx";
import type { DiaryMeta } from "@/types/content";

// =============================================================================
// Types
// =============================================================================

interface DiaryPageProps {
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
  const entries = getContentByType('diary');

  return entries.map(entry => ({
    category: slugifyCategory(entry.category),
    slug: entry.slug
  }));
}

// =============================================================================
// Metadata
// =============================================================================

export async function generateMetadata(
  { params }: DiaryPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { category, slug } = await params;
  const entries = getContentByType('diary');

  const entry = entries.find(e =>
    slugifyCategory(e.category) === category && e.slug === slug
  );

  if (!entry) {
    return { title: "Entry Not Found" };
  }

  const coverUrl = entry.cover_image ||
    `https://picsum.photos/1200/630?text=${encodeURIComponent(entry.title)}`;
  const url = `https://krisyotam.com/diary/${category}/${slug}`;

  return {
    title: `${entry.title} | Diary | Kris Yotam`,
    description: entry.preview || `Diary entry: ${entry.title}`,
    openGraph: {
      title: entry.title,
      description: entry.preview || `Read this diary entry`,
      url,
      type: "article",
      images: [{
        url: coverUrl,
        width: 1200,
        height: 630,
        alt: entry.title
      }],
      siteName: "Kris Yotam",
    },
    twitter: {
      card: "summary_large_image",
      title: entry.title,
      description: entry.preview || `Read this diary entry`,
      images: [coverUrl],
      creator: "@krisyotam"
    }
  };
}

// =============================================================================
// Page Component
// =============================================================================

export default async function DiaryEntryPage({ params }: DiaryPageProps) {
  const { category, slug } = await params;
  const allEntries = getContentByType('diary');

  const entryData = allEntries.find(e =>
    slugifyCategory(e.category) === category && e.slug === slug
  );

  if (!entryData) {
    notFound();
  }

  // Transform entry data
  const entry: DiaryMeta = {
    title: entryData.title,
    preview: entryData.preview,
    start_date: entryData.start_date,
    end_date: entryData.end_date,
    slug: entryData.slug,
    tags: entryData.tags || [],
    category: entryData.category,
    cover_image: entryData.cover_image,
    state: entryData.state as DiaryMeta['state'],
  };

  const entries: DiaryMeta[] = allEntries.map(e => ({
    title: e.title,
    preview: e.preview,
    start_date: e.start_date,
    end_date: e.end_date,
    slug: e.slug,
    tags: e.tags || [],
    category: e.category,
    cover_image: e.cover_image,
    state: e.state as DiaryMeta['state'],
  }));

  // Extract headings from MDX content
  const headings = await extractHeadingsFromMDX('diary', slug, category);

  // Dynamically import MDX file
  let Entry;
  try {
    Entry = (await import(`@/app/(content)/diary/content/${category}/${slug}.mdx`)).default;
  } catch (error) {
    console.error(`Could not find MDX file for diary/${category}/${slug}`);
    notFound();
  }

  const viewSlug = `diary/${category}/${slug}`;

  return (
    <div className="relative min-h-screen bg-background text-foreground pt-16">
      <ViewTracker slug={viewSlug} />
      <div className="max-w-6xl mx-auto px-4">
        {/* Header section */}
        <div>
          <DiaryPageClient entry={entry} allEntries={entries} headerOnly={true} />
        </div>

        {/* Main content */}
        <main id="content" className="container max-w-[672px] mx-auto px-4">
          {headings.length > 0 && <TOC headings={headings} />}

          <div className="content">
            <Entry />
          </div>

          <DiaryPageClient entry={entry} allEntries={entries} contentOnly={true} />
        </main>

        <Sidenotes containerSelector="#content" />
      </div>
    </div>
  );
}
