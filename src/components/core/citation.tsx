"use client";

import { useState } from "react";

interface CitationProps {
  title: string;
  slug?: string;
  start_date?: string;
  end_date?: string;
  date?: string;
  url: string;
  author?: string;
}

export function Citation({ title, slug, start_date, end_date, date, url, author }: CitationProps) {
  const [copiedHuman, setCopiedHuman] = useState(false);
  const [copiedBib, setCopiedBib] = useState(false);

  const displayDate = end_date || start_date || date || new Date().toISOString();
  const d = new Date(displayDate);
  const year = d.getFullYear();
  const month = d.toLocaleString("default", { month: "short" });

  const authorName = author || "Yotam, Kris";
  const journal = "krisyotam.com";

  const normalizedUrl = url
    ? url.replace(/http:\/\/localhost:3000/g, "https://krisyotam.com")
         .replace(/http:\/\/127.0.0.1:3000/g, "https://krisyotam.com")
    : "https://krisyotam.com";

  const humanCitation = `${authorName}. (${month} ${year}). ${title}. ${journal}. ${normalizedUrl}`;

  const key = slug ? `yotam${year}${slug}` : `yotam${year}${title.toLowerCase().replace(/\s+/g, "-")}`;
  const bibtex = [
    `@article{${key},`,
    `  title   = "${title}",`,
    `  author  = "${authorName}",`,
    `  journal = "${journal}",`,
    `  year    = "${year}",`,
    `  month   = "${month}",`,
    `  url     = "${normalizedUrl}"`,
    `}`,
  ].join("\n");

  const copyText = async (text: string, isHuman: boolean) => {
    try {
      await navigator.clipboard.writeText(text);
      if (isHuman) {
        setCopiedHuman(true);
        setTimeout(() => setCopiedHuman(false), 2000);
      } else {
        setCopiedBib(true);
        setTimeout(() => setCopiedBib(false), 2000);
      }
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <article className="border border-border">
      {/* Header strip */}
      <div className="flex items-stretch border-b border-border">
        <div className="w-16 flex items-center justify-center px-2 py-2 border-r border-border bg-muted/30 flex-shrink-0">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Citation</span>
        </div>
        <div className="flex-1 flex items-center px-3 py-2">
          <span className="text-xs text-muted-foreground">{authorName} &middot; {month} {year}</span>
        </div>
      </div>

      {/* Human-readable citation */}
      <div className="flex items-stretch border-b border-border">
        <button
          onClick={() => copyText(humanCitation, true)}
          className="w-16 flex items-center justify-center px-2 py-2 border-r border-border bg-muted/30 hover:bg-muted/50 transition-colors flex-shrink-0"
          aria-label="Copy human citation"
        >
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground whitespace-nowrap">
            {copiedHuman ? "Copied" : "Cite"}
          </span>
        </button>
        <div className="flex-1 px-3 py-2">
          <p className="text-sm text-foreground">{humanCitation}</p>
        </div>
      </div>

      {/* BibTeX */}
      <div className="flex items-stretch">
        <button
          onClick={() => copyText(bibtex, false)}
          className="w-16 flex items-start justify-center px-2 py-2 border-r border-border bg-muted/30 hover:bg-muted/50 transition-colors flex-shrink-0"
          aria-label="Copy BibTeX"
        >
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground whitespace-nowrap">
            {copiedBib ? "Copied" : "BibTeX"}
          </span>
        </button>
        <div className="flex-1 px-3 py-2 overflow-x-auto">
          <pre className="font-mono text-xs text-foreground whitespace-pre">{bibtex}</pre>
        </div>
      </div>
    </article>
  );
}

export default Citation;
