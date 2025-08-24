// app/api/post-mdx/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get("year") || "";
  const slug = searchParams.get("slug") || "";

  // If either year or slug is missing, return an error
  if (!year || !slug) {
    return NextResponse.json(
      { error: "Year and slug are required" },
      { status: 400 }
    );
  }

  try {
    const mdxPath = path.join(process.cwd(), "app/blog", year, slug, "page.mdx");
    const mdxSource = fs.readFileSync(mdxPath, "utf8");
    const { content, data } = matter(mdxSource);
    return NextResponse.json({ content, frontmatter: data });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to read MDX file" },
      { status: 500 }
    );
  }
}