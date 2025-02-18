import type { NextWebVitalsMetric } from "next/app"

const vitalsUrl = "https://vitals.vercel-analytics.com/v1/vitals"

function getConnectionSpeed() {
  return "connection" in navigator && navigator["connection"] && "effectiveType" in navigator["connection"]
    ? navigator["connection"]["effectiveType"]
    : ""
}

export function sendToVercelAnalytics(metric: NextWebVitalsMetric) {
  const analyticsId = process.env.NEXT_PUBLIC_ANALYTICS_ID
  if (!analyticsId) {
    return
  }

  const body = {
    dsn: analyticsId,
    id: metric.id,
    page: window.location.pathname,
    href: window.location.href,
    event_name: metric.name,
    value: metric.value.toString(),
    speed: getConnectionSpeed(),
  }

  const blob = new Blob([new URLSearchParams(body).toString()], {
    type: "application/x-www-form-urlencoded",
  })
  if (navigator.sendBeacon) {
    navigator.sendBeacon(vitalsUrl, blob)
  } else
    fetch(vitalsUrl, {
      body: blob,
      method: "POST",
      credentials: "omit",
      keepalive: true,
    })
}

