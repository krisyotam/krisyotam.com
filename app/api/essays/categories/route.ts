import { NextResponse } from "next/server";
import categories from "@/data/essays/categories.json";

export async function GET() {
  return NextResponse.json(categories);
}
