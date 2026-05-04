import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

/**
 * GET /api/bots/analytics?user_id=xxx
 * Get comprehensive bot analytics for a user
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('user_id');
    const period = searchParams.get('period') || '7'; // days

    if (!userId) {
      return NextResponse.json(
        { error: 'user_id parameter is required' },
        { status: 400 }
      );
    }

    const supabase = createClient();
    const periodDays = parseInt(period);

    // Get bot interaction stats for the period
    const { data: interactions } = await supabase
      .from('bot_interactions')
      .select('bot_id, sentiment, created_at')
      .eq('user_id', userId)
      .gte('created_at', new Date(Date.now() - periodDays * 24 * 60 * 60 * 1000).toISOString());

    // Get bot metrics
    const { data: metrics } = await supabase
      .from('bot_monitoring_metrics')
      .select('*')
      .eq('user_id', userId);

    // Get bot council sessions
    const { data: sessions } = await supabase
      .from('bot_council_sessions')
      .select('*')
      .eq('user_id', userId)
      .gte('session_start', new Date(Date.now() - periodDays * 24 * 60 * 60 * 1000).toISOString());

    // Calculate analytics
    const interactionsByBot = (interactions || []).reduce(
      (acc: Record<string, any>, interaction: any) => {
        if (!acc[interaction.bot_id]) {
          acc[interaction.bot_id] = { total: 0, positive: 0, neutral: 0, negative: 0 };
        }
        acc[interaction.bot_id].total += 1;
        acc[interaction.bot_id][interaction.sentiment || 'neutral'] += 1;
        return acc;
      },
      {}
    );

    const totalInteractions = interactions?.length || 0;
    const positiveRate =
      totalInteractions > 0
        ? ((interactions?.filter((i: any) => i.sentiment === 'positive').length || 0) /
            totalInteractions) *
          100
        : 0;

    const totalSessions = sessions?.length || 0;
    const avgSessionDuration =
      totalSessions > 0
        ? (sessions?.reduce((sum: number, s: any) => sum + (s.duration_seconds || 0), 0) || 0) /
          totalSessions
        : 0;

    const totalTokensEarned = (metrics || []).reduce((sum, m: any) => sum + (m.tokens_awarded || 0), 0);
    const totalTokensLost = (metrics || []).reduce((sum, m: any) => sum + (m.tokens_deducted || 0), 0);

    return NextResponse.json({
      success: true,
      analytics: {
        period: periodDays,
        total_interactions: totalInteractions,
        positive_rate: positiveRate.toFixed(2),
        interactions_by_bot: interactionsByBot,
        bot_metrics: metrics || [],
        sessions: {
          total: totalSessions,
          average_duration_seconds: avgSessionDuration.toFixed(0),
        },
        tokens: {
          total_earned: totalTokensEarned,
          total_lost: totalTokensLost,
          net_change: totalTokensEarned - totalTokensLost,
        },
      },
    });
  } catch (error) {
    console.error('Bot analytics API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
