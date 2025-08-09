/* app/links/[category]/[slug]/LinkPageClient.tsx */

"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { LiveClock } from "@/components/live-clock";
import { PostHeader } from "@/components/post-header";
import { Footer } from "@/components/footer";
import { Citation } from "@/components/citation";

interface LinkMeta {
  title: string;
  subtitle?: string;
  preview?: string;
  start_date: string;
  end_date?: string;
  date?: string; // backward compatibility
  slug: string;
  tags: string[];
  category: string;
  url: string;
  status?: "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished" | "Published";
  confidence?:
    | "impossible" | "remote" | "highly unlikely" | "unlikely"
    | "possible"  | "likely"  | "highly likely"   | "certain" | "speculative";
  importance?: number;
}

interface Props {
  link: LinkMeta;
  allLinks: LinkMeta[];
  children?: React.ReactNode;
  headerOnly?: boolean;
  contentOnly?: boolean;
}

export default function LinkPageClient({ link, allLinks, children, headerOnly, contentOnly }: Props) {
  if (!link) notFound();

  /* prev / next */
  const sorted = [...allLinks].sort(
    (a, b) => {
      const aDate = a.end_date || a.start_date || a.date || "1970-01-01";
      const bDate = b.end_date || b.start_date || b.date || "1970-01-01";
      return +new Date(bDate) - +new Date(aDate);
    }
  );
  const idx  = sorted.findIndex(n => n.slug === link.slug);
  const prev = idx < sorted.length - 1 ? sorted[idx + 1] : null;
  const next = idx > 0                 ? sorted[idx - 1] : null;

  // Helper function to create category slug
  function slugifyCategory(category: string) {
    return category.toLowerCase().replace(/\s+/g, "-");
  }

  /* --- LINK VIEW --- */

  // Only render the content that corresponds to the prop flags
  if (headerOnly) {
    return (
      <div className="container max-w-[672px] mx-auto px-4">
        <PostHeader
          title={link.title}
          subtitle={link.subtitle}
          start_date={link.start_date || link.date || "2025-01-01"}
          end_date={link.end_date || new Date().toISOString().split('T')[0]}
          tags={link.tags}
          category={link.category}
          backHref="/links"
          backText="Links"
          status={link.status}
          confidence={link.confidence}
          importance={link.importance}
        />
      </div>
    );
  }

  if (contentOnly) {
    return (
      <>
        {children}

        <div className="my-12">
          <hr className="border-t border-border mb-4" />
          
          {/* Link URL display */}
          <div className="mb-8">
            <p className="text-sm text-muted-foreground">Link URL:</p>
            <a 
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sm hover:text-primary break-all"
            >
              {link.url}
            </a>
          </div>

          {/* Citation */}
          <Citation 
            title={link.title} 
            author="Kris Yotam" 
            url={`https://krisyotam.com/links/${slugifyCategory(link.category)}/${link.slug}`} 
            date={link.date} 
          />
          
          {/* Next/prev navigation */}
          <div className="flex flex-col sm:flex-row justify-between mt-8">
            {prev ? (
              <Link
                href={`/links/${slugifyCategory(prev.category)}/${prev.slug}`}
                className="text-sm text-muted-foreground hover:text-foreground mb-2 sm:mb-0"
              >
                ← {prev.title}
              </Link>
            ) : (
              <span />
            )}

            {next ? (
              <Link
                href={`/links/${slugifyCategory(next.category)}/${next.slug}`}
                className="text-sm text-muted-foreground hover:text-foreground text-right"
              >
                {next.title} →
              </Link>
            ) : (
              <span />
            )}
          </div>

          {/* Footer elements */}
          <Footer className="mt-8" />
          <LiveClock className="text-xs text-muted-foreground mt-4" />
        </div>
      </>
    );
  }

  return (
    <>
      <PostHeader
        title={link.title}
        subtitle={link.subtitle}
        start_date={link.start_date || link.date || "2025-01-01"}
        end_date={link.end_date || new Date().toISOString().split('T')[0]}
        tags={link.tags}
        category={link.category}
        status={link.status}
        confidence={link.confidence}
        importance={link.importance}
      />

      {children}

      <div className="my-12">
        <hr className="border-t border-border mb-4" />
        
        {/* Link URL display */}
        <div className="mb-8">
          <p className="text-sm text-muted-foreground">Link URL:</p>
          <a 
            href={link.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-sm hover:text-primary break-all"
          >
            {link.url}
          </a>
        </div>

        {/* Citation */}
        <Citation 
          title={link.title} 
          author="Kris Yotam" 
          url={`https://krisyotam.com/links/${slugifyCategory(link.category)}/${link.slug}`} 
          date={link.date} 
        />
        
        {/* Next/prev navigation */}
        <div className="flex flex-col sm:flex-row justify-between mt-8">
          {prev ? (
            <Link
              href={`/links/${slugifyCategory(prev.category)}/${prev.slug}`}
              className="text-sm text-muted-foreground hover:text-foreground mb-2 sm:mb-0"
            >
              ← {prev.title}
            </Link>
          ) : (
            <span />
          )}

          {next ? (
            <Link
              href={`/links/${slugifyCategory(next.category)}/${next.slug}`}
              className="text-sm text-muted-foreground hover:text-foreground text-right"
            >
              {next.title} →
            </Link>
          ) : (
            <span />
          )}
        </div>

        {/* Footer elements */}
        <Footer className="mt-8" />
        <LiveClock className="text-xs text-muted-foreground mt-4" />
      </div>
    </>
  );
}
