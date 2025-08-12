"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { PageDescription } from "@/components/posts/typography/page-description";
import Link from "next/link";
import dynamic from "next/dynamic";

/* default page-level metadata for the header */
const defaultShortformPageData = {
  title: "Shortform",
  start_date: "2025-01-01",
  end_date: new Date().toISOString().split('T')[0], // Current date as YYYY-MM-DD
  preview: "this is a special page for twitter-esque quick takes by Kris Yotam",
  status: "In Progress" as const,
  confidence: "likely" as const,
  importance: 6,
};

interface ShortformPost {
  title: string;
  preview: string;
  start_date: string;
  end_date?: string;
  slug: string;
  status?: string;
  confidence?: string;
  importance?: number;
  state?: string;
}

interface ShortformClientPageProps {
  posts: ShortformPost[];
}

// Dynamically import MDX files to render content in boxes
const importMDX = (slug: string) => {
  try {
  return dynamic(() => import(`@/app/(content)/shortform/content/${slug}.mdx`), {
      loading: () => (
        <div className="flex justify-center items-center h-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-zinc-100"></div>
        </div>
      ),
      ssr: false,
    });
  } catch (error) {
    console.error(`Failed to import MDX for slug: ${slug}`, error);
    return () => <div>Content not found</div>;
  }
};

export default function ShortformClientPage({ posts }: ShortformClientPageProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter posts based on search query
  const filteredPosts = posts
    .map((post, idx) => ({ ...post, _originalIndex: idx }))
    .filter((post) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.preview.toLowerCase().includes(q);
      return matchesSearch;
    })
    .sort((a, b) => {
      const aDate = (a.end_date?.trim()) ? a.end_date : a.start_date;
      const bDate = (b.end_date?.trim()) ? b.end_date : b.start_date;
      const dateDiff = new Date(bDate).getTime() - new Date(aDate).getTime();
      if (dateDiff !== 0) return dateDiff;
      // If dates are equal, show the post that appears later in the JSON (higher index) above
      return b._originalIndex - a._originalIndex;
    });

  // Helper to format date as "Month DD, YYYY"
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long", 
      day: "numeric"
    });
  }

  const ShortformFeed = () => (
    <div className="space-y-6">
      {filteredPosts.map((post) => {
        const MDXContent = importMDX(post.slug);
        const displayDate = post.end_date || post.start_date;
        
        return (
          <article
            key={post.slug}
            className="relative border border-border bg-card text-card-foreground mt-5 px-2.5 pt-5 pb-2.5 transition-colors rounded-none hover:bg-muted dark:hover:bg-muted"
          >
            <label
              className="absolute border border-border bg-card text-card-foreground font-mono font-semibold text-[0.97em] leading-5 px-1.5 rounded-none"
              style={{ top: '-10px', left: '10px' }}
            >
              {post.title}
            </label>
            {/* Post content */}
            <div className="shortform-content mb-4">
              <MDXContent />
            </div>
            {/* Post footer with date and permalink */}
            <div className="flex items-center justify-between pt-4 border-t border-border/50">
              <time className="text-xs text-muted-foreground">
                {formatDate(displayDate)}
              </time>
              <Link 
                href={`/shortform/${post.slug}`}
                className="text-xs text-muted-foreground hover:text-foreground border-b border-dotted border-muted-foreground/50 hover:border-foreground transition-colors"
              >
                Permalink
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );

  return (
    <>
      <style jsx global>{`
        .shortform-container {
          font-family: 'Geist', sans-serif;
        }
        
        /* Shortform-specific content styling */
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
        /* .mini and .mini label are now styled inline with Tailwind classes above */
      `}</style>

      <div className="shortform-container container max-w-[672px] mx-auto px-4 pt-16 pb-8">
        <PageHeader {...defaultShortformPageData} />

        {/* Search bar */}
        <div className="mb-6">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search shortform posts..." 
              className="w-full h-9 px-3 py-2 border rounded-none text-sm bg-background hover:bg-secondary/50 focus:outline-none focus:bg-secondary/50"
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
            />
          </div>
        </div>

        {/* Shortform Feed */}
        <ShortformFeed />

        {filteredPosts.length === 0 && (
          <div className="text-muted-foreground text-sm mt-6 text-center">No posts found matching your search.</div>
        )}

        {/* PageDescription component */}
        <PageDescription
          title="About Shortform"
          description="This is my shortform section - a Twitter-style feed of brief thoughts, micro-posts, and quick observations. Each post is a standalone piece of content designed for quick consumption and sharing."
        />
      </div>
    </>
  );
}
