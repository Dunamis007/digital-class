import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// GET: Get posts for a thread
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { searchParams } = new URL(request.url);
    const threadId = searchParams.get('thread_id');

    if (!threadId) {
      return NextResponse.json(
        { error: 'thread_id is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('forum_posts')
      .select('*, author:users(id, email, user_profiles(first_name, last_name, avatar_url))')
      .eq('thread_id', threadId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ posts: data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// POST: Create new post
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
      .from('forum_posts')
      .insert([
        {
          thread_id: body.thread_id,
          author_id: user.id,
          content: body.content,
          is_answer: body.is_answer || false,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ post: data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
