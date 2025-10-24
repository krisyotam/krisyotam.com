/* app/shortform/[slug]/ShortformPageClient.tsx */

"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { LiveClock } from "@/components/live-clock";
import { PostHeader } from "@/components/post-header";
import { Footer } from "@/components/footer";
import { Citation } from "@/components/citation";

interface ShortformMeta {
  title: string;
  subtitle?: string;
  preview?: string;
  start_date: string;
  end_date?: string;
  date?: string; // fallback for compatibility
  slug: string;
  status?: "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished";
  confidence?:
    | "impossible" | "remote" | "highly unlikely" | "unlikely"
    | "possible"  | "likely"  | "highly likely"   | "certain";
  importance?: number;
}

interface Props {
  post: ShortformMeta;
  allPosts: ShortformMeta[];
  children?: React.ReactNode;
  headerOnly?: boolean;
  contentOnly?: boolean;
}

export default function ShortformPageClient({ post, allPosts, children, headerOnly, contentOnly }: Props) {
  // Global style for MDX content: inherit color, fix links, code, blockquote for dark mode
  const shortformContentStyle = `
    .shortform-content {
      font-family: "Source Serif 4", Baskerville, "Libre Baskerville",
        "Droid Serif", "Times New Roman", Times, serif, "Noto Emoji", Quivira;
      font-size: 14px;
      line-height: 1.5;
      color: inherit;
    }
    .shortform-content p {
      margin-bottom: 1rem;
    }
    .shortform-content p:last-child {
      margin-bottom: 0;
    }
    .shortform-content a {
      color: inherit;
      text-decoration: none;
      border-bottom: 1px dotted currentColor;
      transition: border-color 0.2s ease;
    }
    .shortform-content a:hover {
      border-bottom-color: currentColor;
    }
    .shortform-content code {
      font-family: "JetBrains Mono", Menlo, Monaco, Consolas, monospace;
      font-size: 0.85em;
      background: transparent;
      padding: 0.1em 0.3em;
      border-radius: 3px;
    }
    .shortform-content blockquote {
      margin: 1rem 0;
      padding: 0.5rem 1.5rem;
      font-style: italic;
      border-left: 3px solid currentColor;
      background: transparent;
    }
    .shortform-content ul,
    .shortform-content ol {
      padding-left: 1.25rem;
      margin-bottom: 1rem;
    }
    .shortform-content li {
      line-height: 1.4;
    }
  `;
  if (!post) notFound();

  /* prev / next */
  const sorted = [...allPosts].sort(
    (a, b) => {
      const aDate = (a.end_date?.trim()) ? a.end_date : a.start_date;
      const bDate = (b.end_date?.trim()) ? b.end_date : b.start_date;
      return +new Date(bDate) - +new Date(aDate);
    }
  );
  const idx  = sorted.findIndex(p => p.slug === post.slug);
  const prev = idx < sorted.length - 1 ? sorted[idx + 1] : null;
  const next = idx > 0                 ? sorted[idx - 1] : null;

  // Render only header
  if (headerOnly) {
    return (
      <div className="container max-w-[672px] mx-auto px-4">
        <PostHeader 
          className=""     
          title={post.title}
          subtitle={post.subtitle}
          start_date={post.start_date}
          end_date={post.end_date}
          tags={[]} // No tags for shortform
          category="Shortform" // Static category
          backHref="/shortform"
          backText="Shortform"
          preview={post.preview}
          status={post.status ?? "Notes"}
          confidence={post.confidence ?? "possible"}
          importance={post.importance ?? 5}
        />
      </div>
    );
  }

  // Render only content (citation, footer, etc.)
  if (contentOnly) {
    return (
      <div className="mt-8">
        <Citation 
          title={post.title}
          slug={post.slug}
          start_date={post.start_date}
          end_date={post.end_date}
          url={`https://krisyotam.com/shortform/${post.slug}`}
        />
        <LiveClock />
        <Footer />
      </div>
    );
  }

  // Render full layout (legacy)
  return (
    <>
      <style jsx global>{shortformContentStyle}</style>
      <div className="container max-w-[672px] mx-auto px-4 pt-16 pb-8">
        {/* clean page header (outside .shortform-content) ----------------------- */}
        <PostHeader 
          className=""     
          title={post.title}
          subtitle={post.subtitle}
          start_date={post.start_date}
          end_date={post.end_date}
          tags={[]} // No tags for shortform
          category="Shortform" // Static category
          backHref="/shortform"
          backText="Shortform"
          preview={post.preview}
          status={post.status ?? "Notes"}
          confidence={post.confidence ?? "possible"}
          importance={post.importance ?? 5}
        />
        {/* MDX body -------------------------------------------------------- */}
        <div className="shortform-content">{children}</div>
        <div className="mt-8">
          <Citation 
            title={post.title}
            slug={post.slug}
            start_date={post.start_date}
            end_date={post.end_date}
            url={`https://krisyotam.com/shortform/${post.slug}`}
          />
        </div>
        <LiveClock />
        <Footer />
      </div>
    </>
  );
}
