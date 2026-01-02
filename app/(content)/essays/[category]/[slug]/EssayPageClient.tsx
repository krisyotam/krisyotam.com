"use client";

import { PostHeader } from "@/components/post-header";
import { Citation } from "@/components/citation";
import { LiveClock } from "@/components/live-clock";
import { Footer } from "@/components/footer";
import SiteFooter from "@/components/typography/expanded-footer-block";
import { Comments } from "@/components/core/comments";
import type { Post } from "@/lib/posts";

interface Props {
  essayData: Post;
  allEssays: Post[];
  children?: React.ReactNode;
  headerOnly?: boolean;
  contentOnly?: boolean;
}

function slugifyCategory(category: string) {
  return category.toLowerCase().replace(/\s+/g, "-");
}

export default function EssayPageClient({ essayData: essayItem, allEssays, children, headerOnly = false, contentOnly = false }: Props) {
  // Function to map essay status to PageHeader compatible status
  const mapEssayStatusToPageHeaderStatus = (essayStatus: string): "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished" => {
    const statusMap: Record<string, "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished"> = {
      Notes: "Notes",
      Draft: "Draft",
      Published: "Finished",
      Archived: "Abandoned", 
      Active: "In Progress",
      "In Progress": "In Progress"
    };
    return statusMap[essayStatus] || "Draft";
  };

  // Function to map essay confidence to PageHeader compatible confidence
  const mapEssayConfidenceToPageHeaderConfidence = (essayConfidence?: string): "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain" => {
    if (!essayConfidence) return "possible";
    
    const confidenceMap: Record<string, "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain"> = {
      impossible: "impossible",
      remote: "remote",
      "highly unlikely": "highly unlikely",
      unlikely: "unlikely",
      possible: "possible",
      likely: "likely",
      "highly likely": "highly likely",
      certain: "certain",
      ambiguous: "possible",
      uncertain: "possible",
      developing: "possible",
      moderate: "likely"
    };    return confidenceMap[essayConfidence] || "possible";
  };  // Render only header
  if (headerOnly) {
    return (
      <div className="container max-w-[672px] mx-auto px-4">
        <PostHeader
          title={essayItem.title}
          subtitle={essayItem.subtitle}
          start_date={essayItem.start_date}
          end_date={essayItem.end_date}
          backHref="/essays"
          backText="Essays"
          preview={essayItem.preview}
          status={mapEssayStatusToPageHeaderStatus(essayItem.status ?? "Notes")}
          confidence={mapEssayConfidenceToPageHeaderConfidence(essayItem.confidence)}
          importance={essayItem.importance ?? 5}
          tags={essayItem.tags}
          category={essayItem.category}
        />
      </div>
    );
  }

  // Add lastUpdated and rawMarkdown for SiteFooter
  const lastUpdated = (essayItem.end_date && essayItem.end_date.trim()) || new Date().toISOString().slice(0, 10);
  const rawMarkdown = typeof children === "string" ? children : "";

  // Render only content (citation, footer, etc.)
  if (contentOnly) {
    return (
      <div className="mt-8">
        <Comments />
        <SiteFooter lastUpdated={lastUpdated} rawMarkdown={rawMarkdown} />
        <Citation 
          title={essayItem.title}
          slug={essayItem.slug}
          start_date={essayItem.start_date || (essayItem as any).date || "2025-01-01"}
          end_date={essayItem.end_date}
          url={`https://krisyotam.com/essays/${essayItem.category}/${essayItem.slug}`}
        />
        <div className="mt-8">
          <LiveClock />
        </div>
        <Footer />
      </div>
    );
  }

  // Default: render everything (for backwards compatibility)
  return (
    <>
      <PostHeader
        title={essayItem.title}
        subtitle={essayItem.subtitle}
        start_date={essayItem.start_date || (essayItem as any).date || "2025-01-01"}
        end_date={essayItem.end_date}
        backHref="/essays"
        backText="Essays"
        preview={essayItem.preview}
        status={mapEssayStatusToPageHeaderStatus(essayItem.status ?? "Notes")}
        confidence={mapEssayConfidenceToPageHeaderConfidence(essayItem.confidence)}
        importance={essayItem.importance ?? 5}
        tags={essayItem.tags}
        category={essayItem.category}
      />
      
      {/* MDX body */}
      <div className="essays-content">{children}</div>
      
      <div className="mt-8">
        <SiteFooter lastUpdated={lastUpdated} rawMarkdown={rawMarkdown} />
        <Citation 
          title={essayItem.title}
          slug={essayItem.slug}
          start_date={essayItem.start_date || (essayItem as any).date || "2025-01-01"}
          end_date={essayItem.end_date}
          url={`https://krisyotam.com/essays/${essayItem.category}/${essayItem.slug}`}
        />
      </div>      
      <LiveClock />
      <Footer />
    </>
  );
}
