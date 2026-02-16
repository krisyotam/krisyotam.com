/**
 * ============================================================================
 * Unified Content API Route
 * ============================================================================
 * Author: Kris Yotam
 * Date: 2026-01-24
 *
 * Consolidates all written content endpoints into a single route.
 *
 * Usage:
 *   GET /api/content?type=essays              → All essays
 *   GET /api/content?type=fiction             → All fiction
 *   GET /api/content?type=notes               → All notes
 *   GET /api/content?type=papers              → All papers
 *   GET /api/content?type=poems               → All poems (from verse.json)
 *   GET /api/content?type=progymnasmata       → All progymnasmata
 *   GET /api/content?type=blog                → All blog posts
 *   GET /api/content?type=sequences           → All active sequences
 *   GET /api/content?type=sequences&slug=x    → Single sequence with post URLs
 *   GET /api/content?type=verse&slug=x&category=y → Verse MDX content
 *
 * @type api
 * @path src/app/api/content/route.ts
 * ============================================================================
 */

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import {
  getContentByType,
  getActiveContentByType,
  getSequencesData,
  type Sequence,
} from "@/lib/data";

// ============================================================================
// Types
// ============================================================================

type PostType = "essay" | "note" | "paper" | "review" | "fiction" | "verse";

// ============================================================================
// Helper Functions
// ============================================================================

function stripFrontmatter(raw: string): string {
  return raw.trim();
}

interface ContentDataItem {
  slug: string;
  category: string;
  start_date?: string;
  end_date?: string;
  views?: number;
}

function getContentData(): Map<string, Array<ContentDataItem>> {
  const contentMap = new Map<string, Array<ContentDataItem>>();

  const typeMapping: Record<PostType, string> = {
    essay: "essays",
    note: "notes",
    paper: "papers",
    review: "reviews",
    fiction: "fiction",
    verse: "verse",
  };

  for (const [postType, contentType] of Object.entries(typeMapping)) {
    const content = getContentByType(contentType);
    contentMap.set(
      postType,
      content.map((c: any) => ({
        slug: c.slug,
        category: c.category,
        start_date: c.start_date || c.date,
        end_date: c.end_date,
        views: c.views ?? 0,
      }))
    );
  }

  return contentMap;
}

function getPostDates(
  type: PostType,
  slug: string,
  contentData: Map<string, Array<ContentDataItem>>
): { start_date?: string; end_date?: string; views?: number } {
  const items = contentData.get(type) || [];
  const item = items.find((i) => i.slug === slug);
  return {
    start_date: item?.start_date,
    end_date: item?.end_date,
    views: item?.views ?? 0,
  };
}

function getPostUrl(
  type: PostType,
  slug: string,
  contentData: Map<string, Array<ContentDataItem>>
): string {
  let category = "";

  try {
    const items = contentData.get(type) || [];
    const item = items.find((i) => i.slug === slug);

    if (item) {
      category = item.category?.toLowerCase().replace(/\s+/g, "-") || "";
    }

    switch (type) {
      case "essay":
        return category ? `/essays/${category}/${slug}` : `/essays/unknown/${slug}`;
      case "note":
        return category ? `/notes/${category}/${slug}` : `/notes/unknown/${slug}`;
      case "paper":
        return category ? `/papers/${category}/${slug}` : `/papers/unknown/${slug}`;
      case "review":
        return category ? `/reviews/${category}/${slug}` : `/reviews/unknown/${slug}`;
      case "fiction":
        return category ? `/fiction/${category}/${slug}` : `/fiction/unknown/${slug}`;
      case "verse":
        return category ? `/verse/${category}/${slug}` : `/verse/unknown/${slug}`;
      default:
        return `/unknown/${slug}`;
    }
  } catch (error) {
    console.error("Error getting URL for", type, slug, error);
    return `/${type}s/unknown/${slug}`;
  }
}

// ============================================================================
// GET Handler
// ============================================================================

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const slug = searchParams.get("slug");
    const category = searchParams.get("category");

    if (!type) {
      return NextResponse.json(
        {
          error:
            "Missing 'type' parameter. Valid types: essays, fiction, notes, papers, poems, progymnasmata, blog, sequences, verse, stats",
        },
        { status: 400 }
      );
    }

    switch (type) {
      // ========================================================================
      // Standard content types (via getContentByType)
      // ========================================================================
      case "essays": {
        const essays = getContentByType("essays");
        return NextResponse.json({ essays });
      }

      case "fiction": {
        const fiction = getContentByType("fiction");
        return NextResponse.json(fiction);
      }

      case "notes": {
        const notes = getContentByType("notes");
        return NextResponse.json(notes);
      }

      case "papers": {
        const papers = getContentByType("papers");
        return NextResponse.json(papers);
      }

      case "blog": {
        const posts = getContentByType("blog");
        return NextResponse.json(posts);
      }

      case "progymnasmata": {
        const progymnasmata = getActiveContentByType("progymnasmata");
        return NextResponse.json(progymnasmata);
      }

      // ========================================================================
      // Poems (from verse.json)
      // ========================================================================
      case "poems": {
        const filePath = path.join(process.cwd(), "public", "data", "verse", "verse.json");
        const fileContents = fs.readFileSync(filePath, "utf8");
        const poems = JSON.parse(fileContents);
        return NextResponse.json(poems);
      }

      // ========================================================================
      // Sequences
      // ========================================================================
      case "sequences": {
        const data = await getSequencesData();

        // If slug provided, return single sequence with post URLs
        if (slug) {
          const sequence = data.sequences.find(
            (seq) => seq.slug === slug && seq.state === "active"
          );

          if (!sequence) {
            return NextResponse.json({ error: "Sequence not found" }, { status: 404 });
          }

          const contentData = getContentData();
          const postUrls: Record<string, string> = {};
          const postDates: Record<string, { start_date?: string; end_date?: string; views?: number }> = {};
          const allPosts = sequence.sections
            ? sequence.sections.flatMap((section) => section.posts)
            : sequence.posts || [];

          for (const post of allPosts) {
            const postSlug = post.content_slug || (post as any).slug;
            const postType = post.content_type || (post as any).type;
            if (postSlug && postType) {
              postUrls[postSlug] = getPostUrl(postType as PostType, postSlug, contentData);
              postDates[postSlug] = getPostDates(postType as PostType, postSlug, contentData);
            }
          }

          const transformedSequence = {
            ...sequence,
            posts: sequence.posts?.map((p) => {
              const postData = postDates[p.content_slug] || {};
              return {
                slug: p.content_slug,
                order: p.position,
                type: p.content_type,
                title: p.title,
                preview: p.preview,
                status: p.status,
                start_date: postData.start_date,
                end_date: postData.end_date,
                views: postData.views ?? 0,
              };
            }),
            sections: sequence.sections?.map((s) => ({
              title: s.title,
              posts: s.posts.map((p) => {
                const postData = postDates[p.content_slug] || {};
                return {
                  slug: p.content_slug,
                  order: p.position,
                  type: p.content_type,
                  title: p.title,
                  preview: p.preview,
                  status: p.status,
                  start_date: postData.start_date,
                  end_date: postData.end_date,
                  views: postData.views ?? 0,
                };
              }),
            })),
          };

          return NextResponse.json({ sequence: transformedSequence, postUrls, postDates });
        }

        // Return all active sequences
        const activeSequences = data.sequences.filter((seq) => seq.state === "active");
        return NextResponse.json({ sequences: activeSequences });
      }

      // ========================================================================
      // Verse MDX content
      // ========================================================================
      // ========================================================================
      // Content Stats
      // ========================================================================
      case "stats": {
        const dbStats = {
          blog: getActiveContentByType("blog").length,
          notes: getActiveContentByType("notes").length,
          papers: getActiveContentByType("papers").length,
          essays: getActiveContentByType("essays").length,
          fiction: getActiveContentByType("fiction").length,
          verse: getActiveContentByType("verse").length,
          ocs: getActiveContentByType("ocs").length,
          news: getActiveContentByType("news").length,
          progymnasmata: getActiveContentByType("progymnasmata").length,
          reviews: getActiveContentByType("reviews").length,
          sequences: getActiveContentByType("sequences").length,
        };

        // Get stats from other JSON files that weren't migrated
        const countEntries = (data: any, expectedKey: string): number => {
          if (!data) return 0;
          if (Array.isArray(data)) return data.length;
          if (data[expectedKey] && Array.isArray(data[expectedKey])) return data[expectedKey].length;
          const pluralKey = `${expectedKey}s`;
          if (data[pluralKey] && Array.isArray(data[pluralKey])) return data[pluralKey].length;
          for (const key in data) {
            if (Array.isArray(data[key])) return data[key].length;
          }
          return 0;
        };

        let jsonStats = { certifications: 0, lectureNotes: 0 };
        try {
          const certPath = path.join(process.cwd(), "data", "about", "certifications.json");
          const lecturePath = path.join(process.cwd(), "data", "lecture-notes", "lecture-notes.json");

          if (fs.existsSync(certPath)) {
            const certData = JSON.parse(fs.readFileSync(certPath, "utf8"));
            jsonStats.certifications = countEntries(certData, "certification");
          }
          if (fs.existsSync(lecturePath)) {
            const lectureData = JSON.parse(fs.readFileSync(lecturePath, "utf8"));
            jsonStats.lectureNotes = countEntries(lectureData, "note");
          }
        } catch (e) {
          console.error("Error reading JSON stats files:", e);
        }

        return NextResponse.json({ ...dbStats, ...jsonStats });
      }

      case "verse": {
        if (!slug || !category) {
          return NextResponse.json(
            { error: "Missing 'slug' or 'category' parameter for verse content" },
            { status: 400 }
          );
        }

        const filePath = path.join(
          process.cwd(),
          "src",
          "content",
          "verse",
          `${slug}.mdx`
        );

        if (!fs.existsSync(filePath)) {
          return NextResponse.json(
            { error: `File not found: ${category}/${slug}.mdx` },
            { status: 404 }
          );
        }

        const raw = await fs.promises.readFile(filePath, "utf-8");
        const content = stripFrontmatter(raw);

        return NextResponse.json({
          content,
          type: "mdx",
        });
      }

      default:
        return NextResponse.json(
          {
            error: `Unknown type: ${type}. Valid types: essays, fiction, notes, papers, poems, progymnasmata, blog, sequences, verse, stats`,
          },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error("Error in content API:", error);
    return NextResponse.json(
      { error: "Failed to fetch content", details: error.message },
      { status: 500 }
    );
  }
}
