// app/api/post-exists/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get("year");
  const slug = searchParams.get("slug");
  const blogPostPath = path.join(process.cwd(), "app/blog", year, slug, "page.tsx");
  const exists = fs.existsSync(blogPostPath);
  return NextResponse.json(exists);
}