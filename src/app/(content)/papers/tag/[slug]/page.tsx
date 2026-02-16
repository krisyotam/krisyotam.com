/**
 * =============================================================================
 * Paper Tag Page
 * =============================================================================
 *
 * Dynamic route for displaying papers with a specific tag.
 * Fetches data from content.db via lib/data.ts functions.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

import PapersTaggedPage from "./PapersTaggedPage";
import { getActiveContentByType, getTagsByContentType } from "@/lib/data";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { PaperMeta } from "@/types/content";

// =============================================================================
// Types
// =============================================================================

interface PageProps {
  params: Promise<{ slug: string }>;
}

// =============================================================================
// Helpers
// =============================================================================

function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// =============================================================================
// Static Generation
// =============================================================================

export async function generateStaticParams() {
  const papers = getActiveContentByType('papers');

  const allTagsSet = new Set<string>();
  papers.forEach(paper => {
    if (paper.tags && Array.isArray(paper.tags)) {
      paper.tags.forEach(tag => allTagsSet.add(titleToSlug(tag)));
    }
  });

  return Array.from(allTagsSet).map(slug => ({ slug }));
}

// =============================================================================
// Metadata
// =============================================================================

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug: tagSlug } = await params;
  const papers = getActiveContentByType('papers');
  const dbTags = getTagsByContentType('papers');

  // Find original tag name
  let originalTag: string | undefined;
  for (const paper of papers) {
    if (paper.tags && Array.isArray(paper.tags)) {
      originalTag = paper.tags.find(tag => titleToSlug(tag) === tagSlug);
      if (originalTag) break;
    }
  }

  if (!originalTag) {
    return { title: "Tag Not Found | Papers" };
  }

  const dbTag = dbTags.find(t => t.slug === tagSlug);
  const tagTitle = dbTag?.title || originalTag;

  return {
    title: `${tagTitle} Papers`,
    description: `Papers tagged with ${tagTitle}`,
  };
}

// =============================================================================
// Page Component
// =============================================================================

export default async function PapersTagPage({ params }: PageProps) {
  const { slug: tagSlug } = await params;

  // Fetch data from database
  const allPapers = getActiveContentByType('papers');
  const dbTags = getTagsByContentType('papers');

  // Find matching papers and original tag name
  let originalTag: string | undefined;
  const papersWithTag = allPapers.filter(paper => {
    if (paper.tags && Array.isArray(paper.tags)) {
      const foundTag = paper.tags.find(tag => titleToSlug(tag) === tagSlug);
      if (foundTag && !originalTag) originalTag = foundTag;
      return !!foundTag;
    }
    return false;
  });

  if (!originalTag || papersWithTag.length === 0) {
    notFound();
  }

  // Get tag metadata
  const dbTag = dbTags.find(t => t.slug === tagSlug);

  // Build header data
  const tagHeaderData = dbTag ? {
    title: dbTag.title,
    subtitle: "",
    start_date: "2025-01-01",
    end_date: new Date().toISOString().split('T')[0],
    preview: dbTag.preview || `Papers tagged with ${dbTag.title}.`,
    status: "Active" as const,
    confidence: "certain" as const,
    importance: dbTag.importance,
    backText: "Tags",
    backHref: "/papers/tags"
  } : {
    title: originalTag,
    subtitle: "",
    start_date: new Date().toISOString(),
    end_date: "",
    preview: `Papers tagged with ${originalTag}.`,
    status: "Active" as const,
    confidence: "certain" as const,
    importance: 5,
    backText: "Tags",
    backHref: "/papers/tags"
  };

  // Sort and transform papers
  const papers: PaperMeta[] = [...papersWithTag]
    .sort((a, b) => {
      const aDate = a.end_date || a.start_date;
      const bDate = b.end_date || b.start_date;
      return new Date(bDate).getTime() - new Date(aDate).getTime();
    })
    .map(paper => ({
      title: paper.title,
      subtitle: paper.preview,
      preview: paper.preview,
      start_date: paper.start_date,
      end_date: paper.end_date,
      slug: paper.slug,
      tags: paper.tags,
      category: paper.category,
      status: paper.status as PaperMeta['status'],
      confidence: paper.confidence as PaperMeta['confidence'],
      importance: paper.importance,
      state: paper.state,
      cover_image: paper.cover_image
    }));

  return (
    <div className="papers-container">
      <PapersTaggedPage papers={papers} tagData={tagHeaderData} />
    </div>
  );
}
