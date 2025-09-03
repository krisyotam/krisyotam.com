"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { PageDescription } from "@/components/posts/typography/page-description";
import { SurveysTable } from "@/components/surveys-table";
import { NotesSearch } from "@/components/notes-search";

interface Survey {
  title: string;
  preview: string;
  start_date: string;
  end_date: string;
  slug: string;
  status: string;
  confidence: string;
  importance: number;
  state: string;
}

interface SurveysJson {
  shortform: Survey[];
}

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

export default function SurveysPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSurveys() {
      setLoading(true);
      try {
        const res = await fetch("/api/surveys");
        if (!res.ok) throw new Error("Failed to fetch surveys");
        const data: SurveysJson = await res.json();
        setSurveys(data.shortform.filter((s) => s.state === "active"));
      } catch (error) {
        console.error(error);
        setSurveys([]);
      } finally {
        setLoading(false);
      }
    }
    fetchSurveys();
  }, []);

  // Filter surveys by search query
  const filteredSurveys = surveys.filter((survey) => {
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

      {/* Search bar, copied from essays page markup */}
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

      <div className="mb-4">
        {loading ? (
          <div className="text-center py-10 text-gray-400">
            Loading surveys...
          </div>
        ) : filteredSurveys.length > 0 ? (
          <SurveysTable
            surveys={filteredSurveys}
            searchQuery={searchQuery}
          />
        ) : (
          <div className="text-muted-foreground text-sm mt-6 text-center">
            No surveys found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}
