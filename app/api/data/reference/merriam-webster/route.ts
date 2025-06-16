import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const word = url.searchParams.get('word');
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '10', 10), 10); // Limit to max 10 entries per page to reduce response size
    
    const filePath = path.join(process.cwd(), 'data', 'reference', 'merriam-webster.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    
    // If searching for a specific word, return just that
    if (word) {
      const normalizedWord = word.toLowerCase().trim();
      let result = null;
      
      if (Array.isArray(data)) {
        result = data.find(entry => entry.word?.toLowerCase() === normalizedWord);
      } else if (typeof data === 'object') {
        result = data[normalizedWord] || data[word];
      }
      
      return NextResponse.json(result || { error: 'Word not found' });
    }
    
    // For pagination, implement chunking
    let entries;
    if (Array.isArray(data)) {
      entries = data;
    } else {      entries = Object.entries(data).map(([word, definition]) => ({
        word,
        definition: typeof definition === 'string' ? definition : (definition as any)?.definition || String(definition)
      }));
    }
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedEntries = entries.slice(startIndex, endIndex);
    
    return NextResponse.json({
      data: paginatedEntries,
      pagination: {
        page,
        limit,
        total: entries.length,
        totalPages: Math.ceil(entries.length / limit),
        hasNext: endIndex < entries.length,
        hasPrevious: page > 1
      }
    });
  } catch (error) {
    console.error('Error reading Merriam-Webster data:', error);
    return NextResponse.json(
      { error: 'Failed to load Merriam-Webster data' },
      { status: 500 }
    );
  }
}
