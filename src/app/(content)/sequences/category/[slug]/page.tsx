/**
 * =============================================================================
 * Sequence Category Detail Page
 * =============================================================================
 *
 * Page showing sequences filtered by a specific category.
 * Fetches data from content.db via lib/data.ts functions.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

import SequencesClientPage from "../../SequencesClientPage";
import { getSequencesData, getCategoriesData } from "@/lib/data";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

// =============================================================================
// Types
// =============================================================================

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

// =============================================================================
// Helpers
// =============================================================================

/**
 * Convert a category name to URL slug
 */
function slugifyCategory(category: string): string {
  return category.toLowerCase().replace(/\s+/g, "-");
}

// =============================================================================
// Static Generation
// =============================================================================

export async function generateStaticParams() {
  const data = await getSequencesData();

  // Get unique categories from sequences
  const categories = new Set<string>();
  data.sequences.forEach((sequence) => {
    if (sequence.category) {
      categories.add(sequence.category);
    }
  });

  return Array.from(categories).map((category) => ({
    slug: slugifyCategory(category),
  }));
}

// =============================================================================
// Metadata
// =============================================================================

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const categoriesData = await getCategoriesData();

  // Find the category in the categories data
  const category = categoriesData.categories.find((cat) => cat.slug === slug);

  if (!category) {
    // Try to find by matching slug from sequence categories
    const sequencesData = await getSequencesData();
    const sequenceCategory = Array.from(
      new Set(
        sequencesData.sequences.map((s) => s.category).filter(Boolean)
      )
    ).find((cat) => slugifyCategory(cat as string) === slug);

    if (sequenceCategory) {
      return {
        title: `${sequenceCategory} Sequences | Kris Yotam`,
        description: `Sequences in the ${sequenceCategory} category`,
      };
    }

    return {
      title: "Category Not Found",
    };
  }

  return {
    title: `${category.title} Sequences | Kris Yotam`,
    description: category.preview || `Sequences in the ${category.title} category`,
  };
}

// =============================================================================
// Page Component
// =============================================================================

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const [sequencesData, categoriesData] = await Promise.all([
    getSequencesData(),
    getCategoriesData(),
  ]);

  // Filter to only active sequences (exclude hidden)
  const activeSequences = sequencesData.sequences.filter(
    (sequence) => sequence.state === "active" && sequence.status !== "hidden"
  );

  // Find the category by slug
  let category = categoriesData.categories.find((cat) => cat.slug === slug);
  let categoryName: string | undefined;

  if (category) {
    categoryName = category.title;
  } else {
    // Try to find category name from sequences
    const sequenceCategory = Array.from(
      new Set(activeSequences.map((s) => s.category).filter(Boolean))
    ).find((cat) => slugifyCategory(cat as string) === slug);

    if (sequenceCategory) {
      categoryName = sequenceCategory as string;
    }
  }

  if (!categoryName) {
    notFound();
  }

  // Get sequences for this category
  const categorySequences = activeSequences.filter(
    (seq) => seq.category && slugifyCategory(seq.category) === slug
  );

  if (categorySequences.length === 0) {
    console.warn(
      `No sequences found for category: ${categoryName} (slug: ${slug})`
    );
  }

  // Get unique categories from sequences for the filter dropdown
  const sequenceCategories = Array.from(
    new Set(activeSequences.map((s) => s.category).filter(Boolean))
  );

  const relevantCategories = categoriesData.categories.filter((cat) =>
    sequenceCategories.includes(cat.slug)
  );

  return (
    <SequencesClientPage
      sequences={activeSequences}
      categories={relevantCategories}
      initialCategory={categoryName}
      categoryName={categoryName}
    />
  );
}
