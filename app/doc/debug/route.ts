import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Debug route to check if routes are working and test file access
export async function GET(request: NextRequest) {
  try {
    // Try to load references.json
    const dataPath = path.join(process.cwd(), 'data', 'references.json');
    let fileContent;
    let fileExists = false;
    
    try {
      fileContent = await fs.readFile(dataPath, 'utf8');
      fileExists = true;
    } catch (fileError) {
      fileContent = `Error reading file: ${fileError.message}`;
    }

    // Return a JSON response with debugging info
    return NextResponse.json({
      success: true,
      message: 'Debug route is working',
      routes: {
        current: request.nextUrl.pathname,
        origin: request.nextUrl.origin
      },
      file: {
        path: dataPath,
        exists: fileExists,
        sampleContent: fileExists ? fileContent.substring(0, 200) + '...' : null
      },
      env: {
        nodeEnv: process.env.NODE_ENV,
        nextPublicEnv: process.env.NEXT_PUBLIC_ENV || 'not set'
      }
    });
  } catch (error) {
    // Return detailed error information
    return NextResponse.json({
      success: false,
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name
      }
    }, { status: 500 });
  }
} 