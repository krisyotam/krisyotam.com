"use client"

import { useState, useEffect } from "react"

export function LiveClock() {
  const [time, setTime] = useState<string>("")
  const [date, setDate] = useState<string>("")

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()

      // Format time in CST (Central Standard Time) with 12-hour format
      const cstTime = new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        timeZone: "America/Chicago",
      }).format(now)

      // Format date in CST
      const cstDate = new Intl.DateTimeFormat("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "America/Chicago",
      }).format(now)

      setTime(cstTime)
      setDate(cstDate)
    }

    // Update immediately
    updateTime()

    // Update every second
    const interval = setInterval(updateTime, 1000)

    // Clean up on unmount
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="text-sm text-muted-foreground mt-12">
      <div>{time}</div>
      <div>{date}</div>
    </div>
  )
}

