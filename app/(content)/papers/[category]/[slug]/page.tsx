export const dynamic = 'force-static';
export const revalidate = false;

import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import papersData from "@/data/papers/papers.json";
import PapersPageClient from "./PapersPageClient";
import { TableOfContents } from "@/components/typography/table-of-contents";
import { extractHeadingsFromMDX } from "@/lib/mdx";
import { Comments } from "@/components/core/comments";
import type { PaperMeta, PaperStatus, PaperConfidence } from "@/types/content";

interface PaperData {
  title: string;
  start_date: string;
  end_date?: string;
  date?: string; // backward compatibility
  slug: string;
  tags: string[];
  category: string;
  status: string;
  confidence: string;
  importance: number;
  preview: string;
  subtitle?: string;
  state?: string;
  cover_image?: string;
}

interface PaperPageProps {
  params: { category: string; slug: string };
}

// Helper function to slugify category
function slugifyCategory(category: string) {
  return category.toLowerCase().replace(/\s+/g, "-");
}

export async function generateStaticParams() {
  // Generate all category/slug combinations
  return papersData.papers.map(paperItem => ({
    category: slugifyCategory(paperItem.category),
    slug: paperItem.slug
  }));
}

export async function generateMetadata({ params }: PaperPageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const paperItem = papersData.papers.find(p => 
    slugifyCategory(p.category) === params.category && p.slug === params.slug
  );

  if (!paperItem) {
    return {
      title: "Paper Not Found",
    };
  }

  // Get the default OpenGraph image from parent
  const previousImages = (await parent).openGraph?.images || [];
  // Use Kris Yotam's logo for paper articles
  const images = [
    {
      url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
      width: 1200,
      height: 2100,
      alt: paperItem.title
    }
  ];

  const url = `https://krisyotam.com/papers/${params.category}/${params.slug}`;

  return {
    title: `${paperItem.title} | ${paperItem.category} Papers | Kris Yotam`,
    description: paperItem.preview || `Research paper: ${paperItem.title}`,
    openGraph: {
      title: paperItem.title,
      description: paperItem.preview || `Research paper: ${paperItem.title}`,
      url,
      type: "article",
      images,
      siteName: "Kris Yotam",
    },
    twitter: {
      card: "summary_large_image",
      title: paperItem.title,
      description: paperItem.preview || `Research paper: ${paperItem.title}`,
      images: images.map(img => img.url),
      creator: "@krisyotam"
    }
  };
}

export default async function PaperPage({ params }: PaperPageProps) {
  const paperItem = papersData.papers.find(p => 
    slugifyCategory(p.category) === params.category && p.slug === params.slug
  );

  if (!paperItem) {
    notFound();
  }

  const paperData: PaperMeta = {
    ...paperItem,
    status: paperItem.status as PaperStatus,
    confidence: paperItem.confidence as PaperConfidence
  };

  const papers: PaperMeta[] = (papersData.papers as PaperData[]).map(paperItem => ({
    ...paperItem,
    start_date: paperItem.start_date || (paperItem as any).date || new Date().toISOString(),
    end_date: paperItem.end_date || new Date().toISOString().split('T')[0],
    status: paperItem.status as PaperStatus,
    confidence: paperItem.confidence as PaperConfidence
  }));

  // Extract headings from the papers MDX content
  const headings = await extractHeadingsFromMDX('papers', params.slug, params.category);

  // Dynamically import the MDX file based on category and slug
  const PaperArticle = (await import(`@/app/(content)/papers/content/${params.category}/${params.slug}.mdx`)).default;
  
  return (
    <div className="relative min-h-screen bg-background text-foreground pt-16">
      <div className="container max-w-[672px] mx-auto px-4">
        {/* Header section - same width as content */}
        <div className="mb-8">
          <PapersPageClient paperData={paperData} allPapers={papers} headerOnly={true} />
        </div>
        
        {/* Main content */}
        <main>
          {/* Table of Contents - at the top of content */}
          {headings.length > 0 && (
            <TableOfContents headings={headings} />
          )}
          
          <div className="papers-content">
            <PaperArticle />
          </div>
          <PapersPageClient paperData={paperData} allPapers={papers} contentOnly={true} />
          <Comments />
        </main>
      </div>
    </div>
  );
}