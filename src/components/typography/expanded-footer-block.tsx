/*
+------------------+----------------------------------------------------------+
| FILE             | expanded-footer-block.tsx                                |
| ROLE             | Site-wide expanded footer with quote, blogroll, reading  |
|                  | time, and action links                                   |
| OWNER            | Kris Yotam                                               |
| CREATED          | 2025-12-29                                               |
| UPDATED          | 2026-03-02                                               |
+------------------+----------------------------------------------------------+
| @type component                                                             |
| @path src/components/typography/expanded-footer-block.tsx                   |
+------------------+----------------------------------------------------------+
| SUMMARY                                                                     |
| Cell-strip footer block rendered on content detail pages and the 404 page.  |
| Fetches a random quote and blogroll entry. Displays author info, last       |
| updated date, and reading time (computed from wordCount prop via            |
| mdx-wordcount.ts at 200 wpm, with seconds for short content).              |
+-----------------------------------------------------------------------------+
*/

"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function SiteFooter({ lastUpdated, rawMarkdown, wordCount }: { lastUpdated?: string; rawMarkdown?: string; wordCount?: number }) {
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [character, setCharacter] = useState("");
  const [source, setSource] = useState("");
  const [blogTitle, setBlogTitle] = useState("");
  const [blogUrl, setBlogUrl] = useState("");
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    async function fetchQuote() {
      try {
        const res = await fetch("/api/reference?type=quotes");
        const data = await res.json();
        if (Array.isArray(data.quotes) && data.quotes.length > 0) {
          const q = data.quotes[Math.floor(Math.random() * data.quotes.length)];
          setQuote(q.text || q.quote || "");
          setAuthor(q.author || "Unknown");
          setCharacter(q.character || "");
          setSource(q.source || "");
        }
      } catch (err) {
        console.error("Failed to fetch /api/quotes", err);
        setQuote(
          "The best way to find out if you can trust somebody is to trust them."
        );
        setAuthor("Ernest Hemingway");
      }
    }
    fetchQuote();
  }, []);

  useEffect(() => {
    async function fetchBlog() {
      try {
        const res = await fetch("/api/data?type=blogroll");
        const data = await res.json();
        const blogs = Array.isArray(data.blogs) ? data.blogs : [];
        if (blogs.length > 0) {
          const random = Math.floor(Math.random() * blogs.length);
          setBlogTitle(blogs[random].title || "");
          setBlogUrl(blogs[random].url || "");
        }
      } catch (err) {
        console.error("Failed to fetch /api/blogroll", err);
      }
    }
    fetchBlog();
  }, []);

  function formatReadingTime(words: number) {
    if (words === 0) return "—";
    const totalSeconds = Math.round((words / 200) * 60);
    if (totalSeconds < 60) return `~${totalSeconds}s`;
    const minutes = Math.max(1, Math.round(words / 200));
    return `~${minutes} min`;
  }

  function getReadingTime(text: string) {
    if (!text) return "—";
    const stripped = text
      .replace(/```[\s\S]*?```/g, " ")
      .replace(/`[^`]*`/g, " ")
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")
      .replace(/[#>*_\-]/g, " ")
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ");
    const words = stripped.trim().split(/\s+/).filter(Boolean);
    return formatReadingTime(words.length);
  }

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";
  const pfpUrl = isDark
    ? "https://krisyotam.com/doc/assets/logos/krisyotam-dark.png"
    : "https://krisyotam.com/doc/assets/logos/krisyotam-light.png";

  const attribution = character
    ? `${character} — ${author}`
    : author;

  return (
    <footer className="pb-1">
      <article className="border border-border">
        {/* Row 1: Quote header */}
        <div className="flex items-stretch border-b border-border">
          <div className="w-16 flex items-center justify-center px-2 py-2 border-r border-border bg-muted/30 flex-shrink-0">
            <span className="text-lg text-muted-foreground/50 font-serif leading-none">&ldquo;</span>
          </div>
          <div className="flex-1 flex items-center px-3 py-2">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Quote of the moment</span>
          </div>
        </div>

        {/* Row 2: Quote body + attribution */}
        <div className="flex items-stretch border-b border-border">
          <div className="w-16 flex-shrink-0 border-r border-border" />
          <div className="flex-1 px-3 py-3">
            <blockquote className="text-sm leading-relaxed text-foreground font-serif italic mb-2">
              {quote}
            </blockquote>
            <div className="text-xs text-muted-foreground">
              — {character ? <span className="text-foreground">{character}</span> : <span className="text-foreground">{author}</span>}
              {character && <span>{`, written by ${author}`}</span>}
              {source && <span>{` (${source})`}</span>}
            </div>
          </div>
        </div>

        {/* Row 3: Random blog */}
        {blogTitle && blogUrl && (
          <div className="flex items-stretch border-b border-border">
            <div className="w-16 flex items-center justify-center px-2 py-2 border-r border-border bg-muted/30 flex-shrink-0">
              <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Blog</span>
            </div>
            <a
              href={blogUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center px-3 py-2 text-sm text-foreground hover:bg-muted/30 transition-colors"
            >
              {blogTitle}
            </a>
          </div>
        )}

        {/* Row 4: Author + References */}
        <div className="flex items-stretch border-b border-border">
          <div className="w-1/2 flex items-stretch border-r border-border">
            <div className="w-16 border-r border-border overflow-hidden bg-muted/20 flex-shrink-0">
              <img
                src={pfpUrl}
                alt="Kris Yotam"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center px-3 py-3">
              <div>
                <div className="text-sm font-medium text-foreground">Kris Yotam</div>
                <div className="text-xs text-muted-foreground">long-form stable essays</div>
              </div>
            </div>
          </div>
          <div className="w-1/4 flex items-center px-3 py-3 border-r border-border">
            <div>
              <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Updated</div>
              <div className="text-xs font-mono text-foreground">{lastUpdated || "—"}</div>
            </div>
          </div>
          <div className="w-1/4 flex items-center px-3 py-3">
            <div>
              <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Reading time</div>
              <div className="text-xs font-mono text-foreground">
                {wordCount != null
                  ? formatReadingTime(wordCount)
                  : getReadingTime(rawMarkdown || "")}
              </div>
            </div>
          </div>
        </div>

        {/* Row 5: Actions — same 50/25/25 split */}
        <div className="flex items-stretch">
          <a
            href="/surveys/anonymous-feedback"
            className="w-1/2 flex items-center justify-center px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors border-r border-border"
          >
            Anonymous Feedback
          </a>
          <a
            href="https://krisyotam.substack.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-1/4 flex items-center justify-center px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors border-r border-border"
          >
            Newsletter
          </a>
          <a
            href="#"
            className="w-1/4 flex items-center justify-center px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
          >
            Similar notes
          </a>
        </div>
      </article>
    </footer>
  );
}
