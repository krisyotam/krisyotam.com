/* app/news/[category]/[slug]/NewsPageClient.tsx */

"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { LiveClock } from "@/components/live-clock";
import { PostHeader } from "@/components/post-header";
import { Footer } from "@/app/essays/components/footer";
import { Citation } from "@/components/citation";

interface NewsMeta {
  title: string;
  subtitle?: string;
  preview?: string;
  date: string;
  slug: string;
  tags: string[];
  category: string;
  status?: "Draft" | "Published" | "Archived" | "Breaking" | "Developing";
  confidence?:
    | "impossible" | "remote" | "highly unlikely" | "unlikely"
    | "possible"  | "likely"  | "highly likely"   | "certain";
  importance?: number;
}

interface Props {
  article: NewsMeta;
  allNews: NewsMeta[];
  children?: React.ReactNode;
  headerOnly?: boolean;
  contentOnly?: boolean;
}

export default function NewsPageClient({ article, allNews, children, headerOnly, contentOnly }: Props) {
  if (!article) notFound();

  // Map news status to PostHeader compatible status
  function mapNewsStatus(status?: string) {
    const statusMap: Record<string, "Draft" | "Finished" | "Abandoned" | "Notes" | "In Progress"> = {
      "Draft": "Draft",
      "Published": "Finished",
      "Archived": "Abandoned",
      "Breaking": "In Progress",
      "Developing": "In Progress"
    };
    return statusMap[status || "Draft"] || "Draft";
  }

  /* prev / next */
  const sorted = [...allNews].sort(
    (a, b) => +new Date(b.date) - +new Date(a.date)
  );
  const idx = sorted.findIndex(n => n.slug === article.slug);
  const prev = idx < sorted.length - 1 ? sorted[idx + 1] : null;
  const next = idx > 0 ? sorted[idx - 1] : null;
  // Helper function to create category slug
  function slugifyCategory(category: string) {
    return category.toLowerCase().replace(/\s+/g, "-");
  }

  // Render only header
  if (headerOnly) {
    return (
      <div className="container max-w-[672px] mx-auto px-4">
        <PostHeader 
          className=""     
          title={article.title}
          subtitle={article.subtitle}
          date={article.date}
          tags={article.tags}
          category={article.category}
          backHref="/news"
          backText="News"
          preview={article.preview}
          status={mapNewsStatus(article.status)}
          confidence={article.confidence ?? "possible"}
          importance={article.importance ?? 5}
        />
      </div>
    );
  }

  // Render only content (citation, footer, etc.)
  if (contentOnly) {
    return (
      <div className="mt-8">
        <Citation 
          title={article.title}
          slug={article.slug}
          date={article.date}
          url={`https://krisyotam.com/news/${slugifyCategory(article.category)}/${article.slug}`}
        />
        <LiveClock />
        <Footer />
      </div>
    );
  }

  // Legacy layout - render everything together
  return (
    <div className="container max-w-[672px] mx-auto px-4 pt-16 pb-8">
      {/* clean page header (outside .news-content) */}
      <PostHeader 
        className=""     
        title={article.title}
        subtitle={article.subtitle}
        date={article.date}
        tags={article.tags}
        category={article.category}
        backHref="/news"
        backText="News"
        preview={article.preview}
        status={mapNewsStatus(article.status)}
        confidence={article.confidence ?? "possible"}
        importance={article.importance ?? 5}
      />
      
      {/* MDX body */}
      <div className="news-content">{children}</div>
      
      <div className="mt-8">
        <Citation 
          title={article.title}
          slug={article.slug}
          date={article.date}
          url={`https://krisyotam.com/news/${slugifyCategory(article.category)}/${article.slug}`}
        />
        <LiveClock />
        <Footer />
      </div>
    </div>
  );
}