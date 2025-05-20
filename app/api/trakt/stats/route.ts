// app/api/trakt/stats/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Use static rendering instead of dynamic
export const dynamic = 'force-static';

export async function GET() {
  try {
    // Static stats data instead of API call
    const statsData = {
      movies: {
        plays: 850,
        watched: 750,
        minutes: 108000,
        collected: 820,
        ratings: 730,
        comments: 45
      },
      shows: {
        watched: 120,
        collected: 135,
        ratings: 110,
        comments: 35
      },
      episodes: {
        plays: 2500,
        watched: 2400,
        minutes: 72000,
        collected: 2450,
        ratings: 1500,
        comments: 80
      },
      network: {
        friends: 35,
        followers: 320,
        following: 105
      }
    };

    console.log("Using static watched stats data");
    return NextResponse.json(statsData);
  } catch (error) {
    console.error("Error fetching watched stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch watched stats" },
      { status: 500 }
    );
  }
}
