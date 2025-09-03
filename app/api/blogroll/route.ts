import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "data/blogroll/blogroll.json");
    const fileContents = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(fileContents);
    const blogs = Array.isArray(data)
      ? data.filter(b => b && b.title && b.url)
      : Array.isArray(data.default)
        ? data.default.filter((b: any) => b && b.title && b.url)
        : [];
    return NextResponse.json({ blogs });
  } catch (err) {
    return NextResponse.json({ blogs: [] }, { status: 500 });
  }
}
