import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

// GET: Get questions for an assessment
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const assessmentId = searchParams.get('assessment_id');

    if (!assessmentId) {
      return NextResponse.json(
        { error: 'assessment_id is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseServer
      .from('questions')
      .select('*')
      .eq('assessment_id', assessmentId)
      .order('question_order', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ questions: data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// POST: Create new question
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
      .from('questions')
      .insert([
        {
          assessment_id: body.assessment_id,
          question_type: body.question_type,
          question_text: body.question_text,
          options: body.options,
          correct_answer: body.correct_answer,
          explanation: body.explanation,
          points: body.points || 1,
          question_order: body.question_order,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ question: data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
