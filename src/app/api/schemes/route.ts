import { NextRequest, NextResponse } from 'next/server';
import { VERIFIED_SCHEMES } from '@/data/schemes';
import { rankSchemesForUser } from '@/lib/rule-engine/ranking';
import { UserProfile } from '@/types';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const query = searchParams.get('q');

  let filtered = [...VERIFIED_SCHEMES];

  if (category && category !== 'all') {
    filtered = filtered.filter((s) => s.category.toLowerCase() === category.toLowerCase());
  }

  if (query) {
    const q = query.toLowerCase();
    filtered = filtered.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.short_name.toLowerCase().includes(q) ||
        s.ministry.toLowerCase().includes(q) ||
        s.benefit_summary.toLowerCase().includes(q)
    );
  }

  return NextResponse.json({
    total: filtered.length,
    schemes: filtered
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { profile } = body as { profile: UserProfile | null };

    const rankings = rankSchemesForUser(profile, VERIFIED_SCHEMES);
    return NextResponse.json(rankings);
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Ranking failed' }, { status: 500 });
  }
}
