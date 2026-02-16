/**
 * =============================================================================
 * Fiction Story Page
 * =============================================================================
 *
 * Individual fiction story page with MDX content rendering.
 * Fetches data from content.db via lib/data.ts functions.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

export const dynamic = 'force-static';
export const revalidate = false;

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContentByType } from "@/lib/data";
import NotePageClient from "./FictionPageClient";
import { TOC } from "@/components/core/toc";
import { Sidenotes } from "@/components/core/sidenotes";
import { ViewTracker } from "@/components/core/view-tracker";
import { extractHeadingsFromMDX } from "@/lib/mdx";
import type { NoteMeta } from "@/types/content";

// =============================================================================
// Types
// =============================================================================

type Status = "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished";
type Confidence = "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain";

interface StoryData {
  title: string;
  start_date: string;
  end_date?: string;
  slug: string;
  tags: string[];
  category: string;
  status?: string;
  confidence?: string;
  importance?: number;
  preview: string;
  state: string;
}

interface StoryPageProps {
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
  const fictionData = getContentByType('fiction');

  // Generate all category/slug combinations
  return fictionData.map(story => ({
    category: slugifyCategory(story.category),
    slug: story.slug
  }));
}

// =============================================================================
// Metadata
// =============================================================================

export async function generateMetadata({ params }: StoryPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const fictionData = getContentByType('fiction');

  const story = fictionData.find(n =>
    slugifyCategory(n.category) === resolvedParams.category && n.slug === resolvedParams.slug
  );

  if (!story) {
    return {
      title: "Story Not Found",
    };
  }

  return {
    title: `${story.title} | ${story.category}`,
    description: `Story: ${story.title} in ${story.category} category`,
  };
}

// =============================================================================
// Page Component
// =============================================================================

export default async function StoryPage({ params }: StoryPageProps) {
  const resolvedParams = await params;
  const fictionData = getContentByType('fiction');

  const storyData = fictionData.find(n =>
    slugifyCategory(n.category) === resolvedParams.category && n.slug === resolvedParams.slug
  );

  if (!storyData) {
    notFound();
  }

  const story: NoteMeta = {
    ...storyData,
    status: (storyData.status || "Notes") as Status,
    confidence: (storyData.confidence || "possible") as Confidence,
    importance: storyData.importance ?? 5,
    tags: storyData.tags || []
  };

  const stories: NoteMeta[] = fictionData.map((item) => ({
    ...item,
    status: (item.status || "Notes") as Status,
    confidence: (item.confidence || "possible") as Confidence,
    importance: item.importance ?? 5,
    tags: item.tags || []
  }));

  // Extract headings from the fiction MDX content
  const headings = await extractHeadingsFromMDX('fiction', resolvedParams.slug, resolvedParams.category);

  // Dynamically import the MDX file based on category and slug
  const Story = (await import(`@/content/fiction/${resolvedParams.slug}.mdx`)).default;

  const viewSlug = `fiction/${resolvedParams.category}/${resolvedParams.slug}`;

  return (
    <div className="relative min-h-screen bg-background text-foreground pt-16">
      <ViewTracker slug={viewSlug} />
      <div className="max-w-6xl mx-auto px-4">
        {/* Header section - full width */}
        <div className="mb-8">
          <NotePageClient note={story} allNotes={stories} headerOnly={true} />
        </div>

        {/* Main content */}
        <main id="content" className="container max-w-[672px] mx-auto px-4">
          {/* Table of Contents - at the top of content */}
          {headings.length > 0 && (
            <TOC headings={headings} />
          )}

          <div className="content">
            <Story />
          </div>
          <NotePageClient note={story} allNotes={stories} contentOnly={true} />
        </main>

        {/* Sidenotes for wide viewports */}
        <Sidenotes containerSelector="#content" />
      </div>
    </div>
  );
}
