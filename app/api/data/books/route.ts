import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'books.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const booksData = JSON.parse(fileContents);
    
    return NextResponse.json(booksData);
  } catch (error) {
    console.error('Error fetching books data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch books data' },
      { status: 500 }
    );
  }
}
