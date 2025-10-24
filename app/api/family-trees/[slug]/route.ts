import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    
    // Basic validation to prevent directory traversal attacks
    if (slug.includes('..') || slug.includes('/') || slug.includes('\\')) {
      return NextResponse.json(
        { error: 'Invalid family tree identifier' },
        { status: 400 }
      );
    }
    
    const filePath = path.join(process.cwd(), 'data', 'family-trees', `${slug}.json`);
    const fileData = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(fileData);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error reading family tree data:`, error);
    return NextResponse.json(
      { error: 'Failed to load family tree data' },
      { status: 500 }
    );
  }
} 