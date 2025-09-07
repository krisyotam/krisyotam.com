import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "data/gallery/categories.json");
    const fileContents = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(fileContents);
    const categories = Array.isArray(data.categories)
      ? data.categories.filter((c: { slug: any; title: any; }) => c && c.slug && c.title)
      : [];
    return NextResponse.json(categories);
  } catch (err) {
    return NextResponse.json([], { status: 500 });
  }
}
