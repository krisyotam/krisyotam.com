"use client";

import { useState } from "react";
import { CustomSelect, SelectOption } from "@/components/ui/custom-select";
import { Timeline } from "@/components/ui/timeline";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
  company?: string;
  role?: string;
  description?: string;
}

interface CVClientProps {
  timelineData: TimelineEntry[];
  isActive: boolean;
}

export function CVClient({ timelineData, isActive }: CVClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeYear, setActiveYear] = useState("");
  const [viewMode, setViewMode] = useState<"timeline" | "list">("timeline");

  // Don't render anything if not active
  if (!isActive) {
    return null;
  }

  // Extract unique years from timeline data
  const years = [...new Set(timelineData.map((item) => item.title))];
  const yearOptions: SelectOption[] = years.map((year) => ({
    value: year,
    label: year,
  }));

  // Add "All Years" option at the beginning
  yearOptions.unshift({ value: "", label: "All Years" });

  const handleYearChange = (selectedValue: string) => {
    setActiveYear(selectedValue);
  };

  // Filter timeline data based on search query and selected year
  const filteredTimelineData = timelineData.filter((item) => {
    const q = searchQuery.toLowerCase();
    const contentString = JSON.stringify(item.content).toLowerCase();
    
    const matchesSearch =
      !q ||
      item.title.toLowerCase().includes(q) ||
      contentString.includes(q) ||
      (item.company && item.company.toLowerCase().includes(q)) ||
      (item.role && item.role.toLowerCase().includes(q)) ||
      (item.description && item.description.toLowerCase().includes(q));

    const matchesYear = !activeYear || item.title === activeYear;

    return matchesSearch && matchesYear;
  });

  return (
    <div className="cv-section">
      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search experience..."
          className="w-full h-9 px-3 py-2 border border-border text-sm bg-background hover:bg-secondary/50 focus:outline-none focus:bg-secondary/50"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Filter + view toggle */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="year-filter" className="text-sm text-muted-foreground">
            Filter by year:
          </label>
          <CustomSelect
            value={activeYear}
            onValueChange={handleYearChange}
            options={yearOptions}
            className="text-sm min-w-[140px]"
          />
        </div>

        <div className="flex items-center gap-1 border border-border">
          <button
            onClick={() => setViewMode("timeline")}
            className={`px-3 py-1 text-xs transition-colors ${
              viewMode === "timeline"
                ? "bg-foreground text-background"
                : "bg-background text-foreground hover:bg-secondary/50"
            }`}
          >
            Timeline
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`px-3 py-1 text-xs transition-colors ${
              viewMode === "list"
                ? "bg-foreground text-background"
                : "bg-background text-foreground hover:bg-secondary/50"
            }`}
          >
            List
          </button>
        </div>
      </div>

      {/* View modes */}
      {filteredTimelineData.length > 0 ? (
        viewMode === "timeline" ? (
          <div className="timeline-container">
            <CustomTimelineWrapper data={filteredTimelineData} />
          </div>
        ) : (
          <CVListView data={filteredTimelineData} />
        )
      ) : (
        <div className="text-muted-foreground text-sm mt-6 text-center">
          No experience found matching your criteria.
        </div>
      )}
    </div>
  );
}

function CustomTimelineWrapper({ data }: { data: TimelineEntry[] }) {
  return (
    <div className="relative w-full mx-auto custom-timeline-wrapper">
      <style jsx global>{`
        .custom-timeline-wrapper .w-full.bg-white.dark\\:bg-neutral-950 {
          background: transparent !important;
          padding-left: 0 !important;
          padding-right: 0 !important;
          width: 100% !important;
        }
        .custom-timeline-wrapper .max-w-7xl,
        .custom-timeline-wrapper .max-w-2xl {
          max-width: 100% !important;
          padding: 0 !important;
          width: 100% !important;
          margin-left: 0 !important;
          margin-right: 0 !important;
        }
        .custom-timeline-wrapper h2 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        .custom-timeline-wrapper p {
          font-size: 0.875rem;
        }
        .custom-timeline-wrapper .pt-10.md\\:pt-40 {
          padding-top: 1rem !important;
        }
        .custom-timeline-wrapper .md\\:text-5xl,
        .custom-timeline-wrapper .text-4xl {
          font-size: 1.25rem !important;
          line-height: 1.5rem !important;
          font-weight: 600 !important;
        }
        .custom-timeline-wrapper .py-20 {
          padding-top: 1rem !important;
          padding-bottom: 1rem !important;
        }
        .custom-timeline-wrapper .w-full.font-sans.px-4.md\\:px-10 {
          padding-left: 0 !important;
          padding-right: 0 !important;
          width: 100% !important;
        }
        .custom-timeline-wrapper .relative.max-w-2xl.mx-auto.pb-20 {
          max-width: 100% !important;
          width: 100% !important;
          margin-left: 0 !important;
          margin-right: 0 !important;
        }
      `}</style>
      <Timeline data={data} />
    </div>
  );
}

function CVListView({ data }: { data: TimelineEntry[] }) {
  return (
    <div className="cv-list-view">
      <h2 className="text-xl font-semibold mb-4">Companies I Work With</h2>
      
      <div className="space-y-6">
        {data.map((item, index) => (
          <div 
            key={index} 
            className="border border-border p-4"
          >
            <div className="flex items-start gap-4 mb-3">
              {/* We could add company logos here */}
              <div className="w-8 h-8 bg-muted flex items-center justify-center rounded-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M9 17h6" />
                </svg>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{item.company || `Experience ${index + 1}`}</h3>
                  <span className="text-sm text-muted-foreground">{item.title}</span>
                </div>
                <div className="text-sm text-muted-foreground">{item.role}</div>
              </div>
            </div>
            
            <p className="text-sm pl-12">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-4">Services I Offer</h2>
      <div className="space-y-6">
        <div className="border border-border p-4">
          <div className="flex items-start gap-4 mb-3">
            <div className="w-8 h-8 bg-muted flex items-center justify-center rounded-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Product Design</h3>
              <p className="text-sm">I help you figure out what to build and how to build it. My approach combines strong design fundamentals with practical technical knowledge so we can ship something people love.</p>
            </div>
          </div>
        </div>
        
        <div className="border border-border p-4">
          <div className="flex items-start gap-4 mb-3">
            <div className="w-8 h-8 bg-muted flex items-center justify-center rounded-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8" />
                <path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4" />
                <path d="M12 4v16" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Web App Development</h3>
              <p className="text-sm">I create web applications that do exactly what they need to do - no bloat, no unnecessary features. Just clean code, thoughtful interfaces, and solutions that make sense.</p>
            </div>
          </div>
        </div>
        
        <div className="border border-border p-4">
          <div className="flex items-start gap-4 mb-3">
            <div className="w-8 h-8 bg-muted flex items-center justify-center rounded-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9" />
                <path d="m13 3 6 6" />
                <path d="M13 9h6" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Plugin Development</h3>
              <p className="text-sm">I build efficient plugins that solve real problems. Adobe and Grammarly trust my code because it works reliably and respects how people actually use software.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
