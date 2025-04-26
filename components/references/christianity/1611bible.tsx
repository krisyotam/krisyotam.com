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

export default function Bible({ children }: BibleProps) {
  const [verses, setVerses] = useState<VerseResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

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

  // Fetch verses on open
  useEffect(() => {
    let mounted = true;
    if (isOpen) {
      getVerseFromBible(children).then((results) => {
        if (mounted) setVerses(results);
      });
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

  return (
    <div className="relative inline-block" onMouseEnter={() => setIsOpen(true)}>
      <span className="cursor-help underline text-primary">{children}</span>

      {isOpen && (
        <div className="fixed inset-0 z-50 pointer-events-none">
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

            <div className="p-4 overflow-y-auto h-full pb-8">
              {groups.map((grp, gIdx) => {
                const startIdx = groups
                  .slice(0, gIdx)
                  .reduce((sum, prev) => sum + prev.count, 0);
                const slice = verses.slice(startIdx, startIdx + grp.count);

                return (
                  <div key={grp.raw} className="mb-4">
                    <div className="font-semibold mb-2">{grp.label}</div>
                    {slice.map((v, i) => (
                      <p key={i} className="mb-1">
                        <span className="font-semibold">{v.reference}</span> {v.text}
                      </p>
                    ))}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
