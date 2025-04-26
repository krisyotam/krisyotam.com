"use client";

import React, { ReactNode, useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { getDefinitionFromOED } from "@/lib/getDefinitionFromOED";

interface DefineProps {
  children: string;
  className?: string;
}

export default function Define({ children, className }: DefineProps) {
  const [definition, setDefinition] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const word = children.trim();

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const def = await getDefinitionFromOED(word);
      if (mounted) {
        setDefinition(def);
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [word]);

  return (
    <div
      className="relative inline-block"
      ref={ref}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <span className={`cursor-help underline decoration-dotted ${className ?? ""}`}>{children}</span>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute bottom-full left-0 mb-2 ml-4 w-80 bg-popover text-popover-foreground rounded-lg shadow-lg border border-border overflow-hidden pointer-events-auto z-50"
        >
          <div className="flex items-center justify-between px-3 py-2 bg-muted/50 border-b border-border">
            <div className="text-sm font-semibold truncate">{word}</div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <div className="p-3 max-h-40 overflow-y-auto text-sm">
            {loading
              ? "Loading definition..."
              : definition
              ? definition
              : "Definition not found."}
          </div>
        </motion.div>
      )}
    </div>
  );
}
