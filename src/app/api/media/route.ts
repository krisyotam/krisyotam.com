/**
 * ============================================================================
 * Unified Media API Route
 * ============================================================================
 * Author: Kris Yotam
 * Date: 2026-01-24
 *
 * Consolidates all reading, library, and video endpoints into a single route.
 *
 * Usage:
 *   GET /api/media?source=reading&type=audiobooks    → Reading audiobooks
 *   GET /api/media?source=reading&type=blogs         → Reading blogs
 *   GET /api/media?source=reading&type=books         → Reading books
 *   GET /api/media?source=reading&type=essays        → Reading essays
 *   GET /api/media?source=reading&type=papers        → Reading papers
 *   GET /api/media?source=reading&type=lists         → Reading lists
 *   GET /api/media?source=reading&type=log           → Reading log
 *   GET /api/media?source=reading&type=now           → Currently reading
 *   GET /api/media?source=reading&type=short-stories → Short stories
 *   GET /api/media?source=reading&type=verse         → Reading verse
 *   GET /api/media?source=reading&type=want-to-read  → Want to read
 *   GET /api/media?source=library&type=catalog       → Library catalog
 *   GET /api/media?source=library&type=notes         → Library notes
 *   GET /api/media?source=videos                     → Videos
 *   GET /api/media?source=mal&type=user-data         → MAL user profile, anime/manga lists, favorites
 *   GET /api/media?source=mal&type=fav-people&username=x → MAL favorite people
 *
 * @type api
 * @path src/app/api/media/route.ts
 * ============================================================================
 */

import { NextResponse } from "next/server";
import {
  getReadingAudiobooks,
  getReadingBlogs,
  getReadingBooks,
  getReadingEssays,
  getReadingPapers,
  getReadingLists,
  getReadingLog,
  getReadingNow,
  getShortStories,
  getReadingVerse,
  getWantToRead,
  getLibraryBooks,
  getLibraryNotes,
  getAll404Blocks,
  get404BlockCount,
} from "@/lib/media-db";
import { getActiveVideos, getCategoryBySlug } from "@/lib/content-db";
import {
  getUserProfile,
  getUserAnimeList,
  getUserMangaList,
  getUserFavorites,
  getFavoritePeople,
} from "@/lib/mal-api";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get("source");
    const type = searchParams.get("type");

    if (!source) {
      return NextResponse.json(
        { error: "Missing 'source' parameter. Valid sources: reading, library, videos, mal" },
        { status: 400 }
      );
    }

    switch (source) {
      // ========================================================================
      // Reading
      // ========================================================================
      case "reading": {
        if (!type) {
          return NextResponse.json(
            { error: "Missing 'type' parameter for reading. Valid types: audiobooks, blogs, books, essays, papers, lists, log, now, short-stories, verse, want-to-read" },
            { status: 400 }
          );
        }

        switch (type) {
          case "audiobooks": {
            const audiobooks = getReadingAudiobooks();
            return NextResponse.json({ audiobooks });
          }
          case "blogs": {
            const blogs = getReadingBlogs();
            return NextResponse.json({ blogs });
          }
          case "books": {
            const books = getReadingBooks();
            return NextResponse.json({ books });
          }
          case "essays": {
            const essays = getReadingEssays();
            return NextResponse.json({ essays });
          }
          case "papers": {
            const papers = getReadingPapers();
            return NextResponse.json({ papers });
          }
          case "lists": {
            const lists = getReadingLists();
            const formattedLists = lists.map((list) => ({
              id: list.list_id,
              title: list.title,
              description: list.description,
              author: list.author,
              books: list.books,
            }));
            return NextResponse.json({ lists: formattedLists });
          }
          case "log": {
            const log = getReadingLog();
            return NextResponse.json({ log });
          }
          case "now": {
            const now = getReadingNow();
            return NextResponse.json({ now });
          }
          case "short-stories": {
            const stories = getShortStories();
            return NextResponse.json({ stories });
          }
          case "verse": {
            const verse = getReadingVerse();
            return NextResponse.json({ verse });
          }
          case "want-to-read": {
            const wantToRead = getWantToRead();
            return NextResponse.json({ wantToRead });
          }
          default:
            return NextResponse.json(
              { error: `Unknown reading type: ${type}` },
              { status: 400 }
            );
        }
      }

      // ========================================================================
      // Library
      // ========================================================================
      case "library": {
        if (!type) {
          return NextResponse.json(
            { error: "Missing 'type' parameter for library. Valid types: catalog, notes" },
            { status: 400 }
          );
        }

        switch (type) {
          case "catalog": {
            const books = getLibraryBooks();
            return NextResponse.json(books);
          }
          case "notes": {
            const notes = getLibraryNotes();
            return NextResponse.json({ notes });
          }
          default:
            return NextResponse.json(
              { error: `Unknown library type: ${type}` },
              { status: 400 }
            );
        }
      }

      // ========================================================================
      // Videos
      // ========================================================================
      case "videos": {
        const videos = getActiveVideos();
        const transformedVideos = videos.map((video) => {
          const category = video.category_slug
            ? getCategoryBySlug(video.category_slug)
            : null;

          return {
            slug: video.slug,
            title: video.title,
            subtitle: video.subtitle || "",
            preview: video.preview || "",
            image: video.image || "",
            video: video.video || "",
            category: category?.title || video.category_slug || "",
            tags: video.tags?.map((t: any) => t.title) || [],
            date: video.date || "",
            status: video.status || "Finished",
            confidence: video.confidence || "likely",
            importance: video.importance || 5,
            state: video.state,
          };
        });
        return NextResponse.json(transformedVideos);
      }

      // ========================================================================
      // MAL (MyAnimeList)
      // ========================================================================
      case "mal": {
        if (!type) {
          return NextResponse.json(
            { error: "Missing 'type' parameter for mal. Valid types: user-data, fav-people" },
            { status: 400 }
          );
        }

        const accessToken = process.env.MAL_ACCESS_TOKEN;
        if (!accessToken) {
          return NextResponse.json(
            { error: "MAL_ACCESS_TOKEN not set" },
            { status: 500 }
          );
        }

        switch (type) {
          case "user-data": {
            const username = "krisyotam";

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

            // Favorites
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
          }

          case "fav-people": {
            const username = searchParams.get("username");
            if (!username) {
              return NextResponse.json(
                { error: "Username parameter is required" },
                { status: 400 }
              );
            }

            const people = await getFavoritePeople(username, accessToken);
            return NextResponse.json(people);
          }

          default:
            return NextResponse.json(
              { error: `Unknown mal type: ${type}` },
              { status: 400 }
            );
        }
      }

      // ========================================================================
      // 404 Blocks
      // ========================================================================
      case "404": {
        const IMG_BASE = "https://krisyotam.com/doc/assets/404/img/";
        const AUDIO_BASE = "https://krisyotam.com/doc/assets/404/audio/";
        const VIDEO_BASE = "https://krisyotam.com/doc/assets/404/videos/";

        const TIER_RATES: Record<string, number> = {
          common: 0.50,
          uncommon: 0.25,
          rare: 0.15,
          legendary: 0.08,
          mythic: 0.02,
        };

        const blocks = getAll404Blocks();
        const counts = get404BlockCount();

        if (blocks.length === 0) {
          return NextResponse.json({ error: "No 404 blocks found" }, { status: 404 });
        }

        const resolveUrls = (b: typeof blocks[0]) => ({
          id: b.id,
          img: b.img.startsWith("http") ? b.img : IMG_BASE + b.img,
          msg: b.msg,
          status: b.status,
          invert: b.invert,
          audio: b.audio
            ? b.audio.startsWith("http") ? b.audio : AUDIO_BASE + b.audio
            : null,
          video: b.video
            ? b.video.startsWith("http") ? b.video : VIDEO_BASE + b.video
            : null,
        });

        // Return all blocks for the cards index page
        if (type === "all") {
          return NextResponse.json({
            blocks: blocks.map(resolveUrls),
            counts,
            tierRates: TIER_RATES,
          });
        }

        // Weighted random selection: pick a tier first, then a random item within it
        const tierEntries = Object.entries(TIER_RATES).filter(([tier]) => (counts[tier] || 0) > 0);
        const totalWeight = tierEntries.reduce((sum, [, w]) => sum + w, 0);
        let roll = Math.random() * totalWeight;
        let selectedTier = tierEntries[0][0];
        for (const [tier, weight] of tierEntries) {
          roll -= weight;
          if (roll <= 0) {
            selectedTier = tier;
            break;
          }
        }

        const tierBlocks = blocks.filter((b) => b.status === selectedTier);
        const selected = tierBlocks[Math.floor(Math.random() * tierBlocks.length)];
        const resolved = resolveUrls(selected);

        const tierRate = TIER_RATES[selected.status] || 0;
        const itemsInTier = counts[selected.status] || 1;
        const pullChance = tierRate / itemsInTier;

        return NextResponse.json({
          block: resolved,
          pull: {
            tierRate,
            itemsInTier,
            chance: pullChance,
          },
          counts,
        });
      }

      default:
        return NextResponse.json(
          { error: `Unknown source: ${source}. Valid sources: reading, library, videos, mal, 404` },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error("Error in media API:", error);
    return NextResponse.json(
      { error: "Failed to fetch media data", details: error.message },
      { status: 500 }
    );
  }
}
