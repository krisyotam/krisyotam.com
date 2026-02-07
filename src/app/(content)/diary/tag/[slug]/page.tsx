/**
 * =============================================================================
 * Diary Tag Filter Page
 * =============================================================================
 *
 * Shows diary entries filtered by a specific tag.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

import { notFound } from "next/navigation";
import { getActiveContentByType, getTagsByContentType } from "@/lib/data";
import DiaryTaggedPage from "./DiaryTaggedPage";
import type { Metadata } from "next";

// =============================================================================
// Types
// =============================================================================

interface TagPageProps {
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
  const entries = getActiveContentByType('diary');
  const tagSet = new Set<string>();

  entries.forEach(entry => {
    (entry.tags || []).forEach(tag => tagSet.add(titleToSlug(tag)));
  });

  return Array.from(tagSet).map(slug => ({ slug }));
}

// =============================================================================
// Metadata
// =============================================================================

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { slug } = await params;
  const dbTags = getTagsByContentType('diary');
  const tagData = dbTags.find(t => t.slug === slug);

  const title = tagData?.title || slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return {
    title: `${title} | Diary Tags | Kris Yotam`,
    description: tagData?.preview || `Diary entries tagged with ${title}`,
  };
}

// =============================================================================
// Page Component
// =============================================================================

export default async function DiaryTagPage({ params }: TagPageProps) {
  const { slug } = await params;
  const entries = getActiveContentByType('diary');
  const dbTags = getTagsByContentType('diary');

  // Find tag metadata
  const tagData = dbTags.find(t => t.slug === slug);

  // Find original tag name from entries
  let originalTagName = tagData?.title;
  if (!originalTagName) {
    for (const entry of entries) {
      const matchingTag = (entry.tags || []).find(t => titleToSlug(t) === slug);
      if (matchingTag) {
        originalTagName = matchingTag;
        break;
      }
    }
  }

  if (!originalTagName) {
    notFound();
  }

  // Filter entries by tag
  const filteredEntries = entries.filter(entry =>
    (entry.tags || []).some(t => titleToSlug(t) === slug)
  );

  if (filteredEntries.length === 0) {
    notFound();
  }

  const tag = {
    slug,
    title: originalTagName,
    preview: tagData?.preview || null,
    importance: tagData?.importance || 5,
  };

  return <DiaryTaggedPage tag={tag} entries={filteredEntries} />;
}
