import React from "react"
import "./film.css"

export default function FilmLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="py-12">
      <div className="film-page">
        {children}
      </div>
    </div>
  )
}
