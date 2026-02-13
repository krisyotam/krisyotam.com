// components/Quote.tsx
import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

export interface QuoteProps {
  children: ReactNode;
  author: string;
  className?: string;
}

export function Quote({ children, author, className }: QuoteProps) {
  const base = [
    "p-6",
    "rounded-none",
    "my-6",
    "bg-muted/50",                        // Light mode background
    "dark:bg-[#1A1A1A] !important",       // Match blockquote dark background exactly
    "border-l-4",
    "border-[hsl(var(--border))]",        // Light mode border
    "dark:border-zinc-800 !important",    // Match blockquote dark border exactly
  ].join(" ");

  const footer = [
    "mt-4",
    "pt-4",
    "border-t",
    "border-[hsl(var(--border))]",
    "dark:border-zinc-800 !important",
    "text-sm",
    "text-muted-foreground",
    "dark:text-zinc-400 !important",      // Refined footer text color in dark
    "flex",
    "justify-end",
  ].join(" ");

  return (
    <div className={cn(base, className)}>
      <div>{children}</div>
      <div className={footer}>– {author}</div>
    </div>
  );
}
