import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'family-trees', 'index.json');
    const fileData = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(fileData);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading family tree index:', error);
    return NextResponse.json(
      { error: 'Failed to load family tree index' },
      { status: 500 }
    );
  }
} 