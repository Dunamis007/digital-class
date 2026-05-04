import { NextRequest, NextResponse } from 'next/server';
import { getBotOrchestration } from '@/lib/engines/bot-orchestration';
import { createClient } from '@/lib/supabase';

/**
 * POST /api/bots/interact
 * Process student action and get bot responses
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, action_type, context } = body;

    if (!user_id || !action_type) {
      return NextResponse.json(
        { error: 'user_id and action_type are required' },
        { status: 400 }
      );
    }

    const botEngine = getBotOrchestration();

    // Get responses from relevant bots
    const responses = await botEngine.processStudentAction(
      user_id,
      action_type,
      context || {}
    );

    // If any bot awards/deducts tokens, update student profile
    const totalTokenChange = responses.reduce(
      (sum, r) => sum + (r.tokens_change || 0),
      0
    );

    if (totalTokenChange !== 0) {
      const supabase = createClient();

      // Update student profile tokens
      const { data: profile } = await supabase
        .from('student_academic_profiles')
        .select('current_tokens')
        .eq('user_id', user_id)
        .single();

      if (profile) {
        const newTokens = Math.max(0, profile.current_tokens + totalTokenChange);
        await supabase
          .from('student_academic_profiles')
          .update({ current_tokens: newTokens })
          .eq('user_id', user_id);
      }
    }

    return NextResponse.json({
      success: true,
      responses,
      total_token_change: totalTokenChange,
      bot_count: responses.length,
    });
  } catch (error) {
    console.error('Bot interaction API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/bots/interact?user_id=xxx&bot_id=yyy
 * Get bot metrics or history
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('user_id');
    const botId = searchParams.get('bot_id');

    if (!userId) {
      return NextResponse.json(
        { error: 'user_id parameter is required' },
        { status: 400 }
      );
    }

    const botEngine = getBotOrchestration();
    const metrics = await botEngine.getBotMetrics(userId, botId || undefined);

    return NextResponse.json({
      success: true,
      metrics,
      count: metrics.length,
    });
  } catch (error) {
    console.error('Bot metrics API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
