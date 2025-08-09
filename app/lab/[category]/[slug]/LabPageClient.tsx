/* app/lab/[category]/[slug]/LabPageClient.tsx */

"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { LiveClock } from "@/components/live-clock";
import { PostHeader } from "@/components/post-header";
import { Footer } from "@/app/essays/components/footer";
import { Citation } from "@/components/citation";

interface LabMeta {
  title: string;
  subtitle?: string;
  preview?: string;
  start_date: string;
  end_date?: string;
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
  lab: LabMeta;
  allLabs: LabMeta[];
  children?: React.ReactNode;
  headerOnly?: boolean;
  contentOnly?: boolean;
}

export default function LabPageClient({ lab, allLabs, children, headerOnly, contentOnly }: Props) {
  if (!lab) notFound();

  /* prev / next */
  const sorted = [...allLabs].sort(
    (a, b) => {
      const aDate = a.end_date || a.start_date;
      const bDate = b.end_date || b.start_date;
      return +new Date(bDate) - +new Date(aDate);
    }
  );
  const idx  = sorted.findIndex(n => n.slug === lab.slug);
  const prev = idx < sorted.length - 1 ? sorted[idx + 1] : null;
  const next = idx > 0                 ? sorted[idx - 1] : null;

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
          title={lab.title}
          subtitle={lab.subtitle}
          start_date={lab.start_date}
          end_date={lab.end_date}
          tags={lab.tags}
          category={lab.category}
          backHref="/lab"
          backText="Lab"
          preview={lab.preview}
          status={lab.status ?? "Notes"}
          confidence={lab.confidence ?? "possible"}
          importance={lab.importance ?? 5}
        />
      </div>
    );
  }

  // Render only content (citation, footer, etc.)
  if (contentOnly) {
    return (
      <div className="mt-8">
        <Citation 
          title={lab.title}
          slug={lab.slug}
          start_date={lab.start_date}
          end_date={lab.end_date}
          url={`https://krisyotam.com/lab/${slugifyCategory(lab.category)}/${lab.slug}`}
        />
        <LiveClock />
        <Footer />
      </div>
    );
  }

  // Render full layout (legacy)
  return (
    <div className="container max-w-[672px] mx-auto px-4 pt-16 pb-8">
      {/* clean page header (outside .lab-content) ----------------------- */}
      <PostHeader 
        className=""     
        title={lab.title}
        subtitle={lab.subtitle}
        start_date={lab.start_date}
        end_date={lab.end_date}
        tags={lab.tags}
        category={lab.category}
        backHref="/lab"
        backText="Lab"
        preview={lab.preview}
        status={lab.status ?? "Notes"}
        confidence={lab.confidence ?? "possible"}
        importance={lab.importance ?? 5}
      />

      {/* main content -------------------------------------------------- */}
      <article className="mt-10 lab-content">
        {children}
      </article>

      {/* metadata + navigation ----------------------------------------- */}
      <div className="mt-12 space-y-6">
        <Citation 
          title={lab.title}
          slug={lab.slug}
          start_date={lab.start_date}
          end_date={lab.end_date}
          url={`https://krisyotam.com/lab/${slugifyCategory(lab.category)}/${lab.slug}`}
        />

        {/* prev/next navigation */}
        <div className="flex justify-between items-center py-4 border-t border-border">
          <div className="flex-1">
            {prev && (
              <Link
                href={`/lab/${slugifyCategory(prev.category)}/${prev.slug}`}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                ← {prev.title}
              </Link>
            )}
          </div>
          <div className="flex-1 text-right">
            {next && (
              <Link
                href={`/lab/${slugifyCategory(next.category)}/${next.slug}`}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                {next.title} →
              </Link>
            )}
          </div>
        </div>

        <LiveClock />
        <Footer />
      </div>
    </div>
  );
}
