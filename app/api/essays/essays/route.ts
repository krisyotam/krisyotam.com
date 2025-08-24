import { NextResponse } from "next/server";
import essays from "@/data/essays/essays.json";

export async function GET() {
  return NextResponse.json(essays);
}
