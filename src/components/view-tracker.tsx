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

export function ViewTracker({ slug }: ViewTrackerProps) {
  const tracked = useRef(false)

  useEffect(() => {
    // Only track once per page load
    if (tracked.current) return
    tracked.current = true

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
