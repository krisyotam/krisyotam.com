"use client";

import React, { useState, useEffect, useRef } from "react";
import { Minimize2, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TableOfContentsItem {
  id: string;
  text: string;
  level: number;
  number?: string;
}

interface TableOfContentsProps {
  /**
   * If provided, skips DOM scan and uses these headings instead
   */
  headings?: TableOfContentsItem[];
  className?: string;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ headings = [], className }) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [numberedHeadings, setNumberedHeadings] = useState<TableOfContentsItem[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Scan or build headings on mount and whenever `headings` prop changes
  useEffect(() => {
    let items: TableOfContentsItem[] = [];

    if (headings.length > 0) {
      items = headings.filter((h) => h.level >= 1 && h.level <= 4);
    } else if (typeof document !== "undefined") {
      const els = Array.from(
        document.querySelectorAll<HTMLHeadingElement>(
          ".post-content h1, .post-content h2, .post-content h3, .post-content h4"
        )
      );
      items = els.map((el, idx) => {
        let id = el.id;
        if (!id) {
          id = `heading-${idx}`;
          el.id = id;
        }
        return {
          id,
          text: el.textContent?.trim() ?? "",
          level: Number(el.tagName.charAt(1)),
        };
      });
    }

    if (items.length > 0) {
      setNumberedHeadings(addHierarchicalNumbering(items));
    }
  }, [headings]);

  // Highlight active heading
  useEffect(() => {
    observerRef.current?.disconnect();
    if (numberedHeadings.length === 0) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0% 0% -80% 0%" }
    );

    numberedHeadings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) obs.observe(el);
    });

    observerRef.current = obs;
    return () => obs.disconnect();
  }, [numberedHeadings]);

  // Add hierarchical numbering up to 4 levels
  const addHierarchicalNumbering = (items: TableOfContentsItem[]) => {
    const counters = [0, 0, 0, 0];
    return items.map((item) => {
      const lvl = item.level;
      // reset deeper levels
      for (let i = lvl; i < counters.length; i++) counters[i] = 0;
      counters[lvl - 1]++;
      const number = counters.slice(0, lvl).join(".");
      return { ...item, number };
    });
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveId(id);
    }
  };

  const toggleMinimize = () => setIsMinimized((v) => !v);

  if (numberedHeadings.length === 0) return null;

  if (isMinimized) {
    return (
      <div className={cn("bg-card border border-border p-2 sticky top-8", className)}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium">TOC</span>
          <button type="button" onClick={toggleMinimize} className="p-1">
            <Maximize2 className="h-3 w-3" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "bg-card border border-border p-4 sticky top-8 overflow-y-auto",
        "max-h-[calc(100vh-4rem)]",
        className
      )}
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium">Table of Contents</h3>
        <button type="button" onClick={toggleMinimize} className="p-1">
          <Minimize2 className="h-4 w-4" />
        </button>
      </div>
      <ul className="space-y-1">
        {numberedHeadings.map((h) => (
          <li key={h.id} style={{ paddingLeft: `${(h.level - 1) * 12}px` }}>
            <button
              type="button"
              onClick={() => scrollToSection(h.id)}
              className={cn(
                "text-sm py-1 w-full text-left truncate flex",
                activeId === h.id ? "font-medium" : "text-muted-foreground"
              )}
            >
              <span className="inline-block w-10 flex-shrink-0">{h.number}.</span>
              <span className="truncate">{h.text}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TableOfContents;
