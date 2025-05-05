// app/videos/layout.tsx

import React, { ReactNode } from "react"

interface VideosLayoutProps {
  children: ReactNode
}

export default function VideosLayout({ children }: VideosLayoutProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      {children}
    </div>
  )
}
