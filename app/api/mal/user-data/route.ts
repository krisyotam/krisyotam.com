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

    console.log("MAL API Debug - Access Token present:", !!accessToken);
    console.log("MAL API Debug - Username:", username);

    if (!accessToken) {
      console.error("MAL API Debug - Access token is missing");
      return NextResponse.json(
        { error: "MAL_ACCESS_TOKEN not set" },
        { status: 500 }
      );
    }

    // Profile
    console.log("MAL API Debug - Fetching user profile...");
    const profile = await getUserProfile(accessToken);
    console.log("MAL API Debug - Profile fetched successfully");

    // Anime lists
    let watching: any[] = [];
    let completed: any[] = [];
    try {
      console.log("MAL API Debug - Fetching watching anime...");
      watching = await getUserAnimeList(accessToken, "watching");
      console.log("MAL API Debug - Watching anime fetched successfully");
    } catch (e) {
      console.error("MAL API Debug - Error fetching watching anime:", e);
    }
    try {
      console.log("MAL API Debug - Fetching completed anime...");
      completed = await getUserAnimeList(accessToken, "completed");
      console.log("MAL API Debug - Completed anime fetched successfully");
    } catch (e) {
      console.error("MAL API Debug - Error fetching completed anime:", e);
    }

    // Manga lists
    let reading: any[] = [];
    let completedManga: any[] = [];
    try {
      console.log("MAL API Debug - Fetching reading manga...");
      reading = await getUserMangaList(accessToken, "reading");
      console.log("MAL API Debug - Reading manga fetched successfully");
    } catch (e) {
      console.error("MAL API Debug - Error fetching reading manga:", e);
    }
    try {
      console.log("MAL API Debug - Fetching completed manga...");
      completedManga = await getUserMangaList(accessToken, "completed");
      console.log("MAL API Debug - Completed manga fetched successfully");
    } catch (e) {
      console.error("MAL API Debug - Error fetching completed manga:", e);
    }

    // Favorites
    let favorites = { anime: [], manga: [], characters: [] };
    try {
      console.log("MAL API Debug - Fetching favorites...");
      favorites = await getUserFavorites(username, accessToken);
      console.log("MAL API Debug - Favorites fetched successfully");
    } catch (e) {
      console.error("MAL API Debug - Error fetching favorites:", e);
    }

    console.log("MAL API Debug - All data fetched successfully, returning response");
    return NextResponse.json({
      profile,
      anime: { watching, completed },
      manga: { reading, completed: completedManga },
      favorites,
    });
  } catch (error: any) {
    console.error("MAL API Debug - Error in user-data route:", error);
    console.error("MAL API Debug - Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return NextResponse.json(
      { error: "Failed to fetch user data", details: error.message },
      { status: 500 }
    );
  }
}
