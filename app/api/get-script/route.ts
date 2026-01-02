import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET() {
  try {
    const scriptPath = path.join(process.cwd(), "public", "scripts", "404-suggester.js");
    const scriptContent = await fs.readFile(scriptPath, "utf-8");

    return new NextResponse(scriptContent, {
      headers: {
        "Content-Type": "application/javascript",
      },
    });
  } catch (error) {
    console.error("Error serving 404-suggester.js:", error);
    return new NextResponse("Failed to load script", { status: 500 });
  }
}