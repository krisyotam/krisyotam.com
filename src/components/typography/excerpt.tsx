// components/Excerpt.tsx
import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

export interface ExcerptProps {
  children: ReactNode;
  title: string;
  author: string;
  version?: string;
  year?: string;
  className?: string;
}

export function Excerpt({
  children,
  title,
  author,
  version,
  year,
  className,
}: ExcerptProps) {
  const base = [
    "p-6",
    "rounded-none",                           // square corners
    "my-6",
    "bg-muted/50",                             // Light mode background
    "dark:bg-[#1A1A1A] !important",             // Match blockquote dark background
    "border-l-4",                               // left accent bar
    "border-[hsl(var(--border))]",              // light mode border
    "dark:border-zinc-800 !important",          // Match blockquote dark border
  ].join(" ");

  const footer = [
    "mt-4",
    "pt-4",
    "border-t",
    "border-[hsl(var(--border))]",
    "dark:border-zinc-800 !important",
    "text-right",
    "text-sm",
    "text-muted-foreground",
    "dark:text-zinc-400 !important",            // soft white for footer text in dark
  ].join(" ");

  return (
    <div className={cn(base, className)}>
      <div>{children}</div>
      <div className={footer}>
        {title}
        {version ? `, ${version}` : ""}
        {year ? `, ${year}` : ""} — {author}
      </div>
    </div>
  );
}
