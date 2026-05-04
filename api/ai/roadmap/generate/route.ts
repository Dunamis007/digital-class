/**
 * API Route: POST /api/ai/roadmap/generate
 * Generates personalized learning roadmap using Ollama AI
 * Stores result in database immediately for future reference
 *
 * This endpoint is called in the background after trial enrollment
 * Does not block the main enrollment flow
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase'
import { generateLearningRoadmap, formatRoadmapForStorage, isOllamaHealthy } from '@/lib/engines/OllamaBridge'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      enrollment_id,
      course_name,
      course_department,
      course_faculty,
      student_name,
    } = body

    // Validate required fields
    if (!enrollment_id || !course_name || !course_department || !course_faculty) {
      return NextResponse.json(
        {
          error: 'Missing required fields: enrollment_id, course_name, course_department, course_faculty',
        },
        { status: 400 }
      )
    }

    console.log('[Roadmap API] Generating roadmap for enrollment:', enrollment_id)
    console.log('[Roadmap API] Course:', course_name, 'Dept:', course_department, 'Faculty:', course_faculty)

    // Check if Ollama is healthy
    const ollamaHealthy = await isOllamaHealthy()
    if (!ollamaHealthy) {
      console.warn('[Roadmap API] Ollama service is not available, skipping roadmap generation')
      return NextResponse.json(
        {
          success: true,
          warning: 'Ollama service is not available. Roadmap generation skipped. Student can generate it later.',
          enrollment_id,
        },
        { status: 200 }
      )
    }

    // Generate roadmap using Ollama
    const roadmapText = await generateLearningRoadmap({
      courseName: course_name,
      courseDepartment: course_department,
      courseFaculty: course_faculty,
      studentName: student_name || 'Student',
    })

    // Format roadmap for database storage
    const formattedRoadmap = formatRoadmapForStorage(roadmapText)

    // Store roadmap in database
    const { error: updateError } = await supabaseServer
      .from('enrollments')
      .update({
        ai_roadmap: formattedRoadmap,
        roadmap_generated_at: new Date().toISOString(),
      })
      .eq('id', enrollment_id)

    if (updateError) {
      console.error('[Roadmap API] Failed to store roadmap:', updateError)
      return NextResponse.json(
        {
          error: 'Failed to store roadmap in database',
          details: updateError.message,
        },
        { status: 500 }
      )
    }

    console.log('[Roadmap API] Roadmap generated and stored successfully for enrollment:', enrollment_id)

    return NextResponse.json(
      {
        success: true,
        enrollment_id,
        roadmap: {
          generated_at: formattedRoadmap.generated_at,
          day_count: formattedRoadmap.day_count,
          days: formattedRoadmap.days,
        },
        message: 'Learning roadmap generated and stored successfully',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[Roadmap API] Error:', error)

    return NextResponse.json(
      {
        error: 'Failed to generate learning roadmap',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}

/**
 * GET endpoint to retrieve a stored roadmap
 * Useful for displaying roadmap on course page or player
 */
export async function GET(request: NextRequest) {
  try {
    const enrollment_id = request.nextUrl.searchParams.get('enrollment_id')

    if (!enrollment_id) {
      return NextResponse.json(
        { error: 'Missing enrollment_id query parameter' },
        { status: 400 }
      )
    }

    const { data: enrollment, error } = await supabaseServer
      .from('enrollments')
      .select('ai_roadmap, roadmap_generated_at')
      .eq('id', enrollment_id)
      .single()

    if (error || !enrollment) {
      return NextResponse.json(
        { error: 'Enrollment not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        enrollment_id,
        roadmap: enrollment.ai_roadmap,
        generated_at: enrollment.roadmap_generated_at,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[Roadmap API GET] Error:', error)

    return NextResponse.json(
      {
        error: 'Failed to retrieve roadmap',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
