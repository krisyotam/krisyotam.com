/**
 * ============================================================================
 * Survey Detail Page
 * ============================================================================
 *
 * Dynamic route for displaying individual surveys.
 * Loads survey schema from .survey.md files using the new parser.
 *
 * @author Kris Yotam
 * @type page
 * @path src/app/(misc)/surveys/[slug]/page.tsx
 * @date 2026-01-22
 * ============================================================================
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import SurveyPageClient from "./SurveyPageClient";
import { parseSurveyMarkdown, extractSurveyMeta } from "@/lib/survey-parser";
import type { SurveySchema } from "@/lib/survey-parser";

// ============================================================================
// Types
// ============================================================================

interface SurveyPageProps {
  params: Promise<{ slug: string }>;
}

// ============================================================================
// Survey Loading
// ============================================================================

const SURVEYS_DIR = path.join(
  process.cwd(),
  "src/app/(misc)/surveys/content"
);

function getAllSurveySlugs(): string[] {
  if (!fs.existsSync(SURVEYS_DIR)) {
    return [];
  }

  const files = fs.readdirSync(SURVEYS_DIR).filter((f) => f.endsWith(".survey.md"));

  return files.map((file) => {
    const content = fs.readFileSync(path.join(SURVEYS_DIR, file), "utf-8");
    const meta = extractSurveyMeta(content);
    return meta.id;
  });
}

function getSurveyBySlug(slug: string): SurveySchema | null {
  if (!fs.existsSync(SURVEYS_DIR)) {
    return null;
  }

  const files = fs.readdirSync(SURVEYS_DIR).filter((f) => f.endsWith(".survey.md"));

  for (const file of files) {
    const content = fs.readFileSync(path.join(SURVEYS_DIR, file), "utf-8");
    try {
      const schema = parseSurveyMarkdown(content);
      if (schema.meta.id === slug) {
        return schema;
      }
    } catch (e) {
      console.error(`Error parsing survey ${file}:`, e);
    }
  }

  return null;
}

// ============================================================================
// Static Generation
// ============================================================================

export async function generateStaticParams() {
  const slugs = getAllSurveySlugs();
  return slugs.map((slug) => ({ slug }));
}

// ============================================================================
// Metadata
// ============================================================================

export async function generateMetadata({
  params,
}: SurveyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const survey = getSurveyBySlug(slug);

  if (!survey) {
    return { title: "Survey Not Found" };
  }

  return {
    title: `${survey.meta.title} | Kris Yotam`,
    description: survey.meta.description || `Complete the ${survey.meta.title} survey`,
    openGraph: {
      title: survey.meta.title,
      description: survey.meta.description || `Complete the ${survey.meta.title} survey`,
      type: "website",
    },
  };
}

// ============================================================================
// Page Component
// ============================================================================

export default async function SurveyPage({ params }: SurveyPageProps) {
  const { slug } = await params;
  const survey = getSurveyBySlug(slug);

  if (!survey) {
    notFound();
  }

  // Only show active surveys
  if (survey.meta.status !== "active") {
    notFound();
  }

  return <SurveyPageClient schema={survey} />;
}
