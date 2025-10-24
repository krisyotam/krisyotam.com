import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');

    // Read the watched.json file
    const filePath = path.join(process.cwd(), 'data', 'film', 'watched.json');
    const fileContent = await fs.readFile(filePath, 'utf8');
    const watchedMovies = JSON.parse(fileContent);

    // Transform the data to match the expected format for TraktMovieCard
    const transformedMovies = watchedMovies.map((movie: any) => ({
        id: movie.id.toString(),
        title: movie.name,
        year: parseInt(movie.year),
        posterUrl: movie.poster,
        genres: movie.genres
    }));

    return NextResponse.json(transformedMovies);
  } catch (error) {
    console.error('Error fetching watched movies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch watched movies' },
      { status: 500 }
    );
  }
}
