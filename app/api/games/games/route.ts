import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'games', 'games.json');
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Games data not found' }, { status: 404 });
    }
    
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading games data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch games data' }, 
      { status: 500 }
    );
  }
}
