export const dynamic = 'force-static';
export const revalidate = false;

import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import casesData from "@/data/cases/cases.json";
import CasesPageClient from "./CasesPageClient";
import { TableOfContents } from "@/components/typography/table-of-contents";
import { extractHeadingsFromMDX } from "@/utils/extract-mdx-headings";
import type { CaseMeta, CaseStatus, CaseConfidence } from "@/types/cases";

interface CaseData {
  title: string;
  start_date: string;
  end_date?: string;
  slug: string;
  tags: string[];
  category: string;
  status: string;
  confidence: string;
  importance: number;
  preview: string;
  subtitle?: string;
}

interface CasePageProps {
  params: { category: string; slug: string };
}

// Helper function to slugify category
function slugifyCategory(category: string) {
  return category.toLowerCase().replace(/\s+/g, "-");
}

export async function generateStaticParams() {
  // Generate all category/slug combinations
  return casesData.map(caseItem => ({
    category: slugifyCategory(caseItem.category),
    slug: caseItem.slug
  }));
}

export async function generateMetadata({ params }: CasePageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const caseItem = casesData.find(c => 
    slugifyCategory(c.category) === params.category && c.slug === params.slug
  );

  if (!caseItem) {
    return {
      title: "Case Not Found",
    };
  }

  // Get the default OpenGraph image from parent
  const previousImages = (await parent).openGraph?.images || [];
  // Use Kris Yotam's logo for case articles
  const images = [
    {
      url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
      width: 1200,
      height: 2100,
      alt: caseItem.title
    }
  ];

  const url = `https://krisyotam.com/cases/${params.category}/${params.slug}`;

  return {
    title: `${caseItem.title} | ${caseItem.category} Cases | Kris Yotam`,
    description: caseItem.preview || `Case investigation: ${caseItem.title}`,
    openGraph: {
      title: caseItem.title,
      description: caseItem.preview || `Case investigation: ${caseItem.title}`,
      url,
      type: "article",
      images,
      siteName: "Kris Yotam",
    },
    twitter: {
      card: "summary_large_image",
      title: caseItem.title,
      description: caseItem.preview || `Case investigation: ${caseItem.title}`,
      images: images.map(img => img.url),
      creator: "@krisyotam"
    }
  };
}

export default async function CasePage({ params }: CasePageProps) {
  const caseItem = casesData.find(c => 
    slugifyCategory(c.category) === params.category && c.slug === params.slug
  );

  if (!caseItem) {
    notFound();
  }

  const caseData: CaseMeta = {
    ...caseItem,
    status: caseItem.status as CaseStatus,
    confidence: caseItem.confidence as CaseConfidence
  };

  const cases: CaseMeta[] = (casesData as CaseData[]).map(caseItem => ({
    ...caseItem,
    status: caseItem.status as CaseStatus,
    confidence: caseItem.confidence as CaseConfidence
  }));

  // Extract headings from the case MDX content
  const headings = await extractHeadingsFromMDX('cases', params.slug, params.category);

  // Dynamically import the MDX file based on category and slug
  const CaseArticle = (await import(`@/app/(content)/cases/content/${params.category}/${params.slug}.mdx`)).default;
    return (
    <div className="relative min-h-screen bg-background text-foreground pt-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header section - full width */}
        <div className="mb-8">
          <CasesPageClient caseData={caseData} allCases={cases} headerOnly={true} />
        </div>
        
        {/* Main content */}
        <main className="container max-w-[672px] mx-auto px-4">
          {/* Table of Contents - at the top of content */}
          {headings.length > 0 && (
            <TableOfContents headings={headings} />
          )}
          
          <div className="cases-content">
            <CaseArticle />
          </div>
          <CasesPageClient caseData={caseData} allCases={cases} contentOnly={true} />
        </main>
      </div>
    </div>
  );
}