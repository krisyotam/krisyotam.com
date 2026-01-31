/**
 * View Tracker Component
 * @author Kris Yotam
 * @date 2026-01-29
 * @description Records page views for content pages
 *
 * @type component
 * @path src/components/view-tracker.tsx
 */

"use client"

import { useEffect, useRef } from "react"

interface ViewTrackerProps {
  slug: string
}

const VIEWED_PAGES_KEY = "krisyotam_viewed_pages"

function hasViewedInSession(slug: string): boolean {
  try {
    const viewed = sessionStorage.getItem(VIEWED_PAGES_KEY)
    if (!viewed) return false
    const viewedSet: string[] = JSON.parse(viewed)
    return viewedSet.includes(slug)
  } catch {
    return false
  }
}

function markViewedInSession(slug: string): void {
  try {
    const viewed = sessionStorage.getItem(VIEWED_PAGES_KEY)
    const viewedSet: string[] = viewed ? JSON.parse(viewed) : []
    if (!viewedSet.includes(slug)) {
      viewedSet.push(slug)
      sessionStorage.setItem(VIEWED_PAGES_KEY, JSON.stringify(viewedSet))
    }
  } catch {
    // sessionStorage not available, silently fail
  }
}

export function ViewTracker({ slug }: ViewTrackerProps) {
  const tracked = useRef(false)

  useEffect(() => {
    // Only track once per page load
    if (tracked.current) return
    tracked.current = true

    // Check if already viewed in this session
    if (hasViewedInSession(slug)) return

    // Mark as viewed before making request
    markViewedInSession(slug)

    // Record the view
    fetch("/api/interactions?type=pageview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug,
        referrer: document.referrer || null,
      }),
    }).catch(() => {
      // Silently fail - view tracking is non-critical
    })
  }, [slug])

  return null
}
