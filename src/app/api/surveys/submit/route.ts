/**
 * ============================================================================
 * Survey Submission API
 * ============================================================================
 *
 * POST /api/surveys/submit
 * Handles survey form submissions and stores in lab.db
 * Supports both direct API calls and formsmd submissions
 *
 * @author Kris Yotam
 * @type api
 * @path src/app/api/surveys/submit/route.ts
 * @data lab
 * @date 2026-01-21
 * ============================================================================
 */

import { NextRequest, NextResponse } from "next/server";
import { submitSurveyResponse } from "@/lib/lab-db";
import crypto from "crypto";

// ============================================================================
// Helpers
// ============================================================================

function hashIP(ip: string): string {
  return crypto.createHash("sha256").update(ip).digest("hex").slice(0, 16);
}

// ============================================================================
// Route Handler
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Get survey slug from header (formsmd) or body (direct API)
    let surveySlug = request.headers.get("x-survey-slug");
    let responseData: Record<string, any>;

    if (surveySlug) {
      // Formsmd submission - body IS the form data
      responseData = body;
    } else if (body.surveySlug && body.responseData) {
      // Direct API call format
      surveySlug = body.surveySlug;
      responseData = body.responseData;
    } else {
      return NextResponse.json(
        { error: "Missing survey slug or response data" },
        { status: 400 }
      );
    }

    if (!surveySlug || typeof surveySlug !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid surveySlug" },
        { status: 400 }
      );
    }

    if (!responseData || typeof responseData !== "object") {
      return NextResponse.json(
        { error: "Missing or invalid responseData" },
        { status: 400 }
      );
    }

    // Get client info for spam prevention
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const userAgent = request.headers.get("user-agent") || undefined;
    const ipHash = hashIP(ip);

    // Store response
    const id = submitSurveyResponse(surveySlug, responseData, ipHash, userAgent);

    return NextResponse.json({
      success: true,
      id,
      message: "Survey response submitted successfully",
    });
  } catch (error) {
    console.error("Survey submission error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
