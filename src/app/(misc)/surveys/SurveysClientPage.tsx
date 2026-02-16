/**
 * ============================================================================
 * Surveys Client Page
 * ============================================================================
 *
 * Client-side component for the surveys listing page with search and table.
 *
 * @author Kris Yotam
 * @type component
 * @path src/app/(misc)/surveys/SurveysClientPage.tsx
 * @date 2026-01-22
 * ============================================================================
 */

"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/content/navigation";
import type { SurveyMeta } from "@/lib/survey-parser";

interface SurveysClientPageProps {
  surveys: SurveyMeta[];
}

export default function SurveysClientPage({ surveys }: SurveysClientPageProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list" | "directory">("list");

  // Filter surveys based on search
  const filteredSurveys = useMemo(() => {
    if (!searchQuery.trim()) return surveys;

    const query = searchQuery.toLowerCase();
    return surveys.filter(
      (survey) =>
        survey.title.toLowerCase().includes(query) ||
        survey.description?.toLowerCase().includes(query) ||
        survey.category?.toLowerCase().includes(query) ||
        survey.tags?.some((tag) => tag.toLowerCase().includes(query))
    );
  }, [surveys, searchQuery]);

  // Format date for display
  function formatDate(dateString?: string): string {
    if (!dateString) return "";
    try {
      const [year, month, day] = dateString.split("-").map((num) => parseInt(num, 10));
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
      });
    } catch {
      return dateString;
    }
  }

  return (
    <div className="mt-8">
      <Navigation
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search surveys..."
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showViewToggle={false}
        showGridOption={false}
      />

      {filteredSurveys.length === 0 ? (
        <p className="text-center py-10 text-muted-foreground">No surveys found.</p>
      ) : (
        <table className="w-full text-sm border border-border overflow-hidden shadow-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-foreground">
              <th className="py-2 text-left font-medium px-3">Title</th>
              <th className="py-2 text-left font-medium px-3">Category</th>
              <th className="py-2 text-left font-medium px-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredSurveys.map((survey, index) => (
              <tr
                key={survey.id}
                className={`border-b border-border hover:bg-secondary/50 transition-colors cursor-pointer ${
                  index % 2 === 0 ? "bg-transparent" : "bg-muted/5"
                }`}
                onClick={() => router.push(`/surveys/${survey.id}`)}
              >
                <td className="py-2 px-3 font-medium">{survey.title}</td>
                <td className="py-2 px-3">{survey.category || "Survey"}</td>
                <td className="py-2 px-3">
                  {formatDate(survey.end_date || survey.start_date)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
