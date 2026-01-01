// /app/progymnasmata/[type]/[slug]/page.tsx
export const dynamic = 'force-static';
export const revalidate = false;
import { notFound } from "next/navigation";
import postsData from "@/data/progymnasmata/progymnasmata.json";
import { Footer } from "@/app/(content)/essays/components/footer";
import ProgymnasmataPageClient from "./ProgymnasmataPageClient";
import { PageHeader } from "@/components/core";
import { Comments } from "@/components/core/comments";


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
        <main className="container max-w-[672px] mx-auto px-4">
          {/* If you want a TableOfContents, add it here */}
          <div className="progymnasmata-content">
            <MdxContent />
          </div>
          <ProgymnasmataPageClient post={post} contentOnly={true} />
          <Comments />
        </main>
      </div>
    </div>
  );
}
