import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export interface QuoteProps {
  children: ReactNode;
  author: string;
  source?: string;
  year?: string;
  className?: string;
}

const baseStyles = [
  "my-6",
  "p-[0.9em_1.25em]",
  "border",
  "border-[hsl(var(--border))]",
  "bg-[hsl(var(--muted)/0.25)]",
  "text-[hsl(var(--muted-foreground))]",
  "text-[0.95em]",
  "leading-[1.65]",
].join(" ");

const footerStyles = [
  "mt-3",
  "pt-3",
  "border-t",
  "border-[hsl(var(--border))]",
  "text-sm",
  "text-[hsl(var(--muted-foreground))]",
  "text-right",
].join(" ");

export function Quote({ children, author, source, year, className }: QuoteProps) {
  return (
    <div className={cn(baseStyles, className)}>
      <div>{children}</div>
      <div className={footerStyles}>
        — {author}
        {source ? `, ${source}` : ""}
        {year ? ` (${year})` : ""}
      </div>
    </div>
  );
}

// Backward compat: Excerpt is now just Quote with a title mapped to source
export function Excerpt({ children, title, author, version, year, className }: {
  children: ReactNode; title: string; author: string;
  version?: string; year?: string; className?: string;
}) {
  const src = [title, version].filter(Boolean).join(", ");
  return <Quote author={author} source={src} year={year} className={className}>{children}</Quote>;
}
