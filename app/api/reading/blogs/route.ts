import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'reading', 'blogs.json')
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const data = JSON.parse(fileContents)
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error reading blogs.json:', error)
    return NextResponse.json({ 'blog-posts': [] })
  }
}
