import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'

// Submit assessment/quiz
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const auth = request.headers.get('Authorization')
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser(auth.replace('Bearer ', ''))

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { answers } = body

    // Get assessment and questions
    const { data: assessment, error: assessmentError } = await supabaseServer
      .from('assessments')
      .select('*, questions(*)')
      .eq('id', id)
      .single()

    if (assessmentError) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 })
    }

    // Auto-grade MCQ questions
    let score = 0
    let totalPoints = 0

    assessment.questions.forEach((q: any) => {
      totalPoints += q.points || 1

      if (q.question_type === 'mcq') {
        if (answers[q.id] === q.correct_answer) {
          score += q.points || 1
        }
      }
      // Short answers and essays require manual grading
    })

    // Save submission
    const { data: submission, error: submitError } = await supabaseServer
      .from('submissions')
      .insert([
        {
          student_id: user.id,
          assessment_id: id,
          answers,
          score,
          total_possible: totalPoints,
          is_graded: assessment.assessment_type === 'quiz' // Auto-graded quizzes
        }
      ])
      .select()
      .single()

    if (submitError) {
      return NextResponse.json({ error: submitError.message }, { status: 400 })
    }

    // Update user points if passing
    if (score >= assessment.passing_score) {
      const { data: stats } = await supabaseServer
        .from('user_stats')
        .select('id, total_points')
        .eq('user_id', user.id)
        .single()

      if (stats) {
        await supabaseServer
          .from('user_stats')
          .update({ total_points: (stats.total_points || 0) + 10 })
          .eq('id', stats.id)
      }
    }

    return NextResponse.json(submission, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
