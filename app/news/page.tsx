import NewsClientPage from "./NewsClientPage";
import newsData from "@/data/news/news.json";
import type { Metadata } from "next";
import type { NewsMeta, NewsStatus, NewsConfidence } from "@/types/news";
import { staticMetadata } from "@/lib/staticMetadata";

export const metadata: Metadata = staticMetadata.news;

export default function NewsPage() {
  // Map and sort news by date (newest first)
  const news: NewsMeta[] = newsData.map(article => ({
    ...article,
    status: article.status as NewsStatus,
    confidence: article.confidence as NewsConfidence
  })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="news-container">
      <NewsClientPage news={news} initialCategory="all" />
    </div>
  );
}