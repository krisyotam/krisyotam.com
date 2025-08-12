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
  })).sort((a, b) => {
    const aDate = (a.end_date?.trim()) ? a.end_date : a.start_date;
    const bDate = (b.end_date?.trim()) ? b.end_date : b.start_date;
    return new Date(bDate).getTime() - new Date(aDate).getTime();
  });

  return (
    <div className="news-container">
      <NewsClientPage news={news} initialCategory="all" />
    </div>
  );
}