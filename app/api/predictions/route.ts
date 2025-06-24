import { NextResponse } from "next/server"
import predictionsData from "@/data/about-predictions.json"

export async function GET() {
  try {
    return NextResponse.json(predictionsData)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch predictions data" }, { status: 500 })
  }
}
