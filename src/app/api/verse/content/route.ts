import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const type = url.searchParams.get("type");
  const slug = url.searchParams.get("slug");

  if (!type || !slug) {
    return NextResponse.json({ error: "Missing type or slug" }, { status: 400 });
  }

  try {
    const filePath = path.join(process.cwd(), "src", "app", "(content)", "verse", "content", type, `${slug}.mdx`);
    const content = await fs.promises.readFile(filePath, "utf-8");
    
    // Return the raw content with line breaks preserved
    return NextResponse.json({ 
      content: content,
      type: "mdx"
    });
  } catch (error) {
    console.error(`Error reading poem content: ${error}`);
    return NextResponse.json({ error: "Poem not found" }, { status: 404 });
  }
}
