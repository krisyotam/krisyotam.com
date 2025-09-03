import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET() {
  try {
    const papersPath = path.join(process.cwd(), "data/progymnasmata/progymnasmata.json");
    const file = await fs.readFile(papersPath, "utf8");
    const papersData = JSON.parse(file);

    const filteredPapers = Array.isArray(papersData.papers)
      ? papersData.papers.filter((paper: any) => paper.state !== "hidden")
      : [];

    return NextResponse.json(filteredPapers);
  } catch (error) {
    console.error("Error loading papers:", error);
    return NextResponse.json({ error: "Failed to load papers" }, { status: 500 });
  }
}
