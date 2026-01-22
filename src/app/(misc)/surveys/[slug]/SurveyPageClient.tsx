/**
 * ============================================================================
 * Survey Page Client Component
 * ============================================================================
 *
 * Client-side wrapper for survey pages with PostHeader.
 *
 * @author Kris Yotam
 * @type component
 * @path src/app/(misc)/surveys/[slug]/SurveyPageClient.tsx
 * @date 2026-01-22
 * ============================================================================
 */

"use client";

import { PostHeader } from "@/components/core";
import { Survey } from "@/components/core";
import { Footer } from "@/components/footer";
import { LiveClock } from "@/components/live-clock";
import type { SurveySchema } from "@/lib/survey-parser";

interface SurveyPageClientProps {
  schema: SurveySchema;
}

// Map survey status to PostHeader status
function mapStatus(status: string): "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished" {
  const statusMap: Record<string, "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished"> = {
    active: "Finished",
    draft: "Draft",
    closed: "Abandoned",
  };
  return statusMap[status] || "Draft";
}

// Map confidence values
function mapConfidence(confidence?: string): "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain" {
  if (!confidence) return "possible";
  return confidence as any;
}

export default function SurveyPageClient({ schema }: SurveyPageClientProps) {
  const handleSubmit = async (data: Record<string, any>) => {
    // For now, just log the data
    // TODO: Submit to Supabase
    console.log("Survey submission:", {
      surveyId: schema.meta.id,
      data,
    });
  };

  return (
    <div className="container max-w-[672px] mx-auto px-4 pt-16 pb-8">
      {/* Post Header */}
      <PostHeader
        title={schema.meta.title}
        subtitle={schema.meta.subtitle}
        start_date={schema.meta.start_date || new Date().toISOString().split("T")[0]}
        end_date={schema.meta.end_date}
        backHref="/surveys"
        backText="Surveys"
        preview={schema.meta.description}
        status={mapStatus(schema.meta.status)}
        confidence={mapConfidence(schema.meta.confidence)}
        importance={schema.meta.importance ?? 5}
        tags={schema.meta.tags}
        category={schema.meta.category}
      />

      {/* Estimated time notice */}
      {schema.meta.estimated_time && (
        <p className="text-xs text-muted-foreground mt-4 mb-6">
          Estimated time: {schema.meta.estimated_time}
        </p>
      )}

      {/* Survey Form */}
      <div className="mt-8">
        <Survey schema={schema} onSubmit={handleSubmit} />
      </div>

      {/* Footer */}
      <div className="mt-16">
        <LiveClock />
        <Footer />
      </div>
    </div>
  );
}
