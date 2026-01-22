/**
 * ============================================================================
 * Surveys Page
 * ============================================================================
 *
 * Lists all available surveys with search and table view.
 *
 * @author Kris Yotam
 * @type page
 * @path src/app/(misc)/surveys/page.tsx
 * @date 2026-01-22
 * ============================================================================
 */

import fs from "fs";
import path from "path";
import { PageHeader } from "@/components/core";
import { extractSurveyMeta } from "@/lib/survey-parser";
import type { SurveyMeta } from "@/lib/survey-parser";
import SurveysClientPage from "./SurveysClientPage";

// ============================================================================
// Survey Loading
// ============================================================================

const SURVEYS_DIR = path.join(
  process.cwd(),
  "src/app/(misc)/surveys/content"
);

function getActiveSurveys(): SurveyMeta[] {
  if (!fs.existsSync(SURVEYS_DIR)) {
    return [];
  }

  const files = fs.readdirSync(SURVEYS_DIR).filter((f) => f.endsWith(".survey.md"));

  const surveys: SurveyMeta[] = [];

  for (const file of files) {
    try {
      const content = fs.readFileSync(path.join(SURVEYS_DIR, file), "utf-8");
      const meta = extractSurveyMeta(content);
      if (meta.status === "active") {
        surveys.push(meta);
      }
    } catch (e) {
      console.error(`Error parsing survey ${file}:`, e);
    }
  }

  return surveys.sort((a, b) => a.title.localeCompare(b.title));
}

// ============================================================================
// Page Metadata
// ============================================================================

const pageData = {
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
// Page Component
// ============================================================================

export default function SurveysPage() {
  const surveys = getActiveSurveys();

  return (
    <div className="container max-w-[672px] mx-auto px-4 pt-16 pb-8">
      <PageHeader {...pageData} />
      <SurveysClientPage surveys={surveys} />
    </div>
  );
}
