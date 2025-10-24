import { NextRequest, NextResponse } from 'next/server';


export const dynamic = 'force-dynamic';
const ALLOWED_GITHUB_USER = "krisyotam"; // Hardcoded your username

// Simple in-memory cache (lives only while the server is running)
const cache = new Map<string, { content: string; expiresAt: number }>();

const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'Missing URL parameter' }, { status: 400 });
  }

  const token = process.env.GITHUB_TOKEN; // Server-side only

  try {
    let owner: string, repo: string, branch: string, path: string;

    if (url.includes('raw.githubusercontent.com')) {
      const parts = url.replace('https://raw.githubusercontent.com/', '').split('/');
      owner = parts[0];
      repo = parts[1];
      branch = parts[2];
      const pathParts = parts.slice(3);
      path = pathParts.join('/');
    } else {
      const parts = url.replace('https://github.com/', '').split('/');
      owner = parts[0];
      repo = parts[1];
      branch = parts[3];
      const pathParts = parts.slice(4);
      path = pathParts.join('/');
    }

    // SAFETY CHECK: Only allow YOUR GitHub username
    if (owner.toLowerCase() !== ALLOWED_GITHUB_USER.toLowerCase()) {
      return NextResponse.json({ error: 'Unauthorized GitHub owner' }, { status: 403 });
    }

    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;

    // Check if response is cached and still valid
    const cached = cache.get(apiUrl);
    const now = Date.now();
    if (cached && cached.expiresAt > now) {
      return NextResponse.json({ content: cached.content });
    }

    // Not cached or cache expired: fetch fresh
    const headers: HeadersInit = {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3.raw',
    };

    const res = await fetch(apiUrl, { headers });

    if (!res.ok) {
      return NextResponse.json({ error: `Failed to fetch file: ${res.status}` }, { status: res.status });
    }

    const content = await res.text();

    // Save in cache
    cache.set(apiUrl, {
      content,
      expiresAt: now + CACHE_DURATION_MS,
    });

    return NextResponse.json({ content });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

