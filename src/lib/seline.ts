/**
 * Seline Analytics API Client
 * @type lib
 * @path src/lib/seline.ts
 */

const SELINE_API_BASE = 'https://api.seline.com/api/v1';

interface SelineRequestOptions {
  period?: '1h' | '24h' | '7d' | '30d' | '6m' | '12m' | 'all_time' | 'month_to_date' | 'week_to_date' | 'year_to_date' | 'today';
  range?: { from: string; to: string };
  interval?: '10 minutes' | '1 hour' | '1 day' | '1 month';
  limit?: number;
  page?: number;
}

// Stats endpoint types
type StatsType = 'country' | 'region' | 'city' | 'browser' | 'device' | 'os' | 'referrer' | 'campaign' | 'source' | 'medium' | 'content' | 'term';

// Response types
export interface DataPoint {
  date: string;
  visitors: number;
  views: number;
}

export interface DataResponse {
  data: DataPoint[];
  totalVisitors: number;
  totalViews: number;
  previous?: {
    data: DataPoint[];
    totalVisitors: number;
    totalViews: number;
  };
  trendVisitors: number;
  trendViews: number;
}

export interface StatsItem {
  type: string;
  visitors: number;
  total: number;
  country?: string; // For city type
}

export interface StatsResponse {
  data: StatsItem[];
  total: number;
}

export interface VisitMetrics {
  views: { value: string; trend: number };
  duration: { value: string; trend: number };
  bounceRate: { value: string; trend: number };
  visits: { value: string; trend: number };
}

async function selineRequest<T>(endpoint: string, body: Record<string, unknown>): Promise<T> {
  const token = process.env.SELINE_API_TOKEN;

  if (!token) {
    throw new Error('SELINE_API_TOKEN is not configured');
  }

  const response = await fetch(`${SELINE_API_BASE}${endpoint}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Seline API error (${response.status}): ${text}`);
  }

  return response.json();
}

/**
 * Get visitor and pageview data over time
 */
export async function getVisitorData(options: SelineRequestOptions = {}): Promise<DataResponse> {
  const { period, interval = '1 day', range, ...rest } = options;
  const body: Record<string, unknown> = { interval, ...rest };
  if (range) { body.range = range; } else { body.period = period || '30d'; }
  return selineRequest<DataResponse>('/data', body);
}

/**
 * Get aggregated visit metrics (bounce rate, duration, views per visit)
 */
export async function getVisitMetrics(options: SelineRequestOptions = {}): Promise<VisitMetrics> {
  const { period, range, ...rest } = options;
  const body: Record<string, unknown> = { ...rest };
  if (range) { body.range = range; } else { body.period = period || '30d'; }
  return selineRequest<VisitMetrics>('/visit-metrics', body);
}

/**
 * Get stats by dimension (referrer, country, city, browser, device, os)
 */
export async function getStats(type: StatsType, options: SelineRequestOptions = {}): Promise<StatsResponse> {
  const { period, limit = 10, range, ...rest } = options;
  const body: Record<string, unknown> = { type, limit, ...rest };
  if (range) { body.range = range; } else { body.period = period || '30d'; }
  return selineRequest<StatsResponse>('/stats', body);
}

/**
 * Get top referrers
 */
export async function getTopReferrers(options: SelineRequestOptions = {}): Promise<StatsResponse> {
  return getStats('referrer', options);
}

/**
 * Get top countries
 */
export async function getTopCountries(options: SelineRequestOptions = {}): Promise<StatsResponse> {
  return getStats('country', options);
}

/**
 * Get top cities
 */
export async function getTopCities(options: SelineRequestOptions = {}): Promise<StatsResponse> {
  return getStats('city', options);
}

/**
 * Get browser breakdown
 */
export async function getBrowserStats(options: SelineRequestOptions = {}): Promise<StatsResponse> {
  return getStats('browser', options);
}

/**
 * Get device breakdown (mobile/desktop)
 */
export async function getDeviceStats(options: SelineRequestOptions = {}): Promise<StatsResponse> {
  return getStats('device', options);
}

/**
 * Get OS breakdown
 */
export async function getOSStats(options: SelineRequestOptions = {}): Promise<StatsResponse> {
  return getStats('os', options);
}

/**
 * Get all stats for the stats page
 */
export async function getAllStats(period: SelineRequestOptions['period'] = '30d') {
  const [
    visitorData,
    visitMetrics,
    referrers,
    countries,
    cities,
    browsers,
    devices,
    operatingSystems,
  ] = await Promise.all([
    getVisitorData({ period }).catch(() => null),
    getVisitMetrics({ period }).catch(() => null),
    getTopReferrers({ period, limit: 10 }).catch(() => ({ data: [], total: 0 })),
    getTopCountries({ period, limit: 10 }).catch(() => ({ data: [], total: 0 })),
    getTopCities({ period, limit: 10 }).catch(() => ({ data: [], total: 0 })),
    getBrowserStats({ period, limit: 10 }).catch(() => ({ data: [], total: 0 })),
    getDeviceStats({ period, limit: 10 }).catch(() => ({ data: [], total: 0 })),
    getOSStats({ period, limit: 10 }).catch(() => ({ data: [], total: 0 })),
  ]);

  return {
    visitorData,
    visitMetrics,
    referrers,
    countries,
    cities,
    browsers,
    devices,
    operatingSystems,
  };
}
