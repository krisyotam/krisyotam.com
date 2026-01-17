import { NextResponse } from "next/server";
import { getAllSupporters } from "@/lib/system-db";

export async function GET() {
  try {
    const supporters = getAllSupporters();
    return NextResponse.json({ supporters });
  } catch (error) {
    console.error("Error fetching supporters:", error);
    return NextResponse.json(
      { error: "Failed to fetch supporters" },
      { status: 500 }
    );
  }
}
