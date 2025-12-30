"use client";

import { useEffect, useState } from "react";
import { Compare } from "@/components/ui/compare";
import { SparklesCore } from "@/components/ui/sparkles";
import { cn } from "@/lib/utils";

// Utility to detect actual dark mode class
function useIsDarkMode() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Function to check if dark mode is enabled via class
    const checkDarkMode = () =>
      document.documentElement.classList.contains("dark");

    // Set initial value
    setIsDark(checkDarkMode());

    // Setup MutationObserver to track class changes on <html>
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

  const firstImage = isDark
    ? "https://krisyotam.com/doc/site/krisyotam-site-dark.png"
    : "https://krisyotam.com/doc/site/krisyotam-site-light.png";
  const secondImage = isDark
    ? "https://krisyotam.com/doc/site/krisyotam-site-light.png"
    : "https://krisyotam.com/doc/site/krisyotam-site-dark.png";

  return (
    <div
      className={cn(
        "relative w-full mx-auto mt-4 aspect-[16/9] border border-zinc-200 dark:border-zinc-700 rounded-none",
        className
      )}
    >
      <Compare
        firstImage={firstImage}
        secondImage={secondImage}
        className="rounded-none shadow-none border-0 w-full h-full aspect-[16/9]"
        firstImageClassName="rounded-none object-cover w-full h-full"
        secondImageClassname="rounded-none object-cover w-full h-full"
        showHandlebar={false}
        slideMode="hover"
        autoplay={false}
        initialSliderPercentage={100}
      />
      <SparklesCore className="absolute inset-0 pointer-events-none" particleDensity={30} />
    </div>
  );
}
