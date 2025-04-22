"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clipboard, Check } from "lucide-react";

interface CitationProps {
  title: string;
  slug: string;
  date: string; // ISO string ("YYYY-MM-DD")
  url: string;
}

export function Citation({ title, slug, date, url }: CitationProps) {
  const [copiedHuman, setCopiedHuman] = useState(false);
  const [copiedBib, setCopiedBib] = useState(false);

  // Parse date
  const d = new Date(date);
  const year = d.getFullYear();
  const month = d.toLocaleString("default", { month: "short" });

  const author = "Yotam, Kris";
  const journal = "krisyotam.com";

  // Human-readable citation
  const humanCitation = `${author}. (${month} ${year}). ${title}. ${journal}. ${url}`;

  // BibTeX key & entry
  const key = `yotam${year}${slug}`;
  const bibtex = [
    `@article{${key},`,
    `  title   = "${title}",`,
    `  author  = "${author}",`,
    `  journal = "${journal}",`,
    `  year    = "${year}",`,
    `  month   = "${month}",`,
    `  url     = "${url}"`,
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
    <Card className="relative max-w-2xl mx-auto p-4 bg-card text-card-foreground border-border rounded-none">
      <h3 className="text-sm font-medium mb-4">Citation</h3>

      {/* Human-readable */}
      <div className="relative mb-3">
        <p className="text-xs text-muted-foreground mb-1">Cited as:</p>
        <div className="border-l-2 border-muted pl-4 pr-8 py-2">
          <p className="text-sm">{humanCitation}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => copyText(humanCitation, true)}
          className="absolute top-2 right-2 p-1"
          aria-label="Copy human citation"
        >
          {copiedHuman ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Clipboard className="h-4 w-4" />
          )}
        </Button>
      </div>

      <p className="text-center text-xs text-muted-foreground my-2">Or</p>

      {/* BibTeX */}
      <div className="relative">
        <pre className="language-bibtex whitespace-pre-wrap font-mono text-sm bg-muted p-3 rounded">
          <code>{bibtex}</code>
        </pre>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => copyText(bibtex, false)}
          className="absolute top-2 right-2 p-1"
          aria-label="Copy BibTeX"
        >
          {copiedBib ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Clipboard className="h-4 w-4" />
          )}
        </Button>
      </div>
    </Card>
  );
}

export default Citation;
