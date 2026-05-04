import { NextRequest, NextResponse } from 'next/server';
import { getBotOrchestration } from '@/lib/engines/bot-orchestration';

/**
 * POST /api/bots/messages
 * Send an inter-bot message (bot-to-bot communication)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { from_bot_id, to_bot_id, user_id, message_type, content, priority } = body;

    if (!from_bot_id || !to_bot_id || !user_id) {
      return NextResponse.json(
        { error: 'from_bot_id, to_bot_id, and user_id are required' },
        { status: 400 }
      );
    }

    const botEngine = getBotOrchestration();
    const success = await botEngine.sendInterBotMessage(
      from_bot_id,
      to_bot_id,
      user_id,
      message_type || 'notification',
      content,
      priority || 'normal'
    );

    return NextResponse.json({
      success,
      message: success ? 'Message sent successfully' : 'Failed to send message',
    });
  } catch (error) {
    console.error('Inter-bot messaging API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/bots/messages?bot_id=xxx
 * Get pending messages for a specific bot
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const botId = searchParams.get('bot_id');

    if (!botId) {
      return NextResponse.json(
        { error: 'bot_id parameter is required' },
        { status: 400 }
      );
    }

    const botEngine = getBotOrchestration();
    const messages = await botEngine.getPendingMessages(botId);

    return NextResponse.json({
      success: true,
      messages,
      count: messages.length,
    });
  } catch (error) {
    console.error('Fetch messages API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
