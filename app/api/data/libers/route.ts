import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'libers', 'libers.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const libersData = JSON.parse(fileContents);
    
    return NextResponse.json(libersData);
  } catch (error) {
    console.error('Error fetching libers data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch libers data' },
      { status: 500 }
    );
  }
}
