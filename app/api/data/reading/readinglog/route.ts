import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'reading', 'readinglog.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const readingLogData = JSON.parse(fileContents);
    
    return NextResponse.json(readingLogData);
  } catch (error) {
    console.error('Error fetching reading log data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reading log data' },
      { status: 500 }
    );
  }
}
