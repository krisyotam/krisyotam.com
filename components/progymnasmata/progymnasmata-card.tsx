"use client"

import { Book, Calendar } from "lucide-react"
import { useTheme } from "next-themes"
import type { ProgymnasmataEntry } from "./progymnasmata"

interface ProgymnasmataCardProps {
  entry: ProgymnasmataEntry
  onViewContent: () => void
}

// CSS Reset and Component Styles with Dark Mode Support
const ProgymnasmataStyles = () => (
  <style jsx global>{`
    /* CSS Reset for Progymnasmata Component */
    .progymnasmata-component-reset * {
      margin: 0 !important;
      padding: 0 !important;
      border: 0 !important;
      box-sizing: border-box !important;
    }
    
    .progymnasmata-component-reset {
      font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif !important;
      line-height: 1.5 !important;
      color: hsl(222.2, 47.4%, 11.2%) !important;
      transition: color 0.3s ease, background-color 0.3s ease, border-color 0.3s ease !important;
    }
    
    /* Dark mode for progymnasmata component */
    .dark .progymnasmata-component-reset {
      color: hsl(210, 40%, 98%) !important;
    }
    
    /* Card Styles */
    .progymnasmata-card {
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
    
    .dark .progymnasmata-card {
      background-color: #121212 !important;
      border-color: #2a2a2a !important;
    }
    
    .progymnasmata-card:hover {
      transform: translateY(-2px) scale(1.02) !important;
      border-color: hsl(214.3, 31.8%, 85%) !important;
      background-color: hsl(0, 0%, 99%) !important;
      box-shadow: 0 0 25px rgba(0, 0, 0, 0.08), 
                  0 0 45px rgba(0, 0, 0, 0.06), 
                  0 0 65px rgba(0, 0, 0, 0.03),
                  inset 0 0 0 1px rgba(255, 255, 255, 0.2) !important;
    }
    
    .dark .progymnasmata-card:hover {
      background-color: #1a1a1a !important;
      border-color: #333333 !important;
      box-shadow: 0 0 25px rgba(0, 0, 0, 0.3), 
                  0 0 45px rgba(0, 0, 0, 0.2), 
                  0 0 65px rgba(0, 0, 0, 0.1),
                  inset 0 0 0 1px rgba(255, 255, 255, 0.05) !important;
    }
    
    .progymnasmata-card:hover .progymnasmata-title {
      color: hsl(222.2, 47.4%, 9.2%) !important;
    }
    
    .dark .progymnasmata-card:hover .progymnasmata-title {
      color: hsl(210, 40%, 98%) !important;
    }
    
    .progymnasmata-card:hover .progymnasmata-badge {
      background-color: rgba(0, 0, 0, 0.03) !important;
      border-color: hsl(215.4, 16.3%, 40%) !important;
    }
    
    .dark .progymnasmata-card:hover .progymnasmata-badge {
      background-color: rgba(255, 255, 255, 0.05) !important;
      border-color: #4d4d4d !important;
    }
    
    .progymnasmata-card:hover .progymnasmata-card-footer {
      background-color: hsla(210, 40%, 96.1%, 0.8) !important;
      border-top-color: hsl(214.3, 31.8%, 85%) !important;
    }
    
    .dark .progymnasmata-card:hover .progymnasmata-card-footer {
      background-color: #1f1f1f !important;
      border-top-color: #2a2a2a !important;
    }
    
    .progymnasmata-card-content {
      padding: 1.5rem !important;
      transition: all 0.3s ease-out !important;
      flex-grow: 1 !important;
    }
    
    .progymnasmata-card-footer {
      border-top: 1px solid hsl(214.3, 31.8%, 91.4%) !important;
      background-color: hsla(210, 40%, 96.1%, 0.5) !important;
      padding: 0.75rem 1.5rem !important;
      margin-top: auto !important;
      transition: background-color 0.3s ease, border-color 0.3s ease !important;
    }
    
    .dark .progymnasmata-card-footer {
      border-top-color: #2a2a2a !important;
      background-color: #161616 !important;
    }
    
    .progymnasmata-button {
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
    
    .dark .progymnasmata-button {
      color: hsl(210, 40%, 98%) !important;
    }
    
    .progymnasmata-button:hover {
      background-color: hsla(210, 40%, 96.1%, 0.8) !important;
      color: hsl(222.2, 47.4%, 9%) !important;
    }
    
    .dark .progymnasmata-button:hover {
      background-color: #252525 !important;
      color: hsl(210, 40%, 98%) !important;
    }
    
    .progymnasmata-badge {
      display: inline-flex !important;
      align-items: center !important;
      border: 1px solid hsl(215.4, 16.3%, 46.9%) !important;
      border-radius: 9999px !important;
      padding: 0.25rem 0.75rem !important;
      font-size: 0.75rem !important;
      font-weight: 500 !important;
      line-height: 1 !important;
      color: hsl(215.4, 16.3%, 46.9%) !important;
      background-color: transparent !important;
      transition: color 0.3s ease, background-color 0.3s ease, border-color 0.3s ease !important;
    }
    
    .dark .progymnasmata-badge {
      color: #d1d5db !important;
      border-color: #4d4d4d !important;
    }
    
    .progymnasmata-title {
      margin-top: 0.5rem !important;
      font-size: 1.5rem !important;
      font-weight: 500 !important;
      line-height: 1.2 !important;
      letter-spacing: -0.025em !important;
      color: hsl(222.2, 47.4%, 11.2%) !important;
      transition: color 0.3s ease !important;
    }
    
    .dark .progymnasmata-title {
      color: #f3f4f6 !important;
    }
    
    .progymnasmata-description {
      margin-top: 0.5rem !important;
      font-size: 0.875rem !important;
      color: hsl(215.4, 16.3%, 46.9%) !important;
      transition: color 0.3s ease !important;
      display: -webkit-box !important;
      -webkit-line-clamp: 3 !important;
      -webkit-box-orient: vertical !important;
      overflow: hidden !important;
    }
    
    .dark .progymnasmata-description {
      color: #9ca3af !important;
    }
    
    .progymnasmata-date {
      display: flex !important;
      align-items: center !important;
      font-size: 0.75rem !important;
      color: hsl(215.4, 16.3%, 46.9%) !important;
      transition: color 0.3s ease !important;
    }
    
    .dark .progymnasmata-date {
      color: #9ca3af !important;
    }
  `}</style>
)

export function ProgymnasmataCard({ entry, onViewContent }: ProgymnasmataCardProps) {
  const { theme } = useTheme()
  const { title, type, date, description } = entry

  return (
    <>
      <ProgymnasmataStyles />
      <div className={`progymnasmata-component-reset progymnasmata-card ${theme === "dark" ? "dark" : ""}`}>
        <div className="progymnasmata-card-content">
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div className="progymnasmata-badge">{type}</div>
              <div className="progymnasmata-date">
                <Calendar style={{ marginRight: "0.25rem", height: "0.75rem", width: "0.75rem" }} />
                <span>
                  {new Date(date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
            <div>
              <h3 className="progymnasmata-title">{title}</h3>
              <p className="progymnasmata-description">{description}</p>
            </div>
          </div>
        </div>
        <div className="progymnasmata-card-footer">
          <button onClick={onViewContent} className="progymnasmata-button">
            <Book style={{ marginRight: "0.5rem", height: "1rem", width: "1rem" }} />
            View Contents
          </button>
        </div>
      </div>
    </>
  )
}

