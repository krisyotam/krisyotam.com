import { readFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';

export async function GET() {
  try {
    // Get the full path to the Bible MessagePack file
    const filePath = path.join(process.cwd(), 'data', 'reference', '1611kjv.msgpack');
    
    // Read the file
    const fileData = await readFile(filePath);
    
    // Return the file with appropriate headers
    return new NextResponse(fileData, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': 'inline; filename="1611kjv.msgpack"',
        'Cache-Control': 'public, max-age=31536000, immutable' // Cache for a year
      }
    });
  } catch (error) {
    console.error('Error serving Bible data file:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to load Bible data file' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 