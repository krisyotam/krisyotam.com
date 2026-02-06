"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

// RandomBlogSection inline
function RandomBlogSection() {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    async function fetchBlog() {
      try {
        const res = await fetch("/api/data?type=blogroll");
        const data = await res.json();
        const blogs = Array.isArray(data.blogs) ? data.blogs : [];
        if (blogs.length > 0) {
          const random = Math.floor(Math.random() * blogs.length);
          setTitle(blogs[random].title || "");
          setUrl(blogs[random].url || "");
        }
      } catch (err) {
        console.error("Failed to fetch /api/blogroll", err);
        setTitle("");
        setUrl("");
      }
    }
    fetchBlog();
  }, []);

  if (!title || !url) return null;

  return (
    <div className="mb-8">
      <div
        className="flex items-center justify-between px-4 py-3 bg-muted/30 border border-border w-full"
        style={{ borderRadius: 0 }}
      >
        <span className="font-mono text-sm text-muted-foreground uppercase tracking-wider">
          Random Blog
        </span>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-serif text-lg text-foreground underline underline-offset-2 hover:text-primary transition-colors"
        >
          {title}
        </a>
      </div>
    </div>
  );
}

export default function SiteFooter({ lastUpdated, rawMarkdown }: { lastUpdated?: string; rawMarkdown?: string }) {
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
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
        }
      } catch (err) {
        console.error("Failed to fetch /api/quotes", err);
        setQuote(
          "The best way to find out if you can trust somebody is to trust them. What we know is a drop, what we don't know is an ocean."
        );
        setAuthor("Ernest Hemingway");
      }
    }
    fetchQuote();
  }, []);

  // Reading time calculation
  function getReadingTime(text: string) {
    if (!text) return "~1 min";
    // Remove markdown syntax (simple)
    const stripped = text
      .replace(/```[\s\S]*?```/g, " ") // code blocks
      .replace(/`[^`]*`/g, " ") // inline code
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1") // links
      .replace(/[#>*_\-]/g, " ") // headings, blockquotes, lists, emphasis
      .replace(/\n/g, " ") // newlines
      .replace(/\s+/g, " "); // extra spaces
    const words = stripped.trim().split(/\s+/).filter(Boolean);
    const minutes = Math.max(1, Math.round(words.length / 200));
    return `~${minutes} min`;
  }

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";
  const pfpUrl = isDark
    ? "https://krisyotam.com/doc/assets/logos/krisyotam-dark.png"
    : "https://krisyotam.com/doc/assets/logos/krisyotam-light.png";

  return (
    <footer className={`${isDark ? "bg-background" : "bg-card"} pt-2 pb-8`}>
      <div className="w-full px-0 mx-0">
        {/* Top decorative border (single horizontal line with centered diamond) */}
        <div className="flex items-center justify-center mb-4">
          <div className="flex-1 h-px bg-border"></div>  {/* left line */}
          <div className="px-4">
            <div className="w-2 h-2 bg-muted-foreground/30 rotate-45"></div>  {/* diamond */}
          </div>
          <div className="flex-1 h-px bg-border"></div>  {/* right line */}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mb-6">
          <a href="/surveys/anonymous-feedback">
            <Button
              variant="outline"
              className="rounded-none border-2 px-6 py-2 font-mono text-sm tracking-wide hover:bg-muted bg-transparent"
            >
              Send Anonymous Feedback
            </Button>
          </a>
          <a href="https://krisyotam.substack.com/" target="_blank" rel="noopener noreferrer">
            <Button
              variant="outline"
              className="rounded-none border-2 px-6 py-2 font-mono text-sm tracking-wide hover:bg-muted bg-transparent"
            >
              Subscribe to Newsletter
            </Button>
          </a>
        </div>

        {/* Quote Bento */}
        <div className="border-2 border-border bg-card p-8 mb-8 w-full">
          <div className="mb-8 flex">
            <div className="text-4xl text-muted-foreground/40 font-serif leading-none mr-2">
              "
            </div>
            <div className="flex-1">
              <blockquote className="text-lg leading-relaxed text-foreground font-serif italic mb-4">
                {quote}
              </blockquote>
              <cite className="text-sm text-muted-foreground font-sans not-italic">
                {author}
              </cite>
            </div>
            <div className="text-4xl text-muted-foreground/40 font-serif leading-none ml-2 self-end">
              "
            </div>
          </div>

          {/* Random Blog Section */}
          <RandomBlogSection />

          {/* Divider */}
          <div className="border-t border-border my-8"></div>

          {/* Author & Meta */}
          <div className="grid md:grid-cols-2 gap-8 w-full">
            <div className="w-full">
              <h3 className="font-mono text-sm uppercase tracking-wider text-muted-foreground mb-3">
                Author
              </h3>
              <div className="flex items-center gap-3 w-full">
                <img
                  src={pfpUrl}
                  alt="Kris Yotam profile"
                  className="w-16 h-16 border border-border bg-muted/50 object-cover"
                  style={{
                    background: isDark ? "#222" : "#eee",
                    borderRadius: 0,
                  }}
                />
                <div className="w-full">
                  <div className="font-medium text-foreground">Kris Yotam</div>
                  <div className="text-sm text-muted-foreground">
                    long-form stable essays
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full">
              <h3 className="font-mono text-sm uppercase tracking-wider text-muted-foreground mb-3">
                References
              </h3>
              <div className="space-y-2 w-full">
                <div className="text-sm">
                  <span className="text-muted-foreground">Last updated:</span>{" "}
                  <time className="text-foreground font-mono">{lastUpdated}</time>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Reading time:</span>{" "}
                  <span className="text-foreground font-mono">{getReadingTime(rawMarkdown || "")}</span>
                </div>
                <div className="text-sm">
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground underline underline-offset-2"
                  >
                    Similar notes →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Decorative Elements */}
        <div className="flex justify-between items-center w-full">
          <div className="w-8 h-px bg-border"></div>
          <div className="flex gap-2">
            <div className="w-1 h-1 bg-muted-foreground/30"></div>
            <div className="w-1 h-1 bg-muted-foreground/30"></div>
            <div className="w-1 h-1 bg-muted-foreground/30"></div>
          </div>
          <div className="w-8 h-px bg-border"></div>
        </div>
      </div>
    </footer>
  );
}
