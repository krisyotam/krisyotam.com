// app/api/mal/fav-companies/route.ts
export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { getFavoriteCompanies } from "@/lib/mal-api";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");
    if (!username) {
      return NextResponse.json(
        { error: "Username parameter is required" },
        { status: 400 }
      );
    }

    const accessToken = process.env.MAL_ACCESS_TOKEN;
    if (!accessToken) {
      return NextResponse.json(
        { error: "Missing MAL_ACCESS_TOKEN in environment" },
        { status: 500 }
      );
    }

    const companies = await getFavoriteCompanies(username, accessToken);
    return NextResponse.json(companies);
  } catch (error: any) {
    console.error("Error fetching favorite companies:", error);
    return NextResponse.json(
      { error: "Failed to fetch favorite companies", details: error.message },
      { status: 500 }
    );
  }
}
