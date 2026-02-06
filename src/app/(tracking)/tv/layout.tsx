import React from "react"
import "./tv.css"

export default function TvLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="py-12">
      <div className="tv-page">
        {children}
      </div>
    </div>
  )
}
