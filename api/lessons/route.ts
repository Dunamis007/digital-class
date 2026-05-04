import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

// GET: Get lessons for a course section
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sectionId = searchParams.get('section_id');

    if (!sectionId) {
      return NextResponse.json(
        { error: 'section_id is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseServer
      .from('lessons')
      .select('*')
      .eq('section_id', sectionId)
      .order('lesson_order', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ lessons: data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// POST: Create new lesson
export async function POST(request: NextRequest) {
  try {
    const auth = request.headers.get('Authorization');
    if (!auth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    const { data, error } = await supabaseServer
      .from('lessons')
      .insert([
        {
          section_id: body.section_id,
          title: body.title,
          content_type: body.content_type,
          video_url: body.video_url,
          document_url: body.document_url,
          text_content: body.text_content,
          code_snippet: body.code_snippet,
          duration_minutes: body.duration_minutes,
          lesson_order: body.lesson_order,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ lesson: data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
