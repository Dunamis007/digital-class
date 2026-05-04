import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

/**
 * POST /api/bots/schedule
 * Schedule a bot action for a future time
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      user_id,
      bot_id,
      action_type,
      scheduled_time,
      trigger_condition,
      message_template,
      metadata,
    } = body;

    if (!user_id || !bot_id || !action_type || !scheduled_time) {
      return NextResponse.json(
        { error: 'user_id, bot_id, action_type, and scheduled_time are required' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    const { data, error } = await supabase
      .from('bot_scheduled_actions')
      .insert({
        user_id,
        bot_id,
        action_type,
        scheduled_time,
        trigger_condition,
        message_template,
        metadata: metadata || {},
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to schedule action' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      scheduled_action: data,
      message: 'Action scheduled successfully',
    });
  } catch (error) {
    console.error('Bot scheduling API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/bots/schedule?user_id=xxx
 * Get scheduled actions for a user
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('user_id');
    const status = searchParams.get('status') || 'scheduled';

    if (!userId) {
      return NextResponse.json(
        { error: 'user_id parameter is required' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    const { data: actions, error } = await supabase
      .from('bot_scheduled_actions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', status)
      .order('scheduled_time', { ascending: true });

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch scheduled actions' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      scheduled_actions: actions || [],
      count: actions?.length || 0,
    });
  } catch (error) {
    console.error('Get scheduled actions API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
