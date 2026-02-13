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
  const [constraints, setConstraints] = useState({ top: 0, left: 0, right: 0, bottom: 0 });

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

  // Calculate drag constraints based on screen boundaries
  useEffect(() => {
    if (isOpen && modalRef.current) {
      // Get the modal element and its position
      const modalElement = modalRef.current;
      const modalRect = modalElement.getBoundingClientRect();
      
      // Calculate constraints relative to the window
      setConstraints({
        // Allow dragging up to the top of the screen
        top: -modalRect.top,
        // Allow dragging left to the left edge of the screen
        left: -modalRect.left,
        // Allow dragging right to the right edge of the screen
        right: window.innerWidth - modalRect.left - modalRect.width,
        // Allow dragging down to the bottom edge of the screen
        bottom: window.innerHeight - modalRect.top - modalRect.height,
      });
    }
  }, [isOpen]);

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
    <span className="relative inline">
      <span
        className={`cursor-help underline decoration-dotted ${className ?? ""}`}
        onMouseEnter={() => setIsOpen(true)}
      >
        {children}
      </span>

      {isOpen && (
        <span className="fixed inset-0 z-[200] pointer-events-none">
          <motion.div
            ref={modalRef}
            drag
            dragMomentum={false}
            dragConstraints={{ top: 0, left: 0, right: window.innerWidth - 320, bottom: window.innerHeight - 300 }}
            style={{ x, y }}
            initial={{ opacity: 0, scale: 0.95, x: window.innerWidth / 2 - 160, y: window.innerHeight / 3 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute w-80 bg-popover text-popover-foreground rounded-lg shadow-lg border border-border overflow-hidden pointer-events-auto"
          >
            {/* Header with word and X button */}
            <div className="flex items-center justify-between px-3 py-2 bg-muted/50 border-b border-border cursor-move">
              <span className="text-sm font-semibold truncate">{word}</span>
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
        </span>
      )}
    </span>
  );
}
