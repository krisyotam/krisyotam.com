import { NextResponse } from "next/server";
import tags from "@/data/essays/tags.json";

export async function GET() {
  return NextResponse.json(tags);
}
