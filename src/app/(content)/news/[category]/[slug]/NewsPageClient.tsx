/* app/news/[category]/[slug]/NewsPageClient.tsx */

"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { LiveClock } from "@/components/ui/live-clock";
import { PostHeader } from "@/components/core";
import SiteFooter from "@/components/typography/expanded-footer-block";
import { Footer } from "@/components/core/footer";
import { Citation } from "@/components/core/citation";
import { Comments } from "@/components/core/comments";
import { Footnotes } from "@/components/core/footnotes";
import { ViewTracker } from "@/components/core/view-tracker";

interface NewsMeta {
  title: string;
  subtitle?: string;
  preview?: string;
  start_date: string;
  end_date?: string;
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

  const viewSlug = `news/${article.category.toLowerCase().replace(/\s+/g, "-")}/${article.slug}`;

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
    (a, b) => {
      const aDate = (a.end_date?.trim()) ? a.end_date : a.start_date;
      const bDate = (b.end_date?.trim()) ? b.end_date : b.start_date;
      return +new Date(bDate) - +new Date(aDate);
    }
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
          start_date={article.start_date}
          end_date={article.end_date}
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

  const lastUpdated = (article.end_date && article.end_date.trim()) || new Date().toISOString().slice(0, 10);
  const rawMarkdown = typeof children === "string" ? children : "";

  // Render only content (citation, footer, etc.)
  if (contentOnly) {
    return (
      <div className="mt-8">
        <Comments />
        <Footnotes containerSelector="#content" />
        <SiteFooter lastUpdated={lastUpdated} rawMarkdown={rawMarkdown} />
        <Citation 
          title={article.title}
          slug={article.slug}
          start_date={article.start_date}
          end_date={article.end_date}
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
      <ViewTracker slug={viewSlug} />
      {/* clean page header (outside .news-content) */}
      <PostHeader 
        className=""     
        title={article.title}
        subtitle={article.subtitle}
        start_date={article.start_date}
        end_date={article.end_date}
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
      <div className="content">{children}</div>
      
      <div className="mt-8">
        <SiteFooter lastUpdated={lastUpdated} rawMarkdown={rawMarkdown} />
        <Citation 
          title={article.title}
          slug={article.slug}
          start_date={article.start_date}
          end_date={article.end_date}
          url={`https://krisyotam.com/news/${slugifyCategory(article.category)}/${article.slug}`}
        />
        <LiveClock />
        <Footer />
      </div>
    </div>
  );
}