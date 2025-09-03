"use client";

import { PageHeader } from "@/components/page-header";
import { Citation } from "@/components/citation";
import { LiveClock } from "@/components/live-clock";
import { Footer } from "@/components/footer";
import SiteFooter from "@/components/typography/expanded-footer-block";
import type { LectureMeta, LectureStatus, LectureConfidence } from "@/types/lectures";

interface Props {
  lectureData: LectureMeta;
  allLectures: LectureMeta[];
  children?: React.ReactNode;
  headerOnly?: boolean;
  contentOnly?: boolean;
}

function slugifyCategory(category: string) {
  return category.toLowerCase().replace(/\s+/g, "-");
}

export default function LecturesPageClient({ lectureData: lectureItem, allLectures, children, headerOnly, contentOnly }: Props) {
  // Function to map lecture status to PageHeader compatible status
  const mapLectureStatusToPageHeaderStatus = (lectureStatus: LectureStatus): "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished" => {
    const statusMap: Record<LectureStatus, "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished"> = {
      Draft: "Draft",
      Published: "Finished",
      Archived: "Abandoned", 
      Active: "In Progress",
      Notes: "Notes"
    };
    return statusMap[lectureStatus] || "Draft";
  };

  // Function to map lecture confidence to PageHeader compatible confidence
  const mapLectureConfidenceToPageHeaderConfidence = (lectureConfidence?: LectureConfidence): "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain" => {
    if (!lectureConfidence) return "possible";
    
    const confidenceMap: Record<LectureConfidence, "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain"> = {
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
    return confidenceMap[lectureConfidence] || "possible";
  };

  // Render only header
  if (headerOnly) {
    return (
      <PageHeader
        title={lectureItem.title}
        subtitle={lectureItem.subtitle}
        start_date={lectureItem.start_date}
        end_date={lectureItem.end_date}
        backHref="/lectures"
        backText="Lectures"
        preview={lectureItem.preview}
        status={mapLectureStatusToPageHeaderStatus(lectureItem.status ?? "Notes")}
        confidence={mapLectureConfidenceToPageHeaderConfidence(lectureItem.confidence)}
        importance={lectureItem.importance ?? 5}
      />
    );
  }

  const lastUpdated = (lectureItem.end_date && lectureItem.end_date.trim()) || new Date().toISOString().slice(0, 10);
  const rawMarkdown = typeof children === "string" ? children : "";

  // Render only content (citation, footer, etc.)
  if (contentOnly) {
    return (
      <div className="mt-8">
        <SiteFooter lastUpdated={lastUpdated} rawMarkdown={rawMarkdown} />
        <Citation 
          title={lectureItem.title}
          slug={lectureItem.slug}
          date={(lectureItem.end_date && lectureItem.end_date.trim()) || lectureItem.start_date}
          url={`https://krisyotam.com/lectures/${slugifyCategory(lectureItem.category)}/${lectureItem.slug}`}
        />
        <LiveClock />
        <Footer />
      </div>
    );
  }
  // Legacy layout - render everything together
  return (
    <div className="lectures-container pt-16 pb-8">
      <PageHeader
        title={lectureItem.title}
        subtitle={lectureItem.subtitle}
        start_date={lectureItem.start_date}
        end_date={lectureItem.end_date}
        backHref="/lectures"
        backText="Lectures"
        preview={lectureItem.preview}
        status={mapLectureStatusToPageHeaderStatus(lectureItem.status ?? "Draft")}
        confidence={mapLectureConfidenceToPageHeaderConfidence(lectureItem.confidence)}
        importance={lectureItem.importance ?? 5}
      />
      
      {/* MDX body */}
      <div className="lectures-content">{children}</div>
      
      <div className="mt-8">
        <SiteFooter lastUpdated={lastUpdated} rawMarkdown={rawMarkdown} />
        <Citation 
          title={lectureItem.title}
          slug={lectureItem.slug}
          date={(lectureItem.end_date && lectureItem.end_date.trim()) || lectureItem.start_date}
          url={`https://krisyotam.com/lectures/${slugifyCategory(lectureItem.category)}/${lectureItem.slug}`}
        />
        <LiveClock />
        <Footer />
      </div>
    </div>
  );
}
