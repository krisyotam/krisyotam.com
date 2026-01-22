import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Inline stripFrontmatter to avoid conflict with webpack loader (.js file)
const DELIMITER = '# ==============================================================================';

function stripFrontmatter(raw: string): string {
  const lines = raw.split('\n');
  let delimiterCount = 0;
  let contentStartIndex = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === DELIMITER) {
      delimiterCount++;
      if (delimiterCount === 4) {
        contentStartIndex = i + 1;
        break;
      }
    }
  }

  if (delimiterCount < 4) {
    return raw;
  }

  return lines.slice(contentStartIndex).join('\n').trim();
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const type = url.searchParams.get("type");
  const slug = url.searchParams.get("slug");

  if (!type || !slug) {
    return NextResponse.json({ error: "Missing type or slug" }, { status: 400 });
  }

  try {
    const filePath = path.join(process.cwd(), "src", "app", "(content)", "verse", "content", type, `${slug}.mdx`);

    // Check if file exists
    const exists = fs.existsSync(filePath);
    if (!exists) {
      console.error(`File not found: ${filePath}`);
      return NextResponse.json({ error: `File not found: ${type}/${slug}.mdx` }, { status: 404 });
    }

    const raw = await fs.promises.readFile(filePath, "utf-8");

    // Strip header and frontmatter blocks, return only content
    const content = stripFrontmatter(raw);

    return NextResponse.json({
      content: content,
      type: "mdx"
    });
  } catch (error) {
    console.error(`Error reading poem content for ${type}/${slug}:`, error);
    return NextResponse.json({ error: "Failed to read poem content" }, { status: 500 });
  }
}
