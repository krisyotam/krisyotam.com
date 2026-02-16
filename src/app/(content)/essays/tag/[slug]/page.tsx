/**
 * =============================================================================
 * Essay Tag Page
 * =============================================================================
 *
 * Dynamic route for displaying essays with a specific tag.
 * Fetches data from content.db via lib/data.ts functions.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

import EssaysTaggedPage from "./EssaysTaggedPage";
import { getActiveContentByType, getTagsByContentType } from "@/lib/data";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

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
  const essays = getActiveContentByType('essays');

  const allTagsSet = new Set<string>();
  essays.forEach(essay => {
    if (essay.tags && Array.isArray(essay.tags)) {
      essay.tags.forEach(tag => allTagsSet.add(titleToSlug(tag)));
    }
  });

  return Array.from(allTagsSet).map(slug => ({ slug }));
}

// =============================================================================
// Metadata
// =============================================================================

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug: tagSlug } = await params;
  const essays = getActiveContentByType('essays');
  const dbTags = getTagsByContentType('essays');

  // Find original tag name
  let originalTag: string | undefined;
  for (const essay of essays) {
    if (essay.tags && Array.isArray(essay.tags)) {
      originalTag = essay.tags.find(tag => titleToSlug(tag) === tagSlug);
      if (originalTag) break;
    }
  }

  if (!originalTag) {
    return { title: "Tag Not Found | Essays" };
  }

  const dbTag = dbTags.find(t => t.slug === tagSlug);
  const tagTitle = dbTag?.title || originalTag;

  return {
    title: `${tagTitle} Essays`,
    description: `Essays tagged with ${tagTitle}`,
  };
}

// =============================================================================
// Page Component
// =============================================================================

export default async function EssaysTagPage({ params }: PageProps) {
  const { slug: tagSlug } = await params;

  // Fetch data from database
  const allEssays = getActiveContentByType('essays');
  const dbTags = getTagsByContentType('essays');

  // Find matching essays and original tag name
  let originalTag: string | undefined;
  const essaysWithTag = allEssays.filter(essay => {
    if (essay.tags && Array.isArray(essay.tags)) {
      const foundTag = essay.tags.find(tag => titleToSlug(tag) === tagSlug);
      if (foundTag && !originalTag) originalTag = foundTag;
      return !!foundTag;
    }
    return false;
  });

  if (!originalTag || essaysWithTag.length === 0) {
    notFound();
  }

  // Get tag metadata
  const dbTag = dbTags.find(t => t.slug === tagSlug);

  // Build header data
  const tagHeaderData = dbTag ? {
    title: dbTag.title,
    subtitle: "",
    date: new Date().toISOString(),
    preview: dbTag.preview || `Essays tagged with ${dbTag.title}.`,
    status: "Active" as const,
    confidence: "certain" as const,
    importance: dbTag.importance,
    backText: "Tags",
    backHref: "/essays/tags"
  } : {
    title: originalTag,
    subtitle: "",
    date: new Date().toISOString(),
    preview: `Essays tagged with ${originalTag}.`,
    status: "Active" as const,
    confidence: "certain" as const,
    importance: 5,
    backText: "Tags",
    backHref: "/essays/tags"
  };

  // Sort and transform essays
  const essays = [...essaysWithTag]
    .sort((a, b) => {
      const aDate = a.end_date || a.start_date;
      const bDate = b.end_date || b.start_date;
      return new Date(bDate).getTime() - new Date(aDate).getTime();
    })
    .map(essay => ({
      id: essay.slug,
      title: essay.title,
      abstract: essay.preview || "",
      importance: essay.importance ?? 5,
      confidence: essay.confidence ?? "certain",
      authors: [],
      subject: essay.category,
      keywords: essay.tags || [],
      postedBy: "admin",
      postedOn: essay.end_date || essay.start_date,
      dateStarted: essay.start_date,
      tags: essay.tags || [],
      img: essay.cover_image,
      status: essay.status ?? "Finished",
      pdfLink: undefined,
      sourceLink: undefined,
      category: essay.category,
      customPath: undefined
    }));

  return (
    <div className="essays-container">
      <EssaysTaggedPage essays={essays} tagData={tagHeaderData} />
    </div>
  );
}
