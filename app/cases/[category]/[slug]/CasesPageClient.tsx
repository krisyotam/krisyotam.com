/* app/cases/[category]/[slug]/CasePageClient.tsx */

"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { LiveClock } from "@/components/live-clock";
import { PostHeader } from "@/components/post-header";
import { Footer } from "@/app/essays/components/footer";
import { Citation } from "@/components/citation";
import type { CaseMeta } from "@/types/cases";

interface Props {
  caseData: CaseMeta;
  allCases: CaseMeta[];
  children?: React.ReactNode;
  headerOnly?: boolean;
  contentOnly?: boolean;
}

export default function CasePageClient({ caseData: caseItem, allCases, children, headerOnly, contentOnly }: Props) {
  if (!caseItem) notFound();

  /* prev / next */
  const sorted = [...allCases].sort(
    (a, b) => +new Date(b.date) - +new Date(a.date)
  );
  const idx = sorted.findIndex(c => c.slug === caseItem.slug);
  const prev = idx < sorted.length - 1 ? sorted[idx + 1] : null;
  const next = idx > 0 ? sorted[idx - 1] : null;
  // Helper function to create category slug
  function slugifyCategory(category: string) {
    return category.toLowerCase().replace(/\s+/g, "-");
  }
  // Map case status to PostHeader compatible status
  function mapCaseStatus(status?: string) {
    const statusMap: Record<string, "Draft" | "Finished" | "Abandoned" | "Notes" | "In Progress"> = {
      "Draft": "Draft",
      "Published": "Finished",
      "Archived": "Abandoned",
      "Active": "In Progress",
      "Cold": "Notes"
    };
    return statusMap[status || "Draft"] || "Draft";
  }

  // Map case confidence to PostHeader compatible confidence
  function mapCaseConfidence(confidence?: string) {
    const confidenceMap: Record<string, "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain"> = {
      "impossible": "impossible",
      "remote": "remote", 
      "highly unlikely": "highly unlikely",
      "unlikely": "unlikely",
      "possible": "possible",
      "likely": "likely",
      "highly likely": "highly likely",
      "certain": "certain",
      "ambiguous": "possible", // Map extended types to base types
      "uncertain": "possible",
      "developing": "possible", 
      "moderate": "likely"
    };    return confidenceMap[confidence || "possible"] || "possible";
  }

  // Render only header
  if (headerOnly) {
    return (
      <div className="container max-w-[672px] mx-auto px-4">
        <PostHeader 
          className=""     
          title={caseItem.title}
          subtitle={caseItem.subtitle}
          date={caseItem.date}
          tags={caseItem.tags}
          category={caseItem.category}
          backHref="/cases"
          backText="Cases"
          preview={caseItem.preview}
          status={mapCaseStatus(caseItem.status)}
          confidence={mapCaseConfidence(caseItem.confidence)}
          importance={caseItem.importance ?? 5}
        />
      </div>
    );
  }

  // Render only content (citation, footer, etc.)
  if (contentOnly) {
    return (
      <div className="mt-8">
        <Citation 
          title={caseItem.title}
          slug={caseItem.slug}
          date={caseItem.date}
          url={`https://krisyotam.com/cases/${slugifyCategory(caseItem.category)}/${caseItem.slug}`}
        />
        <LiveClock />
        <Footer />
      </div>
    );
  }

  // Legacy layout - render everything together
  return (
    <div className="container max-w-[672px] mx-auto px-4 pt-16 pb-8">
      {/* clean page header (outside .cases-content) */}
      <PostHeader 
        className=""     
        title={caseItem.title}
        subtitle={caseItem.subtitle}
        date={caseItem.date}
        tags={caseItem.tags}
        category={caseItem.category}
        backHref="/cases"
        backText="Cases"
        preview={caseItem.preview}
        status={mapCaseStatus(caseItem.status)}
        confidence={mapCaseConfidence(caseItem.confidence)}
        importance={caseItem.importance ?? 5}
      />
      
      {/* MDX body */}
      <div className="cases-content">{children}</div>
      
      <div className="mt-8">
        <Citation 
          title={caseItem.title}
          slug={caseItem.slug}
          date={caseItem.date}
          url={`https://krisyotam.com/cases/${slugifyCategory(caseItem.category)}/${caseItem.slug}`}
        />
        <LiveClock />
        <Footer />
      </div>
    </div>
  );
}
