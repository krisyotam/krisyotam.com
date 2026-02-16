/**
 * =============================================================================
 * OCS Detail Page
 * =============================================================================
 *
 * Individual character profile page for Original Characters (OCS).
 * Fetches data from content.db via lib/data.ts functions.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

export const dynamic = 'force-static';
export const revalidate = false;

import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { getActiveContentByType, getContentByType } from "@/lib/data";
import OCSPageClient from "./OCSPageClient";
import { TOC } from "@/components/core/toc";
import { Sidenotes } from "@/components/core/sidenotes";
import { ViewTracker } from "@/components/core/view-tracker";
import { extractHeadingsFromMDX } from "@/lib/mdx";
import type { OCSMeta, OCSStatus, OCSConfidence } from "@/types/content";

// =============================================================================
// Types
// =============================================================================

interface OCSPageProps {
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
  // Generate all category/slug combinations, but only for active characters
  const ocsData = getActiveContentByType('ocs');
  return ocsData.map(character => ({
    category: slugifyCategory(character.category),
    slug: character.slug
  }));
}

// =============================================================================
// Metadata
// =============================================================================

export async function generateMetadata({ params }: OCSPageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const { category, slug } = await params;
  const ocsData = getContentByType('ocs');
  const characterData = ocsData.find(c =>
    slugifyCategory(c.category) === category && c.slug === slug
  );

  if (!characterData) {
    return {
      title: "Character Not Found",
    };
  }

  // Use cover image if available, otherwise use Kris Yotam's logo
  const images = [
    {
      url: characterData.cover_image || 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
      width: 1200,
      height: 1200,
      alt: characterData.title
    }
  ];

  const url = `https://krisyotam.com/ocs/${category}/${slug}`;

  return {
    title: `${characterData.title} | ${characterData.category} Characters | Kris Yotam`,
    description: characterData.preview || `Character profile for ${characterData.title}`,
    openGraph: {
      title: characterData.title,
      description: characterData.preview || `Character profile for ${characterData.title}`,
      url,
      type: "article",
      images,
      siteName: "Kris Yotam",
    },
    twitter: {
      card: "summary_large_image",
      title: characterData.title,
      description: characterData.preview || `Character profile for ${characterData.title}`,
      images: images.map(img => img.url),
      creator: "@krisyotam"
    }
  };
}

// =============================================================================
// Page Component
// =============================================================================

export default async function OCSPage({ params }: OCSPageProps) {
  const { category, slug } = await params;

  // Fetch data from database
  const ocsData = getContentByType('ocs');
  const characterData = ocsData.find(c =>
    slugifyCategory(c.category) === category && c.slug === slug
  );

  if (!characterData) {
    notFound();
  }

  // Check if the character is meant to be hidden
  if (characterData.state === "hidden") {
    notFound();
  }

  const character: OCSMeta = {
    title: characterData.title,
    subtitle: characterData.subtitle,
    preview: characterData.preview,
    start_date: characterData.start_date,
    end_date: characterData.end_date,
    slug: characterData.slug,
    tags: characterData.tags,
    category: characterData.category,
    book: characterData.category, // OCS uses category as book
    status: characterData.status as OCSStatus,
    confidence: characterData.confidence as OCSConfidence,
    importance: characterData.importance,
    cover_image: characterData.cover_image,
    state: (characterData.state as "active" | "hidden" | undefined) || "active"
  };

  // Get all active characters for navigation
  const activeOcsData = getActiveContentByType('ocs');
  const ocs: OCSMeta[] = activeOcsData.map(char => ({
    title: char.title,
    subtitle: char.subtitle,
    preview: char.preview,
    start_date: char.start_date,
    end_date: char.end_date,
    slug: char.slug,
    tags: char.tags,
    category: char.category,
    book: char.category,
    status: char.status as OCSStatus,
    confidence: char.confidence as OCSConfidence,
    importance: char.importance,
    cover_image: char.cover_image,
    state: (char.state as "active" | "hidden" | undefined) || "active"
  }));

  // Extract headings from the character MDX content
  const headings = await extractHeadingsFromMDX('ocs', slug, category);

  // Dynamically import the MDX file based on category and slug
  const Character = (await import(`@/content/ocs/${slug}.mdx`)).default;

  const viewSlug = `ocs/${category}/${slug}`;

  return (
    <div className="relative min-h-screen bg-background text-foreground pt-16">
      <ViewTracker slug={viewSlug} />
      <div className="max-w-6xl mx-auto px-4">
        {/* Header section - full width */}
        <div className="mb-8">
          <OCSPageClient character={character} allCharacters={ocs} headerOnly={true} />
        </div>

        {/* Main content */}
        <main id="content" className="container max-w-[672px] mx-auto px-4">
          {/* Table of Contents - at the top of content */}
          {headings.length > 0 && (
            <TOC headings={headings} />
          )}

          <div className="content">
            <Character />
          </div>
          <OCSPageClient character={character} allCharacters={ocs} contentOnly={true} />
        </main>

        {/* Sidenotes for wide viewports */}
        <Sidenotes containerSelector="#content" />
      </div>
    </div>
  );
}
