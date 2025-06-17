// app/essays/[category]/[slug]/page.tsx
export const dynamic = 'force-static';
export const revalidate = false;

import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import essaysData from "@/data/essays/essays.json";
import EssayPageClient from "./EssayPageClient";
import type { Post } from "@/utils/posts";

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
  }

  // Dynamically import the MDX file based on category and slug
  const EssayArticle = (await import(`@/app/essays/content/${params.category}/${params.slug}.mdx`)).default;
  
  return (
    <EssayPageClient essayData={essayItem} allEssays={essaysData.essays}>
      <div className="essays-content">
        <EssayArticle />
      </div>
    </EssayPageClient>
  );
}