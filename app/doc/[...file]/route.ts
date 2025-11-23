import { NextRequest } from "next/server";
import { join } from "node:path";
import { statSync, readFileSync } from "node:fs";
import mime from "mime-types";

export async function GET(
  req: NextRequest,
  { params }: { params: { file: string[] } }
) {
  try {
    const filePath = join("/doc", ...params.file);

    const stat = statSync(filePath);
    const fileBuffer = readFileSync(filePath);

    const uint8 = new Uint8Array(fileBuffer);

    // Determine Content-Type
    const mimeType =
      mime.lookup(filePath) || "application/octet-stream";

    return new Response(uint8, {
      headers: {
        "Content-Length": stat.size.toString(),
        "Content-Type": mimeType.toString()
      }
    });
  } catch (err) {
    return new Response("Not found", { status: 404 });
  }
}
