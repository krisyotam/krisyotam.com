"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

type Edge = "left" | "right" | "top" | "bottom" | null;

// Utility to detect actual dark mode class
function useIsDarkMode() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDarkMode = () =>
      document.documentElement.classList.contains("dark");

    setIsDark(checkDarkMode());

    const observer = new MutationObserver(() => {
      setIsDark(checkDarkMode());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return isDark;
}

export function ThemeImageCompare({ className }: { className?: string }) {
  const isDark = useIsDarkMode();
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderPercent, setSliderPercent] = useState(100);
  const [entryEdge, setEntryEdge] = useState<Edge>(null);

  const primaryImage = isDark
    ? "https://www.krisyotam.com/doc/assets/logos/krisyotam-site-dark.png"
    : "https://www.krisyotam.com/doc/assets/logos/krisyotam-site-light.png";
  const secondaryImage = isDark
    ? "https://www.krisyotam.com/doc/assets/logos/krisyotam-site-light.png"
    : "https://www.krisyotam.com/doc/assets/logos/krisyotam-site-dark.png";

  const handleMouseEnter = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();

    // Determine which edge the mouse entered from
    const fromLeft = e.clientX - rect.left;
    const fromRight = rect.right - e.clientX;
    const fromTop = e.clientY - rect.top;
    const fromBottom = rect.bottom - e.clientY;

    const min = Math.min(fromLeft, fromRight, fromTop, fromBottom);

    if (min === fromLeft) setEntryEdge("left");
    else if (min === fromRight) setEntryEdge("right");
    else if (min === fromTop) setEntryEdge("top");
    else setEntryEdge("bottom");

    setSliderPercent(100);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current || !entryEdge) return;
    const rect = containerRef.current.getBoundingClientRect();

    let percent: number;

    if (entryEdge === "left") {
      // Entered from left, moving right reveals
      percent = 100 - ((e.clientX - rect.left) / rect.width) * 100;
    } else if (entryEdge === "right") {
      // Entered from right, moving left reveals
      percent = ((e.clientX - rect.left) / rect.width) * 100;
    } else if (entryEdge === "top") {
      // Entered from top, moving down reveals
      percent = 100 - ((e.clientY - rect.top) / rect.height) * 100;
    } else {
      // Entered from bottom, moving up reveals
      percent = ((e.clientY - rect.top) / rect.height) * 100;
    }

    requestAnimationFrame(() => {
      setSliderPercent(Math.max(0, Math.min(100, percent)));
    });
  }, [entryEdge]);

  const handleMouseLeave = useCallback(() => {
    setSliderPercent(100);
    setEntryEdge(null);
  }, []);

  // Generate clip-path based on entry edge
  const getClipPath = () => {
    const reveal = 100 - sliderPercent;
    switch (entryEdge) {
      case "left":
        return `inset(0 0 0 ${reveal}%)`;
      case "right":
        return `inset(0 ${reveal}% 0 0)`;
      case "top":
        return `inset(${reveal}% 0 0 0)`;
      case "bottom":
        return `inset(0 0 ${reveal}% 0)`;
      default:
        return `inset(0 0 0 0)`;
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full mx-auto mt-4 aspect-[16/9] border border-zinc-200 dark:border-zinc-700 rounded-none overflow-hidden cursor-col-resize",
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Secondary image (revealed) */}
      <img
        src={secondaryImage}
        alt="secondary theme"
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />
      {/* Primary image with clip-path based on entry edge */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{ clipPath: getClipPath() }}
      >
        <img
          src={primaryImage}
          alt="primary theme"
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />
      </div>
    </div>
  );
}
