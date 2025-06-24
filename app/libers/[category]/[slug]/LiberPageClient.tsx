/* app/libers/[category]/[slug]/LiberPageClient.tsx */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LiveClock } from "@/components/live-clock";
import { PostHeader } from "@/components/post-header";
import { Footer } from "@/app/essays/components/footer";
import { Citation } from "@/components/citation";
import { LibersContentWarning } from "@/components/libers-content-warning";

interface LiberMeta {
  title: string;
  subtitle?: string;
  preview?: string;
  date: string;
  slug: string;
  tags: string[];
  category: string;
  status?: "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished";
  confidence?:
    | "impossible" | "remote" | "highly unlikely" | "unlikely"
    | "possible"  | "likely"  | "highly likely"   | "certain";
  importance?: number;
}

interface Props {
  liber: LiberMeta;
  allLibers: LiberMeta[];
  children?: React.ReactNode;
  headerOnly?: boolean;
  contentOnly?: boolean;
}

export default function LiberPageClient({ liber, allLibers, children, headerOnly, contentOnly }: Props) {
  const [showWarning, setShowWarning] = useState(false);

  // Check if user has accepted terms on component mount
  useEffect(() => {
    const hasAccepted = localStorage.getItem("libers-terms-accepted");
    if (!hasAccepted) {
      setShowWarning(true);
    }
  }, []);

  const handleAcceptTerms = () => {
    setShowWarning(false);
  };

  if (!liber) notFound();

  /* prev / next */
  const sorted = [...allLibers].sort(
    (a, b) => +new Date(b.date) - +new Date(a.date)
  );
  const idx  = sorted.findIndex(l => l.slug === liber.slug);
  const prev = idx < sorted.length - 1 ? sorted[idx + 1] : null;
  const next = idx > 0                 ? sorted[idx - 1] : null;
  // Helper function to create category slug
  function slugifyCategory(category: string) {
    return category.toLowerCase().replace(/\s+/g, "-");
  }

  // Render only header
  if (headerOnly) {
    return (
      <>
        {showWarning && (
          <LibersContentWarning onAccept={handleAcceptTerms} />
        )}
        <div className="container max-w-[672px] mx-auto px-4">
          <PostHeader 
            className=""     
            title={liber.title}
            subtitle={liber.subtitle}
            date={liber.date}
            tags={liber.tags}
            category={liber.category}
            backHref="/libers"
            backText="Libers"
            preview={liber.preview}
            status={liber.status ?? "Notes"}
            confidence={liber.confidence ?? "possible"}
            importance={liber.importance ?? 5}
          />
        </div>
      </>
    );
  }

  // Render only content (citation, footer, etc.)
  if (contentOnly) {
    return (
      <div className="mt-8">
        <Citation 
          title={liber.title}
          slug={liber.slug}
          date={liber.date}
          url={`https://krisyotam.com/libers/${slugifyCategory(liber.category)}/${liber.slug}`}
        />
        <LiveClock />
        <Footer />
      </div>
    );
  }

  // Legacy layout - render everything together
  return (
    <>
      {showWarning && (
        <LibersContentWarning onAccept={handleAcceptTerms} />
      )}
      
      <div className="container max-w-[672px] mx-auto px-4 pt-16 pb-8">
        {/* clean page header (outside .liber-content) ----------------------- */}
        <PostHeader 
          className=""     
          title={liber.title}
          subtitle={liber.subtitle}
          date={liber.date}
          tags={liber.tags}
          category={liber.category}
          backHref="/libers"
          backText="Libers"
          preview={liber.preview}
          status={liber.status ?? "Notes"}
          confidence={liber.confidence ?? "possible"}
          importance={liber.importance ?? 5}
        />
        
        {/* MDX body -------------------------------------------------------- */}
        <div className="liber-content">{children}</div>
        
        <div className="mt-8">
          <Citation 
            title={liber.title}
            slug={liber.slug}
            date={liber.date}
            url={`https://krisyotam.com/libers/${slugifyCategory(liber.category)}/${liber.slug}`}
          />
          <LiveClock />
          <Footer />
        </div>
      </div>
    </>
  );
}
