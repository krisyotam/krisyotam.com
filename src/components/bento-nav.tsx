"use client"

import Link from "next/link"

type BentoItem = {
  label: string // Display label without leading slash, e.g., "ME"
  href: string  // Route to navigate to, e.g., "/me"
}

interface BentoNavProps {
  items?: BentoItem[]
  className?: string
}

// A simple, responsive square bento grid of links
export function BentoNav({
  items = [
    { label: "ME", href: "/me" },
    { label: "LOGO", href: "/logo" },
    { label: "ABOUT", href: "/about" },
    { label: "DESIGN", href: "/design" },
    { label: "DONATE", href: "/donate" },
    { label: "FAQ", href: "/faq" },
    { label: "NOW", href: "/now" },
    { label: "TIL", href: "/til" },
  ],
  className = "",
}: BentoNavProps) {
  return (
    <nav className={`w-full ${className}`} aria-label="Quick navigation">
      <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-0 overflow-hidden">
        {/* Top banner */}
        <div
          className="col-span-3 md:col-span-3 lg:col-span-4 h-12 md:h-14 flex items-center justify-center border border-border bg-muted/20"
          style={{ borderRadius: 0 }}
        >
          <span className="text-xs md:text-sm font-light tracking-wide text-foreground/80">
            the few pages that justify the rest · est. 2025
          </span>
        </div>

        {items.map((item, idx) => (
          <Link
            key={item.href}
            href={item.href}
            className="group relative block aspect-square border border-border bg-muted/30 hover:bg-accent/40 transition-all duration-200"
            aria-label={`Go to ${item.label}`}
            style={{ borderRadius: 0 }}
          >
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="select-none text-sm md:text-base lg:text-lg font-light tracking-wider text-foreground/90">
                /{item.label}
              </span>
            </span>
            {/* Soft hover embellishment */}
            <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ boxShadow: "inset 0 0 0 9999px rgba(0,0,0,0.02)" }} />
          </Link>
        ))}

        {/* Bottom quote banner */}
        <div
          className="col-span-3 md:col-span-3 lg:col-span-4 min-h-14 flex items-center justify-center border border-border bg-muted/20 p-3 text-center"
          style={{ borderRadius: 0 }}
        >
          <div className="space-y-1">
            <div className="text-[11px] md:text-xs font-medium tracking-wide text-foreground/70">
              Michel de Montaigne (1533–1592)
            </div>
            <div className="text-xs md:text-sm font-light leading-snug text-foreground/80">
              “I want death to find me planting my cabbages, neither worrying about it nor the unfinished gardening.”
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
