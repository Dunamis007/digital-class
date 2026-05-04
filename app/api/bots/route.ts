import { NextRequest, NextResponse } from 'next/server';
import { getBotOrchestration } from '@/lib/engines/bot-orchestration';

/**
 * GET /api/bots
 * Get all active bots
 */
export async function GET(request: NextRequest) {
  try {
    const botEngine = getBotOrchestration();
    const bots = await botEngine.getAllBots();

    return NextResponse.json({
      success: true,
      bots,
      count: bots.length,
    });
  } catch (error) {
    console.error('Bots API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
