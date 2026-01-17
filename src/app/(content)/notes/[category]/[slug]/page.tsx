/**
 * =============================================================================
 * Note Detail Page
 * =============================================================================
 *
 * Dynamic route for displaying individual notes.
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
import NotePageClient from "./NotePageClient";
import { TOC } from "@/components/core/toc";
import { Sidenotes } from "@/components/core/sidenotes";
import { extractHeadingsFromMDX } from "@/lib/mdx";
import type { NoteMeta } from "@/types/content";

// =============================================================================
// Types
// =============================================================================

type Status = "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished";
type Confidence = "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain";

interface NotePageProps {
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
  const notes = getContentByType('notes');

  return notes.map(note => ({
    category: slugifyCategory(note.category),
    slug: note.slug
  }));
}

// =============================================================================
// Metadata
// =============================================================================

export async function generateMetadata(
  { params }: NotePageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { category, slug } = await params;
  const notes = getContentByType('notes');

  const note = notes.find(n =>
    slugifyCategory(n.category) === category && n.slug === slug
  );

  if (!note) {
    return { title: "Note Not Found" };
  }

  const coverUrl = note.cover_image ||
    `https://picsum.photos/1200/630?text=${encodeURIComponent(note.title)}`;
  const url = `https://krisyotam.com/notes/${category}/${slug}`;

  return {
    title: `${note.title} | Kris Yotam`,
    description: note.preview || `Note: ${note.title} in ${note.category} category`,
    openGraph: {
      title: note.title,
      description: note.preview || `Note: ${note.title} in ${note.category} category`,
      url,
      type: "article",
      images: [{
        url: coverUrl,
        width: 1200,
        height: 630,
        alt: note.title
      }],
      siteName: "Kris Yotam",
    },
    twitter: {
      card: "summary_large_image",
      title: note.title,
      description: note.preview || `Note: ${note.title} in ${note.category} category`,
      images: [coverUrl],
      creator: "@krisyotam"
    }
  };
}

// =============================================================================
// Page Component
// =============================================================================

export default async function NotePage({ params }: NotePageProps) {
  const { category, slug } = await params;
  const allNotes = getContentByType('notes');

  const noteData = allNotes.find(n =>
    slugifyCategory(n.category) === category && n.slug === slug
  );

  if (!noteData) {
    notFound();
  }

  // Transform note data
  const note: NoteMeta = {
    ...noteData,
    status: (noteData.status || "Notes") as Status,
    confidence: (noteData.confidence || "certain") as Confidence,
    importance: noteData.importance ?? 5,
    tags: noteData.tags || []
  };

  const notes: NoteMeta[] = allNotes.map(n => ({
    ...n,
    status: (n.status || "Notes") as Status,
    confidence: (n.confidence || "certain") as Confidence,
    importance: n.importance ?? 5,
    tags: n.tags || []
  }));

  // Extract headings from MDX content
  const headings = await extractHeadingsFromMDX('notes', slug, category);

  // Dynamically import MDX file
  const Note = (
    await import(`@/app/(content)/notes/content/${category}/${slug}.mdx`)
  ).default;

  return (
    <div className="relative min-h-screen bg-background text-foreground pt-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header section */}
        <div className="mb-8">
          <NotePageClient note={note} allNotes={notes} headerOnly={true} />
        </div>

        {/* Main content */}
        <main id="content" className="container max-w-[672px] mx-auto px-4">
          {headings.length > 0 && <TOC headings={headings} />}

          <div className="note-content">
            <Note />
          </div>

          <NotePageClient note={note} allNotes={notes} contentOnly={true} />
        </main>

        <Sidenotes containerSelector="#content" />
      </div>
    </div>
  );
}
