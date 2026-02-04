/**
 * =============================================================================
 * Sequence Detail Page
 * =============================================================================
 *
 * Individual sequence page showing sequence details.
 * Fetches data from content.db via lib/data.ts functions.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

import { SequenceComponent } from "@/components/core";
import { getSequencesData, getSequenceBySlug } from "@/lib/data";
import type { Metadata } from "next";

// =============================================================================
// Types
// =============================================================================

interface SequencePageProps {
  params: Promise<{ slug: string }>;
}

// =============================================================================
// Static Generation
// =============================================================================

export async function generateStaticParams() {
  const data = await getSequencesData();
  return data.sequences.map((seq) => ({ slug: seq.slug }));
}

// =============================================================================
// Metadata
// =============================================================================

export async function generateMetadata({
  params,
}: SequencePageProps): Promise<Metadata> {
  const { slug } = await params;
  const sequence = await getSequenceBySlug(slug);

  if (!sequence) {
    return {
      title: "Sequence Not Found",
      description: "The sequence you're looking for doesn't exist.",
    };
  }

  return {
    title: `${sequence.title} - Learning Sequence`,
    description: sequence.preview || undefined,
    openGraph: {
      title: `${sequence.title} - Learning Sequence`,
      description: sequence.preview || undefined,
      type: "article",
      publishedTime: sequence.start_date || undefined,
      tags: sequence.tags,
      ...(sequence["cover-url"] && {
        images: [{ url: sequence["cover-url"] }],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: `${sequence.title} - Learning Sequence`,
      description: sequence.preview || undefined,
      ...(sequence["cover-url"] && { images: [sequence["cover-url"]] }),
    },
  };
}

// =============================================================================
// Page Component
// =============================================================================

export default async function SequencePage({ params }: SequencePageProps) {
  const { slug } = await params;
  return <SequenceComponent slug={slug} />;
}
