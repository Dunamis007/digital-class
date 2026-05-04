import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { generateLessonContent, isOllamaHealthy } from '@/lib/engines/OllamaBridge'

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createClient(supabaseUrl, supabaseKey)
}

/**
 * POST /api/lessons/content/generate
 * Generates AI-powered lesson content via Ollama
 * Called when student clicks on a lesson in the course player
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      lesson_id,
      lesson_title,
      lesson_type,
      course_name,
      day_number,
      key_concept,
      student_level = 'beginner',
      enrollment_id,
    } = body

    // Validate required fields
    if (!lesson_id || !lesson_title || !lesson_type || !course_name || !day_number || !key_concept) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate lesson type
    if (!['video', 'reading', 'quiz', 'project'].includes(lesson_type)) {
      return NextResponse.json(
        { error: 'Invalid lesson type. Must be video, reading, quiz, or project' },
        { status: 400 }
      )
    }

    // Check if Ollama is healthy
    const isHealthy = await isOllamaHealthy()
    if (!isHealthy) {
      console.warn('[Lessons API] Ollama service is not healthy')
      // Return graceful fallback message
      return NextResponse.json(
        {
          success: false,
          content: generateFallbackContent(lesson_type, lesson_title),
          warning: 'AI service temporarily unavailable. Showing default content.',
        },
        { status: 200 }
      )
    }

    // Generate lesson content via Ollama
    console.log('[Lessons API] Generating content for:', lesson_title)
    const generatedContent = await generateLessonContent({
      lessonTitle: lesson_title,
      lessonType: lesson_type,
      courseName: course_name,
      dayNumber: day_number,
      keyConceptToTeach: key_concept,
      studentLevel: student_level,
    })

    // Store content in database
    const supabase = getSupabaseClient()
    const { error: insertError } = await supabase
      .from('lesson_contents')
      .insert([
        {
          lesson_id: lesson_id,
          content_markdown: generatedContent,
          generated_by: 'ollama',
          model_used: 'auto-detected',
          generation_prompt: `Generate ${lesson_type} content for: ${lesson_title}`,
          estimated_read_time_minutes: estimateReadTime(generatedContent),
        },
      ])

    if (insertError) {
      console.error('[Lessons API] Database insert error:', insertError)
      // Still return the content even if storage failed
    }

    // Update lesson content_generated flag
    await supabase
      .from('lessons')
      .update({ content_generated: true })
      .eq('id', lesson_id)

    // Track lesson progress
    if (enrollment_id) {
      await supabase
        .from('lesson_progress')
        .upsert([
          {
            lesson_id: lesson_id,
            enrollment_id: enrollment_id,
            last_accessed_at: new Date().toISOString(),
          },
        ],
        { onConflict: 'lesson_id, enrollment_id' }
      )
    }

    return NextResponse.json(
      {
        success: true,
        content: generatedContent,
        lesson_type: lesson_type,
        generated_at: new Date().toISOString(),
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[Lessons API] Error:', error)

    return NextResponse.json(
      {
        error: 'Failed to generate lesson content',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/lessons/content/generate?lesson_id=xxx
 * Retrieves previously generated lesson content
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const lessonId = searchParams.get('lesson_id')

    if (!lessonId) {
      return NextResponse.json(
        { error: 'Missing lesson_id parameter' },
        { status: 400 }
      )
    }

    let supabase
    try {
      supabase = getSupabaseClient()
    } catch {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      )
    }

    // Fetch existing content
    const { data, error } = await supabase
      .from('lesson_contents')
      .select('*')
      .eq('lesson_id', lessonId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error || !data) {
      return NextResponse.json(
        { error: 'No content found for this lesson' },
        { status: 404 }
      )
    }

    // Update view count and last viewed
    await supabase
      .from('lesson_contents')
      .update({
        view_count: (data.view_count || 0) + 1,
        last_viewed_at: new Date().toISOString(),
      })
      .eq('id', data.id)

    return NextResponse.json({
      success: true,
      content: data.content_markdown || data.content_html,
      lesson_id: lessonId,
      generated_at: data.created_at,
      view_count: data.view_count || 0,
    })
  } catch (error) {
    console.error('[Lessons API] GET Error:', error)

    return NextResponse.json(
      {
        error: 'Failed to retrieve lesson content',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}

/**
 * Generate fallback content when Ollama is unavailable
 * Provides meaningful placeholder content
 */
function generateFallbackContent(lessonType: string, lessonTitle: string): string {
  const fallbacks: Record<string, string> = {
    video: `# ${lessonTitle} - Video Lesson\n\nThis video lesson is currently being prepared. Please check back in a few moments, or proceed with the reading materials below.\n\n**What to expect:** A detailed video walkthrough explaining the key concepts with practical examples.\n\n**Preparation Tips:**\n- Have your notebook ready\n- Find a quiet space\n- Allow 30 minutes for viewing and notes`,

    reading: `# ${lessonTitle} - Reading Material\n\nWelcome to this lesson! The detailed reading material is being prepared.\n\n## Key Topics Covered\nThis lesson will cover the fundamental concepts you need to master this material.\n\n## What You'll Learn\n- Core concepts and definitions\n- Practical applications\n- Real-world examples relevant to Nigeria\n\n## How to Get the Most Out of This\n1. Read carefully\n2. Take notes\n3. Reflect on the questions\n4. Apply to your work`,

    quiz: `# ${lessonTitle} - Assessment Quiz\n\nYour interactive quiz is being prepared. This will include:\n\n**5 Multiple-Choice Questions**\n- Testing your understanding of key concepts\n- Practical application scenarios\n- Real-world decision-making\n\n**Feedback for Each Answer**\n- Explanations of correct answers\n- Learning points for incorrect choices\n\nPlease check back shortly when the quiz is ready!`,

    project: `# ${lessonTitle} - Practical Project\n\nYour hands-on project assignment is being prepared.\n\n## Project Overview\nYou'll complete a practical assignment that reinforces what you've learned.\n\n## What To Prepare\n- Required tools and resources\n- Time allocation (typically 1-2 hours)\n- Submission format\n\n**Come back shortly for the complete project brief and step-by-step guide!**`,
  }

  return fallbacks[lessonType] || fallbacks.reading
}

/**
 * Estimate reading time in minutes based on word count
 * Assumes 200 words per minute reading speed
 */
function estimateReadTime(content: string): number {
  const wordCount = content.split(/\s+/).length
  const readTimeMinutes = Math.ceil(wordCount / 200)
  return Math.max(5, Math.min(readTimeMinutes, 60)) // Between 5 and 60 minutes
}
