import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'conspiracies', 'conspiracies.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const conspiraciesData = JSON.parse(fileContents);
    
    return NextResponse.json(conspiraciesData);
  } catch (error) {
    console.error('Error fetching conspiracies data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conspiracies data' },
      { status: 500 }
    );
  }
}
