import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  const cookieStore = await cookies()
  const userCookie = cookieStore.get("github_user")

  if (!userCookie) {
    return NextResponse.json({ user: null })
  }

  try {
    const user = JSON.parse(userCookie.value)
    // Don't expose access token to client
    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        avatar_url: user.avatar_url,
      },
    })
  } catch {
    return NextResponse.json({ user: null })
  }
}
