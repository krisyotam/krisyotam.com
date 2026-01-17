/**
 * time-stamp.tsx
 *
 * Author: Kris Yotam
 *
 * Inline timestamp component for MDX.
 *
 * Usage:
 *   <Date year="2025" month="11" day="3">Some statement</Date>
 *
 * Renders inline content with a visually linked date marker.
 * The underline signals authorship scope; the subscript marks time.
 */

import React from "react"
import { cn } from "@/lib/utils"

export interface TimeStampProps {
  year: number | string
  month: number | string
  day: number | string
  className?: string
  children?: React.ReactNode
}

/** Pad a number to two digits (3 → 03). */
function pad2(n: number) {
  return n < 10 ? `0${n}` : String(n)
}

/**
 * Inline date component for MDX.
 * Named `Date` intentionally for prose-like usage.
 */
export function Date({ year, month, day, children, className }: TimeStampProps) {
  const y = Number(year)
  const m = Number(month)
  const d = Number(day)

  const isValid =
    Number.isFinite(y) &&
    Number.isFinite(m) &&
    Number.isFinite(d) &&
    y >= 0 &&
    y <= 9999 &&
    m >= 1 &&
    m <= 12 &&
    d >= 1 &&
    d <= 31

  if (!isValid) {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.warn(
        `Date: invalid props (year=${year}, month=${month}, day=${day})`
      )
    }
    return <span className={cn("inline", className)}>{children}</span>
  }

  const iso = `${String(y).padStart(4, "0")}-${pad2(m)}-${pad2(d)}`

  return (
    <span className={cn("inline-flex items-baseline", className)}>
      {/* Underlined content to establish authorship scope */}
      <span className="leading-tight underline underline-offset-4 decoration-muted-foreground/40">
        {children}
      </span>

      {/* Tight, optically aligned timestamp */}
      <time
        dateTime={iso}
        aria-label={`Written on ${iso}`}
        className="ml-1 text-xs text-muted-foreground relative -top-[0.35em]"
      >
        <sub className="text-[0.7em] leading-none">{iso}</sub>
      </time>
    </span>
  )
}

export default Date
