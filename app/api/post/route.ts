// app/api/post/route.ts
export const dynamic = 'force-dynamic';

import { type NextRequest, NextResponse } from "next/server";
import { getPostBySlug, getAllPosts } from "@/utils/posts";
import { getPostMetadata } from "@/utils/mdx-utils";
import path from "path";
import fs from "fs";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    if (!slug) {
      return NextResponse.json({ error: "Slug parameter is required" }, { status: 400 });
    }

    const postData = await getPostBySlug(slug);
    if (!postData) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const displayDate = postData.end_date || postData.start_date;
    const year = new Date(displayDate).getFullYear().toString();
    const mdxPath = path.join(process.cwd(), "app/blog", year, slug, "page.mdx");
    const tsxPath = path.join(process.cwd(), "app/blog", year, slug, "page.tsx");
    const marginNotesPath = path.join(process.cwd(), "app/blog", year, slug, "margin-notes.json");
    const bibliographyPath = path.join(process.cwd(), "app/blog", year, slug, "bibliography.json");

    let headings: any[] = [];
    let marginNotes: any[] = [];
    let bibliography: any[] = [];

    try {
      const meta = await getPostMetadata(year, slug);
      headings = meta.headings;
      marginNotes = meta.marginNotes;
      bibliography = meta.bibliography;
    } catch (e) {
      console.error("Error loading metadata for", slug, e);
    }

    const responseData = {
      ...postData,
      headings,
      marginNotes,
      bibliography,
      filesExist: {
        mdx: fs.existsSync(mdxPath),
        tsx: fs.existsSync(tsxPath),
        marginNotes: fs.existsSync(marginNotesPath),
        bibliography: fs.existsSync(bibliographyPath),
      },
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error in post API route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
