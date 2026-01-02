import NewsClientPage from "../NewsClientPage";
import newsData from "@/data/news/news.json";
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import type { NewsMeta, NewsStatus, NewsConfidence } from "@/types/content";

interface PageProps {
  params: { category: string };
}

export async function generateStaticParams() {
  // Get all unique categories and generate their slugs
  const categories = new Set(newsData.map(article => 
    article.category.toLowerCase().replace(/\s+/g, "-")
  ));
  
  return Array.from(categories).map(category => ({
    category: category
  }));
}

export async function generateMetadata({ params }: PageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const categorySlug = params.category;
  const categoryData = (await import('@/data/news/categories.json')).default.categories.find(
    cat => cat.slug === categorySlug
  );

  if (!categoryData) {
    return {
      title: "Category Not Found",
    };
  }

  const url = `https://krisyotam.com/news/${categorySlug}`;
  // Use Kris Yotam's logo for category pages
  const images = [
    {
      url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
      width: 1200,
      height: 630,
      alt: `${categoryData.title} | Kris Yotam`
    }
  ];

  return {
    title: `${categoryData.title} | News | Kris Yotam`,
    description: categoryData.preview,
    openGraph: {
      title: categoryData.title,
      description: categoryData.preview,
      url,
      type: "website",
      images,
      siteName: "Kris Yotam",
    },
    twitter: {
      card: "summary_large_image",
      title: categoryData.title,
      description: categoryData.preview,
      images: images.map(img => img.url),
      creator: "@krisyotam"
    }
  };
}

export default function NewsCategoryPage({ params }: PageProps) {
  const categorySlug = params.category;
  
  // Find the original category name
  const originalCategory = newsData.find(article => 
    article.category.toLowerCase().replace(/\s+/g, "-") === categorySlug
  )?.category;

  if (!originalCategory) {
    notFound();
  }

  // Map and sort news by date (newest first)
  const news: NewsMeta[] = newsData.map(article => ({
    ...article,
    status: article.status as NewsStatus,
    confidence: article.confidence as NewsConfidence
  })).sort((a, b) => {
    const aDate = (a.end_date?.trim()) ? a.end_date : a.start_date;
    const bDate = (b.end_date?.trim()) ? b.end_date : b.start_date;
    return new Date(bDate).getTime() - new Date(aDate).getTime();
  });

  return (
    <div className="news-container">
      <NewsClientPage news={news} initialCategory={originalCategory} />
    </div>
  );
}