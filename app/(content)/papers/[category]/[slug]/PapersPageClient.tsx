"use client";

import { PageHeader } from "@/components/core";
import { Citation } from "@/components/citation";
import { LiveClock } from "@/components/live-clock";
import { Footer } from "@/components/footer";
import SiteFooter from "@/components/typography/expanded-footer-block";
import { Comments } from "@/components/core/comments";
import type { PaperMeta, PaperStatus, PaperConfidence } from "@/types/papers";

interface Props {
  paperData: PaperMeta;
  allPapers: PaperMeta[];
  children?: React.ReactNode;
  headerOnly?: boolean;
  contentOnly?: boolean;
}

function slugifyCategory(category: string) {
  return category.toLowerCase().replace(/\s+/g, "-");
}

export default function PaperPageClient({ paperData: paperItem, allPapers, children, headerOnly, contentOnly }: Props) {
  // Function to map paper status to PageHeader compatible status
  const mapPaperStatusToPageHeaderStatus = (paperStatus: PaperStatus): "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished" => {
    const statusMap: Record<PaperStatus, "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished"> = {
      Draft: "Draft",
      Published: "Finished",
      Archived: "Abandoned", 
      Active: "In Progress",
      Notes: "Notes"
    };
    return statusMap[paperStatus] || "Draft";
  };

  // Function to map paper confidence to PageHeader compatible confidence
  const mapPaperConfidenceToPageHeaderConfidence = (paperConfidence?: PaperConfidence): "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain" => {
    if (!paperConfidence) return "possible";
    
    const confidenceMap: Record<PaperConfidence, "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain"> = {
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
      moderate: "likely",
      speculative: "possible",
      tentative: "possible",
      evidential: "highly likely",
      theoretical: "possible",
      controversial: "possible",
      debated: "possible",
      philosophical: "possible"
    };
    return confidenceMap[paperConfidence] || "possible";
  };

  // Render only header
  if (headerOnly) {
    return (
      <div>
        <PageHeader
          title={paperItem.title}
          subtitle={paperItem.subtitle}
          start_date={paperItem.start_date}
          end_date={paperItem.end_date}
          backHref="/papers"
          backText="Papers"
          preview={paperItem.preview}
          status={mapPaperStatusToPageHeaderStatus(paperItem.status ?? "Notes")}
          confidence={mapPaperConfidenceToPageHeaderConfidence(paperItem.confidence)}
          importance={paperItem.importance ?? 5}
        />
      </div>
    );
  }

  const lastUpdated = (paperItem.end_date && paperItem.end_date.trim()) || new Date().toISOString().slice(0, 10);
  const rawMarkdown = typeof children === "string" ? children : "";

  // Render only content (citation, footer, etc.)
  if (contentOnly) {
    return (
      <div>
        {/* MDX body */}
        <div className="papers-content">{children}</div>
        
        <div className="mt-8">
          <Comments />
          <SiteFooter lastUpdated={lastUpdated} rawMarkdown={rawMarkdown} />
          <Citation
            title={paperItem.title}
            slug={paperItem.slug}
            date={(paperItem.end_date && paperItem.end_date.trim()) || paperItem.start_date}
            url={`https://krisyotam.com/papers/${slugifyCategory(paperItem.category)}/${paperItem.slug}`}
          />
          <LiveClock />
          <Footer />
        </div>
      </div>
    );
  }
  // Legacy layout - render everything together
  return (
    <div className="papers-container pt-16 pb-8">
      <PageHeader
        title={paperItem.title}
        subtitle={paperItem.subtitle}
        start_date={paperItem.start_date}
        end_date={paperItem.end_date}
        backHref="/papers"
        backText="Papers"
        preview={paperItem.preview}
        status={mapPaperStatusToPageHeaderStatus(paperItem.status ?? "Draft")}
        confidence={mapPaperConfidenceToPageHeaderConfidence(paperItem.confidence)}
        importance={paperItem.importance ?? 5}
      />
      
      {/* MDX body */}
      <div className="papers-content">{children}</div>
      
      <div className="mt-8">
        <SiteFooter lastUpdated={lastUpdated} rawMarkdown={rawMarkdown} />
        <Citation 
          title={paperItem.title}
          slug={paperItem.slug}
          date={(paperItem.end_date && paperItem.end_date.trim()) || paperItem.start_date}
          url={`https://krisyotam.com/papers/${slugifyCategory(paperItem.category)}/${paperItem.slug}`}
        />
        <LiveClock />
        <Footer />
      </div>
    </div>
  );
}