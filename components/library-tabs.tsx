"use client"

import { useState } from "react"
import { CatalogContent } from "./catalog-content"
import { LibrarySeriesContent } from "./library-series-content"
import { LibraryNotesContent } from "./library-notes-content"

export function LibraryTabs() {
  const [activeTab, setActiveTab] = useState("catalog")

  const tabs = [
    { id: "catalog", label: "Catalog" },
    { id: "collections", label: "Collections" },
    { id: "notes", label: "Notes" }
  ]

  return (
    <div>
      <div className="relative">
        <div className="flex border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium relative transition-colors ${
                activeTab === tab.id
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
              )}
            </button>
          ))}
        </div>
      </div>
      
      <div className="mt-6">
        {activeTab === "catalog" && <CatalogContent />}
        {activeTab === "collections" && <LibrarySeriesContent />}
        {activeTab === "notes" && <LibraryNotesContent />}
      </div>
    </div>
  )
}

