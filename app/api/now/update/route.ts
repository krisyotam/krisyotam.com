import { NextResponse } from "next/server"
import { getCurrentMonthYear } from "@/utils/date-formatter"

export async function POST(request: Request) {
  try {
    const { content } = await request.json()

    // In a real implementation, you would:
    // 1. Archive the current content with the current date
    // 2. Update the current content with the new content
    // 3. Save to a database or file system

    // This is a simplified example
    const currentMonth = getCurrentMonthYear()

    return NextResponse.json({
      success: true,
      message: `Now page updated and previous content archived under ${currentMonth}`,
    })
  } catch (error) {
    console.error("Error updating now page:", error)
    return NextResponse.json({ error: "Failed to update now page" }, { status: 500 })
  }
}

