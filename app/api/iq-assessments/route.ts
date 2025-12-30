"use server"

import { NextResponse } from "next/server"
import iqAssessmentsData from "@/data/about/iq-assessments.json"

export async function GET() {
  try {
    return NextResponse.json(iqAssessmentsData)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch IQ assessments data" }, { status: 500 })
  }
}
