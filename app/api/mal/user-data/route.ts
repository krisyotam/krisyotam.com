// app/api/mal/user-data/route.ts
export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import {
  getUserProfile,
  getUserAnimeList,
  getUserMangaList,
  getUserFavorites
} from "@/lib/mal-api";

export async function GET() {
  try {
    const accessToken = process.env.MAL_ACCESS_TOKEN;
    const username = "krisyotam";

    if (!accessToken) {
      return NextResponse.json(
        { error: "MAL_ACCESS_TOKEN not set" },
        { status: 500 }
      );
    }

    // Profile
    const profile = await getUserProfile(accessToken);

    // Anime lists
    let watching: any[] = [];
    let completed: any[] = [];
    try {
      watching = await getUserAnimeList(accessToken, "watching");
    } catch (e) {
      console.error("Error fetching watching anime:", e);
    }
    try {
      completed = await getUserAnimeList(accessToken, "completed");
    } catch (e) {
      console.error("Error fetching completed anime:", e);
    }

    // Manga lists
    let reading: any[] = [];
    let completedManga: any[] = [];
    try {
      reading = await getUserMangaList(accessToken, "reading");
    } catch (e) {
      console.error("Error fetching reading manga:", e);
    }
    try {
      completedManga = await getUserMangaList(accessToken, "completed");
    } catch (e) {
      console.error("Error fetching completed manga:", e);
    }

    // Favorites (now passes both username and token)
    let favorites = { anime: [], manga: [], characters: [] };
    try {
      favorites = await getUserFavorites(username, accessToken);
    } catch (e) {
      console.error("Error fetching favorites:", e);
    }

    return NextResponse.json({
      profile,
      anime: { watching, completed },
      manga: { reading, completed: completedManga },
      favorites,
    });
  } catch (error: any) {
    console.error("Error in user-data route:", error);
    return NextResponse.json(
      { error: "Failed to fetch user data", details: error.message },
      { status: 500 }
    );
  }
}
