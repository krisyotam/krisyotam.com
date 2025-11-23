import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = 'force-dynamic';

// Read and parse JSON safely
function readJsonSync(filePath: string) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    // If JSON is invalid or file unreadable, return null so caller can skip
    return null;
  }
}

function slugify(input: string) {
  return String(input || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function pushIfInternal(arr: string[], candidate: string) {
  if (!candidate || typeof candidate !== 'string') return;
  // Only include internal absolute paths (start with '/') or bare slugs
  if (candidate.startsWith('/')) arr.push(candidate);
  else if (/^[a-z0-9\-_/]+$/i.test(candidate)) arr.push(candidate.startsWith('/') ? candidate : `/${candidate}`);
}

function extractPathsFromData(data: any, folderName: string | null, out: string[]) {
  if (!data) return;

  // page-directory style
  if (Array.isArray(data.pages)) {
    data.pages.forEach((p: any) => p && p.path && out.push(p.path));
  }

  // posts-like structure
  if (Array.isArray(data.posts)) {
    data.posts.forEach((post: any) => {
      if (!post) return;
      if (post.path) pushIfInternal(out, post.path);
      else if (post.permalink) pushIfInternal(out, post.permalink);
      else if (post.slug) {
        const prefix = folderName ? `/${folderName}` : '/blog';
        if (post.category && typeof post.category === 'string') {
          out.push(`${prefix}/${slugify(post.category)}/${post.slug}`);
          out.push(`${prefix}/${post.slug}`);
        } else {
          out.push(`${prefix}/${post.slug}`);
        }
      }
    });
  }

  // top-level slug/path
  if (data.slug && typeof data.slug === 'string') {
    const prefix = folderName ? `/${folderName}` : '/blog';
    if (data.category && typeof data.category === 'string') {
      out.push(`${prefix}/${slugify(data.category)}/${data.slug}`);
      out.push(`${prefix}/${data.slug}`);
    } else {
      out.push(`${prefix}/${data.slug}`);
    }
  }
  if (data.path && typeof data.path === 'string') pushIfInternal(out, data.path);

  // arrays of generic items
  if (Array.isArray(data)) {
    data.forEach((item: any) => {
      if (!item || typeof item !== 'object') return;
      if (item.path) pushIfInternal(out, item.path);
      else if (item.url) pushIfInternal(out, item.url);
      else if (item.permalink) pushIfInternal(out, item.permalink);
      else if (item.slug) {
        const prefix = folderName ? `/${folderName}` : `/${slugify(path.basename(process.cwd()))}`;
        if (item.category && typeof item.category === 'string') {
          out.push(`${prefix}/${slugify(item.category)}/${item.slug}`);
          out.push(`${prefix}/${item.slug}`);
        } else {
          out.push(`${prefix}/${item.slug}`);
        }
      }

      if (item.category && typeof item.category === 'string') {
        out.push(`/category/${slugify(item.category)}`);
        if (folderName) out.push(`/${folderName}/category/${slugify(item.category)}`);
      }
      if (item.tags && Array.isArray(item.tags)) {
        item.tags.forEach((t: any) => typeof t === 'string' && (out.push(`/tag/${slugify(t)}`), folderName && out.push(`/${folderName}/tag/${slugify(t)}`)));
      }
    });
  }

  // tags / categories lists
  if (Array.isArray(data.tags)) {
    data.tags.forEach((tag: any) => {
      const slug = tag && (tag.slug || tag.name || tag);
      if (slug) {
        const s = slugify(slug as string);
        out.push(`/tag/${s}`);
        if (folderName) out.push(`/${folderName}/tag/${s}`);
      }
    });
  }

  if (Array.isArray(data.categories)) {
    data.categories.forEach((cat: any) => {
      const slug = cat && (cat.slug || cat.name || cat);
      if (slug) {
        const s = slugify(slug as string);
        out.push(`/category/${s}`);
        if (folderName) out.push(`/${folderName}/category/${s}`);
      }
    });
  }
}

export async function GET(request: Request) {
  const dataDir = path.join(process.cwd(), 'data');
  const collected: string[] = [];

  try {
    if (!fs.existsSync(dataDir)) {
      return NextResponse.json({ paths: [], map: {} });
    }

    const entries = fs.readdirSync(dataDir, { withFileTypes: true });

    // Build a hard map describing root files and per-folder JSON files
    const map: any = { rootFiles: [], folders: {} };

    // First pass: files at the root of /data
    for (const ent of entries) {
      if (ent.isFile() && ent.name.endsWith('.json')) {
        const filePath = path.join(dataDir, ent.name);
        map.rootFiles.push(ent.name);
        const data = readJsonSync(filePath);
        try { extractPathsFromData(data, null, collected); } catch (e) { /* ignore */ }
      }
    }

    // Second pass: directories under /data — treat directory name as route prefix
    for (const ent of entries) {
      if (!ent.isDirectory()) continue;
      const folderName = ent.name;
      const folderPath = path.join(dataDir, folderName);
      const subFiles = fs.readdirSync(folderPath, { withFileTypes: true });
      map.folders[folderName] = { files: [], hasPosts: false, hasTags: false, hasCategories: false };
      for (const sf of subFiles) {
        if (sf.isFile() && sf.name.endsWith('.json')) {
          map.folders[folderName].files.push(sf.name);
          const lower = sf.name.toLowerCase();
          if (lower.includes('tag') || lower.includes('tags')) map.folders[folderName].hasTags = true;
          if (lower.includes('category') || lower.includes('categories')) map.folders[folderName].hasCategories = true;
          if (lower.includes('post') || lower.includes('essay') || lower.includes('feed') || lower.includes('entries') || lower.includes('news') || lower.includes('writing') || lower.includes('essays') || lower.includes('notes') || lower.includes('libers') || lower.includes('conspiracies') || lower.includes('links') || lower.includes('proofs')) map.folders[folderName].hasPosts = true;

          const filePath = path.join(folderPath, sf.name);
          const data = readJsonSync(filePath);
          try { extractPathsFromData(data, folderName, collected); } catch (e) { /* ignore */ }
        }
      }
    }

    // Also include explicit page paths from page-directory.json if present (already handled above but keep dedupe)

    // Deduplicate preserving order
    const seen = new Set();
    const unique = collected.filter(p => {
      if (!p || typeof p !== 'string') return false;
      const normalized = p.startsWith('/') ? p : `/${p}`;
      if (seen.has(normalized)) return false;
      seen.add(normalized);
      return true;
    }).map(s => s.startsWith('/') ? s : `/${s}`);

    return NextResponse.json({ paths: unique, map });
  } catch (err) {
    return NextResponse.json({ paths: [], error: String(err) }, { status: 500 });
  }
}
