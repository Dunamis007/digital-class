import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

// GET: Get assessments for a course
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('course_id');

    if (!courseId) {
      return NextResponse.json(
        { error: 'course_id is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseServer
      .from('assessments')
      .select('*')
      .eq('course_id', courseId)
      .eq('is_published', true);

    if (error) throw error;

    return NextResponse.json({ assessments: data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// POST: Create new assessment
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
      .from('assessments')
      .insert([
        {
          course_id: body.course_id,
          title: body.title,
          description: body.description,
          assessment_type: body.assessment_type,
          passing_score: body.passing_score || 70,
          total_points: body.total_points,
          attempts_allowed: body.attempts_allowed || 3,
          is_published: false,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ assessment: data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
