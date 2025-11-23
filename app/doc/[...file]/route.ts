import { NextRequest } from "next/server";
import { join } from "node:path";
import { statSync, readFileSync } from "node:fs";

export async function GET(
  req: NextRequest,
  { params }: { params: { file: string[] } }
) {
  try {
    const filePath = join("/doc", ...params.file);

    const stat = statSync(filePath);
    const fileBuffer = readFileSync(filePath);

    // Convert Node Buffer → Uint8Array (always valid Response body)
    const uint8 = new Uint8Array(fileBuffer);

    return new Response(uint8, {
      headers: {
        "Content-Length": stat.size.toString(),
        "Content-Type": "application/octet-stream"
      }
    });
  } catch (err) {
    return new Response("Not found", { status: 404 });
  }
}
