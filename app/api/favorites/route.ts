import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const FAVORITES_SECTIONS = [
  "anime",
  "ballet",
  "books",
  "film",
  "manga",
  "meals",
  "music",
  "plays",
  "art"
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const section = searchParams.get("section") || "anime";
  if (!FAVORITES_SECTIONS.includes(section)) {
    return NextResponse.json({ error: "Invalid section" }, { status: 400 });
  }
  const filePath = path.join(process.cwd(), "data", "favorites", `${section}.json`);
  try {
    const file = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(file);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Could not read file" }, { status: 500 });
  }
}
