// app/essays/[category]/[slug]/page.tsx
export const dynamic = 'force-static';
export const revalidate = false;

import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import essaysData from "@/data/essays/essays.json";
import EssayPageClient from "./EssayPageClient";
import { TableOfContents } from "@/components/typography/table-of-contents";
import { extractHeadingsFromMDX } from "@/lib/mdx";
import type { Post } from "@/lib/posts";

interface EssayPageProps {
  params: { category: string; slug: string };
}

export async function generateStaticParams() {
  // Generate all category/slug combinations
  return essaysData.essays.map(essay => ({
    category: essay.category,
    slug: essay.slug
  }));
}

export async function generateMetadata({ params }: EssayPageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const essayItem = essaysData.essays.find(e => 
    e.category === params.category && e.slug === params.slug
  );

  if (!essayItem) {
    return {
      title: "Essay Not Found",
    };
  }

  // Get cover image URL - prioritize cover_image field
  const coverUrl = essayItem.cover_image || 
    `https://picsum.photos/1200/630?text=${encodeURIComponent(essayItem.title)}`

  const url = `https://krisyotam.com/essays/${params.category}/${params.slug}`;

  return {
    title: `${essayItem.title} | Kris Yotam`,
    description: essayItem.preview || "Read more on Kris Yotam's essays",
    openGraph: {
      title: essayItem.title,
      description: essayItem.preview || "Read more on Kris Yotam's essays",
      url,
      type: "article",
      images: [{
        url: coverUrl,
        width: 1200,
        height: 630,
        alt: essayItem.title
      }],
      siteName: "Kris Yotam",
    },
    twitter: {
      card: "summary_large_image",
      title: essayItem.title,
      description: essayItem.preview || "Read more on Kris Yotam's essays",
      images: [coverUrl],
      creator: "@krisyotam"
    }
  };
}

export default async function EssayPage({ params }: EssayPageProps) {
  const essayItem = essaysData.essays.find(e => 
    e.category === params.category && e.slug === params.slug
  );

  if (!essayItem) {
    notFound();
  }  // Extract headings from the essay MDX content
  const headings = await extractHeadingsFromMDX('essays', params.slug, params.category);

  // Dynamically import the MDX file based on category and slug
  const EssayArticle = (await import(`@/app/(content)/essays/content/${params.category}/${params.slug}.mdx`)).default;  return (
    <div className="relative min-h-screen bg-background text-foreground pt-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header section - full width */}
        <div className="mb-8">
          <EssayPageClient essayData={essayItem} allEssays={essaysData.essays} headerOnly={true} />
        </div>
        
        {/* Main content */}
        <main className="container max-w-[672px] mx-auto px-4">
          {/* Table of Contents - at the top of content */}
          {headings.length > 0 && (
            <TableOfContents headings={headings} />
          )}
          
          <div className="essays-content">
            <EssayArticle />
          </div>
          <EssayPageClient essayData={essayItem} allEssays={essaysData.essays} contentOnly={true} />
        </main>
      </div>
    </div>
  );
}