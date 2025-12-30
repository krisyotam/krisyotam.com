// app/category/[category]/page.tsx
import { notFound } from "next/navigation";
import { getAllUniversalCategories, getUniversalPostsByCategory, getCategoryMeta, type UniversalPost } from "@/utils/universal-content";
import { PageHeader } from "@/components/core";
import { ContentTable } from "@/components/content";
import type { Metadata } from "next";

export const dynamic = "force-static";
export const revalidate = false;

interface CategoryPageProps {
  params: { category: string };
}

export async function generateStaticParams() {
  const categories = await getAllUniversalCategories();
  return categories.map((category) => ({
    category: category.slug,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const categoryMeta = await getCategoryMeta(params.category);
  const categoryTitle = categoryMeta?.title || params.category.split("-").map(w => w[0].toUpperCase() + w.slice(1)).join(" ");

  return {
    title: `${categoryTitle} | Categories | Kris Yotam`,
    description: categoryMeta?.preview || `Browse all posts in the ${categoryTitle} category`,
  };
}

type Status = "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished" | "Published" | "Planned" | "Active";
type Confidence = "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain" | "speculative";

export default async function CategoryPage({ params }: CategoryPageProps) {
  const posts = await getUniversalPostsByCategory(params.category);
  const categoryMeta = await getCategoryMeta(params.category);

  if (!posts || posts.length === 0) {
    notFound();
  }

  const categoryTitle = categoryMeta?.title || params.category.split("-").map(w => w[0].toUpperCase() + w.slice(1)).join(" ");
  const status = (categoryMeta?.status as Status) || "Finished";
  const confidence = (categoryMeta?.confidence as Confidence) || "certain";

  // Transform posts to match ContentTable interface
  const tableData = posts.map((post: UniversalPost) => ({
    title: post.title,
    subtitle: post.subtitle,
    preview: post.preview || "",
    start_date: post.start_date || post.date || "",
    end_date: post.end_date,
    tags: post.tags,
    category: post.category,
    slug: post.slug,
    status: post.status,
    confidence: post.confidence,
    importance: post.importance,
    state: post.state,
    cover_image: post.cover_image,
    type: post.type, // This is the content type (essays, notes, etc.)
    route: post.route, // This is the URL route
  }));

  return (
    <div className="relative min-h-screen bg-background text-foreground pt-16">
      <div className="max-w-6xl mx-auto px-4">
        <PageHeader
          title={categoryTitle}
          subtitle={categoryMeta?.subtitle || `Posts in the "${categoryTitle}" category`}
          start_date={categoryMeta?.date || new Date().toISOString().split('T')[0]}
          preview={categoryMeta?.preview || `All posts in the ${categoryTitle} category across all content types.`}
          status={status}
          confidence={confidence}
          importance={categoryMeta?.importance || 7}
        />

        <main className="mt-8">
          <ContentTable
            items={tableData}
            showType={true}
          />
        </main>
      </div>
    </div>
  );
}
