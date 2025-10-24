import { staticMetadata } from '@/lib/staticMetadata';
import { Metadata } from 'next';
import redis from '@/utils/redis';
import dynamic from 'next/dynamic';

export const metadata: Metadata = {
  ...staticMetadata.stats,
};

// Redis can return data in different formats, so we'll handle both possibilities
type CountRowTuple = [member: string, score: string];
type CountRowObject = { member: string; score: string | number };
type CountRow = CountRowTuple | CountRowObject;

async function getData() {
  try {
    const [visits, referrers, paths, cities] = await Promise.all([
      redis.zrange('visits_by_day', 0, 29, { rev: true, withScores: true }).catch((err: unknown) => {
        console.error('Error fetching visits_by_day:', err);
        return [];
      }),
      redis.zrange('referrers', 0, 9, { rev: true, withScores: true }).catch((err: unknown) => {
        console.error('Error fetching referrers:', err);
        return [];
      }),
      redis.zrange('paths', 0, 9, { rev: true, withScores: true }).catch((err: unknown) => {
        console.error('Error fetching paths:', err);
        return [];
      }),
      redis.zrange('cities', 0, 9, { rev: true, withScores: true }).catch((err: unknown) => {
        console.error('Error fetching cities:', err);
        return [];
      }),
    ]);

    // Shape visits for Recharts
  const totalVisits = (visits || [])
    .filter((entry: any) => entry && (typeof entry === 'object' || Array.isArray(entry)))
    .reverse() // oldest->newest
    .map((entry: any) => {
      try {
        let date: string;
        let total: number;
        if (Array.isArray(entry)) {
          date = entry[0] || 'Unknown Date';
          total = Number(entry[1] ?? 0);
        } else if (typeof entry === 'object' && entry !== null) {
          date = entry.member || 'Unknown Date';
          total = Number(entry.score ?? 0);
        } else {
          date = 'Unknown Date';
          total = 0;
        }
        if (isNaN(total)) total = 0;
        return { date, total };
      } catch (err) {
        console.error('Error processing visit entry:', entry, err);
        return { date: 'Error', total: 0 };
      }
    });

  // Helper to coerce & sort generic rows
  const toRows = (rows: any[] = []) =>
    rows
      .filter((entry: any) => entry && (typeof entry === 'object' || Array.isArray(entry)))
      .map((entry: any) => {
        try {
          let member: string;
          let total: number;
          if (Array.isArray(entry)) {
            member = entry[0] || '(unknown)';
            total = Number(entry[1] ?? 0);
          } else if (typeof entry === 'object' && entry !== null) {
            member = entry.member || '(unknown)';
            total = Number(entry.score ?? 0);
          } else {
            member = '(unknown)';
            total = 0;
          }
          if (isNaN(total)) total = 0;
          return { member, total };
        } catch (err) {
          console.error('Error processing row entry:', entry, err);
          return { member: 'Error', total: 0 };
        }
      });

    return {
      totalVisits,
      topReferrers: toRows(referrers),
      topPaths: toRows(paths),
      topCities: toRows(cities).map((entry: any) => {
        try {
          const member = entry?.member || entry?.[0] || '';
          const total = typeof entry.total === 'number' ? entry.total : Number(entry?.score ?? entry?.[1] ?? 0);
          const [country = '', city = 'Unknown', flag = ''] = member.split('|');
          return { city, flag, total: isNaN(total) ? 0 : total };
        } catch (err) {
          console.error('Error processing city entry:', entry, err);
          return { city: 'Unknown', flag: '', total: 0 };
        }
      }),
    };
  } catch (err) {
    console.error('Error in getData function:', err);
    return {
      totalVisits: [],
      topReferrers: [],
      topPaths: [],
      topCities: [],
    };
  }
}

export default async function StatsPage() {
  // Log Redis client details for debugging
  console.log('Redis client type:', typeof redis, 'Available methods:', Object.keys(redis).filter(k => typeof redis[k as keyof typeof redis] === 'function'));
  
  const { totalVisits = [], topReferrers = [], topPaths = [], topCities = [] } = await getData()
    .catch(err => {
      console.error('Error getting stats data:', err);
      return { totalVisits: [], topReferrers: [], topPaths: [], topCities: [] };
    });

  // Import the client component to render the stats UI
  const StatsClient = dynamic(() => import('./client'), { ssr: false });
  
  return <StatsClient 
    totalVisits={totalVisits}
    topPaths={topPaths}
    topReferrers={topReferrers}
    topCities={topCities}
  />;
}
