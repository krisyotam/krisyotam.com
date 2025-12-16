import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    const dataDirectory = path.join(process.cwd(), "data", "shop")
    const fileContents = fs.readFileSync(path.join(dataDirectory, "shop.json"), "utf8")
    const data = JSON.parse(fileContents)

    // Only return items explicitly marked as active. This prevents hidden/inactive
    // items from appearing on the public /shop page.
    const activeItems = Array.isArray(data)
      ? data.filter((item: any) => (item?.state || "").toString().toLowerCase() === "active")
      : []

    return NextResponse.json(activeItems)
  } catch (error) {
    console.error("Error reading shop data:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
