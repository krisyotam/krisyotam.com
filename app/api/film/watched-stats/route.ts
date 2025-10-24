import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Read the watched.json file
    const filePath = path.join(process.cwd(), 'data', 'film', 'watched.json');
    const fileContent = await fs.readFile(filePath, 'utf8');
    const watchedMovies = JSON.parse(fileContent);

    // Calculate total movies
    const totalMovies = watchedMovies.length;

    // Calculate total hours from runtime
    const totalMinutes = watchedMovies.reduce((total: number, movie: any) => {
      if (movie.runtime) {
        // Parse runtime string like "115 mins" to get the number
        const runtimeMatch = movie.runtime.match(/(\d+)/);
        if (runtimeMatch) {
          return total + parseInt(runtimeMatch[1]);
        }
      }
      return total;
    }, 0);

    const totalHours = totalMinutes / 60;

    // Filter movies watched this year (2025)
    const currentYear = new Date().getFullYear();
    const moviesThisYear = watchedMovies.filter((movie: any) => {
      if (movie.watchedDate) {
        const watchedYear = new Date(movie.watchedDate).getFullYear();
        return watchedYear === currentYear;
      }
      return false;
    }).length;

    return NextResponse.json({
      moviesWatched: totalMovies,
      tvShowsWatched: moviesThisYear, // Using "Watched This Year" count
      timeWatchedHours: totalHours
    });
  } catch (error) {
    console.error('Error calculating watched stats:', error);
    return NextResponse.json(
      { error: 'Failed to calculate watched stats' },
      { status: 500 }
    );
  }
}
