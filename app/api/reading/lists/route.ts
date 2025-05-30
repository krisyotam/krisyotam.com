import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'reading', 'reading-lists.json')
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const data = JSON.parse(fileContent)
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error loading reading lists:', error)
    return NextResponse.json({ lists: [] }, { status: 500 })
  }
}
