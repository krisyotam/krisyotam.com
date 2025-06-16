import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'essays', 'feed.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const feedData = JSON.parse(fileContents);
    
    return NextResponse.json(feedData);
  } catch (error) {
    console.error('Error fetching essays feed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch essays feed' },
      { status: 500 }
    );
  }
}
