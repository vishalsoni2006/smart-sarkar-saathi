import { NextRequest, NextResponse } from 'next/server';
import { VERIFIED_SCHEMES } from '@/data/schemes';
import { executeGroundedRAGChat } from '@/lib/llm/client';
import { UserProfile } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userMessage, schemeId, profile, targetMissingField } = body as {
      userMessage: string;
      schemeId: string;
      profile: UserProfile | null;
      targetMissingField?: string | null;
    };

    if (!userMessage || !schemeId) {
      return NextResponse.json({ error: 'userMessage and schemeId are required' }, { status: 400 });
    }

    const scheme = VERIFIED_SCHEMES.find((s) => s.id === schemeId);
    if (!scheme) {
      return NextResponse.json({ error: 'Scheme not found in verified corpus' }, { status: 404 });
    }

    const response = await executeGroundedRAGChat({
      userMessage,
      scheme,
      profile,
      targetMissingField
    });

    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Chat synthesis failed' }, { status: 500 });
  }
}
