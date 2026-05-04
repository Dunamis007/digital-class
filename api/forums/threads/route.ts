import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// GET: Get discussion threads for a course
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('course_id');

    if (!courseId) {
      return NextResponse.json(
        { error: 'course_id is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('discussion_threads')
      .select('*, created_by:users(id, email, user_profiles(first_name, last_name))')
      .eq('course_id', courseId)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ threads: data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// POST: Create new thread
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

    const { data, error } = await supabase
      .from('discussion_threads')
      .insert([
        {
          course_id: body.course_id,
          created_by: user.id,
          title: body.title,
          description: body.description,
          is_pinned: false,
          is_locked: false,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ thread: data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
