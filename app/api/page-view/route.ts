import { NextRequest, NextResponse } from 'next/server';
import redis from '@/lib/redis';

// very tiny free MaxMind replacement – swap out if you already log city info
async function lookupCity(ip?: string | null) {
  try {
    const res = await fetch(`https://ipapi.co/${ip ?? ''}/json/`);
    const j = await res.json();
    return { 
      country: j.country_code, 
      city: j.city, 
      flag: j.country_code ? String.fromCodePoint(0x1f1e6 - 65 + j.country_code.charCodeAt(0), 0x1f1e6 - 65 + j.country_code.charCodeAt(1)) : '' 
    };
  } catch {
    return { country: '??', city: null, flag: '' };
  }
}

export async function POST(req: NextRequest) {
  const { path, referrer } = await req.json();
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || '';
  const { country, city, flag } = await lookupCity(ip);

  const day = new Date().toISOString().slice(0, 10);  // YYYY-MM-DD

  // --- Redis updates
  await Promise.all([
    redis.zincrby('visits_by_day', 1, day),
    redis.zincrby('referrers', 1, referrer || ''),
    redis.zincrby('paths', 1, path),
    redis.zincrby('cities', 1, `${country}|${city}|${flag}`)
  ]);

  return NextResponse.json({ ok: true });
}
