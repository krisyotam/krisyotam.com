import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { password } = await request.json()
    const correctPassword = process.env.ARCHIVES_PASSWORD

    if (!correctPassword) {
      return NextResponse.json({ success: false, message: "Password not configured" }, { status: 500 })
    }

    const isCorrect = password === correctPassword

    return NextResponse.json(
      {
        success: isCorrect,
        message: isCorrect ? "Password correct" : "Password incorrect",
      },
      { status: isCorrect ? 200 : 401 },
    )
  } catch (error) {
    console.error("Error verifying password:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

