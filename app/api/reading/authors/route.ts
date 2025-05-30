import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'reading', 'authors.json')
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const data = JSON.parse(fileContent)
    return NextResponse.json(data.authors || [])
  } catch (error) {
    console.error('Error loading authors:', error)
    return NextResponse.json([], { status: 500 })
  }
}
