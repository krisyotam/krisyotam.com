import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createServerClient } from "@/lib/supabase"

const VALID_REACTIONS = ["thumbsUp", "thumbsDown", "party", "heart", "rocket", "eyes"]

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
  const { commentId, reactionType } = body

  if (!commentId || !reactionType) {
    return NextResponse.json({ error: "commentId and reactionType are required" }, { status: 400 })
  }

  if (!VALID_REACTIONS.includes(reactionType)) {
    return NextResponse.json({ error: "Invalid reaction type" }, { status: 400 })
  }

  const supabase = createServerClient()

  // Check if reaction already exists
  const { data: existing } = await supabase
    .from("comment_reactions")
    .select("id")
    .eq("comment_id", commentId)
    .eq("user_id", user.id)
    .eq("reaction_type", reactionType)
    .single()

  if (existing) {
    // Remove reaction (toggle off)
    const { error } = await supabase
      .from("comment_reactions")
      .delete()
      .eq("id", existing.id)

    if (error) {
      console.error("Error removing reaction:", error)
      return NextResponse.json({ error: "Failed to remove reaction" }, { status: 500 })
    }

    return NextResponse.json({ action: "removed" })
  } else {
    // Add reaction
    const { error } = await supabase
      .from("comment_reactions")
      .insert({
        comment_id: commentId,
        user_id: user.id,
        reaction_type: reactionType,
      })

    if (error) {
      console.error("Error adding reaction:", error)
      return NextResponse.json({ error: "Failed to add reaction" }, { status: 500 })
    }

    return NextResponse.json({ action: "added" })
  }
}
