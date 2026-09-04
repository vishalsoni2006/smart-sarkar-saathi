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

    if (!userMessage) {
      return NextResponse.json({ error: 'userMessage is required' }, { status: 400 });
    }

    let scheme = VERIFIED_SCHEMES[0];
    if (schemeId && schemeId !== 'all') {
      const found = VERIFIED_SCHEMES.find((s) => s.id === schemeId);
      if (found) scheme = found;
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
