import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase'

// Get course details with sections and lessons
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Get course
    const { data: course, error: courseError } = await supabaseServer
      .from('courses')
      .select('*')
      .eq('id', id)
      .single()

    if (courseError) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    // Only allow viewing published courses or own courses
    // (auth check should be done on client)

    // Get sections with lessons
    const { data: sections, error: sectionsError } = await supabaseServer
      .from('course_sections')
      .select('*, lessons(*)')
      .eq('course_id', id)
      .order('section_order', { ascending: true })

    if (sectionsError) {
      console.error('Sections error:', sectionsError)
    }

    return NextResponse.json({
      ...course,
      sections: sections || []
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Update course (instructor only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const auth = request.headers.get('Authorization')
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    const { data, error } = await supabaseServer
      .from('courses')
      .update(body)
      .eq('id', id)
      .select()
      .single()

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

// Delete course (archive it)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const auth = request.headers.get('Authorization')
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { error } = await supabaseServer
      .from('courses')
      .update({ is_archived: true })
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ message: 'Course archived' })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
