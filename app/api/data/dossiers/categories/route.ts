import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'dossiers', 'categories.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const categoriesData = JSON.parse(fileContents);
    
    return NextResponse.json(categoriesData);
  } catch (error) {
    console.error('Error fetching dossiers categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dossiers categories' },
      { status: 500 }
    );
  }
}
