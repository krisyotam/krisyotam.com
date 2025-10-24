import { NextResponse } from "next/server";
import quotes from "@/data/header-quotes.json"; // 👈 adjust if path differs

export async function GET() {
  return NextResponse.json(quotes);
}
