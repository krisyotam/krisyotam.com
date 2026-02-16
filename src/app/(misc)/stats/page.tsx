import { staticMetadata } from '@/lib/staticMetadata';
import { Metadata } from 'next';
import { getAllStats } from '@/lib/seline';
import { getSnapshots } from '@/lib/analytics-db';

export const metadata: Metadata = {
  ...staticMetadata.stats,
};

// Force dynamic rendering since we're fetching real-time analytics
export const dynamic = 'force-dynamic';

async function getData() {
  try {
    const stats = await getAllStats('30d');
    return stats;
  } catch (err) {
    console.error('Error fetching Seline stats:', err);
    return {
      visitorData: null,
      visitMetrics: null,
      referrers: { data: [], total: 0 },
      countries: { data: [], total: 0 },
      cities: { data: [], total: 0 },
      browsers: { data: [], total: 0 },
      devices: { data: [], total: 0 },
      operatingSystems: { data: [], total: 0 },
    };
  }
}

export default async function StatsPage() {
  const [stats, snapshots] = await Promise.all([
    getData(),
    getSnapshots().catch(() => []),
  ]);

  const StatsClient = (await import('./stats-client')).default;

  return <StatsClient stats={stats} snapshots={snapshots} />;
}
