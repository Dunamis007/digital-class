import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// GET: Get lesson progress for current user
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get('lesson_id');

    let query = supabase
      .from('lesson_progress')
      .select('*')
      .eq('student_id', user.id);

    if (lessonId) {
      query = query.eq('lesson_id', lessonId);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ progress: data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// POST: Track lesson progress
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Upsert to avoid duplicates
    const { data, error } = await supabase
      .from('lesson_progress')
      .upsert([
        {
          student_id: user.id,
          lesson_id: body.lesson_id,
          watched_duration_seconds: body.watched_duration_seconds || 0,
          is_completed: body.is_completed || false,
          completed_at: body.is_completed ? new Date().toISOString() : null,
          bookmark_position: body.bookmark_position,
        },
      ], { 
        onConflict: 'student_id,lesson_id' 
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ progress: data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
