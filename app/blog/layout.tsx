"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { PostHeader } from "@/components/post-header";
import TableOfContents from "@/components/table-of-contents";
import MarginCard, { MarginNote } from "@/components/margin-notes";
import Footnotes from "@/components/footnotes";
import { Bibliography } from "@/components/bibliography";
import { BentoFooter } from "@/components/bento-footer";
import { ScriptTagger } from "@/components/script-tagger";
import { PostLatexRenderer } from "@/components/post-latex-renderer";
import { Commento } from "@/components/commento";
import RelatedPosts from "@/components/related-posts";
import { PostNotice } from "@/components/post-notice";
import LinkTags from "@/components/link-tags";
import Citation from "@/components/citation";

const fontImport = `
@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&display=swap');
@import url('https://fonts.googleapis.com/css2?family=MedievalSharp&display=swap');
`;

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

  // Fetch post data
  useEffect(() => {
    async function fetchPostData() {
      try {
        const parts = pathname.split('/');
        if (parts[1] === 'blog' && parts.length >= 4) {
          const slug = parts[3];
          const res = await fetch(`/api/post?slug=${slug}`);
          if (res.ok) setPostData(await res.json());
        }
      } catch (e) {
        console.error(e);
      }
    }
    if (pathname.startsWith('/blog/')) fetchPostData();
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
              <footer className="mt-4">
                <BentoFooter />
              </footer>
            </main>

            {/* Right sidebar: Margin Notes (desktop) */}
            <aside className="hidden xl:block self-start mt-4">
              <div className="sticky top-6 space-y-4 pb-24">
                {postData?.marginNotes.map((note) => (
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
