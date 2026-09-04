import { NextRequest, NextResponse } from 'next/server';
import { VERIFIED_SCHEMES } from '@/data/schemes';
import { evaluateEligibility } from '@/lib/rule-engine/evaluator';
import { UserProfile } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { schemeId, profile } = body as { schemeId: string; profile: UserProfile | null };

    if (!schemeId) {
      return NextResponse.json({ error: 'schemeId is required' }, { status: 400 });
    }

    const scheme = VERIFIED_SCHEMES.find((s) => s.id === schemeId);
    if (!scheme) {
      return NextResponse.json({ error: 'Scheme not found in verified corpus' }, { status: 404 });
    }

    const verdict = evaluateEligibility(scheme, profile);
    return NextResponse.json({ scheme, verdict });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Evaluation failed' }, { status: 500 });
  }
}
