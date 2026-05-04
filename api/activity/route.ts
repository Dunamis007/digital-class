// API: Track student activities and award tokens accordingly
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { getTokenEngine } from '@/lib/engines/token-engine';

// Activity type to token rule mapping
const ACTIVITY_TOKEN_MAPPING: Record<string, string> = {
  lesson_complete: 'lesson_complete',
  quiz_pass: 'quiz_pass',
  quiz_fail: 'failed_quiz',
  assignment_submit: 'assignment_submit',
  assignment_late: 'late_submission',
  forum_post: 'forum_post',
  forum_reply: 'forum_post',
  live_class_attend: 'attendance_live',
  live_class_miss: 'missed_class',
  achievement_unlock: 'achievement_unlock',
  referral: 'referral',
};

// POST: Log activity and award/deduct tokens
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const body = await request.json();

    const {
      user_id,
      activity_type,
      reference_type,
      reference_id,
      metadata,
    } = body;

    if (!user_id || !activity_type) {
      return NextResponse.json(
        { error: 'Missing required fields: user_id, activity_type' },
        { status: 400 }
      );
    }

    // Log the activity
    const activityData = {
      user_id,
      activity_type,
      activity_date: new Date().toISOString().split('T')[0],
      reference_type: reference_type || null,
      reference_id: reference_id || null,
      metadata: metadata || {},
      tokens_earned: 0,
    };

    // Check if this activity should award tokens
    const tokenRule = ACTIVITY_TOKEN_MAPPING[activity_type];
    let tokenResult = null;

    if (tokenRule) {
      // Determine if earning or losing
      const isLosing = ['failed_quiz', 'late_submission', 'missed_class'].includes(tokenRule);
      const tokenEngine = getTokenEngine();

      if (isLosing) {
        tokenResult = await tokenEngine.loseTokens(user_id, tokenRule, {
          referenceType: reference_type,
          referenceId: reference_id,
          metadata,
        });
      } else {
        tokenResult = await tokenEngine.earnTokens(user_id, tokenRule, {
          referenceType: reference_type,
          referenceId: reference_id,
          metadata,
        });
      }

      if (tokenResult.success) {
        activityData.tokens_earned = isLosing ? -tokenResult.tokensLost : tokenResult.tokensEarned;
      }
    }

    // Insert activity record
    const { data: activity, error: activityError } = await supabase
      .from('student_activities')
      .insert(activityData)
      .select()
      .single();

    if (activityError) {
      console.error('Activity insert error:', activityError);
      // Don't fail the request, tokens were still awarded
    }

    // Update profile counters based on activity type
    if (activity_type === 'lesson_complete') {
      await supabase.rpc('increment_profile_counter', {
        p_user_id: user_id,
        p_field: 'total_lessons_completed',
      });
    } else if (activity_type === 'quiz_pass') {
      await supabase.rpc('increment_profile_counter', {
        p_user_id: user_id,
        p_field: 'total_quizzes_passed',
      });
    }

    return NextResponse.json({
      success: true,
      activity,
      tokenResult,
    });
  } catch (error) {
    console.error('Activity API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET: Get activity history
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const activityType = searchParams.get('activity_type');
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    const limit = parseInt(searchParams.get('limit') || '50');

    if (!userId) {
      return NextResponse.json({ error: 'user_id is required' }, { status: 400 });
    }

    let query = supabase
      .from('student_activities')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (activityType) {
      query = query.eq('activity_type', activityType);
    }

    if (startDate) {
      query = query.gte('activity_date', startDate);
    }

    if (endDate) {
      query = query.lte('activity_date', endDate);
    }

    const { data: activities, error } = await query;

    if (error) {
      console.error('Activity fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 });
    }

    // Get summary stats
    const { data: stats } = await supabase
      .from('student_activities')
      .select('activity_type, tokens_earned')
      .eq('user_id', userId);

    const summary: Record<string, { count: number; tokens: number }> = {};
    if (stats) {
      for (const stat of stats) {
        if (!summary[stat.activity_type]) {
          summary[stat.activity_type] = { count: 0, tokens: 0 };
        }
        summary[stat.activity_type].count++;
        summary[stat.activity_type].tokens += stat.tokens_earned;
      }
    }

    return NextResponse.json({
      success: true,
      activities: activities || [],
      summary,
    });
  } catch (error) {
    console.error('Activity history API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
