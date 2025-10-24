"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

interface SurveyTableSurvey {
  title: string;
  start_date: string;
  end_date?: string;
  slug: string;
  status?: string;
  confidence?: string;
  importance?: number;
  preview?: string;
  state?: string;
}

interface SurveysTableProps {
  surveys: SurveyTableSurvey[];
  searchQuery: string;
}

export function SurveysTable({ surveys, searchQuery }: SurveysTableProps) {
  const router = useRouter();

  // Helper to format date as "Month DD, YYYY"
  function formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }

  // Helper to get the display date (end_date if available, otherwise start_date)
  function getDisplayDate(survey: SurveyTableSurvey): string {
    const dateToUse = (survey.end_date && survey.end_date.trim()) || survey.start_date;
    return formatDate(dateToUse);
  }

  if (!surveys.length) {
    return <p className="text-center py-10 text-muted-foreground">No surveys found.</p>;
  }

  return (
    <div className="mt-8">
      <table className="w-full text-sm border border-border overflow-hidden shadow-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50 text-foreground">
            <th className="py-2 text-left font-medium px-3">Title</th>
            <th className="py-2 text-left font-medium px-3">Date</th>
          </tr>
        </thead>
        <tbody>
          {surveys.map((survey, index) => (
            <tr
              key={survey.slug}
              className={`border-b border-border hover:bg-secondary/50 transition-colors cursor-pointer ${
                index % 2 === 0 ? 'bg-transparent' : 'bg-muted/5'
              }`}
              onClick={() => router.push(`/surveys/${encodeURIComponent(survey.slug)}`)}
            >
              <td className="py-2 px-3 font-medium">{survey.title}</td>
              <td className="py-2 px-3">{getDisplayDate(survey)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
