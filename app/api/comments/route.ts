import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createServerClient } from "@/lib/supabase"

const COMMENTS_PER_PAGE = 10

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const pageSlug = searchParams.get("pageSlug")
  const page = parseInt(searchParams.get("page") || "1", 10)

  if (!pageSlug) {
    return NextResponse.json({
      comments: [],
      pagination: { page: 1, totalPages: 0, totalComments: 0, hasMore: false }
    })
  }

  try {
    const supabase = createServerClient()
    const offset = (page - 1) * COMMENTS_PER_PAGE

    // Get comments with pagination (exclude soft-deleted)
    const { data: comments, error: commentsError, count } = await supabase
      .from("comments")
      .select("*", { count: "exact" })
      .eq("page_slug", pageSlug)
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .range(offset, offset + COMMENTS_PER_PAGE - 1)

    if (commentsError) {
      console.error("Error fetching comments:", commentsError)
      // Return empty array instead of error to prevent UI crash
      return NextResponse.json({
        comments: [],
        pagination: { page: 1, totalPages: 0, totalComments: 0, hasMore: false }
      })
    }

    // Get reactions for these comments
    const commentIds = comments?.map((c) => c.id) || []
    let reactions: Record<string, Record<string, number>> = {}
    let userReactions: Record<string, string[]> = {}

    if (commentIds.length > 0) {
      const { data: reactionsData } = await supabase
        .from("comment_reactions")
        .select("*")
        .in("comment_id", commentIds)

      // Aggregate reactions by comment
      if (reactionsData) {
        for (const reaction of reactionsData) {
          if (!reactions[reaction.comment_id]) {
            reactions[reaction.comment_id] = {}
          }
          if (!reactions[reaction.comment_id][reaction.reaction_type]) {
            reactions[reaction.comment_id][reaction.reaction_type] = 0
          }
          reactions[reaction.comment_id][reaction.reaction_type]++
        }

        // Get current user's reactions
        const cookieStore = await cookies()
        const userCookie = cookieStore.get("github_user")
        if (userCookie) {
          try {
            const user = JSON.parse(userCookie.value)
            for (const reaction of reactionsData) {
              if (reaction.user_id === user.id) {
                if (!userReactions[reaction.comment_id]) {
                  userReactions[reaction.comment_id] = []
                }
                userReactions[reaction.comment_id].push(reaction.reaction_type)
              }
            }
          } catch {}
        }
      }
    }

    const totalPages = Math.ceil((count || 0) / COMMENTS_PER_PAGE)

    return NextResponse.json({
      comments: comments?.map((comment) => ({
        ...comment,
        reactions: reactions[comment.id] || {},
        userReactions: userReactions[comment.id] || [],
      })) || [],
      pagination: {
        page,
        totalPages,
        totalComments: count || 0,
        hasMore: page < totalPages,
      },
    })
  } catch (error) {
    console.error("Error in comments API:", error)
    return NextResponse.json({
      comments: [],
      pagination: { page: 1, totalPages: 0, totalComments: 0, hasMore: false }
    })
  }
}

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const userCookie = cookieStore.get("github_user")

  if (!userCookie) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  }

  let user
  try {
    user = JSON.parse(userCookie.value)
  } catch {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 })
  }

  const body = await request.json()
  const { pageSlug, content } = body

  if (!pageSlug || !content?.trim()) {
    return NextResponse.json({ error: "pageSlug and content are required" }, { status: 400 })
  }

  const supabase = createServerClient()

  const { data: comment, error } = await supabase
    .from("comments")
    .insert({
      page_slug: pageSlug,
      content: content.trim(),
      user_id: user.id,
      username: user.username,
      avatar_url: user.avatar_url,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating comment:", error)
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 })
  }

  return NextResponse.json({
    comment: {
      ...comment,
      reactions: {},
      userReactions: [],
    },
  })
}

export async function DELETE(request: Request) {
  const cookieStore = await cookies()
  const userCookie = cookieStore.get("github_user")

  if (!userCookie) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  }

  let user
  try {
    user = JSON.parse(userCookie.value)
  } catch {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const commentId = searchParams.get("id")

  if (!commentId) {
    return NextResponse.json({ error: "Comment ID is required" }, { status: 400 })
  }

  const supabase = createServerClient()

  // First verify the comment belongs to this user
  const { data: comment, error: fetchError } = await supabase
    .from("comments")
    .select("user_id")
    .eq("id", commentId)
    .single()

  if (fetchError || !comment) {
    return NextResponse.json({ error: "Comment not found" }, { status: 404 })
  }

  if (comment.user_id !== user.id) {
    return NextResponse.json({ error: "You can only delete your own comments" }, { status: 403 })
  }

  // Soft delete - set deleted_at timestamp
  const { error } = await supabase
    .from("comments")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", commentId)

  if (error) {
    console.error("Error deleting comment:", error)
    return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
