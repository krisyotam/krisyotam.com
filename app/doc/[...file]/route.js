import { join } from "path";
import { statSync, createReadStream } from "fs";

export function GET(request, { params }) {
  try {
    const filePath = join("/doc", ...params.file);

    // Throws if missing
    const stat = statSync(filePath);

    const stream = createReadStream(filePath);

    return new Response(stream, {
      headers: {
        "Content-Length": stat.size.toString(),
        "Content-Type": "application/octet-stream"
      }
    });
  } catch (err) {
    return new Response("Not found", { status: 404 });
  }
}
