/**
 * =============================================================================
 * Progymnasmata Slug Page
 * =============================================================================
 *
 * Individual progymnasmata exercise page with MDX content.
 * Fetches data from content.db via lib/data.ts functions.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

export const dynamic = 'force-static';
export const revalidate = false;

import { notFound } from "next/navigation";
import { getContentByType } from "@/lib/data";
import ProgymnasmataPageClient from "./ProgymnasmataPageClient";
import { TOC } from "@/components/core/toc";
import { Sidenotes } from "@/components/core/sidenotes";
import { ViewTracker } from "@/components/view-tracker";
import { extractHeadingsFromMDX } from "@/lib/mdx";

// =============================================================================
// Types
// =============================================================================

interface PageProps {
  params: Promise<{ category: string; slug: string }>;
}

// =============================================================================
// Static Generation
// =============================================================================

export async function generateStaticParams() {
  const posts = getContentByType('progymnasmata');
  return posts.map(post => ({
    category: post.category,
    slug: post.slug,
  }));
}

// =============================================================================
// Page Component
// =============================================================================

export default async function ProgymnasmataSlugPage({ params }: PageProps) {
  const { category, slug } = await params;
  const posts = getContentByType('progymnasmata');
  const post = posts.find(p => p.category === category && p.slug === slug);

  if (!post) return notFound();

  // Transform post with defaults
  const transformedPost = {
    ...post,
    state: post.state || "active",
    status: post.status || "Finished",
    confidence: post.confidence || "certain",
    importance: post.importance ?? 5,
    tags: post.tags || []
  };

  // Extract headings from the progymnasmata MDX content
  const headings = await extractHeadingsFromMDX('progymnasmata', slug, category);

  // Dynamically import the MDX file
  let MdxContent;
  try {
    MdxContent = (await import(`@/app/(content)/progymnasmata/content/${category}/${slug}.mdx`)).default;
  } catch {
    return notFound();
  }

  const viewSlug = `progymnasmata/${category}/${slug}`;

  return (
    <div className="relative min-h-screen bg-background text-foreground pt-16">
      <ViewTracker slug={viewSlug} />
      <div className="max-w-6xl mx-auto px-4">
        {/* Header section - full width */}
        <div className="mb-8">
          <ProgymnasmataPageClient post={transformedPost} headerOnly={true} />
        </div>

        {/* Main content */}
        <main id="content" className="container max-w-[672px] mx-auto px-4">
          {/* Table of Contents - at the top of content */}
          {headings.length > 0 && (
            <TOC headings={headings} />
          )}

          <div className="progymnasmata-content">
            <MdxContent />
          </div>
          <ProgymnasmataPageClient post={transformedPost} contentOnly={true} />
        </main>

        {/* Sidenotes for wide viewports */}
        <Sidenotes containerSelector="#content" />
      </div>
    </div>
  );
}
