/**
 * ============================================================================
 * Surveys Page
 * Author: Kris Yotam
 * Description: Display active surveys with external links that open in new tabs.
 * ============================================================================
 */

"use client";

import { useState } from "react";
import { PageHeader } from "@/components/core";
import { PageDescription } from "@/components/core";
import { ExternalLink } from "lucide-react";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface Survey {
  title: string;
  preview: string;
  start_date: string;
  end_date: string;
  url: string;
  status: string;
  confidence: string;
  importance: number;
  state: string;
}

// ============================================================================
// SURVEYS DATA
// ============================================================================

const surveysData: Survey[] = [
  {
    title: "Contact Form",
    preview: "Get in touch with me directly through this contact form.",
    start_date: "2025-07-02",
    end_date: "2025-07-02",
    url: "https://forms.gle/contactform",
    status: "Draft",
    confidence: "likely",
    importance: 5,
    state: "active",
  },
  {
    title: "Anonymous Feedback Form",
    preview: "Leave feedback on my writing, site, ideas, or anything else.",
    start_date: "2025-07-02",
    end_date: "2025-07-02",
    url: "https://forms.gle/anonymousfeedback",
    status: "Draft",
    confidence: "likely",
    importance: 5,
    state: "active",
  },
  {
    title: "Home Page Comment",
    preview: "Have your site comment left on the home page. You must provide a name (or username), occupation, and a profile picture.",
    start_date: "2025-07-02",
    end_date: "2025-07-02",
    url: "https://forms.gle/homepagecomment",
    status: "Draft",
    confidence: "likely",
    importance: 5,
    state: "active",
  },
];

// ============================================================================
// PAGE METADATA
// ============================================================================

const defaultSurveysPageData = {
  title: "Surveys",
  subtitle: "",
  start_date: "2025-01-01",
  end_date: new Date().toISOString().split("T")[0],
  preview: "Participate in ongoing surveys, feedback forms, and research polls.",
  status: "Active" as const,
  confidence: "likely" as const,
  importance: 5,
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function SurveysPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter to only active surveys
  const activeSurveys = surveysData.filter((s) => s.state === "active");

  // Filter surveys by search query
  const filteredSurveys = activeSurveys.filter((survey) => {
    const q = searchQuery.toLowerCase();
    return (
      !q ||
      survey.title.toLowerCase().includes(q) ||
      survey.preview.toLowerCase().includes(q)
    );
  });

  return (
    <div className="container max-w-[672px] mx-auto px-4 pt-16 pb-8">
      <PageHeader {...defaultSurveysPageData} />
      <PageDescription
        title="About Surveys"
        description="Participate in ongoing surveys, feedback forms, and research polls. Use the search bar to find a specific survey by title or description. Only active surveys are shown."
      />

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search surveys..."
            className="w-full h-9 px-3 py-2 border rounded-none text-sm bg-background hover:bg-secondary/50 focus:outline-none focus:bg-secondary/50"
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
          />
        </div>
      </div>

      {/* Surveys Table */}
      <div className="mb-4">
        {filteredSurveys.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            No surveys found matching your criteria.
          </div>
        ) : (
          <div className="border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="py-2 px-3 text-left font-medium">Title</th>
                  <th className="py-2 px-3 text-left font-medium hidden sm:table-cell">Date</th>
                  <th className="py-2 px-3 text-center font-medium w-12"></th>
                </tr>
              </thead>
              <tbody>
                {filteredSurveys.map((survey, index) => (
                  <tr
                    key={survey.title}
                    className={`border-b border-border hover:bg-secondary/50 transition-colors ${
                      index % 2 === 0 ? "bg-transparent" : "bg-muted/5"
                    }`}
                  >
                    <td className="py-2 px-3">
                      <a
                        href={survey.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline font-medium"
                      >
                        {survey.title}
                      </a>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                        {survey.preview}
                      </p>
                    </td>
                    <td className="py-2 px-3 text-muted-foreground hidden sm:table-cell whitespace-nowrap">
                      {formatDate(survey.start_date)}
                    </td>
                    <td className="py-2 px-3 text-center">
                      <a
                        href={survey.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center text-muted-foreground hover:text-primary"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
