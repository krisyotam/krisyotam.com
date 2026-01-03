export const dynamic = 'force-static';
export const revalidate = false;
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import newsData from "@/data/news/news.json";
import NewsPageClient from "./NewsPageClient";
import { TOC } from "@/components/core/toc";
import { Sidenotes } from "@/components/core/sidenotes";
import { extractHeadingsFromMDX } from "@/lib/mdx";
import type { NewsMeta, NewsStatus, NewsConfidence } from "@/types/content";

interface NewsData {
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

interface NewsPageProps {
  params: { category: string; slug: string };
}

// Helper function to slugify category
function slugifyCategory(category: string) {
  return category.toLowerCase().replace(/\s+/g, "-");
}

export async function generateStaticParams() {
  // Generate all category/slug combinations
  return newsData.map(article => ({
    category: slugifyCategory(article.category),
    slug: article.slug
  }));
}

export async function generateMetadata({ params }: NewsPageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const newsArticle = newsData.find(a => 
    slugifyCategory(a.category) === params.category && a.slug === params.slug
  );

  if (!newsArticle) {
    return {
      title: "Article Not Found",
    };
  }

  // Get the default OpenGraph image from parent
  const previousImages = (await parent).openGraph?.images || [];
  // Use Kris Yotam's logo for news articles
  const images = [
    {
      url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
      width: 1200,
      height: 2100,
      alt: newsArticle.title
    }
  ];

  const url = `https://krisyotam.com/news/${params.category}/${params.slug}`;

  return {
    title: `${newsArticle.title} | ${newsArticle.category} News | Kris Yotam`,
    description: newsArticle.preview || `News article about ${newsArticle.title}`,
    openGraph: {
      title: newsArticle.title,
      description: newsArticle.preview || `News article about ${newsArticle.title}`,
      url,
      type: "article",
      images,
      siteName: "Kris Yotam",
    },
    twitter: {
      card: "summary_large_image",
      title: newsArticle.title,
      description: newsArticle.preview || `News article about ${newsArticle.title}`,
      images: images.map(img => img.url),
      creator: "@krisyotam"
    }
  };
}

export default async function NewsPage({ params }: NewsPageProps) {
  const newsArticle = newsData.find(a => 
    slugifyCategory(a.category) === params.category && a.slug === params.slug
  );

  if (!newsArticle) {
    notFound();
  }

  const article: NewsMeta = {
    ...newsArticle,
    status: newsArticle.status as NewsStatus,
    confidence: newsArticle.confidence as NewsConfidence
  };

  const news: NewsMeta[] = (newsData as NewsData[]).map(article => ({
    ...article,
    status: article.status as NewsStatus,
    confidence: article.confidence as NewsConfidence
  }));

  // Extract headings from the news MDX content
  const headings = await extractHeadingsFromMDX('news', params.slug, params.category);

  // Dynamically import the MDX file based on category and slug
  const NewsArticle = (await import(`@/app/(content)/news/content/${params.category}/${params.slug}.mdx`)).default;
  return (
    <div className="relative min-h-screen bg-background text-foreground pt-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header section - full width */}
        <div className="mb-8">
          <NewsPageClient article={article} allNews={news} headerOnly={true} />
        </div>
        
        {/* Main content */}
        <main id="content" className="container max-w-[672px] mx-auto px-4">
          {/* Table of Contents - at the top of content */}
          {headings.length > 0 && (
            <TOC headings={headings} />
          )}

          <div className="news-content">
            <NewsArticle />
          </div>
          <NewsPageClient article={article} allNews={news} contentOnly={true} />
        </main>

        {/* Sidenotes for wide viewports */}
        <Sidenotes containerSelector="#content" />
      </div>
    </div>
  );
}