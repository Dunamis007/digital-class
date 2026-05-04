// API: Track attendance for live classes and lessons
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { getTokenEngine } from '@/lib/engines/token-engine';

// POST: Record attendance
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const body = await request.json();

    const {
      user_id,
      course_id,
      lesson_id,
      session_type, // 'live_class', 'recorded', 'tutorial'
      scheduled_time,
      is_present,
      is_late,
      late_minutes,
    } = body;

    if (!user_id || !session_type) {
      return NextResponse.json(
        { error: 'Missing required fields: user_id, session_type' },
        { status: 400 }
      );
    }

    let tokensAwarded = 0;
    let tokensDeducted = 0;
    let tokenResult = null;
    const tokenEngine = getTokenEngine();

    // Award or deduct tokens based on attendance
    if (is_present) {
      // Award attendance tokens for live classes
      if (session_type === 'live_class') {
        tokenResult = await tokenEngine.earnTokens(user_id, 'attendance_live', {
          referenceType: 'lesson',
          referenceId: lesson_id,
        });
        if (tokenResult.success) {
          tokensAwarded = tokenResult.tokensEarned;
        }
      }
    } else {
      // Deduct tokens for missing live class
      if (session_type === 'live_class' && scheduled_time) {
        const scheduledDate = new Date(scheduled_time);
        const now = new Date();
        // Only deduct if the class time has passed
        if (scheduledDate < now) {
          tokenResult = await tokenEngine.loseTokens(user_id, 'missed_class', {
            referenceType: 'lesson',
            referenceId: lesson_id,
          });
          if (tokenResult.success) {
            tokensDeducted = tokenResult.tokensLost;
          }
        }
      }
    }

    // Record attendance
    const attendanceData = {
      user_id,
      course_id: course_id || null,
      lesson_id: lesson_id || null,
      session_type,
      scheduled_time: scheduled_time || new Date().toISOString(),
      attended_at: is_present ? new Date().toISOString() : null,
      is_present: is_present || false,
      is_late: is_late || false,
      late_minutes: late_minutes || 0,
      tokens_awarded: tokensAwarded,
      tokens_deducted: tokensDeducted,
    };

    const { data: attendance, error } = await supabase
      .from('attendance_records')
      .insert(attendanceData)
      .select()
      .single();

    if (error) {
      console.error('Attendance insert error:', error);
      return NextResponse.json({ error: 'Failed to record attendance' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      attendance,
      tokenResult,
    });
  } catch (error) {
    console.error('Attendance API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET: Get attendance records
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const courseId = searchParams.get('course_id');
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');

    if (!userId) {
      return NextResponse.json({ error: 'user_id is required' }, { status: 400 });
    }

    let query = supabase
      .from('attendance_records')
      .select(`
        *,
        course:courses(id, title),
        lesson:lessons(id, title)
      `)
      .eq('user_id', userId)
      .order('scheduled_time', { ascending: false });

    if (courseId) {
      query = query.eq('course_id', courseId);
    }

    if (startDate) {
      query = query.gte('scheduled_time', startDate);
    }

    if (endDate) {
      query = query.lte('scheduled_time', endDate);
    }

    const { data: records, error } = await query;

    if (error) {
      console.error('Attendance fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch attendance' }, { status: 500 });
    }

    // Calculate attendance rate
    const totalSessions = records?.length || 0;
    const attendedSessions = records?.filter((r) => r.is_present).length || 0;
    const attendanceRate = totalSessions > 0 ? Math.round((attendedSessions / totalSessions) * 100) : 0;

    return NextResponse.json({
      success: true,
      records: records || [],
      stats: {
        totalSessions,
        attendedSessions,
        missedSessions: totalSessions - attendedSessions,
        attendanceRate,
      },
    });
  } catch (error) {
    console.error('Attendance history API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
