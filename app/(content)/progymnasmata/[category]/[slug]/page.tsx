// /app/progymnasmata/[type]/[slug]/page.tsx
export const dynamic = 'force-static';
export const revalidate = false;
import { notFound } from "next/navigation";
import postsData from "@/data/progymnasmata/progymnasmata.json";
import ProgymnasmataPageClient from "./ProgymnasmataPageClient";
import { TOC } from "@/components/core/toc";
import { Sidenotes } from "@/components/core/sidenotes";
import { extractHeadingsFromMDX } from "@/lib/mdx";

export async function generateStaticParams() {
  return postsData.map(post => ({
    category: post.category,
    slug: post.slug,
  }));
}

export default async function ProgymnasmataSlugPage({ params }: { params: { category: string; slug: string } }) {
  const { category, slug } = params;
  const post = postsData.find(p => p.category === category && p.slug === slug);
  if (!post) return notFound();

  // Extract headings from the progymnasmata MDX content
  const headings = await extractHeadingsFromMDX('progymnasmata', slug, category);

  // Dynamically import the MDX file
  let MdxContent;
  try {
    MdxContent = (await import(`@/app/(content)/progymnasmata/content/${category}/${slug}.mdx`)).default;
  } catch {
    return notFound();
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground pt-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header section - full width */}
        <div className="mb-8">
          <ProgymnasmataPageClient post={post} headerOnly={true} />
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
          <ProgymnasmataPageClient post={post} contentOnly={true} />
        </main>

        {/* Sidenotes for wide viewports */}
        <Sidenotes containerSelector="#content" />
      </div>
    </div>
  );
}
