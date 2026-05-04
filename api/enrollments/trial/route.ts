import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase'

// Create trial enrollment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      user_id,
      course_id,
      course_title,
      course_code,
    } = body

    if (!user_id || !course_id || !course_title) {
      return NextResponse.json(
        { error: 'Missing required fields: user_id, course_id, course_title' },
        { status: 400 }
      )
    }

    const now = new Date()
    const trialEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // +7 days

    // Check if already enrolled
    const { data: existing } = await supabaseServer
      .from('enrollments')
      .select('id')
      .eq('student_id', user_id)
      .eq('course_id', course_id)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'Already enrolled in this course' },
        { status: 400 }
      )
    }

    // Create trial enrollment record
    const { data: enrollment, error: enrollmentError } = await supabaseServer
      .from('enrollments')
      .insert([
        {
          student_id: user_id,
          course_id: course_id,
          enrollment_status: 'trial_active',
          progress_percentage: 0,
          trial_start: now.toISOString(),
          trial_end: trialEnd.toISOString(),
          enrolled_at: now.toISOString(),
        }
      ])
      .select()
      .single()

    if (enrollmentError) {
      console.error('Trial enrollment error:', enrollmentError)
      return NextResponse.json(
        { error: 'Failed to create trial enrollment' },
        { status: 500 }
      )
    }

    // Award 15 tokens for starting trial
    const { error: tokenError } = await supabaseServer
      .from('token_transactions')
      .insert([
        {
          user_id: user_id,
          amount: 15,
          type: 'earn',
          description: 'Trial enrollment bonus - You started your learning journey!',
          category: 'Trial',
          reference_type: 'enrollment',
          reference_id: enrollment.id,
          created_at: now.toISOString(),
        }
      ])

    if (tokenError) {
      console.error('Token award error:', tokenError)
      // Don't fail the whole request if token award fails
    }

    // Update user token balance
    await supabaseServer
      .from('student_profiles')
      .update({
        current_tokens: supabaseServer.rpc('increment_tokens', { 
          user_id_param: user_id, 
          amount_param: 15 
        }),
      })
      .eq('user_id', user_id)

    // Create Bursary office notification
    await supabaseServer
      .from('bot_messages')
      .insert([
        {
          user_id: user_id,
          bot_id: 'mama_token',
          direction: 'outbound',
          content: `Congratulations! You earned 15 tokens for beginning your learning journey with "${course_title}". Your tokens are your wealth, baby! Manage them well well!`,
          message_type: 'notification',
          metadata: {
            token_amount: 15,
            course_title: course_title,
            course_code: course_code,
          },
          created_at: now.toISOString(),
        }
      ])

    // Create Academic Scheduling Unit notification
    await supabaseServer
      .from('bot_messages')
      .insert([
        {
          user_id: user_id,
          bot_id: 'mr_timekeeper',
          direction: 'outbound',
          content: `Your 7-day trial for "${course_title}" has been activated! Time is precious, my brother! Your trial started at ${now.toLocaleTimeString()} and expires on ${trialEnd.toLocaleDateString('en-NG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}. Don't waste a minute!`,
          message_type: 'notification',
          metadata: {
            trial_start: now.toISOString(),
            trial_end: trialEnd.toISOString(),
            course_title: course_title,
          },
          created_at: now.toISOString(),
        }
      ])

    // Trigger AI roadmap generation in the background (non-blocking)
    // This runs asynchronously and doesn't block the response
    const roadmapPayload = {
      enrollment_id: enrollment.id,
      course_name: course_title,
      course_department: body.course_department || 'General',
      course_faculty: body.course_faculty || 'General',
      student_name: body.student_name,
    }

    // Fire and forget - call the roadmap generation API without awaiting
    fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/ai/roadmap/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(roadmapPayload),
    }).catch(error => {
      console.error('Background roadmap generation failed:', error)
      // Silently fail - don't block the enrollment process
    })

    return NextResponse.json({
      success: true,
      enrollment: {
        id: enrollment.id,
        course_id: course_id,
        course_title: course_title,
        status: 'trial_active',
        progress: 0,
        trial_start: now.toISOString(),
        trial_end: trialEnd.toISOString(),
      },
      tokens_awarded: 15,
      message: 'Trial activated successfully!',
    }, { status: 201 })

  } catch (error) {
    console.error('Trial enrollment API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

// Check trial status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')
    const courseId = searchParams.get('course_id')

    if (!userId) {
      return NextResponse.json(
        { error: 'user_id is required' },
        { status: 400 }
      )
    }

    let query = supabaseServer
      .from('enrollments')
      .select('*')
      .eq('student_id', userId)
      .eq('enrollment_status', 'trial_active')

    if (courseId) {
      query = query.eq('course_id', courseId)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Check if any trials have expired
    const now = new Date()
    const activeTrials = data?.filter(enrollment => {
      if (enrollment.trial_end) {
        const trialEnd = new Date(enrollment.trial_end)
        return trialEnd > now
      }
      return true
    }) || []

    // Update expired trials in background
    const expiredTrials = data?.filter(enrollment => {
      if (enrollment.trial_end) {
        const trialEnd = new Date(enrollment.trial_end)
        return trialEnd <= now
      }
      return false
    }) || []

    if (expiredTrials.length > 0) {
      // Mark expired trials
      await supabaseServer
        .from('enrollments')
        .update({ enrollment_status: 'trial_expired' })
        .in('id', expiredTrials.map(e => e.id))
    }

    return NextResponse.json({
      success: true,
      active_trials: activeTrials,
      expired_trials: expiredTrials.length,
    })

  } catch (error) {
    console.error('Trial check API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
