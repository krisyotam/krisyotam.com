import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";


export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
  const url = new URL(request.url);
  const fileName = url.searchParams.get("file");

  if (!fileName) {
    return new NextResponse("File parameter is required", { status: 400 });
  }

  try {
    const filePath = path.join(process.cwd(), "data", fileName);
    const fileContent = await fs.readFile(filePath, "utf-8");

    return new NextResponse(fileContent, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(`Error serving JSON file (${fileName}):`, error);
    return new NextResponse("Failed to load file", { status: 500 });
  }
}
