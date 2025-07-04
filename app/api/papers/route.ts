import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    // Read the papers data from the JSON file
    const papersPath = path.join(process.cwd(), "data/papers/papers.json");
    const papersData = JSON.parse(fs.readFileSync(papersPath, "utf8"));

    // Filter out papers with state "hidden"
    const filteredPapers = papersData.papers.filter((paper: any) => paper.state !== "hidden");

    // Return the filtered papers
    return NextResponse.json(filteredPapers);
  } catch (error) {
    console.error("Error loading papers:", error);
    return NextResponse.json({ error: "Failed to load papers" }, { status: 500 });
  }
}
