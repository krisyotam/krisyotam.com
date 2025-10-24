import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const categoriesPath = path.join(process.cwd(), 'data', 'questions', 'categories.json');
    const categoriesData = fs.readFileSync(categoriesPath, 'utf8');
    const categories = JSON.parse(categoriesData);

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error reading categories data:', error);
    return NextResponse.json(
      { error: 'Failed to load categories data' },
      { status: 500 }
    );
  }
}
