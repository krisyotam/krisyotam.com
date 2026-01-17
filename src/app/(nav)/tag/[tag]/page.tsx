// app/tag/[tag]/page.tsx
import { notFound } from "next/navigation";
import { getAllUniversalTags, getUniversalPostsByTag, getTagMeta, type UniversalPost } from "@/lib/content";
import { PageHeader } from "@/components/core";
import { ContentTable } from "@/components/content";
import type { Metadata } from "next";

export const dynamic = "force-static";
export const revalidate = false;

interface TagPageProps {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
  const tags = await getAllUniversalTags();
  return tags.map((tag) => ({
    tag: tag.slug,
  }));
}

export async function generateMetadata(props: TagPageProps): Promise<Metadata> {
  const params = await props.params;
  const tagMeta = await getTagMeta(params.tag);
  const tagTitle = tagMeta?.title || params.tag.split("-").map(w => w[0].toUpperCase() + w.slice(1)).join(" ");

  return {
    title: `${tagTitle} | Tags | Kris Yotam`,
    description: tagMeta?.preview || `Browse all posts tagged with ${tagTitle}`,
  };
}

type Status = "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished" | "Published" | "Planned" | "Active";
type Confidence = "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain" | "speculative";

export default async function TagPage(props: TagPageProps) {
  const params = await props.params;
  const posts = await getUniversalPostsByTag(params.tag);
  const tagMeta = await getTagMeta(params.tag);

  if (!posts || posts.length === 0) {
    notFound();
  }

  const tagTitle = tagMeta?.title || params.tag.split("-").map(w => w[0].toUpperCase() + w.slice(1)).join(" ");
  const status = (tagMeta?.status as Status) || "Finished";
  const confidence = (tagMeta?.confidence as Confidence) || "certain";

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
          title={tagTitle}
          subtitle={`Posts tagged with "${tagTitle}"`}
          start_date={tagMeta?.date || new Date().toISOString().split('T')[0]}
          preview={tagMeta?.preview || `All posts tagged with ${tagTitle} across all content types.`}
          status={status}
          confidence={confidence}
          importance={tagMeta?.importance || 7}
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
