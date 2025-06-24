"use client";

import Link from "next/link";
import { Calendar, BookText, Bookmark } from "lucide-react";
import { useTheme } from "next-themes";
import type { Poem } from "@/utils/poems";

interface PoetryCardProps {
  poem: Poem;
}

// CSS Reset and Component Styles with Dark Mode Support
const PoetryStyles = () => (
  <style jsx global>{`
    /* CSS Reset for Poetry Component */
    .poetry-component-reset * {
      margin: 0 !important;
      padding: 0 !important;
      border: 0 !important;
      box-sizing: border-box !important;
    }
    
    .poetry-component-reset {
      font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif !important;
      line-height: 1.5 !important;
      color: hsl(222.2, 47.4%, 11.2%) !important;
      transition: color 0.3s ease, background-color 0.3s ease, border-color 0.3s ease !important;
    }
    
    /* Dark mode for poetry component */
    .dark .poetry-component-reset {
      color: hsl(210, 40%, 98%) !important;
    }
    
    /* Card Styles */
    .poetry-card {
      display: flex !important;
      flex-direction: column !important;
      overflow: hidden !important;
      transition: all 0.3s ease-out !important;
      border-radius: 0.75rem !important;
      border: 1px solid hsl(214.3, 31.8%, 91.4%) !important;
      background-color: white !important;
      box-shadow: 0 0 0 rgba(0, 0, 0, 0) !important;
      height: 100% !important;
    }
    
    .dark .poetry-card {
      background-color: #121212 !important;
      border-color: #2a2a2a !important;
    }
    
    .poetry-card:hover {
      transform: translateY(-2px) scale(1.02) !important;
      border-color: hsl(214.3, 31.8%, 85%) !important;
      background-color: hsl(0, 0%, 99%) !important;
      box-shadow: 0 0 25px rgba(0, 0, 0, 0.08), 
                  0 0 45px rgba(0, 0, 0, 0.06), 
                  0 0 65px rgba(0, 0, 0, 0.03),
                  inset 0 0 0 1px rgba(255, 255, 255, 0.2) !important;
    }
    
    .dark .poetry-card:hover {
      background-color: #1a1a1a !important;
      border-color: #333333 !important;
      box-shadow: 0 0 25px rgba(0, 0, 0, 0.3), 
                  0 0 45px rgba(0, 0, 0, 0.2), 
                  0 0 65px rgba(0, 0, 0, 0.1),
                  inset 0 0 0 1px rgba(255, 255, 255, 0.05) !important;
    }
    
    .poetry-card:hover .poetry-title {
      color: hsl(222.2, 47.4%, 9.2%) !important;
    }
    
    .dark .poetry-card:hover .poetry-title {
      color: hsl(210, 40%, 98%) !important;
    }
    
    .poetry-card:hover .poetry-badge {
      background-color: rgba(0, 0, 0, 0.03) !important;
      border-color: hsl(215.4, 16.3%, 40%) !important;
    }
    
    .dark .poetry-card:hover .poetry-badge {
      background-color: rgba(255, 255, 255, 0.05) !important;
      border-color: #4d4d4d !important;
    }
    
    .poetry-card:hover .poetry-card-footer {
      background-color: hsla(210, 40%, 96.1%, 0.8) !important;
      border-top-color: hsl(214.3, 31.8%, 85%) !important;
    }
    
    .dark .poetry-card:hover .poetry-card-footer {
      background-color: #1f1f1f !important;
      border-top-color: #2a2a2a !important;
    }
    
    .poetry-card-content {
      padding: 1.5rem !important;
      transition: all 0.3s ease-out !important;
      flex-grow: 1 !important;
    }
    
    .poetry-card-footer {
      border-top: 1px solid hsl(214.3, 31.8%, 91.4%) !important;
      background-color: hsla(210, 40%, 96.1%, 0.5) !important;
      padding: 0.75rem 1.5rem !important;
      margin-top: auto !important;
      transition: background-color 0.3s ease, border-color 0.3s ease !important;
    }
    
    .dark .poetry-card-footer {
      border-top-color: #2a2a2a !important;
      background-color: #161616 !important;
    }
    
    .poetry-button {
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      width: 100% !important;
      padding: 0.5rem 1rem !important;
      font-size: 0.875rem !important;
      font-weight: 500 !important;
      border-radius: 0.375rem !important;
      background-color: transparent !important;
      color: hsl(222.2, 47.4%, 11.2%) !important;
      transition: all 0.2s ease-in-out !important;
      cursor: pointer !important;
    }
    
    .dark .poetry-button {
      color: hsl(210, 40%, 98%) !important;
    }
    
    .poetry-button:hover {
      background-color: hsla(210, 40%, 96.1%, 0.8) !important;
      color: hsl(222.2, 47.4%, 9%) !important;
    }
    
    .dark .poetry-button:hover {
      background-color: #252525 !important;
      color: hsl(210, 40%, 98%) !important;
    }
    
    .poetry-badge {
      display: inline-flex !important;
      align-items: center !important;
      border: 1px solid hsl(215.4, 16.3%, 46.9%) !Important;
      border-radius: 9999px !important;
      padding: 0.25rem 0.75rem !Important;
      font-size: 0.75rem !important;
      font-weight: 500 !Important;
      line-height: 1 !Important;
      color: hsl(215.4, 16.3%, 46.9%) !Important;
      background-color: transparent !Important;
      transition: color 0.3s ease, background-color 0.3s ease, border-color 0.3s ease !Important;
    }
    
    .dark .poetry-badge {
      color: #d1d5db !important;
      border-color: #4d4d4d !Important;
    }
    
    .poetry-title {
      margin-top: 0.5rem !Important;
      font-size: 1.5rem !Important;
      font-weight: 500 !Important;
      line-height: 1.2 !Important;
      letter-spacing: -0.025em !Important;
      color: hsl(222.2, 47.4%, 11.2%) !Important;
      transition: color 0.3s ease !Important;
    }
    
    .dark .poetry-title {
      color: #f3f4f6 !Important;
    }
    
    .poetry-collection {
      display: flex !Important;
      align-items: center !Important;
      font-size: 0.875rem !Important;
      color: hsl(215.4, 16.3%, 46.9%) !Important;
      margin-top: 0.25rem !Important;
      transition: color 0.3s ease !Important;
    }
    
    .dark .poetry-collection {
      color: #9ca3af !Important;
    }
    
    .poetry-date {
      display: flex !Important;
      align-items: center !Important;
      font-size: 0.75rem !Important;
      color: hsl(215.4, 16.3%, 46.9%) !Important;
      transition: color 0.3s ease !Important;
    }
    
    .dark .poetry-date {
      color: #9ca3af !Important;
    }
  `}</style>
)

export function PoetryCard({ poem }: PoetryCardProps) {
  const { theme } = useTheme()
  const typeSlug = poem.type.toLowerCase().replace(/\s+/g, "-")
  const poemUrl = `/poetry/${typeSlug}/${poem.year}/${poem.slug}`

  return (
    <>
      <PoetryStyles />
      <div className={`poetry-component-reset poetry-card ${theme === "dark" ? "dark" : ""}`}>
        <div className="poetry-card-content">
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div className="poetry-badge">{poem.type}</div>
              <div className="poetry-date">
                <Calendar style={{ marginRight: "0.25rem", height: "0.75rem", width: "0.75rem" }} />
                <span>{poem.dateCreated}</span>
              </div>
            </div>
            <div>
              <h3 className="poetry-title">{poem.title}</h3>
              {poem.collection && (
                <div className="poetry-collection">
                  <Bookmark style={{ marginRight: "0.25rem", height: "0.75rem", width: "0.75rem" }} />
                  <span>From "{poem.collection}"</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="poetry-card-footer">
          <Link href={poemUrl} className="poetry-button" scroll>
            <BookText style={{ marginRight: "0.5rem", height: "1rem", width: "1rem" }} />
            Read Poem
          </Link>
        </div>
      </div>
    </>
  )
}

export const Poetry = PoetryCard;
