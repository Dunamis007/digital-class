import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'

// Get user's enrollments
export async function GET(request: NextRequest) {
  try {
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

    const { data, error } = await supabaseServer
      .from('enrollments')
      .select('*, courses(*)')
      .eq('student_id', user.id)
      .order('enrolled_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Enroll in a course
export async function POST(request: NextRequest) {
  try {
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

    const { courseId } = await request.json()

    // Check if already enrolled
    const { data: existing } = await supabaseServer
      .from('enrollments')
      .select('id')
      .eq('student_id', user.id)
      .eq('course_id', courseId)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'Already enrolled in this course' },
        { status: 400 }
      )
    }

    // Create enrollment
    const { data, error } = await supabaseServer
      .from('enrollments')
      .insert([
        {
          student_id: user.id,
          course_id: courseId,
          enrollment_status: 'active',
          progress_percentage: 0
        }
      ])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Ensure user has stats record
    const { data: stats } = await supabaseServer
      .from('user_stats')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!stats) {
      await supabaseServer.from('user_stats').insert([
        {
          user_id: user.id,
          total_points: 0,
          total_badges: 0,
          courses_completed: 0,
          streak_days: 0
        }
      ])
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
