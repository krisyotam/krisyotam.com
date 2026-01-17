/**
 * =============================================================================
 * Note Tag Page
 * =============================================================================
 *
 * Dynamic route for displaying notes with a specific tag.
 * Fetches data from content.db via lib/data.ts functions.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

import NotesTaggedPage from "./NotesTaggedPage";
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
  const notes = getActiveContentByType('notes');

  const allTagsSet = new Set<string>();
  notes.forEach(note => {
    if (note.tags && Array.isArray(note.tags)) {
      note.tags.forEach(tag => allTagsSet.add(titleToSlug(tag)));
    }
  });

  return Array.from(allTagsSet).map(slug => ({ slug }));
}

// =============================================================================
// Metadata
// =============================================================================

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug: tagSlug } = await params;
  const notes = getActiveContentByType('notes');
  const dbTags = getTagsByContentType('notes');

  // Find original tag name
  let originalTag: string | undefined;
  for (const note of notes) {
    if (note.tags && Array.isArray(note.tags)) {
      originalTag = note.tags.find(tag => titleToSlug(tag) === tagSlug);
      if (originalTag) break;
    }
  }

  if (!originalTag) {
    return { title: "Tag Not Found | Notes" };
  }

  const dbTag = dbTags.find(t => t.slug === tagSlug);
  const tagTitle = dbTag?.title || originalTag;

  return {
    title: `${tagTitle} Notes | Kris Yotam`,
    description: `Notes tagged with ${tagTitle}`,
  };
}

// =============================================================================
// Page Component
// =============================================================================

export default async function NotesTagPage({ params }: PageProps) {
  const { slug: tagSlug } = await params;

  // Fetch data from database
  const allNotes = getActiveContentByType('notes');
  const dbTags = getTagsByContentType('notes');

  // Find matching notes and original tag name
  let originalTag: string | undefined;
  const notesWithTag = allNotes.filter(note => {
    if (note.tags && Array.isArray(note.tags)) {
      const foundTag = note.tags.find(tag => titleToSlug(tag) === tagSlug);
      if (foundTag && !originalTag) originalTag = foundTag;
      return !!foundTag;
    }
    return false;
  });

  if (!originalTag || notesWithTag.length === 0) {
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
    preview: dbTag.preview || `Notes tagged with ${dbTag.title}.`,
    status: "Active" as const,
    confidence: "certain" as const,
    importance: dbTag.importance,
    backText: "Tags",
    backHref: "/notes/tags"
  } : {
    title: originalTag,
    subtitle: "",
    start_date: "2025-01-01",
    end_date: new Date().toISOString().split('T')[0],
    preview: `Notes tagged with ${originalTag}.`,
    status: "Active" as const,
    confidence: "certain" as const,
    importance: 5,
    backText: "Tags",
    backHref: "/notes/tags"
  };

  // Sort notes by date
  const notes = [...notesWithTag].sort((a, b) => {
    const aDate = (a.end_date?.trim()) ? a.end_date : a.start_date;
    const bDate = (b.end_date?.trim()) ? b.end_date : b.start_date;
    return new Date(bDate).getTime() - new Date(aDate).getTime();
  });

  return (
    <div className="notes-container">
      <NotesTaggedPage notes={notes} tagData={tagHeaderData} />
    </div>
  );
}
