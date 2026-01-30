/**
 * ============================================================================
 * Unified Interactions API Route
 * ============================================================================
 * Author: Kris Yotam
 * Date: 2026-01-24
 *
 * Consolidates user interaction endpoints (hearts, reactions, page-view).
 *
 * Usage:
 *   GET  /api/interactions?type=hearts          → Check heart count & user status
 *   POST /api/interactions?type=hearts          → Increment heart
 *   GET  /api/interactions?type=reactions&context=now&slug=x  → Get now reactions
 *   POST /api/interactions?type=reactions&context=now         → Toggle now reaction
 *   GET  /api/interactions?type=reactions&context=til&slug=x  → Get til reactions
 *   POST /api/interactions?type=reactions&context=til         → Toggle til reaction
 *   POST /api/interactions?type=pageview        → Record page view
 *   GET  /api/interactions?type=comments&pageSlug=x           → Get paginated comments
 *   POST /api/interactions?type=comments                      → Create comment
 *   PUT  /api/interactions?type=comments                      → Edit comment
 *   DELETE /api/interactions?type=comments&id=x               → Delete comment
 *   POST /api/interactions?type=comment-reactions             → Toggle comment reaction
 *
 * @type api
 * @path src/app/api/interactions/route.ts
 * ============================================================================
 */

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@/lib/supabase";
import { canDeleteAnyComment } from "@/lib/comments-config";
import {
  getLikeCount,
  addLike,
  getComments,
  getReplies,
  createComment,
  updateComment,
  deleteComment,
  getComment,
  getCommentReactions,
  getUserCommentReactions,
  toggleCommentReaction,
} from "@/lib/analytics-db";
import redis from "@/lib/redis";

const COMMENTS_PER_PAGE = 10;
const VALID_COMMENT_REACTIONS = ["thumbsUp", "thumbsDown", "party", "heart", "rocket", "eyes"];

// ============================================================================
// Page view helper
// ============================================================================

async function lookupCity(ip?: string | null) {
  try {
    const res = await fetch(`https://ipapi.co/${ip ?? ""}/json/`);
    const j = await res.json();
    return {
      country: j.country_code,
      city: j.city,
      flag: j.country_code
        ? String.fromCodePoint(
            0x1f1e6 - 65 + j.country_code.charCodeAt(0),
            0x1f1e6 - 65 + j.country_code.charCodeAt(1)
          )
        : "",
    };
  } catch {
    return { country: "??", city: null, flag: "" };
  }
}

// ============================================================================
// GET Handler
// ============================================================================

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    if (!type) {
      return NextResponse.json(
        { error: "Missing 'type' parameter. Valid types: hearts, reactions, comments" },
        { status: 400 }
      );
    }

    switch (type) {
      // ======================================================================
      // Comments (SQLite)
      // ======================================================================
      case "comments": {
        const pageSlug = searchParams.get("pageSlug");
        const page = parseInt(searchParams.get("page") || "1", 10);

        if (!pageSlug) {
          return NextResponse.json({
            comments: [],
            pagination: { page: 1, totalPages: 0, totalComments: 0, hasMore: false }
          });
        }

        // Get top-level comments with pagination
        const { comments, total } = getComments(pageSlug, page, COMMENTS_PER_PAGE);

        // Get replies for these comments
        const commentIds = comments.map((c) => c.id);
        const replies: Record<string, any[]> = {};

        for (const id of commentIds) {
          const commentReplies = getReplies(id);
          if (commentReplies.length > 0) {
            replies[id] = commentReplies;
          }
        }

        // Get all comment IDs including replies for reactions
        const allCommentIds = [
          ...commentIds,
          ...Object.values(replies).flat().map((r) => r.id),
        ];

        // Get reactions for all comments
        const commentReactionsData = getCommentReactions(allCommentIds);

        // Get current user's reactions
        let userReactionsData: Record<string, string[]> = {};
        const cookieStore = await cookies();
        const userCookie = cookieStore.get("github_user");
        if (userCookie) {
          try {
            const user = JSON.parse(userCookie.value);
            userReactionsData = getUserCommentReactions(allCommentIds, user.id);
          } catch {}
        }

        const totalPages = Math.ceil(total / COMMENTS_PER_PAGE);

        // Build comments with replies and reactions
        const commentsWithReplies = comments.map((comment) => ({
          ...comment,
          reactions: commentReactionsData[comment.id] || {},
          userReactions: userReactionsData[comment.id] || [],
          replies: (replies[comment.id] || []).map((reply) => ({
            ...reply,
            reactions: commentReactionsData[reply.id] || {},
            userReactions: userReactionsData[reply.id] || [],
          })),
        }));

        return NextResponse.json({
          comments: commentsWithReplies,
          pagination: {
            page,
            totalPages,
            totalComments: total,
            hasMore: page < totalPages,
          },
        });
      }

      // ======================================================================
      // Hearts (Likes)
      // ======================================================================
      case "hearts": {
        const cookieStore = await cookies();
        const hasLiked = cookieStore.has("has_liked");
        const count = getLikeCount("home");
        return NextResponse.json({ count, hasLiked });
      }

      // ======================================================================
      // Reactions (now/til)
      // ======================================================================
      case "reactions": {
        const context = searchParams.get("context");
        const slug = searchParams.get("slug");

        if (!context || !slug) {
          return NextResponse.json(
            { error: "Missing 'context' or 'slug' parameter" },
            { status: 400 }
          );
        }

        const cookieStore = await cookies();
        const userCookie = cookieStore.get("github_user");

        let userId: string | null = null;
        if (userCookie) {
          try {
            const user = JSON.parse(userCookie.value);
            userId = user.id;
          } catch {}
        }

        const supabase = createServerClient();
        const tableName = context === "now" ? "now_reactions" : "til_reactions";
        const slugColumn = context === "now" ? "now_slug" : "til_slug";

        const { data: reactionsData, error } = await supabase
          .from(tableName)
          .select("*")
          .eq(slugColumn, slug);

        if (error) {
          console.error(`Error fetching ${context} reactions:`, error);
          return NextResponse.json(
            { error: "Failed to fetch reactions" },
            { status: 500 }
          );
        }

        const reactions: Record<string, number> = {};
        const userReactions: string[] = [];

        for (const reaction of reactionsData || []) {
          reactions[reaction.reaction_type] =
            (reactions[reaction.reaction_type] || 0) + 1;
          if (userId && reaction.user_id === userId) {
            userReactions.push(reaction.reaction_type);
          }
        }

        return NextResponse.json({ reactions, userReactions });
      }

      default:
        return NextResponse.json(
          { error: `Unknown type: ${type}` },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error("Error in interactions API:", error);
    return NextResponse.json(
      { error: "Failed to fetch interaction data", details: error.message },
      { status: 500 }
    );
  }
}

// ============================================================================
// POST Handler
// ============================================================================

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    if (!type) {
      return NextResponse.json(
        { error: "Missing 'type' parameter. Valid types: hearts, reactions, pageview, comments, comment-reactions" },
        { status: 400 }
      );
    }

    switch (type) {
      // ======================================================================
      // Comments - Create (SQLite)
      // ======================================================================
      case "comments": {
        const cookieStore = await cookies();
        const userCookie = cookieStore.get("github_user");

        if (!userCookie) {
          return NextResponse.json({ error: "Authentication required" }, { status: 401 });
        }

        let user;
        try {
          user = JSON.parse(userCookie.value);
        } catch {
          return NextResponse.json({ error: "Invalid session" }, { status: 401 });
        }

        const body = await request.json();
        const { pageSlug, content, parentId } = body;

        if (!pageSlug || !content?.trim()) {
          return NextResponse.json({ error: "pageSlug and content are required" }, { status: 400 });
        }

        // If this is a reply, verify parent exists and is not itself a reply
        if (parentId) {
          const parentComment = getComment(parentId);

          if (!parentComment) {
            return NextResponse.json({ error: "Parent comment not found" }, { status: 404 });
          }

          if (parentComment.parent_id) {
            return NextResponse.json({ error: "Cannot reply to a reply" }, { status: 400 });
          }
        }

        const comment = createComment({
          pageSlug,
          content: content.trim(),
          userId: user.id,
          username: user.username,
          avatarUrl: user.avatar_url,
          parentId: parentId || null,
        });

        return NextResponse.json({
          comment: {
            ...comment,
            reactions: {},
            userReactions: [],
          },
        });
      }

      // ======================================================================
      // Comment Reactions - Toggle (SQLite)
      // ======================================================================
      case "comment-reactions": {
        const cookieStore = await cookies();
        const userCookie = cookieStore.get("github_user");

        if (!userCookie) {
          return NextResponse.json({ error: "Authentication required" }, { status: 401 });
        }

        let user;
        try {
          user = JSON.parse(userCookie.value);
        } catch {
          return NextResponse.json({ error: "Invalid session" }, { status: 401 });
        }

        const body = await request.json();
        const { commentId, reactionType } = body;

        if (!commentId || !reactionType) {
          return NextResponse.json({ error: "commentId and reactionType are required" }, { status: 400 });
        }

        if (!VALID_COMMENT_REACTIONS.includes(reactionType)) {
          return NextResponse.json({ error: "Invalid reaction type" }, { status: 400 });
        }

        const action = toggleCommentReaction(commentId, user.id, reactionType);
        return NextResponse.json({ action });
      }

      // ======================================================================
      // Hearts (Likes)
      // ======================================================================
      case "hearts": {
        const cookieStore = await cookies();

        if (cookieStore.has("has_liked")) {
          return NextResponse.json({ error: "Already liked" }, { status: 400 });
        }

        // Get region from IP for analytics
        const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ||
                   request.headers.get("x-real-ip") || "";
        const { country } = await lookupCity(ip);

        const newCount = addLike("home", country, ip);

        (await cookies()).set("has_liked", "true", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 60 * 60 * 24 * 365, // 1 year
        });

        return NextResponse.json({ count: newCount });
      }

      // ======================================================================
      // Reactions (now/til)
      // ======================================================================
      case "reactions": {
        const context = searchParams.get("context");
        const cookieStore = await cookies();
        const userCookie = cookieStore.get("github_user");

        if (!userCookie) {
          return NextResponse.json(
            { error: "Authentication required" },
            { status: 401 }
          );
        }

        let user;
        try {
          user = JSON.parse(userCookie.value);
        } catch {
          return NextResponse.json({ error: "Invalid session" }, { status: 401 });
        }

        const body = await request.json();
        const { slug, reactionType } = body;

        if (!slug || !reactionType || !context) {
          return NextResponse.json(
            { error: "slug, reactionType, and context are required" },
            { status: 400 }
          );
        }

        const supabase = createServerClient();
        const tableName = context === "now" ? "now_reactions" : "til_reactions";
        const slugColumn = context === "now" ? "now_slug" : "til_slug";

        // Check if reaction already exists
        const { data: existing } = await supabase
          .from(tableName)
          .select("id")
          .eq(slugColumn, slug)
          .eq("user_id", user.id)
          .eq("reaction_type", reactionType)
          .single();

        if (existing) {
          // Remove reaction (toggle off)
          const { error } = await supabase
            .from(tableName)
            .delete()
            .eq("id", existing.id);

          if (error) {
            console.error(`Error removing ${context} reaction:`, error);
            return NextResponse.json(
              { error: "Failed to remove reaction" },
              { status: 500 }
            );
          }

          return NextResponse.json({ action: "removed" });
        } else {
          // Add reaction
          const insertData: any = {
            user_id: user.id,
            username: user.username,
            reaction_type: reactionType,
          };
          insertData[slugColumn] = slug;

          const { error } = await supabase.from(tableName).insert(insertData);

          if (error) {
            console.error(`Error adding ${context} reaction:`, error);
            return NextResponse.json(
              { error: "Failed to add reaction" },
              { status: 500 }
            );
          }

          return NextResponse.json({ action: "added" });
        }
      }

      // ======================================================================
      // Page View
      // ======================================================================
      case "pageview": {
        const body = await request.json();
        const { path, referrer } = body;
        const ip =
          request.headers.get("x-forwarded-for")?.split(",")[0] ||
          request.headers.get("x-real-ip") ||
          "";
        const { country, city, flag } = await lookupCity(ip);
        const day = new Date().toISOString().slice(0, 10);

        await Promise.all([
          redis.zincrby("visits_by_day", 1, day),
          redis.zincrby("referrers", 1, referrer || ""),
          redis.zincrby("paths", 1, path),
          redis.zincrby("cities", 1, `${country}|${city}|${flag}`),
        ]);

        return NextResponse.json({ ok: true });
      }

      default:
        return NextResponse.json(
          { error: `Unknown type: ${type}` },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error("Error in interactions API:", error);
    return NextResponse.json(
      { error: "Failed to process interaction", details: error.message },
      { status: 500 }
    );
  }
}

// ============================================================================
// PUT Handler (Comments Edit - SQLite)
// ============================================================================

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    if (type !== "comments") {
      return NextResponse.json(
        { error: "PUT only supports type=comments" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const userCookie = cookieStore.get("github_user");

    if (!userCookie) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    let user;
    try {
      user = JSON.parse(userCookie.value);
    } catch {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const body = await request.json();
    const { commentId, content } = body;

    if (!commentId || !content?.trim()) {
      return NextResponse.json({ error: "commentId and content are required" }, { status: 400 });
    }

    // First verify the comment exists and belongs to this user
    const comment = getComment(commentId);

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    if (comment.user_id !== user.id) {
      return NextResponse.json({ error: "You can only edit your own comments" }, { status: 403 });
    }

    // Update the comment
    const updatedComment = updateComment(commentId, content.trim());

    if (!updatedComment) {
      return NextResponse.json({ error: "Failed to update comment" }, { status: 500 });
    }

    return NextResponse.json({ comment: updatedComment });
  } catch (error: any) {
    console.error("Error in interactions PUT:", error);
    return NextResponse.json(
      { error: "Failed to update comment", details: error.message },
      { status: 500 }
    );
  }
}

// ============================================================================
// DELETE Handler (Comments Delete - SQLite)
// ============================================================================

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    if (type !== "comments") {
      return NextResponse.json(
        { error: "DELETE only supports type=comments" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const userCookie = cookieStore.get("github_user");

    if (!userCookie) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    let user;
    try {
      user = JSON.parse(userCookie.value);
    } catch {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const commentId = searchParams.get("id");

    if (!commentId) {
      return NextResponse.json({ error: "Comment ID is required" }, { status: 400 });
    }

    // First verify the comment exists
    const comment = getComment(commentId);

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    // Allow deletion if user owns the comment OR has delete permissions (owner/admin roles)
    const hasDeletePermission = canDeleteAnyComment(user.username);
    if (comment.user_id !== user.id && !hasDeletePermission) {
      return NextResponse.json({ error: "You can only delete your own comments" }, { status: 403 });
    }

    // Soft delete
    const success = deleteComment(commentId);

    if (!success) {
      return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error in interactions DELETE:", error);
    return NextResponse.json(
      { error: "Failed to delete comment", details: error.message },
      { status: 500 }
    );
  }
}
