export const dynamic = 'force-static';
export const revalidate = false;

import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import lecturesData from "@/data/lectures/lectures.json";
import LecturesPageClient from "./LecturesPageClient";
import { TableOfContents } from "@/components/typography/table-of-contents";
import { extractHeadingsFromMDX } from "@/utils/extract-mdx-headings";
import type { LectureMeta, LectureStatus, LectureConfidence } from "@/types/lectures";

interface LectureData {
  title: string;
  start_date: string;
  end_date: string;
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

interface LecturePageProps {
  params: { category: string; slug: string };
}

// Helper function to slugify category
function slugifyCategory(category: string) {
  return category.toLowerCase().replace(/\s+/g, "-");
}

export async function generateStaticParams() {
  // Generate all category/slug combinations
  return lecturesData.map(lectureItem => ({
    category: slugifyCategory(lectureItem.category),
    slug: lectureItem.slug
  }));
}

export async function generateMetadata({ params }: LecturePageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const lectureItem = lecturesData.find(l => 
    slugifyCategory(l.category) === params.category && l.slug === params.slug
  );

  if (!lectureItem) {
    return {
      title: "Lecture Not Found",
    };
  }

  // Get the default OpenGraph image from parent
  const previousImages = (await parent).openGraph?.images || [];
  // Use Kris Yotam's logo for lecture articles
  const images = [
    {
      url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
      width: 1200,
      height: 2100,
      alt: lectureItem.title
    }
  ];

  const url = `https://krisyotam.com/lectures/${params.category}/${params.slug}`;

  return {
    title: `${lectureItem.title} | ${lectureItem.category} Lectures | Kris Yotam`,
    description: lectureItem.preview || `Educational lecture: ${lectureItem.title}`,
    openGraph: {
      title: lectureItem.title,
      description: lectureItem.preview || `Educational lecture: ${lectureItem.title}`,
      url,
      type: "article",
      images,
      siteName: "Kris Yotam",
    },
    twitter: {
      card: "summary_large_image",
      title: lectureItem.title,
      description: lectureItem.preview || `Educational lecture: ${lectureItem.title}`,
      images: images.map(img => img.url),
      creator: "@krisyotam"
    }
  };
}

export default async function LecturePage({ params }: LecturePageProps) {
  const lectureItem = lecturesData.find(l => 
    slugifyCategory(l.category) === params.category && l.slug === params.slug
  );

  if (!lectureItem) {
    notFound();
  }

  const lectureData: LectureMeta = {
    ...lectureItem,
    status: lectureItem.status as LectureStatus,
    confidence: lectureItem.confidence as LectureConfidence
  };

  const lectures: LectureMeta[] = (lecturesData as LectureData[]).map(lectureItem => ({
    ...lectureItem,
    status: lectureItem.status as LectureStatus,
    confidence: lectureItem.confidence as LectureConfidence
  }));

  // Extract headings from the lectures MDX content
  const headings = await extractHeadingsFromMDX('lectures', params.slug, params.category);

  // Dynamically import the MDX file based on category and slug
  const LectureArticle = (await import(`@/app/(content)/lectures/content/${params.category}/${params.slug}.mdx`)).default;
  
  return (
    <div className="relative min-h-screen bg-background text-foreground pt-16">
      <div className="container max-w-[672px] mx-auto px-4">
        {/* Header section */}
        <div className="mb-8">
          <LecturesPageClient lectureData={lectureData} allLectures={lectures} headerOnly={true} />
        </div>
        
        {/* Table of Contents */}
        {headings.length > 0 && (
          <TableOfContents headings={headings} />
        )}
        
        {/* Main content */}
        <div className="lectures-content">
          <LectureArticle />
        </div>
        
        {/* Citation and Footer */}
        <LecturesPageClient lectureData={lectureData} allLectures={lectures} contentOnly={true} />
      </div>
    </div>
  );
}
