import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createServerClient } from "@/lib/supabase"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const nowSlug = searchParams.get("slug")

  if (!nowSlug) {
    return NextResponse.json({ error: "slug is required" }, { status: 400 })
  }

  const cookieStore = await cookies()
  const userCookie = cookieStore.get("github_user")

  let userId: string | null = null
  if (userCookie) {
    try {
      const user = JSON.parse(userCookie.value)
      userId = user.id
    } catch {}
  }

  const supabase = createServerClient()

  // Get reactions for this now entry
  const { data: reactionsData, error } = await supabase
    .from("now_reactions")
    .select("*")
    .eq("now_slug", nowSlug)

  if (error) {
    console.error("Error fetching now reactions:", error)
    return NextResponse.json({ error: "Failed to fetch reactions" }, { status: 500 })
  }

  // Aggregate reactions by type
  const reactions: Record<string, number> = {}
  const userReactions: string[] = []

  for (const reaction of reactionsData || []) {
    reactions[reaction.reaction_type] = (reactions[reaction.reaction_type] || 0) + 1
    if (userId && reaction.user_id === userId) {
      userReactions.push(reaction.reaction_type)
    }
  }

  return NextResponse.json({ reactions, userReactions })
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
  const { slug, reactionType } = body

  if (!slug || !reactionType) {
    return NextResponse.json({ error: "slug and reactionType are required" }, { status: 400 })
  }

  const supabase = createServerClient()

  // Check if user already has this reaction
  const { data: existing } = await supabase
    .from("now_reactions")
    .select("id")
    .eq("now_slug", slug)
    .eq("user_id", user.id)
    .eq("reaction_type", reactionType)
    .single()

  if (existing) {
    // Remove reaction (toggle off)
    const { error } = await supabase
      .from("now_reactions")
      .delete()
      .eq("id", existing.id)

    if (error) {
      console.error("Error removing now reaction:", error)
      return NextResponse.json({ error: "Failed to remove reaction" }, { status: 500 })
    }

    return NextResponse.json({ action: "removed" })
  } else {
    // Add reaction
    const { error } = await supabase
      .from("now_reactions")
      .insert({
        now_slug: slug,
        user_id: user.id,
        username: user.username,
        reaction_type: reactionType,
      })

    if (error) {
      console.error("Error adding now reaction:", error)
      return NextResponse.json({ error: "Failed to add reaction" }, { status: 500 })
    }

    return NextResponse.json({ action: "added" })
  }
}
