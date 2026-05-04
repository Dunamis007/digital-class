// API: Process daily login reward with streak tracking
import { NextRequest, NextResponse } from 'next/server';
import { getTokenEngine } from '@/lib/engines/token-engine';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id } = body;

    if (!user_id) {
      return NextResponse.json({ error: 'user_id is required' }, { status: 400 });
    }

    const tokenEngine = getTokenEngine();
    const result = await tokenEngine.processLoginReward(user_id);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Login reward API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
