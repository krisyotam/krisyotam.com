"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, useMotionValue } from "framer-motion";
import { X } from "lucide-react";
import { getVerseFromBible, VerseResult } from "@/lib/getVerseFromBible";

interface BibleProps {
  children: string;
}

interface RefGroup {
  raw: string;
  label: string;
  count: number;
}

interface StrongsEntry {
  greek_unicode?: string;
  lemma?: string;
  transliteration?: string;
  greek_translit?: string;
  strongs_def?: string;
  translation?: string;
}

// Dynamic fetch URLs for Strong's dictionaries
const STRONGS_GREEK_URL = "https://raw.githubusercontent.com/krisyotam/strongs/main/strongs-greek.json";
const STRONGS_HEBREW_URL = "https://raw.githubusercontent.com/krisyotam/strongs/main/strongs-hebrew.json";

let strongsGreek: Record<string, StrongsEntry> | null = null;
let strongsHebrew: Record<string, StrongsEntry> | null = null;

export default function Bible({ children }: BibleProps) {
  const [verses, setVerses] = useState<VerseResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [hoveredStrongs, setHoveredStrongs] = useState<string | null>(null);

  // Build reference groups
  const refParts = useMemo(
    () => children.split(",").map((r) => r.trim()).filter(Boolean),
    [children]
  );

  const groups: RefGroup[] = useMemo(
    () =>
      refParts.map((part) => {
        const m = part.match(/^(.+?)\s+(\d+):(\d+)(?:-(\d+))?$/i);
        let count = 0;
        if (m) {
          const start = parseInt(m[3], 10);
          const end = m[4] ? parseInt(m[4], 10) : start;
          count = end - start + 1;
        }
        const rawBook = part.replace(/\s+\d.*$/, "");
        const label = rawBook
          .split(/\s+/)
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(" ");
        return { raw: part, label, count };
      }),
    [refParts]
  );

  // Fetch verses + Strong's on open
  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        setIsLoading(true);
        setError(null);

        // Load Strong's dictionaries first
        if (!strongsGreek) {
          try {
            const res = await fetch(STRONGS_GREEK_URL);
            if (!res.ok) throw new Error(`Failed to load Strong's Greek: ${res.status}`);
            strongsGreek = await res.json();
          } catch (error) {
            strongsGreek = {}; // Empty object as fallback
          }
        }
        
        if (!strongsHebrew) {
          try {
            const res = await fetch(STRONGS_HEBREW_URL);
            if (!res.ok) throw new Error(`Failed to load Strong's Hebrew: ${res.status}`);
            strongsHebrew = await res.json();
          } catch (error) {
            strongsHebrew = {}; // Empty object as fallback
          }
        }
        
        if (mounted) {
          try {
            const results = await getVerseFromBible(children);
            
            if (results.length === 0) {
              setError("No verses found for the given reference. Please check the format.");
            } else {
              setVerses(results);
            }
          } catch (verseError) {
            setError(`Failed to load verses: ${verseError instanceof Error ? verseError.message : String(verseError)}`);
          }
        }
      } catch (error) {
        if (mounted) {
          setError(`Failed to load Bible data: ${error instanceof Error ? error.message : String(error)}`);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    if (isOpen) {
      loadData();
    } else {
      // Reset when closing
      setError(null);
    }

    return () => {
      mounted = false;
    };
  }, [isOpen, children]);

  // Position modal center
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  useEffect(() => {
    if (isOpen) {
      const w = 400;
      const h = 300;
      x.set((window.innerWidth - w) / 2);
      y.set((window.innerHeight - h) / 3);
    }
  }, [isOpen, x, y]);

  // Fetch Strong's definition for a superscript
  function getStrongsInfo(id: string) {
    if (!id) return null;
    
    try {
      if (id.startsWith("G")) {
        const key = id.slice(1).padStart(5, "0"); // G1 -> 00001
        return strongsGreek ? strongsGreek[key] : null;
      } else if (id.startsWith("H")) {
        return strongsHebrew ? strongsHebrew[id] : null;
      }
    } catch (error) {
      // Silently handle error
    }
    return null;
  }

  // Render verse text with interactive superscripts
  function renderVerseText(text: string) {
    if (!text) {
      return <span className="text-gray-400 italic">No text available</span>;
    }
    
    try {
      const parts = text.split(/(<sup>.*?<\/sup>)/g);
      return parts.map((part, idx) => {
        if (part.startsWith("<sup>") && part.endsWith("</sup>")) {
          const strongsId = part.replace(/<\/?sup>/g, "");
          const info = getStrongsInfo(strongsId);

          return (
            <span
              key={idx}
              className="text-primary cursor-help relative"
              onMouseEnter={() => setHoveredStrongs(strongsId)}
              onMouseLeave={() => setHoveredStrongs(null)}
            >
              <sup>{strongsId}</sup>
              {hoveredStrongs === strongsId && info && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-56 bg-background text-foreground text-xs rounded-md shadow-lg p-2 border z-10">
                  <div className="font-semibold mb-1">{info.greek_unicode || info.lemma || "Unknown"}</div>
                  <div className="italic mb-1">{info.transliteration || info.greek_translit || "No transliteration"}</div>
                  <div>{info.strongs_def || info.translation || "No definition available"}</div>
                </div>
              )}
            </span>
          );
        } else {
          return <span key={idx}>{part}</span>;
        }
      });
    } catch (error) {
      return <span className="text-red-500">Error rendering text</span>;
    }
  }

  return (
    <span className="relative inline-block" onMouseEnter={() => setIsOpen(true)}>
      <span className="cursor-help underline text-primary">{children}</span>

      {isOpen && (
        <span className="fixed inset-0 z-50 pointer-events-none block">
          <motion.div
            ref={modalRef}
            drag
            dragMomentum={false}
            dragConstraints={{ top: 0, left: 0, right: window.innerWidth, bottom: window.innerHeight }}
            style={{ x, y }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute w-[400px] h-[300px] bg-popover text-popover-foreground rounded-lg shadow-lg border border-border overflow-hidden pointer-events-auto"
          >
            <div className="flex items-center justify-between p-2 bg-muted/50 border-b border-border">
              <div className="text-sm font-medium">1611 KJV</div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-4 overflow-y-auto h-[calc(300px-40px)]">
              {isLoading ? (
                <div className="flex flex-col justify-center items-center h-full">
                  <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin mb-2"></div>
                  <div className="text-sm text-muted-foreground">Loading Bible data...</div>
                </div>
              ) : error ? (
                <div className="text-red-500 text-sm p-4 text-center">
                  <p>{error}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Please check the Bible reference format (e.g., "John 3:16" or "Genesis 1:1-3")
                  </p>
                </div>
              ) : (
                <>
                  {groups.map((grp, gIdx) => {
                    const startIdx = groups
                      .slice(0, gIdx)
                      .reduce((sum, prev) => sum + prev.count, 0);
                    const slice = verses.slice(startIdx, startIdx + grp.count);

                    return (
                      <div key={grp.raw} className="mb-4">
                        <div className="font-semibold mb-2 pb-1 border-b border-border/50">{grp.label}</div>
                        {slice.length > 0 ? (
                          slice.map((v, i) => (
                            <p key={i} className="mb-2 text-sm leading-relaxed">
                              <span className="font-semibold text-primary">{v.reference}</span>{" "}
                              <span className="text-foreground">{renderVerseText(v.text)}</span>
                            </p>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">No verses found for this reference.</p>
                        )}
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </motion.div>
        </span>
      )}
    </span>
  );
}
