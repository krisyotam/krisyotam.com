import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "data/gallery/gallery.json");
    const fileContents = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(fileContents);
    const artworks = Array.isArray(data.artworks)
      ? data.artworks.filter((a: { title: any; imageUrl: any; }) => a && a.title && a.imageUrl)
      : [];
    return NextResponse.json(artworks);
  } catch (err) {
    return NextResponse.json([], { status: 500 });
  }
}
