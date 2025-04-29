"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue } from "framer-motion";
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
  const modalRef = useRef<HTMLDivElement>(null);

  const word = children.trim();

  // motion values for dragging
  const x = useMotionValue(0);
  const y = useMotionValue(0);

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

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block" ref={modalRef}>
      <span
        className={`cursor-help underline decoration-dotted ${className ?? ""}`}
        onMouseEnter={() => setIsOpen(true)}
      >
        {children}
      </span>

      {isOpen && (
        <motion.div
          ref={modalRef}
          drag
          dragMomentum={false}
          dragConstraints={{
            top: 0,
            left: 0,
            right: window.innerWidth - 320,
            bottom: window.innerHeight - 300,
          }}
          style={{ x, y }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="absolute bottom-full left-0 mb-2 ml-4 w-80 bg-popover text-popover-foreground rounded-lg shadow-lg border border-border overflow-hidden pointer-events-auto z-50"
        >
          {/* Header with word and X button */}
          <div className="flex items-center justify-between px-3 py-2 bg-muted/50 border-b border-border cursor-move">
            <div className="text-sm font-semibold truncate">{word}</div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Scrollable content */}
          <div className="p-3 max-h-60 overflow-y-auto text-sm">
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
