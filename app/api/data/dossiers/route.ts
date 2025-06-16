import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'dossiers', 'dossiers.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const dossiersData = JSON.parse(fileContents);
    
    return NextResponse.json(dossiersData);
  } catch (error) {
    console.error('Error fetching dossiers data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dossiers data' },
      { status: 500 }
    );
  }
}
