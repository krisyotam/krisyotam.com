"use client"

import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface PfpProps {
  src: string
  url: string
  alt: string
  className?: string
}

export function Pfp({ src, url, alt, className }: PfpProps) {
  return (
    <main className="book-component pt-1 pb-4 my-2 bg-muted/50 dark:bg-[hsl(var(--popover))] text-sm flex flex-col items-center">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="book-link flex flex-col items-center text-center no-underline hover:no-underline"
      >
        <div
          className={cn(
            "relative w-full max-w-[800px] aspect-[3/4] isolate",
            className
          )}
        >
          <Image
            src={src}
            alt={alt}
            fill
            style={{ objectFit: "contain" }}
            className="rounded-md"
            unoptimized={src?.includes('krisyotam.com')}
          />
        </div>
        <span className="book-title inline-block font-medium leading-none mt-[-20px] mb-8">
          {alt}
        </span>
      </a>
    </main>
  )
}
