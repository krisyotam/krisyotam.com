"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { PostHeader } from "@/components/post-header";
import TableOfContents from "@/components/table-of-contents";
import MarginCard, { MarginNote } from "@/components/margin-notes";
import Footnotes from "@/components/footnotes";
import { Bibliography } from "@/components/bibliography";
import { ScriptTagger } from "@/components/script-tagger";
import { PostLatexRenderer } from "@/components/post-latex-renderer";
import { Commento } from "@/components/commento";
import RelatedPosts from "@/components/related-posts";
import { PostNotice } from "@/components/post-notice";
import LinkTags from "@/components/link-tags";
import Citation from "@/components/citation";
import { Footer } from "./(post)/components/footer";
import "./posts.css";
import "./tailwind-dark.css";
import feedData from "@/data/feed.json";

const fontImport = `
@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&display=swap');
@import url('https://fonts.googleapis.com/css2?family=MedievalSharp&display=swap');
`;

// Dynamically create custom routes map from feed data
const CUSTOM_ROUTES_MAP: Record<string, { slug: string, year: string }> = {};

// Build the custom routes map
feedData.posts.forEach(post => {
  if (post.customPath) {
    const year = new Date(post.date).getFullYear().toString();
    CUSTOM_ROUTES_MAP[post.customPath] = { 
      slug: post.slug,
      year 
    };
  }
});

// Pattern-based route mappings
const PATTERN_ROUTES = [
  {
    pattern: /^\/research\/(\d{4})\/([^/]+)$/,
    resolver: (matches: string[]) => {
      const [, year, slug] = matches;
      return { slug, year };
    }
  },
  // Add more patterns as needed
];

interface Post {
  title: string;
  date: string;
  tags: string[];
  category: string;
  slug: string;
  status: "active" | "hidden";
  preview: string;
  headings: { id: string; text: string; level: number; children?: any[] }[];
  marginNotes: MarginNote[];
  bibliography?: { id: string; author: string; title: string; year: number; publisher: string; url: string; type: string }[];
}

export default function PostsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [postData, setPostData] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Inject fonts
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = fontImport;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Fetch post data using the current URL path
  useEffect(() => {
    async function fetchPostData() {
      try {
        let slug: string | null = null;
        
        // Normalize path to handle trailing slashes consistently
        const normalizedPath = pathname.endsWith('/') && pathname !== '/' 
          ? pathname.slice(0, -1) 
          : pathname;
        
        // Check for custom route matches from feed.json
        if (CUSTOM_ROUTES_MAP[normalizedPath]) {
          slug = CUSTOM_ROUTES_MAP[normalizedPath].slug;
          console.log(`Client: Custom route matched: ${normalizedPath} → using slug: ${slug}`);
        }
        // Check for pattern-based routes
        else {
          for (const patternRoute of PATTERN_ROUTES) {
            const matches = normalizedPath.match(patternRoute.pattern);
            if (matches) {
              const result = patternRoute.resolver(matches);
              slug = result.slug;
              console.log(`Client: Pattern route matched: ${normalizedPath} → using slug: ${slug}`);
              break;
            }
          }
        }
        // Default blog path handling
        if (!slug && normalizedPath.startsWith('/blog/')) {
          const parts = normalizedPath.split('/');
          if (parts.length >= 4) {
            slug = parts[3];
          }
        }
        
        // If we found a slug, fetch the post data
        if (slug) {
          const res = await fetch(`/api/post?slug=${slug}`);
          if (res.ok) {
            const data = await res.json();
            console.log(`Post data fetched for slug: ${slug}`, data);
            setPostData(data);
          } else {
            console.error(`Failed to fetch post data for slug: ${slug}`, res.status);
          }
        }
      } catch (e) {
        console.error('Error fetching post data:', e);
      }
    }
    
    fetchPostData();
  }, [pathname]);

  // Loading indicator
  useEffect(() => {
    window.scrollTo(0, 0);
    setIsLoading(true);
    const t = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(t);
  }, [pathname]);

  return (
    <div className="relative min-h-screen bg-background text-foreground pt-16">
      {isLoading ? (
        <div className="max-w-6xl mx-auto px-4 animate-fade-in">
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="mt-4 text-sm text-muted-foreground">Loading post...</p>
          </div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto px-4 animate-fade-in">
          {/* Header */}
          <header className="mb-2 max-w-xl mx-auto px-0">
            {postData && (
              <PostHeader
                title={postData.title}
                date={postData.date}
                tags={postData.tags}
                category={postData.category}
                className="post-header"
              />
            )}
          </header>

          <div className="grid grid-cols-1 xl:grid-cols-[16rem_1fr_16rem] gap-y-6 xl:gap-x-6">
            {/* Left sidebar: Table of Contents */}
            <aside className="hidden xl:block self-start mt-4">
              <div className="sticky top-6">
                <TableOfContents headings={postData?.headings || []} key={pathname} />
              </div>
            </aside>

            {/* Main column */}
            <main className="flex-1 max-w-2xl mx-auto px-0 self-start">
              <article
                className="prose prose-sm mx-auto post-content"
                style={{ fontFamily: "'Source Serif 4', serif", marginTop: 0 }}
              >
                <LinkTags>
                  <PostLatexRenderer>
                    <ScriptTagger>{children}</ScriptTagger>
                  </PostLatexRenderer>
                </LinkTags>
              </article>

              {/* Citation */}
              {postData && (
                <section className="mt-8 mb-4" aria-label="Citation">
                  <Citation 
                    title={postData.title}
                    slug={postData.slug}
                    date={postData.date}
                    url={`https://krisyotam.com/blog/${new Date(postData.date).getFullYear()}/${postData.slug}`}
                  />
                </section>
              )}

              {/* Footnotes */}
              {postData?.marginNotes?.length > 0 && (
                <section className="mt-4 xl:hidden" aria-label="Footnotes">
                  <Footnotes notes={postData.marginNotes} />
                </section>
              )}

              {/* Bibliography */}
              {postData?.bibliography?.length > 0 && (
                <section className="mt-4" aria-label="Bibliography">
                  <Bibliography bibliography={postData.bibliography} />
                </section>
              )}

              {/* Related Posts */}
              {postData?.slug && (
                <section className="mt-4" aria-label="Related Posts">
                  <RelatedPosts slug={postData.slug} />
                </section>
              )}

              {/* Comments */}
              <section className="mt-4" aria-label="Comments">
                <Commento />
              </section>

              {/* Notice & Footer */}
              <section className="mt-4">
                <PostNotice />
              </section>
              <Footer />
            </main>

            {/* Right sidebar: Margin Notes (desktop) */}
            <aside className="hidden xl:block self-start mt-4">
              <div className="sticky top-6 space-y-4 pb-24">
                {postData?.marginNotes?.map((note) => (
                  <MarginCard key={note.id} note={note} />
                ))}
              </div>
            </aside>
          </div>
        </div>
      )}
    </div>
  );
}