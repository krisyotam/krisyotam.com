import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'conspiracies', 'categories.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const categoriesData = JSON.parse(fileContents);
    
    return NextResponse.json(categoriesData);
  } catch (error) {
    console.error('Error fetching conspiracies categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conspiracies categories' },
      { status: 500 }
    );
  }
}
