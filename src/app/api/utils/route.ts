/**
 * ============================================================================
 * Unified Utils API Route
 * ============================================================================
 * Author: Kris Yotam
 * Date: 2026-01-24
 *
 * Consolidates utility endpoints into a single route.
 *
 * Usage:
 *   GET  /api/utils?type=404-suggester              → Get paths for 404 suggester
 *   GET  /api/utils?type=get-script                 → Get 404.js script
 *   GET  /api/utils?type=github-file&url=x          → Fetch GitHub file
 *   POST /api/utils?type=tikz                       → Compile TikZ to SVG
 *
 * @type api
 * @path src/app/api/utils/route.ts
 * ============================================================================
 */

import { NextRequest, NextResponse } from "next/server";
import { promises as fsPromises } from "fs";
import fs from "fs";
import path from "path";
import Database from "better-sqlite3";
import { spawnSync } from "child_process";
import os from "os";
import { randomUUID } from "crypto";

export const dynamic = "force-dynamic";

// ============================================================================
// 404 Suggester Types and Helpers
// ============================================================================

const DB_PATH = path.join(process.cwd(), "public", "data", "content.db");

const CONTENT_TYPES = [
  "blog",
  "essays",
  "fiction",
  "news",
  "notes",
  "ocs",
  "papers",
  "progymnasmata",
  "reviews",
  "verse",
] as const;

interface ContentRow {
  slug: string;
  category_slug: string | null;
}

interface FolderMeta {
  files: string[];
  hasPosts: boolean;
  hasTags: boolean;
  hasCategories: boolean;
}

interface SiteMap {
  rootFiles: string[];
  folders: Record<string, FolderMeta>;
}

interface SuggesterResponse {
  paths: string[];
  map: SiteMap;
  displayMap?: Record<string, string>;
  error?: string;
}

function slugify(input: string): string {
  return String(input || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function readJsonSync(filePath: string): unknown {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function pushIfInternal(arr: string[], candidate: string): void {
  if (!candidate || typeof candidate !== "string") return;
  if (candidate.startsWith("/")) {
    arr.push(candidate);
  } else if (/^[a-z0-9\-_/]+$/i.test(candidate)) {
    arr.push(`/${candidate}`);
  }
}

// Static site pages (non-content routes)
const STATIC_PAGES = [
  "/", "/home",
  "/blog", "/essays", "/notes", "/papers", "/diary", "/fiction",
  "/reviews", "/news", "/ocs", "/progymnasmata", "/verse", "/til", "/now",
  "/sequences",
  "/categories", "/tags",
  "/library", "/reading", "/reading-log", "/reading-lists", "/reading-stats",
  "/read", "/want-to-read",
  "/anime", "/manga", "/film", "/tv", "/music", "/games", "/globe",
  "/art", "/gallery", "/cards", "/videos",
  "/stats", "/contact", "/subscribe", "/supporters", "/blogroll",
  "/people", "/quotes", "/excerpts", "/sources", "/predictions", "/surveys",
  "/symbols", "/type", "/example",
  "/portfolio", "/profile",
  "/legal", "/shop",
  "/changelog",
  "/mitzvah", "/rules-of-the-internet",
  "/search",
  // Vanity URLs
  "/me", "/about", "/logo", "/design", "/donate", "/faq",
];

function extractPathsFromDatabase(out: string[], displayMap: Record<string, string>): void {
  // Add static pages
  for (const page of STATIC_PAGES) {
    out.push(page);
    displayMap[page] = page;
  }

  if (!fs.existsSync(DB_PATH)) {
    console.warn("404 Suggester API: content.db not found at", DB_PATH);
    return;
  }

  let db: Database.Database | null = null;

  try {
    db = new Database(DB_PATH, { readonly: true });

    for (const type of CONTENT_TYPES) {
      try {
        const rows = db
          .prepare(
            `
          SELECT slug, category_slug
          FROM ${type}
          WHERE slug IS NOT NULL AND slug != ''
        `
          )
          .all() as ContentRow[];

        // Collect unique categories for this content type
        const categorySlugs = new Set<string>();

        for (const row of rows) {
          const slug = row.slug;
          const category = row.category_slug || "uncategorized";
          const sexyUrl = `/${slug}`;
          const fullPath = `/${type}/${category}/${slug}`;
          const typePath = `/${type}/${slug}`;

          // Add all path forms for matching
          out.push(fullPath);
          out.push(typePath);
          out.push(sexyUrl);

          // Map all forms to the sexy URL for display
          displayMap[fullPath] = sexyUrl;
          displayMap[typePath] = sexyUrl;
          displayMap[sexyUrl] = sexyUrl;

          if (category) categorySlugs.add(category);
        }

        // Add content type category pages (e.g. /essays/philosophy)
        for (const cat of categorySlugs) {
          const categoryPage = `/${type}/${cat}`;
          out.push(categoryPage);
          displayMap[categoryPage] = categoryPage;
        }
      } catch {
        // Table might not exist, skip silently
      }
    }

    try {
      const categories = db
        .prepare(
          `SELECT slug, title FROM categories WHERE slug IS NOT NULL`
        )
        .all() as { slug: string; title: string }[];

      for (const cat of categories) {
        out.push(`/category/${cat.slug}`);
        out.push(`/categories/${cat.slug}`);
        displayMap[`/category/${cat.slug}`] = `/category/${cat.slug}`;
        displayMap[`/categories/${cat.slug}`] = `/category/${cat.slug}`;
      }
    } catch {
      // Categories table might not exist
    }

    try {
      const tags = db
        .prepare(`SELECT slug, title FROM tags WHERE slug IS NOT NULL`)
        .all() as { slug: string; title: string }[];

      for (const tag of tags) {
        out.push(`/tag/${tag.slug}`);
        out.push(`/tags/${tag.slug}`);
        displayMap[`/tag/${tag.slug}`] = `/tag/${tag.slug}`;
        displayMap[`/tags/${tag.slug}`] = `/tag/${tag.slug}`;
      }
    } catch {
      // Tags table might not exist
    }
  } catch (err) {
    console.error("404 Suggester API: Error reading database", err);
  } finally {
    db?.close();
  }
}

function extractPathsFromData(
  data: unknown,
  folderName: string | null,
  out: string[]
): void {
  if (!data) return;

  const obj = data as Record<string, unknown>;

  if (Array.isArray(obj.pages)) {
    obj.pages.forEach((p: unknown) => {
      const page = p as Record<string, unknown>;
      if (page?.path && typeof page.path === "string") {
        out.push(page.path);
      }
    });
  }

  if (Array.isArray(obj.posts)) {
    obj.posts.forEach((post: unknown) => {
      const p = post as Record<string, unknown>;
      if (!p) return;

      if (p.path && typeof p.path === "string") {
        pushIfInternal(out, p.path);
      } else if (p.permalink && typeof p.permalink === "string") {
        pushIfInternal(out, p.permalink);
      } else if (p.slug && typeof p.slug === "string") {
        const prefix = folderName ? `/${folderName}` : "/blog";
        if (p.category && typeof p.category === "string") {
          out.push(`${prefix}/${slugify(p.category)}/${p.slug}`);
          out.push(`${prefix}/${p.slug}`);
        } else {
          out.push(`${prefix}/${p.slug}`);
        }
      }
    });
  }

  if (obj.slug && typeof obj.slug === "string") {
    const prefix = folderName ? `/${folderName}` : "/blog";
    if (obj.category && typeof obj.category === "string") {
      out.push(`${prefix}/${slugify(obj.category)}/${obj.slug}`);
      out.push(`${prefix}/${obj.slug}`);
    } else {
      out.push(`${prefix}/${obj.slug}`);
    }
  }

  if (obj.path && typeof obj.path === "string") {
    pushIfInternal(out, obj.path);
  }

  if (Array.isArray(data)) {
    data.forEach((item: unknown) => {
      const i = item as Record<string, unknown>;
      if (!i || typeof i !== "object") return;

      if (i.path && typeof i.path === "string") {
        pushIfInternal(out, i.path);
      } else if (i.url && typeof i.url === "string") {
        pushIfInternal(out, i.url);
      } else if (i.permalink && typeof i.permalink === "string") {
        pushIfInternal(out, i.permalink);
      } else if (i.slug && typeof i.slug === "string") {
        const prefix = folderName ? `/${folderName}` : "/content";
        if (i.category && typeof i.category === "string") {
          out.push(`${prefix}/${slugify(i.category)}/${i.slug}`);
          out.push(`${prefix}/${i.slug}`);
        } else {
          out.push(`${prefix}/${i.slug}`);
        }
      }

      if (i.category && typeof i.category === "string") {
        out.push(`/category/${slugify(i.category)}`);
        if (folderName)
          out.push(`/${folderName}/category/${slugify(i.category)}`);
      }

      if (i.tags && Array.isArray(i.tags)) {
        i.tags.forEach((t: unknown) => {
          if (typeof t === "string") {
            out.push(`/tag/${slugify(t)}`);
            if (folderName) out.push(`/${folderName}/tag/${slugify(t)}`);
          }
        });
      }
    });
  }

  if (Array.isArray(obj.tags)) {
    obj.tags.forEach((tag: unknown) => {
      const t = tag as Record<string, unknown> | string;
      const slug =
        typeof t === "string" ? t : ((t?.slug || t?.name) as string | undefined);
      if (slug) {
        const s = slugify(slug);
        out.push(`/tag/${s}`);
        if (folderName) out.push(`/${folderName}/tag/${s}`);
      }
    });
  }

  if (Array.isArray(obj.categories)) {
    obj.categories.forEach((cat: unknown) => {
      const c = cat as Record<string, unknown> | string;
      const slug =
        typeof c === "string" ? c : ((c?.slug || c?.name) as string | undefined);
      if (slug) {
        const s = slugify(slug);
        out.push(`/category/${s}`);
        if (folderName) out.push(`/${folderName}/category/${s}`);
      }
    });
  }
}

// ============================================================================
// GitHub File Helpers
// ============================================================================

const ALLOWED_GITHUB_USER = "krisyotam";
const githubCache = new Map<string, { content: string; expiresAt: number }>();
const CACHE_DURATION_MS = 5 * 60 * 1000;

// ============================================================================
// TikZ Helpers
// ============================================================================

function commandExists(command: string): boolean {
  try {
    const result = spawnSync(command, ["--version"], { shell: true });
    return result.status === 0;
  } catch {
    return false;
  }
}

function generateFallbackSVG(message: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="120" viewBox="0 0 400 120">
    <rect width="400" height="120" fill="#f8f9fa" stroke="#d2d3d4" stroke-width="1"/>
    <text x="50%" y="50%" font-family="system-ui, sans-serif" font-size="14" text-anchor="middle" dominant-baseline="middle" fill="#666">
      ${message}
    </text>
    <text x="50%" y="75%" font-family="system-ui, sans-serif" font-size="12" text-anchor="middle" dominant-baseline="middle" fill="#888">
      Check public/tikz-svg directory for pre-rendered SVGs
    </text>
  </svg>`;
}

// ============================================================================
// GET Handler
// ============================================================================

export async function GET(
  request: NextRequest
): Promise<NextResponse<SuggesterResponse | { content: string } | { error: string }>> {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    if (!type) {
      return NextResponse.json(
        { error: "Missing 'type' parameter. Valid types: 404-suggester, get-script, github-file" } as any,
        { status: 400 }
      );
    }

    switch (type) {
      // ======================================================================
      // 404 Suggester
      // ======================================================================
      case "404-suggester": {
        const dataDir = path.join(process.cwd(), "data");
        const collected: string[] = [];
        const displayMap: Record<string, string> = {};

        extractPathsFromDatabase(collected, displayMap);

        const map: SiteMap = { rootFiles: [], folders: {} };

        if (fs.existsSync(dataDir)) {
          const entries = fs.readdirSync(dataDir, { withFileTypes: true });

          for (const ent of entries) {
            if (ent.isFile() && ent.name.endsWith(".json")) {
              const filePath = path.join(dataDir, ent.name);
              map.rootFiles.push(ent.name);
              const data = readJsonSync(filePath);
              try {
                extractPathsFromData(data, null, collected);
              } catch {
                // Skip invalid files
              }
            }
          }

          for (const ent of entries) {
            if (!ent.isDirectory()) continue;

            const folderName = ent.name;
            const folderPath = path.join(dataDir, folderName);
            const subFiles = fs.readdirSync(folderPath, { withFileTypes: true });

            map.folders[folderName] = {
              files: [],
              hasPosts: false,
              hasTags: false,
              hasCategories: false,
            };

            for (const sf of subFiles) {
              if (sf.isFile() && sf.name.endsWith(".json")) {
                map.folders[folderName].files.push(sf.name);

                const lower = sf.name.toLowerCase();
                if (lower.includes("tag")) map.folders[folderName].hasTags = true;
                if (lower.includes("category"))
                  map.folders[folderName].hasCategories = true;
                if (
                  /post|essay|feed|entries|news|writing|notes|libers/.test(lower)
                ) {
                  map.folders[folderName].hasPosts = true;
                }

                const filePath = path.join(folderPath, sf.name);
                const data = readJsonSync(filePath);
                try {
                  extractPathsFromData(data, folderName, collected);
                } catch {
                  // Skip invalid files
                }
              }
            }
          }
        }

        const seen = new Set<string>();
        const unique = collected
          .filter((p) => {
            if (!p || typeof p !== "string") return false;
            const normalized = p.startsWith("/") ? p : `/${p}`;
            if (seen.has(normalized)) return false;
            seen.add(normalized);
            return true;
          })
          .map((s) => (s.startsWith("/") ? s : `/${s}`));

        return NextResponse.json({ paths: unique, map, displayMap });
      }

      // ======================================================================
      // Get Script (404.js)
      // ======================================================================
      case "get-script": {
        const scriptPath = path.join(
          process.cwd(),
          "public",
          "scripts",
          "404.js"
        );
        const scriptContent = await fsPromises.readFile(scriptPath, "utf-8");

        return new NextResponse(scriptContent, {
          headers: {
            "Content-Type": "application/javascript",
          },
        }) as any;
      }

      // ======================================================================
      // GitHub File
      // ======================================================================
      case "github-file": {
        const url = searchParams.get("url");

        if (!url) {
          return NextResponse.json(
            { error: "Missing URL parameter" } as any,
            { status: 400 }
          );
        }

        const token = process.env.GITHUB_TOKEN;

        let owner: string,
          repo: string,
          branch: string,
          filePath: string;

        if (url.includes("raw.githubusercontent.com")) {
          const parts = url
            .replace("https://raw.githubusercontent.com/", "")
            .split("/");
          owner = parts[0];
          repo = parts[1];
          branch = parts[2];
          filePath = parts.slice(3).join("/");
        } else {
          const parts = url.replace("https://github.com/", "").split("/");
          owner = parts[0];
          repo = parts[1];
          branch = parts[3];
          filePath = parts.slice(4).join("/");
        }

        if (owner.toLowerCase() !== ALLOWED_GITHUB_USER.toLowerCase()) {
          return NextResponse.json(
            { error: "Unauthorized GitHub owner" } as any,
            { status: 403 }
          );
        }

        const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`;

        const cached = githubCache.get(apiUrl);
        const now = Date.now();
        if (cached && cached.expiresAt > now) {
          return NextResponse.json({ content: cached.content });
        }

        const headers: HeadersInit = {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github.v3.raw",
        };

        const res = await fetch(apiUrl, { headers });

        if (!res.ok) {
          return NextResponse.json(
            { error: `Failed to fetch file: ${res.status}` } as any,
            { status: res.status }
          );
        }

        const content = await res.text();

        githubCache.set(apiUrl, {
          content,
          expiresAt: now + CACHE_DURATION_MS,
        });

        return NextResponse.json({ content });
      }

      default:
        return NextResponse.json(
          { error: `Unknown type: ${type}. Valid types: 404-suggester, get-script, github-file` } as any,
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error("Error in utils API:", error);
    return NextResponse.json(
      { error: "Failed to process request", details: error.message } as any,
      { status: 500 }
    );
  }
}

// ============================================================================
// POST Handler (TikZ)
// ============================================================================

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    if (type !== "tikz") {
      return NextResponse.json(
        { error: "POST only supports type=tikz" },
        { status: 400 }
      );
    }

    const json = (await request.json()) as { code?: string };
    const { code } = json;

    if (!code) {
      return NextResponse.json(
        { error: "No TikZ code provided" },
        { status: 400 }
      );
    }

    const hasLatex = commandExists("latex");
    const hasDvisvgm = commandExists("dvisvgm");

    if (process.env.VERCEL || !hasLatex) {
      const fallbackSVG = generateFallbackSVG(
        "Pre-rendered SVGs available in public/tikz-svg"
      );
      return new NextResponse(fallbackSVG, {
        headers: {
          "Content-Type": "image/svg+xml",
          "Cache-Control": "s-maxage=86400, stale-while-revalidate",
        },
      });
    }

    if (!hasLatex) {
      return NextResponse.json(
        {
          error: "TeX compilation not available",
          details: "latex is not available on this system",
        },
        { status: 500 }
      );
    }

    if (!hasDvisvgm) {
      return NextResponse.json(
        {
          error: "SVG conversion not available",
          details: "dvisvgm is not available on this system",
        },
        { status: 500 }
      );
    }

    let baseDir =
      os.platform() === "win32" ? "c:\\tikztemp" : os.tmpdir();
    const dirId = randomUUID().slice(0, 8);
    let tmp = path.join(baseDir, dirId);

    try {
      fs.mkdirSync(tmp, { recursive: true });
    } catch (err) {
      if (os.platform() === "win32") {
        baseDir = "c:\\temp";
        const fallbackTmp = path.join(baseDir, `tikz-${dirId}`);
        try {
          fs.mkdirSync(baseDir, { recursive: true });
          fs.mkdirSync(fallbackTmp, { recursive: true });
          tmp = fallbackTmp;
        } catch (fallbackErr) {
          return NextResponse.json(
            {
              error: "Failed to create temporary directory",
              details: (fallbackErr as Error).message,
            },
            { status: 500 }
          );
        }
      } else {
        return NextResponse.json(
          {
            error: "Failed to create temporary directory",
            details: (err as Error).message,
          },
          { status: 500 }
        );
      }
    }

    const texFile = path.join(tmp, "diagram.tex");
    const dviFile = path.join(tmp, "diagram.dvi");
    const svgFile = path.join(tmp, "diagram.svg");

    const tex = `
\\documentclass[tikz,border=2pt]{standalone}
\\usepackage{tikz}
\\usetikzlibrary{
  arrows.meta,
  positioning,
  shapes.geometric,
  matrix,
  cd,
  calc,
  decorations.pathmorphing,
  backgrounds
}
\\begin{document}
${code}
\\end{document}
`.trim();

    fs.writeFileSync(texFile, tex);

    const outputDir = tmp.replace(/\\/g, "/");

    const latexResult = spawnSync(
      "latex",
      ["-interaction=nonstopmode", `-output-directory=${outputDir}`, texFile],
      { shell: true }
    );

    if (latexResult.error || latexResult.status !== 0) {
      return NextResponse.json(
        {
          error: "TikZ compilation failed: latex error",
          details:
            latexResult.stderr?.toString() || latexResult.error?.message,
        },
        { status: 500 }
      );
    }

    const dvisvgmResult = spawnSync(
      "dvisvgm",
      ["--no-fonts", dviFile, "-o", svgFile],
      { shell: true }
    );

    if (dvisvgmResult.error || dvisvgmResult.status !== 0) {
      return NextResponse.json(
        {
          error: "TikZ compilation failed: dvisvgm error",
          details:
            dvisvgmResult.stderr?.toString() || dvisvgmResult.error?.message,
        },
        { status: 500 }
      );
    }

    try {
      const svg = fs.readFileSync(svgFile, "utf8");
      return new NextResponse(svg, {
        headers: {
          "Content-Type": "image/svg+xml",
          "Cache-Control": "s-maxage=86400, stale-while-revalidate",
        },
      });
    } catch (err) {
      return NextResponse.json(
        {
          error: "Failed to read generated SVG file",
          details: (err as Error).message,
        },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error("Error processing TikZ request:", err);
    return NextResponse.json(
      {
        error: "Error processing TikZ request",
        details: (err as Error).message,
      },
      { status: 500 }
    );
  }
}
