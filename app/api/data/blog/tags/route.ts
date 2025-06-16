import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'blog', 'tags.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const tagsData = JSON.parse(fileContents);
    
    return NextResponse.json(tagsData);
  } catch (error) {
    console.error('Error fetching tags data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tags data' },
      { status: 500 }
    );
  }
}
