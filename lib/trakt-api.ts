import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Trakt API configuration
const TRAKT_API_BASE = 'https://api.trakt.tv';
const TRAKT_API_VERSION = '2';
const TRAKT_CLIENT_ID = process.env.TRAKT_CLIENT_ID || '';

// Token management interface
interface TraktTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  created_at: number;
}

// Get current tokens from environment
function getCurrentTokens(): TraktTokens {
  return {
    access_token: process.env.TRAKT_ACCESS_TOKEN || '',
    refresh_token: process.env.TRAKT_REFRESH_TOKEN || '',
    expires_in: parseInt(process.env.TRAKT_EXPIRES_IN || '86400', 10),
    created_at: parseInt(process.env.TRAKT_CREATED_AT || '0', 10),
  };
}

// Check if token is expired
function isTokenExpired(tokens: TraktTokens): boolean {
  const now = Math.floor(Date.now() / 1000);
  return now >= (tokens.created_at + tokens.expires_in);
}

// Safely update `.env.local`
function updateEnvFile(newTokens: TraktTokens) {
  const envPath = path.join(process.cwd(), '.env.local');
  let envContent = '';

  try {
    envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';

    const lines = envContent.split('\n');
    const envMap: Record<string, string> = {};

    for (const line of lines) {
      const [key, ...rest] = line.split('=');
      if (key) envMap[key.trim()] = rest.join('=').trim();
    }

    envMap['TRAKT_ACCESS_TOKEN'] = newTokens.access_token;
    envMap['TRAKT_REFRESH_TOKEN'] = newTokens.refresh_token;
    envMap['TRAKT_EXPIRES_IN'] = newTokens.expires_in.toString();
    envMap['TRAKT_CREATED_AT'] = newTokens.created_at.toString();

    const newEnvContent = Object.entries(envMap)
      .map(([key, val]) => `${key}=${val}`)
      .join('\n');

    fs.writeFileSync(envPath, newEnvContent, 'utf8');
  } catch (err) {
    console.error('Error updating .env.local file:', err);
  }
}

// Refresh access token
async function refreshAccessToken(): Promise<TraktTokens | null> {
  const tokens = getCurrentTokens();

  try {
    const response = await fetch('https://api.trakt.tv/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh_token: tokens.refresh_token,
        client_id: TRAKT_CLIENT_ID,
        client_secret: process.env.TRAKT_CLIENT_SECRET,
        redirect_uri: process.env.TRAKT_REDIRECT_URI,
        grant_type: 'refresh_token',
      }),
    });

    const body = await response.text();

    if (!response.ok) {
      console.error('Failed to refresh Trakt token:', response.status, body);
      return null;
    }

    const newTokens = JSON.parse(body);
    newTokens.created_at = Math.floor(Date.now() / 1000);

    updateEnvFile(newTokens);
    return newTokens;
  } catch (error) {
    console.error('Error refreshing Trakt token:', error);
    return null;
  }
}

// Get a valid access token
async function getValidAccessToken(): Promise<string | null> {
  const tokens = getCurrentTokens();

  if (!isTokenExpired(tokens)) {
    return tokens.access_token;
  }

  const newTokens = await refreshAccessToken();
  return newTokens?.access_token || null;
}

// Base API call
export async function traktApiCall(endpoint: string, options: RequestInit = {}): Promise<any> {
  const accessToken = await getValidAccessToken();

  if (!accessToken) {
    throw new Error('Unable to get valid Trakt access token');
  }

  const url = `${TRAKT_API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    'trakt-api-version': TRAKT_API_VERSION,
    'trakt-api-key': TRAKT_CLIENT_ID,
    'Authorization': `Bearer ${accessToken}`,
    'User-Agent': 'Trakt-Integration/1.0',
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 429) {
      throw new Error('Trakt API rate limit exceeded');
    }

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Trakt API error: ${response.status} ${response.statusText} — ${errorBody}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Trakt API call failed:', error);
    throw error;
  }
}

// Public endpoints
export async function getUserStats(username: string = 'me') {
  return await traktApiCall(`/users/${username}/stats`);
}

export async function getUserWatchedMovies(username: string = 'me', limit = 1000) {
  return await traktApiCall(`/users/${username}/watched/movies?limit=${limit}`);
}

export async function getUserWatchedShows(username: string = 'me', limit = 1000) {
  return await traktApiCall(`/users/${username}/watched/shows?limit=${limit}`);
}

export async function getMovieDetails(movieId: string) {
  return await traktApiCall(`/movies/${movieId}?extended=full`);
}

export async function getShowDetails(showId: string) {
  return await traktApiCall(`/shows/${showId}?extended=full`);
}

// Error formatter
export function handleTraktError(error: any): NextResponse {
  if (error.message?.includes('rate limit')) {
    return NextResponse.json({ error: 'Trakt API rate limit exceeded. Please try again later.' }, { status: 429 });
  }

  if (error.message?.includes('access token')) {
    return NextResponse.json({ error: 'Authentication failed. Please check Trakt credentials.' }, { status: 401 });
  }

  return NextResponse.json({ error: 'Failed to fetch data from Trakt API' }, { status: 500 });
}

// Helper for poster URLs
export function getPosterUrl(tmdbId: string | number | null, type: 'movie' | 'tv' = 'movie'): string {
  return tmdbId ? `https://image.tmdb.org/t/p/w500/${tmdbId}` : '/placeholder-poster.jpg';
}

// Format movie object
export function formatTraktMovie(item: any) {
  return {
    id: item.movie?.ids?.trakt || Math.random(),
    title: item.movie?.title || 'Unknown Title',
    year: item.movie?.year || null,
    posterUrl: getPosterUrl(item.movie?.ids?.tmdb, 'movie'),
    plays: item.plays || 1,
    lastWatchedAt: item.last_watched_at || new Date().toISOString(),
    rating: item.movie?.rating || null,
    genres: item.movie?.genres || [],
    runtime: item.movie?.runtime || null,
    overview: item.movie?.overview || null,
    traktId: item.movie?.ids?.trakt,
    imdbId: item.movie?.ids?.imdb,
    tmdbId: item.movie?.ids?.tmdb,
  };
}

// Format show object
export function formatTraktShow(item: any) {
  return {
    id: item.show?.ids?.trakt || Math.random(),
    title: item.show?.title || 'Unknown Title',
    year: item.show?.year || null,
    posterUrl: getPosterUrl(item.show?.ids?.tmdb, 'tv'),
    plays: item.plays || 1,
    lastWatchedAt: item.last_watched_at || new Date().toISOString(),
    rating: item.show?.rating || null,
    genres: item.show?.genres || [],
    runtime: item.show?.runtime || null,
    overview: item.show?.overview || null,
    network: item.show?.network || null,
    status: item.show?.status || null,
    aired_episodes: item.show?.aired_episodes || null,
    traktId: item.show?.ids?.trakt,
    imdbId: item.show?.ids?.imdb,
    tmdbId: item.show?.ids?.tmdb,
  };
}
