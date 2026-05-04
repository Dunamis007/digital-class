import { NextRequest, NextResponse } from 'next/server';
import { getBotOrchestration } from '@/lib/engines/bot-orchestration';

/**
 * PATCH /api/bots/messages/[messageId]
 * Mark a message as processed
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { messageId: string } }
) {
  try {
    const { messageId } = params;

    if (!messageId) {
      return NextResponse.json(
        { error: 'messageId parameter is required' },
        { status: 400 }
      );
    }

    const botEngine = getBotOrchestration();
    const success = await botEngine.markMessageProcessed(messageId);

    return NextResponse.json({
      success,
      message: success ? 'Message marked as processed' : 'Failed to process message',
    });
  } catch (error) {
    console.error('Mark message processed API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
