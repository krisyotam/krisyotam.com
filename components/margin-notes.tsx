"use client";

import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MarginNote {
  id: string;
  title: string;
  content: string;
  index: number;
  sourceName?: string;
  sourceLink?: string;
  priority?: number;
}

interface MarginCardProps {
  className?: string;
  note: MarginNote;
}

export function MarginCard({ className, note }: MarginCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [canExpand, setCanExpand] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const CHARACTER_LIMIT = 550;

  // Debugging data
  useEffect(() => {
    console.log("📝 MARGIN CARD COMPONENT: Received margin note:", note);
  }, [note]);

  // Determine if content needs expand/collapse
  useEffect(() => {
    if (note.content.length > CHARACTER_LIMIT) {
      setCanExpand(true);
    } else if (contentRef.current) {
      const isOverflowing =
        contentRef.current.scrollHeight > contentRef.current.clientHeight;
      setCanExpand(isOverflowing);
    }
  }, [note.content]);

  // Truncated content helper
  const getTruncatedContent = () => {
    if (note.content.length <= CHARACTER_LIMIT || isExpanded) {
      return note.content;
    }
    const lastSpace = note.content.lastIndexOf(" ", CHARACTER_LIMIT);
    const truncateAt = lastSpace > 0 ? lastSpace : CHARACTER_LIMIT;
    return note.content.substring(0, truncateAt) + "...";
  };

  return (
    <div className="relative" data-note-index={note.index}>
      {/* Index number */}
      <div
        className="absolute -left-6 -top-2 w-6 h-6 flex items-center justify-center text-sm font-medium text-muted-foreground"
        style={{ fontFamily: "EB Garamond, serif" }}
      >
        {note.index}
      </div>

      <Card
        className={cn(
          "w-[320px] rounded-none bg-card text-card-foreground transition-all duration-300",
          className
        )}
      >
        {/* Top border line */}
        <div className="w-full h-px bg-border" />

        <div className="p-4 flex flex-col">
          {/* Title in source-style aesthetic */}
          <div
            className="text-xs text-muted-foreground mb-3"
            style={{
              fontFamily: "EB Garamond, serif",
              borderBottom: "1px dotted currentColor",
              display: "inline-block",
              paddingBottom: "2px",
            }}
          >
            {note.title}
          </div>

          {/* Content container */}
          <div
            ref={contentRef}
            className={cn(
              "prose-sm transition-all duration-300 overflow-hidden",
              isExpanded ? "max-h-none" : "max-h-[320px]"
            )}
            style={{
              fontFamily: "EB Garamond, serif",
              fontSize: "0.95rem",
              lineHeight: "1.6",
            }}
          >
            <p>{getTruncatedContent()}</p>
          </div>

          {/* Expand/Collapse button */}
          {canExpand && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 w-full text-xs text-muted-foreground hover:text-foreground flex items-center justify-center gap-1"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-3 w-3" /> Show less
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3" /> Read more
                </>
              )}
            </Button>
          )}

          {/* Source link at bottom */}
          {note.sourceName && note.sourceLink && (
            <div
              className="text-xs text-muted-foreground mt-4 pt-2 border-t border-dotted self-end"
              style={{ fontFamily: "EB Garamond, serif" }}
            >
              <span className="mr-1">Source:</span>
              <a
                href={note.sourceLink}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground ml-1"
              >
                {note.sourceName}
              </a>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

export default MarginCard;
