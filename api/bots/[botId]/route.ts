import { NextRequest, NextResponse } from 'next/server';
import { getBotOrchestration } from '@/lib/engines/bot-orchestration';

/**
 * GET /api/bots/[botId]
 * Get a specific bot details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { botId: string } }
) {
  try {
    const { botId } = params;

    if (!botId) {
      return NextResponse.json(
        { error: 'botId parameter is required' },
        { status: 400 }
      );
    }

    const botEngine = getBotOrchestration();
    const bot = await botEngine.getBot(botId);

    if (!bot) {
      return NextResponse.json(
        { error: 'Bot not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      bot,
    });
  } catch (error) {
    console.error('Bot detail API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
