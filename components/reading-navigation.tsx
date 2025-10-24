"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function ReadingNavigation() {
  const pathname = usePathname()
  
  const tabs = [
    { href: "/reading", label: "Reading", isActive: pathname === "/reading" },
    { href: "/read", label: "Read", isActive: pathname === "/read" || pathname.startsWith("/read#") },
    { href: "/want-to-read", label: "Want to Read", isActive: pathname === "/want-to-read" },
    { href: "/reading-lists", label: "Lists", isActive: pathname === "/reading-lists" },
    { href: "/reading-log", label: "Reading Log", isActive: pathname === "/reading-log" },
    { href: "/reading-stats", label: "Stats", isActive: pathname === "/reading-stats" },
  ]

  return (
    <div className="relative mb-8">
      <div className="flex border-b border-border">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`px-4 py-2 text-sm font-medium relative transition-colors ${
              tab.isActive
                ? "text-foreground border-b-2 border-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
