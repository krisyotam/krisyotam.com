// app/api/post-mdx/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get("year");
  const slug = searchParams.get("slug");
  const mdxPath = path.join(process.cwd(), "app/blog", year, slug, "page.mdx");
  const mdxSource = fs.readFileSync(mdxPath, "utf8");
  const { content, data } = matter(mdxSource);
  return NextResponse.json({ content, frontmatter: data });
}