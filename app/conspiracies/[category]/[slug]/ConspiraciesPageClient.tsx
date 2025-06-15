/* app/conspiracies/[category]/[slug]/ConspiraciesPageClient.tsx */

"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { LiveClock } from "@/components/live-clock";
import { PostHeader } from "@/components/post-header";
import { Footer } from "@/app/essays/components/footer";
import { Citation } from "@/components/citation";
import type { ConspiracyMeta, ConspiracyStatus, ConspiracyConfidence } from "@/types/conspiracies";

interface Props {
  conspiracy: ConspiracyMeta;
  allConspiracies: ConspiracyMeta[];
  children: React.ReactNode;
}

// Utility functions to map conspiracy types to PostHeader compatible types
function mapConspiracyStatusToPostHeader(status?: ConspiracyStatus): "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished" {
  const statusMap: Record<ConspiracyStatus, "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished"> = {
    "Draft": "Draft",
    "Published": "Finished",
    "Archived": "Abandoned", 
    "Active": "In Progress",
    "Speculative": "Notes"
  };
  return status ? statusMap[status] : "Notes";
}

function mapConspiracyConfidenceToPostHeader(confidence?: ConspiracyConfidence): "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain" {
  // Map the extended conspiracy confidence values to the core PostHeader values
  const confidenceMap: Record<ConspiracyConfidence, "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain"> = {
    "impossible": "impossible",
    "remote": "remote", 
    "highly unlikely": "highly unlikely",
    "unlikely": "unlikely",
    "possible": "possible",
    "likely": "likely",
    "highly likely": "highly likely",
    "certain": "certain",
    "ambiguous": "possible", // Map ambiguous to possible
    "uncertain": "possible", // Map uncertain to possible  
    "developing": "possible", // Map developing to possible
    "moderate": "likely" // Map moderate to likely
  };
  return confidence ? confidenceMap[confidence] : "possible";
}

export default function ConspiraciesPageClient({ conspiracy, allConspiracies, children }: Props) {
  if (!conspiracy) notFound();

  /* prev / next */
  const sorted = [...allConspiracies].sort(
    (a, b) => +new Date(b.date) - +new Date(a.date)
  );
  const idx  = sorted.findIndex(n => n.slug === conspiracy.slug);
  const prev = idx < sorted.length - 1 ? sorted[idx + 1] : null;
  const next = idx > 0                 ? sorted[idx - 1] : null;

  // Helper function to create category slug
  function slugifyCategory(category: string) {
    return category.toLowerCase().replace(/\s+/g, "-");
  }
  return (
    <div className="container max-w-[672px] mx-auto px-4 pt-16 pb-8">
      {/* clean page header (outside .conspiracy-content) ----------------------- */}      <PostHeader 
        className=""     
        title={conspiracy.title}
        subtitle={conspiracy.subtitle}
        date={conspiracy.date}
        tags={conspiracy.tags}
        category={conspiracy.category}
        backHref="/conspiracies"
        backText="Conspiracies"
        preview={conspiracy.preview}
        status={mapConspiracyStatusToPostHeader(conspiracy.status)}
        confidence={mapConspiracyConfidenceToPostHeader(conspiracy.confidence)}
        importance={conspiracy.importance ?? 5}
      />
      
      {/* MDX body -------------------------------------------------------- */}
      <div className="conspiracy-content">{children}</div>
      
      <div className="mt-8">
        <Citation 
          title={conspiracy.title}
          slug={conspiracy.slug}
          date={conspiracy.date}
          url={`https://krisyotam.com/conspiracies/${slugifyCategory(conspiracy.category)}/${conspiracy.slug}`}
        />
      </div>
      
      <LiveClock />
      <Footer />
    </div>
  );
}